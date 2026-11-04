import { test } from 'uvu';

test('throws null', () => { throw null; });
test('throws undefined', () => { throw undefined; });
test('still runs the next test', () => {});

test.run();
