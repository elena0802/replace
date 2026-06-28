---
title: Product Metrics
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Product Metrics

**Document type:** Product measurement reference  
**Status:** v1.0 — permanent reference  
**Authority:** Subordinate to [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md); implements [Core Product Principles](../foundation/CORE_PRODUCT_PRINCIPLES.md)  
**Companion docs:** [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) · [Feature RFC Template](../process/FEATURE_RFC_TEMPLATE.md)  
**Purpose:** Define how Re:Place measures product success — not as a startup KPI dashboard, but as an archive quality instrument

---

## How to Use This Document

1. **Before adding analytics** — confirm the metric is allowed here, not on the Reject list.
2. **Before optimizing a number** — ask whether improvement strengthens memory, trust, or revisit — not time-on-app.
3. **Quarterly reviews** — use §10 framework; do not publish internal vanity dashboards to the team as north stars.
4. **RFC success criteria** — prefer qualitative outcomes from this doc over DAU targets.

> If a metric would incentivize building a feed, dashboard, or gamification loop — **do not track it**.

---

# Philosophy: Meaning Before Growth

Re:Place exists to preserve **meaning**, not maximize **engagement** ([Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) §1).

| Growth-first product | Archive-first product (Re:Place) |
|---------------------|----------------------------------|
| Optimizes time in app | Optimizes value when user returns |
| Rewards volume of actions | Rewards quality of memories |
| Measures impressions | Measures whether records are kept and revisited |
| Chases DAU | Chases trust and completion of meaningful records |
| Success = more scrolling | Success = “I’m glad I wrote this down” |

### Why archive quality beats time-on-app

A user who spends **five minutes** writing one honest memory and returns **six months later** to reread it is more valuable than a user who scrolls explore for **thirty minutes** and remembers nothing.

Long session length without archival value indicates **consumption**, not **attachment**. Attachment compounds; consumption exhausts.

Metrics must **reward compounding** — records kept, revisited, trusted — not **drain** — endless refresh, notification taps, comparison anxiety.

---

# North Star Metric

## Records meaningfully kept and revisited

**Definition (conceptual):**  
Authenticated users who have **at least one place record with memory text** and who **open that record (or my archive) again** after ≥7 days.

**Why this north star**

| Criterion | Fit |
|-----------|-----|
| Aligns with constitution | Preserves meaning, return value |
| Solo-viable | Works with one user |
| Not social | No followers/likes required |
| Anti-feed | Revisit beats browse time |
| Long-term | Measures attachment, not spike |

**How to measure (implementation-agnostic)**

- Numerator: users with ≥1 non-empty memory record AND ≥1 return visit to place detail or my-places within rolling window
- Denominator: users with ≥1 non-empty memory record (cohort)

**Not north star:** DAU, session length, explore page views, notification opens.

---

# Primary Metrics

Primary metrics directly indicate archive health. Review **monthly**.

| Metric | Definition | Why it matters |
|--------|------------|----------------|
| **Record completion rate** | % of started create flows that save with name + memory | Meaningful records before complete databases |
| **Record with photo rate** | % of saved records with image | Depth of memory (optional enrichment) |
| **Revisit rate (7d / 30d)** | % of active recorders who open my-places or a place detail again | Return before discovery |
| **Save-to-archive retention** | % of users with records still present at 90d | Trust — users don’t churn-delete |
| **Public publish rate (informed)** | % of records explicitly public at save among those with visibility set | Ownership — sharing as choice, not default accident |
| **Collection attach rate** | % of recorders who add ≥1 place to a collection | Organization of memory |

### Targets mindset

- **Improve trends**, not absolute vanity numbers
- Compare **cohorts** (users who joined after IA fix vs before)
- Never tie compensation or launch success solely to these without qualitative review

---

# Supporting Metrics

Supporting metrics diagnose **friction** — not success alone.

| Metric | Use | Misuse |
|--------|-----|--------|
| Create flow drop-off by step | Find form friction | Optimize to skip memory field |
| Time to first record (new user) | Onboarding clarity | Pressure with streaks |
| Error rate (user-facing failures) | Trust breaks | Expose tech errors to users |
| Auth completion rate | Account friction | Spam signup campaigns |
| Explore → detail click-through | Calm discoverability | Infinite feed optimization |
| Payment completion (Premium) | Honest monetization | Urgency funnel tuning |

---

# Trust Metrics

Trust is constitutional ([Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) §4). Track **failure modes**.

| Metric | Signal |
|--------|--------|
| **Human-readable error rate** | Should trend to 100% of user-visible errors — zero Supabase/API strings |
| **Mock/fake content incidents** | Count of production surfaces showing non-live data — target **zero** |
| **Visibility surprise reports** | User believed record private but was public — target **zero** |
| **Delete success rate** | User-initiated deletes complete — ownership |
| **Support contacts: trust** | “I lost my data,” “wrong visibility,” “payment confusion” |

