import {divideEmail} from '../utils/utils';

class Context {

  constructor() {
    let _this = this;
  }

  set date(now) {
    let _this = this;
    if (!now.message) {
      _this._dateAttribute = (typeof now === 'string') ? now : _this._getDate();
    }
  }

  set domain(params) {
    let _this = this;
    _this._domainAttribute = divideEmail(params.message.body.identity.email).domain;;
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

  isToSetID(from, to) {
    return false;
  }

  isToVerify(message) {
    return true;
  }

  encryptMessage(message) {
    return false;
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

export default Context;
