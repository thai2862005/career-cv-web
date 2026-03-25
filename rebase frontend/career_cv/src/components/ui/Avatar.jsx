const Avatar = ({
  src,
  alt = 'Avatar',
  size = 'md',
  initials,
  className = '',
  ...props
}) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-lg',
  };

  const baseClasses = `inline-flex items-center justify-center rounded-full bg-primary-container text-on-primary-container font-semibold overflow-hidden border border-outline-variant/10 flex-shrink-0`;

  if (src) {
    return (
      <div
        className={`${baseClasses} ${sizes[size]} ${className}`}
        {...props}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${sizes[size]} ${className}`}
      {...props}
    >
      {initials || '?'}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;
