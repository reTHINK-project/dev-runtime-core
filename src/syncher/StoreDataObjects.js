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

    if (isReporter) this._storeDataObject[type][resource].owner = subscription;

    if (data) this._storeDataObject[type][resource].data = data;
    if (schema) this._storeDataObject[type][resource].schema = schema;
    if (status) this._storeDataObject[type][resource].status = status;
    if (children) this._storeDataObject[type][resource].children = children;
    if (childrenResources) this._storeDataObject[type][resource].childrenResources = childrenResources;

    console.log('SET:', subscription, !isReporter);
    if (subscription && !isReporter) {
      if (this._storeDataObject[type][resource].subscriptions.indexOf(subscription)) this._storeDataObject[type][resource].subscriptions.push(subscription);
    }

    if (subscriberUser) {
      if (this._storeDataObject[type][resource].subscriberUsers.indexOf(subscriberUser)) this._storeDataObject[type][resource].subscriberUsers.push(subscriberUser);
    }

    console.log('SET: ', this._storeDataObject[type][resource], subscription);

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

    } else {
      //throw new Error('[StoreDataObjects] - Can\'t update this ' + resource + ' to the key ' + key + ' with value: ' + value);
    }
  }

  update(resource, key, value, isReporter = true) {
    let type = this._getTypeOfObject(isReporter);

    if (this._storeDataObject.hasOwnProperty(type) && this._storeDataObject[type][resource] && resource && key && value) {

      if (key === 'subscriptions' || key === 'subscriberUsers') {
        this._updateToArray(resource, key, value, type);
      } else {
        this._storeDataObject[type][resource][key] = value;
      }

      return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);

    } else {
      //throw new Error('[StoreDataObjects] - Can\'t update this ' + resource + ' to the key ' + key + ' with value: ' + value);
    }
  }

  delete(resource, key, value) {
    if (this._storeDataObject[resource] && resource && key && value) {

      if (key === 'subscriptions' || key === 'subscriberUsers') {
        this._removeFromArray(resource, key);
      } else {
        delete this._storeDataObject[resource][key];
      }

      return this._storageManager.set('syncherManager:ObjectURLs', 1, this._storeDataObject);

    } else {
      throw new Error('[StoreDataObjects] - Can\'t delete this ' + resource + ' to the key ' + key + ' with value: ' + value);
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

    console.log('MSG:', msg);

    return new Promise((resolve) => {

      let type = this._getTypeOfObject(isReporter);

      this.getAll().then((storedDataObjects) => {

        if (!storedDataObjects) {
          console.log('don\'t have stored data objects');
          return resolve(null);
        }

        if (msg.body.hasOwnProperty('resume') && !msg.body.resume) {
          return resolve(null);
        }

        // check if the message have other criteria
        // if not search for on the 'from' of the message.
        let result = [];
        let hasSubscription = this._hasSubscription(storedDataObjects[type], msg.from);
        let isOwner = this._isOwner(storedDataObjects[type], msg.from);

        if (msg.hasOwnProperty('from') && hasSubscription || isOwner) {
          let resource = this._getResourcesBySubscription(storedDataObjects[type], msg.from);
          let identityFoundData = this._getResourcesByIdentity(storedDataObjects[type], msg.body.identity);
          let schemaFoundData = this._getResourcesBySchema(storedDataObjects[type], msg.body.schema);
          let dataFound = this._getResourcesByData(storedDataObjects[type], msg.body.value);

          // you can pass as arrays as you want.. it will be merged in on place
          // removed duplicates;
          result = this._intersection(identityFoundData, schemaFoundData, dataFound, resource);
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
    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriberUsers.filter((current) => {
        return current === userURL;
      }).length;
    });
  }

  _getResourcesBySubscription(storedData, subscription) {
    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].subscriptions.filter((current) => {
        console.log('Cuurent:', current, subscription);
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

  _isOwner(storedData, url) {
    if (!storedData) return false;

    return Object.keys(storedData).filter((objectURL) => {
      return storedData[objectURL].owner === url;
    }).length > 0 ? true : false;
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

  _removeFromArray(resource, key, value) {
    let indexOfValue = this._storeDataObject[resource][key].indexOf(value);
    if (indexOfValue) this._storeDataObject[resource][key].splice(indexOfValue, 1);
  }

  _hasValue(obj, key, value) {
    return obj.hasOwnProperty(key) && obj[key] === value;
  }

  _getTypeOfObject(isReporter) {
    return isReporter ? 'reporters' : 'observers';
  }

}

export default StoreDataObjects;
