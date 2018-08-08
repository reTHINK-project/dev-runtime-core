
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

// Service Framework
//import IdentityManager from '../identityManager/IdentityManager';
//import RegistrationStatus from '../discovery/RegistrationStatus';
//import Discovery from '../discovery/Discovery';
//import Syncher from '../syncher/Syncher';

// Utils
//import {divideURL} from '../utils/utils';
//import Search from '../utils/Search';

// Internals
import { communicationObject, CommunicationStatus, communicationChildren } from './communication';
import ChatController from './ChatController';
import { UserInfo } from './UserInfo';

/**
* Hyperty Group Chat Manager API (HypertyChat)
* @author Vitor Silva [vitor-t-silva@telecom.pt]
* @version 0.1.0
*/
class ChatManager {

  constructor(myUrl, bus, configuration, factory, syncher) {
    if (!myUrl) throw new Error('[ChatManager.constructor] The myUrl is a needed parameter');
    if (!bus) throw new Error('[ChatManager.constructor] The MiniBus is a needed parameter');
    if (!configuration) throw new Error('[ChatManager.constructor] The configuration is a needed parameter');

    let _this = this;
    if (!syncher) {
      syncher = factory.createSyncher(myUrl, bus, configuration);
    }

    _this._runtimeURL = configuration.runtimeURL;

    let domain = factory.divideURL(_this._runtimeURL).domain;
    let discovery = factory.createDiscovery(myUrl, configuration.runtimeURL, bus);
    let identityManager = factory.createIdentityManager(myUrl, configuration.runtimeURL, bus);

    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/Communication';

    _this._reportersControllers = {};
    _this._observersControllers = {};

    _this._myUrl = myUrl;
    _this._bus = bus;
    _this._syncher = syncher;
    _this._domain = domain;

    _this.discovery = discovery;
    _this.identityManager = identityManager;
    _this.currentIdentity;

    _this.search = factory.createSearch(discovery, identityManager);

    _this.communicationObject = communicationObject;

    _this.communicationChildren = communicationChildren;

    console.log('[ChatManager] Discover ', discovery);
    console.log('[ChatManager] Identity Manager ', identityManager);


  }


  processNotification(event) {
    let _this = this;
    console.log('[ChatManager.processNotification: ', event);

    if (event.type === 'create') {

      // TODO: replace the 100 for Message.Response
      // event.ack(200);

      if (_this._onInvitation) { _this._onInvitation(event); }
    }

    if (event.type === 'delete') {
      // TODO: replace the 200 for Message.Response
      event.ack(200);

      _this._observersControllers[event.url].closeEvent = event;

      delete _this._observersControllers[event.url];

      _this._observersControllers.closeEvent = event;

      _this.communicationObject = communicationObject;


      for (let url in this._reportersControllers) {
        this._reportersControllers[url].closeEvent(event);
      }

      for (let url in this._observersControllers) {
        this._observersControllers[url].closeEvent(event);
      }

    }
  }

  myIdentity(identity) {
    let _this = this;

    return new Promise((resolve, reject) => {
      console.info('[ChatManager.myIdentity]');
      if (identity) return resolve(identity);

      if (_this._myUrl.includes('hyperty://')) {
        _this.identityManager.discoverUserRegistered().then((identity) => {
          resolve(identity);
        }).catch(function(reason) {
          reject(reason);
        });
      } else {
        _this.identityManager.discoverIdentityPerIdP().then((identity) => {
          resolve(identity);
        }).catch(function(reason) {
          reject(reason);
        });
      }
    });
  }

