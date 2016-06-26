
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

    //stores the association of the dataObject and the Hyperty registered within
    _this.dataObjectsIdentity = {};

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
        if (!window) {
          let randomNumber = Math.floor((Math.random() * 10000) + 1);
          let identityBundle = {assertion: 'assertion', email: 'nodejs-' + randomNumber + '@nodejs.com', identity: 'user://nodejs-' + randomNumber, idp:'nodejs', infoToken: {
            email:'nodejs-' + randomNumber + '@nodejs.com'
          }};
          _this.currentIdentity = identityBundle;
          _this.identities.push(identityBundle);
          return resolve(identityBundle);
        } else {

          let publicKey;
          let userkeyPair;

          //generates the RSA key pair
          _this.crypto.generateRSAKeyPair().then(function(keyPair) {

            publicKey = _this.crypto.encode(keyPair.public);
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

      let isTypeOfUpdate = message.type === 'update';
      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';
      let isFromDataObject = _this.registry.isDataObjectURL(message.from);
      let isToDataObject = _this.registry.isDataObjectURL(message.to);
      let isFromRuntime = message.from.includes(_this._runtimeURL);
      let isToRuntime = message.to.includes(_this._runtimeURL);
      let ishandShakeType = message.type === 'handshake';

      if (isFromRuntime || isToRuntime ||
          message.to.includes('comm://') || message.from.includes('comm://') ||
          message.to.includes('hyperty://') || message.from.includes('hyperty://') && !ishandShakeType) {
        console.log('encryptMessage ignored');
        return resolve(message);
      }

      /*if (message.to.includes('comm://') && message.from.includes('hyperty://')) {
        _this._getHypertyFromDataObject(message.to).then(hypertyURL => {
          console.log('EHEHHE encrypt ', hypertyURL);
        });*/

      //resolve(message);
      _this._registry.getHypertyOwner(message.from).then(function(userURL) {

        // check if exists any keys between two users
        let chatKeys = _this.chatKeys[message.from + message.to];
        if (!chatKeys) {
          chatKeys = _this._newChatCrypto(message, userURL);
          console.log('createChatKey encrypt', message.from + message.to);
          _this.chatKeys[message.from + message.to] = chatKeys;
          message.body.handshakePhase = 'startHandShake';
        }

        if (chatKeys.authenticated && message.type !== 'handshake') {

          let iv = _this.crypto.generateIV();
          _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, message.body.value, iv).then(encryptedValue => {
            message.body.value = _this.crypto.encode(encryptedValue);
            message.body.iv = _this.crypto.encode(iv);
            console.log('Session keys created');
            resolve(message);
          });

        } else if (message.type === 'handshake') {
          console.log('else if');
          resolve(message);
        } else {
          console.log('else');
          _this._doHandShakePhase(message, chatKeys).then(function(value) {
            _this.chatKeys[message.from + message.to] = value.chatKeys;

            _this._messageBus.postMessage(value.message);
            reject('encrypt handshake protocol phase ', message.id);
          });
        }

      });
    });

  }

  decryptMessage(message) {
    let _this = this;

    console.log('DECRYPT MESSAGE ');

    return new Promise(function(resolve, reject) {

      let isFromHyperty = divideURL(message.from).type === 'hyperty';
      let isToHyperty = divideURL(message.to).type === 'hyperty';
      let isFromDataObject = _this.registry.isDataObjectURL(message.from);
      let isToDataObject = _this.registry.isDataObjectURL(message.to);
      let isFromRuntime = message.from.includes(_this._runtimeURL);
      let isToRuntime = message.to.includes(_this._runtimeURL);
      let ishandShakeType = message.type === 'handshake';

      if ((message.to.includes(_this._runtimeURL) || message.from.includes(_this._runtimeURL) ||
          message.to.includes('comm://') || message.from.includes('comm://') ||
          message.to.includes('hyperty://') || message.from.includes('hyperty://')) && message.type !== 'handshake') {
        console.log('decryptMessage ignored');

        if (message.to.includes('comm://') && message.from.includes('hyperty://')) {
          _this._getHypertyFromDataObject(message.to).then(hypertyURL => {
            console.log('DECRYPT ChatCommunication? ', hypertyURL);
          });
        }
        return resolve(message);
      }

      //resolve(message);

      _this._registry.getHypertyOwner(message.to).then(function(userURL) {

        let chatKeys = _this.chatKeys[message.to + message.from];
        if (!chatKeys) {
          chatKeys = _this._newChatCrypto(message, userURL, 'decrypt');
          console.log('createChatKey decrypt', message.to + message.from);
          _this.chatKeys[message.to + message.from] = chatKeys;
        }

        if (chatKeys.authenticated && message.type !== 'handshake') {
          //TODO apply symmetric cypher
          console.log('Session keys created, decrypt');

          let iv = _this.crypto.decode(message.body.iv);
          let data = _this.crypto.decode(message.body.value);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decrytedData => {
            message.body.value = decrytedData;
          });

          resolve(message);

        } else {
          _this._doHandShakePhase(message, chatKeys).then(function(value) {

            if (value === 'handShakeEnd') {
              reject('decrypt handshake protocol phase ');

            } else {
              _this.chatKeys[message.to + message.from] = value.chatKeys;
              _this._messageBus.postMessage(value.message);
              reject('decrypt handshake protocol phase ');
            }
          });
        }
      }, function(rej) {
        // TODO review this logic
        resolve(rej);
      }).catch(function(err) { reject(err); });
    });
  }

  doMutualAuthentication(sender, receiver) {
    let _this = this;

    let reporterURL = _this.registry.getReporterURLSynchonous(sender);
    if (reporterURL) {
      sender = reporterURL;
    }

    let msg = {
      to: receiver,
      from: sender,
      callback: undefined,
      body: {handshakePhase: 'startHandShake', ignore: 'ignoreMessage'}
    };

    return new Promise(function(resolve, reject) {
      let chatKeys = _this.chatKeys[sender + receiver];
      _this._registry.getHypertyOwner(sender).then(function(userURL) {

        if (!chatKeys) {
          console.log('createChatKey mutual', sender + receiver);

          let resolved = function(value) {
            resolve(value);
          };
          msg.callback = resolved;

          chatKeys = _this._newChatCrypto(msg, userURL);
          _this.chatKeys[sender + receiver] = chatKeys;
        }

        if (chatKeys.authenticated) {
          console.log('mutual authentication already done');

          resolve('mutual authentication succeeded');
        } else {

          _this._doHandShakePhase(msg, chatKeys);
        }
      });
    });

  }

  /**
  * returns the reporter associated to the dataObject URL
  * @param   {String}   dataObjectURL         dataObject url
  * @return   {String}  reporter              dataObject url reporter
  */
  _getHypertyFromDataObject(dataObjectURL) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let splitedURL = dataObjectURL.split('/');
      let finalURL = splitedURL[0] + '//' + splitedURL[2] + '/' + splitedURL[3];

      // check if is the creator of the hyperty
      let reporterURL = _this.registry.getReporterURLSynchonous(finalURL);

      if (reporterURL) {
        resolve(reporterURL);
      } else {

        // check if there is already an association from an hypertyURL to the dataObject
        let storedReporterURL = _this.dataObjectsIdentity[finalURL];

        if (storedReporterURL) {
          resolve(storedReporterURL);
        } else {

          // check if there is any hyperty that subscribed the dataObjectURL
          let subscriberHyperty = _this.registry.getDataObjectSubscriberHyperty(dataObjectURL);

          if (subscriberHyperty) {
            resolve(subscriberHyperty);
          } else {

            // search in domain registry for the hyperty associated to the dataObject
            // search in case is a subscriber who wants to know the reporter
            _this.registry.discoverDataObjectPerURL(finalURL, splitedURL[2]).then(dataObject => {
              _this.dataObjectsIdentity[finalURL] = dataObject.reporter;
              resolve(dataObject.reporter);
            }, err => {
              reject(err);
            });
          }
        }
      }
    });
  }

  _doHandShakePhase(message, chatKeys) {
    let _this = this;
    console.log('handshakeType');
    console.log(message);

    return new Promise(function(resolve,reject) {

      let handshakeType = message.body.handshakePhase;
      let iv;
      let value = {};
      switch (handshakeType) {

        case 'startHandShake':
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
          if (chatKeys.initialMessage) {resolve({message: startHandShakeMsg, chatKeys: chatKeys});
          } else {
            _this.chatKeys[message.from + message.to] = chatKeys;
            _this._messageBus.postMessage(startHandShakeMsg);
          }

          break;
        case 'senderHello':
          console.log('senderHello');
          chatKeys.handshakeHistory.senderHello = _this._filterMessageToHash(message);
          chatKeys.keys.fromRandom = _this.crypto.decode(message.body.value);
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

        case 'receiverHello':
          console.log('receiverHello');
          chatKeys.handshakeHistory.receiverHello = _this._filterMessageToHash(message);

          _this.validateAssertion(message.body.identity.assertion).then((value) => {

            //TODO send a signature

            let receiverPublicKey = _this.crypto.decode(value.contents.nonce);
            let premasterSecret = _this.crypto.generatePMS();
            let toRandom = message.body.value;
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = receiverPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;
            chatKeys.keys.toRandom  = _this.crypto.decode(toRandom);
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

            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok', iv);

            //encrypt the data
          }).then((encryptedData) => {

            _this.crypto.encryptRSA(chatKeys.hypertyTo.publicKey, chatKeys.keys.premasterKey).then((encryptedValue) => {
              console.log('encrypted', encryptedValue);
              let receiverHelloMsg = {
                 type: 'handshake',
                 to: message.from,
                 from: message.to,
                 body: {
                   handshakePhase: 'senderCertificate',
                   value: _this.crypto.encode(encryptedValue),
                   encryptedData: _this.crypto.encode(encryptedData),
                   iv: _this.crypto.encode(iv)
                 }
               };
              chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(receiverHelloMsg, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);
              resolve({message: receiverHelloMsg, chatKeys: chatKeys});
            });
          }, (error) => {
            console.log(error);
            reject('Error during authentication of identity');
          });

          break;
        case 'senderCertificate':
          console.log('senderCertificate');

          _this.validateAssertion(message.body.identity.assertion).then((value) => {
            //TODO verify the signature
            let encrypted = _this.crypto.decode(message.body.value);
            let senderPublicKey = _this.crypto.decode(value.contents.nonce);
            chatKeys.hypertyTo.assertion = message.body.identity.assertion;
            chatKeys.hypertyTo.publicKey = senderPublicKey;
            chatKeys.hypertyTo.userID    = value.contents.email;

            return _this.crypto.decryptRSA(chatKeys.hypertyFrom.privateKey, encrypted);

          }, (error) => {
            console.log(error);
            reject('Error during authentication of identity');

            //obtain the PremasterKey using the private key
          }).then(pms => {

            chatKeys.keys.premasterKey = new Uint8Array(pms);
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
            iv = _this.crypto.decode(message.body.iv);
            let data = _this.crypto.decode(message.body.encryptedData);

            return _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv);

          }).then(decryptedData => {
            console.log('decryptedData', decryptedData);
            chatKeys.handshakeHistory.senderCertificate = _this._filterMessageToHash(message, decryptedData + iv);

            iv = _this.crypto.generateIV();
            value.iv = _this.crypto.encode(iv);

            return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!', iv);

          }).then(encryptedValue => {
            value.value = _this.crypto.encode(encryptedValue);
            let receiverFinishedMessage = {
              type: 'handshake',
              to: message.from,
              from: message.to,
              body: {
                handshakePhase: 'receiverFinishedMessage',
                value: btoa(JSON.stringify(value))
              }
            };

            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);
            chatKeys.authenticated = true;
            resolve({message: receiverFinishedMessage, chatKeys: chatKeys});
          });

          break;
        case 'receiverFinishedMessage':
          console.log('receiverFinishedMessage');
          chatKeys.authenticated = true;

          value = JSON.parse(atob(message.body.value));

          iv = _this.crypto.decode(value.iv);
          let data = _this.crypto.decode(value.value);

          _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
            console.log('decryptedData', decryptedData);
            chatKeys.handshakeHistory.receiverFinishedMessage = _this._filterMessageToHash(message, decryptedData + iv);

            // check if there is an initial message that was blocked and is to send, or not
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
            } else {
              let callback = chatKeys.callback;
              console.log('callback worked?');
              callback('handShakeEnd');
              resolve('handShakeEnd');
            }
          });
          break;

        default:

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
      to:   message.to,
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
      authenticated: false
    };

    return newChatCrypto;
  }
}

export default IdentityModule;
