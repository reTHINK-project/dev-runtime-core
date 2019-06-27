// version: 0.17.0
// date: Thu Jun 27 2019 20:19:43 GMT+0100 (GMT+01:00)
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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("PEP",[],t):"object"==typeof exports?exports.PEP=t():e.PEP=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=33)}({0:function(e,t,n){"use strict";function r(e){function t(e){return e.replace(/([a-zA-Z-]*)(:\/\/(?:\.)?|:)([-a-zA-Z0-9@:%._+~#=]{2,256})([-a-zA-Z0-9@:%._+~#=\/]*)/gi,"$1,$3,$4").split(",")}var n=t(e);if(n[0]===e&&!n[0].includes("@")){var r={type:"",domain:e,identity:""};return console.warn("[DivideURL] DivideURL don't support url without scheme. Please review your url address",e),r}return n[0]===e&&n[0].includes("@")&&(n=t((n[0]===e?"smtp":n[0])+"://"+n[0])),n[1].includes("@")&&(n[2]=n[0]+"://"+n[1],n[1]=n[1].substr(n[1].indexOf("@")+1)),{type:n[0],domain:n[1],identity:n[2]}}function o(e){return!(Object.keys(e).length>0)}function i(){return Math.floor(Date.now()/1e3)}function a(e){if(e)return JSON.parse(JSON.stringify(e))}function u(e){var t=e.split("/");return t[0]+"//"+t[2]+"/"+t[3]}function s(e){var t=r(e);return t.identity.replace("/","")+"@"+t.domain}function c(e){if("user://"===e.substring(0,7)){var t=r(e);if(t.domain&&t.identity)return e;throw"userURL with wrong format"}return function(e){var t=e.indexOf("@");return"user://"+e.substring(t+1,e.length)+"/"+e.substring(0,t)}(e)}function l(e){var t=e.split("://")[0];return-1===["domain-idp","runtime","domain","hyperty"].indexOf(t)}function f(e){return e.split("@").length>1}function p(e){return e.split("/").length>=3}function y(e){return"user"===r(e).type}function d(e){return"hyperty"===r(e).type}function v(e,t,n){return e[t][n]}function h(e,t,n,r){var o,i=arguments.length>4&&void 0!==arguments[4]&&arguments[4],a=e[t];if(!a.hasOwnProperty(n))throw Error("The configuration "+JSON.stringify(a,"",2)+" don't have the "+n+" resource you are looking for");var u=a[n];if(n){var s="idp-proxy"===n?".idp.js":".ps.js";o=u.prefix+e.domain+u.suffix+r,u.hasOwnProperty("fallback")&&i&&(o=u.fallback.indexOf("%domain%")?u.fallback.replace(/(%domain%)/g,e.domain)+r+s:u.fallback+r)}else o=u.prefix+e.domain+u.suffix;return o}function b(){function e(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}return e()+e()+"-"+e()+"-"+e()+"-"+e()+"-"+e()+e()+e()}function g(e){var t=r(e).domain.split("."),n=t.length;return 1==n?t[n-1]:t[n-2]+"."+t[n-1]}function m(e){var t,n=r(e),o=n.domain.split("."),i=["registry","msg-node"];return o.length>1&&(t=o.filter(function(e){return-1!==i.indexOf(e)})[0]),!(!t||-1===i.indexOf(t))||!!n.type&&-1!==["domain","global","domain-idp"].indexOf(n.type)}function w(e){var t=e.indexOf("@");return{username:e.substring(0,t),domain:e.substring(t+1,e.length)}}function P(e,t,n){e||(e={}),"string"==typeof t&&(t=x(t));for(var r=t.length-1,o=0;o<r;++o){var i=t[o];i in e||(e[i]={}),e=e[i]}e[t[r]]=n}function k(e){console.info("[utils - splitObjectURL]: ",e);var t=e.split("/"),n={url:t[0]+"//"+t[2]+"/"+t[3],resource:t[5]};return console.info("[utils - splitObjectURL]: ",n),n}function x(e){if(e.includes("://")){var t=e.split(/([0-9a-zA-Z][-\w]*):\/\//g)[0],n=t.split("."),r=e.replace(t,"");if(e.includes("identity")){var o=r.split("identity.");console.log("array2 "+o),r=o[0].slice(".",-1),o=o[1].split("."),n.push(r,"identity"),n=n.concat(o)}else n.push(r);return n.filter(Boolean)}return e.split(".")}function O(e){var t={},n=Object.keys(e);if(n)try{for(var r=0;r<n.length;r++){var o=n[r];t[o]={},t[o].sessionKey=e[o].sessionKey.toString(),t[o].isToEncrypt=e[o].isToEncrypt}}catch(e){console.error("_chatkeysToStringCloner:err",e)}return t}function E(e){var t={},n=Object.keys(e);if(n)try{for(var r=0;r<n.length;r++){var o=n[r];t[o]={};var i=JSON.parse("["+e[o].sessionKey+"]");t[o].sessionKey=new Uint8Array(i),t[o].isToEncrypt=e[o].isToEncrypt}}catch(e){console.error("_chatkeysToArrayCloner:err",e)}return t}function A(e){var t=e.split("/");return t.length<=6?t[0]+"//"+t[2]+"/"+t[3]:t[0]+"//"+t[2]+"/"+t[3]+"/"+t[4]}function R(e,t){var n=(e/t).toFixed(2);return{quota:t,usage:e,percent:Number(n)}}function S(e){try{var t=T(e);return btoa(t)}catch(e){throw console.error("[Utils.encode:err] "+e),e}}function j(e){try{return JSON.parse(atob(e))}catch(e){throw console.log("[Utils.decode:err] "+e),e}}function U(e){try{return new Uint8Array(j(e))}catch(e){throw console.error("[Utils.decodeToUint8Array:err] "+e),e}}function T(e){try{return e.constructor===Uint8Array?"["+e.toString()+"]":JSON.stringify(e)}catch(e){throw console.error("[Utils.stringify:err] "+e),e}}function N(e){try{return JSON.parse(e)}catch(t){throw console.error("[Utils.parse:err]"+t),console.trace(),console.error("That that cause the error:",e),t}}function C(e){try{return new Uint8Array(N(e))}catch(e){throw console.error("[Utils.parseToUint8Array:err]"+e),e}}n.d(t,"k",function(){return r}),n.d(t,"l",function(){return o}),n.d(t,"C",function(){return i}),n.d(t,"i",function(){return a}),n.d(t,"B",function(){return u}),n.d(t,"p",function(){return s}),n.d(t,"f",function(){return c}),n.d(t,"s",function(){return l}),n.d(t,"u",function(){return f}),n.d(t,"v",function(){return p}),n.d(t,"w",function(){return y}),n.d(t,"t",function(){return d}),n.d(t,"o",function(){return v}),n.d(t,"c",function(){return h}),n.d(t,"n",function(){return b}),n.d(t,"q",function(){return g}),n.d(t,"r",function(){return m}),n.d(t,"j",function(){return w}),n.d(t,"a",function(){return P}),n.d(t,"D",function(){return k}),n.d(t,"y",function(){return x}),n.d(t,"e",function(){return O}),n.d(t,"d",function(){return E}),n.d(t,"z",function(){return A}),n.d(t,"b",function(){return R}),n.d(t,"m",function(){return S}),n.d(t,"g",function(){return j}),n.d(t,"h",function(){return U}),n.d(t,"E",function(){return T}),n.d(t,"x",function(){return N}),n.d(t,"A",function(){return C})},1:function(e,t,n){var r,o;!function(i,a){"use strict";void 0===(o="function"==typeof(r=function(){var e=function(){},t="undefined",n=["trace","debug","info","warn","error"];function r(e,t){var n=e[t];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function o(t,r){for(var o=0;o<n.length;o++){var i=n[o];this[i]=o<t?e:this.methodFactory(i,t,r)}this.log=this.debug}function i(n,i,a){return function(n){return"debug"===n&&(n="log"),typeof console!==t&&(void 0!==console[n]?r(console,n):void 0!==console.log?r(console,"log"):e)}(n)||function(e,n,r){return function(){typeof console!==t&&(o.call(this,n,r),this[e].apply(this,arguments))}}.apply(this,arguments)}function a(e,r,a){var u,s=this,c="loglevel";function l(){var e;if(typeof window!==t){try{e=window.localStorage[c]}catch(e){}if(typeof e===t)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(c)+"=");-1!==r&&(e=/^([^;]+)/.exec(n.slice(r))[1])}catch(e){}return void 0===s.levels[e]&&(e=void 0),e}}e&&(c+=":"+e),s.name=e,s.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},s.methodFactory=a||i,s.getLevel=function(){return u},s.setLevel=function(r,i){if("string"==typeof r&&void 0!==s.levels[r.toUpperCase()]&&(r=s.levels[r.toUpperCase()]),!("number"==typeof r&&r>=0&&r<=s.levels.SILENT))throw"log.setLevel() called with invalid level: "+r;if(u=r,!1!==i&&function(e){var r=(n[e]||"silent").toUpperCase();if(typeof window!==t){try{return void(window.localStorage[c]=r)}catch(e){}try{window.document.cookie=encodeURIComponent(c)+"="+r+";"}catch(e){}}}(r),o.call(s,r,e),typeof console===t&&r<s.levels.SILENT)return"No console available for logging"},s.setDefaultLevel=function(e){l()||s.setLevel(e,!1)},s.enableAll=function(e){s.setLevel(s.levels.TRACE,e)},s.disableAll=function(e){s.setLevel(s.levels.SILENT,e)};var f=l();null==f&&(f=null==r?"WARN":r),s.setLevel(f,!1)}var u=new a,s={};u.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=s[e];return t||(t=s[e]=new a(e,u.getLevel(),u.methodFactory)),t};var c=typeof window!==t?window.log:void 0;return u.noConflict=function(){return typeof window!==t&&window.log===u&&(window.log=c),u},u.getLoggers=function(){return s},u})?r.call(t,n,t,e):r)||(e.exports=o)}()},20:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,n){t&&r(e.prototype,t)}(e,[{key:"combine",value:function(e){return-1!==e.indexOf(!0)||-1===e.indexOf(!1)&&"Not Applicable"}}]),e}();t.a=o},21:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,n){t&&r(e.prototype,t)}(e,[{key:"combine",value:function(e){return-1===e.indexOf(!1)&&(-1!==e.indexOf(!0)||"Not Applicable")}}]),e}();t.a=o},22:function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,n){t&&r(e.prototype,t)}(e,[{key:"combine",value:function(e){for(var t in e)if("Not Applicable"!==e[t])return e[t];return"Not Applicable"}}]),e}();t.a=o},33:function(e,t,n){"use strict";n.r(t);var r=n(1);function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var i=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.context=t}return function(e,t,n){t&&o(e.prototype,t)}(e,[{key:"enforcePolicies",value:function(e,t){var n=this;return new Promise(function(r,o){var i=n.context.getPolicies(e,t);void 0!==i?void 0!==i.serviceProviderPolicy?i.serviceProviderPolicy.enforceActions(n.context,e).then(function(e){r(e)},function(e){o(e)}):void 0!==i.userPolicy?i.userPolicy.enforceActions(n.context,e).then(function(e){r(e)},function(e){o(e)}):r([e]):r([e])})}},{key:"forwardToID",value:function(e,t){var n=this;if(!n.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new Promise(function(r,o){n.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to&&"runtime"!==e.to.split("://")[0]?n.context.runtimeRegistry.discoverHypertyPerUser(t).then(function(t){e.to=t.hypertyURL,e.body.via=void 0,r(e),n.context.runtimeRegistry._messageBus.postMessage(e)},function(e){o(e)}):r(e)})}},{key:"forwardToHyperty",value:function(e,t){var n=this;if(!n.context.runtimeRegistry)throw new Error("forward message to given ID is unsupported in this environment");return new Promise(function(r){n.context.runtimeRegistry.hypertiesList[0].hypertyURL===e.to&&"runtime"!==e.to.split("://")[0]?(e.to=t,e.body.via=void 0,r(e),n.context.runtimeRegistry._messageBus.postMessage(e)):r(e)})}},{key:"sendAutomaticMessage",value:function(e,t){var n=this;return new Promise(function(r){var o={from:e.to,to:e.from,body:{value:t},type:e.type};r(e),n.context.runtimeRegistry._messageBus.postMessage(o)})}}]),e}();function a(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var u=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e)}return function(e,t,n){t&&a(e.prototype,t)}(e,[{key:"and",value:function(e){return e[0]&&e[1]}},{key:"between",value:function(e){var t=parseInt(e[0][0]),n=parseInt(e[0][1]),r=e[1];return n<t&&(r=r<t?r+=2400:r,n+=2400),r>t&&r<n}},{key:"equals",value:function(e){return"*"===String(e[0])||String(e[0])===String(e[1])}},{key:"greaterThan",value:function(e){return e[1]>e[0]}},{key:"in",value:function(e){return e[0].indexOf(e[1])>-1}},{key:"lessThan",value:function(e){return e[1]<e[0]}},{key:"not",value:function(e){return!e[0]}},{key:"or",value:function(e){return e[0]||e[1]}}]),e}();function s(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var c=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.context=t,this.operators=new u}return function(e,t,n){t&&s(e.prototype,t)}(e,[{key:"evaluatePolicies",value:function(e,t){var n=this.context.getPolicies(e,t),r="Not Applicable";if(void 0!==n&&((r=this.evaluatePolicy(e,n.serviceProviderPolicy,t))||"Not Applicable"===r)){var o=this.evaluatePolicy(e,n.userPolicy,t);"Not Applicable"!==o&&(r=o)}return r}},{key:"evaluatePolicy",value:function(e,t,n){var r="Not Applicable";return t&&(r=t.evaluateRules(this.context,e,n)),r}}]),e}(),l=n(20),f=n(21),p=n(22);function y(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var d=function(){function e(t,n,r){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.attribute=t,this.operator=n,this.params=r,this.operators=new u}return function(e,t,n){t&&y(e.prototype,t)}(e,[{key:"isApplicable",value:function(e,t){e[this.attribute]={message:t};var n,r=e[this.attribute];return"in"!==this.operator||Array.isArray(this.params)?this.operators[this.operator]([this.params,r]):(n=e.getGroup(this.params,t.to),this.operators[this.operator]([n,r]))}}]),e}();function v(e){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function h(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function b(e,t,n){return(b="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(e,t,n){var r=function(e,t){for(;!Object.prototype.hasOwnProperty.call(e,t)&&null!==(e=g(e)););return e}(e,t);if(r){var o=Object.getOwnPropertyDescriptor(r,t);return o.get?o.get.call(n):o.value}})(e,t,n||e)}function g(e){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function m(e,t){return(m=Object.setPrototypeOf||function(e,t){return e.__proto__=t,e})(e,t)}var w=function(e){function t(e,n,r){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){return!t||"object"!==v(t)&&"function"!=typeof t?function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e):t}(this,g(t).call(this,e,n,r))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:!0,configurable:!0}}),t&&m(e,t)}(t,d),function(e,t,n){t&&h(e.prototype,t)}(t,[{key:"isApplicable",value:function(e,n){return!!("subscribe"===n.type&e.isFromRemoteSM(n.from))&&b(g(t.prototype),"isApplicable",this).call(this,e,n)}}]),t}();function P(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var k=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.operators=new u,void 0!==t.operators&&(t=t.condition),t=this.buildCondition(t),this.condition=t}return function(e,t,n){t&&P(e.prototype,t)}(e,[{key:"buildCondition",value:function(e){return Array.isArray(e[1])?e[1]=this.buildCondition(e[1]):"subscription"===e[1].attribute?e[1]=new w(e[1].attribute,e[1].operator,e[1].params):e[1]=new d(e[1].attribute,e[1].operator,e[1].params),void 0!==e[2]&&(Array.isArray(e[2])?e[2]=this.buildCondition(e[2]):"subscription"===e[2].attribute?e[2]=new w(e[2].attribute,e[2].operator,e[2].params):e[2]=new d(e[2].attribute,e[2].operator,e[2].params)),e}},{key:"isApplicable",value:function(e,t,n,r,o,i,a){for(o||(o=this.condition[0],i=this.condition[1],a=this.condition[2]);!(i instanceof d)&!(i instanceof w)&"boolean"!=typeof i;)i=this.isApplicable(e,t,n,r,i[0],i[1],i[2]);if(void 0!==a)for(;!(a instanceof d)&!(a instanceof w)&"boolean"!=typeof a;)a=this.isApplicable(e,t,n,r,a[0],a[1],a[2]);var u,s="boolean"==typeof i?i:i.isApplicable(e,t,n,r);return void 0!==a&&(u="boolean"==typeof a?a:a.isApplicable(e,t,n,r)),this.operators[o]([s,u])}}]),e}(),x=n(0);function O(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var E=function(){function e(t,n,r,o,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.decision=t,this.setCondition(n),this.priority=i,this.scope=r,this.target=o}return function(e,t,n){t&&O(e.prototype,t)}(e,[{key:"setCondition",value:function(e){if(e instanceof d||e instanceof k||e instanceof k)this.condition=e;else switch(e.attribute){case"subscription":this.condition=new k(e.attribute,e.operator,e.params);break;case void 0:this.condition=new k(e);break;default:this.condition=new d(e.attribute,e.operator,e.params)}}},{key:"evaluate",value:function(e,t,n){var r,o=n?t.to:t.from;switch(this.scope){case"global":break;case"hyperty":if(Object(x.s)(o)){var i=e.runtimeRegistry.getReporterURLSynchonous(Object(x.B)(o));void 0!==i&&(r=e.runtimeRegistry.getHypertyName(i))}else"hyperty"===o.split("://")[0]&&(r=e.runtimeRegistry.getHypertyName(Object(x.B)(o)));if(r===this.target)break;return"Not Applicable";case"identity":var a;if(Object(x.s)(o)){var u=e.runtimeRegistry.getReporterURLSynchonous(Object(x.B)(o));a=e.runtimeRegistry.getHypertyOwner(u)}else"hyperty"===o.split("://")[0]&&(a=e.runtimeRegistry.getHypertyOwner(Object(x.B)(o)));if(void 0!==a&&(a=Object(x.p)(a)),a===this.target)break;return"Not Applicable"}return this.condition.isApplicable(e,t,this.scope,this.target)?this.decision:"Not Applicable"}}]),e}();function A(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var R=function(){function e(t,n,r,o){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),!t)throw new Error("key is not defined");if(!r)throw new Error("actions are not defined");this.actions=r,this.key=t,this._setRules(n),this._setCombiningAlgorithm(o)}return function(e,t,n){t&&A(e.prototype,t)}(e,[{key:"addAction",value:function(e,t){this.actions.push({method:e,param:t})}},{key:"createRule",value:function(e,t,n,r,o){void 0===o&&(o=this.getLastPriority()+1);var i=new E(e,t,n,r,o);this.rules.push(i)}},{key:"deleteRule",value:function(e){var t=this.rules.indexOf(e);this.rules.splice(t,1)}},{key:"enforceActions",value:function(e,t){var n=this;return new Promise(function(r,o){var i=[];if(0!==n.actions.length){for(var a in n.actions){var u=e.pep.actionsService[n.actions[a].method](t,n.actions[a].param);i.push(u)}Promise.all(i).then(function(e){r(e)},function(e){o(e)})}else r([t])})}},{key:"evaluateRules",value:function(e,t,n){var r=[];for(var o in this.rules)r.push(this.rules[o].evaluate(e,t,n));return this.combiningAlgorithm.combine(r)}},{key:"getLastPriority",value:function(){var e=[];if(0!==this.rules.length){for(var t in this.rules)e.push(this.rules[t].priority);return Math.max.apply(Math,e)}return-1}},{key:"getRuleByPriority",value:function(e){for(var t in this.rules)if(String(this.rules[t].priority)===String(e))return this.rules[t];throw Error("Rule with priority "+e+" does not exist!")}},{key:"_setCombiningAlgorithm",value:function(e){switch(e||(e="blockOverrides"),e){case"blockOverrides":this.combiningAlgorithm=new f.a;break;case"allowOverrides":this.combiningAlgorithm=new l.a;break;case"firstApplicable":this.combiningAlgorithm=new p.a;break;default:throw Error("Unknown algorithm: "+e)}}},{key:"_setRules",value:function(e){for(var t in this.rules=[],e){var n=e[t];void 0===n.priority&&(n.priority=this.getLastPriority()+1),n instanceof E||(n=new E(n.decision,n.condition,n.scope,n.target,n.priority)),this.rules.push(n)}}},{key:"sortRules",value:function(){return this.rules.sort(function(e,t){var n=e.priority,r=t.priority;return n<r?-1:n>r?1:0})}}]),e}();function S(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}r.getLogger("PEP");var j=function(){function e(t){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.pdp=new c(t),this.actionsService=new i(t),this.context=t,t.pep=this,t.loadConfigurations()}return function(e,t,n){t&&S(e.prototype,t)}(e,[{key:"addGUIListeners",value:function(){var e=this;e.context.messageBus.addListener(e.context.pepURL,function(t){var n,r=t.body.method;if("addToGroup"===r){var o=t.body.params.groupName,i=t.body.params.userEmail;n=e.context.addToGroup(o,i)}else if("createGroup"===r){var a=t.body.params.groupName;n=e.context.createGroup(a)}else if("addPolicy"===r){var u=t.body.params.source,s=t.body.params.key,c=t.body.params.policy,l=t.body.params.combiningAlgorithm;n=e.addPolicy(u,s,c,l)}else if("deleteGroup"===r){var f=t.body.params.groupName;n=e.context.deleteGroup(f)}else if("removePolicy"===r){var p=t.body.params.source,y=t.body.params.key;n=e.removePolicy(p,y)}else if("savePolicies"===r){var d=t.body.params.source;n=e.context.savePolicies(d)}else if("userPolicies"===r)n=e.context.userPolicies;else if("activeUserPolicy"===r){var v=t.body.params.userPolicy;v&&(e.context.activeUserPolicy=v),n=e.context.activeUserPolicy}else if("userPolicy"===r){var h=t.body.params.key;n=e.context.userPolicies[h]}else"saveActivePolicy"===r?n=e.context.saveActivePolicy():"getMyEmails"===r?n=e.context.getMyEmails():"getMyHyperties"===r?n=e.context.getMyHyperties():"groups"===r?n=e.context.groups:"getGroupsNames"===r&&(n=e.context.getGroupsNames());if("removeFromGroup"===r){var b=t.body.params.groupName,g=t.body.params.userEmail;n=e.context.removeFromGroup(b,g)}var m={type:"execute",value:n,code:200},w={id:t.id,type:"response",to:t.from,from:t.to,body:m};e.context.messageBus.postMessage(w)})}},{key:"addPolicy",value:function(e,t,n,r){if(!e)throw new Error("source is not defined");if(!t)throw new Error("key is not defined");switch(void 0===n?n=new R(t,[],[],r):n instanceof R||(n=new R(n.key,n.rules,n.actions,n.combiningAlgorithm)),e){case"SERVICE_PROVIDER":this.context.savePolicies(e,n,t);break;case"USER":this.context.userPolicies[t]=n,this.context.savePolicies(e);break;default:throw Error("Unknown policy source: "+e)}}},{key:"authorise",value:function(e,t){var n=this;if(!e)throw new Error("message is not defined");if(!e.from)throw new Error("message.from is not defined");if(!e.to)throw new Error("message.to is not defined");if(!e.type)throw new Error("message.type is not defined");return e.body=e.body||{},new Promise(function(r,o){e.body=e.body||{};var i=n,a=i.pdp.evaluatePolicies(e,t);"Not Applicable"===a&&(a=i.context.defaultBehaviour,e.body.auth=!1),i.actionsService.enforcePolicies(e,t).then(function(t){for(var n in t)if(e=t[n],a)e.body.auth=void 0===e.body.auth||e.body.auth,r(e);else{var i={body:{code:403,description:"Blocked by policy"},from:e.to,to:e.from,type:"response"};o(i)}},function(e){o(e)})})}},{key:"authoriseSync",value:function(e){var t;return e.body=e.body||{},"Not Applicable"===(t=this.pdp.evaluatePolicies(e,!0))&&(t=this.context.defaultBehaviour),t}},{key:"removePolicy",value:function(e,t){if(!e)throw new Error("source is not defined");if("*"!==e&&!t)throw new Error("key is not defined");switch(e){case"*":this.context.serviceProviderPolicy={},this.context.userPolicies={},this.context.activeUserPolicy=void 0,this.context.savePolicies("USER"),this.context.savePolicies("SERVICE_PROVIDER"),this.context.saveActivePolicy();break;case"SERVICE_PROVIDER":delete this.context.serviceProviderPolicy[t],this.context.savePolicies();break;case"USER":delete this.context.userPolicies[t],t===this.context.activeUserPolicy&&(this.context.activeUserPolicy=void 0,this.context.saveActivePolicy()),this.context.savePolicies("USER");break;default:throw Error("Unknown policy source: "+e)}}},{key:"messageBus",get:function(){return this.context.messageBus},set:function(e){this.context.messageBus=e,this.addGUIListeners()}}]),e}();t.default=j}})});