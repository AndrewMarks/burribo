# Multi-Page Restructuring Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure burribo.com from a single scrolling page into a multi-page site with the hero as a standalone homepage and writing at `/writing/`.

**Architecture:** Jekyll multi-page with shared `default.html` layout. New `writing.html` layout for the index page. Hero nav updated for page links. Outfit 800 font added for uppercase display titles.

**Tech Stack:** Jekyll, SCSS, GSAP + ScrollTrigger, Lenis, Google Fonts (Inter + Outfit)

**Spec:** `docs/superpowers/specs/2026-03-25-multi-page-restructuring-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `_layouts/default.html` | Modify | Add Outfit font to Google Fonts link |
| `index.md` | Modify | Remove writing section + transition, update nav to page link |
| `_layouts/writing.html` | Create | Writing index page layout (starfield, top bar, entry list) |
| `writing.md` | Create | Writing index page content (front matter only, layout does the work) |
| `_layouts/post.html` | Modify | Update back link href, apply Outfit title class |
| `assets/css/main.scss` | Modify | Writing page styles, hero nav updates, post title Outfit, remove old writing-section-on-homepage styles |
| `assets/js/main.js` | Modify | Remove homepage writing section scroll logic, keep progressive reveal for writing page |

---

### Task 1: Add Outfit Font

**Files:**
- Modify: `_layouts/default.html:17`

- [ ] **Step 1: Update Google Fonts link to include Outfit 800**

In `_layouts/default.html`, replace line 17:

```html
<!-- Current -->
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Display:wght@700;900&family=Inter:wght@400;700&display=swap" rel="stylesheet">

<!-- New -->
<link href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Stencil+Display:wght@700;900&family=Inter:wght@400;500;600;700;800&family=Outfit:wght@800&display=swap" rel="stylesheet">
```

Note: Inter weights expanded to include 500, 600, 800 used in writing page top bar and entry titles.

- [ ] **Step 2: Add Outfit to SCSS design system variables**

In `assets/css/main.scss`, after `--font-primary` (around line 54), add:

```scss
--font-display-editorial: 'Outfit', system-ui, sans-serif;
```

- [ ] **Step 3: Verify font loads**

Run: `bundle exec jekyll serve --host 0.0.0.0 --port 4000`

Open in browser, check Network tab confirms Outfit font file loads.

- [ ] **Step 4: Commit**

```bash
git add _layouts/default.html assets/css/main.scss
git commit -m "Add Outfit 800 font and editorial display variable"
```

---

### Task 2: Strip Writing Section from Homepage

**Files:**
- Modify: `index.md`

- [ ] **Step 1: Update hero nav link**

In `index.md`, replace the nav block (lines 39-41):

```html
<!-- Current -->
<nav class="hero-nav" id="hero-nav">
  <a href="#writing" class="hero-nav__link">writing</a>
</nav>

<!-- New -->
<nav class="hero-nav" id="hero-nav">
  <a href="/writing/" class="hero-nav__link">writing</a>
</nav>
```

- [ ] **Step 2: Remove transition gradient and writing section**

Delete everything after the closing `</section>` of the hero (line 42 onward):

Remove:
```html
<div class="hero-to-writing-transition"></div>

<section class="writing-section" id="writing">
  ...entire writing section...
</section>
```

The file should end after the hero's closing `</section>` tag.

- [ ] **Step 3: Verify homepage is hero-only**

Refresh the site. Homepage should show only the fullscreen hero with no scroll. The "writing" link should be visible but will 404 until the writing page is created.

- [ ] **Step 4: Commit**

```bash
git add index.md
git commit -m "Strip writing section from homepage, link nav to /writing/"
```

---

### Task 3: Update Hero Nav Styling

**Files:**
- Modify: `assets/css/main.scss:1058-1082`

- [ ] **Step 1: Update hero-nav styles for multi-link layout**

Replace the `.hero-nav` and `.hero-nav__link` blocks (lines 1058-1082):

```scss
.hero-nav {
  position: absolute;
  bottom: var(--space-lg);
  left: var(--space-md);
  z-index: 10;
  opacity: 0;
  display: flex;
  gap: 24px;
}

