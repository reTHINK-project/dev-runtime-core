class PEP {

  constructor(context) {
    this.context = context;
  }

  enforcePolicies(message, policies, authDecision) {
    let policy;

    if (policies.userPolicy) {
      policy = this.context.userPolicies[policies.userPolicy];
      if (policy) {
        policy.enforceActions(this.context, message, authDecision);
      }
    }
    policy = this.context.serviceProviderPolicy;
    if (policy) {
      policy.enforceActions(this.context, message, authDecision);
    }
  }

  /*sendAutomaticMessage() {}

  forwardToID() {}

  forwardToHyperty() {}*/

}

export default PEP;
