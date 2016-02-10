import GraphConnectorContactData from './GraphConnectorContactData';
import BloomFilter from './BloomFilter';
import GlobalRegistryRecord from './GlobalRegistryRecord';
import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import sjcl from 'sjcl';
import jsrsasign from 'jsrsasign';
import base64url from 'base64-url';

/**
* The Graph Connector contains the contact list/address book.
* @author beierle@tu-berlin.de
*/
class GraphConnector {

  // TODO: import / export methods

  /**
   * Constructs a new and empty Graph Connector.
   * @param {string}   HypertyRuntimeURL    The Hyperty Runtime URL.
   * @param {messageBus}    MessageBus      The Message Bus.
   */
  constructor(hypertyRuntimeURL, messageBus) {
    this.contacts = [];
    this.lastCalculationBloomFilter1Hop = new Date(0).toISOString();

    this.globalRegistryRecord = new GlobalRegistryRecord();
    this._prvKey;

    this.groups = [];
    this.residenceLocation;
    this.firstName;
    this.lastName;

    this._messageBus = messageBus;
    this._hypertyRuntimeURL = hypertyRuntimeURL;
  }

  /**
  * Returns the MessageBus.
  * @param {MessageBus}           messageBus    The Message Bus.
  */
  get messageBus() {
    return this._messageBus;
  }

  /**
  * Sets the MessageBus.
  * @param {MessageBus}           messageBus    The Message Bus.
  */
  set messageBus(messageBus) {
    this._messageBus = messageBus;
  }

  /**
   * Generates a GUID and returns a mnemonic from which the GUID can be re-created later.
   * @returns  {string}    mnemonic      A string with 16 words.
   */
  generateGUID() {

    // generate mnemonic and salt
    Buffer.TYPED_ARRAY_SUPPORT = true;
    let mnemonic = bip39.generateMnemonic(160);

    let saltWord = bip39.generateMnemonic(8);
    this._createKeys(mnemonic, saltWord);

    // set lasUpdate date
    this.globalRegistryRecord.lastUpdate = new Date().toISOString();

    // set defualt timeout
    let timeout = new Date();
    timeout.setMonth(timeout.getMonth() + 120);
    this.globalRegistryRecord.timeout = timeout.toISOString();

    // set default values
    this.globalRegistryRecord.active = 1;
    this.globalRegistryRecord.revoked = 0;

    // return mnemonic
    let rtn = mnemonic + ' ' + saltWord;
    return rtn;
  }

  /**
   * Generates a public/private key pair from a given mnemonic (16 words).
   * Expects a string containing 16 words seperated by single spaces.
   * Retrieves data from the Global Registry.
   * @param  {string}     mnemonicAndSalt     A string of 16 words.
   * @returns  {Promise}  Promise          Global Registry Record.
   */
  useGUID(mnemonicAndSalt) {
    // TODO: check if format is correct and if all words are from bip39 english wordlist
    let lastIndex = mnemonicAndSalt.lastIndexOf(' ');
    let mnemonic = mnemonicAndSalt.substring(0, lastIndex);
    let saltWord = mnemonicAndSalt.substring(lastIndex + 1, mnemonicAndSalt.length);
    this._createKeys(mnemonic, saltWord);

    let _this = this;

    // retrieve current info from Global Registry and fill this.globalRegistryRecord
    let msg = {
      type: 'READ',
      from: this._hypertyRuntimeURL + '/graph-connector',
      to: 'global://registry/',
      body: { guid: this.globalRegistryRecord.guid }
    };

    return new Promise(function(resolve, reject) {

      if (_this.messageBus === undefined) {
        reject('MessageBus not found on GraphConnector');
      } else {

        _this.messageBus.postMessage(msg, (reply) => {

          // reply should be the JSON returned from the Global Registry REST-interface
          let unwrappedJWT = KJUR.jws.JWS.parse(reply.body.data);
          let dataEncoded = unwrappedJWT.payloadObj.data;
          let dataDecoded = base64url.decode(dataEncoded);
          let dataJSON = JSON.parse(dataDecoded);

          // public key should match
          let sameKey = (dataJSON.publicKey == _this.globalRegistryRecord.publicKey);
          if (!sameKey) {
            reject('Retrieved key does not match!');
          } else {
            let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
            let isValid = KJUR.jws.JWS.verify(reply.body.data, publicKeyObject, ['ES256']);
            if (!isValid) {
              reject('Retrieved Record not valid!');
            } else {
              if (typeof dataJSON.userIDs != 'undefined' && dataJSON.userIDs != null) {
                _this.globalRegistryRecord.userIDs = dataJSON.userIDs;
              }
              _this.globalRegistryRecord.lastUpdate = dataJSON.lastUpdate;
              _this.globalRegistryRecord.timeout = dataJSON.timeout;
              _this.globalRegistryRecord.salt = dataJSON.salt;
              _this.globalRegistryRecord.active = dataJSON.active;
              _this.globalRegistryRecord.revoked = dataJSON.revoked;
              resolve(_this.globalRegistryRecord);
            }
          }
        });
      }
    });
  }

