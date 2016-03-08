import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import PolicyEngine from '../src/policy/PolicyEngine';
import Policy from '../src/policy/Policy';

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
                                 idToken:  {id:'identity'}}};

    it('should add an assertedIdentity in the message body', function(done) {

      expect(policyEngine.authorise(message).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);
    });
  });

  describe('authorise(message) with assertedIdentity in body', function() {
    let message = {id: 3212, type:'READ', from:'hyperty://ua.pt/asdf',
                            to:'hyperty://ua.pt/FindHyperty',
                            body: {assertedIdentity: 'value', token: 'tokenID'}};

    let expectedMessage = {id: 3212, type:'READ', from:'hyperty://ua.pt/asdf',
                            to:'hyperty://ua.pt/FindHyperty',
                            body: {assertedIdentity: 'value', token: 'tokenID'}};

    it('should maintain the assertedIdentity in the message body', function(done) {

      expect(policyEngine.authorise(message).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(expectedMessage).and.notify(done);
    });
  });

  let scope = 'user';
  let policy1 = new Policy('allow-whitelisted', 'user', 'whitelisted', true, []);
  let policy2 = new Policy('block-blacklisted', 'user', 'blacklisted', false, []);

  describe('addPolicies', function() {
    it('associates a policy with a scope', function() {
      policyEngine.addPolicies(scope, [policy1]);
      expect(policyEngine.getApplicablePolicies(scope)).to.be.eql([policy1]);
    });
    it('associates a policy with an hyperty instance', function() {
      policyEngine.addPolicies(scope, [policy2]);
      expect(policyEngine.getApplicablePolicies(scope)).to.be.eql([policy1, policy2]);
    });
  });

  let policy3 = new Policy('block-08-20', 'scope', 'time 08:00 20:00', true, []);

  describe('removePolicies', function() {
    it('removes the policy with the given ID associated with a scope', function() {
      policyEngine.addPolicies(scope, [policy3]);
      policyEngine.removePolicies(scope, 'allow-whitelisted');
      expect(policyEngine.getApplicablePolicies(scope)).to.be.eql([policy2, policy3]);
      policyEngine.removePolicies(scope, 'block-08-20');
      policyEngine.removePolicies(scope, 'block-blacklisted');
      expect(policyEngine.getApplicablePolicies(scope)).to.be.eql([]);
    });

    it('removes all policies associated with a scope', function() {
      policyEngine.addPolicies(scope, [policy1]);
      policyEngine.removePolicies(scope, 'all');
      expect(policyEngine.getApplicablePolicies(scope)).to.be.eql([]);
    });
  });

});
