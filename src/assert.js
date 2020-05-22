import dequal from 'dequal';
import { compare, direct, lines } from '../diff';

function print(str, ...args) {
	let i=0, tmp, msg=str[i];
	while (i < args.length) {
		if ((tmp = args[i]) instanceof Function) tmp = tmp.name;
		else if (tmp instanceof RegExp) tmp = String(tmp);
		else tmp = JSON.stringify(tmp);
		msg += '`' + tmp + '`' + str[++i];
	}
	return msg;
}

function dedent(str) {
	let arr = str.match(/^[ \t]*(?=\S)/gm);
	let min = !!arr && Math.min(...arr.map(x => x.length));
	return (!arr || !min) ? str : str.replace(new RegExp(`^[ \\t]{${min}}`, 'gm'), '');
}

export class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		Error.captureStackTrace(this, this.constructor);
		this.details = opts.details || false;
		this.generated = !!opts.generated;
		this.operator = opts.operator;
		this.expects = opts.expects;
		this.actual = opts.actual;
	}
}

function assert(bool, actual, expects, operator, detailer, backup, msg) {
	if (bool) return;
	let message = msg || backup;
	if (msg instanceof Error) throw msg;
	let details = detailer && detailer(actual, expects);
	throw new Assertion({ actual, expects, operator, message, details, generated: !!msg });
}

export function ok(val, msg) {
	assert(!!val, false, true, 'ok', false, print`Expected ${val} to be truthy`, msg);
}

export function is(val, exp, msg) {
	assert(val === exp, val, exp, 'is', direct, 'Expected values to be strictly equal:', msg);
}

export function equal(val, exp, msg) {
	assert(dequal(val, exp), val, exp, 'equal', compare, 'Expected values to be deeply equal:', msg);
}

export function type(val, exp, msg) {
	assert(typeof val === exp, typeof val, exp, 'type', false, print`Expected typeof(${val}) to be ${exp}`, msg);
}

export function instance(val, exp, msg) {
	assert(val instanceof exp, val, exp, 'instance', false, print`Expected ${val} to be an instance of ${exp}`, msg);
}

export function snapshot(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'snapshot', lines, 'Expected input to match snapshot:', msg);
}

const lineNums = (x, y) => lines(x, y, 1);
export function fixture(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'fixture', lineNums, 'Expected input to match fixture:', msg);
}

export function throws(blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
		assert(false, false, true, 'throws', direct, 'Expected function to throw', msg);
	} catch (err) {
		if (err instanceof Assertion) throw err;

		if (typeof exp === 'function') {
			assert(exp(err), false, true, 'throws', false, 'Expected function to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(exp.test(err.message), false, true, 'throws', false, print`Expected function to throw exception matching ${exp}`, msg);
		}
	}
}

// ---

export function not(val, msg, oper = 'not') {
	assert(!val, true, false, 'not', false, print`Expected ${val} to be falsey`, msg);
}

not.ok = not;

is.not = function (val, exp, msg) {
	assert(val !== exp, val, exp, 'is.not', false, 'Expected values not to be strictly equal', msg);
}

not.equal = function (val, exp, msg) {
	assert(!dequal(val, exp), val, exp, 'not.equal', false, 'Expected values not to be deeply equal', msg);
}

not.type = function (val, exp, msg) {
	assert(typeof val !== exp, typeof val, exp, 'not.type', false, print`Expected typeof(${val}) not to be ${exp}`, msg);
}

not.instance = function (val, exp, msg) {
	assert(!(val instanceof exp), val, exp, 'not.instance', false, print`Expected ${val} not to be an instance of ${exp}`, msg);
}

not.snapshot = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.snapshot', false, 'Expected input not to match snapshot', msg);
}

not.fixture = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.fixture', false, 'Expected input not to match fixture', msg);
}

not.throws = function (blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
	} catch (err) {
		if (typeof exp === 'function') {
			assert(!exp(err), true, false, 'not.throws', false, 'Expected function not to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(!exp.test(err.message), true, false, 'not.throws', false, print`Expected function not to throw exception matching ${exp}`, msg);
		} else if (!exp) {
			assert(false, true, false, 'not.throws', false, 'Expected function not to throw', msg);
		}
	}
}
