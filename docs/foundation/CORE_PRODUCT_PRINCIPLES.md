---
title: Core Product Principles
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Core Product Principles

**Document type:** Product decision framework  
**Status:** v1.0 — permanent reference  
**Companion docs:** Design System v2 · Visual Language Guide  
**Purpose:** Decide whether a feature, flow, or surface belongs in Re:Place

---

## How to Use This Document

When evaluating any idea — a new screen, metric, notification, AI capability, or monetization change — run it against these principles. A feature that violates more than one principle needs exceptional justification or must be rejected.

Principles are ordered by importance to product identity, not implementation ease.

---

## 1. Places before people

**What it means**  
The place and the memory of being there are the subject. People may appear in records as companions or context, but profiles, followers, and creator celebrity are not the product center.

**Why it matters**  
Re:Place is an archive of where you went and how it felt — not a network of who you follow.

**What it allows**  
Place names, photos, regions, revisit feelings, companion tags (“혼자”, “가족”), optional public sharing of records.

**What it rejects**  
Creator profiles as primary identity, follower counts, influencer discovery, “people you may know,” social graphs.

**Example decisions**  
- ✅ Add “함께한 사람” as optional metadata on a place record  
- ❌ Add user profile pages optimized for follower growth  
- ✅ Show collection creator name as light attribution  
- ❌ Rank places by “most followed curators”

---

## 2. Memory before metadata

**What it means**  
The “한 줄 기록” and the feeling of the visit matter more than tags, categories, coordinates, or completeness scores.

**Why it matters**  
Users come to remember, not to administer a database.

**What it allows**  
Short expressive memory text, optional space tags, visit date, revisit level — all in service of recall.

**What it rejects**  
Mandatory long forms, completeness meters, “profile 80% complete” nudges, fields that block saving a meaningful moment.

**Example decisions**  
- ✅ Default create flow: photo → place → memory → save  
- ❌ Require category, tags, and date before first save  
- ✅ Collapse advanced metadata into optional “추가 정보”  
- ❌ Show “missing fields” warnings on every card

---

## 3. Writing before rating

**What it means**  
Expression through words (and optionally photos) replaces stars, scores, and comparative judgments.

**Why it matters**  
Ratings compress experience. Re:Place preserves nuance — “꼭 다시 가고 싶어요” is feeling, not a 4.5/5.

**What it allows**  
Revisit-level language, personal memory, space tags as qualitative notes.

**What it rejects**  
Star ratings, numeric scores, “best of” leaderboards, review templates optimized for comparison shopping.

**Example decisions**  
- ✅ Keep revisit levels as qualitative phrases  
- ❌ Add 1–5 star ratings for places  
- ✅ AI helper that polishes memory text  
- ❌ AI that generates generic review-style copy

---

## 4. Return before discovery

**What it means**  
The primary job is helping users return to what they already loved — revisit, re-read, re-save — not endlessly discovering new content.

**Why it matters**  
Discovery feeds optimize novelty. Archives optimize attachment to what already matters.

**What it allows**  
“내 장소,” “저장한 장소,” collections, revisit prompts, chronological or meaningful re-browsing.

**What it rejects**  
Infinite scroll feeds, “trending now,” algorithmic rabbit holes, FOMO-driven explore mechanics.

**Example decisions**  
- ✅ Homepage section: “다시 꺼내 보고 싶은 기록” (user’s own)  
- ❌ Homepage: infinite public feed with engagement ranking  
- ✅ Explore as a calm, finite browse — not a slot machine  
- ❌ “Because you viewed X” recommendation loops as default home

---

## 5. Ownership before engagement

**What it means**  
Users own their records. Public sharing is a choice. The product serves the archivist first, the audience second.

**Why it matters**  
Engagement-first products optimize for time-on-app and reactions. Re:Place optimizes for trust and long-term personal value.

**What it allows**  
Public/private toggle, owned records in “내 장소,” edit/delete control, saved bookmarks of others’ public places.

**What it rejects**  
Default-public posting, dark patterns that make private records hard to find, metrics that pressure users to publish.

**Example decisions**  
- ✅ Clear public/private at save time (not buried)  
- ❌ Auto-publish records to drive “community activity”  
- ✅ Owner-only edit/delete on place detail  
- ❌ Engagement stats on private records (“only you viewed this 0 times”)

