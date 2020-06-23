const { exec, QUEUE } = require('uvu');

module.exports = async function (suites, opts={}) {
	globalThis.UVU_DEFER = 1;

	suites.forEach((suite, idx) => {
		globalThis.UVU_INDEX = idx;
		QUEUE.push([suite.name]);
		require(suite.file);
	});

	await exec(opts.bail);
}
