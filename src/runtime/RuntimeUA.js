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

import Loader from './Loader';
import { runtimeConfiguration } from './runtimeConfiguration';
// import GraphConnector from '../graphconnector/GraphConnector';

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
   * @param {runtimeFactory} runtimeFactory - Specific implementation for the environment where the core runtime will run;
   * @param {domain} domainURL - specify the domain base for the runtime;
   */
  constructor(runtimeFactory, domain) {

    if (!runtimeFactory) throw new Error('The sandbox factory is a needed parameter');
    if (!domain) throw new Error('You need the domain of runtime');

    // Configuration object with information related with servers
    this.runtimeConfiguration = Object.assign({domain: domain}, runtimeConfiguration);

    this.runtimeFactory = runtimeFactory;
    this.runtimeCatalogue = runtimeFactory.createRuntimeCatalogue();

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

  init() {

    return new Promise((resolve, reject) => {

      this.domain = this.runtimeConfiguration.domain;

      try {
        let getCapabilities = this.runtimeCapabilities.getRuntimeCapabilities();
        let getRuntimeURL = this.storageManager.get('runtime:URL');

        Promise.all([getRuntimeURL, getCapabilities]).then((results) => {

          this.runtimeURL = results[0] ? results[0].runtimeURL : results[0];
          if (!this.runtimeURL) {
            this.runtimeURL = 'runtime://' + this.domain + '/' + generateGUID();
            this.storageManager.set('runtime:URL', 1, {runtimeURL: this.runtimeURL});
          }

          this.capabilities = results[1];

          return this._loadComponents();

        }).then((status) => {
          resolve(status);
        }).catch((error) => {
          console.error('ERROR: ', error);
          reject(error);
        });

      } catch (e) {
        reject(e);
      }

    });

  }

  _loadComponents() {

    return new Promise((resolve, reject) => {

      try {

        // Prepare the loader to load the hyperties, protostubs and idpproxy;
        this.loader = new Loader(this.runtimeConfiguration);

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

        // Instantiate the Policy Engine
        this.policyEngine = new PEP(new RuntimeCoreCtx(this.identityModule, this.registry, this.storageManager));

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
        this.syncherManager = new SyncherManager(this.runtimeURL, this.messageBus, this.registry, this.runtimeCatalogue, this.storageManager);

        // Set into loader the needed components;
        this.loader.runtimeURL = this.runtimeURL;
        this.loader.messageBus = this.messageBus;
        this.loader.registry = this.registry;
        this.loader.runtimeCatalogue = this.runtimeCatalogue;
        this.loader.runtimeFactory = this.runtimeFactory;

        // Instantiate the Graph Connector
        // _this.graphConnector = new GraphConnector(_this.runtimeURL, _this.messageBus);

        resolve(true);
      } catch (e) {
        reject(e);
      }

    });

  }

  /**
  * Deploy Hyperty from Catalogue URL
  * @param  {URL.HypertyCatalogueURL}    hyperty hypertyDescriptor url;
  */
  loadHyperty(hypertyDescriptorURL) {

    if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

    return new Promise((resolve, reject) => {

      this.loader.loadHyperty(hypertyDescriptorURL)
      .then((result) => {
        resolve(result);
      })
      .catch((reason) => {
        reject(reason);
      });

    });

  }

  /**
  * Deploy Stub from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadStub(protostubURL) {

    if (!protostubURL) throw new Error('ProtoStub descriptor url parameter is needed');

    return new Promise((resolve, reject) => {

      this.loader.loadStub(protostubURL)
      .then((result) => {
        resolve(result);
      })
      .catch((reason) => {
        reject(reason);
      });

    });

  }

  /**
  * Deploy idpProxy from Catalogue URL or domain url
  * @param  {URL.URL}     domain          domain
  */
  loadIdpProxy(idpProxyURL) {

    if (!idpProxyURL) throw new Error('The IDP Proxy URL is a needed parameter, could be a DOMAIN or a URL');

    return new Promise((resolve, reject) => {
      this.loader.loadIdpProxy(idpProxyURL)
      .then((result) => {
        resolve(result);
      })
      .catch((reason) => {
        reject(reason);
      });
    });

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
