import persistenceManager from '../persistence/PersistenceManager';
import {divideEmail} from '../utils/utils';

/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/
class PDP {

  /**
  * This method is invoked by the Policy Engine and instantiates the Policy Decision Point. It
  * initialises or loads from the Persistence Manager the object 'myGroups' to store the user's
  * groups.
  * @param  {Registry}    muchruntimeRegistry
  */
  constructor(runtimeRegistry) {
    let _this = this;
    _this.runtimeRegistry = runtimeRegistry;
    _this.systemVariables = _this.setSystemVariables();
    _this.operations = _this.setOperations();
  }

  /* System variable's obtention, needed to verify a condition. */
  setSystemVariables() {
    let _this = this;
    let systemVariables = {
      source: (message) => { return message.body.identity.email; },
      domain: (message) => { return divideEmail(message.body.identity.email).domain; },
      time: () => { return _this.getCurrentTime(); },
      weekday: () => { return String(new Date().getDay()); },
      date: () => { return _this.getDate(); }
    };
    return systemVariables;
  }

  setOperations() {
    let operations = {};

    operations.betweenMinutes = '_this.isTimeBetween(value, parseInt(params[0]), parseInt(params[1]))';
    operations.in = '_this.getList(params[0]).indexOf(value) != -1';
    operations.between = 'value > params[0] && value < params[1]';
    operations.equals = '(params[0] === \'*\') || value === params[0]';

    return operations;
  }

  /**
  * Verifies if the given message is compliant with the given policies. If one of the policies
  * evaluates to 'false', then the message is not authorised. Returns the final authorisation
  * decision and a set of actions that policies may require.
  * @param {Message}  message
  * @param {URL}      hypertyToVerify
  * @param {Array}    policies
  * @return {Array}   [authDecision, actions]
  */
  evaluate(message, policies) {
    let _this = this;
    let results = [true];
    let actions = [];
    for (let i in policies) {
      let policy = policies[i];
      let condition = policy.condition.split(' ');

      let variable = condition[0];
      let operation = condition[1];
      let params = condition.slice(2);
      let value = _this.systemVariables[variable](message);
      let verifiesCondition = eval(_this.operations[operation]);
      if (verifiesCondition) {
        results.push(policy.authorise);
      }

      //actions.push(result[1]);
    }

    let authDecision = results.indexOf(false) === -1;
    return [authDecision, actions];
  }

  getCurrentTime() {
    let now = new Date();
    return parseInt(String(now.getHours()) + now.getMinutes());
  }

  getDate() {
    let date = new Date();
    return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
  }

  /**
  * Verifies if the current time is between the given start and end times.
  * @param {Number}     start
  * @param {Number}     end
  * @return {Boolean}   boolean
  */
  isTimeBetween(now, start, end) {
    if (end < start) {
      now = (now < start) ? now += 2400 : now;
      end += 2400;
    }
    return (now > start && now < end);
  }

  getGroupsNames() {
    let myGroups = persistenceManager.get('groups') || {};
    let groupsNames = [];

    if (myGroups !== {}) {
      for (let groupName in myGroups) {
        groupsNames.push(groupName);
      }
    }

    return groupsNames;
  }

  /**
  * Returns the group with the given group name.
  * @param  {String}  groupName
  * @return {Array}   group
  */
  getList(groupName) {
    let myGroups = persistenceManager.get('groups') || {};
    return (groupName in myGroups) ? myGroups[groupName] : [];
  }

  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  createGroup(groupName) {
    let myGroups = persistenceManager.get('groups') || {};
    myGroups[groupName] = [];
    persistenceManager.set('groups', 0, myGroups);
    return myGroups;
  }

  /**
  * Removes the group with the given name.
  * @param  {String}  groupName
  */
  deleteGroup(groupName) {
    let myGroups = persistenceManager.get('groups') || {};

    delete myGroups[groupName];
    persistenceManager.set('groups', 0, myGroups);
  }

  /**
  * Adds the given user email to the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(userEmail, groupName) {
    let _this = this;
    let myGroups = persistenceManager.get('groups') || {};
    if (myGroups[groupName] === undefined) {
      myGroups = _this.createGroup(groupName);
      myGroups[groupName] = [];
    }
    myGroups[groupName].push(userEmail);
    persistenceManager.set('groups', 0, myGroups);
  }

  /**
  * Removes the given user email from the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  removeFromGroup(userEmail, groupName) {
    let myGroups = persistenceManager.get('groups') || {};
    let group = myGroups[groupName];

    for (let i in group) {
      if (group[i] === userEmail) {
        group.splice(i, 1);
        persistenceManager.set('groups', 0, myGroups);
        break;
      }
    }
  }
}

export default PDP;
