---
title: Engineering Architecture
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Engineering Architecture

**Document type:** Engineering reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); implements [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) in code  
**Companion docs:** [Information Architecture](INFORMATION_ARCHITECTURE.md) · [Component Specification](COMPONENT_SPECIFICATION.md) · [Interaction Specification](INTERACTION_SPECIFICATION.md)  
**Purpose:** Describe long-term technical architecture and answer: **How should Re:Place be engineered?**

---

## How to Use This Document

This is **architectural philosophy** — not a line-by-line code map. When making technical decisions, prefer patterns that preserve **trust**, **calm UX**, and **long-term maintainability** over short-term velocity.

Stack (current): **Next.js 16 App Router**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Supabase**.

---

# 1. Engineering Philosophy

| Principle | Meaning |
|-----------|---------|
| **Honest UI** | No mock data paths in production surfaces |
| **Thin routes, fat domain** | `app/` pages orient; logic lives in `lib/` and feature components |
| **Client where interaction demands** | Forms, maps, auth listeners — not everything by default |
| **Server where trust and secrets matter** | Payments confirm, OAuth callback, future RLS-heavy reads |
| **Boring over clever** | Explicit data fetch beats premature abstraction |
| **Archive-aligned metrics** | Log errors internally; never leak infrastructure to users |
| **Documentation is code** | RFC + architecture docs updated with material changes |

Engineering serves the archive — not the other way around.

---

# 2. App Router Architecture

### Structure

```
app/
├── layout.tsx          ← Single root layout (global shell)
├── page.tsx            ← Home
├── globals.css         ← Tokens + Tailwind v4
├── [feature]/page.tsx  ← Route segments
├── api/                ← Route handlers
└── auth/callback/      ← OAuth route handler
```

### Rules

| Rule | Rationale |
|------|-----------|
| **One root layout** | Consistent nav/footer; login is CSS exception |
| **Add `loading.tsx`** per data-heavy segment (target) | Skeleton-first UX |
| **Add `error.tsx`** per segment (target) | Humanized failures |
| **Add `not-found.tsx`** (target) | Branded 404 |
| **No nested layouts** until IA hub requires — then `archive/layout` via RFC |

### Route handlers vs pages

| Use route handler | Use page |
|-------------------|----------|
| Webhooks, OAuth callback | User-facing UI |
| Third-party API proxy (Naver, AI) | Payment result display |
| Payment create/confirm | |

---

# 3. Directory Philosophy

```
mvp-60-1-next-js-app/
├── app/                 ← Routes only — minimal logic
├── components/          ← UI (migrating to ui/ + feature)
├── hooks/               ← Reusable client hooks (e.g. Naver search)
├── lib/                 ← Domain + infrastructure — no JSX
├── types/               ← Shared TypeScript types
├── data/                ← Static reference data (e.g. essay relations)
├── config/              ← Site constants
├── supabase/            ← Schema + migrations
└── docs/                ← Permanent documentation system
```

### Boundaries

| Directory | Contains | Must not contain |
|-----------|----------|------------------|
| `app/` | `page.tsx`, `layout.tsx`, `route.ts` | Business rules |
| `lib/` | Supabase queries, mappers, auth helpers | React components |
| `components/` | React UI | Direct Supabase in primitives (target) |
| `types/` | DB row types, form types | Runtime logic |

---

# 4. Feature-Based Organization

### Domain modules in `lib/`

| Module | Responsibility |
|--------|----------------|
| `lib/places/` | CRUD, mappers, upload, getters |
| `lib/collections/` | Collection list + detail queries |
| `lib/auth/` | Session user, redirect safety |
| `lib/supabase/` | Client, server, admin clients |
| `lib/payments/` | Constants, payment helpers |
| `lib/images/` | Crop utilities |
| `lib/kakao/` | SDK loader |
| `lib/async/` | `withTimeout` etc. |

### Feature components

| Component cluster | Domain |
|-------------------|--------|
| `PlaceForm`, `PlaceDetail`, `*PlacesList` | Places |
| `CollectionsList`, `CollectionDetailView` | Collections |
| `LoginForm`, `AuthNav` | Auth |
| `PremiumCheckout`, `PaymentSuccessResult` | Payments |

