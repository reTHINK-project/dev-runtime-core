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
/**
* Represents information about a contact.
* @author beierle@tu-berlin.de
*/
class GraphConnectorContactData {

  /**
   * Constructs a new object representing information about one contact.
   * @param  {String}     guid        The GUID of the new contact.
   * @param  {String}   firstName   The first name of the new contact.
   * @param  {String}   lastName    The last name of the new contact.
   */
    constructor(guid, firstName, lastName) {
      this._guid = guid;
      this._userIDs = [];
      this._firstName = firstName;
      this._lastName = lastName;
      this._privateContact = false;
      this._lastSyncBloomFilter1Hop = new Date(0).toISOString();
      this._lastSyncDomainUserIDs = new Date(0).toISOString();
      this._residenceLocation;
      this._groups = [];
    }

    /**
     * Returns the GUID.
     * @returns  {String}     GUID        GUID of the contact.
     */
    get guid() {
      return this._guid;
    }

    /**
     * Sets the GUID.
     * @param  {String}     GUID        GUID of the contat.
     */
    set guid(guid) {
      this._guid = guid;
    }

    /**
     * Returns the user IDs.
     * @returns  {List<String>}     userIDs        UserIDs of the contact.
     */
    get userIDs() {
      return this._userIDs;
    }

    /**
     * Sets the userIDs.
     * @param  {List<String>}     userIDs        UserIDs of the contat.
     */
    set userIDs(userIDs) {
      this._userIDs = userIDs;
      this._lastSyncDomainUserIDs = new Date().toISOString();
    }

    /**
     * Returns the first name.
     * @returns  {String}     firstName        First name of the contact.
     */
    get firstName() {
      return this._firstName;
    }

    /**
     * Sets the first name.
     * @param  {String}     firstName        First name of the contat.
     */
    set firstName(firstName) {
      this._firstName = firstName;
    }

    /**
     * Returns the last name.
     * @returns  {String}     lastName        Last name of the contact.
     */
    get lastName() {
      return this._lastName;
    }

    /**
     * Sets the last name.
     * @param  {String}     lastName        Last name of the contat.
     */
    set lastName(lastName) {
      this._lastName = lastName;
    }

    /**
     * Returns the privacy status of the contact.
     * @returns  {Boolean}     privateContact        True/false value indicating the privacy status of the contact.
     */
    get privateContact() {
      return this._privateContact;
    }

    /**
     * Sets the privacy status of the contact according to the given Boolean value.
     * @param  {Boolean}     boolPrivate        True/false value indicating the privacy status of the contact.
     */
    set privateContact(boolPrivate) {
      this._privateContact = boolPrivate;
    }

    /**
     * Returns the Bloom filter containing the hashed GUIDs of the contacts for the contact.
     * @returns  {BloomFilter}     bf        Bloom filter for the contact.
     */
    get contactsBloomFilter1Hop() {
      return this._contactsBloomFilter1Hop;
    }

    /**
     * Sets the friends-of-friends Bloom filter containing the hashed GUIDs of the contacts for the contact.
     * @param  {BloomFilter}     bf        Bloom filter for the contact.
     */
    set contactsBloomFilter1Hop(bf) {
      this._contactsBloomFilter1Hop = bf;
      this._lastSyncBloomFilter1Hop = new Date().toISOString();
    }

    /**
     * Returns the geohash of the residence location.
     * @returns  {String}     geohash        Geohash of the residence location.
     */
    get residenceLocation() {
      return this._residenceLocation;
    }

    /**
     * Sets the geohash of the residence location.
     * @param  {String}     geohash        Geohash of the residence location.
     */
    set residenceLocation(geohash) {
      this._residenceLocation = geohash;
    }

    /**
     * Returns the groups.
     * @returns  {List<String>}     groups        Groups of the contact.
     */
    get groups() {
      return this._groups;
    }

    /**
     * Sets the groups.
     * @param  {List<String>}     groups        Groups of the contat.
     */
    set groups(groups) {
      this._groups = groups;
    }

}

export default GraphConnectorContactData;
