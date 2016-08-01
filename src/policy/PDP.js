import Operators from './Operators';
import RuntimeCoreCtx from './context/RuntimeCoreCtx';
/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/
class PDP {

  constructor(context) {
    this.context = context;
    this.operators = new Operators();
  }

  get context() {
    return this._context;
  }

  get operators() {
    return this._operators;
  }

  set context(context) {
    this._context = context;
  }

  set operators(operators) {
    this._operators = operators;
  }

  applyPolicies(message, policies) {
    let result = this.evaluateSPPolicy(message, policies.serviceProviderPolicy);
    if (this.context instanceof RuntimeCoreCtx && (result || result === 'Not Applicable')) {
      result = this.evaluateUserPolicy(message, policies.userPolicy);
    }
    return result;
  }

  evaluateSPPolicy(message, policy) {
    let result;

    if (policy) {
      result = policy.evaluate(this.context, message);
    } else {
      result = 'Not Applicable';
    }

    return result;
  }

  evaluateUserPolicy(message, title) {
    let result;

    if (title !== undefined) {
      let policy = this.context.userPolicies[title];
      if (policy) {
        result = policy.evaluate(this.context, message);
      } else {
        result = 'Not Applicable';
      }
    } else {
      result = 'Not Applicable';
    }

    return result;
  }

}

export default PDP;
