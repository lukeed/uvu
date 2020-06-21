type Arrayable<T> = T[] | T;
type Promisable<T> = Promise<T> | T;

declare namespace uvu {
	type Callback = () => Promisable<any>;

	interface Test {
		(name: string, test: Callback): void;
		only(name: string, test: Callback): void;
		skip(name?: string, test?: Callback): void;
		before(hook: Callback): void;
		after(hook: Callback): void;
		run(): VoidFunction;
	}
}

declare module 'uvu' {
	export const test: uvu.Test;
	export type Callback = uvu.Callback;
	export function suite(title?: string): uvu.Test;
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
	export function snapshot(actual: any, expects: any, msg?: Message): void;
	export function fixture(actual: any, expects: any, msg?: Message): void;
	export function throws(blk: Function, expects?: Message | RegExp | Function, msg?: Message): void;
	export function not(actual: any, msg?: Message): void;
	export function unreachable(msg?: Message): void;

	export namespace is {
		declare function not(actual: any, expects: any, msg?: Message): void;
	}

	export namespace not {
		declare function ok(actual: any, msg?: Message): void;
		declare function equal(actual: any, expects: any, msg?: Message): void;
		declare function type(actual: any, expects: Types, msg?: Message): void;
		declare function instance(actual: any, expects: any, msg?: Message): void;
		declare function snapshot(actual: any, expects: any, msg?: Message): void;
		declare function fixture(actual: any, expects: any, msg?: Message): void;
		declare function throws(blk: Function, expects?: Message | RegExp | Function, msg?: Message): void;
	}

	export declare class Assertion extends Error {
		name: 'Assertion';
		code: 'ERR_ASSERTION';
		details: false | string;
		generated: boolean;
		operator: string;
		expects: any;
		actual: any;
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
	export interface Suite {
		/** The relative file path */
		name: string;
		/** The absolute file path */
		file: string;
	}

	export interface Options {
		cwd: string;
		require: Arrayable<string>;
		ignore: Arrayable<string | RegExp>;
	}

	export interface Argv {
		dir: string;
		suites: Suite[];
	}

	function parse(dir: string, pattern: string, opts?: Partial<Options>): Promise<Argv>;
	export = parse;
}
