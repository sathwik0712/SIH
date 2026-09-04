import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { LandParcel, Project } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { 
  Layers, MapPin, Search, Filter, Eye, 
  Compass, CheckCircle2, AlertTriangle, Info, 
  Maximize2, Crosshair, ArrowRight, ExternalLink 
} from 'lucide-react';
import L from 'leaflet';

interface CadastralMapProps {
  parcelsList?: LandParcel[];
  selectedProjectId?: string;
  onSelectParcel?: (parcel: LandParcel) => void;
  onNavigateToModule?: (module: string) => void;
  heightClass?: string;
}

export const CadastralMap: React.FC<CadastralMapProps> = ({
  parcelsList,
  selectedProjectId,
  onSelectParcel,
  onNavigateToModule,
  heightClass = 'h-[640px]',
}) => {
  const { parcels, projects, setSelectedProjectId } = useApp();
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const polygonLayerGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeProjectFilter, setActiveProjectFilter] = useState<string>(selectedProjectId || 'ALL');
  const [activeStatusFilter, setActiveStatusFilter] = useState<string>('ALL');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('ALL');
  const [mapLayerType, setMapLayerType] = useState<'street' | 'satellite' | 'topo'>('street');
  const [inspectedParcel, setInspectedParcel] = useState<LandParcel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Base list of parcels to render
  const baseParcels = parcelsList || parcels;

  const filteredParcels = baseParcels.filter((p) => {
    if (activeProjectFilter !== 'ALL' && p.projectId !== activeProjectFilter) return false;
    if (activeStatusFilter !== 'ALL' && p.acquisitionStatus !== activeStatusFilter) return false;
    if (activeTypeFilter !== 'ALL' && p.landType !== activeTypeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.surveyNumber.toLowerCase().includes(q) ||
        p.khasraNumber.toLowerCase().includes(q) ||
        p.village.toLowerCase().includes(q) ||
        p.ownerName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Color mapping based on acquisition status
  const getParcelStyle = (parcel: LandParcel) => {
    switch (parcel.acquisitionStatus) {
      case 'Possession Taken':
        return { color: '#15803D', fillColor: '#22C55E', fillOpacity: 0.55, weight: 2 };
      case 'Compensation Disbursed':
        return { color: '#0369A1', fillColor: '#38BDF8', fillOpacity: 0.55, weight: 2 };
      case 'Award Declared':
        return { color: '#7C3AED', fillColor: '#A78BFA', fillOpacity: 0.55, weight: 2 };
      case 'Notified (Sec 11)':
        return { color: '#B45309', fillColor: '#FBBF24', fillOpacity: 0.55, weight: 2 };
      case 'Under Verification':
        return { color: '#D97706', fillColor: '#FDE047', fillOpacity: 0.55, weight: 2 };
      case 'Identified':
      default:
        return { color: '#64748B', fillColor: '#CBD5E1', fillOpacity: 0.55, weight: 2 };
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [18.5204, 73.8567], // Pune center
        zoom: 12,
        zoomControl: true,
      });

      mapInstanceRef.current = map;
      polygonLayerGroupRef.current = L.layerGroup().addTo(map);

      // Tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors | BHOOMISETU Cadastral GIS Engine',
        maxZoom: 19,
      }).addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layers when mapLayerType changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; OpenStreetMap contributors | BHOOMISETU GIS';

    if (mapLayerType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    } else if (mapLayerType === 'topo') {
      url = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
      attribution = 'Map data: &copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap (CC-BY-SA)';
    }

    L.tileLayer(url, { attribution, maxZoom: 19 }).addTo(map);
  }, [mapLayerType]);

  // Render Polygons and fit bounds
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = polygonLayerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (filteredParcels.length === 0) return;

    const bounds = L.latLngBounds([]);

    filteredParcels.forEach((parcel) => {
      if (!parcel.gpsCoordinates || parcel.gpsCoordinates.length === 0) return;

      const latLngs = parcel.gpsCoordinates.map(c => [c.lat, c.lng] as [number, number]);
      const style = getParcelStyle(parcel);

      const isSelected = inspectedParcel?.id === parcel.id;

      const polygon = L.polygon(latLngs, {
        ...style,
        weight: isSelected ? 3.5 : 2,
        color: isSelected ? '#000000' : style.color,
      });

      // Tooltip
      polygon.bindTooltip(
        `<div>
          <strong>Survey No. ${parcel.surveyNumber}</strong> (${parcel.khasraNumber})<br/>
          Village: ${parcel.village}<br/>
          Owner: ${parcel.ownerName}<br/>
          Status: ${parcel.acquisitionStatus}
        </div>`,
        { sticky: true, className: 'text-xs p-1 font-sans shadow-md rounded' }
      );

      // On Click
      polygon.on('click', () => {
        setInspectedParcel(parcel);
        if (onSelectParcel) onSelectParcel(parcel);
      });

      layerGroup.addLayer(polygon);
      latLngs.forEach(coord => bounds.extend(coord));
    });

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
    }
  }, [filteredParcels, inspectedParcel, onSelectParcel]);

  return (
    <div className="bg-white border border-gov-gray-300 rounded shadow-sm overflow-hidden flex flex-col">
      {/* Top Filter & GIS Control Bar */}
      <div className="p-3 bg-gov-gray-100 border-b border-gov-gray-200 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Project Selector */}
          <label className="flex items-center gap-1 text-xs text-gov-gray-700">
            <span className="font-semibold text-gov-navy">Project:</span>
            <select
              value={activeProjectFilter}
              onChange={(e) => {
                setActiveProjectFilter(e.target.value);
                if (e.target.value !== 'ALL') {
                  setSelectedProjectId(e.target.value);
                }
              }}
              className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white font-medium max-w-xs"
            >
              <option value="ALL">All Projects (National Cadastre)</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} — {p.name}
                </option>
              ))}
            </select>
          </label>

          {/* Status Filter */}
          <label className="flex items-center gap-1 text-xs text-gov-gray-700">
            <span className="font-semibold text-gov-navy">Status:</span>
            <select
              value={activeStatusFilter}
              onChange={(e) => setActiveStatusFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
            >
              <option value="ALL">All Acquisition Stages</option>
              <option value="Identified">Identified</option>
              <option value="Under Verification">Under Verification</option>
              <option value="Notified (Sec 11)">Notified (Sec 11)</option>
              <option value="Award Declared">Award Declared</option>
              <option value="Compensation Disbursed">Compensation Disbursed</option>
              <option value="Possession Taken">Possession Taken</option>
            </select>
          </label>

          {/* Land Type Filter */}
          <label className="flex items-center gap-1 text-xs text-gov-gray-700">
            <span className="font-semibold text-gov-navy">Category:</span>
            <select
              value={activeTypeFilter}
              onChange={(e) => setActiveTypeFilter(e.target.value)}
              className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
            >
              <option value="ALL">All Land Types</option>
              <option value="Agricultural (Wet/Irrigated)">Agricultural (Wet)</option>
              <option value="Agricultural (Dry/Rainfed)">Agricultural (Dry)</option>
              <option value="Commercial / Industrial">Commercial / Industrial</option>
              <option value="Residential Settlement">Residential Settlement</option>
              <option value="Government / Revenue Land">Government / Revenue</option>
            </select>
          </label>
        </div>

        {/* Right Search & Layer Switcher */}
        <div className="flex items-center gap-2">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 text-gov-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Survey No / Village..."
              className="pl-7 pr-2.5 py-1 text-xs border border-gov-gray-300 rounded bg-white w-48 focus:ring-1 focus:ring-gov-navy"
            />
          </div>

          {/* Map Layer Switcher */}
          <div className="flex items-center border border-gov-gray-300 rounded bg-white overflow-hidden text-xs">
            <button
              onClick={() => setMapLayerType('street')}
              className={`px-2 py-1 font-medium ${mapLayerType === 'street' ? 'bg-gov-navy text-white' : 'text-gov-gray-700 hover:bg-gov-gray-100'}`}
              title="Standard Cadastral Road Map"
            >
              Cadastral Map
            </button>
            <button
              onClick={() => setMapLayerType('satellite')}
              className={`px-2 py-1 font-medium border-l border-gov-gray-200 ${mapLayerType === 'satellite' ? 'bg-gov-navy text-white' : 'text-gov-gray-700 hover:bg-gov-gray-100'}`}
              title="ISRO / High-Res Satellite Hybrid"
            >
              Satellite
            </button>
            <button
              onClick={() => setMapLayerType('topo')}
              className={`px-2 py-1 font-medium border-l border-gov-gray-200 ${mapLayerType === 'topo' ? 'bg-gov-navy text-white' : 'text-gov-gray-700 hover:bg-gov-gray-100'}`}
              title="Topographic Elevation Layer"
            >
              Topographic
            </button>
          </div>
        </div>
      </div>

      {/* Map Body with Interactive Side Drawer */}
      <div className={`relative w-full ${heightClass} bg-slate-100`}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Legend Box (Permanent Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-white/95 backdrop-blur-xs border border-gov-gray-300 rounded p-2.5 shadow-md text-[11px] select-none max-w-xs">
          <p className="font-bold text-gov-navy mb-1.5 uppercase tracking-wider flex items-center gap-1 font-serif">
            <Layers className="w-3.5 h-3.5" />
            <span>Cadastral Status Legend</span>
          </p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#22C55E] border border-[#15803D] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Possession Taken</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#38BDF8] border border-[#0369A1] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Comp. Disbursed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#A78BFA] border border-[#7C3AED] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Award Declared</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#FBBF24] border border-[#B45309] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Notified (Sec 11)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#FDE047] border border-[#D97706] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Under Verification</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs bg-[#CBD5E1] border border-[#64748B] flex-shrink-0"></span>
              <span className="text-gov-gray-800">Identified</span>
            </div>
          </div>
          <div className="mt-2 pt-1 border-t border-gov-gray-200 text-[10px] text-gov-gray-500">
            Total Displayed: <strong>{filteredParcels.length}</strong> polygons
          </div>
        </div>

        {/* Selected Parcel Inspector Side Panel */}
        {inspectedParcel && (
          <div className="absolute top-4 right-4 z-20 w-80 bg-white border border-gov-gray-300 rounded shadow-xl p-3.5 text-xs select-none max-h-[90%] overflow-y-auto animate-in slide-in-from-right-4 duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-gov-gray-200">
              <div>
                <span className="text-[10px] font-mono text-gov-gray-500">{inspectedParcel.id}</span>
                <h4 className="text-sm font-bold text-gov-navy font-serif">
                  Survey No. {inspectedParcel.surveyNumber}
                </h4>
              </div>
              <button
                onClick={() => setInspectedParcel(null)}
                className="p-1 rounded text-gov-gray-400 hover:text-gov-gray-700 hover:bg-gov-gray-100"
                title="Close Inspector"
              >
                ✕
              </button>
            </div>

            <div className="mt-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gov-gray-500">Acquisition Stage:</span>
                <StatusBadge status={inspectedParcel.acquisitionStatus} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gov-gray-500">Verification Status:</span>
                <StatusBadge status={inspectedParcel.verificationStatus} size="sm" />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gov-gray-500">Compensation Status:</span>
                <StatusBadge status={inspectedParcel.compensationStatus} size="sm" />
              </div>

              <div className="p-2 bg-gov-gray-50 rounded border border-gov-gray-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Owner Name:</span>
                  <span className="font-semibold text-gov-gray-900">{inspectedParcel.ownerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Father / Spouse:</span>
                  <span>{inspectedParcel.ownerFatherName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Aadhaar (Masked):</span>
                  <span className="font-mono">{inspectedParcel.ownerAadhaarMasked}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Khasra Number:</span>
                  <span className="font-mono font-medium">{inspectedParcel.khasraNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Village & Taluk:</span>
                  <span>{inspectedParcel.village}, {inspectedParcel.mandalTaluk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Area:</span>
                  <span className="font-bold text-gov-navy">
                    {inspectedParcel.areaHa} Ha ({inspectedParcel.areaAcres} Acres)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Land Category:</span>
                  <span>{inspectedParcel.landType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gov-gray-500">Estimated Value:</span>
                  <span className="font-bold text-emerald-800">
                    ₹{inspectedParcel.totalCompensationEstimated} Lakhs
                  </span>
                </div>
              </div>

              {inspectedParcel.remarks && (
                <div className="p-2 bg-amber-50/70 border border-amber-200 rounded text-[11px] text-amber-950">
                  <strong>Revenue Remarks:</strong> {inspectedParcel.remarks}
                </div>
              )}

              {/* Action Buttons inside Drawer */}
              <div className="pt-2 border-t border-gov-gray-200 flex flex-col gap-1.5">
                {onNavigateToModule && (
                  <>
                    <button
                      onClick={() => onNavigateToModule('compensation')}
                      className="w-full py-1.5 px-2 bg-gov-navy text-white rounded font-semibold text-xs hover:bg-gov-navy-hover flex items-center justify-center gap-1"
                    >
                      <span>Process Compensation (Sec 23)</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onNavigateToModule('field-verification')}
                      className="w-full py-1.5 px-2 bg-emerald-800 text-white rounded font-semibold text-xs hover:bg-emerald-900 flex items-center justify-center gap-1"
                    >
                      <span>Field Officer GPS Verification</span>
                      <Crosshair className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
