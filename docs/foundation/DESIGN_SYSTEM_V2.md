---
title: Design System v2
version: 2.0
status: Active
owner: Re:Place
last_updated: 2026-06-28
---

# Re:Place Design System v2

**Version:** 2.0  
**Status:** Specification (pre-implementation)  
**Audience:** Product, design, and engineering  
**Locale:** Korean-first (`lang="ko"`)  
**Product character:** Premium lifestyle archive — warm, calm, editorial, trustworthy

---

## Design Intent

Re:Place v2 keeps the existing olive–sage–beige identity and makes it **systematic**. The product should feel like a quiet journal you return to, not a startup dashboard.

**North-star qualities**

| Quality | Expression |
|--------|------------|
| Warm | Paper-toned backgrounds, beige accents |
| Calm | Low contrast motion, soft shadows, generous whitespace |
| Premium | Consistent type scale, restrained color, no raw hex in components |
| Archive | Cards as “records,” typography with editorial hierarchy |
| Trustworthy | Real data surfaces, friendly errors, no dev/MVP copy in UI |

**What v2 fixes from v1**

- Two competing primary greens → one primary action color + one secondary/support color  
- Six border radii → four named levels  
- Ad-hoc shadows → three elevation levels  
- Oversized form typography → mobile-first type scale  
- Duplicate card implementations → three canonical card types with shared anatomy

---

## 1. Color System

All colors are defined as CSS custom properties. Components use **semantic tokens only** — never raw hex.

### 1.1 Core Palette (reference)

These are the underlying brand colors. Do not use them directly in UI; use semantic tokens below.

| Name | Hex | Role |
|------|-----|------|
| Parchment | `#F7F5EF` | Page ground |
| Linen | `#FCFBF8` | Elevated surfaces |
| Mist | `#F8F6F2` | Inset / muted surfaces |
| Sand | `#EEE8DE` | Section tints, CTA bands |
| Soft Beige | `#EAE3D8` | Tags, chips, highlights |
| Sage | `#A8B2A1` | Secondary actions, success tint |
| Moss | `#87977F` | Primary brand green |
| Deep Olive | `#4D5748` | Primary hover, headings accent |
| Ink | `#3F3F3B` | Primary text |
| Stone | `#6B6B68` | Secondary text |
| Pebble | `#8A857D` | Tertiary / meta text |
| Warm Clay | `#7A4B3A` | Error text |
| Blush | `#FFF8F4` | Error surface |
| Rose Dust | `#E5C8BA` | Error border |

### 1.2 Semantic Tokens

#### Background
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-page` | `#F7F5EF` | App shell, body |
| `--color-bg-subtle` | `#F8F6F2` | Sidebars, inset panels, form sections |
| `--color-bg-tint` | `#EEE8DE` | Marketing bands, featured sections |

#### Surface
| Token | Value | Usage |
|-------|-------|-------|
| `--color-surface-default` | `#FCFBF8` | Cards, modals, nav dropdowns |
| `--color-surface-raised` | `#FCFBF8` | Same base; elevation via shadow |
| `--color-surface-overlay` | `rgba(252, 251, 248, 0.92)` | Login glass card, sheets |
| `--color-surface-scrim` | `rgba(47, 54, 45, 0.40)` | Modal/sheet backdrop |

#### Primary
| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#87977F` | Primary buttons, key CTAs |
| `--color-primary-hover` | `#4D5748` | Hover / active primary |
| `--color-primary-foreground` | `#FCFBF8` | Text on primary |
| `--color-primary-muted` | `#A8B2A1` | Secondary emphasis within primary family |

#### Secondary
| Token | Value | Usage |
|-------|-------|-------|
| `--color-secondary` | `#A8B2A1` | Secondary buttons, selected states |
| `--color-secondary-hover` | `#4D5748` | Hover secondary (with foreground flip) |
| `--color-secondary-foreground` | `#2F362D` | Text on secondary (light bg) |
| `--color-secondary-foreground-inverse` | `#FCFBF8` | Text on secondary hover |

