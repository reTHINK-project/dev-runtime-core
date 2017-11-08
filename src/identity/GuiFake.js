/**
* fake class for the gui to select the identity,
* TODO replace with the proper identity GUI
*
*/
class GuiFake {

  constructor(url, messageBus) {
    let _this = this;

    _this._url = url;
    _this._waitTime = 10000;
    _this._messageBus = messageBus;

    _this._messageBus.addListener(_this._url, msg => {

      if (msg.hasOwnProperty('type') &&
          msg.type === 'create' &&
          msg.body.hasOwnProperty('value') &&
          msg.body.value.hasOwnProperty('identities') &&
          msg.body.value.hasOwnProperty('idps')) {

        let identities = msg.body.value.identities;
        let idps = msg.body.value.idps;

        let value;

        if (identities[0] !== undefined) {
          value = {type: 'identity', value: identities[0], code: 200};
        } else {
          value = {type: 'idp', value: idps[0].domain, code: 200};
        }

        let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};

        // to test on the identity side the listener without the timeout
        // can represent the time the user takes to choose and identity
        if (msg.body.value === 'wait') {

          setTimeout(() => {
            _this._messageBus.postMessage(replyMsg);
          }, _this._waitTime);
        } else {
          _this._messageBus.postMessage(replyMsg);
        }
      } else {
        // console.log('Ignoring messages not intended to FakeGUI.', msg );
      }
    });
  }

}

export default GuiFake;
