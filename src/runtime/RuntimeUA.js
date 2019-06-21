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


import { log as logLevels } from '../logLevels';

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('RuntimeUA');

//Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import IdentityHandler from '../identity/IdentityHandler';
import PEP from '../policy/PEP';
import MessageBus from '../bus/MessageBus';
import { generateGUID } from '../utils/utils';
import AddressAllocation from '../allocation/AddressAllocation';
import cryptoManager from '../cryptoManager/CryptoManager';

import Loader from './Loader';
import { storage } from './Storage';
import Descriptors from './Descriptors';

import { runtimeConfiguration } from './runtimeConfiguration';
import MsgBusHandlers from './MsgBusHandlers';
import { runtimeUtils } from './runtimeUtils';

//import GraphConnector from '../graphconnector/GraphConnector';

import CoreDiscovery from '../discovery/CoreDiscovery';

import DataObjectsStorage from '../store-objects/DataObjectsStorage';
import HypertyResourcesStorage from '../hyperty-resource/HypertyResourcesStorage';
import SyncherManager from '../syncher/SyncherManager';
import SubscriptionManager from '../subscriptionManager/SubscriptionManager';
import RuntimeCoreCtx from '../policy/context/RuntimeCoreCtx';

/**
 * Runtime User Agent Interface will process all the dependecies of the core runtime;
 * @author Vitor Silva [vitor-t-silva@telecom.pt]
 * @version 0.4.0
 *
 * @property {runtimeFactory} runtimeFactory - Specific implementation for all environments;
 * @property {runtimeURL} runtimeURL - This identify the core runtime, should be unique;
 * @property {IdentityModule} identityModule - Identity Module;
 * @property {PEP} policyEngine - Policy Engine Module;
 * @property {Registry} registry - Registry Module;
 * @property {MessageBus} messageBus - Message Bus is used like a router to redirect the messages from one component to other(s)
 * @property {GraphConnector} graphConnector - Graph Connector handling GUID and contacts
 * @property {CoreDiscovery} coreDiscovery - Discovery for discovery hyperties/dataObjects
 */
class RuntimeUA {

  /**
   * Create a new instance of Runtime User Agent
   * @param {descriptor} runtimeDescriptor - pass all the hyperty runtime descriptor
   * @param {runtimeFactory} runtimeFactory - Specific implementation for the environment where the core runtime will run;
   * @param {domain} domainURL - specify the domain base for the runtime;
   */
  constructor(runtimeDescriptor, runtimeFactory, domain) {
    if (!runtimeDescriptor) throw new Error('The runtime descriptor is a needed parameter');
    if (!runtimeFactory) throw new Error('The sandbox factory is a needed parameter');
    if (!domain) throw new Error('You need the domain of runtime');

    // Configuration object with information related with servers
    this.runtimeConfiguration = Object.assign({ domain: domain }, runtimeConfiguration);
    this.runtimeFactory = runtimeFactory;

    this.log = log;
    this.logLevels = logLevels;

    if (runtimeDescriptor.p2pHandlerStub && typeof runtimeDescriptor.p2pHandlerStub === 'string' && runtimeDescriptor.p2pHandlerStub.includes('://')) {
      this.p2p = true;
    } else {
      this.p2p = false;
    }

    runtimeUtils.runtimeDescriptor = runtimeDescriptor;
    this.runtimeUtils = runtimeUtils;

    this.storages = {};

/*    if (typeof runtimeFactory.createRuntimeCatalogue === 'function') {
      this.runtimeCatalogue = runtimeFactory.createRuntimeCatalogue();
    } else {
      throw new Error('Check your Runtime Factory because it needs the Runtime Catalogue implementation');
    }*/




/*    if (typeof runtimeFactory.persistenceManager === 'function') {
      this.persistenceManager = runtimeFactory.persistenceManager();
    } else {
      throw new Error('Check your Runtime Factory because it needs the Persistence Manager implementation');
    }*/

    if (typeof runtimeFactory.storageManager === 'function') {

      this.storages = storage(runtimeFactory, this);

    } else {
      throw new Error('Check your Runtime Factory because it needs the Storage Manager implementation');
    }

    if (typeof runtimeFactory.runtimeCapabilities === 'function') {
      this.runtimeCapabilities = runtimeFactory.runtimeCapabilities(this.storages.capabilities);
    } else {
      log.info('Check your RuntimeFactory because it needs the Runtime Capabilities implementation');
    }

  }

