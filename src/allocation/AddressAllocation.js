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
    let _this = this;

    // let messageFactory = new MessageFactory();
    //
    // _this._messageFactory = messageFactory;
    _this._url = url;
    _this._bus = bus;
    _this._registry = registry;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */
  get url() { return this._url; }

  /**
   * Ask for creation of a number of Hyperty addresses, to the domain message node.
   * @param  {Domain} domain - Domain of the message node.
   * @param  {number} number - Number of addresses to request
   * @returns {Promise<HypertyURL>}  A list of HypertyURL's
   */
  create(domain, number, info, scheme, reuseURL) {
    let _this = this;

    return new Promise((resolve, reject) => {

      if (reuseURL) {

        _this._registry.checkRegisteredURLs(info).then((urls) => {

          if (urls) {
            console.info('[AddressAllocation - ' + scheme + '] - Reuse URL');
            let value = {newAddress: false, address: urls};
            resolve(value);
          } else {
            console.info('[AddressAllocation - reuseURL] - Object ' + reuseURL + ' not found');
            reject('URL Not Found');
          }

        }).catch((reason) => {
          reject(reason);
        });

      } else {

        _this._registry.checkRegisteredURLs(info).then((urls) => {

          // if there is already a URL, then returns that URL, otherwise request a new URL
          if (urls) {

            console.info('[AddressAllocation - ' + scheme + '] - Reuse URL');
            let value = {newAddress: false, address: urls};
            resolve(value);

          } else {

            // if there is no URL saved request a new URL
            _this._allocateNewAddress(domain, scheme, number).then((allocated) => {
              resolve(allocated);
            }).catch((reason) => {
              reject(reason);
            });

          }
        }).catch((reason) => {
          reject(reason);
        });

      }
    });

  }

  _allocateNewAddress(domain, scheme, number) {

    return new Promise((resolve, reject) => {

      let msg = {
        type: 'create', from: this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
        body: {value: { number: number } }
      };

      if (scheme !== 'hyperty') msg.body.scheme = scheme;

      console.info('[AddressAllocation - ' + scheme + '] - Request new URL');

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

    let message = {
      type: 'delete', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
      body: {childrenResources: addresses}
    };

    return new Promise((resolve, reject) => {

      _this._bus.postMessage(message, (reply) => {
        console.log('reply', reply);
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
