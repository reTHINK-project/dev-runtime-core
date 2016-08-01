import Policy from '../Policy';

class UserPolicy extends Policy {
  constructor(key, rules, actions, combiningAlgorithm) {
    if (!combiningAlgorithm) {
      combiningAlgorithm = 'denyOverrides';
    }
    super(key, rules, actions, combiningAlgorithm);
  }

}

export default UserPolicy;
