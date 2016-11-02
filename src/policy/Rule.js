import AdvancedCondition from './conditions/AdvancedCondition';
import Condition from './conditions/Condition';
import {getUserEmailFromURL, isDataObjectURL, removePathFromURL} from '../utils/utils';
import SubscriptionCondition from './conditions/AdvancedCondition';

class Rule {

  constructor(decision, condition, scope, target, priority) {
    this.decision = decision;
    this.setCondition(condition);
    this.priority = priority;
    this.scope = scope;
    this.target = target;
  }

  setCondition(condition) {
    if (!(condition instanceof Condition || condition instanceof SubscriptionCondition || condition instanceof AdvancedCondition)) {
      let attribute = condition.attribute;
      switch (attribute) {
        case 'subscription':
          this.condition = new SubscriptionCondition(condition.attribute, condition.operator, condition.params);
          break;
        case undefined:
          this.condition = new AdvancedCondition(condition);
          break;
        default:
          this.condition = new Condition(condition.attribute, condition.operator, condition.params);
      }
    } else {
      this.condition = condition;
    }
  }

  evaluate(context, message, isIncoming) {
    let field = (isIncoming) ? message.to : message.from;
    let hypertyName;
    switch (this.scope) {
      case 'global':
        break;

      case 'hyperty':
        if (isDataObjectURL(field)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(field));
          if (reporter !== undefined) {
            hypertyName = context.runtimeRegistry.getHypertyName(reporter);
          }
        } else {
          if (field.split('://')[0] === 'hyperty') {
            hypertyName = context.runtimeRegistry.getHypertyName(removePathFromURL(field));
          }
        }
        if (hypertyName === this.target) {
          break;
        }

        return 'Not Applicable';

      case 'identity':
        let owner;

        if (isDataObjectURL(field)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(field));
          owner = context.runtimeRegistry.getHypertyOwner(reporter);
        } else {
          if (field.split('://')[0] === 'hyperty') {
            owner = context.runtimeRegistry.getHypertyOwner(removePathFromURL(field));
          }
        }
        if (owner !== undefined) {
          owner = getUserEmailFromURL(owner);
        }
        if (owner === this.target) {
          break;
        }

        return 'Not Applicable';
    }

    if (this.condition.isApplicable(context, message, this.scope, this.target)) {
      return this.decision;
    } else {
      return 'Not Applicable';
    }
  }
}

export default Rule;
