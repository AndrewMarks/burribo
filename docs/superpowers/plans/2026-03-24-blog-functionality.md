# Blog Functionality Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a writing section below the hero and individual post pages, using progressive reveal animation and maintaining the hero's craft level.

**Architecture:** The homepage (`index.md`) gains a writing section below the existing hero. Posts use Jekyll's standard `_posts/` directory with a new `post.html` layout. Existing V2 CSS for `.post` and `.blog-index` classes will be replaced with new styles matching the spec. GSAP ScrollTrigger handles progressive reveal. No new dependencies.

**Tech Stack:** Jekyll (GitHub Pages), SCSS, GSAP 3.12 + ScrollTrigger, Lenis, Inter + Big Shoulders Stencil Display fonts.

**Spec:** `docs/superpowers/specs/2026-03-24-blog-functionality-design.md`

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `.gitignore` | Modify | Remove `_posts/`, `blog.md`, `_layouts/post.html` from ignore list |
| `_config.yml` | Modify | Add permalink config for `/writing/:slug/` |
| `_layouts/post.html` | Create | Post reading page template (top bar, header, body) |
| `_posts/2026-03-24-building-a-ttrpg.md` | Create | Sample post for testing |
| `index.md` | Modify | Add hero nav link + writing section below hero |
| `assets/css/main.scss` | Modify | Replace V2 blog styles with new writing section + post styles |
| `assets/js/main.js` | Modify | Add hero nav fade-in + progressive reveal ScrollTrigger |
| `_layouts/default.html` | Modify | Add `no-js` class to `<html>` tag for JS fallback |

---

### Task 1: Configuration & Gitignore

**Files:**
- Modify: `.gitignore:17-25`
- Modify: `_config.yml:1-43`

- [ ] **Step 1: Update `.gitignore` to allow blog files**

Remove `_posts/`, `blog.md`, and `_layouts/post.html` from the V2 content ignore list. Keep other V2 items (portfolio, header, breadcrumb) ignored.

Replace lines 17-25:
```
# V2 content (not included in V1)
blog.md
portfolio/
_posts/
_layouts/post.html
_layouts/portfolio-visual.html
_layouts/portfolio-company.html
_includes/header.html
_includes/breadcrumb.html
```

With:
```
# V2 content (not included in V1)
portfolio/
_layouts/portfolio-visual.html
_layouts/portfolio-company.html
_includes/header.html
_includes/breadcrumb.html
```

- [ ] **Step 2: Add permalink configuration to `_config.yml`**

Add after the `markdown: kramdown` line (line 21):

```yaml
permalink: /writing/:slug/
```

- [ ] **Step 3: Add `docs/` to Jekyll exclude list**

In `_config.yml`, add `docs/` to the `exclude:` array so spec/plan files don't get processed by Jekyll:

```yaml
exclude:
  - Gemfile
  - Gemfile.lock
  - node_modules/
  - vendor/
  - .planning/
  - docs/
```

- [ ] **Step 4: Commit**

```bash
git add .gitignore _config.yml
git commit -m "Configure Jekyll for blog posts and clean up gitignore"
```

---

### Task 2: Post Layout Template

**Files:**
- Create: `_layouts/post.html`

- [ ] **Step 1: Create the post layout**

Create `_layouts/post.html`. This extends the default layout. It provides the top bar (back link + name), post header (metadata, title, rule), and body content in a centered column. Reading time is calculated from word count.

```html
---
layout: default
---

<article class="post-page">
  <nav class="post-topbar">
    <a href="/#writing" class="post-topbar__back">← back</a>
    <a href="/" class="post-topbar__name">Andrew Marks</a>
  </nav>

  <header class="post-page__header">
    <span class="post-page__meta">
      {{ page.category | capitalize }} · {{ page.date | date: "%B %Y" }} · {% assign words = content | number_of_words %}{% assign minutes = words | plus: 199 | divided_by: 200 %}{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}{{ minutes }} min read
    </span>
    <h1 class="post-page__title">{{ page.title }}</h1>
    <hr class="post-page__rule">
  </header>

  <div class="post-page__body">
    {{ content }}
  </div>
</article>
```

