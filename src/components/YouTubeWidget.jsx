import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import ReactPlayer from 'react-player';
import { MonitorPlay, X, GripHorizontal, Search } from 'lucide-react';

export default function YouTubeWidget({ resetKey, onClose }) {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const nodeRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      setUrl(inputUrl.trim());
    }
  };

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.style.transform = 'translate(0px, 0px)';
    }
  }, [resetKey]);

  return (
    <Draggable key={resetKey} nodeRef={nodeRef} handle=".yt-header" bounds="body">
      <div ref={nodeRef} className="youtube-widget">
        <div className="yt-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GripHorizontal size={16} className="drag-handle" />
            <MonitorPlay size={18} color="#4ade80" />
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>YouTube</span>
          </div>
          <button onClick={onClose} className="btn-icon">
            <X size={16} />
          </button>
        </div>
        
        <div className="yt-body">
          {!url ? (
            <form onSubmit={handleSubmit} className="yt-form">
              <input 
                type="text" 
                placeholder="Paste YouTube URL..." 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button type="submit">
                <Search size={16} />
              </button>
            </form>
          ) : (
            <div className="player-wrapper">
              <ReactPlayer 
                url={url} 
                width="100%" 
                height="100%" 
                controls 
                playing
              />
              <button 
                onClick={() => setUrl('')} 
                style={{ 
                  marginTop: '10px', 
                  width: '100%', 
                  padding: '5px', 
                  background: 'rgba(255,255,255,0.1)', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  color: 'white', 
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Change Video
              </button>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
