# Example: TypeScript

## Why

This example showcase the use of TypeScript via `ts-node`.

Note that TypeScript can't be used with the `esm-loader` and must be opted out of via the CLI option `--esm false`.

## How

Install dependencies

```bash
npm i -D typescript ts-node
```

Configure `ts-node` via [`tsconfig.json`](./tsconfig.json)

```json
{
  "ts-node": {
    "transpileOnly": true,
    "compilerOptions": {
      "module": "commonjs"
    },
    "include": [
      "tests/**/*"
    ]
  },
  // other compiler options
}
```

And voilá
```bash
uvu --esm false -r ts-node/register tests
```

## License

MIT © [Luke Edwards](https://lukeed.com)
