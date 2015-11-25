/**
 * Core Policy Engine (PDP/PEP) Interface
 */
class PolicyEngine {

  /**
  * To initialise the Policy Engine
  * @param  {Identity Module}      identityModule      identityModule
  * @param  {Runtime Registry}    runtimeRegistry     runtimeRegistry
  */
  constructor(identityModule, runtimeRegistry) {
    let _this = this;
    _this.idModule = identityModule;
    _this.registry = runtimeRegistry;

  }

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
    let _this = this;

    return new Promise(function(resolve, reject) {
      //let hypertyIdentity = _this.registry.getHypertyIdentity(message.body.hypertyURL);
      //this step assume the hypertyIdentity will be google

      _this.idModule.loginWithRP('google identity', 'scope').then(function(value) {

        // add the token to the message received
        message.tokenID = JSON.stringify(value);
        resolve(message);
      }, function(error) {
        reject(error);
      });

    });
  }

}

export default PolicyEngine;
