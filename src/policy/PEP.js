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

    console.log('--- Policy Engine ---');
    console.log(JSON.stringify(message));
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

    let old = (message.body !== undefined && message.body.identity !== undefined) ? true : false;
    let paulo = this.context.runtimeRegistry.isLocal(message.from);
    console.log('old:', old,'->new ', paulo );

    if ( !paulo) {
      return !paulo;
    } else {
      return old;
    }
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
