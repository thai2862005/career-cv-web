import React from 'react';
import { Loader2, FolderDown, AlertTriangle } from 'lucide-react';

export const LoadingState = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center p-12 text-slate-500">
    <Loader2 className="h-10 w-10 animate-spin text-[var(--color-primary)] mb-4" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export const EmptyState = ({ 
  title = 'No Data Found', 
  description = 'There is currently no data to display.', 
  action 
}) => (
  <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50">
    <div className="bg-blue-50 p-4 rounded-full mb-4">
      <FolderDown className="h-8 w-8 text-[var(--color-primary)]" />
    </div>
    <h3 className="text-lg font-semibold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-6 max-w-sm">{description}</p>
    {action}
  </div>
);

export const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-red-200 bg-red-50">
    <div className="bg-red-100 p-3 rounded-full mb-3">
      <AlertTriangle className="h-6 w-6 text-red-500" />
    </div>
    <p className="text-sm font-medium text-red-800 mb-4">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="text-sm font-semibold text-red-700 hover:text-red-900 underline"
      >
        Try Again
      </button>
    )}
  </div>
);
