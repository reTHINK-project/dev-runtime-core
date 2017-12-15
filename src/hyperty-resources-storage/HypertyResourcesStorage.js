// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('HypertyResourcesStorage');

import { WatchingYou } from 'service-framework/dist/Utils';

import { generateGUID, deepClone, availableSpace } from '../utils/utils';

const STATUS = { START_SAVING: 'START', SAVED: 'END', ERROR: 'ERROR'};

class HypertyResourcesStorage {

  constructor(runtimeURL, bus, storageManager, hypertyResources) {

    if (!storageManager) throw new Error('[HypertyResourcesStorage constructor] mandatory storageManager parameter missing');
    if (!runtimeURL) throw new Error('[HypertyResourcesStorage constructor] mandatory runtimeURL parameter missing');
    if (!bus) throw new Error('[HypertyResourcesStorage constructor] mandatory bus parameter missing');

    let _this = this;

    _this._bus = bus;

    _this._storageLimit = 0.9; // the save storageLimit;

    _this._availableQuota = 0;
    _this._usage = 0;
    _this._pool = [];

    _this._url = runtimeURL + '/storage';

    _this._storageManager = storageManager;

    _this._hypertyResources = hypertyResources;

    _this.watchingYou = new WatchingYou();
    _this.poolingList = _this.watchingYou.watch('poolingList', {}, true);
    _this.current = 0;

    this._poolingResources();

    bus.addListener(_this._url, (msg) => {
      log.info('[HypertyResourcesStorage] Message RCV: ', msg);
      switch (msg.type) {
        case 'create': _this._onCreate(msg); break;
        case 'read': _this._onRead(msg); break;
        case 'delete': _this._onDelete(msg); break;
      }
    });

  }

  /**
   * check the available storage quota
   *
   * @memberof HypertyResourcesStorage
   */
  checkStorageQuota() {

    return new Promise((resolve, reject) => {

      if (this._availableQuota && this._usage) {
        return resolve(availableSpace(this._usage, this._availableQuota));
      }

      if (navigator) {

        navigator.storage.estimate().then((estimate) => {
          this._availableQuota = estimate.quota;
          this._usage = estimate.usage;
          resolve(availableSpace(this._usage, this._availableQuota));

        }).catch((reason) => {
          console.error('[HypertyResourcesStorage] CheckStorageQuota error: ', reason);
          reject(reason);
        });

      }

    });

  }

  /**
   * @description should save an HypertyResource contained in the body of a create message request;
   *
   * @param {string} message - message containing the hyperty resource to be stored
   */

