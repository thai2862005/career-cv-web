import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({
  items = [],
  isOpen = true,
  onToggle,
  className = '',
}) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-surface z-40 border-r border-outline-variant/10 transition-transform duration-300 flex flex-col pt-20 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:static md:pt-0 md:top-auto md:h-screen ${className}`}
      >
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-base text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-outline-variant/10 p-4">
          {/* Additional footer content can go here */}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
};

Sidebar.displayName = 'Sidebar';

export default Sidebar;
