import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/assert';

const Assertion = suite('Assertion');

Assertion('should extend Error', () => {
	assert.instance(new $.Assertion(), Error);
});

Assertion.run();

// ---

const ok = suite('ok');

ok('should be a function', () => {
	assert.type($.ok, 'function');
});

ok.run();

// ---

const is = suite('is');

is('should be a function', () => {
	assert.type($.is, 'function');
});

is.run();

// ---

const equal = suite('equal');

equal('should be a function', () => {
	assert.type($.equal, 'function');
});

equal.run();

// ---

const unreachable = suite('unreachable');

unreachable('should be a function', () => {
	assert.type($.unreachable, 'function');
});

unreachable.run();

// ---

const instance = suite('instance');

instance('should be a function', () => {
	assert.type($.instance, 'function');
});

instance.run();

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

const type = suite('type');

type('should be a function', () => {
	assert.type($.type, 'function');
});

type.run();

// ---

const not = suite('not');

not('should be a function', () => {
	assert.type($.not, 'function');
});

not.run();