#### Accent
| Token | Value | Usage |
|-------|-------|-------|
| `--color-accent` | `#EAE3D8` | Tags, chips, category pills |
| `--color-accent-foreground` | `#4D5748` | Text on accent |
| `--color-accent-subtle` | `rgba(234, 227, 216, 0.55)` | Selected checkbox/radio backgrounds |

#### Success
| Token | Value | Usage |
|-------|-------|-------|
| `--color-success` | `#4D5748` | Success text, icons |
| `--color-success-surface` | `rgba(168, 178, 161, 0.20)` | Success banners |
| `--color-success-border` | `#A8B2A1` | Success container border |

#### Warning
| Token | Value | Usage |
|-------|-------|-------|
| `--color-warning` | `#8A6B3A` | Warning text |
| `--color-warning-surface` | `#FBF6EE` | Warning banners |
| `--color-warning-border` | `#E8D5B0` | Warning container border |

*Note: Warning is new in v2 — v1 had no dedicated warning palette.*

#### Error
| Token | Value | Usage |
|-------|-------|-------|
| `--color-error` | `#7A4B3A` | Error text, destructive actions |
| `--color-error-surface` | `#FFF8F4` | Error banners, destructive button bg |
| `--color-error-border` | `#E5C8BA` | Error borders |
| `--color-error-hover-border` | `#B89282` | Destructive hover |

#### Text
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#3F3F3B` | Headings, body |
| `--color-text-secondary` | `#6B6B68` | Descriptions, metadata |
| `--color-text-tertiary` | `#8A857D` | Captions, timestamps, placeholders |
| `--color-text-inverse` | `#FCFBF8` | Text on dark/primary surfaces |
| `--color-text-brand` | `#4D5748` | Eyebrows, nav active, links |

#### Border
| Token | Value | Usage |
|-------|-------|-------|
| `--color-border-default` | `#E5E0D8` | Cards, inputs, dividers |
| `--color-border-subtle` | `#EFEAE2` | Internal card dividers |
| `--color-border-strong` | `#D9D2C8` | Secondary button borders |
| `--color-border-focus` | `#A8B2A1` | Focused input border |
| `--color-border-interactive` | `#A8B2A1` | Hover on cards, selected states |

### 1.3 Color Usage Rules

1. **One green for action.** `--color-primary` is the only green for primary CTAs. `--color-secondary` is for supporting actions, not competing CTAs on the same screen.
2. **Deep olive is for emphasis, not decoration.** Use for hover, active nav, eyebrows — not large fills.
3. **Accent is for taxonomy, not action.** Tags, categories, counts — never primary buttons.
4. **Error is warm, not alarm-red.** Keeps calm identity; still meets contrast requirements.
5. **No `#000` or pure white.** Page white is `#FCFBF8`; black is `#3F3F3B`.
6. **External brand colors are exceptions.** Kakao `#FEE500` is allowed only on the Kakao login button.

---

## 2. Typography

### 2.1 Font Families

| Role | Stack | Notes |
|------|-------|-------|
| **Display / Headings** | `"Pretendard Variable", Pretendard, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif` | Clean, premium Korean sans. Single family for cohesion. |
| **Body / UI** | Same as above | One family reduces “stitched” feeling |
| **Monospace** (optional) | `"SF Mono", "D2Coding", monospace` | Payment codes, debug — never user-facing errors |

*Alternative for future editorial upgrade: add `"Noto Serif KR"` for Display only. Not required for v2 launch.*

### 2.2 Type Scale

Mobile-first. All sizes use **rem**. Line heights are unitless.

