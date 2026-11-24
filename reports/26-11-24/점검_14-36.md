# 사이트 점검 리포트 (2026-11-24 14:36 KST)

**문제 2건 발견**

| 사이트 | 결과 | 서버 깨우기 | 로그인 |
|---|---|---|---|
| 가전무쌍 | ✅ | 0초 | 성공 |
| Persona | ✅ | 31초 | 성공 |
| Moodiary | ✅ | 36초 | 성공 |
| Neatly | ❌ 2건 | 36초 | 성공 |
| ClearWay | ✅ | 31초 | 건너뜀 |
| NewsDeliver | ✅ | 0초 | 성공 |

## Neatly
https://neatly-wheat.vercel.app


### `/calendar` (5.2초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/calendar/suggestions' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /calendar/suggestions (net::ERR_FAILED)
