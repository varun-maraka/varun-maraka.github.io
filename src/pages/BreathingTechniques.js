import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Pages.css';

const TECHNIQUES = [
  { id: '4-7-8',   name: '4-7-8 Breathing',      recommendation: '4 cycles initially, gradually increase to 8 cycles',        phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 7 }, { label: 'Exhale', seconds: 8 }] },
  { id: '4-4-4-4', name: '4-4-4-4 (Box)',         recommendation: '5–10 cycles (2–5 min)',                                      phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 4 }, { label: 'Exhale', seconds: 4 }, { label: 'Hold', seconds: 4 }] },
  { id: '5-5',     name: '5-5 Breathing',          recommendation: '10–20 cycles (2–5 min)',                                     phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Exhale', seconds: 5 }] },
  { id: '5-5-5-5', name: '5-5-5-5 Breathing',     recommendation: '5–10 cycles (2–5 min)',                                      phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Hold', seconds: 5 }, { label: 'Exhale', seconds: 5 }, { label: 'Hold', seconds: 5 }] },
  { id: '6-3-6-3', name: '6-3-6-3 Breathing',     recommendation: '5–10 cycles',                                                phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }, { label: 'Hold', seconds: 3 }] },
  { id: '6-6',     name: '6-6 Breathing',          recommendation: '10–15 cycles (2–5 min)',                                     phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Exhale', seconds: 6 }] },
  { id: '3-3-6',   name: '3-3-6 Breathing',        recommendation: '8–15 cycles',                                                phases: [{ label: 'Inhale', seconds: 3 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }] },
  { id: '4-6',     name: '4-6 Breathing',           recommendation: '10–15 cycles',                                               phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Exhale', seconds: 6 }] },
  { id: '7-11',    name: '7-11 Breathing',          recommendation: 'Start with 5 cycles, build to 10 cycles',                   phases: [{ label: 'Inhale', seconds: 7 }, { label: 'Exhale', seconds: 11 }] },
  { id: '2-4',     name: '2-4 Breathing',           recommendation: '10–20 cycles',                                               phases: [{ label: 'Inhale', seconds: 2 }, { label: 'Exhale', seconds: 4 }] },
];

// ── Web Audio API — background-safe audio ─────────────────────────────────
// Using AudioContext instead of HTML Audio so sound continues when the
// phone screen locks (HTML Audio gets suspended by the OS; AudioContext
// with an active silent keepalive loop is treated as a live audio session).
let sharedAudioCtx = null;
const audioBuffers  = {};
let keepAliveNode   = null;

async function getOrCreateContext() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (sharedAudioCtx.state === 'suspended') {
    await sharedAudioCtx.resume();
  }
  return sharedAudioCtx;
}

async function preloadAudioBuffers() {
  const ctx = await getOrCreateContext();
  await Promise.all(
    ['Inhale', 'Hold', 'Exhale'].map(async (label) => {
      if (audioBuffers[label]) return;
      try {
        const url = `${process.env.PUBLIC_URL}/techniques/${label.toLowerCase()}.mp3`;
        const res = await fetch(url);
        const ab  = await res.arrayBuffer();
        audioBuffers[label] = await ctx.decodeAudioData(ab);
      } catch {}
    })
  );
}

function playAudioBuffer(label) {
  if (!sharedAudioCtx || !audioBuffers[label]) return;
  const src = sharedAudioCtx.createBufferSource();
  src.buffer = audioBuffers[label];
  src.connect(sharedAudioCtx.destination);
  src.start(0);
}

function startKeepAlive(ctx) {
  if (keepAliveNode) return;
  // A looping silent buffer tells iOS/Android the audio session is still active,
  // preventing the OS from suspending playback when the screen locks.
  const buf       = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  keepAliveNode   = ctx.createBufferSource();
  keepAliveNode.buffer = buf;
  keepAliveNode.loop   = true;
  keepAliveNode.connect(ctx.destination);
  keepAliveNode.start();
}

function stopKeepAlive() {
  if (!keepAliveNode) return;
  try { keepAliveNode.stop(); } catch {}
  keepAliveNode.disconnect();
  keepAliveNode = null;
}

// ── iOS / iPadOS detection ────────────────────────────────────────────────
// iOS suspends JS (setInterval, RAF) when the screen locks, so we use a
// different strategy there: pre-schedule audio cues at absolute AudioContext
// times (handled by hardware, not JS) and use RAF only for display updates.
function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    // iPadOS 13+ reports as MacIntel with touch support
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

