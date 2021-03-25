const { test } = require('tap');
const math = require('../../math');

test('sum', t => {
	t.equal(typeof math.sum, 'function');
	t.equal(math.sum(1, 2), 3);
	t.equal(math.sum(-1, -2), -3);
	t.equal(math.sum(-1, 1), 0);
	t.end();
});

test('div', t => {
	t.equal(typeof math.div, 'function');
	t.equal(math.div(1, 2), 0.5);
	t.equal(math.div(-1, -2), 0.5);
	t.equal(math.div(-1, 1), -1);
	t.end();
});

test('mod', t => {
	t.equal(typeof math.mod, 'function');
	t.equal(math.mod(1, 2), 1);
	t.equal(math.mod(-3, -2), -1);
	t.equal(math.mod(7, 4), 3);
	t.end();
});
