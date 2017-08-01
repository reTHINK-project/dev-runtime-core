import { generateGUID } from '../utils/utils';

class HypertyResourcesStorage {

  constructor(runtimeURL, bus, storageManager, hypertyResources) {

    if (!storageManager) throw new Error('[HypertyResourcesStorage constructor] mandatory storageManager parameter missing');
    if (!runtimeURL) throw new Error('[HypertyResourcesStorage constructor] mandatory runtimeURL parameter missing');
    if (!bus) throw new Error('[HypertyResourcesStorage constructor] mandatory bus parameter missing');

    let _this = this;

    _this._bus = bus;

    _this._url = runtimeURL + '/storage'

    _this._storageManager = storageManager;

    _this._hypertyResources = hypertyResources;

    bus.addListener(_this._url, (msg) => {
      console.log('[HypertyResourcesStorage] Message RCV: ', msg);
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

    if (!message.body || message.body.value) throw new Error('[HypertyResourcesStorage._onCreate] mandatory message body value missing: ', message);

    let contentUrl = _this._url + '/' + generateGUID();

    _this._hypertyResources[contentUrl] = message.body.value;

    _this._storageManager.set('hypertyResources', 1, _this._hypertyResources).then(() => {
      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { value: contentUrl, code:200 }
      }

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

    if (!message.body || message.body.resource) throw new Error('[HypertyResourcesStorage._onRead] mandatory message body resource missing: ', message);

    let contentUrl = message.body.resource;

    let response = {
      from: message.to,
      to: message.from,
      id: message.id,
      type: 'response',
    }

    let content = _this._hypertyResources[contentUrl];

    if (content) {
      response.body.code = 200;
      response.body.value = content;

    } else {
      response.body.code = 404;
    }

    _this._hypertyResources[contentUrl] = message.body.value;

    _this._bus.postMessage(response);

  }

  /**
   * @description should delete an HypertyResource from the storage;
   *
   * @param {string} message - message containing the content URL of the hyperty resource to be deleted
   */

  _onDelete(message) {

    let _this = this;

    if (!message.body || message.body.resource) throw new Error('[HypertyResourcesStorage._onDelete] mandatory message body resource missing: ', message);

    delete _this._hypertyResources[message.body.resource];

    _this._storageManager.set('hypertyResources', 1, _this._hypertyResources).then(() => {
      let response = {
        from: message.to,
        to: message.from,
        id: message.id,
        type: 'response',
        body: { code: 200 }
      }

      _this._bus.postMessage(response);
    });

  }

}

export default HypertyResourcesStorage;