---

## 6. Quality before quantity

**What it means**  
One thoughtful record beats ten rushed ones. The product should never reward volume for its own sake.

**Why it matters**  
Quantity metrics create spammy archives and shallow memories — the opposite of a lifestyle journal.

**What it allows**  
Encouragement to add depth (photo, memory, location), AI writing assistance, beautiful presentation of few items.

**What it rejects**  
Record count badges, “you’re #1 recorder this week,” prompts to bulk-import junk data.

**Example decisions**  
- ✅ Empty state: “첫 번째 기억을 남겨보세요”  
- ❌ “Record 10 places to unlock a badge”  
- ✅ Featured places chosen for image + memory quality  
- ❌ Leaderboards by record count

---

## 7. Personal archive before public feed

**What it means**  
The mental model is *my library* — records, saves, collections — not a timeline of everyone else’s activity.

**Why it matters**  
Feed-first UX trains consumption. Library-first UX trains care and return.

**What it allows**  
Unified “내 아카이브” mental model (내 장소 / 저장 / 컬렉션), personal-first navigation, public browse as secondary.

**What it rejects**  
Activity feeds, “what’s new from people you follow,” mixing others’ content into personal library views.

**Example decisions**  
- ✅ Group personal destinations under one nav hub  
- ❌ Merge saved places and social notifications in one stream  
- ✅ Public collections as curated exhibits, not live feeds  
- ❌ Real-time “friends just posted” rail

---

## 8. Calm creation before social performance

**What it means**  
Recording should feel like journaling — private, unhurried, honest — not performing for an audience.

**Why it matters**  
Performance anxiety degrades memory quality and excludes users who want a private archive.

**What it allows**  
Simple create flow, optional sharing, Kakao share as explicit action, no preview of “how this will perform.”

**What it rejects**  
Share prompts immediately after save, like counts on drafts, “your post reached X people” as primary feedback.

**Example decisions**  
- ✅ Post-save: quiet confirmation → my archive  
- ❌ Post-save: “Share now to get more views!” modal  
- ✅ Share via explicit button when user chooses  
- ❌ Auto-cross-post to social platforms

---

## 9. Meaningful records before complete databases

**What it means**  
A record with a name and a sentence can be enough. Completeness is optional enrichment, not a gate.

**Why it matters**  
Perfection blocks capture. The best archive is the one that actually gets written.

**What it allows**  
Minimal required fields (place + memory), progressive enrichment later, honest empty states for missing photos.

**What it rejects**  
Blocking saves for missing category/region/photo, “incomplete record” shame UI, admin-style data quality dashboards for users.

**Example decisions**  
- ✅ Required: 장소명 + 한 줄 기록  
- ❌ Required: photo + category + visit date + 3 tags  
- ✅ “사진이 아직 없어요” as neutral placeholder  
- ❌ Red “incomplete” badge on cards

---

## 10. Trust before growth tricks

**What it means**  
Honesty, clarity, and reliability beat hacks that inflate signups, sessions, or conversions.

**Why it matters**  
A lifestyle archive is intimate. One broken trust moment (fake content, surprise public, technical errors) ends the relationship.

**What it allows**  
Real data on marketing surfaces, friendly errors, clear pricing, explicit consent for public sharing and payments.

**What it rejects**  
Fake community content, mock cards presented as live, urgency timers, hidden paywalls, developer error strings, MVP labels in user UI.

**Example decisions**  
- ✅ Homepage shows real public places or honest empty state  
- ❌ Homepage mock collections with fake counts  
- ✅ “잠시 연결되지 않았어요” on failure  
- ❌ “Supabase 설정을 확인해주세요”  
- ✅ Premium described plainly — no fake scarcity

---

## Feature Fit Quick Test

Ask before building:

1. Does this help someone **remember a place** they cared about?  
2. Does it respect **private ownership** by default?  
3. Does it increase **calm** or **anxiety**?  
4. Would it still make sense if Re:Place had **no other users**?  
5. Does it require **engagement metrics** to work? If yes — likely no.

If the feature mainly increases time-on-app, comparisons, or social proof without deepening personal archive value — **it does not belong**.

---

This document is part of the Re:Place documentation system.
