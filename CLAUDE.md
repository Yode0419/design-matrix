# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, no-build, single-page web app. Open `index.html` directly in a browser — no server or build step required.

**Live site:** https://yode0419.github.io/design-matrix/

## Architecture

Static files, no framework, no dependencies:

| File | Role |
|------|------|
| `index.html` | Static shell and persistent matrix markup |
| `js/data.js` | Category and skill data |
| `js/storage.js` | localStorage persistence helpers |
| `js/ui.js` | Sidebar, dot, matrix, and count DOM rendering helpers |
| `js/app.js` | App state, interaction flow, import/export, reset, and event binding |
| `css/base.css` | Reset, tokens, base body styles, common buttons |
| `css/layout.css` | Toolbar, sidebar, content layout, modal |
| `css/matrix.css` | Matrix, axes, result zones, dots |

### Data layer (`js/data.js`)
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
| `body.cat-highlight` | Dims all dots except `.cat-match` |

### Dot label flip
Dots past 68% on the x-axis get `.flip` class, moving the label to the left to avoid overflow.

## Planned work
See `TODO.md` — key upcoming items: JSON export/import, UI clarity improvements (zone counts, tooltip on dots, single-dot delete without drag), mobile layout.
