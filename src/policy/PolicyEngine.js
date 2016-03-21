import PEP from './PEP';
import PDP from './PDP';

/**
* The Policy Engine intercepts all the messages sent through the Message Bus and applies the
* policies defined by the service provider and the user.
*/
class PolicyEngine {

  /**
  * This method is invoked by the RuntimeUA and instantiates the Policy Engine. A Policy Decision
  * Point (PDP) and a Policy Enforcement Point (PEP) are initialised for the evaluation of policies
  * and the enforcement of additional actions, respectively. Adds a listener do the Message Bus to
  * allow method invokation.
  * @param  {MessageBus}        messageBus
  * @param  {IdentityModule}    identityModule
  * @param  {Registry}          runtimeRegistry
  */
  constructor(messageBus, identityModule, runtimeRegistry) {
    let _this = this;
    _this.messageBus = messageBus;
    _this.idModule = identityModule;
    _this.pdp = new PDP(runtimeRegistry);
    _this.pep = new PEP();
    _this.policies = {};
  }

  /**
  * This method is executed when a message is intercepted in the Message Bus. The first step is the
  * assignment of the identity associated with the message. The second step is the evaluation of the
  * applicable policies in order to obtain an authorisation decision: if a policy evaluates to
  * false, then the message is unauthorised. The third step is the enforcement of the actions that
  * policies may require. Finally, the message is stamped as authorised or not and is returned to
  * the Message Bus, where it will be forwarded or blocked.
  * @param  {Message}  message
  */
  authorise(message) {
    let _this = this;
    if (message.to === 'domain://localhost/policy-engine') {
      _this.processMessage(message);
    }

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

        let scope = _this.getScope();
        let applicablePolicies = _this.getApplicablePolicies(scope);
        let policiesResult = _this.pdp.evaluate(message, hypertyToVerify, applicablePolicies);
        _this.pep.enforce(policiesResult[1]);

        if (policiesResult[0]) {
          message.authorised = true;
          resolve(message);
        } else {
          message.authorised = false;
          reject('Unauthorised message');
        }
      }, function(error) {
        reject(error);
      });
    });
  }

  /**
  * Invokes the method specified in the message aimed at the Policy Engine.
  * @param  {Message}    message
  */
  processMessage(message) {
    let _this = this;
    let method = message.body.method;
    let params = message.body.params;

    switch (method) {
      case 'addPolicies':
        _this.addPolicies(params.policies, params.scope);
        _this.sendResponse(message, 200);
        break;
      case 'removePolicies':
        _this.removePolicies(params.policyID, params.scope);
        _this.sendResponse(message, 200);
        break;
      case 'getList':
        let list = _this.getList(params.listName);
        if (list !== []) {
          _this.sendList(message, list);
        } else {
          _this.sendResponse(message, 404);
        }
        break;
      case 'createList':
        _this.createList(params.listName);
        _this.sendResponse(message, 200);
        break;
      case 'addToList':
        _this.addToList(params.userEmail, params.listName);
        _this.sendResponse(message, 200);
        break;
      case 'removeFromList':
        _this.removeFromList(params.userEmail, params.listName);
        _this.sendResponse(message, 200);
        break;
    }
  }

  /**
  * Sends a response to the message origin.
  * @param  {Message}   message
  * @param  {Number}    httpCode
  */
  sendResponse(message, httpCode) {
    let _this = this;
    let response = {id: message.id, type: 'response', to: message.from, from: message.to, body: {code: httpCode}};
    _this.messageBus.postMessage(response);
  }

  /**
  * Sends the requested list to the message origin.
  * @param  {Message}   message
  * @param  {Array}     list
  */
  sendList(message, list) {
    let _this = this;
    let response = {id: message.id, type: 'response', to: message.from, from: message.to, body: {code: 200, value: list}};
    _this.messageBus.postMessage(response);
  }

  /**
  * Associates the given policies with a scope. The possible scopes are 'application', 'hyperty' and
  * 'user'.
  * @param  {Policy[]}  policies
  * @param  {String}    scope
  */
  addPolicies(policies, scope) {
    let _this = this;
    for (let i in policies) { // TODO: conflict detection
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

  /**
  * Removes the policy with the given ID from the given scope. If policyID is '*', removes all policies associated with the given scope.
  * @param  {String}  policyID
  * @param  {String}  scope
  */
  removePolicies(policyId, scope) {
    let _this = this;
    let allPolicies = _this.policies;

    if (scope in allPolicies) {
      if (policyId !== '*') {
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

  /**
  * Retrieves the list with the given list name from the PDP.
  * @param  {String}  listName
  * @return {Array}   list
  */
  getList(listName) {
    let _this = this;
    return _this.pdp.getList(listName);
  }

  /**
  * Forwards a request for the creation of a list with the given name to the PDP.
  * @param  {String}  listName
  */
  createList(listName) {
    let _this = this;
    _this.pdp.createList(listName);
  }

  /**
  * Forwards a request to add a user to the list with the given name to the PDP.
  * @param  {String}  userEmail
  * @param  {String}  listName
  */
  addToList(userEmail, listName) {
    let _this = this;
    _this.pdp.addToList(userEmail, listName);
  }

  /**
  * Forwards a request to remove a user from the list with the given name to the PDP.
  * @param  {String}  userEmail
  * @param  {String}  listName
  */
  removeFromList(userEmail, listName) {
    let _this = this;
    _this.pdp.removeFromList(userEmail, listName);
  }

  /**
  * Returns the scope of the given message to restrict policy applicability. For now, all policies
  * are applied to each message.
  * @return {String} scope
  */
  getScope() {
    return '*';
  }

  /**
  * Returns the policies associated with a scope.
  * @param   {String} scope
  * @return  {Array}  policies
  */
  getApplicablePolicies(scope) {
    let _this = this;
    let policiesTable = _this.policies;
    let policies = [];
    if (scope !== '*') {
      if (policiesTable[scope] !== undefined) {
        policies = policiesTable[scope];
      }
    } else {
      for (let i in policiesTable) {
        policies.push.apply(policies, policiesTable[i]);
      }
    }
    return policies;
  }
}

export default PolicyEngine;
