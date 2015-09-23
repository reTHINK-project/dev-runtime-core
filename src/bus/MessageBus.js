export default class MessageBus {
  /* private
    _registry: Registry

    _subscriptions: <string: MsgListener[]>
    _interceptors: <string: MsgListener[]>
  */

  constructor(registry) {
    let _this = this;

    _this._registry = registry;
    _this._subscriptions = {};
    _this._interceptors = {};
  }

  addListener(url, listener, target) {
    //TODO: include code for target redirection...
    let _this = this;

    let item = new MsgListener(_this._subscriptions, url, listener);
    let itemList = _this._subscriptions[url];
    if (!itemList) {
      itemList = [];
      _this._subscriptions[url] = itemList;
    }

    itemList.push(item);
    return item;
  }

  addInterceptor(interceptedURL, listener, interceptorURL) {
    //TODO: include code for interceptorURL...
    let _this = this;

    let item = new MsgListener(_this._interceptors, interceptedURL, listener);
    let itemList = _this._interceptors[interceptedURL];
    if (!itemList) {
      itemList = [];
      _this._interceptors[interceptedURL] = itemList;
    }

    itemList.push(item);
    return item;
  }

  postMessage(msg) {
    let _this = this;

    //verify interceptedURL
    //TODO: interceptedURL é verificado à saida? ou na entrada "_onMessage" ?
    //if(msg.header.to)

    //resolve protostub URL
    _this._registry.resolve(msg.header.to).then((protoStubURL) => {
      let itemList = _this._subscriptions[protoStubURL];
      if (itemList) {
        itemList.forEach((sub) => {
          sub._callback(msg);
        });
      }
    }).catch(function(e) {
      console.log('PROTO-STUB-ERROR: ', e);
    });
  }

  _onMessage(msg) {
    let _this = this;

    _this._localPublish(msg);
  }

  _localPublish(msg) {
    let _this = this;

    let itemList = _this._subscriptions[msg.header.to];
    if (itemList) {
      itemList.forEach((sub) => {
        sub._callback(msg);
      });
    }
  }
}

class MsgListener {
  /* private
    _subscriptions: <string: MsgListener[]>;
    _url: string;
    _callback: (msg) => void;
  */

  constructor(subscriptions, url, callback) {
    let _this = this;

    _this._subscriptions = subscriptions;
    _this._url = url;
    _this._callback = callback;
  }

  get url() { return this._url; }

  remove() {
    let _this = this;

    let subs = _this._subscriptions[_this._url];
    if (subs) {
      let index = subs.indexOf(_this);
      subs.splice(index, 1);
    }
  }
}
