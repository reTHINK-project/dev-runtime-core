import Subscription from './Subscription';

class ReporterObject {

  constructor(bus, owner, url, childrens) {
    let _this = this;
    let objSubscriptorURL = url + '/subscription';

    _this._bus = bus;
    _this._owner = owner;
    _this._url = url;
    _this._childrens = childrens;
    _this._subscriptions = {};

    //add objectURL forward...
    _this._objForward = bus.addForward(url, owner);

    //add subscription listener...
    _this._subscriptionListener = bus.addListener(objSubscriptorURL, (msg) => {
      console.log(objSubscriptorURL + '-RCV: ', msg);
      switch (msg.type) {
        case 'subscribe': _this._onRemoteSubscribe(msg); break;
        case 'unsubscribe': _this._onRemoteUnSubscribe(msg); break;
        case 'response': _this._onRemoteResponse(msg); break;
      }
    });

    //add children listeners...
    let childBaseURL = url + '/children/';
    _this._childrenListeners = [];
    childrens.forEach((child) => {
      let childURL = childBaseURL + child;
      let childListener = bus.addListener(childURL, (msg) => {
        //TODO: what todo here? Process child creations?
        console.log('SyncherManager-' + childURL + '-RCV: ', msg);
      });

      _this._childrenListeners.push(childListener);
    });

  }

  release() {
    let _this = this;

    _this._objForward.remove();
    _this._subscriptionListener.remove();
    _this._childrenListeners.forEach((cl) => {
      cl.remove();
    });

    //remove all subscriptions
    Object.keys(_this._subscriptions).forEach((key) => {
      //TODO: send unsubscribe message to all subscribed hyperties ?
      _this._subscriptions[key].release();
    });
  }

  _onRemoteResponse(msg) {
    let _this = this;

    _this._bus.postMessage({
      id: msg.id, type: 'response', from: msg.to, to: _this._url,
      body: { code: msg.body.code, source: msg.from }
    });
  }

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
      //forward to Hyperty owner
      let forwardMsg = {
        type: 'forward', from: _this._url, to: _this._owner,
        body: { type: msg.type, from: hypertyURL, to: _this._url }
      };

      _this._bus.postMessage(forwardMsg, (reply) => {
        console.log('forward-reply: ', reply);
        if (reply.body.code === 200) {
          _this._subscriptions[hypertyURL] = new Subscription(_this._bus, hypertyURL, _this._url, _this._childrens);
        }

        //send subscribe-response
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: reply.body
        });

      });
    }

  }

  _onRemoteUnSubscribe(msg) {
    let _this = this;
    let hypertyURL = msg.body.subscriber;

    let subscription = _this._subscriptions[hypertyURL];
    if (subscription) {
      subscription.release();
      delete _this._subscriptions[hypertyURL];

      //TODO: send un-subscribe message to Syncher? (depends on the operation mode)
    }

  }

}

export default ReporterObject;
