---
title: Security Guide
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Security Guide

**Document type:** Security principles reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 9; implements [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md)  
**Companion docs:** [Release Process](RELEASE_PROCESS.md) · [Git Workflow](GIT_WORKFLOW.md) · [`supabase-setup.md`](../supabase-setup.md)  
**Purpose:** Define long-term security principles — **user trust is the primary objective**

---

## How to Use This Document

This is **not** a penetration test checklist alone — it is the **trust model** for engineering decisions.

When security conflicts with speed, **security wins** for auth, visibility, payments, and data deletion.

Human-readable errors are a **security UX requirement** — never leak infrastructure to attackers or users.

---

# Security Philosophy

| Principle | Meaning |
|-----------|---------|
| **Trust is the product** | Users entrust intimate memories |
| **Defense in depth** | UI checks + RLS + server validation |
| **Least privilege** | Service role only where unavoidable |
| **Secrets never in client** | Browser is hostile environment |
| **Fail closed on auth** | Uncertain → deny access |
| **Human errors** | No stack traces, keys, or schema to users |
| **Minimum data** | Collect only what archive needs |

Align with [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md): third-party services are implementation details users never see in failures.

---

# Trust Model

### Assets to protect

| Asset | Sensitivity |
|-------|-------------|
| Place records (memory, photo, location) | High — personal |
| Private records | Highest — must not leak to public |
| Auth sessions | High |
| Payment data | High — PCI via Toss, not stored raw |
| OAuth tokens | High — managed by Supabase |
| API keys (Naver, OpenAI, Toss) | Critical — server only |

### Threats we prioritize

1. **Cross-user data access** (IDOR, broken RLS)
2. **Accidental public exposure** of private records
3. **Secret leakage** in repo or client bundle
4. **OAuth redirect hijacking**
5. **Unauthorized file upload** (malware, oversized abuse)
6. **AI prompt injection** exfiltrating other users’ data

We do not optimize for nation-state threat models in v1 — we optimize for **honest mistakes and common web flaws**.

---

# Authentication

### Model

- Supabase Auth — email/password + Kakao OAuth
- Session in HTTP-only cookies (SSR client pattern)

### Rules

| Rule | Detail |
|------|--------|
| Login required | Create, edit, delete own records, collections, save |
| Session refresh | Handled by Supabase client |
| Logout | Clears session; redirect home |
| Password | Supabase policies — never log passwords |
| OAuth callback | `/auth/callback` — validate `next` redirect ([`lib/auth/redirect`](../architecture/ENGINEERING_ARCHITECTURE.md)) |

### User-facing auth errors

- “로그인하지 못했습니다. 이메일과 비밀번호를 확인해주세요.”
- Never: `AuthApiError`, status codes, provider raw JSON

---

# Authorization

### Layers

| Layer | Responsibility |
|-------|----------------|
| **UI** | Hide edit/delete for non-owners; EmptyState for login |
| **Client checks** | UX only — not security boundary |
| **RLS** | **Authoritative** for Supabase tables |
| **API routes** | Server-side validation + secrets |

**Never** rely on UI alone for private place access.

### Owner operations

- Edit/delete place: `user_id` match
- Collection manage: collection owner
- Save place: authenticated user on public place

---

# Supabase RLS Philosophy

Row Level Security is the **database contract** for multi-tenant archive data.

### Principles

1. **RLS enabled** on all user data tables
2. Policies express **ownership** and **visibility** (`is_public`)
3. **SELECT** on places: public rows OR `auth.uid() = user_id`
4. **INSERT/UPDATE/DELETE**: owner only unless explicit shared write (collections junction — owner scoped)
5. **saved_places**: `user_id = auth.uid()`
6. **Service role** bypasses RLS — **server-only**, never client

### Policy change process

- Migration file in `supabase/migrations/`
- Security review in [Release Process](RELEASE_PROCESS.md)
- Test with two test users: cannot read other’s private row

See [`supabase-setup.md`](../supabase-setup.md) for environment setup.

---

# Secret Management

| Secret | Location |
|--------|----------|
| Supabase anon key | Client env — public by design; RLS protects |
| Supabase service role | Server env only — **never** `NEXT_PUBLIC_` |
| Naver API | Server route `/api/naver/search-place` |
| OpenAI | Server route `/api/ai/record-helper` |
| Toss payments | Server routes create/confirm |

### Rules

- No secrets in git — `.env.local` gitignored
- Rotate keys if leaked
- AI agents must not commit `.env` files
- Preview deployments use separate keys where possible

