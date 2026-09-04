import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: { label: string; action?: () => void }[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-gov-gray-500 mb-3 select-none flex-wrap">
      <div className="flex items-center gap-1 text-gov-navy hover:underline cursor-pointer" onClick={items[0]?.action}>
        <Home className="w-3.5 h-3.5" />
        <span className="font-medium">BHOOMISETU</span>
      </div>
      
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3 h-3 text-gov-gray-400" />
          {item.action ? (
            <button 
              onClick={item.action}
              className="hover:text-gov-navy hover:underline text-gov-gray-700 font-medium"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-gov-gray-900 font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
