import kleur from 'kleur';
import { compare } from '../diff';

const into = (ctx, key) => (name, handler) => ctx[key].push({ name, handler });
const context = () => ({ tests:[], before:[], after:[], only:[] });
const hook = (ctx, key) => handler => ctx[key].push(handler);
const write = x => process.stdout.write(x);

const QUOTE = kleur.dim('"'), GUTTER = '\n        ';
const FAIL = kleur.red('✘ '), PASS = kleur.gray('• ');
const IGNORE = /^\s*at.*(?:\(|\s)(?:node|(internal\/[\w/]*))/;
const FAILURE = kleur.bold().bgRed(' FAIL ');
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
// TODO: nested suite group(s)
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
		if (global.UVU_DEFER) {
			let copy = { ...ctx };
			Object.assign(ctx, context());
			let run = runner.bind(0, copy, name);
			QUEUE[global.UVU_INDEX].push(run);
		} else {
			return runner(ctx, name).then(([errs, ran, total]) => {
				if (errs.length) write('\n' + errs);
				if (typeof process !== 'undefined') process.exit(+!!errs.length);
				return [errs, ran, total];
			});
		}
	};
	return test;
}

export const QUEUE = [];
export const suite = (name = '') => setup(context(), name);
export const test = suite();
