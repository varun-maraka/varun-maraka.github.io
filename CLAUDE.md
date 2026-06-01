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
- Audio cues (`inhale.mp3`, `hold.mp3`, `exhale.mp3`) from `public/techniques/`
- Phase images served from `public/techniques/phase_*.png` and technique thumbnails from `public/techniques/technique_*.png`
- Sound preference persisted in `localStorage` (`breathingSoundEnabled`)
- **Favorites**: each tile has a heart icon (top-right overlay); clicking toggles favorite status, persisted in `localStorage` (`breathingFavorites` as a JSON array of technique IDs). Favorites appear in a dedicated section at the top of the grid. When favorites count is `>= 7`, favorited items are removed from the "All Techniques" section below; otherwise they appear in both sections.

#### Audio Architecture

Audio was migrated from HTML `Audio` objects to the Web Audio API (`AudioContext`) so that sound can continue when the phone screen locks. HTML `Audio` elements are suspended by the OS on screen lock; `AudioContext` with an active audio session is not.

**Module-level singletons** (outside the component, shared across renders):
- `sharedAudioCtx` — single `AudioContext` instance, created on first user gesture
- `audioBuffers{}` — decoded `AudioBuffer`s keyed by phase label (`Inhale`, `Hold`, `Exhale`)
- `keepAliveNode` — Android/desktop keepalive (looping silent `AudioBufferSourceNode`)
- `iosKeepAliveOsc` / `iosKeepAliveGain` — iOS keepalive (near-inaudible oscillator at 0.001 gain)
- `scheduledSources[]` — iOS pre-scheduled `AudioBufferSourceNode`s
- `iosRafId` — `requestAnimationFrame` handle for iOS display loop

**Key functions:**
- `getOrCreateContext()` — creates/resumes the `AudioContext`. **Must be called synchronously inside a user gesture handler** (tap/click) on iOS, or the browser refuses to resume the context.
- `preloadAudioBuffers()` — fetches and decodes MP3s into `audioBuffers`. Called after `getOrCreateContext()` resolves (never before, to avoid the gesture-window race).
- `playAudioBuffer(label)` — plays a decoded buffer immediately; used by Android/desktop on each phase change.
- `startKeepAlive(ctx)` / `stopKeepAlive()` — Android/desktop: loops a silent `AudioBufferSourceNode` to register an active audio session with the OS.
- `startIosKeepAlive(ctx)` / `stopIosKeepAlive()` — iOS only: oscillator at 0.001 gain (~60 dB below full scale, inaudible). iOS detects a pure-zero buffer as silence and suspends the `AudioContext`; an oscillator registers as real audio output and prevents suspension.
- `scheduleSessionAudio(ctx, phases, sessionStart, maxCycles=40)` — iOS only: schedules `AudioBufferSourceNode`s for 40 cycles of audio at absolute `ctx.currentTime` offsets. These fire at the hardware level even when JS is suspended.
- `cancelScheduledAudio()` — stops and discards all pre-scheduled sources (called on pause/reset/back).
- `computeStateFromElapsed(elapsed, phases)` — derives `{phaseIndex, secondCount, cycleCount}` from total elapsed seconds; used by the iOS RAF loop.
- `isIOSDevice()` — detects iPhone/iPad via userAgent + `maxTouchPoints` (covers iPadOS 13+ which reports as MacIntel).

**Platform split — why and how:**

| | Android / Desktop | iOS / iPadOS |
|---|---|---|
| Timer | `setInterval` (1 s tick) | `requestAnimationFrame` reading `ctx.currentTime` |
| Audio trigger | Phase-change `useEffect` → `playAudioBuffer()` | Pre-scheduled at absolute ctx times via `scheduleSessionAudio()` |
| Keepalive | Silent looping buffer | Near-inaudible oscillator |
| Display on unlock | N/A | RAF resumes from correct `ctx.currentTime` position |

iOS requires the split because `setInterval` is suspended when the screen locks, so phase-change effects never fire. Pre-scheduling offloads audio timing to hardware. The RAF display loop freezes on lock but snaps to the correct position on unlock since `ctx.currentTime` kept advancing.

**Critical ordering rule for iOS (user gesture window):**
`getOrCreateContext()` → `startIosKeepAlive()` → start RAF → `preloadAudioBuffers()` → `scheduleSessionAudio()`

`getOrCreateContext()` must be the first async call after the tap. If `preloadAudioBuffers()` (which does `fetch` + `decodeAudioData`) runs first, iOS exits the gesture window before `AudioContext.resume()` is called and refuses to resume.

**Buffer load race (after page refresh):**
`soundEnabled` is restored from `localStorage` on mount, but `audioBuffers` is empty (decoding requires a running `AudioContext`, which requires a user gesture). On the first tap after refresh, `handleSelectTechnique` calls `getOrCreateContext()` first, starts the RAF, then calls `preloadAudioBuffers()` and only schedules/plays audio after it resolves. For Android, the first phase cue is replayed manually after buffers load because the phase-change `useEffect` already fired before decoding finished.

**Media Session API:**
Set up in the keepalive `useEffect` whenever `isRunning && soundEnabled`. Registers metadata (technique name) with the OS so it appears on the lock screen. Pause/play lock-screen buttons route through `handleStartPause()` on both platforms.

**Known issue — iOS background audio not working:**
Despite all of the above, audio cues stop playing when the iPhone/iPad screen locks. Root cause is unresolved: iOS Safari likely suspends the `AudioContext` on screen lock even with the oscillator keepalive active, and/or the MediaSession `pause` action fired by iOS on lock triggers `handleStartPause()` which calls `cancelScheduledAudio()`. Approaches tried: HTML Audio, Web Audio API pre-scheduling, silent-buffer keepalive, oscillator keepalive, MediaSession API with custom pause handler, `visibilitychange` listener. None reliably survive screen lock on iOS Safari. This is a fundamental platform limitation — native iOS apps use `AVAudioSession` which is not accessible from the browser. **Do not attempt to fix this further without a confirmed working proof-of-concept on a real device first.**

**Timer logic (Android/desktop):**
- `setInterval` via `intervalRef` ticks every second; advances `secondCount`, rolls over to next phase, increments `cycleCount`
- `cycleBreakRef` holds a 500 ms `setTimeout` between cycles to reset phase index smoothly

### Styling
Plain CSS files co-located with components. No CSS-in-JS or preprocessor. Key files:
- `src/components/Navigation.css` — navbar styles
- `src/pages/Pages.css` — shared page styles
- `src/App.css`, `src/index.css` — global styles
