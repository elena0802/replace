---
title: Information Architecture
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Information Architecture

**Document type:** Information architecture reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); implements [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md)  
**Companion docs:** [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) · [Design System v2](../foundation/DESIGN_SYSTEM_V2.md)  
**Purpose:** Define the complete mental model of Re:Place and answer: **Where should a feature live?**

---

## How to Use This Document

1. Before adding a route, nav item, or screen — locate it in this hierarchy.
2. If a feature does not fit cleanly, **redesign IA** before adding surface area (see [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md)).
3. Current implementation may lag this spec; treat gaps as **Tier 1–2 roadmap debt**, not permission to invent parallel IA.

---

# 1. Information Architecture Philosophy

Re:Place information architecture is **archive-first**, not feed-first.

| Principle | Meaning |
|-----------|---------|
| **Library over timeline** | Users navigate collections of records — not scrolling activity |
| **Ownership before audience** | Personal archive is primary; public browse is secondary |
| **One job per screen** | Each route has a single recognizable purpose |
| **Shallow paths, deep content** | Few hops to record; richness lives in place detail |
| **Progressive disclosure** | Essentials first; metadata and options unfold later |
| **Calm orientation** | User always knows: where am I, what is mine, what is others’ |

IA must align with [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md): personal archive before public feed, return before discovery, ownership before engagement.

> If a feature increases nav count without clarifying mental model, it fails IA — regardless of utility.

---

# 2. Archive-First Mental Model

