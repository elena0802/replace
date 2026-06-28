---
title: Database Schema
version: 1.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Database Schema

**Document type:** Supabase data model reference  
**Status:** v1.0 — reflects migrations through `20260531000000`  
**Authority:** Subordinate to [Engineering Architecture](../architecture/ENGINEERING_ARCHITECTURE.md) and [Product Constitution](../foundation/PRODUCT_CONSTITUTION.md)  
**Companion docs:** [API Specification](../api/API_SPECIFICATION.md) · [supabase-setup.md](../supabase-setup.md)  
**Purpose:** Document tables, RLS, storage, and change policy — no invented schema

---

## How to Use This Document

- **Before querying or migrating:** read ownership and RLS sections for affected tables.
- **Before new columns:** complete Database Change Checklist (§12).
- TypeScript types live in `types/database.ts` — keep in sync after migrations.

---

# Database Philosophy

| Principle | Meaning |
|-----------|---------|
| **User-owned rows** | Every personal record ties to `auth.users.id` |
| **RLS first** | Authorization in Postgres — not only in app code |
| **Private default (target)** | Constitution: opt-in sharing — **see gap on `places.is_public`** |
| **No social graph tables** | Saves and collections — not follows/likes |
| **Payments server-authoritative** | Client cannot mark paid; service role in API |
| **Migrations are truth** | `supabase/migrations/` + `schema.sql` baseline |

---

# Current Tables Overview

| Table | Purpose |
|-------|---------|
| `places` | User memory records (places) |
| `saved_places` | Bookmark a public place |
| `collections` | Named groupings of places |
| `collection_places` | Many-to-many collection ↔ place |
| `payments` | Premium payment orders (Toss) |

Auth users live in Supabase `auth.users` — not duplicated in public schema.

---

# Conceptual ERD

```text
auth.users
    │
    ├──< places (user_id)
    │       │
    │       ├──< saved_places (place_id) ──> user_id (saver)
    │       │
    │       └──< collection_places (place_id)
    │                   │
    │                   └──> collections (user_id)
    │
    └──< payments (user_id)

Storage: place-images / places/{user_id}/{timestamp}-{filename}
```

---

# Table: `places`

**Purpose:** Core archive entity — a remembered place with optional photo, memo, category, coordinates.

### Key columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK → auth.users | Owner |
| `name` | text | Required |
| `category` | text | Optional |
| `address` | text | Optional |
| `memo` | text | Optional memory text |
| `image_url` | text | Public URL from Storage |
| `latitude` / `longitude` | double precision | Optional |
| `is_public` | boolean | **Default `true` in schema** — constitutional tension |
| `created_at` | timestamptz | |

### Ownership model

- Row owned by `user_id`
- Insert/update/delete only when `auth.uid() = user_id`

### Visibility model

- **Owner:** always read/write own rows
- **Others:** SELECT when `is_public = true`
- **Anon:** SELECT public rows only (policy in `schema.sql`)

### Relationships

- Referenced by `saved_places.place_id`, `collection_places.place_id`

### RLS expectations (current)

| Operation | Policy |
|-----------|--------|
| SELECT own | `auth.uid() = user_id` |
| SELECT public | `is_public = true` |
| INSERT | `auth.uid() = user_id` |
| UPDATE/DELETE | `auth.uid() = user_id` |

### Common queries

- My places: `eq('user_id', uid).order('created_at', desc)`
- Public feed: `eq('is_public', true).order('created_at', desc)`
- Place detail: by `id` — RLS filters invisibility

### Known gap

[Product Constitution](../foundation/PRODUCT_CONSTITUTION.md) targets **private-by-default**. Schema default is `is_public = true`. Migration to `false` default requires RFC + data backfill plan.

---

# Table: `saved_places`

**Purpose:** User bookmarks a **public** place — personal curation without copying the place row.

**Migration:** `20260529000000_add_saved_places.sql`

### Key columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK | Saver (not place owner) |
| `place_id` | uuid FK → places | |
| `created_at` | timestamptz | |
| **Unique** | `(user_id, place_id)` | One save per user per place |

### Ownership model

- Row owned by saver `user_id`

### Visibility model

- Only owner can see their saves (no public save list)

### RLS expectations

| Operation | Rule |
|-----------|------|
| SELECT/DELETE | `auth.uid() = user_id` |
| INSERT | `auth.uid() = user_id` AND target place `is_public = true` |

### Common queries

- Saved list: join `places` on `place_id` where `saved_places.user_id = uid`
- Check saved: `eq('user_id', uid).eq('place_id', id).maybeSingle()`

---

# Table: `collections`

**Purpose:** Named folders grouping places — owner-curated lists.

**Migrations:** `20260530000000_add_collections.sql`, `20260531000000_add_collection_visibility.sql`

### Key columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK | Owner |
| `name` | text | Required |
| `description` | text | Optional |
| `is_public` | boolean | Default `false`; opt-in share |
| `created_at` | timestamptz | |

### Ownership model

- Full CRUD for `auth.uid() = user_id`

### Visibility model

- Owner always sees own collections
- **Public collections:** `is_public = true` readable by anon + authenticated

### RLS expectations

| Operation | Rule |
|-----------|------|
| SELECT own | `auth.uid() = user_id` |
| SELECT public | `is_public = true` (anon + authenticated) |
| INSERT/UPDATE/DELETE | owner only |

