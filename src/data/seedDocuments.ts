import { ManagedDocument } from '../types/document';

export const SEED_MANAGED_DOCUMENTS: ManagedDocument[] = [
  {
    id: 'doc-mgt-01',
    docCode: 'DOC-DPR-NHAI-014',
    title: 'Detailed Project Report (DPR) & Alignment Survey',
    category: 'TECHNICAL_DPR',
    projectCode: 'NHAI-DME-PKG-14',
    projectName: 'Delhi-Mumbai Expressway (Package 14)',
    currentVersion: 'v2.1',
    versions: [
      {
        version: 'v2.1',
        uploadedAt: '2026-02-15 11:30 AM',
        uploadedBy: 'Shri R. K. Sharma (CALA Vadodara)',
        fileSize: '14.2 MB',
        fileType: 'PDF',
        sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        amendmentReason: 'Re-aligned 2.4 km spur to avoid eco-sensitive wetland buffer zone in Vadodara.',
        downloadUrl: '#'
      },
      {
        version: 'v2.0',
        uploadedAt: '2025-11-20 04:15 PM',
        uploadedBy: 'NHAI Technical Alignment Cell',
        fileSize: '13.8 MB',
        fileType: 'PDF',
        sha256Hash: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
        amendmentReason: 'Incorporated revised land acquisition cost estimates and interchanges.',
        downloadUrl: '#'
      },
      {
        version: 'v1.0',
        uploadedAt: '2025-01-10 09:00 AM',
        uploadedBy: 'Consultant DPR Agency',
        fileSize: '11.5 MB',
        fileType: 'PDF',
        sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
        amendmentReason: 'Initial statutory DPR submission for Section 4 Requisition.',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'doc-mgt-02',
    docCode: 'DOC-GAZ-SEC11-MH01',
    title: 'Section 11(1) Preliminary Gazette Notification',
    category: 'STATUTORY_GAZETTE',
    projectCode: 'MAHSR-BULLET-C4',
    projectName: 'Mumbai-Ahmedabad High-Speed Rail Corridor',
    currentVersion: 'v1.2',
    versions: [
      {
        version: 'v1.2',
        uploadedAt: '2025-10-18 02:45 PM',
        uploadedBy: 'State Gazette Press, Mumbai',
        fileSize: '2.4 MB',
        fileType: 'PDF',
        sha256Hash: '7d8f9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
        amendmentReason: 'Corrected 4 land khasra numbers in Palghar Taluk per High Court order.',
        downloadUrl: '#'
      },
      {
        version: 'v1.0',
        uploadedAt: '2025-03-10 10:00 AM',
        uploadedBy: 'Collector Office Palghar',
        fileSize: '2.1 MB',
        fileType: 'PDF',
        sha256Hash: '3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b',
        amendmentReason: 'Initial Gazette publication under S.O. 1892(E).',
        downloadUrl: '#'
      }
    ]
  },
  {
    id: 'doc-mgt-03',
    docCode: 'DOC-SIA-KEN-BETWA',
    title: 'Social Impact Assessment (SIA) & R&R Plan',
    category: 'SIA_REPORT',
    projectCode: 'NWDA-KEN-BETWA-01',
    projectName: 'Ken-Betwa River Interlinking Project',
    currentVersion: 'v2.0',
    versions: [
      {
        version: 'v2.0',
        uploadedAt: '2025-05-12 05:00 PM',
        uploadedBy: 'Empanelled SIA Expert Group, MP',
        fileSize: '9.6 MB',
        fileType: 'PDF',
        sha256Hash: '4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
        amendmentReason: 'Updated tribal family resettlement entitlements per Panna District Public Hearings.',
        downloadUrl: '#'
      },
      {
        version: 'v1.0',
        uploadedAt: '2025-02-15 01:20 PM',
        uploadedBy: 'NWDA Social Cell',
        fileSize: '7.8 MB',
        fileType: 'PDF',
        sha256Hash: '9e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2f1e0d9c8b7a6f5e4d3c2b1a0f9e8d',
        amendmentReason: 'Preliminary Social Impact Assessment draft.',
        downloadUrl: '#'
      }
    ]
  }
];

export function getSeedDocuments(): ManagedDocument[] {
  return SEED_MANAGED_DOCUMENTS;
}
