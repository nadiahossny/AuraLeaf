import { useState, useEffect, useCallback } from 'react';

export function getDeviceState() {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isTouchDevice: false,
      isCoarsePointer: false,
      isLandscapeMobile: false,
      prefersReducedMotion: false,
      viewportWidth: 1440,
      viewportHeight: 900,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const isCoarse = Boolean(window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  const hasTouch =
    isCoarse ||
    'ontouchstart' in window ||
    (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0);
  const reducedMotion = Boolean(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  let deviceType = 'desktop';
  if (width < 768) {
    deviceType = 'mobile';
  } else if (width <= 1024) {
    deviceType = 'tablet';
  }

  const isLandscapeMobile = height < 520 && width > height;

  return {
    deviceType,
    isMobile: deviceType === 'mobile' || isLandscapeMobile,
    isTablet: deviceType === 'tablet' && !isLandscapeMobile,
    isDesktop: deviceType === 'desktop' && !isLandscapeMobile,
    isTouchDevice: hasTouch,
    isCoarsePointer: isCoarse,
    isLandscapeMobile,
    prefersReducedMotion: reducedMotion,
    viewportWidth: width,
    viewportHeight: height,
  };
}

export function useAdaptiveDevice() {
  const [state, setState] = useState(getDeviceState);

  const handleUpdate = useCallback(() => {
    setState(getDeviceState());
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('orientationchange', handleUpdate);

    const coarseQuery = window.matchMedia ? window.matchMedia('(pointer: coarse)') : null;
    if (coarseQuery && coarseQuery.addEventListener) {
      coarseQuery.addEventListener('change', handleUpdate);
    }

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('orientationchange', handleUpdate);
      if (coarseQuery && coarseQuery.removeEventListener) {
        coarseQuery.removeEventListener('change', handleUpdate);
      }
    };
  }, [handleUpdate]);

  return state;
}

export default useAdaptiveDevice;
