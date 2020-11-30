import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import withPuppeteer from '../util/withPuppeteer.js'

const util = withPuppeteer(suite('util'));

util.before.each(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

util('capitalize', async ({ page }) => {
  let value

  value = await page.evaluate(() => typeof window.__UTILS__.capitalize);
  assert.is(value, 'function');
  
  value = await page.evaluate(() => window.__UTILS__.capitalize('hello'));
  assert.is(value, 'Hello');

  value = await page.evaluate(() => window.__UTILS__.capitalize('foo bar'));
  assert.is(value, 'Foo bar');
});

util('dashify', async ({ page }) => {
  let value

  value = await page.evaluate(() => typeof window.__UTILS__.dashify)
  assert.is(value, 'function');
  
  value = await page.evaluate(() => window.__UTILS__.dashify('fooBar'))
  assert.is(value, 'foo-bar');
  
  value = await page.evaluate(() => window.__UTILS__.dashify('FooBar'))
  assert.is(value, 'foo-bar');
  
  value = await page.evaluate(() => window.__UTILS__.dashify('foobar'))
  assert.is(value, 'foobar');
});

util.run()
