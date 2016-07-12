
import {divideURL, getUserURLFromEmail, getUserEmailFromURL} from '../utils/utils.js';
import Identity from './Identity';
import Crypto from './Crypto';

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
  constructor(runtimeURL) {
    let _this = this;

    if (!runtimeURL) throw new Error('runtimeURL is missing.');

    _this._runtimeURL = runtimeURL;
    _this._idmURL = runtimeURL + '/idm';

    _this._domain = divideURL(_this._runtimeURL).domain;

    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
    let newIdentity = new Identity('guid','HUMAN');
    _this.identity = newIdentity;
    _this.crypto = new Crypto();

    // hashTable to store all the crypto information between two hyperties
    _this.chatKeys = {};

  }

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

  /**
  * Function to return all the identities registered within a session by a user.
  * These identities are returned in an array containing a JSON package for each user identity.
  * @return {Array<Identities>}         Identities
  */
  getIdentities() {
    let _this = this;
    return _this.identities;
  }


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

  getIdentityOfHyperty(hypertyURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this.registry.getHypertyOwner(hypertyURL).then((userURL) => {

        for (let index in _this.identities) {
          let identity = _this.identities[index];
          if (identity.identity === userURL) {
            return resolve(identity.messageInfo);
          }
        }
      }, (err) => {
        reject(err);
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
    let _this = this;
    let users = [];

    //if request comes with the emailFormat option, then convert url to email format
    let converter = (emailFormat) ? getUserEmailFromURL : (value) => {return value;};

    for (let index in _this.identities) {
      let identity = _this.identities[index];
      users.push(converter(identity.identity));
    }
    return users;
  }

  /**
  * Function to return the selected Identity within a session
  * @return {Identity}        identity         identity
  */
  getCurrentIdentity() {
    let _this = this;
    return _this.currentIdentity;
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
  * Function to remove the an identity from the Identities array
  * @param {String}    userURL      userURL
  */
  deleteIdentity(userURL) {
    let _this = this;

    for (let identity in _this.identities) {
      if (_this.identities[identity].identity === userURL) {
        _this.identities.splice(identity, 1);
      }
    }
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

  /**
  * Function to login a user within the session, it will start the process to obtain an Identity from a user, including the request for an identity Assertion. The function returns a promise with the token received by the idpProxy.
  *
  * @param  {Identifier}      identifier      identifier
  * @param  {Scope}           scope           scope
  * @return {Promise}         Promise         IDToken containing the user information
  */
  loginWithRP(identifier, scope) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //TODO remove this verification and refactor this part
      _this.currentIdentity = undefined;
      _this.getIdentityAssertion('identifier', 'origin', 'hint', identifier).then(function(value) {
        console.log('loginWithRP');
        resolve(value);
      }, function(err) {
        console.log('loginWithRP err');
        reject(err);
      });
    });
  }

  /**
  * Function that fetch an identityAssertion from a user.
  *
  * @return {IdAssertion}              IdAssertion
  */
  getIdentityAssertion(identifier, origin, usernameHint, idpDomain) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      if (_this.currentIdentity !== undefined) {
        //TODO verify whether the token is still valid or not.
        // should be needed to make further requests, to obtain a valid token
        return resolve(_this.currentIdentity);
      } else {

        //CHECK whether is browser environment or nodejs
        //if it is browser, then create a fake identity

        try {
          if (window) {

            let publicKey;
            let userkeyPair;

            //generates the RSA key pair
            _this.crypto.generateRSAKeyPair().then(function(keyPair) {

              publicKey = btoa(keyPair.public);
              userkeyPair = keyPair;
              return _this.generateAssertion(publicKey, origin, '', userkeyPair, idpDomain);

            }).then(function(url) {
              return _this.generateAssertion(publicKey, origin, url, userkeyPair, idpDomain);

            }).then(function(value) {
              if (value) {
                resolve(value);
              } else {
                reject('Error on obtaining Identity');
              }
            }).catch(function(err) {
              console.log(err);
              reject(err);
            });
          }
        } catch (error) {
          console.log('getIdentityAssertion for nodejs');
          let randomNumber = Math.floor((Math.random() * 10000) + 1);
          let identityBundle = {
            assertion: 'assertion',
            idp:'nodejs',
            userProfile: {
            avatar: 'https://lh3.googleusercontent.com/-WaCrjVMMV-Q/AAAAAAAAAAI/AAAAAAAAAAs/8OlVqCpSB9c/photo.jpg',
            cn: 'test nodejs',
            username: 'nodejs-' + randomNumber + '@nodejs.com',
            userURL: 'user://nodejs.com/nodejs-' + randomNumber
          }};
          _this.currentIdentity = identityBundle;
          _this.identities.push(identityBundle);
          return resolve(identityBundle);
        }
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
    let _this = this;
    let domain = _this._resolveDomain(idpDomain);
    let message;

    console.log('generateAssertion');

    return new Promise(function(resolve,reject) {

      message = {type:'execute', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'generateAssertion', params: {contents: contents, origin: origin, usernameHint: usernameHint}}};

      _this._messageBus.postMessage(message, (res) => {
        let result = res.body.value;

        if (result.loginUrl) {

          //let msgOpenIframe = {type: 'execute', from: _this._idmURL, to: _this._runtimeURL + '/gui-manager', body: {method: 'unhideAdminPage'}};

          console.log('loginURL ', result.loginUrl);
          let win = window.open(result.loginUrl, 'openIDrequest', 'width=800, height=600');
          if (window.cordova) {
            win.addEventListener('loadstart', function(e) {
              let url = e.url;
              let code = /\&code=(.+)$/.exec(url);
              let error = /\&error=(.+)$/.exec(url);

              if (code || error) {
                win.close();
                resolve(url);
              }
            });
          } else {
            let pollTimer = setInterval(function() {
              try {
                if (win.closed) {
                  reject('Some error occured when trying to get identity.');
                  clearInterval(pollTimer);
                }

                if (win.document.URL.indexOf('id_token') !== -1 || win.document.URL.indexOf(location.origin) !== -1) {
                  window.clearInterval(pollTimer);
                  let url =   win.document.URL;

                  win.close();
                  resolve(url);
                }
              } catch (e) {
                //console.log(e);
              }
            }, 500);
          }
        } else if (result) {

          let assertionParsed = JSON.parse(atob(result.assertion));
          let idToken;

          //TODO remove the verification and remove the tokenIDJSON from the google idpProxy;
          if (assertionParsed.tokenIDJSON) {
            idToken = assertionParsed.tokenIDJSON;
          } else {
            idToken = assertionParsed;
          }

          if (idToken) {
            result.identity = getUserURLFromEmail(idToken.email);

            _this.identity.addIdentity(result);

            // check if exists any infoToken in the result received
            let infoToken = (result.infoToken) ? result.infoToken : {};
            let userProfileBundle = {username: idToken.email, cn: idToken.name, avatar: infoToken.picture, locale: infoToken.locale, userURL: getUserURLFromEmail(idToken.email)};

            //creation of a new JSON with the identity to send via messages
            let newIdentity = {userProfile: userProfileBundle, idp: result.idp.domain, assertion: result.assertion};
            result.messageInfo = newIdentity;
            result.keyPair = keyPair;

            _this.currentIdentity = newIdentity;
            _this.identities.push(result);
            resolve(newIdentity);

          }
        } else {
          reject('error on obtaining identity information');
        }

      });
    });
  }

  /**
  * OTHER USER'S IDENTITY
  */

  /**
  * Requests the IdpProxy from a given Domain to validate an IdentityAssertion
  * Returns a promise with the result from the validation.
  * @param  {DOMString} assertion
  * @param  {DOMString} origin       origin
  * @return {Promise}         Promise         promise with the result from the validation
  */
  validateAssertion(assertion, origin, idpDomain) {
    let _this = this;

    let domain = _this._resolveDomain(idpDomain);

    let message = {type:'EXECUTE', to: domain, from: _this._idmURL, body: {resource: 'identity', method: 'validateAssertion',
           params: {assertion: assertion, origin: origin}}};

    return new Promise(function(resolve, reject) {
      _this._messageBus.postMessage(message, (result) => {
        if (result.body.code === 200) {
          resolve(result.body.value);
        } else {
          reject('error', result.body.code);
        }
      });
    });
  }

  encryptMessage(message) {
    let _this = this;

    console.log('ENCRYPT MESSAGE ');

    return new Promise(function(resolve, reject) {

      resolve(message);
      /*_this._registry.getHypertyOwner(message.from).then(function(userURL) {

        let chatKeys = _this.chatKeys[message.to + message.from];
        if (!chatKeys) {
          chatKeys = _this._newChatCrypto(message, userURL);
          _this.chatKeys[message.to + message.from] = chatKeys;
          message.body.handshakePhase = 'startHandShake';
        }

        if (chatKeys.hypertyToSessionKey) {
          //TODO apply symmetric cypher
          resolve(message);

        } else {
          _this._handShakePhase(message, chatKeys).then(function(value) {
            _this.chatKeys[message.to + message.from] = value.chatKeys;
            resolve(value.message);
          });
        }

      }).catch(function(err) { reject(err); });*/
    });

  }

  decryptMessage(message) {
    let _this = this;

    console.log('DECRYPT MESSAGE ');

    return new Promise(function(resolve, reject) {

      resolve(message);

      /*_this._registry.getHypertyOwner(message.to).then(function(userURL) {

        let chatKeys = _this.chatKeys[message.from + message.to];
        if (!chatKeys) {
          chatKeys = _this._newChatCrypto(message, userURL, 'decrypt');
          _this.chatKeys[message.to + message.from] = chatKeys;
        }

        if (chatKeys.hypertyToSessionKey) {
          //TODO apply symmetric cypher
          resolve(message);

        } else {
          _this._handShakePhase(message, chatKeys).then(function(value) {
            _this.chatKeys[message.from + message.to] = value.chatKeys;
            resolve(value.message);
          });
        }
      }).catch(function(err) { reject(err); });*/
    });
  }

  _handShakePhase(message, chatKeys) {
    let _this = this;
    console.log('handshakeType');
    console.log(message);

    return new Promise(function(resolve,reject) {

      let handshakeType = message.body.handshakePhase;
      switch (handshakeType) {

        case 'startHandShake':
          /*message.type = 'handshake';
          message.body.handshakePhase = 'senderHello';
          chatKeys.keys.fromRandom = _this.crypto.generateRandom();
          message.body.random = chatKeys.keys.fromRandom;
          resolve({message: message, chatKeys: chatKeys});*/

          break;
        case 'senderHello':
          /*message.body.handshakePhase = 'receiverHello';
          chatKeys.keys.toRandom = _this.crypto.generateRandom();
          let msg = { type: 'handshake', to: message.from, from: message.to,
            body: { identity: chatKeys.messageInfo, random: chatKeys.keys.toRandom}};
          resolve({message: msg, chatKeys: chatKeys});*/

          break;
        case 'receiverHello':

          break;
        case 'senderCertificate':

          break;

        case 'receiverFinishedMessage':

          break;
        case 'senderFinishedMessage':

          break;
        default:

      }
    });
  }

  _applicationData(message) {
    let _this = this;
  }

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
      }
    };

    return newChatCrypto;
  }
}

export default IdentityModule;
