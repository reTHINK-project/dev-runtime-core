import MiniBus from '../bus/MiniBus';
import Sandbox from './Sandbox';
import {SandboxType} from './Sandbox';
import SandboxRegistry from './SandboxRegistry';



// Mockup code for testing
class SandboxBrowser extends Sandbox {

  constructor(capabilities) {
    super();
    let _this = this;
    _this.type = SandboxType.NORMAL;

    console.log('[SandboxBrowser] New with capabilities: ', capabilities);

    //simulate sandbox frontier
    _this._bus = new MiniBus();
    _this._bus._onPostMessage = function(msg) {
      console.log('SandboxBrowser._onPostMessage -> external (out)', 'from: ', msg.from, 'to: ', msg.to);

      //redirect messages to the external part of the sandbox
      _this._onMessage(msg);
    };

    _this._sbr = new SandboxRegistry(_this._bus);
    _this._sbr._create = (url, sourceCode, config, factory) => {
      console.log('SandboxRegistry._create ', url, config);
      window.eval(sourceCode);

      let component;
      if (typeof activate === 'function') {
        component = activate(url, this._bus, config, factory);
      }

      if (typeof activate.default === 'function') {
        component = activate.default(url, this._bus, config, factory);
      }

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
