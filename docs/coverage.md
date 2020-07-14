# Coverage

Code coverage is not implemented by the [CLI](/docs/cli.md) directly.

Instead, `uvu` plays nicely with existing coverage tools like [`c8`](https://www.npmjs.com/package/c8) or [`nyc`](https://www.npmjs.com/package/nyc). <br>Please refer to their respective documentations for usage information.

## Examples

> Visit the working [`/examples/coverage`](/examples/coverage) demonstration~!

Assuming we have a `uvu` command hooked up to the `npm test` script:

```js
// package.json
{
  "scripts": {
    "test": "uvu tests --ignore fixtures"
  }
}
```

We can then use `nyc` or `c8` (or others) as a prefix to our `npm test` usage:

```sh
$ c8 npm test
$ nyc npm test

$ c8 yarn test
$ nyc yarn test

$ nyc --include=src npm test
$ c8 --all npm test
```

Of course, you can also use `c8`/`nyc` directly with `uvu` – it just makes it more confusing to distinguish CLI option flags:

```sh
$ c8 uvu tests --ignore fixtures
$ nyc --include=src uvu tests --ignore fixtures
```
