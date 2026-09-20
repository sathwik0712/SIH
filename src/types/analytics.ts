export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface PredictiveRiskModel {
  projectId: number | string;
  projectCode: string;
  projectName: string;
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  currentStage: string;
  currentStageDwellDays: number;
  nationalAvgDwellDays: number;
  predictedDelayDays: number;
  predictedCompletionDate: string;
  primaryRiskDrivers: string[];
  recommendedAction: string;
}

export interface WhatIfMitigationOption {
  id: string;
  label: string;
  description: string;
  delayReductionDays: number;
  costImpactCr: number;
  enabled: boolean;
}
