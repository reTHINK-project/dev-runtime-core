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
import AddressAllocation from '../allocation/AddressAllocation';
import ReporterObject from './ReporterObject';
import ObserverObject from './ObserverObject';
import tv4 from '../utils/tv4';

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
  _allocator: AddressAllocation

  _reporters: { ObjectURL: ReporterObject }
  _observers: { ObjectURL: ObserverObject }
  */

  constructor(runtimeURL, bus, registry, catalog, storageManager, allocator) {
    if (!runtimeURL) throw new Error('[Syncher Manager] - needs the runtimeURL parameter');
    if (!bus) throw new Error('[Syncher Manager] - needs the MessageBus instance');
    if (!registry) throw new Error('[Syncher Manager] - needs the Registry instance');
    if (!catalog) throw new Error('[Syncher Manager] - needs the RuntimeCatalogue instance');
    if (!storageManager) throw new Error('[Syncher Manager] - need the storageManager instance');

    let _this = this;

    _this._bus = bus;
    _this._registry = registry;
    _this._catalog = catalog;
    _this._storageManager = storageManager;

    //TODO: these should be saved in persistence engine?
    _this._url = runtimeURL + '/sm';
    _this._objectURL = runtimeURL + '/object-allocation';

    _this._reporters = {};
    _this._observers = {};

    _this._storeDataObject = {};
    _this._storeSubscription = {};

    //TODO: this should not be hardcoded!
    _this._domain = divideURL(runtimeURL).domain;

    _this._mf = new MessageFactory(false, {});

    if (allocator) {
      _this._allocator = allocator;
    } else {
      _this._allocator = new AddressAllocation(_this._objectURL, bus, _this._registry);
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

  _storeDataObjects(url, dataObjectURL, isReporter, schema, status, initialData, children, childrenResources, subscriberUser) {

    let saveObject;
    if (!this._storeDataObject.hasOwnProperty(url) && !this._storeDataObject[url]) {
      this._storeDataObject[url] = [];
      saveObject = {
        url: dataObjectURL,
        isReporter: isReporter
      };
    } else {
      saveObject = this._storeDataObject[url];
    }

    if (schema) saveObject.schema = schema;
    if (status) saveObject.status = status;
    if (children) saveObject.children = children;
    if (initialData) saveObject.initialData = initialData;
    if (subscriberUser) saveObject.subscriberUser = subscriberUser;
    if (childrenResources) saveObject.childrenResources = childrenResources;

    this._storeDataObject[url].push(saveObject);

    // this._storageManager.set('syncherManager:Observer', 1, this._storeDataObject);
    this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);
  }

  // _storeSubscriptions(dataObjectURL, hyperty, childrens) {
  //
  //   if (!this._storeSubscription.hasOwnProperty(dataObjectURL) && !this._storeSubscription[dataObjectURL]) {
  //     this._storeSubscription[dataObjectURL] = [];
  //     this._storeSubscription[dataObjectURL] = {childrens: [], subscriptions: []};
  //   }
  //
  //   if (hyperty) this._storeSubscription[dataObjectURL].subscriptions.push(hyperty);
  //   if (childrens) this._storeSubscription[dataObjectURL].childrens.concat(childrens);
  //
  //   this._storageManager.set('syncherManager:Subscriptions', 1, this._storeSubscription);
  // }

  // _resumeSubscription(objectURL) {
  //
  //   this._storageManager.get('syncherManager:Subscriptions').then((objectURLs) => {
  //
  //     console.info('[storage manager] - Resume Subscriptions: ', objectURLs, objectURL);
  //     if (!objectURLs) return;
  //
  //     Object.keys(objectURLs).filter((key) => {
  //       return key === objectURL;
  //     }).forEach((key) => {
  //       let objURL = key;
  //       let subscriptions = objectURLs[key].subscriptions;
  //       let childrens = objectURLs[key].childrens;
  //
  //       let observer = this._observers[objURL];
  //       if (!observer) {
  //         observer = new ObserverObject(this, objURL, childrens);
  //         this._observers[objURL] = observer;
  //       }
  //
  //       subscriptions.forEach((hypertyURL) => {
  //         //register new hyperty subscription
  //         observer.addSubscription(hypertyURL);
  //         console.info('[storage manager] - add the subscription hyperty url: ', hypertyURL);
  //       });
  //     });
  //   });
  // }

  // _onRead(msg) {
  //   let owner = msg.from;
  //
  //   console.log('[syncherManager - onRead] - ', msg);
  //
  //   let sendResponse = (msg) => {
  //
  //     //FLOW-OUT: send a provisional message response from SyncherManager -> Hyperty
  //     this._bus.postMessage(msg, (reply) => {
  //
  //       //forward to hyperty:
  //       reply.id = msg.id;
  //       reply.from = msg.to;
  //       reply.to = msg.from;
  //       this._bus.postMessage(reply);
  //
  //     });
  //   };
  //
  //   let noResults = (msg) => {
  //     msg.body.code = 404;
  //     msg.body.description = 'Not found';
  //     sendResponse(msg);
  //   };
  //
  //   this._storageManager.get('syncherManager:ObjectURLs').then((storedObjects) => {
  //
  //     let responseMsg = {
  //       type: 'response', from: this._url, to: owner,
  //       body: {}
  //     };
  //
  //     if (storedObjects) {
  //       let selectedInfo;
  //       Object.keys(storedObjects).forEach((key) => {
  //         if (key === owner) {
  //           selectedInfo = storedObjects[key];
  //         }
  //       });
  //
  //       if (selectedInfo) {
  //
  //         // for (let i = 0; i < selectedInfo.length; i++) {
  //         //   this._resumeSubscription(selectedInfo[i].url);
  //         // }
  //
  //         responseMsg.body.code = 200;
  //         responseMsg.body.value = selectedInfo;
  //
  //         sendResponse(responseMsg);
  //
  //       } else {
  //         noResults();
  //       }
  //
  //     } else {
  //       noResults();
  //     }
  //   });
  // }

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

      // schema validation
      console.log('Running object validation...');
      try {
        let obj = msg.body.value;
        let schema = descriptor.sourcePackage.sourceCode;

        // add support for schema referencing itself
        tv4.addSchema(schema.id, schema);

        // validate
        let result = tv4.validateMultiple(obj, schema);

        // delete error stacks to improve logging
        result.errors.forEach((error) => {
          delete error.stack;
        });

        // print more details about validation if it fails or schema contains $refs
        if (!result.valid || (result.missing.length > 0)) {
          console.warn('Object validation ' + (result.valid ? 'succeeded, but schema contained references:' : 'failed:'), JSON.stringify(result, null, 2));
          console.debug('Object:', JSON.stringify(obj, null, 2), '\r\nSchema:', JSON.stringify(schema, null, 2));
        } else {
          console.log('Object validation succeeded');
        }
      } catch (e) {
        console.warn('Error during object validation:', e);
      }

      let objectInfo = {
        name: msg.body.value.name,
        schema: msg.body.value.schema,
        reporter: msg.body.value.reporter,
        resources: msg.body.value.resources
      };

      // should resuse data object url if it passed
      let reuseDataObject = msg.body.value.resource;

      //request address allocation of a new object from the msg-node
      _this._allocator.create(domain, 1, objectInfo, scheme, reuseDataObject).then((allocated) => {
        let objURL = allocated.address[0];

        console.log('ALLOCATOR CREATE:', allocated);

        let subscriptionURL = objURL + '/subscription';

        console.log('Subscription URL', subscriptionURL);

        //To register the dataObject in the runtimeRegistry
        console.info('Register Object: ', msg.body.value.name, msg.body.value.schema, objURL, msg.body.value.reporter, msg.body.value.resources);
        _this._registry.registerDataObject(msg.body.value.name, msg.body.value.schema, objURL, msg.body.value.reporter, msg.body.value.resources, allocated, msg.body.authorise).then((resolve) => {
          console.log('DataObject successfully registered', resolve);

          //all OK -> create reporter and register listeners
          let reporter;

          if (!this._reporters[objURL]) {
            reporter = new ReporterObject(_this, owner, objURL);
          } else {
            reporter = this._reporters[objURL];
          }

          // Store for each reporter hyperty the dataObject
          _this._storeDataObjects(owner, objURL, true, msg.body.schema, 'on', msg.body.value, null, childrens, msg.body.identity);

          reporter.forwardSubscribe([objURL, subscriptionURL]).then(() => {
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
        body: { identity: msg.body.identity, source: msg.from, value: msg.body.value, schema: msg.body.schema }
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

    let objURL = msg.body.resource;
    let childBaseURL = objURL + '/children/';

    //get schema from catalogue and parse -> (children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {
      let properties = descriptor.sourcePackage.sourceCode.properties;
      let childrens = properties.children ? properties.children.constant : [];

      //children addresses
      let subscriptions = [];
      subscriptions.push(objURL + '/changes');
      childrens.forEach((child) => subscriptions.push(childBaseURL + child));

      // TODO: filter the msg.body.. criteria to find some stored data

      this._newSubscription(msg, subscriptions, childrens);
    });
  }

  _newSubscription(msg, subscriptions, childrens) {
    let _this = this;

    let objURL = msg.body.resource;

    let hypertyURL = msg.from;
    let domain = divideURL(objURL).domain;
    let objURLSubscription = objURL + '/subscription';

    //FLOW-OUT: subscribe message to the msg-node, registering listeners on the broker
    let nodeSubscribeMsg = {
      type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
      body: { identity: msg.body.identity, subscribe: subscriptions, source: hypertyURL }
    };

    //subscribe in msg-node
    _this._bus.postMessage(nodeSubscribeMsg, (reply) => {
      console.log('node-subscribe-response(observer): ', reply);
      if (reply.body.code === 200) {

        //FLOW-OUT: reply with provisional response
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
          body: { code: 100, childrenResources: childrens, schema: msg.body.schema, resource: msg.body.resource }
        });

        //FLOW-OUT: subscribe message to remote ReporterObject -> _onRemoteSubscribe
        let objSubscribeMsg = {
          type: 'subscribe', from: _this._url, to: objURLSubscription,
          body: { identity: nodeSubscribeMsg.body.identity, subscriber: hypertyURL }
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

            // Store for each reporter hyperty the dataObject
            _this._storeDataObjects(hypertyURL, objURL, false, msg.body.schema, 'on', {}, null, childrens, msg.body.identity);

            // Store the subscription did
            //TODO: check if is really necessary save the subscriptions
            // _this._storeSubscriptions(objURL, hypertyURL, childrens);

            //register new hyperty subscription
            observer.addSubscription(hypertyURL);

            //forward to hyperty:
            reply.id = msg.id;
            reply.from = _this._url;
            reply.to = hypertyURL;
            reply.body.schema = msg.body.schema;
            reply.body.resource = msg.body.resource;
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

  }

  _reuseSubscription() {

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
