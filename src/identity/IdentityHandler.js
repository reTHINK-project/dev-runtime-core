/**
* Provides an API to manage identities from msg bus pipeline
* TODO: rename to something like IdentityPipelineHandler in order not to conflict with framework related IdentityHandler
*/

import * as logger from 'loglevel';
import Identities from './Identities';
import MsgBusHandlers from '../runtime/MsgBusHandlers';
let log = logger.getLogger('IdentityHandler');

class IdentityHandler {

  constructor(idm) {
    let _this = this;

    _this._idm = idm;

  }

  reset() {
    console.log('IM reset');

    // this._idm.identities.reset();
    this._idm.identities = new Identities(this._idm.identities._type, this._idm.identities._storageManager);
    console.log(this._idm.identities);
  }

  _isToSetID(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];

    let _from = message.from;

    if (message.body && message.body.hasOwnProperty('source')) {
      _from = message.body.source;
    }

    if (message.body && message.body.hasOwnProperty('subscriber')) {
      _from = message.body.subscriber;
    }

    if (message.type === 'forward') {
      return false;
    }

    if (message.type === 'event') {
      return false;
    }

    // Signalling Messages between P2P Stubs don't have Identities. FFS
    if (_from.includes('/p2prequester/') || _from.includes('/p2phandler/')) {
      return false;
    }


    let splitFrom = (_from).split('://');
    let fromSchema = splitFrom[0];
    let isToIgnore = schemasToIgnore.indexOf(fromSchema) === -1;

    return isToIgnore;
  }

  processMessage(message) {
    log.log('[IdentityHandler.processMessage] ', message);

    return new Promise((resolve, reject) => {

      // skip messages that don't need identity tokens in the body

      if (!this._isToSetID(message)) return resolve(message);

      if (message.body && message.body.value && message.body.value.anonymous){
        if (message.body.identity && message.body.identity.guid)
          message.body.identity = { userProfile: { guid: message.body.identity.guid } };
        else message.body.identity = { userProfile: { guid: 'anonymous' }  };
        return resolve(message);
  
      }
  

      /*      let from = message.from;
      let sourceURL = undefined;
      if ( message.hasOwnProperty('body') && message.body.hasOwnProperty('source')) {
        from = message.body.source;
      }

      if (message.type === 'forward') {
        from = message.body.from;
      }

      if (message.hasOwnProperty('body') && message.body.hasOwnProperty('subscriber')) {
        from = message.body.subscriber;
      }*/

      this._idm.getToken(message).then((identity) => {

        if (!message.hasOwnProperty('body')) message.body = {};

        message.body.identity = identity;
        resolve(message);
      }).catch((reason) => {
        log.error(reason);
        reject(reason);
      });

    });


  }


}

export default IdentityHandler;
