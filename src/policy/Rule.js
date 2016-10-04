import AdvancedCondition from './conditions/AdvancedCondition';
import Condition from './conditions/Condition';
import {getUserEmailFromURL, isDataObjectURL, removePathFromURL} from '../utils/utils';
import SubscriptionCondition from './conditions/AdvancedCondition';

class Rule {

  constructor(authorise, condition, scope, target, priority) {
    this.authorise = authorise;
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

  evaluate(context, message) {
    let hypertyName;
    switch (this.scope) {
      case 'global':
        break;

      case 'hyperty':
        if (isDataObjectURL(message.from)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(message.from));
          if (reporter !== undefined) {
            hypertyName = context.runtimeRegistry.getHypertyName(reporter);
          }
        } else {
          if (message.from.split('://')[0] === 'hyperty') {
            hypertyName = context.runtimeRegistry.getHypertyName(removePathFromURL(message.from));
          }
        }
        if (hypertyName === this.target) {
          break;
        }

        if (isDataObjectURL(message.to)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(message.to));
          if (reporter !== undefined) {
            hypertyName = context.runtimeRegistry.getHypertyName(reporter);
          }
        } else {
          if (message.to.split('://')[0] === 'hyperty') {
            hypertyName = context.runtimeRegistry.getHypertyName(removePathFromURL(message.to));
          }
        }
        if (hypertyName === this.target) {
          break;
        }

        return 'Not Applicable';

      case 'user':
        let owner;

        if (isDataObjectURL(message.from)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(message.from));
          owner = context.runtimeRegistry.getHypertyOwner(reporter);
        } else {
          if (message.from.split('://')[0] === 'hyperty') {
            owner = context.runtimeRegistry.getHypertyOwner(removePathFromURL(message.from));
          }
        }
        if (owner !== undefined) {
          owner = getUserEmailFromURL(owner);
        }
        if (owner === this.target) {
          break;
        }

        if (isDataObjectURL(message.to)) {
          let reporter = context.runtimeRegistry.getReporterURLSynchonous(removePathFromURL(message.to));
          owner = context.runtimeRegistry.getHypertyOwner(reporter);
          if (owner !== undefined) {
            owner = getUserEmailFromURL(owner);
          }
        } else {
          if (message.to.split('://')[0] === 'hyperty') {
            owner = context.runtimeRegistry.getHypertyOwner(removePathFromURL(message.to));
            if (owner !== undefined) {
              owner = getUserEmailFromURL(owner);
            }
          }
        }
        if (owner === this.target) {
          break;
        }

        return 'Not Applicable';
    }

    if (this.condition.isApplicable(context, message, this.scope, this.target)) {
      return this.authorise;
    } else {
      return 'Not Applicable';
    }
  }
}

export default Rule;
