import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const HlsPlayer = ({ src, poster, autoPlay = false }) => {
  const videoRef = useRef(null);
  const [levels, setLevels] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(-1); // -1 is Auto
  const [hlsInstance, setHlsInstance] = useState(null);

  useEffect(() => {
    let hls = null;
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      hls = new Hls({
        capLevelToPlayerSize: true,
        maxBufferLength: 30
      });
      hls.loadSource(src);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        setLevels(hls.levels || []);
        if (autoPlay) {
          video.play().catch(() => {});
        }
      });

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        setCurrentLevel(hls.currentLevel);
      });

      setHlsInstance(hls);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari support
      video.src = src;
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, autoPlay]);

  const handleLevelChange = (e) => {
    const idx = parseInt(e.target.value);
    setCurrentLevel(idx);
    if (hlsInstance) {
      hlsInstance.currentLevel = idx;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', background: '#000' }}>
      <video
        ref={videoRef}
        poster={poster}
        controls
        playsInline
        style={{ width: '100%', display: 'block', maxHeight: '480px' }}
      />
      {levels.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 10,
          background: 'rgba(15, 23, 42, 0.75)',
          padding: '4px 8px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '11px',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <i className="fas fa-cog"></i>
          <select
            value={currentLevel}
            onChange={handleLevelChange}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              fontSize: '11px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="-1" style={{ background: '#0F172A' }}>Auto Quality</option>
            {levels.map((lvl, idx) => (
              <option key={idx} value={idx} style={{ background: '#0F172A' }}>
                {lvl.height}p ({Math.round(lvl.bitrate / 1000)}kbps)
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default HlsPlayer;
