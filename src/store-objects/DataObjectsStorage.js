import { assign, deepClone } from '../utils/utils';

class DataObjectsStorage {

  constructor(storageManager, storedDataObjects) {
    if (!storageManager) throw new Error('[Store Data Objects] - Needs the storageManager component');

    this._storageManager = storageManager;
    this._storeDataObject = storedDataObjects;
  }

  /**
   * @description should set the initial state of the dataObjectURL to be resumed if necessary;
   *
   * @param {DataObjectURL} resource - dataObjectURL to be saved;
   * @param {Boolean} isReporter - the object to be saved is a reporter
   * @param {SchemaURL} schema - the schema url
   * @param {String} status - the status of current dataObject
   * @param {HypertyURL} owner - the hypertyURL identifier
   * @param {Array<HypertyURL>} subscription - list of subscriptions
   * @param {Array<DataObjectChild>} children - list of childs of dataObjectURL
   * @param {Array<String>} childrenResources - list of childrenResources, like, 'chatmessage';
   * @param {Array<UserURL} subscriberUser - list of subscribed users;
   */
  set(resource, isReporter, schema, status, owner, subscription, childrenResources, subscriberUser) {

    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);
    if (!storeDataObject.hasOwnProperty(type)) storeDataObject[type] = {};

    if (!storeDataObject[type].hasOwnProperty(resource)) {
      storeDataObject[type][resource] = {
        resource: resource,
        isReporter: isReporter,
        isToSaveData: false,
        subscriptions: [],
        subscriberUsers: [],
        childrens: {},
        data: {},
        version: 0
      };
    }

    if (schema) storeDataObject[type][resource].schema = schema;
    if (status) storeDataObject[type][resource].status = status;
    if (childrenResources) storeDataObject[type][resource].childrenResources = childrenResources;

    if (subscription && !isReporter) {
      this._updateToArray(storeDataObject[type], resource, 'subscriptions', subscription);
    }

    storeDataObject[type][resource].owner = owner;

    if (subscriberUser) {
      if (storeDataObject[type][resource].subscriberUsers.indexOf(subscriberUser)) {
        this._updateToArray(storeDataObject[type], resource, 'subscriberUsers', subscriberUser);
      }
    }

    this._storeDataObject = storeDataObject;
    this._storageManager.set('syncherManager:ObjectURLs', 1, storeDataObject);
    return storeDataObject[type][resource];
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

    console.log('[StoreDataObjects - saveData] - ', isReporter, type, resource, attribute, value);

    if (!storeDataObject[type][resource].hasOwnProperty('data')) {
      storeDataObject[type][resource].data = {};
    }

    if (attribute) {
      assign(storeDataObject[type][resource].data, attribute, deepClone(value));
    } else {
      storeDataObject[type][resource].data = deepClone(value) || {};
    }

