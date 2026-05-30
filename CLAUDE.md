# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build → build/
npm run deploy     # build + push build/ contents to gh-pages branch (live site)
```

No test suite is configured. ESLint runs automatically via react-scripts.

## Deployment Architecture

- **`gh-newMenu` branch** — source code (this repo)
- **`gh-pages` branch** — built output served by GitHub Pages at `https://varun-maraka.github.io/`
- `npm run deploy` builds the app and pushes the *contents* of `build/` directly to the root of `gh-pages` (no `build/` subfolder there)
- If `npm run deploy` fails, build manually then push the build folder contents to `gh-pages` via CLI

## Architecture

### Routing
Despite the README mentioning React Router, **routing is hash-based** using `window.location.hash`. `App.js` manages `currentPage` with `useState`, reads the hash on mount, and updates it on navigation. There is no `<BrowserRouter>` or `<Route>` in use.

Pages: `home`, `about`, `contact`, `breathing-techniques`

### Redux
`src/redux/` exists but is scoped only to hamburger menu state (`isMenuOpen`). Page navigation is **not** in Redux — it lives in `App.js` local state.

### Visitor Tracking (`src/hooks/useVisitorTracking.js`)
Fires once per device per day on app load. Collects IP (via ipify), geolocation (via ipapi.co), browser/OS/device, and posts to a Google Apps Script endpoint. Device ID and last-call date are stored in `localStorage`. This runs silently and does not block rendering.

### Breathing Techniques Page (`src/pages/BreathingTechniques.js`)
The most complex page. Key details:
- 10 hardcoded breathing techniques defined as a `TECHNIQUES` array (phases with label + seconds)
- Audio cues (`inhale.mp3`, `hold.mp3`, `exhale.mp3`) from `public/techniques/` — preloaded at module load time
- Timer logic uses `setInterval` via `intervalRef`; a separate `cycleBreakRef` handles inter-cycle pauses
- Sound preference persisted in `localStorage` (`breathingSoundEnabled`)
- Phase images served from `public/techniques/phase_*.png` and technique thumbnails from `public/techniques/technique_*.png`

### Styling
Plain CSS files co-located with components. No CSS-in-JS or preprocessor. Key files:
- `src/components/Navigation.css` — navbar styles
- `src/pages/Pages.css` — shared page styles
- `src/App.css`, `src/index.css` — global styles
