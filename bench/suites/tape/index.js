const test = require('tape');
const math = require('../../math');

test('sum', t => {
	t.is(typeof math.sum, 'function');
	t.is(math.sum(1, 2), 3);
	t.is(math.sum(-1, -2), -3);
	t.is(math.sum(-1, 1), 0);
	t.end();
});

test('div', t => {
	t.is(typeof math.div, 'function');
	t.is(math.div(1, 2), 0.5);
	t.is(math.div(-1, -2), 0.5);
	t.is(math.div(-1, 1), -1);
	t.end();
});

test('mod', t => {
	t.is(typeof math.mod, 'function');
	t.is(math.mod(1, 2), 1);
	t.is(math.mod(-3, -2), -1);
	t.is(math.mod(7, 4), 3);
	t.end();
});
