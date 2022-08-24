import { dequal } from 'dequal';
import { compare, lines } from 'uvu/diff';

function dedent(str) {
	str = str.replace(/\r?\n/g, '\n');
  let arr = str.match(/^[ \t]*(?=\S)/gm);
  let i = 0, min = 1/0, len = (arr||[]).length;
  for (; i < len; i++) min = Math.min(min, arr[i].length);
  return len && min ? str.replace(new RegExp(`^[ \\t]{${min}}`, 'gm'), '') : str;
}

const LOG_ASSERTS = false; 
// TODO put this in some sort of config (suite?)
const log = LOG_ASSERTS? console.log : ()=>{}

export class Assertion extends Error {
	constructor(opts={}) {
		super(opts.message);
		this.name = 'Assertion';
		this.code = 'ERR_ASSERTION';
		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor);
		}
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
	throw new Assertion({ actual, expects, operator, message, details, generated: !msg });
}

export function ok(val, msg) {
	assert(!!val, false, true, 'ok', false, 'Expected value to be truthy', msg);
	log("assert.ok successful: " + val)
}

export function is(val, exp, msg) {
	assert(val === exp, val, exp, 'is', compare, 'Expected values to be strictly equal:', msg);
	log("assert.is successful: " + val)

}

export function equal(val, exp, msg) {
	assert(dequal(val, exp), val, exp, 'equal', compare, 'Expected values to be deeply equal:', msg);
	log("assert.equal successful: " + val)

}

export function unreachable(msg) {
	assert(false, true, false, 'unreachable', false, 'Expected not to be reached!', msg);
}

export function type(val, exp, msg) {
	let tmp = typeof val;
	assert(tmp === exp, tmp, exp, 'type', false, `Expected "${tmp}" to be "${exp}"`, msg);
	log("assert.type successful: " + val + ", " + exp)
}

export function instance(val, exp, msg) {
	let name = '`' + (exp.name || exp.constructor.name) + '`';
	assert(val instanceof exp, val, exp, 'instance', false, `Expected value to be an instance of ${name}`, msg);
	log("assert.instance successful: " + val + ", " + exp)

}

export function match(val, exp, msg) {
	if (typeof exp === 'string') {
		assert(val.includes(exp), val, exp, 'match', false, `Expected value to include "${exp}" substring`, msg);
	} else {
		assert(exp.test(val), val, exp, 'match', false, `Expected value to match \`${String(exp)}\` pattern`, msg);
	}
	log("assert.match successful: " + val + ", " + exp)
}

export function snapshot(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'snapshot', lines, 'Expected value to match snapshot:', msg);
	log("assert.snapshot successful: " + val + ", " + exp)

}

const lineNums = (x, y) => lines(x, y, 1);
export function fixture(val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val === exp, val, exp, 'fixture', lineNums, 'Expected value to match fixture:', msg);
	log("assert.fixture successful: " + val + ", " + exp)

}

export function throws(blk, exp, msg) {
	if (!msg && typeof exp === 'string') {
		msg = exp; exp = null;
	}

	try {
		blk();
		assert(false, false, true, 'throws', false, 'Expected function to throw', msg);
	} catch (err) {
		if (err instanceof Assertion) throw err;

		if (typeof exp === 'function') {
			assert(exp(err), false, true, 'throws', false, 'Expected function to throw matching exception', msg);
		} else if (exp instanceof RegExp) {
			assert(exp.test(err.message), false, true, 'throws', false, `Expected function to throw exception matching \`${String(exp)}\` pattern`, msg);
		}
		const msg2 = exp ? ", " + exp : "";
		log("assert.throws successful: " + blk.name + msg2)
	}
}

// ---

export function not(val, msg) {
	assert(!val, true, false, 'not', false, 'Expected value to be falsey', msg);
	log("assert.not successful: " + val)

}

not.ok = not;

is.not = function (val, exp, msg) {
	assert(val !== exp, val, exp, 'is.not', false, 'Expected values not to be strictly equal', msg);
	log("assert.is.not successful: " + val + ", " + exp)

}

not.equal = function (val, exp, msg) {
	assert(!dequal(val, exp), val, exp, 'not.equal', false, 'Expected values not to be deeply equal', msg);
	log("assert.not.equal successful: " + val + ", " + exp)

}

not.type = function (val, exp, msg) {
	let tmp = typeof val;
	assert(tmp !== exp, tmp, exp, 'not.type', false, `Expected "${tmp}" not to be "${exp}"`, msg);
	log("assert.not.type successful: " + val + ", " + exp)

}

not.instance = function (val, exp, msg) {
	let name = '`' + (exp.name || exp.constructor.name) + '`';
	assert(!(val instanceof exp), val, exp, 'not.instance', false, `Expected value not to be an instance of ${name}`, msg);
	log("assert.not.instance successful: " + val + ", " + exp)

}

not.snapshot = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.snapshot', false, 'Expected value not to match snapshot', msg);
	log("assert.not.snapshot successful: " + val + ", " + exp)

}

not.fixture = function (val, exp, msg) {
	val=dedent(val); exp=dedent(exp);
	assert(val !== exp, val, exp, 'not.fixture', false, 'Expected value not to match fixture', msg);
	log("assert.not.fixture successful: " + val + ", " + exp)

}

not.match = function (val, exp, msg) {
	if (typeof exp === 'string') {
		assert(!val.includes(exp), val, exp, 'not.match', false, `Expected value not to include "${exp}" substring`, msg);
	} else {
		assert(!exp.test(val), val, exp, 'not.match', false, `Expected value not to match \`${String(exp)}\` pattern`, msg);
	}
	log("assert.not.match successful: " + val + ", " + exp)

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
			assert(!exp.test(err.message), true, false, 'not.throws', false, `Expected function not to throw exception matching \`${String(exp)}\` pattern`, msg);
		} else if (!exp) {
			assert(false, true, false, 'not.throws', false, 'Expected function not to throw', msg);
		}
		const msg2 = exp ? ", " + exp : "";
		log("assert.not.throws successful: " + blk.name + msg2)

	}
}
