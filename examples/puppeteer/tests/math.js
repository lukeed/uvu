import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from './setup/puppeteer.js'

const sum = suite('sum');
sum.before(ENV.setup);
sum.before.each(ENV.homepage);
sum.after(ENV.reset);

sum('should be a function', async context => {
	assert.is(
		await context.page.evaluate(() => typeof window.__MATH__.sum),
		'function'
	);
});

sum('should compute values', async context => {
	const { page } = context;

	assert.is(await page.evaluate(() => window.__MATH__.sum(1, 2)), 3);
	assert.is(await page.evaluate(() => window.__MATH__.sum(-1, -2)), -3);
	assert.is(await page.evaluate(() => window.__MATH__.sum(-1, 1)), 0);
});

sum.run();

// ---

const div = suite('div');
div.before(ENV.setup);
div.before.each(ENV.homepage);
div.after(ENV.reset);

div('should be a function', async context => {
	assert.is(
		await context.page.evaluate(() => typeof window.__MATH__.div),
		'function'
	);
});

div('should compute values', async context => {
	const { page } = context;

	assert.is(await page.evaluate(() => window.__MATH__.div(1, 2)), 0.5);
	assert.is(await page.evaluate(() => window.__MATH__.div(-1, -2)), 0.5);
	assert.is(await page.evaluate(() => window.__MATH__.div(-1, 1)), -1);
});

div.run();

// ---

const mod = suite('mod');
mod.before(ENV.setup);
mod.before.each(ENV.homepage);
mod.after(ENV.reset);

mod('should be a function', async context => {
	assert.is(
		await context.page.evaluate(() => typeof window.__MATH__.mod),
		'function'
	);
});

mod('should compute values', async context => {
	const { page } = context;

	assert.is(await page.evaluate(() => window.__MATH__.mod(1, 2)), 1);
	assert.is(await page.evaluate(() => window.__MATH__.mod(-1, -2)), -1);
	assert.is(await page.evaluate(() => window.__MATH__.mod(7, 4)), 3);
});

mod.run();
