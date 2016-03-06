/**
* Identity Provider Proxy Protocol Stub
*/
class IdpProxyStub {

  /**
  * Constructor of the IdpProxy Stub
  * The constructor add a listener in the messageBus received and start a web worker with the idpProxy received
  *
  * @param  {messageBus}      messageBus
  * @param  {domain}          Domain
  * @param  {idpProxy}    identity Provider Proxy javascript file
  */
  constructor(messageBus, domain, idpProxy) {
    let _this = this;
    _this.messageBus = messageBus;
    _this.domain = domain;
    _this.idpProxy = idpProxy;

    _this.messageBus.addListener('domain://' + idpProxy, function(msg) {
      _this.requestToIdp(msg);
    });

    //start the web worker with the idpProxy
    _this.start(idpProxy);
  }

  /**
  * Function that see the intended method in the message received and call the respective function
  *
  * @param {message}  message received in the messageBus
  */
  requestToIdp(msg) {
    let _this = this;
    let params = msg.body.params;
    switch (msg.body.method) {
      case 'login':
        _this.login().then(function(value) { _this.replyMessage(msg, value);});
        break;
      case 'generateAssertion':
        _this.generate(params).then(function(value) { _this.replyMessage(msg, value);});
        break;
      case 'validateAssertion':
        _this.validate(params).then(function(value) { _this.replyMessage(msg, value);});
        break;
      default:
        break;
    }
  }

  /**
  * Starts a web worker with the idpProxy javascipt file
  *
  * @param  {idpProxy}    identity Provider Proxy javascript file
  */
  start(idpProxy) {
    let _this = this;
    if (window.Worker) { //check if the browser supports the worker API

      let myWorker = new Worker('/src/identity/IdpProxy.js');
      _this.myWorker = myWorker;
      _this.myWorker.postMessage(['create','IdpProxy']);

    } else {
      return 'error';
    }
  }

  /**
  * function that makes a request for an identity assertion to the web worker running the idpProxy
  *
  * @param  {params}  parameters received in the message. In this case contains the content, origin and usernamehint
  * @return {Promise} returns a promise with an identity assertion generate by the idpProxy
  */
  generate(params) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      if (window.Worker) { //check if the browser supports the worker API

        _this.myWorker.postMessage(['generate', params]);

        _this.myWorker.onmessage = function(e) {
          resolve(e.data);
          console.log('Message received from worker', e.data);
        };
      } else {
        reject('error');
      }
    });
  }

  /**
  * function that makes a request to validate an identity assertion to the web worker running the idpProxy
  *
  * @param  {params}  parameters received in the message. In this case contains the identity assertion and origin
  * @return {Promise} returns a promise with the identity assertion validation result, received by the idpProxy
  */
  validate(params) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      if (window.Worker) { //check if the browser supports the worker API

        _this.myWorker.postMessage(['validate',params]);

        _this.myWorker.onmessage = function(e) {
          resolve(e.data);
          console.log('Message received from worker', e.data);
        };
      } else {
        reject('error');
      }
    });
  }

  /**
  * function that makes a request for a user identity to the web worker running the idpProxy
  *
  * @param  {params}  parameters received in the message. In this case contains the login scope
  * @return {Promise} returns a promise an URL so the Identity Module can use to obtain an identity
  */
  login(params) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      if (window.Worker) { //check if the browser supports the worker API

        _this.myWorker.postMessage(['obtain', params]);

        _this.myWorker.onmessage = function(e) {
          resolve(e.data);
          console.log('Message received from worker', e.data);
        };
      } else {
        reject('error');
      }
    });
  }

  /**
  * This function receives a message and a value. It replies the value to the sender of the message received
  *
  * @param  {message}   message received
  * @param  {value}     value to include in the new message to send
  */
  replyMessage(msg, value) {
    let _this = this;

    let message = {id: msg.id, type: 'response', to: msg.from, from: msg.to,
                   body: {code: 200, value: value}};

    _this.messageBus.postMessage(message);
  }
}

export default IdpProxyStub;
