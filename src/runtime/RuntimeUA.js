// Service Framework dependecies
import RuntimeCatalogue from 'service-framework/dist/RuntimeCatalogue';

//Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PolicyEngine from '../policy/PolicyEngine';
import MessageBus from '../bus/MessageBus';
import GraphConnector from '../graphconnector/GraphConnector';

import SyncherManager from '../syncher/SyncherManager';

import {divideURL, emptyObject} from '../utils/utils';

/**
 * Runtime User Agent Interface will process all the dependecies of the core runtime;
 * @author Vitor Silva [vitor-t-silva@telecom.pt]
 * @version 0.4.0
 *
 * @property {runtimeFactory} runtimeFactory - Specific implementation of sandbox;
 * @property {RuntimeCatalogue} runtimeCatalogue - Catalogue of components can be installed;
 * @property {runtimeURL} runtimeURL - This identify the core runtime, should be unique;
 * @property {IdentityModule} identityModule - Identity Module;
 * @property {PolicyEngine} policyEngine - Policy Engine Module;
 * @property {Registry} registry - Registry Module;
 * @property {MessageBus} messageBus - Message Bus is used like a router to redirect the messages from one component to other(s)
 * @property {GraphConnector} graphConnector - Graph Connector handling GUID and contacts
 */
class RuntimeUA {

