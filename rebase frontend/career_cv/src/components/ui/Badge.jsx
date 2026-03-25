const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full transition-colors';

  const variants = {
    default: 'bg-surface-container text-on-surface',
    primary: 'bg-primary-container text-on-primary-container',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-error-container text-on-error-container',
    match: 'bg-primary-container text-primary font-bold',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
