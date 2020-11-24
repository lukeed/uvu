type Arrayable<T> = T[] | T;

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

// TODO: named `parse` export
export function parse(dir: string, pattern: string, opts?: Partial<Options>): Promise<Argv>;
