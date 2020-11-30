import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import Chrome from 'puppeteer';

const puppeteer = suite('puppeteer');

// Launch the browser
// Add `browser` and `page` to context
puppeteer.before(async context => {
	context.browser = await Chrome.launch();
	context.page = await context.browser.newPage();
});

// Close everything on suite completion
puppeteer.after(async context => {
	await context.page.close();
	await context.browser.close();
});

puppeteer('can fetch data!', async context => {
  const data = await context.page.evaluate(() => {
    return fetch('https://httpbin.org/get').then(r => r.json());
	});
	assert.type(data, 'object');
	assert.is(data.url, 'https://httpbin.org/get');
})

puppeteer('can select elements!', async context => {
  await context.page.goto('http://example.com/');

  const text = await context.page.evaluate(() => {
    return document.querySelector('h1').textContent;
  });

  assert.type(text, 'string');
  assert.is(text, 'Example Domain');
});

puppeteer.run();
