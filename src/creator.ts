/**
 * CronCreator - builds cron expression strings from structured option objects.
 * SRP: only creation logic lives here.
 */

import { FIELD_NAMES } from './const.js';
import type { CronObject, CronOptions } from './types.js';

const DEFAULTS: CronObject = {
  minute: "*",
  hour: "*",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

/** CronCreator builds valid cron expression strings from structured options. */
export class CronCreator {
  /**
   * Create a cron expression string from a partial options object.
   * Omitted fields default to wildcard.
   *
   * @param options - A partial CronOptions object.
   * @returns A valid 5-field cron expression string.
   */
  create(options: CronOptions): string {
    const merged: CronObject = { ...DEFAULTS, ...options };
    return FIELD_NAMES.map((name) => merged[name]).join(" ");
  }
}
