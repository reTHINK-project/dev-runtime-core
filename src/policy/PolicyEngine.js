import PEP from './PEP';
import PDP from './PDP';

// import Policy from './Policy';

class PolicyEngine {

  constructor(identityModule, runtimeRegistry) {
    let _this = this;
    _this.idModule = identityModule;
    _this.registry = runtimeRegistry;
    _this.pep = new PEP();
    _this.pdp = new PDP();
    _this.policies = {};
  }

  // TODO: verify duplicates
  // TODO: conflict detection
  addPolicies(key, policies) {
    let _this = this;
    for (let i in policies) {
      if (_this.policies[key] === undefined) {
        _this.policies[key] = [];
      }
      _this.policies[key].push(policies[i]);
      console.log(_this.policies);
    }
  }

  /*simulate(key) {
    let _this = this;

    yte
    let policy2 = new Policy(policy.id, policy.scope, policy.condition,
      policy.authorise, policy.actions);

    policy = {
      id: 'allow-whitelisted',
      scope: 'user',
      condition: 'whitelisted'c,
      authorise: true,
      actions: []
    };
    let policy3 = new Policy(policy.id, policy.scope, policy.condition,
      policy.authorise, policy.actions);

    policy = {
      id: 'block-08-20',
      scope: 'user',
      condition: 'time 08:00 20:00',
      authorise: false,
      actions: []
    };
    let policy4 = new Policy(policy.id, policy.scope, policy.condition,
      policy.authorise, policy.actions);

    _this.addPolicies(key, [policy4]);
  }*/

  removePolicies(key, policyId) {
    let _this = this;
    let allPolicies = _this.policies;

    if (key in allPolicies) {
      if (policyId !== 'all') {
        let policies = allPolicies[key];
        let numPolicies = policies.length;

        for (let policy = 0; policy < numPolicies; policy++) {
          if (policies[policy].id === policyId) {
            policies.splice(policy, 1);
            break;
          }
        }
      } else {
        delete _this.policies[key];
      }
    }
  }

  addToBlackList(userID) {
    this.pdp.addToBlackList(userID);
  }

  removeFromBlackList(userID) {
    this.pdp.removeFromBlackList(userID);
  }

  addToWhiteList(userID) {
    this.pdp.addToWhiteList(userID);
  }

  removeFromWhiteList(userID) {
    this.pdp.removeFromWhiteList(userID);
  }

  authorise(message) {
    let _this = this;
    console.log('Message:', message);
    /*let message = { id: 123, type:'READ', from:'hyperty://ua.pt/asdf',
                  to:'domain://registry.ua.pt/hyperty-instance/user' };
    _this.simulate(message.from);*/
    return new Promise(function(resolve, reject) {
      _this.idModule.loginWithRP('google identity', 'scope').then(function(value) {
        let assertedID = _this.idModule.getIdentities();

        if (!message.hasOwnProperty('body')) {
          message.body = {};
        }

        let hypertyToVerify;
        if (!message.body.hasOwnProperty('assertedIdentity')) {
          message.body.assertedIdentity = assertedID[0].identity;
          message.body.idToken = value;
          hypertyToVerify = message.to;
        } else {
          hypertyToVerify = message.from;
        }

        /* TODO: get scope of the message */
        let scope = 'user';

        console.log('THIS MESSAGE IS FROM ', message.body.assertedIdentity);
        let applicablePolicies = _this.getApplicablePolicies(scope);
        console.log('POLICIES BEING CHECKED: ', applicablePolicies);
        let policiesResult;
        if (hypertyToVerify.split(':')[0] === 'hyperty') {
          policiesResult = _this.pdp.evaluate(_this.registry, message, hypertyToVerify, applicablePolicies);
        } else {
          policiesResult = [true, []];
        }

        _this.pep.enforce(policiesResult[1]);

        if (policiesResult[0]) {
          console.log('MESSAGE ACCEPTED');
          resolve(message);
        } else {
          console.log('DENIIIIIIIIIIIIIIIIIIIED');
          reject(message);
        }
      }, function(error) {
        reject(error);
      });
    });
  }

  getApplicablePolicies(scope) {
    let _this = this;
    return _this.policies[scope];
  }

  getBlackList() {
    let _this = this;
    return _this.pdp.getBlackList();
  }
}

export default PolicyEngine;
