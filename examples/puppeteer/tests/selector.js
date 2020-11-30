import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import puppeteer from 'puppeteer'

const Selector = suite('selector')

// Launch the browser, then add the browser and page to your
// suite's context for easy access in tests.
Selector.before(async context => {
  const browser = await puppeteer.launch(),
        page = (await browser.pages())[0]

  context.puppeteer = { browser, page }
})

// Close the browser after all tests have run.
Selector.after(async ({ puppeteer: { browser }}) => {
  await browser.close()
})

Selector('can select elements!', async ({ puppeteer: { page } }) => {
  await page.goto('http://example.com/')
  
  const textContent = await page.evaluate(() => {
    return document.querySelector('h1').textContent
  })

  assert.ok(textContent)
})

Selector.run()
