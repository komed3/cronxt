/**
 * CronCalculator
 * Computes next and previous execution times using a jump-based scheduling algorithm.
 * Designed for O(log n) per field resolution using pre-sorted value sets.
 */

import { CronParser } from './parser';
import type { CronInput, ParsedCronExpression, RunOptions } from './types';

/** Computes next/previous scheduled run times for cron expressions. */
export class CronCalculator {
  private static readonly parser = CronParser.getInstance();
  private static instance?: CronCalculator;

  /** Get the CronCalculator instance. */
  public static getInstance () : CronCalculator {
    return this.instance ??= new CronCalculator();
  }

  private constructor() {}

  /** Resolve string or parsed expression into ParsedCronExpression. */
  private resolve ( input: CronInput ) : ParsedCronExpression {
    return typeof input === 'string' ? CronCalculator.parser.parse( input ) : input;
  }

  /** Shared execution loop for next/prev. */
  private run ( expr: CronInput, opt: RunOptions, dir: 1 | -1 ) : Date[] {
    const tz = opt.timezone ?? 'UTC', count = opt.count ?? 1;
    const parsed = this.resolve( expr );

    let cur = ( dir === 1 ? opt.after : opt.before ) ?? new Date();
    const out: Date[] = [];

    for ( let i = 0; i < count; i++ ) {
      const next = this.step( parsed, cur, tz, dir );
      if ( ! next ) break;

      out.push( next );
      cur = new Date( next.getTime() + dir * 60000 );
    }

    return out;
  }

  /**
   * Compute next N execution times.
   * 
   * @param expr - Cron string or pre-parsed expression
   * @param options - Run options (timezone, after, count)
   * 
   * @example
   * calc.next( '0 9 * * MON', { count: 3, timezone: 'UTC' } );
   */
  public next ( expr: CronInput, options: RunOptions = {} ) : Date[] {
    return this.run( expr, options, 1 );
  }

  /**
   * Compute previous N execution times.
   * 
   * @param expr - Cron string or pre-parsed expression
   * @param options - Run options (timezone, before, count)
   * 
   * @example
   * calc.prev( '0 9 * * MON', { count: 3 } );
   */
  public prev ( expr: CronInput, options: RunOptions = {} ) : Date[] {
    return this.run( expr, options, -1 );
  }
}
