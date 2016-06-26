import CommonCtx from './CommonCtx';
import {divideURL} from '../../utils/utils';

class MessageNodeCtx extends CommonCtx {

  constructor() {
    super();
  }

  loadPolicies() {
    return {};
  }

  addSubscriptionPolicy() {
    return null;
  }

  set group(params) {
    let _this = this;
    _this.groupAttribute = _this._getList(params.scope, params.group);
  }

  get group() {
    let _this = this;
    return _this.groupAttribute;
  }

  authorise(message) {
    let _this = this;
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

  isToVerify(message) {
    return true;
  }
}

export default MessageNodeCtx;
