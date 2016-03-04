import PEP from './PEP';
import PDP from './PDP';
import Policy from './Policy';

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
    for (let policy in policies) {
      if (_this.policies[key] === undefined) {
        _this.policies[key] = [];
      }
      _this.policies[key].push(policies[policy]);
    }
  }

  simulate(key) {
    let _this = this;

    let policy = {
      id: 'block-blacklisted',
      scope: 'user',
      condition: 'blacklisted',
      authorise: false,
      actions: []
    };
    let policy2 = new Policy(policy.id, policy.scope, policy.condition,
      policy.authorise, policy.actions);

    policy = {
      id: 'allow-whitelisted',
      scope: 'user',
      condition: 'whitelisted',
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
  }

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
    /*let message = { id: 123, type:'READ', from:'hyperty://ua.pt/asdf',
                  to:'domain://registry.ua.pt/hyperty-instance/user' };
    _this.simulate(message.from);*/
    return new Promise(function(resolve, reject) {
      _this.idModule.loginWithRP('google identity', 'scope').then(function(value) {
        let assertedID = _this.idModule.getIdentities();

        if (!message.hasOwnProperty('body')) {
          message.body = {};
        }
        let userID = assertedID[0].identity;
        if (!message.body.hasOwnProperty('assertedIdentity')) {
          message.body.assertedIdentity = userID;
          message.body.idToken = value;
        }

        let applicablePolicies = _this.getApplicablePolicies(message.from, message.to, userID);
        let policiesResult = _this.pdp.evaluate(message, userID, applicablePolicies);
        _this.pep.enforce(policiesResult[1]);

        if (policiesResult[0]) {
          message.body.authorised = true;
          resolve(message);
        } else {
          message.body.authorised = false;
          reject(message);
        }
        resolve(message);
      }, function(error) {
        reject(error);
      });
    });
  }

  // TODO: applicability is to be based on scope
  getApplicablePolicies(hypertyFrom, hypertyTo, userID) {
    let _this = this;
    let applicablePolicies = [];

    if (hypertyFrom in _this.policies) {
      for (let policy in _this.policies[hypertyFrom]) {
        applicablePolicies.push(_this.policies[hypertyFrom][policy]);
      }
    }
    if (hypertyTo in _this.policies) {
      for (let policy in _this.policies[hypertyTo]) {
        applicablePolicies.push(_this.policies[hypertyTo][policy]);
      }
    }
    if (userID in _this.policies) {
      for (let policy in _this.policies[userID]) {
        applicablePolicies.push(_this.policies[userID][policy]);
      }
    }
    return applicablePolicies;
  }

}

export default PolicyEngine;