**Rule:** New domain → new `lib/[domain]/` + feature components — not scattered helpers in pages.

---

# 5. Shared Components

### Target structure

```
components/
├── ui/              ← Primitives (Button, Card, Dialog, Skeleton)
├── places/          ← Optional: group place feature components
├── collections/
└── [shared].tsx     ← EmptyState, StatusMessage until moved to ui/
```

### Shared patterns today

- `EmptyState`, `StatusMessage` — promote to `ui/`
- `PlaceCard` — single export with variants

**Anti-pattern:** Copy-paste list components (`ExplorePlacesList`, `MyPlacesList`, `SavedPlacesList`) — consolidate data hook + `PlaceList` wrapper (Tier 1).

---

# 6. Design Token Architecture

### Source of truth

`app/globals.css`:

1. `:root` CSS custom properties (semantic tokens)
2. `@theme inline` maps tokens to Tailwind utilities (expand to full set)

### Rules

| Rule | Detail |
|------|--------|
| Components use semantic tokens only | No `bg-[#87977F]` |
| New color need → add token first | Then `@theme` map |
| Typography via scale classes | Mapped to Design System roles |
| Motion tokens in CSS | `--motion-fast`, etc. |

### Migration strategy

Migrate by **surface**, not file-at-random:

1. `globals.css` full token + `@theme` map
2. `components/ui/*` primitives
3. Homepage → explore → detail → form → auth

---

# 7. Data Flow

### Read paths (current — client-heavy)

```
page.tsx (Server Component, thin)
  → feature List/Detail (Client Component)
    → lib/getX() via Supabase browser client
      → setState → render
```

### Target read paths

```
page.tsx
  → optional Server Component prefetch
  → Client interactive island OR
  → fully Server Component list where no client state needed
```

### Write paths

```
Form submit (Client)
  → lib/createPlace / updatePlace / supabase insert
  → redirect or optimistic update
```

### Data flow rules

1. **Mappers** (`mapPlaceRowToForm`, `mapPlaceFormToInsert`) — single place for shape conversion
2. **No raw Supabase row** in UI — map to view model at boundary
3. **Errors** caught at feature boundary — human message to user, `console.error` + detail internally
4. **No mock fallback** on production user paths — empty state instead

---

# 8. API Philosophy

### Route handlers in `app/api/`

| Endpoint | Role |
|----------|------|
| `/api/naver/search-place` | Proxy — hide API keys |
| `/api/ai/record-helper` | OpenAI — server-side key |
| `/api/payments/create`, `/confirm` | Toss — secrets server-only |

### Rules

| Rule | Rationale |
|------|-----------|
| **Proxy third-party APIs** | Keys never in client |
| **Validate input** on server | Especially AI and search |
| **Return minimal JSON** | No stack traces to client |
| **User errors humanized** at UI layer | API returns codes — UI maps to Korean |
| **No public REST** for core CRUD | Supabase client + RLS for places — acceptable for MVP; revisit if API surface grows |

### When to add new API routes

- Secret required
- Server-side transformation
- Rate limiting needed
- Not for bypassing RLS without justification

---

# 9. Server vs Client Components

### Default: Server Component

Use for:

- Static page shells
- `metadata` export
- Non-interactive layouts
- Future: initial data fetch without secrets in client

### Must be Client (`"use client"`)

- Forms, `useState`, `useEffect`
- Supabase auth listener (`AuthNav`)
- Maps (Naver SDK)
- Modals, bottom sheets with interaction
- File upload, image crop
- Payment widget (Toss)

### Split pattern (target)

```tsx
// page.tsx — Server
export default function Page() {
  return (
    <>
      <PageHeader ... />
      <ExplorePlacesList />  {/* client island */}
    </>
  );
}
```

**Avoid:** entire app client because one button needs state.

---

# 10. State Management Philosophy

### No global state library (default)

