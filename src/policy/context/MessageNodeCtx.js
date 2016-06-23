import CommonCtx from './CommonCtx';
import {divideURL} from '../../utils/utils';

class MessageNodeCtx extends CommonCtx {

  constructor() {
    super();
    let _this = this;
    _this.policies = _this.loadPolicies();
  }

  loadPolicies() {
    return {};
  }

  addSubscriptionPolicy() {
    return null;
  }

  isToVerify(message) {
    let _this = this;

    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isFromSM = (message.from === _this.runtimeRegistry.runtimeURL + '/sm');
    let isToSubscription = (_this._getLastComponentOfURL(message.to) === 'subscription');
    let isToHyperty = divideURL(message.to).type === 'hyperty';

    return (isFromSM && isToSubscription) || (isFromHyperty && isToHyperty);
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
