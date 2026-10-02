# Task Decomposition

## T-01 — Semantic DOM Architecture & A11y Contract

### Objective
Build an accessible semantic HTML landmark structure without using any `<div>` elements.

### Requirements
- [x] Use semantic HTML landmarks.
- [x] Use 0 `<div>` elements.
- [x] Provide an accessible skip link.
- [x] Include a single `<header>` landmark.
- [x] Include primary `<nav>` with an accessible label.
- [x] Include a single `<main>` landmark.
- [x] Organize content using `<section>` elements.
- [x] Ensure the skip link targets the main content.
- [x] Do not include CSS changes in this milestone.

### Landmark Hierarchy Contract

```text
Document
├── Skip Link
├── Header
│   └── H1
├── Navigation
│   └── UL
│       └── LI → A
└── Main
    ├── Section: About
    └── Section: Projects
```

### Accessibility Contract
1. The page must contain exactly one primary `<main>` landmark.
2. Primary navigation must have an accessible name.
3. The skip link must navigate directly to the main content.
4. Sections must have accessible headings.
5. Native semantic HTML elements must be preferred over generic containers.
6. No `<div>` elements are permitted in T-01.
7. The main skip-link target uses `tabindex="-1"` so keyboard activation can move focus there without adding it to the normal Tab sequence.

### Milestone
ATOMIC MILESTONE T-01: No div tags allowed.