| State type | Solution |
|------------|----------|
| Form fields | `useState` in PlaceForm |
| List data | `useEffect` fetch + `useState` (target: SWR or server prefetch) |
| Auth user | Supabase `onAuthStateChange` + local state in AuthNav |
| Modal open | Local component state |
| URL state | Next.js `useRouter`, `useParams`, `searchParams` |

### When to add shared state

Only if **proven prop-drilling pain** across unrelated trees — prefer React context scoped to feature.

**Never** store server data in global client store without sync strategy.

---

# 11. Supabase Architecture

### Clients

| Client | Use |
|--------|-----|
| `lib/supabase/client.ts` | Browser — client components |
| `lib/supabase/server.ts` | Server Components / route handlers |
| `lib/supabase/admin.ts` | Privileged server-only — rare |

### Data tables (conceptual)

- `places` — user records
- `saved_places` — bookmarks
- `collections`, `collection_places`
- `payments` (premium flow)

### Rules

1. **RLS** is security boundary — not UI checks alone
2. **UI auth gate** for UX — still enforce RLS
3. **Never expose service role** to client
4. **User-facing errors** never say “Supabase”
5. Migrations in `supabase/migrations/` — version controlled

See [`supabase-setup.md`](../supabase-setup.md) for environment setup.

---

# 12. Authentication Flow

```
User → /login
  → Email/password or Kakao OAuth
  → OAuth: redirect /auth/callback?next=...
    → exchange code → session cookie
    → redirect safe path (getSafeAuthRedirectPath)
  → Client: supabase.auth.onAuthStateChange
```

### Rules

- `next` param sanitized — no open redirect
- Login page hides global header/footer
- Protected pages: client check + EmptyState — target: middleware for hard gate
- Logout → `signOut` → redirect `/`

---

# 13. Storage Architecture

### Place images

```
User selects file
  → ImageCropModal
  → uploadPlaceImage(file, userId)
  → Supabase Storage bucket
  → public URL stored on place row
```

### Rules

- Upload only after auth
- Validate file type/size client + server
- URLs in `next.config` remote patterns
- Crop before upload — consistent aspect

---

# 14. Image Pipeline

| Stage | Tool |
|-------|------|
| Select | `<input type="file">` |
| Crop | `react-easy-crop` + `lib/images/cropImage` |
| Preview | `URL.createObjectURL` — revoke on unmount |
| Upload | `lib/places/uploadPlaceImage` |
| Display | Next.js `Image` (target all cards) |

**Performance:** `sizes` attribute required; priority only for above-fold hero.

---

# 15. Error Boundary Philosophy

### Layers

| Layer | Responsibility |
|-------|----------------|
| `error.tsx` | Segment crash — branded recovery |
| Feature try/catch | Fetch failures → human message |
| API route try/catch | Log + safe JSON |
| Form validation | Inline field errors |

### User never sees

- Stack traces
- Supabase/Postgres messages
- `error.code` from Toss/OpenAI

### Target

- `error.tsx` at `app/` and key segments
- Optional error boundary around Map/SDK islands

---

# 16. Loading Strategy

| Mechanism | When |
|-----------|------|
| `loading.tsx` | Route transition — skeleton page |
| `LoadingSkeleton` | In-component refetch |
| Button `loading` label | Submit/mutation |
| `StatusMessage` | **Errors only** on lists (target) |

Align with [Interaction Specification](INTERACTION_SPECIFICATION.md) §6.

---

# 17. Caching Strategy

### Current (implicit)

- Client fetch on mount — no SWR
- Next.js static optimization where RSC allows

### Principles

| Data | Strategy |
|------|----------|
| Public places list | Short revalidate or client refetch on focus — not stale mock |
| User's archive | Private — `cache: no-store` or client fetch after auth |
| Static config | `config/site.ts` — build time |
| Naver search | No cache of user queries on server logs with PII |

### Target

- `revalidate` on public explore if moved to Server Component
- Do not cache auth responses in public CDN

---

# 18. Security Principles

