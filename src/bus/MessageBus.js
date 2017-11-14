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

// Log system
import * as logger from 'loglevel';
let log = logger.getLogger('MessageBus');

import Bus from './Bus';
import Pipeline from './Pipeline';

/**
* @author micaelpedrosa@gmail.com
* Message BUS Interface is an extension of the Bus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/
class MessageBus extends Bus {
  /* private
  _registry: Registry
  _forwards: { <from-url>: { fl: MsgListener, sandboxToUrls: Map(Sandbox, [to-url]), urlToSandbox: { to-url: Sandbox } } }

  _pipeline: Pipeline
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  constructor(registry) {
    super();
    this._registry = registry;
    this._forwards = {};

    this._pipelineIn = new Pipeline((error) => {
      log.error('PIPELINE-ERROR: ', JSON.stringify(error));
    });

    this._pipelineOut = new Pipeline((error) => {
      log.error('PIPELINE-ERROR: ', JSON.stringify(error));
    });
  }

  get pipelineIn() { return this._pipelineIn; }

  get pipelineOut() { return this._pipelineOut; }

  /**
   * Post a message for routing. It will first search for a listener, if there is no one, it sends to a external routing using the _onPostMessage.
   * External routing use the registry.resolve(..) method to decide the destination sandbox.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
  postMessage(inMsg, responseCallback, timeout) {
    log.info('onPOSTMessage: ', inMsg);
    let _this = this;

    let deliver = (msg) => {

          _this._responseCallback(inMsg, responseCallback, timeout);

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
    }

    _this._genId(inMsg);

    if (_this._isToProcess(inMsg)) {
      let isIncoming = _this._isIncomingMessage(inMsg);

      if (isIncoming) _this._pipelineIn.process(inMsg, deliver);
      else _this._pipelineOut.process(inMsg, deliver);
    } else deliver(inMsg);

    return inMsg.id;

  }


  _isToProcess(message) {
    let schemasToIgnore = ['domain', 'domain-idp', 'global', 'hyperty-runtime', 'runtime'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    let splitTo = (message.to).split('://');
    let toSchema =  splitTo[0];
    let from = message.from;
    let to = message.to;

    // Signalling messages between P2P Stubs don't have to be verified. FFS

    if (message.body && message.body.source) {
      from = message.body.source;
    }

    if (message.body && message.body.subscriber) {
      from = message.body.subscriber;
    }

    if (from.indexOf('/p2phandler/') !== -1 || from.indexOf('/p2prequester/') !== -1 || to.indexOf('/p2phandler/') !== -1 || to.indexOf('/p2prequester/') !== -1) {
      return false;
    }

    if (message.from === fromSchema || message.to === toSchema || message.type === 'read' || message.type === 'response' || (message.from.includes('hyperty://') && message.type === 'delete')) {
      return false;
    } else {
      return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
    }
  }

  _isIncomingMessage(message) {
    let from;

    if (message.type === 'forward') {
      log.info('[PEP - isIncomingMessage] - message.type: ', message.type);
      from = message.body.from;
    } else if (message.body.hasOwnProperty('source') && message.body.source) {
      log.info('[PEP - isIncomingMessage] - message.body.source: ', message.body.source);
      from = message.body.source;
    } else if (message.body.hasOwnProperty('subscriber') && message.body.subscriber) {
      //TODO: this subscriber validation should not exist, because is outdated
      //TODO: the syncher and syncher manager not following the correct spec;
      log.info('[PEP - isIncomingMessage] - message.body.subscriber: ', message.body.subscriber);
      from = message.body.subscriber;
    }  else if (message.body.hasOwnProperty('reporter') && message.body.reporter) {
      //TODO: this subscriber validation should not exist, because is outdated
      //TODO: the syncher and syncher manager not following the correct spec;
      log.info('[PEP - isIncomingMessage] - message.body.reporter: ', message.body.reporter);
      from = message.body.reporter;
    } else {
      log.info('[PEP - isIncomingMessage] - message.from ', message.from);
      from = message.from;
    }

    log.info('[PEP - isIncomingMessage] - check if isLocal: ', from);
    return !this._registry.isLocal(from);
  }


  /**
   * Adds an external publish address listener. Every message for the address will be forwarded to the external routing by _onPostMessage.
   * This means, even if there is a listener for the address, it will also send the message to the external routing.
   * @param {URL} from Publish address.
   */
  addPublish(from) {
    let _this = this;

    //verify if forward exist
    let refCount = _this._forwards[from];
    if (!refCount) {
      let forwardListener = _this.addListener(from, (msg) => {
        log.info('MB-PUBLISH: ( ' + from + ' )');
        _this._onPostMessage(msg);
      });

      refCount = {
        counter: 0,
        fl: forwardListener,
        remove: () => {
          this.counter--;
          if (this.counter === 0) {
            this.fl.remove();
            delete _this._forwards[from];
          }
        }
      };

     _this._forwards[from] = refCount;
   }

   refCount.counter++;
   return refCount;
  }

  /**
   * Adds a forward listener for a message destination. Every message reaching an address will be also sent to the forward address.
   * @param {URL} from Message destination, it's actually the field "to" of the message.
   * @param {URL} to   Forward address.
   */
   addForward(from, to) {
     let _this = this;

     return _this.addListener(from, (msg) => {
       log.info('MB-FORWARD: ( ' + from + ' to ' + to + ' )');
       _this.forward(to, msg);
     });
   }

   /**
    * Just forward's a message to the forward address. Listeners should be available for the forward address.
    * @param  {URL} url Forward address.
    * @param  {Message} msg Message to forward
    */
   forward(url, msg) {
     let _this = this;

     let itemList = _this._subscriptions[url];
     if (itemList) {
       _this._publishOn(itemList, msg);
     }
   }

   //default route, if there are no listeners available for a message destination.
   _onPostMessage(msg) {
     let _this = this;

     //resolve external protostub...
     _this._registry.resolve(msg).then((route, msg2route) => {
       if (msg2route) _this.forward(route, msg2route);
       else _this.forward(route, msg);
     }).catch(function(e) {
       log.error('RESOLVE-ERROR: ', e);
     });
   }
}

export default MessageBus;
