// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('PEP');

import ActionsService from './ActionsService';
import PDP from './PDP';
import Policy from './Policy';
import {isHypertyURL} from '../utils/utils';

class PEP {

  /**
  * Creates a Policy Enforcement Point (PEP) instance
  * @param    {Object}    context
  */
  constructor(context) {
    let _this = this;

    _this.pdp = new PDP(context);
    _this.actionsService = new ActionsService(context);
    _this.context = context;
    context.pep = _this;

    //TODO should be added a trigger to verify when the loadConfigurations is successfully completed
    context.loadConfigurations();
  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  get messageBus() {
    let _this = this;
    return _this.context.messageBus;
  }

  /**
  * Set the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */
  set messageBus(messageBus) {
    let _this = this;
    _this.context.messageBus = messageBus;
    _this.addGUIListeners();
  }

  addGUIListeners() {
    let _this = this;

    _this.context.messageBus.addListener(_this.context.pepURL, (msg) => {
      let funcName = msg.body.method;

      let returnedValue;
      if (funcName === 'addToGroup') {
        let groupName = msg.body.params.groupName;
        let userEmail = msg.body.params.userEmail;
        returnedValue = _this.context.addToGroup(groupName, userEmail);
      } else if (funcName === 'createGroup') {
        let groupName = msg.body.params.groupName;
        returnedValue = _this.context.createGroup(groupName);
      } else if (funcName === 'addPolicy') {
        let source = msg.body.params.source;
        let key = msg.body.params.key;
        let policy = msg.body.params.policy;
        let combiningAlgorithm = msg.body.params.combiningAlgorithm;
        returnedValue = _this.addPolicy(source, key, policy, combiningAlgorithm);
      } else if (funcName === 'deleteGroup') {
        let groupName = msg.body.params.groupName;
        returnedValue = _this.context.deleteGroup(groupName);
      } else if (funcName === 'removePolicy') {
        let source = msg.body.params.source;
        let key = msg.body.params.key;
        returnedValue = _this.removePolicy(source, key);
      } else if (funcName === 'savePolicies') {
        let source = msg.body.params.source;
        returnedValue = _this.context.savePolicies(source);
      } else if (funcName === 'userPolicies') {
        returnedValue = _this.context.userPolicies;
      } else if (funcName === 'activeUserPolicy') {
        let userPolicy = msg.body.params.userPolicy;
        if (userPolicy) { _this.context.activeUserPolicy = userPolicy; }
        returnedValue = _this.context.activeUserPolicy;
      } else if (funcName === 'userPolicy') {
        let key = msg.body.params.key;
        returnedValue = _this.context.userPolicies[key];
      } else if (funcName === 'saveActivePolicy') {
        returnedValue = _this.context.saveActivePolicy();
      } else if (funcName === 'getMyEmails') {
        returnedValue = _this.context.getMyEmails();
      } else if (funcName === 'getMyHyperties') {
        returnedValue = _this.context.getMyHyperties();
      } else if (funcName === 'groups') {
        returnedValue = _this.context.groups;
      } else if (funcName === 'getGroupsNames') {
        returnedValue = _this.context.getGroupsNames();
      } if (funcName === 'removeFromGroup') {
        let groupName = msg.body.params.groupName;
        let userEmail = msg.body.params.userEmail;
        returnedValue = _this.context.removeFromGroup(groupName, userEmail);
      }

      let value = {type: 'execute', value: returnedValue, code: 200};
      let replyMsg = {id: msg.id, type: 'response', to: msg.from, from: msg.to, body: value};
      _this.context.messageBus.postMessage(replyMsg);
    });
  }

  /**
  * Adds a policy to the Policy Enforcement Point (PEP). The policy can be created by the service
  * provider or by the user.
  * @param    {String}    source
  * @param    {String}    key
  * @param    {Object}    policy
  */
  addPolicy(source, key, policy, combiningAlgorithm) {
    if (!source) throw new Error('source is not defined');
    if (!key) throw new Error('key is not defined');

    if (policy === undefined) {
      policy = new Policy(key, [], [], combiningAlgorithm);
    } else {
      if (!(policy instanceof Policy)) {
        policy = new Policy(policy.key, policy.rules, policy.actions, policy.combiningAlgorithm);
      }
    }

    switch (source) {
      case 'SERVICE_PROVIDER':
        this.context.savePolicies(source, policy, key);
        break;
      case 'USER':
        this.context.userPolicies[key] = policy;
        this.context.savePolicies(source);
        break;
      default:
        throw Error('Unknown policy source: ' + source);
    }
  }

  authorise(message, isIncoming) {
    // log.log('[Policy.PEP Authorise] ', message);
    // log.log(message);
    if (!message) throw new Error('message is not defined');
    if (!message.from) throw new Error('message.from is not defined');
    if (!message.to) throw new Error('message.to is not defined');
    if (!message.type) throw new Error('message.type is not defined');
    message.body = message.body || {};

    return new Promise((resolve, reject) => {

      message.body = message.body || {};
      let _this = this;

          let result = _this.pdp.evaluatePolicies(message, isIncoming);
          if (result === 'Not Applicable') {
            result = _this.context.defaultBehaviour;
            message.body.auth = false;
          }
          _this.actionsService.enforcePolicies(message, isIncoming).then(messages => {
            for (let i in messages) {
              message = messages[i];
                if (result) {
                  message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
                  resolve(message);
                } else {
                  let errorMessage = { body: { code: 403, description: 'Blocked by policy' }, from: message.to, to: message.from, type: 'response' };
                  reject(errorMessage);
                }
            }
          }, (error) => {
            reject(error);
          });

    });
  }


  removePolicy(source, key) {
    if (!source) throw new Error('source is not defined');
    if (source !== '*' && !key) throw new Error('key is not defined');

    switch (source) {
      case '*':
        this.context.serviceProviderPolicy = {};
        this.context.userPolicies = {};
        this.context.activeUserPolicy = undefined;
        this.context.savePolicies('USER');
        this.context.savePolicies('SERVICE_PROVIDER');
        this.context.saveActivePolicy();
        break;
      case 'SERVICE_PROVIDER':
        delete this.context.serviceProviderPolicy[key];
        this.context.savePolicies();
        break;
      case 'USER':
        delete this.context.userPolicies[key];
        if (key === this.context.activeUserPolicy) {
          this.context.activeUserPolicy = undefined;
          this.context.saveActivePolicy();
        }
        this.context.savePolicies('USER');
        break;
      default:
        throw Error('Unknown policy source: ' + source);
    }
  }

}

export default PEP;
