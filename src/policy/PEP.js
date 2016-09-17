import ActionsService from './ActionsService';
import PDP from './PDP';
import ServiceProviderPolicy from './policies/ServiceProviderPolicy';
import UserPolicy from './policies/UserPolicy';

class PEP {

  /**
  * Creates a Policy Enforcement Point (PEP) instance
  * @param    {Object}    context
  */
  constructor(context) {
    this.pdp = new PDP(context);
    this.actionsService = new ActionsService(context);
    this.context = context;
    context.pep = this;
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
    switch (source) {
      case 'SERVICE_PROVIDER':
        if (policy === undefined) {
          policy = new ServiceProviderPolicy(key, [], []);
        } else {
          if (!(policy instanceof ServiceProviderPolicy)) {
            policy = new ServiceProviderPolicy(policy.key, policy.rules, policy.actions, policy.combiningAlgorithm);
          }
        }
        this.context.savePolicies(source, policy, key);
        break;
      case 'USER':
        if (policy === undefined) {
          policy = new UserPolicy(key, [], [], combiningAlgorithm);
        } else {
          if (!(policy instanceof UserPolicy)) {
            policy = new UserPolicy(policy.key, policy.rules, policy.actions, policy.combiningAlgorithm);
          }
        }
        this.context.userPolicies[key] = policy;
        this.context.savePolicies(source);
        break;
      default:
        throw Error('Unknown policy source: ' + source);
    }
  }

  authorise(message) {
    message.body = message.body || {};
    return this.context.authorise(message);
  }

  _isToVerify(message) {
    let schemasToIgnore = ['domain', 'domain-idp', 'global', 'hyperty-runtime', 'runtime'];
    let splitFrom = (message.from).split('://');
    let fromSchema = splitFrom[0];
    let splitTo = (message.to).split('://');
    let toSchema =  splitTo[0];
    if (fromSchema === message.from || toSchema === message.to) {
      return false;
    }
    return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
  }

  removePolicy(source, key) {
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
