import Subscription from './Subscription';

class ObserverObject {

  constructor(bus, url) {
    let _this = this;

    _this._bus = bus;
    _this._url = url;
    _this._subscriptions = {};
  }

  addSubscription(hyperty, childrens) {
    let _this = this;

    _this._subscriptions[hyperty] = new Subscription(_this._bus, hyperty, _this._url, childrens);
  }

  removeSubscription(hyperty) {
    let _this = this;

    let subscription = _this._subscriptions[hyperty];
    if (subscription) {
      subscription.release();
      delete _this._subscriptions[hyperty];
    }
  }

}

export default ObserverObject;
