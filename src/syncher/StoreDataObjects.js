class StoreDataObjects {

  constructor(storageManager) {
    if (!storageManager) throw new Error('[Store Data Objects] - Needs the storageManager component');

    this._storageManager = storageManager;
    this._storeDataObject = {};
  }

  set(resource, isReporter, schema, status, data, subscription, children, childrenResources, subscriberUser) {

    let type = this._getTypeOfObject(isReporter);
    if (!this._storeDataObject.hasOwnProperty(type)) this._storeDataObject[type] = {};

    if (!this._storeDataObject[type].hasOwnProperty(resource)) {
      this._storeDataObject[type][resource] = {
        resource: resource,
        isReporter: isReporter,
        subscriptions: [],
        subscriberUsers: []
      };
    }

    if (data) this._storeDataObject[type][resource].data = data;
    if (schema) this._storeDataObject[type][resource].schema = schema;
    if (status) this._storeDataObject[type][resource].status = status;
    if (children) this._storeDataObject[type][resource].children = children;
    if (childrenResources) this._storeDataObject[type][resource].childrenResources = childrenResources;

    if (subscription && !isReporter) {
      this._updateToArray(resource, 'subscriptions', subscription, type);
    } else {
      this._storeDataObject[type][resource].owner = subscription;
    }

    if (subscriberUser) {
      if (this._storeDataObject[type][resource].subscriberUsers.indexOf(subscriberUser)) {
        this._updateToArray(resource, 'subscriberUsers', subscriberUser, type);
      }
    }

    return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);
  }

  updateData(resource, key, attribute, value, isReporter = true) {
    let type = this._getTypeOfObject(isReporter);

    if (this._storeDataObject.hasOwnProperty(type) && this._storeDataObject[type][resource] && resource && key && value) {

      if (key === 'subscriptions' || key === 'subscriberUsers') {
        this._updateToArray(resource, key, value, type);
      } else {
        this._storeDataObject[type][resource][key][attribute] = value;
      }

      return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);

    }
  }

  update(resource, key, value, isReporter = true) {
    let type = this._getTypeOfObject(isReporter);

    if (this._storeDataObject[type] && this._storeDataObject[type][resource] && resource && key && value) {

      if (key === 'subscriptions' || key === 'subscriberUsers') {
        let update = true;

        if (key === 'subscriptions') {
          update = !this._isOwner(this._storeDataObject[type][resource], value);
        }

        if (update) this._updateToArray(resource, key, value, type);

      } else {
        this._storeDataObject[type][resource][key] = value;
      }

      return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);

    }
  }

  delete(resource, key, value, isReporter = true) {

    let type = this._getTypeOfObject(isReporter);

    if (this._storeDataObject[type] && this._storeDataObject[type][resource] && resource && key && value) {

      if (key === 'subscriptions' || key === 'subscriberUsers') {
        this._removeFromArray(resource, key, value, type);
      } else {
        delete this._storeDataObject[type][resource][key];
      }

      return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);

    }

  }

  /**
   * TODO: check if this process is viable because the storage manager ability to delete
   * now the storageManager only can delete an specific key, but not the specific value inside that key;
   */
  deleteResource(resource) {
    if (resource) {

      return this.getAll().then((storedDataObjects) => {
        let tmp = storedDataObjects;

        if (tmp.hasOwnProperty(resource)) {
          delete tmp.observers[resource];
          delete tmp.reporters[resource];
          return this._storageManager.set('syncherManager:ObjectURLs', 1, tmp);
        }
      });

    } else {
      throw new Error('[StoreDataObjects] - Can\'t delete this ' + resource);
    }

  }

  getAll() {
    return this._storageManager.get('syncherManager:ObjectURLs');
  }

  get(resource) {
    if (this._storeDataObject[resource]) {
      return this._storeDataObject[resource];
    } else {
      throw new Error('[StoreDataObjects] - Can\'t find this ' + resource);
    }
  }

  /**
   *
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

        console.log('[StoredDataObjects - getResourcesByCriteria]:', msg, hasSubscription, isOwner);
        if (msg.hasOwnProperty('from') && hasSubscription || isOwner) {
          let resource = this._getResourcesBySubscription(storedDataObjects[type], msg.from);

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

  _getResourcesByIdentity(storedData, userURL) {
    if (!storedData) return [];

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriberUsers.filter((current) => {
        return current === userURL;
      }).length;
    });
  }

  _getResourcesBySubscription(storedData, subscription) {
    if (!storedData) return [];

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriptions.filter((current) => {
        return current === subscription;
      }).length;
    });

  }

  _getResourcesBySchema(storedData, schema) {
    return Object.keys(storedData).filter((objectURL) => {
      let currentObject = storedData[objectURL];
      return Object.keys(currentObject).filter((key) => {
        return key === 'schema' && currentObject[key] === schema;
      }).length;
    });
  }

  _getResourcesByData(storedData, data) {
    if (!data) return [];

    return Object.keys(storedData).filter((objectURL) => {
      let currentObject = storedData[objectURL].data;
      return Object.keys(currentObject).filter((key) => {
        // search on storeDataObjects for specific key provided from data;
        return Object.keys(data).filter(searchFor => {
          return key === searchFor && currentObject[key] === data[searchFor];
        }).length;

      }).length;
    });
  }

  _hasSubscription(storedData, subscription) {
    if (!storedData) return false;

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriptions.filter((current) => {
        return current === subscription;
      }).length;
    }).length > 0 ? true : false;
  }

  _searchOwner(storedData, from) {
    if (!storedData) return false;

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].owner === from;
    }).length > 0 ? true : false;
  }

  _isOwner(value, url) {
    if (!value) return false;
    return value.owner === url ? true : false;
  }

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

  _updateToArray(resource, key, value, type) {
    if (this._storeDataObject[type][resource][key].indexOf(value)) this._storeDataObject[type][resource][key].push(value);
  }

  _removeFromArray(resource, key, value, type) {
    let indexOfValue = this._storeDataObject[type][resource][key].indexOf(value);
    if (indexOfValue) this._storeDataObject[type][resource][key].splice(indexOfValue, 1);
  }

  _hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
  }

  _getTypeOfObject(isReporter) {
    return isReporter ? 'reporters' : 'observers';
  }

}

export default StoreDataObjects;
