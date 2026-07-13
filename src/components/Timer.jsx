import React, { useState, useEffect } from 'react';

import beverageIcon from '../assets/beverage.svg';
import brainIcon from '../assets/brain.svg';

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'rest'

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            // Optional: Play sound here
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  const switchMode = () => {
    setIsActive(false);
    if(mode === 'focus') {
      setMode('rest');
      setMinutes(5);
    } else {
      setMode('focus');
      setMinutes(25);
    }
    setSeconds(0);
  };

  return (
    <div className="focus-card">
      <h2 style={{ opacity: 0.6, textTransform: 'uppercase', letterSpacing: '3px', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        {mode === 'focus' ? 'Currently Focusing' : 'Resting Time'}
      </h2>
      
      <div className="timer-display">
        {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>

      <div className="timer-controls">
        <button onClick={toggleTimer} className={isActive ? 'active' : ''}>
          {isActive ? 'Pause' : 'Start Focus'}
        </button>
        <button className="btn-secondary" onClick={resetTimer}>
          Reset
        </button>
      </div>
      
      {/* NEW: Enhanced Switch Button */}
      <div className="mode-toggle-container">
        <button className="btn-mode-switch" onClick={switchMode}>
          <img src={mode === 'focus' ? beverageIcon : brainIcon} alt="Mode Icon" className="icon" style={{ width: '1.2em', height: '1.2em' }} />
          <span>Switch to {mode === 'focus' ? 'Short Break' : 'Deep Focus'}</span>
        </button>
      </div>
    </div>
  );
}