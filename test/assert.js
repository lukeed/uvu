import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as $ from '../src/assert';

const Assertion = suite('Assertion');

Assertion('should extend Error', () => {
	assert.instance(new $.Assertion(), Error);
});

Assertion.run();
