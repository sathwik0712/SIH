import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

// ---------------------------------------------------------------------------
// Types & Utility Functions
// ---------------------------------------------------------------------------

export type GrievanceCategory = 'COMPENSATION' | 'MEASUREMENT' | 'R_AND_R' | 'POSSESSION' | 'OTHER';
export type GrievanceStatus = 'FILED' | 'UNDER_HEARING' | 'RESOLVED';

export interface GrievanceRecord {
  id: string; // Tracking code e.g. GRV-2026-0001
  parcelId: string;
  complaintType: GrievanceCategory | string;
  description: string;
  claimantName: string;
  filedDate: string;
  status: GrievanceStatus;
  resolutionNotes?: string;
}

export interface FormErrors {
  parcelId?: string;
  complaintType?: string;
  description?: string;
}

/**
 * Generate a unique grievance tracking code in the format `GRV-2026-XXXX`.
 * @param seq Optional sequence number for deterministic formatting (1 -> GRV-2026-0001)
 */
export function generateGrievanceTrackingCode(seq?: number): string {
  const year = '2026';
  const num = seq !== undefined ? seq : Math.floor(1000 + Math.random() * 9000);
  const padded = String(num).padStart(4, '0').slice(-4);
  return `GRV-${year}-${padded}`;
}

/**
 * Validates status state transitions for RFCTLARR Grievances.
 * Enforces linear workflow: FILED -> UNDER_HEARING -> RESOLVED.
 */
export function isValidGrievanceTransition(
  currentStatus: GrievanceStatus,
  targetStatus: GrievanceStatus,
): boolean {
  if (currentStatus === 'FILED' && targetStatus === 'UNDER_HEARING') return true;
  if (currentStatus === 'UNDER_HEARING' && targetStatus === 'RESOLVED') return true;
  return false;
}

/**
 * Executes a status state transition on a grievance record.
 * Throws an error if the state transition is invalid.
 */
export function transitionGrievanceStatus(
  grievance: GrievanceRecord,
  targetStatus: GrievanceStatus,
  resolutionNotes?: string,
): GrievanceRecord {
  if (!isValidGrievanceTransition(grievance.status, targetStatus)) {
    throw new Error(`Invalid status transition from ${grievance.status} to ${targetStatus}`);
  }
  return {
    ...grievance,
    status: targetStatus,
    resolutionNotes: resolutionNotes || grievance.resolutionNotes,
  };
}

// ---------------------------------------------------------------------------
// Initial Mock Data
// ---------------------------------------------------------------------------

const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'GRV-2026-0001',
    parcelId: 'LP-PUN-001',
    complaintType: 'COMPENSATION',
    description: 'Assessed value is below market rate for Hadapsar parcel.',
    claimantName: 'Ramesh Patil',
    filedDate: '2026-05-18',
    status: 'FILED',
  },
  {
    id: 'GRV-2026-0002',
    parcelId: 'LP-PUN-002',
    complaintType: 'R_AND_R',
    description: 'Resettlement site is far from original location.',
    claimantName: 'Sunita Deshpande',
    filedDate: '2026-05-20',
    status: 'UNDER_HEARING',
    resolutionNotes: 'Under review by District Authority',
  },
  {
    id: 'GRV-2026-0003',
    parcelId: 'LP-SOL-047',
    complaintType: 'MEASUREMENT',
    description: 'Cadastral boundary overlap on north-west boundary.',
    claimantName: 'Anil Gowda',
    filedDate: '2026-05-10',
    status: 'RESOLVED',
    resolutionNotes: 'Re-survey completed and boundary corrected.',
  },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export interface GrievancePortalProps {
  initialGrievances?: GrievanceRecord[];
}

