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

      console.log('here!');
      let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: {value: msg.body.value +  '-changed'}};

      // to test on the identity side the listener without the timeout
      // can represent the time the user takes to choose and identity
      if (msg.body.value === 'wait') {

        setTimeout(() => {
          _this._messageBus.postMessage(replyMsg);
        }, _this._waitTime);
      } else {
        _this._messageBus.postMessage(replyMsg);
      }
    });
  }

}

export default GuiFake;
