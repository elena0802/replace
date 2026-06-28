---
title: AI Prompt Guide
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# AI Prompt Guide

**Document type:** AI collaboration guide  
**Status:** v1.0 — permanent reference  
**Audience:** Cursor, Codex, Claude, ChatGPT, and future AI coding agents  
**Authority:** Implements [AI Design Rules](../foundation/AI_DESIGN_RULES.md); subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)  
**Companion docs:** [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) · [Engineering Architecture](ENGINEERING_ARCHITECTURE.md) · [Component Specification](COMPONENT_SPECIFICATION.md)  
**Purpose:** Define how AI should collaborate on Re:Place and answer: **How should AI contribute without causing identity drift?**

---

## How to Use This Document

AI accelerates implementation — it also **accelerates identity drift** if ungoverned.

**Before any AI-generated code or UI:** load required documents (§2), follow workflows (§4–9), run checklist (§11).

If user request conflicts with constitution — **explain conflict and offer Re:Place-aligned alternative**.

---

# 1. AI Philosophy

| Belief | Practice |
|--------|----------|
| AI is a **contributor**, not product owner | Human approval for features, nav, monetization |
| AI must **read before write** | Documentation loading order is mandatory |
| AI optimizes for **archive quality**, not engagement | Reject feed/dashboard/gamification prompts |
| AI output is **draft** until checklist passes | Self-review before submitting |
| AI preserves **calm Korean voice** | No English UI, no technical errors |
| AI **consolidates** rather than duplicates | One PlaceCard — not FeaturedPlaceCardV2 |

> AI should make Re:Place feel more like a notebook — not more like a SaaS template.

---

# 2. Documentation Loading Order

Load in this order before coding or designing:

### Tier A — Always (every task)

1. [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) — identity boundaries  
2. [AI Design Rules](../foundation/AI_DESIGN_RULES.md) — behavioral constraints  

### Tier B — By task type

| Task | Also load |
|------|-----------|
| UI / visual | [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) → [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) → [Component Specification](COMPONENT_SPECIFICATION.md) → [Interaction Specification](INTERACTION_SPECIFICATION.md) |
| IA / routes / nav | [Information Architecture](INFORMATION_ARCHITECTURE.md) |
| New feature | [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md) → [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) → [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) |
| Engineering / refactor | [Engineering Architecture](ENGINEERING_ARCHITECTURE.md) |
| Prioritization | [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) |

### Tier C — Reference when touching domain

- [`supabase-setup.md`](../supabase-setup.md) — env and DB  
- [`deployment.md`](../deployment.md) — deploy  

**Rule:** If unsure which doc applies, load Tier B for UI + IA + Engineering before proceeding.

---

# 3. Required Documents Before Coding

| Work type | Required reads |
|-----------|----------------|
| Any code change | AI Design Rules + Engineering Architecture |
| Any UI change | + Design System v2 + Visual Language Guide + Component Spec |
| New route or nav | + Information Architecture + RFC (filled or draft) |
| New feature | + Constitution + Core Principles + RFC + Roadmap Philosophy |
| Copy only | + Visual Language Guide + AI Design Rules §4 |
| Bug fix (user-facing) | + Interaction Spec (error/loading) + AI Design Rules |

**Cursor / AGENTS.md note:** This repo uses Next.js 16 with breaking differences — read `node_modules/next/dist/docs/` when writing Next.js code.

---

# 4. Prompt Writing Principles

### For humans prompting AI

| Principle | Example |
|-----------|---------|
| **State identity** | “This is Re:Place — quiet lifestyle archive, not social app.” |
| **Cite docs** | “Follow Design System v2 tokens — no raw hex.” |
| **Scope narrowly** | “Migrate explore page to skeleton loading only.” |
| **Forbid drift** | “Do not add likes, feeds, or dashboard widgets.” |
| **Specify tier** | “Tier 1 foundation work — no new features.” |
| **Request self-check** | “Run AI Design Rules checklist before finishing.” |

### For AI interpreting prompts

- Vague “make it modern” → interpret as **timeless calm**, not glassmorphism  
- “Improve engagement” → redirect to **revisit value**  
- “Like Instagram” → **reject** or offer archive-aligned alternative  
- “Quick fix” → still **no** technical error strings  

---

# 5. Feature Implementation Workflow

```
1. User requests feature
2. AI checks Constitution + Never list (Roadmap Philosophy §6)
3. If net-new → require RFC (Feature RFC Template)
4. Score priority (Roadmap Philosophy §7)
5. Assign tier — defer if Tier 1 debt blocks
6. Load Tier A + B docs
7. Propose IA placement (Information Architecture)
8. Propose components (Component Specification)
9. Implement with tokens + primitives
10. Self-check (§11)
11. Human review — Product/Design for user-facing
```

**AI must not skip RFC** for: new routes, nav items, social features, monetization changes, AI capabilities, public behavior changes.

