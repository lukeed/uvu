declare namespace uvu {
	type Arrayable<T> = T[] | T;
	type Promisable<T> = Promise<T> | T;

	type Callback<T> = (context: T) => Promisable<void>;

	interface Hook<T> {
		(hook: Callback<T>): void;
		each(hook: Callback<T>): void;
	}

	interface Test<T> {
		(name: string, test: Callback<T>): void;
		only(name: string, test: Callback<T>): void;
		skip(name?: string, test?: Callback<T>): void;
		before: Hook<T>;
		after: Hook<T>
		run(): VoidFunction;
	}
}

declare module 'uvu' {
	type Context = Record<string, any>;
	export const test: uvu.Test<Context>;
	export type Callback<T=Context> = uvu.Callback<T>;
	export function suite<T=Context>(title?: string, suite?: T): uvu.Test<T>;
	export function exec(bail?: boolean): Promise<void>;
}

declare module 'uvu/assert' {
	type Types = 'string' | 'number' | 'boolean' | 'object' | 'undefined' | 'function';

	export type Message = string | Error;
	export function ok(actual: any, msg?: Message): void;
	export function is(actual: any, expects: any, msg?: Message): void;
	export function equal(actual: any, expects: any, msg?: Message): void;
	export function type(actual: any, expects: Types, msg?: Message): void;
	export function instance(actual: any, expects: any, msg?: Message): void;
	export function snapshot(actual: string, expects: string, msg?: Message): void;
	export function fixture(actual: string, expects: string, msg?: Message): void;
	export function match(actual: string, expects: string | RegExp, msg?: Message): void;
	export function throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message): void;
	export function not(actual: any, msg?: Message): void;
	export function unreachable(msg?: Message): void;

	export namespace is {
		function not(actual: any, expects: any, msg?: Message): void;
	}

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
}

declare module 'uvu/diff' {
	export function chars(input: any, expects: any): string;
	export function lines(input: any, expects: any, linenum?: number): string;
	export function direct(input: any, expects: any, lenA?: number, lenB?: number): string;
	export function compare(input: any, expects: any): string;
	export function arrays(input: any, expects: any): string;
}

declare module 'uvu/parse' {
	interface Suite {
		/** The relative file path */
		name: string;
		/** The absolute file path */
		file: string;
	}

	interface Options {
		cwd: string;
		require: uvu.Arrayable<string>;
		ignore: uvu.Arrayable<string | RegExp>;
	}

	interface Argv {
		dir: string;
		suites: Suite[];
	}

	function parse(dir: string, pattern: string, opts?: Partial<Options>): Promise<Argv>;
	export = parse;
}
