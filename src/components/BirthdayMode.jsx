import React, { useState, useEffect, useRef } from 'react';
// Note: useBlowDetector hook is assumed to be in '../hooks/useBlowDetector.js'
import useBlowDetector from '../hooks/useBlowDetector';

// UPDATE: Accept 'age' prop
export default function BirthdayMode({ name, age, onFinish }) {
  const [stage, setStage] = useState('idle');
  // UPDATE: Only one candle now
  const [candleLit, setCandleLit] = useState(true);
  const [sensitivity, setSensitivity] = useState(40);
  const [micAvailable, setMicAvailable] = useState(null);

  const { start, stop, isActive, level } = useBlowDetector();
  const levelRef = useRef(level);
  levelRef.current = level;

  useEffect(() => {
    if (!isActive) return;
    const threshold = sensitivity / 100;
    if (levelRef.current / 100 > threshold) {
      handleExtinguish();
    }
  }, [level, isActive, sensitivity]);

  const tryStartMic = async () => {
    try {
      await start();
      setMicAvailable(true);
      setStage('listening');
    } catch (err) {
      console.warn('mic denied or error', err);
      setMicAvailable(false);
    }
  };

  const stopMic = () => {
    try { stop(); } catch {}
    setStage('ready');
  };

  const handleExtinguish = () => {
    setCandleLit(false); // Extinguish the single candle
    setStage('blown');
    setTimeout(() => {
      setStage('gift');
    }, 900);
    try { stop(); } catch {}
  };

  const handleClickBlow = () => {
    handleExtinguish();
  };

  // UPDATE: This function now sets stage to 'card'
  const openGift = () => {
    setStage('card');
  };

  return (
    <div className="birthday-container">
      {/* UPDATE: New Birthday Card Modal */}
      {stage === 'card' && (
        <div className="card-overlay">
          <div className="birthday-card animate-popup">
            <div className="card-header">
              <h2>Happy Birthday, {name}!</h2>
              <span>🎉</span>
            </div>
            <p className="card-message">
              Wishing you a fantastic day and a year filled with
              luck, success, and all the focus you need!
            </p>
            <button className="btn btn-primary" onClick={onFinish}>
              Go to your Study Aid 🍃
            </button>
          </div>
        </div>
      )}

      <div className="birthday-header">
        <h1 className="birthday-title">🎉 Happy Birthday, {name}! 🎉</h1>
        <p className="birthday-subtitle">
          {stage !== 'gift' && stage !== 'card' 
            ? "Make a wish and blow out your candle!" 
            : "Your wish is on its way!"
          }
        </p>
      </div>

      <div className="cake-section">
        <div className="cake-display">
          
          <svg width="300" height="250" viewBox="0 0 300 250" className="cake-svg-new">
            <defs>
              <linearGradient id="newCakeLayer1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbcfe8" />
                <stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
              <linearGradient id="newCakeLayer2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f9a8d4" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
              <linearGradient id="frostingNew" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#fdf2f8" />
              </linearGradient>
            </defs>
            
            <ellipse cx="150" cy="225" rx="140" ry="20" fill="#f1f5f9" />
            <rect x="30" y="150" width="240" height="70" rx="10" fill="url(#newCakeLayer2)" />
            <ellipse cx="150" cy="150" rx="120" ry="25" fill="#fbcfe8" />
            <rect x="50" y="80" width="200" height="70" rx="10" fill="url(#newCakeLayer1)" />
            <ellipse cx="150" cy="80" rx="100" ry="20" fill="#fdf2f8" />
            
            <circle cx="80" cy="155" r="10" fill="url(#frostingNew)" />
            <circle cx="120" cy="158" r="12" fill="url(#frostingNew)" />
            <circle cx="160" cy="155" r="10" fill="url(#frostingNew)" />
            <circle cx="200" cy="157" r="11" fill="url(#frostingNew)" />
            <circle cx="230" cy="155" r="10" fill="url(#frostingNew)" />
            
            {/* UPDATE: Display the age on the cake */}
            <text x="150" y="130" className="cake-age-text" textAnchor="middle">
              {age}
            </text>
          </svg>

          {/* UPDATE: Only one candle, centered */}
          <div className="candles-container-new">
            <div className="candle" style={{ left: '50%', top: '-30px' }}>
              <div className="candle-wax"></div>
              <div className="candle-wick"></div>
              {candleLit && <div className="candle-flame"></div>}
              {!candleLit && <div className="candle-smoke"></div>}
            </div>
          </div>
        </div>

        <div className="controls-panel">
          {stage === 'idle' && (
            <button className="btn btn-celebrate" onClick={() => setStage('ready')}>
              🎊 Start Celebration
            </button>
          )}

          {stage === 'ready' && candleLit && (
            <div className="control-group">
              <div className="button-row">
                <button className="btn btn-primary" onClick={handleClickBlow}>
                  💨 Blow Candle
                </button>
                <button className="btn btn-secondary" onClick={tryStartMic}>
                  {micAvailable === false ? '🎤 Mic Unavailable' : '🎤 Use Microphone'}
                </button>
              </div>
              
              <div className="sensitivity-control">
                <label className="control-label">
                  Microphone Sensitivity
                  <span className="control-hint">Lower = more sensitive</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="90"
                  value={sensitivity}
                  onChange={(e) => setSensitivity(Number(e.target.value))}
                  className="slider"
                />
                <div className="level-display">Current: {level}%</div>
              </div>
            </div>
          )}

          {stage === 'listening' && candleLit && (
            <div className="listening-panel">
              <p className="listening-text">🌬️ Listening... blow toward your mic!</p>
              <div className="level-meter">
                <div className="level-fill" style={{ width: `${Math.min(level, 100)}%` }}></div>
              </div>
              <div className="button-row">
                <button className="btn btn-ghost" onClick={stopMic}>Stop Listening</button>
                <button className="btn btn-primary" onClick={handleClickBlow}>💨 Click to Blow</button>
              </div>
            </div>
          )}

          {stage === 'blown' && (
            <div className="blown-message">
              <p>✨ Amazing! Your wish has been made...</p>
            </div>
          )}

          {stage === 'gift' && (
            <div className="gift-section">
              <div className="gift-box" onClick={openGift}>
                <div className="gift-ribbon-v"></div>
                <div className="gift-ribbon-h"></div>
                <div className="gift-bow"></div>
                <p className="gift-label">🎁 Open Gift</p>
              </div>
              <p className="gift-hint">A surprise is waiting for you!</p>
              
              {/* Confetti Animation */}
              <div className="confetti-container" style={{ zIndex: 10 }}>
                {Array.from({ length: 40 }).map((_, i) => (
                  <div
                    key={i}
                    className="confetti"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${i * 50}ms`,
                      backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd'][i % 5]
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}