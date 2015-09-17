export default class MiniBus {
  /* private
    _mb: MessageBus

    _msgId: number;
    _subscriptions: <string: Subscription[]>

    _replyTimeOut: number
    _replyCallbacks: (msg) => void

    _ownerSubscription: MessageBus.Subscription
  */

  constructor(owner, mb) {
    let _self = this;

    _self._owner = owner;
    _self._mb = mb;

    _self._msgId = 1;
    _self._subscriptions = {};

    _self._replyTimeOut = 3000; //default to 3s ?
    _self._replyCallbacks = {};

    _self._ownerSubscription = _self._mb.subscribe(owner, (msg) => {
      _self._onMessage(msg);
    });
  }

  get owner() { return this._owner; }

  subscribe(component, callback) {
    let _self = this;

    let s = new Subscription(_self._subscriptions, component, callback);
    let subs = _self._subscriptions[component];
    if (!subs) {
      subs = [];
      _self._subscriptions[component] = subs;
    }

    subs.push(s);
    return s;
  }

  publish(msg) {
    let _self = this;

    _self._setupID(msg);
    _self._sendMsg(msg);
  }

  send(msg, replyCallback) {
    let _self = this;
    _self._setupID(msg); //override any existent id

    if (replyCallback) {
      _self._replyCallbacks[msg.header.id] = replyCallback;
      setTimeout(() => {
        let replyFun = _self._replyCallbacks[msg.header.id];
        delete _self._replyCallbacks[msg.header.id];

        if (replyFun) {
          let errorMsg = {
            header: {
              type: 'reply'
            },
            body: {
              code: 'error',
              desc: 'Reply timeout!'
            }
          };

          replyFun(errorMsg);
          console.log('REPLY-TIMEOUT: ' + msg.header.id);
        }
      }, _self._replyTimeOut);
    }

    _self._sendMsg(msg);
  }

  _sendMsg(msg) {
    msg.header.from = this._owner;
    this._mb.publish(msg);
  }

  _setupID(msg) {
    msg.header.id = this._msgId;
    this._msgId++;
  }

  _onMessage(msg) {
    let _self = this;

    if (msg.header.type === 'reply') {
      let replyFun = _self._replyCallbacks[msg.header.id];
      delete _self._replyCallbacks[msg.header.id];

      if (replyFun) {
        replyFun(msg);
      }
    } else {
      _self._localPublish(msg);
    }
  }

  _localPublish(msg) {
    let _self = this;

    let subs = _self._subscriptions[msg.header.comp];
    if (subs) {
      //set reply function...
      msg.reply = function(code, desc) {
        let reply = {
          header: {
            id: msg.header.id,
            type: 'reply',
            to: msg.header.from,
            comp: msg.header.comp
          },
          body: {
            code: code
          }
        };

        if (desc) {
          reply.body.desc = desc;
        }

        _self._sendMsg(reply);
      };

      subs.forEach((sub) => {
        sub._callback(message);
      });
    }
  }
}

class Subscription {
  /* private
    _subscriptions: <string: Subscription[]>;
    _component: string;
    _callback: (msg) => void;
  */

  constructor(subscriptions, component, callback) {
    let _self = this;

    _self._subscriptions = subscriptions;
    _self._component = component;
    _self.callback = callback;
  }

  get component() { return this._component; }

  unsubscribe() {
    let _self = this;

    let subs = _self._subscriptions[_self._component];
    if (subs) {
      let index = subs.indexOf(_self);
      subs.splice(index, 1);
    }
  }
}
