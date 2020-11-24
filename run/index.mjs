import { exec, QUEUE } from 'uvu';

export async function run(suites, opts={}) {
	let suite, idx=0;
	globalThis.UVU_DEFER = 1;

	for (suite of suites) {
		QUEUE.push([suite.name]);
		globalThis.UVU_INDEX = idx++;
		await import('file:///' + suite.file);
	}

	await exec(opts.bail);
}
