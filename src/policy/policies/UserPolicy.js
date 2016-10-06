import AdvancedCondition from '../conditions/AdvancedCondition';
import Condition from '../conditions/Condition';
import Policy from '../Policy';
import Rule from '../Rule';
import SubscriptionCondition from '../conditions/SubscriptionCondition';

class UserPolicy extends Policy {

  addAction(method, param) {
    this.actions.push({ method: method, param: param });
  }

  createRule(type, authorise, condition, scope, target, priority) {
    if (!(condition instanceof Condition)) {
      switch (type) {
        case 'advanced':
          condition = new AdvancedCondition(condition);
          break;
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
    let rule = new Rule(authorise, condition, scope, target, priority);
    this.rules.push(rule);
  }

  deleteRule(rule) {
    let indexToRemove = this.rules.indexOf(rule);
    this.rules.splice(indexToRemove, 1);
  }

  getRuleByPriority(priority) {
    for (let i in this.rules) {
      if (String(this.rules[i].priority) === String(priority)) {
        return this.rules[i];
      }
    }
    throw Error('Rule with priority ' + priority + ' does not exist!');
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
      let x = a.priority; let y = b.priority;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
}

export default UserPolicy;
