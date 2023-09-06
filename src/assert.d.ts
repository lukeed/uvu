type Types = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function';

declare interface Is {
  <Actual, Expects extends Actual>(actual: Actual, expected: Expects, message?: string): void;
	not(actual: any, expects: any, msg?: Message): void;
}

declare interface Equal {
  <Actual, Expects extends Actual>(actual: Actual, expected: Expects, message?: string): void;
	<Actual extends Expects, Expects>(actual: Actual, expected: Expects, message?: string): void;
	<Actual, Expects>(actual: Actual, expected: Expects, message?: string): boolean;
	skip(actual: any, expected: any, message?: string): void;
}

export type Message = string | Error;
export const equal: Equal;
export const is: Is;
export function ok(actual: any, msg?: Message): asserts actual;
export function type(actual: any, expects: Types, msg?: Message): void;
export function instance(actual: any, expects: any, msg?: Message): void;
export function snapshot(actual: string, expects: string, msg?: Message): void;
export function fixture(actual: string, expects: string, msg?: Message): void;
export function match(actual: string, expects: string | RegExp, msg?: Message): void;
export function throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message): void;
export function not(actual: any, msg?: Message): void;
export function unreachable(msg?: Message): void;

export namespace not {
	function ok(actual: any, msg?: Message): void;
	function equal(actual: any, expects: any, msg?: Message): void;
	function type(actual: any, expects: Types, msg?: Message): void;
	function instance(actual: any, expects: any, msg?: Message): void;
	function snapshot(actual: string, expects: string, msg?: Message): void;
	function fixture(actual: string, expects: string, msg?: Message): void;
	function match(actual: string, expects: string | RegExp, msg?: Message): void;
	function throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message): void;
}

export class Assertion extends Error {
	name: 'Assertion';
	code: 'ERR_ASSERTION';
	details: false | string;
	generated: boolean;
	operator: string;
	expects: any;
	actual: any;
	constructor(options?: {
		message: string;
		details?: string;
		generated?: boolean;
		operator: string;
		expects: any;
		actual: any;
	});
}
