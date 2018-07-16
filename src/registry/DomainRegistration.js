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

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('Registry');

import { runtimeUtils } from '../runtime/runtimeUtils';

import HypertyInstance from './HypertyInstance';


/**
* Runtime DomainRegistration Interface
*/
class DomainRegistration {

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          messageBus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {DomainURL}           domain        remoteRegistry
  */
  constructor(runtimeURL, registryURL, domain, messageBus) {

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    if (!registryURL) throw new Error('registryURL is missing.');
    if (!domain) throw new Error('domain is missing.');
    if (!messageBus) throw new Error('messageBus is missing.');

    let _this = this;

    _this.registryURL = registryURL;
    _this.runtimeURL = runtimeURL;
    _this._registrationRetries = 5;// number of attempts to register Hyperties and DataObjects when errors occurs

    // the expires in 3600, represents 1 hour
    //the expires is in seconds, unit of measure received by the domain registry
    _this.expiresTime = 3600;

    _this._domain = domain;
    _this._messageBus = messageBus;
  }


  /**
  *  function to unregister an hypertyInstance in the Domain Registry
  *  @param   {String}      hypertyInstance   HypertyInsntance url
  *
  */
  unregisterHyperty(hypertyInstance) {
    let _this = this;

      let message = { type: 'update', from: _this.registryURL,
        to: 'domain://registry.' + _this._domain,
        body: { resource: '/hyperty/' + hypertyInstance, value: 'disconnected', attribute: 'status' }};

      _this._messageBus.postMessage(message, (reply) => {
        log.log('[DomainRegistration] unregister hyperty Reply', reply);

    });
  }

  /**
  *  function to unregister a Data Object in the Domain Registry
  *  @param   {String}      hypertyInstance   HypertyInsntance url
  *
  */
  unregisterDataObject(url) {
    let _this = this;

    let message = { type: 'update', from: _this.registryURL,
      to: 'domain://registry.' + _this._domain,
      body: {
        resource: url,
        value: {
          status: 'disconnected'
        }
      }};

    _this._messageBus.postMessage(message, (reply) => {
      log.log('[DomainRegistration] unregister dataObject Reply', reply);
    });
  }

  /**
  *  function to delete an dataObjectInstance in the Domain Registry
  *  @param   {String}    name      DataObjectName
  */
  deleteDataObjectInstance(name) {
    let _this = this;

    let message = { type: 'delete', from: _this.registryURL,
      to: 'domain://registry.' + _this._domain,
      body: { value: {name: name}}};

    _this._messageBus.postMessage(message, (reply) => {
      log.log('[DomainRegistration] unregister dataObject Reply', reply);
    });
  }

  /**
  * Function to update an Hyperty
  */
  updateHypertyInstance(resource, value) {
    let _this = this;

    let message = { type: 'UPDATE', from: _this.registryURL,
      to: 'domain://registry.' + _this._domain,
      body: { resource: resource, value: value}};

    _this._messageBus.post.postMessage(message, (reply) => {
      // log.log('[Registry] Updated hyperty reply', reply);
    });
  }


  /**
  * To register a new Data Object in the Domain Registry.
  * @param  {JSON}     registration                   registration data to be used
  * @param  {boolean}     resume                     if this is just to update the registration with the resume of a data object
  */

  registerDataObject(registration, resume, p2pHandlerStub) {

    let _this = this;

    let p2pHandler;
    let p2pRequester;

    return new Promise(function(resolve, reject) {

      let dataScheme = [];
      let filteredDataScheme = registration.url.split(':');
      dataScheme.push(filteredDataScheme[0]);

      if (Object.keys(p2pHandlerStub).length !== 0) {
      p2pHandler = p2pHandlerStub[_this.runtimeURL].url;
      p2pRequester = runtimeUtils.runtimeDescriptor.p2pRequesterStub;
    }

    registration.startingTime = registration.created;

    delete registration.authorise;
    delete registration.created;
    delete registration.mutual;
    delete registration.resume;

    if (!registration.expires) registration.expires = _this.expiresTime;

    registration.dataSchemes = dataScheme;

    if (p2pHandler) {
      registration.p2pHandler = p2pHandler;
      registration.p2pRequester = p2pRequester;
    }

    registration.status = 'live';

    let message;

    if (!resume) {

      log.log('[Registry.registerDataObject] registering new data object URL', registration);

      message = { type: 'create', from: _this.registryURL, to: 'domain://registry.' + _this._domain, body: { value: registration, policy: 'policy' } };

    } else {

      log.log('[Registry.registerDataObject] registering previously registered data object URL', registration);

      message = {
        type: 'update',
        to: 'domain://registry.' + _this._domain,
        from: _this.registryURL,
        body: { resource: registration.url, value: { status: 'live' } }
      };

    }

    try {
      _this._messageBus.postMessageWithRetries(message, _this._registrationRetries, (reply) => {
        // log.log('[Registry.registerDataObject] ===> registerDataObject Reply: ', reply);
        if (reply.body.code === 200) {
          resolve(registration);
        } else {
          reject('error on register DataObject');
        }
      });
    } catch (e) {
      log.error(e);
      reject(e);
    }


    //timer to keep the registration alive
    // the time is defined by a little less than half of the expires time defined
    let keepAliveTimer = setInterval(function () {

      let message = {
        type: 'update',
        from: _this.registryURL,
        to: 'domain://registry.' + _this._domain,
        body: { resource: registration.url, value: { status: 'live' }, method: 'refresh' }
      };

      _this._messageBus.postMessage(message, (reply) => {
        // log.log('[Registry.registerDataObject] KeepAlive Reply: ', reply);
      });
    }, (((registration.expires / 1.1) / 2) * 1000));

  });


  }




