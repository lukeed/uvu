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

function asserts(actual, expects, operator, msg, backup) {
	if (msg instanceof Error) return msg;
	return new Assertion({ message: msg || backup, generated: !msg, operator, expects, actual });
}

// TODO: more explicit `details` operator
export class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		this.generated = !!opts.generated;
		Error.captureStackTrace(this, this.constructor);
		let { operator, expects, actual } = opts;
		this.details = operator.includes('not') ? false
			: operator === 'fixture' ? lines(actual, expects, 1)
			: operator === 'snapshot' ? lines(actual, expects)
			: operator === 'equal' ? compare(actual, expects)
			: direct(actual, expects);
		this.operator = operator;
		this.expects = expects;
		this.actual = actual;
	}
}

export function ok(val, msg, oper = 'ok') {
	if (!val) throw asserts(false, true, oper, msg, print`Expected ${val} to be truthy`);
}

export function is(val, exp, msg, oper = 'is') {
	ok(val === exp, asserts(val, exp, oper, msg, 'Expected values to be strictly equal:'));
}

export function equal(val, exp, msg) {
	ok(dequal(val, exp), asserts(val, exp, 'equal', msg, 'Expected values to be deeply equal:'));
}

export function type(val, exp, msg) {
	is(typeof val, exp, msg || print`Expected typeof(${val}) to be ${exp}`, 'type');
}

export function instance(val, exp, msg) {
	ok(val instanceof exp, msg || print`Expected ${val} to be an instance of ${exp}`, 'instance');
}

export function snapshot(val, exp, msg) {
	is(val = dedent(val), exp = dedent(exp), msg || 'Expected input to match snapshot:', 'snapshot');
}

export function fixture(val, exp, msg) {
	is(val = dedent(val), exp = dedent(exp), msg || 'Expected input to match fixture:', 'fixture');
}

export function throws(blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
		return ok(false, msg || 'Expected function to throw', 'throws');
	} catch (err) {
		if (typeof exp === 'function') {
			return ok(exp(err), msg || 'Expected function to throw matching exception', 'throws');
		} else if (exp instanceof RegExp) {
			return ok(exp.test(err.message), msg || print`Expected function to throw exception matching ${exp}`, 'throws');
		}
	}
}

// ---

export function not(val, msg, oper = 'not') {
	if (val) throw asserts(true, false, oper, msg, print`Expected ${val} to be falsey`);
}

not.ok = not;

is.not = function (val, exp, msg, oper = 'is.not') {
	ok(val !== exp, asserts(val, exp, oper, msg, 'Expected values not to be strictly equal:'));
}

not.equal = function (val, exp, msg) {
	not(dequal(val, exp), msg || print`Expected values not to be deeply equal:`, 'not.equal');
}

not.type = function (val, exp, msg) {
	is.not(typeof val, exp, msg || print`Expected typeof(${val}) not to be ${exp}`, 'not.type');
}

not.instance = function (val, exp, msg) {
	not(val instanceof exp, msg || print`Expected ${val} not to be an instance of ${exp}`, 'not.instance');
}

not.snapshot = function (val, exp, msg) {
	is.not(val = dedent(val), exp = dedent(exp), msg || 'Expected input not to match snapshot', 'not.snapshot');
}

not.fixture = function (val, exp, msg) {
	is.not(val = dedent(val), exp = dedent(exp), msg || 'Expected input not to match fixture', 'not.fixture');
}

not.throws = function (blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
	} catch (err) {
		if (typeof exp === 'function') {
			return not(exp(err), msg || print`Expected function not to throw matching exception`, 'not.throws');
		} else if (exp instanceof RegExp) {
			return not(exp.test(err.message), msg || print`Expected function not to throw exception matching ${exp}`, 'not.throws');
		} else if (!exp) {
			return not(true, msg || print`Expected function not to throw`, 'not.throws');
		}
	}
}
