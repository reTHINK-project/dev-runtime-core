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
        case 'read': _this._onRead(msg); break;
      }
    });

  }

  init() {
    let _this = this;

    return new Promise((resolve, reject) => {

      _this._storage.get('subscriptions').then((subscriptions) => {
        console.log('[SubscriptionManager.init] resume subscriptions: ', subscriptions);
        if (subscriptions) {
          Object.values(subscriptions).forEach((subscription)=>{
            _this._createSubscription(subscription.domain, subscription.resources, subscription.subscriber, subscription.identity);

          });

        }
        resolve();
      });

    });


  }

  get url() { return this._url; }


  //message received to set a routing path
  _onSubscribe(msg) {

    let _this = this;

    let resources = msg.body.resources;

    let subscriber = msg.from;
    let domain = divideURL(resources[0]).domain; //we are assuming resources are all from the same domain

    let identity = msg.body.identity;

    _this._createSubscription(domain, resources, subscriber, identity).then((reply)=>{
      //forward to hyperty:
      reply.id = msg.id;
      reply.from = _this._url;
      reply.to = subscriber;
      reply.body = msg.body;
      reply.body.code = 200;

      console.log('[SubscriptionManager] - craeteSubscription: ', msg, reply, subscriber);

      _this._bus.postMessage(reply);

      _this._storage.get('subscriptions').then((subscriptions)=>{
        if (!subscriptions) {
          subscriptions = {};
        }

        if (!subscriptions[subscriber]) {


          subscriptions[subscriber] = {
            domain: domain,
            resources: resources,
            subscriber: subscriber,
            identity: identity
          };

        } else {
          subscriptions[subscriber].resources = subscriptions[subscriber].resources.concat(resources);
        }

        _this._storage.set('subscriptions', 1, subscriptions);
      });
    });
  }

  _createSubscription(domain, resources, subscriber, identity) {

    let _this = this;

    return new Promise((resolve, reject) => {
      //FLOW-OUT: subscribe message to the msg-node, registering listeners on the broker

      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { identity: identity, resources: resources, source: subscriber }
      };

      //subscribe in msg-node
      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        console.log('[SubscriptionManager] node-subscribe-response: ', reply);

        //if (reply.body.code === 200) {//TODO: uncomment when  MN replies with correct response body code

        //TODO: support multiple routes for multiple resources

        let subscription = _this._subscriptions[subscriber];
        console.log('[SubscriptionManager] - ',  _this._subscriptions, resources, _this._subscriptions.hasOwnProperty(subscriber));
        if (!subscription) {
          _this._subscriptions[subscriber] = {};
        }

        resources.forEach((resource)=>{
          _this._subscriptions[subscriber][resource] = new Subscription(_this._bus, subscriber, resource);
        });

        resolve(reply);

      });

    });
  }


  // message received to remove routing path
  _onUnSubscribe(msg) {
    let _this = this;

    let unsubscriber = msg.from;
    let resource = msg.body.resource;

    if (_this._subscriptions[unsubscriber] && _this._subscriptions[unsubscriber][resource]) {
      let domain = divideURL(resource).domain;
      let subscription = _this._subscriptions[unsubscriber][resource];

      //FLOW-OUT: message sent to msg-node SubscriptionManager component
      _this._bus.postMessage({
        type: 'unsubscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { resources: [resource], source: unsubscriber }
      });

      subscription._releaseListeners();
      delete _this._subscriptions[unsubscriber][resource];

      _this._storage.get('subscriptions').then((subscriptions)=>{
        if (subscriptions) {
          let i = subscriptions[unsubscriber].resources.indexOf(resource);
          if (i != -1) {
            subscriptions[unsubscriber].resources.splice(i, 1);
          }
          _this._storage.set('subscriptions', 1, subscriptions);
        }
      });
    }

    _this._bus.postMessage({
      id: msg.id, type: 'response', from: msg.to, to: msg.from,
      body: { code: 200 }
    });

  }

  //message received to read existing routing paths. At this point limited to read all existing routing paths set for one listener
  _onRead(msg) {

    let _this = this;

    let listenerAddress = msg.body.resource;
    let reply;

    console.log('[SubscriptionManager] - request to read Subscriptions: ', msg );

    _this._storage.get('subscriptions').then((subscriptions)=>{
      if (subscriptions && subscriptions[listenerAddress]) {
        let resources = subscriptions[listenerAddress].resources;

        reply = {
          type: 'response', from: msg.to, to: msg.from,
          body: { code: 200, value: resources }
        };

      } else {
        reply = {
          type: 'response', from: msg.to, to: msg.from, id: msg.id,
          body: { code: 404, description: 'Not Found' }
        };
      }
      _this._bus.postMessage(reply);
    });
  }
}

export default SubscriptionManager;
