import DenyOverrides from './combiningAlgorithms/DenyOverrides';
import FirstApplicable from './combiningAlgorithms/FirstApplicable';

class Policy {

  constructor(key, rules, actions, combiningAlgorithm) {
    this.actions = actions;
    this.key = key;
    this.rules = rules;
    this.combiningAlgorithm = combiningAlgorithm;
    this.isActive = false;
  }

  get actions() {
    return this._actions;
  }

  get combiningAlgorithm() {
    return this._combiningAlgorithm;
  }

  get isActive() {
    return this._isActive;
  }

  get key() {
    return this._key;
  }

  get rules() {
    return this._rules;
  }

  set combiningAlgorithm(combiningAlgorithm) {
    if (combiningAlgorithm === 'denyOverrides') {
      this._combiningAlgorithm = new DenyOverrides();
    } else {
      if (combiningAlgorithm === 'firstApplicable') {
        this._combiningAlgorithm = new FirstApplicable();
      } else {
        throw Error('Unknown algorithm: ' + combiningAlgorithm);
      }
    }
  }

  set actions(actions) {
    this._actions = actions;
  }

  set isActive(isActive) {
    this._isActive = isActive;
  }

  set key(key) {
    this._key = key;
  }

  set rules(rules) {
    this._rules = rules;
  }

  //TODO: FIX
  addRule(rule) {
    this._rules.push(rule);
  }

  deleteRule(scope, target, condition) {
    delete this.rules[scope][target][condition];
  }

  enforceActions(context, message, authDecision) {
    for (let i in this.actions) {
      context[this.actions[i]](message, authDecision);
    }
  }

  evaluate(context, message) {
    let results = [];

    for (let i in this.rules) {
      results.push(this.rules[i].evaluate(context, message));
    }

    return this.combiningAlgorithm.evaluate(results);
  }

}

export default Policy;
