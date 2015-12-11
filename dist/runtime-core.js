// Runtime User Agent 

// version: 0.2.0

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.runtimeCore=e()}}(function(){var define,module,exports;return function e(t,n,o){function r(s,u){if(!n[s]){if(!t[s]){var a="function"==typeof require&&require;if(!u&&a)return a(s,!0);if(i)return i(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};t[s][0].call(l.exports,function(e){var n=t[s][1][e];return r(n?n:e)},l,l.exports,e,t,n,o)}return n[s].exports}for(var i="function"==typeof require&&require,s=0;s<o.length;s++)r(o[s]);return r}({1:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=function(e,t,n){for(var o=!0;o;){var r=e,i=t,s=n;o=!1,null===r&&(r=Function.prototype);var u=Object.getOwnPropertyDescriptor(r,i);if(void 0!==u){if("value"in u)return u.value;var a=u.get;if(void 0===a)return;return a.call(s)}var c=Object.getPrototypeOf(r);if(null===c)return;e=c,t=i,n=s,o=!0,u=c=void 0}},a=e("./MiniBus"),c=o(a),l=function(e){function t(e){r(this,t),u(Object.getPrototypeOf(t.prototype),"constructor",this).call(this),this._registry=e}return i(t,e),s(t,[{key:"_onPostMessage",value:function(e){var t=this;t._registry.resolve(e.to).then(function(n){var o=t._subscriptions[n];o&&t._publishOn(o,e)})["catch"](function(e){console.log("PROTO-STUB-ERROR: ",e)})}}]),t}(c["default"]);n["default"]=l,t.exports=n["default"]},{"./MiniBus":2}],2:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(){o(this,e);var t=this;t._msgId=0,t._subscriptions={},t._responseTimeOut=3e3,t._responseCallbacks={},t._registerExternalListener()}return r(e,[{key:"addListener",value:function(e,t){var n=this,o=new s(n._subscriptions,e,t),r=n._subscriptions[e];return r||(r=[],n._subscriptions[e]=r),r.push(o),o}},{key:"addResponseListener",value:function(e,t,n){this._responseCallbacks[e+t]=n}},{key:"removeResponseListener",value:function(e,t){delete this._responseCallbacks[e+t]}},{key:"removeAllListenersOf",value:function(e){delete this._subscriptions[e]}},{key:"postMessage",value:function(e,t){var n=this;if(e.id&&0!==e.id||(n._msgId++,e.id=n._msgId),t&&!function(){var o=e.from+e.id;n._responseCallbacks[o]=t,setTimeout(function(){var t=n._responseCallbacks[o];if(delete n._responseCallbacks[o],t){var r={id:e.id,type:"response",body:{code:"error",desc:"Response timeout!"}};t(r)}},n._responseTimeOut)}(),!n._onResponse(e)){var o=n._subscriptions[e.to];o?n._publishOn(o,e):n._onPostMessage(e)}return e.id}},{key:"bind",value:function(e,t,n){var o=this,r=this,i=r.addListener(e,function(e){n.postMessage(e)}),s=n.addListener(t,function(e){r.postMessage(e)});return{thisListener:i,targetListener:s,unbind:function(){o.thisListener.remove(),o.targetListener.remove()}}}},{key:"_publishOn",value:function(e,t){e.forEach(function(e){e._callback(t)})}},{key:"_onResponse",value:function(e){var t=this;if("response"===e.type){var n=e.to+e.id,o=t._responseCallbacks[n];if(delete t._responseCallbacks[n],o)return o(e),!0}return!1}},{key:"_onMessage",value:function(e){var t=this;if(!t._onResponse(e)){var n=t._subscriptions[e.to];n?t._publishOn(n,e):(n=t._subscriptions["*"],n&&t._publishOn(n,e))}}},{key:"_onPostMessage",value:function(e){}},{key:"_registerExternalListener",value:function(){}}]),e}(),s=function(){function e(t,n,r){o(this,e);var i=this;i._subscriptions=t,i._url=n,i._callback=r}return r(e,[{key:"remove",value:function(){var e=this,t=e._subscriptions[e._url];if(t){var n=t.indexOf(e);t.splice(n,1),0===t.length&&delete e._subscriptions[e._url]}}},{key:"url",get:function(){return this._url}}]),e}();n["default"]=i,t.exports=n["default"]},{}],3:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(){o(this,e)}return r(e,[{key:"registerIdentity",value:function(){}},{key:"registerWithRP",value:function(){}},{key:"loginWithRP",value:function(e,t){function n(e,t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n="[\\#&]"+t+"=([^&#]*)",o=new RegExp(n),r=o.exec(e);return null===r?"":r[1]}var o="https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=",r="https://www.googleapis.com/oauth2/v1/userinfo?access_token=",i="https://accounts.google.com/o/oauth2/auth?",s="email%20profile",u="808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com",a="http://127.0.0.1:8080/",c="token",l=i+"scope="+s+"&client_id="+u+"&redirect_uri="+a+"&response_type="+c,f=void 0,d=void 0,p=void 0,y=void 0;return new Promise(function(e,t){function i(e){var n=new XMLHttpRequest;n.open("GET",o+e,!0),n.onreadystatechange=function(o){4==n.readyState&&(200==n.status?s(e):t(400==n.status?"There was an error processing the token":"something else other than 200 was returned"))},n.send()}function s(n){var o=new XMLHttpRequest;o.open("GET",r+n,!0),o.onreadystatechange=function(n){4==o.readyState&&(200==o.status?(console.log("getUserInfo ",o),y=JSON.parse(o.responseText),e(y)):t(400==o.status?"There was an error processing the token":"something else other than 200 was returned"))},o.send()}var u=window.open(l,"openIDrequest","width=800, height=600"),c=window.setInterval(function(){try{if(u.closed&&(t("Some error occured."),clearInterval(c)),-1!=u.document.URL.indexOf(a)){window.clearInterval(c);var e=u.document.URL;f=n(e,"access_token"),d=n(e,"token_type"),p=n(e,"expires_in"),u.close(),i(f)}}catch(o){}},500)})}},{key:"setHypertyIdentity",value:function(){}},{key:"generateAssertion",value:function(e,t,n){}},{key:"validateAssertion",value:function(e){}},{key:"getAssertionTrustLevel",value:function(e){}}]),e}();n["default"]=i,t.exports=n["default"]},{}],4:[function(require,module,exports){"use strict";function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),PolicyEngine=function(){function PolicyEngine(e,t){_classCallCheck(this,PolicyEngine);var n=this;n.idModule=e,n.registry=t,n.policiesTable=new Object,n.blacklist=[]}return _createClass(PolicyEngine,[{key:"addPolicies",value:function(e,t){var n=this;n.policiesTable[e]=t}},{key:"removePolicies",value:function(e){var t=this;delete t.policiesTable[e]}},{key:"authorise",value:function(e){var t=this;return console.log(t.policiesTable),new Promise(function(n,o){"allow"==t.checkPolicies(e)?t.idModule.loginWithRP("google identity","scope").then(function(t){e.body.assertedIdentity=JSON.stringify(t),e.body.authorised=!0,n(e)},function(e){o(e)}):n(!1)})}},{key:"checkPolicies",value:function checkPolicies(message){var _this=this,_results=["allow"],_policies=_this.policiesTable[message.body.hypertyURL];if(void 0!=_policies)for(var _numPolicies=_policies.length,i=0;_numPolicies>i;i++){var _policy=_policies[i];console.log(_policy),"blacklist"==_policy.target&&_this.blacklist.indexOf(eval(_policy.subject))>-1&&(console.log("Is in blacklist!"),_results.push(_policy.action)),"whitelist"==_policy.target&&_this.whitelist.indexOf(eval(_policy.subject))>-1&&(console.log("Is in whitelist!"),_results.push(_policy.action))}return console.log(_results),_results.indexOf("deny")>-1?"deny":"allow"}}]),PolicyEngine}();exports["default"]=PolicyEngine,module.exports=exports["default"]},{}],5:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(t,n){o(this,e);var r=this;r._url=t,r._bus=n}return r(e,[{key:"create",value:function(e,t){var n=this,o={type:"create",from:n._url,to:"domain://msg-node."+e+"/hyperty-address-allocation",body:{number:t}};return new Promise(function(e,t){n._bus.postMessage(o,function(n){200===n.body.code?e(n.body.allocated):t(n.body.desc)})})}},{key:"url",get:function(){return this._url}}]),e}();n["default"]=i,t.exports=n["default"]},{}],6:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=function(e,t,n){for(var o=!0;o;){var r=e,i=t,s=n;o=!1,null===r&&(r=Function.prototype);var u=Object.getOwnPropertyDescriptor(r,i);if(void 0!==u){if("value"in u)return u.value;var a=u.get;if(void 0===a)return;return a.call(s)}var c=Object.getPrototypeOf(r);if(null===c)return;e=c,t=i,n=s,o=!0,u=c=void 0}},a=e("../utils/EventEmitter"),c=o(a),l=e("./AddressAllocation"),f=o(l),d=e("../utils/utils.js"),p=function(e){function t(e,n,o){if(r(this,t),u(Object.getPrototypeOf(t.prototype),"constructor",this).call(this),!e)throw new Error("runtimeURL is missing.");var i=this;i.registryURL=e+"/registry/123",i.appSandbox=n,i.runtimeURL=e,i.remoteRegistry=o,i.hypertyiesList={},i.protostubsList={},i.sandboxesList={},i.pepList={}}return i(t,e),s(t,[{key:"getAppSandbox",value:function(){var e=this;return e.appSandbox}},{key:"registerHyperty",value:function(e,t){var n=this,o=(0,d.divideURL)(t).domain,r=new Promise(function(t,r){return void 0!==n._messageBus?n.resolve("hyperty-runtime://"+o).then(function(){n.sandboxesList.hasOwnProperty(o)||(n.sandboxesList[o]=e,console.log("REGISTRY SANDBOX: ",e,o,n),e.addListener("*",function(e){n._messageBus.postMessage(e)}));var i=1,s=o;n.addressAllocation.create(s,i).then(function(e){e.forEach(function(e){n._messageBus.addListener(e+"/status",function(t){console.log("Message addListener for : ",e+"/status -> "+t)})}),t(e[0])})["catch"](function(e){console.log("Address Reason: ",e),r(e)})}):void r("MessageBus not found on registerStub")});return r}},{key:"unregisterHyperty",value:function(e){var t=this,n=new Promise(function(n,o){var r=t.hypertiesList[e];void 0===r?o("Hyperty not found"):n("Hyperty successfully deleted")});return n}},{key:"discoverProtostub",value:function(e){if(!e)throw new Error("Parameter url needed");var t=this,n=new Promise(function(n,o){var r=t.protostubsList[e];void 0===r?o("requestUpdate couldn' get the ProtostubURL"):n(r)});return n}},{key:"registerStub",value:function(e,t){var n,o=this,r=new Promise(function(r,i){void 0===o._messageBus&&i("MessageBus not found on registerStub");var s=t;t.indexOf("msg-node.")||(s=t.substring(t.indexOf(".")+1)),n="msg-node."+s+"/protostub/"+Math.floor(1e4*Math.random()+1),o.protostubsList[s]=n,o.sandboxesList[n]=e,r(n),o._messageBus.addListener(n+"/status",function(e){e.resource===e.to+"/status"&&console.log("RuntimeProtostubURL/status message: ",e.body.value)})});return r}},{key:"unregisterStub",value:function(e){var t=this,n=new Promise(function(n,o){var r=t.protostubsList[e];void 0===r?o("Error on unregisterStub: Hyperty not found"):(delete t.protostubsList[e],n("ProtostubURL removed"))});return n}},{key:"registerPEP",value:function(e,t){var n=this,o=new Promise(function(o,r){n.pepList[t]=e,o("PEP registered with success")});return o}},{key:"unregisterPEP",value:function(e){var t=this,n=new Promise(function(n,o){var r=t.pepList[e];void 0===r?o("Pep Not found."):n("PEP successfully removed.")});return n}},{key:"onEvent",value:function(e){}},{key:"getSandbox",value:function(e){if(!e)throw new Error("Parameter url needed");var t=this,n=new Promise(function(n,o){var r=t.sandboxesList[e];void 0===r?o("Sandbox not found"):n(r)});return n}},{key:"resolve",value:function(e){console.log("resolve "+e);var t=this,n=(0,d.divideURL)(e).domain,o=new Promise(function(e,o){n.indexOf("msg-node.")||(n=n.substring(n.indexOf(".")+1));var r=t.protostubsList[n];t.addEventListener("runtime:stubLoaded",function(t){e(t)}),void 0!==r?e(r):t.trigger("runtime:loadStub",n)});return o}},{key:"messageBus",get:function(){var e=this;return e._messageBus},set:function(e){var t=this;t._messageBus=e;var n=new f["default"](t.registryURL,e);t.addressAllocation=n}}]),t}(c["default"]);n["default"]=p,t.exports=n["default"]},{"../utils/EventEmitter":13,"../utils/utils.js":14,"./AddressAllocation":5}],7:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var r=e("./runtime/RuntimeUA"),i=o(r),s=e("./sandbox/Sandbox"),u=o(s),a=e("./bus/MiniBus"),c=o(a),l=e("./sandbox/SandboxRegistry"),f=o(l);n.RuntimeUA=i["default"],n.Sandbox=u["default"],n.MiniBus=c["default"],n.SandboxRegistry=f["default"]},{"./bus/MiniBus":2,"./runtime/RuntimeUA":9,"./sandbox/Sandbox":10,"./sandbox/SandboxRegistry":11}],8:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(){o(this,e),console.log("runtime catalogue")}return r(e,[{key:"getHypertyRuntimeURL",value:function(){return _hypertyRuntimeURL}},{key:"_makeExternalRequest",value:function(e){return new Promise(function(t,n){var o=new XMLHttpRequest;o.onreadystatechange=function(e){var o=e.currentTarget;4===o.readyState&&(200===o.status?t(o.responseText):n(o.responseText))},o.open("GET",e,!0),o.send()})}},{key:"getHypertyDescriptor",value:function(e){var t=this;return new Promise(function(n,o){var r=e.substr(e.lastIndexOf("/")+1),i={guid:"guid",id:"idHyperty",classname:r,description:"description of "+r,kind:"hyperty",catalogueURL:"....",sourceCode:"../resources/"+r+".ES5.js",dataObject:"",type:"",messageSchema:"",configuration:{runtimeURL:t._runtimeURL},policies:"",constraints:"",hypertyCapabilities:"",protocolCapabilities:""};n(i)})}},{key:"getHypertySourceCode",value:function(e){var t=this;return new Promise(function(n,o){t._makeExternalRequest(e).then(function(e){n(e)})["catch"](function(e){o(e)})})}},{key:"getStubDescriptor",value:function(e){var t=this;return new Promise(function(e,n){var o={guid:"guid",id:"idProtoStub",classname:"VertxProtoStub",description:"description of ProtoStub",kind:"hyperty",catalogueURL:"....",sourceCode:"../resources/VertxProtoStub.js",dataObject:"",type:"",messageSchema:"",configuration:{url:"ws://localhost:9090/ws",runtimeURL:t._runtimeURL},policies:"",constraints:"",hypertyCapabilities:"",protocolCapabilities:""};e(o)})}},{key:"getStubSourceCode",value:function(e){var t=this;return new Promise(function(n,o){t._makeExternalRequest(e).then(function(e){n(e)})["catch"](function(e){o(e)})})}},{key:"runtimeURL",set:function(e){var t=this;t._runtimeURL=e},get:function(){var e=this;return e._runtimeURL}}]),e}();n["default"]=i,t.exports=n["default"]},{}],9:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var i=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),s=e("../registry/Registry"),u=o(s),a=e("../identity/IdentityModule"),c=o(a),l=e("../policy/PolicyEngine"),f=o(l),d=e("../bus/MessageBus"),p=o(d),y=e("./RuntimeCatalogue"),b=o(y),v=e("../syncher/SyncherManager"),g=o(v),h=function(){function e(t){if(r(this,e),!t)throw new Error("The sandbox factory is a needed parameter");var n=this;n.sandboxFactory=t,n.runtimeCatalogue=new b["default"];var o="runtime://ua.pt/"+Math.floor(1e4*Math.random()+1);n.runtimeURL=o,n.runtimeCatalogue.runtimeURL=o;var i=t.createAppSandbox();n.identityModule=new c["default"],n.policyEngine=new f["default"],n.registry=new u["default"](o,i),n.messageBus=new p["default"](n.registry),n.registry.messageBus=n.messageBus,n.registry.addEventListener("runtime:loadStub",function(e){n.loadStub(e).then(function(t){n.registry.trigger("runtime:stubLoaded",e)})["catch"](function(e){console.error(e)})}),t.messageBus=n.messageBus,n.syncherManager=new g["default"](n.runtimeURL,n.messageBus,{})}return i(e,[{key:"discoverHiperty",value:function(e){}},{key:"registerHyperty",value:function(e,t){}},{key:"loadHyperty",value:function(e){var t=this;if(!e)throw new Error("Hyperty descriptor url parameter is needed");return new Promise(function(n,o){var r=void 0,i=void 0,s=void 0,u=void 0,a=function(e){console.error(e),o(e)};console.log("------------------ Hyperty ------------------------"),console.info("Get hyperty descriptor for :",e),t.runtimeCatalogue.getHypertyDescriptor(e).then(function(e){console.info("1: return hyperty descriptor",e),s=e;var n=e.sourceCode;return t.runtimeCatalogue.getHypertySourceCode(n)}).then(function(e){console.info("2: return hyperty source code"),u=e;var t=!0;return t}).then(function(e){console.info("3: return policy engine result");var n=!0,o=void 0;return o=n?t.registry.getAppSandbox():t.registry.getSandbox(domain)}).then(function(e){return console.info("4: return the sandbox",e),e},function(e){return console.info("4.1: try to register a new sandbox",e),t.sandboxFactory.createSandbox()}).then(function(n){return console.info("5: return sandbox and register"),i=n,t.registry.registerHyperty(n,e)}).then(function(e){return console.info("6: Hyperty url, after register hyperty",e),r=e,i.deployComponent(u,r,s.configuration)}).then(function(e){console.info("7: Deploy component status for hyperty: ",r),t.messageBus.addListener(r,function(e){i.postMessage(e)});var o={runtimeHypertyURL:r,status:"Deployed"};n(o),console.log("------------------ END ------------------------")})["catch"](a)})}},{key:"loadStub",value:function(e){var t=this;if(!e)throw new Error("domain parameter is needed");return new Promise(function(n,o){var r=void 0,i=void 0,s=void 0,u=void 0,a=function(e){console.error(e),o(e)};console.info("------------------- ProtoStub ---------------------------\n"),console.info("Discover or Create a new ProtoStub for domain: ",e),t.registry.discoverProtostub(e).then(function(e){return console.info("1. Proto Stub Discovered: ",e),i=e},function(n){return console.info("1. Proto Stub not found:",n),t.runtimeCatalogue.getStubDescriptor(e)}).then(function(e){console.info("2. return the ProtoStub descriptor:",e),i=e;var n=e.sourceCode;return t.runtimeCatalogue.getStubSourceCode(n)}).then(function(e){console.info("3. return the ProtoStub Source Code: "),u=e;var t=!0;return t}).then(function(n){return t.registry.getSandbox(e)}).then(function(e){return console.info("4. if the sandbox is registered then return the sandbox",e),r=e,e},function(e){return console.info("5. Sandbox was not found, creating a new one"),t.sandboxFactory.createSandbox()}).then(function(n){return console.info("6. return the sandbox instance and the register",n),r=n,t.registry.registerStub(r,e)}).then(function(e){return console.info("7. return the runtime protostub url: ",e),s=e,r.deployComponent(u,e,i.configuration)}).then(function(e){console.info("8: return deploy component for sandbox status"),t.messageBus.addListener(s,function(e){r.postMessage(e)}),r.addListener("*",function(e){t.messageBus.postMessage(e)});var o={runtimeProtoStubURL:s,status:"Deployed"};n(o),console.info("------------------- END ---------------------------\n")})["catch"](a)})}},{key:"checkForUpdate",value:function(e){}}]),e}();n["default"]=h,t.exports=n["default"]},{"../bus/MessageBus":1,"../identity/IdentityModule":3,"../policy/PolicyEngine":4,"../registry/Registry":6,"../syncher/SyncherManager":12,"./RuntimeCatalogue":8}],10:[function(e,t,n){"use strict";function o(e){return e&&e.__esModule?e:{"default":e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function i(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}Object.defineProperty(n,"__esModule",{value:!0});var s=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),u=function(e,t,n){for(var o=!0;o;){var r=e,i=t,s=n;o=!1,null===r&&(r=Function.prototype);var u=Object.getOwnPropertyDescriptor(r,i);if(void 0!==u){if("value"in u)return u.value;var a=u.get;if(void 0===a)return;return a.call(s)}var c=Object.getPrototypeOf(r);if(null===c)return;e=c,t=i,n=s,o=!0,u=c=void 0}},a=e("../sandbox/SandboxRegistry"),c=o(a),l=e("../bus/MiniBus"),f=o(l),d=function(e){function t(){r(this,t),u(Object.getPrototypeOf(t.prototype),"constructor",this).call(this)}return i(t,e),s(t,[{key:"deployComponent",value:function(e,t,n){var o=this;return new Promise(function(r,i){var s={type:"create",from:c["default"].ExternalDeployAddress,to:c["default"].InternalDeployAddress,body:{url:t,sourceCode:e,config:n}};o.postMessage(s,function(e){200===e.body.code?r("deployed"):i(e.body.desc)})})}},{key:"removeComponent",value:function(e){var t=this;return new Promise(function(n,o){var r={type:"delete",from:c["default"].ExternalDeployAddress,to:c["default"].InternalDeployAddress,body:{url:e}};t.postMessage(r,function(e){200===e.body.code?n("undeployed"):o(e.body.desc)})})}}]),t}(f["default"]);n["default"]=d,t.exports=n["default"]},{"../bus/MiniBus":2,"../sandbox/SandboxRegistry":11}],11:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(t){o(this,e);var n=this;n._bus=t,n._components={},t.addListener(e.InternalDeployAddress,function(e){switch(e.type){case"create":n._onDeploy(e);break;case"delete":n._onRemove(e)}})}return r(e,[{key:"_responseMsg",value:function(t,n,o){var r={id:t.id,type:"response",from:e.InternalDeployAddress,to:e.ExternalDeployAddress},i={};return n&&(i.code=n),o&&(i.desc=o),r.body=i,r}},{key:"_onDeploy",value:function(e){var t=this,n=e.body.config,o=e.body.url,r=e.body.sourceCode,i=void 0,s=void 0;if(t._components.hasOwnProperty(o))i=500,s="Instance "+o+" already exist!";else try{t._components[o]=t._create(o,r,n),i=200}catch(u){i=500,s=u}var a=t._responseMsg(e,i,s);t._bus.postMessage(a)}},{key:"_onRemove",value:function(e){var t=this,n=e.body.url,o=void 0,r=void 0;t._components.hasOwnProperty(n)?(delete t._components[n],t._bus.removeAllListenersOf(n),o=200):(o=500,r="Instance "+n+" doesn't exist!");var i=t._responseMsg(e,o,r);t._bus.postMessage(i)}},{key:"_create",value:function(e,t,n){}},{key:"components",get:function(){return this._components}}]),e}();i.ExternalDeployAddress="sandbox://external",i.InternalDeployAddress="sandbox://internal",n["default"]=i,t.exports=n["default"]},{}],12:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=e("../utils/utils.js"),s=function(){function e(t,n,r){o(this,e);var i=this;i._bus=n,i._registry=r,i._url=t+"/sm",i._subscriptions={},n.addListener(i._url,function(e){switch(console.log("SyncherManager-RCV: ",e),e.type){case"create":i._onCreate(e);break;case"delete":i._onDelete(e)}})}return r(e,[{key:"_onCreate",value:function(e){var t=this,n=e.from,o="resource://obj1",r=o+"/subscription",s=t._bus.addListener(o,function(e){console.log(o+"-RCV: ",e),t._subscriptions[o].subs.forEach(function(n){var r=(0,i.deepClone)(e);r.id=0,r.from=o,r.to=n,t._bus.postMessage(r)})}),u=t._bus.addListener(r,function(e){switch(console.log(r+"-RCV: ",e),e.type){case"subscribe":t._onSubscribe(o,e);break;case"unsubscribe":t._onUnSubscribe(o,e)}});t._subscriptions[o]={owner:n,sl:u,cl:s,subs:[]},t._bus.postMessage({id:e.id,type:"response",from:e.to,to:n,body:{code:200,resource:o}}),setTimeout(function(){e.body.authorise.forEach(function(r){t._bus.postMessage({type:"create",from:n,to:r,body:{schema:e.body.schema,resource:o,value:e.body.value}})})})}},{key:"_onDelete",value:function(e){var t=this,n="<objURL>";delete t._subscriptions[n],t._bus.removeAllListenersOf(n),t._bus.removeAllListenersOf(n+"/subscription")}},{key:"_onSubscribe",value:function(e,t){var n=this,o=t.from,r=n._subscriptions[e];if(r[o]){var i={id:t.id,type:"response",from:t.to,to:o,body:{code:500,desc:"Subscription for ("+e+" : "+o+") already exists!"}};return void n._bus.postMessage(i)}var s="sub/pub";if("sub/pub"===s){var u={type:"forward",from:n._url,to:r.owner,body:{type:t.type,from:t.from,to:e}};t.body&&(u.body.body=t.body),n._bus.postMessage(u,function(r){console.log("forward-reply: ",r),200===r.body.code&&n._subscriptions[e].subs.push(o),n._bus.postMessage({id:t.id,type:"response",from:t.to,to:o,body:r.body})})}}},{key:"_onUnSubscribe",value:function(e,t){var n=this,o=t.from,r=n._subscriptions[e].subs,i=r.indexOf(o);r.splice(i,1)}},{key:"url",get:function(){return this._url}}]),e}();n["default"]=s,t.exports=n["default"]},{"../utils/utils.js":14}],13:[function(e,t,n){"use strict";function o(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),i=function(){function e(){o(this,e)}return r(e,[{key:"addEventListener",value:function(e,t){var n=this;n[e]=t}},{key:"trigger",value:function(e,t){var n=this;n[e]&&n[e](t)}}]),e}();n["default"]=i,t.exports=n["default"]},{}],14:[function(e,t,n){"use strict";function o(e){var t=/([a-zA-Z-]*)?:\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi,n="$1,$2,$3",o=e.replace(t,n).split(","),r={type:o[0],domain:o[1],identity:o[2]};return r}function r(e){return JSON.parse(JSON.stringify(e))}Object.defineProperty(n,"__esModule",{value:!0}),n.divideURL=o,n.deepClone=r},{}]},{},[7])(7)});