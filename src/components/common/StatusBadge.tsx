import React from 'react';
import { 
  CheckCircle2, Clock, AlertTriangle, AlertCircle, 
  ShieldCheck, HelpCircle, FileCheck, DollarSign, Home 
} from 'lucide-react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  let bgClass = 'bg-gov-gray-100 text-gov-gray-700 border-gov-gray-300';
  let Icon = HelpCircle;

  switch (status) {
    // Verification / Possession / Completed
    case 'Verified':
    case 'Completed':
    case 'Possession Taken':
    case 'Possession Completed':
    case 'On Track':
    case 'Paid':
    case 'Clear Title':
    case 'Relocation Completed':
    case 'Approved by Collector':
    case 'Approved':
    case 'Finalized':
    case 'Verified Official':
    case 'Connected (Simulated API)':
    case 'Healthy':
      bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-300';
      Icon = CheckCircle2;
      break;

    // In Progress / Hearing / Pending
    case 'In Progress':
    case 'Under Verification':
    case 'Hearing Scheduled':
    case 'Hearing Period Open':
    case 'Recommended by CALA':
    case 'Pending Approval':
    case 'Under PFMS Verification':
    case 'Pending Land Allotment':
    case 'Allotted':
    case 'Sanctioned':
    case 'Drafted':
    case 'Draft Pending Review':
    case 'Published':
    case 'Notified (Sec 11)':
    case 'Award Declared':
    case 'Assessed':
    case 'Identified':
      bgClass = 'bg-amber-50 text-amber-900 border-amber-300';
      Icon = Clock;
      break;

    // At Risk / Partial / Warning
    case 'At Risk':
    case 'Partial Possession':
    case 'Discrepancy Found':
    case 'Tenancy / Lease':
    case 'Inam / Trust':
    case 'Degraded':
      bgClass = 'bg-orange-50 text-orange-900 border-orange-300';
      Icon = AlertTriangle;
      break;

    // Critical / Delayed / Disputed / Stayed
    case 'Delayed':
    case 'Disputed':
    case 'Disputed Escrow':
    case 'Stayed by Court':
    case 'Lapsed':
    case 'Critical':
    case 'Offline':
    case 'Law & Order Enforced':
      bgClass = 'bg-red-50 text-red-900 border-red-300';
      Icon = AlertCircle;
      break;

    case 'Government':
      bgClass = 'bg-blue-50 text-blue-900 border-blue-300';
      Icon = ShieldCheck;
      break;

    default:
      bgClass = 'bg-slate-100 text-slate-800 border-slate-300';
      Icon = HelpCircle;
  }

  const padding = size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span className={`inline-flex items-center gap-1 rounded border ${bgClass} ${padding} tracking-tight select-none`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{status}</span>
    </span>
  );
};
