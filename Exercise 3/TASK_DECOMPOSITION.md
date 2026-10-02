# Exercise 3 — Portfolio Components & State

## T-03A — Semantic component architecture

- [x] Add a named site header with brand, primary navigation, and theme control.
- [x] Organize the main content into Hero, Skills, Projects, and Contact components.
- [x] Use independent `<article>` elements for skills groups and project cards.
- [x] Keep the page free of generic `<div>` elements.
- [x] Add a portrait asset with intrinsic `width` and `height` dimensions.

## T-03B — Responsive component styling

- [x] Continue the Exercise 2 CSS token and light/dark color system.
- [x] Use CSS Grid for the skills matrix and project cards.
- [x] Add responsive layouts, visible keyboard focus, and reduced-motion support.
- [x] Route component colors through CSS custom properties.

## T-03C — Interaction state

- [x] Model theme state as `light | dark` and persist it with localStorage key `theme`.
- [x] Keep the theme control's icon, accessible label, and `aria-pressed` in sync.
- [x] Use native form constraints for name, email, and message fields.
- [x] Model form state as `idle | submitting | success | error` and announce status changes.
- [x] Make it clear that form submission is a client-side demo without email delivery.

## Component and state overview

```text
Presentational: Hero, SkillGroup, ProjectCard
Interactive: ThemeSwitcher (light | dark)
Interactive: ContactForm (idle | submitting | success | error)
```
