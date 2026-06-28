---
title: API Specification
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# API Specification

**Document type:** HTTP API reference  
**Status:** v1.0 — documents **current codebase only**  
**Authority:** Subordinate to [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md) and [Security Guide](../operations/SECURITY_GUIDE.md)  
**Companion docs:** [Database Schema](../database/DATABASE_SCHEMA.md) · [AI Design Rules](../foundation/AI_DESIGN_RULES.md)  
**Purpose:** Document every current server route handler — no invented endpoints

---

## How to Use This Document

- **Before adding a route:** complete [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) and API Change Checklist (§10).
- **Before calling from client:** confirm auth and error mapping — never expose raw provider errors to users.
- This spec reflects `app/api/**` and `app/auth/callback` as implemented today.

---

# API Philosophy

| Principle | Meaning |
|-----------|---------|
| **Minimal surface** | Most CRUD uses Supabase client + RLS — not REST wrappers |
| **Server for secrets** | Third-party keys (Naver, OpenAI, Toss) only on server |
| **Human errors outward** | Korean user messages; codes logged internally where possible |
| **Auth explicit** | Session required where money or user data mutation applies |
| **No public CRUD API** | Places/collections/saves are not exposed as generic REST |

Re:Place is an archive app — not an API product. New routes require strong justification.

---

# Current API Routes — Summary Table

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| POST | `/api/payments/create` | Required (session) | Create pending payment + Toss widget params |
| POST | `/api/payments/confirm` | Required (session) | Confirm Toss payment + mark `payments` paid |
| POST | `/api/ai/record-helper` | **None (current)** | OpenAI memory polish suggestion |
| GET | `/api/naver/search-place` | **None (current)** | Proxy Naver Local Search |
| GET | `/auth/callback` | OAuth code exchange | Supabase OAuth session (Kakao) |

All routes use `export const dynamic = "force-dynamic"`.

Payment routes use `runtime = "nodejs"`.

---

# Route Specifications

## POST `/api/payments/create`

**File:** `app/api/payments/create/route.ts`

### Purpose

Start Premium (Toss) payment: insert `payments` row (`pending`) and return widget configuration.

### Auth requirement

- **Required:** Supabase session via `createSupabaseRouteClient`
- **401** if no user

### Request

- **Body:** none
- **Headers:** session cookies

### Success response (200)

```json
{
  "clientKey": "<NEXT_PUBLIC_TOSS_CLIENT_KEY>",
  "customerKey": "<user.id>",
  "orderId": "replace_<timestamp>_<random>",
  "orderName": "Re:Place Premium",
  "amount": 4900,
  "successUrl": "<origin>/payment/success",
  "failUrl": "<origin>/payment/fail"
}
```

Constants from `lib/payments/constants.ts`: plan `premium`, amount `4900`.

### Error responses

| Status | Body `message` (Korean) | Notes |
|--------|-------------------------|-------|
| 401 | Premium 결제를 시작하려면 로그인이 필요합니다. | |
| 500 | Toss Payments 클라이언트 키가 설정되지 않았습니다. | **Gap:** technical config hint — should humanize for UI |
| 500 | 결제 정보를 준비하지 못했습니다. 잠시 후 다시 시도해주세요. | DB insert failed |
| 500 | 결제 시작 중 오류가 발생했습니다. | Catch-all |

### Security considerations

- Uses **service role** (`getSupabaseAdminClient`) to insert `payments`
- `orderId` generated server-side
- `clientKey` is public Toss key — expected in client widget

### User-facing error mapping

UI (`PremiumCheckout`) should map all failures to calm retry copy — avoid showing env config messages in production UI.

---

## POST `/api/payments/confirm`

**File:** `app/api/payments/confirm/route.ts`

### Purpose

Confirm Toss payment after redirect; verify order ownership and amount; call Toss confirm API; update `payments.status` to `paid`.

### Auth requirement

- **Required:** session user must match `payments.user_id`

