import CommonCtx from './CommonCtx';
import Condition from '../conditions/Condition';
import {divideURL, getUserEmailFromURL, isDataObjectURL} from '../../utils/utils';
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
    this.serviceProviderPolicies = {};
    this.userPolicies = {};
  }

  get dataObjectScheme() {
    return this._dataObjectScheme;
  }

  get subscription() {
    return this._subscription;
  }

  set dataObjectScheme(params) {
    let from = params.message.from;
    if (isDataObjectURL(from)) {
      this._dataObjectScheme = divideURL(from).type;
    } else {
      this._dataObjectScheme = undefined;
    }
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
                let isSubscription = message.type === 'subscribe';
                let isFromRemoteSM = _this.isFromRemoteSM(message.from);
                if (isSubscription & isFromRemoteSM) {
                  _this.registerSubscriber(message);
                  _this.doMutualAuthentication(message);
                }
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
              let isSubscription = message.type === 'subscribe';
              let isFromRemoteSM = _this.isFromRemoteSM(message.from);
              if (isSubscription & isFromRemoteSM) {
                _this.registerSubscriber(message);
                _this.doMutualAuthentication(message);
              }
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

  doMutualAuthentication(message) {
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

  getMyEmails() {
    let identities = this.idModule.getIdentities();
    let emails = [];

    for (let i in identities) {
      emails.push(getUserEmailFromURL(identities[i].identity));
    }

    return emails;
  }

  getMyHyperties() {
    let hyperties = this.runtimeRegistry.hypertiesList;
    let hypertiesNames = [];

    for (let i in hyperties) {
      let hypertyName = hyperties[i].objectName;
      if (hypertiesNames.indexOf(hypertyName) === -1) {
        hypertiesNames.push(hypertyName);
      }
    }

    return hypertiesNames;
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

  loadActivePolicy() {
    this.activeUserPolicy = persistenceManager.get('rethink:activePolicy');
  }

  loadGroups() {
    let groups = persistenceManager.get('rethink:groups');
    if (groups != undefined) {
      this.groups = groups;
    }
  }

  loadSPPolicies() {
    let policies = persistenceManager.get('rethink:spPolicies');
    if (policies !== undefined) {
      this.serviceProviderPolicies = policies;
    }
  }

  loadUserPolicies() {
    let policies = persistenceManager.get('rethink:userPolicies');

    if (policies !== undefined) {
      for (let i in policies) {
        let rulesPE = [];
        let rules = policies[i].rules;
        for (let j in rules) {
          let condition;
          if (rules[j].condition.attribute === 'subscription') {
            condition = new SubscriptionCondition(rules[j].condition.attribute, rules[j].condition.operator, rules[j].condition.params);
          } else {
            condition = new Condition(rules[j].condition.attribute, rules[j].condition.operator, rules[j].condition.params);
          }
          rulesPE.push(new Rule(rules[j].authorise, condition, rules[j].priority, rules[j].scope, rules[j].target));
        }
        this.userPolicies[i] = new UserPolicy(policies[i].key, rulesPE, policies[i].actions, policies[i].combiningAlgorithm);
      }
    }
  }

  registerSubscriber(message) {
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

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length - 1];
  }

  saveActivePolicy() {
    persistenceManager.set('rethink:activePolicy', 0, this.activeUserPolicy);
  }

  saveGroups() {
    persistenceManager.set('rethink:groups', 0, this.groups);
  }

  savePolicies(source) {
    switch(source) {
      case 'USER':
        persistenceManager.set('rethink:userPolicies', 0, this.userPolicies);
        break;
      case 'SERVICE_PROVIDER':
        persistenceManager.set('rethink:spPolicies', 0, this.serviceProviderPolicies);
        break;
    }
  }

}

export default RuntimeCoreCtx;
