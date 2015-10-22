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

    //the hash table is create until find a better solution, to solve the
    // async calls problem on indexedDB in function with a return value
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
      var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
      var storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);

      storeValue.put({ hyperty: HypertyURL, protoStubURL: null,
        pepURL: null, sandboxURL: null });

      //add the hyperty in the hypertiesList hash table
      _this.hypertiesList[HypertyURL] = { protoStubURL: null,
        pepURL: null, sandboxURL: null };

      transaction.oncomplete = function (event) {
        //console.log('Hyperty registered with success');
      };

      transaction.onerror = function (event) {
        console.error('Hyperty registration error: ' + event.target.errorCode);
      };

      //TODO implement the associate to Idetity

      //TODO allocate address for the new Hyperty Instance

      //TODO register Hyperty at SP1 Registry

      return HypertyURL;
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
      var request = transaction.objectStore(_this.DB_STORE_HYPERTY);
      request['delete'](url);
      request.onsuccess = function (event) {
        // delete the hyperty in the hypertiesList hash table
        delete _this.hypertiesList[url];
      };
    }

    /**
    * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
    * @param  {DomainURL}           DomainURL            url
    * @return {RuntimeURL}           RuntimeURL
    */
  }, {
    key: 'discoverProtostub',
    value: function discoverProtostub(url) {
      if (!url) throw new Error('Parameter name needed');
      var _this = this;
      var runtimeURL = _this.hypertiesList[url];
      return runtimeURL.protoStubURL;
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

      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(domainURL);

      request.onerror = function (event) {
        console.error('domainURL not found');
      };

      request.onsuccess = function (event) {
        runtimeProtoStubURL = domainURL + '/protostub';
        var data = request.result;
        data.protoStubURL = runtimeProtoStubURL;

        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.error('requestUpdate error: ' + event.target.errorCode);
        };

        requestUpdate.onsuccess = function (event) {
          //update the value in the hypertiesList hash table
          var hashValue = _this.hypertiesList[domainURL];
          var newHashValue = { protoStubURL: runtimeProtoStubURL,
            pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL };
          _this.hypertiesList[domainURL] = newHashValue;
        };
      };

      //TODO call the addListener function in Msg BUS

      return runtimeProtoStubURL;
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

      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(hypertyRuntimeURL);

      request.onerror = function (event) {
        console.error('hypertyRuntimeURL not found');
      };

      request.onsuccess = function (event) {
        var data = request.result;
        data.protoStubURL = null;

        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.error('requestUpdate error: ' + event.target.errorCode);
        };

        requestUpdate.onsuccess = function (event) {
          //update the value in the hypertiesList hash table
          var hashValue = _this.hypertiesList[hypertyRuntimeURL];
          var newHashValue = { protoStubURL: null,
            pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL };
          _this.hypertiesList[hypertyRuntimeURL] = newHashValue;
        };
      };
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

      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(hyperty);

      request.onerror = function (event) {
        console.error('hyperty not found');
      };

      request.onsuccess = function (event) {
        hypertypepURL = hyperty + '/pep';
        var data = request.result;
        data.pepURL = hypertypepURL;

        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.error('requestUpdate error: ' + event.target.errorCode);
        };

        requestUpdate.onsuccess = function (event) {
          //update the value in the hypertiesList hash table
          var hashValue = _this.hypertiesList[hyperty];
          var newHashValue = { protoStubURL: hashValue.protoStubURL,
            pepURL: hypertypepURL, sandboxURL: hashValue.sandboxURL };
          _this.hypertiesList[hyperty] = newHashValue;
        };
      };

      return hypertypepURL;
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

      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(HypertyRuntimeURL);

      request.onerror = function (event) {
        console.error('hyperty not found');
      };

      request.onsuccess = function (event) {
        var data = request.result;
        data.pepURL = null;

        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.error('requestUpdate error: ' + event.target.errorCode);
        };

        requestUpdate.onsuccess = function (event) {
          //update the value in the hypertiesList hash table
          var hashValue = _this.hypertiesList[HypertyRuntimeURL];
          var newHashValue = { protoStubURL: hashValue.protoStubURL,
            pepURL: null, sandboxURL: hashValue.sandboxURL };
          _this.hypertiesList[HypertyRuntimeURL] = newHashValue;
        };
      };
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

      request.onerror = function (event) {
        console.error('hyperty not found');
      };

      request.onsuccess = function (event) {
        runtimeSandboxURL = url + '/sandbox';
        var data = request.result;
        data.sandboxURL = runtimeSandboxURL;

        var requestUpdate = objectStore.put(data);
        requestUpdate.onerror = function (event) {
          console.error('requestUpdate error: ' + event.target.errorCode);
        };

        requestUpdate.onsuccess = function (event) {
          //update the value in the hypertiesList hash table
          var hashValue = _this.hypertiesList[url];
          var newHashValue = { protoStubURL: hashValue.protoStubURL,
            pepURL: hashValue.pepURL, sandboxURL: runtimeSandboxURL };
          _this.hypertiesList[url] = newHashValue;
        };
      };

      return runtimeSandboxURL;

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
      return runtimeURL.sandboxURL;
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

        var hypertyURL = undefined;
        var hypertyConfiguration = {};

        var errorReason = function errorReason(reason) {
          // console.log('Hyperty Error:', reason);
          reject(reason);
        };

        // Get Hyperty descriptor
        _utilsRequest2['default'].get(hyperty).then(function (hypertyDescriptor) {

          console.info('1: return hyperty descriptor');

          // TODO: remove or update this message, because we don't now if the registerHyperty have a messageBus instance or an message object;
          var message = {
            body: {
              value: 'hyperty-runtime://sp1/protostub/123/'
            }
          };

          // Register hyperty;
          return _this.registry.registerHyperty(message, hypertyDescriptor);
        }).then(function (hypertyURL) {
          console.info('2: return hypertyURL');

          // TODO: Update this variables with result of the request
          // This values are only for testes, should be removed;
          var hypertySourceCodeUrl = 'dist/VertxProtoStub.js';

          hypertyURL = hypertyURL;

          // Get the hyperty source code
          return _utilsRequest2['default'].get(hypertySourceCodeUrl);
        }).then(function (result) {
          console.info('3: return hyperty source code');
          var sourceCode = result;

          var stubSandbox = _this.sandboxFactory.createSandbox();

          resolve({ code: sourceCode, hypertyURL: hypertyURL, hypertyConfiguration: hypertyConfiguration, messageBus: _this.messageBus });
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

        // Discover Protocol Stub
        stubDescriptor = _this.registry.discoverProtostub(domain);

        if (!stubDescriptor) {

          // TODO: get protostub | <sp-domain>/.well-known/protostub
          // for the request you can use the module request in utils;
          stubDescriptor = _this.registry.registerStub(domain);
        }

        // TODO: temporary address this only static for testing
        var stubURL = 'hyperty-runtime://sp1/protostub/123';
        var componentDownloadURL = 'dist/VertxProtoStub.js';
        var configuration = {
          url: 'ws://localhost:9090/ws',
          runtimeURL: 'runtime:/alice'
        };

        // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
        // Instantiate the Sandbox
        var stubSandbox = _this.sandboxFactory.createSandbox();

        // Register Sandbox on the Registry
        var runtimeSandboxURL = undefined;

        // Register Sandbox
        _this.registry.registerSandbox(domain).then(function (result) {
          console.info('step 1: return the sandbox runtime url');

          // Save the sandbox runtime URL
          runtimeSandboxURL = result.sandboxURL;

          // Get the component source code referent to component download url;
          return _utilsRequest2['default'].get(componentDownloadURL);
        }).then(function (result) {
          console.info('step 2: return the component Source Code');

          // Deploy Component
          return stubSandbox.deployComponent(result, runtimeSandboxURL, configuration);
        }).then(function (result) {
          console.info('step 3: deploy component for sandbox');

          // Add the message bus listener
          _this.messageBus.addListener(stubURL, stubSandbox);

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