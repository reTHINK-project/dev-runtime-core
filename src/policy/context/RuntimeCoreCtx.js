import CommonCtx from './CommonCtx';
import {divideURL} from '../../utils/utils';

//import persistenceManager from 'service-framework/dist/PersistenceManager';

class RuntimeCoreCtx extends CommonCtx {

  constructor(idModule, runtimeRegistry) {
    super();
    let _this = this;
    _this.idModule = idModule;
    _this.runtimeRegistry = runtimeRegistry;
  }

  loadPolicies() {
    return {};
  }

  addSubscriptionPolicy() {
    let _this = this;
    let policy = {
      scope: 'global',
      condition: 'subscription equals *',
      authorise: true,
      actions: [{method: 'registerSubscriber'}, {method:'doMutualAuthentication'}]
    };

    if (_this.policies[policy.scope] === undefined) {
      _this.policies[policy.scope] = [];
    }
    _this.policies[policy.scope].push(policy);
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
                console.log('--- Policy Engine END ---');
                console.log(message);
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
              console.log('--- Policy Engine END ---');
              console.log(message);
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        } else {
          let isToSetID = _this._isToSetID(message);
          console.log('isToSetID?');
          console.log(isToSetID);
          if (isToSetID) {
            console.log('ASKING FOR IDENTITY');
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
                  console.log('--- Policy Engine END ---');
                  console.log(message);
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
              console.log('--- Policy Engine END ---');
              console.log(message);
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        }
      } else {
        console.log('--- Policy Engine END ---');
        console.log(message);
        resolve(message);
      }
    });
  }

  _isToSetID(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    console.log('from schema: ' + fromSchema);

    console.log('schemasToIgnore.indexOf(fromSchema) === -1');
    console.log(schemasToIgnore.indexOf(fromSchema) === -1);

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

  getIdentity(message) {
    let _this = this;

    if (message.type === 'update') {
      return _this.idModule.getIdentityOfHyperty(message.body.source);
    }
    let from = _this._getURL(message.from);
    console.log('getting id of ' + from);
    return _this.idModule.getIdentityOfHyperty(from);
  }

  isToVerify(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    console.log('from schema: ' + fromSchema);
    let splitTo = (message.to).split('://');
    let toSchema =  splitTo[0];
    console.log('to schema: ' + toSchema);
    console.log('schemasToIgnore.indexOf(fromSchema) === -1');
    console.log(schemasToIgnore.indexOf(fromSchema) === -1);
    console.log('schemasToIgnore.indexOf(toSchema) === -1');
    console.log(schemasToIgnore.indexOf(toSchema) === -1);
    if (fromSchema === message.from || toSchema === message.to) {
      return false;
    }
    return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
  }

  _isToCypherModule(message) {
    let _this = this;
    let isCreate = message.type === 'create';
    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isToHyperty = divideURL(message.to).type === 'hyperty';
    let isToDataObject = _this._isDataObjectURL(message.to);
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
    let isDataObjectSubscription = to[4] === 'subscription';

    if (authDecision && isDataObjectSubscription) {
      let dataObjectURL = message.to.split('/');
      dataObjectURL.pop();
      dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2] + '/' + dataObjectURL[3];
      _this.runtimeRegistry.registerSubscriber(dataObjectURL, message.body.subscriber);
    }
  }

  doMutualAuthentication(message, authDecision) {
    let _this = this;
    let to = message.to.split('/');
    let isDataObjectSubscription = to[4] === 'subscription';

    if (authDecision && isDataObjectSubscription) {
      let dataObjectURL = message.to.split('/');
      dataObjectURL.pop();
      dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2] + '/' + dataObjectURL[3];
      _this.idModule.doMutualAuthentication(dataObjectURL, message.body.subscriber);
    }
  }

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length - 1];
  }

  _isDataObjectURL(url) {
    let _this = this;
    let dataObjectURL = _this._getURL(url);
    return _this.runtimeRegistry.isDataObjectURL(dataObjectURL);
  }
}

export default RuntimeCoreCtx;
