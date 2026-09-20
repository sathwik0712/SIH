import React from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const statusColors: Record<string, string> = {
  ACQUIRED: '#16a34a',
  PENDING:  '#d97706',
  DISPUTED: '#dc2626',
  NOTIFIED: '#2563eb',
};

export interface Parcel {
  id: string;
  surveyNo: string;
  owner: string;
  area: number;
  status: 'ACQUIRED' | 'PENDING' | 'DISPUTED' | 'NOTIFIED';
  lat: number;
  lng: number;
  village: string;
  compensation: string;
  /** GeoJSON-style polygon ring: [[lat, lng], [lat, lng], ...] */
  boundary?: [number, number][];
}

interface CadastralMapProps {
  parcels: Parcel[];
  onParcelSelect?: (parcel: Parcel) => void;
  selectedParcelId?: string;
}

/**
 * Generates a rough rectangular boundary around a center point based on parcel area.
 * Used as a fallback when no explicit boundary coordinates are provided.
 * At latitude ~18.5°, 1° ≈ 111 km.
 */
function generateFallbackBoundary(lat: number, lng: number, areaHa: number): [number, number][] {
  const sideMeters = Math.sqrt(areaHa * 10000);
  const latOffset = (sideMeters / 2) / 111000;
  const lngOffset = (sideMeters / 2) / (111000 * Math.cos((lat * Math.PI) / 180));

  // Slightly irregular quadrilateral for realism
  return [
    [lat - latOffset * 0.9, lng - lngOffset * 1.05],
    [lat - latOffset * 1.1, lng + lngOffset * 0.95],
    [lat + latOffset * 1.05, lng + lngOffset * 1.1],
    [lat + latOffset * 0.95, lng - lngOffset * 0.9],
  ];
}

export const CadastralMap: React.FC<CadastralMapProps> = ({ parcels, onParcelSelect, selectedParcelId }) => {
  // Center roughly around Pune coordinates where our mock data is
  const center: [number, number] = [18.520, 73.856];

  return (
    <MapContainer center={center} zoom={14} style={{ height: '100%', width: '100%', zIndex: 10 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parcels.map(parcel => {
        const color = statusColors[parcel.status] || '#64748b';
        const isSelected = parcel.id === selectedParcelId;
        const positions = parcel.boundary || generateFallbackBoundary(parcel.lat, parcel.lng, parcel.area);

        return (
          <Polygon
            key={parcel.id}
            positions={positions}
            pathOptions={{
              color: isSelected ? '#1e40af' : color,
              fillColor: color,
              fillOpacity: isSelected ? 0.45 : 0.3,
              weight: isSelected ? 3 : 2,
              dashArray: parcel.status === 'DISPUTED' ? '6 4' : undefined,
            }}
            eventHandlers={{
              click: () => onParcelSelect && onParcelSelect(parcel),
            }}
          >
            <Tooltip
              direction="center"
              permanent
              className="parcel-label"
            >
              <span style={{
                fontSize: '10px',
                fontWeight: 700,
                fontFamily: 'ui-monospace, monospace',
                color: '#0B3559',
                background: 'rgba(255,255,255,0.85)',
                padding: '1px 4px',
                borderRadius: '2px',
                border: `1px solid ${color}`,
              }}>
                {parcel.surveyNo}
              </span>
            </Tooltip>
            <Popup>
              <div style={{ fontFamily: 'system-ui', fontSize: '12px', minWidth: '180px' }}>
                <div style={{ fontWeight: 700, color: '#0B3559', marginBottom: '4px', borderBottom: `2px solid ${color}`, paddingBottom: '4px' }}>
                  📐 {parcel.surveyNo} — {parcel.village}
                </div>
                <div style={{ color: '#475569' }}><b>Owner:</b> {parcel.owner}</div>
                <div style={{ color: '#475569' }}><b>Area:</b> {parcel.area} Ha</div>
                <div style={{ color: '#475569' }}><b>Status:</b> {parcel.status}</div>
                <div style={{ color: '#475569' }}><b>Compensation:</b> {parcel.compensation}</div>
              </div>
            </Popup>
          </Polygon>
        );
      })}
    </MapContainer>
  );
};
