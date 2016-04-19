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
  addgroupener: (msg, callback) => { }};

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
      identity: 'user://gmail.com/openidtest10',
      idToken: {
        id:'identity'
      }
    },
    authorised: true
  };

  describe('identity', function() {
    it('should add an identity in the message body', function(done) {
      expect(policyEngine.authorise(messageWithoutID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });

    it('should maintain the identity in the message body', function(done) {
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  let userScope = 'user';
  let applicationScope = 'application';
  let policy1 = new Policy('allow-groupA', 'group groupA', true, []);
  let policy2 = new Policy('block-groupB', 'group groupB', false, []);
  let policy3 = new Policy('block-groupC', 'group groupC', false, []);

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
      policyEngine.removePolicies('allow-groupA', userScope);
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

  let groupName1 = 'groupA';

  describe('creategroup', function() {
    it('creates a group of users', function() {
      policyEngine.createGroup(groupName1);
      expect(policyEngine.getGroup(groupName1)).to.be.eql([]);
    });
  });

  let userEmail1 = 'openidtest10@gmail.com';
  let userEmail2 = 'openidtest20@gmail.com';

  describe('addToGroup', function() {
    it('adds a user to a group of users', function() {
      policyEngine.addToGroup(userEmail1, groupName1);
      expect(policyEngine.getGroup(groupName1)).to.be.eql([userEmail1]);
    });

    it('adds a second user to a group of users', function() {
      policyEngine.addToGroup(userEmail2, groupName1);
      expect(policyEngine.getGroup(groupName1)).to.be.eql([userEmail1, userEmail2]);
    });
  });

  describe('removeFromGroup', function() {
    it('adds a user from a group of users', function() {
      policyEngine.removeFromGroup(userEmail1, groupName1);
      expect(policyEngine.getGroup(groupName1)).to.be.eql([userEmail2]);
    });
  });

  describe('sync policy', function() {
    let updatePolicy = {
      id: 'block-observer-changes',
      scope: 'global',
      condition: 'sync update reporter',
      authorise: true,
      actions: []
    };

    let objectCreation = {
      body: {
        resource: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23'
      },
      from: 'runtime://localhost/7601/sm',
      to: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
      type: 'response'
    };

    let validUpdate = {
      body: {
        source: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b'
      },
      from: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23',
      to: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23/changes',
      type: 'update'
    };

    let outMessage = {
      body: {
        source: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
        identity: 'user://gmail.com/openidtest10',
        idToken: {
          id: 'identity'
        }
      },
      from: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23',
      to: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23/changes',
      type: 'update',
      authorised: true
    };

    it('allows reporter changes', function(done) {
      policyEngine.addPolicies([updatePolicy], 'objectManagement');
      policyEngine.authorise(objectCreation);
      expect(policyEngine.authorise(validUpdate).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(outMessage).and.notify(done);
    });

    let invalidUpdate = {
      body: {
        source: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960c'
      },
      from: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23',
      to: 'fake://localhost/90a3f0d7-b2e2-4cee-a061-3f79c1f71c23/changes',
      type: 'update'
    };

    it('blocks non-reporter changes', function(done) {
      expect(policyEngine.authorise(invalidUpdate).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });
  });
});
