# `uvu/spy`

The `uvu/spy` module contains functions to spy on function calls and their arguments. You can use it to verify if a callback function is correctly invoked with the expected arguments.

```js
import { test } from 'uvu';
import * as assert from 'uvu/assert';
import { spy } from 'uvu/spy';

test('check if function is called twice', () => {
  const testFunction = spy((a, b) => a + b);

  add(1, 2);
  add(3, 4);

  // Check if called twice
  assert.is(testFunction.calls.length, 2);

  // Check return value of 1st call
  assert.is(testFunction.calls[0].return, 3);

  // Check arguments of 2nd call
  assert.equal(testFunction.calls[1].args, [3, 4]);
});

test.run();
```
