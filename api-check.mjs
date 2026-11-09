// 백엔드 API 전체 점검: /openapi.json 에서 API 목록을 읽어 조회용(GET) API를 하나씩 불러본다.
// 저장 · 삭제 · 결제처럼 데이터가 바뀌는 API(POST · PUT · DELETE)는 부르지 않는다.
// 실행: node api-check.mjs
import { config, stamp, sleep, wakeBackend, call, apiLogin, saveReport, setOutput } from './common.mjs'

const SLOW_MS = 10_000
const exclude = (config.apiExclude || []).map(p => new RegExp(p))

// sites.json 값 중 "$today" 는 오늘 날짜(KST)로 바꾼다
const special = v => (v === '$today' ? new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10) : v)

// 필수 쿼리 값 채우기: sites.json 의 params 에 있으면 그 값, 없으면 이 API는 건너뜀
function buildQuery(op, site) {
  const qs = new URLSearchParams()
  for (const p of op.parameters || []) {
    if (p.in !== 'query' || !p.required) continue
    const v = site.api?.params?.[p.name]
    if (v === undefined) return null
    qs.set(p.name, special(v))
  }
  const s = qs.toString()
  return s ? `?${s}` : ''
}

// 응답에서 첫 번째 항목 꺼내기: 배열이면 [0], 객체면 안에 있는 첫 배열의 [0]
function firstItem(json) {
  if (Array.isArray(json)) return json[0]
  if (json && typeof json === 'object') {
    for (const v of Object.values(json)) if (Array.isArray(v) && v.length && typeof v[0] === 'object') return v[0]
  }
  return undefined
}

// /api/diary/{diary_id} 같은 주소의 {값}을 채운다
//  1) sites.json 의 pathValues 에 있으면 그 값
//  2) 바로 앞 목록 API(/api/diary/ · /api/diary)의 응답 첫 항목에서 같은 이름 → id 순서로 찾기
function fillPath(path, site, responses) {
  let filled = path
  for (const m of path.matchAll(/\{([^}]+)\}/g)) {
    const name = m[1]
    let value = site.api?.pathValues?.[name]
    if (value === undefined) {
      const parent = path.slice(0, m.index).replace(/\/$/, '')
      // 목록 주소가 /me · /public · /mine 으로 따로 있는 경우도 찾아본다
      const item = ['', '/', '/me', '/public', '/mine']
        .map(suffix => firstItem(responses.get(parent + suffix)))
        .find(x => x !== undefined)
      const short = name.replace(/_id$/, '')
      value = item?.[name] ?? item?.id ?? item?.[`${short}Id`] ?? item?.[short]
    }
    if (value === undefined || value === null || typeof value === 'object') return null
    filled = filled.replace(m[0], encodeURIComponent(String(value)))
  }
  return filled
}

// ── 최신성 점검 ─────────────────────────────────────────────────
// 백그라운드 수집이 멈춰도 예전 데이터는 잘 보여서 에러가 안 난다 → '마지막으로 언제 들어왔는지'를 본다
const HOUR = 3600_000
const kstToday = () => new Date(Date.now() + 9 * HOUR).toISOString().slice(0, 10)
const daysAgo = ymd => Math.round((Date.parse(kstToday()) - Date.parse(ymd)) / (24 * HOUR))
const ymd8 = s => `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`  // 20261108 → 2026-11-08

