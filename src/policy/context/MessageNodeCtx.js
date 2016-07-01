import CommonCtx from './CommonCtx';

class MessageNodeCtx extends CommonCtx {

  constructor() {
    super();
  }

  loadPolicies() {
    return {};
  }

  /**
  * Returns the policies associated with a scope.
  * @param   {String} scope
  * @return  {Array}  policies
  */
  //TODO: can policies depend on the hyperty name? Domain Registry interaction
  getApplicablePolicies() {
    let _this = this;
    let myPolicies = _this.policies;
    let policies = [];

    for (let i in myPolicies) {
      policies.push.apply(policies, myPolicies[i]);
    }

    return policies;
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

  //TODO: verify if scheme is not 'runtime', 'hyperty-runtime' or 'domain'
  isToVerify() {
    return true;
  }
}

export default MessageNodeCtx;
