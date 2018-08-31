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
let log = logger.getLogger('Discovery');

import {divideURL, convertToUserURL} from '../utils/utils';
import DiscoveredObject from './DiscoveredObject';

/**
* Core Discovery interface
* Class to allow applications to search for hyperties and DataObjects using the message bus
*/
class Discovery {

  /**
  * To initialise the HypertyDiscover, which will provide the support for hyperties to
  * query users registered in outside the internal core.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {RuntimeURL}          runtimeURL            runtimeURL
  */
  constructor(hypertyURL, runtimeURL, msgBus) {
    let _this = this;
    _this.messageBus = msgBus;
    _this.runtimeURL = runtimeURL;

    _this.domain = divideURL(hypertyURL).domain;
    _this.discoveryURL = hypertyURL;
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some user identifier (eg email, name ...)
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  _isLegacyUser(userIdentifier) {
    if (userIdentifier.includes(':') && !userIdentifier.includes('user://')) {
      return true;
    } else {
      return false;
    }
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some user identifier (eg email, name ...)
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerUserProfileData(userIdentifier, schema, resources) {
    let _this = this;
    let filteredHyperties = [];

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/hyperty/userprofile/' + userIdentifier,
      }
    };

    if (schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema
      };
    }

    return new Promise(function(resolve, reject) {

      if (!_this._isLegacyUser(userIdentifier)) {// todo: to reomve when discovery of legcay users are supported

        _this.messageBus.postMessage(msg, (reply) => {

          if(reply.body.code === 200){
            reply.body.value.map(function(hyperty) {
               if(hyperty.hypertyID != _this.discoveryURL)
                   filteredHyperties.push(hyperty);
            });
            if(filteredHyperties.length === 0)
              resolve([]);
            else {
              log.log("[Discovery.discoverHypertiesPerUserProfileData] Reply log: ",filteredHyperties);
              resolve(filteredHyperties);
            }
          }
          else {
            log.warn("[Discovery.discoverHypertiesPerUserProfileData] Error Reply for " + userIdentifier + " Reason: ", reply.body.description);
            resolve([]);
          }
        });
      } else {
        resolve([{hypertyID: userIdentifier, status: 'live'}]);
      }
    });
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some user identifier (eg email, name ...)
  * returns DiscoveredObject
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerUserProfileDataDO(userIdentifier, schema, resources) {

    return new Promise((resolve, reject) => {
      this.discoverHypertiesPerUserProfileData(...arguments)
      .then(hyperties => {
        resolve(this._convertToDiscoveredObject(hyperties));
      })
      .catch(error => reject(error));
    });
  }

  /**
  * Advanced Search for DataObjects registered in domain registry associated with some user identifier (eg email, name ...)
  * @param  {String}           userIdentifier
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverDataObjectsPerUserProfileData(userIdentifier, schema, resources) {
    let _this = this;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/userprofile/' + userIdentifier,
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema
      };
    }

    return new Promise(function(resolve, reject) {

      if (!_this._isLegacyUser(userIdentifier)) {// todo: to reomve when discovery of legcay users are supported

        _this.messageBus.postMessage(msg, (reply) => {

          if(reply.body.code === 200){
            log.log("Reply log: ",reply.body.value);
            resolve(reply.body.value);
          }
          else {
            log.warn("[Discovery.discoverDataObjectsPerUserProfileData] Error Reply for " + userIdentifier + " Reason: ", reply.body.description);
            resolve([]);
          }
        });
      } else {
          resolve([{hypertyID: userIdentifier, status: 'live'}]);
        }
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}           guidURL                guid URL e.g user-guid://<unique-user-identifier>
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjectsPerUserProfileDataDO(guidURL, schema, resources) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjectsPerUserProfileData(...arguments)
        .then(registryObjects => resolve(this._convertToDiscoveredObject(registryObjects)))
        .catch(error => reject(error));
    });
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some GUID
  * @param  {String}           guidURL                guid URL e.g user-guid://<unique-user-identifier>
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerGUID(guidURL, schema, resources) {
    let _this = this;
    let filteredHyperties = [];

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/hyperty/guid/' + guidURL,
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema
      };
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          reply.body.value.map(function(hyperty) {
             if(hyperty.hypertyID != _this.discoveryURL)
                 filteredHyperties.push(hyperty);
          });
          if(filteredHyperties.length === 0)
            reject('No Hyperty was found');
          else {
            log.log("Reply log: ",filteredHyperties);
            resolve(filteredHyperties);
          }
        }
        else {
          log.warn("[Discovery.discoverHypertiesPerGUID] Error Reply for " + guidURL + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * Advanced Search for Hyperties registered in domain registry associated with some GUID
  * returns DiscoveredObject
  * @param  {String}           guidURL                guid URL e.g user-guid://<unique-user-identifier>
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  */
  discoverHypertiesPerGUIDDO(guidURL, schema, resources) {

    return new Promise((resolve, reject) => {
      this.discoverHypertiesPerGUID(...arguments)
      .then(hyperties => {
        resolve(this._convertToDiscoveredObject(hyperties));
      })
      .catch(error => reject(error));
    });
  }

