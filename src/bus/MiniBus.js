/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/
class MiniBus {
  /* private
  _subscriptions: <url: MsgListener[]>
  */

  constructor() {
    let _this = this;
    _this._subscriptions = {};
    _this._registerExternalListener();
  }

  /**
  * Register listener to receive message when "msg.header.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "header.to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
  addListener(url, listener) {
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
  * Send messages to local listeners or if not exists, to external listeners.
  * @param  {Message} msg msg
  */
  postMessage(msg) {
    let _this = this;

    let itemList = _this._subscriptions[msg.header.to];
    if (itemList) {
      _this._publishOn(itemList, msg);
    } else {
      _this._onPostMessage(msg);
    }
  }

  /**
   * Helper method to bind listeners (in both directions) into other MiniBus target.
   * @param  {URL} outUrl Outbound URL, register listener for url in direction "this -> target"
   * @param  {URL} inUrl Inbound URL, register listener for url in direction "target -> this"
   * @param  {MiniBus} target The other target MiniBus
   * @return {Bound} an object that contains the properties [thisListener, targetListener] and the unbind method.
   */
  bind(outUrl, inUrl, target) {
    let _this = this;

    let thisListn = _this.addListener(outUrl, (msg) => {
      target.postMessage(msg);
    });

    let targetListn = target.addListener(inUrl, (msg) => {
      _this.postMessage(msg);
    });

    return {
      thisListener: thisListn,
      targetListener: targetListn,
      unbind: () => {
        this.thisListener.remove();
        this.targetListener.remove();
      }
    };
  }

  //publish on a subscription list.
  _publishOn(itemList, msg) {
    itemList.forEach((sub) => {
      sub._callback(msg);
    });
  }

  //publish in the "msg.header.to" subscription list or (if not exists) in the default "*" list.
  _localPublish(msg) {
    let _this = this;

    let itemList = _this._subscriptions[msg.header.to];
    if (itemList) {
      _this._publishOn(itemList, msg);
    } else {
      //is there any "*" (default) listeners?
      itemList = _this._subscriptions['*'];
      if (itemList) {
        _this._publishOn(itemList, msg);
      }
    }
  }

  /**
   * Not public available, used by the class extension implementation, to process messages from the public "postMessage" without a registered listener.
   * Used to send the message to an external interface, like a WebWorker, IFrame, etc.
   * @param  {Message.Message} msg Message
   */
  _onPostMessage(msg) { /*implementation will send message to external system*/ }

  /**
   * Not public available, used by the class extension implementation, to process all messages that enter the MiniBus from an external interface, like a WebWorker, IFrame, etc.
   * This method is called one time in the constructor to register external listeners.
   * The implementation will probably call the "_localPublish" method to publish in the local listeners.
   * DO NOT call "postMessage", there is a danger that the message enters in a cycle!
   */
  _registerExternalListener() { /*implementation will register external listener and call "this._localPublish(msg)" */ }

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

      //if there are no listeners, remove the subscription entirely.
      if (subs.length === 0) {
        delete _this._subscriptions[_this._url];
      }
    }
  }
}

export default MiniBus;
