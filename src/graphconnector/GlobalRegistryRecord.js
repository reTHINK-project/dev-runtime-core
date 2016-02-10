/**
* Represents the user's information for the global registry.
* @author beierle@tu-berlin.de
*/
class GlobalRegistryRecord {

  /**
   * Constructs a new empty object.
   */
    constructor() {
      this.guid;
      this.salt;
      this.userIDs = [];
      this.lastUpdate;
      this.timeout;
      this.publicKey;
      this.active;
      this.revoked;
    }

  /**
   * Constructs a new object representing information about one contact.
   * @returns {Object}  object  A JavaScript Object with all fields for the Global Registry Record.
   */
    getRecord() {

      // TODO: give error if fields are missing

      let record = new Object();
      record.guid = this.guid;
      record.salt = this.salt;
      record.userIDs = this.userIds;
      record.lastUpdate = this.lastUpdate;
      record.timeout = this.timeout;
      record.publicKey = this.publicKey;
      record.active = this.active;
      record.revoked = this.revoked;

      return record;
    }

}

export default GlobalRegistryRecord;
