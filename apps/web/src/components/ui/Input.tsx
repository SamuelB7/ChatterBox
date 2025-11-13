/**
 * Input Component
 * Reusable text input with validation states
 */

import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export function Input({ label, error, fullWidth = false, className = '', ...props }: InputProps) {
  const baseClasses =
    'px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors';
  const stateClasses = error
    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
    : 'border-gray-300 focus:border-primary-500 focus:ring-primary-200';
  const widthClass = fullWidth ? 'w-full' : '';

  const inputClasses = `${baseClasses} ${stateClasses} ${widthClass} ${className}`.trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      <input className={inputClasses} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;
