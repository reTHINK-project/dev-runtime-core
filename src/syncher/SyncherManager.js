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
import { divideURL, deepClone } from '../utils/utils';
import { schemaValidation } from '../utils/schemaValidation';

import AddressAllocation from '../allocation/AddressAllocation';
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
  _allocator: AddressAllocation

  _reporters: { ObjectURL: ReporterObject }
  _observers: { ObjectURL: ObserverObject }
  */

  constructor(runtimeURL, bus, registry, catalog, storageManager, allocator, storeDataObjects, identityModule) {
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
    _this._identityModule = identityModule;

    //TODO: these should be saved in persistence engine?
    _this.runtimeURL = runtimeURL;
    _this._url = runtimeURL + '/sm';
    _this._objectURL = runtimeURL + '/object-allocation';

    _this._reporters = {};
    _this._observers = {};

    _this._dataObjectsStorage = storeDataObjects;

    //TODO: this should not be hardcoded!
    _this._domain = divideURL(runtimeURL).domain;

    _this._mf = new MessageFactory(false, {});

    if (allocator) {
      _this._allocator = allocator;
    } else {
      _this._allocator = AddressAllocation.instance;
    }

    console.log('[SyncherManager - AddressAllocation] - ', _this._allocator);

    bus.addListener(_this._url, (msg) => {
      console.log('[SyncherManager] RCV: ', msg);
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

    let from = msg.from;
    let to = msg.to;

    if (!msg.body.hasOwnProperty('resume') || (msg.body.hasOwnProperty('resume') && !msg.body.resume)) {

      // If from the hyperty side, don't call the resumeReporter we will have resume = false'
      // so we will create a not resumed object and always create a new object;
      console.info('[SyncherManager - Create New Object]', msg);
      this._newCreate(msg);
    } else {

      // If from the hyperty side, call the resumeReporter we will have resume = true'
      // so we will create an resumed object and will try to resume the object previously saved;
      this._dataObjectsStorage.getResourcesByCriteria(msg, true).then((result) => {

        console.info('[SyncherManager - Create Resumed] - ResourcesByCriteria | Message: ', msg, ' result: ', result);

        if (result && Object.keys(result).length > 0) {

          let listOfReporters = [];

          Object.keys(result).forEach((objURL) => {
            listOfReporters.push(this._resumeCreate(msg, result[objURL]));
          });

          Promise.all(listOfReporters).then((resumedReporters) => {
            console.log('[SyncherManager - Create Resumed]', resumedReporters);

            // TODO: shoud send the information if some object was fail;
            let successfullyResumed = Object.values(resumedReporters).filter((reporter) => {
              return reporter !== false;
            });

            console.info('[SyncherManager.onCreate] returning resumed objects : ', successfullyResumed);

            //FLOW-OUT: message response to Syncher -> create resume
            this._bus.postMessage({
              id: msg.id, type: 'response', from: to, to: from,
              body: { code: 200, value: successfullyResumed }
            });

          });

        } else {
          //forward to hyperty:
          let reply = {};
          reply.id = msg.id;
          reply.from = msg.to;
          reply.to = msg.from;
          reply.type = 'response';
          reply.body = {
            code: 404,
            desc: 'No data objects reporters to be resumed'
          };
          this._bus.postMessage(reply);
        }

      });
    }

  }

  _newCreate(msg) {
    let _this = this;

    let owner = msg.from;
    let domain = divideURL(msg.from).domain;

    // if reporter is in a Interworking Protostub the runtime domain backend services will be used
    if (_this._registry.isInterworkingProtoStub(msg.from)) {
      domain = divideURL(_this.runtimeURL).domain;
    }

    if (msg.body.resource) {
      _this._authorise(msg, msg.body.resource);
      return;
    }

    //get schema from catalogue and parse -> (scheme, children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {

      let properties = descriptor.sourcePackage.sourceCode.properties;
      let scheme = properties.scheme ? properties.scheme.constant : 'resource';
      let childrens = properties.children ? properties.children.constant : [];

      // Do schema validation
      // TODO: check if is need to handle with the result of validation
      schemaValidation(scheme, descriptor, msg.body.value);

      let objectInfo = {
        name: msg.body.value.name,
        schema: msg.body.value.schema,
        reporter: msg.body.value.reporter,
        resources: msg.body.value.resources
      };

      // should resuse data object url if it passed
      let reuseDataObject = msg.body.value.resource;
      let numOfAddress = 1;

      //request address allocation of a new object from the msg-node
      _this._allocator.create(domain, numOfAddress, objectInfo, scheme, reuseDataObject).then((allocated) => {
        let objectRegistration = deepClone(msg.body.value);
        objectRegistration.url = allocated.address[0];
        objectRegistration.authorise = msg.body.authorise;
        objectRegistration.childrens = childrens;
        delete objectRegistration.data;

        console.log('[SyncherManager._newCreate] ALLOCATOR CREATE:', allocated);

        let subscriptionURL = objectRegistration.url + '/subscription';

        console.log('[SyncherManager._newCreate] Subscription URL', subscriptionURL);

        //To register the dataObject in the runtimeRegistry
        console.info('[SyncherManager._newCreate] Register Object: ', objectRegistration);
        //_this._registry.registerDataObject(msg.body.value.name, msg.body.value.schema, objURL, msg.body.value.reporter, msg.body.value.resources, allocated, msg.body.authorise).then((resolve) => {
        _this._registry.registerDataObject(objectRegistration).then((resolve) => {
          console.log('[SyncherManager._newCreate] DataObject successfully registered', resolve);

          //all OK -> create reporter and register listeners
          let reporter;

          if (!this._reporters[objectRegistration.url]) {
            reporter = new ReporterObject(_this, owner, objectRegistration.url);
          } else {
            reporter = this._reporters[objectRegistration.url];
          }

          console.log('[SyncherManager - new Create] - ', msg);

          // Store for each reporter hyperty the dataObject
          let userURL;
          let interworking = false;

          if (msg.body.hasOwnProperty('identity') && msg.body.identity.userProfile.userURL) {
            userURL = msg.body.identity.userProfile.userURL;
            if (!userURL.includes('user://')) {
              interworking = true;
            }
          } else {
            interworking = true;
          }

          // should we use the msg.body.value instead?

          let metadata = deepClone(objectRegistration);
          metadata.subscriberUser = userURL;
          metadata.isReporter = true;
          delete metadata.expires;

          // Store the dataObject information

          if (!interworking) {
            _this._dataObjectsStorage.set(metadata);

            if (msg.body.hasOwnProperty('store') && msg.body.store) {
              reporter.isToSaveData = true;
              _this._dataObjectsStorage.update(true, objectRegistration.url, 'isToSaveData', true);

              if (msg.body.value.data) { _this._dataObjectsStorage.saveData(true, objectRegistration.url, null, msg.body.value.data); }
            }
          }

          // adding listeners to forward to reporter

          reporter.forwardSubscribe([objectRegistration.url, subscriptionURL]).then(() => {
            reporter.addChildrens(childrens).then(() => {
              _this._reporters[objectRegistration.url] = reporter;

              //FLOW-OUT: message response to Syncher -> create
              _this._bus.postMessage({
                id: msg.id, type: 'response', from: msg.to, to: owner,
                body: { code: 200, resource: objectRegistration.url, childrenResources: childrens }
              });

              //send create to all observers, responses will be deliver to the Hyperty owner?
              //schedule for next cycle needed, because the Reporter should be available.
              setTimeout(() => {
                //will invite other hyperties
                _this._authorise(msg, objectRegistration.url);
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

  _resumeCreate(msg, storedObject) {

    let _this = this;

    return new Promise((resolve) => {

      let owner = msg.from;
      let schema = storedObject.schema;
      let resource = storedObject.url;
      let initialData = storedObject.data;

      console.log('[SyncherManager] - resume create', msg, storedObject);

      //get schema from catalogue and parse -> (scheme, children)
      _this._catalog.getDataSchemaDescriptor(schema).then((descriptor) => {

        let properties = descriptor.sourcePackage.sourceCode.properties;
        let scheme = properties.scheme ? properties.scheme.constant : 'resource';
        let childrens = properties.children ? properties.children.constant : [];

        console.log('[SyncherManager] - getDataSchemaDescriptor: ', descriptor, childrens);

        // Do schema validation
        // TODO: check if is need to handle with the result of validation
        schemaValidation(scheme, descriptor, initialData);

        //all OK -> create reporter and register listeners
        let reporter;

        if (!this._reporters[resource]) {
          reporter = new ReporterObject(_this, owner, resource);
        } else {
          reporter = this._reporters[resource];
        }

        reporter.isToSaveData = storedObject.isToSaveData;

        reporter.forwardSubscribe([storedObject.url]).then(() => {
          reporter.addChildrens(childrens).then(() => {

            reporter.resumeSubscriptions(storedObject.subscriptions);

            _this._reporters[resource] = reporter;

            console.info('[SyncherManager - resume create] - resolved resumed: ', storedObject);

            return _this._decryptChildrens(storedObject, childrens);
          }).then((decryptedObject) => {
              // console.log('result of previous promise');
            resolve(decryptedObject);
          }).catch((reason) => {
            console.error('[SyncherManager - resume create] - fail on addChildrens: ', reason);
            resolve(false);
          });
        });
      //  resolve();
      }).catch((reason) => {
        console.error('[SyncherManager - resume create] - fail on getDataSchemaDescriptor: ', reason);
        resolve(false);
      });
    });
  }

  // to decrypt DataChildObjects if they are encrypted

  _decryptChildrens(storedObject, childrens) {
    let _this = this;
    return new Promise((resolve, reject) => {

      if (!childrens) resolve(storedObject);
      else {

        let childrensObj = Object.keys(storedObject['childrenObjects']);

        if (childrensObj.length === 0) {
          resolve(storedObject);
        }

        childrens.forEach((children)=>{

          let childObjects = storedObject['childrenObjects'][children];

          console.log('[SyncherManager._decryptChildrens] dataObjectChilds to decrypt ',  childObjects);

          let listOfDecryptedObjects = [];

          Object.keys(childObjects).forEach((childId)=>{
            let child = childObjects[childId];
            let owner = childId.split('#')[0];

            if ( typeof child.value === 'string'){

              console.log('[SyncherManager._decryptChildrens] createdBy ',  owner, ' object: ', child.value);

              let decrypted = _this._identityModule.decryptDataObject(JSON.parse(child.value), storedObject.data.url).then((decryptedObject) => {
                storedObject['childrenObjects'][children][childId].value = decryptedObject.value;
              });

              listOfDecryptedObjects.push(decrypted);
            }
          });


          Promise.all(listOfDecryptedObjects).then((decryptedObjects) => {

            console.log('[SyncherManager._decryptChildrens] returning decrypted ', decryptedObjects);

              /*Object.keys(childObjects).forEach((childId)=>{
                storedObject['childrens'][children][childId].value = decryptedObjects[childId].value;
                console.log('[SyncherManager._decryptChildrens] adding ', decryptedObjects[childId].value);

              });

              console.info('[SyncherManager._decryptChildrens] returning decrypted objects : ', storedObject);*/

            resolve(storedObject);

          }).catch((reason) => {
            console.warn('[SyncherManager._decryptChildrens] failed : ', reason);
          });
        });
      }
    });
  }

  _authorise(msg, objURL) {
    let _this = this;
    let objSubscriptorURL = objURL + '/subscription';

    console.log('[SyncherManager -  authorise] - ', msg, objURL);

    if (msg.body.authorise) {
      msg.body.authorise.forEach((hypertyURL) => {
        //FLOW-OUT: send invites to list of remote Syncher -> _onRemoteCreate -> onNotification
        _this._bus.postMessage({
          type: 'create', from: objSubscriptorURL, to: hypertyURL,
          body: { identity: msg.body.identity, source: msg.from, value: msg.body.value, schema: msg.body.schema }
        });
      });
    }
  }

  //FLOW-IN: message received from DataObjectReporter -> delete
  _onDelete(msg) {
    let _this = this;

    let objURL = msg.body.resource;

    let object = _this._reporters[objURL];
    if (object) {
      //TODO: is there any policy verification before delete?
      object.delete();

      this._dataObjectsStorage.deleteResource(objURL);

      _this._registry.unregisterDataObject(objURL);

      //TODO: unregister object?
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 200 }
      });
    }
  }

  //FLOW-IN: message received from local Syncher -> subscribe
  _onLocalSubscribe(msg) {

    this._dataObjectsStorage.getResourcesByCriteria(msg, false).then((result) => {

      console.info('[SyncherManager - Subscribe] - ResourcesByCriteria | Message: ', msg, ' result: ', result);

      if (result && Object.keys(result).length > 0) {

        let listOfObservers = [];

        // TODO: should reuse the storaged information
        Object.keys(result).forEach((objURL) => {
          console.log('[SyncherManager - resume Subscribe] - reuse current object url: ', result[objURL]);
          listOfObservers.push(this._resumeSubscription(msg, result[objURL]));
        });

        Promise.all(listOfObservers).then((resumedObservers) => {
          console.log('[SyncherManager - Observers Resumed]', resumedObservers);

          // TODO: shoud send the information if some object was fail;
          let successfullyResumed = Object.values(resumedObservers).filter((observer) => {
            return observer !== false;
          });

          //FLOW-OUT: message response to Syncher -> create
          this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: 200, value: successfullyResumed }
          });

        });

      } else if (msg.body.schema && msg.body.resource) {
        console.log('[SyncherManager.onLocalSubscribe - new Subscribe] - ', msg.body.schema, msg.body.resource);
        this._newSubscription(msg);
      } else {
        //forward to hyperty:
        let reply = {};
        reply.id = msg.id;
        reply.from = msg.to;
        reply.to = msg.from;
        reply.type = 'response';
        reply.body = {
          code: 404,
          desc: 'No data objects observers to be resumed'
        };
        this._bus.postMessage(reply);
      }

    });

  }

  _newSubscription(msg) {
    let _this = this;

    let objURL = msg.body.resource;

    let hypertyURL = msg.from;
    let domain = divideURL(objURL).domain;
    let objURLSubscription = objURL + '/subscription';

    let childBaseURL = objURL + '/children/';

    //get schema from catalogue and parse -> (children)
    _this._catalog.getDataSchemaDescriptor(msg.body.schema).then((descriptor) => {
      let properties = descriptor.sourcePackage.sourceCode.properties;
      let childrens = properties.children ? properties.children.constant : [];

      let subscriptions = [];
      subscriptions.push(objURL + '/changes');

      childrens.forEach((child) => subscriptions.push(childBaseURL + child));

      //children addresses

      //FLOW-OUT: subscribe message to the msg-node, registering listeners on the broker
      let nodeSubscribeMsg = {
        type: 'subscribe', from: _this._url, to: 'domain://msg-node.' + domain + '/sm',
        body: { identity: msg.body.identity, resources: subscriptions, source: hypertyURL }
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

          //TODO: For Further Study
          if (msg.body.hasOwnProperty('mutualAuthentication')) objSubscribeMsg.body.mutualAuthentication = msg.body.mutualAuthentication;
          console.log('[SyncherManager._newSubscription]', objSubscribeMsg, msg);

          //subscribe to reporter SM
          _this._bus.postMessage(objSubscribeMsg, (reply) => {
            console.log('reporter-subscribe-response-new: ', reply);
            if (reply.body.code === 200) {

              let observer = _this._observers[objURL];
              if (!observer) {
                observer = new ObserverObject(_this, objURL, childrens);
                _this._observers[objURL] = observer;
              }

              let interworking = false;

              // Store for each reporter hyperty the dataObject
              let userURL;
              if (msg.body.hasOwnProperty('identity') && msg.body.identity.userProfile.userURL) {
                userURL = msg.body.identity.userProfile.userURL;
                if (!userURL.includes('user://')) {
                  interworking = true;
                }
              } else {
                interworking = true;
              }

              let metadata = deepClone(reply.body.value);
              delete metadata.data;
              metadata.childrens = childrens;
              metadata.subscriberUser = userURL;
              metadata.isReporter = false;
              metadata.subscriberHyperty = hypertyURL;

              if (!interworking) {
                //_this._dataObjectsStorage.set(objURL, false, msg.body.schema, 'on', reply.body.owner, hypertyURL, childrens, userURL);
                _this._dataObjectsStorage.set(metadata);
                if ((metadata.hasOwnProperty('store') && metadata.store) || (metadata.hasOwnProperty('isToSaveData') && metadata.isToSaveData)) {
                  observer.isToSaveData = true;
                  _this._dataObjectsStorage.update(false, objURL, 'isToSaveData', true);
                  _this._dataObjectsStorage.saveData(false, objURL, null, reply.body.value.data);
                }
              }

              // register new hyperty subscription
              observer.addSubscription(hypertyURL);

              // add childrens and listeners to save data if necessary
              observer.addChildrens(childrens);

              //forward to hyperty:
              reply.id = msg.id;
              reply.from = _this._url;
              reply.to = hypertyURL;
              reply.body.schema = msg.body.schema;
              reply.body.resource = msg.body.resource;

              //TODO: For Further Study
              if (msg.body.hasOwnProperty('mutualAuthentication')) reply.body.mutualAuthentication = msg.body.mutualAuthentication;
              console.log('[subscribe] - new subscription: ', msg, reply, observer);

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

  _resumeSubscription(msg, storedObject) {

    return new Promise((resolve) => {

      let objURL = storedObject.url;
      let schema = storedObject.schema;

      let hypertyURL = msg.from;

      // let objURLSubscription = objURL + '/subscription';

      let childBaseURL = objURL + '/children/';

      console.log('[SyncherManager - ReuseSubscription] - objURL: ', objURL, ' - schema:', schema);

      //get schema from catalogue and parse -> (children)
      // TODO: remove this since children resources should be available in the DataObjectsStorage
      this._catalog.getDataSchemaDescriptor(schema).then((descriptor) => {
        let properties = descriptor.sourcePackage.sourceCode.properties;
        let childrens = properties.children ? properties.children.constant : [];

        //children addresses
        let subscriptions = [];
        subscriptions.push(objURL + '/changes');
        childrens.forEach((child) => subscriptions.push(childBaseURL + child));

        //FLOW-OUT: reply with provisional response
        this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: hypertyURL,
          body: { code: 100, childrenResources: childrens, schema: schema, resource: objURL }
        });

        //FLOW-OUT: subscribe message to remote ReporterObject -> _onRemoteSubscribe
        /*let objSubscribeMsg = {
          type: 'subscribe', from: this._url, to: objURLSubscription,
          body: { subscriber: hypertyURL, identity: msg.body.identity }
        };

        //subscribe to reporter SM
        this._bus.postMessage(objSubscribeMsg, (reply) => {*/

        let observer = this._observers[objURL];
        if (!observer) {
          observer = new ObserverObject(this, objURL, childrens);
          observer.isToSaveData = storedObject.isToSaveData;
          this._observers[objURL] = observer;
        }

        //register new hyperty subscription
        observer.addSubscription(hypertyURL);
        observer.addChildrens(childrens);

        // Object.assign(storedObject.data, reply.body.value.data);
        // Object.assign(storedObject.childrens, reply.body.value.childrens);

        //console.log('[subscribe] - resume subscription: ', msg, reply, storedObject, observer);

        return this._decryptChildrens(storedObject, childrens);
      }).then((decryptedObject) => {
          // console.log('result of previous promise');
        resolve(decryptedObject);
      }).catch((reason) => {
        console.error('[SyncherManager - resume subscription] - fail on getDataSchemaDescriptor: ', reason);
        resolve(false);
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

      this._dataObjectsStorage.deleteResource(objURL);

      //TODO: remove Object if no more subscription?
      //delete _this._observers[objURL];
    }
  }

}

export default SyncherManager;
