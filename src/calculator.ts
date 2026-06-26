/**
 * CronCalculator
 * Computes next and previous execution times using a jump-based scheduling algorithm.
 * Designed for O(log n) per field resolution using pre-sorted value sets.
 */

import { CronParser } from './parser';

/** Computes next/previous scheduled run times for cron expressions. */
export class CronCalculator {
  private static readonly parser = CronParser.getInstance();
  private static instance?: CronCalculator;

  /** Get the CronCalculator instance. */
  public static getInstance () : CronCalculator {
    return this.instance ??= new CronCalculator();
  }

  private constructor() {}
}
