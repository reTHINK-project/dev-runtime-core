(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.runtimeCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
* Message BUS Interface
*/

var MessageBus = (function () {
  /* private
  _registry: Registry
   _subscriptions: <string: MsgListener[]>
  _interceptors: <string: MsgListener[]>
  */

  function MessageBus(registry) {
    _classCallCheck(this, MessageBus);

    var _this = this;

    _this._registry = registry;
    _this._subscriptions = {};
    _this._interceptors = {};
  }

  /**
  * To add "listener" functions to be called when routing messages published on a certain "resource" or send to a certain url. Messages are routed to input parameter "redirectTo" in case listener is not in the Core Runtime. This function is only accessible by internal Core Components. To remove the listener just call remove() function from returned object.
  * @param {URL.URL} url      url
  * @param {Listener} listener listener
  * @param {URL.URL} redirectTo   redirectTo
  */

  _createClass(MessageBus, [{
    key: 'addListener',
    value: function addListener(url, listener, redirectTo) {
      //TODO: include code for target redirection...
      var _this = this;

      var item = new MsgListener(_this._subscriptions, url, listener);
      var itemList = _this._subscriptions[url];
      if (!itemList) {
        itemList = [];
        _this._subscriptions[url] = itemList;
      }

      itemList.push(item);
      return item;
    }

    /**
    * To add an interceptor (eg a Policy Enforcer) which "listener" function is called when routing messages published on "interceptedURL" or send to the "interceptedURL". To avoid infinite cycles messages originated with from "interceptorURL" are not intercepted. To remove the interceptor just call remove() function from returned object. This function is only accessible by internal Core Components.
    * @param {URL.URL} interceptedURL interceptedURL
    * @param {Listener} listener       listener
    * @param {URL.URL} interceptorURL interceptorURL
    * @return {Interceptor}                 Interceptor
    */
  }, {
    key: 'addInterceptor',
    value: function addInterceptor(interceptedURL, listener, interceptorURL) {
      //TODO: include code for interceptorURL...
      var _this = this;

      var item = new MsgListener(_this._interceptors, interceptedURL, listener);
      var itemList = _this._interceptors[interceptedURL];
      if (!itemList) {
        itemList = [];
        _this._interceptors[interceptedURL] = itemList;
      }

      itemList.push(item);
      return item;
    }

    /**
    * To send messages. This function is accessible outside the Core runtime
    * @param  {Message.Message} msg msg
    */
  }, {
    key: 'postMessage',
    value: function postMessage(msg) {
      var _this = this;

      //verify interceptedURL
      //TODO: intercept URL is checked to exit? or into the "onMessage"?
      //if(msg.header.to)

      //resolve protostub URL
      _this._registry.resolve(msg.header.to).then(function (protoStubURL) {
        var itemList = _this._subscriptions[protoStubURL];
        if (itemList) {
          itemList.forEach(function (sub) {
            sub._callback(msg);
          });
        }
      })['catch'](function (e) {
        console.log('PROTO-STUB-ERROR: ', e);
      });
    }
  }]);

  return MessageBus;
})();

exports['default'] = MessageBus;

var MsgListener = (function () {
  /* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */

  function MsgListener(subscriptions, url, callback) {
    _classCallCheck(this, MsgListener);

    var _this = this;

    _this._subscriptions = subscriptions;
    _this._url = url;
    _this._callback = callback;
  }

  _createClass(MsgListener, [{
    key: 'remove',
    value: function remove() {
      var _this = this;

      var subs = _this._subscriptions[_this._url];
      if (subs) {
        var index = subs.indexOf(_this);
        subs.splice(index, 1);
      }
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return MsgListener;
})();

module.exports = exports['default'];

},{}],2:[function(require,module,exports){
/**
 * Functions to deal with assertions compliant with WebRTC RTCIdentityProvider
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdentityModule = (function () {
  function IdentityModule() {
    _classCallCheck(this, IdentityModule);
  }

  _createClass(IdentityModule, [{
    key: "generateAssertion",

    /**
     * Generates an Identity Assertion
     * @param  {DOMString} contents     contents
     * @param  {DOMString} origin       origin
     * @param  {DOMString} usernameHint usernameHint
     * @return {IdAssertion}              IdAssertion
     */
    value: function generateAssertion(contents, origin, usernameHint) {}
    // Body...

    /**
     * Validates an Identity Assertion
     * @param  {DOMString} assertion assertion
     * @param  {DOMString} origin    origin
     */

  }, {
    key: "validateAssertion",
    value: function validateAssertion(assertion, origin) {
      // Body...
    }
  }]);

  return IdentityModule;
})();

exports["default"] = IdentityModule;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
/**
 * Core Policy Engine (PDP/PEP) Interface
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PolicyEngine = (function () {
  function PolicyEngine() {
    _classCallCheck(this, PolicyEngine);
  }

  _createClass(PolicyEngine, [{
    key: "addPolicies",

    /**
     * To add policies to be enforced for a certain deployed Hyperty Instance
     * @param {URL.HypertyURL}     hyperty  hyperty
     * @param {HypertyPolicyList}  policies policies
     */
    value: function addPolicies(hyperty, policies) {}
    // Body...

    /**
     * To remove previously added policies for a certain deployed Hyperty Instance
     * @param  {URL.HypertyURL}  hyperty       hyperty
     */

  }, {
    key: "removePolicies",
    value: function removePolicies(hyperty) {}
    // Body...

    /**
     * Authorisation request to accept a Subscription for a certain resource. Returns a Response Message to be returned to Subscription requester
     * @param  {Message.Message} message       message
     * @return {AuthorisationResponse}                 AuthorisationResponse
     */

  }, {
    key: "authorise",
    value: function authorise(message) {
      // Body...
    }
  }]);

  return PolicyEngine;
})();

