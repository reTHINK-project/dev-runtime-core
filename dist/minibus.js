// Runtime User Agent 

// version: 0.2.0

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.MiniBus = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var _busMiniBus = require('./bus/MiniBus');

var _busMiniBus2 = _interopRequireDefault(_busMiniBus);

exports.MiniBus = _busMiniBus2['default'];

},{"./bus/MiniBus":1}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NaW5pQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvUGlwZWxpbmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL21pbmlidXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7d0JDQXFCLFlBQVk7Ozs7Ozs7Ozs7O0lBUTNCLE9BQU87Ozs7Ozs7OztBQVdBLFdBWFAsT0FBTyxHQVdHOzBCQVhWLE9BQU87O0FBWVQsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUUxQixTQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFNBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTlCLFNBQUssQ0FBQyxTQUFTLEdBQUcsMEJBQWEsVUFBQyxLQUFLLEVBQUs7QUFDeEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDOztBQUVILFNBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0dBQ25DOztlQXhCRyxPQUFPOzs7Ozs7Ozs7O1dBbUNBLHFCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDekIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksR0FB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Q0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7T0FDRjtLQUNGOzs7U0FsQ1csZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQztLQUFFOzs7U0FFbEMsZUFBRztBQUFFLGFBQU8sSUFBSSxDQUFDLElBQUksQ0FBQztLQUFFO1NBQ3hCLGFBQUMsS0FBSyxFQUFFO0FBQUUsVUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7S0FBRTs7O1NBdkJqQyxXQUFXOzs7SUF5RFgsUUFBUTs7Ozs7O0FBTUQsV0FOUCxRQUFRLENBTUEsS0FBSyxFQUFFOzBCQU5mLFFBQVE7O0FBT1YsUUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNqQixRQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztHQUNyQjs7ZUFURyxRQUFROztTQVdELGVBQUc7QUFDWixhQUFPLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQzdDOzs7U0FFTyxlQUFHO0FBQ1QsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ2QsYUFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQzs7O1NBbEJHLFFBQVE7OztxQkFxQkMsUUFBUTs7Ozs7Ozs7Ozs7OzBCQzVHSCxlQUFlOzs7O1FBQzNCLE9BQU8iLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFBpcGVsaW5lIGZyb20gJy4vUGlwZWxpbmUnO1xuXG4vKipcbiogQGF1dGhvciBtaWNhZWxwZWRyb3NhQGdtYWlsLmNvbVxuKiBNaW5pbWFsIGludGVyZmFjZSBhbmQgaW1wbGVtZW50YXRpb24gdG8gc2VuZCBhbmQgcmVjZWl2ZSBtZXNzYWdlcy4gSXQgY2FuIGJlIHJldXNlZCBpbiBtYW55IHR5cGUgb2YgY29tcG9uZW50cy5cbiogQ29tcG9uZW50cyB0aGF0IG5lZWQgYSBtZXNzYWdlIHN5c3RlbSBzaG91bGQgcmVjZWl2ZSB0aGlzIGNsYXNzIGFzIGEgZGVwZW5kZW5jeSBvciBleHRlbmQgaXQuXG4qIEV4dGVuc2lvbnMgc2hvdWxkIGltcGxlbWVudCB0aGUgZm9sbG93aW5nIHByaXZhdGUgbWV0aG9kczogX29uUG9zdE1lc3NhZ2UgYW5kIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXJcbiovXG5jbGFzcyBNaW5pQnVzIHtcbiAgLyogcHJpdmF0ZVxuICBfbXNnSWQ6IG51bWJlcjtcbiAgX3N1YnNjcmlwdGlvbnM6IDx1cmw6IE1zZ0xpc3RlbmVyW10+XG5cbiAgX3Jlc3BvbnNlVGltZU91dDogbnVtYmVyXG4gIF9yZXNwb25zZUNhbGxiYWNrczogPHVybCtpZDogKG1zZykgPT4gdm9pZD5cblxuICBfcGlwZWxpbmU6IFBpcGVsaW5lXG4gICovXG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpcy5fbXNnSWQgPSAwO1xuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG5cbiAgICBfdGhpcy5fcmVzcG9uc2VUaW1lT3V0ID0gMzAwMDsgLy9kZWZhdWx0IHRvIDNzXG4gICAgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzID0ge307XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUgPSBuZXcgUGlwZWxpbmUoKGVycm9yKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZygnUElQRUxJTkUtRVJST1I6ICcsIEpTT04uc3RyaW5naWZ5KGVycm9yKSk7XG4gICAgfSk7XG5cbiAgICBfdGhpcy5fcmVnaXN0ZXJFeHRlcm5hbExpc3RlbmVyKCk7XG4gIH1cblxuICBnZXQgcGlwZWxpbmUoKSB7IHJldHVybiB0aGlzLl9waXBlbGluZTsgfVxuXG4gIC8qKlxuICAqIFJlZ2lzdGVyIGxpc3RlbmVyIHRvIHJlY2VpdmUgbWVzc2FnZSB3aGVuIFwibXNnLnRvID09PSB1cmxcIi5cbiAgKiBTcGVjaWFsIHVybCBcIipcIiBmb3IgZGVmYXVsdCBsaXN0ZW5lciBpcyBhY2NlcHRlZCB0byBpbnRlcmNlcHQgYWxsIG1lc3NhZ2VzLlxuICAqIEBwYXJhbSB7VVJMfSB1cmwgQWRkcmVzcyB0byBpbnRlcmNlcHQsIHRoYSBpcyBpbiB0aGUgbWVzc2FnZSBcInRvXCJcbiAgKiBAcGFyYW0ge0xpc3RlbmVyfSBsaXN0ZW5lciBsaXN0ZW5lclxuICAqIEByZXR1cm4ge01zZ0xpc3RlbmVyfSBpbnN0YW5jZSBvZiBNc2dMaXN0ZW5lclxuICAqL1xuICBhZGRMaXN0ZW5lcih1cmwsIGxpc3RlbmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBpdGVtID0gbmV3IE1zZ0xpc3RlbmVyKF90aGlzLl9zdWJzY3JpcHRpb25zLCB1cmwsIGxpc3RlbmVyKTtcbiAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdO1xuICAgIGlmICghaXRlbUxpc3QpIHtcbiAgICAgIGl0ZW1MaXN0ID0gW107XG4gICAgICBfdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdID0gaXRlbUxpc3Q7XG4gICAgfVxuXG4gICAgaXRlbUxpc3QucHVzaChpdGVtKTtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSBhZGQgYSByZXNwb25zZSBsaXN0ZW5lci4gT25seSBvbmUgbGlzdGVuZXIgcGVyIG1lc3NhZ2UgSUQgc2hvdWxkIGV4aXN0LlxuICAgKiBBVEVOVElPTiwgdGhlcmUgaXMgbm8gdGltZW91dCBmb3IgdGhpcyBsaXN0ZW5lci5cbiAgICogVGhlIGxpc3RlbmVyIHNob3VsZCBiZSByZW1vdmVkIHdpdGggYSByZW1vdmVSZXNwb25zZUxpc3RlbmVyLCBmYWlsaW5nIHRvIGRvIHRoaXMgd2lsbCByZXN1bHQgaW4gYSB1bnJlbGVhc2VkIG1lbW9yeSBwcm9ibGVtLlxuICAgKiBAcGFyYW0ge1VSTH0gdXJsIE9yaWdpbiBhZGRyZXNzIG9mIHRoZSBtZXNzYWdlIHNlbnQsIFwibXNnLmZyb21cIi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1zZ0lkIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcmVzcG9uc2VMaXN0ZW5lciBDYWxsYmFjayBmdW5jdGlvbiBmb3IgdGhlIHJlc3BvbnNlXG4gICAqL1xuICBhZGRSZXNwb25zZUxpc3RlbmVyKHVybCwgbXNnSWQsIHJlc3BvbnNlTGlzdGVuZXIpIHtcbiAgICB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1t1cmwgKyBtc2dJZF0gPSByZXNwb25zZUxpc3RlbmVyO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgcmVzcG9uc2UgbGlzdGVuZXIuXG4gICAqIEBwYXJhbSB7VVJMfSB1cmwgT3JpZ2luIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2Ugc2VudCwgXCJtc2cuZnJvbVwiLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNnSWQgIE1lc3NhZ2UgSUQgdGhhdCBpcyByZXR1cm5lZCBmcm9tIHRoZSBwb3N0TWVzc2FnZVxuICAgKi9cbiAgcmVtb3ZlUmVzcG9uc2VMaXN0ZW5lcih1cmwsIG1zZ0lkKSB7XG4gICAgZGVsZXRlIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3VybCArIG1zZ0lkXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIGV4aXN0ZW50IGxpc3RlbmVycyBmb3IgdGhlIFVSTFxuICAgKiBAcGFyYW0gIHtVUkx9IHVybCBBZGRyZXNzIHJlZ2lzdGVyZWRcbiAgICovXG4gIHJlbW92ZUFsbExpc3RlbmVyc09mKHVybCkge1xuICAgIGRlbGV0ZSB0aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gIH1cblxuICAvKipcbiAgKiBTZW5kIG1lc3NhZ2VzIHRvIGxvY2FsIGxpc3RlbmVycywgb3IgaWYgbm90IGV4aXN0cyB0byBleHRlcm5hbCBsaXN0ZW5lcnMuXG4gICogSXQncyBoYXMgYW4gb3B0aW9uYWwgbWVjaGFuaXNtIGZvciBhdXRvbWF0aWMgbWFuYWdlbWVudCBvZiByZXNwb25zZSBoYW5kbGVycy5cbiAgKiBUaGUgcmVzcG9uc2UgaGFuZGxlciB3aWxsIGJlIHVucmVnaXN0ZXJlZCBhZnRlciByZWNlaXZpbmcgdGhlIHJlc3BvbnNlLCBvciBhZnRlciByZXNwb25zZSB0aW1lb3V0IChkZWZhdWx0IHRvIDNzKS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlfSBtc2cgTWVzc2FnZSB0byBzZW5kLiBNZXNzYWdlIElEIGlzIGF1dG9tYXRpY2FsbHkgYWRkZWQgdG8gdGhlIG1lc3NhZ2UuXG4gICogQHBhcmFtICB7RnVuY3Rpb259IHJlc3BvbnNlQ2FsbGJhY2sgT3B0aW9uYWwgcGFyYW1ldGVyLCBpZiB0aGUgZGV2ZWxvcGVyIHdoYXQncyBhdXRvbWF0aWMgcmVzcG9uc2UgbWFuYWdlbWVudC5cbiAgKiBAcmV0dXJuIHtudW1iZXJ9IFJldHVybnMgdGhlIG1lc3NhZ2UgSUQsIGluIGNhc2UgaXQgc2hvdWxkIGJlIG5lZWRlZCBmb3IgbWFudWFsIG1hbmFnZW1lbnQgb2YgdGhlIHJlc3BvbnNlIGhhbmRsZXIuXG4gICovXG4gIHBvc3RNZXNzYWdlKGluTXNnLCByZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vVE9ETzogaG93IGRvIHdlIG1hbmFnZSBtZXNzYWdlIElEJ3M/IFNob3VsZCBpdCBiZSBhIGdsb2JhbCBydW50aW1lIGNvdW50ZXIsIG9yIHBlciBVUkwgYWRkcmVzcz9cbiAgICAvL0dsb2JhbCBjb3VudGVyIHdpbGwgbm90IHdvcmssIGJlY2F1c2UgdGhlcmUgd2lsbCBiZSBtdWx0aXBsZSBNaW5pQnVzIGluc3RhbmNlcyFcbiAgICAvL1BlciBVUkwsIGNhbiBiZSBhIGxvdCBvZiBkYXRhIHRvIG1haW50YWluIVxuICAgIC8vTWF5YmUgYSBjb3VudGVyIHBlciBNaW5pQnVzIGluc3RhbmNlLiBUaGlzIGlzIHRoZSBhc3N1bWVkIHNvbHV0aW9uIGZvciBub3cuXG4gICAgaWYgKCFpbk1zZy5pZCB8fCBpbk1zZy5pZCA9PT0gMCkge1xuICAgICAgX3RoaXMuX21zZ0lkKys7XG4gICAgICBpbk1zZy5pZCA9IF90aGlzLl9tc2dJZDtcbiAgICB9XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUucHJvY2Vzcyhpbk1zZywgKG1zZykgPT4ge1xuXG4gICAgICAvL2F1dG9tYXRpYyBtYW5hZ2VtZW50IG9mIHJlc3BvbnNlIGhhbmRsZXJzXG4gICAgICBpZiAocmVzcG9uc2VDYWxsYmFjaykge1xuICAgICAgICBsZXQgcmVzcG9uc2VJZCA9IG1zZy5mcm9tICsgbXNnLmlkO1xuICAgICAgICBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF0gPSByZXNwb25zZUNhbGxiYWNrO1xuXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIGxldCByZXNwb25zZUZ1biA9IF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcbiAgICAgICAgICBkZWxldGUgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuXG4gICAgICAgICAgaWYgKHJlc3BvbnNlRnVuKSB7XG4gICAgICAgICAgICBsZXQgZXJyb3JNc2cgPSB7XG4gICAgICAgICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsXG4gICAgICAgICAgICAgIGJvZHk6IHtjb2RlOiAnZXJyb3InLCBkZXNjOiAnUmVzcG9uc2UgdGltZW91dCEnfVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgcmVzcG9uc2VGdW4oZXJyb3JNc2cpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgX3RoaXMuX3Jlc3BvbnNlVGltZU91dCk7XG4gICAgICB9XG5cbiAgICAgIGlmICghX3RoaXMuX29uUmVzcG9uc2UobXNnKSkge1xuICAgICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1ttc2cudG9dO1xuICAgICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgICAvL2RvIG5vdCBwdWJsaXNoIG9uIGRlZmF1bHQgYWRkcmVzcywgYmVjYXVzZSBvZiBsb29wYmFjayBjeWNsZVxuICAgICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy9pZiB0aGVyZSBpcyBubyBsaXN0ZW5lciwgc2VuZCB0byBleHRlcm5hbCBpbnRlcmZhY2VcbiAgICAgICAgICBfdGhpcy5fb25Qb3N0TWVzc2FnZShtc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5Nc2cuaWQ7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIG1ldGhvZCB0byBiaW5kIGxpc3RlbmVycyAoaW4gYm90aCBkaXJlY3Rpb25zKSBpbnRvIG90aGVyIE1pbmlCdXMgdGFyZ2V0LlxuICAgKiBAcGFyYW0gIHtVUkx9IG91dFVybCBPdXRib3VuZCBVUkwsIHJlZ2lzdGVyIGxpc3RlbmVyIGZvciB1cmwgaW4gZGlyZWN0aW9uIFwidGhpcyAtPiB0YXJnZXRcIlxuICAgKiBAcGFyYW0gIHtVUkx9IGluVXJsIEluYm91bmQgVVJMLCByZWdpc3RlciBsaXN0ZW5lciBmb3IgdXJsIGluIGRpcmVjdGlvbiBcInRhcmdldCAtPiB0aGlzXCJcbiAgICogQHBhcmFtICB7TWluaUJ1c30gdGFyZ2V0IFRoZSBvdGhlciB0YXJnZXQgTWluaUJ1c1xuICAgKiBAcmV0dXJuIHtCb3VuZH0gYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHByb3BlcnRpZXMgW3RoaXNMaXN0ZW5lciwgdGFyZ2V0TGlzdGVuZXJdIGFuZCB0aGUgdW5iaW5kIG1ldGhvZC5cbiAgICovXG4gIGJpbmQob3V0VXJsLCBpblVybCwgdGFyZ2V0KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCB0aGlzTGlzdG4gPSBfdGhpcy5hZGRMaXN0ZW5lcihvdXRVcmwsIChtc2cpID0+IHtcbiAgICAgIHRhcmdldC5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH0pO1xuXG4gICAgbGV0IHRhcmdldExpc3RuID0gdGFyZ2V0LmFkZExpc3RlbmVyKGluVXJsLCAobXNnKSA9PiB7XG4gICAgICBfdGhpcy5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRoaXNMaXN0ZW5lcjogdGhpc0xpc3RuLFxuICAgICAgdGFyZ2V0TGlzdGVuZXI6IHRhcmdldExpc3RuLFxuICAgICAgdW5iaW5kOiAoKSA9PiB7XG4gICAgICAgIHRoaXMudGhpc0xpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnRhcmdldExpc3RlbmVyLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvL3B1Ymxpc2ggb24gYSBzdWJzY3JpcHRpb24gbGlzdC5cbiAgX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKSB7XG4gICAgaXRlbUxpc3QuZm9yRWFjaCgoc3ViKSA9PiB7XG4gICAgICBzdWIuX2NhbGxiYWNrKG1zZyk7XG4gICAgfSk7XG4gIH1cblxuICBfb25SZXNwb25zZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKG1zZy50eXBlID09PSAncmVzcG9uc2UnKSB7XG4gICAgICBsZXQgcmVzcG9uc2VJZCA9IG1zZy50byArIG1zZy5pZDtcbiAgICAgIGxldCByZXNwb25zZUZ1biA9IF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcbiAgICAgIGRlbGV0ZSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG5cbiAgICAgIGlmIChyZXNwb25zZUZ1bikge1xuICAgICAgICByZXNwb25zZUZ1bihtc2cpO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvL3JlY2VpdmUgbWVzc2FnZXMgZnJvbSBleHRlcm5hbCBpbnRlcmZhY2VcbiAgX29uTWVzc2FnZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5fb25SZXNwb25zZShtc2cpKSB7XG4gICAgICBsZXQgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1ttc2cudG9dO1xuICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvL2lzIHRoZXJlIGFueSBcIipcIiAoZGVmYXVsdCkgbGlzdGVuZXJzP1xuICAgICAgICBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zWycqJ107XG4gICAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAgIF90aGlzLl9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTm90IHB1YmxpYyBhdmFpbGFibGUsIHVzZWQgYnkgdGhlIGNsYXNzIGV4dGVuc2lvbiBpbXBsZW1lbnRhdGlvbiwgdG8gcHJvY2VzcyBtZXNzYWdlcyBmcm9tIHRoZSBwdWJsaWMgXCJwb3N0TWVzc2FnZVwiIHdpdGhvdXQgYSByZWdpc3RlcmVkIGxpc3RlbmVyLlxuICAgKiBVc2VkIHRvIHNlbmQgdGhlIG1lc3NhZ2UgdG8gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtc2cgTWVzc2FnZVxuICAgKi9cbiAgX29uUG9zdE1lc3NhZ2UobXNnKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCBzZW5kIG1lc3NhZ2UgdG8gZXh0ZXJuYWwgc3lzdGVtKi8gfVxuXG4gIC8qKlxuICAgKiBOb3QgcHVibGljIGF2YWlsYWJsZSwgdXNlZCBieSB0aGUgY2xhc3MgZXh0ZW5zaW9uIGltcGxlbWVudGF0aW9uLCB0byBwcm9jZXNzIGFsbCBtZXNzYWdlcyB0aGF0IGVudGVyIHRoZSBNaW5pQnVzIGZyb20gYW4gZXh0ZXJuYWwgaW50ZXJmYWNlLCBsaWtlIGEgV2ViV29ya2VyLCBJRnJhbWUsIGV0Yy5cbiAgICogVGhpcyBtZXRob2QgaXMgY2FsbGVkIG9uZSB0aW1lIGluIHRoZSBjb25zdHJ1Y3RvciB0byByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lcnMuXG4gICAqIFRoZSBpbXBsZW1lbnRhdGlvbiB3aWxsIHByb2JhYmx5IGNhbGwgdGhlIFwiX29uTWVzc2FnZVwiIG1ldGhvZCB0byBwdWJsaXNoIGluIHRoZSBsb2NhbCBsaXN0ZW5lcnMuXG4gICAqIERPIE5PVCBjYWxsIFwicG9zdE1lc3NhZ2VcIiwgdGhlcmUgaXMgYSBkYW5nZXIgdGhhdCB0aGUgbWVzc2FnZSBlbnRlcnMgaW4gYSBjeWNsZSFcbiAgICovXG4gIF9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKSB7IC8qaW1wbGVtZW50YXRpb24gd2lsbCByZWdpc3RlciBleHRlcm5hbCBsaXN0ZW5lciBhbmQgY2FsbCBcInRoaXMuX29uTWVzc2FnZShtc2cpXCIgKi8gfVxuXG59XG5cbmNsYXNzIE1zZ0xpc3RlbmVyIHtcbiAgLyogcHJpdmF0ZVxuICBfc3Vic2NyaXB0aW9uczogPHN0cmluZzogTXNnTGlzdGVuZXJbXT47XG4gIF91cmw6IHN0cmluZztcbiAgX2NhbGxiYWNrOiAobXNnKSA9PiB2b2lkO1xuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbnMsIHVybCwgY2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSBzdWJzY3JpcHRpb25zO1xuICAgIF90aGlzLl91cmwgPSB1cmw7XG4gICAgX3RoaXMuX2NhbGxiYWNrID0gY2FsbGJhY2s7XG4gIH1cblxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsOyB9XG5cbiAgcmVtb3ZlKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgc3VicyA9IF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgIGlmIChzdWJzKSB7XG4gICAgICBsZXQgaW5kZXggPSBzdWJzLmluZGV4T2YoX3RoaXMpO1xuICAgICAgc3Vicy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICAvL2lmIHRoZXJlIGFyZSBubyBsaXN0ZW5lcnMsIHJlbW92ZSB0aGUgc3Vic2NyaXB0aW9uIGVudGlyZWx5LlxuICAgICAgaWYgKHN1YnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGRlbGV0ZSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tfdGhpcy5fdXJsXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWluaUJ1cztcbiIsIi8qKlxuKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4qIFBpcGVsaW5lXG4qIFNlcXVlbmNpYWwgcHJvY2Vzc29yIG9mIG1ldGhvZHMuIFNpbWlsYXIgdG8gaG93IFNlcXVlbnRpYWwgUHJvbWlzZSdzIHdvcmssIGJ1dCBiZXR0ZXIgZml0IGZvciBtZXNzYWdlIHByb2Nlc3NpbmcuXG4qL1xuY2xhc3MgUGlwZWxpbmUge1xuICAvKiBwdWJsaWNcbiAgICBoYW5kbGVyczogKChQaXBlQ29udGV4dCkgPT4gdm9pZClbXVxuICAgIG9uRmFpbDogKGVycm9yKSA9PiB2b2lkXG4gICovXG5cbiAgY29uc3RydWN0b3IoX29uRmFpbCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5oYW5kbGVycyA9IFtdO1xuICAgIF90aGlzLm9uRmFpbCA9IF9vbkZhaWw7XG4gIH1cblxuICBwcm9jZXNzKG1zZywgb25EZWxpdmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmIChfdGhpcy5oYW5kbGVycy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgaXRlciA9IG5ldyBJdGVyYXRvcihfdGhpcy5oYW5kbGVycyk7XG4gICAgICBpdGVyLm5leHQobmV3IFBpcGVDb250ZXh0KF90aGlzLCBpdGVyLCBtc2csIG9uRGVsaXZlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICBvbkRlbGl2ZXIobXNnKTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUGlwZUNvbnRleHQge1xuICAvKiBwcml2YXRlXG4gICAgX2luU3RvcDogYm9vbGVhblxuXG4gICAgX3BpcGVsaW5lOiBQaXBlbGluZVxuICAgIF9pdGVyOiBJdGVyYXRvclxuICAgIF9tc2c6IE1lc3NhZ2VcbiAgKi9cblxuICBjb25zdHJ1Y3RvcihwaXBlbGluZSwgaXRlciwgbXNnLCBvbkRlbGl2ZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuX2luU3RvcCA9IGZhbHNlO1xuXG4gICAgX3RoaXMuX3BpcGVsaW5lID0gcGlwZWxpbmU7XG4gICAgX3RoaXMuX2l0ZXIgPSBpdGVyO1xuICAgIF90aGlzLl9tc2cgPSBtc2c7XG4gICAgX3RoaXMuX29uRGVsaXZlciA9IG9uRGVsaXZlcjtcbiAgfVxuXG4gIGdldCBwaXBlbGluZSgpIHsgcmV0dXJuIHRoaXMuX3BpcGVsaW5lOyB9XG5cbiAgZ2V0IG1zZygpIHsgcmV0dXJuIHRoaXMuX21zZzsgfVxuICBzZXQgbXNnKGluTXNnKSB7IHRoaXMuX21zZyA9IGluTXNnOyB9XG5cbiAgbmV4dCgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBpZiAoX3RoaXMuX2l0ZXIuaGFzTmV4dCkge1xuICAgICAgICBfdGhpcy5faXRlci5uZXh0KF90aGlzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLl9vbkRlbGl2ZXIoX3RoaXMuX21zZyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVsaXZlcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGlmICghX3RoaXMuX2luU3RvcCkge1xuICAgICAgX3RoaXMuX2luU3RvcCA9IHRydWU7XG4gICAgICBfdGhpcy5fb25EZWxpdmVyKF90aGlzLl9tc2cpO1xuICAgIH1cbiAgfVxuXG4gIGZhaWwoZXJyb3IpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBfdGhpcy5faW5TdG9wID0gdHJ1ZTtcbiAgICAgIGlmIChfdGhpcy5fcGlwZWxpbmUub25GYWlsKSB7XG4gICAgICAgIF90aGlzLl9waXBlbGluZS5vbkZhaWwoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBJdGVyYXRvciB7XG4gIC8qIHByaXZhdGVcbiAgICBfaW5kZXg6IG51bWJlclxuICAgIF9hcnJheTogW11cbiAgKi9cblxuICBjb25zdHJ1Y3RvcihhcnJheSkge1xuICAgIHRoaXMuX2luZGV4ID0gLTE7XG4gICAgdGhpcy5fYXJyYXkgPSBhcnJheTtcbiAgfVxuXG4gIGdldCBoYXNOZXh0KCkge1xuICAgIHJldHVybiB0aGlzLl9pbmRleCA8IHRoaXMuX2FycmF5Lmxlbmd0aCAtIDE7XG4gIH1cblxuICBnZXQgbmV4dCgpIHtcbiAgICB0aGlzLl9pbmRleCsrO1xuICAgIHJldHVybiB0aGlzLl9hcnJheVt0aGlzLl9pbmRleF07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGlwZWxpbmU7XG4iLCJpbXBvcnQgTWluaUJ1cyBmcm9tICcuL2J1cy9NaW5pQnVzJztcbmV4cG9ydCB7TWluaUJ1c307XG4iXX0=
