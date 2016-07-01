import Context from '../Context';
import {divideEmail} from '../../utils/utils';

//import persistenceManager from '../../persistence/PersistenceManager';

class CommonCtx extends Context {

  constructor() {
    super();
    let _this = this;
    _this.policies = _this.loadPolicies();
    _this.groups = {};
  }

  applyPolicies(message) {
    let _this = this;
    let policiesResult = [true, []];
    let applicablePolicies = _this.getApplicablePolicies(message);
    policiesResult = _this.pdp.evaluate(message, applicablePolicies);
    message.body.auth = applicablePolicies.length !== 0;
    _this.pep.enforce(policiesResult);
    return { message: message, policiesResult: policiesResult };
  }

  set date(now) {
    let _this = this;
    if (!now.message) {
      _this._dateAttribute = (typeof now === 'string') ? now : _this._getDate();
    }
  }

  set domain(params) {
    let _this = this;
    _this._domainAttribute = divideEmail(params.message.body.identity.userProfile.username).domain;
  }

  set source(params) {
    let _this = this;
    _this._sourceAttribute = params.message.body.identity.userProfile.username;
  }

  set time(now) {
    let _this = this;
    if (!now.message) {
      _this._timeAttribute = (now) ? now : _this._getTime();
    }
  }

  set weekday(now) {
    let _this = this;
    if (!now.message) {
      _this._weekdayAttribute = (now) ? now : _this._getWeekDay();
    }
  }

  get date() {
    let _this = this;
    return _this._dateAttribute;
  }

  get domain() {
    let _this = this;
    return _this._domainAttribute;
  }

  get source() {
    let _this = this;
    return _this._sourceAttribute;
  }

  get time() {
    let _this = this;
    return _this._timeAttribute;
  }

  get weekday() {
    let _this = this;
    return _this._weekdayAttribute;
  }

  _getDate() {
    let date = new Date();
    let day = String(date.getDate());
    if (day.length === 1) {
      day = '0' + day;
    }

    let month = String(date.getMonth() + 1);
    if (month.length === 1) {
      month = '0' + month;
    }

    return day + '/' + month + '/' + date.getFullYear();
  }

  _getList(scope, groupName) {
    let _this = this;
    let myGroups = _this.groups;
    let members = [];
    if (myGroups[scope] !== undefined && myGroups[scope][groupName] !== undefined) {
      members = myGroups[scope][groupName];
    }
    return members;
  }

  _getTime() {
    let now = new Date();
    let minutes = String(now.getMinutes());
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    return parseInt(String(now.getHours()) + minutes);
  }

  _getWeekDay() {
    return String(new Date().getDay());
  }

}

export default CommonCtx;
