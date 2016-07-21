/**
 * Copyright 2016 PT Inovação e Sistemas SA
 * Copyright 2016 INESC-ID
 * Copyright 2016 QUOBIS NETWORKS SL
 * Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
 * Copyright 2016 ORANGE SA
 * Copyright 2016 Deutsche Telekom AG
 * Copyright 2016 Apizee
 * Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
import GraphConnectorContactData from './GraphConnectorContactData';
import BloomFilter from './BloomFilter';
import GlobalRegistryRecord from './GlobalRegistryRecord';
import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import sjcl from 'sjcl';
import jsrsasign from 'jsrsasign';
import base64url from 'base64-url';
import hex64 from 'hex64';
import Buffer from 'buffer';

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
        this.privateKey;

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
     * Sets the first name and last name of the owner.
     * @param  {string}     fname     The owner's first name.
     * @param  {string}     lname     The owner's last name.
     * @returns  {boolean} Returns true if the owner name is successfully added.
     */
    setOwnerName(fname, lname) {
        let status = false;
        if (typeof fname !== 'undefined') {
            this.firstName = fname;
            if (typeof lname !== 'undefined') {
                this.lastName = lname;
            }
            status = true;
        }
        return status;
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
            body: {guid: this.globalRegistryRecord.guid}
        };

        return new Promise(function(resolve, reject) {

            if (_this.messageBus === undefined) {
                reject('MessageBus not found on GraphConnector');
            } else {

                _this.messageBus.postMessage(msg, (reply) => {

                    console.log(reply);

                    // reply should be the JSON returned from the Global Registry REST-interface
                    let jwt = reply.body.Value;

                    if (typeof jwt !== 'undefined') {
                        let unwrappedJWT = jsrsasign.KJUR.jws.JWS.parse(reply.body.Value);
                        let dataEncoded = unwrappedJWT.payloadObj.data;
                        let dataDecoded = base64url.decode(dataEncoded);
                        let dataJSON = JSON.parse(dataDecoded);

                        // public key should match
                        let sameKey = (dataJSON.publicKey == _this.globalRegistryRecord.publicKey);
                        if (!sameKey) {
                            reject('Retrieved key does not match!');
                        } else {
                            let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
                            let encodedString = jwt.split('.').slice(0, 2).join('.');
                            let sigValueHex = unwrappedJWT.sigHex;
                            let sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
                            sig.init(publicKeyObject);
                            sig.updateString(encodedString);
                            let isValid = sig.verify(sigValueHex);

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
                                _this.globalRegistryRecord.defaults = dataJSON.defaults;
                                resolve(_this.globalRegistryRecord);
                            }
                        }
                    }else {
                        resolve('not found');
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
        let ecparams = jsrsasign.KJUR.crypto.ECParameterDB.getByName('secp256k1');
        let biPrv = hdnode.keyPair.d; // private key big integer
        let epPub = ecparams.G.multiply(biPrv); // d*G
        let biX = epPub.getX().toBigInteger(); // x from Q
        let biY = epPub.getY().toBigInteger(); // y from Q
        let charlen = ecparams.keylen / 4;
        let hPrv = ('0000000000' + biPrv.toString(16)).slice(-charlen);
        let hX = ('0000000000' + biX.toString(16)).slice(-charlen);
        let hY = ('0000000000' + biY.toString(16)).slice(-charlen);
        let hPub = '04' + hX + hY;
        this._prvKey = new jsrsasign.KJUR.crypto.ECDSA({curve: 'secp256k1'});
        this._prvKey.setPrivateKeyHex(hPrv);
        this._prvKey.isPrivate = true;
        this._prvKey.isPublic = false;
        let pubKey = new jsrsasign.KJUR.crypto.ECDSA({curve: 'secp256k1'});
        this.privateKey = jsrsasign.KEYUTIL.getPEM(this._prvKey, 'PKCS8PRV');
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

        let jwtTemp = jsrsasign.KJUR.jws.JWS.sign(null, {alg: 'ES256'}, {data: recordStringBase64}, this._prvKey);
        let encodedString = jwtTemp.split('.').slice(0, 2).join('.');

        let sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
        sig.init(this.privateKey);
        sig.updateString(encodedString);

        let signatureHex = sig.sign();
        let signature = hex64.toBase64(signatureHex);
        let jwt = encodedString + '.' + signature;
        return jwt;
    }

    /**
     * Takes the Global Registry Record as a signed JWT and sends it to the Global Registry via the MessageBus.
     * Returns the response code of the REST-interface of the Global Registry as a Promise.
     * @param  {string}     jwt     The Global Registry Record as a signed JWT.
     * @returns {Propmise}  Promise Response Code from Global Registry.
     */
    sendGlobalRegistryRecord(jwt) {

        let unwrappedJWT = jsrsasign.KJUR.jws.JWS.parse(jwt);
        let dataEncoded = unwrappedJWT.payloadObj.data;
        let dataDecoded = base64url.decode(dataEncoded);
        let dataJSON = JSON.parse(dataDecoded);

        let _this = this;

        let msg = {
            type: 'CREATE',
            from: this._hypertyRuntimeURL + '/graph-connector',
            to: 'global://registry/',
            body: {guid: dataJSON.guid, jwt: jwt}
        };

        return new Promise(function(resolve, reject) {

            if (_this.messageBus === undefined) {
                reject('MessageBus not found on GraphConnector');
            } else {

                _this.messageBus.postMessage(msg, (reply) => {
                    let responseCode = reply.body.Code;
                    if (responseCode == 200) {
                        resolve(200);
                    } else {
                        reject(responseCode);
                    }

                });
            }
        });
<<<<<<< HEAD
    }

    /**
     * Edit the values for a specific contact.
     * @param  {string}     guidOld          GUID to identify the contact to edit.
     * @param  {string}     firstName          First name of the contact.
     * @param  {string}     lastName          Last name of the contact.
     * @param  {string}     guidNew          New guid of the contact.
     * @param  {boolean}     privStatus          Boolean value to set the private status of the contact.
     * @returns  {array}   Returns the array which contains the contact with new values
     */
    editContact(guidOld, firstName, lastName, guidNew, privStatus) {

        let rtnArray = [];

        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].guid == guidOld) {
                if (guidOld == guidNew) {

                    this.contacts[i].firstName = firstName;
                    this.contacts[i].lastName = lastName;
                    this.contacts[i].guid = guidOld;
                    this.contacts[i].privateContact = privStatus;

                    rtnArray.push(this.contacts[i]);

                } else {

                    if (!this.guidExist(guidNew)) {

                        this.contacts[i].firstName = firstName;
                        this.contacts[i].lastName = lastName;
                        this.contacts[i].guid = guidNew;
                        this.contacts[i].privateContact = privStatus;

                        rtnArray.push(this.contacts[i]);

                    }
                }
                if (this.contacts[i].privateContact) {
                    // re-calculate BF1hop
                    this.calculateBloomFilter1Hop();
                }
            }
        }
        return rtnArray;
    }

    /**
     * To check whether the GUID already exist.
     * @param  {string}     guid        GUID which needs to be checked.
     * @returns  {boolean}   Returns true if the GUID exist
     */
    guidExist(guid) {

        let success = false;

        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].guid == guid || this.globalRegistryRecord.guid == guid) {
                success = true;
            }