1. **Secrets server-only** — API keys, service role, Toss secret
2. **RLS on all user tables**
3. **Sanitize redirects** — `lib/auth/redirect.ts`
4. **Input validation** on API routes
5. **No PII in client logs** — remove `console.log` place data in production (debt in PlaceDetail)
6. **HTTPS only** in production
7. **OAuth state** handled by Supabase
8. **CSP** — consider when adding more third-party scripts

---

# 19. Performance Principles

1. **Image optimization** — Next/Image, correct sizes
2. **Code split** — dynamic import for Map, Kakao, Toss, crop modal
3. **Minimize client JS** — Server Components where possible
4. **No infinite lists** — pagination if lists grow (archive-aligned)
5. **Timeout long queries** — `withTimeout` (collections)
6. **Avoid layout shift** — skeleton matches final layout

**Not optimized for:** sub-second feed refresh; engagement loops.

---

# 20. Testing Philosophy

### Priority (when tests are added)

| Priority | What |
|----------|------|
| 1 | Mappers (`mapPlaceFormToInsert`, etc.) |
| 2 | Auth redirect sanitization |
| 3 | Critical user flows (e2e): create → view → edit |
| 4 | API route input validation |

### Principles

- Test behavior — not implementation details
- No tests that assert Supabase error strings in UI
- E2E uses real empty states — not mock cards

**Current:** Minimal automated tests — document before expanding.

---

# 21. Documentation Philosophy

| Change type | Update |
|-------------|--------|
| New route | Information Architecture |
| New primitive | Component Specification + Design System |
| New interaction pattern | Interaction Specification |
| New feature | RFC archive + relevant architecture doc |
| Token change | Design System v2 + migration note |

`docs/` is part of the definition of done.

---

# 22. Refactoring Rules

1. **Refactor in service of Tier 1–2 roadmap** — token migration, card unification, skeletons
2. **Same PR scope** — one surface per PR when visual
3. **No drive-by** unrelated file changes
4. **Delete duplicate** when unifying — don't leave dead code
5. **RFC not required** for pure refactor with no user-visible behavior change
6. **RFC required** if refactor changes IA, privacy, or API contract

---

# 23. Technical Debt Rules

Align with [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) §8.

### Pay immediately

- User-facing Supabase errors
- Mock production content
- Auth/visibility bugs
- `window.confirm` delete

### Schedule

- Token migration
- Duplicate list components
- Client-only loading
- `components/ui/` extraction

### Do not borrow against

- RLS correctness
- Payment integrity
- Delete/export correctness

---

# 24. Future Migration Principles

| Migration | Approach |
|-----------|----------|
| **Archive hub route** | RFC → add `/archive` → redirect old paths |
| **Server Component lists** | One list at a time; keep skeleton UX |
| **Middleware auth** | Add without breaking OAuth callback |
| **Design tokens** | Surface-by-surface, no half-migrated pages |
| **Icon system** | Replace Unicode in one PR with components |

**Rule:** Migrations are **reversible** when possible — feature flags for large IA changes.

---

# 25. Engineering Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| Business logic in `page.tsx` | Untestable, duplicated |
| Raw Supabase in `ui/` primitives | Coupling |
| New API route for every read | Complexity |
| `any` types on DB rows | Breaks mappers |
| Mock data fallback in featured list | Trust violation |
| `console.log` PII in production | Privacy |
| Entire page `"use client"` | JS bloat |
| Hardcoded hex in new code | Design drift |
| Skipping RLS “because UI checks” | Security |
| Engagement analytics in client | Constitution |

---

# 26. Decision Checklist

Before technical implementation:

- [ ] RFC approved for net-new features
- [ ] Correct **directory** (`lib/` vs `components/` vs `app/api/`)
- [ ] **Server vs client** split justified
- [ ] **Secrets** stay server-side
- [ ] **Errors** humanized at UI
- [ ] **Loading** skeleton planned for data routes
- [ ] **RLS** considered for new tables
- [ ] **Tokens** — no new hex
- [ ] **Docs** updated if IA/component/interaction changes
- [ ] Aligns with [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)

---

*Engineering Architecture v1.0 — how Re:Place should be engineered.*

---

This document is part of the Re:Place documentation system.
