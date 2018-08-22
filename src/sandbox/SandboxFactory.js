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
import Syncher from '../syncher/Syncher';
import NotificationHandler from '../syncher/NotificationHandler';
import {divideURL} from '../utils/utils';
import IdentityManager from '../identity/IdentityManager';
import Discovery from '../discovery/Discovery';
import RegistrationStatus from '../discovery/RegistrationStatus';
import Search from '../utils/Search';
import ContextObserver from '../contextManager/ContextObserver';
import ContextReporter from '../contextManager/ContextReporter';
import MessageBodyIdentity from '../identity/MessageBodyIdentity';
import ChatManager from '../chatManager/ChatManager';
import ChatController from '../chatManager/ChatController';

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

   createContextObserver(hypertyURL, bus, config, schemes) { 
    return new ContextObserver(hypertyURL, bus, config, schemes, this);
   }

   createContextReporter(hypertyURL, bus, config) { 
    let _this = this;
    return new ContextReporter(hypertyURL, bus, config, this);
   }

   createNotificationHandler(bus) { 
    let _this = this;
    return new NotificationHandler(bus);
   }

   createMessageBodyIdentity(username, userURL, picture, name, locale, idp, assertion, profile) { 
    return new MessageBodyIdentity(username, userURL, picture, name, locale, idp, assertion, profile);
   }

   createChatManager(hypertyURL, bus, configuration, syncher) { 
    return new ChatManager(hypertyURL, bus, configuration, syncher, this);
   }

   createChatController(syncher, discovery, domain, search, identity, manager) { 
    return new ChatController(syncher, discovery, domain, search, identity, manager);
   }

   get divideURL(){
     return this._divideURL;
   }

   createRegistrationStatus(observer, runtimeURL, chatUrl, bus) {
    return new RegistrationStatus(observer, runtimeURL, chatUrl, bus);

  }



}


export default SandboxFactory;