The user’s mental model has **three layers**:

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1 — MY ARCHIVE (primary)                         │
│  Records I wrote · Places I saved · Collections I curate │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│  LAYER 2 — CREATE & REVISIT                             │
│  Record a place · Open a memory · Organize into collection │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│  LAYER 3 — DISCOVER (secondary)                         │
│  Browse public places · Browse public collections         │
└─────────────────────────────────────────────────────────┘
```

### Entity relationships

| Entity | Owner | Visibility | User verb |
|--------|-------|------------|-----------|
| **Place record** | User who created it | Public or private | 기록하다, 수정하다, revisiting |
| **Saved place** | User who saved | Bookmark of **public** place | 저장하다 |
| **Collection** | User who created it | Public or private | 묶다, 열어보다 |
| **Collection place** | — | Link between collection and place | 담다, 제거하다 |

**Critical distinction (must stay teachable):**

| Concept | Question it answers |
|---------|---------------------|
| **내 장소** | What did **I** record? |
| **저장한 장소** | What **others’ public** places did I bookmark? |
| **컬렉션** | How did **I** group places into a theme? |

---

# 3. Navigation Hierarchy

### Target global navigation (v1 spec)

Reduce flat seven-item nav to **four primary jobs**:

| # | Label (KO) | Job | Routes |
|---|------------|-----|--------|
| 1 | **기록하기** | Create | `/places/new` |
| 2 | **둘러보기** | Discover public archive | `/explore`, public `/collections` |
| 3 | **내 아카이브** | Personal library (hub) | `/my-places`, `/saved`, `/collections` |
| 4 | **계정** | Auth, settings, pricing | `/login`, `/pricing` (footer or account menu) |

**홈** (`/`) remains marketing/orientation — not a fourth browse mode.

### Current implementation note

Today’s root layout exposes seven peer links (홈, 기록하기, 둘러보기, 저장한 장소, 컬렉션, 내 장소, 요금제). This is **known IA debt** — migrate toward hub model without adding eighth item.

### Navigation rules

1. **Maximum five top-level destinations** on any viewport.
2. **Active route** must be visually indicated (underline, pill, or weight).
3. **요금제** belongs in account/footer — not competing with archive jobs.
4. **No notification bell** in primary nav (constitution).
5. Mobile: prefer **bottom tab bar** for 기록하기 / 둘러보기 / 내 아카이브 when hub ships.

---

# 4. Screen Hierarchy

### Level 0 — App shell

- Global header (logo, nav, auth)
- Footer (tagline, legal, pricing link)
- Exception: `/login` — full-screen auth mode (no global header/footer)

### Level 1 — Primary destinations

| Screen | Level-1 purpose |
|--------|-----------------|
| Home `/` | Orient + invite to record or explore |
| Explore `/explore` | Browse public place records |
| My Archive hub | Access owned, saved, collections |
| Create `/places/new` | Record new place |
| Pricing `/pricing` | Compare plans (account context) |
| Login `/login` | Authenticate |

### Level 2 — Entity lists (within hub or discover)

Place cards show a **short region/location label** (e.g. `서울 송파구`) for quick recognition — not the full stored address. Full address belongs on place detail, location card, and map/directions surfaces.

| Screen | Purpose |
|--------|---------|
| `/my-places` | Grid of user’s owned records |
| `/saved` | Grid of bookmarked public places |
| `/collections` | Create + list my/public collections |

### Level 3 — Entity detail

| Screen | Purpose |
|--------|---------|
| `/places/[id]` | Read one place memory (visitor or owner) |
| `/collections/[id]` | Read one collection + its places |

### Level 4 — Entity mutation

| Screen | Purpose |
|--------|---------|
| `/places/[id]/edit` | Edit owned place |
| Modals/sheets | Add to collection, directions, delete confirm |

### Level 5 — Transaction / auth outcomes

| Screen | Purpose |
|--------|---------|
| `/payment/success`, `/payment/fail` | Payment result |
| `/auth/callback` | OAuth (non-UI route) |

**Rule:** Do not add Level 1 screens without RFC. Prefer Level 4 modal over new Level 1 route.

---

# 5. Global Navigation

### Header anatomy

```
[ Logo → / ]  [ Primary nav items ]  [ Auth: 로그인 | 로그아웃 ]
```

| Element | Behavior |
|---------|----------|
| Logo | Always → `/` |
| Primary nav | Target: 3–4 items; current: 7 (debt) |
| Auth | `AuthNav` — login link or logout button |
| Mobile menu | `<details>` dropdown today; target: bottom nav + condensed header |

### What global nav must never contain

- Search (until archive search RFC — then scoped to 내 아카이브)
- Notifications / activity
- Create FAB competing with “기록하기” (pick one pattern)
- Engagement badges (saved count, streak)

---

# 6. Mobile Navigation

### Philosophy

Recording happens on location — mobile IA leads.

| Priority | Placement |
|----------|-----------|
| Create | Primary CTA — header or bottom tab “기록하기” |
| Archive access | Bottom tab “내 아카이브” or hub entry |
| Discover | Bottom tab “둘러보기” |
| Account | Header corner or hub sub-menu |

### Mobile patterns

- **Bottom sheet** for directions, add-to-collection, secondary actions
- **Sticky bottom action bar** on place detail (target) — save, share; owner actions in overflow
- **Single column** card grids — full width cards
- **No horizontal-only critical paths** — carousel is supplementary, not sole access

### Mobile anti-patterns on nav

- Hamburger hiding all archive destinations with no active indicator
- Seven-item dropdown with no close-on-navigate
- Action button wall above fold on place detail

---

# 7. Desktop Navigation

### Philosophy

Desktop adds **horizontal space for reading**, not dashboard density.

| Pattern | Usage |
|---------|--------|
| Inline header nav | Same items as mobile — not a different IA |
| Two-column detail | Place memory + “머물렀던 순간” sidebar |
| Collections page | Create form column + grid column (acceptable at `lg+`) |
| Wider grids | 3-column place grids — same card variant as mobile |

Desktop must not introduce:

- Left sidebar admin navigation for end users
- Multi-panel dashboards
- Hover-only critical actions without keyboard equivalent

---

# 8. Route Structure

### Canonical route map

| Route | Type | Auth | IA layer |
|-------|------|------|----------|
| `/` | Page | Open | Orient |
| `/explore` | Page | Open | Discover |
| `/places/new` | Page | Required | Create |
| `/places/[id]` | Page | Open* | Detail |
| `/places/[id]/edit` | Page | Owner | Mutate |
| `/my-places` | Page | Required | Archive — owned |
| `/saved` | Page | Required | Archive — saved |
| `/collections` | Page | Partial** | Archive + discover |
| `/collections/[id]` | Page | Gated*** | Detail |
| `/login` | Page | Open | Account |
| `/pricing` | Page | Open | Account |
| `/payment/success` | Page | Session | Transaction |
| `/payment/fail` | Page | Open | Transaction |
| `/auth/callback` | Route handler | — | Auth |
| `/api/*` | API | Varies | Infrastructure |

\* Public places viewable logged out; private owner-only  
\*\* Public collections browsable logged out; create requires auth  
\*\*\* Private collections require owner login

### API routes (not in user IA)

| Route | Purpose |
|-------|---------|
| `/api/naver/search-place` | Place search proxy |
| `/api/ai/record-helper` | Memory polish |
| `/api/payments/create`, `/confirm` | Toss payments |

API routes are **never** linked from marketing IA as user destinations.

---

# 9. URL Philosophy

### Principles

| Rule | Rationale |
|------|-----------|
| **Semantic paths** | `/places/[id]` not `/p/[id]` — readable, shareable |
| **Stable URLs** | Place ID in URL is canonical; slug optional future enhancement |
| **No locale in path (v1)** | Korean-first product; single `lang="ko"` |
| **Lowercase, hyphenated** | `/my-places` not `/myPlaces` |
| **Mutation on distinct paths** | `/edit` suffix for edit — not `?mode=edit` as primary |
| **Auth callback isolated** | `/auth/callback` — not mixed with `/login` |

### Query parameters

| Allowed | Example |
|---------|---------|
| Auth redirect | `/login?next=/my-places` (sanitized) |
| OAuth error | `/login?error=oauth_*` |
| Payment return | Toss params on success/fail — humanized on page |

| Discouraged | Why |
|-------------|-----|
| Tab state only in URL for core IA | `/archive?tab=saved` — prefer path or hub until RFC |
| Tracking params in user-facing links | UTM on internal nav — avoid |

### Future URL reservations

| Path | Reserved for |
|------|--------------|
| `/archive` | Unified 내 아카이브 hub (RFC required) |
| `/settings` | Account settings |
| `/export` | Premium export flow |

Do not claim reserved paths for unrelated features.

---

# 10. Screen Relationships

## Home `/`

**Role:** Orient and invite — not a browse feed.

| Relationship | Direction |
|--------------|-----------|
| → Create | Primary CTA → `/places/new` |
| → Discover | Secondary CTA → `/explore` |
| → Featured | Teaser of public places → `/places/[id]` |
| → Collections teaser | Target: real public collections → `/collections` or `/collections/[id]` |

**Must not become:** infinite feed, activity timeline, dashboard.

---

## Explore `/explore`

**Role:** Calm gallery of **public place records**.

| Relationship | Direction |
|--------------|-----------|
| ← Home | Marketing link |
| → Place detail | Card → `/places/[id]` |
| → Create | Empty state CTA → `/places/new` |

**Scope:** Public `places` only — not saved, not collections mixed in.

---

## My Archive (hub concept)

**Role:** Single mental home for **everything mine**.

### Sub-destinations (current paths)

| Sub-screen | Path | Content |
|------------|------|---------|
| 내 장소 | `/my-places` | Records I created |
| 저장한 장소 | `/saved` | Public places I bookmarked |
| 컬렉션 | `/collections` | Collections I created + create form |

**Target:** `/archive` hub with tabs or sections — RFC before implementation.

| Relationship | Rule |
|--------------|------|
| vs Explore | Archive = mine; Explore = others’ public |
| vs Home | Home invites; Archive holds |

---

## Places

### Create `/places/new`

- Entry: nav “기록하기”, CTAs, empty states
- Exit: success → `/my-places` (or detail — RFC if changed)
- Auth gate: login required

### Detail `/places/[id]`

- **Content first:** image, name, memory, location, metadata sidebar
- **Visitor actions:** save (if public), add to collection, Kakao share
- **Owner actions:** edit, delete
- Back links: explore, my-places — contextual, not breadcrumb tree

### Edit `/places/[id]/edit`

- Owner only
- Same form as create — mode `edit`
- Exit: back to detail or my-places

---

## Saved `/saved`

**Role:** Bookmarks of **others’ public places** — not owned records.

| vs 내 장소 | Saved = someone else’s public record I kept |
| vs 컬렉션 | Saved = flat list; Collection = themed group |

---

## Collections

### List `/collections`

- **Left / top:** create form (auth)
- **Sections:** 내 컬렉션, 공개 컬렉션
- Public section = discover secondary — not mixed with explore places grid on same screen without section headers

### Detail `/collections/[id]`

- Cover, description, place grid
- Owner: edit, delete, remove places
- Visitor: read-only

---

## Profile

**Current state:** No `/profile` route — auth via header only.

| Today | Target |
|-------|--------|
| Login/logout in header | `/settings` or account sheet: email, logout, pricing, export |
| No public profile pages | **Constitution:** places before people — no follower profile |

**Profile IA rule:** Account settings only — never creator profile as discovery surface.

---

# 11. Ownership Hierarchy

```
User
├── Places (owned)
│   ├── public → visible on /explore
│   └── private → visible only to owner on /my-places
├── Saved places (bookmarks)
│   └── references public place by others
└── Collections (owned)
    ├── public → visible in 공개 컬렉션
    └── private → owner only
        └── Collection places (links)
```

### Permission matrix

| Action | Owner | Visitor (public) | Visitor (private) |
|--------|-------|------------------|-------------------|
| View place | ✅ | ✅ if public | ❌ |
| Edit/delete place | ✅ | ❌ | ❌ |
| Save place | — | ✅ if public | ❌ |
| Add to own collection | — | ✅ if public | ❌ |
| View collection | ✅ | ✅ if public | ❌ |
| Edit collection | ✅ | ❌ | ❌ |

---

# 12. Public vs Private Hierarchy

### Default

**Private unless user explicitly chooses public** at create/edit (must be visible in primary flow — not buried in collapsed section long-term).

### Visibility surfaces

| Surface | Shows |
|---------|--------|
| `/my-places` | All owned (badge: 공개/비공개) |
| `/explore` | Public places only |
| `/saved` | Saved public places |
| `/collections` | My collections + public collections |
| Place detail | Badge/chip for 공개/비공개 |

### IA rules for visibility

1. Never mix private records into public browse grids.
2. Never show “0 saves” or view counts on public detail (constitution).
3. Share (Kakao) only on **public** places — explicit user action.
4. Login-required empty states must say why — not generic error.

---

# 13. Search Architecture

### Current state

- **Place name search** exists inside create flow (Naver local search) — not global search.
- **No global archive search** in production.

### Target architecture (RFC before build)

| Search scope | Where it lives | Searches |
|--------------|----------------|----------|
| **Archive search** | 내 아카이브 hub | My place names, memories, regions |
| **Place attach search** | Create/edit form only | Naver place API |
| **Public discover filter** | Explore (optional future) | Category, region — filter not keyword spam |

### Search rules

- **No global search bar in header** until archive search ships — avoids “search the internet” expectation.
- Search results open **entity detail** — not inline feed.
- No search ranking by popularity/likes.
- Empty search: calm copy + suggest create or clear query.

---

# 14. Progressive Disclosure Principles

Aligns with [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) layout philosophy.

| Layer | Visible when |
|-------|--------------|
| **Essential** | Always on create: photo, place, memory |
| **Important** | Public/private — surface near submit (target) |
| **Optional** | Category, visit date, companion, space tags — “추가 정보” |
| **Advanced** | AI helper — after memory field started |
| **Owner-only** | Edit/delete on detail |
| **Visitor-only** | Save/share on public detail |

### Rules

1. First-time create: **≤ 3 decisions** before save possible.
2. Collapsed sections must **indicate** what is inside (“공개 여부, 카테고리…”).
3. Do not hide public/private on create indefinitely (trust risk).
4. Detail page: memory before metadata sidebar.
5. Card metadata supports recognition, not navigation — region label on PlaceCard; full address on detail/location/map only.

---

# 15. Future Expansion Rules

Before adding IA surface area:

| Check | Requirement |
|-------|-------------|
| RFC | [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) completed |
| Tier | [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) tier assigned |
| Nav budget | Does not exceed five top-level items without hub redesign |
| Mental model | Maps to archive, discover, or account — not new fourth pillar |
| Constitution | Not on Never list |

### Approved expansion directions (examples)

| Feature | Lives at |
|---------|----------|
| Revisit by season | `/my-places` filter or `/archive` view |
| Export PDF | Account / premium flow — not nav item |
| Partner exhibit | `/explore` editorial block or `/collections/[id]` — labeled |
| Map view of my places | Sub-view of 내 장소 — not default home |

### Rejected expansion (default)

| Feature | Why no home |
|---------|-------------|
| Followers | No profile IA |
| Comments on places | No social thread surface |
| Activity feed | No `/feed` |
| User stats dashboard | No `/stats` |

---

# 16. IA Anti-Patterns

| Anti-pattern | Why it conflicts | Example to avoid |
|--------------|------------------|------------------|
| **Flat nav sprawl** | Seven+ peer items — user lost | Adding “알림”, “랭킹” to header |
| **Feed as home** | Discovery before return | Homepage infinite scroll |
| **Dashboard landing** | Metrics over memory | KPI tiles on `/` |
| **Duplicate destinations** | Same content, two paths | Saved + Likes |
| **Mock IA** | Cards that do not navigate | Homepage collection carousel |
| **Profile-centric** | People over places | `/users/[id]` creator pages |
| **Tab-only archive** | URLs not shareable | Internal state only for my/saved/collections |
| **Mixed grids** | Owned + public in one list | “Everything” feed |
| **Search without scope** | User expects Google | Global header search to Naver |
| **Settings in primary nav** | Competes with archive | “설정” as 4th top-level peer |

---

# 17. Decision Checklist

Before adding or moving a feature in IA:

### Fit

- [ ] Maps to **archive**, **discover**, **create**, or **account** — not social/dashboard
- [ ] Strengthens [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md) mental model
- [ ] User can answer “is this mine or others’?” on this screen

### Placement

- [ ] **Single primary purpose** per route
- [ ] Correct **ownership layer** (owned / saved / collection / public)
- [ ] Does not add **eighth nav item** without hub redesign RFC
- [ ] URL is **semantic and stable**

### Experience

- [ ] **Progressive disclosure** — essentials not buried
- [ ] **Mobile path** ≤ 3 taps from tab bar to core action
- [ ] Back/context links do not duplicate nav confusion

### Governance

- [ ] RFC completed for new Level 1–2 routes
- [ ] Not on [Roadmap Never list](../process/PRODUCT_ROADMAP_PHILOSOPHY.md)
- [ ] Passes [Re:Place Test](../foundation/VISUAL_LANGUAGE_GUIDE.md) §14

---

## Quick Reference: Where Should a Feature Live?

| If the feature… | It lives… |
|-----------------|-----------|
| Records a new place | `/places/new` |
| Shows one memory | `/places/[id]` |
| Lists my records | `/my-places` (or `/archive`) |
| Bookmarks public place | `/saved` |
| Groups places | `/collections`, `/collections/[id]` |
| Browses others’ public records | `/explore` |
| Browses others’ public collections | `/collections` public section |
| Authenticates | `/login` |
| Pays for premium | `/pricing`, payment result pages |
| Searches Naver to attach place | Create/edit form only |
| Searches my memories | 내 아카이브 hub (future RFC) |
| Shows account/settings | Account menu (future `/settings`) |
| Shows notifications | **Nowhere** (constitution) |
| Shows follower feed | **Nowhere** (constitution) |

---

*Information Architecture v1.0 — the mental map of Re:Place.*

---

This document is part of the Re:Place documentation system.
