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
    let _this = this;

    _this._owner = owner;
    _this._mb = mb;

    _this._msgId = 1;
    _this._subscriptions = {};

    _this._replyTimeOut = 3000; //default to 3s ?
    _this._replyCallbacks = {};

    _this._ownerSubscription = _this._mb.subscribe(owner, (msg) => {
      _this._onMessage(msg);
    });
  }

  get owner() { return this._owner; }

  subscribe(component, callback) {
    let _this = this;

    let s = new Subscription(_this._subscriptions, component, callback);
    let subs = _this._subscriptions[component];
    if (!subs) {
      subs = [];
      _this._subscriptions[component] = subs;
    }

    subs.push(s);
    return s;
  }

  publish(msg) {
    let _this = this;

    _this._setupID(msg);
    _this._sendMsg(msg);
  }

  //TODO: handle transitory responses?
  send(msg, replyCallback) {
    let _this = this;
    _this._setupID(msg); //override any existent id

    if (replyCallback) {
      _this._replyCallbacks[msg.header.id] = replyCallback;
      setTimeout(() => {
        let replyFun = _this._replyCallbacks[msg.header.id];
        delete _this._replyCallbacks[msg.header.id];

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
      }, _this._replyTimeOut);
    }

    _this._sendMsg(msg);
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
    let _this = this;

    if (msg.header.type === 'reply') {
      let replyFun = _this._replyCallbacks[msg.header.id];
      delete _this._replyCallbacks[msg.header.id];

      if (replyFun) {
        replyFun(msg);
      }
    } else {
      _this._localPublish(msg);
    }
  }

  _localPublish(msg) {
    let _this = this;

    let subs = _this._subscriptions[msg.header.comp];
    if (subs) {
      //set reply function...
      msg.reply = function(replyBody) {
        let reply = {
          header: {
            id: msg.header.id,
            type: 'reply',
            to: msg.header.from,
            comp: msg.header.comp
          },
          body: replyBody
        };

        _this._sendMsg(reply);
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
    let _this = this;

    _this._subscriptions = subscriptions;
    _this._component = component;
    _this.callback = callback;
  }

  get component() { return this._component; }

  unsubscribe() {
    let _this = this;

    let subs = _this._subscriptions[_this._component];
    if (subs) {
      let index = subs.indexOf(_this);
      subs.splice(index, 1);
    }
  }
}
