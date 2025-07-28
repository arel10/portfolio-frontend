import React from 'react';
import clsx from 'clsx';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  glow = false, 
  onClick,
  ...props 
}) => {
  return (
    <div
      className={clsx(
        'bg-dark-800/50 backdrop-blur-sm border border-game-primary/30 rounded-xl p-6 transition-all duration-300',
        hover && 'hover:border-game-primary/60 hover:bg-dark-800/70 cursor-pointer',
        glow && 'hover:shadow-neon',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
