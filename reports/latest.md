# 사이트 점검 리포트 (2026-11-17 13:11 KST)

**문제 10건 발견**

| 사이트 | 결과 | 서버 깨우기 | 로그인 |
|---|---|---|---|
| 가전무쌍 | ✅ | 31초 | 성공 |
| Persona | ✅ | 31초 | 성공 |
| Moodiary | ✅ | 41초 | 성공 |
| Neatly | ❌ 5건 | 41초 | 성공 |
| ClearWay | ✅ | 31초 | 건너뜀 |
| NewsDeliver | ❌ 5건 | 31초 | 성공 |

## Neatly
https://neatly-wheat.vercel.app


### `/dashboard` (5.9초 · 두 번 확인)
- **API/리소스 실패**: POST 404 /briefing/generate

### `/emails` (4.8초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/emails?label=INBOX' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /emails (net::ERR_FAILED)

### `/calendar` (5.7초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://neatly-backend-xzdm.onrender.com/emails' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /emails (net::ERR_FAILED)

## NewsDeliver
https://newsdeliver.vercel.app


### `/` (61.5초 · 두 번 확인)
- **페이지 열기 실패**: page.goto: Timeout 60000ms exceeded.
- **느림**: 61.5초

### `/news` (61.5초 · 두 번 확인)
- **페이지 열기 실패**: page.goto: Timeout 60000ms exceeded.
- **느림**: 61.5초

### `/global-news` (32.7초 · 두 번 확인)
- **느림**: 32.7초
