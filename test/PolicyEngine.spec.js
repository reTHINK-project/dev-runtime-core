import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

//Main dependencies
import PolicyEngine from '../src/policy/PolicyEngine';

// Testing Policy Engine

let runtimeRegistry = 'registry mockup';

let identityModule = {
  getIdentities: () => {
    let identities = [];
    let identityBundle = {identity: 'user://gmail.com/openidtest10', token: 'idToken'};
    identities.push(identityBundle);
    return identities;
  },
  loginWithRP: (domain, scope) => {
    return new Promise(function(resolve, reject) {
      let token = {
        id: 'identity'
      };
      if (token === null) {
        reject('token not found');
      } else {
        resolve(token);
      }
    });
  }
};

describe('PolicyEngine', function() {

  let policyEngine = new PolicyEngine(identityModule, runtimeRegistry);

  describe('authorise(message) without assertedIdentity in body', function() {

    let message = {id: 123, type:'READ', from:'hyperty://ua.pt/asdf',
                  to:'domain://registry.ua.pt/hyperty-instance/user'};

    let expectedMessage = {id: 123, type:'READ', from:'hyperty://ua.pt/asdf',
                          to:'domain://registry.ua.pt/hyperty-instance/user',
                          body: {assertedIdentity: 'user://gmail.com/openidtest10',
                                 idToken:  '{"id":"identity"}',
                                 authorised: true}};

    it('should add an assertedIdentity in the message body', function(done) {

      expect(policyEngine.authorise(message).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);
    });
  });

  //expetct
  describe('authorise(message) with assertedIdentity in body', function() {
    let message = {id: 3212, type:'READ', from:'hyperty://ua.pt/asdf',
                            to:'hyperty://ua.pt/FindHyperty',
                            body: {assertedIdentity: 'value', authorised: 'true', token: 'tokenID'}};

    let expectedMessage = {id: 3212, type:'READ', from:'hyperty://ua.pt/asdf',
                            to:'hyperty://ua.pt/FindHyperty',
                            body: {assertedIdentity: 'value', authorised: 'true', token: 'tokenID'}};

    it('should maintain the assertedIdentity in the message body', function(done) {

      expect(policyEngine.authorise(message).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);
    });
  });

});
