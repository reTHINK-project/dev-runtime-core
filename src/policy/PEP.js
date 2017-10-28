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
      } else if(funcName === 'deleteGroup') {
        let groupName = msg.body.params.groupName;
        returnedValue = _this.context.deleteGroup(groupName);
      } else if(funcName === 'removePolicy') {
        let source = msg.body.params.source;
        let key = msg.body.params.key;
        returnedValue = _this.removePolicy(source, key);
      } else if(funcName === 'savePolicies') {
        let source = msg.body.params.source;
        returnedValue = _this.context.savePolicies(source);
      } else if(funcName === 'userPolicies') {
        returnedValue = _this.context.userPolicies;
      } else if(funcName === 'activeUserPolicy') {
        let userPolicy = msg.body.params.userPolicy;
        if (userPolicy) { _this.context.activeUserPolicy = userPolicy; }
        returnedValue = _this.context.activeUserPolicy;
      } else if(funcName === 'userPolicy') {
        let key = msg.body.params.key;
        returnedValue = _this.context.userPolicies[key];
      } else if(funcName === 'saveActivePolicy') {
        returnedValue = _this.context.saveActivePolicy();
      } else if(funcName === 'getMyEmails') {
        returnedValue = _this.context.getMyEmails();
      } else if(funcName === 'getMyHyperties') {
        returnedValue = _this.context.getMyHyperties();
      } else if(funcName === 'groups') {
        returnedValue = _this.context.groups;
      } else if(funcName === 'getGroupsNames') {
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

  authorise(message) {
    console.log('[Policy.PEP Authorise] ', message);
    console.log(message);
    if (!message) throw new Error('message is not defined');
    if (!message.from) throw new Error('message.from is not defined');
    if (!message.to) throw new Error('message.to is not defined');
    if (!message.type) throw new Error('message.type is not defined');
    message.body = message.body || {};

    return new Promise((resolve, reject) => {

      message.body = message.body || {};
      let _this = this;
      let result;
      if (_this._isToVerify(message)) {
        let isIncoming = _this._isIncomingMessage(message);
        _this.context.prepareForEvaluation(message, isIncoming).then(message => {
          result = _this.pdp.evaluatePolicies(message, isIncoming);
          if (result === 'Not Applicable') {
            result = _this.context.defaultBehaviour;
            message.body.auth = false;
          }
          _this.actionsService.enforcePolicies(message, isIncoming).then(messages => {
            for (let i in messages) {
              message = messages[i];
              _this.context.prepareToForward(message, isIncoming, result).then(message => {
                if (result) {
                  if (isIncoming && message.body.identity) {
                    delete message.body.identity.assertion;
                    delete message.body.identity.expires;
                  } 
                  message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
                  resolve(message);
                } else {
                  let errorMessage = { body: { code: 403, description: 'Blocked by policy' }, from: message.to, to: message.from, type: 'response' };
                  reject(errorMessage);
                }
              }, (error) => {
                reject(error);
              });
            }
          }, (error) => {
            reject(error);
          });
        }, (error) => {
          reject(error);
        });
      } else {
        result = _this.context.defaultBehaviour;
        if (result) {
          message.body.auth = false;
          resolve(message);
        } else {
          let errorMessage = { body: { code: 403, description: 'Blocked by policy' }, from: message.to, to: message.from, type: 'response' };
          reject(errorMessage);
        }
      }
    });
  }

  authoriseSync(message) {
    let result;
    message.body = message.body || {};
    if (this._isToVerify(message)) {
      let isIncoming = this._isIncomingMessage(message);
      message = this.context.prepareForEvaluation(message, isIncoming);
      result = this.pdp.evaluatePolicies(message, isIncoming);
      if (result === 'Not Applicable') {
        result = this.context.defaultBehaviour;
        message.body.auth = false;
      }
      this.actionsService.enforcePolicies(message, isIncoming);
      message = this.context.prepareToForward(message, isIncoming, result);
      if (result) {
        message.body.auth = (message.body.auth === undefined) ? true : message.body.auth;
        return true;
      } else {
        return false;
      }
    } else {
      result = this.context.defaultBehaviour;
      if (result) {
        message.body.auth = false;
        return true;
      } else {
        return false;
      }
    }
  }

  _isIncomingMessage(message) {
    let from;

    if (message.type === 'forward') {
      console.info('[PEP - isIncomingMessage] - message.type: ', message.type);
      from = message.body.from;
    } else if (message.body.hasOwnProperty('source') && message.body.source) {
      console.info('[PEP - isIncomingMessage] - message.body.source: ', message.body.source);
      from = message.body.source;
    } else if (message.body.hasOwnProperty('subscriber') && message.body.subscriber) {
      //TODO: this subscriber validation should not exist, because is outdated
      //TODO: the syncher and syncher manager not following the correct spec;
      console.info('[PEP - isIncomingMessage] - message.body.subscriber: ', message.body.subscriber);
      from = message.body.subscriber;
    }  else if (message.body.hasOwnProperty('reporter') && message.body.reporter) {
      //TODO: this subscriber validation should not exist, because is outdated
      //TODO: the syncher and syncher manager not following the correct spec;
      console.info('[PEP - isIncomingMessage] - message.body.reporter: ', message.body.reporter);
      from = message.body.reporter;
    } else {
      console.info('[PEP - isIncomingMessage] - message.from ', message.from);
      from = message.from;
    }

    console.info('[PEP - isIncomingMessage] - check if isLocal: ', from);
    return !this.context.isLocal(from);
  }

  /**
  * Identifies the messages to be verified by the Policy Engine
  * @param    {Message}   message
  * @returns  {boolean}   returns true if the message requires encryption/decryption
  *                       or if its type equals 'handshake'; false otherwise
  */
  _isToVerify(message) {
    let schemasToIgnore = ['domain', 'domain-idp', 'global', 'hyperty-runtime', 'runtime'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    let splitTo = (message.to).split('://');
    let toSchema =  splitTo[0];
    let from = message.from;
    let to = message.to;

    // Signalling messages between P2P Stubs don't have to be verified. FFS

    if (message.body && message.body.source) {
      from = message.body.source;
    }

    if (message.body && message.body.subscriber) {
      from = message.body.subscriber;
    }

    if (from.indexOf('/p2phandler/') !== -1 || from.indexOf('/p2prequester/') !== -1 || to.indexOf('/p2phandler/') !== -1 || to.indexOf('/p2prequester/') !== -1) {
      return false;
    }

    // hack to disable Identity verification for messages coming from legacy domains while solution is not implemented

    if (this.context.isInterworkingProtoStub(from)) {
      return false;
    }

    if (message.from === fromSchema || message.to === toSchema || message.type === 'read' || message.type === 'response' || (isHypertyURL(message.from) && message.type === 'delete')) {
      return false;
    } else {
      return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
    }
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