  /**
   * Intialize the installation of runtime
   *
   * @access public
   * @return {Promise<Boolean, Error>} this is Promise and if the installation process happened without any problems returns true otherwise the error.
   *
   * @memberOf RuntimeUA
   */
  init(guid) {
    return new Promise((resolve, reject) => {

      this.domain = this.runtimeConfiguration.domain;


      log.info('[RuntimeUA - init] Starting ');

      try {
        let getCapabilities = this.runtimeCapabilities.getRuntimeCapabilities();
        let getRuntimeURL = this.storages.runtime.get('runtime:URL');
        let getStoredDataObjects = this.storages.syncherManager.get('syncherManager:ObjectURLs');
        let getHypertyStorageObjects = this.storages.hypertyResources.get();
        let getP2PHandlerURL = this.storages.runtime.get('p2pHandler:URL');
//        let getRemotes = this.storages.syncherManager.get('remotes');

        Promise.all([getRuntimeURL, getCapabilities, getStoredDataObjects, getHypertyStorageObjects, getP2PHandlerURL]).then((results) => {

          this.runtimeURL = results[0] ? results[0].runtimeURL : results[0];
          if (!this.runtimeURL) {
            this.runtimeURL = 'runtime://' + this.domain + '/' + generateGUID();
            this.storages.runtime.set('runtime:URL', 1, { runtimeURL: this.runtimeURL });
          }


          this.capabilities = results[1];
          Object.assign(runtimeUtils.runtimeCapabilities.constraints, results[1]);

          this._dataObjectsStorage = new DataObjectsStorage(this.storages.syncherManager, results[2] || {}, this.runtimeFactory, this.runtimeURL );

          this._hypertyResources = results[3] || {};

          this.p2pHandlerURL = results[4] ? results[4].p2pHandlerURL : results[4];
          if (!this.p2pHandlerURL) {
            this.p2pHandlerURL = this.runtimeURL + '/p2phandler/' + generateGUID();
            log.info('[RuntimeUA - init] P2PHandlerURL: ', this.p2pHandlerURL);

            this.storages.runtime.set('p2pHandler:URL', 1, { p2pHandlerURL: this.p2pHandlerURL });
          }

/*          log.info('[RuntimeUA - init] dataObjectsStorage remote load starting');
          this._dataObjectsStorage.loadRemote().then(()=> {
            log.info('[RuntimeUA - init] dataObjectsStorage remote load concluded');*/
            return this._loadComponents(guid);

//          });


        }).then((status) => {
          this._setNetworkStatusListeners();

          this._hypertyResourcesStorage = new HypertyResourcesStorage(this.runtimeURL, this.messageBus, this.storages.hypertyResources, this._hypertyResources);

          if (this.p2p) {
            log.info('[RuntimeUA - init] load p2pHandler: ', status);
            return this._loadP2PHandler();
          } else {
            log.info('[RuntimeUA - init] P2P not supported');
            return ('P2P Not Supported');
          }

        }).then((result) => {
          log.info('[runtime ua - init] - status: ', result);
          resolve(true);
        }, (reason) => {
          log.error('ERROR: ', reason);
          resolve(true);
        });

      } catch (e) {
        reject(e);
      }

    });

  }

  _setNetworkStatusListeners() {

    this.runtimeFactory.listenOnline( this._updateRuntimeStatus('online') );
    this.runtimeFactory.listenOffline( this._updateRuntimeStatus('offline') );

  }

