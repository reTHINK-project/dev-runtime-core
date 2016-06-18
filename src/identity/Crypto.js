/**
* Class with the cryptographic functions for the authentication protocol
*
*/
class Crypto {

  constructor() {
    let _this = this;

  }

  encryptRSA(pubKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAencryptKey(pubKey).then(function(publicKey) {

        crypto.subtle.encrypt(
            {
              name: 'RSA-OAEP'
            },
            publicKey, //from generateKey or importKey above
            _this._utf8Encode(data) //ArrayBuffer of data you want to encrypt
        )
        .then(function(encrypted) {
          //returns an ArrayBuffer containing the encrypted data
          console.log(new Uint8Array(encrypted));
          resolve(new Uint8Array(encrypted));

        }).catch(function(err) {
          console.log(err);
          reject(err);
        });

      });

    });

  }

  decryptRSA(privKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAdecryptKey(privKey).then(function(privateKey) {

        crypto.subtle.decrypt(
            {
              name: 'RSA-OAEP'
            },
            privateKey, //from generateKey or importKey above
            data //ArrayBuffer of the data
        )
        .then(function(decrypted) {

          let decryptedData = _this._utf8Decode(new Uint8Array(decrypted));

          console.log(decryptedData);
          resolve(decryptedData);

        }).catch(function(err) {
          console.log(err);
          reject(err);
        });
      });

    });
  }

  signRSA(privKey, data) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAsignKey(privKey).then(function(privateKey) {

        crypto.subtle.sign(
            {
              name: 'RSASSA-PKCS1-v1_5'
            },
            privateKey, //from generateKey or importKey above
            _this._utf8Encode(data) //ArrayBuffer of data you want to sign
        )
        .then(function(signature) {
          //returns an ArrayBuffer containing the signature
          console.log(new Uint8Array(signature));
          resolve(new Uint8Array(signature));

        }).catch(function(err) {
          console.log(err);
          reject(err);
        });

      });

    });
  }

  verifyRSA(pubKey, data, signature) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importRSAverifyKey(pubKey).then(function(publicKey) {

        crypto.subtle.verify(
            {
              name: 'RSASSA-PKCS1-v1_5'
            },
            publicKey, //from generateKey or importKey above
            signature, //ArrayBuffer of the signature
            _this._utf8Encode(data) //ArrayBuffer of the data
        )
        .then(function(isvalid) {
          //returns a boolean on whether the signature is true or not
          console.log(isvalid);
          resolve(isvalid);

        }).catch(function(err) {
          console.log(err);
          reject(err);
        });

      });

    });
  }

  encryptAES(key, data, iv) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importAESkey(key).then(function(aesKey) {

        crypto.subtle.encrypt(
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
          console.log(new Uint8Array(encrypted));
          resolve(new Uint8Array(encrypted));

        }).catch(function(err) {
          console.log(err);
          reject(err);
        });

      });

    });
  }

  decryptAES(key, data, iv) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      _this._importAESkey(key).then(function(aesKey) {

        crypto.subtle.decrypt(
            {
              name: 'AES-CBC',
              iv: iv
            },
            aesKey, //from generateKey or importKey above
            data //ArrayBuffer of the data
        )
        .then(function(decrypted) {

          let decodedData = _this._utf8Decode(new Uint8Array(decrypted));
          console.log(decodedData);
          resolve(decodedData);

        }).catch(function(err) {
          console.log(err);
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
    let _this = this;

    return new Promise(function(resolve,reject) {

      _this._importHMACkey(key).then(function(hmacKey) {

        crypto.subtle.sign(
        {
          name: 'HMAC'
        },
        hmacKey, //from generateKey or importKey above
        _this._utf8Encode(data) //ArrayBuffer of data you want to sign
        )
        .then(function(signature) {
          console.log(signature);

          //returns an ArrayBuffer containing the signature
          resolve(new Uint8Array(signature));

        }).catch(function(err) {
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
    let _this = this;

    return new Promise(function(resolve,reject) {

      _this._importHMACkey(key).then(function(hmacKey) {

        crypto.subtle.verify(
          {
            name: 'HMAC'
          },
          hmacKey, //from generateKey or importKey above
          signature, //ArrayBuffer of the signature
          _this._utf8Encode(data) //ArrayBuffer of the data
        )
        .then(function(isvalid) {
          //returns a boolean on whether the signature is true or not
          console.log(isvalid);
          resolve(isvalid);

        }).catch(function(err) {
          console.error(err);
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
      crypto.subtle.generateKey(
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
        console.log(key);
        console.log(key.publicKey);
        console.log(key.privateKey);

        crypto.subtle.exportKey(
          'spki', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
          key.publicKey //can be a publicKey or privateKey, as long as extractable was true
        ).then(function(publicKey) {
          //returns the exported key data
          console.log(new Uint8Array(publicKey));
          keyPair.public  = new Uint8Array(publicKey);
          return crypto.subtle.exportKey(
            'pkcs8', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
            key.privateKey //can be a publicKey or privateKey, as long as extractable was true
          );
        }).then(function(privateKey) {
          console.log(new Uint8Array(privateKey));
          keyPair.private  = new Uint8Array(privateKey);
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
  * Generates a 256 bit random value. 32 bits are extrated from the machine time,
  * the remaining are generated randomly
  * @return {byteArray}  array    random value
  */
  generateRandom() {
    let _this = this;

    let array = new  Uint8Array(32);
    crypto.getRandomValues(array);

    let date = Date.now();
    let dateEncoded = _this._utf8Encode(date);

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
    crypto.getRandomValues(array);
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

      _this.hashHMAC(hmacKey, seed).then(function(keypart0) {

        //copy the first 32 bytes into the key
        for (let i = 0; i < 32; i++) { key[i] = keypart0[i]; }
        return _this.hashHMAC(hmacKey, seed + keypart0);

      }).then(function(keypart1) {

        //copy the first 16 bytes to the key remaining 16 bytes
        for (let i = 0; i < 16; i++) { key[i + 32] = keypart1[i]; }
        resolve(key);

      }).catch(function(err) {
        console.log(err);
        reject(err);
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

        resolve(key);

      }).catch(function(err) {
        console.log(err);
        reject(err);
      });

      console.log(hmacKey, data);
    });
  }

  _importRSAsignKey(privKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
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
        console.log(privateKey);
        resolve(privateKey);

      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }

  _importRSAverifyKey(pubKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
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
        console.log(publicKey);
        resolve(publicKey);

      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }

  _importRSAencryptKey(pubKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
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
        console.log(publicKey);
        resolve(publicKey);

      }).catch(function(err) {
        console.error(err);
      });
    });
  }

  _importRSAdecryptKey(privKey) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
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
        console.log(privateKey);
        resolve(privateKey);

      }).catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }

  _generate256bitKey() {
    let array = new  Uint8Array(32);
    crypto.getRandomValues(array);

    return array;
  }

  /**
  * imports the secret to the HMAC function
  * @param  {byteArray}   arrayBuffer     bytes to import as key
  * @return {JSON}       key              key ready to be used in the HMAC cryptographic function
  */
  _importHMACkey(arrayBuffer) {
    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
      'raw', //can be 'jwk' or 'raw'
      arrayBuffer,
      {   //this is the algorithm options
        name: 'HMAC',
        hash: {name: 'SHA-256'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        length: 256 //optional, if you want your key length to differ from the hash function's block length
      },
      true, //whether the key is extractable (i.e. can be used in exportKey)
      ['sign', 'verify'] //can be any combination of 'sign' and 'verify'
      ).then(function(key) {
        //returns the symmetric key
        console.log(key);
        resolve(key);
      })
      .catch(function(err) {
        reject(err);
      });
    });
  }

  _importAESkey(arrayBuffer) {
    return new Promise(function(resolve, reject) {
      crypto.subtle.importKey(
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
        console.log(key);
        resolve(key);
      })
      .catch(function(err) {
        console.error(err);
        reject(err);
      });
    });
  }

  _utf8Encode(s) {
    return new TextEncoder('utf-8').encode(s);
  }

  _utf8Decode(s) {
    return new TextDecoder('utf-8').decode(s);
  }
}

export default Crypto;
