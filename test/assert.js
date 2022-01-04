import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/assert';

function isError(err, msg, input, expect, operator, details) {
	assert.instance(err, Error);
	if (msg) assert.is(err.message, msg, '~> message');
	assert.is(!!err.generated, !msg, '~> generated');
	assert.ok(err.stack, '~> stack');

	assert.instance(err, $.Assertion);
	assert.is(err.name, 'Assertion');
	assert.is(err.code, 'ERR_ASSERTION');
	assert.is(!!err.details, !!details, '~> details');
	assert.is(err.operator, operator, '~> operator');
	assert.equal(err.expects, expect, '~> expects');
	assert.equal(err.actual, input, '~> actual');
}

const Assertion = suite('Assertion');

Assertion('should extend Error', () => {
	assert.instance(new $.Assertion(), Error);
});

Assertion('should expect input options', () => {
	let err = new $.Assertion({
		actual: 'foo',
		operator: 'is',
		expects: 'bar',
		message: 'Expected "foo" to equal "bar"',
		generated: false,
		details: true,
	});
	isError(
		err,
		'Expected "foo" to equal "bar"',
		'foo', 'bar', 'is', true
	);
});

Assertion.run();

// ---

const ok = suite('ok');

ok('should be a function', () => {
	assert.type($.ok, 'function');
});

ok('should not throw if valid', () => {
	assert.not.throws(() => $.ok(true));
});

ok('should throw if invalid', () => {
	try {
		$.ok(false);
	} catch (err) {
		isError(err, '', false, true, 'ok', false);
	}
});

ok('should throw with custom message', () => {
	try {
		$.ok(false, 'hello there');
	} catch (err) {
		isError(err, 'hello there', false, true, 'ok', false);
	}
});

ok.run();

// ---

const is = suite('is');

is('should be a function', () => {
	assert.type($.is, 'function');
});

is('should not throw if valid', () => {
	assert.not.throws(() => $.is('abc', 'abc'));
	assert.not.throws(() => $.is(true, true));
	assert.not.throws(() => $.is(123, 123));
});

is('should throw if invalid', () => {
	try {
		$.is('foo', 'bar');
	} catch (err) {
		isError(err, '', 'foo', 'bar', 'is', true);
	}
});

is('should throw with custom message', () => {
	try {
		$.is(123, 456, 'hello there');
	} catch (err) {
		isError(err, 'hello there', 123, 456, 'is', true);
	}
});

// TODO: add throws() instance matcher?
// assert.throws(() => {}, $.Assertion)
is('should use strict equality checks', () => {
	try {
		let arr = [3, 4, 5];
		$.is(arr, arr.slice());
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
	}

	try {
		let obj = { foo: 123 }
		$.is(obj, { ...obj });
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
	}
});

is.run();

// ---

const equal = suite('equal');

equal('should be a function', () => {
	assert.type($.equal, 'function');
});

equal('should not throw if valid', () => {
	assert.not.throws(() => $.equal('abc', 'abc'));
	assert.not.throws(() => $.equal(true, true));
	assert.not.throws(() => $.equal(123, 123));

	assert.not.throws(() => $.equal([1, 2, 3], [1, 2, 3]));
	assert.not.throws(() => $.equal({ foo: [2, 3] }, { foo: [2, 3] }));
});

equal('should throw if invalid', () => {
	let input = {
		foo: ['aaa'],
		bar: [2, 3]
	};

	let expect = {
		foo: ['a', 'a'],
		bar: [{ a: 1, b: 2 }]
	};

	try {
		$.equal(input, expect);
	} catch (err) {
		isError(err, '', input, expect, 'equal', true);
	}
});

equal('should throw with custom message', () => {
	let input = {
		foo: ['aaa'],
		bar: [2, 3]
	};

	let expect = {
		foo: ['a', 'a'],
		bar: [{ a: 1, b: 2 }]
	};

	try {
		$.equal(input, expect, 'hello there');
	} catch (err) {
		isError(err, 'hello there', input, expect, 'equal', true);
	}
});

