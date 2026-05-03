'use client';

import { useEffect, useState } from 'react';

interface ProgressBarProps {
  progress: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'error';
}

const ProgressBar = ({ progress, showLabel = true, size = 'md', color = 'primary' }: ProgressBarProps) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(Math.min(Math.max(progress, 0), 100));
    }, 50);
    return () => clearTimeout(timer);
  }, [progress]);

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const containerStyle: React.CSSProperties = {
    width: '100%',
    backgroundColor: '#e2e7ff',
    borderRadius: '9999px',
    overflow: 'hidden',
  };

  const barStyle: React.CSSProperties = {
    width: animatedProgress + '%',
    height: '100%',
    backgroundColor: color === 'primary' ? '#0050cb' : color === 'secondary' ? '#006b5d' : '#ba1a1a',
    borderRadius: '9999px',
    transition: 'width 0.3s ease-out',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-on-surface">Progress</span>
          <span className="text-sm text-on-surface-variant">{Math.round(animatedProgress)}%</span>
        </div>
      )}
      <div className={heightClasses[size]} style={containerStyle}>
        <div style={barStyle} />
      </div>
    </div>
  );
};

export default ProgressBar;
