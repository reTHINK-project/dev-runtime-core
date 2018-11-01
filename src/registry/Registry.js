/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('Registry');

import { runtimeUtils } from '../runtime/runtimeUtils';
import { SandboxType} from '../sandbox/Sandbox';

import AddressAllocation from '../allocation/AddressAllocation';
import HypertyInstance from './HypertyInstance';
import DomainRegistration from './DomainRegistration';
import P2PConnectionResolve from './P2PConnectionResolve';

import { divideURL, isHypertyURL, isURL, isUserURL, generateGUID, getUserIdentityDomain, isBackendServiceURL, deepClone, removePathFromURL } from '../utils/utils.js';

import 'proxy-observe';
import { WatchingYou } from '../Utils';

// import DiscoveryServiceFramework from './DiscoveryServiceFramework';

const STATUS = { CREATED: 'created', LIVE: 'live', DEPLOYING: 'deploying', DEPLOYED: 'deployed', PROGRESS: 'in-progress', DISCONNECTED: 'disconnected', FAILED: 'deployment-failed', DEAD: 'dead' };

/*import IdentityManager from './IdentityManager';
import Discovery from './Discovery';*/

/**
* Runtime Registry Interface
*/
class Registry {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {AppSandbox}          appSandbox            appSandbox
  * @param  {runtimeCatalogue}    runtimeCatalogue      runtimeCatalogue
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  * @param  {storageManager}      storageManager
  */
  constructor(runtimeURL, appSandbox, identityModule, runtimeCatalogue, runtimeCapabilities, storageManager, p2pHandlerURL, remoteRegistry) {

    // how some functions receive the parameters for example:
    // new Registry('hyperty-runtime://sp1/123', appSandbox, idModule, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing.');

    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/

    let _this = this;

    _this.registryURL = runtimeURL + '/registry/';
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.p2pHandlerURL = p2pHandlerURL;
    _this.runtimeCatalogue = runtimeCatalogue;
    _this.remoteRegistry = remoteRegistry;
    _this.idModule = identityModule;
    _this.storageManager = storageManager;
    _this.runtimeCapabilities = runtimeCapabilities;
    _this.identifier = generateGUID();

    _this.hypertiesListToRemove = {};
    _this.hypertiesList = [];
    _this.remoteHypertyList = [];
    _this.remoteDataObjectList = [];
    _this.idpLegacyProxyList = {};

    _this.watchingYou = new WatchingYou();
    _this.p2pHandlerStub = {};
    _this.p2pRequesterStub = _this.watchingYou.watch('p2pRequesterStub', {}, true);
    _this.p2pConnectionList = _this.watchingYou.watch('p2pConnectionList', {}, true);
    _this.p2pHandlerAssociation = {};

    _this.protostubsList = _this.watchingYou.watch('protostubsList', {}, true);
    _this.idpProxyList = _this.watchingYou.watch('idpProxyList', {}, true);
    _this.dataObjectList = {};
    _this.subscribedDataObjectList = {};
    _this.sandboxesList = {sandbox: {}, appSandbox: {} };
    _this.pepList = {};
    _this.registries = {};

    _this._domain = divideURL(_this.registryURL).domain;
    _this.sandboxesList.appSandbox[runtimeURL] = appSandbox;
    let p2pConnectionResolve = new P2PConnectionResolve(_this);

    _this._p2pConnectionResolve = p2pConnectionResolve;

    _this._hypertyUrls = {};
    _this._dataObjectUrls = {};
  }

  loadRegistry() {

    let _this = this;

    return new Promise((resolve) => {
      _this.storageManager.get('registry:HypertyURLs').then((urlsList) => {
        if (urlsList) _this._hypertyUrls = urlsList;
        _this.storageManager.get('registry:DataObjectURLs').then((urlsList) => {
          if (urlsList) _this._dataObjectUrls = urlsList;
          resolve();
        });
      });
    });
  }

  set loader(loader) {
    let _this = this;
    _this._loader = loader;
  }

  get loader() {
    let _this = this;
    return _this._loader;
  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;

    _this._messageBus.addListener(_this.registryURL, function(msg) {

      // log.log('[Registry listener] ', msg);

      let isHyperty = isHypertyURL(msg.from);
      let hasCriteria = msg.body.hasOwnProperty('criteria');
      let isURLResource;
      let isUserResource;
      let isHypertyResource;

      if (msg.body.hasOwnProperty('resource') && msg.body.resource !== '.') {
        isURLResource = isURL(msg.body.resource);
        isUserResource = isUserURL(msg.body.resource);
        isHypertyResource = isHypertyURL(msg.body.resource);
      }
      let isDelete = msg.type === 'delete';
      let hasName;
      let hasUser;

      if (msg.body.hasOwnProperty('value')) {
        hasName = msg.body.value.hasOwnProperty('name');
        hasUser = msg.body.value.hasOwnProperty('user');
      }

      if (msg.type === 'response') {
        log.error('[Register listener] skipping ', msg);
        return;
      }

      // msg sent by identity manager library
      let userUrl = _this._getIdentityAssociated(msg.body.resource, msg.body.criteria);

      let reply = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {resource: userUrl}};
      reply.body.code = (userUrl) ? 200 : 404;

      _this._messageBus.postMessage(reply);

    });

    // Install AddressAllocation
    let addressAllocation = AddressAllocation.instance;
    _this.addressAllocation = addressAllocation;

    _this._domainRegistration = new DomainRegistration(_this.runtimeURL,_this.registryURL, _this._domain, messageBus);

