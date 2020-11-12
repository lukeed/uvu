#!/usr/bin/env node
const sade = require('sade');
const parse = require('./parse');
const pkg = require('./package');

const dimport = x => new Function(`return import(${ JSON.stringify(x) })`).call(0);

const hasImport = (() => {
	try { new Function('import').call(0) }
	catch (err) { return !/unexpected/i.test(err.message) }
})();

sade('uvu [dir] [pattern]')
	.version(pkg.version)
	.option('-b, --bail', 'Exit on first failure')
	.option('-i, --ignore', 'Any file patterns to ignore')
	.option('-r, --require', 'Additional module(s) to preload')
	.option('-C, --cwd', 'The current directory to resolve from', '.')
	.option('-c, --color', 'Print colorized output', true)
	.action(async (dir, pattern, opts) => {
		try {
			if (opts.color) process.env.FORCE_COLOR = '1';
			let { suites } = await parse(dir, pattern, opts);
			let { exec, QUEUE } = require('.');

			if (hasImport) {
				await dimport('uvu/run').then(m => m.default(suites, opts));
			} else {
				await require('uvu/run')(suites, opts);
			}
		} catch (err) {
			console.error(err.stack || err.message);
			process.exit(1);
		}
	})
	.parse(process.argv);
