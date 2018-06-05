import * as logger from 'loglevel';
let log = logger.getLogger('CryptoManager');

import {chatkeysToStringCloner, encode, decode, decodeToUint8Array,
        parseToUint8Array, filterMessageToHash} from '../utils/utils.js';


/**
* This class contains the handshake protocol, used to exchange session keys between
*  two user, after their identity is validate.
*/
class HandShakeProtocol {

  constructor(chatKeys, crypto, idm, sessionKeys, storage) {
    this.chatKeys = chatKeys;
    this.crypto = crypto;
    this.idm = idm;
    this.dataObjectSessionKeys = sessionKeys;
    this.storageManager = storage;
  }

  startHandShake(message, chatKeys) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      chatKeys.keys.fromRandom = _this.crypto.generateRandom();
      let startHandShakeMsg = {
        type: 'handshake',
        to: message.to,
        from: message.from,
        body: {
          handshakePhase: 'senderHello',
          value: encode(chatKeys.keys.fromRandom)
        }
      };
      chatKeys.handshakeHistory.senderHello = filterMessageToHash(startHandShakeMsg, undefined, chatKeys.hypertyFrom.messageInfo);

      // check if was the encrypt or the mutual authentication that request the
      // start of the handShakePhase.

      if (chatKeys.initialMessage) {
        resolve({postToBus: false, message: startHandShakeMsg, chatKeys: chatKeys});
      } else {
        _this.chatKeys[message.from + '<->' + message.to] = chatKeys;
        resolve({postToBus: true, message: startHandShakeMsg});
      }
    });
  }

  senderHello(message, chatKeys) {
    let _this  = this;
    return new Promise(function(resolve, reject) {
      log.log('senderHello');
      chatKeys.handshakeHistory.senderHello = filterMessageToHash(message);
      chatKeys.keys.fromRandom = decodeToUint8Array(message.body.value);
      chatKeys.keys.toRandom = _this.crypto.generateRandom();

      let senderHelloMsg = {
        type: 'handshake',
        to: message.from,
        from: message.to,
        body: {
          handshakePhase: 'receiverHello',
          value: encode(chatKeys.keys.toRandom)
        }
      };
      chatKeys.handshakeHistory.receiverHello = filterMessageToHash(senderHelloMsg, undefined, chatKeys.hypertyFrom.messageInfo);
      resolve({message: senderHelloMsg, chatKeys: chatKeys});
    });
  }

  receiverHello(message, chatKeys, privateKey) {
    let _this = this;
    let value = {};
    let iv;
    return new Promise(function(resolve, reject) {
      log.log('receiverHello');
      chatKeys.handshakeHistory.receiverHello = filterMessageToHash(message);

      _this.idm.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp.domain).then((value) => {

      //TODO remove later this verification as soon as all the IdP proxy are updated in the example
        let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

        let receiverPublicKey = parseToUint8Array(encodedpublicKey);
        let premasterSecret = _this.crypto.generatePMS();
        let toRandom = message.body.value;
        chatKeys.hypertyTo.assertion = message.body.identity.assertion;
        chatKeys.hypertyTo.publicKey = receiverPublicKey;
        chatKeys.hypertyTo.userID    = value.contents.email;
        chatKeys.keys.toRandom  = decodeToUint8Array(toRandom);
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
        value.iv = encode(iv);

        let messageStructure = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'senderCertificate'
          }
        };

        // hash the value and the iv
        let filteredMessage = filterMessageToHash(messageStructure, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);
        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
      }).then((hash) => {
        value.hash = encode(hash);

        //encrypt the data
        return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok', iv);
      }).then((encryptedData) => {
        value.symetricEncryption = encode(encryptedData);

        return _this.crypto.encryptRSA(chatKeys.hypertyTo.publicKey, chatKeys.keys.premasterKey);

      }).then((encryptedValue) => {
        value.assymetricEncryption = encode(encryptedValue);

        let messageStructure = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'senderCertificate'
          }
        };

        let messageToHash = filterMessageToHash(messageStructure, chatKeys.keys.premasterKey, chatKeys.hypertyFrom.messageInfo);
        return _this.crypto.signRSA(privateKey, encode(chatKeys.handshakeHistory) + encode(messageToHash));
      }).then(signature => {

        value.signature = encode(signature);

        let receiverHelloMsg = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'senderCertificate',
            value: encode(value)
          }
        };
        chatKeys.handshakeHistory.senderCertificate = filterMessageToHash(receiverHelloMsg, 'ok' + iv, chatKeys.hypertyFrom.messageInfo);

        resolve({message: receiverHelloMsg, chatKeys: chatKeys});

      }, error => reject(error));
    });
  }


  senderCertificate(message, chatKeys, privateKey) {
    let _this = this;
    let iv;
    let filteredMessage;
    let value = {};
    return new Promise(function(resolve, reject) {
      log.log('senderCertificate');

      let receivedValue = decode(message.body.value);

      _this.idm.validateAssertion(message.body.identity.assertion, undefined, message.body.identity.idp.domain).then((value) => {
        let encryptedPMS = decodeToUint8Array(receivedValue.assymetricEncryption);

        //TODO remove later this verification as soon as all the IdP proxy are updated in the example
        let encodedpublicKey = (typeof value.contents === 'string') ? value.contents : value.contents.nonce;

        let senderPublicKey = parseToUint8Array(encodedpublicKey);
        chatKeys.hypertyTo.assertion = message.body.identity.assertion;
        chatKeys.hypertyTo.publicKey = senderPublicKey;
        chatKeys.hypertyTo.userID    = value.contents.email;

        return _this.crypto.decryptRSA(privateKey, encryptedPMS);

      }, (error) => {
      // log.log(error);
        reject('Error during authentication of identity: ', error.message);

      //obtain the PremasterKey using the private key
      }).then(pms => {

        chatKeys.keys.premasterKey = new Uint8Array(pms);

        let signature = decodeToUint8Array(receivedValue.signature);

        let receivedmsgToHash = filterMessageToHash(message, chatKeys.keys.premasterKey);

        return _this.crypto.verifyRSA(chatKeys.hypertyTo.publicKey, encode(chatKeys.handshakeHistory) + encode(receivedmsgToHash), signature);

      // validates the signature received
      }).then(signValidationResult => {

        log.log('SenderCertificate - signature validation result ', signValidationResult);
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
        iv = decodeToUint8Array(receivedValue.iv);
        let data = decodeToUint8Array(receivedValue.symetricEncryption);

        return _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv);

      }).then(decryptedData => {
      // log.log('decryptedData', decryptedData);

        chatKeys.handshakeHistory.senderCertificate = filterMessageToHash(message, decryptedData + iv);

        let hashReceived = decodeToUint8Array(receivedValue.hash);

        filteredMessage = filterMessageToHash(message, decryptedData + iv);

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
        value.iv = encode(iv);

        filteredMessage = filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);

        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, filteredMessage);
      }).then(hash => {

        value.hash = encode(hash);
        return _this.crypto.encryptAES(chatKeys.keys.hypertyFromSessionKey, 'ok!', iv);

      }).then(encryptedValue => {
        value.value = encode(encryptedValue);
        let receiverFinishedMessage = {
          type: 'handshake',
          to: message.from,
          from: message.to,
          body: {
            handshakePhase: 'receiverFinishedMessage',
            value: encode(value)
          }
        };

        chatKeys.handshakeHistory.receiverFinishedMessage = filterMessageToHash(receiverFinishedMessage, 'ok!' + iv, chatKeys.hypertyFrom.messageInfo);
        chatKeys.authenticated = true;
        resolve({message: receiverFinishedMessage, chatKeys: chatKeys});
      }).catch(err => {
        reject('On _doHandShakePhase from senderCertificate error: ' + err);
      });
    });
  }

  receiverFinishedMessage(message, chatKeys) {

    let _this = this;
    let iv;
    let value = {};
    let hash;
    return new Promise(function(resolve, reject) {

      log.log('receiverFinishedMessage');

      chatKeys.authenticated = true;

      value = decode(message.body.value);

      iv = decodeToUint8Array(value.iv);
      let data = decodeToUint8Array(value.value);
      hash = decodeToUint8Array(value.hash);

      _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, data, iv).then(decryptedData => {
      // log.log('decryptedData', decryptedData);
        chatKeys.handshakeHistory.receiverFinishedMessage = filterMessageToHash(message, decryptedData + iv);

        let filteredMessage = filterMessageToHash(message, decryptedData + iv);
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

            resolve({sendReporterSessionKey: false, message: initialMessage, chatKeys: chatKeys});

          //sends the sessionKey to the subscriber hyperty
          } else {
            resolve({sendReporterSessionKey: true, message: message, chatKeys: chatKeys});
          }
        });
      });
    });
  }

  reporterSessionKey(message, chatKeys) {

    let _this = this;
    let iv;
    let value = {};
    let hash;
    return new Promise(function(resolve, reject) {


      log.log('reporterSessionKey');

      let valueIVandHash = decode(message.body.value);
      hash = decodeToUint8Array(valueIVandHash.hash);
      iv = decodeToUint8Array(valueIVandHash.iv);
      let encryptedValue = decodeToUint8Array(valueIVandHash.value);
      let parsedValue;
      let sessionKey;
      let dataObjectURL;
      let receiverAcknowledgeMsg;

      //log.log('[IdentityModule reporterSessionKey] - decryptAES: ', chatKeys.keys.hypertyToSessionKey, encryptedValue, iv);

      _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, encryptedValue, iv).then(decryptedValue => {

        parsedValue = decode(decryptedValue);
        sessionKey = decodeToUint8Array(parsedValue.value);
        dataObjectURL = parsedValue.dataObjectURL;

        let messageToHash = filterMessageToHash(message, decryptedValue + iv);

        return _this.crypto.verifyHMAC(chatKeys.keys.hypertyToHashKey, messageToHash, hash);

      }).then(hashResult => {


      // log.log('hash successfully validated ', hashResult);

        _this.dataObjectSessionKeys[dataObjectURL] =  {sessionKey: sessionKey, isToEncrypt: true};
        let dataObjectSessionKeysClone = chatkeysToStringCloner(_this.dataObjectSessionKeys);
        _this.storageManager.set('dataObjectSessionKeys', 0, dataObjectSessionKeysClone).catch(err => {
          reject('On _sendReporterSessionKey from method reporterSessionKey error: ' + err);
        });

        iv = _this.crypto.generateIV();
        value.iv = encode(iv);

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

        value.value = encode(encryptedValue);
        let messageToHash = filterMessageToHash(receiverAcknowledgeMsg, 'ok!!' + iv, chatKeys.hypertyFrom.messageInfo);

        return _this.crypto.hashHMAC(chatKeys.keys.hypertyFromHashKey, messageToHash);
      }).then(hashedMessage => {
        let finalValue = encode({value: value.value, hash: encode(hashedMessage), iv: value.iv});

        receiverAcknowledgeMsg.body.value = finalValue;
        resolve({message: receiverAcknowledgeMsg, chatKeys: chatKeys});
      }).catch(err => {
        reject('On _doHandShakePhase from reporterSessionKey error: ' + err);
      });
    });
  }


  receiverAcknowledge(message, chatKeys) {

    let _this = this;
    let iv;
    return new Promise(function(resolve, reject) {

      log.log('receiverAcknowledge');

      let receivedvalueIVandHash = decode(message.body.value);
      let receivedHash = decodeToUint8Array(receivedvalueIVandHash.hash);
      iv = decodeToUint8Array(receivedvalueIVandHash.iv);
      let receivedEncryptedValue = decodeToUint8Array(receivedvalueIVandHash.value);

      _this.crypto.decryptAES(chatKeys.keys.hypertyToSessionKey, receivedEncryptedValue, iv).then(decryptedValue => {

        let filteredMessage = filterMessageToHash(message, decryptedValue + iv);
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
    });
  }
}

export default HandShakeProtocol;
