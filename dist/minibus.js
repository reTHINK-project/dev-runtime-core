// version: 0.12.0
// date: Mon Jul 30 2018 14:37:21 GMT+0100 (WEST)
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


// version: 0.12.0
// date: Mon Jul 30 2018 14:37:21 GMT+0100 (WEST)
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


!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("minibus",[],e):"object"==typeof exports?exports.minibus=e():t.minibus=e()}("undefined"!=typeof self?self:this,function(){/******/
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
return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=136)}([/* 0 */
/***/
function(t,e){var n=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(t,e){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
/***/
function(t,e,n){var r=n(28)("wks"),o=n(20),i=n(1).Symbol,u="function"==typeof i;(t.exports=function(t){return r[t]||(r[t]=u&&i[t]||(u?i:o)("Symbol."+t))}).store=r},/* 3 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(15),u=n(9),s=n(8),c=function(t,e,n){var f,a,l,p=t&c.F,v=t&c.G,d=t&c.S,h=t&c.P,y=t&c.B,_=t&c.W,b=v?o:o[e]||(o[e]={}),g=b.prototype,m=v?r:d?r[e]:(r[e]||{}).prototype;v&&(n=e);for(f in n)
// contains in native
(a=!p&&m&&void 0!==m[f])&&s(b,f)||(
// export native or passed
l=a?m[f]:n[f],
// prevent global pollution for namespaces
b[f]=v&&"function"!=typeof m[f]?n[f]:y&&a?i(l,r):_&&m[f]==l?function(t){var e=function(e,n,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(e);case 2:return new t(e,n)}return new t(e,n,r)}return t.apply(this,arguments)};return e.prototype=t.prototype,e}(l):h&&"function"==typeof l?i(Function.call,l):l,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
h&&((b.virtual||(b.virtual={}))[f]=l,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
t&c.R&&g&&!g[f]&&u(g,f,l)))};
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
function(t,e,n){var r=n(6);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},/* 5 */
/***/
function(t,e,n){
// Thank's IE8 for his funny defineProperty
t.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 6 */
/***/
function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},/* 7 */
/***/
function(t,e,n){var r=n(4),o=n(36),i=n(26),u=Object.defineProperty;e.f=n(5)?Object.defineProperty:function(t,e,n){if(r(t),e=i(e,!0),r(n),o)try{return u(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},/* 8 */
/***/
function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},/* 9 */
/***/
function(t,e,n){var r=n(7),o=n(19);t.exports=n(5)?function(t,e,n){return r.f(t,e,o(1,n))}:function(t,e,n){return t[e]=n,t}},/* 10 */
/***/
function(t,e,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(57),o=n(23);t.exports=function(t){return r(o(t))}},/* 11 */
/***/
function(t,e,n){"use strict";e.__esModule=!0,e.default=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(60),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(){function defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,o.default)(t,r.key,r)}}return function(t,e,n){return e&&defineProperties(t.prototype,e),n&&defineProperties(t,n),t}}()},/* 13 */
/***/
function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},/* 14 */
/***/
function(t,e){t.exports=!0},/* 15 */
/***/
function(t,e,n){
// optional / simple context binding
var r=n(18);t.exports=function(t,e,n){if(r(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,r){return t.call(e,n,r)};case 3:return function(n,r,o){return t.call(e,n,r,o)}}return function(){return t.apply(e,arguments)}}},/* 16 */
/***/
function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},/* 17 */
/***/
function(t,e){t.exports={}},/* 18 */
/***/
function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},/* 19 */
/***/
function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},/* 20 */
/***/
function(t,e){var n=0,r=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+r).toString(36))}},/* 21 */
/***/
function(t,e,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(37),o=n(29);t.exports=Object.keys||function(t){return r(t,o)}},/* 22 */
/***/
function(t,e){
// 7.1.4 ToInteger
var n=Math.ceil,r=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?r:n)(t)}},/* 23 */
/***/
function(t,e){
// 7.2.1 RequireObjectCoercible(argument)
t.exports=function(t){if(void 0==t)throw TypeError("Can't call method on  "+t);return t}},/* 24 */
/***/
function(t,e,n){var r=n(7).f,o=n(8),i=n(2)("toStringTag");t.exports=function(t,e,n){t&&!o(t=n?t:t.prototype,i)&&r(t,i,{configurable:!0,value:e})}},/* 25 */
/***/
function(t,e,n){var r=n(6),o=n(1).document,i=r(o)&&r(o.createElement);t.exports=function(t){return i?o.createElement(t):{}}},/* 26 */
/***/
function(t,e,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(6);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
t.exports=function(t,e){if(!r(t))return t;var n,o;if(e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;if("function"==typeof(n=t.valueOf)&&!r(o=n.call(t)))return o;if(!e&&"function"==typeof(n=t.toString)&&!r(o=n.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(t,e,n){var r=n(28)("keys"),o=n(20);t.exports=function(t){return r[t]||(r[t]=o(t))}},/* 28 */
/***/
function(t,e,n){var r=n(0),o=n(1),i=o["__core-js_shared__"]||(o["__core-js_shared__"]={});(t.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:r.version,mode:n(14)?"pure":"global",copyright:"© 2018 Denis Pushkarev (zloirock.ru)"})},/* 29 */
/***/
function(t,e){
// IE 8- don't enum bug keys
t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(t,e,n){
// 7.1.13 ToObject(argument)
var r=n(23);t.exports=function(t){return Object(r(t))}},/* 31 */
/***/
function(t,e,n){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var r=n(4),o=n(69),i=n(29),u=n(27)("IE_PROTO"),s=function(){},c=function(){
// Thrash, waste and sodomy: IE GC bug
var t,e=n(25)("iframe"),r=i.length;for(e.style.display="none",n(46).appendChild(e),e.src="javascript:",// eslint-disable-line no-script-url
// createDict = iframe.contentWindow.Object;
// html.removeChild(iframe);
t=e.contentWindow.document,t.open(),t.write("<script>document.F=Object<\/script>"),t.close(),c=t.F;r--;)delete c.prototype[i[r]];return c()};t.exports=Object.create||function(t,e){var n;
// add "__proto__" for Object.getPrototypeOf polyfill
return null!==t?(s.prototype=r(t),n=new s,s.prototype=null,n[u]=t):n=c(),void 0===e?n:o(n,e)}},/* 32 */
/***/
function(t,e,n){"use strict";function PromiseCapability(t){var e,n;this.promise=new t(function(t,r){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=r}),this.resolve=r(e),this.reject=r(n)}
// 25.4.1.5 NewPromiseCapability(C)
var r=n(18);t.exports.f=function(t){return new PromiseCapability(t)}},/* 33 */
/***/
function(t,e,n){e.f=n(2)},/* 34 */
/***/
function(t,e,n){var r=n(1),o=n(0),i=n(14),u=n(33),s=n(7).f;t.exports=function(t){var e=o.Symbol||(o.Symbol=i?{}:r.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:u.f(t)})}},/* 35 */
/***/
function(t,e){e.f={}.propertyIsEnumerable},/* 36 */
/***/
function(t,e,n){t.exports=!n(5)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 37 */
/***/
function(t,e,n){var r=n(8),o=n(10),i=n(58)(!1),u=n(27)("IE_PROTO");t.exports=function(t,e){var n,s=o(t),c=0,f=[];for(n in s)n!=u&&r(s,n)&&f.push(n);
// Don't enum bug & hidden keys
for(;e.length>c;)r(s,n=e[c++])&&(~i(f,n)||f.push(n));return f}},/* 38 */
/***/
function(t,e,n){
// 7.1.15 ToLength
var r=n(22),o=Math.min;t.exports=function(t){return t>0?o(r(t),9007199254740991):0}},/* 39 */
/***/
function(t,e,n){
// most Object methods by ES6 should accept primitives
var r=n(3),o=n(0),i=n(13);t.exports=function(t,e){var n=(o.Object||{})[t]||Object[t],u={};u[t]=e(n),r(r.S+r.F*i(function(){n(1)}),"Object",u)}},/* 40 */
/***/
function(t,e,n){var r=n(35),o=n(19),i=n(10),u=n(26),s=n(8),c=n(36),f=Object.getOwnPropertyDescriptor;e.f=n(5)?f:function(t,e){if(t=i(t),e=u(e,!0),c)try{return f(t,e)}catch(t){}if(s(t,e))return o(!r.f.call(t,e),t[e])}},/* 41 */
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
function(t,e,n){"use strict";var r=n(14),o=n(3),i=n(45),u=n(9),s=n(17),c=n(68),f=n(24),a=n(47),l=n(2)("iterator"),p=!([].keys&&"next"in[].keys()),v=function(){return this};t.exports=function(t,e,n,d,h,y,_){c(n,e,d);var b,g,m,w=function(t){if(!p&&t in P)return P[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},x=e+" Iterator",O="values"==h,M=!1,P=t.prototype,S=P[l]||P["@@iterator"]||h&&P[h],L=S||w(h),j=h?O?w("entries"):L:void 0,k="Array"==e?P.entries||S:S;if(
// Fix native
k&&(m=a(k.call(new t)))!==Object.prototype&&m.next&&(
// Set @@toStringTag to native iterators
f(m,x,!0),
// fix for some old engines
r||"function"==typeof m[l]||u(m,l,v)),
// fix Array#{values, @@iterator}.name in V8 / FF
O&&S&&"values"!==S.name&&(M=!0,L=function(){return S.call(this)}),
// Define iterator
r&&!_||!p&&!M&&P[l]||u(P,l,L),
// Plug for library
s[e]=L,s[x]=v,h)if(b={values:O?L:w("values"),keys:y?L:w("keys"),entries:j},_)for(g in b)g in P||i(P,g,b[g]);else o(o.P+o.F*(p||M),e,b);return b}},/* 45 */
/***/
function(t,e,n){t.exports=n(9)},/* 46 */
/***/
function(t,e,n){var r=n(1).document;t.exports=r&&r.documentElement},/* 47 */
/***/
function(t,e,n){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var r=n(8),o=n(30),i=n(27)("IE_PROTO"),u=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=o(t),r(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?u:null}},/* 48 */
/***/
function(t,e,n){n(70);for(var r=n(1),o=n(9),i=n(17),u=n(2)("toStringTag"),s="CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","),c=0;c<s.length;c++){var f=s[c],a=r[f],l=a&&a.prototype;l&&!l[u]&&o(l,u,f),i[f]=i.Array}},/* 49 */
/***/
function(t,e,n){
// getting tag from 19.1.3.6 Object.prototype.toString()
var r=n(16),o=n(2)("toStringTag"),i="Arguments"==r(function(){return arguments}()),u=function(t,e){try{return t[e]}catch(t){}};t.exports=function(t){var e,n,s;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=u(e=Object(t),o))?n:i?r(e):"Object"==(s=r(e))&&"function"==typeof e.callee?"Arguments":s}},/* 50 */
/***/
function(t,e,n){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var r=n(4),o=n(18),i=n(2)("species");t.exports=function(t,e){var n,u=r(t).constructor;return void 0===u||void 0==(n=r(u)[i])?e:o(n)}},/* 51 */
/***/
function(t,e,n){var r,o,i,u=n(15),s=n(79),c=n(46),f=n(25),a=n(1),l=a.process,p=a.setImmediate,v=a.clearImmediate,d=a.MessageChannel,h=a.Dispatch,y=0,_={},b=function(){var t=+this;
// eslint-disable-next-line no-prototype-builtins
if(_.hasOwnProperty(t)){var e=_[t];delete _[t],e()}},g=function(t){b.call(t.data)};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
p&&v||(p=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return _[++y]=function(){
// eslint-disable-next-line no-new-func
s("function"==typeof t?t:Function(t),e)},r(y),y},v=function(t){delete _[t]},
// Node.js 0.8-
"process"==n(16)(l)?r=function(t){l.nextTick(u(b,t,1))}:h&&h.now?r=function(t){h.now(u(b,t,1))}:d?(o=new d,i=o.port2,o.port1.onmessage=g,r=u(i.postMessage,i,1)):a.addEventListener&&"function"==typeof postMessage&&!a.importScripts?(r=function(t){a.postMessage(t+"","*")},a.addEventListener("message",g,!1)):r="onreadystatechange"in f("script")?function(t){c.appendChild(f("script")).onreadystatechange=function(){c.removeChild(this),b.call(t)}}:function(t){setTimeout(u(b,t,1),0)}),t.exports={set:p,clear:v}},/* 52 */
/***/
function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},/* 53 */
/***/
function(t,e,n){var r=n(4),o=n(6),i=n(32);t.exports=function(t,e){if(r(t),o(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},/* 54 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(90),o=_interopRequireDefault(r),i=n(92),u=_interopRequireDefault(i),s="function"==typeof u.default&&"symbol"==typeof o.default?function(t){return typeof t}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":typeof t};e.default="function"==typeof u.default&&"symbol"===s(o.default)?function(t){return void 0===t?"undefined":s(t)}:function(t){return t&&"function"==typeof u.default&&t.constructor===u.default&&t!==u.default.prototype?"symbol":void 0===t?"undefined":s(t)}},/* 55 */
/***/
function(t,e){e.f=Object.getOwnPropertySymbols},/* 56 */
/***/
function(t,e,n){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var r=n(37),o=n(29).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return r(t,o)}},/* 57 */
/***/
function(t,e,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(16);
// eslint-disable-next-line no-prototype-builtins
t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==r(t)?t.split(""):Object(t)}},/* 58 */
/***/
function(t,e,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(10),o=n(38),i=n(59);t.exports=function(t){return function(e,n,u){var s,c=r(e),f=o(c.length),a=i(u,f);
// Array#includes uses SameValueZero equality algorithm
// eslint-disable-next-line no-self-compare
if(t&&n!=n){for(;f>a;)
// eslint-disable-next-line no-self-compare
if((s=c[a++])!=s)return!0}else for(;f>a;a++)if((t||a in c)&&c[a]===n)return t||a||0;return!t&&-1}}},/* 59 */
/***/
function(t,e,n){var r=n(22),o=Math.max,i=Math.min;t.exports=function(t,e){return t=r(t),t<0?o(t+e,0):i(t,e)}},/* 60 */
/***/
function(t,e,n){t.exports={default:n(61),__esModule:!0}},/* 61 */
/***/
function(t,e,n){n(62);var r=n(0).Object;t.exports=function(t,e,n){return r.defineProperty(t,e,n)}},/* 62 */
/***/
function(t,e,n){var r=n(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(5),"Object",{defineProperty:n(7).f})},/* 63 */
/***/
function(t,e,n){t.exports={default:n(88),__esModule:!0}},/* 64 */
/***/
function(t,e,n){"use strict";e.__esModule=!0;var r=n(54),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!==(void 0===e?"undefined":(0,o.default)(e))&&"function"!=typeof e?t:e}},/* 65 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}e.__esModule=!0;var r=n(101),o=_interopRequireDefault(r),i=n(105),u=_interopRequireDefault(i),s=n(54),c=_interopRequireDefault(s);e.default=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+(void 0===e?"undefined":(0,c.default)(e)));t.prototype=(0,u.default)(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(o.default?(0,o.default)(t,e):t.__proto__=e)}},/* 66 */
/***/
function(t,e,n){n(42),n(43),n(48),n(73),n(85),n(86),t.exports=n(0).Promise},/* 67 */
/***/
function(t,e,n){var r=n(22),o=n(23);
// true  -> String#at
// false -> String#codePointAt
t.exports=function(t){return function(e,n){var i,u,s=String(o(e)),c=r(n),f=s.length;return c<0||c>=f?t?"":void 0:(i=s.charCodeAt(c),i<55296||i>56319||c+1===f||(u=s.charCodeAt(c+1))<56320||u>57343?t?s.charAt(c):i:t?s.slice(c,c+2):u-56320+(i-55296<<10)+65536)}}},/* 68 */
/***/
function(t,e,n){"use strict";var r=n(31),o=n(19),i=n(24),u={};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
n(9)(u,n(2)("iterator"),function(){return this}),t.exports=function(t,e,n){t.prototype=r(u,{next:o(1,n)}),i(t,e+" Iterator")}},/* 69 */
/***/
function(t,e,n){var r=n(7),o=n(4),i=n(21);t.exports=n(5)?Object.defineProperties:function(t,e){o(t);for(var n,u=i(e),s=u.length,c=0;s>c;)r.f(t,n=u[c++],e[n]);return t}},/* 70 */
/***/
function(t,e,n){"use strict";var r=n(71),o=n(72),i=n(17),u=n(10);
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
function(t,e,n){"use strict";var r,o,i,u,s=n(14),c=n(1),f=n(15),a=n(49),l=n(3),p=n(6),v=n(18),d=n(74),h=n(75),y=n(50),_=n(51).set,b=n(80)(),g=n(32),m=n(52),w=n(81),x=n(53),O=c.TypeError,M=c.process,P=M&&M.versions,S=P&&P.v8||"",L=c.Promise,j="process"==a(M),k=function(){},E=o=g.f,R=!!function(){try{
// correct subclassing with @@species support
var t=L.resolve(1),e=(t.constructor={})[n(2)("species")]=function(t){t(k,k)};
// unhandled rejections tracking support, NodeJS Promise without it fails @@species test
return(j||"function"==typeof PromiseRejectionEvent)&&t.then(k)instanceof e&&0!==S.indexOf("6.6")&&-1===w.indexOf("Chrome/66")}catch(t){}}(),T=function(t){var e;return!(!p(t)||"function"!=typeof(e=t.then))&&e},C=function(t,e){if(!t._n){t._n=!0;var n=t._c;b(function(){for(var r=t._v,o=1==t._s,i=0;n.length>i;)!function(e){var n,i,u,s=o?e.ok:e.fail,c=e.resolve,f=e.reject,a=e.domain;try{s?(o||(2==t._h&&F(t),t._h=1),!0===s?n=r:(a&&a.enter(),n=s(r),// may throw
a&&(a.exit(),u=!0)),n===e.promise?f(O("Promise-chain cycle")):(i=T(n))?i.call(n,c,f):c(n)):f(r)}catch(t){a&&!u&&a.exit(),f(t)}}(n[i++]);// variable length - can't use forEach
t._c=[],t._n=!1,e&&!t._h&&A(t)})}},A=function(t){_.call(c,function(){var e,n,r,o=t._v,i=D(t);if(i&&(e=m(function(){j?M.emit("unhandledRejection",o,t):(n=c.onunhandledrejection)?n({promise:t,reason:o}):(r=c.console)&&r.error&&r.error("Unhandled promise rejection",o)}),
// Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
t._h=j||D(t)?2:1),t._a=void 0,i&&e.e)throw e.v})},D=function(t){return 1!==t._h&&0===(t._a||t._c).length},F=function(t){_.call(c,function(){var e;j?M.emit("rejectionHandled",t):(e=c.onrejectionhandled)&&e({promise:t,reason:t._v})})},q=function(t){var e=this;e._d||(e._d=!0,e=e._w||e,// unwrap
e._v=t,e._s=2,e._a||(e._a=e._c.slice()),C(e,!0))},I=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;// unwrap
try{if(n===t)throw O("Promise can't be resolved itself");(e=T(t))?b(function(){var r={_w:n,_d:!1};// wrap
try{e.call(t,f(I,r,1),f(q,r,1))}catch(t){q.call(r,t)}}):(n._v=t,n._s=1,C(n,!1))}catch(t){q.call({_w:n,_d:!1},t)}}};
// constructor polyfill
R||(
// 25.4.3.1 Promise(executor)
L=function(t){d(this,L,"Promise","_h"),v(t),r.call(this);try{t(f(I,this,1),f(q,this,1))}catch(t){q.call(this,t)}},
// eslint-disable-next-line no-unused-vars
r=function(t){this._c=[],// <- awaiting reactions
this._a=void 0,// <- checked in isUnhandled reactions
this._s=0,// <- state
this._d=!1,// <- done
this._v=void 0,// <- value
this._h=0,// <- rejection state, 0 - default, 1 - handled, 2 - unhandled
this._n=!1},r.prototype=n(82)(L.prototype,{
// 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
then:function(t,e){var n=E(y(this,L));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=j?M.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&C(this,!1),n.promise},
// 25.4.5.1 Promise.prototype.catch(onRejected)
catch:function(t){return this.then(void 0,t)}}),i=function(){var t=new r;this.promise=t,this.resolve=f(I,t,1),this.reject=f(q,t,1)},g.f=E=function(t){return t===L||t===u?new i(t):o(t)}),l(l.G+l.W+l.F*!R,{Promise:L}),n(24)(L,"Promise"),n(83)("Promise"),u=n(0).Promise,
// statics
l(l.S+l.F*!R,"Promise",{
// 25.4.4.5 Promise.reject(r)
reject:function(t){var e=E(this);return(0,e.reject)(t),e.promise}}),l(l.S+l.F*(s||!R),"Promise",{
// 25.4.4.6 Promise.resolve(x)
resolve:function(t){return x(s&&this===u?L:this,t)}}),l(l.S+l.F*!(R&&n(84)(function(t){L.all(t).catch(k)})),"Promise",{
// 25.4.4.1 Promise.all(iterable)
all:function(t){var e=this,n=E(e),r=n.resolve,o=n.reject,i=m(function(){var n=[],i=0,u=1;h(t,!1,function(t){var s=i++,c=!1;n.push(void 0),u++,e.resolve(t).then(function(t){c||(c=!0,n[s]=t,--u||r(n))},o)}),--u||r(n)});return i.e&&o(i.v),n.promise},
// 25.4.4.4 Promise.race(iterable)
race:function(t){var e=this,n=E(e),r=n.reject,o=m(function(){h(t,!1,function(t){e.resolve(t).then(n.resolve,r)})});return o.e&&r(o.v),n.promise}})},/* 74 */
/***/
function(t,e){t.exports=function(t,e,n,r){if(!(t instanceof e)||void 0!==r&&r in t)throw TypeError(n+": incorrect invocation!");return t}},/* 75 */
/***/
function(t,e,n){var r=n(15),o=n(76),i=n(77),u=n(4),s=n(38),c=n(78),f={},a={},e=t.exports=function(t,e,n,l,p){var v,d,h,y,_=p?function(){return t}:c(t),b=r(n,l,e?2:1),g=0;if("function"!=typeof _)throw TypeError(t+" is not iterable!");
// fast case for arrays with default iterator
if(i(_)){for(v=s(t.length);v>g;g++)if((y=e?b(u(d=t[g])[0],d[1]):b(t[g]))===f||y===a)return y}else for(h=_.call(t);!(d=h.next()).done;)if((y=o(h,b,d.value,e))===f||y===a)return y};e.BREAK=f,e.RETURN=a},/* 76 */
/***/
function(t,e,n){
// call something on iterator step with safe closing on error
var r=n(4);t.exports=function(t,e,n,o){try{return o?e(r(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&r(i.call(t)),e}}},/* 77 */
/***/
function(t,e,n){
// check on default Array iterator
var r=n(17),o=n(2)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(r.Array===t||i[o]===t)}},/* 78 */
/***/
function(t,e,n){var r=n(49),o=n(2)("iterator"),i=n(17);t.exports=n(0).getIteratorMethod=function(t){if(void 0!=t)return t[o]||t["@@iterator"]||i[r(t)]}},/* 79 */
/***/
function(t,e){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
t.exports=function(t,e,n){var r=void 0===n;switch(e.length){case 0:return r?t():t.call(n);case 1:return r?t(e[0]):t.call(n,e[0]);case 2:return r?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return r?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return r?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},/* 80 */
/***/
function(t,e,n){var r=n(1),o=n(51).set,i=r.MutationObserver||r.WebKitMutationObserver,u=r.process,s=r.Promise,c="process"==n(16)(u);t.exports=function(){var t,e,n,f=function(){var r,o;for(c&&(r=u.domain)&&r.exit();t;){o=t.fn,t=t.next;try{o()}catch(r){throw t?n():e=void 0,r}}e=void 0,r&&r.enter()};
// Node.js
if(c)n=function(){u.nextTick(f)};else if(!i||r.navigator&&r.navigator.standalone)if(s&&s.resolve){
// Promise.resolve without an argument throws an error in LG WebOS 2
var a=s.resolve(void 0);n=function(){a.then(f)}}else n=function(){
// strange IE + webpack dev server bug - use .call(global)
o.call(r,f)};else{var l=!0,p=document.createTextNode("");new i(f).observe(p,{characterData:!0}),// eslint-disable-line no-new
n=function(){p.data=l=!l}}return function(r){var o={fn:r,next:void 0};e&&(e.next=o),t||(t=o,n()),e=o}}},/* 81 */
/***/
function(t,e,n){var r=n(1),o=r.navigator;t.exports=o&&o.userAgent||""},/* 82 */
/***/
function(t,e,n){var r=n(9);t.exports=function(t,e,n){for(var o in e)n&&t[o]?t[o]=e[o]:r(t,o,e[o]);return t}},/* 83 */
/***/
function(t,e,n){"use strict";var r=n(1),o=n(0),i=n(7),u=n(5),s=n(2)("species");t.exports=function(t){var e="function"==typeof o[t]?o[t]:r[t];u&&e&&!e[s]&&i.f(e,s,{configurable:!0,get:function(){return this}})}},/* 84 */
/***/
function(t,e,n){var r=n(2)("iterator"),o=!1;try{var i=[7][r]();i.return=function(){o=!0},
// eslint-disable-next-line no-throw-literal
Array.from(i,function(){throw 2})}catch(t){}t.exports=function(t,e){if(!e&&!o)return!1;var n=!1;try{var i=[7],u=i[r]();u.next=function(){return{done:n=!0}},i[r]=function(){return u},t(i)}catch(t){}return n}},/* 85 */
/***/
function(t,e,n){"use strict";
// https://github.com/tc39/proposal-promise-finally
var r=n(3),o=n(0),i=n(1),u=n(50),s=n(53);r(r.P+r.R,"Promise",{finally:function(t){var e=u(this,o.Promise||i.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then(function(){return n})}:t,n?function(n){return s(e,t()).then(function(){throw n})}:t)}})},/* 86 */
/***/
function(t,e,n){"use strict";
// https://github.com/tc39/proposal-promise-try
var r=n(3),o=n(32),i=n(52);r(r.S,"Promise",{try:function(t){var e=o.f(this),n=i(t);return(n.e?e.reject:e.resolve)(n.v),e.promise}})},/* 87 */
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
try{return void(window.localStorage[s]=r)}catch(t){}
// Use session cookie as fallback
try{window.document.cookie=encodeURIComponent(s)+"="+r+";"}catch(t){}}}function getPersistedLevel(){var t;if(typeof window!==e){try{t=window.localStorage[s]}catch(t){}
// Fallback to cookies if local storage gives us nothing
if(typeof t===e)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(s)+"=");-1!==r&&(t=/^([^;]+)/.exec(n.slice(r))[1])}catch(t){}
// If the stored level is not valid, treat it as if nothing was stored.
return void 0===u.levels[t]&&(t=void 0),t}}var i,u=this,s="loglevel";t&&(s+=":"+t),/*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */
u.name=t,u.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},u.methodFactory=o||defaultMethodFactory,u.getLevel=function(){return i},u.setLevel=function(n,r){if("string"==typeof n&&void 0!==u.levels[n.toUpperCase()]&&(n=u.levels[n.toUpperCase()]),!("number"==typeof n&&n>=0&&n<=u.levels.SILENT))throw"log.setLevel() called with invalid level: "+n;if(i=n,!1!==r&&// defaults to true
persistLevelIfPossible(n),replaceLoggingMethods.call(u,n,t),typeof console===e&&n<u.levels.SILENT)return"No console available for logging"},u.setDefaultLevel=function(t){getPersistedLevel()||u.setLevel(t,!1)},u.enableAll=function(t){u.setLevel(u.levels.TRACE,t)},u.disableAll=function(t){u.setLevel(u.levels.SILENT,t)};
// Initialize with the right level
var c=getPersistedLevel();null==c&&(c=null==r?"WARN":r),u.setLevel(c,!1)}
// Slightly dubious tricks to cut down minimized file size
var t=function(){},e="undefined",n=["trace","debug","info","warn","error"],r=new Logger,o={};r.getLogger=function(t){if("string"!=typeof t||""===t)throw new TypeError("You must supply a name when creating a logger.");var e=o[t];return e||(e=o[t]=new Logger(t,r.getLevel(),r.methodFactory)),e};
// Grab the current global log variable in case of overwrite
var i=typeof window!==e?window.log:void 0;return r.noConflict=function(){return typeof window!==e&&window.log===r&&(window.log=i),r},r.getLoggers=function(){return o},r})},/* 88 */
/***/
function(t,e,n){n(89),t.exports=n(0).Object.getPrototypeOf},/* 89 */
/***/
function(t,e,n){
// 19.1.2.9 Object.getPrototypeOf(O)
var r=n(30),o=n(47);n(39)("getPrototypeOf",function(){return function(t){return o(r(t))}})},/* 90 */
/***/
function(t,e,n){t.exports={default:n(91),__esModule:!0}},/* 91 */
/***/
function(t,e,n){n(43),n(48),t.exports=n(33).f("iterator")},/* 92 */
/***/
function(t,e,n){t.exports={default:n(93),__esModule:!0}},/* 93 */
/***/
function(t,e,n){n(94),n(42),n(99),n(100),t.exports=n(0).Symbol},/* 94 */
/***/
function(t,e,n){"use strict";
// ECMAScript 6 symbols shim
var r=n(1),o=n(8),i=n(5),u=n(3),s=n(45),c=n(95).KEY,f=n(13),a=n(28),l=n(24),p=n(20),v=n(2),d=n(33),h=n(34),y=n(96),_=n(97),b=n(4),g=n(6),m=n(10),w=n(26),x=n(19),O=n(31),M=n(98),P=n(40),S=n(7),L=n(21),j=P.f,k=S.f,E=M.f,R=r.Symbol,T=r.JSON,C=T&&T.stringify,A=v("_hidden"),D=v("toPrimitive"),F={}.propertyIsEnumerable,q=a("symbol-registry"),I=a("symbols"),N=a("op-symbols"),B=Object.prototype,W="function"==typeof R,G=r.QObject,U=!G||!G.prototype||!G.prototype.findChild,V=i&&f(function(){return 7!=O(k({},"a",{get:function(){return k(this,"a",{value:7}).a}})).a})?function(t,e,n){var r=j(B,e);r&&delete B[e],k(t,e,n),r&&t!==B&&k(B,e,r)}:k,H=function(t){var e=I[t]=O(R.prototype);return e._k=t,e},K=W&&"symbol"==typeof R.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof R},J=function(t,e,n){return t===B&&J(N,e,n),b(t),e=w(e,!0),b(n),o(I,e)?(n.enumerable?(o(t,A)&&t[A][e]&&(t[A][e]=!1),n=O(n,{enumerable:x(0,!1)})):(o(t,A)||k(t,A,x(1,{})),t[A][e]=!0),V(t,e,n)):k(t,e,n)},z=function(t,e){b(t);for(var n,r=y(e=m(e)),o=0,i=r.length;i>o;)J(t,n=r[o++],e[n]);return t},Y=function(t,e){return void 0===e?O(t):z(O(t),e)},Q=function(t){var e=F.call(this,t=w(t,!0));return!(this===B&&o(I,t)&&!o(N,t))&&(!(e||!o(this,t)||!o(I,t)||o(this,A)&&this[A][t])||e)},X=function(t,e){if(t=m(t),e=w(e,!0),t!==B||!o(I,e)||o(N,e)){var n=j(t,e);return!n||!o(I,e)||o(t,A)&&t[A][e]||(n.enumerable=!0),n}},Z=function(t){for(var e,n=E(m(t)),r=[],i=0;n.length>i;)o(I,e=n[i++])||e==A||e==c||r.push(e);return r},$=function(t){for(var e,n=t===B,r=E(n?N:m(t)),i=[],u=0;r.length>u;)!o(I,e=r[u++])||n&&!o(B,e)||i.push(I[e]);return i};
// 19.4.1.1 Symbol([description])
W||(R=function(){if(this instanceof R)throw TypeError("Symbol is not a constructor!");var t=p(arguments.length>0?arguments[0]:void 0),e=function(n){this===B&&e.call(N,n),o(this,A)&&o(this[A],t)&&(this[A][t]=!1),V(this,t,x(1,n))};return i&&U&&V(B,t,{configurable:!0,set:e}),H(t)},s(R.prototype,"toString",function(){return this._k}),P.f=X,S.f=J,n(56).f=M.f=Z,n(35).f=Q,n(55).f=$,i&&!n(14)&&s(B,"propertyIsEnumerable",Q,!0),d.f=function(t){return H(v(t))}),u(u.G+u.W+u.F*!W,{Symbol:R});for(var tt="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),et=0;tt.length>et;)v(tt[et++]);for(var nt=L(v.store),rt=0;nt.length>rt;)h(nt[rt++]);u(u.S+u.F*!W,"Symbol",{
// 19.4.2.1 Symbol.for(key)
for:function(t){return o(q,t+="")?q[t]:q[t]=R(t)},
// 19.4.2.5 Symbol.keyFor(sym)
keyFor:function(t){if(!K(t))throw TypeError(t+" is not a symbol!");for(var e in q)if(q[e]===t)return e},useSetter:function(){U=!0},useSimple:function(){U=!1}}),u(u.S+u.F*!W,"Object",{
// 19.1.2.2 Object.create(O [, Properties])
create:Y,
// 19.1.2.4 Object.defineProperty(O, P, Attributes)
defineProperty:J,
// 19.1.2.3 Object.defineProperties(O, Properties)
defineProperties:z,
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
getOwnPropertyDescriptor:X,
// 19.1.2.7 Object.getOwnPropertyNames(O)
getOwnPropertyNames:Z,
// 19.1.2.8 Object.getOwnPropertySymbols(O)
getOwnPropertySymbols:$}),
// 24.3.2 JSON.stringify(value [, replacer [, space]])
T&&u(u.S+u.F*(!W||f(function(){var t=R();
// MS Edge converts symbol values to JSON as {}
// WebKit converts symbol values to JSON as null
// V8 throws on boxed symbols
return"[null]"!=C([t])||"{}"!=C({a:t})||"{}"!=C(Object(t))})),"JSON",{stringify:function(t){for(var e,n,r=[t],o=1;arguments.length>o;)r.push(arguments[o++]);if(n=e=r[1],(g(e)||void 0!==t)&&!K(t))// IE8 returns string on undefined
return _(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!K(e))return e}),r[1]=e,C.apply(T,r)}}),
// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
R.prototype[D]||n(9)(R.prototype,D,R.prototype.valueOf),
// 19.4.3.5 Symbol.prototype[@@toStringTag]
l(R,"Symbol"),
// 20.2.1.9 Math[@@toStringTag]
l(Math,"Math",!0),
// 24.3.3 JSON[@@toStringTag]
l(r.JSON,"JSON",!0)},/* 95 */
/***/
function(t,e,n){var r=n(20)("meta"),o=n(6),i=n(8),u=n(7).f,s=0,c=Object.isExtensible||function(){return!0},f=!n(13)(function(){return c(Object.preventExtensions({}))}),a=function(t){u(t,r,{value:{i:"O"+ ++s,// object ID
w:{}}})},l=function(t,e){
// return primitive with prefix
if(!o(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,r)){
// can't set metadata to uncaught frozen object
if(!c(t))return"F";
// not necessary to add metadata
if(!e)return"E";
// add missing metadata
a(t)}return t[r].i},p=function(t,e){if(!i(t,r)){
// can't set metadata to uncaught frozen object
if(!c(t))return!0;
// not necessary to add metadata
if(!e)return!1;
// add missing metadata
a(t)}return t[r].w},v=function(t){return f&&d.NEED&&c(t)&&!i(t,r)&&a(t),t},d=t.exports={KEY:r,NEED:!1,fastKey:l,getWeak:p,onFreeze:v}},/* 96 */
/***/
function(t,e,n){
// all enumerable object keys, includes symbols
var r=n(21),o=n(55),i=n(35);t.exports=function(t){var e=r(t),n=o.f;if(n)for(var u,s=n(t),c=i.f,f=0;s.length>f;)c.call(t,u=s[f++])&&e.push(u);return e}},/* 97 */
/***/
function(t,e,n){
// 7.2.2 IsArray(argument)
var r=n(16);t.exports=Array.isArray||function(t){return"Array"==r(t)}},/* 98 */
/***/
function(t,e,n){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var r=n(10),o=n(56).f,i={}.toString,u="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[],s=function(t){try{return o(t)}catch(t){return u.slice()}};t.exports.f=function(t){return u&&"[object Window]"==i.call(t)?s(t):o(r(t))}},/* 99 */
/***/
function(t,e,n){n(34)("asyncIterator")},/* 100 */
/***/
function(t,e,n){n(34)("observable")},/* 101 */
/***/
function(t,e,n){t.exports={default:n(102),__esModule:!0}},/* 102 */
/***/
function(t,e,n){n(103),t.exports=n(0).Object.setPrototypeOf},/* 103 */
/***/
function(t,e,n){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var r=n(3);r(r.S,"Object",{setPrototypeOf:n(104).set})},/* 104 */
/***/
function(t,e,n){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var r=n(6),o=n(4),i=function(t,e){if(o(t),!r(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?// eslint-disable-line
function(t,e,r){try{r=n(15)(Function.call,n(40).f(Object.prototype,"__proto__").set,2),r(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return i(t,n),e?t.__proto__=n:r(t,n),t}}({},!1):void 0),check:i}},/* 105 */
/***/
function(t,e,n){t.exports={default:n(106),__esModule:!0}},/* 106 */
/***/
function(t,e,n){n(107);var r=n(0).Object;t.exports=function(t,e){return r.create(t,e)}},/* 107 */
/***/
function(t,e,n){var r=n(3);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
r(r.S,"Object",{create:n(31)})},/* 108 */
,/* 109 */
,/* 110 */
,/* 111 */
,/* 112 */
,/* 113 */
,/* 114 */
,/* 115 */
,/* 116 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(63),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),f=n(64),a=_interopRequireDefault(f),l=n(65),p=_interopRequireDefault(l),v=n(117),d=_interopRequireDefault(v),h=function(t){function MiniBus(){return(0,u.default)(this,MiniBus),(0,a.default)(this,(MiniBus.__proto__||(0,o.default)(MiniBus)).call(this))}/**
   * Post a message for routing. Message is routed directly to the external routing _onPostMessage.
   * @param  {Message} inMsg            JSON with mandatory Message structure {id, type, from, to}
   * @param  {Callback} responseCallback Optional callback if a response is expected from the request. A response will be always sent, even if it is a "Timeout".
   * @return {number}                  the Message id
   */
return(0,p.default)(MiniBus,t),(0,c.default)(MiniBus,[{key:"postMessage",value:function(t,e,n){var r=this;
//always send to external (to core MessageBus)
return r._genId(t),r._responseCallback(t,e,n),r._onPostMessage(t),t.id}},{key:"_onMessage",value:function(t){var e=this;if(!e._onResponse(t)){var n=e._subscriptions[t.to];n?(e._publishOn(n,t),t.to.startsWith("hyperty")||e._publishOnDefault(t)):e._publishOnDefault(t)}}}]),MiniBus}(d.default);/**
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
e.default=h,t.exports=e.default},/* 117 */
/***/
function(t,e,n){"use strict";function _interopRequireDefault(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var r=n(41),o=_interopRequireDefault(r),i=n(11),u=_interopRequireDefault(i),s=n(12),c=_interopRequireDefault(s),f=n(87),a=function(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}(f),l=a.getLogger("Bus"),p=function(){/* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   */
function Bus(){(0,u.default)(this,Bus);var t=this;t._msgId=0,t._subscriptions={},t._responseTimeOut=3e4,//default to 3s
t._responseCallbacks={},t._registerExternalListener()}/**
  * Register listener to receive message when "msg.to === url".
  * Special url "*" for default listener is accepted to intercept all messages.
  * @param {URL} url Address to intercept, tha is in the message "to"
  * @param {Listener} listener listener
  * @return {MsgListener} instance of MsgListener
  */
return(0,c.default)(Bus,[{key:"addListener",value:function(t,e){var n=this,r=new v(n._subscriptions,t,e),o=n._subscriptions[t];return o||(o=[],n._subscriptions[t]=o),o.push(r),r}},{key:"addResponseListener",value:function(t,e,n){this._responseCallbacks[t+e]=n}},{key:"removeResponseListener",value:function(t,e){delete this._responseCallbacks[t+e]}},{key:"removeAllListenersOf",value:function(t){delete this._subscriptions[t]}},{key:"bind",value:function(t,e,n){var r=this,o=this;return{thisListener:o.addListener(t,function(t){n.postMessage(t)}),targetListener:n.addListener(e,function(t){o.postMessage(t)}),unbind:function(){r.thisListener.remove(),r.targetListener.remove()}}}},{key:"_publishOnDefault",value:function(t){
//is there any "*" (default) listeners?
var e=this._subscriptions["*"];e&&this._publishOn(e,t)}},{key:"_publishOn",value:function(t,e){t.forEach(function(t){t._callback(e)})}},{key:"_responseCallback",value:function(t,e){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],r=this;
//automatic management of response handlers
if(e){var o=t.from+t.id;r._responseCallbacks[o]=e,n&&setTimeout(function(){var e=r._responseCallbacks[o];if(delete r._responseCallbacks[o],e){e({id:t.id,type:"response",body:{code:408,desc:"Response timeout!",value:t}})}},r._responseTimeOut)}}},{key:"_onResponse",value:function(t){var e=this;if("response"===t.type){var n=t.to+t.id,r=e._responseCallbacks[n];if(t.body.code>=200&&
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
function MsgListener(t,e,n){(0,u.default)(this,MsgListener);var r=this;r._subscriptions=t,r._url=e,r._callback=n}return(0,c.default)(MsgListener,[{key:"remove",/**
     * Remove this listener from the Bus
     */
value:function(){var t=this,e=t._subscriptions[t._url];if(e){var n=e.indexOf(t);e.splice(n,1),
//if there are no listeners, remove the subscription entirely.
0===e.length&&delete t._subscriptions[t._url]}}},{key:"url",get:function(){return this._url}}]),MsgListener}();e.default=p,t.exports=e.default},/* 118 */
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
,/* 136 */
/***/
function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r=n(116),o=function(t){return t&&t.__esModule?t:{default:t}}(r);e.default=o.default,/**
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