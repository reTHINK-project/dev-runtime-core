import CommonCtx from './CommonCtx';
import {divideURL, isDataObjectURL} from '../../utils/utils';
import persistenceManager from 'service-framework/dist/PersistenceManager';
import Rule from '../Rule';
import UserPolicy from '../policies/UserPolicy';
import SubscriptionCondition from '../conditions/SubscriptionCondition';

class RuntimeCoreCtx extends CommonCtx {

  constructor(idModule, runtimeRegistry) {
    super();
    this.idModule = idModule;
    this.runtimeRegistry = runtimeRegistry;
    this.activeUserPolicy = undefined;
    this.userPolicies = {};
  }

  get activeUserPolicy() {
    return this._activeUserPolicy;
  }

  get dataObjectScheme() {
    return this._dataObjectScheme;
  }

  get idModule() {
    return this._idModule;
  }

  get policies() {
    let policies = persistenceManager.get('policies');

    if (policies === undefined) {
      policies = {};
    }
    return policies;
  }

  get policyEngine() {
    return this._policyEngine;
  }

  get runtimeRegistry() {
    return this._runtimeRegistry;
  }

  get subscription() {
    return this._subscription;
  }

  set activeUserPolicy(policy) {
    this._activeUserPolicy = policy;
  }

  set dataObjectScheme(params) {
    let from = params.message.from;
    if (isDataObjectURL(from)) {
      this._dataObjectScheme = divideURL(from).type;
    } else {
      this._dataObjectScheme = undefined;
    }
  }

  set idModule(idModule) {
    this._idModule = idModule;
  }

  set policies(policies) {
    persistenceManager.set('policies', '0', policies);
  }

  set policyEngine(policyEngine) {
    this._policyEngine = policyEngine;
    let acceptAnySubscriptionRule = new Rule(true, new SubscriptionCondition('subscription', 'equals', '*'), 'global', 'global');
    let policy = new UserPolicy('My policy', [acceptAnySubscriptionRule], ['registerSubscriber', 'doMutualAuthentication']);
    this._policyEngine.addPolicy('USER', 'My policy', policy);
    this.activeUserPolicy = 'My policy';
  }

  set runtimeRegistry(registry) {
    this._runtimeRegistry = registry;
  }

  set subscription(params) {
    this._subscription = params.message.body.subscriber;
  }

