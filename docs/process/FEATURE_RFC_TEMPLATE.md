---
title: Feature RFC Template
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Feature RFC Template

**Document type:** Mandatory pre-implementation decision template  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); evaluated against [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md)  
**Audience:** Product, design, engineering, AI agents proposing new work  
**Purpose:** Every feature proposal must complete this RFC **before** design or development begins

---

## How to Use This Document

1. **Copy this template** into a new RFC file (e.g. `docs/rfc/YYYY-MM-DD-feature-name.md`) or issue description.
2. **Fill every section.** Write “N/A” only where genuinely not applicable — with one sentence explaining why.
3. **Stop if constitutional conflict appears.** Do not proceed to implementation until resolved, rejected, or constitution is formally amended.
4. **Obtain approval** using the Approval Checklist at the end.

This is **not** an implementation spec. It is the decision record that answers: *Should we build this? Does it belong in Re:Place?*

---

## When to Reject an RFC

Reject immediately — without implementation — if any of the following apply:

| Rejection trigger | Reference |
|-------------------|-----------|
| Violates [Product Constitution Article 5](../foundation/PRODUCT_CONSTITUTION.md) (must never become) | Social network, review platform, dashboard, gamification, etc. |
| Fails **two or more** [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md) | See Feature Fit Quick Test |
| Requires engagement metrics, fake content, or dark patterns to succeed | Constitution Articles 8, 10 |
| Adds nav clutter without hierarchy redesign | AI Design Rules §2 |
| Exposes technical infrastructure to users | Constitution Article 9; AI Design Rules §4 |
| Primarily increases time-on-app without deepening archive value | Core Product Principles §4, §7 |

**Rejected RFCs are valuable.** Record the rejection reason in “Reasons rejected” under Alternatives — future contributors learn from them.

---

## When Redesign Is Preferable to Adding a Feature

Prefer **redesign, consolidation, or removal** over new features when:

- The problem is **confusion** (e.g. three similar nav destinations) — fix IA, don’t add a fourth screen
- The problem is **inconsistency** (duplicate cards, mixed tokens) — unify components, don’t add variants
- The problem is **trust** (mock homepage content, technical errors) — fix honesty layer, don’t add onboarding
- The problem is **density** (action button wall on place detail) — simplify layout, don’t add a menu feature
- The proposed feature **patches a symptom** of constitutional drift (e.g. “engagement dashboard for inactive users”)

> Ask: *Can we solve this by making the archive clearer, calmer, or more trustworthy — without adding surface area?*

If yes, write an **Improvement RFC** (same template) scoped to redesign rather than net-new capability.

---

# RFC: [Feature Name]

**RFC ID:** RFC-YYYY-NNN  
**Author:**  
**Date:**  
**Status:** Draft | Under Review | Approved | Rejected | Redesign Preferred  
**Reviewers:**

---

## Purpose

**Why this section exists:** States the single sentence goal. If purpose cannot be stated clearly, the RFC is not ready.

**Fill in:**

> One sentence: what this change accomplishes for the user and the archive.

---

## Problem

**Why this section exists:** Separates real user/archive pain from solution bias. The problem must exist independent of the proposed feature.

**Fill in:**

- What pain or gap exists today?
- Who experiences it? (Archivist, visitor, logged-out user, collection owner, etc.)
- What evidence supports this? (User feedback, audit finding, internal observation — not “we should have X because competitors do”)

---

## User Goal

**Why this section exists:** Re:Place serves **remembering, revisiting, and organizing** — not abstract “engagement.”

**Fill in:**

- What does the user want to **feel** or ** accomplish**?
- Is this goal about **creating**, **revisiting**, **organizing**, or **sharing** a place memory?
- Would this goal matter if the user never browsed anyone else’s content?

---

## Why Now

**Why this section exists:** Prevents trend-chasing and scope creep. “Why now” must not be “because app X has it.”

**Fill in:**

- Why is this the right moment?
- What blocks or debt does waiting create?
- What happens if we **don’t** build this in the next six months?

---

## Related Constitution Articles

**Why this section exists:** Binds the RFC to governing law. Cite specific articles from [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md).

**Fill in:**

| Article | Relevance |
|---------|-----------|
| e.g. Article 4 — What Re:Place must protect | How this feature protects or risks ownership, calm, trust |
| e.g. Article 11 — Feature acceptance rules | Which acceptance tests apply |
| e.g. Article 13 — Public sharing rules | If sharing behavior changes |

