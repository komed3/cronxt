/**
 * CronCalculator
 * Computes next and previous run times for cron expressions.
 * Uses Intl.DateTimeFormat for all timezone handling (zero external deps).
 */

import { WEEKDAY_MAP } from './const';
import { CronParser } from './CronParser';
import type { DateParts } from './types';

/**
 * CronCalculator computes next/previous scheduled run times for cron expressions.
 * 
 * @example
 * const calc = new CronCalculator();
 * calc.getNextRun( '0 9 * * MON', { timezone: 'America/New_York' } );
 * calc.getNextRuns( '0 9 * * 1-5', { after: new Date(), count: 5 } );
 */
export class CronCalculator {
  private readonly parser: CronParser;
  constructor() { this.parser = new CronParser() }

  /** Create a Date shifted by a given number of minutes. */
  private shiftDateByMinutes ( date: Date, minutes: number ) : Date {
    return new Date( date.getTime() + ( minutes * 60000 ) );
  }

  /**
   * Extract cron-relevant components from a Date in a specific timezone.
   * Uses Intl.DateTimeFormat with part extraction - no external tz libraries.
   */
  private getDatePartsInTimezone ( date: Date, timezone: string ) : DateParts {
    const parts = new Intl.DateTimeFormat( 'en-US', {
      timeZone: timezone, year: 'numeric', month: 'numeric', day: 'numeric',
      hour: 'numeric', minute: 'numeric', weekday: 'short', hour12: false
    } ).formatToParts( date );

    const get = ( type: string ) : string => parts.find( p => p.type === type )?.value || '';
    const int = ( type: string ) : number => parseInt( get( type ), 10 );

    return {
      year: int( 'year' ), month: int( 'month' ), dayOfMonth: int( 'day' ), hour: int( 'hour' ) % 24,
      minute: int( 'minute' ), dayOfWeek: WEEKDAY_MAP[ get( 'weekday' ) ] ?? 0
    };
  }
}
