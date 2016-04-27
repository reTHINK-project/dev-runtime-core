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
    _this.objectsReporters = {};
    _this.myGroups = {}; // TODO: load from the Persistence Manager
    _this.setPoliciesImplementation();
  }

  setPoliciesImplementation() {
    let _this = this;
    _this.policiesImplementation = {};
    _this.policiesImplementation.group = 'let condition = policy.condition.split(\' \'); condition.shift(); let groupName = condition.join(\' \'); if(_this.isInGroup(message.body.identity.email, groupName)) { result[0] = policy.authorise; }';
    _this.policiesImplementation.time = 'result[0] = _this.isTimeBetween(condition[1], condition[2]) ? policy.authorise : !policy.authorise;';
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
      let result = [];
      let condition = policy.condition.split(' ');
      let resource = condition[0];

      eval(_this.policiesImplementation[resource]);
      results.push(result[0]);
      actions.push(result[1]);
    }

    let authDecision = results.indexOf(false) === -1;
    return [authDecision, actions];
  }

  /**
  * Verifies if the given hyperty URL corresponds to an email that is in the group with the given
  * name.
  * @param {URL}        hypertyURL
  * @param {String}     groupName
  * @return {Boolean}   boolean
  */
  isInGroup(userEmail, groupName) {
    let _this = this;
    let group = _this.myGroups[groupName];
    if (group === undefined) {
      return false;
    } else {
      return group.indexOf(userEmail) > -1;
    }
  }

  /**
  * Verifies if the current time is between the given start and end times.
  * @param {Number}     start
  * @param {Number}     end
  * @return {Boolean}   boolean
  */
  isTimeBetween(start, end) {
    let _this = this;
    let now = new Date();
    let nowMinutes = _this.getMinutes(parseInt(now.getHours()) + ':' + now.getMinutes());
    let startMinutes = _this.getMinutes(start);
    let endMinutes = _this.getMinutes(end);
    if (endMinutes > startMinutes) {
      return (nowMinutes > startMinutes && nowMinutes < endMinutes);
    } else {
      if (nowMinutes < startMinutes) {
        nowMinutes += 24 * 60;
      }
      endMinutes += 24 * 60;
      return (nowMinutes > startMinutes && nowMinutes < endMinutes);
    }
  }

  /**
  * Returns the number of minutes that correspond to the given time in the format <HOURS>:<MINUTES>.
  * @param {Number}   time
  * @return {Number}  minutes
  */
  getMinutes(time) {
    let timeSplit = time.split(':');
    return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
  }
}

export default PDP;
