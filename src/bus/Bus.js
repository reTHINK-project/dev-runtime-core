/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/

/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/
class Bus {
  /* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>

  _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>

  */

  constructor() {
    let _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._responseTimeOut = 5000; //default to 3s
    _this._responseCallbacks = {};

    _this._registerExternalListener();
  }

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

  //publish on default listeners
  _publishOnDefault(msg) {
    //is there any "*" (default) listeners?
    let itemList = this._subscriptions['*'];
    if (itemList) {
      this._publishOn(itemList, msg);
    }
  }

  //publish on a subscription list.
  _publishOn(itemList, msg) {
    itemList.forEach((sub) => {
      sub._callback(msg);
    });
  }

  _responseCallback(inMsg, responseCallback) {
    let _this = this;

    //automatic management of response handlers
    if (responseCallback) {
      let responseId = inMsg.from + inMsg.id;
      _this._responseCallbacks[responseId] = responseCallback;

      setTimeout(() => {
        let responseFun = _this._responseCallbacks[responseId];
        delete _this._responseCallbacks[responseId];

        if (responseFun) {
          let errorMsg = {
            id: inMsg.id, type: 'response',
            body: { code: 408, desc: 'Response timeout!', value: inMsg }
          };

          responseFun(errorMsg);
        }
      }, _this._responseTimeOut);
    }
  }

  _onResponse(msg) {
    let _this = this;

    if (msg.type === 'response') {
      let responseId = msg.to + msg.id;
      let responseFun = _this._responseCallbacks[responseId];

      //if it's a provisional response, don't delete response listener
      if (msg.body.code >= 200) {
        delete _this._responseCallbacks[responseId];
      }

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
        _this._publishOnDefault(msg);
      }
    }
  }

  _genId(inMsg) {
    //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
    //Global counter will not work, because there will be multiple MiniBus instances!
    //Per URL, can be a lot of data to maintain!
    //Maybe a counter per MiniBus instance. This is the assumed solution for now.
    if (!inMsg.id || inMsg.id === 0) {
      this._msgId++;
      inMsg.id = this._msgId;
    }
  }

  /**
  * Send messages to local listeners, or if not exists to external listeners.
  * It's has an optional mechanism for automatic management of response handlers.
  * The response handler will be unregistered after receiving the response, or after response timeout (default to 3s).
  * @param  {Message} msg Message to send. Message ID is automatically added to the message.
  * @param  {Function} responseCallback Optional parameter, if the developer what's automatic response management.
  * @return {number} Returns the message ID, in case it should be needed for manual management of the response handler.
  */
  postMessage(inMsg, responseCallback) { }

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

  /**
   * Remove this listener from the Bus
   */
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

export default Bus;
