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

import 'babel-polyfill';

//Main dependecies
import Registry from '../registry/Registry';
import IdentityModule from '../identity/IdentityModule';
import PEP from '../policy/PEP';
import MessageBus from '../bus/MessageBus';
import { generateGUID } from '../utils/utils';
import AddressAllocation from '../allocation/AddressAllocation';

import Loader from './Loader';
import Descriptors from './Descriptors';

import { runtimeConfiguration } from './runtimeConfiguration';
import { runtimeUtils } from './runtimeUtils';

import GraphConnector from '../graphconnector/GraphConnector';

import DataObjectsStorage from '../store-objects/DataObjectsStorage';
import SyncherManager from '../syncher/SyncherManager';
import RuntimeCoreCtx from '../policy/context/RuntimeCoreCtx';

/**
 * Runtime User Agent Interface will process all the dependecies of the core runtime;
 * @author Vitor Silva [vitor-t-silva@telecom.pt]
 * @version 0.4.0
 *
 * @property {runtimeFactory} runtimeFactory - Specific implementation for all environments;
 * @property {RuntimeCatalogue} runtimeCatalogue - Catalogue of components can be installed;
 * @property {runtimeURL} runtimeURL - This identify the core runtime, should be unique;
 * @property {IdentityModule} identityModule - Identity Module;
 * @property {PEP} policyEngine - Policy Engine Module;
 * @property {Registry} registry - Registry Module;
 * @property {MessageBus} messageBus - Message Bus is used like a router to redirect the messages from one component to other(s)
 * @property {GraphConnector} graphConnector - Graph Connector handling GUID and contacts
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
    this.runtimeConfiguration = Object.assign({domain: domain}, runtimeConfiguration);
    this.runtimeFactory = runtimeFactory;
    this.runtimeCatalogue = runtimeFactory.createRuntimeCatalogue();

    if (runtimeDescriptor.p2pHandlerStub && typeof runtimeDescriptor.p2pHandlerStub  === 'string' && runtimeDescriptor.p2pHandlerStub.includes('://')) {
      this.p2p = true;
    } else {
      this.p2p = false;
    }

    runtimeUtils.runtimeDescriptor = runtimeDescriptor;
    this.runtimeUtils = runtimeUtils;

    if (typeof runtimeFactory.createRuntimeCatalogue === 'function') {
      this.persistenceManager = runtimeFactory.createRuntimeCatalogue();
    } else {
      throw new Error('Check your Runtime Factory because it need the Runtime Catalogue implementation');
    }

    if (typeof runtimeFactory.persistenceManager === 'function') {
      this.persistenceManager = runtimeFactory.persistenceManager();
    } else {
      throw new Error('Check your Runtime Factory because it need the Persistence Manager implementation');
    }

    if (typeof runtimeFactory.storageManager === 'function') {
      this.storageManager = runtimeFactory.storageManager();
    } else {
      throw new Error('Check your Runtime Factory because it need the Storage Manager implementation');
    }
    if (typeof runtimeFactory.runtimeCapabilities === 'function') {
      this.runtimeCapabilities = runtimeFactory.runtimeCapabilities(this.storageManager);
    } else {
      console.info('Check your RuntimeFactory because it need the Runtime Capabilities implementation');
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
  init() {
    return new Promise((resolve, reject) => {

      this.domain = this.runtimeConfiguration.domain;

      try {
        let getCapabilities = this.runtimeCapabilities.getRuntimeCapabilities();
        let getRuntimeURL = this.storageManager.get('runtime:URL');
        let getStoredDataObjects = this.storageManager.get('syncherManager:ObjectURLs');

        Promise.all([getRuntimeURL, getCapabilities, getStoredDataObjects]).then((results) => {

          this.runtimeURL = results[0] ? results[0].runtimeURL : results[0];
          if (!this.runtimeURL) {
            this.runtimeURL = 'runtime://' + this.domain + '/' + generateGUID();
            this.storageManager.set('runtime:URL', 1, {runtimeURL: this.runtimeURL});
          }

          this.capabilities = results[1];
          Object.assign(runtimeUtils.runtimeCapabilities.constraints, results[1]);

          this._dataObjectsStorage = new DataObjectsStorage(this.storageManager, results[2] || {});

          return this._loadComponents();
        }).then((status) => {

          if (this.p2p) {
            console.info('[RuntimeUA - init] load p2pHandler: ', status);
            return this._loadP2PHandler();
          } else {
            console.info('[RuntimeUA - init] P2P not supported');
            return ('P2P Not Supported');
          }
        })
        .then((result) => {
          console.info('[runtime ua - init] - status: ', result);
          resolve(true);
        }, (reason) => {
          console.error('ERROR: ', reason);
          resolve(true);
        });

      } catch (e) {
        reject(e);
      }

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

      console.log('[RuntimeUA loadP2PHandler] P2PStubHandler: ', p2pStubHandler);

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
          console.log('[runtime ua - listener] - receive msg: ', msg);
        });

        this.messageBus.postMessage(msg, (reply) => {
          console.log('[runtime ua - postMessage] - reply: ', reply);
        });

        console.info('[runtime ua - p2p installation] - success: ', result);
        resolve(true);
      }).catch((reason) => {
        console.info('[runtime ua - p2p installation] - fail: ', reason);
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
  _loadComponents() {

    return new Promise((resolve, reject) => {

      try {

        // Prepare the on instance to handle with the fallbacks and runtimeCatalogue;
        this.descriptorInstance = new Descriptors(this.runtimeURL, this.runtimeCatalogue, this.runtimeConfiguration);

        // Prepare the loader to load the hyperties, protostubs and idpproxy;
        this.loader = new Loader(this.runtimeURL, this.runtimeConfiguration, this.descriptorInstance);

        // Instantiate the identity Module
        this.identityModule = new IdentityModule(this.runtimeURL, this.runtimeCapabilities, this.storageManager);

        // Use the sandbox factory to create an AppSandbox;
        // In the future can be decided by policyEngine if we need
        // create a AppSandbox or not;
        let appSandbox = this.runtimeFactory.createAppSandbox();

        // Instantiate the Registry Module
        this.registry = new Registry(this.runtimeURL, appSandbox, this.identityModule, this.runtimeCatalogue, this.runtimeCapabilities, this.storageManager);

        // Set the loader to load Hyperties, Stubs and IdpProxies
        this.registry.loader = this.loader;

        // Instantiate the Message Bus
        this.messageBus = new MessageBus(this.registry);

        // Prepare the address allocation instance;
        this.addressAllocation = new AddressAllocation(this.runtimeURL, this.messageBus, this.registry);

        // Instantiate the Policy Engine
        this.policyEngine = new PEP(new RuntimeCoreCtx(this.identityModule, this.registry, this.storageManager, this.runtimeCapabilities));

        this.messageBus.pipeline.handlers = [

          // Policy message authorise
          (ctx) => {
            this.policyEngine.authorise(ctx.msg).then((changedMgs) => {
              ctx.msg = changedMgs;
              ctx.next();
            }).catch((reason) => {
              console.error(reason);
              ctx.fail(reason);
            });
          }
        ];

        // Instantiate the Graph Connector
        this.graphConnector = new GraphConnector(this.runtimeURL, this.messageBus, this.storageManager);

        // Add to App Sandbox the listener;
        appSandbox.addListener('*', (msg) => {
          this.messageBus.postMessage(msg);
        });

        // Register messageBus on Registry
        this.registry.messageBus = this.messageBus;

        // Register registry on IdentityModule
        this.identityModule.registry = this.registry;

        // Use sandbox factory to use specific methods
        // and set the message bus to the factory
        this.runtimeFactory.messageBus = this.messageBus;

        // Instanciate the SyncherManager;
        this.syncherManager = new SyncherManager(this.runtimeURL, this.messageBus, this.registry, this.runtimeCatalogue, this.storageManager, null, this._dataObjectsStorage);

        // Set into loader the needed components;
        this.loader.runtimeURL = this.runtimeURL;
        this.loader.messageBus = this.messageBus;
        this.loader.registry = this.registry;
        this.loader.runtimeCatalogue = this.runtimeCatalogue;
        this.loader.runtimeFactory = this.runtimeFactory;

        resolve(true);

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

    if (!ipdProxyCatalogueURL) throw new Error('The IDP Proxy URL is a needed parameter, could be a DOMAIN or a URL');
    return this.loader.loadIdpProxy(ipdProxyCatalogueURL);
  }

  /**
   * Used to close all the runtime; Unregister all hyperties;
   * @return {Promise<Boolean>} result of the close method, with true or false to the operation success;
   */
  close() {
    let _this = this;

    console.info('Unregister all hyperties');
    return new Promise(function(resolve, reject) {

      _this.registry.unregisterAllHyperties().then(function(result) {
        console.info('All the hyperties are unregisted with Success:', result);
        resolve(true);
      }).catch(function(reason) {
        console.error('Failed to unregister the hyperties', reason);
        reject(false);
      });

    });

  }

}

export default RuntimeUA;
