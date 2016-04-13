/**
* The Identity Data Model is used to model the reTHINK User entity. The Identity data model is handled by Identity Management functionality.
*
*/

class Identity {

  constructor(guid, identifiers) {
    let _this = this;

    _this.guid = guid;
    _this.identifiers = identifiers;

    _this.idAssertion = {};
  }
}

class IdAssertion {

  constructor(assertion, idp, scope) {
    let _this = this;

    _this.assertion = assertion;
    _this.idp = idp;
    _this.scope = scope;
  }

}

class IdValidation {

  constructor(identity, contents) {
    let _this = this;
    _this.identity = identity;
    _this.contents = contents;
  }

  validates() {

  }
}

export default Identity;
export default IdAssertion;
export default IdValidation;
