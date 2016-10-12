import Operators from './Operators';

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

  evaluatePolicies(message, isIncomingMessage) {
    let policies = this.context.getPolicies(message, isIncomingMessage);
    let result = 'Not Applicable';

    if (policies !== undefined) {
      result = this.evaluatePolicy(message, policies.serviceProviderPolicy, isIncomingMessage);
      if (result || result === 'Not Applicable') {
        let userResult = this.evaluatePolicy(message, policies.userPolicy, isIncomingMessage);
        if (userResult !== 'Not Applicable') {
          result = userResult;
        }
      }
    }

    return result;
  }

  evaluatePolicy(message, policy, isIncoming) {
    let result = 'Not Applicable';
    if (policy) {
      result = policy.evaluateRules(this.context, message, isIncoming);
    }

    return result;
  }

}

export default PDP;
