/**
 * Implements the Sandbox interface to protect all external code;
 */
export default function SandboxFactory(sandbox, messageBus) {

  sandbox.messageBus = messageBus;

  /**
   * To download and deploy a new component in the sandbox passing as input parameters the url from where the components is downloaded, the componentURL address previously allocated to the component and its configuration.
   * @param  {URL.URL}        componentDownloadURL      Sourcecode Component address url
   * @param  {URL.URL}        componentURL              Component address url;
   * @param  {Object}         configuration             Configuration object;
   */
  sandbox.deployComponent = function(componentSourceCode, componentURL, configuration) {

    if (!componentSourceCode) throw new Error('Component source code parameter needed!');
    if (!componentURL) throw new Error('Component url parameter needed!');
    if (!configuration) throw new Error('Configuration parameter needed!');

    let _this = this;

    return new Promise(function(resolve, reject) {

      let messageBus = _this.messageBus;
      let sandbox = _this.sandbox;

      sandbox.postMessage({
        type: 'CREATE',
        sourceCode: componentSourceCode,
        componentURL: componentURL,
        configuration: configuration
      });

      sandbox.addEventListener('error', function(event) {
        reject(event);
      });

      sandbox.addEventListener('message', function(event) {
        messageBus.postMessage(event.data);
        resolve(event.data);
      });

    });

  };

  /**
   * To remove a component from the sandbox passing as input parameters its URL.
   * @param  {URL.URL}        componentURL              Component address url;
   */
  sandbox.removeComponent = function(componentURL) {

    //TODO: check the sandbox code and remove the respective component;
    if (!componentURL) throw new Error('Component URL parameter needed');

    let _this = this;

    return new Promise(function(resolve, reject) {

      let sandbox = _this.sandbox;
      let messageBus = _this.messageBus;

      sandbox.postMessage({
        type: 'REMOVE',
        componentURL: componentURL
      });

      sandbox.addEventListener('error', function(event) {
        reject(event);
      });

      sandbox.addEventListener('message', function(event) {
        messageBus.postMessage(event.data);
        resolve(event.data);
      });

    });

  };

  return sandbox;

}
