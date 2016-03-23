import PEP from './PEP';
import PDP from './PDP';

// import Policy from './Policy';

class PolicyEngine {

  constructor(messageBus, identityModule, runtimeRegistry) {
    let _this = this;
    _this.messageBus = messageBus;
    _this.idModule = identityModule;
    _this.pep = new PEP();
    _this.pdp = new PDP(runtimeRegistry);
    _this.policies = {};

    _this.messageBus.addListener('domain://PolicyEngine', function(message) {
      _this.processMessage(message);
    });
  }

  processMessage(message) {
    let _this = this;
    let method = 'addPolicies';

    //let method = message.body.method;
    let params = message.body.params;
    switch (method) {
      case 'addPolicies':
        _this.addPolicies(params.scope, params.policies);
        _this.sendOkResponse(message);
        break;
      case 'removePolicies':
        _this.removePolicies(params.scope, params.policyID);
        _this.sendOkResponse(message);
        break;
      case 'getList':
        if (_this.getList(params.listName) !== undefined) { // TODO: verificar se quando lança exceção não faz 'sendOkResponse'
          _this.sendOkResponse(message);
        }
        break;
      case 'createList':
        _this.createList(params.listName);
        _this.sendOkResponse(message);
        break;
      case 'addToList':
        _this.addToList(params.userID, params.listName);
        _this.sendOkResponse(message);
        break;
      case 'removeFromList':
        _this.removeFromList(params.userID, params.listName);
        _this.sendOkResponse(message);
        break;
      default:
        console.log('Invalid method call!');
        break;
    }
  }

  sendOkResponse(message) {
    let _this = this;
    let response = {id: message.id, type: 'response', to: message.from, from: message.to, body: {code: 200}};
    _this.messageBus.postMessage(response);
  }

  // TODO: conflict detection
  addPolicies(scope, policies) {
    let _this = this;
    for (let i in policies) {
      if (_this.policies[scope] === undefined) {
        _this.policies[scope] = [];
      }
      let exists = false;
      for (let policy in _this.policies[scope]) {
        if (_this.policies[scope][policy].id === policies[i].id) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        _this.policies[scope].push(policies[i]);
      }
    }
  }

  removePolicies(scope, policyId) {
    let _this = this;
    let allPolicies = _this.policies;

    if (scope in allPolicies) {
      if (policyId !== 'all') {
        let policies = allPolicies[scope];
        let numPolicies = policies.length;

        for (let policy = 0; policy < numPolicies; policy++) {
          if (policies[policy].id === policyId) {
            policies.splice(policy, 1);
            break;
          }
        }
      } else {
        delete _this.policies[scope];
      }
    }
  }

  getList(listName) {
    let _this = this;
    return _this.pdp.getList(listName);
  }

  createList(listName) {
    let _this = this;
    _this.pdp.createList(listName);
  }

  addToList(userID, listName) {
    let _this = this;
    _this.pdp.addToList(userID, listName);
  }

  removeFromList(userID, listName) {
    let _this = this;
    _this.pdp.removeFromList(userID, listName);
  }

  authorise(message) {
    let _this = this;
    return new Promise(function(resolve, reject) {

      //TODO turn it later into a policy
      if (message.from === 'domain://google.com' || message.to === 'domain://google.com') {
        message.authorised = true;
        return resolve(message);
      }
      _this.idModule.getIdentityAssertion('google identity', 'scope').then(function(value) {
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

        let applicablePolicies = _this.getApplicablePolicies(scope);
        let policiesResult;
        if (hypertyToVerify.split(':')[0] === 'hyperty') {
          policiesResult = _this.pdp.evaluate(message, hypertyToVerify, applicablePolicies);
        } else {
          policiesResult = [true, []];
        }

        _this.pep.enforce(policiesResult[1]);

        if (policiesResult[0]) {
          message.authorised = true;
          resolve(message);
        } else {
          message.authorised = false;
          reject(message);
        }
      }, function(error) {
        reject(error);
      });
    });
  }

  getApplicablePolicies(scope) {
    let _this = this;
    let applicablePolicies = _this.policies[scope];
    if (applicablePolicies === undefined) {
      applicablePolicies = [];
    }
    return applicablePolicies;
  }
}

export default PolicyEngine;
