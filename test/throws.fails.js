import { test } from 'uvu';

test('should fail correctly if throws null', () => {
	throw null;
});

test('should fail correctly if throws undefined', () => {
	throw undefined;
});

test('should fail correctly if throws an object', () => {
	throw {};
});

test('should run', () => {});

test('should fail correctly if throws a number', () => {
	throw 1;
});

test('should fail correctly if throws a string', () => {
	throw 'string';
});

test.run();
