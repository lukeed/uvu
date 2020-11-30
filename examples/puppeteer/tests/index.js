import { test } from 'uvu';
import * as assert from 'uvu/assert';
import * as ENV from './setup/puppeteer.js'

test.before(ENV.setup);
test.after(ENV.reset);

test('can fetch data!', async context => {
  const data = await context.page.evaluate(() => {
    return fetch('https://httpbin.org/get').then(r => r.json());
	});

	assert.type(data, 'object');
	assert.is(data.url, 'https://httpbin.org/get');
});

test('can select elements!', async context => {
  await context.page.goto('http://example.com/');

  const text = await context.page.evaluate(() => {
    return document.querySelector('h1').textContent;
  });

  assert.type(text, 'string');
  assert.is(text, 'Example Domain');
});

test.run();
