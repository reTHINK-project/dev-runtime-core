import Operators from '../Operators';

class Condition {

  constructor(attribute, operator, params) {
    this.attribute = attribute;
    this.operator = operator;
    this.params = params;
    this.operators = new Operators();
  }

  get attribute() {
    return this._attribute;
  }

  get operator() {
    return this._operator;
  }

  get params() {
    return this._params;
  }

  set attribute(attribute) {
    this._attribute = attribute;
  }

  set operator(operator) {
    this._operator = operator;
  }

  set params(params) {
    this._params = params;
  }

  isApplicable(context, message) {
    context[this.attribute] = { message: message };
    let value = context[this.attribute];

    if (this.operator === 'in') { // source in preauth
      let dataObjectURL = message.to.split('/');
      dataObjectURL.pop();
      dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2];
      this.params = context.runtimeRegistry.getPreAuthSubscribers(dataObjectURL);
    }

    return this.operators[this.operator]([this.params, value]);
  }

}

export default Condition;
