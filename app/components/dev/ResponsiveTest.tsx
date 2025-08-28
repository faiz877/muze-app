'use client';

import React, { useState, useEffect } from 'react';

/**
 * Development utility component for testing responsive breakpoints
 * Only visible in development mode
 */
export const ResponsiveTest: React.FC = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setWindowSize({ width, height });
      
      if (width < 768) {
        setDevice('mobile');
      } else if (width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    handleResize(); // Initial call
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white text-xs rounded-lg p-3 font-mono backdrop-blur-sm">
      <div className="space-y-1">
        <div className="font-semibold">Responsive Debug</div>
        <div>Size: {windowSize.width} × {windowSize.height}</div>
        <div>Device: <span className={`
          px-1.5 py-0.5 rounded text-xs font-medium
          ${device === 'mobile' ? 'bg-red-500' : device === 'tablet' ? 'bg-yellow-500' : 'bg-green-500'}
        `}>
          {device.toUpperCase()}
        </span></div>
        <div className="grid grid-cols-3 gap-1 mt-2 text-[10px]">
          <div className={`p-1 text-center rounded ${device === 'mobile' ? 'bg-red-500' : 'bg-gray-600'}`}>
            &lt;768
          </div>
          <div className={`p-1 text-center rounded ${device === 'tablet' ? 'bg-yellow-500' : 'bg-gray-600'}`}>
            768-1023
          </div>
          <div className={`p-1 text-center rounded ${device === 'desktop' ? 'bg-green-500' : 'bg-gray-600'}`}>
            ≥1024
          </div>
        </div>
      </div>
    </div>
  );
};
