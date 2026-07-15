import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Minimize2 } from 'lucide-react';
import Draggable from 'react-draggable';

export default function Timer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'rest'
  const [isMinimized, setIsMinimized] = useState(false);
  const nodeRef = useRef(null);

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

  const handleTabClick = (newMode) => {
    if (mode === newMode) return;
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'focus' ? 25 : 5);
    setSeconds(0);
  };

  return (
    <Draggable nodeRef={nodeRef} cancel=".btn-minimize, .timer-tab, .btn-minimal-play, .btn-minimal-reset" bounds="body">
      {isMinimized ? (
        <div ref={nodeRef} className="focus-card-minimized" onClick={() => setIsMinimized(false)}>
          <div className="timer-minimized-time">
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>
          <button 
            className="btn-play-toggle" 
            style={{ width: '30px', height: '30px' }}
            onClick={(e) => { e.stopPropagation(); toggleTimer(); }}
          >
            {isActive ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
          </button>
        </div>
      ) : (
        <div ref={nodeRef} className="focus-card">
          <button className="btn-minimize" onClick={() => setIsMinimized(true)} title="Minimize Timer">
            <Minimize2 size={20} />
          </button>

          <div className="timer-tabs">
            <button 
              className={`timer-tab ${mode === 'focus' ? 'active' : ''}`}
              onClick={() => handleTabClick('focus')}
            >
              Focus
            </button>
            <button 
              className={`timer-tab ${mode === 'rest' ? 'active' : ''}`}
              onClick={() => handleTabClick('rest')}
            >
              Short Break
            </button>
          </div>
          
          <div className="timer-display">
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </div>

          <div className="timer-controls-minimal">
            <button className="btn-minimal-play" onClick={toggleTimer} title={isActive ? 'Pause' : 'Start'}>
              {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
            </button>
            <button className="btn-minimal-reset" onClick={resetTimer} title="Reset">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}