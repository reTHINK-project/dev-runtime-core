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
      let responseMsg = {
        id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
      };

      switch (msg.type) {
        case 'create': _this._onDeploy(responseMsg, msg.body.url, msg.body.sourceCode, msg.body.config); break;
        case 'delete': _this._onRemove(responseMsg, msg.body.url); break;
      }
    });
  }

  get components() { return this._components; }

  _onDeploy(responseMsg, url, sourceCode, config) {
    let _this = this;

    if (!_this._components.hasOwnProperty(url)) {
      try {
        _this._components[url] = _this._create(url, sourceCode, config);
        responseMsg.body = { code: 200 };
      } catch (error) {
        responseMsg.body = { code: 500, desc: error };
      }
    } else {
      responseMsg.body = { code: 500, desc: 'Instance ' + url + ' already exist!' };
    }

    _this._bus.postMessage(responseMsg);
  }

  _onRemove(responseMsg, url) {
    let _this = this;

    if (_this._components.hasOwnProperty(url)) {
      //remove component from the pool and all listeners
      delete _this._components[url];
      _this._bus.removeAllListenersOf(url);
      responseMsg.body = { code: 200 };
    } else {
      responseMsg.body = { code: 500, desc: 'Instance ' + url + ' doesn\'t exist!' };
    }

    _this._bus.postMessage(responseMsg);
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
