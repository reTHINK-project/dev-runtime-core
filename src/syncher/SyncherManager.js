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
import ObjectAllocation from './ObjectAllocation';
import ReporterObject from './ReporterObject';
import ObserverObject from './ObserverObject';

import {MessageFactory} from 'service-framework/dist/MessageFactory';

/**
 * @author micaelpedrosa@gmail.com
 * Core Syncronization system.
 */
class SyncherManager {
  /* private
  _url: URL
  _bus: MiniBus
  _registry: Registry
  _allocator: ObjectAllocation

  _reporters: { ObjectURL: ReporterObject }
  _observers: { ObjectURL: ObserverObject }
  */

  constructor(runtimeURL, bus, registry, catalog, allocator) {
    let _this = this;

    _this._bus = bus;
    _this._registry = registry;
    _this._catalog = catalog;

    //TODO: these should be saved in persistence engine?
    _this._url = runtimeURL + '/sm';
    _this._objectURL = runtimeURL + '/object-allocation';

    _this._reporters = {};
    _this._observers = {};

    //TODO: this should not be hardcoded!
    _this._domain = divideURL(runtimeURL).domain;

    _this._mf = new MessageFactory(false, {});

    if (allocator) {
      _this._allocator = allocator;
    } else {
      _this._allocator = new ObjectAllocation(_this._objectURL, bus);
    }

    bus.addListener(_this._url, (msg) => {
      console.log('SyncherManager-RCV: ', msg);
      switch (msg.type) {
        case 'create': _this._onCreate(msg); break;
        case 'delete': _this._onDelete(msg); break;
        case 'subscribe': _this._onLocalSubscribe(msg); break;
        case 'unsubscribe': _this._onLocalUnSubscribe(msg); break;
      }
    });
  }

  get url() { return this._url; }

  //FLOW-IN: message received from Syncher -> create
  _onCreate(msg) {

    let _this = this;
    let owner = msg.from;
    let domain = divideURL(msg.from).domain;

    if (msg.body.resource) {
      _this._authorise(msg, msg.body.resource);
      return;
    }

    //get schema from catalogue and parse -> (scheme, children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {

      let properties = descriptor.sourcePackage.sourceCode.properties;
      let scheme = properties.scheme ? properties.scheme.constant : 'resource';
      let childrens = properties.children ? properties.children.constant : [];

      console.log('Scheme: ', scheme);

      //request address allocation of a new object from the msg-node
      _this._allocator.create(domain, scheme, 1).then((allocated) => {
        let objURL = allocated[0];

        console.log('ALLOCATOR CREATE:', allocated);

        //To register the dataObject in the runtimeRegistry
        _this._registry.registerDataObject(msg.body.value.name, 'scheme', objURL, 'dataObjectReporter').then(function(resolve) {
          console.log('DataObject successfully registered', resolve);

          //all OK -> create reporter and register listeners
          let reporter = new ReporterObject(_this, owner, objURL);
          reporter.forwardSubscribe(objURL).then(() => {
            reporter.addChildrens(childrens).then(() => {
              _this._reporters[objURL] = reporter;

              //FLOW-OUT: message response to Syncher -> create
              _this._bus.postMessage({
                id: msg.id, type: 'response', from: msg.to, to: owner,
                body: { code: 200, resource: objURL, childrenResources: childrens }
              });

              //send create to all observers, responses will be deliver to the Hyperty owner?
              //schedule for next cycle needed, because the Reporter should be available.
              setTimeout(() => {
                //will invite other hyperties
                _this._authorise(msg, objURL);
              });
            });
          });
        }, function(error) {
          console.error(error);
        });

      });
    }).catch((reason) => {
      //FLOW-OUT: error message response to Syncher -> create
      let responseMsg = {
        id: msg.id, type: 'response', from: msg.to, to: owner,
        body: { code: 500, desc: reason }
      };

      _this._bus.postMessage(responseMsg);
    });
  }

  _authorise(msg, objURL) {
    let _this = this;
    let objSubscriptorURL = objURL + '/subscription';

    msg.body.authorise.forEach((hypertyURL) => {
      //FLOW-OUT: send invites to list of remote Syncher -> _onRemoteCreate -> onNotification
      _this._bus.postMessage({
        type: 'create', from: objSubscriptorURL, to: hypertyURL,
        body: { source: msg.from, value: msg.body.value, schema: msg.body.schema }
      });
    });
  }

  //FLOW-IN: message received from DataObjectReporter -> delete
  _onDelete(msg) {
    let _this = this;

    let objURL = msg.body.resource;

    let object = _this._reporters[objURL];
    if (object) {
      //TODO: is there any policy verification before delete?
      object.delete();

      //TODO: unregister object?
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 200 }
      });
    }
  }

  //FLOW-IN: message received from local Syncher -> subscribe
  _onLocalSubscribe(msg) {
    let _this = this;

    let hypertyURL = msg.from;
    let objURL = msg.body.resource;
    let objURLSubscription = objURL + '/subscription';
    let childBaseURL = objURL + '/children/';

    let domain = divideURL(objURL).domain;

    //get schema from catalogue and parse -> (children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {
      let properties = descriptor.sourcePackage.sourceCode.properties;
      let childrens = properties.children ? properties.children.constant : [];

      //children addresses
      let subscriptions = [];
      subscriptions.push(objURL + '/changes');
      childrens.forEach((child) => subscriptions.push(childBaseURL + child));

      //FLOW-OUT: subscribe message to the msg-node, registering listeners on the broker
      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { subscribe: subscriptions, source: hypertyURL }
      };

      //subscribe in msg-node
      _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
        console.log('node-subscribe-response(observer): ', reply);
        if (reply.body.code === 200) {

          //FLOW-OUT: reply with provisional response
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
            body: { code: 100, childrenResources: childrens }
          });

          //FLOW-OUT: subscribe message to remote ReporterObject -> _onRemoteSubscribe
          let objSubscribeMsg = {
            type: 'subscribe', from: _this._url, to: objURLSubscription,
            body: { subscriber: hypertyURL }
          };

          //subscribe to reporter SM
          _this._bus.postMessage(objSubscribeMsg, (reply) => {
            console.log('reporter-subscribe-response: ', reply);
            if (reply.body.code === 200) {

              let observer = _this._observers[objURL];
              if (!observer) {
                observer = new ObserverObject(_this, objURL, childrens);
                _this._observers[objURL] = observer;
              }

              //register hyperty subscription
              observer.addSubscription(hypertyURL);

              //forward to hyperty:
              reply.id = msg.id;
              reply.from = _this._url;
              reply.to = hypertyURL;
              this._bus.postMessage(reply);
            }
          });

        } else {
          //listener rejected
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
            body: reply.body
          });
        }
      });
    });
  }

  //FLOW-IN: message received from local DataObjectObserver -> unsubscribe
  _onLocalUnSubscribe(msg) {
    let _this = this;

    let hypertyURL = msg.from;
    let objURL = msg.body.resource;

    let observer = _this._observers[objURL];
    if (observer) {
      //TODO: is there any policy verification before delete?
      observer.removeSubscription(hypertyURL);

      //TODO: destroy object in the registry?
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 200 }
      });

      //TODO: remove Object if no more subscription?
      //delete _this._observers[objURL];
    }
  }

}

export default SyncherManager;
