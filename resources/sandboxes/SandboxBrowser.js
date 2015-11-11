import MiniBus from '../../src/bus/MiniBus';

// Mockup code, for tests;
class SandboxBrowser extends MiniBus {

  constructor() {
    super();
    console.log('Sandbox Browser');
  }

  deployComponent(sourceCode, componentURL, configuration) {

    let _this = this;

    // TODO: Evaluate the code;
    eval(sourceCode);

    let vertxProtoStub = new VertxProtoStub('domain://msg-node.ua.pt/hyperty-address-allocation', this, configuration);

    window.vertx = vertxProtoStub;

    return new Promise(function(resolve, reject) {
      resolve('deployed');
    });

  }

  _onPostMessage(msg) {
    let _this = this;
    console.log('_onPostMessage: ', JSON.stringify(msg));

    // _this._onMessage(msg);
  }

}

export default SandboxBrowser;
