// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import { secondsSinceEpoch, divideURL, parseMessageURL, stringify, deepClone } from '../utils/utils.js';
import { runtimeConfiguration } from '../runtime/runtimeConfiguration';

import Identities from './Identities';
import GuiFake from './GuiFake';

/**
*
* The Identity Module (Id Module) is the component responsible for handling the
* user identity and the association of this identity with the Hyperty instances,
* in order to make Hyperty instances identifiable. The identity in the reTHINK project
* is not fixed to a unique Identity Service Provider, but obtained through several
* different Identity sources. With this approach, the Id Module provides to the user the
* option to choose the preferred method for authentication.
* This module will thus able to support multiple Identity acquisition methods,
* such as OpenID connect 1.0, Kerberos System, or authentication through smart cards.
* For example, a user with a Google account can use the Google as an Identity Provider to provide Identity Tokens,
*  which can be used by the Identity Module to associate it with a Hyperty instance.
*
* The Identity Module uses a node package, the HelloJS, which is a client-side JavaScript API for authentication
* that facilitates the requests for the OpenID connect protocol. This method allows for some abstraction
* when making requests for different Identity Providers, such as OpenID connect used by Google, Facebook, Microsoft, for example.
*
* When a request for a user identity is made using the method loginWithRP(identifier, scope),
* this method will analyse the Identity Provider chosen to obtain an identity and will use the HelloJS node package
* with the selected Identity Provider and identity scope. After the HelloJS request for an Access Token
* to the Identity Providers, the user will be prompted to authenticate towards the Identity Provider.
* Upon receiving the Access Token, this token is validated with a RESTful web service request to an endpoint
* on the Identity Provider Authorization Server, and after the validation is done,
* an ID token is obtained with the information according to the scope required.
* This ID token is then preserved in this module that can obtained through the getIdentities()
* and is passed as return value of the loginWithRP function. The methods generateAssertion and validateAssertion have not yet been developed.
*
*/
class IdentityModule {

  /**
  * This is the constructor to initialise the Identity Module it does not require any input.
  */
  constructor(runtimeURL, runtimeCapabilities, storageManager, dataObjectsStorage, cryptoManager) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing');
    if (!cryptoManager) throw new Error('cryptoManager is missing');

    _this._runtimeURL = runtimeURL;

    _this.dataObjectsStorage = dataObjectsStorage;
    _this._idmURL = _this._runtimeURL + '/idm';
    _this._guiURL = _this._runtimeURL + '/identity-gui';
    _this.runtimeCapabilities = runtimeCapabilities;

    _this._domain = divideURL(_this._runtimeURL).domain;


    //to store items with this format: {identity: identityURL, token: tokenID}
    _this._identities = new Identities('human', storageManager);

    // to be reviewed: watchingYou identitiesList or identities?
    //    _this.identitiesList = _this.watchingYou.watch('identitiesList', {}, true);
    _this._crypto = cryptoManager;

    /*    _this.emailsList = [];
    let newIdentity = new Identity('guid', 'HUMAN');
    _this.identity = newIdentity;
    _this.currentIdentity;
    _this.identities.defaultIdentity;*/

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {}; // is this needed?

    _this._listOfIdps = [];

