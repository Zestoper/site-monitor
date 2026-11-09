// 배포한 사이트를 돌면서 오류를 찾아 reports/ 에 마크다운으로 저장한다.
// 실행: node check.mjs   (GitHub Actions에서 매일 실행)
import { chromium } from 'playwright'
import fs from 'node:fs/promises'

const config = JSON.parse(await fs.readFile(process.env.SITES_FILE || new URL('./sites.json', import.meta.url), 'utf8'))
const PAGE_TIMEOUT = 60_000        // 페이지 하나 최대 대기
const SLOW_MS = 15_000             // 이보다 오래 걸리면 '느림'으로 기록
const WAKE_TIMEOUT = 120_000       // Render 무료 서버가 깨어나길 기다리는 최대 시간
const RETRY_WAIT = 10_000         // 문제가 나온 페이지를 다시 확인하기 전 대기

// 화면에 찍히면 안 되는 글자 (계산 · 렌더링 버그 흔적)
const WEIRD_TEXT = [
  { re: /\bNaN\b/, label: 'NaN' },
  { re: /\bundefined\b/, label: 'undefined' },
  { re: /\[object Object\]/, label: '[object Object]' },
  { re: /\bInfinity\b/, label: 'Infinity' },
  { re: /\+-\d/, label: '+- 부호 겹침' },
  { re: /\bnull\s*원/, label: 'null원' },
]

const now = new Date()
const kst = new Date(now.getTime() + 9 * 3600_000)
const stamp = kst.toISOString().slice(0, 16).replace('T', ' ')
const day = kst.toISOString().slice(2, 10)               // 26-11-09 (날짜별 폴더 이름)
const hhmm = kst.toISOString().slice(11, 16).replace(':', '-') // 07-13 (하루에 여러 번 돌면 시각으로 구분)

// Render 서버 깨우기: 첫 요청이 30~60초 걸리므로 응답이 올 때까지 기다린다
async function wakeBackend(url) {
  if (!url) return { ok: true, ms: 0, skipped: true }
  const start = Date.now()
  while (Date.now() - start < WAKE_TIMEOUT) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) })
      if (r.status < 500) return { ok: true, ms: Date.now() - start, status: r.status }
    } catch { /* 아직 깨는 중 */ }
    await new Promise(r => setTimeout(r, 5_000))
  }
  return { ok: false, ms: Date.now() - start }
}

function isIgnored(text, site) {
  const list = [...(config.ignore || []), ...(site.ignore || [])]
  return list.some(p => text.includes(p))
}

// 사이트에 로그인 (테스트 계정이 Secrets에 있을 때만)
async function login(page, site) {
  const prefix = site.id.toUpperCase()
  const email = process.env[`${prefix}_EMAIL`]
  const password = process.env[`${prefix}_PASSWORD`]
  if (!site.login || !email || !password) return { tried: false }
  const l = site.login
  try {
    await page.goto(site.url + l.path, { waitUntil: 'networkidle', timeout: PAGE_TIMEOUT })
    // 사이트마다 입력칸 모양이 달라서 넓게 찾고 sites.json 의 login.email 로 바꿀 수 있게 한다
    await page.locator(l.email || 'input[type="email"], input[name="email"], input[placeholder*="이메일"]').first().fill(email)
    const pw = page.locator(l.password || 'input[type="password"]').first()
    await pw.fill(password)
    // 제출 버튼 모양도 제각각이라 비밀번호 칸에서 Enter 로 제출한다
    if (l.submit) await page.click(l.submit)
    else await pw.press('Enter')
    // 로그인 요청은 서버에서 비밀번호 확인에 몇 초 걸린다 → 로그인 화면을 벗어날 때까지 최대 30초 기다린다
    const leftLogin = timeout => page.waitForURL(u => new URL(u).pathname !== l.path, { timeout })
    try {
      try {
        await leftLogin(8_000)
      } catch {
        // Enter 로 제출이 안 되는 화면이면 로그인 버튼을 직접 누른다
        await page.locator('button[type="submit"], form button').first().click({ timeout: 5_000 }).catch(() => {})
        await leftLogin(25_000)
      }
    } catch {
      const msg = (await page.innerText('body').catch(() => '')).match(/[^\n]*(올바르지|틀렸|오류|실패|확인해)[^\n]*/)?.[0]
      return { tried: true, ok: false, error: msg ? `화면 메시지: ${msg.trim().slice(0, 80)}` : undefined }
    }
    await page.waitForLoadState('networkidle', { timeout: PAGE_TIMEOUT }).catch(() => {})
    return { tried: true, ok: true }
  } catch (e) {
    return { tried: true, ok: false, error: e.message.split('\n')[0] }
  }
}

