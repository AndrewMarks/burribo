# Blog Functionality Design Spec

## Overview

Add a blog ("writing") section to burribo.com as a layer on top of the existing hero landing page. The writing section lives below the hero on the homepage, with individual posts at dedicated URLs. The hero page remains unchanged except for a new navigation link.

## Goals

- Provide a space for essays, case studies, and observations across four categories
- Maintain the atmospheric quality and craft level of the existing hero
- Create an immersive, distraction-free reading experience
- Keep the site minimal — no templates, no card grids, no structural bloat

## Non-goals

- Portfolio/work section (future phase)
- About section (future phase)
- Comments, social sharing, related posts
- Image-heavy posts or media embeds
- Filtering, search, or tag pages
- Sticky navigation or hamburger menus

---

## 1. Hero Addition: Navigation Link

### What changes

A single text link — `writing` — fades in at the bottom-left of the hero section after the existing tagline animation completes.

### Behavior

- Appears ~0.5s after the tagline finishes its reveal animation
- Fade-in only (opacity 0 → 1), no translate or movement
- Clicking scrolls to the `#writing` section below the hero via Lenis smooth scroll
- Styled in muted color (`#888` or similar), lowercase, small type (~11px), letter-spacing ~0.08em
- Hover state: color brightens (match existing hotspot hover behavior)

### Constraints

- No other changes to the hero section — layout, fonts, animation timing, hotspots all remain exactly as they are
- The nav link must not interfere with existing hotspot click targets
- `prefers-reduced-motion`: link appears immediately with no animation

### Future

- `about` and `work` links will be added alongside `writing` in subsequent phases
- The nav area should accommodate 2-3 links horizontally without layout changes

---

## 2. Writing Section (Blog Index)

### Position

Below the hero, on the same page (`index.md` / `/`).

### Transition

Gradient background transition from `#0a0a0a` (hero) to `#111111` (writing section). No hard edge — the star field fades into the content area.

### Layout

Editorial list — single centered column.

- **Section label:** "Writing" in small uppercase muted text (~10px, `#767676`, letter-spacing ~0.12em) — must meet WCAG AA (4.5:1)
- **Post entries:** Vertical list, each containing:
  - Date + category + reading time (e.g., "March 2026 · Craft · 8 min read") — small, muted
  - Title — white, ~16-18px, semi-bold, line-height ~1.3
  - Excerpt — one line, muted gray (`#888`), ~12-14px
- **Dividers:** Thin horizontal rules (`#1a1a1a`) between posts
- **Max-width:** Constrained to a comfortable reading measure (~600-640px), centered

### Categories

Four categories, stored in Jekyll front matter as `category:`:

- **Essay** — personal reflections, opinions, broader thinking
- **Craft** — writing about the practice of making things
- **Industry** — observations about games, publishing, adjacent fields
- **Notes** — shorter observations, less polished

### Reading Time

Calculated from post word count: `words / 200`, rounded up to nearest minute. Displayed in the metadata line on both the index and individual post pages. Implemented using Jekyll's `number_of_words` Liquid filter — no plugin required.

### Scroll Animation: Progressive Reveal

- Content fades in via opacity as it enters the viewport
- No translate or movement — purely opacity-based
- Horizontal divider rules draw in (width animates from 0 to full) as scroll progresses
- Section heading fades in first, posts follow with slight stagger
- Triggered via GSAP ScrollTrigger, consistent with existing animation infrastructure
- `prefers-reduced-motion`: all content visible immediately, no animation

### Post Count

- Shows all posts on the homepage (expected: 1-2 at launch)
- No pagination or capping logic built in this phase
- Promoting `/writing/` to a standalone page is a future change, not part of this spec

### Anchor

Section has `id="writing"` for anchor navigation from the hero nav link.

---

## 3. Post Reading Experience

### URL Structure

`/writing/post-slug/`

Posts live in Jekyll's `_posts/` directory with standard naming: `YYYY-MM-DD-post-title.md`. Permalink configured to produce `/writing/:slug/` URLs.

### Top Bar

Non-sticky bar at the top of the page:

- **Left:** `← back` — links to `/#writing` (blog index section on homepage)
- **Right:** `Andrew Marks` — links to `/` (hero/top of page)
- Small type (~10-11px), muted color, wide letter-spacing
- Static positioning (not fixed/sticky) — it scrolls out of view naturally as the user reads, and is visible again when they scroll back to the top of the page. No JS hide/show behavior.

### Post Header

