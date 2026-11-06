import { suite } from 'uvu';
import { readdirSync, mkdtempSync, mkdirSync, writeFileSync, unlinkSync, rmdirSync } from 'fs';
import { tmpdir } from 'os';
import { isAbsolute, join } from 'path';
import * as assert from 'uvu/assert';
import * as $ from '../parse';

const FILES = readdirSync(__dirname);

const parse = suite('parse');

parse('should be a function', () => {
	assert.type($.parse, 'function');
});

parse('should rely on defaults', async () => {
	// dirname to avoid node_modules
	let output = await $.parse(__dirname);

	assert.type(output, 'object');
	assert.is(output.dir, __dirname);
	assert.is(output.requires, false);

	assert.instance(output.suites, Array);
	assert.is(output.suites.length, FILES.length);

	output.suites.forEach(suite => {
		assert.is.not(isAbsolute(suite.name));
		assert.is(FILES.includes(suite.name), true, '~> suite.name is relative filename')
		assert.is(isAbsolute(suite.file), true, '~> suite.file is absolute path');
	});
});

parse.run();

// ---

const dir = suite('dir');

dir('should accept relative `dir` input', async () => {
	let output = await $.parse('test');

	assert.type(output, 'object');
	assert.is(output.dir, __dirname);
	assert.is(output.requires, false);

	assert.instance(output.suites, Array);
	assert.is(output.suites.length, FILES.length);

	output.suites.forEach(suite => {
		assert.is.not(isAbsolute(suite.name));
		assert.is(FILES.includes(suite.name), true, '~> suite.name is relative filename')
		assert.is(isAbsolute(suite.file), true, '~> suite.file is absolute path');
	});
});

dir.run();

// ---

const pattern = suite('pattern');

pattern('should only load tests matching pattern :: RegExp', async () => {
	let foo = await $.parse(__dirname, /assert/);
	assert.is(foo.suites[0].name, 'assert.js');
	assert.is(foo.suites.length, 1);

	let bar = await $.parse(__dirname, /^uvu\.js$/);
	assert.is(bar.suites[0].name, 'uvu.js');
	assert.is(bar.suites.length, 1);
});

pattern('should only load tests matching pattern :: string', async () => {
	let foo = await $.parse(__dirname, 'assert');
	assert.is(foo.suites[0].name, 'assert.js');
	assert.is(foo.suites.length, 1);

	let bar = await $.parse(__dirname, '^uvu\\.js$');
	assert.is(bar.suites[0].name, 'uvu.js');
	assert.is(bar.suites.length, 1);
});

pattern.run();

// ---

const cwd = suite('options.cwd');

cwd('should affect from where `dir` resolves', async () => {
	let foo = await $.parse('.', '', { cwd: __dirname });
	assert.is(foo.suites.length, FILES.length);
	foo.suites.forEach(suite => {
		assert.is(FILES.includes(suite.name), true, '~> suite.name is relative filename')
		assert.is(isAbsolute(suite.file), true, '~> suite.file is absolute path');
	});
});

cwd.run();

// ---

const ignore = suite('options.ignore');

ignore('should ignore test files matching :: RegExp', async () => {
	let foo = await $.parse(__dirname, '', { ignore: /assert/ });
	assert.is(foo.suites.find(x => x.name === 'assert.js'), undefined);
	assert.is(foo.suites.length, FILES.length - 1);

	let bar = await $.parse(__dirname, '', { ignore: /^uvu\.js$/ });
	assert.is(bar.suites.find(x => x.name === 'uvu.js'), undefined);
	assert.is(bar.suites.length, FILES.length - 1);
});

ignore('should ignore test files matching :: RegExp', async () => {
	let foo = await $.parse(__dirname, '', { ignore: 'assert' });
	assert.is(foo.suites.find(x => x.name === 'assert.js'), undefined);
	assert.is(foo.suites.length, FILES.length - 1);

	let bar = await $.parse(__dirname, '', { ignore: 'uvu.js' });
	assert.is(bar.suites.find(x => x.name === 'uvu.js'), undefined);
	assert.is(bar.suites.length, FILES.length - 1);
});

ignore.run();

// ---

const requires = suite('options.require');

requires('should throw on invalid value(s)', async () => {
	try {
		await $.parse(__dirname, '', { require: ['foobar'] });
		assert.unreachable('should have thrown');
	} catch (err) {
		assert.instance(err, Error);
		assert.match(err.message, `Cannot find module "foobar"`);
	}
});

requires('should `require` valid value(s)', async () => {
	let foo = await $.parse(__dirname, '', { require: ['esm'] });
	assert.is(foo.requires, true);
});

requires.run();

// ---

const declarations = suite('declaration files');

async function withDeclarationFixtures(run) {
	let root = mkdtempSync(join(tmpdir(), 'uvu-parse-'));
	let dir = join(root, 'tests');
	let files = ['global.d.ts', 'nested.test.d.ts', 'test.d.ts', 'actual.test.ts', 'declaration.d.js', 'real.test.js'];
	mkdirSync(dir);
	files.forEach(name => writeFileSync(join(dir, name), ''));
	try {
		await run(root, files);
	} finally {
		files.forEach(name => unlinkSync(join(dir, name)));
		rmdirSync(dir);
		rmdirSync(root);
	}
}

declarations('skips declarations during root discovery', async () => {
	await withDeclarationFixtures(async root => {
		let output = await $.parse(undefined, undefined, { cwd: root });
		assert.equal(output.suites.map(suite => suite.name), ['actual.test.ts', 'declaration.d.js', 'real.test.js'].map(name => join('tests', name)));
	});
});

declarations('skips declarations with an explicit directory', async () => {
	await withDeclarationFixtures(async root => {
		let output = await $.parse('tests', undefined, { cwd: root });
		assert.equal(output.suites.map(suite => suite.name), ['actual.test.ts', 'declaration.d.js', 'real.test.js']);
	});
});

declarations('preserves explicit declaration patterns', async () => {
	await withDeclarationFixtures(async root => {
		let output = await $.parse('tests', /\.d\.ts$/, { cwd: root });
		assert.equal(output.suites.map(suite => suite.name), ['global.d.ts', 'nested.test.d.ts', 'test.d.ts']);
	});
});

declarations.run();
