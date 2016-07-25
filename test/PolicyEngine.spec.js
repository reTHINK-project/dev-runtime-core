import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import MessageNodeCtx from '../src/policy/context/MessageNodeCtx';
import PolicyEngine from '../src/policy/PolicyEngine';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';

/********** POLICIES **********/
let datePolicy = { actions: [], authorise: false, condition: 'date in blockedDates', scope: 'global' };

let domainPolicy = { actions: [], authorise: false, condition: 'domain in blockedDomains', scope: 'global'};

let groupPolicy = { actions: [], authorise: false, condition: 'source in students', scope: 'user@domain' };

let sourcePolicy = { actions: [], authorise: false, condition: 'source in blockedEmails', scope: 'user@domain' };

let timePolicy = { actions: [], authorise: false, condition: 'time between 1400 1700', scope: 'global' };

let weekdayPolicy = { actions: [], authorise: false, condition: 'weekday in blockedWeekdays', scope: 'global'};

let weekdayPolicy2 = { actions: [], authorise: false, condition: 'weekday in blockedWeekdays', scope: 'HypertyChat'};

let orPolicy = { actions: [], authorise: true, condition: ['or', 'source in coleagues', 'source in students'], scope: 'global' };

let andPolicy = { actions: [], authorise: true, condition: ['and', 'source in coleagues', 'source in students'], scope: 'global' };

let notPolicy = { actions: [], authorise: true, condition: ['not', 'source in coleagues'], scope: 'global' };

let notPolicy2 = { actions: [], authorise: false, condition: ['not', 'source in students', 'source in students'], scope: 'global' };

let andOrPolicy = { actions: [], authorise: true, condition: ['and', ['or', 'source in blockedEmails', 'source in students'], 'source in coleagues'], scope: 'global' };

let andOrPolicy2 = { actions: [], authorise: true, condition: ['or', 'source in students', ['and', 'source in students', 'source in coleagues']], scope: 'global' };

let blockAnySubscriptionPolicy = { actions: [{ method: 'registerSubscriber' }], authorise: false, condition: 'subscription equals *', scope: 'global' };

let acceptAnySubscriptionPolicy = { actions: [{ method: 'registerSubscriber' }], authorise: true, condition: 'subscription equals *', scope: 'global' };

let acceptPreAuthSubscriptionPolicy = { actions: [{ method: 'registerSubscriber' }], authorise: true, condition: 'subscription in preauthorised', scope: 'hyperty' };

let blockPreAuthSubscriptionPolicy = { actions: [{method: 'registerSubscriber'}], authorise: false, condition: ['not', 'subscription in preauthorised'], scope: 'global'};

