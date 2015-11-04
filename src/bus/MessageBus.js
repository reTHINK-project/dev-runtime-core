import MiniBus from './MiniBus';
/**
* Message BUS Interface is an extension of the MiniBus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/
class MessageBus extends MiniBus {
  /* private
  _registry: Registry
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  constructor(registry) {
    super();
    this._registry = registry;
  }

  _onPostMessage(msg) {
    let _this = this;

    //resolve external protostub...
    _this._registry.resolve(msg.header.to).then((protoStubURL) => {
      let itemList = _this._subscriptions[protoStubURL];
      if (itemList) {
        _this._publishOn(itemList, msg);
      }
    }).catch(function(e) {
      console.log('PROTO-STUB-ERROR: ', e);
    });
  }
}

export default MessageBus;
