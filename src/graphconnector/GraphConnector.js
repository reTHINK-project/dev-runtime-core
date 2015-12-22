import GraphConnectorContactData from './GraphConnectorContactData';
import BloomFilter from './BloomFilter';
import GlobalRegistryRecord from './GlobalRegistryRecord';
import bitcoin from 'bitcoinjs-lib';
import bip39 from 'bip39';
import sjcl from 'sjcl';
import jsrsasign from 'jsrsasign';

/**
* The Graph Connector contains the contact list/address book.
* @author beierle@tu-berlin.de
*/
class GraphConnector {

  // TODO: import / export methods
  // TODO: communication with global registry

  /**
   * Constructs a new and empty Graph Connector.
   */
  constructor() {
    this.contacts = [];
    this.lastCalculationnBloomFilter1Hop = new Date(0).toISOString();

    this.globalRegistryRecord = new GlobalRegistryRecord();
    this._prvKey;

    this.domainUserIDs = [];
    this.firstName;
    this.lastName;
  }

  /**
   * Generates a GUID and returns a mnemonic from which the GUID can be re-created later.
   * @returns  {String}    mnemonic      A string with 16 words.
   */
  generateGUID() {

    // generate mnemonic and salt
    Buffer.TYPED_ARRAY_SUPPORT = true;
    let mnemonic = bip39.generateMnemonic(160);

    let saltWord = bip39.generateMnemonic(8);
    this._createKeys(mnemonic, saltWord);

    // set lasUpdate date
    this.globalRegistryRecord.lastUpdate = new Date();

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
   * @param  {String}     mnemonicAndSalt     A string of 16 words.
   */
  useGUID(mnemonicAndSalt) {
    // TODO: check if format is correct and if all words are from bip39 english wordlist
    let lastIndex = mnemonicAndSalt.lastIndexOf(' ');
    let mnemonic = mnemonicAndSalt.substring(0, lastIndex);
    let saltWord = mnemonicAndSalt.substring(lastIndex + 1, mnemonicAndSalt.length);
    this._createKeys(mnemonic, saltWord);

    // TODO: retrieve current info from Global Registry and fill this.globalRegistryRecord
  }

  /**
   * Creates the keys from mnemonic and salt. Also sets public key, guid, and salt for globalRegistryRecord.
   * @param  {String}     mnemonic     A string with 15 words.
   * @param  {String}     salt         A word.
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
    let publicKeyPEM = jsrsasign.KEYUTIL.getPEM(pubKey, 'PKCS8PUB');
    publicKeyPEM = publicKeyPEM.replace(/(\r\n|\n|\r)/gm, '');
    this.globalRegistryRecord.publicKeyPEM = publicKeyPEM;

    // generate salt
    let saltHashedBitArray = sjcl.hash.sha256.hash(saltWord);
    let salt = sjcl.codec.base64.fromBits(saltHashedBitArray);
    this.globalRegistryRecord.salt = salt;

    // generate GUID
    let iterations = 10000;
    let guidBitArray = sjcl.misc.pbkdf2(this.globalRegistryRecord.publicKeyPEM, salt, iterations);
    let guid = sjcl.codec.base64.fromBits(guidBitArray);
    this.globalRegistryRecord.guid = guid;
  }

  /**
   * SignGenerates a public/private key pair from a given mnemonic.
   * @returns  {String}     JWT     JSON Web Token ready to commit to Global Registry.
   */
  signGlobalRegistryRecord() {

    let record = this.globalRegistryRecord.getRecord();

    let jwt = KJUR.jws.JWS.sign(null, {alg: 'ES256'}, record, this._prvKey);
    return jwt;
  }

  /**
   * Add a contact to the Graph Connector.
   * @param  {GUID}     guid          GUID of the new contact.
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
   * @param  {GUID}     guid      GUID of the user to be removed.
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
    this.lastCalculationnBloomFilter1Hop = new Date().toISOString();
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
   * @param  {GUID}     guid      GUID of the contact to look for.
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
