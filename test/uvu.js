import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as uvu from '../src/index';

const QUEUE = suite('QUEUE');

QUEUE('should be an Array', () => {
	assert.instance(uvu.QUEUE, Array);
});

QUEUE.run();

// ---

const ste = suite('suite');

ste('should be a function', () => {
	assert.type(uvu.suite, 'function');
});

ste.run();

// ---

const test = suite('test');

test('should be a function', () => {
	assert.type(uvu.test, 'function');
});

test.run();

// ---

const exec = suite('exec');

exec('should be a function', () => {
	assert.type(uvu.exec, 'function');
});

exec.run();

// ---

let beforeCalls = 0;
let afterCalls = 0;
let beforeEachCalls = 0;
let afterEachCalls = 0;

const hooks = suite('hooks');

hooks.before(() => {
  beforeCalls++;
});

hooks.after(() => {
  afterCalls++;
});

hooks.beforeEach(() => {
  beforeEachCalls++;
});

hooks.afterEach(() => {
  afterEachCalls++;
});

hooks('case 1', () => {});

hooks('case 2', () => {});

hooks.run();

hooks('should call hooks', () => {
	assert.is(beforeCalls, 1);
	assert.is(afterCalls, 1);
	assert.is(beforeEachCalls, 2);
	assert.is(afterEachCalls, 2);
});

hooks.run();

