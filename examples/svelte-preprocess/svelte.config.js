const sveltePreprocess = require("svelte-preprocess");

const defaults = {
	script: "typescript",
};

module.exports = {
	preprocess: sveltePreprocess({ defaults })
}