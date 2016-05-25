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
import Bus from './Bus';

/**
* @author micaelpedrosa@gmail.com
* Message BUS Interface is an extension of the Bus
* It is used mainly in the internal sandbox routing.
*/
class MiniBus extends Bus {

  constructor() {
    super();
  }

  /**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
  postMessage(inMsg, responseCallback) {
    let _this = this;

    _this._genId(inMsg);
    _this._responseCallback(inMsg, responseCallback);

    //always send to external (to core MessageBus)
    _this._onPostMessage(inMsg);

    return inMsg.id;
  }

  //internal method used when a message is received by an external routing system
  _onMessage(msg) {
    let _this = this;

    if (!_this._onResponse(msg)) {
      let itemList = _this._subscriptions[msg.to];
      if (itemList) {
        _this._publishOn(itemList, msg);
        if (!msg.to.startsWith('hyperty')) {
          _this._publishOnDefault(msg);
        }
      } else {
        _this._publishOnDefault(msg);
      }
    }
  }

}

export default MiniBus;