=======
      }
    });
  }

  /**
   * Edit the values for a specific user
   * @param  {string}     guidOrg          GUID of the user.
   * @param  {string}     firstName          First name of the user.
   * @param  {string}     lastName          Last name of the user.
   * @param  {string}     guid          new guid of the user.
   * @returns  {array}   Returns the array which contains the contact with new values
   */
   editContact(guidOrg,firstName,lastName,guid) {

     let rtnArray = [];
     let status;
     let tmpFname;
     let tmpLname;
     let tmpGuid;

     for (let i = 0; i < this.contacts.length; i++) {
       if (this.contacts[i].guid == guidOrg) {

         tmpGuid = this.contacts[i].guid;
         tmpLname = this.contacts[i].lastName;
         tmpFname = this.contacts[i].firstName;

         (tmpFname == firstName) ? (this.contacts[i].firstName = tmpFname) : this.contacts[i].firstName = firstName;
         (tmpLname == lastName) ? (this.contacts[i].lastName = tmpLname) : this.contacts[i].lastName = lastName;
         (guidOrg == guid) ? (this.contacts[i].guid = guidOrg) : this.contacts[i].guid = guid;

         rtnArray.push(this.contacts[i]);
       }
     }
     return rtnArray;
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

           console.log(reply);

           // reply should be the JSON returned from the Global Registry REST-interface
           let jwt = reply.body.data;
           let unwrappedJWT = KJUR.jws.JWS.parse(reply.body.data);
           let dataEncoded = unwrappedJWT.payloadObj.data;
           let dataDecoded = base64url.decode(dataEncoded);
           let dataJSON = JSON.parse(dataDecoded);

           let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
           let encodedString = jwt.split('.').slice(0, 2).join('.');
           let sigValueHex = unwrappedJWT.sigHex;
           let sig = new KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
           sig.init(publicKeyObject);
           sig.updateString(encodedString);
           let isValid = sig.verify(sigValueHex);

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
   * @returns  {boolean}   returns false if the userID exists and the user ID will not be added, true otherwise.
   */
  addUserID(userID) {
    // check if already inside
    let found = true;
    for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
      if (this.globalRegistryRecord.userIDs[i] == userID) {
        found = false;
      }
    }
    if (found) {
      this.globalRegistryRecord.userIDs.push(userID);
    }
    return found;
  }

  /**
   * Removes a UserID for the user.
   * @param  {string}     userID          The UserID to remove.
   * @returns  {boolean}   true if the userID exists and deleted, false otherwise.
   */
  removeUserID(userID) {
    let found = false;
    for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
      if (this.globalRegistryRecord.userIDs == userID) {
        this.globalRegistryRecord.userIDs.splice(i, 1);
        found = true;
      }
    }
    return found;
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
    let newContact = new GraphConnectorContactData(guid, firstName, lastName);
    this.contacts.push(newContact);
  }

 /**
   * Removes a location for a user
   * @param  {string}   guid    GUID of the contact.
   * @returns  {boolean}  True if the group name is successfully deleted, false otherwise.
   */
  removeLocation(guid) {
    let success = false;
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].guid == guid) {
        if (this.contacts[i].residenceLocation != '') {
          this.contacts[i].residenceLocation = '';
          success = true;
        }
      }
    }
    return success;
  }

  /**
   * Adds a location for a user
   * @param  {string}   guid          GUID of the contact.
   * @param  {string}   locationName    location  of the contact
   * @returns  {boolean}  Success if the group name is successfully added
   */
  setLocation(guid, locationName) {
    let success = false;
    if (locationName !== 'undefined') {
      for (let i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].guid == guid) {
          if (!this.contacts[i].residenceLocation) {
            this.contacts[i].residenceLocation = locationName;
            success = true;
          }
>>>>>>> fix formatting issues
        }
        return success;
    }

