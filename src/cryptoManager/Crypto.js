import {encodeUTF8, decodeUTF8} from './utf8.js';

/**
* Class with the cryptographic functions for the authentication protocol
*
*/
class Crypto {

/**
* Runtime factory is so it can be passed the cypto module wapper for nodeJS.
*/
  constructor(runtimeFactory) {
    let _this = this;
    typeof runtimeFactory.createWebcrypto === 'function' ? _this._crypto = runtimeFactory.createWebcrypto() : _this._crypto = crypto;
    _this.cryptoUTF8Encoder = encodeUTF8;
    _this.cryptoUTF8Decoder = decodeUTF8;
  }

  /**
  * Encodes a JS object to base 64 encode
  * @param   {Object}    value    byteArray value
  * @return  {string}   encoded value
  */
  encode(value) {
    try {
      let stringValue = this.stringify(value);
      return btoa(stringValue);
    } catch (err) {
      console.err('[Cypto.encode:err] ' + err);
      throw err;
    }
  }

  /**
    * Decode a base64 string to object
    * @param   {string_b64}    value    value encoded in base 64
    * @return  {Object} decodedValue
    */
  decode(value) {
    try {
      return JSON.parse(atob(value));
    } catch (err) {
      console.log('[Cypto.decode:err] ' + err);
      throw err;
    }
  }

  /**
  * Decode a base64 string to Uint8Array
  * @param   {string_b64}    value    byteArray value
  * @return  {Uint8Array}   encoded value
  */
  decodeToUint8Array(value) {
    try {
      return new Uint8Array(this.decode(value));
    } catch (err) {
      console.err('[Cypto.decodeToUint8Array:err] ' + err);
      throw err;
    }
  }

  /**
  * Converts a JS object to string
  * NOTE: Special conversion for Uint8Arrays
  * @param   {Object}    value    byteArray value
  * @return  {Uint8Array}   encoded value
  */
  stringify(value) {
    try {
      let stringValue;
      if (value.constructor === Uint8Array) {
        stringValue = '[' + value.toString() + ']'; // the [] is for JSON.parse compatibility
      } else {
        stringValue = JSON.stringify(value);
      }
      return stringValue;
    } catch (err) {
      console.err('[Cypto.stringify:err] ' + err);
      throw err;
    }
  }