// ── iOS-specific audio pre-scheduling ────────────────────────────────────
let scheduledSources = [];   // AudioBufferSourceNodes scheduled for future play
let iosRafId         = null; // requestAnimationFrame handle

// Schedule audio cues for `maxCycles` cycles starting at absolute ctx time
// `sessionStart`. Skips any events already in the past.
function scheduleSessionAudio(ctx, phases, sessionStart, maxCycles = 40) {
  cancelScheduledAudio();
  const cycleDuration = phases.reduce((s, p) => s + p.seconds, 0);
  const now = ctx.currentTime;

  for (let cycle = 0; cycle < maxCycles; cycle++) {
    let phaseOffset = 0;
    for (const { label, seconds } of phases) {
      const fireAt = sessionStart + cycle * cycleDuration + phaseOffset;
      // Only schedule future events (with a small tolerance for immediate ones)
      if (fireAt >= now - 0.05 && audioBuffers[label]) {
        const src = ctx.createBufferSource();
        src.buffer = audioBuffers[label];
        src.connect(ctx.destination);
        src.start(Math.max(fireAt, now));
        scheduledSources.push(src);
      }
      phaseOffset += seconds;
    }
  }
}

function cancelScheduledAudio() {
  scheduledSources.forEach((s) => { try { s.stop(); } catch {} });
  scheduledSources = [];
}

function stopIosRaf() {
  if (iosRafId) { cancelAnimationFrame(iosRafId); iosRafId = null; }
}

// Compute {phaseIndex, secondCount, cycleCount} from elapsed seconds
function computeStateFromElapsed(elapsed, phases) {
  const cycleDuration = phases.reduce((s, p) => s + p.seconds, 0);
  if (elapsed < 0) return { phaseIndex: 0, secondCount: 1, cycleCount: 0 };
  const cycleCount  = Math.floor(elapsed / cycleDuration);
  const cycleElapsed = elapsed % cycleDuration;
  let t = 0;
  let phaseIndex = 0;
  for (let i = 0; i < phases.length; i++) {
    if (cycleElapsed < t + phases[i].seconds) { phaseIndex = i; break; }
    t += phases[i].seconds;
  }
  const secondCount = Math.min(Math.floor(cycleElapsed - t) + 1, phases[phaseIndex].seconds);
  return { phaseIndex, secondCount, cycleCount };
}

