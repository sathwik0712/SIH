import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LandParcel, LandType, OwnershipStatus, VerificationStatus } from '../types';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { DataTable, Column } from '../components/common/DataTable';
import { StatusBadge } from '../components/common/StatusBadge';
import { Modal } from '../components/common/Modal';
import { 
  MapPin, Plus, Crosshair, CheckCircle2, 
  AlertTriangle, Smartphone, Map, Download 
} from 'lucide-react';

interface LandParcelsPageProps {
  onNavigate: (module: string, projectId?: string) => void;
}

export const LandParcelsPage: React.FC<LandParcelsPageProps> = ({ onNavigate }) => {
  const { parcels, projects, addParcel, setSelectedProjectId } = useApp();

  const [filterProject, setFilterProject] = useState<string>('ALL');
  const [filterVerification, setFilterVerification] = useState<string>('ALL');
  const [filterLandType, setFilterLandType] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedParcelForDetails, setSelectedParcelForDetails] = useState<LandParcel | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    projectId: projects[0]?.id || 'PRJ-101',
    surveyNumber: '',
    khasraNumber: '',
    village: 'Loni Kalbhor',
    mandalTaluk: 'Haveli',
    district: 'Pune',
    state: 'Maharashtra',
    areaAcres: 4.5,
    landType: 'Agricultural (Wet/Irrigated)' as LandType,
    ownershipStatus: 'Clear Title' as OwnershipStatus,
    ownerName: '',
    ownerFatherName: '',
    ownerAadhaarMasked: 'XXXX-XXXX-9901',
    ownerContact: '9822000000',
    marketRatePerAcre: 45.0,
    remarks: 'Boundary verified through digital revenue records.',
  });

  const filteredParcels = parcels.filter((p) => {
    if (filterProject !== 'ALL' && p.projectId !== filterProject) return false;
    if (filterVerification !== 'ALL' && p.verificationStatus !== filterVerification) return false;
    if (filterLandType !== 'ALL' && p.landType !== filterLandType) return false;
    return true;
  });

  const columns: Column<LandParcel>[] = [
    {
      key: 'id',
      header: 'Parcel ID',
      sortable: true,
      render: (p) => <span className="font-mono text-xs font-semibold text-gov-gray-700">{p.id}</span>,
      width: '110px',
    },
    {
      key: 'surveyNumber',
      header: 'Survey / Khasra No.',
      sortable: true,
      render: (p) => (
        <div>
          <span className="font-bold text-gov-navy text-xs">Survey {p.surveyNumber}</span>
          <div className="text-[10px] text-gov-gray-500 font-mono">Khasra {p.khasraNumber}</div>
        </div>
      ),
      width: '130px',
    },
    {
      key: 'village',
      header: 'Village & Taluk',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-medium text-gov-gray-900">{p.village}</div>
          <div className="text-[10px] text-gov-gray-500">{p.mandalTaluk}, {p.district}</div>
        </div>
      ),
    },
    {
      key: 'areaAcres',
      header: 'Area (Ac / Ha)',
      sortable: true,
      align: 'right',
      render: (p) => (
        <div>
          <span className="font-bold text-gov-gray-900">{p.areaAcres} Ac</span>
          <div className="text-[10px] text-gov-gray-500">({p.areaHa} Ha)</div>
        </div>
      ),
      width: '110px',
    },
    {
      key: 'landType',
      header: 'Land Category',
      sortable: true,
      render: (p) => <span className="text-[11px] text-gov-gray-700">{p.landType}</span>,
    },
    {
      key: 'ownerName',
      header: 'Registered Landowner',
      sortable: true,
      render: (p) => (
        <div>
          <div className="font-semibold text-gov-gray-900">{p.ownerName}</div>
          <div className="text-[10px] text-gov-gray-500">s/o {p.ownerFatherName}</div>
        </div>
      ),
    },
    {
      key: 'verificationStatus',
      header: 'Verification',
      sortable: true,
      align: 'center',
      render: (p) => <StatusBadge status={p.verificationStatus} size="sm" />,
      width: '120px',
    },
    {
      key: 'acquisitionStatus',
      header: 'Acquisition Stage',
      sortable: true,
      align: 'center',
      render: (p) => <StatusBadge status={p.acquisitionStatus} size="sm" />,
      width: '130px',
    },
    {
      key: 'totalCompensationEstimated',
      header: 'Est. Valuation',
      sortable: true,
      align: 'right',
      render: (p) => <span className="font-bold text-emerald-800">₹{p.totalCompensationEstimated} L</span>,
      width: '110px',
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'center',
      render: (p) => (
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={() => setSelectedParcelForDetails(p)}
            className="px-2 py-0.5 bg-gov-navy text-white text-[11px] rounded font-medium hover:bg-gov-navy-hover"
          >
            Inspect
          </button>
          <button
            onClick={() => onNavigate('field-verification')}
            className="p-1 text-emerald-700 hover:bg-emerald-50 rounded"
            title="Open Mobile Field Verification"
          >
            <Smartphone className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
      width: '100px',
    },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.surveyNumber.trim()) return;

    const areaHa = +(formData.areaAcres * 0.404686).toFixed(2);
    const compEst = +(formData.areaAcres * formData.marketRatePerAcre * 2.2).toFixed(2);
    const selectedProj = projects.find(p => p.id === formData.projectId);

    // Mock polygon near Pune
    const centerLat = 18.5204 + (Math.random() - 0.5) * 0.05;
    const centerLng = 73.8567 + (Math.random() - 0.5) * 0.05;
    const polygon = [
      { lat: +(centerLat - 0.0015).toFixed(6), lng: +(centerLng - 0.0015).toFixed(6) },
      { lat: +(centerLat + 0.0015).toFixed(6), lng: +(centerLng - 0.0015).toFixed(6) },
      { lat: +(centerLat + 0.0015).toFixed(6), lng: +(centerLng + 0.0015).toFixed(6) },
      { lat: +(centerLat - 0.0015).toFixed(6), lng: +(centerLng + 0.0015).toFixed(6) },
    ];

    addParcel({
      projectId: formData.projectId,
      surveyNumber: formData.surveyNumber,
      khasraNumber: formData.khasraNumber || `KH-${Math.floor(Math.random() * 900) + 100}`,
      village: formData.village,
      mandalTaluk: formData.mandalTaluk,
      district: selectedProj?.district || formData.district,
      state: selectedProj?.state || formData.state,
      areaHa,
      areaAcres: Number(formData.areaAcres),
      landType: formData.landType,
      ownershipStatus: formData.ownershipStatus,
      verificationStatus: 'Pending',
      acquisitionStatus: 'Identified',
      compensationStatus: 'Not Assessed',
      ownerName: formData.ownerName,
      ownerFatherName: formData.ownerFatherName,
      ownerAadhaarMasked: formData.ownerAadhaarMasked,
      ownerContact: formData.ownerContact,
      marketRatePerAcre: Number(formData.marketRatePerAcre),
      totalCompensationEstimated: compEst,
      gpsCoordinates: polygon,
      centerCoordinate: { lat: centerLat, lng: centerLng },
      remarks: formData.remarks,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4">
      <Breadcrumbs items={[{ label: 'Land Parcel Cadastre' }]} />

      {/* Action Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gov-gray-300 pb-3">
        <div>
          <h2 className="text-xl font-bold text-gov-navy font-serif">
            National Land Parcel Cadastral Registry
          </h2>
          <p className="text-xs text-gov-gray-600">
            Cadastral boundary survey records, title verification, and valuation index under Section 4/11
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('gis-map')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gov-navy border border-gov-navy text-xs font-semibold rounded hover:bg-blue-50 transition-colors shadow-2xs"
          >
            <Map className="w-3.5 h-3.5" />
            <span>Open GIS Map</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover transition-colors shadow-2xs"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Land Parcel</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-3 bg-gov-gray-100 border border-gov-gray-300 rounded flex flex-wrap items-center gap-3 text-xs">
        <span className="font-bold text-gov-navy uppercase tracking-wider">Filters:</span>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Project:</span>
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white max-w-xs"
          >
            <option value="ALL">All Projects ({projects.length})</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.code} — {p.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Verification:</span>
          <select
            value={filterVerification}
            onChange={(e) => setFilterVerification(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Verification States</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Discrepancy Found">Discrepancy Found</option>
          </select>
        </label>

        <label className="flex items-center gap-1">
          <span className="text-gov-gray-700">Land Category:</span>
          <select
            value={filterLandType}
            onChange={(e) => setFilterLandType(e.target.value)}
            className="px-2 py-1 text-xs border border-gov-gray-300 rounded bg-white"
          >
            <option value="ALL">All Categories</option>
            <option value="Agricultural (Wet/Irrigated)">Agricultural (Wet)</option>
            <option value="Agricultural (Dry/Rainfed)">Agricultural (Dry)</option>
            <option value="Commercial / Industrial">Commercial / Industrial</option>
            <option value="Residential Settlement">Residential Settlement</option>
            <option value="Government / Revenue Land">Government / Revenue</option>
          </select>
        </label>
      </div>

      {/* Main Table */}
      <DataTable
        columns={columns}
        data={filteredParcels}
        searchPlaceholder="Search by Survey No, Khasra, Owner, or Village..."
        title={`Land Parcels Cadastre (${filteredParcels.length} records)`}
        subtitle="Search and verify statutory land records mapped across national infrastructure corridors"
        exportFileName="bhoomisetu_land_parcels"
      />

      {/* Add Parcel Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Land Parcel to Statutory Cadastre"
        subtitle="Enter cadastral survey particulars & ownership record from State Land Records (RoR)"
        maxWidth="3xl"
        actions={
          <>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="px-3 py-1.5 border border-gov-gray-300 rounded bg-white text-gov-gray-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleAddSubmit}
              className="px-4 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Save Cadastral Record
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="md:col-span-3">
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Select Infrastructure Project <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.code} — {p.name} ({p.district}, {p.state})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Survey Number <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.surveyNumber}
                onChange={(e) => setFormData({ ...formData, surveyNumber: e.target.value })}
                placeholder="e.g. 154/2B"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Khasra Number
              </label>
              <input
                type="text"
                value={formData.khasraNumber}
                onChange={(e) => setFormData({ ...formData, khasraNumber: e.target.value })}
                placeholder="e.g. KH-982"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Area in Acres <span className="text-red-600">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.areaAcres}
                onChange={(e) => setFormData({ ...formData, areaAcres: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Village Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Mandal / Taluk <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.mandalTaluk}
                onChange={(e) => setFormData({ ...formData, mandalTaluk: e.target.value })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Land Classification <span className="text-red-600">*</span>
              </label>
              <select
                value={formData.landType}
                onChange={(e) => setFormData({ ...formData, landType: e.target.value as LandType })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              >
                <option value="Agricultural (Wet/Irrigated)">Agricultural (Wet/Irrigated)</option>
                <option value="Agricultural (Dry/Rainfed)">Agricultural (Dry/Rainfed)</option>
                <option value="Commercial / Industrial">Commercial / Industrial</option>
                <option value="Residential Settlement">Residential Settlement</option>
                <option value="Government / Revenue Land">Government / Revenue Land</option>
                <option value="Gram Kantham (Abadi)">Gram Kantham (Abadi)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Registered Landowner Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="e.g. Shri Rameshwar Patil"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Father / Husband Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.ownerFatherName}
                onChange={(e) => setFormData({ ...formData, ownerFatherName: e.target.value })}
                placeholder="e.g. Tukaram Patil"
                className="w-full p-2 border border-gov-gray-300 rounded text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-gov-gray-700 mb-1">
                Market Rate per Acre (₹ Lakhs)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.marketRatePerAcre}
                onChange={(e) => setFormData({ ...formData, marketRatePerAcre: Number(e.target.value) })}
                className="w-full p-2 border border-gov-gray-300 rounded text-xs font-bold text-emerald-800"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-gov-gray-700 mb-1">
              Field Officer Remarks / RoR Reference
            </label>
            <input
              type="text"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              className="w-full p-2 border border-gov-gray-300 rounded text-xs"
            />
          </div>
        </form>
      </Modal>

      {/* Inspect Parcel Details Modal */}
      {selectedParcelForDetails && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedParcelForDetails(null)}
          title={`Cadastral Survey Record: Survey No. ${selectedParcelForDetails.surveyNumber}`}
          subtitle={`Parcel ID: ${selectedParcelForDetails.id} | Village: ${selectedParcelForDetails.village}`}
          maxWidth="2xl"
          actions={
            <button
              onClick={() => setSelectedParcelForDetails(null)}
              className="px-3 py-1.5 bg-gov-navy text-white text-xs font-semibold rounded hover:bg-gov-navy-hover"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-3 p-3 bg-gov-gray-50 rounded border border-gov-gray-200">
              <div>
                <span className="text-gov-gray-500 block">Owner Name:</span>
                <span className="font-bold text-gov-gray-900 text-sm">{selectedParcelForDetails.ownerName}</span>
                <div className="text-[11px] text-gov-gray-600">s/o {selectedParcelForDetails.ownerFatherName}</div>
              </div>
              <div>
                <span className="text-gov-gray-500 block">Aadhaar (Masked):</span>
                <span className="font-mono font-semibold">{selectedParcelForDetails.ownerAadhaarMasked}</span>
                <div className="text-[11px] text-gov-gray-600">Contact: {selectedParcelForDetails.ownerContact}</div>
              </div>
              <div>
                <span className="text-gov-gray-500 block">Area:</span>
                <span className="font-bold text-gov-navy">{selectedParcelForDetails.areaAcres} Acres ({selectedParcelForDetails.areaHa} Hectares)</span>
              </div>
              <div>
                <span className="text-gov-gray-500 block">Estimated Valuation:</span>
                <span className="font-bold text-emerald-800 text-sm">₹{selectedParcelForDetails.totalCompensationEstimated} Lakhs</span>
              </div>
              <div>
                <span className="text-gov-gray-500 block">Verification Status:</span>
                <StatusBadge status={selectedParcelForDetails.verificationStatus} size="sm" />
              </div>
              <div>
                <span className="text-gov-gray-500 block">Acquisition Stage:</span>
                <StatusBadge status={selectedParcelForDetails.acquisitionStatus} size="sm" />
              </div>
            </div>

            {selectedParcelForDetails.verifiedByOfficer && (
              <div className="p-2.5 bg-emerald-50 rounded border border-emerald-200 text-[11px] text-emerald-950">
                <strong>Field Verification Signoff:</strong> Completed on {selectedParcelForDetails.verificationDate} by {selectedParcelForDetails.verifiedByOfficer}.
              </div>
            )}

            {selectedParcelForDetails.remarks && (
              <div className="p-2.5 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-950">
                <strong>Remarks:</strong> {selectedParcelForDetails.remarks}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
