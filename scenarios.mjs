// 기능 시나리오 점검: 사람이 쓰는 순서대로 핵심 기능을 실제로 돌려본다.
// AI를 실제로 부르므로 주 1회만 돌린다. 만든 테스트 데이터(일기 · 문서 · 대화)는 끝에 지운다.
// 실행: node scenarios.mjs            (전체)
//       node scenarios.mjs moodiary   (한 사이트만)
import { config, stamp, wakeBackend, call, apiLogin, saveReport, setOutput } from './common.mjs'

const WEIRD = /\bNaN\b|\bundefined\b|\[object Object\]|\bInfinity\b|\+-\d/

// 시나리오 한 단계 기록 도구
function recorder() {
  const steps = []
  return {
    steps,
    ok: (name, detail = '') => steps.push({ name, result: 'ok', detail }),
    warn: (name, detail) => steps.push({ name, result: 'warn', detail }),
    fail: (name, detail) => { steps.push({ name, result: 'fail', detail }); throw new Error(`${name}: ${detail}`) },
  }
}
const why = res => `HTTP ${res.status || '-'} ${res.error || (res.json?.detail ?? '').toString().slice(0, 100)}`
const weird = obj => { const m = JSON.stringify(obj ?? '').match(WEIRD); return m ? m[0] : null }

// ── 프로젝트별 시나리오 ─────────────────────────────────────────
const scenarios = {
  // 제품 검색 → 하나 골라 분석 → 수요 예측 · 공공데이터 카드 확인 (읽기만 함)
  async gajeon(site, token, s) {
    const search = await call(site.backend, '/api/b2b/product-search?q=' + encodeURIComponent('에어컨'), { token })
    const items = search.json?.items || []
    if (!items.length) s.fail('제품 검색', why(search) + ' 결과 0개')
    s.ok('제품 검색', `${items.length}개 · 등급 ${items.filter(i => i.energy_grade).length}개`)

    const title = items[0].title
    const a = await call(site.backend, `/api/b2b/search-analysis?q=${encodeURIComponent(title)}&hint=${encodeURIComponent('에어컨')}`, { token, timeout: 150_000 })
    if (a.status !== 200 || !a.json) s.fail('분석', why(a))
    s.ok('분석', `${(a.ms / 1000).toFixed(0)}초 · ${title.slice(0, 30)}`)
    const j = a.json
    if (j.demand_forecast || j.sales_forecast || j.interest_forecast) s.ok('수요 예측')
    else s.warn('수요 예측', '예측 값이 비어 있음')
    j.safety_top?.top?.length ? s.ok('안전사고 TOP 3', `${j.safety_top.total}건`) : s.warn('안전사고 TOP 3', '카드 데이터 없음')
    j.weather_signal?.text ? s.ok('날씨 카드') : s.warn('날씨 카드', '카드 데이터 없음')
    j.ai_report ? s.ok('AI 리포트') : s.warn('AI 리포트', '비어 있음')
    const w = weird(j); if (w) s.warn('이상한 값', `응답에 "${w}" 포함`)
  },

  // 공개 캐릭터 하나 → WebSocket 채팅으로 메시지 보내기 → AI 답 확인 → 대화 기록 지우기
  async persona(site, token, s) {
    const list = await call(site.backend, '/api/v1/personas/public', { token })
    const persona = Array.isArray(list.json) ? list.json[0] : null
    if (!persona) s.fail('캐릭터 목록', why(list) + ' 공개 캐릭터 없음')
    s.ok('캐릭터 목록', `${list.json.length}개 · ${persona.name}`)

    const wsUrl = site.backend.replace(/^http/, 'ws') + `/api/v1/chat/${persona.id}?token=${encodeURIComponent(token)}`
    const reply = await new Promise(resolve => {
      const ws = new WebSocket(wsUrl)
      let text = ''
      const done = r => { clearTimeout(t); try { ws.close() } catch { /* 이미 닫힘 */ } resolve(r) }
      const t = setTimeout(() => done({ error: '60초 안에 답이 끝나지 않음', text }), 60_000)
      ws.onmessage = ev => {
        const m = JSON.parse(ev.data)
        if (m.type === 'connected') ws.send('안녕! 한 문장으로 자기소개 해줘.')
        else if (m.type === 'chunk') text += m.content
        else if (m.type === 'end') done({ text })
        else if (m.type === 'error') done({ error: m.message || m.code, text })
      }
      ws.onerror = () => done({ error: 'WebSocket 연결 실패', text })
    })
    try {
      if (reply.error) s.fail('AI 채팅', reply.error)
      if (reply.text.trim().length < 5) s.fail('AI 채팅', `답이 너무 짧음: "${reply.text}"`)
      s.ok('AI 채팅', `"${reply.text.trim().slice(0, 40)}…"`)
    } finally {
      const del = await call(site.backend, `/api/v1/chat/${persona.id}/history`, { token, method: 'DELETE' })
      del.status < 300 ? s.ok('테스트 대화 지우기') : s.warn('테스트 대화 지우기', why(del))
    }
  },

  // 일기 쓰기 → 감정 태그 · 점수 확인 → 테스트 일기 삭제
  async moodiary(site, token, s) {
    const c = await call(site.backend, '/api/diary/', {
      token, method: 'POST', timeout: 90_000,
      body: { title: '[자동점검] 테스트 일기', content: '오늘은 오랜만에 친구와 공원을 산책해서 기분이 정말 좋았다. 저녁도 맛있게 먹었다.' },
    })
    if (c.status !== 201 || !c.json?.id) s.fail('일기 쓰기', why(c))
    s.ok('일기 쓰기', `${(c.ms / 1000).toFixed(0)}초`)
    try {
      c.json.emotion_tags && c.json.emotion_score
        ? s.ok('감정 분석', `${c.json.emotion_tags} · ${c.json.emotion_score}점`)
        : s.fail('감정 분석', '태그나 점수가 비어 있음 (AI 분석 실패)')
    } finally {
      const d = await call(site.backend, `/api/diary/${c.json.id}`, { token, method: 'DELETE' })
      d.status < 300 ? s.ok('테스트 일기 삭제') : s.warn('테스트 일기 삭제', why(d))
    }
  },

  // 문서 업로드 → AI 요약 확인 → 휴지통 → 영구 삭제
  async neatly(site, token, s) {
    const form = new FormData()
    const text = '자동 점검용 테스트 문서입니다. Neatly는 문서를 업로드하면 AI가 핵심 내용을 요약해 줍니다. 이 문서는 점검이 끝나면 바로 삭제됩니다.'
    form.append('file', new Blob([text], { type: 'text/plain' }), '자동점검-테스트.txt')
    const up = await call(site.backend, '/documents/upload', { token, method: 'POST', form, timeout: 90_000 })
    if (up.status >= 300 || !up.json?.id) s.fail('문서 업로드', why(up))
    s.ok('문서 업로드', `${(up.ms / 1000).toFixed(0)}초`)
    try {
      const sum = (up.json.summary || '').trim()
      sum.length > 10 ? s.ok('AI 요약', `"${sum.slice(0, 40)}…"`) : s.fail('AI 요약', '요약이 비어 있음')
    } finally {
      const t = await call(site.backend, `/documents/${up.json.id}`, { token, method: 'DELETE' })
      const p = await call(site.backend, `/documents/${up.json.id}/permanent`, { token, method: 'DELETE' })
      t.status < 300 && p.status < 300 ? s.ok('테스트 문서 삭제') : s.warn('테스트 문서 삭제', `휴지통 ${t.status} · 영구 ${p.status}`)
    }
  },

  // 항공편 검색 → 결과 확인 + 첫 화면 데이터(후기 · 공지)
  async clearway(site, token, s) {
    const f = await call(site.backend, '/api/v1/flights?from_code=ICN&limit=20', { token })
    if (f.status !== 200 || !Array.isArray(f.json)) s.fail('항공편 검색', why(f))
    f.json.length ? s.ok('항공편 검색', `인천 출발 ${f.json.length}편`) : s.warn('항공편 검색', '인천 출발 항공편 0개')
    const w = weird(f.json); if (w) s.warn('이상한 값', `응답에 "${w}" 포함`)
    for (const [name, path] of [['후기', '/api/v1/reviews'], ['이벤트 공지', '/api/v1/notices?category=event']]) {
      const r = await call(site.backend, path, { token })
      r.status === 200 ? s.ok(name, `${Array.isArray(r.json) ? r.json.length : '?'}개`) : s.fail(name, why(r))
    }
  },

  // 뉴스 목록 → 기사 하나 열기 → 본문 · AI 요약 확인
  async newsdeliver(site, token, s) {
    const l = await call(site.backend, '/api/v1/news', { token })
    const items = l.json?.news_items || []
    if (!items.length) s.fail('뉴스 목록', why(l) + ' 기사 0개')
    s.ok('뉴스 목록', `${items.length}개`)
    const d = await call(site.backend, `/api/v1/news/${items[0].id}`, { token })
    const news = d.json?.news || d.json
    if (d.status !== 200 || !news?.title) s.fail('기사 열기', why(d))
    s.ok('기사 열기', news.title.slice(0, 40))
    news.ai_summary ? s.ok('AI 요약') : s.warn('AI 요약', '이 기사에는 요약이 없음')
  },
}

