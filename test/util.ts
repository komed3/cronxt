/**
 * Test Utility
 * Minimal test utility.
 */

let passed = 0;
let failed = 0;

/** Register and execute a test case. */
export function test ( name: string, fn: () => void ) : void {
  try {
    fn();
    passed++;

    console.log( `✓ ${ name }` );
  } catch ( err ) {
    failed++;

    console.error( `✗ ${ name }` );
    console.error( err );
  }
}
