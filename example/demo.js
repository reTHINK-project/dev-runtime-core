import {RuntimeUA, Sandbox} from '../src/runtime-core';

import SandboxFactory from '../resources/sandboxes/SandboxFactory';

var sandboxFactory = new SandboxFactory();

var r = new RuntimeUA(sandboxFactory);

window.runtime = r;

setTimeout(function() {
  indexedDB.deleteDatabase('registry-DB');
}, 1000);

setTimeout(function() {

  r.loadHyperty('hyperty-catalogue://ua.pt/HelloHyperty').then(function(result) {
    console.log(result);
  }).catch(function(reason) {
    console.log(reason);
  });

  // r.loadHyperty('hyperty-catalogue://ua.pt/WorldHyperty').then(function(result) {
  //   console.log(result);
  // }).catch(function(reason) {
  //   console.log(reason);
  // });

  r.loadStub('msg-node.ua.pt').then(function(result) {
    console.log(result);
  }).catch(function(reason) {
    console.log(reason);
  });

}, 2000);

// END Testing code;