equal('should use deep equality checks', () => {
	try {
		$.equal(
			{ a:[{ b:2 }] },
			{ a:[{ b:1 }] }
		);
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
	}

	try {
		$.equal(
			[{ a:2 }, { b:2 }],
			[{ a:1 }, { b:2 }]
		);
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
	}
});

// Issue #178
equal('should throw assertion error on array type mismatch', () => {
	try {
		$.equal(null, [1]);
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
	}
})

equal.run();

// ---

const unreachable = suite('unreachable');

unreachable('should be a function', () => {
	assert.type($.unreachable, 'function');
});

unreachable('should always throw', () => {
	try {
		$.unreachable();
	} catch (err) {
		isError(err, '', true, false, 'unreachable', false);
	}
});

unreachable('should customize message', () => {
	try {
		$.unreachable('hello');
	} catch (err) {
		isError(err, 'hello', true, false, 'unreachable', false);
	}
});

unreachable.run();

// ---

const instance = suite('instance');

instance('should be a function', () => {
	assert.type($.instance, 'function');
});

instance('should not throw if valid', () => {
	assert.not.throws(() => $.instance(new Date, Date));
	assert.not.throws(() => $.instance(/foo/, RegExp));
	assert.not.throws(() => $.instance({}, Object));
	assert.not.throws(() => $.instance([], Array));
});

instance('should throw if invalid', () => {
	try {
		$.instance('foo', Error);
	} catch (err) {
		isError(err, '', 'foo', Error, 'instance', false);
	}
});

instance('should throw with custom message', () => {
	try {
		$.instance('foo', Error, 'hello there');
	} catch (err) {
		isError(err, 'hello there', 'foo', Error, 'instance', false);
	}
});

instance.run();

// ---

const type = suite('type');

type('should be a function', () => {
	assert.type($.type, 'function');
});

type('should not throw if valid', () => {
	assert.not.throws(() => $.type(123, 'number'));
	assert.not.throws(() => $.type(true, 'boolean'));
	assert.not.throws(() => $.type($.type, 'function'));
	assert.not.throws(() => $.type('abc', 'string'));
	assert.not.throws(() => $.type(/x/, 'object'));
});

type('should throw if invalid', () => {
	try {
		$.type('foo', 'number');
	} catch (err) {
		isError(err, '', 'string', 'number', 'type', false);
	}
});

type('should throw with custom message', () => {
	try {
		$.type('foo', 'number', 'hello there');
	} catch (err) {
		isError(err, 'hello there', 'string', 'number', 'type', false);
	}
});

type.run();

// ---

// TODO
const snapshot = suite('snapshot');

snapshot('should be a function', () => {
	assert.type($.snapshot, 'function');
});

snapshot.run();

// ---

// TODO
const fixture = suite('fixture');

fixture('should be a function', () => {
	assert.type($.fixture, 'function');
});

fixture.run();

// ---

const match = suite('match');

match('should be a function', () => {
	assert.type($.match, 'function');
});

match('should not throw if valid', () => {
	assert.not.throws(() => $.match('foobar', 'foo'));
	assert.not.throws(() => $.match('foobar', 'bar'));

	assert.not.throws(() => $.match('foobar', /foo/));
	assert.not.throws(() => $.match('foobar', /bar/i));
});

match('should throw if invalid', () => {
	try {
		$.match('foobar', 'hello');
	} catch (err) {
		isError(err, '', 'foobar', 'hello', 'match', false);
	}

	try {
		$.match('foobar', /hello/i);
	} catch (err) {
		isError(err, '', 'foobar', /hello/i, 'match', false);
	}
});

match('should throw with custom message', () => {
	try {
		$.match('foobar', 'hello', 'howdy partner');
	} catch (err) {
		isError(err, 'howdy partner', 'foobar', 'hello', 'match', false);
	}
});

