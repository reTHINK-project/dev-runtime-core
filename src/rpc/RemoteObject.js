export default class RemoteObject {
  /* private
    _mb: MiniBus;
    _url: Remote.URL;
  */

  constructor(mb, url) {
    let _this = this;

    _this._mb = mb;
    _this._url = url;
  }

  get url() { return this._url; }

  addMethod(methodName) {
    let _this = this;

    _this[methodName] = function() {
      //TODO: verify if params are compliant with API spec?

      let params = [];
      for (let i = 0; i < arguments.length; i++) {
        params.push(arguments[i]);
      }

      let msg = {
        header: {type: 'call', to: _this._url, comp: RemoteObject.NAME},
        body: {method: methodName, params: params}
      };

      let promise = new Promise((resolve, reject) => {
        _this._mb.send(msg, (replyMsg) => {
          if (replyMsg.body.code === 'error') {
            reject(replyMsg.body.desc);
          } else {
            //msg ok...
            resolve(replyMsg.body.value);
          }
        });
      });

      return promise;
    };
  }
}

RemoteObject.NAME = 'rpc';
