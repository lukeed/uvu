# CLI

> The `uvu` CLI is available whenever you install the `uvu` package.

The _role_ of the `uvu` CLI is to collect and execute your tests suites. In order to do that, you must tell it how/where to find your tests. Otherwise, it has a default set of file patterns to search for – but that probably won't align with your project's structure.

> **Note:** Using the `uvu` CLI is actually _optional_! See [Isolation](#isolation) for more info.

Let's take a look at the CLI's help text:

```sh
$ uvu --help
#
#   Usage
#     $ uvu [dir] [pattern] [options]
#
#   Options
#     -b, --bail       Exit on first failure
#     -i, --ignore     Any file patterns to ignore
#     -r, --require    Additional module(s) to preload
#     -C, --cwd        The current directory to resolve from  (default .)
#     -c, --color      Print colorized output  (default true)
#     -v, --version    Displays current version
#     -h, --help       Displays this message
#
```

As you can see, there are few arguments and option flags! <br>They're categorized by responsibility:

* where/how to locate test files (`dir`, `pattern`, `--ignore`, and `--cwd`)
* environment preparation (`--require` and `--color`)
* whether or not to exit on suite failures (`--bail`)

## Matching

***Aside: Glob Patterns***

Unlike other test runners, `uvu` intentionally _does not_ rely on glob patterns. <br>Parsing and matching globs both require a non-trivial amount of work. (Even the smallest glob-parsers are as large – or larger – than the entire `uvu` source!) This price has to be paid upfront – at startup – and then becomes completely irrelevant. And then on the consumer side, glob patterns fall into one of two categories:

* extremely simple patterns (eg, `test/**`, `tests/**/*.test.(ts|js)`, etc)
* extremely complicated patterns that require squinting and fine-tuning

Simple patterns don't _require_ a glob pattern 99% of the time. <br>
Complicated glob patterns can (often) be better expressed or understood as separate segments.

And then there's the reoccurring issue of some shells and/or operating systems (eg, Windows) that will pre-evaluate a glob pattern, ruining a CLI's expected input... And how different systems require quotation marks, and/or certain characters to be escaped... There are issues with this approach. It certainly _can_ work, but `uvu` sidesteps this can of worms in favor of a different, but simpler approach.

***Logic***

The CLI will _always_ resolve lookups from the `--cwd` location, which is the `process.cwd()` when unspecified.

By default (aka, when no arguments are given), `uvu` looks for files matching this behemoth of a pattern:

```js
/((\/|^)(tests?|__tests?__)\/.*|\.(tests?|spec)|^\/?tests?)\.([mc]js|[jt]sx?)$/i;
```

This will:

* search within `test`, `tests` or `__test__` or `__tests__` directories if they exist; otherwise any directory
* search for files matching `*.test.{ext}` or `*.tests.{ext}` or `*.spec.{ext}`
* search for files with these extensions: `mjs`, `cjs`, `js`, `jsx`, `tsx`, or `ts`

Of course, you can help `uvu` out and narrow down its search party by providing a `dir` argument. Instead of searching from your project's root, `dir` tells `uvu` where to _start_ its traversal from. And by specifying a `dir`, the default `pattern` changes such that any file with a `mjs`, `cjs`, `js`, `jsx`, `tsx`, or `ts` extension will match.

Finally, you may specify your own `pattern` too &mdash; assuming `dir` has been set. <br>The `pattern` value is passed through `new RegExp(<pattern>, 'i')`. If you are nostalgic for complex glob patterns, this is your chance to relive its glory days – with substitutions, of course.

For example, if we assume a [monorepo environment](/examples/monorepo/package.json), your `uvu` usage may look like this:

```sh
$ uvu packages tests -i fixtures
```

This will traverse the `packages` directory, looking at files and subdirectories that match `/tests/i`, but ignore anything that matches the `/fixtures/i` pattern.


***Ignoring***

Any file or directory names matching `node_modules` or `^.git` are _always_ ignored.

You can use the `-i/--ignore` flags to provide additional patterns to ignore. Much like `[pattern]`, these values are cast to a `RegExp`, allowing you to be as vague or specific as you need to be.

The `-i/--ignore` flags can be passed multiple times:

```sh
# Traverse "packages" diectory
# ~> ignore items matching /foobar/i
# ~> ignore items matching /fixtures/i
# ~> ignore items matching /\d+.js$/i
$ uvu packages -i foobar -i fixtures -i \\d+.js$
```


## Isolation

When running `uvu`, it looks for all test files and will enqueue all suites for execution. You can always disable individual suites (by commenting out its `.run()` call), but sometimes you just want to execute a single file.

To do this, you can simply call `node` with the path to your file! 🎉<br>This works _because_ `uvu` test files are self-contained – its `import`/`require` statements aren't tucked away, nor are the suites' `run()` invocation.

```sh
# Before (runs everything in packages/**/**test**)
$ uvu packages test

# After (specific file)
$ node packages/utils/test/random.js
```

Since `uvu` and `node` share the `--require` hook, you can bring your `uvu -r` arguments to `node` too~!

```sh
# Before
$ uvu -r esm tests
$ uvu -r ts-node/register tests

# After
$ node -r esm tests/math.js
$ node -r ts-node/register tests/math.ts
```
