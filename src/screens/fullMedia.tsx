import React, { useEffect, useRef, useState } from 'react';

interface FullMediaProps {
  mediaPath: string;
  mediaType: 'image' | 'video';
  songTitle?: string;
}

const FullMedia: React.FC<FullMediaProps> = ({ mediaPath, mediaType, songTitle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [zoom, setZoom] = useState(1);
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Reset zoom/drag on media change
  useEffect(() => {
    setZoom(1);
    setDrag({ x: 0, y: 0 });
  }, [mediaPath]);

  function handleWheel(e: React.WheelEvent) {
    e.preventDefault();
    setZoom(z => Math.max(0.5, Math.min(4, z - e.deltaY * 0.001)));
  }

  function handleMouseDown(e: React.MouseEvent) {
    setDragStart({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (dragStart) {
      setDrag({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  }

  function handleMouseUp() {
    setDragStart(null);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff', position: 'relative' }}>
      {/* App Bar */}
      <div style={{ height: 56, display: 'flex', alignItems: 'center', background: '#000', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <span style={{ color: '#fff', fontSize: 28, marginLeft: 18, cursor: 'pointer' }} onClick={() => window.history.back()}>&larr;</span>
      </div>
      {/* Media */}
      <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {mediaType === 'image' ? (
          <div
            style={{
              width: '100vw',
              height: '100vh',
              overflow: 'hidden',
              cursor: dragStart ? 'grabbing' : 'grab',
              position: 'relative',
            }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={mediaPath}
              alt="media"
              style={{
                transform: `scale(${zoom}) translate(${drag.x / zoom}px, ${drag.y / zoom}px)`,
                transition: dragStart ? 'none' : 'transform 0.2s',
                maxWidth: '100vw',
                maxHeight: '100vh',
                objectFit: 'contain',
                userSelect: 'none',
                pointerEvents: 'all',
              }}
              draggable={false}
            />
          </div>
        ) : (
          <video
            ref={videoRef}
            src={mediaPath}
            style={{ maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, background: '#000' }}
            controls
            autoPlay
            loop
          />
        )}
        {/* Song title overlay */}
        {songTitle && songTitle.length > 0 && (
          <div style={{ position: 'absolute', left: 16, bottom: 16, background: 'rgba(0,0,0,0.6)', borderRadius: 8, padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 18 }}>🎵</span>
            <span style={{ color: '#fff', fontSize: 15 }}>{songTitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FullMedia; 