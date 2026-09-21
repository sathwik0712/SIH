/**
 * RFCTLARR Act 2013 — Compensation Calculator
 *
 * Implements the statutory valuation formula per:
 *   - Section 26: Determination of market value of land
 *   - Section 27: Determination of amount of compensation
 *   - Section 28: Parameters for rural land multiplier (1.0x – 2.0x)
 *   - Section 30: Solatium (100% of market value) and 12% p.a. interest
 *
 * Total Compensation =
 *   (baseMarketValue × ruralMultiplier)      … Market Value after multiplier
 * + solatium (100% of multiplied value)       … Section 30(1)
 * + interest (12% p.a. on multiplied value)   … Section 30(3)
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CompensationInput {
  /** Base market value (₹) as determined by the Collector under Section 26 */
  baseMarketValue: number;
  /** Rural multiplier factor: 1.0 (urban) to 2.0 (rural) per Section 28 */
  ruralMultiplier: number;
  /** Number of years from the date of notification under Section 11 to the award date */
  yearsFromNotification: number;
}

export interface CompensationBreakdown {
  /** Base market value supplied as input (₹) */
  baseMarketValue: number;
  /** Rural multiplier applied */
  ruralMultiplier: number;
  /** Market value after applying rural multiplier: baseMarketValue × ruralMultiplier */
  adjustedMarketValue: number;
  /** 100% solatium on the adjusted market value — Section 30(1) */
  solatium: number;
  /** 12% per annum simple interest on the adjusted market value — Section 30(3) */
  interest: number;
  /** Years used for interest calculation */
  yearsFromNotification: number;
  /** Total compensation: adjustedMarketValue + solatium + interest */
  totalCompensation: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Solatium rate as a fraction of the adjusted market value (100%) */
export const SOLATIUM_RATE = 1.0;

/** Annual interest rate as a fraction (12% p.a.) */
export const INTEREST_RATE_PA = 0.12;

/** Minimum permissible rural multiplier */
export const MIN_RURAL_MULTIPLIER = 1.0;

/** Maximum permissible rural multiplier */
export const MAX_RURAL_MULTIPLIER = 2.0;

// ---------------------------------------------------------------------------
// Pure Calculation Functions
// ---------------------------------------------------------------------------

/**
 * Calculate the adjusted market value after applying the rural multiplier.
 *
 * @param baseMarketValue  Base land market value (₹)
 * @param ruralMultiplier  Multiplier (1.0 – 2.0)
 * @returns Adjusted market value (₹)
 * @throws {Error} If baseMarketValue is negative or multiplier is out of range
 */
export function calculateAdjustedMarketValue(
  baseMarketValue: number,
  ruralMultiplier: number,
): number {
  if (baseMarketValue < 0) {
    throw new Error('Base market value cannot be negative');
  }
  if (ruralMultiplier < MIN_RURAL_MULTIPLIER || ruralMultiplier > MAX_RURAL_MULTIPLIER) {
    throw new Error(
      `Rural multiplier must be between ${MIN_RURAL_MULTIPLIER} and ${MAX_RURAL_MULTIPLIER}`,
    );
  }
  return baseMarketValue * ruralMultiplier;
}

/**
 * Calculate the solatium component (100% of adjusted market value).
 *
 * @param adjustedMarketValue  Adjusted market value (₹)
 * @returns Solatium amount (₹)
 */
export function calculateSolatium(adjustedMarketValue: number): number {
  if (adjustedMarketValue < 0) {
    throw new Error('Adjusted market value cannot be negative');
  }
  return adjustedMarketValue * SOLATIUM_RATE;
}

/**
 * Calculate the interest component: 12% p.a. simple interest on the adjusted
 * market value for the period from notification to award.
 *
 * @param adjustedMarketValue  Adjusted market value (₹)
 * @param years                Years elapsed from Section 11 notification to award date
 * @returns Interest amount (₹)
 */
export function calculateInterest(
  adjustedMarketValue: number,
  years: number,
): number {
  if (adjustedMarketValue < 0) {
    throw new Error('Adjusted market value cannot be negative');
  }
  if (years < 0) {
    throw new Error('Years from notification cannot be negative');
  }
  return adjustedMarketValue * INTEREST_RATE_PA * years;
}

/**
 * Calculate full compensation breakdown per RFCTLARR Act 2013.
 *
 * @param input  CompensationInput with baseMarketValue, ruralMultiplier, yearsFromNotification
 * @returns Full CompensationBreakdown with all component amounts
 */
export function calculateTotalCompensation(input: CompensationInput): CompensationBreakdown {
  const { baseMarketValue, ruralMultiplier, yearsFromNotification } = input;

  const adjustedMarketValue = calculateAdjustedMarketValue(baseMarketValue, ruralMultiplier);
  const solatium = calculateSolatium(adjustedMarketValue);
  const interest = calculateInterest(adjustedMarketValue, yearsFromNotification);
  const totalCompensation = adjustedMarketValue + solatium + interest;

  return {
    baseMarketValue,
    ruralMultiplier,
    adjustedMarketValue,
    solatium,
    interest,
    yearsFromNotification,
    totalCompensation,
  };
}
