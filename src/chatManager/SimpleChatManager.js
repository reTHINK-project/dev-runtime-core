
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
import Chat from './Chat';
import { UserInfo } from './UserInfo';

/**
* Hyperty Simple Group Chat Manager API
* @author Vitor Silva [vitor-t-silva@telecom.pt]
* @version 0.1.0
*/
class SimpleChatManager {

  constructor(myUrl, bus, configuration, syncher, factory) {
    if (!myUrl) throw new Error('[SimpleChatManager.constructor] The myUrl is a needed parameter');
    if (!bus) throw new Error('[SimpleChatManager.constructor] The MiniBus is a needed parameter');
    if (!configuration) throw new Error('[SimpleChatManager.constructor] The configuration is a needed parameter');

    let _this = this;
    if (!syncher) {
      syncher = factory.createSyncher(myUrl, bus, configuration);
    }

    _this._runtimeURL = configuration.runtimeURL;

    let domain = factory.divideURL(_this._runtimeURL).domain;
//    let discovery = factory.createDiscovery(myUrl, configuration.runtimeURL, bus);
    let identityManager = factory.createIdentityManager(myUrl, configuration.runtimeURL, bus);

    _this._objectDescURL = 'hyperty-catalogue://catalogue.' + domain + '/.well-known/dataschema/Communication';

    _this._reportersControllers = {};
    _this._observersControllers = {};

    _this._myUrl = myUrl;
    _this._bus = bus;
    _this._syncher = syncher;
    _this._domain = domain;

//    _this.discovery = discovery;
    _this.identityManager = identityManager;
    _this.currentIdentity;

//    _this.search = factory.createSearch(discovery, identityManager);

    _this.communicationObject = communicationObject;

    _this.communicationChildren = communicationChildren;

//    console.log('[SimpleChatManager] Discover ', discovery);
    console.log('[SimpleChatManager] Identity Manager ', identityManager);


  }

  set offline(offline) {
    this._offline = offline;
  }

  get offline() {
    return this._offline ? this._offline : false;
  }

  set backup(backup) {
    this._backup = backup;
  }

  get backup() {
    return this._backup ? this._backup : false;
  }

  processNotification(event) {
    let _this = this;
    console.log('[SimpleChatManager.processNotification: ', event);

    if (event.type === 'create') {

      // TODO: replace the 100 for Message.Response
      // event.ack(200);

      if (_this._onInvitation) { _this._onInvitation(event); }
    }

    if (event.type === 'delete') {
      // TODO: replace the 200 for Message.Response
      event.ack(200);

      if (_this._onNotification) { _this._onNotification(event); }

      if ( _this._observersControllers[event.url]){
        _this._observersControllers[event.url].closeEvent = event;

        delete _this._observersControllers[event.url];

        _this._observersControllers.closeEvent = event;

        _this.communicationObject = communicationObject;

      }


/*
      for (let url in this._reportersControllers) {
        this._reportersControllers[url].close(event);
      }

      for (let url in this._observersControllers) {
        this._observersControllers[url].close(event);
      }*/

    }
  }