/********** MESSAGES **********/
let message = { body: { identity: { userProfile: { username: 'user@domain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

let messageFromBlocked = { body: { identity: { userProfile: { username: 'user@blockedDomain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };

let subscribeMessage = { body: { identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription' };

let allowedSubscribeMessage = { body: { auth: true, identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription' };

let badSubscribeMessage = { body: { identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/not-preauthorised-hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7601/sm', to: 'comm://domain/data-object-url/subscription' };

let noIdMessage = { from: 'hyperty://domain/hyperty-url', id: 1, to: 'comm://domain/hyperty-instance', type: 'subscribe' };

/* ********** TESTS **********/
describe('Policy Engine with Message Node context', () => {
  let policyEngine = new PolicyEngine(new MessageNodeCtx());

  it('authorises a valid message', () => {
    expect(policyEngine.authorise(message)).to.be.eql(true);
  });

  describe('functionality: date', () => {
    it('rejects the message as it is received in a blocked date', () => {
      policyEngine.context.pdp.context.date = '01/01/2016';
      policyEngine.addPolicies([datePolicy]);
      policyEngine.addToList('global', 'date', 'blockedDates', '01/01/2016');
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });
  });

  describe('functionality: domain', () => {
    it('rejects the message as it comes from a blocked domain', () => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([domainPolicy]);
      policyEngine.addToList('global', 'domain', 'blockedDomains', 'blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked)).to.be.eql(false);
    });

    it('allows the message as it comes from a domain that is not blocked', () => {
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: source', () => {
    it('rejects the message as it comes from a blocked source', () => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([sourcePolicy]);
      policyEngine.addToList('global', 'source', 'blockedEmails', 'user@blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked)).to.be.eql(false);
    });

    it('allows the message as it comes from a source that is not blocked', () => {
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: time of the day', () => {
    it('rejects the message as it is received in a blocked timeslot', () => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([timePolicy]);
      policyEngine.context.time = 1500;
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });

    it('accepts the message as it is received in a timeslot not blocked', () => {
      policyEngine.context.time = 1701;
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  describe('functionality: weekday', () => {
    it('rejects the message as it is received in a blocked weekday', () => {
      policyEngine.context.weekday =  '0';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([weekdayPolicy]);
      policyEngine.addToList('global', 'weekday', 'blockedWeekdays', '0');
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });

    it('allows the message as it comes from a weekday that is not blocked', () => {
      policyEngine.context.weekday = '1';
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });
});

describe('Policy Engine with Runtime Core context', () => {
  let runtimeRegistry = {
    getPreAuthSubscribers: () => {
      return ['hyperty://domain/hyperty-instance'];
    },
    getHypertyName: () => {
      console.log('YOOOOOOOOOOOOOO');
      return 'HypertyChat';
    },
    isDataObjectURL: (dataObjectURL) => {
      let splitURL = dataObjectURL.split('://');
      return splitURL[0] === 'comm';
    },
    registerSubscribedDataObject: () => {},
    registerSubscriber: () => {},
    runtimeURL: 'runtime://localhost/7601'
  };

  let identityModule = {
    decryptMessage: (message) => {
      return new Promise((resolve) => {
        resolve(message);
      });
    },
    encryptMessage: (message) => {
      return new Promise((resolve) => {
        resolve(message);
      });
    },
    getIdentityOfHyperty: () => {
      return new Promise((resolve) => {
        resolve({ userProfile: {username: 'user@domain' } });
      });
    }
  };

  let policyEngine = new PolicyEngine(new RuntimeCoreCtx(identityModule, runtimeRegistry));

  describe('identity', () => {
    it('should add an identity in the message body', (done) => {
      let message = { body: { auth: false, identity: { userProfile: { username: 'user@domain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-url', to: 'comm://domain/hyperty-instance' };
      policyEngine.removePolicies('*', '*');
      expect(policyEngine.authorise(noIdMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });

    it('should maintain the identity in the message body', (done) => {
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('policies management', () => {
    it('removes all policies', () => {
      policyEngine.removePolicies('*', '*');
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([]);
    });

    it('associates a policy for ID = user@domain', () => {
      policyEngine.addPolicies([groupPolicy]);
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([groupPolicy]);
    });

    it('associates a second policy for ID = user@domain', () => {
      policyEngine.addPolicies([sourcePolicy]);
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([groupPolicy, sourcePolicy]);
    });

    it('associates a policy for hyperty = HypertyChat', () => {
      policyEngine.addPolicies([weekdayPolicy2]);
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([groupPolicy, sourcePolicy, weekdayPolicy2]);
    });

    it('removes an existing policy associated for ID = user@domain', () => {
      policyEngine.removePolicies('user@domain', 'source in blockedEmails');
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([groupPolicy, weekdayPolicy2]);
    });

    it('tries to remove a policy that does not exist for ID = user@domain', () => {
      policyEngine.removePolicies('user@domain', 'block-08-20');
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([groupPolicy, weekdayPolicy2]);
    });

    it('removes all policies associated with ID = user@domain', () => {
      policyEngine.removePolicies('user@domain', '*');
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([weekdayPolicy2]);
    });

    it('removes all policies associated with hyperty = HypertyChat', () => {
      policyEngine.removePolicies('HypertyChat', '*');
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([]);
    });
  });

  describe('advanced policies management', () => {

    it('stores an advanced policy', () => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([orPolicy]);
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([orPolicy]);
    });

    it('deletes an advanced policy', () => {
      policyEngine.removePolicies(orPolicy.scope, orPolicy.condition);
      expect(policyEngine.context.getApplicablePolicies(message)).to.be.eql([]);
    });

    it('condition is verified when [or false true]', () => {
      policyEngine.addToList('global', 'source', 'students', 'user@domain');
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(orPolicy.condition[0], orPolicy.condition[1], orPolicy.condition[2], orPolicy.scope, message)).to.be.eql(true);
    });

    it('condition is not verified when [and false true]', () => {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(andPolicy.condition[0], false, true, andPolicy.scope, message)).to.be.eql(false);
    });

    it('condition is verified when [not false]', () => {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(notPolicy.condition[0], notPolicy.condition[1], undefined, notPolicy.scope, message)).to.be.eql(true);
    });

    it('condition is not verified when [not true]', () => {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(notPolicy2.condition[0], notPolicy2.condition[1], undefined, notPolicy2.scope, message)).to.be.eql(false);
    });

    it('condition is not verified when [and [or false true] false]', () => {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(andOrPolicy.condition[0], andOrPolicy.condition[1], andOrPolicy.condition[2], andOrPolicy.scope, message)).to.be.eql(false);
    });

    it('condition is verified when [or true [and false true]]', () => {
      expect(policyEngine.context.pdp.verifiesAdvancedCondition(andOrPolicy2.condition[0], true, andOrPolicy2.condition[2], andOrPolicy2.scope, message)).to.be.eql(true);
    });
  });

  describe('groups management', () => {
    it('creates a group', () => {
      policyEngine.deleteGroup('global', 'students');
      policyEngine.createList('global', 'group', 'groupA');
      expect(policyEngine.getGroupsNames('global')).to.be.eql(['groupA']);
    });

    it('creates a second group', () => {
      policyEngine.createList('global', ' group', 'groupB');
      expect(policyEngine.getGroupsNames('global')).to.be.eql(['groupA', 'groupB']);
    });

    it('adds an email to a group', () => {
      policyEngine.addToList('global', 'source', 'groupA', 'user1@domain');
      expect(policyEngine.getList('global', 'groupA')).to.be.eql(['user1@domain']);
    });

    it('adds a second email to a group', () => {
      policyEngine.addToList('global', 'source', 'groupA', 'user2@domain');
      expect(policyEngine.getList('global', 'groupA')).to.be.eql(['user1@domain', 'user2@domain']);
    });

    it('removes a user from a group', () => {
      policyEngine.removeFromGroup('global', 'groupA', 'user1@domain');
      expect(policyEngine.getList('global', 'groupA')).to.be.eql(['user2@domain']);
    });

    it('deletes a group', () => {
      policyEngine.deleteGroup('global', 'groupA');
      expect(policyEngine.getList('global', 'groupA')).to.be.eql([]);
      expect(policyEngine.getGroupsNames('global')).to.be.eql(['groupB']);
    });
  });

  describe('functionality: source', () => {
    it('rejects the message as it comes from a blocked source', (done) => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([sourcePolicy]);
      policyEngine.addToList('global', 'source', 'blockedEmails', 'user@blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a source that is not blocked', (done) => {
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: time of the day', () => {
    it('rejects the message as it is received in a blocked timeslot', (done) => {
      policyEngine.context.time = 1530;
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([timePolicy]);
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a timeslot not blocked', (done) => {
      policyEngine.context.time = 1700;
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: date', () => {
    it('rejects the message as it is received in a blocked date', (done) => {
      policyEngine.context.date = '01/01/2016';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([datePolicy]);
      policyEngine.addToList('global', 'date', 'blockedDates', '01/01/2016');
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts the message as it is received in a date not blocked', (done) => {
      policyEngine.context.date = '02/01/2016';
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: domain', () => {
    it('rejects the message as it comes from a blocked domain', (done) => {
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([domainPolicy]);
      policyEngine.addToList('global', 'domain', 'blockedDomains', 'blockedDomain');
      expect(policyEngine.authorise(messageFromBlocked).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a domain that is not blocked', (done) => {
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: weekday', () => {
    it('rejects the message as it is received in a blocked weekday', (done) => {
      policyEngine.context.weekday =  '0';
      policyEngine.removePolicies('*', '*');
      policyEngine.addPolicies([weekdayPolicy]);
      policyEngine.addToList('global', 'weekday', 'blockedWeekdays', '0');
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a weekday that is not blocked', (done) => {
      policyEngine.context.weekday = '1';
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('data objects management', () => {
    it('rejects a subscription attempt, as the policy rejects all', (done) => {
      policyEngine.addPolicies([blockAnySubscriptionPolicy]);
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts a subscription attempt, as the policy accepts all', (done) => {
      policyEngine.removePolicies('global', 'subscription equals *');
      policyEngine.addPolicies([acceptAnySubscriptionPolicy]);
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('accepts a subscription attempt, as the policy accepts preauthorised subscribers and is preauthorised', (done) => {
      policyEngine.removePolicies('global', 'subscription equals *');
      policyEngine.addPolicies([acceptPreAuthSubscriptionPolicy]);
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('rejects a subscription attempt, as the policy rejects non-preauthorised subscriber and is not preauthorised', (done) => {
      policyEngine.removePolicies('global', 'subscription in preauthorised');
      policyEngine.addPolicies([blockPreAuthSubscriptionPolicy]);
      expect(policyEngine.authorise(badSubscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });
  });

  describe('initial filtering', () => {
    it('message that loads an hyperty should not be validated by policies', () => {
      let loadMessage = { id: 2, from: 'hyperty-runtime://sandbox/external', to: 'hyperty-runtime://sandbox/internal', type: 'create' };
      expect(policyEngine.context.isToVerify(loadMessage)).to.be.eql(false);
    });
  });
});
