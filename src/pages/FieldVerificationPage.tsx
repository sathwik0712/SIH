import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StatusBadge } from '../components/common/StatusBadge';
import { 
  Smartphone, Crosshair, Camera, CheckCircle2, 
  MapPin, ShieldCheck, Wifi, WifiOff, UploadCloud, 
  FileCheck, AlertTriangle, ArrowRight 
} from 'lucide-react';

interface FieldVerificationPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const FieldVerificationPage: React.FC<FieldVerificationPageProps> = ({ onNavigate }) => {
  const { parcels, currentUser, verifyParcelInField } = useApp();

  const [selectedParcelId, setSelectedParcelId] = useState<string>(
    parcels.find(p => p.verificationStatus === 'Pending' || p.verificationStatus === 'In Progress')?.id || parcels[0]?.id || ''
  );

  const selectedParcel = parcels.find(p => p.id === selectedParcelId) || parcels[0];

  const [isCapturingGps, setIsCapturingGps] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  const [checklist, setChecklist] = useState({
    boundaryMatched: true,
    ownerAadhaarVerified: true,
    treeCensusDone: true,
    structuresValued: true,
    noDisputedEncroachment: true,
  });

  const [officerRemarks, setOfficerRemarks] = useState(
    'Survey boundary demarcated with DGPS. No adverse possession or religious structures identified on proposed road corridor.'
  );

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleCaptureGps = () => {
    setIsCapturingGps(true);
    setTimeout(() => {
      setGpsCaptured({
        lat: selectedParcel?.centerCoordinate?.lat || 18.5204,
        lng: selectedParcel?.centerCoordinate?.lng || 73.8567,
        accuracy: 1.8, // 1.8 meters accuracy (DGPS)
      });
      setIsCapturingGps(false);
    }, 800);
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcel) return;

    verifyParcelInField(
      selectedParcel.id,
      currentUser.name || 'Shri Manoj V. Patil (Revenue Inspector)',
      officerRemarks,
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'
    );

    setSubmittedSuccess(true);
    setTimeout(() => setSubmittedSuccess(false), 3000);
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Breadcrumbs items={[{ label: 'Mobile Field Officer Mode' }]} />

      {/* Top Mobile Bar */}
      <div className="bg-gov-navy text-white p-3.5 rounded-t shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-sm font-bold font-serif leading-tight">
              Mobile Field Revenue Officer Mode
            </h2>
            <p className="text-[10px] text-slate-200">
              On-Ground DGPS Cadastral Demarcation & Inspection
            </p>
          </div>
        </div>

