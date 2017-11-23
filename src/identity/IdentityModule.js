// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityModule');

import {divideURL, getUserEmailFromURL, isDataObjectURL, getUserIdentityDomain, isLegacy, deepClone } from '../utils/utils.js';
import Identity from './Identity';
import Crypto from './Crypto';
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
  constructor(runtimeURL, runtimeCapabilities, storageManager, dataObjectsStorage, runtimeFactory) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing');
    if (!runtimeFactory) throw new Error('runtimeFactory is missing');

    _this._runtimeURL = runtimeURL;
    _this.storageManager = storageManager;
    _this.dataObjectsStorage = dataObjectsStorage;
    _this._idmURL = _this._runtimeURL + '/idm';
    _this._guiURL = _this._runtimeURL + '/identity-gui';
    _this.runtimeCapabilities = runtimeCapabilities;
    _this.runtimeFactory = runtimeFactory;

    _this._domain = divideURL(_this._runtimeURL).domain;

    _this.watchingYou = new WatchingYou();

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
    _this.identitiesList =  _this.watchingYou.watch('identitiesList', {}, true);
    _this.emailsList = [];
    let newIdentity = new Identity('guid', 'HUMAN');
    _this.identity = newIdentity;
    _this.crypto = new Crypto(_this.runtimeFactory);
    _this.currentIdentity;
    _this.defaultIdentity;

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {};

    // hashTable to store all the crypto information between two hyperties
    _this.chatKeys = {};

    // hashTable to store the symmetric keys to be used in the chat group
    _this.dataObjectSessionKeys = {};

    //failsafe to enable/disable all the criptographic functions
    _this.isToUseEncryption = true;

    // variable to know if the GUI is deployed to choose the identity. if the real GUI is not deployed, a fake gui is deployed instead.
    _this.guiDeployed = false;

    // verification of nodeJS, and in case it is nodeJS then disable encryption
    // TODO improve later, this exists because the crypto lib uses browser cryptographic methods
    //_this.isToUseEncryption = (window) ? true : false;

    // _this.loadIdentities();

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
  setCurrentIdentity(identity) {
    let _this = this;
    _this.currentIdentity = identity;
  }

  /**
  * Function to return all the identities registered within a session by a user.
  * These identities are returned in an array containing a JSON package for each user identity.
  * @return {Array<Identities>}         Identities
  */
  getIdentities() {
    let _this = this;
    return _this.identities;
  }

  getIdentitiesToChoose() {
    let _this = this;
    let identities = _this.emailsList;

    // let idps = [
    //   { domain: 'google.com', type: 'idToken'},
    //   { domain: 'microsoft.com', type: 'idToken'},
    //   { domain: 'orange.fr', type: 'idToken'},
    //   { domain: 'slack.com', type: 'Legacy'}
    // ];

    let idps = [
      { domain: 'google.com', type: 'idToken'},
      { domain: 'microsoft.com', type: 'idToken'},
      { domain: 'slack.com', type: 'Legacy'}
    ];

    return {identities: identities, idps: idps};
  }

  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
  }

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
              _this.defaultIdentity = identity.messageInfo;

              if (parseInt(expires) > timeNow) {
                _this.defaultIdentity.expires = parseInt(expires);
                _this.currentIdentity = _this.defaultIdentity;
              }

            }

          });
        }
        resolve();
      });
    });
  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identityBundle) {
    log.log('[getIdentityAssertion:identityBundle]', identityBundle);
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
            // console.error('[IdentityModule] Could not select identity from hyperty.');
            _this.selectIdentityFromGUI().then((newAssertion) => {
              log.log('[IdentityModule] Identity selected by hyperty.');
              return resolve(newAssertion);
            }, (err) => {
              return reject(err);
            });
          });
        } else {

          if (_this.defaultIdentity && _this.defaultIdentity.expires > _this._secondsSinceEpoch()) {
            return resolve(_this.defaultIdentity);
          } else {
            _this.selectIdentityFromGUI().then((assertion) => {

              log.log('[IdentityModule] Identity selected from GUI.');

              if (assertion.hasOwnProperty('messageInfo')) {
                _this.defaultIdentity = assertion.messageInfo;
                return resolve(assertion.messageInfo);
              }

              _this.defaultIdentity = assertion;
              return resolve(assertion);
            }, (err) => {
              return reject(err);
            });
          }
        }
      }).catch(error => {
        console.error('Error on identity acquisition ', error);
        return reject(error);
      });

      _this.runtimeCapabilities.isAvailable('node').then((result) => {
        log.log('node identity acquisition', result);

        if (!result) return;

        if (_this.currentIdentity !== undefined) {
          //TODO verify whether the token is still valid or not.
          // should be needed to make further requests, to obtain a valid token
          return resolve(_this.currentIdentity);
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
        console.error('Error on identity acquisition ', error);
        reject(error);
      });
    });
  }


  /**
  * Function to return all the users URLs registered within a session
  * These users URLs are returned in an array of strings.
  * @param  {Boolean}  emailFormat (Optional)   boolean to indicate to return in email format
  * @return {Array<String>}         users
  */
  getUsersIDs(emailFormat) {
    log.log('[getUsersIDs:emailFormat]', emailFormat);
    log.log('getUsersIDs:emailFormat', emailFormat);
    let _this = this;
    let users = [];

    //if request comes with the emailFormat option, then convert url to email format
    let converter = (emailFormat) ? getUserEmailFromURL : (value) => { return value; };

    for (let index in _this.identities) {
      let identity = _this.identities[index];
      users.push(converter(identity.identity));
    }

    return users;
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
    log.log('[requestIdentityToGUI:identities]', identities);
    log.log('[requestIdentityToGUI:idps]', idps);

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

      let id = _this._messageBus.postMessage(message);

      //add listener without timout
      try {
        _this._messageBus.addResponseListener(_this._idmURL, id, msg => {
          _this._messageBus.removeResponseListener(_this._idmURL, id);


          // todo: to return the user URL and not the email or identifier

          if (msg.body.code === 200) {
            let selectedIdentity = msg.body;

            log.log('selectedIdentity: ', selectedIdentity.value);
            resolve(selectedIdentity);
          } else {
            reject('error on requesting an identity to the GUI');
          }
        });
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

      //generates the RSA key pair
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {

        log.log('[callNodeJsGenerateMethods:keyPair.public]', keyPair.public);


        publicKey = _this.crypto.encode(keyPair.public);
        userkeyPair = keyPair;

        //log.log('[callNodeJsGenerateMethods:generateSelectedIdentity] NO_URL');
        //    return _this.generateAssertion(publicKey, origin, '', userkeyPair, idp);
        //}).then(function(url) {

        log.log('[callNodeJsGenerateMethods:generateSelectedIdentity] NO_URL');

        let url = 'https://localhost/#state=state&code=4/-mlGUZDkPUC79MzA9sd4Sk5vMJLihmmxFvewM8yJrbs&access_token=ya29.Glv3BKDuB09-tnIKKu5WT_Zextcd7ysgWKvZbvGv-RYI0HaQ76qwIvsTF3sVuJfh2e-cztojXy0ZsjHSfa1cMfnqNKYtjg8Z2qm0POvZkJODsNVUdO2-oz7dHhvr&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3NjcxOTI2M2NlYWFkZTkyZGI5YTMxMzI4YWRhNDRiNzE5MjA3ZjcifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTc5NTkxMDUyOTU3NjE2ODc4ODkiLCJlbWFpbCI6InRlc3RhbmR0aGluazEyM0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ikl6NnZJNXRremZlelY2VDVadGVtdEEiLCJjX2hhc2giOiI1ZGV6Z1FrTTFyZ25FVTJFanpTUFVBIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd3TERFME1pd3lNekFzTWpJeUxESXpMREU1T0N3eU9Td3hOVFlzTVRFeUxESXpOaXd4TWpZc01qSXlMREkwTml3ME15dzROaXc0TUN3eE9Ea3NNVFE0TERZNExERTVOaXd4TmpJc09USXNOakVzTWpZc01qUTRMRE15TERJeE5TdzROU3d4T1RJc01UVXhMRGs0TERRM0xESTBNaXd4TVN3eE56UXNNVGNzTWpJeUxERXhNeXd5TkRrc09EVXNNVE0xTERFeU9Dd3lOVFFzTVRJMUxERTNOQ3d5TURBc01UYzRMRGd4TERZMkxEazRMRFUwTERFMU1Td3hNelFzTVRJMUxETTFMREl5TVN3eE9UZ3NNeklzTVRBNUxETTJMRGNzTnpJc01UVTVMRFUyTERZekxEWXlMRGMwTERFNU1Td3hNellzTVRVc016WXNNVGd3TERFM09Td3hOVGdzTlRFc01UZ3NNVGt5TERFM01pd3lNamtzTWpVMUxERXhPU3cxTnl3eU16QXNNakFzTWpReUxESXdNaXd4T0RBc01URXdMREUyTnl3NE15d3lORGNzTVRVekxERTVPU3c1TVN3eE1qVXNNVGt5TERJeE9Dd3hNeXd4TlRrc01qRTNMREV5Tnl3eE1EUXNNakUwTERRNExEVXNNVEl4TERJeU9Dd3pNeXd4TWpZc09UUXNNVEU0TERneExERTJNaXd4TURJc01URXdMRGMxTERrNExETXhMREl3TWl3ek5Td3hOemtzTVRRc016Y3NNVElzTWpFMkxEWTFMREkwTlN3Mk5Td3hNRFVzTWpNM0xESTBOU3d4TkRBc01UZzBMRFU0TERJeU15dzNOeXd4TXpVc01qVXlMRElzTkRjc01UQTBMRFU1TERJMU5Td3lNVFlzTVRNM0xERTFNeXd5Tnl3eE56SXNNakl3TERFMU9Td3hPVFVzTWpFeUxESTVMREV4Tml3eE1EVXNNVEUyTERJeE1pd3lORGdzTnl3MU1pd3lPQ3d4TlRBc016QXNNamNzTWpFc01UY3NNVEkzTERnNExEVTBMREUzTkN3eE15dzBPU3d5TWpJc01UY3lMREl4TXl3eE1EZ3NNVFl5TERRM0xERTROaXd4TXpBc01qSTJMRFFzTVRjc01UZzVMRGcxTERFNE5Dd3lNVGNzTVRnMUxERTFNaXd4TVRrc01UQTBMREU1TXl3MU5Dd3lNVEVzTVRZeExERTVNU3d6TVN3ek9Dd3hNamtzTVRFM0xESXdOU3d4TURRc05pd3hOelVzTWpFNUxERXhOQ3czTERnMkxERTJNeXd4TWpZc01qVXpMREl4TXl3ek5pd3hNamtzTVRJc01UWTBMREV5Tnl3eU1qY3NNakF6TERnMUxEWTJMREl6TERVM0xERTBMREU1Tnl3eU9Dd3lOVElzTWpJeExEUXNNelFzTWpVd0xERTNOU3d5TVRnc01UZzFMREV4T1N3M01Dd3lORFlzTVRNMkxEZzVMREl3TERjd0xERXlNaXd4TURjc01qSXdMRGMxTERJd01Td3hOekFzTkRNc01qTXdMREl6Tml3ME55d3hNQ3d5TURjc01URTFMREkyTERFek1Td3lMRE1zTVN3d0xERT0iLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwianRpIjoiNDU0MTM3NGVjMmY1OWExMWMwNWE0NDFjMTRmMTJkNTllY2UxYzVmYiIsImlhdCI6MTUwOTY0MDA0OSwiZXhwIjoxNTA5NjQzNjQ5fQ.vlWWkWcz333hA4lY0onl2jeat5eHCKvyMD_m-KieMtGqcLhtknMl3HbYTABL2k3HEdqbnNlD1G6OyRG-nDWt6qWCgI-gGJ6ZeU9Xrd5fPlFyRPj-FOAhA514uaYss10GYgt5XoArV7oXrR1-FNVZVNhyioggqJjJ4xtnZ6_j0isUxE7uZTlJLX8ixL44eoPVujmXKIJaXRYp0xf3626rnBz8znmGTt1G1jTwMNZmhZc8LxSauVFMLLoRjmLgNKgsGJNKN3ND7H6rsD0Vw5t24tlBwT_fsYIPauJJVZeqpmzy6L-pCEPUc0oJ7OqML84MB2W2zTq4uv6bMh4nQ_mdrA&authuser=0&session_state=44077304f5ec024da73af13a720afad0e4cb945d..2df8&prompt=consent';
        _this.myHint = url;

        return _this.generateAssertion(publicKey, origin, url, userkeyPair, idp);

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

  fakeNodePopUp() {
    log.log('[fakeNodePopUp]');
    return new Promise((resolve, reject) => {

      let url = 'https://localhost/#state=state&code=4/xWFnH5iLpxv4W4Bm58oVqDK6vwVessKKMoNs-LsSKNY&access_token=ya29.GlsVBM3VBlBR1YNREuXqOr4G_UzvoL_y64YtOGGKJJ-QlasBW-HrV0b1HsxR4uNB7r-N-pElCleW6kNYW4WIIr6mOSp1euVD09eoDXtVZZFHuU8LEzcGYmVV7QLh&token_type=Bearer&expires_in=3600&id_token=eyJhbGciOiJSUzI1NiIsImtpZCI6IjQ5N2Y2MGIxMjRhNjc1NDI2NDhlYjIzYjc0YmY4YTg2MDJkY2I4YTYifQ.eyJhenAiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTE5MzQyMzM2MzI1MjAwNzc3NDMiLCJlbWFpbCI6Im9wZW5pZHRlc3QxMEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Im94X1Vva3FwRDNkMjBpZzRXeEd2WlEiLCJjX2hhc2giOiJFem9RYmNwdGJxQlhoa0NEZGVOUFNRIiwibm9uY2UiOiJORGdzTVRNd0xERXNNelFzTkRnc01UTXNOaXc1TERReUxERXpOQ3czTWl3eE16UXNNalEzTERFekxERXNNU3d4TERVc01Dd3pMREV6TUN3eExERTFMREFzTkRnc01UTXdMREVzTVRBc01pd3hNekFzTVN3eExEQXNNVGd4TERFeU9Dd3hNRGdzTVRnekxESTFNeXd5TlN3eU16WXNPVGdzT0RBc016a3NNakl4TERrekxESXhMRFV4TERFNUxERXlMRFEzTERFd0xESTFOU3d5Tnl3eU1qWXNNVFV4TERFNU55d3hNRGNzTVRRekxERTJOeXd4T1N3eE5EQXNNVGs1TERFNE9Dd3lNelFzTVRNMUxEVTFMREl3TlN3eU1Ua3NNVGdzT0RRc01qSXlMREV4TUN3eU1Ea3NNVFU1TERFNE5Td3lORFFzTWpRM0xERXhPQ3d4T0RBc01qQXhMREV6T1N3eE1pd3lNakFzTVRBNExERTROaXd6T1N3eU1qQXNPRFFzTVRVeExESTFNeXd6TlN3MU1Td3hPVEVzT0RFc01UYzBMREU0T1N3NExEa3dMREkxTWl3eU1EWXNNalFzTVRVekxERTRPQ3d5TlRJc01qUXhMRFV4TERFMU9TdzVMREU0TERFM05Dd3pNaXd4T0RNc01qSXpMREU1Tml3ME1Td3hOeklzTlRNc01qRXNNemNzTWpReUxERTNOeXd4T1Rjc05Dd3lOQ3d4Tnprc01UYzRMREUxTnl3eE1UWXNNakkyTERjd0xERXdPQ3d4TkRFc01UZzVMREU1TWl3eU16Z3NNVEE0TERFeU9Dd3hNelFzTkRBc01pd3hOemtzTmpjc01UQXhMRE01TERjM0xESXhPQ3cwT0N3eU5UQXNNVGsyTERjd0xEZzBMREUyTml3eE55d3hOVFlzTlRZc01UTTFMRFFzTkRNc01UYzRMREkxTkN3ME5Dd3lOeXd4Tnpjc01UYzRMREUwTlN3eE5ESXNNVFF3TERJMUxERTBOU3d4TnpNc05ERXNNVEl4TERJeU9Dd3lORGtzTkRrc01UVTJMREl5TUN3eE1ESXNNVGd4TERFeUxERXdMREl4TkN3eE1Ea3NOVFFzTVRrekxESTBNQ3d5TVRZc01qRTRMRGNzTVRBNUxEa3dMREl4Tnl3ek1Dd3lORGNzTVRReExERTFOeXcxT1N3eU1qWXNORFlzTVRVMUxEUTBMREUxTml3NU55dzBPQ3d4T0Rrc01USXpMREU0TWl3eE5qVXNNalF3TERFd05TdzNPQ3d4T1Rnc05Ua3NNalVzTVRreUxESXhNeXd4TlRVc09EUXNNVGtzT1Rnc09EZ3NPVGNzTVRFNExERTVNU3czT1N3eE1EZ3NNakl4TERFd05Dd3lNVElzTlRBc016QXNNVGt5TERFeE1TdzNNeXd4T0RFc01USTRMRGt5TERFME9Dd3lNVEFzTWpBMExESXlNQ3d5TXpjc01UTTRMREkwTml3eE9Ea3NNVGsyTERFNE55d3pOU3d5TVRnc01qVXpMRFUzTERNd0xEWTFMRFkyTERFd015d3lPQ3d4TlRBc01USXNNakEwTERRd0xEZzBMRFF5TERFd05DdzJOU3d4TmpRc01UUTJMREl5Tnl3NE1pdzJMREUyTERFMk55d3hNak1zTVRrc01qSXhMREV6TVN3eE5UUXNOREVzT1RZc05qZ3NNakVzTVRRd0xESTJMRGc0TERFeU5pdzJOaXczTnl3NE9TdzNNeXd4T1RNc01pd3pMREVzTUN3eCIsImlzcyI6ImFjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTAxMjEwNDQsImV4cCI6MTQ5MDEyNDY0NH0.GRnWCUx5r5ll9xkCRlYwUjISxi7nQ0OtlayWeqVcmoSf9W0k9HcBH_9U1CA-LJDkJCntDtkSkQyuRF-Sh53S2QYa396fqRZONp1czj6zCIxjZX30--vOvBCGyAI8sC9vssoKciTHn1aQhzDvY7HD4C7gt0KGI3FbtYRGa_RNm6v2ngqwVq0GyqE0KuosgVw0IjxbjOShrwWSHD1UszkEMhf4dQuekrZlvfkEfZN9aWbhy4qQy0y1Eiz0jTP2b5Yp1F1KyUQcgh8ofU2mE19nWzqxsMw-CEnGOUuwjfEGPqTg6ej0TDOz6rkODMvmQ9q33tL6TMbbJWga7DxAOOXSRQ&authuser=0&session_state=68cc1dc43bf1d78f415cc69354e639bdc52fb45f..2f30&prompt=consent';
      resolve(url);
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
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {

        log.log('[callNodeJsGenerateMethods:keyPair.public]', keyPair.public);
        log.log('[callNodeJsGenerateMethods:keyPair.private]', keyPair.private);

        publicKey = _this.crypto.encode(keyPair.public);
        userkeyPair = keyPair;
        log.log('generateAssertion:no_hint');
        return _this.generateAssertion(publicKey, origin, '', userkeyPair, idp);

      }).then(function(url) {
        log.log(['']);
        _this.myHint = url;
        log.log('generateAssertion:hint');
        return _this.generateAssertion(publicKey, origin, url, userkeyPair, idp);

      }).then(function(value) {
        if (value) {
          resolve(value);
        } else {
          reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }


  loginSelectedIdentity(publicKey, origin, idp, keyPair, loginUrl) {
    log.log('[loginSelectedIdentity:publicKey]', publicKey);
    log.log('[loginSelectedIdentity:origin]', origin);
    log.log('[loginSelectedIdentity:idp]', idp);
    log.log('[loginSelectedIdentity:keyPair]', keyPair);
    log.log('[loginSelectedIdentity:loginUrl]', loginUrl);
    let _this = this;

    return new Promise((resolve, reject) => {
      log.log('[IdentityModule:generateSelectedIdentity] openPopup');
      _this.callIdentityModuleFunc('openPopup', {urlreceived: loginUrl}).then((idCode) => {
        return idCode;
      }, (err) => {
        console.error('Error while logging in for the selected identity.');
        return reject(err);
      }).then((idCode) => {
        _this.sendGenerateMessage(publicKey, origin, idCode, idp).then((newResponse) => {
          if (newResponse.hasOwnProperty('assertion')) {
            _this.storeIdentity(newResponse, keyPair).then(result => {
              resolve('Login was successfull');
            }).catch(err => { reject('Login has failed:' + err); });
          } else {
            console.error('Error while logging in for the selected identity.');
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
      _this.crypto.generateRSAKeyPair().then(function(keyPair) {
        publicKey = _this.crypto.encode(keyPair.public);

        _this.sendGenerateMessage(publicKey, origin, idHint, idp).then((response) => {
          if (response.hasOwnProperty('assertion')) { // identity was logged in, just save it
            _this.storeIdentity(response, keyPair).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          } else if (response.hasOwnProperty('loginUrl')) { // identity was not logged in
            _this.loginSelectedIdentity(publicKey, origin, idp, keyPair, response.loginUrl).then((value) => {
              return resolve(value);
            }, (err) => {
              return reject(err);
            });
          } else { // you should never get here, if you do then the IdP Proxy is not well implemented
            // console.error('GenerateAssertion returned invalid response.');
            log.log('Proceeding by logging in.');
            _this.generateSelectedIdentity(publicKey, origin, idp, keyPair).then((value) => {
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
    log.log('[selectIdentityFromGUI:origin]', origin);
    let _this = this;

    return new Promise((resolve, reject) => {
      let identitiesInfo = _this.getIdentitiesToChoose();

      _this.requestIdentityToGUI(identitiesInfo.identities, identitiesInfo.idps).then(value => {

        if (value.type === 'identity') {

        //  let chosenID = getUserURLFromEmail(value.value);
        // hack while the user url is not returned from requestIdentityToGUI;

          let chosenID = 'user://' + _this.currentIdentity.idp + '/' + value.value;

          _this.defaultIdentity = _this.currentIdentity;

          // returns the identity info from the chosen id
          for (let i in _this.identities) {
            if (_this.identities[i].identity === chosenID) {
              return resolve(_this.identities[i].messageInfo);
            }
          }
          return reject('no identity was found .');
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
          assertionParsed = _this.crypto.decode(splitedAssertion[1]);
        } else {
          assertionParsed = _this.crypto.decode(result.assertion);
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

      _this.identity.addIdentity(result);

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
  }

  generateSelectedIdentity(publicKey, origin, idp, keyPair) {
    log.log('[generateSelectedIdentity:publicKey]', publicKey);
    log.log('[generateSelectedIdentity:origin]', origin);
    log.log('[generateSelectedIdentity:idp]', idp);
    log.log('[generateSelectedIdentity:keyPair]', keyPair);

    let _this = this;

    return new Promise((resolve, reject) => {
      log.log('[IdentityModule:generateSelectedIdentity] NO_URL');
      _this.generateAssertion(publicKey, origin, '', keyPair, idp).then((loginUrl) => {
        return loginUrl;
      }).then(function(url) {
        log.log('[IdentityModule:generateSelectedIdentity] URL');
        return _this.generateAssertion(publicKey, origin, url, keyPair, idp);
      }).then(function(value) {
        if (value) {
          return resolve(value);
        } else {
          return reject('Error on obtaining Identity');
        }
      }).catch(function(err) {
        console.error(err);
        return reject(err);
      });
    });
  }

  callIdentityModuleFunc(methodName, parameters) {
    log.log('[callIdentityModuleFunc:methodName]', methodName);
    log.log('[callIdentityModuleFunc:parameters]', parameters);
    let _this = this;

    return new Promise((resolve, reject) => {
      let message = { type: 'execute', to: _this._guiURL, from: _this._idmURL,
        body: { resource: 'identity', method: methodName, params: parameters }};
      let id = _this._messageBus.postMessage(message);

      //add listener without timout
      try {
        _this._messageBus.addResponseListener(_this._idmURL, id, msg => {
          _this._messageBus.removeResponseListener(_this._idmURL, id);
          let result = msg.body.value;
          resolve(result);
        });
      } catch (err) {
        reject('In method callIdentityModuleFunc error: ' + err);
      }
    });
  }


  //******************* ENCRYPTION METHODS *******************
  encryptMessage(message) {
    //console.info('encryptMessage:message', message);
    let _this = this;

    log.log('encrypt message ');

    return new Promise(function(resolve, reject) {
      let isHandShakeType = message.type === 'handshake';

      //if is not to apply encryption, then returns resolve
      if (!_this.isToUseEncryption && !isHandShakeType) {
        console.info('encryption disabled');
        return resolve(message);
      }

      let dataObjectURL = _this._parseMessageURL(message.to);

      let isToDataObject = isDataObjectURL(dataObjectURL);
      let isToLegacyIdentity = isLegacy(message.to);
      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';

      if (message.type === 'update') {
        log.log('encrypt message: message type update');
        return resolve(message);
      }

      if (isToLegacyIdentity) {
        resolve(message);
      } else if (isFromHyperty && isToHyperty) {
        let userURL = _this._registry.getHypertyOwner(message.from);
        if (userURL) {

          // check if exists any keys between two users
          let chatKeys = _this.chatKeys[message.from + '<->' + message.to];
          if (!chatKeys) {
            chatKeys = _this._newChatCrypto(message, userURL);

            //log.log('createChatKey encrypt', message.from + message.to);
            _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
            message.body.handshakePhase = 'startHandShake';
          }

          if (chatKeys.authenticated && !isHandShakeType) {

            let iv = _this.crypto.generateIV();
            _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, message.body.value, iv).then(encryptedValue => {

              let filteredMessage = _this._filterMessageToHash(message, message.body.value + iv, chatKeys.hypertyFrom.messageInfo);

              _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage).then(hash => {
                //log.log('result of hash ', hash);
                let value = {iv: _this.crypto.encode(iv), value: _this.crypto.encode(encryptedValue), hash: _this.crypto.encode(hash)};
                message.body.value = _this.crypto.encode(value);

                resolve(message);
              });
            });

            // if is a handshake message, just resolve it
          } else if (isHandShakeType) {
            resolve(message);

            // else, starts a new handshake protocol
          } else {
            _this._doHandShakePhase(message, chatKeys).then(function(value) {
              _this.chatKeys[message.from + '<->' + message.to] = value.chatKeys;

              _this._messageBus.postMessage(value.message);
              reject('encrypt handshake protocol phase ');
            });
          }
        } else {
          reject('In encryptMessage: Hyperty owner URL was not found');
        }

      //if from hyperty to a dataObjectURL
      } else if (isFromHyperty && isToDataObject) {

        //log.log('dataObject value to encrypt: ', message.body.value);
        //log.log('IdentityModule - encrypt from hyperty to dataobject ', message);

        _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
          sessionKeys = _chatkeysToArrayCloner(dataObjectURL, sessionKeys);
          let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

          _this.dataObjectsStorage.getDataObject(dataObjectURL).then((isHypertyReporter) => {
            //if no key exists, create a new one if is the reporter of dataObject
            if (!dataObjectKey) {
              // if the hyperty is the reporter of the dataObject then generates a session key
              if (isHypertyReporter.reporter && isHypertyReporter.reporter === message.from) {

                let sessionKey = _this.crypto.generateRandom();
                _this.dataObjectSessionKeys[dataObjectURL] = {sessionKey: sessionKey, isToEncrypt: true};
                let dataObjectSessionKeysClone = _chatkeysToStringCloner(dataObjectURL, _this.dataObjectSessionKeys);

                //TODO: check if this does not need to be stored
                _this.storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeysClone).catch(err => {
                  reject('On encryptMessage from method storageManager.set error: ' + err);
                });
                dataObjectKey = _this.dataObjectSessionKeys[dataObjectURL];
              }
            }

            //check if there is already a session key for the chat room
            if (dataObjectKey) {

              // and if is to apply encryption, encrypt the messages
              if (dataObjectKey.isToEncrypt) {
                let iv = _this.crypto.generateIV();

                _this.crypto.encryptAES(dataObjectKey.sessionKey, _this.crypto.encode(message.body.value), iv).then(encryptedValue => {
                  delete message.body.identity.assertion; //TODO: Check why assertion is comming on the message!
                  delete message.body.identity.expires; //TODO: Check why expires is comming on the message!
                  let filteredMessage = _this._filterMessageToHash(message, message.body.value + iv);

                  _this.crypto.hashHMAC(dataObjectKey.sessionKey, filteredMessage).then(hash => {
                    // log.log('hash ', hash);

                    let newValue = {value: _this.crypto.encode(encryptedValue), iv: _this.crypto.encode(iv), hash: _this.crypto.encode(hash)};

                    message.body.value = JSON.stringify(newValue);
                    resolve(message);
                  });
                });

              // if not, just send the message
              } else {
                resolve(message);
              }

              // start the generation of a new session Key
            } else {
              reject('Data object key could not be defined: Failed to decrypt message ');
            }
          }).catch(err => { reject('On encryptMessage from method dataObjectsStorage.getDataObject error: ' + err); });
        }).catch(err => { reject('On encryptMessage from method storageManager.get error: ' + err); });
      }
    });
  }

  encryptDataObject(dataObject, sender) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      console.info('dataObject value to encrypt: ', dataObject);

      let dataObjectURL = _this._parseMessageURL(sender);

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        sessionKeys = _chatkeysToArrayCloner(dataObjectURL, sessionKeys);
        let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

        //check if there is already a session key for the chat room
        if (dataObjectKey) {

          // and if is to apply encryption, encrypt the messages
          if (dataObjectKey.isToEncrypt) {
            let iv = _this.crypto.generateIV();

            _this.crypto.encryptAES(dataObjectKey.sessionKey, _this.crypto.encode(dataObject), iv).then(encryptedValue => {
              let newValue = { value: _this.crypto.encode(encryptedValue), iv: _this.crypto.encode(iv) };

              //log.log('encrypted dataObject', newValue);
              return resolve(newValue);
            }).catch(err => { reject('On encryptDataObject from method encryptAES error: ' + err); });

          // if not, just send the message
          } else {
            console.info('The dataObject is not encrypted');
            return resolve(dataObject);
          }

          // start the generation of a new session Key
        } else {
          return reject('No dataObjectKey for this dataObjectURL:', dataObjectURL);
        }
      }).catch(err => { reject('On encryptDataObject from method storageManager.get error: ' + err); });
    });
  }

  decryptMessage(message) {
    let _this = this;

    //  log.log('decryptMessage:message', message);

    return new Promise(function(resolve, reject) {
      let isHandShakeType = message.type === 'handshake';

      //if is not to apply encryption, then returns resolve
      if (!_this.isToUseEncryption && !isHandShakeType) {
        // log.log('decryption disabled');
        return resolve(message);
      }

      let dataObjectURL = _this._parseMessageURL(message.to);

      let isToDataObject = isDataObjectURL(dataObjectURL);
      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';

      if (message.type === 'update') {
        return resolve(message);
      }

      //is is hyperty to hyperty communication
      if (isFromHyperty && isToHyperty) {
        // log.log('decrypt hyperty to hyperty');
        let userURL = _this._registry.getHypertyOwner(message.to);
        if (userURL) {

          let chatKeys = _this.chatKeys[message.to + '<->' + message.from];
          if (!chatKeys) {
            chatKeys = _this._newChatCrypto(message, userURL, 'decrypt');
            _this.chatKeys[message.to + '<->' + message.from] = chatKeys;
          }

          if (chatKeys.authenticated && !isHandShakeType) {
            let value = _this.crypto.decode(message.body.value);
            let iv = _this.crypto.decodeToUint8Array(value.iv);
            let data = _this.crypto.decodeToUint8Array(value.value);
            let hash = _this.crypto.decodeToUint8Array(value.hash);
            _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
              // log.log('decrypted value ', decryptedData);
              message.body.value = decryptedData;

              let filteredMessage = _this._filterMessageToHash(message, decryptedData + iv);

              _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, hash).then(result => {
                //log.log('result of hash verification! ', result);
                message.body.assertedIdentity = true;
                resolve(message);
              });
            });

          } else if (isHandShakeType) {
            _this._doHandShakePhase(message, chatKeys).then(function(value) {

              //if it was started by doMutualAuthentication then ends the protocol
              if (value === 'handShakeEnd') {
                //reject('decrypt handshake protocol phase');

              // if was started by a message, then resend that message
              } else {
                _this.chatKeys[message.to + '<->' + message.from] = value.chatKeys;
                _this._messageBus.postMessage(value.message);

                //reject('decrypt handshake protocol phase ');
              }
            });
          } else {
            reject('wrong message do decrypt');
          }
        } else {
          reject('error on decrypt message');
        }

        //if from hyperty to a dataObjectURL
      } else if (isFromHyperty && isToDataObject) {
        // log.log('dataObject value to decrypt: ', message.body);

        _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
          sessionKeys = _chatkeysToArrayCloner(dataObjectURL, sessionKeys);
          let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

          if (dataObjectKey) {

            //check if is to apply encryption
            if (dataObjectKey.isToEncrypt) {
              let parsedValue = JSON.parse(message.body.value);
              let iv = _this.crypto.decodeToUint8Array(parsedValue.iv);
              let encryptedValue = _this.crypto.decodeToUint8Array(parsedValue.value);
              let hash = _this.crypto.decodeToUint8Array(parsedValue.hash);

              _this.crypto.decryptAES(dataObjectKey.sessionKey, encryptedValue, iv).then(decryptedValue => {
                let parsedValue = _this.crypto.decode(decryptedValue);

                // log.log('decrypted Value,', parsedValue);
                message.body.value = parsedValue;

                let filteredMessage = _this._filterMessageToHash(message, parsedValue + iv);

                _this.crypto.verifyHMAC(dataObjectKey.sessionKey, filteredMessage, hash).then(result => {
                  // log.log('result of hash verification! ', result);

                  message.body.assertedIdentity = true;
                  resolve(message);
                });
              });

            //if not, just return the message
            } else {
              message.body.assertedIdentity = true;
              resolve(message);
            }

          } else {
            message.body.assertedIdentity = true;
            resolve(message);

            //reject('no sessionKey for chat room found');
          }
        });

      } else {
        reject('wrong message to decrypt');
      }

    });
  }

  decryptDataObject(dataObject, sender) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      //if is not to apply encryption, then returns resolve
      if (!_this.isToUseEncryption) {
        // log.log('decryption disabled');
        return resolve(dataObject);
      }

      let dataObjectURL = _this._parseMessageURL(sender);

      // log.log('dataObject value to decrypt: ', dataObject);

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        sessionKeys = _chatkeysToArrayCloner(dataObjectURL, sessionKeys);
        let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

        if (dataObjectKey) {

          //check if is to apply encryption
          if (dataObjectKey.isToEncrypt) {
            let iv = _this.crypto.decodeToUint8Array(dataObject.iv);
            let encryptedValue = _this.crypto.decodeToUint8Array(dataObject.value);

            _this.crypto.decryptAES(dataObjectKey.sessionKey, encryptedValue, iv).then(decryptedValue => {
              let parsedValue = _this.crypto.decode(decryptedValue);
              let newValue = { value: parsedValue, iv: _this.crypto.encode(iv) };

              // log.log('decrypted dataObject,', newValue);

              return resolve(newValue);
            }).catch(err => { reject('On decryptDataObject from method encryptAES error: ' + err); });

          //if not, just return the dataObject
          } else {
            // log.log('The dataObject is not encrypted');
            return resolve(dataObject);
          }

        } else {
          return reject('No dataObjectKey for this dataObjectURL:', dataObjectURL);
        }
      });
    });
  }

  doMutualAuthentication(sender, receiver) {
    console.info('doMutualAuthentication:sender ', sender);
    console.info('doMutualAuthentication:receiver ', receiver);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dataObjectURL;

      // check if the sender is a dataObject and if so stores that value
      let reporterURL = _this.registry.getReporterURLSynchonous(sender);
      if (reporterURL) {
        dataObjectURL = sender;
        sender = reporterURL;
      }

      let msg = {
        to: receiver,
        from: sender,
        callback: undefined,
        body: {handshakePhase: 'startHandShake', ignore: 'ignoreMessage'}
      };

      if (!sender || !receiver) {
        return reject('sender or receiver missing on doMutualAuthentication');
      }

      let chatKeys = _this.chatKeys[sender + '<->' + receiver];
      let userURL = _this._registry.getHypertyOwner(sender);

      if (userURL) {

        if (!chatKeys) {
          // callback to resolve when finish the mutual authentication
          let resolved = function(value) {
            // log.log('callback value:', value);
            resolve(value);
          };
          msg.callback = resolved;
          msg.dataObjectURL = dataObjectURL;

          chatKeys = _this._newChatCrypto(msg, userURL);
          _this.chatKeys[sender + '<->' + receiver] = chatKeys;
        }

        if (chatKeys.authenticated) {

          let startSessionKeyExchange = {
            to: sender,
            from: receiver
          };
          chatKeys.dataObjectURL = dataObjectURL;
          _this._sendReporterSessionKey(startSessionKeyExchange, chatKeys).then(value => {

            _this._messageBus.postMessage(value.message);
            resolve('exchange of chat sessionKey initiated');
          }).catch(err => { reject('On doMutualAuthentication from method _sendReporterSessionKey error: ' + err); });
        } else {
          _this._doHandShakePhase(msg, chatKeys);
        }
      } else {
        reject('Mutual authentication error: Hyperty owner could not be resolved');
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
      // log.log('[Identity.IdentityModule.getToken] from->', fromURL, '  to->', toUrl);

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
                console.error('[Identity.IdentityModule.getToken] error CallGeneratemethods');
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
    console.info('getIdToken:hypertyURL ', hypertyURL);
    let _this = this;
    return new Promise(function(resolve, reject) {
      let splitURL = hypertyURL.split('://');
      if (splitURL[0] !== 'hyperty') {

        _this._getHypertyFromDataObject(hypertyURL).then((returnedHypertyURL) => {

          let userURL = _this.registry.getHypertyOwner(returnedHypertyURL);

          if (userURL) {

            for (let index in _this.identities) {
              let identity = _this.identities[index];
              if (identity.identity === userURL) {
                return resolve(identity.messageInfo);
              }
            }
          } else {
            return reject('no identity was found ');
          }
        }).catch((reason) => {
          console.error('no identity was found: ', reason);
          reject(reason);
        });
      } else {
        let userURL = _this.registry.getHypertyOwner(hypertyURL);
        if (userURL) {

          for (let index in _this.identities) {
            let identity = _this.identities[index];
            if (identity.identity === userURL) {
              // TODO check this getIdToken when we run on nodejs environment;
              if (identity.hasOwnProperty('messageInfo')) {
                if (identity.messageInfo.hasOwnProperty('assertion')) { return resolve(identity.messageInfo); } else { //hack while idm is not reestuctured
                  identity.messageInfo.assertion = identity.assertion;
                  return resolve(identity.messageInfo);
                }
              } else {
                return resolve(identity);
              }
            }
          }
        } else {
          return reject('no identity was found.');
        }
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
    let timeNow = _this._secondsSinceEpoch();
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

  loadSessionKeys() {
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
  }


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

      console.info('sendRefreshMessage:oldIdentity', oldIdentity);

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
  generateAssertion(contents, origin, usernameHint, keyPair, idpDomain) {
    log.log('[generateAssertion:contents]', contents);
    log.log('[generateAssertion:origin]', origin);
    log.log('[generateAssertion:usernameHint]', usernameHint);
    log.log('[generateAssertion:keyPair]', keyPair);
    log.log('[generateAssertion:idpDomain]', idpDomain);
    let _this = this;

    return new Promise(function(resolve, reject) {
      log.log('[IdentityModule:generateSelectedIdentity:sendGenerateMessage]', usernameHint);
      _this.sendGenerateMessage(contents, origin, usernameHint, idpDomain).then((result) => {

        if (result.loginUrl) {

          _this.callIdentityModuleFunc('openPopup', {urlreceived: result.loginUrl}).then((value) => {
            log.log('[IdentityModule:generateSelectedIdentity:openPopup]', usernameHint);

            resolve(value);
          }, (err) => {
            reject(err);
          });
        } else if (result) {

          _this.storeIdentity(result, keyPair).then((value) => {
            resolve(value);
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
      } else if (funcName === 'generateRSAKeyPair') {
        // because generateRSAKeyPair is a promise
        // we have to send the message only after getting the key pair
        _this.crypto.generateRSAKeyPair().then((keyPair) => {
          let value = {type: 'execute', value: keyPair, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            reject('On addGUIListeners from if generateRSAKeyPair method postMessage error: ' + err);
          }
        });
        return;
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
        let keyPair = msg.body.params.keyPair;
        _this.storeIdentity(result, keyPair).then((returnedValue) => {
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
  //  console.info('_getValidToken:hypertyURL', hypertyURL);
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.getIdToken(hypertyURL).then(function(identity) {
        //        log.log('[Identity.IdentityModule.getValidToken] Token', identity);
        let timeNow = _this._secondsSinceEpoch();
        let completeId = _this.getIdentity(identity.userProfile.userURL);
        let expirationDate = undefined;

        if (completeId.hasOwnProperty('info')) {
          if (completeId.info.hasOwnProperty('expires')) {
            expirationDate = completeId.info.expires;
          } else if (completeId.info.hasOwnProperty('tokenIDJSON')) {
            expirationDate = completeId.info.tokenIDJSON.exp;
          } else {
            // throw 'The ID Token does not have an expiration time';
            console.info('The ID Token does not have an expiration time');
            resolve(identity);
          }
        } else if (completeId.hasOwnProperty('infoToken') && completeId.infoToken.hasOwnProperty('exp')) {
          expirationDate = completeId.infoToken.exp;
        } else {
          // throw 'The ID Token does not have an expiration time';
          console.info('The ID Token does not have an expiration time');
          resolve(identity);
        }

        log.log('[Identity.IdentityModule.getValidToken] Token expires in', expirationDate);
        log.log('[Identity.IdentityModule.getValidToken] time now:', timeNow);

        if (timeNow >= expirationDate) {
          if (identity.idp === 'google.com') {
            _this.sendRefreshMessage(identity).then((newIdentity) => {
              _this.deleteIdentity(completeId.identity);
              _this.storeIdentity(newIdentity.body.params.identity, newIdentity.body.params.identity.keyPair).then((value) => {
                resolve(value);
              }, (err) => {
                console.error('[Identity.IdentityModule.getToken] error on getToken', err);
                reject(err);
              });
            });
          } else { // microsoft.com
            _this.deleteIdentity(completeId.identity);

            // generate new idToken
            _this.callGenerateMethods(identity.idp).then((value) => {
              resolve(value);
            }).catch(err => { reject('On addGUIListeners from if storeIdentity method postMessage error: ' + err); });
          }
        } else {
          resolve(identity);
        }
      }).catch(function(error) {
        console.error('[Identity.IdentityModule.getToken] error on getToken', error);
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
    console.info('_getHypertyFromDataObject:dataObjectURL', dataObjectURL);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let splitedURL = divideURL(dataObjectURL);
      let domain = splitedURL.domain;
      let finalURL = _this._parseMessageURL(dataObjectURL);

      // check if is the creator of the hyperty
      let reporterURL = _this.registry.getReporterURLSynchonous(finalURL);
      console.info('_getHypertyFromDataObject:reporterURL', reporterURL);

      if (reporterURL) {
        resolve(reporterURL);
      } else {
        // check if there is already an association from an hypertyURL to the dataObject
        let storedReporterURL = _this.dataObjectsIdentity[finalURL];
        console.info('_getHypertyFromDataObject:storedReporterURL', storedReporterURL);

        if (storedReporterURL) {
          resolve(storedReporterURL);
        } else {
          // check if there is any hyperty that subscribed the dataObjectURL
          let subscriberHyperty = _this.registry.getDataObjectSubscriberHyperty(dataObjectURL);
          console.info('_getHypertyFromDataObject:subscriberHyperty', subscriberHyperty);

          if (subscriberHyperty) {
            resolve(subscriberHyperty);
          } else {
            // search in domain registry for the hyperty associated to the dataObject
            // search in case is a subscriber who wants to know the reporter
            _this._coreDiscovery.discoverDataObjectPerURL(finalURL, domain).then(dataObject => {
              console.info('_getHypertyFromDataObject:dataObject', dataObject);
              _this.dataObjectsIdentity[finalURL] = dataObject.reporter;
              console.info('_getHypertyFromDataObject:dataObject.reporter', dataObject.reporter);
              resolve(dataObject.reporter);
            }, err => {
              reject(err);
            });
          }
        }
      }
    });
  }

  _sendReporterSessionKey(message, chatKeys) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let sessionKeyBundle = _this.dataObjectSessionKeys[chatKeys.dataObjectURL];
      let reporterSessionKeyMsg;
      let valueToEncrypt;
      let sessionKey;
      let iv;
      let value = {};

      //if there is not yet a session Key, generates a new one
      if (!sessionKeyBundle) {
        sessionKey = _this.crypto.generateRandom();
        _this.dataObjectSessionKeys[chatKeys.dataObjectURL] = {sessionKey: sessionKey, isToEncrypt: true};

        let dataObjectSessionKeysClone = _chatkeysToStringCloner(chatKeys.dataObjectURL, _this.dataObjectSessionKeys);

        _this.storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeysClone).catch(err => {
          reject('On _sendReporterSessionKey from method storageManager.set(dataObjectSessionKeys...) error: ' + err);
        });

      } else {
        sessionKey = sessionKeyBundle.sessionKey;
      }

      try {
        valueToEncrypt = _this.crypto.encode({value: _this.crypto.encode(sessionKey), dataObjectURL: chatKeys.dataObjectURL});
      } catch (err) {
        return reject('On _sendReporterSessionKey from method storageManager.set error valueToEncrypt: ' + err);
      }

      iv = _this.crypto.generateIV();
      value.iv = _this.crypto.encode(iv);
      _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, valueToEncrypt, iv).then(encryptedValue => {

        reporterSessionKeyMsg = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'reporterSessionKey',
            value: _this.crypto.encode(encryptedValue)
          }
        };

        let filteredMessage = _this._filterMessageToHash(reporterSessionKeyMsg, valueToEncrypt + iv, chatKeys.hypertyFrom.messageInfo);

        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
      }).then(hashedMessage => {
        let valueWithHash = _this.crypto.encode({value: reporterSessionKeyMsg.body.value, hash: _this.crypto.encode(hashedMessage), iv: value.iv});

        reporterSessionKeyMsg.body.value = valueWithHash;

        resolve({message: reporterSessionKeyMsg, chatKeys: chatKeys});
      }).catch(err => {
        reject('On _sendReporterSessionKey from chained promises encryptAES error: ' + err);
      });
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

  _doHandShakePhase(message, chatKeys) {
  // log('_doHandShakePhase:dataObject', message);
  //	log('_doHandShakePhase:chatKeys', chatKeys);

    let _this = this;

    return new Promise(function(resolve, reject) {

      let handshakeType = message.body.handshakePhase;
      let iv;
      let hash;
      let value = {};
      let filteredMessage;

      console.info('handshake phase: ', handshakeType);

      switch (handshakeType) {

        case 'startHandShake': {
          chatKeys.keys.fromRandom = _this.crypto.generateRandom();
          let startHandShakeMsg = {
            type: 'handshake',
            to: message.to,
            from: message.from,
            body: {
              handshakePhase: 'senderHello',
              value: _this.crypto.encode(chatKeys.keys.fromRandom)
            }
          };
          chatKeys.handshakeHistory.senderHello = _this._filterMessageToHash(startHandShakeMsg, undefined, chatKeys.hypertyFrom.messageInfo);

          // check if was the encrypt function or the mutual authentication that request the
          // start of the handShakePhase.

          if (chatKeys.initialMessage) {
            resolve({message: startHandShakeMsg, chatKeys: chatKeys});
          } else {
            _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
            _this._messageBus.postMessage(startHandShakeMsg);
          }

          break;

        }
        case 'senderHello': {

          log.log('senderHello');
          chatKeys.handshakeHistory.senderHello = _this._filterMessageToHash(message);
          chatKeys.keys.fromRandom = _this.crypto.decodeToUint8Array(message.body.value);
          chatKeys.keys.toRandom = _this.crypto.generateRandom();

          let senderHelloMsg = {
            type: 'handshake',
            to: message.from,
            from: message.to,
            body: {
              handshakePhase: 'receiverHello',
              value: _this.crypto.encode(chatKeys.keys.toRandom)
            }
          };
          chatKeys.handshakeHistory.receiverHello = _this._filterMessageToHash(senderHelloMsg, undefined, chatKeys.hypertyFrom.messageInfo);
          resolve({message: senderHelloMsg, chatKeys: chatKeys});

          break;
        }
        case 'receiverHello': {

          log.log('receiverHello');
          chatKeys.handshakeHistory.receiverHello = _this._filterMessageToHash(message);

          _this.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp).then((value) => {

            //TODO remove later this verification as soon as all the IdP proxy are updated in the example
            let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

            let receiverPublicKey = _this.crypto.decodeToUint8Array(encodedpublicKey);
            let premasterSecret = _this.crypto.generatePMS();
            let toRandom = message.body.value;
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = receiverPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;
            chatKeys.keys.toRandom  = _this.crypto.decodeToUint8Array(toRandom);
            chatKeys.keys.premasterKey = premasterSecret;

            let concatKey = _this.crypto.concatPMSwithRandoms(premasterSecret, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

            return _this.crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            //generate the master key
          }).then((masterKey) => {
            chatKeys.keys.masterKey = masterKey;

            return _this.crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            //generate the symmetric and hash keys
          }).then((keys) => {

            chatKeys.keys.hypertyToSessionKey = new Uint8Array(keys[0]);
            chatKeys.keys.hypertyFromSessionKey = new Uint8Array(keys[1]);
            chatKeys.keys.hypertyToHashKey = new Uint8Array(keys[2]);
            chatKeys.keys.hypertyFromHashKey = new Uint8Array(keys[3]);
            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            let messageStructure = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate'
              }
            };

            // hash the value and the iv
            filteredMessage = _this._filterMessageToHash(messageStructure, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);
            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
          }).then((hash) => {
            value.hash = _this.crypto.encode(hash);

            //encrypt the data
            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok', iv);
          }).then((encryptedData) => {
            value.symetricEncryption = _this.crypto.encode(encryptedData);

            return _this.crypto.encryptRSA(chatKeys.hypertyTo.publicKey, chatKeys.keys.premasterKey);

          }).then((encryptedValue) => {

            value.assymetricEncryption = _this.crypto.encode(encryptedValue);

            let messageStructure = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate'
              }
            };

            let messageToHash = _this._filterMessageToHash(messageStructure, chatKeys.keys.premasterKey, chatKeys.hypertyFrom.messageInfo);

            return _this.crypto.signRSA(chatKeys.hypertyFrom.privateKey, _this.crypto.encode(chatKeys.handshakeHistory) + _this.crypto.encode(messageToHash));

          }).then(signature => {

            value.signature = _this.crypto.encode(signature);

            let receiverHelloMsg = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'senderCertificate',
                value: _this.crypto.encode(value)
              }
            };
            chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(receiverHelloMsg, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);

            resolve({message: receiverHelloMsg, chatKeys: chatKeys});

          }, error => reject(error));

          break;
        }
        case 'senderCertificate': {

          log.log('senderCertificate');
          let receivedValue = _this.crypto.decode(message.body.value);

          _this.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp).then((value) => {
            let encryptedPMS = _this.crypto.decodeToUint8Array(receivedValue.assymetricEncryption);

            //TODO remove later this verification as soon as all the IdP proxy are updated in the example
            let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

            let senderPublicKey = _this.crypto.decodeToUint8Array(encodedpublicKey);
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = senderPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;

            return _this.crypto.decryptRSA(chatKeys.hypertyFrom.privateKey, encryptedPMS);

          }, (error) => {
            // log.log(error);
            reject('Error during authentication of identity');

            //obtain the PremasterKey using the private key
          }).then(pms => {

            chatKeys.keys.premasterKey = new Uint8Array(pms);

            let signature = _this.crypto.decodeToUint8Array(receivedValue.signature);

            let receivedmsgToHash = _this._filterMessageToHash(message, chatKeys.keys.premasterKey);

            return _this.crypto.verifyRSA(chatKeys.hypertyTo.publicKey, _this.crypto.encode(chatKeys.handshakeHistory) + _this.crypto.encode(receivedmsgToHash), signature);

            // validates the signature received
          }).then(signValidationResult => {

            //log.log('SenderCertificate - signature validation result ', signValidationResult);
            let concatKey = _this.crypto.concatPMSwithRandoms(chatKeys.keys.premasterKey, chatKeys.keys.toRandom, chatKeys.keys.fromRandom);

            return _this.crypto.generateMasterSecret(concatKey, 'messageHistoric' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            // generates the master keys from the Premaster key and the randoms
          }).then(masterKey => {
            chatKeys.keys.masterKey = masterKey;

            return _this.crypto.generateKeys(masterKey, 'key expansion' + chatKeys.keys.toRandom + chatKeys.keys.fromRandom);

            // generates the symmetric keys to be used in the symmetric encryption
          }).then(keys => {
            chatKeys.keys.hypertyFromSessionKey = new Uint8Array(keys[0]);
            chatKeys.keys.hypertyToSessionKey = new Uint8Array(keys[1]);
            chatKeys.keys.hypertyFromHashKey = new Uint8Array(keys[2]);
            chatKeys.keys.hypertyToHashKey = new Uint8Array(keys[3]);
            iv = _this.crypto.decodeToUint8Array(receivedValue.iv);
            let data = _this.crypto.decodeToUint8Array(receivedValue.symetricEncryption);

            return _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv);

          }).then(decryptedData => {
            // log.log('decryptedData', decryptedData);

            chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(message, decryptedData + iv);

            let hashReceived = _this.crypto.decodeToUint8Array(receivedValue.hash);

            filteredMessage = _this._filterMessageToHash(message, decryptedData + iv);

            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, hashReceived);

          }).then(verifiedHash  => {

            // log.log('result of hash verification ', verifiedHash);
            let receiverFinishedMessage = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverFinishedMessage'
              }
            };
            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            filteredMessage = _this._filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);

            //log.log('TIAGO: doHandShakePhase verifiedHash');
            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
          }).then(hash => {

            value.hash = _this.crypto.encode(hash);
            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!', iv);

          }).then(encryptedValue => {
            value.value = _this.crypto.encode(encryptedValue);
            let receiverFinishedMessage = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverFinishedMessage',
                value: _this.crypto.encode(value)
              }
            };

            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);
            chatKeys.authenticated = true;
            resolve({message: receiverFinishedMessage, chatKeys: chatKeys});
          }).catch(err => {
            reject('On _doHandShakePhase from senderCertificate error: ' + err);
          });

          break;
        }
        case 'receiverFinishedMessage': {

          chatKeys.authenticated = true;

          value = _this.crypto.decode(message.body.value);

          iv = _this.crypto.decodeToUint8Array(value.iv);
          let data = _this.crypto.decodeToUint8Array(value.value);
          hash = _this.crypto.decodeToUint8Array(value.hash);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
            // log.log('decryptedData', decryptedData);
            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(message, decryptedData + iv);

            let filteredMessage = _this._filterMessageToHash(message, decryptedData + iv);
            _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, hash).then(result => {

              // check if there was an initial message that was blocked and send it
              if (chatKeys.initialMessage) {

                let initialMessage = {
                  type: 'create',
                  to: message.from,
                  from: message.to,
                  body: {
                    value: chatKeys.initialMessage.body.value
                  }
                };

                resolve({message: initialMessage, chatKeys: chatKeys});

                //sends the sessionKey to the subscriber hyperty
              } else {
                _this._sendReporterSessionKey(message, chatKeys).then(value => {

                  resolve(value);
                }).catch(err => {
                  reject('On _doHandShakePhase from receiverFinishedMessage error: ' + err);
                });
              }
            });
          });

          break;
        }

        case 'reporterSessionKey': {

          log.log('reporterSessionKey');

          let valueIVandHash = _this.crypto.decode(message.body.value);
          hash = _this.crypto.decodeToUint8Array(valueIVandHash.hash);
          iv = _this.crypto.decodeToUint8Array(valueIVandHash.iv);
          let encryptedValue = _this.crypto.decodeToUint8Array(valueIVandHash.value);
          let parsedValue;
          let sessionKey;
          let dataObjectURL;
          let receiverAcknowledgeMsg;

          //log.log('[IdentityModule reporterSessionKey] - decryptAES: ', chatKeys.keys.hypertyToSessionKey, encryptedValue, iv);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, encryptedValue, iv).then(decryptedValue => {

            parsedValue = _this.crypto.decode(decryptedValue);
            sessionKey = _this.crypto.decodeToUint8Array(parsedValue.value);
            dataObjectURL = parsedValue.dataObjectURL;

            let messageToHash = _this._filterMessageToHash(message, decryptedValue + iv);

            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, messageToHash, hash);

          }).then(hashResult => {


            // log.log('hash successfully validated ', hashResult);

            _this.dataObjectSessionKeys[dataObjectURL] =  {sessionKey: sessionKey, isToEncrypt: true};
            let dataObjectSessionKeysClone = _chatkeysToStringCloner(dataObjectURL, _this.dataObjectSessionKeys)
            _this.storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeysClone).catch(err => {
              reject('On _sendReporterSessionKey from method reporterSessionKey error: ' + err);
            });

            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!!', iv);
          }).then(encryptedValue => {

            receiverAcknowledgeMsg = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverAcknowledge'
              }
            };

            value.value = _this.crypto.encode(encryptedValue);
            let messageToHash = _this._filterMessageToHash(receiverAcknowledgeMsg, 'ok!!' + iv, chatKeys.hypertyFrom.messageInfo);

            return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, messageToHash);
          }).then(hashedMessage => {
            let finalValue = _this.crypto.encode({value: value.value, hash: _this.crypto.encode(hashedMessage), iv: value.iv});

            receiverAcknowledgeMsg.body.value = finalValue;
            resolve({message: receiverAcknowledgeMsg, chatKeys: chatKeys});
          }).catch(err => {
            reject('On _doHandShakePhase from reporterSessionKey error: ' + err);
          });

          break;
        }

        case 'receiverAcknowledge': {

          log.log('receiverAcknowledge');

          let receivedvalueIVandHash = _this.crypto.decode(message.body.value);
          let receivedHash = _this.crypto.decodeToUint8Array(receivedvalueIVandHash.hash);
          iv = _this.crypto.decodeToUint8Array(receivedvalueIVandHash.iv);
          let receivedEncryptedValue = _this.crypto.decodeToUint8Array(receivedvalueIVandHash.value);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, receivedEncryptedValue, iv).then(decryptedValue => {

            let filteredMessage = _this._filterMessageToHash(message, decryptedValue + iv);
            return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, receivedHash);
          }).then(hashResult => {
            // log.log('hashResult ', hashResult);

            let callback = chatKeys.callback;

            if (callback) {
              callback('handShakeEnd');
            }
            resolve('handShakeEnd');
          }).catch(err => {
            reject('On _doHandShakePhase from receiverAcknowledge error: ' + err);
          });

          break;
        }

        default:
          reject(message);
      }
    });
  }

  /**
  * filter the messages to hash, by removing some fields not generated by the runtime core
  * @param {Message}  message                     message
  * @param {String}  decryptedValue (Optional)    value from body.value in case it originally comes encrypted
  * @param {JSON}  identity(Optional)    add the hyperty identity associated in case is not added to the initial message
  * @return {Message}  new message filtered
  */
  _filterMessageToHash(message, decryptedValue, identity) {

    return {
      type: message.type,
      from: message.from,
      to: message.to,
      body: {
        identity: identity || message.body.identity,
        value: decryptedValue || message.body.value,
        handshakePhase: message.body.handshakePhase
      }
    };
  }

  /**
  * generates the initial structure for the keys between two users
  * @param {JSON}    message              initial message that triggers the mutual authentication
  * @param {String}  userURL              userURL
  * @param {boolean} receiver(Optional)  indicates if is the sender or the receiver that creates a new chat crypto
  * @return {JSON} newChatCrypto  new JSON structure for the chat crypto
  */
  _newChatCrypto(message, userURL, receiver) {
    let _this = this;

    //check whether is the sender or the receiver to create a new chatCrypto
    //to mantain consistency on the keys if the receiver create a new chatCrypto,
    //then invert the fields
    let from = (receiver) ? message.to : message.from;
    let to = (receiver) ? message.from : message.to;

    let userInfo = _this.getIdentity(userURL);

    let newChatCrypto =
      {
        hypertyFrom:
        {
          hyperty: from,
          userID: userInfo.messageInfo.userProfile.username,
          privateKey: userInfo.keyPair.private,
          publicKey: userInfo.keyPair.public,
          assertion: userInfo.assertion,
          messageInfo: userInfo.messageInfo
        },
        hypertyTo:
        {
          hyperty: to,
          userID: undefined,
          publicKey: undefined,
          assertion: undefined
        },
        keys:
        {
          hypertyToSessionKey: undefined,
          hypertyFromSessionKey: undefined,
          hypertyToHashKey: undefined,
          hypertyFromHashKey: undefined,
          toRandom: undefined,
          fromRandom: undefined,
          premasterKey: undefined,
          masterKey: undefined
        },
        handshakeHistory: {
          senderHello: undefined,
          receiverHello: undefined,
          senderCertificate: undefined,
          receiverFinishedMessage: undefined
        },
        initialMessage: (message.body.ignore) ? undefined : message,
        callback: message.callback,
        authenticated: false,
        dataObjectURL: message.dataObjectURL
      };

    return newChatCrypto;
  }

  _secondsSinceEpoch() {
    return Math.floor(Date.now() / 1000);
  }

  _parseMessageURL(URL) {
    let splitedToURL = URL.split('/');
    if (splitedToURL.length <= 6) {
      return splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3];
    } else {
      return splitedToURL[0] + '//' + splitedToURL[2] + '/' + splitedToURL[3] + '/' + splitedToURL[4];
    }
  }
}

