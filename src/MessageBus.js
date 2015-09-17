import Pipeline from './Pipeline';

export default class MessageBus {
  /* private
    _con: IConnection

    _subscriptions: <string: Subscription[]>

    _outbound: Pipeline
    _inbound: Pipeline
  */

  constructor(con) {
    let _self = this;

    _self._con = con;
    _self._subscriptions = {};

    _self._outbound = new Pipeline((error) => { console.log(error); });
    _self._inbound = new Pipeline((error) => { console.log(error); });

    _self._con.onMessage((message) => {
      _self._onMessage(message);
    });
  }

  get outbounds() { return this._outbound.handlers; }
  set outbounds(handlers) { this._outbound.handlers = handlers; }

  get inbounds() { return this._inbound.handlers; }
  set inbounds(handlers) { this._inbound.handlers = handlers; }

  subscribe(address, callback) {
    let _self = this;

    let s = new Subscription(_self._subscriptions, address, callback);
    let subs = _self._subscriptions[address];
    if (!subs) {
      subs = [];
      _self._subscriptions[address] = subs;
    }

    subs.push(s);
    return s;
  }

  publish(message) {
    let _self = this;

    _self._outbound.process(message, (msg) => {
      _self._localPublish(msg);
      _self._con.send(msg);
    });
  }

  _onMessage(message) {
    let _self = this;

    _self._inbound.process(message, (msg) => {
      _self._localPublish(msg);
    });
  }

  _localPublish(message) {
    let _self = this;

    let subs = _self._subscriptions[message.header.to];
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
    let _self = this;

    _self._subscriptions = subscriptions;
    _self._address = address;
    _self._callback = callback;
  }

  get address() { return this._address; }

  unsubscribe() {
    let _self = this;

    let subs = _self._subscriptions[_self._address];
    if (subs) {
      let index = subs.indexOf(_self);
      subs.splice(index, 1);
    }
  }
}
