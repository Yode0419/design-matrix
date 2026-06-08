# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A static, no-build, single-page web app. Open `index.html` directly in a browser — no server or build step required.

**Live site:** https://yode0419.github.io/design-matrix/

## Architecture

Static files, no framework, no dependencies (Google Fonts loaded via CDN):

| File | Role |
|------|------|
| `index.html` | Static shell and all persistent markup |
| `js/data.js` | `CATEGORIES` (9) and `SKILLS` (84) arrays — mutated at runtime by custom skills |
| `js/storage.js` | localStorage helpers; also declares `customSkills` array |
| `js/ui.js` | DOM rendering: sidebar cards, dots, axis numbers, guides, zone classification |
| `js/app.js` | App state, all interaction logic, share/export/import, event binding |
| `css/base.css` | Reset, CSS tokens, body |
| `css/layout.css` | Toolbar, sidebar, modals, toast, axis help cards |
| `css/matrix.css` | Matrix grid, axes, zone overlays, dots, result mode styles |

Scripts load in order: `data.js` → `storage.js` → `ui.js` → `app.js`. All globals are shared via the window scope — no modules.

### State (all in `app.js`)
```
placements   { [skillId]: { x, y } }   // 1-decimal % coords, persisted (LS_KEY)
collapsed    { [catId]: true }          // sidebar collapse, persisted (LS_COLLAPSED)
customSkills SkillObj[]                 // declared in storage.js, persisted (LS_CUSTOM)
selectedId   number | null             // skill currently being placed
activeDotId  number | null             // dot showing its remove button
resultMode   boolean                   // toggles body.result-mode
activeZone   string | null             // zone currently highlighted
gridVisible  boolean                   // toggles body.grid-hidden
highlightCat string | null             // dims non-matching dots via body.cat-highlight
axisHelpVisible boolean               // toggles body.axis-help
```

Category colors are stored in `CATEGORIES[i].color` at runtime and persisted separately via `saveCatColors()` (`LS_CAT_COLORS`).

### Interaction flow
1. Click card → `selectSkill(id)` → sets `selectedId`, adds `body.selecting`
2. Click matrix → `onMatrixClick` → `place(id, x, y)` → saves + renders dot
3. Drag dot → `mousedown` on `.pdot` → live position update → `place(id, nx, ny)` on mouseup
4. Click dot → `onDotClick` → `setActiveDot(id)` shows remove button; second click deselects

### CSS body-class modes
| Class | Effect |
|-------|--------|
| `body.selecting` | Yellow highlight on sidebar-top |
| `body.result-mode` | Shows zone overlays, sweet-spot ellipse, cherry, zone-bar |
| `body.axis-help` | Shows axis explanation cards + expert zone frames + sidebar help overlay |
| `body.cat-highlight` | Dims all dots except `.cat-match` |
| `body.grid-hidden` | Hides background grid |
| `body.zone-focused` + `body.zone-focus-<zone>` | Dims dots outside the focused zone |

### Share URL (binary pack v4)
`encodeState()` / `decodeStateFromHash()` in `app.js` pack all placements, custom skills, and category colors into a binary `ArrayBuffer`, compress with `CompressionStream('deflate-raw')`, and base64-encode into `#share=<base64>`. Coordinates are stored as `uint16 × 10` (1 decimal place). Version byte `4` is at offset 0; a mismatch silently aborts decode.

### Zone classification
`classifyZone(x, y)` and `isInSweetSpot(x, y)` in `ui.js` use ellipse equations to map `%` coordinates to zones. The danger zone ellipse is centred at `(31, 22.5)` with `rx=9, ry=22.5`; the sweet-spot ellipse at `(52.5, 30.5)` with `rx=23.5, ry=25.5`.

### Dot label flip
Dots past 68% on the x-axis get `.flip`, moving the label left to avoid overflow.

### Precision
All placements are rounded to 1 decimal place via `round1()` (in `ui.js`). This matches the share URL encoding precision so dots never jump after a share/restore cycle.
