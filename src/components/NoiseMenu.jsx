import React from 'react';

// Receiving audio state and functions from parent (StudyMode)
function NoiseMenu({ onClose, playingId, toggleSound, volume, setVolume, noises }) {
  
  return (
    <div className="noise-overlay" onClick={onClose}>
      <div className="noise-menu" onClick={(e) => e.stopPropagation()}>
        <div className="noise-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 className="noise-title">Soundscapes</h2>
          <button className="btn-close" style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.2rem', cursor: 'pointer' }} onClick={onClose}>✕</button>
        </div>

        <div className="noise-list">
          {noises.map((noise) => (
            <div key={noise.id} className="noise-item">
              <div className="noise-info">
                <span className="noise-icon" style={{ fontSize: '1.5rem', marginRight: '10px' }}>{noise.icon}</span>
                <div>
                  <h3 className="noise-name">{noise.title}</h3>
                  <p className="noise-desc">{noise.desc}</p>
                </div>
              </div>
              <button
                className={`btn-play-toggle ${playingId === noise.id ? 'playing' : ''}`}
                onClick={() => toggleSound(noise.id)}
              >
                {playingId === noise.id ? '❚❚' : '▶'}
              </button>
            </div>
          ))}
        </div>

        <div className="master-volume">
          <label className="volume-label" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#cbd5e1' }}>
            <span>Master Volume</span>
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  )
}

export default NoiseMenu;