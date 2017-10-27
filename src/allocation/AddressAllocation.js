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
// import MessageFactory from '../../resources/MessageFactory';

// Log system
import * as logger from 'loglevel';
let log = logger.getLogger('address-allocation');


import {isURL} from '../utils/utils';

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
  constructor(url, bus, registry) {

    if (!instance) {
      this._url = url + '/address-allocation';
      this._bus = bus;
      this._registry = registry;
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

    // // console.log('typeof(reuseURL)', typeof(reuseURL), reuseURL);

    if (reuseURL) {

      if (typeof(reuseURL) === 'boolean') {

        if (reuseURL) {
          return this._reuseAllocatedAddress(domain, number, info, scheme, reuseURL);
        } else {
          return this._allocateNewAddress(domain, scheme, number);
        }

      }

      if (typeof(reuseURL) === 'string' && isURL(reuseURL)) {
        return this._reuseAllocatedAddress(domain, number, info, scheme, reuseURL);
      }

    } else {
      log.info('[AddressAllocation] - new address will be allocated');

      // if there is no URL saved request a new URL
      return this._allocateNewAddress(domain, scheme, number);
    }

  }

  _reuseAllocatedAddress(domain, number, info, scheme, reuseURL) {

    return new Promise((resolve, reject) => {

      this._registry.checkRegisteredURLs(info, reuseURL).then((urls) => {

        if (urls) {
          log.info('[AddressAllocation - ' + scheme + '] - Reuse URL');
          let value = {newAddress: false, address: urls};
          resolve(value);
        } else {

          if (typeof(reuseURL) === 'string') {
            log.info('[AddressAllocation - reuseURL] - Object ' + reuseURL + ' not found');
            reject('URL Not Found');
          } else if (typeof(reuseURL) === 'boolean') {
            this._allocateNewAddress(domain, scheme, number).then(resolve).catch(reject);
          } else {
            reject('URL Not Found');
          }

        }

      });

    });
  }

  _allocateNewAddress(domain, scheme, number) {

    return new Promise((resolve, reject) => {

      let msg = {
        type: 'create', from: this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
        body: {value: { number: number } }
      };

      if (scheme !== 'hyperty') msg.body.scheme = scheme;

      log.info('[AddressAllocation - ' + scheme + '] - Request new URL');

      // TODO: change this response Message using the MessageFactory
      this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 200) {
          let result = {newAddress: true, address: reply.body.value.allocated};
          resolve(result);
        } else {
          reject(reply.body.desc);
        }
      });

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

      let message = {
        type: 'delete', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
        body: {childrenResources: addresses}
      };

      _this._bus.postMessage(message, (reply) => {
        if (reply.body.code === 200) {
          resolve(reply.body.code);
        } else {
          reject(reply.body.desc);
        }
      });
    });

  }
}

export default AddressAllocation;