  /**
   * Creates the keys from mnemonic and salt. Also sets public key, guid, and salt for globalRegistryRecord.
   * @param  {string}     mnemonic     A string with 15 words.
   * @param  {string}     salt         A word.
   */
  _createKeys(mnemonic, saltWord) {

    // generate key pair
    let seed = bip39.mnemonicToSeed(mnemonic);
    Buffer.TYPED_ARRAY_SUPPORT = false;
    let hdnode = bitcoin.HDNode.fromSeedBuffer(seed);
    let ecparams = KJUR.crypto.ECParameterDB.getByName('secp256k1');
    let biPrv = hdnode.keyPair.d; // private key big integer
    let epPub = ecparams.G.multiply(biPrv); // d*G
    let biX = epPub.getX().toBigInteger(); // x from Q
    let biY = epPub.getY().toBigInteger(); // y from Q
    let charlen = ecparams.keylen / 4;
    let hPrv = ('0000000000' + biPrv.toString(16)).slice(-charlen);
    let hX   = ('0000000000' + biX.toString(16)).slice(-charlen);
    let hY   = ('0000000000' + biY.toString(16)).slice(-charlen);
    let hPub = '04' + hX + hY;
    this._prvKey = new KJUR.crypto.ECDSA({curve: 'secp256k1'});
    this._prvKey.setPrivateKeyHex(hPrv);
    this._prvKey.isPrivate = true;
    this._prvKey.isPublic = false;
    let pubKey = new KJUR.crypto.ECDSA({curve: 'secp256k1'});
    pubKey.setPublicKeyHex(hPub);
    pubKey.isPrivate = false;
    pubKey.isPublic = true;
    let publicKey = jsrsasign.KEYUTIL.getPEM(pubKey, 'PKCS8PUB');
    publicKey = publicKey.replace(/(\r\n|\n|\r)/gm, '');
    this.globalRegistryRecord.publicKey = publicKey;

    // generate salt
    let saltHashedBitArray = sjcl.hash.sha256.hash(saltWord);
    let salt = sjcl.codec.base64.fromBits(saltHashedBitArray);
    this.globalRegistryRecord.salt = salt;

    // generate GUID
    let iterations = 10000;
    let guidBitArray = sjcl.misc.pbkdf2(this.globalRegistryRecord.publicKey, salt, iterations);
    let guid = sjcl.codec.base64url.fromBits(guidBitArray);
    this.globalRegistryRecord.guid = guid;
  }

  /**
   * SignGenerates a public/private key pair from a given mnemonic.
   * @returns  {string}     JWT     JSON Web Token ready to commit to Global Registry.
   */
  signGlobalRegistryRecord() {

    let record = this.globalRegistryRecord.getRecord();
    let recordString = JSON.stringify(record);
    let recordStringBase64 = base64url.encode(recordString);

    let jwt = KJUR.jws.JWS.sign(null, {alg: 'ES256'}, {data: recordStringBase64}, this._prvKey);
    return jwt;
  }

  /**
   * Takes the Global Registry Record as a signed JWT and sends it to the Global Registry via the MessageBus.
   * Returns the response code of the REST-interface of the Global Registry as a Promise.
   * @param  {string}     jwt     The Global Registry Record as a signed JWT.
   * @returns {Propmise}  Promise Response Code from Global Registry.
   */
  sendGlobalRegistryRecord(jwt) {

    let payloadObj = KJUR.jws.JWS.parse(jwt).payloadObj;
    let guid = payloadObj.guid;

    let _this = this;

    let msg = {
      type: 'CREATE',
      from: this._hypertyRuntimeURL + '/graph-connector',
      to: 'global://registry/',
      body: { guid: this.globalRegistryRecord.guid, jwt: jwt }
    };

    return new Promise(function(resolve, reject) {

      if (_this.messageBus === undefined) {
        reject('MessageBus not found on GraphConnector');
      } else {

        _this.messageBus.postMessage(msg, (reply) => {

          let responseCode = reply.body.responseCode;
          if (responseCode == 200) {
            resolve(200);
          } else {
            reject(responseCode);
          }

        });
      }
    });
  }

