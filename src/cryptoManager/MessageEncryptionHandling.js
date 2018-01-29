import {divideURL, isDataObjectURL, isLegacy, chatkeysToStringCloner, chatkeysToArrayCloner, parseMessageURL,
  parse, stringify, encode, decode, decodeToUint8Array, filterMessageToHash} from '../utils/utils.js';


class MessageEncryptionHandling {

  constructor(registry, chatKeys, crypto, idm, storageManager, dataObjectsStorage) {
    this.registry = registry;
    this.chatKeys = chatKeys;
    this.crypto = crypto;
    this.idm = idm;
    this.storageManager = storageManager;
    this.dataObjectsStorage = dataObjectsStorage;
  }

  encryptBetweenHyperties(message) {
    let _this = this;
    console.log('xxx2');
    return new Promise((resolve, reject) => {

      let userURL = _this.registry.getHypertyOwner(message.from);
      let isHandShakeType = message.type === 'handshake';
      if (userURL) {

        // check if exists any keys between two users
        let chatKeys = _this.chatKeys[message.from + '<->' + message.to];
        if (!chatKeys) {
          chatKeys = _this._newChatCrypto(message, userURL);

          //console.log('createChatKey encrypt', message.from + message.to);
          _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
          message.body.handshakePhase = 'startHandShake';
        }

        if (chatKeys.authenticated && !isHandShakeType) {

          let iv = _this.crypto.generateIV();
          _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, stringify(message.body.value), iv).then(encryptedValue => {

            let filteredMessage = filterMessageToHash(message, stringify(message.body.value) +
                                                                  stringify(iv), chatKeys.hypertyFrom.messageInfo);

            _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage).then(hash => {
              //console.log('result of hash ', hash);
              let value = {iv: encode(iv), value: encode(encryptedValue), hash: encode(hash)};
              message.body.value = encode(value);

              resolve({ message: message, isHandShakeNeeded: false});
            });
          });

          // if is a handshake message, just resolve it
        } else if (isHandShakeType) {
          resolve({ message: message, isHandShakeNeeded: false});

          // else, starts a new handshake protocol
        } else {
          resolve({ message: message, isHandShakeNeeded: true, chatKeys: chatKeys});
        }
      } else {
        reject('In encryptMessage: Hyperty owner URL was not found');
      }
    });
  }


  encryptBetweenHypertyDataObject(message) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let dataObjectURL = parseMessageURL(message.to);
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
                  // console.log('hash ', hash);

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
            reject('Data object key could not be defined: Failed to encrypt message ');
          }
        }).catch(err => { reject('On encryptMessage from method dataObjectsStorage.getDataObject error: ' + err); });
      }).catch(err => { reject('On encryptMessage from method storageManager.get error: ' + err); });

    });
  }


  decryptBetweenHyperties(message) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let isHandShakeType = message.type === 'handshake';
      let userURL = _this.registry.getHypertyOwner(message.to);
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
            // console.log('decrypted value ', decryptedData);
            message.body.value = decryptedData;

            let filteredMessage = filterMessageToHash(message, decryptedData + iv);

            _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, filteredMessage, hash).then(result => {
              console.log('Result of hash verification in decryptMessage: ', result);
              message.body.assertedIdentity = true;
              resolve({message: message, isHandShakeNeeded: false});
            }).chatch(err => {
              console.log('decryptMessage HMAC failed:', err);
              throw err;
            });
          });

        } else if (isHandShakeType) {
          resolve({ message: message, chatKeys: chatKeys, isHandShakeNeeded: true});
        } else {
          reject('Wrong message do decrypt: ');
        }
      } else {
        reject('Error on decrypt message:');
      }
    });
  }


  decryptBetweenHypertyDataObject(message) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let dataObjectURL = parseMessageURL(message.to);
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

              // console.log('decrypted Value,', parsedValue);
              message.body.value = parsedValue;

              let filteredMessage = filterMessageToHash(message, stringify(parsedValue) + stringify(iv));

              _this.crypto.verifyHMAC(dataObjectKey.sessionKey, filteredMessage, hash).then(result => {
                console.log('Received message HMAC result', result);

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

    let userInfo = _this.idm.getIdentity(userURL);

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
}


/**
  * Identifies the messages to be encrypted
  * @param {Message}    message
  * @returns {boolean}  returns true if the message requires encryption
  */

export function isToEncrypt(message) {
  console.info('[CryptoManager.istoChyperModule]', message);
  let isCreate = message.type === 'create';
  let isFromHyperty = message.from.includes('hyperty://');
  let isToHyperty = message.to.includes('hyperty://');
  let isToDataObject = isDataObjectURL(message.to);

  let doMutualAuthentication = message.body.hasOwnProperty('mutual') ? message.body.mutual : true;

  if (!doMutualAuthentication) return false;

  //if is not to apply encryption, then returns resolve
  if (!this.isToUseEncryption && !(message.type === 'handshake')) {
    console.info('not handshake: encryption disabled');
    return false;
  }

  if (message.type === 'update') {
    console.info('update:encryption disabled');
    return false;
  }

  if (isLegacy(message.to)) return false;

  return ((isCreate && isFromHyperty && isToHyperty) || (isCreate && isFromHyperty && isToDataObject && doMutualAuthentication) || message.type === 'handshake' || (message.type === 'update' && doMutualAuthentication));
}


export function isToDecrypt(message) {
  let _this = this;

  return new Promise((resolve, reject) => {
    // For sybscribe message let's start the mutualAuthentication
    let isSubscription = message.type === 'subscribe';
    let isFromRemoteSM = _this._isFromRemoteSM(message.from);

    if (isSubscription & isFromRemoteSM) {
      console.log('_doMutualAuthenticationPhase1');

      _this._doMutualAuthenticationPhase1(message).then(() => {
        resolve(false);
      }, (error) => {
        reject(error);
      });

    } else if (message.hasOwnProperty('body') && message.body.hasOwnProperty('value') && typeof message.body.value === 'string') {
      console.log('_isToDecrypt:true');
      resolve(true);
    } else {
      console.log('_isToDecrypt:false');
      resolve(false);
    }

  }).catch((error) => {
    console.error('[CryptoManager._isToDecrypt]', error);
  });
}

module.exports = MessageEncryptionHandling;
