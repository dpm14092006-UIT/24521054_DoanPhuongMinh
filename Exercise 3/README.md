# Exercise 3 — Portfolio Components & State

A semantic, responsive portfolio for **Doan Phuong Minh · UIT**. The page builds on Exercise 2's design-token approach and adds reusable content components, a persistent theme switcher, and client-side contact-form states.

## Run locally

From this directory, start a static web server:

```powershell
python -m http.server 8000
```

Then open `http://localhost:8000`. There is no package install or build step.

## Project files

- `index.html` contains the semantic page and component markup.
- `css/style.css` defines light/dark design tokens and responsive layouts.
- `js/app.js` manages the theme and contact-form state.
- `assets/portrait.png` is the square portrait used in the Hero component.
- `TASK_DECOMPOSITION.md` outlines the component and state milestones.

## Component map

```text
Portfolio
├── Header: brand, navigation, theme switcher
├── Main
│   ├── Hero: portrait, headline, pitch, project link
│   ├── Skills matrix: category cards and badges
│   ├── Projects: independent project articles
│   └── Contact: native form and live status
└── Footer
```

Theme state is `light` or `dark` and persists under the `theme` localStorage key. The contact form uses native browser validation, then moves through `idle → submitting → success`; invalid fields set its state to `error`. Submission is a front-end exercise demo and does not deliver email.
