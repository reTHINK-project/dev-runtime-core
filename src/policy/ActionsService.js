class ActionsService {

  constructor(context) {
    this.context = context;
  }

  enforcePolicies(message, isIncomingMessage) {
    let _this = this;
    return new Promise((resolve, reject) => {

      let policies = _this.context.getPolicies(message, isIncomingMessage);

      if (policies !== undefined) {
        if (policies.serviceProviderPolicy !== undefined) {
          policies.serviceProviderPolicy.enforceActions(_this.context, message).then(messages => {
            resolve(messages);
          }, (error) => {
            reject(error);
          });
        } else {
          if (policies.userPolicy !== undefined) {
            policies.userPolicy.enforceActions(_this.context, message).then(messages => {
              resolve(messages);
            }, (error) => {
              reject(error);
            });
          } else {
            resolve([message]);
          }
        }
      } else {
        resolve([message]);
      }
    });
  }

  forwardToID(message, email) {
    let _this = this;
    if (!_this.context.runtimeRegistry) throw new Error('forward message to given ID is unsupported in this environment');

    return new Promise((resolve, reject) => {
      if (_this.context.runtimeRegistry.hypertiesList[0].hypertyURL === message.to) {
        let splitTo = (message.to).split('://');
        if (splitTo[0] !== 'runtime') {
          _this.context.runtimeRegistry.discoverHypertyPerUser(email).then(result => {
            message.to = result.hypertyURL;
            message.body.via = undefined;
            resolve(message);
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
    if (!_this.context.runtimeRegistry) throw new Error('forward message to given ID is unsupported in this environment');

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

  sendAutomaticMessage(message, text) {
    let _this = this;
    return new Promise((resolve) => {
      let automaticMessage = {
        from: message.to,
        to: message.from,
        body: {
          value: text
        },
        type: message.type
      };
      resolve(message);
      _this.context.runtimeRegistry._messageBus.postMessage(automaticMessage);
    });
  }

}

export default ActionsService;