  myIdentity(identity) {
    let _this = this;

    return new Promise((resolve, reject) => {
      console.info('[SimpleChatManager.myIdentity]');
      if (identity) return resolve(identity);

      if (_this._myUrl.includes('hyperty://')) {
        _this.identityManager.discoverUserRegistered().then((identity) => {
          _this.currentIdentity = identity;
          resolve(identity);
        }).catch(function(reason) {
          reject(reason);
        });
      } else {
        _this.identityManager.discoverIdentityPerIdP().then((identity) => {
          _this.currentIdentity = identity;
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
   * @param  {array<URL.HypertyURL>}         hyperties Array of hyperties to be invited to join the Group Chat. Users are identified with reTHINK User URL, like this format user://<ipddomain>/<user-identifier>
   * @return {<Promise>ChatController}    A ChatController object as a Promise.
   */
  create(name, hyperties, extra = {}) {

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
        console.log('[SimpleChatManager.create ] My Identity', identity);

        // let url = _this.communicationObject.reporter;

        let userInfo = new UserInfo(_this._myUrl, _this._domain, identity);

        // Add my identity
        _this.communicationObject.participants[identity.guid] = userInfo;

        console.log('[SimpleChatManager.create ] participants: ', _this.communicationObject.participants);
        console.log('[SimpleChatManager.create ] communicationObject', _this.communicationObject);


          console.info('[SimpleChatManager] ---------------------- Syncher Create ---------------------- \n');
          console.info('[SimpleChatManager] Selected Hyperties: !!! ', hyperties);
//          console.info(`Have ${hyperties.length} users;`);
          let mutual = extra.mutual ? extra.mutual : true;

          let input = Object.assign({resources: ['chat'], mutual: mutual}, extra);
          delete input.name;

          if (_this.offline) input.offline = _this.offline;
          if (_this.backup) input.backup = _this.backup;

          console.log('[SimpleChatManager] input data:', input);
          return syncher.create(_this._objectDescURL, hyperties, _this.communicationObject, true, false, name, {}, input);
        }).then(function(dataObjectReporter) {

          console.info('[SimpleChatManager] 3. Return Create Data Object Reporter', dataObjectReporter);

          let chat = new Chat(syncher, _this._domain, myIdentity, _this);
          chat.dataObjectReporter = dataObjectReporter;

          _this._reportersControllers[dataObjectReporter.url] = chat;

//          console.log('[SimpleChatManager] chat invitationsHandler: ',   chat.invitationsHandler);

          // process invitations to handle not received invitations
/*          if (dataObjectReporter.invitations.length > 0) {
            chat.invitationsHandler.processInvitations(live, dataObjectReporter);
          }

          // If any invited User is disconnected let's wait until it is connected again
          if (disconnected.length > 0) chat.invitationsHandler.inviteDisconnectedHyperties(disconnected, dataObjectReporter);
*/
          resolve(chat);

        }).catch(function(reason) {
          reject(reason);
        });

      }).catch((reason) => {
        console.log('[SimpleChatManager.create] MyIdentity Error:', reason);
        return reject(reason);
      });
//    });

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
   * This function is used to handle notifications about incoming invitations to join a Group Chat.
   * @param  {Function} CreateEvent The CreateEvent fired by the Syncher when an invitaion is received
   */
  onNotification(callback) {
    let _this = this;
    _this._onNotification = callback;
  }

  /**
   * This function is used to join a Group Chat.
   * @param  {URL.CommunicationURL} invitationURL  The Communication URL of the Group Chat to join that is provided in the invitation event
   * @return {<Promise>ChatController}             It returns the ChatController object as a Promise
   */
  join(invitationURL, mutual = false, identity) {
    let _this = this;

    return new Promise(function(resolve, reject) {
      let syncher = _this._syncher;
      let myIdentity;

      console.info('[SimpleChatManager] ------------------------ Syncher subscribe ---------------------- \n');
      console.info('invitationURL', invitationURL);
      _this.myIdentity(identity).then((identity) => {
        myIdentity = identity;
        let input = {
          schema: _this._objectDescURL,
          resource: invitationURL,
          store: true,
          p2p: false,
          mutual: mutual,
          domain_subscription: true,
          identity: identity
        };

        if (_this.offline) input.offline = _this.offline;

        return syncher.subscribe(input);

      }).then(function(dataObjectObserver) {
        console.info('Data Object Observer: ', dataObjectObserver);

        let chat = new Chat(syncher, _this._domain, myIdentity, _this);
        resolve(chat);

        chat.dataObjectObserver = dataObjectObserver;

        _this._observersControllers[dataObjectObserver.url] = chat;

      }).catch(function(reason) {
        reject(reason);
      });
    });

  }

}

export default SimpleChatManager;
