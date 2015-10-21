// utils
import request from '../utils/request';

// Main dependecies
import SandboxFactory from '../sandbox/SandboxFactory';
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';

/**
* Runtime User Agent Interface
*/
class RuntimeUA {

  constructor(sandbox) {

    let _this = this;

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/protostub/123

    let hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';

    _this.registry = new Registry(hypertyRuntimeURL);
    _this.identityModule = new IdentityModule();
    _this.policyEngine = new PolicyEngine();
    _this.messageBus = new MessageBus(_this.registry);
    _this.sandbox = sandbox;

    // TODO: remove this event listener, only for testing
    let hypertyRuntimeURLStatus = 'hyperty-runtime://sp1/protostub/123/status';
    _this.messageBus.addListener(hypertyRuntimeURLStatus, (msg) => {
      console.log('Message bus status response with message: ', msg);
    });

    _this.messageBus.addListener('runtime:/alice', (msg) => {
      console.log('Message bus alice with message: ', msg);
    });

    _this.messageBus.addListener('hyperty-runtime://sp1/protostub/123', (msg) => {
      console.log('Message bus response with message: ', msg);
    });

  }

  /**
  * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
  * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
  */
  discoverHiperty(descriptor) {
    // Body...
  }

  /**
  * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
  * @param  {Object} Object                   hypertyInstance
  * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
  */
  registerHyperty(hypertyInstance, descriptor) {
    // Body...
  }

  /**
  * Deploy Hyperty from Catalogue URL
  * @param  {URL.URL}    hyperty hypertyInstance url;
  */
  loadHyperty(hyperty) {

    let _this = this;

    if (!hyperty) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise(function(resolve, reject) {

      let errorReason = function(reason) {
        console.log('Hyperty Error:', reason);
        reject(reason);
      };

      // Get the component source code referent to component download url;
      let hypertyDescriptorPromise = request.get(hyperty).then(function(hypertyDescriptor) {

        // TODO: Update this variables with result of the request
        // This values are only for testes, should be removed;
        let hypertySourceCodeUrl = 'dist/VertxProtoStub.js';
        let hypertySourceCode = request.get(hypertySourceCodeUrl);
        let hypertyConfiguration = {};

        // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
        let message = {
          body: {
            value: 'hyperty-runtime://sp1/protostub/123/'
          }
        };

        let hypertyURL = _this.registry.registerHyperty(message, hypertyDescriptor);

        // Make all the requests and handle with the results
        Promise.resolve(hypertySourceCode).then(function(result) {
          let sourceCode = result;

          let stubSandbox;
          if (_this.sandbox) {
            stubSandbox = SandboxFactory(_this.sandbox, _this.messageBus);
          }

          resolve({code: sourceCode, hypertyURL: hypertyURL, hypertyConfiguration: hypertyConfiguration, messageBus: _this.messageBus});

        }).catch(errorReason);

      }).catch(errorReason);

    });
  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadStub(domain) {

    let _this = this;

    if (!domain) throw new Error('domain parameter is needed');

    return new Promise(function(resolve, reject) {

      let stubDescriptor;

      // Discover Protocol Stub
      stubDescriptor = _this.registry.discoverProtostub(domain);
      console.log(stubDescriptor);
      if (!stubDescriptor) {

        // TODO: get protostub | <sp-domain>/.well-known/protostub
        // for the request you can use the module request in utils;
        stubDescriptor = _this.registry.registerStub(domain);

      }

      // TODO: temporary address this only static for testing
      let stubURL = 'hyperty-runtime://sp1/protostub/123';
      let componentDownloadURL = 'dist/VertxProtoStub.js';
      let configuration = {
        url: 'ws://localhost:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

      // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
      // Instantiate the Sandbox
      let stubSandbox;
      if (_this.sandbox) {
        stubSandbox = SandboxFactory(_this.sandbox, _this.messageBus);
      }

      // Register Sandbox on the Registry
      // TODO: Check if the register Sandbox receive 1 or 2 parameters;
      // 2 parameters: https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
      // 1 parameter: https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md#registersandbox
      // let runtimeSandboxURL = _this.registry.registerSandbox(stubSandbox, domain);
      let runtimeSandboxURL = _this.registry.registerSandbox(domain);

      // Get the component source code referent to component download url;
      request.get(componentDownloadURL).then(function(componentSourceCode) {

        // Deploy Component
        stubSandbox.deployComponent(componentSourceCode, runtimeSandboxURL, configuration).then(function(resolved) {

          // Add the message bus listener
          _this.messageBus.addListener(stubURL, stubSandbox);

          // Handle with deployed component
          console.log('Component is deployed');

          // Load Stub function resolved with success;
          resolve('Stub successfully loaded');

        }).catch(function(reason) {

          // Handle with component if it fails;
          console.log('Component is not deployed');

          // Load Stub function failed;
          reject(reason);
        });

      }).catch(function(error) {
        // Error getting the source code for component url;
        // console.log('Error getting the source code for component url ', componentDownloadURL);
        reject(error);
      });

    });

  }

  /**
  * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
  * @param  {CatalogueURL}       url url
  */
  checkForUpdate(url) {
    // Body...
  }

}

export default RuntimeUA;
