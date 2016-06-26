import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import {divideURL} from '../src/utils/utils';
import MessageNodeCtx from '../src/policy/context/MessageNodeCtx';
import PolicyEngine from '../src/policy/PolicyEngine';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';

/* POLICIES */
let datePolicy = { scope: 'global', condition: 'date in blockedDates', authorise: false, actions: [] };

let domainPolicy = { scope: 'global', condition: 'domain in blockedDomains', authorise: false, actions: [] };

let sourcePolicy = { actions: [], authorise: false, condition: 'source in blockedEmails', scope: 'user' };

let timePolicy = { scope: 'global', condition: 'time between 1400 1700', authorise: false, actions: [] };

let weekdayPolicy = { scope: 'global', condition: 'weekday in blockedWeekdays', authorise: false, actions: [] };

/* MESSAGES */
let message = { body: { identity: { userProfile: { username: 'user@domain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

let messageFromBlocked = { body: { identity: { userProfile: { username: 'user@blockedDomain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

describe('Policy Engine with Message Node context', function() {
  let policyEngine = new PolicyEngine(new MessageNodeCtx());

  it('authorises a valid message', function() {
    expect(policyEngine.authorise(message)).to.be.eql(true);
  });

  describe('functionality: date', function() {
    it('rejects the message as it is received in a blocked date', function() {
      policyEngine.context.pdp.context.date = '01/01/2016';
      policyEngine.addPolicies([datePolicy]);
      policyEngine.addToList('global', 'date', 'blockedDates', '01/01/2016');
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });
  });

  describe('functionality: domain', function() {
    it('rejects the message as it comes from a blocked domain', function() {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([domainPolicy]);
      policyEngine.addToList('global', 'domain', 'blockedDomains', 'blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked)).to.be.eql(false);
    });

    it('allows the message as it comes from a domain that is not blocked', function() {
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: source', function() {
    it('rejects the message as it comes from a blocked source', function() {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([sourcePolicy]);
      policyEngine.addToList('global', 'source', 'blockedEmails', 'user@blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked)).to.be.eql(false);
    });

    it('allows the message as it comes from a source that is not blocked', function() {
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: time of the day', function() {
    it('rejects the message as it is received in a blocked timeslot', function() {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([timePolicy]);
      policyEngine.context.time = 1500;
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });

    it('accepts the message as it is received in a timeslot not blocked', function() {
      policyEngine.context.time = 1701;
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: weekday', function() {
    it('rejects the message as it is received in a blocked weekday', function() {
      policyEngine.context.weekday =  '0';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([weekdayPolicy]);
      policyEngine.addToList('global', 'weekday', 'blockedWeekdays', '0');
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });

    it('allows the message as it comes from a weekday that is not blocked', function() {
      policyEngine.context.weekday = '1';
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });
});

let runtimeRegistry = {
  getPreAuthSubscribers: () => {
    return ['hyperty://domain/hyperty-instance'];
  },
  isDataObjectURL: (dataObjectURL) => {
    return divideURL(dataObjectURL).type === 'comm';
  },
  registerSubscribedDataObject: () => {},
  registerSubscriber: () => {},
  runtimeURL: 'runtime://localhost/7601'
};

let identityModule = {
  decryptMessage: (message) => {
    return new Promise(function(resolve) {
      resolve(message);
    });
  },
  encryptMessage: (message) => {
    return new Promise(function(resolve) {
      resolve(message);
    });
  },
  getIdentityOfHyperty: () => {
    return new Promise(function(resolve) {
      resolve({ userProfile: {username: 'user@domain' } });
    });
  }
};

describe('Policy Engine', function() {
  let policyEngine = new PolicyEngine(new RuntimeCoreCtx(identityModule, runtimeRegistry));
  let policy2 = {
    actions: [],
    authorise: false,
    condition: 'source in students',
    scope: 'user'
  };

  describe('advanced policies management', function() {
    let message = { body: { identity: { userProfile: { username: 'student@gmail.com' } } }, id: 1, type: 'read', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

    let policyOr = { actions: [], authorise: true, condition: ['or', 'source in coleagues', 'source in students'], scope: 'global' };

    let policyAnd = { actions: [], authorise: true, condition: ['and', 'source in coleagues', 'source in students'], scope: 'global' };

    it('stores an advanced policy', function() {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([policyOr]);
      expect(policyEngine.context.getApplicablePolicies('global')).to.be.eql([policyOr]);
    });

    it('deletes an advanced policy', function() {
      policyEngine.removePolicies(policyOr.scope, policyOr.condition);
      expect(policyEngine.context.getApplicablePolicies('global')).to.be.eql([]);
    });

    it('condition is verified when [or false true]', function() {
      policyEngine.addToList('global', 'source', 'students', 'student@gmail.com');
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyOr.condition[0], policyOr.condition[1], policyOr.condition[2], policyOr.scope, message)).to.be.eql(true);
    });

    it('condition is not verified when [and false true]', function() {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyAnd.condition[0], false, true, policyAnd.scope, message)).to.be.eql(false);
    });

    it('condition is verified when [not false]', function() {
      let policyNot = { actions: [], authorise: true, condition: ['not', 'source in coleagues'], scope: 'global' };

      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyNot.condition[0], policyNot.condition[1], undefined, policyNot.scope, message)).to.be.eql(true);
    });

    it('condition is not verified when [not true]', function() {
      let policyNot = { actions: [], authorise: false, condition: ['not', 'source in students', 'source in students'], scope: 'global' };

      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyNot.condition[0], policyNot.condition[1], undefined, policyNot.scope, message)).to.be.eql(false);
    });

    it('condition is not verified when [and [or false true] false]', function() {
      let policyAndOr = {
        actions: [],
        authorise: true,
        condition: ['and', ['or', 'source in blockedEmails', 'source in students'], 'source in coleagues'],
        scope: 'global'
      };
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyAndOr.condition[0], policyAndOr.condition[1], policyAndOr.condition[2], policyAndOr.scope, message)).to.be.eql(false);
    });

    it('condition is verified when [or true [and false true]]', function() {
      let policyAndOr = {
        actions: [],
        authorise: true,
        condition: ['or', 'source in students', ['and', 'source in students', 'source in coleagues']],
        scope: 'global'
      };
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(policyAndOr.condition[0], true, policyAndOr.condition[2], policyAndOr.scope, message)).to.be.eql(true);
    });
  });

  describe('policies management', function() {
    it('associates a policy with the user scope', function() {
      policyEngine.addPolicies([sourcePolicy]);
      expect(policyEngine.context.getApplicablePolicies('user')).to.be.eql([sourcePolicy]);
    });

    it('associates a second policy with the user scope', function() {
      policyEngine.addPolicies([policy2]);
      expect(policyEngine.context.getApplicablePolicies('user')).to.be.eql([sourcePolicy, policy2]);
    });

    it('removes an existing policy associated with the user scope', function() {
      policyEngine.removePolicies('user', 'source in blockedEmails');
      expect(policyEngine.context.getApplicablePolicies('user')).to.be.eql([policy2]);
    });

    it('tries to remove a policy that does not exist with the user scope', function() {
      policyEngine.removePolicies('user', 'block-08-20');
      expect(policyEngine.context.getApplicablePolicies('user')).to.be.eql([policy2]);
    });

    it('removes all policies associated with the application scope', function() {
      policyEngine.removePolicies('application', '*');
      expect(policyEngine.context.getApplicablePolicies('application')).to.be.eql([]);
    });

    it('removes all policies associated with the user scope', function() {
      policyEngine.removePolicies('user', '*');
      expect(policyEngine.context.getApplicablePolicies('user')).to.be.eql([]);
    });

    it('removes all policies', function() {
      policyEngine.removePolicies('*', '*');
      expect(policyEngine.context.getApplicablePolicies('*')).to.be.eql([]);
    });
  });

  let userEmail1 = 'openidtest10@gmail.com';

  describe('groups management', function() {
    let groupName1 = 'groupA';

    it('creates a group', function() {
      //persistenceManager.delete('groups');
      policyEngine.deleteGroup('global', 'students');
      policyEngine.createList('global', 'group', groupName1);
      expect(policyEngine.getGroupsNames('global')).to.be.eql([groupName1]);
    });

    let groupName2 = 'groupB';

    it('creates a second group', function() {
      policyEngine.createList('global', ' group', groupName2);
      expect(policyEngine.getGroupsNames('global')).to.be.eql([groupName1, groupName2]);
    });

    it('adds an email to a group', function() {
      policyEngine.addToList('global', 'source', groupName1, userEmail1);
      expect(policyEngine.getList('global', groupName1)).to.be.eql([userEmail1]);
    });

    let userEmail2 = 'openidtest20@gmail.com';

    it('adds a second email to a group', function() {
      policyEngine.addToList('global', 'source', groupName1, userEmail2);
      expect(policyEngine.getList('global', groupName1)).to.be.eql([userEmail1, userEmail2]);
    });

    it('removes a user from a group', function() {
      policyEngine.removeFromGroup('global', groupName1, userEmail1);
      expect(policyEngine.getList('global', groupName1)).to.be.eql([userEmail2]);
    });

    it('deletes a group', function() {
      policyEngine.deleteGroup('global', groupName1);
      expect(policyEngine.getList('global', groupName1)).to.be.eql([]);
      expect(policyEngine.getGroupsNames('global')).to.be.eql([groupName2]);
    });
  });

  let messageWithoutID = {
    id: 1,
    type: 'read',
    from: 'hyperty://domain/hyperty-url',
    to: 'comm://domain/hyperty-instance'
  };

  let messageWithID = { body: { auth: false, identity: { userProfile: { username: 'user@domain' } } }, id: 1, type: 'read', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

  describe('identity', function() {
    it('should add an identity in the message body', function(done) {
      policyEngine.removePolicies('*', '*');
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

  describe('functionality: source', function() {
    it('rejects the message as it comes from a blocked source', function(done) {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([sourcePolicy]);
      policyEngine.addToList('global', 'source', 'blockedEmails', 'user@blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a source that is not blocked', function(done) {
      expect(policyEngine.authorise(message).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: time of the day', function() {
    it('rejects the message as it is received in a blocked timeslot', function(done) {
      policyEngine.context.time = 1530;
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([timePolicy]);
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a timeslot not blocked', function(done) {
      policyEngine.context.pdp.context.time = 1700;
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  describe('functionality: date', function() {
    it('rejects the message as it is received in a blocked date', function(done) {
      policyEngine.context.pdp.context.date = '01/01/2016';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([datePolicy]);
      policyEngine.addToList('global', 'date', 'blockedDates', '01/01/2016');
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a date not blocked', function(done) {
      policyEngine.context.pdp.context.date = '02/01/2016';
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(messageWithID).and.notify(done);
    });
  });

  let userEmail3 = 'openidtest10@microsoft.com';

  let messageFromAllowed = {
    body: { identity: { userProfile: { username: userEmail3 } } },
    id: 1,
    type: 'read',
    from: 'hyperty://domain/hyperty-url',
    to: 'comm://domain/hyperty-instance'
  };

  let outMessageFromAllowed = {
    body: { auth: true, identity: { userProfile: { username: userEmail3 } } }, id: 1, type: 'read', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance'
  };

  describe('functionality: domain', function() {
    it('rejects the message as it comes from a blocked domain', function(done) {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([domainPolicy]);
      policyEngine.addToList('global', 'domain', 'blockedDomains', 'blockedDomain');
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
    it('rejects the message as it is received in a blocked weekday', function(done) {
      policyEngine.context.pdp.context.weekday =  '0';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([weekdayPolicy]);
      policyEngine.addToList('global', 'weekday', 'blockedWeekdays', '0');
      expect(policyEngine.authorise(messageWithID).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a weekday that is not blocked', function(done) {
      policyEngine.context.pdp.context.weekday = '1';
      expect(policyEngine.authorise(messageFromAllowed).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(outMessageFromAllowed).and.notify(done);
    });
  });

  describe('data objects management', function() {
    let subscribeMessage = { body: { identity: { userProfile: { username: userEmail3 } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription' };

    let allowedSubscribeMessage = {
      body: { auth: true, identity: { userProfile: { username: userEmail3 } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription'
    };

    it('rejects a subscription attempt, as the policy rejects all', function(done) {
      //persistenceManager.delete('policies');
      let blockAnySubscriptionPolicy = {
        scope: 'hyperty',
        condition: 'subscription equals *',
        authorise: false,
        actions: [{method: 'registerSubscriber'}]
      };
      policyEngine.addPolicies([blockAnySubscriptionPolicy]);
      expect(policyEngine.authorise(subscribeMessage).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts a subscription attempt, as the policy rejects all', function(done) {
      let acceptAnySubscriptionPolicy = {
        scope: 'hyperty',
        condition: 'subscription equals *',
        authorise: true,
        actions: [{method: 'registerSubscriber'}]
      };

      policyEngine.removePolicies('hyperty', 'subscription equals *');
      policyEngine.addPolicies([acceptAnySubscriptionPolicy]);

      expect(policyEngine.authorise(subscribeMessage).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('accepts a subscription attempt, as the policy accepts preauthorised subscribers and is preauthorised', function(done) {
      let acceptPreAuthSubscriptionPolicy = {
        scope: 'hyperty',
        condition: 'subscription in preauthorised',
        authorise: true,
        actions: [{method: 'registerSubscriber'}]
      };

      policyEngine.removePolicies('hyperty', 'subscription equals *');
      policyEngine.addPolicies([acceptPreAuthSubscriptionPolicy]);
      expect(policyEngine.authorise(subscribeMessage).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('rejects a subscription attempt, as the policy rejects non-preauthorised subscriber and is not preauthorised', function(done) {
      let blockPreAuthSubscriptionPolicy = { scope: 'hyperty', condition: ['not', 'subscription in preauthorised'], authorise: false, actions: [{method: 'registerSubscriber'}] };

      let badSubscribeMessage = { body: { identity: { userProfile: { username: userEmail3 } }, subscriber: 'hyperty://domain/not-preauthorised-hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription' };

      policyEngine.removePolicies('hyperty', 'subscription in preauthorised');
      policyEngine.addPolicies([blockPreAuthSubscriptionPolicy]);
      expect(policyEngine.authorise(badSubscribeMessage).then(function(response) {
        return response;
      }), function(reject) {
        return reject;
      }).to.be.rejected.and.notify(done);
    });
  });

});
