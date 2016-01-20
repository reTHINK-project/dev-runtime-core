import EventEmitter from '../utils/EventEmitter';
import AddressAllocation from './AddressAllocation';
import HypertyInstance from './HypertyInstance';

import {divideURL} from '../utils/utils.js';

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
  constructor(runtimeURL, appSandbox, identityModule, remoteRegistry) {

    super();

    // how some functions receive the parameters for example:
    // new Registry('hyperty-runtime://sp1/123', appSandbox, idModule, remoteRegistry);
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
    _this.idModule = identityModule;
    _this.identifier = Math.floor((Math.random() * 10000) + 1);

    _this.hypertiesListToRemove = {};
    _this.hypertiesList = [];
    _this.protostubsList = {};
    _this.sandboxesList = {stub: {}, hyperty: {} };
    _this.pepList = {};

    _this.sandboxesList.stub[runtimeURL] = appSandbox;
    _this._domain = divideURL(_this.registryURL).domain;

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
  * Function to query the Domain registry, with an user email.
  */
  getUserHyperty(email) {
    let _this = this;
    let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

    let msg = {
      type: 'READ', from: _this.registryURL, to: 'domain://registry.' + _this._domain + '/', body: { user: identityURL}
    };

    return new Promise(function(resolve, reject) {

      _this._messageBus.postMessage(msg, (reply) => {

        let hypertyURL = reply.body.last;

        if (hypertyURL === undefined) {
          return reject('User Hyperty not found');
        }

        //TODO remove later, fix the problem of bad URL format received in the message
        let fixedHypertyURL = 'hyperty:/' + hypertyURL.substring(hypertyURL.indexOf(':') + 1, hypertyURL.length);

        let idPackage = {
          id: email,
          descriptor: reply.body.hyperties[hypertyURL].descriptor,
          hypertyURL: fixedHypertyURL
        };

        console.log('===> RegisterHyperty messageBundle: ', idPackage);
        resolve(idPackage);
      });
    });
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
    let domainUrl = divideURL(descriptor).domain;

    let identities = _this.idModule.getIdentities();

    return new Promise(function(resolve, reject) {

      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      } else {
        //call check if the protostub exist
        _this.resolve('hyperty-runtime://' + domainUrl).then(function() {

          _this.registryDomain = domainUrl;

          /*
          if (_this.hypertiesListToRemove.hasOwnProperty(domainUrl)) {
            console.log('entrou?');
            _this.hypertiesListToRemove[domainUrl] = {identity: identities[0].identity};
          }

          if (!_this.sandboxesList.hasOwnProperty(domainUrl)) {
            _this.sandboxesList[domainUrl] = sandbox;
            sandbox.addListener('*', function(msg) {
              _this._messageBus.postMessage(msg);
            });

          }
          */

          _this.sandboxesList.hyperty[domainUrl] = sandbox;

          // TODO: should be implemented with addresses poll
          // In this case we will request and return only one
          // address
          let numberOfAddresses = 1;
          _this.addressAllocation.create(domainUrl, numberOfAddresses).then(function(adderessList) {

            adderessList.forEach(function(address) {

              _this._messageBus.addListener(address + '/status', (msg) => {
                console.log('Message addListener for : ', address + '/status -> '  + msg);
              });

            });

            let hyperty = new HypertyInstance(_this.identifier, _this.registryURL,
            descriptor, adderessList[0], identities[0].identity);

            _this.hypertiesList.push(hyperty);

            //message to register the new hyperty, within the domain registry
            let msg = {
              type: 'CREATE', from: _this.registryURL, to: 'domain://registry.' + _this.registryDomain + '/', body: {user: identities[0].identity,  hypertyDescriptorURL: descriptor, hypertyURL: adderessList[0]}
            };

            _this._messageBus.postMessage(msg, (reply) => {
              console.log('===> RegisterHyperty Reply: ', reply);
            });

            resolve(adderessList[0]);
          });

        }).catch(function(reason) {
          console.log('Address Reason: ', reason);
          reject(reason);
        });

      }
    });

  }

  /**
  * To unregister a previously registered Hyperty
  * @param  {HypertyURL}          HypertyURL url        url
  */
  unregisterHyperty(url) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      let found = false;
      let index = 0;

      for	(index = 0; index < _this.hypertiesList.length; index++) {
        let hyperty = _this.hypertiesList[index];
        if (hyperty !== undefined) {
          if (hyperty.hypertyURL === url) {
            found = true;
            break;
          }
        }
      }

      if (found === false) {
        reject('Hyperty not found');
      } else {
        delete _this.hypertiesList[index];
        resolve('Hyperty successfully deleted');
      }
    });

  }

  /**
  * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL
  */
  discoverProtostub(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    return new Promise(function(resolve,reject) {

      let request = _this.protostubsList[url];

      if (request === undefined) {
        reject('requestUpdate couldn\' get the ProtostubURL');
      } else {
        resolve(request);
      }
    });

  }

  /**
   * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param {Sandbox}        Sandbox
   * @param  {DomainURL}     DomainURL service provider domain
   * @return {RuntimeProtoStubURL}
   */
  registerStub(sandbox, domainURL) {
    let _this = this;
    let runtimeProtoStubURL;

    return new Promise(function(resolve,reject) {

      //check if messageBus is registered in registry or not
      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      //TODO implement a unique number for the protostubURL
      if (!domainURL.indexOf('msg-node.')) {
        domainURL = domainURL.substring(domainURL.indexOf('.') + 1);
      }

      runtimeProtoStubURL = 'msg-node.' + domainURL + '/protostub/' + Math.floor((Math.random() * 10000) + 1);

      // TODO: Optimize this
      _this.protostubsList[domainURL] = runtimeProtoStubURL;
      _this.sandboxesList.stub[domainURL] = sandbox;

      // sandbox.addListener('*', function(msg) {
      //   _this._messageBus.postMessage(msg);
      // });

      resolve(runtimeProtoStubURL);

      _this._messageBus.addListener(runtimeProtoStubURL + '/status', (msg) => {
        if (msg.resource === msg.to + '/status') {
          console.log('RuntimeProtostubURL/status message: ', msg.body.value);
        }
      });
    });

  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
  */
  unregisterStub(hypertyRuntimeURL) {
    let _this = this;
    let runtimeProtoStubURL;

    return new Promise(function(resolve,reject) {

      let data = _this.protostubsList[hypertyRuntimeURL];

      if (data === undefined) {
        reject('Error on unregisterStub: Hyperty not found');
      } else {
        delete _this.protostubsList[hypertyRuntimeURL];
        resolve('ProtostubURL removed');
      }
    });

  }

  /**
  * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
  * @param  {Message.Message} postMessage postMessage
  * @param  {HypertyURL}          HypertyURL            hyperty
  * @return {HypertyRuntimeURL}   HypertyRuntimeURL
  */
  registerPEP(postMessage, hyperty) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      //TODO check what parameter in the postMessage the pep is.
      _this.pepList[hyperty] = postMessage;
      resolve('PEP registered with success');
    });

  }

  /**
  * To unregister a previously registered protocol stub
  * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
  */
  unregisterPEP(HypertyRuntimeURL) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      let result = _this.pepList[HypertyRuntimeURL];

      if (result === undefined) {
        reject('Pep Not found.');
      } else {
        resolve('PEP successfully removed.');
      }
    });

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
    return new Promise(function(resolve,reject) {

      let request = _this.sandboxesList.stub[url];

      if (request === undefined) {
        request = _this.sandboxesList.hyperty[url];

        if (request === undefined) {
          reject('Sandbox not found');
        } else {
          resolve(request);
        }
      } else {
        resolve(request);
      }
    });
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
    let domainUrl = divideURL(url).domain;

    return new Promise((resolve, reject) => {

      if (!domainUrl.indexOf('msg-node.') || !domainUrl.indexOf('registry.')) {
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
  }

}

export default Registry;
