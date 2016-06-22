import Context from '../Context';

class MessageNodeCtx extends Context {

  constructor() {
    super();
  }

  loadPolicies() {
    return {};
  }

  authorise(message) {
    let _this = this;
    console.log('--- Policy Engine (Message Node)---');
    console.log(message);
    message.body = message.body || {};
    let result;

    let isToVerify = _this.isToVerify(message);

    if (isToVerify) {

      result = _this.applyPolicies(message);
      let messageAccepted = result.policiesResult[0];
      return messageAccepted;

    } else {
      return true;
    }
  }
}

export default MessageNodeCtx;