| Role | Size (mobile → desktop) | Weight | Line height | Letter spacing | Usage |
|------|-------------------------|--------|-------------|----------------|-------|
| **Display** | 2.25rem → 3rem (36 → 48px) | 600 | 1.12 | 0 | Homepage hero, major marketing moments only |
| **H1** | 1.875rem → 2.25rem (30 → 36px) | 600 | 1.15 | 0 | Page titles |
| **H2** | 1.5rem → 1.75rem (24 → 28px) | 600 | 1.20 | 0 | Section titles, card group headers |
| **H3** | 1.25rem → 1.375rem (20 → 22px) | 600 | 1.25 | 0 | Card titles, form section titles |
| **Body** | 1rem (16px) | 400 | 1.625 (26px) | 0 | Default reading text |
| **Body Strong** | 1rem (16px) | 600 | 1.625 | 0 | Labels, button text, emphasis |
| **Small** | 0.875rem (14px) | 500 | 1.5 (21px) | 0 | Metadata, nav, badge text |
| **Caption** | 0.75rem (12px) | 500 | 1.45 (17px) | 0 | Timestamps, legal, footnotes |

### 2.3 Semantic Text Styles

| Style | Composition | Usage |
|-------|-------------|-------|
| **Eyebrow** | Small · 500 · `--color-text-brand` | Page/section labels (“둘러보기”, “컬렉션”) |
| **Lead** | Body · `--color-text-secondary` | Page descriptions under H1 |
| **Memory** | Body · `--color-text-secondary` | Place “한 줄 기록” on cards and detail |
| **Meta** | Small · `--color-text-tertiary` | Region, dates, counts |

### 2.4 Typography Rules

1. **Display appears once per page maximum** — usually homepage hero or auth welcome.
2. **H1 is the page title** — one per route. Do not use H1 styling on cards.
3. **Form inputs use Body Strong (16px), not 20px+.** Touch targets come from height/padding, not font size.
4. **No ALL CAPS in Korean UI.** Eyebrows use sentence case or natural Korean.
5. **English is allowed only for proper nouns** (Re:Place, Kakao, Naver). No decorative English (“Archive note”).
6. **Max line length:** 34rem (~544px) for lead paragraphs; 100% within cards.

---

## 3. Spacing Scale

Base unit: **4px**. All spacing uses named tokens.

| Token | Value | Common usage |
|-------|-------|--------------|
| `--space-0` | 0 | — |
| `--space-1` | 4px | Tight inline gaps |
| `--space-2` | 8px | Chip padding-y, tag gaps |
| `--space-3` | 12px | Compact component gaps |
| `--space-4` | 16px | Default inline gap, card padding (mobile) |
| `--space-5` | 20px | Card content gaps |
| `--space-6` | 24px | Section internal spacing |
| `--space-8` | 32px | Page header → content |
| `--space-10` | 40px | Section gaps (mobile) |
| `--space-12` | 48px | Page vertical padding (mobile) |
| `--space-16` | 64px | Section gaps (desktop) |
| `--space-20` | 80px | Large section breaks |
| `--space-24` | 96px | Homepage section rhythm |

### Layout Constants

| Token | Value | Usage |
|-------|-------|-------|
| `--layout-max-width` | 72rem (1152px) | Standard pages (`max-w-6xl`) |
| `--layout-max-width-narrow` | 56rem (896px) | Forms, detail focus |
| `--layout-gutter` | 20px → 32px | Page horizontal padding |
| `--layout-header-height` | 60px | Sticky nav |

### Spacing Rules

1. Use scale tokens only — no arbitrary values like `gap-7` unless mapped to token.
2. **Vertical rhythm:** page padding `--space-12` mobile / `--space-16` desktop; between sections `--space-10` / `--space-16`.
3. **Card internal padding:** `--space-4` mobile, `--space-5` or `--space-6` desktop.
4. **Grid gaps:** `--space-5` between cards in lists.

---

## 4. Border Radius Scale

Four levels + full. Eliminates v1’s `[22px]`, `[24px]`, `[28px]`, `[32px]` drift.

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 12px | Inputs, small buttons (login), inner panels |
| `--radius-md` | 16px | Default cards, modals, dropdowns |
| `--radius-lg` | 20px | Featured cards, marketing blocks, image frames |
| `--radius-xl` | 24px | Hero collage pieces, bottom CTA band |
| `--radius-full` | 9999px | Pills, buttons, chips, avatars |

### Radius Rules

