export default
/**
* Message BUS Interface
*/
class MessageBus {
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

  /**
  * To add "listener" functions to be called when routing messages published on a certain "resource" or send to a certain url. Messages are routed to input parameter "redirectTo" in case listener is not in the Core Runtime. This function is only accessible by internal Core Components. To remove the listener just call remove() function from returned object.
  * @param {URL.URL} url      url
  * @param {Listener} listener listener
  * @param {URL.URL} redirectTo   redirectTo
  */
  addListener(url, listener, redirectTo) {
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

  /**
  * To add an interceptor (eg a Policy Enforcer) which "listener" function is called when routing messages published on "interceptedURL" or send to the "interceptedURL". To avoid infinite cycles messages originated with from "interceptorURL" are not intercepted. To remove the interceptor just call remove() function from returned object. This function is only accessible by internal Core Components.
  * @param {URL.URL} interceptedURL interceptedURL
  * @param {Listener} listener       listener
  * @param {URL.URL} interceptorURL interceptorURL
  * @return {Interceptor}                 Interceptor
  */
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

  /**
  * To send messages. This function is accessible outside the Core runtime
  * @param  {Message.Message} msg msg
  */
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
