import AllowOverrides from './combiningAlgorithms/AllowOverrides';
import BlockOverrides from './combiningAlgorithms/BlockOverrides';
import FirstApplicable from './combiningAlgorithms/FirstApplicable';
import Rule from './Rule';

class Policy {

  constructor(key, rules, actions, combiningAlgorithm) {
    if (!key) throw new Error('key is not defined');
    if (!actions) throw new Error('actions are not defined');

    this.actions = actions;
    this.key = key;
    this._setRules(rules);
    this._setCombiningAlgorithm(combiningAlgorithm);
  }

  addAction(method, param) {
    this.actions.push({ method: method, param: param });
  }

  createRule(decision, condition, scope, target, priority) {
    if (priority === undefined) {
      priority = this.getLastPriority() + 1;
    }
    let rule = new Rule(decision, condition, scope, target, priority);
    this.rules.push(rule);
  }

  deleteRule(rule) {
    let indexToRemove = this.rules.indexOf(rule);
    this.rules.splice(indexToRemove, 1);
  }

  enforceActions(context, message) {
    return new Promise((resolve, reject) => {
      let results = [];
      if (this.actions.length !== 0) {
        for (let i in this.actions) {
          let result = context.pep.actionsService[this.actions[i].method](message, this.actions[i].param);
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

  evaluateRules(context, message, isIncoming) {
    let results = [];
    for (let i in this.rules) {
      results.push(this.rules[i].evaluate(context, message, isIncoming));
    }

    return this.combiningAlgorithm.combine(results);
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
      if (String(this.rules[i].priority) === String(priority)) {
        return this.rules[i];
      }
    }
    throw Error('Rule with priority ' + priority + ' does not exist!');
  }

  _setCombiningAlgorithm(combiningAlgorithm) {
    if (!combiningAlgorithm) {
      combiningAlgorithm = 'blockOverrides';
    }
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

  _setRules(rules) {
    this.rules = [];

    for (let i in rules) {
      let rule = rules[i];
      if (rule.priority === undefined) {
        rule.priority = this.getLastPriority() + 1;
      }
      if (!(rule instanceof Rule)) {
        rule = new Rule(rule.decision, rule.condition, rule.scope, rule.target, rule.priority);
      }
      this.rules.push(rule);
    }
  }

  sortRules() {
    return this.rules.sort(function(a, b) {
      let x = a.priority; let y = b.priority;
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

}

export default Policy;
