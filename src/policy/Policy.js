import {divideURL} from '../utils/utils.js';

class Policy {

  constructor(id, target, when, authorise, actions) {
    let _this = this;
    _this.id = id;
    _this.target = target;
    _this.when = when;
    _this.authorise = authorise;
    _this.actions = actions;
  }

  /* TODO: sanitization needed */
  evaluate(message, userID) {
    let _this = this;
    let result = [];
    switch (_this.target) {
      case 'domain':
        let domainURL = divideURL(userID).domain;
        result[0] = (domainURL === _this.when) ? _this.authorise : !_this.authorise;
        break;
      case 'lists':
        result[0] = eval('_this.' + _this.when + '(\''+ userID +'\')') ? _this.authorise : !_this.authorise;
        break;
      case 'time':
        result[0] = eval('_this.' + _this.when) ? _this.authorise : !_this.authorise;
        break;
      default:
        result[1] = _this.actions;
        break;
    }
    return _result;
  }

  isBlackListed(user) {
    // let blackList = trustEngine.getBlackList();
    let blackList = [];
    return blackList.indexOf(user) > -1;
  }

  isWhiteListed(user) {
    // let whiteList = trustEngine.getWhiteList();
    let whiteList = []
    //whiteList.push('user://gmail.com/openidtest10');
    return whiteList.indexOf(from) > -1;
  }

  getMinutes(time) {
    var timeSplit = time.split(':');
    return parseInt(timeSplit[0] * 60 + timeSplit[1]);
  }

  isTimeBetween(start, end) {
    let _this = this;
    let now = new Date();
    let nowMinutes = _this.getMinutes(parseInt(now.getHours()) + ':' + now.getMinutes());
    let startMinutes = _this.getMinutes(start);
    let endMinutes = _this.getMinutes(end);
    return (nowMinutes > startMinutes && nowMinutes < endMinutes);
  }

}

export default Policy;
