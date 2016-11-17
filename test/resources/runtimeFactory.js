import SandboxBrowser from './sandboxes/SandboxBrowser';
import AppSandboxBrowser from './sandboxes/AppSandboxBrowser';
import Request from './Request';
import {RuntimeCatalogue} from 'service-framework/dist/RuntimeCatalogue';
import PersistenceManager from 'service-framework/dist/PersistenceManager';

export const runtimeFactory = {

  createSandbox() {
    return new SandboxBrowser();
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

  storageManager() {
    return {
      set: function(key, version, value) {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      get: function(key) {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      getVersion: function(key) {
        return new Promise((resolve) => {
          resolve(undefined);
        });
      },
      delete: function(key) {
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
