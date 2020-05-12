import dequal from 'dequal';

function print(str, ...args) {
	let i=0, out=str[i];
	while (i < args.length) {
		out += '`' + JSON.stringify(args[i]) + '`' + str[++i];
	}
	return out;
}

function dedent(tmpl) {
	let str = tmpl.trim();
	let arr = str.match(/^[\s\t]*(?=\S)/gm);
	if (!arr) return str;
	let min = Math.min(...arr.map(x => x.length));
	return min > 0 ? str.replace(new RegExp(`^[\\s\\t]{${min}}`, 'gm'), '') : str;
}

// https://nodejs.org/api/assert.html#assert_class_assert_assertionerror
export class Assertion extends Error {
	//
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
	ok(dedent(val) === dedent(exp), msg || print`Expected input to match expected snapshot`);
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
