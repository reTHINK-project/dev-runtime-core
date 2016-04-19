import SandboxBrowser from './sandboxes/SandboxBrowser';
import AppSandboxBrowser from './sandboxes/AppSandboxBrowser';
import Request from './Request';
import {RuntimeCatalogueLocal, RuntimeCatalogue} from 'service-framework/dist/RuntimeCatalogue';

class RuntimeFactory {

  createSandbox() {
    return new SandboxBrowser();
  }

  createAppSandbox() {
    return new AppSandboxBrowser();
  }

  createHttpRequest() {
    let request = new Request();
    return request;
  }

  // TODO optimize the parameter was passed to inside the RuntimeCatalogue
  createRuntimeCatalogue() {

    let _this = this;
    let factory = {
      createHttpRequest: function() {
        return _this.createHttpRequest();
      }
    };

    return new RuntimeCatalogueLocal(factory);

  }

  removeSandbox() {

  }

}

export default RuntimeFactory;
