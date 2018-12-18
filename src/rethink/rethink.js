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

  install: function ({ domain, guid, runtimeURL, development } = {}) {

    return new Promise((resolve, reject) => {

      let runtime = new RuntimeUA(runtimeDescriptor, runtimeFactory, domain);

//      window.runtime = runtime;

      runtime.init(guid).then((result) => {

        let idmGuiURL = runtime.identityModule._runtimeURL + '/identity-gui';
        let idmURL = runtime.identityModule._runtimeURL + '/idm';
        let messageBus = runtime.messageBus;
        let idm = runtime.identityModule;
        let identitiesGUI = new IdentitiesGUI(idmGuiURL, idmURL, messageBus);
        console.log('identitiesGUI: ', identitiesGUI);

        let runtimeProxy = {

          requireHyperty: function (hyperty) {

            return new Promise(function (resolve, reject) {

              //TODO: Work the message errors, probably use message factory
              runtime.loadHyperty(hyperty, true)
              .then(function (hypertyInstance) {

                console.log('[rethink.requireHyperty] loaded: ', hypertyInstance.name);

                resolve(hypertyInstance);
              }).catch(function (reason) {
                reject(reason);
              });

            });
          },

          requireProtostub: function (domain) {
            return new Promise(function (resolve, reject) {

              //TODO: Work the message errors, probably use message factory
              runtime.loadStub(domain).then(function (result) {

                let protostubURL = result.url || result.runtimeProtoStubURL;
                let protostubComponent = window.components[protostubURL];
                let protostub = {
                  runtimeProtostubURL: protostubURL,
                  status: result.status,
                  instance: protostubComponent.instance,
                  name: protostubComponent.name
                };

                resolve(protostub);
              }).catch(function (reason) {
                reject(reason);
              });

            });
          },

          authorise: (idp, scope) => {

            return new Promise((resolve, reject) => {
              identitiesGUI.authorise(idp, scope).then((result) => {
                if (result.hasOwnProperty('accessToken')) {
                  console.log('[rethink.authorise] authorised: ', result);

                  resolve(result);

                  //                event.source.postMessage({ to: 'runtime:not-authorised', body: JSON.stringify(result) }, '*');
                } else {
                  console.warn('[rethink.authorise] not authorised: ', result);

                  reject(result);
                  //                event.source.postMessage({ to: 'runtime:authorised', body: JSON.stringify(result) }, '*');
                }
              });

            });

          },

          login: (idp) => {

            return new Promise((resolve, reject) => {

              identitiesGUI.loginWithIDP(idp).then((result) => {
                //              event.source.postMessage({ to: 'runtime:loggedIn', body: result }, '*');
                console.log('[rethink.login] loggedin: ', result);

                resolve(result);
              });

            });

          },

          listenShowAdmin: () => {
            return new Promise((resolve, reject) => {
              let loaded = (method, params) => {
                    console.log('[rethink.listenShowAdmin]');

                    resolve(true);
              };
              idm.listenShowAdmin(loaded);
            });
          },

          reset: function () {

            return new Promise(function (resolve, reject) {

              //TODO: Work the message errors, probably use message factory
              runtime.reset().then(function (result) {

                resolve(result);
              }).catch(function (reason) {
                reject(reason);
              });

            });
          },

          close: (logOut = false) => {
            console.log('[rethink.close] logout: ', logOut);
            return new Promise((resolve, reject) => {
              runtime.close(logOut).then((result) => {
                //              event.source.postMessage({ to: 'runtime:runtimeClosed', body: result }, '*');
                //  send logout
                if (logOut) {
                  identitiesGUI.logOut().then((result) => {
                    console.log('[rethink.close] closed: ', result);

                    resolve(result);
                    });
                } else {
                  console.log('[rethink.close] closed: ', result);

                  resolve(result);
                }
              })
                .catch((result) => {
                  console.log('[rethink.close] closed: ', result);

                  resolve(result);
                });

            });
          }

        }

        resolve(runtimeProxy);
      });

    })
      .catch(function (reason) {
        console.error(reason);
        reject(reason);
      });
    //    });

  }

};

export default rethink;