match.run();

// ---

const throws = suite('throws');

throws('should be a function', () => {
	assert.type($.throws, 'function');
});

throws('should throw if function does not throw Error :: generic', () => {
	try {
		$.throws(() => 123);
	} catch (err) {
		assert.is(err.message, 'Expected function to throw');
		isError(err, '', false, true, 'throws', false); // no details (true vs false)
	}
});

throws('should throw if function does not throw matching Error :: RegExp', () => {
	try {
		$.throws(() => { throw new Error('hello') }, /world/);
	} catch (err) {
		assert.is(err.message, 'Expected function to throw exception matching `/world/` pattern');
		isError(err, '', false, true, 'throws', false); // no details
	}
});

throws('should throw if function does not throw matching Error :: Function', () => {
	try {
		$.throws(
			() => { throw new Error },
			(err) => err.message.includes('foobar')
		);
	} catch (err) {
		assert.is(err.message, 'Expected function to throw matching exception');
		isError(err, '', false, true, 'throws', false); // no details
	}
});

throws('should not throw if function does throw Error :: generic', () => {
	assert.not.throws(
		() => $.throws(() => { throw new Error })
	);
});

throws('should not throw if function does throw matching Error :: RegExp', () => {
	assert.not.throws(
		() => $.throws(() => { throw new Error('hello') }, /hello/)
	);
});

throws('should not throw if function does throw matching Error :: Function', () => {
	assert.not.throws(() => {
		$.throws(
			() => { throw new Error('foobar') },
			(err) => err.message.includes('foobar')
		)
	});
});

throws.run();

// ---

const not = suite('not');

not('should be a function', () => {
	assert.type($.not, 'function');
});

not('should not throw if falsey', () => {
	assert.not.throws(() => $.not(false));
	assert.not.throws(() => $.not(undefined));
	assert.not.throws(() => $.not(null));
	assert.not.throws(() => $.not(''));
	assert.not.throws(() => $.not(0));
});

not('should throw if truthy', () => {
	try {
		$.not(true);
	} catch (err) {
		isError(err, '', true, false, 'not', false);
	}
});

not('should throw with custom message', () => {
	try {
		$.not(true, 'hello there');
	} catch (err) {
		isError(err, 'hello there', true, false, 'not', false);
	}
});

not.run();

// ---

const notOk = suite('not.ok');

notOk('should be a function', () => {
	assert.type($.not.ok, 'function');
});

notOk('should not throw if falsey', () => {
	assert.not.throws(() => $.not.ok(false));
	assert.not.throws(() => $.not.ok(undefined));
	assert.not.throws(() => $.not.ok(null));
	assert.not.throws(() => $.not.ok(''));
	assert.not.throws(() => $.not.ok(0));
});

notOk('should throw if truthy', () => {
	try {
		$.not.ok(true);
	} catch (err) {
		isError(err, '', true, false, 'not', false);
	}
});

notOk('should throw with custom message', () => {
	try {
		$.not.ok(true, 'hello there');
	} catch (err) {
		isError(err, 'hello there', true, false, 'not', false);
	}
});

notOk.run();

// ---

const notIs = suite('is.not');

notIs('should be a function', () => {
	assert.type($.is.not, 'function');
});

notIs('should not throw if values are not strictly equal', () => {
	assert.not.throws(() => $.is.not(true, false));
	assert.not.throws(() => $.is.not(123, undefined));
	assert.not.throws(() => $.is.not('123', 123));
	assert.not.throws(() => $.is.not(NaN, NaN));
	assert.not.throws(() => $.is.not([], []));
});

notIs('should throw if values are strictly equal', () => {
	try {
		$.is.not('hello', 'hello');
	} catch (err) {
		isError(err, '', 'hello', 'hello', 'is.not', false);
	}
});

