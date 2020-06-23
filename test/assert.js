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
	assert.is(err.expects, expect, '~> expects');
	assert.is(err.actual, input, '~> actual');
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

const snapshot = suite('snapshot');

snapshot('should be a function', () => {
	assert.type($.snapshot, 'function');
});

snapshot.run();

// ---

const fixture = suite('fixture');

fixture('should be a function', () => {
	assert.type($.fixture, 'function');
});

fixture.run();

// ---

const throws = suite('throws');

throws('should be a function', () => {
	assert.type($.throws, 'function');
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

ok.run();
