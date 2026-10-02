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
- [ ] Commit separately as `feat(css): skeleton`.

### T-03B — Live Data State
- [ ] Display metadata badges using Flexbox.
- [ ] Display project items using CSS Grid.
- [ ] Commit separately after T-03A.

### T-03C — Empty State
- [ ] Display an accessible message when a successful response contains no items.
- [ ] Commit separately after T-03B.

### T-03D — Error State and Retry
- [ ] Display an accessible error message when loading fails.
- [ ] Provide a keyboard-operable Retry button that transitions back to `LOADING`.
- [ ] Commit separately after T-03C.

## Scope for this implementation

This initial milestone implements **T-03A only**. T-03B, T-03C, and T-03D remain planned; their UI and behavior must not be added in the T-03A commit.

The Exercise 1 semantic DOM contract also applies: use semantic HTML and no `<div>` elements.