- [ ] **Step 2: Verify the layout file is syntactically valid**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll build 2>&1 | tail -5
```

Expected: Build succeeds (there are no posts yet, so the layout just needs to parse).

- [ ] **Step 3: Commit**

```bash
git add _layouts/post.html
git commit -m "Add post reading page layout"
```

---

### Task 3: Sample Post

**Files:**
- Create: `_posts/2026-03-24-building-a-ttrpg.md`

- [ ] **Step 1: Create a sample post**

Create `_posts/2026-03-24-building-a-ttrpg.md` with enough content to test typography, reading time, and layout. Use real-ish content across multiple paragraphs, a heading, a blockquote, and emphasis — these exercise the prose styles from the spec.

```markdown
---
layout: post
title: "Building a Tabletop RPG From the Ground Up"
category: craft
description: "What five years of NEON HOPE development taught me about scope, creative direction, and knowing when to ship."
date: 2026-03-24
---

When we started NEON HOPE, we didn't set out to build a new system. We wanted to tell a specific kind of story — one about marginalization, resistance, and finding community in a city that's forgotten you.

The mechanics came second. The world came first. That ordering changed everything about how the game developed, and it's the single decision I'd make again without hesitation.

Most TTRPG design advice starts with the dice. Pick your resolution mechanic, build outward. There's wisdom in that — the dice are the engine, and engines matter. But we found that starting with *tone* gave us something more valuable: a filter for every subsequent decision.

## Starting With Tone

Every mechanic, every character option, every piece of world-building had to pass one test: does this reinforce the feeling we're going for? A cyberpunk game about the margins of society doesn't need seventeen equipment tables. It needs rules that make players feel resourceful, desperate, and connected to each other.

> The best game mechanics are invisible. Players should feel the fiction, not the system underneath it.

This is the hardest lesson in game design. You build something elegant, something you're proud of — and then you cut it because it doesn't serve the story. The cutting is where the craft lives.

We cut entire subsystems. We rewrote the core resolution mechanic three times. Each version was technically sound. Only the third version *felt* right.

## Knowing When to Ship

There's a version of NEON HOPE that's perfect. It exists in a parallel universe where we had infinite time and no Kickstarter deadlines. In this universe, we shipped something real.

The gap between those two versions is smaller than you'd think. Perfectionism in game design is a trap — not because quality doesn't matter, but because you can't discover certain problems until real players touch the thing. Playtesting with your friends is valuable. Shipping to strangers is revelatory.

Five years taught me that scope is a creative decision, not a constraint. Choosing what *not* to include is as much a part of the design as what you put in.
```

- [ ] **Step 2: Verify the post builds and the permalink works**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll build 2>&1 | tail -5
```

Then confirm the output path:

```bash
ls _site/writing/building-a-ttrpg/index.html
```

Expected: File exists at that path.

- [ ] **Step 3: Commit**

```bash
git add _posts/2026-03-24-building-a-ttrpg.md
git commit -m "Add sample blog post for testing"
```

---

### Task 4: Writing Section on Homepage

**Files:**
- Modify: `index.md:1-38`

- [ ] **Step 1: Add the hero nav link and writing section to `index.md`**

Add the nav link inside the hero section (after the hero-content div, before the closing `</section>` tag), then add the full writing section below. The writing section uses Liquid to loop through posts.

Replace the full content of `index.md` with:

```markdown
---
layout: default
title: andrew marks | game developer, writer, advisor
description: Andrew Marks is a game developer, writer, and strategic advisor with experience in game development, TTRPG design, and interactive storytelling.
image: /assets/favicon/favicon-180x180.png
---

<section class="hero hero--fullscreen" id="hero">
  <!-- Space background layers -->
  <div class="space-bg">
    <div class="stars stars-1"></div>
    <div class="stars stars-2"></div>
    <div class="stars stars-3"></div>

    <!-- Clickable easter egg hotspots (safe zones: top half, bottom-left) -->
    <div class="hotspots">
      <a class="hotspot" href="https://quailworks.com/" target="_blank" rel="noopener" style="top: 25%; left: 20%;">
        <span class="tooltip">My consultancy.</span>
      </a>
      <a class="hotspot" href="https://www.kickstarter.com/projects/villageonstilts/trail-of-the-behemoth-second-edition-and-neon-hope-rpg" target="_blank" rel="noopener" style="top: 15%; left: 70%;">
        <span class="tooltip">Currently writing...</span>
      </a>
      <a class="hotspot" href="https://www.youtube.com/watch?v=mANS2qseQ2I" target="_blank" rel="noopener" style="top: 65%; left: 15%;">
        <span class="tooltip">Meet Gene Christ.</span>
      </a>
      <a class="hotspot" href="https://www.linkedin.com/in/andrewjohnmarks/" target="_blank" rel="noopener" style="top: 40%; left: 45%;">
        <span class="tooltip">Let's connect.</span>
      </a>
    </div>
  </div>

  <!-- Hero content (stays on top) -->
  <div class="hero-content">
    <h1 class="reveal-hero">Andrew<br>Marks</h1>
    <p class="tagline reveal-tagline">game developer, writer, advisor</p>
  </div>

  <!-- Bottom-left nav -->
  <nav class="hero-nav" id="hero-nav">
    <a href="#writing" class="hero-nav__link">writing</a>
  </nav>
</section>

<div class="hero-to-writing-transition"></div>

<section class="writing-section" id="writing">
  <div class="writing-section__inner">
    <span class="writing-section__label reveal-writing">Writing</span>

    <div class="writing-section__list">
      {% for post in site.posts %}
      <a href="{{ post.url | relative_url }}" class="writing-entry reveal-writing">
        <span class="writing-entry__meta">
          {{ post.date | date: "%B %Y" }} · {{ post.category | capitalize }} · {% assign words = post.content | number_of_words %}{% assign minutes = words | plus: 199 | divided_by: 200 %}{% if minutes < 1 %}{% assign minutes = 1 %}{% endif %}{{ minutes }} min read
        </span>
        <span class="writing-entry__title">{{ post.title }}</span>
        <span class="writing-entry__excerpt">{{ post.description }}</span>
      </a>
      {% unless forloop.last %}<hr class="writing-entry__divider reveal-writing-divider">{% endunless %}
      {% endfor %}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Verify the build succeeds and the homepage renders the post list**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll build 2>&1 | tail -5
```

Then check the output includes the writing section:

```bash
grep -c "writing-entry" _site/index.html
```

Expected: At least 1 match.

- [ ] **Step 3: Commit**

```bash
git add index.md
git commit -m "Add hero nav link and writing section to homepage"
```

---

### Task 5: CSS — Writing Section & Post Page Styles

**Files:**
- Modify: `assets/css/main.scss:1056-1321` (replace V2 blog styles)
- Modify: `assets/css/main.scss:1610-1635` (add reduced motion rules)

This is the largest task. It replaces the existing V2 blog CSS with new styles matching the spec, adds the hero nav styles, the writing section index styles, and the post page reading styles.

- [ ] **Step 1: Replace V2 blog styles with new writing styles**

Replace lines 1055-1321 (the entire `// Blog Styles` and `// Blog Index Page` sections) with the new styles below. The replacement starts at the `// Blog Styles` comment and ends after the `.blog-index__excerpt` closing brace.

Find this block (starting at line 1055):
```scss
// ============================================
// Blog Styles - Reading-Focused Typography
// ============================================
```

And replace everything from there through the end of `.blog-index__excerpt` (line 1321) with:

