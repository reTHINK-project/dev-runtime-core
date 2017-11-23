import Sandbox from '../../../src/sandbox/Sandbox';

// Mockup code for testing
class AppSandboxBrowser extends Sandbox {

  constructor() {
    super();
    console.log('App Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {

    let _this = this;

    return new Promise(function(resolve, reject) {
      resolve('deployed');
    });

  }

}

export default AppSandboxBrowser;