const freshness = {
  // 가전무쌍: 매일 새벽 가격 · 기상청 · 에어코리아 수집
  async gajeon(site, token) {
    const out = []
    const pm = await call(site.backend, '/api/b2b/price-monitor', { token, timeout: 90_000 })
    const dates = (pm.json?.categories || []).filter(c => !c.realtime).map(c => c.last_updated).sort()
    if (pm.status === 401 || pm.status === 403) out.push({ name: '가격 수집', bad: false, detail: 'B2B 계정이 아니라 확인 못 함' })
    else if (!dates.length) out.push({ name: '가격 수집', bad: true, detail: `가격 이력을 못 읽음 (HTTP ${pm.status})` })
    else {
      const d = daysAgo(dates.at(-1))
      out.push({ name: '가격 수집', bad: d >= 2, detail: `마지막 ${dates.at(-1)} (${d}일 전)` })
    }
    const st = await call(site.backend, '/api/b2b/public-data-status', { token })
    if (st.status === 401 || st.status === 403) {
      out.push({ name: '공공데이터 수집', bad: false, detail: '관리자 계정이 아니라 확인 못 함' })
      return out
    }
    for (const [key, name, limit] of [['ext:kma:history', '기상청 날씨', 3], ['ext:airkorea:history', '에어코리아 미세먼지', 2]]) {
      const last = st.json?.[key]?.last
      if (!last) { out.push({ name, bad: true, detail: `데이터 없음 (HTTP ${st.status})` }); continue }
      const d = daysAgo(ymd8(last))
      out.push({ name, bad: d >= limit, detail: `마지막 ${ymd8(last)} (${d}일 전)` })
    }
    return out
  },
  // NewsDeliver: 2시간마다 뉴스 수집 → 가장 최근 기사가 너무 오래됐으면 문제
  async newsdeliver(site, token) {
    const out = []
    for (const [path, name, limitH] of [['/api/v1/news', '국내 뉴스 수집', 6], ['/api/v1/global-news', '해외 뉴스 수집', 12]]) {
      const r = await call(site.backend, path, { token })
      const t = r.json?.news_items?.[0]?.created_at
      if (!t) { out.push({ name, bad: true, detail: `기사를 못 읽음 (HTTP ${r.status})` }); continue }
      // DB 시각에 시간대가 없으면 UTC로 본다 (서버 DB가 UTC)
      const at = Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : t + 'Z')
      const h = Math.max(0, (Date.now() - at) / HOUR)
      out.push({ name, bad: h >= limitH, detail: `가장 최근 기사 ${h.toFixed(1)}시간 전` })
    }
    return out
  },
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

  // 목록 API를 먼저 부르고 그 응답의 ID로 상세 API({id})를 채워야 해서 {} 없는 주소부터 돈다
  const gets = Object.entries(spec.json.paths).filter(([, ops]) => ops.get)
  gets.sort(([a], [b]) => a.includes('{') - b.includes('{'))
  const responses = new Map()

  for (const [path, ops] of gets) {
    const op = ops.get
    if (exclude.some(re => re.test(path))) { r.skipped.push(`${path} (제외 목록)`); continue }
    let url = path
    if (path.includes('{')) {
      url = fillPath(path, site, responses)
      if (url === null) { r.skipped.push(`${path} (경로 값 못 찾음)`); continue }
    }
    const query = buildQuery(op, site)
    if (query === null) { r.skipped.push(`${path} (필수 값 모름)`); continue }

    let res = await call(site.backend, url + query, { token: auth.token, timeout: 45_000 })
    if (res.status === 200 && res.json) responses.set(path, res.json)
    // 5xx · 연결 실패면 5초 뒤 한 번 더: 두 번째에 되면 '첫 요청만 실패'로 따로 기록
    // (오늘 ClearWay 처럼 DB 연결이 끊겨 첫 요청만 500 나는 문제를 잡기 위함)
    if (res.status >= 500 || res.status === 0) {
      const first = res
      await sleep(5_000)
      res = await call(site.backend, url + query, { token: auth.token, timeout: 45_000 })
      if (res.status > 0 && res.status < 500) {
        r.warnings.push({ path, detail: `첫 요청만 실패 (${first.status || first.error}) → 다시 하니 ${res.status}` })
      }
    }
    r.checked.push({ path, status: res.status, ms: res.ms })
    if (res.status >= 500 || res.status === 0) {
      const why = res.error || (res.json?.detail ?? res.text ?? '').toString().replace(/\s+/g, ' ').slice(0, 120)
      r.issues.push({ path: url + query, detail: `HTTP ${res.status || '-'} ${why}` })
    } else if (res.ms > SLOW_MS) {
      r.warnings.push({ path, detail: `느림 ${(res.ms / 1000).toFixed(1)}초` })
    }
    await sleep(300) // 무료 서버에 몰아서 보내지 않도록
  }

  if (freshness[site.id]) {
    try {
      r.fresh = await freshness[site.id](site, auth.token)
      for (const f of r.fresh) if (f.bad) r.issues.push({ path: f.name, detail: `데이터가 오래됨: ${f.detail}` })
    } catch (e) {
      r.issues.push({ path: '최신성 점검', detail: e.message })
    }
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
const freshRows = results.filter(r => r.fresh?.length)
if (freshRows.length) {
  md += `\n## 데이터 최신성\n\n| 사이트 | 항목 | 상태 |\n|---|---|---|\n`
  for (const r of freshRows) for (const f of r.fresh) md += `| ${r.site} | ${f.name} | ${f.bad ? '❌' : '✅'} ${f.detail} |\n`
}
md += `\n<details><summary>건너뛴 API 목록</summary>\n\n`
for (const r of results) if (r.skipped.length) md += `**${r.site}**: ${r.skipped.join(' · ')}\n\n`
md += `</details>\n`

const file = await saveReport('API', md, results)
await setOutput('api_issues', total)
console.log(`\n총 문제 ${total}건 · 주의 ${warns}건 → ${file}`)
