import { suite } from 'uvu';
import * as assert from 'uvu/assert';

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

// ---

const skips = suite('suite.skip()');

const skips_state = {
	each: 0,
};

skips.before.each(() => {
	skips_state.each++;
});

skips('normal #1', () => {
	assert.ok('i should run');
	assert.is(skips_state.each, 1);
});

skips.skip('literal', () => {
	assert.unreachable('i should not run');
});

skips('normal #2', () => {
	assert.ok('but i should');
	assert.is(skips_state.each, 2, 'did not run hook for skipped function');
});

skips.run();

// ---

const only = suite('suite.only()');

const only_state = {
	each: 0,
};

only.before.each(() => {
	only_state.each++;
});

only('normal', () => {
	assert.unreachable('i should not run');
});

only.skip('modifier: skip', () => {
	assert.unreachable('i should not run');
});

only.only('modifier: only #1', () => {
	assert.ok('i should run');
	assert.is(only_state.each, 1, 'did not run normal or skipped tests');
});

only.only('modifier: only #2', () => {
	assert.ok('i should also run');
	assert.is(only_state.each, 2, 'did not run normal or skipped tests');
});

only.run();
