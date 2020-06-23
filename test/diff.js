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

// TODO: return nothing ?
chars.skip('should no differences with identical text', () => {
	// assert.fixture();
});

chars('should handle `"foo"` vs `"fo"` diff', () => {
	assert.is(
		strip($.chars('foo', 'fo')),
		'++fo     (Expected)\n' +
		'--foo    (Actual)\n'+
		'    ^'
	);
});

chars('should handle `"fo"` vs `"foo"` diff', () => {
	assert.is(
		strip($.chars('fo', 'foo')),
		'++foo    (Expected)\n' +
		'--fo     (Actual)\n'+
		'    ^'
	);
});

chars('should handle `"foo"` vs `"bar"` diff', () => {
	assert.is(
		strip($.chars('foo', 'bar')),
		'++bar    (Expected)\n' +
		'--foo    (Actual)\n' +
		'  ^^^'
	);
});

chars('should handle `"foobar"` vs `"foobaz"` diff', () => {
	assert.is(
		strip($.chars('foobar', 'foobaz')),
		'++foobaz    (Expected)\n' +
		'--foobar    (Actual)\n' +
		'       ^'
	);
});

chars('should handle two `Date.toISOString()` diff', () => {
	assert.is(
		strip($.chars('2019-12-23T01:26:30.092Z', '2020-06-23T01:45:31.268Z')),
		'++2020-06-23T01:45:31.268Z    (Expected)\n' +
		'--2019-12-23T01:26:30.092Z    (Actual)\n' +
		'    ^^ ^^       ^^  ^ ^^^ '
	);

	assert.is(
		strip($.chars('2019-12-23T01:26:30.098Z', '2020-06-23T01:45:31.268Z')),
		'++2020-06-23T01:45:31.268Z    (Expected)\n' +
		'--2019-12-23T01:26:30.098Z    (Actual)\n' +
		'    ^^ ^^       ^^  ^ ^^  '
	);

	assert.is(
		strip($.chars('2020-09-23T01:45:31.268Z', '2020-06-23T01:45:31.268Z')),
		'++2020-06-23T01:45:31.268Z    (Expected)\n' +
		'--2020-09-23T01:45:31.268Z    (Actual)\n' +
		'        ^                 '
	);
});

chars('should handle `"help"` vs `"hello"` diff', () => {
	assert.is(
		strip($.chars('help', 'hello')),
		'++hello    (Expected)\n' +
		'--help     (Actual)\n' +
		'     ^^'
	);
});

// TODO: improve this
chars('should handle `"yellow"` vs `"hello"` diff', () => {
	assert.is(
		strip($.chars('yellow', 'hello')),
		'++ hello      (Expected)\n' +
		'--yellow     (Actual)\n' +
		'  ^^^ ^^'
	);
});

chars('should handle `"hello"` vs `"yellow"` diff', () => {
	console.log(JSON.stringify(strip($.chars('hello', 'yellow'))))
	assert.is(
		strip($.chars('hello', 'yellow')),
		'++yellow    (Expected)\n' +
		'--hello     (Actual)\n' +
		'  ^    ^'
	);
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