**Leading indicator:** Qualitative user feedback mentioning “trustworthy,” “calm,” “honest.”

---

# Archive Health Metrics

| Metric | Definition |
|--------|------------|
| **Memory length distribution** | Median characters in memory — detect empty/spam, not maximize |
| **Records per user (median)** | Quality signal only with completion rate — not leaderboard |
| **Revisit level diversity** | Users use qualitative revisit labels — feature used |
| **Empty archive rate** | Logged-in users with 0 records at 14d — invitation problem |
| **Saved places usage** | Users who bookmark public places — discover → personal library |
| **Collection depth** | Median places per collection — curation, not volume contest |

---

# AI Feature Metrics

Per [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 14 — AI is assistive.

| Metric | Purpose |
|--------|---------|
| **AI helper opt-in rate** | % of create/edit sessions where user taps “AI가 기록 다듬기” |
| **AI apply rate** | % of AI suggestions user applies (edited or not before save) |
| **AI abandon rate** | User runs AI then leaves without save — friction signal |
| **AI error rate** | Failed helper calls — must stay humanized in UI |

**Reject:** AI-generated records auto-published; AI usage correlated with engagement ranking.

---

# Premium Metrics

Per [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) Article 10 — monetization extends archive.

| Metric | Purpose |
|--------|---------|
| **Premium conversion (informed)** | Users who complete test payment after reading pricing — honesty |
| **Premium retention** | Renewals / active premium — value delivered |
| **Free tier record CRUD** | Must remain healthy — paywall must not break core remembering |

**Reject:** Conversion via urgency timers, shame downgrade, interruptive upsell CTR.

---

# Metrics We Explicitly Reject

These metrics are **forbidden as optimization targets** unless Constitution is amended.

| Rejected metric | Why |
|-----------------|-----|
| **DAU / MAU obsession** | Rewards opening app without archival value |
| **Session length / time-on-app** | Rewards consumption and feed behavior |
| **Screen views per session** | Rewards clutter and clicking |
| **Feed impressions** | Re:Place is not a feed |
| **Infinite scroll depth** | Engagement loop incompatible with calm |
| **Notification CTR** | Notification-first growth prohibited |
| **Like / save counts (public)** | Social proof pressure — constitution |
| **Follower growth** | Social network — prohibited |
| **Streak length** | Gamification — prohibited |
| **Leaderboard rank** | Comparison — prohibited |
| **Viral coefficient / K-factor** | Growth tricks over trust |
| **Bounce rate on explore** | Misreads calm browse as failure |
| **A/B test on dark patterns** | Ethics — prohibited |

### If a stakeholder requests a rejected metric

1. Cite this document and Product Constitution  
2. Offer **archive-aligned alternative** from Primary or Trust metrics  
3. Require written exception — constitutional amendment for social/engagement metrics  

---

# Quarterly Product Review

Align with [Product Roadmap Philosophy](../process/PRODUCT_ROADMAP_PHILOSOPHY.md) §12.

### Agenda (90 minutes max)

| Block | Content |
|-------|---------|
| 1. North star | Revisit trend + narrative user stories |
| 2. Primary | Record completion, revisit, trust metrics |
| 3. Trust audit | Any mock data, error copy, visibility bugs |
| 4. Tier progress | Tier 1–2 debt vs expansion |
| 5. Reject list | Any proposed metrics — allowed or not |
| 6. Qualitative | Support, user quotes, “would you reopen in a year?” |
| 7. Decisions | Ship / defer / reject per roadmap philosophy |

### Outputs

- Written summary — not a KPI dashboard screenshot
- RFC rejections archived with reasons
- No new tracking without Metric Decision Checklist (§11)

---

# Metric Decision Checklist

Before instrumenting or optimizing a metric:

- [ ] Aligns with **north star** (meaningful keep + revisit)
- [ ] Not on **Reject list** (§9)
- [ ] Incentivizes **remembering, revisiting, or trust** — not scrolling
- [ ] Still meaningful with **one user** and no social graph
- [ ] Would **not** push team toward feed, dashboard, or gamification
- [ ] **Privacy**: no PII in analytics events without policy
- [ ] User-visible outcome improves if metric improves
- [ ] RFC success criteria updated if feature-specific
- [ ] Constitution Articles 4, 10, 14 respected

If any box fails — **do not track or optimize**.

---

## Closing

Re:Place measures success the way a **good journal** measures success: not by hours spent flipping pages, but by whether you **return** to what you wrote — and whether you **trust** the book to keep your words safe.

Optimize for **meaning that lasts**.

---

*Product Metrics v1.0 — how Re:Place measures product success.*

---

This document is part of the Re:Place documentation system.
