import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { cleanup, render, fireEvent, screen } from 'solid-testing-library';

import { Count } from '../src/Count';

const isInDom = (node: Node): boolean => !!node.parentNode &&
  (node.parentNode === document || isInDom(node.parentNode));

test.after.each(cleanup);

test('should render with "5" by default', () => {
	const { container } = render(() => <Count />);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>5</span><button>++</button>`
	);
});

test('should accept custom `count` prop', () => {
	const { container } = render(() => <Count count={99} />);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>99</span><button>++</button>`
	);
});

test('should increment count after `button#incr` click', async () => {
	const { container } = render(() => <Count />);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>5</span><button>++</button>`
	);

	const button = await screen.findByRole(
		'button', { name: '++' }
	)

	assert.ok(isInDom(button));
	fireEvent.click(button);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>6</span><button>++</button>`
	);
});

test('should decrement count after `button#decr` click', async () => {
	const { container } = render(() => <Count />);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>5</span><button>++</button>`
	);

	const button = await screen.findByRole(
		'button', { name: /--/ }
	)

	assert.ok(isInDom(button));
	fireEvent.click(button);

	assert.snapshot(
		container.innerHTML,
		`<button>--</button><span>4</span><button>++</button>`
	);
});

test.run();
