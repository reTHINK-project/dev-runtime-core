// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('ObserverObject');

import { divideURL, splitObjectURL, deepClone } from '../utils/utils';
import Subscription from './Subscription';
import * as cryptoManager from '../cryptoManager/CryptoManager';

class ObserverObject {

  constructor(parent, url, childrens) {
    let _this = this;

    _this._parent = parent;
    _this._url = url;
    _this._childrens = childrens;

    _this._bus = parent._bus;

    _this._subscriptions = {};
    _this._storageSubscriptions = {};
    _this._childrenListeners = [];

    this._isToSaveData = false;

    let changeURL = _this._url + '/changes';
    _this._changeListener = _this._bus.addListener(changeURL, (msg) => {

      log.log('[SyncherManager.ObserverObject ] SyncherManager-' + changeURL + '-RCV: ', msg);

      //TODO: what todo here? Save changes?
      if (this._isToSaveData && msg.body.attribute) {
        log.log('[SyncherManager.ObserverObject ] SyncherManager - save data: ', msg);
        _this._parent._dataObjectsStorage.update(false, _this._url, 'version', msg.body.version);
        _this._parent._dataObjectsStorage.update(false, _this._url, 'lastModified', msg.body.lastModified);
        _this._parent._dataObjectsStorage.saveData(false, _this._url, msg.body.attribute, msg.body.value);
      }

    });
  }

  set isToSaveData(value) {
    this._isToSaveData = value;
  }

  _newSubscription(hyperty) {
    let _this = this;

    let subscription = _this._subscriptions[hyperty];
    log.log('[Observer Object - new subscription] - ',  _this._subscriptions, hyperty, _this._subscriptions.hasOwnProperty(hyperty));
    if (!subscription) {
      _this._subscriptions[hyperty] = new Subscription(_this._bus, hyperty, _this._url, _this._childrens, false);
    }
  }

  addSubscription(hyperty) {
    let _this = this;

    _this._newSubscription(hyperty);
  }

  addChildrens(childrens) {
    let _this = this;

    return new Promise((resolve) => {
      if (childrens.length === 0) {
        return resolve();
      }

      let childBaseURL = _this._url + '/children/';
      log.log('[SyncherManager.ObserverObject - addChildrens] - childrens: ', childrens, childBaseURL);

      childrens.forEach((child) => {

        let childListener = _this._bus.addListener(childBaseURL + child, (msg) => {
          //TODO: what todo here? Save childrens?
          log.log('[SyncherManager.ObserverObject received]', msg);

          if (msg.type === 'create' && msg.to.includes('children') && this._isToSaveData) {
            let splitedReporterURL = splitObjectURL(msg.to);

            let url = splitedReporterURL.url;

            if (!msg.body.hasOwnProperty('mutual')) msg.body.mutual = true;

            //remove false when mutualAuthentication is enabled
            if (!(typeof msg.body.value === 'string') && msg.body.mutual) {

              log.log('[SyncherManager.ObserverObject] encrypting received data ', msg.body.value);

              cryptoManager.default.encryptDataObject(msg.body.value, url).then((encryptedValue)=>{
                log.log('[SyncherManager.ObserverObject] encrypted data ',  encryptedValue);

                _this._storeChildObject(msg, JSON.stringify(encryptedValue));
              }).catch((reason) => {
                log.warn('[SyncherManager.ObserverObject._encryptChild] failed, storing unencrypted ', reason);
                _this._storeChildObject(msg, msg.body.value);
              });
            } else {
              _this._storeChildObject(msg, msg.body.value);
            }
          }

          log.log('[SyncherManager.ObserverObject children Listeners]', _this._childrenListeners, childListener);
          if (_this._childrenListeners.indexOf(childListener) === -1) {
            _this._childrenListeners.push(childListener);
          }

        });

      });

    });
  }

  // store childObject

  _storeChildObject(msg, data) {
    let _this = this;

    let splitedReporterURL = splitObjectURL(msg.to);

    let url = splitedReporterURL.url;

    let resource = splitedReporterURL.resource;
    let value = {};

/*    let value = {
      identity: msg.body.identity,
      value: data
    };*/

    // this identity data is not needed to be stored
/*    delete value.identity.assertion;
    delete value.identity.expires;*/

    let objectURLResource = msg.body.resource;
    let attribute = resource;

    if (objectURLResource === 'heartbeat') {
      value = data;
    } else {
      value.identity= msg.body.identity;
      value.data = data;
    } 

//    if (objectURLResource) attribute += '.' + objectURLResource;
    if (objectURLResource) attribute = objectURLResource;

    log.log('[SyncherManager.ObserverObject._storeChildObject] : ', url, attribute, value);

    _this._parent._dataObjectsStorage.saveChildrens(false, url, attribute, value);
  }

  removeSubscription(msg) {
    let _this = this;

    let hyperty = msg.from;

    let domain = divideURL(hyperty).domain;
    let objURLSubscription = _this._url + '/subscription';

    let subscription = _this._subscriptions[hyperty];
    if (subscription) {
      //FLOW-OUT: message sent to remote ReporterObject -> _onRemoteUnSubscribe
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: objURLSubscription,
        body: { source: hyperty, identity: msg.body.identity }
      });

      //TODO: should I wait for response before unsubscribe on msg-node
      //FLOW-OUT: message sent to msg-node SubscriptionManager component
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._parent._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { resource: _this._url, childrenResources: _this._childrens }
      });

      subscription._releaseListeners();
      delete _this._subscriptions[hyperty];
    }
  }

}

export default ObserverObject;
