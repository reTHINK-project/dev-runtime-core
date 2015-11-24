/**
 * @author micaelpedrosa@gmail.com
 * Core Syncronization system.
 */
class SyncherManager {
  /* private
  _url: URL
  _bus: MiniBus
  _registry: Registry

  _subscriptions: {ObjectURL: {sm: MsgListener, owner: HypertyURL, <HypertyURL: MsgListener>}}
  */

  constructor(runtimeURL, bus, registry) {
    let _this = this;

    _this._url = runtimeURL + SyncherManager.SM;
    _this._bus = bus;
    _this._registry = registry;

    _this._subscriptions = {};

    bus.addListener(_this._url, (msg) => {
      console.log('SyncherManager-RCV: ', msg);
      switch (msg.type) {
        case 'create': _this._onCreate(msg); break;
        case 'delete': _this._onDelete(msg); break;
      }
    });
  }

  get url() { return this._url; }

  _onCreate(msg) {
    let _this = this;
    let owner = msg.from;

    //TODO: 5-7 authorizeObjectCreation(owner, obj ???? )

    //TODO: get address from address allocator ?
    let objURL = 'resource://obj1';
    let objSubscriptorURL = objURL + SyncherManager.SM;

    //15. add subscription listener
    let sm = _this._bus.addListener(objSubscriptorURL, (msg) => {
      console.log(objSubscriptorURL + '-RCV: ', msg);
      switch (msg.type) {
        case 'subscribe': _this._onSubscribe(objURL, msg); break;
        case 'unsubscribe': _this._onUnSubscribe(objURL, msg); break;
      }
    });

    _this._subscriptions[objURL] = {};
    _this._subscriptions[objURL].owner = owner;
    _this._subscriptions[objURL].sm = sm;

    //all ok, send response
    _this._bus.postMessage({
      id: msg.id, type: 'response', from: _this._url, to: owner,
      body: {code: 200, resource: objURL}
    });

    //19. send create to all observers, responses will be deliver to the Hyperty owner?
    //TODO: maybe it's better the msg.from === objURL + '/sm'. So that it can receive the responses?
    msg.body.authorise.forEach((hypertyURL) => {
      _this._bus.postMessage({
        type: 'create', from: owner, to: hypertyURL,
        body: { resource: objURL, schema: msg.body.schema, value: msg.body.value }
      });
    });
  }

  _onDelete(msg) {
    let _this = this;

    //TODO: where to get objectURL ?
    let objURL = '<objURL>';

    //destroy all objURL listeners
    delete _this._subscriptions[objURL];
    _this._bus.removeAllListenersOf(objURL);
    _this._bus.removeAllListenersOf(objURL + SyncherManager.SM);

    //TODO: destroy object in the registry ?
  }

  _onSubscribe(objURL, msg) {
    let _this = this;
    let hypertyUrl = msg.from;

    //27. validate if subscription already exists?
    if (_this._subscriptions[objURL][hypertyUrl]) {
      let errorMsg = {
        id: msg.id, type: 'response', from: _this._url, to: msg.from,
        body: {code: 500, desc: 'Subscription for (' + objURL + ' : ' +  hypertyUrl + ') already exists!'}
      };

      _this._bus.postMessage(errorMsg);
      return;
    }

    //31. ask to subscribe to Syncher? (depends on the operation mode)
    //TODO: where do I get the obj owner (hypertyURL) ?

    //TODO: get the domain
    let domainURL = '<domain of msg.from>';

    _this._registry.getSandbox(domainURL).then((sandbox) => {
      let sub = _this._bus.addListener(objURL, (msg) => {
        sandbox.postMessage(msg);
      });

      _this._subscriptions[objURL][hypertyUrl] = sub;
    });

    //TODO: if all ok, send response

  }

  _onUnSubscribe(objURL, msg) {
    let _this = this;

    let hypertyUrl = msg.from;
    let sub = _this._subscriptions[objURL][hypertyUrl];
    delete _this._subscriptions[objURL][hypertyUrl];

    sub.remove();

    //TODO: send un-subscribe message to Syncher? (depends on the operation mode)
  }
}

SyncherManager.SM = '/sm';
