import kleur from 'kleur';

const into = (ctx, key) => (name, handler) => ctx[key].push({ name, handler });
const context = () => ({ tests:[], before:[], after:[], only:[] });
const hook = (ctx, key) => handler => ctx[key].push(handler);
const write = x => process.stdout.write(x);

const PASS = kleur.gray('• ');
const FAIL = kleur.red('✘ ');

async function runner(ctx, name) {
	let { only, tests, before, after } = ctx;
	let arr = only.length ? only : tests;
	let num=0, total=arr.length;
	let test, hook, errs=[];
	try {
		// console.log('(runner) name:', name);
		for (hook of before) await hook();
		for (test of arr) {
			try {
				await test.handler();
				write(PASS);
				num++;
			} catch (err) {
				errs.push(err);
				write(FAIL);
			}
		}
	} finally {
		for (hook of after) await hook();
		let msg = `  (${num} / ${total})\n`;
		write(errs.length ? kleur.red(msg) : kleur.green(msg));
		return [!errs.length || errs, num, total];
	}
}

function setup(ctx, name = '') {
	const test = into(ctx, 'tests');
	test.before = hook(ctx, 'before');
	test.after = hook(ctx, 'after');
	test.only = into(ctx, 'only');
	test.skip = () => {};
	test.run = () => {
		if (global.UVU_DEFER) {
			let copy = { ...ctx };
			Object.assign(ctx, context());
			let run = runner.bind(0, copy, name);
			QUEUE[global.UVU_INDEX].push(run);
		} else {
			return runner(ctx, name);
		}
	};
	return test;
}

export const QUEUE = [];
export const suite = (name = '') => setup(context(), name);
export const test = suite();
