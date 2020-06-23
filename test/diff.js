import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/diff';

const strip = str => str.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g, '');

const arrays = suite('arrays');

arrays('should be a function', () => {
	assert.type($.arrays, 'function');
});

arrays.run();

// ---

const lines = suite('lines');

lines('should be a function', () => {
	assert.type($.lines, 'function');
});

lines.run();

// ---

const chars = suite('chars');

chars('should be a function', () => {
	assert.type($.chars, 'function');
});

chars.run();

// ---

const direct = suite('direct');

direct('should be a function', () => {
	assert.type($.direct, 'function');
});

// TODO: return nothing ?
direct.skip('should no differences with identical text', () => {
	// assert.fixture();
});

direct('should handle `"foo"` vs `"fo"` diff', () => {
	assert.snapshot(
		strip($.direct('foo', 'fo')),
		'++fo     (Expected)\n' +
		'--foo    (Actual)\n'
	);
});

direct('should handle `"fo"` vs `"foo"` diff', () => {
	assert.snapshot(
		strip($.direct('fo', 'foo')),
		'++foo    (Expected)\n' +
		'--fo     (Actual)\n'
	);
});

direct('should handle `"foo"` vs `"bar"` diff', () => {
	assert.snapshot(
		strip($.direct('foo', 'bar')),
		'++bar    (Expected)\n' +
		'--foo    (Actual)\n'
	);
});

direct('should handle `123` vs `456` diff', () => {
	assert.snapshot(
		strip($.direct(123, 456)),
		'++456    (Expected)\n' +
		'--123    (Actual)\n'
	);
});

// TODO: show type difference
direct('should handle `123` vs `"123"` diff', () => {
	assert.snapshot(
		strip($.direct(123, '123')),
		'++123    (Expected)\n' +
		'--123    (Actual)\n'
	);
});

direct.run();

// ---

const compare = suite('compare');

compare('should be a function', () => {
	assert.type($.compare, 'function');
});

compare.run();
