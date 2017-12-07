import * as logger from 'loglevel';
let log = logger.getLogger('PEP');

import AllowOverrides from '../combiningAlgorithms/AllowOverrides';
import BlockOverrides from '../combiningAlgorithms/BlockOverrides';
import {divideURL, getUserEmailFromURL, isDataObjectURL} from '../../utils/utils';
import FirstApplicable from '../combiningAlgorithms/FirstApplicable';
import ReThinkCtx from '../ReThinkCtx';

class RuntimeCoreCtx extends ReThinkCtx {

  constructor(runtimeURL, idModule, runtimeRegistry, storageManager, runtimeCapabilities) {
    super();
    this._runtimeURL = runtimeURL;
    this._pepURL = this._runtimeURL + '/pep';
    this._guiURL = this._runtimeURL + '/policy-gui';
    this.idModule = idModule;
    this.runtimeRegistry = runtimeRegistry;
    this.activeUserPolicy = undefined;
    this.serviceProviderPolicy = {};
    this.userPolicies = {};
    this.storageManager = storageManager;
    this.runtimeCapabilities = runtimeCapabilities;
  }

  get pepURL() {
    let _this = this;
    return _this._pepURL;
  }

  get guiURL() {
    let _this = this;
    return _this._guiURL;
  }

  get runtimeURL() {
    let _this = this;
    return _this._runtimeURL;
  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this._messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this._messageBus = messageBus;
  }

  get subscription() {
    return this._subscription;
  }

  set subscription(params) {
    this._subscription = params.message.body.subscriber;
  }

  loadConfigurations() {
    let _this = this;

    return new Promise((resolve, reject) => {

      _this.storageManager.get('rethink:activePolicy').then((value) => {
        _this.activeUserPolicy = value;

        return _this.storageManager.get('rethink:groups');
      }).then((groupInfo) => {
        let groups = groupInfo;
        _this.groups = (groups === undefined) ? {} : groups;

        return _this.storageManager.get('rethink:spPolicies');
      }).then((policiesInfo) => {
        let spPolicies = policiesInfo;
        _this.serviceProviderPolicy = (spPolicies === undefined) ? {} : spPolicies;

        _this._loadUserPolicies().then(() => {
          resolve();
        });
      });
    });
  }


  getPolicies(message, isIncomingMessage) {
    let policies = {};

    if (this.activeUserPolicy !== undefined) {
      policies.userPolicy = this.userPolicies[this.activeUserPolicy];
    }

    policies.serviceProviderPolicy = this.getServiceProviderPolicy(message, isIncomingMessage);

    return policies;
  }

  _isValidUpdate(message) {
    let _this = this;
    return new Promise((resolve, reject) => {
      if (message.from.split('://').length > 1) {
        _this.idModule._getHypertyFromDataObject(message.from).then(hypertyURL => {
          if (hypertyURL === message.body.source) {
            resolve(message);
          } else {
            reject('The source of the message is not valid.');
          }
        }, (error) => {
          reject(error);
        });
      } else {
        resolve(message);
      }
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
      policy = this.serviceProviderPolicy[toHyperty];
    } else {
      let fromHyperty = this.runtimeRegistry.getHypertyName(message.from);
      policy = this.serviceProviderPolicy[fromHyperty];
    }
    return policy;
  }


  getURL(url) {
    let splitURL = url.split('/');
    return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
  }


  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  _loadUserPolicies() {
    let _this = this;

    return new Promise((resolve, reject) => {

      _this.storageManager.get('rethink:userPolicies').then((value) => {
        let policies = value;
        if (policies !== undefined) {
          for (let i in policies) {
            this.pep.addPolicy('USER', i, policies[i]);
          }
        }
        resolve();
      });
    });

  }

  _getLastComponentOfURL(url) {
    let split = url.split('/');
    return split[split.length - 1];
  }

  _getPoliciesJSON(policies) {
    for (let i in policies) {
      let combiningAlgorithm = policies[i].combiningAlgorithm;
      if (combiningAlgorithm instanceof BlockOverrides) {
        policies[i].combiningAlgorithm = 'blockOverrides';
      } else {
        if (combiningAlgorithm instanceof AllowOverrides) {
          policies[i].combiningAlgorithm = 'allowOverrides';
        } else {
          if (combiningAlgorithm instanceof FirstApplicable) {
            policies[i].combiningAlgorithm = 'firstApplicable';
          } else {
            policies[i].combiningAlgorithm = undefined;
          }
        }
      }
    }

    return policies;
  }

  saveActivePolicy() {
    let _this = this;

    return new Promise((resolve, reject) => {
      _this.storageManager.set('rethink:activePolicy', 0, this.activeUserPolicy).then(() => {
        resolve();
      });
    });
  }

  saveGroups() {
    let _this = this;

    return new Promise((resolve, reject) => {
      _this.storageManager.set('rethink:groups', 0, this.groups).then(() => {
        resolve();
      });
    });
  }

  savePolicies(source, policy, key) {
    let policiesJson;

    switch (source) {
      case 'USER':
        policiesJson = JSON.stringify(this.userPolicies);
        policiesJson = this._getPoliciesJSON(JSON.parse(policiesJson));
        this.storageManager.set('rethink:userPolicies', 0, policiesJson);
        break;
      case 'SERVICE_PROVIDER':
        if (policy !== undefined & key !== undefined) {
          this.serviceProviderPolicy[key] = policy;
        }
        policiesJson = JSON.stringify(this.serviceProviderPolicy);
        policiesJson = this._getPoliciesJSON(JSON.parse(policiesJson));
        this.storageManager.set('rethink:spPolicies', 0, policiesJson);
        break;
      default:
        throw Error('Unknown policy source: ' + source);
    }
  }

  getGroupsNames() {
    let myGroups = this.groups;
    let groupsNames = [];
    if (myGroups !== undefined) {
      for (let groupName in myGroups) {
        groupsNames.push(groupName);
      }
    }
    return groupsNames;
  }

  getGroup(groupName, destination) {
    let members = [];

    if (groupName === 'preauthorised') {
      let dataObjectURL = destination.split('/');
      dataObjectURL.pop();
      dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2];
      members = this.runtimeRegistry.getPreAuthSubscribers(dataObjectURL);
    } else {
      if (this.groups[groupName] !== undefined) {
        members = this.groups[groupName];
      }
    }

    return members;
  }

  /**
  * Creates a group with the given name.
  * @param  {String}  groupName
  */
  createGroup(groupName) {
    this.groups[groupName] = [];
    this.saveGroups();
  }

  deleteGroup(groupName) {
    delete this.groups[groupName];
    this.saveGroups();
  }

  /**
  * Adds the given user email to the group with the given name.
  * @param  {String}  userEmail
  * @param  {String}  groupName
  */
  addToGroup(groupName, userEmail) {
    let myGroups = this.groups;
    if (myGroups[groupName] !== undefined) {
      if (myGroups[groupName].indexOf(userEmail) === -1) {
        myGroups[groupName].push(userEmail);
        this.saveGroups();
      }
    } else {
      throw Error('Group "' + groupName + '" does not exist!');
    }
  }

  removeFromGroup(groupName, userEmail) {
    let group = this.groups[groupName];

    group.splice(group.indexOf(userEmail), 1);
    this.saveGroups();
  }

}

export default RuntimeCoreCtx;
