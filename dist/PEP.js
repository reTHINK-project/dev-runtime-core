// version: 0.8.1
// date: Wed Jul 12 2017 12:37:55 GMT+0100 (WEST)
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


// version: 0.8.1
// date: Wed Jul 12 2017 12:37:55 GMT+0100 (WEST)
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("PEP",[],t):"object"==typeof exports?exports.PEP=t():e.PEP=t()}(this,function(){/******/
return function(e){/******/
/******/
// The require function
/******/
function __webpack_require__(r){/******/
/******/
// Check if module is in cache
/******/
if(t[r])/******/
return t[r].exports;/******/
// Create a new module (and put it into the cache)
/******/
var n=t[r]={/******/
i:r,/******/
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
return e[r].call(n.exports,n,n.exports,__webpack_require__),n.l=!0,n.exports}// webpackBootstrap
/******/
// The module cache
/******/
var t={};/******/
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
return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,r){/******/
__webpack_require__.o(e,t)||/******/
Object.defineProperty(e,t,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:r})},__webpack_require__.n=function(e){/******/
var t=e&&e.__esModule?/******/
function(){return e.default}:/******/
function(){return e};/******/
/******/
return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=113)}([/* 0 */
/***/
function(e,t){var r=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},/* 1 */
/***/
function(e,t){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var r=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=r)},/* 2 */
/***/
function(e,t,r){var n=r(28)("wks"),i=r(19),o=r(1).Symbol,u="function"==typeof o;(e.exports=function(e){return n[e]||(n[e]=u&&o[e]||(u?o:i)("Symbol."+e))}).store=n},/* 3 */
/***/
function(e,t,r){
// Thank's IE8 for his funny defineProperty
e.exports=!r(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 4 */
/***/
function(e,t,r){var n=r(5),i=r(35),o=r(26),u=Object.defineProperty;t.f=r(3)?Object.defineProperty:function(e,t,r){if(n(e),t=o(t,!0),n(r),i)try{return u(e,t,r)}catch(e){}if("get"in r||"set"in r)throw TypeError("Accessors not supported!");return"value"in r&&(e[t]=r.value),e}},/* 5 */
/***/
function(e,t,r){var n=r(10);e.exports=function(e){if(!n(e))throw TypeError(e+" is not an object!");return e}},/* 6 */
/***/
function(e,t,r){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var n=r(53),i=r(21);e.exports=function(e){return n(i(e))}},/* 7 */
/***/
function(e,t,r){var n=r(1),i=r(0),o=r(14),u=r(8),a=function(e,t,r){var s,c,f,l=e&a.F,p=e&a.G,d=e&a.S,v=e&a.P,y=e&a.B,h=e&a.W,_=p?i:i[t]||(i[t]={}),b=_.prototype,m=p?n:d?n[t]:(n[t]||{}).prototype;p&&(r=t);for(s in r)
// contains in native
(c=!l&&m&&void 0!==m[s])&&s in _||(
// export native or passed
f=c?m[s]:r[s],
// prevent global pollution for namespaces
_[s]=p&&"function"!=typeof m[s]?r[s]:y&&c?o(f,n):h&&m[s]==f?function(e){var t=function(t,r,n){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,r)}return new e(t,r,n)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):v&&"function"==typeof f?o(Function.call,f):f,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
v&&((_.virtual||(_.virtual={}))[s]=f,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
e&a.R&&b&&!b[s]&&u(b,s,f)))};
// type bitmap
a.F=1,// forced
a.G=2,// global
a.S=4,// static
a.P=8,// proto
a.B=16,// bind
a.W=32,// wrap
a.U=64,// safe
a.R=128,// real proto method for `library` 
e.exports=a},/* 8 */
/***/
function(e,t,r){var n=r(4),i=r(18);e.exports=r(3)?function(e,t,r){return n.f(e,t,i(1,r))}:function(e,t,r){return e[t]=r,e}},/* 9 */
/***/
function(e,t){var r={}.hasOwnProperty;e.exports=function(e,t){return r.call(e,t)}},/* 10 */
/***/
function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},/* 11 */
/***/
function(e,t,r){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(e,t,r){"use strict";t.__esModule=!0;var n=r(56),i=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(){function defineProperties(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),(0,i.default)(e,n.key,n)}}return function(e,t,r){return t&&defineProperties(e.prototype,t),r&&defineProperties(e,r),e}}()},/* 13 */
/***/
function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},/* 14 */
/***/
function(e,t,r){
// optional / simple context binding
var n=r(24);e.exports=function(e,t,r){if(n(e),void 0===t)return e;switch(r){case 1:return function(r){return e.call(t,r)};case 2:return function(r,n){return e.call(t,r,n)};case 3:return function(r,n,i){return e.call(t,r,n,i)}}return function(){return e.apply(t,arguments)}}},/* 15 */
/***/
function(e,t){var r={}.toString;e.exports=function(e){return r.call(e).slice(8,-1)}},/* 16 */
/***/
function(e,t,r){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var n=r(36),i=r(29);e.exports=Object.keys||function(e){return n(e,i)}},/* 17 */
/***/
function(e,t){e.exports={}},/* 18 */
/***/
function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},/* 19 */
/***/
function(e,t){var r=0,n=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++r+n).toString(36))}},/* 20 */
/***/
function(e,t){
// 7.1.4 ToInteger
var r=Math.ceil,n=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?n:r)(e)}},/* 21 */
/***/
function(e,t){
// 7.2.1 RequireObjectCoercible(argument)
e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},/* 22 */
/***/
function(e,t){e.exports=!0},/* 23 */
/***/
function(e,t,r){var n=r(4).f,i=r(9),o=r(2)("toStringTag");e.exports=function(e,t,r){e&&!i(e=r?e:e.prototype,o)&&n(e,o,{configurable:!0,value:t})}},/* 24 */
/***/
function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},/* 25 */
/***/
function(e,t,r){var n=r(10),i=r(1).document,o=n(i)&&n(i.createElement);e.exports=function(e){return o?i.createElement(e):{}}},/* 26 */
/***/
function(e,t,r){
// 7.1.1 ToPrimitive(input [, PreferredType])
var n=r(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
e.exports=function(e,t){if(!n(e))return e;var r,i;if(t&&"function"==typeof(r=e.toString)&&!n(i=r.call(e)))return i;if("function"==typeof(r=e.valueOf)&&!n(i=r.call(e)))return i;if(!t&&"function"==typeof(r=e.toString)&&!n(i=r.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(e,t,r){var n=r(28)("keys"),i=r(19);e.exports=function(e){return n[e]||(n[e]=i(e))}},/* 28 */
/***/
function(e,t,r){var n=r(1),i=n["__core-js_shared__"]||(n["__core-js_shared__"]={});e.exports=function(e){return i[e]||(i[e]={})}},/* 29 */
/***/
function(e,t){
// IE 8- don't enum bug keys
e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(e,t,r){
// 7.1.13 ToObject(argument)
var n=r(21);e.exports=function(e){return Object(n(e))}},/* 31 */
/***/
function(e,t,r){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var n=r(5),i=r(65),o=r(29),u=r(27)("IE_PROTO"),a=function(){},s=function(){
// Thrash, waste and sodomy: IE GC bug
var e,t=r(25)("iframe"),n=o.length;for(t.style.display="none",r(45).appendChild(t),t.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),s=e.F;n--;)delete s.prototype[o[n]];return s()};e.exports=Object.create||function(e,t){var r;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==e?(a.prototype=n(e),r=new a,a.prototype=null,r[u]=e):r=s(),void 0===t?r:i(r,t)}},/* 32 */
/***/
function(e,t,r){t.f=r(2)},/* 33 */
/***/
function(e,t,r){var n=r(1),i=r(0),o=r(22),u=r(32),a=r(4).f;e.exports=function(e){var t=i.Symbol||(i.Symbol=o?{}:n.Symbol||{});"_"==e.charAt(0)||e in t||a(t,e,{value:u.f(e)})}},/* 34 */
/***/
function(e,t){t.f={}.propertyIsEnumerable},/* 35 */
/***/
function(e,t,r){e.exports=!r(3)&&!r(13)(function(){return 7!=Object.defineProperty(r(25)("div"),"a",{get:function(){return 7}}).a})},/* 36 */
/***/
function(e,t,r){var n=r(9),i=r(6),o=r(54)(!1),u=r(27)("IE_PROTO");e.exports=function(e,t){var r,a=i(e),s=0,c=[];for(r in a)r!=u&&n(a,r)&&c.push(r);
// Don't enum bug & hidden keys
for(;t.length>s;)n(a,r=t[s++])&&(~o(c,r)||c.push(r));return c}},/* 37 */
/***/
function(e,t,r){
// 7.1.15 ToLength
var n=r(20),i=Math.min;e.exports=function(e){return e>0?i(n(e),9007199254740991):0}},/* 38 */
/***/
function(e,t,r){
// most Object methods by ES6 should accept primitives
var n=r(7),i=r(0),o=r(13);e.exports=function(e,t){var r=(i.Object||{})[e]||Object[e],u={};u[e]=t(r),n(n.S+n.F*o(function(){r(1)}),"Object",u)}},/* 39 */
/***/
function(e,t,r){var n=r(34),i=r(18),o=r(6),u=r(26),a=r(9),s=r(35),c=Object.getOwnPropertyDescriptor;t.f=r(3)?c:function(e,t){if(e=o(e),t=u(t,!0),s)try{return c(e,t)}catch(e){}if(a(e,t))return i(!n.f.call(e,t),e[t])}},/* 40 */
/***/
function(e,t,r){e.exports={default:r(62),__esModule:!0}},/* 41 */
/***/
function(e,t){},/* 42 */
/***/
function(e,t,r){"use strict";var n=r(63)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
r(43)(String,"String",function(e){this._t=String(e),// target
this._i=0},function(){var e,t=this._t,r=this._i;return r>=t.length?{value:void 0,done:!0}:(e=n(t,r),this._i+=e.length,{value:e,done:!1})})},/* 43 */
/***/
function(e,t,r){"use strict";var n=r(22),i=r(7),o=r(44),u=r(8),a=r(9),s=r(17),c=r(64),f=r(23),l=r(46),p=r(2)("iterator"),d=!([].keys&&"next"in[].keys()),v=function(){return this};e.exports=function(e,t,r,y,h,_,b){c(r,t,y);var m,g,x,R=function(e){if(!d&&e in k)return k[e];switch(e){case"keys":case"values":return function(){return new r(this,e)}}return function(){return new r(this,e)}},w=t+" Iterator",P="values"==h,O=!1,k=e.prototype,A=k[p]||k["@@iterator"]||h&&k[h],D=A||R(h),S=h?P?R("entries"):D:void 0,U="Array"==t?k.entries||A:A;if(
// Fix native
U&&(x=l(U.call(new e)))!==Object.prototype&&(
// Set @@toStringTag to native iterators
f(x,w,!0),
// fix for some old engines
n||a(x,p)||u(x,p,v)),
// fix Array#{values, @@iterator}.name in V8 / FF
P&&A&&"values"!==A.name&&(O=!0,D=function(){return A.call(this)}),
// Define iterator
n&&!b||!d&&!O&&k[p]||u(k,p,D),
// Plug for library
s[t]=D,s[w]=v,h)if(m={values:P?D:R("values"),keys:_?D:R("keys"),entries:S},b)for(g in m)g in k||o(k,g,m[g]);else i(i.P+i.F*(d||O),t,m);return m}},/* 44 */
/***/
function(e,t,r){e.exports=r(8)},/* 45 */
/***/
function(e,t,r){e.exports=r(1).document&&document.documentElement},/* 46 */
/***/
function(e,t,r){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var n=r(9),i=r(30),o=r(27)("IE_PROTO"),u=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=i(e),n(e,o)?e[o]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?u:null}},/* 47 */
/***/
function(e,t,r){r(66);for(var n=r(1),i=r(8),o=r(17),u=r(2)("toStringTag"),a=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],s=0;s<5;s++){var c=a[s],f=n[c],l=f&&f.prototype;l&&!l[u]&&i(l,u,c),o[c]=o.Array}},/* 48 */
/***/
function(e,t,r){
// getting tag from 19.1.3.6 Object.prototype.toString()
var n=r(15),i=r(2)("toStringTag"),o="Arguments"==n(function(){return arguments}()),u=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,r,a;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(r=u(t=Object(e),i))?r:o?n(t):"Object"==(a=n(t))&&"function"==typeof t.callee?"Arguments":a}},/* 49 */
/***/
function(e,t,r){var n,i,o,u=r(14),a=r(76),s=r(45),c=r(25),f=r(1),l=f.process,p=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,y=0,h={},_=function(){var e=+this;if(h.hasOwnProperty(e)){var t=h[e];delete h[e],t()}},b=function(e){_.call(e.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&d||(p=function(e){for(var t=[],r=1;arguments.length>r;)t.push(arguments[r++]);return h[++y]=function(){a("function"==typeof e?e:Function(e),t)},n(y),y},d=function(e){delete h[e]},
// Node.js 0.8-
"process"==r(15)(l)?n=function(e){l.nextTick(u(_,e,1))}:v?(i=new v,o=i.port2,i.port1.onmessage=b,n=u(o.postMessage,o,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(n=function(e){f.postMessage(e+"","*")},f.addEventListener("message",b,!1)):n="onreadystatechange"in c("script")?function(e){s.appendChild(c("script")).onreadystatechange=function(){s.removeChild(this),_.call(e)}}:function(e){setTimeout(u(_,e,1),0)}),e.exports={set:p,clear:d}},/* 50 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(83),i=_interopRequireDefault(n),o=r(85),u=_interopRequireDefault(o),a="function"==typeof u.default&&"symbol"==typeof i.default?function(e){return typeof e}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":typeof e};t.default="function"==typeof u.default&&"symbol"===a(i.default)?function(e){return void 0===e?"undefined":a(e)}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":void 0===e?"undefined":a(e)}},/* 51 */
/***/
function(e,t){t.f=Object.getOwnPropertySymbols},/* 52 */
/***/
function(e,t,r){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var n=r(36),i=r(29).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return n(e,i)}},/* 53 */
/***/
function(e,t,r){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var n=r(15);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==n(e)?e.split(""):Object(e)}},/* 54 */
/***/
function(e,t,r){
// false -> Array#indexOf
// true  -> Array#includes
var n=r(6),i=r(37),o=r(55);e.exports=function(e){return function(t,r,u){var a,s=n(t),c=i(s.length),f=o(u,c);
// Array#includes uses SameValueZero equality algorithm
if(e&&r!=r){for(;c>f;)if((a=s[f++])!=a)return!0}else for(;c>f;f++)if((e||f in s)&&s[f]===r)return e||f||0;return!e&&-1}}},/* 55 */
/***/
function(e,t,r){var n=r(20),i=Math.max,o=Math.min;e.exports=function(e,t){return e=n(e),e<0?i(e+t,0):o(e,t)}},/* 56 */
/***/
function(e,t,r){e.exports={default:r(57),__esModule:!0}},/* 57 */
/***/
function(e,t,r){r(58);var n=r(0).Object;e.exports=function(e,t,r){return n.defineProperty(e,t,r)}},/* 58 */
/***/
function(e,t,r){var n=r(7);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
n(n.S+n.F*!r(3),"Object",{defineProperty:r(4).f})},/* 59 */
/***/
function(e,t,r){e.exports={default:r(81),__esModule:!0}},/* 60 */
/***/
function(e,t,r){"use strict";t.__esModule=!0;var n=r(50),i=function(e){return e&&e.__esModule?e:{default:e}}(n);t.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,i.default)(t))&&"function"!=typeof t?e:t}},/* 61 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(95),i=_interopRequireDefault(n),o=r(99),u=_interopRequireDefault(o),a=r(50),s=_interopRequireDefault(a);t.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,s.default)(t)));e.prototype=(0,u.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(i.default?(0,i.default)(e,t):e.__proto__=t)}},/* 62 */
/***/
function(e,t,r){r(41),r(42),r(47),r(69),e.exports=r(0).Promise},/* 63 */
/***/
function(e,t,r){var n=r(20),i=r(21);
// true  -> String#at
// false -> String#codePointAt
e.exports=function(e){return function(t,r){var o,u,a=String(i(t)),s=n(r),c=a.length;return s<0||s>=c?e?"":void 0:(o=a.charCodeAt(s),o<55296||o>56319||s+1===c||(u=a.charCodeAt(s+1))<56320||u>57343?e?a.charAt(s):o:e?a.slice(s,s+2):u-56320+(o-55296<<10)+65536)}}},/* 64 */
/***/
function(e,t,r){"use strict";var n=r(31),i=r(18),o=r(23),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
r(8)(u,r(2)("iterator"),function(){return this}),e.exports=function(e,t,r){e.prototype=n(u,{next:i(1,r)}),o(e,t+" Iterator")}},/* 65 */
/***/
function(e,t,r){var n=r(4),i=r(5),o=r(16);e.exports=r(3)?Object.defineProperties:function(e,t){i(e);for(var r,u=o(t),a=u.length,s=0;a>s;)n.f(e,r=u[s++],t[r]);return e}},/* 66 */
/***/
function(e,t,r){"use strict";var n=r(67),i=r(68),o=r(17),u=r(6);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
e.exports=r(43)(Array,"Array",function(e,t){this._t=u(e),// target
this._i=0,// next index
this._k=t},function(){var e=this._t,t=this._k,r=this._i++;return!e||r>=e.length?(this._t=void 0,i(1)):"keys"==t?i(0,r):"values"==t?i(0,e[r]):i(0,[r,e[r]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
o.Arguments=o.Array,n("keys"),n("values"),n("entries")},/* 67 */
/***/
function(e,t){e.exports=function(){}},/* 68 */
/***/
function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},/* 69 */
/***/
function(e,t,r){"use strict";var n,i,o,u=r(22),a=r(1),s=r(14),c=r(48),f=r(7),l=r(10),p=r(24),d=r(70),v=r(71),y=r(75),h=r(49).set,_=r(77)(),b=a.TypeError,m=a.process,g=a.Promise,m=a.process,x="process"==c(m),R=function(){},w=!!function(){try{
// correct subclassing with @@species support
var e=g.resolve(1),t=(e.constructor={})[r(2)("species")]=function(e){e(R,R)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(x||"function"==typeof PromiseRejectionEvent)&&e.then(R)instanceof t}catch(e){}}(),P=function(e,t){
// with library wrapper special case
return e===t||e===g&&t===o},O=function(e){var t;return!(!l(e)||"function"!=typeof(t=e.then))&&t},k=function(e){return P(g,e)?new A(e):new i(e)},A=i=function(e){var t,r;this.promise=new e(function(e,n){if(void 0!==t||void 0!==r)throw b("Bad Promise constructor");t=e,r=n}),this.resolve=p(t),this.reject=p(r)},D=function(e){try{e()}catch(e){return{error:e}}},S=function(e,t){if(!e._n){e._n=!0;var r=e._c;_(function(){for(var n=e._v,i=1==e._s,o=0;r.length>o;)!function(t){var r,o,u=i?t.ok:t.fail,a=t.resolve,s=t.reject,c=t.domain;try{u?(i||(2==e._h&&j(e),e._h=1),!0===u?r=n:(c&&c.enter(),r=u(n),c&&c.exit()),r===t.promise?s(b("Promise-chain cycle")):(o=O(r))?o.call(r,a,s):a(r)):s(n)}catch(e){s(e)}}(r[o++]);// variable length - can't use forEach
e._c=[],e._n=!1,t&&!e._h&&U(e)})}},U=function(e){h.call(a,function(){var t,r,n,i=e._v;if(E(e)&&(t=D(function(){x?m.emit("unhandledRejection",i,e):(r=a.onunhandledrejection)?r({promise:e,reason:i}):(n=a.console)&&n.error&&n.error("Unhandled promise rejection",i)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
e._h=x||E(e)?2:1),e._a=void 0,t)throw t.error})},E=function(e){if(1==e._h)return!1;for(var t,r=e._a||e._c,n=0;r.length>n;)if(t=r[n++],t.fail||!E(t.promise))return!1;return!0},j=function(e){h.call(a,function(){var t;x?m.emit("rejectionHandled",e):(t=a.onrejectionhandled)&&t({promise:e,reason:e._v})})},q=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,// unwrap
t._v=e,t._s=2,t._a||(t._a=t._c.slice()),S(t,!0))},M=function(e){var t,r=this;if(!r._d){r._d=!0,r=r._w||r;// unwrap
try{if(r===e)throw b("Promise can't be resolved itself");(t=O(e))?_(function(){var n={_w:r,_d:!1};// wrap
try{t.call(e,s(M,n,1),s(q,n,1))}catch(e){q.call(n,e)}}):(r._v=e,r._s=1,S(r,!1))}catch(e){q.call({_w:r,_d:!1},e)}}};
// constructor polyfill
w||(
// 25.4.3.1 Promise(executor)
g=function(e){d(this,g,"Promise","_h"),p(e),n.call(this);try{e(s(M,this,1),s(q,this,1))}catch(e){q.call(this,e)}},n=function(e){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},n.prototype=r(78)(g.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(e,t){var r=k(y(this,g));return r.ok="function"!=typeof e||e,r.fail="function"==typeof t&&t,r.domain=x?m.domain:void 0,this._c.push(r),this._a&&this._a.push(r),this._s&&S(this,!1),r.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(e){return this.then(void 0,e)}}),A=function(){var e=new n;this.promise=e,this.resolve=s(M,e,1),this.reject=s(q,e,1)}),f(f.G+f.W+f.F*!w,{Promise:g}),r(23)(g,"Promise"),r(79)("Promise"),o=r(0).Promise,
// statics
f(f.S+f.F*!w,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(e){var t=k(this);return(0,t.reject)(e),t.promise}}),f(f.S+f.F*(u||!w),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(e){
// instanceof instead of internal slot check because we should fix it without replacement native Promise core
if(e instanceof g&&P(e.constructor,this))return e;var t=k(this);return(0,t.resolve)(e),t.promise}}),f(f.S+f.F*!(w&&r(80)(function(e){g.all(e).catch(R)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(e){var t=this,r=k(t),n=r.resolve,i=r.reject,o=D(function(){var r=[],o=0,u=1;v(e,!1,function(e){var a=o++,s=!1;r.push(void 0),u++,t.resolve(e).then(function(e){s||(s=!0,r[a]=e,--u||n(r))},i)}),--u||n(r)});return o&&i(o.error),r.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(e){var t=this,r=k(t),n=r.reject,i=D(function(){v(e,!1,function(e){t.resolve(e).then(r.resolve,n)})});return i&&n(i.error),r.promise}})},/* 70 */
/***/
function(e,t){e.exports=function(e,t,r,n){if(!(e instanceof t)||void 0!==n&&n in e)throw TypeError(r+": incorrect invocation!");return e}},/* 71 */
/***/
function(e,t,r){var n=r(14),i=r(72),o=r(73),u=r(5),a=r(37),s=r(74),c={},f={},t=e.exports=function(e,t,r,l,p){var d,v,y,h,_=p?function(){return e}:s(e),b=n(r,l,t?2:1),m=0;if("function"!=typeof _)throw TypeError(e+" is not iterable!");
// fast case for arrays with default iterator
if(o(_)){for(d=a(e.length);d>m;m++)if((h=t?b(u(v=e[m])[0],v[1]):b(e[m]))===c||h===f)return h}else for(y=_.call(e);!(v=y.next()).done;)if((h=i(y,b,v.value,t))===c||h===f)return h};t.BREAK=c,t.RETURN=f},/* 72 */
/***/
function(e,t,r){
// call something on iterator step with safe closing on error
var n=r(5);e.exports=function(e,t,r,i){try{return i?t(n(r)[0],r[1]):t(r)}catch(t){var o=e.return;throw void 0!==o&&n(o.call(e)),t}}},/* 73 */
/***/
function(e,t,r){
// check on default Array iterator
var n=r(17),i=r(2)("iterator"),o=Array.prototype;e.exports=function(e){return void 0!==e&&(n.Array===e||o[i]===e)}},/* 74 */
/***/
function(e,t,r){var n=r(48),i=r(2)("iterator"),o=r(17);e.exports=r(0).getIteratorMethod=function(e){if(void 0!=e)return e[i]||e["@@iterator"]||o[n(e)]}},/* 75 */
/***/
function(e,t,r){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var n=r(5),i=r(24),o=r(2)("species");e.exports=function(e,t){var r,u=n(e).constructor;return void 0===u||void 0==(r=n(u)[o])?t:i(r)}},/* 76 */
/***/
function(e,t){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
e.exports=function(e,t,r){var n=void 0===r;switch(t.length){case 0:return n?e():e.call(r);case 1:return n?e(t[0]):e.call(r,t[0]);case 2:return n?e(t[0],t[1]):e.call(r,t[0],t[1]);case 3:return n?e(t[0],t[1],t[2]):e.call(r,t[0],t[1],t[2]);case 4:return n?e(t[0],t[1],t[2],t[3]):e.call(r,t[0],t[1],t[2],t[3])}return e.apply(r,t)}},/* 77 */
/***/
function(e,t,r){var n=r(1),i=r(49).set,o=n.MutationObserver||n.WebKitMutationObserver,u=n.process,a=n.Promise,s="process"==r(15)(u);e.exports=function(){var e,t,r,c=function(){var n,i;for(s&&(n=u.domain)&&n.exit();e;){i=e.fn,e=e.next;try{i()}catch(n){throw e?r():t=void 0,n}}t=void 0,n&&n.enter()};
// Node.js
if(s)r=function(){u.nextTick(c)};else if(o){var f=!0,l=document.createTextNode("");new o(c).observe(l,{characterData:!0}),// eslint-disable-line no-new
r=function(){l.data=f=!f}}else if(a&&a.resolve){var p=a.resolve();r=function(){p.then(c)}}else r=function(){
// strange IE + webpack dev server bug - use .call(global)
i.call(n,c)};return function(n){var i={fn:n,next:void 0};t&&(t.next=i),e||(e=i,r()),t=i}}},/* 78 */
/***/
function(e,t,r){var n=r(8);e.exports=function(e,t,r){for(var i in t)r&&e[i]?e[i]=t[i]:n(e,i,t[i]);return e}},/* 79 */
/***/
function(e,t,r){"use strict";var n=r(1),i=r(0),o=r(4),u=r(3),a=r(2)("species");e.exports=function(e){var t="function"==typeof i[e]?i[e]:n[e];u&&t&&!t[a]&&o.f(t,a,{configurable:!0,get:function(){return this}})}},/* 80 */
/***/
function(e,t,r){var n=r(2)("iterator"),i=!1;try{var o=[7][n]();o.return=function(){i=!0},Array.from(o,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!i)return!1;var r=!1;try{var o=[7],u=o[n]();u.next=function(){return{done:r=!0}},o[n]=function(){return u},e(o)}catch(e){}return r}},/* 81 */
/***/
function(e,t,r){r(82),e.exports=r(0).Object.getPrototypeOf},/* 82 */
/***/
function(e,t,r){
// 19.1.2.9 Object.getPrototypeOf(O)
var n=r(30),i=r(46);r(38)("getPrototypeOf",function(){return function(e){return i(n(e))}})},/* 83 */
/***/
function(e,t,r){e.exports={default:r(84),__esModule:!0}},/* 84 */
/***/
function(e,t,r){r(42),r(47),e.exports=r(32).f("iterator")},/* 85 */
/***/
function(e,t,r){e.exports={default:r(86),__esModule:!0}},/* 86 */
/***/
function(e,t,r){r(87),r(41),r(93),r(94),e.exports=r(0).Symbol},/* 87 */
/***/
function(e,t,r){"use strict";
// ECMAScript 6 symbols shim
var n=r(1),i=r(9),o=r(3),u=r(7),a=r(44),s=r(88).KEY,c=r(13),f=r(28),l=r(23),p=r(19),d=r(2),v=r(32),y=r(33),h=r(89),_=r(90),b=r(91),m=r(5),g=r(6),x=r(26),R=r(18),w=r(31),P=r(92),O=r(39),k=r(4),A=r(16),D=O.f,S=k.f,U=P.f,E=n.Symbol,j=n.JSON,q=j&&j.stringify,M=d("_hidden"),L=d("toPrimitive"),F={}.propertyIsEnumerable,C=f("symbol-registry"),N=f("symbols"),T=f("op-symbols"),I=Object.prototype,B="function"==typeof E,G=n.QObject,z=!G||!G.prototype||!G.prototype.findChild,H=o&&c(function(){return 7!=w(S({},"a",{get:function(){return S(this,"a",{value:7}).a}})).a})?function(e,t,r){var n=D(I,t);n&&delete I[t],S(e,t,r),n&&e!==I&&S(I,t,n)}:S,Z=function(e){var t=N[e]=w(E.prototype);return t._k=e,t},V=B&&"symbol"==typeof E.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof E},J=function(e,t,r){return e===I&&J(T,t,r),m(e),t=x(t,!0),m(r),i(N,t)?(r.enumerable?(i(e,M)&&e[M][t]&&(e[M][t]=!1),r=w(r,{enumerable:R(0,!1)})):(i(e,M)||S(e,M,R(1,{})),e[M][t]=!0),H(e,t,r)):S(e,t,r)},W=function(e,t){m(e);for(var r,n=_(t=g(t)),i=0,o=n.length;o>i;)J(e,r=n[i++],t[r]);return e},K=function(e,t){return void 0===t?w(e):W(w(e),t)},$=function(e){var t=F.call(this,e=x(e,!0));return!(this===I&&i(N,e)&&!i(T,e))&&(!(t||!i(this,e)||!i(N,e)||i(this,M)&&this[M][e])||t)},Y=function(e,t){if(e=g(e),t=x(t,!0),e!==I||!i(N,t)||i(T,t)){var r=D(e,t);return!r||!i(N,t)||i(e,M)&&e[M][t]||(r.enumerable=!0),r}},Q=function(e){for(var t,r=U(g(e)),n=[],o=0;r.length>o;)i(N,t=r[o++])||t==M||t==s||n.push(t);return n},X=function(e){for(var t,r=e===I,n=U(r?T:g(e)),o=[],u=0;n.length>u;)!i(N,t=n[u++])||r&&!i(I,t)||o.push(N[t]);return o};
// 19.4.1.1 Symbol([description])
B||(E=function(){if(this instanceof E)throw TypeError("Symbol is not a constructor!");var e=p(arguments.length>0?arguments[0]:void 0),t=function(r){this===I&&t.call(T,r),i(this,M)&&i(this[M],e)&&(this[M][e]=!1),H(this,e,R(1,r))};return o&&z&&H(I,e,{configurable:!0,set:t}),Z(e)},a(E.prototype,"toString",function(){return this._k}),O.f=Y,k.f=J,r(52).f=P.f=Q,r(34).f=$,r(51).f=X,o&&!r(22)&&a(I,"propertyIsEnumerable",$,!0),v.f=function(e){return Z(d(e))}),u(u.G+u.W+u.F*!B,{Symbol:E});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)d(ee[te++]);for(var ee=A(d.store),te=0;ee.length>te;)y(ee[te++]);u(u.S+u.F*!B,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(e){return i(C,e+="")?C[e]:C[e]=E(e)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(e){if(V(e))return h(C,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){z=!0},useSimple:function(){z=!1}}),u(u.S+u.F*!B,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:K,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:J,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:W,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:Y,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:Q,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:X}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
j&&u(u.S+u.F*(!B||c(function(){var e=E();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=q([e])||"{}"!=q({a:e})||"{}"!=q(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!V(e)){for(// IE8 returns string on undefined
var t,r,n=[e],i=1;arguments.length>i;)n.push(arguments[i++]);return t=n[1],"function"==typeof t&&(r=t),!r&&b(t)||(t=function(e,t){if(r&&(t=r.call(this,e,t)),!V(t))return t}),n[1]=t,q.apply(j,n)}}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
E.prototype[L]||r(8)(E.prototype,L,E.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(E,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(n.JSON,"JSON",!0)},/* 88 */
/***/
function(e,t,r){var n=r(19)("meta"),i=r(10),o=r(9),u=r(4).f,a=0,s=Object.isExtensible||function(){return!0},c=!r(13)(function(){return s(Object.preventExtensions({}))}),f=function(e){u(e,n,{value:{i:"O"+ ++a,// object ID
w:{}}})},l=function(e,t){
// return primitive with prefix
if(!i(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!o(e,n)){
// can't set metadata to uncaught frozen object
if(!s(e))return"F";
// not necessary to add metadata
if(!t)return"E";
// add missing metadata
f(e)}return e[n].i},p=function(e,t){if(!o(e,n)){
// can't set metadata to uncaught frozen object
if(!s(e))return!0;
// not necessary to add metadata
if(!t)return!1;
// add missing metadata
f(e)}return e[n].w},d=function(e){return c&&v.NEED&&s(e)&&!o(e,n)&&f(e),e},v=e.exports={KEY:n,NEED:!1,fastKey:l,getWeak:p,onFreeze:d}},/* 89 */
/***/
function(e,t,r){var n=r(16),i=r(6);e.exports=function(e,t){for(var r,o=i(e),u=n(o),a=u.length,s=0;a>s;)if(o[r=u[s++]]===t)return r}},/* 90 */
/***/
function(e,t,r){
// all enumerable object keys, includes symbols
var n=r(16),i=r(51),o=r(34);e.exports=function(e){var t=n(e),r=i.f;if(r)for(var u,a=r(e),s=o.f,c=0;a.length>c;)s.call(e,u=a[c++])&&t.push(u);return t}},/* 91 */
/***/
function(e,t,r){
// 7.2.2 IsArray(argument)
var n=r(15);e.exports=Array.isArray||function(e){return"Array"==n(e)}},/* 92 */
/***/
function(e,t,r){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var n=r(6),i=r(52).f,o={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],a=function(e){try{return i(e)}catch(e){return u.slice()}};e.exports.f=function(e){return u&&"[object Window]"==o.call(e)?a(e):i(n(e))}},/* 93 */
/***/
function(e,t,r){r(33)("asyncIterator")},/* 94 */
/***/
function(e,t,r){r(33)("observable")},/* 95 */
/***/
function(e,t,r){e.exports={default:r(96),__esModule:!0}},/* 96 */
/***/
function(e,t,r){r(97),e.exports=r(0).Object.setPrototypeOf},/* 97 */
/***/
function(e,t,r){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var n=r(7);n(n.S,"Object",{setPrototypeOf:r(98).set})},/* 98 */
/***/
function(e,t,r){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var n=r(10),i=r(5),o=function(e,t){if(i(e),!n(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(e,t,n){try{n=r(14)(Function.call,r(39).f(Object.prototype,"__proto__").set,2),n(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,r){return o(e,r),t?e.__proto__=r:n(e,r),e}}({},!1):void 0),check:o}},/* 99 */
/***/
function(e,t,r){e.exports={default:r(100),__esModule:!0}},/* 100 */
/***/
function(e,t,r){r(101);var n=r(0).Object;e.exports=function(e,t){return n.create(e,t)}},/* 101 */
/***/
function(e,t,r){var n=r(7);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
n(n.S,"Object",{create:r(31)})},/* 102 */
/***/
function(e,t,r){e.exports={default:r(103),__esModule:!0}},/* 103 */
/***/
function(e,t,r){r(104),e.exports=r(0).Object.keys},/* 104 */
/***/
function(e,t,r){
// 19.1.2.14 Object.keys(O)
var n=r(30),i=r(16);r(38)("keys",function(){return function(e){return i(n(e))}})},/* 105 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}/**
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
/**
 * Support module with some functions will be useful
 * @module utils
 */
/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */
/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
function divideURL(e){function recurse(e){var t=/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;return e.replace(t,"$1,$3,$4").split(",")}var t=recurse(e);
// If the url has no scheme
if(t[0]===e&&!t[0].includes("@")){return{type:"",domain:e,identity:""}}
// check if the url has the scheme and includes an @
if(t[0]===e&&t[0].includes("@")){t=recurse((t[0]===e?"smtp":t[0])+"://"+t[0])}
// if the domain includes an @, divide it to domain and identity respectively
return t[1].includes("@")&&(t[2]=t[0]+"://"+t[1],t[1]=t[1].substr(t[1].indexOf("@")+1)),{type:t[0],domain:t[1],identity:t[2]}}/**
 * Check if an Object is empty
 * @param  {Object} object Object to be checked
 * @return {Boolean}       status of Object, empty or not (true|false);
 */
function emptyObject(e){return!((0,u.default)(e).length>0)}/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
function deepClone(e){
//TODO: simple but inefficient JSON deep clone...
if(e)return JSON.parse((0,i.default)(e))}function removePathFromURL(e){var t=e.split("/");return t[0]+"//"+t[2]+"/"+t[3]}/**
 * Obtains the user URL that corresponds to a given email
 * @param  {string} userEmail The user email
 * @return {URL.URL} userURL The user URL
 */
function getUserURLFromEmail(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}/**
 * Obtains the user email that corresponds to a given URL
 * @param  {URL.URL} userURL The user URL
 * @return {string} userEmail The user email
 */
function getUserEmailFromURL(e){var t=divideURL(e);return t.identity.replace("/","")+"@"+t.domain}/**
 * Check if the user identifier is already in the URL format, if not, convert to URL format
 * @param  {string}   identifier  user identifier
 * @return {string}   userURL    the user URL
 */
function convertToUserURL(e){
// check if the identifier is already in the url format
if("user://"===e.substring(0,7)){var t=divideURL(e);
//check if the url is well formated
if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return getUserURLFromEmail(e)}function isDataObjectURL(e){var t=["domain-idp","runtime","domain","hyperty"],r=e.split("://"),n=r[0];return-1===t.indexOf(n)}function isLegacy(e){return e.split("@").length>1}function isURL(e){return e.split("/").length>=3}function isUserURL(e){return"user"===divideURL(e).type}function isHypertyURL(e){return"hyperty"===divideURL(e).type}/**
 * get information relative each component configured on runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @return {object}               return an object with all configurations;
 */
function getConfigurationResources(e,t,r){return e[t][r]}/**
 * Build a full url with the runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @param  {string} type          resource to get, like a hyperty name or protocolstub name;
 * @param  {boolean} useFallback  if true the function will check if have a fallback url;
 * @return {string}               partial url to contact the resource;
 */
function buildURL(e,t,r,n){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],u=e[t],a=void 0;if(!u.hasOwnProperty(r))throw Error("The configuration "+(0,i.default)(u,"",2)+" don't have the "+r+" resource you are looking for");var s=u[r];
// console.log(url);
return n?(a=s.prefix+e.domain+s.suffix+n,s.hasOwnProperty("fallback")&&o&&(a=s.fallback.indexOf("%domain%")?s.fallback.replace(/(%domain%)/g,e.domain)+n:s.fallback+n)):a=s.prefix+e.domain+s.suffix,a}/**
 * Generate a Global Unique ID
 *
 * @returns String;
 */
function generateGUID(){function s4(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()}function getUserIdentityDomain(e){var t=divideURL(e),r=t.domain.split("."),n=r.length;return 1==n?r[n-1]:r[n-2]+"."+r[n-1]}/**
 * Check if URL is from a backend service
 * @param  {string} url     URL to be processed
 * @return {boolean}
 */
function isBackendServiceURL(e){var t=divideURL(e),r=t.domain.split("."),n=["domain","global","domain-idp"],i=["registry","msg-node"],o=void 0;return r.length>1&&(o=r[0]),!(!o||!i.indexOf(o))||!!t.type&&-1!==n.indexOf(t.type)}function divideEmail(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function assign(e,t,r){e||(e={}),"string"==typeof t&&(t=parseAttributes(t));for(var n=t.length-1,i=0;i<n;++i){var o=t[i];o in e||(e[o]={}),e=e[o]}e[t[n]]=r}function splitObjectURL(e){var t=e.split("/"),r=t[0]+"//"+t[2]+"/"+t[3],n=t[5],i={url:r,resource:n};return i}function checkAttribute(e){var t=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,r=[],n=[];if(null==e.match(t))n=e.split(".");else{for(var i=void 0;null!==(i=t.exec(e));)
// This is necessary to avoid infinite loops with zero-width matches
i.index===t.lastIndex&&t.lastIndex++,
// The result can be accessed through the `m`-variable.
i.forEach(function(e,t){0===t&&r.push(e)});var o=void 0;r.forEach(function(t){o=e.replace(t,"*-*"),n=o.split(".").map(function(e){return"*-*"===e?t:e})})}return n}function parseAttributes(e){var t=/([0-9a-zA-Z][-\w]*):\/\//g;if(e.includes("://")){var r=e.split(t)[0],n=r.split("."),i=e.replace(r,"");if(e.includes("identity")){var o=i.split("identity.");i=o[0].slice(".",-1),o=o[1].split("."),n.push(i,"identity"),n=n.concat(o)}else n.push(i);return n.filter(Boolean)}return e.split(".")}Object.defineProperty(t,"__esModule",{value:!0});var n=r(108),i=_interopRequireDefault(n),o=r(102),u=_interopRequireDefault(o);t.divideURL=divideURL,t.emptyObject=emptyObject,t.deepClone=deepClone,t.removePathFromURL=removePathFromURL,t.getUserURLFromEmail=getUserURLFromEmail,t.getUserEmailFromURL=getUserEmailFromURL,t.convertToUserURL=convertToUserURL,t.isDataObjectURL=isDataObjectURL,t.isLegacy=isLegacy,t.isURL=isURL,t.isUserURL=isUserURL,t.isHypertyURL=isHypertyURL,t.getConfigurationResources=getConfigurationResources,t.buildURL=buildURL,t.generateGUID=generateGUID,t.getUserIdentityDomain=getUserIdentityDomain,t.isBackendServiceURL=isBackendServiceURL,t.divideEmail=divideEmail,t.assign=assign,t.splitObjectURL=splitObjectURL,t.checkAttribute=checkAttribute,t.parseAttributes=parseAttributes},/* 106 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=function(){function Operators(){(0,i.default)(this,Operators)}return(0,u.default)(Operators,[{key:"and",value:function(e){return e[0]&&e[1]}},{key:"between",value:function(e){var t=parseInt(e[0][0]),r=parseInt(e[0][1]),n=e[1];return r<t&&(n=n<t?n+=2400:n,r+=2400),n>t&&n<r}},{key:"equals",value:function(e){return"*"===String(e[0])||String(e[0])===String(e[1])}},{key:"greaterThan",value:function(e){return e[1]>e[0]}},{key:"in",value:function(e){return e[0].indexOf(e[1])>-1}},{key:"lessThan",value:function(e){return e[1]<e[0]}},{key:"not",value:function(e){return!e[0]}},{key:"or",value:function(e){return e[0]||e[1]}}]),Operators}();t.default=a,e.exports=t.default},/* 107 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=r(106),s=_interopRequireDefault(a),c=function(){/**
  * Creates a new Condition.
  * @class
  * @param  {string}  attribute
  * @param  {string}  operator
  * @param  {*}       params
  */
function Condition(e,t,r){(0,i.default)(this,Condition),this.attribute=e,this.operator=t,this.params=r,this.operators=new s.default}/**
  * Verifies if the condition is applicable to the message. First, the system value that corresponds to the attribute is retrieved; then, that value is compared with the parameter specified in the condition by executing the operator implementation. If the operator is 'in' and the name of a group is given, then the array holding the members of the group is retrieved before the comparison.
  * @param  {Object}    context   environment where the Policy Engine is being used
  * @param  {Object}    message
  */
return(0,u.default)(Condition,[{key:"isApplicable",value:function(e,t){e[this.attribute]={message:t};var r=e[this.attribute],n=void 0;return"in"!==this.operator||Array.isArray(this.params)?this.operators[this.operator]([this.params,r]):(n=e.getGroup(this.params,t.to),this.operators[this.operator]([n,r]))}}]),Condition}();/**
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
t.default=c,e.exports=t.default},/* 108 */
/***/
function(e,t,r){e.exports={default:r(109),__esModule:!0}},/* 109 */
/***/
function(e,t,r){var n=r(0),i=n.JSON||(n.JSON={stringify:JSON.stringify});e.exports=function(e){// eslint-disable-line no-unused-vars
return i.stringify.apply(i,arguments)}},/* 110 */
,/* 111 */
,/* 112 */
,/* 113 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(40),i=_interopRequireDefault(n),o=r(11),u=_interopRequireDefault(o),a=r(12),s=_interopRequireDefault(a),c=r(114),f=_interopRequireDefault(c),l=r(115),p=_interopRequireDefault(l),d=r(116),v=_interopRequireDefault(d),y=r(105),h=function(){/**
  * Creates a Policy Enforcement Point (PEP) instance
  * @param    {Object}    context
  */
function PEP(e){(0,u.default)(this,PEP);var t=this;t.pdp=new p.default(e),t.actionsService=new f.default(e),t.context=e,e.pep=t,
//TODO should be added a trigger to verify when the loadConfigurations is successfully completed
e.loadConfigurations()}/**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
return(0,s.default)(PEP,[{key:"addGUIListeners",value:function(){var e=this;e.context.messageBus.addListener(e.context.pepURL,function(t){var r=t.body.method,n=void 0;if("addToGroup"===r){var i=t.body.params.groupName,o=t.body.params.userEmail;n=e.context.addToGroup(i,o)}else if("createGroup"===r){var u=t.body.params.groupName;n=e.context.createGroup(u)}else if("addPolicy"===r){var a=t.body.params.source,s=t.body.params.key,c=t.body.params.policy,f=t.body.params.combiningAlgorithm;n=e.addPolicy(a,s,c,f)}else if("deleteGroup"===r){var l=t.body.params.groupName;n=e.context.deleteGroup(l)}else if("removePolicy"===r){var p=t.body.params.source,d=t.body.params.key;n=e.removePolicy(p,d)}else if("savePolicies"===r){var v=t.body.params.source;n=e.context.savePolicies(v)}else if("userPolicies"===r)n=e.context.userPolicies;else if("activeUserPolicy"===r){var y=t.body.params.userPolicy;y&&(e.context.activeUserPolicy=y),n=e.context.activeUserPolicy}else if("userPolicy"===r){var h=t.body.params.key;n=e.context.userPolicies[h]}else"saveActivePolicy"===r?n=e.context.saveActivePolicy():"getMyEmails"===r?n=e.context.getMyEmails():"getMyHyperties"===r?n=e.context.getMyHyperties():"groups"===r?n=e.context.groups:"getGroupsNames"===r&&(n=e.context.getGroupsNames());if("removeFromGroup"===r){var _=t.body.params.groupName,b=t.body.params.userEmail;n=e.context.removeFromGroup(_,b)}var m={type:"execute",value:n,code:200},g={id:t.id,type:"response",to:t.from,from:t.to,body:m};e.context.messageBus.postMessage(g)})}},{key:"addPolicy",value:function(e,t,r,n){if(!e)throw new Error("source is not defined");if(!t)throw new Error("key is not defined");switch(void 0===r?r=new v.default(t,[],[],n):r instanceof v.default||(r=new v.default(r.key,r.rules,r.actions,r.combiningAlgorithm)),e){case"SERVICE_PROVIDER":this.context.savePolicies(e,r,t);break;case"USER":this.context.userPolicies[t]=r,this.context.savePolicies(e);break;default:throw Error("Unknown policy source: "+e)}}},{key:"authorise",value:function(e){var t=this;if(!e)throw new Error("message is not defined");if(!e.from)throw new Error("message.from is not defined");if(!e.to)throw new Error("message.to is not defined");if(!e.type)throw new Error("message.type is not defined");return e.body=e.body||{},new i.default(function(r,n){e.body=e.body||{};var i=t,o=void 0;if(i._isToVerify(e)){var u=i._isIncomingMessage(e);i.context.prepareForEvaluation(e,u).then(function(e){o=i.pdp.evaluatePolicies(e,u),"Not Applicable"===o&&(o=i.context.defaultBehaviour,e.body.auth=!1),i.actionsService.enforcePolicies(e,u).then(function(t){for(var a in t)e=t[a],i.context.prepareToForward(e,u,o).then(function(e){if(o)e.body.auth=void 0===e.body.auth||e.body.auth,r(e);else{var t={body:{code:403,description:"Blocked by policy"},from:e.to,to:e.from,type:"response"};n(t)}},function(e){n(e)})},function(e){n(e)})},function(e){n(e)})}else if(o=i.context.defaultBehaviour)e.body.auth=!1,r(e);else{var a={body:{code:403,description:"Blocked by policy"},from:e.to,to:e.from,type:"response"};n(a)}})}},{key:"authoriseSync",value:function(e){var t=void 0;if(e.body=e.body||{},this._isToVerify(e)){var r=this._isIncomingMessage(e);return e=this.context.prepareForEvaluation(e,r),t=this.pdp.evaluatePolicies(e,r),"Not Applicable"===t&&(t=this.context.defaultBehaviour,e.body.auth=!1),this.actionsService.enforcePolicies(e,r),e=this.context.prepareToForward(e,r,t),!!t&&(e.body.auth=void 0===e.body.auth||e.body.auth,!0)}return!!(t=this.context.defaultBehaviour)&&(e.body.auth=!1,!0)}},{key:"_isIncomingMessage",value:function(e){var t=void 0;return t="forward"===e.type?e.body.from:e.body.hasOwnProperty("source")&&e.body.source?e.body.source:e.body.hasOwnProperty("subscriber")&&e.body.subscriber?e.body.subscriber:e.body.hasOwnProperty("reporter")&&e.body.reporter?e.body.reporter:e.from,!this.context.isLocal(t)}},{key:"_isToVerify",value:function(e){var t=["domain","domain-idp","global","hyperty-runtime","runtime"],r=e.from.split("://"),n=r[0],i=e.to.split("://"),o=i[0],u=e.from,a=e.to;
// Signalling messages between P2P Stubs don't have to be verified. FFS
// hack to disable Identity verification for messages coming from legacy domains while solution is not implemented
return e.body&&e.body.source&&(u=e.body.source),e.body&&e.body.subscriber&&(u=e.body.subscriber),-1===u.indexOf("/p2phandler/")&&-1===u.indexOf("/p2prequester/")&&-1===a.indexOf("/p2phandler/")&&-1===a.indexOf("/p2prequester/")&&(!this.context.isInterworkingProtoStub(u)&&(!(e.from===n||e.to===o||"read"===e.type||"response"===e.type||(0,y.isHypertyURL)(e.from)&&"delete"===e.type)&&(-1===t.indexOf(n)||-1===t.indexOf(o))))}},{key:"removePolicy",value:function(e,t){if(!e)throw new Error("source is not defined");if("*"!==e&&!t)throw new Error("key is not defined");switch(e){case"*":this.context.serviceProviderPolicy={},this.context.userPolicies={},this.context.activeUserPolicy=void 0,this.context.savePolicies("USER"),this.context.savePolicies("SERVICE_PROVIDER"),this.context.saveActivePolicy();break;case"SERVICE_PROVIDER":delete this.context.serviceProviderPolicy[t],this.context.savePolicies();break;case"USER":delete this.context.userPolicies[t],t===this.context.activeUserPolicy&&(this.context.activeUserPolicy=void 0,this.context.saveActivePolicy()),this.context.savePolicies("USER");break;default:throw Error("Unknown policy source: "+e)}}},{key:"messageBus",get:function(){return this.context.messageBus},set:function(e){var t=this;t.context.messageBus=e,t.addGUIListeners()}}]),PEP}();t.default=h,e.exports=t.default},/* 114 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(40),i=_interopRequireDefault(n),o=r(11),u=_interopRequireDefault(o),a=r(12),s=_interopRequireDefault(a),c=function(){function ActionsService(e){(0,u.default)(this,ActionsService),this.context=e}return(0,s.default)(ActionsService,[{key:"enforcePolicies",value:function(e,t){var r=this;return new i.default(function(n,i){var o=r.context.getPolicies(e,t);void 0!==o?void 0!==o.serviceProviderPolicy?o.serviceProviderPolicy.enforceActions(r.context,e).then(function(e){n(e)},function(e){i(e)}):void 0!==o.userPolicy?o.userPolicy.enforceActions(r.context,e).then(function(e){n(e)},function(e){i(e)}):n([e]):n([e])})}},{key:"forwardToID",value:function(e,t){var r=this;if(!r.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new i.default(function(n,i){if(r.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to){"runtime"!==e.to.split("://")[0]?r.context.runtimeRegistry.discoverHypertyPerUser(t).then(function(t){e.to=t.hypertyURL,e.body.via=void 0,n(e),r.context.runtimeRegistry._messageBus.postMessage(e)},function(e){i(e)}):n(e)}else n(e)})}},{key:"forwardToHyperty",value:function(e,t){var r=this;if(!r.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new i.default(function(n){if(r.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to){"runtime"!==e.to.split("://")[0]?(e.to=t,e.body.via=void 0,n(e),r.context.runtimeRegistry._messageBus.postMessage(e)):n(e)}else n(e)})}},{key:"sendAutomaticMessage",value:function(e,t){var r=this;return new i.default(function(n){var i={from:e.to,to:e.from,body:{value:t},type:e.type};n(e),r.context.runtimeRegistry._messageBus.postMessage(i)})}}]),ActionsService}();t.default=c,e.exports=t.default},/* 115 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=r(106),s=_interopRequireDefault(a),c=function(){function PDP(e){(0,i.default)(this,PDP),this.context=e,this.operators=new s.default}return(0,u.default)(PDP,[{key:"evaluatePolicies",value:function(e,t){var r=this.context.getPolicies(e,t),n="Not Applicable";if(void 0!==r&&((n=this.evaluatePolicy(e,r.serviceProviderPolicy,t))||"Not Applicable"===n)){var i=this.evaluatePolicy(e,r.userPolicy,t);"Not Applicable"!==i&&(n=i)}return n}},{key:"evaluatePolicy",value:function(e,t,r){var n="Not Applicable";return t&&(n=t.evaluateRules(this.context,e,r)),n}}]),PDP}();t.default=c,e.exports=t.default},/* 116 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(40),i=_interopRequireDefault(n),o=r(11),u=_interopRequireDefault(o),a=r(12),s=_interopRequireDefault(a),c=r(117),f=_interopRequireDefault(c),l=r(118),p=_interopRequireDefault(l),d=r(119),v=_interopRequireDefault(d),y=r(120),h=_interopRequireDefault(y),_=function(){function Policy(e,t,r,n){if((0,u.default)(this,Policy),!e)throw new Error("key is not defined");if(!r)throw new Error("actions are not defined");this.actions=r,this.key=e,this._setRules(t),this._setCombiningAlgorithm(n)}return(0,s.default)(Policy,[{key:"addAction",value:function(e,t){this.actions.push({method:e,param:t})}},{key:"createRule",value:function(e,t,r,n,i){void 0===i&&(i=this.getLastPriority()+1);var o=new h.default(e,t,r,n,i);this.rules.push(o)}},{key:"deleteRule",value:function(e){var t=this.rules.indexOf(e);this.rules.splice(t,1)}},{key:"enforceActions",value:function(e,t){var r=this;return new i.default(function(n,o){var u=[];if(0!==r.actions.length){for(var a in r.actions){var s=e.pep.actionsService[r.actions[a].method](t,r.actions[a].param);u.push(s)}i.default.all(u).then(function(e){n(e)},function(e){o(e)})}else n([t])})}},{key:"evaluateRules",value:function(e,t,r){var n=[];for(var i in this.rules)n.push(this.rules[i].evaluate(e,t,r));return this.combiningAlgorithm.combine(n)}},{key:"getLastPriority",value:function(){var e=[];if(0!==this.rules.length){for(var t in this.rules)e.push(this.rules[t].priority);return Math.max.apply(Math,e)}return-1}},{key:"getRuleByPriority",value:function(e){for(var t in this.rules)if(String(this.rules[t].priority)===String(e))return this.rules[t];throw Error("Rule with priority "+e+" does not exist!")}},{key:"_setCombiningAlgorithm",value:function(e){switch(e||(e="blockOverrides"),e){case"blockOverrides":this.combiningAlgorithm=new p.default;break;case"allowOverrides":this.combiningAlgorithm=new f.default;break;case"firstApplicable":this.combiningAlgorithm=new v.default;break;default:throw Error("Unknown algorithm: "+e)}}},{key:"_setRules",value:function(e){this.rules=[];for(var t in e){var r=e[t];void 0===r.priority&&(r.priority=this.getLastPriority()+1),r instanceof h.default||(r=new h.default(r.decision,r.condition,r.scope,r.target,r.priority)),this.rules.push(r)}}},{key:"sortRules",value:function(){return this.rules.sort(function(e,t){var r=e.priority,n=t.priority;return r<n?-1:r>n?1:0})}}]),Policy}();t.default=_,e.exports=t.default},/* 117 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=function(){function AllowOverrides(){(0,i.default)(this,AllowOverrides)}return(0,u.default)(AllowOverrides,[{key:"combine",/**
    * Given an array of individual authorization decisions, prioritizes a positive one.
    * @param    {boolean[]}   decisions
    * @returns  {boolean}
    */
value:function(e){return-1!==e.indexOf(!0)||-1===e.indexOf(!1)&&"Not Applicable"}}]),AllowOverrides}();t.default=a,e.exports=t.default},/* 118 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=function(){function BlockOverrides(){(0,i.default)(this,BlockOverrides)}return(0,u.default)(BlockOverrides,[{key:"combine",/**
    * Given an array of individual authorisation decisions, prioritises a negative one.
    * @param    {boolean[]}   decisions
    * @returns  {boolean}
    */
value:function(e){return-1===e.indexOf(!1)&&(-1!==e.indexOf(!0)||"Not Applicable")}}]),BlockOverrides}();t.default=a,e.exports=t.default},/* 119 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=function(){function FirstApplicable(){(0,i.default)(this,FirstApplicable)}return(0,u.default)(FirstApplicable,[{key:"combine",/**
    * Given an array of individual authorisation decisions, returns the first one different from 'Not Applicable', either positive or negative.
    * @param    {boolean[]}     decisions
    * @returns  {boolean}
    */
value:function(e){for(var t in e)if("Not Applicable"!==e[t])return e[t];return"Not Applicable"}}]),FirstApplicable}();t.default=a,e.exports=t.default},/* 120 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=r(121),s=_interopRequireDefault(a),c=r(107),f=_interopRequireDefault(c),l=r(105),p=function(){function Rule(e,t,r,n,o){(0,i.default)(this,Rule),this.decision=e,this.setCondition(t),this.priority=o,this.scope=r,this.target=n}return(0,u.default)(Rule,[{key:"setCondition",value:function(e){if(e instanceof f.default||e instanceof s.default||e instanceof s.default)this.condition=e;else{switch(e.attribute){case"subscription":this.condition=new s.default(e.attribute,e.operator,e.params);break;case void 0:this.condition=new s.default(e);break;default:this.condition=new f.default(e.attribute,e.operator,e.params)}}}},{key:"evaluate",value:function(e,t,r){var n=r?t.to:t.from,i=void 0;switch(this.scope){case"global":break;case"hyperty":if((0,l.isDataObjectURL)(n)){var o=e.runtimeRegistry.getReporterURLSynchonous((0,l.removePathFromURL)(n));void 0!==o&&(i=e.runtimeRegistry.getHypertyName(o))}else"hyperty"===n.split("://")[0]&&(i=e.runtimeRegistry.getHypertyName((0,l.removePathFromURL)(n)));if(i===this.target)break;return"Not Applicable";case"identity":var u=void 0;if((0,l.isDataObjectURL)(n)){var a=e.runtimeRegistry.getReporterURLSynchonous((0,l.removePathFromURL)(n));u=e.runtimeRegistry.getHypertyOwner(a)}else"hyperty"===n.split("://")[0]&&(u=e.runtimeRegistry.getHypertyOwner((0,l.removePathFromURL)(n)));if(void 0!==u&&(u=(0,l.getUserEmailFromURL)(u)),u===this.target)break;return"Not Applicable"}return this.condition.isApplicable(e,t,this.scope,this.target)?this.decision:"Not Applicable"}}]),Rule}();t.default=p,e.exports=t.default},/* 121 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),i=_interopRequireDefault(n),o=r(12),u=_interopRequireDefault(o),a=r(107),s=_interopRequireDefault(a),c=r(106),f=_interopRequireDefault(c),l=r(122),p=_interopRequireDefault(l),d=function(){function AdvancedCondition(e){(0,i.default)(this,AdvancedCondition),this.operators=new f.default,void 0!==e.operators&&(e=e.condition),e=this.buildCondition(e),this.condition=e}return(0,u.default)(AdvancedCondition,[{key:"buildCondition",value:function(e){return Array.isArray(e[1])?e[1]=this.buildCondition(e[1]):"subscription"===e[1].attribute?e[1]=new p.default(e[1].attribute,e[1].operator,e[1].params):e[1]=new s.default(e[1].attribute,e[1].operator,e[1].params),void 0!==e[2]&&(Array.isArray(e[2])?e[2]=this.buildCondition(e[2]):"subscription"===e[2].attribute?e[2]=new p.default(e[2].attribute,e[2].operator,e[2].params):e[2]=new s.default(e[2].attribute,e[2].operator,e[2].params)),e}},{key:"isApplicable",value:function(e,t,r,n,i,o,u){for(i||(i=this.condition[0],o=this.condition[1],u=this.condition[2]);!(o instanceof s.default)&!(o instanceof p.default)&"boolean"!=typeof o;)o=this.isApplicable(e,t,r,n,o[0],o[1],o[2]);if(void 0!==u)for(;!(u instanceof s.default)&!(u instanceof p.default)&"boolean"!=typeof u;)u=this.isApplicable(e,t,r,n,u[0],u[1],u[2]);var a="boolean"==typeof o?o:o.isApplicable(e,t,r,n),c=void 0;return void 0!==u&&(c="boolean"==typeof u?u:u.isApplicable(e,t,r,n)),this.operators[i]([a,c])}}]),AdvancedCondition}();t.default=d,e.exports=t.default},/* 122 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(59),i=_interopRequireDefault(n),o=r(11),u=_interopRequireDefault(o),a=r(12),s=_interopRequireDefault(a),c=r(60),f=_interopRequireDefault(c),l=r(123),p=_interopRequireDefault(l),d=r(61),v=_interopRequireDefault(d),y=r(107),h=_interopRequireDefault(y),_=function(e){/**
  * Creates a new SubscriptionCondition.
  * @class
  * @param  {string}  attribute
  * @param  {string}  operator
  * @param  {*}       params
  */
