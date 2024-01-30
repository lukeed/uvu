import { suite, QUEUE } from 'uvu';
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

// ---

const input = {
	a: 1,
	b: [2, 3, 4],
	c: { foo: 5 },
	set: new Set([1, 2]),
	date: new Date(),
	map: new Map,
};

const context3 = suite('context #3', input);

context3('should access keys', ctx => {
	assert.is(ctx.a, input.a);
	assert.equal(ctx.b, input.b);
	assert.equal(ctx.c, input.c);
});

context3('should allow context modifications', ctx => {
	ctx.a++;
	assert.is(ctx.a, 2);
	assert.is(input.a, 2);

	ctx.b.push(999);
	assert.equal(ctx.b, [2, 3, 4, 999]);
	assert.equal(input.b, [2, 3, 4, 999]);

	ctx.c.foo++;
	assert.is(ctx.c.foo, 6);
	assert.is(input.c.foo, 6);

	ctx.c.bar = 6;
	assert.equal(ctx.c, { foo: 6, bar: 6 });
	assert.equal(input.c, { foo: 6, bar: 6 });
});

context3('should allow self-referencing instance(s) within context', ctx => {
	const { date, set, map } = ctx;

	assert.type(date.getTime(), 'number');
	assert.equal([...set.values()], [1, 2]);
	assert.equal([...map.entries()], []);
});

context3.run();

// ---

const breadcrumbs = suite('breadcrumbs', {
	count: 1,
});

breadcrumbs.before(ctx => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, '');
});

breadcrumbs.after(ctx => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, '');
});

breadcrumbs.before.each(ctx => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, `test #${ctx.count}`);
});

breadcrumbs.after.each(ctx => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, `test #${ctx.count++}`);
});

breadcrumbs('test #1', (ctx) => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, 'test #1');
});

breadcrumbs('test #2', (ctx) => {
	assert.is(ctx.__suite__, 'breadcrumbs');
	assert.is(ctx.__test__, 'test #2');
});

breadcrumbs.run();


const runner = suite('runner');

runner.before.each((ctx) => {
	const selfQueue = [];
	ctx.origPush = QUEUE[globalThis.UVU_INDEX || 0].push = cb => selfQueue.push(cb);
	ctx.run = () => {
		assert.is(selfQueue.length, 1);
		return selfQueue[0]();
	}
});

runner.after.each((ctx) => {
	QUEUE[globalThis.UVU_INDEX || 0].push = ctx.origPush;
})

runner('catch errors in a test', async ({run}) => {
	const inner = suite('inner');
	inner('foo', () => {
		throw new Error('test error');
	})
	inner.run();

	let [errs, ran, skip, max] = await run();
	assert.is(ran, 0);
	assert.is(skip, 0);
	assert.is(max, 1);
	assert.match(errs, /^\s*FAIL\s+inner\s*"foo"\s*\n\s*test error\s*\n.+/m);
})


runner('catch errors in "before" hook', async ({run}) => {
	const inner = suite('inner');
	inner.before(() => {
		throw new Error('before hook error');
	});
	inner('foo', () => {
	});
	inner.run();

	try {
		await run();
	} catch (err) {
		assert.match(err.message, /before hook error/);
	}
})

runner('catch errors in "before each" hook', async ({run}) => {
	const inner = suite('inner');
	inner.before.each(() => {
		throw new Error('before each hook error');
	});
	inner('foo', () => {
	});
	inner.run();

	let [errs, ran, skip, max] = await run();
	assert.is(ran, 0);
	assert.is(skip, 0);
	assert.is(max, 1);
	assert.match(errs, /^\s*FAIL\s+inner\s*"foo"\s*\n\s*before each hook error\s*\n.+/m);
})

runner('catch errors in "after" hook', async ({run}) => {
	const inner = suite('inner');
	inner.after(() => {
		throw new Error('after hook error');
	});
	inner('foo', () => {
	});
	inner.run();

	try {
		await run()
	} catch (err) {
		assert.match(err.message, /after hook error/)
	}
});

runner('catch errors in "after each" hook', async ({run}) => {
	const inner = suite('inner');
	let beforeAfterCalled = 0;
	inner.after.each(() => {
		assert.is(beforeAfterCalled, 0);
		throw new Error(`after each hook error ${++beforeAfterCalled}`);
	})
	inner('foo', () => {
	});
	inner.run();

	let [errs, ran, skip, max] = await run();
	assert.is(beforeAfterCalled, 1);

	assert.is(ran, 0);
	assert.is(skip, 0);
	assert.is(max, 1);
	assert.match(errs, /^\s*FAIL\s+inner\s+"foo"\s*\n\s*after each hook error 1\s*\n.+/m);
});

runner('call "after each" hook after failed test', async ({run}) => {
	const inner = suite('inner');
	let afterEachCalled = 0;
	inner.after.each(() => {
		afterEachCalled++;
		throw new Error('after each hook error');
	})
	inner('foo', () => {
		throw new Error('test error');
	})
	inner.run();

	let [errs, ran, skip, max] = await run();
	assert.is(afterEachCalled, 1);
	assert.is(ran, 0);
	assert.is(skip, 0);
	assert.is(max, 1);
	assert.match(errs, /^\s*FAIL\s+inner\s+"foo"\s*\n\s*test error\s*\n.+/m);
	assert.match(errs, /\s*FAIL\s+inner\s+"foo"\s*\n\s*after each hook error\s*\n.+/m);
});

runner('rethrow internal error', async ({run}) => {
	const inner = suite('inner');
	inner('foo', () => {
		throw {name: undefined};
	})
	inner.run();

	try {
		await run()
	} catch (err) {
		assert.is(err.message, 'Cannot read property \'startsWith\' of undefined')
	}
})

runner('handle non-error throw', async({run}) => {
	const inner = suite('inner');
	inner('foo', () => { throw 'hello'});
	inner.run();
	let [errs, ran, skip, max] = await run();
	assert.is(ran, 0);
	assert.is(skip, 0);
	assert.is(max, 1);
	assert.is(errs, '   FAIL  inner  "foo"\n    "hello"\n')
})


runner.run()
