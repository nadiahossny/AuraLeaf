import React, { useState, useRef, useEffect } from 'react';
import NoiseMenu from "./NoiseMenu";
import Timer from "./Timer";

// Import audio files
import mountainS from '../assets/sounds/mountain.mp3';
import rainS from '../assets/sounds/rain.mp3';
import forestS from '../assets/sounds/forest.mp3';
import oceanS from '../assets/sounds/ocean.mp3';

import mountainIcon from '../assets/snow-capped.svg';
import oceanIcon from '../assets/wave.svg';
import forestIcon from '../assets/evergreen.svg';
import rainIcon from '../assets/cloud.svg';
import speakerIcon from '../assets/speaker.svg';
import highVolumeIcon from '../assets/high-volume.svg';
import headphoneIcon from '../assets/headphone.svg';

const SCENES = {
  mountain: { id: 'mountain', soundId: 'mountain', label: 'View', icon: mountainIcon },
  ocean:    { id: 'ocean',    soundId: 'ocean', label: 'Ocean', icon: oceanIcon },
  forest:   { id: 'forest',   soundId: 'forest', label: 'Forest', icon: forestIcon },
  rain:     { id: 'rain',     soundId: 'rain', label: 'Rain',   icon: rainIcon } 
};

const NOISES = [
  { id: 'mountain', title: 'Mountain Wind Noise', icon: mountainIcon, desc: 'For deep focus' },
  { id: 'ocean', title: 'Ocean Waves', icon: oceanIcon, desc: 'Soothing' },
  { id: 'forest', title: 'Forest Bird Noise', icon: forestIcon, desc: 'Calming' },
  { id: 'rain', title: 'Rainfall', icon: rainIcon, desc: 'Relaxing' }
];

export default function StudyMode({ name }) {
  const [currentScene, setCurrentScene] = useState('mountain');
  const [playingId, setPlayingId] = useState(null); 
  const [isMuted, setIsMuted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRefs = useRef({
    mountain: new Audio(mountainS),
    ocean: new Audio(oceanS),
    forest: new Audio(forestS),
    rain: new Audio(rainS)
  });

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
      <div className={`app-background bg-${currentScene}`}></div>

      <div className="main-content">
        <Timer />

        <div className="dock-wrapper">
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

            {/* UPDATED: Renamed to Controller */}
            <button className={`dock-btn ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(true)}>
              <img src={headphoneIcon} alt="Controller" className="dock-icon" style={{ width: '1em', height: '1em' }} />
              <span>Controller</span>
            </button>

          </div>
          </div>
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