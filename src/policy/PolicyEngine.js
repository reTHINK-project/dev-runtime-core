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

    /* TODO: add this policy when deploying the runtime */
    _this.addObserverPolicy();
  }

  addObserverPolicy() {
    let _this = this;
    let policy = {
      id: 'block-observer-changes',
      scope: 'global',
      condition: 'sync update reporter',
      authorise: true,
      actions: []
    };
    _this.addPolicies([policy], 'objectManagement');
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
    return new Promise(function(resolve, reject) {

      //TODO turn it later into a policy
      if (message.from === 'domain-idp://google.com' || message.to === 'domain-idp://google.com') {
        message.authorised = true;
        return resolve(message);
      }

      _this.idModule.loginWithRP('google identity', 'scope').then(function(value) {
        let assertedID = _this.idModule.getIdentities();

        if (!message.hasOwnProperty('body')) {
          message.body = {};
        }

        let hypertyToVerify;
        if (!message.body.hasOwnProperty('identity')) {
          message.body.identity = assertedID[0].identity;
          message.body.idToken = value;
          hypertyToVerify = message.to;
        } else {
          hypertyToVerify = message.from;
        }

        if (_this.isObjectCreation(message)) {
          _this.addObject(message.body.resource, message.to);
        } else {
          if (_this.isObjectSubscription(message)) {
            let objectURL = message.from.substring(0, message.from.length - 13);
            let reporterURL = message.body.value.data.communication.owner;
            _this.addObject(objectURL, reporterURL);
          }
        }

        let scope = _this.getScope(message);
        let applicablePolicies = [];
        if (message.to !== 'domain://localhost/policies-gui' && message.from !== 'domain://localhost/policies-gui') {
          applicablePolicies = _this.getApplicablePolicies(scope);
        }
        let policiesResult = _this.pdp.evaluate(message, hypertyToVerify, applicablePolicies);
        _this.pep.enforce(policiesResult[1]);
        if (policiesResult[0]) {
          message.authorised = true;
          if (message.to === 'domain://localhost/policy-engine') {
            _this.processMessage(message);
          }
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

  /*var create = {type:'response', from: 'runtime://hybroker.rethink.ptinovacao.pt/7465/sm', to: 'hyperty://hybroker.rethink.ptinovacao.pt/a94743d1-f308-42fb-9ad9-4c12d1e9c25', body: {resource: 'hello://hybroker.rethink.ptinovacao.pt/c10007a6-45cb-4962-90ae-fa915b7b4f94'}};*/
  isObjectCreation(message) {
    let isResponse = message.type === 'response';
    let isFromSM = String(message.from.split('/').slice(-1)[0]) === 'sm';
    let hasObjectURL = message.body.resource !== undefined;
    return isResponse && isFromSM && hasObjectURL;
  }

  addObject(objectURL, reporterURL) {
    let _this = this;
    _this.pdp.addObject(objectURL, reporterURL);
  }

  isObjectSubscription(message) {
    return String(message.from.split('/').slice(-1)[0]) === 'subscription';
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
      case 'getGroupsNames':
        let groupsNames = _this.getGroupsNames();
        _this.sendGroup(message, groupsNames);
        break;
      case 'getGroup':
        let group = _this.getGroup(params.groupName);
        _this.sendGroup(message, group);
        break;
      case 'createGroup':
        _this.createGroup(params.groupName);
        _this.sendResponse(message, 200);
        break;
      case 'removeGroup':
        _this.removeGroup(params.groupName);
        _this.sendResponse(message, 200);
        break;
      case 'addToGroup':
        _this.addToGroup(params.userEmail, params.groupName);
        _this.sendResponse(message, 200);
        break;
      case 'removeFromGroup':
        _this.removeFromGroup(params.userEmail, params.groupName);
        _this.sendResponse(message, 200);
        break;
      case 'getTimeRestrictions':
        let timeRestrictions = _this.getTimeRestrictions();
        _this.sendGroup(message, timeRestrictions);
        break;
      case 'getTimeRestrictionById':
        let timeRestriction = _this.getTimeRestrictionById(params.policyID);
        _this.sendGroup(message, timeRestriction);
        break;
      case 'changeTimePolicy':
        _this.changeTimePolicy(params.policyID, params.authorise);
        _this.sendResponse(message, 200);
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
  * Sends the requested group to the message origin.
  * @param  {Message}   message
  * @param  {Array}     group
  */
  sendGroup(message, group) {
    let _this = this;
    let response = {id: message.id, type: 'response', to: message.from, from: message.to, body: {code: 200, method: message.body.method, value: group}};
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
      for (let policy in _this.policies[scope]) {
        if (_this.policies[scope][policy].id === policies[i].id) {
          _this.removePolicies(policies[i].id, 'user');
          break;
        }
      }
      _this.policies[scope].push(policies[i]);
    }
  }

  /**
  * Removes the policy with the given ID from the given scope. If policyID is '*', removes all policies associated with the given scope.
  * @param  {String}  policyID
  * @param  {String}  scope
  */
  removePolicies(policyID, scope) {
    let _this = this;
    let allPolicies = _this.policies;

    if (scope in allPolicies) {
      if (policyID !== '*') {
        let policies = allPolicies[scope];
        let numPolicies = policies.length;

        for (let policy = 0; policy < numPolicies; policy++) {
          if (policies[policy].id === policyID) {
            policies.splice(policy, 1);
            break;
          }
        }
      } else {
        delete _this.policies[scope];
      }
    }
  }

  getGroupsNames() {
    let _this = this;
    return _this.pdp.getGroupsNames();
  }

  /**
  * Retrieves the group with the given group name from the PDP.
  * @param  {String}  groupName
  * @return {Array}   group
  */
  getGroup(groupName) {
    let _this = this;
    return _this.pdp.getGroup(groupName);
  }

  /**
  * Forwards a request for the creation of a group with the given name to the PDP.
  * @param  {String}  groupName
  */
  createGroup(groupName) {
    let _this = this;
    _this.pdp.createGroup(groupName);
  }

  removeGroup(groupName) {
    let _this = this;
    _this.pdp.removeGroup(groupName);
  }

  /**
  * Forwards a request to add a user to the group with the given name to the PDP.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(userEmail, groupName) {
    let _this = this;
    _this.pdp.addToGroup(userEmail, groupName);
  }

  /**
  * Forwards a request to remove a user from the group with the given name to the PDP.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  removeFromGroup(userEmail, groupName) {
    let _this = this;
    _this.pdp.removeFromGroup(userEmail, groupName);
  }

  getTimeRestrictions() {
    let _this = this;
    let policies = _this.policies.user;
    let timeRestrictions = [];
    for (let i in policies) {
      if (policies[i].condition.split(' ')[0] === 'time') {
        timeRestrictions.push(policies[i].condition);
      }
    }
    return timeRestrictions;
  }

  getTimeRestrictionById(id) {
    let _this = this;
    let policies = _this.policies.user;
    for (let i in policies) {
      if (policies[i].id === id) {
        return policies[i];
      }
    }
  }

  changeTimePolicy(id, authorise) {
    let _this = this;
    let policies = _this.policies.user;
    for (let i in policies) {
      if (policies[i].id === id) {
        policies[i].authorise = authorise;
      }
    }
  }

  /**
  * Returns the scope of the given message to restrict policy applicability.
  * @return {String} scope
  */
  getScope(message) {
    let _this = this;
    let scope;
    if (_this.isObjectUpdate(message)) {
      scope = 'objectManagement';
    } else {
      scope = 'user';
    }
    return scope;
  }

  isObjectUpdate(message) {
    let isForChanges = (message.to === message.from + '/changes');
    if (message.type === 'update' && isForChanges) {
      return true;
    } else {
      return false;
    }
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
