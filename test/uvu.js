import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as uvu from '../src/index';
import { spawnSync } from 'child_process';
import { join } from 'path';

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

exec('should report thrown non-Error values as failures', () => {
	const fixture = join(__dirname, '..', 'fixtures', 'throws-non-error.js');
	const result = spawnSync(process.execPath, [...process.execArgv, fixture], {
		encoding: 'utf8',
		env: { ...process.env, FORCE_COLOR: '0' }
	});

	assert.is(result.status, 1);
	assert.is(result.stderr, '');
	assert.ok(result.stdout.includes('"throws string"\n    reason'));
	assert.ok(result.stdout.includes('"throws number"\n    42'));
	assert.ok(result.stdout.includes('"rejects with string"\n    async reason'));
	assert.ok(result.stdout.includes('"throws plain object"\n    plain object'));
	assert.ok(result.stdout.includes('Passed:    1'));
});

exec.run();
