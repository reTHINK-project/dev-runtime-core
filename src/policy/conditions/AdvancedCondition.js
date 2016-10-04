import Condition from './Condition';
import Operators from '../Operators';
import SubscriptionCondition from './SubscriptionCondition';

class AdvancedCondition {

  constructor(condition) {
    this.operators = new Operators();
    if (condition.operators !== undefined) {
      condition = condition.condition;
    }
    condition = this.buildCondition(condition);
    this.condition = condition;
  }

  buildCondition(condition) {
    if (Array.isArray(condition[1])) {
      condition[1] = this.buildCondition(condition[1]);
    } else {
      if (condition[1].attribute === 'subscription') {
        condition[1] = new SubscriptionCondition(condition[1].attribute, condition[1].operator, condition[1].params);
      } else {
        condition[1] = new Condition(condition[1].attribute, condition[1].operator, condition[1].params);
      }
    }

    if (condition[2] !== undefined) {
      if (Array.isArray(condition[2])) {
        condition[2] = this.buildCondition(condition[2]);
      } else {
        if (condition[2].attribute === 'subscription') {
          condition[2] = new SubscriptionCondition(condition[2].attribute, condition[2].operator, condition[2].params);
        } else {
          condition[2] = new Condition(condition[2].attribute, condition[2].operator, condition[2].params);
        }
      }
    }
    return condition;
  }

  isApplicable(context, message, scope, target, operator, left, right) {
    if (!operator) {
      operator = this.condition[0];
      left = this.condition[1];
      right = this.condition[2];
    }

    while (!(left instanceof Condition) & !(left instanceof SubscriptionCondition) & (typeof left !== 'boolean')) {
      left = this.isApplicable(context, message, scope, target, left[0], left[1], left[2]);
    }
    if (right !== undefined) {
      while (!(right instanceof Condition) & !(right instanceof SubscriptionCondition) & (typeof right !== 'boolean')) {
        right = this.isApplicable(context, message, scope, target, right[0], right[1], right[2]);
      }
    }

    let resultLeft = (typeof left === 'boolean') ? left : left.isApplicable(context, message, scope, target);
    let resultRight;
    if (right !== undefined) {
      resultRight = (typeof right === 'boolean') ? right : right.isApplicable(context, message, scope, target);
    }
    return this.operators[operator]([resultLeft, resultRight]);
  }

}

export default AdvancedCondition;
