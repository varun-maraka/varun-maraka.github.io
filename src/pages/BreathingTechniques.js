import React, { useEffect, useMemo, useRef, useState } from 'react';
import './Pages.css';

const TECHNIQUES = [
  { id: '4-7-8', name: '4-7-8 Breathing', phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 7 }, { label: 'Exhale', seconds: 8 }] },
  { id: '4-4-4-4', name: '4-4-4-4 (Box)', phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Hold', seconds: 4 }, { label: 'Exhale', seconds: 4 }, { label: 'Hold', seconds: 4 }] },
  { id: '5-5', name: '5-5 Breathing', phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Exhale', seconds: 5 }] },
  { id: '5-5-5-5', name: '5-5-5-5 Breathing', phases: [{ label: 'Inhale', seconds: 5 }, { label: 'Hold', seconds: 5 }, { label: 'Exhale', seconds: 5 }, { label: 'Hold', seconds: 5 }] },
  { id: '6-3-6-3', name: '6-3-6-3 Breathing', phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }, { label: 'Hold', seconds: 3 }] },
  { id: '6-6', name: '6-6 Breathing', phases: [{ label: 'Inhale', seconds: 6 }, { label: 'Exhale', seconds: 6 }] },
  { id: '3-3-6', name: '3-3-6 Breathing', phases: [{ label: 'Inhale', seconds: 3 }, { label: 'Hold', seconds: 3 }, { label: 'Exhale', seconds: 6 }] },
  { id: '4-6', name: '4-6 Breathing', phases: [{ label: 'Inhale', seconds: 4 }, { label: 'Exhale', seconds: 6 }] },
  { id: '7-11', name: '7-11 Breathing', phases: [{ label: 'Inhale', seconds: 7 }, { label: 'Exhale', seconds: 11 }] },
  { id: '2-4', name: '2-4 Breathing', phases: [{ label: 'Inhale', seconds: 2 }, { label: 'Exhale', seconds: 4 }] },
];

function BreathingTechniques() {
  const [selectedId, setSelectedId] = useState('4-7-8');
  const [isRunning, setIsRunning] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondCount, setSecondCount] = useState(1);
  const [cycleCount, setCycleCount] = useState(0);
  const intervalRef = useRef(null);

  const selectedTechnique = useMemo(
    () => TECHNIQUES.find((item) => item.id === selectedId),
    [selectedId]
  );

  const currentPhase = selectedTechnique.phases[phaseIndex];

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setSecondCount((prev) => {
        if (prev < currentPhase.seconds) {
          return prev + 1;
        }

        setPhaseIndex((prevPhase) => {
          const nextPhase = prevPhase + 1;
          if (nextPhase >= selectedTechnique.phases.length) {
            setCycleCount((prevCycle) => prevCycle + 1);
            return 0;
          }
          return nextPhase;
        });

        return 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentPhase.seconds, selectedTechnique.phases.length]);

  const handleStartPause = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  const handleTechniqueChange = (event) => {
    setSelectedId(event.target.value);
    setIsRunning(false);
    setPhaseIndex(0);
    setSecondCount(1);
    setCycleCount(0);
  };

  return (
    <div className="page breathing-page">
      <h2>Breathing Techniques</h2>
      <p>Choose a pattern and press Start. The counter runs second-by-second for each phase.</p>

      <div className="breathing-controls">
        <label htmlFor="technique-select">Technique:</label>
        <select id="technique-select" value={selectedId} onChange={handleTechniqueChange}>
          {TECHNIQUES.map((technique) => (
            <option key={technique.id} value={technique.id}>
              {technique.name}
            </option>
          ))}
        </select>
      </div>

      <div className="content-box breathing-summary">
        {selectedTechnique.phases.map((phase, index) => (
          <span key={`${phase.label}-${index}`}>
            {phase.label} {phase.seconds}
            {index < selectedTechnique.phases.length - 1 ? ' → ' : ''}
          </span>
        ))}
      </div>

      <div className="breathing-live">
        <h3>{currentPhase.label}</h3>
        <div className="breathing-counter">{secondCount}</div>
        <p>
          Out of {currentPhase.seconds} seconds | Completed cycles: {cycleCount}
        </p>
      </div>

      <div className="breathing-actions">
        <button className="btn" onClick={handleStartPause}>
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  );
}

export default BreathingTechniques;
