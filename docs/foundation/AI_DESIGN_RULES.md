---
title: AI Design Rules
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# AI Design Rules

**Document type:** Mandatory instructions for AI agents (Cursor, Codex, contributors)  
**Status:** v1.0  
**Authority:** Subordinate to Product Constitution; equal to Design System v2 for UI generation  
**Audience:** AI agents generating UI, UX, copy, layouts, or feature proposals

---

You are building **Re:Place** — a quiet Korean-first lifestyle archive for meaningful places and memories. You are not building a social app, SaaS dashboard, review site, or travel booking product.

Before outputting anything, internalize: **Design System v2** (tokens/components) and **Visual Language Guide** (soul). This document adds **behavioral constraints** for AI output.

---

## 1. How AI should interpret Re:Place

Re:Place is:

- A **personal place journal** someone reopens years later  
- A **curated archive** of visits, feelings, and return intent  
- A **warm, calm, trustworthy** Korean product  

Re:Place is not:

- Instagram, Pinterest, or a place-review platform  
- Notion, Airtable, or an admin dashboard  
- Booking.com, Naver Place, or a map-first utility  
- Duolingo, streak apps, or gamified habit trackers  

When uncertain, choose the option that feels like **turning a page in a notebook** — not **refreshing a feed** or **checking a dashboard**.

---

## 2. UI generation rules

### Prefer

- Fewer cards per screen — quality over grid density  
- Fewer buttons — one primary action per section  
- Larger spacing between sections and cards  
- Larger photography with consistent aspect ratios (4:3 grid, 16:10 hero)  
- Editorial hierarchy: eyebrow → title → lead → content  
- Soft surfaces, olive/sage/beige palette from Design System v2  
- Rounded-full buttons, rounded-md cards — no arbitrary radii  
- Content-width reading columns — not full-bleed text walls  

### Never

- Dashboard layouts (KPI tiles, charts, widget grids, sidebars full of stats)  
- Glassmorphism, neon, colorful gradients, dark-mode-purple SaaS aesthetics  
- Dense multi-column admin tables as default user views  
- Notification bells with red badge counts as hero chrome  
- Mixed card styles on the same grid (different radii, image strategies)  
- Raw hex colors or one-off Tailwind arbitrary values — use semantic tokens  
- Decorative English copy (“Archive note”, “Explore Feed”)  
- More than **5 top-level navigation items** without grouped hierarchy  

---

## 3. UX flow rules

### Prefer

- Short paths: open → read memory → optional save/share  
- Progressive disclosure in forms (essentials first, “추가 정보” later)  
- Clear back/context (“둘러보기로 돌아가기”) without breadcrumb clutter  
- Owner actions (edit/delete) separated from visitor actions (save/share)  
- Confirmation modals for destructive actions — warm copy, clear consequence  
- Mobile-first: thumb-reachable primary CTA, 44px touch targets  
- Skeleton loaders matching card shape — not full-page “불러오는 중…” boxes  

### Never

- Infinite scroll as the default browse pattern  
- Auto-advancing carousels  
- Forced onboarding tours with 5+ steps before first value  
- `window.confirm` for delete — use in-app modal  
- Multi-button action walls above content on place detail (mobile)  
- Redirect loops that hide whether save succeeded  
- Blocking create flow behind 10 fields  

---

## 4. Copywriting rules

### Prefer

- **Korean-first** — natural, warm, specific  
- Short sentences — one idea per line  
- Verb-first buttons: “장소 기록하기”, “저장하기”, “둘러보기”  
- Place- and memory-centered nouns: 장소, 순간, 기록, 아카이브  
- Calm success: “좋은 장소가 기록되었습니다.”  
- Errors that apologize and suggest retry — no blame  

### Never

- Technical messages: Supabase, API, database, error codes, CRUD, MVP, 설정  
- English UI strings (except Re:Place, Kakao, Naver as proper nouns)  
- Exclamation-heavy marketing (“지금 바로!!!”)  
- Gamification language (레벨, 스트릭, 랭킹)  
- SaaS tropes (“Unlock premium power”, “Supercharge your workflow”)  
- Urgency copy (“놓치지 마세요”, countdown timers)  
- Fake social proof (“1,234명이 사용 중”)  

