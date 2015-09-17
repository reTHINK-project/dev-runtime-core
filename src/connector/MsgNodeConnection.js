export default class MsgNodeConnection {
  /* private
    _msgNodeURL: string
    _sock: any
    _msgCallback: (Message) => void
  */

  constructor(msgNodeURL) {
    this._msgNodeURL = msgNodeURL;
  }

  get url() { return this._msgNodeURL; }

  send(msg) {
    let _this = this;

    _this._open(() => {
      _this._sock.send(JSON.stringify(msg));
    });
  }

  onMessage(callback) {
    this._msgCallback = callback;
  }

  close() {
    if (this._sock) {
      this._sock.close();
    }
  }

  _waitReady(callback) {
    let _this = this;

    if (_this._sock.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        _this._waitReady(callback);
      });
    }
  }

  _open(callback) {
    let _this = this;

    if (!_this._sock) {
      if (_this._msgNodeURL.substring(0, 2) === 'ws') {
        _this._sock = new WebSocket(_this._msgNodeURL);
      } else {
        _this._sock = new SockJS(_this._msgNodeURL);
      }

      _this._sock.onopen = function() {
        console.log('OPEN');
        callback();
      };

      _this._sock.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        if (_this._msgCallback) {
          _this._msgCallback(msg);
        }
      };

      _this._sock.onclose = function() {
        console.log('CLOSE');
        delete _this._sock;
      };
    } else {
      _this._waitReady(callback);
    }
  }
}
