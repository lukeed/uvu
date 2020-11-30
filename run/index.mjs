import { exec } from 'uvu';

export async function run(suites, opts={}) {
	let suite, idx=0;
	globalThis.UVU_DEFER = 1;

	for (suite of suites) {
		globalThis.UVU_INDEX = idx++;
		globalThis.UVU_QUEUE.push([suite.name]);
		await import('file:///' + suite.file);
	}

	await exec(opts.bail);
}
