// version: 0.16.0
// date: Mon Feb 25 2019 16:31:05 GMT+0000 (GMT)
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


// version: 0.16.0
// date: Mon Feb 25 2019 16:31:05 GMT+0000 (GMT)
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


!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define("ReThinkCtx",[],n):"object"==typeof exports?exports.ReThinkCtx=n():t.ReThinkCtx=n()}(window,function(){return function(t){var n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,e),i.l=!0,i.exports}return e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:r})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(e.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var i in t)e.d(r,i,function(n){return t[n]}.bind(null,i));return r},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=20)}({0:function(t,n,e){"use strict";function r(t){function n(t){return t.replace(/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._+~#=]{2,256})([-a-zA-Z0-9@:%._+~#=\/]*)/gi,"$1,$3,$4").split(",")}var e=n(t);if(e[0]===t&&!e[0].includes("@")){var r={type:"",domain:t,identity:""};return console.warn("[DivideURL] DivideURL don't support url without scheme. Please review your url address",t),r}return e[0]===t&&e[0].includes("@")&&(e=n((e[0]===t?"smtp":e[0])+"://"+e[0])),e[1].includes("@")&&(e[2]=e[0]+"://"+e[1],e[1]=e[1].substr(e[1].indexOf("@")+1)),{type:e[0],domain:e[1],identity:e[2]}}function i(t){return!(Object.keys(t).length>0)}function o(){return Math.floor(Date.now()/1e3)}function u(t){if(t)return JSON.parse(JSON.stringify(t))}function c(t){var n=t.split("/");return n[0]+"//"+n[2]+"/"+n[3]}function s(t){var n=r(t);return n.identity.replace("/","")+"@"+n.domain}function a(t){if("user://"===t.substring(0,7)){var n=r(t);if(n.domain&&n.identity)return t;throw"userURL with wrong format"}return function(t){var n=t.indexOf("@");return"user://"+t.substring(n+1,t.length)+"/"+t.substring(0,n)}(t)}function f(t){var n=t.split("://")[0];return-1===["domain-idp","runtime","domain","hyperty"].indexOf(n)}function d(t){return t.split("@").length>1}function l(t){return t.split("/").length>=3}function y(t){return"user"===r(t).type}function p(t){return"hyperty"===r(t).type}function h(t,n,e){return t[n][e]}function g(t,n,e,r){var i,o=arguments.length>4&&void 0!==arguments[4]&&arguments[4],u=t[n];if(!u.hasOwnProperty(e))throw Error("The configuration "+JSON.stringify(u,"",2)+" don't have the "+e+" resource you are looking for");var c=u[e];return r?(i=c.prefix+t.domain+c.suffix+r,c.hasOwnProperty("fallback")&&o&&(i=c.fallback.indexOf("%domain%")?c.fallback.replace(/(%domain%)/g,t.domain)+r:c.fallback+r)):i=c.prefix+t.domain+c.suffix,i}function v(){function t(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return t()+t()+"-"+t()+"-"+t()+"-"+t()+"-"+t()+t()+t()}function m(t){var n=r(t).domain.split("."),e=n.length;return 1==e?n[e-1]:n[e-2]+"."+n[e-1]}function b(t){var n,e=r(t),i=e.domain.split("."),o=["registry","msg-node"];return i.length>1&&(n=i.filter(function(t){return-1!==o.indexOf(t)})[0]),!(!n||-1===o.indexOf(n))||!!e.type&&-1!==["domain","global","domain-idp"].indexOf(e.type)}function w(t){var n=t.indexOf("@");return{username:t.substring(0,n),domain:t.substring(n+1,t.length)}}function O(t,n,e){t||(t={}),"string"==typeof n&&(n=x(n));for(var r=n.length-1,i=0;i<r;++i){var o=n[i];o in t||(t[o]={}),t=t[o]}t[n[r]]=e}function k(t){console.info("[utils - splitObjectURL]: ",t);var n=t.split("/"),e={url:n[0]+"//"+n[2]+"/"+n[3],resource:n[5]};return console.info("[utils - splitObjectURL]: ",e),e}function x(t){if(t.includes("://")){var n=t.split(/([0-9a-zA-Z][-\w]*):\/\//g)[0],e=n.split("."),r=t.replace(n,"");if(t.includes("identity")){var i=r.split("identity.");console.log("array2 "+i),r=i[0].slice(".",-1),i=i[1].split("."),e.push(r,"identity"),e=e.concat(i)}else e.push(r);return e.filter(Boolean)}return t.split(".")}function _(t){var n={},e=Object.keys(t);if(e)try{for(var r=0;r<e.length;r++){var i=e[r];n[i]={},n[i].sessionKey=t[i].sessionKey.toString(),n[i].isToEncrypt=t[i].isToEncrypt}}catch(t){console.error("_chatkeysToStringCloner:err",t)}return n}function j(t){var n={},e=Object.keys(t);if(e)try{for(var r=0;r<e.length;r++){var i=e[r];n[i]={};var o=JSON.parse("["+t[i].sessionKey+"]");n[i].sessionKey=new Uint8Array(o),n[i].isToEncrypt=t[i].isToEncrypt}}catch(t){console.error("_chatkeysToArrayCloner:err",t)}return n}function S(t){var n=t.split("/");return n.length<=6?n[0]+"//"+n[2]+"/"+n[3]:n[0]+"//"+n[2]+"/"+n[3]+"/"+n[4]}function T(t,n){var e=(t/n).toFixed(2);return{quota:n,usage:t,percent:Number(e)}}function U(t){try{var n=D(t);return btoa(n)}catch(t){throw console.error("[Utils.encode:err] "+t),t}}function A(t){try{return JSON.parse(atob(t))}catch(t){throw console.log("[Utils.decode:err] "+t),t}}function P(t){try{return new Uint8Array(A(t))}catch(t){throw console.error("[Utils.decodeToUint8Array:err] "+t),t}}function D(t){try{return t.constructor===Uint8Array?"["+t.toString()+"]":JSON.stringify(t)}catch(t){throw console.error("[Utils.stringify:err] "+t),t}}function M(t){try{return JSON.parse(t)}catch(n){throw console.error("[Utils.parse:err]"+n),console.trace(),console.error("That that cause the error:",t),n}}function N(t){try{return new Uint8Array(M(t))}catch(t){throw console.error("[Utils.parseToUint8Array:err]"+t),t}}e.d(n,"k",function(){return r}),e.d(n,"l",function(){return i}),e.d(n,"C",function(){return o}),e.d(n,"i",function(){return u}),e.d(n,"B",function(){return c}),e.d(n,"p",function(){return s}),e.d(n,"f",function(){return a}),e.d(n,"s",function(){return f}),e.d(n,"u",function(){return d}),e.d(n,"v",function(){return l}),e.d(n,"w",function(){return y}),e.d(n,"t",function(){return p}),e.d(n,"o",function(){return h}),e.d(n,"c",function(){return g}),e.d(n,"n",function(){return v}),e.d(n,"q",function(){return m}),e.d(n,"r",function(){return b}),e.d(n,"j",function(){return w}),e.d(n,"a",function(){return O}),e.d(n,"D",function(){return k}),e.d(n,"y",function(){return x}),e.d(n,"e",function(){return _}),e.d(n,"d",function(){return j}),e.d(n,"z",function(){return S}),e.d(n,"b",function(){return T}),e.d(n,"m",function(){return U}),e.d(n,"g",function(){return A}),e.d(n,"h",function(){return P}),e.d(n,"E",function(){return D}),e.d(n,"x",function(){return M}),e.d(n,"A",function(){return N})},20:function(t,n,e){"use strict";e.r(n);var r=e(0);function i(t,n){for(var e=0;e<n.length;e++){var r=n[e];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var o=function(){function t(){!function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}(this,t),this.defaultBehaviour=!0,this.groups={}}return function(t,n,e){n&&i(t.prototype,n)}(t,[{key:"scheme",get:function(){return this._scheme},set:function(t){var n=t.message.from;Object(r.s)(n)?this._scheme=Object(r.k)(n).type:this._scheme=void 0}},{key:"date",get:function(){return this._date},set:function(t){var n=new Date,e=String(n.getDate());1===e.length&&(e="0"+e);var r=String(n.getMonth()+1);1===r.length&&(r="0"+r),this._date=e+"/"+r+"/"+n.getFullYear()}},{key:"domain",get:function(){return this._domain},set:function(t){void 0!==t.message.body.identity&&(this._domain=Object(r.j)(t.message.body.identity.userProfile.username).domain)}},{key:"type",get:function(){return this._type},set:function(t){var n=t.message;void 0!==n.body.value&&(this._type=n.body.value.resourceType)}},{key:"source",get:function(){return this._source},set:function(t){void 0!==t.message.body.identity&&(this._source=t.message.body.identity.userProfile.username)}},{key:"time",get:function(){return this._time},set:function(t){t=new Date;var n=String(t.getMinutes());1===n.length&&(n="0"+n),this._time=parseInt(String(t.getHours())+n)}},{key:"weekday",get:function(){return this._weekday},set:function(t){this._weekday=String((new Date).getDay())}}]),t}();n.default=o}})});