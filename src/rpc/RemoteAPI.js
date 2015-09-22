import RemoteObject from './RemoteObject';

export default class RemoteAPI {
  /* private
    _mb: MiniBus;
    _localObj: <local object API>
  */

  constructor(mb, localObj) {
    let _this = this;

    _this._localObj = localObj;
    _this._mb = mb;
    mb.subscribe(RemoteObject.NAME, (msg) => {
      _this._processCall(msg);
    });
  }

  create(url) {
    let rpcObj = new RemoteObject(this._mb, url);

    //TODO: add API methods!

    return rpcObj;
  }

  _processCall(msg) {
    try {
      let method = this._localObj[msg.body.method];
      if (method) {
        let result = method.apply(this._localObj, msg.body.params);
        msg.reply({code: 'ok', value: result});
      } else {
        msg.reply({code: 'error', desc: 'Method not found'});
      }
    } catch (err) {
      msg.reply({code: 'error', desc: err});
    }
  }
}
