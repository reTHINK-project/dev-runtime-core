// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import {secondsSinceEpoch, divideURL, getUserEmailFromURL, getUserIdentityDomain, parseMessageURL, stringify, decode } from '../utils/utils.js';
import Identities from './Identities';
import Crypto from '../cryptoManager/Crypto';
import GuiFake from './GuiFake';
import { WatchingYou } from 'service-framework/dist/Utils';

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
//    _this.storageManager = storageManager;
    _this.dataObjectsStorage = dataObjectsStorage;
    _this._idmURL = _this._runtimeURL + '/idm';
    _this._guiURL = _this._runtimeURL + '/identity-gui';
    _this.runtimeCapabilities = runtimeCapabilities;

    _this._domain = divideURL(_this._runtimeURL).domain;

    _this.watchingYou = new WatchingYou();

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this._identities = new Identities('human', storageManager);
    // to be reviewed: watchingYou identitiesList or identities?
    _this.identitiesList =  _this.watchingYou.watch('identitiesList', {}, true);
    _this._crypto = cryptoManager;

    /*    _this.emailsList = [];
    let newIdentity = new Identity('guid', 'HUMAN');
    _this.identity = newIdentity;
    _this.currentIdentity;
    _this.identities.defaultIdentity;*/

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {}; // is this needed?


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
    let _this = this;

    for (let index in _this.identities) {

      let identity = _this.identities[index];

      if (identity.identity === userURL) {
        return identity;
      }
    }

    throw 'identity not found';
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
    let idps = [
      { domain: 'google.com', type: 'idToken'},
      { domain: 'microsoft.com', type: 'idToken'},
      { domain: 'facebook.com', type: 'idToken'},
      { domain: 'slack.com', type: 'Legacy'}
    ];

    return {identities: this.identities.identifiers, idps: idps};
  }

  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
/*  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
  }*/

  init() {
    let _this = this;
    return new Promise((resolve) => {
      _this._identities.loadIdentities().then(() => {
        _this._crypto.getMyPublicKey().then((key) => {
          let guid = 'user-guid://' + JSON.stringify(key,);
          _this.identities.guid = guid;
          resolve();
        });

      });

    });

  }
