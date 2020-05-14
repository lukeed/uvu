#!/usr/bin/env node
const sade = require('sade');
const tlist = require('totalist');
const { resolve } = require('path');
const pkg = require('./package');
const { QUEUE } = require('.');

const toRegex = x => new RegExp(x, 'i');

function exists(dep) {
	try {
		return require.resolve(dep);
	} catch (err) {
		return false;
	}
}

sade('uvu [dir] [pattern]')
	.version(pkg.version)
	.option('-b, --bail', 'fail fast')
	.option('-i, --ignore', 'Any file patterns to ignore')
	.option('-r, --require', 'Additional module(s) to preload')
	.option('-C, --cwd', 'The current directory to resolve from', '.')
	.action(async (dir, pattern, opts) => {
		let suites = [];
		if (pattern) pattern = toRegex(pattern);
		else if (dir) pattern = /(((?:[^\/]*(?:\/|$))*)[\\\/])?\w+\.([mc]js|[jt]sx?)$/;
		else pattern = /((\/|^)(tests?|__tests?__)\/.*|\.(tests?|spec)|^\/?tests?)\.([mc]js|[jt]sx?)$/i;
		dir = resolve(opts.cwd, dir || '.');

		let ignores = [].concat(opts.ignore || []).map(toRegex);

		[].concat(opts.require || []).filter(Boolean).forEach((name, tmp) => {
			if (tmp = exists(name)) return require(tmp);
			throw new Error(`Cannot find module '${name}'`);
		});

		await tlist(dir, (rel, abs) => {
			if (pattern.test(rel) && !ignores.some(x => x.test(rel))) {
				suites.push({ name: rel, file: abs });
			}
		});

		suites.sort((a, b) => a.name.localeCompare(b.name));

		global.UVU_DEFER = 1;
		suites.forEach((x, idx) => {
			global.UVU_INDEX = idx;
			QUEUE.push([x.name]);
			require(x.file); // auto-add to queue
		});

		let done=0, total=0, code=0;
		for (let group of QUEUE) {
			console.log(group.shift());
			for (let test of group) {
				let [errs, ran, max] = await test();
				total += max; done += ran;
				if (errs.length && opts.bail) process.exit(1);
				else if (errs.length) code = 1;
			}
		}

		console.log('completed %d of %d tests', done, total);
		process.exit(code);
	})
	.parse(process.argv);
