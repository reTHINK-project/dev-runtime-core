/**
* A Policy is comprised of the following fields:
* - ID: a unique identifier to allow referencing policies
* - CONDITION: an expression that allows the definition of the requirement that the policy imposes.
* - AUTHORISE: a boolean to specify the authorisation decision that results from the applicability
* of the policy.
* - ACTIONS: an optional array of actions to be executed.
*/
class Policy {
  constructor(id, condition, authorise, actions) {
    let _this = this;
    _this.id = id;
    _this.condition = condition;
    _this.authorise = authorise;
    _this.actions = actions;
  }

}

export default Policy;
