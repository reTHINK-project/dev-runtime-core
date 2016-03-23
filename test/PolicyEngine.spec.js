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
let messageBus = {
  addListener: (msg, callback) => { }};

describe('Policy Engine', function() {
  let policyEngine = new PolicyEngine(messageBus, identityModule, runtimeRegistry);

  let messageWithoutID = {
    id: 1,
    type:'read',
    from:'hyperty://ua.pt/asdf',
    to:'domain://registry.ua.pt/hyperty-instance/user'
  };

  let messageWithID = {
    id: 1,
    type:'read',
    from:'hyperty://ua.pt/asdf',
    to:'domain://registry.ua.pt/hyperty-instance/user',
    body: {
      assertedIdentity: 'user://gmail.com/openidtest10',
      idToken: {
        id:'identity'
      }
    },
    authorised: true
  };

  describe('assertedIdentity', function() {
    it('should add an assertedIdentity in the message body', function(done) {
      expect(policyEngine.authorise(messageWithoutID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });

    it('should maintain the assertedIdentity in the message body', function(done) {
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  let userScope = 'user';
  let applicationScope = 'application';
  let policy1 = new Policy('allow-listA', 'list listA', true, []);
  let policy2 = new Policy('block-listB', 'list listB', false, []);
  let policy3 = new Policy('block-listC', 'list listC', false, []);

  describe('addPolicies', function() {
    it('associates a policy with the user scope', function() {
      policyEngine.addPolicies([policy1], userScope);
      expect(policyEngine.getApplicablePolicies(userScope)).to.be.eql([policy1]);
    });
    it('associates a second policy with the user scope', function() {
      policyEngine.addPolicies([policy2], userScope);
      expect(policyEngine.getApplicablePolicies(userScope)).to.be.eql([policy1, policy2]);
    });
    it('associates a policy with the application scope', function() {
      policyEngine.addPolicies([policy3], applicationScope);
      expect(policyEngine.getApplicablePolicies(applicationScope)).to.be.eql([policy3]);
    });
  });

  describe('removePolicies', function() {
    it('removes an existing policy associated with the user scope', function() {
      policyEngine.removePolicies('allow-listA', userScope);
      expect(policyEngine.getApplicablePolicies(userScope)).to.be.eql([policy2]);
    });
    it('tries to remove a policy that is not associated with the user scope', function() {
      policyEngine.removePolicies('block-08-20', userScope);
      expect(policyEngine.getApplicablePolicies(userScope)).to.be.eql([policy2]);
    });
    it('removes all policies associated with the application scope', function() {
      policyEngine.removePolicies('*', applicationScope);
      expect(policyEngine.getApplicablePolicies(applicationScope)).to.be.eql([]);
    });
  });

  let listName1 = 'listA';

  describe('createList', function() {
    it('creates a list of users', function() {
      policyEngine.createList(listName1);
      expect(policyEngine.getList(listName1)).to.be.eql([]);
    });
  });

  let userEmail1 = 'openidtest10@gmail.com';
  let userEmail2 = 'openidtest20@gmail.com';

  describe('addToList', function() {
    it('adds a user to a list of users', function() {
      policyEngine.addToList(userEmail1, listName1);
      expect(policyEngine.getList(listName1)).to.be.eql([userEmail1]);
    });

    it('adds a second user to a list of users', function() {
      policyEngine.addToList(userEmail2, listName1);
      expect(policyEngine.getList(listName1)).to.be.eql([userEmail1, userEmail2]);
    });
  });

  describe('removeFromList', function() {
    it('adds a user from a list of users', function() {
      policyEngine.removeFromList(userEmail1, listName1);
      expect(policyEngine.getList(listName1)).to.be.eql([userEmail2]);
    });
  });

});
