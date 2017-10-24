/**
* The Identity Data Model is used to model the reTHINK User entity. The Identity data model is handled by Identity Management functionality.
*
*/
class Identity {

  constructor(guid, type) {
    let _this = this;

    _this.guid = guid;
    _this.type = type;
    _this.identifiersList = {};

  }

  addIdentity(identifier) {
    let _this = this;
    let identityInformation = {
      idAssertion: '',
      serviceAddress: '',
      authenticationData: '',
      authorisationData: '',
      userProfile: ''
    };
    _this.identifiersList[identifier] = identityInformation;
  }

  addIdAssertion(identifier, assertion, idp, scope) {
    let _this = this;

    let newIdAssertion = new IdAssertion(assertion, idp, scope);

    _this.idAssertionList.push(newIdAssertion);
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

  validates(identity, contents) {
    //TODO implement the logic

  }
}

export default Identity;
