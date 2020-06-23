import { exec, QUEUE } from 'uvu';

export default async function (suites, opts={}) {
	let suite, idx=0;
	globalThis.UVU_DEFER = 1;

	for (suite of suites) {
		QUEUE.push([suite.name]);
		globalThis.UVU_INDEX = idx++;
		await import(suite.file);
	}

	await exec(opts.bail);
}
