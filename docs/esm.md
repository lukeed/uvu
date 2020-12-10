# ES Modules

EcmaScript Modules have landed in Node.js (> 12.x)! Check out the official language documentation<sup>[[1](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules)][[2](https://nodejs.org/api/packages.html)]</sup> to learn more.

...but, here's the **TL;DR:**

* by default, only files with `.mjs` extension are treated as ESM
* by default, `.js` – and now `.cjs` – files are treated as CommonJS
* by defining `"type": "module"` in your `package.json` file, all `.js` files are treated as ESM
* when using ESM, any `import`s must reference the _full_ filepath, including its extension
* the `.cjs` extension is _always_ CommonJS, even if `"type": "module"` is defined

## Examples

Knowing the above, there are a few ways we can use/integrate ESM into our `uvu` test suites!

> **Important:** Only uvu v0.5.0+ has native ESM support

### Native ESM – via `.mjs` files

> Visit the working [`/examples/esm.mjs`](/examples/esm.mjs) demonstration~!

This example only works in Node.js v12.0 and later. In other words, it requires that _both_ your test files _and_ your source files possess the `.mjs` extension. This is – by default – the only way Node.js will load ES Modules and allow them to import/reference one another.

***PRO***

* Modern
* Native / less tooling

***CON***

* Requires Node.js 12.0 and later
* Exposes you to CommonJS <-> ESM interop issues
* Cannot test older Node.js versions – unless maintain a duplicate set of source _and_ test files


### Polyfill – via `esm` package

> Visit the working [`/examples/esm.loader`](/examples/esm.loader) demonstration~!

Thanks to [`esm`](http://npmjs.com/package/esm), this example works in **all** Node.js versions. However, for best/consistent results, you **should avoid** using `.mjs` files when using this approach. This is because `esm` has some [limitations](https://www.npmjs.com/package/esm#extensions) and chooses not to interact/tamper with files that, by definition, should only be running with the native loader anyway.

***PRO***

* Makes ESM accessible to older Node.js versions
* Solves (most) CommonJS <-> ESM interop issues
* Only requires a simple `--require/-r` hook
* Quick to attach and quick to execute

***CON***

* Not native
* Not compatible with `.mjs` files


### Native ESM – via `"type": "module"`

> Visit the working [`/examples/esm.dual`](/examples/esm.dual) demonstration~!

This example combines the best of both worlds! It makes use of native ESM in Node.js versions that support it, while still making it possible to run your tests in older/legacy Node.js versions.

With `"type": "module"`, we are able to use ESM within `.js` files.
Node 12.x and later to process those files as ESM, through native behavior.
And then older Node.js versions can run/process the _same_ files by simply including the [`esm`](http://npmjs.com/package/esm) loader.

At worst – all we have is a "duplicate" test script... which is much, much better than duplicating sets of files. We end up with something like this:

```js
{
  "type": "module",
  // ...
  "scripts": {
    "test:legacy": "uvu -r esm tests",
    "test:native": "uvu tests"
  }
}
```

Your CI environment would execute the appropriate script according to its Node version :tada:

***PRO***

* Native when possible
* No additional maintenance
* Run tests in wider Node.js matrix
* Easy to drop legacy support at anytime

***CON***

* Defining `"type": "module"` may change how your package is consumed