  _updateRuntimeStatus(event) {

    let _this = this;

    _this.messageBus.postMessage({
      from: this.runtimeURL,
      to: this.runtimeURL+'/status',
      type: 'update',
      body: event
    });
  }

  _loadP2PHandler() {

    return new Promise((resolve) => {

      let runtimeDescriptor = runtimeUtils.runtimeDescriptor;
      let p2pStubHandler = runtimeDescriptor.p2pHandlerStub;

      let p2pConfig = {
        isHandlerStub: true,
        runtimeURL: this.runtimeURL
      };

      log.log('[RuntimeUA loadP2PHandler] P2PStubHandler: ', p2pStubHandler);

      this.loader.loadStub(p2pStubHandler, p2pConfig).then((result) => {

        let runtimeUAURL = this.runtimeURL + '/ua';
        let msg = {
          type: 'subscribe',
          from: runtimeUAURL,
          to: 'domain://msg-node.' + this.domain + '/sm',
          body: {
            subscribe: [result.url],
            source: this.runtimeURL
          }
        };

        this.messageBus.addListener(runtimeUAURL, (msg) => {
          log.log('[runtime ua - listener] - receive msg: ', msg);
        });

        this.messageBus.postMessage(msg, (reply) => {
          log.log('[runtime ua - postMessage] - reply: ', reply);
        });

        log.info('[runtime ua - p2p installation] - success: ', result);
        resolve(true);
      }).catch((reason) => {
        log.info('[runtime ua - p2p installation] - fail: ', reason);
        resolve(false);
      });

    });

  }

