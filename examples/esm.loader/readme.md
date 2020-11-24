# Example: esm.loader

Please read [/docs/esm](/docs/esm.md) for full details & comparisons.

## Why

This example makes use of the [`esm`](https://npmjs.com/package/esm) module, which rewrites all ESM syntax to CommonJS on the fly.


## Highlights

* Use ESM within regular `.js` files

* Works in all versions of Node.js <br>Because the `esm` loader is invoked – never the native behavior.

* Solves CommonJS <-> ESM interop issues <br>A significant portion of the npm ecosystem is still CommonJS-only.


## License

MIT © [Luke Edwards](https://lukeed.com)
