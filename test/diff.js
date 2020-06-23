import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/diff';

const strip = str => str.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g, '');

const arrays = suite('arrays');

arrays('should be a function', () => {
	assert.type($.arrays, 'function');
});

arrays('should handle simple values', () => {
	assert.is(
		strip($.arrays([1, 2, 3], [1, 2, 4])),
		'··[\n' +
		'····1,\n' +
		'····2,\n' +
		'Actual:\n' +
		'--··3,\n' +
		'Expected:\n' +
		'++··4,\n' +
		'··]\n'
	);
});

arrays('should allow dangling "Actual" block', () => {
	assert.is(
		strip($.arrays([1, 2, 3, 4], [1, 2, 4])),
		'··[\n' +
		'····1,\n' +
		'····2,\n' +
		'Actual:\n' +
		'--··3,\n' +
		'····4,\n' +
		'··]\n'
	);
});

arrays('should allow dangling "Expected" block', () => {
	assert.is(
		strip($.arrays([1, 2, 4], [1, 2, 3, 4])),
		'··[\n' +
		'····1,\n' +
		'····2,\n' +
		'Expected:\n' +
		'++··3,\n' +
		'····4,\n' +
		'··]\n'
	);
});

// TODO: improve later
arrays('should print/bail on complex objects', () => {
	assert.is(
		strip(
			$.arrays(
				[{ foo: 1 }, { bar: 2 }],
				[{ foo: 1 }]
			)
		),
		'··[\n' +
		'Actual:\n' +
		'--··{\n' +
		'--····"foo":·1,\n' +
		'--··}\n' +
		'--··{\n' +
		'--····"bar":·2,\n' +
		'--··}\n' +
		'Expected:\n' +
		'++··{\n' +
		'++····"foo":·1,\n' +
		'++··}\n' +
		'··]\n'
	);
});

arrays.run();

// ---

const lines = suite('lines');

lines('should be a function', () => {
	assert.type($.lines, 'function');
});

lines('should split on `\\r\\n` chars', () => {
	assert.is(
		strip($.lines('foo\nbar', 'foo\nbat')),
		'··foo\n' +
		'Actual:\n' +
		'--bar\n' +
		'Expected:\n' +
		'++bat\n'
	);

	assert.is(
		strip($.lines('foo\r\nbar', 'foo\r\nbat')),
		'··foo\n' +
		'Actual:\n' +
		'--bar\n' +
		'Expected:\n' +
		'++bat\n'
	);
});

lines('should allow for dangling "Actual" block', () => {
	assert.is(
		strip($.lines('foo\nbar\nbaz', 'foo\nbaz')),
		'··foo\n' +
		'Actual:\n' +
		'--bar\n' +
		'··baz\n'
	);
});

lines('should allow for dangling "Expected" block', () => {
	assert.is(
		strip($.lines('foo\nbaz', 'foo\nbar\nbaz')),
		'··foo\n' +
		'Expected:\n' +
		'++bar\n' +
		'··baz\n'
	);
});

lines('should accept line numbers', () => {
	assert.is(
		strip($.lines('foo\nbar', 'foo\nbat', 1)),
		'L1 ··foo\n' +
		'Actual:\n' +
		'L2 --bar\n' +
		'Expected:\n' +
		'L2 ++bat\n'
	);
});

lines('should handle line numbers with num-digits change', () => {
	assert.is(
		strip($.lines(
			'1\n2\n3\n4\n5\n6\n7\n8a\n9a\n10a\n11\n12\n13',
			'1\n2\n3\n4\n5\n6\n7\n8\n9\n10\n11\n12\n13', 1
		)),
		'L01 ··1\n' +
		'L02 ··2\n' +
		'L03 ··3\n' +
		'L04 ··4\n' +
		'L05 ··5\n' +
		'L06 ··6\n' +
		'L07 ··7\n' +
		'Actual:\n' +
		'L08 --8a\n' +
		'L09 --9a\n' +
		'L10 --10a\n' +
		'Expected:\n' +
		'L08 ++8\n' +
		'L09 ++9\n' +
		'L10 ++10\n' +
		'L11 ··11\n' +
		'L12 ··12\n' +
		'L13 ··13\n'
	);
});

