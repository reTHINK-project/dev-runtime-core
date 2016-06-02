import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import persistenceManager from '../src/persistence/PersistenceManager';
import PolicyEngine from '../src/policy/PolicyEngine';

let runtimeRegistry = {
  runtimeURL: 'runtime://localhost/7601'
};

let identityModule = {
  getIdentityAssertion: () => {
    return new Promise(function(resolve, reject) {
      let token = {
        id: 'identity'
      };
      if (!token) {
        reject('token not found');
      } else {
        resolve(token);
      }
    });
  }
};

describe('Policy Engine', function() {
  let policyEngine = new PolicyEngine(identityModule, runtimeRegistry);

  let policy1 = {
    actions: [],
    authorise: false,
    condition: 'source in blockedEmails',
    scope: 'user'
  };

  let policy2 = {
    actions: [],
    authorise: false,
    condition: 'source in students',
    scope: 'user'
  };

  describe('policies management', function() {
    it('associates a policy with the user scope', function() {
      policyEngine.addPolicies([policy1]);
      expect(policyEngine.getApplicablePolicies('user')).to.be.eql([policy1]);
    });

    it('associates a second policy with the user scope', function() {
      policyEngine.addPolicies([policy2]);
      expect(policyEngine.getApplicablePolicies('user')).to.be.eql([policy1, policy2]);
    });

    it('removes an existing policy associated with the user scope', function() {
      policyEngine.removePolicies('source in blockedEmails', 'user');
      expect(policyEngine.getApplicablePolicies('user')).to.be.eql([policy2]);
    });

    it('tries to remove a policy that does not exist with the user scope', function() {
      policyEngine.removePolicies('block-08-20', 'user');
      expect(policyEngine.getApplicablePolicies('user')).to.be.eql([policy2]);
    });

    it('removes all policies associated with the application scope', function() {
      policyEngine.removePolicies('*', 'application');
      expect(policyEngine.getApplicablePolicies('application')).to.be.eql([]);
    });

    it('removes all policies associated with the user scope', function() {
      policyEngine.removePolicies('*', 'user');
      expect(policyEngine.getApplicablePolicies('user')).to.be.eql([]);
    });

    it('removes all policies', function() {
      policyEngine.removePolicies('*', '*');
      expect(policyEngine.getApplicablePolicies('*')).to.be.eql([]);
    });
  });

  let userEmail1 = 'openidtest10@gmail.com';

  describe('groups management', function() {
    persistenceManager.delete('groups');
    let groupName1 = 'groupA';

    it('creates a group', function() {
      policyEngine.createGroup(groupName1);
      expect(policyEngine.getGroupsNames()).to.be.eql([groupName1]);
    });

    let groupName2 = 'groupB';

    it('creates a second group', function() {
      policyEngine.createGroup(groupName2);
      expect(policyEngine.getGroupsNames()).to.be.eql([groupName1, groupName2]);
    });

    it('adds an email to a group', function() {
      policyEngine.addToGroup(userEmail1, groupName1);
      expect(policyEngine.getList(groupName1)).to.be.eql([userEmail1]);
    });

    let userEmail2 = 'openidtest20@gmail.com';

    it('adds a second email to a group', function() {
      policyEngine.addToGroup(userEmail2, groupName1);
      expect(policyEngine.getList(groupName1)).to.be.eql([userEmail1, userEmail2]);
    });

    it('removes a user from a group', function() {
      policyEngine.removeFromGroup(userEmail1, groupName1);
      expect(policyEngine.getList(groupName1)).to.be.eql([userEmail2]);
    });

    it('deletes a group', function() {
      policyEngine.deleteGroup(groupName1);
      expect(policyEngine.getList(groupName1)).to.be.eql([]);
      expect(policyEngine.getGroupsNames()).to.be.eql([groupName2]);
    });
  });

  let messageWithoutID = {
    id: 1,
    type: 'read',
    from: 'hyperty://ua.pt/asdf',
    to: 'domain://registry.ua.pt/hyperty-instance/user'
  };

  let messageWithID = {
    body: {
      auth: false,
      identity: {
        id: 'identity'
      }
    },
    id: 1,
    type: 'read',
    from: 'hyperty://ua.pt/asdf',
    to: 'domain://registry.ua.pt/hyperty-instance/user'
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

  let messageFromBlocked = {
    body: {
      identity: {
        email: userEmail1
      }
    },
    id: 1,
    type: 'read',
    from: 'hyperty://ua.pt/asdf',
    to: 'domain://registry.ua.pt/hyperty-instance/user'
  };

  describe('functionality: source', function() {
    it('rejects the message as it comes from a blocked source', function(done) {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([policy1]);
      policyEngine.addToGroup(userEmail1, 'blockedEmails');
      expect(policyEngine.authorise(messageFromBlocked).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });
  });

  describe('functionality: time of the day', function() {
    let timePolicy = {
      scope: 'application',
      condition: 'time betweenMinutes 2300 1600',
      authorise: false,
      actions: []
    };

    it('rejects the message as it is received in a blocked timeslot', function(done) {
      policyEngine.pdp.systemVariables.time = () => { return 1530; };
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([timePolicy]);
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a timeslot not blocked', function(done) {
      policyEngine.pdp.systemVariables.time = () => { return 1700; };
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  describe('functionality: date', function() {
    let datePolicy = {
      scope: 'application',
      condition: 'date in blockedDates',
      authorise: false,
      actions: []
    };

    it('rejects the message as it is received in a blocked date', function(done) {
      policyEngine.pdp.systemVariables.date = () => { return '01/01/2016'; };
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([datePolicy]);
      policyEngine.addToGroup('01/01/2016', 'blockedDates');
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a timeslot not blocked', function(done) {
      policyEngine.pdp.systemVariables.date = () => { return '02/01/2016'; };
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  let userEmail3 = 'openidtest10@microsoft.com';

  let messageFromAllowed = {
    body: {
      identity: {
        email: userEmail3
      }
    },
    id: 1,
    type: 'read',
    from: 'hyperty://ua.pt/asdf',
    to: 'domain://registry.ua.pt/hyperty-instance/user'
  };

  let outMessageFromAllowed = {
    body: {
      auth: true,
      identity: {
        email: userEmail3
      }
    },
    id: 1,
    type: 'read',
    from: 'hyperty://ua.pt/asdf',
    to: 'domain://registry.ua.pt/hyperty-instance/user'
  };

  describe('functionality: domain', function() {
    let domainPolicy = {
      scope: 'application',
      condition: 'domain in blockedDomains',
      authorise: false,
      actions: []
    };

    it('rejects the message as it comes from a blocked domain', function(done) {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([domainPolicy]);
      policyEngine.addToGroup('gmail.com', 'blockedDomains');
      expect(policyEngine.authorise(messageFromBlocked).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a domain that is not blocked', function(done) {
      expect(policyEngine.authorise(messageFromAllowed).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(outMessageFromAllowed).and.notify(done);
    });
  });

  describe('functionality: weekday', function() {
    let weekdayPolicy = {
      scope: 'application',
      condition: 'weekday in blockedWeekdays',
      authorise: false,
      actions: []
    };

    it('rejects the message as it is received in a blocked weekday', function(done) {
      policyEngine.pdp.systemVariables.weekday = () => { return '0'; };
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([weekdayPolicy]);
      policyEngine.addToGroup('0', 'blockedWeekdays');
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a weekday that is not blocked', function(done) {
      policyEngine.pdp.systemVariables.weekday = () => { return '1'; };
      expect(policyEngine.authorise(messageFromAllowed).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(outMessageFromAllowed).and.notify(done);
    });
  });

  /*describe('data objects management', function() {
    let objectCreation = {
      body: {
        authorise: [],
        value: {
          reporter: 'hyperty://localhost/1be8f8ca-b510-464f-91ab-0434d86ff8be'
        }
      },
      from: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
      id: 1,
      to: 'runtime://localhost/7601/sm',
      type: 'create'
    };

    let objectCreationOut = {
      body: {
        auth: false,
        authorise: [],
        identity: {
          id: 'identity'
        },
        value: {
          reporter: 'hyperty://localhost/1be8f8ca-b510-464f-91ab-0434d86ff8be'
        }
      },
      from: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
      id: 1,
      to: 'runtime://localhost/7601/sm',
      type: 'create'
    };

    it('allows object creation', function(done) {
      expect(policyEngine.authorise(objectCreation).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(objectCreationOut).and.notify(done);
    });

    it('sets waitingIDs[message.id] = reporterURL', function() {
      expect(policyEngine.waitingIDs).to.be.eql({1: {reporter: 'hyperty://localhost/1be8f8ca-b510-464f-91ab-0434d86ff8be', preAuthorised: []}});
    });

    let objectCreationResponse = {
      body: {
        resource: 'comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b'
      },
      from: 'runtime://localhost/7601/sm',
      id: 1,
      to: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
      type: 'response'
    };

    let objectCreationResponseOut = {
      body: {
        auth: false,
        identity: {
          id: 'identity'
        },
        resource: 'comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b'
      },
      from: 'runtime://localhost/7601/sm',
      id: 1,
      to: 'hyperty://localhost/e5c09447-26d5-4284-9ada-a3c479cc960b',
      type: 'response'
    };

    it('allows object creation response', function(done) {
      expect(policyEngine.authorise(objectCreationResponse).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(objectCreationResponseOut).and.notify(done);
    });

    it('deletes waitingIDs[message.id]', function() {
      expect(policyEngine.waitingIDs).to.be.eql({});
    });

    it('stores reporterURL and pre-authorised users along with the object URL', function() {
      expect(policyEngine.pdp.dataObjectsInfo).to.be.eql({'comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b': {reporter: 'hyperty://localhost/1be8f8ca-b510-464f-91ab-0434d86ff8be', preAuthorised: []}});
    });

    let objectSubscription = {
      body: {
        subscriber: 'hyperty://localhost/428005ed-863e-49fe-835a-a29d5626a036'
      },
      from: 'runtime://localhost/792/sm',
      id: 5,
      to: 'comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b/subscription',
      type: 'subscribe'
    };

    let allowPreAuthorisedSubscribers = {
      actions: [],
      authorise: true,
      condition: 'subscription preauthorised',
      scope: 'subscribe'
    };

    it('adds a subscription policy', function() {
      policyEngine.addPolicies([allowPreAuthorisedSubscribers]);
      expect(policyEngine.getApplicablePolicies('subscribe')).to.be.eql([allowPreAuthorisedSubscribers]);
    });

    it('blocks the subscription attempt of a non pre-authorised subscriber', function(done) {
      expect(policyEnto.be.rejected.and.notify(done);ect) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    let objectSubscriptionOut = {
      body: {
        auth: true,
        identity: {
          id: 'identity'
        },
        subscriber: 'hyperty://localhost/428005ed-863e-49fe-835a-a29d5626a036'
      },
      from: 'runtime://localhost/792/sm',
      id: 5,
      to: 'comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b/subscription',
      type: 'subscribe'
    };

    it('allows the subscription attempt of a pre-authorised subscriber', function(done) {
      policyEngine.pdp.dataObjectsInfo['comm://localhost/19fbde08-448a-4715-bfbb-427ca3126d7b'].preAuthorised = ['hyperty://localhost/428005ed-863e-49fe-835a-a29d5626a036'];
      expect(policyEngine.authorise(objectSubscription).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(objectSubscriptionOut).and.notify(done);
    });

    let blockAnySubscribers = {
      actions: [],
      authorise: false,
      condition: 'subscription any',
      scope: 'subscribe'
    };

    it('blocks the subscription attempt of all subscribers', function(done) {
      policyEngine.removePolicies('subscription preauthorised', 'subscribe');
      policyEngine.addPolicies([blockAnySubscribers]);
      expect(policyEngine.authorise(objectSubscription).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    let allowAnySubscribers = {
      actions: [],
      authorise: true,
      condition: 'subscription any',
      scope: 'subscribe'
    };

    it('allows the subscription attempt of all subscribers', function(done) {
      policyEngine.removePolicies('subscription any', 'subscribe');
      policyEngine.addPolicies([allowAnySubscribers]);
      expect(policyEngine.authorise(objectSubscription).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(objectSubscriptionOut).and.notify(done);
    });

  });*/
});
