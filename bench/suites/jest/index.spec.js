const math = require('../../math');

describe('sum', () => {
	it('should be a function', () => {
		expect(typeof math.sum).toBe('function');
	});

	it('should compute values correctly', () => {
		expect(math.sum(1, 2)).toBe(3);
		expect(math.sum(-1, -2)).toBe(-3);
		expect(math.sum(-1, 1)).toBe(0);
	});
});

describe('div', () => {
	it('should be a function', () => {
		expect(typeof math.div).toBe('function');
	});

	it('should compute values correctly', () => {
		expect(math.div(1, 2)).toBe(0.5);
		expect(math.div(-1, -2)).toBe(0.5);
		expect(math.div(-1, 1)).toBe(-1);
	});
});

describe('mod', () => {
	it('should be a function', () => {
		expect(typeof math.mod).toBe('function');
	});

	it('should compute values correctly', () => {
		expect(math.mod(1, 2)).toBe(1);
		expect(math.mod(-3, -2)).toBe(-1);
		expect(math.mod(7, 4)).toBe(3);
	});
});