**Constitutional conflict?** ☐ None ☐ Potential — describe: _______________

If potential conflict exists, RFC cannot be Approved without amendment or redesign.

---

## Related Core Product Principles

**Why this section exists:** Every feature must map to at least one principle it ** strengthens**. Flag any principle it ** weakens**.

**Fill in:**

| Principle | Strengthens / Weakens / Neutral | Explanation |
|-----------|--------------------------------|-------------|
| e.g. Memory before metadata | Strengthens | Surfaces memory on revisit view |
| e.g. Return before discovery | | |

**Principle violations:** ☐ None ☐ Yes — list:

---

## Related Visual Language Considerations

**Why this section exists:** Features have emotional character, not just function. Consult [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md).

**Fill in:**

- Which visual principles apply? (Quiet, editorial, spacious, human, timeless, trustworthy, curated)
- Emotional goal: how should users feel using this feature?
- Any photography, motion, or copy tone requirements?
- Does this pass [The Re:Place Test](../foundation/VISUAL_LANGUAGE_GUIDE.md) (§14)?

---

## Related Design System Impact

**Why this section exists:** New UI must extend [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) — not invent parallel patterns.

**Fill in:**

| Area | Impact |
|------|--------|
| New tokens needed? | ☐ No ☐ Yes — list semantic tokens |
| New components? | ☐ No ☐ Yes — must compose `components/ui/` primitives |
| Existing components affected? | Button, Card, Input, Badge, EmptyState, etc. |
| Variants only? | e.g. new PlaceCard variant vs new card type |

**Design System rule violations:** ☐ None ☐ Yes — list:

---

## User Flow

**Why this section exists:** Makes the experience concrete before pixels or code. Flows must stay calm and short.

**Fill in:**

Describe step-by-step (max 7 steps for primary flow):

1.
2.
3.

**Entry points:** Where does the user start?  
**Exit points:** Where do they land after success?  
**Primary action count per screen:** (must be ≤ 1 per section)

---

## Information Architecture Impact

**Why this section exists:** Re:Place already has IA tension (saved vs owned vs collections). New features must not add confusion.

**Fill in:**

- New routes or nav items? ☐ No ☐ Yes — list
- Changes to existing nav hierarchy? ☐ No ☐ Yes — describe
- Does this clarify or blur “내 장소 / 저장 / 컬렉션”?
- Homepage, explore, or archive hub impact?

---

## UI Changes

**Why this section exists:** Summarizes surfaces touched — not implementation detail.

**Fill in:**

| Surface | Change type | Description |
|---------|-------------|-------------|
| e.g. `/places/[id]` | Modify | Move actions to bottom bar on mobile |
| | Add | |
| | Remove | |

**Mockups / wireframes:** Link or attach (optional at Draft; required at Review)

---

## AI Implications

**Why this section exists:** [Constitution Article 14](../foundation/PRODUCT_CONSTITUTION.md) governs AI. [AI Design Rules](../foundation/AI_DESIGN_RULES.md) govern agent behavior.

**Fill in:**

- Does this feature use AI? ☐ No ☐ Yes
- If yes:
  - Opt-in? ☐ Required ☐ User initiates
  - User edits before save? ☐ Required
  - Auto-publish? ☐ Forbidden
  - Failure copy humanized? ☐ Required
- Does AI generate UI or copy in this flow? How is it governed?

---

## Privacy Implications

**Why this section exists:** Archive products hold intimate data. [Constitution Article 9](../foundation/PRODUCT_CONSTITUTION.md).

**Fill in:**

- What data is collected, displayed, or shared?
- Default visibility: ☐ Private ☐ User chooses ☐ Public
- Can user delete or export affected data?
- Third-party services involved? (Naver, Kakao, Toss, OpenAI) — user-facing failure handling?
- Cross-user data exposure risk?

---

## Public / Private Behavior

**Why this section exists:** [Constitution Article 13](../foundation/PRODUCT_CONSTITUTION.md). Sharing is a gift, not default.

**Fill in:**

- Does this feature affect public records, private records, or both?
- Is visibility explicit at point of action?
- Are public metrics shown (views, saves)? ☐ Forbidden unless constitution amended
- Kakao share or external share behavior?

---

## Premium Implications

**Why this section exists:** [Constitution Article 10](../foundation/PRODUCT_CONSTITUTION.md). Monetization extends the archive — does not punish remembering.

**Fill in:**

