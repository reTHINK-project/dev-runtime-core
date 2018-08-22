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

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('Syncher');

import { deepClone, divideURL } from '../utils/utils';

import DataObjectReporter from './DataObjectReporter';
import DataObjectObserver from './DataObjectObserver';
import DataProvisional from './DataProvisional';

/**
* The main class for the syncher package.
* The Syncher is a singleton class per Hyperty/URL and it is the owner of all created Data Sync Objects according to the Reporter - Observer pattern.
* Main functionality is to create reporters and to subscribe to existing ones.
*/
class Syncher {
  /* private
  _owner: URL
  _bus: MiniBus

  _subURL: URL

  _reporters: <url: DataObjectReporter>
  _observers: <url: DataObjectObserver>
  _provisionals: <url: DataProvisional>

  ----event handlers----
  _onNotificationHandler: (event) => void
  _onResume: (event) => void
  */

  /**
  * Constructor that should be used by the Hyperty owner
  * @param {HypertyURL} owner - Hyperty URL owner. An URL allocated by the runtime that uniquely identifies the Hyperty.
  * @param {MiniBus} bus - An instance of the MiniBus provided in the sandbox. When an object (Reporter or Observed) is created, the SyncherManager will add a listener in the MiniBus to receive/send Messages of that object.
  * @param {JSON} config - Configuration data. The only required field for now is the runtimeURL.
  */
  constructor(owner, bus, config) {
    let _this = this;

    _this._owner = owner;
    _this._bus = bus;

    _this._subURL = config.runtimeURL + '/sm';
    _this._runtimeUrl = config.runtimeURL;

    _this._p2pHandler = config.p2pHandler;
    _this._p2pRequester = config.p2pRequester;

    _this._reporters = {};
    _this._observers = {};
    _this._provisionals = {};

    bus.addListener(owner, (msg) => {
      //ignore msg sent by himself
      if (msg.from !== owner) {
        log.info('[Syncher] Syncher-RCV: ', msg, _this);
        switch (msg.type) {
          case 'forward': _this._onForward(msg); break;
          case 'create': _this._onRemoteCreate(msg); break;
          case 'delete': _this._onRemoteDelete(msg); break;
          case 'execute': _this._onExecute(msg); break;
        }
      }
    });
  }

  /**
  * The owner of the Syncher and all created reporters.
  * @type {HypertyURL}
  */
  get owner() { return this._owner; }

  /**
  * All owned reporters, the ones that were created by a create
  * @type {Object<URL, DataObjectReporter>}
  */
  get reporters() { return this._reporters; }

  /**
  * All owned observers, the ones that were created by a local subscription
  * @type {Object<URL, DataObjectObserver>}
  */
  get observers() { return this._observers; }

  /**
  * Request a DataObjectReporter creation. The URL will be be requested by the allocation mechanism.
  * @param  {SchemaURL} schema - Hyperty Catalogue URL address that can be used to retrieve the JSON-Schema describing the Data Object schema
  * @param  {HypertyURL[]} observers - List of hyperties that are pre-authorized for subscription
  * @param  {JSON} initialData - Initial data of the reporter
  * @param  {boolean} store - (Optional) if true, object will be stored by the runtime
  * @param  {boolean} p2p - (Optional) if true, data synchronisation stream will use p2p connection as much as possible
  * @param  {string} name - (Optional) the name of the dataobject
  * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
  * @param  {SyncMetadata} input - (optional) all metadata required to sunc the Data Object.
  * @return {Promise<DataObjectReporter>} Return Promise to a new Reporter. The reporter can be accepted or rejected by the PEP
  */
  create(schema, observers, initialData, store = false, p2p = false, name = 'no name', identity, input) {

    if (!schema) throw Error('[Syncher - Create] - You need specify the data object schema');
    if (!observers) throw Error('[Syncher - Create] -The observers should be defined');

    let _this = this;
    input = input || {};
    let createInput  = Object.assign({}, input);

    createInput.p2p = p2p;
    createInput.store = store;
    createInput.schema = schema;
    createInput.authorise = observers;
    createInput.p2pHandler = _this._p2pHandler;
    createInput.p2pRequester = _this._p2pRequester;
    (initialData) ? createInput.data = deepClone(initialData) : createInput.data = {};
    createInput.name = name.length === 0 ? 'no name' : name;
    createInput.reporter = (input.hasOwnProperty('reporter') && ((typeof input.reporter) !== 'boolean')) ? input.reporter : _this._owner;
    createInput.resume = false;
    if (input) {
      createInput.mutual = input.hasOwnProperty('mutual') ? input.mutual : true;
      createInput.name = input.hasOwnProperty('name') ? input.name : createInput.name;
    } else { createInput.mutual = true; }

    if (input.hasOwnProperty('reuseURL')) {
      createInput.resource = input.reuseURL;
    }

    if (identity)      { createInput.identity = identity; }

    //Object.assign(createInput, {resume: false});
    //debugger;
    log.log('[syncher - create] - create Reporter - createInput: ', createInput);

    return _this._create(createInput);
  }

