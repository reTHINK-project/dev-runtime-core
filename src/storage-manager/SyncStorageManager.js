// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('StorageManager');
import PouchDB from 'pouchdb';

class SyncStorageManager {

  constructor(db, storageName, remoteStorage) {
    if (!db) throw Error('The Storage Manager needs the database instance');
    if (!storageName) throw Error('The Storage Manager needs the storage name');
    if (!remoteStorage) throw Error('The Storage Manager needs the remoteStorage constructor param');

    this.db = db;
    this.storageName = storageName;
    this._remoteStorage = remoteStorage + '/' + storageName;
  }


  // start backup with remoteStorage server. 

  connect(options) {
    // return this.db.connect(this._remoteStorage, options);

    let live = (options && options.hasOwnProperty('once')) ? !options.once : false;

    let opts = { retry: true, live: live };

    return this.replicationHandler = this.db.replicate.to(this._remoteStorage, opts, this._syncError());
  }

  // backup at remote backup server of doc identified by id

  backup(id) {
    // return this.db.connect(this._remoteStorage, options);

    let opts = { retry: true, live: false };

    if (id) opts.doc_ids =[id];

    return this.replicationHandler = this.db.replicate.to(this._remoteStorage, opts, this._syncError());
  }

  sync(id) {
    // return this.db.connect(this._remoteStorage, options);
    console.log('[SyncStorageManager.sync] starting ');

    let opts = { retry: true, include_docs: true, live: false };

    if (id) opts.doc_ids =[id];

    return this.replicationHandler = this.db.replicate.from(this._remoteStorage, opts, this._syncError());
  }

  // There was some form or error syncing
  _syncError() {
    // do something
  }


  // stop backup with remoteStorage server.

  disconnect() {
    return this.replicationHandler.cancel();
  }

  /**
   * Adds a new entry to the database for a given key, together with its version.
   * If an entry for the given key is already stored in the database, it will be updated.
   * @param {!string} key - key that can be used with {@link storageManager.get} to retrieve the value object
   * @param value - value stored in the database that is mapped to given key
   * @returns {Promise} result - Promise that will be fulfilled with the stored doc if the entry was stored successfully,
   * otherwise it is rejected with an error.
   * @memberof StorageManager
   */

  set(key, value, version) {
    if (!key) throw Error('[SyncStorageManager.set] key is mandatory param');
    if (!value) throw Error('[SyncStorageManager.set] value is mandatory param');

    return new Promise((resolve, reject) => {
      console.log('[SyncStorageManager.set] key ', key, ' value ', value);

      value._id = key;

      this.db.get(key).then((doc) => {
        let data = typeof value === 'string' ? { value: value } : value;

        // if no version is asked to set, it is assumed to update the same version of the document
        // in order to avoid the increase of storage quota used
        doc._rev = version ? version : doc._rev;

        Object.assign(doc, data);
        this.db.put(doc).then(() => {
          resolve(doc);
        });

      }, (err) => {
        console.error('[SyncStorageManager.set] ', err);
        if (err.name === 'not_found') {
          let opts = {};
          if (version) {
            value._rev = version;
            opts.new_edits = false;
          } 
          this.db.put(value, opts).then(() => {
            resolve(value);
          },(err) => {reject(err); } );
        } else reject(err);

      });
    });

  }

  /**
   * Get a entry value from the database for a given key.
   * If no entry is found undefined is returned.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {!any} value - value which should be found
   * @returns {Promise} result - Promise that will be fulfilled with the value.
   * @memberof StorageManager
   */
  get(key, value) {
    // TODO: add options for pagination for DOs with high number of child objects
//    if (!key) throw Error('[SyncStorageManager.get] key is mandatory param');

    return new Promise((resolve, reject) => {

      log.info('[SyncStorageManager.get] key ', key, ' value ', value);

      if (key) {
        if (!value) {
          this.db.get(key).then((doc)=>{
            resolve(doc);
          }, (err)=>{
            if (err.name === 'not_found') resolve(undefined)
            else reject(err);
          });
        } 
        else this.db.get(key).then((doc) => {
          log.info('[SyncStorageManager.get] retrieved doc ', doc);
          resolve(doc[value]);
        }, (err)=>{
          if (err.name === 'not_found') resolve(undefined)
          else reject(err);
      });
      } else {
        this.db.allDocs({include_docs: true}).then((docs)=>{
          let result = [];
          docs.rows.forEach((doc)=>{
            result.push(doc.doc);
          });
          resolve(result);
        }, (err)=>{
          if (err.name === 'not_found') resolve(undefined)
          else reject(err);
        });
      }

    });

  }

  /**
   * Delete a entry from the database for a given key or the full DB in case the key is not provided.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {!any} value - the value which sould be used to find the storage resource
   * @returns {Promise} result - Promise that will be just fulfilled with no values if something was deleted otherwise it is fullfilled with undefined.
   * @memberof StorageManager
   */

  delete(key, value) {
    //todo: if no key delete the db
//    if (!key) throw Error('[SyncStorageManager.get] key is mandatory param');
    return new Promise((resolve, reject) => {

      log.info('[SyncStorageManager.delete] key ', key, ' value ', value);

      if (key) {
        this.db.get(key).then((doc) => {
          if (!value) {
            this.db.remove(doc).then(()=>{
              resolve();
            }, resolve(undefined));
          } else {
            delete doc[value];
            resolve(this.db.put(doc));
          }
        }, (err)=>{
          if (err.name === 'not_found') resolve(undefined)
          else reject(err);
        });
  
      } else {
        let db = new PouchDB(this._remoteStorage);
        db.destroy().then(()=> resolve(), (err) => reject(err) )
      } 

    });
  }

  /**
   * Get the version from the database for a given key.
   * If no entry is found undefined is returned.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {any} value - the value which sould be used to find the storage resource
   * @param {!string} table - table which should be looking for
   * @returns {Promise} result - Promise that will be fulfilled with the version. If not found it is fullfilled with undefined
   * @memberof StorageManager
   */
  getVersion(key) {
    if (!key) throw Error('[SyncStorageManager.get] key is mandatory param');


    return new Promise((resolve, reject) => {

      log.info('[SyncStorageManager.getVersion] for key ', key);

        this.db.get(key).then((doc)=>{
          resolve(doc._rev);
        }, (err)=>{
          if (err.name === 'not_found') resolve(undefined)
          else reject(err);
        });
    });

  }



}

export default SyncStorageManager;
