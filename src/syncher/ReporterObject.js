// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('ReporterObject');

import { divideURL, splitObjectURL } from '../utils/utils';
import Subscription from './Subscription';
import * as cryptoManager from '../cryptoManager/CryptoManager';

class ReporterObject {

  constructor(parent, owner, url, childrens, offline) {
    let _this = this;

    _this._parent = parent;
    _this._owner = owner;
    _this._url = url;

    _this._bus = parent._bus;

    _this._domain = divideURL(url).domain;
    _this._objSubscriptorURL = _this._url + '/subscription';

    _this._subscriptions = {};
    _this._childrens = childrens;
    _this._childrenListeners = [];

    _this._forwards = {};

    _this._isToSaveData = false;

    _this._allocateListeners();

    _this._offline = offline ? offline : false;
  }

  get offline(){
    return this._offline;
  }

  _allocateListeners() {
    let _this = this;

    //add subscription listener...
    _this._subscriptionListener = _this._bus.addListener(_this._objSubscriptorURL, (msg) => {
      log.info('[SyncherManager.ReporterObject received ]', msg);
      switch (msg.type) {
        case 'subscribe': _this._onRemoteSubscribe(msg); break;
        case 'unsubscribe': _this._onRemoteUnSubscribe(msg); break;
        case 'response': _this._onRemoteResponse(msg); break;
        case 'forward': _this._onForwardedRemoteSubscribe(msg); break;
      }
    });

    let changeURL = _this._url + '/changes';
    _this._changeListener = _this._bus.addListener(changeURL, (msg) => {

      log.info('[SyncherManager.ReporterObject ] SyncherManager-' + changeURL + '-RCV: ', msg);

      //do not save changes to backupRevision to avoid infinite loops
      if (this._isToSaveData && msg.body.attribute ) {
        let updateRuntimeStatus = msg.body.attribute !== 'backupRevision' ? true : false;
        log.log('[SyncherManager.ReporterObject ] SyncherManager - save data: ', msg);
        _this._parent._dataObjectsStorage.update(true, _this._url, 'version', msg.body.version, updateRuntimeStatus);
        _this._parent._dataObjectsStorage.update(true, _this._url, 'lastModified', msg.body.lastModified, updateRuntimeStatus);
        _this._parent._dataObjectsStorage.saveData(true, _this._url, msg.body.attribute, msg.body.value, updateRuntimeStatus);
      }
    });
  }

  set isToSaveData(value) {
    this._isToSaveData = value;
  }

  // To handle subscriptions sent while the reporter was offline ie forwarded by a Offline Subscription Manager service

  _onForwardedRemoteSubscribe(msg) {
    this._onRemoteSubscribe(msg.body);
  }

  _releaseListeners() {
    let _this = this;

    _this._subscriptionListener.remove();

    _this._changeListener.remove();

    _this._childrenListeners.forEach((cl) => {
      cl.remove();
    });

    Object.keys(_this._forwards).forEach((key) => {
      _this.forwardUnSubscribe(key);
    });

    //remove all subscriptions
    Object.keys(_this._subscriptions).forEach((key) => {
      _this._subscriptions[key]._releaseListeners();
    });
  }

  resumeSubscriptions(subscriptions) {
    let _this = this;

    if (!subscriptions)
      return;

    Object.keys(subscriptions).forEach((key) => {
      let hypertyURL = subscriptions[key];

      log.log('[SyncherManager.ReporterObject] - resume subscriptions', _this, hypertyURL, _this._childrens);

      if (!_this._subscriptions[hypertyURL]) {
        _this._subscriptions[hypertyURL] = new Subscription(_this._bus, _this._owner, _this._url, true);
      }
    });

  }

  /**
   * Register a listener in the msg-node and in the local MessageBus, so that messages on this address are forwarded to the reporter object
   * @param  {string} address - URL to register the listeners
   * @return {Promise} Return Promise OK or error
   */
  forwardSubscribe(addresses) {
    let _this = this;

    //FLOW-OUT: message sent to the msg-node SubscriptionManager component
    let nodeSubscribeMsg = {
      type: 'subscribe', from: _this._parent._url, to: 'domain://msg-node.' + _this._domain + '/sm',
      body: { resources: addresses, source: _this._owner }
    };

    return new Promise((resolve, reject) => {
      _this._bus.postMessageWithRetries(nodeSubscribeMsg, 10, (reply) => {
        log.log('[SyncherManager.ReporterObject ]forward-subscribe-response(reporter): ', reply);
        if (reply.body.code === 200) {
          let newForward = _this._bus.addForward(_this._url, _this._owner);
          _this._forwards[addresses[0]] = newForward;
          resolve();
        } else {
          reject('Error on msg-node subscription: ' + reply.body.desc);
        }
      });
    });
  }

