---
title: Product Roadmap Philosophy
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Product Roadmap Philosophy

**Document type:** Roadmap decision framework  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); implements [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md)  
**Audience:** Product, design, engineering, leadership, AI agents  
**Purpose:** Define **how** Re:Place decides what gets built first — not **what** is on the roadmap this quarter

---

> This is not a feature list.  
> It is the philosophy that keeps Re:Place an archive — not a feed, dashboard, or growth experiment.

---

## How to Use This Document

1. **Before prioritizing work**, identify which **Tier** the proposal belongs to.
2. **Score the proposal** using the Prioritization Framework (§7).
3. **Check the Never list** (§6) — if the idea appears there, stop unless the Constitution is formally amended.
4. **Write an RFC** using [Feature RFC Template](FEATURE_RFC_TEMPLATE.md) before implementation.
5. **Review quarterly** using the Roadmap Review Checklist (§12).

When roadmap pressure conflicts with the [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md), **the Constitution wins**.

---

# 1. Why Roadmaps Fail

Most product roadmaps fail Re:Place — and most lifestyle products — for predictable reasons:

| Failure mode | What goes wrong | Re:Place risk |
|--------------|-----------------|---------------|
| **Metric-driven roadmaps** | DAU, session length, and conversion dominate; archive quality degrades | Becomes engagement app wearing journal clothes |
| **Competitor-shaped roadmaps** | “App X shipped stories — we need stories” | Loses olive-beige soul; copies wrong category |
| **Feature accumulation** | Every request adds surface area; IA collapses | Seven nav items become twelve; users lost |
| **Debt denial** | New features ship on mock data, duplicate components, broken trust | Homepage lies; errors expose Supabase |
| **Tier inversion** | Delight and expansion ship before foundation and archive experience | Premium badges before honest empty states |
| **Horizon confusion** | Experimental ideas ship as production defaults | MVP labels, test payment copy in user UI |
| **No rejection doctrine** | Everything “maybe later” — nothing explicitly **never** | Social features creep in through backlog |

Re:Place roadmaps must **protect identity first**, then deepen the archive, then delight — then expand — then experiment.

---

# 2. Re:Place Roadmap Philosophy

Re:Place builds in **layers of trust**, not **sprints of features**.

### Core beliefs

1. **The archive is the product.** Everything else supports remembering, revisiting, or carefully sharing.
2. **Fewer things, done honestly.** One unified PlaceCard beats three card types and a new explore algorithm.
3. **Return value compounds.** Features that help users reopen old records age better than features that chase novelty.
4. **Calm is a moat.** In a loud market, restraint is differentiation — not a launch handicap.
5. **Solo value is the test.** If a feature only works with a crowd, it is probably social — not archival.
6. **Rejection is strategy.** Explicit “never” lists protect more value than optimistic backlogs.

### What a Re:Place roadmap optimizes for

| Optimize for | Not for |
|--------------|---------|
| Memory quality | Record quantity |
| Revisit pleasure | Session frequency |
| Trust and honesty | Vanity metrics |
| IA clarity | Nav item count |
| Timeless craft | Trend alignment |
| Owner control | Audience growth |

### Roadmap time horizons

| Horizon | Question |
|---------|----------|
| **Now** | What makes the archive truthful and usable today? |
| **Next** | What makes revisiting and organizing deeply satisfying? |
| **Later** | What gentle expansion respects identity? |
| **Never (default)** | What must wait for constitutional amendment? |

---

# 3. What “Priority” Means

In Re:Place, **priority is not urgency**. Priority is **alignment with long-term archive value**.

### Priority definition

> A high-priority item strengthens the user’s ability to **remember**, **revisit**, or **trust** their place archive — without compromising calm or ownership.

### Priority is high when

- It fixes **trust breaks** (mock homepage, technical errors, unclear public/private)
- It removes **confusion** (saved vs owned vs collections)
- It unifies **craft debt** (design system, one card, token discipline)
- It improves **core record loop** (create → view in my archive → revisit)
- It helps users **return** to old memories with pleasure

### Priority is low when

- It mainly increases **browse time** without deepening attachment
- It requires **social density** to deliver value
- It adds **metrics users didn’t ask for**
- It is **trend-shaped** (“make it feel more like ___”)
- It **expands nav** without hierarchy redesign
- It **polishes monetization** before core archive is honest

### Priority is not

