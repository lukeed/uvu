const { reset } = require('kleur');
const { promisify } = require('util');
const { execFile } = require('child_process');

const spawn = promisify(execFile);
const PAD = reset().dim('    ||  ');

const runners = {
	ava: ['./node_modules/ava/cli.js', 'suites/ava/**'],
	jest: ['./node_modules/jest/bin/jest.js', 'suites/jest', '--env=node'],
	mocha: ['./node_modules/mocha/bin/mocha', 'suites/mocha'],
	tape: ['./node_modules/tape/bin/tape', 'suites/tape'],
	teenytest: ['./node_modules/teenytest/bin/teenytest', 'suites/teenytest'],
	uvu: ['./node_modules/uvu/bin.js', 'suites/uvu'],
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
