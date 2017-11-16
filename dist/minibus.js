// version: 0.10.1
// date: Thu Nov 16 2017 15:04:05 GMT+0000 (WET)
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


// version: 0.10.1
// date: Thu Nov 16 2017 15:04:05 GMT+0000 (WET)
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
return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=135)}([/* 0 */
/***/
function(t,e){var n=t.exports={version:"2.5.1"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(t,e){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
/***/
function(t,e,n){var r=n(28)("wks"),o=n(19),i=n(1).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},/* 3 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(14),u=n(8),c=function(t,e,n){var s,f,a,l=t&c.F,p=t&c.G,v=t&c.S,d=t&c.P,h=t&c.B,_=t&c.W,y=p?o:o[e]||(o[e]={}),b=y.prototype,g=p?r:v?r[e]:(r[e]||{}).prototype;p&&(n=e);for(s in n)
// contains in native
(f=!l&&g&&void 0!==g[s])&&s in y||(
// export native or passed
a=f?g[s]:n[s],
// prevent global pollution for namespaces
y[s]=p&&"function"!=typeof g[s]?n[s]:h&&f?i(a,r):_&&g[s]==a?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(a):d&&"function"==typeof a?i(Function.call,a):a,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
d&&((y.virtual||(y.virtual={}))[s]=a,
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
t.exports=c},/* 4 */
/***/
function(t,e,n){var r=n(7);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},/* 5 */
/***/
function(t,e,n){
// Thank's IE8 for his funny defineProperty
t.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 6 */
/***/
function(t,e,n){var r=n(4),o=n(36),i=n(26),u=Object.defineProperty;e.f=n(5)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},/* 7 */
/***/
function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},/* 8 */
/***/
function(t,e,n){var r=n(6),o=n(18);t.exports=n(5)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},/* 9 */
/***/
function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},/* 10 */
/***/
function(t,e,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(57),o=n(22);t.exports=function(t){return r(o(t))}},/* 11 */
/***/
function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(60),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(t,e,n){return e&&defineProperties(t.prototype,e),n&&defineProperties(t,n),t}}()},/* 13 */
/***/
function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},/* 14 */
/***/
function(t,e,n){
// optional / simple context binding
var r=n(17);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},/* 15 */
/***/
function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},/* 16 */
/***/
function(t,e){t.exports={}},/* 17 */
/***/
function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},/* 18 */
/***/
function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},/* 19 */
/***/
function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},/* 20 */
/***/
function(t,e,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(37),o=n(29);t.exports=Object.keys||function(t){return r(t,o)}},/* 21 */
/***/
function(t,e){
// 7.1.4 ToInteger
var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},/* 22 */
/***/
function(t,e){
// 7.2.1 RequireObjectCoercible(argument)
t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},/* 23 */
/***/
function(t,e){t.exports=!0},/* 24 */
/***/
function(t,e,n){var r=n(6).f,o=n(9),i=n(2)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},/* 25 */
/***/
function(t,e,n){var r=n(7),o=n(1).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},/* 26 */
/***/
function(t,e,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(7);
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
var r=n(22);t.exports=function(t){return Object(r(t))}},/* 31 */
/***/
function(t,e,n){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var r=n(4),o=n(69),i=n(29),u=n(27)("IE_PROTO"),c=function(){},s=function(){
// Thrash, waste and sodomy: IE GC bug
var t,e=n(25)("iframe"),r=i.length;for(e.style.display="none",n(46).appendChild(e),e.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),s=t.F;r--;)delete s.prototype[i[r]];return s()};t.exports=Object.create||function(t,e){var n;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==t?(c.prototype=r(t),n=new c,c.prototype=null,n[u]=t):n=s(),void 0===e?n:o(n,e)}},/* 32 */
/***/
function(t,e,n){"use strict";function PromiseCapability(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r}),this.resolve=r(e),this.reject=r(n)}
// 25.4.1.5 NewPromiseCapability(C)
var r=n(17);t.exports.f=function(t){return new PromiseCapability(t)}},/* 33 */
/***/
function(t,e,n){e.f=n(2)},/* 34 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(23),u=n(33),c=n(6).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||c(e,t,{value:u.f(t)})}},/* 35 */
/***/
function(t,e){e.f={}.propertyIsEnumerable},/* 36 */
/***/
function(t,e,n){t.exports=!n(5)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 37 */
/***/
function(t,e,n){var r=n(9),o=n(10),i=n(58)(!1),u=n(27)("IE_PROTO");t.exports=function(t,e){var n,c=o(t),s=0,f=[];for(n in c)n!=u&&r(c,n)&&f.push(n);
// Don't enum bug & hidden keys
for(;e.length>s;)r(c,n=e[s++])&&(~i(f,n)||f.push(n));return f}},/* 38 */
/***/
function(t,e,n){
// 7.1.15 ToLength
var r=n(21),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},/* 39 */
/***/
function(t,e,n){
// most Object methods by ES6 should accept primitives
var r=n(3),o=n(0),i=n(13);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},/* 40 */
/***/
function(t,e,n){var r=n(35),o=n(18),i=n(10),u=n(26),c=n(9),s=n(36),f=Object.getOwnPropertyDescriptor;e.f=n(5)?f:function(t,e){if(t=i(t),e=u(e,!0),s)try{return f(t,e)}catch(t){}if(c(t,e))return o(!r.f.call(t,e),t[e])}},/* 41 */
/***/
function(t,e,n){t.exports={default:n(66),__esModule:!0}},/* 42 */
/***/
function(t,e){},/* 43 */
/***/
function(t,e,n){"use strict";var r=n(67)(!0);
// 21.1.3.27 String.prototype[@@iterator]()
n(44)(String,"String",function(t){this._t=String(t),// target
this._i=0},function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=r(e,n),this._i+=t.length,{value:t,done:!1})})},/* 44 */
/***/
function(t,e,n){"use strict";var r=n(23),o=n(3),i=n(45),u=n(8),c=n(9),s=n(16),f=n(68),a=n(24),l=n(47),p=n(2)("iterator"),v=!([].keys&&"next"in[].keys()),d=function(){return this};t.exports=function(t,e,n,h,_,y,b){f(n,e,h);var g,m,w,x=function(t){if(!v&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},O=e+" Iterator",M="values"==_,S=!1,P=t.prototype,L=P[p]||P["@@iterator"]||_&&P[_],j=L||x(_),k=_?M?x("entries"):j:void 0,E="Array"==e?P.entries||L:L;if(
// Fix native
E&&(w=l(E.call(new t)))!==Object.prototype&&w.next&&(
// Set @@toStringTag to native iterators
a(w,O,!0),
// fix for some old engines
r||c(w,p)||u(w,p,d)),
// fix Array#{values, @@iterator}.name in V8 / FF
M&&L&&"values"!==L.name&&(S=!0,j=function(){return L.call(this)}),
// Define iterator
r&&!b||!v&&!S&&P[p]||u(P,p,j),
// Plug for library
s[e]=j,s[O]=d,_)if(g={values:M?j:x("values"),keys:y?j:x("keys"),entries:k},b)for(m in g)m in P||i(P,m,g[m]);else o(o.P+o.F*(v||S),e,g);return g}},/* 45 */
/***/
function(t,e,n){t.exports=n(8)},/* 46 */
/***/
function(t,e,n){var r=n(1).document;t.exports=r&&r.documentElement},/* 47 */
/***/
function(t,e,n){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var r=n(9),o=n(30),i=n(27)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},/* 48 */
/***/
function(t,e,n){n(70);for(var r=n(1),o=n(8),i=n(16),u=n(2)("toStringTag"),c="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),s=0;s<c.length;s++){var f=c[s],a=r[f],l=a&&a.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},/* 49 */
/***/
function(t,e,n){
// getting tag from 19.1.3.6 Object.prototype.toString()
var r=n(15),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,c;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(c=r(e))&&"function"==typeof e.callee?"Arguments":c}},/* 50 */
/***/
function(t,e,n){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var r=n(4),o=n(17),i=n(2)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||void 0==(n=r(u)[i])?e:o(n)}},/* 51 */
/***/
function(t,e,n){var r,o,i,u=n(14),c=n(79),s=n(46),f=n(25),a=n(1),l=a.process,p=a.setImmediate,v=a.clearImmediate,d=a.MessageChannel,h=a.Dispatch,_=0,y={},b=function(){var t=+this;
// eslint-disable-next-line no-prototype-builtins
if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e()}},g=function(t){b.call(t.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&v||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++_]=function(){
// eslint-disable-next-line no-new-func
c("function"==typeof t?t:Function(t),e)},r(_),_},v=function(t){delete y[t]},
// Node.js 0.8-
"process"==n(15)(l)?r=function(t){l.nextTick(u(b,t,1))}:h&&h.now?r=function(t){h.now(u(b,t,1))}:d?(o=new d,i=o.port2,o.port1.onmessage=g,r=u(i.postMessage,i,1)):a.addEventListener&&"function"==typeof postMessage&&!a.importScripts?(r=function(t){a.postMessage(t+"","*")},a.addEventListener("message",g,!1)):r="onreadystatechange"in f("script")?function(t){s.appendChild(f("script")).onreadystatechange=function(){s.removeChild(this),b.call(t)}}:function(t){setTimeout(u(b,t,1),0)}),t.exports={set:p,clear:v}},/* 52 */
/***/
function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},/* 53 */
/***/
function(t,e,n){var r=n(4),o=n(7),i=n(32);t.exports=function(t,e){if(r(t),o(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},/* 54 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(89),o=_interopRequireDefault(r),i=n(91),u=_interopRequireDefault(i),c="function"==typeof u.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":typeof t};e.default="function"==typeof u.default&&"symbol"===c(o.default)?function(t){return void 0===t?"undefined":c(t)}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":void 0===t?"undefined":c(t)}},/* 55 */
/***/
function(t,e){e.f=Object.getOwnPropertySymbols},/* 56 */
/***/
function(t,e,n){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var r=n(37),o=n(29).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},/* 57 */
/***/
function(t,e,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(15);
// eslint-disable-next-line no-prototype-builtins
t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},/* 58 */
/***/
function(t,e,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(10),o=n(38),i=n(59);t.exports=function(t){return function(e,n,u){var c,s=r(e),f=o(s.length),a=i(u,f);
// Array#includes uses SameValueZero equality algorithm
// eslint-disable-next-line no-self-compare
if(t&&n!=n){for(;f>a;)
// eslint-disable-next-line no-self-compare
if((c=s[a++])!=c)return!0}else for(;f>a;a++)if((t||a in s)&&s[a]===n)return t||a||0;return!t&&-1}}},/* 59 */
/***/
function(t,e,n){var r=n(21),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},/* 60 */
/***/
function(t,e,n){t.exports={default:n(61),__esModule:!0}},/* 61 */
/***/
function(t,e,n){n(62);var r=n(0).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},/* 62 */
/***/
function(t,e,n){var r=n(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(5),"Object",{defineProperty:n(6).f})},/* 63 */
/***/
function(t,e,n){t.exports={default:n(87),__esModule:!0}},/* 64 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(54),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==(void 0===e?"undefined":(0,o.default)(e))&&"function"!=typeof e?t:e}},/* 65 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(100),o=_interopRequireDefault(r),i=n(104),u=_interopRequireDefault(i),c=n(54),s=_interopRequireDefault(c);e.default=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,s.default)(e)));t.prototype=(0,u.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.default?(0,o.default)(t,e):t.__proto__=e)}},/* 66 */
/***/
function(t,e,n){n(42),n(43),n(48),n(73),n(84),n(85),t.exports=n(0).Promise},/* 67 */
/***/
function(t,e,n){var r=n(21),o=n(22);
// true  -> String#at
// false -> String#codePointAt
t.exports=function(t){return function(e,n){var i,u,c=String(o(e)),s=r(n),f=c.length;return s<0||s>=f?t?"":void 0:(i=c.charCodeAt(s),i<55296||i>56319||s+1===f||(u=c.charCodeAt(s+1))<56320||u>57343?t?c.charAt(s):i:t?c.slice(s,s+2):u-56320+(i-55296<<10)+65536)}}},/* 68 */
/***/
function(t,e,n){"use strict";var r=n(31),o=n(18),i=n(24),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
n(8)(u,n(2)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},/* 69 */
/***/
function(t,e,n){var r=n(6),o=n(4),i=n(20);t.exports=n(5)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),c=u.length,s=0;c>s;)r.f(t,n=u[s++],e[n]);return t}},/* 70 */
/***/
function(t,e,n){"use strict";var r=n(71),o=n(72),i=n(16),u=n(10);
// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
t.exports=n(44)(Array,"Array",function(t,e){this._t=u(t),// target
this._i=0,// next index
this._k=e},function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,o(1)):"keys"==e?o(0,n):"values"==e?o(0,t[n]):o(0,[n,t[n]])},"values"),
// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
i.Arguments=i.Array,r("keys"),r("values"),r("entries")},/* 71 */
/***/
function(t,e){t.exports=function(){}},/* 72 */
/***/
function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},/* 73 */
/***/
function(t,e,n){"use strict";var r,o,i,u,c=n(23),s=n(1),f=n(14),a=n(49),l=n(3),p=n(7),v=n(17),d=n(74),h=n(75),_=n(50),y=n(51).set,b=n(80)(),g=n(32),m=n(52),w=n(53),x=s.TypeError,O=s.process,M=s.Promise,S="process"==a(O),P=function(){},L=o=g.f,j=!!function(){try{
// correct subclassing with @@species support
var t=M.resolve(1),e=(t.constructor={})[n(2)("species")]=function(t){t(P,P)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(S||"function"==typeof PromiseRejectionEvent)&&t.then(P)instanceof e}catch(t){}}(),k=function(t){var e;return!(!p(t)||"function"!=typeof(e=t.then))&&e},E=function(t,e){if(!t._n){t._n=!0;var n=t._c;b(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u=o?e.ok:e.fail,c=e.resolve,s=e.reject,f=e.domain;try{u?(o||(2==t._h&&C(t),t._h=1),!0===u?n=r:(f&&f.enter(),n=u(r),f&&f.exit()),n===e.promise?s(x("Promise-chain cycle")):(i=k(n))?i.call(n,c,s):c(n)):s(r)}catch(t){s(t)}}(n[i++]);// variable length - can't use forEach
t._c=[],t._n=!1,e&&!t._h&&R(t)})}},R=function(t){y.call(s,function(){var e,n,r,o=t._v,i=T(t);if(i&&(e=m(function(){S?O.emit("unhandledRejection",o,t):(n=s.onunhandledrejection)?n({promise:t,reason:o}):(r=s.console)&&r.error&&r.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
t._h=S||T(t)?2:1),t._a=void 0,i&&e.e)throw e.v})},T=function(t){if(1==t._h)return!1;for(var e,n=t._a||t._c,r=0;n.length>r;)if(e=n[r++],e.fail||!T(e.promise))return!1;return!0},C=function(t){y.call(s,function(){var e;S?O.emit("rejectionHandled",t):(e=s.onrejectionhandled)&&e({promise:t,reason:t._v})})},A=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,// unwrap
e._v=t,e._s=2,e._a||(e._a=e._c.slice()),E(e,!0))},D=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;// unwrap
try{if(n===t)throw x("Promise can't be resolved itself");(e=k(t))?b(function(){var r={_w:n,_d:!1};// wrap
try{e.call(t,f(D,r,1),f(A,r,1))}catch(t){A.call(r,t)}}):(n._v=t,n._s=1,E(n,!1))}catch(t){A.call({_w:n,_d:!1},t)}}};
// constructor polyfill
j||(
// 25.4.3.1 Promise(executor)
M=function(t){d(this,M,"Promise","_h"),v(t),r.call(this);try{t(f(D,this,1),f(A,this,1))}catch(t){A.call(this,t)}},
// eslint-disable-next-line no-unused-vars
r=function(t){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},r.prototype=n(81)(M.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(t,e){var n=L(_(this,M));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=S?O.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&E(this,!1),n.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(t){return this.then(void 0,t)}}),i=function(){var t=new r;this.promise=t,this.resolve=f(D,t,1),this.reject=f(A,t,1)},g.f=L=function(t){return t===M||t===u?new i(t):o(t)}),l(l.G+l.W+l.F*!j,{Promise:M}),n(24)(M,"Promise"),n(82)("Promise"),u=n(0).Promise,
// statics
l(l.S+l.F*!j,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(t){var e=L(this);return(0,e.reject)(t),e.promise}}),l(l.S+l.F*(c||!j),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(t){return w(c&&this===u?M:this,t)}}),l(l.S+l.F*!(j&&n(83)(function(t){M.all(t).catch(P)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(t){var e=this,n=L(e),r=n.resolve,o=n.reject,i=m(function(){var n=[],i=0,u=1;h(t,!1,function(t){var c=i++,s=!1;n.push(void 0),u++,e.resolve(t).then(function(t){s||(s=!0,n[c]=t,--u||r(n))},o)}),--u||r(n)});return i.e&&o(i.v),n.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(t){var e=this,n=L(e),r=n.reject,o=m(function(){h(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o.e&&r(o.v),n.promise}})},/* 74 */
/***/
function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},/* 75 */
/***/
function(t,e,n){var r=n(14),o=n(76),i=n(77),u=n(4),c=n(38),s=n(78),f={},a={},e=t.exports=function(t,e,n,l,p){var v,d,h,_,y=p?function(){return t}:s(t),b=r(n,l,e?2:1),g=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");
// fast case for arrays with default iterator
if(i(y)){for(v=c(t.length);v>g;g++)if((_=e?b(u(d=t[g])[0],d[1]):b(t[g]))===f||_===a)return _}else for(h=y.call(t);!(d=h.next()).done;)if((_=o(h,b,d.value,e))===f||_===a)return _};e.BREAK=f,e.RETURN=a},/* 76 */
/***/
function(t,e,n){
// call something on iterator step with safe closing on error
var r=n(4);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},/* 77 */
/***/
function(t,e,n){
// check on default Array iterator
var r=n(16),o=n(2)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},/* 78 */
/***/
function(t,e,n){var r=n(49),o=n(2)("iterator"),i=n(16);t.exports=n(0).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},/* 79 */
/***/
function(t,e){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},/* 80 */
/***/
function(t,e,n){var r=n(1),o=n(51).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,c=r.Promise,s="process"==n(15)(u);t.exports=function(){var t,e,n,f=function(){var r,o;for(s&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};
// Node.js
if(s)n=function(){u.nextTick(f)};else if(i){var a=!0,l=document.createTextNode("");new i(f).observe(l,{characterData:!0}),// eslint-disable-line no-new
n=function(){l.data=a=!a}}else if(c&&c.resolve){var p=c.resolve();n=function(){p.then(f)}}else n=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(r,f)};return function(r){var o={fn:r,next:void 0};e&&(e.next=o),t||(t=o,n()),e=o}}},/* 81 */
/***/
function(t,e,n){var r=n(8);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},/* 82 */
/***/
function(t,e,n){"use strict";var r=n(1),o=n(0),i=n(6),u=n(5),c=n(2)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[c]&&i.f(e,c,{configurable:!0,get:function(){return this}})}},/* 83 */
/***/
function(t,e,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},
// eslint-disable-next-line no-throw-literal
Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},/* 84 */
/***/
function(t,e,n){"use strict";
// https://github.com/tc39/proposal-promise-finally
var r=n(3),o=n(0),i=n(1),u=n(50),c=n(53);r(r.P+r.R,"Promise",{finally:function(t){var e=u(this,o.Promise||i.Promise),n="function"==typeof t;return this.then(n?function(n){return c(e,t()).then(function(){return n})}:t,n?function(n){return c(e,t()).then(function(){throw n})}:t)}})},/* 85 */
/***/
function(t,e,n){"use strict";
// https://github.com/tc39/proposal-promise-try
var r=n(3),o=n(32),i=n(52);r(r.S,"Promise",{try:function(t){var e=o.f(this),n=i(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},/* 86 */
/***/
function(t,e,n){var r,o;/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
!function(i,u){"use strict";r=u,void 0!==(o="function"==typeof r?r.call(e,n,e,t):r)&&(t.exports=o)}(0,function(){"use strict";
// Cross-browser bind equivalent that works at least back to IE6
function bindMethod(t,e){var n=t[e];if("function"==typeof n.bind)return n.bind(t);try{return Function.prototype.bind.call(n,t)}catch(e){
// Missing bind shim or IE8 + Modernizr, fallback to wrapping
return function(){return Function.prototype.apply.apply(n,[t,arguments])}}}
// Build the best logging method possible for this env
// Wherever possible we want to bind, not wrap, to preserve stack traces
function realMethod(n){return"debug"===n&&(n="log"),typeof console!==e&&(void 0!==console[n]?bindMethod(console,n):void 0!==console.log?bindMethod(console,"log"):t)}
// These private functions always need `this` to be set properly
function replaceLoggingMethods(e,r){/*jshint validthis:true */
for(var o=0;o<n.length;o++){var i=n[o];this[i]=o<e?t:this.methodFactory(i,e,r)}
// Define log.log as an alias for log.debug
this.log=this.debug}
// In old IE versions, the console isn't present until you first open it.
// We build realMethod() replacements here that regenerate logging methods
function enableLoggingWhenConsoleArrives(t,n,r){return function(){typeof console!==e&&(replaceLoggingMethods.call(this,n,r),this[t].apply(this,arguments))}}
// By default, we use closely bound real methods wherever possible, and
// otherwise we wait for a console to appear, and then try again.
function defaultMethodFactory(t,e,n){/*jshint validthis:true */
return realMethod(t)||enableLoggingWhenConsoleArrives.apply(this,arguments)}function Logger(t,r,o){function persistLevelIfPossible(t){var r=(n[t]||"silent").toUpperCase();if(typeof window!==e){
// Use localStorage if available
try{return void(window.localStorage[c]=r)}catch(t){}
// Use session cookie as fallback
try{window.document.cookie=encodeURIComponent(c)+"="+r+";"}catch(t){}}}function getPersistedLevel(){var t;if(typeof window!==e){try{t=window.localStorage[c]}catch(t){}
// Fallback to cookies if local storage gives us nothing
if(typeof t===e)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(c)+"=");-1!==r&&(t=/^([^;]+)/.exec(n.slice(r))[1])}catch(t){}
// If the stored level is not valid, treat it as if nothing was stored.
return void 0===u.levels[t]&&(t=void 0),t}}var i,u=this,c="loglevel";t&&(c+=":"+t),/*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */
u.name=t,u.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},u.methodFactory=o||defaultMethodFactory,u.getLevel=function(){return i},u.setLevel=function(n,r){if("string"==typeof n&&void 0!==u.levels[n.toUpperCase()]&&(n=u.levels[n.toUpperCase()]),!("number"==typeof n&&n>=0&&n<=u.levels.SILENT))throw"log.setLevel() called with invalid level: "+n;if(i=n,!1!==r&&// defaults to true
persistLevelIfPossible(n),replaceLoggingMethods.call(u,n,t),typeof console===e&&n<u.levels.SILENT)return"No console available for logging"},u.setDefaultLevel=function(t){getPersistedLevel()||u.setLevel(t,!1)},u.enableAll=function(t){u.setLevel(u.levels.TRACE,t)},u.disableAll=function(t){u.setLevel(u.levels.SILENT,t)};
// Initialize with the right level
var s=getPersistedLevel();null==s&&(s=null==r?"WARN":r),u.setLevel(s,!1)}
// Slightly dubious tricks to cut down minimized file size
var t=function(){},e="undefined",n=["trace","debug","info","warn","error"],r=new Logger,o={};r.getLogger=function(t){if("string"!=typeof t||""===t)throw new TypeError("You must supply a name when creating a logger.");var e=o[t];return e||(e=o[t]=new Logger(t,r.getLevel(),r.methodFactory)),e};
// Grab the current global log variable in case of overwrite
var i=typeof window!==e?window.log:void 0;return r.noConflict=function(){return typeof window!==e&&window.log===r&&(window.log=i),r},r.getLoggers=function(){return o},r})},/* 87 */
/***/
function(t,e,n){n(88),t.exports=n(0).Object.getPrototypeOf},/* 88 */
/***/
function(t,e,n){
// 19.1.2.9 Object.getPrototypeOf(O)
var r=n(30),o=n(47);n(39)("getPrototypeOf",function(){return function(t){return o(r(t))}})},/* 89 */
/***/
function(t,e,n){t.exports={default:n(90),__esModule:!0}},/* 90 */
/***/
function(t,e,n){n(43),n(48),t.exports=n(33).f("iterator")},/* 91 */
/***/
function(t,e,n){t.exports={default:n(92),__esModule:!0}},/* 92 */
/***/
function(t,e,n){n(93),n(42),n(98),n(99),t.exports=n(0).Symbol},/* 93 */
/***/
function(t,e,n){"use strict";
// ECMAScript 6 symbols shim
var r=n(1),o=n(9),i=n(5),u=n(3),c=n(45),s=n(94).KEY,f=n(13),a=n(28),l=n(24),p=n(19),v=n(2),d=n(33),h=n(34),_=n(95),y=n(96),b=n(4),g=n(10),m=n(26),w=n(18),x=n(31),O=n(97),M=n(40),S=n(6),P=n(20),L=M.f,j=S.f,k=O.f,E=r.Symbol,R=r.JSON,T=R&&R.stringify,C=v("_hidden"),A=v("toPrimitive"),D={}.propertyIsEnumerable,F=a("symbol-registry"),q=a("symbols"),I=a("op-symbols"),N=Object.prototype,B="function"==typeof E,W=r.QObject,G=!W||!W.prototype||!W.prototype.findChild,U=i&&f(function(){return 7!=x(j({},"a",{get:function(){return j(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=L(N,e);r&&delete N[e],j(t,e,n),r&&t!==N&&j(N,e,r)}:j,V=function(t){var e=q[t]=x(E.prototype);return e._k=t,e},H=B&&"symbol"==typeof E.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof E},K=function(t,e,n){return t===N&&K(I,e,n),b(t),e=m(e,!0),b(n),o(q,e)?(n.enumerable?(o(t,C)&&t[C][e]&&(t[C][e]=!1),n=x(n,{enumerable:w(0,!1)})):(o(t,C)||j(t,C,w(1,{})),t[C][e]=!0),U(t,e,n)):j(t,e,n)},J=function(t,e){b(t);for(var n,r=_(e=g(e)),o=0,i=r.length;i>o;)K(t,n=r[o++],e[n]);return t},Y=function(t,e){return void 0===e?x(t):J(x(t),e)},z=function(t){var e=D.call(this,t=m(t,!0));return!(this===N&&o(q,t)&&!o(I,t))&&(!(e||!o(this,t)||!o(q,t)||o(this,C)&&this[C][t])||e)},Q=function(t,e){if(t=g(t),e=m(e,!0),t!==N||!o(q,e)||o(I,e)){var n=L(t,e);return!n||!o(q,e)||o(t,C)&&t[C][e]||(n.enumerable=!0),n}},X=function(t){for(var e,n=k(g(t)),r=[],i=0;n.length>i;)o(q,e=n[i++])||e==C||e==s||r.push(e);return r},Z=function(t){for(var e,n=t===N,r=k(n?I:g(t)),i=[],u=0;r.length>u;)!o(q,e=r[u++])||n&&!o(N,e)||i.push(q[e]);return i};
// 19.4.1.1 Symbol([description])
B||(E=function(){if(this instanceof E)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===N&&e.call(I,n),o(this,C)&&o(this[C],t)&&(this[C][t]=!1),U(this,t,w(1,n))};return i&&G&&U(N,t,{configurable:!0,set:e}),V(t)},c(E.prototype,"toString",function(){return this._k}),M.f=Q,S.f=K,n(56).f=O.f=X,n(35).f=z,n(55).f=Z,i&&!n(23)&&c(N,"propertyIsEnumerable",z,!0),d.f=function(t){return V(v(t))}),u(u.G+u.W+u.F*!B,{Symbol:E});for(var $="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),tt=0;$.length>tt;)v($[tt++]);for(var et=P(v.store),nt=0;et.length>nt;)h(et[nt++]);u(u.S+u.F*!B,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(t){return o(F,t+="")?F[t]:F[t]=E(t)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(t){if(!H(t))throw TypeError(t+" is not a symbol!");for(var e in F)if(F[e]===t)return e},useSetter:function(){G=!0},useSimple:function(){G=!1}}),u(u.S+u.F*!B,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:Y,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:K,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:J,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:Q,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:X,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:Z}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
R&&u(u.S+u.F*(!B||f(function(){var t=E();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=T([t])||"{}"!=T({a:t})||"{}"!=T(Object(t))})),"JSON",{stringify:function(t){if(void 0!==t&&!H(t)){for(// IE8 returns string on undefined
var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);return e=r[1],"function"==typeof e&&(n=e),!n&&y(e)||(e=function(t,e){if(n&&(e=n.call(this,t,e)),!H(e))return e}),r[1]=e,T.apply(R,r)}}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
E.prototype[A]||n(8)(E.prototype,A,E.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(E,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(r.JSON,"JSON",!0)},/* 94 */
/***/
function(t,e,n){var r=n(19)("meta"),o=n(7),i=n(9),u=n(6).f,c=0,s=Object.isExtensible||function(){return!0},f=!n(13)(function(){return s(Object.preventExtensions({}))}),a=function(t){u(t,r,{value:{i:"O"+ ++c,// object ID
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
a(t)}return t[r].w},v=function(t){return f&&d.NEED&&s(t)&&!i(t,r)&&a(t),t},d=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:v}},/* 95 */
/***/
function(t,e,n){
// all enumerable object keys, includes symbols
var r=n(20),o=n(55),i=n(35);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,c=n(t),s=i.f,f=0;c.length>f;)s.call(t,u=c[f++])&&e.push(u);return e}},/* 96 */
/***/
function(t,e,n){
// 7.2.2 IsArray(argument)
var r=n(15);t.exports=Array.isArray||function(t){return"Array"==r(t)}},/* 97 */
/***/
function(t,e,n){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var r=n(10),o=n(56).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],c=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?c(t):o(r(t))}},/* 98 */
/***/
function(t,e,n){n(34)("asyncIterator")},/* 99 */
/***/
function(t,e,n){n(34)("observable")},/* 100 */
/***/
function(t,e,n){t.exports={default:n(101),__esModule:!0}},/* 101 */
/***/
function(t,e,n){n(102),t.exports=n(0).Object.setPrototypeOf},/* 102 */
/***/
function(t,e,n){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var r=n(3);r(r.S,"Object",{setPrototypeOf:n(103).set})},/* 103 */
/***/
function(t,e,n){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var r=n(7),o=n(4),i=function(t,e){if(o(t),!r(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(t,e,r){try{r=n(14)(Function.call,n(40).f(Object.prototype,"__proto__").set,2),r(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return i(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:i}},/* 104 */
/***/
function(t,e,n){t.exports={default:n(105),__esModule:!0}},/* 105 */
/***/
function(t,e,n){n(106);var r=n(0).Object;t.exports=function(t,e){return r.create(t,e)}},/* 106 */
/***/
function(t,e,n){var r=n(3);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
r(r.S,"Object",{create:n(31)})},/* 107 */
,/* 108 */
,/* 109 */
,/* 110 */
,/* 111 */
,/* 112 */
,/* 113 */
,/* 114 */
,/* 115 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(63),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),c=n(12),s=_interopRequireDefault(c),f=n(64),a=_interopRequireDefault(f),l=n(65),p=_interopRequireDefault(l),v=n(116),d=_interopRequireDefault(v),h=function(t){function MiniBus(){return(0,u.default)(this,MiniBus),(0,a.default)(this,(MiniBus.__proto__||(0,o.default)(MiniBus)).call(this))}/**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
return(0,p.default)(MiniBus,t),(0,s.default)(MiniBus,[{key:"postMessage",value:function(t,e){var n=this;
//always send to external (to core MessageBus)
return n._genId(t),n._responseCallback(t,e),n._onPostMessage(t),t.id}},{key:"_onMessage",value:function(t){var e=this;if(!e._onResponse(t)){var n=e._subscriptions[t.to];n?(e._publishOn(n,t),t.to.startsWith("hyperty")||e._publishOnDefault(t)):e._publishOnDefault(t)}}}]),MiniBus}(d.default);/**
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
e.default=h,t.exports=e.default},/* 116 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(41),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),c=n(12),s=_interopRequireDefault(c),f=n(86),a=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(f),l=a.getLogger("Bus"),p=function(){/* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   */
function Bus(){(0,u.default)(this,Bus);var t=this;t._msgId=0,t._subscriptions={},t._responseTimeOut=15e3,//default to 3s
t._responseCallbacks={},t._registerExternalListener()}/**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
return(0,s.default)(Bus,[{key:"addListener",value:function(t,e){var n=this,r=new v(n._subscriptions,t,e),o=n._subscriptions[t];return o||(o=[],n._subscriptions[t]=o),o.push(r),r}},{key:"addResponseListener",value:function(t,e,n){this._responseCallbacks[t+e]=n}},{key:"removeResponseListener",value:function(t,e){delete this._responseCallbacks[t+e]}},{key:"removeAllListenersOf",value:function(t){delete this._subscriptions[t]}},{key:"bind",value:function(t,e,n){var r=this,o=this;return{thisListener:o.addListener(t,function(t){n.postMessage(t)}),targetListener:n.addListener(e,function(t){o.postMessage(t)}),unbind:function(){r.thisListener.remove(),r.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(t){
//is there any "*" (default) listeners?
var e=this._subscriptions["*"];e&&this._publishOn(e,t)}},{key:"_publishOn",value:function(t,e){t.forEach(function(t){t._callback(e)})}},{key:"_responseCallback",value:function(t,e){var n=this;
//automatic management of response handlers
if(e){var r=t.from+t.id;n._responseCallbacks[r]=e,setTimeout(function(){var e=n._responseCallbacks[r];if(delete n._responseCallbacks[r],e){e({id:t.id,type:"response",body:{code:408,desc:"Response timeout!",value:t}})}},n._responseTimeOut)}}},{key:"_onResponse",value:function(t){var e=this;if("response"===t.type){var n=t.to+t.id,r=e._responseCallbacks[n];if(t.body.code>=200&&
//if it's a provisional response, don't delete response listener
delete e._responseCallbacks[n],r)return r(t),!0}return!1}},{key:"_onMessage",value:function(t){var e=this;if(!e._onResponse(t)){var n=e._subscriptions[t.to];n?e._publishOn(n,t):e._publishOnDefault(t)}}},{key:"_genId",value:function(t){
//TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
//Global counter will not work, because there will be multiple MiniBus instances!
//Per URL, can be a lot of data to maintain!
//Maybe a counter per MiniBus instance. This is the assumed solution for now.
t.id&&0!==t.id||(this._msgId++,t.id=this._msgId)}},{key:"postMessage",value:function(t,e){}},{key:"postMessageWithRetries",value:function(t,e,n){var r=this,i=0,u=function(){return new o.default(function(e,o){r.postMessage(t,function(r){408===r.body.code||500===r.body.code?o():(l.info("[Bus.postMessageWithRetries] msg delivered: ",t),n(r),e())})})};!function tryAgain(){u().then(function(){},function(){if(l.warn("[Bus.postMessageWithRetries] Message Bounced (retry "+i+"): '",t),!(i++<e)){var n="[Error] Message Bounced (delivery attempts "+e+"): '";throw new Error(n+t)}tryAgain()})}()}},{key:"_onPostMessage",value:function(t){}},{key:"_registerExternalListener",value:function(){}}]),Bus}(),v=function(){/* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */
function MsgListener(t,e,n){(0,u.default)(this,MsgListener);var r=this;r._subscriptions=t,r._url=e,r._callback=n}return(0,s.default)(MsgListener,[{key:"remove",/**
     * Remove this listener from the Bus
     */
value:function(){var t=this,e=t._subscriptions[t._url];if(e){var n=e.indexOf(t);e.splice(n,1),
//if there are no listeners, remove the subscription entirely.
0===e.length&&delete t._subscriptions[t._url]}}},{key:"url",get:function(){return this._url}}]),MsgListener}();e.default=p,t.exports=e.default},/* 117 */
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
,/* 131 */
,/* 132 */
,/* 133 */
,/* 134 */
,/* 135 */
/***/
function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(115),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=o.default,/**
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