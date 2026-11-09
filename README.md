# site-monitor

배포한 6개 사이트(가전무쌍 · Persona · Moodiary · Neatly · ClearWay · NewsDeliver)를 매일 Playwright로 돌면서 오류를 찾아 `reports/`에 저장합니다.

## 무엇을 잡나
- 페이지가 안 열림 · HTTP 4xx/5xx · 빈 화면
- 브라우저 콘솔 에러 · JS 예외
- 사이트 자기 도메인과 백엔드로 가는 요청 실패 (4xx/5xx)
- 15초 넘게 걸리는 페이지
- 화면에 찍힌 `NaN` · `undefined` · `[object Object]` · `Infinity` · `+-0.0` · `null원`
- `sites.json`의 `mustContain`에 적은 문구가 없는 경우

Render 무료 서버는 먼저 `/health`를 불러 최대 2분 동안 깨운 뒤 점검합니다.

## 결과
- `reports/26-11-09/점검_07-13.md` 처럼 날짜 폴더에 시각별로 저장 (같은 이름 `.json`도 함께)
- 가장 최근 결과는 `reports/latest.md`
- 문제가 있으면 `site-check` 라벨로 GitHub 이슈가 열립니다.

## 설정
- 점검할 페이지: `sites.json`의 `pages` (로그인 없이) · `authPages` (로그인 후)
- 무시할 메시지: `ignore` (전체) · 사이트별 `ignore`
- 테스트 계정: Secrets에 `GAJEON_EMAIL` / `GAJEON_PASSWORD` 형식으로 등록 (id를 대문자로)
  - 없으면 로그인 화면은 건너뜁니다.
  - 로그인 폼이 기본 선택자(`input[type=email]` · `input[type=password]` · `button[type=submit]`)와 다르면 `login`에 `email` · `password` · `submit`을 적습니다.

## Mac에서 결과 받기
```
bash pull-report.sh
```
날짜 폴더째로 `~/Desktop/사이트점검/26-11-09/` 형태로 저장하고 가장 최근 리포트를 엽니다.
