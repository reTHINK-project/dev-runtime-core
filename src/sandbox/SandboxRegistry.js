/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement internal deploy manager of components.
 */

// import MessageFactory from '../../resources/MessageFactory';

class SandboxRegistry {
  /* private
  _components: <url: instance>
  */

  constructor(bus) {
    let _this = this;

    _this._bus = bus;
    _this._components = {};

    // Add Message Factory
    // let messageFactory = new MessageFactory();
    // _this.messageFactory = messageFactory;

    bus.addListener(SandboxRegistry.InternalDeployAddress, (msg) => {
      //console.log('SandboxRegistry-RCV: ', msg);
      // let responseMsg = {
      //   id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
      // };

      switch (msg.type) {
        case 'create': _this._onDeploy(msg); break;
        case 'delete': _this._onRemove(msg); break;
      }
    });
  }

  get components() { return this._components; }

  _responseMsg(msg, code, value) {

    let _this = this;

    // let messageFactory = _this.messageFactory;

    let responseMsg = {
      id: msg.id, type: 'response', from: SandboxRegistry.InternalDeployAddress, to: SandboxRegistry.ExternalDeployAddress
    };

    // Chanege the origin message, because the response;
    // msg.from = SandboxRegistry.InternalDeployAddress;
    // msg.to = SandboxRegistry.ExternalDeployAddress;

    let body = {};
    if (code) body.code = code;
    if (value) body.desc = value;

    responseMsg.body = body;

    // return messageFactory.createResponse(msg, code, value);
    return responseMsg;
  }

  _onDeploy(msg) {
    let _this = this;
    let config = msg.body.config;
    let componentURL = msg.body.url;
    let sourceCode = msg.body.sourceCode;
    let responseCode;
    let responseDesc;

    if (!_this._components.hasOwnProperty(componentURL)) {
      try {
        _this._components[componentURL] = _this._create(componentURL, sourceCode, config);
        responseCode = 200;
      } catch (error) {
        responseCode = 500;
        responseDesc = error;
      }
    } else {
      responseCode = 500;
      responseDesc = 'Instance ' + componentURL + ' already exist!';
    }

    // Create response message with MessageFactory
    let responseMsg = _this._responseMsg(msg, responseCode, responseDesc);
    _this._bus.postMessage(responseMsg);
  }

  _onRemove(msg) {
    let _this = this;
    let componentURL = msg.body.url;
    let responseCode;
    let responseDesc;

    if (_this._components.hasOwnProperty(componentURL)) {
      //remove component from the pool and all listeners
      delete _this._components[componentURL];
      _this._bus.removeAllListenersOf(componentURL);
      responseCode = 200;
    } else {
      responseCode = 500;
      responseDesc = 'Instance ' + componentURL + ' doesn\'t exist!';
    }

    let responseMsg = _this._responseMsg(msg, responseCode, responseDesc);

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
