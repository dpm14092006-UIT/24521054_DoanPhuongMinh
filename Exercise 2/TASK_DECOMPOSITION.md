# Exercise 2 — Enterprise Developer Portfolio

## T-02: Responsive Theme System

### T-02A: Tokens & Reset — Complete
- [x] Define shared typography, spacing, layout, and border tokens.
- [x] Define light and dark theme color tokens.
- [x] Add a CSS reset, typography defaults, and accessible focus styles.
- [x] Style the keyboard-accessible skip link.
- [x] Route page colors through CSS variables.

### T-02B: 2D Grid Layout — Complete
- [x] Build the portfolio with semantic HTML and a responsive 12-column CSS Grid.
- [x] Reflow the page to one column at mobile widths, including 375px.
- [x] Prevent horizontal overflow through sizing and wrapping rules.

### T-02C: Theme Engine — Pending
- [ ] Add a keyboard-operable light/dark theme button.
- [ ] Persist the selected theme with the `theme` localStorage key.
- [ ] Initialize the theme before the page paints to avoid a theme flash.
- [ ] Respect the operating system color preference when no theme is saved.

## Acceptance criteria
- Semantic landmarks and sections have clear accessible names.
- The layout uses no generic `<div>` elements.
- At 375px, the page has no horizontal overflow.
- Keyboard users can reach and operate all links and the theme button.
- Changing a design color only requires editing its CSS token.
