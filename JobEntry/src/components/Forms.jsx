import React from 'react';

export const Input = ({ label, ...props }) => (
  <div className="flex flex-col space-y-1 mb-4">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <input 
      className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow text-slate-800"
      {...props}
    />
  </div>
);

export const Select = ({ label, options = [], ...props }) => (
  <div className="flex flex-col space-y-1 mb-4">
    {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
    <select 
      className="px-4 py-2 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-shadow text-slate-800"
      {...props}
    >
      <option value="" disabled>Select an option</option>
      {options.map((opt, idx) => (
        <option key={idx} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export const Badge = ({ children, variant = 'gray' }) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-slate-100 text-slate-800',
    primary: 'bg-[var(--color-primary-light)] text-[var(--color-primary-active)]',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};