```scss
// ============================================
// Hero Navigation - Bottom-left anchor links
// ============================================
.hero-nav {
  position: absolute;
  bottom: var(--space-lg);
  left: var(--space-md);
  z-index: 10;
  opacity: 0; // JS handles fade-in; visible immediately if no JS
}

.hero-nav__link {
  font-family: var(--font-primary);
  font-size: 11px;
  color: var(--color-fg-muted);
  text-decoration: none;
  letter-spacing: 0.08em;
  text-transform: lowercase;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-fg);
  }
}

// No-JS fallback: show nav immediately
.no-js .hero-nav {
  opacity: 1;
}

// ============================================
// Hero → Writing Transition
// ============================================
.hero-to-writing-transition {
  height: 80px;
  background: linear-gradient(to bottom, var(--color-bg-deep), var(--color-bg));
}

// ============================================
// Writing Section - Blog Index on Homepage
// ============================================
.writing-section {
  background-color: var(--color-bg);
  padding: var(--space-lg) var(--space-md);
  padding-top: 0;
  min-height: auto;
  display: block;
}

.writing-section__inner {
  max-width: 640px;
  margin: 0 auto;
}

.writing-section__label {
  display: block;
  font-family: var(--font-primary);
  font-size: 10px;
  font-weight: var(--font-weight-normal);
  color: #767676;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: var(--space-md);
}

.writing-entry {
  display: block;
  text-decoration: none;
  padding: var(--space-md) 0;
  transition: transform 0.2s ease;

  &:hover {
    .writing-entry__title {
      color: var(--color-accent-hover);
    }
  }
}

.writing-entry__meta {
  display: block;
  font-family: var(--font-primary);
  font-size: 9px;
  color: #767676;
  letter-spacing: 0.05em;
  margin-bottom: var(--space-xs);
  text-transform: capitalize;
}

.writing-entry__title {
  display: block;
  font-family: var(--font-primary);
  font-size: 17px;
  font-weight: 600;
  color: var(--color-fg);
  line-height: 1.3;
  margin-bottom: var(--space-xs);
  transition: color 0.2s ease;
}

.writing-entry__excerpt {
  display: block;
  font-family: var(--font-primary);
  font-size: 13px;
  color: var(--color-fg-muted);
  line-height: 1.5;
}

.writing-entry__divider {
  border: none;
  height: 1px;
  background-color: var(--color-bg-elevated);
  margin: 0;
  transform-origin: left;
}

// ============================================
// Post Page - Reading Experience
// ============================================
.post-page {
  background-color: var(--color-bg);
  min-height: 100vh;
}

.post-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md);
  max-width: 640px;
  margin: 0 auto;
}

.post-topbar__back,
.post-topbar__name {
  font-family: var(--font-primary);
  font-size: 10px;
  color: var(--color-fg-muted);
  text-decoration: none;
  letter-spacing: 0.08em;
  transition: color 0.2s ease;

  &:hover {
    color: var(--color-fg);
  }
}

.post-page__header {
  max-width: 640px;
  margin: var(--space-lg) auto 0;
  padding: 0 var(--space-md);
}

.post-page__meta {
  display: block;
  font-family: var(--font-primary);
  font-size: 10px;
  color: #767676;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: var(--space-sm);
}

.post-page__title {
  font-family: var(--font-primary);
  font-size: clamp(1.75rem, 5vw, 2rem);
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-fg);
  text-transform: none;
  letter-spacing: -0.01em;
  margin-bottom: var(--space-md);
}

.post-page__rule {
  border: none;
  height: 1px;
  background: var(--color-bg-elevated);
  margin-bottom: var(--space-lg);
  width: 30px;
}

.post-page__body {
  max-width: 640px;
  margin: 0 auto;
  padding: 0 var(--space-md) var(--space-xl);
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #cccccc;

  p {
    margin-bottom: 1.25em;
  }

  em {
    color: #e0e0e0;
  }

  h2 {
    font-family: var(--font-primary);
    font-size: 1.375rem;
    font-weight: 700;
    text-transform: none;
    color: var(--color-fg);
    margin-top: 2.5em;
    margin-bottom: 0.75em;
    line-height: 1.3;
    letter-spacing: 0;
  }

  h3 {
    font-family: var(--font-primary);
    font-size: 1.125rem;
    font-weight: 700;
    text-transform: none;
    color: var(--color-fg);
    margin-top: 2em;
    margin-bottom: 0.5em;
    line-height: 1.4;
  }

  a {
    color: var(--color-accent-hover);
    text-decoration: underline;
    text-underline-offset: 2px;
    transition: color 0.2s;

    &:hover {
      color: var(--color-accent);
    }
  }

  ul, ol {
    margin-bottom: 1.25em;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.5em;
  }

  blockquote {
    margin: 1.5em 0;
    padding: var(--space-sm) var(--space-md);
    border-left: 3px solid var(--color-accent);
    background: var(--color-bg-elevated);
    color: var(--color-fg-muted);
    font-style: italic;

    p:last-child {
      margin-bottom: 0;
    }
  }

  pre {
    background: var(--color-bg-elevated);
    padding: var(--space-md);
    overflow-x: auto;
    margin-bottom: 1.5em;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  code {
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    background: var(--color-bg-elevated);
    padding: 0.15em 0.3em;
    font-size: 0.9em;
  }

  pre code {
    background: none;
    padding: 0;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 1.5em 0;
  }

  hr {
    border: none;
    border-top: 1px solid var(--color-bg-elevated);
    margin: 2em 0;
  }
}
```

