class Subscription {

  constructor(bus, hyperty, url, childrens) {
    let _this = this;
    let childBaseURL = url + '/children/';

    //subscription accepted (add forward and subscription)
    _this._changeListener = bus.addForward(url + '/changes', hyperty);

    //add forward for children
    _this._childrenListeners = [];
    childrens.forEach((child) => {
      let childrenForward = bus.addForward(childBaseURL + child, hyperty);
      _this._childrenListeners.push(childrenForward);
    });
  }

  release() {
    let _this = this;

    _this._changeListener.remove();
    _this._childrenListeners.forEach((forward) => {
      forward.remove();
    });
  }

}

export default Subscription;
