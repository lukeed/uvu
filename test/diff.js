import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/diff';

const isNode8 = process.versions.node.startsWith('8.');
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

arrays('should handle nullish values', () => {
	assert.is(
		strip($.arrays(['foo', 'bar', undefined], ['foo', 'bar', 'baz'])),
		'··[\n' +
		'····"foo",\n' +
		'····"bar",\n' +
		'Actual:\n' +
		'--··undefined,\n' +
		'Expected:\n' +
		'++··"baz",\n' +
		'··]\n'
	);

	assert.is(
		strip($.arrays([1, 2, NaN, undefined], [1, 2, null, null])),
		'··[\n' +
		'····1,\n' +
		'····2,\n' +
		'Actual:\n' +
		'--··NaN,\n' +
		'--··undefined,\n' +
		'Expected:\n' +
		'++··null,\n' +
		'++··null,\n' +
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
		'--····"foo":·1\n' +
		'--··},\n' +
		'--··{\n' +
		'--····"bar":·2\n' +
		'--··}\n' +
		'Expected:\n' +
		'++··{\n' +
		'++····"foo":·1\n' +
		'++··}\n' +
		'··]\n'
	);

	assert.is(
		strip(
			$.arrays(
				[ [111], ['bbb'] ],
				[ [333], ['xxx'] ],
			)
		),
		'··[\n' +
		'Actual:\n' +
		'--··[\n' +
		'--····111\n' +
		'--··],\n' +
		'--··[\n' +
		'--····"bbb"\n' +
		'--··]\n' +
		'Expected:\n' +
		'++··[\n' +
		'++····333\n' +
		'++··],\n' +
		'++··[\n' +
		'++····"xxx"\n' +
		'++··]\n' +
		'··]\n'
	);

	assert.is(
		strip(
			$.arrays(
				[ [111, 222], ['aaa', 'bbb'] ],
				[ [333, 444], ['aaa', 'xxx'] ],
			)
		),
		'··[\n' +
		'Actual:\n' +
		'--··[\n' +
		'--····111,\n' +
		'--····222\n' +
		'--··],\n' +
		'--··[\n' +
		'--····"aaa",\n' +
		'--····"bbb"\n' +
		'--··]\n' +
		'Expected:\n' +
		'++··[\n' +
		'++····333,\n' +
		'++····444\n' +
		'++··],\n' +
		'++··[\n' +
		'++····"aaa",\n' +
		'++····"xxx"\n' +
		'++··]\n' +
		'··]\n'
	);

	assert.is(
		strip(
			$.arrays(
				[{
					foobar: 123,
					position: {
						start: { line: 1, column: 1, offset: 0, index: 0 },
						end: { line: 1, column: 8, offset: 7 }
					}
				}],
				[{
					foobar: 456,
					position: {
						start: { line: 2, column: 1, offset: 0, index: 0 },
						end: { line: 9, column: 9, offset: 6 }
					}
				}]
			)
		),
		'··[\n' +
		'Actual:\n' +
		'--··{\n' +
		'--····"foobar":·123,\n' +
		'--····"position":·{\n' +
		'--······"start":·{\n' +
		'--········"line":·1,\n' +
		'--········"column":·1,\n' +
		'--········"offset":·0,\n' +
		'--········"index":·0\n' +
		'--······},\n' +
		'--······"end":·{\n' +
		'--········"line":·1,\n' +
		'--········"column":·8,\n' +
		'--········"offset":·7\n' +
		'--······}\n' +
		'--····}\n' +
		'--··}\n' +
		'Expected:\n' +
		'++··{\n' +
		'++····"foobar":·456,\n' +
		'++····"position":·{\n' +
		'++······"start":·{\n' +
		'++········"line":·2,\n' +
		'++········"column":·1,\n' +
		'++········"offset":·0,\n' +
		'++········"index":·0\n' +
		'++······},\n' +
		'++······"end":·{\n' +
		'++········"line":·9,\n' +
		'++········"column":·9,\n' +
		'++········"offset":·6\n' +
		'++······}\n' +
		'++····}\n' +
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

lines('should retain new lines ("↵") differences', () => {
	assert.is(
		strip($.lines('foo\nbaz', 'foo\n\n\nbaz')),
		'··foo\n' +
		'Expected:\n' +
		'++↵\n' +
		'++↵\n' +
		'··baz\n'
	);

	assert.is(
		strip($.lines('foo\nbaz', 'foo\n\n\nbaz', 1)),
		'L1 ··foo\n' +
		'Expected:\n' +
		'L2 ++↵\n' +
		'L3 ++↵\n' +
		'L4 ··baz\n'
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

chars('should print "·" character for space', () => {
	assert.is(
		strip($.chars('foo bar', 'foo bar baz')),
		'++foo·bar·baz    (Expected)\n' +
		'--foo·bar        (Actual)\n' +
		'         ^^^^'
	);

	assert.is(
		strip($.chars('foo   bar', 'foo bar')),
		'++foo·bar      (Expected)\n' +
		'--foo···bar    (Actual)\n' +
		'      ^^   '
	);
});

chars('should print "→" character for tab', () => {
	assert.is(
		strip($.chars('foo bar\tbaz \t', 'foo bar\tbaz \t\t bat')),
		'++foo·bar→baz·→→·bat    (Expected)\n' +
		'--foo·bar→baz·→         (Actual)\n' +
		'               ^^^^^'
	);

	assert.is(
		strip($.chars('foo bar\tbaz \t\t bat', 'foo bar\tbaz \t')),
		'++foo·bar→baz·→         (Expected)\n' +
		'--foo·bar→baz·→→·bat    (Actual)\n' +
		'               ^^^^^'
	);

	assert.is(
		strip($.chars('foo\tbar\tbaz', 'foo bar baz')),
		'++foo·bar·baz    (Expected)\n' +
		'--foo→bar→baz    (Actual)\n' +
		'     ^   ^   '
	);
});

chars('should handle empty string', () => {
	assert.is(
		strip($.chars('foo bar', '')),
		'++           (Expected)\n' +
		'--foo·bar    (Actual)\n' +
		'  ^^^^^^^'
		);

	assert.is(
		strip($.chars('', 'foo bar')),
		'++foo·bar    (Expected)\n' +
		'--           (Actual)\n' +
		'  ^^^^^^^'
	);
})

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

direct('should handle `123` vs `"123"` diff', () => {
	assert.snapshot(
		strip($.direct(123, '123')),
		'++123  [string]  (Expected)\n' +
		'--123  [number]  (Actual)\n'
	);

	assert.snapshot(
		strip($.direct('123', 123)),
		'++123  [number]  (Expected)\n' +
		'--123  [string]  (Actual)\n'
	);
});

direct('should handle `12` vs `"123"` diff', () => {
	assert.snapshot(
		strip($.direct(12, '123')),
		'++123  [string]  (Expected)\n' +
		'--12   [number]  (Actual)\n'
	);

	assert.snapshot(
		strip($.direct('123', 12)),
		'++12   [number]  (Expected)\n' +
		'--123  [string]  (Actual)\n'
	);
});

direct('should handle `null` vs `"null"` diff', () => {
	assert.snapshot(
		strip($.direct(null, 'null')),
		'++null  [string]  (Expected)\n' +
		'--null  [object]  (Actual)\n'
	);

	assert.snapshot(
		strip($.direct('null', null)),
		'++null  [object]  (Expected)\n' +
		'--null  [string]  (Actual)\n'
	);
});

direct('should handle `true` vs `"true"` diff', () => {
	assert.snapshot(
		strip($.direct(true, 'true')),
		'++true  [string]   (Expected)\n' +
		'--true  [boolean]  (Actual)\n'
	);

	assert.snapshot(
		strip($.direct('true', true)),
		'++true  [boolean]  (Expected)\n' +
		'--true  [string]   (Actual)\n'
	);
});

direct('should handle `false` vs `"true"` diff', () => {
	assert.snapshot(
		strip($.direct(false, 'true')),
		'++true   [string]   (Expected)\n' +
		'--false  [boolean]  (Actual)\n'
	);

	assert.snapshot(
		strip($.direct('true', false)),
		'++false  [boolean]  (Expected)\n' +
		'--true   [string]   (Actual)\n'
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

	assert.is(
		strip($.compare({ foo: 2, bar: undefined, baz: NaN }, { foo: 1, bar: null })),
		'··{\n' +
		'Actual:\n' +
		'--··"foo":·2,\n' +
		'--··"bar":·undefined,\n' +
		'--··"baz":·NaN\n' +
		'Expected:\n' +
		'++··"foo":·1,\n' +
		'++··"bar":·null\n' +
		'··}\n'
	);

	assert.is(
		strip($.compare({ foo: 2, bar: null, baz: NaN }, { foo: 2, bar: undefined, baz: NaN })),
		'··{\n' +
		'····"foo":·2,\n' +
		'Actual:\n' +
		'--··"bar":·null,\n' +
		'Expected:\n' +
		'++··"bar":·undefined,\n' +
		'····"baz":·NaN\n' +
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

	assert.snapshot(
		strip($.compare(123, NaN)),
		'++NaN    (Expected)\n' +
		'--123    (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(NaN, 123)),
		'++123    (Expected)\n' +
		'--NaN    (Actual)\n'
	);
});

compare('should proxy `$.direct` for Boolean inputs', () => {
	assert.snapshot(
		strip($.compare(true, false)),
		'++false    (Expected)\n' +
		'--true     (Actual)\n'
	);
});

compare('should handle string against non-type mismatch', () => {
	assert.snapshot(
		strip($.compare('foobar', null)),
		'++null    [object]  (Expected)\n' +
		'--foobar  [string]  (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(null, 'foobar')),
		'++foobar  [string]  (Expected)\n' +
		'--null    [object]  (Actual)\n'
	);

	assert.snapshot(
		strip($.compare('foobar', 123)),
		'++123     [number]  (Expected)\n' +
		'--foobar  [string]  (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(123, 'foobar')),
		'++foobar  [string]  (Expected)\n' +
		'--123     [number]  (Actual)\n'
	);

	assert.snapshot(
		strip($.compare('foobar', undefined)),
		'++undefined  [undefined]  (Expected)\n' +
		'--foobar     [string]     (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(undefined, 'foobar')),
		'++foobar     [string]     (Expected)\n' +
		'--undefined  [undefined]  (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(NaN, undefined)),
		'++undefined  [undefined]  (Expected)\n' +
		'--NaN        [number]     (Actual)\n'
	);

	assert.snapshot(
		strip($.compare(undefined, NaN)),
		'++NaN        [number]     (Expected)\n' +
		'--undefined  [undefined]  (Actual)\n'
	);
});

compare('should handle multi-line string against non-type mismatch', () => {
	assert.snapshot(
		strip($.compare('foo\nbar', null)),
		'Actual:\n' +
		'--foo\n' +
		'--bar\n' +
		'Expected:\n' +
		'++null\n'
	);

	assert.snapshot(
		strip($.compare(null, 'foo\nbar')),
		'Actual:\n' +
		'--null\n' +
		'Expected:\n' +
		'++foo\n' +
		'++bar\n'
	);

	assert.snapshot(
		strip($.compare('foo\nbar', 123)),
		'Actual:\n' +
		'--foo\n' +
		'--bar\n' +
		'Expected:\n' +
		'++123\n'
	);

	assert.snapshot(
		strip($.compare(123, 'foo\nbar')),
		'Actual:\n' +
		'--123\n' +
		'Expected:\n' +
		'++foo\n' +
		'++bar\n'
	);

	assert.snapshot(
		strip($.compare('foo\nbar', undefined)),
		'Actual:\n' +
		'--foo\n' +
		'--bar\n' +
		'Expected:\n' +
		'++undefined\n'
	);

	assert.snapshot(
		strip($.compare(undefined, 'foo\nbar')),
		'Actual:\n' +
		'--undefined\n' +
		'Expected:\n' +
		'++foo\n' +
		'++bar\n'
	);
});

compare('should handle `null` vs object', () => {
	assert.snapshot(
		strip($.compare(null, { foo: 123 })),
		'Actual:\n' +
		'--null\n' +
		'Expected:\n' +
		'++{\n' +
		'++··"foo":·123\n' +
		'++}\n'
	);

	assert.snapshot(
		strip($.compare({ foo: 123 }, null)),
		'Actual:\n' +
		'--{\n' +
		'--··"foo":·123\n' +
		'--}\n' +
		'Expected:\n' +
		'++null\n'
	);
});

compare('should handle `undefined` vs object', () => {
	assert.snapshot(
		strip($.compare(undefined, { foo: 123 })),
		'Actual:\n' +
		'--undefined\n' +
		'Expected:\n' +
		'++{\n' +
		'++··"foo":·123\n' +
		'++}\n'
	);

	assert.snapshot(
		strip($.compare({ foo: 123 }, undefined)),
		'Actual:\n' +
		'--{\n' +
		'--··"foo":·123\n' +
		'--}\n' +
		'Expected:\n' +
		'++undefined\n'
	);
});

compare.run();

// ---

const sort = suite('sort()');

sort('should ignore Date instances', () => {
	assert.equal($.sort({}, new Date), {});
	assert.equal($.sort(new Date, new Date), {});
	assert.equal($.sort(new Date, {}), {});
});

sort('should ignore RegExp instances', () => {
	assert.equal($.sort({}, /foo/), {});
	assert.equal($.sort(/foo/, /foo/), {});
	assert.equal($.sort(/foo/, {}), {});
});

sort('should ignore Set instances', () => {
	assert.equal($.sort({}, new Set), {});
	assert.equal($.sort(new Set, new Set), {});
	assert.equal($.sort(new Set, {}), {});
});

sort('should ignore Map instances', () => {
	assert.equal($.sort({}, new Map), {});
	assert.equal($.sort(new Map, new Map), {});
	assert.equal($.sort(new Map, {}), {});
});

sort('should align `input` to `expect` key order', () => {
	assert.equal(
		$.sort({ b: 2, a: 1 }, { a: 1, b: 2 }),
		{ a: 1, b: 2 }
	);
});

sort('should append extra `input` keys', () => {
	assert.equal(
		$.sort({ c: 3, b: 2, a: 1 }, { a: 1 }),
		{ a: 1, c: 3, b: 2 }
	);
});

sort('should omit missing `expect` keys', () => {
	assert.equal(
		$.sort({ c: 3, a: 1 }, { a: 1, b: 2, c: 3 }),
		{ a: 1, c: 3 }
	);
});

sort('should loop through Arrays for nested sorts', () => {
	assert.equal(
		$.sort([
			{ a2: 2, a1: 1 },
			{ b3: 3, b2: 2 },
		], [
			{ a1: 1, a2: 2, a3: 3 },
			{ b1: 1, b2: 2, b3: 3 },
		]),
		[
			{ a1: 1, a2: 2 },
			{ b2: 2, b3: 3 },
		]
	);
});

sort('should handle nested Object sorts', () => {
	assert.equal(
		$.sort({
			bar: { b:2, a:1 },
			foo: { c:3, b:2, a:1 },
		}, {
			foo: { b:2, c:3 },
			bar: { b:2 },
		}),
		{
			foo: { b:2, c:3, a:1 },
			bar: { b:2, a:1 },
		}
	);
});

sort('should handle Object dictionary', () => {
	let input = Object.create(null);
	let expect = Object.create(null);

	input.aaa = 123;
	input.bbb = 123;
	input.ccc = 123;

	expect.ccc = 123;
	expect.aaa = 123;
	expect.bbb = 123;

	assert.equal(
		$.sort(input, expect),
		{ ccc: 123, bbb: 123, aaa: 123 }
	);
});

sort.run();

// ---

const circular = suite('circular');

circular('should ignore non-object values', () => {
	const input = { a:1, b:2, c:'c', d:null, e:()=>{} };

	assert.is(
		JSON.stringify(input, $.circular()),
		'{"a":1,"b":2,"c":"c","d":null}'
	);
});

circular('should retain `undefined` and `NaN` values', () => {
	const input = { a:1, b:undefined, c:NaN };

	assert.is(
		JSON.stringify(input, $.circular()),
		'{"a":1,"b":"[__VOID__]","c":"[__NAN__]"}'
	);

	assert.is(
		JSON.stringify(input),
		'{"a":1,"c":null}'
	);
});

circular('should replace circular references with "[Circular]" :: Object', () => {
	const input = { a:1, b:2 };
	input.self = input;

	assert.is(
		JSON.stringify(input, $.circular()),
		'{"a":1,"b":2,"self":"[Circular]"}'
	);

	assert.throws(
		() => JSON.stringify(input),
		'Converting circular structure to JSON'
	);

	assert.is(
		JSON.stringify({ aaa: input, bbb: 123 }, $.circular()),
		'{"aaa":{"a":1,"b":2,"self":"[Circular]"},"bbb":123}'
	);
});

circular('should replace circular references with "[Circular]" :: Array', () => {
	const input = { a:1, b:2 };
	input.self = input;

	assert.is(
		JSON.stringify([input], $.circular()),
		'[{"a":1,"b":2,"self":"[Circular]"}]'
	);

	assert.throws(
		() => JSON.stringify(input),
		'Converting circular structure to JSON'
	);

	assert.is(
		JSON.stringify([{ aaa:1 }, { aaa:input }], $.circular()),
		'[{"aaa":1},{"aaa":{"a":1,"b":2,"self":"[Circular]"}}]',
	);
});

circular.run();

// ---

const stringify = suite('stringify');

stringify('should wrap `JSON.stringify` native', () => {
	const input = { a:1, b:2, c:'c', d:null, e:()=>{} };

	assert.is(
		$.stringify(input),
		JSON.stringify(input, null, 2)
	);
});

stringify('should retain `undefined` and `NaN` values :: Object', () => {
	assert.is(
		$.stringify({ a: 1, b: undefined, c: NaN }),
		'{\n  "a": 1,\n  "b": undefined,\n  "c": NaN\n}'
	);
});

// In ES6, array holes are treated like `undefined` values
stringify('should retain `undefined` and `NaN` values :: Array', () => {
	assert.is(
		$.stringify([1, undefined, 2, , 3, NaN, 4, 5]),
		'[\n  1,\n  undefined,\n  2,\n  undefined,\n  3,\n  NaN,\n  4,\n  5\n]'
	);
});

if (!isNode8) {
	// Not currently supporting :: Object(BigInt(3)) && Object(4n)
	stringify('should handle `BigInt` values correctly', () => {
		let bigint = eval('100n'); // avoid Node8 syntax error
		assert.is($.stringify(BigInt(1)), '"1"');
		assert.is($.stringify(bigint), '"100"');
		assert.is(
			$.stringify([BigInt(1), bigint]),
			'[\n  "1",\n  "100"\n]'
		);
	});
}

stringify.run();
