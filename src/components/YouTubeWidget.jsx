import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import ReactPlayer from 'react-player';
import { MonitorPlay, X, GripHorizontal, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useAdaptiveDevice } from '../hooks/useAdaptiveDevice';

export default function YouTubeWidget({ resetKey, onClose }) {
  const { isMobile } = useAdaptiveDevice();
  const [url, setUrl] = useState('');
  const [inputUrl, setInputUrl] = useState('');
  const [isMobileMinimized, setIsMobileMinimized] = useState(false);
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
  }, [resetKey, isMobile]);

  const renderBody = () => (
    <div className="yt-body">
      {!url ? (
        <form onSubmit={handleSubmit} className="yt-form">
          <input
            type="text"
            placeholder="Paste YouTube URL..."
            value={inputUrl}
            onChange={(e) => setInputUrl(e.target.value)}
            aria-label="YouTube Video URL"
          />
          <button type="submit" aria-label="Load YouTube Video">
            <Search size={16} />
          </button>
        </form>
      ) : (
        <div className="yt-player-container">
          <div className="player-wrapper">
            <ReactPlayer url={url} width="100%" height="100%" controls playing />
          </div>
          <button
            type="button"
            className="btn-change-video"
            onClick={() => setUrl('')}
          >
            Change Video
          </button>
        </div>
      )}
    </div>
  );

  // Mobile Adaptive Mode: Bottom Sheet + Persistent Audio Mini-Bar when minimized
  if (isMobile) {
    return (
      <>
        {isMobileMinimized && (
          <div
            className="yt-mobile-minibar"
            onClick={() => setIsMobileMinimized(false)}
            role="button"
            tabIndex={0}
            aria-label="Expand YouTube Player"
          >
            <div className="yt-minibar-info">
              <MonitorPlay size={18} color="#4ade80" />
              <span>{url ? 'YouTube Stream Active' : 'YouTube Player'}</span>
            </div>
            <div className="yt-minibar-actions">
              <button
                type="button"
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileMinimized(false);
                }}
                aria-label="Expand YouTube"
              >
                <ChevronUp size={18} />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                aria-label="Close YouTube"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div
          className={`mobile-sheet-backdrop yt-sheet-backdrop ${
            isMobileMinimized ? 'sheet-minimized-hidden' : ''
          }`}
          onClick={() => {
            if (url) {
              setIsMobileMinimized(true);
            } else {
              onClose();
            }
          }}
          role="dialog"
          aria-modal={!isMobileMinimized}
          aria-label="YouTube Player Sheet"
        >
          <div
            className="mobile-bottom-sheet youtube-mobile-sheet"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mobile-sheet-drag-zone">
              <div className="sheet-grabber" />
              <div className="mobile-sheet-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MonitorPlay size={18} color="#4ade80" />
                  <span className="mobile-sheet-title">YouTube Media</span>
                </div>
                <div className="mobile-sheet-actions">
                  {url && (
                    <button
                      type="button"
                      className="btn-sheet-close"
                      onClick={() => setIsMobileMinimized(true)}
                      title="Minimize to Mini-Player"
                      aria-label="Minimize to Mini-Player"
                    >
                      <ChevronDown size={20} />
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn-sheet-close"
                    onClick={onClose}
                    title="Close YouTube"
                    aria-label="Close YouTube"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="mobile-sheet-body">{renderBody()}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <Draggable key={resetKey} nodeRef={nodeRef} handle=".yt-header" bounds="body">
      <div ref={nodeRef} className="youtube-widget" data-adaptive-mode="desktop-draggable">
        <div className="yt-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GripHorizontal size={16} className="drag-handle" />
            <MonitorPlay size={18} color="#4ade80" />
            <span style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>YouTube</span>
          </div>
          <button type="button" onClick={onClose} className="btn-icon" aria-label="Close YouTube">
            <X size={16} />
          </button>
        </div>

        {renderBody()}
      </div>
    </Draggable>
  );
}
