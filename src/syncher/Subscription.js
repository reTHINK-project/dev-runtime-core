class Subscription {

  constructor(bus, owner, url, childrens, isReporter) {
    let _this = this;
    let childBaseURL = url + '/children/';
    let changeURL = url + '/changes';

    //process delete message
    _this._deleteListener = bus.addListener(changeURL, (msg) => {
      if (msg.type === 'delete') {
        console.log('Subscription-DELETE: ', msg);

        //FLOW-OUT: message sent to all subscribers
        let deleteMessageToHyperty = {
          type: 'delete', from: msg.from, to: owner,
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

    //add change publish address or forward
    if (isReporter) {
      _this._changeListener = bus.addPublish(changeURL);
    } else {
      _this._changeListener = bus.addForward(changeURL, owner);
    }

    _this._childrenListeners = [];
    childrens.forEach((child) => {
      let childId = childBaseURL + child;

      //add children publish address
      let childrenForward = bus.addPublish(childId);
      _this._childrenListeners.push(childrenForward);

      //add self forward if an observer
      if (!isReporter) {
        let selfForward = bus.addForward(childId, owner);
        _this._childrenListeners.push(selfForward);
      }
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
