// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('DataObjectsStorage');

import { assign, deepClone, divideURL } from '../utils/utils';

import { createSyncDB } from '../runtime/Storage';

class DataObjectsStorage {

  constructor(storageManager, storedDataObjects = {}, factory, runtimeUrl) {
    if (!storageManager) throw new Error('[Store Data Objects] - Needs the storageManager component');

    this._storageManager = storageManager;

    this._storeDataObject = storedDataObjects;

    this._cache = {};

    this._createSyncDB = createSyncDB; // to create Data Objects to be synched with remote storages
    this._remotes = {}; // List of DO synched with remote storages
    this._factory = factory;
    this._table = 'syncherManager:ObjectURLs';
    this._remoteStorageTable = 'dataObjectStorage';
    this._remoteSchema = 'url';
    this._runtimeUrl = runtimeUrl;
  }

  // load Data Objects synched with remote Storages

  loadRemote(resume = false) {
    let _this = this;
    return new Promise((resolve, reject) => {
      let loading = [];
      let synching = [];

      _this._storageManager.get(null, null, 'remotes').then((remotes) => {

        // in case we don't have any remotes locally stored
        log.log('[StoreDataObjects.loadRemote] remotes: ', remotes);
        if (!remotes) resolve();

        if (!resume) _this._remotes = remotes;

        log.log('[StoreDataObjects.loadRemote] loading: ', _this._remotes);

        let remoteObjects = Object.keys(remotes);

        // in case we don't have any remotes locally stored
        if (remoteObjects.length === 0) resolve();

        remoteObjects.forEach((db) => {
          let table = 'do-' + db.split('/')[3];
          _this._remotes[db] = createSyncDB(table, this._factory);
          //            _this._remotes[remote] = createSyncDB(remote, _this._factory, 'remoteDataObjectStorage' );
          loading.push(_this._remotes[db].get());
        });

        Promise.all(loading).then((remotes) => {
          log.log('[StoreDataObjects.loadRemote] loaded: ', remotes);
          //TODO: init this._storeDataObject with loaded data objects
          /*          Object.keys(remotes).forEach((remote) => {
          
                      synching.push(_this.sync(remote));
                    });
                    Promise.all(synching).then((dataObjs) => {*/

          let dataObjs = remotes;

          if (dataObjs.length === 0) resolve();

          dataObjs.forEach((dO) => {

            let dataObj = _this._remoteDoc2dataObject(dO);
            //              Object.keys(dO).forEach((i) => {

            log.log('[StoreDataObjects.loadRemote] loaded remote ', dataObj);
            //              if (dO[remote].isReporter) {
            let type = this._getTypeOfObject(dataObj.isReporter);

            if (!_this._storeDataObject) _this._storeDataObject = {};

            if (!_this._storeDataObject.hasOwnProperty(type)) _this._storeDataObject[type] = {};

            _this._storeDataObject[type][dataObj.url] = dataObj;

            //             });
            //            });
            resolve(_this._storeDataObject);

          }, (error) => { reject(error) });
        });
      }, (error) => {
        reject(error);
      });

      resolve();

    });
  }

  // delete Data Objects synched with remote Storages

  deleteRemotes() {
    let _this = this;
    return new Promise((resolve, reject) => {
      let deleting = [];
      let disconnecting = [];

      _this._storageManager.get(null, null, 'remotes').then((remotes) => {

        // in case we don't have any remotes locally stored
        log.info('[StoreDataObjects.deleteRemotes] remotes: ', remotes);
        if (!remotes) resolve();

        let remoteObjects = Object.keys(_this._remotes);

        // in case we don't have any remotes locally stored

        if (remoteObjects.length === 0) resolve();

        remoteObjects.forEach((db) => {
          deleting.push(
            _this._remotes[db].disconnect()
          );
          deleting.push(
            _this._remotes[db].delete()
          );
        });

        Promise.all(deleting).then(() => {
          log.log('[StoreDataObjects.deleteRemotes] deleted.');

          resolve();

        }, (error) => { resolve(); });
      });

      resolve();

    });
  }

