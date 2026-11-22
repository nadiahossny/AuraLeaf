import React, { useState, useRef, useEffect } from 'react';
import NoiseMenu from './NoiseMenu';
import Timer from './Timer';
import Sidebar from './Sidebar';
import {
  StickyNote,
  Minimize2,
  Maximize2,
  Droplets,
  RotateCcw,
  ListTodo,
  Moon,
  MoreHorizontal,
  MonitorPlay,
  MountainSnow,
  Waves,
  TreePine,
  CloudRain,
  VolumeX,
  Volume2,
  Headphones,
  Leaf,
} from 'lucide-react';
import YouTubeWidget from './YouTubeWidget';
import { useAdaptiveDevice } from '../hooks/useAdaptiveDevice';

// Import audio files
import mountainS from '../assets/sounds/mountain.mp3';
import rainS from '../assets/sounds/rain.mp3';
import forestS from '../assets/sounds/forest.mp3';
import oceanS from '../assets/sounds/ocean.mp3';
import brownS from '../assets/sounds/brown.mp3';

import mountainBg from '../assets/mountain.jpg';
import oceanBg from '../assets/ocean.jpg';
import forestBg from '../assets/forest.jpg';
import rainBg from '../assets/rain.jpg';

const SCENES = {
  mountain: {
    id: 'mountain',
    soundId: 'mountain',
    label: 'Mountain',
    icon: MountainSnow,
    image: mountainBg,
    overlay: 'rgba(0,0,0,0.4)',
  },
  ocean: {
    id: 'ocean',
    soundId: 'ocean',
    label: 'Ocean',
    icon: Waves,
    image: oceanBg,
    overlay: 'rgba(0,0,0,0.4)',
  },
  forest: {
    id: 'forest',
    soundId: 'forest',
    label: 'Forest',
    icon: TreePine,
    image: forestBg,
    overlay: 'rgba(0,0,0,0.4)',
  },
  rain: {
    id: 'rain',
    soundId: 'rain',
    label: 'Rain',
    icon: CloudRain,
    image: rainBg,
    overlay: 'rgba(0,0,0,0.5)',
  },
};

const NOISES = [
  { id: 'brown', title: 'White/Brown Noise', icon: Headphones, desc: 'Maximum focus' },
  { id: 'mountain', title: 'Mountain Wind Noise', icon: MountainSnow, desc: 'For deep focus' },
  { id: 'ocean', title: 'Ocean Waves', icon: Waves, desc: 'Soothing' },
  { id: 'forest', title: 'Forest Bird Noise', icon: TreePine, desc: 'Calming' },
  { id: 'rain', title: 'Rainfall', icon: CloudRain, desc: 'Relaxing' },
];

