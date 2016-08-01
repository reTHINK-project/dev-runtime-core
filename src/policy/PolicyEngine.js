import PEP from './PEP';
import PDP from './PDP';

class PolicyEngine {

  constructor(context) {
    this.context = context;
    this.context.policyEngine = this;
    this.pdp = new PDP(context);
    this.pep = new PEP(context);
  }

  get context() {
    return this._context;
  }

  get pdp() {
    return this._pdp;
  }

  get pep() {
    return this._pep;
  }

  set context(context) {
    this._context = context;
  }

  set pdp(pdp) {
    this._pdp = pdp;
  }

  set pep(pep) {
    this._pep = pep;
  }

  addPolicy(source, key, policy) {
    if (source === 'SERVICE_PROVIDER') {
      this.context.serviceProviderPolicies[key] = policy;
    } else {
      if (source === 'USER') {
        this.context.userPolicies[key] = policy;
      } else {
        throw Error('Unknown policy source: ' + source);
      }
    }
  }

  removePolicy(source, key) {
    if (source === '*') {
      this.context.serviceProviderPolicies = {};
      this.context.userPolicies = {};
      this.context.activeUserPolicy = undefined;
    } else {
      if (source === 'SERVICE_PROVIDER') {
        delete this.context.serviceProviderPolicies[key];
      } else {
        if (source === 'USER') {
          delete this.context.userPolicies[key];
        } else {
          throw Error('Unknown policy source: ' + source);
        }
      }
    }
  }

  removeRule(key, rule) {
    delete this.context.userPolicies[key][rule.scope][rule.target][rule.condition];
  }

  authorise(message) {
    let _this = this;
    return _this.context.authorise(message);
  }

  getGroupsNames(scope, target) {
    let myGroups = this.context.groups;
    let groupsNames = [];
    if (myGroups[scope][target] !== undefined) {
      for (let groupName in myGroups[scope][target]) {
        groupsNames.push(groupName);
      }
    }
    return groupsNames;
  }

  getGroup(scope, target, groupName) {
    let myGroups = this.context.groups;
    let members = [];

    if (myGroups[scope] !== undefined && myGroups[scope][target] !== undefined && myGroups[scope][target][groupName] !== undefined) {
      members = myGroups[scope][target][groupName];
    }

    return members;
  }

  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  createGroup(scope, target, groupName) {
    let myGroups = this.context.groups;

    if (myGroups[scope] === undefined) {
      myGroups[scope] = {};
    }
    if (myGroups[scope][target] === undefined) {
      myGroups[scope][target] = {};
    }

    myGroups[scope][target][groupName] = [];
  }

  deleteGroup(scope, target, groupName) {
    delete this.context.groups[scope][target][groupName];
  }

  /**
  * Adds the given user email to the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(scope, target, groupName, userEmail) {
    let myGroups = this.context.groups;
    if (myGroups[scope] === undefined) {
      myGroups[scope] = {};
    }
    if (myGroups[scope][target] === undefined) {
      myGroups[scope][target] = {};
    }
    if (myGroups[scope][target][groupName] === undefined) {
      this.createGroup(scope, target, groupName);
    }
    if (myGroups[scope][target][groupName].indexOf(userEmail) === -1) {
      myGroups[scope][target][groupName].push(userEmail);
    }
  }

  removeFromGroup(scope, target, groupName, userEmail) {
    let myGroups = this.context.groups;
    let group = myGroups[scope][target][groupName];

    group.splice(group.indexOf(userEmail), 1);
  }

}

export default PolicyEngine;
