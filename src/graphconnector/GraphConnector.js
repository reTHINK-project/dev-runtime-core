import GraphConnectorContactData from './GraphConnectorContactData';
import BloomFilter from './BloomFilter';

/**
* The Graph Connector contains the contact list/address book.
* @author beierle@tu-berlin.de
*/
class GraphConnector {

  // TODO: data format GUID
  // TODO: key / GUID generation
  // TODO: import / export methods
  // TODO: communication with global registry

  /**
   * Constructs a new and empty Graph Connector.
   */
  constructor() {
    this.contacts = [];
    this.lastCalculationnBloomFilter1Hop = new Date(0).toISOString();
  }

  /**
   * Generates a GUID and returns a passphrase from which the GUID can be re-created later.
   * @returns  {array}    passphrase      A list of words.
   */
  generateGUID() {
    // TODO
  }

  /**
   * Generates a public/private key pair from a given passphrase.
   * @param  {array}     passphrase     A list of words.
   */
  useGUID() {
    // TODO
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
