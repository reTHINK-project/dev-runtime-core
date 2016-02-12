import Bus from './Bus';

class MiniBus extends Bus {

  constructor() {
    super();
  }

  postMessage(inMsg, responseCallback) {
    let _this = this;

    _this._genId(inMsg);
    _this._responseCallback(inMsg, responseCallback);

    //always send to external (to core MessageBus)
    _this._onPostMessage(inMsg);

    return inMsg.id;
  }

  _onMessage(msg) {
    let _this = this;

    if (!_this._onResponse(msg)) {
      let itemList = _this._subscriptions[msg.to];
      if (itemList) {
        _this._publishOn(itemList, msg);
        if (!msg.to.startsWith('hyperty')) {
          _this._publishOnDefault(msg);
        }
      } else {
        _this._publishOnDefault(msg);
      }
    }
  }

}

export default MiniBus;
