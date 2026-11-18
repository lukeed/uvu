import { test } from 'uvu';

test('throws string', () => { throw 'reason'; });
test('throws number', () => { throw 42; });
test('rejects with string', () => new Promise((resolve, reject) => { reject('async reason'); }));
test('throws plain object', () => { throw { message: 'plain object' }; });
test('still runs the next test', () => {});

test.run();
