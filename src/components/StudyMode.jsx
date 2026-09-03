import React, { useState, useRef, useEffect } from 'react';
import NoiseMenu from "./NoiseMenu";
import Timer from "./Timer";
import Sidebar from "./Sidebar";
import { StickyNote, Minimize2, Maximize2, Droplets, RotateCcw, ListTodo, Moon, Leaf, MoreHorizontal, MonitorPlay } from 'lucide-react';
import YouTubeWidget from "./YouTubeWidget";

// Import audio files
import mountainS from '../assets/sounds/mountain.mp3';
import rainS from '../assets/sounds/rain.mp3';
import forestS from '../assets/sounds/forest.mp3';
import oceanS from '../assets/sounds/ocean.mp3';
import brownS from '../assets/sounds/brown.mp3';

// Import bg images
import mountainBg from '../assets/mountain.jpg';
import oceanBg from '../assets/ocean.jpg';
import forestBg from '../assets/forest.jpg';
import rainBg from '../assets/rain.jpg';

import mountainIcon from '../assets/snow-capped.svg';
import oceanIcon from '../assets/wave.svg';
import forestIcon from '../assets/evergreen.svg';
import rainIcon from '../assets/cloud.svg';
import speakerIcon from '../assets/speaker.svg';
import highVolumeIcon from '../assets/high-volume.svg';
import headphoneIcon from '../assets/headphone.svg';

const SCENES = {
  mountain: { id: 'mountain', soundId: 'mountain', label: 'Mountain', icon: mountainIcon, image: mountainBg, overlay: 'rgba(0,0,0,0.4)' },
  ocean:    { id: 'ocean',    soundId: 'ocean', label: 'Ocean', icon: oceanIcon, image: oceanBg, overlay: 'rgba(0,0,0,0.4)' },
  forest:   { id: 'forest',   soundId: 'forest', label: 'Forest', icon: forestIcon, image: forestBg, overlay: 'rgba(0,0,0,0.4)' },
  rain:     { id: 'rain',     soundId: 'rain', label: 'Rain',   icon: rainIcon, image: rainBg, overlay: 'rgba(0,0,0,0.5)' } 
};

const NOISES = [
  { id: 'brown', title: 'White/Brown Noise', icon: headphoneIcon, desc: 'Maximum focus' },
  { id: 'mountain', title: 'Mountain Wind Noise', icon: mountainIcon, desc: 'For deep focus' },
  { id: 'ocean', title: 'Ocean Waves', icon: oceanIcon, desc: 'Soothing' },
  { id: 'forest', title: 'Forest Bird Noise', icon: forestIcon, desc: 'Calming' },
  { id: 'rain', title: 'Rainfall', icon: rainIcon, desc: 'Relaxing' }
];

const WaterRippleBackground = ({ imageUrl, overlay, isRippleEnabled }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (isRippleEnabled && currentContainer && window.$) {
      try {
        window.$(currentContainer).ripples({
          resolution: 384, // Mid-viscosity (between water and thick gel)
          dropRadius: 25, // Slightly larger drop for a heavier feel
          perturbance: 0.015, // Smooth, honey-like refraction
          imageUrl: imageUrl,
        });
      } catch (e) {
        console.error("Ripples failed to initialize:", e);
      }
    }

    return () => {
      if (currentContainer && window.$) {
        try {
          window.$(currentContainer).ripples('destroy');
        } catch (e) {}
      }
    };
  }, [imageUrl, isRippleEnabled]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;
    
    const handleMouseMove = (e) => {
      if (!isRippleEnabled) return;
      // Only trigger ripple if the left mouse button is pressed (dragging)
      if (e.buttons !== 1) return;
      
      if (containerRef.current && window.$) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const distSq = dx * dx + dy * dy;
        
        // Lower distance threshold to create a continuous smooth trail instead of sparse splashes
        if (distSq > 1500) {
          try {
            window.$(containerRef.current).ripples('drop', e.clientX, e.clientY, 25, 0.015);
            lastX = e.clientX;
            lastY = e.clientY;
          } catch (e) {}
        }
      }
    };
    
    // Use capture phase to ensure we catch all movements even if stopped by other elements
    window.addEventListener('mousemove', handleMouseMove, true);
    return () => window.removeEventListener('mousemove', handleMouseMove, true);
  }, [isRippleEnabled]);

  return (
    <div key={`bg-${isRippleEnabled ? 'on' : 'off'}-${imageUrl}`} ref={containerRef} className="water-ripple-bg" style={{ 
      width: '100%', 
      height: '100vh', 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      zIndex: -1,
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: overlay, pointerEvents: 'none' }}></div>
    </div>
  );
};