  /**
  * Request a DataObjectReporter creation. The URL will be be requested by the allocation mechanism.
  * @param  {Object} criteria - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
  * @return {Promise<DataObjectReporter>[]} Return a promise with a list of DataObjectReporter to be resumed;
  */
  resumeReporters(criteria) {
    let _this = this;
    log.log('[syncher - create] - resume Reporter - criteria: ', criteria);

    Object.assign(criteria, {resume: true});

    return _this._resumeCreate(criteria);
  }

  /**
  * Request a subscription to an existent reporter object.
  * @param {SchemaURL} schema - Hyperty Catalogue URL address that can be used to retrieve the JSON-Schema describing the Data Object schema
  * @param {ObjectURL} objURL - Address of the existent reporter object to be observed
  * @param {Boolean} [store=false] - Save the subscription on the Syncher Manager for further resume (Default is false)
  * @param {Boolean} [p2p=false] - Info about if should use p2p connection (Default is false)
  * @param {Boolean} [mutual=true] - Info about if messages of this object should be encrypted (Default is true)
  * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
  * @return {Promise<DataObjectObserver>} Return Promise to a new observer. It's associated with the reporter.
  */

  //TODO: use input JSON param with all optional parameters similar to create
  subscribe(schema, objURL, store = false, p2p = false, mutual = true, domain_subscription = true, identity) {
    let _this = this;
    let criteria = {};

    criteria.p2p = p2p;
    criteria.store = store;
    criteria.schema = schema;
    criteria.domain_subscription = domain_subscription;

    criteria.resource = objURL;
    if (identity)      { criteria.identity = identity; }

    //TODO: For Further Study
    criteria.mutual = mutual;

    log.log('[syncher - subscribe] - subscribe criteria: ', criteria);

    Object.assign(criteria, {resume: false});

    return _this._subscribe(criteria);
  }

  /**
  * Request a subscription to an existent reporter object.
  * @param {criteria} criteria - Information to discovery the observer object
  * @return {Promise<DataObjectObserver>} Return Promise to a new observer. It's associated with the reporter.
  */
  resumeObservers(criteria) {
    let _this = this;
    let _criteria = criteria || {};

    Object.assign(_criteria, {resume: true});

    return _this._resumeSubscribe(_criteria);
  }

  /**
  * Request a read action on the reporter object
  * @param {ObjectURL} objURL - URL of the reporter object to be read
  * @return {Promise<Object>} Return Promise to last available data of the reporter
  */
  read(objURL) {
    let _this = this;

    //FLOW-OUT: this message will be sent directly to reporter object (maybe there is no listener available, so it will be resolved with MessageBus -> resolve)
    //will reach the remote object in DataObjectReporter -> _onRead
    let readMsg = {
      type: 'read', from: _this._owner, to: objURL
    };

    return new Promise((resolve, reject) => {
      let callback = (reply) => {
        log.log('[Syncher.read] reply: ', reply);

        let childrens = {};
        let value = {};
        let n = 0;

        if (reply.body.code < 300) {
          if (!reply.body.value.hasOwnProperty('responses')) {
            _this._bus.removeResponseListener(readMsg.from, reply.id);
            resolve(reply.body.value);
          } else { //data object is sent in separated messages
            if (n === 0) { //initial response without childrens
              value = reply.body.value;
              ++n;
            } else { // received response contains childrens
              delete reply.body.value.responses;
              let children;
              for (children in reply.body.value) {
                if (!childrens.hasOwnProperty(children)) childrens[children] = {};
                Object.assign(childrens[children], reply.body.value[children]);
              }
              ++n;
              if (n === value.responses) {
                value.childrenObjects = childrens;
                delete value.responses;
                _this._bus.removeResponseListener(readMsg.from, reply.id);
                resolve(value);
              }
            }
          }
        } else {
          reject(reply.body.desc);
        }
      };

      let id = _this._bus.postMessage(readMsg, callback, false);


    });
  }

