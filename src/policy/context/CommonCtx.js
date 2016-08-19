import {divideEmail} from '../../utils/utils';

class CommonCtx {

  constructor() {
    this.defaultBehavior = true;
    this.groups = {};
  }

  get defaultBehavior() {
    return this._defaultBehavior;
  }

  set defaultBehavior(behavior) {
    this._defaultBehavior = behavior;
  }

  set date(now) {
    let date = new Date();
    let day = String(date.getDate());
    if (day.length === 1) {
      day = '0' + day;
    }
    let month = String(date.getMonth() + 1);
    if (month.length === 1) {
      month = '0' + month;
    }

    this._date = day + '/' + month + '/' + date.getFullYear();
  }

  set domain(params) {
    if (params.message.body.identity !== undefined) {
      this._domain = divideEmail(params.message.body.identity.userProfile.username).domain;
    }
  }

  set source(params) {
    if (params.message.body.identity !== undefined) {
      this._source = params.message.body.identity.userProfile.username;
    }
  }

  set time(now) {
    now = new Date();
    let minutes = String(now.getMinutes());
    if (minutes.length === 1) {
      minutes = '0' + minutes;
    }
    this._time = parseInt(String(now.getHours()) + minutes);
  }

  set weekday(now) {
    this._weekday = String(new Date().getDay());
  }

  get date() {
    return this._date;
  }

  get domain() {
    return this._domain;
  }

  get source() {
    let _this = this;
    return _this._source;
  }

  get time() {
    let _this = this;
    return _this._time;
  }

  get weekday() {
    return this._weekday;
  }

}

export default CommonCtx;
