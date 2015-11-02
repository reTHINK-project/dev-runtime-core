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

    // Instantiate the identity Module
    _this.identityModule = new IdentityModule();

    // Instantiate the Policy Engine
    _this.policyEngine = new PolicyEngine();

    // Instantiate the Message Bus
    _this.messageBus = new MessageBus(_this.registry);

    // Instantiate the Registry Module
    _this.registry = new Registry(hypertyRuntimeURL);
    _this.registry.registerMessageBus(_this.messageBus);

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    _this.sandboxFactory = sandboxFactory;
    sandboxFactory.messageBus = _this.messageBus;

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    _this.hypertySandbox = _this.sandboxFactory.createAppSandbox();

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

        // hyperty contains the full path of the catalogue URL, e.g.
        // catalogue.rethink.eu/.well-known/..........

        console.info('1: return hyperty descriptor');

        _hypertyDescriptor = hypertyDescriptor;

        // TODO: Update this variables with result of the request
        // This values are only for testes, should be removed;
        // TODO: need to extract the hypertySourceCodeURL from _hypertyDescriptor.
        // This can be simple done by extending the hyperty URL that was passed
        // before, since we have well-known path components.
        let hypertySourceCodeUrl = hyperty;

        // Get the hyperty source code
        return request.get(hypertySourceCodeUrl);
      })
      .then(function(hypertySourceCode) {
        console.info('2: return hyperty source code');

        // at this point, we have completed "step 4" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md

        _hypertySourceCode = hypertySourceCode;

        // Register hyperty;
        return _this.registry.registerHyperty(_hypertyDescriptor);
      })
      .then(function(hypertyURL) {
        console.info('3: return hyperty url, after register hyperty');

        // we have completed step 7 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        _hypertyURL = hypertyURL;

        //
        // steps 8 -- 11 are skipped.
        // TODO: on release of core 0.2;
        // TODO: Promise to check the policy engine

        // mock-up code;
        // temporary code, only
        let policy = true;

        return policy;
      })
      .then(function(policyResult) {
        console.info('4: return policy engine result');

        // we have completed step 11 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        //
        // Steps 12 -- 18
        // As a result of the sipped steps, we know at this point if we execute
        // inSameSandbox or not.
        //

        // For testing, just assume we execute in same Sandbox.
        let inSameSandbox = true;
        let _hypertySandbox = _this.hypertySandbox;

        // TODO: Check if the app and hyperty is in the same sandbox and
        if (inSameSandbox) {

          // the following one lines are the mock-up for the missing steps 12 & 13
          // TODO: getAppSandbox, this will return a promise;
          _hypertySandbox = _this.registry.getAppSandbox();

          // we have completed step 16 here.

          // Note, steps 17 & 18 are not part of the if-statement as the appear both at the end of the
          // if statement and of the else statement.  --> common code taken outside
          // TODO:  Spec needs to be aligned, we need to exlude steps 17 & 18 from the two alternatives.

        } else {
          // Steps 19 -- 28
          // TODO: getHypertySandbox, this will return a promise;
          _hypertySandbox = _this.sandboxFactory.createSandbox();

        }

        // Common to step 14 and 24 - deploycomponent
        // step 14 if the App and Hyperty executes in the same Sandbox - after _this.registry.getAppSandbox();
        // step 24 if the App and Hyperty executes in different Sandboxes - after _this.registry.getHypertySandbox();
        return _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
      })
      .then(function(deployComponentStatus) {
        console.info('5: return the sandbox instance after check if is in the same sandbox or not');

        // we have completed step 16 or 26 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        _this.messageBus.addListener(_hypertyURL, _hypertySandbox);

        // we have completed step 17 or 27 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        resolve('Hyperty is deployed');

        // we have completed step 18 or 28 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
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

        let componentDownloadURL = 'dist/VertxProtoStub.js';

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