    // log.log('[Registry - AddressAllocation] - ', addressAllocation);
  }


  _getIdentityAssociated(type, hypertyURL) {
    let _this = this;

    for (let hyperty in _this.hypertiesList) {
      let value = _this.hypertiesList[hyperty];

      if (value._hypertyURL === hypertyURL) {
        switch (type) {
          case 'username':
            return value._user.username;
          case 'cn':
            return value._user.cn;
          case 'locale':
            return value._user.locale;
          case 'avatar':
            return value._user.avatar;
          case 'userURL':
            return value._user.userURL;
          case '.':
            return value._user;
          default:
            return '';
        }
      }
    }
    return '';
  }

  /**
  * This function is used to return the sandbox instance where the Application is executing. It is assumed there is just one App per Runtime instance.
  */
  getAppSandbox() {
    let _this = this;
    return _this.appSandbox;
  }

  /**
  * This function returns the user associated to the hyperty URL
  * @param    {String}    hypertyURL      hyperty URL
  * @return   {String}    userURL         user URL
  */
  getHypertyOwner(hypertyURL) {

    let _this = this;
    let userURL;

    for (let index in _this.hypertiesList) {
      let hyperty = _this.hypertiesList[index];

      if (hyperty.hypertyURL === hypertyURL) {
        return hyperty.user.userURL;
      }
    }
    return userURL;
  }

  /**
  * This function returns the user associated to the hyperty URL
  * @param    {String}    dataObjectURL      dataObjectURL URL
  * @return   {String}    userURL         user URL
  */
  getDataObjectReporter(dataObjectURL) {

    let _this = this;
    let DOurl = removePathFromURL(dataObjectURL);
    for (let index in _this.dataObjectList) {
      let dataObject = _this.dataObjectList[index];

      if (dataObject.url === DOurl) {
        return dataObject.reporter;
      }
    }
    return null;
  }

  /**
  * returns the hyperty Name from a given url. This url could be from a dataObject or hyperty
  * @param    {String}    url      hyperty or dataObject URL
  * @return   {String}    hypertyName     hyperty Name
  */
  getHypertyName(url) {
    let _this = this;

    let isHypertyURL = divideURL(url).type === 'hyperty';

    //value to be returned in the end
    let hypertyName;

    //if is not an hyperty, check if is a dataObject and obtain his reporter
    let hypertyURL = isHypertyURL ? url : _this.getReporterURLSynchonous(url);

    for (let index in _this.hypertiesList) {
      let hyperty = _this.hypertiesList[index];
      if (hyperty.hypertyURL === hypertyURL) {
        hypertyName = hyperty.objectName;
        break;
      }
    }
    return hypertyName;
  }

  /**
  * function to return the reporterURL associated with the dataobject URL
  * @param    {String}     dataObjectURL    dataObjectURL
  * @return   {String}     reporterURL      reporterURL
  */
  getReporterURL(dataObjectURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dataObject = _this.dataObjectList[dataObjectURL];

      if (dataObject) {
        resolve(dataObject.reporter);
      } else {
        reject('No reporter was found');
      }
    });
  }

  /**
  * function to return the reporterURL associated with the dataobject URL. no promise returned
  * @param    {String}     dataObjectURL    dataObjectURL
  * @return   {String}     reporterURL      reporterURL
  */
  getReporterURLSynchonous(dataObjectURL) {
    let _this = this;

    let dataObject = _this.dataObjectList[dataObjectURL];

    return (dataObject) ? dataObject.reporter : undefined;
  }

  /**
  * returns the hyperty URL that subscribed the dataObject
  * @param    {String}     url            url format
  * @return   {String}    Hyperty URL subscribed to the URL
  */
  getDataObjectSubscriberHyperty(url) {
    let _this = this;

    return _this.subscribedDataObjectList[url];
  }

  /**
  * register a desired dataObject to subscribe
  * @param    {String}    dataObjectURL      dataObject URL
  */
  registerSubscribedDataObject(dataObjectURL, hypertyURL) {
    let _this = this;
    if (_this.subscribedDataObjectList[dataObjectURL] === undefined) {
      _this.subscribedDataObjectList[dataObjectURL] = hypertyURL;
    }
  }

  /**
  * Function to return the list of pre authorised users received in the creation of a data object
  * @param    {String}            dataObjectURL    dataObjectURL
  * @return   {Array<String>}     preAuth         List of pre authorised users
  */
  getPreAuthSubscribers(dataObjectURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];
    let preAuth = [];

    if (dataObject) {
      preAuth = dataObject.authorise;
    }
    return preAuth;
  }

  /**
  * send requests to unregister all hyperties registered in domain registry
  * @return   {Promise}     return a promise if the result of unregistration all hyperties
  */
  unregisterAllHyperties() {
    let _this = this;

    let unregisterResults = [];

    return new Promise(function(resolve, reject) {

      for (let index in _this.hypertiesList) {
        let hyperty = _this.hypertiesList[index];
        let result = _this.unregisterHypertyInstance(hyperty.hypertyURL);
        unregisterResults.push(result);
      }

      Promise.all(unregisterResults).then(() => {

        resolve('successfully unregistered all hyperties');
      }, error => { reject(error); });
    });
  }

  /**
  *  function to unregister an hypertyInstance in the Domain Registry
  *  @param   {String}      hypertyInstance   HypertyInsntance url
  *
  */
  unregisterHypertyInstance(hypertyInstance) {
    //TODO working but the user
    let _this = this;

    let closeMsg = { type: 'execute', from: _this.registryURL,
      to: hypertyInstance,
      body: { method: 'close' }};

    // Send message to hyperty to close
    _this._messageBus.postMessage(closeMsg, (reply) => {
      log.log('[Registry.unregisterHypertyInstance] Close Reply', reply);

      _this._domainRegistration.unregisterHyperty(hypertyInstance);

    });
  }

  /**
  *  function to unregister a Data Object in the Domain Registry
  *  @param   {String}      hypertyInstance   HypertyInsntance url
  *
  */
  unregisterDataObject(url) {
    this._domainRegistration.unregisterDataObject(url);
  }


  /**
  * register a new subscriber in the dataObject registered
  * @param  {String}   dataObjectURL    dataObject URL
  * @param  {String}   subscriberURL    subscriber URL
  */
  registerSubscriber(dataObjectURL, subscriberURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];

    if (dataObject) {

      if (!dataObject.subscribers) dataObject.subscribers = [];

      dataObject.subscribers.push(subscriberURL);
      _this.dataObjectList[dataObjectURL] = dataObject;
    }
  }

  /**
  * get the subscribers registered within a dataObject
  * @param  {String}          dataObjectURL    dataObject URL
  * @param  {Array<String>}   Substribers List
  */
  getDataObjectSubscribers(dataObjectURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];

    if (dataObject) {
      return dataObject.subscribers;
    } else {
      throw 'No dataObject was found';
    }

  }

  /**
  * To register a new Data Object in the runtime which returns the dataObjectURL allocated to the new Data Object.
  * @param  {String}      identifier                  identifier
  * @param  {String}      dataObjectschema            dataObjectschema
  * @param  {String}      dataObjectUrl               dataObjectUrl
  * @param {String}      dataObjectReporter           dataObjectReporter
  * @param  {Array}     resources                     dataObject resources
  * @param  {Array}     authorise                     list of pre authorised authorised IDs
  */
  //registerDataObject(identifier, dataObjectschema, dataObjectUrl, dataObjectReporter, resources, addressURL, authorise) {
  registerDataObject(objectRegistration) {
    let _this = this;

    let registration = deepClone(objectRegistration);

    return new Promise(function(resolve, reject) {


      _this.dataObjectList[objectRegistration.url] = objectRegistration;

//      _this.storageManager.get('registry:DataObjectURLs').then((urlsList) => {

/*        if (!urlsList) {
          urlsList = {};
        }*/

        //update the list with the new elements
        _this._dataObjectUrls[objectRegistration.name + objectRegistration.schema + objectRegistration.resources + objectRegistration.reporter] = objectRegistration.url;

        // step to obtain the list of all URL registered to updated with the new one.
        _this.storageManager.set('registry:DataObjectURLs', 0, _this._dataObjectUrls).then(() => {

          if (_this.isInterworkingProtoStub(registration.reporter)) {
            registration.interworking = true;
          }

          let domainRegistration = true;

          if (registration.hasOwnProperty("domain_registration"))
          domainRegistration = registration.domain_registration;

          if (domainRegistration)
            _this._domainRegistration.registerDataObject(registration,objectRegistration.resume, _this.p2pHandlerStub).then(( registered ) =>{ resolve(registered) });
          else resolve(registration);

        }).catch(function(reason) {
          log.error('[Registry registerDataObject] Error: ', reason);
          reject(reason);
        });
      });
//    });
  }


  _getResourcesAndSchemes(descriptor) {
    let _this = this;

    return new Promise((resolve)=> {

      let resources;

      // check if the hyperty resources is a vector or a string
      // TODO delete later when catalogue is fixed
      if (typeof (descriptor.hypertyType) === 'string') {
        resources = [];
        resources.push(descriptor.hypertyType);
      } else {
        resources = descriptor.hypertyType;
      }

      let objName = descriptor.objectName;

      let descriptorDataSchema = descriptor.dataObjects;
      let dataSchemasArray = [];

      //this will create a array with a Promise in each position
      for (let index in descriptorDataSchema) {
        dataSchemasArray.push(_this.runtimeCatalogue.getDataSchemaDescriptor(descriptorDataSchema[index]));
      }

      // as soon as the previous array is completed, this will wait for the resolve of all promises in the array
      Promise.all(dataSchemasArray).then(function(dataSchemas) {

        let filteredDataSchemas = [];
        for (let index in dataSchemas) {
          let dataSchema = dataSchemas[index];
          filteredDataSchemas.push(dataSchema.sourcePackage.sourceCode.properties.scheme.constant);
        }

        // log.log('[Registry] Hyperty Schemas', filteredDataSchemas);
        // log.log('[Registry] Hyperty resources', resources);

        resolve({resources: resources, dataSchema: filteredDataSchemas, name: objName});
      });
    });
  }

  /**
  * method that returns previously registered Hyperty or DataObjects URLS, for given characteristics
  * @param  {JSON}        info           object or hyperty charateristics info
  * @return {addressURL}  addressURL     return the URL if there is any previousy registered URL, return undefined otherwise
  */
  checkRegisteredURLs(info, reuseURL) {
    let _this = this;

    return new Promise((resolve) => {

      let objectType = (info.reporter) ? 'registry:DataObjectURLs' : 'registry:HypertyURLs';

      if (typeof(reuseURL) === 'string') {
        objectType = reuseURL && divideURL(reuseURL).type !== 'hyperty' ? 'registry:DataObjectURLs' : 'registry:HypertyURLs';
      }
      //debugger;
      _this.storageManager.get(objectType).then((urlsList) => {

        if (!urlsList) {
          urlsList = {};
        }

        if (typeof(reuseURL) === 'string') {
          log.info('[Registry - checkRegisteredURLs] - look for ' + reuseURL + ' on ', urlsList);

          let searchResult = Object.keys(urlsList).map((key) => {
            let indexOf = urlsList[key].indexOf(reuseURL);
            return urlsList[key][indexOf];
          });

          log.info('[Registry - checkRegisteredURLs] - found ' + searchResult.length + ' results on ', searchResult);
          if (searchResult.length === 1) {
            return resolve(searchResult);
          } else {
            return resolve(undefined);
          }
        }

        if (objectType === 'registry:HypertyURLs') {
          _this._getResourcesAndSchemes(info).then((value) => {
            if (urlsList[value.resources + value.dataSchema + value.name]) {
              // log.log('[Registry] reusage of hyperty URL');
              return resolve(urlsList[value.resources + value.dataSchema + value.name]);
            } else {
              // log.log('[Registry] no hyperty URL was previously registered ');
              return resolve(undefined);
            }
          });
        } else {

          let characteristics = info.name + info.schema + info.resources + info.reporter;

          if (urlsList[characteristics]) {
            // log.log('[Registry] reusage of dataObject URL');
            if (typeof(urlsList[characteristics]) === 'string') {
              let arrayToResolve = [];
              arrayToResolve.push(urlsList[characteristics]);
              return resolve(arrayToResolve);
            } else {
              return resolve(urlsList[characteristics]);
            }
          } else {
            // log.log('[Registry] no dataObject URL was previously registered');
            return resolve(undefined);
          }
        }

      });

    });
  }


  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Sandbox}             sandbox               sandbox
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
  * @param {object} IdpConstraint - constraints to be used when selecting the identity to be associated with the Hyperty including origin, idp, and idHint.
  * @return {HypertyURL}          HypertyURL
  */
  registerHyperty(sandbox, descriptorURL, descriptor, addressURL, IdpConstraint) {
    let _this = this;

    let hypertyCapabilities;

    return new Promise(function(resolve, reject) {


      _this.idModule.getIdentityAssertion(IdpConstraint).then(function(result) {

        let userProfile = result.userProfile;

        // log.log('[Registry registerHyperty] userProfile', userProfile);

        if (_this._messageBus === undefined) {
          reject('[Registry registerHyperty] MessageBus is undefined');
        } else {
          //call check if the protostub exist: to be removed
          /*  _this.resolve(domainUrl).then(function(a) {
            // log.log('[Registry registerHyperty] stub to domain registry- ', a);*/

//          _this.storageManager.get('registry:HypertyURLs').then((urlsList) => {

        

            // log.log('[Registry registerHyperty] storageManager] - ', urlsList);

            _this._getResourcesAndSchemes(descriptor).then((value) => {

              hypertyCapabilities = value;

/*              if (!urlsList) {
                urlsList = {};
              }*/

              _this._hypertyUrls[hypertyCapabilities.resources + hypertyCapabilities.dataSchema + hypertyCapabilities.name] = addressURL.address;
              _this.storageManager.set('registry:HypertyURLs', 0, _this._hypertyUrls).then(() => {


                //check whether the received sanbox e ApplicationSandbox or a normal sandbox
                if (sandbox.type === 'app') {
                  _this.sandboxesList.appSandbox[addressURL.address[0]] = sandbox;
                } else if (sandbox.type === 'normal') {
                  _this.sandboxesList.sandbox[addressURL.address[0]] = sandbox;
                } else {
                  reject('Wrong SandboxType');
                }

                let p2pHandler;
                let p2pRequester;

                if (Object.keys(_this.p2pHandlerStub).length !== 0) {
                  p2pHandler = _this.p2pHandlerStub[_this.runtimeURL].url;
                  p2pRequester = runtimeUtils.runtimeDescriptor.p2pRequesterStub;
                }

                let hyperty = new HypertyInstance(_this.identifier, _this.registryURL, descriptorURL, descriptor,
                  addressURL.address[0], userProfile, 'guid', _this.runtimeURL, 'ctx', p2pHandler,
                 p2pRequester, hypertyCapabilities.dataSchema, hypertyCapabilities.resources);

                _this.hypertiesList.push(hyperty);

                /*--- start here move p2p and domain registry related features to a separated function.-------..*/

                let registrationAtdomain = true;

                if ( descriptor.hasOwnProperty("_configuration") && descriptor.configuration.hasOwnProperty("domain_registration")) {
                  registrationAtdomain = descriptor.configuration.domain_registration;
                  }

                  if (registrationAtdomain) _this._domainRegistration.registerHyperty(hyperty, addressURL.newAddress).then((registered)=> {resolve(registered)});
                  else resolve({ url: hyperty.hypertyURL});

             /*------------------- END HERE MOVE DOMAIN REGISTRY ------------------*/
              }).catch(function(reason) {
                // log.log('[Registry registerHyperty] Error: ', reason);
                reject(reason);
              });
            });
//          });
        }
      }, function(err) {
        reject('[Registry registerHyperty] ', err);
      });
    });
  }



  /**
  * To unregister a previously registered Hyperty
  * @param  {HypertyURL}          HypertyURL url        url
  */
  unregisterHyperty(url) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let found = false;
      let index = 0;

      for	(index = 0; index < _this.hypertiesList.length; index++) {
        let hyperty = _this.hypertiesList[index];
        if (hyperty !== undefined) {
          if (hyperty.hypertyURL === url) {
            found = true;
            break;
          }
        }
      }

      if (found === false) {
        reject('Hyperty not found');
      } else {
        delete _this.hypertiesList[index];
        resolve('Hyperty successfully deleted');
      }
    });

  }

  /**
  * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL
  */
  discoverProtostub(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    let dividedURL = divideURL(url);
    let domainURL = dividedURL.domain;

    if (_this.protostubsList.hasOwnProperty(domainURL) && _this.protostubsList[domainURL].status === STATUS.LIVE) {
      return (_this.protostubsList[domainURL]);
    } else {

      _this.protostubsList[domainURL] = {
        status: STATUS.DEPLOYING
      };

      throw new Error('[Registry - discoverProtoStub ] Message Node Protostub Not Found. Creating one');

    }

  }

  /**
  * To discover protocol stubs available in the runtime for a certain remote runtime URL. If available, it returns the runtime url for the protocol stub that connects to the requested domain.
  * Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {RuntimeURL}           RuntimeURL            url
  * @return {p2pRequester}           RuntimeURL
  */
  discoverP2PStub(runtimeURL) {
    let _this = this;

    if (runtimeURL) {

      if (_this.p2pRequesterStub.hasOwnProperty(runtimeURL) && _this.p2pRequesterStub[runtimeURL].status === STATUS.LIVE) {
        return (_this.p2pRequesterStub[runtimeURL]);
      } else {
        _this.p2pRequesterStub[runtimeURL] = {
          status: STATUS.CREATED
        };

        throw new Error('[Registry - discoverP2PStub ] P2P Requester Stub Not Found. Creating one');

      }
    } else {

      if (_this.p2pHandlerStub.hasOwnProperty(_this.runtimeURL)) {
        return (_this.p2pHandlerStub[_this.runtimeURL]);
      } else {
        _this.p2pHandlerStub[_this.runtimeURL] = {
          status: STATUS.CREATED
        };

        throw new Error('[Registry - discoverP2PStub ] P2P Handler Stub Not Found.');
      }

    }

  }

  /**
   * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param  {Sandbox}       Sandbox
   * @param  {stubID}        Domain or hyperty runtime to register the stub
   * @param  {descriptorURL}     Catalogue URL of the Protostub descriptor
   * @param  {descriptor}     Protostub descriptor
   * @return {RuntimeProtoStubURL}
   */
  registerStub(sandbox, stubID, p2pConfig, descriptorURL, descriptor) {
    let _this = this;

    let _stubDescriptor = descriptor;

    return new Promise(function(resolve, reject) {

      let runtimeProtoStubURL;

      //check if messageBus is registered in registry or not
      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      log.info('[Registry - registerStub] - stubID ', stubID);

      /* if (!stubID.indexOf('msg-node.')) {
        stubID = stubID.substring(stubID.indexOf('.') + 1);
      }*/

      let P2PRequesterStub;

      if (p2pConfig) {

        if (p2pConfig.hasOwnProperty('isHandlerStub') && p2pConfig.isHandlerStub) {
          runtimeProtoStubURL = _this.p2pHandlerURL;

          _this.p2pHandlerStub[stubID] = {
            url: runtimeProtoStubURL,
            status: STATUS.CREATED
          };

          _this.p2pHandlerAssociation[_this.runtimeURL] = [];

          _this.sandboxesList.sandbox[runtimeProtoStubURL] = sandbox;
          log.info('[Registry - registerStub - P2PHandlerStub] - ', stubID, ' - ', runtimeProtoStubURL);
          resolve(_this.p2pHandlerStub[stubID]);
        } else {
          P2PRequesterStub = p2pConfig.p2pRequesterStub;
          runtimeProtoStubURL = 'runtime://' + divideURL(p2pConfig.remoteRuntimeURL).domain + '/p2prequester/' + generateGUID();
          log.info('[Registry - registerStub - P2PRequesterStub] - ', P2PRequesterStub, ' - ', runtimeProtoStubURL);

          // to be clarified what is this p2pHandlerAssociation
          _this.p2pHandlerAssociation[_this.runtimeURL].push(runtimeProtoStubURL);
          _this.p2pRequesterStub[stubID] = {
            url: runtimeProtoStubURL,
            status: STATUS.CREATED
          };

          _this.sandboxesList.sandbox[runtimeProtoStubURL] = sandbox;

          //Setup P2P Requester path into MN

          let msg = {
            type: 'subscribe',
            from: _this.registryURL,
            to: 'domain://msg-node.' + _this._domain + '/sm',
            body: {
              subscribe: [runtimeProtoStubURL],
              source: _this.registryURL
            }
          };

          _this._messageBus.postMessage(msg, (reply) => {
            // log.log('[Registry - register Stub] p2pRequester path setup: ', reply);
          });

          resolve(_this.p2pRequesterStub[stubID]);
        }
      } else {
        console.log('[Registry - registerStub - Normal Stub] descriptor', descriptor);

        if ( !typeof(descriptor) === 'string' && descriptor.hasOwnProperty('_interworking') && descriptor._interworking) {
          runtimeProtoStubURL = 'runtime://' + stubID + '/protostub/' + 'scheme1';
        } else {
          runtimeProtoStubURL = 'runtime://' + stubID + '/protostub/' + generateGUID();
        }

        log.info('[Registry - registerStub - Normal Stub] - ', stubID);

        // TODO: Optimize this
        _this.protostubsList[stubID] = {
          url: runtimeProtoStubURL,
          status: STATUS.DEPLOYING
        };

        if (descriptorURL) {
          _this.protostubsList[stubID].descriptorURL = descriptorURL;
        }

        if (_stubDescriptor && (_stubDescriptor.interworking)) {
          _this.protostubsList[stubID].interworking = _stubDescriptor.interworking;
        }

        _this.sandboxesList.sandbox[runtimeProtoStubURL] = sandbox;

        resolve(_this.protostubsList[stubID]);
      }

      // resolve(runtimeProtoStubURL);

      _this._messageBus.addListener(runtimeProtoStubURL + '/status', (msg) => {
        _this._onProtostubStatusEvent(msg);
      });

    });

  }

  /**
  * To Process status events fired by protostubs
  * @param  {Message}   message     Event Message
  */

  _onProtostubStatusEvent(msg) {

    let _this = this;

    // log.log('[Registry onProtostubStatusEvent]: ', msg);

    let runtimeProtoStubURL = msg.from;

    if (!msg.to.includes('/status')) {
      log.error('[Registry onProtostubStatusEvent] Not Status Event: ', msg);
      return;
    } else {// broadcast Protostub status event to all Hyperties
      let from =  msg.from;
      msg.from = _this.runtimeURL;
      msg.to = _this.runtimeURL+'/status';
      msg.body.resource = from;
      _this._messageBus.postMessage(msg);
    }

    // process status events from message node protostubs

    if (runtimeProtoStubURL.includes('/protostub/')) {

    // TODO: uncomment below when protostubs are updated with new status value "live"
      Object.keys(_this.protostubsList).filter((key) => {
        return _this.protostubsList[key].url === runtimeProtoStubURL;
      }).map((key) => {
        _this.protostubsList[key].status = msg.body.value;

        // log.log('[Registry - onProtostubStatusEvent] - Protostub status: ', _this.protostubsList[key]);
      });
    } else { // process status events from p2p connections

      if (msg.body.resource) {
        let remoteRuntimeURL = msg.body.resource;

        if (_this.p2pConnectionList[remoteRuntimeURL]) {
          _this.p2pConnectionList[remoteRuntimeURL].status =  msg.body.value;
          _this.p2pConnectionList[remoteRuntimeURL].url =  runtimeProtoStubURL;
        } else {

          let  p2pConnection = {
            status: msg.body.value,
            url: runtimeProtoStubURL
          };

          _this.p2pConnectionList[remoteRuntimeURL] =  p2pConnection;
        }

        // log.log('[Registry - onProtostubStatusEvent] - P2PConnection status: ', _this.p2pConnectionList[remoteRuntimeURL]);

        // Update P2P Requester protostub if it is coming from there
        if (runtimeProtoStubURL.includes('/p2prequester/')) {
          _this.p2pRequesterStub[remoteRuntimeURL].status = msg.body.value;

          // log.log('[Registry - onProtostubStatusEvent] - P2P Requester status: ', _this.p2pRequesterStub[remoteRuntimeURL]);
        } else {
          // if from P2PHandler with status disconencted, lets remove from p2pConnectionList
          if (msg.body.value === 'disconnected') delete _this.p2pConnectionList[remoteRuntimeURL];
        }

      } else {
        if (runtimeProtoStubURL.includes('/p2prequester/')) {
          // It is an event from P2P Requester without mandatory "resource" field
          log.error('[Registry onProtostubStatusEvent] resource missing: ', msg);
          return;
        } else {
          // It is an event from P2P Handler
          _this.p2pHandlerStub[_this.runtimeURL].status = msg.body.value;

          // log.log('[Registry - onProtostubStatusEvent] - P2PHandler Stub status: ', _this.p2pHandlerStub[_this.runtimeURL]);
        }
      }

    }

  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
  */
  unregisterStub(hypertyRuntimeURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      if (_this.protostubsList.hasOwnProperty(hypertyRuntimeURL)) {
        delete _this.protostubsList[hypertyRuntimeURL];
        resolve('ProtostubURL removed');
      } else {
        reject('Error on unregisterStub: Hyperty not found');
      }
    });
  }

  /**
   * To register a new Identity Provider proxy in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param {Sandbox}        Sandbox
   * @param  {DomainURL}     DomainURL service provider domain
   * @return {RuntimeIdpProxyURL}
   */
  registerIdpProxy(sandbox, domainURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let idpProxyStubURL;

      //check if messageBus is registered in registry or not
      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      idpProxyStubURL = 'domain-idp://' + domainURL + '/stub/' + generateGUID();

      // TODO: Optimize this
      _this.idpProxyList[domainURL] = {
        url: idpProxyStubURL,
        status: STATUS.DEPLOYING
      };

      _this.sandboxesList.sandbox[idpProxyStubURL] = sandbox;

      // sandbox.addListener('*', function(msg) {
      //   _this._messageBus.postMessage(msg);
      // });

      resolve(idpProxyStubURL);

      _this._messageBus.addListener(idpProxyStubURL + '/status', (msg) => {
        _this._onIdpProxyStatusEvent(msg);
      });
    });
  }

  /**
  * To Process status events fired by Idp Proxies
  * @param  {Message}   message     Event Message
  */

  _onIdpProxyStatusEvent(msg) {

    let _this = this;

    // log.log('[Registry onIdpProxyStatusEvent]: ', msg);

    let idpProxyURL = msg.from;

    if (!msg.to.includes('/status')) {
      log.error('[Registry onIdpProxyStatusEvent] Not Status Event: ', msg);
      return;
    }

    Object.keys(_this.idpProxyList).filter((key) => {
      return _this.idpProxyList[key].url === idpProxyURL;
    }).map((key) => {
      _this.idpProxyList[key].status = msg.body.value;

      // log.log('[Registry - onIdpProxyStatusEvent] - Idp Proxy status: ', _this.idpProxyList[key]);
    });

  }

  /**
  * To discover idpProxy stubs available in the runtime for a certain domain. If available, it returns the runtime url for the idpProxy stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL         idpProxyUrl
  */
  discoverIdpProxy(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    let dividedURL = divideURL(url);
    let domainURL = dividedURL.domain;

    if (_this.idpProxyList.hasOwnProperty(domainURL) && _this.idpProxyList[domainURL].status === STATUS.LIVE) {
      return (_this.idpProxyList[domainURL]);
    } else {

      _this.idpProxyList[domainURL] = {
        status: STATUS.PROGRESS
      };

      throw new Error('[Registry - discoverIdpProxy ] Idp Proxy Not Found. Creating one');

    }

  }

  /**
  * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
  * @param  {Message.Message} postMessage postMessage
  * @param  {HypertyURL}          HypertyURL            hyperty
  * @return {HypertyRuntimeURL}   HypertyRuntimeURL
  */
  registerPEP(postMessage, hyperty) {
    let _this = this;

    return new Promise(function(resolve) {
      //TODO check what parameter in the postMessage the pep is.
      _this.pepList[hyperty] = postMessage;
      resolve('PEP registered with success');
    });

  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
  */
  unregisterPEP(HypertyRuntimeURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let result = _this.pepList[HypertyRuntimeURL];

      if (result === undefined) {
        reject('Pep Not found.');
      } else {
        resolve('PEP successfully removed.');
      }
    });

  }

  /**
  * To discover sandboxes available in the runtime for a certain domain and a certain set of capabilities. Required by the runtime UA to avoid more than one sandbox for the same domain.
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeSandbox}           RuntimeSandbox
  */
  getSandbox(url, constraints) {
    if (!url) throw new Error('Parameter url needed');

    // log.log('[Registry getSandbox] getSandbox for: ', url, ' and capabilities: ', constraints);

    let _this = this;
    return new Promise(function(resolve, reject) {

      let request;

      //first try to find the url in the appSandbox list
      request = _this.sandboxesList.appSandbox[url];

      //if no appSandbox was found, try to search in the normal sandboxes list
      if (!request) {
        request = _this.sandboxesList.sandbox[url];

        if (!request) {

          let domain;

          if (url.includes('://')) {
            domain = divideURL(url).domain;
          } else {
            domain = url;
          }

          // search in the sandboxes list for a entry containing the domain given
          for (let sandbox in _this.sandboxesList.sandbox) {
            //todo: uncomment sandbox constraints match condition with runtime sharing
            if (sandbox.includes(domain) && _this.sandboxesList.sandbox[sandbox].matches(constraints)) {
              const current = _this.sandboxesList.sandbox[sandbox];
              const match = Object.keys(constraints).filter(constraint => {
                return (constraint === 'browser' && current.type === SandboxType.NORMAL) ||
                      (constraint === 'windowSanbox' && current.type === SandboxType.WINDOW);

              }).length > 0 ? true : false;

              if (match) { request = current; }
              break;
            }
          }
        }
      }

      if (!request) {
        reject('no sandbox found for: ' + url);
      } else {
        resolve(request);
      }

    });
  }

  resolveNormalStub(url) {
    // log.log('resolveNormalStub ' + url);
    let _this = this;

    return new Promise((resolve, reject) => {

      //split the url to find the domainURL. deals with the url for example as:
      //"hyperty-runtime://sp1/protostub/123",
      let dividedURL = divideURL(url);
      let domainUrl = dividedURL.domain;
      let type = dividedURL.type;

      if (url.includes(_this.runtimeURL)) {
        log.error('[Registry - resolve] URL to be resolved should have listeners ', url);
        reject('[Registry - resolve] URL to be resolved should have listeners ', url);
      }

      // resolve the domain protostub in case of a message to global registry
      if (url.includes('global://registry')) {
        domainUrl = _this._domain;
      } else {
        if (!domainUrl.indexOf('msg-node.') || !domainUrl.indexOf('registry.')) {
          domainUrl = domainUrl.substring(domainUrl.indexOf('.') + 1);
        }
      }

      _this.isLegacy(url).then((isLegacy) => {

        // if legacy it should resolve for <protocol>.<domain>
        if (isLegacy && type !== 'domain-idp') {
          domainUrl = type + '.' + getUserIdentityDomain(url);
        }

        log.info('[Registry.resolve] domainUrl:', domainUrl);

        let registredComponent;

        if (type === 'domain-idp') {
          registredComponent  = _this.idpProxyList.hasOwnProperty(domainUrl) ? _this.idpProxyList[domainUrl] : false;
        } else {
          registredComponent  = _this.protostubsList.hasOwnProperty(domainUrl) ? _this.protostubsList[domainUrl] : false;
        }

        log.info('[Registry.resolve] registred:', registredComponent);

        // TODO since the protostubs have other states this should be revised, because the status could change from DEPLOYED to LIVE
        // TODO and this validation will trigger a new load of IDPProxy or Protostub;
        if (registredComponent && registredComponent.hasOwnProperty('status') &&
         (registredComponent.status === STATUS.DEPLOYED || registredComponent.status === STATUS.CREATED ||
          registredComponent.status === STATUS.LIVE || registredComponent.status === STATUS.DISCONNECTED)) {
          log.info('[Registry.resolve] Resolved: ', registredComponent.url, registredComponent.status);
          resolve(registredComponent.url);
        } else {
          //todo: use switch-case to support other types of stubs
          if (type === 'domain-idp') {

            // The IdP Proxy does not exist, let's prepare its deployment by watching its status

            _this.watchingYou.observe('idpProxyList', (change) => {

              // log.log('[Registry - resolveNormalStub] idpProxyList changed ' + _this.idpProxyList);

              let keypath = change.keypath;

              if (keypath.includes('status'))
                keypath = keypath.replace('.status', '');

              if (keypath === domainUrl && change.name === 'status' && change.newValue === STATUS.CREATED) {
                // log.log('[Registry - resolveNormalStub] idpProxyList is live ' + _this.idpProxyList[domainUrl]);
                resolve(_this.idpProxyList[domainUrl].url);
              }
            });

            if (!registredComponent) {
              // this process will load the idp proxy, because is not yet registered;
              log.info('[Registry.resolveNormalStub] deploy new IDPProxy: ', domainUrl);
              _this.loader.loadIdpProxy(domainUrl).then(() => {

                log.info('[Registry.resolveNormalStub] IdP Proxy deployed: ', _this.idpProxyList[domainUrl]);

              }).catch((reason) => {
                log.error('[Registry.resolve] Error resolving Load IDPProxy: ', reason);
                _this.idpProxyList[domainUrl].status = 'deployment-failed';
                reject(reason);
              });
            }


          } else {

            // The protoStub does not exist, let's prepare its deployment by watching its status

            _this.watchingYou.observe('protostubsList', (change) => {

              // log.log('[Registry - resolveNormalStub] protostubsList changed ' + _this.protostubsList);

              let keypath = change.keypath;

              if (keypath.includes('status'))
                keypath = keypath.replace('.status', '');

              if (keypath === domainUrl && change.name === 'status' && change.newValue === STATUS.CREATED) {
                // log.log('[Registry - resolve] protostub is live ' + _this.protostubsList[domainUrl]);
                resolve(_this.protostubsList[domainUrl].url);
              }
            });

            if (!registredComponent) {
              // lets deploy the protostub
              log.info('[Registry.resolve] trigger new ProtocolStub: ', domainUrl);
              _this.loader.loadStub(domainUrl).then(() => {

                // log.log('[Registry - resolveNormalStub] Stub deployed: ', _this.protostubsList[domainUrl]);
              }).catch((reason) => {
                log.error('[Registry.resolveNormalStub] Error resolving Load ProtocolStub: ', reason);
                reject(reason);
              });
            }

          }

        }

      }).catch((reason) => {
        log.error('[Registry.resolve] Error resolving islegacy: ', reason);
        reject(reason);
      });

    });

  }

  /**
  * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint).
  * @param  {URL.URL}  url       url
  * @return {Promise<URL.URL>}                 Promise <URL.URL>
  */
  resolve(msg) {
    log.info('[Registry - Resolve] -  ', msg);
    let _this = this;

    return new Promise((resolve, reject) => {

      let url = msg.to ? msg.to : msg;

      let p2p = (msg.body && msg.body.p2p) ? msg.body.p2p : false;

      // log.log('P2P: ', p2p, url);
      // log.log('P2P - p2pHandlerStub: ', !_this.p2pHandlerStub[_this.runtimeURL], _this.p2pHandlerStub, _this.runtimeURL);
      // log.log('P2P - isBackendServiceURL: ', isBackendServiceURL(url), isBackendServiceURL, url);
      // log.log('P2P - includes runtimeURL: ', url.includes(_this.runtimeURL));
      // log.log('P2P - includes p2phandler: ', url.includes('/p2phandler/'));
      // log.log('P2P - includes p2prequester: ', url.includes('/p2prequester/'));

      // Skip p2p procedure when not supported by the Runtime or for backend services

      if (!_this.p2pHandlerStub[_this.runtimeURL] || isBackendServiceURL(url) || url.includes(_this.runtimeURL) || url.includes('/p2phandler/') || url.includes('/p2prequester/')) {

        log.info('[Registry - resolve] - Resolve normal stub: ', _this.p2pHandlerStub, _this.runtimeURL, isBackendServiceURL(url), p2p, url);
        _this.resolveNormalStub(url).then((returnURL) => {
          resolve(returnURL);
        });

      } else {

        log.info('[Registry - resolve] - checkP2P: ', p2p, url, _this._p2pConnectionResolve);
        _this._p2pConnectionResolve.checkP2P(msg).then((registeredP2P) => {

          // log.log('[Registry - resolve] found registered P2P: ', registeredP2P);

          let p2pConnection = _this.p2pConnectionList[registeredP2P.runtime];

          if (!p2pConnection) {
            p2pConnection = registeredP2P;
            _this.p2pConnectionList[registeredP2P.runtime] = p2pConnection;
          }

          switch (p2pConnection.status) {
            case STATUS.LIVE:
              msg.body.peer = registeredP2P.runtime;
              resolve(p2pConnection.url, msg);
              break;
            case STATUS.CREATED: // p2p connection setup is ongoing, use MN Stub
            case STATUS.PROGRESS:
              _this.resolveNormalStub(url).then((returnURL) => {
                resolve(returnURL);
              });
              break;
            case STATUS.DISCONNECTED: // p2p connection stub was disconnected, let's ask to connect again
              log.info('[Registry - Resolve] - p2pConnection is disconnected lets try to reconnect');
              _this._p2pConnectionResolve.reconnectP2PRequester(p2pConnection).then((returnURL) => {
                // log.log('[Registry - Resolve] - was reconnected with p2pRequesterStubt: ', returnURL);
                resolve(returnURL);
              }, (reason) => {
                log.info('[Registry - Resolve] - Reason: ', reason);

                _this.resolveNormalStub(url).then((returnURL) => {
                  resolve(returnURL);
                });
              });
              break;
            default:

              log.info('[Registry - resolve] - P2P: ', p2p);
              if (!p2p) { // no p2p connection exists and the message sender does not ask one. Lets use the MN Stub
                _this.resolveNormalStub(url).then((returnURL) => {
                  resolve(returnURL);
                });

              } else {
                _this._setupP2PRequester(registeredP2P).then((returnURL) => { // no p2p connection exists but the message sender is asking one. Lets try to setup one
                  resolve(returnURL);
                }, (reason) => {
                  log.info('[Registry - Resolve] - Reason: ', reason);

                  _this.resolveNormalStub(url).then((returnURL) => {
                    resolve(returnURL);
                  });
                });
              }
              break;
          }
        }, (reason) => {
          log.info('[Registry - Resolve] - Reason: ', reason);

          _this.resolveNormalStub(url).then((returnURL) => {
            resolve(returnURL);
          });
        });
      }

    });
  }

  _setupP2PRequester(input) {
    let _this = this;

    log.log('[Registry._setupP2PConnection] loadStub with p2pRequester: ', input);

    return new Promise((resolve, reject) => {

      let remoteRuntime = input.runtime;

      let p2pConfig = { remoteRuntimeURL: remoteRuntime, p2pHandler: input.p2pHandler, p2pRequesterStub: true };

      // lets prepare the p2pRequesterSTub deployment by setting an observer to its status changes

      _this.watchingYou.observe('p2pRequesterStub', (change) => {

        log.log('[Registry._setupP2PConnection] p2pRequesterStubs changed ' + _this.p2pRequesterStub);

        if (change.keypath.split('.')[0] === remoteRuntime && change.name === 'status' && change.newValue === STATUS.LIVE) {
          log.log('[Registry._setupP2PConnection] p2pRequester is live ' + _this.p2pRequesterStub[remoteRuntime]);
          resolve(_this.p2pRequesterStub[remoteRuntime].url);
        }
      });

      //  stub load
      _this.loader.loadStub(input.p2pRequester, p2pConfig).then(() => {

        log.log('[Registry._setupP2PConnection] p2pRequester deployed: ', _this.p2pRequesterStub[remoteRuntime]);


      }).catch((error) => {
        reject(error);
      });
    });
  }

  /**
  * To verify if url is for a legacy service.
  * @param  {URL.URL}  url      url
  * @return {boolean}
  */
  isLegacy(url) {

    let _this = this;

    return new Promise((resolve, reject) => {

      if (url === _this._domain) {
        return resolve(false);
      }

      log.log('[Registry] [Registry.Registry.isLegacy] ', url);

      // TODO: to be defined in the runtime configuration
      let nonLegacy = ['hyperty-runtime', 'domain', 'global', 'hyperty'];

      let urlDivided = divideURL(url);

      if (nonLegacy.indexOf(urlDivided.type) !== -1 || urlDivided.domain === _this._domain) {
        return resolve(false);
      }

      // process User URLs
      if (url.split('@').length > 1) {
        let domain = urlDivided.domain;

        // log.log('[Registry] [Registry.Registry.isLegacy] domain: ', domain);
        if (_this.idpLegacyProxyList.hasOwnProperty(domain)) {

          let result = _this.idpLegacyProxyList[domain];

          if (result.interworking) {
            return resolve(result.interworking);
          } else {
            return resolve(false);
          }
        }

        _this._loader.descriptors.getIdpProxyDescriptor(domain).then((result) => {

          // log.log('[Registry] [Registry.Registry.isLegacy] Legacy stub descriptor: ', result);

          if (result.interworking) {
            _this.idpLegacyProxyList[domain] = result;
            resolve(result.interworking);
          } else {
            resolve(false);
          }

        }).catch((reason) => {
          log.warn('problem loading idp proxy descriptor for domain:', domain, ' because ', reason);
          reject(reason);
        });
      } else { // process protostub URLs
        resolve(_this.isInterworkingProtoStub(url));
      }
    });
  }

  /**
  * To verify if URL is locally registered or not.
  * @param  {URL.URL}  url      url
  * @return {boolean}
  */

  isLocal(url) {

    let runtimeScheme = ['hyperty-runtime', 'runtime'];
    let hypertyScheme = ['hyperty'];
    let urlScheme = url.split('://')[0];

    // Process Runtime Core URLs.
    // Messages originated from protostubs should also not include the runtimeURL in its URL.

    if (runtimeScheme.indexOf(urlScheme) !== -1) {
      return url.includes(this.runtimeURL);
    }

    // Process Hyperty URLs
    // Todo: hypertiesList should be an object not an array

    if (hypertyScheme.indexOf(urlScheme) !== -1) {

      for (let index in this.hypertiesList) {
        let hyperty = this.hypertiesList[index];
        if (hyperty.hypertyURL === url) {
          return true;
        }
      }

      return false;
    }

    // Process Data Object URLs

    if (url.includes('/subscription')) {
      url = url.substring(0, url.indexOf('/subscription'));
    }

    let dataObject = this.dataObjectList[url];

    if (dataObject) {
      if (dataObject.interworking) {
        return !dataObject.interworking;
      }
      return true;
    }

    return false;
  }

  /**
  * To verify if protostub is to interwork with a legacy domain.
  * @param  {URL.URL}  runtimeProtostubURL      The runtime URL of the Protostub
  * @return {boolean}
  */

  isInterworkingProtoStub(runtimeProtostubURL) {

    let _this = this;

    if (typeof runtimeProtostubURL === 'boolean') {
      return false;
    }

    if (!(runtimeProtostubURL.includes('/protostub/'))) {
      return false;
    }

    let filtered = Object.keys(_this.protostubsList).filter((key) => {
      return _this.protostubsList[key].url === runtimeProtostubURL;
    }).map((key) => {

      if (_this.protostubsList[key].hasOwnProperty('interworking')) {
        return _this.protostubsList[key].interworking;
      } else {
        return false;
      }
    })[0];

    return filtered;
  }
}

export default Registry;
