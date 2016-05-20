import { divideURL } from '../utils/utils';
import Subscription from './Subscription';

class ReporterObject {

  constructor(parent, owner, url) {
    let _this = this;

    _this._parent = parent;
    _this._owner = owner;
    _this._url = url;

    _this._bus = parent._bus;

    _this._domain = divideURL(owner).domain;
    _this._objSubscriptorURL = _this._url + '/subscription';

    _this._subscriptions = {};
    _this._childrens = [];
    _this._childrenListeners = [];

    _this._forwards = {};

    _this._allocateListeners();
  }

  _allocateListeners() {
    let _this = this;

    //add subscription listener...
    _this._subscriptionListener = _this._bus.addListener(_this._objSubscriptorURL, (msg) => {
      console.log(_this._objSubscriptorURL + '-RCV: ', msg);
      switch (msg.type) {
        case 'subscribe': _this._onRemoteSubscribe(msg); break;
        case 'unsubscribe': _this._onRemoteUnSubscribe(msg); break;
        case 'response': _this._onRemoteResponse(msg); break;
      }
    });

    let changeURL = _this._url + '/changes';
    _this._changeListener = _this._bus.addListener(changeURL, (msg) => {
      //TODO: what todo here? Save changes?
      console.log('SyncherManager-' + changeURL + '-RCV: ', msg);
    });
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

  /**
   * Register a listener in the msg-node and in the local MessageBus, so that messages on this address are forwarded to the reporter object
   * @param  {string} address - URL to register the listeners
   * @return {Promise} Return Promise OK or error
   */
  forwardSubscribe(address) {
    let _this = this;

    //FLOW-OUT: message sent to the msg-node SubscriptionManager component
    let nodeSubscribeMsg = {
      type: 'subscribe', from: _this._parent._url, to: 'domain://msg-node.' + _this._domain + '/sm',
      body: { subscribe: [address], source: _this._owner }
    };

    return new Promise((resolve, reject) => {
      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        console.log('forward-subscribe-response(reporter): ', reply);
        if (reply.body.code === 200) {
          let newForward = _this._bus.addForward(_this._url, _this._owner);
          _this._forwards[address] = newForward;
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
      body: { subscribe: [address], source: _this._owner }
    };

    _this._bus.postMessage(nodeUnSubscribeMsg);
  }

  /**
   * Register listeners for a list of childrens. Public channels used to transmit messages.
   * @param  {string[]} childrens - channels to register
   * @return {Promise} Return Promise OK or error
   */
  addChildrens(childrens) {
    let _this = this;

    return new Promise((resolve, reject) => {
      if (childrens.length === 0) {
        resolve();
        return;
      }

      let childBaseURL = _this._url + '/children/';
      _this._childrens.push(childrens);

      /*
      _this._childrens.forEach((child) => {
        let childId = childBaseURL + child;

        let selfForward = _this._bus.addForward(childId, owner);
        _this._childrenListeners.push(selfForward);
      });*/

      let subscriptions = [];
      childrens.forEach((child) => subscriptions.push(childBaseURL + child));

      //FLOW-OUT: message sent to the msg-node SubscriptionManager component
      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._parent._url, to: 'domain://msg-node.' + _this._domain + '/sm',
        body: { subscribe: subscriptions, source: _this._owner }
      };

      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        console.log('node-subscribe-response(reporter): ', reply);
        if (reply.body.code === 200) {

          //add children listeners on local ...
          subscriptions.forEach((childURL) => {
            let childListener = _this._bus.addListener(childURL, (msg) => {
              //TODO: what todo here? Save childrens?
              console.log('SyncherManager-' + childURL + '-RCV: ', msg);
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
      body: { code: msg.body.code, source: msg.from }
    });
  }

  //FLOW-IN: message received from Syncher -> subscribe
  _onRemoteSubscribe(msg) {
    let _this = this;
    let hypertyURL = msg.body.subscriber;

    //validate if subscription already exists?
    if (_this._subscriptions[hypertyURL]) {
      let errorMsg = {
        id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
        body: { code: 500, desc: 'Subscription for (' + _this._url + ' : ' +  hypertyURL + ') already exists!' }
      };

      _this._bus.postMessage(errorMsg);
      return;
    }

    //ask to subscribe to Syncher? (depends on the operation mode)
    //TODO: get mode from object!
    let mode = 'sub/pub';

    if (mode === 'sub/pub') {
      //FLOW-OUT: message sent to local hyperty address Syncher -> _onForward
      let forwardMsg = {
        type: 'forward', from: _this._url, to: _this._owner,
        body: { type: msg.type, from: hypertyURL, to: _this._url }
      };

      _this._bus.postMessage(forwardMsg, (reply) => {
        console.log('forward-reply: ', reply);
        if (reply.body.code === 200) {
          _this._subscriptions[hypertyURL] = new Subscription(_this._bus, _this._owner, _this._url, _this._childrens, true);
        }

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
    let hypertyURL = msg.body.subscriber;

    let subscription = _this._subscriptions[hypertyURL];
    if (subscription) {
      subscription._releaseListeners();
      delete _this._subscriptions[hypertyURL];

      //TODO: send un-subscribe message to Syncher? (depends on the operation mode)
    }

  }

}

export default ReporterObject;
