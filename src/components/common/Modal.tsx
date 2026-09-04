import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  actions?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = '2xl',
  actions,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto select-none">
      <div 
        className={`w-full ${maxWidthClass} bg-white rounded border border-gov-gray-300 shadow-2xl overflow-hidden flex flex-col my-8 animate-in fade-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gov-navy text-white px-4 py-3 flex items-center justify-between border-b border-gov-navy-dark">
          <div>
            <h3 className="text-sm font-bold tracking-wide font-serif">{title}</h3>
            {subtitle && <p className="text-xs text-slate-200 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto max-h-[75vh] text-xs text-gov-gray-800 bg-gov-gray-50/50">
          {children}
        </div>

        {/* Modal Footer / Actions */}
        {actions && (
          <div className="px-4 py-3 bg-gov-gray-100 border-t border-gov-gray-200 flex items-center justify-end gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
