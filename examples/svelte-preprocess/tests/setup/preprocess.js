const svelte = require('svelte/compiler')
const { cosmiconfigSync } = require('cosmiconfig')

const { source, filename, svelteConfig } = process.env
const config = cosmiconfigSync().load(svelteConfig).config

svelte
  .preprocess(source, config.preprocess || {}, { filename })
  .then(r => { process.stdout.write(r.code) })