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

var _busMiniBus = require('./bus/MiniBus');

var _busMiniBus2 = _interopRequireDefault(_busMiniBus);

exports['default'] = _busMiniBus2['default'];
module.exports = exports['default'];

},{"./bus/MiniBus":1}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NaW5pQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvUGlwZWxpbmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL21pbmlidXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7d0JDQXFCLFlBQVk7Ozs7Ozs7Ozs7O0lBUTNCLE9BQU87Ozs7Ozs7OztBQVdBLFdBWFAsT0FBTyxHQVdHOzBCQVhWLE9BQU87O0FBWVQsUUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLFNBQUssQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDOztBQUUxQixTQUFLLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQzlCLFNBQUssQ0FBQyxrQkFBa0IsR0FBRyxFQUFFLENBQUM7O0FBRTlCLFNBQUssQ0FBQyxTQUFTLEdBQUcsMEJBQWEsVUFBQyxLQUFLLEVBQUs7QUFDeEMsYUFBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDOztBQUVILFNBQUssQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO0dBQ25DOztlQXhCRyxPQUFPOzs7Ozs7Ozs7O1dBbUNBLHFCQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUU7QUFDekIsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVqQixVQUFJLElBQUksR0FBRyxJQUFJLFdBQVcsQ0FBQyxLQUFLLENB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QUFJLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFO0FBQzFCLGVBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO09BQ0Y7S0FDRjs7O1NBbENXLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7S0FBRTs7O1NBRWxDLGVBQUc7QUFBRSxhQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7S0FBRTtTQUN4QixhQUFDLEtBQUssRUFBRTtBQUFFLFVBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0tBQUU7OztTQXZCakMsV0FBVzs7O0lBeURYLFFBQVE7Ozs7OztBQU1ELFdBTlAsUUFBUSxDQU1BLEtBQUssRUFBRTswQkFOZixRQUFROztBQU9WLFFBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDakIsUUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7R0FDckI7O2VBVEcsUUFBUTs7U0FXRCxlQUFHO0FBQ1osYUFBTyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUM3Qzs7O1NBRU8sZUFBRztBQUNULFVBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNkLGFBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakM7OztTQWxCRyxRQUFROzs7cUJBcUJDLFFBQVE7Ozs7Ozs7Ozs7OzswQkM1R0gsZUFBZSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgUGlwZWxpbmUgZnJvbSAnLi9QaXBlbGluZSc7XG5cbi8qKlxuKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4qIE1pbmltYWwgaW50ZXJmYWNlIGFuZCBpbXBsZW1lbnRhdGlvbiB0byBzZW5kIGFuZCByZWNlaXZlIG1lc3NhZ2VzLiBJdCBjYW4gYmUgcmV1c2VkIGluIG1hbnkgdHlwZSBvZiBjb21wb25lbnRzLlxuKiBDb21wb25lbnRzIHRoYXQgbmVlZCBhIG1lc3NhZ2Ugc3lzdGVtIHNob3VsZCByZWNlaXZlIHRoaXMgY2xhc3MgYXMgYSBkZXBlbmRlbmN5IG9yIGV4dGVuZCBpdC5cbiogRXh0ZW5zaW9ucyBzaG91bGQgaW1wbGVtZW50IHRoZSBmb2xsb3dpbmcgcHJpdmF0ZSBtZXRob2RzOiBfb25Qb3N0TWVzc2FnZSBhbmQgX3JlZ2lzdGVyRXh0ZXJuYWxMaXN0ZW5lclxuKi9cbmNsYXNzIE1pbmlCdXMge1xuICAvKiBwcml2YXRlXG4gIF9tc2dJZDogbnVtYmVyO1xuICBfc3Vic2NyaXB0aW9uczogPHVybDogTXNnTGlzdGVuZXJbXT5cblxuICBfcmVzcG9uc2VUaW1lT3V0OiBudW1iZXJcbiAgX3Jlc3BvbnNlQ2FsbGJhY2tzOiA8dXJsK2lkOiAobXNnKSA9PiB2b2lkPlxuXG4gIF9waXBlbGluZTogUGlwZWxpbmVcbiAgKi9cblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLl9tc2dJZCA9IDA7XG4gICAgX3RoaXMuX3N1YnNjcmlwdGlvbnMgPSB7fTtcblxuICAgIF90aGlzLl9yZXNwb25zZVRpbWVPdXQgPSA1MDAwOyAvL2RlZmF1bHQgdG8gM3NcbiAgICBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3MgPSB7fTtcblxuICAgIF90aGlzLl9waXBlbGluZSA9IG5ldyBQaXBlbGluZSgoZXJyb3IpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKCdQSVBFTElORS1FUlJPUjogJywgSlNPTi5zdHJpbmdpZnkoZXJyb3IpKTtcbiAgICB9KTtcblxuICAgIF90aGlzLl9yZWdpc3RlckV4dGVybmFsTGlzdGVuZXIoKTtcbiAgfVxuXG4gIGdldCBwaXBlbGluZSgpIHsgcmV0dXJuIHRoaXMuX3BpcGVsaW5lOyB9XG5cbiAgLyoqXG4gICogUmVnaXN0ZXIgbGlzdGVuZXIgdG8gcmVjZWl2ZSBtZXNzYWdlIHdoZW4gXCJtc2cudG8gPT09IHVybFwiLlxuICAqIFNwZWNpYWwgdXJsIFwiKlwiIGZvciBkZWZhdWx0IGxpc3RlbmVyIGlzIGFjY2VwdGVkIHRvIGludGVyY2VwdCBhbGwgbWVzc2FnZXMuXG4gICogQHBhcmFtIHtVUkx9IHVybCBBZGRyZXNzIHRvIGludGVyY2VwdCwgdGhhIGlzIGluIHRoZSBtZXNzYWdlIFwidG9cIlxuICAqIEBwYXJhbSB7TGlzdGVuZXJ9IGxpc3RlbmVyIGxpc3RlbmVyXG4gICogQHJldHVybiB7TXNnTGlzdGVuZXJ9IGluc3RhbmNlIG9mIE1zZ0xpc3RlbmVyXG4gICovXG4gIGFkZExpc3RlbmVyKHVybCwgbGlzdGVuZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IGl0ZW0gPSBuZXcgTXNnTGlzdGVuZXIoX3RoaXMuX3N1YnNjcmlwdGlvbnMsIHVybCwgbGlzdGVuZXIpO1xuICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF07XG4gICAgaWYgKCFpdGVtTGlzdCkge1xuICAgICAgaXRlbUxpc3QgPSBbXTtcbiAgICAgIF90aGlzLl9zdWJzY3JpcHRpb25zW3VybF0gPSBpdGVtTGlzdDtcbiAgICB9XG5cbiAgICBpdGVtTGlzdC5wdXNoKGl0ZW0pO1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IGFkZCBhIHJlc3BvbnNlIGxpc3RlbmVyLiBPbmx5IG9uZSBsaXN0ZW5lciBwZXIgbWVzc2FnZSBJRCBzaG91bGQgZXhpc3QuXG4gICAqIEFURU5USU9OLCB0aGVyZSBpcyBubyB0aW1lb3V0IGZvciB0aGlzIGxpc3RlbmVyLlxuICAgKiBUaGUgbGlzdGVuZXIgc2hvdWxkIGJlIHJlbW92ZWQgd2l0aCBhIHJlbW92ZVJlc3BvbnNlTGlzdGVuZXIsIGZhaWxpbmcgdG8gZG8gdGhpcyB3aWxsIHJlc3VsdCBpbiBhIHVucmVsZWFzZWQgbWVtb3J5IHByb2JsZW0uXG4gICAqIEBwYXJhbSB7VVJMfSB1cmwgT3JpZ2luIGFkZHJlc3Mgb2YgdGhlIG1lc3NhZ2Ugc2VudCwgXCJtc2cuZnJvbVwiLlxuICAgKiBAcGFyYW0ge251bWJlcn0gbXNnSWQgTWVzc2FnZSBJRCB0aGF0IGlzIHJldHVybmVkIGZyb20gdGhlIHBvc3RNZXNzYWdlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSByZXNwb25zZUxpc3RlbmVyIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB0aGUgcmVzcG9uc2VcbiAgICovXG4gIGFkZFJlc3BvbnNlTGlzdGVuZXIodXJsLCBtc2dJZCwgcmVzcG9uc2VMaXN0ZW5lcikge1xuICAgIHRoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3VybCArIG1zZ0lkXSA9IHJlc3BvbnNlTGlzdGVuZXI7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSByZXNwb25zZSBsaXN0ZW5lci5cbiAgICogQHBhcmFtIHtVUkx9IHVybCBPcmlnaW4gYWRkcmVzcyBvZiB0aGUgbWVzc2FnZSBzZW50LCBcIm1zZy5mcm9tXCIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtc2dJZCAgTWVzc2FnZSBJRCB0aGF0IGlzIHJldHVybmVkIGZyb20gdGhlIHBvc3RNZXNzYWdlXG4gICAqL1xuICByZW1vdmVSZXNwb25zZUxpc3RlbmVyKHVybCwgbXNnSWQpIHtcbiAgICBkZWxldGUgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbdXJsICsgbXNnSWRdO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZXhpc3RlbnQgbGlzdGVuZXJzIGZvciB0aGUgVVJMXG4gICAqIEBwYXJhbSAge1VSTH0gdXJsIEFkZHJlc3MgcmVnaXN0ZXJlZFxuICAgKi9cbiAgcmVtb3ZlQWxsTGlzdGVuZXJzT2YodXJsKSB7XG4gICAgZGVsZXRlIHRoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXTtcbiAgfVxuXG4gIC8qKlxuICAqIFNlbmQgbWVzc2FnZXMgdG8gbG9jYWwgbGlzdGVuZXJzLCBvciBpZiBub3QgZXhpc3RzIHRvIGV4dGVybmFsIGxpc3RlbmVycy5cbiAgKiBJdCdzIGhhcyBhbiBvcHRpb25hbCBtZWNoYW5pc20gZm9yIGF1dG9tYXRpYyBtYW5hZ2VtZW50IG9mIHJlc3BvbnNlIGhhbmRsZXJzLlxuICAqIFRoZSByZXNwb25zZSBoYW5kbGVyIHdpbGwgYmUgdW5yZWdpc3RlcmVkIGFmdGVyIHJlY2VpdmluZyB0aGUgcmVzcG9uc2UsIG9yIGFmdGVyIHJlc3BvbnNlIHRpbWVvdXQgKGRlZmF1bHQgdG8gM3MpLlxuICAqIEBwYXJhbSAge01lc3NhZ2V9IG1zZyBNZXNzYWdlIHRvIHNlbmQuIE1lc3NhZ2UgSUQgaXMgYXV0b21hdGljYWxseSBhZGRlZCB0byB0aGUgbWVzc2FnZS5cbiAgKiBAcGFyYW0gIHtGdW5jdGlvbn0gcmVzcG9uc2VDYWxsYmFjayBPcHRpb25hbCBwYXJhbWV0ZXIsIGlmIHRoZSBkZXZlbG9wZXIgd2hhdCdzIGF1dG9tYXRpYyByZXNwb25zZSBtYW5hZ2VtZW50LlxuICAqIEByZXR1cm4ge251bWJlcn0gUmV0dXJucyB0aGUgbWVzc2FnZSBJRCwgaW4gY2FzZSBpdCBzaG91bGQgYmUgbmVlZGVkIGZvciBtYW51YWwgbWFuYWdlbWVudCBvZiB0aGUgcmVzcG9uc2UgaGFuZGxlci5cbiAgKi9cbiAgcG9zdE1lc3NhZ2UoaW5Nc2csIHJlc3BvbnNlQ2FsbGJhY2spIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9UT0RPOiBob3cgZG8gd2UgbWFuYWdlIG1lc3NhZ2UgSUQncz8gU2hvdWxkIGl0IGJlIGEgZ2xvYmFsIHJ1bnRpbWUgY291bnRlciwgb3IgcGVyIFVSTCBhZGRyZXNzP1xuICAgIC8vR2xvYmFsIGNvdW50ZXIgd2lsbCBub3Qgd29yaywgYmVjYXVzZSB0aGVyZSB3aWxsIGJlIG11bHRpcGxlIE1pbmlCdXMgaW5zdGFuY2VzIVxuICAgIC8vUGVyIFVSTCwgY2FuIGJlIGEgbG90IG9mIGRhdGEgdG8gbWFpbnRhaW4hXG4gICAgLy9NYXliZSBhIGNvdW50ZXIgcGVyIE1pbmlCdXMgaW5zdGFuY2UuIFRoaXMgaXMgdGhlIGFzc3VtZWQgc29sdXRpb24gZm9yIG5vdy5cbiAgICBpZiAoIWluTXNnLmlkIHx8IGluTXNnLmlkID09PSAwKSB7XG4gICAgICBfdGhpcy5fbXNnSWQrKztcbiAgICAgIGluTXNnLmlkID0gX3RoaXMuX21zZ0lkO1xuICAgIH1cblxuICAgIF90aGlzLl9waXBlbGluZS5wcm9jZXNzKGluTXNnLCAobXNnKSA9PiB7XG5cbiAgICAgIC8vYXV0b21hdGljIG1hbmFnZW1lbnQgb2YgcmVzcG9uc2UgaGFuZGxlcnNcbiAgICAgIGlmIChyZXNwb25zZUNhbGxiYWNrKSB7XG4gICAgICAgIGxldCByZXNwb25zZUlkID0gbXNnLmZyb20gKyBtc2cuaWQ7XG4gICAgICAgIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXSA9IHJlc3BvbnNlQ2FsbGJhY2s7XG5cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgbGV0IHJlc3BvbnNlRnVuID0gX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuICAgICAgICAgIGRlbGV0ZSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG5cbiAgICAgICAgICBpZiAocmVzcG9uc2VGdW4pIHtcbiAgICAgICAgICAgIGxldCBlcnJvck1zZyA9IHtcbiAgICAgICAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJyxcbiAgICAgICAgICAgICAgYm9keTogeyBjb2RlOiA0MDgsIGRlc2M6ICdSZXNwb25zZSB0aW1lb3V0IScsIHZhbHVlOiBpbk1zZyB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXNwb25zZUZ1bihlcnJvck1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCBfdGhpcy5fcmVzcG9uc2VUaW1lT3V0KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFfdGhpcy5fb25SZXNwb25zZShtc2cpKSB7XG4gICAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW21zZy50b107XG4gICAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICAgIC8vZG8gbm90IHB1Ymxpc2ggb24gZGVmYXVsdCBhZGRyZXNzLCBiZWNhdXNlIG9mIGxvb3BiYWNrIGN5Y2xlXG4gICAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvL2lmIHRoZXJlIGlzIG5vIGxpc3RlbmVyLCBzZW5kIHRvIGV4dGVybmFsIGludGVyZmFjZVxuICAgICAgICAgIF90aGlzLl9vblBvc3RNZXNzYWdlKG1zZyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBpbk1zZy5pZDtcbiAgfVxuXG4gIC8qKlxuICAgKiBIZWxwZXIgbWV0aG9kIHRvIGJpbmQgbGlzdGVuZXJzIChpbiBib3RoIGRpcmVjdGlvbnMpIGludG8gb3RoZXIgTWluaUJ1cyB0YXJnZXQuXG4gICAqIEBwYXJhbSAge1VSTH0gb3V0VXJsIE91dGJvdW5kIFVSTCwgcmVnaXN0ZXIgbGlzdGVuZXIgZm9yIHVybCBpbiBkaXJlY3Rpb24gXCJ0aGlzIC0+IHRhcmdldFwiXG4gICAqIEBwYXJhbSAge1VSTH0gaW5VcmwgSW5ib3VuZCBVUkwsIHJlZ2lzdGVyIGxpc3RlbmVyIGZvciB1cmwgaW4gZGlyZWN0aW9uIFwidGFyZ2V0IC0+IHRoaXNcIlxuICAgKiBAcGFyYW0gIHtNaW5pQnVzfSB0YXJnZXQgVGhlIG90aGVyIHRhcmdldCBNaW5pQnVzXG4gICAqIEByZXR1cm4ge0JvdW5kfSBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgcHJvcGVydGllcyBbdGhpc0xpc3RlbmVyLCB0YXJnZXRMaXN0ZW5lcl0gYW5kIHRoZSB1bmJpbmQgbWV0aG9kLlxuICAgKi9cbiAgYmluZChvdXRVcmwsIGluVXJsLCB0YXJnZXQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHRoaXNMaXN0biA9IF90aGlzLmFkZExpc3RlbmVyKG91dFVybCwgKG1zZykgPT4ge1xuICAgICAgdGFyZ2V0LnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICBsZXQgdGFyZ2V0TGlzdG4gPSB0YXJnZXQuYWRkTGlzdGVuZXIoaW5VcmwsIChtc2cpID0+IHtcbiAgICAgIF90aGlzLnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGhpc0xpc3RlbmVyOiB0aGlzTGlzdG4sXG4gICAgICB0YXJnZXRMaXN0ZW5lcjogdGFyZ2V0TGlzdG4sXG4gICAgICB1bmJpbmQ6ICgpID0+IHtcbiAgICAgICAgdGhpcy50aGlzTGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMudGFyZ2V0TGlzdGVuZXIucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIC8vcHVibGlzaCBvbiBhIHN1YnNjcmlwdGlvbiBsaXN0LlxuICBfcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpIHtcbiAgICBpdGVtTGlzdC5mb3JFYWNoKChzdWIpID0+IHtcbiAgICAgIHN1Yi5fY2FsbGJhY2sobXNnKTtcbiAgICB9KTtcbiAgfVxuXG4gIF9vblJlc3BvbnNlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAobXNnLnR5cGUgPT09ICdyZXNwb25zZScpIHtcbiAgICAgIGxldCByZXNwb25zZUlkID0gbXNnLnRvICsgbXNnLmlkO1xuICAgICAgbGV0IHJlc3BvbnNlRnVuID0gX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuXG4gICAgICAvL2lmIGl0J3MgYSBwcm92aXNpb25hbCByZXNwb25zZSwgZG9uJ3QgZGVsZXRlIHJlc3BvbnNlIGxpc3RlbmVyXG4gICAgICBpZiAobXNnLmJvZHkuY29kZSA+PSAyMDApIHtcbiAgICAgICAgZGVsZXRlIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJlc3BvbnNlRnVuKSB7XG4gICAgICAgIHJlc3BvbnNlRnVuKG1zZyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIC8vcmVjZWl2ZSBtZXNzYWdlcyBmcm9tIGV4dGVybmFsIGludGVyZmFjZVxuICBfb25NZXNzYWdlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9vblJlc3BvbnNlKG1zZykpIHtcbiAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW21zZy50b107XG4gICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vaXMgdGhlcmUgYW55IFwiKlwiIChkZWZhdWx0KSBsaXN0ZW5lcnM/XG4gICAgICAgIGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbJyonXTtcbiAgICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBOb3QgcHVibGljIGF2YWlsYWJsZSwgdXNlZCBieSB0aGUgY2xhc3MgZXh0ZW5zaW9uIGltcGxlbWVudGF0aW9uLCB0byBwcm9jZXNzIG1lc3NhZ2VzIGZyb20gdGhlIHB1YmxpYyBcInBvc3RNZXNzYWdlXCIgd2l0aG91dCBhIHJlZ2lzdGVyZWQgbGlzdGVuZXIuXG4gICAqIFVzZWQgdG8gc2VuZCB0aGUgbWVzc2FnZSB0byBhbiBleHRlcm5hbCBpbnRlcmZhY2UsIGxpa2UgYSBXZWJXb3JrZXIsIElGcmFtZSwgZXRjLlxuICAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9IG1zZyBNZXNzYWdlXG4gICAqL1xuICBfb25Qb3N0TWVzc2FnZShtc2cpIHsgLyppbXBsZW1lbnRhdGlvbiB3aWxsIHNlbmQgbWVzc2FnZSB0byBleHRlcm5hbCBzeXN0ZW0qLyB9XG5cbiAgLyoqXG4gICAqIE5vdCBwdWJsaWMgYXZhaWxhYmxlLCB1c2VkIGJ5IHRoZSBjbGFzcyBleHRlbnNpb24gaW1wbGVtZW50YXRpb24sIHRvIHByb2Nlc3MgYWxsIG1lc3NhZ2VzIHRoYXQgZW50ZXIgdGhlIE1pbmlCdXMgZnJvbSBhbiBleHRlcm5hbCBpbnRlcmZhY2UsIGxpa2UgYSBXZWJXb3JrZXIsIElGcmFtZSwgZXRjLlxuICAgKiBUaGlzIG1ldGhvZCBpcyBjYWxsZWQgb25lIHRpbWUgaW4gdGhlIGNvbnN0cnVjdG9yIHRvIHJlZ2lzdGVyIGV4dGVybmFsIGxpc3RlbmVycy5cbiAgICogVGhlIGltcGxlbWVudGF0aW9uIHdpbGwgcHJvYmFibHkgY2FsbCB0aGUgXCJfb25NZXNzYWdlXCIgbWV0aG9kIHRvIHB1Ymxpc2ggaW4gdGhlIGxvY2FsIGxpc3RlbmVycy5cbiAgICogRE8gTk9UIGNhbGwgXCJwb3N0TWVzc2FnZVwiLCB0aGVyZSBpcyBhIGRhbmdlciB0aGF0IHRoZSBtZXNzYWdlIGVudGVycyBpbiBhIGN5Y2xlIVxuICAgKi9cbiAgX3JlZ2lzdGVyRXh0ZXJuYWxMaXN0ZW5lcigpIHsgLyppbXBsZW1lbnRhdGlvbiB3aWxsIHJlZ2lzdGVyIGV4dGVybmFsIGxpc3RlbmVyIGFuZCBjYWxsIFwidGhpcy5fb25NZXNzYWdlKG1zZylcIiAqLyB9XG5cbn1cblxuY2xhc3MgTXNnTGlzdGVuZXIge1xuICAvKiBwcml2YXRlXG4gIF9zdWJzY3JpcHRpb25zOiA8c3RyaW5nOiBNc2dMaXN0ZW5lcltdPjtcbiAgX3VybDogc3RyaW5nO1xuICBfY2FsbGJhY2s6IChtc2cpID0+IHZvaWQ7XG4gICovXG5cbiAgY29uc3RydWN0b3Ioc3Vic2NyaXB0aW9ucywgdXJsLCBjYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHN1YnNjcmlwdGlvbnM7XG4gICAgX3RoaXMuX3VybCA9IHVybDtcbiAgICBfdGhpcy5fY2FsbGJhY2sgPSBjYWxsYmFjaztcbiAgfVxuXG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmw7IH1cblxuICByZW1vdmUoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBzdWJzID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbX3RoaXMuX3VybF07XG4gICAgaWYgKHN1YnMpIHtcbiAgICAgIGxldCBpbmRleCA9IHN1YnMuaW5kZXhPZihfdGhpcyk7XG4gICAgICBzdWJzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgIC8vaWYgdGhlcmUgYXJlIG5vIGxpc3RlbmVycywgcmVtb3ZlIHRoZSBzdWJzY3JpcHRpb24gZW50aXJlbHkuXG4gICAgICBpZiAoc3Vicy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgZGVsZXRlIF90aGlzLl9zdWJzY3JpcHRpb25zW190aGlzLl91cmxdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBNaW5pQnVzO1xuIiwiLyoqXG4qIEBhdXRob3IgbWljYWVscGVkcm9zYUBnbWFpbC5jb21cbiogUGlwZWxpbmVcbiogU2VxdWVuY2lhbCBwcm9jZXNzb3Igb2YgbWV0aG9kcy4gU2ltaWxhciB0byBob3cgU2VxdWVudGlhbCBQcm9taXNlJ3Mgd29yaywgYnV0IGJldHRlciBmaXQgZm9yIG1lc3NhZ2UgcHJvY2Vzc2luZy5cbiovXG5jbGFzcyBQaXBlbGluZSB7XG4gIC8qIHB1YmxpY1xuICAgIGhhbmRsZXJzOiAoKFBpcGVDb250ZXh0KSA9PiB2b2lkKVtdXG4gICAgb25GYWlsOiAoZXJyb3IpID0+IHZvaWRcbiAgKi9cblxuICBjb25zdHJ1Y3Rvcihfb25GYWlsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLmhhbmRsZXJzID0gW107XG4gICAgX3RoaXMub25GYWlsID0gX29uRmFpbDtcbiAgfVxuXG4gIHByb2Nlc3MobXNnLCBvbkRlbGl2ZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKF90aGlzLmhhbmRsZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBpdGVyID0gbmV3IEl0ZXJhdG9yKF90aGlzLmhhbmRsZXJzKTtcbiAgICAgIGl0ZXIubmV4dChuZXcgUGlwZUNvbnRleHQoX3RoaXMsIGl0ZXIsIG1zZywgb25EZWxpdmVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9uRGVsaXZlcihtc2cpO1xuICAgIH1cbiAgfVxufVxuXG5jbGFzcyBQaXBlQ29udGV4dCB7XG4gIC8qIHByaXZhdGVcbiAgICBfaW5TdG9wOiBib29sZWFuXG5cbiAgICBfcGlwZWxpbmU6IFBpcGVsaW5lXG4gICAgX2l0ZXI6IEl0ZXJhdG9yXG4gICAgX21zZzogTWVzc2FnZVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKHBpcGVsaW5lLCBpdGVyLCBtc2csIG9uRGVsaXZlcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5faW5TdG9wID0gZmFsc2U7XG5cbiAgICBfdGhpcy5fcGlwZWxpbmUgPSBwaXBlbGluZTtcbiAgICBfdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgX3RoaXMuX21zZyA9IG1zZztcbiAgICBfdGhpcy5fb25EZWxpdmVyID0gb25EZWxpdmVyO1xuICB9XG5cbiAgZ2V0IHBpcGVsaW5lKCkgeyByZXR1cm4gdGhpcy5fcGlwZWxpbmU7IH1cblxuICBnZXQgbXNnKCkgeyByZXR1cm4gdGhpcy5fbXNnOyB9XG4gIHNldCBtc2coaW5Nc2cpIHsgdGhpcy5fbXNnID0gaW5Nc2c7IH1cblxuICBuZXh0KCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9pblN0b3ApIHtcbiAgICAgIGlmIChfdGhpcy5faXRlci5oYXNOZXh0KSB7XG4gICAgICAgIF90aGlzLl9pdGVyLm5leHQoX3RoaXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuX29uRGVsaXZlcihfdGhpcy5fbXNnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkZWxpdmVyKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgaWYgKCFfdGhpcy5faW5TdG9wKSB7XG4gICAgICBfdGhpcy5faW5TdG9wID0gdHJ1ZTtcbiAgICAgIF90aGlzLl9vbkRlbGl2ZXIoX3RoaXMuX21zZyk7XG4gICAgfVxuICB9XG5cbiAgZmFpbChlcnJvcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoIV90aGlzLl9pblN0b3ApIHtcbiAgICAgIF90aGlzLl9pblN0b3AgPSB0cnVlO1xuICAgICAgaWYgKF90aGlzLl9waXBlbGluZS5vbkZhaWwpIHtcbiAgICAgICAgX3RoaXMuX3BpcGVsaW5lLm9uRmFpbChlcnJvcik7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIEl0ZXJhdG9yIHtcbiAgLyogcHJpdmF0ZVxuICAgIF9pbmRleDogbnVtYmVyXG4gICAgX2FycmF5OiBbXVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKGFycmF5KSB7XG4gICAgdGhpcy5faW5kZXggPSAtMTtcbiAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICB9XG5cbiAgZ2V0IGhhc05leHQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2luZGV4IDwgdGhpcy5fYXJyYXkubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIGdldCBuZXh0KCkge1xuICAgIHRoaXMuX2luZGV4Kys7XG4gICAgcmV0dXJuIHRoaXMuX2FycmF5W3RoaXMuX2luZGV4XTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaXBlbGluZTtcbiIsImltcG9ydCBNaW5pQnVzIGZyb20gJy4vYnVzL01pbmlCdXMnO1xuZXhwb3J0IGRlZmF1bHQgTWluaUJ1cztcbiJdfQ==
