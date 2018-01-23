// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('CryptoManager');
import HandShakeProtocol from './HandShakeProtocol';

import {divideURL, isDataObjectURL, isLegacy, chatkeysToStringCloner, chatkeysToArrayCloner, parseMessageURL,
  parse, stringify, encode, decode, decodeToUint8Array, filterMessageToHash} from '../utils/utils.js';

import Crypto from './Crypto';

/**
*  The Crypto Manager provides manages cryptographic features for the runtime including:
*  - Mutual Authentication between peers
*  - Crypto Keys
*  - e2e encryption and decription of communication between Hyperties and dta objects
*
*/
class CryptoManager {

  /**
  * This is the constructor to initialise the CryptoManager, it does not require any input.
  * The init() must called in order to set mandatories attributes
  */

  constructor(storageManager) {
    this.storageManager = storageManager;
    this.userDefaultKeyRef = 'userAsymmetricKey';
  }

  init(runtimeURL, runtimeCapabilities, storageManager, dataObjectsStorage, registry, coreDiscovery, idm, runtimeFactory) {
    let _this = this;

    if (!runtimeURL) throw new Error('[] runtimeURL is missing.');
    if (!storageManager) throw new Error('storageManager is missing');
    if (!runtimeFactory) throw new Error('runtimeFactory is missing');

    _this._runtimeURL = runtimeURL;
    _this._cryptoManagerURL = _this._runtimeURL + '/cryptoManager';

    //_this._myURL = _this._runtimeURL + '/crypto';
    _this.storageManager = storageManager;
    _this.dataObjectsStorage = dataObjectsStorage;
    _this.runtimeCapabilities = runtimeCapabilities;

    _this._runtimeFactory = runtimeFactory;
    _this._domain = divideURL(_this._runtimeURL).domain;
    _this.chatKeys = {};
    _this._idm = idm;

    _this.dataObjectSessionKeys = {};
    _this.crypto = new Crypto(_this._runtimeFactory);
    _this.handShakeProtocol = new HandShakeProtocol(_this.chatKeys, _this.crypto, _this._idm,
                                                    _this.dataObjectSessionKeys, _this.storageManager);

    //failsafe to enable/disable all the criptographic functions
    _this.isToUseEncryption = true;

    _this._registry = registry;
    _this._coreDiscovery = coreDiscovery;
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

    _this.addCryptoGUIListeners();
  }

  /**
  * return the coreDiscovery component
  */
  get coreDiscovery() {
    let _this = this;
    return _this._coreDiscovery;
  }

  /**
  * return user's public key
  */

  /*  getMyPublicKey() {
    // to be implemented

    return new Promise((resolve)=> {
      resolve('mypublickey');

    });
  }
*/
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


  // to be used to initialise IDM with SessionKeys used in previous session

