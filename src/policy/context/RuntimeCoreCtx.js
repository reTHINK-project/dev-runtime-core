import CommonCtx from './CommonCtx';
import {divideURL} from '../../utils/utils';

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

        }
      } else {
        resolve(message);
      }
    });
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

  getIdentity(message) {
    let _this = this;

    if (message.type === 'subscribe') {
      return _this.idModule.getIdentityOfHyperty(message.body.subscriber);
    }
    if (message.type === 'update') {
      return _this.idModule.getIdentityOfHyperty(message.body.source);
    }

    return _this.idModule.getIdentityOfHyperty(message.from);
  }

  //TODO: verify if scheme is not 'runtime', 'hyperty-runtime' or 'domain' instead of verifying if is data object
  isToVerify(message) {
    let _this = this;

    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isToDataObject = _this._isDataObjectURL(message.to);
    let isFromLocalSM = (message.from === _this.runtimeRegistry.runtimeURL + '/sm');
    let isFromRemoteSM = (_this._getLastComponentOfURL(message.from) === 'sm');
    let isToSubscription = (_this._getLastComponentOfURL(message.to) === 'subscription');
    let isFromDataObject = _this._isDataObjectURL(message.from);
    let isToHyperty = divideURL(message.to).type === 'hyperty';

    if (isFromLocalSM && isToSubscription) {
      _this.runtimeRegistry.registerSubscribedDataObject(_this._getDataObjectURL(message.to), message.body.subscriber);
    }

    return (isFromHyperty && isToDataObject) || (isFromLocalSM && isToSubscription) || (isFromRemoteSM && isToSubscription) || (isFromDataObject && isToDataObject) || (isFromHyperty && isToHyperty);
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

  _getDataObjectURL(url) {
    let splitURL = url.split('/');
    return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
  }

  _isDataObjectURL(url) {
    let _this = this;
    let dataObjectURL = _this._getDataObjectURL(url);
    return _this.runtimeRegistry.isDataObjectURL(dataObjectURL);
  }
}

export default RuntimeCoreCtx;
