import { type BrowserContext, test as base, chromium } from '@playwright/test';

process.env.PW_CHROMIUM_ATTACH_TO_OTHER = '1';

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({ context }, use) => {
    const pathToExtension = require('path').join(__dirname, '../../../build');
    // const userDataDir = '/tmp/test-user-data-dir';
    const userDataDir = '';
    const context_ = await chromium.launchPersistentContext(userDataDir, {
      headless: false,
      // slowMo: 2000, // uncomment to make tests run slower to debug
      args: [
        `--headless=new`, // experimental // comment out for headed mode
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context_);
    await context_.close();
  },
  extensionId: async ({ context }, use) => {
    let [background] = context.serviceWorkers();
    if (!background) background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});
export const expect = test.expect;
