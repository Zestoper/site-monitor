# site-monitor

배포한 6개 프로젝트(가전무쌍 · Persona · Moodiary · Neatly · ClearWay · NewsDeliver)를 자동으로 점검하고 결과를 `reports/`에 날짜별로 저장합니다.

## 점검 3가지

| 점검 | 파일 | 언제 | 무엇을 |
|---|---|---|---|
| 페이지 | `check.mjs` | 매일 07:13 | 공개 페이지 + 로그인 후 페이지를 열어 콘솔 에러 · JS 예외 · API 실패 · 빈 화면 · `NaN` 같은 이상한 글자 · 느림을 찾음 |
| API 전체 | `api-check.mjs` | 매일 07:13 | `/openapi.json`에서 API 목록을 읽어 조회용(GET) API를 하나씩 호출해 500 에러 · 시간 초과 · 첫 요청만 실패하는 문제를 찾음 |
| 기능 시나리오 | `scenarios.mjs` | 매주 월 07:43 | 핵심 기능을 실제로 돌려봄 (AI 사용량이 들어 주 1회) |

### 기능 시나리오
- 가전무쌍: 제품 검색 → 분석 → 수요 예측 · 안전사고 · 날씨 카드 확인 (읽기만)
- Persona: 공개 캐릭터와 WebSocket 채팅 → AI 답 확인 → 테스트 대화 지우기
- Moodiary: 일기 쓰기 → 감정 태그 · 점수 확인 → 테스트 일기 삭제
- Neatly: 문서 업로드 → AI 요약 확인 → 영구 삭제
- ClearWay: 인천 출발 항공편 검색 · 후기 · 이벤트 공지
- NewsDeliver: 뉴스 목록 → 기사 열기 → AI 요약 확인

## 안전장치
- API 점검은 GET만 부르고 로그아웃 · 동기화 · 결제 · 메일 발송 · AI 분석처럼 부작용이나 비용이 있는 API는 `sites.json`의 `apiExclude`로 뺍니다.
- 시나리오에서 만든 일기 · 문서 · 대화는 끝에 지웁니다.
- 문제가 나오면 한 번 더 확인해서 일시적인 실패를 걸러냅니다.

## 결과
```
reports/
├─ 26-11-09/
│   ├─ 점검_07-13.md      페이지
│   ├─ API_07-13.md       API 전체
│   └─ 시나리오_07-43.md  기능 시나리오 (월요일)
├─ latest.md · latest-API.md · latest-시나리오.md
```
문제가 있으면 `site-check` 라벨로 GitHub 이슈가 열립니다.

## 설정
- 테스트 계정: Secrets에 `<ID>_EMAIL` / `<ID>_PASSWORD` (ID = GAJEON · PERSONA · MOODIARY · NEATLY · CLEARWAY · NEWSDELIVER). NewsDeliver는 이메일 자리에 아이디를 넣습니다.
- 점검할 페이지 · 무시할 메시지 · API 필수 값: `sites.json`
- 손으로 실행: Actions → Site check 또는 Scenario check → Run workflow (시나리오는 사이트 하나만 고를 수 있음)

## Mac에서 결과 받기
```
bash pull-report.sh
```
`~/Desktop/사이트점검/26-11-09/`처럼 날짜 폴더째로 받고 가장 최근 리포트를 엽니다.