    // variable to know if the GUI is deployed to choose the identity. if the real GUI is not deployed, a fake gui is deployed instead.
    _this.guiDeployed = false;

  }

  //******************* GET AND SET METHODS *******************

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;
    _this.addGUIListeners();
  }

  /**
  * return the coreDiscovery component
  * do we need this??
  */
  get coreDiscovery() {
    let _this = this;
    return _this._coreDiscovery;
  }

  /**
  * Set the coreDiscovery component
  * @param {coreDiscovery} coreDiscovery
  */
  set coreDiscovery(coreDiscovery) {
    let _this = this;
    _this._coreDiscovery = coreDiscovery;
  }

  /**
  * return the registry in this idModule
  * @param {registry}           registry
  */
  get registry() {
    let _this = this;
    return _this._registry;
  }

  /**
  * Set the registry in this idModule
  * @param {registry}     reg
  */
  set registry(registry) {
    let _this = this;
    _this._registry = registry;
  }


  //******************* IDENTITY RELEATED METHODS *******************
  /**
  * gets all the information from a given userURL
  * @param  {String}  userURL     user url
  * @return {JSON}    identity    identity bundle from the userURL
  */
  getIdentity(userURL) {
    return this.identities.getIdentity(userURL);
  }

  /**
  * Function to set the current Identity with a given Identity
  * @param {Identity}        identity         identity
  */

  /*  setCurrentIdentity(identity) {
    let _this = this;
    _this.currentIdentity = identity;
  }*/

  /**
  * Function to return all the identities registered within a session by a user.
  * These identities are returned in an array containing a JSON package for each user identity.
  * @return {Array<Identities>}         Identities
  */
  get identities() {
    let _this = this;
    return _this._identities;
  }

  set identities(identities) {
    let _this = this;
    _this._identities = identities;
  }

  get idps() {
    return this._listOfIdps;
  }

  getIdentitiesToChoose() {
    //    let identities = _this.identities.identifiers;

    // let idps = [
    //   { domain: 'google.com', type: 'idToken'},
    //   { domain: 'microsoft.com', type: 'idToken'},
    //   { domain: 'orange.fr', type: 'idToken'},
    //   { domain: 'slack.com', type: 'Legacy'}
    // ];

    // todo: retrieve available idps from runtime catalogue
    // todo: enable oauth idps
    // let idps = [
    //   { domain: 'google.com', type: 'idToken' },
    //   { domain: 'microsoft.com', type: 'idToken' },
    //   { domain: 'facebook.com', type: 'idToken' },
    //   { domain: 'slack.com', type: 'idToken' }
    // ];

    return new Promise((resolve) => {
      let prefix = runtimeConfiguration['catalogueURLs']['idp-proxy'].prefix;
      let suffix = runtimeConfiguration['catalogueURLs']['idp-proxy'].suffix;
      let all = runtimeConfiguration['catalogueURLs']['idp-proxy'].all;

      const url = prefix + this._domain + suffix + all;

      Promise.all([
        this.runtimeCapabilities.isAvailable('browser'),
        this.runtimeCapabilities.isAvailable('node')])
        .then((result) => {

          const isBrowser = result[0];
          const isNode = result[1];

          const constraints = { constraints: {} };
          constraints.constraints.node = isNode;
          constraints.constraints.browser = isBrowser;

          this._getAllIdps(url).then((idps) => {
            const listOfIdps = idps.map(key => { return { domain: key, type: 'idToken' }; });
            log.info('[IdentityModule.getIdentityAssertion:getIdentitiesToChoose]', idps, listOfIdps);
            this._listOfIdps = listOfIdps;
            return resolve({ defaultIdentity: this.identities.defaultIdentity, identities: this.identities.identities, idps: listOfIdps });
          });

        });

    });

  }

  _getAllIdps(allUrl) {

//  let allUrl = 'https://' + this._domain + '/.well-known/idp-proxy/all.json';

  return new Promise(function(resolve, reject) {
    fetch(allUrl).then(function(result) {
/*    $.ajax({
      url: hypertiesURL,
      success: function(result) {*/


        console.log(result);

        result.json().then(function (idps) {
          console.log(idps);
/*          let response = [];
        if (typeof hyperties === 'object') {
          hyperties.forEach(function(key) {
            response.push(key);
          });
        } else if (typeof hyperties === 'string') {
          response = JSON.parse(hyperties);
        }*/

        resolve(idps['idps']);

        })
      },function(reason) {
//      fail: function(reason) {
        reject(reason);
//        notification(reason, 'warn');
      });
  });    
  }


  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
  /*  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
  }*/

  init(guid) {
    let _this = this;
    return new Promise((resolve) => {
      _this._identities.loadIdentities().then(() => {

        if (!guid) {
          _this._crypto.getMyPublicKey().then((key) => {
            let hash = _this._crypto.crypto._sha256(stringify(key)).then((hash) => {

              guid = 'user-guid://' + hash;
              _this.identities.guid = guid;
              _this._identities.loadAccessTokens().then(() => {

                resolve();
              });
            }).catch((error) => {
              console.log('[IdentityModule] error', error);
            });

          });
        } else {
          _this.identities.guid = guid;
          _this._identities.loadAccessTokens().then(() => {

            resolve();
          });
        }

      });

    });

  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identityBundle) {
    log.log('[IdentityModule.getIdentityAssertion:identityBundle]', identityBundle);
    let _this = this;

    return new Promise(function (resolve, reject) {

      //CHECK whether is browser environment or nodejs
      //if it is browser, then create a fake identity

      _this.runtimeCapabilities.isAvailable('browser').then((result) => {
        log.log('runtime browser identity acquisition', result);

        if (!result) return;

        //todo: only idp should be mandatory when identityBundle exists

        if (identityBundle &&
          identityBundle.hasOwnProperty('idp')) {

          let idp = identityBundle.idp;
          let origin = identityBundle.hasOwnProperty('origin') ? identityBundle.origin : 'origin';
          let idHint = identityBundle.hasOwnProperty('idHint') ? identityBundle.idHint : '';

          if (_this.identities.defaultIdentity) {
            let assertion = _this.identities.defaultIdentity;

            if (assertion.expires > secondsSinceEpoch()) {
              return resolve(assertion);
            } else if (assertion.hasOwnProperty('refresh')) {
              log.log('[Identity.IdentityModule.getIdentityAssertion] refreshing assertion: ', assertion);

              _this._refreshIdAssertion().then((newAssertion) => {
                log.log('[IdentityModule.getIdentityAssertion] refreshed assertion.', newAssertion);
                return resolve(newAssertion);
              }, (error) => {
                log.error('[IdentityModule.getIdentityAssertion] error on refresIdAssertion: ', error, ' Asking for a new IdAssertion.')
                _this._getIdAssertionForDomain(origin, idp, idHint).then((assertion) => {
                  resolve(assertion);
                }, (error) => {
                  reject(error);
                });
              });

            } else {
              _this._getIdAssertionForDomain(origin, idp, idHint).then((assertion) => {
                resolve(assertion);
              }, (error) => {
                reject(error);
              });
            }
          } else {
            _this._getIdAssertionForDomain(origin, idp, idHint).then((assertion) => {
              resolve(assertion);
            }, (error) => {
              reject(error);
            });
          }

        } else if (_this.identities.defaultIdentity) {
          let assertion = _this.identities.defaultIdentity;

          if (assertion.expires > secondsSinceEpoch()) {
            return resolve(assertion);
          } else if (assertion.hasOwnProperty('refresh')) {
            log.log('[Identity.IdentityModule.getValidToken] refreshing assertion: ', assertion);

            _this._refreshIdAssertion(assertion).then((newAssertion) => {
              log.log('[IdentityModule.getIdentityAssertion] refreshed assertion.', newAssertion);
              return resolve(newAssertion);

            }, (error) => {
              log.error('[IdentityModule.getIdentityAssertion] error on refresIdAssertion: ', error, ' Asking for a new IdAssertion.')

              _this.selectIdentityFromGUI().then((assertion) => {

                log.log('[IdentityModule] Identity selected from GUI.');

                _this.identities.defaultIdentity = assertion.userProfile.userURL;
                return resolve(assertion);

              }, (err) => {
                return reject(err);
              });

            });

          } else {
            _this.selectIdentityFromGUI().then((assertion) => {

              log.log('[IdentityModule] Identity selected from GUI.');

              _this.identities.defaultIdentity = assertion.userProfile.userURL;
              return resolve(assertion);

            }, (err) => {
              return reject(err);
            });
          }
        } else {
          _this.selectIdentityFromGUI().then((assertion) => {

            log.log('[IdentityModule] Identity selected from GUI.');

            _this.identities.defaultIdentity = assertion.userProfile.userURL;
            return resolve(assertion);

          }, (err) => {
            return reject(err);
          });

        }
      }).catch(error => {
        log.error('Error on identity acquisition ', error);
        return reject(error);
      });

      _this.runtimeCapabilities.isAvailable('node').then((result) => {
        log.log('node identity acquisition', result);

        if (!result) return;

        if (_this.identities.currentIdentity) {
          //TODO verify whether the token is still valid or not.
          // should be needed to make further requests, to obtain a valid token
          return resolve(_this.identities.currentIdentity);
        } else {
          log.log('getIdentityAssertion for nodejs');

          let idp = { type: 'idp', value: 'nodejs-idp', code: 200, auth: false };
          _this.callNodeJsGenerateMethods(idp.value, 'origin').then((value) => {
            resolve(value);
          }, (err) => {
            reject(err);
          });
        }

      }).catch(error => {
        log.error('Error on identity acquisition ', error);
        reject(error);
      });
    });
  }

  _getIdAssertionForDomain(origin, idp, idHint) {

    let _this = this;

    return new Promise((resolve, reject) => {
      _this.selectIdentityForHyperty(origin, idp, idHint).then((assertion) => {
        log.log('[IdentityModule._getIdAssertionForDomain] Identity selected by hyperty.');
        return resolve(assertion);
      }, (err) => { // if it got an error then just select identity from GUI
        // log.error('[IdentityModule] Could not select identity from hyperty.');

        _this.selectIdentityFromGUI().then((newAssertion) => {
          log.log('[IdentityModule._getIdAssertionForDomain] Identity selected by hyperty.');
          return resolve(newAssertion);
        }, (err) => {
          return reject(err);
        });
      });

    });

  }

  _refreshIdAssertion(assertion) {
    let _this = this;

    return new Promise((resolve, reject) => {
      _this.sendRefreshMessage(assertion).then((newAssertion) => {
        log.log('[Identity.IdentityModule.getValidToken] refreshed assertion: ', newAssertion);
        _this.identities.updateAssertion(newAssertion).then(() => {
          resolve(newAssertion);
        }, (err) => {
          log.error('[IdentityModule.getValidToken] error updating the assertion ', err);
          reject(err);
        });
      }, (err) => {
        log.error('[IdentityModule.getValidToken] error refreshing the assertion ', err);
        reject(err);
      });

    });
  }


  /**
  * Function to return all the users URLs registered within a session
  * These users URLs are returned in an array of strings.
  * @return {Array<String>}         users
  */
  getUsersIDs() {
    /*  log.log('[getUsersIDs:emailFormat]', emailFormat);
      log.log('getUsersIDs:emailFormat', emailFormat);
      let _this = this;
      let users = [];*/

    //if request comes with the emailFormat option, then convert url to email format
    /*    let converter = (emailFormat) ? getUserEmailFromURL : (value) => { return value; };

    for (let index in _this.identities) {
      let identity = _this.identities[index];
      users.push(converter(identity.identity));
    }*/

    return this.identities.identifiers;
  }

  /**
  * Function to remove an identity
  * @param {String}    userURL      userURL
  * @return {Promise}
  */

  deleteIdentity(userURL) {

    return this.identities.removeIdentity(userURL);

  }

  /**
  * Function to unregister an identity from the emailsList array and not show in to the GUI
  * @param {String}    email      email
  */
  /*  unregisterIdentity(email) {
    let _this = this;

    for (let e in _this.emailsList) {
      if (_this.emailsList[e] === email) {
        _this.emailsList.splice(e, 1);
      }
    }
  }*/

  // to be used when runtime is not executed in a sandbox

  listenShowAdmin(callback) {
    this._showAdmin = callback;
  }

  /**
  * Function that sends a request to the GUI using messages. Sends all identities registered and
  * the Idps supported, and return the identity/idp received by the GUI
  * @param {Array<identity>}  identities      list of identitiies
  * @param {Array<String>}    idps            list of idps to authenticate
  * @return {Promise}         returns a chosen identity or idp
  */
  requestIdentityToGUI(identities, idps) {
    log.log('[IdentityModule.requestIdentityToGUI:identities]', identities);
    log.log('[IdentityModule.requestIdentityToGUI:idps]', idps);

    let _this = this;
    return new Promise(function (resolve, reject) {

      //condition to check if the real GUI is deployed. If not, deploys a fake gui
      if (_this.guiDeployed === false) {
        let guiFakeURL = _this._guiURL;
        let guiFake = new GuiFake(guiFakeURL, _this._messageBus);
        _this.guiFake = guiFake;
        _this.guiDeployed = true;
      }

      let message = {
        type: 'create', to: _this._guiURL, from: _this._idmURL,
        body: { value: { identities: identities, idps: idps } }
      };

      let callback = msg => {
        _this._messageBus.removeResponseListener(_this._idmURL, msg.id);


        // todo: to return the user URL and not the email or identifier

        if (msg.body.code === 200) {
          let selectedIdentity = msg.body;

          log.log('selectedIdentity: ', selectedIdentity.value);
          resolve(selectedIdentity);
        } else {
          reject('error on requesting an identity to the GUI');
        }
      };

      //postMessage with callback but without timeout
      try {
        _this._messageBus.postMessage(message, callback, false);
      } catch (err) {
        reject('In method callIdentityModuleFunc error: ' + err);
      }
    });
  }

  callNodeJsGenerateMethods(idp, origin) {
    log.log('[callNodeJsGenerateMethods:idp]', idp);
    log.log('[callNodeJsGenerateMethods:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {
      //debugger;
      let publicKey;

      //let keyPair = nodeJSKeyPairPopulate;

      //generates the RSA key pair
      _this._crypto.getMyPublicKey().then(function (key) {

        log.log('[callNodeJsGenerateMethods:key]', key);

        publicKey = stringify(key);

        log.log('[callNodeJsGenerateMethods] NO_URL');

        return _this.generateAssertion(publicKey, origin, 'url', idp);

      }).then(function (value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function (err) {
        log.log(err);
        reject(err);

      });
    });
  }

  callGenerateMethods(idp, origin) {
    log.log('[callGenerateMethods:idp]', idp);
    log.log('[callGenerateMethods:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {

      let publicKey;

      //generates the RSA key pair
      _this._crypto.getMyPublicKey().then(function (key) {

        log.log('[callGenerateMethods:key]', key);

        publicKey = stringify(key);

        //        userkeyPair = keyPair;
        log.log('generateAssertion:no_hint');
        return _this.generateAssertion(publicKey, origin, '', idp);

      }).then(function (url) {
        _this.myHint = url;
        log.log('generateAssertion:hint');
        return _this.generateAssertion(publicKey, origin, url, idp);

      }).then(function (value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function (err) {
        log.error(err);
        reject(err);
      });
    });
  }


  loginSelectedIdentity(publicKey, origin, idp, loginUrl) {
    log.log('[loginSelectedIdentity:publicKey]', publicKey);
    log.log('[loginSelectedIdentity:origin]', origin);
    log.log('[loginSelectedIdentity:idp]', idp);

    //    log.log('[loginSelectedIdentity:keyPair]', keyPair);
    log.log('[loginSelectedIdentity:loginUrl]', loginUrl);
    let _this = this;

    return new Promise((resolve, reject) => {
      log.log('[IdentityModule] openPopup');
      _this.callIdentityModuleFunc('openPopup', { urlreceived: loginUrl }).then((idCode) => {
        return idCode;
      }, (err) => {
        log.error('Error while logging in for the selected identity.');
        return reject(err);
      }).then((idCode) => {
        _this.sendGenerateMessage(publicKey, origin, idCode, idp).then((newResponse) => {
          if (newResponse.hasOwnProperty('assertion')) {
            _this.identities.addAssertion(newResponse).then(result => {
              resolve('Login was successfull');
            }).catch(err => { reject('Login has failed:' + err); });
          } else {
            log.error('Error while logging in for the selected identity.');
            return reject('Could not generate a valid assertion for selected identity.');
          }
        }).catch(err => { reject('On loginSelectedIdentity from method sendGenerateMessage error:  ' + err); });
      });
    });
  }


  selectIdentityForHyperty(origin, idp, idHint) {
    log.log('[selectIdentityForHyperty:origin]', origin);
    log.log('[selectIdentityForHyperty:idp]', idp);
    log.log('[selectIdentityForHyperty:idHint]', idHint);
    let _this = this;

    return new Promise((resolve, reject) => {

      //generates the RSA key pair
      _this._crypto.getMyPublicKey().then(function (key) {
        let publicKey = stringify(key);

        _this.sendGenerateMessage(publicKey, origin, idHint, idp).then((response) => {
          if (response.hasOwnProperty('assertion')) { // identity was logged in, just save it
            _this.identities.addAssertion(response).then((value) => {
              return resolve(response);
            }, (err) => {
              return reject(err);
            });
          } else if (response.hasOwnProperty('loginUrl')) { // identity was not logged in
            _this.loginSelectedIdentity(publicKey, origin, idp, response.loginUrl).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          } else { // you should never get here, if you do then the IdP Proxy is not well implemented
            // log.error('GenerateAssertion returned invalid response.');
            log.log('Proceeding by logging in.');
            _this.callGenerateMethods(idp, origin).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          }
        }).catch(err => { reject('On selectIdentityForHyperty from method sendGenerateMessage error:  ' + err); });
      }).catch(err => { reject('On selectIdentityForHyperty from method generateRSAKeyPair error:  ' + err); });
    });
  }

  selectIdentityFromGUI(origin) {
    log.log('[IdentityModule.selectIdentityFromGUI:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {

      this.getIdentitiesToChoose().then((identitiesInfo) => {
        return _this.requestIdentityToGUI(identitiesInfo.identities, identitiesInfo.idps);
      }).then(value => {

        if (value.type === 'identity') {

          //  let chosenID = getUserURLFromEmail(value.value);
          // hack while the user url is not returned from requestIdentityToGUI;

          /*          let chosenID = 'user://' + _this.identities.currentIdentity.idp.domain + '/' + value.value;

          _this.identities.defaultIdentity = _this.identities.currentIdentity;*/

          // returns the identity info from the chosen id
          //          if (_this.identities.currentIdentity) resolve(_this.identities.currentIdentity.assertion);
          if (_this.identities.identities[value.value]) resolve(_this.identities.identities[value.value]);
          else reject('[IdentityModule.selectIdentityFromGUI] identity not found: ', value.value);
        } else if (value.type === 'idp') {

          _this.callGenerateMethods(value.value, origin).then((value) => {
            return resolve(value);
          }, (err) => {
            return reject(err);
          });

        } else {
          return reject('error on GUI received message.');
        }
      }).catch(err => { reject('On selectIdentityFromGUI from method requestIdentityToGUI error:  ' + err); });
    });
  }


  callIdentityModuleFunc(methodName, parameters, domain, resource) {
    log.log('[callIdentityModuleFunc:methodName]', methodName);
    log.log('[callIdentityModuleFunc:parameters]', parameters);
    let _this = this;

    return new Promise((resolve, reject) => {

      if (_this._showAdmin) {
        if (methodName === 'getAccessToken') {
          _this._showAdmin(methodName, parameters.urlreceived, domain, resource).then((result) => {
            resolve(result);
          });
        } else _this._showAdmin(methodName);
      }
      else {
        let message = {
          type: 'execute', to: _this._guiURL, from: _this._idmURL,
          body: { resource: 'identity', method: methodName, params: parameters }
        };

        //post msg with callback but without timout
        let callback = msg => {
          _this._messageBus.removeResponseListener(_this._idmURL, msg.id);
          let result = msg.body.value;
          resolve(result);
        };
        try {

          _this._messageBus.postMessage(message, callback, false);

        } catch (err) {
          reject('In method callIdentityModuleFunc error: ' + err);
        }

      }
    });
  }

  //******************* TOKEN METHODS *******************
  /**
  * get a Token to be added to a message
  * @param  {String}  fromURL     origin of the message
  * @param  {String}  toURL     target of the messageok
  * @return {JSON}    token    token to be added to the message
  */
  getToken(msg) {
    let _this = this;
    let fromURL = msg.from;
    let toUrl = msg.to;
    if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('source')) {
      fromURL = msg.body.source;
    }

    if (msg.type === 'forward') {
      fromURL = msg.body.from;
    }

    if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('subscriber')) {
      fromURL = msg.body.subscriber;
    }

    return new Promise(function (resolve, reject) {
      log.log('[IdentityModule.getToken] for msg ', msg);

      //log.log('toUrl', toUrl);
      _this.registry.isLegacy(toUrl).then(function (result) {
        // log.log('[Identity.IdentityModule.getToken] isLEGACY: ', result);
        if (result) {

          _this._getAccessToken(msg).then((token) => {
            log.log('[IdentityModule.getToken] access token ', token);
            resolve(deepClone(token));
          }).catch(err => { reject('[IdentityModule.getToken] Access Token error ' + err); });
        } else {
          _this._getValidToken(fromURL).then((token) => {
            resolve(token);
          }).catch(err => { reject('On getToken from method _getValidToken error: ' + err); });
        }
      }).catch(err => { reject('On getToken from method isLegacy error: ' + err); });
    });
  }


  /**
  * get an Id Token for a HypertyURL
  * @param  {String}  hypertyURL     the Hyperty address
  * @return {JSON}    token    Id token to be added to the message
  */
  getIdToken(hypertyURL) {
    log.info('getIdToken:hypertyURL ', hypertyURL);
    let _this = this;
    return new Promise(function (resolve, reject) {
      let splitURL = hypertyURL.split('://');
      let userURL;
      if (splitURL[0] !== 'hyperty') { // it is a Data Object URL

        _this._getHypertyFromDataObject(hypertyURL).then((returnedHypertyURL) => {

          userURL = _this.registry.getHypertyOwner(returnedHypertyURL);

          if (userURL) {
            let identity = _this.identities.getIdentity(userURL);
            if (identity) return resolve(identity);
            else return reject('[IdentityModule.getIdToken] Identity not found for: ', userURL);
          } else { return reject('[IdentityModule.getIdToken] User not found for hyperty: ', returnedHypertyURL); }
        }).catch((reason) => {
          log.error('[IdentityModule.getIdToken] Error: ', reason);
          reject(reason);
        });
      } else {
        userURL = _this.registry.getHypertyOwner(hypertyURL);
        if (userURL) {

          let identity = _this.identities.getIdentity(userURL);
          if (identity) return resolve(identity);
          else return reject('[IdentityModule.getIdToken] Identity not found for: ', userURL);

        } else { return reject('[IdentityModule.getIdToken] User not found for hyperty: ', userURL); }
      }
    });
  }

  /**
  * get an Access Token for an external API
  * @param  {String}  url     the external url
  * @return {JSON}    token    Access token to be added to the message
  */
  _getAccessToken(msg) {
    let url = msg.to;

    let _this = this;

    return new Promise((resolve) => {
      if (!msg.hasOwnProperty('body')) {
        return reject('[IdentityModule._getAccessToken] missing mandatory msg body: ', msg);
      }
      if (!msg.body.hasOwnProperty('value')) {
        return reject('[IdentityModule._getAccessToken] missing mandatory msg body value: ', msg);
      }
      if (!msg.body.value.hasOwnProperty('resources')) {
        return reject('[IdentityModule._getAccessToken] missing mandatory msg body value resources: ', msg);
      }
      let domainToCheck = divideURL(url).domain;

      if (url.includes('protostub')) {
        domainToCheck = domainToCheck.replace(domainToCheck.split('.')[0] + '.', '');
      }

      let resources = msg.body.value.resources;

      _this._getAccessTokenForDomain(domainToCheck, resources).then((token) => {
        resolve(token);
      });

    });



  }

  _getAccessTokenForDomain(domainToCheck, resources) {
    let _this = this;
    let token;

    return new Promise((resolve, reject) => {

      try {
        token = _this.identities.getAccessToken(domainToCheck, resources);
      } catch (e) {
        return reject('[IdentityModule._getAccessTokenForDomain] Access Token error ' + err);
      }

      if (!token) {
        _this._getNewAccessToken(domainToCheck, resources).then((token) => {
          log.log('[Identity.IdentityModule._getAccessTokenForDomain] new Access Token ', token);
          return resolve(token);
        }).catch(err => { reject('[IdentityModule._getAccessTokenForDomain] on getNewAccessToken ' + err); });
      } else if (token.status === 'in-progress') {
        return resolve(_this._inProgressAccessToken(domainToCheck, resources));
      } else {
        let timeNow = secondsSinceEpoch();

        log.log('[Identity.IdentityModule._getAccessTokenForDomain] found  Access Token ', token);

        if (timeNow >= token.expires) {
          //        if (true) {
          if (token.hasOwnProperty("refresh")) {
            _this._refreshAccessToken(deepClone(token)).then((newToken) => {
              return resolve(_this.identities.updateAccessToken(newToken));
            });
          } else {
            _this._revokeAccessToken(token, domainToCheck, resources).then(() => {
              setTimeout(() => {
                return _this._getNewAccessToken(domainToCheck, resources);

              }, 1000);

            });

          } 

        } else return resolve(deepClone(token));
      }

    });
  }


  _revokeAccessToken(token, domain, resources) {

    let _this = this;

    //    let domain = _this._resolveDomain(oldIdentity.idp);
    //    let message;
    //    let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

    log.log('[IdentityModule._revokeAccessToken] to be revoked ', token);

    return new Promise((resolve, reject) => {

//      let domain = _this._resolveDomain(token.domain);
      let message;

      message = {
        type: 'execute',
        to: _this._resolveDomain(token.domain),
        from: _this._idmURL,
        body: {
          method: 'revokeAccessToken',
          params: { token: token }
        }
      };

      log.log('[IdentityModule._revokeAccessToken] revoke msg ', message);

      try {
        _this._messageBus.postMessage(message, (res) => {

          let result = res.body.value;
          if (result) _this._identities.removeAccessToken(domain, resources).then(()=>{
            resolve(result);

          });
          resolve();
        });
      } catch (err) {
        reject('In IdentityModule._revokeAccessToken on postMessage error: ' + err);
      }

    });




  }


  _inProgressAccessToken(domain, resources) {
    this.identities.watchingYou.observe('accessTokens', (change) => {

      log.log('[IdentityModule._inProgressAccessToken] accessTokens changed ' + this.identities.accessTokens);

      let keypath = change.keypath;

      if (keypath.includes('status')) {
        keypath = keypath.replace('.status', '');
      }

      if (keypath === domain && change.name === 'status' && change.newValue === 'created') {
        // log.log('[Identity.IdentityModule.getToken] token is created ' + _this.identitiesList[domain]);
        return (this.identities.getAccessToken(domain, resources));
      }
    });

  }


  _getNewAccessToken(domain, resources) {
    let _this = this;

    return new Promise(function (resolve, reject) {

      _this.identities.setAccessTokenInProgress(domain);

      let message = {
        type: 'execute',
        to: _this._resolveDomain(domain),
        from: _this._idmURL,
        body: {
          method: 'getAccessTokenAuthorisationEndpoint',
          params: resources
        }
      };

      //let's first get the authorisation URL from the Idp Proxy
      _this._messageBus.postMessage(message, (res) => {
        if (res.body.code > 299) {
          return reject('[IdentityModule._getNewAccessToken] Error on getAccessTokenAuthorisationEndpoint from IdP Proxy: ', res.body.desc);
        }

        // let's ask the user for authorisation
        _this.callIdentityModuleFunc('getAccessToken', { urlreceived: res.body.value }, domain, resources[0]).then((authorisation) => {
          log.log('[IdentityModule:callIdentityModuleFunc:openPopup] auhtorisation result: ', authorisation);

          message.body.method = 'getAccessToken';
          message.body.params = {
            resources: resources,
            login: authorisation
          };

          //wihtout callback to avoid timeout errors?

          // let's ask Access Token from the Idp Proxy
          _this._messageBus.postMessage(message, (res) => {
            if (res.body.code > 299) return reject('[IdentityModule._getNewAccessToken] Error on getAccessToken from IdP Proxy: ', res.body.desc);

            _this.identities.addAccessToken(res.body.value).then((token) => {
              log.info('[IdentityModule._getNewAccessToken] resolving token: ', token);
              return resolve(res.body.value);

            }, (err) => {
              reject(err);
            });
          });
        }, (err) => {
          reject(err);
        });

      });

    });
  }


  _refreshAccessToken(outdatedToken) {
    let _this = this;

    //    let domain = _this._resolveDomain(oldIdentity.idp);
    //    let message;
    //    let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

    log.log('IdentityModule._refreshAccessToken:outdatedToken', outdatedToken);

    return new Promise((resolve, reject) => {

      let domain = _this._resolveDomain(outdatedToken.domain);
      let message;

      message = { type: 'execute', to: domain, from: _this._idmURL, body: { method: 'refreshAccessToken', params: { token: outdatedToken } } };
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In IdentityModule._refreshAccessToken on postMessage error: ' + err);
      }

    });

  }

  sendRefreshMessage(oldIdentity) {
    let _this = this;

    //    let domain = _this._resolveDomain(oldIdentity.idp);
    //    let message;
    //    let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

    log.log('sendRefreshMessage:oldIdentity', oldIdentity);

    return new Promise((resolve, reject) => {
      let domain = _this._resolveDomain(oldIdentity.idp.domain);
      let message;
      let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

      log.info('sendRefreshMessage:oldIdentity', oldIdentity);

      message = { type: 'execute', to: domain, from: _this._idmURL, body: { resource: 'identity', method: 'refreshAssertion', params: { identity: assertion } } };
      try {
        _this._messageBus.postMessage(message, (res) => {
          if (res.body.code < 300) {
            let result = res.body.value;
            resolve(result);
          } else resolve(oldIdentity);
        });
      } catch (err) {
        reject('In sendRefreshMessage on postMessage error: ' + err);
      }

    });

  }

  getAccessToken(idpDomain, resources, login) {
    log.log('[getAccessToken:idpDomain]', idpDomain);
    let _this = this;

    return new Promise((resolve, reject) => {

      let domain = _this._resolveDomain(idpDomain);
      let message;

      message = {
        type: 'execute', to: domain, from: _this._idmURL, body: { resource: 'identity', method: 'getAccessToken', params: { resources: resources, login: login } }
      };
      try {
        _this._messageBus.postMessage(message, (res) => {

          if (res.body.code < 299) {
            let result = res.body.value;
            resolve(result);
          } else resolve(res.body);
        });
      } catch (err) {
        reject('IdentityModule.In getAccessToken: ' + err);
      }
    });
  }

  getAccessTokenAuthorisationEndpoint(scope, idpDomain) {
    log.log('[getAccessTokenAuthorisationEndpoint:idpDomain]', idpDomain);
    let _this = this;

    return new Promise((resolve, reject) => {

      let domain = _this._resolveDomain(idpDomain);
      let message;

      message = {
        type: 'execute', to: domain, from: _this._idmURL, body: { resource: 'identity', method: 'getAccessTokenAuthorisationEndpoint', params: { resources: scope } }
      };
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In getAccessTokenAuthorisationEndpoint: ' + err);
      }
    });
  }

  sendGenerateMessage(contents, origin, usernameHint, idpDomain) {
    log.log('[sendGenerateMessage:contents]', contents);
    log.log('[sendGenerateMessage:origin]', origin);
    log.log('[sendGenerateMessage:usernameHint]', usernameHint);
    log.log('[sendGenerateMessage:idpDomain]', idpDomain);
    log.log('sendGenerateMessage_hint');
    let _this = this;

    return new Promise((resolve, reject) => {

      let domain = _this._resolveDomain(idpDomain);
      let message;

      message = {
        type: 'execute', to: domain, from: _this._idmURL, body: { resource: 'identity', method: 'generateAssertion', params: { contents: contents, origin: origin, usernameHint: usernameHint } }
      };
      try {
        _this._messageBus.postMessage(message, (res) => {

          if (res.body.code < 300) resolve(res.body.value);
          else reject(res.body);
        });
      } catch (err) {
        reject('In sendGenerateMessage: ' + err);
      }
    });
  }

  /**
  * Requests the IdpProxy from a given Domain for an identityAssertion
  *
  * @param  {DOMString} contents     contents
  * @param  {DOMString} origin       origin
  * @param  {DOMString} usernameHint usernameHint
  * @param  {JSON}      keyPair       user keyPair
  * @return {IdAssertion}              IdAssertion
  */
  generateAssertion(contents, origin, usernameHint, idpDomain) {
    log.log('[generateAssertion:contents]', contents);
    log.log('[generateAssertion:origin]', origin);
    log.log('[generateAssertion:usernameHint]', usernameHint);

    //    log.log('[generateAssertion:keyPair]', keyPair);
    log.log('[generateAssertion:idpDomain]', idpDomain);
    let _this = this;

    return new Promise(function (resolve, reject) {
      log.log('[IdentityModule:sendGenerateMessage:sendGenerateMessage]', usernameHint);
      _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((result) => {

        if (result) {

          _this.identities.addAssertion(result).then((value) => {
            resolve(result);
          }, (err) => {
            reject(err);
          });

        } else {
          reject('error on obtaining identity information');
        }

      }, (error) => {
        if (error.hasOwnProperty('description') && error.description.hasOwnProperty('loginUrl')) {
          _this.callIdentityModuleFunc('login', { urlreceived: error.description.loginUrl }).then((value) => {
            log.log('[IdentityModule:callIdentityModuleFunc:openPopup]', usernameHint);

            resolve(value);
          }, (err) => {
            reject(err);
          });
        } else {
          log.error('[IdentityModule:sendGenerateMessage] generate assertion with hint error ', error);
          reject(error);
        }
      }).catch(err => { reject('On generateAssertion from method sendGenerateMessage error: ' + err); });
    });
  }

  /**
  * Requests the IdpProxy from a given Domain to validate an IdentityAssertion
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @param  {DOMString} origin       origin
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion, origin, idpDomain) {
    log.log('[validateAssertion:assertion]', assertion);
    log.log('[validateAssertion:origin]', origin);
    log.log('[validateAssertion:idpDomain]', idpDomain);
    let _this = this;

    let domain = _this._resolveDomain(idpDomain);

    let message = {
      type: 'execute', to: domain, from: _this._idmURL, body: {
        resource: 'identity', method: 'validateAssertion',
        params: { assertion: assertion, origin: origin }
      }
    };

    return new Promise(function (resolve, reject) {
      try {
        _this._messageBus.postMessage(message, (result) => {
          if (result.body.code === 200) {
            resolve(result.body.value);
          } else {
            reject('error', result.body.code);
          }
        });
      } catch (err) {
        reject('On validateAssertion from method postMessage error: ' + err);
      }
    });
  }

  addGUIListeners() {
    let _this = this;

    _this._messageBus.addListener(_this._idmURL, (msg) => {
      let funcName = msg.body.method;

      log.log('[IdentityModule:addGUIListeners]', msg, msg.body, funcName);

      let returnedValue;

      if (funcName === 'deployGUI') {
        returnedValue = _this.deployGUI();
      } else if (funcName === 'getIdentitiesToChoose') {
        _this.getIdentitiesToChoose().then((result) => {
          // if the function requested is not a promise
          let value = { type: 'execute', value: result, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
          }
        });
        return;

      } else if (funcName === 'unregisterIdentity') {
        let email = msg.body.params.email;
        returnedValue = _this.unregisterIdentity(email);
      } else if (funcName === 'getMyPublicKey') {
        // because generateRSAKeyPair is a promise
        // we have to send the message only after getting the key pair
        _this._crypto.getMyPublicKey().then((pubKey) => {
          pubKey = stringify(pubKey);
          let value = { type: 'execute', value: pubKey, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if generateRSAKeyPair method postMessage error: ' + err);
          }
        });
        return;
      } else if (funcName === 'sendGenerateMessage') {
        let contents = msg.body.params.contents;
        let origin = msg.body.params.origin;
        let usernameHint = msg.body.params.usernameHint;
        let idpDomain = msg.body.params.idpDomain;
        let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to };
        _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          replyMsg.body = value;
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('IdentityModule.addGUIListeners sendGenerateMessage error: ' + err);
          }

        }, (err) => {
          log.info('IDPProxy generateAssertion reply error ' + err);
          replyMsg.body = err;
          _this._messageBus.postMessage(replyMsg);

        });
        return;
      } else if (funcName === 'getAccessTokenAuthorisationEndpoint') {
        let scope = msg.body.params.scope;
        let idpDomain = msg.body.params.idpDomain;
        _this.getAccessTokenAuthorisationEndpoint(scope, idpDomain).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if sendGenerateMessage method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'addAccessToken') {
        let accessToken = msg.body.params;

        _this.identities.addAccessToken(accessToken).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'getAccessToken') {

        let domain = msg.body.params.idpDomain;
        let resources = msg.body.params.resources;
        let login = msg.body.params.login;
        let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to };

        _this.getAccessToken(domain, resources, login).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          replyMsg.body = value;
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if sendGenerateMessage method postMessage error: ' + err);
          }

        }, (error) => {
          try {
            replyMsg.body = error;
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if sendGenerateMessage method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'addAssertion') {
        let result = msg.body.params;

        //        let keyPair = msg.body.params.keyPair;
        _this.identities.addAssertion(result).then((returnedValue) => {
          let value = { type: 'execute', value: returnedValue, code: 200 };
          let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'refreshAccessToken') {
        let domain = msg.body.params.domain;
        let resources = msg.body.params.resources;

        _this._getAccessTokenForDomain(domain, resources).then((token) => {
          let replyMsg = {
            id: msg.id,
            type: 'response',
            to: msg.from,
            from: msg.to,
            body: {
              value: token.accessToken,
              code: 200
            }
          };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners for refreshAccessToken request: ' + err);
          }

        });
        return;
      } else if (funcName === 'unauthorise') {
        let domain = msg.body.params.domain;
        let resources = msg.body.params.resources;

        try {
          _this._revokeAccessToken(_this.identities.getAccessToken(domain, resources), domain, resources);
        } catch (e) {
          return reject('[IdentityModule.addGUIListeners] unauthorise error ' + err);
        }

          let replyMsg = {
            id: msg.id,
            type: 'response',
            to: msg.from,
            from: msg.to,
            body: {
              value: true,
              code: 200
            }
          };
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners for refreshAccessToken request: ' + err);
          }

        return;
      }/*else if (funcName === 'selectIdentityForHyperty') {
        let origin = msg.body.params.origin;
        let idp = msg.body.params.idp;
        let idHint = msg.body.params.idHint;
        _this.selectIdentityForHyperty(origin, idp, idHint);
        return;
      }*/

      // if the function requested is not a promise
      let value = { type: 'execute', value: returnedValue, code: 200 };
      let replyMsg = { id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value };
      try {
        _this._messageBus.postMessage(replyMsg);
      } catch (err) {
        log.error('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
      }

    });
  }

  deployGUI() {
    let _this = this;
    _this.guiDeployed = true;
  }

  //******************* PRIVATE METHODS *******************
  /**
   * GetValidToken is for non legacy hyperties and verifies if the Token is still valid
   * if the token is invalid it requests a new token
   * @param  {String} hypertyURL hypertyURL
   * @return {Promise}
   */
  _getValidToken(hypertyURL) {
    log.log('[IdentityModule._getValidToken]:hypertyURL', hypertyURL);
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.getIdToken(hypertyURL).then(function (assertion) {
        log.log('[IdentityModule._getValidToken] retrieved IdAssertion', assertion);
        let timeNow = secondsSinceEpoch();

        if (!assertion.hasOwnProperty('expires')) return resolve(assertion);

        let expirationDate = assertion.expires;

        /* if (completeId.hasOwnProperty('info')) {
          if (completeId.info.hasOwnProperty('expires')) {
            expirationDate = completeId.info.expires;
          } else if (completeId.info.hasOwnProperty('tokenIDJSON')) {
            expirationDate = completeId.info.tokenIDJSON.exp;
          } else {
            // throw 'The ID Token does not have an expiration time';
            log.info('The ID Token does not have an expiration time');
            resolve(assertion);
          }
        } else if (completeId.hasOwnProperty('infoToken') && completeId.infoToken.hasOwnProperty('exp')) {
          expirationDate = completeId.infoToken.exp;
        } else {
          // throw 'The ID Token does not have an expiration time';
          log.info('The ID Token does not have an expiration time');
          resolve(assertion);
        }*/

        log.log('[Identity.IdentityModule.getValidToken] Token expires in', expirationDate);
        log.log('[Identity.IdentityModule.getValidToken] time now:', timeNow);

        if (timeNow >= expirationDate) {
          //        if (timeNow >= 0) {
          if (assertion.hasOwnProperty('refresh')) {
            log.log('[Identity.IdentityModule.getValidToken] refreshing assertion: ', assertion);

            _this.sendRefreshMessage(assertion).then((newAssertion) => {
              log.log('[Identity.IdentityModule.getValidToken] refreshed assertion: ', newAssertion);
              _this.identities.updateAssertion(newAssertion).then(() => {
                resolve(newAssertion);
              }, (err) => {
                log.error('[IdentityModule.getValidToken] error updating the assertion ', err);
                reject(err);
              });
            }, (err) => {
              log.error('[IdentityModule.getValidToken] error refreshing the assertion ', err);
              reject(err);
            });
          } else { // no refresh token available, user has to authenticate again to get a new assertion
            // generate new idToken
            _this.callGenerateMethods(assertion.idp.domain).then((value) => {
              resolve(value);
            }).catch(err => { reject('[IdentityModule.getValidToken] error when generating a new assertion ' + err); });
          }
        } else {
          resolve(assertion);
        }
      }).catch(function (error) {
        log.error('[IdentityModule.getValidToken] error on getIdToken', error);
        reject(error);
      });
    });
  }

  /**
  * returns the reporter associated to the dataObject URL
  * @param   {String}   dataObjectURL         dataObject url
  * @return   {String}  reporter              dataObject url reporter
  */
  _getHypertyFromDataObject(dataObjectURL) {
    log.info('_getHypertyFromDataObject:dataObjectURL', dataObjectURL);
    let _this = this;

    return new Promise(function (resolve, reject) {

      let splitedURL = divideURL(dataObjectURL);
      let domain = splitedURL.domain;
      let finalURL = parseMessageURL(dataObjectURL);

      // check if is the creator of the hyperty
      let reporterURL = _this.registry.getReporterURLSynchonous(finalURL);
      log.info('_getHypertyFromDataObject:reporterURL', reporterURL);

      if (reporterURL) {
        resolve(reporterURL);
      } else {
        // check if there is already an association from an hypertyURL to the dataObject
        let storedReporterURL = _this.dataObjectsIdentity[finalURL];
        log.info('_getHypertyFromDataObject:storedReporterURL', storedReporterURL);

        if (storedReporterURL) {
          resolve(storedReporterURL);
        } else {
          // check if there is any hyperty that subscribed the dataObjectURL
          let subscriberHyperty = _this.registry.getDataObjectSubscriberHyperty(dataObjectURL);
          log.info('_getHypertyFromDataObject:subscriberHyperty', subscriberHyperty);

          if (subscriberHyperty) {
            resolve(subscriberHyperty);
          } else {
            // search in domain registry for the hyperty associated to the dataObject
            // search in case is a subscriber who wants to know the reporter
            // To be reviewed in order to avoid the discovery transaction
            _this._coreDiscovery.discoverDataObjectPerURL(finalURL, domain).then(dataObject => {
              log.info('_getHypertyFromDataObject:dataObject', dataObject);
              _this.dataObjectsIdentity[finalURL] = dataObject.reporter;
              log.info('_getHypertyFromDataObject:dataObject.reporter', dataObject.reporter);
              resolve(dataObject.reporter);
            }, err => {
              reject(err);
            });
          }
        }
      }
    });
  }

  /**
  * Function that resolve and create the domainURL in case it is provided one. If not, resolve the default domainURL
  * @param {String}     idpDomain     idpDomain (Optional)
  */
  _resolveDomain(idpDomain) {
    if (!idpDomain) {
      return 'domain-idp://google.com';
    } else {
      return 'domain-idp://' + idpDomain;
    }
  }

  /*
    _secondsSinceEpoch() {
      return Math.floor(Date.now() / 1000);
    }*/
}


export default IdentityModule;
