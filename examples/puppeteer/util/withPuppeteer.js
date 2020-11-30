import Chrome from 'puppeteer';

export default function withPuppeteer (suite) {
  // Launch the browser
  // Add `browser` and `page` to context
  suite.before(async context => {
    context.browser = await Chrome.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' });
    context.page = await context.browser.newPage();
  });

  // Close everything on suite completion
  suite.after(async context => {
    await context.page.close();
    await context.browser.close();
  });

  return suite
}



