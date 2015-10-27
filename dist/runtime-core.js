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

    _this.db = {};
    _this.DB_NAME = 'registry-DB';
    _this.DB_VERSION = 1;
    _this.DB_STORE_HYPERTY = 'hyperty-list';
    _this.DB_STORE_STUB = 'protostub-list';
    _this.DB_STORE_SANDBOX = 'sandbox-list';

    var request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);

    request.onsuccess = function (event) {
      _this.db = this.result;
    };

    request.onerror = function (event) {
      console.error('Request open IndexedDB error:', event.target.errorCode);
    };

    request.onupgradeneeded = function (event) {
      var objectStore = event.currentTarget.result.createObjectStore(_this.DB_STORE_HYPERTY, { keyPath: 'hyperty' });
      objectStore.createIndex('pepURL', 'pepURL', { unique: false });
      objectStore.createIndex('identity', 'identity', { unique: false });

      //populate with the runtimeURL provided
      objectStore.put({ hyperty: _this.runtimeURL, pepURL: null,
        identity: _this.runtimeURL + '/identity' });

      var stubStore = event.currentTarget.result.createObjectStore(_this.DB_STORE_STUB, { keyPath: 'domainURL' });
      stubStore.createIndex('protostubURL', 'protostubURL', { unique: false });

      var sandboxStore = event.currentTarget.result.createObjectStore(_this.DB_STORE_SANDBOX, { keyPath: 'domainURL' });
      sandboxStore.createIndex('sandbox', 'sandbox', { unique: false });
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
        } else {

          //TODO call the post message to msgBus to read msg to get hyperty address allocation
          //let message = {header: {id: 1, from: _this.runtimeURL + '/protostub', to: _this.runtimeURL + '/protostub'},
          // body: {hypertyUrl: hypertyURL + '/protostub'}};
          //_this.test = _this.messageBus.postMessage(message);

          //TODO call the post message with create hypertyRegistration msg
          //let message = {header: {id: 1, from: _this.runtimeURL, to: 'sp1/msg-node/back-end'},
          // body: {'hypertyUrl': hypertyURL}};
          //_this.messageBus.postMessage(message);

          var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
          var storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);

          storeValue.put({ hyperty: hypertyURL, pepURL: null, identity: hypertyIdentity });

          transaction.oncomplete = function (event) {
            //add to the listener in messageBus
            //TODO check if those are the correct parameters
            _this.messageBus.addListener(hypertyURL + '/status', function (msg) {
              console.log('Message addListener: ' + msg);
            });
            resolve(hypertyURL);
          };

          transaction.onerror = function (event) {
            reject('Error on register hyperty');
          };
        }
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
          reject('Error on delete Hyperty');
        };

        request.onsuccess = function (event) {

          var data = request.result;
          if (data === undefined) {
            reject('Error hyperty not found');
          } else {

            var request2 = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY)['delete'](url);

            request2.onsuccess = function (event) {
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
      var objectStore = _this.db.transaction(_this.DB_STORE_STUB, 'readonly').objectStore(_this.DB_STORE_STUB);

      var promise = new Promise(function (resolve, reject) {

        var request = objectStore.get(url);

        request.onerror = function (event) {
          reject('requestUpdate couldn\' get the ProtostubURL');
          console.error('hyperty not found');
        };

        request.onsuccess = function (event) {
          var data = request.result;
          if (data !== undefined) {
            resolve(data.protostubURL);
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

        var transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite');
        var objectStore = transaction.objectStore(_this.DB_STORE_STUB);

        //TODO implement a unique number for the protostubURL
        runtimeProtoStubURL = domainURL + '/protostub/' + Math.floor(Math.random() * 10000 + 1);
        objectStore.put({ domainURL: domainURL, protostubURL: runtimeProtoStubURL });

        //check if messageBus is registered in registry or not
        transaction.onerror = function (event) {
          reject('Error on registerProtostub');
        };

        transaction.oncomplete = function (event) {
          resolve(runtimeProtoStubURL);
          _this.messageBus.addListener(runtimeProtoStubURL + '/status', function (msg) {
            console.log('RuntimeProtostubURL message: ', msg);
          });
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

        var objectStore = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite').objectStore(_this.DB_STORE_STUB);
        var request = objectStore.get(hypertyRuntimeURL);

        request.onerror = function (event) {
          reject('Error on unregisterStub');
        };

        request.onsuccess = function (event) {
          var data = request.result;

          if (data === undefined) {
            reject('Error on unregisterStub: Hyperty not found');
          } else {

            var request2 = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite').objectStore(_this.DB_STORE_STUB)['delete'](hypertyRuntimeURL);

            request2.onerror = function (event) {
              reject('Error on unregisterStub: error on database');
            };

            request2.onsuccess = function (event) {
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
              reject('Error on update registerPEP');
            };

            requestUpdate.onsuccess = function (event) {
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
              reject('Error on unregisterPEP: error on update dabatase');
            };

            requestUpdate.onsuccess = function (event) {
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
     * @param  {Sandbox}   sandbox
     * @param  {DomainURL} DomainURL url
     * @return {Promise}
     */

  }, {
    key: 'registerSandbox',
    value: function registerSandbox(sandbox, url) {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {

        var transaction = _this.db.transaction(_this.DB_STORE_SANDBOX, 'readwrite');
        var objectStore = transaction.objectStore(_this.DB_STORE_SANDBOX);

        objectStore.put({ domainURL: url, sandbox: sandbox });

        transaction.onerror = function (event) {
          reject('Error on register Sandbox');
        };

        transaction.oncomplete = function (event) {
          resolve('registered sandbox on url: ' + url);
        };
      });

      return promise;
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
      var objectStore = _this.db.transaction(_this.DB_STORE_SANDBOX, 'readonly').objectStore(_this.DB_STORE_SANDBOX);
      var request = objectStore.get(url);

      var promise = new Promise(function (resolve, reject) {

        request.onerror = function (event) {
          reject('requestUpdate couldn\' get the sandbox');
        };

        request.onsuccess = function (event) {
          var data = request.result;
          if (data !== undefined) {
            resolve(data.sandbox);
          } else {
            reject('No sandbox was found');
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
      var _this = this;

      var transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readonly');
      var objectStore = transaction.objectStore(_this.DB_STORE_STUB);
      var index = objectStore.index('protostubURL');

      var promise = new Promise(function (resolve, reject) {

        var request = index.get(url);

        request.onsuccess = function (event) {
          var matching = request.result;
          if (matching !== undefined) {
            resolve(matching.protostubURL);
          } else {
            reject('URL ' + url + ' not found');
          }
        };

        request.onerror = function (event) {
          reject('The url ' + url + ' doesn\'t exist: error on dababase');
        };
      });
      return promise;
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

        var _hypertyURL = undefined;
        var _hypertySandbox = undefined;
        var _hypertyDescriptor = undefined;
        var _hypertySourceCode = undefined;
        var _hypertyConfiguration = {
          url: 'ws://193.136.93.214:9090/ws',
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
          var hypertySourceCodeUrl = hyperty;

          // Get the hyperty source code
          return _utilsRequest2['default'].get(hypertySourceCodeUrl);
        }).then(function (hypertySourceCode) {

          console.info('2: return hyperty source code');
          _hypertySourceCode = hypertySourceCode;

          // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
          var message = {
            body: {
              value: 'hyperty-runtime://sp1/protostub/HelloHyperty'
            }
          };

          // Register hyperty;
          return _this.registry.registerHyperty(message, _hypertyDescriptor);
        }).then(function (hypertyURL) {
          console.info('3: return hyperty url, after register hyperty');

          _hypertyURL = hypertyURL;
          var inSameSandbox = true;

          // TODO: Check if the app and hyperty is in the same sandbox and
          if (inSameSandbox) {
            // TODO: getAppSandbox, this will return a promise;

            _hypertySandbox = _this.sandboxFactory.createAppSandbox();
            _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
          } else {
            // TODO: getHypertySandbox, this will return a promise;

            _hypertySandbox = _this.sandboxFactory.createSandbox();
            _hypertySandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
          }

          return _hypertySandbox;
        }).then(function (sandboxInstance) {
          console.info('4: return the sandbox instance after check if is in the same sandbox or not');

          // Add the message bus listener
          _this.messageBus.addListener(_hypertyURL, sandboxInstance);
        })
        // .then(function(result) {
        //   console.info('5: return deploy component for sandbox status');
        // })
        ['catch'](errorReason);
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
        var componentDownloadURL = 'dist/VertxProtoStub.js';
        var configuration = {
          url: 'ws://193.136.93.243:9090/ws',
          runtimeURL: 'runtime:/alice'
        };

        var _stubSandbox = undefined;
        var _runtimeSandboxURL = undefined;
        var _runtimeProtoStubURL = undefined;
        var _protoStubSourceCode = undefined;

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
          // return request.get(domain);
          return {};
        }).then(function (descriptor) {
          console.info('2. return the ProtoStub descriptor:', descriptor);
          stubDescriptor = descriptor;

          // Get the component source code referent to component download url;
          return _utilsRequest2['default'].get(componentDownloadURL);
        }).then(function (protoStubSourceCode) {
          console.info('3. return the ProtoStub Source Code: ');
          _protoStubSourceCode = protoStubSourceCode;

          return _this.registry.registerStub(domain);
        }).then(function (runtimeProtoStubURL) {
          console.info('4. return the runtimeProtoStubURL, After Register Stub');
          _runtimeProtoStubURL = runtimeProtoStubURL;

          // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
          // Instantiate the Sandbox
          _stubSandbox = _this.sandboxFactory.createSandbox();

          return _this.registry.registerSandbox(_stubSandbox, domain);
        }).then(function (runtimeSandboxURL) {
          console.info('5: return the sandbox runtime url', runtimeSandboxURL);
          _runtimeSandboxURL = runtimeSandboxURL;

          // Deploy Component
          return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
        }, function () {
          // TODO: delete this fallback;
          console.info('5.1: return the sandbox runtime url');
          _runtimeSandboxURL = 'ptinovacao.pt/sandbox/1234';

          // Deploy Component
          return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
        }).then(function (result) {
          console.info('6: return deploy component for sandbox status');

          // Handle with deployed component
          console.log('Component is deployed');

          // Add the message bus listener
          console.info('add message bus listener to: ', _runtimeProtoStubURL, ' on ', _stubSandbox);
          _this.messageBus.addListener(_runtimeProtoStubURL, _stubSandbox);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NZXNzYWdlQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9pZGVudGl0eS9JZGVudGl0eU1vZHVsZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcG9saWN5L1BvbGljeUVuZ2luZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcmVnaXN0cnkvUmVnaXN0cnkuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3J1bnRpbWUtY29yZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcnVudGltZS9SdW50aW1lVUEuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3gvU2FuZGJveC5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvdXRpbHMvcmVxdWVzdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7O0lDSU0sVUFBVTs7Ozs7OztBQVFILFdBUlAsVUFBVSxDQVFGLFFBQVEsRUFBRTswQkFSbEIsVUFBVTs7QUFTWixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFNBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQzNCLFNBQUssQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDO0FBQzFCLFNBQUssQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0dBRTFCOzs7Ozs7Ozs7ZUFmRyxVQUFVOztXQXVCSCxxQkFBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRTs7QUFFckMsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsY0FBYyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoRSxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pDLFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLEVBQUUsQ0FBQztBQUNkLGFBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQ3RDOztBQUVELGNBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsYUFBTyxJQUFJLENBQUM7S0FDYjs7Ozs7Ozs7Ozs7V0FTYSx3QkFBQyxjQUFjLEVBQUUsUUFBUSxFQUFFLGNBQWMsRUFBRTs7QUFFdkQsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxRSxVQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxRQUFRLEVBQUU7QUFDYixnQkFBUSxHQUFHLEVBQUUsQ0FBQztBQUNkLGFBQUssQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLEdBQUcsUUFBUSxDQUFDO09BQ2hEOztBQUVELGNBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEIsYUFBTyxJQUFJLENBQUM7S0FDYjs7Ozs7Ozs7V0FNVSxxQkFBQyxHQUFHLEVBQUU7QUFDZixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7Ozs7QUFPakIsV0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxZQUFZLEVBQUs7QUFDNUQsWUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNsRCxZQUFJLFFBQVEsRUFBRTtBQUNaLGtCQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFLO0FBQ3hCLGVBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDcEIsQ0FBQyxDQUFDO1NBQ0o7T0FDRixDQUFDLFNBQU0sQ0FBQyxVQUFTLENBQUMsRUFBRTtBQUNuQixlQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQyxDQUFDO09BQ3RDLENBQUMsQ0FBQztLQUNKOzs7U0FsRkcsVUFBVTs7O3FCQUFWLFVBQVU7O0lBcUZWLFdBQVc7Ozs7Ozs7QUFPSixXQVBQLFdBQVcsQ0FPSCxhQUFhLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRTswQkFQdEMsV0FBVzs7QUFRYixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFNBQUssQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDO0FBQ3JDLFNBQUssQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0dBQzVCOztlQWJHLFdBQVc7O1dBaUJULGtCQUFHO0FBQ1AsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksR0FBRyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QyxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDaEMsWUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7T0FDdkI7S0FDRjs7O1NBVk0sZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUFFOzs7U0FmM0IsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ3RGWCxjQUFjO1dBQWQsY0FBYzswQkFBZCxjQUFjOzs7ZUFBZCxjQUFjOzs7Ozs7Ozs7O1dBU0QsMkJBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsRUFFakQ7Ozs7Ozs7O0FBQUE7OztXQU9nQiwyQkFBQyxTQUFTLEVBQUUsTUFBTSxFQUFFOztLQUVwQzs7O1NBcEJHLGNBQWM7OztxQkF3QkwsY0FBYzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUN4QnZCLFlBQVk7V0FBWixZQUFZOzBCQUFaLFlBQVk7OztlQUFaLFlBQVk7Ozs7Ozs7O1dBT0wscUJBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxFQUU5Qjs7Ozs7OztBQUFBOzs7V0FNYSx3QkFBQyxPQUFPLEVBQUUsRUFFdkI7Ozs7Ozs7O0FBQUE7OztXQU9RLG1CQUFDLE9BQU8sRUFBRTs7S0FFbEI7OztTQTFCRyxZQUFZOzs7cUJBOEJILFlBQVk7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDOUJyQixRQUFROzs7Ozs7OztBQU9ELFdBUFAsUUFBUSxDQU9BLFVBQVUsRUFBRSxjQUFjLEVBQUU7MEJBUHBDLFFBQVE7O0FBU1YsUUFBSSxDQUFDLFVBQVUsRUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7O0FBRTNELFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQzs7QUFFakIsU0FBSyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7QUFDOUIsU0FBSyxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7O0FBRXRDLFNBQUssQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ2QsU0FBSyxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUM7QUFDOUIsU0FBSyxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDckIsU0FBSyxDQUFDLGdCQUFnQixHQUFHLGNBQWMsQ0FBQztBQUN4QyxTQUFLLENBQUMsYUFBYSxHQUFHLGdCQUFnQixDQUFDO0FBQ3ZDLFNBQUssQ0FBQyxnQkFBZ0IsR0FBRyxjQUFjLENBQUM7O0FBRXhDLFFBQUksT0FBTyxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7O0FBRTlELFdBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDbEMsV0FBSyxDQUFDLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0tBQ3hCLENBQUM7O0FBRUYsV0FBTyxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNoQyxhQUFPLENBQUMsS0FBSyxDQUFDLCtCQUErQixFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDeEUsQ0FBQzs7QUFFRixXQUFPLENBQUMsZUFBZSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3hDLFVBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUM1RCxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztBQUNoRCxpQkFBVyxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUM7QUFDN0QsaUJBQVcsQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDOzs7QUFHakUsaUJBQVcsQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUUsSUFBSTtBQUN4QyxnQkFBUSxFQUFFLEtBQUssQ0FBQyxVQUFVLEdBQUcsV0FBVyxFQUFDLENBQUMsQ0FBQzs7QUFFM0QsVUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQzFELEtBQUssQ0FBQyxhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsV0FBVyxFQUFDLENBQUMsQ0FBQztBQUMvQyxlQUFTLENBQUMsV0FBVyxDQUFDLGNBQWMsRUFBRSxjQUFjLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzs7QUFFdkUsVUFBSSxZQUFZLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQzdELEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxFQUFDLE9BQU8sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO0FBQ2xELGtCQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztLQUNqRSxDQUFDO0dBRUg7Ozs7Ozs7ZUFwREcsUUFBUTs7V0EwRE0sNEJBQUMsVUFBVSxFQUFFO0FBQzdCLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixXQUFLLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztLQUMvQjs7Ozs7Ozs7V0FNaUIsOEJBQUc7QUFDbkIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLGFBQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQztLQUN6Qjs7Ozs7Ozs7OztXQVFjLHlCQUFDLFdBQVcsRUFBRSxVQUFVLEVBQUU7QUFDdkMsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOzs7O0FBSWpCLFVBQUksVUFBVSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDOzs7O0FBSXhDLFVBQUksZUFBZSxHQUFHLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQzs7QUFFM0QsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFOztBQUVsRCxZQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO0FBQ2xDLGdCQUFNLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUNoRCxNQUFNOzs7Ozs7Ozs7Ozs7QUFZTCxjQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDNUUsY0FBSSxVQUFVLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQzs7QUFFakUsb0JBQVUsQ0FBQyxHQUFHLENBQUMsRUFBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBQyxDQUFDLENBQUM7O0FBRS9FLHFCQUFXLENBQUMsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFOzs7QUFHdkMsaUJBQUssQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFVBQVUsR0FBRyxTQUFTLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDNUQscUJBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDNUMsQ0FBQyxDQUFDO0FBQ0gsbUJBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztXQUNyQixDQUFDOztBQUVGLHFCQUFXLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3BDLGtCQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztXQUNyQyxDQUFDO1NBQ0g7T0FDRixDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7O1dBTWdCLDJCQUFDLEdBQUcsRUFBRTtBQUNyQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUU1RSxVQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBQyxNQUFNLEVBQUU7QUFDakQsWUFBSSxXQUFXLEdBQUcsV0FBVyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsRSxZQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuQyxlQUFPLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLGdCQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNuQyxDQUFDOztBQUVGLGVBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7O0FBRWxDLGNBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7QUFDMUIsY0FBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3RCLGtCQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztXQUNuQyxNQUFNOztBQUVMLGdCQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQ3hFLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsVUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVoRCxvQkFBUSxDQUFDLFNBQVMsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNuQyxxQkFBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7YUFDeEMsQ0FBQzs7QUFFRixvQkFBUSxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNqQyxxQkFBTyxDQUFDLEtBQUssQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO0FBQzNDLG9CQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQzthQUNyQyxDQUFDO1dBQ0g7U0FDRixDQUFDO09BQ0gsQ0FBQyxDQUFDOztBQUVILGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7Ozs7V0FPZ0IsMkJBQUMsR0FBRyxFQUFFO0FBQ3JCLFVBQUksQ0FBQyxHQUFHLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ2xELFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRXpHLFVBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFDLE1BQU0sRUFBRTs7QUFFakQsWUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFbkMsZUFBTyxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNoQyxnQkFBTSxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDdEQsaUJBQU8sQ0FBQyxLQUFLLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUNwQyxDQUFDOztBQUVGLGVBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDbEMsY0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUMxQixjQUFJLElBQUksS0FBSyxTQUFTLEVBQUU7QUFDdEIsbUJBQU8sQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7V0FDNUIsTUFBTTtBQUNMLGtCQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztXQUNyQztTQUNGLENBQUM7T0FDSCxDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7OztXQU9XLHNCQUFDLFNBQVMsRUFBRTtBQUN0QixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxtQkFBbUIsQ0FBQzs7QUFFeEIsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUMsTUFBTSxFQUFFOztBQUVqRCxZQUFJLEtBQUssQ0FBQyxVQUFVLEtBQUssU0FBUyxFQUFFO0FBQ2xDLGdCQUFNLENBQUMsc0NBQXNDLENBQUMsQ0FBQztTQUNoRDs7QUFFRCxZQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3pFLFlBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDOzs7QUFHL0QsMkJBQW1CLEdBQUcsU0FBUyxHQUFHLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEFBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUssR0FBSSxDQUFDLENBQUMsQ0FBQztBQUMxRixtQkFBVyxDQUFDLEdBQUcsQ0FBQyxFQUFDLFNBQVMsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLG1CQUFtQixFQUFDLENBQUMsQ0FBQzs7O0FBRzNFLG1CQUFXLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3BDLGdCQUFNLENBQUMsNEJBQTRCLENBQUMsQ0FBQztTQUN0QyxDQUFDOztBQUVGLG1CQUFXLENBQUMsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3ZDLGlCQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUM3QixlQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLEVBQUUsVUFBQyxHQUFHLEVBQUs7QUFDckUsbUJBQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLEVBQUUsR0FBRyxDQUFDLENBQUM7V0FDbkQsQ0FBQyxDQUFDO1NBQ0osQ0FBQztPQUNILENBQUMsQ0FBQzs7QUFFSCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7Ozs7Ozs7V0FNYSx3QkFBQyxpQkFBaUIsRUFBRTtBQUNoQyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxtQkFBbUIsQ0FBQzs7QUFFeEIsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUMsTUFBTSxFQUFFOztBQUVqRCxZQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDMUcsWUFBSSxPQUFPLEdBQUcsV0FBVyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDOztBQUVqRCxlQUFPLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLGdCQUFNLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNuQyxDQUFDOztBQUVGLGVBQU8sQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDbEMsY0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFMUIsY0FBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3RCLGtCQUFNLENBQUMsNENBQTRDLENBQUMsQ0FBQztXQUN0RCxNQUFNOztBQUVMLGdCQUFJLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUNuRSxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxVQUFPLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFN0Qsb0JBQVEsQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDakMsb0JBQU0sQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2FBQ3RELENBQUM7O0FBRUYsb0JBQVEsQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDbkMscUJBQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO2FBQ2pDLENBQUM7V0FDSDtTQUNGLENBQUM7T0FDSCxDQUFDLENBQUM7O0FBRUgsYUFBTyxPQUFPLENBQUM7S0FDaEI7Ozs7Ozs7Ozs7V0FRVSxxQkFBQyxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQ2hDLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLGFBQWEsQ0FBQzs7QUFFbEIsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUMsTUFBTSxFQUFFOztBQUVqRCxZQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hILFlBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXZDLGVBQU8sQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDaEMsaUJBQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDL0IsZ0JBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1NBQ2hDLENBQUM7O0FBRUYsZUFBTyxDQUFDLFNBQVMsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNsQyx1QkFBYSxHQUFHLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDakMsY0FBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFMUIsY0FBSSxJQUFJLEtBQUssU0FBUyxFQUFFO0FBQ3RCLGtCQUFNLENBQUMsc0JBQXNCLENBQUMsQ0FBQztXQUNoQyxNQUFNOztBQUVMLGdCQUFJLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQzs7QUFFNUIsZ0JBQUksYUFBYSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMseUJBQWEsQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDdEMsb0JBQU0sQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO2FBQ3ZDLENBQUM7O0FBRUYseUJBQWEsQ0FBQyxTQUFTLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDeEMscUJBQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzthQUN4QixDQUFDO1dBQ0g7U0FDRixDQUFDO09BQ0gsQ0FBQyxDQUFDOztBQUVILGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7OztXQU1ZLHVCQUFDLGlCQUFpQixFQUFFO0FBQy9CLFVBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixVQUFJLGFBQWEsQ0FBQzs7QUFFbEIsVUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUMsTUFBTSxFQUFFOztBQUVqRCxZQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLEVBQUUsV0FBVyxDQUFDLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hILFlBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzs7QUFFakQsZUFBTyxDQUFDLE9BQU8sR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNoQyxnQkFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7U0FDbEMsQ0FBQzs7QUFFRixlQUFPLENBQUMsU0FBUyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2xDLGNBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7O0FBRTFCLGNBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUN0QixrQkFBTSxDQUFDLDJDQUEyQyxDQUFDLENBQUM7V0FDckQsTUFBTTs7QUFFTCxnQkFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7O0FBRW5CLGdCQUFJLGFBQWEsR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzFDLHlCQUFhLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3RDLG9CQUFNLENBQUMsa0RBQWtELENBQUMsQ0FBQzthQUM1RCxDQUFDOztBQUVGLHlCQUFhLENBQUMsU0FBUyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ3hDLHFCQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQzthQUNyQyxDQUFDO1dBQ0g7U0FDRixDQUFDO09BQ0gsQ0FBQyxDQUFDOztBQUVILGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7OztXQU1NLGlCQUFDLEtBQUssRUFBRSxFQUVkOzs7Ozs7Ozs7QUFBQTs7O1dBUWMseUJBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRTtBQUM1QixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFVBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFDLE1BQU0sRUFBRTs7QUFFakQsWUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQzVFLFlBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7O0FBRWxFLG1CQUFXLENBQUMsR0FBRyxDQUFDLEVBQUMsU0FBUyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQzs7QUFFcEQsbUJBQVcsQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDcEMsZ0JBQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1NBQ3JDLENBQUM7O0FBRUYsbUJBQVcsQ0FBQyxVQUFVLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDdkMsaUJBQU8sQ0FBQyw2QkFBNkIsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUM5QyxDQUFDO09BQ0gsQ0FBQyxDQUFDOztBQUVILGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7Ozs7Ozs7V0FPUyxvQkFBQyxHQUFHLEVBQUU7QUFDZCxVQUFJLENBQUMsR0FBRyxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUNsRCxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsVUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLFVBQVUsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUMvRyxVQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVuQyxVQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBQyxNQUFNLEVBQUU7O0FBRWpELGVBQU8sQ0FBQyxPQUFPLEdBQUcsVUFBUyxLQUFLLEVBQUU7QUFDaEMsZ0JBQU0sQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1NBQ2xELENBQUM7O0FBRUYsZUFBTyxDQUFDLFNBQVMsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNsQyxjQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzFCLGNBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtBQUN0QixtQkFBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztXQUN2QixNQUFNO0FBQ0wsa0JBQU0sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO1dBQ2hDO1NBQ0YsQ0FBQztPQUNILENBQUMsQ0FBQzs7QUFFSCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7Ozs7Ozs7O1dBT00saUJBQUMsR0FBRyxFQUFFO0FBQ1gsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ3hFLFVBQUksV0FBVyxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQy9ELFVBQUksS0FBSyxHQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7O0FBRS9DLFVBQUksT0FBTyxHQUFHLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSzs7QUFFN0MsWUFBSSxPQUFPLEdBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFOUIsZUFBTyxDQUFDLFNBQVMsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUNsQyxjQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzlCLGNBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQixtQkFBTyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztXQUNoQyxNQUFNO0FBQ0wsa0JBQU0sQ0FBQyxNQUFNLEdBQUcsR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDO1dBQ3JDO1NBQ0YsQ0FBQzs7QUFFRixlQUFPLENBQUMsT0FBTyxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQ2hDLGdCQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsR0FBRyxvQ0FBb0MsQ0FBQyxDQUFDO1NBQ2pFLENBQUM7T0FDSCxDQUFDLENBQUM7QUFDSCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBOWNHLFFBQVE7OztxQkFrZEMsUUFBUTs7Ozs7Ozs7Ozs7O2dDQ3JkRyxxQkFBcUI7Ozs7OEJBQ3ZCLG1CQUFtQjs7OztBQUVwQyxJQUFJLFNBQVMsZ0NBQWdCLENBQUM7O0FBQzlCLElBQUksT0FBTyw4QkFBYyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs0QkNIYixrQkFBa0I7Ozs7OztnQ0FHakIsc0JBQXNCOzs7O3NDQUNoQiw0QkFBNEI7Ozs7a0NBQzlCLHdCQUF3Qjs7Ozs2QkFDMUIsbUJBQW1COzs7Ozs7OztJQUtwQyxTQUFTO0FBRUYsV0FGUCxTQUFTLENBRUQsY0FBYyxFQUFFOzBCQUZ4QixTQUFTOztBQUlYLFFBQUksQ0FBQyxjQUFjLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQywyQ0FBMkMsQ0FBQyxDQUFDOztBQUVsRixRQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7Ozs7OztBQU1qQixRQUFJLGlCQUFpQixHQUFHLHFDQUFxQyxDQUFDOztBQUU5RCxTQUFLLENBQUMsUUFBUSxHQUFHLGtDQUFhLGlCQUFpQixDQUFDLENBQUM7QUFDakQsU0FBSyxDQUFDLGNBQWMsR0FBRyx5Q0FBb0IsQ0FBQztBQUM1QyxTQUFLLENBQUMsWUFBWSxHQUFHLHFDQUFrQixDQUFDO0FBQ3hDLFNBQUssQ0FBQyxVQUFVLEdBQUcsK0JBQWUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVsRCxTQUFLLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQzs7QUFFcEQsa0JBQWMsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztBQUM3QyxTQUFLLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztHQUV2Qzs7Ozs7OztlQXhCRyxTQUFTOztXQThCRSx5QkFBQyxVQUFVLEVBQUUsRUFFM0I7Ozs7Ozs7O0FBQUE7OztXQU9jLHlCQUFDLGVBQWUsRUFBRSxVQUFVLEVBQUUsRUFFNUM7Ozs7Ozs7QUFBQTs7O1dBTVUscUJBQUMsT0FBTyxFQUFFOztBQUVuQixVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLFVBQUksQ0FBQyxPQUFPLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDOztBQUU1RSxhQUFPLElBQUksT0FBTyxDQUFDLFVBQVMsT0FBTyxFQUFFLE1BQU0sRUFBRTs7QUFFM0MsWUFBSSxXQUFXLFlBQUEsQ0FBQztBQUNoQixZQUFJLGVBQWUsWUFBQSxDQUFDO0FBQ3BCLFlBQUksa0JBQWtCLFlBQUEsQ0FBQztBQUN2QixZQUFJLGtCQUFrQixZQUFBLENBQUM7QUFDdkIsWUFBSSxxQkFBcUIsR0FBRztBQUMxQixhQUFHLEVBQUUsNkJBQTZCO0FBQ2xDLG9CQUFVLEVBQUUsZ0JBQWdCO1NBQzdCLENBQUM7O0FBRUYsWUFBSSxXQUFXLEdBQUcsU0FBZCxXQUFXLENBQVksTUFBTSxFQUFFOztBQUVqQyxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2hCLENBQUM7OztBQUdGLGVBQU8sMEJBQVEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLGlCQUFpQixFQUFFOztBQUUzRCxpQkFBTyxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDOztBQUU3Qyw0QkFBa0IsR0FBRyxpQkFBaUIsQ0FBQzs7OztBQUl2QyxjQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQzs7O0FBR25DLGlCQUFPLDBCQUFRLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQzFDLENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBUyxpQkFBaUIsRUFBRTs7QUFFaEMsaUJBQU8sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUM5Qyw0QkFBa0IsR0FBRyxpQkFBaUIsQ0FBQzs7O0FBR3ZDLGNBQUksT0FBTyxHQUFHO0FBQ1osZ0JBQUksRUFBRTtBQUNKLG1CQUFLLEVBQUUsOENBQThDO2FBQ3REO1dBQ0YsQ0FBQzs7O0FBR0YsaUJBQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsT0FBTyxFQUFFLGtCQUFrQixDQUFDLENBQUM7U0FDcEUsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFTLFVBQVUsRUFBRTtBQUN6QixpQkFBTyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDOztBQUU5RCxxQkFBVyxHQUFHLFVBQVUsQ0FBQztBQUN6QixjQUFJLGFBQWEsR0FBRyxJQUFJLENBQUM7OztBQUd6QixjQUFJLGFBQWEsRUFBRTs7O0FBR2pCLDJCQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0FBQzFELDJCQUFlLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxxQkFBcUIsQ0FBQyxDQUFDO1dBQ3pGLE1BQU07OztBQUdMLDJCQUFlLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUN2RCwyQkFBZSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUUscUJBQXFCLENBQUMsQ0FBQztXQUN6Rjs7QUFFRCxpQkFBTyxlQUFlLENBQUM7U0FDeEIsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFTLGVBQWUsRUFBRTtBQUM5QixpQkFBTyxDQUFDLElBQUksQ0FBQyw2RUFBNkUsQ0FBQyxDQUFDOzs7QUFHNUYsZUFBSyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBRTVELENBQUM7Ozs7aUJBSUksQ0FBQyxXQUFXLENBQUMsQ0FBQztPQUVyQixDQUFDLENBQUM7S0FFSjs7Ozs7Ozs7V0FNTyxrQkFBQyxNQUFNLEVBQUU7O0FBRWYsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQzs7QUFFM0QsYUFBTyxJQUFJLE9BQU8sQ0FBQyxVQUFTLE9BQU8sRUFBRSxNQUFNLEVBQUU7O0FBRTNDLFlBQUksY0FBYyxZQUFBLENBQUM7OztBQUduQixZQUFJLG9CQUFvQixHQUFHLHdCQUF3QixDQUFDO0FBQ3BELFlBQUksYUFBYSxHQUFHO0FBQ2xCLGFBQUcsRUFBRSw2QkFBNkI7QUFDbEMsb0JBQVUsRUFBRSxnQkFBZ0I7U0FDN0IsQ0FBQzs7QUFFRixZQUFJLFlBQVksWUFBQSxDQUFDO0FBQ2pCLFlBQUksa0JBQWtCLFlBQUEsQ0FBQztBQUN2QixZQUFJLG9CQUFvQixZQUFBLENBQUM7QUFDekIsWUFBSSxvQkFBb0IsWUFBQSxDQUFDOzs7QUFHekIsZUFBTyxLQUFLLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFTLFVBQVUsRUFBRTs7QUFFeEUsaUJBQU8sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDdkQsd0JBQWMsR0FBRyxVQUFVLENBQUM7QUFDNUIsaUJBQU8sY0FBYyxDQUFDO1NBQ3ZCLEVBQUUsVUFBUyxNQUFNLEVBQUU7O0FBRWxCLGlCQUFPLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLE1BQU0sQ0FBQyxDQUFDOzs7OztBQUtqRCxpQkFBTyxFQUFFLENBQUM7U0FDWCxDQUFDLENBQ0QsSUFBSSxDQUFDLFVBQVMsVUFBVSxFQUFFO0FBQ3pCLGlCQUFPLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0FBQ2hFLHdCQUFjLEdBQUcsVUFBVSxDQUFDOzs7QUFHNUIsaUJBQU8sMEJBQVEsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDMUMsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFTLG1CQUFtQixFQUFFO0FBQ2xDLGlCQUFPLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7QUFDdEQsOEJBQW9CLEdBQUcsbUJBQW1CLENBQUM7O0FBRTNDLGlCQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzVDLENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBUyxtQkFBbUIsRUFBRTtBQUNsQyxpQkFBTyxDQUFDLElBQUksQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO0FBQ3ZFLDhCQUFvQixHQUFHLG1CQUFtQixDQUFDOzs7O0FBSTNDLHNCQUFZLEdBQUcsS0FBSyxDQUFDLGNBQWMsQ0FBQyxhQUFhLEVBQUUsQ0FBQzs7QUFFcEQsaUJBQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQzdELENBQUMsQ0FDRCxJQUFJLENBQUMsVUFBUyxpQkFBaUIsRUFBRTtBQUNoQyxpQkFBTyxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO0FBQ3JFLDRCQUFrQixHQUFHLGlCQUFpQixDQUFDOzs7QUFHdkMsaUJBQU8sWUFBWSxDQUFDLGVBQWUsQ0FBQyxvQkFBb0IsRUFBRSxvQkFBb0IsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUNoRyxFQUFFLFlBQVc7O0FBRVosaUJBQU8sQ0FBQyxJQUFJLENBQUMscUNBQXFDLENBQUMsQ0FBQztBQUNwRCw0QkFBa0IsR0FBRyw0QkFBNEIsQ0FBQzs7O0FBR2xELGlCQUFPLFlBQVksQ0FBQyxlQUFlLENBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUUsYUFBYSxDQUFDLENBQUM7U0FDaEcsQ0FBQyxDQUNELElBQUksQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUNyQixpQkFBTyxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDOzs7QUFHOUQsaUJBQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLENBQUMsQ0FBQzs7O0FBR3JDLGlCQUFPLENBQUMsSUFBSSxDQUFDLCtCQUErQixFQUFFLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztBQUMxRixlQUFLLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxvQkFBb0IsRUFBRSxZQUFZLENBQUMsQ0FBQzs7O0FBR2pFLGlCQUFPLENBQUMsMEJBQTBCLENBQUMsQ0FBQztTQUNyQyxDQUFDLFNBQ0ksQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUN0QixpQkFBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFDO09BRUosQ0FBQyxDQUFDO0tBRUo7Ozs7Ozs7O1dBTWEsd0JBQUMsR0FBRyxFQUFFOztLQUVuQjs7O1NBaFBHLFNBQVM7OztxQkFvUEEsU0FBUzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUM3UGxCLFdBQVc7QUFFSixXQUZQLFdBQVcsQ0FFSCxVQUFVLEVBQUU7MEJBRnBCLFdBQVc7R0FHZDs7Ozs7Ozs7O2VBSEcsV0FBVzs7V0FXQSx5QkFBQyxtQkFBbUIsRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLEVBRWpFOzs7Ozs7OztXQU1jLHlCQUFDLFlBQVksRUFBRSxFQUU3Qjs7O1NBckJHLFdBQVc7OztxQkF5QkYsV0FBVzs7Ozs7Ozs7Ozs7Ozs7Ozs7SUN6QnBCLE9BQU87QUFFQSxXQUZQLE9BQU8sR0FFRzswQkFGVixPQUFPOztBQUlULFFBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUNqQixRQUFJLE9BQU8sR0FBRyxFQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxVQUFRLFFBQVEsRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFDLENBQUM7O0FBRXZFLFVBQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVMsTUFBTSxFQUFFO0FBQzVDLFdBQUssQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFTLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFO0FBQzdDLGVBQU8sS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQztPQUNqRSxDQUFDO0tBRUgsQ0FBQyxDQUFDO0dBRUo7Ozs7Ozs7Ozs7O2VBZEcsT0FBTzs7V0F3QkEscUJBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFOztBQUV4QyxVQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLGFBQU8sSUFBSSxPQUFPLENBQUMsVUFBUyxPQUFPLEVBQUUsTUFBTSxFQUFFOztBQUUzQyxZQUFJLFdBQVcsWUFBQSxDQUFDOztBQUVoQixZQUFJLE1BQU0sQ0FBQyxjQUFjLEVBQUU7O0FBQ3pCLHFCQUFXLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztTQUNwQyxNQUFNLElBQUksTUFBTSxDQUFDLGFBQWEsRUFBRTs7QUFDL0IsY0FBSTtBQUNGLHVCQUFXLEdBQUcsSUFBSSxhQUFhLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztXQUNuRCxDQUNELE9BQU8sQ0FBQyxFQUFFO0FBQ1IsZ0JBQUk7QUFDRix5QkFBVyxHQUFHLElBQUksYUFBYSxDQUFDLG1CQUFtQixDQUFDLENBQUM7YUFDdEQsQ0FDRCxPQUFPLEtBQUssRUFBRTtBQUNaLG9CQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDZjtXQUNGO1NBQ0Y7O0FBRUQsWUFBSSxDQUFDLFdBQVcsRUFBRTtBQUNoQixnQkFBTSxDQUFDLGdEQUFnRCxDQUFDLENBQUM7U0FDMUQ7O0FBRUQsbUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDOzs7QUFHOUIsWUFBSSxPQUFPLEVBQUU7QUFDWCxnQkFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBUyxNQUFNLEVBQUU7QUFDNUMsdUJBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7V0FDdkQsQ0FBQyxDQUFDO1NBQ0o7O0FBRUQsbUJBQVcsQ0FBQyxrQkFBa0IsR0FBRyxVQUFTLEtBQUssRUFBRTtBQUMvQyxjQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDOztBQUV0QyxjQUFJLFdBQVcsQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO0FBQ2hDLGdCQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssR0FBRyxFQUFFOztBQUU5QixxQkFBTyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUMvQixNQUFNO0FBQ0wsb0JBQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUM7YUFDOUI7V0FDRjtTQUNGLENBQUM7OztBQUdGLG1CQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO09BRTFCLENBQUMsQ0FBQztLQUVKOzs7U0EvRUcsT0FBTzs7O0FBbUZiLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7cUJBQ2IsT0FBTyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJleHBvcnQgZGVmYXVsdFxuLyoqXG4qIE1lc3NhZ2UgQlVTIEludGVyZmFjZVxuKi9cbmNsYXNzIE1lc3NhZ2VCdXMge1xuICAvKiBwcml2YXRlXG4gIF9yZWdpc3RyeTogUmVnaXN0cnlcblxuICBfc3Vic2NyaXB0aW9uczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT5cbiAgX2ludGVyY2VwdG9yczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT5cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihyZWdpc3RyeSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fcmVnaXN0cnkgPSByZWdpc3RyeTtcbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHt9O1xuICAgIF90aGlzLl9pbnRlcmNlcHRvcnMgPSB7fTtcblxuICB9XG5cbiAgLyoqXG4gICogVG8gYWRkIFwibGlzdGVuZXJcIiBmdW5jdGlvbnMgdG8gYmUgY2FsbGVkIHdoZW4gcm91dGluZyBtZXNzYWdlcyBwdWJsaXNoZWQgb24gYSBjZXJ0YWluIFwicmVzb3VyY2VcIiBvciBzZW5kIHRvIGEgY2VydGFpbiB1cmwuIE1lc3NhZ2VzIGFyZSByb3V0ZWQgdG8gaW5wdXQgcGFyYW1ldGVyIFwicmVkaXJlY3RUb1wiIGluIGNhc2UgbGlzdGVuZXIgaXMgbm90IGluIHRoZSBDb3JlIFJ1bnRpbWUuIFRoaXMgZnVuY3Rpb24gaXMgb25seSBhY2Nlc3NpYmxlIGJ5IGludGVybmFsIENvcmUgQ29tcG9uZW50cy4gVG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBqdXN0IGNhbGwgcmVtb3ZlKCkgZnVuY3Rpb24gZnJvbSByZXR1cm5lZCBvYmplY3QuXG4gICogQHBhcmFtIHtVUkwuVVJMfSB1cmwgICAgICB1cmxcbiAgKiBAcGFyYW0ge0xpc3RlbmVyfSBsaXN0ZW5lciBsaXN0ZW5lclxuICAqIEBwYXJhbSB7VVJMLlVSTH0gcmVkaXJlY3RUbyAgIHJlZGlyZWN0VG9cbiAgKi9cbiAgYWRkTGlzdGVuZXIodXJsLCBsaXN0ZW5lciwgcmVkaXJlY3RUbykge1xuICAgIC8vVE9ETzogaW5jbHVkZSBjb2RlIGZvciB0YXJnZXQgcmVkaXJlY3Rpb24uLi5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGl0ZW0gPSBuZXcgTXNnTGlzdGVuZXIoX3RoaXMuX3N1YnNjcmlwdGlvbnMsIHVybCwgbGlzdGVuZXIpO1xuICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gICAgaWYgKCFpdGVtTGlzdCkge1xuICAgICAgaXRlbUxpc3QgPSBbXTtcbiAgICAgIF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF0gPSBpdGVtTGlzdDtcbiAgICB9XG5cbiAgICBpdGVtTGlzdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICogVG8gYWRkIGFuIGludGVyY2VwdG9yIChlZyBhIFBvbGljeSBFbmZvcmNlcikgd2hpY2ggXCJsaXN0ZW5lclwiIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aGVuIHJvdXRpbmcgbWVzc2FnZXMgcHVibGlzaGVkIG9uIFwiaW50ZXJjZXB0ZWRVUkxcIiBvciBzZW5kIHRvIHRoZSBcImludGVyY2VwdGVkVVJMXCIuIFRvIGF2b2lkIGluZmluaXRlIGN5Y2xlcyBtZXNzYWdlcyBvcmlnaW5hdGVkIHdpdGggZnJvbSBcImludGVyY2VwdG9yVVJMXCIgYXJlIG5vdCBpbnRlcmNlcHRlZC4gVG8gcmVtb3ZlIHRoZSBpbnRlcmNlcHRvciBqdXN0IGNhbGwgcmVtb3ZlKCkgZnVuY3Rpb24gZnJvbSByZXR1cm5lZCBvYmplY3QuIFRoaXMgZnVuY3Rpb24gaXMgb25seSBhY2Nlc3NpYmxlIGJ5IGludGVybmFsIENvcmUgQ29tcG9uZW50cy5cbiAgKiBAcGFyYW0ge1VSTC5VUkx9IGludGVyY2VwdGVkVVJMIGludGVyY2VwdGVkVVJMXG4gICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXIgICAgICAgbGlzdGVuZXJcbiAgKiBAcGFyYW0ge1VSTC5VUkx9IGludGVyY2VwdG9yVVJMIGludGVyY2VwdG9yVVJMXG4gICogQHJldHVybiB7SW50ZXJjZXB0b3J9ICAgICAgICAgICAgICAgICBJbnRlcmNlcHRvclxuICAqL1xuICBhZGRJbnRlcmNlcHRvcihpbnRlcmNlcHRlZFVSTCwgbGlzdGVuZXIsIGludGVyY2VwdG9yVVJMKSB7XG4gICAgLy9UT0RPOiBpbmNsdWRlIGNvZGUgZm9yIGludGVyY2VwdG9yVVJMLi4uXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBpdGVtID0gbmV3IE1zZ0xpc3RlbmVyKF90aGlzLl9pbnRlcmNlcHRvcnMsIGludGVyY2VwdGVkVVJMLCBsaXN0ZW5lcik7XG4gICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX2ludGVyY2VwdG9yc1tpbnRlcmNlcHRlZFVSTF07XG4gICAgaWYgKCFpdGVtTGlzdCkge1xuICAgICAgaXRlbUxpc3QgPSBbXTtcbiAgICAgIF90aGlzLl9pbnRlcmNlcHRvcnNbaW50ZXJjZXB0ZWRVUkxdID0gaXRlbUxpc3Q7XG4gICAgfVxuXG4gICAgaXRlbUxpc3QucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHNlbmQgbWVzc2FnZXMuIFRoaXMgZnVuY3Rpb24gaXMgYWNjZXNzaWJsZSBvdXRzaWRlIHRoZSBDb3JlIHJ1bnRpbWVcbiAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9IG1zZyBtc2dcbiAgKi9cbiAgcG9zdE1lc3NhZ2UobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vdmVyaWZ5IGludGVyY2VwdGVkVVJMXG4gICAgLy9UT0RPOiBpbnRlcmNlcHQgVVJMIGlzIGNoZWNrZWQgdG8gZXhpdD8gb3IgaW50byB0aGUgXCJvbk1lc3NhZ2VcIj9cbiAgICAvL2lmKG1zZy5oZWFkZXIudG8pXG5cbiAgICAvL3Jlc29sdmUgcHJvdG9zdHViIFVSTFxuICAgIF90aGlzLl9yZWdpc3RyeS5yZXNvbHZlKG1zZy5oZWFkZXIudG8pLnRoZW4oKHByb3RvU3R1YlVSTCkgPT4ge1xuICAgICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbcHJvdG9TdHViVVJMXTtcbiAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICBpdGVtTGlzdC5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgICAgICBzdWIuX2NhbGxiYWNrKG1zZyk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdQUk9UTy1TVFVCLUVSUk9SOiAnLCBlKTtcbiAgICB9KTtcbiAgfVxufVxuXG5jbGFzcyBNc2dMaXN0ZW5lciB7XG4gIC8qIHByaXZhdGVcbiAgX3N1YnNjcmlwdGlvbnM6IDxzdHJpbmc6IE1zZ0xpc3RlbmVyW10+O1xuICBfdXJsOiBzdHJpbmc7XG4gIF9jYWxsYmFjazogKG1zZykgPT4gdm9pZDtcbiAgKi9cblxuICBjb25zdHJ1Y3RvcihzdWJzY3JpcHRpb25zLCB1cmwsIGNhbGxiYWNrKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0gc3Vic2NyaXB0aW9ucztcbiAgICBfdGhpcy5fdXJsID0gdXJsO1xuICAgIF90aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgZ2V0IHVybCgpIHsgcmV0dXJuIHRoaXMuX3VybDsgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHN1YnMgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tfdGhpcy5fdXJsXTtcbiAgICBpZiAoc3Vicykge1xuICAgICAgbGV0IGluZGV4ID0gc3Vicy5pbmRleE9mKF90aGlzKTtcbiAgICAgIHN1YnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gIH1cbn1cbiIsIi8qKlxuICogRnVuY3Rpb25zIHRvIGRlYWwgd2l0aCBhc3NlcnRpb25zIGNvbXBsaWFudCB3aXRoIFdlYlJUQyBSVENJZGVudGl0eVByb3ZpZGVyXG4gKi9cbmNsYXNzIElkZW50aXR5TW9kdWxlIHtcblxuICAvKipcbiAgICogR2VuZXJhdGVzIGFuIElkZW50aXR5IEFzc2VydGlvblxuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IGNvbnRlbnRzICAgICBjb250ZW50c1xuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IG9yaWdpbiAgICAgICBvcmlnaW5cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSB1c2VybmFtZUhpbnQgdXNlcm5hbWVIaW50XG4gICAqIEByZXR1cm4ge0lkQXNzZXJ0aW9ufSAgICAgICAgICAgICAgSWRBc3NlcnRpb25cbiAgICovXG4gIGdlbmVyYXRlQXNzZXJ0aW9uKGNvbnRlbnRzLCBvcmlnaW4sIHVzZXJuYW1lSGludCkge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAgKiBWYWxpZGF0ZXMgYW4gSWRlbnRpdHkgQXNzZXJ0aW9uXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gYXNzZXJ0aW9uIGFzc2VydGlvblxuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IG9yaWdpbiAgICBvcmlnaW5cbiAgICovXG4gIHZhbGlkYXRlQXNzZXJ0aW9uKGFzc2VydGlvbiwgb3JpZ2luKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSWRlbnRpdHlNb2R1bGU7XG4iLCIvKipcbiAqIENvcmUgUG9saWN5IEVuZ2luZSAoUERQL1BFUCkgSW50ZXJmYWNlXG4gKi9cbmNsYXNzIFBvbGljeUVuZ2luZSB7XG5cbiAgLyoqXG4gICAqIFRvIGFkZCBwb2xpY2llcyB0byBiZSBlbmZvcmNlZCBmb3IgYSBjZXJ0YWluIGRlcGxveWVkIEh5cGVydHkgSW5zdGFuY2VcbiAgICogQHBhcmFtIHtVUkwuSHlwZXJ0eVVSTH0gICAgIGh5cGVydHkgIGh5cGVydHlcbiAgICogQHBhcmFtIHtIeXBlcnR5UG9saWN5TGlzdH0gIHBvbGljaWVzIHBvbGljaWVzXG4gICAqL1xuICBhZGRQb2xpY2llcyhoeXBlcnR5LCBwb2xpY2llcykge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZW1vdmUgcHJldmlvdXNseSBhZGRlZCBwb2xpY2llcyBmb3IgYSBjZXJ0YWluIGRlcGxveWVkIEh5cGVydHkgSW5zdGFuY2VcbiAgICogQHBhcmFtICB7VVJMLkh5cGVydHlVUkx9ICBoeXBlcnR5ICAgICAgIGh5cGVydHlcbiAgICovXG4gIHJlbW92ZVBvbGljaWVzKGh5cGVydHkpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogQXV0aG9yaXNhdGlvbiByZXF1ZXN0IHRvIGFjY2VwdCBhIFN1YnNjcmlwdGlvbiBmb3IgYSBjZXJ0YWluIHJlc291cmNlLiBSZXR1cm5zIGEgUmVzcG9uc2UgTWVzc2FnZSB0byBiZSByZXR1cm5lZCB0byBTdWJzY3JpcHRpb24gcmVxdWVzdGVyXG4gICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gbWVzc2FnZSAgICAgICBtZXNzYWdlXG4gICAqIEByZXR1cm4ge0F1dGhvcmlzYXRpb25SZXNwb25zZX0gICAgICAgICAgICAgICAgIEF1dGhvcmlzYXRpb25SZXNwb25zZVxuICAgKi9cbiAgYXV0aG9yaXNlKG1lc3NhZ2UpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQb2xpY3lFbmdpbmU7XG4iLCIvKipcbiogUnVudGltZSBSZWdpc3RyeSBJbnRlcmZhY2VcbiovXG5jbGFzcyBSZWdpc3RyeSB7XG5cbiAgLyoqXG4gICogVG8gaW5pdGlhbGlzZSB0aGUgUnVudGltZSBSZWdpc3RyeSB3aXRoIHRoZSBSdW50aW1lVVJMIHRoYXQgd2lsbCBiZSB0aGUgYmFzaXMgdG8gZGVyaXZlIHRoZSBpbnRlcm5hbCBydW50aW1lIGFkZHJlc3NlcyB3aGVuIGFsbG9jYXRpbmcgYWRkcmVzc2VzIHRvIGludGVybmFsIHJ1bnRpbWUgY29tcG9uZW50LiBJbiBhZGRpdGlvbiwgdGhlIFJlZ2lzdHJ5IGRvbWFpbiBiYWNrLWVuZCB0byBiZSB1c2VkIHRvIHJlbW90ZWx5IHJlZ2lzdGVyIFJ1bnRpbWUgY29tcG9uZW50cywgaXMgYWxzbyBwYXNzZWQgYXMgaW5wdXQgcGFyYW1ldGVyLlxuICAqIEBwYXJhbSAge0h5cGVydHlSdW50aW1lVVJMfSAgIHJ1bnRpbWVVUkwgICAgICAgICAgICBydW50aW1lVVJMXG4gICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgICAgICAgcmVtb3RlUmVnaXN0cnkgICAgICAgIHJlbW90ZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKHJ1bnRpbWVVUkwsIHJlbW90ZVJlZ2lzdHJ5KSB7XG5cbiAgICBpZiAoIXJ1bnRpbWVVUkwpIHRocm93IG5ldyBFcnJvcigncnVudGltZVVSTCBpcyBtaXNzaW5nLicpO1xuICAgIC8qaWYgKCFyZW1vdGVSZWdpc3RyeSkgdGhyb3cgbmV3IEVycm9yKCdyZW1vdGVSZWdpc3RyeSBpcyBtaXNzaW9uJyk7Ki9cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMucnVudGltZVVSTCA9IHJ1bnRpbWVVUkw7XG4gICAgX3RoaXMucmVtb3RlUmVnaXN0cnkgPSByZW1vdGVSZWdpc3RyeTtcblxuICAgIF90aGlzLmRiID0ge307XG4gICAgX3RoaXMuREJfTkFNRSA9ICdyZWdpc3RyeS1EQic7XG4gICAgX3RoaXMuREJfVkVSU0lPTiA9IDE7XG4gICAgX3RoaXMuREJfU1RPUkVfSFlQRVJUWSA9ICdoeXBlcnR5LWxpc3QnO1xuICAgIF90aGlzLkRCX1NUT1JFX1NUVUIgPSAncHJvdG9zdHViLWxpc3QnO1xuICAgIF90aGlzLkRCX1NUT1JFX1NBTkRCT1ggPSAnc2FuZGJveC1saXN0JztcblxuICAgIGxldCByZXF1ZXN0ID0gaW5kZXhlZERCLm9wZW4oX3RoaXMuREJfTkFNRSwgX3RoaXMuREJfVkVSU0lPTik7XG5cbiAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBfdGhpcy5kYiA9IHRoaXMucmVzdWx0O1xuICAgIH07XG5cbiAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgY29uc29sZS5lcnJvcignUmVxdWVzdCBvcGVuIEluZGV4ZWREQiBlcnJvcjonLCBldmVudC50YXJnZXQuZXJyb3JDb2RlKTtcbiAgICB9O1xuXG4gICAgcmVxdWVzdC5vbnVwZ3JhZGVuZWVkZWQgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgbGV0IG9iamVjdFN0b3JlID0gZXZlbnQuY3VycmVudFRhcmdldC5yZXN1bHQuY3JlYXRlT2JqZWN0U3RvcmUoXG4gICAgICAgIF90aGlzLkRCX1NUT1JFX0hZUEVSVFksIHtrZXlQYXRoOiAnaHlwZXJ0eSd9KTtcbiAgICAgIG9iamVjdFN0b3JlLmNyZWF0ZUluZGV4KCdwZXBVUkwnLCAncGVwVVJMJywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICAgIG9iamVjdFN0b3JlLmNyZWF0ZUluZGV4KCdpZGVudGl0eScsICdpZGVudGl0eScsIHt1bmlxdWU6IGZhbHNlfSk7XG5cbiAgICAgIC8vcG9wdWxhdGUgd2l0aCB0aGUgcnVudGltZVVSTCBwcm92aWRlZFxuICAgICAgb2JqZWN0U3RvcmUucHV0KHtoeXBlcnR5OiBfdGhpcy5ydW50aW1lVVJMLCBwZXBVUkw6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgaWRlbnRpdHk6IF90aGlzLnJ1bnRpbWVVUkwgKyAnL2lkZW50aXR5J30pO1xuXG4gICAgICBsZXQgc3R1YlN0b3JlID0gZXZlbnQuY3VycmVudFRhcmdldC5yZXN1bHQuY3JlYXRlT2JqZWN0U3RvcmUoXG4gICAgICAgIF90aGlzLkRCX1NUT1JFX1NUVUIsIHtrZXlQYXRoOiAnZG9tYWluVVJMJ30pO1xuICAgICAgc3R1YlN0b3JlLmNyZWF0ZUluZGV4KCdwcm90b3N0dWJVUkwnLCAncHJvdG9zdHViVVJMJywge3VuaXF1ZTogZmFsc2V9KTtcblxuICAgICAgbGV0IHNhbmRib3hTdG9yZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKFxuICAgICAgICBfdGhpcy5EQl9TVE9SRV9TQU5EQk9YLCB7a2V5UGF0aDogJ2RvbWFpblVSTCd9KTtcbiAgICAgIHNhbmRib3hTdG9yZS5jcmVhdGVJbmRleCgnc2FuZGJveCcsICdzYW5kYm94Jywge3VuaXF1ZTogZmFsc2V9KTtcbiAgICB9O1xuXG4gIH1cblxuICAvKipcbiAgKiBSZWdpc3RlciB0aGUgbWVzc2FnZUJ1cywgc28gdGhlIHJlZ2lzdHJ5IGNhbiBtYWtlIGNhbGxzIHRvIG1lc3NhZ2VCdXNcbiAgKiBAcGFyYW0ge01lc3NhZ2VCdXN9ICAgICAgICAgICBtZXNzYWdlQnVzXG4gICovXG4gIHJlZ2lzdGVyTWVzc2FnZUJ1cyhtZXNzYWdlQnVzKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpcy5tZXNzYWdlQnVzID0gbWVzc2FnZUJ1cztcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybiB0aGUgbWVzc2FnZUJ1cyBpbiB0aGlzIFJlZ2lzdHJ5XG4gICogQHBhcmFtIHtNZXNzYWdlQnVzfSAgICAgICAgICAgbWVzc2FnZUJ1c1xuICAqL1xuICBkaXNjb3Zlck1lc3NhZ2VCdXMoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMubWVzc2FnZUJ1cztcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHJlZ2lzdGVyIGEgbmV3IEh5cGVydHkgaW4gdGhlIHJ1bnRpbWUgd2hpY2ggcmV0dXJucyB0aGUgSHlwZXJ0eVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBIeXBlcnR5LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gICAgIHBvc3RNZXNzYWdlICAgICAgICAgICBwb3N0TWVzc2FnZVxuICAqIEBwYXJhbSAge0h5cGVydHlDYXRhbG9ndWVVUkx9IEh5cGVydHlDYXRhbG9ndWVVUkwgICBkZXNjcmlwdG9yXG4gICogQHJldHVybiB7SHlwZXJ0eVVSTH0gICAgICAgICAgSHlwZXJ0eVVSTFxuICAqL1xuICByZWdpc3Rlckh5cGVydHkocG9zdE1lc3NhZ2UsIGRlc2NyaXB0b3IpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gYXNzdW1pbmcgdGhlIGh5cGVydHkgbmFtZSBjb21lIGluIHRoZSBib2R5IG9mIHRoZSBtZXNzYWdlXG4gICAgLy8gdGhpcyBpcyBhIHZlcnkgc2ltcGxlIHdheSB0byBkbyBpdCwganVzdCBmb3IgdGVzdFxuICAgIGxldCBoeXBlcnR5VVJMID0gcG9zdE1lc3NhZ2UuYm9keS52YWx1ZTtcblxuICAgIC8vVE9ETyBDYWxsIGdldCBJZGVudGl0eSBhbmQgc2V0IElkZW50aXR5IHRvIElkZW50aXR5IE1vZHVsZVxuICAgIC8vZm9yIHNpbXBsaWNpdHkgYWRkZWQgYW4gaWRlbnRpdHlcbiAgICBsZXQgaHlwZXJ0eUlkZW50aXR5ID0gcG9zdE1lc3NhZ2UuYm9keS52YWx1ZSArICcvaWRlbnRpdHknO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgaWYgKF90aGlzLm1lc3NhZ2VCdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZWplY3QoJ01lc3NhZ2VCdXMgbm90IGZvdW5kIG9uIHJlZ2lzdGVyU3R1YicpO1xuICAgICAgfSBlbHNlIHtcblxuICAgICAgICAvL1RPRE8gY2FsbCB0aGUgcG9zdCBtZXNzYWdlIHRvIG1zZ0J1cyB0byByZWFkIG1zZyB0byBnZXQgaHlwZXJ0eSBhZGRyZXNzIGFsbG9jYXRpb25cbiAgICAgICAgLy9sZXQgbWVzc2FnZSA9IHtoZWFkZXI6IHtpZDogMSwgZnJvbTogX3RoaXMucnVudGltZVVSTCArICcvcHJvdG9zdHViJywgdG86IF90aGlzLnJ1bnRpbWVVUkwgKyAnL3Byb3Rvc3R1Yid9LFxuICAgICAgICAvLyBib2R5OiB7aHlwZXJ0eVVybDogaHlwZXJ0eVVSTCArICcvcHJvdG9zdHViJ319O1xuICAgICAgICAvL190aGlzLnRlc3QgPSBfdGhpcy5tZXNzYWdlQnVzLnBvc3RNZXNzYWdlKG1lc3NhZ2UpO1xuXG4gICAgICAgIC8vVE9ETyBjYWxsIHRoZSBwb3N0IG1lc3NhZ2Ugd2l0aCBjcmVhdGUgaHlwZXJ0eVJlZ2lzdHJhdGlvbiBtc2dcbiAgICAgICAgLy9sZXQgbWVzc2FnZSA9IHtoZWFkZXI6IHtpZDogMSwgZnJvbTogX3RoaXMucnVudGltZVVSTCwgdG86ICdzcDEvbXNnLW5vZGUvYmFjay1lbmQnfSxcbiAgICAgICAgLy8gYm9keTogeydoeXBlcnR5VXJsJzogaHlwZXJ0eVVSTH19O1xuICAgICAgICAvL190aGlzLm1lc3NhZ2VCdXMucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICBsZXQgc3RvcmVWYWx1ZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuXG4gICAgICAgIHN0b3JlVmFsdWUucHV0KHtoeXBlcnR5OiBoeXBlcnR5VVJMLCBwZXBVUkw6IG51bGwsIGlkZW50aXR5OiBoeXBlcnR5SWRlbnRpdHl9KTtcblxuICAgICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAvL2FkZCB0byB0aGUgbGlzdGVuZXIgaW4gbWVzc2FnZUJ1c1xuICAgICAgICAgIC8vVE9ETyBjaGVjayBpZiB0aG9zZSBhcmUgdGhlIGNvcnJlY3QgcGFyYW1ldGVyc1xuICAgICAgICAgIF90aGlzLm1lc3NhZ2VCdXMuYWRkTGlzdGVuZXIoaHlwZXJ0eVVSTCArICcvc3RhdHVzJywgKG1zZykgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01lc3NhZ2UgYWRkTGlzdGVuZXI6ICcgKyBtc2cpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHJlc29sdmUoaHlwZXJ0eVVSTCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdHJhbnNhY3Rpb24ub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlciBoeXBlcnR5Jyk7XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgSHlwZXJ0eVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgdXJsICAgICAgICB1cmxcbiAgKi9cbiAgdW5yZWdpc3Rlckh5cGVydHkodXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJyk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gZGVsZXRlIEh5cGVydHknKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcblxuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBoeXBlcnR5IG5vdCBmb3VuZCcpO1xuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgdmFyIHJlcXVlc3QyID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpLlxuICAgICAgICAgIG9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpLmRlbGV0ZSh1cmwpO1xuXG4gICAgICAgICAgcmVxdWVzdDIub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoJ0h5cGVydHkgZGVsZXRlIHdpdGggc3VjY2VzcycpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXF1ZXN0Mi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGRlbGV0aW5nIGFuIEh5cGVydHknKTtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3IgZGVsZXRpbmcgYW4gSHlwZXJ0eScpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIGRpc2NvdmVyIHByb3RvY29sIHN0dWJzIGF2YWlsYWJsZSBpbiB0aGUgcnVudGltZSBmb3IgYSBjZXJ0YWluIGRvbWFpbi4gSWYgYXZhaWxhYmxlLCBpdCByZXR1cm5zIHRoZSBydW50aW1lIHVybCBmb3IgdGhlIHByb3RvY29sIHN0dWIgdGhhdCBjb25uZWN0cyB0byB0aGUgcmVxdWVzdGVkIGRvbWFpbi4gUmVxdWlyZWQgYnkgdGhlIHJ1bnRpbWUgQlVTIHRvIHJvdXRlIG1lc3NhZ2VzIHRvIHJlbW90ZSBzZXJ2ZXJzIG9yIHBlZXJzIChkbyB3ZSBuZWVkIHNvbWV0aGluZyBzaW1pbGFyIGZvciBIeXBlcnRpZXM/KS5cbiAgKiBAcGFyYW0gIHtEb21haW5VUkx9ICAgICAgICAgICBEb21haW5VUkwgICAgICAgICAgICB1cmxcbiAgKiBAcmV0dXJuIHtSdW50aW1lVVJMfSAgICAgICAgICAgUnVudGltZVVSTFxuICAqL1xuICBkaXNjb3ZlclByb3Rvc3R1Yih1cmwpIHtcbiAgICBpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgdXJsIG5lZWRlZCcpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG9iamVjdFN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfU1RVQiwgJ3JlYWRvbmx5Jykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgZ2V0IHRoZSBQcm90b3N0dWJVUkwnKTtcbiAgICAgICAgY29uc29sZS5lcnJvcignaHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc29sdmUoZGF0YS5wcm90b3N0dWJVUkwpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdCgnTm8gcHJvdG9zdHViVVJMIHdhcyBmb3VuZCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogVG8gcmVnaXN0ZXIgYSBuZXcgUHJvdG9jb2wgU3R1YiBpbiB0aGUgcnVudGltZSBpbmNsdWRpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyB0aGUgZnVuY3Rpb24gdG8gcG9zdE1lc3NhZ2UsIHRoZSBEb21haW5VUkwgdGhhdCBpcyBjb25uZWN0ZWQgd2l0aCB0aGUgc3R1Yiwgd2hpY2ggcmV0dXJucyB0aGUgUnVudGltZVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBQcm90b2NvbFN0dWIuXG4gICAqIEBwYXJhbSAge0RvbWFpblVSTH0gICAgIERvbWFpblVSTCBzZXJ2aWNlIHByb3ZpZGVyIGRvbWFpblxuICAgKiBAcmV0dXJuIHtSdW50aW1lUHJvdG9TdHViVVJMfVxuICAgKi9cbiAgcmVnaXN0ZXJTdHViKGRvbWFpblVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHJ1bnRpbWVQcm90b1N0dWJVUkw7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGlmIChfdGhpcy5tZXNzYWdlQnVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVqZWN0KCdNZXNzYWdlQnVzIG5vdCBmb3VuZCBvbiByZWdpc3RlclN0dWInKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfU1RVQiwgJ3JlYWR3cml0ZScpO1xuICAgICAgbGV0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG5cbiAgICAgIC8vVE9ETyBpbXBsZW1lbnQgYSB1bmlxdWUgbnVtYmVyIGZvciB0aGUgcHJvdG9zdHViVVJMXG4gICAgICBydW50aW1lUHJvdG9TdHViVVJMID0gZG9tYWluVVJMICsgJy9wcm90b3N0dWIvJyArIE1hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxKTtcbiAgICAgIG9iamVjdFN0b3JlLnB1dCh7ZG9tYWluVVJMOiBkb21haW5VUkwsIHByb3Rvc3R1YlVSTDogcnVudGltZVByb3RvU3R1YlVSTH0pO1xuXG4gICAgICAvL2NoZWNrIGlmIG1lc3NhZ2VCdXMgaXMgcmVnaXN0ZXJlZCBpbiByZWdpc3RyeSBvciBub3RcbiAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUHJvdG9zdHViJyk7XG4gICAgICB9O1xuXG4gICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVzb2x2ZShydW50aW1lUHJvdG9TdHViVVJMKTtcbiAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihydW50aW1lUHJvdG9TdHViVVJMICsgJy9zdGF0dXMnLCAobXNnKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1J1bnRpbWVQcm90b3N0dWJVUkwgbWVzc2FnZTogJywgbXNnKTtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgaHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclN0dWIoaHlwZXJ0eVJ1bnRpbWVVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9TVFVCLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWInKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcblxuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyU3R1YjogSHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIHZhciByZXF1ZXN0MiA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX1NUVUIsICdyZWFkd3JpdGUnKS5cbiAgICAgICAgICAgIG9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX1NUVUIpLmRlbGV0ZShoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgICAgICByZXF1ZXN0Mi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWI6IGVycm9yIG9uIGRhdGFiYXNlJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3QyLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKCdQcm90b3N0dWJVUkwgcmVtb3ZlZCcpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHJlZ2lzdGVyIGEgbmV3IFBvbGljeSBFbmZvcmNlciBpbiB0aGUgcnVudGltZSBpbmNsdWRpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyB0aGUgZnVuY3Rpb24gdG8gcG9zdE1lc3NhZ2UsIHRoZSBIeXBlcnR5VVJMIGFzc29jaWF0ZWQgd2l0aCB0aGUgUEVQLCB3aGljaCByZXR1cm5zIHRoZSBSdW50aW1lVVJMIGFsbG9jYXRlZCB0byB0aGUgbmV3IFBvbGljeSBFbmZvcmNlciBjb21wb25lbnQuXG4gICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBwb3N0TWVzc2FnZSBwb3N0TWVzc2FnZVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgICAgICAgICAgICBoeXBlcnR5XG4gICogQHJldHVybiB7SHlwZXJ0eVJ1bnRpbWVVUkx9ICAgSHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgcmVnaXN0ZXJQRVAocG9zdE1lc3NhZ2UsIGh5cGVydHkpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBoeXBlcnR5cGVwVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5KTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVVJMIG5vdCBmb3VuZCcpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUEVQJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGh5cGVydHlwZXBVUkwgPSBoeXBlcnR5ICsgJy9wZXAnO1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUEVQJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnBlcFVSTCA9IGh5cGVydHlwZXBVUkw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1cGRhdGUgcmVnaXN0ZXJQRVAnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmVzb2x2ZShoeXBlcnR5cGVwVVJMKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgSHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclBFUChIeXBlcnR5UnVudGltZVVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGh5cGVydHlwZXBVUkw7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCBvYmplY3RTdG9yZSA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX0hZUEVSVFksICdyZWFkd3JpdGUnKS5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KEh5cGVydHlSdW50aW1lVVJMKTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyUEVQJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclBFUDogaHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGRhdGEucGVwVVJMID0gbnVsbDtcblxuICAgICAgICAgIGxldCByZXF1ZXN0VXBkYXRlID0gb2JqZWN0U3RvcmUucHV0KGRhdGEpO1xuICAgICAgICAgIHJlcXVlc3RVcGRhdGUub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJQRVA6IGVycm9yIG9uIHVwZGF0ZSBkYWJhdGFzZScpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKCcgUEVQIHN1Y2Vzc2Z1bGx5IGRlbGV0ZWQnKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyByZWNlaXZlIHN0YXR1cyBldmVudHMgZnJvbSBjb21wb25lbnRzIHJlZ2lzdGVyZWQgaW4gdGhlIFJlZ2lzdHJ5LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gICAgIE1lc3NhZ2UuTWVzc2FnZSAgICAgICBldmVudFxuICAqL1xuICBvbkV2ZW50KGV2ZW50KSB7XG4gICAgLy8gVE9ETyBib2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHRvIHJlZ2lzdGVyIGEgbmV3IHJ1bnRpbWUgc2FuZGJveGVzIHBhc3NpbmcgYXMgaW5wdXQgdGhlIHNhbmRib3ggaW5zdGFuY2UgYW5kIHRoZSBkb21haW4gVVJMIGFzc29jaWF0ZWQgdG8gdGhlIHNhbmRib3ggaW5zdGFuY2UuXG4gICAqIEBwYXJhbSAge1NhbmRib3h9ICAgc2FuZGJveFxuICAgKiBAcGFyYW0gIHtEb21haW5VUkx9IERvbWFpblVSTCB1cmxcbiAgICogQHJldHVybiB7UHJvbWlzZX1cbiAgICovXG4gIHJlZ2lzdGVyU2FuZGJveChzYW5kYm94LCB1cmwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgdHJhbnNhY3Rpb24gPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9TQU5EQk9YLCAncmVhZHdyaXRlJyk7XG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9TQU5EQk9YKTtcblxuICAgICAgb2JqZWN0U3RvcmUucHV0KHtkb21haW5VUkw6IHVybCwgc2FuZGJveDogc2FuZGJveH0pO1xuXG4gICAgICB0cmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiByZWdpc3RlciBTYW5kYm94Jyk7XG4gICAgICB9O1xuXG4gICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVzb2x2ZSgncmVnaXN0ZXJlZCBzYW5kYm94IG9uIHVybDogJyArIHVybCk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyBkaXNjb3ZlciBzYW5kYm94ZXMgYXZhaWxhYmxlIGluIHRoZSBydW50aW1lIGZvciBhIGNlcnRhaW4gZG9tYWluLiBSZXF1aXJlZCBieSB0aGUgcnVudGltZSBVQSB0byBhdm9pZCBtb3JlIHRoYW4gb25lIHNhbmRib3ggZm9yIHRoZSBzYW1lIGRvbWFpbi5cbiAgKiBAcGFyYW0gIHtEb21haW5VUkx9IERvbWFpblVSTCB1cmxcbiAgKiBAcmV0dXJuIHtSdW50aW1lU2FuZGJveH0gICAgICAgICAgIFJ1bnRpbWVTYW5kYm94XG4gICovXG4gIGdldFNhbmRib3godXJsKSB7XG4gICAgaWYgKCF1cmwpIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIHVybCBuZWVkZWQnKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBvYmplY3RTdG9yZSA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX1NBTkRCT1gsICdyZWFkb25seScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX1NBTkRCT1gpO1xuICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgncmVxdWVzdFVwZGF0ZSBjb3VsZG5cXCcgZ2V0IHRoZSBzYW5kYm94Jyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEuc2FuZGJveCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdObyBzYW5kYm94IHdhcyBmb3VuZCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB2ZXJpZnkgaWYgc291cmNlIGlzIHZhbGlkIGFuZCB0byByZXNvbHZlIHRhcmdldCBydW50aW1lIHVybCBhZGRyZXNzIGlmIG5lZWRlZCAoZWcgcHJvdG9zdHViIHJ1bnRpbWUgdXJsIGluIGNhc2UgdGhlIG1lc3NhZ2UgaXMgdG8gYmUgZGlzcGF0Y2hlZCB0byBhIHJlbW90ZSBlbmRwb2ludCkuXG4gICogQHBhcmFtICB7VVJMLlVSTH0gIHVybCAgICAgICB1cmxcbiAgKiBAcmV0dXJuIHtQcm9taXNlPFVSTC5VUkw+fSAgICAgICAgICAgICAgICAgUHJvbWlzZSA8VVJMLlVSTD5cbiAgKi9cbiAgcmVzb2x2ZSh1cmwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfU1RVQiwgJ3JlYWRvbmx5Jyk7XG4gICAgbGV0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG4gICAgbGV0IGluZGV4ICA9IG9iamVjdFN0b3JlLmluZGV4KCdwcm90b3N0dWJVUkwnKTtcblxuICAgIGxldCBwcm9taXNlID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBsZXQgcmVxdWVzdCAgPSBpbmRleC5nZXQodXJsKTtcblxuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBsZXQgbWF0Y2hpbmcgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKG1hdGNoaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXNvbHZlKG1hdGNoaW5nLnByb3Rvc3R1YlVSTCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KCdVUkwgJyArIHVybCArICcgbm90IGZvdW5kJyk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgnVGhlIHVybCAnICsgdXJsICsgJyBkb2VzblxcJ3QgZXhpc3Q6IGVycm9yIG9uIGRhYmFiYXNlJyk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnk7XG4iLCJpbXBvcnQgUnVudGltZVVBQ29yZSBmcm9tICcuL3J1bnRpbWUvUnVudGltZVVBJztcbmltcG9ydCBTYW5kYm94QmFzZSBmcm9tICcuL3NhbmRib3gvU2FuZGJveCc7XG5cbmV4cG9ydCB2YXIgUnVudGltZVVBID0gUnVudGltZVVBQ29yZTtcbmV4cG9ydCB2YXIgU2FuZGJveCA9IFNhbmRib3hCYXNlO1xuIiwiLy8gdXRpbHNcbmltcG9ydCByZXF1ZXN0IGZyb20gJy4uL3V0aWxzL3JlcXVlc3QnO1xuXG4vLyBNYWluIGRlcGVuZGVjaWVzXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnkvUmVnaXN0cnknO1xuaW1wb3J0IElkZW50aXR5TW9kdWxlIGZyb20gJy4uL2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcbmltcG9ydCBQb2xpY3lFbmdpbmUgZnJvbSAnLi4vcG9saWN5L1BvbGljeUVuZ2luZSc7XG5pbXBvcnQgTWVzc2FnZUJ1cyBmcm9tICcuLi9idXMvTWVzc2FnZUJ1cyc7XG5cbi8qKlxuKiBSdW50aW1lIFVzZXIgQWdlbnQgSW50ZXJmYWNlXG4qL1xuY2xhc3MgUnVudGltZVVBIHtcblxuICBjb25zdHJ1Y3RvcihzYW5kYm94RmFjdG9yeSkge1xuXG4gICAgaWYgKCFzYW5kYm94RmFjdG9yeSkgdGhyb3cgbmV3IEVycm9yKCdUaGUgc2FuZGJveCBmYWN0b3J5IGlzIGEgbmVlZGVkIHBhcmFtZXRlcicpO1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIFRPRE86IHBvc3QgYW5kIHJldHVybiByZWdpc3RyeS9oeXBlcnR5UnVudGltZUluc3RhbmNlIHRvIGFuZCBmcm9tIEJhY2stZW5kIFNlcnZpY2VcbiAgICAvLyBmb3IgdGhlIHJlcXVlc3QgeW91IGNhbiB1c2UgdGhlIG1vZHVsZSByZXF1ZXN0IGluIHV0aWxzO1xuICAgIC8vIHRoZSByZXNwb25zZSBpcyBsaWtlOiBoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyM1xuXG4gICAgbGV0IGh5cGVydHlSdW50aW1lVVJMID0gJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzJztcblxuICAgIF90aGlzLnJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KGh5cGVydHlSdW50aW1lVVJMKTtcbiAgICBfdGhpcy5pZGVudGl0eU1vZHVsZSA9IG5ldyBJZGVudGl0eU1vZHVsZSgpO1xuICAgIF90aGlzLnBvbGljeUVuZ2luZSA9IG5ldyBQb2xpY3lFbmdpbmUoKTtcbiAgICBfdGhpcy5tZXNzYWdlQnVzID0gbmV3IE1lc3NhZ2VCdXMoX3RoaXMucmVnaXN0cnkpO1xuXG4gICAgX3RoaXMucmVnaXN0cnkucmVnaXN0ZXJNZXNzYWdlQnVzKF90aGlzLm1lc3NhZ2VCdXMpO1xuXG4gICAgc2FuZGJveEZhY3RvcnkubWVzc2FnZUJ1cyA9IF90aGlzLm1lc3NhZ2VCdXM7XG4gICAgX3RoaXMuc2FuZGJveEZhY3RvcnkgPSBzYW5kYm94RmFjdG9yeTtcblxuICB9XG5cbiAgLyoqXG4gICogQWNjb21vZGF0ZSBpbnRlcm9wZXJhYmlsaXR5IGluIEgySCBhbmQgcHJvdG8gb24gdGhlIGZseSBmb3IgbmV3bHkgZGlzY292ZXJlZCBkZXZpY2VzIGluIE0yTVxuICAqIEBwYXJhbSAge0NhdGFsb2d1ZURhdGFPYmplY3QuSHlwZXJ0eURlc2NyaXB0b3J9ICAgZGVzY3JpcHRvciAgICBkZXNjcmlwdG9yXG4gICovXG4gIGRpc2NvdmVySGlwZXJ0eShkZXNjcmlwdG9yKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogUmVnaXN0ZXIgSHlwZXJ0eSBkZXBsb3llZCBieSB0aGUgQXBwIHRoYXQgaXMgcGFzc2VkIGFzIGlucHV0IHBhcmFtZXRlci4gVG8gYmUgdXNlZCB3aGVuIEFwcCBhbmQgSHlwZXJ0aWVzIGFyZSBmcm9tIHRoZSBzYW1lIGRvbWFpbiBvdGhlcndpc2UgdGhlIFJ1bnRpbWVVQSB3aWxsIHJhaXNlIGFuIGV4Y2VwdGlvbiBhbmQgdGhlIEFwcCBoYXMgdG8gdXNlIHRoZSBsb2FkSHlwZXJ0eSguLikgZnVuY3Rpb24uXG4gICogQHBhcmFtICB7T2JqZWN0fSBPYmplY3QgICAgICAgICAgICAgICAgICAgaHlwZXJ0eUluc3RhbmNlXG4gICogQHBhcmFtICB7VVJMLkh5cGVydHlDYXRhbG9ndWVVUkx9ICAgICAgICAgZGVzY3JpcHRvciAgICAgIGRlc2NyaXB0b3JcbiAgKi9cbiAgcmVnaXN0ZXJIeXBlcnR5KGh5cGVydHlJbnN0YW5jZSwgZGVzY3JpcHRvcikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAqIERlcGxveSBIeXBlcnR5IGZyb20gQ2F0YWxvZ3VlIFVSTFxuICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgIGh5cGVydHkgaHlwZXJ0eUluc3RhbmNlIHVybDtcbiAgKi9cbiAgbG9hZEh5cGVydHkoaHlwZXJ0eSkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghaHlwZXJ0eSkgdGhyb3cgbmV3IEVycm9yKCdIeXBlcnR5IGRlc2NyaXB0b3IgdXJsIHBhcmFtZXRlciBpcyBuZWVkZWQnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IF9oeXBlcnR5VVJMO1xuICAgICAgbGV0IF9oeXBlcnR5U2FuZGJveDtcbiAgICAgIGxldCBfaHlwZXJ0eURlc2NyaXB0b3I7XG4gICAgICBsZXQgX2h5cGVydHlTb3VyY2VDb2RlO1xuICAgICAgbGV0IF9oeXBlcnR5Q29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgdXJsOiAnd3M6Ly8xOTMuMTM2LjkzLjIxNDo5MDkwL3dzJyxcbiAgICAgICAgcnVudGltZVVSTDogJ3J1bnRpbWU6L2FsaWNlJ1xuICAgICAgfTtcblxuICAgICAgbGV0IGVycm9yUmVhc29uID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdIeXBlcnR5IEVycm9yOicsIHJlYXNvbik7XG4gICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgfTtcblxuICAgICAgLy8gR2V0IEh5cGVydHkgZGVzY3JpcHRvclxuICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGh5cGVydHkpLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eURlc2NyaXB0b3IpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oJzE6IHJldHVybiBoeXBlcnR5IGRlc2NyaXB0b3InKTtcblxuICAgICAgICBfaHlwZXJ0eURlc2NyaXB0b3IgPSBoeXBlcnR5RGVzY3JpcHRvcjtcblxuICAgICAgICAvLyBUT0RPOiBVcGRhdGUgdGhpcyB2YXJpYWJsZXMgd2l0aCByZXN1bHQgb2YgdGhlIHJlcXVlc3RcbiAgICAgICAgLy8gVGhpcyB2YWx1ZXMgYXJlIG9ubHkgZm9yIHRlc3Rlcywgc2hvdWxkIGJlIHJlbW92ZWQ7XG4gICAgICAgIGxldCBoeXBlcnR5U291cmNlQ29kZVVybCA9IGh5cGVydHk7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBoeXBlcnR5IHNvdXJjZSBjb2RlXG4gICAgICAgIHJldHVybiByZXF1ZXN0LmdldChoeXBlcnR5U291cmNlQ29kZVVybCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eVNvdXJjZUNvZGUpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oJzI6IHJldHVybiBoeXBlcnR5IHNvdXJjZSBjb2RlJyk7XG4gICAgICAgIF9oeXBlcnR5U291cmNlQ29kZSA9IGh5cGVydHlTb3VyY2VDb2RlO1xuXG4gICAgICAgIC8vIFRPRE86IHJlbW92ZSBvciB1cGRhdGUgdGhpcyBtZXNzYWdlLCBiZWNhdXNlIHdlIGRvbid0IG5vdyBpZiB0aGUgcmVnaXN0ZXJIeXBlcnR5IGhhdmUgYSBtZXNzYWdlQnVzIGluc3RhbmNlIG9yIGFuIG1lc3NhZ2Ugb2JqZWN0O1xuICAgICAgICBsZXQgbWVzc2FnZSA9IHtcbiAgICAgICAgICBib2R5OiB7XG4gICAgICAgICAgICB2YWx1ZTogJ2h5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvSGVsbG9IeXBlcnR5J1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZWdpc3RlciBoeXBlcnR5O1xuICAgICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnkucmVnaXN0ZXJIeXBlcnR5KG1lc3NhZ2UsIF9oeXBlcnR5RGVzY3JpcHRvcik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eVVSTCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzM6IHJldHVybiBoeXBlcnR5IHVybCwgYWZ0ZXIgcmVnaXN0ZXIgaHlwZXJ0eScpO1xuXG4gICAgICAgIF9oeXBlcnR5VVJMID0gaHlwZXJ0eVVSTDtcbiAgICAgICAgbGV0IGluU2FtZVNhbmRib3ggPSB0cnVlO1xuXG4gICAgICAgIC8vIFRPRE86IENoZWNrIGlmIHRoZSBhcHAgYW5kIGh5cGVydHkgaXMgaW4gdGhlIHNhbWUgc2FuZGJveCBhbmRcbiAgICAgICAgaWYgKGluU2FtZVNhbmRib3gpIHtcbiAgICAgICAgICAvLyBUT0RPOiBnZXRBcHBTYW5kYm94LCB0aGlzIHdpbGwgcmV0dXJuIGEgcHJvbWlzZTtcblxuICAgICAgICAgIF9oeXBlcnR5U2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZUFwcFNhbmRib3goKTtcbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3guZGVwbG95Q29tcG9uZW50KF9oeXBlcnR5U291cmNlQ29kZSwgX2h5cGVydHlVUkwsIF9oeXBlcnR5Q29uZmlndXJhdGlvbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gVE9ETzogZ2V0SHlwZXJ0eVNhbmRib3gsIHRoaXMgd2lsbCByZXR1cm4gYSBwcm9taXNlO1xuXG4gICAgICAgICAgX2h5cGVydHlTYW5kYm94ID0gX3RoaXMuc2FuZGJveEZhY3RvcnkuY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICAgIF9oeXBlcnR5U2FuZGJveC5kZXBsb3lDb21wb25lbnQoX2h5cGVydHlTb3VyY2VDb2RlLCBfaHlwZXJ0eVVSTCwgX2h5cGVydHlDb25maWd1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBfaHlwZXJ0eVNhbmRib3g7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oc2FuZGJveEluc3RhbmNlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNDogcmV0dXJuIHRoZSBzYW5kYm94IGluc3RhbmNlIGFmdGVyIGNoZWNrIGlmIGlzIGluIHRoZSBzYW1lIHNhbmRib3ggb3Igbm90Jyk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBtZXNzYWdlIGJ1cyBsaXN0ZW5lclxuICAgICAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKF9oeXBlcnR5VVJMLCBzYW5kYm94SW5zdGFuY2UpO1xuXG4gICAgICB9KVxuICAgICAgLy8gLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAvLyAgIGNvbnNvbGUuaW5mbygnNTogcmV0dXJuIGRlcGxveSBjb21wb25lbnQgZm9yIHNhbmRib3ggc3RhdHVzJyk7XG4gICAgICAvLyB9KVxuICAgICAgLmNhdGNoKGVycm9yUmVhc29uKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBEZXBsb3kgU3R1YiBmcm9tIENhdGFsb2d1ZSBVUkwgb3IgZG9tYWluIHVybFxuICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICBkb21haW4gICAgICAgICAgZG9tYWluXG4gICovXG4gIGxvYWRTdHViKGRvbWFpbikge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghZG9tYWluKSB0aHJvdyBuZXcgRXJyb3IoJ2RvbWFpbiBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBzdHViRGVzY3JpcHRvcjtcblxuICAgICAgLy8gVE9ETzogdGVtcG9yYXJ5IGFkZHJlc3MgdGhpcyBvbmx5IHN0YXRpYyBmb3IgdGVzdGluZ1xuICAgICAgbGV0IGNvbXBvbmVudERvd25sb2FkVVJMID0gJ2Rpc3QvVmVydHhQcm90b1N0dWIuanMnO1xuICAgICAgbGV0IGNvbmZpZ3VyYXRpb24gPSB7XG4gICAgICAgIHVybDogJ3dzOi8vMTkzLjEzNi45My4yNDM6OTA5MC93cycsXG4gICAgICAgIHJ1bnRpbWVVUkw6ICdydW50aW1lOi9hbGljZSdcbiAgICAgIH07XG5cbiAgICAgIGxldCBfc3R1YlNhbmRib3g7XG4gICAgICBsZXQgX3J1bnRpbWVTYW5kYm94VVJMO1xuICAgICAgbGV0IF9ydW50aW1lUHJvdG9TdHViVVJMO1xuICAgICAgbGV0IF9wcm90b1N0dWJTb3VyY2VDb2RlO1xuXG4gICAgICAvLyBEaXNjb3ZlciBQcm90b2NvbCBTdHViXG4gICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnkuZGlzY292ZXJQcm90b3N0dWIoZG9tYWluKS50aGVuKGZ1bmN0aW9uKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgLy8gSXMgcmVnaXN0ZWQ/XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMS4gUHJvdG8gU3R1YiBEaXNjb3ZlcmVkOiAnLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgc3R1YkRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xuICAgICAgICByZXR1cm4gc3R1YkRlc2NyaXB0b3I7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gaXMgbm90IHJlZ2lzdGVkP1xuICAgICAgICBjb25zb2xlLmluZm8oJzEuIFByb3RvIFN0dWIgbm90IGZvdW5kOicsIHJlYXNvbik7XG5cbiAgICAgICAgLy8gVE9ETzogZ2V0IHByb3Rvc3R1YiB8IDxzcC1kb21haW4+Ly53ZWxsLWtub3duL3Byb3Rvc3R1YlxuICAgICAgICAvLyBmb3IgdGhlIHJlcXVlc3QgeW91IGNhbiB1c2UgdGhlIG1vZHVsZSByZXF1ZXN0IGluIHV0aWxzO1xuICAgICAgICAvLyByZXR1cm4gcmVxdWVzdC5nZXQoZG9tYWluKTtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRlc2NyaXB0b3IpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCcyLiByZXR1cm4gdGhlIFByb3RvU3R1YiBkZXNjcmlwdG9yOicsIGRlc2NyaXB0b3IpO1xuICAgICAgICBzdHViRGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjb21wb25lbnQgc291cmNlIGNvZGUgcmVmZXJlbnQgdG8gY29tcG9uZW50IGRvd25sb2FkIHVybDtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGNvbXBvbmVudERvd25sb2FkVVJMKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihwcm90b1N0dWJTb3VyY2VDb2RlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMy4gcmV0dXJuIHRoZSBQcm90b1N0dWIgU291cmNlIENvZGU6ICcpO1xuICAgICAgICBfcHJvdG9TdHViU291cmNlQ29kZSA9IHByb3RvU3R1YlNvdXJjZUNvZGU7XG5cbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVyU3R1Yihkb21haW4pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJ1bnRpbWVQcm90b1N0dWJVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc0LiByZXR1cm4gdGhlIHJ1bnRpbWVQcm90b1N0dWJVUkwsIEFmdGVyIFJlZ2lzdGVyIFN0dWInKTtcbiAgICAgICAgX3J1bnRpbWVQcm90b1N0dWJVUkwgPSBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgICAgIC8vIFRPRE86IENoZWNrIG9uIFBFUCAocG9saWN5IEVuZ2luZSkgaWYgd2UgbmVlZCB0aGUgc2FuZGJveCBhbmQgY2hlY2sgaWYgdGhlIFNhbmRib3ggRmFjdG9yeSBoYXZlIHRoZSBjb250ZXh0IHNhbmRib3g7XG4gICAgICAgIC8vIEluc3RhbnRpYXRlIHRoZSBTYW5kYm94XG4gICAgICAgIF9zdHViU2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZVNhbmRib3goKTtcblxuICAgICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnkucmVnaXN0ZXJTYW5kYm94KF9zdHViU2FuZGJveCwgZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihydW50aW1lU2FuZGJveFVSTCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzU6IHJldHVybiB0aGUgc2FuZGJveCBydW50aW1lIHVybCcsIHJ1bnRpbWVTYW5kYm94VVJMKTtcbiAgICAgICAgX3J1bnRpbWVTYW5kYm94VVJMID0gcnVudGltZVNhbmRib3hVUkw7XG5cbiAgICAgICAgLy8gRGVwbG95IENvbXBvbmVudFxuICAgICAgICByZXR1cm4gX3N0dWJTYW5kYm94LmRlcGxveUNvbXBvbmVudChfcHJvdG9TdHViU291cmNlQ29kZSwgX3J1bnRpbWVQcm90b1N0dWJVUkwsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIFRPRE86IGRlbGV0ZSB0aGlzIGZhbGxiYWNrO1xuICAgICAgICBjb25zb2xlLmluZm8oJzUuMTogcmV0dXJuIHRoZSBzYW5kYm94IHJ1bnRpbWUgdXJsJyk7XG4gICAgICAgIF9ydW50aW1lU2FuZGJveFVSTCA9ICdwdGlub3ZhY2FvLnB0L3NhbmRib3gvMTIzNCc7XG5cbiAgICAgICAgLy8gRGVwbG95IENvbXBvbmVudFxuICAgICAgICByZXR1cm4gX3N0dWJTYW5kYm94LmRlcGxveUNvbXBvbmVudChfcHJvdG9TdHViU291cmNlQ29kZSwgX3J1bnRpbWVQcm90b1N0dWJVUkwsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzY6IHJldHVybiBkZXBsb3kgY29tcG9uZW50IGZvciBzYW5kYm94IHN0YXR1cycpO1xuXG4gICAgICAgIC8vIEhhbmRsZSB3aXRoIGRlcGxveWVkIGNvbXBvbmVudFxuICAgICAgICBjb25zb2xlLmxvZygnQ29tcG9uZW50IGlzIGRlcGxveWVkJyk7XG5cbiAgICAgICAgLy8gQWRkIHRoZSBtZXNzYWdlIGJ1cyBsaXN0ZW5lclxuICAgICAgICBjb25zb2xlLmluZm8oJ2FkZCBtZXNzYWdlIGJ1cyBsaXN0ZW5lciB0bzogJywgX3J1bnRpbWVQcm90b1N0dWJVUkwsICcgb24gJywgX3N0dWJTYW5kYm94KTtcbiAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihfcnVudGltZVByb3RvU3R1YlVSTCwgX3N0dWJTYW5kYm94KTtcblxuICAgICAgICAvLyBMb2FkIFN0dWIgZnVuY3Rpb24gcmVzb2x2ZWQgd2l0aCBzdWNjZXNzO1xuICAgICAgICByZXNvbHZlKCdTdHViIHN1Y2Nlc3NmdWxseSBsb2FkZWQnKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdSZWFzb246JywgcmVhc29uKTtcbiAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIFVzZWQgdG8gY2hlY2sgZm9yIHVwZGF0ZXMgYWJvdXQgY29tcG9uZW50cyBoYW5kbGVkIGluIHRoZSBDYXRhbG9ndWUgaW5jbHVkaW5nIHByb3RvY29sIHN0dWJzIGFuZCBIeXBlcnRpZXMuIGNoZWNrIHJlbGF0aW9uc2hpcCB3aXRoIGxpZmVjeWNsZSBtYW5hZ2VtZW50IHByb3ZpZGVkIGJ5IFNlcnZpY2UgV29ya2Vyc1xuICAqIEBwYXJhbSAge0NhdGFsb2d1ZVVSTH0gICAgICAgdXJsIHVybFxuICAqL1xuICBjaGVja0ZvclVwZGF0ZSh1cmwpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdW50aW1lVUE7XG4iLCIvKipcbiAqIEltcGxlbWVudHMgdGhlIFNhbmRib3ggaW50ZXJmYWNlIHRvIHByb3RlY3QgYWxsIGV4dGVybmFsIGNvZGU7XG4gKi9cbmNsYXNzIFNhbmRib3hCYXNlIHtcblxuICBjb25zdHJ1Y3RvcihtZXNzYWdlQnVzKSB7XG4gIH1cblxuICAvKipcbiAgICogVG8gZG93bmxvYWQgYW5kIGRlcGxveSBhIG5ldyBjb21wb25lbnQgaW4gdGhlIHNhbmRib3ggcGFzc2luZyBhcyBpbnB1dCBwYXJhbWV0ZXJzIHRoZSB1cmwgZnJvbSB3aGVyZSB0aGUgY29tcG9uZW50cyBpcyBkb3dubG9hZGVkLCB0aGUgY29tcG9uZW50VVJMIGFkZHJlc3MgcHJldmlvdXNseSBhbGxvY2F0ZWQgdG8gdGhlIGNvbXBvbmVudCBhbmQgaXRzIGNvbmZpZ3VyYXRpb24uXG4gICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICAgICBjb21wb25lbnREb3dubG9hZFVSTCAgICAgIFNvdXJjZWNvZGUgQ29tcG9uZW50IGFkZHJlc3MgdXJsXG4gICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICAgICBjb21wb25lbnRVUkwgICAgICAgICAgICAgIENvbXBvbmVudCBhZGRyZXNzIHVybDtcbiAgICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGNvbmZpZ3VyYXRpb24gICAgICAgICAgICAgQ29uZmlndXJhdGlvbiBvYmplY3Q7XG4gICAqL1xuICBkZXBsb3lDb21wb25lbnQoY29tcG9uZW50U291cmNlQ29kZSwgY29tcG9uZW50VVJMLCBjb25maWd1cmF0aW9uKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyByZW1vdmUgYSBjb21wb25lbnQgZnJvbSB0aGUgc2FuZGJveCBwYXNzaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgaXRzIFVSTC5cbiAgICogQHBhcmFtICB7VVJMLlVSTH0gICAgICAgIGNvbXBvbmVudFVSTCAgICAgICAgICAgICAgQ29tcG9uZW50IGFkZHJlc3MgdXJsO1xuICAgKi9cbiAgcmVtb3ZlQ29tcG9uZW50KGNvbXBvbmVudFVSTCkge1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTYW5kYm94QmFzZTtcbiIsIi8qKlxuICAqIE1ha2UgYWpheCByZXF1ZXN0XG4gICovXG5jbGFzcyBSZXF1ZXN0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG1ldGhvZHMgPSB7Z2V0OiAnR0VUJywgcG9zdDogJ1BPU1QnLCBkZWxldGU6ICdERUxFVEUnLCBwdXQ6ICdQVVQnfTtcblxuICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBfdGhpc1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLm1ha2VSZXF1ZXN0KG1ldGhvZHNbbWV0aG9kXSwgdXJsLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgICAgfTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhamF4IHJlcXVlc3RcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIG1ldGhvZCAgdGhlIENSVUQgbWV0aG9kIChnZXQsIHBvc3QsIHB1dCwgZGVsZXRlKVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdXJsICAgICB0aGUgdXJsIHJlcXVlc3RlZCB0byBvYnRhaW4gYW4gcmVzcG9uc2VcbiAgICogQHBhcmFtICB7b2JqZWN0fSAgIHBhcmFtcyAgcGFzcyB0aGUgcGFyYW1ldGVycyB0byByZXF1ZXN0XG4gICAqIEBwYXJhbSAge29iamVjdH0gICBoZWFkZXJzIHNldCByZXF1ZXN0IGhlYWRlcnNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgbWFrZVJlcXVlc3QobWV0aG9kLCB1cmwsIHBhcmFtcywgaGVhZGVycykge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IGh0dHBSZXF1ZXN0O1xuXG4gICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7IC8vIE1vemlsbGEsIFNhZmFyaSwgLi4uXG4gICAgICAgIGh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7IC8vIElFXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaHR0cFJlcXVlc3QgPSBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBodHRwUmVxdWVzdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaHR0cFJlcXVlc3QpIHtcbiAgICAgICAgcmVqZWN0KCdHaXZpbmcgdXAgOiggQ2Fubm90IGNyZWF0ZSBhbiBYTUxIVFRQIGluc3RhbmNlJyk7XG4gICAgICB9XG5cbiAgICAgIGh0dHBSZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXG4gICAgICAvLyBTZXQgaGVhZGVycyB0byByZXF1ZXN0XG4gICAgICBpZiAoaGVhZGVycykge1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICAgIGh0dHBSZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaHR0cFJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGh0dHBSZXF1ZXN0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblxuICAgICAgICBpZiAoaHR0cFJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmIChodHRwUmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaHR0cFJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVzb2x2ZShodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBJZiBoYXZlIHBhcmFtcyBzZW5kIHRoZW0sIGluIHN0cmluZyBmb3JtYXRcbiAgICAgIGh0dHBSZXF1ZXN0LnNlbmQocGFyYW1zKTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuXG52YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KCk7XG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0O1xuIl19