- [ ] **Step 2: Update the mobile responsive styles**

Find the mobile blog styles section (around line 1478-1485 after the replacement — inside the `@media (max-width: 767px)` block). Replace:

```scss
  // Blog styles mobile
  .post {
    padding: var(--space-lg) var(--space-sm);
  }

  .blog-index {
    padding: var(--space-lg) var(--space-sm);
  }

  .blog-index__header h1 {
    font-size: clamp(2rem, 8vw, var(--text-display));
  }
```

With:

```scss
  // Writing section mobile
  .writing-section {
    padding: var(--space-md) var(--space-sm);
    padding-top: 0;
  }

  .hero-nav {
    bottom: var(--space-md);
    left: var(--space-sm);
  }

  // Post page mobile
  .post-topbar {
    padding: var(--space-sm);
  }

  .post-page__header {
    margin-top: var(--space-md);
    padding: 0 var(--space-sm);
  }

  .post-page__body {
    padding: 0 var(--space-sm) var(--space-lg);
  }
```

- [ ] **Step 3: Add reduced motion rule for hero nav**

In the `@media (prefers-reduced-motion: reduce)` block (near end of file), add before the closing brace:

```scss
  // Show hero nav immediately
  .hero-nav {
    opacity: 1 !important;
  }
```

- [ ] **Step 4: Verify the build succeeds**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll build 2>&1 | tail -10
```

Expected: Build succeeds with no SCSS errors.

- [ ] **Step 5: Commit**

```bash
git add assets/css/main.scss
git commit -m "Add writing section and post page styles, replace V2 blog CSS"
```

---

### Task 6: JavaScript — Hero Nav Animation & Progressive Reveal

**Files:**
- Modify: `assets/js/main.js:52-130`

- [ ] **Step 1: Add hero nav fade-in animation**

Inside the `if (!prefersReducedMotion)` block, after the tagline reveal (after line 72 — the `gsap.from(".reveal-tagline"...)` call), add:

```javascript
  // Hero nav link - fade in after tagline
  gsap.fromTo("#hero-nav",
    { opacity: 0 },
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: 1.8
    }
  );
