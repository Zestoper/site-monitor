# API 전체 점검 (2026-11-09 18:12 KST)

**문제 없음** ✅ · 주의 0건

| 사이트 | 결과 | 확인한 API | 주의 | 건너뜀 | 로그인 |
|---|---|---|---|---|---|
| 가전무쌍 | ✅ | 21개 | 0 | 10 | 성공 |
| Persona | ✅ | 12개 | 0 | 9 | 성공 |
| Moodiary | ✅ | 10개 | 0 | 7 | 성공 |
| Neatly | ✅ | 16개 | 0 | 9 | 성공 |
| ClearWay | ✅ | 26개 | 0 | 8 | 성공 |
| NewsDeliver | ✅ | 37개 | 0 | 25 | 성공 |

## 데이터 최신성

| 사이트 | 항목 | 상태 |
|---|---|---|
| 가전무쌍 | 가격 수집 | ✅ 마지막 2026-11-08 (1일 전) |
| 가전무쌍 | 기상청 날씨 | ✅ 마지막 2026-11-07 (2일 전) |
| 가전무쌍 | 에어코리아 미세먼지 | ✅ 마지막 2026-11-09 (0일 전) |
| NewsDeliver | 국내 뉴스 수집 | ✅ 가장 최근 기사 0.3시간 전 |
| NewsDeliver | 해외 뉴스 수집 | ✅ 가장 최근 기사 0.3시간 전 |

<details><summary>건너뛴 API 목록</summary>

**가전무쌍**: /api/auth/password-reset/check (제외 목록) · /api/recommend (제외 목록) · /api/report (제외 목록) · /api/ai-analysis (제외 목록) · /api/ai-compare (제외 목록) · /api/b2b/export-report (제외 목록) · /api/b2b/product-price (필수 값 모름) · /api/b2b/search-analysis (제외 목록) · /api/b2b/backtest (제외 목록) · /api/b2b/backtest-weather (제외 목록)

**Persona**: /api/v1/auth/kakao (제외 목록) · /api/v1/auth/kakao/callback (제외 목록) · /api/v1/auth/google (제외 목록) · /api/v1/auth/google/callback (제외 목록) · /api/v1/auth/password-reset/check (제외 목록) · /api/v1/personas/{persona_id} (경로 값 필요) · /api/v1/personas/{persona_id}/lore (경로 값 필요) · /api/v1/collections (제외 목록) · /api/v1/collections/{collection_id} (경로 값 필요)

**Moodiary**: /api/diary/{diary_id} (경로 값 필요) · /api/consult/{consult_id} (경로 값 필요) · /api/report/monthly (제외 목록) · /api/report/recap (제외 목록) · /api/payment/packages (제외 목록) · /api/payment/history (제외 목록) · /api/admin/payments (제외 목록)

**Neatly**: /documents/{document_id} (경로 값 필요) · /auth/gmail (제외 목록) · /auth/gmail/callback (제외 목록) · /emails/{message_id} (경로 값 필요) · /briefing/date (필수 값 모름) · /briefing/today (제외 목록) · /emails/sync/status (제외 목록) · /chat/rooms/{room_id}/messages (경로 값 필요) · /chat/rooms/{room_id}/read-status (경로 값 필요)

**ClearWay**: /api/v1/flights/{flight_id} (경로 값 필요) · /api/v1/flights/{flight_id}/seats (경로 값 필요) · /api/v1/bookings/lookup (제외 목록) · /api/v1/bookings/{booking_ref} (경로 값 필요) · /api/v1/admin/flight-sync/status (제외 목록) · /api/v1/notices/{notice_id} (경로 값 필요) · /api/v1/nextrip/plans/{plan_id} (경로 값 필요) · /api/v1/chat/rooms/{room_id}/messages (경로 값 필요)

**NewsDeliver**: /oauth/kakao (제외 목록) · /oauth/kakao/callback (제외 목록) · /oauth/naver (제외 목록) · /oauth/naver/callback (제외 목록) · /oauth/google (제외 목록) · /oauth/google/callback (제외 목록) · /auth/sso (제외 목록) · /logout (제외 목록) · /subscribe/payment/success (제외 목록) · /subscribe/payment/fail (제외 목록) · /verify-email (제외 목록) · /news/{news_id} (경로 값 필요) · /news/{news_id}/delete (경로 값 필요) · /news/{news_id}/comments (경로 값 필요) · /age-news/{group} (경로 값 필요) · /api/news/{news_id} (경로 값 필요) · /press/edit/{news_id} (경로 값 필요) · /press/delete/{news_id} (경로 값 필요) · /api/admin/fetch-status (제외 목록) · /api/chat/room/{room_id}/messages (경로 값 필요) · /api/v1/auth/password-reset/check (제외 목록) · /api/v1/news/{news_id} (경로 값 필요) · /api/v1/age-news/{group} (경로 값 필요) · /internal/jobs/fetch-news (제외 목록) · /internal/jobs/newsletter (제외 목록)

</details>