const WaterRippleBackground = ({ imageUrl, overlay, isRippleEnabled, deviceType }) => {
  const containerRef = useRef(null);

  const rippleConfig = React.useMemo(() => {
    if (deviceType === 'mobile') {
      return { resolution: 192, dropRadius: 18, perturbance: 0.012 };
    }
    if (deviceType === 'tablet') {
      return { resolution: 256, dropRadius: 22, perturbance: 0.014 };
    }
    return { resolution: 384, dropRadius: 25, perturbance: 0.015 };
  }, [deviceType]);

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (isRippleEnabled && currentContainer && window.$) {
      try {
        window.$(currentContainer).ripples({
          resolution: rippleConfig.resolution,
          dropRadius: rippleConfig.dropRadius,
          perturbance: rippleConfig.perturbance,
          imageUrl: imageUrl,
        });
      } catch (e) {
        console.error('Ripples failed to initialize:', e);
      }
    }

    return () => {
      if (currentContainer && window.$) {
        try {
          window.$(currentContainer).ripples('destroy');
        } catch (e) {}
      }
    };
  }, [imageUrl, isRippleEnabled, rippleConfig]);

  useEffect(() => {
    let lastX = 0;
    let lastY = 0;

    const triggerDrop = (clientX, clientY) => {
      if (!containerRef.current || !window.$) return;
      const dx = clientX - lastX;
      const dy = clientY - lastY;
      const distSq = dx * dx + dy * dy;

      if (distSq > 1200) {
        try {
          window
            .$(containerRef.current)
            .ripples('drop', clientX, clientY, rippleConfig.dropRadius, rippleConfig.perturbance);
          lastX = clientX;
          lastY = clientY;
        } catch (e) {}
      }
    };

    const handleMouseMove = (e) => {
      if (!isRippleEnabled || e.buttons !== 1) return;
      triggerDrop(e.clientX, e.clientY);
    };

    const handleTouchStart = (e) => {
      if (!isRippleEnabled || !e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      triggerDrop(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isRippleEnabled || !e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      triggerDrop(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, true);
    window.addEventListener('touchstart', handleTouchStart, { passive: true, capture: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true, capture: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove, true);
      window.removeEventListener('touchstart', handleTouchStart, true);
      window.removeEventListener('touchmove', handleTouchMove, true);
    };
  }, [isRippleEnabled, rippleConfig]);

  return (
    <div
      key={`bg-${isRippleEnabled ? 'on' : 'off'}-${deviceType}-${imageUrl}`}
      ref={containerRef}
      className="water-ripple-bg"
      data-ripple-resolution={rippleConfig.resolution}
      style={{
        width: '100%',
        height: '100dvh',
        minHeight: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: -1,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: overlay,
          pointerEvents: 'none',
        }}
      ></div>
    </div>
  );
};

export default function StudyMode({ name, onExit }) {
  const { deviceType, isMobile, isLandscapeMobile } = useAdaptiveDevice();

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

  // Handle click/tap outside to close overflow menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dockRef.current && !dockRef.current.contains(event.target)) {
        setShowOverflow(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Zen Mode Activity Detection (Mouse, Keyboard, and Touch)
  useEffect(() => {
    const handleActivity = () => {
      if (isManualZenMode) return;

      setIsZenMode(false);
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
      if (isTimerActive) {
        activityTimeoutRef.current = setTimeout(() => {
          setIsZenMode(true);
          setShowOverflow(false);
        }, 3000);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);
    window.addEventListener('touchstart', handleActivity, { passive: true });

    handleActivity();

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
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
      brown: new Audio(brownS),
    };
  }

  // Cleanup audios on unmount
  useEffect(() => {
    const audios = audioRefs.current;
    return () => {
      if (audios) {
        Object.values(audios).forEach((audio) => {
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
    Object.values(audioRefs.current).forEach((audio) => {
      audio.loop = true;
      audio.volume = volume;
    });
  }, [volume]);

  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.volume = isMuted ? 0 : volume;
    });
  }, [volume, isMuted]);

  const playSound = (id) => {
    Object.keys(audioRefs.current).forEach((key) => {
      if (key !== id) {
        const audio = audioRefs.current[key];
        if (audio.playPromise) {
          audio.playPromise
            .then(() => {
              audio.pause();
              audio.currentTime = 0;
            })
            .catch(() => {});
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
        audio.playPromise.catch((e) => console.log('Play error:', e));
      }
      setPlayingId(id);
    }
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      if (audio.playPromise) {
        audio.playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
          })
          .catch(() => {});
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
    <div
      className={`study-workspace-shell device-${deviceType} ${
        isLandscapeMobile ? 'landscape-mobile' : ''
      }`}
      data-device-type={deviceType}
    >
      <WaterRippleBackground
        imageUrl={SCENES[currentScene].image}
        overlay={SCENES[currentScene].overlay}
        isRippleEnabled={isRippleEnabled}
        deviceType={deviceType}
      />

      {/* Background Dimming for Active Sessions */}
      <div className={`dim-overlay ${isTimerActive ? 'active' : ''}`}></div>

      {/* Top Left Branding Badge */}
      <div
        className="header-brand-badge"
        onClick={onExit}
        style={{
          opacity: isChromeHidden ? 0 : 1,
          pointerEvents: isChromeHidden ? 'none' : 'auto',
          cursor: 'pointer',
        }}
        title="End Session"
      >
        <Leaf
          className="logo-icon"
          size={isMobile ? 18 : 20}
          color="var(--accent, #4ade80)"
          style={{ marginRight: '8px', color: 'var(--accent, #4ade80)' }}
        />
        AuraLeaf
      </div>

      <div
        className={`main-content ${isManualZenMode ? 'zen-mode' : ''} ${
          activeSidebarTab ? 'sidebar-open' : ''
        }`}
      >
        <Timer
          resetKey={resetKey}
          onTimerStateChange={setIsTimerActive}
          isManualZenMode={isManualZenMode}
          onOpenTodo={() => setActiveSidebarTab('todo')}
        />

        {isManualZenMode && (
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
          {showYouTube && (
            <YouTubeWidget resetKey={resetKey} onClose={() => setShowYouTube(false)} />
          )}
        </div>

        {isDockMinimized ? (
          <div
            ref={dockRef}
            className={`dock-minimized ${isChromeHidden ? 'zen-mode-hidden' : ''}`}
            onClick={() => setIsDockMinimized(false)}
          >
            <Maximize2 size={20} />
            <span>Dock</span>
          </div>
        ) : (
          <div
            ref={dockRef}
            className={`dock-wrapper ${isMobile ? 'dock-wrapper-mobile' : ''} ${
              isChromeHidden ? 'zen-mode-hidden' : ''
            }`}
          >
            <div className={`control-dock ${isMobile ? 'control-dock-mobile' : ''}`}>
              {/* Ambience Toggle */}
              <button
                className="dock-btn"
                onClick={cycleAmbience}
                title={`Cycle Ambience (${SCENES[currentScene].label})`}
                aria-label={`Cycle Ambience (${SCENES[currentScene].label})`}
              >
                {React.createElement(SCENES[currentScene].icon, {
                  className: 'dock-icon-lucide',
                  size: 22,
                })}
                {isMobile && <span className="dock-mobile-label">{SCENES[currentScene].label}</span>}
              </button>

              <div className="dock-divider"></div>

              {/* Sound Controller */}
              <button
                className={`dock-btn ${menuOpen ? 'active' : ''}`}
                onClick={() => setMenuOpen(!menuOpen)}
                title="Sound Controller"
                aria-label="Sound Controller"
              >
                <Headphones className="dock-icon-lucide" size={22} />
                {isMobile && <span className="dock-mobile-label">Sounds</span>}
              </button>

              {/* Mobile Quick-Access Tasks & Notes Button in Thumb Bar */}
              {isMobile && (
                <button
                  className={`dock-btn ${activeSidebarTab ? 'active' : ''}`}
                  onClick={() =>
                    setActiveSidebarTab(activeSidebarTab ? null : 'todo')
                  }
                  title="Tasks & Notes"
                  aria-label="Tasks & Notes"
                >
                  <ListTodo className="dock-icon-lucide" size={22} />
                  <span className="dock-mobile-label">Tasks</span>
                </button>
              )}

              {/* Mute */}
              <button
                className={`dock-btn ${isMuted ? 'active' : ''}`}
                onClick={toggleMute}
                title={isMuted ? 'Unmute' : 'Mute All'}
                aria-label={isMuted ? 'Unmute' : 'Mute All'}
              >
                {isMuted ? (
                  <VolumeX className="dock-icon-lucide" size={22} />
                ) : (
                  <Volume2 className="dock-icon-lucide" size={22} />
                )}
                {isMobile && <span className="dock-mobile-label">{isMuted ? 'Muted' : 'Audio'}</span>}
              </button>

              <div className="dock-divider"></div>

              {/* Overflow Menu Button */}
              <div className="overflow-menu-container">
                <button
                  className={`dock-btn ${showOverflow ? 'active' : ''}`}
                  onClick={() => setShowOverflow(!showOverflow)}
                  title="More Tools"
                  aria-label="More Tools"
                >
                  <MoreHorizontal size={22} className="dock-icon-lucide" />
                  {isMobile && <span className="dock-mobile-label">More</span>}
                </button>

                {/* Overflow Popover */}
                {showOverflow && (
                  <div
                    className={`overflow-menu-popup ${
                      isMobile ? 'overflow-menu-popup-mobile' : ''
                    }`}
                  >
                    <button
                      className={`dock-btn ${activeSidebarTab === 'notes' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSidebarTab(activeSidebarTab === 'notes' ? null : 'notes');
                        setShowOverflow(false);
                      }}
                    >
                      <StickyNote size={18} className="dock-icon-lucide" />
                      <span>Notes</span>
                    </button>
                    <button
                      className={`dock-btn ${activeSidebarTab === 'todo' ? 'active' : ''}`}
                      onClick={() => {
                        setActiveSidebarTab(activeSidebarTab === 'todo' ? null : 'todo');
                        setShowOverflow(false);
                      }}
                    >
                      <ListTodo size={18} className="dock-icon-lucide" />
                      <span>To Do</span>
                    </button>
                    <button
                      className={`dock-btn ${showYouTube ? 'active' : ''}`}
                      onClick={() => {
                        setShowYouTube(!showYouTube);
                        setShowOverflow(false);
                      }}
                    >
                      <MonitorPlay size={18} className="dock-icon-lucide" />
                      <span>YouTube</span>
                    </button>
                    <button
                      className={`dock-btn ${isManualZenMode ? 'active' : ''}`}
                      onClick={() => {
                        setIsManualZenMode(true);
                        setShowOverflow(false);
                      }}
                    >
                      <Moon size={18} className="dock-icon-lucide" />
                      <span>Focus Mode</span>
                    </button>
                    <button
                      className={`dock-btn ${isRippleEnabled ? 'active' : ''}`}
                      onClick={() => {
                        setIsRippleEnabled(!isRippleEnabled);
                        setShowOverflow(false);
                      }}
                    >
                      <Droplets size={18} className="dock-icon-lucide" />
                      <span>{isRippleEnabled ? 'Ripple On' : 'Ripple Off'}</span>
                    </button>
                    {!isMobile && (
                      <button
                        className="dock-btn"
                        onClick={() => {
                          setResetKey((prev) => prev + 1);
                          setActiveSidebarTab(null);
                          setShowYouTube(false);
                          setIsDockMinimized(false);
                          setShowOverflow(false);
                        }}
                      >
                        <RotateCcw size={18} className="dock-icon-lucide" />
                        <span>Reset Layout</span>
                      </button>
                    )}
                    <button
                      className="dock-btn"
                      onClick={() => {
                        setIsDockMinimized(true);
                        setShowOverflow(false);
                      }}
                    >
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
    </div>
  );
}
