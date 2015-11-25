import SandboxRegistry from '../sandbox/SandboxRegistry';
import MiniBus from '../bus/MiniBus';
import MessageFactory from '../../resources/MessageFactory';

/**
 * @author micaelpedrosa@gmail.com
 * Base class to implement external sandbox component
 */
class Sandbox extends MiniBus {

  constructor() {

    super();

    let _this = this;

    // Add Message Factory
    let messageFactory = new MessageFactory();
    _this.messageFactory = messageFactory;
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
    let messageFactory = _this.messageFactory;

    return new Promise((resolve, reject) => {
      //TODO: message format is not properly defined yet
      // let deployMessage = {
      //   type: 'create', from: SandboxRegistry.ExternalDeployAddress, to: SandboxRegistry.InternalDeployAddress,
      //   body: { url: componentURL, sourceCode: componentSourceCode, config: configuration }
      // };

      // createMessageRequest(from, to, contextId, value, policy, idToken, accessToken, resource, signature)
      let deployMessage = messageFactory.createMessageRequest(SandboxRegistry.ExternalDeployAddress, SandboxRegistry.InternalDeployAddress, 'deploy', {url: componentURL, sourceCode: componentSourceCode, config: configuration});

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
      //TODO: message format is not properly defined yet
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
