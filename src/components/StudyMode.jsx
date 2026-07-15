import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Draggable from 'react-draggable';
import NoiseMenu from "./NoiseMenu";
import Timer from "./Timer";
import YoutubeWidget from "./YoutubeWidget";
import StickyNotes from "./StickyNotes";
import { MonitorPlay, StickyNote, Minimize2, Maximize2, Droplets } from 'lucide-react';

// Import audio files
import mountainS from '../assets/sounds/mountain.mp3';
import rainS from '../assets/sounds/rain.mp3';
import forestS from '../assets/sounds/forest.mp3';
import oceanS from '../assets/sounds/ocean.mp3';

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
  mountain: { id: 'mountain', soundId: 'mountain', label: 'View', icon: mountainIcon, image: mountainBg, overlay: 'rgba(0,0,0,0.4)' },
  ocean:    { id: 'ocean',    soundId: 'ocean', label: 'Ocean', icon: oceanIcon, image: oceanBg, overlay: 'rgba(0,0,0,0.4)' },
  forest:   { id: 'forest',   soundId: 'forest', label: 'Forest', icon: forestIcon, image: forestBg, overlay: 'rgba(0,0,0,0.4)' },
  rain:     { id: 'rain',     soundId: 'rain', label: 'Rain',   icon: rainIcon, image: rainBg, overlay: 'rgba(0,0,0,0.5)' } 
};

const NOISES = [
  { id: 'mountain', title: 'Mountain Wind Noise', icon: mountainIcon, desc: 'For deep focus' },
  { id: 'ocean', title: 'Ocean Waves', icon: oceanIcon, desc: 'Soothing' },
  { id: 'forest', title: 'Forest Bird Noise', icon: forestIcon, desc: 'Calming' },
  { id: 'rain', title: 'Rainfall', icon: rainIcon, desc: 'Relaxing' }
];

const WaterRippleBackground = ({ imageUrl, overlay, isRippleEnabled }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (isRippleEnabled && containerRef.current && window.$) {
      try {
        window.$(containerRef.current).ripples({
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
      if (containerRef.current && window.$) {
        try {
          window.$(containerRef.current).ripples('destroy');
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
    <div ref={containerRef} className="water-ripple-bg" style={{ 
      width: '100vw', 
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

export default function StudyMode({ name }) {
  const [currentScene, setCurrentScene] = useState('mountain');
  const [playingId, setPlayingId] = useState(null); 
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isDockMinimized, setIsDockMinimized] = useState(false);
  const [showYoutube, setShowYoutube] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [isRippleEnabled, setIsRippleEnabled] = useState(true);

  const dockRef = useRef(null);
  const audioRefs = useRef(null);

  // Initialize audio objects once lazily
  if (!audioRefs.current) {
    audioRefs.current = {
      mountain: new Audio(mountainS),
      ocean: new Audio(oceanS),
      forest: new Audio(forestS),
      rain: new Audio(rainS)
    };
  }

  // Cleanup audios on unmount
  useEffect(() => {
    const audios = audioRefs.current;
    return () => {
      if (audios) {
        Object.values(audios).forEach(audio => {
          audio.pause();
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
        audioRefs.current[key].pause();
        audioRefs.current[key].currentTime = 0;
      }
    });
    if (audioRefs.current[id]) {
      const audio = audioRefs.current[id];
      audio.volume = isMuted ? 0 : volume;
      audio.play().catch(e => console.log("Play error:", e));
      setPlayingId(id);
    }
  };

  const stopAll = () => {
    Object.values(audioRefs.current).forEach(a => {
      a.pause();
      a.currentTime = 0;
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

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <>
      <WaterRippleBackground imageUrl={SCENES[currentScene].image} overlay={SCENES[currentScene].overlay} isRippleEnabled={isRippleEnabled} />

      <div className="main-content">
        <Timer />
        
        {showYoutube && <YoutubeWidget onClose={() => setShowYoutube(false)} />}
        {showNotes && <StickyNotes onClose={() => setShowNotes(false)} />}

        <Draggable nodeRef={dockRef} handle={isDockMinimized ? null : ".control-dock"} bounds="body" cancel=".no-drag">
          {isDockMinimized ? (
            <div ref={dockRef} className="dock-minimized" onClick={() => setIsDockMinimized(false)}>
               <Maximize2 size={20} />
               <span>Dock</span>
            </div>
          ) : (
            <div ref={dockRef} className="dock-wrapper">
              <div className="control-dock">
                
                {Object.values(SCENES).map((scene) => (
                  <button 
                    key={scene.id}
                    className={`dock-btn ${currentScene === scene.id ? 'active' : ''}`}
                    onClick={() => handleSceneChange(scene.id)}
                  >
                    <img src={scene.icon} alt={scene.label} className="dock-icon" style={{ width: '1em', height: '1em' }} />
                    <span>{scene.label}</span>
                  </button>
                ))}

                <div className="dock-divider"></div>

                <button className={`dock-btn ${isMuted ? 'active' : ''}`} onClick={toggleMute}>
                  <img src={isMuted ? speakerIcon : highVolumeIcon} alt={isMuted ? 'Unmute' : 'Mute'} className="dock-icon" style={{ width: '1em', height: '1em' }} />
                  <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button className={`dock-btn ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(true)}>
                  <img src={headphoneIcon} alt="Controller" className="dock-icon" style={{ width: '1em', height: '1em' }} />
                  <span>Controller</span>
                </button>

                <div className="dock-divider"></div>

                <button className={`dock-btn ${isRippleEnabled ? 'active' : ''}`} onClick={() => setIsRippleEnabled(!isRippleEnabled)}>
                  <Droplets size={22} className="dock-icon-lucide" />
                  <span>{isRippleEnabled ? 'Ripple On' : 'Ripple Off'}</span>
                </button>
                <button className={`dock-btn ${showYoutube ? 'active' : ''}`} onClick={() => setShowYoutube(!showYoutube)}>
                  <MonitorPlay size={22} className="dock-icon-lucide" />
                  <span>YouTube</span>
                </button>
                <button className={`dock-btn ${showNotes ? 'active' : ''}`} onClick={() => setShowNotes(!showNotes)}>
                  <StickyNote size={22} className="dock-icon-lucide" />
                  <span>Notes</span>
                </button>
                <button className="dock-btn" onClick={() => setIsDockMinimized(true)}>
                  <Minimize2 size={22} className="dock-icon-lucide" />
                  <span>Minimize</span>
                </button>

              </div>
            </div>
          )}
        </Draggable>
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