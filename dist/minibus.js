// version: 0.15.0
// date: Wed Dec 19 2018 14:56:28 GMT+0000 (Western European Standard Time)
// licence: 
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


// version: 0.15.0
// date: Wed Dec 19 2018 14:56:28 GMT+0000 (Western European Standard Time)
// licence: 
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("minibus",[],t):"object"==typeof exports?exports.minibus=t():e.minibus=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var i=t[o]={i:o,l:!1,exports:{}};return e[o].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(o,i,function(t){return e[t]}.bind(null,i));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=29)}({1:function(e,t,n){var o,i;!function(r,s){"use strict";void 0===(i="function"==typeof(o=function(){var e=function(){},t="undefined",n=["trace","debug","info","warn","error"];function o(e,t){var n=e[t];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function i(t,o){for(var i=0;i<n.length;i++){var r=n[i];this[r]=i<t?e:this.methodFactory(r,t,o)}this.log=this.debug}function r(n,r,s){return function(n){return"debug"===n&&(n="log"),typeof console!==t&&(void 0!==console[n]?o(console,n):void 0!==console.log?o(console,"log"):e)}(n)||function(e,n,o){return function(){typeof console!==t&&(i.call(this,n,o),this[e].apply(this,arguments))}}.apply(this,arguments)}function s(e,o,s){var u,l=this,c="loglevel";function a(){var e;if(typeof window!==t){try{e=window.localStorage[c]}catch(e){}if(typeof e===t)try{var n=window.document.cookie,o=n.indexOf(encodeURIComponent(c)+"=");-1!==o&&(e=/^([^;]+)/.exec(n.slice(o))[1])}catch(e){}return void 0===l.levels[e]&&(e=void 0),e}}e&&(c+=":"+e),l.name=e,l.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},l.methodFactory=s||r,l.getLevel=function(){return u},l.setLevel=function(o,r){if("string"==typeof o&&void 0!==l.levels[o.toUpperCase()]&&(o=l.levels[o.toUpperCase()]),!("number"==typeof o&&o>=0&&o<=l.levels.SILENT))throw"log.setLevel() called with invalid level: "+o;if(u=o,!1!==r&&function(e){var o=(n[e]||"silent").toUpperCase();if(typeof window!==t){try{return void(window.localStorage[c]=o)}catch(e){}try{window.document.cookie=encodeURIComponent(c)+"="+o+";"}catch(e){}}}(o),i.call(l,o,e),typeof console===t&&o<l.levels.SILENT)return"No console available for logging"},l.setDefaultLevel=function(e){a()||l.setLevel(e,!1)},l.enableAll=function(e){l.setLevel(l.levels.TRACE,e)},l.disableAll=function(e){l.setLevel(l.levels.SILENT,e)};var f=a();null==f&&(f=null==o?"WARN":o),l.setLevel(f,!1)}var u=new s,l={};u.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=l[e];return t||(t=l[e]=new s(e,u.getLevel(),u.methodFactory)),t};var c=typeof window!==t?window.log:void 0;return u.noConflict=function(){return typeof window!==t&&window.log===u&&(window.log=c),u},u.getLoggers=function(){return l},u})?o.call(t,n,t,e):o)||(e.exports=i)}()},29:function(e,t,n){"use strict";n.r(t);var o=n(6);t.default=o.a},6:function(e,t,n){"use strict";var o=n(7);function i(e){return(i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function r(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function s(e){return(s=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function u(e,t){return(u=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){return!t||"object"!==i(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}(this,s(t).call(this))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&u(e,t)}(t,o.a),function(e,t,n){t&&r(e.prototype,t)}(t,[{key:"postMessage",value:function(e,t,n){return this._genId(e),this._responseCallback(e,t,n),this._onPostMessage(e),e.id}},{key:"_onMessage",value:function(e){if(!this._onResponse(e)){var t=this._subscriptions[e.to];t?(this._publishOn(t,e),e.to.startsWith("hyperty")||this._publishOnDefault(e)):this._publishOnDefault(e)}}}]),t}();t.a=l},7:function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}function r(e,t,n){return t&&i(e.prototype,t),n&&i(e,n),e}var s=n(1).getLogger("Bus"),u=function(){function e(){o(this,e),this._msgId=0,this._subscriptions={},this._responseTimeOut=15e3,this._responseCallbacks={},this._registerExternalListener()}return r(e,[{key:"addListener",value:function(e,t){var n=new l(this._subscriptions,e,t),o=this._subscriptions[e];return o||(o=[],this._subscriptions[e]=o),o.push(n),n}},{key:"addResponseListener",value:function(e,t,n){this._responseCallbacks[e+t]=n}},{key:"removeResponseListener",value:function(e,t){delete this._responseCallbacks[e+t]}},{key:"removeAllListenersOf",value:function(e){delete this._subscriptions[e]}},{key:"bind",value:function(e,t,n){var o=this,i=this;return{thisListener:i.addListener(e,function(e){n.postMessage(e)}),targetListener:n.addListener(t,function(e){i.postMessage(e)}),unbind:function(){o.thisListener.remove(),o.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(e){var t=this._subscriptions["*"];t&&this._publishOn(t,e)}},{key:"_publishOn",value:function(e,t){e.forEach(function(e){e._callback(t)})}},{key:"_responseCallback",value:function(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],o=this;if(t){var i=e.from+e.id;o._responseCallbacks[i]=t,n&&setTimeout(function(){var t=o._responseCallbacks[i];delete o._responseCallbacks[i],t&&t({id:e.id,type:"response",body:{code:408,desc:"Response timeout!",value:e}})},o._responseTimeOut)}}},{key:"_onResponse",value:function(e){if("response"===e.type){var t=e.to+e.id,n=this._responseCallbacks[t];if(e.body.code>=200&&delete this._responseCallbacks[t],n)return n(e),!0}return!1}},{key:"_onMessage",value:function(e){if(!this._onResponse(e)){var t=this._subscriptions[e.to];t?this._publishOn(t,e):this._publishOnDefault(e)}}},{key:"_genId",value:function(e){e.id&&0!==e.id||(this._msgId++,e.id=this._msgId)}},{key:"postMessage",value:function(e,t){}},{key:"postMessageWithRetries",value:function(e,t,n){var o=this,i=0;!function r(){new Promise(function(t,i){o.postMessage(e,function(o){408===o.body.code||500===o.body.code?i():(s.info("[Bus.postMessageWithRetries] msg delivered: ",e),n(o),t())})}).then(function(){},function(){if(s.warn("[Bus.postMessageWithRetries] Message Bounced (retry ".concat(i,"): '"),e),!(i++<t)){var n="[Error] Message Bounced (delivery attempts ".concat(t,"): '");throw new Error(n+e)}r()})}()}},{key:"_onPostMessage",value:function(e){}},{key:"_registerExternalListener",value:function(){}}]),e}(),l=function(){function e(t,n,i){o(this,e),this._subscriptions=t,this._url=n,this._callback=i}return r(e,[{key:"remove",value:function(){var e=this._subscriptions[this._url];if(e){var t=e.indexOf(this);e.splice(t,1),0===e.length&&delete this._subscriptions[this._url]}}},{key:"url",get:function(){return this._url}}]),e}();t.a=u}})});