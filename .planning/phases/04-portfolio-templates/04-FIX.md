---
phase: 04-portfolio-templates
plan: 04-FIX
type: fix
---

<objective>
Fix 4 UAT issues from Phase 4 Portfolio Templates.

Source: 04-ISSUES.md
Priority: 1 major, 3 minor
</objective>

<execution_context>
@./.claude/get-shit-done/workflows/execute-plan.md
@./.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@.planning/ROADMAP.md

**Issues being fixed:**
@.planning/phases/04-portfolio-templates/04-ISSUES.md

**Original plans for reference:**
@.planning/phases/04-portfolio-templates/04-01-PLAN.md
@.planning/phases/04-portfolio-templates/04-02-PLAN.md
</context>

<tasks>

<task type="auto">
  <name>Task 1: Fix UAT-001 - Reduce visual-rich hero height</name>
  <files>assets/css/main.scss</files>
  <action>
Reduce `.portfolio-hero` min-height from 60vh to 40vh. This keeps the hero impactful but doesn't dominate the viewport on desktop. The hero should welcome users to the page without requiring scroll to see content.

Current (line ~916):
```scss
.portfolio-hero {
  min-height: 60vh;
  ...
}
```

Change to:
```scss
.portfolio-hero {
  min-height: 40vh;
  ...
}
```
  </action>
  <verify>Visit /portfolio/game-dev and confirm hero takes approximately 40% of viewport height, leaving content visible above the fold</verify>
  <done>Hero section is shorter, content visible without scrolling on desktop</done>
</task>

<task type="auto">
  <name>Task 2: Fix UAT-002 - Simplify company template structure</name>
  <files>_layouts/portfolio-company.html</files>
  <action>
Simplify the company template to just hero + content section. Remove the implicit About/Services structure assumption. The template should be minimal: hero with title, tagline, CTA button, and a simple content area for markdown body. Bespoke sections can be built in markdown.

Keep:
- Hero section with optional logo, h1 title, tagline, CTA button
- Content section that renders {{ content }}

The template is already minimal - the About/Services sections come from markdown content, not the template. This is actually correct behavior - the fix is to update the sample page to be simpler.

Actually update: portfolio/quailworks.md to have simpler content - remove the ## About and ## Our Services sections, just have hero and a brief description paragraph.
  </action>
  <verify>Visit /portfolio/quailworks and confirm it shows only hero with CTA and minimal content, no structured About/Services sections</verify>
  <done>Company template shows clean hero + simple content, no forced structure</done>
</task>

<task type="auto">
  <name>Task 3: Fix UAT-003 - Button font legibility</name>
  <files>assets/css/main.scss</files>
  <action>
Change button font from display font (Big Shoulders Stencil Display) to primary font (Inter) for better legibility at small sizes.

Current (line ~628):
```scss
.btn {
  ...
  font-family: var(--font-display);
  ...
}
```

Change to:
```scss
.btn {
  ...
  font-family: var(--font-primary);
  ...
}
```

Keep the uppercase and letter-spacing for visual impact, but use the readable Inter font.
  </action>
  <verify>Visit /portfolio/quailworks and confirm CTA button text is legible and uses Inter font</verify>
  <done>Button text uses readable Inter font while maintaining uppercase style</done>
</task>

<task type="auto">
  <name>Task 4: Fix UAT-004 - Standardize section spacing</name>
  <files>assets/css/main.scss</files>
  <action>
Ensure consistent section spacing across portfolio templates. The issue is likely that different sections use different padding values.

Review and standardize:
1. `.portfolio-hero` - should use `padding: var(--space-xl) var(--space-md)` (already correct)
2. `.portfolio-content` - add consistent padding: `padding: var(--space-xl) var(--space-md)`
3. `.portfolio-projects` - should match (uses .section--content)
4. `.company-content` - already uses `padding: var(--space-xl) var(--space-md)` (correct)

The `.portfolio-content` class (line ~961-963) currently only sets `min-height: auto` but inherits padding from section base. Add explicit padding to match other sections.

Update:
```scss
.portfolio-content {
  min-height: auto;
  padding: var(--space-xl) var(--space-md);
}
```

Also add consistent spacing to portfolio-projects section if it exists in the future - but for now the main fix is ensuring .portfolio-content matches.
  </action>
  <verify>Visit both /portfolio/game-dev and /portfolio/quailworks, compare spacing between sections - should be consistent var(--space-xl) vertical padding throughout</verify>
  <done>All portfolio sections have consistent vertical spacing</done>
</task>

</tasks>

<verification>
Before declaring plan complete:
- [ ] UAT-001: Hero height reduced to 40vh on visual-rich template
- [ ] UAT-002: Quailworks page shows simplified content
- [ ] UAT-003: Button text uses Inter font and is legible
- [ ] UAT-004: Section spacing is consistent across both templates
- [ ] Both portfolio pages render without errors
</verification>

<success_criteria>
- All 4 UAT issues from 04-ISSUES.md addressed
- Both portfolio templates display correctly
- Design system consistency maintained (sharp edges, colors, spacing)
- Ready for re-verification with /gsd:verify-work 04
</success_criteria>

<output>
After completion, create `.planning/phases/04-portfolio-templates/04-FIX-SUMMARY.md`

Commit pattern: fix(04-FIX): [task description]
</output>
