import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as utils from '../src/utils.js';

test('capitalize', () => {
	assert.type(utils.capitalize, 'function');
	assert.is(utils.capitalize('hello'), 'Hello');
	assert.is(utils.capitalize('foo bar'), 'Foo bar');
});

test('dashify', () => {
	assert.type(utils.dashify, 'function');
	assert.is(utils.dashify('fooBar'), 'foo-bar');
	assert.is(utils.dashify('FooBar'), 'foo-bar');
	assert.is(utils.dashify('foobar'), 'foobar');
});

test.run();
