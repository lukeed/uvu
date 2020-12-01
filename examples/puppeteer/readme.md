# Example: Puppeteer

This example runs [Puppeteer](https://www.npmjs.com/package/puppeteer) programmatically.

In order to invoke and test against source (`/src`) files, this example also uses [`sirv-cli`](https://www.npmjs.com/package/sirv-cli) to run a local file server. Puppeteer connects to this file server to access the `window` globals that `src/math.js` and `src/utils.js` are globally mounted to.

> **Note:** Window globals are not required in order for `uvu` to work with `puppeteer`! <br>You may, for example, load your Preact, Svelte, Vue, ... etc application inside the devserver & interact with it through Puppeteer APIs!

## Setup

```sh
$ npm install
```

## Testing

```sh
# start server
$ npm start

# run tests (2nd terminal)
$ npm test
```

## License

MIT
