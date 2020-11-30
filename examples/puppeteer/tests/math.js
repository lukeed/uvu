import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import withPuppeteer from '../util/withPuppeteer.js'

const math = withPuppeteer(suite('math'));

math.before.each(async ({ page }) => {
  await page.goto('http://localhost:3000')
})

math('sum', async ({ page }) => {
  let value

  value = await page.evaluate(() => typeof window.__MATH__.sum);
  assert.is(value, 'function');
  
  value = await page.evaluate(() => window.__MATH__.sum(1, 2));
  assert.is(value, 3);

  value = await page.evaluate(() => window.__MATH__.sum(-1, -2));
  assert.is(value, -3);

  value = await page.evaluate(() => window.__MATH__.sum(-1, 1));
  assert.is(value, 0);
});

math('div', async ({ page }) => {
  let value

  value = await page.evaluate(() => typeof window.__MATH__.div)
  assert.is(value, 'function');
  
  value = await page.evaluate(() => window.__MATH__.div(1, 2))
  assert.is(value, 0.5);
  
  value = await page.evaluate(() => window.__MATH__.div(-1, -2))
  assert.is(value, 0.5);
  
  value = await page.evaluate(() => window.__MATH__.div(-1, 1))
  assert.is(value, -1);
});

math('mod', async ({ page }) => {
  let value

  value = await page.evaluate(() => typeof window.__MATH__.mod)
  assert.is(value, 'function');
  
  value = await page.evaluate(() => window.__MATH__.mod(1, 2))
  assert.is(value, 1);
  
  value = await page.evaluate(() => window.__MATH__.mod(-3, -2))
  assert.is(value, -1);
  
  value = await page.evaluate(() => window.__MATH__.mod(7, 4))
  assert.is(value, 3);
});

math.run()
