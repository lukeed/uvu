<div align="center">
  <img src="shots/uvu.jpg" alt="uvu" height="120" />
</div>

<div align="center">
  <a href="https://npmjs.org/package/TODO">
    <img src="https://badgen.now.sh/npm/v/TODO" alt="version" />
  </a>
  <a href="https://github.com/lukeed/uvu/actions">
    <img src="https://github.com/lukeed/uvu/workflows/CI/badge.svg" alt="CI" />
  </a>
  <a href="https://npmjs.org/package/TODO">
    <img src="https://badgen.now.sh/npm/dm/TODO" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=uvu">
    <img src="https://packagephobia.now.sh/badge?p=uvu" alt="install size" />
  </a>
</div>

<div align="center"><b>U</b>TODO.<b>V</b>TODO.<b>U</b>TODO.</div>

## Features

* Super [lightweight](#load-time)
* Extremely [performant](#performance)
* Individually executable test files
* Supports `async`/`await` tests
* Supports native ES Modules
* Browser-Compatible
* Familiar API


## Install

```
$ npm install --save-dev uvu
```

## Usage

TODO: simple demo, link to examples

## Assertions

You may use any assertion library, including Node's native [`assert`](https://nodejs.org/api/assert.html) module! This works because `uvu` relies on thrown Errors to detect failures.

TODO: uncaught exceptions + unhandled rejections ==> assertion error
TODO: `assert` api docs

## API

### Assert

#### ok(actual: T, msg?: Message)
#### is(actual: T, expects: T, msg?: Message)
#### is.not(actual: T, expects: T, msg?: Message)
#### equal(actual: T, expects: T, msg?: Message)
#### type(actual: T, expects: Types, msg?: Message)
#### instance(actual: T, expects: T, msg?: Message)
#### snapshot(actual: T, expects: T, msg?: Message)
#### fixture(actual: T, expects: T, msg?: Message)
#### throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message)
#### unreachable(msg?: Message)
#### not(actual: T, msg?: Message)
#### not.ok(actual: T, msg?: Message)
#### not.equal(actual: T, expects: T, msg?: Message)
#### not.type(actual: T, expects: Types, msg?: Message)
#### not.instance(actual: T, expects: T, msg?: Message)
#### not.snapshot(actual: T, expects: T, msg?: Message)
#### not.fixture(actual: T, expects: T, msg?: Message)
#### not.throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message)

### Suite

#### (name: string, test: Callback)
#### only(name: string, test: Callback)
#### skip(name?: string, test?: Callback)
#### before(hook: Callback)
#### after(hook: Callback)
#### run()


## Benchmarks

> via the [`/bench`](/bench) directory with Node v10.13.0

Below you'll find each test runner with two timing values:

* the `took ___` value is the total process execution time – from startup to termination
* the parenthesis value (`(___)`) is the self-reported execution time, if known

Each test runner's `stdout` is printed to the console to verify all assertions pass. That output is excluded below for brevity.

```
~> "jest"  took  1,630ms  (861  ms)
~> "mocha" took    215ms  (  3  ms)
~> "tape"  took    132ms  (  ???  )
~> "uvu"   took     74ms  (  1.4ms)
```


## License

MIT © [Luke Edwards](https://lukeed.com)
