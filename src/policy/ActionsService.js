class ActionsService {

  constructor(context) {
    this.context = context;
  }

  enforcePolicies(message, authDecision, isIncomingMessage) {
    let _this = this;
    return new Promise((resolve, reject) => {

      let policies = _this.context.getPolicies(message, isIncomingMessage);
      if (policies !== undefined) {
        if (policies.userPolicy !== undefined) {
          policies.userPolicy.enforceActions(_this.context, message, authDecision).then(messages => {
            resolve(messages);
          }, (error) => {
            reject(error);
          });
        } else {
          resolve([message]);
        }
      } else {
        resolve([message]);
      }
    });
  }

  forwardToID(message, email) {
    let _this = this;
    return new Promise((resolve, reject) => {
      if (_this.context.runtimeRegistry.hypertiesList[0].hypertyURL === message.to) {
        let splitTo = (message.to).split('://');
        if (splitTo[0] !== 'runtime') {
          _this.context.runtimeRegistry.discoverHypertyPerUser(email).then(result => {
            message.to = result.hypertyURL;
            message.body.via = undefined;
            reject(message); // TODO: resolve if authorise = true?
            _this.context.runtimeRegistry._messageBus.postMessage(message);
          }, (error) => {
            reject(error);
          });
        } else {
          resolve(message);
        }
      } else {
        resolve(message);
      }
    });
  }

  forwardToHyperty(message, hypertyURL) {
    let _this = this;
    return new Promise((resolve) => {
      if (_this.context.runtimeRegistry.hypertiesList[0].hypertyURL === message.to) {
        let splitTo = (message.to).split('://');
        if (splitTo[0] !== 'runtime') {
          message.to = hypertyURL;
          message.body.via = undefined;
          resolve(message);
          _this.context.runtimeRegistry._messageBus.postMessage(message);
        } else {
          resolve(message);
        }
      } else {
        resolve(message);
      }
    });
  }

  //sendAutomaticMessage() {}

}

export default ActionsService;
