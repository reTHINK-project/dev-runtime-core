/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/
class PDP {

  /**
  * This method is invoked by the Policy Engine and instantiates the Policy Decision Point. It initialises or loads from the Persistence Manager the object 'myLists' to store the user's lists.
  * @param  {Registry}    runtimeRegistry
  */
  constructor(runtimeRegistry) {
    let _this = this;
    _this.runtimeRegistry = runtimeRegistry;
    _this.myLists = {}; // TODO: load from the Persistence Manager
  }

  /**
  * Returns the list with the given list name.
  * @param  {String}  listName
  * @return {Array}   list
  */
  getList(listName) {
    let _this = this;
    return (listName in _this.myLists) ? _this.myLists[listName] : [];
  }

  /**
  * Creates a list with the given name.
  * @param  {String}  listName
  */
  createList(listName) {
    let _this = this;
    _this.myLists[listName] = [];
  }

  /**
  * Adds the given user email to the list with the given name.
  * @param  {String}  userEmail
  * @param  {String}  listName
  */
  addToList(userEmail, listName) {
    let _this = this;
    let list = _this.myLists[listName];
    if (list === undefined) {
      _this.createList(listName);
      list = _this.getList(listName);
    }
    list.push(userEmail);
  }

  /**
  * Removes the given user email from the list with the given name.
  * @param  {String}  userEmail
  * @param  {String}  listName
  */
  removeFromList(userEmail, listName) {
    let _this = this;
    let list = _this.myLists[listName];
    for (let i in list) {
      if (list[i] === userEmail) {
        list.splice(i, 1);
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
  evaluate(message, hypertyToVerify, policies) {
    let _this = this;
    let results = [true];
    let actions = [];

    // TODO: use hashtable to allow dynamic management
    for (let i in policies) {
      let policy = policies[i];
      let result = [];
      let condition = policy.condition.split(' ');
      let resource = condition[0];
      switch (resource) {
        case 'list':
          let listName = condition[1];
          result[0] = _this.isInList(hypertyToVerify, listName) ? policy.authorise : !policy.authorise;
          break;
        case 'time':
          let start = condition[1];
          let end = condition[2];
          result[0] = _this.isTimeBetween(start, end) ? policy.authorise : !policy.authorise;
          break;
        default:
          result[1] = policy.actions;
      }
      results.push(result[0]);
      actions.push(result[1]); // TODO: do actions depend on the final authorisation decision?
    }

    let authDecision = results.indexOf(false) === -1;
    return [authDecision, actions];
  }

  /**
  * Verifies if the given hyperty URL corresponds to an email that is in the list with the given
  * name.
  * @param {URL}        hypertyURL
  * @param {String}     listName
  * @return {Boolean}   boolean
  */
  isInList(hypertyURL, listName) {
    let _this = this;
    let list = _this.myLists[listName];
    for (let i in list) {
      if (_this.registry.getUserHyperty(list[i]) === hypertyURL) {
        return true;
      }
    }
    return false;
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
