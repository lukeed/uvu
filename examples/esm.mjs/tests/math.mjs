import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as math from '../src/math.mjs';

const sum = suite('sum');

sum('should be a function', () => {
	assert.type(math.sum, 'function');
});

sum('should compute values', () => {
	assert.is(math.sum(1, 2), 3);
	assert.is(math.sum(-1, -2), -3);
	assert.is(math.sum(-1, 1), 0);
});

sum.run();

// ---

const div = suite('div');

div('should be a function', () => {
	assert.type(math.div, 'function');
});

div('should compute values', () => {
	assert.is(math.div(1, 2), 0.5);
	assert.is(math.div(-1, -2), 0.5);
	assert.is(math.div(-1, 1), -1);
});

div.run();

// ---

const mod = suite('mod');

mod('should be a function', () => {
	assert.type(math.mod, 'function');
});

mod('should compute values', () => {
	assert.is(math.mod(1, 2), 1);
	assert.is(math.mod(-3, -2), -1);
	assert.is(math.mod(7, 4), 3);
});

mod.run();
