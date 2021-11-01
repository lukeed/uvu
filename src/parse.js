import { readdir, stat } from 'fs';
import { resolve, join } from 'path';
import { promisify } from 'util';

const ls = promisify(readdir);
const toStat = promisify(stat);
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
	let ignores = ['^.git', 'node_modules'].concat(opts.ignore || []).map(toRegex);

	requires.forEach(name => {
		let tmp = exists(name);
		if (tmp) return require(tmp);
		if (tmp = exists(resolve(name))) return require(tmp);
		throw new Error(`Cannot find module '${name}'`);
	});

	// NOTE: Node 8.x support
	// @modified lukeed/totalist
	await (async function collect(d, p) {
		await ls(d).then(files => {
			return Promise.all(
				files.map(async str => {
					let name = join(p, str);
					for (let i = ignores.length; i--;) {
						if (ignores[i].test(name)) return;
					}

					let file = join(d, str);
					let stats = await toStat(file);
					if (stats.isDirectory()) return collect(file, name);
					else if (pattern.test(name)) suites.push({ name, file });
				})
			);
		});
	})(dir, '');

	suites.sort((a, b) => a.name.localeCompare(b.name));

	return { dir, suites, requires: requires.length > 0 };
}