.hero-nav__link {
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 400;
  color: var(--color-fg-muted);
  text-decoration: none;
  letter-spacing: 0.06em;
  text-transform: lowercase;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-fg);
  }
}

.no-js .hero-nav {
  opacity: 1;
}
```

- [ ] **Step 2: Update mobile hero-nav override**

In the mobile media query (around line 1504), update:

```scss
.hero-nav {
  bottom: var(--space-md);
  left: var(--space-sm);
  flex-direction: column;
  gap: 12px;
}
```

- [ ] **Step 3: Verify nav renders correctly**

Check desktop: single "writing" link, bottom-left, horizontal layout.
Check mobile: same link, stacked layout ready for future additions.

- [ ] **Step 4: Commit**

```bash
git add assets/css/main.scss
git commit -m "Update hero nav for multi-link layout"
```

---

### Task 4: Create Writing Page Layout

**Files:**
- Create: `_layouts/writing.html`
- Create: `writing.md`

- [ ] **Step 1: Create the writing layout**

Create `_layouts/writing.html`:

```html
---
layout: default
---

<div class="writing-starfield"></div>

<div class="writing-page">
  <div class="writing-container">
    <nav class="writing-topbar">
      <a href="/" class="writing-topbar__back">← back</a>
      <span class="writing-topbar__title">Writing</span>
      <a href="/" class="writing-topbar__name">Andrew Marks</a>
    </nav>

    <div class="writing-entries">
      {% for post in site.posts %}
      <a href="{{ post.url | relative_url }}" class="writing-entry reveal-writing">
        <div class="writing-entry__meta-col">
          <span class="writing-entry__date">{{ post.date | date: "%B %Y" }}</span>
          <span class="writing-entry__cat">{{ post.category | capitalize }} · {% assign words = post.content | number_of_words %}{% assign minutes = words | plus: 199 | divided_by: 200 %}{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}{{ minutes }} min read</span>
        </div>
        <div class="writing-entry__content-col">
          <span class="writing-entry__title">{{ post.title }}</span>
          <span class="writing-entry__excerpt">{{ post.description }}</span>
        </div>
      </a>
      {% unless forloop.last %}<hr class="writing-entry__divider reveal-writing-divider">{% endunless %}
      {% endfor %}
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create the writing page content file**

Create `writing.md`:

```markdown
---
layout: writing
title: Writing — Andrew Marks
description: Essays, observations, and notes on games, publishing, and creative work.
---
```

