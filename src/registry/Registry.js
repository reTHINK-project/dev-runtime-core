import EventEmitter from '../utils/EventEmitter';

/**
* Runtime Registry Interface
*/
class Registry extends EventEmitter {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {AppSandbox}          appSandbox            appSandbox
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */
  constructor(msgbus, runtimeURL, appSandbox, remoteRegistry) {

    super();

    // NOTE if the database structure is changed it might cause errors, run the following command
    // indexedDB.deleteDatabase('registry-DB'); this will delete the database, with the old structure

    // how some functions receive the parameters for example:
    // new Registry(msgbus, 'hyperty-runtime://sp1/123', appSandbox, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/

    let _this = this;

    _this.registryURL = runtimeURL + '/registry/123';
    _this.messageBus = msgbus;
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;

    _this.db = {};
    _this.DB_NAME = 'registry-DB';
    _this.DB_VERSION = 1;
    _this.DB_STORE_HYPERTY = 'hyperty-list';
    _this.DB_STORE_STUB = 'protostub-list';

    let request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);

    request.onsuccess = function(event) {
      _this.db = this.result;
    };

    request.onerror = function(event) {
      console.error('Request open IndexedDB error:', event.target.errorCode);
    };

    request.onupgradeneeded = function(event) {
      let objectStore = event.currentTarget.result.createObjectStore(
        _this.DB_STORE_HYPERTY, {keyPath: 'hyperty'});
      objectStore.createIndex('pepURL', 'pepURL', {unique: false});
      objectStore.createIndex('identity', 'identity', {unique: false});
      objectStore.createIndex('sandbox', 'sandbox', {unique: false});

      //populate with the runtimeURL provided
      objectStore.put({hyperty: 'test', pepURL: null,
                      identity: 'testID' });

      let stubStore = event.currentTarget.result.createObjectStore(
        _this.DB_STORE_STUB, {keyPath: 'domainURL'});
      stubStore.createIndex('protostubURL', 'protostubURL', {unique: false});
      stubStore.createIndex('sandbox', 'sandbox', {unique: false});

      stubStore.put({domainURL: 'testStub', protostubURL: 'testStubURL'});
    };

  }

  /**
  * Register the messageBus, so the registry can make calls to messageBus
  * @param {MessageBus}           messageBus
  */
  registerMessageBus(messageBus) {
    let _this = this;
    _this.messageBus = messageBus;
  }

  /**
  * Register the runtimeUA, so the registry can make calls to runtimeUA
  * @param {RuntimeUA}           runtimeUA
  */
  registerRuntimeUA(runtimeUA) {
    let _this = this;
    _this.runtimeUA = runtimeUA;
  }

  /**
  * Return the runtimeUA in this Registry
  * @param {RuntimeUA}           runtimeUA
  */
  discoverRuntimeUA() {
    let _this = this;
    return _this.runtimeUA;
  }

  /**
  * Return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  discoverMessageBus() {
    let _this = this;
    return _this.messageBus;
  }

  /**
  * This function is used to return the sandbox instance where the Application is executing. It is assumed there is just one App per Runtime instance.
  */
  getAppSandbox() {
    let _this = this;
    return _this.appSandbox;
  }

  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Sandbox}             sandbox               sandbox
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
  * @return {HypertyURL}          HypertyURL
  */
  registerHyperty(sandbox, descriptor) {
    let _this = this;

    //assuming descriptor come in this format, the service-provider-domain url is retrieved by a split instruction
    //hyperty-catalogue://<service-provider-domain>/<catalogue-object-identifier>
    let descriptorSplit = descriptor.split('/');
    let hypertyURL = descriptorSplit[2];

    //TODO Call get Identity and set Identity to Identity Module
    //for simplicity added an identity
    let hypertyIdentity = hypertyURL + '/identity';

    var promise = new Promise(function(resolve, reject) {

      if (_this.messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      } else {
        //call check if the protostub exist

        return _this.resolve('hyperty-runtime://' + hypertyURL).then(function() {
        }).then(function() {

          // addListener with the callback to execute when receive a message from the address-allocation
          let item = _this.messageBus.addListener(_this.registryURL, (msg) => {
            let transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');
            let storeValue = transaction.objectStore(_this.DB_STORE_HYPERTY);
            let url = msg.body.hypertyRuntime;

            storeValue.put({hyperty: url, pepURL: null,
              identity: url + '/identity', sandbox: sandbox});

            //TODO register this hyperty in the Global Registry

            transaction.oncomplete = function(event) {
              //add to the listener in messageBus
              _this.messageBus.addListener(url + '/status', (msg) => {
                console.log('Message addListener: ' + msg);
              });
              resolve(url);
              item.remove();
            };

            transaction.onerror = function(event) {
              reject('Error on register hyperty');
              item.remove();
            };
          });

          //Message to request address allocated for new Hyperty Instance
          let message = {header: {id: 1,
                                  type: 'CREATE',
                                  from: _this.registryURL,
                                  to: 'runtime://sp1/msg-node/address-allocation'},
                          body: {hypertyURL: 'hyperty://' + hypertyURL + '/hy123'}};

          _this.messageBus.postMessage(message);

          //TODO remove later, just for tests
          //function to simulate the response from the address-allocation
          setTimeout(function() {
            let message = {header: {id: 1,
                                    type: 'CREATE',
                                    from: 'runtime://sp1/msg-node/address-allocation',
                                    to: _this.registryURL},
                            body: {hypertyURL: 'hyperty://' + hypertyURL + '/hy123',
                                   hypertyRuntime: 'hyperty-runtime://' + hypertyURL + '/123'}};
            _this.messageBus.postMessage(message);
          }, 500);

          //TODO call the post message with create hypertyRegistration msg

        });
      }
    });

    return promise;
  }

  /**
  * To unregister a previously registered Hyperty
  * @param  {HypertyURL}          HypertyURL url        url
  */
  unregisterHyperty(url) {
    let _this = this;
    let transaction = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite');

    var promise = new Promise(function(resolve,reject) {
      let objectStore = transaction.objectStore(_this.DB_STORE_HYPERTY);
      let request = objectStore.get(url);

      request.onerror = function(event) {
        reject('Error on delete Hyperty');
      };

      request.onsuccess = function(event) {

        let data = request.result;
        if (data === undefined) {
          reject('Error hyperty not found');
        } else {

          var request2 = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').
          objectStore(_this.DB_STORE_HYPERTY).delete(url);

          request2.onsuccess = function(event) {
            resolve('Hyperty delete with success');
          };

          request2.onerror = function(event) {
            console.error('Error deleting an Hyperty');
            reject('Error deleting an Hyperty');
          };
        }
      };
    });

    return promise;
  }

  /**
  * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL
  */
  discoverProtostub(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    var promise = new Promise(function(resolve,reject) {

      let transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readonly');
      let objectStore = transaction.objectStore(_this.DB_STORE_STUB);

      let request = objectStore.get(url);

      request.onerror = function(event) {
        reject('requestUpdate couldn\' get the ProtostubURL');
        console.error('hyperty not found');
      };

      request.oncomplete = function(event) {
        let data = request.result;
        if (data !== undefined) {
          resolve(data.protostubURL);
        } else {
          reject('No protostubURL was found');
        }
      };
    });

    return promise;
  }

  /**
   * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param {Sandbox}        Sandbox
   * @param  {DomainURL}     DomainURL service provider domain
   * @return {RuntimeProtoStubURL}
   */
  registerStub(sandBox, domainURL) {
    let _this = this;
    var runtimeProtoStubURL;

    var promise = new Promise(function(resolve,reject) {

      if (_this.messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      let transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite');
      let objectStore = transaction.objectStore(_this.DB_STORE_STUB);

      //TODO implement a unique number for the protostubURL
      runtimeProtoStubURL = domainURL + '/protostub/' + 123;//Math.floor((Math.random() * 10000) + 1);
      objectStore.put({domainURL: domainURL, protostubURL: runtimeProtoStubURL, sandbox: sandBox});

      //check if messageBus is registered in registry or not
      transaction.onerror = function(event) {
        reject('Error on registerProtostub');
      };

      transaction.oncomplete = function(event) {
        resolve(runtimeProtoStubURL);

        _this.messageBus.addListener('hyperty-runtime://' + runtimeProtoStubURL, (msg) => {
          if (msg.header.resource === msg.header.to + '/status') {
            console.log('RuntimeProtostubURL/status message: ', msg.body.value);
          }
        });
      };
    });

    return promise;
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
  */
  unregisterStub(hypertyRuntimeURL) {
    let _this = this;
    var runtimeProtoStubURL;

    var promise = new Promise(function(resolve,reject) {

      let objectStore = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite').objectStore(_this.DB_STORE_STUB);
      let request = objectStore.get(hypertyRuntimeURL);

      request.onerror = function(event) {
        reject('Error on unregisterStub');
      };

      request.onsuccess = function(event) {
        let data = request.result;

        if (data === undefined) {
          reject('Error on unregisterStub: Hyperty not found');
        } else {

          var request2 = _this.db.transaction(_this.DB_STORE_STUB, 'readwrite').
            objectStore(_this.DB_STORE_STUB).delete(hypertyRuntimeURL);

          request2.onerror = function(event) {
            reject('Error on unregisterStub: error on database');
          };

          request2.onsuccess = function(event) {
            resolve('ProtostubURL removed');
          };
        }
      };
    });

    return promise;
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

    var promise = new Promise(function(resolve,reject) {

      let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      let request = objectStore.get(hyperty);

      request.onerror = function(event) {
        console.error('URL not found');
        reject('Error on registerPEP');
      };

      request.onsuccess = function(event) {
        hypertypepURL = hyperty + '/pep';
        let data = request.result;

        if (data === undefined) {
          reject('Error on registerPEP');
        } else {

          data.pepURL = hypertypepURL;

          let requestUpdate = objectStore.put(data);
          requestUpdate.onerror = function(event) {
            reject('Error on update registerPEP');
          };

          requestUpdate.onsuccess = function(event) {
            resolve(hypertypepURL);
          };
        }
      };
    });

    return promise;
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
  */
  unregisterPEP(HypertyRuntimeURL) {
    let _this = this;
    var hypertypepURL;

    var promise = new Promise(function(resolve,reject) {

      let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readwrite').objectStore(_this.DB_STORE_HYPERTY);
      let request = objectStore.get(HypertyRuntimeURL);

      request.onerror = function(event) {
        reject('Error on unregisterPEP');
      };

      request.onsuccess = function(event) {
        let data = request.result;

        if (data === undefined) {
          reject('Error on unregisterPEP: hyperty not found');
        } else {

          data.pepURL = null;

          let requestUpdate = objectStore.put(data);
          requestUpdate.onerror = function(event) {
            reject('Error on unregisterPEP: error on update dabatase');
          };

          requestUpdate.onsuccess = function(event) {
            resolve(' PEP sucessfully deleted');
          };
        }
      };
    });

    return promise;
  }

  /**
  * To receive status events from components registered in the Registry.
  * @param  {Message.Message}     Message.Message       event
  */
  onEvent(event) {
    // TODO body...
  }

  /**
  * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeSandbox}           RuntimeSandbox
  */
  getSandbox(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    //This function check in both DB_STORE_STUB and DB_STORE_HYPERTY
    var promise = new Promise(function(resolve,reject) {

      let objectStore = _this.db.transaction(_this.DB_STORE_HYPERTY, 'readonly').objectStore(_this.DB_STORE_HYPERTY);
      let request = objectStore.get(url);

      request.onerror = function(event) {
        reject('requestUpdate couldn\'t get the sandbox');
      };

      request.oncomplete = function(event) {
        let data = request.result;
        if (data !== undefined) {
          return resolve(data.sandbox);
        } else {
          let stubStore = _this.db.transaction(_this.DB_STORE_STUB, 'readonly').objectStore(_this.DB_STORE_STUB);
          let stubRequest = stubStore.get(url);

          stubRequest.onerror = function(event) {
            return reject('requestUpdate couldn\'t get the sandbox');
          };

          stubRequest.oncomplete = function(event) {
            let data = stubRequest.result;
            if (data !== undefined) {
              return resolve(data.sandbox);
            } else {
              return reject('No sandbox was found');
            }
          };
        }
      };
    });

    return promise;
  }

  /**
  * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint).
  * @param  {URL.URL}  url       url
  * @return {Promise<URL.URL>}                 Promise <URL.URL>
  */
  resolve(url) {
    console.log('resolve ' + url);
    let _this = this;

    _this.addEventListener('runtime:stubLoaded', function() {
      resolve(domainUrl);
    });

    //split the url to find the domainURL. deals with the url for example as:
    //"hyperty-runtime://sp1/protostub/123",
    let urlSplit = url.split('/');
    let domainUrl = urlSplit[2];

    let promise = new Promise((resolve, reject) => {

      let transaction = _this.db.transaction(_this.DB_STORE_STUB, 'readonly');
      let objectStore = transaction.objectStore(_this.DB_STORE_STUB);

      let request  = objectStore.get(domainUrl);

      request.onsuccess = function(event) {
        let matching = request.result;
        if (matching !== undefined) {
          resolve(url);
        } else {
          _this.trigger('runtime:loadStub', domainUrl);

          //TODO delete later. Function to simulate a loadStub response
          /*setTimeout(function() {
            _this.registerStub(domainUrl + '/sanbbox', domainUrl).then(function() {
              resolve(domainUrl);
            });
          }, 250);
          */

          //reject('DomainUrl ' + domainUrl + ' not found');
        }
      };

      request.onerror = function(event) {
        reject('The url ' + url + ' doesn\'t exist: error on dababase');
      };
    });
    return promise;
  }

}

export default Registry;