function BreathingTechniques() {
  const [selectedId, setSelectedId]     = useState(null);
  const [isRunning, setIsRunning]       = useState(false);
  const [isCycleBreak, setIsCycleBreak] = useState(false);
  const [phaseIndex, setPhaseIndex]     = useState(0);
  const [secondCount, setSecondCount]   = useState(1);
  const [cycleCount, setCycleCount]     = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [rememberChoice, setRememberChoice] = useState(false);
  const [favorites, setFavorites]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('breathingFavorites')) || []; }
    catch { return []; }
  });

  const intervalRef      = useRef(null);
  const cycleBreakRef    = useRef(null);
  const prevPhaseRef     = useRef(null);
  const iosSessionStart  = useRef(null); // ctx.currentTime when iOS session began
  const iosPausedOffset  = useRef(0);    // seconds elapsed when paused on iOS

  // Load saved sound preference on mount
  useEffect(() => {
    const saved = localStorage.getItem('breathingSoundEnabled');
    if (saved === 'true') setSoundEnabled(true);
  }, []);

  const selectedTechnique = useMemo(
    () => TECHNIQUES.find((t) => t.id === selectedId),
    [selectedId]
  );

  const currentPhase = selectedTechnique ? selectedTechnique.phases[phaseIndex] : null;

  // ── Keepalive + Media Session ─────────────────────────────────────────────
  // Start the silent keepalive loop whenever we're running with sound enabled.
  // This keeps the audio session alive when the phone screen locks.
  useEffect(() => {
    if (!isRunning || !soundEnabled) {
      stopKeepAlive();
      if ('mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'paused';
      }
      return;
    }
    // Resume AudioContext (must be driven by a gesture; we start it in handlers,
    // but call resume here too as a safety net for state changes).
    getOrCreateContext().then((ctx) => {
      startKeepAlive(ctx);
    });
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: selectedTechnique ? selectedTechnique.name : 'Breathing Exercise',
        artist: 'Breathing Timer',
        album: 'Breathing Techniques',
      });
      navigator.mediaSession.playbackState = 'playing';
      // Pause/play via lock-screen controls — route through handleStartPause
      // so iOS RAF + audio rescheduling logic is triggered correctly
      navigator.mediaSession.setActionHandler('pause', () => handleStartPause());
      navigator.mediaSession.setActionHandler('play',  () => handleStartPause());
    }
    return () => {
      stopKeepAlive();
    };
  }, [isRunning, soundEnabled, selectedTechnique]);

  // ── Play MP3 for current phase ────────────────────────────────────────────
  const playPhaseAudio = (phaseLabel) => {
    playAudioBuffer(phaseLabel);
  };

  // ── Trigger audio on phase change (Android / desktop only) ──────────────
  useEffect(() => {
    if (isIOSDevice()) return; // iOS audio is pre-scheduled via AudioContext time
    if (!soundEnabled || !isRunning || !currentPhase) return;
    if (prevPhaseRef.current === phaseIndex && prevPhaseRef.selectedId === selectedId) return;
    prevPhaseRef.current = phaseIndex;
    prevPhaseRef.selectedId = selectedId;
    playPhaseAudio(currentPhase.label);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, selectedId, isRunning, soundEnabled]);

  // ── Timer tick (Android / desktop only — iOS uses AudioContext RAF loop) ──
  useEffect(() => {
    if (isIOSDevice()) return undefined; // iOS handles timing via RAF + ctx.currentTime
    if (!isRunning || !currentPhase || isCycleBreak) return undefined;

    intervalRef.current = setInterval(() => {
      setSecondCount((prev) => {
        if (prev < currentPhase.seconds) {
          return prev + 1;
        }
        setPhaseIndex((prevPhase) => {
          const nextPhase = prevPhase + 1;
          if (nextPhase >= selectedTechnique.phases.length) {
            setCycleCount((c) => c + 1);
            setIsCycleBreak(true);
            clearInterval(intervalRef.current);
            cycleBreakRef.current = setTimeout(() => {
              setPhaseIndex(0);
              setIsCycleBreak(false);
            }, 500);
            return prevPhase;
          }
          return nextPhase;
        });
        return 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentPhase, isCycleBreak, selectedTechnique]);

  useEffect(() => {
    return () => clearTimeout(cycleBreakRef.current);
  }, []);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSelectTechnique = (id) => {
    clearInterval(intervalRef.current);
    clearTimeout(cycleBreakRef.current);
    stopIosRaf();
    cancelScheduledAudio();
    prevPhaseRef.current = null;
    iosPausedOffset.current = 0;
    setSelectedId(id);
    setIsRunning(true);
    setIsCycleBreak(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);

    if (isIOSDevice()) {
      // iOS: resume AudioContext (user gesture), schedule audio, start RAF display
      const technique = TECHNIQUES.find((t) => t.id === id);
      if (technique) {
        (soundEnabled ? preloadAudioBuffers() : Promise.resolve()).then(() => getOrCreateContext()).then((ctx) => {
          startKeepAlive(ctx);
          const start = ctx.currentTime;
          iosSessionStart.current = start;
          if (soundEnabled) scheduleSessionAudio(ctx, technique.phases, start);
          // RAF loop drives visual display from ctx.currentTime
          function tick() {
            const elapsed = ctx.currentTime - iosSessionStart.current;
            const state = computeStateFromElapsed(elapsed, technique.phases);
            setPhaseIndex(state.phaseIndex);
            setSecondCount(state.secondCount);
            setCycleCount(state.cycleCount);
            iosRafId = requestAnimationFrame(tick);
          }
          iosRafId = requestAnimationFrame(tick);
        });
      }
    } else {
      // Android / desktop: resume AudioContext on user gesture; also preload buffers
      // if sound is enabled but buffers haven't been loaded yet (e.g. after page refresh
      // where soundEnabled was restored from localStorage but preloadAudioBuffers was
      // never called).
      if (soundEnabled) preloadAudioBuffers().then(() => {
        startKeepAlive(sharedAudioCtx);
        // Play the first phase audio now that buffers are ready — the phase-change
        // effect already fired (phaseIndex=0) before buffers were loaded, so we
        // missed it. Only play if we're still on the opening phase.
        const technique = TECHNIQUES.find((t) => t.id === id);
        if (technique) playAudioBuffer(technique.phases[0].label);
      });
      else getOrCreateContext().then((ctx) => startKeepAlive(ctx));
    }
  };

  const handleStartPause = () => {
    if (isIOSDevice()) {
      if (isRunning) {
        // Pause: record how far we are, stop RAF and scheduled audio
        if (sharedAudioCtx && iosSessionStart.current !== null) {
          iosPausedOffset.current = sharedAudioCtx.currentTime - iosSessionStart.current;
        }
        stopIosRaf();
        cancelScheduledAudio();
        stopKeepAlive();
        setIsRunning(false);
      } else {
        // Resume: rebase session start so elapsed picks up from pause point
        setIsRunning(true);
        if (selectedTechnique) {
          getOrCreateContext().then((ctx) => {
            startKeepAlive(ctx);
            const resumeStart = ctx.currentTime - iosPausedOffset.current;
            iosSessionStart.current = resumeStart;
            if (soundEnabled) scheduleSessionAudio(ctx, selectedTechnique.phases, resumeStart);
            function tick() {
              const elapsed = ctx.currentTime - iosSessionStart.current;
              const state = computeStateFromElapsed(elapsed, selectedTechnique.phases);
              setPhaseIndex(state.phaseIndex);
              setSecondCount(state.secondCount);
              setCycleCount(state.cycleCount);
              iosRafId = requestAnimationFrame(tick);
            }
            iosRafId = requestAnimationFrame(tick);
          });
        }
      }
    } else {
      setIsRunning((prev) => {
        const next = !prev;
        if (next && soundEnabled) getOrCreateContext().then((ctx) => startKeepAlive(ctx));
        return next;
      });
    }
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    clearTimeout(cycleBreakRef.current);
    stopIosRaf();
    cancelScheduledAudio();
    prevPhaseRef.current = null;
    iosSessionStart.current = null;
    iosPausedOffset.current = 0;
    setIsRunning(false);
    setIsCycleBreak(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleBack = () => {
    clearInterval(intervalRef.current);
    clearTimeout(cycleBreakRef.current);
    stopIosRaf();
    cancelScheduledAudio();
    prevPhaseRef.current = null;
    iosSessionStart.current = null;
    iosPausedOffset.current = 0;
    setSelectedId(null);
    setIsRunning(false);
    setIsCycleBreak(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
    // Reset sound if user didn't save their preference
    if (!localStorage.getItem('breathingSoundEnabled')) setSoundEnabled(false);
  };

  const handleVolumeClick = () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      localStorage.removeItem('breathingSoundEnabled');
    } else {
      setRememberChoice(false);
      setShowConfirm(true);
    }
  };

  const handleConfirmSound = () => {
    setSoundEnabled(true);
    if (rememberChoice) localStorage.setItem('breathingSoundEnabled', 'true');
    setShowConfirm(false);
    // Preload + create AudioContext inside this user gesture (required by iOS)
    preloadAudioBuffers().then(() => {
      // If a session is already running on iOS, schedule audio from current position
      if (isIOSDevice() && isRunning && selectedTechnique && iosSessionStart.current !== null && sharedAudioCtx) {
        scheduleSessionAudio(sharedAudioCtx, selectedTechnique.phases, iosSessionStart.current);
      }
    });
  };

  const handleCancelSound = () => {
    setRememberChoice(false);
    setShowConfirm(false);
  };

  const toggleFavorite = (e, id) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem('breathingFavorites', JSON.stringify(next));
      return next;
    });
  };

  // Map phase label → image filename
  const phaseImageMap = {
    Inhale: 'inhale',
    Exhale: 'exhale',
    Hold:   'hold',
  };

  // ── Confirmation modal ────────────────────────────────────────────────────
  const ConfirmModal = () => (
    <div className="sound-modal-overlay">
      <div className="sound-modal">
        <p>Turn on voice guidance for each breathing phase?</p>
        <label className="sound-modal-remember">
          <input
            type="checkbox"
            checked={rememberChoice}
            onChange={(e) => setRememberChoice(e.target.checked)}
          />
          Remember my choice
        </label>
        <div className="sound-modal-actions">
          <button className="btn" onClick={handleConfirmSound}>Yes, turn on</button>
          <button className="btn btn-secondary" onClick={handleCancelSound}>Cancel</button>
        </div>
      </div>
    </div>
  );

  // ── Volume icon ───────────────────────────────────────────────────────────
  const VolumeIcon = () => (
    <button
      className="btn btn-icon volume-btn"
      onClick={handleVolumeClick}
      aria-label={soundEnabled ? 'Mute' : 'Unmute'}
      title={soundEnabled ? 'Voice on — click to mute' : 'Voice off — click to enable'}
    >
      {soundEnabled ? (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#3498db" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#3498db" stroke="none"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="#aaa" stroke="none"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        </svg>
      )}
    </button>
  );

  // ── Timer view ────────────────────────────────────────────────────────────
  if (selectedTechnique) {
    const phaseKey = currentPhase ? currentPhase.label : 'Hold';
    const phaseImg = phaseImageMap[phaseKey] || 'hold';
    const progress = currentPhase ? (secondCount / currentPhase.seconds) * 100 : 0;

    return (
      <div className="page breathing-page">
        {showConfirm && <ConfirmModal />}

        <button className="btn btn-back" onClick={handleBack}>← Back</button>

        <div className="timer-layout">

          <div className="timer-technique-img-wrap">
            <img
              src={`${process.env.PUBLIC_URL}/techniques/technique_${selectedTechnique.id}.png`}
              alt={selectedTechnique.name}
              className="timer-technique-img"
            />
          </div>

          <div className="timer-controls-wrap">

            <div className="breathing-phase-strip">
              {selectedTechnique.phases.map((p, i) => (
                <span key={i} className={`phase-pill ${i === phaseIndex ? 'phase-active' : ''}`}>
                  {p.label} {p.seconds}s
                </span>
              ))}
            </div>

            <div className="breathing-img-wrap">
              <img
                key={phaseImg}
                src={`${process.env.PUBLIC_URL}/techniques/phase_${phaseImg}.png`}
                alt={phaseKey}
                className="breathing-phase-img"
              />
              <div className="breathing-counter-overlay">
                <span className="breathing-counter">{secondCount}</span>
                <span className="breathing-of">/ {currentPhase ? currentPhase.seconds : 0}s</span>
              </div>
              <div className="breathing-progress-bar">
                <div
                  className="breathing-progress-fill"
                  style={{ width: `${progress}%`, transition: 'width 0.9s linear' }}
                />
              </div>
            </div>

            <p className="cycle-count">Completed cycles: <strong>{cycleCount}</strong></p>
            <p className="cycle-recommendation"><strong>Recommended:</strong> {selectedTechnique.recommendation}</p>

            <div className="breathing-actions">
              <button className="btn btn-icon" onClick={handleStartPause} aria-label={isRunning ? 'Pause' : 'Play'}>
                {isRunning ? (
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#3498db" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" width="64" height="64" fill="#3498db" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="6,3 21,12 6,21" />
                  </svg>
                )}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleReset}>Reset</button>
              <VolumeIcon />
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Card grid view ────────────────────────────────────────────────────────
  const favoriteTechniques = TECHNIQUES.filter((t) => favorites.includes(t.id));
  const allTechniquesList  = favorites.length >= 7
    ? TECHNIQUES.filter((t) => !favorites.includes(t.id))
    : TECHNIQUES;

  const TechniqueCard = ({ t }) => (
    <div key={t.id} className="technique-card-wrap">
      <button
        className="technique-card"
        onClick={() => handleSelectTechnique(t.id)}
      >
        <img
          src={`${process.env.PUBLIC_URL}/techniques/technique_${t.id}.png`}
          alt={t.name}
          className="technique-card-img"
        />
      </button>
      <button
        className={`fav-btn ${favorites.includes(t.id) ? 'fav-btn--active' : ''}`}
        onClick={(e) => toggleFavorite(e, t.id)}
        aria-label={favorites.includes(t.id) ? 'Remove from favorites' : 'Add to favorites'}
        title={favorites.includes(t.id) ? 'Remove from favorites' : 'Add to favorites'}
      >
        <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
  );

  return (
    <div className="page breathing-page">
      {showConfirm && <ConfirmModal />}
      <div
        className="breathing-header-bg"
        style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/header-bg.png)` }}
      />
      <p>Tap a technique to start the guided timer.</p>

      {favoriteTechniques.length > 0 && (
        <>
          <h3 className="technique-section-label">❤ Favorites</h3>
          <div className="technique-grid">
            {favoriteTechniques.map((t) => <TechniqueCard key={t.id} t={t} />)}
          </div>
          <h3 className="technique-section-label">All Techniques</h3>
        </>
      )}

      {allTechniquesList.length > 0 && (
        <div className="technique-grid">
          {allTechniquesList.map((t) => <TechniqueCard key={t.id} t={t} />)}
        </div>
      )}
    </div>
  );
}

export default BreathingTechniques;