  /**
   * UnRegister a listener in the msg-node and in the local MessageBus, so that messages on this address are removed from forward
   * @param  {string} address - URL to un-register the listeners
   */
  forwardUnSubscribe(address) {
    let _this = this;

    _this._forwards[address].remove();
    delete _this._forwards[address];

    //FLOW-OUT: message sent to the msg-node SubscriptionManager component
    let nodeUnSubscribeMsg = {
      type: 'unsubscribe', from: _this._parent._url, to: 'domain://msg-node.' + _this._domain + '/sm',
      body: { resources: [address], source: _this._owner }
    };

    _this._bus.postMessage(nodeUnSubscribeMsg);
  }

  /**
   * Register listeners for a list of childrens. Public channels used to transmit messages.
   * @param  {string[]} childrens - channels to register
   * @return {Promise} Return Promise OK or error
   */
  addChildrens() {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (_this._childrens.length === 0) {
        resolve();
        return;
    }

      let childBaseURL = _this._url + '/children/';
      log.log('[SyncherManager.ReporterObject - addChildrens] - childrens: ', childBaseURL);

  /*    childrens.forEach((child) => {
        _this._childrens.push(child);
      });*/

      /*
      _this._childrens.forEach((child) => {
        let childId = childBaseURL + child;

        let selfForward = _this._bus.addForward(childId, owner);
        _this._childrenListeners.push(selfForward);
      });*/

      let subscriptions = [];
//      childrens.forEach((child) => subscriptions.push(childBaseURL + child));
      subscriptions.push(childBaseURL );

      //_this._storageSubscriptions[_this._objSubscriptorURL] = {url: _this._url, owner: _this._owner, childrens: _this._childrens};

      //FLOW-OUT: message sent to the msg-node SubscriptionManager component
      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._parent._url, to: 'domain://msg-node.' + _this._domain + '/sm',
        body: { resources: subscriptions, source: _this._owner }
      };

      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        log.log('[SyncherManager.ReporterObject ]node-subscribe-response(reporter):', reply);
        if (reply.body.code === 200) {

          //add children listeners on local ...
          subscriptions.forEach((childURL) => {
            let childListener = _this._bus.addListener(childURL, (msg) => {
              //TODO: what todo here? Save childrens?
              log.log('[SyncherManager.ReporterObject received]', msg);


              if (msg.type === 'create' && msg.to.includes('children') && this._isToSaveData) {

                // if the value is not encrypted lets encrypt it
                // todo: should be subject to some policy
                let splitedReporterURL = splitObjectURL(msg.to);

                let url = splitedReporterURL.url;

                if (!msg.body.hasOwnProperty('mutual')) msg.body.mutual = true;

                //remove false when mutualAuthentication is enabled
                if (!(typeof msg.body.value === 'string') && msg.body.mutual) {

                  log.log('[SyncherManager.ReporterObject] encrypting received data ', msg.body.value);

                  cryptoManager.default.encryptDataObject(msg.body.value, url).then((encryptedValue)=>{
                    log.log('[SyncherManager.ReporterObject] encrypted data ',  encryptedValue);

                    _this._storeChildObject(msg, JSON.stringify(encryptedValue));
                  }).catch((reason) => {
                    log.warn('[SyncherManager._decryptChildrens] failed : ', reason, ' Storing unencrypted');
                    _this._storeChildObject(msg, msg.body.value);
                  });
                } else {
                  _this._storeChildObject(msg, msg.body.value);
                }
              }

            });
            _this._childrenListeners.push(childListener);

            let selfForward = _this._bus.addForward(childURL, _this._owner);
            _this._childrenListeners.push(selfForward);
          });

          resolve();
        } else {
          reject('Error on msg-node subscription: ' + reply.body.desc);
        }
      });
    });
  }

  // store childObject

  _storeChildObject(msg, data) {
    let _this = this;

    let splitedReporterURL = splitObjectURL(msg.to);

    let url = splitedReporterURL.url;

    let resource = splitedReporterURL.resource;
    let value;
    

/*    if (msg.body.identity) {
      value.identity = msg.body.identity;
      delete value.identity.assertion;
      delete value.identity.expires;
    }*/

    let objectURLResource = msg.body.resource;
    let attribute = resource;

    if (objectURLResource === 'heartbeat' ) value = data;
    else value = {
      identity: msg.body.identity,
      value: data
    };

//    if (objectURLResource) attribute += '.' + objectURLResource;
    if (objectURLResource) attribute = objectURLResource;

    // this identity data is not needed to be stored


    console.log('[SyncherManager.ReporterObject._storeChildObject] : ', url, attribute, value);

    _this._parent._dataObjectsStorage.saveChildrens(true, url, attribute, value);
  }

  delete() {
    let _this = this;
    let domain = divideURL(_this._owner).domain;

    //FLOW-OUT: message sent directly to all subscribers of the reporter
    _this._bus.postMessage({
      type: 'delete', from: _this._objSubscriptorURL, to: _this._url + '/changes'
    });

    //FLOW-OUT: message sent to the msg-node ObjectAllocationManager component
    _this._bus.postMessage({
      type: 'delete', from: _this._parent._url, to: 'domain://msg-node.' + domain + '/object-address-allocation',
      body: { resource: _this._url, childrenResources: _this._childrens }
    });

    _this._releaseListeners();
    delete _this._parent._reporters[_this._url];
  }

  _onRemoteResponse(msg) {
    let _this = this;

    _this._bus.postMessage({
      id: msg.id, type: 'response', from: msg.to, to: _this._url,
      body: { code: msg.body.code, identity: msg.body.identity, source: msg.from }
    });
  }

  //FLOW-IN: message received from Syncher -> subscribe
  _onRemoteSubscribe(msg) {
    let _this = this;
    let hypertyURL = msg.body.subscriber;

    //validate if subscription already exists?
    if (_this._subscriptions[hypertyURL]) {
      // let errorMsg = {
      //   id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
      //   body: { code: 500, desc: 'Subscription for (' + _this._url + ' : ' +  hypertyURL + ') already exists!' }
      // };
      //
      // _this._bus.postMessage(errorMsg);
      // return;

      // new version because of reusage
      _this._subscriptions[hypertyURL]._releaseListeners();
    }

    //ask to subscribe to Syncher? (depends on the operation mode)
    //TODO: get mode from object!
    let mode = 'sub/pub';

    if (mode === 'sub/pub') {
      //FLOW-OUT: message sent to local hyperty address Syncher -> _onForward
      let forwardMsg = {
        type: 'forward', from: _this._url, to: _this._owner,
        body: { type: msg.type, from: hypertyURL, to: _this._url, identity: msg.body.identity }
      };

      //TODO: For Further Study
      if (msg.body.hasOwnProperty('mutual')) forwardMsg.body.mutual = msg.body.mutual;

      _this._bus.postMessage(forwardMsg, (reply) => {
        log.log('[SyncherManager.ReporterObject ]forward-reply: ', reply);
        if (reply.body.code === 200) {
          if (!_this._subscriptions[hypertyURL]) {
            log.log('[SyncherManager.ReporterObject] - _onRemoteSubscribe:', _this._childrens);
            _this._subscriptions[hypertyURL] = new Subscription(_this._bus, _this._owner, _this._url, true);
          }
        }


        // Store for each reporter hyperty the dataObject
        let userURL;
        if (msg.body.identity && msg.body.identity.userProfile.userURL) {
          userURL = msg.body.identity.userProfile.userURL;
          _this._parent._dataObjectsStorage.update(true, _this._url, 'subscriberUsers', userURL);
        }

        //TODO: mutual and sessionkeys updates were removed. FFS

        /*        if (msg.body.hasOwnProperty('mutual')) {
//          _this._parent._identityModule.updateIsToEncryptForDataObjectSessionKey(_this._url, msg.body.mutual).then(()=>{
            _this._parent._dataObjectsStorage.update(true, _this._url, 'mutual', msg.body.mutual);
//          });
        }*/

        _this._parent._dataObjectsStorage.update(true, _this._url, 'subscriptions', hypertyURL);

        reply.body.owner = _this._owner;

        //FLOW-OUT: subscription response sent (forward from internal Hyperty)
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: reply.body
        });

      });
    }

  }

  //FLOW-IN: message received from remote ObserverObject -> removeSubscription
  _onRemoteUnSubscribe(msg) {
    let _this = this;
    let unsubscriber = msg.body.source;

    let subscription = _this._subscriptions[unsubscriber];
    if (subscription) {
      subscription._releaseListeners();
      delete _this._subscriptions[unsubscriber];

      let forwardMsg = {
        type: 'forward', from: _this._url, to: _this._owner,
        body: { type: msg.type, from: unsubscriber, to: _this._url, identity: msg.body.identity }
      };


      _this._bus.postMessage(forwardMsg);
    }

  }

}

export default ReporterObject;
