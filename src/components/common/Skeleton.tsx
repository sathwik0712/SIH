import React from 'react';

export const SkeletonCard = () => (
  <div className="bg-white border border-slate-200 rounded p-4 shadow-sm animate-pulse">
    <div className="h-3 bg-slate-200 rounded w-1/3 mb-4"></div>
    <div className="h-6 bg-slate-200 rounded w-1/2 mb-2"></div>
    <div className="h-2 bg-slate-200 rounded w-3/4"></div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 5 }) => (
  <div className="bg-white border border-slate-200 rounded shadow-sm overflow-hidden animate-pulse">
    <div className="bg-slate-100 h-10 border-b border-slate-200 flex items-center px-4">
      {Array.from({ length: columns }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-200 rounded w-full max-w-[80px] mx-2"></div>
      ))}
    </div>
    <div className="divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex items-center px-4 py-3">
          {Array.from({ length: columns }).map((_, c) => (
            <div key={c} className={`h-3 bg-slate-200 rounded mx-2 ${c === 0 ? 'w-1/4' : 'w-full'}`}></div>
          ))}
        </div>
      ))}
    </div>
  </div>
);
