import Bus from './Bus';
import Pipeline from './Pipeline';
/**
* Message BUS Interface is an extension of the MiniBus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/
class MessageBus extends Bus {
  /* private
  _registry: Registry
  _forwards: { <from-url>: { fl: MsgListener, sandboxToUrls: Map(Sandbox, [to-url]), urlToSandbox: { to-url: Sandbox } } }

  _pipeline: Pipeline
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  constructor(registry) {
    super();
    this._registry = registry;
    this._forwards = {};

    this._pipeline = new Pipeline((error) => {
      console.log('PIPELINE-ERROR: ', JSON.stringify(error));
    });
  }

  get pipeline() { return this._pipeline; }

  postMessage(inMsg, responseCallback) {
    let _this = this;

    _this._genId(inMsg);

    _this._pipeline.process(inMsg, (msg) => {

      _this._responseCallback(inMsg, responseCallback);

      if (!_this._onResponse(msg)) {
        let itemList = _this._subscriptions[msg.to];
        if (itemList) {
          //do not publish on default address, because of loopback cycle
          _this._publishOn(itemList, msg);
        } else {
          //if there is no listener, send to external interface
          _this._onPostMessage(msg);
        }
      }
    });

    return inMsg.id;
  }

  /*
  addForward(from, to) {
    let _this = this;

    //verify if forward exist
    let conf = _this._forwards[from];
    if (!conf) {
      let forwardListener = _this.addListener(from, (msg) => {
        conf.sandboxToUrls.forEach((urls, sandbox) => {
          console.log('MB-FORWARD: ( ' + from + ' to ' + urls.size + ' destinations)');
          urls.forEach((value) => { console.log('SEND-TO: ', value); });

          sandbox.postMessage(msg);
        });
      });

      conf = {
        from: from,
        fl: forwardListener,
        sandboxToUrls: new Map(),
        urlToSandbox: new Map(),

        //remove forward detination
        remove: (url) => {
          let sandbox = this.urlToSandbox.get(url);
          if (sandbox) {
            this.urlToSandbox.delete(url);
            this.sandboxToUrls.get(sandbox).delete(url);
          }
        }
      };

      _this._forwards[from] = conf;
    }

    //add forward detination
    this._registry.getSandbox(to).then((sandbox) => {
      let urls = conf.sandboxToUrls.get(sandbox);
      if (!urls) {
        urls = new Set();
        conf.sandboxToUrls.set(sandbox, urls);
      }

      urls.add(to);
      conf.urlToSandbox.set(to, sandbox);
    });

    return conf;
  }
  */

 addPublish(from) {
   let _this = this;

   return _this.addListener(from, (msg) => {
     console.log('MB-PUBLISH: ( ' + from + ' )');
     _this._onPostMessage(msg);
   });
 }

 addForward(from, to) {
   let _this = this;

   return _this.addListener(from, (msg) => {
     console.log('MB-FORWARD: ( ' + from + ' to ' + to + ' )');
     _this.forward(to, msg);
   });
 }

 forward(url, msg) {
    let _this = this;

    let itemList = _this._subscriptions[url];
    if (itemList) {
      _this._publishOn(itemList, msg);
    }
  }

  _onPostMessage(msg) {
    let _this = this;

    //resolve external protostub...
    _this._registry.resolve(msg.to).then((route) => {
      _this.forward(route, msg);
    }).catch(function(e) {
      console.log('RESOLVE-ERROR: ', e);
    });
  }
}

export default MessageBus;
