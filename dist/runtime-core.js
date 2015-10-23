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
          /*console.log('key: ' + cursor.key + ' protoStubURL ' + cursor.value.protoStubURL +
          ' pepURL ' + cursor.value.pepURL + ' sandboxURL ' + cursor.value.sandboxURL);*/
          _this.hypertiesList[cursor.key] = { protoStubURL: cursor.value.protoStubURL,
            pepURL: cursor.value.pepURL, sandboxURL: cursor.value.sandboxURL };
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

      //populate with the runtimeURL provided
      objectStore.put({ hyperty: _this.runtimeURL, protoStubURL: null,
        pepURL: null, sandboxURL: null });
    };
  }

  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Message.Message}     postMessage           postMessage
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
  * @return {HypertyURL}          HypertyURL
  */

  _createClass(Registry, [{
    key: 'registerHyperty',
    value: function registerHyperty(postMessage, descriptor) {
      var _this = this;

      // assuming the hyperty name come in the body of the message
      // this is a very simple way to do it, just for test
      var HypertyURL = postMessage.body.value;

      var promise = new Promise(function (resolve, reject) {

        var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
        var storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);

        storeValue.put({ hyperty: HypertyURL, protoStubURL: null,
          pepURL: null, sandboxURL: null });

        //add the hyperty in the hypertiesList hash table
        _this.hypertiesList[HypertyURL] = { protoStubURL: null,
          pepURL: null, sandboxURL: null };

        transaction.oncomplete = function (event) {
          //console.log('Hyperty registered with success');
          resolve(HypertyURL);
        };

        transaction.onerror = function (event) {
          console.error('Hyperty registration error: ' + event.target.errorCode);
          reject('Error on register hyperty');
        };
      });

      //TODO implement the associate to Idetity

      //TODO allocate address for the new Hyperty Instance

      //TODO register Hyperty at SP1 Registry

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

        var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
        var request = objectStore.get(domainURL);

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
              resolve(runtimeProtoStubURL);
            };
          }
        };
      });

      //TODO call the addListener function in Msg BUS

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
        var _hypertyConfiguration = {};

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
              value: 'hyperty-runtime://sp1/protostub/123/'
            }
          };

          console.log(_hypertySourceCode);

          // Register hyperty;
          return _this.registry.registerHyperty(message, _hypertyDescriptor);
        }).then(function (hypertyURL) {
          console.info('3: return hyperty url, after register hyperty');

          var inSameSandbox = true;

          // TODO: Check if the app and hyperty is in the same sandbox and
          if (inSameSandbox) {
            // TODO: getAppSandbox, this will return a promise;

            _hypertySandbox = _this.sandboxFactory.createAppSandbox();
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

          resolve({ code: sourceCode, hypertyURL: hypertyURL, hypertyConfiguration: hypertyConfiguration, messageBus: _this.messageBus });
        }).then(function (result) {
          console.info('6: return deploy component for sandbox status');
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NZXNzYWdlQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9pZGVudGl0eS9JZGVudGl0eU1vZHVsZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcG9saWN5L1BvbGljeUVuZ2luZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcmVnaXN0cnkvUmVnaXN0cnkuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3J1bnRpbWUtY29yZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcnVudGltZS9SdW50aW1lVUEuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3gvU2FuZGJveC5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvdXRpbHMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDSU0sVUFBVTs7Ozs7OztBQVFILFdBUlAsVUFBVSxDQVFGLFFBQVEsRUFBRTswQkFSbEIsVUFBVTs7QUFTWixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpC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O0FBRXRDLGNBQUksV0FBVyxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7QUFDaEMsZ0JBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7O0FBRTlCLHFCQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQy9CLE1BQU07QUFDTCxvQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtXQUNGO1NBQ0YsQ0FBQzs7O0FBR0YsbUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FFMUIsQ0FBQyxDQUFDO0tBRUo7OztTQS9FRyxPQUFPOzs7QUFtRmIsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztxQkFDYixPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImV4cG9ydCBkZWZhdWx0XG4vKipcbiogTWVzc2FnZSBCVVMgSW50ZXJmYWNlXG4qL1xuY2xhc3MgTWVzc2FnZUJ1cyB7XG4gIC8qIHByaXZhdGVcbiAgX3JlZ2lzdHJ5OiBSZWdpc3RyeVxuXG4gIF9zdWJzY3JpcHRpb25zOiA8c3RyaW5nOiBNc2dMaXN0ZW5lcltdPlxuICBfaW50ZXJjZXB0b3JzOiA8c3RyaW5nOiBNc2dMaXN0ZW5lcltdPlxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHJlZ2lzdHJ5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9yZWdpc3RyeSA9IHJlZ2lzdHJ5O1xuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG4gICAgX3RoaXMuX2ludGVyY2VwdG9ycyA9IHt9O1xuXG4gIH1cblxuICAvKipcbiAgKiBUbyBhZGQgXCJsaXN0ZW5lclwiIGZ1bmN0aW9ucyB0byBiZSBjYWxsZWQgd2hlbiByb3V0aW5nIG1lc3NhZ2VzIHB1Ymxpc2hlZCBvbiBhIGNlcnRhaW4gXCJyZXNvdXJjZVwiIG9yIHNlbmQgdG8gYSBjZXJ0YWluIHVybC4gTWVzc2FnZXMgYXJlIHJvdXRlZCB0byBpbnB1dCBwYXJhbWV0ZXIgXCJyZWRpcmVjdFRvXCIgaW4gY2FzZSBsaXN0ZW5lciBpcyBub3QgaW4gdGhlIENvcmUgUnVudGltZS4gVGhpcyBmdW5jdGlvbiBpcyBvbmx5IGFjY2Vzc2libGUgYnkgaW50ZXJuYWwgQ29yZSBDb21wb25lbnRzLiBUbyByZW1vdmUgdGhlIGxpc3RlbmVyIGp1c3QgY2FsbCByZW1vdmUoKSBmdW5jdGlvbiBmcm9tIHJldHVybmVkIG9iamVjdC5cbiAgKiBAcGFyYW0ge1VSTC5VUkx9IHVybCAgICAgIHVybFxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyIGxpc3RlbmVyXG4gICogQHBhcmFtIHtVUkwuVVJMfSByZWRpcmVjdFRvICAgcmVkaXJlY3RUb1xuICAqL1xuICBhZGRMaXN0ZW5lcih1cmwsIGxpc3RlbmVyLCByZWRpcmVjdFRvKSB7XG4gICAgLy9UT0RPOiBpbmNsdWRlIGNvZGUgZm9yIHRhcmdldCByZWRpcmVjdGlvbi4uLlxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgaXRlbSA9IG5ldyBNc2dMaXN0ZW5lcihfdGhpcy5fc3Vic2NyaXB0aW9ucywgdXJsLCBsaXN0ZW5lcik7XG4gICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXTtcbiAgICBpZiAoIWl0ZW1MaXN0KSB7XG4gICAgICBpdGVtTGlzdCA9IFtdO1xuICAgICAgX3RoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXSA9IGl0ZW1MaXN0O1xuICAgIH1cblxuICAgIGl0ZW1MaXN0LnB1c2goaXRlbSk7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICAvKipcbiAgKiBUbyBhZGQgYW4gaW50ZXJjZXB0b3IgKGVnIGEgUG9saWN5IEVuZm9yY2VyKSB3aGljaCBcImxpc3RlbmVyXCIgZnVuY3Rpb24gaXMgY2FsbGVkIHdoZW4gcm91dGluZyBtZXNzYWdlcyBwdWJsaXNoZWQgb24gXCJpbnRlcmNlcHRlZFVSTFwiIG9yIHNlbmQgdG8gdGhlIFwiaW50ZXJjZXB0ZWRVUkxcIi4gVG8gYXZvaWQgaW5maW5pdGUgY3ljbGVzIG1lc3NhZ2VzIG9yaWdpbmF0ZWQgd2l0aCBmcm9tIFwiaW50ZXJjZXB0b3JVUkxcIiBhcmUgbm90IGludGVyY2VwdGVkLiBUbyByZW1vdmUgdGhlIGludGVyY2VwdG9yIGp1c3QgY2FsbCByZW1vdmUoKSBmdW5jdGlvbiBmcm9tIHJldHVybmVkIG9iamVjdC4gVGhpcyBmdW5jdGlvbiBpcyBvbmx5IGFjY2Vzc2libGUgYnkgaW50ZXJuYWwgQ29yZSBDb21wb25lbnRzLlxuICAqIEBwYXJhbSB7VVJMLlVSTH0gaW50ZXJjZXB0ZWRVUkwgaW50ZXJjZXB0ZWRVUkxcbiAgKiBAcGFyYW0ge0xpc3RlbmVyfSBsaXN0ZW5lciAgICAgICBsaXN0ZW5lclxuICAqIEBwYXJhbSB7VVJMLlVSTH0gaW50ZXJjZXB0b3JVUkwgaW50ZXJjZXB0b3JVUkxcbiAgKiBAcmV0dXJuIHtJbnRlcmNlcHRvcn0gICAgICAgICAgICAgICAgIEludGVyY2VwdG9yXG4gICovXG4gIGFkZEludGVyY2VwdG9yKGludGVyY2VwdGVkVVJMLCBsaXN0ZW5lciwgaW50ZXJjZXB0b3JVUkwpIHtcbiAgICAvL1RPRE86IGluY2x1ZGUgY29kZSBmb3IgaW50ZXJjZXB0b3JVUkwuLi5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGl0ZW0gPSBuZXcgTXNnTGlzdGVuZXIoX3RoaXMuX2ludGVyY2VwdG9ycywgaW50ZXJjZXB0ZWRVUkwsIGxpc3RlbmVyKTtcbiAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5faW50ZXJjZXB0b3JzW2ludGVyY2VwdGVkVVJMXTtcbiAgICBpZiAoIWl0ZW1MaXN0KSB7XG4gICAgICBpdGVtTGlzdCA9IFtdO1xuICAgICAgX3RoaXMuX2ludGVyY2VwdG9yc1tpbnRlcmNlcHRlZFVSTF0gPSBpdGVtTGlzdDtcbiAgICB9XG5cbiAgICBpdGVtTGlzdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICogVG8gc2VuZCBtZXNzYWdlcy4gVGhpcyBmdW5jdGlvbiBpcyBhY2Nlc3NpYmxlIG91dHNpZGUgdGhlIENvcmUgcnVudGltZVxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gbXNnIG1zZ1xuICAqL1xuICBwb3N0TWVzc2FnZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy92ZXJpZnkgaW50ZXJjZXB0ZWRVUkxcbiAgICAvL1RPRE86IGludGVyY2VwdCBVUkwgaXMgY2hlY2tlZCB0byBleGl0PyBvciBpbnRvIHRoZSBcIm9uTWVzc2FnZVwiP1xuICAgIC8vaWYobXNnLmhlYWRlci50bylcblxuICAgIC8vcmVzb2x2ZSBwcm90b3N0dWIgVVJMXG4gICAgX3RoaXMuX3JlZ2lzdHJ5LnJlc29sdmUobXNnLmhlYWRlci50bykudGhlbigocHJvdG9TdHViVVJMKSA9PiB7XG4gICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1twcm90b1N0dWJVUkxdO1xuICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgIGl0ZW1MaXN0LmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgICAgIHN1Yi5fY2FsbGJhY2sobXNnKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coJ1BST1RPLVNUVUItRVJST1I6ICcsIGUpO1xuICAgIH0pO1xuICB9XG59XG5cbmNsYXNzIE1zZ0xpc3RlbmVyIHtcbiAgLyogcHJpdmF0ZVxuICBfc3Vic2NyaXB0aW9uczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT47XG4gIF91cmw6IHN0cmluZztcbiAgX2NhbGxiYWNrOiAobXNnKSA9PiB2b2lkO1xuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbnMsIHVybCwgY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSBzdWJzY3JpcHRpb25zO1xuICAgIF90aGlzLl91cmwgPSB1cmw7XG4gICAgX3RoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsOyB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgc3VicyA9IF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgIGlmIChzdWJzKSB7XG4gICAgICBsZXQgaW5kZXggPSBzdWJzLmluZGV4T2YoX3RoaXMpO1xuICAgICAgc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxufVxuIiwiLyoqXG4gKiBGdW5jdGlvbnMgdG8gZGVhbCB3aXRoIGFzc2VydGlvbnMgY29tcGxpYW50IHdpdGggV2ViUlRDIFJUQ0lkZW50aXR5UHJvdmlkZXJcbiAqL1xuY2xhc3MgSWRlbnRpdHlNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBHZW5lcmF0ZXMgYW4gSWRlbnRpdHkgQXNzZXJ0aW9uXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gY29udGVudHMgICAgIGNvbnRlbnRzXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gb3JpZ2luICAgICAgIG9yaWdpblxuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IHVzZXJuYW1lSGludCB1c2VybmFtZUhpbnRcbiAgICogQHJldHVybiB7SWRBc3NlcnRpb259ICAgICAgICAgICAgICBJZEFzc2VydGlvblxuICAgKi9cbiAgZ2VuZXJhdGVBc3NlcnRpb24oY29udGVudHMsIG9yaWdpbiwgdXNlcm5hbWVIaW50KSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIFZhbGlkYXRlcyBhbiBJZGVudGl0eSBBc3NlcnRpb25cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBhc3NlcnRpb24gYXNzZXJ0aW9uXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gb3JpZ2luICAgIG9yaWdpblxuICAgKi9cbiAgdmFsaWRhdGVBc3NlcnRpb24oYXNzZXJ0aW9uLCBvcmlnaW4pIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBJZGVudGl0eU1vZHVsZTtcbiIsIi8qKlxuICogQ29yZSBQb2xpY3kgRW5naW5lIChQRFAvUEVQKSBJbnRlcmZhY2VcbiAqL1xuY2xhc3MgUG9saWN5RW5naW5lIHtcblxuICAvKipcbiAgICogVG8gYWRkIHBvbGljaWVzIHRvIGJlIGVuZm9yY2VkIGZvciBhIGNlcnRhaW4gZGVwbG95ZWQgSHlwZXJ0eSBJbnN0YW5jZVxuICAgKiBAcGFyYW0ge1VSTC5IeXBlcnR5VVJMfSAgICAgaHlwZXJ0eSAgaHlwZXJ0eVxuICAgKiBAcGFyYW0ge0h5cGVydHlQb2xpY3lMaXN0fSAgcG9saWNpZXMgcG9saWNpZXNcbiAgICovXG4gIGFkZFBvbGljaWVzKGh5cGVydHksIHBvbGljaWVzKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIFRvIHJlbW92ZSBwcmV2aW91c2x5IGFkZGVkIHBvbGljaWVzIGZvciBhIGNlcnRhaW4gZGVwbG95ZWQgSHlwZXJ0eSBJbnN0YW5jZVxuICAgKiBAcGFyYW0gIHtVUkwuSHlwZXJ0eVVSTH0gIGh5cGVydHkgICAgICAgaHlwZXJ0eVxuICAgKi9cbiAgcmVtb3ZlUG9saWNpZXMoaHlwZXJ0eSkge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAgKiBBdXRob3Jpc2F0aW9uIHJlcXVlc3QgdG8gYWNjZXB0IGEgU3Vic2NyaXB0aW9uIGZvciBhIGNlcnRhaW4gcmVzb3VyY2UuIFJldHVybnMgYSBSZXNwb25zZSBNZXNzYWdlIHRvIGJlIHJldHVybmVkIHRvIFN1YnNjcmlwdGlvbiByZXF1ZXN0ZXJcbiAgICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtZXNzYWdlICAgICAgIG1lc3NhZ2VcbiAgICogQHJldHVybiB7QXV0aG9yaXNhdGlvblJlc3BvbnNlfSAgICAgICAgICAgICAgICAgQXV0aG9yaXNhdGlvblJlc3BvbnNlXG4gICAqL1xuICBhdXRob3Jpc2UobWVzc2FnZSkge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvbGljeUVuZ2luZTtcbiIsIi8qKlxuKiBSdW50aW1lIFJlZ2lzdHJ5IEludGVyZmFjZVxuKi9cbmNsYXNzIFJlZ2lzdHJ5IHtcblxuICAvKipcbiAgKiBUbyBpbml0aWFsaXNlIHRoZSBSdW50aW1lIFJlZ2lzdHJ5IHdpdGggdGhlIFJ1bnRpbWVVUkwgdGhhdCB3aWxsIGJlIHRoZSBiYXNpcyB0byBkZXJpdmUgdGhlIGludGVybmFsIHJ1bnRpbWUgYWRkcmVzc2VzIHdoZW4gYWxsb2NhdGluZyBhZGRyZXNzZXMgdG8gaW50ZXJuYWwgcnVudGltZSBjb21wb25lbnQuIEluIGFkZGl0aW9uLCB0aGUgUmVnaXN0cnkgZG9tYWluIGJhY2stZW5kIHRvIGJlIHVzZWQgdG8gcmVtb3RlbHkgcmVnaXN0ZXIgUnVudGltZSBjb21wb25lbnRzLCBpcyBhbHNvIHBhc3NlZCBhcyBpbnB1dCBwYXJhbWV0ZXIuXG4gICogQHBhcmFtICB7SHlwZXJ0eVJ1bnRpbWVVUkx9ICAgcnVudGltZVVSTCAgICAgICAgICAgIHJ1bnRpbWVVUkxcbiAgKiBAcGFyYW0gIHtEb21haW5VUkx9ICAgICAgICAgICByZW1vdGVSZWdpc3RyeSAgICAgICAgcmVtb3RlUmVnaXN0cnlcbiAgKi9cbiAgY29uc3RydWN0b3IocnVudGltZVVSTCwgcmVtb3RlUmVnaXN0cnkpIHtcblxuICAgIGlmICghcnVudGltZVVSTCkgdGhyb3cgbmV3IEVycm9yKCdydW50aW1lVVJMIGlzIG1pc3NpbmcuJyk7XG4gICAgLyppZiAoIXJlbW90ZVJlZ2lzdHJ5KSB0aHJvdyBuZXcgRXJyb3IoJ3JlbW90ZVJlZ2lzdHJ5IGlzIG1pc3Npb24nKTsqL1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5ydW50aW1lVVJMID0gcnVudGltZVVSTDtcbiAgICBfdGhpcy5yZW1vdGVSZWdpc3RyeSA9IHJlbW90ZVJlZ2lzdHJ5O1xuICAgIF90aGlzLnByb3RvU3R1YnMgPSB7fTtcblxuICAgIC8vaGFzaCBub3QgeWV0IGZ1bGx5IHJlbW92ZWQsIGJlY2F1c2UgaXQgbWlnaHQgYmUgbmVlZGVkXG4gICAgX3RoaXMuaHlwZXJ0aWVzTGlzdCA9IHt9O1xuICAgIF90aGlzLmRiID0ge307XG4gICAgX3RoaXMuREJfTkFNRSA9ICdyZWdpc3RyeS1EQic7XG4gICAgX3RoaXMuREJfVkVSU0lPTiA9IDE7XG4gICAgX3RoaXMuREJfU1RPUkVfSFlQRVJUWSA9ICdoeXBlcnR5LWxpc3QnO1xuXG4gICAgbGV0IHJlcXVlc3QgPSBpbmRleGVkREIub3BlbihfdGhpcy5EQl9OQU1FLCBfdGhpcy5EQl9WRVJTSU9OKTtcblxuICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIF90aGlzLmRiID0gdGhpcy5yZXN1bHQ7XG5cbiAgICAgIC8vc3RvcmUgYWxsIHRoZSB2YWx1ZXMgaW4gdGhlIGRhdGFiYXNlIHRvIGEgaGFzaCB0YWJsZVxuICAgICAgdmFyIHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWRvbmx5Jyk7XG4gICAgICB2YXIgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIG9iamVjdFN0b3JlLm9wZW5DdXJzb3IoKS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgY3Vyc29yID0gZXZlbnQudGFyZ2V0LnJlc3VsdDtcbiAgICAgICAgaWYgKGN1cnNvcikge1xuICAgICAgICAgIC8qY29uc29sZS5sb2coJ2tleTogJyArIGN1cnNvci5rZXkgKyAnIHByb3RvU3R1YlVSTCAnICsgY3Vyc29yLnZhbHVlLnByb3RvU3R1YlVSTCArXG4gICAgICAgICcgcGVwVVJMICcgKyBjdXJzb3IudmFsdWUucGVwVVJMICsgJyBzYW5kYm94VVJMICcgKyBjdXJzb3IudmFsdWUuc2FuZGJveFVSTCk7Ki9cbiAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W2N1cnNvci5rZXldID0ge3Byb3RvU3R1YlVSTDogY3Vyc29yLnZhbHVlLnByb3RvU3R1YlVSTCxcbiAgICAgICAgICBwZXBVUkw6IGN1cnNvci52YWx1ZS5wZXBVUkwsIHNhbmRib3hVUkw6IGN1cnNvci52YWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3Qgb3BlbiBJbmRleGVkREIgZXJyb3I6JywgZXZlbnQudGFyZ2V0LmVycm9yQ29kZSk7XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGxldCBvYmplY3RTdG9yZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKFxuICAgICAgICBfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCB7a2V5UGF0aDogJ2h5cGVydHknfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgncHJvdG9TdHViVVJMJywgJ3Byb3RvU3R1YlVSTCcsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgncGVwVVJMJywgJ3BlcFVSTCcsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgnc2FuZGJveFVSTCcsICdzYW5kYm94VVJMJywge3VuaXF1ZTogZmFsc2V9KTtcblxuICAgICAgLy9wb3B1bGF0ZSB3aXRoIHRoZSBydW50aW1lVVJMIHByb3ZpZGVkXG4gICAgICBvYmplY3RTdG9yZS5wdXQoe2h5cGVydHk6IF90aGlzLnJ1bnRpbWVVUkwsIHByb3RvU3R1YlVSTDogbnVsbCxcbiAgICAgICAgICAgICAgICBwZXBVUkw6IG51bGwsIHNhbmRib3hVUkw6IG51bGx9KTtcbiAgICB9O1xuXG4gIH1cblxuICAvKipcbiAgKiBUbyByZWdpc3RlciBhIG5ldyBIeXBlcnR5IGluIHRoZSBydW50aW1lIHdoaWNoIHJldHVybnMgdGhlIEh5cGVydHlVUkwgYWxsb2NhdGVkIHRvIHRoZSBuZXcgSHlwZXJ0eS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9ICAgICBwb3N0TWVzc2FnZSAgICAgICAgICAgcG9zdE1lc3NhZ2VcbiAgKiBAcGFyYW0gIHtIeXBlcnR5Q2F0YWxvZ3VlVVJMfSBIeXBlcnR5Q2F0YWxvZ3VlVVJMICAgZGVzY3JpcHRvclxuICAqIEByZXR1cm4ge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkxcbiAgKi9cbiAgcmVnaXN0ZXJIeXBlcnR5KHBvc3RNZXNzYWdlLCBkZXNjcmlwdG9yKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIGFzc3VtaW5nIHRoZSBoeXBlcnR5IG5hbWUgY29tZSBpbiB0aGUgYm9keSBvZiB0aGUgbWVzc2FnZVxuICAgIC8vIHRoaXMgaXMgYSB2ZXJ5IHNpbXBsZSB3YXkgdG8gZG8gaXQsIGp1c3QgZm9yIHRlc3RcbiAgICBsZXQgSHlwZXJ0eVVSTCA9IHBvc3RNZXNzYWdlLmJvZHkudmFsdWU7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgc3RvcmVWYWx1ZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuXG4gICAgICBzdG9yZVZhbHVlLnB1dCh7aHlwZXJ0eTogSHlwZXJ0eVVSTCwgcHJvdG9TdHViVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgIHBlcFVSTDogbnVsbCwgc2FuZGJveFVSTDogbnVsbH0pO1xuXG4gICAgICAvL2FkZCB0aGUgaHlwZXJ0eSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG4gICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W0h5cGVydHlVUkxdID0ge3Byb3RvU3R1YlVSTDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcGVwVVJMOiBudWxsLCBzYW5kYm94VVJMOiBudWxsfTtcblxuICAgICAgdHJhbnNhY3Rpb24ub25jb21wbGV0ZSA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ0h5cGVydHkgcmVnaXN0ZXJlZCB3aXRoIHN1Y2Nlc3MnKTtcbiAgICAgICAgcmVzb2x2ZShIeXBlcnR5VVJMKTtcbiAgICAgIH07XG5cbiAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdIeXBlcnR5IHJlZ2lzdHJhdGlvbiBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyIGh5cGVydHknKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvL1RPRE8gaW1wbGVtZW50IHRoZSBhc3NvY2lhdGUgdG8gSWRldGl0eVxuXG4gICAgLy9UT0RPIGFsbG9jYXRlIGFkZHJlc3MgZm9yIHRoZSBuZXcgSHlwZXJ0eSBJbnN0YW5jZVxuXG4gICAgLy9UT0RPIHJlZ2lzdGVyIEh5cGVydHkgYXQgU1AxIFJlZ2lzdHJ5XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgSHlwZXJ0eVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgdXJsICAgICAgICB1cmxcbiAgKi9cbiAgdW5yZWdpc3Rlckh5cGVydHkodXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJyk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2h5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gZGVsZXRlIEh5cGVydHknKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgdmFyIHJlcXVlc3QyID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLlxuICAgICAgICAgIG9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpLmRlbGV0ZSh1cmwpO1xuXG4gICAgICAgICAgcmVxdWVzdDIub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vIGRlbGV0ZSB0aGUgaHlwZXJ0eSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG4gICAgICAgICAgICBkZWxldGUgX3RoaXMuaHlwZXJ0aWVzTGlzdFt1cmxdO1xuICAgICAgICAgICAgcmVzb2x2ZSgnSHlwZXJ0eSBkZWxldGUgd2l0aCBzdWNjZXNzJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3QyLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgZGVsZXRpbmcgYW4gSHlwZXJ0eScpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBkZWxldGluZyBhbiBIeXBlcnR5Jyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gZGlzY292ZXIgcHJvdG9jb2wgc3R1YnMgYXZhaWxhYmxlIGluIHRoZSBydW50aW1lIGZvciBhIGNlcnRhaW4gZG9tYWluLiBJZiBhdmFpbGFibGUsIGl0IHJldHVybnMgdGhlIHJ1bnRpbWUgdXJsIGZvciB0aGUgcHJvdG9jb2wgc3R1YiB0aGF0IGNvbm5lY3RzIHRvIHRoZSByZXF1ZXN0ZWQgZG9tYWluLiBSZXF1aXJlZCBieSB0aGUgcnVudGltZSBCVVMgdG8gcm91dGUgbWVzc2FnZXMgdG8gcmVtb3RlIHNlcnZlcnMgb3IgcGVlcnMgKGRvIHdlIG5lZWQgc29tZXRoaW5nIHNpbWlsYXIgZm9yIEh5cGVydGllcz8pLlxuICAqIEBwYXJhbSAge0RvbWFpblVSTH0gICAgICAgICAgIERvbWFpblVSTCAgICAgICAgICAgIHVybFxuICAqIEByZXR1cm4ge1J1bnRpbWVVUkx9ICAgICAgICAgICBSdW50aW1lVVJMXG4gICovXG4gIGRpc2NvdmVyUHJvdG9zdHViKHVybCkge1xuICAgIGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciB1cmwgbmVlZGVkJyk7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQodXJsKTtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdyZXF1ZXN0VXBkYXRlIGNvdWxkblxcJyBnZXQgdGhlIFByb3Rvc3R1YlVSTCcpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdoeXBlcnR5IG5vdCBmb3VuZCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAoZGF0YSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVzb2x2ZShkYXRhLnByb3RvU3R1YlVSTCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdObyBwcm90b3N0dWJVUkwgd2FzIGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZWdpc3RlciBhIG5ldyBQcm90b2NvbCBTdHViIGluIHRoZSBydW50aW1lIGluY2x1ZGluZyBhcyBpbnB1dCBwYXJhbWV0ZXJzIHRoZSBmdW5jdGlvbiB0byBwb3N0TWVzc2FnZSwgdGhlIERvbWFpblVSTCB0aGF0IGlzIGNvbm5lY3RlZCB3aXRoIHRoZSBzdHViLCB3aGljaCByZXR1cm5zIHRoZSBSdW50aW1lVVJMIGFsbG9jYXRlZCB0byB0aGUgbmV3IFByb3RvY29sU3R1Yi5cbiAgICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgRG9tYWluVVJMIHNlcnZpY2UgcHJvdmlkZXIgZG9tYWluXG4gICAqIEByZXR1cm4ge1J1bnRpbWVQcm90b1N0dWJVUkx9XG4gICAqL1xuICByZWdpc3RlclN0dWIoZG9tYWluVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVudGltZVByb3RvU3R1YlVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoZG9tYWluVVJMKTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignZG9tYWluVVJMIG5vdCBmb3VuZCcpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUHJvdG9zdHViJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJ1bnRpbWVQcm90b1N0dWJVUkwgPSBkb21haW5VUkwgKyAnL3Byb3Rvc3R1Yic7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gcmVnaXN0ZXJQcm90b3N0dWI6IGh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnByb3RvU3R1YlVSTCA9IHJ1bnRpbWVQcm90b1N0dWJVUkw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVxdWVzdFVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUDogZXJyb3Igb24gZGF0YWJhc2UnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W2RvbWFpblVSTF07XG4gICAgICAgICAgICBsZXQgbmV3SGFzaFZhbHVlID0ge3Byb3RvU3R1YlVSTDogcnVudGltZVByb3RvU3R1YlVSTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGVwVVJMOiBoYXNoVmFsdWUucGVwVVJMLCBzYW5kYm94VVJMOiBoYXNoVmFsdWUuc2FuZGJveFVSTH07XG4gICAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W2RvbWFpblVSTF0gPSBuZXdIYXNoVmFsdWU7XG4gICAgICAgICAgICByZXNvbHZlKHJ1bnRpbWVQcm90b1N0dWJVUkwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvL1RPRE8gY2FsbCB0aGUgYWRkTGlzdGVuZXIgZnVuY3Rpb24gaW4gTXNnIEJVU1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgaHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclN0dWIoaHlwZXJ0eVJ1bnRpbWVVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2h5cGVydHlSdW50aW1lVVJMIG5vdCBmb3VuZCcpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJTdHViJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWI6IEh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnByb3RvU3R1YlVSTCA9IG51bGw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVxdWVzdFVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyU3R1YjogZXJyb3Igb24gZGF0YWJhc2UnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W2h5cGVydHlSdW50aW1lVVJMXTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IGhhc2hWYWx1ZS5wZXBVUkwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbaHlwZXJ0eVJ1bnRpbWVVUkxdID0gbmV3SGFzaFZhbHVlO1xuICAgICAgICAgICAgcmVzb2x2ZSgnUHJvdG9zdHViVVJMIHJlbW92ZWQnKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyByZWdpc3RlciBhIG5ldyBQb2xpY3kgRW5mb3JjZXIgaW4gdGhlIHJ1bnRpbWUgaW5jbHVkaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgdGhlIGZ1bmN0aW9uIHRvIHBvc3RNZXNzYWdlLCB0aGUgSHlwZXJ0eVVSTCBhc3NvY2lhdGVkIHdpdGggdGhlIFBFUCwgd2hpY2ggcmV0dXJucyB0aGUgUnVudGltZVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBQb2xpY3kgRW5mb3JjZXIgY29tcG9uZW50LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gcG9zdE1lc3NhZ2UgcG9zdE1lc3NhZ2VcbiAgKiBAcGFyYW0gIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMICAgICAgICAgICAgaHlwZXJ0eVxuICAqIEByZXR1cm4ge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMXG4gICovXG4gIHJlZ2lzdGVyUEVQKHBvc3RNZXNzYWdlLCBoeXBlcnR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgaHlwZXJ0eXBlcFVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoaHlwZXJ0eSk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VSTCBub3QgZm91bmQnKTtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBoeXBlcnR5cGVwVVJMID0gaHlwZXJ0eSArICcvcGVwJztcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcblxuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlclBFUCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgZGF0YS5wZXBVUkwgPSBoeXBlcnR5cGVwVVJMO1xuXG4gICAgICAgICAgbGV0IHJlcXVlc3RVcGRhdGUgPSBvYmplY3RTdG9yZS5wdXQoZGF0YSk7XG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVlc3RVcGRhdGUgZXJyb3I6ICcgKyBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdXBkYXRlIHJlZ2lzdGVyUEVQJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3RVcGRhdGUub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIC8vdXBkYXRlIHRoZSB2YWx1ZSBpbiB0aGUgaHlwZXJ0aWVzTGlzdCBoYXNoIHRhYmxlXG4gICAgICAgICAgICBsZXQgaGFzaFZhbHVlID0gX3RoaXMuaHlwZXJ0aWVzTGlzdFtoeXBlcnR5XTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBoYXNoVmFsdWUucHJvdG9TdHViVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IGh5cGVydHlwZXBVUkwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbaHlwZXJ0eV0gPSBuZXdIYXNoVmFsdWU7XG4gICAgICAgICAgICByZXNvbHZlKGh5cGVydHlwZXBVUkwpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgcHJvdG9jb2wgc3R1YlxuICAqIEBwYXJhbSAge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMICAgICBIeXBlcnR5UnVudGltZVVSTFxuICAqL1xuICB1bnJlZ2lzdGVyUEVQKEh5cGVydHlSdW50aW1lVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgaHlwZXJ0eXBlcFVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQoSHlwZXJ0eVJ1bnRpbWVVUkwpO1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVUkwgbm90IGZvdW5kJyk7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclBFUCcpO1xuICAgICAgfTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJQRVA6IGh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnBlcFVSTCA9IG51bGw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcigncmVxdWVzdFVwZGF0ZSBlcnJvcjogJyArIGV2ZW50LnRhcmdldC5lcnJvckNvZGUpO1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyUEVQOiBlcnJvciBvbiB1cGRhdGUgZGFiYXRhc2UnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W0h5cGVydHlSdW50aW1lVVJMXTtcbiAgICAgICAgICAgIGxldCBuZXdIYXNoVmFsdWUgPSB7cHJvdG9TdHViVVJMOiBoYXNoVmFsdWUucHJvdG9TdHViVVJMLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXBVUkw6IG51bGwsIHNhbmRib3hVUkw6IGhhc2hWYWx1ZS5zYW5kYm94VVJMfTtcbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3RbSHlwZXJ0eVJ1bnRpbWVVUkxdID0gbmV3SGFzaFZhbHVlO1xuICAgICAgICAgICAgcmVzb2x2ZSgnIFBFUCBzdWNlc3NmdWxseSBkZWxldGVkJyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gcmVjZWl2ZSBzdGF0dXMgZXZlbnRzIGZyb20gY29tcG9uZW50cyByZWdpc3RlcmVkIGluIHRoZSBSZWdpc3RyeS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9ICAgICBNZXNzYWdlLk1lc3NhZ2UgICAgICAgZXZlbnRcbiAgKi9cbiAgb25FdmVudChldmVudCkge1xuICAgIC8vIFRPRE8gYm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZWdpc3RlciBhIG5ldyBydW50aW1lIHNhbmRib3hlcyBwYXNzaW5nIGFzIGlucHV0IHRoZSBzYW5kYm94IGluc3RhbmNlIGFuZCB0aGUgZG9tYWluIFVSTCBhc3NvY2lhdGVkIHRvIHRoZSBzYW5kYm94IGluc3RhbmNlLlxuICAgKiBAcGFyYW0gIHtEb21haW5VUkx9IERvbWFpblVSTCB1cmxcbiAgICogQHJldHVybiB7UnVudGltZVNhbmRib3hVUkx9XG4gICAqL1xuICByZWdpc3RlclNhbmRib3godXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVudGltZVNhbmRib3hVUkw7XG5cbiAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgbGV0IHJlcXVlc3QgPSBvYmplY3RTdG9yZS5nZXQodXJsKTtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdyZXF1ZXN0VXBkYXRlIGNvdWxkblxcJyByZWdpc3RlciB0aGUgc2FuZGJveCcpO1xuICAgICAgICBjb25zb2xlLmVycm9yKCdVUkwgbm90IGZvdW5kJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJ1bnRpbWVTYW5kYm94VVJMID0gdXJsICsgJy9zYW5kYm94JztcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRhdGEuc2FuZGJveFVSTCA9IHJ1bnRpbWVTYW5kYm94VVJMO1xuICAgICAgICAgIGxldCByZXF1ZXN0VXBkYXRlID0gb2JqZWN0U3RvcmUucHV0KGRhdGEpO1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgcmVnaXN0ZXIgdGhlIHNhbmRib3gnKTtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlcXVlc3RVcGRhdGUgZXJyb3I6ICcgKyBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgLy91cGRhdGUgdGhlIHZhbHVlIGluIHRoZSBoeXBlcnRpZXNMaXN0IGhhc2ggdGFibGVcbiAgICAgICAgICAgIGxldCBoYXNoVmFsdWUgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF07XG4gICAgICAgICAgICBsZXQgbmV3SGFzaFZhbHVlID0ge3Byb3RvU3R1YlVSTDogaGFzaFZhbHVlLnByb3RvU3R1YlVSTCxcbiAgICAgICAgICAgICAgICAgICAgcGVwVVJMOiBoYXNoVmFsdWUucGVwVVJMLCBzYW5kYm94VVJMOiBydW50aW1lU2FuZGJveFVSTH07XG4gICAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF0gPSBuZXdIYXNoVmFsdWU7XG4gICAgICAgICAgICByZXNvbHZlKHJ1bnRpbWVTYW5kYm94VVJMKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gTm8gbWF0Y2ggd2FzIGZvdW5kLlxuICAgICAgICAgIHJlamVjdCgnVGhlIGVudHJ5IGRvblxcJ3QgZXhpc3QuJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcblxuICAgIC8vIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAvLyByZXNvbHZlKFJ1bnRpbWVTYW5kYm94VVJMKTtcbiAgICAvLyB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIGRpc2NvdmVyIHNhbmRib3hlcyBhdmFpbGFibGUgaW4gdGhlIHJ1bnRpbWUgZm9yIGEgY2VydGFpbiBkb21haW4uIFJlcXVpcmVkIGJ5IHRoZSBydW50aW1lIFVBIHRvIGF2b2lkIG1vcmUgdGhhbiBvbmUgc2FuZGJveCBmb3IgdGhlIHNhbWUgZG9tYWluLlxuICAqIEBwYXJhbSAge0RvbWFpblVSTH0gRG9tYWluVVJMIHVybFxuICAqIEByZXR1cm4ge1J1bnRpbWVTYW5kYm94fSAgICAgICAgICAgUnVudGltZVNhbmRib3hcbiAgKi9cbiAgZ2V0U2FuZGJveCh1cmwpIHtcbiAgICBpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgdXJsIG5lZWRlZCcpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHJ1bnRpbWVVUkwgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W3VybF07XG4gICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgZ2V0IHRoZSBzYW5kYm94Jyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VSTCBub3QgZm91bmQnKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc29sdmUoZGF0YS5zYW5kYm94VVJMKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ05vIHNhbmRib3hVUkwgd2FzIGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHZlcmlmeSBpZiBzb3VyY2UgaXMgdmFsaWQgYW5kIHRvIHJlc29sdmUgdGFyZ2V0IHJ1bnRpbWUgdXJsIGFkZHJlc3MgaWYgbmVlZGVkIChlZyBwcm90b3N0dWIgcnVudGltZSB1cmwgaW4gY2FzZSB0aGUgbWVzc2FnZSBpcyB0byBiZSBkaXNwYXRjaGVkIHRvIGEgcmVtb3RlIGVuZHBvaW50KS5cbiAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgdXJsICAgICAgIHVybFxuICAqIEByZXR1cm4ge1Byb21pc2U8VVJMLlVSTD59ICAgICAgICAgICAgICAgICBQcm9taXNlIDxVUkwuVVJMPlxuICAqL1xuICByZXNvbHZlKHVybCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL3Jlc29sdmUgdG8gdGhlIHNhbWUgVVJMXG4gICAgICByZXNvbHZlKHVybCk7XG4gICAgfSk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZWdpc3RyeTtcbiIsImltcG9ydCBSdW50aW1lVUFDb3JlIGZyb20gJy4vcnVudGltZS9SdW50aW1lVUEnO1xuaW1wb3J0IFNhbmRib3hCYXNlIGZyb20gJy4vc2FuZGJveC9TYW5kYm94JztcblxuLy8gVE9ETzogUmVtb3ZlIHRoaXMgYmVmb3JlIGNvbXBpbGluZ1xuLy8gVGhpcyBpcyBvbmx5IGZvciB0ZXN0aW5nXG4vLyBpbXBvcnQgU2FuZGJveCBmcm9tICcuLi90ZXN0L3NhbmRib3hlcy9TYW5kYm94QnJvd3Nlcic7XG4vLyB2YXIgc2FuZGJveCA9IG5ldyBTYW5kYm94KCk7XG4vLyB3aW5kb3cucnVudGltZSA9IG5ldyBSdW50aW1lVUEoc2FuZGJveCk7XG5cbmV4cG9ydCB2YXIgUnVudGltZVVBID0gUnVudGltZVVBQ29yZTtcbmV4cG9ydCB2YXIgU2FuZGJveCA9IFNhbmRib3hCYXNlO1xuIiwiLy8gdXRpbHNcbmltcG9ydCByZXF1ZXN0IGZyb20gJy4uL3V0aWxzL3JlcXVlc3QnO1xuXG4vLyBNYWluIGRlcGVuZGVjaWVzXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnkvUmVnaXN0cnknO1xuaW1wb3J0IElkZW50aXR5TW9kdWxlIGZyb20gJy4uL2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcbmltcG9ydCBQb2xpY3lFbmdpbmUgZnJvbSAnLi4vcG9saWN5L1BvbGljeUVuZ2luZSc7XG5pbXBvcnQgTWVzc2FnZUJ1cyBmcm9tICcuLi9idXMvTWVzc2FnZUJ1cyc7XG5cbi8qKlxuKiBSdW50aW1lIFVzZXIgQWdlbnQgSW50ZXJmYWNlXG4qL1xuY2xhc3MgUnVudGltZVVBIHtcblxuICBjb25zdHJ1Y3RvcihzYW5kYm94RmFjdG9yeSkge1xuXG4gICAgaWYgKCFzYW5kYm94RmFjdG9yeSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2FuZGJveCBmYWN0b3J5IGlzIGEgbmVlZGVkIHBhcmFtZXRlcicpO1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHBvc3QgYW5kIHJldHVybiByZWdpc3RyeS9oeXBlcnR5UnVudGltZUluc3RhbmNlIHRvIGFuZCBmcm9tIEJhY2stZW5kIFNlcnZpY2VcbiAgICAvLyBmb3IgdGhlIHJlcXVlc3QgeW91IGNhbiB1c2UgdGhlIG1vZHVsZSByZXF1ZXN0IGluIHV0aWxzO1xuICAgIC8vIHRoZSByZXNwb25zZSBpcyBsaWtlOiBoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyM1xuXG4gICAgbGV0IGh5cGVydHlSdW50aW1lVVJMID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzJztcblxuICAgIF90aGlzLnJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KGh5cGVydHlSdW50aW1lVVJMKTtcbiAgICBfdGhpcy5pZGVudGl0eU1vZHVsZSA9IG5ldyBJZGVudGl0eU1vZHVsZSgpO1xuICAgIF90aGlzLnBvbGljeUVuZ2luZSA9IG5ldyBQb2xpY3lFbmdpbmUoKTtcbiAgICBfdGhpcy5tZXNzYWdlQnVzID0gbmV3IE1lc3NhZ2VCdXMoX3RoaXMucmVnaXN0cnkpO1xuXG4gICAgc2FuZGJveEZhY3RvcnkubWVzc2FnZUJ1cyA9IF90aGlzLm1lc3NhZ2VCdXM7XG4gICAgX3RoaXMuc2FuZGJveEZhY3RvcnkgPSBzYW5kYm94RmFjdG9yeTtcblxuICAgIC8vIFRPRE86IHJlbW92ZSB0aGlzIGV2ZW50IGxpc3RlbmVyLCBvbmx5IGZvciB0ZXN0aW5nXG4gICAgbGV0IGh5cGVydHlSdW50aW1lVVJMU3RhdHVzID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzL3N0YXR1cyc7XG4gICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihoeXBlcnR5UnVudGltZVVSTFN0YXR1cywgKG1zZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2UgYnVzIHN0YXR1cyByZXNwb25zZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKCdydW50aW1lOi9hbGljZScsIChtc2cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGJ1cyBhbGljZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKCdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyMycsIChtc2cpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGJ1cyByZXNwb25zZSB3aXRoIG1lc3NhZ2U6ICcsIG1zZyk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIEFjY29tb2RhdGUgaW50ZXJvcGVyYWJpbGl0eSBpbiBIMkggYW5kIHByb3RvIG9uIHRoZSBmbHkgZm9yIG5ld2x5IGRpc2NvdmVyZWQgZGV2aWNlcyBpbiBNMk1cbiAgKiBAcGFyYW0gIHtDYXRhbG9ndWVEYXRhT2JqZWN0Lkh5cGVydHlEZXNjcmlwdG9yfSAgIGRlc2NyaXB0b3IgICAgZGVzY3JpcHRvclxuICAqL1xuICBkaXNjb3ZlckhpcGVydHkoZGVzY3JpcHRvcikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIEh5cGVydHkgZGVwbG95ZWQgYnkgdGhlIEFwcCB0aGF0IGlzIHBhc3NlZCBhcyBpbnB1dCBwYXJhbWV0ZXIuIFRvIGJlIHVzZWQgd2hlbiBBcHAgYW5kIEh5cGVydGllcyBhcmUgZnJvbSB0aGUgc2FtZSBkb21haW4gb3RoZXJ3aXNlIHRoZSBSdW50aW1lVUEgd2lsbCByYWlzZSBhbiBleGNlcHRpb24gYW5kIHRoZSBBcHAgaGFzIHRvIHVzZSB0aGUgbG9hZEh5cGVydHkoLi4pIGZ1bmN0aW9uLlxuICAqIEBwYXJhbSAge09iamVjdH0gT2JqZWN0ICAgICAgICAgICAgICAgICAgIGh5cGVydHlJbnN0YW5jZVxuICAqIEBwYXJhbSAge1VSTC5IeXBlcnR5Q2F0YWxvZ3VlVVJMfSAgICAgICAgIGRlc2NyaXB0b3IgICAgICBkZXNjcmlwdG9yXG4gICovXG4gIHJlZ2lzdGVySHlwZXJ0eShoeXBlcnR5SW5zdGFuY2UsIGRlc2NyaXB0b3IpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgKiBEZXBsb3kgSHlwZXJ0eSBmcm9tIENhdGFsb2d1ZSBVUkxcbiAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICBoeXBlcnR5IGh5cGVydHlJbnN0YW5jZSB1cmw7XG4gICovXG4gIGxvYWRIeXBlcnR5KGh5cGVydHkpIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIWh5cGVydHkpIHRocm93IG5ldyBFcnJvcignSHlwZXJ0eSBkZXNjcmlwdG9yIHVybCBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBfaHlwZXJ0eVNhbmRib3g7XG4gICAgICBsZXQgX2h5cGVydHlEZXNjcmlwdG9yO1xuICAgICAgbGV0IF9oeXBlcnR5U291cmNlQ29kZTtcbiAgICAgIGxldCBfaHlwZXJ0eUNvbmZpZ3VyYXRpb24gPSB7fTtcblxuICAgICAgbGV0IGVycm9yUmVhc29uID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdIeXBlcnR5IEVycm9yOicsIHJlYXNvbik7XG4gICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgfTtcblxuICAgICAgLy8gR2V0IEh5cGVydHkgZGVzY3JpcHRvclxuICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGh5cGVydHkpLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eURlc2NyaXB0b3IpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oJzE6IHJldHVybiBoeXBlcnR5IGRlc2NyaXB0b3InKTtcblxuICAgICAgICBfaHlwZXJ0eURlc2NyaXB0b3IgPSBoeXBlcnR5RGVzY3JpcHRvcjtcblxuICAgICAgICAvLyBUT0RPOiBVcGRhdGUgdGhpcyB2YXJpYWJsZXMgd2l0aCByZXN1bHQgb2YgdGhlIHJlcXVlc3RcbiAgICAgICAgLy8gVGhpcyB2YWx1ZXMgYXJlIG9ubHkgZm9yIHRlc3Rlcywgc2hvdWxkIGJlIHJlbW92ZWQ7XG4gICAgICAgIGxldCBoeXBlcnR5U291cmNlQ29kZVVybCA9ICdkaXN0L1ZlcnR4UHJvdG9TdHViLmpzJztcblxuICAgICAgICAvLyBHZXQgdGhlIGh5cGVydHkgc291cmNlIGNvZGVcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGh5cGVydHlTb3VyY2VDb2RlVXJsKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihoeXBlcnR5U291cmNlQ29kZSkge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnMjogcmV0dXJuIGh5cGVydHkgc291cmNlIGNvZGUnKTtcbiAgICAgICAgX2h5cGVydHlTb3VyY2VDb2RlID0gaHlwZXJ0eVNvdXJjZUNvZGU7XG5cbiAgICAgICAgLy8gVE9ETzogcmVtb3ZlIG9yIHVwZGF0ZSB0aGlzIG1lc3NhZ2UsIGJlY2F1c2Ugd2UgZG9uJ3Qgbm93IGlmIHRoZSByZWdpc3Rlckh5cGVydHkgaGF2ZSBhIG1lc3NhZ2VCdXMgaW5zdGFuY2Ugb3IgYW4gbWVzc2FnZSBvYmplY3Q7XG4gICAgICAgIGxldCBtZXNzYWdlID0ge1xuICAgICAgICAgIGJvZHk6IHtcbiAgICAgICAgICAgIHZhbHVlOiAnaHlwZXJ0eS1ydW50aW1lOi8vc3AxL3Byb3Rvc3R1Yi8xMjMvJ1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zb2xlLmxvZyhfaHlwZXJ0eVNvdXJjZUNvZGUpO1xuXG4gICAgICAgIC8vIFJlZ2lzdGVyIGh5cGVydHk7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5yZWdpc3Rlckh5cGVydHkobWVzc2FnZSwgX2h5cGVydHlEZXNjcmlwdG9yKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihoeXBlcnR5VVJMKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMzogcmV0dXJuIGh5cGVydHkgdXJsLCBhZnRlciByZWdpc3RlciBoeXBlcnR5Jyk7XG5cbiAgICAgICAgbGV0IGluU2FtZVNhbmRib3ggPSB0cnVlO1xuXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBhcHAgYW5kIGh5cGVydHkgaXMgaW4gdGhlIHNhbWUgc2FuZGJveCBhbmRcbiAgICAgICAgaWYgKGluU2FtZVNhbmRib3gpIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZXRBcHBTYW5kYm94LCB0aGlzIHdpbGwgcmV0dXJuIGEgcHJvbWlzZTtcblxuICAgICAgICAgIF9oeXBlcnR5U2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZUFwcFNhbmRib3goKTtcbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3guZGVwbG95Q29tcG9uZW50KF9oeXBlcnR5U291cmNlQ29kZSwgaHlwZXJ0eVVSTCwgX2h5cGVydHlDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZXRIeXBlcnR5U2FuZGJveCwgdGhpcyB3aWxsIHJldHVybiBhIHByb21pc2U7XG5cbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3ggPSBfdGhpcy5zYW5kYm94RmFjdG9yeS5jcmVhdGVTYW5kYm94KCk7XG4gICAgICAgICAgX2h5cGVydHlTYW5kYm94LmRlcGxveUNvbXBvbmVudChfaHlwZXJ0eVNvdXJjZUNvZGUsIGh5cGVydHlVUkwsIGh5cGVydHlDb25maWd1cmF0aW9uKTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihzYW5kYm94SW5zdGFuY2UpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc0OiByZXR1cm4gdGhlIHNhbmRib3ggaW5zdGFuY2UgYWZ0ZXIgY2hlY2sgaWYgaXMgaW4gdGhlIHNhbWUgc2FuZGJveCBvciBub3QnKTtcblxuICAgICAgICByZXNvbHZlKHtjb2RlOiBzb3VyY2VDb2RlLCBoeXBlcnR5VVJMOiBoeXBlcnR5VVJMLCBoeXBlcnR5Q29uZmlndXJhdGlvbjogaHlwZXJ0eUNvbmZpZ3VyYXRpb24sIG1lc3NhZ2VCdXM6IF90aGlzLm1lc3NhZ2VCdXN9KTtcblxuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzY6IHJldHVybiBkZXBsb3kgY29tcG9uZW50IGZvciBzYW5kYm94IHN0YXR1cycpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnJvclJlYXNvbik7XG5cbiAgICB9KTtcblxuICB9XG5cbiAgLyoqXG4gICogRGVwbG95IFN0dWIgZnJvbSBDYXRhbG9ndWUgVVJMIG9yIGRvbWFpbiB1cmxcbiAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICAgZG9tYWluICAgICAgICAgIGRvbWFpblxuICAqL1xuICBsb2FkU3R1Yihkb21haW4pIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIWRvbWFpbikgdGhyb3cgbmV3IEVycm9yKCdkb21haW4gcGFyYW1ldGVyIGlzIG5lZWRlZCcpO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBsZXQgc3R1YkRlc2NyaXB0b3I7XG5cbiAgICAgIC8vIFRPRE86IHRlbXBvcmFyeSBhZGRyZXNzIHRoaXMgb25seSBzdGF0aWMgZm9yIHRlc3RpbmdcbiAgICAgIGxldCBzdHViVVJMID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzJztcbiAgICAgIGxldCBjb21wb25lbnREb3dubG9hZFVSTCA9ICdkaXN0L1ZlcnR4UHJvdG9TdHViLmpzJztcbiAgICAgIGxldCBjb25maWd1cmF0aW9uID0ge1xuICAgICAgICB1cmw6ICd3czovL2xvY2FsaG9zdDo5MDkwL3dzJyxcbiAgICAgICAgcnVudGltZVVSTDogJ3J1bnRpbWU6L2FsaWNlJ1xuICAgICAgfTtcblxuICAgICAgbGV0IHN0dWJTYW5kYm94O1xuICAgICAgbGV0IHJ1bnRpbWVTYW5kYm94VVJMO1xuICAgICAgbGV0IHJ1bnRpbWVQcm90b1N0dWJVUkw7XG4gICAgICBsZXQgcHJvdG9TdHViU291cmNlQ29kZTtcblxuICAgICAgLy8gRGlzY292ZXIgUHJvdG9jb2wgU3R1YlxuICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LmRpc2NvdmVyUHJvdG9zdHViKGRvbWFpbikudGhlbihmdW5jdGlvbihkZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIElzIHJlZ2lzdGVkP1xuICAgICAgICBjb25zb2xlLmluZm8oJzEuIFByb3RvIFN0dWIgRGlzY292ZXJlZDogJywgZGVzY3JpcHRvcik7XG4gICAgICAgIHN0dWJEZXNjcmlwdG9yID0gZGVzY3JpcHRvcjtcbiAgICAgICAgcmV0dXJuIHN0dWJEZXNjcmlwdG9yO1xuICAgICAgfSwgZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIGlzIG5vdCByZWdpc3RlZD9cbiAgICAgICAgY29uc29sZS5pbmZvKCcxLiBQcm90byBTdHViIG5vdCBmb3VuZDonLCByZWFzb24pO1xuXG4gICAgICAgIC8vIFRPRE86IGdldCBwcm90b3N0dWIgfCA8c3AtZG9tYWluPi8ud2VsbC1rbm93bi9wcm90b3N0dWJcbiAgICAgICAgLy8gZm9yIHRoZSByZXF1ZXN0IHlvdSBjYW4gdXNlIHRoZSBtb2R1bGUgcmVxdWVzdCBpbiB1dGlscztcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGRvbWFpbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGVzY3JpcHRvcikge1xuICAgICAgICBjb25zb2xlLmluZm8oJzIuIHJldHVybiB0aGUgUHJvdG9TdHViIGRlc2NyaXB0b3I6JywgZGVzY3JpcHRvcik7XG4gICAgICAgIHN0dWJEZXNjcmlwdG9yID0gZGVzY3JpcHRvcjtcblxuICAgICAgICAvLyBHZXQgdGhlIGNvbXBvbmVudCBzb3VyY2UgY29kZSByZWZlcmVudCB0byBjb21wb25lbnQgZG93bmxvYWQgdXJsO1xuICAgICAgICByZXR1cm4gcmVxdWVzdC5nZXQoY29tcG9uZW50RG93bmxvYWRVUkwpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHByb3RvU3R1YlNvdXJjZUNvZGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCczLiByZXR1cm4gdGhlIFByb3RvU3R1YiBTb3VyY2UgQ29kZTogJyk7XG4gICAgICAgIHByb3RvU3R1YlNvdXJjZUNvZGUgPSBwcm90b1N0dWJTb3VyY2VDb2RlO1xuXG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5yZWdpc3RlclN0dWIoZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihydW50aW1lUHJvdG9TdHViVVJMKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNC4gcmV0dXJuIHRoZSBydW50aW1lUHJvdG9TdHViVVJMLCBBZnRlciBSZWdpc3RlciBTdHViJyk7XG4gICAgICAgIHJ1bnRpbWVQcm90b1N0dWJVUkwgPSBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgICAgIC8vIFRPRE86IENoZWNrIG9uIFBFUCAocG9saWN5IEVuZ2luZSkgaWYgd2UgbmVlZCB0aGUgc2FuZGJveCBhbmQgY2hlY2sgaWYgdGhlIFNhbmRib3ggRmFjdG9yeSBoYXZlIHRoZSBjb250ZXh0IHNhbmRib3g7XG4gICAgICAgIC8vIEluc3RhbnRpYXRlIHRoZSBTYW5kYm94XG4gICAgICAgIHN0dWJTYW5kYm94ID0gX3RoaXMuc2FuZGJveEZhY3RvcnkuY3JlYXRlU2FuZGJveCgpO1xuXG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5yZWdpc3RlclNhbmRib3goc3R1YlNhbmRib3gsIGRvbWFpbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocnVudGltZVNhbmRib3hVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc1OiByZXR1cm4gdGhlIHNhbmRib3ggcnVudGltZSB1cmwnKTtcblxuICAgICAgICAvLyBEZXBsb3kgQ29tcG9uZW50XG4gICAgICAgIHJldHVybiBzdHViU2FuZGJveC5kZXBsb3lDb21wb25lbnQocHJvdG9TdHViU291cmNlQ29kZSwgcnVudGltZVNhbmRib3hVUkwsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzY6IHJldHVybiBkZXBsb3kgY29tcG9uZW50IGZvciBzYW5kYm94IHN0YXR1cycpO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgbWVzc2FnZSBidXMgbGlzdGVuZXJcbiAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihydW50aW1lUHJvdG9TdHViVVJMLCBzdHViU2FuZGJveCk7XG5cbiAgICAgICAgLy8gSGFuZGxlIHdpdGggZGVwbG95ZWQgY29tcG9uZW50XG4gICAgICAgIGNvbnNvbGUubG9nKCdDb21wb25lbnQgaXMgZGVwbG95ZWQnKTtcblxuICAgICAgICAvLyBMb2FkIFN0dWIgZnVuY3Rpb24gcmVzb2x2ZWQgd2l0aCBzdWNjZXNzO1xuICAgICAgICByZXNvbHZlKCdTdHViIHN1Y2Nlc3NmdWxseSBsb2FkZWQnKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWFzb246JywgcmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIFVzZWQgdG8gY2hlY2sgZm9yIHVwZGF0ZXMgYWJvdXQgY29tcG9uZW50cyBoYW5kbGVkIGluIHRoZSBDYXRhbG9ndWUgaW5jbHVkaW5nIHByb3RvY29sIHN0dWJzIGFuZCBIeXBlcnRpZXMuIGNoZWNrIHJlbGF0aW9uc2hpcCB3aXRoIGxpZmVjeWNsZSBtYW5hZ2VtZW50IHByb3ZpZGVkIGJ5IFNlcnZpY2UgV29ya2Vyc1xuICAqIEBwYXJhbSAge0NhdGFsb2d1ZVVSTH0gICAgICAgdXJsIHVybFxuICAqL1xuICBjaGVja0ZvclVwZGF0ZSh1cmwpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdW50aW1lVUE7XG4iLCIvKipcbiAqIEltcGxlbWVudHMgdGhlIFNhbmRib3ggaW50ZXJmYWNlIHRvIHByb3RlY3QgYWxsIGV4dGVybmFsIGNvZGU7XG4gKi9cbmNsYXNzIFNhbmRib3hCYXNlIHtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlQnVzKSB7XG4gIH1cblxuICAvKipcbiAgICogVG8gZG93bmxvYWQgYW5kIGRlcGxveSBhIG5ldyBjb21wb25lbnQgaW4gdGhlIHNhbmRib3ggcGFzc2luZyBhcyBpbnB1dCBwYXJhbWV0ZXJzIHRoZSB1cmwgZnJvbSB3aGVyZSB0aGUgY29tcG9uZW50cyBpcyBkb3dubG9hZGVkLCB0aGUgY29tcG9uZW50VVJMIGFkZHJlc3MgcHJldmlvdXNseSBhbGxvY2F0ZWQgdG8gdGhlIGNvbXBvbmVudCBhbmQgaXRzIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICAgICBjb21wb25lbnREb3dubG9hZFVSTCAgICAgIFNvdXJjZWNvZGUgQ29tcG9uZW50IGFkZHJlc3MgdXJsXG4gICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICAgICBjb21wb25lbnRVUkwgICAgICAgICAgICAgIENvbXBvbmVudCBhZGRyZXNzIHVybDtcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGNvbmZpZ3VyYXRpb24gICAgICAgICAgICAgQ29uZmlndXJhdGlvbiBvYmplY3Q7XG4gICAqL1xuICBkZXBsb3lDb21wb25lbnQoY29tcG9uZW50U291cmNlQ29kZSwgY29tcG9uZW50VVJMLCBjb25maWd1cmF0aW9uKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZW1vdmUgYSBjb21wb25lbnQgZnJvbSB0aGUgc2FuZGJveCBwYXNzaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgaXRzIFVSTC5cbiAgICogQHBhcmFtICB7VVJMLlVSTH0gICAgICAgIGNvbXBvbmVudFVSTCAgICAgICAgICAgICAgQ29tcG9uZW50IGFkZHJlc3MgdXJsO1xuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudFVSTCkge1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTYW5kYm94QmFzZTtcbiIsIi8qKlxuICAqIE1ha2UgYWpheCByZXF1ZXN0XG4gICovXG5jbGFzcyBSZXF1ZXN0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG1ldGhvZHMgPSB7Z2V0OiAnR0VUJywgcG9zdDogJ1BPU1QnLCBkZWxldGU6ICdERUxFVEUnLCBwdXQ6ICdQVVQnfTtcblxuICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBfdGhpc1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLm1ha2VSZXF1ZXN0KG1ldGhvZHNbbWV0aG9kXSwgdXJsLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgICAgfTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhamF4IHJlcXVlc3RcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIG1ldGhvZCAgdGhlIENSVUQgbWV0aG9kIChnZXQsIHBvc3QsIHB1dCwgZGVsZXRlKVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdXJsICAgICB0aGUgdXJsIHJlcXVlc3RlZCB0byBvYnRhaW4gYW4gcmVzcG9uc2VcbiAgICogQHBhcmFtICB7b2JqZWN0fSAgIHBhcmFtcyAgcGFzcyB0aGUgcGFyYW1ldGVycyB0byByZXF1ZXN0XG4gICAqIEBwYXJhbSAge29iamVjdH0gICBoZWFkZXJzIHNldCByZXF1ZXN0IGhlYWRlcnNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgbWFrZVJlcXVlc3QobWV0aG9kLCB1cmwsIHBhcmFtcywgaGVhZGVycykge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IGh0dHBSZXF1ZXN0O1xuXG4gICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7IC8vIE1vemlsbGEsIFNhZmFyaSwgLi4uXG4gICAgICAgIGh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7IC8vIElFXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaHR0cFJlcXVlc3QgPSBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBodHRwUmVxdWVzdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaHR0cFJlcXVlc3QpIHtcbiAgICAgICAgcmVqZWN0KCdHaXZpbmcgdXAgOiggQ2Fubm90IGNyZWF0ZSBhbiBYTUxIVFRQIGluc3RhbmNlJyk7XG4gICAgICB9XG5cbiAgICAgIGh0dHBSZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXG4gICAgICAvLyBTZXQgaGVhZGVycyB0byByZXF1ZXN0XG4gICAgICBpZiAoaGVhZGVycykge1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICAgIGh0dHBSZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaHR0cFJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGh0dHBSZXF1ZXN0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblxuICAgICAgICBpZiAoaHR0cFJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmIChodHRwUmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaHR0cFJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVzb2x2ZShodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBJZiBoYXZlIHBhcmFtcyBzZW5kIHRoZW0sIGluIHN0cmluZyBmb3JtYXRcbiAgICAgIGh0dHBSZXF1ZXN0LnNlbmQocGFyYW1zKTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuXG52YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KCk7XG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0O1xuIl19
