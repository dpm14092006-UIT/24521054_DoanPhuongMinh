# Exercise 4 — Resilient Component Architecture

## T-03 — Four-State Component Contract

The projects component displays one of four mutually exclusive states. This state machine is defined before implementation, as required by the decomposition pipeline.

```text
                         ┌──────────────┐
                         │   LOADING    │
                         └──────┬───────┘
                                │
                ┌───────────────┼───────────────┐
                │               │               │
                ▼               ▼               ▼
          ┌──────────┐    ┌──────────┐    ┌──────────┐
          │   LIVE   │    │  EMPTY   │    │  ERROR   │
          └──────────┘    └──────────┘    └────┬─────┘
                                               │ Retry
                                               ▼
                                          ┌──────────┐
                                          │ LOADING  │
                                          └──────────┘
```

| State | Entry condition | Component output |
| --- | --- | --- |
| `LOADING` | A request is in progress, including after retry. | Loading status and CSS skeleton placeholders. |
| `LIVE` | The request succeeds and returns one or more items. | Metadata badges arranged with Flexbox and an item list arranged with CSS Grid. |
| `EMPTY` | The request succeeds and returns no items. | A clear, accessible empty-data message. |
| `ERROR` | The request fails. | An accessible error message and a keyboard-operable Retry button. |

Allowed transitions:

- `LOADING → LIVE` when a successful response contains items.
- `LOADING → EMPTY` when a successful response contains no items.
- `LOADING → ERROR` when the request fails.
- `ERROR → LOADING` when Retry is activated.

Only one state is rendered at a time. Each implementation milestone is staged and committed separately. The prompt rule is to request one sub-task at a time, never all four states together.

## Sub-tasks

### T-03A — Loading Skeleton
- [x] Implement the loading presentation with pure CSS.
- [x] Add a horizontal shimmer gradient and a reduced-motion fallback.
- [x] Keep skeleton placeholders decorative and expose a loading status to assistive technology.
- [x] Commit separately as `feat(css): skeleton`.

### T-03B — Live Data State

**Goal:** Display successfully loaded project data.

**Condition:** `LOADING → LIVE` when a successful response contains at least one item.

Requirements:
- [x] Use CSS Grid for the project list.
- [x] Use Flexbox for metadata badges.
- [x] Render each project as a semantic `<article>` with a heading.
- [x] Keep metadata readable on narrow screens.
- [x] Keep this milestone separate from the Empty and Error states.
- [x] Commit separately after T-03A as `feat(css): live data state`.

### T-03C — Empty State

**Goal:** Display an accessible message when a request succeeds but returns no data.

**Condition:** `LOADING → EMPTY` when a successful response contains no items.

Requirements:
- [x] Use semantic HTML and a clear empty-data message.
- [x] Render no fake project cards in the empty state.
- [x] Keep Error and Retry behavior out of this milestone.
- [x] Commit separately after T-03B as `feat(ui): empty state`.

### T-03D — Error State and Retry

**Goal:** Display an accessible error message when loading fails and give the user a direct retry action.

**State transitions:** `LOADING → ERROR` when the request fails; `ERROR → LOADING` when Retry is activated.

Requirements:
- [x] Expose the error message as a labeled alert.
- [x] Use a native Retry button that works with Tab, Enter, and Space.
- [x] Make Retry return the component to `LOADING` and move focus to the loading region.
- [x] Keep one state visible at a time and announce changes through an `aria-live` status.
- [x] Commit separately after T-03C as `feat(js): error state retry`.

## Acceptance checks

- [x] Render exactly one of `LOADING`, `LIVE`, `EMPTY`, or `ERROR` at a time.
- [x] Keep the document semantic and free of `<div>` elements.
- [x] Stop shimmer animation when `prefers-reduced-motion: reduce` is set.
- [x] Fit every state at a 375px viewport without horizontal overflow.
- [x] Reach Retry with Tab and activate it with Enter and Space.
- [x] Finish the browser check with zero Console errors.
- [x] Commit each sub-task independently.

## Implementation notes

Each state was added in its own commit, in order: `feat(css): skeleton`, `feat(css): live data state`, `feat(ui): empty state`, and `feat(js): error state retry`.

The final page starts in `LOADING`. The project data is a local demo fixture rather than an API response. The `?state=` query parameter and `window.showProjectState(...)` are available to preview outcomes. Retry returns from `ERROR` to `LOADING`.

The Exercise 1 semantic DOM contract also applies: use semantic HTML and no `<div>` elements.
