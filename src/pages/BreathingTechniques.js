import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Pages.css';

const TECHNIQUES = [
  { id: '4-7-8',   name: '4-7-8 Breathing',      phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 7 }, { label: 'Exhale', seconds: 8 }] },
  { id: '4-4-4-4', name: '4-4-4-4 (Box)',         phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 4 }, { label: 'Exhale', seconds: 4 }, { label: 'Hold', seconds: 4 }] },
  { id: '5-5',     name: '5-5 Breathing',          phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Exhale', seconds: 5 }] },
  { id: '5-5-5-5', name: '5-5-5-5 Breathing',     phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Hold', seconds: 5 }, { label: 'Exhale', seconds: 5 }, { label: 'Hold', seconds: 5 }] },
  { id: '6-3-6-3', name: '6-3-6-3 Breathing',     phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }, { label: 'Hold', seconds: 3 }] },
  { id: '6-6',     name: '6-6 Breathing',          phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Exhale', seconds: 6 }] },
  { id: '3-3-6',   name: '3-3-6 Breathing',        phases: [{ label: 'Inhale', seconds: 3 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }] },
  { id: '4-6',     name: '4-6 Breathing',           phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Exhale', seconds: 6 }] },
  { id: '7-11',    name: '7-11 Breathing',          phases: [{ label: 'Inhale', seconds: 7 }, { label: 'Exhale', seconds: 11 }] },
  { id: '2-4',     name: '2-4 Breathing',           phases: [{ label: 'Inhale', seconds: 2 }, { label: 'Exhale', seconds: 4 }] },
];

function BreathingTechniques() {
  const [selectedId, setSelectedId] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondCount, setSecondCount] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef(null);

  const selectedTechnique = useMemo(
    () => TECHNIQUES.find((t) => t.id === selectedId),
    [selectedId]
  );

  const currentPhase = selectedTechnique ? selectedTechnique.phases[phaseIndex] : null;

  useEffect(() => {
    if (!isRunning || !currentPhase) return undefined;

    intervalRef.current = setInterval(() => {
      setSecondCount((prev) => {
        if (prev < currentPhase.seconds) {
          return prev + 1;
        }
        setPhaseIndex((prevPhase) => {
          const nextPhase = prevPhase + 1;
          if (nextPhase >= selectedTechnique.phases.length) {
            setCycleCount((c) => c + 1);
            return 0;
          }
          return nextPhase;
        });
        return 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentPhase, selectedTechnique]);

  const handleSelectTechnique = (id) => {
    clearInterval(intervalRef.current);
    setSelectedId(id);
    setIsRunning(true);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleStartPause = () => setIsRunning((prev) => !prev);

  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleBack = () => {
    clearInterval(intervalRef.current);
    setSelectedId(null);
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  // Map phase label → image filename
  const phaseImageMap = {
    Inhale: 'inhale',
    Exhale: 'exhale',
    Hold:   'hold',
  };

  // ── Timer view ───────────────────────────────────────────────────────────────
  if (selectedTechnique) {
    const phaseKey   = currentPhase ? currentPhase.label : 'Hold';
    const phaseImg   = phaseImageMap[phaseKey] || 'hold';
    const progress   = currentPhase ? (secondCount / currentPhase.seconds) * 100 : 0;

    return (
      <div className="page breathing-page">
        <button className="btn btn-back" onClick={handleBack}>← Back</button>

        <div className="timer-layout">

          {/* Left — technique card image */}
          <div className="timer-technique-img-wrap">
            <img
              src={`${process.env.PUBLIC_URL}/techniques/technique_${selectedTechnique.id}.png`}
              alt={selectedTechnique.name}
              className="timer-technique-img"
            />
          </div>

          {/* Right — phase animation + controls */}
          <div className="timer-controls-wrap">

            {/* Phase pills */}
            <div className="breathing-phase-strip">
              {selectedTechnique.phases.map((p, i) => (
                <span key={i} className={`phase-pill ${i === phaseIndex ? 'phase-active' : ''}`}>
                  {p.label} {p.seconds}s
                </span>
              ))}
            </div>

            {/* Phase face image */}
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

            <div className="breathing-actions">
              <button className="btn" onClick={handleStartPause}>
                {isRunning ? 'Pause' : 'Resume'}
              </button>
              <button className="btn btn-secondary" onClick={handleReset}>Reset</button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // ── Card grid view ───────────────────────────────────────────────────────────
  return (
    <div className="page breathing-page">
      <div
          className="breathing-header-bg"
          style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/header-bg.png)` }}
        />
      <p>Tap a technique to start the guided timer.</p>

      <div className="technique-grid">
        {TECHNIQUES.map((t) => (
          <button
            key={t.id}
            className="technique-card"
            onClick={() => handleSelectTechnique(t.id)}
          >
            <img
              src={`${process.env.PUBLIC_URL}/techniques/technique_${t.id}.png`}
              alt={t.name}
              className="technique-card-img"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default BreathingTechniques;
