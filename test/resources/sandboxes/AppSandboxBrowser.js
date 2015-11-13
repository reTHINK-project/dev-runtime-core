import MiniBus from '../../../src/bus/MiniBus';

class AppSandboxBrowser extends MiniBus {

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