// ── 실행 ────────────────────────────────────────────────────────
const only = process.argv[2]
const results = []
for (const site of config.sites.filter(x => scenarios[x.id] && (!only || x.id === only))) {
  console.log(`▶ ${site.name}`)
  const s = recorder()
  const r = { site: site.name, steps: s.steps }
  results.push(r)
  try {
    const wake = await wakeBackend(site.health)
    if (!wake.ok) s.fail('서버 깨우기', '2분 안에 응답 없음')
    const auth = await apiLogin(site)
    if (!auth.tried) s.fail('로그인', '테스트 계정이 Secrets에 없음')
    if (!auth.ok) s.fail('로그인', auth.error)
    s.ok('로그인')
    await scenarios[site.id](site, auth.token, s)
  } catch (e) {
    if (!s.steps.some(x => x.result === 'fail')) s.steps.push({ name: '예상 못 한 오류', result: 'fail', detail: e.message })
  }
  r.failed = s.steps.filter(x => x.result === 'fail').length
  r.warned = s.steps.filter(x => x.result === 'warn').length
  console.log(`  ${r.failed ? '❌ 실패' : '✅ 통과'} (주의 ${r.warned})`)
}

const failed = results.filter(r => r.failed).length
const icon = { ok: '✅', warn: '⚠️', fail: '❌' }
let md = `# 기능 시나리오 점검 (${stamp} KST)\n\n`
md += failed ? `**${failed}개 사이트 실패**\n\n` : `**전부 통과** ✅\n\n`
md += `| 사이트 | 결과 | 주의 |\n|---|---|---|\n`
for (const r of results) md += `| ${r.site} | ${r.failed ? '❌ 실패' : '✅ 통과'} | ${r.warned} |\n`
for (const r of results) {
  md += `\n## ${r.site}\n`
  for (const st of r.steps) md += `- ${icon[st.result]} **${st.name}**${st.detail ? ` — ${String(st.detail).replace(/\|/g, '\\|')}` : ''}\n`
}

const file = await saveReport('시나리오', md, results)
await setOutput('scenario_issues', failed)
console.log(`\n실패 ${failed}개 사이트 → ${file}`)