notIs('should throw with custom message', () => {
	try {
		$.is.not('foo', 'foo', 'hello there');
	} catch (err) {
		isError(err, 'hello there', 'foo', 'foo', 'is.not', false);
	}
});

notIs.run();

// ---

const notEqual = suite('not.equal');

notEqual('should be a function', () => {
	assert.type($.not.equal, 'function');
});

notEqual('should throw if values are deeply equal', () => {
	try {
		$.not.equal('abc', 'abc');
	} catch (err) {
		isError(err, '', 'abc', 'abc', 'not.equal', false); // no details
	}

	try {
		$.not.equal(true, true);
	} catch (err) {
		isError(err, '', true, true, 'not.equal', false); // no details
	}

	try {
		$.not.equal(123, 123);
	} catch (err) {
		isError(err, '', 123, 123, 'not.equal', false); // no details
	}

	let arr = [1, 2, 3];
	let obj = { foo: [2, 3] };

	try {
		$.not.equal(arr, arr);
	} catch (err) {
		isError(err, '', arr, arr, 'not.equal', false); // no details
	}

	try {
		$.not.equal(obj, obj);
	} catch (err) {
		isError(err, '', obj, obj, 'not.equal', false); // no details
	}
});

notEqual('should not throw if values are not deeply equal', () => {
	let input = {
		foo: ['aaa'],
		bar: [2, 3]
	};

	let expect = {
		foo: ['a', 'a'],
		bar: [{ a: 1, b: 2 }]
	};

	assert.not.throws(
		() => $.not.equal(input, expect)
	);
});

notEqual('should throw with custom message', () => {
	let input = {
		foo: ['aaa'],
		bar: [2, 3]
	};

	try {
		$.not.equal(input, input, 'hello there');
	} catch (err) {
		isError(err, 'hello there', input, input, 'not.equal', false); // no details
	}
});

notEqual('should use deep equality checks', () => {
	try {
		$.not.equal(
			{ a:[{ b:2 }] },
			{ a:[{ b:2 }] },
		);
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
		assert.is(err.operator, 'not.equal');
	}

	try {
		$.not.equal(
			[{ a:2 }, { b:2 }],
			[{ a:2 }, { b:2 }],
		);
		assert.unreachable();
	} catch (err) {
		assert.instance(err, $.Assertion);
		assert.is(err.operator, 'not.equal');
	}
});

notEqual.run();

// ---

const notType = suite('not.type');

notType('should be a function', () => {
	assert.type($.not.type, 'function');
});

notType('should throw if types match', () => {
	try {
		$.not.type(123, 'number');
	} catch (err) {
		isError(err, '', 'number', 'number', 'not.type', false);
	}

	try {
		$.not.type(true, 'boolean');
	} catch (err) {
		isError(err, '', 'boolean', 'boolean', 'not.type', false);
	}

	try {
		$.not.type($.not.type, 'function');
	} catch (err) {
		isError(err, '', 'function', 'function', 'not.type', false);
	}

	try {
		$.not.type('abc', 'string');
	} catch (err) {
		isError(err, '', 'string', 'string', 'not.type', false);
	}

	try {
		$.not.type(/x/, 'object');
	} catch (err) {
		isError(err, '', 'object', 'object', 'not.type', false);
	}
});

notType('should not throw if types do not match', () => {
	assert.not.throws(
		() => $.not.type('foo', 'number')
	);
});

notType('should throw with custom message', () => {
	try {
		$.not.type('abc', 'string', 'hello world');
	} catch (err) {
		isError(err, 'hello world', 'string', 'string', 'not.type', false);
	}
});

notType.run();

// ---

const notInstance = suite('not.instance');

notInstance('should be a function', () => {
	assert.type($.not.instance, 'function');
});

