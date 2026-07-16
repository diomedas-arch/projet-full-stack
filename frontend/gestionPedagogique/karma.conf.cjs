const os = require('node:os');
const path = require('node:path');

module.exports = function configureKarma(config) {
  config.set({
    frameworks: ['jasmine'],
    plugins: [require('karma-jasmine'), require('karma-chrome-launcher'), require('karma-jasmine-html-reporter')],
    reporters: ['progress'],
    browsers: ['ChromeHeadlessNoSandbox'],
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          '--disable-software-rasterizer',
          '--disable-background-networking',
          '--disable-extensions',
          `--user-data-dir=${path.join(os.tmpdir(), `karma-chrome-${Date.now()}`)}`
        ]
      }
    }
  });
};
