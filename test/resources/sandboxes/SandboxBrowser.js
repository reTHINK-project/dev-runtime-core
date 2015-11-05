// Mockup code, for tests;
class SandboxBrowser {

  constructor() {
    console.log('Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {

    // TODO: Evaluate the code;
    // eval(sourceCode);
    // let hello = new HelloHyperty();

    return new Promise(function(resolve, reject) {
      resolve('deployed');
    });
  }

}

export default SandboxBrowser;
