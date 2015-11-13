import {RuntimeUA, Sandbox} from '../src/runtime-core';

import SandboxFactory from '../resources/sandboxes/SandboxFactory';

var sandboxFactory = new SandboxFactory();

var r = new RuntimeUA(sandboxFactory);

window.runtime = r;

indexedDB.deleteDatabase('registry-DB');

setTimeout(function() {

  // Load First Hyperty
  r.loadHyperty('hyperty-catalogue://ua.pt/HelloHyperty').then(function(result) {
    document.querySelector('.runtime-hyperty-url').innerHTML = result.runtimeHypertyURL;
    document.querySelector('.status').innerHTML = result.status;

    var messageObject = {
      header: {
        to:'<destination hyperty runtime url>',
        from: result.runtimeHypertyURL,
        type: 'MESSAGE'
      },
      body:{
        value: '<message to send>'
      }
    };

    var message = 'runtime.messageBus.postMessage(' + JSON.stringify(messageObject) + ')';

    // document.querySelector('.message').innerHTML = message;
  }).catch(function(reason) {
    console.log(reason);
  });

  // Load Second Hyperty
  // r.loadHyperty('hyperty-catalogue://ua.pt/WorldHyperty').then(function(result) {
  //   console.log(result);
  // }).catch(function(reason) {
  //   console.log(reason);
  // });

  // This load stub is not necessary, because for domain ua.pt the loadHyperty
  // create a stub for the same domain;
  // r.loadStub('ua.pt').then(function(result) {
  //   console.log(result);
  // }).catch(function(reason) {
  //   console.log(reason);
  // });

}, 2000);

// END Testing code;
