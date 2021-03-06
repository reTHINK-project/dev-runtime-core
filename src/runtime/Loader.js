// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('Loader');
//import path from 'path';
//import System from 'systemjs/dist/system';

import { divideURL, emptyObject, getConfigurationResources, buildURL } from '../utils/utils';
import AddressAllocation from '../allocation/AddressAllocation';

class Loader {

  constructor(runtimeURL, runtimeConfiguration, runtimeDescriptorsInstance) {
    if (!runtimeConfiguration) throw Error('[Runtime.Loader] The descriptor need to know the runtime configuration');
    if (!runtimeDescriptorsInstance) throw Error('[Runtime.Loader] The descriptor need to know the runtime Descriptor instance');

    this.log = log;

    this.runtimeConfiguration = runtimeConfiguration;
    this.descriptors = runtimeDescriptorsInstance;
    console.log(System);
    console.log(AddressAllocation);
//    System.noConflict();

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

    log.log('[Loader - AddressAllocation] - ', addressAllocation);
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
  loadHyperty(hypertyUrl, reuseURL = false, IdpConstraint, appURL) {

    if (!this._readyToUse()) return false;
    if (!hypertyUrl) throw new Error('[Runtime.Loader] hypertyUrl parameter is needed');


    let _hypertyURL;
    let _hypertySandbox;
//    let _hypertySourcePackage;
    let haveError = false;
//    let hyperty = instance.name;
    let descriptorUrl = hypertyUrl.replace('.js', '.json');
    let hyperty;


    return new Promise((resolve, reject) => {

      let errorReason = (reason) => {
        log.info('[Runtime.Loader] Something failed on the deploy hyperty: ', reason);
        reject(reason);
      };
  
      let handleError = (reason) => {
        haveError = true;
        reject(reason);
      };
  
      System.import(hypertyUrl)
      .then( (result) =>{

        hyperty = new result.default();
//        log.log('[Loader._load] first import result ' + hyperty.name);

        return;
      })
        .then( () => {
         return this.descriptors.getDescriptor(descriptorUrl)
        })
         .then((descriptor)=>{
        log.info('[Runtime.Loader.loadHyperty] hyperty Instance ', hyperty);
      let _hypertyDescriptor = descriptor;

      _hypertyDescriptor.dataObjects[0] = _hypertyDescriptor.dataObjects[0].replace('%domain%', this._registry._domain);

      // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
      log.info('[Runtime.Loader] 1: return hyperty descriptor: ', _hypertyDescriptor);

      hyperty.name = descriptor.name;

      _hypertySandbox = this.registry.getAppSandbox();

      let numberOfAddresses = 1;
      //debugger;
      this._addressAllocation.create(this._registry._domain, numberOfAddresses, _hypertyDescriptor, 'hyperty', reuseURL)
      .then((addresses) => {
        if (haveError) return false;
        log.info('[Runtime.Loader] 6: return the addresses for the hyperty', addresses);

        // Register hyperty
        return this.registry.registerHyperty(_hypertySandbox, descriptorUrl, _hypertyDescriptor, addresses, IdpConstraint);
      }, handleError)
      .then((registrationResult) => {
        if (haveError) return false;
        log.info('[Runtime.Loader] 7: registration result', registrationResult);

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
          //            return _hypertySandbox.deployComponent(_hypertySourcePackage.sourceCode, _hypertyURL, configuration);
          return _hypertySandbox.deployComponent(hyperty, _hypertyURL, configuration);
        } catch (e) {
          log.info('[Runtime.Loader] Error on deploy component:', e);
          reject(e);
        }
      }, handleError)
      .then((deployComponentStatus) => {
        if (haveError) return false;
        log.info('[Runtime.Loader] 8: Deploy component status for hyperty: ', deployComponentStatus);

        // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

        // Add the message bus listener to the appSandbox or hypertSandbox;
        this.messageBus.addListener(_hypertyURL, (msg) => {
          _hypertySandbox.postMessage(msg);
        });

        // Add the message bus listener to the appSandbox or hypertSandbox;
        this.messageBus.addListener(this.runtimeURL + '/status', (msg) => {
          _hypertySandbox.postMessage(msg);
        });

        // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        let deployed = {
          runtimeHypertyURL: _hypertyURL,
          status: deployComponentStatus,
          name: hyperty.name,
          instance: hyperty
        };

        log.info('[Runtime.Loader] Hyperty deployed: ', deployed);
        resolve(hyperty);

        // we have completed step 21 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
        log.info('[Runtime.Loader] ------------------ END ------------------------');
      }, handleError)
      .catch(errorReason);
    });
  });
}

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     protostubURL    Catalogue URL for the ProtoStub to be loaded or the domain to be target by the protostub
  * @param  {Object}      p2pConfig       configuration of p2p
  */
  loadStub(protostubURL, p2pConfig) {

    if (!this._readyToUse()) return false;
    if (!protostubURL) throw new Error('[Runtime.Loader.loadStub]ProtoStub descriptor url parameter is needed');

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
      let stubInstance;

      let errorReason = (reason) => {
        log.info('[Runtime.Loader.loadStub]Something failed on the deploy of protocolstub: ', reason);
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

      log.info('[Runtime.Loader.loadStub] starting loading for ', protostubURL, ' with p2pconfig ', p2pConfig);
      log.info('[Runtime.Loader.loadStub]Discover or Create a new ProtoStub for domain: ', domain);

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
        log.info('[Runtime.Loader.loadStub]1. Proto Stub Discovered for ', protostubURL, ': ', discoverStub);

        // step 23 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        resolve(discoverStub);
        log.info(' [Runtime.Loader]------------------- END ---------------------------\n');

      } catch (reason) {

        // is not registed?
        log.info('[Runtime.Loader.loadStub]1. Proto Stub not found ' + reason);

        // see promise chaining at https://javascript.info/promise-chaining

        // step 8 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        return this._load('protocolstub', protostubURL)
          .then( (result) =>{
            
            if (haveError) return false;

            // step 9 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            _stubDescriptor = result.descriptor;
            log.info('[Runtime.Loader.loadStub]2. return the ProtoStub descriptor ', _stubDescriptor);
            stubInstance = result.instance;

/*            let sourcePackageURL = stubDescriptor.sourcePackageURL;

            if (sourcePackageURL === '/sourcePackage') {
              return stubDescriptor.sourcePackage;
            }*/

            // step 10 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
//            return this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);

/*          }, handleError)
          .catch(errorReason)
          .then((stubSourcePackage) => {
            if (haveError) return false;*/

            // According to debug, it seems RuntimeCatalogue does not support yet constraints. It appears empty!!!!

            if (_stubDescriptor && _stubDescriptor.constraints) {
              stubCapabilities = _stubDescriptor.constraints;
            }

            // step 11 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            log.info('[Runtime.Loader.loadStub]3. return the ProtoStub Source Code');
//            _stubSourcePackage = stubSourcePackage;

            // this will return the sandbox or one promise to getSandbox;
            // step 12 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            return this.registry.getSandbox(domain, stubCapabilities);
          })
          .then((stubSandbox) => {
            if (haveError) return false;

            // step 15 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            log.info('[Runtime.Loader.loadStub]4. if the sandbox is registered then return the sandbox ', stubSandbox);

            _stubSandbox = stubSandbox;
            return stubSandbox;
          })
          .catch((reason) => {
            if (haveError) return false;

            // step 13 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            log.info('[Runtime.Loader.loadStub]5. Sandbox was not found, creating a new one ', reason);

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
            log.info('[Runtime.Loader.loadStub]6. return the sandbox instance and register', sandbox, 'to domain ', domain);

            _stubSandbox = sandbox;

            // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            return this.registry.registerStub(_stubSandbox, stubId, p2pConfig, protostubURL, _stubDescriptor);
          }, handleError)
          .then((runtimeProtoStub) => {
            if (haveError) return false;

            // step 23 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            log.info('[Runtime.Loader.loadStub] 7. return the runtime protostub url: ', runtimeProtoStub);

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
              log.info('[Runtime.Loader.loadStub] 8: adding sandbox listener to protostubURL : ', _runtimeProtoStubURL);

              // step 27 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
              // Add the message bus listener
              this.messageBus.addListener(_runtimeProtoStubURL, (msg) => {
                _stubSandbox.postMessage(msg);
              });

              return _stubSandbox.deployComponent(stubInstance, _runtimeProtoStubURL, configuration);
            } catch (e) {
              log.error('[Runtime.Loader.loadStub] Error on deploy component:', e);
              reject(e);
            }
          }, handleError)
          .then(() => {
            if (haveError) return false;


            // step 28 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            let registeredStub;
            if (p2pConfig) {
              log.log('[Runtime.Loader.loadStub] p2pConfig: ', p2pConfig);

              if (p2pConfig.hasOwnProperty('isHandlerStub')) registeredStub = this.registry.p2pHandlerStub[this._runtimeURL];
              if (p2pConfig.hasOwnProperty('p2pRequesterStub')) registeredStub = this.registry.p2pRequesterStub[p2pConfig.remoteRuntimeURL];
            } else {
              registeredStub = this.registry.protostubsList[domain];
            }

            log.log('[Runtime.Loader.loadStub] Stub: ', registeredStub);
            resolve(stubInstance);
            log.info('[Runtime.Loader.loadStub]------------------- END ---------------------------\n');
          }, handleError)
          .catch(errorReason);

      }

    });

  }

  _load(type, url) {
//    return new Promise((resolve, reject) => {

      let domain;
      let stub;

      let originDividedURL = divideURL(this.runtimeURL);
      let originDomain = originDividedURL.domain;
      let loader = new System.constructor();
      let dividedURL = divideURL(url);
      domain = dividedURL.domain;
      let path = dividedURL.identity;

/*      let constraints = this.constraints;

      constraints.constraints.onlyAccessToken = true;
      constraints.constraints.onlyIdAssertionValidation = true;
      console.log('LOG HERE', constraints);*/
      if (url.includes('://')) {
        domain = dividedURL.domain;
        if (path) {
          stub = path.substring(path.lastIndexOf('/') + 1);
        } else {
          stub = 'default';
        }

      } else {
        stub = 'default';
        domain = url;
      } 

      let resource = getConfigurationResources(this.runtimeConfiguration, 'catalogueURLs', type);

      let ext = type === 'idp-proxy' ? '.idp' : '.ps';


      let loadingUrl = resource.prefix + domain + resource.suffix + stub + ext + '.js';
      log.log('[Loader._load] first import for ' + url);
      let protostubURL = resource.prefix + domain + resource.suffix + stub + ext + '.json';

      return loader.import(loadingUrl)
      .then((result) => {

        let instance = new result.default();

        return(instance);
      })
        .then( (instance) => {
         return this.descriptors.getDescriptor(protostubURL, instance)
         .then((descriptor)=>{
          return ({ "descriptor": descriptor, "instance": instance });
         });
        }).catch(() => {

        stub = domain;
        domain = originDomain;

        let loadingUrl2 = buildURL(this.runtimeConfiguration, 'catalogueURLs', type, stub, true);
        let descriptorUrl2 = loadingUrl2.replace('.js','.json');

        log.log('[Loader._load] 2nd import for ' + loadingUrl2);

        return loader.import(loadingUrl2).then((result2) => {

        let instance2 = new result2.default();

        return(instance2);
        })
        .then( (inst) => {
        return this.descriptors.getDescriptor(descriptorUrl2)
        .then(desc => {
          // return function or json
          return({ "descriptor": desc, "instance": inst})
        });
        });
    });
 
  }

  /**
  * Deploy idpProxy from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */

  loadIdpProxy(idpProxyURL) {

    if (!this._readyToUse()) return false;
    if (!idpProxyURL) throw new Error('[Runtime.Loader] IdpProxy descriptor url parameter is needed');

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
      let idpProxy;

      let errorReason = (reason) => {
        log.info('[Runtime.Loader] Something failed on the deploy of IdpProxy: ', reason);
        reject(reason);
      };

      let handleError = (reason) => {
        haveError = true;
        reject(reason);
      };

      // Discover IDPProxy
      log.info('[Runtime.Loader] ------------------- IDP Proxy Deploy ---------------------------\n');
      log.info('[Runtime.Loader] Discover or Create a new IdpProxy for domain/URL: ', domain);

      try {
        let runtimeIdpProxyURL = this.registry.discoverIdpProxy(domain);

        // Is registed?
        log.info('[Runtime.Loader] 1. IDPProxy Discovered: ', runtimeIdpProxyURL);

        // we have completed step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        let idpProxy = this.registry.idpProxyList[domain];
        log.log('Deployed: ', idpProxy);

        resolve(idpProxy);
        log.info('[Runtime.Loader] ------------------- END ---------------------------\n');
      } catch (reason) {

        // is not registed?
        log.info('[Runtime.Loader] 1. IdpProxy not found:', reason);

        // we have completed step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

        // we need to get ProtoStub descriptor step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
        // this.descriptors.getIdpProxyDescriptor(idpProxyURL)

        this._load('idp-proxy',idpProxyURL)
          .then((result) => {

            log.info('[Runtime.Loader] 2. Return the IDPProxy descriptor');

            // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            _proxyDescriptor = result.descriptor;

            idpProxy = result.instance;

/*            let sourcePackageURL = proxyDescriptor.sourcePackageURL;

            if (sourcePackageURL === '/sourcePackage') {
              return proxyDescriptor.sourcePackage;
            }

            // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            return this.runtimeCatalogue.getSourcePackageFromURL(sourcePackageURL);
          }, handleError)
          .then((sourcePackage) => {
            if (haveError) return false;
            log.info('[Runtime.Loader] 3. return the IDPProxy source package');

            // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

            _proxySourcePackage = sourcePackage;

            // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
            let policy = true;
            return policy;
          }, handleError)
          .then((policy) => {
            if (haveError) return false;*/

            // this will return the sandbox or one promise to getSandbox;
            return this.registry.getSandbox(domain);
          })
          .then((proxySandbox) => {
            if (haveError) return false;
            log.info('[Runtime.Loader] 4. if the sandbox is registered then return the sandbox', proxySandbox);

            _proxySandbox = proxySandbox;
            return proxySandbox;
          })
          .catch((reason) => {
            if (haveError) return false;
            log.info('[Runtime.Loader] 5. Sandbox was not found, creating a new one', reason);

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
            log.info('[Runtime.Loader] 6. return the sandbox instance and register', sandbox, 'to domain ', domain);

            _proxySandbox = sandbox;

            // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
            return this.registry.registerIdpProxy(sandbox, domain);
          }, handleError)
          .then((runtimeIdpProxyURL) => {
            if (haveError) return false;
            log.info('[Runtime.Loader] 7. Return the runtime Idp Proxy URL: ', runtimeIdpProxyURL);

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

              return _proxySandbox.deployComponent(idpProxy, runtimeIdpProxyURL, configuration);
            } catch (e) {
              log.info('[Runtime.Loader] Error on deploy component:', e);
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
            let registeredIdpProxy = this.registry.idpProxyList[domain];

            log.log('[Runtime.Loader.loadIdpProxy] 8: loaded: ', registeredIdpProxy);

            resolve(registeredIdpProxy);
            log.info('[Runtime.Loader.loadIdpProxy] ------------------- END ---------------------------\n');

          }, handleError)
          .catch(errorReason);
      }

    });
  }

  // Check if the loader is ready to load all components
  _readyToUse() {

    let status = false;

    if (!this._runtimeURL) throw new Error('[Runtime.Loader] The loader need the runtime url address');
    if (!this._messagesBus) throw new Error('[Runtime.Loader] The loader need the messageBus component');
    if (!this._registry) throw new Error('[Runtime.Loader] The loader need the registry component');
    if (!this._runtimeFactory) throw new Error('[Runtime.Loader] The loader need the runtime factory component');

    status = true;
    return status;
  }

}

export default Loader;