  /**
  * Setup the callback to process create and delete events of remove Reporter objects.
  * This is releated to the messagens sent by create to the observers Hyperty array.
  * @param {function(event: MsgEvent)} callback
  */
  onNotification(callback) {
    this._onNotificationHandler = callback;
  }

  /**
  * Setup the callback to process close events from the runtime.
  * @param {function(event: MsgEvent)} callback
  */
  onClose(callback) {
    this._onClose = callback;
  }

  _create(input) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let reporterInput  = Object.assign({}, input);

      let resume = input.resume;

      reporterInput.created = (new Date).toISOString();
      reporterInput.runtime = _this._runtimeUrl;

      let requestValue = deepClone(reporterInput);

      delete requestValue.p2p;
      delete requestValue.store;
      delete requestValue.observers;
      delete requestValue.identity;

      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onCreate
      //debugger;
      let requestMsg = {
        type: 'create', from: _this._owner, to: _this._subURL,
        body: { resume: resume, value: requestValue  }
      };


      requestMsg.body.schema = reporterInput.schema;

      if (reporterInput.p2p) requestMsg.body.p2p = reporterInput.p2p;
      if (reporterInput.store) requestMsg.body.store = reporterInput.store;
      if (reporterInput.identity) requestMsg.body.identity = reporterInput.identity;

      log.log('[syncher._create]: ', reporterInput, requestMsg);

