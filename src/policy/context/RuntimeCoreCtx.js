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
    let myPolicies = persistenceManager.get('policies');

    return myPolicies;
  }

  set group(params) {
    let _this = this;
    _this.groupAttribute = _this._getList(params.scope, params.group);
  }

  get group() {
    let _this = this;
    return _this.groupAttribute;
  }

  _getList(scope, groupName) {
    let myGroups = persistenceManager.get('groups') || {};
    let members = [];
    if (myGroups[scope] !== undefined && myGroups[scope][groupName] !== undefined) {
      members = myGroups[scope][groupName];
    }
    return members;
  }

  getIdentity(from) {
    let _this = this;
    return _this.idModule.getIdentityAssertion(from);
  }

  isToSetID(message) {
    let _this = this;

    if (message.body.identity) {
      return false;
    }

    let idpScheme = 'domain-idp';
    let idmURL = _this.runtimeRegistry.runtimeURL + '/idm';

    if (divideURL(message.from).type === idpScheme) {
      return message.to !== idmURL;
    }
    if (divideURL(message.to).type === idpScheme) {
      return message.from !== idmURL;
    }

    return true;
  }

  isToVerify(message) {
    //return _this.runtimeRegistry.isDataObjectURL(to);
    return true;
  }

  decrypt(message) {
    /*let _this = this;
    return _this.idModule.decryptMessage(message);*/
    return message;
  }

  encrypt(message) {
    /*let _this = this;
    return _this.idModule.encryptMessage(message);*/
    return message;
  }
}

export default RuntimeCoreCtx;
