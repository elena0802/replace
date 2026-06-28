---
title: Product Constitution
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Re:Place Product Constitution

**Document type:** Highest governing document  
**Status:** v1.0 — durable, opinionated  
**Supersedes:** Ad hoc feature debates when in conflict  
**Subordinate docs:** Design System v2 · Visual Language Guide · Core Product Principles · AI Design Rules

---

## Preamble

Re:Place exists because places hold moments that deserve to be kept — not scored, not ranked, not lost in a feed.

This constitution defines what Re:Place **is**, what it **protects**, and what it **must never become**. When growth, trends, or shortcuts conflict with these articles, **these articles win**.

All contributors — human and AI — are bound by this document.

---

## 1. Why Re:Place exists

To give people a **quiet, trustworthy place** to record where they went, how it felt, and whether they want to return — as a **personal lifestyle archive** they are proud to reopen years later.

Re:Place exists to preserve **meaning**, not maximize **engagement**.

---

## 2. Who Re:Place is for

- People who want to **remember** cafés, restaurants, parks, trips, and stays — in their own words  
- People who value **calm** over noise when journaling life  
- People who may share selectively — but **own** their archive first  
- Korean-speaking users primarily; respectful of local place context (Naver, Kakao)  
- Readers and writers — not performers hunting reach  

---

## 3. Who Re:Place is not for

- Users seeking viral discovery, follower growth, or influencer tools  
- Users who want star ratings, ranked reviews, or comparison shopping  
- Power users wanting a GIS database, CRM, or team dashboard  
- Businesses wanting listing management or booking conversion  
- Users who need aggressive reminders, streaks, or competitive leaderboards  

We do not optimize for these users at the expense of the archive identity.

---

## 4. What Re:Place must protect

| Protected value | Meaning |
|-----------------|--------|
| **User ownership** | Records belong to the user; edit/delete/control visibility |
| **Memory integrity** | Words and photos represent honest personal experience |
| **Calm** | Low anxiety, low urgency, low visual noise |
| **Privacy** | Private by informed choice; no surprise publishing |
| **Trust** | Real surfaces, honest empty states, human errors |
| **Timelessness** | Decisions that age well — editorial, not trendy |
| **Return value** | Revisiting old records stays pleasurable |

Any feature that erodes these without overwhelming benefit is **unconstitutional**.

---

## 5. What Re:Place must never become

Re:Place must never become:

- A **social network** (followers, feeds, likes, comments as core loop)  
- A **review platform** (stars, rankings, “best of” lists)  
- A **dashboard** (KPIs, analytics widgets, admin density for end users)  
- A **booking or map utility** (transactions replace memory)  
- A **gamified habit app** (streaks, badges, points)  
- A **notification machine** (re-engagement pings as growth strategy)  
- A **fake community** (mock users, fabricated activity, misleading counts)  
- A **dark-pattern monetization funnel** (urgency, shame, hidden limits)  

---

## 6. Product principles

The ten Core Product Principles are **constitutional law**:

1. Places before people  
2. Memory before metadata  
3. Writing before rating  
4. Return before discovery  
5. Ownership before engagement  
6. Quality before quantity  
7. Personal archive before public feed  
8. Calm creation before social performance  
9. Meaningful records before complete databases  
10. Trust before growth tricks  

Feature debates defer to that document.

---

## 7. Design principles

Design serves memory. Binding principles:

- **Quiet over loud** — one focal point per screen  
- **Editorial over decorative** — typography and photo lead  
- **Spacious over dense** — white space is respect  
- **Human over technical** — warm Korean copy  
- **Timeless over trendy** — no glass, neon, gradient fashions  
- **Trustworthy over impressive** — honesty over spectacle  

Visual execution: **Design System v2**. Emotional execution: **Visual Language Guide**.

---

## 8. Content principles

- User-generated memories are **primary content**  
- Marketing and homepage surfaces show **real archives or honest emptiness** — never fake places presented as community  
- Public browse is **curated calm browsing** — not an engagement feed  
- Cross-promotions (e.g., partner essays) must feel **editorial** — optional, clearly labeled, never interruptive  
- AI-assisted writing is **assistive** — user reviews, edits, and owns output  

---

## 9. Data and privacy principles

- **Minimum necessary** data for place memory and optional location  
- **Public sharing is opt-in** — visible at save time, changeable later  
- **No selling personal archives** or using private memories for public training without explicit consent  
- **Deletion is real** — users can remove records they own  
- **Third-party services** (Supabase, Naver, Kakao, Toss) are implementation details — never exposed in user-facing failure copy  
- **Saved places** are bookmarks of **public** records — not surveillance of other users  

---

## 10. Monetization principles

Monetization must **extend the archive**, not **punish the core act of remembering**.

### Allowed direction

- Premium that adds **lasting value**: extended storage, export/print, advanced organization, gentle AI assistance, optional badge — described honestly  
- Transparent pricing — test flows labeled only in non-production or clearly as beta when unavoidable  
- Payment failures explained in human language — retry paths, no error codes  

### Forbidden direction

- Paywalling **basic place recording**  
- Urgency timers (“48 hours left”)  
- Shame-based downgrade (“your memories will be deleted”)  
- Feature gating that makes free tier feel **broken** rather than **complete**  
- MVP/test labels in production user UI  
- Monetization prompts interrupting **create** or **revisit** flows  

