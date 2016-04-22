// jshint browser:true, jquery: true

import {addLoader, removeLoader, documentReady, errorMessage} from './support';

// import {MessageFactory} from 'service-framework';

import RuntimeUA from '../src/runtime/RuntimeUA';
import RuntimeFactory from '../resources/RuntimeFactory';

let runtimeFactory = new RuntimeFactory();
// let avatar = 'https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg';

// You can change this at your own domain
let domain = 'localhost';

let runtime = new RuntimeUA(runtimeFactory, domain);
window.runtime = runtime;

// Check if the document is ready
if (document.readyState === 'complete') {
  documentReady();
} else {
  window.addEventListener('onload', documentReady, false);
  document.addEventListener('DOMContentLoaded', documentReady, false);
}

let loginBtn = document.querySelector('.login');
loginBtn.addEventListener('click', function(e) {

  let loginPanel = document.querySelector('.login-panel');
  let content = loginPanel.querySelector('.card-action');
  addLoader(content);

  console.log('Generate GUID, returning mnemonic:');
  console.log(runtime.graphConnector.generateGUID());
  console.log('GUID:')
  console.log(runtime.graphConnector.globalRegistryRecord.guid);
  let jwt = runtime.graphConnector.signGlobalRegistryRecord();
  console.log('Global Registry Record (JWT):')
  console.log(jwt);
  console.log('Sending Gloal Registry Record:')
  runtime.graphConnector.sendGlobalRegistryRecord(jwt);

});

