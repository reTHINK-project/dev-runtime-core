import Pipeline from './Pipeline';

export default class MessageBus {
  /* private
    _con: IConnection

    _subscriptions: <string: Subscription[]>

    _outbound: Pipeline
    _inbound: Pipeline
  */

  constructor(con) {
    let _this = this;

    _this._con = con;
    _this._subscriptions = {};

    _this._outbound = new Pipeline((error) => { console.log(error); });
    _this._inbound = new Pipeline((error) => { console.log(error); });

    _this._con.onMessage((message) => {
      _this._onMessage(message);
    });
  }

  get outbounds() { return this._outbound.handlers; }

  set outbounds(handlers) { this._outbound.handlers = handlers; }

  get inbounds() { return this._inbound.handlers; }

  set inbounds(handlers) { this._inbound.handlers = handlers; }

  subscribe(address, callback) {
    let _this = this;

    let s = new Subscription(_this._subscriptions, address, callback);
    let subs = _this._subscriptions[address];
    if (!subs) {
      subs = [];
      _this._subscriptions[address] = subs;
    }

    subs.push(s);
    return s;
  }

  publish(message) {
    let _this = this;

    _this._outbound.process(message, (msg) => {
      _this._localPublish(msg);
      _this._con.send(msg);
    });
  }

  _onMessage(message) {
    let _this = this;

    _this._inbound.process(message, (msg) => {
      _this._localPublish(msg);
    });
  }

  _localPublish(message) {
    let _this = this;

    let subs = _this._subscriptions[message.header.to];
    if (subs) {
      subs.forEach((sub) => {
        sub._callback(message);
      });
    }
  }
}

class Subscription {
  /* private
    _subscriptions: <string: Subscription[]>;
    _address: string;
    _callback: (msg) => void;
  */

  constructor(subscriptions, address, callback) {
    let _this = this;

    _this._subscriptions = subscriptions;
    _this._address = address;
    _this._callback = callback;
  }

  get address() { return this._address; }

  unsubscribe() {
    let _this = this;

    let subs = _this._subscriptions[_this._address];
    if (subs) {
      let index = subs.indexOf(_this);
      subs.splice(index, 1);
    }
  }
}
