import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, XCircle, ShieldAlert, ArrowRightCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = (status || '').toUpperCase();

  let config = {
    label: status || 'Unknown',
    bg: 'bg-slate-100',
    text: 'text-slate-800',
    border: 'border-slate-300',
    icon: Clock,
  };

  switch (normalized) {
    // Green: Completed, Approved, Verified, Possession Taken, Disbursed, On Track
    case 'ON_TRACK':
      config = { label: 'On Track', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;
    case 'COMPLETED':
      config = { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;
    case 'APPROVED':
      config = { label: 'Approved', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;
    case 'VERIFIED':
      config = { label: 'Verified', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;
    case 'DISBURSED':
      config = { label: 'Disbursed', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;
    case 'POSSESSION_TAKEN':
      config = { label: 'Possession Taken', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;

    // Amber: Pending, At Risk, Under Verification, Field Visit, Notified
    case 'AT_RISK':
      config = { label: 'At Risk', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: AlertTriangle };
      break;
    case 'PENDING':
      config = { label: 'Pending', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: Clock };
      break;
    case 'FIELD_VISIT_SCHEDULED':
      config = { label: 'Field Visit Scheduled', bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-300', icon: ArrowRightCircle };
      break;
    case 'NOTIFIED':
      config = { label: 'Notified (Sec 11)', bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-300', icon: Clock };
      break;
    case 'AWARD_DECLARED':
      config = { label: 'Award Declared', bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-300', icon: CheckCircle2 };
      break;
    case 'COMPENSATION_PAID':
      config = { label: 'Compensation Paid', bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-300', icon: CheckCircle2 };
      break;

    // Red: Critical, Delayed, Disputed, Objection Raised, Rejected
    case 'DELAYED':
      config = { label: 'Delayed', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: ShieldAlert };
      break;
    case 'DISPUTED':
      config = { label: 'Disputed', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: AlertTriangle };
      break;
    case 'OBJECTION_RAISED':
      config = { label: 'Objection Raised (Sec 15)', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: AlertTriangle };
      break;
    case 'REJECTED':
      config = { label: 'Rejected', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: XCircle };
      break;
    case 'CRITICAL':
      config = { label: 'Critical', bg: 'bg-red-50', text: 'text-red-800', border: 'border-red-300', icon: ShieldAlert };
      break;

    default:
      config = { label: status, bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-300', icon: Clock };
      break;
  }

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center space-x-1.5 px-2 py-0.5 rounded text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <IconComponent className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
