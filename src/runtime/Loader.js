import {divideURL, emptyObject} from '../utils/utils';
import AddressAllocation from '../allocation/AddressAllocation';

class Loader {

  constructor(runtimeURL, runtimeConfiguration, runtimeDescriptorsInstance) {
    if (!runtimeConfiguration) throw   Error('[Runtime.Loader] The descriptor need to know the runtime configuration');
    if (!runtimeDescriptorsInstance) throw   Error('[Runtime.Loader] The descriptor need to know the runtime Descriptor instance');

    this.runtimeConfiguration = runtimeConfiguration;
    this.descriptors = runtimeDescriptorsInstance;
  }

  /**
   * Set runtime url
   * @param  {string} value runtimeURL
   */
  set runtimeURL(value) {
    this._runtimeURL = value;
  }

  /**
   * Get runtime url
   * @return {string} value runtimeURL
   */
  get runtimeURL() {
    return this._runtimeURL;
  }

  /**
   * Set Registry component
   * @param  {Registry} value Registry Component
   */
  set registry(value) {
    this._registry = value;

    // Install AddressAllocation
    let addressAllocation = AddressAllocation.instance;
    this._addressAllocation = addressAllocation;

    console.log('[Loader - AddressAllocation] - ', addressAllocation);
  }

  /**
   * Get Registry component
   * @return {Registry} Registry component
   */
  get registry() {
    return this._registry;
  }

  /**
   * Set Message Bus component
   * @param  {MessageBus} value Message bus component
   */
  set messageBus(value) {
    this._messagesBus = value;
  }

  /**
   * Get Message Bus component
   * @return {MessageBus} Message Bus component
   */
  get messageBus() {
    return this._messagesBus;
  }

  /**
   * Set Runtime Factory component
   * @param  {runtimeFactory} value Factory includes the specific implementations for each environment
   */
  set runtimeFactory(value) {
    this._runtimeFactory = value;
  }

  /**
   * Get Runtime Factory component
   * @return {runtimeFactory} Runtime Factory component
   */
  get runtimeFactory() {
    return this._runtimeFactory;
  }


