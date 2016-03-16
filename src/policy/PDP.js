class PDP {

  constructor(runtimeRegistry) {
    let _this = this;
    _this.runtimeRegistry = runtimeRegistry;
    _this.myLists = {};
  }

  getList(listName) {
    let _this = this;
    if (listName in _this.myLists) {
      return _this.myLists[listName];
    } else {
      throw new Error('The list ' + listName + ' does not exist!');
    }
  }

  createList(listName) {
    let _this = this;
    _this.myLists[listName] = [];
  }

  addToList(userID, listName) {
    let _this = this;
    _this.myLists[listName].push(userID);
  }

  // TODO: confirmar que remove de _this.myLists[listName] e não só de list
  removeFromList(userID, listName) {
    let _this = this;
    let list = _this.myLists[listName];
    for (let i in list) {
      if (list[i] === userID) {
        list.splice(i, 1);
        break;
      }
    }
  }

  /* use hashtable to allow dynamic management */
  evaluate(message, hypertyToVerify, policies) {
    let _this = this;
    let results = [true];
    let actions = [];

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
          result[1] = policy.actions; // TODO: do actions depend on the decision?
      }
      results.push(result[0]);
      actions.push(result[1]);
    }

    let authDecision = _this.getDecision(results);
    return [authDecision, actions];
  }

  /* Aux function for evaluate() */
  getDecision(results) {
    return results.indexOf(false) === -1;
  }

  isInList(hypertyToVerify, listName) {
    let _this = this;
    let list = _this.myLists[listName];
    for (let i in list) {
      if (_this.hypertiesMatch(_this.registry, list[i]), hypertyToVerify) {
        return true;
      }
    }
    return false;
  }

  /* TODO: cache this? */
  hypertiesMatch(registry, URLToVerify, hypertyToVerify) {
    registry.getUserHyperty(URLToVerify).then(function(hyperty) {
      return hyperty.hypertyURL === hypertyToVerify;
    });
  }

  isWhiteListed(userID) {
    let _this = this;
    return _this.whiteList.indexOf(userID) > -1;
  }

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

  /* Aux function for isTimeBetween() */
  getMinutes(time) {
    let timeSplit = time.split(':');
    return parseInt(timeSplit[0]) * 60 + parseInt(timeSplit[1]);
  }
}

export default PDP;