---

# 6. RFC Workflow

When user asks for a feature:

1. **Draft RFC** using [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md) — fill all sections  
2. Flag **constitutional conflicts** explicitly  
3. If rejected by principles → say so; offer redesign  
4. Only implement after **Approved** status — or user explicitly overrides with documented risk  

AI may implement **Tier 1 debt** without RFC if user request is narrowly scoped (e.g. “remove mock collections from homepage”) — still note alignment with Constitution.

---

# 7. UI Generation Workflow

```
1. Load Design System v2 + Visual Language Guide + Component Spec
2. Identify components: existing primitive vs new variant
3. One primary CTA per section
4. Korean copy — warm, short
5. Skeleton for loading — not StatusMessage text box
6. EmptyState for no data
7. No hex — semantic tokens only
8. Mobile-first layout
9. Self-check visual + AI Design Rules
```

**Output:** Describe which components used; flag new primitives for Component Spec update.

---

# 8. Design Review Workflow

When asked to review UI (no code):

1. Load Visual Language Guide + Design System v2 + IA  
2. Evaluate: calm, content-first, timeless, honest  
3. Reference [Re:Place Test](../foundation/VISUAL_LANGUAGE_GUIDE.md) §14  
4. Rank issues by impact  
5. **Do not** suggest engagement metrics, feeds, or trends  

Output format: severity, why it hurts, suggested direction (not implementation) — unless user asks for code.

---

# 9. Refactoring Workflow

```
1. Confirm scope — one surface or domain per task
2. Load Engineering Architecture + Design System
3. No behavior change unless stated — or call out behavior change
4. Prefer delete duplicate over add wrapper
5. Token migration: surface-by-surface
6. No drive-by refactors
7. Update docs if component/IA changes
```

**Safe refactors (no RFC):** token rename, extract PageHeader, unify PlaceCard, skeleton loading, humanize errors.

**RFC required:** IA change, auth model change, new data exposed publicly.

---

# 10. Bug Fixing Workflow

```
1. Reproduce — user path, route, component
2. Classify: trust bug | UX bug | functional | visual
3. Trust bugs (wrong visibility, mock data, tech errors) — highest priority
4. Fix root cause — not symptom patch
5. User-facing error → Korean friendly message
6. Do not expose Supabase/API in fix message
7. Regression: note manual test path
```

---

# 11. Design Token Migration Workflow

```
1. Add tokens to globals.css :root + @theme
2. Create/update components/ui primitives
3. Pick one page (e.g. /explore)
4. Replace hex in that page's tree only
5. Verify focus, contrast, mobile
6. Document in PR — surface migrated
7. Repeat — do not half-migrate a single page
```

Prompt template: see §13 Token migration.

---

# 12. Safe Prompting Rules

| Do | Don't |
|----|-------|
| Reference doc paths in prompt | “Make it look professional” without identity |
| Scope one surface per task | “Refactor entire app” without tier plan |
| Say “no new nav items” | “Add whatever UX is best” |
| Require Korean copy | Mix English UI strings |
| Ask for self-checklist | Skip review on user-facing changes |
| Say “use PlaceCard variant” | “Create new card component” |

---

# 13. Dangerous Prompting Examples

| Dangerous prompt | Why | Re:Place-aligned redirect |
|------------------|-----|---------------------------|
| “Add a like button and view count” | Constitution — social metrics | Save bookmark only — private to user |
| “Make homepage an infinite feed” | Feed IA | Real featured places + honest empty |
| “Add user dashboard with stats” | Dashboard prohibition | Revisit view of my archive |
| “Use glassmorphism hero” | Anti-pattern | Editorial hero with real photos |
| “Show Supabase error to help debug” | Trust | Log internal; user sees retry message |
| “Add 7th nav item Notifications” | Nav + constitution | No notifications |
| “Mock data until backend ready” on homepage | Trust | EmptyState or hide section |
| “Add streak for daily recording” | Gamification | Calm create invitation only |
| “Copy Notion settings UI” | SaaS dashboard | Minimal account sheet |
| “Auto-post AI memory to explore” | AI Article 14 | Opt-in edit before save |

---

# 14. Prompt Templates

### Feature implementation

```markdown
You are working on Re:Place — quiet Korean lifestyle archive (not social, not dashboard).

Read: Product Constitution, AI Design Rules, Design System v2, Information Architecture, Component Specification.

Task: [describe feature]

Constraints:
- Complete RFC sections [list] or confirm RFC approved ID: ___
- Tier: ___
- No raw hex; use Design System tokens
- Korean-first copy
- One primary CTA per section
- No engagement metrics, feeds, gamification

Deliver: [implementation scope]

Before finishing: run AI Design Rules §8 self-checklist and list results.
```

### Bug fix

