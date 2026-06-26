/**
 * CronScheduler
 * Schedules callbacks on a cron schedule using setTimeout.
 */

import { CronCalculator } from './calculator';

/** CronScheduler schedules callbacks to run according to a cron expression. */
export class CronScheduler {
  private static readonly calculator = CronCalculator.getInstance();
  private static instance?: CronScheduler;

  /** Get the CronScheduler instance. */
  public static getInstance () : CronScheduler {
    return this.instance ??= new CronScheduler();
  }

  private constructor () {}
}
