// version: 0.8.1
// date: Wed Jul 12 2017 12:05:41 GMT+0100 (WEST)
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
// date: Wed Jul 12 2017 12:05:41 GMT+0100 (WEST)
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("sandbox",[],t):"object"==typeof exports?exports.sandbox=t():e.sandbox=t()}(this,function(){/******/
return function(e){/******/
/******/
// The require function
/******/
function __webpack_require__(n){/******/
/******/
// Check if module is in cache
/******/
if(t[n])/******/
return t[n].exports;/******/
// Create a new module (and put it into the cache)
/******/
var r=t[n]={/******/
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
return e[n].call(r.exports,r,r.exports,__webpack_require__),r.l=!0,r.exports}// webpackBootstrap
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
return __webpack_require__.m=e,__webpack_require__.c=t,__webpack_require__.d=function(e,t,n){/******/
__webpack_require__.o(e,t)||/******/
Object.defineProperty(e,t,{/******/
configurable:!1,/******/
enumerable:!0,/******/
get:n})},__webpack_require__.n=function(e){/******/
var t=e&&e.__esModule?/******/
function(){return e.default}:/******/
function(){return e};/******/
/******/
return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=128)}([/* 0 */
/***/
function(e,t){var n=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(e,t){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
/***/
function(e,t,n){var r=n(28)("wks"),o=n(19),i=n(1).Symbol,u="function"==typeof i;(e.exports=function(e){return r[e]||(r[e]=u&&i[e]||(u?i:o)("Symbol."+e))}).store=r},/* 3 */
/***/
function(e,t,n){
// Thank's IE8 for his funny defineProperty
e.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 4 */
/***/
function(e,t,n){var r=n(5),o=n(35),i=n(26),u=Object.defineProperty;t.f=n(3)?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return u(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},/* 5 */
/***/
function(e,t,n){var r=n(10);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},/* 6 */
/***/
function(e,t,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(53),o=n(21);e.exports=function(e){return r(o(e))}},/* 7 */
/***/
function(e,t,n){var r=n(1),o=n(0),i=n(14),u=n(8),s=function(e,t,n){var c,f,a,l=e&s.F,p=e&s.G,d=e&s.S,_=e&s.P,v=e&s.B,y=e&s.W,h=p?o:o[t]||(o[t]={}),b=h.prototype,m=p?r:d?r[t]:(r[t]||{}).prototype;p&&(n=t);for(c in n)
// contains in native
(f=!l&&m&&void 0!==m[c])&&c in h||(
// export native or passed
a=f?m[c]:n[c],
// prevent global pollution for namespaces
h[c]=p&&"function"!=typeof m[c]?n[c]:v&&f?i(a,r):y&&m[c]==a?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(a):_&&"function"==typeof a?i(Function.call,a):a,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
_&&((h.virtual||(h.virtual={}))[c]=a,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
e&s.R&&b&&!b[c]&&u(b,c,a)))};
// type bitmap
s.F=1,// forced
s.G=2,// global
s.S=4,// static
s.P=8,// proto
s.B=16,// bind
s.W=32,// wrap
s.U=64,// safe
s.R=128,// real proto method for `library` 
e.exports=s},/* 8 */
/***/
function(e,t,n){var r=n(4),o=n(18);e.exports=n(3)?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},/* 9 */
/***/
function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},/* 10 */
/***/
function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},/* 11 */
/***/
function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(e,t,n){"use strict";t.__esModule=!0;var r=n(56),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}()},/* 13 */
/***/
function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},/* 14 */
/***/
function(e,t,n){
// optional / simple context binding
var r=n(24);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},/* 15 */
/***/
function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},/* 16 */
/***/
function(e,t,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(36),o=n(29);e.exports=Object.keys||function(e){return r(e,o)}},/* 17 */
/***/
function(e,t){e.exports={}},/* 18 */
/***/
function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},/* 19 */
/***/
function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},/* 20 */
/***/
function(e,t){
// 7.1.4 ToInteger
var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},/* 21 */
/***/
function(e,t){
// 7.2.1 RequireObjectCoercible(argument)
e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},/* 22 */
/***/
function(e,t){e.exports=!0},/* 23 */
/***/
function(e,t,n){var r=n(4).f,o=n(9),i=n(2)("toStringTag");e.exports=function(e,t,n){e&&!o(e=n?e:e.prototype,i)&&r(e,i,{configurable:!0,value:t})}},/* 24 */
/***/
function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},/* 25 */
/***/
function(e,t,n){var r=n(10),o=n(1).document,i=r(o)&&r(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},/* 26 */
/***/
function(e,t,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
e.exports=function(e,t){if(!r(e))return e;var n,o;if(t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;if("function"==typeof(n=e.valueOf)&&!r(o=n.call(e)))return o;if(!t&&"function"==typeof(n=e.toString)&&!r(o=n.call(e)))return o;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(e,t,n){var r=n(28)("keys"),o=n(19);e.exports=function(e){return r[e]||(r[e]=o(e))}},/* 28 */
/***/
function(e,t,n){var r=n(1),o=r["__core-js_shared__"]||(r["__core-js_shared__"]={});e.exports=function(e){return o[e]||(o[e]={})}},/* 29 */
/***/
function(e,t){
// IE 8- don't enum bug keys
e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(e,t,n){
// 7.1.13 ToObject(argument)
var r=n(21);e.exports=function(e){return Object(r(e))}},/* 31 */
/***/
function(e,t,n){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var r=n(5),o=n(65),i=n(29),u=n(27)("IE_PROTO"),s=function(){},c=function(){
// Thrash, waste and sodomy: IE GC bug
var e,t=n(25)("iframe"),r=i.length;for(t.style.display="none",n(45).appendChild(t),t.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),c=e.F;r--;)delete c.prototype[i[r]];return c()};e.exports=Object.create||function(e,t){var n;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==e?(s.prototype=r(e),n=new s,s.prototype=null,n[u]=e):n=c(),void 0===t?n:o(n,t)}},/* 32 */
/***/
function(e,t,n){t.f=n(2)},/* 33 */
/***/
function(e,t,n){var r=n(1),o=n(0),i=n(22),u=n(32),s=n(4).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==e.charAt(0)||e in t||s(t,e,{value:u.f(e)})}},/* 34 */
/***/
function(e,t){t.f={}.propertyIsEnumerable},/* 35 */
/***/
function(e,t,n){e.exports=!n(3)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 36 */
/***/
function(e,t,n){var r=n(9),o=n(6),i=n(54)(!1),u=n(27)("IE_PROTO");e.exports=function(e,t){var n,s=o(e),c=0,f=[];for(n in s)n!=u&&r(s,n)&&f.push(n);
// Don't enum bug & hidden keys
for(;t.length>c;)r(s,n=t[c++])&&(~i(f,n)||f.push(n));return f}},/* 37 */
/***/
function(e,t,n){
// 7.1.15 ToLength
var r=n(20),o=Math.min;e.exports=function(e){return e>0?o(r(e),9007199254740991):0}},/* 38 */
/***/
function(e,t,n){
// most Object methods by ES6 should accept primitives
var r=n(7),o=n(0),i=n(13);e.exports=function(e,t){var n=(o.Object||{})[e]||Object[e],u={};u[e]=t(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},/* 39 */
/***/
function(e,t,n){var r=n(34),o=n(18),i=n(6),u=n(26),s=n(9),c=n(35),f=Object.getOwnPropertyDescriptor;t.f=n(3)?f:function(e,t){if(e=i(e),t=u(t,!0),c)try{return f(e,t)}catch(e){}if(s(e,t))return o(!r.f.call(e,t),e[t])}},/* 40 */
/***/
function(e,t,n){e.exports={default:n(62),__esModule:!0}},/* 41 */
/***/
function(e,t){},/* 42 */
/***/
function(e,t,n){"use strict";var r=n(63)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
n(43)(String,"String",function(e){this._t=String(e),// target
this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},/* 43 */
/***/
function(e,t,n){"use strict";var r=n(22),o=n(7),i=n(44),u=n(8),s=n(9),c=n(17),f=n(64),a=n(23),l=n(46),p=n(2)("iterator"),d=!([].keys&&"next"in[].keys()),_=function(){return this};e.exports=function(e,t,n,v,y,h,b){f(n,t,v);var m,x,g,O=function(e){if(!d&&e in k)return k[e];switch(e){case"keys":case"values":return function(){return new n(this,e)}}return function(){return new n(this,e)}},w=t+" Iterator",S="values"==y,M=!1,k=e.prototype,j=k[p]||k["@@iterator"]||y&&k[y],P=j||O(y),R=y?S?O("entries"):P:void 0,D="Array"==t?k.entries||j:j;if(
// Fix native
D&&(g=l(D.call(new e)))!==Object.prototype&&(
// Set @@toStringTag to native iterators
a(g,w,!0),
// fix for some old engines
r||s(g,p)||u(g,p,_)),
// fix Array#{values, @@iterator}.name in V8 / FF
S&&j&&"values"!==j.name&&(M=!0,P=function(){return j.call(this)}),
// Define iterator
r&&!b||!d&&!M&&k[p]||u(k,p,P),
// Plug for library
c[t]=P,c[w]=_,y)if(m={values:S?P:O("values"),keys:h?P:O("keys"),entries:R},b)for(x in m)x in k||i(k,x,m[x]);else o(o.P+o.F*(d||M),t,m);return m}},/* 44 */
/***/
function(e,t,n){e.exports=n(8)},/* 45 */
/***/
function(e,t,n){e.exports=n(1).document&&document.documentElement},/* 46 */
/***/
function(e,t,n){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var r=n(9),o=n(30),i=n(27)("IE_PROTO"),u=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),r(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?u:null}},/* 47 */
/***/
function(e,t,n){n(66);for(var r=n(1),o=n(8),i=n(17),u=n(2)("toStringTag"),s=["NodeList","DOMTokenList","MediaList","StyleSheetList","CSSRuleList"],c=0;c<5;c++){var f=s[c],a=r[f],l=a&&a.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},/* 48 */
/***/
function(e,t,n){
// getting tag from 19.1.3.6 Object.prototype.toString()
var r=n(15),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,n,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=u(t=Object(e),o))?n:i?r(t):"Object"==(s=r(t))&&"function"==typeof t.callee?"Arguments":s}},/* 49 */
/***/
function(e,t,n){var r,o,i,u=n(14),s=n(76),c=n(45),f=n(25),a=n(1),l=a.process,p=a.setImmediate,d=a.clearImmediate,_=a.MessageChannel,v=0,y={},h=function(){var e=+this;if(y.hasOwnProperty(e)){var t=y[e];delete y[e],t()}},b=function(e){h.call(e.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&d||(p=function(e){for(var t=[],n=1;arguments.length>n;)t.push(arguments[n++]);return y[++v]=function(){s("function"==typeof e?e:Function(e),t)},r(v),v},d=function(e){delete y[e]},
// Node.js 0.8-
"process"==n(15)(l)?r=function(e){l.nextTick(u(h,e,1))}:_?(o=new _,i=o.port2,o.port1.onmessage=b,r=u(i.postMessage,i,1)):a.addEventListener&&"function"==typeof postMessage&&!a.importScripts?(r=function(e){a.postMessage(e+"","*")},a.addEventListener("message",b,!1)):r="onreadystatechange"in f("script")?function(e){c.appendChild(f("script")).onreadystatechange=function(){c.removeChild(this),h.call(e)}}:function(e){setTimeout(u(h,e,1),0)}),e.exports={set:p,clear:d}},/* 50 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=n(83),o=_interopRequireDefault(r),i=n(85),u=_interopRequireDefault(i),s="function"==typeof u.default&&"symbol"==typeof o.default?function(e){return typeof e}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":typeof e};t.default="function"==typeof u.default&&"symbol"===s(o.default)?function(e){return void 0===e?"undefined":s(e)}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":void 0===e?"undefined":s(e)}},/* 51 */
/***/
function(e,t){t.f=Object.getOwnPropertySymbols},/* 52 */
/***/
function(e,t,n){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var r=n(36),o=n(29).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,o)}},/* 53 */
/***/
function(e,t,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(15);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},/* 54 */
/***/
function(e,t,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(6),o=n(37),i=n(55);e.exports=function(e){return function(t,n,u){var s,c=r(t),f=o(c.length),a=i(u,f);
// Array#includes uses SameValueZero equality algorithm
if(e&&n!=n){for(;f>a;)if((s=c[a++])!=s)return!0}else for(;f>a;a++)if((e||a in c)&&c[a]===n)return e||a||0;return!e&&-1}}},/* 55 */
/***/
function(e,t,n){var r=n(20),o=Math.max,i=Math.min;e.exports=function(e,t){return e=r(e),e<0?o(e+t,0):i(e,t)}},/* 56 */
/***/
function(e,t,n){e.exports={default:n(57),__esModule:!0}},/* 57 */
/***/
function(e,t,n){n(58);var r=n(0).Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},/* 58 */
/***/
function(e,t,n){var r=n(7);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(3),"Object",{defineProperty:n(4).f})},/* 59 */
/***/
function(e,t,n){e.exports={default:n(81),__esModule:!0}},/* 60 */
/***/
function(e,t,n){"use strict";t.__esModule=!0;var r=n(50),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}},/* 61 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=n(95),o=_interopRequireDefault(r),i=n(99),u=_interopRequireDefault(i),s=n(50),c=_interopRequireDefault(s);t.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,c.default)(t)));e.prototype=(0,u.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(o.default?(0,o.default)(e,t):e.__proto__=t)}},/* 62 */
/***/
function(e,t,n){n(41),n(42),n(47),n(69),e.exports=n(0).Promise},/* 63 */
/***/
function(e,t,n){var r=n(20),o=n(21);
// true  -> String#at
// false -> String#codePointAt
e.exports=function(e){return function(t,n){var i,u,s=String(o(t)),c=r(n),f=s.length;return c<0||c>=f?e?"":void 0:(i=s.charCodeAt(c),i<55296||i>56319||c+1===f||(u=s.charCodeAt(c+1))<56320||u>57343?e?s.charAt(c):i:e?s.slice(c,c+2):u-56320+(i-55296<<10)+65536)}}},/* 64 */
/***/
function(e,t,n){"use strict";var r=n(31),o=n(18),i=n(23),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
n(8)(u,n(2)("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(u,{next:o(1,n)}),i(e,t+" Iterator")}},/* 65 */
/***/
function(e,t,n){var r=n(4),o=n(5),i=n(16);e.exports=n(3)?Object.defineProperties:function(e,t){o(e);for(var n,u=i(t),s=u.length,c=0;s>c;)r.f(e,n=u[c++],t[n]);return e}},/* 66 */
/***/
function(e,t,n){"use strict";var r=n(67),o=n(68),i=n(17),u=n(6);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
e.exports=n(43)(Array,"Array",function(e,t){this._t=u(e),// target
this._i=0,// next index
this._k=t},function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,n):"values"==t?o(0,e[n]):o(0,[n,e[n]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
i.Arguments=i.Array,r("keys"),r("values"),r("entries")},/* 67 */
/***/
function(e,t){e.exports=function(){}},/* 68 */
/***/
function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},/* 69 */
/***/
function(e,t,n){"use strict";var r,o,i,u=n(22),s=n(1),c=n(14),f=n(48),a=n(7),l=n(10),p=n(24),d=n(70),_=n(71),v=n(75),y=n(49).set,h=n(77)(),b=s.TypeError,m=s.process,x=s.Promise,m=s.process,g="process"==f(m),O=function(){},w=!!function(){try{
// correct subclassing with @@species support
var e=x.resolve(1),t=(e.constructor={})[n(2)("species")]=function(e){e(O,O)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(g||"function"==typeof PromiseRejectionEvent)&&e.then(O)instanceof t}catch(e){}}(),S=function(e,t){
// with library wrapper special case
return e===t||e===x&&t===i},M=function(e){var t;return!(!l(e)||"function"!=typeof(t=e.then))&&t},k=function(e){return S(x,e)?new j(e):new o(e)},j=o=function(e){var t,n;this.promise=new e(function(e,r){if(void 0!==t||void 0!==n)throw b("Bad Promise constructor");t=e,n=r}),this.resolve=p(t),this.reject=p(n)},P=function(e){try{e()}catch(e){return{error:e}}},R=function(e,t){if(!e._n){e._n=!0;var n=e._c;h(function(){for(var r=e._v,o=1==e._s,i=0;n.length>i;)!function(t){var n,i,u=o?t.ok:t.fail,s=t.resolve,c=t.reject,f=t.domain;try{u?(o||(2==e._h&&q(e),e._h=1),!0===u?n=r:(f&&f.enter(),n=u(r),f&&f.exit()),n===t.promise?c(b("Promise-chain cycle")):(i=M(n))?i.call(n,s,c):s(n)):c(r)}catch(e){c(e)}}(n[i++]);// variable length - can't use forEach
e._c=[],e._n=!1,t&&!e._h&&D(e)})}},D=function(e){y.call(s,function(){var t,n,r,o=e._v;if(E(e)&&(t=P(function(){g?m.emit("unhandledRejection",o,e):(n=s.onunhandledrejection)?n({promise:e,reason:o}):(r=s.console)&&r.error&&r.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
e._h=g||E(e)?2:1),e._a=void 0,t)throw t.error})},E=function(e){if(1==e._h)return!1;for(var t,n=e._a||e._c,r=0;n.length>r;)if(t=n[r++],t.fail||!E(t.promise))return!1;return!0},q=function(e){y.call(s,function(){var t;g?m.emit("rejectionHandled",e):(t=s.onrejectionhandled)&&t({promise:e,reason:e._v})})},A=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,// unwrap
t._v=e,t._s=2,t._a||(t._a=t._c.slice()),R(t,!0))},T=function(e){var t,n=this;if(!n._d){n._d=!0,n=n._w||n;// unwrap
try{if(n===e)throw b("Promise can't be resolved itself");(t=M(e))?h(function(){var r={_w:n,_d:!1};// wrap
try{t.call(e,c(T,r,1),c(A,r,1))}catch(e){A.call(r,e)}}):(n._v=e,n._s=1,R(n,!1))}catch(e){A.call({_w:n,_d:!1},e)}}};
// constructor polyfill
w||(
// 25.4.3.1 Promise(executor)
x=function(e){d(this,x,"Promise","_h"),p(e),r.call(this);try{e(c(T,this,1),c(A,this,1))}catch(e){A.call(this,e)}},r=function(e){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},r.prototype=n(78)(x.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(e,t){var n=k(v(this,x));return n.ok="function"!=typeof e||e,n.fail="function"==typeof t&&t,n.domain=g?m.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&R(this,!1),n.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(e){return this.then(void 0,e)}}),j=function(){var e=new r;this.promise=e,this.resolve=c(T,e,1),this.reject=c(A,e,1)}),a(a.G+a.W+a.F*!w,{Promise:x}),n(23)(x,"Promise"),n(79)("Promise"),i=n(0).Promise,
// statics
a(a.S+a.F*!w,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(e){var t=k(this);return(0,t.reject)(e),t.promise}}),a(a.S+a.F*(u||!w),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(e){
// instanceof instead of internal slot check because we should fix it without replacement native Promise core
if(e instanceof x&&S(e.constructor,this))return e;var t=k(this);return(0,t.resolve)(e),t.promise}}),a(a.S+a.F*!(w&&n(80)(function(e){x.all(e).catch(O)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(e){var t=this,n=k(t),r=n.resolve,o=n.reject,i=P(function(){var n=[],i=0,u=1;_(e,!1,function(e){var s=i++,c=!1;n.push(void 0),u++,t.resolve(e).then(function(e){c||(c=!0,n[s]=e,--u||r(n))},o)}),--u||r(n)});return i&&o(i.error),n.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(e){var t=this,n=k(t),r=n.reject,o=P(function(){_(e,!1,function(e){t.resolve(e).then(n.resolve,r)})});return o&&r(o.error),n.promise}})},/* 70 */
/***/
function(e,t){e.exports=function(e,t,n,r){if(!(e instanceof t)||void 0!==r&&r in e)throw TypeError(n+": incorrect invocation!");return e}},/* 71 */
/***/
function(e,t,n){var r=n(14),o=n(72),i=n(73),u=n(5),s=n(37),c=n(74),f={},a={},t=e.exports=function(e,t,n,l,p){var d,_,v,y,h=p?function(){return e}:c(e),b=r(n,l,t?2:1),m=0;if("function"!=typeof h)throw TypeError(e+" is not iterable!");
// fast case for arrays with default iterator
if(i(h)){for(d=s(e.length);d>m;m++)if((y=t?b(u(_=e[m])[0],_[1]):b(e[m]))===f||y===a)return y}else for(v=h.call(e);!(_=v.next()).done;)if((y=o(v,b,_.value,t))===f||y===a)return y};t.BREAK=f,t.RETURN=a},/* 72 */
/***/
function(e,t,n){
// call something on iterator step with safe closing on error
var r=n(5);e.exports=function(e,t,n,o){try{return o?t(r(n)[0],n[1]):t(n)}catch(t){var i=e.return;throw void 0!==i&&r(i.call(e)),t}}},/* 73 */
/***/
function(e,t,n){
// check on default Array iterator
var r=n(17),o=n(2)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||i[o]===e)}},/* 74 */
/***/
function(e,t,n){var r=n(48),o=n(2)("iterator"),i=n(17);e.exports=n(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[r(e)]}},/* 75 */
/***/
function(e,t,n){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var r=n(5),o=n(24),i=n(2)("species");e.exports=function(e,t){var n,u=r(e).constructor;return void 0===u||void 0==(n=r(u)[i])?t:o(n)}},/* 76 */
/***/
function(e,t){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
e.exports=function(e,t,n){var r=void 0===n;switch(t.length){case 0:return r?e():e.call(n);case 1:return r?e(t[0]):e.call(n,t[0]);case 2:return r?e(t[0],t[1]):e.call(n,t[0],t[1]);case 3:return r?e(t[0],t[1],t[2]):e.call(n,t[0],t[1],t[2]);case 4:return r?e(t[0],t[1],t[2],t[3]):e.call(n,t[0],t[1],t[2],t[3])}return e.apply(n,t)}},/* 77 */
/***/
function(e,t,n){var r=n(1),o=n(49).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,s=r.Promise,c="process"==n(15)(u);e.exports=function(){var e,t,n,f=function(){var r,o;for(c&&(r=u.domain)&&r.exit();e;){o=e.fn,e=e.next;try{o()}catch(r){throw e?n():t=void 0,r}}t=void 0,r&&r.enter()};
// Node.js
if(c)n=function(){u.nextTick(f)};else if(i){var a=!0,l=document.createTextNode("");new i(f).observe(l,{characterData:!0}),// eslint-disable-line no-new
n=function(){l.data=a=!a}}else if(s&&s.resolve){var p=s.resolve();n=function(){p.then(f)}}else n=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(r,f)};return function(r){var o={fn:r,next:void 0};t&&(t.next=o),e||(e=o,n()),t=o}}},/* 78 */
/***/
function(e,t,n){var r=n(8);e.exports=function(e,t,n){for(var o in t)n&&e[o]?e[o]=t[o]:r(e,o,t[o]);return e}},/* 79 */
/***/
function(e,t,n){"use strict";var r=n(1),o=n(0),i=n(4),u=n(3),s=n(2)("species");e.exports=function(e){var t="function"==typeof o[e]?o[e]:r[e];u&&t&&!t[s]&&i.f(t,s,{configurable:!0,get:function(){return this}})}},/* 80 */
/***/
function(e,t,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},e(i)}catch(e){}return n}},/* 81 */
/***/
function(e,t,n){n(82),e.exports=n(0).Object.getPrototypeOf},/* 82 */
/***/
function(e,t,n){
// 19.1.2.9 Object.getPrototypeOf(O)
var r=n(30),o=n(46);n(38)("getPrototypeOf",function(){return function(e){return o(r(e))}})},/* 83 */
/***/
function(e,t,n){e.exports={default:n(84),__esModule:!0}},/* 84 */
/***/
function(e,t,n){n(42),n(47),e.exports=n(32).f("iterator")},/* 85 */
/***/
function(e,t,n){e.exports={default:n(86),__esModule:!0}},/* 86 */
/***/
function(e,t,n){n(87),n(41),n(93),n(94),e.exports=n(0).Symbol},/* 87 */
/***/
function(e,t,n){"use strict";
// ECMAScript 6 symbols shim
var r=n(1),o=n(9),i=n(3),u=n(7),s=n(44),c=n(88).KEY,f=n(13),a=n(28),l=n(23),p=n(19),d=n(2),_=n(32),v=n(33),y=n(89),h=n(90),b=n(91),m=n(5),x=n(6),g=n(26),O=n(18),w=n(31),S=n(92),M=n(39),k=n(4),j=n(16),P=M.f,R=k.f,D=S.f,E=r.Symbol,q=r.JSON,A=q&&q.stringify,T=d("_hidden"),I=d("toPrimitive"),L={}.propertyIsEnumerable,C=a("symbol-registry"),F=a("symbols"),N=a("op-symbols"),B=Object.prototype,W="function"==typeof E,K=r.QObject,G=!K||!K.prototype||!K.prototype.findChild,J=i&&f(function(){return 7!=w(R({},"a",{get:function(){return R(this,"a",{value:7}).a}})).a})?function(e,t,n){var r=P(B,t);r&&delete B[t],R(e,t,n),r&&e!==B&&R(B,t,r)}:R,U=function(e){var t=F[e]=w(E.prototype);return t._k=e,t},z=W&&"symbol"==typeof E.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof E},Y=function(e,t,n){return e===B&&Y(N,t,n),m(e),t=g(t,!0),m(n),o(F,t)?(n.enumerable?(o(e,T)&&e[T][t]&&(e[T][t]=!1),n=w(n,{enumerable:O(0,!1)})):(o(e,T)||R(e,T,O(1,{})),e[T][t]=!0),J(e,t,n)):R(e,t,n)},H=function(e,t){m(e);for(var n,r=h(t=x(t)),o=0,i=r.length;i>o;)Y(e,n=r[o++],t[n]);return e},Q=function(e,t){return void 0===t?w(e):H(w(e),t)},V=function(e){var t=L.call(this,e=g(e,!0));return!(this===B&&o(F,e)&&!o(N,e))&&(!(t||!o(this,e)||!o(F,e)||o(this,T)&&this[T][e])||t)},X=function(e,t){if(e=x(e),t=g(t,!0),e!==B||!o(F,t)||o(N,t)){var n=P(e,t);return!n||!o(F,t)||o(e,T)&&e[T][t]||(n.enumerable=!0),n}},Z=function(e){for(var t,n=D(x(e)),r=[],i=0;n.length>i;)o(F,t=n[i++])||t==T||t==c||r.push(t);return r},$=function(e){for(var t,n=e===B,r=D(n?N:x(e)),i=[],u=0;r.length>u;)!o(F,t=r[u++])||n&&!o(B,t)||i.push(F[t]);return i};
// 19.4.1.1 Symbol([description])
W||(E=function(){if(this instanceof E)throw TypeError("Symbol is not a constructor!");var e=p(arguments.length>0?arguments[0]:void 0),t=function(n){this===B&&t.call(N,n),o(this,T)&&o(this[T],e)&&(this[T][e]=!1),J(this,e,O(1,n))};return i&&G&&J(B,e,{configurable:!0,set:t}),U(e)},s(E.prototype,"toString",function(){return this._k}),M.f=X,k.f=Y,n(52).f=S.f=Z,n(34).f=V,n(51).f=$,i&&!n(22)&&s(B,"propertyIsEnumerable",V,!0),_.f=function(e){return U(d(e))}),u(u.G+u.W+u.F*!W,{Symbol:E});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)d(ee[te++]);for(var ee=j(d.store),te=0;ee.length>te;)v(ee[te++]);u(u.S+u.F*!W,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(e){return o(C,e+="")?C[e]:C[e]=E(e)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(e){if(z(e))return y(C,e);throw TypeError(e+" is not a symbol!")},useSetter:function(){G=!0},useSimple:function(){G=!1}}),u(u.S+u.F*!W,"Object",{
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
q&&u(u.S+u.F*(!W||f(function(){var e=E();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=A([e])||"{}"!=A({a:e})||"{}"!=A(Object(e))})),"JSON",{stringify:function(e){if(void 0!==e&&!z(e)){for(// IE8 returns string on undefined
var t,n,r=[e],o=1;arguments.length>o;)r.push(arguments[o++]);return t=r[1],"function"==typeof t&&(n=t),!n&&b(t)||(t=function(e,t){if(n&&(t=n.call(this,e,t)),!z(t))return t}),r[1]=t,A.apply(q,r)}}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
E.prototype[I]||n(8)(E.prototype,I,E.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(E,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(r.JSON,"JSON",!0)},/* 88 */
/***/
function(e,t,n){var r=n(19)("meta"),o=n(10),i=n(9),u=n(4).f,s=0,c=Object.isExtensible||function(){return!0},f=!n(13)(function(){return c(Object.preventExtensions({}))}),a=function(e){u(e,r,{value:{i:"O"+ ++s,// object ID
w:{}}})},l=function(e,t){
// return primitive with prefix
if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,r)){
// can't set metadata to uncaught frozen object
if(!c(e))return"F";
// not necessary to add metadata
if(!t)return"E";
// add missing metadata
a(e)}return e[r].i},p=function(e,t){if(!i(e,r)){
// can't set metadata to uncaught frozen object
if(!c(e))return!0;
// not necessary to add metadata
if(!t)return!1;
// add missing metadata
a(e)}return e[r].w},d=function(e){return f&&_.NEED&&c(e)&&!i(e,r)&&a(e),e},_=e.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:d}},/* 89 */
/***/
function(e,t,n){var r=n(16),o=n(6);e.exports=function(e,t){for(var n,i=o(e),u=r(i),s=u.length,c=0;s>c;)if(i[n=u[c++]]===t)return n}},/* 90 */
/***/
function(e,t,n){
// all enumerable object keys, includes symbols
var r=n(16),o=n(51),i=n(34);e.exports=function(e){var t=r(e),n=o.f;if(n)for(var u,s=n(e),c=i.f,f=0;s.length>f;)c.call(e,u=s[f++])&&t.push(u);return t}},/* 91 */
/***/
function(e,t,n){
// 7.2.2 IsArray(argument)
var r=n(15);e.exports=Array.isArray||function(e){return"Array"==r(e)}},/* 92 */
/***/
function(e,t,n){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var r=n(6),o=n(52).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(e){try{return o(e)}catch(e){return u.slice()}};e.exports.f=function(e){return u&&"[object Window]"==i.call(e)?s(e):o(r(e))}},/* 93 */
/***/
function(e,t,n){n(33)("asyncIterator")},/* 94 */
/***/
function(e,t,n){n(33)("observable")},/* 95 */
/***/
function(e,t,n){e.exports={default:n(96),__esModule:!0}},/* 96 */
/***/
function(e,t,n){n(97),e.exports=n(0).Object.setPrototypeOf},/* 97 */
/***/
function(e,t,n){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var r=n(7);r(r.S,"Object",{setPrototypeOf:n(98).set})},/* 98 */
/***/
function(e,t,n){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var r=n(10),o=n(5),i=function(e,t){if(o(e),!r(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(e,t,r){try{r=n(14)(Function.call,n(39).f(Object.prototype,"__proto__").set,2),r(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,n){return i(e,n),t?e.__proto__=n:r(e,n),e}}({},!1):void 0),check:i}},/* 99 */
/***/
function(e,t,n){e.exports={default:n(100),__esModule:!0}},/* 100 */
/***/
function(e,t,n){n(101);var r=n(0).Object;e.exports=function(e,t){return r.create(e,t)}},/* 101 */
/***/
function(e,t,n){var r=n(7);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
r(r.S,"Object",{create:n(31)})},/* 102 */
/***/
function(e,t,n){e.exports={default:n(103),__esModule:!0}},/* 103 */
/***/
function(e,t,n){n(104),e.exports=n(0).Object.keys},/* 104 */
/***/
function(e,t,n){
// 19.1.2.14 Object.keys(O)
var r=n(30),o=n(16);n(38)("keys",function(){return function(e){return o(r(e))}})},/* 105 */
,/* 106 */
,/* 107 */
,/* 108 */
,/* 109 */
,/* 110 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(59),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),f=n(60),a=_interopRequireDefault(f),l=n(61),p=_interopRequireDefault(l),d=n(111),_=_interopRequireDefault(d),v=function(e){function MiniBus(){return(0,u.default)(this,MiniBus),(0,a.default)(this,(MiniBus.__proto__||(0,o.default)(MiniBus)).call(this))}/**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
return(0,p.default)(MiniBus,e),(0,c.default)(MiniBus,[{key:"postMessage",value:function(e,t){var n=this;
//always send to external (to core MessageBus)
return n._genId(e),n._responseCallback(e,t),n._onPostMessage(e),e.id}},{key:"_onMessage",value:function(e){var t=this;if(!t._onResponse(e)){var n=t._subscriptions[e.to];n?(t._publishOn(n,e),e.to.startsWith("hyperty")||t._publishOnDefault(e)):t._publishOnDefault(e)}}}]),MiniBus}(_.default);/**
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
t.default=v,e.exports=t.default},/* 111 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(40),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),f=function(){/* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   */
function Bus(){(0,u.default)(this,Bus);var e=this;e._msgId=0,e._subscriptions={},e._responseTimeOut=5e3,//default to 3s
e._responseCallbacks={},e._registerExternalListener()}/**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
return(0,c.default)(Bus,[{key:"addListener",value:function(e,t){var n=this,r=new a(n._subscriptions,e,t),o=n._subscriptions[e];return o||(o=[],n._subscriptions[e]=o),o.push(r),r}},{key:"addResponseListener",value:function(e,t,n){this._responseCallbacks[e+t]=n}},{key:"removeResponseListener",value:function(e,t){delete this._responseCallbacks[e+t]}},{key:"removeAllListenersOf",value:function(e){delete this._subscriptions[e]}},{key:"bind",value:function(e,t,n){var r=this,o=this;return{thisListener:o.addListener(e,function(e){n.postMessage(e)}),targetListener:n.addListener(t,function(e){o.postMessage(e)}),unbind:function(){r.thisListener.remove(),r.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(e){
//is there any "*" (default) listeners?
var t=this._subscriptions["*"];t&&this._publishOn(t,e)}},{key:"_publishOn",value:function(e,t){e.forEach(function(e){e._callback(t)})}},{key:"_responseCallback",value:function(e,t){var n=this;
//automatic management of response handlers
if(t){var r=e.from+e.id;n._responseCallbacks[r]=t,setTimeout(function(){var t=n._responseCallbacks[r];if(delete n._responseCallbacks[r],t){t({id:e.id,type:"response",body:{code:408,desc:"Response timeout!",value:e}})}},n._responseTimeOut)}}},{key:"_onResponse",value:function(e){var t=this;if("response"===e.type){var n=e.to+e.id,r=t._responseCallbacks[n];if(
//if it's a provisional response, don't delete response listener
e.body.code>=200&&delete t._responseCallbacks[n],r)return r(e),!0}return!1}},{key:"_onMessage",value:function(e){var t=this;if(!t._onResponse(e)){var n=t._subscriptions[e.to];n?t._publishOn(n,e):t._publishOnDefault(e)}}},{key:"_genId",value:function(e){
//TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
//Global counter will not work, because there will be multiple MiniBus instances!
//Per URL, can be a lot of data to maintain!
//Maybe a counter per MiniBus instance. This is the assumed solution for now.
e.id&&0!==e.id||(this._msgId++,e.id=this._msgId)}},{key:"postMessage",value:function(e,t){}},{key:"postMessageWithRetries",value:function(e,t,n){var r=this,i=0,u=function(){return new o.default(function(t,o){r.postMessage(e,function(e){408===e.body.code||500===e.body.code?o():(n(e),t())})})};!function tryAgain(){u().then(function(){},function(){if(!(i++<t)){var n="[Error] Message Bounced (delivery attempts "+t+"): '";throw new Error(n+e)}setTimeout(function(){tryAgain()},1e3)})}()}},{key:"_onPostMessage",value:function(e){}},{key:"_registerExternalListener",value:function(){}}]),Bus}(),a=function(){/* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */
function MsgListener(e,t,n){(0,u.default)(this,MsgListener);var r=this;r._subscriptions=e,r._url=t,r._callback=n}return(0,c.default)(MsgListener,[{key:"remove",/**
     * Remove this listener from the Bus
     */
value:function(){var e=this,t=e._subscriptions[e._url];if(t){var n=t.indexOf(e);t.splice(n,1),
//if there are no listeners, remove the subscription entirely.
0===t.length&&delete e._subscriptions[e._url]}}},{key:"url",get:function(){return this._url}}]),MsgListener}();t.default=f,e.exports=t.default},/* 112 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=_interopRequireDefault(r),i=n(12),u=_interopRequireDefault(i),s=function(){/* private
  _components: <url: instance>
  */
function SandboxRegistry(e){(0,o.default)(this,SandboxRegistry);var t=this;t._bus=e,t._components={},
// Add Message Factory
// let messageFactory = new MessageFactory();
// _this.messageFactory = messageFactory;
e.addListener(SandboxRegistry.InternalDeployAddress,function(e){
//console.log('SandboxRegistry-RCV: ', msg);
// let responseMsg = {
//   id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
// };
switch(e.type){case"create":t._onDeploy(e);break;case"delete":t._onRemove(e)}})}return(0,u.default)(SandboxRegistry,[{key:"_responseMsg",value:function(e,t,n){var r={id:e.id,type:"response",from:SandboxRegistry.InternalDeployAddress,to:SandboxRegistry.ExternalDeployAddress},o={};
// return messageFactory.createResponse(msg, code, value);
return t&&(o.code=t),n&&(o.desc=n),r.body=o,r}},{key:"_onDeploy",value:function(e){var t=this,n=e.body.config,r=e.body.url,o=e.body.sourceCode,i=void 0,u=void 0;if(t._components.hasOwnProperty(r))i=500,u="Instance "+r+" already exist!";else try{t._components[r]=t._create(r,o,n),i=200}catch(e){i=500,u=e}
// Create response message with MessageFactory
var s=t._responseMsg(e,i,u);t._bus.postMessage(s)}},{key:"_onRemove",value:function(e){var t=this,n=e.body.url,r=void 0,o=void 0;t._components.hasOwnProperty(n)?(
//remove component from the pool and all listeners
delete t._components[n],t._bus.removeAllListenersOf(n),r=200):(r=500,o="Instance "+n+" doesn't exist!");var i=t._responseMsg(e,r,o);t._bus.postMessage(i)}},{key:"_create",value:function(e,t,n){}},{key:"components",get:function(){return this._components}}]),SandboxRegistry}();s.ExternalDeployAddress="hyperty-runtime://sandbox/external",s.InternalDeployAddress="hyperty-runtime://sandbox/internal",t.default=s,e.exports=t.default},/* 113 */
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
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.SandboxRegistry=t.SandboxType=t.Sandbox=void 0;var r=n(129),o=_interopRequireDefault(r),i=n(112),u=_interopRequireDefault(i);t.Sandbox=o.default,t.SandboxType=r.SandboxType,t.SandboxRegistry=u.default},/* 129 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.SandboxType=void 0;var r=n(102),o=_interopRequireDefault(r),i=n(40),u=_interopRequireDefault(i),s=n(59),c=_interopRequireDefault(s),f=n(11),a=_interopRequireDefault(f),l=n(12),p=_interopRequireDefault(l),d=n(60),_=_interopRequireDefault(d),v=n(61),y=_interopRequireDefault(v),h=n(112),b=_interopRequireDefault(h),m=n(110),x=_interopRequireDefault(m),g=(t.SandboxType={APP:"app",NORMAL:"normal",WINDOW:"window"},function(e){function Sandbox(e){(0,a.default)(this,Sandbox);var t=(0,_.default)(this,(Sandbox.__proto__||(0,c.default)(Sandbox)).call(this)),n=t;
// Add Message Factory
// let messageFactory = new MessageFactory();
// _this.messageFactory = messageFactory;
return e&&(n.capabilities=e),t}/**
   * Deploy an instance of the component into the sandbox.
   * @param  {string} componentSourceCode Component source code (Hyperty, ProtoStub, etc)
   * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
   * @param  {Config} configuration Config parameters of the component
   * @return {Promise<string>} return deployed if successful, or any other string with an error
   */
return(0,y.default)(Sandbox,e),(0,p.default)(Sandbox,[{key:"deployComponent",value:function(e,t,n){var r=this;
// let messageFactory = _this.messageFactory;
return new u.default(function(o,i){
//FLOW-OUT: deploy message for the internal SandboxRegistry -> _onDeploy
var u={type:"create",from:b.default.ExternalDeployAddress,to:b.default.InternalDeployAddress,body:{url:t,sourceCode:e,config:n}};
//send message into the sandbox internals and wait for reply
r.postMessage(u,function(e){200===e.body.code?
//is this response complaint with the spec?
o("deployed"):i(e.body.desc)})})}},{key:"removeComponent",value:function(e){var t=this;return new u.default(function(n,r){
//FLOW-OUT: un-deploy message for the internal SandboxRegistry -> _onRemove
var o={type:"delete",from:b.default.ExternalDeployAddress,to:b.default.InternalDeployAddress,body:{url:e}};
//send message into the sandbox internals and wait for reply
t.postMessage(o,function(e){200===e.body.code?
//is this response complaint with the spec?
n("undeployed"):r(e.body.desc)})})}},{key:"matches",value:function(e){var t=this,n=(0,o.default)(e).filter(function(n){return!(t.capabilities[n]&&t.capabilities[n]===e[n])});return 0===n.length||!e[n]}}]),Sandbox}(x.default));t.default=g}])});