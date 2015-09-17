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
    let _self = this;

    _self._open(() => {
      _self._sock.send(JSON.stringify(msg));
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
    let _self = this;

    if (_self._sock.readyState === 1) {
      callback();
    } else {
      setTimeout(() => {
        _self._waitReady(callback);
      });
    }
  }

  _open(callback) {
    let _self = this;

    if (!_self._sock) {
      if (_self._msgNodeURL.substring(0, 2) === 'ws') {
        _self._sock = new WebSocket(_self._msgNodeURL);
      } else {
        _self._sock = new SockJS(_self._msgNodeURL);
      }

      _self._sock.onopen = function() {
        console.log('OPEN');
        callback();
      };

      _self._sock.onmessage = function(e) {
        var msg = JSON.parse(e.data);
        if (_self._msgCallback) {
          _self._msgCallback(msg);
        }
      };

      _self._sock.onclose = function() {
        console.log('CLOSE');
        delete _self._sock;
      };
    } else {
      _self._waitReady(callback);
    }
  }
}
