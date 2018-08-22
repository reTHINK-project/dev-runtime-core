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

/**
* To manage Group Chat Invitations
* @author Paulo Chainho [paulo-g-chainho@alticelabs.com]
* @version 0.1.0
*/

// TODO: have an instance per ChatController

class InvitationsHandler {

  constructor(hypertyURL) {

    if (!hypertyURL) throw Error('hypertyURL is a necessary dependecy');

    let _this = this;
    _this._hypertyURL = hypertyURL;

    _this._pending = {}; // All pending invitations
  }

  set invitationResponse(callback) {
    this._invitationsResponse = callback;
  }

  /**
   * This function is used to handle notifications for disconnected Hy+erties.
   * @param  {DiscoveredObject[]}    disconnected  array of discovered hyperties that are disconnected
   * @param  {DataObjectReporter}    DataObjectReporter   Data Object Reporter addressed by invitations
   */

  inviteDisconnectedHyperties(disconnected, dataObjectReporter) {

    let _this = this;
    console.log('[GroupChatManager.InvitationsHandler.inviteDisconnectedHyperties] lets invite ', disconnected);

    disconnected.forEach((disconnectedHyperty)=>{

      if (!_this._pending[dataObjectReporter]) {
        _this._pending[dataObjectReporter] = {};
      }

      _this._pending[dataObjectReporter][disconnectedHyperty.data.hypertyID] = disconnectedHyperty;

      disconnectedHyperty.onLive(_this._hypertyURL,()=>{
        console.log('[GroupChatManager.create] disconnected Hyperty is back to live', disconnectedHyperty);

        dataObjectReporter.inviteObservers([disconnectedHyperty.data.hypertyID]);

        disconnectedHyperty.unsubscribeLive(_this._hypertyURL);

        delete _this._pending[dataObjectReporter][disconnectedHyperty.data.hypertyID];

      });

    });

  }

  /**
   * This function is used to process sent invitations. In case invitations are not acknowledge by recipient it will be handled as a disconnected hyperty
   * @param  {DiscoveredObject[]}    live  array of discovered hyperties that are or were live
   * @param  {DataObjectReporter}    DataObjectReporter   Data Object Reporter addressed by invitations
   */

  processInvitations(live, dataObjectReporter) {
    let _this = this;

    let invitations = dataObjectReporter.invitations || [];

    console.log('[GroupChatManager.InvitationsHandler.processInvitations] waiting for replies ', invitations, this._invitationsResponse);

    invitations.forEach((invitation) => {
      invitation.then((result) => {
        console.log('[GroupChatManager.InvitationsHandler.processInvitations] - OK: ', result, this._invitationsResponse);
        if (this._invitationsResponse) { this._invitationsResponse(result); }
      }).catch((result) => {
        console.log('[GroupChatManager.InvitationsHandler.processInvitations] - NOT OK: ', result, this._invitationsResponse);
        if (this._invitationsResponse) { this._invitationsResponse(result); }
        _this.inviteDisconnectedHyperties([live[result.invited]], dataObjectReporter);
      });
    });

  }

  resumeDiscoveries(discoveryEngine, groupChat) {
    let _this = this;

    return new Promise((resolve, reject) => {

      let live = {};
      let liveHyperties = [];
      let disconnected = [];
      let unsubscriptonPromises = [];

      discoveryEngine.resumeDiscoveries().then((discoveries) => {

        console.log('[GroupChatManager.InvitationsHandler.resumeDiscoveries] found: ', discoveries);

        discoveries.forEach((discovery) =>{

          if (discovery.data.resources && discovery.data.resources[0] === 'chat') {
            console.log('[GroupChatManager.InvitationsHandler.resumeDiscoveries] resuming: ', discovery);

            if (discovery.data.status === 'live' ) {// previously discovered object is now live
              live[discovery.data.hypertyID] = discovery;
              liveHyperties.push(discovery.data.hypertyID);
              unsubscriptonPromises.push( discovery.unsubscribeLive(_this._hypertyURL) );
            } else {// previously discovered object is still disconnected
              disconnected.push(discovery);
            }
          }
        });
        if (disconnected.length > 0) _this.inviteDisconnectedHyperties(disconnected, groupChat);

        if ( Object.keys(live).length > 0) {
          groupChat.inviteObservers(liveHyperties);

          if (groupChat.invitations.length > 0) _this.processInvitations(live, groupChat);

          Promise.all(unsubscriptonPromises).then(()=>{ resolve()});

        } else resolve();

      });
    }).catch((reason) => {
    reject('[GroupChatManager.InvitationsHandler.resumeDiscoveries] failed | ', reason);
  });
  }

  /**
   * This function is used to remove and clean all pending invitations.
   * @param  {DataObjectReporter}    DataObjectReporter   Data Object Reporter addressed by invitations
   * @return {Promise} return a promise when all unsubscriptons for pending invitations are finished
   */

  cleanInvitations(dataObjectReporter) {
    let _this = this;

    let chatInvitations = _this._pending[dataObjectReporter];

    console.log('[GroupChatManager.InvitationsHandler.cleanInvitations] ', chatInvitations);

    if (chatInvitations) {

      return new Promise((resolve, reject) => {
        let pendingInvitations = Object.keys(chatInvitations);

        let unsubscriptonPromises = [];

        pendingInvitations.forEach((invitation)=>{
          unsubscriptonPromises.push( chatInvitations[invitation].unsubscribeLive(_this._hypertyURL) );
        });

        Promise.all(pendingInvitations).then(()=>{ resolve(); });

      });

    } else return Promise.resolve();


  }

}

export default InvitationsHandler;
