import CommonCtx from './CommonCtx';
import {divideURL, isDataObjectURL} from '../../utils/utils';

class RuntimeCoreCtx extends CommonCtx {

  constructor(idModule, runtimeRegistry) {
    super();
    let _this = this;
    _this.idModule = idModule;
    _this.runtimeRegistry = runtimeRegistry;
  }

  loadPolicies() {
    let _this = this;

    if (!_this.subsPolicies) {
      let policy = {
        scope: 'global',
        condition: 'subscription equals *',
        authorise: true,
        actions: [{method: 'registerSubscriber'}, {method:'doMutualAuthentication'}]
      };
      _this.subsPolicies = {};
      _this.subsPolicies[policy.scope] = policy;
    }

    return {};
  }

  _isFromRemoteSM(from) {
    let _this = this;
    let splitFrom = from.split('://');
    return splitFrom[0] === 'runtime' && from !== _this.runtimeRegistry.runtimeURL + '/sm';
  }

  /**
  * Returns the policies associated with a scope.
  * @param   {String} scope
  * @return  {Array}  policies
  */
  getApplicablePolicies(message) {
    let _this = this;
    let myPolicies = _this.policies;
    let policies = [];

    if (message.type === 'subscribe' && _this._isFromRemoteSM(message.from)) {
      let dataObject = message.body.resource;
      if (_this.subsPolicies[dataObject]) {
        policies.push(_this.subsPolicies[dataObject]);
      } else {
        let hypertyName = _this.runtimeRegistry.getHypertyName(_this._getURL(message.to));
        if (_this.subsPolicies[hypertyName]) {
          policies.push(_this.subsPolicies[hypertyName]);
        } else {
          //TODO: change name
          let hyperty = _this.runtimeRegistry.getReporterURLSynchonous(_this._getURL(message.to));
          let owner = _this.runtimeRegistry.getHypertyOwner(hyperty);
          if (_this.subsPolicies[owner]) {
            policies.push(_this.subsPolicies[owner]);
          } else {
            policies.push(_this.subsPolicies.global);
          }
        }
      }
    }
    /*let id = message.body.identity.userProfile.username;
    let hypertyName = _this.runtimeRegistry.getHypertyName(message.from);

    if (myPolicies[id] !== undefined) {
      policies.push.apply(policies, myPolicies[id]);
    }

    if (myPolicies[hypertyName] !== undefined) {
      policies.push.apply(policies, myPolicies[hypertyName]);
    }

    if (myPolicies.global !== undefined) {
      policies.push.apply(policies, myPolicies.global);
    }*/

    for (let i in myPolicies) {
      policies.push.apply(policies, myPolicies[i]);
    }

    return policies;
  }

