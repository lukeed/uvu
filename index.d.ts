declare namespace uvu {
	type Callback = () => any | Promise<any>;

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
	export type Message = string | Error;
	export function ok(actual: any, msg?: Message, operation?: string): void;
	export function is(actual: any, expects: any, msg?: Message, operation?: string): void;
	export function equal(actual: any, expects: any, msg?: Message): void;
	export function type(actual: any, expects: any, msg?: Message): void;
	export function instance(actual: any, expects: any, msg?: Message): void;
	export function snapshot(actual: any, expects: any, msg?: Message): void;
	export function throws(blk: Function, expects?: Message | RegExp | Function, msg?: Message): void;
	export function not(actual: any, msg?: Message): void;

	export namespace is {
		declare function not(actual: any, expects: any, msg?: Message, operation?: string): void;
	}

	export namespace not {
		declare function ok(actual: any, msg?: Message, operation?: string): void;
		declare function equal(actual: any, expects: any, msg?: Message): void;
		declare function type(actual: any, expects: any, msg?: Message): void;
		declare function instance(actual: any, expects: any, msg?: Message): void;
		declare function snapshot(actual: any, expects: any, msg?: Message): void;
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
