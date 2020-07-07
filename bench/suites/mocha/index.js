const assert = require('assert');
const math = require('../../math');

describe('sum', () => {
	it('should be a function', () => {
		assert.equal(typeof math.sum, 'function');
	});

	it('should compute result correctly', () => {
		assert.equal(math.sum(1, 2), 3);
		assert.equal(math.sum(-1, -2), -3);
		assert.equal(math.sum(-1, 1), 0);
	});
});

describe('div', () => {
	it('should be a function', () => {
		assert.equal(typeof math.div, 'function');
	});

	it('should compute result correctly', () => {
		assert.equal(math.div(1, 2), 0.5);
		assert.equal(math.div(-1, -2), 0.5);
		assert.equal(math.div(-1, 1), -1);
	});
});

describe('mod', () => {
	it('should be a function', () => {
		assert.equal(typeof math.mod, 'function');
	});

	it('should compute result correctly', () => {
		assert.equal(math.mod(1, 2), 1);
		assert.equal(math.mod(-3, -2), -1);
		assert.equal(math.mod(7, 4), 3);
	});
});