- **Metadata line:** Category + date + reading time (e.g., "Craft · March 2026 · 8 min read") — small uppercase muted text
- **Title:** White, ~28-32px, bold, tight line-height (~1.2)
- **Divider:** Thin horizontal rule below the title, separating header from body content

### Body Typography

- **Column width:** ~600-640px centered, matching the index section
- **Font:** Inter (already loaded)
- **Font size:** 16-18px
- **Line-height:** ~1.8
- **Text color:** `#ccc` on `#111` background (contrast ratio ~11.4:1, exceeds WCAG AA)
- **Paragraphs:** Comfortable vertical spacing between paragraphs (~18-20px margin)
- **Emphasis:** `<em>` rendered in slightly brighter color (`#e0e0e0`)
- **Headings within posts:** Sized between body and title, white, with generous top margin
- **Block quotes:** Left border accent, slightly indented, muted styling
- **Code/preformatted:** If needed, dark elevated background (`#1a1a1a`), monospace font

### Jekyll Setup

- New layout: `_layouts/post.html`
- Front matter fields:
  - `title:` — post title
  - `category:` — one of: essay, craft, industry, notes
  - `description:` — one-line excerpt (displayed on index)
  - `layout: post`
  - `date:` — standard Jekyll date

---

## 4. Accessibility & Contrast

### Requirements

All text must meet WCAG AA contrast ratios against its background:

| Element | Foreground | Background | Ratio | Requirement |
|---------|-----------|------------|-------|-------------|
| Body text | `#cccccc` | `#111111` | 11.4:1 | 4.5:1 (AA) |
| Post title | `#ffffff` | `#111111` | 17.4:1 | 3:1 (large) |
| Muted metadata | `#767676`+ | `#111111` | ≥ 4.5:1 | 4.5:1 (AA) |
| Nav links | `#888888`+ | `#0a0a0a` | ≥ 4.5:1 | 4.5:1 (AA) |
| Divider rules | `#1a1a1a` | `#111111` | N/A | Decorative |

All meaningful text uses colors that pass AA. Minimum muted text color: `#767676` on `#111` = 4.5:1 (passes). `#888` on `#111` = 5.2:1 (passes). No meaningful text may use `#555` or below.

### Reduced Motion

- All scroll animations disabled
- Hero nav link appears immediately
- Progressive reveal content visible without fade
- Lenis smooth scroll disabled (existing behavior)

---

## 5. File Changes

### New files

- `_layouts/post.html` — post reading template
- `_posts/` — directory for blog posts (currently gitignored — remove from `.gitignore`)
- Sample post(s) for testing

### Modified files

- `index.md` — add writing section markup below the hero
- `assets/css/main.scss` — writing section styles, post page styles, progressive reveal animation
- `assets/js/main.js` — hero nav fade-in animation, writing section ScrollTrigger, progressive reveal
- `_config.yml` — permalink configuration for posts
- `.gitignore` — remove `_posts/` and `blog.md` from ignore list (these were V2 holdovers)

### Unchanged

- `_layouts/default.html` — no changes needed
- `_includes/footer.html` — remains empty
- `assets/img/` — no new images
- Hero section markup and behavior — untouched

---

## 6. Technical Notes

### Jekyll Collections vs Posts

Use standard Jekyll `_posts/` with permalink configuration rather than a custom collection. Standard posts give us `jekyll-feed` and `jekyll-seo-tag` support for free.

### Permalink Configuration

Add to `_config.yml`:
```yaml
permalink: /writing/:slug/
```

This produces clean URLs like `/writing/building-a-ttrpg/`.

### Reading Time Calculation

In Liquid templates:
```liquid
{% assign words = content | number_of_words %}
{% assign minutes = words | plus: 199 | divided_by: 200 %}
{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}
{{ minutes }} min read
```

This uses ceiling division (round up only when there's a remainder). A 200-word post shows "1 min read", a 201-word post shows "2 min read".

### Progressive Reveal Implementation

Uses GSAP ScrollTrigger (already loaded):
- Each post entry and divider gets a ScrollTrigger instance
- Trigger point: element enters viewport (~85% from top)
- Animation: opacity 0 → 1
- Divider rules: `scaleX(0)` → `scaleX(1)` with `transform-origin: left`
- Duration: ~0.6-0.8s per element, staggered by ~0.1s

### No New Dependencies

Everything uses existing libraries (GSAP, ScrollTrigger, Lenis, Inter font, Jekyll plugins). No new gems, CDN scripts, or build tools.