### Request body (JSON)

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `paymentKey` | string | Yes | Non-empty, max 200 chars |
| `orderId` | string | Yes | Pattern `^[A-Za-z0-9_-]{6,64}$` |
| `amount` | number/string | Yes | Must equal `4900` (server constant) |
| `paymentType` | string | No | If present, must be `NORMAL` |

### Success response (200)

**New confirmation:**

```json
{
  "message": "Premium이 활성화되었습니다.",
  "status": "paid",
  "payment": {
    "orderId": "...",
    "amount": 4900,
    "approvedAt": "<ISO8601>"
  }
}
```

**Already confirmed:**

```json
{
  "message": "이미 승인된 결제입니다.",
  "status": "paid",
  "alreadyConfirmed": true,
  "payment": { "orderId", "amount", "approvedAt" }
}
```

### Error responses (selected)

| Status | Message | `code` field (exposed today) |
|--------|---------|------------------------------|
| 401 | 결제 승인을 완료하려면 로그인이 필요합니다. | — |
| 400 | Validation messages (Korean) | `INVALID_PAYMENT_CONFIRM_REQUEST` |
| 404 | 결제 주문 정보를 찾을 수 없습니다. | `PAYMENT_NOT_FOUND` |
| 403 | 이 결제 주문을 승인할 권한이 없습니다. | `PAYMENT_FORBIDDEN` |
| 400/502 | Toss failure message | `TOSS_CONFIRM_FAILED`, etc. |
| 500 | 결제 승인 중 오류가 발생했습니다. | `PAYMENT_CONFIRM_ERROR` |

### Security considerations

- Amount validated against server constant — not client-trusted alone
- Order must belong to authenticated user
- Toss secret key server-only
- Idempotency-Key header on Toss confirm: `replace-confirm-{orderId}`

### User-facing error mapping

**Gap:** `PaymentSuccessResult` and API return `code` fields — [AI Design Rules](../foundation/AI_DESIGN_RULES.md) forbid exposing codes to users. UI should show `message` only; log `code` internally.

---

## POST `/api/ai/record-helper`

**File:** `app/api/ai/record-helper/route.ts`

### Purpose

Opt-in AI assist: polish user's memory text (2–4 sentences, diary tone) via OpenAI Responses API.

### Auth requirement

- **None in current implementation**
- **Recommendation (future):** require session — rate limit per user

### Request body (JSON)

| Field | Type | Required | Limits |
|-------|------|----------|--------|
| `placeName` | string | Yes | max 120 chars |
| `memo` | string | Yes | min 5, max 500 chars |
| `category` | string | No | max 80 chars |
| `address` | string | Accepted in type but **not used** in prompt today | — |

### Success response (200)

```json
{
  "suggestion": "<polished Korean text, max 900 chars>"
}
```

### Error responses

| Status | Body | Notes |
|--------|------|-------|
| 400 | `{ "error": "장소명과 한 줄 기록을 먼저 입력해주세요." }` | Missing fields |
| 400 | `{ "error": "조금만 더 적어주시면 자연스럽게 다듬을 수 있어요." }` | Memo too short |
| 500/502 | `{ "error": "지금은 기록을 다듬지 못했어요. 잠시 후 다시 시도해주세요." }` | OpenAI/config failure |

### Security considerations

