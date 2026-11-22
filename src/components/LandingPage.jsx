import React from 'react';
import { Play, Leaf } from 'lucide-react';
import mountainBg from '../assets/mountain.jpg';
import { useAdaptiveDevice } from '../hooks/useAdaptiveDevice';

export default function LandingPage({ onStart }) {
  const { deviceType, isMobile } = useAdaptiveDevice();

  return (
    <div
      className={`landing-page ${isMobile ? 'landing-page-mobile' : ''}`}
      data-device-type={deviceType}
    >
      <div
        className="landing-bg"
        style={{ backgroundImage: `url(${mountainBg})` }}
      ></div>
      <div className="landing-overlay"></div>

      <div className="landing-content">
        <div className="logo-container">
          <Leaf
            className="logo-icon"
            size={isMobile ? 32 : 40}
            color="var(--accent, #4ade80)"
            style={{ color: 'var(--accent, #4ade80)' }}
          />
          <h1>AuraLeaf</h1>
        </div>

        <h2>Your Unified Study Space.</h2>
        <p>Eliminate distractions. Lock in. Achieve more.</p>

        <button className="start-btn" onClick={onStart}>
          <Play size={20} className="start-icon" />
          <span>Start Studying</span>
        </button>
      </div>
    </div>
  );
}
