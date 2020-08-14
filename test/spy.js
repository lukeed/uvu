import * as assert from "uvu/assert";
import { suite } from "uvu";
import { spy } from "uvu/spy"

const spies = suite('spies')

spies('should call original function', () => {
	const fn = spy((a, b) => a + b);
	assert.is(fn(1, 2), 3);
	assert.equal(fn.calls, [{ args: [1, 2], return: 3 }]);

	fn(3, 4);
	assert.is(fn.calls.length, 2);
	assert.equal(fn.calls[0], { args: [1, 2], return: 3 });
	assert.equal(fn.calls[1], { args: [3, 4], return: 7 });
});

spies('should forward "this" value', () => {
	const fn = spy(function foo() {
		return this;
	});
	assert.is(fn.call("foo"), "foo");
});

spies('should work with Promises', async () => {
	const fn = spy(async x => Promise.resolve().then(() => x));
	const res = await fn('foo');

	assert.is(res, 'foo');
	assert.equal(fn.calls, [{ args: ['foo'], return: 'foo'}]);
});

spies.run()
