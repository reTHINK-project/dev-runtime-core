import SandboxBrowser from './sandboxes/SandboxBrowser';
import AppSandboxBrowser from './sandboxes/AppSandboxBrowser';
import Request from './Request';
import {RuntimeCatalogue} from 'service-framework/dist/RuntimeCatalogue';
import PersistenceManager from 'service-framework/dist/PersistenceManager';
import StorageManager from 'service-framework/dist/StorageManager';

import Dexie from 'dexie';

export const runtimeFactory = {

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

  persistenceManager() {
    let localStorage = window.localStorage;
    return new PersistenceManager(localStorage);
  },

  storageManager(name, schemas) {

    if (!this.databases) { this.databases = {}; }
    if (!this.storeManager) { this.storeManager = {}; }

    // Using the implementation of Service Framework
    // Dexie is the IndexDB Wrapper
    if (!this.databases.hasOwnProperty(name)) {
      this.databases[name] = new Dexie(name);
    }

    if (!this.storeManager.hasOwnProperty(name)) {
      this.storeManager[name] = new StorageManager(this.databases[name], name, schemas);
    }

    return this.storeManager[name];
  },

  runtimeCapabilities: (storageManager) => {
    return {
      getRuntimeCapabilities: () => {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      isAvailable: (capability) => {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      update: () => {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      }
    };
  },

  // TODO optimize the parameter was passed to inside the RuntimeCatalogue
  createRuntimeCatalogue() {
    let _this = this;
    return new RuntimeCatalogue(_this);
  },

  removeSandbox() {

  }
};
