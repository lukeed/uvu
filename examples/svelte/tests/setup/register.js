const { parse } = require('path');
const { compile } = require('svelte/compiler');

function transform(hook, source, filename) {
	const { name } = parse(filename);

	const { js, warnings } = compile(source, {
		name: name[0].toUpperCase() + name.substring(1),
		format: 'cjs',
		filename,
	});

	warnings.forEach(warning => {
		console.warn(`\nSvelte Warning in ${warning.filename}:`);
		console.warn(warning.message);
		console.warn(warning.frame);
	});

	return hook(js.code, filename);
}

const loadJS = require.extensions['.js'];

// Runtime DOM hook for require("*.svelte") files
// Note: for SSR/Node.js hook, use `svelte/register`
require.extensions['.svelte'] = function (mod, filename) {
	const orig = mod._compile.bind(mod);
	mod._compile = code => transform(orig, code, filename);
	loadJS(mod, filename);
}
