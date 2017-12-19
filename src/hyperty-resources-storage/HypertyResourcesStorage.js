// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('HypertyResourcesStorage');

import { generateGUID, deepClone, availableSpace } from '../utils/utils';

import PromiseQueue from '../utils/PromiseQueue';

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
    

    _this._url = runtimeURL + '/storage';

    _this._storageManager = storageManager;

    _this.promiseQueue = new PromiseQueue();

    _this._hypertyResources = hypertyResources;

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

    const a = _toSave(resourceURL, message, content);

    this.promiseQueue.add(this._toSave);

  }

  _toSave(resourceURL, message, content) {
    this.checkStorageQuota().then((result) => {

      console.log(result);

      if (content.size > result.quota) {
        throw Error('The storage do not have space to store that resource');
      }

      const spaceAvailable = result.quota;
      const allocated = result.usage + content.size;

      if (result.percent >= this._storageLimit || allocated > spaceAvailable) {
        return this._getOlderResources(content.size);
      } else {
        return true;
      }

    }).then(() => {

      return this._storageManager.set(resourceURL, 1, content);
    }).then(() => {

      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: resourceURL, code: 200 }
      };

      this._bus.postMessage(response);

    }).catch((reason) => {

      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: resourceURL, code: 500, description: reason }
      };

      this._bus.postMessage(response);

    });
  }

  _getOlderResources(size) {

    return new Promise((resolve, reject) => {

      this._storageManager.get().then((result) => {

        const resources = Object.keys(result);

        let total = 0;
        const reduced = resources.sort((a, b) => result[a].created < result[b].created)
          .reduce((previousResource, currentResource) => {
            const current = this._hypertyResources[currentResource];

            console.log('[HypertyResourcesStorage] _getOlderResources: ', total, size, currentResource, this._availableQuota);

            if (total <= size) {
              total += current.size;
              previousResource.push(currentResource);
            }

            return previousResource;

          }, []);

        console.log('DELETING: ', reduced);

        const deleting = reduced.map(key => this._storageManager.delete(key));

        Promise.all(deleting).then((a) => {
          console.log('Deleted:', a);
          resolve(true);
        }).catch((b) => {
          console.log('Deleted:', b);
        });

      });

    });

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

    // let content = _this._hypertyResources[contentUrl];

    console.log('AQUI:', _this._hypertyResources);

    this._storageManager.get('resourceURL', contentUrl).then((content) => {

      console.log('GET resourceURL:', content);

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

    });

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

    _this._storageManager.delete('resourceURL', message.body.resource).then(() => {
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
