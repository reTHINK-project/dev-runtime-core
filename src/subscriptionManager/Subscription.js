class Subscription {

  constructor(bus, subscriber, resource) {
    let _this = this;
    _this._subscriber = subscriber;
    _this.resource = resource;

    console.log('[SubscriptionManager.Subscription] new: ', subscriber, resource)

    //add forward
    _this._listener = bus.addForward(resource, subscriber);

  }

  _releaseListeners() {
    let _this = this;

    _this._listener.remove();

  }

}

export default Subscription;
