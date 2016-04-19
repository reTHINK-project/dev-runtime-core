import MiniBus from '../../src/bus/MiniBus';
import Sandbox from '../../src/sandbox/Sandbox';
import {SandboxType} from '../../src/sandbox/Sandbox';
import SandboxRegistry from '../../src/sandbox/SandboxRegistry';

// Mockup code for testing
class SandboxBrowser extends Sandbox {

  constructor() {
    super();
    let _this = this;
    _this.type = SandboxType.NORMAL;

    console.log('AppSandboxBrowser');

    //simulate sandbox frontier
    _this._bus = new MiniBus();
    _this._bus._onPostMessage = function(msg) {
      console.log('SandboxBrowser._onPostMessage -> external', 'from: ', msg.from, 'to: ', msg.to);

      //redirect messages to the external part of the sandbox
      _this._onMessage(msg);
    };

    _this._sbr = new SandboxRegistry(_this._bus);
    _this._sbr._create = (url, sourceCode, config) => {
      console.log('SandboxRegistry._create ', url, config);
      eval(sourceCode);
      return activate(url, this._bus, config);
    };
  }

  _onPostMessage(msg) {
    let _this = this;
    console.log('SandboxBrowser._onPostMessage -> internal', 'from: ', msg.from, 'to: ', msg.to);

    //redirect messages to the internal part of the sandbox
    _this._bus._onMessage(msg);
  }

}

export default SandboxBrowser;
