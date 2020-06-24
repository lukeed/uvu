#!/usr/bin/env node
const sade = require('sade');
const parse = require('./parse');
const pkg = require('./package');

sade('uvu [dir] [pattern]')
	.version(pkg.version)
	.option('-b, --bail', 'fail fast')
	.option('-i, --ignore', 'Any file patterns to ignore')
	.option('-r, --require', 'Additional module(s) to preload')
	.option('-C, --cwd', 'The current directory to resolve from', '.')
	.option('-c, --color', 'Print colorized output', true)
	.action(async (dir, pattern, opts) => {
		if (opts.color) process.env.FORCE_COLOR = '1';
		let { suites } = await parse(dir, pattern, opts);
		let { exec, QUEUE } = require('.');

		// TODO: mjs vs js file
		globalThis.UVU_DEFER = 1;
		suites.forEach((x, idx) => {
			globalThis.UVU_INDEX = idx;
			QUEUE.push([x.name]);
			require(x.file); // auto-add to queue
		});

		await exec(opts.bail);
	})
	.parse(process.argv);
