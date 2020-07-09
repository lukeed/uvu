# `uvu`

This is the main module. All `uvu` tests require that either [`suite`](#uvusuitename-string) or [`test`](#uvutestname-string-callback-function) (or both) be imported.

You may declare multiple [`Suites`](#suites) in the same file. This helps with organization as it group test output in a more readable fashion and allows related items to remain neighbors.

You should choose `uvu.suite` if/when you'd like to leverage the additional organization. <br>You should choose `uvu.test` if you don't care about organization and/or are only planning on testing a single entity.

There is no penalty for choosing `uvu.suite` vs `uvu.test`. In fact, `uvu.test` _is_ an unnamed [Suite](#suites)!

No matter which you choose, the Suite's [`run`](#suiterun) must be called in order for it to be added to `uvu`'s queue.

> **Note:** Because of this API decision, `uvu` test files can be executed with `node` directly!

## API

### uvu.suite(name: string)
Returns: [`Suite`](#suites)

Creates a new `Suite` instance.

Of course, you may have multiple `Suite`s in the same file.<br>However, you must remember to call `run()` on each suite!

### uvu.test(name: string, callback: function)
Returns: `void`

If you don't want to separate your tests into groups (aka, "suites") – or if you don't plan on testing more than one thing in a file – then you may want to import `test` for simplicity sake (naming is hard).

> **Important:** The `test` export is just an unnamed [`Suite`](#suites) instance!

#### name
Type: `String`

The name of your test. <br>Choose a descriptive name as it identifies failing tests.

#### callback
Type: `Function<any>` or `Promise<any>`

The callback that contains your test code. <br>Your callback may be asynchronous and may `return` any value, although returned values are discarded completely and have no effect.


## Suites

All `uvu` test suites share the same API and can be used in the same way.

In fact, `uvu.test` is actually the result of unnamed `uvu.suite` call! <br>The only difference between them is how their results are grouped and displayed in your terminal window.

***API***

### suite(name, callback)
Every suite instance is callable. <br>This is the standard usage.

### suite.only(name, callback)
For this `suite`, only run this test. <br>This is a shortcut for isolating one (or more) test blocks.

> **Note:** You can invoke `only` on multiple tests!

### suite.skip(name, callback)
Skip this test block entirely.

### suite.before(callback)
Invoke the provided `callback` before this suite begins. <br>This is ideal for creating fixtures or setting up an environment.

### suite.after(callback)
Invoke the provided `callback` after this suite finishes. <br>This is ideal for fixture or environment cleanup.

### suite.before.each(callback)
Invoke the provided `callback` before each test of this suite begins.

### suite.after.each(callback)
Invoke the provided `callback` after each test of this suite finishes.

### suite.run()
Start/Add the suite to the `uvu` test queue.

> **Important:** You **must** call this method in order for your suite to be run!

<!-- TODO?: ***Hooks*** -->

***Example***

> Check out [`/examples`](/examples) for a list of working demos!

```js
import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as dates from '../src/dates';

const Now = suite('Date.now()');

let _Date;
Now.before(() => {
  let count = 0;
  _Date = global.Date;
  global.Date = { now: () => 100 + count++ };
});

Now.after(() => {
  global.Date = _Date;
});

// this is not run (skip)
Now.skip('should be a function', () => {
  assert.type(Date.now, 'function');
});

// this is not run (only)
Now('should return a number', () => {
  assert.type(Date.now(), 'number');
});

// this is run (only)
Now.only('should progress with time', () => {
  assert.is(Date.now(), 100);
  assert.is(Date.now(), 101);
  assert.is(Date.now(), 102);
});

Now.run();
```
