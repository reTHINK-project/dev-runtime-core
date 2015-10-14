/**
 * Implements the Sandbox interface to protect all external code;
 */
class Sandbox {

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
  deployComponent(componentSourceCode, componentURL, configuration) {

    let _this = this;

    return new Promise(function(resolve, reject) {

      let messageBus = _this.messageBus;
      let worker = _this.worker;

      worker.postMessage({
        sourceCode: componentSourceCode,
        componentURL: componentURL,
        configuration: configuration
      });

      worker.addEventListener('error', function(event) {
        reject(event);
      });

      worker.addEventListener('message', function(event) {
        messageBus.postMessage(event.data);
        resolve(event.data);
      });

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

const SandboxCode = 'self.addEventListener("message", function(event) { if (event.data.sourceCode) { eval(event.data.sourceCode); postMessage({header: {}, body: {value: "deployed", desc: "The component has been loaded."}}); } else { postMessage({header: {}, body: {value: "error", desc: "You don\'t provide any source code;"}}); } var callback = function(msg) { console.log("callback msg: ", msg); postMessage(msg); }; self.protoStub = new VertxProtoStub.VertxProtoStub(event.data.componentURL, callback, event.data.configuration); self.protoStub.connect(); }); self.addEventListener("error", function(event) { postMessage({header: {}, body: {value: "error", desc: "An error has occurred when we try downloading: " + event.data}}); });';

export default Sandbox;
