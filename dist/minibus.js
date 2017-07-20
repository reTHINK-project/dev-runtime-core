// version: 0.9.1
// date: Thu Jul 20 2017 16:01:32 GMT+0100 (WEST)
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


// version: 0.9.1
// date: Thu Jul 20 2017 16:01:32 GMT+0100 (WEST)
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


!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("minibus",[],e):"object"==typeof exports?exports.minibus=e():t.minibus=e()}(this,function(){/******/
return function(t){/******/
/******/
// The require function
/******/
function __webpack_require__(n){/******/
/******/
// Check if module is in cache
/******/
if(e[n])/******/
return e[n].exports;/******/
// Create a new module (and put it into the cache)
/******/
var r=e[n]={/******/
i:n,/******/
l:!1,/******/
exports:{}};/******/
/******/
// Return the exports of the module
/******/
/******/
/******/
// Execute the module function
/******/
/******/
/******/
// Flag the module as loaded
/******/
return t[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}// webpackBootstrap
/******/
// The module cache
/******/
var e={};/******/
/******/
// Load entry module and return exports
/******/
/******/
/******/
/******/
// expose the modules object (__webpack_modules__)
/******/
/******/
/******/
// expose the module cache
/******/
/******/
/******/
// define getter function for harmony exports
/******/
/******/
/******/
// getDefaultExport function for compatibility with non-harmony modules
/******/
/******/
/******/
// Object.prototype.hasOwnProperty.call
/******/
/******/
/******/
// __webpack_public_path__
/******/
return __webpack_require__.m=t,__webpack_require__.c=e,__webpack_require__.d=function(t,e,n){/******/
__webpack_require__.o(t,e)||/******/
Object.defineProperty(t,e,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:n})},__webpack_require__.n=function(t){/******/
var e=t&&t.__esModule?/******/
function(){return t.default}:/******/
function(){return t};/******/
/******/
return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=130)}([/* 0 */
/***/
function(t,e){var n=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(t,e){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
/***/
function(t,e,n){var r=n(28)("wks"),o=n(19),i=n(1).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},/* 3 */
/***/
function(t,e,n){
// Thank's IE8 for his funny defineProperty
t.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 4 */
/***/
function(t,e,n){var r=n(5),o=n(35),i=n(26),u=Object.defineProperty;e.f=n(3)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},/* 5 */
/***/
function(t,e,n){var r=n(10);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},/* 6 */
/***/
function(t,e,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(53),o=n(21);t.exports=function(t){return r(o(t))}},/* 7 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(14),u=n(8),c=function(t,e,n){var s,f,a,l=t&c.F,p=t&c.G,v=t&c.S,_=t&c.P,d=t&c.B,h=t&c.W,y=p?o:o[e]||(o[e]={}),b=y.prototype,m=p?r:v?r[e]:(r[e]||{}).prototype;p&&(n=e);for(s in n)
// contains in native
(f=!l&&m&&void 0!==m[s])&&s in y||(
// export native or passed
a=f?m[s]:n[s],
// prevent global pollution for namespaces
y[s]=p&&"function"!=typeof m[s]?n[s]:d&&f?i(a,r):h&&m[s]==a?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(a):_&&"function"==typeof a?i(Function.call,a):a,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
_&&((y.virtual||(y.virtual={}))[s]=a,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
t&c.R&&b&&!b[s]&&u(b,s,a)))};
// type bitmap
c.F=1,// forced
c.G=2,// global
c.S=4,// static
c.P=8,// proto
c.B=16,// bind
c.W=32,// wrap
c.U=64,// safe
c.R=128,// real proto method for `library` 
t.exports=c},/* 8 */
/***/
function(t,e,n){var r=n(4),o=n(18);t.exports=n(3)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},/* 9 */
/***/
function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},/* 10 */
/***/
function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},/* 11 */
/***/
function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(56),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(t,e,n){return e&&defineProperties(t.prototype,e),n&&defineProperties(t,n),t}}()},/* 13 */
/***/
function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},/* 14 */
/***/
function(t,e,n){
// optional / simple context binding
var r=n(24);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},/* 15 */
/***/
function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},/* 16 */
/***/
function(t,e,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(36),o=n(29);t.exports=Object.keys||function(t){return r(t,o)}},/* 17 */
/***/
function(t,e){t.exports={}},/* 18 */
/***/
function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},/* 19 */
/***/
function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},/* 20 */
/***/
function(t,e){
// 7.1.4 ToInteger
var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},/* 21 */
/***/
function(t,e){
// 7.2.1 RequireObjectCoercible(argument)
t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},/* 22 */
/***/
function(t,e){t.exports=!0},/* 23 */
/***/
function(t,e,n){var r=n(4).f,o=n(9),i=n(2)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},/* 24 */
/***/
function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},/* 25 */
/***/
function(t,e,n){var r=n(10),o=n(1).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},/* 26 */
/***/
function(t,e,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(t,e,n){var r=n(28)("keys"),o=n(19);t.exports=function(t){return r[t]||(r[t]=o(t))}},/* 28 */
/***/
function(t,e,n){var r=n(1),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});t.exports=function(t){return o[t]||(o[t]={})}},/* 29 */
/***/
function(t,e){
// IE 8- don't enum bug keys
t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(t,e,n){
// 7.1.13 ToObject(argument)
var r=n(21);t.exports=function(t){return Object(r(t))}},/* 31 */
/***/
function(t,e,n){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var r=n(5),o=n(65),i=n(29),u=n(27)("IE_PROTO"),c=function(){},s=function(){
// Thrash, waste and sodomy: IE GC bug
var t,e=n(25)("iframe"),r=i.length;for(e.style.display="none",n(45).appendChild(e),e.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;)delete s.prototype[i[r]];return s()};t.exports=Object.create||function(t,e){var n;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==t?(c.prototype=r(t),n=new c,c.prototype=null,n[u]=t):n=s(),void 0===e?n:o(n,e)}},/* 32 */
/***/
function(t,e,n){e.f=n(2)},/* 33 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(22),u=n(32),c=n(4).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||c(e,t,{value:u.f(t)})}},/* 34 */
/***/
function(t,e){e.f={}.propertyIsEnumerable},/* 35 */
/***/
function(t,e,n){t.exports=!n(3)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 36 */
/***/
function(t,e,n){var r=n(9),o=n(6),i=n(54)(!1),u=n(27)("IE_PROTO");t.exports=function(t,e){var n,c=o(t),s=0,f=[];for(n in c)n!=u&&r(c,n)&&f.push(n);
// Don't enum bug & hidden keys
for(;e.length>s;)r(c,n=e[s++])&&(~i(f,n)||f.push(n));return f}},/* 37 */
/***/
function(t,e,n){
// 7.1.15 ToLength
var r=n(20),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},/* 38 */
/***/
function(t,e,n){
// most Object methods by ES6 should accept primitives
var r=n(7),o=n(0),i=n(13);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},/* 39 */
/***/
function(t,e,n){var r=n(34),o=n(18),i=n(6),u=n(26),c=n(9),s=n(35),f=Object.getOwnPropertyDescriptor;e.f=n(3)?f:function(t,e){if(t=i(t),e=u(e,!0),s)try{return f(t,e)}catch(t){}if(c(t,e))return o(!r.f.call(t,e),t[e])}},/* 40 */
/***/
function(t,e,n){t.exports={default:n(62),__esModule:!0}},/* 41 */
/***/
function(t,e){},/* 42 */
/***/
function(t,e,n){"use strict";var r=n(63)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
n(43)(String,"String",function(t){this._t=String(t),// target
this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},/* 43 */
/***/
function(t,e,n){"use strict";var r=n(22),o=n(7),i=n(44),u=n(8),c=n(9),s=n(17),f=n(64),a=n(23),l=n(46),p=n(2)("iterator"),v=!([].keys&&"next"in[].keys()),_=function(){return this};t.exports=function(t,e,n,d,h,y,b){f(n,e,d);var m,g,x,O=function(t){if(!v&&t in M)return M[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",j="values"==h,k=!1,M=t.prototype,P=M[p]||M["@@iterator"]||h&&M[h],S=P||O(h),E=h?j?O("entries"):S:void 0,R="Array"==e?M.entries||P:P;if(
// Fix native
R&&(x=l(R.call(new t)))!==Object.prototype&&(
// Set @@toStringTag to native iterators
a(x,w,!0),
// fix for some old engines
r||c(x,p)||u(x,p,_)),
// fix Array#{values, @@iterator}.name in V8 / FF
j&&P&&"values"!==P.name&&(k=!0,S=function(){return P.call(this)}),
// Define iterator
r&&!b||!v&&!k&&M[p]||u(M,p,S),
// Plug for library
s[e]=S,s[w]=_,h)if(m={values:j?S:O("values"),keys:y?S:O("keys"),entries:E},b)for(g in m)g in M||i(M,g,m[g]);else o(o.P+o.F*(v||k),e,m);return m}},/* 44 */
/***/
function(t,e,n){t.exports=n(8)},/* 45 */
/***/
function(t,e,n){t.exports=n(1).document&&document.documentElement},/* 46 */
/***/
function(t,e,n){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var r=n(9),o=n(30),i=n(27)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},/* 47 */
/***/
function(t,e,n){n(66);for(var r=n(1),o=n(8),i=n(17),u=n(2)("toStringTag"),c=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],s=0;s<5;s++){var f=c[s],a=r[f],l=a&&a.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},/* 48 */
/***/
function(t,e,n){
// getting tag from 19.1.3.6 Object.prototype.toString()
var r=n(15),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(c=r(e))&&"function"==typeof e.callee?"Arguments":c}},/* 49 */
/***/
function(t,e,n){var r,o,i,u=n(14),c=n(76),s=n(45),f=n(25),a=n(1),l=a.process,p=a.setImmediate,v=a.clearImmediate,_=a.MessageChannel,d=0,h={},y=function(){var t=+this;if(h.hasOwnProperty(t)){var e=h[t];delete h[t],e()}},b=function(t){y.call(t.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&v||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return h[++d]=function(){c("function"==typeof t?t:Function(t),e)},r(d),d},v=function(t){delete h[t]},
// Node.js 0.8-
"process"==n(15)(l)?r=function(t){l.nextTick(u(y,t,1))}:_?(o=new _,i=o.port2,o.port1.onmessage=b,r=u(i.postMessage,i,1)):a.addEventListener&&"function"==typeof postMessage&&!a.importScripts?(r=function(t){a.postMessage(t+"","*")},a.addEventListener("message",b,!1)):r="onreadystatechange"in f("script")?function(t){s.appendChild(f("script")).onreadystatechange=function(){s.removeChild(this),y.call(t)}}:function(t){setTimeout(u(y,t,1),0)}),t.exports={set:p,clear:v}},/* 50 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(83),o=_interopRequireDefault(r),i=n(85),u=_interopRequireDefault(i),c="function"==typeof u.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":typeof t};e.default="function"==typeof u.default&&"symbol"===c(o.default)?function(t){return void 0===t?"undefined":c(t)}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":void 0===t?"undefined":c(t)}},/* 51 */
/***/
function(t,e){e.f=Object.getOwnPropertySymbols},/* 52 */
/***/
function(t,e,n){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var r=n(36),o=n(29).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},/* 53 */
/***/
function(t,e,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(15);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},/* 54 */
/***/
function(t,e,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(6),o=n(37),i=n(55);t.exports=function(t){return function(e,n,u){var c,s=r(e),f=o(s.length),a=i(u,f);
// Array#includes uses SameValueZero equality algorithm
if(t&&n!=n){for(;f>a;)if((c=s[a++])!=c)return!0}else for(;f>a;a++)if((t||a in s)&&s[a]===n)return t||a||0;return!t&&-1}}},/* 55 */
/***/
function(t,e,n){var r=n(20),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},/* 56 */
/***/
function(t,e,n){t.exports={default:n(57),__esModule:!0}},/* 57 */
/***/
function(t,e,n){n(58);var r=n(0).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},/* 58 */
/***/
function(t,e,n){var r=n(7);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(3),"Object",{defineProperty:n(4).f})},/* 59 */
/***/
function(t,e,n){t.exports={default:n(81),__esModule:!0}},/* 60 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(50),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==(void 0===e?"undefined":(0,o.default)(e))&&"function"!=typeof e?t:e}},/* 61 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(95),o=_interopRequireDefault(r),i=n(99),u=_interopRequireDefault(i),c=n(50),s=_interopRequireDefault(c);e.default=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,s.default)(e)));t.prototype=(0,u.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.default?(0,o.default)(t,e):t.__proto__=e)}},/* 62 */
/***/
function(t,e,n){n(41),n(42),n(47),n(69),t.exports=n(0).Promise},/* 63 */
/***/
function(t,e,n){var r=n(20),o=n(21);
// true  -> String#at
// false -> String#codePointAt
t.exports=function(t){return function(e,n){var i,u,c=String(o(e)),s=r(n),f=c.length;return s<0||s>=f?t?"":void 0:(i=c.charCodeAt(s),i<55296||i>56319||s+1===f||(u=c.charCodeAt(s+1))<56320||u>57343?t?c.charAt(s):i:t?c.slice(s,s+2):u-56320+(i-55296<<10)+65536)}}},/* 64 */
/***/
function(t,e,n){"use strict";var r=n(31),o=n(18),i=n(23),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
n(8)(u,n(2)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},/* 65 */
/***/
function(t,e,n){var r=n(4),o=n(5),i=n(16);t.exports=n(3)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),c=u.length,s=0;c>s;)r.f(t,n=u[s++],e[n]);return t}},/* 66 */
/***/
function(t,e,n){"use strict";var r=n(67),o=n(68),i=n(17),u=n(6);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
t.exports=n(43)(Array,"Array",function(t,e){this._t=u(t),// target
this._i=0,// next index
this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
i.Arguments=i.Array,r("keys"),r("values"),r("entries")},/* 67 */
/***/
function(t,e){t.exports=function(){}},/* 68 */
/***/
function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},/* 69 */
/***/
function(t,e,n){"use strict";var r,o,i,u=n(22),c=n(1),s=n(14),f=n(48),a=n(7),l=n(10),p=n(24),v=n(70),_=n(71),d=n(75),h=n(49).set,y=n(77)(),b=c.TypeError,m=c.process,g=c.Promise,m=c.process,x="process"==f(m),O=function(){},w=!!function(){try{
// correct subclassing with @@species support
var t=g.resolve(1),e=(t.constructor={})[n(2)("species")]=function(t){t(O,O)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(x||"function"==typeof PromiseRejectionEvent)&&t.then(O)instanceof e}catch(t){}}(),j=function(t,e){
// with library wrapper special case
return t===e||t===g&&e===i},k=function(t){var e;return!(!l(t)||"function"!=typeof(e=t.then))&&e},M=function(t){return j(g,t)?new P(t):new o(t)},P=o=function(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw b("Bad Promise constructor");e=t,n=r}),this.resolve=p(e),this.reject=p(n)},S=function(t){try{t()}catch(t){return{error:t}}},E=function(t,e){if(!t._n){t._n=!0;var n=t._c;y(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u=o?e.ok:e.fail,c=e.resolve,s=e.reject,f=e.domain;try{u?(o||(2==t._h&&T(t),t._h=1),!0===u?n=r:(f&&f.enter(),n=u(r),f&&f.exit()),n===e.promise?s(b("Promise-chain cycle")):(i=k(n))?i.call(n,c,s):c(n)):s(r)}catch(t){s(t)}}(n[i++]);// variable length - can't use forEach
t._c=[],t._n=!1,e&&!t._h&&R(t)})}},R=function(t){h.call(c,function(){var e,n,r,o=t._v;if(q(t)&&(e=S(function(){x?m.emit("unhandledRejection",o,t):(n=c.onunhandledrejection)?n({promise:t,reason:o}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
t._h=x||q(t)?2:1),t._a=void 0,e)throw e.error})},q=function(t){if(1==t._h)return!1;for(var e,n=t._a||t._c,r=0;n.length>r;)if(e=n[r++],e.fail||!q(e.promise))return!1;return!0},T=function(t){h.call(c,function(){var e;x?m.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})})},D=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,// unwrap
e._v=t,e._s=2,e._a||(e._a=e._c.slice()),E(e,!0))},A=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;// unwrap
try{if(n===t)throw b("Promise can't be resolved itself");(e=k(t))?y(function(){var r={_w:n,_d:!1};// wrap
try{e.call(t,s(A,r,1),s(D,r,1))}catch(t){D.call(r,t)}}):(n._v=t,n._s=1,E(n,!1))}catch(t){D.call({_w:n,_d:!1},t)}}};
// constructor polyfill
w||(
// 25.4.3.1 Promise(executor)
g=function(t){v(this,g,"Promise","_h"),p(t),r.call(this);try{t(s(A,this,1),s(D,this,1))}catch(t){D.call(this,t)}},r=function(t){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},r.prototype=n(78)(g.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(t,e){var n=M(d(this,g));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=x?m.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&E(this,!1),n.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(t){return this.then(void 0,t)}}),P=function(){var t=new r;this.promise=t,this.resolve=s(A,t,1),this.reject=s(D,t,1)}),a(a.G+a.W+a.F*!w,{Promise:g}),n(23)(g,"Promise"),n(79)("Promise"),i=n(0).Promise,
// statics
a(a.S+a.F*!w,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(t){var e=M(this);return(0,e.reject)(t),e.promise}}),a(a.S+a.F*(u||!w),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(t){
// instanceof instead of internal slot check because we should fix it without replacement native Promise core
if(t instanceof g&&j(t.constructor,this))return t;var e=M(this);return(0,e.resolve)(t),e.promise}}),a(a.S+a.F*!(w&&n(80)(function(t){g.all(t).catch(O)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(t){var e=this,n=M(e),r=n.resolve,o=n.reject,i=S(function(){var n=[],i=0,u=1;_(t,!1,function(t){var c=i++,s=!1;n.push(void 0),u++,e.resolve(t).then(function(t){s||(s=!0,n[c]=t,--u||r(n))},o)}),--u||r(n)});return i&&o(i.error),n.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(t){var e=this,n=M(e),r=n.reject,o=S(function(){_(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o&&r(o.error),n.promise}})},/* 70 */
/***/
function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},/* 71 */
/***/
function(t,e,n){var r=n(14),o=n(72),i=n(73),u=n(5),c=n(37),s=n(74),f={},a={},e=t.exports=function(t,e,n,l,p){var v,_,d,h,y=p?function(){return t}:s(t),b=r(n,l,e?2:1),m=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");
// fast case for arrays with default iterator
if(i(y)){for(v=c(t.length);v>m;m++)if((h=e?b(u(_=t[m])[0],_[1]):b(t[m]))===f||h===a)return h}else for(d=y.call(t);!(_=d.next()).done;)if((h=o(d,b,_.value,e))===f||h===a)return h};e.BREAK=f,e.RETURN=a},/* 72 */
/***/
function(t,e,n){
// call something on iterator step with safe closing on error
var r=n(5);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},/* 73 */
/***/
function(t,e,n){
// check on default Array iterator
var r=n(17),o=n(2)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},/* 74 */
/***/
function(t,e,n){var r=n(48),o=n(2)("iterator"),i=n(17);t.exports=n(0).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},/* 75 */
/***/
function(t,e,n){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var r=n(5),o=n(24),i=n(2)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||void 0==(n=r(u)[i])?e:o(n)}},/* 76 */
/***/
function(t,e){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},/* 77 */
/***/
function(t,e,n){var r=n(1),o=n(49).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,c=r.Promise,s="process"==n(15)(u);t.exports=function(){var t,e,n,f=function(){var r,o;for(s&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};
// Node.js
if(s)n=function(){u.nextTick(f)};else if(i){var a=!0,l=document.createTextNode("");new i(f).observe(l,{characterData:!0}),// eslint-disable-line no-new
n=function(){l.data=a=!a}}else if(c&&c.resolve){var p=c.resolve();n=function(){p.then(f)}}else n=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(r,f)};return function(r){var o={fn:r,next:void 0};e&&(e.next=o),t||(t=o,n()),e=o}}},/* 78 */
/***/
function(t,e,n){var r=n(8);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},/* 79 */
/***/
function(t,e,n){"use strict";var r=n(1),o=n(0),i=n(4),u=n(3),c=n(2)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[c]&&i.f(e,c,{configurable:!0,get:function(){return this}})}},/* 80 */
/***/
function(t,e,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},/* 81 */
/***/
function(t,e,n){n(82),t.exports=n(0).Object.getPrototypeOf},/* 82 */
/***/
function(t,e,n){
// 19.1.2.9 Object.getPrototypeOf(O)
var r=n(30),o=n(46);n(38)("getPrototypeOf",function(){return function(t){return o(r(t))}})},/* 83 */
/***/
function(t,e,n){t.exports={default:n(84),__esModule:!0}},/* 84 */
/***/
function(t,e,n){n(42),n(47),t.exports=n(32).f("iterator")},/* 85 */
/***/
function(t,e,n){t.exports={default:n(86),__esModule:!0}},/* 86 */
/***/
function(t,e,n){n(87),n(41),n(93),n(94),t.exports=n(0).Symbol},/* 87 */
/***/
function(t,e,n){"use strict";
// ECMAScript 6 symbols shim
var r=n(1),o=n(9),i=n(3),u=n(7),c=n(44),s=n(88).KEY,f=n(13),a=n(28),l=n(23),p=n(19),v=n(2),_=n(32),d=n(33),h=n(89),y=n(90),b=n(91),m=n(5),g=n(6),x=n(26),O=n(18),w=n(31),j=n(92),k=n(39),M=n(4),P=n(16),S=k.f,E=M.f,R=j.f,q=r.Symbol,T=r.JSON,D=T&&T.stringify,A=v("_hidden"),L=v("toPrimitive"),C={}.propertyIsEnumerable,F=a("symbol-registry"),I=a("symbols"),B=a("op-symbols"),N=Object.prototype,W="function"==typeof q,K=r.QObject,G=!K||!K.prototype||!K.prototype.findChild,J=i&&f(function(){return 7!=w(E({},"a",{get:function(){return E(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=S(N,e);r&&delete N[e],E(t,e,n),r&&t!==N&&E(N,e,r)}:E,U=function(t){var e=I[t]=w(q.prototype);return e._k=t,e},z=W&&"symbol"==typeof q.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof q},Y=function(t,e,n){return t===N&&Y(B,e,n),m(t),e=x(e,!0),m(n),o(I,e)?(n.enumerable?(o(t,A)&&t[A][e]&&(t[A][e]=!1),n=w(n,{enumerable:O(0,!1)})):(o(t,A)||E(t,A,O(1,{})),t[A][e]=!0),J(t,e,n)):E(t,e,n)},H=function(t,e){m(t);for(var n,r=y(e=g(e)),o=0,i=r.length;i>o;)Y(t,n=r[o++],e[n]);return t},Q=function(t,e){return void 0===e?w(t):H(w(t),e)},V=function(t){var e=C.call(this,t=x(t,!0));return!(this===N&&o(I,t)&&!o(B,t))&&(!(e||!o(this,t)||!o(I,t)||o(this,A)&&this[A][t])||e)},X=function(t,e){if(t=g(t),e=x(e,!0),t!==N||!o(I,e)||o(B,e)){var n=S(t,e);return!n||!o(I,e)||o(t,A)&&t[A][e]||(n.enumerable=!0),n}},Z=function(t){for(var e,n=R(g(t)),r=[],i=0;n.length>i;)o(I,e=n[i++])||e==A||e==s||r.push(e);return r},$=function(t){for(var e,n=t===N,r=R(n?B:g(t)),i=[],u=0;r.length>u;)!o(I,e=r[u++])||n&&!o(N,e)||i.push(I[e]);return i};
// 19.4.1.1 Symbol([description])
W||(q=function(){if(this instanceof q)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===N&&e.call(B,n),o(this,A)&&o(this[A],t)&&(this[A][t]=!1),J(this,t,O(1,n))};return i&&G&&J(N,t,{configurable:!0,set:e}),U(t)},c(q.prototype,"toString",function(){return this._k}),k.f=X,M.f=Y,n(52).f=j.f=Z,n(34).f=V,n(51).f=$,i&&!n(22)&&c(N,"propertyIsEnumerable",V,!0),_.f=function(t){return U(v(t))}),u(u.G+u.W+u.F*!W,{Symbol:q});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)v(tt[et++]);for(var tt=P(v.store),et=0;tt.length>et;)d(tt[et++]);u(u.S+u.F*!W,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(t){return o(F,t+="")?F[t]:F[t]=q(t)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(t){if(z(t))return h(F,t);throw TypeError(t+" is not a symbol!")},useSetter:function(){G=!0},useSimple:function(){G=!1}}),u(u.S+u.F*!W,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:Q,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:Y,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:H,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:X,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:Z,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:$}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
T&&u(u.S+u.F*(!W||f(function(){var t=q();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=D([t])||"{}"!=D({a:t})||"{}"!=D(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!z(t)){for(// IE8 returns string on undefined
var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);return e=r[1],"function"==typeof e&&(n=e),!n&&b(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!z(e))return e}),r[1]=e,D.apply(T,r)}}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
q.prototype[L]||n(8)(q.prototype,L,q.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(q,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(r.JSON,"JSON",!0)},/* 88 */
/***/
function(t,e,n){var r=n(19)("meta"),o=n(10),i=n(9),u=n(4).f,c=0,s=Object.isExtensible||function(){return!0},f=!n(13)(function(){return s(Object.preventExtensions({}))}),a=function(t){u(t,r,{value:{i:"O"+ ++c,// object ID
w:{}}})},l=function(t,e){
// return primitive with prefix
if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){
// can't set metadata to uncaught frozen object
if(!s(t))return"F";
// not necessary to add metadata
if(!e)return"E";
// add missing metadata
a(t)}return t[r].i},p=function(t,e){if(!i(t,r)){
// can't set metadata to uncaught frozen object
if(!s(t))return!0;
// not necessary to add metadata
if(!e)return!1;
// add missing metadata
a(t)}return t[r].w},v=function(t){return f&&_.NEED&&s(t)&&!i(t,r)&&a(t),t},_=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:v}},/* 89 */
/***/
function(t,e,n){var r=n(16),o=n(6);t.exports=function(t,e){for(var n,i=o(t),u=r(i),c=u.length,s=0;c>s;)if(i[n=u[s++]]===e)return n}},/* 90 */
/***/
function(t,e,n){
// all enumerable object keys, includes symbols
var r=n(16),o=n(51),i=n(34);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,c=n(t),s=i.f,f=0;c.length>f;)s.call(t,u=c[f++])&&e.push(u);return e}},/* 91 */
/***/
function(t,e,n){
// 7.2.2 IsArray(argument)
var r=n(15);t.exports=Array.isArray||function(t){return"Array"==r(t)}},/* 92 */
/***/
function(t,e,n){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var r=n(6),o=n(52).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?c(t):o(r(t))}},/* 93 */
/***/
function(t,e,n){n(33)("asyncIterator")},/* 94 */
/***/
function(t,e,n){n(33)("observable")},/* 95 */
/***/
function(t,e,n){t.exports={default:n(96),__esModule:!0}},/* 96 */
/***/
function(t,e,n){n(97),t.exports=n(0).Object.setPrototypeOf},/* 97 */
/***/
function(t,e,n){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var r=n(7);r(r.S,"Object",{setPrototypeOf:n(98).set})},/* 98 */
/***/
function(t,e,n){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var r=n(10),o=n(5),i=function(t,e){if(o(t),!r(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(t,e,r){try{r=n(14)(Function.call,n(39).f(Object.prototype,"__proto__").set,2),r(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return i(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:i}},/* 99 */
/***/
function(t,e,n){t.exports={default:n(100),__esModule:!0}},/* 100 */
/***/
function(t,e,n){n(101);var r=n(0).Object;t.exports=function(t,e){return r.create(t,e)}},/* 101 */
/***/
function(t,e,n){var r=n(7);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
r(r.S,"Object",{create:n(31)})},/* 102 */
,/* 103 */
,/* 104 */
,/* 105 */
,/* 106 */
,/* 107 */
,/* 108 */
,/* 109 */
,/* 110 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(59),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),c=n(12),s=_interopRequireDefault(c),f=n(60),a=_interopRequireDefault(f),l=n(61),p=_interopRequireDefault(l),v=n(111),_=_interopRequireDefault(v),d=function(t){function MiniBus(){return(0,u.default)(this,MiniBus),(0,a.default)(this,(MiniBus.__proto__||(0,o.default)(MiniBus)).call(this))}/**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
return(0,p.default)(MiniBus,t),(0,s.default)(MiniBus,[{key:"postMessage",value:function(t,e){var n=this;
//always send to external (to core MessageBus)
return n._genId(t),n._responseCallback(t,e),n._onPostMessage(t),t.id}},{key:"_onMessage",value:function(t){var e=this;if(!e._onResponse(t)){var n=e._subscriptions[t.to];n?(e._publishOn(n,t),t.to.startsWith("hyperty")||e._publishOnDefault(t)):e._publishOnDefault(t)}}}]),MiniBus}(_.default);/**
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
e.default=d,t.exports=e.default},/* 111 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(40),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),c=n(12),s=_interopRequireDefault(c),f=function(){/* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   */
function Bus(){(0,u.default)(this,Bus);var t=this;t._msgId=0,t._subscriptions={},t._responseTimeOut=5e3,//default to 3s
t._responseCallbacks={},t._registerExternalListener()}/**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
return(0,s.default)(Bus,[{key:"addListener",value:function(t,e){var n=this,r=new a(n._subscriptions,t,e),o=n._subscriptions[t];return o||(o=[],n._subscriptions[t]=o),o.push(r),r}},{key:"addResponseListener",value:function(t,e,n){this._responseCallbacks[t+e]=n}},{key:"removeResponseListener",value:function(t,e){delete this._responseCallbacks[t+e]}},{key:"removeAllListenersOf",value:function(t){delete this._subscriptions[t]}},{key:"bind",value:function(t,e,n){var r=this,o=this;return{thisListener:o.addListener(t,function(t){n.postMessage(t)}),targetListener:n.addListener(e,function(t){o.postMessage(t)}),unbind:function(){r.thisListener.remove(),r.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(t){
//is there any "*" (default) listeners?
var e=this._subscriptions["*"];e&&this._publishOn(e,t)}},{key:"_publishOn",value:function(t,e){t.forEach(function(t){t._callback(e)})}},{key:"_responseCallback",value:function(t,e){var n=this;
//automatic management of response handlers
if(e){var r=t.from+t.id;n._responseCallbacks[r]=e,setTimeout(function(){var e=n._responseCallbacks[r];if(delete n._responseCallbacks[r],e){e({id:t.id,type:"response",body:{code:408,desc:"Response timeout!",value:t}})}},n._responseTimeOut)}}},{key:"_onResponse",value:function(t){var e=this;if("response"===t.type){var n=t.to+t.id,r=e._responseCallbacks[n];if(
//if it's a provisional response, don't delete response listener
t.body.code>=200&&delete e._responseCallbacks[n],r)return r(t),!0}return!1}},{key:"_onMessage",value:function(t){var e=this;if(!e._onResponse(t)){var n=e._subscriptions[t.to];n?e._publishOn(n,t):e._publishOnDefault(t)}}},{key:"_genId",value:function(t){
//TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
//Global counter will not work, because there will be multiple MiniBus instances!
//Per URL, can be a lot of data to maintain!
//Maybe a counter per MiniBus instance. This is the assumed solution for now.
t.id&&0!==t.id||(this._msgId++,t.id=this._msgId)}},{key:"postMessage",value:function(t,e){}},{key:"postMessageWithRetries",value:function(t,e,n){var r=this,i=0,u=function(){return new o.default(function(e,o){r.postMessage(t,function(t){408===t.body.code||500===t.body.code?o():(n(t),e())})})};!function tryAgain(){u().then(function(){},function(){if(!(i++<e)){var n="[Error] Message Bounced (delivery attempts "+e+"): '";throw new Error(n+t)}setTimeout(function(){tryAgain()},1e3)})}()}},{key:"_onPostMessage",value:function(t){}},{key:"_registerExternalListener",value:function(){}}]),Bus}(),a=function(){/* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */
function MsgListener(t,e,n){(0,u.default)(this,MsgListener);var r=this;r._subscriptions=t,r._url=e,r._callback=n}return(0,s.default)(MsgListener,[{key:"remove",/**
     * Remove this listener from the Bus
     */
value:function(){var t=this,e=t._subscriptions[t._url];if(e){var n=e.indexOf(t);e.splice(n,1),
//if there are no listeners, remove the subscription entirely.
0===e.length&&delete t._subscriptions[t._url]}}},{key:"url",get:function(){return this._url}}]),MsgListener}();e.default=f,t.exports=e.default},/* 112 */
,/* 113 */
,/* 114 */
,/* 115 */
,/* 116 */
,/* 117 */
,/* 118 */
,/* 119 */
,/* 120 */
,/* 121 */
,/* 122 */
,/* 123 */
,/* 124 */
,/* 125 */
,/* 126 */
,/* 127 */
,/* 128 */
,/* 129 */
,/* 130 */
/***/
function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(110),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=o.default,/**
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
t.exports=e.default}])});