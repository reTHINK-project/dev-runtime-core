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
  * @param  {Registry}    runtimeRegistry
  */
  constructor(runtimeRegistry) {
    let _this = this;
    _this.runtimeRegistry = runtimeRegistry;
    _this.dataObjectsInfo = {};
    _this.myGroups = {};
    _this.systemVariables = _this.setSystemVariables();
    _this.operations = _this.setOperations();
  }

  setSystemVariables() {
    let systemVariables = {};

    systemVariables.group = '_this.myGroups[param];';
    systemVariables.time = '_this.getMinutesFromMidnight();';

    return systemVariables;
  }

  setOperations() {
    let operations = {};

    operations.betweenMinutes = '_this.isTimeBetween(parseInt(value), parseInt(params[0]), parseInt(params[1]));';
    operations.in = '(params[0] in value) ? _this.myGroups[groupName] : [];';
    operations.between = 'value > params[0] && value < params[1];';
    operations.equals = 'value === params[0];';

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
      let value = eval(_this.systemVariables[variable]);
      let verifiesCondition = eval(_this.operations[operation]);
      if (verifiesCondition) {
        results.push(policy.authorise);
      }

      //actions.push(result[1]);
    }

    let authDecision = results.indexOf(false) === -1;
    return [authDecision, actions];
  }

  getMinutesFromMidnight() {
    let now = new Date();
    return parseInt(now.getHours()) * 60  + parseInt(now.getMinutes());
  }

  /**
  * Verifies if the current time is between the given start and end times.
  * @param {Number}     start
  * @param {Number}     end
  * @return {Boolean}   boolean
  */
  isTimeBetween(now, start, end) {
    if (end < start) {
      now = (now < start) ? now += 24 * 60 : now;
      end += 24 * 60;
    }
    return (now > start && now < end);
  }

  getGroupsNames() {
    let _this = this;
    let myGroups = _this.myGroups;
    let groupsNames = [];
    for (let groupName in myGroups) {
      groupsNames.push(groupName);
    }
    return groupsNames;
  }

  /**
  * Returns the group with the given group name.
  * @param  {String}  groupName
  * @return {Array}   group
  */
  getGroup(groupName) {
    let _this = this;
    return (groupName in _this.myGroups) ? _this.myGroups[groupName] : [];
  }

  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  createGroup(groupName) {
    let _this = this;
    _this.myGroups[groupName] = [];
  }

  /**
  * Removes the group with the given name.
  * @param  {String}  groupName
  */
  removeGroup(groupName) {
    let _this = this;
    delete _this.myGroups[groupName];
  }

  /**
  * Adds the given user email to the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(userEmail, groupName) {
    let _this = this;
    let group = _this.myGroups[groupName];
    if (group === undefined) {
      _this.createGroup(groupName);
      group = _this.getGroup(groupName);
    }
    group.push(userEmail);
  }

  /**
  * Removes the given user email from the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  removeFromGroup(userEmail, groupName) {
    let _this = this;
    let group = _this.myGroups[groupName];
    for (let i in group) {
      if (group[i] === userEmail) {
        group.splice(i, 1);
        break;
      }
    }
  }
}

export default PDP;
