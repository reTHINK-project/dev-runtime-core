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
import { divideURL } from '../utils/utils';
import Subscription from './Subscription';


/**
 * @author paulo-g-chainho@alticelabs.com
 * Subscription Manager used to manage routing paths at the runtime.
 */

class SubscriptionManager {

  constructor(runtimeURL, bus, storage) {
    if (!runtimeURL) throw new Error('[SubscriptionManager] - needs the runtimeURL parameter');
    if (!bus) throw new Error('[SubscriptionManager] - needs the MessageBus instance');

    let _this = this;

    _this._bus = bus;
    _this._storage = storage;

    //TODO: should we store and resume of subscriptions to support persistence of routes between sessions?

    _this._subscriptions = {};

    //TODO: these should be saved in persistence engine?
    _this.runtimeURL = runtimeURL;
    _this._url = runtimeURL + '/subscriptions';

    //TODO: this should not be hardcoded!
    _this._domain = divideURL(runtimeURL).domain;

    bus.addListener(_this._url, (msg) => {
      console.log('[SubscriptionManager] RCV: ', msg);
      switch (msg.type) {
        case 'subscribe': _this._onSubscribe(msg); break;
        case 'unsubscribe': _this._onUnSubscribe(msg); break;
      }
    });

  }

  get url() { return this._url; }


  //message received to set a routing path
  _onSubscribe(msg) {

    let _this = this;

    let resources = msg.body.resources;

    let subscriber = msg.from;
    let domain = divideURL(resources[0]).domain; //we are assuming resources are all from the same domain

    //FLOW-OUT: subscribe message to the msg-node, registering listeners on the broker
    let nodeSubscribeMsg = {
      type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
      body: { identity: msg.body.identity, resources: resources, source: subscriber }
    };

    //subscribe in msg-node
    _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
      console.log('[SubscriptionManager] node-subscribe-response: ', reply);
      //if (reply.body.code === 200) {//TODO: uncomment when  MN replies with correct response body code

        //TODO: support multiple routes for multiple resources

        let subscription = _this._subscriptions[subscriber];
        console.log('[SubscriptionManager] - ',  _this._subscriptions, resources, _this._subscriptions.hasOwnProperty(subscriber));
        if (!subscription) {
          _this._subscriptions[subscriber] = new Subscription(_this._bus, subscriber, resources[0]);
        }

        //forward to hyperty:
        reply.id = msg.id;
        reply.from = _this._url;
        reply.to = subscriber;
        reply.body = msg.body;
        reply.body.code = 200;

        console.log('[subscribe] - new subscription: ', msg, reply, subscriber);

        this._bus.postMessage(reply);

      /*} else {
        //listener rejected
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: subscriber,
          body: reply.body
        });
      }*/
    });

  }


  // message received to remove routing path
  _onUnSubscribe(msg) {
    let _this = this;

    let unsubscriber = msg.from;
    let resource = msg.body.resource;

    let subscription = _this._subscriptions[unsubscriber];
    if (subscription) {
      let domain = divideURL(resource).domain;

      //FLOW-OUT: message sent to msg-node SubscriptionManager component
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { resource: resource, source: unsubscriber }
      });

      subscription._releaseListeners();
      delete _this._subscriptions[unsubscriber];
    }

    _this._bus.postMessage({
      id: msg.id, type: 'response', from: msg.to, to: msg.from,
      body: { code: 200 }
    });

  }
}

export default SubscriptionManager;
