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

    _this.registry.registerMessageBus(_this.messageBus);

    sandboxFactory.messageBus = _this.messageBus;
    _this.sandboxFactory = sandboxFactory;

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
  
  downloadHypertyCode(hypertyURL) {
  
    
  }

  /**
  * Deploy Hyperty from Catalogue URL
  * @param  {URL.URL}    hyperty hypertyInstance url;
  */
  loadHyperty(hyperty) {

    let _this = this;

    if (!hyperty) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise(function(resolve, reject) {

      let _hypertyURL;
      let _hypertySandbox;
      let _hypertyDescriptor;
      let _hypertySourceCode;
      let _hypertyConfiguration = {
        url: 'ws://193.136.93.214:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

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
        let hypertySourceCodeUrl = hyperty;

        // Get the hyperty source code
        return request.get(hypertySourceCodeUrl);
      })
      .then(function(hypertySourceCode) {

        console.info('2: return hyperty source code');
        _hypertySourceCode = hypertySourceCode;

        // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
        let message = {
          body: {
            value: 'hyperty-runtime://sp1/protostub/HelloHyperty'
          }
        };

        // Register hyperty;
        return _this.registry.registerHyperty(message, _hypertyDescriptor);
      })
      .then(function(hypertyURL) {
        console.info('3: return hyperty url, after register hyperty');

        _hypertyURL = hypertyURL;
        let inSameSandbox = true;

        // TODO: Check if the app and hyperty is in the same sandbox and
        if (inSameSandbox) {
          // TODO: getAppSandbox, this will return a promise;

          _hypertySandbox = _this.sandboxFactory.createAppSandbox();
          _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
        } else {
          // TODO: getHypertySandbox, this will return a promise;

          _hypertySandbox = _this.sandboxFactory.createSandbox();
          _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
        }

        return _hypertySandbox;
      })
      .then(function(sandboxInstance) {
        console.info('4: return the sandbox instance after check if is in the same sandbox or not');

        // Add the message bus listener
        _this.messageBus.addListener(_hypertyURL, sandboxInstance);

      })
      // .then(function(result) {
      //   console.info('5: return deploy component for sandbox status');
      // })
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
      let componentDownloadURL = 'dist/VertxProtoStub.js';
      let configuration = {
        url: 'ws://193.136.93.243:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

      let _stubSandbox;
      let _runtimeSandboxURL;
      let _runtimeProtoStubURL;
      let _protoStubSourceCode;

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
        // return request.get(domain);
        return {};
      })
      .then(function(descriptor) {
        console.info('2. return the ProtoStub descriptor:', descriptor);
        stubDescriptor = descriptor;

        // Get the component source code referent to component download url;
        return request.get(componentDownloadURL);
      })
      .then(function(protoStubSourceCode) {
        console.info('3. return the ProtoStub Source Code: ');
        _protoStubSourceCode = protoStubSourceCode;

        return _this.registry.registerStub(domain);
      })
      .then(function(runtimeProtoStubURL) {
        console.info('4. return the runtimeProtoStubURL, After Register Stub');
        _runtimeProtoStubURL = runtimeProtoStubURL;

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
        // Instantiate the Sandbox
        _stubSandbox = _this.sandboxFactory.createSandbox();

        return _this.registry.registerSandbox(_stubSandbox, domain);
      })
      .then(function(runtimeSandboxURL) {
        console.info('5: return the sandbox runtime url', runtimeSandboxURL);
        _runtimeSandboxURL = runtimeSandboxURL;

        // Deploy Component
        return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
      }, function() {
        // TODO: delete this fallback;
        console.info('5.1: return the sandbox runtime url');
        _runtimeSandboxURL = 'ptinovacao.pt/sandbox/1234';

        // Deploy Component
        return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
      })
      .then(function(result) {
        console.info('6: return deploy component for sandbox status');

        // Handle with deployed component
        console.log('Component is deployed');

        // Add the message bus listener
        console.info('add message bus listener to: ', _runtimeProtoStubURL, ' on ', _stubSandbox);
        _this.messageBus.addListener(_runtimeProtoStubURL, _stubSandbox);

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
