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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("ReThinkCtx",[],t):"object"==typeof exports?exports.ReThinkCtx=t():e.ReThinkCtx=t()}(this,function(){/******/
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
return __webpack_require__.d(t,"a",t),t},__webpack_require__.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},__webpack_require__.p="",__webpack_require__(__webpack_require__.s=127)}([/* 0 */
/***/
function(e,t){var n=e.exports={version:"2.4.0"};"number"==typeof __e&&(__e=n)},/* 1 */
/***/
function(e,t){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var n=e.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},/* 2 */
,/* 3 */
/***/
function(e,t,n){
// Thank's IE8 for his funny defineProperty
e.exports=!n(13)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},/* 4 */
/***/
function(e,t,n){var r=n(5),i=n(35),o=n(26),u=Object.defineProperty;t.f=n(3)?Object.defineProperty:function(e,t,n){if(r(e),t=o(t,!0),r(n),i)try{return u(e,t,n)}catch(e){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(e[t]=n.value),e}},/* 5 */
/***/
function(e,t,n){var r=n(10);e.exports=function(e){if(!r(e))throw TypeError(e+" is not an object!");return e}},/* 6 */
/***/
function(e,t,n){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var r=n(53),i=n(21);e.exports=function(e){return r(i(e))}},/* 7 */
/***/
function(e,t,n){var r=n(1),i=n(0),o=n(14),u=n(8),a=function(e,t,n){var c,s,f,l=e&a.F,p=e&a.G,d=e&a.S,_=e&a.P,v=e&a.B,y=e&a.W,g=p?i:i[t]||(i[t]={}),h=g.prototype,m=p?r:d?r[t]:(r[t]||{}).prototype;p&&(n=t);for(c in n)
// contains in native
(s=!l&&m&&void 0!==m[c])&&c in g||(
// export native or passed
f=s?m[c]:n[c],
// prevent global pollution for namespaces
g[c]=p&&"function"!=typeof m[c]?n[c]:v&&s?o(f,r):y&&m[c]==f?function(e){var t=function(t,n,r){if(this instanceof e){switch(arguments.length){case 0:return new e;case 1:return new e(t);case 2:return new e(t,n)}return new e(t,n,r)}return e.apply(this,arguments)};return t.prototype=e.prototype,t}(f):_&&"function"==typeof f?o(Function.call,f):f,
// export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
_&&((g.virtual||(g.virtual={}))[c]=f,
// export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
e&a.R&&h&&!h[c]&&u(h,c,f)))};
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
function(e,t,n){var r=n(4),i=n(18);e.exports=n(3)?function(e,t,n){return r.f(e,t,i(1,n))}:function(e,t,n){return e[t]=n,e}},/* 9 */
/***/
function(e,t){var n={}.hasOwnProperty;e.exports=function(e,t){return n.call(e,t)}},/* 10 */
/***/
function(e,t){e.exports=function(e){return"object"==typeof e?null!==e:"function"==typeof e}},/* 11 */
/***/
function(e,t,n){"use strict";t.__esModule=!0,t.default=function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}},/* 12 */
/***/
function(e,t,n){"use strict";t.__esModule=!0;var r=n(56),i=function(e){return e&&e.__esModule?e:{default:e}}(r);t.default=function(){function defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),(0,i.default)(e,r.key,r)}}return function(e,t,n){return t&&defineProperties(e.prototype,t),n&&defineProperties(e,n),e}}()},/* 13 */
/***/
function(e,t){e.exports=function(e){try{return!!e()}catch(e){return!0}}},/* 14 */
/***/
function(e,t,n){
// optional / simple context binding
var r=n(24);e.exports=function(e,t,n){if(r(e),void 0===t)return e;switch(n){case 1:return function(n){return e.call(t,n)};case 2:return function(n,r){return e.call(t,n,r)};case 3:return function(n,r,i){return e.call(t,n,r,i)}}return function(){return e.apply(t,arguments)}}},/* 15 */
/***/
function(e,t){var n={}.toString;e.exports=function(e){return n.call(e).slice(8,-1)}},/* 16 */
/***/
function(e,t,n){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var r=n(36),i=n(29);e.exports=Object.keys||function(e){return r(e,i)}},/* 17 */
,/* 18 */
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
,/* 23 */
,/* 24 */
/***/
function(e,t){e.exports=function(e){if("function"!=typeof e)throw TypeError(e+" is not a function!");return e}},/* 25 */
/***/
function(e,t,n){var r=n(10),i=n(1).document,o=r(i)&&r(i.createElement);e.exports=function(e){return o?i.createElement(e):{}}},/* 26 */
/***/
function(e,t,n){
// 7.1.1 ToPrimitive(input [, PreferredType])
var r=n(10);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
e.exports=function(e,t){if(!r(e))return e;var n,i;if(t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;if("function"==typeof(n=e.valueOf)&&!r(i=n.call(e)))return i;if(!t&&"function"==typeof(n=e.toString)&&!r(i=n.call(e)))return i;throw TypeError("Can't convert object to primitive value")}},/* 27 */
/***/
function(e,t,n){var r=n(28)("keys"),i=n(19);e.exports=function(e){return r[e]||(r[e]=i(e))}},/* 28 */
/***/
function(e,t,n){var r=n(1),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});e.exports=function(e){return i[e]||(i[e]={})}},/* 29 */
/***/
function(e,t){
// IE 8- don't enum bug keys
e.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},/* 30 */
/***/
function(e,t,n){
// 7.1.13 ToObject(argument)
var r=n(21);e.exports=function(e){return Object(r(e))}},/* 31 */
,/* 32 */
,/* 33 */
,/* 34 */
,/* 35 */
/***/
function(e,t,n){e.exports=!n(3)&&!n(13)(function(){return 7!=Object.defineProperty(n(25)("div"),"a",{get:function(){return 7}}).a})},/* 36 */
/***/
function(e,t,n){var r=n(9),i=n(6),o=n(54)(!1),u=n(27)("IE_PROTO");e.exports=function(e,t){var n,a=i(e),c=0,s=[];for(n in a)n!=u&&r(a,n)&&s.push(n);
// Don't enum bug & hidden keys
for(;t.length>c;)r(a,n=t[c++])&&(~o(s,n)||s.push(n));return s}},/* 37 */
/***/
function(e,t,n){
// 7.1.15 ToLength
var r=n(20),i=Math.min;e.exports=function(e){return e>0?i(r(e),9007199254740991):0}},/* 38 */
/***/
function(e,t,n){
// most Object methods by ES6 should accept primitives
var r=n(7),i=n(0),o=n(13);e.exports=function(e,t){var n=(i.Object||{})[e]||Object[e],u={};u[e]=t(n),r(r.S+r.F*o(function(){n(1)}),"Object",u)}},/* 39 */
,/* 40 */
,/* 41 */
,/* 42 */
,/* 43 */
,/* 44 */
,/* 45 */
,/* 46 */
,/* 47 */
,/* 48 */
,/* 49 */
,/* 50 */
,/* 51 */
,/* 52 */
,/* 53 */
/***/
function(e,t,n){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var r=n(15);e.exports=Object("z").propertyIsEnumerable(0)?Object:function(e){return"String"==r(e)?e.split(""):Object(e)}},/* 54 */
/***/
function(e,t,n){
// false -> Array#indexOf
// true  -> Array#includes
var r=n(6),i=n(37),o=n(55);e.exports=function(e){return function(t,n,u){var a,c=r(t),s=i(c.length),f=o(u,s);
// Array#includes uses SameValueZero equality algorithm
if(e&&n!=n){for(;s>f;)if((a=c[f++])!=a)return!0}else for(;s>f;f++)if((e||f in c)&&c[f]===n)return e||f||0;return!e&&-1}}},/* 55 */
/***/
function(e,t,n){var r=n(20),i=Math.max,o=Math.min;e.exports=function(e,t){return e=r(e),e<0?i(e+t,0):o(e,t)}},/* 56 */
/***/
function(e,t,n){e.exports={default:n(57),__esModule:!0}},/* 57 */
/***/
function(e,t,n){n(58);var r=n(0).Object;e.exports=function(e,t,n){return r.defineProperty(e,t,n)}},/* 58 */
/***/
function(e,t,n){var r=n(7);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
r(r.S+r.F*!n(3),"Object",{defineProperty:n(4).f})},/* 59 */
,/* 60 */
,/* 61 */
,/* 62 */
,/* 63 */
,/* 64 */
,/* 65 */
,/* 66 */
,/* 67 */
,/* 68 */
,/* 69 */
,/* 70 */
,/* 71 */
,/* 72 */
,/* 73 */
,/* 74 */
,/* 75 */
,/* 76 */
,/* 77 */
,/* 78 */
,/* 79 */
,/* 80 */
,/* 81 */
,/* 82 */
,/* 83 */
,/* 84 */
,/* 85 */
,/* 86 */
,/* 87 */
,/* 88 */
,/* 89 */
,/* 90 */
,/* 91 */
,/* 92 */
,/* 93 */
,/* 94 */
,/* 95 */
,/* 96 */
,/* 97 */
,/* 98 */
,/* 99 */
,/* 100 */
,/* 101 */
,/* 102 */
/***/
function(e,t,n){e.exports={default:n(103),__esModule:!0}},/* 103 */
/***/
function(e,t,n){n(104),e.exports=n(0).Object.keys},/* 104 */
/***/
function(e,t,n){
// 19.1.2.14 Object.keys(O)
var r=n(30),i=n(16);n(38)("keys",function(){return function(e){return i(r(e))}})},/* 105 */
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}/**
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
if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return getUserURLFromEmail(e)}function isDataObjectURL(e){var t=["domain-idp","runtime","domain","hyperty"],n=e.split("://"),r=n[0];return-1===t.indexOf(r)}function isLegacy(e){return e.split("@").length>1}function isURL(e){return e.split("/").length>=3}function isUserURL(e){return"user"===divideURL(e).type}function isHypertyURL(e){return"hyperty"===divideURL(e).type}/**
 * get information relative each component configured on runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @return {object}               return an object with all configurations;
 */
