declare module 'uvu' {
	export type Callback = () => any | Promise<any>;
	export type Result = [Error[] | true, number, number];

	export function suite(title?: string): test;
	export function test(name: string, test: Callback): void;

	export namespace test {
		declare function only(name: string, test: Callback): void;
		declare function skip(name?: string, test?: Callback): void;
		declare function before(hook: Callback): void;
		declare function after(hook: Callback): void;
		declare function run(): Promise<Result>;
	}
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