export const GrievancePortal: React.FC<GrievancePortalProps> = ({ initialGrievances }) => {
  const { user } = useAuth();

  const [grievances, setGrievances] = useState<GrievanceRecord[]>(
    initialGrievances || INITIAL_GRIEVANCES,
  );

  // Form State
  const [parcelId, setParcelId] = useState('');
  const [complaintType, setComplaintType] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);

  // District action resolution state
  const [resolutionInput, setResolutionInput] = useState<Record<string, string>>({});
  const [actionError, setActionError] = useState<string | null>(null);

  // Validate Submission Form
  const validateForm = (): boolean => {
    const errs: FormErrors = {};
    if (!parcelId.trim()) {
      errs.parcelId = 'Parcel ID is required';
    }
    if (!complaintType.trim()) {
      errs.complaintType = 'Complaint type is required';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    setActionError(null);

    if (!validateForm()) {
      return;
    }

    const nextSeq = grievances.length + 1;
    const trackingCode = generateGrievanceTrackingCode(nextSeq);

    const newRecord: GrievanceRecord = {
      id: trackingCode,
      parcelId: parcelId.trim(),
      complaintType: complaintType.trim(),
      description: description.trim(),
      claimantName: user?.fullName || 'Anonymous Citizen',
      filedDate: new Date().toISOString().split('T')[0],
      status: 'FILED',
    };

    setGrievances(prev => [newRecord, ...prev]);
    setSubmittedCode(trackingCode);

    // Reset form
    setParcelId('');
    setComplaintType('');
    setDescription('');
    setErrors({});
  };

  // Status transition handler
  const handleStatusTransition = (grievanceId: string, targetStatus: GrievanceStatus) => {
    setActionError(null);
    try {
      const targetGrievance = grievances.find(g => g.id === grievanceId);
      if (!targetGrievance) return;

      const notes = resolutionInput[grievanceId] || undefined;
      const updated = transitionGrievanceStatus(targetGrievance, targetStatus, notes);

      setGrievances(prev => prev.map(g => (g.id === grievanceId ? updated : g)));
    } catch (err: any) {
      setActionError(err.message || 'Failed status transition');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="bg-[#0B3559] text-white p-5 rounded-lg shadow-md border-l-4 border-amber-500">
        <h1 className="text-xl font-bold">Landowner Grievance Portal</h1>
        <p className="text-xs text-slate-300 mt-1">
          RFCTLARR Act 2013 Statutory Complaint &amp; Dispute Resolution Desk
        </p>
      </div>

      {/* Citizen Submission Form */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
          File a New Grievance
        </h2>

        {submittedCode && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded text-xs font-semibold">
            Grievance submitted successfully! Your tracking code is:{' '}
            <span className="font-mono font-bold text-emerald-950 text-sm" id="submitted-tracking-code" data-testid="submitted-tracking-code">
              {submittedCode}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmitGrievance} noValidate className="space-y-4">
          <div>
            <label htmlFor="parcelId" className="block text-xs font-semibold text-slate-700 mb-1">
              Parcel ID <span className="text-red-500">*</span>
            </label>
            <input
              id="parcelId"
              name="parcelId"
              type="text"
              value={parcelId}
              onChange={e => setParcelId(e.target.value)}
              placeholder="e.g. LP-PUN-001"
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {errors.parcelId && (
              <p className="text-red-600 text-[11px] mt-1" id="error-parcelId">
                {errors.parcelId}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="complaintType" className="block text-xs font-semibold text-slate-700 mb-1">
              Complaint Type <span className="text-red-500">*</span>
            </label>
            <select
              id="complaintType"
              name="complaintType"
              value={complaintType}
              onChange={e => setComplaintType(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
            >
              <option value="">Select complaint category...</option>
              <option value="COMPENSATION">Compensation Assessment Dispute</option>
              <option value="MEASUREMENT">Land Measurement &amp; Survey Overlap</option>
              <option value="R_AND_R">Rehabilitation &amp; Resettlement Entitlement</option>
              <option value="POSSESSION">Possession &amp; Eviction Notice</option>
              <option value="OTHER">Other Statutory Grievance</option>
            </select>
            {errors.complaintType && (
              <p className="text-red-600 text-[11px] mt-1" id="error-complaintType">
                {errors.complaintType}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-xs font-semibold text-slate-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide detailed description of your grievance..."
              className="w-full text-xs p-2 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {errors.description && (
              <p className="text-red-600 text-[11px] mt-1" id="error-description">
                {errors.description}
              </p>
            )}
          </div>

          <button
            type="submit"
            id="submit-grievance-btn"
            className="px-4 py-2 bg-[#0B3559] hover:bg-[#071E3D] text-white font-bold text-xs rounded transition-colors shadow-sm"
          >
            Submit Grievance
          </button>
        </form>
      </div>

      {/* Action error banner */}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-300 text-red-800 rounded text-xs font-semibold" id="action-error">
          {actionError}
        </div>
      )}

      {/* Grievances List / Resolution Desk */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
          Grievance Records &amp; Hearing Status
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200">
                <th className="p-2 font-semibold text-slate-700">Tracking Code</th>
                <th className="p-2 font-semibold text-slate-700">Parcel ID</th>
                <th className="p-2 font-semibold text-slate-700">Claimant</th>
                <th className="p-2 font-semibold text-slate-700">Category</th>
                <th className="p-2 font-semibold text-slate-700">Status</th>
                <th className="p-2 font-semibold text-slate-700">Action / Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {grievances.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-2 font-mono font-bold text-[#0B3559]" data-testid={`tracking-code-${item.id}`}>
                    {item.id}
                  </td>
                  <td className="p-2 font-mono">{item.parcelId}</td>
                  <td className="p-2">{item.claimantName}</td>
                  <td className="p-2 font-mono text-[10px]">{item.complaintType}</td>
                  <td className="p-2" data-testid={`status-${item.id}`}>
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'FILED'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : item.status === 'UNDER_HEARING'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 space-y-1">
                    {/* State Transitions for District Authority */}
                    {item.status === 'FILED' && (
                      <button
                        onClick={() => handleStatusTransition(item.id, 'UNDER_HEARING')}
                        id={`btn-hearing-${item.id}`}
                        className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold rounded shadow-xs"
                      >
                        Start Hearing (UNDER_HEARING)
                      </button>
                    )}

                    {item.status === 'UNDER_HEARING' && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Resolution remarks..."
                          value={resolutionInput[item.id] || ''}
                          onChange={e =>
                            setResolutionInput({ ...resolutionInput, [item.id]: e.target.value })
                          }
                          className="text-[11px] p-1 border border-slate-300 rounded w-36"
                          id={`resolution-input-${item.id}`}
                        />
                        <button
                          onClick={() => handleStatusTransition(item.id, 'RESOLVED')}
                          id={`btn-resolve-${item.id}`}
                          className="px-2 py-1 bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-semibold rounded shadow-xs"
                        >
                          Resolve (RESOLVED)
                        </button>
                      </div>
                    )}

                    {item.status === 'RESOLVED' && (
                      <span className="text-[11px] text-slate-500 font-medium">
                        Resolved: {item.resolutionNotes || 'Case closed'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GrievancePortal;
