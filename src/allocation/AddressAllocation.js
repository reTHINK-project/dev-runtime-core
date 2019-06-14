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

// Log system
import * as logger from 'loglevel';
let log = logger.getLogger('address-allocation');


import {isURL, generateGUID} from '../utils/utils';

// TODO: this could not be the best way to do a Singleton but at this moment it works;

let instance;

/**
 * Class will ask to the message node for addresses
 */
class AddressAllocation {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Address Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */
  constructor(url, bus, registry, subscriptionManager) {

    if (!instance) {
      this._url = url + '/address-allocation';
      this._bus = bus;
      this._registry = registry;
      this._subscriptionManager = subscriptionManager;
      instance = this;
    } else {
      return instance;
    }
  }

  static get instance() {
    if (!instance) {
      throw new Error('The address allocation was not instantiated');
    }

    return instance
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */
  get url() { return this._url; }


  /**
   *
   * Ask for creation of a number of Hyperty addresses, to the domain message node.
   *
   * @param {Domain} domain - domain of the message node
   * @param {Number} number - number of address to be allocated
   * @param {Descriptor} info - descriptor to search for the hyperty (TODO:// this should be confirmed)
   * @see https://github.com/reTHINK-project/specs/blob/master/datamodel/core/hyperty-catalogue/readme.md#catalogue-data-model
   * @param {scheme} scheme - scheme of address to be created or reused, like: hyperty, comm, context, etc;
   * @param {boolean|URL.HypertyURL} reuseURL - reuseURL is used to reuse the hypertyURL previously registred;
   * @returns {Promise<Object, Error>} this is Promise and returns an object with the address information
   *
   * @memberOf AddressAllocation
   */
  create(domain, number, info, scheme, reuseURL) {

    log.log('[AddressAllocation.create] info ', info);
    //debugger;
    if (reuseURL) {

      if (typeof(reuseURL) === 'boolean') {

        if (reuseURL) {
          return this._reuseAllocatedAddress(domain, number, info, scheme, reuseURL);
        } else {
          return this._allocateNewAddress(domain, scheme, number, info);
        }

      }

      if (typeof(reuseURL) === 'string' && isURL(reuseURL)) {
        //return this._reuseAllocatedAddress(domain, number, info, scheme, reuseURL);
        return new Promise((resolve, reject) => {
          let value = { newAddress: false, address: [reuseURL] };
          return resolve(value);
        });
      }

    } else {
      log.log('[AddressAllocation] - new address will be allocated');

      // if there is no URL saved request a new URL
      return this._allocateNewAddress(domain, scheme, number, info);
    }

  }

  _reuseAllocatedAddress(domain, number, info, scheme, reuseURL) {

    return new Promise((resolve, reject) => {

      console.log('REUSETEST -  _reuseAllocatedAddress', domain, number, info, scheme, reuseURL);
      this._registry.checkRegisteredURLs(info, reuseURL).then((urls) => {
        console.log('REUSETEST -  registeredurls', urls);
        if (urls) {
          log.info('[AddressAllocation - ' + scheme + '] - Reuse URL');
          let value = {newAddress: false, address: urls};
          resolve(value);
        } else {

          if (typeof(reuseURL) === 'string') {
            log.info('[AddressAllocation - reuseURL] - Object ' + reuseURL + ' not found');
            reject('URL Not Found');
          } else if (typeof(reuseURL) === 'boolean') {
            this._allocateNewAddress(domain, scheme, number, info).then(resolve).catch(reject);
          } else {
            reject('URL Not Found');
          }

        }

      });

    });
  }

  _allocateNewAddress(domain, scheme, number, info) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let addresses = [];
      var i;

      for (i=0; i< number; i++) {
        addresses.push(scheme+'://' + domain + '/' + generateGUID())
      }

      let result = {newAddress: true, address: addresses};

      if (scheme === 'hyperty' ) {
        if (info.hasOwnProperty('configuration') && info.configuration.hasOwnProperty('domain_routing') && !info.configuration.domain_routing) 
          resolve(result);
        else {
          _this._subscriptionManager.createSubscription(domain,addresses, _this._url).then(()=>{
            resolve(result);
          });

        }
      } else resolve(result);


/*      let msg = {
        type: 'create', from: this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
        body: {value: { number: number } }
      };

      if (scheme !== 'hyperty') msg.body.scheme = scheme;

      log.info('[AddressAllocation - ' + scheme + '] - Request new URL');

      this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 200) {
          let result = {newAddress: true, address: reply.body.value.allocated};
          resolve(result);
        } else {
          reject(reply.body.desc);
        }
      });*/

      });

  }

  /**
  * Send a request to the domain message node, to deallocate one or more addresses
  * @param  {Domain} domain - Domain of the message node.
  * @param  {addresses} addresses to request the deallocation
  * @returns {Promise}  the response by the message node
  */
  delete(domain, addresses) {
    let _this = this;

    return new Promise((resolve, reject) => {

      resolve(200);

/*      let message = {
        type: 'delete', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
        body: {childrenResources: addresses}
      };

      _this._bus.postMessage(message, (reply) => {
        if (reply.body.code === 200) {
          resolve(reply.body.code);
        } else {
          reject(reply.body.desc);
        }
      });*/
    });

  }
}

export default AddressAllocation;