export default function StudyMode({ name, onExit }) {
  const [currentScene, setCurrentScene] = useState('mountain');
  const [playingId, setPlayingId] = useState(null); 
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState(null);
  const [isRippleEnabled, setIsRippleEnabled] = useState(true);
  const [resetKey, setResetKey] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isZenMode, setIsZenMode] = useState(false);
  const [isManualZenMode, setIsManualZenMode] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);

  const dockRef = useRef(null);
  const audioRefs = useRef(null);
  const activityTimeoutRef = useRef(null);



  // Zen Mode Activity Detection
  useEffect(() => {
    const handleActivity = () => {
      if (isManualZenMode) return; // Do not auto-wake if manual zen mode is active
      
      setIsZenMode(false);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      if (isTimerActive) {
        activityTimeoutRef.current = setTimeout(() => {
          setIsZenMode(true);
          setShowOverflow(false);
        }, 3000); // 3 seconds of inactivity
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    // Initial check
    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [isTimerActive, isManualZenMode]);

  // Initialize audio objects once lazily
  if (!audioRefs.current) {
    audioRefs.current = {
      mountain: new Audio(mountainS),
      ocean: new Audio(oceanS),
      forest: new Audio(forestS),
      rain: new Audio(rainS),
      brown: new Audio(brownS)
    };
  }

  // Cleanup audios on unmount
  useEffect(() => {
    const audios = audioRefs.current;
    return () => {
      if (audios) {
        Object.values(audios).forEach(audio => {
          if (audio.playPromise) {
            audio.playPromise.then(() => audio.pause()).catch(() => {});
          } else {
            audio.pause();
          }
        });
      }
    };
  }, []);

  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.loop = true;
      audio.volume = volume;
    });
  }, [volume]);

  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  const playSound = (id) => {
    Object.keys(audioRefs.current).forEach(key => {
      if (key !== id) {
        const audio = audioRefs.current[key];
        if (audio.playPromise) {
          audio.playPromise.then(() => {
            audio.pause();
            audio.currentTime = 0;
          }).catch(() => {});
        } else {
          audio.pause();
          audio.currentTime = 0;
        }
      }
    });
    if (audioRefs.current[id]) {
      const audio = audioRefs.current[id];
      audio.volume = isMuted ? 0 : volume;
      audio.playPromise = audio.play();
      if (audio.playPromise !== undefined) {
        audio.playPromise.catch(e => console.log("Play error:", e));
      }
      setPlayingId(id);
    }
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach(audio => {
      if (audio.playPromise) {
        audio.playPromise.then(() => {
          audio.pause();
          audio.currentTime = 0;
        }).catch(() => {});
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    });
    setPlayingId(null);
  };

  const handleSceneChange = (sceneKey) => {
    setCurrentScene(sceneKey);
    const soundToPlay = SCENES[sceneKey].soundId;
    if (soundToPlay) {
      playSound(soundToPlay);
    }
  };

  const cycleAmbience = () => {
    const sceneKeys = Object.keys(SCENES);
    const currentIndex = sceneKeys.indexOf(currentScene);
    const nextIndex = (currentIndex + 1) % sceneKeys.length;
    handleSceneChange(sceneKeys[nextIndex]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const isChromeHidden = isZenMode || isManualZenMode;

  return (
    <>
      <WaterRippleBackground imageUrl={SCENES[currentScene].image} overlay={SCENES[currentScene].overlay} isRippleEnabled={isRippleEnabled} />
      
      {/* Background Dimming for Active Sessions */}
      <div className={`dim-overlay ${isTimerActive ? 'active' : ''}`}></div>

      {/* Top Left Branding Badge */}
      <div 
        className="header-brand-badge" 
        onClick={onExit}
        style={{ opacity: isChromeHidden ? 0 : 1, pointerEvents: isChromeHidden ? 'none' : 'auto', cursor: 'pointer' }}
        title="End Session"
      >
        <Leaf size={20} className="logo-icon" color="#4ade80" />
        AuraLeaf
      </div>

      <div className={`main-content ${isManualZenMode ? 'zen-mode' : ''} ${activeSidebarTab ? 'sidebar-open' : ''}`}>
        <Timer resetKey={resetKey} onTimerStateChange={setIsTimerActive} isManualZenMode={isManualZenMode} />
        
        {(isManualZenMode) && (
          <button 
            className="btn-exit-zen" 
            onClick={() => {
              setIsManualZenMode(false);
              setIsZenMode(false);
            }}
          >
            Exit Focus Mode
          </button>
        )}

        <div className={`floating-tools-container ${isChromeHidden ? 'zen-mode-hidden' : ''}`}>
          <Sidebar activeTab={activeSidebarTab} setActiveTab={setActiveSidebarTab} />
          {showYouTube && <YouTubeWidget resetKey={resetKey} onClose={() => setShowYouTube(false)} />}
        </div>

        {isDockMinimized ? (
          <div ref={dockRef} className={`dock-minimized ${isChromeHidden ? 'zen-mode-hidden' : ''}`} onClick={() => setIsDockMinimized(false)}>
             <Maximize2 size={20} />
             <span>Dock</span>
          </div>
        ) : (
          <div ref={dockRef} className={`dock-wrapper ${isChromeHidden ? 'zen-mode-hidden' : ''}`}>
              <div className="control-dock">
                
                {/* Ambience Toggle */}
                <button className="dock-btn" onClick={cycleAmbience} title="Cycle Ambience">
                  <img src={SCENES[currentScene].icon} alt="Ambience" className="dock-icon" style={{ width: '1em', height: '1em' }} />
                </button>

                <div className="dock-divider"></div>

                {/* Controller */}
                <button className={`dock-btn ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)} title="Sound Controller">
                  <img src={headphoneIcon} alt="Controller" className="dock-icon" style={{ width: '1.2em', height: '1.2em' }} />
                </button>

                {/* Mute */}
                <button className={`dock-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute All'}>
                  <img src={isMuted ? speakerIcon : highVolumeIcon} alt={isMuted ? 'Unmute' : 'Mute'} className="dock-icon" style={{ width: '1em', height: '1em' }} />
                </button>

                <div className="dock-divider"></div>

                {/* Overflow Menu Button */}
                <div className="overflow-menu-container">
                  <button className={`dock-btn ${showOverflow ? 'active' : ''}`} onClick={() => setShowOverflow(!showOverflow)} title="More Tools">
                    <MoreHorizontal size={22} className="dock-icon-lucide" />
                  </button>

                  {/* Overflow Popover */}
                  {showOverflow && (
                    <div className="overflow-menu-popup">
                      <button className={`dock-btn ${activeSidebarTab === 'notes' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab(activeSidebarTab === 'notes' ? null : 'notes'); setShowOverflow(false); }}>
                        <StickyNote size={18} className="dock-icon-lucide" />
                        <span>Notes</span>
                      </button>
                      <button className={`dock-btn ${activeSidebarTab === 'todo' ? 'active' : ''}`} onClick={() => { setActiveSidebarTab(activeSidebarTab === 'todo' ? null : 'todo'); setShowOverflow(false); }}>
                        <ListTodo size={18} className="dock-icon-lucide" />
                        <span>To Do</span>
                      </button>
                      <button className={`dock-btn ${showYouTube ? 'active' : ''}`} onClick={() => { setShowYouTube(!showYouTube); setShowOverflow(false); }}>
                        <MonitorPlay size={18} className="dock-icon-lucide" />
                        <span>YouTube</span>
                      </button>
                      <button className={`dock-btn ${isManualZenMode ? 'active' : ''}`} onClick={() => { setIsManualZenMode(true); setShowOverflow(false); }}>
                        <Moon size={18} className="dock-icon-lucide" />
                        <span>Focus Mode</span>
                      </button>
                      <button className={`dock-btn ${isRippleEnabled ? 'active' : ''}`} onClick={() => { setIsRippleEnabled(!isRippleEnabled); setShowOverflow(false); }}>
                        <Droplets size={18} className="dock-icon-lucide" />
                        <span>{isRippleEnabled ? 'Ripple On' : 'Ripple Off'}</span>
                      </button>
                      <button className="dock-btn" onClick={() => { 
                        setResetKey(prev => prev + 1); 
                        setActiveSidebarTab(null);
                        setShowYouTube(false);
                        setIsDockMinimized(false);
                        setShowOverflow(false); 
                      }}>
                        <RotateCcw size={18} className="dock-icon-lucide" />
                        <span>Reset Layout</span>
                      </button>
                      <button className="dock-btn" onClick={() => { setIsDockMinimized(true); setShowOverflow(false); }}>
                        <Minimize2 size={18} className="dock-icon-lucide" />
                        <span>Minimize Dock</span>
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}
      </div>

      {menuOpen && (
        <NoiseMenu 
          onClose={() => setMenuOpen(false)} 
          playingId={playingId}
          toggleSound={(id) => {
            if (playingId === id) stopAll();
            else playSound(id);
          }}
          volume={volume}
          setVolume={setVolume}
          noises={NOISES}
        />
      )}
    </>
  );
}