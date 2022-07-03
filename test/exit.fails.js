import { test } from 'uvu';

// TODO: test.fail() modifier (see #47)

// A test that calls process.exit must fail (even if it exits with 0).
// Otherwise all tests might not run, or even all assertions within test.
test('should fail if `process.exit` encountered', async () => {
  process.exit(0);
});

// This promise will never resolve & the process will exit early.
// This must fail, otherwise all tests/assertions might not run.
test('should fail if Promise never resolves :: GC', async () => {
  await new Promise(() => {});
});

test.run();