- [ ] **Step 3: Verify the page renders at /writing/**

Navigate to `http://localhost:4000/writing/`. Should show the top bar and post list (unstyled beyond defaults at this point).

- [ ] **Step 4: Commit**

```bash
git add _layouts/writing.html writing.md
git commit -m "Add writing page layout and content file"
```

---

### Task 5: Style the Writing Page

**Files:**
- Modify: `assets/css/main.scss`

- [ ] **Step 1: Add starfield header styles**

Add after the hero-to-writing-transition block (around line 1087, which can be replaced):

```scss
// ============================================
// Writing Page - Starfield Header
// ============================================
.writing-starfield {
  height: 60px;
  background: linear-gradient(to bottom, var(--color-bg-deep), var(--color-bg));
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(circle at 15% 40%, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
      radial-gradient(circle at 35% 20%, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
      radial-gradient(circle at 55% 60%, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
      radial-gradient(circle at 75% 30%, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
      radial-gradient(circle at 90% 50%, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
      radial-gradient(circle at 25% 70%, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 65% 15%, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
    opacity: 0.6;
  }
}
```

- [ ] **Step 2: Add writing page container and top bar styles**

```scss
// ============================================
// Writing Page - Layout
// ============================================
.writing-page {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.writing-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 80px;
}

.writing-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28px 0;
  border-bottom: 1px solid var(--color-bg-elevated);
}

.writing-topbar__back,
.writing-topbar__name {
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--color-fg-muted);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-fg);
  }
}

.writing-topbar__title {
  font-family: var(--font-primary);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-fg);
  letter-spacing: 0.18em;
  text-transform: uppercase;
}
```

- [ ] **Step 3: Add writing entry styles (desktop split layout)**

```scss
// ============================================
// Writing Page - Entry List (Desktop Split)
// ============================================
.writing-entries {
  padding: 48px 0;
}

.writing-entry {
  display: flex;
  gap: 64px;
  padding: 40px 0;
  align-items: baseline;
  text-decoration: none;
  color: inherit;
  transition: opacity 0.2s ease;

  &:hover {
    .writing-entry__title {
      color: var(--color-accent-hover);
    }
  }
}

.writing-entry__meta-col {
  min-width: 180px;
  flex-shrink: 0;
  padding-top: 8px;
  display: flex;
  flex-direction: column;
}

.writing-entry__date {
  font-family: var(--font-primary);
  font-size: 14px;
  color: #999;
  letter-spacing: 0.03em;
  line-height: 1.6;
}

.writing-entry__cat {
  font-family: var(--font-primary);
  font-size: 12px;
  color: #767676;
  letter-spacing: 0.04em;
  margin-top: 4px;
}

.writing-entry__content-col {
  display: flex;
  flex-direction: column;
}

.writing-entry__title {
  font-family: var(--font-display-editorial);
  font-size: 38px;
  font-weight: 800;
  color: var(--color-fg);
  line-height: 1.1;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 14px;
  transition: color 0.2s ease;
}

.writing-entry__excerpt {
  font-family: var(--font-primary);
  font-size: 17px;
  color: #999;
  line-height: 1.5;
  max-width: 640px;
}

.writing-entry__divider {
  border: none;
  height: 1px;
  background-color: var(--color-bg-elevated);
  margin: 0;
  transform-origin: left;
}
```

- [ ] **Step 4: Add mobile responsive overrides**

In the mobile media query (`@media (max-width: 767px)`), add:

```scss
// Writing page mobile
.writing-container {
  padding: 0 24px;
}

.writing-topbar {
  padding: 20px 0;
}

.writing-entry {
  display: block;
  padding: 28px 0;
}

.writing-entry__meta-col {
  flex-direction: row;
  margin-bottom: 10px;
  min-width: auto;
  padding-top: 0;
}

.writing-entry__date,
.writing-entry__cat {
  font-size: 12px;
  color: #767676;
  letter-spacing: 0.05em;
}

.writing-entry__date::after {
  content: ' · ';
}

.writing-entry__cat {
  margin-top: 0;
}

.writing-entry__title {
  font-size: 32px;
}
```

- [ ] **Step 5: Remove old homepage writing section styles**

Remove or replace these blocks that are no longer needed:
- `.hero-to-writing-transition` (around line 1087)
- The old `.writing-section`, `.writing-section__inner`, `.writing-section__label` blocks (lines 1095-1117) — these styled the on-homepage writing section. The new `.writing-entry` styles handle the standalone page.
- The old `.writing-entry` styles (lines 1119-1167) — replaced by the new split-layout entry styles above.
- Mobile `.writing-section` override (around line 1499)

Keep the `.writing-entry__divider` transform-origin rule if not already duplicated in the new styles.

- [ ] **Step 6: Verify writing page at desktop and mobile widths**

Desktop: split layout with meta left, titles right, top bar aligned.
Mobile: stacked layout, 32px titles, meta inline above title.

- [ ] **Step 7: Commit**

```bash
git add assets/css/main.scss
git commit -m "Style writing page with split layout and responsive collapse"
```

---

### Task 6: Update Post Page

**Files:**
- Modify: `_layouts/post.html`
- Modify: `assets/css/main.scss:1216-1224`

- [ ] **Step 1: Update post layout navigation**

In `_layouts/post.html`, change the back link (line 7):

```html
<!-- Current -->
<a href="/#writing" class="post-topbar__back">← back</a>

<!-- New -->
<a href="/writing/" class="post-topbar__back">← back</a>
```

- [ ] **Step 2: Update post title CSS to use Outfit**

In `assets/css/main.scss`, update `.post-page__title` (around line 1216):

```scss
.post-page__title {
  font-family: var(--font-display-editorial);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--color-fg);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: var(--space-md);
}
```

- [ ] **Step 3: Verify post page**

Navigate to a post. Title should render in Outfit 800 uppercase. "← back" should link to `/writing/`.

- [ ] **Step 4: Commit**

```bash
git add _layouts/post.html assets/css/main.scss
git commit -m "Update post page with Outfit title and /writing/ back link"
```

---

### Task 7: Clean Up JavaScript

**Files:**
- Modify: `assets/js/main.js`

- [ ] **Step 1: Remove homepage writing section scroll logic**

In `assets/js/main.js`, the writing section progressive reveal (lines 90-118) uses `.reveal-writing` and `.reveal-writing-divider` selectors. These same class names are used in the new `_layouts/writing.html`, so the ScrollTrigger code works as-is on the writing page — GSAP will find the elements wherever they exist in the DOM.

**What to verify:** The code uses `document.querySelectorAll('.reveal-writing')` which is page-agnostic. On the homepage, it'll find nothing and do nothing. On `/writing/`, it'll find the entries and animate them. No changes needed to this block.

- [ ] **Step 2: Remove anchor scroll behavior for #writing**

The anchor scroll handler (lines 190-204) handles `a[href^="#"]` links. Since the "writing" link is now `/writing/` (not `#writing`), this handler won't match it. The handler is still useful for any future anchor links, so leave it in place. No changes needed.

- [ ] **Step 3: Verify animations on writing page**

Navigate to `/writing/`. Entries should fade in on scroll (progressive reveal). Dividers should animate scaleX. On the homepage, no scroll animations should fire (nothing to animate).

- [ ] **Step 4: Commit (if any changes were made)**

If no JS changes were needed, skip this commit. The existing code is page-agnostic.

---

### Task 8: Final Verification

- [ ] **Step 1: Start dev server and Tailscale funnel**

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle exec jekyll serve --host 0.0.0.0 --port 4000 --watch
```

In a separate session:
```bash
/Applications/Tailscale.app/Contents/MacOS/Tailscale funnel --bg 4000
```

- [ ] **Step 2: Desktop verification checklist**

- [ ] Homepage: hero fills viewport, no scroll, "writing" link visible bottom-left
- [ ] Homepage: "writing" link navigates to `/writing/`
- [ ] Writing page: starfield gradient at top
- [ ] Writing page: top bar with ← back / WRITING / Andrew Marks, aligned with content
- [ ] Writing page: split layout — meta left, Outfit 800 uppercase titles right
- [ ] Writing page: hover on entry shows orange title color
- [ ] Writing page: progressive reveal animations on scroll
- [ ] Writing page: ← back links to homepage
- [ ] Post page: Outfit 800 uppercase title
- [ ] Post page: ← back links to `/writing/`
- [ ] Post page: body text unchanged (Inter, #ccc)

- [ ] **Step 3: Mobile verification checklist**

- [ ] Homepage: hero fills viewport, "writing" link visible, stacked layout ready
- [ ] Writing page: stacked entry layout, 32px titles
- [ ] Writing page: meta inline above title
- [ ] Writing page: top bar responsive
- [ ] Post page: title renders properly at mobile widths

- [ ] **Step 4: Accessibility verification**

- [ ] `prefers-reduced-motion`: all animations disabled, content visible immediately
- [ ] Nav link contrast on hero background passes AA
- [ ] All writing page text contrast passes AA per spec table

- [ ] **Step 5: Commit any final adjustments and verify clean state**

```bash
git status
git log --oneline -10
```
