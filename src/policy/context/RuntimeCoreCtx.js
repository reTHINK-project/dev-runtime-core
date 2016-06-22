import Context from '../Context';
import {divideURL} from '../../utils/utils';
import persistenceManager from '../../persistence/PersistenceManager';

class RuntimeCoreCtx extends Context {

  constructor(idModule, runtimeRegistry) {
    super();
    let _this = this;
    _this.idModule = idModule;
    _this.runtimeRegistry = runtimeRegistry;
  }

  loadPolicies() {
    //persistenceManager.delete('policies');
    let myPolicies = persistenceManager.get('policies') || {};

    let acceptAnySubscriptionPolicy = {
      scope: 'global',
      condition: 'subscription equals *',
      authorise: true,
      actions: [{method: 'registerSubscriber'}]
    };

    myPolicies['global'] = [acceptAnySubscriptionPolicy];
    persistenceManager.set('policies', 0, myPolicies);

    return myPolicies;
  }

  authorise(message) {
    let _this = this;

    return new Promise((resolve, reject) => {
      console.log('--- Policy Engine (Runtime Core) ---');
      console.log(message);
      message.body = message.body || {};
      let result;
      let isIncomingMessage = _this.isIncomingMessage(message);
      let isToVerify = _this.isToVerify(message);

      if (isToVerify) {
        if (isIncomingMessage) {

          _this.decrypt(message).then(message => {
            result = _this.applyPolicies(message);
            let messageAccepted = result.policiesResult[0];
            if (messageAccepted) {
              resolve(message);
            } else {
              reject('Incoming message: blocked');
            }
          }, (error) => { reject(error); });

        } else {

          _this.getIdentity(message).then(identity => {
            message.body.identity = identity;
            result = _this.applyPolicies(message);
            let messageAccepted = result.policiesResult[0];
            if (messageAccepted) {
              _this.encrypt(message).then(message => {
                resolve(message);
              }, (error) => { reject(error); });
            } else {
              reject('Outgoing message: blocked');
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

  _getList(scope, groupName) {
    let myGroups = persistenceManager.get('groups') || {};
    let members = [];
    if (myGroups[scope] !== undefined && myGroups[scope][groupName] !== undefined) {
      members = myGroups[scope][groupName];
    }
    return members;
  }

  isIncomingMessage(message) {
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

  isToSetID(message) {
    let _this = this;
    if (message.body.identity || !_this.isToVerify(message)) {
      return false;
    } else {
      return true;
    }
  }

  isToVerify(message) {
    let _this = this;

    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isToDataObject = _this._isDataObjectURL(message.to);
    let isFromSM = (message.from === _this.runtimeRegistry.runtimeURL + '/sm');
    let isToSubscription = (_this._getLastComponentOfURL(message.to) === 'subscription');
    let isFromDataObject = _this._isDataObjectURL(message.from);
    let isToHyperty = divideURL(message.to).type === 'hyperty';

    if (isFromSM && isToSubscription) {
      _this.runtimeRegistry.registerSubscribedDataObject(_this._getDataObjectURL(message.to));
    }

    return (isFromHyperty && isToDataObject) || (isFromSM && isToSubscription) || (isFromDataObject && isToDataObject) || (isFromHyperty && isToHyperty);
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

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length-1];
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
