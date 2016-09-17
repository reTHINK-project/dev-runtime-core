import PEP from './PEP';
import PDP from './PDP';
import UserPolicy from './policies/UserPolicy';

class PolicyEngine {

  constructor(context) {
    this.context = context;
    context.policyEngine = this;
    context.loadActivePolicy();
    context.loadGroups();
    context.loadSPPolicies();
    context.loadUserPolicies();
    this.pdp = new PDP(context);
    this.pep = new PEP(context);
  }

  addPolicy(source, key, policy) {
    if (source === 'SERVICE_PROVIDER') {
      this.context.serviceProviderPolicies[key] = policy;
      this.context.savePolicies(source);
    } else {
      if (source === 'USER') {
        if (!policy) {
          policy = new UserPolicy(key, [], []);
        }
        this.context.userPolicies[key] = policy;
        this.context.savePolicies(source);
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
          if (key === this.context.activeUserPolicy) {
            this.context.activeUserPolicy = undefined;
          }
        } else {
          throw Error('Unknown policy source: ' + source);
        }
      }
    }

    this.context.savePolicies('USER');
    this.context.savePolicies('SERVICE_PROVIDER');
    this.context.saveActivePolicy();
  }

  removeRule(key, rule) {
    delete this.context.userPolicies[key][rule.scope][rule.target][rule.condition];
  }

  authorise(message) {
    let _this = this;
    return _this.context.authorise(message);
  }

  getGroupsNames() {
    let myGroups = this.context.groups;
    let groupsNames = [];
    if (myGroups !== undefined) {
      for (let groupName in myGroups) {
        groupsNames.push(groupName);
      }
    }
    return groupsNames;
  }

  getGroup(groupName) {
    let myGroups = this.context.groups;
    let members = [];

    if (myGroups[groupName] !== undefined) {
      members = myGroups[groupName];
    }

    return members;
  }

  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  createGroup(groupName) {
    this.context.groups[groupName] = [];
    this.context.saveGroups();
  }

  deleteGroup(groupName) {
    delete this.context.groups[groupName];
    this.context.saveGroups();
  }

  /**
  * Adds the given user email to the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(groupName, userEmail) {
    let myGroups = this.context.groups;
    if (myGroups[groupName] !== undefined) {
      if (myGroups[groupName].indexOf(userEmail) === -1) {
        myGroups[groupName].push(userEmail);
        this.context.saveGroups();
      }
    } else {
      throw Error('Group "' + groupName + '" does not exist!');
    }
  }

  removeFromGroup(groupName, userEmail) {
    let group = this.context.groups[groupName];

    group.splice(group.indexOf(userEmail), 1);
    this.context.saveGroups();
  }

}

export default PolicyEngine;