### Common queries

- My collections: `eq('user_id', uid).order('created_at', desc)`
- Public collection detail: `eq('id', id).eq('is_public', true)`

---

# Table: `collection_places`

**Purpose:** Link places into collections (ordered by `created_at`).

### Key columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `collection_id` | uuid FK | |
| `place_id` | uuid FK | |
| `created_at` | timestamptz | |
| **Unique** | `(collection_id, place_id)` | |

### Ownership model

- Indirect via parent collection owner

### Visibility model

- Owner sees links in own collections
- Public: links visible when parent collection `is_public = true`

### RLS expectations

| Operation | Rule |
|-----------|------|
| SELECT | own collection OR public collection |
| INSERT | own collection AND place is public OR owned by user |
| DELETE | own collection |

Insert check prevents adding private others' places to collections.

### Common queries

- Places in collection: join `places` on `place_id` where `collection_id = ?`

---

# Table: `payments`

**Purpose:** Premium subscription payment records for Toss Payments flow.

**Migration:** `20260528000000_add_payments.sql`

### Key columns

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | |
| `user_id` | uuid FK | Payer |
| `order_id` | text UNIQUE | Server-generated |
| `payment_key` | text | From Toss after confirm |
| `amount` | integer | 4900 for Premium |
| `status` | text | `pending`, `paid`, etc. |
| `plan` | text | `premium` |
| `approved_at` | timestamptz | Set on confirm |
| `created_at` | timestamptz | |

### Ownership model

- User owns row; only SELECT via RLS for authenticated user

### Visibility model

- User sees own payments only
- **Insert/update:** service role in API routes — not client RLS

### RLS expectations

| Operation | Rule |
|-----------|------|
| SELECT | `auth.uid() = user_id` |
| INSERT/UPDATE | Service role (API) — no user INSERT policy |

### Common queries

- Confirm flow: admin client `eq('order_id', orderId).single()`
- User history (future): `eq('user_id', uid).order('created_at', desc)`

---

# Supabase Storage

### Bucket: `place-images`

| Aspect | Detail |
|--------|--------|
| **Path pattern** | `places/{user_id}/{timestamp}-{sanitized-filename}` |
| **Upload** | Client via `uploadPlaceImage()` — authenticated Supabase session |
| **URL** | Public URL via `getPublicUrl` |
| **Cache** | `cacheControl: 3600` |
| **Upsert** | false — new object per upload |

### Image storage model

- `places.image_url` stores full public URL string
- No separate `storage.objects` metadata table in app
- Delete/replace image on edit not fully specified — orphan objects possible (ops debt)

### Storage RLS (expected)

- Authenticated users upload under own `user_id` prefix — verify bucket policies in Supabase dashboard match [supabase-setup.md](../supabase-setup.md)

---

# RLS Policy Philosophy

1. **Default deny** — enable RLS on all public tables
2. **Authenticated vs anon** — anon only where product requires public read (`places.is_public`, public collections)
3. **No broad grants** — `revoke all from anon` then grant minimum (collections migration pattern)
4. **Join checks** — `collection_places` uses `exists` subquery on parent collection
5. **Service role sparingly** — payments write path only; never for routine user reads
6. **Test as user** — verify policies with Supabase SQL editor as `authenticated` role

---

# Migration Policy

| Rule | Detail |
|------|--------|
| **One concern per file** | Timestamp prefix `YYYYMMDDHHMMSS_description.sql` |
| **Idempotent where possible** | `if not exists`, `drop policy if exists` |
| **RLS in same migration** | Never add table without policies |
| **Types update** | Regenerate or hand-update `types/database.ts` |
| **No prod manual SQL** | All changes via migration files |
| **RFC for breaking** | Default changes, column renames, policy tightening |

Apply locally: `supabase db reset` or migration up per team workflow in [supabase-setup.md](../supabase-setup.md).

---

# Database Anti-Patterns

| Anti-pattern | Why |
|--------------|-----|
| Client-side service role | Full bypass |
| RLS only in app `if (user)` | Bypass via direct API |
| Public write on user tables | Spam / abuse |
| Storing secrets in rows | Leak |
| Social counters (likes, views) | Constitution violation |
| `is_public` default true for new product | Privacy surprise — align with constitution |
| N+1 without indexes | `user_id`, `collection_id`, `place_id` indexed — keep pattern |
| Orphan storage objects | Cost + privacy — lifecycle policy needed |

---

# Database Change Checklist

Before schema change:

- [ ] RFC if behavior-visible or privacy-affecting
- [ ] RLS policies for all new tables
- [ ] Indexes on FK and common filter columns
- [ ] Migration file in `supabase/migrations/`
- [ ] Update `types/database.ts`
- [ ] Update this document
- [ ] Test SELECT/INSERT as owner, other user, anon
- [ ] Consider backfill for default changes
- [ ] Changelog entry if user-visible ([Changelog Guide](../playbook/CHANGELOG_GUIDE.md))

---

## Closing

The Re:Place database is a **small, RLS-guarded archive** — places, saves, collections, and payments. It deliberately excludes feeds, follows, and rankings. Schema changes must preserve that boundary and move visibility defaults toward opt-in sharing over time.

---

*Database Schema v1.0 — Re:Place Supabase model.*

---

This document is part of the Re:Place documentation system.