---

## 11. Feature acceptance rules

A feature may be accepted if **all** apply:

1. **Archive test:** Strengthens remembering, revisiting, or organizing personal places  
2. **Calm test:** Does not add anxiety, FOMO, or notification pressure  
3. **Ownership test:** Respects private default and user control  
4. **Solo test:** Still valuable if the user never browses others’ content  
5. **Trust test:** No deception, fake data, or hidden publishing  
6. **Time test:** Still appropriate in five years — not trend-chasing  
7. **Simplicity test:** Does not add nav clutter without hierarchy redesign  

**Examples of acceptable future features**

- Richer revisit views (by season, revisit level, region)  
- Print/export/PDF of personal archive  
- Improved collection storytelling  
- Gentle AI record polishing (opt-in)  
- Partner-curated **static** exhibits — labeled, finite, non-algorithmic  
- Better image crop and location attach — in service of memory  

---

## 12. Feature rejection rules

Reject immediately if the feature **primarily** provides:

| Category | Examples |
|----------|----------|
| Social ranking | Likes, follower counts, comment threads, viral share loops |
| Engagement loops | Streaks, daily check-in rewards, points |
| Feed mechanics | Infinite scroll, “trending,” algorithmic For You |
| User dashboards | Personal analytics charts, “your stats this month” |
| Manipulative growth | Fake activity, referral spam, aggressive push |
| Comparison | Leaderboards, “most saved places,” star ratings |
| Notification spam | Re-engagement pushes without user-requested value |
| Fake community | Mock cards, bot placeholders, inflated counts |

**Reject or heavily gate AI features that:**

- Auto-publish without review  
- Generate generic review-boilerplate  
- Scrape or infer private user data across accounts  

---

## 13. Public sharing rules

Public sharing is **a gift, not the default business model**.

- Records are **private unless user chooses public** at create/edit  
- Public places appear in **explore** as calm browse — not ranked by likes  
- **Save** bookmarks a public place to personal library — not a public social signal  
- **Kakao share** is explicit user action — never auto-triggered  
- Collections may be public or private — visibility clear on card and detail  
- No public metrics displayed on place detail (view counts, save counts as social proof) unless constitution is formally amended  

---

## 14. AI feature rules

AI in Re:Place is a **writing companion**, not a **content factory**.

### Permitted

- Polish user’s memory text on request (“AI가 기록 다듬기”)  
- Suggest phrasing based on user-provided name, category, memo  
- Help structure optional fields — never auto-fill without consent  

### Required safeguards

- User **sees and edits** all AI output before save  
- AI failures show friendly retry — not model/API errors  
- No training on private records without explicit opt-in policy  
- AI copy tone: warm, specific, Korean — not generic review-speak  

### Prohibited

- Auto-generating and publishing records  
- Ranking places or users via AI scores  
- Synthetic photos presented as user memories  
- Chatbot that replaces the archive UI as “primary interface”  

---

## 15. Long-term vision

In five to ten years, Re:Place should be remembered as:

> The place you trusted with the afternoons you didn’t want to forget.

Success looks like:

- Users **returning** to old records with pleasure  
- Archives **exported or printed** as keepsakes  
- Public layers that feel like a **small museum**, not a **large network**  
- A product that **aged visually and ethically** — still calm, still honest  

Success does **not** look like:

- Millions of daily active scrollers  
- Influencer ecosystems  
- Feature bloat dashboards  
- Reputation as “another review app”  

---

## 16. Decision checklist

Before shipping any material change, leadership (or the responsible contributor) answers:

### Purpose  
- [ ] Does this help someone **keep or revisit** a meaningful place?  
- [ ] Would we ship this if **growth metrics were unavailable**?  

### Identity  
- [ ] Is this still a **personal archive** — not a feed or dashboard?  
- [ ] Does it violate any **Article 5** prohibition?  

### User respect  
- [ ] Is **private the safe default**?  
- [ ] Is copy **Korean, warm, non-technical**?  
- [ ] Are errors **human** — not infrastructure leaks?  

### Craft  
- [ ] Does it meet **Design System v2** and **Visual Language Guide**?  
- [ ] Would this page feel good to open **one year later**?  

### Trust  
- [ ] Any **fake or mock** content visible to users? If yes — reject.  
- [ ] Any **urgency, shame, or dark patterns**? If yes — reject.  

### AI (if applicable)  
- [ ] Opt-in, editable, assistive — not auto-published?  

**If any constitutional article is violated, the change is rejected or redesigned** — regardless of short-term metric upside.

---

## Amendment process

This constitution changes **rarely and deliberately**.

- Proposed amendments require written rationale against Articles 1–5  
- Trend-driven requests (“make it more like X app”) are not sufficient grounds  
- Social and gamification features require **explicit constitutional amendment** — default is no  

---

## Closing

Re:Place is not neutral. It stands for **slowness, memory, and ownership** in a market that rewards speed, engagement, and performance.

When in doubt:

**Protect the archive. Protect calm. Protect trust.**

Everything else is negotiable.

---

*Re:Place Product Constitution v1.0 — governing document for product, design, and AI-assisted development.*

---

This document is part of the Re:Place documentation system.
