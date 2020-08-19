type Arrayable<T> = T[] | T;

interface Suite {
	/** The relative file path */
	name: string;
	/** The absolute file path */
	file: string;
}

interface Options {
	cwd: string;
	require: Arrayable<string>;
	ignore: Arrayable<string | RegExp>;
}

interface Argv {
	dir: string;
	suites: Suite[];
}

// TODO: named `parse` export
// TODO: export type interfaces
function parse(dir: string, pattern: string, opts?: Partial<Options>): Promise<Argv>;
export = parse;
