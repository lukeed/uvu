import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as uvu from '../src/index';

const QUEUE = suite('QUEUE');

QUEUE('should be an Array', () => {
	assert.instance(uvu.QUEUE, Array);
});

QUEUE.run();

// ---

const ste = suite('suite');

ste('should be a function', () => {
	assert.type(uvu.suite, 'function');
});

ste.run();

// ---

const test = suite('test');

test('should be a function', () => {
	assert.type(uvu.test, 'function');
});

test.run();

// ---

const exec = suite('exec');

exec('should be a function', () => {
	assert.type(uvu.exec, 'function');
});

exec.run();

// ---

const hooks = suite('hooks');

const hooks_state = {
	before: 0,
	after: 0,
	each: 0,
};

hooks.before(() => {
	assert.is(hooks_state.before, 0);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 0);
	hooks_state.before++;
});

hooks.after(() => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 0);
	hooks_state.after++;
});

hooks.before.each(() => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 0);
	hooks_state.each++;
});

hooks.after.each(() => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 1);
	hooks_state.each--;
});

hooks('test #1', () => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 1);
});

hooks('test #2', () => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 0);
	assert.is(hooks_state.each, 1);
});

hooks.run();

hooks('ensure after() ran', () => {
	assert.is(hooks_state.before, 1);
	assert.is(hooks_state.after, 1);
	assert.is(hooks_state.each, 0);
});

hooks.run();
