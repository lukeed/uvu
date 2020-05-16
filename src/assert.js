import kleur from 'kleur';
import dequal from 'dequal';

const TAB = kleur.dim(' → ');
const SPACE = kleur.dim(' · ');

const fmt = str => str.replace(/[ ]/g, SPACE).replace(/\t/g, TAB);
const label = (arr, str, len, hint, color) => arr.push(color(fmt(str) + ' '.repeat(4 + len) + kleur.dim().italic(hint)));
const line = (arr, str, color) => arr.push(color(fmt(str)));

function maxlen(str) {
	let arr = str.match(/\s/g) || [];
	return str.length + (arr.length * 3 - arr.length);
}

function diff(input, expects, count = 3) {
	let arr_input = input.split(/\r?\n/g);
	let arr_expects = expects.split(/\r?\n/g);
	let real, tmp, rlen, tlen, mlen;
	let i=0, j=0, output=[];

	for (; i < arr_expects.length; i++) {
		tmp = arr_input[i] || '';
		if (arr_expects[i] === tmp) continue;

		// for (j=count; j > 0; j--) {
		// 	if (i - j < 0) continue;
		// 	line(output, arr_input[i - j], kleur.grey);
		// }

		rlen = maxlen(real = arr_expects[i]);
		mlen = Math.max(rlen, tlen = maxlen(tmp));

		label(output, real, mlen - rlen, '(Expected)', kleur.green);
		label(output, tmp, mlen - tlen, '(Actual)', kleur.red);

		// for (j=0; j++ < count;) {
		// 	if (i + j >= arr_input.length) continue;
		// 	line(output, arr_input[i + j], kleur.grey);
		// }

		// break;
	}

	return output.join('\n');
}

function print(str, ...args) {
	let i=0, msg=str[i];
	while (i < args.length) {
		msg += '`' + JSON.stringify(args[i]) + '`' + str[++i];
	}
	return new Assertion(msg, ...args);
}

function dedent(str) {
	let arr = str.match(/^[\s\t]*(?=\S)/gm);
	let min = !!arr && Math.min(...arr.map(x => x.length));
	return (!arr || !min) ? str : str.replace(new RegExp(`^[\\s\\t]{${min}}`, 'gm'), '');
}

// https://nodejs.org/api/assert.html#assert_class_assert_assertionerror
export class Assertion extends Error {
	constructor(message, actual, expect) {
		let msg = message;
		if (expect && typeof expect == 'object') {
			actual = dedent(JSON.stringify(actual, null, 2));
			expect = dedent(JSON.stringify(expect, null, 2));
		}
		if (expect && actual && /[\r\n]/.test(''+expect)) {
			msg += ':\n    ' + diff(actual, expect).replace(/\n/g, '\n    ');
		}
		super(msg);
	}
}

export function ok(val, msg) {
	if (!val) throw (msg instanceof Error ? msg : new Assertion(msg));
}

export function is(val, exp, msg) {
	ok(val === exp, msg || print`Expected ${val} to equal ${exp}`);
}

export function equal(val, exp, msg) {
	ok(dequal(val, exp), msg || print`Expected ${val} to deeply equal ${exp}`);
}

export function type(val, exp, msg) {
	ok(typeof val === exp, msg || print`Expected typeof(${val}) to be ${exp}`);
}

export function instance(val, exp, msg) {
	ok(val instanceof exp, msg || print`Expected ${val} to be an instance of ${exp}`);
}

export function snapshot(val, exp, msg) {
	val = dedent(val); exp = dedent(exp);
	ok(val === exp, msg || new Assertion('Expected input to match expected snapshot:', val, exp));
}

export function throws(blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
		return ok(false, msg || print`Expected function to throw`);
	} catch (err) {
		if (typeof exp === 'function') {
			return ok(exp(err), msg || print`Expected function to throw matching exception`);
		} else if (exp instanceof RegExp) {
			return ok(exp.test(err.message), msg || print`Expected function to throw exception matching ${exp}`);
		}
	}
}

// ---

export function not(val, msg) {
	if (val) throw (msg instanceof Error ? msg : new Assertion(msg));
}

not.ok = not;

is.not = function (val, exp, msg) {
	ok(val !== exp, msg || print`Expected ${val} not to equal ${exp}`);
}

not.equal = function (val, exp, msg) {
	not(dequal(val, exp), msg || print`Expected ${val} not to deeply equal ${exp}`);
}

not.type = function (val, exp, msg) {
	ok(typeof val !== exp, msg || print`Expected typeof(${val}) not to be ${exp}`);
}

not.instance = function (val, exp, msg) {
	not(val instanceof exp, msg || print`Expected ${val} not to be an instance of ${exp}`);
}

not.snapshot = function (val, exp, msg) {
	ok(dedent(val) !== dedent(exp), msg || print`Expected input not to match expected snapshot`);
}

not.throws = function (blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
	} catch (err) {
		if (typeof exp === 'function') {
			return not(exp(err), msg || print`Expected function not to throw matching exception`);
		} else if (exp instanceof RegExp) {
			return not(exp.test(err.message), msg || print`Expected function not to throw exception matching ${exp}`);
		} else if (!exp) {
			return ok(false, msg || print`Expected function not to throw`);
		}
	}
}
