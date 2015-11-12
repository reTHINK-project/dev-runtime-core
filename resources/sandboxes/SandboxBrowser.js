import MiniBus from '../../src/bus/MiniBus';

// Mockup code, for tests;
class SandboxBrowser extends MiniBus {

  constructor() {
    super();
    console.log('Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {

    let _this = this;

    let minibus = new MiniBus();
    minibus._onPostMessage = function(msg) {
      console.log('POST MESSAGE REPLAY: ', msg);
      _this._onMessage(msg);
    };

    _this.minibus = minibus;

    // TODO: Evaluate the code;
    eval(sourceCode);

    // Instatiate the VertxProtoStub;
    let vertxProtoStub = new VertxProtoStub(componentURL, minibus, configuration);

    window.vertx = vertxProtoStub;

    return new Promise(function(resolve, reject) {

      resolve('deployed');
    });

  }

  _onPostMessage(msg) {
    let _this = this;
    console.log('_onPostMessage: ', JSON.stringify(msg));
    _this.minibus._onMessage(msg);
  }

}

export default SandboxBrowser;
