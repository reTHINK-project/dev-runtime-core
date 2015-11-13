/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement internal deploy manager of components.
 */
class SandboxRegistry {
  /* private
  _components: <url: instance>
  */

  constructor(bus) {
    let _this = this;

    _this._bus = bus;
    _this._components = {};

    bus.addListener(SandboxRegistry.InternalDeployAddress, (msg) => {
      //console.log('SandboxRegistry-RCV: ', msg);
      let replyMsg = {
        header: { id: msg.header.id, type: 'reply', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress }
      };

      switch (msg.header.type) {
        case 'CREATE': _this._onDeploy(replyMsg, msg.body.url, msg.body.sourceCode, msg.body.config); break;
        case 'REMOVE': _this._onRemove(replyMsg, msg.body.url); break;
      }
    });
  }

  get components() { return this._components; }

  _onDeploy(replyMsg, url, sourceCode, config) {
    let _this = this;

    if (!_this._components.hasOwnProperty(url)) {
      try {
        _this._components[url] = _this._create(url, sourceCode, config);
        replyMsg.body = { code: 'ok' };
      } catch (error) {
        replyMsg.body = { code: 'error', desc: error };
      }
    } else {
      replyMsg.body = { code: 'error', desc: 'Instance ' + url + ' already exist!' };
    }

    _this._bus.postMessage(replyMsg);
  }

  _onRemove(replyMsg, url) {
    let _this = this;

    if (_this._components.hasOwnProperty(url)) {
      //remove component from the pool and all listeners
      delete _this._components[url];
      _this._bus.removeAllListenersOf(url);
      replyMsg.body = { code: 'ok' };
    } else {
      replyMsg.body = { code: 'error', desc: 'Instance ' + url + ' doesn\'t exist!' };
    }

    _this._bus.postMessage(replyMsg);
  }

  /**
   * This method should be implemented by the internal sandbox code.
   * @param  {ComponentURL} url URL used for the instance
   * @param  {string} sourceCode Code of the component
   * @param  {Config} config Configuration parameters
   * @return {Object} Returns instance of the component or throw an error "throw 'error message'"
   */
  _create(url, sourceCode, config) {
    //implementation specific
    /* example code:
      eval(sourceCode);
      return activate(url, _this._bus, config);
    */
  }
}

SandboxRegistry.ExternalDeployAddress = 'sandbox://external';
SandboxRegistry.InternalDeployAddress = 'sandbox://internal';

export default SandboxRegistry;
