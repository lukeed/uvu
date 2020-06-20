import kleur from 'kleur';
import { compare } from 'uvu/diff';

let isCLI = false, isNode = false;
let hrtime = (now = Date.now()) => () => (Date.now() - now).toFixed(2) + 'ms';
let write = console.log;

const into = (ctx, key) => (name, handler) => ctx[key].push({ name, handler });
const context = () => ({ tests:[], before:[], after:[], only:[] });
const milli = arr => (arr[0]*1e3 + arr[1]/1e6).toFixed(2) + 'ms';
const hook = (ctx, key) => handler => ctx[key].push(handler);

if (isNode = typeof process !== 'undefined') {
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
}

const QUOTE = kleur.dim('"'), GUTTER = '\n        ';
const FAIL = kleur.red('✘ '), PASS = kleur.gray('• ');
const IGNORE = /^\s*at.*(?:\(|\s)(?:node|(internal\/[\w/]*))/;
const FAILURE = kleur.bold().bgRed(' FAIL ');
const FILE = kleur.bold().underline().white;
const SUITE = kleur.bgWhite().bold;

function stack(stack, idx) {
	let i=0, line, out='';
	let arr = stack.substring(idx).replace(/\\/g, '/').split('\n');
	for (; i < arr.length; i++) {
		line = arr[i].trim();
		if (line.length && !IGNORE.test(line)) {
			out += '\n    ' + line;
		}
	}
	return kleur.grey(out) + '\n';
}

function format(name, err, suite = '') {
	let details = err.details;
	let idx = err.stack && err.stack.indexOf('\n');
	if (err.name.startsWith('AssertionError') && !err.operator.includes('not')) details = compare(err.actual, err.expected); // TODO?
	let str = '  ' + FAILURE + (suite ? kleur.red(SUITE(` ${suite} `)) : '') + ' ' + QUOTE + kleur.red().bold(name) + QUOTE;
	str += '\n    ' + err.message + kleur.italic().dim(`  (${err.operator})`) + '\n';
	if (details) str += GUTTER + details.split('\n').join(GUTTER);
	if (!!~idx) str += stack(err.stack, idx);
	return str + '\n';
}

// TODO: before|afterEach
async function runner(ctx, name) {
	let { only, tests, before, after } = ctx;
	let arr = only.length ? only : tests;
	let num=0, total=arr.length;
	let test, hook, errors='';
	try {
		if (name) write(SUITE(kleur.black(` ${name} `)) + ' ');
		for (hook of before) await hook();
		for (test of arr) {
			try {
				await test.handler();
				write(PASS);
				num++;
			} catch (err) {
				if (errors.length) errors += '\n';
				errors += format(test.name, err, name);
				write(FAIL);
			}
		}
	} finally {
		for (hook of after) await hook();
		let msg = `  (${num} / ${total})\n`;
		write(errors.length ? kleur.red(msg) : kleur.green(msg));
		return [errors || true, num, total];
	}
}

function setup(ctx, name = '') {
	const test = into(ctx, 'tests');
	test.before = hook(ctx, 'before');
	test.after = hook(ctx, 'after');
	test.only = into(ctx, 'only');
	test.skip = () => {};
	test.run = () => {
		let copy = { ...ctx };
		Object.assign(ctx, context());
		let run = runner.bind(0, copy, name);
		QUEUE[globalThis.UVU_INDEX || 0].push(run);
	};
	return test;
}

export const QUEUE = [];
isCLI || QUEUE.push([null]);

export const suite = (name = '') => setup(context(), name);
export const test = suite();

export async function exec(bail) {
	let timer = hrtime();
	let done=0, total=0, code=0;

	for (let group of QUEUE) {
		if (total) write('\n');

		let name = group.shift();
		if (name != null) write(FILE(name) + '\n');

		for (let test of group) {
			let [errs, ran, max] = await test();
			total += max; done += ran;
			if (errs.length) {
				write('\n' + errs + '\n'); code=1;
				if (bail) return isNode && process.exit(1);
			}
		}
	}

	write('\n  Total:     ' + total);
	let color = code ? kleur.red : kleur.green;
	write(color('\n  Passed:    ' + done));
	write('\n  Skipped:   ' + '0'); // TODO
	write('\n  Duration:  ' + timer() + '\n\n');

	if (isCLI) process.exit(code);
}

isCLI || Promise.resolve().then(exec);