exports["default"] = PolicyEngine;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
/**
* Runtime Registry Interface
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Registry = (function () {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */

  function Registry(runtimeURL, remoteRegistry) {
    _classCallCheck(this, Registry);

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is mission');*/
    var _this = this;

    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;
    _this.protoStubs = {};

    //hash not yet fully removed, because it might be needed
    _this.hypertiesList = {};
    _this.db = {};
    _this.DB_NAME = 'registry-DB';
    _this.DB_VERSION = 1;
    _this.DB_STORE_HYPERTY = 'hyperty-list';

    var request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);

    request.onsuccess = function (event) {
      _this.db = this.result;

      //store all the values in the database to a hash table
      var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readonly');
      var objectStore = transaction.objectStore(_this.DB_STORE_HYPERTY);
      objectStore.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
          _this.hypertiesList[cursor.key] = { protoStubURL: cursor.value.protoStubURL,
            pepURL: cursor.value.pepURL, sandboxURL: cursor.value.sandboxURL, identity: cursor.value.identity };
          cursor['continue']();
        }
      };
    };

    request.onerror = function (event) {
      console.error('Request open IndexedDB error:', event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      var objectStore = event.currentTarget.result.createObjectStore(_this.DB_STORE_HYPERTY, { keyPath: 'hyperty' });
      objectStore.createIndex('protoStubURL', 'protoStubURL', { unique: false });
      objectStore.createIndex('pepURL', 'pepURL', { unique: false });
      objectStore.createIndex('sandboxURL', 'sandboxURL', { unique: false });
      objectStore.createIndex('identity', 'identity', { unique: false });

      //populate with the runtimeURL provided
      objectStore.put({ hyperty: _this.runtimeURL, protoStubURL: null,
        pepURL: null, sandboxURL: null, identity: _this.runtimeURL + '/identity' });
    };
  }

  /**
  * Register the messageBus, so the registry can make calls to messageBus
  * @param {MessageBus}           messageBus
  */

  _createClass(Registry, [{
    key: 'registerMessageBus',
    value: function registerMessageBus(messageBus) {
      var _this = this;
      _this.messageBus = messageBus;
    }

    /**
    * Return the messageBus in this Registry
    * @param {MessageBus}           messageBus
    */
  }, {
    key: 'discoverMessageBus',
    value: function discoverMessageBus() {
      var _this = this;
      return _this.messageBus;
    }

    /**
    * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
    * @param  {Message.Message}     postMessage           postMessage
    * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
    * @return {HypertyURL}          HypertyURL
    */
  }, {
    key: 'registerHyperty',
    value: function registerHyperty(postMessage, descriptor) {
      var _this = this;

      // assuming the hyperty name come in the body of the message
      // this is a very simple way to do it, just for test
      var hypertyURL = postMessage.body.value;

      //TODO Call get Identity and set Identity to Identity Module
      //for simplicity added an identity
      var hypertyIdentity = postMessage.body.value + '/identity';

      var promise = new Promise(function (resolve, reject) {

        if (_this.messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        }

        //TODO call the post message to msgBus to read msg to get hyperty address allocation
        //let message = {header: {id: 1, from: _this.runtimeURL, to: 'sp1/msg-node/address-allocation'},
        // body: {'hypertyUrl': hypertyURL}};
        //_this.messageBus.postMessage(message);

        //TODO call the post message with create hypertyRegistration msg
        //let message = {header: {id: 1, from: _this.runtimeURL, to: 'sp1/msg-node/back-end'},
        // body: {'hypertyUrl': hypertyURL}};
        //_this.messageBus.postMessage(message);

        var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
        var storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);

        storeValue.put({ hyperty: hypertyURL, protoStubURL: null,
          pepURL: null, sandboxURL: null, identity: hypertyIdentity });

        //add the hyperty in the hypertiesList hash table
        _this.hypertiesList[hypertyURL] = { protoStubURL: null,
          pepURL: null, sandboxURL: null };

        transaction.oncomplete = function (event) {
          //add to the listener in messageBus
          //TODO check if those are the correct parameters
          _this.messageBus.addListener(hypertyURL + '/status', hypertyIdentity);
          resolve(hypertyURL);
        };

        transaction.onerror = function (event) {
          console.error('Hyperty registration error: ' + event.target.errorCode);
          reject('Error on register hyperty');
        };
      });

      return promise;
    }

    /**
    * To unregister a previously registered Hyperty
    * @param  {HypertyURL}          HypertyURL url        url
    */
  }, {
    key: 'unregisterHyperty',
    value: function unregisterHyperty(url) {
      var _this = this;
      var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');

      var promise = new Promise(function (resolve, reject) {
        var objectStore = transaction.objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(url);

        request.onerror = function (event) {
          console.error('hyperty not found');
          reject('Error on delete Hyperty');
        };

        request.onsuccess = function (event) {

          var data = request.result;
          if (data === undefined) {
            reject('Error on registerPEP');
          } else {

            var request2 = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY)['delete'](url);

            request2.onsuccess = function (event) {
              // delete the hyperty in the hypertiesList hash table
              delete _this.hypertiesList[url];
              resolve('Hyperty delete with success');
            };

            request2.onerror = function (event) {
              console.error('Error deleting an Hyperty');
              reject('Error deleting an Hyperty');
            };
          }
        };
      });

      return promise;
    }

    /**
    * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
    * @param  {DomainURL}           DomainURL            url
    * @return {RuntimeURL}           RuntimeURL
    */
  }, {
    key: 'discoverProtostub',
    value: function discoverProtostub(url) {
      if (!url) throw new Error('Parameter url needed');
      var _this = this;
      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(url);

      var promise = new Promise(function (resolve, reject) {

        request.onerror = function (event) {
          reject('requestUpdate couldn\' get the ProtostubURL');
          console.error('hyperty not found');
        };

        request.onsuccess = function (event) {
          var data = request.result;
          if (data !== undefined) {
            resolve(data.protoStubURL);
          } else {
            reject('No protostubURL was found');
          }
        };
      });

      return promise;
    }

    /**
     * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
     * @param  {DomainURL}     DomainURL service provider domain
     * @return {RuntimeProtoStubURL}
     */
  }, {
    key: 'registerStub',
    value: function registerStub(domainURL) {
      var _this = this;
      var runtimeProtoStubURL;

      var promise = new Promise(function (resolve, reject) {

        if (_this.messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        }

        var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(domainURL);

        //check if messageBus is registered in registry or not
        request.onerror = function (event) {
          console.error('domainURL not found');
          reject('Error on registerProtostub');
        };

        request.onsuccess = function (event) {
          runtimeProtoStubURL = domainURL + '/protostub';
          var data = request.result;

          if (data === undefined) {
            reject('Error on registerProtostub: hyperty not found');
          } else {

            data.protoStubURL = runtimeProtoStubURL;

            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
              console.error('requestUpdate error: ' + event.target.errorCode);
              reject('Error on registerPEP: error on database');
            };

            requestUpdate.onsuccess = function (event) {
              //update the value in the hypertiesList hash table

              var hashValue = _this.hypertiesList[domainURL];
              var newHashValue = { protoStubURL: runtimeProtoStubURL,
                pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL };
              _this.hypertiesList[domainURL] = newHashValue;

              //add to the listener in messageBus
              //TODO check if those are the correct parameters
              _this.messageBus.addListener(runtimeProtoStubURL + '/status', domainURL);

              resolve(runtimeProtoStubURL);
            };
          }
        };
      });

      return promise;
    }

    /**
    * To unregister a previously registered protocol stub
    * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
    */
  }, {
    key: 'unregisterStub',
    value: function unregisterStub(hypertyRuntimeURL) {
      var _this = this;
      var runtimeProtoStubURL;

      var promise = new Promise(function (resolve, reject) {

        var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(hypertyRuntimeURL);

        request.onerror = function (event) {
          console.error('hypertyRuntimeURL not found');
          reject('Error on unregisterStub');
        };

        request.onsuccess = function (event) {
          var data = request.result;

          if (data === undefined) {
            reject('Error on unregisterStub: Hyperty not found');
          } else {

            data.protoStubURL = null;

            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
              console.error('requestUpdate error: ' + event.target.errorCode);
              reject('Error on unregisterStub: error on database');
            };

            requestUpdate.onsuccess = function (event) {
              //update the value in the hypertiesList hash table
              var hashValue = _this.hypertiesList[hypertyRuntimeURL];
              var newHashValue = { protoStubURL: null,
                pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL };
              _this.hypertiesList[hypertyRuntimeURL] = newHashValue;
              resolve('ProtostubURL removed');
            };
          }
        };
      });

      return promise;
    }

    /**
    * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
    * @param  {Message.Message} postMessage postMessage
    * @param  {HypertyURL}          HypertyURL            hyperty
    * @return {HypertyRuntimeURL}   HypertyRuntimeURL
    */
  }, {
    key: 'registerPEP',
    value: function registerPEP(postMessage, hyperty) {
      var _this = this;
      var hypertypepURL;

      var promise = new Promise(function (resolve, reject) {

        var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(hyperty);

        request.onerror = function (event) {
          console.error('URL not found');
          reject('Error on registerPEP');
        };

        request.onsuccess = function (event) {
          hypertypepURL = hyperty + '/pep';
          var data = request.result;

          if (data === undefined) {
            reject('Error on registerPEP');
          } else {

            data.pepURL = hypertypepURL;

            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
              console.error('requestUpdate error: ' + event.target.errorCode);
              reject('Error on update registerPEP');
            };

            requestUpdate.onsuccess = function (event) {
              //update the value in the hypertiesList hash table
              var hashValue = _this.hypertiesList[hyperty];
              var newHashValue = { protoStubURL: hashValue.protoStubURL,
                pepURL: hypertypepURL, sandboxURL: hashValue.sandboxURL };
              _this.hypertiesList[hyperty] = newHashValue;
              resolve(hypertypepURL);
            };
          }
        };
      });

      return promise;
    }

    /**
    * To unregister a previously registered protocol stub
    * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
    */
  }, {
    key: 'unregisterPEP',
    value: function unregisterPEP(HypertyRuntimeURL) {
      var _this = this;
      var hypertypepURL;

      var promise = new Promise(function (resolve, reject) {

        var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(HypertyRuntimeURL);

        request.onerror = function (event) {
          console.error('URL not found');
          reject('Error on unregisterPEP');
        };

        request.onsuccess = function (event) {
          var data = request.result;

          if (data === undefined) {
            reject('Error on unregisterPEP: hyperty not found');
          } else {

            data.pepURL = null;

            var requestUpdate = objectStore.put(data);
            requestUpdate.onerror = function (event) {
              console.error('requestUpdate error: ' + event.target.errorCode);
              reject('Error on unregisterPEP: error on update dabatase');
            };

            requestUpdate.onsuccess = function (event) {
              //update the value in the hypertiesList hash table
              var hashValue = _this.hypertiesList[HypertyRuntimeURL];
              var newHashValue = { protoStubURL: hashValue.protoStubURL,
                pepURL: null, sandboxURL: hashValue.sandboxURL };
              _this.hypertiesList[HypertyRuntimeURL] = newHashValue;
              resolve(' PEP sucessfully deleted');
            };
          }
        };
      });

      return promise;
    }

    /**
    * To receive status events from components registered in the Registry.
    * @param  {Message.Message}     Message.Message       event
    */
  }, {
    key: 'onEvent',
    value: function onEvent(event) {}
    // TODO body...

    /**
     * This function is used to register a new runtime sandboxes passing as input the sandbox instance and the domain URL associated to the sandbox instance.
     * @param  {DomainURL} DomainURL url
     * @return {RuntimeSandboxURL}
     */

  }, {
    key: 'registerSandbox',
    value: function registerSandbox(url) {
      var _this = this;
      var runtimeSandboxURL;

      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(url);

      var promise = new Promise(function (resolve, reject) {

        request.onerror = function (event) {
          reject('requestUpdate couldn\' register the sandbox');
          console.error('URL not found');
        };

        request.onsuccess = function (event) {
          runtimeSandboxURL = url + '/sandbox';
          var data = request.result;
          if (data !== undefined) {
            data.sandboxURL = runtimeSandboxURL;
            var requestUpdate = objectStore.put(data);

            requestUpdate.onerror = function (event) {
              reject('requestUpdate couldn\' register the sandbox');
              console.error('requestUpdate error: ' + event.target.errorCode);
            };

            requestUpdate.onsuccess = function (event) {
              //update the value in the hypertiesList hash table
              var hashValue = _this.hypertiesList[url];
              var newHashValue = { protoStubURL: hashValue.protoStubURL,
                pepURL: hashValue.pepURL, sandboxURL: runtimeSandboxURL };
              _this.hypertiesList[url] = newHashValue;
              resolve(runtimeSandboxURL);
            };
          } else {
            // No match was found.
            reject('The entry don\'t exist.');
          }
        };
      });

      return promise;

      // return new Promise(function(resolve, reject) {
      // resolve(RuntimeSandboxURL);
      // });
    }

    /**
    * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
    * @param  {DomainURL} DomainURL url
    * @return {RuntimeSandbox}           RuntimeSandbox
    */
  }, {
    key: 'getSandbox',
    value: function getSandbox(url) {
      if (!url) throw new Error('Parameter url needed');
      var _this = this;
      var runtimeURL = _this.hypertiesList[url];
      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(url);

      var promise = new Promise(function (resolve, reject) {

        request.onerror = function (event) {
          reject('requestUpdate couldn\' get the sandbox');
          console.error('URL not found');
        };

        request.onsuccess = function (event) {
          var data = request.result;
          if (data !== undefined) {
            resolve(data.sandboxURL);
          } else {
            reject('No sandboxURL was found');
          }
        };
      });

      return promise;
    }

    /**
    * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint).
    * @param  {URL.URL}  url       url
    * @return {Promise<URL.URL>}                 Promise <URL.URL>
    */
  }, {
    key: 'resolve',
    value: function resolve(url) {
      return new Promise(function (resolve, reject) {
        //resolve to the same URL
        resolve(url);
      });
    }
  }]);

  return Registry;
})();

exports['default'] = Registry;
module.exports = exports['default'];

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _runtimeRuntimeUA = require('./runtime/RuntimeUA');

var _runtimeRuntimeUA2 = _interopRequireDefault(_runtimeRuntimeUA);

var _sandboxSandbox = require('./sandbox/Sandbox');

var _sandboxSandbox2 = _interopRequireDefault(_sandboxSandbox);

// TODO: Remove this before compiling
// This is only for testing
// import Sandbox from '../test/sandboxes/SandboxBrowser';
// var sandbox = new Sandbox();
// window.runtime = new RuntimeUA(sandbox);

