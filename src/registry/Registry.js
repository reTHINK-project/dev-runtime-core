/**
* Runtime Registry Interface
*/
class Registry {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */
  constructor(runtimeURL, remoteRegistry) {

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is mission');*/
    let _this = this;

    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;
    _this.protoStubs = {};

    //the hash table is create until find a better solution, to solve the
    // async calls problem on indexedDB in function with a return value
    _this.hypertiesList = {};
    _this.db = {};
    _this.DB_NAME = 'registry-DB';
    _this.DB_VERSION = 1;
    _this.DB_STORE_HYPERTY = 'hyperty-list';

    let request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);

    request.onsuccess = function(event) {
      _this.db = this.result;

      //store all the values in the database to a hash table
      var transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readonly');
      var objectStore = transaction.objectStore(_this.DB_STORE_HYPERTY);
      objectStore.openCursor().onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          /*console.log('key: ' + cursor.key + ' protoStubURL ' + cursor.value.protoStubURL +
        ' pepURL ' + cursor.value.pepURL + ' sandboxURL ' + cursor.value.sandboxURL);*/
          _this.hypertiesList[cursor.key] = {protoStubURL: cursor.value.protoStubURL,
          pepURL: cursor.value.pepURL, sandboxURL: cursor.value.sandboxURL};
          cursor.continue();
        }
      };
    };

    request.onerror = function(event) {
      console.error('Request open IndexedDB error:', event.target.errorCode);
    };

    request.onupgradeneeded = function(event) {
      let objectStore = event.currentTarget.result.createObjectStore(
        _this.DB_STORE_HYPERTY, {keyPath: 'hyperty'});
      objectStore.createIndex('protoStubURL', 'protoStubURL', {unique: false});
      objectStore.createIndex('pepURL', 'pepURL', {unique: false});
      objectStore.createIndex('sandboxURL', 'sandboxURL', {unique: false});

      //populate with the runtimeURL provided
      objectStore.put({hyperty: _this.runtimeURL, protoStubURL: null,
                pepURL: null, sandboxURL: null});
    };

  }

  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Message.Message}     postMessage           postMessage
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
  * @return {HypertyURL}          HypertyURL
  */
  registerHyperty(postMessage, descriptor) {
    let _this = this;

    // assuming the hyperty name come in the body of the message
    // this is a very simple way to do it, just for test
    let HypertyURL = postMessage.body.value;
    let transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
    let storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);

    storeValue.put({hyperty: HypertyURL, protoStubURL: null,
              pepURL: null, sandboxURL: null});

    //add the hyperty in the hypertiesList hash table
    _this.hypertiesList[HypertyURL] = {protoStubURL: null,
                        pepURL: null, sandboxURL: null};

    transaction.oncomplete = function(event) {
      //console.log('Hyperty registered with success');
    };

    transaction.onerror = function(event) {
      console.error('Hyperty registration error: ' + event.target.errorCode);
    };

    //TODO implement the associate to Idetity

    //TODO allocate address for the new Hyperty Instance

    //TODO register Hyperty at SP1 Registry

    return HypertyURL;
  }

  /**
  * To unregister a previously registered Hyperty
  * @param  {HypertyURL}          HypertyURL url        url
  */
  unregisterHyperty(url) {
    let _this = this;
    let transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
    let request = transaction.objectStore(_this.DB_STORE_HYPERTY);
    request.delete(url);
    request.onsuccess = function(event) {
      // delete the hyperty in the hypertiesList hash table
      delete _this.hypertiesList[url];
    };
  }

  /**
  * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL
  */
  discoverProtostub(url) {
    if (!url) throw new Error('Parameter name needed');
    let _this = this;
    let runtimeURL = _this.hypertiesList[url];
    return runtimeURL.protoStubURL;
  }

  /**
   * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param  {DomainURL}     DomainURL service provider domain
   * @return {RuntimeProtoStubURL}
   */
  registerStub(domainURL) {
    let _this = this;
    var runtimeProtoStubURL;

    let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
    let request = objectStore.get(domainURL);

    request.onerror = function(event) {
      console.error('domainURL not found');
    };

    request.onsuccess = function(event) {
      runtimeProtoStubURL = domainURL + '/protostub';
      let data = request.result;
      data.protoStubURL = runtimeProtoStubURL;

      let requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.error('requestUpdate error: ' + event.target.errorCode);
      };

      requestUpdate.onsuccess = function(event) {
        //update the value in the hypertiesList hash table
        let hashValue = _this.hypertiesList[domainURL];
        let newHashValue = {protoStubURL: runtimeProtoStubURL,
                            pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL};
        _this.hypertiesList[domainURL] = newHashValue;
      };
    };

    //TODO call the addListener function in Msg BUS

    return runtimeProtoStubURL;
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
  */
  unregisterStub(hypertyRuntimeURL) {
    let _this = this;
    var runtimeProtoStubURL;

    let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
    let request = objectStore.get(hypertyRuntimeURL);

    request.onerror = function(event) {
      console.error('hypertyRuntimeURL not found');
    };

    request.onsuccess = function(event) {
      let data = request.result;
      data.protoStubURL = null;

      let requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.error('requestUpdate error: ' + event.target.errorCode);
      };

      requestUpdate.onsuccess = function(event) {
        //update the value in the hypertiesList hash table
        let hashValue = _this.hypertiesList[hypertyRuntimeURL];
        let newHashValue = {protoStubURL: null,
                            pepURL: hashValue.pepURL, sandboxURL: hashValue.sandboxURL};
        _this.hypertiesList[hypertyRuntimeURL] = newHashValue;
      };
    };
  }

  /**
  * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
  * @param  {Message.Message} postMessage postMessage
  * @param  {HypertyURL}          HypertyURL            hyperty
  * @return {HypertyRuntimeURL}   HypertyRuntimeURL
  */
  registerPEP(postMessage, hyperty) {
    let _this = this;
    var hypertypepURL;

    let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
    let request = objectStore.get(hyperty);

    request.onerror = function(event) {
      console.error('hyperty not found');
    };

    request.onsuccess = function(event) {
      hypertypepURL = hyperty + '/pep';
      let data = request.result;
      data.pepURL = hypertypepURL;

      let requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.error('requestUpdate error: ' + event.target.errorCode);
      };

      requestUpdate.onsuccess = function(event) {
        //update the value in the hypertiesList hash table
        let hashValue = _this.hypertiesList[hyperty];
        let newHashValue = {protoStubURL: hashValue.protoStubURL,
                            pepURL: hypertypepURL, sandboxURL: hashValue.sandboxURL};
        _this.hypertiesList[hyperty] = newHashValue;
      };
    };

    return hypertypepURL;
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
  */
  unregisterPEP(HypertyRuntimeURL) {
    let _this = this;
    var hypertypepURL;

    let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
    let request = objectStore.get(HypertyRuntimeURL);

    request.onerror = function(event) {
      console.error('hyperty not found');
    };

    request.onsuccess = function(event) {
      let data = request.result;
      data.pepURL = null;

      let requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.error('requestUpdate error: ' + event.target.errorCode);
      };

      requestUpdate.onsuccess = function(event) {
        //update the value in the hypertiesList hash table
        let hashValue = _this.hypertiesList[HypertyRuntimeURL];
        let newHashValue = {protoStubURL: hashValue.protoStubURL,
                            pepURL: null, sandboxURL: hashValue.sandboxURL};
        _this.hypertiesList[HypertyRuntimeURL] = newHashValue;
      };
    };
  }

  /**
  * To receive status events from components registered in the Registry.
  * @param  {Message.Message}     Message.Message       event
  */
  onEvent(event) {
    // TODO body...
  }

  /**
   * This function is used to register a new runtime sandboxes passing as input the sandbox instance and the domain URL associated to the sandbox instance.
   * @param  {DomainURL} DomainURL url
   * @return {RuntimeSandboxURL}
   */
  registerSandbox(url) {
    let _this = this;
    var runtimeSandboxURL;

    let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
    let request = objectStore.get(url);

    request.onerror = function(event) {
      console.error('hyperty not found');
    };

    request.onsuccess = function(event) {
      runtimeSandboxURL = url + '/sandbox';
      let data = request.result;
      data.sandboxURL = runtimeSandboxURL;

      let requestUpdate = objectStore.put(data);
      requestUpdate.onerror = function(event) {
        console.error('requestUpdate error: ' + event.target.errorCode);
      };

      requestUpdate.onsuccess = function(event) {
        //update the value in the hypertiesList hash table
        let hashValue = _this.hypertiesList[url];
        let newHashValue = {protoStubURL: hashValue.protoStubURL,
                            pepURL: hashValue.pepURL, sandboxURL: runtimeSandboxURL};
        _this.hypertiesList[url] = newHashValue;
      };
    };

    return runtimeSandboxURL;

    // return new Promise(function(resolve, reject) {
    // resolve(RuntimeSandboxURL);
    // });
  }

  /**
  * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeSandbox}           RuntimeSandbox
  */
  getSandbox(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;
    let runtimeURL = _this.hypertiesList[url];
    return runtimeURL.sandboxURL;
  }

  /**
  * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint).
  * @param  {URL.URL}  url       url
  * @return {Promise<URL.URL>}                 Promise <URL.URL>
  */
  resolve(url) {
    return new Promise((resolve, reject) => {
      //resolve to the same URL
      resolve(url);
    });
  }

}

export default Registry;