  /**
  * Advanced Search for DataObjects registered in domain registry associated with some GUID
  * @param  {String}           guidURL                guid URL e.g user-guid://<unique-user-identifier>
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjectsPerGUID(guidURL, schema, resources) {
    let _this = this;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/guid/' + guidURL,
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema
      };
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverDataObjectsPerGUID] Error Reply for " + guidURL + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}           guidURL                guid URL e.g user-guid://<unique-user-identifier>
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjectsPerGUIDDO(guidURL, schema, resources) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjectsPerGUID(...arguments)
        .then(registryObjects => resolve(this._convertToDiscoveredObject(registryObjects)))
        .catch(error => reject(error));
    });
  }

  /** Advanced Search for Hyperties registered in domain registry
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverHyperties(user, schema, resources, domain) {
    let _this = this;
    let activeDomain;
    let filteredHyperties = [];

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/hyperty/user/' + user,
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema,
        domain: activeDomain
      };
    }else {
      msg.body['criteria'] = {
        domain: activeDomain
      }
    }

    return new Promise(function(resolve, reject) {

      if (!_this._isLegacyUser(user)) {// todo: to reomve when discovery of legcay users are supported

        _this.messageBus.postMessage(msg, (reply) => {

          if(reply.body.code === 200 || reply.body.code === 500){
            reply.body.value.map(function(hyperty) {
               if(hyperty.hypertyID != _this.discoveryURL)
                   filteredHyperties.push(hyperty);
            });
/*            if(filteredHyperties.length === 0)
              reject('No Hyperty was found');
            else {*/
              log.log("[Discovery.discoverHyperties] Reply : ",filteredHyperties);
              resolve(filteredHyperties);
//            }
          }
          else {
            log.warn("[Discovery.discoverHyperties] Error Reply for " + user + " Reason: ", reply.body.description);
            resolve(filteredHyperties);
          }
        });
      } else {
        resolve([{hypertyID: user, status: 'live'}]);
      }
    });
  }

  /** Advanced Search for Hyperties registered in domain registry,
  *returns DiscoveredObject
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverHypertiesDO(user, schema, resources, domain) {

    return new Promise((resolve, reject) => {
      this.discoverHyperties(...arguments)
      .then(hyperties => {
        resolve(this._convertToDiscoveredObject(hyperties));
      })
      .catch(error => reject(error));
    });
  }

  /** Advanced Search for DataObjects registered in domain registry
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjects(user, schema, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/user/' + user,
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema,
        domain: activeDomain
      };
    }else {
      msg.body['criteria'] = {
        domain: activeDomain
      }
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply Value Log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverDataObjects] Error Reply for " + user + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObjectsDO(user, schema, resources, domain) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjects(...arguments)
        .then(registryObjects => resolve(this._convertToDiscoveredObject(registryObjects)))
        .catch(error => reject(error));
    });
  }

  /**
  * function to request about hyperties registered in domain registry, and
  * return the hyperty information, if found.
  * @param  {String}              url  hyperty URL
  * @param  {String}            domain (Optional)
  */
  discoverHypertyPerURL(url, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/hyperty/url/' + url,
        criteria: {
          domain: activeDomain
        }
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply Value Log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverHypertyPerURL] Error Reply for " + url + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about hyperties registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}              url  hyperty URL
  * @param  {String}            domain (Optional)
  */
  discoverHypertyPerURLDO(url, domain) {

    return new Promise((resolve, reject) => {
      this.discoverHypertyPerURL(...arguments)
        .then(hyperty => resolve(new DiscoveredObject(hyperty, this.runtimeURL, this.discoveryURL, this.messageBus, this)))
        .catch(error => reject(error));
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * return the dataObject information, if found.
  * @param  {String}              url  dataObject URL
  * @param  {String}            domain (Optional)
  */
  discoverDataObjectPerURL(url, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/url/' + url,
        criteria: {
          domain: activeDomain
        }
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply Value Log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverDataObjectPerURL] Error Reply for " + url + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}              url  dataObject URL
  * @param  {String}            domain (Optional)
  */
  discoverDataObjectPerURLDO(url, domain) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjectPerURL(...arguments)
        .then(registryObject => resolve(new DiscoveredObject(registryObject, this.runtimeURL, this.discoveryURL, this.messageBus, this)))
        .catch(error => reject(error));
    });
  }

  /**
  * function to request about an dataObjects registered in domain registry with a given name, and
  * return the dataObjects information, if found.
  * @param  {String}              name  dataObject URL
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}            domain (Optional)
  */
  discoverDataObjectsPerName(name, schema, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/name/' + name
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema,
        domain: activeDomain
      };
    }else {
      msg.body['criteria'] = {
        domain: activeDomain
      }
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply Value Log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverDataObjectsPerName] Error Reply for " + name + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}              name  dataObject URL
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}            domain (Optional)
  */
  discoverDataObjectsPerNameDO(name, schema, resources, domain) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjectsPerName(...arguments)
        .then(registryObjects => resolve(this._convertToDiscoveredObject(registryObjects)))
        .catch(error => reject(error));
    });
  }

  /**
  * function to request about specific reporter dataObject registered in domain registry, and
  * return the dataObjects from that reporter.
  * @param  {String}           reporter     dataObject reporter
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}           domain       (Optional)
  */
  discoverDataObjectsPerReporter(reporter, schema, resources, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;


    let msg = {
      type: 'read',
      from: _this.discoveryURL,
      to: _this.runtimeURL + '/discovery/',
      body: {
        resource: '/dataObject/reporter/' + reporter
      }
    };

    if(schema || resources) {
      msg.body['criteria'] = {
        resources: resources,
        dataSchemes: schema,
        domain: activeDomain
      };
    }else {
      msg.body['criteria'] = {
        domain: activeDomain
      }
    }

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        if(reply.body.code === 200){
          log.log("Reply Value Log: ",reply.body.value);
          resolve(reply.body.value);
        }
        else {
          log.warn("[Discovery.discoverDataObjectsPerName] Error Reply for " + reporter + " Reason: ", reply.body.description);
          resolve([]);
        }
      });
    });
  }

  /**
  * function to request about dataObject registered in domain registry, and
  * returns discoveredObject.
  * @param  {String}              name  dataObject URL
  * @param  {Array<string>}    schema (Optional)     types of dataObjects schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObjects resources
  * @param  {String}            domain (Optional)
  */
  discoverDataObjectsPerReporterDO(reporter, schema, resources, domain) {

    return new Promise((resolve, reject) => {
      this.discoverDataObjectsPerReporter(...arguments)
        .then(registryObjects => resolve(this._convertToDiscoveredObject(registryObjects)))
        .catch(error => reject(error));
    });
  }

  _convertToDiscoveredObject(registryObjects) {
    return registryObjects.map((registryObject) => {
      return new DiscoveredObject(registryObject, this.runtimeURL, this.discoveryURL, this.messageBus, this);
    });
  }

  /** Advanced Search for dataObjects registered in domain registry
  * @deprecated Deprecated. Use discoverDataObjectsPerName instead
  * @param  {String}           name                  name of the dataObject
  * @param  {Array<string>}    schema (Optional)     types of dataObject schemas
  * @param  {Array<string>}    resources (Optional)  types of dataObject resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverDataObject(name, schema, resources, domain) {
    let _this = this;
    let activeDomain;
    //let userIdentifier = convertToUserURL(user);

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read', from: _this.discoveryURL, to: 'domain://registry.' + activeDomain, body: { resource: name,
      criteria: {resources: resources, dataSchemes: schema}
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {
        log.log('[Discovery]', reply)

        if(reply.body.code>299) {
          log.warn("[Discovery.discoverDataObject] Error Reply for " + name + " Reason: ", reply.body.description);
          return resolve([]);
        }

        let hyperties = reply.body.value;

        if (hyperties) {
          resolve(hyperties);
        } else {
          resolve([]);
        }
      });
    });
  }

  /** Advanced Search for Hyperties registered in domain registry
  * @deprecated Deprecated. Use discoverHyperties instead
  * @param  {String}           user                  user identifier, either in url or email format
  * @param  {Array<string>}    schema (Optional)     types of hyperties schemas
  * @param  {Array<string>}    resources (Optional)  types of hyperties resources
  * @param  {String}           domain (Optional)     domain of the registry to search
  */
  discoverHyperty(user, schema, resources, domain) {
    let _this = this;
    let activeDomain;
    let userIdentifier = convertToUserURL(user);

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    return new Promise(function(resolve, reject) {

      log.log('[Discovery.discoverHyperty] ACTIVE DOMAIN -> ', activeDomain, 'user->', user, 'schema->', schema, 'resources->', resources, 'domain->', domain);
      if (user.includes(':') && !user.includes('user://')) {
        log.log('[Discovery.discoverHyperty] ' + user + ' is legacy domain');
        let legacyUser = { userID: user, hypertyID: user, schema: schema, resources: resources };
        return resolve(legacyUser);
      }
      let msg = {
        type: 'read', from: _this.discoveryURL, to: 'domain://registry.' + activeDomain, body: { resource: userIdentifier,
        criteria: {resources: resources, dataSchemes: schema}
        }
      };

      log.info('[Discovery] msg to send->', msg);

      _this.messageBus.postMessage(msg, (reply) => {

        log.info('[Discovery] ON discoverHyperty->', reply);
        let hyperties = reply.body.value;

        if (hyperties) {
          resolve(hyperties);
        } else {
          reject('No Hyperty was found');
        }
      });
    });
  }

  /**
  * function to request about users registered in domain registry, and
  * return the last hyperty instance registered by the user.
  * @deprecated Deprecated. Use discoverHyperty instead
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  */
  discoverHypertyPerUser(email, domain) {
    let _this = this;
    let activeDomain;

    return new Promise(function(resolve, reject) {

      // Hack for legacy users
      if (email.includes(':') && !email.includes('user://')) {
        log.log('[Discovery.discoverHyperty] ' + email +'is legacy domain');
        let legacyUser = { id: email, hypertyURL: email, descriptor: 'unknown' };
        return resolve(legacyUser);
      }

      if (!domain) {
        activeDomain = _this.domain;
      } else {
        activeDomain = domain;
      }

      let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));


      // message to query domain registry, asking for a user hyperty.
      let message = {
        type: 'read', from: _this.discoveryURL, to: 'domain://registry.' + activeDomain, body: { resource: identityURL}
      };

      log.info('[Discovery] Message: ', message, activeDomain, identityURL);

      //log.info('[Discovery] message READ', message);

      _this.messageBus.postMessage(message, (reply) => {
        log.info('[Discovery] message reply', reply);

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

        log.info('[Discovery] Last Hyperty: ', lastHyperty, mostRecent);

        let hypertyURL = lastHyperty;

        if (hypertyURL === undefined) {
          return reject('User Hyperty not found');
        }

        let idPackage = {
          id: email,
          descriptor: value[hypertyURL].descriptor,
          hypertyURL: hypertyURL
        };

        log.info('[Discovery] ===> hypertyDiscovery messageBundle: ', idPackage);
        resolve(idPackage);
      });
    });
  }

  /**
  * function to request about users registered in domain registry, and
  * return the all the hyperties registered by the user
  * @deprecated Deprecated. Use discoverHyperty instead
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  */
  discoverHypertiesPerUser(email, domain) {
    let _this = this;
    let activeDomain;
    log.log('on Function->', email);
    return new Promise(function(resolve, reject) {

      if (email.includes(':') && !email.includes('user://')) {
        log.log('[Discovery.discoverHyperty] is legacy domain');
        let legacyUser = { userID: email, hypertyID: email, schema: schema, resources: resources };
        return resolve(legacyUser);
      }

      if (!domain) {
        activeDomain = _this.domain;
      } else {
        activeDomain = domain;
      }

      let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

      // message to query domain registry, asking for a user hyperty.
      let message = {
        type: 'read', from: _this.discoveryURL, to: 'domain://registry.' + activeDomain, body: { resource: identityURL}
      };

      log.log('[Discovery] Message discoverHypertiesPerUser: ', message, activeDomain, identityURL);

      //log.info('[Discovery] message READ', message);

      _this.messageBus.postMessage(message, (reply) => {
        log.info('[Discovery] discoverHypertiesPerUser reply', reply);

        let value = reply.body.value;

        if (!value) {
          return reject('User Hyperty not found');
        }

        resolve(value);
      });
    });
  }

  /**
  * function to request about users registered in domain registry, and
  * return the all the hyperties registered by the user
  * @deprecated Deprecated. Use discoverHyperty instead
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  */
  resumeDiscoveries() {

    let _this = this;

    log.log('[Discovery] resumeDiscoveries');

    return new Promise(function(resolve, reject) {

      let msg = {
        type: 'read', from: _this.discoveryURL, to: _this.runtimeURL + '/subscriptions', body: { resource: _this.discoveryURL}
      };

      _this.messageBus.postMessage(msg, (reply)=>{
        log.log('[Discovery.resumeDiscoveries] reply: ', reply);

        let notifications = [];

        if (reply.body.code === 200) {
          let urls = reply.body.value;// URLs to add listeners to

          //lets create one DiscoveryObject per notification
          urls.forEach((url) => {
            let objectUrl = url.split('/registration')[0];
            let data = {};
            data.url = objectUrl;
            log.log('[Discovery.resumeDiscoveries] adding listener to: ', objectUrl);

            if (objectUrl.includes('hyperty://')) {
              notifications.push(_this.discoverHypertyPerURLDO(objectUrl));
            } else {
              notifications.push(_this.discoverDataObjectPerURLDO(objectUrl));
            }
          });
          Promise.all(notifications).then(values=>{ resolve(values); });
        } else {
          resolve([]);
        }
      });

    });

  }
}

export default Discovery;
