# 사이트 점검 리포트 (2026-11-28 12:30 KST)

**문제 96건 발견**

| 사이트 | 결과 | 서버 깨우기 | 로그인 |
|---|---|---|---|
| 가전무쌍 | ❌ 8건 | ❌ 실패 | ❌ 실패 |
| Persona | ❌ 19건 | ❌ 실패 | ❌ 실패 |
| Moodiary | ❌ 6건 | ❌ 실패 | ❌ 실패 |
| Neatly | ❌ 10건 | ❌ 실패 | ❌ 실패 |
| ClearWay | ❌ 9건 | ❌ 실패 | 건너뜀 |
| NewsDeliver | ❌ 44건 | ❌ 실패 | ❌ 실패 |

## 가전무쌍
https://appliance-trend-insight.vercel.app

- **서버 깨우기 실패**: https://appliance-trend-insight.onrender.com/ 가 120초 안에 응답하지 않음
- **로그인 실패** (로그인 화면에서 넘어가지 않음)

### `/` (2.3초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://appliance-trend-insight.onrender.com/api/ai-analysis?query=%EB%B9%84%EC%8A%A4%ED%8F%AC%ED%81%AC%20%EB%83%89%EC%9E%A5%EA%B3%A0%20RF85C9141AP' from origin 'https://appliance-trend-insight.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header i
- **요청 실패**: GET /api/ai-analysis (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://appliance-trend-insight.onrender.com/api/naver/products?query=%EB%B9%84%EC%8A%A4%ED%8F%AC%ED%81%AC%20%EB%83%89%EC%9E%A5%EA%B3%A0%20RF85C9141AP&page=1&display=1' from origin 'https://appliance-trend-insight.vercel.app' has been blocked by CORS policy: No 'Access-Control-Al
- **요청 실패**: GET /api/naver/products (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://appliance-trend-insight.onrender.com/api/report?query=%EB%B9%84%EC%8A%A4%ED%8F%AC%ED%81%AC%20%EB%83%89%EC%9E%A5%EA%B3%A0%20RF85C9141AP' from origin 'https://appliance-trend-insight.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is pre
- **요청 실패**: GET /api/report (net::ERR_FAILED)

## Persona
https://persona-peach-rho.vercel.app

- **서버 깨우기 실패**: https://persona-5x3w.onrender.com/health 가 120초 안에 응답하지 않음
- **로그인 실패** (로그인 화면에서 넘어가지 않음)

### `/` (2.2초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/marketplace` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://persona-5x3w.onrender.com/api/v1/personas/public?sort=popular&search=&tag=&skip=0&limit=20' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /api/v1/personas/public (net::ERR_FAILED)
- **JS 예외**: Network Error

### `/pricing` (2.4초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/login` (2.3초 · 두 번 확인)
- **콘솔 에러**: Access to XMLHttpRequest at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/register` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://persona-5x3w.onrender.com/health' from origin 'https://persona-peach-rho.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors'
- **요청 실패**: GET /health (net::ERR_FAILED)

## Moodiary
https://moodiary-five.vercel.app

- **서버 깨우기 실패**: https://moodiary-0she.onrender.com/health 가 120초 안에 응답하지 않음
- **로그인 실패**: 화면 메시지: 서버 연결 실패

### `/login` (2.4초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://moodiary-0she.onrender.com/' from origin 'https://moodiary-five.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch
- **요청 실패**: GET / (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://moodiary-0she.onrender.com/health' from origin 'https://moodiary-five.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to
- **요청 실패**: GET /health (net::ERR_FAILED)

## Neatly
https://neatly-wheat.vercel.app

- **서버 깨우기 실패**: https://neatly-backend-xzdm.onrender.com/health 가 120초 안에 응답하지 않음
- **로그인 실패** (로그인 화면에서 넘어가지 않음)

### `/` (2.3초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://neatly-backend-xzdm.onrender.com/health' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cor
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/login` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://neatly-backend-xzdm.onrender.com/health' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cor
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/register` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://neatly-backend-xzdm.onrender.com/health' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cor
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/plans` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://neatly-backend-xzdm.onrender.com/health' from origin 'https://neatly-wheat.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cor
- **요청 실패**: GET /health (net::ERR_FAILED)

## ClearWay
https://clear-way-drab.vercel.app

- **서버 깨우기 실패**: https://clearway-3z2c.onrender.com/health 가 120초 안에 응답하지 않음

### `/` (2.4초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://clearway-3z2c.onrender.com/health' from origin 'https://clear-way-drab.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' t
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://clearway-3z2c.onrender.com/health' from origin 'https://clear-way-drab.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' t
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://clearway-3z2c.onrender.com/api/v1/reviews' from origin 'https://clear-way-drab.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an
- **요청 실패**: GET /api/v1/reviews (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://clearway-3z2c.onrender.com/api/v1/notices?category=event' from origin 'https://clear-way-drab.vercel.app' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested 
- **요청 실패**: GET /api/v1/notices (net::ERR_FAILED)

## NewsDeliver
https://newsdeliver.vercel.app

- **서버 깨우기 실패**: https://newsdeliver.onrender.com/health 가 120초 안에 응답하지 않음
- **로그인 실패** (로그인 화면에서 넘어가지 않음)

### `/` (2.6초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/market' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to
- **요청 실패**: GET /api/market (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/home' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' t
- **요청 실패**: GET /api/v1/home (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/age-news?group=teen' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to
- **요청 실패**: GET /api/age-news (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/market' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to
- **요청 실패**: GET /api/market (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/home' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' t
- **요청 실패**: GET /api/v1/home (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/age-news?group=teen' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to
- **요청 실패**: GET /api/age-news (net::ERR_FAILED)

### `/news` (2.7초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/news?page=1' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-
- **요청 실패**: GET /api/v1/news (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/news?page=1' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-
- **요청 실패**: GET /api/v1/news (net::ERR_FAILED)

### `/global-news` (2.7초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/global-news?page=1' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode 
- **요청 실패**: GET /api/v1/global-news (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/global-news?page=1' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode 
- **요청 실패**: GET /api/v1/global-news (net::ERR_FAILED)

### `/search` (2.1초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/search?' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors
- **요청 실패**: GET /api/v1/search (net::ERR_FAILED)

### `/about` (2.3초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)

### `/subscribe` (2.2초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/subscribe' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-co
- **요청 실패**: GET /api/v1/subscribe (net::ERR_FAILED)

### `/login` (2.7초 · 두 번 확인)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/health' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fet
- **요청 실패**: GET /health (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/auth/providers' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to '
- **요청 실패**: GET /api/v1/auth/providers (net::ERR_FAILED)
- **콘솔 에러**: Access to fetch at 'https://newsdeliver.onrender.com/api/v1/auth/providers' from origin 'https://newsdeliver.vercel.app' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to '
- **요청 실패**: GET /api/v1/auth/providers (net::ERR_FAILED)
