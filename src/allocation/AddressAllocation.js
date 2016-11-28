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

      // let messageFactory = _this._messageFactory;
      let msg;

      // is an hyperty
      if (scheme === 'hyperty') {

        _this._registry.checkRegisteredURLs(info).then((urls) => {

          console.log('CHECK URLS: ', urls);

          // if there is already a URL, then returns that URL, otherwise request a new URL
          if (urls) {
            console.info('[AddressAllocation - hyperty] - Reuse URL');
            let value = {newAddress: false, address: urls};
            resolve(value);

          } else {

            msg = {
              type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
              body: {value: {number: number}}
            };

            console.info('[AddressAllocation - hyperty] - Request new URL', msg);

            // TODO: change this response Message using the MessageFactory
            _this._bus.postMessage(msg, (reply) => {
              if (reply.body.code === 200) {
                let result = {newAddress: true, address: reply.body.value.allocated};
                resolve(result);
              } else {
                reject(reply.body.desc);
              }
            });

          }

        }).catch((reason) => {
          reject(reason);
        });

      } else {

        // check if we have an reuseURL
        if (reuseURL) {

          _this._registry.checkRegisteredURLs(info).then((urls) => {

            if (urls) {
              console.info('[AddressAllocation - Object] - Reuse URL');
              let value = {newAddress: false, address: urls};
              resolve(value);
            } else {
              console.info('[AddressAllocation - reuseURL] - Object ' + reuseURL + ' not found');
              reject('ObjectURL Not Found');
            }

          }).catch((reason) => {
            reject(reason);
          });

        } else {

          msg = {
            type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
            body: { scheme: scheme, value: { number: number } }
          };

          console.info('[AddressAllocation - Object] - Request new URL');

          // TODO: change this response Message using the MessageFactory
          _this._bus.postMessage(msg, (reply) => {
            if (reply.body.code === 200) {
              let result = {newAddress: true, address: reply.body.value.allocated};
              resolve(result);
            } else {
              reject(reply.body.desc);
            }
          });

        }

      }

      // _this._registry.checkRegisteredURLs(info).then((urls) => {
      //
      //   console.log('CHECK URLS: ', urls);
      //
      //   // if there is already a URL, then returns that URL, otherwise request a new URL
      //   if (urls) {
      //     let value = {newAddress: false, address: urls};
      //     return resolve(value);
      //   }
      //
      //   if (scheme) {
      //     msg = {
      //       type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
      //       body: { scheme: scheme, value: { number: number } }
      //     };
      //   } else {
      //     msg = {
      //       type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/address-allocation',
      //       body: {value: {number: number}}
      //     };
      //   }
      //
      //   // TODO: Apply the message factory
      //   // The msg-node-vertx should be changed the body field to receive
      //   // the following format body: {value: {number: number}} because
      //   // the message is generated in that way by the message factory;
      //   // let msg = messageFactory.createMessageRequest(_this._url, 'domain://msg-node.' + domain + '/hyperty-address-allocation', '', {number: number});
      //
      //   // TODO: change this response Message using the MessageFactory
      //   _this._bus.postMessage(msg, (reply) => {
      //     if (reply.body.code === 200) {
      //       let result = {newAddress: true, address: reply.body.value.allocated};
      //       resolve(result);
      //     } else {
      //       reject(reply.body.desc);
      //     }
      //   });
      //
      // });
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
