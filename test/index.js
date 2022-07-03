const kleur = require('kleur');
const assert = require('assert');
const { totalist } = require('totalist/sync');
const { spawnSync } = require('child_process');

let code = 0;
const LEFT = kleur.dim().red('    ||  ');
const HOOK = ['-r', 'esm', '-r', 'module-alias/register'];
const PASS = kleur.green().bold('[PASS] ');
const FAIL = kleur.red().bold('[FAIL] ');

totalist(__dirname, (rel, abs) => {
	if (rel === 'index.js') return;
	let pid = spawnSync('node', HOOK.concat(abs));
	let file = kleur.bold().underline(rel);

	if (rel.endsWith('.fails.js')) {
		try {
			assert.notEqual(pid.status, 0, 'expected to fail');
			assert.equal(pid.stderr.length > 0, true, 'run w/ stderr');
			assert.equal(pid.stdout.length, 0, 'run w/o stdout');
			console.log(PASS + file);
		} catch (err) {
			console.error(FAIL + file + ' :: "%s"', err.message);
			if (pid.stdout.length) {
				console.error(LEFT + '\n' + LEFT + pid.stdout.toString().replace(/(\r?\n)/g, '$1' + LEFT));
			}
			code = 1;
		}
		return;
	}

	try {
		assert.equal(pid.status, 0, 'run w/o error code');
		assert.equal(pid.stderr.length, 0, 'run w/o stderr');
		assert.equal(pid.stdout.length > 0, true, 'run w/ stdout');
		console.log(PASS + file);
	} catch (err) {
		console.error(FAIL + file + ' :: "%s"', err.message);
		if (pid.stdout.length) {
			console.error(LEFT + '\n' + LEFT + pid.stdout.toString().replace(/(\r?\n)/g, '$1' + LEFT));
		}
		code = 1;
	}
});

process.exit(code);