var RuntimeUA = _runtimeRuntimeUA2['default'];
exports.RuntimeUA = RuntimeUA;
var Sandbox = _sandboxSandbox2['default'];
exports.Sandbox = Sandbox;

},{"./runtime/RuntimeUA":6,"./sandbox/Sandbox":7}],6:[function(require,module,exports){
// utils
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsRequest = require('../utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

// Main dependecies

var _registryRegistry = require('../registry/Registry');

var _registryRegistry2 = _interopRequireDefault(_registryRegistry);

var _identityIdentityModule = require('../identity/IdentityModule');

var _identityIdentityModule2 = _interopRequireDefault(_identityIdentityModule);

var _policyPolicyEngine = require('../policy/PolicyEngine');

var _policyPolicyEngine2 = _interopRequireDefault(_policyPolicyEngine);

var _busMessageBus = require('../bus/MessageBus');

var _busMessageBus2 = _interopRequireDefault(_busMessageBus);

/**
* Runtime User Agent Interface
*/

var RuntimeUA = (function () {
  function RuntimeUA(sandboxFactory) {
    _classCallCheck(this, RuntimeUA);

    if (!sandboxFactory) throw new Error('The sandbox factory is a needed parameter');

    var _this = this;

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // for the request you can use the module request in utils;
    // the response is like: hyperty-runtime://sp1/protostub/123

    var hypertyRuntimeURL = 'hyperty-runtime://sp1/protostub/123';

    _this.registry = new _registryRegistry2['default'](hypertyRuntimeURL);
    _this.identityModule = new _identityIdentityModule2['default']();
    _this.policyEngine = new _policyPolicyEngine2['default']();
    _this.messageBus = new _busMessageBus2['default'](_this.registry);

    _this.registry.registerMessageBus(_this.messageBus);

    sandboxFactory.messageBus = _this.messageBus;
    _this.sandboxFactory = sandboxFactory;

    // TODO: remove this event listener, only for testing
    var hypertyRuntimeURLStatus = 'hyperty-runtime://sp1/protostub/123/status';
    _this.messageBus.addListener(hypertyRuntimeURLStatus, function (msg) {
      console.log('Message bus status response with message: ', msg);
    });

    _this.messageBus.addListener('runtime:/alice', function (msg) {
      console.log('Message bus alice with message: ', msg);
    });

    _this.messageBus.addListener('hyperty-runtime://sp1/protostub/123', function (msg) {
      console.log('Message bus response with message: ', msg);
    });
  }

  /**
  * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
  * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
  */

  _createClass(RuntimeUA, [{
    key: 'discoverHiperty',
    value: function discoverHiperty(descriptor) {}
    // Body...

    /**
    * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
    * @param  {Object} Object                   hypertyInstance
    * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
    */

  }, {
    key: 'registerHyperty',
    value: function registerHyperty(hypertyInstance, descriptor) {}
    // Body...

    /**
    * Deploy Hyperty from Catalogue URL
    * @param  {URL.URL}    hyperty hypertyInstance url;
    */

  }, {
    key: 'loadHyperty',
    value: function loadHyperty(hyperty) {

      var _this = this;

      if (!hyperty) throw new Error('Hyperty descriptor url parameter is needed');

      return new Promise(function (resolve, reject) {

        var _hypertySandbox = undefined;
        var _hypertyDescriptor = undefined;
        var _hypertySourceCode = undefined;
        var _hypertyConfiguration = {
          url: 'ws://localhost:9090/ws',
          runtimeURL: 'runtime:/alice'
        };

        var errorReason = function errorReason(reason) {
          // console.log('Hyperty Error:', reason);
          reject(reason);
        };

        // Get Hyperty descriptor
        return _utilsRequest2['default'].get(hyperty).then(function (hypertyDescriptor) {

          console.info('1: return hyperty descriptor');

          _hypertyDescriptor = hypertyDescriptor;

          // TODO: Update this variables with result of the request
          // This values are only for testes, should be removed;
          var hypertySourceCodeUrl = 'dist/VertxProtoStub.js';

          // Get the hyperty source code
          return _utilsRequest2['default'].get(hypertySourceCodeUrl);
        }).then(function (hypertySourceCode) {

          console.info('2: return hyperty source code');
          _hypertySourceCode = hypertySourceCode;

          // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
          var message = {
            body: {
              value: 'hyperty-runtime://sp1/protostub/123'
            }
          };

          // Register hyperty;
          return _this.registry.registerHyperty(message, _hypertyDescriptor);
        }).then(function (hypertyURL) {
          console.info('3: return hyperty url, after register hyperty');

          var inSameSandbox = true;

          // TODO: Check if the app and hyperty is in the same sandbox and
          if (inSameSandbox) {
            // TODO: getAppSandbox, this will return a promise;

            if (!_hypertySandbox) {
              _hypertySandbox = _this.sandboxFactory.createAppSandbox();
            }

            _hypertySandbox.deployComponent(_hypertySourceCode, hypertyURL, _hypertyConfiguration);
            return true;
          } else {
            // TODO: getHypertySandbox, this will return a promise;

            _hypertySandbox = _this.sandboxFactory.createSandbox();
            _hypertySandbox.deployComponent(_hypertySourceCode, hypertyURL, hypertyConfiguration);
            return false;
          }
        }).then(function (sandboxInstance) {
          console.info('4: return the sandbox instance after check if is in the same sandbox or not');

          //resolve({code: sourceCode, hypertyURL: hypertyURL, hypertyConfiguration: hypertyConfiguration, messageBus: _this.messageBus});
        }).then(function (result) {
          console.info('5: return deploy component for sandbox status');
        })['catch'](errorReason);
      });
    }

    /**
    * Deploy Stub from Catalogue URL or domain url
    * @param  {URL.URL}     domain          domain
    */
  }, {
    key: 'loadStub',
    value: function loadStub(domain) {

      var _this = this;

      if (!domain) throw new Error('domain parameter is needed');

      return new Promise(function (resolve, reject) {

        var stubDescriptor = undefined;

        // TODO: temporary address this only static for testing
        var stubURL = 'hyperty-runtime://sp1/protostub/123';
        var componentDownloadURL = 'dist/VertxProtoStub.js';
        var configuration = {
          url: 'ws://localhost:9090/ws',
          runtimeURL: 'runtime:/alice'
        };

        var stubSandbox = undefined;
        var runtimeSandboxURL = undefined;
        var runtimeProtoStubURL = undefined;
        var protoStubSourceCode = undefined;

        // Discover Protocol Stub
        return _this.registry.discoverProtostub(domain).then(function (descriptor) {
          // Is registed?
          console.info('1. Proto Stub Discovered: ', descriptor);
          stubDescriptor = descriptor;
          return stubDescriptor;
        }, function (reason) {
          // is not registed?
          console.info('1. Proto Stub not found:', reason);

          // TODO: get protostub | <sp-domain>/.well-known/protostub
          // for the request you can use the module request in utils;
          return _utilsRequest2['default'].get(domain);
        }).then(function (descriptor) {
          console.info('2. return the ProtoStub descriptor:', descriptor);
          stubDescriptor = descriptor;

          // Get the component source code referent to component download url;
          return _utilsRequest2['default'].get(componentDownloadURL);
        }).then(function (protoStubSourceCode) {
          console.info('3. return the ProtoStub Source Code: ');
          protoStubSourceCode = protoStubSourceCode;

          return _this.registry.registerStub(domain);
        }).then(function (runtimeProtoStubURL) {
          console.info('4. return the runtimeProtoStubURL, After Register Stub');
          runtimeProtoStubURL = runtimeProtoStubURL;

          // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
          // Instantiate the Sandbox
          stubSandbox = _this.sandboxFactory.createSandbox();

          return _this.registry.registerSandbox(stubSandbox, domain);
        }).then(function (runtimeSandboxURL) {
          console.info('5: return the sandbox runtime url');

          // Deploy Component
          return stubSandbox.deployComponent(protoStubSourceCode, runtimeSandboxURL, configuration);
        }).then(function (result) {
          console.info('6: return deploy component for sandbox status');

          // Add the message bus listener
          _this.messageBus.addListener(runtimeProtoStubURL, stubSandbox);

          // Handle with deployed component
          console.log('Component is deployed');

          // Load Stub function resolved with success;
          resolve('Stub successfully loaded');
        })['catch'](function (reason) {
          console.log('Reason:', reason);
        });
      });
    }

    /**
    * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
    * @param  {CatalogueURL}       url url
    */
  }, {
    key: 'checkForUpdate',
    value: function checkForUpdate(url) {
      // Body...
    }
  }]);

  return RuntimeUA;
})();

exports['default'] = RuntimeUA;
module.exports = exports['default'];

},{"../bus/MessageBus":1,"../identity/IdentityModule":2,"../policy/PolicyEngine":3,"../registry/Registry":4,"../utils/request":8}],7:[function(require,module,exports){
/**
 * Implements the Sandbox interface to protect all external code;
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SandboxBase = (function () {
  function SandboxBase(messageBus) {
    _classCallCheck(this, SandboxBase);
  }

  /**
   * To download and deploy a new component in the sandbox passing as input parameters the url from where the components is downloaded, the componentURL address previously allocated to the component and its configuration.
   * @param  {URL.URL}        componentDownloadURL      Sourcecode Component address url
   * @param  {URL.URL}        componentURL              Component address url;
   * @param  {Object}         configuration             Configuration object;
   */

  _createClass(SandboxBase, [{
    key: "deployComponent",
    value: function deployComponent(componentSourceCode, componentURL, configuration) {}

    /**
     * To remove a component from the sandbox passing as input parameters its URL.
     * @param  {URL.URL}        componentURL              Component address url;
     */
  }, {
    key: "removeComponent",
    value: function removeComponent(componentURL) {}
  }]);

  return SandboxBase;
})();

exports["default"] = SandboxBase;
module.exports = exports["default"];

},{}],8:[function(require,module,exports){
/**
  * Make ajax request
  */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Request = (function () {
  function Request() {
    _classCallCheck(this, Request);

    var _this = this;
    var methods = { get: 'GET', post: 'POST', 'delete': 'DELETE', put: 'PUT' };

    Object.keys(methods).forEach(function (method) {
      _this[method] = function (url, params, headers) {
        return _this.makeRequest(methods[method], url, params, headers);
      };
    });
  }

  /**
   * Make ajax request
   * @param  {string}   method  the CRUD method (get, post, put, delete)
   * @param  {string}   url     the url requested to obtain an response
   * @param  {object}   params  pass the parameters to request
   * @param  {object}   headers set request headers
   * @return {object}
   */

  _createClass(Request, [{
    key: 'makeRequest',
    value: function makeRequest(method, url, params, headers) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        var httpRequest = undefined;

        if (window.XMLHttpRequest) {
          // Mozilla, Safari, ...
          httpRequest = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
          // IE
          try {
            httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
          } catch (e) {
            try {
              httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
            } catch (error) {
              reject(error);
            }
          }
        }

        if (!httpRequest) {
          reject('Giving up :( Cannot create an XMLHTTP instance');
        }

        httpRequest.open(method, url);

        // Set headers to request
        if (headers) {
          Object.keys(headers).forEach(function (header) {
            httpRequest.setRequestHeader(header, headers[header]);
          });
        }

        httpRequest.onreadystatechange = function (event) {
          var httpRequest = event.currentTarget;

          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
              // console.log(httpRequest.response);
              resolve(httpRequest.response);
            } else {
              reject(httpRequest.response);
            }
          }
        };

        // If have params send them, in string format
        httpRequest.send(params);
      });
    }
  }]);

  return Request;
})();

