//Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';

import runtimeCatalogue from './RuntimeCatalogue';

/**
* Runtime User Agent Interface
*/
class RuntimeUA {

  constructor(sandboxFactory) {

    if (!sandboxFactory) throw new Error('The sandbox factory is a needed parameter');

    let _this = this;

    _this.sandboxFactory = sandboxFactory;

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/123

    let runtimeURL = 'runtime://sp1/' + Math.floor((Math.random() * 10000) + 1);
    _this.runtimeURL = runtimeURL;

    // TODO: check if runtime catalogue need the runtimeURL;
    runtimeCatalogue.runtimeURL = runtimeURL;

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    let appSandbox = sandboxFactory.createAppSandbox();

    // Instantiate the identity Module
    _this.identityModule = new IdentityModule();

    // Instantiate the Policy Engine
    _this.policyEngine = new PolicyEngine();

    // Instantiate the Registry Module
    _this.registry = new Registry(runtimeURL, appSandbox);

    // Instantiate the Message Bus
    _this.messageBus = new MessageBus(_this.registry);

    // Register messageBus on Registry
    _this.registry.messageBus = _this.messageBus;

    _this.registry.addEventListener('runtime:loadStub', function(domainURL) {

      _this.loadStub(domainURL).then(function(result) {
        _this.registry.trigger('runtime:stubLoaded', domainURL);
      }).catch(function(reason) {
        console.error(reason);
      });
    });

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    sandboxFactory.messageBus = _this.messageBus;

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
  loadHyperty(hypertyDescriptorURL) {

    let _this = this;

    if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise(function(resolve, reject) {

      let _hypertyURL;
      let _hypertySandbox;
      let _hypertyDescriptor;
      let _hypertySourceCode;

      let errorReason = function(reason) {
        console.error(reason);
        reject(reason);
      };

      // Get Hyperty descriptor
      // TODO: the request Module should be changed,
      // because at this moment it is incompatible with nodejs;
      // Probably we need to pass a factory like we do for sandboxes;
      console.log('------------------ Hyperty ------------------------');
      console.info('Get hyperty descriptor for :', hypertyDescriptorURL);
      runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then(function(hypertyDescriptor) {
        // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
        console.info('1: return hyperty descriptor', hypertyDescriptor);

        // hyperty contains the full path of the catalogue URL, e.g.
        // catalogue.rethink.eu/.well-known/..........
        _hypertyDescriptor = hypertyDescriptor;

        let hypertySourceCodeUrl = hypertyDescriptor.sourceCode;

        // Get the hyperty source code
        return runtimeCatalogue.getHypertySourceCode(hypertySourceCodeUrl);
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
          sandbox = _this.registry.getSandbox(domain);
        }

        // this will return the sandbox or one promise to getSandbox;
        return sandbox;
      }).then(function(sandbox) {
        console.info('4: return the sandbox', sandbox);

        // Return the sandbox indepentely if it running in the same sandbox or not
        // we have completed step 14 here.
        return sandbox;
      }, function(reason) {
        console.info('4.1: try to register a new sandbox', reason);

        // check if the sandbox is registed for this hyperty descriptor url;
        // Make Steps xxx --- xxx
        // Instantiate the Sandbox
        return _this.sandboxFactory.createSandbox();
      })
      .then(function(sandbox) {
        console.info('5: return sandbox and register');

        _hypertySandbox = sandbox;

        // Register hyperty
        return _this.registry.registerHyperty(sandbox, hypertyDescriptorURL);
      })
      .then(function(hypertyURL) {
        console.info('6: Hyperty url, after register hyperty', hypertyURL);

        // we have completed step 16 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        _hypertyURL = hypertyURL;

        // We will deploy the component - step 17 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        return _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyDescriptor.configuration);
      })
      .then(function(deployComponentStatus) {
        console.info('7: Deploy component status for hyperty: ', _hypertyURL);

        // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        _this.messageBus.addListener(_hypertyURL, function(msg) {
          _hypertySandbox.postMessage(msg);
        });

        _hypertySandbox.addListener('*', function(msg) {
          _this.messageBus.postMessage(msg);
        });

        // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        let hyperty = {
          runtimeHypertyURL: _hypertyURL,
          status: 'Deployed'
        };

        resolve(hyperty);

        // we have completed step 21 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        console.log('------------------ END ------------------------');
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

      let _stubSandbox;
      let _stubDescriptor;
      let _runtimeProtoStubURL;
      let _protoStubSourceCode;

      let errorReason = function(reason) {
        console.error(reason);
        reject(reason);
      };

      // Discover Protocol Stub
      console.info('------------------- ProtoStub ---------------------------\n');
      console.info('Discover or Create a new ProtoStub for domain: ', domain);
      _this.registry.discoverProtostub(domain).then(function(descriptor) {
        // Is registed?
        console.info('1. Proto Stub Discovered: ', descriptor);
        _stubDescriptor = descriptor;

        // we have completed step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        return _stubDescriptor;
      }, function(reason) {
        // is not registed?
        console.info('1. Proto Stub not found:', reason);

        // we have completed step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // we need to get ProtoStub descriptor step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return runtimeCatalogue.getStubDescriptor(domain);
      })
      .then(function(descriptor) {

        console.info('2. return the ProtoStub descriptor:', descriptor);

        // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubDescriptor = descriptor;

        let componentDownloadURL = descriptor.sourceCode;

        // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return runtimeCatalogue.getStubSourceCode(componentDownloadURL);
      })
      .then(function(protoStubSourceCode) {
        console.info('3. return the ProtoStub Source Code: ');

        // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _protoStubSourceCode = protoStubSourceCode;

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
        let policy = true;
        return policy;
      }).then(function(policy) {
        // this will return the sandbox or one promise to getSandbox;
        return _this.registry.getSandbox(domain);

      }).then(function(stubSandbox) {

        console.info('4. if the sandbox is registered then return the sandbox', stubSandbox);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubSandbox = stubSandbox;
        return stubSandbox;
      }, function(reason) {
        console.info('5. Sandbox was not found, creating a new one');

        // check if the sandbox is registed for this stub descriptor url;
        // Make Steps xxx --- xxx
        // Instantiate the Sandbox
        return _this.sandboxFactory.createSandbox();
      })
      .then(function(sandbox) {
        console.info('6. return the sandbox instance and the register', sandbox);

        _stubSandbox = sandbox;

        // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return _this.registry.registerStub(_stubSandbox, domain);
      })
      .then(function(runtimeProtoStubURL) {

        console.info('7. return the runtime protostub url: ', runtimeProtoStubURL);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _runtimeProtoStubURL = runtimeProtoStubURL;

        // Deploy Component step xxx
        return _stubSandbox.deployComponent(_protoStubSourceCode, runtimeProtoStubURL, _stubDescriptor.configuration);
      })
      .then(function(result) {
        console.info('8: return deploy component for sandbox status');

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Add the message bus listener
        _this.messageBus.addListener(_runtimeProtoStubURL, function(msg) {
          _stubSandbox.postMessage(msg);
        });

        _stubSandbox.addListener('*', function(msg) {
          _this.messageBus.postMessage(msg);
        });

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Load Stub function resolved with success;
        let stub = {
          runtimeProtoStubURL: _runtimeProtoStubURL,
          status: 'Deployed'
        };

        resolve(stub);
        console.info('------------------- END ---------------------------\n');

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
