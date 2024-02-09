const { By, Key, until, Builder } = require('selenium-webdriver')
require('chromedriver')
const assert = require('assert')
const { buildDriver, goToHome, teardown, captureScreensFor } = require('../../utils')

const SSOHomePage = require('../../pageobjects/SSOHomePage')

describe('When UAA is down', function () {
  let driver
  let homePage
  let captureScreen

  before(async function () {
    driver = buildDriver()
    await goToHome(driver)
    homePage = new SSOHomePage(driver)
    captureScreen = captureScreensFor(driver, __filename)
  })

  it('should display warning message that UAA is down', async function () {
    await homePage.isLoaded()
    const message = await homePage.getWarning()
    assert.equal(true, message.startsWith('OAuth resource not available'))
    assert.equal(true, message.endsWith(' not reachable'))
  })

  it('should not be presented with a login button to log in', async function () {
    await homePage.isLoaded()
    if (await homePage.getLoginButton()) {
      throw new Error('Login buttton is present')
    }
  })

  after(async function () {
    await teardown(driver, this, captureScreen)
  })
})