<<<<<<< HEAD
    /**
     * To return the owner.
     * @returns  {GraphConnectorContactData}   Returns the owner.
     */
    getOwner() {

        let owner = new GraphConnectorContactData(this.globalRegistryRecord.guid, this.firstName, this.lastName);

        owner.groups = this.groups;
        owner.lastCalculationBloomFilter1Hop = this.lastCalculationBloomFilter1Hop;
        owner.residenceLocation = this.residenceLocation;
        owner.contactsBloomFilter1Hop = this.contactsBloomFilter1Hop;
        owner.userIDs = this.globalRegistryRecord.userIDs;
        owner.defaults = this.globalRegistryRecord.defaults;

        return owner;
    }

    /**
     * Queries the Global Registry for a given GUID.
     * Adds the UserID information from the Global Registry to a contact, if the given GUID matches a user in the contacts.
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
            body: {guid: guid}
        };
        return new Promise(function(resolve, reject) {

            if (_this.messageBus === undefined) {
                reject('MessageBus not found on GraphConnector');
            } else {

                _this.messageBus.postMessage(msg, (reply) => {

                    console.log(reply);

                    // reply should be the JSON returned from the Global Registry REST-interface
                    let jwt = reply.body.Value;
                    if (typeof jwt !== 'undefined') {

                        if (reply.body.Code == 200) {
                            console.log('verify JWT');
                            let unwrappedJWT = jsrsasign.KJUR.jws.JWS.parse(reply.body.Value);
                            let dataEncoded = unwrappedJWT.payloadObj.data;
                            let dataDecoded = base64url.decode(dataEncoded);
                            let dataJSON = JSON.parse(dataDecoded);
                            let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
                            let encodedString = jwt.split('.').slice(0, 2).join('.');
                            let sigValueHex = unwrappedJWT.sigHex;
                            let sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
                            sig.init(publicKeyObject);
                            sig.updateString(encodedString);
                            let isValid = sig.verify(sigValueHex);
                            if (!isValid) {
                                console.log('invalid JWT');
                                reject('Retrieved Record not valid!');
                            } else {
                                console.log('valid JWT');
                                let queriedContact = new GraphConnectorContactData(dataJSON.guid, '', '');
                                if (typeof dataJSON.userIDs != 'undefined' && dataJSON.userIDs != null) {
                                    queriedContact.userIDs = dataJSON.userIDs;

                                    for (let i = 0; i < _this.contacts.length; i++) {
                                        if (_this.contacts[i].guid == guid) {
                                            _this.contacts[i].userIDs = dataJSON.userIDs;
                                        }
                                    }

                                }
                                resolve(queriedContact);
                            }
                        }else {
                            console.log('Response code is not 200');
                            resolve(reply.body.Description);
                        }
                    } else {
                        console.log(' undefined Response');
                        resolve('undefined');
                    }
                });
            }
        });

    }


    /**
     * Adds a UserID for the user.
     * @param {string} uid.
     * @param {string} domain.
     * @returns  {boolean}   returns false if the userID exists and the user ID will not be added, true otherwise.
     */
    addUserID(uid, domain) {
        // check if already inside
        let found = true;
        for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
            if (this.globalRegistryRecord.userIDs[i].uid == uid && this.globalRegistryRecord.userIDs[i].domain == domain) {
                found = false;
            }
=======
/**
   * gets all contacts with given groupTag.
   * @param  {string}   groupName    of the contact
   * @returns  {array}   matchingContacts       Contacts matching the given groupName. The format is: Contacts<GraphConnectorContactData>.
   */

  getGroup(groupName) {
    let rtnArray = [];
    if (groupName !== 'undefined') {
      for (let i = 0; i < this.contacts.length; i++) {
        for (let j = 0; j < this.contacts[i].groups.length; j++) {
          if (this.contacts[i].groups[j] == groupName) {
            rtnArray.push(this.contacts[i]);
          }
>>>>>>> fix formatting issues
        }
        if (found) {
            let item = new Object();
            item.uid = uid;
            item.domain = domain;
            this.globalRegistryRecord.userIDs.push(item);
            this.globalRegistryRecord.lastUpdate = new Date().toISOString();

        }
<<<<<<< HEAD
        return found;
    }

    /**
     * Removes a UserID for the user.
     * @param {string} uid.
     * @param {string} domain.
     * @returns  {boolean}   true if the userID exists and deleted, false otherwise.
     */
    removeUserID(uid, domain) {
        let found = false;
        for (let i = 0; i < this.globalRegistryRecord.userIDs.length; i++) {
            if (this.globalRegistryRecord.userIDs[i].uid == uid && this.globalRegistryRecord.userIDs[i].domain == domain) {
                this.globalRegistryRecord.userIDs.splice(i, 1);
                this.globalRegistryRecord.lastUpdate = new Date().toISOString();
                found = true;
=======
      }
    }
    return success;
  }

  /**
   * Removes a groupName of a contact.
   * @param  {string}   guid          GUID of the new contact.
   * @param  {string}   groupName     Group Name of the contact
   * @returns  {boolean}  True  if the group name is successfully added

   */
  removeGroupName(guid, groupName) {
    let success = false;
    if (groupName !== 'undefined') {
      for (let i = 0; i < this.contacts.length; i++) {
        if (this.contacts[i].guid == guid) {
          for (var j = 0; j < this.contacts[i].groups.length; j++) {
            if (this.contacts[i].groups[j] == groupName) {
              this.contacts[i].groups.splice(j, 1);
>>>>>>> fix formatting issues
            }
        }
        return found;
    }

    /**
     * set User  Defaults.
     * @param {string} voice
     * @param {string} chat
     * @param {string} video
     * @returns  {boolean}   returns True if the Defaults are successfully added, false otherwise.
     */
    setDefaults(voice, chat, video) {

        this.globalRegistryRecord.defaults.voice = voice;
        this.globalRegistryRecord.defaults.chat = chat;
        this.globalRegistryRecord.defaults.video = video;
        this.globalRegistryRecord.lastUpdate = new Date().toISOString();

        return true;
    }

    /**
     * Add a contact to the Graph Connector.
     * @param  {string}   guid          GUID of the new contact.
     * @param  {string}   firstName     First name of the new contact.
     * @param  {string}   lastName      Last name of the new contact.
     * @returns  {boolean}   returns True if the Contact is successfully added, false otherwise.
     */
    addContact(guid, firstName, lastName) {

        // TODO: reject invalid GUIDs
        let success = false;
        if (!this.guidExist(guid)) {

            let _this = this;

            let msg = {
                type: 'READ',
                from: this._hypertyRuntimeURL + '/graph-connector',
                to: 'global://registry/',
                body: {guid: guid}
            };
            return new Promise(function(resolve, reject) {

                if (_this.messageBus === undefined) {
                    reject('MessageBus not found on GraphConnector');
                } else {

                    _this.messageBus.postMessage(msg, (reply) => {

                        console.log(reply);

                        // reply should be the JSON returned from the Global Registry REST-interface
                        let jwt = reply.body.Value;
                        if (typeof jwt !== 'undefined') {

                            if (reply.body.Code == 200) {
                                console.log('Response code is 200');
                                console.log('verify JWT');
                                let unwrappedJWT = jsrsasign.KJUR.jws.JWS.parse(reply.body.Value);
                                let dataEncoded = unwrappedJWT.payloadObj.data;
                                let dataDecoded = base64url.decode(dataEncoded);
                                let dataJSON = JSON.parse(dataDecoded);
                                let publicKeyObject = jsrsasign.KEYUTIL.getKey(dataJSON.publicKey);
                                let encodedString = jwt.split('.').slice(0, 2).join('.');
                                let sigValueHex = unwrappedJWT.sigHex;
                                let sig = new jsrsasign.KJUR.crypto.Signature({alg: 'SHA256withECDSA'});
                                sig.init(publicKeyObject);
                                sig.updateString(encodedString);
                                let isValid = sig.verify(sigValueHex);
                                if (!isValid) {
                                    console.log('invalid JWT');
                                    resolve(false);
                                } else {
                                    console.log('valid JWT');
                                    let queriedContact = new GraphConnectorContactData(dataJSON.guid, firstName, lastName);
                                    if (typeof dataJSON.userIDs != 'undefined' && dataJSON.userIDs != null) {
                                        queriedContact.userIDs = dataJSON.userIDs;

                                    }
                                    _this.contacts.push(queriedContact);
                                    resolve(true);
                                }
                            }else {
                                console.log('Response code is not 200');
                                resolve(false);
                            }
                        } else {
                            console.log(' undefined Response');
                            resolve(false);
                        }
                    });
                }
            });

        }else {
            return new Promise(function(resolve, reject) {
                resolve(false);
            });
        }
    }

    /**
     * Removes a location for a user identified by a given GUID.
     * @param  {string}   guid    GUID of the contact.
     * @returns  {boolean}  True if the Location is successfully  removed, false otherwise.
     */
    removeLocation(guid) {
        let success = false;
        if (this.globalRegistryRecord.guid == guid) {
            this.residenceLocation = '';
            success = true;
        } else {
            for (let i = 0; i < this.contacts.length; i++) {
                if (this.contacts[i].guid == guid) {
                    this.contacts[i].residenceLocation = '';
                    success = true;
                }
            }
        }
        return success;
    }

    /**
     * Adds a location for a user identified by a given GUID.
     * @param  {string}   guid          GUID of the contact.
     * @param  {string}   locationName    location  of the contact
     * @returns  {boolean}  Success if the Location is successfully added
     */
    setLocation(guid, locationName) {
        let success = false;
        if (typeof locationName !== 'undefined') {
            if (this.globalRegistryRecord.guid == guid) {
                this.residenceLocation = locationName;
                success = true;
            } else {
                for (let i = 0; i < this.contacts.length; i++) {
                    if (this.contacts[i].guid == guid) {
                        this.contacts[i].residenceLocation = locationName;
                        success = true;
                    }
                }
            }

        }
        return success;
    }

    /**
     * Returns all unique group names.
     * @returns  {array}   Array containing all unique group names.
     */
    getGroupNames() {
        let rtnSet = new Set();
        for (let i = 0; i < this.contacts.length; i++) {
            for (let j = 0; j < this.contacts[i].groups.length; j++) {
                rtnSet.add(this.contacts[i].groups[j]);
            }
        }
        for (let k = 0; k < this.groups.length; k++) {
            rtnSet.add(this.groups[k]);
        }

        let rtnArray = Array.from(rtnSet);
        return rtnArray;
    }

    /**
     * Returns all contacts with a given group name, including the owner if applicable.
     * @param  {string}   groupName    Name of the group to return.
     * @returns  {array}   matchingContacts    Contacts matching the given group name. The format is: Contacts<GraphConnectorContactData>.
     */
    getGroup(groupName) {
        let rtnArray = [];
        let ownerTmp;
        if (typeof groupName !== 'undefined') {
            for (let k = 0; k < this.groups.length; k++) {
                if (this.groups[k] == groupName) {
                    ownerTmp = new GraphConnectorContactData(this.globalRegistryRecord.guid, this.firstName, this.lastName);
                    (typeof this.residenceLocation == 'undefined') ? ownerTmp.residenceLocation = '' : ownerTmp.residenceLocation = this.residenceLocation;
                    ownerTmp.userIDs = this.globalRegistryRecord.userIDs;
                    ownerTmp.defaults = this.globalRegistryRecord.defaults;
                    ownerTmp.groups = this.groups;
                    ownerTmp.contactsBloomFilter1Hop = this.contactsBloomFilter1Hop;
                    ownerTmp._lastSyncBloomFilter1Hop = this.lastCalculationBloomFilter1Hop;
                    ownerTmp._lastSyncDomainUserIDs = this.globalRegistryRecord.lastUpdate;
                    rtnArray.push(ownerTmp);
                }
            }
            for (let i = 0; i < this.contacts.length; i++) {
                for (let j = 0; j < this.contacts[i].groups.length; j++) {
                    if (this.contacts[i].groups[j] == groupName) {
                        rtnArray.push(this.contacts[i]);
                    }
                }
            }
        }
        return rtnArray;
    }

    /**
     * Adds a group to a contact identified by a GUID.
     * @param  {string}   guid          GUID of the contact.
     * @param  {string}   groupName     Group Name to be added to the contact.
     * @returns  {boolean}  Success if the group name is successfully added.
     */
    addGroupName(guid, groupName) {
        let success = false;
        if (typeof groupName !== 'undefined') {
            if (guid == this.globalRegistryRecord.guid) {
                if (!this.groups.includes(groupName)) {
                    this.groups.push(groupName);
                    success = true;
                }
            } else {
                for (let i = 0; i < this.contacts.length; i++) {
                    if (this.contacts[i].guid == guid) {
                        if (!this.contacts[i].groups.includes(groupName)) {
                            this.contacts[i].groups.push(groupName);
                            success = true;
                        }
                    }
                }
            }
        }
        return success;
    }

    /**
     * Removes a group for a contact, identified by a GUID.
     * @param  {string}   guid          GUID of the contact.
     * @param  {string}   groupName     Group name to be removed for the contact.
     * @returns  {boolean}  Success if the group name is successfully removed.
     */
    removeGroupName(guid, groupName) {
        let success = false;
        if (typeof groupName !== 'undefined') {
            if (guid == this.globalRegistryRecord.guid) {
                for (let z = 0; z < this.groups.length; z++) {
                    if (this.groups[z] == groupName) {
                        this.groups.splice(z, 1);
                        success = true;
                    }
                }
            } else {
                for (let i = 0; i < this.contacts.length; i++) {
                    if (this.contacts[i].guid == guid) {
                        for (let j = 0; j < this.contacts[i].groups.length; j++) {
                            if (this.contacts[i].groups[j] == groupName) {
                                this.contacts[i].groups.splice(j, 1);
                            }
                            success = true;
                        }
                    }
                }
            }
        }
        return success;
    }

    /**
     * Returns all the contacts, excluding the owner.
     * @returns  {array}   All the contacts. The format is: Contacts<GraphConnectorContactData>.
     */
    getAllContacts() {
        return this.contacts;
    }

    /**
     * Removes a contact from the Graph Connector.
     * @param  {string}     guid      GUID of the user to be removed.
     * @returns  {boolean}  Success if the Contact is successfully removed.
     */
    removeContact(guid) {
        // remove from contacts
        let status = false;
        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].guid == guid) {
                this.contacts.splice(i, 1);
                status = true;
            }
        }

        // re-calculate BF1hop
        this.calculateBloomFilter1Hop();

        return status;
    }

    /**
     * Sets the bloomfilter of a contact.
     * @param  {string}     guid      GUID of the contact to set the bloom filter.
     * @param  {BloomFilter}     bf      BloomFilter object.
     * @returns {boolean} success if the contact guid is found and the bloom filter is set
     */
    setBloomFilter1HopContact(guid, bf) {
        let success = false;
        for (let i = 0; i < this.contacts.length; i++) {
            if (this.contacts[i].guid == guid) {
                this.contacts[i].contactsBloomFilter1Hop = bf;
                success = true;
            }
        }
<<<<<<< HEAD
        return success;
    }

    /**
     * Calculates the Bloom filter containing all non-private contacts.
     */
    calculateBloomFilter1Hop() {
        let bf = new BloomFilter(
            4314,     // number of bits to allocate. With 300 entries, we have a false positive rate of 0.1 %.
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
     * Returns the list of contacts which matches the search string "name". Ex. "Joh" will return users with first or last name "John" or "Aljohanas".
     * @param  {string}   name    First or last name to look for in the contact list.
     * @returns  {array}   matchingContacts       Contacts matching the given name. The format is: Contacts<GraphConnectorContactData>.
     */
    getContact(name) {
        // TODO: optimize, e.g., find misspelled people
        let rtnArray = [];
        let fname;
        let lname;

        let patt = new RegExp(name, 'i');
        for (let i = 0; i < this.contacts.length; i++) {
            fname = this.contacts[i].firstName;
            lname = this.contacts[i].lastName;

            if (patt.test(fname) || patt.test(lname)) {
                rtnArray.push(this.contacts[i]);
            }
        }

        return rtnArray;
    }

    /**
     * Returns success if the userID is successfully added for a contact
     * @param  {string}   guid    guid of the contact whose userID has to be added.
     * @param  {string}   uid   userID which is supposed to be added.
     * @param  {string}   domain   domain which is supposed to be added.
     * @returns  {boolean}   success       returns true if userID is successfully added to the contact.
     */
    setContactUserIDs(guid, uid, domain) {
        let success = false;
        let tmpUserID = [];

        for (let i = 0; i < this.contacts.length; i++) {

            if (this.contacts[i].guid == guid) {

                for (let j = 0; j < this.contacts[i].userIDs.length; j++) {

                    if (this.contacts[i].userIDs[j].uid == uid && this.contacts[i].userIDs[j].domain == domain) {
                        return false;
                    }
                }
                tmpUserID = this.contacts[i].userIDs;
                let item = new Object();
                item.uid = uid;
                item.domain = domain;
                tmpUserID.push(item);
                this.contacts[i].userIDs = tmpUserID;
                success = true;
            }
        }
        return success;
    }

    /**
     * Returns ArrayList of userIDs of a contact, if contact not found then it will return a string 'Contact Does not exist'
     * @param  {string}   guid    guid of the contact whose userID has to be added.
     * @returns  {array}   success       returns Arraylist of userID of a contact, if contact not found then it will return a string 'Contact Does not exist'
     */
    getContactUserIDs(guid) {
        let userIDsArray = [];
        let found = false;
        for (let i = 0; i < this.contacts.length; i++) {

            if (this.contacts[i].guid == guid) {
                found = true;

                for (let j = 0; j < this.contacts[i].userIDs.length; j++) {
                    userIDsArray.push(this.contacts[i].userIDs[j]);
                }
            }
        }

        if (!found) {
            return false;
        } else {
            return userIDsArray;
        }
    }

    /**
     * Sets active attribute of the GlobalRegistryRecord.
     * @param  {int}   int    Value to set the active flag of the GlobalRegistryRecord to.
     * @returns {boolean} True if Active is succesfully set, false otherwise.
     */
    setActive(int) {
        if (typeof int === 'number') {
            this.globalRegistryRecord.active = int;
            this.globalRegistryRecord.lastUpdate = new Date().toISOString();
            return true;
        }
        return false;
    }

    /**
     * Sets revoked attribute of the GlobalRegistryRecord.
     * @param  {int}   int    Value to set the revoked flag of the GlobalRegistryRecord to.
     * @returns {boolean} True if Revoked is succesfully set, false otherwise.
     */
    setRevoked(int) {
        if (typeof int === 'number') {
            this.globalRegistryRecord.revoked = int;
            this.globalRegistryRecord.lastUpdate = new Date().toISOString();
            return true;
        }
        return false;
    }

    /**
     * Sets Timeout attribute of the GlobalRegistryRecord.
     * @param  {Date}   Timeout  Date to set the timeout of the GlobalRegistryRecord to.
     * @returns {boolean} True if Timeout is succesfully set, false otherwise.
     */
    setTimeout(Timeout) {
        let now = new Date();
        if (typeof Timeout == 'object' && Timeout instanceof Date && Timeout > now) {
            this.globalRegistryRecord.timeout = Timeout.toISOString();
            this.globalRegistryRecord.lastUpdate = new Date().toISOString();
            return true;
=======
      }
    }
    return success;
  }

  /**
   * Gets all the contacts.
   * @returns  {array}   All the contacts. The format is: Contacts<GraphConnectorContactData>.
   */
  getAllContacts() {
    return this.contacts;
  }

  /**
   * Remove a contact from the Graph Connector.
   * @param  {string}     guid      GUID of the user to be removed.
   */
  removeContact(guid) {
    // remove from contacts
    let status = false;
    for (let i = 0; i < this.contacts.length; i++) {
      if (this.contacts[i].guid == guid) {
        this.contacts.splice(i, 1);
        status = true;
      }
    }
    return status;

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
   * returns the list of contacts which matches the search string "name". Ex. "Joh" will return users with first or last name "John" or "Aljohanas".
   * @param  {string}   name    First or last name to look for in the contact list.
   * @returns  {array}   matchingContacts       Contacts matching the given name. The format is: Contacts<GraphConnectorContactData>.
   */
    getContact(name) {
      // TODO: optimize, e.g., find misspelled people
      let rtnArray = [];
      let fname;
      let lname;

      //let tmp = '(?=' + name + ')+[a-z]*\\w';
      let patt =  new RegExp(name, 'i');
      for (let i = 0; i < this.contacts.length; i++) {
        fname = this.contacts[i].firstName;
        lname = this.contacts[i].lastName;

        if (patt.test(fname) || patt.test(lname)) {
          rtnArray.push(this.contacts[i]);
>>>>>>> fix formatting issues
        }
        return false;
    }

    /**
     Returns the globalRegistryRecord for the owner.
     @returns {object}
     */
    getGlobalRegistryRecord() {
        return this.globalRegistryRecord;
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
            if (this.contacts[i].guid === guid) {
                directContactsArray.push(this.contacts[i]);
            }
            let bf1hop = new BloomFilter(
                4314,   // number of bits to allocate. With 300 entries, we have a false positive rate of 0.1 %.
                10        // number of hash functions.
            );
            bf1hop = this.contacts[i].contactsBloomFilter1Hop;

            if (bf1hop !== undefined) {
                bf1hop = this.extend(new BloomFilter(4314, 10), bf1hop);
                if (bf1hop.test(guid)) {
                    fofContactsArray.push(this.contacts[i]);
                }
            }
        }
        let rtnArray = [];
        rtnArray.push(directContactsArray, fofContactsArray);
        return rtnArray;
    }

    /**
     * Type cast one object to another equivalent to "$.extend" of jquery
     * @param  {Object}     obj1      Object to which the other object need to be typecasted.
     * @param  {Object}     obj2      Object needs to typecasted.
     * @returns  {Object}   Obj2 with typecasted to obj1.
     */
    extend(obj1, obj2) {
        for (var key in obj2)
            if (obj2.hasOwnProperty(key))
                obj1[key] = obj2[key];
        return obj1;
    }

    // TODO: exportGraphData(?){}
    // TODO: importGraphData(?){}

}

export default GraphConnector;