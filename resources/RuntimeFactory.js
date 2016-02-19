import SandboxBrowser from './sandboxes/SandboxBrowser';
import AppSandboxBrowser from './sandboxes/AppSandboxBrowser';
import Request from './Request';

class RuntimeFactory {

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

  makeRequest() {
    let request = new Request();
    return request;
  }

  removeSandbox() {

  }

}

export default RuntimeFactory;
