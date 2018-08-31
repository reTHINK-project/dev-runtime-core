// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('StorageManager');

class StorageManager {

  constructor(db, storageName, schemas, version = 1) {
    if (!db) throw Error('The Storage Manager needs the database instance');
    if (!storageName) throw Error('The Storage Manager needs the storage name');

    let stores =  {};

    if (schemas) {
      stores = schemas;
    } else {
      stores[storageName] = 'key,version,value';
    }

    db.version(version).stores(stores);
    db.open().then((db) => {
      log.info('Found database name ' + db.name + ' with version no: ' + db.verno);
    }).catch(log.error);

    this.db = db;
    this.storageName = storageName;
  }

  _checkKey(key) {
    if (typeof key !== 'string') return key.toString();
    return key;
  }

  _getTable(key) {
    let name;

    try {
      name = this.db.table(this.storageName).name;
    } catch (error) {
      name = this.db.table(key).name;
    }

    return name;
  }

  _getPrimaryKey(table) {
    return this.db.table(table).schema.primKey.name;
  }

  _isDefaultSchema(table) {
    const name = this._getTable(table);
    const schema = this.db[name].schema.instanceTemplate;
    return schema.hasOwnProperty('value') && schema.hasOwnProperty('version') && schema.hasOwnProperty('key');
  }

  /**
   * Adds a new entry to the database for a given key, together with its version.
   * If an entry for the given key is already stored in the database, it will be updated.
   * @param {!string} key - key that can be used with {@link storageManager.get} to retrieve the value object
   * @param {!string} version - version descriptor for the given value
   * @param value - value stored in the database that is mapped to given key
   * @param {!string} table - table which should be looking for
   * @returns {Promise} result - Promise that will be fulfilled with the key if the entry was stored successfully,
   * otherwise it is rejected with an error.
   * @memberof StorageManager
   */
  set(key, version, value, table) {
    log.info('[StorageManager] - set ', key, value);
    table = table ? table : key;
    const name = this._getTable(table);
    const primaryKey = this._getPrimaryKey(name);

    // Object.assign(value, {version: version});

    let data = value;

    if (this._isDefaultSchema(table)) {
      data = {
        key: key,
        version: version,
        value: value
      };
    } else {
      const tmp = {};
      tmp[primaryKey] = key;
      Object.assign(data, tmp);
    }

    return this.db[name].put(data);
  }

  /**
   * Get a entry value from the database for a given key.
   * If no entry is found undefined is returned.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {!any} value - value which should be found
   * @param {!string} table - table which should be looking for
   * @returns {Promise} result - Promise that will be fulfilled with the value.
   * @memberof StorageManager
   */
  get(key, value, table) {
    console.info('[StorageManager] - get ', key, value);
    table = table ? table : key;
    const name = this._getTable(table);
    const primaryKey = this._getPrimaryKey(name);

    return this.db.transaction('rw!', this.db[name], () => {

      if (!key && !value) {
        return this.db[name].toArray().then(objects => {
          return objects.reduce((acc, key) => {
            acc[key[primaryKey]] = key;
            return acc;
          }, {});
        });
      }

      if (!value) {

        return this.db[name].where(primaryKey).equals(key).first()
          .then(object => {
            if (object && object.hasOwnProperty('value')) {
              return object.value;
            } else {
              return object;
            }
          });

      } else {

        let type = typeof value;

        if (Array.isArray(value)) {
          type = 'array';
        }

        switch (type) {
          case 'string':

            return this.db[name].where(key).equals(value).first()
              .then(object => {
                if (object && object.hasOwnProperty('value')) {
                  return object.value;
                } else {
                  return object;
                }
              });

          case 'object': {
            const strPath = 'value.' + Object.keys(value).toString();
            const strValue = Object.values(value);
            console.log(strPath, strValue);

            return this.db[name].where(strPath).anyOf(strValue).first()
              .then(object => {
                if (object && object.hasOwnProperty('value')) {
                  return object.value;
                } else {
                  return object;
                }
              });
          }

          case 'array':
            console.log('ARRAY:', value);
            return this.db[name].where(value).then(object => {
              if (object && object.hasOwnProperty('value')) {
                return object.value;
              } else {
                return object;
              }
            });
        }
      }
    });
  }

  /**
   * Get a entry version from the database for a given key.
   * If no entry is found undefined is returned.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {any} value - the value which sould be used to find the storage resource
   * @param {!string} table - table which should be looking for
   * @returns {Promise} result - Promise that will be fulfilled with the version.
   * @memberof StorageManager
   */
  getVersion(key, value, table) {
    log.info('[StorageManager] - getVersion for key ', key);
    table = table ? table : key;
    const name = this._getTable(table);
    const primaryKey = this._getPrimaryKey(name);

    let data = value;

    if (!value) {
      data = key;
    }

    return this.db.transaction('rw!', this.db[name], () => {

      return this.db[name].where(primaryKey)
        .equals(data)
        .first()
        .then((object) => {
          if (object && object.hasOwnProperty('version')) {
            return object.version;
          } else {
            return object;
          }
        })
        .catch(error => {
          log.info('error getting the version for ', key, ' with error: ', error);
          return undefined;
        });
    });
  }

  /**
   * Delete a entry from the database for a given key.
   * @param {!string} key - key that was stored using {@link storageManager.set}
   * @param {!any} value - the value which sould be used to find the storage resource
   * @param {!string} table - table which should be looking for
   * @returns {Promise} result - Promise that will be fulfilled with the number of affected rows.
   * @memberof StorageManager
   */
  delete(key, value, table) {
    table = table ? table : key;
    const name = this._getTable(table);
    const primaryKey = this._getPrimaryKey(name);

    let data = value;

    if (!value) {
      data = key;
    }

    return this.db[name]
      .where(primaryKey)
      .equals(data)
      .delete();
  }

}

export default StorageManager;
