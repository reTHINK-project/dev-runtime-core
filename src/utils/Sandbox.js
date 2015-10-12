/**
 * Implements the Sandbox interface to protect all external code;
 */
export default class Sandbox {

  /**
   * Constructor to instantiate a sandbox passing as input parameter the Message Bus instance that the sandbox will use to send messages to components outside the sandbox.
   * @param  {msgbus}    messageBus  Describe the message bus to be used;
   */
  constructor(messageBus) {

    let _this = this;

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

    return new Promise(function(resolve, reject) {

      let messageBus = _this.messageBus;
      let worker = _this.worker;

      worker.postMessage({
        url: componentDownloadURL,
        configuration: configuration
      });

      worker.addEventListener('error', function(event) {
        let message = _this._message(componentURL, event.message);
        reject(message);
      });

      worker.addEventListener('message', function(event) {
        let message = _this._message(componentURL, event.data);
        messageBus.postMessage(message);
        resolve(message);

      });

    });

  }

  _message(componentURL, value) {
    let message = {
      header: {
        id: '1',
        type: 'UPDATE',
        from: 'hyperty-runtime://sp1/protostub/123',
        to: componentURL
      },
      body: {
        value: value
      }
    };

    return message;
  }

  /**
   * To remove a component from the sandbox passing as input parameters its URL.
   * @param  {URL.URL}        componentURL              Component address url;
   */
  removeComponent(componentURL) {
    // removeComponent
  }

}

const SandboxCode = 'self.addEventListener("message", function(event) { if (event.data.url) { importScripts(event.data.url); postMessage("The module has been loaded."); } else { postMessage("You don\'t provide any component Download URL;") } }); self.addEventListener("error", function(event) { postMessage("An error has occurred when we try downloading: " + event.data); })';