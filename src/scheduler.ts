import { CronCalculator } from './calculator';

export class CronScheduler {
  private static readonly calculator = CronCalculator.getInstance();
  private static instance?: CronScheduler;

  /** Get the CronScheduler instance. */
  public static getInstance () : CronScheduler {
    return this.instance ??= new CronScheduler();
  }

  private constructor () {}
}