1. **Buttons:** always `--radius-full`.
2. **Inputs / textareas:** `--radius-sm`.
3. **Standard cards (Place, Collection):** `--radius-md`.
4. **Featured / editorial surfaces:** `--radius-lg` or `--radius-xl` — never both on the same page section.
5. **Nested radius:** inner radius = outer radius − padding (when visually nested).

---

## 5. Shadow Scale

Shadows use a single olive-tinted hue: `rgba(47, 54, 45, …)` for cohesion.

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-none` | none | Flat inset areas |
| `--shadow-sm` | `0 4px 12px rgba(47, 54, 45, 0.06)` | Subtle lift: secondary buttons |
| `--shadow-md` | `0 8px 24px rgba(47, 54, 45, 0.08)` | Default cards, dropdowns |
| `--shadow-lg` | `0 16px 40px rgba(47, 54, 45, 0.10)` | Modals, featured cards, hero cards |
| `--shadow-xl` | `0 24px 64px rgba(47, 54, 45, 0.14)` | Bottom sheets (mobile), payment focus |

### Shadow Rules

1. **One elevation per component** — do not stack multiple shadows.
2. **Hover lift:** translate Y −2px + promote shadow one level (md → lg). No scale on cards.
3. **Scrim + shadow:** overlays use scrim color token, not shadow, for dimming.
4. **Images inside cards:** no shadow on image; shadow on card container only.

---

## 6. Button System

All buttons share anatomy: **min-height 44px**, horizontal padding `--space-5` to `--space-6`, **Body Strong** typography, **`--radius-full`**, focus ring (see §11).

### 6.1 Primary

| Property | Value |
|----------|-------|
| Background | `--color-primary` |
| Text | `--color-primary-foreground` |
| Border | none |
| Shadow | `--shadow-sm` |
| Hover | bg `--color-primary-hover`, shadow `--shadow-md` |
| Active | bg `--color-primary-hover`, shadow `--shadow-sm` |
| Disabled | opacity 0.55, no hover |
| Usage | One primary per viewport section: “장소 기록하기”, “저장하기”, form submit |

### 6.2 Secondary

| Property | Value |
|----------|-------|
| Background | `--color-surface-default` |
| Text | `--color-text-brand` |
| Border | 1px `--color-border-strong` |
| Shadow | `--shadow-sm` |
| Hover | bg `--color-accent-subtle`, border `--color-border-interactive` |
| Usage | “둘러보기”, cancel-adjacent actions, header CTAs |

### 6.3 Ghost

| Property | Value |
|----------|-------|
| Background | transparent |
| Text | `--color-text-brand` |
| Border | none |
| Hover | bg `--color-accent-subtle` |
| Usage | Tertiary actions, “전체 보기”, text-adjacent controls, icon buttons |

### 6.4 Destructive

| Property | Value |
|----------|-------|
| Background | `--color-error-surface` |
| Text | `--color-error` |
| Border | 1px `--color-error-border` |
| Hover | border `--color-error-hover-border`, bg slightly darker blush |
| Usage | Delete, remove from collection. Always requires confirmation modal — never `window.confirm`. |

### 6.5 Button Sizes

| Size | Min height | Padding X | Type | Usage |
|------|------------|-----------|------|-------|
| **sm** | 36px | 16px | Small | Inline card actions, compact modals |
| **md** | 44px | 20px | Body Strong | Default |
| **lg** | 48px | 24px | Body Strong | Hero CTAs, empty states |

### 6.6 Button Rules

1. **Maximum one Primary per visible section.**
2. **Destructive never sits beside Primary without separation** (menu or modal).
3. **Loading state:** replace label with verb + “중...” (`저장하는 중...`); do not change button size.
4. **Icon + label:** 8px gap; icon 20px, stroke 1.75px — use SVG set, not Unicode symbols (♥ → icon).
5. **Kakao button:** external exception — Kakao brand yellow, `--radius-sm`, separate component.

---

## 7. Card System

Three canonical cards. All share: `--color-surface-default` bg, `--color-border-default` border, `--shadow-md`, `--radius-md`, hover border `--color-border-interactive` + `--shadow-lg` + translateY −2px.

### 7.1 Shared Card Anatomy

```
┌─────────────────────────────┐
│  Media (optional)           │  aspect-ratio locked
├─────────────────────────────┤
│  Meta row (chips + region)    │
│  Title (H3)                 │
│  Body / memory (Body)       │
│  Footer meta (optional)     │  border-top --color-border-subtle
└─────────────────────────────┘
```

### 7.2 PlaceCard

**Purpose:** Represent a single place record in grids and lists.

| Property | Specification |
|----------|---------------|
| Media aspect | **4:3** (grid), **16:10** (featured variant only) |
| Media fallback | `--color-accent` bg + centered Small text |
| Title | H3, max 2 lines clamp |
| Memory | Body, `--color-text-secondary`, max 2 lines clamp |
| Footer | Optional “다시 가고 싶은 마음” label (Caption) + value (Small Strong) |
| Meta chips | Category = filled chip; region = plain Small |
| Overlay badges | Top-right absolute: visibility, saved date (Small on `--surface-default`/95) |
| Interaction | Entire card is link; focus ring on container |
| Variants | `grid` (default), `featured` (larger media, `--radius-lg`), `compact` (no footer) |

### 7.3 CollectionCard

**Purpose:** Represent a curated group of places.

| Property | Specification |
|----------|---------------|
| Cover aspect | **16:10** |
| Cover source | First place image or placeholder (see EmptyCard rules) |
| Title | H3 |
| Description | Body or “설명 없이 조용히 모아둔 컬렉션” fallback |
| Meta | Count chip + visibility chip + date (Caption) |
| Footer CTA | Ghost text “열어보기 →” or none (whole card links) |
| Variants | `grid`, `carousel` (fixed width ~240px, `--radius-md`) |

### 7.4 EmptyCard

**Purpose:** Placeholder when media or data is missing — not a marketing empty state.

| Property | Specification |
|----------|---------------|
| Background | `--color-accent` or `--color-bg-subtle` |
| Border | dashed 1px `--color-border-interactive` (upload contexts) or solid `--color-border-default` |
| Content | H3 or Small title + Caption description, centered |
| Usage | No image on PlaceCard, empty collection cover, image upload dropzone |
| Distinction | **EmptyCard** = missing content tile; **EmptyState** (separate) = page-level no-data |

### 7.5 Card Rules

1. **One PlaceCard component, three variants** — no parallel `FeaturedPlaceCard`.
2. **Images:** Next.js `Image` everywhere; no CSS `background-image` on cards.
3. **All cards in a grid share the same variant and aspect ratio.**
4. **Carousel cards use the same component** as grid — only layout wrapper differs.

---

## 8. Input System

### 8.1 Shared Input Anatomy

| Property | Value |
|----------|-------|
| Min height | 44px (text), auto (textarea) |
| Padding | 12px 16px |
| Radius | `--radius-sm` |
| Border | 1px `--color-border-default` |
| Background | `--color-surface-default` |
| Text | Body Strong · `--color-text-primary` |
| Placeholder | `--color-text-tertiary` at 80% opacity |
| Focus | border `--color-border-focus`, ring 3px `rgba(168, 178, 161, 0.25)` |
| Error | border `--color-error-border`, helper text `--color-error` (Small) |
| Disabled | bg `--color-bg-subtle`, opacity 0.7 |

### 8.2 Input Types

| Type | Spec |
|------|------|
| **Text / email / password** | Single line, 44px height |
| **Textarea** | Min 3 rows, Body line height, resize vertical only |
| **Select** | Same height as text; chevron icon 16px |
| **File upload** | EmptyCard pattern: dashed border, min-height 176px, click target full area |
| **Checkbox / radio** | 20px control, accent `--color-primary-hover`; label Body Strong; option group in `--radius-sm` bordered rows |
| **Search with dropdown** | Input + anchored panel, `--shadow-lg`, `--radius-md` |

### 8.3 Form Layout

| Element | Style |
|---------|-------|
| Form container | `--radius-md`, `--shadow-md`, padding `--space-5` → `--space-6` |
| Section title | H2 |
| Field label | Body Strong + optional Caption “(필수)” in `--color-text-brand` |
| Field gap | `--space-4` |
| Section gap | `--space-6`, separated by `--color-border-subtle` |
| Submit | Primary lg, full width on mobile |

### 8.4 Input Rules

1. **Never use `text-xl` inside inputs.**
2. **Required fields:** label + “(필수)” — not red asterisks alone.
3. **Errors appear below field** in Small; banner for form-level errors only.
4. **Success after submit:** toast or inline banner (Success tokens), then redirect — min 800ms visible.

---

## 9. Badge & Chip

### 9.1 Chip (taxonomy)

For categories, space tags, counts.

| Property | Value |
|----------|-------|
| Shape | `--radius-full` |
| Padding | 4px 12px |
| Type | Small |
| Background | `--color-accent` |
| Text | `--color-accent-foreground` |
| Border | none |

### 9.2 Badge (status)

For public/private, visibility, premium, saved date overlays.

| Variant | Background | Text | Border |
|---------|------------|------|--------|
| **Neutral** | `--color-surface-default` / 95% | `--color-text-brand` | `--color-border-default` |
| **Accent** | `--color-accent` | `--color-accent-foreground` | none |
| **Success** | `--color-success-surface` | `--color-success` | `--color-success-border` |
| **Warning** | `--color-warning-surface` | `--color-warning` | `--color-warning-border` |
| **Error** | `--color-error-surface` | `--color-error` | `--color-error-border` |

Overlay badges on cards: `--shadow-sm`, padding 4px 12px, Caption/Small.

### 9.3 Chip vs Badge

| | Chip | Badge |
|---|------|-------|
| Purpose | User-authored taxonomy | System/state metadata |
| Examples | 카페, 조용해요 | 공개, 23곳, Premium |
| Interactive | Can toggle in forms | Display only (except filter chips — future) |

---

## 10. Motion Principles

Re:Place motion is **quiet**. Nothing bounces, pulses, or slides aggressively.

### 10.1 Timing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `--motion-fast` | 120ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Hover color, opacity |
| `--motion-base` | 200ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Card lift, button shadow |
| `--motion-slow` | 320ms | `cubic-bezier(0.4, 0, 0.2, 1)` | Modal/sheet enter |
| `--motion-emphasis` | 400ms | `cubic-bezier(0.22, 1, 0.36, 1)` | Page section reveal (optional) |

### 10.2 Allowed Motion

| Interaction | Motion |
|-------------|--------|
| Button hover | Background + shadow crossfade (`--motion-fast`) |
| Card hover | translateY(−2px) + shadow (`--motion-base`) |
| Modal / sheet open | Scrim fade in + panel translateY(8px → 0) or fade (`--motion-slow`) |
| Skeleton loading | Opacity pulse 0.4 ↔ 0.7, 1.5s loop |
| Accordion | Height auto with `--motion-base` (respect `prefers-reduced-motion`) |
| Toast | Slide from bottom 8px + fade (`--motion-base`) |

### 10.3 Forbidden Motion

- Bounce / spring overshoot
- Scale > 1.02 on hover
- Parallax on scroll (except static hero collage offset — no scroll-linked animation)
- Infinite animation on CTAs
- Layout-shifting transitions on text content

### 10.4 Accessibility

```css
@media (prefers-reduced-motion: reduce) {
  /* All durations → 0ms; keep opacity changes instant */
}
```

Focus states must not depend on motion.

---

## 11. Rules for Every Future Component

### 11.1 Token Discipline

1. **No raw hex, rgb, or arbitrary Tailwind values** in components (`bg-[#…]`, `rounded-[28px]` forbidden).
2. **All colors, radii, shadows, spacing from tokens** defined in `globals.css` → `@theme`.
3. **New semantic need?** Add a token first, then use it. Never one-off in a component.

### 11.2 Component Architecture

4. **Shared primitives live in `components/ui/`** — Button, Card, Input, Badge, EmptyState, StatusMessage, Modal, Skeleton.
5. **Feature components compose primitives** — `PlaceCard` wraps `Card`, not bespoke divs.
6. **One component per concept** — no duplicate cards, headers, or modals.
7. **PageHeader is mandatory** for all list/form pages (eyebrow + H1 + Lead + optional CTA slot).

### 11.3 Visual Consistency

8. **One primary action color** (`--color-primary`) per section.
9. **Typography roles are semantic** — pick from §2 scale, not arbitrary `text-2xl`.
10. **Elevation uses shadow tokens only** — three levels max visible at once.
11. **Icons from one set** — 20px / 24px sizes, 1.75px stroke, `--color-text-secondary` default.

### 11.4 Interaction & Accessibility

12. **Minimum touch target 44×44px** for all interactive elements.
13. **Focus visible on all interactives** — 3px outline `--color-primary-hover`, 4px offset.
14. **Keyboard:** modals trap focus; Escape closes; dropdowns navigable by arrow keys.
15. **Images:** meaningful `alt` text; decorative images `alt=""`.
16. **Loading:** skeleton matching final layout — not full-page text boxes for lists.
17. **Errors:** user-friendly Korean copy — never expose Supabase, error codes, or config messages.

### 11.5 Content & Locale

18. **Korean-first copy** — no decorative English in product UI.
19. **Empty states explain the next step** — always offer one action.
20. **Destructive actions** use Destructive button + confirmation modal with clear consequence text.

### 11.6 Responsive

21. **Mobile-first styles** — scale up at `sm` (640px) and `lg` (1024px) only.
22. **Max content width** respects layout tokens.
23. **Horizontal scroll carousels** show partial next-item peek or fade edge — never hide scrollbar without affordance.

### 11.7 Review Checklist (PR gate)

Before merging any UI change, confirm:

- [ ] Uses semantic tokens only
- [ ] Matches a defined Button / Card / Input variant
- [ ] Typography from scale (no oversized form text)
- [ ] One primary CTA per section
- [ ] Loading skeleton or route `loading.tsx` where data fetches
- [ ] Focus and 44px touch targets verified
- [ ] Copy is Korean, friendly, non-technical
- [ ] `prefers-reduced-motion` respected

---

## Appendix A: v1 → v2 Migration Map

| v1 pattern | v2 replacement |
|------------|----------------|
| `#87977F` and `#A8B2A1` both as primary CTAs | Primary = Moss; Secondary button = Sage |
| `#6F6F68`, `#6B6B68`, `#8A857D`, `#5D5D59` | `--color-text-secondary` / `--color-text-tertiary` only |
| `rounded-[22px]` … `[32px]` | `--radius-md` / `--radius-lg` / `--radius-xl` |
| `FeaturedPlaceCard` + `PlaceCard` | `PlaceCard` variants |
| `CollectionsSection` mock cards | `CollectionCard` + live data or EmptyState |
| `StatusMessage` for loading lists | Skeleton + `StatusMessage` for errors only |
| `text-xl` form inputs | Body Strong (16px) inputs |
| Unicode ♥/♡ | Heart icon component |
| `window.confirm` delete | Destructive modal pattern |

---

## Appendix B: Recommended File Structure (when implementing)

```
app/globals.css          ← all tokens + @theme mapping
components/ui/
  Button.tsx
  Card.tsx
  Input.tsx
  Textarea.tsx
  Badge.tsx
  Chip.tsx
  EmptyState.tsx
  StatusMessage.tsx
  Modal.tsx
  Sheet.tsx
  Skeleton.tsx
  PageHeader.tsx
components/
  PlaceCard.tsx          ← composes ui/Card
  CollectionCard.tsx     ← composes ui/Card
docs/
  DESIGN_SYSTEM.md       ← this document
```

---

**Re:Place Design System v2** is the single source of truth for visual and interaction decisions. When in doubt: warm surface, calm motion, one green for action, and typography that lets the memory—not the chrome—lead.

---

This document is part of the Re:Place documentation system.
