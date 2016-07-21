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
class ObjectAllocation {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Object Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */
  constructor(url, bus) {
    let _this = this;

    _this._url = url;
    _this._bus = bus;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */
  get url() { return this._url; }

  /**
   * Ask for creation of a number of Object addresses, to the domain message node.
   * @param  {Domain} domain - Domain of the message node.
   * @param  {number} number - Number of addresses to request
   * @returns {Promise<ObjectURL>}  A list of ObjectURL's
   */
  create(domain, scheme, number) {
    let _this = this;

    //FLOW-OUT: message sent to msg-node ObjectAllocationManager component
    let msg = {
      type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/object-address-allocation',
      body: { scheme: scheme, value: { number: number } }
    };

    return new Promise((resolve, reject) => {
      _this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 200) {
          resolve(reply.body.value.allocated);
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }
}

export default ObjectAllocation;