- Loudest stakeholder request
- Fastest demo for investors
- Most copyable competitor feature
- Highest estimated DAU impact

---

# 4. What Creates Long-Term Value

Long-term value in Re:Place accrues when users **trust the product enough to keep writing** — and **want to reopen** what they wrote.

| Value driver | Mechanism | Example direction |
|--------------|-----------|-------------------|
| **Memory depth** | Better writing, photos, location attach | AI polish (opt-in), crop, Naver search reliability |
| **Revisit pleasure** | Beautiful detail, calm typography, chronological browse | Revisit views, seasonal grouping |
| **Organization** | Collections, saves, clear IA | Unified “내 아카이브” hub |
| **Trust** | Real data, human errors, explicit visibility | Remove mock sections; scrub dev copy |
| **Portability** | Export, print, PDF | Premium-aligned archive export |
| **Craft stability** | Design system, fewer duplicates | One PlaceCard, tokens in `@theme` |
| **Selective sharing** | Public browse as museum, not feed | Curated public collections |

### What does **not** create long-term value

- Follower counts, likes, leaderboards
- Notification-driven return visits
- Infinite discovery feeds
- User stat dashboards (“you recorded 47 places this year!” as primary UX)
- Feature count as progress signal

---

# 5. Layers of Product Evolution

Re:Place evolves in **five tiers**. Work should generally **complete lower tiers** before upper tiers consume disproportionate effort.

```
Tier 1 — Foundation        (truth, trust, system)
Tier 2 — Archive experience (remember, revisit, organize)
Tier 3 — Delight           (polish, sensory pleasure, small surprises)
Tier 4 — Expansion         (sharing, partners, premium depth)
Tier 5 — Experimental      (hypotheses — isolated, reversible)
```

**Tier rule:** No Tier 3+ project may ship while known Tier 1 violations remain in production (e.g. mock homepage collections, Supabase error strings).

---

## Tier 1 — Foundation

### Goals

Make Re:Place **honest, coherent, and trustworthy** as infrastructure for memory.

### What belongs

- Design System v2 token enforcement in code
- Unified PlaceCard / CollectionCard components
- Navigation hierarchy redesign (grouped archive hub)
- Remove mock/fake production content
- Humanized error and loading patterns (skeletons)
- Public/private clarity at save time
- RFC process adoption for all net-new features
- Documentation system maintenance (foundation + process docs)

### What does NOT belong

- Social features “while we’re at it”
- Premium upsell redesigns
- New browse algorithms
- Marketing landing experiments unrelated to trust
- Trend-driven visual rebrands

### Examples

| In scope | Out of scope |
|----------|--------------|
| Wire homepage to real collections or honest empty state | Add trending places rail |
| Consolidate three list-loading patterns + skeletons | Add user analytics dashboard |
| Scrub “Supabase 설정” and “MVP 테스트” from user UI | Add streak counter to create flow |
| Implement `PageHeader` + semantic tokens | Glassmorphism hero refresh |

---

## Tier 2 — Archive Experience

### Goals

Make **creating, owning, revisiting, and organizing** places deeply satisfying.

### What belongs

- Improved record creation flow (progressive disclosure, quick record path)
- Revisit-oriented views (by revisit level, region, season, date)
- Unified “내 아카이브” (내 장소 / 저장 / 컬렉션) with clear mental model
- Collection storytelling (cover, description, calm browse)
- Place detail layout: content-first, actions receded
- Search within **my** archive (not global social search)
- Better empty states tied to real next steps
- Image and location quality (crop, map, directions — in service of memory)

### What does NOT belong

- Public engagement rankings
- Comments on places
- Follow creators
- Infinite public explore feed
- Gamified “record more” prompts

### Examples

| In scope | Out of scope |
|----------|--------------|
| “다시 가고 싶은 마음” filtered view of my places | “Most saved places this week” |
| Collection detail as curated exhibit | Activity feed of friend saves |
| Mobile bottom action bar on place detail | Like button with count |
| Optional visit date enrichment | Mandatory 12-field create form |

---

## Tier 3 — Delight

### Goals

Add **sensory pleasure and emotional reward** without breaking calm or trust.

Delight in Re:Place is **quiet pleasure** — not confetti.

### What belongs

- Subtle motion (card lift, save confirmation)
- Editorial homepage moments (real featured places, honest hero)
- Print-quality typography refinement (Pretendard, type scale)
- Seasonal empty-state copy rotation
- Thoughtful onboarding (one screen, skippable, value-first)
- Export preview that feels like a book spread
- Small easter eggs in copy — never in metrics

