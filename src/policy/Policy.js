import DenyOverrides from './combiningAlgorithms/DenyOverrides';
import FirstApplicable from './combiningAlgorithms/FirstApplicable';

class Policy {

  constructor(key, rules, actions, combiningAlgorithm) {
    this.actions = actions;
    this.key = key;
    this.rules = rules;
    this.combiningAlgorithm = combiningAlgorithm;
  }

  get combiningAlgorithm() {
    return this._combiningAlgorithm;
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
