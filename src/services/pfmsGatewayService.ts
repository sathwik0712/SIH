/**
 * PFMS Direct Benefit Transfer (DBT) Payment Gateway Service
 * Handles validation, payload generation, disbursement callbacks, and retry triggers.
 */

export interface PFMSBeneficiaryInput {
  beneficiaryName: string;
  accountNumber: string;
  ifscCode: string;
  aadhaarNumberOrHash: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: {
    accountNumber?: string;
    ifscCode?: string;
  };
}

export interface PFMSBatchPayload {
  batchId: string;
  schemeCode: string;
  awardReferenceNo: string;
  beneficiaryName: string;
  beneficiaryAadhaarHash: string;
  accountNumberMasked: string;
  ifscCode: string;
  amountInr: number;
  createdTimestamp: string;
}

export type PFMSPaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'RETRY_SCHEDULED';

export interface PFMSDisbursalRecord {
  transactionId: string;
  batchId: string;
  beneficiaryName: string;
  accountNumberMasked: string;
  ifscCode: string;
  amountInr: number;
  status: PFMSPaymentStatus;
  utrNumber?: string;
  failureReason?: string;
  retryCount: number;
  maxRetries: number;
  settledTimestamp?: string;
  lastAttemptTimestamp: string;
}

export interface PFMSCallbackResponse {
  pfmsTransactionId: string;
  status: 'SUCCESS' | 'FAILED';
  utrNumber?: string;
  gatewayRemarks?: string;
  failureCode?: string;
}

// ---------------------------------------------------------------------------
// 1. Validation Logic
// ---------------------------------------------------------------------------

/**
 * Validates an Indian Financial System Code (IFSC).
 * Format: 4 uppercase letters + 0 + 6 alphanumeric characters. e.g. SBIN0001234
 */
export function validateIFSCCode(ifsc: string): boolean {
  if (!ifsc || typeof ifsc !== 'string') return false;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return ifscRegex.test(ifsc.trim().toUpperCase());
}

/**
 * Validates an Indian Bank Account Number.
 * Format: 9 to 18 numeric digits.
 */
export function validateAccountNumber(accountNumber: string): boolean {
  if (!accountNumber || typeof accountNumber !== 'string') return false;
  const accRegex = /^\d{9,18}$/;
  return accRegex.test(accountNumber.trim());
}

/**
 * Validates beneficiary bank account details before dispatching funds via PFMS.
 */
export function validatePFMSBeneficiary(
  accountNumber: string,
  ifscCode: string,
): ValidationResult {
  const errors: ValidationResult['errors'] = {};

  if (!validateAccountNumber(accountNumber)) {
    errors.accountNumber = 'Invalid bank account number. Must be between 9 and 18 digits.';
  }

  if (!validateIFSCCode(ifscCode)) {
    errors.ifscCode = 'Invalid IFSC code format. Must match standard format (e.g. SBIN0001234).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// ---------------------------------------------------------------------------
// 2. Payload Generation
// ---------------------------------------------------------------------------

/**
 * Masks a bank account number showing only the last 4 digits.
 */
export function maskAccountNumber(accNo: string): string {
  const clean = accNo.trim();
  if (clean.length < 4) return '****';
  return 'X'.repeat(clean.length - 4) + clean.slice(-4);
}

/**
 * Generates a mock SHA256 Aadhaar hash from an Aadhaar number or text.
 */
export function generateAadhaarHash(aadhaar: string): string {
  const clean = aadhaar.replace(/\s+/g, '');
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `SHA256:aadhaar_${hex}_2026`;
}

/**
 * Generates a simulated PFMS DBT payment batch payload.
 */
export function generatePFMSBatchPayload(
  beneficiary: PFMSBeneficiaryInput,
  amountInr: number,
  awardRef: string = 'LAC/2026/001',
  batchSeq?: number,
): PFMSBatchPayload {
  const validation = validatePFMSBeneficiary(beneficiary.accountNumber, beneficiary.ifscCode);
  if (!validation.isValid) {
    throw new Error(`Beneficiary validation failed: ${JSON.stringify(validation.errors)}`);
  }

  if (amountInr <= 0) {
    throw new Error('Disbursal amount must be greater than zero');
  }

  const seq = batchSeq ?? Math.floor(1000 + Math.random() * 9000);
  const batchId = `BATCH-2026-PFMS-${String(seq).padStart(4, '0')}`;

  return {
    batchId,
    schemeCode: 'RFCTLARR-DBT-2026',
    awardReferenceNo: awardRef,
    beneficiaryName: beneficiary.beneficiaryName.trim(),
    beneficiaryAadhaarHash: generateAadhaarHash(beneficiary.aadhaarNumberOrHash),
    accountNumberMasked: maskAccountNumber(beneficiary.accountNumber),
    ifscCode: beneficiary.ifscCode.trim().toUpperCase(),
    amountInr,
    createdTimestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// 3. Payment Processing, Callbacks & Retries
// ---------------------------------------------------------------------------

/**
 * Processes a PFMS payment callback and updates the disbursal record status.
 */
export function handlePFMSCallback(
  record: PFMSDisbursalRecord,
  callback: PFMSCallbackResponse,
): PFMSDisbursalRecord {
  if (callback.status === 'SUCCESS') {
    return {
      ...record,
      status: 'SUCCESS',
      utrNumber: callback.utrNumber || `UTR2026PFMS${Math.floor(100000 + Math.random() * 900000)}`,
      settledTimestamp: new Date().toISOString(),
      failureReason: undefined,
    };
  }

  return {
    ...record,
    status: 'FAILED',
    failureReason: callback.gatewayRemarks || callback.failureCode || 'Payment gateway transaction failed',
  };
}

/**
 * Triggers a payment retry for a failed PFMS disbursal record.
 * Throws an error if max retries limit has been reached.
 */
export function triggerPaymentRetry(record: PFMSDisbursalRecord): PFMSDisbursalRecord {
  if (record.status !== 'FAILED') {
    throw new Error(`Cannot retry transaction with status: ${record.status}`);
  }

  if (record.retryCount >= record.maxRetries) {
    throw new Error(`Max retries (${record.maxRetries}) reached for transaction ${record.transactionId}`);
  }

  const newRetryCount = record.retryCount + 1;
  const newBatchId = `${record.batchId}-RETRY-${newRetryCount}`;

  return {
    ...record,
    batchId: newBatchId,
    status: 'RETRY_SCHEDULED',
    retryCount: newRetryCount,
    lastAttemptTimestamp: new Date().toISOString(),
  };
}
