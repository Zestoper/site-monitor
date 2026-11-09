// 백엔드 API 전체 점검: /openapi.json 에서 API 목록을 읽어 조회용(GET) API를 하나씩 불러본다.
// 저장 · 삭제 · 결제처럼 데이터가 바뀌는 API(POST · PUT · DELETE)는 부르지 않는다.
// 실행: node api-check.mjs
import { config, stamp, sleep, wakeBackend, call, apiLogin, saveReport, setOutput } from './common.mjs'

const SLOW_MS = 10_000
const exclude = (config.apiExclude || []).map(p => new RegExp(p))

// 필수 쿼리 값 채우기: sites.json 의 params 에 있으면 그 값, 없으면 이 API는 건너뜀
function buildQuery(op, site) {
  const qs = new URLSearchParams()
  for (const p of op.parameters || []) {
    if (p.in !== 'query' || !p.required) continue
    const v = site.api?.params?.[p.name]
    if (v === undefined) return null
    qs.set(p.name, v)
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

const results = []
for (const site of config.sites.filter(s => s.api)) {
  console.log(`▶ ${site.name}`)
  const r = { site: site.name, backend: site.backend, checked: [], skipped: [], issues: [], warnings: [] }
  results.push(r)

  r.wake = await wakeBackend(site.health)
  if (!r.wake.ok) { r.issues.push({ path: site.health, detail: '서버가 2분 안에 깨어나지 않음' }); continue }

  const auth = await apiLogin(site)
  r.auth = auth.tried ? (auth.ok ? '성공' : `실패 (${auth.error})`) : '계정 없음'
  if (auth.tried && !auth.ok) r.issues.push({ path: site.api.login.path, detail: `테스트 계정 로그인 실패: ${auth.error}` })

  const spec = await call(site.backend, '/openapi.json')
  if (!spec.json?.paths) { r.issues.push({ path: '/openapi.json', detail: `API 목록을 못 읽음 (HTTP ${spec.status})` }); continue }

  for (const [path, ops] of Object.entries(spec.json.paths)) {
    const op = ops.get
    if (!op) continue
    if (path.includes('{')) { r.skipped.push(`${path} (경로 값 필요)`); continue }
    if (exclude.some(re => re.test(path))) { r.skipped.push(`${path} (제외 목록)`); continue }
    const query = buildQuery(op, site)
    if (query === null) { r.skipped.push(`${path} (필수 값 모름)`); continue }

    let res = await call(site.backend, path + query, { token: auth.token, timeout: 45_000 })
    // 5xx · 연결 실패면 5초 뒤 한 번 더: 두 번째에 되면 '첫 요청만 실패'로 따로 기록
    // (오늘 ClearWay 처럼 DB 연결이 끊겨 첫 요청만 500 나는 문제를 잡기 위함)
    if (res.status >= 500 || res.status === 0) {
      const first = res
      await sleep(5_000)
      res = await call(site.backend, path + query, { token: auth.token, timeout: 45_000 })
      if (res.status > 0 && res.status < 500) {
        r.warnings.push({ path, detail: `첫 요청만 실패 (${first.status || first.error}) → 다시 하니 ${res.status}` })
      }
    }
    r.checked.push({ path, status: res.status, ms: res.ms })
    if (res.status >= 500 || res.status === 0) {
      const why = res.error || (res.json?.detail ?? res.text ?? '').toString().replace(/\s+/g, ' ').slice(0, 120)
      r.issues.push({ path: path + query, detail: `HTTP ${res.status || '-'} ${why}` })
    } else if (res.ms > SLOW_MS) {
      r.warnings.push({ path, detail: `느림 ${(res.ms / 1000).toFixed(1)}초` })
    }
    await sleep(300) // 무료 서버에 몰아서 보내지 않도록
  }
  console.log(`  확인 ${r.checked.length}개 · 문제 ${r.issues.length} · 주의 ${r.warnings.length} · 건너뜀 ${r.skipped.length}`)
}

// ── 리포트 ──────────────────────────────────────────────────────
const total = results.reduce((n, r) => n + r.issues.length, 0)
const warns = results.reduce((n, r) => n + r.warnings.length, 0)
let md = `# API 전체 점검 (${stamp} KST)\n\n`
md += total ? `**문제 ${total}건** · 주의 ${warns}건\n\n` : `**문제 없음** ✅ · 주의 ${warns}건\n\n`
md += `| 사이트 | 결과 | 확인한 API | 주의 | 건너뜀 | 로그인 |\n|---|---|---|---|---|---|\n`
for (const r of results) {
  md += `| ${r.site} | ${r.issues.length ? `❌ ${r.issues.length}건` : '✅'} | ${r.checked.length}개 | ${r.warnings.length} | ${r.skipped.length} | ${r.auth ?? '-'} |\n`
}
for (const r of results.filter(r => r.issues.length || r.warnings.length)) {
  md += `\n## ${r.site}\n${r.backend}\n\n`
  for (const i of r.issues) md += `- ❌ \`${i.path}\` ${i.detail.replace(/\|/g, '\\|')}\n`
  for (const w of r.warnings) md += `- ⚠️ \`${w.path}\` ${w.detail}\n`
}
md += `\n<details><summary>건너뛴 API 목록</summary>\n\n`
for (const r of results) if (r.skipped.length) md += `**${r.site}**: ${r.skipped.join(' · ')}\n\n`
md += `</details>\n`

const file = await saveReport('API', md, results)
await setOutput('api_issues', total)
console.log(`\n총 문제 ${total}건 · 주의 ${warns}건 → ${file}`)