### What does NOT belong

- Celebration animations on save
- Badge pops and streak flames
- Loud sound effects
- Parallax marketing pages
- Delight that increases anxiety (countdowns, “don’t lose your streak”)

### Examples

| In scope | Out of scope |
|----------|--------------|
| Soft skeleton fade-in matching card shape | Slot-machine loading spinner |
| Hero collage with real community photos | Auto-playing video background |
| “기록이 잘 남았어요” calm toast | “Level up!” modal |
| Partner essay block — editorial, optional | Interruptive full-screen promo |

---

## Tier 4 — Expansion

### Goals

Extend the archive **outward carefully** — sharing, premium depth, partner curation — without becoming a network.

### What belongs

- Premium: export/print, extended storage, advanced organization, gentle AI — **described honestly**
- Public collection galleries (finite, curated)
- Kakao share polish (explicit, user-initiated)
- Partner-curated **static** exhibits — labeled, museum-like
- Second Season-style editorial cross-links (optional, clearly attributed)
- Calm pricing page — no urgency, no shame

### What does NOT belong

- Follower/subscriber systems
- Public like counts and save counts as social proof
- Viral referral loops
- Creator monetization marketplace
- Booking/reservation integrations as core loop
- Push notifications for re-engagement

### Examples

| In scope | Out of scope |
|----------|--------------|
| PDF export of my archive (Premium) | “Invite 5 friends to unlock” |
| Public explore as paginated calm browse | Algorithmic For You feed |
| Labeled partner collection: “Guest curator” | Anonymous aggregated user stats on homepage |
| Premium badge — subtle, optional | Paywall on basic record create |

---

## Tier 5 — Experimental

### Goals

Test hypotheses **in isolation** with clear success/failure criteria — reversible without identity damage.

### What belongs

- Prototypes behind feature flags or beta labels (never masquerading as live community)
- Time-boxed AI writing experiments (opt-in, qualitative eval)
- New collection visualization sketches (internal or beta cohort)
- Research on export/print formats
- Usability tests on IA restructures

### What does NOT belong

- Shipping experimental social mechanics to all users “to see what happens”
- A/B tests on dark patterns (urgency pricing, hidden public default)
- Production homepage experiments with fake data
- Irreversible schema changes for unvalidated social features

### Examples

| In scope | Out of scope |
|----------|--------------|
| Beta: timeline revisit view for 50 users | Launch comments globally |
| Flagged: AI suggested collection titles (editable) | Auto-publish AI records |
| Prototype: print layout PDF | Production leaderboard |

**Experimental exit criteria:** Promote to Tier 2–4 only via approved RFC + constitution check. Kill experiments that require engagement metrics to justify continuation.

---

# 6. Never (Unless Constitution Changes)

The following are **default never** — not backlog “someday,” not “low priority.” They require **formal constitutional amendment** with written rationale.

| Category | Never by default |
|----------|------------------|
| **Social graph** | Followers, following feeds, friend lists as core IA |
| **Engagement metrics (public)** | Like counts, save counts, view counts on place detail |
| **Ranking** | Leaderboards, trending places, “most popular,” star ratings |
| **Gamification** | Streaks, points, levels, achievement badges for recording |
| **Dashboards (user-facing)** | Personal analytics charts, KPI widgets, stat-heavy profile |
| **Viral mechanics** | Referral chains, share-to-unlock, invite spam |
| **Feed mechanics** | Infinite scroll as default home/explore, algorithmic For You |
| **Notification-first growth** | Re-engagement pushes without explicit user-requested value |
| **Fake community** | Mock users, bot activity, inflated counts, placeholder cards as live |
| **Manipulative monetization** | Urgency timers, shame downgrade, paywall on core CRUD |
| **Review platform patterns** | Star ratings, pros/cons templates, comparison shopping UX |
| **Trend UI** | Glassmorphism, neon, gradient SaaS aesthetics as identity shift |

### Amendment bar

To move an item off the Never list:

1. Written proposal against Constitution Articles 1–5  
2. Explicit user need evidence — not competitor parity  
3. Design for **minimum social surface** — archive-first  
4. Product Constitution version bump and team sign-off  

Default answer remains **no**.

---

# 7. Prioritization Framework

## 7.1 Evaluation questions

