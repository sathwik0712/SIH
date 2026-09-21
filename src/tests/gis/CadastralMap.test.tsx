import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CadastralMap,
  parseGeoJsonPolygon,
  getParcelStyle,
  generateFallbackBoundary,
  statusColors,
  type Parcel,
} from '../../components/gis/CadastralMap';

// Mock react-leaflet components for JSDOM test environment
vi.mock('react-leaflet', () => {
  return {
    MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
    TileLayer: () => <div data-testid="tile-layer" />,
    Polygon: ({ children, positions, pathOptions, eventHandlers }: any) => (
      <div
        data-testid="parcel-polygon"
        data-positions={JSON.stringify(positions)}
        data-fillcolor={pathOptions?.fillColor}
        data-color={pathOptions?.color}
        data-dasharray={pathOptions?.dashArray || ''}
        data-weight={pathOptions?.weight}
        data-fillopacity={pathOptions?.fillOpacity}
        onClick={eventHandlers?.click}
      >
        {children}
      </div>
    ),
    Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
    Tooltip: ({ children }: any) => <div data-testid="tooltip">{children}</div>,
  };
});

describe('CadastralMap GeoJSON & Boundary Unit Test Suite', () => {
  const mockParcels: Parcel[] = [
    {
      id: 'LP-001',
      surveyNo: '142/1A',
      owner: 'Ramesh Patil',
      area: 2.5,
      status: 'ACQUIRED',
      lat: 18.52,
      lng: 73.85,
      village: 'Khed Shivapur',
      compensation: '₹45,00,000',
      boundary: [
        [18.52, 73.85],
        [18.521, 73.851],
        [18.522, 73.85],
        [18.52, 73.85],
      ],
    },
    {
      id: 'LP-002',
      surveyNo: '142/1B',
      owner: 'Sunita Deshpande',
      area: 1.8,
      status: 'PENDING',
      lat: 18.525,
      lng: 73.855,
      village: 'Khed Shivapur',
      compensation: '₹32,40,000',
    },
    {
      id: 'LP-003',
      surveyNo: '143/2',
      owner: 'Govind Shinde',
      area: 3.1,
      status: 'DISPUTED',
      lat: 18.53,
      lng: 73.86,
      village: 'Bhosari',
      compensation: '₹55,80,000',
    },
  ];

  // =========================================================================
  // 1. Parsing GeoJSON Polygon Coordinate Arrays
  // =========================================================================
  describe('Parsing GeoJSON Polygon Coordinate Arrays', () => {
    it('parses direct Leaflet [lat, lng] array without modification', () => {
      const input: [number, number][] = [
        [18.52, 73.85],
        [18.521, 73.851],
        [18.522, 73.852],
      ];
      const parsed = parseGeoJsonPolygon(input);
      expect(parsed).toEqual(input);
    });

    it('parses standard GeoJSON Polygon object with [lng, lat] coordinates to Leaflet [lat, lng]', () => {
      const geoJsonFeature = {
        type: 'Polygon',
        coordinates: [
          [
            [73.85, 18.52],
            [73.851, 18.521],
            [73.852, 18.522],
            [73.85, 18.52],
          ],
        ],
      };

      const parsed = parseGeoJsonPolygon(geoJsonFeature);
      expect(parsed).toEqual([
        [18.52, 73.85],
        [18.521, 73.851],
        [18.522, 73.852],
        [18.52, 73.85],
      ]);
    });

    it('parses raw GeoJSON coordinate ring [[[lng, lat], ...]]', () => {
      const rawRing: number[][][] = [
        [
          [73.85, 18.52],
          [73.86, 18.53],
          [73.87, 18.54],
        ],
      ];

      const parsed = parseGeoJsonPolygon(rawRing);
      expect(parsed).toEqual([
        [18.52, 73.85],
        [18.53, 73.86],
        [18.54, 73.87],
      ]);
    });

    it('generates fallback boundary ring when no explicit boundary coordinates are present', () => {
      const boundary = generateFallbackBoundary(18.52, 73.85, 2.5);
      expect(boundary).toHaveLength(4);
      expect(boundary[0]).toHaveLength(2);
      expect(typeof boundary[0][0]).toBe('number');
      expect(typeof boundary[0][1]).toBe('number');
    });

    it('renders polygon positions from parcel boundary in component', () => {
      render(<CadastralMap parcels={[mockParcels[0]]} />);

      const polygons = screen.getAllByTestId('parcel-polygon');
      expect(polygons).toHaveLength(1);

      const positions = JSON.parse(polygons[0].getAttribute('data-positions')!);
      expect(positions).toEqual(mockParcels[0].boundary);
    });
  });

  // =========================================================================
  // 2. Mapping Parcel Acquisition Status to UI Styles
  // =========================================================================
  describe('Mapping Parcel Acquisition Status to UI Styles', () => {
    it('maps ACQUIRED status to green fill (#16a34a)', () => {
      expect(statusColors.ACQUIRED).toBe('#16a34a');

      const style = getParcelStyle('ACQUIRED', false);
      expect(style.fillColor).toBe('#16a34a');
      expect(style.color).toBe('#16a34a');
      expect(style.dashArray).toBeUndefined();
    });

    it('maps PENDING status to amber fill (#d97706)', () => {
      expect(statusColors.PENDING).toBe('#d97706');

      const style = getParcelStyle('PENDING', false);
      expect(style.fillColor).toBe('#d97706');
      expect(style.color).toBe('#d97706');
      expect(style.dashArray).toBeUndefined();
    });

    it('maps DISPUTED status to red fill (#dc2626) with dashed stroke ("6 4")', () => {
      expect(statusColors.DISPUTED).toBe('#dc2626');

      const style = getParcelStyle('DISPUTED', false);
      expect(style.fillColor).toBe('#dc2626');
      expect(style.color).toBe('#dc2626');
      expect(style.dashArray).toBe('6 4');
    });

    it('maps NOTIFIED status to blue fill (#2563eb)', () => {
      expect(statusColors.NOTIFIED).toBe('#2563eb');

      const style = getParcelStyle('NOTIFIED', false);
      expect(style.fillColor).toBe('#2563eb');
    });

    it('applies selection styling (darker border #1e40af, weight 3, opacity 0.45) when selected', () => {
      const unselectedStyle = getParcelStyle('ACQUIRED', false);
      const selectedStyle = getParcelStyle('ACQUIRED', true);

      expect(unselectedStyle.weight).toBe(2);
      expect(unselectedStyle.fillOpacity).toBe(0.3);

      expect(selectedStyle.color).toBe('#1e40af');
      expect(selectedStyle.weight).toBe(3);
      expect(selectedStyle.fillOpacity).toBe(0.45);
    });

    it('renders correct fill color and dashArray in CadastralMap component', () => {
      render(<CadastralMap parcels={mockParcels} />);

      const polygons = screen.getAllByTestId('parcel-polygon');
      expect(polygons).toHaveLength(3);

      // ACQUIRED (LP-001)
      expect(polygons[0]).toHaveAttribute('data-fillcolor', '#16a34a');
      expect(polygons[0]).toHaveAttribute('data-dasharray', '');

      // PENDING (LP-002)
      expect(polygons[1]).toHaveAttribute('data-fillcolor', '#d97706');
      expect(polygons[1]).toHaveAttribute('data-dasharray', '');

      // DISPUTED (LP-003)
      expect(polygons[2]).toHaveAttribute('data-fillcolor', '#dc2626');
      expect(polygons[2]).toHaveAttribute('data-dasharray', '6 4');
    });
  });

  // =========================================================================
  // 3. Selection Behavior on Parcel Boundary Click
  // =========================================================================
  describe('Parcel Polygon Selection Behavior', () => {
    it('triggers onParcelSelect callback when clicking a parcel boundary polygon', () => {
      const handleSelect = vi.fn();
      render(<CadastralMap parcels={mockParcels} onParcelSelect={handleSelect} />);

      const polygons = screen.getAllByTestId('parcel-polygon');
      fireEvent.click(polygons[0]);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith(mockParcels[0]);
    });

    it('triggers onParcelSelect with correct parcel when clicking second parcel', () => {
      const handleSelect = vi.fn();
      render(<CadastralMap parcels={mockParcels} onParcelSelect={handleSelect} />);

      const polygons = screen.getAllByTestId('parcel-polygon');
      fireEvent.click(polygons[1]);

      expect(handleSelect).toHaveBeenCalledTimes(1);
      expect(handleSelect).toHaveBeenCalledWith(mockParcels[1]);
    });

    it('renders selected styling on polygon corresponding to selectedParcelId', () => {
      render(<CadastralMap parcels={mockParcels} selectedParcelId="LP-002" />);

      const polygons = screen.getAllByTestId('parcel-polygon');

      // LP-001 is unselected
      expect(polygons[0]).toHaveAttribute('data-color', '#16a34a');
      expect(polygons[0]).toHaveAttribute('data-weight', '2');

      // LP-002 is selected
      expect(polygons[1]).toHaveAttribute('data-color', '#1e40af');
      expect(polygons[1]).toHaveAttribute('data-weight', '3');
      expect(polygons[1]).toHaveAttribute('data-fillopacity', '0.45');
    });
  });
});
