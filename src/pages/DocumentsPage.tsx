import React from 'react';
import { DocumentVersionManager } from '../components/documents/DocumentVersionManager';

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <DocumentVersionManager projectCode="ALL" />
    </div>
  );
};

export default DocumentsPage;
