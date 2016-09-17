import Condition from './Condition';
import Operators from '../Operators';
import SubscriptionCondition from './SubscriptionCondition';

class AdvancedCondition {

  constructor(condition) {
    this.operators = new Operators();
    this.condition = condition;
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
