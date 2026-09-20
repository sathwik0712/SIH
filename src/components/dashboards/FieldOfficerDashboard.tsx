import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Smartphone,
  Map,
  CheckCircle2,
  Clock,
  Upload,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface FieldTask {
  id: string;
  parcelCode: string;
  khasraNumber: string;
  village: string;
  tehsil: string;
  maskedOwner: string;
  areaHectares: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate: string;
}

export const FieldOfficerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const tasks: FieldTask[] = [
    {
      id: 'TSK-101',
      parcelCode: 'MH-PN-KH-001',
      khasraNumber: '142/1A',
      village: 'Khed Shivapur',
      tehsil: 'Khed',
      maskedOwner: 'T*** S*** G***',
      areaHectares: 2.4,
      status: 'PENDING',
      dueDate: 'Today, 05:00 PM'
    },
    {
      id: 'TSK-102',
      parcelCode: 'MH-PN-KH-004',
      khasraNumber: '145/3',
      village: 'Khed Shivapur',
      tehsil: 'Khed',
      maskedOwner: 'R*** M*** S***',
      areaHectares: 1.8,
      status: 'IN_PROGRESS',
      dueDate: 'Tomorrow'
    },
    {
      id: 'TSK-103',
      parcelCode: 'MH-PN-[#0B3559]-012',
      khasraNumber: '98/2',
      village: 'Nasrapur',
      tehsil: 'Bhor',
      maskedOwner: 'S*** B*** P***',
      areaHectares: 3.1,
      status: 'COMPLETED',
      dueDate: '18 Sep 2026'
    }
  ];

  const filteredTasks = tasks.filter(t => filterStatus === 'ALL' || t.status === filterStatus);

  return (
    <div className="space-y-4">
      {/* Field Officer Task Header */}
      <div className="bg-[#0B3559] text-white p-4 rounded shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <h1 className="text-base font-bold text-white tracking-tight">
              Field Officer Workstation — Ground Survey Task Queue
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-semibold uppercase">
              FIELD VERIFICATION SCOPE
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Officer: <strong className="text-white">{user?.fullName}</strong> • Assigned Jurisdiction: {user?.district || 'Pune'} District
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded border border-slate-700 text-xs text-slate-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Landowner PII Privacy Masking Active</span>
        </div>
      </div>

      {/* Task Queue Filters & Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div 
          onClick={() => setFilterStatus('PENDING')}
          className={`p-3 rounded border cursor-pointer transition-colors ${filterStatus === 'PENDING' ? 'bg-amber-50 border-amber-400' : 'bg-white border-slate-200'}`}
        >
          <div className="flex justify-between items-center text-xs font-semibold text-amber-800">
            <span>Pending Survey</span>
            <Clock className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-900 mt-1">1 Parcel</div>
          <p className="text-[11px] text-slate-500 mt-0.5">High Priority Inspection</p>
        </div>

        <div 
          onClick={() => setFilterStatus('IN_PROGRESS')}
          className={`p-3 rounded border cursor-pointer transition-colors ${filterStatus === 'IN_PROGRESS' ? 'bg-blue-50 border-blue-400' : 'bg-white border-slate-200'}`}
        >
          <div className="flex justify-between items-center text-xs font-semibold text-blue-800">
            <span>In Progress</span>
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-900 mt-1">1 Parcel</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Geo-tagging in progress</p>
        </div>

        <div 
          onClick={() => setFilterStatus('COMPLETED')}
          className={`p-3 rounded border cursor-pointer transition-colors ${filterStatus === 'COMPLETED' ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}
        >
          <div className="flex justify-between items-center text-xs font-semibold text-emerald-800">
            <span>Completed Today</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-900 mt-1">1 Parcel</div>
          <p className="text-[11px] text-slate-500 mt-0.5">Report submitted</p>
        </div>
      </div>

      {/* Task Queue List */}
      <div className="bg-white border border-slate-200 rounded shadow-sm p-4">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Assigned Land Parcels Task List
            </h3>
            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono font-bold">
              {filteredTasks.length} Tasks
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setFilterStatus('ALL')}
              className={`text-xs px-2.5 py-1 rounded font-semibold ${filterStatus === 'ALL' ? 'bg-[#0B3559] text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
            >
              Show All
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filteredTasks.map(t => (
            <div key={t.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-[#0B3559] bg-blue-50 px-2 py-0.5 border border-blue-200 rounded">
                    {t.parcelCode}
                  </span>
                  <span className="text-xs font-bold text-slate-900">Khasra No. {t.khasraNumber}</span>
                  <span className="text-xs text-slate-500">• {t.village}, {t.tehsil} Tehsil</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-600">
                  <span>Landowner: <strong className="font-mono text-slate-800">{t.maskedOwner}</strong> (Masked PII)</span>
                  <span>Area: <strong className="font-mono text-slate-800">{t.areaHectares} Ha</strong></span>
                  <span>Due: <strong className="text-amber-800 font-medium">{t.dueDate}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                <Link
                  to="/gis-map"
                  className="flex-1 md:flex-initial px-3 py-2 md:py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Map className="w-3.5 h-3.5" />
                  <span>GIS Cadastral Map</span>
                </Link>

                <Link
                  to="/field-verification"
                  className="flex-1 md:flex-initial px-3 py-2 md:py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded shadow-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Survey &amp; Geotag Photo</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
