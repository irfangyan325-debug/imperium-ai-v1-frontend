import React from 'react';
import { cn } from '@/utils/helpers';

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'green' | 'blue' | 'red';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  size = 'md',
  color = 'gold',
  showLabel = true,
  label,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  const colors = {
    gold: 'bg-gradient-gold',
    green: 'bg-green-600',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-imperial-cream opacity-80 mb-2">
          <span>{label || 'Progress'}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn('progress-bar', sizes[size])}>
        <div
          className={cn('progress-bar-fill', colors[color])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;