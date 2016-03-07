class PDP {

  constructor() {
    let _this = this;
    _this.blackList = [];
    _this.whiteList = [];
  }

  /* use hashtable to allow dynamic management */
  evaluate(registry, message, hypertyToVerify, policies) {
    let _this = this;
    let results = [true];
    let actions = [];

    for (let i in policies) {
      let policy = policies[i];
      let result = [];
      let condition = policy.condition.split(' ');
      switch (condition[0]) {
        case 'blacklisted':
          console.log('to verify', hypertyToVerify);
          result[0] = _this.isBlackListed(registry, hypertyToVerify) ? policy.authorise : !policy.authorise;
          console.log('result', result[0]);
          break;
        case 'whitelisted':
          result[0] = _this.isWhiteListed(hypertyToVerify) ? policy.authorise : !policy.authorise;
          break;
        case 'time':
          let start = condition[1];
          let end = condition[2];
          result[0] = _this.isTimeBetween(start, end) ? policy.authorise : !policy.authorise;
          break;
        default:

          // TODO: do actions depend on the decision?
          result[1] = policy.actions;
      }

      results.push(result[0]);
      actions.push(result[1]);
    }

    let authDecision = _this.getDecision(results);
    return [authDecision, actions];
  }

  isSameOrigin() {}

  isBlackListed(registry, hypertyToVerify) {
    let _this = this;
    let blackList = _this.blackList;
    console.log('blacklist', blackList);
    console.log('verifying ' + hypertyToVerify);
    for (let i in blackList) {
      console.log('checking email' + blackList[i]);
      if (_this.hypertiesMatch(registry, blackList[i]), hypertyToVerify) {
        console.log('returning true');
        return true;
      }
    }
    console.log('returning false');
    return false;
  }

/* TODO: cache this? */
hypertiesMatch(registry, emailToVerify, hypertyToVerify) {
  /* TODO: A user may be associated to several hyperties? */
  registry.getUserHyperty(emailToVerify).then(function(hypertyOfEmail) {
    console.log('email ' + emailToVerify + ' -> hyperty ' + hypertyOfEmail.hypertyURL);
    return hypertyOfEmail.hypertyURL === hypertyToVerify;
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

  getBlackList() {
    let _this = this;
    return _this.blackList;
  }

  isContext() {}

  isHypertyType() {}

  /* Aux function for evaluate() */
  getDecision(results) {
    return results.indexOf(false) === -1;
  }

  addToBlackList(userID) {
    let _this = this;
    if (_this.blackList.indexOf(userID) === -1) {
      _this.blackList.push(userID);
    }
    console.log(_this.blackList);
  }

  removeFromBlackList(userID) {
    let _this = this;
    let blackList = _this.blackList;
    for (let i in blackList) {
      if (blackList[i] === userID) {
        blackList.splice(i, 1);
        break;
      }
    }
  }

  addToWhiteList(userID) {
    let _this = this;
    if (_this.blackList.indexOf(userID) === -1) {
      _this.whiteList.push(userID);
    }
  }

  removeFromWhiteList(userID) {
    let _this = this;
    let whiteList = _this.whiteList;
    for (let i in whiteList) {
      if (whiteList[i] === userID) {
        whiteList.splice(i, 1);
        break;
      }
    }
  }
}

export default PDP;
