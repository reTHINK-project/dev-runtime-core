class AppSandboxBrowser {

  constructor() {
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
