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
import {Syncher} from 'service-framework/dist/Syncher';
import {divideURL} from '../utils/utils';
import IdentityManager from 'service-framework/dist/IdentityManager';
import { Discovery } from 'service-framework/dist/Discovery';
import Search from '../utils/Search';

/**
 * Internal component to instantiate framework functionalities.
 */
class SandboxFactory {
  /* private
  _components: <url: instance>
  */

  constructor(bus) {
    let _this = this;
    _this._bus = bus;
    _this._divideURL = divideURL;

  }

  createSyncher(owner, bus, config) { 
    return new Syncher(owner, bus, config);
   }

   createIdentityManager(hypertyURL, runtimeURL, bus) { 
    let _this = this;
    return new IdentityManager(hypertyURL, runtimeURL, bus);
   }

   createDiscovery(hypertyURL, runtimeURL, bus) { 
    let _this = this;
    return new Discovery(hypertyURL, runtimeURL, bus);
   }

   createSearch(discovery, identityManager) { 
    let _this = this;
    return new Search(discovery, identityManager);
   }

   get divideURL(){
     return this._divideURL;
   }


}


export default SandboxFactory;