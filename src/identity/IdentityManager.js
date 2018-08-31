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
import {divideURL} from '../utils/utils';

/**
* Core IdentityManager interface
* Class to allow applications to search for Identities registered in runtime-core
*/
class IdentityManager {

  /**
  * To initialise the IdentityManager, which will provide the support for hyperties to
  * query about identities registered
  * @param  {String}          owner            owner
  * @param  {String}          runtimeURL            runtimeURL
  * @param  {MessageBus}          msgbus                msgbus
  */
  constructor(owner, runtimeURL, msgBus) {
    let _this = this;
    _this.messageBus = msgBus;

    _this.domain = divideURL(owner).domain;
    _this.owner = owner;
    _this.runtimeURL = runtimeURL;
  }

  /**
  * Function to query the runtime registry about the identity to which the hyperty was associated
  * @param {String}       type (Optional)         type of user info required
  * @param {String}       owner (Optional)   owner to search for
  * @return {Promise}     userURL       userURL associated to the hyperty
  */
  discoverUserRegistered(type, hyperty) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let activeHypertyURL;

      // if any type of search is selected query for that type, otherwise query for default user info
      let searchType = (type) ? type : '.';

      if (!hyperty) {
        activeHypertyURL = _this.owner;
      } else {
        activeHypertyURL = hyperty;
      }

      let msg = {
        type: 'read', from: activeHypertyURL, to: _this.runtimeURL + '/registry/', body: { resource: searchType, criteria: activeHypertyURL}
      };

      _this.messageBus.postMessage(msg, (reply) => {

        let userURL = reply.body.resource;

        if (userURL && reply.body.code === 200) {
          resolve(userURL);
        } else {
          reject('code: ' + reply.body.code + ' No user was found');
        }
      });
    });
  }

  /**
  * Function to query the Identity Module about authenticated identities from a certain domain
  * @param {String}       idp idp domain of the identity to be discovered
  * @return {Promise}     identity
  */

  discoverIdentityPerIdP(idp) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      let msg = {
        type: 'read', from: this.owner, to: _this.runtimeURL + '/idm', body: { resource: idp, criteria: 'idp'}
      };

      _this.messageBus.postMessage(msg, (reply) => {

        if (reply.body.code === 200) {
          resolve(reply.body.value);
        } else {
          reject(reply.body.code + ' ' + reply.body.desc);
        }
      });
    });
  }
}

export default IdentityManager;
