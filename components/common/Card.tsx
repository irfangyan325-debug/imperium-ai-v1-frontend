import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'gold' | 'glass';
  hover?: boolean;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  variant = 'default', 
  hover = false,
  className = '',
  onClick 
}) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-300';
  
  const variants = {
    default: 'bg-imperial-darkGray border border-imperial-gray',
    gold: 'bg-imperial-darkGray border-2 border-imperial-gold shadow-gold',
    glass: 'glass-effect backdrop-blur-sm bg-imperial-darkGray bg-opacity-50',
  };

  const hoverStyles = hover ? 'cursor-pointer hover:border-imperial-gold hover:shadow-gold hover:scale-[1.02]' : '';

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        hoverStyles,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;