      //request create to the allocation system. Can be rejected by the PolicyEngine.
      _this._bus.postMessage(requestMsg, (reply) => {
        log.log('[syncher - create] - create-response: ', reply);
        if (reply.body.code === 200) {
          //reporter creation accepted
          reporterInput.url = reply.body.resource;

/*          if (reply.body.p2pHandler) reporterInput.p2pHandler = reply.body.p2pHandler;
          if (reply.body.p2pRequester) reporterInput.p2pRequester = reply.body.p2pRequester;*/

          reporterInput.status = 'live';// pch: do we ned this?
          reporterInput.syncher = _this;
          reporterInput.childrens = reply.body.childrenResources;

          let newObj = _this._reporters[reporterInput.url];

          if (!newObj) {
            newObj = new DataObjectReporter(reporterInput);
            _this._reporters[reporterInput.url] = newObj;
          }

          newObj.inviteObservers(input.authorise, input.p2p);

          resolve(newObj);

        } else {
          //reporter creation rejected
          reject(reply.body.desc);
        }
      });
    });

  }

  _resumeCreate(criteria) {
    let _this = this;

    return new Promise((resolve, reject) => {
      let resume = criteria.resume;

      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onCreate
      let requestMsg = {
        type: 'create', from: _this._owner, to: _this._subURL,
        body: { resume: resume }
      };

      log.log('[syncher - create]: ', criteria, requestMsg);
      if (criteria) {
        requestMsg.body.value = criteria;
        if (criteria.hasOwnProperty('reporter')) {
          requestMsg.body.value.reporter = criteria.reporter;
        } else {
          requestMsg.body.value.reporter = _this._owner;
        }
      }

      if (criteria.p2p) requestMsg.body.p2p = criteria.p2p;
      if (criteria.store) requestMsg.body.store = criteria.store;
      if (criteria.observers) requestMsg.body.authorise = criteria.observers;
      if (criteria.identity) requestMsg.body.identity = criteria.identity;

      log.log('[syncher._resumeCreate] - resume message: ', requestMsg);

      //debugger;

      //request create to the allocation system. Can be rejected by the PolicyEngine.

      _this._bus.postMessage(requestMsg, (reply) => {
        log.log('[syncher._resumeCreate] - create-resumed-response: ', reply);
        if (reply.body.code === 200) {
          //debugger;
          let listOfReporters = reply.body.value;

          for (let index in listOfReporters) {

            let dataObject = listOfReporters[index];

            //reporter creation accepted

            dataObject.data = deepClone(dataObject.data) || {};

            if (dataObject.childrenObjects) { dataObject.childrenObjects = deepClone(dataObject.childrenObjects); }

            dataObject.mutual = false;
            dataObject.resume = true;
            dataObject.status = 'live';// pch: do we ned this?
            dataObject.syncher = _this;

            log.log('[syncher._resumeCreate] - create-resumed-dataObjectReporter', dataObject);

            let newObj = new DataObjectReporter(dataObject);

            if (dataObject.childrenObjects) {
              newObj.resumeChildrens(dataObject.childrenObjects);
            }
            _this._reporters[dataObject.url] = newObj;

          }

          resolve(_this._reporters);
          if (this._onReportersResume) this._onReportersResume(this._reporters);

        } else if (reply.body.code === 404) {
          resolve({});
        } else {
          //reporter creation rejected
          reject(reply.body.desc);
        }
      });
    });
  }

  _subscribe(input) {
    let _this = this;

    return new Promise((resolve, reject) => {

      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onLocalSubscribe
      let subscribeMsg = {
        type: 'subscribe', from: _this._owner, to: _this._subURL,
        body: {}
      };

      // Hyperty request to be an Observer
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#hyperty-request-to-be-an-observer

      // Resume Subscriptions for the same Hyperty URL
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-the-same-hyperty-url

      // Resume Subscriptions for a certain user and data schema independently of the Hyperty URL.
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-a-certain-user-and-data-schema-independently-of-the-hyperty-url
      if (input) {
        if (input.hasOwnProperty('p2p')) subscribeMsg.body.p2p = input.p2p;
        if (input.hasOwnProperty('store')) subscribeMsg.body.store = input.store;
        if (input.hasOwnProperty('schema')) subscribeMsg.body.schema = input.schema;
        if (input.hasOwnProperty('identity')) subscribeMsg.body.identity = input.identity;
        if (input.hasOwnProperty('resource')) subscribeMsg.body.resource = input.resource;
        if (input.hasOwnProperty('domain_subscription')) subscribeMsg.body.domain_subscription = input.domain_subscription;
      }
      

      subscribeMsg.body.resume = input.resume;

      //TODO: For Further Study
      if (input.hasOwnProperty('mutual')) subscribeMsg.body.mutual = input.mutual;

      log.log('[syncher_subscribe] - subscribe message: ', input, subscribeMsg);

      //request subscription
      //Provisional data is applied to the DataObjectObserver after confirmation. Or discarded if there is no confirmation.
      //for more info see the DataProvisional class documentation.
      _this._bus.postMessage(subscribeMsg, (reply) => {
        log.log('[syncher] - subscribe-response: ', reply);

        let objURL = reply.body.resource;

        let newProvisional = _this._provisionals[objURL];
        delete _this._provisionals[objURL];
        if (newProvisional) newProvisional._releaseListeners();

        if (reply.body.code < 200) {
          log.log('[syncher] - new DataProvisional: ', reply.body.childrenResources, objURL);
          newProvisional = new DataProvisional(_this._owner, objURL, _this._bus, reply.body.childrenResources);
          _this._provisionals[objURL] = newProvisional;
        } else if (reply.body.code === 200) {
          log.log('[syncher] - new Data Object Observer: ', reply, _this._provisionals);

          let observerInput = reply.body.value;

          observerInput.syncher = _this;
          observerInput.p2p = input.p2p;
          observerInput.store = input.store;
          observerInput.identity = input.identity;
          observerInput.resume = false;

          // todo: For Further Study
          observerInput.mutual = input.mutual;

          //observerInput.children = newProvisional.children;

          //TODO: mutual For Further Study
          let newObj = _this._observers[objURL];
          if (!newObj) {
            newObj = new DataObjectObserver(observerInput);
            _this._observers[objURL] = newObj;
          } else {
            newObj.sync();
          }

          log.log('[syncher] - new Data Object Observer already exist: ', newObj);

          resolve(newObj);

          if (newProvisional) { newProvisional.apply(newObj); }

        } else {
          reject(reply.body.desc);
        }
      });
    });
  }

  _resumeSubscribe(criteria) {
    let _this = this;

    return new Promise((resolve, reject) => {

      //FLOW-OUT: this message will be sent to the runtime instance of SyncherManager -> _onLocalSubscribe
      let subscribeMsg = {
        type: 'subscribe', from: _this._owner, to: _this._subURL,
        body: {}
      };

      // Hyperty request to be an Observer
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#hyperty-request-to-be-an-observer

      // Resume Subscriptions for the same Hyperty URL
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-the-same-hyperty-url

      // Resume Subscriptions for a certain user and data schema independently of the Hyperty URL.
      // https://github.com/reTHINK-project/specs/blob/master/messages/data-sync-messages.md#resume-subscriptions-for-a-certain-user-and-data-schema-independently-of-the-hyperty-url
      if (criteria) {
        if (criteria.hasOwnProperty('p2p')) subscribeMsg.body.p2p = criteria.p2p;
        if (criteria.hasOwnProperty('store')) subscribeMsg.body.store = criteria.store;
        if (criteria.hasOwnProperty('schema')) subscribeMsg.body.schema = criteria.schema;
        if (criteria.hasOwnProperty('identity')) subscribeMsg.body.identity = criteria.identity;
        if (criteria.hasOwnProperty('resource')) subscribeMsg.body.resource = criteria.url;
      }

      subscribeMsg.body.resume = criteria.resume;

      //TODO: For Further Study
      let mutual = criteria.mutual;
      if (criteria.hasOwnProperty('mutual')) subscribeMsg.body.mutual = mutual;

      log.log('[syncher] - subscribe message: ', criteria, subscribeMsg);

      //request subscription
      //Provisional data is applied to the DataObjectObserver after confirmation. Or discarded if there is no confirmation.
      //for more info see the DataProvisional class documentation.
      _this._bus.postMessage(subscribeMsg, (reply) => {
        log.log('[syncher] - subscribe-resumed-response: ', reply);

        let objURL = reply.body.resource;

        let newProvisional = _this._provisionals[objURL];
        delete _this._provisionals[objURL];
        if (newProvisional) newProvisional._releaseListeners();

        if (reply.body.code < 200) { // todo: check if this is needed for the resume

          log.log('[syncher] - resume new DataProvisional: ', reply, objURL);
          newProvisional = new DataProvisional(_this._owner, objURL, _this._bus, reply.body.childrenResources);
          _this._provisionals[objURL] = newProvisional;

        } else if (reply.body.code === 200) {

          let listOfObservers = reply.body.value;

          for (let index in listOfObservers) {

            let dataObject = listOfObservers[index];
            log.log('[syncher] - Resume Object Observer: ', reply, dataObject, _this._provisionals);

            if (dataObject.childrenObjects) { dataObject.childrenObjects = deepClone(dataObject.childrenObjects); }

            dataObject.data = deepClone(dataObject.data) || {};
            dataObject.resume = true;
            dataObject.syncher = _this;

            //TODO: mutual For Further Study
            log.log('[syncher._resumeSubscribe] - create new dataObject: ', dataObject);
            let newObj = new DataObjectObserver(dataObject);

            if (dataObject.childrenObjects) { newObj.resumeChildrens(dataObject.childrenObjects); }
            log.log('[syncher._resumeSubscribe] - new dataObject', newObj);
            _this._observers[newObj.url] = newObj;

            if (_this._provisionals[newObj.url]) {
              _this._provisionals[newObj.url].apply(newObj);
            }

            //lets sync with Reporter
            // it was commented to let hyperties decide when to sync
            //newObj.sync();
          }

          resolve(_this._observers);

          if (this._onObserversResume) this._onObserversResume(_this._observers);

        } else if (reply.body.code === 404) {
          resolve({});
        } else {
          reject(reply.body.desc);
        }
      });
    });

  }

  //FLOW-IN: message received from a local runtime ReporterObject -> _onRemoteSubscribe
  _onForward(msg) {
    let _this = this;

    let reporter = _this._reporters[msg.body.to];
    reporter._onForward(msg);
  }

  //FLOW-IN: message received from a remote Syncher -> create (this is actually an invitation to subscribe)
  _onRemoteCreate(msg) {
    let _this = this;
    let resource = msg.from.slice(0, -13); //remove "/subscription" from the URL
    let dividedURL = divideURL(resource);
    let domain = dividedURL.domain;

    let event = {
      type: msg.type,
      from: msg.body.source,
      url: resource,
      domain: domain,
      schema: msg.body.schema,
      value: msg.body.value,
      identity: msg.body.identity,

      ack: (type) => {
        let lType = 200;
        if (type) {
          lType = type;
        }

       //send ack response message
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: msg.from,
          body: { code: lType }
        });
      }
    };

    if (_this._onNotificationHandler) {
      log.info('[Syncher] NOTIFICATION-EVENT: ', event);
      _this._onNotificationHandler(event);
    }
  }

  //FLOW-IN: message received from a remote DataObjectReporter -> delete
  _onRemoteDelete(msg) {
    let _this = this;

   //remove "/subscription" from the URL
    let resource = msg.body.resource;

    let object = _this._observers[resource];

    let unsubscribe = {
      from: _this.owner,
      to: _this._subURL,
      id: msg.id,
      type: 'unsubscribe',
      body: { resource: msg.body.resource }
    };

    _this._bus.postMessage(unsubscribe);

    delete _this._observers[resource];

    if (object) {
      let event = {
        type: msg.type,
        url: resource,
        identity: msg.body.identity,

        ack: (type) => {
          let lType = 200;
          if (type) {
            lType = type;
          }

         //TODO: any other different options for the release process, like accept but nor release local?
          if (lType === 200) {
            object.delete();
          }

          //send ack response message
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: msg.from,
            body: { code: lType, source: _this._owner }
          });
        }
      };

      if (_this._onNotificationHandler) {
        log.log('NOTIFICATION-EVENT: ', event);
        _this._onNotificationHandler(event);
      }
    } else {
      _this._bus.postMessage({
        id: msg.id, type: 'response', from: msg.to, to: msg.from,
        body: { code: 404, source: _this._owner }
      });
    }
  }

  // close event received from runtime registry
  _onExecute(msg) {
    let _this = this;

    let reply = {
      id: msg.id, type: 'response', from: msg.to, to: msg.from,
      body: { code: 200 }
    };

    if ((msg.from === _this._runtimeUrl + '/registry/' || msg.from === _this._runtimeUrl + '/registry') && msg.body && msg.body.method && msg.body.method === 'close' && _this._onClose) {
      let event = {
        type: 'close',

        ack: (type) => {
          if (type) {
            reply.body.code = type;
          }

         //send ack response message
          _this._bus.postMessage(reply);
        }
      };

      log.info('[Syncher] Close-EVENT: ', event);
      _this._onClose(event);

    } else {
      _this._bus.postMessage(reply);
    }

  }

  /**
  * Callback system to trigger the resumed reporters
  * @param  {Function} callback - function callback which will be invoked
  * @return {Object<URL, DataObjectReporter>} Return one object with all resumed reporters;
  */
  onReportersResume(callback) {
    this._onReportersResume = callback;
  }

  /**
  * Callback system to trigger the resumed observers
  * @param  {Function} callback - function callback which will be invoked
  * @return {Object<URL, DataObjectObserver>} Return one object with all resumed observers;
  */
  onObserversResume(callback) {
    this._onObserversResume = callback;
  }

}

export default Syncher;
