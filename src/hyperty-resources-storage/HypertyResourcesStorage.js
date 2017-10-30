// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('HypertyResourcesStorage');


import { generateGUID, deepClone } from '../utils/utils';

class HypertyResourcesStorage {

  constructor(runtimeURL, bus, storageManager, hypertyResources) {

    if (!storageManager) throw new Error('[HypertyResourcesStorage constructor] mandatory storageManager parameter missing');
    if (!runtimeURL) throw new Error('[HypertyResourcesStorage constructor] mandatory runtimeURL parameter missing');
    if (!bus) throw new Error('[HypertyResourcesStorage constructor] mandatory bus parameter missing');

    let _this = this;

    _this._bus = bus;

    _this._url = runtimeURL + '/storage';

    _this._storageManager = storageManager;

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
   * @description should save an HypertyResource contained in the body of a create message request;
   *
   * @param {string} message - message containing the hyperty resource to be stored
   */

  _onCreate(message) {

    let _this = this;

    if (!message.body || !message.body.value) throw new Error('[HypertyResourcesStorage._onCreate] mandatory message body value missing: ', message);

    let contentUrl = _this._url + '/' + generateGUID();

    let content = message.body.value;
    let resourceURL = message.body.value.url;

    // TODO: should verify if the current ressource already exists;
    // because when we, in the app, and did read to a resource a new create was sended;
    // we should control this;
    let resourceFind = Object.keys(_this._hypertyResources).find(item => _this._hypertyResources[item].url === resourceURL);

    // // log.log('Resource Find: ', resourceFind);
    if (resourceFind) {
      return;
    }

    if (!content.contentURL) content.contentURL = [];

    content.contentURL.push(contentUrl);

    _this._hypertyResources[contentUrl] = content;

    _this._storageManager.set('hypertyResources', 1, _this._hypertyResources).then(() => {
      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: contentUrl, code: 200 }
      };

      _this._bus.postMessage(response);
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
      reader.readAsArrayBuffer(current);
    }
  }

  /**
   * @description should delete an HypertyResource from the storage;
   *
   * @param {string} message - message containing the content URL of the hyperty resource to be deleted
   */

  _onDelete(message) {

    let _this = this;

    if (!message.body ) throw new Error('[HypertyResourcesStorage._onDelete] mandatory message body missing: ', message);

    if (message.body.resource) delete _this._hypertyResources[message.body.resource];
    else if (message.body.resources) {
      message.body.resources.forEach((resource) => {
        delete _this._hypertyResources[resource];
      });
    } else throw new Error('[HypertyResourcesStorage._onDelete] mandatory resource missing: ', message);

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
