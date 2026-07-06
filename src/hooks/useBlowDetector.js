import { useEffect, useRef, useState } from 'react'
// Hook for blow detection
export default function useBlowDetector() {
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const [isActive, setIsActive] = useState(false);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  const start = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone not supported');
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
    setIsActive(true);
    monitor();
  };

  const stop = () => {
    setIsActive(false);
    setLevel(0);
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (analyserRef.current) analyserRef.current.disconnect();
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const monitor = () => {
    const analyser = analyserRef.current;
    if (!analyser) return;
    const bufferLen = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLen);

    const tick = () => {
      analyser.getByteTimeDomainData(data);
      let sum = 0;
      for (let i = 0; i < bufferLen; i++) {
        const v = (data[i] - 128) / 128;
        sum += v * v;
      }
      const rms = Math.sqrt(sum / bufferLen);
      const volume = Math.min(1, rms * 10);
      setLevel(Math.round(volume * 100));
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();
  };

  return { start, stop, isActive, level };
}