function _chatkeysToStringCloner(chatKeysURL, chatKeys) {
  let dataObjectSessionKeysClone = Object.assign({}, chatKeys);
  if (dataObjectSessionKeysClone[chatKeysURL].sessionKey) {
    log.log('_chatkeysToStringCloner:keys', dataObjectSessionKeysClone[chatKeysURL].sessionKey);
    try {
      dataObjectSessionKeysClone[chatKeysURL].sessionKey = dataObjectSessionKeysClone[chatKeysURL].sessionKey.toString();
    } catch (err) {
      log.log('_chatkeysToStringCloner:err', err);
    }
  }
  return dataObjectSessionKeysClone;
}

function _chatkeysToArrayCloner(chatKeysURL, sessionKeys) {
  log.log('_chatkeysToArrayCloner', chatKeysURL, sessionKeys);
  if (sessionKeys) {
    log.log('_chatkeysToArrayCloner:insideIf', sessionKeys[chatKeysURL].sessionKey);
    try {
      sessionKeys[chatKeysURL].sessionKey = new Uint8Array(JSON.parse('[' + sessionKeys[chatKeysURL].sessionKey + ']'));
    } catch (err) {
      log.log('_chatkeysToArrayCloner:err', err);
    }
  }
  return sessionKeys;
}

//function logS(f1, f2) {
//  log.log(f1, JSON.stringify(util.inspect(f2)));
//}

export default IdentityModule;
