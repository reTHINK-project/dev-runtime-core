import Policy from '../Policy';

class ServiceProviderPolicy extends Policy {
  constructor(key, rules, actions) {
    super(key, rules, actions, 'denyOverrides');
  }

}

export default ServiceProviderPolicy;
