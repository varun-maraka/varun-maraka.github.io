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

// Preload audio files
const PHASE_AUDIO = {
  Inhale: new Audio(`${process.env.PUBLIC_URL}/techniques/inhale.mp3`),
  Hold:   new Audio(`${process.env.PUBLIC_URL}/techniques/hold.mp3`),
  Exhale: new Audio(`${process.env.PUBLIC_URL}/techniques/exhale.mp3`),
};

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

  const intervalRef   = useRef(null);
  const cycleBreakRef = useRef(null);
  const prevPhaseRef  = useRef(null);

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

  // ── Play MP3 for current phase ────────────────────────────────────────────
  const playPhaseAudio = (phaseLabel) => {
    const audio = PHASE_AUDIO[phaseLabel];
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {}); // silently ignore autoplay errors
  };

  // ── Trigger audio on phase change ─────────────────────────────────────────
  useEffect(() => {
    if (!soundEnabled || !isRunning || !currentPhase) return;
    if (prevPhaseRef.current === phaseIndex && prevPhaseRef.selectedId === selectedId) return;
    prevPhaseRef.current = phaseIndex;
    prevPhaseRef.selectedId = selectedId;
    playPhaseAudio(currentPhase.label);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseIndex, selectedId, isRunning, soundEnabled]);

  // ── Timer tick ────────────────────────────────────────────────────────────
  useEffect(() => {
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
    prevPhaseRef.current = null;
    setSelectedId(id);
    setIsRunning(true);
    setIsCycleBreak(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    clearTimeout(cycleBreakRef.current);
    prevPhaseRef.current = null;
    setIsRunning(false);
    setIsCycleBreak(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleBack = () => {
    clearInterval(intervalRef.current);
    clearTimeout(cycleBreakRef.current);
    prevPhaseRef.current = null;
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

      <div className="technique-grid">
        {TECHNIQUES.map((t) => <TechniqueCard key={t.id} t={t} />)}
      </div>
    </div>
  );
}

export default BreathingTechniques;
