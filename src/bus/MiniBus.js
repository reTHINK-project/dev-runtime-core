/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/
class MiniBus {
  /* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>

  _replyTimeOut: number
  _replyCallbacks: <url+id: (msg) => void>
  */

  constructor() {
    let _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._replyTimeOut = 3000; //default to 3s
    _this._replyCallbacks = {};

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
   * Manually add a reply listener. Only one listener per message ID should exist.
   * ATENTION, there is no timeout for this listener.
   * The listener should be removed with a removeReplyListener, failing to do this will result in a unreleased memory problem.
   * @param {URL} url Origin address of the message sent, "msg.header.from".
   * @param {number} msgId Message ID that is returned from the postMessage.
   * @param {Function} replyListener Callback function for the reply
   */
  addReplyListener(url, msgId, replyListener) {
    let replyId = url + msgId;
    _this._replyCallbacks[replyId] = replyListener;
  }

  /**
   * Remove the reply listener.
   * @param {URL} url Origin address of the message sent, "msg.header.from".
   * @param {number} msgId  Message ID that is returned from the postMessage
   */
  removeReplyListener(url, msgId) {
    let replyId = url + msgId;
    delete _this._replyCallbacks[replyId];
  }

  /**
  * Send messages to local listeners, or if not exists to external listeners.
  * It's has an optional mechanism for automatic management of reply handlers.
  * The reply handler will be unregistered after receiving the reply, or after reply timeout (default to 3s).
  * @param  {Message} msg Message to send. Message ID is automatically added to the message.
  * @param  {Function} replyCallback Optional parameter, if the developer what's automatic reply management.
  * @return {number} Returns the message ID, in case it should be needed for manual management of the reply handler.
  */
  postMessage(msg, replyCallback) {
    let _this = this;

    //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
    //Global counter will not work, because there will be multiple MiniBus instances!
    //Per URL, can be a lot of data to maintain!
    //Maybe a counter per MiniBus instance. This is the assumed solution for now.
    if (!msg.header.id) {
      _this._msgId++;
      msg.header.id = _this._msgId;
    }

    //automatic management of reply handlers
    if (replyCallback) {
      let replyId = msg.header.from + msg.header.id;
      _this._replyCallbacks[replyId] = replyCallback;

      setTimeout(() => {
        let replyFun = _this._replyCallbacks[replyId];
        delete _this._replyCallbacks[replyId];

        if (replyFun) {
          let errorMsg = {
            header: {id: msg.header.id, type: 'reply'},
            body: {code: 'error', desc: 'Reply timeout!'}
          };

          replyFun(errorMsg);
        }
      }, _this._replyTimeOut);
    }

    if (!_this._onReply(msg)) {
      let itemList = _this._subscriptions[msg.header.to];
      if (itemList) {
        //do not publish on default address, because of loopback cycle
        _this._publishOn(itemList, msg);
      } else {
        //if there is no listener, send to external interface
        _this._onPostMessage(msg);
      }
    }

    return msg.header.id;
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

  _onReply(msg) {
    let _this = this;

    if (msg.header.type === 'reply') {
      let replyId = msg.header.to + msg.header.id;
      let replyFun = _this._replyCallbacks[replyId];
      delete _this._replyCallbacks[replyId];

      if (replyFun) {
        replyFun(msg);
        return true;
      }
    }

    return false;
  }

  //receive messages from external interface
  _onMessage(msg) {
    let _this = this;

    if (!_this._onReply(msg)) {
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
   * The implementation will probably call the "_onMessage" method to publish in the local listeners.
   * DO NOT call "postMessage", there is a danger that the message enters in a cycle!
   */
  _registerExternalListener() { /*implementation will register external listener and call "this._onMessage(msg)" */ }

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
