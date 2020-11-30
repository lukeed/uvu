import { resolve } from 'path';
import { totalist } from 'totalist';

const toRegex = x => new RegExp(x, 'i');

function exists(dep) {
	try { return require.resolve(dep) }
	catch (err) { return false }
}

export async function parse(dir, pattern, opts = {}) {
	if (pattern) pattern = toRegex(pattern);
	else if (dir) pattern = /(((?:[^\/]*(?:\/|$))*)[\\\/])?\w+\.([mc]js|[jt]sx?)$/;
	else pattern = /((\/|^)(tests?|__tests?__)\/.*|\.(tests?|spec)|^\/?tests?)\.([mc]js|[jt]sx?)$/i;
	dir = resolve(opts.cwd || '.', dir || '.');

	let suites = [];
	let requires = [].concat(opts.require || []).filter(Boolean);
	let ignores = ['node_modules'].concat(opts.ignore || []).map(toRegex);

	requires.forEach(name => {
		let tmp = exists(name);
		if (tmp) return require(tmp);
		if (tmp = exists(resolve(name))) return require(tmp);
		throw new Error(`Cannot find module '${name}'`);
	});

	await totalist(dir, (rel, abs) => {
		if (pattern.test(rel) && !ignores.some(x => x.test(rel))) {
			suites.push({ name: rel, file: abs });
		}
	});

	suites.sort((a, b) => a.name.localeCompare(b.name));

	return { dir, suites, requires: requires.length > 0 };
}
