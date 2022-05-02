import { test } from 'uvu';

test('this should not pass', async () => {
  // This promise will never resolve, and the process will exit early.
  // This must fail, otherwise we might not run all tests, or even all
  // assertions in this test.
  await new Promise(() => {});
});

test.run();
