import React from 'react';
import { AlertCircle, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

interface GovernmentAlertBannerProps {
  type: 'info' | 'warning' | 'critical' | 'success';
  title?: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
  onDismiss?: () => void;
}

export const GovernmentAlertBanner: React.FC<GovernmentAlertBannerProps> = ({
  type,
  title,
  message,
  actionText,
  onAction,
  onDismiss,
}) => {
  let bgClass = 'bg-blue-50 border-blue-300 text-blue-900';
  let Icon = Info;
  let iconClass = 'text-blue-700';

  if (type === 'warning') {
    bgClass = 'bg-amber-50 border-amber-300 text-amber-950';
    Icon = AlertTriangle;
    iconClass = 'text-amber-700';
  } else if (type === 'critical') {
    bgClass = 'bg-red-50 border-red-300 text-red-950';
    Icon = AlertCircle;
    iconClass = 'text-red-700';
  } else if (type === 'success') {
    bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-950';
    Icon = CheckCircle2;
    iconClass = 'text-emerald-700';
  }

  return (
    <div className={`p-3 rounded border ${bgClass} text-xs flex items-start justify-between gap-3 shadow-xs`}>
      <div className="flex items-start gap-2.5">
        <Icon className={`w-4 h-4 ${iconClass} flex-shrink-0 mt-0.5`} />
        <div>
          {title && <h5 className="font-bold mb-0.5">{title}</h5>}
          <p className="leading-relaxed">{message}</p>
          {actionText && onAction && (
            <button
              onClick={onAction}
              className="mt-1.5 font-semibold text-gov-navy hover:underline flex items-center gap-1"
            >
              <span>{actionText}</span>
              <span>&rarr;</span>
            </button>
          )}
        </div>
      </div>

      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 rounded hover:bg-black/5 text-gov-gray-500 hover:text-gov-gray-800"
          title="Dismiss Notice"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
