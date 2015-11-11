import MiniBus from '../bus/MiniBus';

/**
 * Implements the Sandbox interface to protect all external code;
 */
class SandboxBase extends MiniBus {

  constructor(messageBus) {
    super(messageBus);
  }

  /**
   * To download and deploy a new component in the sandbox passing as input parameters the url from where the components is downloaded, the componentURL address previously allocated to the component and its configuration.
   * @param  {URL.URL}        componentDownloadURL      Sourcecode Component address url
   * @param  {URL.URL}        componentURL              Component address url;
   * @param  {Object}         configuration             Configuration object;
   */
  deployComponent(componentSourceCode, componentURL, configuration) {

  }

  /**
   * To remove a component from the sandbox passing as input parameters its URL.
   * @param  {URL.URL}        componentURL              Component address url;
   */
  removeComponent(componentURL) {

  }

}

export default SandboxBase;
