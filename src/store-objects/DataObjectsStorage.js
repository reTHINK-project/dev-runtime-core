// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('DataObjectsStorage');

import { assign, deepClone, divideURL } from '../utils/utils';

import { createSyncDB } from '../runtime/Storage';

class DataObjectsStorage {

  constructor(storageManager, storedDataObjects = {}, factory, runtimeStatusUpdate) {
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
    this._runtimeStatusUpdate = runtimeStatusUpdate;
  }

  // load Data Objects synched with remote Storages

  loadRemote() {
    let _this = this;
    return new Promise ((resolve, reject) => {
        let loading = [];

        _this._storageManager.get(null,null,'remotes').then((remotes)=>{

          _this._remotes = remotes;

          log.info('[StoreDataObjects.loadRemote] loading: ', _this._remotes);

          Object.keys(_this._remotes).forEach((db) => {
            let schema = {};
            let table = db.split('/')[3];
            schema[table] = this._remoteSchema;
            this._remotes[db] = createSyncDB(db, this._factory, schema, this._runtimeStatusUpdate);
      //            _this._remotes[remote] = createSyncDB(remote, _this._factory, 'remoteDataObjectStorage' );
            loading.push(_this._remotes[db].get(null,null,table));
          });

          Promise.all(loading).then(() => {
            log.log('[StoreDataObjects.loadRemote] loaded. Starting init');
            //TODO: init this._storeDataObject with loaded data objects
            Object.keys(_this._remotes).forEach((remote) => {
              let table = remote.split('/')[3];
            _this._remotes[remote].get(null,null,table).then((dO) => {
              log.log('[StoreDataObjects.loadRemote] loaded remote ', dO);

              let type = this._getTypeOfObject(dO[remote].isReporter);

              if (!_this._storeDataObject.hasOwnProperty(type)) _this._storeDataObject[type] = {};

              _this._storeDataObject[type][remote] = dO[remote];
              log.log('[StoreDataObjects.loadRemote] storeDataObject updated: ', _this._storeDataObject);
  
            });
            
          });
            resolve()
          } , (error) => {reject(error)});

  
        resolve();
        }, (error) => {
          reject(error);
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

    return new Promise((resolve,reject) => {
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
      let db = backup ? metadata.url : this._table;
      let table = backup ? db.split('/')[3] : this._table;
      if (backup && !this._remotes[db]) {
        let schema = {};
        schema[table] = this._remoteSchema;
        this._remotes[db] = createSyncDB(db, this._factory, schema, this._runtimeStatusUpdate);
      }
  
      let storage = backup ? this._remotes[db] : this._storageManager;
  
      if (metadata.isReporter && backup) {// lets connect to remote storage to enable sync
        let options = {table: table};
        storage.connect(options).then(()=> {
          storage.set(db, 0, storeDataObject[type][metadata.url], table).then(() => {
            this._storageManager.set( metadata.url, 0, metadata.url, 'remotes').then(()=>{
              resolve(storeDataObject[type][metadata.url]);
            });
          });
        }, (error) => {
          log.error('[DataObjectStorage.set] failed to connect with remote storage: ', error, ' trying again...');
          storage.connect(options).then(()=> {
            storage.set(db, 1, storeDataObject[type][metadata.url], table);
          resolve(storeDataObject[type][metadata.url]);
          }, (error) => {
            log.error('[DataObjectStorage.set] failed to connect with remote storage: ', error);
            reject(error);
          });
        });
//          return storeDataObject[type][metadata.url];
      } else {
        storage.set(db, 1, storeDataObject[type][metadata.url], table).then(()=>{
          this._storageManager.set( metadata.url, 0, metadata.url, 'remotes').then(()=>{
            resolve(storeDataObject[type][metadata.url]);
          });
        });
      }
    });



  }

  /**
   * @description should save and update the current dataObject data information
   *
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {DataObjectURL} resource - dataObjectURL to be saved or updated;
   * @param {String} attribute - attribute inside the data which will be saved
   * @param {any} data - value will be saved inside the attribute;
   */
  saveData(isReporter, resource, attribute, value) {

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
    let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
    storage.set(db, 1, storeDataObject[type][resource], table).then(() => {
      return storeDataObject[type][resource];
    }, (error)=>{
      console.error(error);
      return storeDataObject[type][resource];
    });
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
    let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
    storage.set(db, 1, storeDataObject[type][resource], table).then(()=>{
      return storeDataObject[type][resource];
    });

  }

  /**
   * @description should save and update the current dataObject information
   *
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {DataObjectURL} resource - dataObjectURL to be saved or updated;
   * @param {String} attribute - attribute inside the data which will be saved
   * @param {any} data - value will be saved inside the attribute;
   */
  update(isReporter, resource, attribute, value) {

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
      let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
      storage.set(db, 1, storeDataObject[type][resource], table).then(()=>{
        return storeDataObject[type][resource];
      });
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
      let table = storeDataObject[type][resource].backup ? db.split('/')[3] : this._table;
      storage.set( db, 1, storeDataObject[type][resource], table);

      return storeDataObject[type][resource];
    }
  }

  /**
   * TODO: check if this process is viable because the storage manager ability to delete
   * now the storageManager only can delete an specific key, but not the specific value inside that key;
   */
  deleteResource(resource) {

    return new Promise((resolve, reject) => {

      if (resource) {

        return this.getAll().then((storedDataObjects) => {
          let tmp = Object.assign(storedDataObjects, this._storeDataObject || {});

          if (tmp.hasOwnProperty('observers') && tmp.observers.hasOwnProperty(resource)) {
            delete tmp.observers[resource];
            let db = tmp.observers[resource].backup ? tmp.observers[resource].url : 'syncherManager:ObjectURLs';
            let storage = tmp.observers[resource].backup ? this._remotes[db] : this._storageManager;
            storage.delete(db, 1, resource);
            this._storeDataObject = tmp;
            return resolve(tmp.observers[resource]);
          }

          if (tmp.hasOwnProperty('reporters') && tmp.reporters.hasOwnProperty(resource)) {
            delete tmp.reporters[resource];
            let db = tmp.reporters[resource].backup ? tmp.reporters[resource].url : 'syncherManager:ObjectURLs';
            let storage = tmp.reporters[resource].backup ? this._remotes[db] : this._storageManager;
            storage.delete(db, 1, resource);
            this._storeDataObject = tmp;
            return resolve(tmp.reporters[resource]);
          }

          resolve('The ' + resource + ' dosen\t exists, nothing was deleted');

        });

      } else {
        reject(new Error('[StoreDataObjects] - Can\'t delete this ' + resource));
      }

    });

  }

  getAll() {

    return new Promise((resolve, reject) => {
      this._storeDataObject = this._storageManager.get('syncherManager:ObjectURLs').then((objects) => {
        this._storeDataObject = objects;
        this.loadRemote().then(()=>{
          resolve(this._storeDataObject);
        });

      });

    });
//    return this._storageManager.get('syncherManager:ObjectURLs');
  }

  sync(resource, observer = false) {
    let _this= this;

    return new Promise((resolve, reject) => {


      if (_this._remotes[resource]) {
        let type = observer ? 'observers' : 'reporters';
        let lastRevision = _this._storeDataObject[type][resource].data.backupRevision;

        let table = resource.split('/')[3];
        let options = {table: table, observer: observer, baseRevision: lastRevision, syncedRevision: lastRevision};

        _this._remotes[resource].connect(options).then(()=> {
          _this._remotes[resource].disconnect().then(()=>{

          _this._remotes[resource].get(null,null,table).then((dataObject)=>{
//          this._remotes[resource].get().then((dataObject)=>{
              log.info('[DataObjectStorage.sync] returning synched DO: ', dataObject);
                resolve(dataObject[resource]);
            },(error)=> {
              log.error('[DataObjectStorage.sync] Error synching with remote storage');
              reject(error);
            });
        } , (error) => {
          log.error('[DataObjectStorage.sync] Error disconnecting from remote storage');
          reject(error)
        });
      }, (error) => {
        log.error('[DataObjectStorage.sync] Error connecting to remote storage');
        reject(error)
      });
      } else {
          let info = '[DataObjectStorage.sync] Info: ' + resource + ' is not synched with remote storage.'
          log.info(info);
          reject(info);
      }

    });
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
            Object.keys(storedObservers).filter((objectURL) => {
              let subscriptions = storedObservers[objectURL].subscriptions;
              let hasSubscription = false;
              subscriptions.forEach(function(subscription) {
                let subscriptionDomain = divideURL(subscription).domain;
                if (subscriptionDomain == fromDomain) {
                  result.push(objectURL);
                }
              });
            })
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
        subscriptions.forEach(function(subscription) {
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
