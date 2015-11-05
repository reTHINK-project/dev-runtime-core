(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.runtimeCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _MiniBus2 = require('./MiniBus');

var _MiniBus3 = _interopRequireDefault(_MiniBus2);

/**
* Message BUS Interface is an extension of the MiniBus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/

var MessageBus = (function (_MiniBus) {
  _inherits(MessageBus, _MiniBus);

  /* private
  _registry: Registry
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  function MessageBus(registry) {
    _classCallCheck(this, MessageBus);

    _get(Object.getPrototypeOf(MessageBus.prototype), 'constructor', this).call(this);
    this._registry = registry;
  }

  _createClass(MessageBus, [{
    key: '_onPostMessage',
    value: function _onPostMessage(msg) {
      var _this = this;

      //resolve external protostub...
      _this._registry.resolve(msg.header.to).then(function (protoStubURL) {
        var itemList = _this._subscriptions[protoStubURL];
        if (itemList) {
          _this._publishOn(itemList, msg);
        }
      })['catch'](function (e) {
        console.log('PROTO-STUB-ERROR: ', e);
      });
    }
  }]);

  return MessageBus;
})(_MiniBus3['default']);

exports['default'] = MessageBus;
module.exports = exports['default'];

},{"./MiniBus":2}],2:[function(require,module,exports){
/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var MiniBus = (function () {
  /* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _replyTimeOut: number
  _replyCallbacks: <url+id: (msg) => void>
  */

  function MiniBus() {
    _classCallCheck(this, MiniBus);

    var _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._replyTimeOut = 3000; //default to 3s
    _this._replyCallbacks = {};

    _this._registerExternalListener();
  }

  /**
  * Register listener to receive message when "msg.header.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "header.to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */

  _createClass(MiniBus, [{
    key: 'addListener',
    value: function addListener(url, listener) {
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
     * Manually add a reply listener. Only one listener per message ID should exist.
     * ATENTION, there is no timeout for this listener.
     * The listener should be removed with a removeReplyListener, failing to do this will result in a unreleased memory problem.
     * @param {URL} url Origin address of the message sent, "msg.header.from".
     * @param {number} msgId Message ID that is returned from the postMessage.
     * @param {Function} replyListener Callback function for the reply
     */
  }, {
    key: 'addReplyListener',
    value: function addReplyListener(url, msgId, replyListener) {
      var replyId = url + msgId;
      _this._replyCallbacks[replyId] = replyListener;
    }

    /**
     * Remove the reply listener.
     * @param {URL} url Origin address of the message sent, "msg.header.from".
     * @param {number} msgId  Message ID that is returned from the postMessage
     */
  }, {
    key: 'removeReplyListener',
    value: function removeReplyListener(url, msgId) {
      var replyId = url + msgId;
      delete _this._replyCallbacks[replyId];
    }

    /**
    * Send messages to local listeners, or if not exists to external listeners.
    * It's has an optional mechanism for automatic management of reply handlers.
    * The reply handler will be unregistered after receiving the reply, or after reply timeout (default to 3s).
    * @param  {Message} msg Message to send. Message ID is automatically added to the message.
    * @param  {Function} replyCallback Optional parameter, if the developer what's automatic reply management.
    * @return {number} Returns the message ID, in case it should be needed for manual management of the reply handler.
    */
  }, {
    key: 'postMessage',
    value: function postMessage(msg, replyCallback) {
      var _this = this;

      //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
      //Global counter will not work, because there will be multiple MiniBus instances!
      //Per URL, can be a lot of data to maintain!
      //Maybe a counter per MiniBus instance. This is the assumed solution for now.
      if (!msg.header.id) {
        _this._msgId++;
        msg.header.id = _this._msgId;
      }

      //automatic management of reply handlers
      if (replyCallback) {
        (function () {
          var replyId = msg.header.from + msg.header.id;
          _this._replyCallbacks[replyId] = replyCallback;

          setTimeout(function () {
            delete _this._replyCallbacks[replyId];
            var errorMsg = {
              header: { id: msg.header.id, type: 'reply' },
              body: { code: 'error', desc: 'Reply timeout!' }
            };

            replyCallback(errorMsg);
          }, _this._replyTimeOut);
        })();
      }

      if (!_this._onReply(msg)) {
        var itemList = _this._subscriptions[msg.header.to];
        if (itemList) {
          //do not publish on default address, because of loopback cycle
          _this._publishOn(itemList, msg);
        } else {
          //if there is no listener, send to external interface
          _this._onPostMessage(msg);
        }
      }

      return msg.header.id;
    }

    /**
     * Helper method to bind listeners (in both directions) into other MiniBus target.
     * @param  {URL} outUrl Outbound URL, register listener for url in direction "this -> target"
     * @param  {URL} inUrl Inbound URL, register listener for url in direction "target -> this"
     * @param  {MiniBus} target The other target MiniBus
     * @return {Bound} an object that contains the properties [thisListener, targetListener] and the unbind method.
     */
  }, {
    key: 'bind',
    value: function bind(outUrl, inUrl, target) {
      var _this2 = this;

      var _this = this;

      var thisListn = _this.addListener(outUrl, function (msg) {
        target.postMessage(msg);
      });

      var targetListn = target.addListener(inUrl, function (msg) {
        _this.postMessage(msg);
      });

      return {
        thisListener: thisListn,
        targetListener: targetListn,
        unbind: function unbind() {
          _this2.thisListener.remove();
          _this2.targetListener.remove();
        }
      };
    }

    //publish on a subscription list.
  }, {
    key: '_publishOn',
    value: function _publishOn(itemList, msg) {
      itemList.forEach(function (sub) {
        sub._callback(msg);
      });
    }
  }, {
    key: '_onReply',
    value: function _onReply(msg) {
      var _this = this;

      if (msg.header.type === 'reply') {
        var replyId = msg.header.to + msg.header.id;
        var replyFun = _this._replyCallbacks[replyId];
        delete _this._replyCallbacks[replyId];

        if (replyFun) {
          replyFun(msg);
          return true;
        }
      }

      return false;
    }

    //receive messages from external interface
  }, {
    key: '_onMessage',
    value: function _onMessage(msg) {
      var _this = this;

      if (!_this._onReply(msg)) {
        var itemList = _this._subscriptions[msg.header.to];
        if (itemList) {
          _this._publishOn(itemList, msg);
        } else {
          //is there any "*" (default) listeners?
          itemList = _this._subscriptions['*'];
          if (itemList) {
            _this._publishOn(itemList, msg);
          }
        }
      }
    }

    /**
     * Not public available, used by the class extension implementation, to process messages from the public "postMessage" without a registered listener.
     * Used to send the message to an external interface, like a WebWorker, IFrame, etc.
     * @param  {Message.Message} msg Message
     */
  }, {
    key: '_onPostMessage',
    value: function _onPostMessage(msg) {} /*implementation will send message to external system*/

    /**
     * Not public available, used by the class extension implementation, to process all messages that enter the MiniBus from an external interface, like a WebWorker, IFrame, etc.
     * This method is called one time in the constructor to register external listeners.
     * The implementation will probably call the "_onMessage" method to publish in the local listeners.
     * DO NOT call "postMessage", there is a danger that the message enters in a cycle!
     */

  }, {
    key: '_registerExternalListener',
    value: function _registerExternalListener() {/*implementation will register external listener and call "this._onMessage(msg)" */}
  }]);

  return MiniBus;
})();

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

        //if there are no listeners, remove the subscription entirely.
        if (subs.length === 0) {
          delete _this._subscriptions[_this._url];
        }
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

exports['default'] = MiniBus;
module.exports = exports['default'];

},{}],3:[function(require,module,exports){
/**
 * IdentityModule
 *
 * Initial specification: D4.1
 *
 * The IdentityModule is a component managing user Identity. It downloads, instantiates
 * and manage Identity Provider Proxy (IdP) for its own user identity or for external
 * user identity verification.
 *
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var IdentityModule = (function () {

  /**
   * USER'S OWN IDENTITY
   */

  function IdentityModule() {
    _classCallCheck(this, IdentityModule);
  }

  /**
   * Register a new Identity with an Identity Provider
   */

  _createClass(IdentityModule, [{
    key: "registerIdentity",
    value: function registerIdentity() {}
    // Body...

    /**
     * In relation with a classical Relying Party: Registration
     */

  }, {
    key: "registerWithRP",
    value: function registerWithRP() {}
    // Body...

    /**
     * In relation with a classical Relying Party: Login
     */

  }, {
    key: "loginWithRP",
    value: function loginWithRP() {}
    // Body...

    /**
     * In relation with a Hyperty Instance: Associate identity
     */

  }, {
    key: "setHypertyIdentity",
    value: function setHypertyIdentity() {}
    // Body...

    /**
     * Generates an Identity Assertion for a call session
     * @param  {DOMString} contents     contents
     * @param  {DOMString} origin       origin
     * @param  {DOMString} usernameHint usernameHint
     * @return {IdAssertion}              IdAssertion
     */

  }, {
    key: "generateAssertion",
    value: function generateAssertion(contents, origin, usernameHint) {}
    // Body...

    /**
     * OTHER USER'S IDENTITY
     */

    /**
     * Verification of a received IdAssertion validity
     * @param  {DOMString} assertion assertion
     */

  }, {
    key: "validateAssertion",
    value: function validateAssertion(assertion) {}
    // Body...

    /**
     * Trust level evaluation of a received IdAssertion
     * @param  {DOMString} assertion assertion
     */

  }, {
    key: "getAssertionTrustLevel",
    value: function getAssertionTrustLevel(assertion) {
      // Body...
    }
  }]);

  return IdentityModule;
})();

exports["default"] = IdentityModule;
module.exports = exports["default"];

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsEventEmitter = require('../utils/EventEmitter');

var _utilsEventEmitter2 = _interopRequireDefault(_utilsEventEmitter);

/**
* Runtime Registry Interface
*/

