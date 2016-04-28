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
    _this.objectsReporters = {};
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

    return new Promise(function(resolve, reject) {
      console.log('--- Policy Engine ---');
      console.log(message);
      message.body = message.body || {};
      let initialResultOk = _this.followsIntrinsicBehaviour(message);
      if (initialResultOk === undefined) {
        _this.idModule.getIdentityAssertion().then(identity => {
          message.body.identity = message.body.identity || identity;

          let scope = _this.getScope(message);
          let applicablePolicies = _this.getApplicablePolicies(scope);
          let policiesResult = _this.pdp.evaluate(message, applicablePolicies);
          _this.pep.enforce(policiesResult[1]);
          if (policiesResult[0]) {
            message.body.auth = true;
            resolve(message);
          } else {
            message.body.auth = false;
            reject('Unauthorised message');
          }
        }, function(error) {
          reject(error);
        });
      } else {
        if (initialResultOk) {
          message.body.auth = true;
          resolve(message);
        } else {
          message.body.auth = false;
          reject('Intrinsic behaviour was not respected');
        }
      }
    });
  }

  /*
  * IdProxy / IdModule
  *   (1) Messages from the IDP Proxy must go to the ID Module.
  *   (2) Messages to the IDP Proxy must come from the ID Module.
  *
  * DataObjects
  *   (3) Creation stores the object URL and its reporter's URL
  *   (4) Subscription stores the object URL and its reporter's URL
  *   (5) Updates must come from reporters
  */
  followsIntrinsicBehaviour(message) {
    let _this = this;

    let idpURL = 'domain-idp://';
    let idmURL = _this.pdp.runtimeRegistry.runtimeURL + '/idm';

    /* (1) */
    if (message.from.includes(idpURL)) {
      return message.to === idmURL;
    }

    /* (2) */
    if (message.to.includes(idpURL)) {
      return message.from === idmURL;
    }

    /* (3) */
    let isResponse = message.type === 'response';
    let isFromSM = String(message.from.split('/').slice(-1)[0]) === 'sm';
    let objectURL = message.body.resource;
    if (isResponse && isFromSM && objectURL !== undefined) {
      let reporterURL = message.to;
      _this.addObject(objectURL, reporterURL);
      return true;
    }

    //TODO uncomment and try to solve the problem
    /* (4) */
    /*if (message.type === 'create' && String(message.from.split('/').slice(-1)[0]) === 'subscription') {
      //if (String(message.from.split('/').slice(-1)[0]) === 'subscription') {
          console.log('15 - PE');
      let objectURL = message.from.substring(0, message.from.length - 13);
      let reporterURL = message.body.value.reporter;

      console.log('reporterURL', reporterURL);      //let reporterURL = message.body.value.data.communication.owner;

      _this.addObject(objectURL, reporterURL);

      return true;
    }*/

    /* (5) */
    /*
    if (message.type === 'update' && message.to === message.from + '/changes') {
      let objectURL = message.from;
      let hypertyURL = message.body.source;
      if (_this.objectsReporters[objectURL] === hypertyURL) {
        return true;
      } else {
        return false;
      }
    }*/
  }

  addObject(objectURL, reporterURL) {
    let _this = this;
    _this.objectsReporters[objectURL] = reporterURL;
  }

  /**
  * Associates the given policies with a scope. The possible scopes are 'application', 'hyperty' and
  * 'user'.
  * @param  {Policy[]}  policies
  * @param  {String}    scope
  */
  addPolicies(policies) {
    let _this = this;
    for (let i in policies) {
      let newPolicy = policies[i];
      let scope = newPolicy.scope;
      if (_this.policies[scope] === undefined) {
        _this.policies[scope] = [];
      }
      for (let j in _this.policies[scope]) {
        let existingPolicy = _this.policies[scope][j];
        if (existingPolicy.condition === newPolicy.condition && existingPolicy.authorise === newPolicy.authorise) {
          _this.removePolicies(policies[i].condition);
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
  removePolicies(condition, scope) {
    let _this = this;
    let allPolicies = _this.policies;

    if (scope in allPolicies) {
      if (condition !== '*') {
        let policies = allPolicies[scope];

        for (let i in policies) {
          if (policies[i].condition === condition) {
            policies.splice(condition, 1);
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

    let policies = _this.policies.user;
    for (let i in policies) {
      let condition = policies[i].condition.split(' ');
      condition.shift();
      let groupInPolicy = condition.join(' ');
      if (groupInPolicy === groupName) {
        delete policies[i];
        break;
      }
    }
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

  getGroupReachability(groupName) {
    let _this = this;
    let policies = _this.policies.user;
    for (let i in policies) {
      if (policies[i].condition === 'group ' + groupName) {
        return policies[i].authorise;
      }
    }
  }

  changePolicy(condition, authorise) {
    let _this = this;

    let policies = _this.policies.user;
    policies = policies || [];
    for (let i in policies) {
      if (policies[i].condition === condition) {
        policies[i].authorise = authorise;
        return;
      }
    }
    let newPolicy = {
      scope: 'user',
      condition: condition,
      authorise: authorise,
      actions: []
    };

    _this.addPolicies([newPolicy]);
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

  getTimeslots() {
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

  getTimeslotById(condition) {
    let _this = this;
    let policies = _this.policies.user;
    for (let i in policies) {
      if (policies[i].condition === condition) {
        return policies[i];
      }
    }
  }

  /**
  * Returns the scope of the given message to restrict policy applicability.
  * @return {String} scope
  */
  getScope(message) {
    let scope = 'user';
    return scope;
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
