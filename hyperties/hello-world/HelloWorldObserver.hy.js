!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("activate",[],t):"object"==typeof exports?exports.activate=t():e.activate=t()}("undefined"!=typeof self?self:this,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{configurable:!1,enumerable:!0,get:r})},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();t.default=function(e,t,n,r){return{name:"HelloWorldObserver",instance:new i(e,t,n,r)}};var o=function(e){return e&&e.__esModule?e:{default:e}}(n(1));var i=function(e){function t(e,n,r,o){if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),!e)throw new Error("The hypertyURL is a needed parameter");if(!n)throw new Error("The MiniBus is a needed parameter");if(!r)throw new Error("The configuration is a needed parameter");if(!o)throw new Error("The factory is a needed parameter");var i=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this)),a=i,c=o.divideURL(e).domain;a._domain=c,a._objectDescURL="hyperty-catalogue://catalogue."+c+"/.well-known/dataschema/HelloWorldDataSchema";var u=o.createSyncher(e,n,r);return u.onNotification(function(e){a._onNotification(e)}),u.resumeObservers({}).then(function(e){e&&(console.log("[hyperty syncher resume] - dataObject",e),Object.values(e).forEach(function(e){a._changes(e),e.sync()}))}).catch(function(e){console.log("[hyperty syncher resume] - ",e)}),a._syncher=u,i}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default),r(t,[{key:"_onNotification",value:function(e){var t=this;console.info("Event Received: ",e),t.trigger("invitation",e.identity),e.ack();var n={schema:t._objectDescURL,resource:e.url,store:!0,p2p:!1};t._syncher.subscribe(n).then(function(e){console.info(e),console.log("[hyperty syncher subscribe] - dataObject",e),t._changes(e)}).catch(function(e){console.error(e)})}},{key:"_changes",value:function(e){var t=this;console.log("[hyperty syncher] - dataObject",e),this.trigger("hello",e.data),e.onChange("*",function(n){console.info("message received:",n),"hello"===n.field&&t.trigger("hello",e.data)})}}]),t}()},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();var o=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.__eventListeners={}}return r(e,[{key:"addEventListener",value:function(e,t){void 0!=t&&(this.__eventListeners[e]?this.__eventListeners[e].push(t):this.__eventListeners[e]=[t])}},{key:"trigger",value:function(e,t){var n=this.__eventListeners[e];n&&n.forEach(function(n){try{n(t)}catch(r){console.warn("calling listener "+n.name+" for event type "+e+" with parameters '"+t+"' resulted in an error!",r)}})}}]),e}();t.default=o}]).default});