var Registry = (function (_EventEmitter) {
  _inherits(Registry, _EventEmitter);

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {AppSandbox}          appSandbox            appSandbox
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */

  function Registry(msgbus, runtimeURL, appSandbox, remoteRegistry) {
    _classCallCheck(this, Registry);

    // NOTE if the database structure is changed it might cause errors, run the following command
    // indexedDB.deleteDatabase('registry-DB'); this will delete the database, with the old structure

    // how some functions receive the parameters for example:
    // new Registry(msgbus, 'hyperty-runtime://sp1/123', appSandbox, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/
    _get(Object.getPrototypeOf(Registry.prototype), 'constructor', this).call(this);

    var _this = this;

    _this.registryURL = runtimeURL + '/registry/123';
    _this.messageBus = msgbus;
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;

    _this.db = {};
    _this.DB_NAME = 'registry-DB';
    _this.DB_VERSION = 1;
    _this.DB_STORE_HYPERTY = 'hyperty-list';
    _this.DB_STORE_STUB = 'protostub-list';

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
      objectStore.createIndex('sandbox', 'sandbox', { unique: false });

      //populate with the runtimeURL provided
      objectStore.put({ hyperty: 'test', pepURL: null,
        identity: 'testID' });

      var stubStore = event.currentTarget.result.createObjectStore(_this.DB_STORE_STUB, { keyPath: 'domainURL' });
      stubStore.createIndex('protostubURL', 'protostubURL', { unique: false });
      stubStore.createIndex('sandbox', 'sandbox', { unique: false });

      stubStore.put({ domainURL: 'testStub', protostubURL: 'testStubURL' });
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
    * Register the runtimeUA, so the registry can make calls to runtimeUA
    * @param {RuntimeUA}           runtimeUA
    */
  }, {
    key: 'registerRuntimeUA',
    value: function registerRuntimeUA(runtimeUA) {
      var _this = this;
      _this.runtimeUA = runtimeUA;
    }

    /**
    * Return the runtimeUA in this Registry
    * @param {RuntimeUA}           runtimeUA
    */
  }, {
    key: 'discoverRuntimeUA',
    value: function discoverRuntimeUA() {
      var _this = this;
      return _this.runtimeUA;
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
    * This function is used to return the sandbox instance where the Application is executing. It is assumed there is just one App per Runtime instance.
    */
  }, {
    key: 'getAppSandbox',
    value: function getAppSandbox() {
      var _this = this;
      return _this.appSandbox;
    }

    /**
    * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
    * @param  {Sandbox}             sandbox               sandbox
    * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
    * @return {HypertyURL}          HypertyURL
    */
  }, {
    key: 'registerHyperty',
    value: function registerHyperty(sandbox, descriptor) {
      var _this = this;

      //assuming descriptor come in this format, the service-provider-domain url is retrieved by a split instruction
      //hyperty-catalogue://<service-provider-domain>/<catalogue-object-identifier>
      var descriptorSplit = descriptor.split('/');
      var hypertyURL = descriptorSplit[2];

      //TODO Call get Identity and set Identity to Identity Module
      //for simplicity added an identity
      var hypertyIdentity = hypertyURL + '/identity';

      var promise = new Promise(function (resolve, reject) {

        if (_this.messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        } else {
          //call check if the protostub exist

          _this.resolve('hyperty-runtime://' + hypertyURL).then(function () {

            // addListener with the callback to execute when receive a message from the address-allocation
            var item = _this.messageBus.addListener(_this.registryURL, function (msg) {
              var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
              var storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);
              var url = msg.body.hypertyRuntime;

              storeValue.put({ hyperty: url, pepURL: null,
                identity: url + '/identity', sandbox: sandbox });

              //TODO register this hyperty in the Global Registry

              transaction.oncomplete = function (event) {
                //add to the listener in messageBus
                _this.messageBus.addListener(url + '/status', function (msg) {
                  console.log('Message addListener: ' + msg);
                });
                resolve(url);
                item.remove();
              };

              transaction.onerror = function (event) {
                reject('Error on register hyperty');
                item.remove();
              };
            });

            //Message to request address allocated for new Hyperty Instance
            var message = { header: { id: 1,
                type: 'CREATE',
                from: _this.registryURL,
                to: 'runtime://sp1/msg-node/address-allocation' },
              body: { hypertyURL: 'hyperty://' + hypertyURL + '/hy123' } };

            _this.messageBus.postMessage(message);

            //TODO remove later, just for tests
            //function to simulate the response from the address-allocation
            setTimeout(function () {
              var message = { header: { id: 1,
                  type: 'CREATE',
                  from: 'runtime://sp1/msg-node/address-allocation',
                  to: _this.registryURL },
                body: { hypertyURL: 'hyperty://' + hypertyURL + '/hy123',
                  hypertyRuntime: 'hyperty-runtime://' + hypertyURL + '/123' } };
              _this.messageBus.postMessage(message);
            }, 500);

            //TODO call the post message with create hypertyRegistration msg
          });
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
     * @param {Sandbox}        Sandbox
     * @param  {DomainURL}     DomainURL service provider domain
     * @return {RuntimeProtoStubURL}
     */
  }, {
    key: 'registerStub',
    value: function registerStub(sandBox, domainURL) {
      var _this = this;
      var runtimeProtoStubURL;

      var promise = new Promise(function (resolve, reject) {

        if (_this.messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        }

        var transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite');
        var objectStore = transaction.objectStore(_this.DB_STORE_STUB);

        //TODO implement a unique number for the protostubURL
        runtimeProtoStubURL = domainURL + '/protostub/' + 123; //Math.floor((Math.random() * 10000) + 1);
        objectStore.put({ domainURL: domainURL, protostubURL: runtimeProtoStubURL, sandbox: sandBox });

        //check if messageBus is registered in registry or not
        transaction.onerror = function (event) {
          reject('Error on registerProtostub');
        };

        transaction.oncomplete = function (event) {
          resolve(runtimeProtoStubURL);

          _this.messageBus.addListener('hyperty-runtime://' + runtimeProtoStubURL, function (msg) {
            if (msg.header.resource === msg.header.to + '/status') {
              console.log('RuntimeProtostubURL/status message: ', msg.body.value);
            }
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
    * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
    * @param  {DomainURL} DomainURL url
    * @return {RuntimeSandbox}           RuntimeSandbox
    */

  }, {
    key: 'getSandbox',
    value: function getSandbox(url) {
      if (!url) throw new Error('Parameter url needed');
      var _this = this;
      var objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readonly').objectStore(_this.DB_STORE_HYPERTY);
      var request = objectStore.get(url);

      //This function check in both DB_STORE_STUB and DB_STORE_HYPERTY
      var promise = new Promise(function (resolve, reject) {

        request.onerror = function (event) {
          reject('requestUpdate couldn\'t get the sandbox');
        };

        request.onsuccess = function (event) {
          var data = request.result;
          if (data !== undefined) {
            resolve(data.sandbox);
          } else {
            (function () {
              var stubStore = _this.db.transaction(_this.DB_STORE_STUB, 'readonly').objectStore(_this.DB_STORE_STUB);
              var stubRequest = stubStore.get(url);

              stubRequest.onerror = function (event) {
                reject('requestUpdate couldn\'t get the sandbox');
              };

              stubRequest.onsuccess = function (event) {
                var data = stubRequest.result;
                if (data !== undefined) {
                  resolve(data.sandbox);
                } else {
                  reject('No sandbox was found');
                }
              };
            })();
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
    value: (function (_resolve) {
      function resolve(_x) {
        return _resolve.apply(this, arguments);
      }

      resolve.toString = function () {
        return _resolve.toString();
      };

      return resolve;
    })(function (url) {
      console.log('resolve ' + url);
      var _this = this;

      _this.addEventListener('runtime:stubLoaded', function () {
        resolve(domainUrl);
      });

      //split the url to find the domainURL. deals with the url for example as:
      //"hyperty-runtime://sp1/protostub/123",
      var urlSplit = url.split('/');
      var domainUrl = urlSplit[2];

      var transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readonly');
      var objectStore = transaction.objectStore(_this.DB_STORE_STUB);

      var promise = new Promise(function (resolve, reject) {

        var request = objectStore.get(domainUrl);

        request.onsuccess = function (event) {
          var matching = request.result;
          if (matching !== undefined) {
            resolve(url);
          } else {
            _this.trigger('runtime:loadStub', domainUrl);

            //TODO delete later. Function to simulate a loadStub response
            /*setTimeout(function() {
              _this.registerStub(domainUrl + '/sanbbox', domainUrl).then(function() {
                resolve(domainUrl);
              });
            }, 250);
            */

            //reject('DomainUrl ' + domainUrl + ' not found');
          }
        };

        request.onerror = function (event) {
          reject('The url ' + url + ' doesn\'t exist: error on dababase');
        };
      });
      return promise;
    })
  }]);

  return Registry;
})(_utilsEventEmitter2['default']);

exports['default'] = Registry;
module.exports = exports['default'];

},{"../utils/EventEmitter":9}],6:[function(require,module,exports){
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
window.Sandbox = Sandbox;
window.RuntimeUA = RuntimeUA;

},{"./runtime/RuntimeUA":7,"./sandbox/Sandbox":8}],7:[function(require,module,exports){
//utils
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsRequest = require('../utils/request');

var _utilsRequest2 = _interopRequireDefault(_utilsRequest);

//Main dependecies

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

    // Instantiate the identity Module
    _this.identityModule = new _identityIdentityModule2['default']();

    // Instantiate the Policy Engine
    _this.policyEngine = new _policyPolicyEngine2['default']();

    // Instantiate the Message Bus
    _this.messageBus = new _busMessageBus2['default'](_this.registry);

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    _this.sandboxFactory = sandboxFactory;
    sandboxFactory.messageBus = _this.messageBus;

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    var appSandbox = _this.sandboxFactory.createAppSandbox();

    // Instantiate the Registry Module
    _this.registry = new _registryRegistry2['default'](_this.messageBus, hypertyRuntimeURL, appSandbox);

    _this.registry.addEventListener('runtime:loadStub', function (domainURL) {
      console.info('MYEVENT: ', domainURL);

      _this.loadStub(domainURL).then(function (result) {
        console.log('result: ', result);
      })['catch'](function (reason) {
        console.error('reason', reason);
      });

      //_this.registry.trigger('runtime:stubLoaded', domainURL);
    });
  }

  //
  //  GETTER methods for class attributes
  //
  /**
  * Get HypertyDescriptor
  */

  _createClass(RuntimeUA, [{
    key: 'getHypertyDescriptor',
    value: function getHypertyDescriptor() {
      return _hypertyDescriptor;
    }

    /**
    * Get hypertySourceCode
    */
  }, {
    key: 'getHypertySourceCode',
    value: function getHypertySourceCode() {
      return _hypertySourceCode;
    }

    /**
    * Get hypertyRuntimeURL
    */

  }, {
    key: 'getHypertyRuntimeURL',
    value: function getHypertyRuntimeURL() {
      return _hypertyRuntimeURL;
    }

    // DONE with GETTER methods

    /**
    * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
    * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
    */
  }, {
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
    value: function loadHyperty(hypertyDescriptorURL) {

      var _this = this;

      if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

      return new Promise(function (resolve, reject) {

        var _sandbox = undefined;
        var _hypertyURL = undefined;
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
        // TODO: the request Module should be changed,
        // because at this moment it is incompatible with nodejs;
        // Probably we need to pass a factory like we do for sandboxes;

        return _utilsRequest2['default'].get(hypertyDescriptorURL).then(function (hypertyDescriptor) {
          // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
          console.info('1: return hyperty descriptor', hypertyDescriptor);

          // hyperty contains the full path of the catalogue URL, e.g.
          // catalogue.rethink.eu/.well-known/..........
          _hypertyDescriptor = hypertyDescriptor;

          // TODO: Update this variables with result of the request
          // This values are only for testes, should be removed;
          // TODO: need to extract the hypertySourceCodeURL from _hypertyDescriptor.
          // This can be simple done by extending the hyperty URL that was passed
          // before, since we have well-known path components.
          var hypertySourceCodeUrl = hypertyDescriptor.sourceCode;

          if (!hypertySourceCodeUrl) {
            hypertySourceCodeUrl = 'test/resources/HelloHyperty.ES5.js';
          }

          // Get the hyperty source code
          return _utilsRequest2['default'].get(hypertySourceCodeUrl);
        }).then(function (hypertySourceCode) {
          console.info('2: return hyperty source code');

          // at this point, we have completed "step 4" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md

          _hypertySourceCode = hypertySourceCode;

          //
          // steps 8 -- 11 are skipped.
          // TODO: on release of core 0.2;
          // TODO: Promise to check the policy engine

          // mock-up code;
          // temporary code, only
          var policy = true;

          return policy;
        }).then(function (policyResult) {
          console.info('4: return policy engine result');

          // we have completed step 11 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          //
          // Steps 12 -- 18
          // As a result of the sipped steps, we know at this point if we execute
          // inSameSandbox or not.
          //

          // For testing, just assume we execute in same Sandbox.
          var inSameSandbox = true;

          // TODO: Check if the app and hyperty is in the same sandbox and
          if (inSameSandbox) {

            _sandbox = _this.registry.getAppSandbox();

            // we have completed step 16 here.

            // Note, steps 17 & 18 are not part of the if-statement as the appear both at the end of the
            // if statement and of the else statement.  --> common code taken outside
            // TODO:  Spec needs to be aligned, we need to exlude steps 17 & 18 from the two alternatives.
          } else {

              // the following one lines are the mock-up for the missing steps 12 & 13
              // TODO: getSandbox, this will return a promise;
              // and we should pass an parameter with type to get the AppSandbox;
              _sandbox = _this.registry.getSandbox(_hypertyDescriptorURL);

              if (!_sandbox) {
                // Steps 19 -- 28
                // TODO: getHypertySandbox, this will return a promise;
                _sandbox = _this.sandboxFactory.createSandbox();
              }
            }

          // Register hyperty;
          return _this.registry.registerHyperty(_sandbox, hypertyDescriptorURL);
        }).then(function (hypertyURL) {
          console.info('3: return hyperty url, after register hyperty');

          // we have completed step 7 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          _hypertyURL = hypertyURL;

          // Common to step 14 and 24 - deploycomponent
          // step 14 if the App and Hyperty executes in the same Sandbox - after _this.registry.getAppSandbox();
          // step 24 if the App and Hyperty executes in different Sandboxes - after _this.registry.getHypertySandbox();
          return _sandbox.deployComponent(_hypertySourceCode, _hypertyURL, _hypertyConfiguration);
        }).then(function (deployComponentStatus) {
          console.info('5: return the sandbox instance after check if is in the same sandbox or not');

          // we have completed step 16 or 26 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          // Add the message bus listener to the appSandbox or hypertSandbox;
          _this.messageBus.addListener(_hypertyURL, _hypertySandbox);

          // we have completed step 17 or 27 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          resolve('Hyperty is deployed');

          // we have completed step 18 or 28 (if is in the same sandbox or not) of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
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
        var configuration = {
          url: 'ws://193.136.93.243:9090/ws',
          runtimeURL: 'runtime:/alice'
        };

        var _stubSandbox = undefined;
        var _runtimeSandboxURL = undefined;
        var _runtimeProtoStubURL = undefined;
        var _protoStubSourceCode = undefined;

        var errorReason = function errorReason(reason) {
          // console.log('Hyperty Error:', reason);
          reject(reason);
        };

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

          var componentDownloadURL = 'dist/VertxProtoStub.js';

          // Get the component source code referent to component download url;
          return _utilsRequest2['default'].get(componentDownloadURL);
        }).then(function (protoStubSourceCode) {
          console.info('3. return the ProtoStub Source Code: ');
          _protoStubSourceCode = protoStubSourceCode;

          // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
          // Instantiate the Sandbox
          _stubSandbox = _this.sandboxFactory.createSandbox();
          console.log('sandbox: ', _stubSandbox);

          return _this.registry.registerStub(_stubSandbox, domain);
        }).then(function (runtimeProtoStubURL) {
          console.info('4. return the runtimeProtoStubURL, After Register Stub', _stubSandbox);
          _runtimeProtoStubURL = runtimeProtoStubURL;

          // Deploy Component
          return _stubSandbox.deployComponent(_protoStubSourceCode, _runtimeProtoStubURL, configuration);
        }, function () {
          // TODO: delete this fallback;
          console.info('5: return the sandbox runtime url', _stubSandbox);
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
        })['catch'](errorReason);
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

},{"../bus/MessageBus":1,"../identity/IdentityModule":3,"../policy/PolicyEngine":4,"../registry/Registry":5,"../utils/request":10}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
  }

  _createClass(EventEmitter, [{
    key: "addEventListener",
    value: function addEventListener(eventType, cb) {
      var _this = this;
      _this[eventType] = cb;
    }
  }, {
    key: "trigger",
    value: function trigger(eventType, params) {
      var _this = this;

      if (_this[eventType]) {
        _this[eventType](params);
      }
    }
  }]);

  return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],10:[function(require,module,exports){
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

},{}]},{},[6])(6)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NZXNzYWdlQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvTWluaUJ1cy5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3BvbGljeS9Qb2xpY3lFbmdpbmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3JlZ2lzdHJ5L1JlZ2lzdHJ5LmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9ydW50aW1lLWNvcmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3J1bnRpbWUvUnVudGltZVVBLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9zYW5kYm94L1NhbmRib3guanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3V0aWxzL0V2ZW50RW1pdHRlci5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUt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Q0FBQzthQUN0RCxDQUNELE9BQU8sS0FBSyxFQUFFO0FBQ1osb0JBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNmO1dBQ0Y7U0FDRjs7QUFFRCxZQUFJLENBQUMsV0FBVyxFQUFFO0FBQ2hCLGdCQUFNLENBQUMsZ0RBQWdELENBQUMsQ0FBQztTQUMxRDs7QUFFRCxtQkFBVyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7OztBQUc5QixZQUFJLE9BQU8sRUFBRTtBQUNYLGdCQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFTLE1BQU0sRUFBRTtBQUM1Qyx1QkFBVyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztXQUN2RCxDQUFDLENBQUM7U0FDSjs7QUFFRCxtQkFBVyxDQUFDLGtCQUFrQixHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQy9DLGNBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUM7O0FBRXRDLGNBQUksV0FBVyxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7QUFDaEMsZ0JBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7O0FBRTlCLHFCQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO2FBQy9CLE1BQU07QUFDTCxvQkFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5QjtXQUNGO1NBQ0YsQ0FBQzs7O0FBR0YsbUJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FFMUIsQ0FBQyxDQUFDO0tBRUo7OztTQS9FRyxPQUFPOzs7QUFtRmIsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztxQkFDYixPQUFPIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBNaW5pQnVzIGZyb20gJy4vTWluaUJ1cyc7XG4vKipcbiogTWVzc2FnZSBCVVMgSW50ZXJmYWNlIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgTWluaUJ1c1xuKiBJdCBkb2Vzbid0IHN1cHBvcnQgdGhlIGRlZmF1bHQgJyonIGxpc3RlbmVyLCBpbnN0ZWFkIGl0IHVzZXMgdGhlIHJlZ2lzdHJ5LnJlc29sdmUoLi4pXG4qL1xuY2xhc3MgTWVzc2FnZUJ1cyBleHRlbmRzIE1pbmlCdXMge1xuICAvKiBwcml2YXRlXG4gIF9yZWdpc3RyeTogUmVnaXN0cnlcbiAgKi9cblxuICAvL1RPRE86IGZ1dHVyZSBvcHRpbWl6YXRpb25cbiAgLy8xLiBtZXNzYWdlIGJhdGNoIHByb2Nlc3Npbmcgd2l0aCBzZXRJbnRlcnZhbFxuICAvLzIuIHJlc29sdmUgZGVmYXVsdCBnYXRld2F5L3Byb3Rvc3R1YiB3aXRoIHJlZ2lzdGVyLnJlc29sdmVcblxuICBjb25zdHJ1Y3RvcihyZWdpc3RyeSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5fcmVnaXN0cnkgPSByZWdpc3RyeTtcbiAgfVxuXG4gIF9vblBvc3RNZXNzYWdlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvL3Jlc29sdmUgZXh0ZXJuYWwgcHJvdG9zdHViLi4uXG4gICAgX3RoaXMuX3JlZ2lzdHJ5LnJlc29sdmUobXNnLmhlYWRlci50bykudGhlbigocHJvdG9TdHViVVJMKSA9PiB7XG4gICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1twcm90b1N0dWJVUkxdO1xuICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICB9XG4gICAgfSkuY2F0Y2goZnVuY3Rpb24oZSkge1xuICAgICAgY29uc29sZS5sb2coJ1BST1RPLVNUVUItRVJST1I6ICcsIGUpO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1lc3NhZ2VCdXM7XG4iLCIvKipcbiogQGF1dGhvciBtaWNhZWxwZWRyb3NhQGdtYWlsLmNvbVxuKiBNaW5pbWFsIGludGVyZmFjZSBhbmQgaW1wbGVtZW50YXRpb24gdG8gc2VuZCBhbmQgcmVjZWl2ZSBtZXNzYWdlcy4gSXQgY2FuIGJlIHJldXNlZCBpbiBtYW55IHR5cGUgb2YgY29tcG9uZW50cy5cbiogQ29tcG9uZW50cyB0aGF0IG5lZWQgYSBtZXNzYWdlIHN5c3RlbSBzaG91bGQgcmVjZWl2ZSB0aGlzIGNsYXNzIGFzIGEgZGVwZW5kZW5jeSBvciBleHRlbmQgaXQuXG4qIEV4dGVuc2lvbnMgc2hvdWxkIGltcGxlbWVudCB0aGUgZm9sbG93aW5nIHByaXZhdGUgbWV0aG9kczogX29uUG9zdE1lc3NhZ2UgYW5kIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXJcbiovXG5jbGFzcyBNaW5pQnVzIHtcbiAgLyogcHJpdmF0ZVxuICBfbXNnSWQ6IG51bWJlcjtcbiAgX3N1YnNjcmlwdGlvbnM6IDx1cmw6IE1zZ0xpc3RlbmVyW10+XG5cbiAgX3JlcGx5VGltZU91dDogbnVtYmVyXG4gIF9yZXBseUNhbGxiYWNrczogPHVybCtpZDogKG1zZykgPT4gdm9pZD5cbiAgKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLl9tc2dJZCA9IDA7XG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcblxuICAgIF90aGlzLl9yZXBseVRpbWVPdXQgPSAzMDAwOyAvL2RlZmF1bHQgdG8gM3NcbiAgICBfdGhpcy5fcmVwbHlDYWxsYmFja3MgPSB7fTtcblxuICAgIF90aGlzLl9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKTtcbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIGxpc3RlbmVyIHRvIHJlY2VpdmUgbWVzc2FnZSB3aGVuIFwibXNnLmhlYWRlci50byA9PT0gdXJsXCIuXG4gICogU3BlY2lhbCB1cmwgXCIqXCIgZm9yIGRlZmF1bHQgbGlzdGVuZXIgaXMgYWNjZXB0ZWQgdG8gaW50ZXJjZXB0IGFsbCBtZXNzYWdlcy5cbiAgKiBAcGFyYW0ge1VSTH0gdXJsIEFkZHJlc3MgdG8gaW50ZXJjZXB0LCB0aGEgaXMgaW4gdGhlIG1lc3NhZ2UgXCJoZWFkZXIudG9cIlxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyIGxpc3RlbmVyXG4gICogQHJldHVybiB7TXNnTGlzdGVuZXJ9IGluc3RhbmNlIG9mIE1zZ0xpc3RlbmVyXG4gICovXG4gIGFkZExpc3RlbmVyKHVybCwgbGlzdGVuZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGl0ZW0gPSBuZXcgTXNnTGlzdGVuZXIoX3RoaXMuX3N1YnNjcmlwdGlvbnMsIHVybCwgbGlzdGVuZXIpO1xuICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gICAgaWYgKCFpdGVtTGlzdCkge1xuICAgICAgaXRlbUxpc3QgPSBbXTtcbiAgICAgIF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF0gPSBpdGVtTGlzdDtcbiAgICB9XG5cbiAgICBpdGVtTGlzdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IGFkZCBhIHJlcGx5IGxpc3RlbmVyLiBPbmx5IG9uZSBsaXN0ZW5lciBwZXIgbWVzc2FnZSBJRCBzaG91bGQgZXhpc3QuXG4gICAqIEFURU5USU9OLCB0aGVyZSBpcyBubyB0aW1lb3V0IGZvciB0aGlzIGxpc3RlbmVyLlxuICAgKiBUaGUgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2l0aCBhIHJlbW92ZVJlcGx5TGlzdGVuZXIsIGZhaWxpbmcgdG8gZG8gdGhpcyB3aWxsIHJlc3VsdCBpbiBhIHVucmVsZWFzZWQgbWVtb3J5IHByb2JsZW0uXG4gICAqIEBwYXJhbSB7VVJMfSB1cmwgT3JpZ2luIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2Ugc2VudCwgXCJtc2cuaGVhZGVyLmZyb21cIi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1zZ0lkIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVwbHlMaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIHJlcGx5XG4gICAqL1xuICBhZGRSZXBseUxpc3RlbmVyKHVybCwgbXNnSWQsIHJlcGx5TGlzdGVuZXIpIHtcbiAgICBsZXQgcmVwbHlJZCA9IHVybCArIG1zZ0lkO1xuICAgIF90aGlzLl9yZXBseUNhbGxiYWNrc1tyZXBseUlkXSA9IHJlcGx5TGlzdGVuZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSByZXBseSBsaXN0ZW5lci5cbiAgICogQHBhcmFtIHtVUkx9IHVybCBPcmlnaW4gYWRkcmVzcyBvZiB0aGUgbWVzc2FnZSBzZW50LCBcIm1zZy5oZWFkZXIuZnJvbVwiLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNnSWQgIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZVxuICAgKi9cbiAgcmVtb3ZlUmVwbHlMaXN0ZW5lcih1cmwsIG1zZ0lkKSB7XG4gICAgbGV0IHJlcGx5SWQgPSB1cmwgKyBtc2dJZDtcbiAgICBkZWxldGUgX3RoaXMuX3JlcGx5Q2FsbGJhY2tzW3JlcGx5SWRdO1xuICB9XG5cbiAgLyoqXG4gICogU2VuZCBtZXNzYWdlcyB0byBsb2NhbCBsaXN0ZW5lcnMsIG9yIGlmIG5vdCBleGlzdHMgdG8gZXh0ZXJuYWwgbGlzdGVuZXJzLlxuICAqIEl0J3MgaGFzIGFuIG9wdGlvbmFsIG1lY2hhbmlzbSBmb3IgYXV0b21hdGljIG1hbmFnZW1lbnQgb2YgcmVwbHkgaGFuZGxlcnMuXG4gICogVGhlIHJlcGx5IGhhbmRsZXIgd2lsbCBiZSB1bnJlZ2lzdGVyZWQgYWZ0ZXIgcmVjZWl2aW5nIHRoZSByZXBseSwgb3IgYWZ0ZXIgcmVwbHkgdGltZW91dCAoZGVmYXVsdCB0byAzcykuXG4gICogQHBhcmFtICB7TWVzc2FnZX0gbXNnIE1lc3NhZ2UgdG8gc2VuZC4gTWVzc2FnZSBJRCBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBtZXNzYWdlLlxuICAqIEBwYXJhbSAge0Z1bmN0aW9ufSByZXBseUNhbGxiYWNrIE9wdGlvbmFsIHBhcmFtZXRlciwgaWYgdGhlIGRldmVsb3BlciB3aGF0J3MgYXV0b21hdGljIHJlcGx5IG1hbmFnZW1lbnQuXG4gICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIHRoZSBtZXNzYWdlIElELCBpbiBjYXNlIGl0IHNob3VsZCBiZSBuZWVkZWQgZm9yIG1hbnVhbCBtYW5hZ2VtZW50IG9mIHRoZSByZXBseSBoYW5kbGVyLlxuICAqL1xuICBwb3N0TWVzc2FnZShtc2csIHJlcGx5Q2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9UT0RPOiBob3cgZG8gd2UgbWFuYWdlIG1lc3NhZ2UgSUQncz8gU2hvdWxkIGl0IGJlIGEgZ2xvYmFsIHJ1bnRpbWUgY291bnRlciwgb3IgcGVyIFVSTCBhZGRyZXNzP1xuICAgIC8vR2xvYmFsIGNvdW50ZXIgd2lsbCBub3Qgd29yaywgYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG11bHRpcGxlIE1pbmlCdXMgaW5zdGFuY2VzIVxuICAgIC8vUGVyIFVSTCwgY2FuIGJlIGEgbG90IG9mIGRhdGEgdG8gbWFpbnRhaW4hXG4gICAgLy9NYXliZSBhIGNvdW50ZXIgcGVyIE1pbmlCdXMgaW5zdGFuY2UuIFRoaXMgaXMgdGhlIGFzc3VtZWQgc29sdXRpb24gZm9yIG5vdy5cbiAgICBpZiAoIW1zZy5oZWFkZXIuaWQpIHtcbiAgICAgIF90aGlzLl9tc2dJZCsrO1xuICAgICAgbXNnLmhlYWRlci5pZCA9IF90aGlzLl9tc2dJZDtcbiAgICB9XG5cbiAgICAvL2F1dG9tYXRpYyBtYW5hZ2VtZW50IG9mIHJlcGx5IGhhbmRsZXJzXG4gICAgaWYgKHJlcGx5Q2FsbGJhY2spIHtcbiAgICAgIGxldCByZXBseUlkID0gbXNnLmhlYWRlci5mcm9tICsgbXNnLmhlYWRlci5pZDtcbiAgICAgIF90aGlzLl9yZXBseUNhbGxiYWNrc1tyZXBseUlkXSA9IHJlcGx5Q2FsbGJhY2s7XG5cbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBkZWxldGUgX3RoaXMuX3JlcGx5Q2FsbGJhY2tzW3JlcGx5SWRdO1xuICAgICAgICBsZXQgZXJyb3JNc2cgPSB7XG4gICAgICAgICAgaGVhZGVyOiB7aWQ6IG1zZy5oZWFkZXIuaWQsIHR5cGU6ICdyZXBseSd9LFxuICAgICAgICAgIGJvZHk6IHtjb2RlOiAnZXJyb3InLCBkZXNjOiAnUmVwbHkgdGltZW91dCEnfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcGx5Q2FsbGJhY2soZXJyb3JNc2cpO1xuICAgICAgfSwgX3RoaXMuX3JlcGx5VGltZU91dCk7XG4gICAgfVxuXG4gICAgaWYgKCFfdGhpcy5fb25SZXBseShtc2cpKSB7XG4gICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1ttc2cuaGVhZGVyLnRvXTtcbiAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAvL2RvIG5vdCBwdWJsaXNoIG9uIGRlZmF1bHQgYWRkcmVzcywgYmVjYXVzZSBvZiBsb29wYmFjayBjeWNsZVxuICAgICAgICBfdGhpcy5fcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9pZiB0aGVyZSBpcyBubyBsaXN0ZW5lciwgc2VuZCB0byBleHRlcm5hbCBpbnRlcmZhY2VcbiAgICAgICAgX3RoaXMuX29uUG9zdE1lc3NhZ2UobXNnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbXNnLmhlYWRlci5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIGJpbmQgbGlzdGVuZXJzIChpbiBib3RoIGRpcmVjdGlvbnMpIGludG8gb3RoZXIgTWluaUJ1cyB0YXJnZXQuXG4gICAqIEBwYXJhbSAge1VSTH0gb3V0VXJsIE91dGJvdW5kIFVSTCwgcmVnaXN0ZXIgbGlzdGVuZXIgZm9yIHVybCBpbiBkaXJlY3Rpb24gXCJ0aGlzIC0+IHRhcmdldFwiXG4gICAqIEBwYXJhbSAge1VSTH0gaW5VcmwgSW5ib3VuZCBVUkwsIHJlZ2lzdGVyIGxpc3RlbmVyIGZvciB1cmwgaW4gZGlyZWN0aW9uIFwidGFyZ2V0IC0+IHRoaXNcIlxuICAgKiBAcGFyYW0gIHtNaW5pQnVzfSB0YXJnZXQgVGhlIG90aGVyIHRhcmdldCBNaW5pQnVzXG4gICAqIEByZXR1cm4ge0JvdW5kfSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBbdGhpc0xpc3RlbmVyLCB0YXJnZXRMaXN0ZW5lcl0gYW5kIHRoZSB1bmJpbmQgbWV0aG9kLlxuICAgKi9cbiAgYmluZChvdXRVcmwsIGluVXJsLCB0YXJnZXQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHRoaXNMaXN0biA9IF90aGlzLmFkZExpc3RlbmVyKG91dFVybCwgKG1zZykgPT4ge1xuICAgICAgdGFyZ2V0LnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICBsZXQgdGFyZ2V0TGlzdG4gPSB0YXJnZXQuYWRkTGlzdGVuZXIoaW5VcmwsIChtc2cpID0+IHtcbiAgICAgIF90aGlzLnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGhpc0xpc3RlbmVyOiB0aGlzTGlzdG4sXG4gICAgICB0YXJnZXRMaXN0ZW5lcjogdGFyZ2V0TGlzdG4sXG4gICAgICB1bmJpbmQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy50aGlzTGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMudGFyZ2V0TGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vcHVibGlzaCBvbiBhIHN1YnNjcmlwdGlvbiBsaXN0LlxuICBfcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpIHtcbiAgICBpdGVtTGlzdC5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIHN1Yi5fY2FsbGJhY2sobXNnKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vblJlcGx5KG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAobXNnLmhlYWRlci50eXBlID09PSAncmVwbHknKSB7XG4gICAgICBsZXQgcmVwbHlJZCA9IG1zZy5oZWFkZXIudG8gKyBtc2cuaGVhZGVyLmlkO1xuICAgICAgbGV0IHJlcGx5RnVuID0gX3RoaXMuX3JlcGx5Q2FsbGJhY2tzW3JlcGx5SWRdO1xuICAgICAgZGVsZXRlIF90aGlzLl9yZXBseUNhbGxiYWNrc1tyZXBseUlkXTtcblxuICAgICAgaWYgKHJlcGx5RnVuKSB7XG4gICAgICAgIHJlcGx5RnVuKG1zZyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vcmVjZWl2ZSBtZXNzYWdlcyBmcm9tIGV4dGVybmFsIGludGVyZmFjZVxuICBfb25NZXNzYWdlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9vblJlcGx5KG1zZykpIHtcbiAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW21zZy5oZWFkZXIudG9dO1xuICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2lzIHRoZXJlIGFueSBcIipcIiAoZGVmYXVsdCkgbGlzdGVuZXJzP1xuICAgICAgICBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zWycqJ107XG4gICAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTm90IHB1YmxpYyBhdmFpbGFibGUsIHVzZWQgYnkgdGhlIGNsYXNzIGV4dGVuc2lvbiBpbXBsZW1lbnRhdGlvbiwgdG8gcHJvY2VzcyBtZXNzYWdlcyBmcm9tIHRoZSBwdWJsaWMgXCJwb3N0TWVzc2FnZVwiIHdpdGhvdXQgYSByZWdpc3RlcmVkIGxpc3RlbmVyLlxuICAgKiBVc2VkIHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtc2cgTWVzc2FnZVxuICAgKi9cbiAgX29uUG9zdE1lc3NhZ2UobXNnKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCBzZW5kIG1lc3NhZ2UgdG8gZXh0ZXJuYWwgc3lzdGVtKi8gfVxuXG4gIC8qKlxuICAgKiBOb3QgcHVibGljIGF2YWlsYWJsZSwgdXNlZCBieSB0aGUgY2xhc3MgZXh0ZW5zaW9uIGltcGxlbWVudGF0aW9uLCB0byBwcm9jZXNzIGFsbCBtZXNzYWdlcyB0aGF0IGVudGVyIHRoZSBNaW5pQnVzIGZyb20gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIG9uZSB0aW1lIGluIHRoZSBjb25zdHJ1Y3RvciB0byByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lcnMuXG4gICAqIFRoZSBpbXBsZW1lbnRhdGlvbiB3aWxsIHByb2JhYmx5IGNhbGwgdGhlIFwiX29uTWVzc2FnZVwiIG1ldGhvZCB0byBwdWJsaXNoIGluIHRoZSBsb2NhbCBsaXN0ZW5lcnMuXG4gICAqIERPIE5PVCBjYWxsIFwicG9zdE1lc3NhZ2VcIiwgdGhlcmUgaXMgYSBkYW5nZXIgdGhhdCB0aGUgbWVzc2FnZSBlbnRlcnMgaW4gYSBjeWNsZSFcbiAgICovXG4gIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lciBhbmQgY2FsbCBcInRoaXMuX29uTWVzc2FnZShtc2cpXCIgKi8gfVxuXG59XG5cbmNsYXNzIE1zZ0xpc3RlbmVyIHtcbiAgLyogcHJpdmF0ZVxuICBfc3Vic2NyaXB0aW9uczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT47XG4gIF91cmw6IHN0cmluZztcbiAgX2NhbGxiYWNrOiAobXNnKSA9PiB2b2lkO1xuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbnMsIHVybCwgY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSBzdWJzY3JpcHRpb25zO1xuICAgIF90aGlzLl91cmwgPSB1cmw7XG4gICAgX3RoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsOyB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgc3VicyA9IF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgIGlmIChzdWJzKSB7XG4gICAgICBsZXQgaW5kZXggPSBzdWJzLmluZGV4T2YoX3RoaXMpO1xuICAgICAgc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAvL2lmIHRoZXJlIGFyZSBubyBsaXN0ZW5lcnMsIHJlbW92ZSB0aGUgc3Vic2NyaXB0aW9uIGVudGlyZWx5LlxuICAgICAgaWYgKHN1YnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tfdGhpcy5fdXJsXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWluaUJ1cztcbiIsIi8qKlxuICogSWRlbnRpdHlNb2R1bGVcbiAqXG4gKiBJbml0aWFsIHNwZWNpZmljYXRpb246IEQ0LjFcbiAqXG4gKiBUaGUgSWRlbnRpdHlNb2R1bGUgaXMgYSBjb21wb25lbnQgbWFuYWdpbmcgdXNlciBJZGVudGl0eS4gSXQgZG93bmxvYWRzLCBpbnN0YW50aWF0ZXNcbiAqIGFuZCBtYW5hZ2UgSWRlbnRpdHkgUHJvdmlkZXIgUHJveHkgKElkUCkgZm9yIGl0cyBvd24gdXNlciBpZGVudGl0eSBvciBmb3IgZXh0ZXJuYWxcbiAqIHVzZXIgaWRlbnRpdHkgdmVyaWZpY2F0aW9uLlxuICpcbiAqL1xuY2xhc3MgSWRlbnRpdHlNb2R1bGUge1xuXG4gIC8qKlxuICAgKiBVU0VSJ1MgT1dOIElERU5USVRZXG4gICAqL1xuICBjb25zdHJ1Y3RvcigpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJlZ2lzdGVyIGEgbmV3IElkZW50aXR5IHdpdGggYW4gSWRlbnRpdHkgUHJvdmlkZXJcbiAgICovXG4gIHJlZ2lzdGVySWRlbnRpdHkoKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIEluIHJlbGF0aW9uIHdpdGggYSBjbGFzc2ljYWwgUmVseWluZyBQYXJ0eTogUmVnaXN0cmF0aW9uXG4gICAqL1xuICByZWdpc3RlcldpdGhSUCgpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogSW4gcmVsYXRpb24gd2l0aCBhIGNsYXNzaWNhbCBSZWx5aW5nIFBhcnR5OiBMb2dpblxuICAgKi9cbiAgbG9naW5XaXRoUlAoKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIEluIHJlbGF0aW9uIHdpdGggYSBIeXBlcnR5IEluc3RhbmNlOiBBc3NvY2lhdGUgaWRlbnRpdHlcbiAgICovXG4gIHNldEh5cGVydHlJZGVudGl0eSgpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogR2VuZXJhdGVzIGFuIElkZW50aXR5IEFzc2VydGlvbiBmb3IgYSBjYWxsIHNlc3Npb25cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBjb250ZW50cyAgICAgY29udGVudHNcbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBvcmlnaW4gICAgICAgb3JpZ2luXG4gICAqIEBwYXJhbSAge0RPTVN0cmluZ30gdXNlcm5hbWVIaW50IHVzZXJuYW1lSGludFxuICAgKiBAcmV0dXJuIHtJZEFzc2VydGlvbn0gICAgICAgICAgICAgIElkQXNzZXJ0aW9uXG4gICAqL1xuICBnZW5lcmF0ZUFzc2VydGlvbihjb250ZW50cywgb3JpZ2luLCB1c2VybmFtZUhpbnQpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogT1RIRVIgVVNFUidTIElERU5USVRZXG4gICAqL1xuXG4gIC8qKlxuICAgKiBWZXJpZmljYXRpb24gb2YgYSByZWNlaXZlZCBJZEFzc2VydGlvbiB2YWxpZGl0eVxuICAgKiBAcGFyYW0gIHtET01TdHJpbmd9IGFzc2VydGlvbiBhc3NlcnRpb25cbiAgICovXG4gIHZhbGlkYXRlQXNzZXJ0aW9uKGFzc2VydGlvbikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG4gIC8qKlxuICAgKiBUcnVzdCBsZXZlbCBldmFsdWF0aW9uIG9mIGEgcmVjZWl2ZWQgSWRBc3NlcnRpb25cbiAgICogQHBhcmFtICB7RE9NU3RyaW5nfSBhc3NlcnRpb24gYXNzZXJ0aW9uXG4gICAqL1xuICBnZXRBc3NlcnRpb25UcnVzdExldmVsKGFzc2VydGlvbikge1xuICAgIC8vIEJvZHkuLi5cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IElkZW50aXR5TW9kdWxlO1xuIiwiLyoqXG4gKiBDb3JlIFBvbGljeSBFbmdpbmUgKFBEUC9QRVApIEludGVyZmFjZVxuICovXG5jbGFzcyBQb2xpY3lFbmdpbmUge1xuXG4gIC8qKlxuICAgKiBUbyBhZGQgcG9saWNpZXMgdG8gYmUgZW5mb3JjZWQgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEBwYXJhbSB7VVJMLkh5cGVydHlVUkx9ICAgICBoeXBlcnR5ICBoeXBlcnR5XG4gICAqIEBwYXJhbSB7SHlwZXJ0eVBvbGljeUxpc3R9ICBwb2xpY2llcyBwb2xpY2llc1xuICAgKi9cbiAgYWRkUG9saWNpZXMoaHlwZXJ0eSwgcG9saWNpZXMpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgICogVG8gcmVtb3ZlIHByZXZpb3VzbHkgYWRkZWQgcG9saWNpZXMgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEBwYXJhbSAge1VSTC5IeXBlcnR5VVJMfSAgaHlwZXJ0eSAgICAgICBoeXBlcnR5XG4gICAqL1xuICByZW1vdmVQb2xpY2llcyhoeXBlcnR5KSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICAqIEF1dGhvcmlzYXRpb24gcmVxdWVzdCB0byBhY2NlcHQgYSBTdWJzY3JpcHRpb24gZm9yIGEgY2VydGFpbiByZXNvdXJjZS4gUmV0dXJucyBhIFJlc3BvbnNlIE1lc3NhZ2UgdG8gYmUgcmV0dXJuZWQgdG8gU3Vic2NyaXB0aW9uIHJlcXVlc3RlclxuICAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9IG1lc3NhZ2UgICAgICAgbWVzc2FnZVxuICAgKiBAcmV0dXJuIHtBdXRob3Jpc2F0aW9uUmVzcG9uc2V9ICAgICAgICAgICAgICAgICBBdXRob3Jpc2F0aW9uUmVzcG9uc2VcbiAgICovXG4gIGF1dGhvcmlzZShtZXNzYWdlKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9saWN5RW5naW5lO1xuIiwiaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tICcuLi91dGlscy9FdmVudEVtaXR0ZXInO1xuXG4vKipcbiogUnVudGltZSBSZWdpc3RyeSBJbnRlcmZhY2VcbiovXG5jbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgLyoqXG4gICogVG8gaW5pdGlhbGlzZSB0aGUgUnVudGltZSBSZWdpc3RyeSB3aXRoIHRoZSBSdW50aW1lVVJMIHRoYXQgd2lsbCBiZSB0aGUgYmFzaXMgdG8gZGVyaXZlIHRoZSBpbnRlcm5hbCBydW50aW1lIGFkZHJlc3NlcyB3aGVuIGFsbG9jYXRpbmcgYWRkcmVzc2VzIHRvIGludGVybmFsIHJ1bnRpbWUgY29tcG9uZW50LiBJbiBhZGRpdGlvbiwgdGhlIFJlZ2lzdHJ5IGRvbWFpbiBiYWNrLWVuZCB0byBiZSB1c2VkIHRvIHJlbW90ZWx5IHJlZ2lzdGVyIFJ1bnRpbWUgY29tcG9uZW50cywgaXMgYWxzbyBwYXNzZWQgYXMgaW5wdXQgcGFyYW1ldGVyLlxuICAqIEBwYXJhbSAge01lc3NhZ2VCdXN9ICAgICAgICAgIG1zZ2J1cyAgICAgICAgICAgICAgICBtc2didXNcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBydW50aW1lVVJMICAgICAgICAgICAgcnVudGltZVVSTFxuICAqIEBwYXJhbSAge0FwcFNhbmRib3h9ICAgICAgICAgIGFwcFNhbmRib3ggICAgICAgICAgICBhcHBTYW5kYm94XG4gICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgICAgICAgcmVtb3RlUmVnaXN0cnkgICAgICAgIHJlbW90ZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKG1zZ2J1cywgcnVudGltZVVSTCwgYXBwU2FuZGJveCwgcmVtb3RlUmVnaXN0cnkpIHtcblxuICAgIC8vIE5PVEUgaWYgdGhlIGRhdGFiYXNlIHN0cnVjdHVyZSBpcyBjaGFuZ2VkIGl0IG1pZ2h0IGNhdXNlIGVycm9ycywgcnVuIHRoZSBmb2xsb3dpbmcgY29tbWFuZFxuICAgIC8vIGluZGV4ZWREQi5kZWxldGVEYXRhYmFzZSgncmVnaXN0cnktREInKTsgdGhpcyB3aWxsIGRlbGV0ZSB0aGUgZGF0YWJhc2UsIHdpdGggdGhlIG9sZCBzdHJ1Y3R1cmVcblxuICAgIC8vIGhvdyBzb21lIGZ1bmN0aW9ucyByZWNlaXZlIHRoZSBwYXJhbWV0ZXJzIGZvciBleGFtcGxlOlxuICAgIC8vIG5ldyBSZWdpc3RyeShtc2didXMsICdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvMTIzJywgYXBwU2FuZGJveCwgcmVtb3RlUmVnaXN0cnkpO1xuICAgIC8vIHJlZ2lzdHJ5LnJlZ2lzdGVyU3R1YihzYW5kYm94LCAnc3AxJyk7XG4gICAgLy8gcmVnaXN0cnkucmVnaXN0ZXJIeXBlcnR5KHNhbmRCb3gsICdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvMTIzJyk7XG4gICAgLy8gcmVnaXN0cnkucmVzb2x2ZSgnaHlwZXJ0eS1ydW50aW1lOi8vc3AxLzEyMycpO1xuXG4gICAgaWYgKCFydW50aW1lVVJMKSB0aHJvdyBuZXcgRXJyb3IoJ3J1bnRpbWVVUkwgaXMgbWlzc2luZy4nKTtcbiAgICAvKmlmICghcmVtb3RlUmVnaXN0cnkpIHRocm93IG5ldyBFcnJvcigncmVtb3RlUmVnaXN0cnkgaXMgbWlzc2luZycpOyovXG4gICAgc3VwZXIoKTtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5yZWdpc3RyeVVSTCA9IHJ1bnRpbWVVUkwgKyAnL3JlZ2lzdHJ5LzEyMyc7XG4gICAgX3RoaXMubWVzc2FnZUJ1cyA9IG1zZ2J1cztcbiAgICBfdGhpcy5hcHBTYW5kYm94ID0gYXBwU2FuZGJveDtcbiAgICBfdGhpcy5ydW50aW1lVVJMID0gcnVudGltZVVSTDtcbiAgICBfdGhpcy5yZW1vdGVSZWdpc3RyeSA9IHJlbW90ZVJlZ2lzdHJ5O1xuXG4gICAgX3RoaXMuZGIgPSB7fTtcbiAgICBfdGhpcy5EQl9OQU1FID0gJ3JlZ2lzdHJ5LURCJztcbiAgICBfdGhpcy5EQl9WRVJTSU9OID0gMTtcbiAgICBfdGhpcy5EQl9TVE9SRV9IWVBFUlRZID0gJ2h5cGVydHktbGlzdCc7XG4gICAgX3RoaXMuREJfU1RPUkVfU1RVQiA9ICdwcm90b3N0dWItbGlzdCc7XG5cbiAgICBsZXQgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKF90aGlzLkRCX05BTUUsIF90aGlzLkRCX1ZFUlNJT04pO1xuXG4gICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgX3RoaXMuZGIgPSB0aGlzLnJlc3VsdDtcbiAgICB9O1xuXG4gICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ1JlcXVlc3Qgb3BlbiBJbmRleGVkREIgZXJyb3I6JywgZXZlbnQudGFyZ2V0LmVycm9yQ29kZSk7XG4gICAgfTtcblxuICAgIHJlcXVlc3Qub251cGdyYWRlbmVlZGVkID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGxldCBvYmplY3RTdG9yZSA9IGV2ZW50LmN1cnJlbnRUYXJnZXQucmVzdWx0LmNyZWF0ZU9iamVjdFN0b3JlKFxuICAgICAgICBfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCB7a2V5UGF0aDogJ2h5cGVydHknfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgncGVwVVJMJywgJ3BlcFVSTCcsIHt1bmlxdWU6IGZhbHNlfSk7XG4gICAgICBvYmplY3RTdG9yZS5jcmVhdGVJbmRleCgnaWRlbnRpdHknLCAnaWRlbnRpdHknLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgb2JqZWN0U3RvcmUuY3JlYXRlSW5kZXgoJ3NhbmRib3gnLCAnc2FuZGJveCcsIHt1bmlxdWU6IGZhbHNlfSk7XG5cbiAgICAgIC8vcG9wdWxhdGUgd2l0aCB0aGUgcnVudGltZVVSTCBwcm92aWRlZFxuICAgICAgb2JqZWN0U3RvcmUucHV0KHtoeXBlcnR5OiAndGVzdCcsIHBlcFVSTDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBpZGVudGl0eTogJ3Rlc3RJRCcgfSk7XG5cbiAgICAgIGxldCBzdHViU3RvcmUgPSBldmVudC5jdXJyZW50VGFyZ2V0LnJlc3VsdC5jcmVhdGVPYmplY3RTdG9yZShcbiAgICAgICAgX3RoaXMuREJfU1RPUkVfU1RVQiwge2tleVBhdGg6ICdkb21haW5VUkwnfSk7XG4gICAgICBzdHViU3RvcmUuY3JlYXRlSW5kZXgoJ3Byb3Rvc3R1YlVSTCcsICdwcm90b3N0dWJVUkwnLCB7dW5pcXVlOiBmYWxzZX0pO1xuICAgICAgc3R1YlN0b3JlLmNyZWF0ZUluZGV4KCdzYW5kYm94JywgJ3NhbmRib3gnLCB7dW5pcXVlOiBmYWxzZX0pO1xuXG4gICAgICBzdHViU3RvcmUucHV0KHtkb21haW5VUkw6ICd0ZXN0U3R1YicsIHByb3Rvc3R1YlVSTDogJ3Rlc3RTdHViVVJMJ30pO1xuICAgIH07XG5cbiAgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIHRoZSBtZXNzYWdlQnVzLCBzbyB0aGUgcmVnaXN0cnkgY2FuIG1ha2UgY2FsbHMgdG8gbWVzc2FnZUJ1c1xuICAqIEBwYXJhbSB7TWVzc2FnZUJ1c30gICAgICAgICAgIG1lc3NhZ2VCdXNcbiAgKi9cbiAgcmVnaXN0ZXJNZXNzYWdlQnVzKG1lc3NhZ2VCdXMpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLm1lc3NhZ2VCdXMgPSBtZXNzYWdlQnVzO1xuICB9XG5cbiAgLyoqXG4gICogUmVnaXN0ZXIgdGhlIHJ1bnRpbWVVQSwgc28gdGhlIHJlZ2lzdHJ5IGNhbiBtYWtlIGNhbGxzIHRvIHJ1bnRpbWVVQVxuICAqIEBwYXJhbSB7UnVudGltZVVBfSAgICAgICAgICAgcnVudGltZVVBXG4gICovXG4gIHJlZ2lzdGVyUnVudGltZVVBKHJ1bnRpbWVVQSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMucnVudGltZVVBID0gcnVudGltZVVBO1xuICB9XG5cbiAgLyoqXG4gICogUmV0dXJuIHRoZSBydW50aW1lVUEgaW4gdGhpcyBSZWdpc3RyeVxuICAqIEBwYXJhbSB7UnVudGltZVVBfSAgICAgICAgICAgcnVudGltZVVBXG4gICovXG4gIGRpc2NvdmVyUnVudGltZVVBKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLnJ1bnRpbWVVQTtcbiAgfVxuXG4gIC8qKlxuICAqIFJldHVybiB0aGUgbWVzc2FnZUJ1cyBpbiB0aGlzIFJlZ2lzdHJ5XG4gICogQHBhcmFtIHtNZXNzYWdlQnVzfSAgICAgICAgICAgbWVzc2FnZUJ1c1xuICAqL1xuICBkaXNjb3Zlck1lc3NhZ2VCdXMoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMubWVzc2FnZUJ1cztcbiAgfVxuXG4gIC8qKlxuICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZXR1cm4gdGhlIHNhbmRib3ggaW5zdGFuY2Ugd2hlcmUgdGhlIEFwcGxpY2F0aW9uIGlzIGV4ZWN1dGluZy4gSXQgaXMgYXNzdW1lZCB0aGVyZSBpcyBqdXN0IG9uZSBBcHAgcGVyIFJ1bnRpbWUgaW5zdGFuY2UuXG4gICovXG4gIGdldEFwcFNhbmRib3goKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMuYXBwU2FuZGJveDtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHJlZ2lzdGVyIGEgbmV3IEh5cGVydHkgaW4gdGhlIHJ1bnRpbWUgd2hpY2ggcmV0dXJucyB0aGUgSHlwZXJ0eVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBIeXBlcnR5LlxuICAqIEBwYXJhbSAge1NhbmRib3h9ICAgICAgICAgICAgIHNhbmRib3ggICAgICAgICAgICAgICBzYW5kYm94XG4gICogQHBhcmFtICB7SHlwZXJ0eUNhdGFsb2d1ZVVSTH0gSHlwZXJ0eUNhdGFsb2d1ZVVSTCAgIGRlc2NyaXB0b3JcbiAgKiBAcmV0dXJuIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMXG4gICovXG4gIHJlZ2lzdGVySHlwZXJ0eShzYW5kYm94LCBkZXNjcmlwdG9yKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vYXNzdW1pbmcgZGVzY3JpcHRvciBjb21lIGluIHRoaXMgZm9ybWF0LCB0aGUgc2VydmljZS1wcm92aWRlci1kb21haW4gdXJsIGlzIHJldHJpZXZlZCBieSBhIHNwbGl0IGluc3RydWN0aW9uXG4gICAgLy9oeXBlcnR5LWNhdGFsb2d1ZTovLzxzZXJ2aWNlLXByb3ZpZGVyLWRvbWFpbj4vPGNhdGFsb2d1ZS1vYmplY3QtaWRlbnRpZmllcj5cbiAgICBsZXQgZGVzY3JpcHRvclNwbGl0ID0gZGVzY3JpcHRvci5zcGxpdCgnLycpO1xuICAgIGxldCBoeXBlcnR5VVJMID0gZGVzY3JpcHRvclNwbGl0WzJdO1xuXG4gICAgLy9UT0RPIENhbGwgZ2V0IElkZW50aXR5IGFuZCBzZXQgSWRlbnRpdHkgdG8gSWRlbnRpdHkgTW9kdWxlXG4gICAgLy9mb3Igc2ltcGxpY2l0eSBhZGRlZCBhbiBpZGVudGl0eVxuICAgIGxldCBoeXBlcnR5SWRlbnRpdHkgPSBoeXBlcnR5VVJMICsgJy9pZGVudGl0eSc7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBpZiAoX3RoaXMubWVzc2FnZUJ1cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlamVjdCgnTWVzc2FnZUJ1cyBub3QgZm91bmQgb24gcmVnaXN0ZXJTdHViJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2NhbGwgY2hlY2sgaWYgdGhlIHByb3Rvc3R1YiBleGlzdFxuXG4gICAgICAgIF90aGlzLnJlc29sdmUoJ2h5cGVydHktcnVudGltZTovLycgKyBoeXBlcnR5VVJMKS50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgLy8gYWRkTGlzdGVuZXIgd2l0aCB0aGUgY2FsbGJhY2sgdG8gZXhlY3V0ZSB3aGVuIHJlY2VpdmUgYSBtZXNzYWdlIGZyb20gdGhlIGFkZHJlc3MtYWxsb2NhdGlvblxuICAgICAgICAgIGxldCBpdGVtID0gX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihfdGhpcy5yZWdpc3RyeVVSTCwgKG1zZykgPT4ge1xuICAgICAgICAgICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpO1xuICAgICAgICAgICAgbGV0IHN0b3JlVmFsdWUgPSB0cmFuc2FjdGlvbi5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgICAgICAgIGxldCB1cmwgPSBtc2cuYm9keS5oeXBlcnR5UnVudGltZTtcblxuICAgICAgICAgICAgc3RvcmVWYWx1ZS5wdXQoe2h5cGVydHk6IHVybCwgcGVwVVJMOiBudWxsLFxuICAgICAgICAgICAgICBpZGVudGl0eTogdXJsICsgJy9pZGVudGl0eScsIHNhbmRib3g6IHNhbmRib3h9KTtcblxuICAgICAgICAgICAgLy9UT0RPIHJlZ2lzdGVyIHRoaXMgaHlwZXJ0eSBpbiB0aGUgR2xvYmFsIFJlZ2lzdHJ5XG5cbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uY29tcGxldGUgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAvL2FkZCB0byB0aGUgbGlzdGVuZXIgaW4gbWVzc2FnZUJ1c1xuICAgICAgICAgICAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKHVybCArICcvc3RhdHVzJywgKG1zZykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdNZXNzYWdlIGFkZExpc3RlbmVyOiAnICsgbXNnKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyIGh5cGVydHknKTtcbiAgICAgICAgICAgICAgaXRlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICAvL01lc3NhZ2UgdG8gcmVxdWVzdCBhZGRyZXNzIGFsbG9jYXRlZCBmb3IgbmV3IEh5cGVydHkgSW5zdGFuY2VcbiAgICAgICAgICBsZXQgbWVzc2FnZSA9IHtoZWFkZXI6IHtpZDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnQ1JFQVRFJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmcm9tOiBfdGhpcy5yZWdpc3RyeVVSTCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0bzogJ3J1bnRpbWU6Ly9zcDEvbXNnLW5vZGUvYWRkcmVzcy1hbGxvY2F0aW9uJ30sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvZHk6IHtoeXBlcnR5VVJMOiAnaHlwZXJ0eTovLycgKyBoeXBlcnR5VVJMICsgJy9oeTEyMyd9fTtcblxuICAgICAgICAgIF90aGlzLm1lc3NhZ2VCdXMucG9zdE1lc3NhZ2UobWVzc2FnZSk7XG5cbiAgICAgICAgICAvL1RPRE8gcmVtb3ZlIGxhdGVyLCBqdXN0IGZvciB0ZXN0c1xuICAgICAgICAgIC8vZnVuY3Rpb24gdG8gc2ltdWxhdGUgdGhlIHJlc3BvbnNlIGZyb20gdGhlIGFkZHJlc3MtYWxsb2NhdGlvblxuICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBsZXQgbWVzc2FnZSA9IHtoZWFkZXI6IHtpZDogMSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdDUkVBVEUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogJ3J1bnRpbWU6Ly9zcDEvbXNnLW5vZGUvYWRkcmVzcy1hbGxvY2F0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvOiBfdGhpcy5yZWdpc3RyeVVSTH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9keToge2h5cGVydHlVUkw6ICdoeXBlcnR5Oi8vJyArIGh5cGVydHlVUkwgKyAnL2h5MTIzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaHlwZXJ0eVJ1bnRpbWU6ICdoeXBlcnR5LXJ1bnRpbWU6Ly8nICsgaHlwZXJ0eVVSTCArICcvMTIzJ319O1xuICAgICAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5wb3N0TWVzc2FnZShtZXNzYWdlKTtcbiAgICAgICAgICB9LCA1MDApO1xuXG4gICAgICAgICAgLy9UT0RPIGNhbGwgdGhlIHBvc3QgbWVzc2FnZSB3aXRoIGNyZWF0ZSBoeXBlcnR5UmVnaXN0cmF0aW9uIG1zZ1xuXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIEh5cGVydHlcbiAgKiBAcGFyYW0gIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMIHVybCAgICAgICAgdXJsXG4gICovXG4gIHVucmVnaXN0ZXJIeXBlcnR5KHVybCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfSFlQRVJUWSwgJ3JlYWR3cml0ZScpO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuICAgICAgbGV0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldCh1cmwpO1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIGRlbGV0ZSBIeXBlcnR5Jyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3IgaHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIHZhciByZXF1ZXN0MiA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX0hZUEVSVFksICdyZWFkd3JpdGUnKS5cbiAgICAgICAgICBvYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKS5kZWxldGUodXJsKTtcblxuICAgICAgICAgIHJlcXVlc3QyLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKCdIeXBlcnR5IGRlbGV0ZSB3aXRoIHN1Y2Nlc3MnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdDIub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBkZWxldGluZyBhbiBIeXBlcnR5Jyk7XG4gICAgICAgICAgICByZWplY3QoJ0Vycm9yIGRlbGV0aW5nIGFuIEh5cGVydHknKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyBkaXNjb3ZlciBwcm90b2NvbCBzdHVicyBhdmFpbGFibGUgaW4gdGhlIHJ1bnRpbWUgZm9yIGEgY2VydGFpbiBkb21haW4uIElmIGF2YWlsYWJsZSwgaXQgcmV0dXJucyB0aGUgcnVudGltZSB1cmwgZm9yIHRoZSBwcm90b2NvbCBzdHViIHRoYXQgY29ubmVjdHMgdG8gdGhlIHJlcXVlc3RlZCBkb21haW4uIFJlcXVpcmVkIGJ5IHRoZSBydW50aW1lIEJVUyB0byByb3V0ZSBtZXNzYWdlcyB0byByZW1vdGUgc2VydmVycyBvciBwZWVycyAoZG8gd2UgbmVlZCBzb21ldGhpbmcgc2ltaWxhciBmb3IgSHlwZXJ0aWVzPykuXG4gICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgICAgICAgRG9tYWluVVJMICAgICAgICAgICAgdXJsXG4gICogQHJldHVybiB7UnVudGltZVVSTH0gICAgICAgICAgIFJ1bnRpbWVVUkxcbiAgKi9cbiAgZGlzY292ZXJQcm90b3N0dWIodXJsKSB7XG4gICAgaWYgKCF1cmwpIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIHVybCBuZWVkZWQnKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBvYmplY3RTdG9yZSA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX1NUVUIsICdyZWFkb25seScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX1NUVUIpO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldCh1cmwpO1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ3JlcXVlc3RVcGRhdGUgY291bGRuXFwnIGdldCB0aGUgUHJvdG9zdHViVVJMJyk7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ2h5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG4gICAgICAgIGlmIChkYXRhICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXNvbHZlKGRhdGEucHJvdG9zdHViVVJMKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QoJ05vIHByb3Rvc3R1YlVSTCB3YXMgZm91bmQnKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFRvIHJlZ2lzdGVyIGEgbmV3IFByb3RvY29sIFN0dWIgaW4gdGhlIHJ1bnRpbWUgaW5jbHVkaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgdGhlIGZ1bmN0aW9uIHRvIHBvc3RNZXNzYWdlLCB0aGUgRG9tYWluVVJMIHRoYXQgaXMgY29ubmVjdGVkIHdpdGggdGhlIHN0dWIsIHdoaWNoIHJldHVybnMgdGhlIFJ1bnRpbWVVUkwgYWxsb2NhdGVkIHRvIHRoZSBuZXcgUHJvdG9jb2xTdHViLlxuICAgKiBAcGFyYW0ge1NhbmRib3h9ICAgICAgICBTYW5kYm94XG4gICAqIEBwYXJhbSAge0RvbWFpblVSTH0gICAgIERvbWFpblVSTCBzZXJ2aWNlIHByb3ZpZGVyIGRvbWFpblxuICAgKiBAcmV0dXJuIHtSdW50aW1lUHJvdG9TdHViVVJMfVxuICAgKi9cbiAgcmVnaXN0ZXJTdHViKHNhbmRCb3gsIGRvbWFpblVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHJ1bnRpbWVQcm90b1N0dWJVUkw7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGlmIChfdGhpcy5tZXNzYWdlQnVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVqZWN0KCdNZXNzYWdlQnVzIG5vdCBmb3VuZCBvbiByZWdpc3RlclN0dWInKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRyYW5zYWN0aW9uID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfU1RVQiwgJ3JlYWR3cml0ZScpO1xuICAgICAgbGV0IG9iamVjdFN0b3JlID0gdHJhbnNhY3Rpb24ub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG5cbiAgICAgIC8vVE9ETyBpbXBsZW1lbnQgYSB1bmlxdWUgbnVtYmVyIGZvciB0aGUgcHJvdG9zdHViVVJMXG4gICAgICBydW50aW1lUHJvdG9TdHViVVJMID0gZG9tYWluVVJMICsgJy9wcm90b3N0dWIvJyArIDEyMzsvL01hdGguZmxvb3IoKE1hdGgucmFuZG9tKCkgKiAxMDAwMCkgKyAxKTtcbiAgICAgIG9iamVjdFN0b3JlLnB1dCh7ZG9tYWluVVJMOiBkb21haW5VUkwsIHByb3Rvc3R1YlVSTDogcnVudGltZVByb3RvU3R1YlVSTCwgc2FuZGJveDogc2FuZEJveH0pO1xuXG4gICAgICAvL2NoZWNrIGlmIG1lc3NhZ2VCdXMgaXMgcmVnaXN0ZXJlZCBpbiByZWdpc3RyeSBvciBub3RcbiAgICAgIHRyYW5zYWN0aW9uLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUHJvdG9zdHViJyk7XG4gICAgICB9O1xuXG4gICAgICB0cmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVzb2x2ZShydW50aW1lUHJvdG9TdHViVVJMKTtcblxuICAgICAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKCdoeXBlcnR5LXJ1bnRpbWU6Ly8nICsgcnVudGltZVByb3RvU3R1YlVSTCwgKG1zZykgPT4ge1xuICAgICAgICAgIGlmIChtc2cuaGVhZGVyLnJlc291cmNlID09PSBtc2cuaGVhZGVyLnRvICsgJy9zdGF0dXMnKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnUnVudGltZVByb3Rvc3R1YlVSTC9zdGF0dXMgbWVzc2FnZTogJywgbXNnLmJvZHkudmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgaHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclN0dWIoaHlwZXJ0eVJ1bnRpbWVVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9TVFVCLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWInKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcblxuICAgICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyU3R1YjogSHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIHZhciByZXF1ZXN0MiA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX1NUVUIsICdyZWFkd3JpdGUnKS5cbiAgICAgICAgICAgIG9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX1NUVUIpLmRlbGV0ZShoeXBlcnR5UnVudGltZVVSTCk7XG5cbiAgICAgICAgICByZXF1ZXN0Mi5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWI6IGVycm9yIG9uIGRhdGFiYXNlJyk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHJlcXVlc3QyLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKCdQcm90b3N0dWJVUkwgcmVtb3ZlZCcpO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHJlZ2lzdGVyIGEgbmV3IFBvbGljeSBFbmZvcmNlciBpbiB0aGUgcnVudGltZSBpbmNsdWRpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyB0aGUgZnVuY3Rpb24gdG8gcG9zdE1lc3NhZ2UsIHRoZSBIeXBlcnR5VVJMIGFzc29jaWF0ZWQgd2l0aCB0aGUgUEVQLCB3aGljaCByZXR1cm5zIHRoZSBSdW50aW1lVVJMIGFsbG9jYXRlZCB0byB0aGUgbmV3IFBvbGljeSBFbmZvcmNlciBjb21wb25lbnQuXG4gICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBwb3N0TWVzc2FnZSBwb3N0TWVzc2FnZVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgICAgICAgICAgICBoeXBlcnR5XG4gICogQHJldHVybiB7SHlwZXJ0eVJ1bnRpbWVVUkx9ICAgSHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgcmVnaXN0ZXJQRVAocG9zdE1lc3NhZ2UsIGh5cGVydHkpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHZhciBoeXBlcnR5cGVwVVJMO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICBsZXQgb2JqZWN0U3RvcmUgPSBfdGhpcy5kYi50cmFuc2FjdGlvbihfdGhpcy5EQl9TVE9SRV9IWVBFUlRZLCAncmVhZHdyaXRlJykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfSFlQRVJUWSk7XG4gICAgICBsZXQgcmVxdWVzdCA9IG9iamVjdFN0b3JlLmdldChoeXBlcnR5KTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignVVJMIG5vdCBmb3VuZCcpO1xuICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUEVQJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGh5cGVydHlwZXBVUkwgPSBoeXBlcnR5ICsgJy9wZXAnO1xuICAgICAgICBsZXQgZGF0YSA9IHJlcXVlc3QucmVzdWx0O1xuXG4gICAgICAgIGlmIChkYXRhID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHJlZ2lzdGVyUEVQJyk7XG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICBkYXRhLnBlcFVSTCA9IGh5cGVydHlwZXBVUkw7XG5cbiAgICAgICAgICBsZXQgcmVxdWVzdFVwZGF0ZSA9IG9iamVjdFN0b3JlLnB1dChkYXRhKTtcbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1cGRhdGUgcmVnaXN0ZXJQRVAnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgcmVxdWVzdFVwZGF0ZS5vbnN1Y2Nlc3MgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgcmVzb2x2ZShoeXBlcnR5cGVwVVJMKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgSHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclBFUChIeXBlcnR5UnVudGltZVVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIGh5cGVydHlwZXBVUkw7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCBvYmplY3RTdG9yZSA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX0hZUEVSVFksICdyZWFkd3JpdGUnKS5vYmplY3RTdG9yZShfdGhpcy5EQl9TVE9SRV9IWVBFUlRZKTtcbiAgICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KEh5cGVydHlSdW50aW1lVVJMKTtcblxuICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgcmVqZWN0KCdFcnJvciBvbiB1bnJlZ2lzdGVyUEVQJyk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBkYXRhID0gcmVxdWVzdC5yZXN1bHQ7XG5cbiAgICAgICAgaWYgKGRhdGEgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclBFUDogaHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgIGRhdGEucGVwVVJMID0gbnVsbDtcblxuICAgICAgICAgIGxldCByZXF1ZXN0VXBkYXRlID0gb2JqZWN0U3RvcmUucHV0KGRhdGEpO1xuICAgICAgICAgIHJlcXVlc3RVcGRhdGUub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZWplY3QoJ0Vycm9yIG9uIHVucmVnaXN0ZXJQRVA6IGVycm9yIG9uIHVwZGF0ZSBkYWJhdGFzZScpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICByZXF1ZXN0VXBkYXRlLm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZXNvbHZlKCcgUEVQIHN1Y2Vzc2Z1bGx5IGRlbGV0ZWQnKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyByZWNlaXZlIHN0YXR1cyBldmVudHMgZnJvbSBjb21wb25lbnRzIHJlZ2lzdGVyZWQgaW4gdGhlIFJlZ2lzdHJ5LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gICAgIE1lc3NhZ2UuTWVzc2FnZSAgICAgICBldmVudFxuICAqL1xuICBvbkV2ZW50KGV2ZW50KSB7XG4gICAgLy8gVE9ETyBib2R5Li4uXG4gIH1cblxuICAvKipcbiAgKiBUbyBkaXNjb3ZlciBzYW5kYm94ZXMgYXZhaWxhYmxlIGluIHRoZSBydW50aW1lIGZvciBhIGNlcnRhaW4gZG9tYWluLiBSZXF1aXJlZCBieSB0aGUgcnVudGltZSBVQSB0byBhdm9pZCBtb3JlIHRoYW4gb25lIHNhbmRib3ggZm9yIHRoZSBzYW1lIGRvbWFpbi5cbiAgKiBAcGFyYW0gIHtEb21haW5VUkx9IERvbWFpblVSTCB1cmxcbiAgKiBAcmV0dXJuIHtSdW50aW1lU2FuZGJveH0gICAgICAgICAgIFJ1bnRpbWVTYW5kYm94XG4gICovXG4gIGdldFNhbmRib3godXJsKSB7XG4gICAgaWYgKCF1cmwpIHRocm93IG5ldyBFcnJvcignUGFyYW1ldGVyIHVybCBuZWVkZWQnKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBvYmplY3RTdG9yZSA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX0hZUEVSVFksICdyZWFkb25seScpLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX0hZUEVSVFkpO1xuICAgIGxldCByZXF1ZXN0ID0gb2JqZWN0U3RvcmUuZ2V0KHVybCk7XG5cbiAgICAvL1RoaXMgZnVuY3Rpb24gY2hlY2sgaW4gYm90aCBEQl9TVE9SRV9TVFVCIGFuZCBEQl9TVE9SRV9IWVBFUlRZXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ3JlcXVlc3RVcGRhdGUgY291bGRuXFwndCBnZXQgdGhlIHNhbmRib3gnKTtcbiAgICAgIH07XG5cbiAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGRhdGEgPSByZXF1ZXN0LnJlc3VsdDtcbiAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc29sdmUoZGF0YS5zYW5kYm94KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgc3R1YlN0b3JlID0gX3RoaXMuZGIudHJhbnNhY3Rpb24oX3RoaXMuREJfU1RPUkVfU1RVQiwgJ3JlYWRvbmx5Jykub2JqZWN0U3RvcmUoX3RoaXMuREJfU1RPUkVfU1RVQik7XG4gICAgICAgICAgbGV0IHN0dWJSZXF1ZXN0ID0gc3R1YlN0b3JlLmdldCh1cmwpO1xuXG4gICAgICAgICAgc3R1YlJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICByZWplY3QoJ3JlcXVlc3RVcGRhdGUgY291bGRuXFwndCBnZXQgdGhlIHNhbmRib3gnKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgc3R1YlJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIGxldCBkYXRhID0gc3R1YlJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgaWYgKGRhdGEgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICByZXNvbHZlKGRhdGEuc2FuZGJveCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoJ05vIHNhbmRib3ggd2FzIGZvdW5kJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gdmVyaWZ5IGlmIHNvdXJjZSBpcyB2YWxpZCBhbmQgdG8gcmVzb2x2ZSB0YXJnZXQgcnVudGltZSB1cmwgYWRkcmVzcyBpZiBuZWVkZWQgKGVnIHByb3Rvc3R1YiBydW50aW1lIHVybCBpbiBjYXNlIHRoZSBtZXNzYWdlIGlzIHRvIGJlIGRpc3BhdGNoZWQgdG8gYSByZW1vdGUgZW5kcG9pbnQpLlxuICAqIEBwYXJhbSAge1VSTC5VUkx9ICB1cmwgICAgICAgdXJsXG4gICogQHJldHVybiB7UHJvbWlzZTxVUkwuVVJMPn0gICAgICAgICAgICAgICAgIFByb21pc2UgPFVSTC5VUkw+XG4gICovXG4gIHJlc29sdmUodXJsKSB7XG4gICAgY29uc29sZS5sb2coJ3Jlc29sdmUgJyArIHVybCk7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ3J1bnRpbWU6c3R1YkxvYWRlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgcmVzb2x2ZShkb21haW5VcmwpO1xuICAgIH0pO1xuXG4gICAgLy9zcGxpdCB0aGUgdXJsIHRvIGZpbmQgdGhlIGRvbWFpblVSTC4gZGVhbHMgd2l0aCB0aGUgdXJsIGZvciBleGFtcGxlIGFzOlxuICAgIC8vXCJoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyM1wiLFxuICAgIGxldCB1cmxTcGxpdCA9IHVybC5zcGxpdCgnLycpO1xuICAgIGxldCBkb21haW5VcmwgPSB1cmxTcGxpdFsyXTtcblxuICAgIGxldCB0cmFuc2FjdGlvbiA9IF90aGlzLmRiLnRyYW5zYWN0aW9uKF90aGlzLkRCX1NUT1JFX1NUVUIsICdyZWFkb25seScpO1xuICAgIGxldCBvYmplY3RTdG9yZSA9IHRyYW5zYWN0aW9uLm9iamVjdFN0b3JlKF90aGlzLkRCX1NUT1JFX1NUVUIpO1xuXG4gICAgbGV0IHByb21pc2UgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGxldCByZXF1ZXN0ICA9IG9iamVjdFN0b3JlLmdldChkb21haW5VcmwpO1xuXG4gICAgICByZXF1ZXN0Lm9uc3VjY2VzcyA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGxldCBtYXRjaGluZyA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICBpZiAobWF0Y2hpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc29sdmUodXJsKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBfdGhpcy50cmlnZ2VyKCdydW50aW1lOmxvYWRTdHViJywgZG9tYWluVXJsKTtcblxuICAgICAgICAgIC8vVE9ETyBkZWxldGUgbGF0ZXIuIEZ1bmN0aW9uIHRvIHNpbXVsYXRlIGEgbG9hZFN0dWIgcmVzcG9uc2VcbiAgICAgICAgICAvKnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBfdGhpcy5yZWdpc3RlclN0dWIoZG9tYWluVXJsICsgJy9zYW5iYm94JywgZG9tYWluVXJsKS50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXNvbHZlKGRvbWFpblVybCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LCAyNTApO1xuICAgICAgICAgICovXG5cbiAgICAgICAgICAvL3JlamVjdCgnRG9tYWluVXJsICcgKyBkb21haW5VcmwgKyAnIG5vdCBmb3VuZCcpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbihldmVudCkge1xuICAgICAgICByZWplY3QoJ1RoZSB1cmwgJyArIHVybCArICcgZG9lc25cXCd0IGV4aXN0OiBlcnJvciBvbiBkYWJhYmFzZScpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlZ2lzdHJ5O1xuIiwiaW1wb3J0IFJ1bnRpbWVVQUNvcmUgZnJvbSAnLi9ydW50aW1lL1J1bnRpbWVVQSc7XG5pbXBvcnQgU2FuZGJveEJhc2UgZnJvbSAnLi9zYW5kYm94L1NhbmRib3gnO1xuXG5leHBvcnQgdmFyIFJ1bnRpbWVVQSA9IFJ1bnRpbWVVQUNvcmU7XG5leHBvcnQgdmFyIFNhbmRib3ggPSBTYW5kYm94QmFzZTtcblxud2luZG93LlNhbmRib3ggPSBTYW5kYm94O1xud2luZG93LlJ1bnRpbWVVQSA9IFJ1bnRpbWVVQTtcbiIsIi8vdXRpbHNcbmltcG9ydCByZXF1ZXN0IGZyb20gJy4uL3V0aWxzL3JlcXVlc3QnO1xuXG4vL01haW4gZGVwZW5kZWNpZXNcbmltcG9ydCBSZWdpc3RyeSBmcm9tICcuLi9yZWdpc3RyeS9SZWdpc3RyeSc7XG5pbXBvcnQgSWRlbnRpdHlNb2R1bGUgZnJvbSAnLi4vaWRlbnRpdHkvSWRlbnRpdHlNb2R1bGUnO1xuaW1wb3J0IFBvbGljeUVuZ2luZSBmcm9tICcuLi9wb2xpY3kvUG9saWN5RW5naW5lJztcbmltcG9ydCBNZXNzYWdlQnVzIGZyb20gJy4uL2J1cy9NZXNzYWdlQnVzJztcblxuLyoqXG4qIFJ1bnRpbWUgVXNlciBBZ2VudCBJbnRlcmZhY2VcbiovXG5jbGFzcyBSdW50aW1lVUEge1xuXG4gIGNvbnN0cnVjdG9yKHNhbmRib3hGYWN0b3J5KSB7XG5cbiAgICBpZiAoIXNhbmRib3hGYWN0b3J5KSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzYW5kYm94IGZhY3RvcnkgaXMgYSBuZWVkZWQgcGFyYW1ldGVyJyk7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gVE9ETzogcG9zdCBhbmQgcmV0dXJuIHJlZ2lzdHJ5L2h5cGVydHlSdW50aW1lSW5zdGFuY2UgdG8gYW5kIGZyb20gQmFjay1lbmQgU2VydmljZVxuICAgIC8vIGZvciB0aGUgcmVxdWVzdCB5b3UgY2FuIHVzZSB0aGUgbW9kdWxlIHJlcXVlc3QgaW4gdXRpbHM7XG4gICAgLy8gdGhlIHJlc3BvbnNlIGlzIGxpa2U6IGh5cGVydHktcnVudGltZTovL3NwMS9wcm90b3N0dWIvMTIzXG5cbiAgICBsZXQgaHlwZXJ0eVJ1bnRpbWVVUkwgPSAnaHlwZXJ0eS1ydW50aW1lOi8vc3AxL3Byb3Rvc3R1Yi8xMjMnO1xuXG4gICAgLy8gSW5zdGFudGlhdGUgdGhlIGlkZW50aXR5IE1vZHVsZVxuICAgIF90aGlzLmlkZW50aXR5TW9kdWxlID0gbmV3IElkZW50aXR5TW9kdWxlKCk7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSB0aGUgUG9saWN5IEVuZ2luZVxuICAgIF90aGlzLnBvbGljeUVuZ2luZSA9IG5ldyBQb2xpY3lFbmdpbmUoKTtcblxuICAgIC8vIEluc3RhbnRpYXRlIHRoZSBNZXNzYWdlIEJ1c1xuICAgIF90aGlzLm1lc3NhZ2VCdXMgPSBuZXcgTWVzc2FnZUJ1cyhfdGhpcy5yZWdpc3RyeSk7XG5cbiAgICAvLyBVc2Ugc2FuZGJveCBmYWN0b3J5IHRvIHVzZSBzcGVjaWZpYyBtZXRob2RzXG4gICAgLy8gYW5kIHNldCB0aGUgbWVzc2FnZSBidXMgdG8gdGhlIGZhY3RvcnlcbiAgICBfdGhpcy5zYW5kYm94RmFjdG9yeSA9IHNhbmRib3hGYWN0b3J5O1xuICAgIHNhbmRib3hGYWN0b3J5Lm1lc3NhZ2VCdXMgPSBfdGhpcy5tZXNzYWdlQnVzO1xuXG4gICAgLy8gVXNlIHRoZSBzYW5kYm94IGZhY3RvcnkgdG8gY3JlYXRlIGFuIEFwcFNhbmRib3g7XG4gICAgLy8gSW4gdGhlIGZ1dHVyZSBjYW4gYmUgZGVjaWRlZCBieSBwb2xpY3lFbmdpbmUgaWYgd2UgbmVlZFxuICAgIC8vIGNyZWF0ZSBhIEFwcFNhbmRib3ggb3Igbm90O1xuICAgIGxldCBhcHBTYW5kYm94ID0gX3RoaXMuc2FuZGJveEZhY3RvcnkuY3JlYXRlQXBwU2FuZGJveCgpO1xuXG4gICAgLy8gSW5zdGFudGlhdGUgdGhlIFJlZ2lzdHJ5IE1vZHVsZVxuICAgIF90aGlzLnJlZ2lzdHJ5ID0gbmV3IFJlZ2lzdHJ5KF90aGlzLm1lc3NhZ2VCdXMsIGh5cGVydHlSdW50aW1lVVJMLCBhcHBTYW5kYm94KTtcblxuICAgIF90aGlzLnJlZ2lzdHJ5LmFkZEV2ZW50TGlzdGVuZXIoJ3J1bnRpbWU6bG9hZFN0dWInLCBmdW5jdGlvbihkb21haW5VUkwpIHtcbiAgICAgIGNvbnNvbGUuaW5mbygnTVlFVkVOVDogJywgZG9tYWluVVJMKTtcblxuICAgICAgX3RoaXMubG9hZFN0dWIoZG9tYWluVVJMKS50aGVuKGZ1bmN0aW9uKHJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmxvZygncmVzdWx0OiAnLCByZXN1bHQpO1xuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ3JlYXNvbicsIHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgICAgLy9fdGhpcy5yZWdpc3RyeS50cmlnZ2VyKCdydW50aW1lOnN0dWJMb2FkZWQnLCBkb21haW5VUkwpO1xuICAgIH0pO1xuXG4gIH1cblxuICAvL1xuICAvLyAgR0VUVEVSIG1ldGhvZHMgZm9yIGNsYXNzIGF0dHJpYnV0ZXNcbiAgLy9cbiAgLyoqXG4gICogR2V0IEh5cGVydHlEZXNjcmlwdG9yXG4gICovXG4gIGdldEh5cGVydHlEZXNjcmlwdG9yKCkge1xuICAgIHJldHVybiBfaHlwZXJ0eURlc2NyaXB0b3I7XG4gIH1cblxuICAvKipcbiAgKiBHZXQgaHlwZXJ0eVNvdXJjZUNvZGVcbiAgKi9cbiAgZ2V0SHlwZXJ0eVNvdXJjZUNvZGUoKSB7XG4gICAgcmV0dXJuIF9oeXBlcnR5U291cmNlQ29kZTtcbiAgfVxuXG4gIC8qKlxuICAqIEdldCBoeXBlcnR5UnVudGltZVVSTFxuICAqL1xuXG4gIGdldEh5cGVydHlSdW50aW1lVVJMKCkge1xuICAgIHJldHVybiBfaHlwZXJ0eVJ1bnRpbWVVUkw7XG4gIH1cblxuICAvLyBET05FIHdpdGggR0VUVEVSIG1ldGhvZHNcblxuICAvKipcbiAgKiBBY2NvbW9kYXRlIGludGVyb3BlcmFiaWxpdHkgaW4gSDJIIGFuZCBwcm90byBvbiB0aGUgZmx5IGZvciBuZXdseSBkaXNjb3ZlcmVkIGRldmljZXMgaW4gTTJNXG4gICogQHBhcmFtICB7Q2F0YWxvZ3VlRGF0YU9iamVjdC5IeXBlcnR5RGVzY3JpcHRvcn0gICBkZXNjcmlwdG9yICAgIGRlc2NyaXB0b3JcbiAgKi9cbiAgZGlzY292ZXJIaXBlcnR5KGRlc2NyaXB0b3IpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgKiBSZWdpc3RlciBIeXBlcnR5IGRlcGxveWVkIGJ5IHRoZSBBcHAgdGhhdCBpcyBwYXNzZWQgYXMgaW5wdXQgcGFyYW1ldGVyLiBUbyBiZSB1c2VkIHdoZW4gQXBwIGFuZCBIeXBlcnRpZXMgYXJlIGZyb20gdGhlIHNhbWUgZG9tYWluIG90aGVyd2lzZSB0aGUgUnVudGltZVVBIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uIGFuZCB0aGUgQXBwIGhhcyB0byB1c2UgdGhlIGxvYWRIeXBlcnR5KC4uKSBmdW5jdGlvbi5cbiAgKiBAcGFyYW0gIHtPYmplY3R9IE9iamVjdCAgICAgICAgICAgICAgICAgICBoeXBlcnR5SW5zdGFuY2VcbiAgKiBAcGFyYW0gIHtVUkwuSHlwZXJ0eUNhdGFsb2d1ZVVSTH0gICAgICAgICBkZXNjcmlwdG9yICAgICAgZGVzY3JpcHRvclxuICAqL1xuICByZWdpc3Rlckh5cGVydHkoaHlwZXJ0eUluc3RhbmNlLCBkZXNjcmlwdG9yKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogRGVwbG95IEh5cGVydHkgZnJvbSBDYXRhbG9ndWUgVVJMXG4gICogQHBhcmFtICB7VVJMLlVSTH0gICAgaHlwZXJ0eSBoeXBlcnR5SW5zdGFuY2UgdXJsO1xuICAqL1xuICBsb2FkSHlwZXJ0eShoeXBlcnR5RGVzY3JpcHRvclVSTCkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghaHlwZXJ0eURlc2NyaXB0b3JVUkwpIHRocm93IG5ldyBFcnJvcignSHlwZXJ0eSBkZXNjcmlwdG9yIHVybCBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBfc2FuZGJveDtcbiAgICAgIGxldCBfaHlwZXJ0eVVSTDtcbiAgICAgIGxldCBfaHlwZXJ0eURlc2NyaXB0b3I7XG4gICAgICBsZXQgX2h5cGVydHlTb3VyY2VDb2RlO1xuICAgICAgbGV0IF9oeXBlcnR5Q29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgdXJsOiAnd3M6Ly8xOTMuMTM2LjkzLjIxNDo5MDkwL3dzJyxcbiAgICAgICAgcnVudGltZVVSTDogJ3J1bnRpbWU6L2FsaWNlJ1xuICAgICAgfTtcblxuICAgICAgbGV0IGVycm9yUmVhc29uID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdIeXBlcnR5IEVycm9yOicsIHJlYXNvbik7XG4gICAgICAgIHJlamVjdChyZWFzb24pO1xuICAgICAgfTtcblxuICAgICAgLy8gR2V0IEh5cGVydHkgZGVzY3JpcHRvclxuICAgICAgLy8gVE9ETzogdGhlIHJlcXVlc3QgTW9kdWxlIHNob3VsZCBiZSBjaGFuZ2VkLFxuICAgICAgLy8gYmVjYXVzZSBhdCB0aGlzIG1vbWVudCBpdCBpcyBpbmNvbXBhdGlibGUgd2l0aCBub2RlanM7XG4gICAgICAvLyBQcm9iYWJseSB3ZSBuZWVkIHRvIHBhc3MgYSBmYWN0b3J5IGxpa2Ugd2UgZG8gZm9yIHNhbmRib3hlcztcblxuICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGh5cGVydHlEZXNjcmlwdG9yVVJMKS50aGVuKGZ1bmN0aW9uKGh5cGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHdlIGhhdmUgY29tcGxldGVkIFwic3RlcCAyIGFuZCAzXCIgYXMgc2hvd24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZFxuICAgICAgICBjb25zb2xlLmluZm8oJzE6IHJldHVybiBoeXBlcnR5IGRlc2NyaXB0b3InLCBoeXBlcnR5RGVzY3JpcHRvcik7XG5cbiAgICAgICAgLy8gaHlwZXJ0eSBjb250YWlucyB0aGUgZnVsbCBwYXRoIG9mIHRoZSBjYXRhbG9ndWUgVVJMLCBlLmcuXG4gICAgICAgIC8vIGNhdGFsb2d1ZS5yZXRoaW5rLmV1Ly53ZWxsLWtub3duLy4uLi4uLi4uLi5cbiAgICAgICAgX2h5cGVydHlEZXNjcmlwdG9yID0gaHlwZXJ0eURlc2NyaXB0b3I7XG5cbiAgICAgICAgLy8gVE9ETzogVXBkYXRlIHRoaXMgdmFyaWFibGVzIHdpdGggcmVzdWx0IG9mIHRoZSByZXF1ZXN0XG4gICAgICAgIC8vIFRoaXMgdmFsdWVzIGFyZSBvbmx5IGZvciB0ZXN0ZXMsIHNob3VsZCBiZSByZW1vdmVkO1xuICAgICAgICAvLyBUT0RPOiBuZWVkIHRvIGV4dHJhY3QgdGhlIGh5cGVydHlTb3VyY2VDb2RlVVJMIGZyb20gX2h5cGVydHlEZXNjcmlwdG9yLlxuICAgICAgICAvLyBUaGlzIGNhbiBiZSBzaW1wbGUgZG9uZSBieSBleHRlbmRpbmcgdGhlIGh5cGVydHkgVVJMIHRoYXQgd2FzIHBhc3NlZFxuICAgICAgICAvLyBiZWZvcmUsIHNpbmNlIHdlIGhhdmUgd2VsbC1rbm93biBwYXRoIGNvbXBvbmVudHMuXG4gICAgICAgIGxldCBoeXBlcnR5U291cmNlQ29kZVVybCA9IGh5cGVydHlEZXNjcmlwdG9yLnNvdXJjZUNvZGU7XG5cbiAgICAgICAgaWYgKCFoeXBlcnR5U291cmNlQ29kZVVybCkge1xuICAgICAgICAgIGh5cGVydHlTb3VyY2VDb2RlVXJsID0gJ3Rlc3QvcmVzb3VyY2VzL0hlbGxvSHlwZXJ0eS5FUzUuanMnO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IHRoZSBoeXBlcnR5IHNvdXJjZSBjb2RlXG4gICAgICAgIHJldHVybiByZXF1ZXN0LmdldChoeXBlcnR5U291cmNlQ29kZVVybCk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eVNvdXJjZUNvZGUpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCcyOiByZXR1cm4gaHlwZXJ0eSBzb3VyY2UgY29kZScpO1xuXG4gICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHdlIGhhdmUgY29tcGxldGVkIFwic3RlcCA0XCIgYXMgc2hvd24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZFxuXG4gICAgICAgIF9oeXBlcnR5U291cmNlQ29kZSA9IGh5cGVydHlTb3VyY2VDb2RlO1xuXG4gICAgICAgIC8vXG4gICAgICAgIC8vIHN0ZXBzIDggLS0gMTEgYXJlIHNraXBwZWQuXG4gICAgICAgIC8vIFRPRE86IG9uIHJlbGVhc2Ugb2YgY29yZSAwLjI7XG4gICAgICAgIC8vIFRPRE86IFByb21pc2UgdG8gY2hlY2sgdGhlIHBvbGljeSBlbmdpbmVcblxuICAgICAgICAvLyBtb2NrLXVwIGNvZGU7XG4gICAgICAgIC8vIHRlbXBvcmFyeSBjb2RlLCBvbmx5XG4gICAgICAgIGxldCBwb2xpY3kgPSB0cnVlO1xuXG4gICAgICAgIHJldHVybiBwb2xpY3k7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocG9saWN5UmVzdWx0KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNDogcmV0dXJuIHBvbGljeSBlbmdpbmUgcmVzdWx0Jyk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCAxMSBvZiBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1oeXBlcnR5Lm1kIHJpZ2h0IG5vdy5cblxuICAgICAgICAvL1xuICAgICAgICAvLyBTdGVwcyAxMiAtLSAxOFxuICAgICAgICAvLyBBcyBhIHJlc3VsdCBvZiB0aGUgc2lwcGVkIHN0ZXBzLCB3ZSBrbm93IGF0IHRoaXMgcG9pbnQgaWYgd2UgZXhlY3V0ZVxuICAgICAgICAvLyBpblNhbWVTYW5kYm94IG9yIG5vdC5cbiAgICAgICAgLy9cblxuICAgICAgICAvLyBGb3IgdGVzdGluZywganVzdCBhc3N1bWUgd2UgZXhlY3V0ZSBpbiBzYW1lIFNhbmRib3guXG4gICAgICAgIGxldCBpblNhbWVTYW5kYm94ID0gdHJ1ZTtcblxuICAgICAgICAvLyBUT0RPOiBDaGVjayBpZiB0aGUgYXBwIGFuZCBoeXBlcnR5IGlzIGluIHRoZSBzYW1lIHNhbmRib3ggYW5kXG4gICAgICAgIGlmIChpblNhbWVTYW5kYm94KSB7XG5cbiAgICAgICAgICBfc2FuZGJveCA9IF90aGlzLnJlZ2lzdHJ5LmdldEFwcFNhbmRib3goKTtcblxuICAgICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgMTYgaGVyZS5cblxuICAgICAgICAgIC8vIE5vdGUsIHN0ZXBzIDE3ICYgMTggYXJlIG5vdCBwYXJ0IG9mIHRoZSBpZi1zdGF0ZW1lbnQgYXMgdGhlIGFwcGVhciBib3RoIGF0IHRoZSBlbmQgb2YgdGhlXG4gICAgICAgICAgLy8gaWYgc3RhdGVtZW50IGFuZCBvZiB0aGUgZWxzZSBzdGF0ZW1lbnQuICAtLT4gY29tbW9uIGNvZGUgdGFrZW4gb3V0c2lkZVxuICAgICAgICAgIC8vIFRPRE86ICBTcGVjIG5lZWRzIHRvIGJlIGFsaWduZWQsIHdlIG5lZWQgdG8gZXhsdWRlIHN0ZXBzIDE3ICYgMTggZnJvbSB0aGUgdHdvIGFsdGVybmF0aXZlcy5cblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgLy8gdGhlIGZvbGxvd2luZyBvbmUgbGluZXMgYXJlIHRoZSBtb2NrLXVwIGZvciB0aGUgbWlzc2luZyBzdGVwcyAxMiAmIDEzXG4gICAgICAgICAgLy8gVE9ETzogZ2V0U2FuZGJveCwgdGhpcyB3aWxsIHJldHVybiBhIHByb21pc2U7XG4gICAgICAgICAgLy8gYW5kIHdlIHNob3VsZCBwYXNzIGFuIHBhcmFtZXRlciB3aXRoIHR5cGUgdG8gZ2V0IHRoZSBBcHBTYW5kYm94O1xuICAgICAgICAgIF9zYW5kYm94ID0gX3RoaXMucmVnaXN0cnkuZ2V0U2FuZGJveChfaHlwZXJ0eURlc2NyaXB0b3JVUkwpO1xuXG4gICAgICAgICAgaWYgKCFfc2FuZGJveCkge1xuICAgICAgICAgICAgLy8gU3RlcHMgMTkgLS0gMjhcbiAgICAgICAgICAgIC8vIFRPRE86IGdldEh5cGVydHlTYW5kYm94LCB0aGlzIHdpbGwgcmV0dXJuIGEgcHJvbWlzZTtcbiAgICAgICAgICAgIF9zYW5kYm94ID0gX3RoaXMuc2FuZGJveEZhY3RvcnkuY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVnaXN0ZXIgaHlwZXJ0eTtcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVySHlwZXJ0eShfc2FuZGJveCwgaHlwZXJ0eURlc2NyaXB0b3JVUkwpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGh5cGVydHlVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCczOiByZXR1cm4gaHlwZXJ0eSB1cmwsIGFmdGVyIHJlZ2lzdGVyIGh5cGVydHknKTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIDcgb2YgaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZCByaWdodCBub3cuXG5cbiAgICAgICAgX2h5cGVydHlVUkwgPSBoeXBlcnR5VVJMO1xuXG4gICAgICAgIC8vIENvbW1vbiB0byBzdGVwIDE0IGFuZCAyNCAtIGRlcGxveWNvbXBvbmVudFxuICAgICAgICAvLyBzdGVwIDE0IGlmIHRoZSBBcHAgYW5kIEh5cGVydHkgZXhlY3V0ZXMgaW4gdGhlIHNhbWUgU2FuZGJveCAtIGFmdGVyIF90aGlzLnJlZ2lzdHJ5LmdldEFwcFNhbmRib3goKTtcbiAgICAgICAgLy8gc3RlcCAyNCBpZiB0aGUgQXBwIGFuZCBIeXBlcnR5IGV4ZWN1dGVzIGluIGRpZmZlcmVudCBTYW5kYm94ZXMgLSBhZnRlciBfdGhpcy5yZWdpc3RyeS5nZXRIeXBlcnR5U2FuZGJveCgpO1xuICAgICAgICByZXR1cm4gX3NhbmRib3guZGVwbG95Q29tcG9uZW50KF9oeXBlcnR5U291cmNlQ29kZSwgX2h5cGVydHlVUkwsIF9oeXBlcnR5Q29uZmlndXJhdGlvbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGVwbG95Q29tcG9uZW50U3RhdHVzKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNTogcmV0dXJuIHRoZSBzYW5kYm94IGluc3RhbmNlIGFmdGVyIGNoZWNrIGlmIGlzIGluIHRoZSBzYW1lIHNhbmRib3ggb3Igbm90Jyk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCAxNiBvciAyNiAoaWYgaXMgaW4gdGhlIHNhbWUgc2FuZGJveCBvciBub3QpIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LWh5cGVydHkubWQgcmlnaHQgbm93LlxuXG4gICAgICAgIC8vIEFkZCB0aGUgbWVzc2FnZSBidXMgbGlzdGVuZXIgdG8gdGhlIGFwcFNhbmRib3ggb3IgaHlwZXJ0U2FuZGJveDtcbiAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5hZGRMaXN0ZW5lcihfaHlwZXJ0eVVSTCwgX2h5cGVydHlTYW5kYm94KTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIDE3IG9yIDI3IChpZiBpcyBpbiB0aGUgc2FtZSBzYW5kYm94IG9yIG5vdCkgb2YgaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZCByaWdodCBub3cuXG5cbiAgICAgICAgcmVzb2x2ZSgnSHlwZXJ0eSBpcyBkZXBsb3llZCcpO1xuXG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgMTggb3IgMjggKGlmIGlzIGluIHRoZSBzYW1lIHNhbmRib3ggb3Igbm90KSBvZiBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1oeXBlcnR5Lm1kIHJpZ2h0IG5vdy5cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3JSZWFzb24pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIERlcGxveSBTdHViIGZyb20gQ2F0YWxvZ3VlIFVSTCBvciBkb21haW4gdXJsXG4gICogQHBhcmFtICB7VVJMLlVSTH0gICAgIGRvbWFpbiAgICAgICAgICBkb21haW5cbiAgKi9cbiAgbG9hZFN0dWIoZG9tYWluKSB7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFkb21haW4pIHRocm93IG5ldyBFcnJvcignZG9tYWluIHBhcmFtZXRlciBpcyBuZWVkZWQnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IHN0dWJEZXNjcmlwdG9yO1xuXG4gICAgICAvLyBUT0RPOiB0ZW1wb3JhcnkgYWRkcmVzcyB0aGlzIG9ubHkgc3RhdGljIGZvciB0ZXN0aW5nXG4gICAgICBsZXQgY29uZmlndXJhdGlvbiA9IHtcbiAgICAgICAgdXJsOiAnd3M6Ly8xOTMuMTM2LjkzLjI0Mzo5MDkwL3dzJyxcbiAgICAgICAgcnVudGltZVVSTDogJ3J1bnRpbWU6L2FsaWNlJ1xuICAgICAgfTtcblxuICAgICAgbGV0IF9zdHViU2FuZGJveDtcbiAgICAgIGxldCBfcnVudGltZVNhbmRib3hVUkw7XG4gICAgICBsZXQgX3J1bnRpbWVQcm90b1N0dWJVUkw7XG4gICAgICBsZXQgX3Byb3RvU3R1YlNvdXJjZUNvZGU7XG5cbiAgICAgIGxldCBlcnJvclJlYXNvbiA9IGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnSHlwZXJ0eSBFcnJvcjonLCByZWFzb24pO1xuICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIERpc2NvdmVyIFByb3RvY29sIFN0dWJcbiAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5kaXNjb3ZlclByb3Rvc3R1Yihkb21haW4pLnRoZW4oZnVuY3Rpb24oZGVzY3JpcHRvcikge1xuICAgICAgICAvLyBJcyByZWdpc3RlZD9cbiAgICAgICAgY29uc29sZS5pbmZvKCcxLiBQcm90byBTdHViIERpc2NvdmVyZWQ6ICcsIGRlc2NyaXB0b3IpO1xuICAgICAgICBzdHViRGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG4gICAgICAgIHJldHVybiBzdHViRGVzY3JpcHRvcjtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICAvLyBpcyBub3QgcmVnaXN0ZWQ/XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMS4gUHJvdG8gU3R1YiBub3QgZm91bmQ6JywgcmVhc29uKTtcblxuICAgICAgICAvLyBUT0RPOiBnZXQgcHJvdG9zdHViIHwgPHNwLWRvbWFpbj4vLndlbGwta25vd24vcHJvdG9zdHViXG4gICAgICAgIC8vIGZvciB0aGUgcmVxdWVzdCB5b3UgY2FuIHVzZSB0aGUgbW9kdWxlIHJlcXVlc3QgaW4gdXRpbHM7XG4gICAgICAgIC8vIHJldHVybiByZXF1ZXN0LmdldChkb21haW4pO1xuICAgICAgICByZXR1cm4ge307XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oZGVzY3JpcHRvcikge1xuICAgICAgICBjb25zb2xlLmluZm8oJzIuIHJldHVybiB0aGUgUHJvdG9TdHViIGRlc2NyaXB0b3I6JywgZGVzY3JpcHRvcik7XG4gICAgICAgIHN0dWJEZXNjcmlwdG9yID0gZGVzY3JpcHRvcjtcblxuICAgICAgICBsZXQgY29tcG9uZW50RG93bmxvYWRVUkwgPSAnZGlzdC9WZXJ0eFByb3RvU3R1Yi5qcyc7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBjb21wb25lbnQgc291cmNlIGNvZGUgcmVmZXJlbnQgdG8gY29tcG9uZW50IGRvd25sb2FkIHVybDtcbiAgICAgICAgcmV0dXJuIHJlcXVlc3QuZ2V0KGNvbXBvbmVudERvd25sb2FkVVJMKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihwcm90b1N0dWJTb3VyY2VDb2RlKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnMy4gcmV0dXJuIHRoZSBQcm90b1N0dWIgU291cmNlIENvZGU6ICcpO1xuICAgICAgICBfcHJvdG9TdHViU291cmNlQ29kZSA9IHByb3RvU3R1YlNvdXJjZUNvZGU7XG5cbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgb24gUEVQIChwb2xpY3kgRW5naW5lKSBpZiB3ZSBuZWVkIHRoZSBzYW5kYm94IGFuZCBjaGVjayBpZiB0aGUgU2FuZGJveCBGYWN0b3J5IGhhdmUgdGhlIGNvbnRleHQgc2FuZGJveDtcbiAgICAgICAgLy8gSW5zdGFudGlhdGUgdGhlIFNhbmRib3hcbiAgICAgICAgX3N0dWJTYW5kYm94ID0gX3RoaXMuc2FuZGJveEZhY3RvcnkuY3JlYXRlU2FuZGJveCgpO1xuICAgICAgICBjb25zb2xlLmxvZygnc2FuZGJveDogJywgX3N0dWJTYW5kYm94KTtcblxuICAgICAgICByZXR1cm4gX3RoaXMucmVnaXN0cnkucmVnaXN0ZXJTdHViKF9zdHViU2FuZGJveCwgZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihydW50aW1lUHJvdG9TdHViVVJMKSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNC4gcmV0dXJuIHRoZSBydW50aW1lUHJvdG9TdHViVVJMLCBBZnRlciBSZWdpc3RlciBTdHViJywgX3N0dWJTYW5kYm94KTtcbiAgICAgICAgX3J1bnRpbWVQcm90b1N0dWJVUkwgPSBydW50aW1lUHJvdG9TdHViVVJMO1xuXG4gICAgICAgIC8vIERlcGxveSBDb21wb25lbnRcbiAgICAgICAgcmV0dXJuIF9zdHViU2FuZGJveC5kZXBsb3lDb21wb25lbnQoX3Byb3RvU3R1YlNvdXJjZUNvZGUsIF9ydW50aW1lUHJvdG9TdHViVVJMLCBjb25maWd1cmF0aW9uKTtcbiAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBUT0RPOiBkZWxldGUgdGhpcyBmYWxsYmFjaztcbiAgICAgICAgY29uc29sZS5pbmZvKCc1OiByZXR1cm4gdGhlIHNhbmRib3ggcnVudGltZSB1cmwnLCBfc3R1YlNhbmRib3gpO1xuICAgICAgICBfcnVudGltZVNhbmRib3hVUkwgPSAncHRpbm92YWNhby5wdC9zYW5kYm94LzEyMzQnO1xuXG4gICAgICAgIC8vIERlcGxveSBDb21wb25lbnRcbiAgICAgICAgcmV0dXJuIF9zdHViU2FuZGJveC5kZXBsb3lDb21wb25lbnQoX3Byb3RvU3R1YlNvdXJjZUNvZGUsIF9ydW50aW1lUHJvdG9TdHViVVJMLCBjb25maWd1cmF0aW9uKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc2OiByZXR1cm4gZGVwbG95IGNvbXBvbmVudCBmb3Igc2FuZGJveCBzdGF0dXMnKTtcblxuICAgICAgICAvLyBIYW5kbGUgd2l0aCBkZXBsb3llZCBjb21wb25lbnRcbiAgICAgICAgY29uc29sZS5sb2coJ0NvbXBvbmVudCBpcyBkZXBsb3llZCcpO1xuXG4gICAgICAgIC8vIEFkZCB0aGUgbWVzc2FnZSBidXMgbGlzdGVuZXJcbiAgICAgICAgY29uc29sZS5pbmZvKCdhZGQgbWVzc2FnZSBidXMgbGlzdGVuZXIgdG86ICcsIF9ydW50aW1lUHJvdG9TdHViVVJMLCAnIG9uICcsIF9zdHViU2FuZGJveCk7XG4gICAgICAgIF90aGlzLm1lc3NhZ2VCdXMuYWRkTGlzdGVuZXIoX3J1bnRpbWVQcm90b1N0dWJVUkwsIF9zdHViU2FuZGJveCk7XG5cbiAgICAgICAgLy8gTG9hZCBTdHViIGZ1bmN0aW9uIHJlc29sdmVkIHdpdGggc3VjY2VzcztcbiAgICAgICAgcmVzb2x2ZSgnU3R1YiBzdWNjZXNzZnVsbHkgbG9hZGVkJyk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGVycm9yUmVhc29uKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBVc2VkIHRvIGNoZWNrIGZvciB1cGRhdGVzIGFib3V0IGNvbXBvbmVudHMgaGFuZGxlZCBpbiB0aGUgQ2F0YWxvZ3VlIGluY2x1ZGluZyBwcm90b2NvbCBzdHVicyBhbmQgSHlwZXJ0aWVzLiBjaGVjayByZWxhdGlvbnNoaXAgd2l0aCBsaWZlY3ljbGUgbWFuYWdlbWVudCBwcm92aWRlZCBieSBTZXJ2aWNlIFdvcmtlcnNcbiAgKiBAcGFyYW0gIHtDYXRhbG9ndWVVUkx9ICAgICAgIHVybCB1cmxcbiAgKi9cbiAgY2hlY2tGb3JVcGRhdGUodXJsKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUnVudGltZVVBO1xuIiwiLyoqXG4gKiBJbXBsZW1lbnRzIHRoZSBTYW5kYm94IGludGVyZmFjZSB0byBwcm90ZWN0IGFsbCBleHRlcm5hbCBjb2RlO1xuICovXG5jbGFzcyBTYW5kYm94QmFzZSB7XG5cbiAgY29uc3RydWN0b3IobWVzc2FnZUJ1cykge1xuICB9XG5cbiAgLyoqXG4gICAqIFRvIGRvd25sb2FkIGFuZCBkZXBsb3kgYSBuZXcgY29tcG9uZW50IGluIHRoZSBzYW5kYm94IHBhc3NpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyB0aGUgdXJsIGZyb20gd2hlcmUgdGhlIGNvbXBvbmVudHMgaXMgZG93bmxvYWRlZCwgdGhlIGNvbXBvbmVudFVSTCBhZGRyZXNzIHByZXZpb3VzbHkgYWxsb2NhdGVkIHRvIHRoZSBjb21wb25lbnQgYW5kIGl0cyBjb25maWd1cmF0aW9uLlxuICAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICAgICAgY29tcG9uZW50RG93bmxvYWRVUkwgICAgICBTb3VyY2Vjb2RlIENvbXBvbmVudCBhZGRyZXNzIHVybFxuICAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICAgICAgY29tcG9uZW50VVJMICAgICAgICAgICAgICBDb21wb25lbnQgYWRkcmVzcyB1cmw7XG4gICAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjb25maWd1cmF0aW9uICAgICAgICAgICAgIENvbmZpZ3VyYXRpb24gb2JqZWN0O1xuICAgKi9cbiAgZGVwbG95Q29tcG9uZW50KGNvbXBvbmVudFNvdXJjZUNvZGUsIGNvbXBvbmVudFVSTCwgY29uZmlndXJhdGlvbikge1xuXG4gIH1cblxuICAvKipcbiAgICogVG8gcmVtb3ZlIGEgY29tcG9uZW50IGZyb20gdGhlIHNhbmRib3ggcGFzc2luZyBhcyBpbnB1dCBwYXJhbWV0ZXJzIGl0cyBVUkwuXG4gICAqIEBwYXJhbSAge1VSTC5VUkx9ICAgICAgICBjb21wb25lbnRVUkwgICAgICAgICAgICAgIENvbXBvbmVudCBhZGRyZXNzIHVybDtcbiAgICovXG4gIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnRVUkwpIHtcblxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2FuZGJveEJhc2U7XG4iLCJjbGFzcyBFdmVudEVtaXR0ZXIge1xuXG4gIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnRUeXBlLCBjYikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXNbZXZlbnRUeXBlXSA9IGNiO1xuICB9XG5cbiAgdHJpZ2dlcihldmVudFR5cGUsIHBhcmFtcykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX3RoaXNbZXZlbnRUeXBlXSkge1xuICAgICAgX3RoaXNbZXZlbnRUeXBlXShwYXJhbXMpO1xuICAgIH1cbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEV2ZW50RW1pdHRlcjtcbiIsIi8qKlxuICAqIE1ha2UgYWpheCByZXF1ZXN0XG4gICovXG5jbGFzcyBSZXF1ZXN0IHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG1ldGhvZHMgPSB7Z2V0OiAnR0VUJywgcG9zdDogJ1BPU1QnLCBkZWxldGU6ICdERUxFVEUnLCBwdXQ6ICdQVVQnfTtcblxuICAgIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goZnVuY3Rpb24obWV0aG9kKSB7XG4gICAgICBfdGhpc1ttZXRob2RdID0gZnVuY3Rpb24odXJsLCBwYXJhbXMsIGhlYWRlcnMpIHtcbiAgICAgICAgcmV0dXJuIF90aGlzLm1ha2VSZXF1ZXN0KG1ldGhvZHNbbWV0aG9kXSwgdXJsLCBwYXJhbXMsIGhlYWRlcnMpO1xuICAgICAgfTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgICogTWFrZSBhamF4IHJlcXVlc3RcbiAgICogQHBhcmFtICB7c3RyaW5nfSAgIG1ldGhvZCAgdGhlIENSVUQgbWV0aG9kIChnZXQsIHBvc3QsIHB1dCwgZGVsZXRlKVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgdXJsICAgICB0aGUgdXJsIHJlcXVlc3RlZCB0byBvYnRhaW4gYW4gcmVzcG9uc2VcbiAgICogQHBhcmFtICB7b2JqZWN0fSAgIHBhcmFtcyAgcGFzcyB0aGUgcGFyYW1ldGVycyB0byByZXF1ZXN0XG4gICAqIEBwYXJhbSAge29iamVjdH0gICBoZWFkZXJzIHNldCByZXF1ZXN0IGhlYWRlcnNcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKi9cbiAgbWFrZVJlcXVlc3QobWV0aG9kLCB1cmwsIHBhcmFtcywgaGVhZGVycykge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IGh0dHBSZXF1ZXN0O1xuXG4gICAgICBpZiAod2luZG93LlhNTEh0dHBSZXF1ZXN0KSB7IC8vIE1vemlsbGEsIFNhZmFyaSwgLi4uXG4gICAgICAgIGh0dHBSZXF1ZXN0ID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB9IGVsc2UgaWYgKHdpbmRvdy5BY3RpdmVYT2JqZWN0KSB7IC8vIElFXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaHR0cFJlcXVlc3QgPSBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBodHRwUmVxdWVzdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdNaWNyb3NvZnQuWE1MSFRUUCcpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghaHR0cFJlcXVlc3QpIHtcbiAgICAgICAgcmVqZWN0KCdHaXZpbmcgdXAgOiggQ2Fubm90IGNyZWF0ZSBhbiBYTUxIVFRQIGluc3RhbmNlJyk7XG4gICAgICB9XG5cbiAgICAgIGh0dHBSZXF1ZXN0Lm9wZW4obWV0aG9kLCB1cmwpO1xuXG4gICAgICAvLyBTZXQgaGVhZGVycyB0byByZXF1ZXN0XG4gICAgICBpZiAoaGVhZGVycykge1xuICAgICAgICBPYmplY3Qua2V5cyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICAgIGh0dHBSZXF1ZXN0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaHR0cFJlcXVlc3Qub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IGh0dHBSZXF1ZXN0ID0gZXZlbnQuY3VycmVudFRhcmdldDtcblxuICAgICAgICBpZiAoaHR0cFJlcXVlc3QucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmIChodHRwUmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaHR0cFJlcXVlc3QucmVzcG9uc2UpO1xuICAgICAgICAgICAgcmVzb2x2ZShodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdChodHRwUmVxdWVzdC5yZXNwb25zZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICAvLyBJZiBoYXZlIHBhcmFtcyBzZW5kIHRoZW0sIGluIHN0cmluZyBmb3JtYXRcbiAgICAgIGh0dHBSZXF1ZXN0LnNlbmQocGFyYW1zKTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuXG52YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KCk7XG5leHBvcnQgZGVmYXVsdCByZXF1ZXN0O1xuIl19
