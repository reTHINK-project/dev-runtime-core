import Operators from '../Operators';

class Condition {

  constructor(attribute, operator, params) {
    this.attribute = attribute;
    this.operator = operator;
    this.params = params;
    this.operators = new Operators();
  }

  isApplicable(context, message) {
    context[this.attribute] = { message: message };
    let value = context[this.attribute];
    let tempParam;
    if (this.operator === 'in') {
      if (this.params === 'preauthorised') {
        let dataObjectURL = message.to.split('/');
        dataObjectURL.pop();
        dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2];
        tempParam = context.runtimeRegistry.getPreAuthSubscribers(dataObjectURL);
      } else {
        tempParam = context.policyEngine.getGroup(this.params);
      }
    }
    if (!tempParam) {
      return this.operators[this.operator]([this.params, value]);
    } else {
      return this.operators[this.operator]([tempParam, value]);
    }
  }

}

export default Condition;
