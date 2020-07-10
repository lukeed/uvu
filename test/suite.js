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
