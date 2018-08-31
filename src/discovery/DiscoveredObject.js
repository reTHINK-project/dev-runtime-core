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

//import {divideURL, convertToUserURL} from '../utils/utils';
import RegistrationStatus from './RegistrationStatus';

/**
* Discovered Object interface
*/
class DiscoveredObject extends RegistrationStatus {

  get data() {
    return this._data;
  }

  constructor(data, runtimeURL, discoveryURL, msgBus, discovery) {
    super(data.hypertyID || data.url, runtimeURL, discoveryURL, msgBus);

    this._data = data;
    this._discovery = discovery;
  }




  /**
  * function to check the status of the DiscoveredObject.
  * Depending on existing subscribers it may trigger onLive or onDisconnected events.
  *
  */

  check() {
    // query DR for the status and call processNotification with msg received

    let _this = this;
    let message = {
      body: {}
    };

    if (_this._discoveredObjectURL.startsWith('hyperty://') ) {
      _this._discovery.discoverHypertyPerURL(_this._discoveredObjectURL).then((registration)=>{
        message.body.status = registration.status;
        _this._processNotification(message);
      });
    } else {
      _this._discovery.discoverDataObjectsPerURL(_this._discoveredObjectURL).then((registration)=>{
        message.body.status = registration.status;
        _this._processNotification(message);
      });
    }
  }



}

export default DiscoveredObject;
