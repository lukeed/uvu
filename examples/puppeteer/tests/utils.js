import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from './setup/puppeteer.js'

const capitalize = suite('capitalize');
capitalize.before(ENV.setup);
capitalize.before.each(ENV.homepage);
capitalize.after(ENV.reset);

capitalize('should be a function', async context => {
	assert.is(
		await context.page.evaluate(() => typeof window.__UTILS__.capitalize),
		'function'
	);
});

capitalize('should capitalize a word', async context => {
	assert.is(
		await context.page.evaluate(() => window.__UTILS__.capitalize('hello')),
		'Hello'
	);
});

capitalize('should only capitalize the 1st word', async context => {
	assert.is(
		await context.page.evaluate(() => window.__UTILS__.capitalize('foo bar')),
		'Foo bar'
	);
});

capitalize.run();

// ---

const dashify = suite('dashify');
dashify.before(ENV.setup);
dashify.before.each(ENV.homepage);
dashify.after(ENV.reset);

dashify('should be a function', async context => {
	assert.is(
		await context.page.evaluate(() => typeof window.__UTILS__.dashify),
		'function'
	);
});

dashify('should replace camelCase with dash-case', async context => {
	const { page } = context;
	assert.is(await page.evaluate(() => window.__UTILS__.dashify('fooBar')), 'foo-bar');
	assert.is(await page.evaluate(() => window.__UTILS__.dashify('FooBar')), 'foo-bar');
});

dashify('should ignore lowercase', async context => {
	const { page } = context;
	assert.is(await page.evaluate(() => window.__UTILS__.dashify('foobar')), 'foobar');
});

dashify.run();
