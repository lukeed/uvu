declare namespace uvu {
	type Callback<T> = (context: T) => Promise<void> | void;

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

type Context = Record<string, any>;
export const test: uvu.Test<Context>;
export type Callback<T=Context> = uvu.Callback<T>;
export function suite<T=Context>(title?: string, context?: Partial<T>): uvu.Test<T>;
export function exec(bail?: boolean): Promise<void>;