Score each proposal **0–2** per question (0 = no / negative, 1 = partial, 2 = strong yes).

| # | Question | Weight |
|---|----------|--------|
| Q1 | Does this improve **remembering** a meaningful place? | ×3 |
| Q2 | Does this strengthen **revisiting** old records with pleasure? | ×3 |
| Q3 | Would it still matter if Re:Place had **only one user**? | ×2 |
| Q4 | Does it increase **trust** (honesty, clarity, control)? | ×3 |
| Q5 | Will this **age well in five years** — timeless, not trendy? | ×2 |
| Q6 | Does it reduce **confusion** in IA or ownership? | ×2 |
| Q7 | Does it align with **calm** — low urgency, low noise? | ×2 |
| Q8 | Does it **avoid** engagement-metric dependency? | ×2 |

**Maximum weighted score:** 38

### Score interpretation

| Weighted score | Recommendation |
|----------------|----------------|
| **30–38** | High priority — RFC and schedule in current tier |
| **22–29** | Medium — valid; may defer until lower-tier debt cleared |
| **14–21** | Low — redesign scope or merge with existing work |
| **0–13** | Reject or Never list — do not RFC for implementation |

Any **Q3 = 0** (requires crowd) triggers automatic constitutional review.

Any **Q4 = 0** (reduces trust) cannot ship in Tier 3+ until resolved.

---

## 7.2 Decision matrix: Build vs Redesign vs Reject

Use when two proposals compete for the same problem.

|  | High archive value | Low archive value |
|--|-------------------|-------------------|
| **High trust impact** | **Build** (Tier 1–2) | **Redesign** existing |
| **Low trust impact** | **Defer** to next cycle | **Reject** |

---

## 7.3 Decision matrix: Tier assignment

| Signal | Likely tier |
|--------|-------------|
| Fixes mock data, errors, duplicate UI | Tier 1 |
| Improves create / revisit / organize | Tier 2 |
| Adds polish without new concepts | Tier 3 |
| Sharing, premium, partners | Tier 4 |
| Unproven hypothesis | Tier 5 |
| Social, gamification, feeds | **Never** |

---

## 7.4 Tie-breakers

When scores tie, prefer in order:

1. **Tier 1 debt** over new capability  
2. **Redesign** over new nav item  
3. **Revisit** over discovery  
4. **Private archive** over public surface  
5. **Fewer components** over more features  

---

# 8. Technical Debt Philosophy

Technical debt in Re:Place is acceptable when it **blocks trust or archive quality** — not when it merely offends engineering aesthetics.

### Pay down immediately (Tier 1)

| Debt type | Why urgent |
|-----------|------------|
| User-facing technical errors | Breaks trust — constitutional |
| Mock data in production UI | Breaks honesty |
| Duplicate components (cards, lists) | Prevents craft consistency |
| Missing loading/error boundaries | Feels broken, not calm |
| Auth/visibility bugs | Erodes ownership |

### Schedule deliberately (Tier 1–2)

| Debt type | Approach |
|-----------|----------|
| Token migration (hex → semantic) | Incremental by surface — homepage, explore, detail, form |
| Client-only data fetch patterns | Introduce route loading + skeletons per list |
| Scattered date/format helpers | Extract shared utils when touching related files |
| Console logs in production components | Remove when editing file |

### Tolerate temporarily

| Debt type | Condition |
|-----------|-----------|
| Non-user-facing refactor opportunities | Until file is touched for archive feature |
| Test coverage gaps | Unless regression risks trust/data |
| Admin-only tooling roughness | Must not leak to user UI |

### Never borrow against

- Data privacy and deletion correctness  
- Public/private visibility correctness  
- Payment/recording integrity  

**Rule:** No Tier 3+ feature work on a file with known Tier 1 trust debt in that same user flow.

---

# 9. Design Debt Philosophy

Design debt is **inconsistency that users feel but cannot name** — duplicate greens, mixed radii, oversized form type.

### Pay down immediately

- Multiple card implementations for same entity  
- Primary CTA color drift (`#87977F` vs `#A8B2A1` competing)  
- Homepage surfaces that overpromise (mock collections)  
- Action walls before content on mobile  
- Unicode icons instead of icon system  
- English decorative copy in Korean UI  

### Invest continuously (Tier 2–3)

- Design System v2 adoption per component  
- Skeleton loaders matching card geometry  
- PageHeader unification  
- Place detail content-first layout  
- Modal pattern for destructive actions  

