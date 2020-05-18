declare namespace uvu {
	type Callback = () => any | Promise<any>;
	type Result = [string | true, number, number];

	interface Test {
		(name: string, test: Callback): void;
		only(name: string, test: Callback): void;
		skip(name?: string, test?: Callback): void;
		before(hook: Callback): void;
		after(hook: Callback): void;
		run(): Promise<Result>;
	}
}

declare module 'uvu' {
	export const test: uvu.Test;
	export type Result = uvu.Result;
	export type Callback = uvu.Callback;
	export function suite(title?: string): uvu.Test;
}

declare module 'uvu/assert' {
	export type Message = string | Error;
	export function ok(val: any, msg?: Message): void;
	export function is(val: any, exp: any, msg?: Message): void;
	export function equal(val: any, exp: any, msg?: Message): void;
	export function type(val: any, exp: any, msg?: Message): void;
	export function instance(val: any, exp: any, msg?: Message): void;
	export function snapshot(val: any, exp: any, msg?: Message): void;
	export function throws(blk: Function, exp?: Message | RegExp | Function, msg?: Message): void;
	export function not(val: any, msg?: Message): void;

	export namespace is {
		declare function not(val: any, exp: any, msg?: Message): void;
	}

	export namespace not {
		declare function ok(val: any, msg?: Message): void;
		declare function equal(val: any, exp: any, msg?: Message): void;
		declare function type(val: any, exp: any, msg?: Message): void;
		declare function instance(val: any, exp: any, msg?: Message): void;
		declare function snapshot(val: any, exp: any, msg?: Message): void;
		declare function throws(blk: Function, exp?: Message | RegExp | Function, msg?: Message): void;
	}
}
