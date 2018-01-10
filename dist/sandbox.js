// version: 0.11.0
// date: Wed Jan 10 2018 15:19:01 GMT+0000 (WET)
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


// version: 0.11.0
// date: Wed Jan 10 2018 15:19:01 GMT+0000 (WET)
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("sandbox",[],t):"object"==typeof exports?exports.sandbox=t():e.sandbox=t()}("undefined"!=typeof self?self:this,function(){/******/
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
return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=133)}([/* 0 */
/***/
function(e,t){var n=e.exports={version:"2.5.3"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(e,t){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
/***/
function(e,t,n){var r=n(28)("wks"),o=n(19),i=n(1).Symbol,u="function"==typeof i;(e.exports=function(e){return r[e]||(r[e]=u&&i[e]||(u?i:o)("Symbol."+e))}).store=r},/* 3 */
/***/
function(e,t,n){var r=n(1),o=n(0),i=n(14),u=n(8),s=function(e,t,n){var c,a,f,l=e&s.F,p=e&s.G,d=e&s.S,v=e&s.P,y=e&s.B,_=e&s.W,h=p?o:o[t]||(o[t]={}),b=h.prototype,g=p?r:d?r[t]:(r[t]||{}).prototype;p&&(n=t);for(c in n)
// contains in native
(a=!l&&g&&void 0!==g[c])&&c in h||(
// export native or passed
f=a?g[c]:n[c],
// prevent global pollution for namespaces
h[c]=p&&"function"!=typeof g[c]?n[c]:y&&a?i(f,r):_&&g[c]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):v&&"function"==typeof f?i(Function.call,f):f,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
v&&((h.virtual||(h.virtual={}))[c]=f,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
e&s.R&&b&&!b[c]&&u(b,c,f)))};
// type bitmap
s.F=1,// forced
s.G=2,// global
s.S=4,// static
s.P=8,// proto
s.B=16,// bind
s.W=32,// wrap
s.U=64,// safe
s.R=128,// real proto method for `library`
e.exports=s},/* 4 */
/***/
function(e,t,n){var r=n(6);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},/* 5 */
/***/
function(e,t,n){
// Thank's IE8 for his funny defineProperty
e.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 6 */
/***/
function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},/* 7 */
/***/
function(e,t,n){var r=n(4),o=n(36),i=n(26),u=Object.defineProperty;t.f=n(5)?Object.defineProperty:function(e,t,n){if(r(e),t=i(t,!0),r(n),o)try{return u(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},/* 8 */
/***/
function(e,t,n){var r=n(7),o=n(18);e.exports=n(5)?function(e,t,n){return r.f(e,t,o(1,n))}:function(e,t,n){return e[t]=n,e}},/* 9 */
/***/
function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},/* 10 */
/***/
function(e,t,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(57),o=n(22);e.exports=function(e){return r(o(e))}},/* 11 */
/***/
function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(e,t,n){"use strict";t.__esModule=!0;var r=n(60),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}()},/* 13 */
/***/
function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},/* 14 */
/***/
function(e,t,n){
// optional / simple context binding
var r=n(17);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,o){return e.call(t,n,r,o)}}return function(){return e.apply(t,arguments)}}},/* 15 */
/***/
function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},/* 16 */
/***/
function(e,t){e.exports={}},/* 17 */
/***/
function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},/* 18 */
/***/
function(e,t){e.exports=function(e,t){return{enumerable:!(1&e),configurable:!(2&e),writable:!(4&e),value:t}}},/* 19 */
/***/
function(e,t){var n=0,r=Math.random();e.exports=function(e){return"Symbol(".concat(void 0===e?"":e,")_",(++n+r).toString(36))}},/* 20 */
/***/
function(e,t,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(37),o=n(29);e.exports=Object.keys||function(e){return r(e,o)}},/* 21 */
/***/
function(e,t){
// 7.1.4 ToInteger
var n=Math.ceil,r=Math.floor;e.exports=function(e){return isNaN(e=+e)?0:(e>0?r:n)(e)}},/* 22 */
/***/
function(e,t){
// 7.2.1 RequireObjectCoercible(argument)
e.exports=function(e){if(void 0==e)throw TypeError("Can't call method on  "+e);return e}},/* 23 */
/***/
function(e,t){e.exports=!0},/* 24 */
/***/
function(e,t,n){var r=n(7).f,o=n(9),i=n(2)("toStringTag");e.exports=function(e,t,n){e&&!o(e=n?e:e.prototype,i)&&r(e,i,{configurable:!0,value:t})}},/* 25 */
/***/
function(e,t,n){var r=n(6),o=n(1).document,i=r(o)&&r(o.createElement);e.exports=function(e){return i?o.createElement(e):{}}},/* 26 */
/***/
function(e,t,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(6);
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
var r=n(22);e.exports=function(e){return Object(r(e))}},/* 31 */
/***/
function(e,t,n){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var r=n(4),o=n(69),i=n(29),u=n(27)("IE_PROTO"),s=function(){},c=function(){
// Thrash, waste and sodomy: IE GC bug
var e,t=n(25)("iframe"),r=i.length;for(t.style.display="none",n(46).appendChild(t),t.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
e=t.contentWindow.document,e.open(),e.write("<script>document.F=Object<\/script>"),e.close(),c=e.F;r--;)delete c.prototype[i[r]];return c()};e.exports=Object.create||function(e,t){var n;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==e?(s.prototype=r(e),n=new s,s.prototype=null,n[u]=e):n=c(),void 0===t?n:o(n,t)}},/* 32 */
/***/
function(e,t,n){"use strict";function PromiseCapability(e){var t,n;this.promise=new e(function(e,r){if(void 0!==t||void 0!==n)throw TypeError("Bad Promise constructor");t=e,n=r}),this.resolve=r(t),this.reject=r(n)}
// 25.4.1.5 NewPromiseCapability(C)
var r=n(17);e.exports.f=function(e){return new PromiseCapability(e)}},/* 33 */
/***/
function(e,t,n){t.f=n(2)},/* 34 */
/***/
function(e,t,n){var r=n(1),o=n(0),i=n(23),u=n(33),s=n(7).f;e.exports=function(e){var t=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==e.charAt(0)||e in t||s(t,e,{value:u.f(e)})}},/* 35 */
/***/
function(e,t){t.f={}.propertyIsEnumerable},/* 36 */
/***/
function(e,t,n){e.exports=!n(5)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 37 */
/***/
function(e,t,n){var r=n(9),o=n(10),i=n(58)(!1),u=n(27)("IE_PROTO");e.exports=function(e,t){var n,s=o(e),c=0,a=[];for(n in s)n!=u&&r(s,n)&&a.push(n);
// Don't enum bug & hidden keys
for(;t.length>c;)r(s,n=t[c++])&&(~i(a,n)||a.push(n));return a}},/* 38 */
/***/
function(e,t,n){
// 7.1.15 ToLength
var r=n(21),o=Math.min;e.exports=function(e){return e>0?o(r(e),9007199254740991):0}},/* 39 */
/***/
function(e,t,n){
// most Object methods by ES6 should accept primitives
var r=n(3),o=n(0),i=n(13);e.exports=function(e,t){var n=(o.Object||{})[e]||Object[e],u={};u[e]=t(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},/* 40 */
/***/
function(e,t,n){var r=n(35),o=n(18),i=n(10),u=n(26),s=n(9),c=n(36),a=Object.getOwnPropertyDescriptor;t.f=n(5)?a:function(e,t){if(e=i(e),t=u(t,!0),c)try{return a(e,t)}catch(e){}if(s(e,t))return o(!r.f.call(e,t),e[t])}},/* 41 */
/***/
function(e,t,n){e.exports={default:n(66),__esModule:!0}},/* 42 */
/***/
function(e,t){},/* 43 */
/***/
function(e,t,n){"use strict";var r=n(67)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
n(44)(String,"String",function(e){this._t=String(e),// target
this._i=0},function(){var e,t=this._t,n=this._i;return n>=t.length?{value:void 0,done:!0}:(e=r(t,n),this._i+=e.length,{value:e,done:!1})})},/* 44 */
/***/
function(e,t,n){"use strict";var r=n(23),o=n(3),i=n(45),u=n(8),s=n(9),c=n(16),a=n(68),f=n(24),l=n(47),p=n(2)("iterator"),d=!([].keys&&"next"in[].keys()),v=function(){return this};e.exports=function(e,t,n,y,_,h,b){a(n,t,y);var g,m,x,w=function(e){if(!d&&e in P)return P[e];switch(e){case"keys":case"values":return function(){return new n(this,e)}}return function(){return new n(this,e)}},O=t+" Iterator",S="values"==_,M=!1,P=e.prototype,k=P[p]||P["@@iterator"]||_&&P[_],R=!d&&k||w(_),L=_?S?w("entries"):R:void 0,j="Array"==t?P.entries||k:k;if(
// Fix native
j&&(x=l(j.call(new e)))!==Object.prototype&&x.next&&(
// Set @@toStringTag to native iterators
f(x,O,!0),
// fix for some old engines
r||s(x,p)||u(x,p,v)),
// fix Array#{values, @@iterator}.name in V8 / FF
S&&k&&"values"!==k.name&&(M=!0,R=function(){return k.call(this)}),
// Define iterator
r&&!b||!d&&!M&&P[p]||u(P,p,R),
// Plug for library
c[t]=R,c[O]=v,_)if(g={values:S?R:w("values"),keys:h?R:w("keys"),entries:L},b)for(m in g)m in P||i(P,m,g[m]);else o(o.P+o.F*(d||M),t,g);return g}},/* 45 */
/***/
function(e,t,n){e.exports=n(8)},/* 46 */
/***/
function(e,t,n){var r=n(1).document;e.exports=r&&r.documentElement},/* 47 */
/***/
function(e,t,n){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var r=n(9),o=n(30),i=n(27)("IE_PROTO"),u=Object.prototype;e.exports=Object.getPrototypeOf||function(e){return e=o(e),r(e,i)?e[i]:"function"==typeof e.constructor&&e instanceof e.constructor?e.constructor.prototype:e instanceof Object?u:null}},/* 48 */
/***/
function(e,t,n){n(70);for(var r=n(1),o=n(8),i=n(16),u=n(2)("toStringTag"),s="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),c=0;c<s.length;c++){var a=s[c],f=r[a],l=f&&f.prototype;l&&!l[u]&&o(l,u,a),i[a]=i.Array}},/* 49 */
/***/
function(e,t,n){
// getting tag from 19.1.3.6 Object.prototype.toString()
var r=n(15),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(e,t){try{return e[t]}catch(e){}};e.exports=function(e){var t,n,s;return void 0===e?"Undefined":null===e?"Null":"string"==typeof(n=u(t=Object(e),o))?n:i?r(t):"Object"==(s=r(t))&&"function"==typeof t.callee?"Arguments":s}},/* 50 */
/***/
function(e,t,n){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var r=n(4),o=n(17),i=n(2)("species");e.exports=function(e,t){var n,u=r(e).constructor;return void 0===u||void 0==(n=r(u)[i])?t:o(n)}},/* 51 */
/***/
function(e,t,n){var r,o,i,u=n(14),s=n(79),c=n(46),a=n(25),f=n(1),l=f.process,p=f.setImmediate,d=f.clearImmediate,v=f.MessageChannel,y=f.Dispatch,_=0,h={},b=function(){var e=+this;
// eslint-disable-next-line no-prototype-builtins
if(h.hasOwnProperty(e)){var t=h[e];delete h[e],t()}},g=function(e){b.call(e.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&d||(p=function(e){for(var t=[],n=1;arguments.length>n;)t.push(arguments[n++]);return h[++_]=function(){
// eslint-disable-next-line no-new-func
s("function"==typeof e?e:Function(e),t)},r(_),_},d=function(e){delete h[e]},
// Node.js 0.8-
"process"==n(15)(l)?r=function(e){l.nextTick(u(b,e,1))}:y&&y.now?r=function(e){y.now(u(b,e,1))}:v?(o=new v,i=o.port2,o.port1.onmessage=g,r=u(i.postMessage,i,1)):f.addEventListener&&"function"==typeof postMessage&&!f.importScripts?(r=function(e){f.postMessage(e+"","*")},f.addEventListener("message",g,!1)):r="onreadystatechange"in a("script")?function(e){c.appendChild(a("script")).onreadystatechange=function(){c.removeChild(this),b.call(e)}}:function(e){setTimeout(u(b,e,1),0)}),e.exports={set:p,clear:d}},/* 52 */
/***/
function(e,t){e.exports=function(e){try{return{e:!1,v:e()}}catch(e){return{e:!0,v:e}}}},/* 53 */
/***/
function(e,t,n){var r=n(4),o=n(6),i=n(32);e.exports=function(e,t){if(r(e),o(t)&&t.constructor===e)return t;var n=i.f(e);return(0,n.resolve)(t),n.promise}},/* 54 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=n(89),o=_interopRequireDefault(r),i=n(91),u=_interopRequireDefault(i),s="function"==typeof u.default&&"symbol"==typeof o.default?function(e){return typeof e}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":typeof e};t.default="function"==typeof u.default&&"symbol"===s(o.default)?function(e){return void 0===e?"undefined":s(e)}:function(e){return e&&"function"==typeof u.default&&e.constructor===u.default&&e!==u.default.prototype?"symbol":void 0===e?"undefined":s(e)}},/* 55 */
/***/
function(e,t){t.f=Object.getOwnPropertySymbols},/* 56 */
/***/
function(e,t,n){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var r=n(37),o=n(29).concat("length","prototype");t.f=Object.getOwnPropertyNames||function(e){return r(e,o)}},/* 57 */
/***/
function(e,t,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(15);
// eslint-disable-next-line no-prototype-builtins
e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},/* 58 */
/***/
function(e,t,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(10),o=n(38),i=n(59);e.exports=function(e){return function(t,n,u){var s,c=r(t),a=o(c.length),f=i(u,a);
// Array#includes uses SameValueZero equality algorithm
// eslint-disable-next-line no-self-compare
if(e&&n!=n){for(;a>f;)
// eslint-disable-next-line no-self-compare
if((s=c[f++])!=s)return!0}else for(;a>f;f++)if((e||f in c)&&c[f]===n)return e||f||0;return!e&&-1}}},/* 59 */
/***/
function(e,t,n){var r=n(21),o=Math.max,i=Math.min;e.exports=function(e,t){return e=r(e),e<0?o(e+t,0):i(e,t)}},/* 60 */
/***/
function(e,t,n){e.exports={default:n(61),__esModule:!0}},/* 61 */
/***/
function(e,t,n){n(62);var r=n(0).Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},/* 62 */
/***/
function(e,t,n){var r=n(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(5),"Object",{defineProperty:n(7).f})},/* 63 */
/***/
function(e,t,n){e.exports={default:n(87),__esModule:!0}},/* 64 */
/***/
function(e,t,n){"use strict";t.__esModule=!0;var r=n(54),o=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!==(void 0===t?"undefined":(0,o.default)(t))&&"function"!=typeof t?e:t}},/* 65 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}t.__esModule=!0;var r=n(100),o=_interopRequireDefault(r),i=n(104),u=_interopRequireDefault(i),s=n(54),c=_interopRequireDefault(s);t.default=function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+(void 0===t?"undefined":(0,c.default)(t)));e.prototype=(0,u.default)(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(o.default?(0,o.default)(e,t):e.__proto__=t)}},/* 66 */
/***/
function(e,t,n){n(42),n(43),n(48),n(73),n(84),n(85),e.exports=n(0).Promise},/* 67 */
/***/
function(e,t,n){var r=n(21),o=n(22);
// true  -> String#at
// false -> String#codePointAt
e.exports=function(e){return function(t,n){var i,u,s=String(o(t)),c=r(n),a=s.length;return c<0||c>=a?e?"":void 0:(i=s.charCodeAt(c),i<55296||i>56319||c+1===a||(u=s.charCodeAt(c+1))<56320||u>57343?e?s.charAt(c):i:e?s.slice(c,c+2):u-56320+(i-55296<<10)+65536)}}},/* 68 */
/***/
function(e,t,n){"use strict";var r=n(31),o=n(18),i=n(24),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
n(8)(u,n(2)("iterator"),function(){return this}),e.exports=function(e,t,n){e.prototype=r(u,{next:o(1,n)}),i(e,t+" Iterator")}},/* 69 */
/***/
function(e,t,n){var r=n(7),o=n(4),i=n(20);e.exports=n(5)?Object.defineProperties:function(e,t){o(e);for(var n,u=i(t),s=u.length,c=0;s>c;)r.f(e,n=u[c++],t[n]);return e}},/* 70 */
/***/
function(e,t,n){"use strict";var r=n(71),o=n(72),i=n(16),u=n(10);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
e.exports=n(44)(Array,"Array",function(e,t){this._t=u(e),// target
this._i=0,// next index
this._k=t},function(){var e=this._t,t=this._k,n=this._i++;return!e||n>=e.length?(this._t=void 0,o(1)):"keys"==t?o(0,n):"values"==t?o(0,e[n]):o(0,[n,e[n]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
i.Arguments=i.Array,r("keys"),r("values"),r("entries")},/* 71 */
/***/
function(e,t){e.exports=function(){}},/* 72 */
/***/
function(e,t){e.exports=function(e,t){return{value:t,done:!!e}}},/* 73 */
/***/
function(e,t,n){"use strict";var r,o,i,u,s=n(23),c=n(1),a=n(14),f=n(49),l=n(3),p=n(6),d=n(17),v=n(74),y=n(75),_=n(50),h=n(51).set,b=n(80)(),g=n(32),m=n(52),x=n(53),w=c.TypeError,O=c.process,S=c.Promise,M="process"==f(O),P=function(){},k=o=g.f,R=!!function(){try{
// correct subclassing with @@species support
var e=S.resolve(1),t=(e.constructor={})[n(2)("species")]=function(e){e(P,P)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(M||"function"==typeof PromiseRejectionEvent)&&e.then(P)instanceof t}catch(e){}}(),L=function(e){var t;return!(!p(e)||"function"!=typeof(t=e.then))&&t},j=function(e,t){if(!e._n){e._n=!0;var n=e._c;b(function(){for(var r=e._v,o=1==e._s,i=0;n.length>i;)!function(t){var n,i,u=o?t.ok:t.fail,s=t.resolve,c=t.reject,a=t.domain;try{u?(o||(2==e._h&&T(e),e._h=1),!0===u?n=r:(a&&a.enter(),n=u(r),a&&a.exit()),n===t.promise?c(w("Promise-chain cycle")):(i=L(n))?i.call(n,s,c):s(n)):c(r)}catch(e){c(e)}}(n[i++]);// variable length - can't use forEach
e._c=[],e._n=!1,t&&!e._h&&D(e)})}},D=function(e){h.call(c,function(){var t,n,r,o=e._v,i=E(e);if(i&&(t=m(function(){M?O.emit("unhandledRejection",o,e):(n=c.onunhandledrejection)?n({promise:e,reason:o}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
e._h=M||E(e)?2:1),e._a=void 0,i&&t.e)throw t.v})},E=function(e){return 1!==e._h&&0===(e._a||e._c).length},T=function(e){h.call(c,function(){var t;M?O.emit("rejectionHandled",e):(t=c.onrejectionhandled)&&t({promise:e,reason:e._v})})},q=function(e){var t=this;t._d||(t._d=!0,t=t._w||t,// unwrap
t._v=e,t._s=2,t._a||(t._a=t._c.slice()),j(t,!0))},A=function(e){var t,n=this;if(!n._d){n._d=!0,n=n._w||n;// unwrap
try{if(n===e)throw w("Promise can't be resolved itself");(t=L(e))?b(function(){var r={_w:n,_d:!1};// wrap
try{t.call(e,a(A,r,1),a(q,r,1))}catch(e){q.call(r,e)}}):(n._v=e,n._s=1,j(n,!1))}catch(e){q.call({_w:n,_d:!1},e)}}};
// constructor polyfill
R||(
// 25.4.3.1 Promise(executor)
S=function(e){v(this,S,"Promise","_h"),d(e),r.call(this);try{e(a(A,this,1),a(q,this,1))}catch(e){q.call(this,e)}},
// eslint-disable-next-line no-unused-vars
r=function(e){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},r.prototype=n(81)(S.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(e,t){var n=k(_(this,S));return n.ok="function"!=typeof e||e,n.fail="function"==typeof t&&t,n.domain=M?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&j(this,!1),n.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(e){return this.then(void 0,e)}}),i=function(){var e=new r;this.promise=e,this.resolve=a(A,e,1),this.reject=a(q,e,1)},g.f=k=function(e){return e===S||e===u?new i(e):o(e)}),l(l.G+l.W+l.F*!R,{Promise:S}),n(24)(S,"Promise"),n(82)("Promise"),u=n(0).Promise,
// statics
l(l.S+l.F*!R,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(e){var t=k(this);return(0,t.reject)(e),t.promise}}),l(l.S+l.F*(s||!R),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(e){return x(s&&this===u?S:this,e)}}),l(l.S+l.F*!(R&&n(83)(function(e){S.all(e).catch(P)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(e){var t=this,n=k(t),r=n.resolve,o=n.reject,i=m(function(){var n=[],i=0,u=1;y(e,!1,function(e){var s=i++,c=!1;n.push(void 0),u++,t.resolve(e).then(function(e){c||(c=!0,n[s]=e,--u||r(n))},o)}),--u||r(n)});return i.e&&o(i.v),n.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(e){var t=this,n=k(t),r=n.reject,o=m(function(){y(e,!1,function(e){t.resolve(e).then(n.resolve,r)})});return o.e&&r(o.v),n.promise}})},/* 74 */
/***/
function(e,t){e.exports=function(e,t,n,r){if(!(e instanceof t)||void 0!==r&&r in e)throw TypeError(n+": incorrect invocation!");return e}},/* 75 */
/***/
function(e,t,n){var r=n(14),o=n(76),i=n(77),u=n(4),s=n(38),c=n(78),a={},f={},t=e.exports=function(e,t,n,l,p){var d,v,y,_,h=p?function(){return e}:c(e),b=r(n,l,t?2:1),g=0;if("function"!=typeof h)throw TypeError(e+" is not iterable!");
// fast case for arrays with default iterator
if(i(h)){for(d=s(e.length);d>g;g++)if((_=t?b(u(v=e[g])[0],v[1]):b(e[g]))===a||_===f)return _}else for(y=h.call(e);!(v=y.next()).done;)if((_=o(y,b,v.value,t))===a||_===f)return _};t.BREAK=a,t.RETURN=f},/* 76 */
/***/
function(e,t,n){
// call something on iterator step with safe closing on error
var r=n(4);e.exports=function(e,t,n,o){try{return o?t(r(n)[0],n[1]):t(n)}catch(t){var i=e.return;throw void 0!==i&&r(i.call(e)),t}}},/* 77 */
/***/
function(e,t,n){
// check on default Array iterator
var r=n(16),o=n(2)("iterator"),i=Array.prototype;e.exports=function(e){return void 0!==e&&(r.Array===e||i[o]===e)}},/* 78 */
/***/
function(e,t,n){var r=n(49),o=n(2)("iterator"),i=n(16);e.exports=n(0).getIteratorMethod=function(e){if(void 0!=e)return e[o]||e["@@iterator"]||i[r(e)]}},/* 79 */
/***/
function(e,t){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
e.exports=function(e,t,n){var r=void 0===n;switch(t.length){case 0:return r?e():e.call(n);case 1:return r?e(t[0]):e.call(n,t[0]);case 2:return r?e(t[0],t[1]):e.call(n,t[0],t[1]);case 3:return r?e(t[0],t[1],t[2]):e.call(n,t[0],t[1],t[2]);case 4:return r?e(t[0],t[1],t[2],t[3]):e.call(n,t[0],t[1],t[2],t[3])}return e.apply(n,t)}},/* 80 */
/***/
function(e,t,n){var r=n(1),o=n(51).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,s=r.Promise,c="process"==n(15)(u);e.exports=function(){var e,t,n,a=function(){var r,o;for(c&&(r=u.domain)&&r.exit();e;){o=e.fn,e=e.next;try{o()}catch(r){throw e?n():t=void 0,r}}t=void 0,r&&r.enter()};
// Node.js
if(c)n=function(){u.nextTick(a)};else if(!i||r.navigator&&r.navigator.standalone)if(s&&s.resolve){var f=s.resolve();n=function(){f.then(a)}}else n=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(r,a)};else{var l=!0,p=document.createTextNode("");new i(a).observe(p,{characterData:!0}),// eslint-disable-line no-new
n=function(){p.data=l=!l}}return function(r){var o={fn:r,next:void 0};t&&(t.next=o),e||(e=o,n()),t=o}}},/* 81 */
/***/
function(e,t,n){var r=n(8);e.exports=function(e,t,n){for(var o in t)n&&e[o]?e[o]=t[o]:r(e,o,t[o]);return e}},/* 82 */
/***/
function(e,t,n){"use strict";var r=n(1),o=n(0),i=n(7),u=n(5),s=n(2)("species");e.exports=function(e){var t="function"==typeof o[e]?o[e]:r[e];u&&t&&!t[s]&&i.f(t,s,{configurable:!0,get:function(){return this}})}},/* 83 */
/***/
function(e,t,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},
// eslint-disable-next-line no-throw-literal
Array.from(i,function(){throw 2})}catch(e){}e.exports=function(e,t){if(!t&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},e(i)}catch(e){}return n}},/* 84 */
/***/
function(e,t,n){"use strict";
// https://github.com/tc39/proposal-promise-finally
var r=n(3),o=n(0),i=n(1),u=n(50),s=n(53);r(r.P+r.R,"Promise",{finally:function(e){var t=u(this,o.Promise||i.Promise),n="function"==typeof e;return this.then(n?function(n){return s(t,e()).then(function(){return n})}:e,n?function(n){return s(t,e()).then(function(){throw n})}:e)}})},/* 85 */
/***/
function(e,t,n){"use strict";
// https://github.com/tc39/proposal-promise-try
var r=n(3),o=n(32),i=n(52);r(r.S,"Promise",{try:function(e){var t=o.f(this),n=i(e);return(n.e?t.reject:t.resolve)(n.v),t.promise}})},/* 86 */
/***/
function(e,t,n){var r,o;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
!function(i,u){"use strict";r=u,void 0!==(o="function"==typeof r?r.call(t,n,t,e):r)&&(e.exports=o)}(0,function(){"use strict";
// Cross-browser bind equivalent that works at least back to IE6
function bindMethod(e,t){var n=e[t];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){
// Missing bind shim or IE8 + Modernizr, fallback to wrapping
return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}
// Build the best logging method possible for this env
// Wherever possible we want to bind, not wrap, to preserve stack traces
function realMethod(n){return"debug"===n&&(n="log"),typeof console!==t&&(void 0!==console[n]?bindMethod(console,n):void 0!==console.log?bindMethod(console,"log"):e)}
// These private functions always need `this` to be set properly
function replaceLoggingMethods(t,r){/*jshint validthis:true */
for(var o=0;o<n.length;o++){var i=n[o];this[i]=o<t?e:this.methodFactory(i,t,r)}
// Define log.log as an alias for log.debug
this.log=this.debug}
// In old IE versions, the console isn't present until you first open it.
// We build realMethod() replacements here that regenerate logging methods
function enableLoggingWhenConsoleArrives(e,n,r){return function(){typeof console!==t&&(replaceLoggingMethods.call(this,n,r),this[e].apply(this,arguments))}}
// By default, we use closely bound real methods wherever possible, and
// otherwise we wait for a console to appear, and then try again.
function defaultMethodFactory(e,t,n){/*jshint validthis:true */
return realMethod(e)||enableLoggingWhenConsoleArrives.apply(this,arguments)}function Logger(e,r,o){function persistLevelIfPossible(e){var r=(n[e]||"silent").toUpperCase();if(typeof window!==t){
// Use localStorage if available
try{return void(window.localStorage[s]=r)}catch(e){}
// Use session cookie as fallback
try{window.document.cookie=encodeURIComponent(s)+"="+r+";"}catch(e){}}}function getPersistedLevel(){var e;if(typeof window!==t){try{e=window.localStorage[s]}catch(e){}
// Fallback to cookies if local storage gives us nothing
if(typeof e===t)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(s)+"=");-1!==r&&(e=/^([^;]+)/.exec(n.slice(r))[1])}catch(e){}
// If the stored level is not valid, treat it as if nothing was stored.
return void 0===u.levels[e]&&(e=void 0),e}}var i,u=this,s="loglevel";e&&(s+=":"+e),/*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */
u.name=e,u.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},u.methodFactory=o||defaultMethodFactory,u.getLevel=function(){return i},u.setLevel=function(n,r){if("string"==typeof n&&void 0!==u.levels[n.toUpperCase()]&&(n=u.levels[n.toUpperCase()]),!("number"==typeof n&&n>=0&&n<=u.levels.SILENT))throw"log.setLevel() called with invalid level: "+n;if(i=n,!1!==r&&// defaults to true
persistLevelIfPossible(n),replaceLoggingMethods.call(u,n,e),typeof console===t&&n<u.levels.SILENT)return"No console available for logging"},u.setDefaultLevel=function(e){getPersistedLevel()||u.setLevel(e,!1)},u.enableAll=function(e){u.setLevel(u.levels.TRACE,e)},u.disableAll=function(e){u.setLevel(u.levels.SILENT,e)};
// Initialize with the right level
var c=getPersistedLevel();null==c&&(c=null==r?"WARN":r),u.setLevel(c,!1)}
// Slightly dubious tricks to cut down minimized file size
var e=function(){},t="undefined",n=["trace","debug","info","warn","error"],r=new Logger,o={};r.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=o[e];return t||(t=o[e]=new Logger(e,r.getLevel(),r.methodFactory)),t};
// Grab the current global log variable in case of overwrite
var i=typeof window!==t?window.log:void 0;return r.noConflict=function(){return typeof window!==t&&window.log===r&&(window.log=i),r},r.getLoggers=function(){return o},r})},/* 87 */
/***/
function(e,t,n){n(88),e.exports=n(0).Object.getPrototypeOf},/* 88 */
/***/
function(e,t,n){
// 19.1.2.9 Object.getPrototypeOf(O)
var r=n(30),o=n(47);n(39)("getPrototypeOf",function(){return function(e){return o(r(e))}})},/* 89 */
/***/
function(e,t,n){e.exports={default:n(90),__esModule:!0}},/* 90 */
/***/
function(e,t,n){n(43),n(48),e.exports=n(33).f("iterator")},/* 91 */
/***/
function(e,t,n){e.exports={default:n(92),__esModule:!0}},/* 92 */
/***/
function(e,t,n){n(93),n(42),n(98),n(99),e.exports=n(0).Symbol},/* 93 */
/***/
function(e,t,n){"use strict";
// ECMAScript 6 symbols shim
var r=n(1),o=n(9),i=n(5),u=n(3),s=n(45),c=n(94).KEY,a=n(13),f=n(28),l=n(24),p=n(19),d=n(2),v=n(33),y=n(34),_=n(95),h=n(96),b=n(4),g=n(6),m=n(10),x=n(26),w=n(18),O=n(31),S=n(97),M=n(40),P=n(7),k=n(20),R=M.f,L=P.f,j=S.f,D=r.Symbol,E=r.JSON,T=E&&E.stringify,q=d("_hidden"),A=d("toPrimitive"),C={}.propertyIsEnumerable,I=f("symbol-registry"),F=f("symbols"),N=f("op-symbols"),B=Object.prototype,W="function"==typeof D,G=r.QObject,U=!G||!G.prototype||!G.prototype.findChild,V=i&&a(function(){return 7!=O(L({},"a",{get:function(){return L(this,"a",{value:7}).a}})).a})?function(e,t,n){var r=R(B,t);r&&delete B[t],L(e,t,n),r&&e!==B&&L(B,t,r)}:L,H=function(e){var t=F[e]=O(D.prototype);return t._k=e,t},K=W&&"symbol"==typeof D.iterator?function(e){return"symbol"==typeof e}:function(e){return e instanceof D},J=function(e,t,n){return e===B&&J(N,t,n),b(e),t=x(t,!0),b(n),o(F,t)?(n.enumerable?(o(e,q)&&e[q][t]&&(e[q][t]=!1),n=O(n,{enumerable:w(0,!1)})):(o(e,q)||L(e,q,w(1,{})),e[q][t]=!0),V(e,t,n)):L(e,t,n)},Y=function(e,t){b(e);for(var n,r=_(t=m(t)),o=0,i=r.length;i>o;)J(e,n=r[o++],t[n]);return e},z=function(e,t){return void 0===t?O(e):Y(O(e),t)},Q=function(e){var t=C.call(this,e=x(e,!0));return!(this===B&&o(F,e)&&!o(N,e))&&(!(t||!o(this,e)||!o(F,e)||o(this,q)&&this[q][e])||t)},X=function(e,t){if(e=m(e),t=x(t,!0),e!==B||!o(F,t)||o(N,t)){var n=R(e,t);return!n||!o(F,t)||o(e,q)&&e[q][t]||(n.enumerable=!0),n}},Z=function(e){for(var t,n=j(m(e)),r=[],i=0;n.length>i;)o(F,t=n[i++])||t==q||t==c||r.push(t);return r},$=function(e){for(var t,n=e===B,r=j(n?N:m(e)),i=[],u=0;r.length>u;)!o(F,t=r[u++])||n&&!o(B,t)||i.push(F[t]);return i};
// 19.4.1.1 Symbol([description])
W||(D=function(){if(this instanceof D)throw TypeError("Symbol is not a constructor!");var e=p(arguments.length>0?arguments[0]:void 0),t=function(n){this===B&&t.call(N,n),o(this,q)&&o(this[q],e)&&(this[q][e]=!1),V(this,e,w(1,n))};return i&&U&&V(B,e,{configurable:!0,set:t}),H(e)},s(D.prototype,"toString",function(){return this._k}),M.f=X,P.f=J,n(56).f=S.f=Z,n(35).f=Q,n(55).f=$,i&&!n(23)&&s(B,"propertyIsEnumerable",Q,!0),v.f=function(e){return H(d(e))}),u(u.G+u.W+u.F*!W,{Symbol:D});for(var ee="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),te=0;ee.length>te;)d(ee[te++]);for(var ne=k(d.store),re=0;ne.length>re;)y(ne[re++]);u(u.S+u.F*!W,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(e){return o(I,e+="")?I[e]:I[e]=D(e)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(e){if(!K(e))throw TypeError(e+" is not a symbol!");for(var t in I)if(I[t]===e)return t},useSetter:function(){U=!0},useSimple:function(){U=!1}}),u(u.S+u.F*!W,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:z,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:J,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:Y,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:X,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:Z,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:$}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
E&&u(u.S+u.F*(!W||a(function(){var e=D();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=T([e])||"{}"!=T({a:e})||"{}"!=T(Object(e))})),"JSON",{stringify:function(e){for(var t,n,r=[e],o=1;arguments.length>o;)r.push(arguments[o++]);if(n=t=r[1],(g(t)||void 0!==e)&&!K(e))// IE8 returns string on undefined
return h(t)||(t=function(e,t){if("function"==typeof n&&(t=n.call(this,e,t)),!K(t))return t}),r[1]=t,T.apply(E,r)}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
D.prototype[A]||n(8)(D.prototype,A,D.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(D,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(r.JSON,"JSON",!0)},/* 94 */
/***/
function(e,t,n){var r=n(19)("meta"),o=n(6),i=n(9),u=n(7).f,s=0,c=Object.isExtensible||function(){return!0},a=!n(13)(function(){return c(Object.preventExtensions({}))}),f=function(e){u(e,r,{value:{i:"O"+ ++s,// object ID
w:{}}})},l=function(e,t){
// return primitive with prefix
if(!o(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!i(e,r)){
// can't set metadata to uncaught frozen object
if(!c(e))return"F";
// not necessary to add metadata
if(!t)return"E";
// add missing metadata
f(e)}return e[r].i},p=function(e,t){if(!i(e,r)){
// can't set metadata to uncaught frozen object
if(!c(e))return!0;
// not necessary to add metadata
if(!t)return!1;
// add missing metadata
f(e)}return e[r].w},d=function(e){return a&&v.NEED&&c(e)&&!i(e,r)&&f(e),e},v=e.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:d}},/* 95 */
/***/
function(e,t,n){
// all enumerable object keys, includes symbols
var r=n(20),o=n(55),i=n(35);e.exports=function(e){var t=r(e),n=o.f;if(n)for(var u,s=n(e),c=i.f,a=0;s.length>a;)c.call(e,u=s[a++])&&t.push(u);return t}},/* 96 */
/***/
function(e,t,n){
// 7.2.2 IsArray(argument)
var r=n(15);e.exports=Array.isArray||function(e){return"Array"==r(e)}},/* 97 */
/***/
function(e,t,n){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var r=n(10),o=n(56).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(e){try{return o(e)}catch(e){return u.slice()}};e.exports.f=function(e){return u&&"[object Window]"==i.call(e)?s(e):o(r(e))}},/* 98 */
/***/
function(e,t,n){n(34)("asyncIterator")},/* 99 */
/***/
function(e,t,n){n(34)("observable")},/* 100 */
/***/
function(e,t,n){e.exports={default:n(101),__esModule:!0}},/* 101 */
/***/
function(e,t,n){n(102),e.exports=n(0).Object.setPrototypeOf},/* 102 */
/***/
function(e,t,n){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var r=n(3);r(r.S,"Object",{setPrototypeOf:n(103).set})},/* 103 */
/***/
function(e,t,n){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var r=n(6),o=n(4),i=function(e,t){if(o(e),!r(t)&&null!==t)throw TypeError(t+": can't set as prototype!")};e.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(e,t,r){try{r=n(14)(Function.call,n(40).f(Object.prototype,"__proto__").set,2),r(e,[]),t=!(e instanceof Array)}catch(e){t=!0}return function(e,n){return i(e,n),t?e.__proto__=n:r(e,n),e}}({},!1):void 0),check:i}},/* 104 */
/***/
function(e,t,n){e.exports={default:n(105),__esModule:!0}},/* 105 */
/***/
function(e,t,n){n(106);var r=n(0).Object;e.exports=function(e,t){return r.create(e,t)}},/* 106 */
/***/
function(e,t,n){var r=n(3);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
r(r.S,"Object",{create:n(31)})},/* 107 */
/***/
function(e,t,n){e.exports={default:n(108),__esModule:!0}},/* 108 */
/***/
function(e,t,n){n(109),e.exports=n(0).Object.keys},/* 109 */
/***/
function(e,t,n){
// 19.1.2.14 Object.keys(O)
var r=n(30),o=n(20);n(39)("keys",function(){return function(e){return o(r(e))}})},/* 110 */
,/* 111 */
,/* 112 */
,/* 113 */
,/* 114 */
,/* 115 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(63),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),a=n(64),f=_interopRequireDefault(a),l=n(65),p=_interopRequireDefault(l),d=n(116),v=_interopRequireDefault(d),y=function(e){function MiniBus(){return(0,u.default)(this,MiniBus),(0,f.default)(this,(MiniBus.__proto__||(0,o.default)(MiniBus)).call(this))}/**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
return(0,p.default)(MiniBus,e),(0,c.default)(MiniBus,[{key:"postMessage",value:function(e,t,n){var r=this;
//always send to external (to core MessageBus)
return r._genId(e),r._responseCallback(e,t,n),r._onPostMessage(e),e.id}},{key:"_onMessage",value:function(e){var t=this;if(!t._onResponse(e)){var n=t._subscriptions[e.to];n?(t._publishOn(n,e),e.to.startsWith("hyperty")||t._publishOnDefault(e)):t._publishOnDefault(e)}}}]),MiniBus}(v.default);/**
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
t.default=y,e.exports=t.default},/* 116 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(41),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),a=n(86),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(a),l=f.getLogger("Bus"),p=function(){/* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   */
function Bus(){(0,u.default)(this,Bus);var e=this;e._msgId=0,e._subscriptions={},e._responseTimeOut=15e3,//default to 3s
e._responseCallbacks={},e._registerExternalListener()}/**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
return(0,c.default)(Bus,[{key:"addListener",value:function(e,t){var n=this,r=new d(n._subscriptions,e,t),o=n._subscriptions[e];return o||(o=[],n._subscriptions[e]=o),o.push(r),r}},{key:"addResponseListener",value:function(e,t,n){this._responseCallbacks[e+t]=n}},{key:"removeResponseListener",value:function(e,t){delete this._responseCallbacks[e+t]}},{key:"removeAllListenersOf",value:function(e){delete this._subscriptions[e]}},{key:"bind",value:function(e,t,n){var r=this,o=this;return{thisListener:o.addListener(e,function(e){n.postMessage(e)}),targetListener:n.addListener(t,function(e){o.postMessage(e)}),unbind:function(){r.thisListener.remove(),r.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(e){
//is there any "*" (default) listeners?
var t=this._subscriptions["*"];t&&this._publishOn(t,e)}},{key:"_publishOn",value:function(e,t){e.forEach(function(e){e._callback(t)})}},{key:"_responseCallback",value:function(e,t){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=this;
//automatic management of response handlers
if(t){var o=e.from+e.id;r._responseCallbacks[o]=t,n&&setTimeout(function(){var t=r._responseCallbacks[o];if(delete r._responseCallbacks[o],t){t({id:e.id,type:"response",body:{code:408,desc:"Response timeout!",value:e}})}},r._responseTimeOut)}}},{key:"_onResponse",value:function(e){var t=this;if("response"===e.type){var n=e.to+e.id,r=t._responseCallbacks[n];if(e.body.code>=200&&
//if it's a provisional response, don't delete response listener
delete t._responseCallbacks[n],r)return r(e),!0}return!1}},{key:"_onMessage",value:function(e){var t=this;if(!t._onResponse(e)){var n=t._subscriptions[e.to];n?t._publishOn(n,e):t._publishOnDefault(e)}}},{key:"_genId",value:function(e){
//TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
//Global counter will not work, because there will be multiple MiniBus instances!
//Per URL, can be a lot of data to maintain!
//Maybe a counter per MiniBus instance. This is the assumed solution for now.
e.id&&0!==e.id||(this._msgId++,e.id=this._msgId)}},{key:"postMessage",value:function(e,t){}},{key:"postMessageWithRetries",value:function(e,t,n){var r=this,i=0,u=function(){return new o.default(function(t,o){r.postMessage(e,function(r){408===r.body.code||500===r.body.code?o():(l.info("[Bus.postMessageWithRetries] msg delivered: ",e),n(r),t())})})};!function tryAgain(){u().then(function(){},function(){if(l.warn("[Bus.postMessageWithRetries] Message Bounced (retry "+i+"): '",e),!(i++<t)){var n="[Error] Message Bounced (delivery attempts "+t+"): '";throw new Error(n+e)}tryAgain()})}()}},{key:"_onPostMessage",value:function(e){}},{key:"_registerExternalListener",value:function(){}}]),Bus}(),d=function(){/* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */
function MsgListener(e,t,n){(0,u.default)(this,MsgListener);var r=this;r._subscriptions=e,r._url=t,r._callback=n}return(0,c.default)(MsgListener,[{key:"remove",/**
     * Remove this listener from the Bus
     */
value:function(){var e=this,t=e._subscriptions[e._url];if(t){var n=t.indexOf(e);t.splice(n,1),
//if there are no listeners, remove the subscription entirely.
0===t.length&&delete e._subscriptions[e._url]}}},{key:"url",get:function(){return this._url}}]),MsgListener}();t.default=p,e.exports=t.default},/* 117 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),o=_interopRequireDefault(r),i=n(12),u=_interopRequireDefault(i),s=function(){/* private
  _components: <url: instance>
  */
function SandboxRegistry(e){(0,o.default)(this,SandboxRegistry);var t=this;t._bus=e,t._components={},e.addListener(SandboxRegistry.InternalDeployAddress,function(e){
//console.log('SandboxRegistry-RCV: ', msg);
// let responseMsg = {
//   id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
// };
switch(e.type){case"create":t._onDeploy(e);break;case"delete":t._onRemove(e)}})}return(0,u.default)(SandboxRegistry,[{key:"_responseMsg",value:function(e,t,n){var r={id:e.id,type:"response",from:SandboxRegistry.InternalDeployAddress,to:SandboxRegistry.ExternalDeployAddress},o={};
// return messageFactory.createResponse(msg, code, value);
return t&&(o.code=t),n&&(o.desc=n),r.body=o,r}},{key:"_onDeploy",value:function(e){var t=this,n=e.body.config,r=e.body.url,o=e.body.sourceCode,i=void 0,u=void 0;if(t._components.hasOwnProperty(r))i=500,u="Instance "+r+" already exist!";else try{t._components[r]=t._create(r,o,n),i=200}catch(e){i=500,u=e}var s=t._responseMsg(e,i,u);t._bus.postMessage(s)}},{key:"_onRemove",value:function(e){var t=this,n=e.body.url,r=void 0,o=void 0;t._components.hasOwnProperty(n)?(
//remove component from the pool and all listeners
delete t._components[n],t._bus.removeAllListenersOf(n),r=200):(r=500,o="Instance "+n+" doesn't exist!");var i=t._responseMsg(e,r,o);t._bus.postMessage(i)}},{key:"_create",value:function(e,t,n){}},{key:"components",get:function(){return this._components}}]),SandboxRegistry}();s.ExternalDeployAddress="hyperty-runtime://sandbox/external",s.InternalDeployAddress="hyperty-runtime://sandbox/internal",t.default=s,e.exports=t.default},/* 118 */
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
,/* 131 */
,/* 132 */
,/* 133 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.SandboxRegistry=t.SandboxType=t.Sandbox=void 0;var r=n(134),o=_interopRequireDefault(r),i=n(117),u=_interopRequireDefault(i);t.Sandbox=o.default,t.SandboxType=r.SandboxType,t.SandboxRegistry=u.default},/* 134 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.SandboxType=void 0;var r=n(107),o=_interopRequireDefault(r),i=n(41),u=_interopRequireDefault(i),s=n(63),c=_interopRequireDefault(s),a=n(11),f=_interopRequireDefault(a),l=n(12),p=_interopRequireDefault(l),d=n(64),v=_interopRequireDefault(d),y=n(65),_=_interopRequireDefault(y),h=n(117),b=_interopRequireDefault(h),g=n(115),m=_interopRequireDefault(g),x=(t.SandboxType={APP:"app",NORMAL:"normal",WINDOW:"window"},function(e){function Sandbox(e){(0,f.default)(this,Sandbox);var t=(0,v.default)(this,(Sandbox.__proto__||(0,c.default)(Sandbox)).call(this)),n=t;return e&&(n.capabilities=e),t}/**
   * Deploy an instance of the component into the sandbox.
   * @param  {string} componentSourceCode Component source code (Hyperty, ProtoStub, etc)
   * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
   * @param  {Config} configuration Config parameters of the component
   * @return {Promise<string>} return deployed if successful, or any other string with an error
   */
return(0,_.default)(Sandbox,e),(0,p.default)(Sandbox,[{key:"deployComponent",value:function(e,t,n){var r=this;
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
n("undeployed"):r(e.body.desc)})})}},{key:"matches",value:function(e){var t=this,n=(0,o.default)(e).filter(function(n){return!(t.capabilities[n]&&t.capabilities[n]===e[n])});return 0===n.length||!e[n]}}]),Sandbox}(m.default));t.default=x}])});