  /**
  * Converts a stringified object to object
  * @param   {String}    value    byteArray value
  * @return  {Object}   encoded value
  */
  parse(value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      console.err('[Cypto.parse:err]' + err);
      throw err;
    }
  }

  /**
  * Converts a stringified object to object
  * @param   {String}    value    byteArray value
  * @return  {Uint8Array}   encoded value
  */
  parseToUint8Array(value) {
    try {
      return new Uint8Array(this.parse(value));
    } catch (err) {
      console.err('[Cypto.parseToUint8Array:err]' + err);
      throw err;
    }
  }


  /**
  * Performs a RSA encryption
  * @param   {ArrayBuffer}    value    the public key
  * @param   {BufferSource}    value    data to be encryped
  * @return  {Uint8Array}   encrypted data
  */
  encryptRSA(pubKey, data) {
    CLog('encryptRSA:pubKey', pubKey);
    CLog('encryptRSA:data', data);

    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAencryptKey(new Uint8Array(pubKey)).then(function(publicKey) {

        _this._crypto.subtle.encrypt(
          {
            name: 'RSA-OAEP'
          },
          publicKey, //from generateKey or importKey above
          data //ArrayBuffer of data you want to encrypt
        )
          .then(function(encrypted) {
          //returns an ArrayBuffer containing the encrypted data
          // CLog('crypto-encryptRSA', new Uint8Array(encrypted));
            resolve(new Uint8Array(encrypted));

          }).catch(function(err) {
          // CLog('crypto-encryptRSA', err);
            reject(err);
          });
      });
    });
  }

  /**
  * Performs a RSA decryption
  * @param   {ArrayBuffer}    value    the private key
  * @param   {BufferSource}    value    data to be decrypted
  * @return  {Uint8Array}   decrypted data
  */
  decryptRSA(privKey, data) {
    CLog('decryptRSA:privKey', privKey);
    CLog('decryptRSA:data', data);
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAdecryptKey(privKey).then(function(privateKey) {

        _this._crypto.subtle.decrypt(
          {
            name: 'RSA-OAEP'
          },
          privateKey, //from generateKey or importKey above
          data //ArrayBuffer of the data
        )
          .then(function(decrypted) {

            let decryptedData = new Uint8Array(decrypted);

            // CLog('crypto-decryptRSA', decryptedData);
            resolve(decryptedData);

          }).catch(function(err) {
          // CLog('crypto-decryptRSA', err);
            reject(err);
          });
      });

    });
  }

  /**
  * Performs a RSA sign
  * @param   {ArrayBuffer}    value    the private key
  * @param   {BufferSource}    value    data to be signed
  * @return  {Uint8Array}   data signature
  */
  signRSA(privKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAsignKey(privKey).then(function(privateKey) {

        //CLog('TIAGO: signRSA data', data);
        _this._crypto.subtle.sign(
          {
            name: 'RSASSA-PKCS1-v1_5'
          },
          privateKey, //from generateKey or importKey above
          _this._utf8Encode(data) //ArrayBuffer of data you want to sign
        )
          .then(function(signature) {
          //returns an ArrayBuffer containing the signature
          // CLog('crypto-signRSA', new Uint8Array(signature));
            resolve(new Uint8Array(signature));

          }).catch(function(err) {
          // CLog('crypto-signRSA', err);
            reject(err);
          });

      });

    });
  }

  /**
  * Performs a RSA signature verification
  * @param   {ArrayBuffer}    value    the public key
  * @param   {BufferSource}    value    data to be verified
  * @return  {Boolean}   result of the signature verification
  */
  verifyRSA(pubKey, data, signature) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAverifyKey(pubKey).then(function(publicKey) {

        //CLog('TIAGO: verifyRSA data', data);
        _this._crypto.subtle.verify(
          {
            name: 'RSASSA-PKCS1-v1_5'
          },
          publicKey, //from generateKey or importKey above
          signature, //ArrayBuffer of the signature
          _this._utf8Encode(data) //ArrayBuffer of the data
        )
          .then(function(isvalid) {
          //returns a boolean on whether the signature is true or not
          // CLog('crypto-verifyRSA', isvalid);
            resolve(isvalid);

          }).catch(function(err) {
          // CLog('crypto-verifyRSA', err);
            reject(err);
          });

      });

    });
  }

  /**
  * Performs a RSA signature verification
  * @param   {ArrayBuffer}    value    the public key
  * @param   {BufferSource}    value    data to be verified
  * @return  {Boolean}   result of the signature verification
  */
  encryptAES(key, data, iv) {
    CLog('encryptAES:key', key);
    CLog('encryptAES:data', data);
    CLog('encryptAES:iv', iv);
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importAESkey(key).then(function(aesKey) {

        //CLog('TIAGO: encryptAES data', data);
        _this._crypto.subtle.encrypt(
          {
            name: 'AES-CBC',

            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            iv: iv
          },
          aesKey, //from generateKey or importKey above
          _this._utf8Encode(data) //ArrayBuffer of data you want to encrypt
        )
          .then(function(encrypted) {
          //returns an ArrayBuffer containing the encrypted data
          // CLog('crypto-encryptAES', new Uint8Array(encrypted));
            resolve(new Uint8Array(encrypted));

          }).catch(function(err) {
          // CLog('crypto-encryptAES', err);
            reject(err);
          });

      });

    });
  }

  decryptAES(key, data, iv) {
    CLog('decryptAES:key', key);
    CLog('decryptAES:data', data);
    CLog('decryptAES:iv', iv);
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importAESkey(key).then(function(aesKey) {

        _this._crypto.subtle.decrypt(
          {
            name: 'AES-CBC',
            iv: iv
          },
          aesKey, //from generateKey or importKey above
          data //ArrayBuffer of the data
        )
          .then(function(decrypted) {

            let decodedData = _this._utf8Decode(new Uint8Array(decrypted));
            CLog('crypto-decryptAES', decodedData);
            resolve(decodedData);

          }).catch(function(err) {
          // CLog('crypto-decryptAES', err);
            reject(err);
          });

      });

    });
  }

  /**
  * creates a hash using the HMAC algorithm
  * @param  {byteArray}    key       key to be used in the hmac
  * @param  {string}      data       information to be hashed
  * @return  {byteArray}   signature  resulting hash
  */
  hashHMAC(key, data) {
    CLog('hashHMAC:key', key);
    CLog('hashHMAC:data', data);
    let _this = this;

    return new Promise(function(resolve, reject) {

      if (typeof data != 'string') {
        data = JSON.stringify(data);
        CLog('Converting hashHMAC inpured DATA');
        CLog('HHashHMAC:', data);
      }


      _this._importHMACkey(key).then(function(hmacKey) {

        _this._crypto.subtle.sign(
          {
            name: 'HMAC'
          },
          hmacKey, //from generateKey or importKey above
          _this._utf8Encode(data) //ArrayBuffer of data you want to sign
        )
          .then(function(signature) {
            CLog('HashHMAC signature:', new Uint8Array(signature));

            // CLog('crypto-hashHMAC', signature);
            //returns an ArrayBuffer containing the signature
            resolve(new Uint8Array(signature));

          }).catch(function(err) {
            // CLog('crypto-hashHMAC', err);
            reject(err);
          });
      });
    });
  }

  /**
  * verifies an hash using the HMAC algorithm
  * @param  {byteArray}    key       key to be used in the hmac
  * @param  {string}      data       information to be hashed to compare
  * @param  {byteArray}  signature   hash to compare with the received data
  * @return  {boolean}   isvalid     boolean saying if the data corresponds to the hash received
  */
  verifyHMAC(key, data, signature) {
    CLog('verifyHMAC:key', key);
    CLog('verifyHMAC:data', data);
    CLog('verifyHMAC:signature', signature);
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._importHMACkey(key).then(function(hmacKey) {

        if (typeof data != 'string') {
          data = JSON.stringify(data);
          CLog('Converting verifyHMAC inputed DATA:', data);
        }

        //CLog('TIAGO: verifyHMAC data', data);
        _this._crypto.subtle.verify(
          {
            name: 'HMAC'
          },
          hmacKey, //from generateKey or importKey above
          signature, //ArrayBuffer of the signature
          _this._utf8Encode(data) //ArrayBuffer of the data
        )
          .then(function(isvalid) {
          //returns a boolean on whether the signature is true or not
          // CLog('crypto-verifyHMAC', isvalid);
            console.log('verifyHMAC result', isvalid);
            (isvalid) ? resolve(isvalid) : reject(isvalid);

          }).catch(function(err) {
            console.error('crypto-verifyHMAC', err);
            reject(err);
          });
      });
    });
  }

  /**
  * generates a RSA public/private key pair with a modulus length of 2048 bits
  * @return  {JSON}   keyPair    json containing the public and private keys
  */
  generateRSAKeyPair() {
    let _this = this;
    let keyPair = {};

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.generateKey(
        {
          name: 'RSA-PSS',
          modulusLength: 2048, //can be 1024, 2048, or 4096
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: {name: 'SHA-256'} //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['sign', 'verify'] //can be any combination of 'sign' and 'verify'

      ).then(function(key) {
        //returns a keypair object
        // CLog(key);

        _this._crypto.subtle.exportKey(
          'spki', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
          key.publicKey //can be a publicKey or privateKey, as long as extractable was true
        ).then(function(publicKey) {
          //returns the exported key data
          keyPair.public  = new Uint8Array(publicKey);
          return _this._crypto.subtle.exportKey(
            'pkcs8', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
            key.privateKey //can be a publicKey or privateKey, as long as extractable was true
          );
        }).then(function(privateKey) {
          keyPair.private  = new Uint8Array(privateKey);

          // CLog('crypto-generateRSAKeyPair', keyPair);
          resolve(keyPair);

        }).catch(function(err) {
          console.error(err);
          reject(err);
        });

      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }

  /**
  * Generates a 128 bit random value.
  * @return {byteArray}  array    random value
  */
  generateIV() {
    let _this = this;

    let array = new  Uint8Array(16);
    _this._crypto.getRandomValues(array);

    return array;
  }

  /**
  * Generates a 256 bit random value. 32 bits are extrated from the machine time,
  * the remaining are generated randomly
  * @return {byteArray}  array    random value
  */
  generateRandom() {
    let _this = this;

    let array = new  Uint8Array(32);
    _this._crypto.getRandomValues(array);

    let date = Date.now();

    //CLog('TIAGO: generateRandom data', date.toString());
    let dateEncoded = _this._utf8Encode(date.toString());

    //extract the least significant 4 bytes in the date
    let finalDate = dateEncoded.slice(dateEncoded.length - 4, dateEncoded.length);

    // add in the first 4 bytes of the array the bytes extracted previously;
    for (let i = 0; i < 4; i++) { array[i] = finalDate[i]; }
    return array;
  }

  /**
  * generates a premaster secret (PMS) of 48 bytes (384 bits) randomly
  * @return {byteArray}  array    premaster secret key
  */
  generatePMS() {
    let _this = this;

    let array = new Uint8Array(48);
    _this._crypto.getRandomValues(array);
    return array;
  }

  /**
  * generates a masterKey secret (PMS) of 48 bytes (384 bits) using the premaster secret and
  * two randoms
  * @return {byteArray}  array    master secret key with 48 bytes
  */
  generateMasterSecret(hmacKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      let key = new Uint8Array(48);
      let seed = data;

      _this._digest(hmacKey).then((digestedKey) => {

        _this.hashHMAC(digestedKey, seed).then(function(keypart0) {

          //copy the first 32 bytes into the key
          for (let i = 0; i < 32; i++) { key[i] = keypart0[i]; }
          return _this.hashHMAC(digestedKey, seed + keypart0);

        }).then(function(keypart1) {

          //copy the first 16 bytes to the key remaining 16 bytes
          for (let i = 0; i < 16; i++) { key[i + 32] = keypart1[i]; }

          // CLog('crypto-generateMasterSecret', key);
          resolve(key);

        }).catch(function(err) {
          // CLog('crypto-generateMasterSecret', err);
          reject(err);
        });
      });

    });
  }

  /**
  * generates both users MAC and encryption keys. generate as output an array
  * with 4 byteArray each with 32 bytes
  * @param  {byteArray}        secret       secret to be used in the HMAC function
  * @param  {String}           data         information to be used as seed
  * @return {Array<byteArray>} key          array with the information to generate keys
  */
  generateKeys(hmacKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let key = [];
      let seed = data;

      // iterate 4 times to obtain a 1024 key size
      _this.hashHMAC(hmacKey, seed).then(function(keypart0) {
        key.push(keypart0);
        return _this.hashHMAC(hmacKey, seed + keypart0);

      }).then(function(keypart1) {
        key.push(keypart1);
        return _this.hashHMAC(hmacKey, seed + keypart1);

      }).then(function(keypart2) {
        key.push(keypart2);
        return _this.hashHMAC(hmacKey, seed + keypart2);

      }).then(function(keypart3) {
        key.push(keypart3);

        // CLog('crypto-generateKeys', key);
        resolve(key);

      }).catch(function(err) {
        // CLog('crypto-generateKeys', err);
        reject(err);
      });

      // CLog(hmacKey, data);
    });
  }

  _importRSAsignKey(privKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.importKey(
        'pkcs8', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        privKey,
        {   //these are the algorithm options
          name: 'RSASSA-PKCS1-v1_5',
          hash: {name: 'SHA-256'} //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['sign'] //'verify' for public key import, 'sign' for private key imports
      )
        .then(function(privateKey) {
        //returns a publicKey (or privateKey if you are importing a private key)
        // CLog('crypto-_importRSAsignKey', privateKey);
          resolve(privateKey);

        }).catch(function(err) {
          console.error('crypto-_importRSAsignKey', err);
          reject(err);
        });
    });
  }

  _importRSAverifyKey(pubKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.importKey(
        'spki', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        pubKey,
        {   //these are the algorithm options
          name: 'RSASSA-PKCS1-v1_5',
          hash: {name: 'SHA-256'} //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['verify'] //'verify' for public key import, 'sign' for private key imports
      )
        .then(function(publicKey) {
        //returns a publicKey (or privateKey if you are importing a private key)
        // CLog('crypto-_importRSAverifyKey', publicKey);
          resolve(publicKey);

        }).catch(function(err) {
          console.error('crypto-_importRSAverifyKey', err);
          reject(err);
        });
    });
  }

  _importRSAencryptKey(pubKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.importKey(
        'spki', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        pubKey,
        {   //these are the algorithm options
          name: 'RSA-OAEP',
          hash: {name: 'SHA-256'} //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['encrypt'] //'encrypt' or 'wrapKey' for public key import or
        //'decrypt' or 'unwrapKey' for private key imports
      )
        .then(function(publicKey) {
        //returns a publicKey (or privateKey if you are importing a private key)
        // CLog('crypto-_importRSAencryptKey', publicKey);
          resolve(publicKey);

        }).catch(function(err) {
          console.error('crypto-_importRSAencryptKey', err.name);
          reject(err);
        });
    });
  }

  _importRSAdecryptKey(privKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.importKey(
        'pkcs8', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        privKey,
        {   //these are the algorithm options
          name: 'RSA-OAEP',
          hash: {name: 'SHA-256'} //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['decrypt'] //'encrypt' or 'wrapKey' for public key import or
        //'decrypt' or 'unwrapKey' for private key imports
      )
        .then(function(privateKey) {
        //returns a publicKey (or privateKey if you are importing a private key)
        // CLog('crypto-_importRSAdecryptKey', privateKey);
          resolve(privateKey);

        }).catch(function(err) {
          console.error('crypto-_importRSAdecryptKey', err);
          reject(err);
        });
    });
  }

  concatPMSwithRandoms(pms, toRandom, fromRandom) {

    let finalKey = new Uint8Array(pms.length + toRandom.length + fromRandom.length);

    // add PremasterKey
    for (let i = 0; i < pms.length; i++) {
      finalKey[i] = pms[i];
    }

    //add to random
    for (let i = 0; i < toRandom.length; i++) {
      finalKey[i + pms.length] = pms[i];
    }

    //add from random
    for (let i = 0; i < fromRandom.length; i++) {
      finalKey[i + pms.length + toRandom.length] = pms[i];
    }

    return finalKey;
  }

  _generate256bitKey() {
    let _this = this;
    let array = new  Uint8Array(32);
    _this._crypto.getRandomValues(array);

    return array;
  }

  /**
  * imports the secret to the HMAC function
  * @param  {byteArray}   arrayBuffer     bytes to import as key
  * @return {JSON}       key              key ready to be used in the HMAC cryptographic function
  */
  _importHMACkey(arrayBuffer) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      _this._digest(arrayBuffer).then((key) => {

        _this._crypto.subtle.importKey(
          'raw', //can be 'jwk' or 'raw'
          key,
          {   //this is the algorithm options
            name: 'HMAC',
            hash: {name: 'SHA-256'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
            length: 256 //optional, if you want your key length to differ from the hash function's block length
          },
          true, //whether the key is extractable (i.e. can be used in exportKey)
          ['sign', 'verify'] //can be any combination of 'sign' and 'verify'
        ).then(function(key) {
          //returns the symmetric key
          // CLog('crypto-_importHMACkey', key);
          resolve(key);
        })
          .catch(function(err) {
            reject(err);
          });
      });
    });
  }

  _digest(value) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.digest(
        {
          name: 'SHA-256'
        },
        value //The data you want to hash as an ArrayBuffer
      )
        .then(function(hash) {
        //returns the hash as an ArrayBuffer
        // CLog('crypto-digest', new Uint8Array(hash));
          resolve(new Uint8Array(hash));
        })
        .catch(function(err) {
          console.error(err);
          reject(err);
        });

    });
  }

  _importAESkey(arrayBuffer) {
    let _this = this;
    return new Promise(function(resolve, reject) {
      _this._crypto.subtle.importKey(
        'raw', //can be 'jwk' or 'raw'
        arrayBuffer,
        {   //this is the algorithm options
          name: 'AES-CBC'
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ['encrypt', 'decrypt'] //can be 'encrypt', 'decrypt', 'wrapKey', or 'unwrapKey'
      )
        .then(function(key) {
        //returns the symmetric key
        // console.log('crypto-importAESkey', key);
          resolve(key);
        })
        .catch(function(err) {
          console.error('crypto-importAESkey', err);
          reject(err);
        });
    });
  }

  _utf8Encode(s) {
    return this.cryptoUTF8Encoder(s);

    //return new TextEncoder('utf-8').encode(s);
    //return encodeUTF8(s);
  }

  _utf8Decode(s) {
    return this.cryptoUTF8Decoder(s);

    //return new TextDecoder('utf-8').decode(s);
    //return decodeUTF8(s);
  }
}

function CLog(a1, a2) {
  console.log(a1, a2);
}


export default Crypto;
