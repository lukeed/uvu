# Example: esm.dual

Please read [/docs/esm](/docs/esm.md) for full details & comparisons.

## Why

Unlike [/examples/esm.loader](/examples/esm.loader), this example uses the native ESM loader whenever it's available.

Unlike [/examples/esm.mjs](/examples/esm.mjs), this example will run in all versions of Node.js – including older versions where ESM is not natively supported.


## Highlights

* Define `"type": "module"` within `package.json` <br>Allows Node.js to treat `.js` files as ESM.

* Define `import` statements with full file paths <br>Required by Node.js whenever ESM in use.

* Define two `test` scripts:
  * `"test:native"` – for use within Node 12+
  * `"test:legacy"` – for use with Node < 12

## License

MIT © [Luke Edwards](https://lukeed.com)
