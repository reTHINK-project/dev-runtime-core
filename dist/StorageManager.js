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


!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define("StorageManager",[],t):"object"==typeof exports?exports.StorageManager=t():e.StorageManager=t()}(window,function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=21)}({1:function(e,t,n){var r,o;!function(i,a){"use strict";void 0===(o="function"==typeof(r=function(){var e=function(){},t="undefined",n=["trace","debug","info","warn","error"];function r(e,t){var n=e[t];if("function"==typeof n.bind)return n.bind(e);try{return Function.prototype.bind.call(n,e)}catch(t){return function(){return Function.prototype.apply.apply(n,[e,arguments])}}}function o(t,r){for(var o=0;o<n.length;o++){var i=n[o];this[i]=o<t?e:this.methodFactory(i,t,r)}this.log=this.debug}function i(n,i,a){return function(n){return"debug"===n&&(n="log"),typeof console!==t&&(void 0!==console[n]?r(console,n):void 0!==console.log?r(console,"log"):e)}(n)||function(e,n,r){return function(){typeof console!==t&&(o.call(this,n,r),this[e].apply(this,arguments))}}.apply(this,arguments)}function a(e,r,a){var u,l=this,c="loglevel";function s(){var e;if(typeof window!==t){try{e=window.localStorage[c]}catch(e){}if(typeof e===t)try{var n=window.document.cookie,r=n.indexOf(encodeURIComponent(c)+"=");-1!==r&&(e=/^([^;]+)/.exec(n.slice(r))[1])}catch(e){}return void 0===l.levels[e]&&(e=void 0),e}}e&&(c+=":"+e),l.name=e,l.levels={TRACE:0,DEBUG:1,INFO:2,WARN:3,ERROR:4,SILENT:5},l.methodFactory=a||i,l.getLevel=function(){return u},l.setLevel=function(r,i){if("string"==typeof r&&void 0!==l.levels[r.toUpperCase()]&&(r=l.levels[r.toUpperCase()]),!("number"==typeof r&&r>=0&&r<=l.levels.SILENT))throw"log.setLevel() called with invalid level: "+r;if(u=r,!1!==i&&function(e){var r=(n[e]||"silent").toUpperCase();if(typeof window!==t){try{return void(window.localStorage[c]=r)}catch(e){}try{window.document.cookie=encodeURIComponent(c)+"="+r+";"}catch(e){}}}(r),o.call(l,r,e),typeof console===t&&r<l.levels.SILENT)return"No console available for logging"},l.setDefaultLevel=function(e){s()||l.setLevel(e,!1)},l.enableAll=function(e){l.setLevel(l.levels.TRACE,e)},l.disableAll=function(e){l.setLevel(l.levels.SILENT,e)};var f=s();null==f&&(f=null==r?"WARN":r),l.setLevel(f,!1)}var u=new a,l={};u.getLogger=function(e){if("string"!=typeof e||""===e)throw new TypeError("You must supply a name when creating a logger.");var t=l[e];return t||(t=l[e]=new a(e,u.getLevel(),u.methodFactory)),t};var c=typeof window!==t?window.log:void 0;return u.noConflict=function(){return typeof window!==t&&window.log===u&&(window.log=c),u},u.getLoggers=function(){return l},u})?r.call(t,n,t,e):r)||(e.exports=o)}()},21:function(e,t,n){"use strict";function r(e){return(r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}n.r(t);var i=n(1).getLogger("StorageManager"),a=function(){function e(t,n,r,o){arguments.length>4&&void 0!==arguments[4]&&arguments[4];var a=arguments.length>5&&void 0!==arguments[5]&&arguments[5];if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),!t)throw Error("The Storage Manager needs the database instance");if(!n)throw Error("The Storage Manager needs the storage name");var u={};r?u=r:u[n]="key,version,value",t.open().then(function(e){i.info("Found database name "+e.name+" with version no: "+e.verno)}).catch(i.error),this.db=t,this.storageName=n,this._remoteStorage=a,this._runtimeUA=o}return function(e,t,n){t&&o(e.prototype,t)}(e,[{key:"connect",value:function(e){return this.db.connect(this._remoteStorage,e)}},{key:"disconnect",value:function(){var e=this;return new Promise(function(t,n){e.db.disconnect(e._remoteStorage).then(function(){t()},function(e){n(e)})})}},{key:"getBackupRevision",value:function(e){var t=this;return new Promise(function(e){t.db._syncNodes.get({type:"remote"}).then(function(t){console.log("[StorageManager.getBackupRevision] retrieved status: ",t),t&&t.hasOwnProperty("appliedRemoteRevision")&&(null===t.appliedRemoteRevision&&(t.appliedRemoteRevision=0),e(t.appliedRemoteRevision))})})}},{key:"_updateBackupRevision",value:function(e){var t=this;return new Promise(function(n){t.db._syncNodes.get({type:"remote"}).then(function(r){console.log("[StorageManager._updateBackupRevision] retrieved status: ",r),r&&r.hasOwnProperty("appliedRemoteRevision")&&(null===r.appliedRemoteRevision&&(r.appliedRemoteRevision=0),t._runtimeUA._updateRuntimeStatus({resource:e,value:{backupRevision:r.appliedRemoteRevision}}),n(r.appliedRemoteRevision))})})}},{key:"_checkKey",value:function(e){return"string"!=typeof e?e.toString():e}},{key:"_getTable",value:function(e){var t;try{t=this.db.table(this.storageName).name}catch(n){t=this.db.table(e).name}return t}},{key:"_getPrimaryKey",value:function(e){return this.db.table(e).schema.primKey.name}},{key:"_isDefaultSchema",value:function(e){var t=this._getTable(e),n=this.db[t].schema.instanceTemplate;return n.hasOwnProperty("value")&&n.hasOwnProperty("version")&&n.hasOwnProperty("key")}},{key:"set",value:function(e,t,n,r){var o=this,a=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];return new Promise(function(u,l){i.info("[StorageManager] - set ",e,n),r=r||e;var c=o._getTable(r),s=o._getPrimaryKey(c),f=n;if(o._isDefaultSchema(r))f={key:e,version:t,value:n};else{var v={};v[s]=e,Object.assign(f,v)}o.db[c].put(f).then(function(){a&&f.backup&&f.url?o._updateBackupRevision(f.url).then(function(){u()}):u()},function(){u()})})}},{key:"get",value:function(e,t,n){var o=this;console.info("[StorageManager] - get ",e,t),n=n||e;var i=this._getTable(n);if(i){var a=this._getPrimaryKey(i);return this.db.transaction("rw!",this.db[i],function(){if(!e&&!t)return o.db[i].toArray().then(function(e){return e.length>0?e.reduce(function(e,t){return e[t[a]]=t,e},function(){return{}}):{}});if(!t)return o.db[i].where(a).equals(e).first().then(function(e){return e&&e.hasOwnProperty("value")?e.value:e});var n=r(t);switch(Array.isArray(t)&&(n="array"),n){case"string":return o.db[i].where(e).equals(t).first().then(function(e){return e&&e.hasOwnProperty("value")?e.value:e});case"object":var u="value."+Object.keys(t).toString(),l=Object.values(t);return console.log(u,l),o.db[i].where(u).anyOf(l).first().then(function(e){return e&&e.hasOwnProperty("value")?e.value:e});case"array":return console.log("ARRAY:",t),o.db[i].where(t).then(function(e){return e&&e.hasOwnProperty("value")?e.value:e})}})}}},{key:"getVersion",value:function(e,t,n){var r=this;i.info("[StorageManager] - getVersion for key ",e),n=n||e;var o=this._getTable(n),a=this._getPrimaryKey(o),u=t;return t||(u=e),this.db.transaction("rw!",this.db[o],function(){return r.db[o].where(a).equals(u).first().then(function(e){return e&&e.hasOwnProperty("version")?e.version:e}).catch(function(t){i.info("error getting the version for ",e," with error: ",t)})})}},{key:"delete",value:function(e,t,n){if(e){n=n||e;var r=this._getTable(n),o=this._getPrimaryKey(r),i=t;return t||(i=e),this.db[r].where(o).equals(i).delete()}return this.db.delete()}},{key:"remoteStorage",set:function(e){this._remoteStorage=e}}]),e}();t.default=a}})});