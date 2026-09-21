import { describe, it, expect } from 'vitest';
import {
  calculateRiskScore,
  classifyProjectRisk,
  simulateWhatIfDelay,
  type RiskCalculationInput,
  type PhaseDurationInput,
  type PhaseAdjustment,
} from '../../utils/predictiveRiskEngine';

describe('Predictive Risk Engine & What-If Simulator Suite', () => {
  // =========================================================================
  // 1. Risk Score Percentage Calculation
  // =========================================================================
  describe('Risk Score Percentage Calculation', () => {
    it('calculates 0% risk score when all parcels are verified, 0 pending objections, and 0 schedule variance', () => {
      const input: RiskCalculationInput = {
        totalParcels: 100,
        unverifiedParcels: 0,
        pendingSection15Objections: 0,
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 0,
      };

      const result = calculateRiskScore(input);
      expect(result.riskScore).toBe(0);
      expect(result.breakdown.unverifiedParcelsComponent).toBe(0);
      expect(result.breakdown.objectionsComponent).toBe(0);
      expect(result.breakdown.scheduleComponent).toBe(0);
    });

    it('calculates expected risk score based on unverified parcels ratio (up to 40% weight)', () => {
      const input: RiskCalculationInput = {
        totalParcels: 200,
        unverifiedParcels: 100, // 50% unverified => 20 points
        pendingSection15Objections: 0,
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 0,
      };

      const result = calculateRiskScore(input);
      expect(result.breakdown.unverifiedParcelsComponent).toBe(20);
      expect(result.riskScore).toBe(20);
    });

    it('calculates expected risk score based on pending Section 15 objections (up to 35% weight)', () => {
      const input: RiskCalculationInput = {
        totalParcels: 100,
        unverifiedParcels: 0,
        pendingSection15Objections: 10, // 10 * 3.5 = 35 points
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 0,
      };

      const result = calculateRiskScore(input);
      expect(result.breakdown.objectionsComponent).toBe(35);
      expect(result.riskScore).toBe(35);
    });

    it('calculates expected risk score based on schedule variance days (up to 25% weight)', () => {
      const input: RiskCalculationInput = {
        totalParcels: 100,
        unverifiedParcels: 0,
        pendingSection15Objections: 0,
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 30, // 30 * 0.5 = 15 points
      };

      const result = calculateRiskScore(input);
      expect(result.breakdown.scheduleComponent).toBe(15);
      expect(result.riskScore).toBe(15);
    });

    it('combines unverified parcels, Section 15 objections, and schedule variance correctly', () => {
      const input: RiskCalculationInput = {
        totalParcels: 100,
        unverifiedParcels: 50, // 20 points
        pendingSection15Objections: 6, // 21 points
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 40, // 20 points
      };

      const result = calculateRiskScore(input);
      // 20 + 21 + 20 = 61
      expect(result.riskScore).toBe(61);
    });

    it('caps maximum risk score at 100% even if components exceed limits', () => {
      const input: RiskCalculationInput = {
        totalParcels: 100,
        unverifiedParcels: 100, // 40 points
        pendingSection15Objections: 50, // capped at 35 points
        targetCompletionDate: '2026-01-01',
        scheduleVarianceDays: 180, // capped at 25 points
      };

      const result = calculateRiskScore(input);
      expect(result.riskScore).toBe(100);
    });

    it('handles zero total parcels gracefully without division by zero', () => {
      const input: RiskCalculationInput = {
        totalParcels: 0,
        unverifiedParcels: 0,
        pendingSection15Objections: 2,
        targetCompletionDate: '2026-12-31',
        scheduleVarianceDays: 0,
      };

      const result = calculateRiskScore(input);
      expect(result.breakdown.unverifiedParcelsComponent).toBe(0);
      expect(result.riskScore).toBe(7);
    });
  });

  // =========================================================================
  // 2. Classification of Project Risk Levels (ON_TRACK, AT_RISK, DELAYED)
  // =========================================================================
  describe('Classification of Project Risk Levels', () => {
    it('classifies project as ON_TRACK when risk score is low (< 35%) and no schedule delay', () => {
      expect(classifyProjectRisk(0, 0)).toBe('ON_TRACK');
      expect(classifyProjectRisk(20, 0)).toBe('ON_TRACK');
      expect(classifyProjectRisk(34, 0)).toBe('ON_TRACK');
    });

    it('classifies project as AT_RISK when risk score is moderate (35% to 69%) or has minor schedule delay', () => {
      expect(classifyProjectRisk(35, 0)).toBe('AT_RISK');
      expect(classifyProjectRisk(50, 10)).toBe('AT_RISK');
      expect(classifyProjectRisk(69, 20)).toBe('AT_RISK');
      expect(classifyProjectRisk(25, 15)).toBe('AT_RISK'); // minor delay makes it AT_RISK
    });

    it('classifies project as DELAYED when risk score is high (>= 70%) or schedule delay exceeds 30 days', () => {
      expect(classifyProjectRisk(70, 0)).toBe('DELAYED');
      expect(classifyProjectRisk(85, 10)).toBe('DELAYED');
      expect(classifyProjectRisk(40, 35)).toBe('DELAYED'); // schedule delay > 30 days
      expect(classifyProjectRisk(95, 60)).toBe('DELAYED');
    });
  });

  // =========================================================================
  // 3. What-If Delay Simulator Outputs
  // =========================================================================
  describe('What-If Delay Simulator Outputs', () => {
    const baselinePhases: PhaseDurationInput = {
      sec4RequisitionDays: 30,
      sec11GazetteDays: 45,
      sec15HearingDays: 60,
      sec23AwardDays: 45,
      compensationDisbursalDays: 30,
    }; // Total = 210 days

    it('calculates total baseline phase duration correctly', () => {
      const result = simulateWhatIfDelay(baselinePhases, []);
      expect(result.baselineTotalDays).toBe(210);
      expect(result.adjustedTotalDays).toBe(210);
      expect(result.netDaysSaved).toBe(0);
    });

    it('simulates time savings when reducing Section 15 hearing duration', () => {
      const adjustments: PhaseAdjustment[] = [
        { phase: 'sec15HearingDays', adjustmentDays: -20 }, // Reduce hearing by 20 days
      ];

      const result = simulateWhatIfDelay(baselinePhases, adjustments);
      expect(result.baselineTotalDays).toBe(210);
      expect(result.adjustedTotalDays).toBe(190);
      expect(result.netDaysSaved).toBe(20);
    });

    it('simulates multiple simultaneous statutory interventions', () => {
      const adjustments: PhaseAdjustment[] = [
        { phase: 'sec4RequisitionDays', adjustmentDays: -10 },
        { phase: 'sec15HearingDays', adjustmentDays: -20 },
        { phase: 'compensationDisbursalDays', adjustmentDays: -15 },
      ];

      const result = simulateWhatIfDelay(baselinePhases, adjustments);
      expect(result.baselineTotalDays).toBe(210);
      expect(result.adjustedTotalDays).toBe(165);
      expect(result.netDaysSaved).toBe(45);
    });

    it('recalculates risk score and lowers risk category after fast-track interventions', () => {
      const riskInput: Partial<RiskCalculationInput> = {
        totalParcels: 100,
        unverifiedParcels: 60,
        pendingSection15Objections: 16,
        scheduleVarianceDays: 50,
      };

      const adjustments: PhaseAdjustment[] = [
        { phase: 'sec15HearingDays', adjustmentDays: -25 },
        { phase: 'sec4RequisitionDays', adjustmentDays: -15 },
      ];

      const result = simulateWhatIfDelay(baselinePhases, adjustments, riskInput);

      expect(result.baselineRiskCategory).toBe('DELAYED');
      expect(result.simulatedRiskScore).toBeLessThan(result.baselineRiskScore);
      expect(result.netDaysSaved).toBe(40);
    });

    it('handles phase delay increases (positive adjustment days)', () => {
      const adjustments: PhaseAdjustment[] = [
        { phase: 'sec11GazetteDays', adjustmentDays: 15 }, // 15 days delay added
      ];

      const result = simulateWhatIfDelay(baselinePhases, adjustments);
      expect(result.adjustedTotalDays).toBe(225);
      expect(result.netDaysSaved).toBe(-15);
    });
  });
});
