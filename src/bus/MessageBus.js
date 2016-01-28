import MiniBus from './MiniBus';
/**
* Message BUS Interface is an extension of the MiniBus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/
class MessageBus extends MiniBus {
  /* private
  _registry: Registry
  _forwards: { <from-url>: { fl: MsgListener, sandboxToUrls: Map(Sandbox, [to-url]), urlToSandbox: { to-url: Sandbox } } }

  //_forwards: { <from-url>: { fl: MsgListener, destinations: [to-url] } }
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  constructor(registry) {
    super();
    this._registry = registry;
    this._forwards = {};
  }

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

    return new Promise((resolve) => {
      //add forward detination
      this._registry.getSandbox(to).then((sandbox) => {
        let urls = conf.sandboxToUrls.get(sandbox);
        if (!urls) {
          urls = new Set();
          conf.sandboxToUrls.set(sandbox, urls);
        }

        urls.add(to);
        conf.urlToSandbox.set(to, sandbox);

        resolve(conf);
      });
    });
  }

  /*
  addForward(from, to) {
    let _this = this;

    //verify if forward exist
    let conf = _this._forwards[from];
    if (!conf) {
      let forwardListener = _this.addListener(from, (msg) => {
        let resolves = new Set();
        conf.destinations.forEach((url) => {
          //resolve and forward for unique resolution...
          _this._registry.resolve(url).then((route) => {
            if (!resolves.has(route)) {
              console.log('MB-FORWARD: (' + from + ', ' + url + ', ' + route + ')');
              resolves.add(route);
              _this._publish(route, msg);
            } else {
              console.log('MB-FORWARD-IGNORE: (' + from + ', ' + url + ', ' + route + ')');
            }
          }).catch(function(e) {
            console.log('RESOLVE-ERROR: ', e);
          });

        });
      });

      //TODO: remove(url) -remove url destination, if destinations is empty, remove forward-
      conf = {
        from: from,
        fl: forwardListener,
        destinations: new Set()
      };

      _this._forwards[from] = conf;
    }

    //add new forward detination and return
    conf.destinations.add(to);
    return conf;
  }*/

  _publish(url, msg) {
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
      _this._publish(route, msg);
    }).catch(function(e) {
      console.log('RESOLVE-ERROR: ', e);
    });
  }
}

export default MessageBus;
