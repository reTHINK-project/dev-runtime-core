import Context from '../Context';
import {divideEmail} from '../../utils/utils';

//import persistenceManager from '../../persistence/PersistenceManager';

class CommonCtx extends Context {

  constructor() {
    super();
  }

  applyPolicies(message) {
    let _this = this;
    let policiesResult = [true, []];
    let applicablePolicies = _this.getApplicablePolicies('*');
    policiesResult = _this.pdp.evaluate(message, applicablePolicies);
    message.body.auth = applicablePolicies.length !== 0;
    _this.pep.enforce(policiesResult);

    return { message: message, policiesResult: policiesResult };
  }

  /**
  * Returns the policies associated with a scope.
  * @param   {String} scope
  * @return  {Array}  policies
  */
  getApplicablePolicies(scope) {
    //let myPolicies = persistenceManager.get('policies');
    let _this = this;
    let myPolicies = _this.policies;
    if (myPolicies === undefined) {
      myPolicies = {};
    }
    let policies = [];

    if (scope !== '*') {
      if (myPolicies[scope] !== undefined) {
        policies = myPolicies[scope];
      }
    } else {
      for (let i in myPolicies) {
        policies.push.apply(policies, myPolicies[i]);
      }
    }

    return policies;
  }

  set date(now) {
    let _this = this;
    if (!now.message) {
      _this._dateAttribute = (typeof now === 'string') ? now : _this._getDate();
    }
  }

  set domain(params) {
    let _this = this;
    _this._domainAttribute = divideEmail(params.message.body.identity.email).domain;
  }

  set source(params) {
    let _this = this;
    _this._sourceAttribute = params.message.body.identity.email;
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

  _getTime() {
    let now = new Date();
    return parseInt(String(now.getHours()) + now.getMinutes());
  }

  _getWeekDay() {
    return String(new Date().getDay());
  }

}

export default CommonCtx;