function SubscriptionCondition(e,t,r){return(0,u.default)(this,SubscriptionCondition),(0,f.default)(this,(SubscriptionCondition.__proto__||(0,i.default)(SubscriptionCondition)).call(this,e,t,r))}/**
  * Verifies if the subscription condition is applicable to the message. First, verifies if the message is of the subscription type; second, verifies if the message is from a remote runtime to guarantee that the subscription is being validated in the destination runtime; third, verifies if the subscription preference is met.
  * @param  {Object}    context   environment where the Policy Engine is being used
  * @param  {Object}    message
  */
return(0,v.default)(SubscriptionCondition,e),(0,s.default)(SubscriptionCondition,[{key:"isApplicable",value:function(e,t){return!!("subscribe"===t.type&e.isFromRemoteSM(t.from))&&(0,p.default)(SubscriptionCondition.prototype.__proto__||(0,i.default)(SubscriptionCondition.prototype),"isApplicable",this).call(this,e,t)}}]),SubscriptionCondition}(h.default);/**
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
t.default=_,e.exports=t.default},/* 123 */
/***/
function(e,t,r){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var n=r(59),i=_interopRequireDefault(n),o=r(124),u=_interopRequireDefault(o);t.default=function get(e,t,r){null===e&&(e=Function.prototype);var n=(0,u.default)(e,t);if(void 0===n){var o=(0,i.default)(e);return null===o?void 0:get(o,t,r)}if("value"in n)return n.value;var a=n.get;if(void 0!==a)return a.call(r)}},/* 124 */
/***/
function(e,t,r){e.exports={default:r(125),__esModule:!0}},/* 125 */
/***/
function(e,t,r){r(126);var n=r(0).Object;e.exports=function(e,t){return n.getOwnPropertyDescriptor(e,t)}},/* 126 */
/***/
function(e,t,r){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var n=r(6),i=r(39).f;r(38)("getOwnPropertyDescriptor",function(){return function(e,t){return i(n(e),t)}})}])});