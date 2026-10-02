# Exercise 4 — Resilient Component Architecture

This exercise introduces a projects component with a four-state contract: `LOADING`, `LIVE`, `EMPTY`, and `ERROR`. The state machine and implementation boundaries are recorded in [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md).

## Current milestone: T-03A

The page currently demonstrates only the loading state. Three decorative placeholders use a pure CSS shimmer animation; the page has no data request or state-switching JavaScript. The skeleton remains visible until a later milestone adds state behavior.

The markup uses semantic HTML and contains no `<div>` elements, following Exercise 1's DOM contract. The loading message is exposed to assistive technology, and the shimmer stops when the user prefers reduced motion.

## Run locally

From this directory, start a static web server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project files

- `index.html` contains the semantic loading-state demo.
- `css/style.css` defines the responsive page layout and visual theme.
- `css/skeleton.css` contains only the T-03A skeleton and shimmer styles.
- `TASK_DECOMPOSITION.md` defines the four-state machine and separate milestones.

At a viewport width of 375px, the page content is designed to fit without horizontal scrolling.
