/**
 * Core Policy Engine (PDP/PEP) Interface
 * According to: https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md#core-policy-engine-pdppep-interface
 */
class PolicyEngine {

  /**
  * To initialise the Policy Engine
  * @param  IdentityModule      identityModule      identityModule
  * @param  Registry    runtimeRegistry     runtimeRegistry
  */
  constructor(identityModule, runtimeRegistry) {
    let _this = this;
    _this.idModule = identityModule;
    _this.registry = runtimeRegistry;
    _this.policiesTable = new Object();
    /* assumes the Policy Engine has the blacklist */
    _this.blacklist = [];
    /* _this.blacklist.push('Alice');*/
  }

  /**
   * To add policies to be enforced for a certain deployed Hyperty Instance
   * Example of an hyperty: hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
   * Example of a policy: {subject: 'message.header.from', target: 'blacklist', action: 'deny'}
   * @param {URL.HypertyURL}     hyperty  hyperty
   * @param {HypertyPolicyList}  policies policies
   */
  addPolicies(hyperty, policies) {
    let _this = this;
    _this.policiesTable[hyperty] = policies;
  }

  /**
   * To remove previously added policies for a certain deployed Hyperty Instance
   * @param  {URL.HypertyURL}  hyperty       hyperty
   */
  removePolicies(hyperty) {
    let _this = this;
    delete _this.policiesTable[hyperty];
  }

  /**
   * Authorisation request to accept a Subscription for a certain resource. Returns a Response Message to be returned to Subscription requester
   * @param  {Message.Message} message       message
   * @return {AuthorisationResponse}                 AuthorisationResponse
   */
  authorise(message) {
    let _this = this;

    return new Promise(function(resolve, reject) {

      // TODO: Optimize and improve this code;
      // if (_this.checkPolicies(message) == 'allow') {

      // let hypertyIdentity = _this.registry.getHypertyIdentity(message.body.hypertyURL);
      // this step assume the hypertyIdentity will be google

      _this.idModule.loginWithRP('google identity', 'scope').then(function(value) {
        let assertedID = _this.idModule.getIdentities();

        // Check if the message have an body or not
        if (!message.hasOwnProperty('body')) {
          message.body = {};
        }

        //TODO dumb/insecure way to verify the direction of the message, improvement required later
        if (!message.body.hasOwnProperty('assertedIdentity')) {

          message.body.assertedIdentity = assertedID[0].identity;
          message.body.idToken = JSON.stringify(value);
          message.body.authorised = true;

          console.log('Message: ', message);

        } else {
          //TODO validate the received message identity
        }
        resolve(message);
      }, function(error) {
        reject(error);
      });

      // } else {
      //   resolve(false);
      // }
    });
  }

  checkPolicies(message) {
    let _this = this;
    var _results = ['allow']; /* by default, all messages are allowed */
    var _policies = _this.policiesTable[message.body.hypertyURL];
    if (_policies != undefined) { /* if there are applicable policies, checks them */
      var _numPolicies = _policies.length;

      for (var i = 0; i < _numPolicies; i++) {
        var _policy = _policies[i];
        console.log(_policy);
        if (_policy.target == 'blacklist') {
          if (_this.blacklist.indexOf(eval(_policy.subject)) > -1) {
            console.log('Is in blacklist!');
            _results.push(_policy.action);
          }
        }
        if (_policy.target == 'whitelist') {
          if (_this.whitelist.indexOf(eval(_policy.subject)) > -1) {
            console.log('Is in whitelist!');
            _results.push(_policy.action);
          }
        }
      }
    }
    console.log(_results);
    if (_results.indexOf('deny') > -1) { /* if one policy evaluates to 'deny', the result is 'deny' */
      return 'deny';
    } else {
      return 'allow';
    }
  }
}

export default PolicyEngine;