  /**
   *
   * @access private
   * @return {Promise<Boolean, Error>} this is Promise and returns true if all components are loaded with success or an error if someone fails.
   *
   * @memberOf RuntimeUA
   */
  _loadComponents(guid) {

    return new Promise((resolve, reject) => {

      try {

        // Prepare the on instance to handle with the fallbacks and runtimeCatalogue;
        this.descriptorInstance = new Descriptors(this.runtimeURL, this.runtimeConfiguration);

        // Prepare the loader to load the hyperties, protostubs and idpproxy;
        this.loader = new Loader(this.runtimeURL, this.runtimeConfiguration, this.descriptorInstance);

        // Instantiate the identity Module
        this.identityModule = new IdentityModule(this.runtimeURL, this.runtimeCapabilities, this.storages.identity, this._dataObjectsStorage, cryptoManager);

        // Use the sandbox factory to create an AppSandbox;
        // In the future can be decided by policyEngine if we need
        // create a AppSandbox or not;
        let appSandbox = this.runtimeFactory.createAppSandbox();

        // Instantiate the Registry Module
        this.registry = new Registry(this.runtimeURL, appSandbox, this.identityModule, this.runtimeCapabilities, this.storages.registry, this.p2pHandlerURL);

        // Set the loader to load Hyperties, Stubs and IdpProxies
        this.registry.loader = this.loader;

        // Instantiate the Message Bus
        this.messageBus = new MessageBus(this.registry, this.runtimeURL);

        // Instanciate the SubscriptionManager;
        this.subscriptionManager = new SubscriptionManager(this.runtimeURL, this.messageBus, this.storages.subscriptions);

        // Prepare the address allocation instance;
        this.addressAllocation = new AddressAllocation(this.runtimeURL, this.messageBus, this.registry, this.subscriptionManager);

        // Instantiate the Policy Engine
        this.policyEngine = new PEP(new RuntimeCoreCtx(this.runtimeURL, this.identityModule, this.registry, this.storages.policy, this.runtimeCapabilities));

        // Instantiate Discovery
        this.coreDiscovery = new CoreDiscovery(this.runtimeURL, this.messageBus, this.graphConnector, this.runtimeFactory, this.registry);

        // Instantiate the identityHandler
        this.identityHandler = new IdentityHandler(this.identityModule);

        // initialise the CryptoManager
        cryptoManager.init(this.runtimeURL, this.runtimeCapabilities, this.storages.cryptoManager, this._dataObjectsStorage, this.registry, this.coreDiscovery, this.identityModule, this.runtimeFactory);

        // Instantiate the Graph Connector
//        this.graphConnector = process.env.MODE !== 'light' ? new GraphConnector(this.runtimeURL, this.messageBus, this.storageManager) : null;

        this.handlers = new MsgBusHandlers(this.policyEngine, this.identityHandler, cryptoManager);

        // (un)comment bellow to not encrypt messages

        this.messageBus.pipelineOut.handlers = [this.handlers.idmHandler, this.handlers.pepOutHandler];
        this.messageBus.pipelineIn.handlers = [ this.handlers.pepInHandler];

        // (un)comment bellow to encrypt messages

//      this.messageBus.pipelineOut.handlers = [this.handlers.idmHandler, this.handlers.pepOutHandler, this.handlers.encryptHandler];
//      this.messageBus.pipelineIn.handlers = [this.handlers.decryptHandler, this.handlers.pepInHandler];

        // Add to App Sandbox the listener;
        appSandbox.addListener('*', (msg) => {
          this.messageBus.postMessage(msg);
        });

        cryptoManager.messageBus = this.messageBus;

        // Register messageBus on Registry
        this.registry.messageBus = this.messageBus;

        // Policy Engine
        this.policyEngine.messageBus = this.messageBus;

        // Register messageBus on IDM
        this.identityModule.messageBus = this.messageBus;

        // Register registry on IdentityModule
        this.identityModule.registry = this.registry;

        // Register coreDiscovery on IdentityModule
        this.identityModule.coreDiscovery = this.coreDiscovery;

        // Use sandbox factory to use specific methods
        // and set the message bus to the factory
        this.runtimeFactory.messageBus = this.messageBus;

        // Instanciate the SyncherManager;
        this.syncherManager = new SyncherManager(this.runtimeURL, this.messageBus, this.registry, this.storages.syncherManager, null, this._dataObjectsStorage, this.identityModule);


        // Set into loader the needed components;
        this.loader.runtimeURL = this.runtimeURL;
        this.loader.messageBus = this.messageBus;
        this.loader.registry = this.registry;
        this.loader.runtimeFactory = this.runtimeFactory;

        //Instantiate Discovery Lib for notification testing
        // this.discovery = new Discovery("hyperty://localhost/test", this.runtimeURL, this.messageBus);
        // this.loadStub("localhost");
        // setTimeout(() => {
        //   this.discovery.discoverHypertiesDO("user://google.com/openidtest20@gmail.com")
        //   .then(hyperties => {
        //     hyperties.forEach(hyperty =>{
        //       hyperty.onLive(() => log.log(`Notification from ${hyperty.data.hypertyID} changed to live`));
        //       hyperty.onDisconnected(() => log.log(`Notification from ${hyperty.data.hypertyID} changed to disconnected`));
        //     });
        //   });
        // }, 2000);


        // this.subscriptionManager.init().then(()=>{
        //   resolve(true);
        // });

        const prepareComponents = [];
        prepareComponents.push(this.subscriptionManager.init());
        prepareComponents.push(this.identityModule.init(guid));
        prepareComponents.push(cryptoManager.loadSessionKeys());
        prepareComponents.push(this.registry.loadRegistry());
        prepareComponents.push(this._dataObjectsStorage.loadRemote());

        Promise.all(prepareComponents).then((result) => {
          if (result.length === 5) {
            resolve(true);
          } else {
            reject('[RuntimeUA._loadComponents] Error ] ', result);
          }
        }).catch((reason) => {
          throw Error(reason);
        });

      } catch (e) {
        reject(e);
      }

    });

  }

