import React, { useState, useRef } from 'react';
import Draggable from 'react-draggable';
import ReactPlayer from 'react-player';
import { X, GripHorizontal, Loader2 } from 'lucide-react';

export default function YoutubeWidget({ onClose }) {
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const nodeRef = useRef(null);

  const handleLoad = (e) => {
    e.preventDefault();
    let finalUrl = inputUrl.trim();
    if (finalUrl && !/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }
    setUrl(finalUrl);
    setIsLoading(true);
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".yt-header" bounds="body">
      <div ref={nodeRef} className="youtube-widget">
        <div className="yt-header">
          <GripHorizontal size={18} className="drag-handle" />
          <span>YouTube Player</span>
          <button className="btn-close-sm" onClick={onClose} title="Close"><X size={18} /></button>
        </div>
        <div className="yt-body">
          {!url ? (
            <form onSubmit={handleLoad} className="yt-form">
              <input 
                type="text" 
                placeholder="Paste YouTube URL..." 
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
              />
              <button type="submit">Load</button>
            </form>
          ) : (
            <div className="player-wrapper" style={{ position: 'relative' }}>
              {isLoading && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 10 }}>
                  <Loader2 className="animate-spin" size={32} color="#fff" />
                  <span style={{ marginLeft: '10px', color: '#fff' }}>Loading...</span>
                </div>
              )}
              <ReactPlayer 
                src={url} 
                className="react-player"
                width="100%" 
                height="100%" 
                controls 
                playing={isPlaying}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onReady={() => { setIsPlaying(true); setIsLoading(false); }}
                onError={(e) => { console.error("ReactPlayer error:", e); setIsLoading(false); }}
              />
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
}
