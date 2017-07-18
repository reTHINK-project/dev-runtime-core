import MiniBus from '../../../dist/minibus';
import {Sandbox, SandboxType, SandboxRegistry} from '../../../dist/sandbox';
//import activate from '../VertxProtoStub.js'

// Mockup code for testing
class SandboxBrowser extends Sandbox {

  constructor(capabilities) {
    super();
    let _this = this;
    _this.type = SandboxType.NORMAL;

    console.log('[SandboxBrowser] New with capabilities: ',capabilities);

    //simulate sandbox frontier
    _this._bus = new MiniBus();
    _this._bus._onPostMessage = function(msg) {
      console.log('SandboxBrowser._onPostMessage -> external (out)', 'from: ', msg.from, 'to: ', msg.to);

      //redirect messages to the external part of the sandbox
      _this._onMessage(msg);
    };

    _this._sbr = new SandboxRegistry(_this._bus);
    _this._sbr._create = (url, sourceCode, config) => {
      console.log('SandboxRegistry._create ', url, config);

      window.eval(sourceCode);

      let component = activate(url, this._bus, config);

      //for testing, this make components accessible from browser console
      if (!window.components) window.components = {};
      window.components[url] = component;

      return component;
    };
  }

  _onPostMessage(msg) {
    let _this = this;
    console.log('SandboxBrowser._onPostMessage -> internal (in)', 'from: ', msg.from, 'to: ', msg.to);

    //redirect messages to the internal part of the sandbox
    _this._bus._onMessage(msg);
  }

}

export default SandboxBrowser;
