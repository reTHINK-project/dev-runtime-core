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

import {divideURL, convertToUserURL} from '../utils/utils';

/**
* Core Discovery interface
* Class to allow applications to search for hyperties and DataObjects using the message bus
*/
class DiscoveryServiceFramework {

  /**
  * To initialise the HypertyDiscover, which will provide the support for hyperties to
  * query users registered in outside the internal core.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {RuntimeURL}          runtimeURL            runtimeURL
  */
  constructor(hypertyURL, runtimeURL, msgBus) {
    let _this = this;
    _this.messageBus = msgBus;

    _this.domain = divideURL(runtimeURL).domain;
    _this.discoveryURL = hypertyURL + '/discovery';
    _this.registryURL = runtimeURL + '/registry/';

  }

  /**
  * function to request about an dataObject registered in domain registry with a given name, and
  * return the dataObject information, if found.
  * @param  {String}              name  dataObject URL
  * @param  {String}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverDataObjectPerName(name, domain) {
    let _this = this;
    let activeDomain;

    activeDomain = (!domain) ? _this.domain : domain;

    let msg = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: name}
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

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
  * function to request about dataObject registered in domain registry, and
  * return the dataObject information, if found.
  * @param  {String}              url  dataObject URL
  * @param  {String}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverDataObjectPerURL(url, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let msg = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: url}
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

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
  *  function to delete an Data Object registered in the Domain Registry
  *  @param   {String}           url              dataObject url
  *  @param   {domain}           domain         (Optional)
  *  @return  {Promise}          Promise          result
  */
  deleteDataObject(url, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let msg = {
      type: 'delete', from: _this.discoveryURL, to: _this.registryURL,  body: { value: {name: url}}};

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let response = reply.body.code;

        if (response === 200) {
          resolve(response);
        } else {
          reject('Error on deleting dataObject');
        }
      });
    });

  }

  /**
  * function to request about specific reporter dataObject registered in domain registry, and
  * return the dataObjects from that reporter.
  * @param  {String}           reporter     dataObject reporter
  * @param  {String}           domain       (Optional)
  * @return {Array}           Promise       DataObjects
  */
  discoverDataObjectPerReporter(reporter, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let msg = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: reporter}
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let dataObjects = reply.body.value;

        if (dataObjects) {
          resolve(dataObjects);
        } else {
          reject('No dataObject was found');
        }
      });
    });
  }

  /** Advanced Search for dataObjects registered in domain registry
  * @param  {String}           user                  user identifier, either in url or email format
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
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: name,
      criteria: {resources: resources, dataSchemes: schema}
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let hyperties = reply.body.value;

        if (hyperties) {
          resolve(hyperties);
        } else {
          reject('No DataObject was found');
        }
      });
    });
  }

  /** Advanced Search for Hyperties registered in domain registry
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

    let msg = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: userIdentifier,
      criteria: {resources: resources, dataSchemes: schema}
      }
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

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
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverHypertyPerUser(email, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

    // message to query domain registry, asking for a user hyperty.
    let message = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: identityURL}
    };

    console.log('Message: ', message, activeDomain, identityURL);

    //console.log('message READ', message);
    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(message, (reply) => {
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

  /**
  * function to request about users registered in domain registry, and
  * return the all the hyperties registered by the user
  * @param  {email}              email
  * @param  {domain}            domain (Optional)
  * @return {Promise}          Promise
  */
  discoverHypertiesPerUser(email, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

    // message to query domain registry, asking for a user hyperty.
    let message = {
      type: 'read', from: _this.discoveryURL, to: _this.registryURL, body: { resource: identityURL}
    };

    console.log('Message discoverHypertiesPerUser: ', message, activeDomain, identityURL);

    //console.log('message READ', message);
    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(message, (reply) => {
        console.log('discoverHypertiesPerUser reply', reply);

        let value = reply.body.value;

        if (!value) {
          return reject('User Hyperty not found');
        }

        resolve(value);
      });
    });
  }

  /**
  *  function to delete an hypertyInstance in the Domain Registry
  *  @param   {String}           user              user url
  *  @param   {String}           hypertyInstance   HypertyInsntance url
  *  @param   {domain}           domain (Optional)
  *  @return  {Promise}          Promise          result
  */
  deleteHyperty(user, hypertyInstance, domain) {
    let _this = this;
    let activeDomain;

    if (!domain) {
      activeDomain = _this.domain;
    } else {
      activeDomain = domain;
    }

    let msg = {
      type: 'delete', from: _this.discoveryURL, to: _this.registryURL,   body: { value: {user: user, url: hypertyInstance }}};

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(msg, (reply) => {

        let response = reply.body.code;

        if (response) {
          resolve('Hyperty successfully deleted');
        } else {
          reject('Error on deleting hyperty');
        }
      });
    });

  }

}

export default DiscoveryServiceFramework;