function getConfigurationResources(e,t,n){return e[t][n]}/**
 * Build a full url with the runtime configuration;
 * @param  {object} configuration object with all configuration
 * @param  {string} component     string with the component to get the configuration, like, runtimeURLS, catalogueURLs, msgNodeURL, domainRegistryURL;
 * @param  {string} resource      type of resource to get, like, catalogue, runtimeUA, protocolstub, idpProxy
 * @param  {string} type          resource to get, like a hyperty name or protocolstub name;
 * @param  {boolean} useFallback  if true the function will check if have a fallback url;
 * @return {string}               partial url to contact the resource;
 */
function buildURL(e,t,n,r){var o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],u=e[t],a=void 0;if(!u.hasOwnProperty(n))throw Error("The configuration "+(0,i.default)(u,"",2)+" don't have the "+n+" resource you are looking for");var c=u[n];
// console.log(url);
return r?(a=c.prefix+e.domain+c.suffix+r,c.hasOwnProperty("fallback")&&o&&(a=c.fallback.indexOf("%domain%")?c.fallback.replace(/(%domain%)/g,e.domain)+r:c.fallback+r)):a=c.prefix+e.domain+c.suffix,a}/**
 * Generate a Global Unique ID
 *
 * @returns String;
 */
function generateGUID(){function s4(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return s4()+s4()+"-"+s4()+"-"+s4()+"-"+s4()+"-"+s4()+s4()+s4()}function getUserIdentityDomain(e){var t=divideURL(e),n=t.domain.split("."),r=n.length;return 1==r?n[r-1]:n[r-2]+"."+n[r-1]}/**
 * Check if URL is from a backend service
 * @param  {string} url     URL to be processed
 * @return {boolean}
 */
function isBackendServiceURL(e){var t=divideURL(e),n=t.domain.split("."),r=["domain","global","domain-idp"],i=["registry","msg-node"],o=void 0;return n.length>1&&(o=n[0]),!(!o||!i.indexOf(o))||!!t.type&&-1!==r.indexOf(t.type)}function divideEmail(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function assign(e,t,n){e||(e={}),"string"==typeof t&&(t=parseAttributes(t));for(var r=t.length-1,i=0;i<r;++i){var o=t[i];o in e||(e[o]={}),e=e[o]}e[t[r]]=n}function splitObjectURL(e){var t=e.split("/"),n=t[0]+"//"+t[2]+"/"+t[3],r=t[5],i={url:n,resource:r};return i}function checkAttribute(e){var t=/((([a-zA-Z]+):\/\/([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})\/[a-zA-Z0-9\.]+@[a-zA-Z0-9]+(\-)?[a-zA-Z0-9]+(\.)?[a-zA-Z0-9]{2,10}?\.[a-zA-Z]{2,10})(.+(?=.identity))?/gm,n=[],r=[];if(null==e.match(t))r=e.split(".");else{for(var i=void 0;null!==(i=t.exec(e));)
// This is necessary to avoid infinite loops with zero-width matches
i.index===t.lastIndex&&t.lastIndex++,
// The result can be accessed through the `m`-variable.
i.forEach(function(e,t){0===t&&n.push(e)});var o=void 0;n.forEach(function(t){o=e.replace(t,"*-*"),r=o.split(".").map(function(e){return"*-*"===e?t:e})})}return r}function parseAttributes(e){var t=/([0-9a-zA-Z][-\w]*):\/\//g;if(e.includes("://")){var n=e.split(t)[0],r=n.split("."),i=e.replace(n,"");if(e.includes("identity")){var o=i.split("identity.");i=o[0].slice(".",-1),o=o[1].split("."),r.push(i,"identity"),r=r.concat(o)}else r.push(i);return r.filter(Boolean)}return e.split(".")}Object.defineProperty(t,"__esModule",{value:!0});var r=n(108),i=_interopRequireDefault(r),o=n(102),u=_interopRequireDefault(o);t.divideURL=divideURL,t.emptyObject=emptyObject,t.deepClone=deepClone,t.removePathFromURL=removePathFromURL,t.getUserURLFromEmail=getUserURLFromEmail,t.getUserEmailFromURL=getUserEmailFromURL,t.convertToUserURL=convertToUserURL,t.isDataObjectURL=isDataObjectURL,t.isLegacy=isLegacy,t.isURL=isURL,t.isUserURL=isUserURL,t.isHypertyURL=isHypertyURL,t.getConfigurationResources=getConfigurationResources,t.buildURL=buildURL,t.generateGUID=generateGUID,t.getUserIdentityDomain=getUserIdentityDomain,t.isBackendServiceURL=isBackendServiceURL,t.divideEmail=divideEmail,t.assign=assign,t.splitObjectURL=splitObjectURL,t.checkAttribute=checkAttribute,t.parseAttributes=parseAttributes},/* 106 */
,/* 107 */
,/* 108 */
/***/
function(e,t,n){e.exports={default:n(109),__esModule:!0}},/* 109 */
/***/
function(e,t,n){var r=n(0),i=r.JSON||(r.JSON={stringify:JSON.stringify});e.exports=function(e){// eslint-disable-line no-unused-vars
return i.stringify.apply(i,arguments)}},/* 110 */
,/* 111 */
,/* 112 */
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
/***/
function(e,t,n){"use strict";function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),i=_interopRequireDefault(r),o=n(12),u=_interopRequireDefault(o),a=n(105),c=function(){function ReThinkCtx(){(0,i.default)(this,ReThinkCtx),this.defaultBehaviour=!0,this.groups={}}return(0,u.default)(ReThinkCtx,[{key:"scheme",get:function(){return this._scheme},set:function(e){var t=e.message.from;(0,a.isDataObjectURL)(t)?this._scheme=(0,a.divideURL)(t).type:this._scheme=void 0}},{key:"date",get:function(){return this._date},set:function(e){var t=new Date,n=String(t.getDate());1===n.length&&(n="0"+n);var r=String(t.getMonth()+1);1===r.length&&(r="0"+r),this._date=n+"/"+r+"/"+t.getFullYear()}},{key:"domain",get:function(){return this._domain},set:function(e){void 0!==e.message.body.identity&&(this._domain=(0,a.divideEmail)(e.message.body.identity.userProfile.username).domain)}},{key:"type",get:function(){return this._type},set:function(e){var t=e.message;void 0!==t.body.value&&(this._type=t.body.value.resourceType)}},{key:"source",get:function(){return this._source},set:function(e){void 0!==e.message.body.identity&&(this._source=e.message.body.identity.userProfile.username)}},{key:"time",get:function(){return this._time},set:function(e){e=new Date;var t=String(e.getMinutes());1===t.length&&(t="0"+t),this._time=parseInt(String(e.getHours())+t)}},{key:"weekday",get:function(){return this._weekday},set:function(e){this._weekday=String((new Date).getDay())}}]),ReThinkCtx}();t.default=c,e.exports=t.default}])});