var request = new Request();
exports['default'] = request;
module.exports = exports['default'];

},{}]},{},[5])(5)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NZXNzYWdlQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9pZGVudGl0eS9JZGVudGl0eU1vZHVsZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcG9saWN5L1BvbGljeUVuZ2luZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcmVnaXN0cnkvUmVnaXN0cnkuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3J1bnRpbWUtY29yZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcnVudGltZS9SdW50aW1lVUEuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3gvU2FuZGJveC5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvdXRpbHMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDSU0sVUFBVTs7Ozs7OztBQVFILFdBUlAsVUFBVSxDQVFGLFFBQVEsRUFBRTswQkFSbEIsVUFBVTs7QUFTWixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpC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QUFDO2FBQzlCO1dBQ0Y7U0FDRixDQUFDOzs7QUFHRixtQkFBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUUxQixDQUFDLENBQUM7S0FFSjs7O1NBL0VHLE9BQU87OztBQW1GYixJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO3FCQUNiLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZXhwb3J0IGRlZmF1bHRcbi8qKlxuKiBNZXNzYWdlIEJVUyBJbnRlcmZhY2VcbiovXG5jbGFzcyBNZXNzYWdlQnVzIHtcbiAgLyogcHJpdmF0ZVxuICBfcmVnaXN0cnk6IFJlZ2lzdHJ5XG5cbiAgX3N1YnNjcmlwdGlvbnM6IDxzdHJpbmc6IE1zZ0xpc3RlbmVyW10+XG4gIF9pbnRlcmNlcHRvcnM6IDxzdHJpbmc6IE1zZ0xpc3RlbmVyW10+XG4gICovXG5cbiAgY29uc3RydWN0b3IocmVnaXN0cnkpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3JlZ2lzdHJ5ID0gcmVnaXN0cnk7XG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcbiAgICBfdGhpcy5faW50ZXJjZXB0b3JzID0ge307XG5cbiAgfVxuXG4gIC8qKlxuICAqIFRvIGFkZCBcImxpc3RlbmVyXCIgZnVuY3Rpb25zIHRvIGJlIGNhbGxlZCB3aGVuIHJvdXRpbmcgbWVzc2FnZXMgcHVibGlzaGVkIG9uIGEgY2VydGFpbiBcInJlc291cmNlXCIgb3Igc2VuZCB0byBhIGNlcnRhaW4gdXJsLiBNZXNzYWdlcyBhcmUgcm91dGVkIHRvIGlucHV0IHBhcmFtZXRlciBcInJlZGlyZWN0VG9cIiBpbiBjYXNlIGxpc3RlbmVyIGlzIG5vdCBpbiB0aGUgQ29yZSBSdW50aW1lLiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgYWNjZXNzaWJsZSBieSBpbnRlcm5hbCBDb3JlIENvbXBvbmVudHMuIFRvIHJlbW92ZSB0aGUgbGlzdGVuZXIganVzdCBjYWxsIHJlbW92ZSgpIGZ1bmN0aW9uIGZyb20gcmV0dXJuZWQgb2JqZWN0LlxuICAqIEBwYXJhbSB7VVJMLlVSTH0gdXJsICAgICAgdXJsXG4gICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXIgbGlzdGVuZXJcbiAgKiBAcGFyYW0ge1VSTC5VUkx9IHJlZGlyZWN0VG8gICByZWRpcmVjdFRvXG4gICovXG4gIGFkZExpc3RlbmVyKHVybCwgbGlzdGVuZXIsIHJlZGlyZWN0VG8pIHtcbiAgICAvL1RPRE86IGluY2x1ZGUgY29kZSBmb3IgdGFyZ2V0IHJlZGlyZWN0aW9uLi4uXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBpdGVtID0gbmV3IE1zZ0xpc3RlbmVyKF90aGlzLl9zdWJzY3JpcHRpb25zLCB1cmwsIGxpc3RlbmVyKTtcbiAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdO1xuICAgIGlmICghaXRlbUxpc3QpIHtcbiAgICAgIGl0ZW1MaXN0ID0gW107XG4gICAgICBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdID0gaXRlbUxpc3Q7XG4gICAgfVxuXG4gICAgaXRlbUxpc3QucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIGFkZCBhbiBpbnRlcmNlcHRvciAoZWcgYSBQb2xpY3kgRW5mb3JjZXIpIHdoaWNoIFwibGlzdGVuZXJcIiBmdW5jdGlvbiBpcyBjYWxsZWQgd2hlbiByb3V0aW5nIG1lc3NhZ2VzIHB1Ymxpc2hlZCBvbiBcImludGVyY2VwdGVkVVJMXCIgb3Igc2VuZCB0byB0aGUgXCJpbnRlcmNlcHRlZFVSTFwiLiBUbyBhdm9pZCBpbmZpbml0ZSBjeWNsZXMgbWVzc2FnZXMgb3JpZ2luYXRlZCB3aXRoIGZyb20gXCJpbnRlcmNlcHRvclVSTFwiIGFyZSBub3QgaW50ZXJjZXB0ZWQuIFRvIHJlbW92ZSB0aGUgaW50ZXJjZXB0b3IganVzdCBjYWxsIHJlbW92ZSgpIGZ1bmN0aW9uIGZyb20gcmV0dXJuZWQgb2JqZWN0LiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgYWNjZXNzaWJsZSBieSBpbnRlcm5hbCBDb3JlIENvbXBvbmVudHMuXG4gICogQHBhcmFtIHtVUkwuVVJMfSBpbnRlcmNlcHRlZFVSTCBpbnRlcmNlcHRlZFVSTFxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyICAgICAgIGxpc3RlbmVyXG4gICogQHBhcmFtIHtVUkwuVVJMfSBpbnRlcmNlcHRvclVSTCBpbnRlcmNlcHRvclVSTFxuICAqIEByZXR1cm4ge0ludGVyY2VwdG9yfSAgICAgICAgICAgICAgICAgSW50ZXJjZXB0b3JcbiAgKi9cbiAgYWRkSW50ZXJjZXB0b3IoaW50ZXJjZXB0ZWRVUkwsIGxpc3RlbmVyLCBpbnRlcmNlcHRvclVSTCkge1xuICAgIC8vVE9ETzogaW5jbHVkZSBjb2RlIGZvciBpbnRlcmNlcHRvclVSTC4uLlxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgaXRlbSA9IG5ldyBNc2dMaXN0ZW5lcihfdGhpcy5faW50ZXJjZXB0b3JzLCBpbnRlcmNlcHRlZFVSTCwgbGlzdGVuZXIpO1xuICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9pbnRlcmNlcHRvcnNbaW50ZXJjZXB0ZWRVUkxdO1xuICAgIGlmICghaXRlbUxpc3QpIHtcbiAgICAgIGl0ZW1MaXN0ID0gW107XG4gICAgICBfdGhpcy5faW50ZXJjZXB0b3JzW2ludGVyY2VwdGVkVVJMXSA9IGl0ZW1MaXN0O1xuICAgIH1cblxuICAgIGl0ZW1MaXN0LnB1c2goaXRlbSk7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICAvKipcbiAgKiBUbyBzZW5kIG1lc3NhZ2VzLiBUaGlzIGZ1bmN0aW9uIGlzIGFjY2Vzc2libGUgb3V0c2lkZSB0aGUgQ29yZSBydW50aW1lXG4gICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtc2cgbXNnXG4gICovXG4gIHBvc3RNZXNzYWdlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvL3ZlcmlmeSBpbnRlcmNlcHRlZFVSTFxuICAgIC8vVE9ETzogaW50ZXJjZXB0IFVSTCBpcyBjaGVja2VkIHRvIGV4aXQ/IG9yIGludG8gdGhlIFwib25NZXNzYWdlXCI/XG4gICAgLy9pZihtc2cuaGVhZGVyLnRvKVxuXG4gICAgLy9yZXNvbHZlIHByb3Rvc3R1YiBVUkxcbiAgICBfdGhpcy5fcmVnaXN0cnkucmVzb2x2ZShtc2cuaGVhZGVyLnRvKS50aGVuKChwcm90b1N0dWJVUkwpID0+IHtcbiAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3Byb3RvU3R1YlVSTF07XG4gICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgaXRlbUxpc3QuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICAgICAgc3ViLl9jYWxsYmFjayhtc2cpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZygnUFJPVE8tU1RVQi1FUlJPUjogJywgZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuY2xhc3MgTXNnTGlzdGVuZXIge1xuICAvKiBwcml2YXRlXG4gIF9zdWJzY3JpcHRpb25zOiA8c3RyaW5nOiBNc2dMaXN0ZW5lcltdPjtcbiAgX3VybDogc3RyaW5nO1xuICBfY2FsbGJhY2s6IChtc2cpID0+IHZvaWQ7XG4gICovXG5cbiAgY29uc3RydWN0b3Ioc3Vic2NyaXB0aW9ucywgdXJsLCBjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHN1YnNjcmlwdGlvbnM7XG4gICAgX3RoaXMuX3VybCA9IHVybDtcbiAgICBfdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmw7IH1cblxuICByZW1vdmUoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBzdWJzID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbX3RoaXMuX3VybF07XG4gICAgaWYgKHN1YnMpIHtcbiAgICAgIGxldCBpbmRleCA9IHN1YnMuaW5kZXhPZihfdGhpcyk7XG4gICAgICBzdWJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG59XG4iLCIvKipcbiAqIEZ1bmN0aW9ucyB0byBkZWFsIHdpdGggYXNzZXJ0aW9ucyBjb21wbGlhbnQgd2l0aCBXZWJSVEMgUlRDSWRlbnRpdHlQcm92aWRlclxuICovXG5jbGFzcyBJZGVudGl0eU1vZHVsZSB7XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlcyBhbiBJZGVudGl0eSBBc3NlcnRpb25cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBjb250ZW50cyAgICAgY29udGVudHNcbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBvcmlnaW4gICAgICAgb3JpZ2luXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gdXNlcm5hbWVIaW50IHVzZXJuYW1lSGludFxuICAgKiBAcmV0dXJuIHtJZEFzc2VydGlvbn0gICAgICAgICAgICAgIElkQXNzZXJ0aW9uXG4gICAqL1xuICBnZW5lcmF0ZUFzc2VydGlvbihjb250ZW50cywgb3JpZ2luLCB1c2VybmFtZUhpbnQpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogVmFsaWRhdGVzIGFuIElkZW50aXR5IEFzc2VydGlvblxuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IGFzc2VydGlvbiBhc3NlcnRpb25cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBvcmlnaW4gICAgb3JpZ2luXG4gICAqL1xuICB2YWxpZGF0ZUFzc2VydGlvbihhc3NlcnRpb24sIG9yaWdpbikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElkZW50aXR5TW9kdWxlO1xuIiwiLyoqXG4gKiBDb3JlIFBvbGljeSBFbmdpbmUgKFBEUC9QRVApIEludGVyZmFjZVxuICovXG5jbGFzcyBQb2xpY3lFbmdpbmUge1xuXG4gIC8qKlxuICAgKiBUbyBhZGQgcG9saWNpZXMgdG8gYmUgZW5mb3JjZWQgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEBwYXJhbSB7VVJMLkh5cGVydHlVUkx9ICAgICBoeXBlcnR5ICBoeXBlcnR5XG4gICAqIEBwYXJhbSB7SHlwZXJ0eVBvbGljeUxpc3R9ICBwb2xpY2llcyBwb2xpY2llc1xuICAgKi9cbiAgYWRkUG9saWNpZXMoaHlwZXJ0eSwgcG9saWNpZXMpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogVG8gcmVtb3ZlIHByZXZpb3VzbHkgYWRkZWQgcG9saWNpZXMgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEBwYXJhbSAge1VSTC5IeXBlcnR5VVJMfSAgaHlwZXJ0eSAgICAgICBoeXBlcnR5XG4gICAqL1xuICByZW1vdmVQb2xpY2llcyhoeXBlcnR5KSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIEF1dGhvcmlzYXRpb24gcmVxdWVzdCB0byBhY2NlcHQgYSBTdWJzY3JpcHRpb24gZm9yIGEgY2VydGFpbiByZXNvdXJjZS4gUmV0dXJucyBhIFJlc3BvbnNlIE1lc3NhZ2UgdG8gYmUgcmV0dXJuZWQgdG8gU3Vic2NyaXB0aW9uIHJlcXVlc3RlclxuICAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9IG1lc3NhZ2UgICAgICAgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtBdXRob3Jpc2F0aW9uUmVzcG9uc2V9ICAgICAgICAgICAgICAgICBBdXRob3Jpc2F0aW9uUmVzcG9uc2VcbiAgICovXG4gIGF1dGhvcmlzZShtZXNzYWdlKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9saWN5RW5naW5lO1xuIiwiLyoqXG4qIFJ1bnRpbWUgUmVnaXN0cnkgSW50ZXJmYWNlXG4qL1xuY2xhc3MgUmVnaXN0cnkge1xuXG4gIC8qKlxuICAqIFRvIGluaXRpYWxpc2UgdGhlIFJ1bnRpbWUgUmVnaXN0cnkgd2l0aCB0aGUgUnVudGltZVVSTCB0aGF0IHdpbGwgYmUgdGhlIGJhc2lzIHRvIGRlcml2ZSB0aGUgaW50ZXJuYWwgcnVudGltZSBhZGRyZXNzZXMgd2hlbiBhbGxvY2F0aW5nIGFkZHJlc3NlcyB0byBpbnRlcm5hbCBydW50aW1lIGNvbXBvbmVudC4gSW4gYWRkaXRpb24sIHRoZSBSZWdpc3RyeSBkb21haW4gYmFjay1lbmQgdG8gYmUgdXNlZCB0byByZW1vdGVseSByZWdpc3RlciBSdW50aW1lIGNvbXBvbmVudHMsIGlzIGFsc28gcGFzc2VkIGFzIGlucHV0IHBhcmFtZXRlci5cbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBydW50aW1lVVJMICAgICAgICAgICAgcnVudGltZVVSTFxuICAqIEBwYXJhbSAge0RvbWFpblVSTH0gICAgICAgICAgIHJlbW90ZVJlZ2lzdHJ5ICAgICAgICByZW1vdGVSZWdpc3RyeVxuICAqL1xuICBjb25zdHJ1Y3RvcihydW50aW1lVVJMLCByZW1vdGVSZWdpc3RyeSkge1xuXG4gICAgaWYgKCFydW50aW1lVVJMKSB0aHJvdyBuZXcgRXJyb3IoJ3J1bnRpbWVVUkwgaXMgbWlzc2luZy4nKTtcbiAgICAvKmlmICghcmVtb3RlUmVnaXN0cnkpIHRocm93IG5ldyBFcnJvcigncmVtb3RlUmVnaXN0cnkgaXMgbWlzc2lvbicpOyovXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLnJ1bnRpbWVVUkwgPSBydW50aW1lVVJMO1xuICAgIF90aGlzLnJlbW90ZVJlZ2lzdHJ5ID0gcmVtb3RlUmVnaXN0cnk7XG4gICAgX3RoaXMucHJvdG9TdHVicyA9IHt9O1xuXG4gICAgLy9oYXNoIG5vdCB5ZXQgZnVsbHkgcmVtb3ZlZCwgYmVjYXVzZSBpdCBtaWdodCBiZSBuZWVkZWRcbiAgICBfdGhpcy5oeXBlcnRpZXNMaXN0ID0ge307XG4gICAgX3RoaXMuZGIgPSB7fTtcbiAgICBfdGhpcy5EQl9OQU1FID0gJ3JlZ2lzdHJ5LURCJztcbiAgICBfdGhpcy5EQl9WRVJTSU9OID0gMTtcbiAgICBfdGhpcy5EQl9TVE9SRV9IWVBFUlRZID0gJ2h5cGVydHktbGlzdCc7XG5cbiAgICBsZXQgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKF90aGlzLkRCX05BTUUsIF90aGlzLkRCX1ZFUlNJT04pO1xuXG4gICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgX3RoaXMuZGIgPSB0aGlzLnJlc3VsdDtcblxuICAgICAgLy9zdG9yZSBhbGwgdGhlIHZhbHVlcyBpbiB0aGUgZGF0YWJhc2UgdG8gYSBoYXNoIHRhYmxlXG4gICAgICB2YXIgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZG9ubHknKTtcbiAgICAgIHZhciBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgb2JqZWN0U3RvcmUub3BlbkN1cnNvcigpLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBjdXJzb3IgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICBpZiAoY3Vyc29yKSB7XG4gICAgICAgICAgX3RoaXMuaHlwZXJ0aWVzTGlzdFtjdXJzb3Iua2V5XSA9IHtwcm90b1N0dWJVUkw6IGN1cnNvci52YWx1ZS5wcm90b1N0dWJVUkwsXG4gICAgICAgICAgcGVwVVJMOiBjdXJzb3IudmFsdWUucGVwVVJMLCBzYW5kYm94VVJMOiBjdXJzb3IudmFsdWUuc2FuZGJveFVSTCwgaWRlbnRpdHk6IGN1cnNvci52YWx1ZS5pZGVudGl0eX07XG4gICAgICAgICAgY3Vyc29yLmNvbnRpbnVlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdSZXF1ZXN0IG9wZW4gSW5kZXhlZERCIGVycm9yOicsIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgIH07XG5cbiAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShcbiAgICAgICAgX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwge2tleVBhdGg6ICdoeXBlcnR5J30pO1xuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoJ3Byb3RvU3R1YlVSTCcsICdwcm90b1N0dWJVUkwnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoJ3BlcFVSTCcsICdwZXBVUkwnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoJ3NhbmRib3hVUkwnLCAnc2FuZGJveFVSTCcsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgnaWRlbnRpdHknLCAnaWRlbnRpdHknLCB7dW5pcXVlOiBmYWxzZX0pO1xuXG4gICAgICAvL3BvcHVsYXRlIHdpdGggdGhlIHJ1bnRpbWVVUkwgcHJvdmlkZWRcbiAgICAgIG9iamVjdFN0b3JlLnB1dCh7aHlwZXJ0eTogX3RoaXMucnVudGltZVVSTCwgcHJvdG9TdHViVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgIHBlcFVSTDogbnVsbCwgc2FuZGJveFVSTDogbnVsbCwgaWRlbnRpdHk6IF90aGlzLnJ1bnRpbWVVUkwgKyAnL2lkZW50aXR5J30pO1xuICAgIH07XG5cbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIHRoZSBtZXNzYWdlQnVzLCBzbyB0aGUgcmVnaXN0cnkgY2FuIG1ha2UgY2FsbHMgdG8gbWVzc2FnZUJ1c1xuICAqIEBwYXJhbSB7TWVzc2FnZUJ1c30gICAgICAgICAgIG1lc3NhZ2VCdXNcbiAgKi9cbiAgcmVnaXN0ZXJNZXNzYWdlQnVzKG1lc3NhZ2VCdXMpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLm1lc3NhZ2VCdXMgPSBtZXNzYWdlQnVzO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJuIHRoZSBtZXNzYWdlQnVzIGluIHRoaXMgUmVnaXN0cnlcbiAgKiBAcGFyYW0ge01lc3NhZ2VCdXN9ICAgICAgICAgICBtZXNzYWdlQnVzXG4gICovXG4gIGRpc2NvdmVyTWVzc2FnZUJ1cygpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBfdGhpcy5tZXNzYWdlQnVzO1xuICB9XG5cbiAgLyoqXG4gICogVG8gcmVnaXN0ZXIgYSBuZXcgSHlwZXJ0eSBpbiB0aGUgcnVudGltZSB3aGljaCByZXR1cm5zIHRoZSBIeXBlcnR5VVJMIGFsbG9jYXRlZCB0byB0aGUgbmV3IEh5cGVydHkuXG4gICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSAgICAgcG9zdE1lc3NhZ2UgICAgICAgICAgIHBvc3RNZXNzYWdlXG4gICogQHBhcmFtICB7SHlwZXJ0eUNhdGFsb2d1ZVVSTH0gSHlwZXJ0eUNhdGFsb2d1ZVVSTCAgIGRlc2NyaXB0b3JcbiAgKiBAcmV0dXJuIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMXG4gICovXG4gIHJlZ2lzdGVySHlwZXJ0eShwb3N0TWVzc2FnZSwgZGVzY3JpcHRvcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBhc3N1bWluZyB0aGUgaHlwZXJ0eSBuYW1lIGNvbWUgaW4gdGhlIGJvZHkgb2YgdGhlIG1lc3NhZ2VcbiAgICAvLyB0aGlzIGlzIGEgdmVyeSBzaW1wbGUgd2F5IHRvIGRvIGl0LCBqdXN0IGZvciB0ZXN0XG4gICAgbGV0IGh5cGVydHlVUkwgPSBwb3N0TWVzc2FnZS5ib2R5LnZhbHVlO1xuXG4gICAgLy9UT0RPIENhbGwgZ2V0IElkZW50aXR5IGFuZCBzZXQgSWRlbnRpdHkgdG8gSWRlbnRpdHkgTW9kdWxlXG4gICAgLy9mb3Igc2ltcGxpY2l0eSBhZGRlZCBhbiBpZGVudGl0eVxuICAgIGxldCBoeXBlcnR5SWRlbnRpdHkgPSBwb3N0TWVzc2FnZS5ib2R5LnZhbHVlICsgJy9pZGVudGl0eSc7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBpZiAoX3RoaXMubWVzc2FnZUJ1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlamVjdCgnTWVzc2FnZUJ1cyBub3QgZm91bmQgb24gcmVnaXN0ZXJTdHViJyk7XG4gICAgICB9XG5cbiAgICAgIC8vVE9ETyBjYWxsIHRoZSBwb3N0IG1lc3NhZ2UgdG8gbXNnQnVzIHRvIHJlYWQgbXNnIHRvIGdldCBoeXBlcnR5IGFkZHJlc3MgYWxsb2NhdGlvblxuICAgICAgLy9sZXQgbWVzc2FnZSA9IHtoZWFkZXI6IHtpZDogMSwgZnJvbTogX3RoaXMucnVudGltZVVSTCwgdG86ICdzcDEvbXNnLW5vZGUvYWRkcmVzcy1hbGxvY2F0aW9uJ30sXG4gICAgICAvLyBib2R5OiB7J2h5cGVydHlVcmwnOiBoeXBlcnR5VVJMfX07XG4gICAgICAvL190aGlzLm1lc3NhZ2VCdXMucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgIC8vVE9ETyBjYWxsIHRoZSBwb3N0IG1lc3NhZ2Ugd2l0aCBjcmVhdGUgaHlwZXJ0eVJlZ2lzdHJhdGlvbiBtc2dcbiAgICAgIC8vbGV0IG1lc3NhZ2UgPSB7aGVhZGVyOiB7aWQ6IDEsIGZyb206IF90aGlzLnJ1bnRpbWVVUkwsIHRvOiAnc3AxL21zZy1ub2RlL2JhY2stZW5kJ30sXG4gICAgICAvLyBib2R5OiB7J2h5cGVydHlVcmwnOiBoeXBlcnR5VVJMfX07XG4gICAgICAvL190aGlzLm1lc3NhZ2VCdXMucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgIGxldCB0cmFuc2FjdGlvbiA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX0hZUEVSVFksICdyZWFkd3JpdGUnKTtcbiAgICAgIGxldCBzdG9yZVZhbHVlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG5cbiAgICAgIHN0b3JlVmFsdWUucHV0KHtoeXBlcnR5OiBoeXBlcnR5VVJMLCBwcm90b1N0dWJVUkw6IG51bGwsXG4gICAgICAgICAgICAgICAgcGVwVVJMOiBudWxsLCBzYW5kYm94VVJMOiBudWxsLCBpZGVudGl0eTogaHlwZXJ0eUlkZW50aXR5fSk7XG5cbiAgICAgIC8vYWRkIHRoZSBoeXBlcnR5IGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbaHlwZXJ0eVVSTF0gPSB7cHJvdG9TdHViVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IG51bGwsIHNhbmRib3hVUkw6IG51bGx9O1xuXG4gICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9hZGQgdG8gdGhlIGxpc3RlbmVyIGluIG1lc3NhZ2VCdXNcbiAgICAgICAgLy9UT0RPIGNoZWNrIGlmIHRob3NlIGFyZSB0aGUgY29ycmVjdCBwYXJhbWV0ZXJzXG4gICAgICAgIF90aGlzLm1lc3NhZ2VCdXMuYWRkTGlzdGVuZXIoaHlwZXJ0eVVSTCArICcvc3RhdHVzJywgaHlwZXJ0eUlkZW50aXR5KTtcbiAgICAgICAgcmVzb2x2ZShoeXBlcnR5VVJMKTtcbiAgICAgIH07XG5cbiAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdIeXBlcnR5IHJlZ2lzdHJhdGlvbiBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyIGh5cGVydHknKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgSHlwZXJ0eVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgdXJsICAgICAgICB1cmxcbiAgKi9cbiAgdW5yZWdpc3Rlckh5cGVydHkodXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJyk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2h5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gZGVsZXRlIEh5cGVydHknKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgdmFyIHJlcXVlc3QyID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLlxuICAgICAgICAgIG9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpLmRlbGV0ZSh1cmwpO1xuXG4gICAgICAgICAgcmVxdWVzdDIub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgaHlwZXJ0eSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG4gICAgICAgICAgICBkZWxldGUgX3RoaXMuaHlwZXJ0aWVzTGlzdFt1cmxdO1xuICAgICAgICAgICAgcmVzb2x2ZSgnSHlwZXJ0eSBkZWxldGUgd2l0aCBzdWNjZXNzJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3QyLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgYW4gSHlwZXJ0eScpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBkZWxldGluZyBhbiBIeXBlcnR5Jyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gZGlzY292ZXIgcHJvdG9jb2wgc3R1YnMgYXZhaWxhYmxlIGluIHRoZSBydW50aW1lIGZvciBhIGNlcnRhaW4gZG9tYWluLiBJZiBhdmFpbGFibGUsIGl0IHJldHVybnMgdGhlIHJ1bnRpbWUgdXJsIGZvciB0aGUgcHJvdG9jb2wgc3R1YiB0aGF0IGNvbm5lY3RzIHRvIHRoZSByZXF1ZXN0ZWQgZG9tYWluLiBSZXF1aXJlZCBieSB0aGUgcnVudGltZSBCVVMgdG8gcm91dGUgbWVzc2FnZXMgdG8gcmVtb3RlIHNlcnZlcnMgb3IgcGVlcnMgKGRvIHdlIG5lZWQgc29tZXRoaW5nIHNpbWlsYXIgZm9yIEh5cGVydGllcz8pLlxuICAqIEBwYXJhbSAge0RvbWFpblVSTH0gICAgICAgICAgIERvbWFpblVSTCAgICAgICAgICAgIHVybFxuICAqIEByZXR1cm4ge1J1bnRpbWVVUkx9ICAgICAgICAgICBSdW50aW1lVVJMXG4gICovXG4gIGRpc2NvdmVyUHJvdG9zdHViKHVybCkge1xuICAgIGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciB1cmwgbmVlZGVkJyk7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQodXJsKTtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdyZXF1ZXN0VXBkYXRlIGNvdWxkblxcJyBnZXQgdGhlIFByb3Rvc3R1YlVSTCcpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdoeXBlcnR5IG5vdCBmb3VuZCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVzb2x2ZShkYXRhLnByb3RvU3R1YlVSTCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdObyBwcm90b3N0dWJVUkwgd2FzIGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZWdpc3RlciBhIG5ldyBQcm90b2NvbCBTdHViIGluIHRoZSBydW50aW1lIGluY2x1ZGluZyBhcyBpbnB1dCBwYXJhbWV0ZXJzIHRoZSBmdW5jdGlvbiB0byBwb3N0TWVzc2FnZSwgdGhlIERvbWFpblVSTCB0aGF0IGlzIGNvbm5lY3RlZCB3aXRoIHRoZSBzdHViLCB3aGljaCByZXR1cm5zIHRoZSBSdW50aW1lVVJMIGFsbG9jYXRlZCB0byB0aGUgbmV3IFByb3RvY29sU3R1Yi5cbiAgICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgRG9tYWluVVJMIHNlcnZpY2UgcHJvdmlkZXIgZG9tYWluXG4gICAqIEByZXR1cm4ge1J1bnRpbWVQcm90b1N0dWJVUkx9XG4gICAqL1xuICByZWdpc3RlclN0dWIoZG9tYWluVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVudGltZVByb3RvU3R1YlVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgaWYgKF90aGlzLm1lc3NhZ2VCdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZWplY3QoJ01lc3NhZ2VCdXMgbm90IGZvdW5kIG9uIHJlZ2lzdGVyU3R1YicpO1xuICAgICAgfVxuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChkb21haW5VUkwpO1xuXG4gICAgICAvL2NoZWNrIGlmIG1lc3NhZ2VCdXMgaXMgcmVnaXN0ZXJlZCBpbiByZWdpc3RyeSBvciBub3RcbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2RvbWFpblVSTCBub3QgZm91bmQnKTtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclByb3Rvc3R1YicpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBydW50aW1lUHJvdG9TdHViVVJMID0gZG9tYWluVVJMICsgJy9wcm90b3N0dWInO1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUHJvdG9zdHViOiBoeXBlcnR5IG5vdCBmb3VuZCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgZGF0YS5wcm90b1N0dWJVUkwgPSBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgICAgICAgbGV0IHJlcXVlc3RVcGRhdGUgPSBvYmplY3RTdG9yZS5wdXQoZGF0YSk7XG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVlc3RVcGRhdGUgZXJyb3I6ICcgKyBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gcmVnaXN0ZXJQRVA6IGVycm9yIG9uIGRhdGFiYXNlJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3RVcGRhdGUub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vdXBkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG5cbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W2RvbWFpblVSTF07XG4gICAgICAgICAgICBsZXQgbmV3SGFzaFZhbHVlID0ge3Byb3RvU3R1YlVSTDogcnVudGltZVByb3RvU3R1YlVSTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVwVVJMOiBoYXNoVmFsdWUucGVwVVJMLCBzYW5kYm94VVJMOiBoYXNoVmFsdWUuc2FuZGJveFVSTH07XG4gICAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W2RvbWFpblVSTF0gPSBuZXdIYXNoVmFsdWU7XG5cbiAgICAgICAgICAgIC8vYWRkIHRvIHRoZSBsaXN0ZW5lciBpbiBtZXNzYWdlQnVzXG4gICAgICAgICAgICAvL1RPRE8gY2hlY2sgaWYgdGhvc2UgYXJlIHRoZSBjb3JyZWN0IHBhcmFtZXRlcnNcbiAgICAgICAgICAgIF90aGlzLm1lc3NhZ2VCdXMuYWRkTGlzdGVuZXIocnVudGltZVByb3RvU3R1YlVSTCArICcvc3RhdHVzJywgZG9tYWluVVJMKTtcblxuICAgICAgICAgICAgcmVzb2x2ZShydW50aW1lUHJvdG9TdHViVVJMKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgaHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclN0dWIoaHlwZXJ0eVJ1bnRpbWVVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2h5cGVydHlSdW50aW1lVVJMIG5vdCBmb3VuZCcpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJTdHViJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWI6IEh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnByb3RvU3R1YlVSTCA9IG51bGw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVxdWVzdFVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyU3R1YjogZXJyb3Igb24gZGF0YWJhc2UnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W2h5cGVydHlSdW50aW1lVVJMXTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IGhhc2hWYWx1ZS5wZXBVUkwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbaHlwZXJ0eVJ1bnRpbWVVUkxdID0gbmV3SGFzaFZhbHVlO1xuICAgICAgICAgICAgcmVzb2x2ZSgnUHJvdG9zdHViVVJMIHJlbW92ZWQnKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyByZWdpc3RlciBhIG5ldyBQb2xpY3kgRW5mb3JjZXIgaW4gdGhlIHJ1bnRpbWUgaW5jbHVkaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgdGhlIGZ1bmN0aW9uIHRvIHBvc3RNZXNzYWdlLCB0aGUgSHlwZXJ0eVVSTCBhc3NvY2lhdGVkIHdpdGggdGhlIFBFUCwgd2hpY2ggcmV0dXJucyB0aGUgUnVudGltZVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBQb2xpY3kgRW5mb3JjZXIgY29tcG9uZW50LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gcG9zdE1lc3NhZ2UgcG9zdE1lc3NhZ2VcbiAgKiBAcGFyYW0gIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMICAgICAgICAgICAgaHlwZXJ0eVxuICAqIEByZXR1cm4ge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMXG4gICovXG4gIHJlZ2lzdGVyUEVQKHBvc3RNZXNzYWdlLCBoeXBlcnR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgaHlwZXJ0eXBlcFVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoaHlwZXJ0eSk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VSTCBub3QgZm91bmQnKTtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBoeXBlcnR5cGVwVVJMID0gaHlwZXJ0eSArICcvcGVwJztcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcblxuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgZGF0YS5wZXBVUkwgPSBoeXBlcnR5cGVwVVJMO1xuXG4gICAgICAgICAgbGV0IHJlcXVlc3RVcGRhdGUgPSBvYmplY3RTdG9yZS5wdXQoZGF0YSk7XG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVlc3RVcGRhdGUgZXJyb3I6ICcgKyBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdXBkYXRlIHJlZ2lzdGVyUEVQJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3RVcGRhdGUub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vdXBkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG4gICAgICAgICAgICBsZXQgaGFzaFZhbHVlID0gX3RoaXMuaHlwZXJ0aWVzTGlzdFtoeXBlcnR5XTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBoYXNoVmFsdWUucHJvdG9TdHViVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IGh5cGVydHlwZXBVUkwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbaHlwZXJ0eV0gPSBuZXdIYXNoVmFsdWU7XG4gICAgICAgICAgICByZXNvbHZlKGh5cGVydHlwZXBVUkwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgcHJvdG9jb2wgc3R1YlxuICAqIEBwYXJhbSAge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMICAgICBIeXBlcnR5UnVudGltZVVSTFxuICAqL1xuICB1bnJlZ2lzdGVyUEVQKEh5cGVydHlSdW50aW1lVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgaHlwZXJ0eXBlcFVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoSHlwZXJ0eVJ1bnRpbWVVUkwpO1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVUkwgbm90IGZvdW5kJyk7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclBFUCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJQRVA6IGh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnBlcFVSTCA9IG51bGw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVxdWVzdFVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyUEVQOiBlcnJvciBvbiB1cGRhdGUgZGFiYXRhc2UnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W0h5cGVydHlSdW50aW1lVVJMXTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBoYXNoVmFsdWUucHJvdG9TdHViVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IG51bGwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbSHlwZXJ0eVJ1bnRpbWVVUkxdID0gbmV3SGFzaFZhbHVlO1xuICAgICAgICAgICAgcmVzb2x2ZSgnIFBFUCBzdWNlc3NmdWxseSBkZWxldGVkJyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gcmVjZWl2ZSBzdGF0dXMgZXZlbnRzIGZyb20gY29tcG9uZW50cyByZWdpc3RlcmVkIGluIHRoZSBSZWdpc3RyeS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9ICAgICBNZXNzYWdlLk1lc3NhZ2UgICAgICAgZXZlbnRcbiAgKi9cbiAgb25FdmVudChldmVudCkge1xuICAgIC8vIFRPRE8gYm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZWdpc3RlciBhIG5ldyBydW50aW1lIHNhbmRib3hlcyBwYXNzaW5nIGFzIGlucHV0IHRoZSBzYW5kYm94IGluc3RhbmNlIGFuZCB0aGUgZG9tYWluIFVSTCBhc3NvY2lhdGVkIHRvIHRoZSBzYW5kYm94IGluc3RhbmNlLlxuICAgKiBAcGFyYW0gIHtEb21haW5VUkx9IERvbWFpblVSTCB1cmxcbiAgICogQHJldHVybiB7UnVudGltZVNhbmRib3hVUkx9XG4gICAqL1xuICByZWdpc3RlclNhbmRib3godXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVudGltZVNhbmRib3hVUkw7XG5cbiAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQodXJsKTtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdyZXF1ZXN0VXBkYXRlIGNvdWxkblxcJyByZWdpc3RlciB0aGUgc2FuZGJveCcpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVUkwgbm90IGZvdW5kJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJ1bnRpbWVTYW5kYm94VVJMID0gdXJsICsgJy9zYW5kYm94JztcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRhdGEuc2FuZGJveFVSTCA9IHJ1bnRpbWVTYW5kYm94VVJMO1xuICAgICAgICAgIGxldCByZXF1ZXN0VXBkYXRlID0gb2JqZWN0U3RvcmUucHV0KGRhdGEpO1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgcmVnaXN0ZXIgdGhlIHNhbmRib3gnKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVlc3RVcGRhdGUgZXJyb3I6ICcgKyBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF07XG4gICAgICAgICAgICBsZXQgbmV3SGFzaFZhbHVlID0ge3Byb3RvU3R1YlVSTDogaGFzaFZhbHVlLnByb3RvU3R1YlVSTCxcbiAgICAgICAgICAgICAgICAgICAgcGVwVVJMOiBoYXNoVmFsdWUucGVwVVJMLCBzYW5kYm94VVJMOiBydW50aW1lU2FuZGJveFVSTH07XG4gICAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF0gPSBuZXdIYXNoVmFsdWU7XG4gICAgICAgICAgICByZXNvbHZlKHJ1bnRpbWVTYW5kYm94VVJMKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gbWF0Y2ggd2FzIGZvdW5kLlxuICAgICAgICAgIHJlamVjdCgnVGhlIGVudHJ5IGRvblxcJ3QgZXhpc3QuJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyByZXNvbHZlKFJ1bnRpbWVTYW5kYm94VVJMKTtcbiAgICAvLyB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIGRpc2NvdmVyIHNhbmRib3hlcyBhdmFpbGFibGUgaW4gdGhlIHJ1bnRpbWUgZm9yIGEgY2VydGFpbiBkb21haW4uIFJlcXVpcmVkIGJ5IHRoZSBydW50aW1lIFVBIHRvIGF2b2lkIG1vcmUgdGhhbiBvbmUgc2FuZGJveCBmb3IgdGhlIHNhbWUgZG9tYWluLlxuICAqIEBwYXJhbSAge0RvbWFpblVSTH0gRG9tYWluVVJMIHVybFxuICAqIEByZXR1cm4ge1J1bnRpbWVTYW5kYm94fSAgICAgICAgICAgUnVudGltZVNhbmRib3hcbiAgKi9cbiAgZ2V0U2FuZGJveCh1cmwpIHtcbiAgICBpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgdXJsIG5lZWRlZCcpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHJ1bnRpbWVVUkwgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF07XG4gICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgZ2V0IHRoZSBzYW5kYm94Jyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VSTCBub3QgZm91bmQnKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc29sdmUoZGF0YS5zYW5kYm94VVJMKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ05vIHNhbmRib3hVUkwgd2FzIGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHZlcmlmeSBpZiBzb3VyY2UgaXMgdmFsaWQgYW5kIHRvIHJlc29sdmUgdGFyZ2V0IHJ1bnRpbWUgdXJsIGFkZHJlc3MgaWYgbmVlZGVkIChlZyBwcm90b3N0dWIgcnVudGltZSB1cmwgaW4gY2FzZSB0aGUgbWVzc2FnZSBpcyB0byBiZSBkaXNwYXRjaGVkIHRvIGEgcmVtb3RlIGVuZHBvaW50KS5cbiAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgdXJsICAgICAgIHVybFxuICAqIEByZXR1cm4ge1Byb21pc2U8VVJMLlVSTD59ICAgICAgICAgICAgICAgICBQcm9taXNlIDxVUkwuVVJMPlxuICAqL1xuICByZXNvbHZlKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL3Jlc29sdmUgdG8gdGhlIHNhbWUgVVJMXG4gICAgICByZXNvbHZlKHVybCk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcbiIsImltcG9ydCBSdW50aW1lVUFDb3JlIGZyb20gJy4vcnVudGltZS9SdW50aW1lVUEnO1xuaW1wb3J0IFNhbmRib3hCYXNlIGZyb20gJy4vc2FuZGJveC9TYW5kYm94JztcblxuLy8gVE9ETzogUmVtb3ZlIHRoaXMgYmVmb3JlIGNvbXBpbGluZ1xuLy8gVGhpcyBpcyBvbmx5IGZvciB0ZXN0aW5nXG4vLyBpbXBvcnQgU2FuZGJveCBmcm9tICcuLi90ZXN0L3NhbmRib3hlcy9TYW5kYm94QnJvd3Nlcic7XG4vLyB2YXIgc2FuZGJveCA9IG5ldyBTYW5kYm94KCk7XG4vLyB3aW5kb3cucnVudGltZSA9IG5ldyBSdW50aW1lVUEoc2FuZGJveCk7XG5cbmV4cG9ydCB2YXIgUnVudGltZVVBID0gUnVudGltZVVBQ29yZTtcbmV4cG9ydCB2YXIgU2FuZGJveCA9IFNhbmRib3hCYXNlO1xuIiwiLy8gdXRpbHNcbmltcG9ydCByZXF1ZXN0IGZyb20gJy4uL3V0aWxzL3JlcXVlc3QnO1xuXG4vLyBNYWluIGRlcGVuZGVjaWVzXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnkvUmVnaXN0cnknO1xuaW1wb3J0IElkZW50aXR5TW9kdWxlIGZyb20gJy4uL2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcbmltcG9ydCBQb2xpY3lFbmdpbmUgZnJvbSAnLi4vcG9saWN5L1BvbGljeUVuZ2luZSc7XG5pbXBvcnQgTWVzc2FnZUJ1cyBmcm9tICcuLi9idXMvTWVzc2FnZUJ1cyc7XG5cbi8qKlxuKiBSdW50aW1lIFVzZXIgQWdlbnQgSW50ZXJmYWNlXG4qL1xuY2xhc3MgUnVudGltZVVBIHtcblxuICBjb25zdHJ1Y3RvcihzYW5kYm94RmFjdG9yeSkge1xuXG4gICAgaWYgKCFzYW5kYm94RmFjdG9yeSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2FuZGJveCBmYWN0b3J5IGlzIGEgbmVlZGVkIHBhcmFtZXRlcicpO1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHBvc3QgYW5kIHJldHVybiByZWdpc3RyeS9oeXBlcnR5UnVudGltZUluc3RhbmNlIHRvIGFuZCBmcm9tIEJhY2stZW5kIFNlcnZpY2VcbiAgICAvLyBmb3IgdGhlIHJlcXVlc3QgeW91IGNhbiB1c2UgdGhlIG1vZHVsZSByZXF1ZXN0IGluIHV0aWxzO1xuICAgIC8vIHRoZSByZXNwb25zZSBpcyBsaWtlOiBoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyM1xuXG4gICAgbGV0IGh5cGVydHlSdW50aW1lVVJMID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzJztcblxuICAgIF90aGlzLnJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KGh5cGVydHlSdW50aW1lVVJMKTtcbiAgICBfdGhpcy5pZGVudGl0eU1vZHVsZSA9IG5ldyBJZGVudGl0eU1vZHVsZSgpO1xuICAgIF90aGlzLnBvbGljeUVuZ2luZSA9IG5ldyBQb2xpY3lFbmdpbmUoKTtcbiAgICBfdGhpcy5tZXNzYWdlQnVzID0gbmV3IE1lc3NhZ2VCdXMoX3RoaXMucmVnaXN0cnkpO1xuXG4gICAgX3RoaXMucmVnaXN0cnkucmVnaXN0ZXJNZXNzYWdlQnVzKF90aGlzLm1lc3NhZ2VCdXMpO1xuXG4gICAgc2FuZGJveEZhY3RvcnkubWVzc2FnZUJ1cyA9IF90aGlzLm1lc3NhZ2VCdXM7XG4gICAgX3RoaXMuc2FuZGJveEZhY3RvcnkgPSBzYW5kYm94RmFjdG9yeTtcblxuICAgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGV2ZW50IGxpc3RlbmVyLCBvbmx5IGZvciB0ZXN0aW5nXG4gICAgbGV0IGh5cGVydHlSdW50aW1lVVJMU3RhdHVzID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzL3N0YXR1cyc7XG4gICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihoeXBlcnR5UnVudGltZVVSTFN0YXR1cywgKG1zZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2UgYnVzIHN0YXR1cyByZXNwb25zZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKCdydW50aW1lOi9hbGljZScsIChtc2cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGJ1cyBhbGljZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKCdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyMycsIChtc2cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGJ1cyByZXNwb25zZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIEFjY29tb2RhdGUgaW50ZXJvcGVyYWJpbGl0eSBpbiBIMkggYW5kIHByb3RvIG9uIHRoZSBmbHkgZm9yIG5ld2x5IGRpc2NvdmVyZWQgZGV2aWNlcyBpbiBNMk1cbiAgKiBAcGFyYW0gIHtDYXRhbG9ndWVEYXRhT2JqZWN0Lkh5cGVydHlEZXNjcmlwdG9yfSAgIGRlc2NyaXB0b3IgICAgZGVzY3JpcHRvclxuICAqL1xuICBkaXNjb3ZlckhpcGVydHkoZGVzY3JpcHRvcikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIEh5cGVydHkgZGVwbG95ZWQgYnkgdGhlIEFwcCB0aGF0IGlzIHBhc3NlZCBhcyBpbnB1dCBwYXJhbWV0ZXIuIFRvIGJlIHVzZWQgd2hlbiBBcHAgYW5kIEh5cGVydGllcyBhcmUgZnJvbSB0aGUgc2FtZSBkb21haW4gb3RoZXJ3aXNlIHRoZSBSdW50aW1lVUEgd2lsbCByYWlzZSBhbiBleGNlcHRpb24gYW5kIHRoZSBBcHAgaGFzIHRvIHVzZSB0aGUgbG9hZEh5cGVydHkoLi4pIGZ1bmN0aW9uLlxuICAqIEBwYXJhbSAge09iamVjdH0gT2JqZWN0ICAgICAgICAgICAgICAgICAgIGh5cGVydHlJbnN0YW5jZVxuICAqIEBwYXJhbSAge1VSTC5IeXBlcnR5Q2F0YWxvZ3VlVVJMfSAgICAgICAgIGRlc2NyaXB0b3IgICAgICBkZXNjcmlwdG9yXG4gICovXG4gIHJlZ2lzdGVySHlwZXJ0eShoeXBlcnR5SW5zdGFuY2UsIGRlc2NyaXB0b3IpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgKiBEZXBsb3kgSHlwZXJ0eSBmcm9tIENhdGFsb2d1ZSBVUkxcbiAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICBoeXBlcnR5IGh5cGVydHlJbnN0YW5jZSB1cmw7XG4gICovXG4gIGxvYWRIeXBlcnR5KGh5cGVydHkpIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIWh5cGVydHkpIHRocm93IG5ldyBFcnJvcignSHlwZXJ0eSBkZXNjcmlwdG9yIHVybCBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBfaHlwZXJ0eVNhbmRib3g7XG4gICAgICBsZXQgX2h5cGVydHlEZXNjcmlwdG9yO1xuICAgICAgbGV0IF9oeXBlcnR5U291cmNlQ29kZTtcbiAgICAgIGxldCBfaHlwZXJ0eUNvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAgIHVybDogJ3dzOi8vbG9jYWxob3N0OjkwOTAvd3MnLFxuICAgICAgICBydW50aW1lVVJMOiAncnVudGltZTovYWxpY2UnXG4gICAgICB9O1xuXG4gICAgICBsZXQgZXJyb3JSZWFzb24gPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ0h5cGVydHkgRXJyb3I6JywgcmVhc29uKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9O1xuXG4gICAgICAvLyBHZXQgSHlwZXJ0eSBkZXNjcmlwdG9yXG4gICAgICByZXR1cm4gcmVxdWVzdC5nZXQoaHlwZXJ0eSkudGhlbihmdW5jdGlvbihoeXBlcnR5RGVzY3JpcHRvcikge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnMTogcmV0dXJuIGh5cGVydHkgZGVzY3JpcHRvcicpO1xuXG4gICAgICAgIF9oeXBlcnR5RGVzY3JpcHRvciA9IGh5cGVydHlEZXNjcmlwdG9yO1xuXG4gICAgICAgIC8vIFRPRE86IFVwZGF0ZSB0aGlzIHZhcmlhYmxlcyB3aXRoIHJlc3VsdCBvZiB0aGUgcmVxdWVzdFxuICAgICAgICAvLyBUaGlzIHZhbHVlcyBhcmUgb25seSBmb3IgdGVzdGVzLCBzaG91bGQgYmUgcmVtb3ZlZDtcbiAgICAgICAgbGV0IGh5cGVydHlTb3VyY2VDb2RlVXJsID0gJ2Rpc3QvVmVydHhQcm90b1N0dWIuanMnO1xuXG4gICAgICAgIC8vIEdldCB0aGUgaHlwZXJ0eSBzb3VyY2UgY29kZVxuICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoaHlwZXJ0eVNvdXJjZUNvZGVVcmwpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGh5cGVydHlTb3VyY2VDb2RlKSB7XG5cbiAgICAgICAgY29uc29sZS5pbmZvKCcyOiByZXR1cm4gaHlwZXJ0eSBzb3VyY2UgY29kZScpO1xuICAgICAgICBfaHlwZXJ0eVNvdXJjZUNvZGUgPSBoeXBlcnR5U291cmNlQ29kZTtcblxuICAgICAgICAvLyBUT0RPOiByZW1vdmUgb3IgdXBkYXRlIHRoaXMgbWVzc2FnZSwgYmVjYXVzZSB3ZSBkb24ndCBub3cgaWYgdGhlIHJlZ2lzdGVySHlwZXJ0eSBoYXZlIGEgbWVzc2FnZUJ1cyBpbnN0YW5jZSBvciBhbiBtZXNzYWdlIG9iamVjdDtcbiAgICAgICAgbGV0IG1lc3NhZ2UgPSB7XG4gICAgICAgICAgYm9keToge1xuICAgICAgICAgICAgdmFsdWU6ICdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyMydcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgaHlwZXJ0eTtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVySHlwZXJ0eShtZXNzYWdlLCBfaHlwZXJ0eURlc2NyaXB0b3IpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGh5cGVydHlVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCczOiByZXR1cm4gaHlwZXJ0eSB1cmwsIGFmdGVyIHJlZ2lzdGVyIGh5cGVydHknKTtcblxuICAgICAgICBsZXQgaW5TYW1lU2FuZGJveCA9IHRydWU7XG5cbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIGFwcCBhbmQgaHlwZXJ0eSBpcyBpbiB0aGUgc2FtZSBzYW5kYm94IGFuZFxuICAgICAgICBpZiAoaW5TYW1lU2FuZGJveCkge1xuICAgICAgICAgIC8vIFRPRE86IGdldEFwcFNhbmRib3gsIHRoaXMgd2lsbCByZXR1cm4gYSBwcm9taXNlO1xuXG4gICAgICAgICAgaWYgKCFfaHlwZXJ0eVNhbmRib3gpIHtcbiAgICAgICAgICAgIF9oeXBlcnR5U2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZUFwcFNhbmRib3goKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3guZGVwbG95Q29tcG9uZW50KF9oeXBlcnR5U291cmNlQ29kZSwgaHlwZXJ0eVVSTCwgX2h5cGVydHlDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZXRIeXBlcnR5U2FuZGJveCwgdGhpcyB3aWxsIHJldHVybiBhIHByb21pc2U7XG5cbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3ggPSBfdGhpcy5zYW5kYm94RmFjdG9yeS5jcmVhdGVTYW5kYm94KCk7XG4gICAgICAgICAgX2h5cGVydHlTYW5kYm94LmRlcGxveUNvbXBvbmVudChfaHlwZXJ0eVNvdXJjZUNvZGUsIGh5cGVydHlVUkwsIGh5cGVydHlDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihzYW5kYm94SW5zdGFuY2UpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc0OiByZXR1cm4gdGhlIHNhbmRib3ggaW5zdGFuY2UgYWZ0ZXIgY2hlY2sgaWYgaXMgaW4gdGhlIHNhbWUgc2FuZGJveCBvciBub3QnKTtcblxuICAgICAgICAvL3Jlc29sdmUoe2NvZGU6IHNvdXJjZUNvZGUsIGh5cGVydHlVUkw6IGh5cGVydHlVUkwsIGh5cGVydHlDb25maWd1cmF0aW9uOiBoeXBlcnR5Q29uZmlndXJhdGlvbiwgbWVzc2FnZUJ1czogX3RoaXMubWVzc2FnZUJ1c30pO1xuXG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNTogcmV0dXJuIGRlcGxveSBjb21wb25lbnQgZm9yIHNhbmRib3ggc3RhdHVzJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yUmVhc29uKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBEZXBsb3kgU3R1YiBmcm9tIENhdGFsb2d1ZSBVUkwgb3IgZG9tYWluIHVybFxuICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICBkb21haW4gICAgICAgICAgZG9tYWluXG4gICovXG4gIGxvYWRTdHViKGRvbWFpbikge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghZG9tYWluKSB0aHJvdyBuZXcgRXJyb3IoJ2RvbWFpbiBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBzdHViRGVzY3JpcHRvcjtcblxuICAgICAgLy8gVE9ETzogdGVtcG9yYXJ5IGFkZHJlc3MgdGhpcyBvbmx5IHN0YXRpYyBmb3IgdGVzdGluZ1xuICAgICAgbGV0IHN0dWJVUkwgPSAnaHlwZXJ0eS1ydW50aW1lOi8vc3AxL3Byb3Rvc3R1Yi8xMjMnO1xuICAgICAgbGV0IGNvbXBvbmVudERvd25sb2FkVVJMID0gJ2Rpc3QvVmVydHhQcm90b1N0dWIuanMnO1xuICAgICAgbGV0IGNvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAgIHVybDogJ3dzOi8vbG9jYWxob3N0OjkwOTAvd3MnLFxuICAgICAgICBydW50aW1lVVJMOiAncnVudGltZTovYWxpY2UnXG4gICAgICB9O1xuXG4gICAgICBsZXQgc3R1YlNhbmRib3g7XG4gICAgICBsZXQgcnVudGltZVNhbmRib3hVUkw7XG4gICAgICBsZXQgcnVudGltZVByb3RvU3R1YlVSTDtcbiAgICAgIGxldCBwcm90b1N0dWJTb3VyY2VDb2RlO1xuXG4gICAgICAvLyBEaXNjb3ZlciBQcm90b2NvbCBTdHViXG4gICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnkuZGlzY292ZXJQcm90b3N0dWIoZG9tYWluKS50aGVuKGZ1bmN0aW9uKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgLy8gSXMgcmVnaXN0ZWQ/XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMS4gUHJvdG8gU3R1YiBEaXNjb3ZlcmVkOiAnLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgc3R1YkRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xuICAgICAgICByZXR1cm4gc3R1YkRlc2NyaXB0b3I7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gaXMgbm90IHJlZ2lzdGVkP1xuICAgICAgICBjb25zb2xlLmluZm8oJzEuIFByb3RvIFN0dWIgbm90IGZvdW5kOicsIHJlYXNvbik7XG5cbiAgICAgICAgLy8gVE9ETzogZ2V0IHByb3Rvc3R1YiB8IDxzcC1kb21haW4+Ly53ZWxsLWtub3duL3Byb3Rvc3R1YlxuICAgICAgICAvLyBmb3IgdGhlIHJlcXVlc3QgeW91IGNhbiB1c2UgdGhlIG1vZHVsZSByZXF1ZXN0IGluIHV0aWxzO1xuICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihkZXNjcmlwdG9yKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMi4gcmV0dXJuIHRoZSBQcm90b1N0dWIgZGVzY3JpcHRvcjonLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgc3R1YkRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xuXG4gICAgICAgIC8vIEdldCB0aGUgY29tcG9uZW50IHNvdXJjZSBjb2RlIHJlZmVyZW50IHRvIGNvbXBvbmVudCBkb3dubG9hZCB1cmw7XG4gICAgICAgIHJldHVybiByZXF1ZXN0LmdldChjb21wb25lbnREb3dubG9hZFVSTCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocHJvdG9TdHViU291cmNlQ29kZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzMuIHJldHVybiB0aGUgUHJvdG9TdHViIFNvdXJjZSBDb2RlOiAnKTtcbiAgICAgICAgcHJvdG9TdHViU291cmNlQ29kZSA9IHByb3RvU3R1YlNvdXJjZUNvZGU7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVyU3R1Yihkb21haW4pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJ1bnRpbWVQcm90b1N0dWJVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc0LiByZXR1cm4gdGhlIHJ1bnRpbWVQcm90b1N0dWJVUkwsIEFmdGVyIFJlZ2lzdGVyIFN0dWInKTtcbiAgICAgICAgcnVudGltZVByb3RvU3R1YlVSTCA9IHJ1bnRpbWVQcm90b1N0dWJVUkw7XG5cbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgb24gUEVQIChwb2xpY3kgRW5naW5lKSBpZiB3ZSBuZWVkIHRoZSBzYW5kYm94IGFuZCBjaGVjayBpZiB0aGUgU2FuZGJveCBGYWN0b3J5IGhhdmUgdGhlIGNvbnRleHQgc2FuZGJveDtcbiAgICAgICAgLy8gSW5zdGFudGlhdGUgdGhlIFNhbmRib3hcbiAgICAgICAgc3R1YlNhbmRib3ggPSBfdGhpcy5zYW5kYm94RmFjdG9yeS5jcmVhdGVTYW5kYm94KCk7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVyU2FuZGJveChzdHViU2FuZGJveCwgZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihydW50aW1lU2FuZGJveFVSTCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzU6IHJldHVybiB0aGUgc2FuZGJveCBydW50aW1lIHVybCcpO1xuXG4gICAgICAgIC8vIERlcGxveSBDb21wb25lbnRcbiAgICAgICAgcmV0dXJuIHN0dWJTYW5kYm94LmRlcGxveUNvbXBvbmVudChwcm90b1N0dWJTb3VyY2VDb2RlLCBydW50aW1lU2FuZGJveFVSTCwgY29uZmlndXJhdGlvbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNjogcmV0dXJuIGRlcGxveSBjb21wb25lbnQgZm9yIHNhbmRib3ggc3RhdHVzJyk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBtZXNzYWdlIGJ1cyBsaXN0ZW5lclxuICAgICAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKHJ1bnRpbWVQcm90b1N0dWJVUkwsIHN0dWJTYW5kYm94KTtcblxuICAgICAgICAvLyBIYW5kbGUgd2l0aCBkZXBsb3llZCBjb21wb25lbnRcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbXBvbmVudCBpcyBkZXBsb3llZCcpO1xuXG4gICAgICAgIC8vIExvYWQgU3R1YiBmdW5jdGlvbiByZXNvbHZlZCB3aXRoIHN1Y2Nlc3M7XG4gICAgICAgIHJlc29sdmUoJ1N0dWIgc3VjY2Vzc2Z1bGx5IGxvYWRlZCcpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgY29uc29sZS5sb2coJ1JlYXNvbjonLCByZWFzb24pO1xuICAgICAgfSk7XG5cbiAgICB9KTtcblxuICB9XG5cbiAgLyoqXG4gICogVXNlZCB0byBjaGVjayBmb3IgdXBkYXRlcyBhYm91dCBjb21wb25lbnRzIGhhbmRsZWQgaW4gdGhlIENhdGFsb2d1ZSBpbmNsdWRpbmcgcHJvdG9jb2wgc3R1YnMgYW5kIEh5cGVydGllcy4gY2hlY2sgcmVsYXRpb25zaGlwIHdpdGggbGlmZWN5Y2xlIG1hbmFnZW1lbnQgcHJvdmlkZWQgYnkgU2VydmljZSBXb3JrZXJzXG4gICogQHBhcmFtICB7Q2F0YWxvZ3VlVVJMfSAgICAgICB1cmwgdXJsXG4gICovXG4gIGNoZWNrRm9yVXBkYXRlKHVybCkge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bnRpbWVVQTtcbiIsIi8qKlxuICogSW1wbGVtZW50cyB0aGUgU2FuZGJveCBpbnRlcmZhY2UgdG8gcHJvdGVjdCBhbGwgZXh0ZXJuYWwgY29kZTtcbiAqL1xuY2xhc3MgU2FuZGJveEJhc2Uge1xuXG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2VCdXMpIHtcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyBkb3dubG9hZCBhbmQgZGVwbG95IGEgbmV3IGNvbXBvbmVudCBpbiB0aGUgc2FuZGJveCBwYXNzaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgdGhlIHVybCBmcm9tIHdoZXJlIHRoZSBjb21wb25lbnRzIGlzIGRvd25sb2FkZWQsIHRoZSBjb21wb25lbnRVUkwgYWRkcmVzcyBwcmV2aW91c2x5IGFsbG9jYXRlZCB0byB0aGUgY29tcG9uZW50IGFuZCBpdHMgY29uZmlndXJhdGlvbi5cbiAgICogQHBhcmFtICB7VVJMLlVSTH0gICAgICAgIGNvbXBvbmVudERvd25sb2FkVVJMICAgICAgU291cmNlY29kZSBDb21wb25lbnQgYWRkcmVzcyB1cmxcbiAgICogQHBhcmFtICB7VVJMLlVSTH0gICAgICAgIGNvbXBvbmVudFVSTCAgICAgICAgICAgICAgQ29tcG9uZW50IGFkZHJlc3MgdXJsO1xuICAgKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgY29uZmlndXJhdGlvbiAgICAgICAgICAgICBDb25maWd1cmF0aW9uIG9iamVjdDtcbiAgICovXG4gIGRlcGxveUNvbXBvbmVudChjb21wb25lbnRTb3VyY2VDb2RlLCBjb21wb25lbnRVUkwsIGNvbmZpZ3VyYXRpb24pIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFRvIHJlbW92ZSBhIGNvbXBvbmVudCBmcm9tIHRoZSBzYW5kYm94IHBhc3NpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyBpdHMgVVJMLlxuICAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICAgICAgY29tcG9uZW50VVJMICAgICAgICAgICAgICBDb21wb25lbnQgYWRkcmVzcyB1cmw7XG4gICAqL1xuICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50VVJMKSB7XG5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhbmRib3hCYXNlO1xuIiwiLyoqXG4gICogTWFrZSBhamF4IHJlcXVlc3RcbiAgKi9cbmNsYXNzIFJlcXVlc3Qge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgbWV0aG9kcyA9IHtnZXQ6ICdHRVQnLCBwb3N0OiAnUE9TVCcsIGRlbGV0ZTogJ0RFTEVURScsIHB1dDogJ1BVVCd9O1xuXG4gICAgT2JqZWN0LmtleXMobWV0aG9kcykuZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIF90aGlzW21ldGhvZF0gPSBmdW5jdGlvbih1cmwsIHBhcmFtcywgaGVhZGVycykge1xuICAgICAgICByZXR1cm4gX3RoaXMubWFrZVJlcXVlc3QobWV0aG9kc1ttZXRob2RdLCB1cmwsIHBhcmFtcywgaGVhZGVycyk7XG4gICAgICB9O1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBNYWtlIGFqYXggcmVxdWVzdFxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgbWV0aG9kICB0aGUgQ1JVRCBtZXRob2QgKGdldCwgcG9zdCwgcHV0LCBkZWxldGUpXG4gICAqIEBwYXJhbSAge3N0cmluZ30gICB1cmwgICAgIHRoZSB1cmwgcmVxdWVzdGVkIHRvIG9idGFpbiBhbiByZXNwb25zZVxuICAgKiBAcGFyYW0gIHtvYmplY3R9ICAgcGFyYW1zICBwYXNzIHRoZSBwYXJhbWV0ZXJzIHRvIHJlcXVlc3RcbiAgICogQHBhcmFtICB7b2JqZWN0fSAgIGhlYWRlcnMgc2V0IHJlcXVlc3QgaGVhZGVyc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAqL1xuICBtYWtlUmVxdWVzdChtZXRob2QsIHVybCwgcGFyYW1zLCBoZWFkZXJzKSB7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBsZXQgaHR0cFJlcXVlc3Q7XG5cbiAgICAgIGlmICh3aW5kb3cuWE1MSHR0cFJlcXVlc3QpIHsgLy8gTW96aWxsYSwgU2FmYXJpLCAuLi5cbiAgICAgICAgaHR0cFJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgIH0gZWxzZSBpZiAod2luZG93LkFjdGl2ZVhPYmplY3QpIHsgLy8gSUVcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBodHRwUmVxdWVzdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNc3htbDIuWE1MSFRUUCcpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGh0dHBSZXF1ZXN0ID0gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFodHRwUmVxdWVzdCkge1xuICAgICAgICByZWplY3QoJ0dpdmluZyB1cCA6KCBDYW5ub3QgY3JlYXRlIGFuIFhNTEhUVFAgaW5zdGFuY2UnKTtcbiAgICAgIH1cblxuICAgICAgaHR0cFJlcXVlc3Qub3BlbihtZXRob2QsIHVybCk7XG5cbiAgICAgIC8vIFNldCBoZWFkZXJzIHRvIHJlcXVlc3RcbiAgICAgIGlmIChoZWFkZXJzKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKGhlYWRlcnMpLmZvckVhY2goZnVuY3Rpb24oaGVhZGVyKSB7XG4gICAgICAgICAgaHR0cFJlcXVlc3Quc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBodHRwUmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgaHR0cFJlcXVlc3QgPSBldmVudC5jdXJyZW50VGFyZ2V0O1xuXG4gICAgICAgIGlmIChodHRwUmVxdWVzdC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgaWYgKGh0dHBSZXF1ZXN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgICByZXNvbHZlKGh0dHBSZXF1ZXN0LnJlc3BvbnNlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVqZWN0KGh0dHBSZXF1ZXN0LnJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIElmIGhhdmUgcGFyYW1zIHNlbmQgdGhlbSwgaW4gc3RyaW5nIGZvcm1hdFxuICAgICAgaHR0cFJlcXVlc3Quc2VuZChwYXJhbXMpO1xuXG4gICAgfSk7XG5cbiAgfVxuXG59XG5cbnZhciByZXF1ZXN0ID0gbmV3IFJlcXVlc3QoKTtcbmV4cG9ydCBkZWZhdWx0IHJlcXVlc3Q7XG4iXX0=
