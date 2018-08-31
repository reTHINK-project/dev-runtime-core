/**
* The Hyperty Resource Data Model is used to model resouces handled by Hyperties and Data Objects including chat messages, files, real time human audio and video..
*
*/

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('HypertyResource');

import { deepClone } from '../utils/utils.js';
import DataObjectChild from '../syncher/DataObjectChild.js';

class HypertyResource extends DataObjectChild {

  /**
  * HypertyResource constructor
  *
  * @param  {URL} localRuntimeURL RuntimeURL of local runtime
  * @param  {URL} input.owner HypertyURL of the Hyperty handling this resource
  * @param  {URL} input.runtime Runtime URL where this resource is hosted
  * @param  {Bus} input.bus sandbox message bus
  * @param  {DataObject} input.parent Parent Data Object where the HypertyResource is handled as a child
  * @param  {Boolean} isSender indicates if parent is Reporter or an Observer
  * @param  {Array} input optional input parameters
  */

  constructor(isSender, input) {
    super(input);
    let _this = this;

    _this.arraybufferSizeLimit = 5242880; //above this limit content is not saved as ArrayBuffer

    _this._isSender = isSender;

    _this._localStorageURL = _this._parentObject._syncher._runtimeUrl + '/storage';

  }

  get resourceType() {
    let _this = this;
    return _this.metadata.resourceType;
  }

  get mimetype() {
    let _this = this;
    return _this._metadata.type;
  }

  get content() {
    let _this = this;
    return _this._content;
  }

  get contentURL() {
    let _this = this;
    return _this._metadata.contentURL;
  }

  get shareable() {
    let _this = this;
    let shareable = super.metadata;
    shareable.resourceType = _this.resourceType;
    return shareable;
  }

  /*
  set parent(parent) {
    let _this = this;
    _this._parent = parent;
  }*/

  save() {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let msg = {
        from: _this._owner,
        to: _this._localStorageURL,
        type: 'create',
        body: { value: deepClone(_this._metadata) }
      };

      let callback = (reply) => {
        log.info('[HypertyResource.save] reply: ', reply);
        _this._bus.removeResponseListener(_this._owner, reply.id);
        if (reply.body.code === 200) {
          if (reply.body.value) {
            if (!_this._metadata.contentURL) _this._metadata.contentURL = [];
            _this._metadata.contentURL.push(reply.body.value);
          }
          resolve();
        } else reject(reply.body.code + ' ' + reply.body.desc);

      };

      msg.body.value.content = _this._content;

      _this._bus.postMessage(msg, callback, false);

    });

  }

  /**
  * Function to Read HypertyResource
  *
  * @param  {} callback callback to be called with progress information in terms of percentage
  * @return  {Promise}  input optional input parameters
  */


  read(callback) {
    let _this = this;
    log.info('[HypertyResource.read] ', this);

    return new Promise(function(resolve, reject) {

      if (_this.content) {
        resolve(_this);
      } else {

        //TODO: use an iteration to get online runtime storages when some are offline
        let storage = _this._getBestContentURL(_this._metadata.contentURL);

        log.log('Storage:', storage);

        let msg = {
          from: _this._owner,
          to: storage.url,
          type: 'read',
          body: { resource: storage.url + '/' + storage.resource, p2p: true }
        };

        if (_this.metadata.p2pRequester && _this.metadata.p2pHandler) {
          msg.body.p2pRequester = _this.metadata.p2pRequester;
          msg.body.p2pHandler = _this.metadata.p2pHandler;
        }

        // get the resource first on the Local Hyperty Resource Storage;
        _this._getBestResource(msg, callback).then((reply) => {
          log.info('[HypertyResource] - get locally the resource:', reply);
          resolve(_this);
        }).catch((reply) => {

          log.warn('[HypertyResource] - get locally the resource fail', reply);

          // Generate new message to not use the same id of the last one;
          let msg = {
            from: _this._owner,
            to: storage.remoteURL,
            type: 'read',
            body: { resource: storage.remoteURL + '/' + storage.resource, p2p: true }
          };

          if (_this.metadata.p2pRequester && _this.metadata.p2pHandler) {
            msg.body.p2pRequester = _this.metadata.p2pRequester;
            msg.body.p2pHandler = _this.metadata.p2pHandler;
          }

          // get the resource on the Remote Hyperty Resource Storage;
          _this._getBestResource(msg, callback).then((reply) => {
            log.warn('[HypertyResource] - get remotely the resource', reply);
            resolve(_this);
          }).catch((reply) => {
            log.warn('[HypertyResource] - get remotely the resource fail', reply);
            reject(reply.body.code + ' ' + reply.body.desc);
          });

        });

      }
    });
  }

  _getBestResource(msg, inProgressCallback) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let waitForResponse = setTimeout(() => {

        // If Reporter does  not reply the promise is rejected
        _this._bus.removeResponseListener(_this._owner, id);

        msg.body.code = 408;
        msg.body.desc = 'Response timeout'

        return reject(msg);

      }, 3000);

      let callback = (reply) => {
        log.log('[HypertyResource.read] reply: ', reply);
        let id = reply.id;

        clearTimeout(waitForResponse);

        switch (reply.body.code) {
          case 200:
            _this._content = reply.body.value.content;

            // save locally if not too big
            if (reply.body.value.size < _this.arraybufferSizeLimit) {
              _this.save();
            }

            _this._bus.removeResponseListener(_this._owner, id);
            resolve(reply);

            break;

          case 183:
            inProgressCallback(reply.body.value);
            break;

          default:
            _this._bus.removeResponseListener(_this._owner, id);
            reject(reply);
            break;
        }

      };

      let id = _this._bus.postMessage(msg, callback, false);

    });

  }

  // Remove Hyperty from the local storage

  delete() {
    let _this = this;

    log.info('[HypertyResource.delete]', _this.metadata);


    let msg = {
      from: _this._owner,
      to: _this._localStorageURL,
      type: 'delete',
      body: { resources: _this.metadata.contentURL }
    };

    return new Promise((resolve) => {
      _this._bus.postMessage(msg, (reply) => {
        if (reply.body.code < 300) resolve(true);
        else resolve(false);
      });
    });
  }

  _getBestContentURL(contentURLList) {

    let _this = this;

    const contentURL = contentURLList[0];
    const splitedResource = contentURL.substr(contentURL.lastIndexOf('/') + 1);
    const url = _this._localStorageURL; // contentURL.substr(0, contentURL.lastIndexOf('/'));
    const remoteResource = contentURL.substr(0, contentURL.lastIndexOf('/'));

    return {url: url, resource: splitedResource, remoteURL: remoteResource };

  }

}


export default HypertyResource;
