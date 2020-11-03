# `uvu`

This is the main module. All `uvu` tests require that either [`suite`](#uvusuitename-string) or [`test`](#uvutestname-string-callback-function) (or both) be imported.

You may declare multiple [`Suites`](#suites) in the same file. This helps with organization as it group test output in a more readable fashion and allows related items to remain neighbors.

You should choose `uvu.suite` if/when you'd like to leverage the additional organization. <br>You should choose `uvu.test` if you don't care about organization and/or are only planning on testing a single entity.

There is no penalty for choosing `uvu.suite` vs `uvu.test`. In fact, `uvu.test` _is_ an unnamed [Suite](#suites)!

No matter which you choose, the Suite's [`run`](#suiterun) must be called in order for it to be added to `uvu`'s queue.

> **Note:** Because of this API decision, `uvu` test files can be executed with `node` directly!

## API

### uvu.suite<T>(name: string, context?: T)
Returns: [`Suite`](#suites)

Creates a new `Suite` instance.

Of course, you may have multiple `Suite`s in the same file.<br>However, you must remember to call `run()` on each suite!

#### name
Type: `String`

The name of your suite. <br>This groups all console output together and will prefix the name of any failing test.

#### context
Type: `any`<br>
Default: `{}`

The suite's initial [context](#context-1) value, if any. <br>This will be passed to every [hook](#hooks) and to every test block within the suite.

> **Note:** Before v0.4.0, `uvu` attempted to provide read-only access within test handlers. Ever since, `context` is writable/mutable anywhere it's accessed.

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
Invoke the provided `callback` before this suite begins. <br>This is ideal for creating fixtures or setting up an environment. <br>Please see [Hooks](#hooks) for more information.

### suite.after(callback)
Invoke the provided `callback` after this suite finishes. <br>This is ideal for fixture or environment cleanup. <br>Please see [Hooks](#hooks) for more information.

### suite.before.each(callback)
Invoke the provided `callback` before each test of this suite begins. <br>Please see [Hooks](#hooks) for more information.

### suite.after.each(callback)
Invoke the provided `callback` after each test of this suite finishes. <br>Please see [Hooks](#hooks) for more information.

### suite.run()
Start/Add the suite to the `uvu` test queue.

> **Important:** You **must** call this method in order for your suite to be run!

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


## Hooks

Your suite can implement "hooks" that run before and/or after the entire suite, as well as before and/or after the suite's individual tests.

It may be useful to use `suite.before` and `suite.after` to set up and teardown suite-level assumptions like:

* environment variables
* database clients and/or seed data
* generating fixtures
* mocks, spies, etc

It may be appropriate to use `suite.before.each` and `suite.after.each` to reset parts of suite's context, or for passing values between tests. This may include &mdash; but of course, is not limited to &mdash; rolling back database transactions, restoring a mocked function, etc.

> **Important:** Any `after` and `after.each` hooks will _always_ be invoked – including after failed assertions.

Additionally, as of `uvu@0.3.0`, hooks receive the suite's `context` value. They are permitted to modify the `context` value directly, allowing you to organize and abstract hooks into reusable setup/teardown blocks. Please read [Context](#context-1) for examples and more information.

***Example: Lifecycle***

The following implements all available hooks so that their call patterns can be recorded:

```js
test.before(() => {
  console.log('SETUP');
});

test.after(() => {
  console.log('CLEANUP');
});

test.before.each(() => {
  console.log('>> BEFORE');
});

test.after.each(() => {
  console.log('>> AFTER');
});

// ---

test('foo', () => {
  console.log('>>>> TEST: FOO');
});

test('bar', () => {
  console.log('>>>> TEST: BAR');
});

test.run();

// SETUP
// >> BEFORE
// >>>> TEST: FOO
// >> AFTER
// >> BEFORE
// >>>> TEST: BAR
// >> AFTER
// CLEANUP
```


## Context

When using [suite hooks](#hooks) to establish and reset environments, there's often some side-effect that you wish to make accessible to your tests. For example, this may be a HTTP client, a database table record, a JSDOM instance, etc.

Typically, these side-effects would have to be saved into top-level variables that so that all parties involved can access them. The following is an example of this pattern:

```js
const User = suite('User');

let client, user;

User.before(async () => {
  client = await DB.connect();
});

User.before.each(async () => {
  user = await client.insert('insert into users ... returning *');
});

User.after.each(async () => {
  await client.destroy(`delete from users where id = ${user.id}`);
  user = undefined;
});

User.after(async () => {
  client = await client.end();
});

User('should not have Teams initially', async () => {
  const teams = await client.select(`
    select id from users_teams
    where user_id = ${user.id};
  `);

  assert.is(teams.length, 0);
});

// ...

User.run();
```

While this certainly works, it can quickly become unruly once multiple suites exist within the same file. Additionally, it **requires** that all our suite hooks (`User.before`, `User.before.each`, etc) are defined within this file so that they may have access to the `user` and `client` variables that they're modifying.

Instead, we can improve this by writing into the suite's "context" directly!

> **Note:** If it helps your mental model, "context" can be interchanged with "state" – except that it's intended to umbrella the tests with a certain environment.

```js
const User = suite('User');

User.before(async context => {
  context.client = await DB.connect();
});

User.before.each(async context => {
  context.user = await context.client.insert('insert into users ... returning *');
});

User.after.each(async context => {
  await context.client.destroy(`delete from users where id = ${user.id}`);
  context.user = undefined;
});

User.after(async context => {
  context.client = await context.client.end();
});

// <insert tests>

User.run();
```

A "context" is unique to each suite and can be defined through [`suite()`](#uvusuitename-string) initialization and/or modified by the suite's hooks. Because of this, hooks can be abstracted into separate files and then attached safely to different suites:

```js
import * as $ from './helpers';

const User = suite('User');

// Reuse generic/shared helpers
// ---

User.before($.DB.connect);
User.after($.DB.destroy);

// Keep User-specific helpers in this file
// ---

User.before.each(async context => {
  context.user = await context.client.insert('insert into users ... returning *');
});

User.after.each(async context => {
  await context.client.destroy(`delete from users where id = ${user.id}`);
  context.user = undefined;
});

// <insert tests>

User.run()
```

Individual tests will also receive the `context` value. This is how tests can access the HTTP client or database fixture you've set up, for example.

Here's an example `User` test, now acessing its `user` and `client` values from context instead of globally-scoped variables:

```js
User('should not have Teams initially', async context => {
  const { client, user } = context;

  const teams = await client.select(`
    select id from users_teams
    where user_id = ${user.id};
  `);

  assert.is(teams.length, 0);
});
```

***TypeScript***

Finally, TypeScript users can easily define their suites' contexts on a suite-by-suite basis.

Let's revisit our initial example, now using context and TypeScript interfaces:

```ts
interface Context {
  client?: DB.Client;
  user?: IUser;
}

const User = suite<Context>('User', {
  client: undefined,
  user: undefined,
});

// Our `context` is type-checked
// ---

User.before(async context => {
  context.client = await DB.connect();
});

User.after(async context => {
  context.client = await context.client.end();
});

User.before.each(async context => {
  context.user = await context.client.insert('insert into users ... returning *');
});

User.after.each(async context => {
  await context.client.destroy(`delete from users where id = ${user.id}`);
  context.user = undefined;
});

// Our `context` is *still* type-checked 🎉
User('should not have Teams initially', async context => {
  const { client, user } = context;

  const teams = await client.select(`
    select id from users_teams
    where user_id = ${user.id};
  `);

  assert.is(teams.length, 0);
});

User.run();
```
