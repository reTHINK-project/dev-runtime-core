/**
 * Sandbox Type
 * @type {Object}
 */
export const SandboxType = {Protostub: 'Protostub', Hyperty: 'Hyperty', Interceptor: 'Interceptor', Applicaion: 'Applicaion'};

/**
 * Implements the Sandbox interface to protect all external code;
 */
export class Sandbox {

  /**
   * Constructor to instantiate a sandbox passing as input parameter the sandbox Type (Protostub, Hyperty, Interceptor and Applicaion) Message Bus instance that the sandbox will use to send messages to components outside the sandbox.
   * @param  {type}      sandboxType Describe type of sandbox;
   * @param  {msgbus}    messageBus  Describe the message bus to be used;
   */
  constructor(sandboxType, messageBus) {

    let _this = this;

    _this.sandboxType = sandboxType;
    _this.messageBus = messageBus;

    try {

      let blob = new Blob([SandboxCode], {type: 'text/javascript'});
      var blobURL = window.URL.createObjectURL(blob);
      let worker = new Worker(blobURL);

      _this.worker = worker;

    } catch (e) {
      new Throw('Your environment does not support worker \n', e);
    }
  }

  /**
   * To download and deploy a new component in the sandbox passing as input parameters the url from where the components is downloaded, the componentURL address previously allocated to the component and its configuration.
   * @param  {URL.URL}        componentDownloadURL      Sourcecode Component address url
   * @param  {URL.URL}        componentURL              Component address url;
   * @param  {Object}         configuration             Configuration object;
   */
  deployComponent(componentDownloadURL, componentURL, configuration) {

    let _this = this;
    let sandboxType = _this.sandboxType;
    let messageBus = _this.messageBus;
    let worker = _this.worker;

    worker.postMessage({
      url: componentDownloadURL,
      configuration: configuration
    });

    worker.addEventListener('message', function(event) {

      let message = {
        header: {
          id: '1',
          type: 'UPDATE',
          from: 'hyperty-runtime://sp1/protostub/123',
          to: componentURL
        },
        body: {
          value: 'LIVE'
        }
      };

      messageBus.postMessage(message);
    });

  }

  /**
   * To remove a component from the sandbox passing as input parameters its URL.
   * @param  {URL.URL}        componentURL              Component address url;
   */
  removeComponent(componentURL) {
    // removeComponent
  }

}

const SandboxCode = 'onmessage = function(e) { console.log("message: ", e.data); }';
