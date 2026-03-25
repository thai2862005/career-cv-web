import { forwardRef } from 'react';

const TopAppBar = forwardRef(({
  title,
  leftContent,
  rightContent,
  className = '',
  ...props
}, ref) => {
  return (
    <header
      ref={ref}
      className={`sticky top-0 z-40 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-outline-variant/10 shadow-sm ${className}`}
      {...props}
    >
      <div className="flex justify-between items-center w-full px-6 py-4 max-w-full">
        <div className="flex items-center gap-4">
          {leftContent}
          {title && (
            <h1 className="text-xl font-bold font-headline text-on-surface">
              {title}
            </h1>
          )}
        </div>
        <div className="flex items-center gap-6">
          {rightContent}
        </div>
      </div>
    </header>
  );
});

TopAppBar.displayName = 'TopAppBar';

export default TopAppBar;