```markdown
Re:Place bug fix — preserve calm UX and trust.

Read: AI Design Rules, Interaction Specification (error/loading), Engineering Architecture.

Bug: [description]
Route/component: [path]
Expected: [behavior]
Actual: [behavior]

Fix root cause. User-facing errors must be Korean and non-technical.
Do not add scope. List manual test steps when done.
```

### Refactor

```markdown
Re:Place refactor — behavior unchanged unless noted.

Read: Engineering Architecture, Design System v2, Component Specification.

Scope: [single surface or module]
Goal: [e.g. unify PlaceCard, migrate tokens on /explore]
Out of scope: [explicit]

Do not drive-by refactor unrelated files.
```

### UI redesign

```markdown
Re:Place UI redesign — no identity drift.

Read: Visual Language Guide, Design System v2, Interaction Specification, Component Specification.

Surface: [page/component]
Problems: [from audit or user]
Must preserve: archive-first, content leads, calm motion

Do not: glass, neon, dashboard density, English decorative copy.
Deliver: specification or code per request.
```

### Documentation

```markdown
Re:Place documentation task.

Read: [relevant existing docs]

Task: [create/update doc]
Match style of docs/foundation/PRODUCT_CONSTITUTION.md
Include YAML front matter and standard footer.
Do not summarize — complete production-quality content.
```

### Component creation

```markdown
Re:Place new component.

Read: Component Specification, Design System v2, Interaction Specification.

Component: [name]
Layer: primitive (ui/) | pattern | feature
Purpose: [one sentence]

Define: variants, states, tokens, a11y, do/don't.
Compose existing primitives — do not duplicate PlaceCard.
Update Component Specification doc section if new primitive.
```

### Token migration

```markdown
Re:Place token migration.

Read: Design System v2, Engineering Architecture §6.

Surface: [e.g. app/explore + ExplorePlacesList + PlaceCard]
Add missing tokens to globals.css @theme if needed.
Replace all raw hex in this surface only.
Verify: primary CTA, cards, empty/loading states.
No behavior changes.
```

---

# 15. AI Review Checklist

Before submitting any output:

### Identity

- [ ] Still a **place journal** — not social/SaaS/dashboard  
- [ ] Aligns with [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)  
- [ ] Not on [Never list](../process/PRODUCT_ROADMAP_PHILOSOPHY.md)  

### Visual & UX

- [ ] [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) tokens — no raw hex  
- [ ] [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) calm/editorial  
- [ ] [Component Specification](COMPONENT_SPECIFICATION.md) — variant not duplicate  
- [ ] [Interaction Specification](INTERACTION_SPECIFICATION.md) — loading/error/success  
- [ ] One primary action per section  

### Copy & trust

- [ ] Korean-first; no technical errors  
- [ ] No mock-as-live content  
- [ ] Public/private explicit where relevant  

### Engineering

- [ ] [Engineering Architecture](ENGINEERING_ARCHITECTURE.md) — correct layer (`lib/` vs `components/`)  
- [ ] Secrets server-side  
- [ ] No `console.log` PII  

### Process

- [ ] RFC if required  
- [ ] Docs updated if IA/component/interaction changed  
- [ ] User asked for code only if implementing — not unsolicited rewrites  

---

# 16. AI Anti-Patterns

| AI anti-pattern | Consequence |
|-----------------|-------------|
| Generating generic SaaS UI | Identity destruction |
| Adding features user didn’t ask for | Scope + constitution risk |
| Creating duplicate components | Design debt |
| Hardcoding hex “matching screenshot” | Token drift |
| English UI for convenience | Locale violation |
| Suggesting engagement metrics | Constitutional violation |
| Implementing without reading docs | Repeated audit findings |
| “I'll add a quick dashboard” | Rejected product direction |
| Auto-committing / auto-pushing | User trust — wait for instruction |
| Overwriting foundation docs | Governance failure |

---

# 17. Human Approval Rules

AI **must pause for explicit human approval** before:

| Action | Why |
|--------|-----|
| New route or nav item | IA impact |
| Public/private default change | Constitution |
| Monetization / paywall change | Article 10 |
| AI auto-publish behavior | Article 14 |
| Social features (any) | Article 5 + Never list |
| Constitution or foundation doc edits | Governance |
| Deleting user data paths | Trust |
| Force push / destructive git | Safety |

AI **may proceed without approval** when user explicitly requested scoped task:

- Bug fix in named file  
- Token migration on named surface  
- Copy humanization in named component  
- Tier 1 debt item user named  

When uncertain — **ask**.

---

## Closing

AI is most valuable on Re:Place when it **reads the constitution**, **consolidates duplicates**, **humanizes errors**, and **refuses the feed**.

Default stance: **protect the archive, protect calm, protect trust** — then implement.

---

*AI Prompt Guide v1.0 — how AI collaborates on Re:Place without identity drift.*

---

This document is part of the Re:Place documentation system.
