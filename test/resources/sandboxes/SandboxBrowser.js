import MiniBus from '../../../src/bus/MiniBus';

class SandboxBrowser extends MiniBus {

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
