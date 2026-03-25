import { forwardRef } from 'react';

const Stat = forwardRef(({
  icon,
  label,
  value,
  change,
  units = '',
  className = '',
  ...props
}, ref) => {
  const isPositive = change && change >= 0;

  return (
    <div
      ref={ref}
      className={`bg-surface-container-lowest rounded-base border border-outline-variant/10 p-6 shadow-sm hover-lift ${className}`}
      {...props}
    >
      <div className="flex items-start justify-between mb-4">
        {icon && (
          <div className="h-12 w-12 rounded-base bg-primary-container flex items-center justify-center text-primary">
            {icon}
          </div>
        )}
      </div>
      <p className="text-on-surface-variant text-sm font-medium mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-3xl font-bold text-on-surface">
          {value}
          {units && <span className="text-lg text-on-surface-variant ml-1">{units}</span>}
        </p>
        {change !== undefined && (
          <p className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-error'}`}>
            {isPositive ? '+' : ''}{change}%
          </p>
        )}
      </div>
    </div>
  );
});

Stat.displayName = 'Stat';

export default Stat;
