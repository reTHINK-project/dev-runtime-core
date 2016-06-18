class PEP {

  constructor(context) {
    let _this = this;
    _this.context = context;
  }

  enforce(result) {
    let _this = this;
    let authDecision = result[0];
    let actions = result[1];

    for (let i in actions) {
      _this.context[actions[i].method](actions[i].params, authDecision);
    }
  }

  sendAutomaticMessage() {}

  forwardToID() {}

  forwardToHyperty() {}

}

export default PEP;