/*
  loadIdentities() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('idModule:identities').then((identities) => {

        if (identities) {
          _this.identities = identities;

          identities.forEach((identity) => {
            let timeNow = _this._secondsSinceEpoch();
            let expires = 0;

            if (identity.info && identity.info.expires) {
              expires = identity.info.expires;
            }  else if (identity.info && identity.info.tokenIDJSON && identity.info.tokenIDJSON.exp) {
              expires = identity.info.tokenIDJSON.exp;
            }

            if (!identity.hasOwnProperty('interworking') && !identity.interworking) {
              _this.identities.identities.defaultIdentity = identity.messageInfo;

              if (parseInt(expires) > timeNow) {
                _this.identities.defaultIdentity.expires = parseInt(expires);
                _this.currentIdentity = _this.identities.defaultIdentity;
              }

            }

          });
        }
        resolve();
      });
    });
  }*/

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identityBundle) {
    log.log('[IdentityModule.getIdentityAssertion:identityBundle]', identityBundle);
    let _this = this;

    return new Promise(function(resolve, reject) {

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

          _this.selectIdentityForHyperty(origin, idp, idHint).then((assertion) => {
            log.log('[IdentityModule] Identity selected by hyperty.');
            return resolve(assertion);
          }, (err) => { // if it got an error then just select identity from GUI
            // log.error('[IdentityModule] Could not select identity from hyperty.');
            _this.selectIdentityFromGUI().then((newAssertion) => {
              log.log('[IdentityModule] Identity selected by hyperty.');
              return resolve(newAssertion);
            }, (err) => {
              return reject(err);
            });
          });
        } else {

          if (_this.identities.defaultIdentity && _this.identities.defaultIdentity.assertion.expires > secondsSinceEpoch()) {
            return resolve(_this.identities.defaultIdentity.assertion);
          } else {
            _this.selectIdentityFromGUI().then((assertion) => {

              log.log('[IdentityModule] Identity selected from GUI.');

/*
                _this.identities.defaultIdentity = assertion.userProfile.userURL;
                return resolve(assertion);
              }*/

              _this.identities.defaultIdentity = assertion.userProfile.userURL;
              return resolve(assertion);
            }, (err) => {
              return reject(err);
            });
          }
        }
      }).catch(error => {
        log.error('Error on identity acquisition ', error);
        return reject(error);
      });

      _this.runtimeCapabilities.isAvailable('node').then((result) => {
        log.log('node identity acquisition', result);

        if (!result) return;

        if (_this.identities.currentIdentity ) {
          //TODO verify whether the token is still valid or not.
          // should be needed to make further requests, to obtain a valid token
          return resolve(_this.identities.currentIdentity);
        } else {
          log.log('getIdentityAssertion for nodejs');

          let idp = {type: 'idp', value: 'nodejs-idp', code: 200, auth: false};
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
  * Function to remove an identity from the Identities array
  * @param {String}    userURL      userURL
  */
  deleteIdentity(userURL) {
    let _this = this;

    //let userURL = convertToUserURL(userID);

    for (let identity in _this.identities) {
      if (_this.identities[identity].identity === userURL) {
        _this.identities.splice(identity, 1);
      }
    }
  }

  /**
  * Function to unregister an identity from the emailsList array and not show in to the GUI
  * @param {String}    email      email
  */
  unregisterIdentity(email) {
    let _this = this;

    for (let e in _this.emailsList) {
      if (_this.emailsList[e] === email) {
        _this.emailsList.splice(e, 1);
      }
    }
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
    return new Promise(function(resolve, reject) {

      //condition to check if the real GUI is deployed. If not, deploys a fake gui
      if (_this.guiDeployed === false) {
        let guiFakeURL = _this._guiURL;
        let guiFake = new GuiFake(guiFakeURL, _this._messageBus);
        _this.guiFake = guiFake;
        _this.guiDeployed = true;
      }

      let message = {type: 'create', to: _this._guiURL, from: _this._idmURL,
        body: {value: {identities: identities, idps: idps}}};

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
      let userkeyPair;

      //let keyPair = nodeJSKeyPairPopulate;

      //generates the RSA key pair
      _this._crypto.getMyPublicKey().then(function(key) {

      log.log('[callNodeJsGenerateMethods:key]', key);

      publicKey = stringify(key);

      log.log('[callNodeJsGenerateMethods] NO_URL');

      return _this.generateAssertion(publicKey, origin, 'url', idp);

    }).then(function(value) {
      if (value) {
        resolve(value);
      } else {
        reject('Error on obtaining Identity');
      }
    }).catch(function(err) {
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
      let userkeyPair;

      //generates the RSA key pair
      _this._crypto.getMyPublicKey().then(function(key) {

        log.log('[callNodeJsGenerateMethods:key]', key);

        publicKey = stringify(key);
//        userkeyPair = keyPair;
        log.log('generateAssertion:no_hint');
        return _this.generateAssertion(publicKey, origin, '', idp);

      }).then(function(url) {
        _this.myHint = url;
        log.log('generateAssertion:hint');
        return _this.generateAssertion(publicKey, origin, url, idp);

      }).then(function(value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
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
      _this.callIdentityModuleFunc('openPopup', {urlreceived: loginUrl}).then((idCode) => {
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
      _this._crypto.getMyPublicKey().then(function(key) {
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
      let identitiesInfo = _this.getIdentitiesToChoose();

      _this.requestIdentityToGUI(identitiesInfo.identities, identitiesInfo.idps).then(value => {

        if (value.type === 'identity') {

        //  let chosenID = getUserURLFromEmail(value.value);
        // hack while the user url is not returned from requestIdentityToGUI;

/*          let chosenID = 'user://' + _this.identities.currentIdentity.idp.domain + '/' + value.value;

          _this.identities.defaultIdentity = _this.identities.currentIdentity;*/

          // returns the identity info from the chosen id
          if (_this.identities.currentIdentity) resolve(_this.identities.currentIdentity.assertion);
          else reject('[IdentityModule.selectIdentityFromGUI] No identity selected');
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

  //TODO: remove
/*
  storeIdentity(result, keyPair) {
    log.log('[storeIdentity:result]', result);
    log.log('[storeIdentity:keyPair]', keyPair);
    let _this = this;

    return new Promise((resolve, reject) => {

      if (!result.hasOwnProperty('assertion')) {
        return reject('StoreIdentity: input is not an identity assertion.');
      }

      let splitedAssertion = result.assertion.split('.');
      let assertionParsed;

      //verify if the token contains the 3 components, or just the assertion
      try {
        if (splitedAssertion[1]) {
          assertionParsed = decode(splitedAssertion[1]);
        } else {
          assertionParsed = decode(result.assertion);
        }
      } catch (err) {
        return reject('In storeIdentity, error parsing assertion: ' + err);
      }

      let idToken;

      //TODO remove the verification and remove the tokenIDJSON from the google idpProxy;
      if (assertionParsed.tokenIDJSON) {
        idToken = assertionParsed.tokenIDJSON;
      } else {
        idToken = assertionParsed;
      }

      idToken.idp = result.idp;

      let email = idToken.email || idToken.sub;

      // let identifier = getUserURLFromEmail(email);

      let identifier = 'user://' + idToken.idp.domain + '/' + email;

      result.identity = identifier;

      _this.identity.addAssertion(result);

      // check if exists any infoToken in the result received
      let infoToken = (result.infoToken) ? result.infoToken : {};

      let commonName = idToken.name || email.substring(0, email.indexOf('@'));
      let userProfileBundle = {username: email, cn: commonName, avatar: infoToken.picture, locale: infoToken.locale, userURL: identifier};

      let expires = undefined;
      if (infoToken.hasOwnProperty('exp')) {
        expires = infoToken.exp;
      } else if (result.hasOwnProperty('info') && result.info.hasOwnProperty('expires')) {
        expires = result.info.expires;
      }

      //creation of a new JSON with the identity to send via messages
      let newIdentity = {userProfile: userProfileBundle, idp: result.idp.domain, assertion: result.assertion, expires: expires};
      result.messageInfo = newIdentity;
      result.keyPair = keyPair;

      _this.currentIdentity = newIdentity;

      //verify if the id already exists. If already exists then do not add to the identities list;
      //to be reviewed since the identity contains data like the asssrtion and ley pairs that may be different if generated twice

      let idAlreadyExists = false;
      let oldId;
      for (let identity in _this.identities) {
        if (_this.identities[identity].identity === result.identity) {
          idAlreadyExists = true;
          oldId = _this.identities[identity];
        }
      }

      if (idAlreadyExists) { // TODO: maybe overwrite the identity

        oldId = Object.assign(oldId, result);
        resolve(oldId.messageInfo);
        let exists = false;

        //check if the identity exists in emailList, if not add it
        //This is useful if an identity was previously registered but was later unregistered
        for (let i in _this.emailsList) {
          if (_this.emailsList[i] === email) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          _this.emailsList.push(email);
        }

      } else {
        _this.emailsList.push(email);
        _this.identities.push(result);
      }

      _this.storageManager.set('idModule:identities', 0, _this.identities).then(() => {

        if (_this.identitiesList[idToken.idp.domain]) {
          _this.identitiesList[idToken.idp.domain].status = 'created';
        }
        log.log('storeIdentity:newID', newIdentity);
        resolve(newIdentity);
      }).catch(err => {
        reject('On _sendReporterSessionKey from method storeIdentity error: ' + err);
      });

    });
  }*/



  callIdentityModuleFunc(methodName, parameters) {
    log.log('[callIdentityModuleFunc:methodName]', methodName);
    log.log('[callIdentityModuleFunc:parameters]', parameters);
    let _this = this;

    return new Promise((resolve, reject) => {
      let message = { type: 'execute', to: _this._guiURL, from: _this._idmURL,
        body: { resource: 'identity', method: methodName, params: parameters } };

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
    });
  }

  //******************* TOKEN METHODS *******************
  /**
  * get a Token to be added to a message
  * @param  {String}  fromURL     origin of the message
  * @param  {String}  toURL     target of the message
  * @return {JSON}    token    token to be added to the message
  */
  getToken(fromURL, toUrl) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      log.log('[IdentityModule.getToken] from->', fromURL, '  to->', toUrl);

      if (toUrl) {
        //log.log('toUrl', toUrl);
        _this.registry.isLegacy(toUrl).then(function(result) {
          // log.log('[Identity.IdentityModule.getToken] isLEGACY: ', result);
          if (result) {

            // TODO: check if in the future other legacy hyperties have expiration times
            // if so the check should be made here (or in the getAccessToken function)
            let token = _this.getAccessToken(toUrl);
            if (token)              { return resolve(token); }

            let domain = getUserIdentityDomain(toUrl);

            // check if process to get token has already started
            if (_this.identitiesList[domain] && _this.identitiesList[domain].status === 'in-progress') {
              // The process to get the token has already started, let's wait by watching its status

              _this.watchingYou.observe('identitiesList', (change) => {

                // log.log('[Identity.IdentityModule.getToken]  identitiesList changed ' + _this.identitiesList);

                let keypath = change.keypath;

                if (keypath.includes('status')) {
                  keypath = keypath.replace('.status', '');
                }

                if (keypath === domain && change.name === 'status' && change.newValue === 'created') {
                  // log.log('[Identity.IdentityModule.getToken] token is created ' + _this.identitiesList[domain]);
                  return resolve(_this.getAccessToken(toUrl));
                }
              });
            } else { //Token does not exist and the process to get has not started yet

              _this.identitiesList[domain] = {
                status: 'in-progress'
              };

              // log.log('[Identity.IdentityModule.getToken] for-> ', domain);
              _this.callGenerateMethods(domain).then((value) => {
                // log.log('[Identity.IdentityModule.getToken] CallGeneratemethods', value);
                let token = _this.getAccessToken(toUrl);
                if (token) {
                  return resolve(token);
                } else {
                  return reject('No Access token found');
                }
              }, (err) => {
                log.error('[Identity.IdentityModule.getToken] error CallGeneratemethods');
                return reject(err);
              });
            }

          } else {
            _this._getValidToken(fromURL).then((identity) => {
              resolve(identity);
            }).catch(err => { reject('On getToken from method _getValidToken error: ' + err); });
          }
        }).catch(err => { reject('On getToken from method isLegacy error: ' + err); });
      } else {
        _this._getValidToken(fromURL).then((identity) => {
          resolve(identity);
        });
      }
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
    return new Promise(function(resolve, reject) {
      let splitURL = hypertyURL.split('://');
      let userURL;
      if (splitURL[0] !== 'hyperty') {// it is a Data Object URL

        _this._getHypertyFromDataObject(hypertyURL).then((returnedHypertyURL) => {

          userURL = _this.registry.getHypertyOwner(returnedHypertyURL);

          if (userURL) {
            let identity = _this.identities.getIdentity(userURL);
            if (identity) return resolve(identity.assertion);
            else return reject('[IdentityModule.getIdToken] Identity not found for: ', userUrl);
          } else return reject('[IdentityModule.getIdToken] User not found for hyperty: ', returnedHypertyURL);
        }).catch((reason) => {
          log.error('[IdentityModule.getIdToken] Error: ', reason);
          reject(reason);
        });
      } else {
        userURL = _this.registry.getHypertyOwner(hypertyURL);
        if (userURL) {

          let identity = _this.identities.getIdentity(userURL);
          if (identity) return resolve(identity.assertion);
          else return reject('[IdentityModule.getIdToken] Identity not found for: ', userUrl);

      } else return reject('[IdentityModule.getIdToken] User not found for hyperty: ', userUrl);
      }
    });
  }

  /**
  * get an Access Token for a legacyURL
  * @param  {String}  legacyURL     the legacy address
  * @return {JSON}    token    Access token to be added to the message
  */
  getAccessToken(url) {
    let _this = this;

    /*  let urlSplit = url.split('.');
    let length = urlSplit.length;*/

    let domainToCheck = divideURL(url).domain;

    if (url.includes('protostub')) {
      domainToCheck = domainToCheck.replace(domainToCheck.split('.')[0] + '.', '');
    }

    let identityToReturn;
    let expirationDate = undefined;
    let timeNow = secondsSinceEpoch();
    for (let index in _this.identities) {
      let identity = _this.identities[index];
      if (identity.hasOwnProperty('interworking') && identity.interworking.domain === domainToCheck) {
        // check if there is expiration time
        if (identity.hasOwnProperty('info') && identity.info.hasOwnProperty('expires')) {
          expirationDate = identity.info.expires;
          log.log('[Identity.IdentityModule.getAccessToken] Token expires in', expirationDate);
          log.log('[Identity.IdentityModule.getAccessToken] time now:', timeNow);

          // TODO: this should not be verified in this way
          // we should contact the IDP to verify this instead of using the local clock
          // but this works for now...
          if (timeNow >= expirationDate) {
            // delete current identity
            //_this.deleteIdentity(identity.identity);
            return null; // the getToken function then generates a new token
          }
        } // else this access token has no expiration time

        if (identity.hasOwnProperty('messageInfo') && identity.messageInfo.hasOwnProperty('userProfile') && identity.messageInfo.userProfile) {
          identityToReturn = { userProfile: identity.messageInfo.userProfile, access_token: identity.interworking.access_token };
          if (identity.hasOwnProperty('infoToken') && identity.infoToken.hasOwnProperty('id')) {
            identityToReturn.userProfile.id = identity.infoToken.id;
          }
        }
        return identityToReturn;
      }
    }

    return null;
  }


  //******************* OTHER METHODS *******************

/*  loadSessionKeys() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        if (sessionKeys) {
          //TODO: Check if this is needed and if it is, how can the key be recovered (the keyURL is stored were?)
          //sessionKeys.sessionKey = new Uint8Array(JSON.parse('[' + sessionKeys.sessionKey + ']'));
          _this.dataObjectSessionKeys = sessionKeys;
        } else {
          _this.dataObjectSessionKeys = {};
        }
        resolve();
      });
    });
  }*/


  sendRefreshMessage(oldIdentity) {
    let _this = this;
    let domain = _this._resolveDomain(oldIdentity.idp);
    let message;
    let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

    log.log('sendRefreshMessage:oldIdentity', oldIdentity);

    return new Promise((resolve, reject) => {
      let domain = _this._resolveDomain(oldIdentity.idp);
      let message;
      let assertion = _this.getIdentity(oldIdentity.userProfile.userURL);

      log.info('sendRefreshMessage:oldIdentity', oldIdentity);

      message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'refreshAssertion', params: {identity: assertion}}};
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In sendRefreshMessage on postMessage error: ' + err);
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

      message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'generateAssertion', params: {contents: contents, origin: origin, usernameHint: usernameHint}}};
      try {
        _this._messageBus.postMessage(message, (res) => {
          let result = res.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In sendRefreshMessage on postMessage error: ' + err);
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

    return new Promise(function(resolve, reject) {
      log.log('[IdentityModule:sendGenerateMessage:sendGenerateMessage]', usernameHint);
      _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((result) => {

        if (result.loginUrl) {

          _this.callIdentityModuleFunc('openPopup', {urlreceived: result.loginUrl}).then((value) => {
            log.log('[IdentityModule:callIdentityModuleFunc:openPopup]', usernameHint);

            resolve(value);
          }, (err) => {
            reject(err);
          });
        } else if (result) {

          _this.identities.addAssertion(result).then((value) => {
            resolve(result);
          }, (err) => {
            reject(err);
          });

        } else {
          reject('error on obtaining identity information');
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

    let message = {type: 'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'validateAssertion',
      params: {assertion: assertion, origin: origin}}};

    return new Promise(function(resolve, reject) {
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

      let returnedValue;
      if (funcName === 'deployGUI') {
        returnedValue = _this.deployGUI();
      } else if (funcName === 'getIdentitiesToChoose') {
        returnedValue = _this.getIdentitiesToChoose();
      } else if (funcName === 'unregisterIdentity') {
        let email = msg.body.params.email;
        returnedValue = _this.unregisterIdentity(email);
      /*
      } else if (funcName === 'generateRSAKeyPair') {
        // because generateRSAKeyPair is a promise
        // we have to send the message only after getting the key pair
        _this._crypto.getMyPublicKey().then((key) => {
          let value = {type: 'execute', value: key, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if generateRSAKeyPair method postMessage error: ' + err);
          }
        });
        return;
      */
      } else if (funcName === 'sendGenerateMessage') {
        let contents = msg.body.params.contents;
        let origin = msg.body.params.origin;
        let usernameHint = msg.body.params.usernameHint;
        let idpDomain = msg.body.params.idpDomain;
        _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((returnedValue) => {
          let value = {type: 'execute', value: returnedValue, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if sendGenerateMessage method postMessage error: ' + err);
          }

        });
        return;
      } else if (funcName === 'storeIdentity') {
        let result = msg.body.params.result;
//        let keyPair = msg.body.params.keyPair;
        _this.identities.addAssertion(result).then((returnedValue) => {
          let value = {type: 'execute', value: returnedValue, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
          }

        });
        return;
      } /*else if (funcName === 'selectIdentityForHyperty') {
        let origin = msg.body.params.origin;
        let idp = msg.body.params.idp;
        let idHint = msg.body.params.idHint;
        _this.selectIdentityForHyperty(origin, idp, idHint);
        return;
      }*/

      // if the function requested is not a promise
      let value = {type: 'execute', value: returnedValue, code: 200};
      let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
      try {
        _this._messageBus.postMessage(replyMsg);
      } catch (err) {
        reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err);
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
      _this.getIdToken(hypertyURL).then(function(assertion) {
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
          if (assertion.hasOwnProperty(refresh)) {
            _this.sendRefreshMessage(assertion).then((newAssertion) => {
              _this.identities.updateAssertion(newAssertion).then(()=>{
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
      }).catch(function(error) {
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

    return new Promise(function(resolve, reject) {

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