  /**
  * To register a new Hyperty in the Domain Registry.
  * @param  {HypertyInstance}     hyperty            Hyperty to be registered
  * @param  {boolean}     resume                     if this is just to update the registration with the resume of a data object
  */


  registerHyperty(hyperty, resume){

    let _this = this;

    return new Promise(function(resolve, reject) {

    //assuming descriptor come in this format, the service-provider-domain url is retrieved by a split instruction
      //hyperty-catalogue://<service-provider-domain>/<catalogue-object-identifier>
/*      let domainUrl = divideURL(hyperty.descriptorURL).domain;

      if (domainUrl.includes('catalogue')) {
        domainUrl = domainUrl.replace('catalogue.', '');
      }
      _this.registryDomain = domainUrl;*/


    let runtime = _this.runtimeURL;
    let status = 'live';

    //message to register the new hyperty, within the domain registry
    let message;
    let registrationExpires = _this.expiresTime;

    let messageValue = {
      user: hyperty.user.email,
      descriptor: hyperty.descriptorURL,
      url: hyperty.hypertyURL,
      expires: registrationExpires,
      resources: hyperty.resources,
      dataSchemes: hyperty.dataSchemes,
      runtime: runtime,
      status: status
    };

    // set a different expires if defined in the hyperty configuration

    if (hyperty.p2pHandler) {
      messageValue.p2pHandler = hyperty.p2pHandler;
      messageValue.p2pRequester = hyperty.p2pRequester;
    }

    // set a different expires value if configured in the Hyperty descriptor

    if (hyperty.descriptor.configuration && hyperty.descriptor.configuration.expires) registrationExpires = hyperty.descriptor.configuration.expires;

    if (!resume) {
      // log.log('[Registry registerHyperty] registering new Hyperty URL', addressURL.address[0]);


      // set a different expires if defined in the hyperty configuration


      // log.log('[Registry registerHyperty] registering new Hyperty at domain registry ', messageValue);

      message = {type: 'create', from: _this.registryURL, to: 'domain://registry.' + _this._domain, body: {value: messageValue, policy: 'policy'}};

    } else {
      // log.log('[Registry registerHyperty] registering previously registered Hyperty URL', addressURL.address[0]);

      message = {
        type: 'update',
        to: 'domain://registry.' + _this._domain,
        from: _this.registryURL,
        body: {resource: hyperty.hypertyURL, value: { status: 'live', user: hyperty.user.email }}
      };

      if (hyperty.p2pHandler) {
        message.body.value.p2pHandler = hyperty.p2pHandler;
        message.body.value.p2pRequester = hyperty.p2pRequester;
      }
    }

    // log.log('[Registry registerHyperty] Hyperty registration at domain registry  - ', message);

      try {
        _this._messageBus.postMessageWithRetries(message, _this._registrationRetries, (reply) => {
          // log.log('[Registry registerHyperty] Hyperty registration response: ', reply);

          if (reply.body.code === 200) {
            let result = { url: hyperty.hypertyURL};
            if (hyperty.p2pHandler) {
              result.p2pHandler = hyperty.p2pHandler;
              result.p2pRequester = hyperty.p2pRequester;
            }

            resolve(result);
          } else if (reply.body.code === 404) {
            // log.log('[Registry registerHyperty] The update was not possible. Registering new Hyperty at domain registry');

            message = {type: 'create', from: _this.registryURL, to: 'domain://registry.' + _this._domain, body: {value: messageValue, policy: 'policy'}};

            try {
              _this._messageBus.postMessageWithRetries(message, _this._registrationRetries, (reply) =>{
                // log.log('[Registry registerHyperty] Hyperty registration update response: ', reply);

                if (reply.body.code === 200) {
                  let result = { url: hyperty.hypertyURL};
                  if (hyperty.p2pHandler) {
                    result.p2pHandler = hyperty.p2pHandler;
                    result.p2pRequester = hyperty.p2pRequester;
                  }
        
                  resolve(result);

                } else {
                  throw new Error('Failed to register an Hyperty: ' + reply);
                }

              });
            } catch (e) {
              log.error(e);
              reject(e);
            }
          } else {
            throw new Error('Failed to register an Hyperty to domain: ', reply);
          }

        });

      } catch (e) {
        log.error(e);
        reject(e);
      }

      //timer to keep the registration alive
      // the time is defined by a little less than half of the expires time defined
      let keepAliveTimer = setInterval(function() {

        let message = {
          type: 'update',
          from: _this.registryURL,
          to: 'domain://registry.' + _this._domain,
          body: { resource: hyperty.hypertyURL, value: {status: 'live'}, method: 'refresh' }};

        _this._messageBus.postMessage(message, (reply) => {
          // log.log('[Registry registerHyperty] KeepAlive Reply: ', reply);
        });
      }, (((registrationExpires / 1.1) / 2) * 1000));
    });

  }

}

export default DomainRegistration;
