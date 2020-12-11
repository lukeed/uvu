const { parse } = require('path');
const { compile, preprocess_sync } = require('svelte/compiler');
const { getSvelteConfig } = require('./svelteconfig.js');
const { cosmiconfigSync } = require('cosmiconfig')

const useTransformer = (options = {}) => (source, filename) => {
	const { preprocess, rootMode } = options;
	if (preprocess) {
		const svelteConfig = getSvelteConfig(rootMode, filename);
		const config = cosmiconfigSync().load(svelteConfig).config
		
		return preprocess_sync(source, config.preprocess || {}, { filename }).code
	}
	else {
		return source;
	}
};

function transform(hook, source, filename) {
	const { name } = parse(filename);
	
	const preprocessed = useTransformer({ preprocess: true })(source, filename);

	const {js, warnings} = compile(preprocessed, {
		name: name[0].toUpperCase() + name.slice(1),
		format: 'cjs',
		filename
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
