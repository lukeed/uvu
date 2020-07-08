const { suite } = require('uvu');
const assert = require('uvu/assert');
const utils = require('../src/utils');

const capitalize = suite('capitalize');

capitalize('should be a function', () => {
	assert.type(utils.capitalize, 'function');
});

capitalize('should capitalize a word', () => {
	assert.is(utils.capitalize('hello'), 'Hello');
});

capitalize('should only capitalize the 1st word', () => {
	assert.is(utils.capitalize('foo bar'), 'Foo bar');
});

capitalize.run();

// ---

const dashify = suite('dashify');

dashify('should be a function', () => {
	assert.type(utils.dashify, 'function');
});

dashify('should replace camelCase with dash-case', () => {
	assert.is(utils.dashify('fooBar'), 'foo-bar');
	assert.is(utils.dashify('FooBar'), 'foo-bar');
});

dashify('should enforce lowercase', () => {
	assert.is(utils.dashify('foobar'), 'foobar');
});

dashify.run();
