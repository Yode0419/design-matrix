# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, no-build, single-page web app. Open `index.html` directly in a browser — no server or build step required.

**Live site:** https://yode0419.github.io/design-matrix/

## Architecture

Three files, no framework, no dependencies:

| File | Role |
|------|------|
| `app.js` | All logic: data, state, rendering, events |
| `style.css` | All styles: layout, matrix, zones, dot animations |
| `index.html` | Static shell; all dynamic content is injected by `app.js` |

### Data layer (`app.js` top)
- `CATEGORIES` — 9 category definitions with `id`, `label`, `color`
- `SKILLS` — 84 skills with `id`, `en`, `zh`, `cat` (references `CATEGORIES.id`)

### State
```
placements   { [skillId]: { x, y } }   // % positions on matrix, persisted to localStorage (LS_KEY)
collapsed    { [catId]: true }          // sidebar collapse state, persisted (LS_COLLAPSED)
selectedId   number | null             // skill being placed
activeDotId  number | null             // dot showing its remove button
resultMode   boolean                   // toggles .result-mode on body
highlightCat string | null             // dims non-matching dots via body.cat-highlight
```

### Rendering pattern
All DOM is built imperatively via `document.createElement`. There is no virtual DOM or templating. `renderCardList()` rebuilds the entire sidebar; individual card updates use `updateCardItem(id)` to avoid full re-renders. Dot updates use `removeDotEl(id)` + `addDot(id, x, y)`.

### Interaction flow
1. Click card → `selectSkill(id)` → sets `selectedId`, adds `body.selecting`
2. Click matrix → `onMatrixClick` → calls `place(id, x, y)` → saves + renders dot
3. Drag dot → `mousedown` on `.pdot` → updates position live → calls `place(id, nx, ny)` on `mouseup`
4. Click dot → `onDotClick` → `setActiveDot(id)` shows remove button; second click clears

### CSS modes (body class toggles)
| Class | Effect |
|-------|--------|
| `body.selecting` | Yellow highlight on sidebar-top |
| `body.result-mode` | Reveals zone overlays, sweet-spot ellipse, cherry circle |
| `body.labels-visible` | Shows all dot labels permanently |
| `body.cat-highlight` | Dims all dots except `.cat-match` |

### Dot label flip
Dots past 68% on the x-axis get `.flip` class, moving the label to the left to avoid overflow.

## Planned work
See `TODO.md` — key upcoming items: JSON export/import, UI clarity improvements (zone counts, tooltip on dots, single-dot delete without drag), mobile layout.
