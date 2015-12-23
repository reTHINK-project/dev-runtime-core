// Runtime User Agent 

// version: 0.2.0

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sandbox = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Pipeline = require('./Pipeline');

var _Pipeline2 = _interopRequireDefault(_Pipeline);

/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/

var MiniBus = (function () {
  /* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   _pipeline: Pipeline
  */

  function MiniBus() {
    _classCallCheck(this, MiniBus);

    var _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._responseTimeOut = 3000; //default to 3s
    _this._responseCallbacks = {};

    _this._pipeline = new _Pipeline2['default'](function (error) {
      console.log('PIPELINE-ERROR: ', JSON.stringify(error));
    });

    _this._registerExternalListener();
  }

  _createClass(MiniBus, [{
    key: 'addListener',

    /**
    * Register listener to receive message when "msg.to === url".
    * Special url "*" for default listener is accepted to intercept all messages.
    * @param {URL} url Address to intercept, tha is in the message "to"
    * @param {Listener} listener listener
    * @return {MsgListener} instance of MsgListener
    */
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
     * Manually add a response listener. Only one listener per message ID should exist.
     * ATENTION, there is no timeout for this listener.
     * The listener should be removed with a removeResponseListener, failing to do this will result in a unreleased memory problem.
     * @param {URL} url Origin address of the message sent, "msg.from".
     * @param {number} msgId Message ID that is returned from the postMessage.
     * @param {Function} responseListener Callback function for the response
     */
  }, {
    key: 'addResponseListener',
    value: function addResponseListener(url, msgId, responseListener) {
      this._responseCallbacks[url + msgId] = responseListener;
    }

    /**
     * Remove the response listener.
     * @param {URL} url Origin address of the message sent, "msg.from".
     * @param {number} msgId  Message ID that is returned from the postMessage
     */
  }, {
    key: 'removeResponseListener',
    value: function removeResponseListener(url, msgId) {
      delete this._responseCallbacks[url + msgId];
    }

    /**
     * Remove all existent listeners for the URL
     * @param  {URL} url Address registered
     */
  }, {
    key: 'removeAllListenersOf',
    value: function removeAllListenersOf(url) {
      delete this._subscriptions[url];
    }

    /**
    * Send messages to local listeners, or if not exists to external listeners.
    * It's has an optional mechanism for automatic management of response handlers.
    * The response handler will be unregistered after receiving the response, or after response timeout (default to 3s).
    * @param  {Message} msg Message to send. Message ID is automatically added to the message.
    * @param  {Function} responseCallback Optional parameter, if the developer what's automatic response management.
    * @return {number} Returns the message ID, in case it should be needed for manual management of the response handler.
    */
  }, {
    key: 'postMessage',
    value: function postMessage(inMsg, responseCallback) {
      var _this = this;

      //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
      //Global counter will not work, because there will be multiple MiniBus instances!
      //Per URL, can be a lot of data to maintain!
      //Maybe a counter per MiniBus instance. This is the assumed solution for now.
      if (!inMsg.id || inMsg.id === 0) {
        _this._msgId++;
        inMsg.id = _this._msgId;
      }

      _this._pipeline.process(inMsg, function (msg) {

        //automatic management of response handlers
        if (responseCallback) {
          (function () {
            var responseId = msg.from + msg.id;
            _this._responseCallbacks[responseId] = responseCallback;

            setTimeout(function () {
              var responseFun = _this._responseCallbacks[responseId];
              delete _this._responseCallbacks[responseId];

              if (responseFun) {
                var errorMsg = {
                  id: msg.id, type: 'response',
                  body: { code: 'error', desc: 'Response timeout!' }
                };

                responseFun(errorMsg);
              }
            }, _this._responseTimeOut);
          })();
        }

        if (!_this._onResponse(msg)) {
          var itemList = _this._subscriptions[msg.to];
          if (itemList) {
            //do not publish on default address, because of loopback cycle
            _this._publishOn(itemList, msg);
          } else {
            //if there is no listener, send to external interface
            _this._onPostMessage(msg);
          }
        }
      });

      return inMsg.id;
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
    key: '_onResponse',
    value: function _onResponse(msg) {
      var _this = this;

      if (msg.type === 'response') {
        var responseId = msg.to + msg.id;
        var responseFun = _this._responseCallbacks[responseId];
        delete _this._responseCallbacks[responseId];

        if (responseFun) {
          responseFun(msg);
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

      if (!_this._onResponse(msg)) {
        var itemList = _this._subscriptions[msg.to];
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
  }, {
    key: 'pipeline',
    get: function get() {
      return this._pipeline;
    }
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

},{"./Pipeline":2}],2:[function(require,module,exports){
/**
* @author micaelpedrosa@gmail.com
* Pipeline
* Sequencial processor of methods. Similar to how Sequential Promise's work, but better fit for message processing.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pipeline = (function () {
  /* public
    handlers: ((PipeContext) => void)[]
    onFail: (error) => void
  */

  function Pipeline(_onFail) {
    _classCallCheck(this, Pipeline);

    var _this = this;

    _this.handlers = [];
    _this.onFail = _onFail;
  }

  _createClass(Pipeline, [{
    key: "process",
    value: function process(msg, onDeliver) {
      var _this = this;

      if (_this.handlers.length > 0) {
        var iter = new Iterator(_this.handlers);
        iter.next(new PipeContext(_this, iter, msg, onDeliver));
      } else {
        onDeliver(msg);
      }
    }
  }]);

  return Pipeline;
})();

var PipeContext = (function () {
  /* private
    _inStop: boolean
     _pipeline: Pipeline
    _iter: Iterator
    _msg: Message
  */

  function PipeContext(pipeline, iter, msg, onDeliver) {
    _classCallCheck(this, PipeContext);

    var _this = this;

    _this._inStop = false;

    _this._pipeline = pipeline;
    _this._iter = iter;
    _this._msg = msg;
    _this._onDeliver = onDeliver;
  }

  _createClass(PipeContext, [{
    key: "next",
    value: function next() {
      var _this = this;

      if (!_this._inStop) {
        if (_this._iter.hasNext) {
          _this._iter.next(_this);
        } else {
          _this._onDeliver(_this._msg);
        }
      }
    }
  }, {
    key: "deliver",
    value: function deliver() {
      var _this = this;
      if (!_this._inStop) {
        _this._inStop = true;
        _this._onDeliver(_this._msg);
      }
    }
  }, {
    key: "fail",
    value: function fail(error) {
      var _this = this;

      if (!_this._inStop) {
        _this._inStop = true;
        if (_this._pipeline.onFail) {
          _this._pipeline.onFail(error);
        }
      }
    }
  }, {
    key: "pipeline",
    get: function get() {
      return this._pipeline;
    }
  }, {
    key: "msg",
    get: function get() {
      return this._msg;
    },
    set: function set(inMsg) {
      this._msg = inMsg;
    }
  }]);

  return PipeContext;
})();

var Iterator = (function () {
  /* private
    _index: number
    _array: []
  */

  function Iterator(array) {
    _classCallCheck(this, Iterator);

    this._index = -1;
    this._array = array;
  }

  _createClass(Iterator, [{
    key: "hasNext",
    get: function get() {
      return this._index < this._array.length - 1;
    }
  }, {
    key: "next",
    get: function get() {
      this._index++;
      return this._array[this._index];
    }
  }]);

  return Iterator;
})();

exports["default"] = Pipeline;
module.exports = exports["default"];

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _sandboxSandbox = require('./sandbox/Sandbox');

var _sandboxSandbox2 = _interopRequireDefault(_sandboxSandbox);

var _sandboxSandboxRegistry = require('./sandbox/SandboxRegistry');

var _sandboxSandboxRegistry2 = _interopRequireDefault(_sandboxSandboxRegistry);

exports.Sandbox = _sandboxSandbox2['default'];
exports.SandboxRegistry = _sandboxSandboxRegistry2['default'];

},{"./sandbox/Sandbox":4,"./sandbox/SandboxRegistry":5}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _sandboxSandboxRegistry = require('../sandbox/SandboxRegistry');

var _sandboxSandboxRegistry2 = _interopRequireDefault(_sandboxSandboxRegistry);

var _busMiniBus = require('../bus/MiniBus');

var _busMiniBus2 = _interopRequireDefault(_busMiniBus);

// import MessageFactory from '../../resources/MessageFactory';

/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement external sandbox component
 */

var Sandbox = (function (_MiniBus) {
  _inherits(Sandbox, _MiniBus);

  function Sandbox() {
    _classCallCheck(this, Sandbox);

    _get(Object.getPrototypeOf(Sandbox.prototype), 'constructor', this).call(this);

    var _this = this;

    // Add Message Factory
    // let messageFactory = new MessageFactory();
    // _this.messageFactory = messageFactory;
  }

  /**
   * Deploy an instance of the component into the sandbox.
   * @param  {string} componentSourceCode Component source code (Hyperty, ProtoStub, etc)
   * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
   * @param  {Config} configuration Config parameters of the component
   * @return {Promise<string>} return deployed if successful, or any other string with an error
   */

  _createClass(Sandbox, [{
    key: 'deployComponent',
    value: function deployComponent(componentSourceCode, componentURL, configuration) {

      var _this = this;

      // let messageFactory = _this.messageFactory;

      return new Promise(function (resolve, reject) {
        //TODO: message format is not properly defined yet
        var deployMessage = {
          type: 'create', from: _sandboxSandboxRegistry2['default'].ExternalDeployAddress, to: _sandboxSandboxRegistry2['default'].InternalDeployAddress,
          body: { url: componentURL, sourceCode: componentSourceCode, config: configuration }
        };

        // createMessageRequest(from, to, contextId, value, policy, idToken, accessToken, resource, signature)
        // let deployMessage = messageFactory.createMessageRequest(SandboxRegistry.ExternalDeployAddress, SandboxRegistry.InternalDeployAddress, 'deploy', {url: componentURL, sourceCode: componentSourceCode, config: configuration});

        //send message into the sandbox internals and wait for reply
        _this.postMessage(deployMessage, function (reply) {
          if (reply.body.code === 200) {
            //is this response complaint with the spec?
            resolve('deployed');
          } else {
            reject(reply.body.desc);
          }
        });
      });
    }

    /**
     * Remove the instance of a previously deployed component.
     * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
     * @return {Promise<string>} return undeployed if successful, or any other string with an error
     */
  }, {
    key: 'removeComponent',
    value: function removeComponent(componentURL) {
      var _this = this;

      return new Promise(function (resolve, reject) {
        //TODO: message format is not properly defined yet
        var removeMessage = {
          type: 'delete', from: _sandboxSandboxRegistry2['default'].ExternalDeployAddress, to: _sandboxSandboxRegistry2['default'].InternalDeployAddress,
          body: { url: componentURL }
        };

        //send message into the sandbox internals and wait for reply
        _this.postMessage(removeMessage, function (reply) {
          if (reply.body.code === 200) {
            //is this response complaint with the spec?
            resolve('undeployed');
          } else {
            reject(reply.body.desc);
          }
        });
      });
    }
  }]);

  return Sandbox;
})(_busMiniBus2['default']);

exports['default'] = Sandbox;
module.exports = exports['default'];

},{"../bus/MiniBus":1,"../sandbox/SandboxRegistry":5}],5:[function(require,module,exports){
/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement internal deploy manager of components.
 */

// import MessageFactory from '../../resources/MessageFactory';

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var SandboxRegistry = (function () {
  /* private
  _components: <url: instance>
  */

  function SandboxRegistry(bus) {
    _classCallCheck(this, SandboxRegistry);

    var _this = this;

    _this._bus = bus;
    _this._components = {};

    // Add Message Factory
    // let messageFactory = new MessageFactory();
    // _this.messageFactory = messageFactory;

    bus.addListener(SandboxRegistry.InternalDeployAddress, function (msg) {
      //console.log('SandboxRegistry-RCV: ', msg);
      // let responseMsg = {
      //   id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
      // };

      switch (msg.type) {
        case 'create':
          _this._onDeploy(msg);break;
        case 'delete':
          _this._onRemove(msg);break;
      }
    });
  }

  _createClass(SandboxRegistry, [{
    key: '_responseMsg',
    value: function _responseMsg(msg, code, value) {

      var _this = this;

      // let messageFactory = _this.messageFactory;

      var responseMsg = {
        id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
      };

      // Chanege the origin message, because the response;
      // msg.from = SandboxRegistry.InternalDeployAddress;
      // msg.to = SandboxRegistry.ExternalDeployAddress;

      var body = {};
      if (code) body.code = code;
      if (value) body.desc = value;

      responseMsg.body = body;

      // return messageFactory.createResponse(msg, code, value);
      return responseMsg;
    }
  }, {
    key: '_onDeploy',
    value: function _onDeploy(msg) {
      var _this = this;
      var config = msg.body.config;
      var componentURL = msg.body.url;
      var sourceCode = msg.body.sourceCode;
      var responseCode = undefined;
      var responseDesc = undefined;

      if (!_this._components.hasOwnProperty(componentURL)) {
        try {
          _this._components[componentURL] = _this._create(componentURL, sourceCode, config);
          responseCode = 200;
        } catch (error) {
          responseCode = 500;
          responseDesc = error;
        }
      } else {
        responseCode = 500;
        responseDesc = 'Instance ' + componentURL + ' already exist!';
      }

      // Create response message with MessageFactory
      var responseMsg = _this._responseMsg(msg, responseCode, responseDesc);
      _this._bus.postMessage(responseMsg);
    }
  }, {
    key: '_onRemove',
    value: function _onRemove(msg) {
      var _this = this;
      var componentURL = msg.body.url;
      var responseCode = undefined;
      var responseDesc = undefined;

      if (_this._components.hasOwnProperty(componentURL)) {
        //remove component from the pool and all listeners
        delete _this._components[componentURL];
        _this._bus.removeAllListenersOf(componentURL);
        responseCode = 200;
      } else {
        responseCode = 500;
        responseDesc = 'Instance ' + componentURL + ' doesn\'t exist!';
      }

      var responseMsg = _this._responseMsg(msg, responseCode, responseDesc);

      _this._bus.postMessage(responseMsg);
    }

    /**
     * This method should be implemented by the internal sandbox code.
     * @param  {ComponentURL} url URL used for the instance
     * @param  {string} sourceCode Code of the component
     * @param  {Config} config Configuration parameters
     * @return {Object} Returns instance of the component or throw an error "throw 'error message'"
     */
  }, {
    key: '_create',
    value: function _create(url, sourceCode, config) {
      //implementation specific
      /* example code:
        eval(sourceCode);
        return activate(url, _this._bus, config);
      */
    }
  }, {
    key: 'components',
    get: function get() {
      return this._components;
    }
  }]);

  return SandboxRegistry;
})();

SandboxRegistry.ExternalDeployAddress = 'sandbox://external';
SandboxRegistry.InternalDeployAddress = 'sandbox://internal';

exports['default'] = SandboxRegistry;
module.exports = exports['default'];

},{}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NaW5pQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvUGlwZWxpbmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3guanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3gvU2FuZGJveC5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvc2FuZGJveC9TYW5kYm94UmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7d0JDQXFCLFlBQVk7Ozs7Ozs7Ozs7O0lBUTNCLE9BQU87Ozs7Ozs7OztBQVdBLFdBWFAsT0FBTyxHQVdHOzBCQVhWLE9BQU87O0FBWVQsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUUxQixTQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFNBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTlCLFNBQUssQ0FBQyxTQUFTLEdBQUcsMEJBQWEsVUFBQyxLQUFLLEVBQUs7QUFDeEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUss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QUM7QUFDN0QsZUFBZSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDOztxQkFFOUMsZUFBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGlwZWxpbmUgZnJvbSAnLi9QaXBlbGluZSc7XG5cbi8qKlxuKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4qIE1pbmltYWwgaW50ZXJmYWNlIGFuZCBpbXBsZW1lbnRhdGlvbiB0byBzZW5kIGFuZCByZWNlaXZlIG1lc3NhZ2VzLiBJdCBjYW4gYmUgcmV1c2VkIGluIG1hbnkgdHlwZSBvZiBjb21wb25lbnRzLlxuKiBDb21wb25lbnRzIHRoYXQgbmVlZCBhIG1lc3NhZ2Ugc3lzdGVtIHNob3VsZCByZWNlaXZlIHRoaXMgY2xhc3MgYXMgYSBkZXBlbmRlbmN5IG9yIGV4dGVuZCBpdC5cbiogRXh0ZW5zaW9ucyBzaG91bGQgaW1wbGVtZW50IHRoZSBmb2xsb3dpbmcgcHJpdmF0ZSBtZXRob2RzOiBfb25Qb3N0TWVzc2FnZSBhbmQgX3JlZ2lzdGVyRXh0ZXJuYWxMaXN0ZW5lclxuKi9cbmNsYXNzIE1pbmlCdXMge1xuICAvKiBwcml2YXRlXG4gIF9tc2dJZDogbnVtYmVyO1xuICBfc3Vic2NyaXB0aW9uczogPHVybDogTXNnTGlzdGVuZXJbXT5cblxuICBfcmVzcG9uc2VUaW1lT3V0OiBudW1iZXJcbiAgX3Jlc3BvbnNlQ2FsbGJhY2tzOiA8dXJsK2lkOiAobXNnKSA9PiB2b2lkPlxuXG4gIF9waXBlbGluZTogUGlwZWxpbmVcbiAgKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLl9tc2dJZCA9IDA7XG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcblxuICAgIF90aGlzLl9yZXNwb25zZVRpbWVPdXQgPSAzMDAwOyAvL2RlZmF1bHQgdG8gM3NcbiAgICBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3MgPSB7fTtcblxuICAgIF90aGlzLl9waXBlbGluZSA9IG5ldyBQaXBlbGluZSgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdQSVBFTElORS1FUlJPUjogJywgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICB9KTtcblxuICAgIF90aGlzLl9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKTtcbiAgfVxuXG4gIGdldCBwaXBlbGluZSgpIHsgcmV0dXJuIHRoaXMuX3BpcGVsaW5lOyB9XG5cbiAgLyoqXG4gICogUmVnaXN0ZXIgbGlzdGVuZXIgdG8gcmVjZWl2ZSBtZXNzYWdlIHdoZW4gXCJtc2cudG8gPT09IHVybFwiLlxuICAqIFNwZWNpYWwgdXJsIFwiKlwiIGZvciBkZWZhdWx0IGxpc3RlbmVyIGlzIGFjY2VwdGVkIHRvIGludGVyY2VwdCBhbGwgbWVzc2FnZXMuXG4gICogQHBhcmFtIHtVUkx9IHVybCBBZGRyZXNzIHRvIGludGVyY2VwdCwgdGhhIGlzIGluIHRoZSBtZXNzYWdlIFwidG9cIlxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyIGxpc3RlbmVyXG4gICogQHJldHVybiB7TXNnTGlzdGVuZXJ9IGluc3RhbmNlIG9mIE1zZ0xpc3RlbmVyXG4gICovXG4gIGFkZExpc3RlbmVyKHVybCwgbGlzdGVuZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGl0ZW0gPSBuZXcgTXNnTGlzdGVuZXIoX3RoaXMuX3N1YnNjcmlwdGlvbnMsIHVybCwgbGlzdGVuZXIpO1xuICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gICAgaWYgKCFpdGVtTGlzdCkge1xuICAgICAgaXRlbUxpc3QgPSBbXTtcbiAgICAgIF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF0gPSBpdGVtTGlzdDtcbiAgICB9XG5cbiAgICBpdGVtTGlzdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IGFkZCBhIHJlc3BvbnNlIGxpc3RlbmVyLiBPbmx5IG9uZSBsaXN0ZW5lciBwZXIgbWVzc2FnZSBJRCBzaG91bGQgZXhpc3QuXG4gICAqIEFURU5USU9OLCB0aGVyZSBpcyBubyB0aW1lb3V0IGZvciB0aGlzIGxpc3RlbmVyLlxuICAgKiBUaGUgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2l0aCBhIHJlbW92ZVJlc3BvbnNlTGlzdGVuZXIsIGZhaWxpbmcgdG8gZG8gdGhpcyB3aWxsIHJlc3VsdCBpbiBhIHVucmVsZWFzZWQgbWVtb3J5IHByb2JsZW0uXG4gICAqIEBwYXJhbSB7VVJMfSB1cmwgT3JpZ2luIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2Ugc2VudCwgXCJtc2cuZnJvbVwiLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNnSWQgTWVzc2FnZSBJRCB0aGF0IGlzIHJldHVybmVkIGZyb20gdGhlIHBvc3RNZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNwb25zZUxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB0aGUgcmVzcG9uc2VcbiAgICovXG4gIGFkZFJlc3BvbnNlTGlzdGVuZXIodXJsLCBtc2dJZCwgcmVzcG9uc2VMaXN0ZW5lcikge1xuICAgIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3VybCArIG1zZ0lkXSA9IHJlc3BvbnNlTGlzdGVuZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSByZXNwb25zZSBsaXN0ZW5lci5cbiAgICogQHBhcmFtIHtVUkx9IHVybCBPcmlnaW4gYWRkcmVzcyBvZiB0aGUgbWVzc2FnZSBzZW50LCBcIm1zZy5mcm9tXCIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtc2dJZCAgTWVzc2FnZSBJRCB0aGF0IGlzIHJldHVybmVkIGZyb20gdGhlIHBvc3RNZXNzYWdlXG4gICAqL1xuICByZW1vdmVSZXNwb25zZUxpc3RlbmVyKHVybCwgbXNnSWQpIHtcbiAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbdXJsICsgbXNnSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZXhpc3RlbnQgbGlzdGVuZXJzIGZvciB0aGUgVVJMXG4gICAqIEBwYXJhbSAge1VSTH0gdXJsIEFkZHJlc3MgcmVnaXN0ZXJlZFxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzT2YodXJsKSB7XG4gICAgZGVsZXRlIHRoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXTtcbiAgfVxuXG4gIC8qKlxuICAqIFNlbmQgbWVzc2FnZXMgdG8gbG9jYWwgbGlzdGVuZXJzLCBvciBpZiBub3QgZXhpc3RzIHRvIGV4dGVybmFsIGxpc3RlbmVycy5cbiAgKiBJdCdzIGhhcyBhbiBvcHRpb25hbCBtZWNoYW5pc20gZm9yIGF1dG9tYXRpYyBtYW5hZ2VtZW50IG9mIHJlc3BvbnNlIGhhbmRsZXJzLlxuICAqIFRoZSByZXNwb25zZSBoYW5kbGVyIHdpbGwgYmUgdW5yZWdpc3RlcmVkIGFmdGVyIHJlY2VpdmluZyB0aGUgcmVzcG9uc2UsIG9yIGFmdGVyIHJlc3BvbnNlIHRpbWVvdXQgKGRlZmF1bHQgdG8gM3MpLlxuICAqIEBwYXJhbSAge01lc3NhZ2V9IG1zZyBNZXNzYWdlIHRvIHNlbmQuIE1lc3NhZ2UgSUQgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgbWVzc2FnZS5cbiAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gcmVzcG9uc2VDYWxsYmFjayBPcHRpb25hbCBwYXJhbWV0ZXIsIGlmIHRoZSBkZXZlbG9wZXIgd2hhdCdzIGF1dG9tYXRpYyByZXNwb25zZSBtYW5hZ2VtZW50LlxuICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyB0aGUgbWVzc2FnZSBJRCwgaW4gY2FzZSBpdCBzaG91bGQgYmUgbmVlZGVkIGZvciBtYW51YWwgbWFuYWdlbWVudCBvZiB0aGUgcmVzcG9uc2UgaGFuZGxlci5cbiAgKi9cbiAgcG9zdE1lc3NhZ2UoaW5Nc2csIHJlc3BvbnNlQ2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9UT0RPOiBob3cgZG8gd2UgbWFuYWdlIG1lc3NhZ2UgSUQncz8gU2hvdWxkIGl0IGJlIGEgZ2xvYmFsIHJ1bnRpbWUgY291bnRlciwgb3IgcGVyIFVSTCBhZGRyZXNzP1xuICAgIC8vR2xvYmFsIGNvdW50ZXIgd2lsbCBub3Qgd29yaywgYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG11bHRpcGxlIE1pbmlCdXMgaW5zdGFuY2VzIVxuICAgIC8vUGVyIFVSTCwgY2FuIGJlIGEgbG90IG9mIGRhdGEgdG8gbWFpbnRhaW4hXG4gICAgLy9NYXliZSBhIGNvdW50ZXIgcGVyIE1pbmlCdXMgaW5zdGFuY2UuIFRoaXMgaXMgdGhlIGFzc3VtZWQgc29sdXRpb24gZm9yIG5vdy5cbiAgICBpZiAoIWluTXNnLmlkIHx8IGluTXNnLmlkID09PSAwKSB7XG4gICAgICBfdGhpcy5fbXNnSWQrKztcbiAgICAgIGluTXNnLmlkID0gX3RoaXMuX21zZ0lkO1xuICAgIH1cblxuICAgIF90aGlzLl9waXBlbGluZS5wcm9jZXNzKGluTXNnLCAobXNnKSA9PiB7XG5cbiAgICAgIC8vYXV0b21hdGljIG1hbmFnZW1lbnQgb2YgcmVzcG9uc2UgaGFuZGxlcnNcbiAgICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgICAgIGxldCByZXNwb25zZUlkID0gbXNnLmZyb20gKyBtc2cuaWQ7XG4gICAgICAgIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXSA9IHJlc3BvbnNlQ2FsbGJhY2s7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3BvbnNlRnVuID0gX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuICAgICAgICAgIGRlbGV0ZSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2VGdW4pIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1zZyA9IHtcbiAgICAgICAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgICAgICAgYm9keToge2NvZGU6ICdlcnJvcicsIGRlc2M6ICdSZXNwb25zZSB0aW1lb3V0ISd9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNwb25zZUZ1bihlcnJvck1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfdGhpcy5fcmVzcG9uc2VUaW1lT3V0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfdGhpcy5fb25SZXNwb25zZShtc2cpKSB7XG4gICAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW21zZy50b107XG4gICAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAgIC8vZG8gbm90IHB1Ymxpc2ggb24gZGVmYXVsdCBhZGRyZXNzLCBiZWNhdXNlIG9mIGxvb3BiYWNrIGN5Y2xlXG4gICAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL2lmIHRoZXJlIGlzIG5vIGxpc3RlbmVyLCBzZW5kIHRvIGV4dGVybmFsIGludGVyZmFjZVxuICAgICAgICAgIF90aGlzLl9vblBvc3RNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbk1zZy5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIGJpbmQgbGlzdGVuZXJzIChpbiBib3RoIGRpcmVjdGlvbnMpIGludG8gb3RoZXIgTWluaUJ1cyB0YXJnZXQuXG4gICAqIEBwYXJhbSAge1VSTH0gb3V0VXJsIE91dGJvdW5kIFVSTCwgcmVnaXN0ZXIgbGlzdGVuZXIgZm9yIHVybCBpbiBkaXJlY3Rpb24gXCJ0aGlzIC0+IHRhcmdldFwiXG4gICAqIEBwYXJhbSAge1VSTH0gaW5VcmwgSW5ib3VuZCBVUkwsIHJlZ2lzdGVyIGxpc3RlbmVyIGZvciB1cmwgaW4gZGlyZWN0aW9uIFwidGFyZ2V0IC0+IHRoaXNcIlxuICAgKiBAcGFyYW0gIHtNaW5pQnVzfSB0YXJnZXQgVGhlIG90aGVyIHRhcmdldCBNaW5pQnVzXG4gICAqIEByZXR1cm4ge0JvdW5kfSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBbdGhpc0xpc3RlbmVyLCB0YXJnZXRMaXN0ZW5lcl0gYW5kIHRoZSB1bmJpbmQgbWV0aG9kLlxuICAgKi9cbiAgYmluZChvdXRVcmwsIGluVXJsLCB0YXJnZXQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHRoaXNMaXN0biA9IF90aGlzLmFkZExpc3RlbmVyKG91dFVybCwgKG1zZykgPT4ge1xuICAgICAgdGFyZ2V0LnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICBsZXQgdGFyZ2V0TGlzdG4gPSB0YXJnZXQuYWRkTGlzdGVuZXIoaW5VcmwsIChtc2cpID0+IHtcbiAgICAgIF90aGlzLnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGhpc0xpc3RlbmVyOiB0aGlzTGlzdG4sXG4gICAgICB0YXJnZXRMaXN0ZW5lcjogdGFyZ2V0TGlzdG4sXG4gICAgICB1bmJpbmQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy50aGlzTGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMudGFyZ2V0TGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vcHVibGlzaCBvbiBhIHN1YnNjcmlwdGlvbiBsaXN0LlxuICBfcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpIHtcbiAgICBpdGVtTGlzdC5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIHN1Yi5fY2FsbGJhY2sobXNnKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vblJlc3BvbnNlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXNwb25zZScpIHtcbiAgICAgIGxldCByZXNwb25zZUlkID0gbXNnLnRvICsgbXNnLmlkO1xuICAgICAgbGV0IHJlc3BvbnNlRnVuID0gX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuICAgICAgZGVsZXRlIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcblxuICAgICAgaWYgKHJlc3BvbnNlRnVuKSB7XG4gICAgICAgIHJlc3BvbnNlRnVuKG1zZyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vcmVjZWl2ZSBtZXNzYWdlcyBmcm9tIGV4dGVybmFsIGludGVyZmFjZVxuICBfb25NZXNzYWdlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9vblJlc3BvbnNlKG1zZykpIHtcbiAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW21zZy50b107XG4gICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaXMgdGhlcmUgYW55IFwiKlwiIChkZWZhdWx0KSBsaXN0ZW5lcnM/XG4gICAgICAgIGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbJyonXTtcbiAgICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOb3QgcHVibGljIGF2YWlsYWJsZSwgdXNlZCBieSB0aGUgY2xhc3MgZXh0ZW5zaW9uIGltcGxlbWVudGF0aW9uLCB0byBwcm9jZXNzIG1lc3NhZ2VzIGZyb20gdGhlIHB1YmxpYyBcInBvc3RNZXNzYWdlXCIgd2l0aG91dCBhIHJlZ2lzdGVyZWQgbGlzdGVuZXIuXG4gICAqIFVzZWQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byBhbiBleHRlcm5hbCBpbnRlcmZhY2UsIGxpa2UgYSBXZWJXb3JrZXIsIElGcmFtZSwgZXRjLlxuICAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9IG1zZyBNZXNzYWdlXG4gICAqL1xuICBfb25Qb3N0TWVzc2FnZShtc2cpIHsgLyppbXBsZW1lbnRhdGlvbiB3aWxsIHNlbmQgbWVzc2FnZSB0byBleHRlcm5hbCBzeXN0ZW0qLyB9XG5cbiAgLyoqXG4gICAqIE5vdCBwdWJsaWMgYXZhaWxhYmxlLCB1c2VkIGJ5IHRoZSBjbGFzcyBleHRlbnNpb24gaW1wbGVtZW50YXRpb24sIHRvIHByb2Nlc3MgYWxsIG1lc3NhZ2VzIHRoYXQgZW50ZXIgdGhlIE1pbmlCdXMgZnJvbSBhbiBleHRlcm5hbCBpbnRlcmZhY2UsIGxpa2UgYSBXZWJXb3JrZXIsIElGcmFtZSwgZXRjLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgb25lIHRpbWUgaW4gdGhlIGNvbnN0cnVjdG9yIHRvIHJlZ2lzdGVyIGV4dGVybmFsIGxpc3RlbmVycy5cbiAgICogVGhlIGltcGxlbWVudGF0aW9uIHdpbGwgcHJvYmFibHkgY2FsbCB0aGUgXCJfb25NZXNzYWdlXCIgbWV0aG9kIHRvIHB1Ymxpc2ggaW4gdGhlIGxvY2FsIGxpc3RlbmVycy5cbiAgICogRE8gTk9UIGNhbGwgXCJwb3N0TWVzc2FnZVwiLCB0aGVyZSBpcyBhIGRhbmdlciB0aGF0IHRoZSBtZXNzYWdlIGVudGVycyBpbiBhIGN5Y2xlIVxuICAgKi9cbiAgX3JlZ2lzdGVyRXh0ZXJuYWxMaXN0ZW5lcigpIHsgLyppbXBsZW1lbnRhdGlvbiB3aWxsIHJlZ2lzdGVyIGV4dGVybmFsIGxpc3RlbmVyIGFuZCBjYWxsIFwidGhpcy5fb25NZXNzYWdlKG1zZylcIiAqLyB9XG5cbn1cblxuY2xhc3MgTXNnTGlzdGVuZXIge1xuICAvKiBwcml2YXRlXG4gIF9zdWJzY3JpcHRpb25zOiA8c3RyaW5nOiBNc2dMaXN0ZW5lcltdPjtcbiAgX3VybDogc3RyaW5nO1xuICBfY2FsbGJhY2s6IChtc2cpID0+IHZvaWQ7XG4gICovXG5cbiAgY29uc3RydWN0b3Ioc3Vic2NyaXB0aW9ucywgdXJsLCBjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHN1YnNjcmlwdGlvbnM7XG4gICAgX3RoaXMuX3VybCA9IHVybDtcbiAgICBfdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmw7IH1cblxuICByZW1vdmUoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBzdWJzID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbX3RoaXMuX3VybF07XG4gICAgaWYgKHN1YnMpIHtcbiAgICAgIGxldCBpbmRleCA9IHN1YnMuaW5kZXhPZihfdGhpcyk7XG4gICAgICBzdWJzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIC8vaWYgdGhlcmUgYXJlIG5vIGxpc3RlbmVycywgcmVtb3ZlIHRoZSBzdWJzY3JpcHRpb24gZW50aXJlbHkuXG4gICAgICBpZiAoc3Vicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNaW5pQnVzO1xuIiwiLyoqXG4qIEBhdXRob3IgbWljYWVscGVkcm9zYUBnbWFpbC5jb21cbiogUGlwZWxpbmVcbiogU2VxdWVuY2lhbCBwcm9jZXNzb3Igb2YgbWV0aG9kcy4gU2ltaWxhciB0byBob3cgU2VxdWVudGlhbCBQcm9taXNlJ3Mgd29yaywgYnV0IGJldHRlciBmaXQgZm9yIG1lc3NhZ2UgcHJvY2Vzc2luZy5cbiovXG5jbGFzcyBQaXBlbGluZSB7XG4gIC8qIHB1YmxpY1xuICAgIGhhbmRsZXJzOiAoKFBpcGVDb250ZXh0KSA9PiB2b2lkKVtdXG4gICAgb25GYWlsOiAoZXJyb3IpID0+IHZvaWRcbiAgKi9cblxuICBjb25zdHJ1Y3Rvcihfb25GYWlsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLmhhbmRsZXJzID0gW107XG4gICAgX3RoaXMub25GYWlsID0gX29uRmFpbDtcbiAgfVxuXG4gIHByb2Nlc3MobXNnLCBvbkRlbGl2ZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90aGlzLmhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBpdGVyID0gbmV3IEl0ZXJhdG9yKF90aGlzLmhhbmRsZXJzKTtcbiAgICAgIGl0ZXIubmV4dChuZXcgUGlwZUNvbnRleHQoX3RoaXMsIGl0ZXIsIG1zZywgb25EZWxpdmVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uRGVsaXZlcihtc2cpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQaXBlQ29udGV4dCB7XG4gIC8qIHByaXZhdGVcbiAgICBfaW5TdG9wOiBib29sZWFuXG5cbiAgICBfcGlwZWxpbmU6IFBpcGVsaW5lXG4gICAgX2l0ZXI6IEl0ZXJhdG9yXG4gICAgX21zZzogTWVzc2FnZVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHBpcGVsaW5lLCBpdGVyLCBtc2csIG9uRGVsaXZlcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5faW5TdG9wID0gZmFsc2U7XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUgPSBwaXBlbGluZTtcbiAgICBfdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgX3RoaXMuX21zZyA9IG1zZztcbiAgICBfdGhpcy5fb25EZWxpdmVyID0gb25EZWxpdmVyO1xuICB9XG5cbiAgZ2V0IHBpcGVsaW5lKCkgeyByZXR1cm4gdGhpcy5fcGlwZWxpbmU7IH1cblxuICBnZXQgbXNnKCkgeyByZXR1cm4gdGhpcy5fbXNnOyB9XG4gIHNldCBtc2coaW5Nc2cpIHsgdGhpcy5fbXNnID0gaW5Nc2c7IH1cblxuICBuZXh0KCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9pblN0b3ApIHtcbiAgICAgIGlmIChfdGhpcy5faXRlci5oYXNOZXh0KSB7XG4gICAgICAgIF90aGlzLl9pdGVyLm5leHQoX3RoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuX29uRGVsaXZlcihfdGhpcy5fbXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBfdGhpcy5faW5TdG9wID0gdHJ1ZTtcbiAgICAgIF90aGlzLl9vbkRlbGl2ZXIoX3RoaXMuX21zZyk7XG4gICAgfVxuICB9XG5cbiAgZmFpbChlcnJvcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9pblN0b3ApIHtcbiAgICAgIF90aGlzLl9pblN0b3AgPSB0cnVlO1xuICAgICAgaWYgKF90aGlzLl9waXBlbGluZS5vbkZhaWwpIHtcbiAgICAgICAgX3RoaXMuX3BpcGVsaW5lLm9uRmFpbChlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEl0ZXJhdG9yIHtcbiAgLyogcHJpdmF0ZVxuICAgIF9pbmRleDogbnVtYmVyXG4gICAgX2FycmF5OiBbXVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKGFycmF5KSB7XG4gICAgdGhpcy5faW5kZXggPSAtMTtcbiAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICB9XG5cbiAgZ2V0IGhhc05leHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4IDwgdGhpcy5fYXJyYXkubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGdldCBuZXh0KCkge1xuICAgIHRoaXMuX2luZGV4Kys7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W3RoaXMuX2luZGV4XTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaXBlbGluZTtcbiIsImltcG9ydCBTYW5kYm94IGZyb20gJy4vc2FuZGJveC9TYW5kYm94JztcbmltcG9ydCBTYW5kYm94UmVnaXN0cnkgZnJvbSAnLi9zYW5kYm94L1NhbmRib3hSZWdpc3RyeSc7XG5cbmV4cG9ydCB7U2FuZGJveCwgU2FuZGJveFJlZ2lzdHJ5fTtcbiIsImltcG9ydCBTYW5kYm94UmVnaXN0cnkgZnJvbSAnLi4vc2FuZGJveC9TYW5kYm94UmVnaXN0cnknO1xuaW1wb3J0IE1pbmlCdXMgZnJvbSAnLi4vYnVzL01pbmlCdXMnO1xuLy8gaW1wb3J0IE1lc3NhZ2VGYWN0b3J5IGZyb20gJy4uLy4uL3Jlc291cmNlcy9NZXNzYWdlRmFjdG9yeSc7XG5cbi8qKlxuICogQGF1dGhvciBtaWNhZWxwZWRyb3NhQGdtYWlsLmNvbVxuICogQmFzZSBjbGFzcyB0byBpbXBsZW1lbnQgZXh0ZXJuYWwgc2FuZGJveCBjb21wb25lbnRcbiAqL1xuY2xhc3MgU2FuZGJveCBleHRlbmRzIE1pbmlCdXMge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgc3VwZXIoKTtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBBZGQgTWVzc2FnZSBGYWN0b3J5XG4gICAgLy8gbGV0IG1lc3NhZ2VGYWN0b3J5ID0gbmV3IE1lc3NhZ2VGYWN0b3J5KCk7XG4gICAgLy8gX3RoaXMubWVzc2FnZUZhY3RvcnkgPSBtZXNzYWdlRmFjdG9yeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXBsb3kgYW4gaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBpbnRvIHRoZSBzYW5kYm94LlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IGNvbXBvbmVudFNvdXJjZUNvZGUgQ29tcG9uZW50IHNvdXJjZSBjb2RlIChIeXBlcnR5LCBQcm90b1N0dWIsIGV0YylcbiAgICogQHBhcmFtICB7VVJMfSBjb21wb25lbnRVUkwgSHlwZXJ0eSwgUHJvdG9TdHViLCBvciBhbnkgb3RoZXIgY29tcG9uZW50IGFkZHJlc3MuXG4gICAqIEBwYXJhbSAge0NvbmZpZ30gY29uZmlndXJhdGlvbiBDb25maWcgcGFyYW1ldGVycyBvZiB0aGUgY29tcG9uZW50XG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gcmV0dXJuIGRlcGxveWVkIGlmIHN1Y2Nlc3NmdWwsIG9yIGFueSBvdGhlciBzdHJpbmcgd2l0aCBhbiBlcnJvclxuICAgKi9cbiAgZGVwbG95Q29tcG9uZW50KGNvbXBvbmVudFNvdXJjZUNvZGUsIGNvbXBvbmVudFVSTCwgY29uZmlndXJhdGlvbikge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IF90aGlzLm1lc3NhZ2VGYWN0b3J5O1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vVE9ETzogbWVzc2FnZSBmb3JtYXQgaXMgbm90IHByb3Blcmx5IGRlZmluZWQgeWV0XG4gICAgICBsZXQgZGVwbG95TWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ2NyZWF0ZScsIGZyb206IFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3MsIHRvOiBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLFxuICAgICAgICBib2R5OiB7IHVybDogY29tcG9uZW50VVJMLCBzb3VyY2VDb2RlOiBjb21wb25lbnRTb3VyY2VDb2RlLCBjb25maWc6IGNvbmZpZ3VyYXRpb24gfVxuICAgICAgfTtcblxuICAgICAgLy8gY3JlYXRlTWVzc2FnZVJlcXVlc3QoZnJvbSwgdG8sIGNvbnRleHRJZCwgdmFsdWUsIHBvbGljeSwgaWRUb2tlbiwgYWNjZXNzVG9rZW4sIHJlc291cmNlLCBzaWduYXR1cmUpXG4gICAgICAvLyBsZXQgZGVwbG95TWVzc2FnZSA9IG1lc3NhZ2VGYWN0b3J5LmNyZWF0ZU1lc3NhZ2VSZXF1ZXN0KFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3MsIFNhbmRib3hSZWdpc3RyeS5JbnRlcm5hbERlcGxveUFkZHJlc3MsICdkZXBsb3knLCB7dXJsOiBjb21wb25lbnRVUkwsIHNvdXJjZUNvZGU6IGNvbXBvbmVudFNvdXJjZUNvZGUsIGNvbmZpZzogY29uZmlndXJhdGlvbn0pO1xuXG4gICAgICAvL3NlbmQgbWVzc2FnZSBpbnRvIHRoZSBzYW5kYm94IGludGVybmFscyBhbmQgd2FpdCBmb3IgcmVwbHlcbiAgICAgIF90aGlzLnBvc3RNZXNzYWdlKGRlcGxveU1lc3NhZ2UsIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICAvL2lzIHRoaXMgcmVzcG9uc2UgY29tcGxhaW50IHdpdGggdGhlIHNwZWM/XG4gICAgICAgICAgcmVzb2x2ZSgnZGVwbG95ZWQnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVwbHkuYm9keS5kZXNjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBpbnN0YW5jZSBvZiBhIHByZXZpb3VzbHkgZGVwbG95ZWQgY29tcG9uZW50LlxuICAgKiBAcGFyYW0gIHtVUkx9IGNvbXBvbmVudFVSTCBIeXBlcnR5LCBQcm90b1N0dWIsIG9yIGFueSBvdGhlciBjb21wb25lbnQgYWRkcmVzcy5cbiAgICogQHJldHVybiB7UHJvbWlzZTxzdHJpbmc+fSByZXR1cm4gdW5kZXBsb3llZCBpZiBzdWNjZXNzZnVsLCBvciBhbnkgb3RoZXIgc3RyaW5nIHdpdGggYW4gZXJyb3JcbiAgICovXG4gIHJlbW92ZUNvbXBvbmVudChjb21wb25lbnRVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vVE9ETzogbWVzc2FnZSBmb3JtYXQgaXMgbm90IHByb3Blcmx5IGRlZmluZWQgeWV0XG4gICAgICBsZXQgcmVtb3ZlTWVzc2FnZSA9IHtcbiAgICAgICAgdHlwZTogJ2RlbGV0ZScsIGZyb206IFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3MsIHRvOiBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLFxuICAgICAgICBib2R5OiB7IHVybDogY29tcG9uZW50VVJMIH1cbiAgICAgIH07XG5cbiAgICAgIC8vc2VuZCBtZXNzYWdlIGludG8gdGhlIHNhbmRib3ggaW50ZXJuYWxzIGFuZCB3YWl0IGZvciByZXBseVxuICAgICAgX3RoaXMucG9zdE1lc3NhZ2UocmVtb3ZlTWVzc2FnZSwgKHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChyZXBseS5ib2R5LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIC8vaXMgdGhpcyByZXNwb25zZSBjb21wbGFpbnQgd2l0aCB0aGUgc3BlYz9cbiAgICAgICAgICByZXNvbHZlKCd1bmRlcGxveWVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHJlcGx5LmJvZHkuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNhbmRib3g7XG4iLCIvKipcbiAqIEBhdXRob3IgbWljYWVscGVkcm9zYUBnbWFpbC5jb21cbiAqIEJhc2UgY2xhc3MgdG8gaW1wbGVtZW50IGludGVybmFsIGRlcGxveSBtYW5hZ2VyIG9mIGNvbXBvbmVudHMuXG4gKi9cblxuLy8gaW1wb3J0IE1lc3NhZ2VGYWN0b3J5IGZyb20gJy4uLy4uL3Jlc291cmNlcy9NZXNzYWdlRmFjdG9yeSc7XG5cbmNsYXNzIFNhbmRib3hSZWdpc3RyeSB7XG4gIC8qIHByaXZhdGVcbiAgX2NvbXBvbmVudHM6IDx1cmw6IGluc3RhbmNlPlxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKGJ1cykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fYnVzID0gYnVzO1xuICAgIF90aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICAvLyBBZGQgTWVzc2FnZSBGYWN0b3J5XG4gICAgLy8gbGV0IG1lc3NhZ2VGYWN0b3J5ID0gbmV3IE1lc3NhZ2VGYWN0b3J5KCk7XG4gICAgLy8gX3RoaXMubWVzc2FnZUZhY3RvcnkgPSBtZXNzYWdlRmFjdG9yeTtcblxuICAgIGJ1cy5hZGRMaXN0ZW5lcihTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLCAobXNnKSA9PiB7XG4gICAgICAvL2NvbnNvbGUubG9nKCdTYW5kYm94UmVnaXN0cnktUkNWOiAnLCBtc2cpO1xuICAgICAgLy8gbGV0IHJlc3BvbnNlTXNnID0ge1xuICAgICAgLy8gICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLCBmcm9tOiBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLCB0bzogU2FuZGJveFJlZ2lzdHJ5LkV4dGVybmFsRGVwbG95QWRkcmVzc1xuICAgICAgLy8gfTtcblxuICAgICAgc3dpdGNoIChtc2cudHlwZSkge1xuICAgICAgICBjYXNlICdjcmVhdGUnOiBfdGhpcy5fb25EZXBsb3kobXNnKTsgYnJlYWs7XG4gICAgICAgIGNhc2UgJ2RlbGV0ZSc6IF90aGlzLl9vblJlbW92ZShtc2cpOyBicmVhaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBjb21wb25lbnRzKCkgeyByZXR1cm4gdGhpcy5fY29tcG9uZW50czsgfVxuXG4gIF9yZXNwb25zZU1zZyhtc2csIGNvZGUsIHZhbHVlKSB7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gbGV0IG1lc3NhZ2VGYWN0b3J5ID0gX3RoaXMubWVzc2FnZUZhY3Rvcnk7XG5cbiAgICBsZXQgcmVzcG9uc2VNc2cgPSB7XG4gICAgICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLCBmcm9tOiBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLCB0bzogU2FuZGJveFJlZ2lzdHJ5LkV4dGVybmFsRGVwbG95QWRkcmVzc1xuICAgIH07XG5cbiAgICAvLyBDaGFuZWdlIHRoZSBvcmlnaW4gbWVzc2FnZSwgYmVjYXVzZSB0aGUgcmVzcG9uc2U7XG4gICAgLy8gbXNnLmZyb20gPSBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzO1xuICAgIC8vIG1zZy50byA9IFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3M7XG5cbiAgICBsZXQgYm9keSA9IHt9O1xuICAgIGlmIChjb2RlKSBib2R5LmNvZGUgPSBjb2RlO1xuICAgIGlmICh2YWx1ZSkgYm9keS5kZXNjID0gdmFsdWU7XG5cbiAgICByZXNwb25zZU1zZy5ib2R5ID0gYm9keTtcblxuICAgIC8vIHJldHVybiBtZXNzYWdlRmFjdG9yeS5jcmVhdGVSZXNwb25zZShtc2csIGNvZGUsIHZhbHVlKTtcbiAgICByZXR1cm4gcmVzcG9uc2VNc2c7XG4gIH1cblxuICBfb25EZXBsb3kobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgY29uZmlnID0gbXNnLmJvZHkuY29uZmlnO1xuICAgIGxldCBjb21wb25lbnRVUkwgPSBtc2cuYm9keS51cmw7XG4gICAgbGV0IHNvdXJjZUNvZGUgPSBtc2cuYm9keS5zb3VyY2VDb2RlO1xuICAgIGxldCByZXNwb25zZUNvZGU7XG4gICAgbGV0IHJlc3BvbnNlRGVzYztcblxuICAgIGlmICghX3RoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoY29tcG9uZW50VVJMKSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgX3RoaXMuX2NvbXBvbmVudHNbY29tcG9uZW50VVJMXSA9IF90aGlzLl9jcmVhdGUoY29tcG9uZW50VVJMLCBzb3VyY2VDb2RlLCBjb25maWcpO1xuICAgICAgICByZXNwb25zZUNvZGUgPSAyMDA7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXNwb25zZUNvZGUgPSA1MDA7XG4gICAgICAgIHJlc3BvbnNlRGVzYyA9IGVycm9yO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZUNvZGUgPSA1MDA7XG4gICAgICByZXNwb25zZURlc2MgPSAnSW5zdGFuY2UgJyArIGNvbXBvbmVudFVSTCArICcgYWxyZWFkeSBleGlzdCEnO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSByZXNwb25zZSBtZXNzYWdlIHdpdGggTWVzc2FnZUZhY3RvcnlcbiAgICBsZXQgcmVzcG9uc2VNc2cgPSBfdGhpcy5fcmVzcG9uc2VNc2cobXNnLCByZXNwb25zZUNvZGUsIHJlc3BvbnNlRGVzYyk7XG4gICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShyZXNwb25zZU1zZyk7XG4gIH1cblxuICBfb25SZW1vdmUobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgY29tcG9uZW50VVJMID0gbXNnLmJvZHkudXJsO1xuICAgIGxldCByZXNwb25zZUNvZGU7XG4gICAgbGV0IHJlc3BvbnNlRGVzYztcblxuICAgIGlmIChfdGhpcy5fY29tcG9uZW50cy5oYXNPd25Qcm9wZXJ0eShjb21wb25lbnRVUkwpKSB7XG4gICAgICAvL3JlbW92ZSBjb21wb25lbnQgZnJvbSB0aGUgcG9vbCBhbmQgYWxsIGxpc3RlbmVyc1xuICAgICAgZGVsZXRlIF90aGlzLl9jb21wb25lbnRzW2NvbXBvbmVudFVSTF07XG4gICAgICBfdGhpcy5fYnVzLnJlbW92ZUFsbExpc3RlbmVyc09mKGNvbXBvbmVudFVSTCk7XG4gICAgICByZXNwb25zZUNvZGUgPSAyMDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3BvbnNlQ29kZSA9IDUwMDtcbiAgICAgIHJlc3BvbnNlRGVzYyA9ICdJbnN0YW5jZSAnICsgY29tcG9uZW50VVJMICsgJyBkb2VzblxcJ3QgZXhpc3QhJztcbiAgICB9XG5cbiAgICBsZXQgcmVzcG9uc2VNc2cgPSBfdGhpcy5fcmVzcG9uc2VNc2cobXNnLCByZXNwb25zZUNvZGUsIHJlc3BvbnNlRGVzYyk7XG5cbiAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHJlc3BvbnNlTXNnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGlzIG1ldGhvZCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnkgdGhlIGludGVybmFsIHNhbmRib3ggY29kZS5cbiAgICogQHBhcmFtICB7Q29tcG9uZW50VVJMfSB1cmwgVVJMIHVzZWQgZm9yIHRoZSBpbnN0YW5jZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHNvdXJjZUNvZGUgQ29kZSBvZiB0aGUgY29tcG9uZW50XG4gICAqIEBwYXJhbSAge0NvbmZpZ30gY29uZmlnIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVyc1xuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgaW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCBvciB0aHJvdyBhbiBlcnJvciBcInRocm93ICdlcnJvciBtZXNzYWdlJ1wiXG4gICAqL1xuICBfY3JlYXRlKHVybCwgc291cmNlQ29kZSwgY29uZmlnKSB7XG4gICAgLy9pbXBsZW1lbnRhdGlvbiBzcGVjaWZpY1xuICAgIC8qIGV4YW1wbGUgY29kZTpcbiAgICAgIGV2YWwoc291cmNlQ29kZSk7XG4gICAgICByZXR1cm4gYWN0aXZhdGUodXJsLCBfdGhpcy5fYnVzLCBjb25maWcpO1xuICAgICovXG4gIH1cbn1cblxuU2FuZGJveFJlZ2lzdHJ5LkV4dGVybmFsRGVwbG95QWRkcmVzcyA9ICdzYW5kYm94Oi8vZXh0ZXJuYWwnO1xuU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcyA9ICdzYW5kYm94Oi8vaW50ZXJuYWwnO1xuXG5leHBvcnQgZGVmYXVsdCBTYW5kYm94UmVnaXN0cnk7XG4iXX0=
