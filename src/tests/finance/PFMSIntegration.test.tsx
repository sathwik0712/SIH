import { describe, it, expect } from 'vitest';
import {
  validateIFSCCode,
  validateAccountNumber,
  validatePFMSBeneficiary,
  generatePFMSBatchPayload,
  maskAccountNumber,
  generateAadhaarHash,
  handlePFMSCallback,
  triggerPaymentRetry,
  type PFMSBeneficiaryInput,
  type PFMSDisbursalRecord,
  type PFMSCallbackResponse,
} from '../../services/pfmsGatewayService';

describe('PFMS Direct Benefit Transfer (DBT) Payment Gateway Suite', () => {
  // =========================================================================
  // 1. Beneficiary Bank Account & IFSC Format Validation
  // =========================================================================
  describe('Beneficiary Bank Account & IFSC Code Format Validation', () => {
    it('validates correct Indian IFSC codes (4 uppercase letters + 0 + 6 alphanumeric)', () => {
      expect(validateIFSCCode('SBIN0001234')).toBe(true);
      expect(validateIFSCCode('HDFC0000240')).toBe(true);
      expect(validateIFSCCode('ICIC0000123')).toBe(true);
      expect(validateIFSCCode('PUNB0123456')).toBe(true);
    });

    it('rejects invalid IFSC code formats', () => {
      expect(validateIFSCCode('SBIN1001234')).toBe(false); // 5th character not '0'
      expect(validateIFSCCode('SBIN001')).toBe(false); // too short
      expect(validateIFSCCode('12340001234')).toBe(false); // starts with numbers
      expect(validateIFSCCode('')).toBe(false); // empty
    });

    it('validates correct Indian bank account numbers (9 to 18 digits)', () => {
      expect(validateAccountNumber('123456789')).toBe(true); // 9 digits
      expect(validateAccountNumber('987654321012')).toBe(true); // 12 digits
      expect(validateAccountNumber('112233445566778899')).toBe(true); // 18 digits
    });

    it('rejects invalid bank account numbers', () => {
      expect(validateAccountNumber('123456')).toBe(false); // < 9 digits
      expect(validateAccountNumber('12345678901234567890')).toBe(false); // > 18 digits
      expect(validateAccountNumber('ABC123456789')).toBe(false); // contains non-digits
      expect(validateAccountNumber('')).toBe(false); // empty
    });

    it('validatePFMSBeneficiary returns valid status when both account and IFSC are correct', () => {
      const result = validatePFMSBeneficiary('987654321012', 'SBIN0001234');
      expect(result.isValid).toBe(true);
      expect(result.errors.accountNumber).toBeUndefined();
      expect(result.errors.ifscCode).toBeUndefined();
    });

    it('validatePFMSBeneficiary reports errors when account or IFSC are invalid', () => {
      const result = validatePFMSBeneficiary('123', 'INVALID_IFSC');
      expect(result.isValid).toBe(false);
      expect(result.errors.accountNumber).toBeDefined();
      expect(result.errors.ifscCode).toBeDefined();
    });
  });

  // =========================================================================
  // 2. Simulated PFMS Payload Generation
  // =========================================================================
  describe('Simulated PFMS Payload Generation', () => {
    const validBeneficiary: PFMSBeneficiaryInput = {
      beneficiaryName: 'Shri Tukaram S. Gaikwad',
      accountNumber: '987654321012',
      ifscCode: 'SBIN0001234',
      aadhaarNumberOrHash: '5489 1234 8901',
    };

    it('masks bank account numbers showing only the last 4 digits', () => {
      expect(maskAccountNumber('987654321012')).toBe('XXXXXXXX1012');
      expect(maskAccountNumber('112233445566778899')).toBe('XXXXXXXXXXXXXX8899');
      expect(maskAccountNumber('123')).toBe('****');
    });

    it('generates reproducible Aadhaar hash starting with SHA256:', () => {
      const hash1 = generateAadhaarHash('5489 1234 8901');
      const hash2 = generateAadhaarHash('5489 1234 8901');
      expect(hash1).toMatch(/^SHA256:aadhaar_[a-f0-9]+_2026$/);
      expect(hash1).toBe(hash2);
    });

    it('generates a valid PFMS batch payload containing batchId, Aadhaar hash, and amount in INR', () => {
      const payload = generatePFMSBatchPayload(validBeneficiary, 17425000, 'LAC/2026/MH/01', 42);

      expect(payload.batchId).toBe('BATCH-2026-PFMS-0042');
      expect(payload.schemeCode).toBe('RFCTLARR-DBT-2026');
      expect(payload.awardReferenceNo).toBe('LAC/2026/MH/01');
      expect(payload.beneficiaryName).toBe('Shri Tukaram S. Gaikwad');
      expect(payload.beneficiaryAadhaarHash).toMatch(/^SHA256:aadhaar_/);
      expect(payload.accountNumberMasked).toBe('XXXXXXXX1012');
      expect(payload.ifscCode).toBe('SBIN0001234');
      expect(payload.amountInr).toBe(17425000);
      expect(payload.createdTimestamp).toBeDefined();
    });

    it('throws error when generating payload with invalid beneficiary details', () => {
      const invalidBeneficiary: PFMSBeneficiaryInput = {
        beneficiaryName: 'Test User',
        accountNumber: '123',
        ifscCode: 'BAD_IFSC',
        aadhaarNumberOrHash: '1234',
      };

      expect(() => generatePFMSBatchPayload(invalidBeneficiary, 500000)).toThrow(
        'Beneficiary validation failed',
      );
    });

    it('throws error when disbursal amount is zero or negative', () => {
      expect(() => generatePFMSBatchPayload(validBeneficiary, 0)).toThrow(
        'Disbursal amount must be greater than zero',
      );
      expect(() => generatePFMSBatchPayload(validBeneficiary, -5000)).toThrow(
        'Disbursal amount must be greater than zero',
      );
    });
  });

  // =========================================================================
  // 3. Disbursement Callbacks & Failed Payment Retry Triggers
  // =========================================================================
  describe('Disbursement Callbacks & Retry Triggers', () => {
    const baseRecord: PFMSDisbursalRecord = {
      transactionId: 'TXN-PFMS-1001',
      batchId: 'BATCH-2026-PFMS-0001',
      beneficiaryName: 'Shri Tukaram S. Gaikwad',
      accountNumberMasked: 'XXXXXXXX1012',
      ifscCode: 'SBIN0001234',
      amountInr: 17425000,
      status: 'PENDING',
      retryCount: 0,
      maxRetries: 3,
      lastAttemptTimestamp: '2026-09-22T00:00:00.000Z',
    };

    it('handles successful disbursement callback, updates status to SUCCESS, and records UTR number', () => {
      const callback: PFMSCallbackResponse = {
        pfmsTransactionId: 'TXN-PFMS-1001',
        status: 'SUCCESS',
        utrNumber: 'UTR20260922SBI999',
        gatewayRemarks: 'Funds credited via e-Kuber',
      };

      const updated = handlePFMSCallback(baseRecord, callback);

      expect(updated.status).toBe('SUCCESS');
      expect(updated.utrNumber).toBe('UTR20260922SBI999');
      expect(updated.settledTimestamp).toBeDefined();
      expect(updated.failureReason).toBeUndefined();
    });

    it('handles failed disbursement callback and updates status to FAILED with gateway remarks', () => {
      const callback: PFMSCallbackResponse = {
        pfmsTransactionId: 'TXN-PFMS-1001',
        status: 'FAILED',
        gatewayRemarks: 'REJECTED_IFSC_MISMATCH: Bank branch code obsolete',
      };

      const updated = handlePFMSCallback(baseRecord, callback);

      expect(updated.status).toBe('FAILED');
      expect(updated.failureReason).toBe('REJECTED_IFSC_MISMATCH: Bank branch code obsolete');
      expect(updated.utrNumber).toBeUndefined();
    });

    it('triggers payment retry for a failed disbursal record, incrementing retryCount', () => {
      const failedRecord: PFMSDisbursalRecord = {
        ...baseRecord,
        status: 'FAILED',
        failureReason: 'Bank Server Timeout',
        retryCount: 0,
      };

      const retried = triggerPaymentRetry(failedRecord);

      expect(retried.status).toBe('RETRY_SCHEDULED');
      expect(retried.retryCount).toBe(1);
      expect(retried.batchId).toBe('BATCH-2026-PFMS-0001-RETRY-1');
      expect(retried.lastAttemptTimestamp).toBeDefined();
    });

    it('allows successive retries up to maxRetries limit', () => {
      let record: PFMSDisbursalRecord = {
        ...baseRecord,
        status: 'FAILED',
        retryCount: 0,
        maxRetries: 2,
      };

      // Retry 1
      record = triggerPaymentRetry(record);
      expect(record.retryCount).toBe(1);
      expect(record.status).toBe('RETRY_SCHEDULED');

      // Simulate failure on Retry 1
      record = { ...record, status: 'FAILED' };

      // Retry 2
      record = triggerPaymentRetry(record);
      expect(record.retryCount).toBe(2);
      expect(record.status).toBe('RETRY_SCHEDULED');

      // Simulate failure on Retry 2
      record = { ...record, status: 'FAILED' };

      // Attempt Retry 3 when maxRetries is 2 -> should throw
      expect(() => triggerPaymentRetry(record)).toThrow(
        `Max retries (2) reached for transaction TXN-PFMS-1001`,
      );
    });

    it('throws error when trying to retry a transaction that is not in FAILED state', () => {
      const successRecord: PFMSDisbursalRecord = {
        ...baseRecord,
        status: 'SUCCESS',
        utrNumber: 'UTR12345678',
      };

      expect(() => triggerPaymentRetry(successRecord)).toThrow(
        'Cannot retry transaction with status: SUCCESS',
      );
    });
  });
});
