import Operators from './Operators';

/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/
class PDP {

  /**
  * This method is invoked by the Policy Engine and instantiates the Policy Decision Point. It
  * initialises or loads from the Persistence Manager the object 'myGroups' to store the user's
  * groups.
  * @param  {Registry}    muchruntimeRegistry
  */
  constructor(context) {
    let _this = this;
    _this.context = context;
    _this.operators = new Operators(context);
  }

  /**
  * Verifies if the given message is compliant with the given policies. If one of the policies
  * evaluates to 'false', then the message is not authorised. Returns the final authorisation
  * decision and a set of actions that policies may require.
  * @param {Message}  message
  * @param {URL}      hypertyToVerify
  * @param {Array}    policies
  * @return {Array}   [authDecision, actions]
  */
  evaluate(message, policies) {
    let _this = this;
    let results = [true];
    let actions = [];
    for (let i in policies) {
      let policy = policies[i];
      let condition = policy.condition;
      let verifiesCondition = false;
      if (typeof condition === 'object') {
          verifiesCondition = _this.verifiesAdvancedCondition(condition[0], condition[1], condition[2], policy.scope, message);
      } else {
        verifiesCondition = _this.verifiesSimpleCondition(condition, policy.scope, message);
      }

      if (verifiesCondition) {
        results.push(policy.authorise);
      }
      if (policy.actions !== []) {
        for (let i in policy.actions) {
          let newAction = {
            method: policy.actions[i].method,
            params: message
          };
          actions.push(newAction);
        }
      }
    }

    let authDecision = results.indexOf(false) === -1;
    return [authDecision, actions];
  }

  verifiesSimpleCondition(condition, scope, message) {
    let _this = this;
    let splitCondition = condition.split(' ');
    let variable = splitCondition[0];
    let operator = splitCondition[1];

    let params;
    if (operator === 'in') {
        _this.context.group = {scope: scope, group: splitCondition[2], destination: message.to};
        params = _this.context.group;
    } else {
      params = splitCondition.slice(2);
    }
    _this.context[variable] = {message: message};
    let value = _this.context[variable];
    return _this.operators.operators[operator]([params, value]);
  }

  verifiesAdvancedCondition(operator, left, right, scope, message) {
    let _this = this;
    while (typeof left === 'object') {
      left = _this.verifiesAdvancedCondition(left[0], left[1], left[2], scope, message);
    }
    if (right !== undefined) {
      while (typeof right === 'object') {
        right = _this.verifiesAdvancedCondition(right[0], right[1], right[2], scope, message);
      }
    }

    let resultLeft = (typeof left === 'boolean') ? left : _this.verifiesSimpleCondition(left, scope, message);

    let resultRight;
    if (right !== undefined) {
      resultRight = (typeof right === 'boolean') ? right : _this.verifiesSimpleCondition(right, scope, message);
    }

    return _this.operators.operators[operator]([resultLeft, resultRight]);
  }
}

export default PDP;
