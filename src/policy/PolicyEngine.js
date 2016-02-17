import Policy from './Policy';
import {divideURL} from '../utils/utils.js';


class PolicyEngine {

  constructor(identityModule, runtimeRegistry) {
    let _this = this;
    _this.idModule = identityModule;
    _this.registry = runtimeRegistry;
    _this.policies = {};
  }

  /* TODO: validation needed */
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

    let id = 'allow-only-gmail';
    let target = 'domain';
    let when = 'gmail.com';
    let authorise = true;
    let actions = [];
    let policy1 = new Policy(id, target, when, authorise, actions);

    id = 'block-blacklisted';
    target = 'lists';
    when = 'isBlackListed';
    authorise = false;
    actions = [];
    let policy2 = new Policy(id, target, when, authorise, actions);

    /*id = 'allow-whitelisted';
    target = 'lists';
    when = 'isWhiteListed';
    authorise = true;
    actions = [];
    let policy3 = new Policy(id, target, when, authorise, actions);

    id = 'allow-8-23';
    target = 'time';
    when = 'isTimeBetween(\'8:00\', \'20:00\')';
    authorise = true;
    actions = [];
    let policy4 = new Policy(id, target, when, authorise, actions);*/

    _this.addPolicies(key, [policy1, policy2]);
  }

  removePolicies(key, policyId) {
    let _this = this;
    let allPolicies = _this.policies;

    if (key in allPolicies) {
      if (policyId !== 'all') {
        let policies = allPolicies[key];
        let numPolicies = policies.length;

        for (let i = 0; i < numPolicies; i++) {
          if (policies[i].id === policyId) {
            policies.splice(i, 1);
            break;
          }
        }
      }
      else {
        delete _this.policies[key];
      }
    }
  }

  authorise(message) {
    let _this = this;
    //_this.simulate(message.from);
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

        let policiesResult = _this.checkPolicies(message, userID);
        if (policiesResult[0]) {
          message.body.authorised = true;
          resolve(message);
        }
        else {
          message.body.authorised = false;
          reject(message);
        }
        resolve(message);
      }, function(error) {
        reject(error);
      });
    });
  }

  checkPolicies(message, userID) {
    let _this = this;
    let applicablePolicies = _this.getApplicablePolicies(message.from, message.to, userID);
    let results = [true];
    let actions = [];

    for (let policy in applicablePolicies) {
      let result = applicablePolicies[policy].evaluate(message, userID);
      results.push(result[0]);
      actions.push(result[1]);
    }

    let authorisationDecision = _this.getAuthorisationDecision(results);
    return [authorisationDecision, actions]
  }

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

  getAuthorisationDecision(results) {
    return results.indexOf(false) == -1;
  }
}

export default PolicyEngine;
