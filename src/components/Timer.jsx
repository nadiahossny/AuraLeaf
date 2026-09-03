import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Minimize2, Plus, Minus } from 'lucide-react';
import Draggable from 'react-draggable';

export default function Timer({ resetKey, onTimerStateChange, isManualZenMode }) {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('focus'); // 'focus' or 'rest'
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [customFocusTime, setCustomFocusTime] = useState(25);
  const [customRestTime, setCustomRestTime] = useState(5);
  const nodeRef = useRef(null);
  const isDraggingRef = useRef(false);

  // Fetch first incomplete task
  useEffect(() => {
    const fetchTask = () => {
      const saved = localStorage.getItem('auraleaf-todos');
      if (saved) {
        try {
          const tasks = JSON.parse(saved);
          const firstIncomplete = tasks.find(t => !t.completed);
          setCurrentTask(firstIncomplete ? firstIncomplete.text : null);
        } catch (e) {}
      }
    };
    fetchTask();
    window.addEventListener('todos-updated', fetchTask);
    return () => window.removeEventListener('todos-updated', fetchTask);
  }, []);

  // Force DOM transform reset when resetKey changes, 
  // because react-draggable might read the old nodeRef before React commits the new DOM node.
  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [resetKey]);

  // Notify parent of timer state
  useEffect(() => {
    if (onTimerStateChange) {
      onTimerStateChange(isActive);
    }
  }, [isActive, onTimerStateChange]);

  const playChime = () => {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
        
        // Soft attack, long decay for a bell-like sound
        gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
        gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startTime + duration);
        
        osc.start(ctx.currentTime + startTime);
        osc.stop(ctx.currentTime + startTime + duration);
      };

      // Play a soft, relaxing chord (C Major)
      playTone(523.25, 0, 2.0);   // C5
      playTone(659.25, 0.15, 2.5); // E5
      playTone(783.99, 0.3, 3.0);  // G5
    } catch(e) {
      console.log('Audio API not supported');
    }
  };

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
            playChime();
            if (mode === 'focus') {
              setSessionsCompleted(prev => prev + 1);
            }
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
  }, [isActive, seconds, minutes, mode]);

  const toggleTimer = React.useCallback(() => setIsActive(prev => !prev), []);

  const resetTimer = React.useCallback(() => {
    setIsActive(false);
    setMinutes(mode === 'focus' ? customFocusTime : customRestTime);
    setSeconds(0);
  }, [mode, customFocusTime, customRestTime]);

  const handleTabClick = (newMode) => {
    if (mode === newMode) return;
    setIsActive(false);
    setMode(newMode);
    setMinutes(newMode === 'focus' ? customFocusTime : customRestTime);
    setSeconds(0);
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleTimer();
      } else if (e.key.toLowerCase() === 'r') {
        resetTimer();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTimer, resetTimer]);

  return (
    <Draggable 
      key={resetKey}
      nodeRef={nodeRef} 
      cancel=".btn-minimize, .timer-tab, .btn-minimal-play, .btn-minimal-reset" 
      bounds="body"
      onDrag={() => { isDraggingRef.current = true; }}
      onStop={() => { setTimeout(() => { isDraggingRef.current = false; }, 50); }}
    >
      {isMinimized ? (
        <div ref={nodeRef} className="focus-card-minimized" onClick={() => { if (!isDraggingRef.current) setIsMinimized(false); }}>
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
        <div ref={nodeRef} className={`focus-card ${isManualZenMode ? 'dnd-active' : ''}`}>
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
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            {!isActive && (
              <button 
                className="btn-icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  let current = mode === 'focus' ? customFocusTime : customRestTime;
                  let newMins = Math.max(1, current - 5);
                  if (mode === 'focus') setCustomFocusTime(newMins);
                  else setCustomRestTime(newMins);
                  setMinutes(newMins);
                  setSeconds(0);
                }} 
                title="Decrease 5m"
              >
                <Minus size={24} />
              </button>
            )}
            
            <div className="timer-display">
              {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </div>

            {!isActive && (
              <button 
                className="btn-icon" 
                onClick={(e) => {
                  e.stopPropagation();
                  let current = mode === 'focus' ? customFocusTime : customRestTime;
                  let newMins = Math.min(120, current + 5);
                  if (mode === 'focus') setCustomFocusTime(newMins);
                  else setCustomRestTime(newMins);
                  setMinutes(newMins);
                  setSeconds(0);
                }} 
                title="Increase 5m"
              >
                <Plus size={24} />
              </button>
            )}
          </div>

          {currentTask && mode === 'focus' && (
            <div className="current-focus-task" style={{ margin: '0.5rem 0 1.5rem 0', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', borderRadius: '50px', display: 'inline-block', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <span style={{opacity: 0.6, fontSize: '0.9rem', marginRight: '8px'}}>Focusing on:</span>
              <strong style={{ fontWeight: 500, letterSpacing: '0.5px' }}>{currentTask}</strong>
            </div>
          )}

          <div className="timer-controls-minimal">
            <button className="btn-minimal-play" onClick={toggleTimer} title={isActive ? 'Pause' : 'Start (Space)'}>
              {isActive ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '4px' }} />}
            </button>
            <button className="btn-minimal-reset" onClick={resetTimer} title="Reset (R)">
              <RotateCcw size={24} />
            </button>
          </div>

          {sessionsCompleted > 0 && (
            <div className="sessions-counter" style={{ marginTop: '1.5rem', opacity: 0.6, fontSize: '0.9rem', letterSpacing: '1px' }}>
              Sessions today: {sessionsCompleted}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}