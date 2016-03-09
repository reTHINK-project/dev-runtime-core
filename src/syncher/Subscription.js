class Subscription {

  constructor(bus, hyperty, url, childrens) {
    let _this = this;
    let childBaseURL = url + '/children/';
    let changeURL = url + '/changes';

    //process delete message
    _this._deleteListener = bus.addListener(changeURL, (msg) => {
      if (msg.type === 'delete') {
        console.log('Subscription-DELETE: ', msg);
        let deleteMessageToHyperty = {
          type: 'delete', from: msg.from, to: hyperty,
          body: { resource: url }
        };

        //send delete to hyperty
        bus.postMessage(deleteMessageToHyperty, (reply) => {
          console.log('Subscription-DELETE-REPLY: ', reply);
          if (reply.body.code === 200) {
            _this._releaseListeners();
          }
        });
      }
    });

    //subscription accepted (add forward and subscription)
    _this._changeListener = bus.addForward(changeURL, hyperty);

    //add forward for children
    _this._childrenListeners = [];
    childrens.forEach((child) => {
      let childrenForward = bus.addForward(childBaseURL + child, hyperty);
      _this._childrenListeners.push(childrenForward);
    });
  }

  _releaseListeners() {
    let _this = this;

    _this._deleteListener.remove();
    _this._changeListener.remove();
    _this._childrenListeners.forEach((forward) => {
      forward.remove();
    });
  }

}

export default Subscription;
