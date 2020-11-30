const { exec } = require('uvu');

exports.run = async function (suites, opts={}) {
	globalThis.UVU_DEFER = 1;

	suites.forEach((suite, idx) => {
		globalThis.UVU_QUEUE.push([suite.name]);
		globalThis.UVU_INDEX = idx;
		require(suite.file);
	});

	await exec(opts.bail);
}