async function checkPage(page, site, path) {
  const issues = []
  const hosts = [new URL(site.url).host, site.backend && new URL(site.backend).host].filter(Boolean)
  const onConsole = msg => {
    if (msg.type() === 'error' && !isIgnored(msg.text(), site)) issues.push({ type: '콘솔 에러', detail: msg.text().slice(0, 300) })
  }
  const onPageError = err => {
    if (!isIgnored(err.message, site)) issues.push({ type: 'JS 예외', detail: err.message.split('\n')[0].slice(0, 300) })
  }
  const onResponse = res => {
    const u = new URL(res.url())
    if (!hosts.includes(u.host) || res.status() < 400) return
    const text = `${res.status()} ${u.pathname}`
    if (!isIgnored(text, site)) issues.push({ type: 'API/리소스 실패', detail: `${res.request().method()} ${text}` })
  }
  const onFailed = req => {
    const u = new URL(req.url())
    if (!hosts.includes(u.host)) return
    const err = req.failure()?.errorText || ''
    if (err.includes('ERR_ABORTED')) return // 페이지 이동으로 취소된 요청
    if (!isIgnored(u.pathname, site)) issues.push({ type: '요청 실패', detail: `${req.method()} ${u.pathname} (${err})` })
  }
  page.on('console', onConsole)
  page.on('pageerror', onPageError)
  page.on('response', onResponse)
  page.on('requestfailed', onFailed)

  const start = Date.now()
  let status = null
  try {
    const res = await page.goto(site.url + path, { waitUntil: 'networkidle', timeout: PAGE_TIMEOUT })
    status = res?.status() ?? null
    if (status && status >= 400) issues.push({ type: '페이지 응답', detail: `HTTP ${status}` })
  } catch (e) {
    issues.push({ type: '페이지 열기 실패', detail: e.message.split('\n')[0] })
  }
  await page.waitForTimeout(1_500) // 늦게 그려지는 화면 대기
  const ms = Date.now() - start
  if (ms > SLOW_MS) issues.push({ type: '느림', detail: `${(ms / 1000).toFixed(1)}초` })

  const body = await page.innerText('body').catch(() => '')
  if (body.trim().length < 15) issues.push({ type: '빈 화면', detail: `본문 글자 ${body.trim().length}자` })
  for (const w of WEIRD_TEXT) {
    const m = body.match(w.re)
    if (m) {
      const i = m.index
      issues.push({ type: '이상한 글자', detail: `${w.label} → "…${body.slice(Math.max(0, i - 25), i + 25).replace(/\s+/g, ' ')}…"` })
    }
  }
  for (const t of site.mustContain?.[path] || []) {
    if (!body.includes(t)) issues.push({ type: '필수 문구 없음', detail: `"${t}"` })
  }

  page.off('console', onConsole)
  page.off('pageerror', onPageError)
  page.off('response', onResponse)
  page.off('requestfailed', onFailed)
  return { path, status, ms, issues }
}

const browser = await chromium.launch()
const results = []
for (const site of config.sites) {
  console.log(`▶ ${site.name}`)
  const wake = await wakeBackend(site.health)
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'ko-KR' })
  const page = await ctx.newPage()
  // 문제가 나오면 10초 뒤 한 번 더 확인해서 그때도 문제일 때만 기록한다
  // (Render 서버가 막 깨어난 직후의 일시적인 실패 · 느림을 걸러내기 위함)
  const checkTwice = async p => {
    const first = await checkPage(page, site, p)
    if (!first.issues.length) return first
    await page.waitForTimeout(RETRY_WAIT)
    const second = await checkPage(page, site, p)
    return { ...second, retried: true }
  }
  const pages = []
  for (const p of site.pages) pages.push(await checkTwice(p))
  const auth = await login(page, site)
  if (auth.ok) for (const p of site.authPages || []) pages.push(await checkTwice(p))
  await ctx.close()
  const count = pages.reduce((n, p) => n + p.issues.length, 0) + (wake.ok ? 0 : 1) + (auth.tried && !auth.ok ? 1 : 0)
  results.push({ site, wake, auth, pages, count })
  console.log(`  문제 ${count}건`)
}
await browser.close()

// ── 마크다운 리포트 ──────────────────────────────────────────────
const total = results.reduce((n, r) => n + r.count, 0)
let md = `# 사이트 점검 리포트 (${stamp} KST)\n\n`
md += total ? `**문제 ${total}건 발견**\n\n` : `**문제 없음** ✅\n\n`
md += `| 사이트 | 결과 | 서버 깨우기 | 로그인 |\n|---|---|---|---|\n`
for (const r of results) {
  const wake = r.wake.skipped ? '-' : r.wake.ok ? `${(r.wake.ms / 1000).toFixed(0)}초` : '❌ 실패'
  const auth = !r.auth.tried ? '건너뜀' : r.auth.ok ? '성공' : '❌ 실패'
  md += `| ${r.site.name} | ${r.count ? `❌ ${r.count}건` : '✅'} | ${wake} | ${auth} |\n`
}
for (const r of results.filter(r => r.count)) {
  md += `\n## ${r.site.name}\n${r.site.url}\n\n`
  if (!r.wake.ok) md += `- **서버 깨우기 실패**: ${r.site.health} 가 ${WAKE_TIMEOUT / 1000}초 안에 응답하지 않음\n`
  if (r.auth.tried && !r.auth.ok) md += `- **로그인 실패**${r.auth.error ? `: ${r.auth.error}` : ' (로그인 화면에서 넘어가지 않음)'}\n`
  for (const p of r.pages.filter(p => p.issues.length)) {
    md += `\n### \`${p.path}\` (${(p.ms / 1000).toFixed(1)}초 · 두 번 확인)\n`
    for (const i of p.issues) md += `- **${i.type}**: ${i.detail.replace(/\|/g, '\\|')}\n`
  }
}

// reports/26-11-09/점검_07-13.md 처럼 날짜 폴더에 시각별로 저장하고
// 가장 최근 결과는 reports/latest.md 에도 남긴다 (이슈 본문 · 빠른 확인용)
const dir = `reports/${day}`
await fs.mkdir(dir, { recursive: true })
const json = JSON.stringify({ stamp, total, results: results.map(r => ({ ...r, site: r.site.name })) }, null, 2)
await fs.writeFile(`${dir}/점검_${hhmm}.md`, md)
await fs.writeFile(`${dir}/점검_${hhmm}.json`, json)
await fs.writeFile('reports/latest.md', md)
await fs.writeFile('reports/latest.json', json)
if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `issues=${total}\n`)
console.log(`\n총 문제 ${total}건 → ${dir}/점검_${hhmm}.md`)