  /**
   * This function is used to create a new Group Chat providing the name and the identifiers of users to be invited.
   * @param  {string}                     name  Is a string to identify the Group Chat
   * @param  {array<URL.userURL>}         users Array of users to be invited to join the Group Chat. Users are identified with reTHINK User URL, like this format user://<ipddomain>/<user-identifier>
   * @return {<Promise>ChatController}    A ChatController object as a Promise.
   */
  create(name, users, extra = {}) {

    let _this = this;
    let syncher = _this._syncher;

    return new Promise((resolve, reject) => {

      _this.communicationObject = communicationObject;
      _this.communicationObject.cseq = 1;
      _this.communicationObject.startingTime = new Date().toJSON();
      _this.communicationObject.status =  CommunicationStatus.OPEN;

      let myIdentity;

      _this.myIdentity().then((identity) => {
        myIdentity = identity;
        console.log('[ChatManager.create ] My Identity', identity);

        // let url = _this.communicationObject.reporter;

        let userInfo = new UserInfo(_this._myUrl, _this._domain, identity);

        // Add my identity
        _this.communicationObject.participants[identity.userURL] = userInfo;

        console.log('[ChatManager.create ] participants: ', _this.communicationObject.participants);
        console.log('[ChatManager.create ] communicationObject', _this.communicationObject);
        console.info('[ChatManager.create] searching ' + users);

        //let usersSearch = _this.search.users(users, domains, ['comm'], ['chat']);

        let usersDiscovery = [];

        let disconnected = [];
        let live = {};
        let mutual = true;

        users.forEach((user) => {
          let userDiscoveryPromise = _this.discovery.discoverHypertiesDO(user.user, ['comm'], ['chat'], user.domain);
          usersDiscovery.push(userDiscoveryPromise);

          //if (user.user.includes('://')) mutual = false;
        });

        Promise.all(usersDiscovery).then((userDiscoveryResults) => {
          console.log('[ChatManager.create] Users Discovery Results->', userDiscoveryResults);

          let selectedHyperties = [];

          userDiscoveryResults.forEach((userDiscoveryResult) => {

            userDiscoveryResult.forEach((discovered)=>{
              if (discovered.data.status === 'live') {
                selectedHyperties.push(discovered.data.hypertyID);
                live[discovered.data.hypertyID] = discovered;
              } else {
                // To control the number of subscriptions to disconnected devices
                 if (disconnected.length < 5) {
                    disconnected.push(discovered);
                  }
              }
            });

          });


          /*        return usersSearch;
      }).then((hypertiesIDs) => {
        let selectedHyperties = hypertiesIDs.map((hyperty) => {
          return hyperty.hypertyID;
        }); */

          console.info('[ChatManager] ---------------------- Syncher Create ---------------------- \n');
          console.info('[ChatManager] Selected Hyperties: !!! ', selectedHyperties);
          console.info(`Have ${selectedHyperties.length} users;`);

          let input = Object.assign({resources: ['chat'], mutual: mutual}, extra);
          delete input.name;

          console.info('[ChatManager] input data:', input);
          return syncher.create(_this._objectDescURL, selectedHyperties, _this.communicationObject, true, false, name, {}, input);
        }).then(function(dataObjectReporter) {

          console.info('[ChatManager] 3. Return Create Data Object Reporter', dataObjectReporter);

          let chatController = new ChatController(syncher, _this.discovery, _this._domain, _this.search, myIdentity, _this);
          chatController.dataObjectReporter = dataObjectReporter;

          _this._reportersControllers[dataObjectReporter.url] = chatController;

          console.log('[ChatManager] chatController invitationsHandler: ',   chatController.invitationsHandler);

          // process invitations to handle not received invitations
          if (dataObjectReporter.invitations.length > 0) {
            chatController.invitationsHandler.processInvitations(live, dataObjectReporter);
          }

          // If any invited User is disconnected let's wait until it is connected again
          if (disconnected.length > 0) chatController.invitationsHandler.inviteDisconnectedHyperties(disconnected, dataObjectReporter);

          resolve(chatController);

        }).catch(function(reason) {
          reject(reason);
        });

      }).catch((reason) => {
        console.log('[ChatManager.create] MyIdentity Error:', reason);
        return reject(reason);
      });
    });

  }


  /**
   * This function is used to handle notifications about incoming invitations to join a Group Chat.
   * @param  {Function} CreateEvent The CreateEvent fired by the Syncher when an invitaion is received
   */
  onInvitation(callback) {
    let _this = this;
    _this._onInvitation = callback;
  }

  /**
   * This function is used to join a Group Chat.
   * @param  {URL.CommunicationURL} invitationURL  The Communication URL of the Group Chat to join that is provided in the invitation event
   * @return {<Promise>ChatController}             It returns the ChatController object as a Promise
   */
  join(invitationURL, mutual = true, identity) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      let syncher = _this._syncher;
      let myIdentity;

      console.info('[ChatManager] ------------------------ Syncher subscribe ---------------------- \n');
      console.info('invitationURL', invitationURL);
      _this.myIdentity(identity).then((identity) => {
        myIdentity = identity;
        return syncher.subscribe(_this._objectDescURL, invitationURL, true, false, mutual, identity);

      }).then(function(dataObjectObserver) {
        console.info('Data Object Observer: ', dataObjectObserver);

        let chatController = new ChatController(syncher, _this.discovery, _this._domain, _this.search, myIdentity, _this);
        resolve(chatController);

        chatController.dataObjectObserver = dataObjectObserver;

        _this._observersControllers[dataObjectObserver.url] = chatController;

      }).catch(function(reason) {
        reject(reason);
      });
    });

  }

}

export default ChatManager;
