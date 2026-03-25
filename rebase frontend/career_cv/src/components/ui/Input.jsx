import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}, ref) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-on-surface mb-1.5">
          {label}
          {props.required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-on-surface-variant">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-base border transition-all duration-200 font-body
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-surface-container disabled:cursor-not-allowed
            placeholder:text-on-surface-variant text-on-surface
            ${error ? 'border-error focus:ring-error' : 'border-outline-variant bg-surface-container-lowest'}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
          `}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-on-surface-variant'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

