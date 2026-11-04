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

exec('should report thrown null and undefined as failures', () => {
	const fixture = join(__dirname, '..', 'fixtures', 'throws.js');
	const result = spawnSync(process.execPath, [...process.execArgv, fixture], {
		encoding: 'utf8',
		env: { ...process.env, FORCE_COLOR: '0' }
	});

	assert.is(result.status, 1);
	assert.is(result.stderr, '');
	assert.ok(result.stdout.includes('"throws null"\n    null'));
	assert.ok(result.stdout.includes('"throws undefined"\n    undefined'));
	assert.ok(result.stdout.includes('Passed:    1'));
});

exec.run();
