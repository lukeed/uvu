import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const groups = suite('suite.group()');

groups.group('sub1', {}, sub1 => {
	sub1('test1', () => {
		assert.ok('i should run');
	});
	sub1.group('doubleSub1', {}, doubleSub1 => {
		doubleSub1('test2', () => {
			assert.ok('i should run too');
		});
	});
});

groups.group('sub2', {}, sub2 => {
	sub2('test3', () => {
		assert.ok('i should run too');
	});
});

// ---

const skips = suite('suite.group.skip()');

const skips_state = {
	each: 0,
};

skips.group('sub1', {}, sub1 => {
	sub1.skip('skip1', () => {
		assert.unreachable('i should not run');
	});
	sub1.group.skip('doubleSub1', {}, doubleSub1 => {
		doubleSub1('skip2', () => {
			assert.unreachable('parent group is skipped, i should not run');
		});
		doubleSub1.group('tripleSub1', {}, tripleSub1 => {
			tripleSub1('skip3', () => {
				assert.unreachable('i should not run even though parent is not explicitly skipped');
			});
		});
	});
	sub1('reach1', () => {
		assert.ok('i should run');
	});
});

skips.run();

// ---

const only = suite('suite.group.only()');

only.group('sub1', {}, sub1 => {
	sub1('test1', () => {
		assert.unreachable('i should not run');
	});
	sub1.group('doubleSub1', {}, doubleSub1 => {
		doubleSub1('test2', () => {
			assert.unreachable('i should not run');
		});
	});
});

only.group.skip('sub2', {}, sub2 => {
	sub2('test3', () => {
		assert.unreachable('i should not run');
	});
});

only.group.only('sub3', {}, sub3 => {
	sub3('test4', () => {
		assert.ok('i should run');
	});
	sub3.group('doubleSub2', {}, doubleSub2 => {
		doubleSub2('test5', () => {
			assert.ok('i should run');
		});
	});
});

only.group.only('sub4', {}, sub4 => {
	sub4('test6', () => {
		assert.ok('i should run');
	});
});

only.run();

// ---

const context1Root = suite('context #1');

context1Root.group('context1', {}, context1 => {
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
});

context1Root.run();

// ---

const context2Root = suite('context #2');

context2Root.group('context2', {
	before: 0,
	after: 0,
	each: 0,
}, context2 => {
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
});

context2Root.run();

// ---

const input = {
	a: 1,
	b: [2, 3, 4],
	c: { foo: 5 },
	set: new Set([1, 2]),
	date: new Date(),
	map: new Map,
};

const context3Root = suite('context #3');

context3Root.group('context3', input, context3 => {
	context3('should access keys', ctx => {
		assert.is(ctx.a, input.a);
		assert.equal(ctx.b, input.b);
		assert.equal(ctx.c, input.c);
	});

	context3('should allow context modifications', ctx => {
		ctx.a++;
		assert.is(ctx.a, 2, 'ctx modified');
		assert.is(input.a, 2, 'input modified');

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
});

context3Root.run();

// ---

const breadcrumbsRoot = suite('breadcrumbs');

breadcrumbsRoot.group('breadcrumbs', {count: 1}, breadcrumbs => {
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
});


breadcrumbsRoot.run();
