/**
 * CronScheduler
 * Schedules callbacks on a cron schedule using setTimeout.
 */

import { CronCalculator } from './calculator';
import { CronParser } from './parser';
import type { CronInput, EventHandler, ScheduleController, ScheduleEvent, ScheduleOptions } from './types';

/** CronScheduler schedules callbacks to run according to a cron expression. */
export class CronScheduler {
  private static readonly parser = CronParser.getInstance();
  private static readonly calculator = CronCalculator.getInstance();
  private static instance?: CronScheduler;

  /** Get the CronScheduler instance. */
  public static getInstance () : CronScheduler {
    return this.instance ??= new CronScheduler();
  }

  private constructor () {}

  /**
   * Schedule a callback to run on the given cron schedule.
   * 
   * @param expr - A standard 5-field cron string, parsed cron object or special alias.
   *   The special '@reboot' alias fires the callback immediately once.
   * @param callback - Function to invoke on each scheduled occurrence.
   * @param options - Optional ScheduleOptions with timezone.
   * @returns A ScheduleController with stop(), on(), and off() methods.
   * 
   * @example
   * const job = scheduler.schedule( '0 * * * *', () => console.log( 'tick' ), { timezone: 'UTC' } );
   * job.on( 'tick', () => console.log( 'about to fire' ) );
   * job.stop();
   */
  public schedule ( expr: CronInput, callback: () => void, options?: ScheduleOptions ) : ScheduleController {
    const tz = options?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone;
    const handlers: Record< ScheduleEvent, Set< EventHandler > > = {
      tick: new Set(), error: new Set(), stopped: new Set()
    };

    let stopped = false, id: ReturnType< typeof setTimeout > | null = null;

    // Emit an event to all registered handlers for that event type
    const emit = ( event: ScheduleEvent, ...args: any[] ) : void => {
      for ( const h of handlers[ event ] ) try { h( ...args ) } catch {}
    };

    // Schedule the next occurrence of the cron expression
    const scheduleNext = () : void => {
      if ( stopped ) return;

      try {
        const next = CronScheduler.calculator.next( expr, { timezone: tz } );
        if ( ! next || stopped ) return;
        const delay = next[ 0 ].getTime() - Date.now();

        if ( delay < 0 ) {
          // Clock skew / drift - reschedule immediately
          id = setTimeout( scheduleNext, 1 );
          return;
        }

        id = setTimeout( () => {
          if ( stopped ) return;

          try { emit( 'tick' ), callback() }
          catch ( err ) { emit( 'error', err ) }

          scheduleNext();
        }, delay );
      } catch ( err ) {
        emit( 'error', err );
      }
    };

    // Handle @reboot: fire once immediately
    if ( typeof expr === 'string' && expr.trim().toLowerCase() === '@reboot' ) {
      if ( ! stopped ) {
        try { emit( 'tick' ), callback() }
        catch ( err ) { emit( 'error', err ) }
      }
    } else {
      scheduleNext();
    }

    // Create the schedule controller object
    const controller: ScheduleController = {
      stop () : void {
        stopped = true;
        if ( id !== null ) { clearTimeout( id ), id = null }
        emit( 'stopped' );
      },
      on ( event: ScheduleEvent, handler: EventHandler ) : ScheduleController {
        handlers[ event ].add( handler );
        return controller;
      },
      off ( event: ScheduleEvent, handler: EventHandler ) : ScheduleController {
        handlers[ event ].delete( handler );
        return controller;
      }
    };

    return controller;
  }
}