  /**
   * Deploy Hyperty from Catalogue URL
   *
   * @see https://github.com/reTHINK-project/specs/tree/master/datamodel/core/address
   *
   * @param {URL.HypertyCatalogueURL} hypertyCatalogueURL - The Catalogue URL used to identify descriptors in the Catalogue.
   * @param {boolean|URL.HypertyURL} [reuseURL=false] reuseURL - reuseURL is used to reuse the hypertyURL previously registred, by default the reuse is disabled;
   * @param {URL} appURL - the app url address; // TODO: improve this description;
   * @returns {Promise<Boolean, Error>} this is Promise and returns true if all components are loaded with success or an error if someone fails.
   *
   * @memberOf RuntimeUA
   */
  loadHyperty(hypertyCatalogueURL, reuseURL = false, appURL) {

    if (!hypertyCatalogueURL) throw new Error('Hyperty descriptor url parameter is needed');
    return this.loader.loadHyperty(hypertyCatalogueURL, reuseURL, appURL);

  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadStub(protocolstubCatalogueURL) {

    if (!protocolstubCatalogueURL) throw new Error('ProtoStub descriptor url parameter is needed');
    return this.loader.loadStub(protocolstubCatalogueURL);

  }

  /**
  * Deploy idpProxy from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadIdpProxy(ipdProxyCatalogueURL) {
    log.log('ipdProxyCatalogueURL', ipdProxyCatalogueURL);

    if (!ipdProxyCatalogueURL) throw new Error('The IDP Proxy URL is a needed parameter, could be a DOMAIN or a URL');
    return this.loader.loadIdpProxy(ipdProxyCatalogueURL);
  }

  /**
   * Used to close all the runtime; Unregister all hyperties;
   * @return {Promise<Boolean>} result of the close method, with true or false to the operation success;
   */
  close(logOut) {
    console.log('Runtime core logout: ', logOut);
    let _this = this;
    if (logOut === true) {
      this.identityHandler.reset();
    }

    log.info('Unregister all hyperties');
    return new Promise(function (resolve, reject) {

      _this.registry.unregisterAllHyperties().then(function (result) {
        log.info('All the hyperties are unregisted with Success:', result);
        resolve(true);
      }).catch(function (reason) {
        log.error('Failed to unregister the hyperties', reason);
        reject(false);
      });

    });

  }

  /**
   * Used to reset the runtime by deleting all data from the storage manager;
   * @return {Promise<Boolean>} result of the reset method, with true or false to the operation success;
   */
  reset() {
    console.log('RuntimeUA.Runtime core reset: ');

    let reseting = [];
    let _this = this;

    return new Promise((resolve, reject) => {
      //TODO: delegate db reset operation to each component
      //    this.identityManager.reset();

      this._dataObjectsStorage.deleteRemotes().then(()=>{
        return;
      }).
      then(() => {
        this.storages.identity.get(false, false, 'identities').then((identities) => {
          let identitiesKeys = Object.keys(identities);
  
          identitiesKeys.forEach((key) => {
            reseting.push(this.storages.identity.delete(key, false, 'identities'));
  
          });
  
          reseting.push(this.storages.capabilities.delete('capabilities'));
          reseting.push(this.storages.cryptoManager.delete('userAsymmetricKey'));
          reseting.push(this.storages.hypertyResources.delete('hypertyResources'));
          reseting.push(this.storages.identity.delete('accessTokens'));
          reseting.push(this.storages.registry.delete('registry:DataObjectURLs'));
          reseting.push(this.storages.registry.delete('registry:HypertyURLs'));
          reseting.push(this.storages.runtime.delete('p2pHandler:URL'));
          reseting.push(this.storages.runtime.delete('runtime:URL'));
          //    reseting.push(this.storages.runtimeCatalogue.delete('runtimeCatalogue'));
          reseting.push(this.storages.subscriptions.delete('subscriptions'));
          reseting.push(this.storages.syncherManager.delete('syncherManager:ObjectURLs'));
          reseting.push(this.storages.syncherManager.delete('remotes'));
  
          Promise.all(reseting).then((result) => {
  
            log.info('[RuntimeUA.reset] reset with Success:', result);
            return resolve(true);
          }).catch(function (reason) {
            log.error('Failed to reset all DBs', reason);
            resolve(false);
          });
        });
      })

    });

  }
}

export default RuntimeUA;
