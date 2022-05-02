import { test } from 'uvu';
import * as assert from 'uvu/assert';

test('this should not pass', async () => {
  // A test that calls process.exit must fail (even if it exits with 0),
  // otherwise we might not run all tests, or even all assertions in this
  // test.
  process.exit(0);
});

test.run();
