# 사이트 점검 리포트 (2026-11-16 22:10 KST)

**문제 8건 발견**

| 사이트 | 결과 | 서버 깨우기 | 로그인 |
|---|---|---|---|
| 가전무쌍 | ✅ | 0초 | 성공 |
| Persona | ✅ | 0초 | 성공 |
| Moodiary | ✅ | 0초 | 성공 |
| Neatly | ❌ 6건 | 0초 | 성공 |
| ClearWay | ✅ | 1초 | 건너뜀 |
| NewsDeliver | ❌ 2건 | 0초 | 성공 |

## Neatly
https://neatly-wheat.vercel.app


### `/emails` (4.0초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/emails?label=INBOX' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /emails (net::ERR_FAILED)

### `/calendar` (5.8초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/emails' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /emails (net::ERR_FAILED)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/calendar/events/today?client_date=2026-11-16' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /calendar/events/today (net::ERR_FAILED)

## NewsDeliver
https://newsdeliver.vercel.app


### `/` (61.5초 · 두 번 확인)
- **페이지 열기 실패**: page.goto: Timeout 60000ms exceeded.
- **느림**: 61.5초
