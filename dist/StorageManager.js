// version: 0.14.0
// date: Mon Nov 05 2018 09:55:51 GMT+0000 (Western European Standard Time)
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


// version: 0.14.0
// date: Mon Nov 05 2018 09:55:51 GMT+0000 (Western European Standard Time)
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


!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("StorageManager",[],e):"object"==typeof exports?exports.StorageManager=e():t.StorageManager=e()}("undefined"!=typeof self?self:this,function(){return function(t){function __webpack_require__(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}var e={};return __webpack_require__.m=t,__webpack_require__.c=e,__webpack_require__.d=function(t,e,n){__webpack_require__.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:n})},__webpack_require__.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=175)}([function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e,n){var r=n(31)("wks"),o=n(22),i=n(1).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e,n){"use strict";e.__esModule=!0;var r=n(64),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(t,e,n){return e&&defineProperties(t.prototype,e),n&&defineProperties(t,n),t}}()},function(t,e,n){var r=n(1),o=n(0),i=n(17),u=n(11),c=n(10),a=function(t,e,n){var f,s,l,p=t&a.F,v=t&a.G,h=t&a.S,d=t&a.P,y=t&a.B,g=t&a.W,_=v?o:o[e]||(o[e]={}),b=_.prototype,m=v?r:h?r[e]:(r[e]||{}).prototype;v&&(n=e);for(f in n)(s=!p&&m&&void 0!==m[f])&&c(_,f)||(l=s?m[f]:n[f],_[f]=v&&"function"!=typeof m[f]?n[f]:y&&s?i(l,r):g&&m[f]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(l):d&&"function"==typeof l?i(Function.call,l):l,d&&((_.virtual||(_.virtual={}))[f]=l,t&a.R&&b&&!b[f]&&u(b,f,l)))};a.F=1,a.G=2,a.S=4,a.P=8,a.B=16,a.W=32,a.U=64,a.R=128,t.exports=a},function(t,e,n){var r=n(9);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},function(t,e,n){t.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(6),o=n(43),i=n(29),u=Object.defineProperty;e.f=n(7)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var r=n(8),o=n(21);t.exports=n(7)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var r=n(62),o=n(25);t.exports=function(t){return r(o(t))}},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){t.exports={default:n(71),__esModule:!0}},function(t,e){t.exports=!0},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e,n){var r=n(20);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports={}},function(t,e,n){var r=n(44),o=n(32);t.exports=Object.keys||function(t){return r(t,o)}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},function(t,e,n){var r=n(8).f,o=n(10),i=n(2)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},function(t,e){var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},function(t,e){t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},,function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var r=n(9),o=n(1).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},function(t,e,n){var r=n(9);t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var r=n(31)("keys"),o=n(22);t.exports=function(t){return r[t]||(r[t]=o(t))}},function(t,e,n){var r=n(0),o=n(1),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(t.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:r.version,mode:n(15)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var r=n(25);t.exports=function(t){return Object(r(t))}},,,,function(t,e,n){"use strict";function PromiseCapability(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r}),this.resolve=r(e),this.reject=r(n)}var r=n(20);t.exports.f=function(t){return new PromiseCapability(t)}},function(t,e,n){var r,o;!function(i,u){"use strict";r=u,void 0!==(o="function"==typeof r?r.call(e,n,e,t):r)&&(t.exports=o)}(0,function(){"use strict";function bindMethod(t,e){var n=t[e];if("function"==typeof n.bind)return n.bind(t);try{return Function.prototype.bind.call(n,t)}catch(e){return function(){return Function.prototype.apply.apply(n,[t,arguments])}}}function realMethod(n){return"debug"===n&&(n="log"),typeof console!==e&&(void 0!==console[n]?bindMethod(console,n):void 0!==console.log?bindMethod(console,"log"):t)}function replaceLoggingMethods(e,r){for(var o=0;o<n.length;o++){var i=n[o];this[i]=o<e?t:this.methodFactory(i,e,r)}this.log=this.debug}function enableLoggingWhenConsoleArrives(t,n,r){return function(){typeof console!==e&&(replaceLoggingMethods.call(this,n,r),this[t].apply(this,arguments))}}function defaultMethodFactory(t,e,n){return realMethod(t)||enableLoggingWhenConsoleArrives.apply(this,arguments)}function Logger(t,r,o){function persistLevelIfPossible(t){var r=(n[t]||"silent").toUpperCase();if(typeof window!==e){try{return void(window.localStorage[c]=r)}catch(t){}try{window.document.cookie=encodeURIComponent(c)+"="+r+";"}catch(t){}}}function getPersistedLevel(){var t;if(typeof window!==e){try{t=window.localStorage[c]}catch(t){}if(typeof t===e)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(c)+"=");-1!==r&&(t=/^([^;]+)/.exec(n.slice(r))[1])}catch(t){}return void 0===u.levels[t]&&(t=void 0),t}}var i,u=this,c="loglevel";t&&(c+=":"+t),u.name=t,u.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},u.methodFactory=o||defaultMethodFactory,u.getLevel=function(){return i},u.setLevel=function(n,r){if("string"==typeof n&&void 0!==u.levels[n.toUpperCase()]&&(n=u.levels[n.toUpperCase()]),!("number"==typeof n&&n>=0&&n<=u.levels.SILENT))throw"log.setLevel() called with invalid level: "+n;if(i=n,!1!==r&&persistLevelIfPossible(n),replaceLoggingMethods.call(u,n,t),typeof console===e&&n<u.levels.SILENT)return"No console available for logging"},u.setDefaultLevel=function(t){getPersistedLevel()||u.setLevel(t,!1)},u.enableAll=function(t){u.setLevel(u.levels.TRACE,t)},u.disableAll=function(t){u.setLevel(u.levels.SILENT,t)};var a=getPersistedLevel();null==a&&(a=null==r?"WARN":r),u.setLevel(a,!1)}var t=function(){},e="undefined",n=["trace","debug","info","warn","error"],r=new Logger,o={};r.getLogger=function(t){if("string"!=typeof t||""===t)throw new TypeError("You must supply a name when creating a logger.");var e=o[t];return e||(e=o[t]=new Logger(t,r.getLevel(),r.methodFactory)),e};var i=typeof window!==e?window.log:void 0;return r.noConflict=function(){return typeof window!==e&&window.log===r&&(window.log=i),r},r.getLoggers=function(){return o},r})},function(t,e,n){e.f=n(2)},function(t,e,n){var r=n(1),o=n(0),i=n(15),u=n(39),c=n(8).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||c(e,t,{value:u.f(t)})}},function(t,e,n){var r=n(6),o=n(74),i=n(32),u=n(30)("IE_PROTO"),c=function(){},a=function(){var t,e=n(28)("iframe"),r=i.length;for(e.style.display="none",n(55).appendChild(e),e.src="javascript:",t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),a=t.F;r--;)delete a.prototype[i[r]];return a()};t.exports=Object.create||function(t,e){var n;return null!==t?(c.prototype=r(t),n=new c,c.prototype=null,n[u]=t):n=a(),void 0===e?n:o(n,e)}},function(t,e,n){"use strict";var r=n(72)(!0);n(53)(String,"String",function(t){this._t=String(t),this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},function(t,e,n){t.exports=!n(7)&&!n(13)(function(){return 7!=Object.defineProperty(n(28)("div"),"a",{get:function(){return 7}}).a})},function(t,e,n){var r=n(10),o=n(12),i=n(66)(!1),u=n(30)("IE_PROTO");t.exports=function(t,e){var n,c=o(t),a=0,f=[];for(n in c)n!=u&&r(c,n)&&f.push(n);for(;e.length>a;)r(c,n=e[a++])&&(~i(f,n)||f.push(n));return f}},function(t,e,n){var r=n(24),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},function(t,e,n){n(75);for(var r=n(1),o=n(11),i=n(18),u=n(2)("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),a=0;a<c.length;a++){var f=c[a],s=r[f],l=s&&s.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){t.exports={default:n(113),__esModule:!0}},function(t,e,n){var r=n(16),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(c=r(e))&&"function"==typeof e.callee?"Arguments":c}},function(t,e,n){var r=n(5),o=n(0),i=n(13);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},function(t,e,n){var r=n(27),o=n(21),i=n(12),u=n(29),c=n(10),a=n(43),f=Object.getOwnPropertyDescriptor;e.f=n(7)?f:function(t,e){if(t=i(t),e=u(e,!0),a)try{return f(t,e)}catch(t){}if(c(t,e))return o(!r.f.call(t,e),t[e])}},function(t,e){},function(t,e,n){"use strict";var r=n(15),o=n(5),i=n(54),u=n(11),c=n(18),a=n(73),f=n(23),s=n(63),l=n(2)("iterator"),p=!([].keys&&"next"in[].keys()),v=function(){return this};t.exports=function(t,e,n,h,d,y,g){a(n,e,h);var _,b,m,w=function(t){if(!p&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},x=e+" Iterator",S="values"==d,O=!1,P=t.prototype,j=P[l]||P["@@iterator"]||d&&P[d],k=j||w(d),M=d?S?w("entries"):k:void 0,L="Array"==e?P.entries||j:j;if(L&&(m=s(L.call(new t)))!==Object.prototype&&m.next&&(f(m,x,!0),r||"function"==typeof m[l]||u(m,l,v)),S&&j&&"values"!==j.name&&(O=!0,k=function(){return j.call(this)}),r&&!g||!p&&!O&&P[l]||u(P,l,k),c[e]=k,c[x]=v,d)if(_={values:S?k:w("values"),keys:y?k:w("keys"),entries:M},g)for(b in _)b in P||i(P,b,_[b]);else o(o.P+o.F*(p||O),e,_);return _}},function(t,e,n){t.exports=n(11)},function(t,e,n){var r=n(1).document;t.exports=r&&r.documentElement},function(t,e,n){var r=n(6),o=n(20),i=n(2)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||void 0==(n=r(u)[i])?e:o(n)}},function(t,e,n){var r,o,i,u=n(17),c=n(83),a=n(55),f=n(28),s=n(1),l=s.process,p=s.setImmediate,v=s.clearImmediate,h=s.MessageChannel,d=s.Dispatch,y=0,g={},_=function(){var t=+this;if(g.hasOwnProperty(t)){var e=g[t];delete g[t],e()}},b=function(t){_.call(t.data)};p&&v||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return g[++y]=function(){c("function"==typeof t?t:Function(t),e)},r(y),y},v=function(t){delete g[t]},"process"==n(16)(l)?r=function(t){l.nextTick(u(_,t,1))}:d&&d.now?r=function(t){d.now(u(_,t,1))}:h?(o=new h,i=o.port2,o.port1.onmessage=b,r=u(i.postMessage,i,1)):s.addEventListener&&"function"==typeof postMessage&&!s.importScripts?(r=function(t){s.postMessage(t+"","*")},s.addEventListener("message",b,!1)):r="onreadystatechange"in f("script")?function(t){a.appendChild(f("script")).onreadystatechange=function(){a.removeChild(this),_.call(t)}}:function(t){setTimeout(u(_,t,1),0)}),t.exports={set:p,clear:v}},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,e,n){var r=n(6),o=n(9),i=n(37);t.exports=function(t,e){if(r(t),o(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(91),o=_interopRequireDefault(r),i=n(93),u=_interopRequireDefault(i),c="function"==typeof u.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":typeof t};e.default="function"==typeof u.default&&"symbol"===c(o.default)?function(t){return void 0===t?"undefined":c(t)}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":void 0===t?"undefined":c(t)}},function(t,e,n){var r=n(44),o=n(32).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},function(t,e,n){var r=n(16);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},function(t,e,n){var r=n(10),o=n(33),i=n(30)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},function(t,e,n){t.exports={default:n(68),__esModule:!0}},,function(t,e,n){var r=n(12),o=n(45),i=n(67);t.exports=function(t){return function(e,n,u){var c,a=r(e),f=o(a.length),s=i(u,f);if(t&&n!=n){for(;f>s;)if((c=a[s++])!=c)return!0}else for(;f>s;s++)if((t||s in a)&&a[s]===n)return t||s||0;return!t&&-1}}},function(t,e,n){var r=n(24),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},function(t,e,n){n(69);var r=n(0).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},function(t,e,n){var r=n(5);r(r.S+r.F*!n(7),"Object",{defineProperty:n(8).f})},function(t,e,n){var r=n(49),o=n(2)("iterator"),i=n(18);t.exports=n(0).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},function(t,e,n){n(52),n(42),n(46),n(78),n(89),n(90),t.exports=n(0).Promise},function(t,e,n){var r=n(24),o=n(25);t.exports=function(t){return function(e,n){var i,u,c=String(o(e)),a=r(n),f=c.length;return a<0||a>=f?t?"":void 0:(i=c.charCodeAt(a),i<55296||i>56319||a+1===f||(u=c.charCodeAt(a+1))<56320||u>57343?t?c.charAt(a):i:t?c.slice(a,a+2):u-56320+(i-55296<<10)+65536)}}},function(t,e,n){"use strict";var r=n(41),o=n(21),i=n(23),u={};n(11)(u,n(2)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},function(t,e,n){var r=n(8),o=n(6),i=n(19);t.exports=n(7)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),c=u.length,a=0;c>a;)r.f(t,n=u[a++],e[n]);return t}},function(t,e,n){"use strict";var r=n(76),o=n(77),i=n(18),u=n(12);t.exports=n(53)(Array,"Array",function(t,e){this._t=u(t),this._i=0,this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),i.Arguments=i.Array,r("keys"),r("values"),r("entries")},function(t,e){t.exports=function(){}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){"use strict";var r,o,i,u,c=n(15),a=n(1),f=n(17),s=n(49),l=n(5),p=n(9),v=n(20),h=n(79),d=n(80),y=n(56),g=n(57).set,_=n(84)(),b=n(37),m=n(58),w=n(85),x=n(59),S=a.TypeError,O=a.process,P=O&&O.versions,j=P&&P.v8||"",k=a.Promise,M="process"==s(O),L=function(){},R=o=b.f,T=!!function(){try{var t=k.resolve(1),e=(t.constructor={})[n(2)("species")]=function(t){t(L,L)};return(M||"function"==typeof PromiseRejectionEvent)&&t.then(L)instanceof e&&0!==j.indexOf("6.6")&&-1===w.indexOf("Chrome/66")}catch(t){}}(),E=function(t){var e;return!(!p(t)||"function"!=typeof(e=t.then))&&e},A=function(t,e){if(!t._n){t._n=!0;var n=t._c;_(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u,c=o?e.ok:e.fail,a=e.resolve,f=e.reject,s=e.domain;try{c?(o||(2==t._h&&N(t),t._h=1),!0===c?n=r:(s&&s.enter(),n=c(r),s&&(s.exit(),u=!0)),n===e.promise?f(S("Promise-chain cycle")):(i=E(n))?i.call(n,a,f):a(n)):f(r)}catch(t){s&&!u&&s.exit(),f(t)}}(n[i++]);t._c=[],t._n=!1,e&&!t._h&&F(t)})}},F=function(t){g.call(a,function(){var e,n,r,o=t._v,i=C(t);if(i&&(e=m(function(){M?O.emit("unhandledRejection",o,t):(n=a.onunhandledrejection)?n({promise:t,reason:o}):(r=a.console)&&r.error&&r.error("Unhandled promise rejection",o)}),t._h=M||C(t)?2:1),t._a=void 0,i&&e.e)throw e.v})},C=function(t){return 1!==t._h&&0===(t._a||t._c).length},N=function(t){g.call(a,function(){var e;M?O.emit("rejectionHandled",t):(e=a.onrejectionhandled)&&e({promise:t,reason:t._v})})},q=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,e._v=t,e._s=2,e._a||(e._a=e._c.slice()),A(e,!0))},D=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=E(t))?_(function(){var r={_w:n,_d:!1};try{e.call(t,f(D,r,1),f(q,r,1))}catch(t){q.call(r,t)}}):(n._v=t,n._s=1,A(n,!1))}catch(t){q.call({_w:n,_d:!1},t)}}};T||(k=function(t){h(this,k,"Promise","_h"),v(t),r.call(this);try{t(f(D,this,1),f(q,this,1))}catch(t){q.call(this,t)}},r=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1},r.prototype=n(86)(k.prototype,{then:function(t,e){var n=R(y(this,k));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=M?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&A(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),i=function(){var t=new r;this.promise=t,this.resolve=f(D,t,1),this.reject=f(q,t,1)},b.f=R=function(t){return t===k||t===u?new i(t):o(t)}),l(l.G+l.W+l.F*!T,{Promise:k}),n(23)(k,"Promise"),n(87)("Promise"),u=n(0).Promise,l(l.S+l.F*!T,"Promise",{reject:function(t){var e=R(this);return(0,e.reject)(t),e.promise}}),l(l.S+l.F*(c||!T),"Promise",{resolve:function(t){return x(c&&this===u?k:this,t)}}),l(l.S+l.F*!(T&&n(88)(function(t){k.all(t).catch(L)})),"Promise",{all:function(t){var e=this,n=R(e),r=n.resolve,o=n.reject,i=m(function(){var n=[],i=0,u=1;d(t,!1,function(t){var c=i++,a=!1;n.push(void 0),u++,e.resolve(t).then(function(t){a||(a=!0,n[c]=t,--u||r(n))},o)}),--u||r(n)});return i.e&&o(i.v),n.promise},race:function(t){var e=this,n=R(e),r=n.reject,o=m(function(){d(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o.e&&r(o.v),n.promise}})},function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var r=n(17),o=n(81),i=n(82),u=n(6),c=n(45),a=n(70),f={},s={},e=t.exports=function(t,e,n,l,p){var v,h,d,y,g=p?function(){return t}:a(t),_=r(n,l,e?2:1),b=0;if("function"!=typeof g)throw TypeError(t+" is not iterable!");if(i(g)){for(v=c(t.length);v>b;b++)if((y=e?_(u(h=t[b])[0],h[1]):_(t[b]))===f||y===s)return y}else for(d=g.call(t);!(h=d.next()).done;)if((y=o(d,_,h.value,e))===f||y===s)return y};e.BREAK=f,e.RETURN=s},function(t,e,n){var r=n(6);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},function(t,e,n){var r=n(18),o=n(2)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},function(t,e){t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var r=n(1),o=n(57).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,c=r.Promise,a="process"==n(16)(u);t.exports=function(){var t,e,n,f=function(){var r,o;for(a&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};if(a)n=function(){u.nextTick(f)};else if(!i||r.navigator&&r.navigator.standalone)if(c&&c.resolve){var s=c.resolve(void 0);n=function(){s.then(f)}}else n=function(){o.call(r,f)};else{var l=!0,p=document.createTextNode("");new i(f).observe(p,{characterData:!0}),n=function(){p.data=l=!l}}return function(r){var o={fn:r,next:void 0};e&&(e.next=o),t||(t=o,n()),e=o}}},function(t,e,n){var r=n(1),o=r.navigator;t.exports=o&&o.userAgent||""},function(t,e,n){var r=n(11);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},function(t,e,n){"use strict";var r=n(1),o=n(0),i=n(8),u=n(7),c=n(2)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[c]&&i.f(e,c,{configurable:!0,get:function(){return this}})}},function(t,e,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},function(t,e,n){"use strict";var r=n(5),o=n(0),i=n(1),u=n(56),c=n(59);r(r.P+r.R,"Promise",{finally:function(t){var e=u(this,o.Promise||i.Promise),n="function"==typeof t;return this.then(n?function(n){return c(e,t()).then(function(){return n})}:t,n?function(n){return c(e,t()).then(function(){throw n})}:t)}})},function(t,e,n){"use strict";var r=n(5),o=n(37),i=n(58);r(r.S,"Promise",{try:function(t){var e=o.f(this),n=i(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},function(t,e,n){t.exports={default:n(92),__esModule:!0}},function(t,e,n){n(42),n(46),t.exports=n(39).f("iterator")},function(t,e,n){t.exports={default:n(94),__esModule:!0}},function(t,e,n){n(95),n(52),n(100),n(101),t.exports=n(0).Symbol},function(t,e,n){"use strict";var r=n(1),o=n(10),i=n(7),u=n(5),c=n(54),a=n(96).KEY,f=n(13),s=n(31),l=n(23),p=n(22),v=n(2),h=n(39),d=n(40),y=n(97),g=n(98),_=n(6),b=n(9),m=n(12),w=n(29),x=n(21),S=n(41),O=n(99),P=n(51),j=n(8),k=n(19),M=P.f,L=j.f,R=O.f,T=r.Symbol,E=r.JSON,A=E&&E.stringify,F=v("_hidden"),C=v("toPrimitive"),N={}.propertyIsEnumerable,q=s("symbol-registry"),D=s("symbols"),I=s("op-symbols"),K=Object.prototype,U="function"==typeof T,W=r.QObject,G=!W||!W.prototype||!W.prototype.findChild,B=i&&f(function(){return 7!=S(L({},"a",{get:function(){return L(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=M(K,e);r&&delete K[e],L(t,e,n),r&&t!==K&&L(K,e,r)}:L,V=function(t){var e=D[t]=S(T.prototype);return e._k=t,e},H=U&&"symbol"==typeof T.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof T},J=function(t,e,n){return t===K&&J(I,e,n),_(t),e=w(e,!0),_(n),o(D,e)?(n.enumerable?(o(t,F)&&t[F][e]&&(t[F][e]=!1),n=S(n,{enumerable:x(0,!1)})):(o(t,F)||L(t,F,x(1,{})),t[F][e]=!0),B(t,e,n)):L(t,e,n)},z=function(t,e){_(t);for(var n,r=y(e=m(e)),o=0,i=r.length;i>o;)J(t,n=r[o++],e[n]);return t},Y=function(t,e){return void 0===e?S(t):z(S(t),e)},Q=function(t){var e=N.call(this,t=w(t,!0));return!(this===K&&o(D,t)&&!o(I,t))&&(!(e||!o(this,t)||!o(D,t)||o(this,F)&&this[F][t])||e)},X=function(t,e){if(t=m(t),e=w(e,!0),t!==K||!o(D,e)||o(I,e)){var n=M(t,e);return!n||!o(D,e)||o(t,F)&&t[F][e]||(n.enumerable=!0),n}},Z=function(t){for(var e,n=R(m(t)),r=[],i=0;n.length>i;)o(D,e=n[i++])||e==F||e==a||r.push(e);return r},$=function(t){for(var e,n=t===K,r=R(n?I:m(t)),i=[],u=0;r.length>u;)!o(D,e=r[u++])||n&&!o(K,e)||i.push(D[e]);return i};U||(T=function(){if(this instanceof T)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===K&&e.call(I,n),o(this,F)&&o(this[F],t)&&(this[F][t]=!1),B(this,t,x(1,n))};return i&&G&&B(K,t,{configurable:!0,set:e}),V(t)},c(T.prototype,"toString",function(){return this._k}),P.f=X,j.f=J,n(61).f=O.f=Z,n(27).f=Q,n(47).f=$,i&&!n(15)&&c(K,"propertyIsEnumerable",Q,!0),h.f=function(t){return V(v(t))}),u(u.G+u.W+u.F*!U,{Symbol:T});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)v(tt[et++]);for(var nt=k(v.store),rt=0;nt.length>rt;)d(nt[rt++]);u(u.S+u.F*!U,"Symbol",{for:function(t){return o(q,t+="")?q[t]:q[t]=T(t)},keyFor:function(t){if(!H(t))throw TypeError(t+" is not a symbol!");for(var e in q)if(q[e]===t)return e},useSetter:function(){G=!0},useSimple:function(){G=!1}}),u(u.S+u.F*!U,"Object",{create:Y,defineProperty:J,defineProperties:z,getOwnPropertyDescriptor:X,getOwnPropertyNames:Z,getOwnPropertySymbols:$}),E&&u(u.S+u.F*(!U||f(function(){var t=T();return"[null]"!=A([t])||"{}"!=A({a:t})||"{}"!=A(Object(t))})),"JSON",{stringify:function(t){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);if(n=e=r[1],(b(e)||void 0!==t)&&!H(t))return g(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!H(e))return e}),r[1]=e,A.apply(E,r)}}),T.prototype[C]||n(11)(T.prototype,C,T.prototype.valueOf),l(T,"Symbol"),l(Math,"Math",!0),l(r.JSON,"JSON",!0)},function(t,e,n){var r=n(22)("meta"),o=n(9),i=n(10),u=n(8).f,c=0,a=Object.isExtensible||function(){return!0},f=!n(13)(function(){return a(Object.preventExtensions({}))}),s=function(t){u(t,r,{value:{i:"O"+ ++c,w:{}}})},l=function(t,e){if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){if(!a(t))return"F";if(!e)return"E";s(t)}return t[r].i},p=function(t,e){if(!i(t,r)){if(!a(t))return!0;if(!e)return!1;s(t)}return t[r].w},v=function(t){return f&&h.NEED&&a(t)&&!i(t,r)&&s(t),t},h=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:v}},function(t,e,n){var r=n(19),o=n(47),i=n(27);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,c=n(t),a=i.f,f=0;c.length>f;)a.call(t,u=c[f++])&&e.push(u);return e}},function(t,e,n){var r=n(16);t.exports=Array.isArray||function(t){return"Array"==r(t)}},function(t,e,n){var r=n(12),o=n(61).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?c(t):o(r(t))}},function(t,e,n){n(40)("asyncIterator")},function(t,e,n){n(40)("observable")},function(t,e,n){t.exports={default:n(122),__esModule:!0}},,,,,,,,,,,function(t,e,n){n(114),t.exports=n(0).Object.keys},function(t,e,n){var r=n(33),o=n(19);n(50)("keys",function(){return function(t){return o(r(t))}})},,,,,,,,function(t,e,n){n(123),t.exports=n(0).Object.assign},function(t,e,n){var r=n(5);r(r.S+r.F,"Object",{assign:n(124)})},function(t,e,n){"use strict";var r=n(19),o=n(47),i=n(27),u=n(33),c=n(62),a=Object.assign;t.exports=!a||n(13)(function(){var t={},e={},n=Symbol(),r="abcdefghijklmnopqrst";return t[n]=7,r.split("").forEach(function(t){e[t]=t}),7!=a({},t)[n]||Object.keys(a({},e)).join("")!=r})?function(t,e){for(var n=u(t),a=arguments.length,f=1,s=o.f,l=i.f;a>f;)for(var p,v=c(arguments[f++]),h=s?r(v).concat(s(v)):r(v),d=h.length,y=0;d>y;)l.call(v,p=h[y++])&&(n[p]=v[p]);return n}:a},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(176),o=_interopRequireDefault(r),i=n(48),u=_interopRequireDefault(i),c=n(60),a=_interopRequireDefault(c),f=n(102),s=_interopRequireDefault(f),l=n(14),p=_interopRequireDefault(l),v=n(3),h=_interopRequireDefault(v),d=n(4),y=_interopRequireDefault(d),g=n(38),_=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(g),b=_.getLogger("StorageManager"),m=function(){function StorageManager(t,e,n,r){var o=(arguments.length>4&&void 0!==arguments[4]&&arguments[4],arguments.length>5&&void 0!==arguments[5]&&arguments[5]);if((0,h.default)(this,StorageManager),!t)throw Error("The Storage Manager needs the database instance");if(!e)throw Error("The Storage Manager needs the storage name");var i={};n?i=n:i[e]="key,version,value",t.open().then(function(t){b.info("Found database name "+t.name+" with version no: "+t.verno)}).catch(b.error),this.db=t,this.storageName=e,this._remoteStorage=o,this._runtimeUA=r}return(0,y.default)(StorageManager,[{key:"connect",value:function(t){return this.db.connect(this._remoteStorage,t)}},{key:"disconnect",value:function(){var t=this;return new p.default(function(e,n){t.db.disconnect(t._remoteStorage).then(function(){e()},function(t){n(t)})})}},{key:"getBackupRevision",value:function(t){var e=this;return new p.default(function(t){e.db._syncNodes.get({type:"remote"}).then(function(e){e&&e.hasOwnProperty("appliedRemoteRevision")&&(null===e.appliedRemoteRevision&&(e.appliedRemoteRevision=0),t(e.appliedRemoteRevision))})})}},{key:"_updateBackupRevision",value:function(t){var e=this;return new p.default(function(n){e.db._syncNodes.get({type:"remote"}).then(function(r){r&&r.hasOwnProperty("appliedRemoteRevision")&&(null===r.appliedRemoteRevision&&(r.appliedRemoteRevision=0),e._runtimeUA._updateRuntimeStatus({resource:t,value:{backupRevision:r.appliedRemoteRevision}}),n(r.appliedRemoteRevision))})})}},{key:"_checkKey",value:function(t){return"string"!=typeof t?t.toString():t}},{key:"_getTable",value:function(t){var e=void 0;try{e=this.db.table(this.storageName).name}catch(n){e=this.db.table(t).name}return e}},{key:"_getPrimaryKey",value:function(t){return this.db.table(t).schema.primKey.name}},{key:"_isDefaultSchema",value:function(t){var e=this._getTable(t),n=this.db[e].schema.instanceTemplate;return n.hasOwnProperty("value")&&n.hasOwnProperty("version")&&n.hasOwnProperty("key")}},{key:"set",value:function(t,e,n,r){var o=this,i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return new p.default(function(u,c){b.info("[StorageManager] - set ",t,n),r=r||t;var a=o._getTable(r),f=o._getPrimaryKey(a),l=n;if(o._isDefaultSchema(r))l={key:t,version:e,value:n};else{var p={};p[f]=t,(0,s.default)(l,p)}o.db[a].put(l).then(function(){i&&l.backup&&l.url?o._updateBackupRevision(l.url).then(function(){u()}):u()},function(){u()})})}},{key:"get",value:function(t,e,n){var r=this;n=n||t;var i=this._getTable(n);if(i){var c=this._getPrimaryKey(i);return this.db.transaction("rw!",this.db[i],function(){if(!t&&!e)return r.db[i].toArray().then(function(t){return t.reduce(function(t,e){return t[e[c]]=e,t},{})});if(!e)return r.db[i].where(c).equals(t).first().then(function(t){return t&&t.hasOwnProperty("value")?t.value:t});var n=void 0===e?"undefined":(0,a.default)(e);switch(Array.isArray(e)&&(n="array"),n){case"string":return r.db[i].where(t).equals(e).first().then(function(t){return t&&t.hasOwnProperty("value")?t.value:t});case"object":var f="value."+(0,u.default)(e).toString(),s=(0,o.default)(e);return r.db[i].where(f).anyOf(s).first().then(function(t){return t&&t.hasOwnProperty("value")?t.value:t});case"array":return r.db[i].where(e).then(function(t){return t&&t.hasOwnProperty("value")?t.value:t})}})}}},{key:"getVersion",value:function(t,e,n){var r=this;b.info("[StorageManager] - getVersion for key ",t),n=n||t;var o=this._getTable(n),i=this._getPrimaryKey(o),u=e;return e||(u=t),this.db.transaction("rw!",this.db[o],function(){return r.db[o].where(i).equals(u).first().then(function(t){return t&&t.hasOwnProperty("version")?t.version:t}).catch(function(e){b.info("error getting the version for ",t," with error: ",e)})})}},{key:"delete",value:function(t,e,n){if(t){n=n||t;var r=this._getTable(n),o=this._getPrimaryKey(r),i=e;return e||(i=t),this.db[r].where(o).equals(i).delete()}return this.db.delete()}},{key:"remoteStorage",set:function(t){this._remoteStorage=t}}]),StorageManager}();e.default=m,t.exports=e.default},function(t,e,n){t.exports={default:n(177),__esModule:!0}},function(t,e,n){n(178),t.exports=n(0).Object.values},function(t,e,n){var r=n(5),o=n(179)(!1);r(r.S,"Object",{values:function(t){return o(t)}})},function(t,e,n){var r=n(19),o=n(12),i=n(27).f;t.exports=function(t){return function(e){for(var n,u=o(e),c=r(u),a=c.length,f=0,s=[];a>f;)i.call(u,n=c[f++])&&s.push(t?[n,u[n]]:u[n]);return s}}}])});