### Avoid

- Trend redesigns that don’t map to tokens  
- One-off marketing pages outside system  
- “Quick fixes” adding a fourth button variant  

**Rule:** Design debt repayment **is** roadmap work — not a parallel optional track.

---

# 10. Documentation Debt Philosophy

Documentation debt erodes **decision quality** — especially with AI-assisted development.

### Must stay current

| Document | When to update |
|----------|----------------|
| Product Constitution | Identity, sharing, AI, monetization changes |
| Core Product Principles | New principle or reinterpretation |
| Design System v2 | New tokens, components, variants |
| AI Design Rules | New agent workflows or forbidden patterns |
| Feature RFC Template | Process changes |
| This document | Tier or prioritization philosophy changes |

### RFC archive

- Approved and **rejected** RFCs both stay on record  
- Rejections teach future contributors — don’t delete  

### Code without docs

- New user-facing pattern → Design System or RFC note  
- New forbidden pattern → AI Design Rules + Constitution if severe  

**Rule:** If an AI agent cannot infer correct behavior from docs, that is **documentation debt** — fix docs before scaling AI generation on that surface.

---

# 11. Guidance for AI-Assisted Development

AI accelerates implementation — it also **accelerates identity drift** if ungoverned.

### Before AI generates UI or features

1. Load [AI Design Rules](../foundation/AI_DESIGN_RULES.md)  
2. Confirm tier assignment (this document §5)  
3. Require RFC for net-new capabilities (not token migration bugfixes)  
4. State constitution/principle alignment in prompt  

### AI should prioritize (roadmap-aligned)

| Tier | AI task examples |
|------|------------------|
| 1 | Token migration, unify PlaceCard, remove mock sections, humanize errors |
| 2 | Skeleton loaders, archive hub IA, progressive form, revisit views |
| 3 | Motion polish, typography scale application |
| 4 | Export flow, calm premium copy — only after Tier 1 clean |

### AI must refuse or redirect

- Proposals from Never list (§6)  
- Dashboard widgets, engagement metrics, gamification  
- Mock content presented as live  
- Nav expansion without hierarchy RFC  

### AI roadmap contribution format

When suggesting work, AI outputs:

1. **Tier** (1–5 or Never)  
2. **Prioritization score** (§7.1) — estimated  
3. **RFC required?** Yes for features; No for debt in existing scope  
4. **Constitution/principle alignment** — one line each  

---

# 12. Roadmap Review Checklist

Run at **quarterly** product review — or before any major release.

### Identity & constitution

- [ ] No active work violates [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 5  
- [ ] Nothing on Never list (§6) entered roadmap without amendment  
- [ ] Tier 1 trust issues (mock data, dev errors) tracked and prioritized  

### Prioritization hygiene

- [ ] Every in-flight feature has approved or in-review RFC  
- [ ] Weighted scores (§7.1) documented for major items  
- [ ] Tie-breakers applied — not loudest-voice wins  

### Tier balance

- [ ] Tier 1–2 receiving majority of effort until foundation audit passes  
- [ ] Tier 4–5 not crowding core archive work  
- [ ] Delight (Tier 3) not masking foundation gaps  

### Debt

- [ ] Technical trust debt explicitly listed  
- [ ] Design debt (cards, tokens, IA) has owners  
- [ ] Documentation updated with last ship cycle  

### AI governance

- [ ] AI Design Rules reflect current agent workflows  
- [ ] AI-generated work in last quarter passed self-checklist  
- [ ] No AI-shipped mock-as-live content  

### Outcome reflection (qualitative)

- [ ] Did recent ships improve **remembering** or **revisiting**?  
- [ ] Would we still ship them if engagement metrics were unavailable?  
- [ ] Any regret items → add to Reasons Rejected in future RFCs  

---

## Closing

A Re:Place roadmap is healthy when the team can answer:

> “We are making the archive more honest, clearer, and more pleasurable to reopen — and we know what we will **not** build.”

Priority is not speed. Priority is **fit**.

When the backlog grows, **prune the Never list mentally first**, then **pay Tier 1 debt**, then **deepen Tier 2** — before chasing expansion or experiment.

Protect the archive. The roadmap follows.

---

*Product Roadmap Philosophy v1.0 — how Re:Place decides what gets built first.*

---

This document is part of the Re:Place documentation system.
