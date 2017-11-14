/**
* Provides an API to manage identities from msg bus pipeline
*
*/
import * as logger from 'loglevel';
let log = logger.getLogger('IdentityManager');

class IdentityManager {

  constructor(idm) {
    let _this = this;

    _this._idm = idm;

  }

  processMessage(message) {
    log.log('[IdentityManager.processMessage] ', message);

    return new Promise((resolve,reject) => {
      let from = message.from;
      let sourceURL = undefined;
      if ( message.hasOwnProperty('body') && message.body.hasOwnProperty('source')) {
        from = message.body.source;
      }

      if (message.type === 'forward') {
        from = message.body.from;
      }

      if (message.hasOwnProperty('body') && message.body.hasOwnProperty('subscriber')) {
        from = message.body.subscriber;
      }

      this._idm.getToken(from, message.to).then((identity) => {

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

export default IdentityManager;