  loadSessionKeys() {
    let _this = this;
    return new Promise((resolve) => {

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        if (sessionKeys) _this.dataObjectSessionKeys = sessionKeys;
        else _this.dataObjectSessionKeys = {};
        resolve();
      });
    });
  }

  _isFromRemoteSM(from) {
    let splitFrom = from.split('://');
    return splitFrom[0] === 'runtime' && from !== this._runtimeURL + '/sm';
  }

  addCryptoGUIListeners() {
    //TODO: Change the GUI invocation of this method
    let _this = this;

    _this._messageBus.addListener(_this._cryptoManagerURL, (msg) => {
      let funcName = msg.body.method;

      //let returnedValue;
      if (funcName === 'generateRSAKeyPair') {
        _this._crypto.getMyPublicKey().then((key) => {
          let value = {type: 'execute', value: key, code: 200};
          let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
          try {
            _this._messageBus.postMessage(replyMsg);
          } catch (err) {
            log.error('On addGUIListeners from if generateRSAKeyPair method postMessage error: ' + err);
          }
        });
        return;
      }

    });
  }


  //******************* ENCRYPTION METHODS *******************
  /**
* Identifies the messages to be encrypted
* @param {Message}    message
* @returns {boolean}  returns true if the message requires encryption
*/

  _isToEncrypt(message) {
    log.info('[CryptoManager.istoChyperModule]', message);
    let isCreate = message.type === 'create';
    let isFromHyperty = message.from.includes('hyperty://');
    let isToHyperty = message.to.includes('hyperty://');
    let isToDataObject = isDataObjectURL(message.to);

    let doMutualAuthentication = message.body.hasOwnProperty('mutual') ? message.body.mutual : true;

    if (!doMutualAuthentication) return false;

    //if is not to apply encryption, then returns resolve
    if (!this.isToUseEncryption && !(message.type === 'handshake')) {
      log.info('not handshake: encryption disabled');
      return false;
    }

    if (message.type === 'update') {
      log.info('update:encryption disabled');
      return false;
    }

    if (isLegacy(message.to)) return false;

    return ((isCreate && isFromHyperty && isToHyperty) || (isCreate && isFromHyperty && isToDataObject && doMutualAuthentication) || message.type === 'handshake' || (message.type === 'update' && doMutualAuthentication));
  }


  _isToDecrypt(message) {
    let _this = this;


    return new Promise((resolve, reject) => {
      // For sybscribe message let's start the mutualAuthentication
      let isSubscription = message.type === 'subscribe';
      let isFromRemoteSM = _this._isFromRemoteSM(message.from);

      if (isSubscription & isFromRemoteSM) {
        log.log('_doMutualAuthenticationPhase1');

        _this._doMutualAuthenticationPhase1(message).then(() => {
          resolve(false);
        }, (error) => {
          reject(error);
        });

      } else if (message.hasOwnProperty('body') && message.body.hasOwnProperty('value') && typeof message.body.value === 'string') {
        log.log('_isToDecrypt:true');
        resolve(true);
      } else {
        log.log('_isToDecrypt:false');
        resolve(false);
      }

    }).catch((error) => {
      log.error('[CryptoManager._isToDecrypt]', error);
    });

  }

  encryptMessage(message) {
    //log.info('encryptMessage:message', message);
    let _this = this;

    log.log('encrypt message ');

    return new Promise(function(resolve, reject) {

      let isHandShakeType = message.type === 'handshake';

      //if is not to apply encryption, then returns resolve
      if (!_this._isToEncrypt(message)) {
        // log.log('decryption disabled');
        return resolve(message);
      }

      let dataObjectURL = parseMessageURL(message.to);

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
            _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, stringify(message.body.value), iv).then(encryptedValue => {

              let filteredMessage = filterMessageToHash(message, stringify(message.body.value) +
                                                                        stringify(iv), chatKeys.hypertyFrom.messageInfo);

              _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage).then(hash => {
                //log.log('result of hash ', hash);
                let value = {iv: encode(iv), value: encode(encryptedValue), hash: encode(hash)};
                message.body.value = encode(value);

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
          sessionKeys = chatkeysToArrayCloner(sessionKeys || {});
          let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

          _this.dataObjectsStorage.getDataObject(dataObjectURL).then((isHypertyReporter) => {
            //if no key exists, create a new one if is the reporter of dataObject
            if (!dataObjectKey) {
              // if the hyperty is the reporter of the dataObject then generates a session key
              if (isHypertyReporter.reporter && isHypertyReporter.reporter === message.from) {

                let sessionKey = _this.crypto.generateRandom();
                _this.dataObjectSessionKeys[dataObjectURL] = {sessionKey: sessionKey, isToEncrypt: true};
                let dataObjectSessionKeysClone = chatkeysToStringCloner(_this.dataObjectSessionKeys);

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
                let stringifiedIV = stringify(iv);
                let stringifiedMessageBody = stringify(message.body.value);

                _this.crypto.encryptAES(dataObjectKey.sessionKey, stringifiedMessageBody, iv).then(encryptedValue => {
                  delete message.body.identity.assertion; //TODO: Check why assertion is comming on the message!
                  delete message.body.identity.expires; //TODO: Check why expires is comming on the message!
                  let filteredMessage = filterMessageToHash(message, stringifiedMessageBody + stringifiedIV);

                  _this.crypto.hashHMAC(dataObjectKey.sessionKey, filteredMessage).then(hash => {
                    // log.log('hash ', hash);

                    let newValue = {value: encode(encryptedValue), iv: encode(iv), hash: encode(hash)};

                    message.body.value = stringify(newValue);
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
      log.info('dataObject value to encrypt: ', dataObject);

      let dataObjectURL = parseMessageURL(sender);

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        sessionKeys = chatkeysToArrayCloner(sessionKeys || {});
        let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

        //check if there is already a session key for the chat room
        if (dataObjectKey) {

          // and if is to apply encryption, encrypt the messages
          if (dataObjectKey.isToEncrypt) {
            let iv = _this.crypto.generateIV();

            _this.crypto.encryptAES(dataObjectKey.sessionKey, stringify(dataObject), iv).then(encryptedValue => {
              let newValue = { value: encode(encryptedValue), iv: encode(iv) };

              //log.log('encrypted dataObject', newValue);
              return resolve(newValue);
            }).catch(err => { reject('On encryptDataObject from method encryptAES error: ' + err); });

          // if not, just send the message
          } else {
            log.info('The dataObject is not encrypted');
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

      _this._isToDecrypt(message).then((isToDecrypt) => {

        //if is not to apply encryption, then returns resolve
        if (!isToDecrypt) return resolve(message);

        let dataObjectURL = parseMessageURL(message.to);

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
              let value = decode(message.body.value);
              let iv = decodeToUint8Array(value.iv);
              let data = decodeToUint8Array(value.value);
              let hash = decodeToUint8Array(value.hash);
              _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
                // log.log('decrypted value ', decryptedData);
                message.body.value = decryptedData;

                let filteredMessage = filterMessageToHash(message, decryptedData + iv);

                _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, hash).then(result => {
                  log.log('Result of hash verification in decryptMessage: ', result);
                  message.body.assertedIdentity = true;
                  resolve(message);
                }).chatch(err => {
                  console.log('decryptMessage HMAC failed:', err);
                  throw err;
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
            sessionKeys = chatkeysToArrayCloner(sessionKeys || {});
            let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

            if (dataObjectKey) {

              //check if is to apply encryption
              if (dataObjectKey.isToEncrypt) {
                let parsedValue = parse(message.body.value);
                let iv = decodeToUint8Array(parsedValue.iv);
                let encryptedValue = decodeToUint8Array(parsedValue.value);
                let hash = decodeToUint8Array(parsedValue.hash);

                _this.crypto.decryptAES(dataObjectKey.sessionKey, encryptedValue, iv).then(decryptedValue => {
                  let parsedValue = parse(decryptedValue);

                  // log.log('decrypted Value,', parsedValue);
                  message.body.value = parsedValue;

                  let filteredMessage = filterMessageToHash(message, stringify(parsedValue) + stringify(iv));

                  _this.crypto.verifyHMAC(dataObjectKey.sessionKey, filteredMessage, hash).then(result => {
                    log.log('Received message HMAC result', result);

                    message.body.assertedIdentity = true;
                    resolve(message);
                  }).catch(err => { reject('Message HMAC is invalid: ' + err); });
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

      let dataObjectURL = parseMessageURL(sender);

      // log.log('dataObject value to decrypt: ', dataObject);

      _this.storageManager.get('dataObjectSessionKeys').then((sessionKeys) => {
        sessionKeys = chatkeysToArrayCloner(sessionKeys);
        let dataObjectKey = sessionKeys ? sessionKeys[dataObjectURL] : null;

        if (dataObjectKey) {

          //check if is to apply encryption
          if (dataObjectKey.isToEncrypt) {
            let iv = decodeToUint8Array(dataObject.iv);
            let encryptedValue = decodeToUint8Array(dataObject.value);

            _this.crypto.decryptAES(dataObjectKey.sessionKey, encryptedValue, iv).then(decryptedValue => {
              let parsedValue = parse(decryptedValue);
              let newValue = { value: parsedValue, iv: encode(iv) };

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

  _doMutualAuthenticationPhase1(message) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      let to = message.to.split('/');

      //let subsIndex = to.indexOf('subscription');
      //let isDataObjectSubscription = subsIndex !== -1;
      to.pop();
      let dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
      _this._doMutualAuthenticationPhase2(dataObjectURL, message.body.subscriber).then(() => {
        _this._registry.registerSubscriber(dataObjectURL, message.body.subscriber);
        resolve();
      }, (error) => {
        reject(error);
      });
    });
  }

  _doMutualAuthenticationPhase2(sender, receiver) {
    log.info('doMutualAuthentication:sender ', sender);
    log.info('doMutualAuthentication:receiver ', receiver);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dataObjectURL;

      // check if the sender is a dataObject and if so stores that value
      let reporterURL = _this._registry.getReporterURLSynchonous(sender);
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


  /**
  * returns the reporter associated to the dataObject URL
  * @param   {String}   dataObjectURL         dataObject url
  * @return   {String}  reporter              dataObject url reporter
  */
  /*  _getHypertyFromDataObject(dataObjectURL) {
    log.info('_getHypertyFromDataObject:dataObjectURL', dataObjectURL);
    let _this = this;

    return new Promise(function(resolve, reject) {

      let splitedURL = divideURL(dataObjectURL);
      let domain = splitedURL.domain;
      let finalURL = _this._parseMessageURL(dataObjectURL);

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
  }*/

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

        let dataObjectSessionKeysClone = chatkeysToStringCloner(_this.dataObjectSessionKeys);

        _this.storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeysClone).catch(err => {
          reject('On _sendReporterSessionKey from method storageManager.set(dataObjectSessionKeys...) error: ' + err);
        });

      } else {
        sessionKey = sessionKeyBundle.sessionKey;
      }

      try {
        valueToEncrypt = encode({value: encode(sessionKey), dataObjectURL: chatKeys.dataObjectURL});
      } catch (err) {
        return reject('On _sendReporterSessionKey from method storageManager.set error valueToEncrypt: ' + err);
      }

      iv = _this.crypto.generateIV();
      value.iv = encode(iv);
      _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, valueToEncrypt, iv).then(encryptedValue => {

        reporterSessionKeyMsg = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'reporterSessionKey',
            value: encode(encryptedValue)
          }
        };

        let filteredMessage = filterMessageToHash(reporterSessionKeyMsg, valueToEncrypt + iv, chatKeys.hypertyFrom.messageInfo);

        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
      }).then(hashedMessage => {
        let valueWithHash = encode({value: reporterSessionKeyMsg.body.value, hash: encode(hashedMessage), iv: value.iv});

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

      console.info('handshake phase: ', handshakeType);

      switch (handshakeType) {

        case 'startHandShake':
          _this.handShakeProtocol.startHandShake(message, chatKeys).then(result => {
            if (result.postToBus) {
              _this._messageBus.postMessage(result.message);
            } else {
              resolve({message: result.message, chatKeys: result.chatKeys});
            }
          });
          break;

        case 'senderHello':
          _this.handShakeProtocol.senderHello(message, chatKeys).then(result => { resolve(result); });
          break;

        case 'receiverHello':
          _this.getMyPrivateKey().then(privateKey =>{
            _this.handShakeProtocol.receiverHello(message, chatKeys, privateKey).then(result => { resolve(result); })
              .catch(err => { reject(err); });
          });
          break;

        case 'senderCertificate':
          _this.getMyPrivateKey().then(privateKey =>{
            _this.handShakeProtocol.senderCertificate(message, chatKeys, privateKey).then(result => { resolve(result); })
              .catch(err => { reject(err); });
          });
          break;

        case 'receiverFinishedMessage':
          _this.handShakeProtocol.receiverFinishedMessage(message, chatKeys).then(result => {
            if (result.sendReporterSessionKey) {
              _this._sendReporterSessionKey(result.message, result.chatKeys).then(value => {
                resolve(value);
              });
            } else {
              resolve({message: result.message, chatKeys: result.chatKeys});
            }
          }).catch(err => { reject(err); });
          break;

        case 'reporterSessionKey': {
          _this.handShakeProtocol.reporterSessionKey(message, chatKeys).then(result => { resolve(result); })
            .catch(err => { reject(err); });
          break;
        }

        case 'receiverAcknowledge': {
          _this.handShakeProtocol.receiverAcknowledge(message, chatKeys).then(result => { resolve(result); })
            .catch(err => { reject(err); });
          break;
        }

        default:
          reject(message);
      }
    });
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

    let userInfo = _this._idm.getIdentity(userURL);

    let newChatCrypto =
      {
        hypertyFrom:
        {
          hyperty: from,
          userID: userInfo.userProfile.userURL,

          //privateKey: "getMyPublicKey",
          //publicKey: "getMyPrivateKey",
          assertion: userInfo.assertion,
          messageInfo: userInfo
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

  /**
  * Retrieves a public keys given a user refrence. If no key is found,
  generates a new key asymmetric key and retrieves the public keys.
  * @param   {userRef}    String    user reference for the key pair
  * @return  {Array}   public key
  */
  getMyPublicKey(userRef = this.userDefaultKeyRef) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.storageManager.get(userRef).then(storedKeyPair => {
        if (storedKeyPair) {
          return resolve(storedKeyPair.public);
        }
        _this._generateAndStoreNewAsymetricKey(userRef).then(generatedKeyPair => {
          resolve(generatedKeyPair.public);
        }).catch(err => {
          log.error('[getMyPublicKey:_generateAndStoreNewAsymetricKey:err]: ' + err.message);
          reject(err);
        });
      }).catch(err => {
        log.error('[getMyPublicKey:storageManager:err]: ' + err.message);
        reject(err);
      });
    });
  }

  /**
  * Retrieves a private keys given a user refrence. If no key is found,
  generates a new key asymmetric key and retrieves the private key.
  * @param   {userRef}    String    user reference for the key pair
  * @return  {Array}   private key
  **/
  getMyPrivateKey(userRef = this.userDefaultKeyRef) {
    let _this = this;
    return new Promise((resolve, reject) => {
      _this.storageManager.get(userRef).then(storedKeyPair => {
        if (storedKeyPair) {
          return resolve(storedKeyPair.private);
        }
        _this._generateAndStoreNewAsymetricKey(userRef).then(generatedKeyPair => {
          resolve(generatedKeyPair.private);
        }).catch(err => {
          log.error('[getMyPrivateKey:_generateAndStoreNewAsymetricKey:err]: ' + err.message);
          reject(err);
        });
      }).catch(err => {
        log.error('[getMyPrivateKey:storageManager:err]: ' + err.message);
        reject(err);
      });
    });
  }


  /**
  * Generates a new key pair, stores and retrives the key pair.
  * @param   {userRef}    String    user reference for the key pair
  * @return  {Array}   private key
  **/
  _generateAndStoreNewAsymetricKey(userRef) {
    let _this = this;
    let keyPair = undefined;
    return new Promise((resolve, reject) => {
      _this.crypto.generateRSAKeyPair().then(generatedKeyPair => {
        log.log('_generateAndStoreNewAsymetricKey:userAsymmetricKeyGenerated', generatedKeyPair);
        keyPair = generatedKeyPair;
        return _this.storageManager.set(userRef, 0, generatedKeyPair);
      }).then(storedReference => {
        log.log('_generateAndStoreNewAsymetricKey:userAsymmetricKeySuccess', storedReference);
        resolve(keyPair);
      }).catch(err => {
        log.error('[_generateAndStoreNewAsymetricKey:err]: ' + err.message);
        reject(err);
      });
    });
  }

}

/*
const nodeJSKeyPairPopulate = { public: [48, 130, 1, 34, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 3, 130, 1, 15, 0, 48, 130, 1, 10, 2, 130, 1, 1, 0, 228, 43, 101, 12, 121, 7, 157, 71, 81, 58, 219, 32, 10, 108, 193, 179, 212, 116, 255, 59, 217, 32, 161, 201, 53, 171, 226, 199, 137, 202, 171, 60, 82, 53, 125, 62, 177, 126, 165, 24, 141, 30, 15, 226, 59, 107, 34, 7, 13, 149, 112, 125, 10, 230, 191, 156, 164, 177, 10, 185, 13, 66, 3, 217, 166, 244, 90, 119, 111, 27, 145, 104, 71, 189, 166, 226, 255, 133, 83, 151, 231, 101, 151, 89, 22, 19, 65, 154, 10, 53, 208, 218, 252, 219, 37, 50, 212, 86, 145, 107, 132, 90, 233, 202, 227, 108, 114, 141, 29, 73, 187, 31, 13, 234, 0, 232, 24, 191, 35, 149, 179, 138, 214, 159, 245, 162, 148, 221, 118, 17, 105, 89, 151, 146, 209, 55, 236, 61, 143, 233, 228, 10, 115, 8, 81, 197, 45, 123, 187, 223, 176, 254, 165, 69, 143, 29, 100, 114, 17, 130, 226, 223, 33, 11, 240, 81, 61, 172, 191, 157, 246, 202, 87, 131, 221, 88, 48, 127, 159, 119, 160, 152, 117, 61, 253, 174, 65, 214, 203, 218, 63, 50, 78, 160, 181, 221, 211, 128, 70, 178, 191, 170, 0, 13, 122, 173, 12, 203, 252, 4, 184, 225, 252, 7, 62, 96, 116, 15, 216, 158, 55, 85, 48, 16, 9, 206, 119, 74, 112, 243, 136, 84, 184, 223, 254, 101, 91, 61, 10, 91, 85, 192, 147, 144, 57, 29, 66, 238, 199, 244, 193, 194, 150, 232, 200, 107, 2, 3, 1, 0, 1],
  private: [48, 130, 4, 191, 2, 1, 0, 48, 13, 6, 9, 42, 134, 72, 134, 247, 13, 1, 1, 1, 5, 0, 4, 130, 4, 169, 48, 130, 4, 165, 2, 1, 0, 2, 130, 1, 1, 0, 228, 43, 101, 12, 121, 7, 157, 71, 81, 58, 219, 32, 10, 108, 193, 179, 212, 116, 255, 59, 217, 32, 161, 201, 53, 171, 226, 199, 137, 202, 171, 60, 82, 53, 125, 62, 177, 126, 165, 24, 141, 30, 15, 226, 59, 107, 34, 7, 13, 149, 112, 125, 10, 230, 191, 156, 164, 177, 10, 185, 13, 66, 3, 217, 166, 244, 90, 119, 111, 27, 145, 104, 71, 189, 166, 226, 255, 133, 83, 151, 231, 101, 151, 89, 22, 19, 65, 154, 10, 53, 208, 218, 252, 219, 37, 50, 212, 86, 145, 107, 132, 90, 233, 202, 227, 108, 114, 141, 29, 73, 187, 31, 13, 234, 0, 232, 24, 191, 35, 149, 179, 138, 214, 159, 245, 162, 148, 221, 118, 17, 105, 89, 151, 146, 209, 55, 236, 61, 143, 233, 228, 10, 115, 8, 81, 197, 45, 123, 187, 223, 176, 254, 165, 69, 143, 29, 100, 114, 17, 130, 226, 223, 33, 11, 240, 81, 61, 172, 191, 157, 246, 202, 87, 131, 221, 88, 48, 127, 159, 119, 160, 152, 117, 61, 253, 174, 65, 214, 203, 218, 63, 50, 78, 160, 181, 221, 211, 128, 70, 178, 191, 170, 0, 13, 122, 173, 12, 203, 252, 4, 184, 225, 252, 7, 62, 96, 116, 15, 216, 158, 55, 85, 48, 16, 9, 206, 119, 74, 112, 243, 136, 84, 184, 223, 254, 101, 91, 61, 10, 91, 85, 192, 147, 144, 57, 29, 66, 238, 199, 244, 193, 194, 150, 232, 200, 107, 2, 3, 1, 0, 1, 2, 130, 1, 0, 103, 244, 137, 118, 116, 82, 14, 203, 102, 107, 253, 88, 12, 199, 222, 60, 243, 136, 86, 157, 74, 224, 190, 53, 113, 57, 157, 250, 49, 130, 96, 31, 252, 136, 152, 70, 143, 17, 215, 96, 103, 51, 18, 35, 141, 212, 210, 205, 9, 216, 83, 70, 245, 71, 138, 119, 112, 229, 164, 176, 9, 37, 81, 161, 193, 154, 68, 249, 115, 106, 201, 6, 12, 225, 144, 126, 141, 210, 141, 242, 128, 159, 221, 163, 222, 21, 233, 230, 167, 206, 59, 24, 250, 233, 81, 122, 102, 26, 6, 233, 72, 133, 47, 77, 155, 238, 86, 6, 139, 24, 131, 163, 179, 112, 48, 247, 142, 6, 207, 204, 173, 223, 140, 199, 150, 95, 123, 152, 202, 155, 131, 238, 62, 96, 133, 4, 217, 51, 121, 30, 38, 178, 189, 216, 44, 35, 241, 93, 7, 62, 90, 111, 216, 66, 209, 243, 128, 234, 141, 84, 135, 181, 13, 38, 220, 114, 245, 240, 178, 95, 220, 206, 11, 186, 234, 213, 66, 121, 83, 68, 89, 75, 46, 183, 145, 183, 147, 160, 215, 118, 198, 125, 181, 146, 30, 251, 58, 87, 47, 209, 237, 97, 24, 47, 179, 6, 110, 242, 99, 150, 226, 148, 198, 174, 146, 101, 213, 87, 178, 10, 223, 105, 18, 56, 53, 22, 212, 158, 170, 176, 51, 86, 145, 125, 124, 44, 9, 85, 19, 144, 246, 170, 78, 124, 30, 32, 12, 166, 174, 139, 77, 63, 173, 82, 10, 153, 2, 129, 129, 0, 248, 18, 143, 246, 137, 136, 145, 219, 178, 39, 27, 94, 64, 90, 47, 163, 114, 60, 63, 187, 131, 143, 244, 16, 42, 128, 231, 117, 92, 98, 219, 155, 62, 107, 252, 17, 245, 45, 160, 225, 103, 142, 72, 36, 193, 150, 235, 214, 175, 62, 212, 56, 45, 9, 0, 60, 114, 107, 134, 228, 204, 131, 131, 214, 94, 201, 148, 159, 99, 139, 181, 13, 119, 38, 30, 107, 166, 165, 203, 43, 34, 20, 207, 171, 32, 58, 167, 62, 196, 153, 103, 204, 213, 247, 48, 111, 227, 59, 95, 97, 194, 187, 53, 10, 247, 108, 58, 86, 28, 29, 113, 8, 110, 171, 220, 245, 11, 82, 233, 223, 91, 68, 166, 117, 174, 187, 62, 77, 2, 129, 129, 0, 235, 118, 2, 105, 239, 212, 30, 104, 157, 41, 109, 11, 248, 152, 22, 236, 97, 40, 153, 131, 228, 5, 86, 187, 113, 126, 144, 76, 141, 79, 110, 250, 146, 152, 49, 58, 156, 201, 176, 92, 189, 209, 30, 112, 108, 175, 204, 204, 247, 164, 46, 129, 239, 98, 127, 49, 145, 218, 63, 193, 124, 174, 18, 98, 201, 99, 154, 162, 138, 78, 159, 253, 3, 248, 3, 209, 36, 239, 193, 155, 193, 5, 19, 236, 37, 78, 118, 135, 250, 199, 7, 141, 248, 120, 36, 136, 93, 98, 174, 60, 18, 215, 93, 174, 107, 141, 116, 145, 167, 221, 210, 169, 247, 67, 254, 222, 161, 134, 63, 221, 90, 87, 42, 99, 227, 81, 173, 151, 2, 129, 129, 0, 133, 23, 168, 103, 83, 232, 146, 160, 181, 23, 40, 38, 204, 13, 214, 203, 49, 41, 195, 227, 189, 181, 8, 243, 119, 106, 75, 67, 250, 250, 10, 234, 98, 118, 26, 250, 35, 121, 132, 124, 10, 76, 26, 198, 165, 154, 108, 19, 117, 88, 23, 17, 192, 143, 184, 177, 181, 141, 157, 4, 185, 248, 193, 77, 204, 243, 7, 170, 240, 4, 111, 113, 183, 0, 27, 136, 20, 19, 149, 74, 33, 241, 218, 108, 236, 80, 171, 148, 16, 116, 97, 109, 83, 74, 88, 145, 94, 239, 102, 192, 19, 114, 207, 5, 128, 51, 111, 164, 237, 86, 154, 99, 52, 197, 62, 57, 182, 6, 152, 245, 61, 137, 58, 105, 159, 2, 84, 109, 2, 129, 129, 0, 226, 67, 111, 132, 95, 91, 101, 177, 63, 189, 44, 53, 193, 184, 92, 230, 223, 98, 133, 74, 209, 86, 52, 7, 65, 195, 206, 100, 81, 178, 144, 65, 167, 151, 42, 79, 89, 149, 18, 173, 188, 21, 244, 251, 49, 230, 41, 150, 153, 46, 35, 38, 231, 99, 174, 56, 115, 32, 215, 253, 85, 147, 108, 197, 147, 34, 236, 216, 222, 177, 57, 90, 136, 114, 207, 48, 46, 31, 90, 220, 18, 58, 143, 239, 111, 214, 27, 95, 6, 36, 53, 229, 62, 108, 45, 39, 1, 30, 47, 178, 56, 164, 206, 56, 42, 208, 46, 193, 61, 31, 147, 45, 147, 23, 187, 22, 50, 255, 111, 229, 132, 199, 152, 75, 142, 136, 209, 151, 2, 129, 129, 0, 165, 56, 232, 76, 55, 57, 240, 159, 92, 207, 220, 143, 130, 30, 57, 234, 251, 172, 171, 180, 54, 159, 229, 96, 246, 73, 112, 146, 75, 157, 242, 201, 161, 218, 37, 176, 35, 170, 50, 90, 148, 102, 191, 199, 239, 174, 78, 72, 67, 85, 199, 45, 149, 145, 132, 161, 212, 33, 157, 75, 216, 79, 39, 233, 18, 210, 255, 26, 72, 229, 239, 44, 12, 147, 158, 176, 192, 95, 126, 32, 175, 23, 226, 131, 139, 197, 175, 193, 62, 8, 151, 252, 68, 154, 94, 89, 189, 125, 90, 30, 36, 175, 73, 230, 194, 13, 233, 247, 123, 60, 241, 47, 171, 51, 189, 112, 111, 213, 141, 89, 70, 249, 236, 63, 236, 110, 115, 208]};
*/


export default new CryptoManager();