---

# Environment Variables

| Prefix | Exposure |
|--------|----------|
| `NEXT_PUBLIC_*` | Browser — assume public |
| No prefix / server-only | Node server / route handlers |

**Audit:** Any new `NEXT_PUBLIC_` variable requires justification in PR.

---

# OAuth

### Kakao via Supabase

- Redirect URI registered in Kakao + Supabase dashboard
- Callback: `/auth/callback` with sanitized `next` param
- Error param `oauth_*` → human message on login page

### Anti-patterns

- Open redirect in `next`
- OAuth tokens in URL fragment logged client-side
- Sharing OAuth client secret in frontend (N/A for Supabase OAuth flow)

---

# Payments

### Toss Payments (MVP test flow)

- Create/confirm on **server routes**
- Never trust client-only payment success
- Confirm route updates DB after Toss verification
- User sees human result pages — not `error.code`

### Rules

- No card data touches Re:Place servers (Toss widget)
- Log payment failures server-side — not full PAN ever
- Premium state from DB — not client flag alone

---

# File Upload Security

### Place images

- Auth required before upload
- Validate **MIME type** and **file size** client + server
- Store in Supabase Storage with bucket policies
- User-scoped paths (`userId/...`) where applicable
- No executable extensions served as images

### Crop pipeline

- Client crop before upload — reduces oversized originals
- Revoke object URLs after use

---

# API Security

### Route handlers (`app/api/`)

| Control | Application |
|---------|-------------|
| Auth | Verify session for user-specific mutations where needed |
| Input validation | Query length limits, type checks |
| Rate limiting | Target for search + AI routes (future) |
| Error responses | Generic JSON — details in server logs |
| CORS | Next.js defaults — restrict if exposing externally |

### Proxy pattern

Naver and OpenAI keys stay on server — clients call `/api/*` only.

---

# Privacy

Per [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 9.

| Commitment | Practice |
|------------|----------|
| Minimum necessary data | Place fields justified by archive |
| Public opt-in | Explicit `is_public` |
| Deletion | User can delete own records |
| No selling memories | Policy-level — not productized |
| AI training | No private record training without explicit consent policy |
| Analytics | No PII in events without policy ([Product Metrics](PRODUCT_METRICS.md)) |

### Saved places

Bookmark of **public** content — not tracking other users’ behavior.

---

# Logging

| Log | Allowed |
|-----|---------|
| Server errors with stack | Internal logs only |
| Request IDs | Yes |
| User memory text | **Avoid** — PII |
| Place IDs in debug | Dev only — remove production `console.log` (debt) |
| Supabase error objects | Server logs — map to human UI |

**Remove** client-side logging of location payloads in production ([Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md) debt note).

---

# AI Security Considerations

Per [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 14.

| Risk | Mitigation |
|------|------------|
| Prompt injection via place name | Sanitize; server-side prompt template; no tool access to other users’ data |
| AI sees PII in logs | Don’t log prompts with user content |
| Auto-publish | Forbidden — user edits before save |
| AI route abuse | Auth + rate limit (target) |
| Over-broad context | Send only user’s draft fields — not whole DB |

---

# Security Review Checklist

Before release touching security surface:

- [ ] RLS policies for new/changed tables
- [ ] No service role in client
- [ ] No secrets in diff
- [ ] OAuth redirect allowlist
- [ ] Upload validation
- [ ] API input validation
- [ ] Owner checks + RLS alignment
- [ ] User errors humanized
- [ ] Private records not in public API responses
- [ ] Payment confirm server-side
- [ ] AI route auth considered

---

# Security Anti-Patterns

| Anti-pattern | Risk |
|--------------|------|
| “We’ll add RLS later” | Data leak |
| Service role in browser | Total compromise |
| `is_public` only in UI | IDOR |
| Error: `Supabase 설정을 확인해주세요` | Info leak + trust break |
| Logging full request bodies | PII exposure |
| Open `next` redirect | Account hijack |
| Public storage bucket for private images | Leak |
| Trusting client payment success | Fraud |
| AI with access to all places | Cross-user leak |
| Secrets in git history | Permanent exposure |

---

## Closing

Security for Re:Place is not a checkbox — it is **keeping promises**: your private memories stay yours, your public gifts stay intentional, and failures speak in **human language**, not database dialect.

---

*Security Guide v1.0 — long-term security principles for Re:Place.*

---

This document is part of the Re:Place documentation system.
