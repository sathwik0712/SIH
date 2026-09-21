/**
 * Predictive Risk Engine & What-If Delay Simulator
 * RFCTLARR Act 2013 Land Acquisition Analytics
 */

export type ProjectRiskCategory = 'ON_TRACK' | 'AT_RISK' | 'DELAYED';

export interface RiskCalculationInput {
  /** Total land parcels in project scope */
  totalParcels: number;
  /** Parcels pending field verification */
  unverifiedParcels: number;
  /** Pending Section 15 landowner objections */
  pendingSection15Objections: number;
  /** Project target completion date (ISO YYYY-MM-DD) */
  targetCompletionDate: string;
  /** Schedule variance in days (> 0 means delayed) */
  scheduleVarianceDays: number;
  /** Reference evaluation date (ISO YYYY-MM-DD) */
  evaluationDate?: string;
}

export interface RiskEvaluationResult {
  riskScore: number; // 0 to 100 percentage
  riskCategory: ProjectRiskCategory;
  breakdown: {
    unverifiedParcelsComponent: number;
    objectionsComponent: number;
    scheduleComponent: number;
  };
}

export interface PhaseDurationInput {
  sec4RequisitionDays: number;
  sec11GazetteDays: number;
  sec15HearingDays: number;
  sec23AwardDays: number;
  compensationDisbursalDays: number;
}

export interface PhaseAdjustment {
  phase: keyof PhaseDurationInput;
  adjustmentDays: number; // Negative for time saved, positive for delay
}

export interface WhatIfSimulationResult {
  baselineTotalDays: number;
  adjustedTotalDays: number;
  netDaysSaved: number;
  baselineRiskScore: number;
  simulatedRiskScore: number;
  baselineRiskCategory: ProjectRiskCategory;
  simulatedRiskCategory: ProjectRiskCategory;
}

// ---------------------------------------------------------------------------
// 1. Risk Score Percentage Calculation
// ---------------------------------------------------------------------------

/**
 * Calculates a project risk score percentage (0 - 100%) based on:
 * - Unverified land parcel ratio (up to 40% weight)
 * - Pending Section 15 landowner objections (up to 35% weight)
 * - Schedule variance days / deadline proximity (up to 25% weight)
 */
export function calculateRiskScore(input: RiskCalculationInput): RiskEvaluationResult {
  const { totalParcels, unverifiedParcels, pendingSection15Objections, scheduleVarianceDays } = input;

  // Unverified parcels weight (40% max)
  const unverifiedRatio = totalParcels > 0 ? Math.min(1, Math.max(0, unverifiedParcels / totalParcels)) : 0;
  const unverifiedComponent = Math.round(unverifiedRatio * 40);

  // Section 15 objections weight (35% max - approx 3.5 points per pending objection)
  const objectionsComponent = Math.min(35, Math.round(Math.max(0, pendingSection15Objections) * 3.5));

  // Schedule variance weight (25% max - 0.5 points per delay day)
  const scheduleComponent = Math.min(25, Math.max(0, Math.round(Math.max(0, scheduleVarianceDays) * 0.5)));

  const rawScore = unverifiedComponent + objectionsComponent + scheduleComponent;
  const riskScore = Math.min(100, Math.max(0, rawScore));

  const riskCategory = classifyProjectRisk(riskScore, scheduleVarianceDays);

  return {
    riskScore,
    riskCategory,
    breakdown: {
      unverifiedParcelsComponent: unverifiedComponent,
      objectionsComponent,
      scheduleComponent,
    },
  };
}

// ---------------------------------------------------------------------------
// 2. Risk Level Classification
// ---------------------------------------------------------------------------

/**
 * Classifies project risk category into ON_TRACK, AT_RISK, or DELAYED.
 *
 * Rules:
 * - DELAYED: Risk score >= 70% OR Schedule variance > 30 days
 * - AT_RISK: Risk score >= 35% OR Schedule variance > 0 days
 * - ON_TRACK: Risk score < 35% AND Schedule variance <= 0 days
 */
