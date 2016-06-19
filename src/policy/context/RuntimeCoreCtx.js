import Context from '../Context';
import {divideURL} from '../../utils/utils';
import persistenceManager from '../../persistence/PersistenceManager';

class RuntimeCoreCtx extends Context {

  constructor(idModule, runtimeRegistry) {
    super();
    let _this = this;
    _this.idModule = idModule;
    _this.runtimeRegistry = runtimeRegistry;
    _this.policies = _this.loadPolicies();
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

  //TODO: if is from data object, identity is of the corresponding hyperty
  getIdentity(message) {
    let _this = this;
    if (message.type === 'subscribe' || message.type === 'update') {
      return _this.idModule.getIdentityOfHyperty(message.body.source);
    } else {
      return _this.idModule.getIdentityOfHyperty(message.from);
    }
  }

  isToSetID(message) {
    let _this = this;

    if (message.body.identity || !_this.isToVerify(message)) {
      return false;
    }

    return true;
  }

  isToVerify(message) {
    let _this = this;
    let isFromHyperty = divideURL(message.from).type === 'hyperty';
    let isFromSM = message.from === _this.runtimeRegistry.runtimeURL + '/sm';
    let isToHyperty = divideURL(message.to).type === 'hyperty';
    let isToDataObject = _this.runtimeRegistry.isDataObjectURL(message.to);

    return (isFromHyperty && isToDataObject) || (isFromSM && isToDataObject);
  }

  decrypt(message) {
    let _this = this;

    return new Promise(function(resolve,reject) {
      _this.idModule.decryptMessage(message).then(function(msg) {
        resolve(msg);
      }, (error) => {
        reject(err);
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
}

export default RuntimeCoreCtx;
