import CommonCtx from './CommonCtx';
import Condition from '../conditions/Condition';
import Rule from '../Rule';
import UserPolicy from '../policies/UserPolicy';

class MessageNodeCtx extends CommonCtx {

  constructor() {
    super();
    this.serviceProviderPolicies = {};
  }

  authorise(message) {
    return new Promise((resolve, reject) => {
      let _this = this;
      let result;

      let isToVerify = _this._isToVerify(message);
      if (isToVerify) {
        let policies = {
          serviceProviderPolicy: _this.getServiceProviderPolicy(message)
        };
        result = _this.policyEngine.pdp.applyPolicies(message, policies);
      }
      if (result === undefined || result === 'Not Applicable') {
        resolve(message);
      } else {
        reject('Message blocked');
      }

    });
  }

  loadActivePolicy() { }

  loadGroups() { }

  loadSPPolicies() { }

  loadUserPolicies() { }

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

  saveActivePolicy() {}

  saveGroups() {}

  savePolicies() {}
}

export default MessageNodeCtx;
