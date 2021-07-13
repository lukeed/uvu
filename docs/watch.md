# Watch Mode

Watching – aka "re-running" – tests is not implemented by the [CLI](/docs/cli.md) directly. <br>This partly because `uvu` is so fast and lightweight, which means that there's _very_ little cost in rerunning your tests.

Instead, `uvu` is meant to interface with other tools nicely. Some of those include (but are not limited to):

* [`uvu-watch`](https://github.com/aleclarson/uvu-watch)
* [`watchlist`](https://github.com/lukeed/watchlist)
* [`watchexec`](https://github.com/watchexec/watchexec)
* [`chokidar-cli`](https://www.npmjs.com/package/chokidar-cli)
* [`watch`](https://www.npmjs.com/package/watch)

&nbsp;

## `uvu-watch` example

Ensure your `test` script exists in `package.json`.

```json
"test": "uvu tests -r esm"
```

Install [`uvu-watch`](https://github.com/aleclarson/uvu-watch) as a dev dependency, and run your tests with the `--watch` flag (`-w` for short).

```sh
yarn add uvu-watch -D && yarn test -w
```

**How does it work?** When you install `uvu-watch`, it replaces the `uvu` command used by your `test` script with one that has a `--watch` flag. When `--watch` is used, your tests run immediately like normal, then your entire project is watched (except `node_modules` and dotfiles).

&nbsp;

## `watchlist` example

> Visit the working [`/examples/watch`](/examples/watch) demonstration~!

Assuming we have a `uvu` command hooked up to the `npm test` script:

```js
// package.json
{
  "scripts": {
    "test": "uvu tests --ignore fixtures"
  },
  "devDependencies": {
    "uvu": "^0.2.0"
  }
}
```

We just need to install [`watchlist`](https://github.com/lukeed/watchlist) and configure a new `scripts` entry. We'll call it `"test:watch"`:

> **Note:** As mentioned, alternatives to `watchlist` will work too.

```sh
$ yarn add --dev watchlist
```

```diff
{
  "scripts": {
-    "test": "uvu tests --ignore fixtures"
+    "test": "uvu tests --ignore fixtures",
+    "test:watch": "watchlist src tests -- yarn test"
  },
  "devDependencies": {
-    "uvu": "^0.2.0"
+    "uvu": "^0.2.0",
+    "watchlist": "^0.2.0"
  }
}
```

Now we need to start our test watcher:

```sh
$ yarn test:watch
```

What happens is that `watchlist` will recursively watch the `src` and `tests` directories. When those directories' contents change (move, rename, etc), the `yarn test` command will be executed. And in this case, `yarn test` is just an alias for our `uvu` configuration, which means that we can keep the command option flags visually separate & keep scripts DRY for our own peace of mind :)

> **Note:** This assumes that we have a `/src` directory that lives alongside our `/tests` directory.
