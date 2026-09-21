import { describe, it, expect } from 'vitest';
import {
  calculateAdjustedMarketValue,
  calculateSolatium,
  calculateInterest,
  calculateTotalCompensation,
  SOLATIUM_RATE,
  INTEREST_RATE_PA,
  MIN_RURAL_MULTIPLIER,
  MAX_RURAL_MULTIPLIER,
  type CompensationInput,
  type CompensationBreakdown,
} from '../../utils/compensationCalculator';

// ---------------------------------------------------------------------------
// RFCTLARR Act 2013 – Section 26 Valuation & Section 30 Compensation Tests
// ---------------------------------------------------------------------------

describe('CompensationCalculator — RFCTLARR Act 2013 Section 26 & 30', () => {
  // =========================================================================
  // 1. Base Market Value with Rural Multipliers (Section 26 / 28)
  // =========================================================================

  describe('Base Market Value with Rural Multipliers (Section 26 / 28)', () => {
    it('applies a 1.0x multiplier (urban land) — adjusted value equals base value', () => {
      const result = calculateAdjustedMarketValue(500_000, 1.0);
      expect(result).toBe(500_000);
    });

    it('applies a 1.5x multiplier — mid-range rural multiplier', () => {
      const result = calculateAdjustedMarketValue(1_000_000, 1.5);
      expect(result).toBe(1_500_000);
    });

    it('applies a 2.0x multiplier (maximum rural) — doubles the base value', () => {
      const result = calculateAdjustedMarketValue(750_000, 2.0);
      expect(result).toBe(1_500_000);
    });

    it('handles fractional multiplier values (1.25x) without rounding errors', () => {
      // ₹800,000 × 1.25 = ₹1,000,000 exactly
      const result = calculateAdjustedMarketValue(800_000, 1.25);
      expect(result).toBe(1_000_000);
    });

    it('handles a base market value of zero — returns zero', () => {
      const result = calculateAdjustedMarketValue(0, 1.5);
      expect(result).toBe(0);
    });

    it('throws an error for negative base market value', () => {
      expect(() => calculateAdjustedMarketValue(-100_000, 1.5)).toThrow(
        'Base market value cannot be negative',
      );
    });

    it('throws an error for a rural multiplier below 1.0', () => {
      expect(() => calculateAdjustedMarketValue(500_000, 0.5)).toThrow(
        `Rural multiplier must be between ${MIN_RURAL_MULTIPLIER} and ${MAX_RURAL_MULTIPLIER}`,
      );
    });

    it('throws an error for a rural multiplier above 2.0', () => {
      expect(() => calculateAdjustedMarketValue(500_000, 2.5)).toThrow(
        `Rural multiplier must be between ${MIN_RURAL_MULTIPLIER} and ${MAX_RURAL_MULTIPLIER}`,
      );
    });
  });

  // =========================================================================
  // 2. Solatium Component — Section 30(1): 100% of adjusted market value
  // =========================================================================

  describe('Solatium Component — Section 30(1): 100% of Adjusted Market Value', () => {
    it('calculates solatium at 100% rate — equals the adjusted market value', () => {
      expect(SOLATIUM_RATE).toBe(1.0);
      const solatium = calculateSolatium(1_000_000);
      expect(solatium).toBe(1_000_000);
    });

    it('returns zero solatium for zero adjusted market value', () => {
      const solatium = calculateSolatium(0);
      expect(solatium).toBe(0);
    });

    it('handles large values without precision loss (₹10Cr)', () => {
      const tenCrore = 100_000_000; // ₹10,00,00,000
      const solatium = calculateSolatium(tenCrore);
      expect(solatium).toBe(tenCrore);
    });

    it('throws an error for negative adjusted market value', () => {
      expect(() => calculateSolatium(-500_000)).toThrow(
        'Adjusted market value cannot be negative',
      );
    });
  });

  // =========================================================================
  // 3. Interest Component — Section 30(3): 12% p.a. simple interest
  // =========================================================================

  describe('Interest Component — Section 30(3): 12% Per Annum Interest', () => {
    it('confirms statutory interest rate is 12% p.a.', () => {
      expect(INTEREST_RATE_PA).toBe(0.12);
    });

    it('calculates 12% interest for 1 year correctly', () => {
      // ₹1,000,000 × 0.12 × 1 = ₹120,000
      const interest = calculateInterest(1_000_000, 1);
      expect(interest).toBe(120_000);
    });

    it('calculates 12% interest for 3 years correctly', () => {
      // ₹1,000,000 × 0.12 × 3 = ₹360,000
      const interest = calculateInterest(1_000_000, 3);
      expect(interest).toBe(360_000);
    });

    it('returns zero interest when years from notification is 0', () => {
      const interest = calculateInterest(1_000_000, 0);
      expect(interest).toBe(0);
    });

    it('handles fractional years (e.g., 2.5 years) without rounding errors', () => {
      // ₹2,000,000 × 0.12 × 2.5 = ₹600,000
      const interest = calculateInterest(2_000_000, 2.5);
      expect(interest).toBe(600_000);
    });

    it('throws an error for negative years from notification', () => {
      expect(() => calculateInterest(1_000_000, -1)).toThrow(
        'Years from notification cannot be negative',
      );
    });

    it('throws an error for negative adjusted market value', () => {
      expect(() => calculateInterest(-1_000_000, 2)).toThrow(
        'Adjusted market value cannot be negative',
      );
    });
  });

  // =========================================================================
  // 4. Total Compensation — End-to-End Section 26 + 30 Calculation
  // =========================================================================

  describe('Total Compensation — End-to-End Valuation', () => {
    it('calculates correct total for urban land (1.0x, 2 years)', () => {
      // Base: ₹10,00,000 × 1.0 = ₹10,00,000 (adjusted)
      // Solatium: ₹10,00,000 (100%)
      // Interest: ₹10,00,000 × 0.12 × 2 = ₹2,40,000
      // Total: ₹10,00,000 + ₹10,00,000 + ₹2,40,000 = ₹22,40,000
      const input: CompensationInput = {
        baseMarketValue: 1_000_000,
        ruralMultiplier: 1.0,
        yearsFromNotification: 2,
      };
      const result = calculateTotalCompensation(input);

      expect(result.adjustedMarketValue).toBe(1_000_000);
      expect(result.solatium).toBe(1_000_000);
      expect(result.interest).toBe(240_000);
      expect(result.totalCompensation).toBe(2_240_000);
    });

    it('calculates correct total for rural land (2.0x, 1 year)', () => {
      // Base: ₹5,00,000 × 2.0 = ₹10,00,000 (adjusted)
      // Solatium: ₹10,00,000 (100%)
      // Interest: ₹10,00,000 × 0.12 × 1 = ₹1,20,000
      // Total: ₹10,00,000 + ₹10,00,000 + ₹1,20,000 = ₹21,20,000
      const input: CompensationInput = {
        baseMarketValue: 500_000,
        ruralMultiplier: 2.0,
        yearsFromNotification: 1,
      };
      const result = calculateTotalCompensation(input);

      expect(result.adjustedMarketValue).toBe(1_000_000);
      expect(result.solatium).toBe(1_000_000);
      expect(result.interest).toBe(120_000);
      expect(result.totalCompensation).toBe(2_120_000);
    });

    it('calculates correct total with mid-range multiplier (1.5x, 3 years)', () => {
      // Base: ₹20,00,000 × 1.5 = ₹30,00,000 (adjusted)
      // Solatium: ₹30,00,000 (100%)
      // Interest: ₹30,00,000 × 0.12 × 3 = ₹10,80,000
      // Total: ₹30,00,000 + ₹30,00,000 + ₹10,80,000 = ₹70,80,000
      const input: CompensationInput = {
        baseMarketValue: 2_000_000,
        ruralMultiplier: 1.5,
        yearsFromNotification: 3,
      };
      const result = calculateTotalCompensation(input);

      expect(result.adjustedMarketValue).toBe(3_000_000);
      expect(result.solatium).toBe(3_000_000);
      expect(result.interest).toBe(1_080_000);
      expect(result.totalCompensation).toBe(7_080_000);
    });

    it('returns zero total when base market value is zero', () => {
      const result = calculateTotalCompensation({
        baseMarketValue: 0,
        ruralMultiplier: 1.5,
        yearsFromNotification: 5,
      });
      expect(result.totalCompensation).toBe(0);
      expect(result.adjustedMarketValue).toBe(0);
      expect(result.solatium).toBe(0);
      expect(result.interest).toBe(0);
    });

    it('returns correct breakdown shape and echoes input values', () => {
      const input: CompensationInput = {
        baseMarketValue: 1_234_567,
        ruralMultiplier: 1.75,
        yearsFromNotification: 4,
      };
      const result: CompensationBreakdown = calculateTotalCompensation(input);

      expect(result.baseMarketValue).toBe(1_234_567);
      expect(result.ruralMultiplier).toBe(1.75);
      expect(result.yearsFromNotification).toBe(4);
    });

    it('total compensation is never negative for valid inputs', () => {
      const multipliers = [1.0, 1.1, 1.25, 1.5, 1.75, 2.0];
      const years = [0, 0.5, 1, 2, 3, 5, 10];
      const baseValues = [0, 100, 50_000, 1_000_000, 100_000_000];

      for (const base of baseValues) {
        for (const mult of multipliers) {
          for (const yr of years) {
            const result = calculateTotalCompensation({
              baseMarketValue: base,
              ruralMultiplier: mult,
              yearsFromNotification: yr,
            });
            expect(result.totalCompensation).toBeGreaterThanOrEqual(0);
            expect(result.adjustedMarketValue).toBeGreaterThanOrEqual(0);
            expect(result.solatium).toBeGreaterThanOrEqual(0);
            expect(result.interest).toBeGreaterThanOrEqual(0);
          }
        }
      }
    });

    it('verifies the algebraic identity: total = adjusted + solatium + interest', () => {
      const input: CompensationInput = {
        baseMarketValue: 3_750_000,
        ruralMultiplier: 1.6,
        yearsFromNotification: 2.5,
      };
      const result = calculateTotalCompensation(input);

      // Identity check — must hold exactly
      expect(result.totalCompensation).toBe(
        result.adjustedMarketValue + result.solatium + result.interest,
      );
    });

    it('produces exact values for a realistic NHAI land acquisition scenario', () => {
      // Scenario: Agricultural land in Maharashtra, Section 26 base: ₹74.25L
      // Rural multiplier: 2.0 (per Section 28), 2 years from notification
      //
      // Adjusted: ₹74,25,000 × 2.0 = ₹1,48,50,000
      // Solatium: ₹1,48,50,000 × 1.0  = ₹1,48,50,000
      // Interest: ₹1,48,50,000 × 0.12 × 2 = ₹35,64,000
      // Total:    ₹1,48,50,000 + ₹1,48,50,000 + ₹35,64,000 = ₹3,32,64,000
      const input: CompensationInput = {
        baseMarketValue: 7_425_000,
        ruralMultiplier: 2.0,
        yearsFromNotification: 2,
      };
      const result = calculateTotalCompensation(input);

      expect(result.adjustedMarketValue).toBe(14_850_000);
      expect(result.solatium).toBe(14_850_000);
      expect(result.interest).toBe(3_564_000);
      expect(result.totalCompensation).toBe(33_264_000);
    });
  });
});