  /**
   * Create a new instance of Runtime User Agent
   * @param {runtimeFactory} runtimeFactory - Specific implementation for the environment where the core runtime will run;
   * @param {domain} domainURL - specify the domain base for the runtime;
   */
  constructor(runtimeFactory, domain) {

    if (!runtimeFactory) throw new Error('The sandbox factory is a needed parameter');
    if (!domain) throw new Error('You need the domain of runtime');

    let _this = this;

    _this.runtimeFactory = runtimeFactory;

    console.log(RuntimeCatalogue);

    _this.runtimeCatalogue = new RuntimeCatalogue(runtimeFactory);

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // the response is like: runtime://sp1/123

    let runtimeURL = 'runtime://' + domain + '/' + Math.floor((Math.random() * 10000) + 1);
    _this.runtimeURL = runtimeURL;
    _this.domain = domain;

    // TODO: check if runtime catalogue need the runtimeURL;
    _this.runtimeCatalogue.runtimeURL = runtimeURL;

    // Instantiate the identity Module
    _this.identityModule = new IdentityModule();

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    let appSandbox = runtimeFactory.createAppSandbox();

    // Instantiate the Registry Module
    _this.registry = new Registry(runtimeURL, appSandbox, _this.identityModule);

    // Instantiate the Policy Engine
    _this.policyEngine = new PolicyEngine(_this.identityModule, _this.registry);

    // Instantiate the Message Bus
    _this.messageBus = new MessageBus(_this.registry);
    _this.messageBus.pipeline.handlers = [

      // Policy message authorise
      function(ctx) {
        _this.policyEngine.authorise(ctx.msg).then(function(changedMgs) {
          ctx.msg = changedMgs;
          ctx.next();
        }).catch(function(reason) {
          console.error(reason);
          ctx.fail(reason);
        });
      }
    ];

    // Add to App Sandbox the listener;
    appSandbox.addListener('*', function(msg) {
      _this.messageBus.postMessage(msg);
    });

    // Register messageBus on Registry
    _this.registry.messageBus = _this.messageBus;

    _this.registry.addEventListener('runtime:loadStub', function(domainURL) {

      _this.loadStub(domainURL).then(function() {
        _this.registry.trigger('runtime:stubLoaded', domainURL);
      }).catch(function(reason) {
        console.error(reason);
      });
    });

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    runtimeFactory.messageBus = _this.messageBus;

    // Instanciate the SyncherManager;
    _this.syncherManager = new SyncherManager(_this.runtimeURL, _this.messageBus, { }, _this.runtimeCatalogue);

    // Instantiate the Graph Connector
    _this.graphConnector = new GraphConnector(_this.runtimeURL, _this.messageBus);

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
  * @param  {URL.HypertyCatalogueURL}    hyperty hypertyDescriptor url;
  */
  loadHyperty(hypertyDescriptorURL) {

    let _this = this;

    if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise(function(resolve, reject) {

      let _hypertyURL;
      let _hypertySandbox;
      let _hypertyDescriptor;
      let _hypertySourcePackage;

      let errorReason = function(reason) {
        reject(reason);
      };

      // Get Hyperty descriptor
      // TODO: the request Module should be changed,
      // because at this moment it is incompatible with nodejs;
      // Probably we need to pass a factory like we do for sandboxes;
      console.info('------------------ Hyperty ------------------------');
      console.info('Get hyperty descriptor for :', hypertyDescriptorURL);
      _this.runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then(function(hypertyDescriptor) {
        // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
        console.info('1: return hyperty descriptor', hypertyDescriptor);

        // hyperty contains the full path of the catalogue URL, e.g.
        // catalogue.rethink.eu/.well-known/..........
        _hypertyDescriptor = hypertyDescriptor;

        let sourcePackageURL = hypertyDescriptor.sourcePackageURL;

        if (sourcePackageURL === '/sourcePackage') {
          return hypertyDescriptor.sourcePackage;
        }

        // Get the hyperty source code
        return _this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
      })
      .then(function(sourcePackage) {
        console.info('2: return hyperty source code');

        // at this point, we have completed "step 4 and 5" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md

        _hypertySourcePackage = sourcePackage;

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
        console.info('3: return policy engine result: ', policyResult);

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

          let domain = divideURL(hypertyDescriptorURL).domain;

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
        console.error('4.1: try to register a new sandbox', reason);

        // check if the sandbox is registed for this hyperty descriptor url;
        // Make Steps xxx --- xxx
        // Instantiate the Sandbox
        let sandbox = _this.runtimeFactory.createSandbox();

        sandbox.addListener('*', function(msg) {
          _this.messageBus.postMessage(msg);
        });

        return sandbox;
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

        console.log(_hypertyDescriptor);

        // Extend original hyperty configuration;
        let configuration = {};
        if (!emptyObject(_hypertyDescriptor.configuration)) {
          try {
            configuration = Object.assign({}, JSON.parse(_hypertyDescriptor.configuration));
          } catch (e) {
            configuration = _hypertyDescriptor.configuration;
          }
        }
        configuration.runtimeURL = _this.runtimeURL;

        // We will deploy the component - step 17 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        return _hypertySandbox.deployComponent(_hypertySourcePackage.sourceCode, _hypertyURL, configuration);
      })
      .then(function(deployComponentStatus) {
        console.info('7: Deploy component status for hyperty: ', deployComponentStatus);

        // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        _this.messageBus.addListener(_hypertyURL, function(msg) {
          _hypertySandbox.postMessage(msg);
        });

        // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        let hyperty = {
          runtimeHypertyURL: _hypertyURL,
          status: deployComponentStatus
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
  loadStub(protostubURL) {

    let _this = this;

    if (!protostubURL) throw new Error('domain parameter is needed');

    return new Promise(function(resolve, reject) {

      let domain = divideURL(protostubURL).domain;

      if (!domain) {
        domain = protostubURL;
      }

      let _stubSandbox;
      let _stubDescriptor;
      let _runtimeProtoStubURL;
      let _stubSourcePackage;

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
        return _this.runtimeCatalogue.getStubDescriptor(protostubURL);
      })
      .then(function(stubDescriptor) {

        console.info('2. return the ProtoStub descriptor:', stubDescriptor);

        // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubDescriptor = stubDescriptor;

        let sourcePackageURL = stubDescriptor.sourcePackageURL;

        if (sourcePackageURL === '/sourcePackage') {
          return stubDescriptor.sourcePackage;
        }

        // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return _this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
      })
      .then(function(stubSourcePackage) {
        console.info('3. return the ProtoStub Source Code: ', stubSourcePackage);

        // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubSourcePackage = stubSourcePackage;

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
        let policy = true;
        return policy;
      })
      .then(function(policy) {
        // this will return the sandbox or one promise to getSandbox;
        return _this.registry.getSandbox(domain);
      })
      .then(function(stubSandbox) {

        console.info('4. if the sandbox is registered then return the sandbox', stubSandbox);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _stubSandbox = stubSandbox;
        return stubSandbox;
      }, function(reason) {
        console.info('5. Sandbox was not found, creating a new one', reason);

        // check if the sandbox is registed for this stub descriptor url;
        // Make Steps xxx --- xxx
        // Instantiate the Sandbox
        let sandbox = _this.runtimeFactory.createSandbox();
        sandbox.addListener('*', function(msg) {
          _this.messageBus.postMessage(msg);
        });

        return sandbox;
      })
      .then(function(sandbox) {
        console.info('6. return the sandbox instance and register', sandbox, 'to domain ', domain);

        _stubSandbox = sandbox;

        // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return _this.registry.registerStub(_stubSandbox, domain);
      })
      .then(function(runtimeProtoStubURL) {

        console.info('7. return the runtime protostub url: ', runtimeProtoStubURL);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        _runtimeProtoStubURL = runtimeProtoStubURL;

        console.log(_stubDescriptor);

        // Extend original hyperty configuration;
        let configuration = Object.assign({}, JSON.parse(_stubDescriptor.configuration));
        configuration.runtimeURL = _this.runtimeURL;

        // Deploy Component step xxx
        return _stubSandbox.deployComponent(_stubSourcePackage.sourceCode, runtimeProtoStubURL, configuration);
      })
      .then(function(deployComponentStatus) {
        console.info('8: return deploy component for sandbox status: ', deployComponentStatus);

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Add the message bus listener
        _this.messageBus.addListener(_runtimeProtoStubURL, function(msg) {
          _stubSandbox.postMessage(msg);
        });

        // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // Load Stub function resolved with success;
        let stub = {
          runtimeProtoStubURL: _runtimeProtoStubURL,
          status: deployComponentStatus
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
