import React, { forwardRef } from 'react';
import clsx from 'clsx';

const TextArea = forwardRef(({
  label,
  error,
  className = '',
  rows = 4,
  name,
  placeholder = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        rows={rows}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={clsx(
          'w-full bg-dark-800/50 border border-game-primary/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-game-primary focus:bg-dark-800/70 transition-all duration-300 resize-vertical',
          error && 'border-red-500 focus:border-red-500',
          disabled && 'opacity-60 cursor-not-allowed',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';
export default TextArea;
