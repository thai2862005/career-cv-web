import { forwardRef } from 'react';

const Card = forwardRef(({
  children,
  className = '',
  elevated = false,
  interactive = false,
  ...props
}, ref) => {
  const baseClasses = 'bg-surface-container-lowest rounded-base border border-outline-variant/10 p-6 transition-all duration-200';

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:hover-lift hover:shadow-editorial'
    : '';

  const elevatedClasses = elevated
    ? 'shadow-editorial'
    : 'shadow-sm';

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${elevatedClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
