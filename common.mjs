// api-check.mjs · scenarios.mjs 가 같이 쓰는 도구 모음
import fs from 'node:fs/promises'

export const config = JSON.parse(
  await fs.readFile(process.env.SITES_FILE || new URL('./sites.json', import.meta.url), 'utf8'),
)

const kst = new Date(Date.now() + 9 * 3600_000)
export const stamp = kst.toISOString().slice(0, 16).replace('T', ' ')
export const day = kst.toISOString().slice(2, 10)                      // 26-11-09
export const hhmm = kst.toISOString().slice(11, 16).replace(':', '-')   // 07-13

export const sleep = ms => new Promise(r => setTimeout(r, ms))

// GitHub Secrets 에 등록한 테스트 계정 (예: GAJEON_EMAIL / GAJEON_PASSWORD)
export function credentials(site) {
  const p = site.id.toUpperCase()
  const id = process.env[`${p}_EMAIL`]
  const password = process.env[`${p}_PASSWORD`]
  return id && password ? { id, password } : null
}

// Render 무료 서버는 첫 요청에 30~60초 걸리므로 응답이 올 때까지 기다린다
export async function wakeBackend(url, timeout = 120_000) {
  if (!url) return { ok: true, ms: 0 }
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(60_000) })
      if (r.status < 500) return { ok: true, ms: Date.now() - start }
    } catch { /* 아직 깨는 중 */ }
    await sleep(5_000)
  }
  return { ok: false, ms: Date.now() - start }
}

// 요청 하나 보내고 상태 · 걸린 시간 · 본문을 돌려준다 (예외 대신 결과로)
export async function call(base, path, { token, method = 'GET', body, form, timeout = 60_000 } = {}) {
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  let payload
  if (form) payload = form
  else if (body !== undefined) { headers['Content-Type'] = 'application/json'; payload = JSON.stringify(body) }
  const start = Date.now()
  try {
    const r = await fetch(base + path, { method, headers, body: payload, signal: AbortSignal.timeout(timeout) })
    const text = await r.text()
    let json = null
    try { json = JSON.parse(text) } catch { /* HTML 등 */ }
    return { status: r.status, ms: Date.now() - start, json, text }
  } catch (e) {
    return { status: 0, ms: Date.now() - start, error: e.name === 'TimeoutError' ? `${timeout / 1000}초 시간 초과` : e.message }
  }
}

// API 로그인 → 토큰
export async function apiLogin(site) {
  const cred = credentials(site)
  const l = site.api?.login
  if (!cred || !l) return { tried: false }
  const r = await call(site.backend, l.path, { method: 'POST', body: { [l.idField]: cred.id, password: cred.password } })
  const token = r.json?.[l.tokenKey]
  if (token) return { tried: true, ok: true, token }
  return { tried: true, ok: false, error: `HTTP ${r.status} ${r.error || (r.json?.detail ?? '').toString().slice(0, 80)}` }
}

// reports/26-11-09/<이름>_07-13.md 와 reports/latest-<이름>.md 로 저장
export async function saveReport(name, md, data) {
  const dir = `reports/${day}`
  await fs.mkdir(dir, { recursive: true })
  await fs.writeFile(`${dir}/${name}_${hhmm}.md`, md)
  await fs.writeFile(`${dir}/${name}_${hhmm}.json`, JSON.stringify(data, null, 2))
  await fs.writeFile(`reports/latest-${name}.md`, md)
  return `${dir}/${name}_${hhmm}.md`
}

export async function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `${key}=${value}\n`)
}