  /**
   * @description should set the initial state of the dataObjectURL to be resumed if necessary;
   *
   * @param {DataObjectURL} url - dataObjectURL to be saved;
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {SchemaURL} schema - the schema url
   * @param {String} status - the status of current dataObject
   * @param {HypertyURL} reporter - the Reporter hypertyURL
   * @param {Array<HypertyURL>} subscription - list of subscriptions
   * @param {Array<DataObjectChild>} children - list of childs of dataObjectURL
   * @param {Array<String>} childrens - list of childrens, like, 'chatmessage';
   * @param {Array<UserURL} subscriberUser - list of subscribed users;
   */

  set(metadata) {

    return new Promise((resolve, reject) => {
      let storeDataObject = this._storeDataObject ? this._storeDataObject : {};
      let type = this._getTypeOfObject(metadata.isReporter);


      if (!storeDataObject.hasOwnProperty(type)) storeDataObject[type] = {};

      if (!storeDataObject[type].hasOwnProperty(metadata.url)) {
        storeDataObject[type][metadata.url] = {};
        storeDataObject[type][metadata.url].subscriptions = [];// TODO:do we need this?
        storeDataObject[type][metadata.url].subscriberUsers = [];// TODO:do we need this?
        storeDataObject[type][metadata.url].childrenObjects = {};
        storeDataObject[type][metadata.url].data = {};
      }

      Object.assign(storeDataObject[type][metadata.url], metadata);
      delete storeDataObject[type][metadata.url].subscriberUser;
      delete storeDataObject[type][metadata.url].subscriberHyperty;

      storeDataObject[type][metadata.url].backup = metadata.hasOwnProperty('backup') ? metadata.backup : false;

      /*if (schema) storeDataObject[type][metadata.url].schema = schema;
      if (status) storeDataObject[type][metadata.url].status = status;
      if (childrenResources) storeDataObject[type][metadata.url].childrenResources = childrenResources;*/

      if (metadata.subscriberHyperty && !metadata.isReporter) { // TODO: do we need this?
        this._updateToArray(storeDataObject[type], metadata.url, 'subscriptions', metadata.subscriberHyperty);
      }

      //storeDataObject[type][metadata.url].owner = owner;

      if (metadata.subscriberUser) { // TODO: do we need this?
        if (storeDataObject[type][metadata.url].subscriberUsers.indexOf(metadata.subscriberUser)) {
          this._updateToArray(storeDataObject[type], metadata.url, 'subscriberUsers', metadata.subscriberUser);
        }
      }

      this._storeDataObject = storeDataObject;

      let backup = metadata.hasOwnProperty('backup') ? metadata.backup : false;
      let table = backup ? metadata.url : this._table;
      //      let db = backup ? table.split('://')[1] : this._table;
      let db = backup ? 'do-' + table.split('/')[3] : this._table;
      if (backup && !this._remotes[metadata.url]) {
        let schema = {};
        schema[table] = this._remoteSchema;
        this._remotes[metadata.url] = createSyncDB(db, this._factory);
      }

      // Save Data Object URL at remotes table to support resumes

      if (backup) this._storageManager.set(table, 0, db, 'remotes');

      let storage = backup ? this._remotes[table] : this._storageManager;

      if (backup) {
        // lets connect to remote storage to enable sync
        storage.set(table, storeDataObject[type][metadata.url]).then(() => {
          if (metadata.isReporter) storage.connect();
          resolve(storeDataObject[type][metadata.url]);
        }, (error) => {
          log.error('[DataObjectStorage.set] failed to save into remote storage: ', error);
          reject(error);
        });
      } else {
        console.log('[DataObjectStorage.set] _storeDataObject before filter ', this._storeDataObject);
        storage.set(db, 1, this._filterRemotes(this._storeDataObject), table).then(() => {
          resolve(storeDataObject[type][metadata.url]);
        });
      }
    });
  }


