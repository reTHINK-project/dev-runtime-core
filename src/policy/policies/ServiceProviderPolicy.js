import AdvancedCondition from '../conditions/AdvancedCondition';
import Condition from '../conditions/Condition';
import Policy from '../Policy';
import Rule from '../Rule';

class ServiceProviderPolicy extends Policy {
  constructor(key, rules, actions, combiningAlgorithm) {
    if (!combiningAlgorithm) {
      combiningAlgorithm = 'blockOverrides';
    }
    super(key, rules, actions, combiningAlgorithm);
  }

  createRule(type, authorise, condition, scope, target) {
    if (!(condition instanceof Condition)) {
      switch (type) {
        case 'advanced':
          condition = new AdvancedCondition(condition);
          break;
        case 'simple':
          condition = new Condition(condition[0], condition[1], condition[2]);
          break;
      }
    }

    let rule = new Rule(authorise, condition, scope, target);
    this.rules.push(rule);
  }

}

export default ServiceProviderPolicy;
