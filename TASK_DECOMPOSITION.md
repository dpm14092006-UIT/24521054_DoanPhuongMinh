# Work Breakdown Structure

## T-01 — Semantic landmark tree

- **Objective:** Create the page's semantic landmark structure and an accessible skip link.
- **Deliverables:** `index.html` and this task declaration.
- **Landmark hierarchy contract:** exactly three page landmarks, ordered `banner` → `navigation` (named `Primary`) → `main`. The sections inside `main` remain ordinary sections and do not add region landmarks.
- **Element contract:** zero `<div>` elements in `index.html`.
- **Skip-link contract:** the first page link is `<a href="#main" class="skip-link">Skip to Content</a>` and targets the page's `<main id="main">`. The main landmark uses `tabindex="-1"` so activating the link can move keyboard focus there without adding it to the normal Tab sequence.
- **Styling contract:** no CSS is included in this HTML milestone.
- **Acceptance criteria:** Chrome DevTools Accessibility view shows the three landmarks in the contracted order; the skip link navigates to `main`; the HTML contains zero `div` elements.
- **Atomic commit:** `git commit -m 'feat(html): semantic landmark tree'`
