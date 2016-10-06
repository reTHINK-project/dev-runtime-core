import AllowOverrides from './combiningAlgorithms/AllowOverrides';
import BlockOverrides from './combiningAlgorithms/BlockOverrides';
import FirstApplicable from './combiningAlgorithms/FirstApplicable';
import Rule from './Rule';

class Policy {

  constructor(key, rules, actions, combiningAlgorithm) {
    this.actions = actions;
    this.key = key;
    this.setRules(rules);
    if (!combiningAlgorithm) {
      combiningAlgorithm = 'blockOverrides';
    }
    this.setCombiningAlgorithm(combiningAlgorithm);
  }

  setCombiningAlgorithm(combiningAlgorithm) {
    switch (combiningAlgorithm) {
      case 'blockOverrides':
        this.combiningAlgorithm = new BlockOverrides();
        break;
      case 'allowOverrides':
        this.combiningAlgorithm = new AllowOverrides();
        break;
      case 'firstApplicable':
        this.combiningAlgorithm = new FirstApplicable();
        break;
      default:
        throw Error('Unknown algorithm: ' + combiningAlgorithm);
    }
  }

  setRules(rules) {
    this.rules = [];

    for (let i in rules) {
      let rule = rules[i];
      if (rule.priority === undefined) {
        rule.priority = this.getLastPriority() + 1;
      }
      if (!(rule instanceof Rule)) {
        rule = new Rule(rule.authorise, rule.condition, rule.scope, rule.target, rule.priority);
      }
      this.rules.push(rule);
    }
  }

  enforceActions(context, message, authDecision) {
    return new Promise((resolve, reject) => {
      let results = [];
      if (this.actions.length !== 0) {
        for (let i in this.actions) {
          let result = context.pep.actionsService[this.actions[i].method](message, this.actions[i].param, authDecision);
          results.push(result);
        }
        Promise.all(results).then((messages) => {
          resolve(messages);
        }, error => {
          reject(error);
        });
      } else {
        resolve([message]);
      }
    });
  }

  evaluate(context, message) {
    let results = [];
    for (let i in this.rules) {
      results.push(this.rules[i].evaluate(context, message));
    }

    return this.combiningAlgorithm.evaluate(results);
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
}

export default Policy;
