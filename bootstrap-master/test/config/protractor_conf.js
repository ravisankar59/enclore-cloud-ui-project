exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['../stories/boot.js'],
  capabilities: {
     browserName: 'firefox'
  },
  framework: 'mocha',
  baseUrl: 'http://localhost:8000',
  //defaultTimeoutInterval: 360000
    mochaOpts: {
    reporter: 'spec',
    timeout: 100000
  } 

};