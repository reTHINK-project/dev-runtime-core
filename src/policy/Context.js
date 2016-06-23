class Context {

  constructor() {
    if (this.constructor === Context) {
      throw new TypeError('Can not construct abstract class.');
    }
    if (this.constructor === Context.prototype.constructor) {
      throw new TypeError('Please implement abstract method constructor.');
    }
  }

  static loadPolicies() {
    if (this === Context) {
      throw new TypeError('Can not call static abstract method loadPolicies.');
    } else if (this.loadPolicies === Context.loadPolicies) {
      throw new TypeError('Please implement static abstract method loadPolicies.');
    } else {
      throw new TypeError('Do not call static abstract method loadPolicies from child.');
    }
  }

  static isToVerify() {
    if (this === Context) {
      throw new TypeError('Can not call static abstract method isToVerify.');
    } else if (this.isToVerify === Context.isToVerify) {
      throw new TypeError('Please implement static abstract method isToVerify.');
    } else {
      throw new TypeError('Do not call static abstract method isToVerify from child.');
    }
  }

  static getApplicablePolicies() {
    if (this === Context) {
      throw new TypeError('Can not call static abstract method getApplicablePolicies.');
    } else if (this.getApplicablePolicies === Context.getApplicablePolicies) {
      throw new TypeError('Please implement static abstract method getApplicablePolicies.');
    } else {
      throw new TypeError('Do not call static abstract method getApplicablePolicies from child.');
    }
  }

  static applyPolicies() {
    if (this === Context) {
      throw new TypeError('Can not call static abstract method applyPolicies.');
    } else if (this.applyPolicies === Context.applyPolicies) {
      throw new TypeError('Please implement static abstract method applyPolicies.');
    } else {
      throw new TypeError('Do not call static abstract method applyPolicies from child.');
    }
  }

  static authorise() {
    if (this === Context) {
      throw new TypeError('Can not call static abstract method authorise.');
    } else if (this.authorise === Context.authorise) {
      throw new TypeError('Please implement static abstract method authorise.');
    } else {
      throw new TypeError('Do not call static abstract method authorise from child.');
    }
  }

}

export default Context;
