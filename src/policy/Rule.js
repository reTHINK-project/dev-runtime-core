import Operators from './Operators';

class Rule {

  constructor(authorise, condition, scope, target) {
    this.operators = new Operators();
    this.authorise = authorise;
    this.condition = condition;
    this.scope = scope;
    this.target = target;
  }

  get authorise() {
    return this._authorise;
  }

  get condition() {
    return this._condition;
  }

  get scope() {
    return this._scope;
  }

  get target() {
    return this._target;
  }

  set authorise(decision) {
    this._authorise = decision;
  }

  set condition(condition) {
    this._condition = condition;
  }

  set scope(scope) {
    this._scope = scope;
  }

  set target(target) {
    this._target = target;
  }

  evaluate(context, message) {
    if (this.condition.isApplicable(context, message, this.scope, this.target)) {
      return this.authorise;
    } else {
      return 'Not Applicable';
    }
  }
}

export default Rule;
