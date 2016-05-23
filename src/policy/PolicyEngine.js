//jshint browser:true, jquery: true

import persistenceManager from '../persistence/PersistenceManager';
import {divideURL} from '../utils/utils';
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
  * @param  {IdentityModule}    identityModule
  * @param  {Registry}          runtimeRegistry
  */
  constructor(identityModule, runtimeRegistry) {
    let _this = this;
    _this.isRuntimeCore = (identityModule & runtimeRegistry) === 0;
    console.log('is?');
    console.log(_this.isRuntimeCore);
    _this.pdp = new PDP(runtimeRegistry);
    _this.pep = new PEP();
    _this.idModule = identityModule;
    _this.policies = _this.loadPolicies();
  }

  loadPolicies() {
    let _this = this;
    persistenceManager.delete('policies');
    let myPolicies = persistenceManager.get('policies');

    if (myPolicies === undefined) {
      let subscriptionPolicy = {
        scope: 'application',
        condition: 'subscription any',
        authorise: true,
        actions: []
      };
      _this.addPolicies([subscriptionPolicy]);
      myPolicies = persistenceManager.get('policies');
    }
    return myPolicies;
  }

  /**
  * Associates the given policies with a scope. The possible scopes are 'application', 'hyperty' and
  * 'user'.
  * @param  {Policy[]}  policies
  * @param  {String}    scope
  */
  addPolicies(newPolicies) {
    let _this = this;
    let myPolicies = persistenceManager.get('policies');
    if (myPolicies === undefined) {
      myPolicies = {};
    }

    for (let i in newPolicies) {
      let newPolicy = newPolicies[i];
      let scope = newPolicy.scope;
      if (myPolicies[scope] === undefined) {
        myPolicies[scope] = [];
      }
      for (let j in myPolicies[scope]) {
        let existingPolicy = myPolicies[scope][j];
        if (existingPolicy.condition === newPolicy.condition) {
          _this.removePolicies(newPolicies[i].condition);
          break;
        }
      }
      myPolicies[scope].push(newPolicies[i]);
    }
    persistenceManager.set('policies', 0, myPolicies);
    _this.policies = myPolicies;
  }

  /**
  * Removes the policy with the given ID from the given scope. If policyID is '*', removes all policies associated with the given scope.
  * @param  {String}  policyID
  * @param  {String}  scope
  */
  removePolicies(condition, scope) {
    let _this = this;
    let myPolicies = persistenceManager.get('policies');

    if (scope !== '*') {

      if (scope in myPolicies) {
        if (condition !== '*') {
          let policies = myPolicies[scope];
          for (let i in policies) {
            if (policies[i].condition === condition) {
              policies.splice(condition, 1);

              break;
            }
          }
        } else {
          delete myPolicies[scope];
        }
        persistenceManager.set('policies', 0, myPolicies);
        _this.policies = myPolicies;
      }

    } else {
      persistenceManager.delete('policies');
      _this.policies = {};
    }
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
      let initialResultOk = _this.followsExpectedBehaviour(message);
      if (initialResultOk === undefined) {
        if (_this.isRuntimeCore) {
          _this.idModule.getIdentityAssertion().then(identity => {
            message.body.identity = message.body.identity || identity;
          }, function(error) {
            reject(error);
          });
        } else {

          //TODO: obtain the identity from Domain Registry
          console.log('obtain the identity from Domain Registry');
        }

        //let scope = _this.getScope(message);
        let applicablePolicies = _this.getApplicablePolicies('*');
        let policiesResult = _this.pdp.evaluate(message, applicablePolicies);
        _this.pep.enforce(policiesResult[1]);

        if (policiesResult[0]) {
          message.body.auth = applicablePolicies.length !== 0;
          resolve(message);
        } else {
          reject('Unauthorised message');
        }

      } else {
        if (initialResultOk) {
          resolve(message);
        } else {
          reject('Intrinsic behaviour was not respected');
        }
      }
    });
  }

  /*
  * IdProxy / IdModule
  *   (1) Messages from the IDP Proxy must go to the ID Module.
  *   (2) Messages to the IDP Proxy must come from the ID Module.
  *   (3) Messages from the GUI must go to the ID Module.
  *   (4) Messages to the GUI must come from the ID Module.
  *
  * DataObjects
  *   (5) Updates must come from reporters
  */
  followsExpectedBehaviour(message) {
    let _this = this;

    let idpScheme = 'domain-idp';
    let idmURL = _this.pdp.runtimeRegistry.runtimeURL + '/idm';

    /* (1) */
    if (divideURL(message.from).type === idpScheme) {
      return message.to === idmURL;
    }

    /* (2) */
    if (divideURL(message.to).type === idpScheme) {
      return message.from === idmURL;
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

  deleteGroup(groupName) {
    let _this = this;
    _this.pdp.deleteGroup(groupName);

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
  /*getScope(message) {
    let _this = this;
    let scope = 'user';
    if (message.type === 'subscribe') {
      let runtimeURL = _this.pdp.runtimeRegistry.runtimeURL;
      if (runtimeURL + '/sm' !== message.from) { // needed for the verification to be done in the reporter's policy engine and not in the subscriber's
        let isFromSM = String(message.from.split('/').slice(-1)[0]) === 'sm';
        let originRuntimeURLSplit = message.from.split('/');
        originRuntimeURLSplit.splice(-1);
        let originRuntimeURL = originRuntimeURLSplit.join(originRuntimeURLSplit);
        let isThisRuntime = originRuntimeURL === runtimeURL;
        let isToSubscription = String(message.to.split('/').slice(-1)[0]) === 'subscription';
        if (isFromSM && !isThisRuntime && isToSubscription) {
          scope = 'subscribe';
        }
      }
    }

    return scope;
  }*/

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
