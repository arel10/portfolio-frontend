import React, { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(({
  label,
  error,
  className = '',
  type = 'text',
  name,
  value,
  onChange,
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
      <input
        ref={ref}
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={clsx(
          'w-full bg-dark-800/50 border border-game-primary/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-game-primary focus:bg-dark-800/70 transition-all duration-300',
          {
            'border-red-500 focus:border-red-500': error,
            'opacity-60 cursor-not-allowed': disabled,
          },
          className
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
