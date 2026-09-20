import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const BUCKET_NAME = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'statutory-documents';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Calculates SHA-256 hex checksum of a browser File object using Web Crypto API.
 */
export async function calculateFileSha256(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export interface DocumentUploadResult {
  publicUrl: string;
  sha256Hash: string;
  fileSizeFormatted: string;
  storagePath: string;
}

/**
 * Uploads a statutory document to Supabase Storage and returns the public download URL and checksum.
 */
export async function uploadStatutoryDocument(
  file: File,
  projectCode: string,
  docCode: string,
  version: string
): Promise<DocumentUploadResult> {
  const sha256Hash = await calculateFileSha256(file);
  const fileSizeInMB = (file.size / (1024 * 1024)).toFixed(2);
  const fileSizeFormatted = `${fileSizeInMB} MB`;

  if (!supabase) {
    console.warn('Supabase not configured. Simulating cloud upload.');
    return {
      publicUrl: '#',
      sha256Hash,
      fileSizeFormatted,
      storagePath: `simulated/${projectCode}/${docCode}_${version}.pdf`,
    };
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const storagePath = `${projectCode || 'GENERAL'}/${docCode}_${version}_${Date.now()}_${cleanFileName}`;

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert: true,
      contentType: file.type || 'application/pdf',
    });

  if (error) {
    console.error('Supabase storage upload error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(data.path);

  return {
    publicUrl: publicUrlData.publicUrl,
    sha256Hash,
    fileSizeFormatted,
    storagePath: data.path,
  };
}
