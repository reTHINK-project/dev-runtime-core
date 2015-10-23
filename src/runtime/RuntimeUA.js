// utils
import request from '../utils/request';

// Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';

/**
* Runtime User Agent Interface
*/
class RuntimeUA {

  constructor(sandboxFactory) {

    if (!sandboxFactory) throw new Error('The sandbox factory is a needed parameter');

    let _this = this;

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/protostub/123

    let hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';

    _this.registry = new Registry(hypertyRuntimeURL);
    _this.identityModule = new IdentityModule();
    _this.policyEngine = new PolicyEngine();
    _this.messageBus = new MessageBus(_this.registry);

    sandboxFactory.messageBus = _this.messageBus;
    _this.sandboxFactory = sandboxFactory;

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

      let _hypertySandbox;
      let _hypertyDescriptor;
      let _hypertySourceCode;
      let _hypertyConfiguration = {};

      let errorReason = function(reason) {
        // console.log('Hyperty Error:', reason);
        reject(reason);
      };

      // Get Hyperty descriptor
      return request.get(hyperty).then(function(hypertyDescriptor) {

        console.info('1: return hyperty descriptor');

        _hypertyDescriptor = hypertyDescriptor;

        // TODO: Update this variables with result of the request
        // This values are only for testes, should be removed;
        let hypertySourceCodeUrl = 'dist/VertxProtoStub.js';

        // Get the hyperty source code
        return request.get(hypertySourceCodeUrl);
      })
      .then(function(hypertySourceCode) {

        console.info('2: return hyperty source code');
        _hypertySourceCode = hypertySourceCode;

        // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
        let message = {
          body: {
            value: 'hyperty-runtime://sp1/protostub/123/'
          }
        };

        console.log(_hypertySourceCode);

        // Register hyperty;
        return _this.registry.registerHyperty(message, _hypertyDescriptor);
      })
      .then(function(hypertyURL) {
        console.info('3: return hyperty url, after register hyperty');

        let inSameSandbox = true;

        // TODO: Check if the app and hyperty is in the same sandbox and
        if (inSameSandbox) {
          // TODO: getAppSandbox, this will return a promise;

          _hypertySandbox = _this.sandboxFactory.createAppSandbox();
          _hypertySandbox.deployComponent(_hypertySourceCode, hypertyURL, _hypertyConfiguration);
          return true;
        } else {
          // TODO: getHypertySandbox, this will return a promise;

          _hypertySandbox = _this.sandboxFactory.createSandbox();
          _hypertySandbox.deployComponent(_hypertySourceCode, hypertyURL, hypertyConfiguration);
          return false;
        }
      })
      .then(function(sandboxInstance) {
        console.info('4: return the sandbox instance after check if is in the same sandbox or not');

        //resolve({code: sourceCode, hypertyURL: hypertyURL, hypertyConfiguration: hypertyConfiguration, messageBus: _this.messageBus});

      })
      .then(function(result) {
        console.info('6: return deploy component for sandbox status');
      })
      .catch(errorReason);

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

      // TODO: temporary address this only static for testing
      let stubURL = 'hyperty-runtime://sp1/protostub/123';
      let componentDownloadURL = 'dist/VertxProtoStub.js';
      let configuration = {
        url: 'ws://localhost:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

      let stubSandbox;
      let runtimeSandboxURL;
      let runtimeProtoStubURL;
      let protoStubSourceCode;

      // Discover Protocol Stub
      return _this.registry.discoverProtostub(domain).then(function(descriptor) {
        // Is registed?
        console.info('1. Proto Stub Discovered: ', descriptor);
        stubDescriptor = descriptor;
        return stubDescriptor;
      }, function(reason) {
        // is not registed?
        console.info('1. Proto Stub not found:', reason);

        // TODO: get protostub | <sp-domain>/.well-known/protostub
        // for the request you can use the module request in utils;
        return request.get(domain);
      })
      .then(function(descriptor) {
        console.info('2. return the ProtoStub descriptor:', descriptor);
        stubDescriptor = descriptor;

        // Get the component source code referent to component download url;
        return request.get(componentDownloadURL);
      })
      .then(function(protoStubSourceCode) {
        console.info('3. return the ProtoStub Source Code: ');
        protoStubSourceCode = protoStubSourceCode;

        return _this.registry.registerStub(domain);
      })
      .then(function(runtimeProtoStubURL) {
        console.info('4. return the runtimeProtoStubURL, After Register Stub');
        runtimeProtoStubURL = runtimeProtoStubURL;

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
        // Instantiate the Sandbox
        stubSandbox = _this.sandboxFactory.createSandbox();

        return _this.registry.registerSandbox(stubSandbox, domain);
      })
      .then(function(runtimeSandboxURL) {
        console.info('5: return the sandbox runtime url');

        // Deploy Component
        return stubSandbox.deployComponent(protoStubSourceCode, runtimeSandboxURL, configuration);
      })
      .then(function(result) {
        console.info('6: return deploy component for sandbox status');

        // Add the message bus listener
        _this.messageBus.addListener(runtimeProtoStubURL, stubSandbox);

        // Handle with deployed component
        console.log('Component is deployed');

        // Load Stub function resolved with success;
        resolve('Stub successfully loaded');
      })
      .catch(function(reason) {
        console.log('Reason:', reason);
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
