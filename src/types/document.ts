export type DocumentCategory =
  | 'STATUTORY_GAZETTE'
  | 'TECHNICAL_DPR'
  | 'SIA_REPORT'
  | 'AWARD_STATEMENT'
  | 'COURT_ORDER'
  | 'SURVEY_CADASTRAL';

export type FileType = 'PDF' | 'DWG' | 'KML' | 'DOCX' | 'XLSX';

export interface DocumentVersion {
  version: string; // e.g., 'v1.0', 'v1.1', 'v2.0'
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  fileType: FileType;
  sha256Hash: string; // 64-character SHA-256 cryptographic checksum
  amendmentReason: string;
  downloadUrl: string;
}

export interface ManagedDocument {
  id: string;
  docCode: string; // e.g., 'DOC-DPR-001'
  title: string;
  category: DocumentCategory;
  projectCode: string;
  projectName: string;
  currentVersion: string;
  versions: DocumentVersion[];
}
