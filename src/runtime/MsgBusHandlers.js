/**
 *  Class where message bus handlers are built. To be used by the RuntimeUA to initialise the runtime UA.
 */

import { log as logLevels } from '../logLevels';

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('RuntimeUA');

class MsgBusHandlers {

  constructor(pep, idm, crypto) {
    if (!pep) throw Error('[MsgBusHandlers] pep input paramenter is mandatory');
    if (!idm) throw Error('[MsgBusHandlers] idm input paramente is mandatory');
    if (!crypto) throw Error('[MsgBusHandlers] crypto input paramente is mandatory');

    this.policyEngine = pep;
    this.identityManager = idm;
    this.cryptoManager = crypto;
  }

  // Policy based access control for incoming messages

  get pepInHandler() {
    let _this = this;

    return (ctx) => {
      _this.policyEngine.authorise(ctx.msg, true).then((changedMgs) => {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch((reason) => {
        log.error(reason);
        ctx.fail(reason);
      });
    };

  }

  // Policy based access control for outgoing messages
  get pepOutHandler() {
    let _this = this;
    return (ctx) => {
      _this.policyEngine.authorise(ctx.msg, false).then((changedMgs) => {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch((reason) => {
        log.error(reason);
        ctx.fail(reason);
      });
    };
  }

  // Add Identity info to messages
  get idmHandler() {
    let _this = this;
    return (ctx) => {
      _this.identityManager.processMessage(ctx.msg).then((changedMgs) => {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch((reason) => {
        log.error(reason);
        ctx.fail(reason);
      });
    };
  }

  // encrypt messages

  get encryptHandler() {
    let _this = this;
    return (ctx) => {
      _this.cryptoManager.encryptMessage(ctx.msg).then((changedMgs) => {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch((reason) => {
        log.error(reason);
        ctx.fail(reason);
      });
    };

  }

  // decrypt messages

  get decryptHandler() {
    let _this = this;
    return (ctx) => {
      _this.cryptoManager.decryptMessage(ctx.msg).then((changedMgs) => {
        ctx.msg = changedMgs;
        ctx.next();
      }).catch((reason) => {
        log.warn(reason);
        ctx.fail(reason);
      });
    };

  }

}

export default MsgBusHandlers;
