import React from 'react';
import clsx from 'clsx';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium', 
  disabled = false,
  loading = false,
  className = '',
  onClick,
  type = 'button',
  ...props 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-gradient-to-r from-game-primary to-game-secondary text-white hover:scale-105 hover:shadow-neon focus:ring-game-primary',
    secondary: 'border-2 border-game-primary text-game-primary hover:bg-game-primary hover:text-white hover:scale-105 focus:ring-game-primary',
    danger: 'bg-gradient-to-r from-game-danger to-red-600 text-white hover:scale-105 hover:shadow-lg focus:ring-game-danger',
    success: 'bg-gradient-to-r from-game-success to-green-600 text-white hover:scale-105 hover:shadow-lg focus:ring-game-success',
    outline: 'border border-gray-600 text-gray-300 hover:border-game-primary hover:text-game-primary focus:ring-game-primary',
    ghost: 'text-gray-300 hover:text-game-primary hover:bg-game-primary/10 focus:ring-game-primary',
  };

  const sizes = {
    small: 'px-3 py-2 text-sm rounded-md',
    medium: 'px-6 py-3 text-base rounded-lg',
    large: 'px-8 py-4 text-lg rounded-xl',
  };

  return (
    <button
      type={type}
      className={clsx(
        baseClasses,
        variants[variant],
        sizes[size],
        loading && 'cursor-wait',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" className="opacity-25" />
          <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75" />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
