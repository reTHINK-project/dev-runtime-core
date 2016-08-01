import {divideEmail} from '../../utils/utils';

class CommonCtx {

  constructor() {
    this.serviceProviderPolicies = {};
    this.defaultBehavior = true;
    this.groups = {};
  }

  get defaultBehavior() {
    return this._defaultBehavior;
  }

  get serviceProviderPolicies() {
    return this._serviceProviderPolicies;
  }

  set defaultBehavior(behavior) {
    this._defaultBehavior = behavior;
  }

  set serviceProviderPolicies(policies) {
    this._serviceProviderPolicies = policies;
  }

  set date(now) {
    if (!now.message) {
      if (typeof now === 'string') {
        this._date = now;
      } else {
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
    }
  }

  set domain(params) {
    this._domain = divideEmail(params.message.body.identity.userProfile.username).domain;
  }

  set source(params) {
    this._source = params.message.body.identity.userProfile.username;
  }

  set time(now) {
    if (!now.message) {
      if (now) {
        this._time = now;
      } else {
        let now = new Date();
        let minutes = String(now.getMinutes());
        if (minutes.length === 1) {
          minutes = '0' + minutes;
        }
        this._time = parseInt(String(now.getHours()) + minutes);
      }
    }
  }

  set weekday(now) {
    if (!now.message) {
      if (now) {
        this._weekday = now;
      } else {
        this._weekday = String(new Date().getDay());
      }
    }
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
