import { JSDOM } from 'jsdom';
import * as Preact from 'preact';
import { act } from 'preact/test-utils';

const { window } = new JSDOM('<main></main>');

export function setup() {
	// @ts-ignore
	global.window = window;
	global.document = window.document;
	global.navigator = window.navigator;
	global.getComputedStyle = window.getComputedStyle;
	global.requestAnimationFrame = null;
}

export function reset() {
	window.document.title = '';
	window.document.head.innerHTML = '';
	window.document.body.innerHTML = '<main></main>';
}

/**
 * @typedef RenderOutput
 * @property container {HTMLElement}
 * @property component {Preact.VNode}
 */

/**
 * @return {RenderOutput}
 */
export function render(Tag, props = {}) {
	const container = window.document.querySelector('main');
	const component = Preact.h(Tag, props);
	Preact.render(component, container)
	return { container, component };
}

/**
 * @param {HTMLElement} elem
 * @param {String} event
 * @param {any} [details]
 */
export async function fire(elem, event, details) {
	await act(() => {
		let evt = new window.Event(event, details);
		elem.dispatchEvent(evt);
	});
}
