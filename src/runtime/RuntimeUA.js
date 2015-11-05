//utils
import request from '../utils/request';

//Main dependecies
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

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    _this.sandboxFactory = sandboxFactory;
    sandboxFactory.messageBus = _this.messageBus;

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    let appSandbox = _this.sandboxFactory.createAppSandbox();

    // Instantiate the Registry Module
    _this.registry = new Registry(_this.messageBus, hypertyRuntimeURL, appSandbox);

    _this.registry.addEventListener('runtime:loadStub', function(domainURL) {

      _this.loadStub(domainURL).then(function(result) {
        _this.registry.trigger('runtime:stubLoaded', domainURL);
      }).catch(function(reason) {
        console.error('reason', reason);
      });
    });

  }

  //
  //  GETTER methods for class attributes
  //
  /**
  * Get HypertyDescriptor
  */
  getHypertyDescriptor() {
    return _hypertyDescriptor;
  }

  /**
  * Get hypertySourceCode
  */
  getHypertySourceCode() {
    return _hypertySourceCode;
  }

  /**
  * Get hypertyRuntimeURL
  */

  getHypertyRuntimeURL() {
    return _hypertyRuntimeURL;
  }

  // DONE with GETTER methods

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
  loadHyperty(hypertyDescriptorURL) {

    let _this = this;

    if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise(function(resolve, reject) {

      let _sandbox;
      let _hypertyURL;
      let _hypertyDescriptor;
      let _hypertySourceCode;
      let _hypertyConfiguration = {
        url: 'ws://193.136.93.214:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

      let errorReason = function(reason) {
        // // console.log('Hyperty Error:', reason);
        reject(reason);
      };

      // Get Hyperty descriptor
      // TODO: the request Module should be changed,
      // because at this moment it is incompatible with nodejs;
      // Probably we need to pass a factory like we do for sandboxes;

      return request.get(hypertyDescriptorURL).then(function(hypertyDescriptor) {
        // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
        console.info('1: return hyperty descriptor', hypertyDescriptor);

        // hyperty contains the full path of the catalogue URL, e.g.
        // catalogue.rethink.eu/.well-known/..........
        _hypertyDescriptor = hypertyDescriptor;

        let hypertySourceCodeUrl = hypertyDescriptor.sourceCode;

        // Get the hyperty source code
        return request.get(hypertySourceCodeUrl);
      })
      .then(function(hypertySourceCode) {
        console.info('2: return hyperty source code');

        // at this point, we have completed "step 4 and 5" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md

        _hypertySourceCode = hypertySourceCode;

        //
        // steps 6 -- 9 are skipped.
        // TODO: on release of core 0.2;
        // TODO: Promise to check the policy engine

        // mock-up code;
        // temporary code, only
        let policy = true;

        return policy;
      })
      .then(function(policyResult) {
        console.info('3: return policy engine result');

        // we have completed step 6 to 9 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        //
        // Steps 6 -- 9
        // As a result of the sipped steps, we know at this point if we execute
        // inSameSandbox or not.
        //

        // For testing, just assume we execute in same Sandbox.
        let inSameSandbox = true;
        let sandbox;

        if (inSameSandbox) {

          // this don't need be a Promise;
          sandbox = _this.registry.getAppSandbox();

          // we have completed step 11 here.
        } else {

          // getSandbox, this will return a promise;
          sandbox = _this.registry.getSandbox(_hypertyDescriptorURL);

          // check if the sandbox is registed for this hyperty descriptor url;
          if (!sandbox) {
            // Make Steps 13 -- 14
            sandbox = _this.sandboxFactory.createSandbox();
          }

        }

        // this will return the sandbox or one promise to getSandbox;
        return sandbox;
      }).then(function(sandbox) {
        console.info('4: return the sandbox');

        // Return the sandbox indepentely if it running in the same sandbox or not
        // we have completed step 14 here.

        _sandbox = sandbox;

        // Register hyperty
        return _this.registry.registerHyperty(_sandbox, hypertyDescriptorURL);
      })
      .then(function(hypertyURL) {
        console.info('5: return hyperty url, after register hyperty');

        // we have completed step 16 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        _hypertyURL = hypertyURL;

        // We will deploy the component - step 17 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        return _sandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
      })
      .then(function(deployComponentStatus) {
        console.info('6: return the status of deployed component');

        // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        _this.messageBus.addListener(_hypertyURL, _hypertySandbox);

        // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        resolve('Hyperty is deployed');

        // we have completed step 21 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

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

      // TODO: temporary address this only static for testing
      let configuration = {
        url: 'ws://193.136.93.243:9090/ws',
        runtimeURL: 'runtime:/alice'
      };

      let _stubSandbox;
      let _stubDescriptor;
      let _runtimeProtoStubURL;
      let _protoStubSourceCode;

      let errorReason = function(reason) {
        // // console.log('Hyperty Error:', reason);
        reject(reason);
      };

      // Discover Protocol Stub
      return _this.registry.discoverProtostub(domain).then(function(descriptor) {
        // Is registed?
        console.info('1. Proto Stub Discovered: ', descriptor);
        _stubDescriptor = descriptor;

        // we have completed step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        resolve('Successful');
      }, function(reason) {
        // is not registed?
        console.info('1. Proto Stub not found:', reason);

        // we have completed step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // we need to get ProtoStub descriptor step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        // TODO: get protostub | <sp-domain>/.well-known/protostub
        // Probably this will be a new promise
        return {};
      })
      .then(function(descriptor) {

        console.info('2. return the ProtoStub descriptor:', descriptor);

        // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubDescriptor = descriptor;

        let componentDownloadURL = descriptor.sourceCode;

        // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return request.get(componentDownloadURL);
      })
      .then(function(protoStubSourceCode) {
        console.info('3. return the ProtoStub Source Code: ');

        // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _protoStubSourceCode = protoStubSourceCode;

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;

        // getSandbox, this will return a promise;
        let sandbox = _this.registry.getSandbox(_hypertyDescriptorURL);

        // check if the sandbox is registed for this stub descriptor url;
        if (!sandbox) {
          // Make Steps xxx --- xxx
          // Instantiate the Sandbox
          sandbox = _this.sandboxFactory.createSandbox();
        }

        // this will return the sandbox or one promise to getSandbox;
        return sandbox;
      }).then(function(stubSandbox) {

        console.info('4. return the sandbox');

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubSandbox = stubSandbox;

        // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return _this.registry.registerStub(stubSandbox, domain);
      })
      .then(function(runtimeProtoStubURL) {

        console.info('4. return the ProtoStub Source Code: ');

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _runtimeProtoStubURL = runtimeProtoStubURL;

        // Deploy Component step xxx
        return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
      })
      .then(function(result) {
        console.info('5: return deploy component for sandbox status');

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Add the message bus listener
        _this.messageBus.addListener(_runtimeProtoStubURL, _stubSandbox);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Load Stub function resolved with success;
        resolve('Stub successfully loaded');
      })
      .catch(errorReason);

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
