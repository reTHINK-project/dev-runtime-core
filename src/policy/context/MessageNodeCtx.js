import CommonCtx from './CommonCtx';

class MessageNodeCtx extends CommonCtx {

  constructor() {
    super();
  }

  authorise(message) {
    console.log('--- Policy Engine ---');
    console.log(message);
    let _this = this;
    let result;

    let isToVerify = _this._isToVerify(message);
    if (isToVerify) {
      let policies = {
        serviceProviderPolicy: _this.getServiceProviderPolicy(message)
      };
      result = _this.policyEngine.pdp.applyPolicies(message, policies);
      if (result === 'Not Applicable') {
        result = _this.defaultBehavior;
      }
      if (result) {
        return true;
      } else {
        return false;
      }
    } else {
      result = _this.defaultBehavior;
      if (result) {
        return true;
      } else {
        return false;
      }
    }
  }

  getServiceProviderPolicy() {
    let policy;

    if (Object.keys(this.serviceProviderPolicies).length !== 0) {
      for (let i in this.serviceProviderPolicies) {
        policy = this.serviceProviderPolicies[i];
      }
    }

    return policy;
  }

  _isToVerify() {
    return true;
  }
}

export default MessageNodeCtx;
