#!/usr/bin/env node
const sade = require('sade');
const parse = require('./parse');
const { exec, QUEUE } = require('.');
const pkg = require('./package');

sade('uvu [dir] [pattern]')
	.version(pkg.version)
	.option('-b, --bail', 'fail fast')
	.option('-i, --ignore', 'Any file patterns to ignore')
	.option('-r, --require', 'Additional module(s) to preload')
	.option('-C, --cwd', 'The current directory to resolve from', '.')
	.action(async (dir, pattern, opts) => {
		let { suites } = await parse(dir, pattern, opts);

		globalThis.UVU_DEFER = 1;
		suites.forEach((x, idx) => {
			globalThis.UVU_INDEX = idx;
			QUEUE.push([x.name]);
			require(x.file); // auto-add to queue
		});

		await exec(opts.bail);
	})
	.parse(process.argv);
