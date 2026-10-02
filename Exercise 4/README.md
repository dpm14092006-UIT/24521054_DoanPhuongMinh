# Exercise 4 — Resilient Component Architecture

This exercise introduces a projects component with a four-state contract: `LOADING`, `LIVE`, `EMPTY`, and `ERROR`. The state machine and implementation boundaries are recorded in [TASK_DECOMPOSITION.md](TASK_DECOMPOSITION.md).

## Four-state demo

The page starts in `LOADING`. The T-03B project cards, T-03C empty message, and T-03D error panel are retained as mutually exclusive states. Retry switches from Error back to Loading and returns focus to the loading region.

The project collection is a local demo fixture; no API request is made. To preview a state, append `?state=loading`, `?state=live`, `?state=empty`, or `?state=error` to the page URL. The default with no query string is `LOADING`. You can also preview states from DevTools Console:

```js
window.showProjectState("loading");
window.showProjectState("live");
window.showProjectState("empty");
window.showProjectState("error");
```

The markup uses semantic HTML and contains no `<div>` elements, following Exercise 1's DOM contract. State updates use a polite live region, the error panel is a labeled alert, and the shimmer stops when the user prefers reduced motion.

## Run locally

From this directory, start a static web server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Project files

- `index.html` contains the semantic empty-state demo and retained loading/live markup.
- `css/style.css` defines the responsive page layout and visual theme.
- `css/skeleton.css` contains only the T-03A skeleton and shimmer styles.
- `css/live-data.css` contains the T-03B card grid and Flexbox badge styles.
- `css/states.css` contains the T-03C empty and T-03D error/retry styles.
- `js/projects-state.js` switches between the four states and handles Retry.
- `TASK_DECOMPOSITION.md` defines the four-state machine and separate milestones.

At a viewport width of 375px, the page content is designed to fit without horizontal scrolling.