  // to filter Data Objects that are stored outside the ObjectURLs table

  _filterRemotes(storeDataObject) {
    let remotes = Object.keys(this._remotes);

    let filtered = deepClone(storeDataObject);

    console.log('[DataObjectStorage._filterRemotes] starting filtering ', filtered);

    remotes.forEach((remote) => {
      if (filtered['reporters'] && filtered['reporters'][remote]) {
        delete filtered['reporters'][remote];
        console.log('[DataObjectStorage._filterRemotes] filter updated ', filtered);
      }
      else delete filtered['observers'][remote];
    });

    console.log('[DataObjectStorage._filterRemotes] ', filtered);

    return filtered;
  }

  // Initial Sync of Observer to avoid later mismatches with sync revisions
  // OUtdated: not used anymore
  /*
    initialObserverSync(resource, backupRevision) {
      // to be completed
      let table = resource.split('/')[3];
  
      let _this = this;
  
      let options = {table: table, observer: true, baseRevision: backupRevision, syncedRevision: backupRevision};
  
      console.log('[DataObjectStorage.initialObserverSync] object: ', resource, ' revision ', backupRevision)
  
      _this._remotes[resource]options).then(()=> {
  
        console.log('[DataObjectStorage.initialObserverSync] connected ');
  
              setTimeout(function() {
                _this._remotes[resource].disconnect().then(()=>{
                  console.log('[DataObjectStorage.initialObserverSync] disconnected ');
              },(error)=> {
                log.error('[DataObjectStorage.initialObserverSync] Error disconnecting with remote storage');
                reject(error);
              });
              }, 15000)
  
      }, (error) => {
        log.error('[DataObjectStorage.initialObserverSync] Error connecting to remote storage');
        reject(error)
      });
  
    }*/

  /**
   * @description should save and update the current dataObject data information
   *
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {DataObjectURL} resource - dataObjectURL to be saved or updated;
   * @param {String} attribute - attribute inside the data which will be saved
   * @param {any} data - value will be saved inside the attribute;
   */
  saveData(isReporter, resource, attribute, value, updateRuntimeStatus) {

    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);

    if (!storeDataObject || !storeDataObject[type] || !storeDataObject[type][resource]) {
      log.log('[StoreDataObjects - save data] - not saved');
      return;
    }

    log.log('[StoreDataObjects - saveData] - ', isReporter, type, resource, attribute, value);

    if (!storeDataObject[type][resource].hasOwnProperty('data')) {
      storeDataObject[type][resource].data = {};
    }

    if (attribute) {
      let data;
      if (typeof value === 'object') data = deepClone(value);
      else data = value;

      assign(storeDataObject[type][resource].data, attribute, data);
    } else {
      storeDataObject[type][resource].data = deepClone(value) || {};
    }

    this._storeDataObject = storeDataObject;
    let db = storeDataObject[type][resource].backup ? storeDataObject[type][resource].url : 'syncherManager:ObjectURLs';
    let storage = storeDataObject[type][resource].backup ? this._remotes[db] : this._storageManager;
    //    let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;