lines('should track "expected" for line numbers', () => {
	assert.is(
		strip($.lines('foo\nbaz', 'foo\nbar\nbaz', 1)),
		'L1 ··foo\n' +
		'Expected:\n' +
		'L2 ++bar\n' +
		'L3 ··baz\n'
	);

	assert.is(
		strip($.lines('foo\nbar\nbaz', 'foo\nbaz', 1)),
		'L1 ··foo\n' +
		'Actual:\n' +
		'L2 --bar\n' +
		'L2 ··baz\n'
	);
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

chars('should handle `"yellow"` vs `"hello"` diff', () => {
	assert.is(
		strip($.chars('yellow', 'hello')),
		'++hello     (Expected)\n' +
		'--yellow    (Actual)\n' +
		'  ^    ^'
	);

	assert.is(
		strip($.chars('hello', 'yellow')),
		'++yellow    (Expected)\n' +
		'--hello     (Actual)\n' +
		'  ^    ^'
	);
});

chars('should handle shared prefix', () => {
	assert.is(
		strip($.chars('abc123', 'abc1890')),
		'++abc1890    (Expected)\n' +
		'--abc123     (Actual)\n' +
		'      ^^^'
	);

	assert.is(
		strip($.chars('abc1890', 'abc123')),
		'++abc123     (Expected)\n' +
		'--abc1890    (Actual)\n' +
		'      ^^^'
	);

	assert.is(
		strip($.chars('abc1890', 'abc1234')),
		'++abc1234    (Expected)\n' +
		'--abc1890    (Actual)\n' +
		'      ^^^'
	);
});

chars('should handle shared suffix', () => {
	assert.is(
		strip($.chars('123xyz', '00xyz')),
		'++ 00xyz    (Expected)\n' +
		'--123xyz    (Actual)\n' +
		'  ^^^   '
	);

	assert.is(
		strip($.chars('00xyz', '123xyz')),
		'++123xyz    (Expected)\n' +
		'-- 00xyz    (Actual)\n' +
		'  ^^^   '
	);

	assert.is(
		strip($.chars('000xyz', '123xyz')),
		'++123xyz    (Expected)\n' +
		'--000xyz    (Actual)\n' +
		'  ^^^   '
	);
});

chars('should handle shared middle', () => {
	assert.is(
		strip($.chars('123xyz456', '789xyz000')),
		'++789xyz000    (Expected)\n' +
		'--123xyz456    (Actual)\n' +
		'  ^^^   ^^^'
	);

	assert.is(
		strip($.chars('123xyz45', '789xyz000')),
		'++789xyz000    (Expected)\n' +
		'--123xyz45     (Actual)\n' +
		'  ^^^   ^^^'
	);

	assert.is(
		strip($.chars('23xyz45', '789xyz000')),
		'++789xyz000    (Expected)\n' +
		'-- 23xyz45     (Actual)\n' +
		'  ^^^   ^^^'
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

compare('should proxy `$.arrays` for Array inputs', () => {
	assert.is(
		strip($.compare([1, 2, 3], [1, 2, 4])),
		'··[\n' +
		'····1,\n' +
		'····2,\n' +
		'Actual:\n' +
		'--··3,\n' +
		'Expected:\n' +
		'++··4,\n' +
		'··]\n'
	);
});

compare('should proxy `$.chars` for RegExp inputs', () => {
	assert.is(
		strip($.compare(/foo/g, /foobar/gi)),
		'++/foobar/gi    (Expected)\n' +
		'--/foo/g        (Actual)\n' +
		'      ^^^  ^'
	);

	assert.is(
		strip($.compare(/foobar/gi, /foo/g)),
		'++/foo/g        (Expected)\n' +
		'--/foobar/gi    (Actual)\n' +
		'      ^^^  ^'
	);
});

compare('should proxy `$.lines` for Object inputs', () => {
	assert.is(
		strip($.compare({ foo: 1 }, { foo: 2, bar: 3 })),
		'··{\n' +
		'Actual:\n' +
		'--··"foo":·1\n' +
		'Expected:\n' +
		'++··"foo":·2,\n' +
		'++··"bar":·3\n' +
		'··}\n'
	);

	assert.is(
		strip($.compare({ foo: 2, bar: 3 }, { foo: 1 })),
		'··{\n' +
		'Actual:\n' +
		'--··"foo":·2,\n' +
		'--··"bar":·3\n' +
		'Expected:\n' +
		'++··"foo":·1\n' +
		'··}\n'
	);
});

compare('should proxy `$.lines` for multi-line String inputs', () => {
	assert.is(
		strip($.compare('foo\nbar', 'foo\nbat')),
		'··foo\n' +
		'Actual:\n' +
		'--bar\n' +
		'Expected:\n' +
		'++bat\n'
	);
});

compare('should proxy `$.chars` for single-line String inputs', () => {
	assert.is(
		strip($.compare('foobar', 'foobaz')),
		'++foobaz    (Expected)\n' +
		'--foobar    (Actual)\n' +
		'       ^'
	);
});

compare('should proxy `$.direct` for Number inputs', () => {
	assert.snapshot(
		strip($.compare(123, 12345)),
		'++12345    (Expected)\n' +
		'--123      (Actual)\n'
	);
});

compare('should proxy `$.direct` for Boolean inputs', () => {
	assert.snapshot(
		strip($.compare(true, false)),
		'++false    (Expected)\n' +
		'--true     (Actual)\n'
	);
});

compare.run();
