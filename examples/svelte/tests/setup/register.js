const { parse } = require('path');
const { readFileSync } = require('fs');
const { compile } = require('svelte/compiler');

function capitalise(name) {
	return name[0].toUpperCase() + name.substring(1);
}

// Runtime DOM hook for require("*.svelte") files
// Note: for SSR/Node.js hook, use `svelte/register`
require.extensions['.svelte'] = function(mod, filename) {
	const name = parse(filename).name.replace(/^\d/, '_$&').replace(/[^a-zA-Z0-9_$]/g, '');

	const { js, warnings } = compile(readFileSync(filename, 'utf-8'), {
		filename,
		name: capitalise(name),
		format: 'cjs'
	});

	warnings.forEach(warning => {
		console.warn(`\nSvelte Warning in ${warning.filename}:`);
		console.warn(warning.message);
		console.warn(warning.frame);
	});

	return mod._compile(js.code, filename);
}
