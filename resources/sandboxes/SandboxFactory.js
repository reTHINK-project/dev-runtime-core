import SandboxBrowser from './SandboxBrowser';
import AppSandboxBrowser from './AppSandboxBrowser';

class SandboxFactory {

  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;
  }

  createSandbox() {
    let _this = this;
    return new SandboxBrowser(_this._messageBus);
  }

  createAppSandbox() {
    let _this = this;
    return new AppSandboxBrowser(_this._messageBus);
  }

  removeSandbox() {

  }

}

export default SandboxFactory;
