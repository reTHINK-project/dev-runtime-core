import MiniBus from '../../src/bus/MiniBus';
import Sandbox from '../../src/sandbox/Sandbox';
import SandboxRegistry from '../../src/sandbox/SandboxRegistry';

// Mockup code for testing
class AppSandboxBrowser extends Sandbox {

  constructor() {
    super();
    let _this = this;
    console.log('AppSandboxBrowser');

    //simulate sandbox frontier
    _this._bus = new MiniBus();
    _this._bus._onPostMessage = function(msg) {
      console.log('AppSandboxBrowser._onPostMessage -> external: ', JSON.stringify(msg));

      //redirect messages to the external part of the sandbox
      _this._onMessage(msg);
    };

    _this._sbr = new SandboxRegistry(_this._bus);
    _this._sbr._create = (url, sourceCode, config) => {
      console.log('SandboxRegistry._create ', url, config);
      eval(sourceCode);
      return activate(url, _this._bus, config);
    };

    //for testing, this make components accessible from browser console
    window.components = _this._sbr.components;
  }

  _onPostMessage(msg) {
    let _this = this;
    console.log('AppSandboxBrowser._onPostMessage -> internal: ', JSON.stringify(msg));

    //redirect messages to the internal part of the sandbox
    _this._bus._onMessage(msg);
  }

}

export default AppSandboxBrowser;
