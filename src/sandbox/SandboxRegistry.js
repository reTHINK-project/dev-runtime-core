/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement internal deploy manager of components.
 */

// import MessageFactory from '../../resources/MessageFactory';

/**
 * @author micaelpedrosa@gmail.com
 * Internal component registry of all sandboxes.
 * Process internal request's for component deploy.
 */
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

    //FLOW-OUT: generic response message to external Sandbox (deploy and un-deploy responses)
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

  //FLOW-IN: message from the runtime core Sandbox -> deployComponent
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

  //FLOW-IN: message from the runtime core Sandbox -> removeComponent
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

SandboxRegistry.ExternalDeployAddress = 'hyperty-runtime://sandbox/external';
SandboxRegistry.InternalDeployAddress = 'hyperty-runtime://sandbox/internal';

export default SandboxRegistry;
