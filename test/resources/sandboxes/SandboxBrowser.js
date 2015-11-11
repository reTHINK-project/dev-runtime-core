// Mockup code, for tests;
class SandboxBrowser {

  constructor() {
    console.log('Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {
    return new Promise(function(resolve, reject) {
      resolve('deployed');
    });
  }

}

export default SandboxBrowser;