---

## 5. Empty / error / loading state rules

### Empty states

- Feel like an **unfilled notebook page** — invitation, not failure  
- Include: short title + one-line description + **one** CTA  
- Use `EmptyState` pattern — warm, centered, generous padding  
- Never: large whimsical illustrations, “Oops!”, party emoji  

### Error states

- User message: what happened + what to do  
- Example: “잠시 불러오지 못했어요. 다시 시도해주세요.”  
- Log technical detail internally — **never** show to user  
- Never: stack traces, `error.code`, config instructions  

### Loading states

- Skeleton grids matching `PlaceCard` / `CollectionCard` geometry  
- Prefer route-level loading for navigations  
- `StatusMessage` for errors and rare full-page states — **not** routine list loading  
- Never: blocking spinner as the only content shape  

---

## 6. Feature proposal rules

Before proposing a feature, AI must verify:

| Check | Requirement |
|-------|-------------|
| Archive value | Helps remember, revisit, or organize places |
| Identity fit | Not primarily social, gamified, or dashboard-like |
| Calm | Reduces or does not increase anxiety/urgency |
| Solo viability | Useful even if no other users exist |
| Trust | No fake data, dark patterns, or hidden publishing |
| Constitution | Passes Product Constitution feature acceptance |

### AI may propose

- Better record writing (AI polish, prompts — user-controlled)  
- Revisit experience (timelines, “다시 가고 싶은 마음” views)  
- Collection curation improvements  
- Export / print / PDF archive (future)  
- Calm public sharing and collection browsing  
- Gentle partner curation **if** labeled and archive-toned — not feed-ranked  

### AI must not propose without explicit human approval

- Followers, likes, comments, rankings  
- Streaks, badges, points  
- Push notification systems optimized for re-engagement  
- User analytics dashboards for end users  
- Aggressive premium upsell modals  
- Trend-driven visual redesigns  
- Mock content on production-facing surfaces  

---

## 7. What AI must ask before adding anything

If the user request is ambiguous, **ask** (or state assumptions explicitly):

1. **Does this affect public or private records?** Default must remain private-safe.  
2. **Is this user-facing or admin-only?** Admin patterns must not leak into archive UI.  
3. **Does this need real data?** If yes, wire data — do not ship mock cards as if live.  
4. **How many primary actions does this add?** If more than one per section, justify or simplify.  
5. **Does this add a nav item?** Nav changes require hierarchy proposal — not flat expansion.  
6. **Does this expose third-party failure?** Map/Naver/Kakao/Toss errors must be humanized.  
7. **Is this AI-generated content?** Must be opt-in, editable, clearly assistive — not auto-published.  

If the user asks for something that violates these rules, **explain the conflict** and offer a Re:Place-aligned alternative.

---

## 8. Final AI self-checklist before output

Before submitting UI, copy, or feature code/docs, confirm:

**Identity**  
- [ ] Feels like a place journal — not social, SaaS, or dashboard  
- [ ] Content (memory, photo, place name) leads; chrome recedes  

**Visual**  
- [ ] Uses Design System v2 tokens — no raw hex / arbitrary radii  
- [ ] One primary green CTA per section  
- [ ] Spacious layout, consistent card variant  
- [ ] No glassmorphism, neon, heavy gradients  

**UX**  
- [ ] One primary action per screen section  
- [ ] Mobile-first, 44px targets, skeleton loading for lists  
- [ ] No infinite feed, gamification, or engagement metrics  

**Copy**  
- [ ] Korean-first, warm, non-technical  
- [ ] No MVP/dev/error-code language  
- [ ] Calm success — no celebration theatrics  

**Trust**  
- [ ] No fake content presented as real  
- [ ] Public/private explicit where relevant  
- [ ] Destructive actions use modal — not browser confirm  

**Governance**  
- [ ] Aligns with Core Product Principles  
- [ ] Would pass Re:Place Test (Visual Language Guide §14)  
- [ ] Would not be rejected by Product Constitution  

If any box fails, **revise before output**.

---

This document is part of the Re:Place documentation system.
