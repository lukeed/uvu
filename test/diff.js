import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/diff';

function strip(stdout) {
	return stdout.replace(/[\u001B\u009B][[\]()#;?]*(?:(?:(?:[a-zA-Z\d]*(?:;[-a-zA-Z\d\/#&.:=?%@~_]*)*)?\u0007)|(?:(?:\d{1,4}(?:;\d{0,4})*)?[\dA-PR-TZcf-ntqry=><~]))/g, '');
}

const arrays = suite('arrays');

arrays('should be a function', () => {
	assert.type($.arrays, 'function');
});

arrays.run();

// ---

const lines = suite('lines');

lines('should be a function', () => {
	assert.type($.lines, 'function');
});

lines.run();

// ---

const chars = suite('chars');

chars('should be a function', () => {
	assert.type($.chars, 'function');
});

chars.run();

// ---

const direct = suite('direct');

direct('should be a function', () => {
	assert.type($.direct, 'function');
});

direct.run();

// ---

const compare = suite('compare');

compare('should be a function', () => {
	assert.type($.compare, 'function');
});

compare.run();