  /**
   * Deploy Hyperty from Catalogue URL
   *
   * @see https://github.com/reTHINK-project/specs/tree/master/datamodel/core/address
   *
   * @param {URL.HypertyCatalogueURL} hypertyCatalogueURL - The Catalogue URL used to identify descriptors in the Catalogue.
   * @param {boolean|URL.HypertyURL} [reuseURL=false] reuseURL - reuseURL is used to reuse the hypertyURL previously registred, by default the reuse is disabled;
   * @param {URL} appURL - the app url origin address;
   * @param {object} IdpConstraint - constraints to be used when selecting the identity to be associated with the Hyperty including origin, idp, and idHint.
   * @returns {Promise<Boolean, Error>} this is Promise and returns true if all components are loaded with success or an error if someone fails.
   *
   * @memberOf Loader
   */
  loadHyperty(hypertyCatalogueURL, reuseURL = false, IdpConstraint, appURL) {

    if (!this._readyToUse()) return false;
    if (!hypertyCatalogueURL) throw new   Error('[Runtime.Loader] Hyperty descriptor url parameter is needed');

    return new Promise((resolve, reject) => {

      let _hypertyURL;
      let _hypertySandbox;
      let _hypertyDescriptor;
      let _hypertySourcePackage;
      let haveError = false;

      let errorReason = (reason) => {
        console.  Error('[Runtime.Loader] Something failed on the deploy hyperty: ', reason);
        reject(reason);
      };

      let handleError = (reason) => {
        haveError = true;
        reject(reason);
      };

      // Get Hyperty descriptor
      // TODO: the request Module should be changed,
      // because at this moment it is incompatible with nodejs;
      // Probably we need to pass a factory like we do for sandboxes;
      console.info('[Runtime.Loader] ------------------ Hyperty ------------------------');
      console.info('[Runtime.Loader] Get hyperty descriptor for :', hypertyCatalogueURL);
      return this.descriptors.getHypertyDescriptor(hypertyCatalogueURL)
      .then((hypertyDescriptor) => {
        // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
        console.info('[Runtime.Loader] 1: return hyperty descriptor');

        // hyperty contains the full path of the catalogue URL, e.g.
        // catalogue.rethink.eu/.well-known/..........
        _hypertyDescriptor = hypertyDescriptor;

        let sourcePackageURL = hypertyDescriptor.sourcePackageURL;

        if (sourcePackageURL === '/sourcePackage') {
          return hypertyDescriptor.sourcePackage;
        }

        // Get the hyperty source code
        return this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
      }, handleError)
      .then((sourcePackage) => {
        if (haveError) return false;

        console.info('[Runtime.Loader] 2: return hyperty source code');

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
      }, handleError)
      .then((policyResult) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 3: return policy engine result' + policyResult);

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
          sandbox = this.registry.getAppSandbox();

          // we have completed step 11 here.
        } else {

          let domain = divideURL(hypertyCatalogueURL).domain;

          // getSandbox, this will return a promise;
          sandbox = this.registry.getSandbox(domain);
        }

        // this will return the sandbox or one promise to getSandbox;
        return sandbox;
      }, handleError)
      .then((sandbox) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 4: return the sandbox', sandbox);

        // Return the sandbox indepentely if it running in the same sandbox or not
        // we have completed step 14 here.
        return sandbox;
      }, (reason) => {
        if (haveError) return false;
        console.  Error('[Runtime.Loader] 4.1: Try to register a new sandbox');

        // check if the sandbox is registed for this hyperty descriptor url;
        // Make Steps xxx --- xxx
        // Instantiate the Sandbox

        let hypertyCapabilities = {};
        if (_hypertyDescriptor && _hypertyDescriptor.hasOwnProperty('capabilities')) {
          hypertyCapabilities = _hypertyDescriptor.stubCapabilities;
        }

        return this._runtimeFactory.createSandbox(hypertyCapabilities).then((sandbox) => {

          sandbox.addListener('*', (msg) => {
            this.messageBus.postMessage(msg);
          });

          return sandbox;
        });
      }, handleError)
      .then((sandbox) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 5: return sandbox and register');

        _hypertySandbox = sandbox;

        let numberOfAddresses = 1;
        return this._addressAllocation.create(this._registry._domain, numberOfAddresses, _hypertyDescriptor, 'hyperty', reuseURL);
      }, handleError)
      .then((addresses) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 6: return the addresses for the hyperty', addresses);

        // Register hyperty
        return this.registry.registerHyperty(_hypertySandbox, hypertyCatalogueURL, _hypertyDescriptor, addresses, IdpConstraint);
      }, handleError)
      .then((registrationResult) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 7: registration result', registrationResult);

        // we have completed step 16 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        _hypertyURL = registrationResult.url;

        // Extend original hyperty configuration;
        let configuration = {};
        if (!emptyObject(_hypertyDescriptor.configuration)) {
          try {
            configuration = Object.assign({}, JSON.parse(_hypertyDescriptor.configuration));
          } catch (e) {
            configuration = _hypertyDescriptor.configuration;
          }
        }
        configuration.runtimeURL = this._runtimeURL;

        if (registrationResult.p2pHandler) {
          configuration.p2pHandler = registrationResult.p2pHandler;
          configuration.p2pRequester = registrationResult.p2pRequester;
        }


        // We will deploy the component - step 17 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        try {
          return _hypertySandbox.deployComponent(_hypertySourcePackage.sourceCode, _hypertyURL, configuration);
        } catch (e) {
          console.  Error('[Runtime.Loader] Error on deploy component:', e);
          reject(e);
        }
      }, handleError)
      .then((deployComponentStatus) => {
        if (haveError) return false;
        console.info('[Runtime.Loader] 8: Deploy component status for hyperty: ', deployComponentStatus);

        // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        this.messageBus.addListener(_hypertyURL, (msg) => {
          _hypertySandbox.postMessage(msg);
        });

        // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        let hyperty = {
          runtimeHypertyURL: _hypertyURL,
          status: deployComponentStatus
        };

        console.info('[Runtime.Loader] Hyperty: ', hyperty);
        resolve(hyperty);

        // we have completed step 21 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        console.info('[Runtime.Loader] ------------------ END ------------------------');
      }, handleError)
      .catch(errorReason);
    });
  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     protostubURL    Catalogue URL for the ProtoStub to be loaded or the domain to be target by the protostub
  * @param  {Object}      p2pConfig       configuration of p2p
  */
  loadStub(protostubURL, p2pConfig) {

    if (!this._readyToUse()) return false;
    if (!protostubURL) throw new   Error('[Runtime.Loader.loadStub]ProtoStub descriptor url parameter is needed');

    return new Promise((resolve, reject) => {

      // to analyse if domain for p2pHandlers should be something else and not the default domain itself

      let domain = divideURL(protostubURL).domain;

      if (!domain) {
        domain = protostubURL;
      }

      let _stubSandbox;
      let _stubDescriptor;
      let _runtimeProtoStubURL;
      let _stubSourcePackage;
      let haveError = false;
      let stubId;

      let errorReason = (reason) => {
        console.  Error('[Runtime.Loader.loadStub]Something failed on the deploy of protocolstub: ', reason);
        reject(reason);
      };

      let handleError = (reason) => {
        haveError = true;
        reject(reason);
      };

      // Discover Protocol Stub
      let discoverStub;
      let isP2PHandler = false;
      let isP2PRequester = false;
      let stubCapabilities = {};

      console.info('[Runtime.Loader.loadStub] starting loading for ', protostubURL, ' with p2pconfig ', p2pConfig);
      console.info('[Runtime.Loader.loadStub]Discover or Create a new ProtoStub for domain: ', domain);

      // step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
      try {
        if (p2pConfig) {

          if (p2pConfig.hasOwnProperty('isHandlerStub') && p2pConfig.isHandlerStub) {
            // step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            isP2PHandler = true;
            stubId = this.runtimeURL;
            discoverStub = this.registry.discoverP2PStub();
          } else {
            isP2PRequester = true;
            let p2pHandlerRuntimeURL = p2pConfig.remoteRuntimeURL;
            stubId = p2pHandlerRuntimeURL;

            // step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

            // step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            discoverStub = this.registry.discoverP2PStub(p2pHandlerRuntimeURL);
          }

        } else {
          // step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          stubId = domain;
          discoverStub = this.registry.discoverProtostub(domain);
        }

        // Is registed?
        console.info('[Runtime.Loader.loadStub]1. Proto Stub Discovered for ', protostubURL, ': ', discoverStub);

        // step 23 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        resolve(discoverStub);
        console.info(' [Runtime.Loader]------------------- END ---------------------------\n');

      } catch (reason) {

        // is not registed?
        console.info('[Runtime.Loader.loadStub]1. Proto Stub not found ' + reason);

        // step 8 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        this.descriptors.getStubDescriptor(protostubURL)
        .then((stubDescriptor) => {

          if (haveError) return false;
          console.info('[Runtime.Loader.loadStub]2. return the ProtoStub descriptor');

          // step 9 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          _stubDescriptor = stubDescriptor;

          let sourcePackageURL = stubDescriptor.sourcePackageURL;

          if (sourcePackageURL === '/sourcePackage') {
            return stubDescriptor.sourcePackage;
          }

          // step 10 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
        }, handleError)
        .catch(errorReason)
        .then((stubSourcePackage) => {
          if (haveError) return false;

          // According to debug, it seems RuntimeCatalogue does not support yet constraints. It appears empty!!!!

          if (_stubDescriptor && _stubDescriptor.constraints) {
            stubCapabilities = _stubDescriptor.constraints;
          }

          // step 11 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          console.info('[Runtime.Loader.loadStub]3. return the ProtoStub Source Code');
          _stubSourcePackage = stubSourcePackage;

          // this will return the sandbox or one promise to getSandbox;
          // step 12 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this.registry.getSandbox(domain, stubCapabilities);
        })
        .then((stubSandbox) => {
          if (haveError) return false;

          // step 15 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          console.info('[Runtime.Loader.loadStub]4. if the sandbox is registered then return the sandbox ', stubSandbox);

          _stubSandbox = stubSandbox;
          return stubSandbox;
        })
        .catch((reason) => {
          if (haveError) return false;

          // step 13 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          console.info('[Runtime.Loader.loadStub]5. Sandbox was not found, creating a new one ', reason);

          // check if the sandbox is registed for this stub descriptor url;


          // step 14 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this._runtimeFactory.createSandbox(stubCapabilities).then((sandbox) => {

            sandbox.addListener('*', (msg) => {
              this.messageBus.postMessage(msg);
            });

            return sandbox;
          });

        })
        .then((sandbox) => {
          if (haveError) return false;

          // step 16 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          console.info('[Runtime.Loader.loadStub]6. return the sandbox instance and register', sandbox, 'to domain ', domain);

          _stubSandbox = sandbox;

          // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this.registry.registerStub(_stubSandbox, stubId, p2pConfig, protostubURL, _stubDescriptor);
        }, handleError)
        .then((runtimeProtoStub) => {
          if (haveError) return false;

          // step 23 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          console.info('[Runtime.Loader.loadStub] 7. return the runtime protostub url: ', runtimeProtoStub);

          _runtimeProtoStubURL = runtimeProtoStub.url;

          // Extend original hyperty configuration;
          let configuration = {};
          if (!emptyObject(_stubDescriptor.configuration)) {
            try {
              configuration = Object.assign({}, JSON.parse(_stubDescriptor.configuration));
            } catch (e) {
              configuration = _stubDescriptor.configuration;
            }
          }

          if (p2pConfig) {
            try {
              configuration = Object.assign(configuration, JSON.parse(p2pConfig));
            } catch (e) {
              configuration = Object.assign(configuration, p2pConfig);
            }
          }

          // required for protostub session

          configuration.runtimeURL = this._runtimeURL;

          // step 24 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          try {
            // step 26 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            console.info('[Runtime.Loader.loadStub] 8: adding sandbox listener to protostubURL : ', _runtimeProtoStubURL);

            // step 27 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            // Add the message bus listener
            this.messageBus.addListener(_runtimeProtoStubURL, (msg) => {
              _stubSandbox.postMessage(msg);
            });

            return _stubSandbox.deployComponent(_stubSourcePackage.sourceCode, _runtimeProtoStubURL, configuration);
          } catch (e) {
            console.    Error('[Runtime.Loader.loadStub] Error on deploy component:', e);
            reject(e);
          }
        }, handleError)
        .then(() => {
          if (haveError) return false;


          // step 28 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          let stub;
          if (p2pConfig) {
            console.log('[Runtime.Loader.loadStub] p2pConfig: ', p2pConfig);

            if (p2pConfig.hasOwnProperty('isHandlerStub')) stub = this.registry.p2pHandlerStub[this._runtimeURL];
            if (p2pConfig.hasOwnProperty('p2pRequesterStub')) stub = this.registry.p2pRequesterStub[p2pConfig.remoteRuntimeURL];
          } else {
            stub = this.registry.protostubsList[domain];
          }

          console.log('[Runtime.Loader.loadStub] Stub: ', stub);
          resolve(stub);
          console.info('[Runtime.Loader.loadStub]------------------- END ---------------------------\n');
        }, handleError)
        .catch(errorReason);

      }

    });

  }

  /**
  * Deploy idpProxy from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */

  loadIdpProxy(idpProxyURL) {

    if (!this._readyToUse()) return false;
    if (!idpProxyURL) throw new   Error('[Runtime.Loader] IdpProxy descriptor url parameter is needed');

    return new Promise((resolve, reject) => {

      let domain = divideURL(idpProxyURL).domain;

      if (!domain) {
        domain = idpProxyURL;
      }

      let _proxySandbox;
      let _proxyDescriptor;
      let _runtimeIdpProxyURL;
      let _proxySourcePackage;
      let haveError = false;

      let errorReason = (reason) => {
        console.  Error('[Runtime.Loader] Something failed on the deploy of IdpProxy: ', reason);
        reject(reason);
      };

      let handleError = (reason) => {
        haveError = true;
        reject(reason);
      };

      // Discover IDPProxy
      console.info('[Runtime.Loader] ------------------- IDP Proxy Deploy ---------------------------\n');
      console.info('[Runtime.Loader] Discover or Create a new IdpProxy for domain/URL: ', domain);

      try {
        let runtimeIdpProxyURL = this.registry.discoverIdpProxy(domain);

        // Is registed?
        console.info('[Runtime.Loader] 1. IDPProxy Discovered: ', runtimeIdpProxyURL);

        // we have completed step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        let idpProxy = this.registry.idpProxyList[domain];
        console.log('Deployed: ', idpProxy);

        resolve(idpProxy);
        console.info('[Runtime.Loader] ------------------- END ---------------------------\n');
      } catch (reason) {

        // is not registed?
        console.info('[Runtime.Loader] 1. IdpProxy not found:', reason);

        // we have completed step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // we need to get ProtoStub descriptor step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        this.descriptors.getIdpProxyDescriptor(idpProxyURL)
        .then((proxyDescriptor) => {

          console.info('[Runtime.Loader] 2. Return the IDPProxy descriptor');

          // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          _proxyDescriptor = proxyDescriptor;

          let sourcePackageURL = proxyDescriptor.sourcePackageURL;

          if (sourcePackageURL === '/sourcePackage') {
            return proxyDescriptor.sourcePackage;
          }

          // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
        }, handleError)
        .then((sourcePackage) => {
          if (haveError) return false;
          console.info('[Runtime.Loader] 3. return the IDPProxy source package');

          // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _proxySourcePackage = sourcePackage;

          // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
          let policy = true;
          return policy;
        }, handleError)
        .then((policy) => {
          if (haveError) return false;

          // this will return the sandbox or one promise to getSandbox;
          return this.registry.getSandbox(domain);
        })
        .then((proxySandbox) => {
          if (haveError) return false;
          console.info('[Runtime.Loader] 4. if the sandbox is registered then return the sandbox', proxySandbox);

          _proxySandbox = proxySandbox;
          return proxySandbox;
        })
        .catch((reason) => {
          if (haveError) return false;
          console.info('[Runtime.Loader] 5. Sandbox was not found, creating a new one', reason);

          let proxyCapabilities = {};
          if (_proxyDescriptor && _proxyDescriptor.hasOwnProperty('capabilities')) {
            _proxyDescriptor = _proxyDescriptor.stubCapabilities;
          }

          return this._runtimeFactory.createSandbox(proxyCapabilities).then((sandbox) => {

            sandbox.addListener('*', (msg) => {
              this.messageBus.postMessage(msg);
            });

            return sandbox;
          });
        })
        .then((sandbox) => {
          if (haveError) return false;
          console.info('[Runtime.Loader] 6. return the sandbox instance and register', sandbox, 'to domain ', domain);

          _proxySandbox = sandbox;

          // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return this.registry.registerIdpProxy(sandbox, domain);
        }, handleError)
        .then((runtimeIdpProxyURL) => {
          if (haveError) return false;
          console.info('[Runtime.Loader] 7. Return the runtime Idp Proxy URL: ', runtimeIdpProxyURL);

          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _runtimeIdpProxyURL = runtimeIdpProxyURL;

          // Extend original hyperty configuration;
          let configuration = {};
          if (!emptyObject(_proxyDescriptor.configuration)) {
            try {
              configuration = Object.assign({}, JSON.parse(_proxyDescriptor.configuration));
            } catch (e) {
              configuration = _proxyDescriptor.configuration;
            }
          }
          configuration.runtimeURL = this._runtimeURL;

          // Deploy Component step xxx
          try {
            // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

            // Add the message bus listener
            this.messageBus.addListener(_runtimeIdpProxyURL, (msg) => {
              _proxySandbox.postMessage(msg);
            });

            return _proxySandbox.deployComponent(_proxySourcePackage.sourceCode, runtimeIdpProxyURL, configuration);
          } catch (e) {
            console.  Error('[Runtime.Loader] Error on deploy component:', e);
            reject(e);
          }
        }, handleError)
        .then(() => {
          if (haveError) return false;


          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          // Load Stub function resolved with success;
          // let idpProxy = {
          //   runtimeIdpProxyURL: _runtimeIdpProxyURL,
          //   status: deployComponentStatus
          // };

          //this.registry.idpProxyList[domain].status = 'deployed';
          let idpProxy = this.registry.idpProxyList[domain];

          console.log('[Runtime.Loader.loadIdpProxy] 8: loaded: ', idpProxy);

          resolve(idpProxy);
          console.info('[Runtime.Loader.loadIdpProxy] ------------------- END ---------------------------\n');

        }, handleError)
        .catch(errorReason);
      }

    });
  }

  // Check if the loader is ready to load all components
  _readyToUse() {

    let status = false;

    if (!this._runtimeURL) throw new   Error('[Runtime.Loader] The loader need the runtime url address');
    if (!this._messagesBus) throw new   Error('[Runtime.Loader] The loader need the messageBus component');
    if (!this._registry) throw new   Error('[Runtime.Loader] The loader need the registry component');
    if (!this._runtimeFactory) throw new   Error('[Runtime.Loader] The loader need the runtime factory component');

    status = true;
    return status;
  }

}

export default Loader;