  /**
   * Queries the Global Registry for a given GUID.
   * Returns a Graph Connector Contact Data as a Promise.
   * @param  {string}   guid  The GUID to query the Global Registry for
   * @returns   {Promise}   Promise   Graph Connector Contact Data containing UserIDs.
   */
   queryGlobalRegistry(guid) {

     let _this = this;

     let msg = {
       type: 'READ',
       from: this._hypertyRuntimeURL + '/graph-connector',
       to: 'global://registry/',
       body: { guid: guid }
     };

     return new Promise(function(resolve, reject) {

       if (_this.messageBus === undefined) {
         reject('MessageBus not found on GraphConnector');
       } else {

         _this.messageBus.postMessage(msg, (reply) => {

           // reply should be the JSON returned from the Global Registry REST-interface
           let unwrappedJWT = KJUR.jws.JWS.parse(reply.body.data);
           let dataEncoded = unwrappedJWT.payloadObj.data;
           let dataDecoded = base64url.decode(dataEncoded);
           let dataJSON = JSON.parse(dataDecoded);

           let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
           let isValid = KJUR.jws.JWS.verify(reply.body.data, publicKeyObject, ['ES256']);
           if (!isValid) {
             reject('Retrieved Record not valid!');
           } else {
             let queriedContact = new GraphConnectorContactData(dataJSON.guid, '', '');
             if (typeof dataJSON.userIDs != 'undefined' && dataJSON.userIDs != null) {
               queriedContact.userIDs = dataJSON.userIDs;
             }
             resolve(queriedContact);
           }
         });
       }
     });

   }

  /**
   * Adds a UserID for the user.
   * @param  {string}     userID          The UserID for a Domain Registry to add for the user.
   */
  addUserID(userID) {
    // check if already inside
    let found = false;
    for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
      if (this.globalRegistryRecord.userIDs == userID) {
        found = true;
      }
    }
    if (!found) {
      this.globalRegistryRecord.userIDs.push(userID);
    }
  }

  /**
   * Removes a UserID for the user.
   * @param  {string}     userID          The UserID to remove.
   */
  removeUserID(userID) {
    for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
      if (this.globalRegistryRecord.userIDs == userID) {
        this.globalRegistryRecord.userIDs.splice(i, 1);
      }
    }
  }

  /**
   * Add a contact to the Graph Connector.
   * @param  {string}   guid          GUID of the new contact.
   * @param  {string}   firstName     First name of the new contact.
   * @param  {string}   lastname      Last name of the new contact.
   */
  addContact(guid, firstName, lastName) {

    // TODO: what if two contacts have the same GUID?
    // TODO: reject invalid GUIDs

    this.contacts.push(new GraphConnectorContactData(guid, firstName, lastName));
  }

  /**
   * Remove a contact from the Graph Connector.
   * @param  {string}     guid      GUID of the user to be removed.
   */
  removeContact(guid) {
    // remove from contacts
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].guid == guid) {
        this.contacts.splice(i, 1);
      }
    }

    // re-calculate BF1hop
    this.calculateBloomFilter1Hop();
  }

  /**
   * Calculates the Bloom filter containing all non-private contacts.
   */
  calculateBloomFilter1Hop() {
    let bf = new BloomFilter(
      431328,   // number of bits to allocate. With 30000 entries, we have a false positive rate of 0.1 %.
      10        // number of hash functions.
    );
    for (let i = 0; i < this.contacts.length; i++) {
      if (!this.contacts[i].privateContact) {
        bf.add(this.contacts[i].guid);
      }
    }
    this.contactsBloomFilter1Hop = bf;
    this.lastCalculationBloomFilter1Hop = new Date().toISOString();
  }

  /**
   * Gets contacts by name.
   * @param  {string}   name    First or last name to look for in the contact list.
   * @returns  {array}   matchingContacts       Contacts matching the given name. The format is: Contacts<GraphConnectorContactData>.
   */
  getContact(name) {
    // TODO: optimize, e.g., find misspelled people
    let rtnArray = [];
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].firstName == name || this.contacts[i].lastName == name) {
        rtnArray.push(this.contacts[i]);
      }
    }
    return rtnArray;
  }

  /**
   * Checks, if the given GUID is known and returns a list of contacs that are direct connections as well as a list of contacts that (most likely) know the given contact.
   * @param  {string}     guid      GUID of the contact to look for.
   * @returns  {array}    relatedContacts     List of related direct contacts and of related friends-of-friends contacts.The format is: RelatedContacts<Direct<GraphConnectorContactData>,FoF<GraphConnectorContactData>>.
   */
  checkGUID(guid) {
    let directContactsArray = [];
    let fofContactsArray = [];
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].guid == guid) {
        directContactsArray.push(this.contacts[i]);
      }
      let bf1hop = this.contacts[i].contactsBloomFilter1Hop;
      if (bf1hop !== undefined) {
        if (bf1hop.test(guid)) {
          fofContactsArray.push(this.contacts[i]);
        }
      }
    }
    let rtnArray = [];
    rtnArray.push(directContactsArray, fofContactsArray);
    return rtnArray;
  }

  // TODO: exportGraphData(?){}
  // TODO: importGraphData(?){}

}

export default GraphConnector;
