const { reset } = require('kleur');
const { promisify } = require('util');
const { execFile } = require('child_process');

const spawn = promisify(execFile);
const PAD = reset().dim('    ||  ');

const runners = {
	ava: [require.resolve('ava/cli.js'), 'suites/ava/**'],
	baretest: [require.resolve('./suites/baretest')],
	jest: [require.resolve('jest/bin/jest.js'), 'suites/jest', '--env=node'],
	mocha: [require.resolve('mocha/bin/mocha'), 'suites/mocha'],
	pta: [require.resolve('pta/src/cli.js'), 'suites/pta/index.js'],
	tap: [require.resolve('tap/bin/run'), '--no-coverage', 'suites/tap'],
	tape: [require.resolve('tape/bin/tape'), 'suites/tape'],
	test: [require.resolve('./suites/test')],
	uvu: [require.resolve('uvu/bin.js'), 'suites/uvu'],
	zora: ['suites/zora/index.js']
};

function format(arr) {
	let num = Math.round(arr[1] / 1e6);
	if (arr[0] > 0) return (arr[0] + num / 1e3).toFixed(2) + 's';
	return `${num}ms`;
}

async function run(name, args) {
	let timer = process.hrtime();
	let pid = await spawn('node', args, { cwd: __dirname });
	let delta = process.hrtime(timer);

	console.log('~> "%s" took %s', name, format(delta));
	console.log(PAD + '\n' + PAD + (pid.stderr || pid.stdout).toString().replace(/(\r?\n)/g, '$1' + PAD));
}

(async function () {
	for (let name of Object.keys(runners)) {
		await run(name, runners[name]);
	}
})().catch(err => {
	console.error('Oops~!', err);
	process.exit(1);
});