- Free tier impact: ☐ None ☐ Enhanced ☐ Restricted
- Premium-only? ☐ No ☐ Yes — justify against Article 10
- Paywall on core record CRUD? ☐ Forbidden
- Upsell timing: must not interrupt create or revisit flows

---

## Alternatives Considered

**Why this section exists:** Good decisions document paths not taken.

**Fill in:**

| Alternative | Summary | Why not chosen |
|-------------|---------|----------------|
| A. Do nothing | | |
| B. Redesign existing | | |
| C. Smaller scope | | |

---

## Reasons Rejected (if applicable)

**Why this section exists:** Permanent record when RFC or sub-ideas are rejected.

**Fill in:**

- Ideas considered and rejected during drafting:
- If entire RFC rejected: constitutional or principle basis

---

## Success Criteria

**Why this section exists:** Defines “done” in user/archive terms — not vanity metrics.

**Fill in:**

Qualitative (required):

-
-

Optional quantitative (archive-aligned only):

- e.g. Task completion rate for “save a place with memory” — not DAU

**Must not use as primary success metrics:** DAU, session length, viral coefficient, follower growth, like counts.

---

## Failure Criteria

**Why this section exists:** Predefines when to rollback or redesign.

**Fill in:**

- Signs the feature failed its intent:
- Signs it caused constitutional drift (e.g. users confused saved vs owned):
- Rollback trigger:

---

## Risks

**Why this section exists:** Surfaces trust, calm, and complexity risks early.

**Fill in:**

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| e.g. Increases nav complexity | | | |
| e.g. Exposes technical errors | | | |
| e.g. Encourages performative public posting | | | |

---

## Migration Strategy

**Why this section exists:** Existing users have archives. Breaking trust or data is unacceptable.

**Fill in:**

- Backward compatibility required? ☐ Yes ☐ No
- Data migration needed? ☐ No ☐ Yes — describe
- UI migration / deprecation comms?
- Phased rollout? ☐ No ☐ Yes — phases:

---

## Open Questions

**Why this section exists:** Unresolved questions block Approval.

**Fill in:**

| # | Question | Owner | Due |
|---|----------|-------|-----|
| 1 | | | |

---

## Approval Checklist

**Why this section exists:** No implementation until all required boxes pass.

### Constitutional & product

- [ ] No conflict with [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Articles 5, 11, 12, 13, 14
- [ ] Strengthens at least one [Core Product Principle](../foundation/CORE_PRODUCT_PRINCIPLES.md) without violating another
- [ ] Passes Feature Fit Quick Test (Principles doc)
- [ ] Would still matter with **one user** and no public content

### Experience & design

- [ ] Passes [Re:Place Test](../foundation/VISUAL_LANGUAGE_GUIDE.md) (§14)
- [ ] Aligns with [Visual Language Guide](../foundation/VISUAL_LANGUAGE_GUIDE.md) — calm, editorial, timeless
- [ ] Uses or extends [Design System v2](../foundation/DESIGN_SYSTEM_V2.md) — no orphan patterns
- [ ] One primary action per screen section
- [ ] Korean-first, non-technical copy planned

### Trust & privacy

- [ ] No fake or mock content presented as live
- [ ] Public/private behavior explicit
- [ ] User-facing errors humanized — no Supabase/API/code exposure
- [ ] AI (if any) is opt-in, editable, non-auto-publish

### Process

- [ ] Alternatives documented — including “redesign only”
- [ ] Success criteria are archive-aligned, not engagement-metrics-first
- [ ] Open questions resolved or explicitly deferred with owner
- [ ] Reviewers signed off: Product ☐ Design ☐ Engineering ☐

---

## Approval Record

| Role | Name | Decision | Date |
|------|------|----------|------|
| Product | | Approved / Rejected / Redesign | |
| Design | | | |
| Engineering | | | |

**Final status:** _______________

---

## Quick Reference: RFC Decision Outcomes

| Outcome | Meaning | Next step |
|---------|---------|-----------|
| **Approved** | Fits Re:Place; proceed to design/implementation | Link design spec; track in roadmap Tier |
| **Rejected** | Does not belong | Archive RFC with reasons |
| **Redesign Preferred** | Problem valid; feature is wrong shape | Scope Improvement RFC |
| **Deferred** | Valid but not now | Record in roadmap philosophy tier backlog |
| **Amendment Required** | Good idea but conflicts with constitution | Formal constitution amendment process |

---

*Feature RFC Template v1.0 — mandatory pre-implementation decision document for Re:Place.*

---

This document is part of the Re:Place documentation system.
