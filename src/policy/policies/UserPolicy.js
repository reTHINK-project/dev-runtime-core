import AdvancedCondition from '../conditions/AdvancedCondition';
import Condition from '../conditions/Condition'
import Policy from '../Policy';
import Rule from '../Rule';
import SubscriptionCondition from '../conditions/SubscriptionCondition';

class UserPolicy extends Policy {
  constructor(key, rules, actions, combiningAlgorithm) {
    if (!combiningAlgorithm) {
      combiningAlgorithm = 'denyOverrides';
    }
    super(key, rules, actions, combiningAlgorithm);
  }

  createRule(type, authorise, condition, scope, target, priority) {
    if (!(condition instanceof Condition)) {
      switch (type) {
        case 'advanced':
          condition = new AdvancedCondition(condition);
        case 'simple':
          condition = new Condition(condition[0], condition[1], condition[2]);
          break;
        case 'subscription':
          condition = new SubscriptionCondition(condition[0], condition[1], condition[2]);
          break;
      }
    }
    if (priority === undefined) {
      priority = this.getLastPriority() + 1;
    }
    let rule = new Rule(authorise, condition, priority, scope, target);
    this.rules.push(rule);
  }

  deleteRule(rule) {
    let indexToRemove = this.rules.indexOf(rule);
    this.rules.splice(indexToRemove, 1);
  }

  getLastPriority() {
    let priorities = [];

    if (this.rules.length !== 0) {
      for (let i in this.rules) {
        priorities.push(this.rules[i].priority);
      }
      return Math.max.apply(Math, priorities);
    } else {
      return -1;
    }
  }

  getRuleByPriority(priority) {
    for (let i in this.rules) {
      if (this.rules[i].priority == priority) {
        return this.rules[i];
      }
    }
    throw Error('Rule with priority ' + priority + ' does not exist!')
  }

  hasSubscriptionRule() {
    for (let i in this.rules) {
      if (this.rules[i].scope !== 'global') {
        continue;
      }
      if (this.rules[i].condition instanceof SubscriptionCondition) {
        return true;
      } else {
        if (this.rules[i].condition instanceof AdvancedCondition) {
          for (let j in this.rules[i].condition.condition) {
            if (this.rules[i].condition.condition[j] instanceof SubscriptionCondition) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  sortRules() {
    return this.rules.sort(function(a, b) {
        let x = a['priority']; let y = b['priority'];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
}

export default UserPolicy;
