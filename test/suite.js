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

// ---

const context1 = suite('context #1');

context1.before(ctx => {
	assert.is(ctx.before, undefined);
	assert.is(ctx.after, undefined);
	assert.is(ctx.each, undefined);

	Object.assign(ctx, {
		before: 1,
		after: 0,
		each: 0,
	});
});

context1.after(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 0);
	ctx.after++;
});

context1.before.each(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 0);
	ctx.each++;
});

context1.after.each(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
	ctx.each--;
});

context1('test #1', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
});

context1('test #2', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
});

context1.run();

context1('ensure after() ran', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 1);
	assert.is(ctx.each, 0);
});

context1.run();

// ---

const context2 = suite('context #2', {
	before: 0,
	after: 0,
	each: 0,
});

context2.before(ctx => {
	assert.is(ctx.before, 0);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 0);
	ctx.before++;
});

context2.after(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 0);
	ctx.after++;
});

context2.before.each(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 0);
	ctx.each++;
});

context2.after.each(ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
	ctx.each--;
});

context2('test #1', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
});

context2('test #2', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 0);
	assert.is(ctx.each, 1);
});

context2.run();

context2('ensure after() ran', ctx => {
	assert.is(ctx.before, 1);
	assert.is(ctx.after, 1);
	assert.is(ctx.each, 0);
});

context2.run();