    this._storeDataObject = storeDataObject;
    this._storageManager.set('syncherManager:ObjectURLs', 1, storeDataObject);
    return storeDataObject[type][resource];
  }

  saveChildrens(isReporter, resource, attribute, value) {
    let storeDataObject = this._storeDataObject;
    let type = this._getTypeOfObject(isReporter);

    if (!storeDataObject[type][resource].hasOwnProperty('childrens')) {
      storeDataObject[type][resource].childrens = {};
    }

    if (attribute) {
      assign(storeDataObject[type][resource].childrens, attribute, deepClone(value));
    } else {
      storeDataObject[type][resource].childrens = deepClone(value) || {};
    }

    this._storeDataObject = storeDataObject;
    this._storageManager.set('syncherManager:ObjectURLs', 1, storeDataObject);
    return storeDataObject[type][resource];
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

    console.log('[StoreDataObjects - update] - ', isReporter, type, resource, attribute, value);

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
      this._storageManager.set('syncherManager:ObjectURLs', 1, storeDataObject);

    }

    return storeDataObject[type][resource];
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

    if (storeDataObject[type] && storeDataObject[type][resource] && resource && attribute && value) {

      if (attribute === 'subscriptions' || attribute === 'subscriberUsers') {
        this._removeFromArray(storeDataObject[type], resource, attribute, value);
      } else {
        delete storeDataObject[type][resource][attribute];
      }

      this._storeDataObject = storeDataObject;
      this._storageManager.set('syncherManager:ObjectURLs', 1, storeDataObject);
    }

    return storeDataObject[type][resource];
  }

  /**
   * TODO: check if this process is viable because the storage manager ability to delete
   * now the storageManager only can delete an specific key, but not the specific value inside that key;
   */
  deleteResource(resource) {

    return new Promise((resolve, reject) => {

      if (resource) {

        return this.getAll().then((storedDataObjects) => {
          let tmp = storedDataObjects;

          if (tmp.hasOwnProperty('observers') && tmp.observers.hasOwnProperty(resource)) {
            delete tmp.observers[resource];
            resolve(tmp.observers[resource]);
            this._storageManager.set('syncherManager:ObjectURLs', 1, tmp);
          }

          if (tmp.hasOwnProperty('reporters') && tmp.reporters.hasOwnProperty(resource)) {
            delete tmp.reporters[resource];
            resolve(tmp.reporters[resource]);
            this._storageManager.set('syncherManager:ObjectURLs', 1, tmp);
          }

          resolve('The ' + resource + ' dosen\t exists, nothing was deleted');

        });

      } else {
        reject(new Error('[StoreDataObjects] - Can\'t delete this ' + resource));
      }

    });

  }

  getAll() {
    return this._storageManager.get('syncherManager:ObjectURLs');
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

      this._storageManager.get('syncherManager:ObjectURLs').then((storedDataObject) => {

        let observers = storedDataObject.hasOwnProperty('observers') ? storedDataObject.observers : {};
        let reporters = storedDataObject.hasOwnProperty('reporters') ? storedDataObject.reporters : {};

        let currentReporter = Object.keys(reporters).find((value) => { return value === resource; });
        let currentObserver = Object.keys(observers).find((value) => { return value === resource; });
        let dataObject;

        if (currentObserver) { dataObject = storedDataObject.observers[currentObserver]; }
        if (currentReporter) { dataObject = storedDataObject.reporters[currentReporter]; }

        console.info('[StoreDataObjects - getDataObject] - for observer: ', currentObserver);
        console.info('[StoreDataObjects - getDataObject] - for reporters: ', currentReporter);

        console.info('[StoreDataObjects - getDataObject] - resolve: ', dataObject);
        return dataObject ? resolve(dataObject) : reject('No dataObject was found');

      });

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

      this.getAll().then((storedDataObjects) => {

        if (!storedDataObjects) {
          console.log('don\'t have stored data objects');
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

        console.log('[StoredDataObjects - getResourcesByCriteria]:', storedDataObjects, msg, hasSubscription, isOwner);
        if (msg.hasOwnProperty('from') && hasSubscription || isOwner) {
          let resource;

          if (isOwner) {
            resource = this._getResourcesByOwner(storedDataObjects[type], msg.from);
          } else {
            resource = this._getResourcesBySubscription(storedDataObjects[type], msg.from);
          }

          let identityFoundData = [];
          if (msg.body && msg.body.identity) identityFoundData = this._getResourcesByIdentity(storedDataObjects[type], msg.body.identity);

          let schemaFoundData = [];
          if (msg.body && msg.body.schema) schemaFoundData = this._getResourcesBySchema(storedDataObjects[type], msg.body.schema);

          let dataFound = [];
          if (msg.body && msg.body.value) dataFound = this._getResourcesByData(storedDataObjects[type], msg.body.value);

          // you can pass as arrays as you want.. it will be merged in on place
          // removed duplicates;
          result = this._intersection(resource, identityFoundData, schemaFoundData, dataFound);
        } else {
          return resolve(null);
        }

        let init = {};
        result.forEach((key) => {
          let currentIsReporter = storedDataObjects[type][key];
          init[key] = currentIsReporter;
          return init;
        });

        console.log('[Store Data Objects] - ', init);

        resolve(init);
      });

    });

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
      return storedData[objectURL].owner === owner;
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
      return storedData[objectURL].owner === from;
    }).length > 0 ? true : false;
  }

  /**
   * @private
   * @todo documentation
   */
  _isOwner(value, url) {
    if (!value) return false;
    return value.owner === url ? true : false;
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
    console.log('Result an unique array of strings: ', result);
    return result;
  }

  /**
   * @private
   * @todo documentation
   */
  _updateToArray(storeDataObject, resource, key, value) {
    console.log('[DataObjectsStorage] - _updateToArray: ', storeDataObject, resource, key, value);
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
