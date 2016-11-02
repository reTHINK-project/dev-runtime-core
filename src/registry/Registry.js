/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
import AddressAllocation from './AddressAllocation';
import ObjectAllocation from '../syncher/ObjectAllocation';
import HypertyInstance from './HypertyInstance';

import {MessageFactory} from 'service-framework/dist/MessageFactory';
import {divideURL} from '../utils/utils.js';

const STATUS = { DEPLOYED: 'deployed', PROGRESS: 'in-progress' };

/*import IdentityManager from './IdentityManager';
import Discovery from './Discovery';*/

/**
* Runtime Registry Interface
*/
class Registry {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {AppSandbox}          appSandbox            appSandbox
  * @param  {runtimeCatalogue}    runtimeCatalogue      runtimeCatalogue
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */
  constructor(runtimeURL, appSandbox, identityModule, runtimeCatalogue, remoteRegistry) {

    // how some functions receive the parameters for example:
    // new Registry('hyperty-runtime://sp1/123', appSandbox, idModule, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/

    let _this = this;

    _this.registryURL = runtimeURL + '/registry/';
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.runtimeCatalogue = runtimeCatalogue;
    _this.remoteRegistry = remoteRegistry;
    _this.idModule = identityModule;
    _this.identifier = Math.floor((Math.random() * 10000) + 1);

    // the expires in 3600, represents 1 hour
    //the expires is in seconds, unit of measure received by the domain registry
    _this.expiresTime = 3600;

    _this.hypertiesListToRemove = {};
    _this.hypertiesList = [];
    _this.protostubsList = {};
    _this.idpProxyList = {};
    _this.dataObjectList = {};
    _this.subscribedDataObjectList = {};
    _this.sandboxesList = {sandbox: {}, appSandbox: {} };
    _this.pepList = {};

    _this._domain = divideURL(_this.registryURL).domain;
    _this.sandboxesList.appSandbox[runtimeURL] = appSandbox;
    let msgFactory = new MessageFactory('false', '{}');
    _this.messageFactory = msgFactory;
  }

  set loader(loader) {
    let _this = this;
    _this._loader = loader;
  }

  get loader() {
    let _this = this;
    return _this._loader;
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

    _this._messageBus.addListener(_this.registryURL, function(msg) {

      let userUrl = _this._getIdentityAssociated(msg.body.resource, msg.body.criteria);

      let reply = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {resource: userUrl}};
      reply.body.code = (userUrl) ? 200 : 404;

      _this._messageBus.postMessage(reply);
    });

    // also set up messageBus in the IdentityModule component
    // TODO redefine a better way to add the messageBus in the IdModule
    _this.idModule.messageBus = messageBus;

    // Install AddressAllocation
    let addressAllocation = new AddressAllocation(_this.registryURL, messageBus);
    _this.addressAllocation = addressAllocation;

    //Install ObjectAllocation
    let objectAllocation = new ObjectAllocation(_this.registryURL + '/object-allocation', messageBus);
    _this.objectAllocation = objectAllocation;

