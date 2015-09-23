/**
 * Core Policy Engine (PDP/PEP) Interface
 */
class PolicyEngine {

  /**
   * To add policies to be enforced for a certain deployed Hyperty Instance
   * @param {URL.HypertyURL}     hyperty  hyperty
   * @param {HypertyPolicyList}  policies policies
   */
  addPolicies(hyperty, policies) {
    // Body...
  }

  /**
   * To remove previously added policies for a certain deployed Hyperty Instance
   * @param  {URL.HypertyURL}  hyperty       hyperty
   */
  removePolicies(hyperty) {
    // Body...
  }

  /**
   * Authorisation request to accept a Subscription for a certain resource. Returns a Response Message to be returned to Subscription requester
   * @param  {Message.Message} message       message
   * @return {AuthorisationResponse}                 AuthorisationResponse
   */
  authorise(message) {
    // Body...
  }



}
