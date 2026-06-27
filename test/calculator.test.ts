import { expect, summary, hl, test } from './util';
import { next, prev } from '../src';

const after = ( iso: string ) => ( { after: new Date( iso ) } );
const before = ( iso: string ) => ( { before: new Date( iso ) } );