    /*let discovery = new Discovery(_this.registryURL, messageBus);
    _this.discovery = discovery;

    let identityManager = new IdentityManager('hyperty://localhost/833a6e52-515b-498b-a57b-e3daeece48d2', _this.runtimeURL, messageBus);
    _this.identityManager = identityManager;*/
  }

  /**
  * function to request about users registered in domain registry, and
  * return the last hyperty instance registered by the user.
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  * @return {Promise}          Promise
  */

  // TODO: implement a cache system
  discoverHypertyPerUser(email, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this._domain;
    } else {
      activeDomain = domain;
    }

    let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

    // message to query domain registry, asking for a user hyperty.
    let message = {
      type: 'read', from: _this.registryURL, to: 'domain://registry.' + activeDomain + '/', body: { resource: identityURL}
    };

    console.log('Message: ', message, activeDomain, identityURL);

    //console.log('message READ', message);
    return new Promise(function(resolve, reject) {

      _this._messageBus.postMessage(message, (reply) => {
        console.log('message reply', reply);

        let hyperty;
        let mostRecent;
        let lastHyperty;
        let value = reply.body.value;

        for (hyperty in value) {
          if (value[hyperty].lastModified !== undefined) {
            if (mostRecent === undefined) {
              mostRecent = new Date(value[hyperty].lastModified);
              lastHyperty = hyperty;
            } else {
              let hypertyDate = new Date(value[hyperty].lastModified);
              if (mostRecent.getTime() < hypertyDate.getTime()) {
                mostRecent = hypertyDate;
                lastHyperty = hyperty;
              }
            }
          }
        }

        console.log('Last Hyperty: ', lastHyperty, mostRecent);

        let hypertyURL = lastHyperty;

        if (hypertyURL === undefined) {
          return reject('User Hyperty not found');
        }

        let idPackage = {
          id: email,
          descriptor: value[hypertyURL].descriptor,
          hypertyURL: hypertyURL
        };

        console.log('===> hypertyDiscovery messageBundle: ', idPackage);
        resolve(idPackage);
      });
    });
  }

  _getIdentityAssociated(type, hypertyURL) {
    let _this = this;

    for (let hyperty in _this.hypertiesList) {
      let value = _this.hypertiesList[hyperty];
      if (value._hypertyURL === hypertyURL) {
        switch (type) {
          case 'username':
            return value._user.username;
          case 'cn':
            return value._user.cn;
          case 'locale':
            return value._user.locale;
          case 'avatar':
            return value._user.avatar;
          case 'userURL':
            return value._user.userURL;
          case '.':
            return value._user;
          default:
            return '';
        }
      }
    }
    return '';
  }

  /**
  * query the domain registry for information from a dataObject URL
  * @param  {String}   url            dataObject URL
  * @return {JSON}     dataObject     data object
  */
  discoverDataObjectPerURL(url, domain) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let activeDomain;

      if (!domain) {
        activeDomain = _this._domain;
      } else {
        activeDomain = domain;
      }

      let msg = {
        type: 'read', from: _this.registryURL, to: 'domain://registry.' + activeDomain + '/', body: { resource: url }
      };

      _this._messageBus.postMessage(msg, (reply) => {

        let dataObject = reply.body.value;

        if (dataObject) {
          resolve(dataObject);
        } else {
          reject('DataObject not found');
        }
      });
    });
  }

  /**
  * This function is used to return the sandbox instance where the Application is executing. It is assumed there is just one App per Runtime instance.
  */
  getAppSandbox() {
    let _this = this;
    return _this.appSandbox;
  }

  /**
  * This function returns the user associated to the hyperty URL
  * @param    {String}    hypertyURL      hyperty URL
  * @return   {String}    userURL         user URL
  */
  getHypertyOwner(hypertyURL) {

    let _this = this;
    let userURL;

    for (let index in _this.hypertiesList) {
      let hyperty = _this.hypertiesList[index];
      if (hyperty.hypertyURL === hypertyURL) {
        userURL = hyperty.user.userURL;
      }
    }
    return userURL;
  }

  /**
  * returns the hyperty Name from a given url. This url could be from a dataObject or hyperty
  * @param    {String}    url      hyperty or dataObject URL
  * @return   {String}    hypertyName     hyperty Name
  */
  getHypertyName(url) {
    let _this = this;

    let isHypertyURL = divideURL(url).type === 'hyperty';

    //value to be returned in the end
    let hypertyName;

    //if is not an hyperty, check if is a dataObject and obtain his reporter
    let hypertyURL = (isHypertyURL) ? hypertyURL = url : _this.getReporterURLSynchonous(url);

    for (let index in _this.hypertiesList) {
      let hyperty = _this.hypertiesList[index];
      if (hyperty.hypertyURL === hypertyURL) {
        hypertyName = hyperty.objectName;
        break;
      }
    }
    return hypertyName;
  }

  /**
  * function to return the reporterURL associated with the dataobject URL
  * @param    {String}     dataObjectURL    dataObjectURL
  * @return   {String}     reporterURL      reporterURL
  */
  getReporterURL(dataObjectURL) {
    let _this = this;

    let dataObject = _this.dataObjectList[dataObjectURL];

    return new Promise(function(resolve, reject) {
      if (dataObject) {
        resolve(dataObject.reporter);
      } else {
        reject('No reporter was found');
      }
    });
  }

  /**
  * function to return the reporterURL associated with the dataobject URL. no promise returned
  * @param    {String}     dataObjectURL    dataObjectURL
  * @return   {String}     reporterURL      reporterURL
  */
  getReporterURLSynchonous(dataObjectURL) {
    let _this = this;

    let dataObject = _this.dataObjectList[dataObjectURL];

    return (dataObject) ? dataObject.reporter : undefined;
  }

  /**
  * returns the hyperty URL that subscribed the dataObject
  * @param    {String}     url            url format
  * @return   {String}    Hyperty URL subscribed to the URL
  */
  getDataObjectSubscriberHyperty(url) {
    let _this = this;

    return _this.subscribedDataObjectList[url];
  }

  /**
  * register a desired dataObject to subscribe
  * @param    {String}    dataObjectURL      dataObject URL
  */
  registerSubscribedDataObject(dataObjectURL, hypertyURL) {
    let _this = this;
    if (_this.subscribedDataObjectList[dataObjectURL] === undefined) {
      _this.subscribedDataObjectList[dataObjectURL] = hypertyURL;
    }
  }

  /**
  * Function to return the list of pre authorised users received in the creation of a data object
  * @param    {String}            dataObjectURL    dataObjectURL
  * @return   {Array<String>}     preAuth         List of pre authorised users
  */
  getPreAuthSubscribers(dataObjectURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];
    let preAuth = [];

    if (dataObject) {
      preAuth = dataObject.preAuth;
    }
    return preAuth;
  }

  /**
  * send requests to unregister all hyperties registered in domain registry
  * @return   {Promise}     return a promise if the result of unregistration all hyperties
  */
  unregisterAllHyperties() {
    let _this = this;

    let unregisterResults = [];

    return new Promise(function(resolve,reject) {

      for (let index in _this.hypertiesList) {
        let hyperty = _this.hypertiesList[index];
        let result = _this.unregisterHypertyInstance(hyperty.user.userURL, hyperty.hypertyURL);
        unregisterResults.push(result);
      }

      Promise.all(unregisterResults).then(() => {

        resolve('successfully unregistered all hyperties');
      }, error => { reject(error);});
    });
  }

  /**
  *  function to unregister an hypertyInstance in the Domain Registry
  *  @param   {String}      user        user url
  *  @param   {String}      hypertyInstance   HypertyInsntance url
  *
  */
  unregisterHypertyInstance(user, hypertyInstance) {
    //TODO working but the user
    let _this = this;

    let message = { type: 'delete', from: _this.registryURL,
                    to: 'domain://registry.' + _this._domain + '/',
                    body: { value: {user: user, url: hypertyInstance }}};

    _this._messageBus.postMessage(message, (reply) => {
      console.log('unregister hyperty Reply', reply);
    });
  }

  /**
  *  function to delete an dataObjectInstance in the Domain Registry
  *  @param   {String}    name      DataObjectName
  */
  deleteDataObjectInstance(name) {
    let _this = this;

    let message = { type: 'delete', from: _this.registryURL,
                    to: 'domain://registry.' + _this._domain + '/',
                    body: { value: {name: name}}};

    _this._messageBus.postMessage(message, (reply) => {
      console.log('unregister dataObject Reply', reply);
    });
  }

  /**
  * Function to update an Hyperty
  */
  updateHypertyInstance(resource, value) {
    let _this = this;

    let message = { type: 'UPDATE', from: _this.registryURL,
                    to: 'domain://registry.' + _this._domain + '/',
                    body: { resource: resource, value: value}};

    _this._messageBus.post.postMessage(message, (reply) => {
      console.log('Updated hyperty reply', reply);
    });
  }

  /**
  * register a new subscriber in the dataObject registered
  * @param  {String}   dataObjectURL    dataObject URL
  * @param  {String}   subscriberURL    subscriber URL
  */
  registerSubscriber(dataObjectURL, subscriberURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];

    if (dataObject) {
      dataObject.subscribers.push(subscriberURL);
      _this.dataObjectList[dataObjectURL] = dataObject;
    }
  }

  /**
  * get the subscribers registered within a dataObject
  * @param  {String}          dataObjectURL    dataObject URL
  * @param  {Array<String>}   Substribers List
  */
  getDataObjectSubscribers(dataObjectURL) {
    let _this = this;
    let dataObject = _this.dataObjectList[dataObjectURL];

    if (dataObject) {
      return dataObject.subscribers;
    } else {
      throw 'No dataObject was found';
    }
  }

  /**
  * To register a new Data Object in the runtime which returns the dataObjectURL allocated to the new Data Object.
  * @param  {String}      identifier                  identifier
  * @param  {String}      dataObjectschema            dataObjectschema
  * @param  {String}      dataObjectUrl               dataObjectUrl
  * @param {String}      dataObjectReporter           dataObjectReporter
  * @param  {Array}     resources                     dataObject resources
  * @param  {Array}     authorise                     list of pre authorised authorised IDs
  */
  registerDataObject(identifier, dataObjectschema, dataObjectUrl, dataObjectReporter, resources, authorise) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dataScheme = [];
      let filteredDataScheme = dataObjectUrl.split(':');
      dataScheme.push(filteredDataScheme[0]);

      //message to register the new hyperty, within the domain registry
      let messageValue = {name: identifier, resources: resources, dataSchemes: dataScheme, schema: dataObjectschema, url: dataObjectUrl, expires: _this.expiresTime, reporter: dataObjectReporter, preAuth: authorise, subscribers: []};

      _this.dataObjectList[dataObjectUrl] = messageValue;

      /*let message = _this.messageFactory.createCreateMessageRequest(
        _this.registryURL,
        'domain://registry.' + _this.registryDomain + '/',
        messageValue,
        'policy'
      );*/

      let message = {type:'create', from: _this.registryURL, to: 'domain://registry.' + _this.registryDomain + '/', body: {value: messageValue, policy: 'policy'}};

      _this._messageBus.postMessage(message, (reply) => {
        console.log('===> registerDataObject Reply: ', reply);
        if (reply.body.code === 200) {
          resolve('ok');
        } else {
          reject('error on register DataObject');
        }
      });

    });
  }

  /**
  * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
  * @param  {Sandbox}             sandbox               sandbox
  * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
  * @return {HypertyURL}          HypertyURL
  */
  registerHyperty(sandbox, descriptorURL, descriptor) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      //assuming descriptor come in this format, the service-provider-domain url is retrieved by a split instruction
      //hyperty-catalogue://<service-provider-domain>/<catalogue-object-identifier>
      let domainUrl = divideURL(descriptorURL).domain;

      if (domainUrl.includes('catalogue')) {
        domainUrl = domainUrl.replace('catalogue.', '');
      }

      _this.idModule.getIdentityAssertion().then(function(result) {
        let userProfile = result.userProfile;
        let identityURL = userProfile.userURL;

        if (_this._messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        } else {
          //call check if the protostub exist
          _this.resolve('hyperty-runtime://' + domainUrl).then(function() {

            _this.registryDomain = domainUrl;

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

              //check whether the received sanbox e ApplicationSandbox or a normal sandbox
              if (sandbox.type === 'app') {
                _this.sandboxesList.appSandbox[adderessList[0]] = sandbox;
              } else if (sandbox.type === 'normal') {
                _this.sandboxesList.sandbox[adderessList[0]] = sandbox;
              } else {
                reject('Wrong SandboxType');
              }

              let resources;

              // check if the hyperty resources is a vector or a string
              // TODO delete later when catalogue is fixed
              if (typeof (descriptor.hypertyType) === 'string') {
                resources = [];
                resources.push(descriptor.hypertyType);
              } else {
                resources = descriptor.hypertyType;
              }

              let descriptorDataSchema = descriptor.dataObjects;
              let dataSchemasArray = [];

              //this will create a array with a Promise in each position
              for (let index in descriptorDataSchema) {
                dataSchemasArray.push(_this.runtimeCatalogue.getDataSchemaDescriptor(descriptorDataSchema[index]));
              }

              // as soon as the previous array is completed, this will wait for the resolve of all promises in the array
              Promise.all(dataSchemasArray).then(function(dataSchemas) {

                let filteredDataSchemas = [];
                for (let index in dataSchemas) {
                  let dataSchema = dataSchemas[index];
                  filteredDataSchemas.push(dataSchema.sourcePackage.sourceCode.properties.scheme.constant);
                }

                let hyperty = new HypertyInstance(_this.identifier, _this.registryURL,
                descriptorURL, descriptor, adderessList[0], userProfile);

                hyperty._resources = resources;
                hyperty._dataSchemes = filteredDataSchemas;
                _this.hypertiesList.push(hyperty);

                //message to register the new hyperty, within the domain registry
                let messageValue = {user: identityURL,  descriptor: descriptorURL, url: adderessList[0], expires: _this.expiresTime, resources: resources, dataSchemes: filteredDataSchemas};

                /*let message = _this.messageFactory.createCreateMessageRequest(
                  _this.registryURL,
                  'domain://registry.' + _this.registryDomain + '/',
                  messageValue,
                  'policy'
                );*/

                let message = {type:'create', from: _this.registryURL, to: 'domain://registry.' + _this.registryDomain + '/', body: {value: messageValue, policy: 'policy'}};

                _this._messageBus.postMessage(message, (reply) => {
                  console.log('===> RegisterHyperty Reply: ', reply);

                  if (reply.body.code === 200) {
                    resolve(adderessList[0]);
                  } else {
                    reject('Failed to register an Hyperty');
                  }
                });

                //timer to keep the registration alive
                // the time is defined by a little less than half of the expires time defined
                let keepAliveTimer = setInterval(function() {

                  /*let message = _this.messageFactory.createCreateMessageRequest(
                    _this.registryURL,
                    'domain://registry.' + _this.registryDomain + '/',
                    messageValue,
                    'policy'
                  );*/
                  let message = {type:'create', from: _this.registryURL, to: 'domain://registry.' + _this.registryDomain + '/', body: {value: messageValue, policy: 'policy'}};

                  _this._messageBus.postMessage(message, (reply) => {
                    console.log('===> KeepAlive Reply: ', reply);
                  });
                },(((_this.expiresTime / 1.1) / 2) * 1000));

                console.log('Hyperty Schemas', filteredDataSchemas);
                console.log('Hyperty resources', resources);

              });

            }).catch(function(reason) {
              console.log('Address Reason: ', reason);
              reject(reason);
            });
          });
        }
      }, function(err) {
        reject('Failed to obtain an identity');
      });
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

      let dividedURL = divideURL(url);
      let domainURL = dividedURL.domain;

      if (_this.protostubsList.hasOwnProperty(domainURL) && _this.protostubsList[domainURL].status === STATUS.DEPLOYED) {
        resolve(_this.protostubsList[domainURL]);
      } else {
        _this.protostubsList[domainURL] = {
          status: STATUS.PROGRESS
        };

        reject('requestUpdate couldn\'t get the ProtostubURL');
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

    return new Promise(function(resolve,reject) {

      let runtimeProtoStubURL;

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
      // Proxy;
      _this.protostubsList[domainURL] = {
        url: runtimeProtoStubURL,
        status: STATUS.DEPLOYED
      };

      // _this.protostubsList[domainURL] = runtimeProtoStubURL;
      _this.sandboxesList.sandbox[runtimeProtoStubURL] = sandbox;

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

    return new Promise(function(resolve, reject) {

      if (_this.protostubsList.hasOwnProperty(hypertyRuntimeURL)) {
        delete _this.protostubsList[hypertyRuntimeURL];
        resolve('ProtostubURL removed');
      } else {
        reject('Error on unregisterStub: Hyperty not found');
      }
    });
  }

  /**
   * To register a new Identity Provider proxy in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
   * @param {Sandbox}        Sandbox
   * @param  {DomainURL}     DomainURL service provider domain
   * @return {RuntimeIdpProxyURL}
   */
  registerIdpProxy(sandbox, domainURL) {
    let _this = this;

    return new Promise(function(resolve,reject) {

      let idpProxyStubURL;

      //check if messageBus is registered in registry or not
      if (_this._messageBus === undefined) {
        reject('MessageBus not found on registerStub');
      }

      idpProxyStubURL = 'domain-idp://' + domainURL + '/stub/' + Math.floor((Math.random() * 10000) + 1);

      // TODO: Optimize this
      _this.idpProxyList[domainURL] = {
        url: idpProxyStubURL,
        status: STATUS.PROGRESS
      };

      _this.sandboxesList.sandbox[idpProxyStubURL] = sandbox;

      // sandbox.addListener('*', function(msg) {
      //   _this._messageBus.postMessage(msg);
      // });

      resolve(idpProxyStubURL);

      _this._messageBus.addListener(idpProxyStubURL + '/status', (msg) => {
        if (msg.resource === msg.to + '/status') {
          console.log('idpProxyStubURL/status message: ', msg.body.value);
        }
      });
    });
  }

  /**
  * To discover idpProxy stubs available in the runtime for a certain domain. If available, it returns the runtime url for the idpProxy stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers
  * @param  {DomainURL}           DomainURL            url
  * @return {RuntimeURL}           RuntimeURL         idpProxyUrl
  */
  discoverIdpProxy(url) {
    if (!url) throw new Error('Parameter url needed');
    let _this = this;

    return new Promise(function(resolve, reject) {

      let dividedURL = divideURL(url);
      let domainURL = dividedURL.domain;

      if (_this.idpProxyList.hasOwnProperty(domainURL) && _this.idpProxyList[domainURL].status === STATUS.DEPLOYED) {
        resolve(_this.idpProxyList[domainURL]);
      } else {
        // TODO: Optimize this
        _this.idpProxyList[domainURL] = {
          status: STATUS.PROGRESS
        };
        reject('requestUpdate couldn\'t get the idpProxyURL');
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
    console.log('onEvent');
  }

  /**
  * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
  * @param  {DomainURL} DomainURL url
  * @return {RuntimeSandbox}           RuntimeSandbox
  */
  getSandbox(url) {
    if (!url) throw new Error('Parameter url needed');
    console.log('getSandbox: ', url);

    let _this = this;
    return new Promise(function(resolve,reject) {

      let request;

      //first try to find the url in the appSandbox list
      request = _this.sandboxesList.appSandbox[url];

      //if no appSandbox was found, try to search in the normal sandboxes list
      if (!request) {
        request = _this.sandboxesList.sandbox[url];

        if (!request) {

          let domain = divideURL(url).domain;

          // search in the sandboxes list for a entry containing the domain given
          for (let sandbox in _this.sandboxesList.sandbox) {
            if (sandbox.includes(domain)) {
              request = _this.sandboxesList.sandbox[sandbox];
              break;
            }
          }
        }
      }

      if (!request) {
        reject('no sandbox found for: ' + url);
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

    return new Promise((resolve, reject) => {

      //split the url to find the domainURL. deals with the url for example as:
      //"hyperty-runtime://sp1/protostub/123",
      let dividedURL = divideURL(url);
      let domainUrl = dividedURL.domain;
      let type = dividedURL.type;

      // resolve the domain protostub in case of a message to global registry
      if (url.includes('global://registry')) {
        domainUrl = _this._domain;
      }

      if (!domainUrl.indexOf('msg-node.') || !domainUrl.indexOf('registry.')) {
        domainUrl = domainUrl.substring(domainUrl.indexOf('.') + 1);
      }

      let registredComponent;
      if (type === 'domain-idp') {
        registredComponent  = _this.idpProxyList.hasOwnProperty(domainUrl) ? _this.idpProxyList[domainUrl] : false;
      } else {
        registredComponent  = _this.protostubsList.hasOwnProperty(domainUrl) ? _this.protostubsList[domainUrl] : false;
      }

      if (registredComponent && registredComponent.hasOwnProperty('status') && registredComponent.status === STATUS.DEPLOYED) {
        console.info('Resolved: ', registredComponent.url);
        resolve(registredComponent.url);
      } else {
        if (type === 'domain-idp') {
          // _this.trigger('runtime:loadIdpProxy', domainUrl);

          _this._loader.loadIdpProxy(domainUrl).then((result) => {
            registredComponent  = _this.idpProxyList[domainUrl];
            console.info('Resolved IDPProxy: ', registredComponent, result);
            _this.idpProxyList[domainUrl].status = STATUS.DEPLOYED;
            resolve(registredComponent.url);
          }).catch((reason) => {
            console.error('Error resolving IDPProxy: ', reason);
            reject(reason);
          });

        } else {
          // _this.trigger('runtime:loadStub', domainUrl);

          _this._loader.loadStub(domainUrl).then((result) => {
            registredComponent  = _this.protostubsList[domainUrl];
            console.info('Resolved Protostub: ', registredComponent, result);
            _this.protostubsList[domainUrl].status = STATUS.DEPLOYED;
            resolve(registredComponent.url);
          }).catch((reason) => {
            console.error('Error resolving Protostub: ', reason);
            reject(reason);
          });
        }

      }

    });
  }

}

export default Registry;
