import React from 'react';
import { useApp } from '../context/AppContext';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CadastralMap } from '../components/gis/CadastralMap';
import { Map, Info, Download, ShieldCheck } from 'lucide-react';

interface GISMapPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const GISMapPage: React.FC<GISMapPageProps> = ({ onNavigate }) => {
  const { parcels, projects } = useApp();

  return (
    <div className="space-y-3">
      <Breadcrumbs items={[{ label: 'GIS Cadastral Map' }]} />

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-2">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif flex items-center gap-2">
            <Map className="w-5 h-5 text-amber-500" />
            <span>Interactive GIS Cadastral Map Engine</span>
          </h2>
          <p className="text-xs text-gov-gray-600">
            Multi-layer cadastral GIS visualization with live parcel polygons, alignment overlays, and statutory status tracking
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="bg-emerald-100 text-emerald-900 px-2 py-1 rounded font-medium border border-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>DGPS / Bhuvan ISRO Geo-Spatial Standard</span>
          </span>
        </div>
      </div>

      {/* Main Full-Screen GIS Map Component */}
      <CadastralMap
        heightClass="h-[700px]"
        onNavigateToModule={onNavigate}
      />
    </div>
  );
};
