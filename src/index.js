import kleur from 'kleur';
import { compare } from 'uvu/diff';

let isCLI = false, isNode = false;
let hrtime = (now = Date.now()) => () => (Date.now() - now).toFixed(2) + 'ms';
let write = console.log;

const into = (ctx, key) => (name, handler) => ctx[key].push({ name, handler });
const context = (state) => ({ tests:[], before:[], after:[], bEach:[], aEach:[], only:[], skips:0, groups:[], state });
const milli = arr => (arr[0]*1e3 + arr[1]/1e6).toFixed(2) + 'ms';
const hook = (ctx, key) => handler => ctx[key].push(handler);

if (isNode = typeof process < 'u' && typeof process.stdout < 'u') {
	// globalThis polyfill; Node < 12
	if (typeof globalThis !== 'object') {
		Object.defineProperty(global, 'globalThis', {
			get: function () { return this }
		});
	}

	let rgx = /(\.bin[\\+\/]uvu$|uvu[\\+\/]bin\.js)/i;
	isCLI = process.argv.some(x => rgx.test(x));

	// attach node-specific utils
	write = x => process.stdout.write(x);
	hrtime = (now = process.hrtime()) => () => milli(process.hrtime(now));
} else if (typeof performance < 'u') {
	hrtime = (now = performance.now()) => () => (performance.now() - now).toFixed(2) + 'ms';
}

globalThis.UVU_QUEUE = globalThis.UVU_QUEUE || [];
isCLI || UVU_QUEUE.push([null]);

const QUOTE = kleur.dim('"'), GUTTER = '\n        ';
const FAIL = kleur.red('✘ '), PASS = kleur.gray('• ');
const IGNORE = /^\s*at.*(?:\(|\s)(?:node|(internal\/[\w/]*))/;
const FAILURE = kleur.bold().bgRed(' FAIL ');
const FILE = kleur.bold().underline().white;
const SUITE = kleur.bgWhite().bold;

function stack(stack, idx, padding) {
	let i=0, line, out='';
	let arr = stack.substring(idx).replace(/\\/g, '/').split('\n');
	for (; i < arr.length; i++) {
		line = arr[i].trim();
		if (line.length && !IGNORE.test(line)) {
			out += '\n    ' + padding + line;
		}
	}
	return kleur.grey(out) + '\n';
}

function format(name, err, padding, suite = '') {
	let { details, operator='' } = err;
	let idx = err.stack && err.stack.indexOf('\n');
	if (err.name.startsWith('AssertionError') && !operator.includes('not')) details = compare(err.actual, err.expected); // TODO?
	let str = padding + '  ' + FAILURE + (suite ? kleur.red(SUITE(` ${suite} `)) : '') + ' ' + QUOTE + kleur.red().bold(name) + QUOTE;
	str += '\n    ' + padding + err.message + (operator ? kleur.italic().dim(`  (${operator})`) : '') + '\n';
	if (details) str += GUTTER + padding + details.split('\n').join(GUTTER + padding);
	if (!!~idx) str += stack(err.stack, idx, padding);
	return str + '\n';
}

async function runner(ctx, name) {
	let { only, tests, before, after, bEach, aEach, state, groups} = ctx;
	let hook, test, arr = only.length ? only : tests;
	let num=0, errors='', total=arr.length;
	let padding = '';
	const pad = '  ';
	for (let i = 0; i < state.__depth__; ++i) padding += pad;
	if (state.__skipped__) {
		arr = [];
		total = 0;
		ctx.skips = tests.length;
	}

	try {
		if (name) write(padding + SUITE(kleur.black(` ${name} `)) + ' ');
		for (hook of before) await hook(state);

		for (test of arr) {
			state.__test__ = test.name;
			try {
				for (hook of bEach) await hook(state);
				await test.handler(state);
				for (hook of aEach) await hook(state);
				write(PASS);
				num++;
			} catch (err) {
				for (hook of aEach) await hook(state);
				if (errors.length) errors += '\n';
				errors += format(test.name, err, padding, name);
				write(FAIL);
			}
		}
	} finally {
		state.__test__ = '';
		for (hook of after) await hook(state);
		let msg = `  (${num} / ${total})\n`;
		let skipped = (only.length ? tests.length : 0) + ctx.skips;
		write(errors.length ? kleur.red(msg) : kleur.green(msg));
		return [errors || true, num, skipped, total];
	}
}

function setup(ctx, name = '') {
	ctx.state.__test__ = '';
	ctx.state.__suite__ = name;
	if (!ctx.state.__depth__) ctx.state.__depth__ = 0;
	const test = into(ctx, 'tests');
	test.before = hook(ctx, 'before');
	test.before.each = hook(ctx, 'bEach');
	test.after = hook(ctx, 'after');
	test.after.each = hook(ctx, 'aEach');
	test.only = into(ctx, 'only');
	test.skip = () => { ctx.skips++ };
	test.run = () => {
		let copy = { ...ctx };
		let run = runner.bind(0, copy, name);
		Object.assign(ctx, context(copy.state));
		UVU_QUEUE[globalThis.UVU_INDEX || 0].push(run);
		for (const group of copy.groups) {
			group.run();
		}
	};
	test.group = (name, state, handler) => {
		const ns = setup(context({...state, __depth__: ctx.state.__depth__ + 1, __skipped__: ctx.state.__skipped__}), name);
		handler(ns);
		ctx.groups.push(ns);
	};
	test.group.skip = (name, _, handler) => {
		const ns = setup(context({__skipped__: true, __depth__: ctx.state.__depth__ + 1}), name);
		handler(ns);
		ctx.groups.push(ns);
	};
	return test;
}

export const suite = (name = '', state = {}) => setup(context(state), name);
export const test = suite();

export async function exec(bail) {
	let timer = hrtime();
	let done=0, total=0, skips=0, code=0;

	for (let group of UVU_QUEUE) {
		if (total) write('\n');

		let name = group.shift();
		if (name != null) write(FILE(name) + '\n');

		for (let test of group) {
			let [errs, ran, skip, max] = await test();
			total += max; done += ran; skips += skip;
			if (errs.length) {
				write('\n' + errs + '\n'); code=1;
				if (bail) return isNode && process.exit(1);
			}
		}
	}

	write('\n  Total:     ' + total);
	write((code ? kleur.red : kleur.green)('\n  Passed:    ' + done));
	write('\n  Skipped:   ' + (skips ? kleur.yellow(skips) : skips));
	write('\n  Duration:  ' + timer() + '\n\n');

	if (isNode) process.exitCode = code;
}

isCLI || Promise.resolve().then(exec);
