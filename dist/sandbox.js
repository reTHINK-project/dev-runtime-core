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

    _this._responseTimeOut = 5000; //default to 3s
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
                  body: { code: 408, desc: 'Response timeout!', value: inMsg }
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

        //if it's a provisional response, don't delete response listener
        if (msg.body.code >= 200) {
          delete _this._responseCallbacks[responseId];
        }

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NaW5pQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvUGlwZWxpbmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3guanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3NhbmRib3gvU2FuZGJveC5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvc2FuZGJveC9TYW5kYm94UmVnaXN0cnkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7d0JDQXFCLFlBQVk7Ozs7Ozs7Ozs7O0lBUTNCLE9BQU87Ozs7Ozs7OztBQVdBLFdBWFAsT0FBTyxHQVdHOzBCQVhWLE9BQU87O0FBWVQsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUUxQixTQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFNBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTlCLFNBQUssQ0FBQyxTQUFTLEdBQUcsMEJBQWEsVUFBQyxLQUFLLEVBQUs7QUFDeEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FB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Ozs7U0E1QnpDLGVBQWU7OztBQXFIckIsZUFBZSxDQUFDLHFCQUFxQixHQUFHLG9CQUFvQixDQUFDO0FBQzdELGVBQWUsQ0FBQyxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQzs7cUJBRTlDLGVBQWUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBpcGVsaW5lIGZyb20gJy4vUGlwZWxpbmUnO1xuXG4vKipcbiogQGF1dGhvciBtaWNhZWxwZWRyb3NhQGdtYWlsLmNvbVxuKiBNaW5pbWFsIGludGVyZmFjZSBhbmQgaW1wbGVtZW50YXRpb24gdG8gc2VuZCBhbmQgcmVjZWl2ZSBtZXNzYWdlcy4gSXQgY2FuIGJlIHJldXNlZCBpbiBtYW55IHR5cGUgb2YgY29tcG9uZW50cy5cbiogQ29tcG9uZW50cyB0aGF0IG5lZWQgYSBtZXNzYWdlIHN5c3RlbSBzaG91bGQgcmVjZWl2ZSB0aGlzIGNsYXNzIGFzIGEgZGVwZW5kZW5jeSBvciBleHRlbmQgaXQuXG4qIEV4dGVuc2lvbnMgc2hvdWxkIGltcGxlbWVudCB0aGUgZm9sbG93aW5nIHByaXZhdGUgbWV0aG9kczogX29uUG9zdE1lc3NhZ2UgYW5kIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXJcbiovXG5jbGFzcyBNaW5pQnVzIHtcbiAgLyogcHJpdmF0ZVxuICBfbXNnSWQ6IG51bWJlcjtcbiAgX3N1YnNjcmlwdGlvbnM6IDx1cmw6IE1zZ0xpc3RlbmVyW10+XG5cbiAgX3Jlc3BvbnNlVGltZU91dDogbnVtYmVyXG4gIF9yZXNwb25zZUNhbGxiYWNrczogPHVybCtpZDogKG1zZykgPT4gdm9pZD5cblxuICBfcGlwZWxpbmU6IFBpcGVsaW5lXG4gICovXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpcy5fbXNnSWQgPSAwO1xuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG5cbiAgICBfdGhpcy5fcmVzcG9uc2VUaW1lT3V0ID0gNTAwMDsgLy9kZWZhdWx0IHRvIDNzXG4gICAgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzID0ge307XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnUElQRUxJTkUtRVJST1I6ICcsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5fcmVnaXN0ZXJFeHRlcm5hbExpc3RlbmVyKCk7XG4gIH1cblxuICBnZXQgcGlwZWxpbmUoKSB7IHJldHVybiB0aGlzLl9waXBlbGluZTsgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIGxpc3RlbmVyIHRvIHJlY2VpdmUgbWVzc2FnZSB3aGVuIFwibXNnLnRvID09PSB1cmxcIi5cbiAgKiBTcGVjaWFsIHVybCBcIipcIiBmb3IgZGVmYXVsdCBsaXN0ZW5lciBpcyBhY2NlcHRlZCB0byBpbnRlcmNlcHQgYWxsIG1lc3NhZ2VzLlxuICAqIEBwYXJhbSB7VVJMfSB1cmwgQWRkcmVzcyB0byBpbnRlcmNlcHQsIHRoYSBpcyBpbiB0aGUgbWVzc2FnZSBcInRvXCJcbiAgKiBAcGFyYW0ge0xpc3RlbmVyfSBsaXN0ZW5lciBsaXN0ZW5lclxuICAqIEByZXR1cm4ge01zZ0xpc3RlbmVyfSBpbnN0YW5jZSBvZiBNc2dMaXN0ZW5lclxuICAqL1xuICBhZGRMaXN0ZW5lcih1cmwsIGxpc3RlbmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBpdGVtID0gbmV3IE1zZ0xpc3RlbmVyKF90aGlzLl9zdWJzY3JpcHRpb25zLCB1cmwsIGxpc3RlbmVyKTtcbiAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdO1xuICAgIGlmICghaXRlbUxpc3QpIHtcbiAgICAgIGl0ZW1MaXN0ID0gW107XG4gICAgICBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdID0gaXRlbUxpc3Q7XG4gICAgfVxuXG4gICAgaXRlbUxpc3QucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSBhZGQgYSByZXNwb25zZSBsaXN0ZW5lci4gT25seSBvbmUgbGlzdGVuZXIgcGVyIG1lc3NhZ2UgSUQgc2hvdWxkIGV4aXN0LlxuICAgKiBBVEVOVElPTiwgdGhlcmUgaXMgbm8gdGltZW91dCBmb3IgdGhpcyBsaXN0ZW5lci5cbiAgICogVGhlIGxpc3RlbmVyIHNob3VsZCBiZSByZW1vdmVkIHdpdGggYSByZW1vdmVSZXNwb25zZUxpc3RlbmVyLCBmYWlsaW5nIHRvIGRvIHRoaXMgd2lsbCByZXN1bHQgaW4gYSB1bnJlbGVhc2VkIG1lbW9yeSBwcm9ibGVtLlxuICAgKiBAcGFyYW0ge1VSTH0gdXJsIE9yaWdpbiBhZGRyZXNzIG9mIHRoZSBtZXNzYWdlIHNlbnQsIFwibXNnLmZyb21cIi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1zZ0lkIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzcG9uc2VMaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIHJlc3BvbnNlXG4gICAqL1xuICBhZGRSZXNwb25zZUxpc3RlbmVyKHVybCwgbXNnSWQsIHJlc3BvbnNlTGlzdGVuZXIpIHtcbiAgICB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1t1cmwgKyBtc2dJZF0gPSByZXNwb25zZUxpc3RlbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgcmVzcG9uc2UgbGlzdGVuZXIuXG4gICAqIEBwYXJhbSB7VVJMfSB1cmwgT3JpZ2luIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2Ugc2VudCwgXCJtc2cuZnJvbVwiLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNnSWQgIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZVxuICAgKi9cbiAgcmVtb3ZlUmVzcG9uc2VMaXN0ZW5lcih1cmwsIG1zZ0lkKSB7XG4gICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3VybCArIG1zZ0lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGV4aXN0ZW50IGxpc3RlbmVycyBmb3IgdGhlIFVSTFxuICAgKiBAcGFyYW0gIHtVUkx9IHVybCBBZGRyZXNzIHJlZ2lzdGVyZWRcbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVyc09mKHVybCkge1xuICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gIH1cblxuICAvKipcbiAgKiBTZW5kIG1lc3NhZ2VzIHRvIGxvY2FsIGxpc3RlbmVycywgb3IgaWYgbm90IGV4aXN0cyB0byBleHRlcm5hbCBsaXN0ZW5lcnMuXG4gICogSXQncyBoYXMgYW4gb3B0aW9uYWwgbWVjaGFuaXNtIGZvciBhdXRvbWF0aWMgbWFuYWdlbWVudCBvZiByZXNwb25zZSBoYW5kbGVycy5cbiAgKiBUaGUgcmVzcG9uc2UgaGFuZGxlciB3aWxsIGJlIHVucmVnaXN0ZXJlZCBhZnRlciByZWNlaXZpbmcgdGhlIHJlc3BvbnNlLCBvciBhZnRlciByZXNwb25zZSB0aW1lb3V0IChkZWZhdWx0IHRvIDNzKS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlfSBtc2cgTWVzc2FnZSB0byBzZW5kLiBNZXNzYWdlIElEIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gdGhlIG1lc3NhZ2UuXG4gICogQHBhcmFtICB7RnVuY3Rpb259IHJlc3BvbnNlQ2FsbGJhY2sgT3B0aW9uYWwgcGFyYW1ldGVyLCBpZiB0aGUgZGV2ZWxvcGVyIHdoYXQncyBhdXRvbWF0aWMgcmVzcG9uc2UgbWFuYWdlbWVudC5cbiAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybnMgdGhlIG1lc3NhZ2UgSUQsIGluIGNhc2UgaXQgc2hvdWxkIGJlIG5lZWRlZCBmb3IgbWFudWFsIG1hbmFnZW1lbnQgb2YgdGhlIHJlc3BvbnNlIGhhbmRsZXIuXG4gICovXG4gIHBvc3RNZXNzYWdlKGluTXNnLCByZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vVE9ETzogaG93IGRvIHdlIG1hbmFnZSBtZXNzYWdlIElEJ3M/IFNob3VsZCBpdCBiZSBhIGdsb2JhbCBydW50aW1lIGNvdW50ZXIsIG9yIHBlciBVUkwgYWRkcmVzcz9cbiAgICAvL0dsb2JhbCBjb3VudGVyIHdpbGwgbm90IHdvcmssIGJlY2F1c2UgdGhlcmUgd2lsbCBiZSBtdWx0aXBsZSBNaW5pQnVzIGluc3RhbmNlcyFcbiAgICAvL1BlciBVUkwsIGNhbiBiZSBhIGxvdCBvZiBkYXRhIHRvIG1haW50YWluIVxuICAgIC8vTWF5YmUgYSBjb3VudGVyIHBlciBNaW5pQnVzIGluc3RhbmNlLiBUaGlzIGlzIHRoZSBhc3N1bWVkIHNvbHV0aW9uIGZvciBub3cuXG4gICAgaWYgKCFpbk1zZy5pZCB8fCBpbk1zZy5pZCA9PT0gMCkge1xuICAgICAgX3RoaXMuX21zZ0lkKys7XG4gICAgICBpbk1zZy5pZCA9IF90aGlzLl9tc2dJZDtcbiAgICB9XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUucHJvY2Vzcyhpbk1zZywgKG1zZykgPT4ge1xuXG4gICAgICAvL2F1dG9tYXRpYyBtYW5hZ2VtZW50IG9mIHJlc3BvbnNlIGhhbmRsZXJzXG4gICAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xuICAgICAgICBsZXQgcmVzcG9uc2VJZCA9IG1zZy5mcm9tICsgbXNnLmlkO1xuICAgICAgICBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF0gPSByZXNwb25zZUNhbGxiYWNrO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxldCByZXNwb25zZUZ1biA9IF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcbiAgICAgICAgICBkZWxldGUgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlRnVuKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNc2cgPSB7XG4gICAgICAgICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsXG4gICAgICAgICAgICAgIGJvZHk6IHsgY29kZTogNDA4LCBkZXNjOiAnUmVzcG9uc2UgdGltZW91dCEnLCB2YWx1ZTogaW5Nc2cgfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzcG9uc2VGdW4oZXJyb3JNc2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX3RoaXMuX3Jlc3BvbnNlVGltZU91dCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghX3RoaXMuX29uUmVzcG9uc2UobXNnKSkge1xuICAgICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1ttc2cudG9dO1xuICAgICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgICAvL2RvIG5vdCBwdWJsaXNoIG9uIGRlZmF1bHQgYWRkcmVzcywgYmVjYXVzZSBvZiBsb29wYmFjayBjeWNsZVxuICAgICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9pZiB0aGVyZSBpcyBubyBsaXN0ZW5lciwgc2VuZCB0byBleHRlcm5hbCBpbnRlcmZhY2VcbiAgICAgICAgICBfdGhpcy5fb25Qb3N0TWVzc2FnZShtc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5Nc2cuaWQ7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byBiaW5kIGxpc3RlbmVycyAoaW4gYm90aCBkaXJlY3Rpb25zKSBpbnRvIG90aGVyIE1pbmlCdXMgdGFyZ2V0LlxuICAgKiBAcGFyYW0gIHtVUkx9IG91dFVybCBPdXRib3VuZCBVUkwsIHJlZ2lzdGVyIGxpc3RlbmVyIGZvciB1cmwgaW4gZGlyZWN0aW9uIFwidGhpcyAtPiB0YXJnZXRcIlxuICAgKiBAcGFyYW0gIHtVUkx9IGluVXJsIEluYm91bmQgVVJMLCByZWdpc3RlciBsaXN0ZW5lciBmb3IgdXJsIGluIGRpcmVjdGlvbiBcInRhcmdldCAtPiB0aGlzXCJcbiAgICogQHBhcmFtICB7TWluaUJ1c30gdGFyZ2V0IFRoZSBvdGhlciB0YXJnZXQgTWluaUJ1c1xuICAgKiBAcmV0dXJuIHtCb3VuZH0gYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgW3RoaXNMaXN0ZW5lciwgdGFyZ2V0TGlzdGVuZXJdIGFuZCB0aGUgdW5iaW5kIG1ldGhvZC5cbiAgICovXG4gIGJpbmQob3V0VXJsLCBpblVybCwgdGFyZ2V0KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCB0aGlzTGlzdG4gPSBfdGhpcy5hZGRMaXN0ZW5lcihvdXRVcmwsIChtc2cpID0+IHtcbiAgICAgIHRhcmdldC5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH0pO1xuXG4gICAgbGV0IHRhcmdldExpc3RuID0gdGFyZ2V0LmFkZExpc3RlbmVyKGluVXJsLCAobXNnKSA9PiB7XG4gICAgICBfdGhpcy5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRoaXNMaXN0ZW5lcjogdGhpc0xpc3RuLFxuICAgICAgdGFyZ2V0TGlzdGVuZXI6IHRhcmdldExpc3RuLFxuICAgICAgdW5iaW5kOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudGhpc0xpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnRhcmdldExpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvL3B1Ymxpc2ggb24gYSBzdWJzY3JpcHRpb24gbGlzdC5cbiAgX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKSB7XG4gICAgaXRlbUxpc3QuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBzdWIuX2NhbGxiYWNrKG1zZyk7XG4gICAgfSk7XG4gIH1cblxuICBfb25SZXNwb25zZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICBsZXQgcmVzcG9uc2VJZCA9IG1zZy50byArIG1zZy5pZDtcbiAgICAgIGxldCByZXNwb25zZUZ1biA9IF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcblxuICAgICAgLy9pZiBpdCdzIGEgcHJvdmlzaW9uYWwgcmVzcG9uc2UsIGRvbid0IGRlbGV0ZSByZXNwb25zZSBsaXN0ZW5lclxuICAgICAgaWYgKG1zZy5ib2R5LmNvZGUgPj0gMjAwKSB7XG4gICAgICAgIGRlbGV0ZSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXNwb25zZUZ1bikge1xuICAgICAgICByZXNwb25zZUZ1bihtc2cpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvL3JlY2VpdmUgbWVzc2FnZXMgZnJvbSBleHRlcm5hbCBpbnRlcmZhY2VcbiAgX29uTWVzc2FnZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5fb25SZXNwb25zZShtc2cpKSB7XG4gICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1ttc2cudG9dO1xuICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2lzIHRoZXJlIGFueSBcIipcIiAoZGVmYXVsdCkgbGlzdGVuZXJzP1xuICAgICAgICBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zWycqJ107XG4gICAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTm90IHB1YmxpYyBhdmFpbGFibGUsIHVzZWQgYnkgdGhlIGNsYXNzIGV4dGVuc2lvbiBpbXBsZW1lbnRhdGlvbiwgdG8gcHJvY2VzcyBtZXNzYWdlcyBmcm9tIHRoZSBwdWJsaWMgXCJwb3N0TWVzc2FnZVwiIHdpdGhvdXQgYSByZWdpc3RlcmVkIGxpc3RlbmVyLlxuICAgKiBVc2VkIHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtc2cgTWVzc2FnZVxuICAgKi9cbiAgX29uUG9zdE1lc3NhZ2UobXNnKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCBzZW5kIG1lc3NhZ2UgdG8gZXh0ZXJuYWwgc3lzdGVtKi8gfVxuXG4gIC8qKlxuICAgKiBOb3QgcHVibGljIGF2YWlsYWJsZSwgdXNlZCBieSB0aGUgY2xhc3MgZXh0ZW5zaW9uIGltcGxlbWVudGF0aW9uLCB0byBwcm9jZXNzIGFsbCBtZXNzYWdlcyB0aGF0IGVudGVyIHRoZSBNaW5pQnVzIGZyb20gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIG9uZSB0aW1lIGluIHRoZSBjb25zdHJ1Y3RvciB0byByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lcnMuXG4gICAqIFRoZSBpbXBsZW1lbnRhdGlvbiB3aWxsIHByb2JhYmx5IGNhbGwgdGhlIFwiX29uTWVzc2FnZVwiIG1ldGhvZCB0byBwdWJsaXNoIGluIHRoZSBsb2NhbCBsaXN0ZW5lcnMuXG4gICAqIERPIE5PVCBjYWxsIFwicG9zdE1lc3NhZ2VcIiwgdGhlcmUgaXMgYSBkYW5nZXIgdGhhdCB0aGUgbWVzc2FnZSBlbnRlcnMgaW4gYSBjeWNsZSFcbiAgICovXG4gIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lciBhbmQgY2FsbCBcInRoaXMuX29uTWVzc2FnZShtc2cpXCIgKi8gfVxuXG59XG5cbmNsYXNzIE1zZ0xpc3RlbmVyIHtcbiAgLyogcHJpdmF0ZVxuICBfc3Vic2NyaXB0aW9uczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT47XG4gIF91cmw6IHN0cmluZztcbiAgX2NhbGxiYWNrOiAobXNnKSA9PiB2b2lkO1xuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbnMsIHVybCwgY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSBzdWJzY3JpcHRpb25zO1xuICAgIF90aGlzLl91cmwgPSB1cmw7XG4gICAgX3RoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsOyB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgc3VicyA9IF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgIGlmIChzdWJzKSB7XG4gICAgICBsZXQgaW5kZXggPSBzdWJzLmluZGV4T2YoX3RoaXMpO1xuICAgICAgc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAvL2lmIHRoZXJlIGFyZSBubyBsaXN0ZW5lcnMsIHJlbW92ZSB0aGUgc3Vic2NyaXB0aW9uIGVudGlyZWx5LlxuICAgICAgaWYgKHN1YnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tfdGhpcy5fdXJsXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWluaUJ1cztcbiIsIi8qKlxuKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4qIFBpcGVsaW5lXG4qIFNlcXVlbmNpYWwgcHJvY2Vzc29yIG9mIG1ldGhvZHMuIFNpbWlsYXIgdG8gaG93IFNlcXVlbnRpYWwgUHJvbWlzZSdzIHdvcmssIGJ1dCBiZXR0ZXIgZml0IGZvciBtZXNzYWdlIHByb2Nlc3NpbmcuXG4qL1xuY2xhc3MgUGlwZWxpbmUge1xuICAvKiBwdWJsaWNcbiAgICBoYW5kbGVyczogKChQaXBlQ29udGV4dCkgPT4gdm9pZClbXVxuICAgIG9uRmFpbDogKGVycm9yKSA9PiB2b2lkXG4gICovXG5cbiAgY29uc3RydWN0b3IoX29uRmFpbCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgIF90aGlzLm9uRmFpbCA9IF9vbkZhaWw7XG4gIH1cblxuICBwcm9jZXNzKG1zZywgb25EZWxpdmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmIChfdGhpcy5oYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgaXRlciA9IG5ldyBJdGVyYXRvcihfdGhpcy5oYW5kbGVycyk7XG4gICAgICBpdGVyLm5leHQobmV3IFBpcGVDb250ZXh0KF90aGlzLCBpdGVyLCBtc2csIG9uRGVsaXZlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbkRlbGl2ZXIobXNnKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUGlwZUNvbnRleHQge1xuICAvKiBwcml2YXRlXG4gICAgX2luU3RvcDogYm9vbGVhblxuXG4gICAgX3BpcGVsaW5lOiBQaXBlbGluZVxuICAgIF9pdGVyOiBJdGVyYXRvclxuICAgIF9tc2c6IE1lc3NhZ2VcbiAgKi9cblxuICBjb25zdHJ1Y3RvcihwaXBlbGluZSwgaXRlciwgbXNnLCBvbkRlbGl2ZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2luU3RvcCA9IGZhbHNlO1xuXG4gICAgX3RoaXMuX3BpcGVsaW5lID0gcGlwZWxpbmU7XG4gICAgX3RoaXMuX2l0ZXIgPSBpdGVyO1xuICAgIF90aGlzLl9tc2cgPSBtc2c7XG4gICAgX3RoaXMuX29uRGVsaXZlciA9IG9uRGVsaXZlcjtcbiAgfVxuXG4gIGdldCBwaXBlbGluZSgpIHsgcmV0dXJuIHRoaXMuX3BpcGVsaW5lOyB9XG5cbiAgZ2V0IG1zZygpIHsgcmV0dXJuIHRoaXMuX21zZzsgfVxuICBzZXQgbXNnKGluTXNnKSB7IHRoaXMuX21zZyA9IGluTXNnOyB9XG5cbiAgbmV4dCgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBpZiAoX3RoaXMuX2l0ZXIuaGFzTmV4dCkge1xuICAgICAgICBfdGhpcy5faXRlci5uZXh0KF90aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLl9vbkRlbGl2ZXIoX3RoaXMuX21zZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVsaXZlcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGlmICghX3RoaXMuX2luU3RvcCkge1xuICAgICAgX3RoaXMuX2luU3RvcCA9IHRydWU7XG4gICAgICBfdGhpcy5fb25EZWxpdmVyKF90aGlzLl9tc2cpO1xuICAgIH1cbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBfdGhpcy5faW5TdG9wID0gdHJ1ZTtcbiAgICAgIGlmIChfdGhpcy5fcGlwZWxpbmUub25GYWlsKSB7XG4gICAgICAgIF90aGlzLl9waXBlbGluZS5vbkZhaWwoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gIC8qIHByaXZhdGVcbiAgICBfaW5kZXg6IG51bWJlclxuICAgIF9hcnJheTogW11cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihhcnJheSkge1xuICAgIHRoaXMuX2luZGV4ID0gLTE7XG4gICAgdGhpcy5fYXJyYXkgPSBhcnJheTtcbiAgfVxuXG4gIGdldCBoYXNOZXh0KCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleCA8IHRoaXMuX2FycmF5Lmxlbmd0aCAtIDE7XG4gIH1cblxuICBnZXQgbmV4dCgpIHtcbiAgICB0aGlzLl9pbmRleCsrO1xuICAgIHJldHVybiB0aGlzLl9hcnJheVt0aGlzLl9pbmRleF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGlwZWxpbmU7XG4iLCJpbXBvcnQgU2FuZGJveCBmcm9tICcuL3NhbmRib3gvU2FuZGJveCc7XG5pbXBvcnQgU2FuZGJveFJlZ2lzdHJ5IGZyb20gJy4vc2FuZGJveC9TYW5kYm94UmVnaXN0cnknO1xuXG5leHBvcnQge1NhbmRib3gsIFNhbmRib3hSZWdpc3RyeX07XG4iLCJpbXBvcnQgU2FuZGJveFJlZ2lzdHJ5IGZyb20gJy4uL3NhbmRib3gvU2FuZGJveFJlZ2lzdHJ5JztcbmltcG9ydCBNaW5pQnVzIGZyb20gJy4uL2J1cy9NaW5pQnVzJztcbi8vIGltcG9ydCBNZXNzYWdlRmFjdG9yeSBmcm9tICcuLi8uLi9yZXNvdXJjZXMvTWVzc2FnZUZhY3RvcnknO1xuXG4vKipcbiAqIEBhdXRob3IgbWljYWVscGVkcm9zYUBnbWFpbC5jb21cbiAqIEJhc2UgY2xhc3MgdG8gaW1wbGVtZW50IGV4dGVybmFsIHNhbmRib3ggY29tcG9uZW50XG4gKi9cbmNsYXNzIFNhbmRib3ggZXh0ZW5kcyBNaW5pQnVzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHN1cGVyKCk7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy8gQWRkIE1lc3NhZ2UgRmFjdG9yeVxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IG5ldyBNZXNzYWdlRmFjdG9yeSgpO1xuICAgIC8vIF90aGlzLm1lc3NhZ2VGYWN0b3J5ID0gbWVzc2FnZUZhY3Rvcnk7XG4gIH1cblxuICAvKipcbiAgICogRGVwbG95IGFuIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgaW50byB0aGUgc2FuZGJveC5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb21wb25lbnRTb3VyY2VDb2RlIENvbXBvbmVudCBzb3VyY2UgY29kZSAoSHlwZXJ0eSwgUHJvdG9TdHViLCBldGMpXG4gICAqIEBwYXJhbSAge1VSTH0gY29tcG9uZW50VVJMIEh5cGVydHksIFByb3RvU3R1Yiwgb3IgYW55IG90aGVyIGNvbXBvbmVudCBhZGRyZXNzLlxuICAgKiBAcGFyYW0gIHtDb25maWd9IGNvbmZpZ3VyYXRpb24gQ29uZmlnIHBhcmFtZXRlcnMgb2YgdGhlIGNvbXBvbmVudFxuICAgKiBAcmV0dXJuIHtQcm9taXNlPHN0cmluZz59IHJldHVybiBkZXBsb3llZCBpZiBzdWNjZXNzZnVsLCBvciBhbnkgb3RoZXIgc3RyaW5nIHdpdGggYW4gZXJyb3JcbiAgICovXG4gIGRlcGxveUNvbXBvbmVudChjb21wb25lbnRTb3VyY2VDb2RlLCBjb21wb25lbnRVUkwsIGNvbmZpZ3VyYXRpb24pIHtcblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBsZXQgbWVzc2FnZUZhY3RvcnkgPSBfdGhpcy5tZXNzYWdlRmFjdG9yeTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL1RPRE86IG1lc3NhZ2UgZm9ybWF0IGlzIG5vdCBwcm9wZXJseSBkZWZpbmVkIHlldFxuICAgICAgbGV0IGRlcGxveU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdjcmVhdGUnLCBmcm9tOiBTYW5kYm94UmVnaXN0cnkuRXh0ZXJuYWxEZXBsb3lBZGRyZXNzLCB0bzogU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcyxcbiAgICAgICAgYm9keTogeyB1cmw6IGNvbXBvbmVudFVSTCwgc291cmNlQ29kZTogY29tcG9uZW50U291cmNlQ29kZSwgY29uZmlnOiBjb25maWd1cmF0aW9uIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIGNyZWF0ZU1lc3NhZ2VSZXF1ZXN0KGZyb20sIHRvLCBjb250ZXh0SWQsIHZhbHVlLCBwb2xpY3ksIGlkVG9rZW4sIGFjY2Vzc1Rva2VuLCByZXNvdXJjZSwgc2lnbmF0dXJlKVxuICAgICAgLy8gbGV0IGRlcGxveU1lc3NhZ2UgPSBtZXNzYWdlRmFjdG9yeS5jcmVhdGVNZXNzYWdlUmVxdWVzdChTYW5kYm94UmVnaXN0cnkuRXh0ZXJuYWxEZXBsb3lBZGRyZXNzLCBTYW5kYm94UmVnaXN0cnkuSW50ZXJuYWxEZXBsb3lBZGRyZXNzLCAnZGVwbG95Jywge3VybDogY29tcG9uZW50VVJMLCBzb3VyY2VDb2RlOiBjb21wb25lbnRTb3VyY2VDb2RlLCBjb25maWc6IGNvbmZpZ3VyYXRpb259KTtcblxuICAgICAgLy9zZW5kIG1lc3NhZ2UgaW50byB0aGUgc2FuZGJveCBpbnRlcm5hbHMgYW5kIHdhaXQgZm9yIHJlcGx5XG4gICAgICBfdGhpcy5wb3N0TWVzc2FnZShkZXBsb3lNZXNzYWdlLCAocmVwbHkpID0+IHtcbiAgICAgICAgaWYgKHJlcGx5LmJvZHkuY29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgLy9pcyB0aGlzIHJlc3BvbnNlIGNvbXBsYWludCB3aXRoIHRoZSBzcGVjP1xuICAgICAgICAgIHJlc29sdmUoJ2RlcGxveWVkJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVqZWN0KHJlcGx5LmJvZHkuZGVzYyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgaW5zdGFuY2Ugb2YgYSBwcmV2aW91c2x5IGRlcGxveWVkIGNvbXBvbmVudC5cbiAgICogQHBhcmFtICB7VVJMfSBjb21wb25lbnRVUkwgSHlwZXJ0eSwgUHJvdG9TdHViLCBvciBhbnkgb3RoZXIgY29tcG9uZW50IGFkZHJlc3MuXG4gICAqIEByZXR1cm4ge1Byb21pc2U8c3RyaW5nPn0gcmV0dXJuIHVuZGVwbG95ZWQgaWYgc3VjY2Vzc2Z1bCwgb3IgYW55IG90aGVyIHN0cmluZyB3aXRoIGFuIGVycm9yXG4gICAqL1xuICByZW1vdmVDb21wb25lbnQoY29tcG9uZW50VVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAvL1RPRE86IG1lc3NhZ2UgZm9ybWF0IGlzIG5vdCBwcm9wZXJseSBkZWZpbmVkIHlldFxuICAgICAgbGV0IHJlbW92ZU1lc3NhZ2UgPSB7XG4gICAgICAgIHR5cGU6ICdkZWxldGUnLCBmcm9tOiBTYW5kYm94UmVnaXN0cnkuRXh0ZXJuYWxEZXBsb3lBZGRyZXNzLCB0bzogU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcyxcbiAgICAgICAgYm9keTogeyB1cmw6IGNvbXBvbmVudFVSTCB9XG4gICAgICB9O1xuXG4gICAgICAvL3NlbmQgbWVzc2FnZSBpbnRvIHRoZSBzYW5kYm94IGludGVybmFscyBhbmQgd2FpdCBmb3IgcmVwbHlcbiAgICAgIF90aGlzLnBvc3RNZXNzYWdlKHJlbW92ZU1lc3NhZ2UsIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICAvL2lzIHRoaXMgcmVzcG9uc2UgY29tcGxhaW50IHdpdGggdGhlIHNwZWM/XG4gICAgICAgICAgcmVzb2x2ZSgndW5kZXBsb3llZCcpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXBseS5ib2R5LmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTYW5kYm94O1xuIiwiLyoqXG4gKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4gKiBCYXNlIGNsYXNzIHRvIGltcGxlbWVudCBpbnRlcm5hbCBkZXBsb3kgbWFuYWdlciBvZiBjb21wb25lbnRzLlxuICovXG5cbi8vIGltcG9ydCBNZXNzYWdlRmFjdG9yeSBmcm9tICcuLi8uLi9yZXNvdXJjZXMvTWVzc2FnZUZhY3RvcnknO1xuXG5jbGFzcyBTYW5kYm94UmVnaXN0cnkge1xuICAvKiBwcml2YXRlXG4gIF9jb21wb25lbnRzOiA8dXJsOiBpbnN0YW5jZT5cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihidXMpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2J1cyA9IGJ1cztcbiAgICBfdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgLy8gQWRkIE1lc3NhZ2UgRmFjdG9yeVxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IG5ldyBNZXNzYWdlRmFjdG9yeSgpO1xuICAgIC8vIF90aGlzLm1lc3NhZ2VGYWN0b3J5ID0gbWVzc2FnZUZhY3Rvcnk7XG5cbiAgICBidXMuYWRkTGlzdGVuZXIoU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcywgKG1zZykgPT4ge1xuICAgICAgLy9jb25zb2xlLmxvZygnU2FuZGJveFJlZ2lzdHJ5LVJDVjogJywgbXNnKTtcbiAgICAgIC8vIGxldCByZXNwb25zZU1zZyA9IHtcbiAgICAgIC8vICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcywgdG86IFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3NcbiAgICAgIC8vIH07XG5cbiAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlJzogX3RoaXMuX29uRGVwbG95KG1zZyk7IGJyZWFrO1xuICAgICAgICBjYXNlICdkZWxldGUnOiBfdGhpcy5fb25SZW1vdmUobXNnKTsgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgY29tcG9uZW50cygpIHsgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7IH1cblxuICBfcmVzcG9uc2VNc2cobXNnLCBjb2RlLCB2YWx1ZSkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IF90aGlzLm1lc3NhZ2VGYWN0b3J5O1xuXG4gICAgbGV0IHJlc3BvbnNlTXNnID0ge1xuICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcywgdG86IFNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3NcbiAgICB9O1xuXG4gICAgLy8gQ2hhbmVnZSB0aGUgb3JpZ2luIG1lc3NhZ2UsIGJlY2F1c2UgdGhlIHJlc3BvbnNlO1xuICAgIC8vIG1zZy5mcm9tID0gU2FuZGJveFJlZ2lzdHJ5LkludGVybmFsRGVwbG95QWRkcmVzcztcbiAgICAvLyBtc2cudG8gPSBTYW5kYm94UmVnaXN0cnkuRXh0ZXJuYWxEZXBsb3lBZGRyZXNzO1xuXG4gICAgbGV0IGJvZHkgPSB7fTtcbiAgICBpZiAoY29kZSkgYm9keS5jb2RlID0gY29kZTtcbiAgICBpZiAodmFsdWUpIGJvZHkuZGVzYyA9IHZhbHVlO1xuXG4gICAgcmVzcG9uc2VNc2cuYm9keSA9IGJvZHk7XG5cbiAgICAvLyByZXR1cm4gbWVzc2FnZUZhY3RvcnkuY3JlYXRlUmVzcG9uc2UobXNnLCBjb2RlLCB2YWx1ZSk7XG4gICAgcmV0dXJuIHJlc3BvbnNlTXNnO1xuICB9XG5cbiAgX29uRGVwbG95KG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IGNvbmZpZyA9IG1zZy5ib2R5LmNvbmZpZztcbiAgICBsZXQgY29tcG9uZW50VVJMID0gbXNnLmJvZHkudXJsO1xuICAgIGxldCBzb3VyY2VDb2RlID0gbXNnLmJvZHkuc291cmNlQ29kZTtcbiAgICBsZXQgcmVzcG9uc2VDb2RlO1xuICAgIGxldCByZXNwb25zZURlc2M7XG5cbiAgICBpZiAoIV90aGlzLl9jb21wb25lbnRzLmhhc093blByb3BlcnR5KGNvbXBvbmVudFVSTCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIF90aGlzLl9jb21wb25lbnRzW2NvbXBvbmVudFVSTF0gPSBfdGhpcy5fY3JlYXRlKGNvbXBvbmVudFVSTCwgc291cmNlQ29kZSwgY29uZmlnKTtcbiAgICAgICAgcmVzcG9uc2VDb2RlID0gMjAwO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzcG9uc2VDb2RlID0gNTAwO1xuICAgICAgICByZXNwb25zZURlc2MgPSBlcnJvcjtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzcG9uc2VDb2RlID0gNTAwO1xuICAgICAgcmVzcG9uc2VEZXNjID0gJ0luc3RhbmNlICcgKyBjb21wb25lbnRVUkwgKyAnIGFscmVhZHkgZXhpc3QhJztcbiAgICB9XG5cbiAgICAvLyBDcmVhdGUgcmVzcG9uc2UgbWVzc2FnZSB3aXRoIE1lc3NhZ2VGYWN0b3J5XG4gICAgbGV0IHJlc3BvbnNlTXNnID0gX3RoaXMuX3Jlc3BvbnNlTXNnKG1zZywgcmVzcG9uc2VDb2RlLCByZXNwb25zZURlc2MpO1xuICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2UocmVzcG9uc2VNc2cpO1xuICB9XG5cbiAgX29uUmVtb3ZlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IGNvbXBvbmVudFVSTCA9IG1zZy5ib2R5LnVybDtcbiAgICBsZXQgcmVzcG9uc2VDb2RlO1xuICAgIGxldCByZXNwb25zZURlc2M7XG5cbiAgICBpZiAoX3RoaXMuX2NvbXBvbmVudHMuaGFzT3duUHJvcGVydHkoY29tcG9uZW50VVJMKSkge1xuICAgICAgLy9yZW1vdmUgY29tcG9uZW50IGZyb20gdGhlIHBvb2wgYW5kIGFsbCBsaXN0ZW5lcnNcbiAgICAgIGRlbGV0ZSBfdGhpcy5fY29tcG9uZW50c1tjb21wb25lbnRVUkxdO1xuICAgICAgX3RoaXMuX2J1cy5yZW1vdmVBbGxMaXN0ZW5lcnNPZihjb21wb25lbnRVUkwpO1xuICAgICAgcmVzcG9uc2VDb2RlID0gMjAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXNwb25zZUNvZGUgPSA1MDA7XG4gICAgICByZXNwb25zZURlc2MgPSAnSW5zdGFuY2UgJyArIGNvbXBvbmVudFVSTCArICcgZG9lc25cXCd0IGV4aXN0ISc7XG4gICAgfVxuXG4gICAgbGV0IHJlc3BvbnNlTXNnID0gX3RoaXMuX3Jlc3BvbnNlTXNnKG1zZywgcmVzcG9uc2VDb2RlLCByZXNwb25zZURlc2MpO1xuXG4gICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShyZXNwb25zZU1zZyk7XG4gIH1cblxuICAvKipcbiAgICogVGhpcyBtZXRob2Qgc2hvdWxkIGJlIGltcGxlbWVudGVkIGJ5IHRoZSBpbnRlcm5hbCBzYW5kYm94IGNvZGUuXG4gICAqIEBwYXJhbSAge0NvbXBvbmVudFVSTH0gdXJsIFVSTCB1c2VkIGZvciB0aGUgaW5zdGFuY2VcbiAgICogQHBhcmFtICB7c3RyaW5nfSBzb3VyY2VDb2RlIENvZGUgb2YgdGhlIGNvbXBvbmVudFxuICAgKiBAcGFyYW0gIHtDb25maWd9IGNvbmZpZyBDb25maWd1cmF0aW9uIHBhcmFtZXRlcnNcbiAgICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgb3IgdGhyb3cgYW4gZXJyb3IgXCJ0aHJvdyAnZXJyb3IgbWVzc2FnZSdcIlxuICAgKi9cbiAgX2NyZWF0ZSh1cmwsIHNvdXJjZUNvZGUsIGNvbmZpZykge1xuICAgIC8vaW1wbGVtZW50YXRpb24gc3BlY2lmaWNcbiAgICAvKiBleGFtcGxlIGNvZGU6XG4gICAgICBldmFsKHNvdXJjZUNvZGUpO1xuICAgICAgcmV0dXJuIGFjdGl2YXRlKHVybCwgX3RoaXMuX2J1cywgY29uZmlnKTtcbiAgICAqL1xuICB9XG59XG5cblNhbmRib3hSZWdpc3RyeS5FeHRlcm5hbERlcGxveUFkZHJlc3MgPSAnc2FuZGJveDovL2V4dGVybmFsJztcblNhbmRib3hSZWdpc3RyeS5JbnRlcm5hbERlcGxveUFkZHJlc3MgPSAnc2FuZGJveDovL2ludGVybmFsJztcblxuZXhwb3J0IGRlZmF1bHQgU2FuZGJveFJlZ2lzdHJ5O1xuIl19