  _onCreate(message) {

    let _this = this;

    if (!message.body || !message.body.value) throw new Error('[HypertyResourcesStorage._onCreate] mandatory message body value missing: ', message);

    let content = message.body.value;
    let contentURL = content.contentURL;
    let resourceURL = '';

    if (!contentURL) {

      contentURL = [];
      resourceURL = _this._url + '/' + generateGUID();

    } else {
      const currentURL = contentURL[0];
      const resource = currentURL.substr(currentURL.lastIndexOf('/') + 1);
      resourceURL = _this._url + '/' + resource;
    }

    if (!_this._hypertyResources.hasOwnProperty(resourceURL)) {

      contentURL.push(resourceURL);
      content.contentURL = contentURL;

    }

    this._hypertyResources[resourceURL] = content;

    this.poolingList[resourceURL] = {
      status: STATUS.START_SAVING,
      content: {
        url: resourceURL,
        size: content.size
      },
      message: {
        id: message.id,
        to: message.to,
        from: message.from
      }
    };

    this._hypertyResources[resourceURL] = content;

    this._storageManager.set(resourceURL, 1, _this._hypertyResources).then((r) => {

      console.log('r:', r);

      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: resourceURL, code: 200 }
      };

      _this._bus.postMessage(response);
    }).catch((reason) => {

      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: resourceURL, code: 500, description: reason }
      };

      _this._bus.postMessage(response);

    });

    //   _this._storageManager.set('hypertyResources', 1, _this._hypertyResources).then(() => {

    //     let response = {
    //       from: message.to,
    //       to: message.from,
    //       id: message.id,
    //       type: 'response',
    //       body: { value: resourceURL, code: 200 }
    //     };

    //     _this._bus.postMessage(response);
    //   }).catch((reason) => {

    //     log.warn(reason);

    //     let response = {
    //       from: message.to,
    //       to: message.from,
    //       id: message.id,
    //       type: 'response',
    //       body: { value: resourceURL, code: 500, description: reason }
    //     };

    //     _this._bus.postMessage(response);
    //   });

    // }).catch((reason) => {

    //   log.warn(reason);

    //   let response = {
    //     from: message.to,
    //     to: message.from,
    //     id: message.id,
    //     type: 'response',
    //     body: { value: resourceURL, code: 500, description: reason }
    //   };

    //   _this._bus.postMessage(response);

  }

  _poolingResources() {

    this.watchingYou.observe('poolingList', (change) => {

      let current;
      let resource;

      console.log('Change: ', change);

      if (change.type === 'update') {
        current = change.object;
      } else if (change.type === 'add') {
        current = change.newValue;
      } else {
        return;
      }

      const getResource = () => {
        const resources = Object.keys(this.poolingList);
        const resourceURL = resources[this.current];

        console.log('HERE:', this.poolingList[resourceURL]);

        return this.poolingList[resourceURL];
      };

      console.log('Change: ', current.status);

      switch (current.status) {

        case STATUS.START_SAVING:

          if (this.current === 0) {
            resource = getResource();
            if (resource) {
              delete this.poolingList[current.content.url];
              this._saveResource(resource);
            }
          }

          break;

        case STATUS.SAVED:
          console.log('AQUI: Saved:'. current);
          this.current++;

          resource = getResource();

          if (resource) {
            delete this.poolingList[current.content.url];
            this._saveResource(resource);
          }

          break;

        case STATUS.ERROR:
          console.log('AQUI: Error:'. current);
          this.current++;

          resource = getResource();
          if (resource) {
            delete this.poolingList[current.content.url];
            this._saveResource(resource);
          }

          break;

      }

    });

  }

  _saveResource(resource) {

    return new Promise((resolve, reject) => {

      const resourceURL = resource.content.url;
      const message = deepClone(resource.message);

      console.log('Process resource: ', this.current, resource);

      this.checkStorageQuota().then((result) => {

        const fileSize = resource.content.size;
        const usage = result.usage;
        const totalSize = result.usage + fileSize;

        console.log('File Size: ', fileSize, ' usage Size: ', usage, ' Total Size: ', totalSize, ' Quota: ', result.quota);

        let b;

        if (totalSize > result.quota) {
          log.warn('The file you will save is bigger than the space you have');
          b = this._cleanOlderResources(fileSize);
        } else {
          b = Promise.resolve('not clean');
        }

        return b;

      }).then((result) => {
        console.log('REsult', result);

        console.log('HYPERTY RESOURCES: ', resourceURL, this._hypertyResources);

        return this._storageManager.set('hypertyResources', 1, this._hypertyResources);
      }).then((result) => {

        console.log('AQUI:', result);

        this.poolingList[resourceURL].status = STATUS.SAVED;

        let response = {
          from: message.to,
          to: message.from,
          id: message.id,
          type: 'response',
          body: { value: resourceURL, code: 200 }
        };

        this._bus.postMessage(response);

      }).catch((reason) => {

        console.log('ERROR:', reason);

        let response = {
          from: message.to,
          to: message.from,
          id: message.id,
          type: 'response',
          body: { value: resourceURL, code: 500, description: reason }
        };

        this._bus.postMessage(response);

        this.poolingList[resourceURL].status = STATUS.ERROR;

      });

    })

  }


  _cleanOlderResources(size) {

    return new Promise((resolve, reject) => {

      console.log('AQUI:', size, this._availableQuota);

      if (size >= this._availableQuota) {
        return reject('Nothing to clean. You don\'t have space on storage to save that file');
      }

      console.log(this._usage, this._availableQuota);
      console.log('Before:', JSON.stringify(this._hypertyResources));

      this._getOlderResources(size);

      console.log('After:', this._hypertyResources);

      this._storageManager.set('hypertyResources', 1, this._hypertyResources).then(() => {
        resolve(true);
      }).catch((error) => {
        console.log('[HypertyResourcesStorage] _cleanOlderResources error', error);

        this._storageManager.delete('hypertyResources').then(() => {

          console.log('TESTES', this._hypertyResources);

          // this._storageManager.set('hypertyResources', 2, this._hypertyResources).then(() => {
          //   console.log('Success:', error);
          //   resolve(true);
          // }).catch((error) => {
          //   console.log('ERROR:', error);
          //   reject(error);
          // })

        }).catch((error) => {
          console.error('ERROR', error);
          reject(error);
        });

      });

    });

  }

  _getOlderResources(size) {
    const resources = Object.keys(this._hypertyResources);

    let total = 0;
    const result = resources.sort((a, b) => this._hypertyResources[a].created < this._hypertyResources[b].created)
      .reduce((previousResource, currentResource) => {
        const current = this._hypertyResources[currentResource];

        console.log('[HypertyResourcesStorage] _getOlderResources: ', total, size, currentResource, this._availableQuota);

        if (total <= size) {
          total += current.size;
          previousResource.push(currentResource);
        }

        return previousResource;

      }, []);

    console.log('DELETING: ', result);

    result.forEach(key => {
      // this._usage -= this._hypertyResources[key].size;
      delete this._hypertyResources[key];
    });

    return result;
  }

  /**
   * @description should return an HypertyResource stored in the Storage Manager identified by the content url contained in the body of a read message request;
   *
   * @param {string} message - message containing the hyperty resource to be stored
   */

  _onRead(message) {

    let _this = this;

    if (!message.body || !message.body.resource) throw new Error('[HypertyResourcesStorage._onRead] mandatory message body resource missing: ', message);

    let contentUrl = message.body.resource;

    let response = {
      from: message.to,
      to: message.from,
      id: message.id,
      type: 'response',
      body: {}
    };

    let content = _this._hypertyResources[contentUrl];

    if (content) {

      if (content.resourceType === 'file') {
        _this._onReadFile(response, content);
      } else {
        response.body.code = 200;
        response.body.p2p = true;
        response.body.value = content;
        _this._bus.postMessage(response);
      }

    } else {
      response.body.code = 404;
      response.body.desc = 'Content Not Found for ' + contentUrl;
      _this._bus.postMessage(response);

    }

    //response.body.code = 404;

    //_this._hypertyResources[contentUrl] = message.body.value;


  }

  _onReadFile(response, resource) {
    let _this = this;

    let reader = new FileReader();

    reader.onload = function(theFile) {

      log.info('[FileHypertyResource.init] file loaded ', theFile);

      response.body.code = 200;
      response.body.p2p = true;
      response.body.value = deepClone(resource);
      response.body.value.content = theFile.target.result;
      _this._bus.postMessage(response);
    };

    if (resource.mimetype.includes('text/')) {
      reader.readAsText(resource.content);
    } else {
      const current = resource.content;

      let blob;
      if (Array.isArray(current)) {
        blob = new Blob(current, { type: resource.mimetype});
      } else {
        blob = new Blob([current], { type: resource.mimetype});
      }

      reader.readAsArrayBuffer(blob);
    }
  }

  /**
   * @description should delete an HypertyResource from the storage;
   *
   * @param {string} message - message containing the content URL of the hyperty resource to be deleted
   */

  _onDelete(message) {

    let _this = this;

    if (!message.body) throw new Error('[HypertyResourcesStorage._onDelete] mandatory message body missing: ', message);

    if (message.body.resource) {
      delete _this._hypertyResources[message.body.resource];
    } else if (message.body.resources) {
      message.body.resources.forEach((resource) => {
        delete _this._hypertyResources[resource];
      });
    } else {
      throw new Error('[HypertyResourcesStorage._onDelete] mandatory resource missing: ', message);
    }

    _this._storageManager.set('hypertyResources', 1, _this._hypertyResources).then(() => {
      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { code: 200 }
      };

      _this._bus.postMessage(response);
    });

  }

}

export default HypertyResourcesStorage;
