# `uvu/assert`

The `uvu/assert` module is a collection of assertion methods that, like `uvu` itself, work in Node.js _and_ browser contexts. Additionally, `uvu/assert` is _completely_ optional, allowing you to bring along existing favorites.

Because `uvu` operates through thrown `Error`s (or lack thereof), any `Error`-based utility can be used as an assertion. As a basic example, this is a completely valid `uvu` test:

```js
import { test } from 'uvu';

test('this will fail', () => {
  if (1 !== 2) throw new Error('Duh!');
});

test.run();
```

With this, `uvu` will register that the `"this will fail"` test failed.<br>You will only be missing the detailed insights (aka, pretty diff'ing) that the included [`Assertion`](#assertionoptions) errors provide.

## API

> For all API methods listed: <br>
> * `T` represents any data type <br>
> * `Message` can be a string (for custom assertion message) or an `Error` instance

### ok(actual: T, msg?: Message)
Assert that `actual` is a truthy value.

```js
assert.ok(12345);
assert.ok(!false);
assert.ok('hello');
```

### is(actual: T, expects: T, msg?: Message)
Assert that `actual` strictly equals (`===`) the `expects` value.

```js
assert.is('hello', 'hello');

const arr = [1, 2, 3];
assert.is(arr, [1, 2, 3]); //=> fails
assert.is(arr, arr); //=> pass
```

### is.not(actual: T, expects: T, msg?: Message)
Assert that `actual` does _not_ strictly equal (`===`) the `expects` value.

```js
assert.is.not(123, '123');
assert.is.not(true, false);
```

### equal(actual: T, expects: T, msg?: Message)
Assert that `actual` is deeply equal to the `expects` value.<br>Visit [`dequal`](https://github.com/lukeed/dequal) for more information.

```js
const input = {
  foo: 123,
  bar: [4, 5, 6]
};

assert.equal(input, {
  foo: 123,
  bar: [4, 5, 6]
});
```

### type(actual: T, expects: Types, msg?: Message)
Assert that `typeof actual` is equal to the `expects` type.<br>Available `Types` are: `string`, `number`, `boolean`, `object`, `undefined`, and `function`.

```js
assert.type(123, 'number');
assert.type('hello', 'string');
assert.type(assert.type, 'function');
```

### instance(actual: T, expects: T, msg?: Message)
Assert that `actual` is an `instanceof` the `expects` constructor.

```js
assert.instance(new Date, Date);
assert.instance([1, 2, 3], Array);
assert.instance(/foobar/gi, RegExp);
```

### match(actual: string, expects: RegExp | String, msg?: Message)
Assert that `actual` matches the `expects` regular expression.

```js
assert.match('hello world', 'wor');
assert.match('hello world', /hello/g);
assert.match('hello world', RegExp('hello'));
```

### snapshot(actual: string, expects: string, msg?: Message)
Assert that `actual` matches the `expects` multi-line string.

```js
assert.snapshot(
  JSON.stringify({ foo: 123 }, null, 2),
  `{\n  "foo": 123\n}`
);
```

### fixture(actual: string, expects: string, msg?: Message)
Assert that `actual` matches the `expects` multi-line string.<br>Equivalent to `assert.snapshot` except that line numbers are printed in the error diff!

```js
assert.fixture(
  JSON.stringify({ foo: 123, bar: 456 }, null, 2),
  fs.readFileSync('fixture.json', 'utf8')
);
```

### throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message)
Assert that the `fn` function throws an Error.

When `expects` is not defined, then _any_ Error thrown satisfies the assertion.<br>
When `expects` is a string, then the `Error`'s message must contain the `expects` string.<br>
When `expects` is a function, then `expects` will receive the thrown `Error` and must return a `boolean` determination.

Since `expects` is optional, you may also invoke the `assert.throws(fn, msg)` signature.

```js
const OOPS = () => (null)[0];

assert.throws(() => OOPS());
assert.throws(() => OOPS(), /Cannot read property/);
assert.throws(() => OOPS(), err => err instanceof TypeError);
```

### unreachable(msg?: Message)
Assert that a line should never be reached.

```js
try {
  throw new Error('Oops');
  assert.unreachable('I will not run');
} catch (err) {
  assert.is(err.message, 'Oops');
}
```

### not(actual: T, msg?: Message)
Assert that `actual` is falsey.

```js
assert.not(0);
assert.not(null);
assert.not(false);
```

### not.ok(actual: T, msg?: Message)
Assert that `actual` is not truthy. <br>This is an alias for `assert.not`.

### not.equal(actual: T, expects: T, msg?: Message)
Assert that `actual` does not deeply equal the `expects` value.<br>Visit [`dequal`](https://github.com/lukeed/dequal) for more information.

```js
const input = {
  foo: 123,
  bar: [4, 5, 6]
};

assert.not.equal(input, {
  foo: 123
});
```

### not.type(actual: T, expects: Types, msg?: Message)
Assert that `typeof actual` is not equal to the `expects` type.<br>Available `Types` are: `string`, `number`, `boolean`, `object`, `undefined`, and `function`.

```js
assert.not.type(123, 'object');
assert.not.type('hello', 'number');
assert.not.type(assert.type, 'undefined');
```

### not.instance(actual: T, expects: T, msg?: Message)
Assert that `actual` is not an `instanceof` the `expects` constructor.

```js
assert.not.instance(new Date, Number);
assert.not.instance([1, 2, 3], String);
assert.not.instance(/foobar/gi, Date);
```

### not.snapshot(actual: string, expects: string, msg?: Message)
Assert that `actual` does not match the `expects` snapshot.

```js
assert.not.snapshot(
  JSON.stringify({ foo: 123 }, null, 2),
  `{"foo":123,"bar":456}`
);
```

### not.fixture(actual: string, expects: string, msg?: Message)
Assert that `actual` does not match the `expects` multi-line string.<br>Equivalent to `assert.not.snapshot` except that line numbers are printed in the error diff!

```js
assert.not.fixture(
  JSON.stringify({ foo: 123, bar: 456 }, null, 2),
  fs.readFileSync('fixture.json', 'utf8')
);
```

### not.throws(fn: Function, expects?: Message | RegExp | Function, msg?: Message)
Assert that the `fn` function does not throw, _or_ does not throw of `expects` type.

```js
const PASS = () => {};
const FAIL = () => {
  throw new Error('Oops');
};

assert.not.throws(() => PASS()); //=> pass
assert.not.throws(() => FAIL()); //=> fails
assert.not.throws(() => FAIL(), /Oops/); //=> pass
assert.not.throws(() => FAIL(), /foobar/); //=> fails
assert.not.throws(() => FAIL(), err => err.message.length > 0); //=> pass
```

### Assertion(options)

The base `Assertion` class, which extends `Error` directly.

Internally, `uvu` checks if thrown errors are `Assertion` errors as part of its formatting step.

#### options.message
Type: `string`<br>
Required: `true`

The error message to print.

> **Note:** By default, this is the generated default from each `uvu/assert` method.

#### options.details
Type: `string`<br>
Required: `false`

<!-- TODO: link -->
The detailed diff output, as generated by `uvu/diff`.

#### options.generated
Type: `boolean`<br>
Required: `false`

If the `options.message` was generated. <br>This will be `false` when an `uvu/assert` method received a custom message.

#### options.operator
Type: `string`<br>
Required: `true`

The assertion method name.

#### options.expects
Type: `any`<br>
Required: `true`

The expected value.

#### options.actual;
Type: `any`<br>
Required: `true`

The actual value.
