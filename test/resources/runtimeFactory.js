import SandboxBrowser from './sandboxes/SandboxBrowser';
import AppSandboxBrowser from './sandboxes/AppSandboxBrowser';
import Request from './Request';
/*import {RuntimeCatalogue} from 'service-framework/dist/RuntimeCatalogue';
import PersistenceManager from 'service-framework/dist/PersistenceManager';*/
import StorageManager from '../../dist/StorageManager';


import Dexie from 'dexie';

// backup synchronisation are not yet supported by tests

import 'dexie-observable';
import 'dexie-syncable';

import SyncClient from 'sync-client/dist/sync-client';

export const runtimeFactory = Object.create({

  createSandbox(capabilities) {

    return new Promise((resolve) => {
      resolve(new SandboxBrowser(capabilities));
    });

  },

  createAppSandbox() {
    return new AppSandboxBrowser();
  },

  createHttpRequest() {
    let request = new Request();
    return request;
  },

  atob(b64) {
    return atob(b64);
  },

/*  persistenceManager() {
    let localStorage = window.localStorage;
    return new PersistenceManager(localStorage);
  },*/

  storageManager(name, schemas, runtimeUA = undefined, remote = false) {

    if (!this.databases) { this.databases = {}; }
    if (!this.storeManager) { this.storeManager = {}; }

    if (navigator && navigator.storage && navigator.storage.persist) {
      navigator.storage.persist().then(function(persistent) {
        if (persistent) { console.log('Storage will not be cleared except by explicit user action'); } else { console.log('Storage may be cleared by the UA under storage pressure.'); }
      });
    }

    // Using the implementation of Service Framework
    // Dexie is the IndexDB Wrapper
    if (!this.databases.hasOwnProperty(name)) {

      let stores =  {};

      if (schemas) {
        stores = schemas;
      } else {
        stores[name] = 'key,version,value';
      }

      if (!remote) {
        this.databases[name] =  new Dexie(name, {addons:[]});
        this.databases[name].version(1).stores(stores);
      } else {
        //in case we use a remote storage server to be synched with
        // we use SyncClient lib, an extension of Dexie

        let versions = [{
          version: 1,
          stores: stores
        }];

        this.databases[name] =  new SyncClient(name, versions);
      } 
    }

    if (!this.storeManager.hasOwnProperty(name)) {
      this.storeManager[name] = new StorageManager(this.databases[name], name, schemas, runtimeUA, 1, remote);
    }

    if (remote) this.storeManager[name].remote = remote;

    return this.storeManager[name];
  },

  runtimeCapabilities() {

    if (!this.capabilitiesManager) {

      let storageManager = this.storageManager('capabilities');

      this.capabilitiesManager = {
        getRuntimeCapabilities: () => {
          return new Promise((resolve) => {

            const capabilities = {
              browser: true
            };

            storageManager.set('capabilities', '1', capabilities);
            resolve(capabilities);
          });

        }

      };

    }

    console.log(this.capabilitiesManager);

    return this.capabilitiesManager;
  },

  // TODO optimize the parameter was passed to inside the RuntimeCatalogue
/*  createRuntimeCatalogue() {
    let _this = this;
    return new RuntimeCatalogue(_this);
  },*/

  removeSandbox() {

  }
});
