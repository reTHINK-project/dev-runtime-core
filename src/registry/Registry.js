import EventEmitter from '../utils/EventEmitter';
import AddressAllocation from './AddressAllocation';

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
  constructor(runtimeURL, appSandbox, remoteRegistry) {

    super();

    // how some functions receive the parameters for example:
    // new Registry(msgbus, 'hyperty-runtime://sp1/123', appSandbox, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/

    let _this = this;

    _this.registryURL = runtimeURL + '/registry/123';
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;

    _this.hypertyiesList = {};
    _this.protostubsList = {};
    _this.sandboxesList = {};
    _this.pepList = {};

  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;

    // Install AddressAllocation
    let addressAllocation = new AddressAllocation(_this.registryURL, messageBus);
    _this.addressAllocation = addressAllocation;
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

      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      } else {
        //call check if the protostub exist
        return _this.resolve('hyperty-runtime://' + hypertyURL).then(function() {
        }).then(function() {

          // addListener with the callback to execute when receive a message from the address-allocation
          let item = _this._messageBus.addListener(_this.registryURL, (msg) => {
            let url = msg.body.hypertyRuntime;

            _this.hypertiesList[url] = {identity: url + '/identity'};
            _this.sandboxesList[url] = sandbox;

            //TODO register this hyperty in the Global Registry

            item.remove();

          });

          // TODO: should be implemented with addresses poll
          // In this case we will request and return only one
          // address
          let numberOfAddresses = 1;
          let addressDomain = 'ua.pt';
          _this.addressAllocation.create(addressDomain, numberOfAddresses).then(function(adderessList) {

            adderessList.forEach(function(address) {

              _this._messageBus.addListener(address + '/status', (msg) => {
                console.log('Message addListener for : ', address + '/status -> '  + msg);
              });

            });

            resolve(adderessList[0]);

          }).catch(function(reason) {
            console.log('Address Reason: ', reason);
            reject(reason);
          });

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

    var promise = new Promise(function(resolve,reject) {

      let request = _this.hypertiesList[url];

      if (request === undefined) {
        reject('Hyperty not found');
      } else {
        resolve('Hyperty successfully deleted');
      }
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

      let request = _this.protostubsList[url];

      if (request === undefined) {
        reject('requestUpdate couldn\' get the ProtostubURL');
      } else {
        resolve(request);
      }
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

      //check if messageBus is registered in registry or not
      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      //TODO implement a unique number for the protostubURL
      let domain = domainURL;
      if (!domainURL.indexOf('msg-node.')) {
        domain = domainURL.substring(domainURL.indexOf('.') + 1);
      }

      runtimeProtoStubURL = 'msg-node.' + domain + '/protostub/' + Math.floor((Math.random() * 10000) + 1);

      _this.protostubsList[domain] = runtimeProtoStubURL;
      _this.sandboxesList[runtimeProtoStubURL] = sandBox;

      resolve(runtimeProtoStubURL);

      _this._messageBus.addListener(runtimeProtoStubURL + '/status', (msg) => {
        if (msg.header.resource === msg.header.to + '/status') {
          console.log('RuntimeProtostubURL/status message: ', msg.body.value);
        }
      });
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

      let data = _this.protostubsList[hypertyRuntimeURL];

      if (data === undefined) {
        reject('Error on unregisterStub: Hyperty not found');
      } else {
        delete _this.protostubsList[hypertyRuntimeURL];
        resolve('ProtostubURL removed');
      }
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

    var promise = new Promise(function(resolve,reject) {
      //TODO check what parameter in the postMessage the pep is.
      _this.pep[hyperty] = postMessage;
      resolve('Pep registered with success');
    });

    return promise;
  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
  */
  unregisterPEP(HypertyRuntimeURL) {
    let _this = this;

    var promise = new Promise(function(resolve,reject) {

      let result = _this.pepList[HypertyRuntimeURL];

      if (result === undefined) {
        reject('Pep Not found.');
      } else {
        resolve('Pepe successfully removed.');
      }
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
    var promise = new Promise(function(resolve,reject) {

      let request = _this.sandboxesList[url];

      if (request === undefined) {
        reject('Sandbox not found');
      } else {
        resolve(request);
      }
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

    //split the url to find the domainURL. deals with the url for example as:
    //"hyperty-runtime://sp1/protostub/123",
    let urlSplit = url.split('/');
    let domainUrl = urlSplit[2];

    let promise = new Promise((resolve, reject) => {

      if (!domainUrl.indexOf('msg-node.')) {
        domainUrl = domainUrl.substring(domainUrl.indexOf('.') + 1);
      }

      let request  = _this.protostubsList[domainUrl];

      _this.addEventListener('runtime:stubLoaded', function(domainUrl) {
        resolve(domainUrl);
      });

      if (request !== undefined) {
        resolve(request);
      } else {
        _this.trigger('runtime:loadStub', domainUrl);
      }

    });
    return promise;
  }

}

export default Registry;
