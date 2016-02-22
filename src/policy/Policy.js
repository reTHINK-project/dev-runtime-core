class Policy {

  constructor(id, scope, condition, authorise, actions) {
    let _this = this;
    _this.id = id;
    _this.scope = scope;
    _this.condition = condition;
    _this.authorise = authorise;
    _this.actions = actions;
  }

}

export default Policy;
