import Sandbox from '../../../src/sandbox/Sandbox';

// Mockup code for testing
class SandboxBrowser extends Sandbox {

  constructor() {
    super();
    console.log('Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {
    return new Promise(function(resolve, reject) {
      resolve('deployed');
    });
  }

}

export default SandboxBrowser;