        {/* Offline / Online Sync Toggle */}
        <button
          onClick={() => setIsOnline(!isOnline)}
          className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
            isOnline
              ? 'bg-emerald-800/80 border-emerald-400 text-white'
              : 'bg-amber-800/80 border-amber-400 text-white'
          }`}
          title="Toggle Offline Field Sync Simulation"
        >
          {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>{isOnline ? 'Online (Live Sync)' : 'Offline (Local DB)'}</span>
        </button>
      </div>

      {submittedSuccess && (
        <div className="p-3 bg-emerald-100 border border-emerald-300 rounded text-emerald-950 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <span>Field Verification successfully submitted and signed off into Statutory Cadastre!</span>
        </div>
      )}

      {/* Main Field Form */}
      <form onSubmit={handleSubmitVerification} className="bg-white border border-gov-gray-300 rounded-b p-4 shadow-sm space-y-4 text-xs">
        {/* Step 1: Select Parcel */}
        <div>
          <label className="block font-bold text-gov-navy mb-1">
            1. Select Assigned Land Parcel for Field Verification:
          </label>
          <select
            value={selectedParcelId}
            onChange={(e) => {
              setSelectedParcelId(e.target.value);
              setGpsCaptured(null);
            }}
            className="w-full p-2 border border-gov-gray-300 rounded text-xs font-semibold text-gov-navy bg-gov-gray-50"
          >
            {parcels.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id} &mdash; Survey No. {p.surveyNumber} ({p.village}, {p.district}) [{p.verificationStatus}]
              </option>
            ))}
          </select>
        </div>

        {/* Step 2: Parcel Metadata Review */}
        {selectedParcel && (
          <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-gov-gray-200">
              <span className="font-bold text-gov-navy font-serif">
                Survey No. {selectedParcel.surveyNumber} ({selectedParcel.khasraNumber})
              </span>
              <StatusBadge status={selectedParcel.verificationStatus} size="sm" />
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>Owner: <strong>{selectedParcel.ownerName}</strong></div>
              <div>Area: <strong>{selectedParcel.areaAcres} Acres ({selectedParcel.areaHa} Ha)</strong></div>
              <div>Category: <strong>{selectedParcel.landType}</strong></div>
              <div>Title: <strong>{selectedParcel.ownershipStatus}</strong></div>
            </div>
          </div>
        )}

        {/* Step 3: GPS Demarcation */}
        <div className="p-3 bg-blue-50/60 rounded border border-blue-200 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-gov-navy flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-blue-700" />
              <span>2. Capture DGPS Ground Coordinates (Section 4/11 Demarcation):</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCaptureGps}
              disabled={isCapturingGps}
              className="px-3 py-2 bg-gov-navy text-white rounded font-semibold text-xs hover:bg-gov-navy-hover flex items-center gap-1.5 disabled:opacity-50"
            >
              <Crosshair className={`w-3.5 h-3.5 ${isCapturingGps ? 'animate-spin' : ''}`} />
              <span>{isCapturingGps ? 'Reading Satellite DGPS...' : 'Capture Ground GPS'}</span>
            </button>

            {gpsCaptured && (
              <div className="font-mono text-[11px] text-emerald-900 bg-white px-3 py-1.5 rounded border border-emerald-300">
                Lat: <strong>{gpsCaptured.lat.toFixed(6)}</strong> | Lng: <strong>{gpsCaptured.lng.toFixed(6)}</strong> (Acc: &plusmn;{gpsCaptured.accuracy}m)
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Geo-Tagged Photo Capture */}
        <div className="p-3 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-2">
          <span className="font-bold text-gov-navy flex items-center gap-1.5">
            <Camera className="w-4 h-4 text-gov-navy" />
            <span>3. Geo-Tagged Site Inspection Photograph:</span>
          </span>

          <div className="flex items-center gap-3">
            <div className="w-24 h-16 rounded border border-gov-gray-300 overflow-hidden bg-slate-200 flex-shrink-0">
              <img
                src={selectedParcel?.photographUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'}
                alt="Field Survey Inspection"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-[11px] text-gov-gray-600">
              <p>Camera: <strong>Simulated EXIF Geo-Tagged Camera</strong></p>
              <p>Timestamp: <strong>{new Date().toISOString()}</strong></p>
            </div>
          </div>
        </div>

        {/* Step 5: Statutory Verification Checklist */}
        <div className="space-y-2">
          <span className="font-bold text-gov-navy block">
            4. Revenue Inspector Statutory Checklist:
          </span>

          <div className="space-y-1.5 bg-gov-gray-50 p-3 rounded border border-gov-gray-200">
            {[
              { id: 'boundaryMatched', label: 'Cadastral boundary stones match Tehsil 7/12 RoR records' },
              { id: 'ownerAadhaarVerified', label: 'Landowner Aadhaar & bank passbook physically verified' },
              { id: 'treeCensusDone', label: 'Fruit & timber tree census enumerated with valuer sheet' },
              { id: 'structuresValued', label: 'Tubewells, pump houses & residential structures measured' },
              { id: 'noDisputedEncroachment', label: 'No unrecorded tenancy or third-party stay claim on site' },
            ].map((chk) => (
              <label key={chk.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(checklist as any)[chk.id]}
                  onChange={(e) => setChecklist({ ...checklist, [chk.id]: e.target.checked })}
                  className="rounded border-gov-gray-300 text-gov-navy focus:ring-gov-navy"
                />
                <span className="text-gov-gray-800 text-xs font-medium">{chk.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Step 6: Remarks */}
        <div>
          <label className="block font-bold text-gov-navy mb-1">
            5. Field Revenue Inspector Remarks & Signature:
          </label>
          <textarea
            rows={2}
            value={officerRemarks}
            onChange={(e) => setOfficerRemarks(e.target.value)}
            className="w-full p-2 border border-gov-gray-300 rounded text-xs"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-gov-gray-200 flex items-center justify-between">
          <span className="text-[11px] text-gov-gray-500 font-mono">
            Officer: <strong>{currentUser.name}</strong>
          </span>
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded transition-colors shadow-sm flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Submit Official Field Verification</span>
          </button>
        </div>
      </form>
    </div>
  );
};
