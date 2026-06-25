/**
 * CronParser
 * Parses and validates cron expressions.
 */

import { FIELD_BY_NAME } from './const';
import type { CronFieldName } from './types';

/**
 * CronParser parses and validates cron expressions into structured objects.
 * 
 * @example
 * const parser = new CronParser();
 * const parsed = parser.parse( '0 9 * * MON' );
 * const valid = parser.validate( '0 9 * * MON' );
 */
export class CronParser {
  private resolveAlias ( token: string, fieldName: CronFieldName ) : string {
    const def = FIELD_BY_NAME[ fieldName ];
    if ( ! def ) return token;

    const upper = token.toUpperCase();
    if ( def.aliases[ upper ] !== undefined ) return String( def.aliases[ upper ] );

    return token;
  }
}
