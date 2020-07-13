import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from './setup/env';

// Must be require() –> setup/register
const Count = require('../src/Count.svelte').default;

test.before(ENV.setup);
test.before.each(ENV.reset);

test('should render with "5" by default', () => {
	const component = ENV.render(Count);

	assert.is(component.$$.ctx[0], 5);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
	);
});

test('should accept custom `count` prop', () => {
	const component = ENV.render(Count, { count: 99 });
	assert.is(component.$$.ctx[0], 99);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>99</span> <button id="incr">++</button>`
	);
});

test('should increment count after `button#incr` click', async () => {
	ENV.render(Count);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
	);

	await ENV.fire(
		document.querySelector('#incr'),
		'click'
	);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>6</span> <button id="incr">++</button>`
	);
});

test('should decrement count after `button#decr` click', async () => {
	ENV.render(Count);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>5</span> <button id="incr">++</button>`
	);

	await ENV.fire(
		document.querySelector('#decr'),
		'click'
	);

	assert.snapshot(
		document.body.innerHTML,
		`<button id="decr">--</button> <span>4</span> <button id="incr">++</button>`
	);
});

test.run();