notInstance('should throw if values match', () => {
	// isError uses is() check -- lazy
	let inputs = {
		date: new Date,
		regexp: /foo/,
		object: {},
		array: [],
	};

	try {
		$.not.instance(inputs.date, Date);
	} catch (err) {
		isError(err, '', inputs.date, Date, 'not.instance', false);
	}

	try {
		$.not.instance(inputs.regexp, RegExp);
	} catch (err) {
		isError(err, '', inputs.regexp, RegExp, 'not.instance', false);
	}

	try {
		$.not.instance(inputs.object, Object);
	} catch (err) {
		isError(err, '', inputs.object, Object, 'not.instance', false);
	}

	try {
		$.not.instance(inputs.array, Array);
	} catch (err) {
		isError(err, '', inputs.array, Array, 'not.instance', false);
	}
});

notInstance('should not throw on mismatch', () => {
	assert.not.throws(() => $.not.instance('foo', Error));
});

notInstance('should throw with custom message', () => {
	try {
		$.not.instance('foo', String, 'hello there');
	} catch (err) {
		isError(err, 'hello there', 'foo', String, 'instance', false);
	}
});

notInstance.run();

// ---

// TODO
// const notSnapshot = suite('not.snapshot');
// notSnapshot.run();

// ---

// TODO
// const notFixture = suite('not.fixture');
// notFixture.run();

// ---

const notMatch = suite('not.match');

notMatch('should be a function', () => {
	assert.type($.not.match, 'function');
});

notMatch('should throw if values match', () => {
	try {
		$.not.match('foobar', 'foo');
	} catch (err) {
		isError(err, '', 'foobar', 'foo', 'not.match', false);
	}

	try {
		$.not.match('foobar', 'bar');
	} catch (err) {
		isError(err, '', 'foobar', 'bar', 'not.match', false);
	}

	try {
		$.not.match('foobar', /foo/);
	} catch (err) {
		isError(err, '', 'foobar', /foo/, 'not.match', false);
	}
});

notMatch('should not throw if types do not match', () => {
	assert.not.throws(
		() => $.not.match('foobar', 'hello')
	);

	assert.not.throws(
		() => $.not.match('foobar', /hello/)
	);
});

notMatch('should throw with custom message', () => {
	try {
		$.not.match('foobar', 'hello', 'hello world');
	} catch (err) {
		isError(err, 'hello world', 'foobar', 'hello', 'not.match', false);
	}
});

notMatch.run();

// ---

const notThrows = suite('not.throws');

notThrows('should be a function', () => {
	assert.type($.throws, 'function');
});

notThrows('should not throw if function does not throw Error :: generic', () => {
	assert.not.throws(
		() => $.not.throws(() => 123)
	);
});

notThrows('should not throw if function does not throw matching Error :: RegExp', () => {
	assert.not.throws(
		() => $.not.throws(() => { throw new Error('hello') }, /world/)
	);
});

notThrows('should not throw if function does not throw matching Error :: Function', () => {
	assert.not.throws(() => {
		$.not.throws(
			() => { throw new Error('hello') },
			(err) => err.message.includes('world')
		)
	});
});

notThrows('should throw if function does throw Error :: generic', () => {
	try {
		$.not.throws(() => { throw new Error });
	} catch (err) {
		assert.is(err.message, 'Expected function not to throw');
		isError(err, '', true, false, 'not.throws', false); // no details
	}
});

notThrows('should throw if function does throw matching Error :: RegExp', () => {
	try {
		$.not.throws(() => { throw new Error('hello') }, /hello/);
	} catch (err) {
		assert.is(err.message, 'Expected function not to throw exception matching `/hello/` pattern');
		isError(err, '', true, false, 'not.throws', false); // no details
	}
});

notThrows('should throw if function does throw matching Error :: Function', () => {
	try {
		$.not.throws(
			() => { throw new Error },
			(err) => err instanceof Error
		);
	} catch (err) {
		assert.is(err.message, 'Expected function not to throw matching exception');
		isError(err, '', true, false, 'not.throws', false); // no details
	}
});

notThrows.run();