```

- [ ] **Step 2: Add progressive reveal for writing section**

After the hero nav animation (still inside the `if (!prefersReducedMotion)` block), add the writing section progressive reveal. This replaces the generic section/card reveals with writing-specific ones:

```javascript
  // Writing section - progressive reveal (opacity only, no movement)
  gsap.set(".reveal-writing", { opacity: 0 });
  gsap.set(".reveal-writing-divider", { scaleX: 0 });

  document.querySelectorAll('.reveal-writing').forEach((el, i) => {
    gsap.to(el, {
      opacity: 1,
      duration: 0.7,
      ease: "power2.out",
      delay: i * 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });

  document.querySelectorAll('.reveal-writing-divider').forEach(rule => {
    gsap.to(rule, {
      scaleX: 1,
      duration: 0.6,
      ease: "power2.out",
      scrollTrigger: {
        trigger: rule,
        start: "top 85%",
        toggleActions: "play none none none"
      }
    });
  });
```

- [ ] **Step 3: Add no-JS fallback**

At the very top of `main.js`, before the reduced motion detection (line 1), add:

```javascript
// Remove no-js class if JS is available
document.documentElement.classList.remove('no-js');
```

And in `_layouts/default.html`, add `class="no-js"` to the `<html>` tag:

```html
<html lang="en" class="no-js">
```

This ensures the hero nav is visible even without JS (CSS `.no-js .hero-nav { opacity: 1 }` handles it).

- [ ] **Step 4: Also show hero nav immediately if reduced motion is preferred**

After the `if (!prefersReducedMotion)` block's closing brace, add an else clause for the hero nav:

```javascript
if (prefersReducedMotion) {
  // Show hero nav immediately when motion is reduced
  const heroNav = document.getElementById('hero-nav');
  if (heroNav) heroNav.style.opacity = '1';
}
```

Note: This logic should go right after the closing `}` of the main `if (!prefersReducedMotion)` block.

- [ ] **Step 5: Verify the build succeeds**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll build 2>&1 | tail -5
```

Expected: Clean build.

- [ ] **Step 6: Commit**

```bash
git add assets/js/main.js _layouts/default.html
git commit -m "Add hero nav fade-in and writing section progressive reveal"
```

---

### Task 7: Visual QA — Local Server Test

**Files:** None (read-only verification)

- [ ] **Step 1: Start the Jekyll dev server**

```bash
cd /Users/quailbot/projects/personal-site && bundle exec jekyll serve --host 0.0.0.0 --port 4000 &
```

- [ ] **Step 2: Verify homepage hero is unchanged**

Open the site and confirm:
- Hero section renders identically to before (name, tagline, star animation, hotspots)
- `writing` link appears bottom-left after the tagline animation
- Clicking `writing` scrolls to the writing section

- [ ] **Step 3: Verify writing section**

Confirm:
- Gradient transition from hero to writing section is smooth
- "Writing" label appears in small muted uppercase
- Sample post shows with date, category, reading time, title, and excerpt
- Progressive reveal animation fires on scroll (opacity fade, divider draw-in)

- [ ] **Step 4: Verify post page**

Click through to the sample post and confirm:
- URL is `/writing/building-a-ttrpg/`
- Top bar shows `← back` and `Andrew Marks`
- Metadata line shows `Craft · March 2026 · X min read`
- Title renders in white, bold, comfortable size
- Body text is warm gray, readable, with generous line-height
- Blockquote has left accent border
- Headings within the post render correctly
- `← back` returns to `/#writing`

- [ ] **Step 5: Verify contrast**

Check that all text is legible against its background. In particular:
- Metadata text (dates, categories) is readable
- Section label "Writing" is readable
- Muted nav links are readable

- [ ] **Step 6: Verify reduced motion**

Enable "Reduce motion" in System Settings → Accessibility → Display. Reload and confirm:
- Star drift animation stops
- Hero nav appears immediately (no fade)
- Writing section content appears immediately (no progressive reveal)
- Lenis smooth scroll is disabled

- [ ] **Step 7: Verify mobile**

Resize to mobile viewport (~375px) and confirm:
- Hero adjusts correctly (existing behavior)
- Hero nav link is visible and tappable
- Writing section is readable with appropriate padding
- Post page is readable with appropriate padding
- Top bar doesn't overlap content

- [ ] **Step 8: Stop the server and commit any fixes**

```bash
kill %1 2>/dev/null
```

If any fixes were needed, commit them:

```bash
git add <specific-files> && git commit -m "Fix visual issues found during QA"
```
