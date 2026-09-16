import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconRetinaUrl: iconRetina,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: '',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
};

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
}

interface CadastralMapProps {
  parcels: Parcel[];
  onParcelSelect?: (parcel: Parcel) => void;
  selectedParcelId?: string;
}

export const CadastralMap: React.FC<CadastralMapProps> = ({ parcels, onParcelSelect }) => {
  // Center roughly around Pune coordinates where our mock data is
  const center: [number, number] = [18.520, 73.856];

  return (
    <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%', zIndex: 10 }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {parcels.map(parcel => (
        <Marker
          key={parcel.id}
          position={[parcel.lat, parcel.lng]}
          icon={createCustomIcon(statusColors[parcel.status] || '#64748b')}
          eventHandlers={{
            click: () => onParcelSelect && onParcelSelect(parcel),
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'system-ui', fontSize: '12px', minWidth: '160px' }}>
              <div style={{ fontWeight: 700, color: '#0B3559', marginBottom: '4px' }}>
                {parcel.surveyNo} — {parcel.village}
              </div>
              <div style={{ color: '#475569' }}><b>Owner:</b> {parcel.owner}</div>
              <div style={{ color: '#475569' }}><b>Area:</b> {parcel.area} Ha</div>
              <div style={{ color: '#475569' }}><b>Status:</b> {parcel.status}</div>
              <div style={{ color: '#475569' }}><b>Compensation:</b> {parcel.compensation}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};