export function classifyProjectRisk(
  riskScore: number,
  scheduleVarianceDays: number = 0,
): ProjectRiskCategory {
  if (riskScore >= 70 || scheduleVarianceDays > 30) {
    return 'DELAYED';
  }
  if (riskScore >= 35 || scheduleVarianceDays > 0) {
    return 'AT_RISK';
  }
  return 'ON_TRACK';
}

// ---------------------------------------------------------------------------
// 3. What-If Delay Simulator
// ---------------------------------------------------------------------------

/**
 * Simulates the impact of adjusting statutory phase durations on project timeline and risk score.
 */
export function simulateWhatIfDelay(
  baselinePhases: PhaseDurationInput,
  adjustments: PhaseAdjustment[],
  riskInput?: Partial<RiskCalculationInput>,
): WhatIfSimulationResult {
  const baselineTotalDays =
    baselinePhases.sec4RequisitionDays +
    baselinePhases.sec11GazetteDays +
    baselinePhases.sec15HearingDays +
    baselinePhases.sec23AwardDays +
    baselinePhases.compensationDisbursalDays;

  // Apply adjustments
  const adjustedPhases = { ...baselinePhases };
  adjustments.forEach(adj => {
    if (adj.phase in adjustedPhases) {
      adjustedPhases[adj.phase] = Math.max(1, adjustedPhases[adj.phase] + adj.adjustmentDays);
    }
  });

  const adjustedTotalDays =
    adjustedPhases.sec4RequisitionDays +
    adjustedPhases.sec11GazetteDays +
    adjustedPhases.sec15HearingDays +
    adjustedPhases.sec23AwardDays +
    adjustedPhases.compensationDisbursalDays;

  const netDaysSaved = baselineTotalDays - adjustedTotalDays;

  // Calculate baseline risk
  const defaultRiskInput: RiskCalculationInput = {
    totalParcels: riskInput?.totalParcels ?? 100,
    unverifiedParcels: riskInput?.unverifiedParcels ?? 40,
    pendingSection15Objections: riskInput?.pendingSection15Objections ?? 10,
    targetCompletionDate: riskInput?.targetCompletionDate ?? '2026-12-31',
    scheduleVarianceDays: riskInput?.scheduleVarianceDays ?? Math.max(0, baselineTotalDays - 180),
  };

  const baselineEval = calculateRiskScore(defaultRiskInput);

  // Calculate simulated risk with updated schedule variance
  const simulatedScheduleVariance = Math.max(0, defaultRiskInput.scheduleVarianceDays - netDaysSaved);

  // Recalculate unverified and objections if phase adjustments mitigate them
  let simulatedUnverified = defaultRiskInput.unverifiedParcels;
  let simulatedObjections = defaultRiskInput.pendingSection15Objections;

  adjustments.forEach(adj => {
    if (adj.phase === 'sec15HearingDays' && adj.adjustmentDays < 0) {
      simulatedObjections = Math.max(0, Math.round(simulatedObjections * 0.5));
    }
    if (adj.phase === 'sec4RequisitionDays' && adj.adjustmentDays < 0) {
      simulatedUnverified = Math.max(0, Math.round(simulatedUnverified * 0.5));
    }
  });

  const simulatedRiskInput: RiskCalculationInput = {
    ...defaultRiskInput,
    unverifiedParcels: simulatedUnverified,
    pendingSection15Objections: simulatedObjections,
    scheduleVarianceDays: simulatedScheduleVariance,
  };

  const simulatedEval = calculateRiskScore(simulatedRiskInput);

  return {
    baselineTotalDays,
    adjustedTotalDays,
    netDaysSaved,
    baselineRiskScore: baselineEval.riskScore,
    simulatedRiskScore: simulatedEval.riskScore,
    baselineRiskCategory: baselineEval.riskCategory,
    simulatedRiskCategory: simulatedEval.riskCategory,
  };
}
