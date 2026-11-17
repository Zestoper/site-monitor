# 사이트 점검 리포트 (2026-11-17 17:56 KST)

**문제 7건 발견**

| 사이트 | 결과 | 서버 깨우기 | 로그인 |
|---|---|---|---|
| 가전무쌍 | ✅ | 31초 | 성공 |
| Persona | ✅ | 31초 | 성공 |
| Moodiary | ❌ 1건 | 41초 | ❌ 실패 |
| Neatly | ❌ 6건 | 0초 | 성공 |
| ClearWay | ✅ | 0초 | 건너뜀 |
| NewsDeliver | ✅ | 0초 | 성공 |

## Moodiary
https://moodiary-five.vercel.app

- **로그인 실패**: locator.fill: Timeout 30000ms exceeded.

## Neatly
https://neatly-wheat.vercel.app


### `/emails` (4.3초 · 두 번 확인)
- **API/리소스 실패**: GET 400 /emails

### `/calendar` (4.8초 · 두 번 확인)
- **API/리소스 실패**: GET 400 /emails
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/documents' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /documents (net::ERR_FAILED)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/calendar/events/today?client_date=2026-11-17' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /calendar/events/today (net::ERR_FAILED)