- `OPENAI_API_KEY` server-only
- System prompt forbids review/ranking tone — aligns with [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 14
- No persistence — suggestion returned only; user must apply in form
- **Gap:** unauthenticated endpoint — abuse/rate-limit risk

### User-facing error mapping

`AIRecordHelper` displays `error` string from JSON — already Korean-friendly.

---

## GET `/api/naver/search-place`

**File:** `app/api/naver/search-place/route.ts`

### Purpose

Proxy Naver Local Search for place attach during create/edit form.

### Auth requirement

- **None in current implementation**

### Query parameters

| Param | Type | Required | Default | Notes |
|-------|------|----------|---------|-------|
| `q` | string | Yes* | — | *Empty → 400; length < 2 → `{ results: [] }` |
| `display` | number | No | 5 | Clamped 1–10 |

### Success response (200)

```json
{
  "results": [
    {
      "id": "<synthetic id from name+address+coords>",
      "name": "<stripped HTML>",
      "category": "<string>",
      "address": "<string>",
      "roadAddress": "<string>",
      "mapUrl": "https://map.naver.com/p/search/...",
      "latitude": number | null,
      "longitude": number | null
    }
  ]
}
```

### Error responses

| Status | Body | Gap |
|--------|------|-----|
| 400 | `{ "error": "Search query is required." }` | **English** — UI should map |
| 500 | `{ "error": "Naver API environment variables are not configured." }` | **English + technical** |
| 500 | `{ "error": "Failed to search places." }` | **English** |

### Security considerations

- `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` server-only
- Query logged on failure — avoid logging PII at scale

### User-facing error mapping

`PlaceSearchDropdown` should map API errors to Korean: “장소 검색에 실패했어요. 잠시 후 다시 시도해주세요.”

---

## GET `/auth/callback`

**File:** `app/auth/callback/route.ts`

### Purpose

Supabase OAuth callback — exchange `code` for session; set auth cookies; redirect to safe `next` path.

### Auth requirement

- OAuth `code` query param from provider

### Query parameters

| Param | Purpose |
|-------|---------|
| `code` | Authorization code — required |
| `next` | Post-login redirect — sanitized via `getSafeAuthRedirectPath` |

### Success behavior

- **302 redirect** to `next` (default from `defaultLoginRedirectPath`)
- Session cookies set on response

### Error behavior

- Missing `code` → redirect `/login?error=oauth_missing_code`
- Exchange failure → redirect `/login?error=oauth_callback`
- Preserves `next` when not default

### Security considerations

- Open redirect prevented by `getSafeAuthRedirectPath`
- Uses anon key + cookie adapter — not service role

### User-facing error mapping

Login page maps `oauth_*` errors to Korean message.

---

# What Belongs in API Routes vs Supabase Client

| Use API route | Use Supabase client + RLS |
|---------------|-------------------------|
| Secret API keys (Naver, OpenAI, Toss) | places CRUD |
| Server-side payment confirmation | saved_places insert/delete |
| OAuth token exchange | collections CRUD |
| Input validation before paid external call | collection_places links |
| Operations requiring service role | storage upload (authenticated) |
| Rate limiting / abuse protection (future) | public place/collection reads |

**Rule:** Do not add `/api/places` CRUD unless RLS cannot express the rule or server validation is mandatory.

---

# API Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| Generic REST mirror of all tables | Duplicates RLS; widens attack surface |
| Secrets in `NEXT_PUBLIC_*` except intended public keys | Leak |
| English/technical errors to UI | Trust break |
| Exposing `error.code` to users | AI Design Rules violation |
| Unauthenticated paid or costly endpoints | Abuse |
| Bypassing RLS with service role for user reads | IDOR risk |
| Logging full OpenAI/Naver request bodies with PII | Privacy |
| New route without RFC | Governance |

---

# API Change Checklist

Before adding or changing a route:

- [ ] RFC approved ([Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md))
- [ ] Cannot be done with Supabase + RLS alone
- [ ] Secrets stay server-side
- [ ] Auth requirement defined and enforced
- [ ] Input validated
- [ ] Errors return **Korean** user messages — no codes in UI
- [ ] Security review ([Security Guide](../operations/SECURITY_GUIDE.md))
- [ ] This document updated
- [ ] Client error mapping updated
- [ ] Rate limiting considered for public/costly endpoints

---

## Closing

Re:Place APIs are **thin, secret-bearing edges** — not the core product surface. The archive lives in Supabase tables protected by RLS; routes exist only where the browser must not hold keys or where payment truth must be server-confirmed.

---

*API Specification v1.0 — current Re:Place HTTP routes.*

---

This document is part of the Re:Place documentation system.
