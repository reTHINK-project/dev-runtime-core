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

  // Address Book Functionalities
  runtime.graphConnector.addContact('nm0_J8Xpn74sdBBfV6Au7jsI12whtvd9PuJplCe7Yg8', 'John', 'Doe');
  runtime.graphConnector.addContact('HCnzDTY51uwsl1_NZdoJnYRAiBowDKXqNN7oOX6TLuc', 'Alice', 'Apple');
  runtime.graphConnector.addContact('HmDLrX7RgrZc28RHwNGIffcckIEbbu1vCBKYoyVPOSQ', 'Charlie', 'Miller');
  runtime.graphConnector.removeContact('nm0_J8Xpn74sdBBfV6Au7jsI12whtvd9PuJplCe7Yg8');
  console.log(runtime.graphConnector.checkGUID('HCnzDTY51uwsl1_NZdoJnYRAiBowDKXqNN7oOX6TLuc'));
  console.log(runtime.graphConnector.getContact('Alice'));
  runtime.graphConnector.calculateBloomFilter1Hop();
  runtime.graphConnector.addUserID('http://example.com/Bob');
  runtime.graphConnector.addUserID('http://serviceproviderx.com/Bobby');
  runtime.graphConnector.removeUserID('http://serviceproviderx.com/Bobby');
  
  // GUID generation and contacting the Global Registry
  console.log('Generate GUID, returning mnemonic:');
  console.log(runtime.graphConnector.generateGUID());
  console.log('GUID:')
  console.log(runtime.graphConnector.globalRegistryRecord.guid);
  let jwt = runtime.graphConnector.signGlobalRegistryRecord();
  console.log('Global Registry Record (JWT):')
  console.log(jwt);
  console.log('Sending Gloal Registry Record:')

  var sendPromise = runtime.graphConnector.sendGlobalRegistryRecord(jwt);
  sendPromise.then(function (result) {
	console.log('Result for sending the Global Registry Record');
    console.log(result);
	queryGlobalRegistry();
  }, function (error) {
    console.error('Error querying Global Registry: ', error);
  });
  
});


// querying the Global Registry
function queryGlobalRegistry() {

  console.log('Query Global Registry');
  
  var queryPromise = runtime.graphConnector.queryGlobalRegistry('f1CuNFhbYbPIR_Ng0GbtncTjoPGPfULY_p9J2nLX7bw');
  queryPromise.then(function (result) {
	console.log('Result for querying the Global Registry:');
    console.log(result);
	reuseGUID();
  }, function (error) {
    console.error('Error querying Global Registry: ', error);
  });

}


// reusing an existing GUID by entering the mnemonic
function reuseGUID() {

  console.log('reuse GUID');
  
  var reuseGUIDPromise = runtime.graphConnector.useGUID('bag silly differ uncover later outer roast tail tissue naive dinner utility that winter assume ball');
  reuseGUIDPromise.then(function (result) {
	console.log('Result for reusing an existing GUID:');
    console.log(result);
  }, function (error) {
    console.error('Error querying Global Registry: ', error);
  });

}