  authorise(message) {
    let _this = this;

    return new Promise((resolve, reject) => {
      console.log('--- Policy Engine ---');
      console.log(message);
      message.body = message.body || {};
      let result;
      let isToVerify = _this._isToVerify(message);
      let isIncomingMessage = _this._isIncomingMessage(message);
      let isToCypher = _this._isToCypherModule(message);
      if (isToVerify) {
        if (isIncomingMessage) {
          if (isToCypher) {
            _this.decrypt(message).then(message => {
              let policies = {
                serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                userPolicy: _this.activeUserPolicy
              };
              result = _this.policyEngine.pdp.applyPolicies(message, policies);
              _this.policyEngine.pep.enforcePolicies(message, policies, result);
              if (result === 'Not Applicable') {
                result = _this.defaultBehavior;
                message.body.auth = false;
              }
              if (result) {
                message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
                resolve(message);
              } else {
                reject('Message blocked');
              }
            }, (error) => { reject(error); });

          } else {
            let policies = {
              serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
              userPolicy: _this.activeUserPolicy
            };
            result = _this.policyEngine.pdp.applyPolicies(message, policies);
            _this.policyEngine.pep.enforcePolicies(message, policies, result);
            if (result === 'Not Applicable') {
              result = _this.defaultBehavior;
              message.body.auth = false;
            }
            if (result) {
              message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        } else {
          let isToSetID = _this._isToSetID(message);
          if (isToSetID) {
            _this._getIdentity(message).then(identity => {
              message.body.identity = identity;
              let policies = {
                serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                userPolicy: _this.activeUserPolicy
              };
              result = _this.policyEngine.pdp.applyPolicies(message, policies);
              _this.policyEngine.pep.enforcePolicies(message, policies, result);
              if (result === 'Not Applicable') {
                result = _this.defaultBehavior;
                message.body.auth = false;
              }
              if (result) {
                message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
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
            let policies = {
              serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
              userPolicy: _this.activeUserPolicy
            };
            result = _this.policyEngine.pdp.applyPolicies(message, policies);
            _this.policyEngine.pep.enforcePolicies(message, policies, result);
            if (result === 'Not Applicable') {
              result = _this.defaultBehavior;
              message.body.auth = false;
            }
            if (result) {
              message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
              resolve(message);
            } else {
              reject('Message blocked');
            }
          }
        }
      } else {
        result = _this.defaultBehavior;
        message.body.auth = false;
        if (result) {
          resolve(message);
        } else {
          reject('Message blocked');
        }
      }
    });
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

  doMutualAuthentication(message, authDecision) {
    if (authDecision) {
      let to = message.to.split('/');
      let subsIndex = to.indexOf('subscription');
      let isDataObjectSubscription = subsIndex !== -1;
      let isFromRemoteSM = this.isFromRemoteSM(message.from);
      if (isDataObjectSubscription & isFromRemoteSM) {
        to.pop();
        let dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
        if (to.length > 4) {
          dataObjectURL = to[0] + '//' + to[2] + '/' + to[3] + '/' + to[4];
        }
        this.idModule.doMutualAuthentication(dataObjectURL, message.body.subscriber);
      }
    }
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

  getServiceProviderPolicy(message, isIncoming) {
    let policy;

    if (isIncoming) {
      let toHyperty = this.runtimeRegistry.getHypertyName(message.to);
      policy = this.serviceProviderPolicies[toHyperty];
    } else {
      let fromHyperty = this.runtimeRegistry.getHypertyName(message.from);
      policy = this.serviceProviderPolicies[fromHyperty];
    }
    return policy;
  }

  isFromRemoteSM(from) {
    let splitFrom = from.split('://');
    return splitFrom[0] === 'runtime' && from !== this.runtimeRegistry.runtimeURL + '/sm';
  }

  _isToSetID(message) {
    let schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];

    return schemasToIgnore.indexOf(fromSchema) === -1;
  }

  _isIncomingMessage(message) {
    return (message.body.identity) ? true : false;
  }

  getURL(url) {
    let splitURL = url.split('/');
    return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
  }

  _getIdentity(message) {
    if (message.type === 'update') {
      return this.idModule.getIdentityOfHyperty(message.body.source);
    }

    if (message.type === 'response' && message.body.source !== undefined) {
      return this.idModule.getIdentityOfHyperty(message.body.source);
    }

    if (divideURL(message.from).type === 'hyperty') {
      return this.idModule.getIdentityOfHyperty(message.from);
    } else {
      return this.idModule.getIdentityOfHyperty(this.getURL(message.from));
    }
  }

  _isToVerify(message) {
    let schemasToIgnore = ['domain-idp', 'hyperty-runtime', 'runtime', 'domain'];
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

  registerSubscriber(message, authDecision) {
    if (authDecision) {
      let to = message.to.split('/');
      let subsIndex = to.indexOf('subscription');
      let isDataObjectSubscription = subsIndex !== -1;
      let isFromRemoteSM = this.isFromRemoteSM(message.from);

      if (isDataObjectSubscription & isFromRemoteSM) {
        to.pop();
        let dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
        if (to.length > 4) {
          dataObjectURL = to[0] + '//' + to[2] + '/' + to[3] + '/' + to[4];
        }
        this.runtimeRegistry.registerSubscriber(dataObjectURL, message.body.subscriber);
      }
    }
  }

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length - 1];
  }

}

export default RuntimeCoreCtx;
