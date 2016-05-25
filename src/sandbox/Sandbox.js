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
import SandboxRegistry from '../sandbox/SandboxRegistry';
import MiniBus from '../bus/MiniBus';
// import MessageFactory from '../../resources/MessageFactory';

export let SandboxType = {APP: 'app', NORMAL: 'normal'};

/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement external sandbox component
 */
class Sandbox extends MiniBus {

  constructor() {

    super();

    let _this = this;

    // Add Message Factory
    // let messageFactory = new MessageFactory();
    // _this.messageFactory = messageFactory;
  }

  /**
   * Deploy an instance of the component into the sandbox.
   * @param  {string} componentSourceCode Component source code (Hyperty, ProtoStub, etc)
   * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
   * @param  {Config} configuration Config parameters of the component
   * @return {Promise<string>} return deployed if successful, or any other string with an error
   */
  deployComponent(componentSourceCode, componentURL, configuration) {

    let _this = this;

    // let messageFactory = _this.messageFactory;

    return new Promise((resolve, reject) => {
      //FLOW-OUT: deploy message for the internal SandboxRegistry -> _onDeploy
      let deployMessage = {
        type: 'create', from: SandboxRegistry.ExternalDeployAddress, to: SandboxRegistry.InternalDeployAddress,
        body: { url: componentURL, sourceCode: componentSourceCode, config: configuration }
      };

      //send message into the sandbox internals and wait for reply
      _this.postMessage(deployMessage, (reply) => {
        if (reply.body.code === 200) {
          //is this response complaint with the spec?
          resolve('deployed');
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }

  /**
   * Remove the instance of a previously deployed component.
   * @param  {URL} componentURL Hyperty, ProtoStub, or any other component address.
   * @return {Promise<string>} return undeployed if successful, or any other string with an error
   */
  removeComponent(componentURL) {
    let _this = this;

    return new Promise((resolve, reject) => {
      //FLOW-OUT: un-deploy message for the internal SandboxRegistry -> _onRemove
      let removeMessage = {
        type: 'delete', from: SandboxRegistry.ExternalDeployAddress, to: SandboxRegistry.InternalDeployAddress,
        body: { url: componentURL }
      };

      //send message into the sandbox internals and wait for reply
      _this.postMessage(removeMessage, (reply) => {
        if (reply.body.code === 200) {
          //is this response complaint with the spec?
          resolve('undeployed');
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }
}

export default Sandbox;
