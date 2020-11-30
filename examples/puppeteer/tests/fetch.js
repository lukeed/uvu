import { suite } from 'uvu'
import * as assert from 'uvu/assert'
import puppeteer from 'puppeteer'

const Fetch = suite('fetch')

// Launch the browser, then add the browser and page to your
// suite's context for easy access in tests.
Fetch.before(async context => {
  const browser = await puppeteer.launch(),
        page = (await browser.pages())[0]

  context.puppeteer = { browser, page }
})

// Close the browser after all tests have run.
Fetch.after(async ({ puppeteer: { browser }}) => {
  await browser.close()
})

Fetch('can fetch data!', async ({ puppeteer: { page } }) => {
  const fetchedData = await page.evaluate(async () => {
    const result = await fetch('https://httpbin.org/get')
    return await result.json()
  })

  assert.ok(fetchedData)
})

Fetch.run()
