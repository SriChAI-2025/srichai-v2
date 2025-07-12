import React, { useState, useRef, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  className?: string;
  isNeoBrutalism?: boolean;
}

const ZoomableImage: React.FC<ZoomableImageProps> = ({
  src,
  alt,
  className = '',
  isNeoBrutalism = false
}) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.2;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const delta = e.deltaY * -0.01;
      const newScale = Math.min(Math.max(MIN_SCALE, scale + delta), MAX_SCALE);
      
      if (newScale !== scale) {
        // Zoom towards mouse position
        const scaleFactor = newScale / scale;
        const newX = x - (x - position.x) * scaleFactor;
        const newY = y - (y - position.y) * scaleFactor;
        
        setScale(newScale);
        setPosition({ x: newX, y: newY });
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale, position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setLastPanPoint({ x: position.x, y: position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    setPosition({
      x: lastPanPoint.x + deltaX,
      y: lastPanPoint.y + deltaY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    const newScale = Math.min(scale + ZOOM_STEP, MAX_SCALE);
    setScale(newScale);
  };

  const zoomOut = () => {
    const newScale = Math.max(scale - ZOOM_STEP, MIN_SCALE);
    setScale(newScale);
    
    // Reset position when zooming out to 1x or less
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const fitToScreen = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const buttonClass = isNeoBrutalism 
    ? "neo-button-icon p-2 text-white bg-blue-600 border-2 border-black hover:bg-blue-700" 
    : "p-2 bg-black/70 text-white rounded-full hover:bg-black/80 transition-colors";

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      {/* Image */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        className="absolute top-0 left-0 transition-transform duration-200 ease-out select-none"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
          transformOrigin: 'center center'
        }}
        onLoad={fitToScreen}
        draggable={false}
      />

      {/* Zoom Controls */}
      <div className="absolute top-2 right-2 flex flex-col space-y-1 z-10">
        <button
          onClick={zoomIn}
          disabled={scale >= MAX_SCALE}
          className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        
        <button
          onClick={zoomOut}
          disabled={scale <= MIN_SCALE}
          className={`${buttonClass} disabled:opacity-50 disabled:cursor-not-allowed`}
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        
        <button
          onClick={resetZoom}
          className={buttonClass}
          title="Reset Zoom"
        >
          <RotateCcw className="h-4 w-4" />
        </button>
        
        <button
          onClick={fitToScreen}
          className={buttonClass}
          title="Reset View"
        >
          <Maximize className="h-4 w-4" />
        </button>
      </div>

      {/* Zoom Level Indicator */}
      <div className="absolute bottom-2 left-2 z-10">
        <div className={`px-2 py-1 rounded text-xs font-medium ${
          isNeoBrutalism 
            ? 'bg-blue-600 text-white border-2 border-black font-bold' 
            : 'bg-black/70 text-white'
        }`}>
          {Math.round(scale * 100)}%
        </div>
      </div>

      {/* Instructions */}
      {scale > 1 && (
        <div className="absolute bottom-2 right-2 z-10">
          <div className={`px-2 py-1 rounded text-xs ${
            isNeoBrutalism 
              ? 'bg-gray-800 text-white border-2 border-black font-bold' 
              : 'bg-black/70 text-white'
          }`}>
            Drag to pan
          </div>
        </div>
      )}
    </div>
  );
};

export default ZoomableImage; 