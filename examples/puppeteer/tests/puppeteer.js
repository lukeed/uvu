import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import puppeteer from 'puppeteer'

const Puppeteer = suite('puppeteer')

// Launch the browser, then add the browser and page to your
// suite's context for easy access in tests.
Puppeteer.before(async context => {
  const browser = await puppeteer.launch(),
        page = (await browser.pages())[0]

  context.puppeteer = { browser, page }
})

// Close the browser after all tests have run.
Puppeteer.after(async ({ puppeteer: { browser }}) => {
  await browser.close()
})

Puppeteer('can fetch data!', async ({ puppeteer: { page } }) => {
  const fetchedData = await page.evaluate(async () => {
    const result = await fetch('https://httpbin.org/get')
    return await result.json()
  })

  assert.ok(fetchedData)
})

Puppeteer('can select elements!', async ({ puppeteer: { page } }) => {
  await page.goto('http://example.com/')
  
  const textContent = await page.evaluate(() => {
    return document.querySelector('h1').textContent
  })

  assert.ok(textContent)
})

Puppeteer.run()