    if (storeDataObject[type][resource].backup) {// should we remove childrens?
      return storage.set(db, storeDataObject[type][resource]);
    } else {
      return storage.set('syncherManager:ObjectURLs', 1, this._filterRemotes(storeDataObject), this._table, updateRuntimeStatus);
    }

  }

  saveChildrens(isReporter, resource, attribute, value) {
    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);

    if (!storeDataObject || !storeDataObject[type] || !storeDataObject[type][resource]) {
      log.log('[StoreDataObjects - save childrens] - not saved');
      return;
    }

    if (!storeDataObject[type][resource].hasOwnProperty('childrens')) {
      storeDataObject[type][resource].childrenObjects = {};
    }

    /*    if (!storeDataObject[type][resource].childrenObjects.hasOwnProperty('resources')) {
          storeDataObject[type][resource].childrenObjects.resources = {};
        }*/

    if (attribute) {
      assign(storeDataObject[type][resource].childrenObjects, attribute, deepClone(value));
    } else {
      storeDataObject[type][resource].childrenObjects = deepClone(value) || {};
    }

    this._storeDataObject = storeDataObject;
    let db = storeDataObject[type][resource].backup ? storeDataObject[type][resource].url : 'syncherManager:ObjectURLs';
    let storage = storeDataObject[type][resource].backup ? this._remotes[db] : this._storageManager;
    /*   let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
       let data = storeDataObject[type][resource].backup ? storeDataObject[type][resource] : this._filterRemotes(storeDataObject);
       storage.set(db, 1, data, table).then(() => {
         return storeDataObject[type][resource];
       });*/

    if (storeDataObject[type][resource].backup) {

      return storage.set(attribute, value).then(() => {
        // backup child object if reporter is local
        if (this._runtimeUrl === value.value.runtime)
          storage.backup(attribute);

      });
    } else {
      return storage.set('syncherManager:ObjectURLs', 1, this._filterRemotes(storeDataObject), this._table, updateRuntimeStatus);
    }


  }

  /**
   * @description should save and update the current dataObject information
   *
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {DataObjectURL} resource - dataObjectURL to be saved or updated;
   * @param {String} attribute - attribute inside the data which will be saved
   * @param {any} data - value will be saved inside the attribute;
   */
  update(isReporter, resource, attribute, value, updateRuntimeStatus) {

    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);

    if (!storeDataObject || !storeDataObject[type] || !storeDataObject[type][resource]) {
      log.log('[StoreDataObjects - update] - not saved');
      return;
    }

    log.log('[StoreDataObjects - update] - ', isReporter, type, resource, attribute, value);

    if (storeDataObject[type] && storeDataObject[type][resource] && resource && attribute && value) {

      if (attribute === 'subscriptions' || attribute === 'subscriberUsers') {
        let update = true;

        if (attribute === 'subscriptions') {
          update = !this._isOwner(storeDataObject[type][resource], value);
        }

        if (update) this._updateToArray(storeDataObject[type], resource, attribute, value);

      } else {
        storeDataObject[type][resource][attribute] = value;
      }

      this._storeDataObject = storeDataObject;
      let db = storeDataObject[type][resource].backup ? storeDataObject[type][resource].url : 'syncherManager:ObjectURLs';
      let storage = storeDataObject[type][resource].backup ? this._remotes[db] : this._storageManager;
      /*      let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
            let data = storeDataObject[type][resource].backup ? storeDataObject[type][resource] : this._filterRemotes(storeDataObject);
            storage.set(db, 1, data, table, updateRuntimeStatus).then(() => {
              return storeDataObject[type][resource];
            });*/

      if (storeDataObject[type][resource].backup) {//just update the attribute that is changing
        return storage.set(db, storeDataObject[type][resource]);
      } else {
        return storage.set('syncherManager:ObjectURLs', 1, this._filterRemotes(storeDataObject), this._table, updateRuntimeStatus);
      }

    }
  }

  /**
   * @description should delete stored information from the dataObject
   *
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {DataObjectURL} resource - dataObjectURL to be saved or updated;
   * @param {String} attribute - attribute inside the data which will be saved
   * @param {any} data - value will be saved inside the attribute;
   */
  delete(isReporter, resource, attribute, value) {

    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);

    if (!storeDataObject || !storeDataObject[type] || !storeDataObject[type][resource]) {
      log.log('[StoreDataObjects - delete] - not saved');
      return;
    }

    if (storeDataObject[type] && storeDataObject[type][resource] && resource && attribute && value) {

      if (attribute === 'subscriptions' || attribute === 'subscriberUsers') {
        this._removeFromArray(storeDataObject[type], resource, attribute, value);
      } else {
        delete storeDataObject[type][resource][attribute];
      }

      this._storeDataObject = storeDataObject;
      let db = storeDataObject[type][resource].backup ? storeDataObject[type][resource].url : 'syncherManager:ObjectURLs';
      let storage = storeDataObject[type][resource].backup ? this._remotes[db] : this._storageManager;
      /*     let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
           let data = storeDataObject[type][resource].backup ? storeDataObject[type][resource] : this._filterRemotes(storeDataObject);
           storage.set(db, 1, data, table);
     
           return storeDataObject[type][resource];*/

      if (storeDataObject[type][resource].backup) {
        return storage.set(db, storeDataObject[type][resource]);
      } else {
        return storage.set(db, 1, this._filterRemotes(storeDataObject), this._table, updateRuntimeStatus);
      }

    }
  }

  /**
   * Delete Data Object from the storage
   */

  deleteResource(resource) {

    let _this = this;

    return new Promise((resolve, reject) => {

      if (resource) {
        //        return this.getAll().then((storedDataObjects) => {
        log.log('[DataObjectStorage.deleteResource] deleting: ', resource);

        //          let this._storeDataObject = Object.assign(this._storeDataObject || {});

        let backup;
        let db;
        let storage;

        if (_this._storeDataObject.hasOwnProperty('observers') && _this._storeDataObject.observers.hasOwnProperty(resource)) {
          backup = (_this._storeDataObject.observers[resource].backup) ? _this._storeDataObject.observers[resource].backup : false;

          db = backup ? _this._storeDataObject.observers[resource].url : 'syncherManager:ObjectURLs';
          storage = backup ? _this._remotes[db] : _this._storageManager;
          delete _this._storeDataObject.observers[resource];
        }

        if (_this._storeDataObject.hasOwnProperty('reporters') && _this._storeDataObject.reporters.hasOwnProperty(resource)) {
          backup = (_this._storeDataObject.reporters[resource].backup) ? _this._storeDataObject.reporters[resource].backup : false;

          db = backup ? _this._storeDataObject.reporters[resource].url : 'syncherManager:ObjectURLs';
          storage = backup ? _this._remotes[db] : _this._storageManager;
          delete _this._storeDataObject.reporters[resource];
        }

        //          this._storeDataObject = this._storeDataObject;

        if (backup && storage) {
          storage.delete().then(() => {
            log.log('[DataObjectStorage.deleteResource] deleting sync db ', resource);
            delete _this._remotes[db];
            delete _this._factory.databases['do-' + db.split('/')[3]];
            delete _this._factory.storeManager['do-' + db.split('/')[3]];
            _this._storageManager.delete(resource, null, 'remotes');
          });
        } else {
          delete _this._factory.databases[db];
          delete _this._factory.storeManager[db];
          storage.set(db, 1, this._filterRemotes(_this._storeDataObject));
        }


        return resolve();

        //        });

      } else {
        reject(new Error('[StoreDataObjects] - Can\'t delete this ' + resource));
      }

    });

  }

  /*  getAll() {
  
      let _this = this;
  
      return new Promise((resolve, reject) => {
        _this._storeDataObject = this._storageManager.get('syncherManager:ObjectURLs').then((objects) => {
          _this._storeDataObject = objects;
          _this.loadRemote(true).then((storedObjects) => {
            resolve(_this._storeDataObject);
          });
  
        });
  
      });
      //    return this._storageManager.get('syncherManager:ObjectURLs');
    }*/

  // To sync local storage with remote storage server

  sync(resource) {
    let _this = this;

    console.log('[DataObjectStorage._sync] resource: ', resource);

    return new Promise((resolve, reject) => {

      if (_this._remotes[resource]) {
        _this._remotes[resource].get(resource, 'isReporter').then((isReporter) => {
          _this._remotes[resource].get(resource, 'subscriptions').then((subscriptions) => {
            _this._remotes[resource].sync().then(() => {
              _this._remotes[resource].get().then((doc) => {
                //          this._remotes[resource].get().then((dataObject)=>{
                log.info('[DataObjectStorage.sync] returning synched DO: ', doc);
  
                //          if (!isReporter) _this._remotes[resource].disconnect();
  
                // to ensure local data object as the right value for isReporter
                // remote data object should always have isReporter = true.
                //doc[0].isReporter = isReporter;
                let dO = _this._remoteDoc2dataObject(doc);
  
                dO.isReporter = isReporter;
                dO.subscriptions = subscriptions;
  
                if (_this._storeDataObject.hasOwnProperty('observers') && _this._storeDataObject.observers.hasOwnProperty(resource)) {
                  _this._storeDataObject.observers[resource] = dO;
                }
  
                if (_this._storeDataObject.hasOwnProperty('reporters') && _this._storeDataObject.reporters.hasOwnProperty(resource)) {
                  _this._storeDataObject.reporters[resource] = dO;
                }
                _this._remotes[resource].set(resource, dO).then(() => {
                  resolve(dO);
                });
  
              }, (error) => {
                log.error('[DataObjectStorage.sync] Error ', error);
                reject(error)
              });
            }, (error) => {
              log.error('[DataObjectStorage.sync] Error ', error);
              reject(error)
            });
  
          });
        });
      } else {
        let warning = resource + ' not found in local storage.'
        log.warn('[DataObjectStorage.sync] warning ', warning);
        reject(warning);

      }

  


    });
  }

  _remoteDoc2dataObject(doc) {
    if (doc.length > 1) {//has childrens
      let dataObject = doc[doc.length - 1];

      dataObject.childrenObjects = {};

      let i;

      for (i = 0; i < doc.length - 1; i++) {
        dataObject.childrenObjects[doc[i]._id] = doc[i];
      }

      return dataObject;

    } else return (doc[0]);

  }

  stopSync(resource) {

    if (this._remotes[resource]) this._remotes[resource].disconnect();

  }

  /**
* @description should look for a specific dataObjectURL
*
* @param {DataObjectURL} resource - the dataObjectURL will be searched
*
* @returns Promise<Object> object with the dataObject information;
*/
  getDataObject(resource) {

    return new Promise((resolve, reject) => {

      /*      this._remotes[resource].get().then((dataObject)=> {
              return resolve(dataObject);
            } , () => {
              this._storageManager.get('syncherManager:ObjectURLs').then((storedDataObject) => {*/

      let storedDataObject = this._storeDataObject;

      let observers = storedDataObject.hasOwnProperty('observers') ? storedDataObject.observers : {};
      let reporters = storedDataObject.hasOwnProperty('reporters') ? storedDataObject.reporters : {};

      let currentReporter = Object.keys(reporters).find((value) => { return value === resource; });
      let currentObserver = Object.keys(observers).find((value) => { return value === resource; });
      let dataObject;

      if (currentObserver) { dataObject = storedDataObject.observers[currentObserver]; }
      if (currentReporter) { dataObject = storedDataObject.reporters[currentReporter]; }

      log.info('[StoreDataObjects - getDataObject] - for observer: ', currentObserver);
      log.info('[StoreDataObjects - getDataObject] - for reporters: ', currentReporter);

      log.info('[StoreDataObjects - getDataObject] - resolve: ', dataObject);
      return dataObject ? resolve(dataObject) : reject('No dataObject was found');

      //        });

      //      });
    });

  }

  /**
   * @description should get the dataObject information by the message
   *
   * @param {Object} msg - message would be analised to get the current dataObject information
   * @param {Boolean} isReporter - the object to be saved is a reporter
   *
   * @returns Promise<object> should retun an object with the dataObject or null
   */
  getResourcesByCriteria(msg, isReporter) {

    return new Promise((resolve) => {

      let type = this._getTypeOfObject(isReporter);

      //      this.getAll(isReporter).then((storedDataObjects) => {
      let storedDataObjects = this._storeDataObject;

      if (!storedDataObjects) {
        log.log('[DataObjectsStorage.getResourcesByCriteria] don\'t have stored data objects');
        return resolve(null);
      }

      if (msg.body && msg.body.hasOwnProperty('resume') && !msg.body.resume) {
        return resolve(null);
      }

      // check if the message have other criteria
      // if not search for on the 'from' of the message.
      let result = [];
      let hasSubscription = this._hasSubscription(storedDataObjects[type], msg.from);
      let isOwner = this._searchOwner(storedDataObjects[type], msg.from);
      let isToProtoStubResume = this._checkProtostubResume(storedDataObjects, msg);
      log.log('[StoredDataObjects - getResourcesByCriteria]:', storedDataObjects, msg, hasSubscription, isOwner);
      if (msg.hasOwnProperty('from') && hasSubscription || isOwner || isToProtoStubResume) {
        let resource;

        if (isOwner) {
          resource = this._getResourcesByOwner(storedDataObjects[type], msg.from);
        } else {
          resource = this._getResourcesBySubscription(storedDataObjects[type], msg.from);
        }

        let identityFoundData = [];
        if (msg.body && msg.body.identity) identityFoundData = this._getResourcesByIdentity(storedDataObjects[type], msg.body.identity);

        //TODO: remove schema since metadata already includes the schema?

        let schemaFoundData = [];
        if (msg.body && msg.body.schema) schemaFoundData = this._getResourcesBySchema(storedDataObjects[type], msg.body.schema);

        let metadataFound = [];
        if (msg.body && msg.body.value) {
          let metadata = msg.body.value;
          delete metadata.data;
          metadataFound = this._getResourcesByMetadata(storedDataObjects[type], metadata);
        }

        let dataFound = [];
        if (msg.body && msg.body.value && msg.body.value.data) dataFound = this._getResourcesByData(storedDataObjects[type], msg.body.value.data);

        // you can pass as arrays as you want.. it will be merged in on place
        // removed duplicates;
        result = this._intersection(resource, identityFoundData, schemaFoundData, dataFound, metadataFound);

        if (result.length == 0 && isToProtoStubResume && type == 'observers' && msg.from.split('protostub').length > 0) {
          let storedObservers = storedDataObjects[type];
          let fromDomain = divideURL(msg.from).domain;
          if (storedObservers) {
            Object.keys(storedObservers).filter((objectURL) => {
              let subscriptions = storedObservers[objectURL].subscriptions;
              let hasSubscription = false;
              subscriptions.forEach(function (subscription) {
                let subscriptionDomain = divideURL(subscription).domain;
                if (subscriptionDomain == fromDomain) {
                  result.push(objectURL);
                }
              });
            });
          }

        }
      } else {
        return resolve(null);
      }

      let init = {};
      result.forEach((key) => {
        let currentIsReporter = storedDataObjects[type][key];
        init[key] = currentIsReporter;
        return init;
      });

      log.log('[Store Data Objects] - ', init);

      resolve(init);
    });

    //    });

  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesByIdentity(storedData, userURL) {
    if (!storedData) return [];

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriberUsers.filter((current) => {
        return current === userURL;
      }).length;
    });
  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesByOwner(storedData, owner) {
    if (!storedData) return [];
    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].reporter === owner;
    });
  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesBySubscription(storedData, subscription) {
    if (!storedData) return [];

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriptions.filter((current) => {
        return current === subscription;
      }).length;
    });

  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesBySchema(storedData, schema) {
    return Object.keys(storedData).filter((objectURL) => {
      let currentObject = storedData[objectURL];
      return Object.keys(currentObject).filter((key) => {
        return key === 'schema' && currentObject[key] === schema;
      }).length;
    });
  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesByMetadata(storedData, metadata) {
    if (!metadata) return [];

    return Object.keys(storedData).filter((objectURL) => {
      let currentObject = storedData[objectURL];
      return Object.keys(currentObject).filter((key) => {
        // search on storeDataObjects for specific key provided from data;
        return Object.keys(metadata).filter(searchFor => {
          return key === searchFor && currentObject[key] === metadata[searchFor];
        }).length;

      }).length;
    });
  }

  /**
   * @private
   * @todo documentation
   */
  _getResourcesByData(storedData, data) {
    if (!data) return [];

    return Object.keys(storedData).filter((objectURL) => {
      let currentObject = storedData[objectURL].hasOwnProperty('data') ? storedData[objectURL].data : {};
      return Object.keys(currentObject).filter((key) => {
        // search on storeDataObjects for specific key provided from data;
        return Object.keys(data).filter(searchFor => {
          return key === searchFor && currentObject[key] === data[searchFor];
        }).length;

      }).length;
    });
  }

  /**
   * @private
   * @todo documentation
   */
  _hasSubscription(storedData, subscription) {
    if (!storedData) return false;

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriptions.filter((current) => {
        return current === subscription;
      }).length;
    }).length > 0 ? true : false;
  }

  /**
   * @private
   * @todo documentation
   */
  _searchOwner(storedData, from) {
    if (!storedData) return false;

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].reporter === from;
    }).length > 0 ? true : false;
  }

  /**
   * @private
   * @todo documentation
   */
  _checkProtostubResume(storedDataObjects, msg) {

    //return msg.from.includes('protostub');

        if (!storedDataObjects) return false;
    
        if (msg.hasOwnProperty('body') && msg.body.hasOwnProperty('value') && msg.body.value.hasOwnProperty('reporter')) {
          let reporter = msg.body.value.reporter;
          if (storedDataObjects.hasOwnProperty('reporters')) {
            let reportersStored = storedDataObjects.reporters;
            return Object.keys(reportersStored).filter((objectURL) => {
              return reportersStored[objectURL].reporter === reporter;
            }).length > 0 ? true : false;
          } else {
            return false;
          }
        } else if (storedDataObjects.hasOwnProperty('observers')) {
          let storedObservers = storedDataObjects.observers;
          let fromDomain = divideURL(msg.from).domain;
    
          return Object.keys(storedObservers).filter((objectURL) => {
            let subscriptions = storedObservers[objectURL].subscriptions;
            let hasSubscription = false;
            subscriptions.forEach(function (subscription) {
              let subscriptionDomain = divideURL(subscription).domain;
              if (subscriptionDomain == fromDomain) {
                hasSubscription = true;
              }
            });
            if (hasSubscription) {
              return true;
            }
          }).length > 0 ? true : false;
        }
  }

  /**
   * @private
   * @todo documentation
   */
  _isOwner(value, url) {
    if (!value) return false;
    return value.reporter === url ? true : false;
  }

  /**
   * @private
   * @todo documentation
   */
  _intersection() {
    let args = Array.from(arguments);

    let result = args.reduce((first, second) => {
      return first.concat(second);
    }).filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
    log.log('DataObjectsStorage._intersection] Result an unique array of strings: ', result);
    return result;
  }

  /**
   * @private
   * @todo documentation
   */
  _updateToArray(storeDataObject, resource, key, value) {
    log.log('[DataObjectsStorage] - _updateToArray: ', storeDataObject, resource, key, value);
    if (storeDataObject[resource][key].indexOf(value) === -1) storeDataObject[resource][key].push(value);
  }

  /**
   * @private
   * @todo documentation
   */
  _removeFromArray(storeDataObject, resource, key, value) {
    let indexOfValue = storeDataObject[resource][key].indexOf(value);
    if (indexOfValue === -1) storeDataObject[resource][key].splice(indexOfValue, 1);
  }

  /**
   * @private
   * @todo documentation
   */
  _hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
  }

  /**
   * @private
   * @todo documentation
   */
  _getTypeOfObject(isReporter) {
    return isReporter ? 'reporters' : 'observers';
  }

}

export default DataObjectsStorage;
