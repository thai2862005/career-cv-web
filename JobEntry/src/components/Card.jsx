import React from 'react';

export const Card = ({ children, className = '', title, actions }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          {title && <h3 className="text-lg font-semibold text-slate-800">{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};