  authorise(message) {
    let _this = this;

    return new Promise((resolve, reject) => {
      console.log('--- Policy Engine ---');
      console.log(message);
      message.body = message.body || {};
      let result;
      let isToVerify = _this.isToVerify(message);
      let isIncomingMessage = _this._isIncomingMessage(message);
      let isToCypher = _this._isToCypherModule(message);
      if (isToVerify) {
        if (isIncomingMessage) {
          if (isToCypher) {
            _this.decrypt(message).then(message => {
              result = _this.applyPolicies(message);
              let messageAccepted = result.policiesResult[0];
              message = result.message;
              if (messageAccepted) {
                resolve(message);
              } else {
                reject('Message blocked');
              }
            }, (error) => { reject(error); });

          } else {
            result = _this.applyPolicies(message);
            let messageAccepted = result.policiesResult[0];
            message = result.message;
            if (messageAccepted) {
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        } else {
          let isToSetID = _this._isToSetID(message);
          if (isToSetID) {
            _this.getIdentity(message).then(identity => {
              message.body.identity = identity;
              result = _this.applyPolicies(message);
              let messageAccepted = result.policiesResult[0];
              message = result.message;
              if (messageAccepted) {
                if (isToCypher) {
                  _this.encrypt(message).then(message => {
                    resolve(message);
                  }, (error) => { reject(error); });
                } else {
                  resolve(message);
                }
              } else {
                reject('Message blocked');
              }
            }, (error) => { reject(error); });
          } else {
            result = _this.applyPolicies(message);
            let messageAccepted = result.policiesResult[0];
            message = result.message;
            if (messageAccepted) {
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        }
      } else {
        resolve(message);
      }
    });
  }

  _isToSetID(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];

    return schemasToIgnore.indexOf(fromSchema) === -1;
  }

  set group(params) {
    let _this = this;
    if (params.group === 'preauthorised') {
      let dataObjectURL = params.destination.split('/');
      dataObjectURL.pop();
      dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2];
      _this.groupAttribute = _this.runtimeRegistry.getPreAuthSubscribers(dataObjectURL);
    } else {
      _this.groupAttribute = _this._getList(params.scope, params.group);
    }
  }

  set subscription(params) {
    let _this = this;
    _this.subscriptionAttribute = params.message.body.subscriber;
  }

  get group() {
    let _this = this;
    return _this.groupAttribute;
  }

  get subscription() {
    let _this = this;
    return _this.subscriptionAttribute;
  }

  _isIncomingMessage(message) {
    return (message.body.identity) ? true : false;
  }

  _getURL(url) {
    let splitURL = url.split('/');
    return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
  }

  //TODO: verify if is hyperty or data object
  getIdentity(message) {
    let _this = this;

    if (message.type === 'update') {
      return _this.idModule.getIdentityOfHyperty(message.body.source);
    }

    if (message.type === 'response' && message.body.source !== undefined) {
      return _this.idModule.getIdentityOfHyperty(message.body.source);
    }

    console.log('divideURL(from).type');
    console.log(divideURL(message.from).type);
    if (divideURL(message.from).type === 'hyperty') {
      console.log('in if');
      console.log('getting identity of ' + message.from);
      return _this.idModule.getIdentityOfHyperty(message.from);
    } else {
      console.log('in else');
      console.log('getting identity of ' + _this._getURL(message.from));
      return _this.idModule.getIdentityOfHyperty(_this._getURL(message.from));
    }
  }

  isToVerify(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    let splitTo = (message.to).split('://');
    let toSchema =  splitTo[0];
    if (fromSchema === message.from || toSchema === message.to) {
      return false;
    }
    return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
  }

  //TODO use schemasToIgnore instead
  _isToCypherModule(message) {
    let isCreate = message.type === 'create';
    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isToHyperty = divideURL(message.to).type === 'hyperty';
    let isToDataObject = isDataObjectURL(message.to);
    let isHandshake = message.type === 'handshake';

    return (isCreate && isFromHyperty && isToHyperty) || (isCreate && isFromHyperty && isToDataObject) || isHandshake;
  }

  decrypt(message) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      _this.idModule.decryptMessage(message).then(function(msg) {
        resolve(msg);
      }, (error) => {
        reject(error);
      });
    });
  }

  encrypt(message) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      _this.idModule.encryptMessage(message).then((msg) => {
        resolve(msg);
      }, (error) => {
        reject(error);
      });
    });
  }

  // TODO: instead of verifying message type, load it in PolicyEngine.applicablePolicies() if it is a subscription to a data object
  registerSubscriber(message, authDecision) {
    let _this = this;
    let to = message.to.split('/');
    let subsIndex = to.indexOf('subscription');
    let isDataObjectSubscription = subsIndex !== -1;

    if (authDecision && isDataObjectSubscription) {
      to.pop();
      let dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
      if (to[subsIndex - 1] !== undefined) {
        dataObjectURL += '/' + to[subsIndex - 1];
      }
      console.log('registering ' + dataObjectURL);
      _this.runtimeRegistry.registerSubscriber(dataObjectURL, message.body.subscriber);
    }
  }

  doMutualAuthentication(message, authDecision) {
    let _this = this;
    let to = message.to.split('/');
    let subsIndex = to.indexOf('subscription');
    let isDataObjectSubscription = subsIndex !== -1;

    if (authDecision && isDataObjectSubscription) {
      to.pop();
      let dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
      if (to.length > 4) {
        dataObjectURL = to[0] + '//' + to[2] + '/' + to[3] + '/' + to[4];
      }
      console.log('doing mutual authentication ' + dataObjectURL);
      _this.idModule.doMutualAuthentication(dataObjectURL, message.body.subscriber);
    }
  }

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length - 1];
  }
}

export default RuntimeCoreCtx;
