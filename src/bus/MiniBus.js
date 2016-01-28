import Pipeline from './Pipeline';

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

  _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>

  _pipeline: Pipeline
  */

  constructor() {
    let _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._responseTimeOut = 3000; //default to 3s
    _this._responseCallbacks = {};

    _this._pipeline = new Pipeline((error) => {
      console.log('PIPELINE-ERROR: ', JSON.stringify(error));
    });

    _this._registerExternalListener();
  }

  get pipeline() { return this._pipeline; }

  /**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
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
   * Manually add a response listener. Only one listener per message ID should exist.
   * ATENTION, there is no timeout for this listener.
   * The listener should be removed with a removeResponseListener, failing to do this will result in a unreleased memory problem.
   * @param {URL} url Origin address of the message sent, "msg.from".
   * @param {number} msgId Message ID that is returned from the postMessage.
   * @param {Function} responseListener Callback function for the response
   */
  addResponseListener(url, msgId, responseListener) {
    this._responseCallbacks[url + msgId] = responseListener;
  }

  /**
   * Remove the response listener.
   * @param {URL} url Origin address of the message sent, "msg.from".
   * @param {number} msgId  Message ID that is returned from the postMessage
   */
  removeResponseListener(url, msgId) {
    delete this._responseCallbacks[url + msgId];
  }

  /**
   * Remove all existent listeners for the URL
   * @param  {URL} url Address registered
   */
  removeAllListenersOf(url) {
    delete this._subscriptions[url];
  }

  /**
  * Send messages to local listeners, or if not exists to external listeners.
  * It's has an optional mechanism for automatic management of response handlers.
  * The response handler will be unregistered after receiving the response, or after response timeout (default to 3s).
  * @param  {Message} msg Message to send. Message ID is automatically added to the message.
  * @param  {Function} responseCallback Optional parameter, if the developer what's automatic response management.
  * @return {number} Returns the message ID, in case it should be needed for manual management of the response handler.
  */
  postMessage(inMsg, responseCallback) {
    let _this = this;

    //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
    //Global counter will not work, because there will be multiple MiniBus instances!
    //Per URL, can be a lot of data to maintain!
    //Maybe a counter per MiniBus instance. This is the assumed solution for now.
    if (!inMsg.id || inMsg.id === 0) {
      _this._msgId++;
      inMsg.id = _this._msgId;
    }

    _this._pipeline.process(inMsg, (msg) => {

      //automatic management of response handlers
      if (responseCallback) {
        let responseId = msg.from + msg.id;
        _this._responseCallbacks[responseId] = responseCallback;

        setTimeout(() => {
          let responseFun = _this._responseCallbacks[responseId];
          delete _this._responseCallbacks[responseId];

          if (responseFun) {
            let errorMsg = {
              id: msg.id, type: 'response',
              body: { code: 408, desc: 'Response timeout!', value: inMsg }
            };

            responseFun(errorMsg);
          }
        }, _this._responseTimeOut);
      }

      if (!_this._onResponse(msg)) {
        let itemList = _this._subscriptions[msg.to];
        if (itemList) {
          //do not publish on default address, because of loopback cycle
          _this._publishOn(itemList, msg);
        } else {
          //if there is no listener, send to external interface
          _this._onPostMessage(msg);
        }
      }
    });

    return inMsg.id;
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

  _onResponse(msg) {
    let _this = this;

    if (msg.type === 'response') {
      let responseId = msg.to + msg.id;
      let responseFun = _this._responseCallbacks[responseId];
      delete _this._responseCallbacks[responseId];

      if (responseFun) {
        responseFun(msg);
        return true;
      }
    }

    return false;
  }

  //receive messages from external interface
  _onMessage(msg) {
    let _this = this;

    if (!_this._onResponse(msg)) {
      let itemList = _this._subscriptions[msg.to];
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
