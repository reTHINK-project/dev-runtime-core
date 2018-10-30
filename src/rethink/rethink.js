// jshint
// Runtime
import runtimeFactory from './runtimeFactory';

//import MiniBus from 'runtime-core/dist/minibus';
//import RuntimeCatalogue from 'runtime-core/dist/RuntimeCatalogue';

import IdentitiesGUI from './IdentitiesGUI';
import RuntimeUA from '../runtime/RuntimeUA';
//import runtimeConfiguration from './runtimeConfiguration';

window.components = {};
//let minibus = new MiniBus();

const runtimeDescriptor = {
  "sourcePackageURL": "/sourcePackage",
  "version": "0.20",
  "description": "",
  "language": "Javascript",
  "cguid": "3bc366f2d0ba3d681e7a3899917c5d3de",
  "type": "Runtimes",
  "runtimeType": "browser",
  "p2pHandlerStub": "",
  "p2pRequesterStub": "",
  "constraints": {
    "browser": true,
    "mic": true,
    "camera": true,
    "sensor": false,
    "webrtc": true,
    "ortc": true,
    "http": true,
    "https": true,
    "ws": true,
    "wss": true,
    "coap": false,
    "datachannel": false
  },
  "objectName": "Runtime",
  "configuration": {},
  "messageSchemas": [],
  "dataObjects": [],
  "signature": "",
  "accessControlPolicy": "somePolicy"
  };

const rethink = {

  install: function({domain, runtimeURL, development}={}) {

    return new Promise((resolve, reject) => {

        let runtime = new RuntimeUA(runtimeDescriptor, runtimeFactory, domain);

        window.runtime = runtime;

        runtime.init().then((result) => {

          let idmGuiURL = runtime.identityModule._runtimeURL + '/identity-gui';
          let idmURL = runtime.identityModule._runtimeURL + '/idm';
          let messageBus = runtime.messageBus;
          let identitiesGUI = new IdentitiesGUI(idmGuiURL, idmURL, messageBus);
          console.log('identitiesGUI: ', identitiesGUI);

          let runtimeProxy = {

          requireHyperty: function(hyperty) {

          return new Promise(function(resolve, reject) {

            //TODO: Work the message errors, probably use message factory
            runtime.loadHyperty(hyperty, true).then(function(result) {

              resolve(result);
            }).catch(function(reason) {
              reject(reason);
            });

          });
        },

        requireProtostub: function (domain) {
          return new Promise(function(resolve, reject) {

            //TODO: Work the message errors, probably use message factory
            runtime.loadStub(msg.body.value.domain).then(function(result) {

              resolve(result);
            }).catch(function(reason) {
              reject(reason);
            });

          });
        },

        reset: function () {

          return new Promise(function(resolve, reject) {

            //TODO: Work the message errors, probably use message factory
            runtime.reset().then(function(result) {

              resolve(result);
            }).catch(function(reason) {
              reject(reason);
            });

          });
        }
      }

          resolve(runtimeProxy);
        });

      })
      .catch(function(reason) {
        console.error(reason);
        reject(reason);
      });
//    });

  }

};

export default rethink;
