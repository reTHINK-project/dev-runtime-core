import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.config.truncateThreshold = 0;

let expect = chai.expect;
chai.use(chaiAsPromised);

import AdvancedCondition from '../src/policy/conditions/AdvancedCondition';
import Condition from '../src/policy/conditions/Condition';
import DenyOverrides from '../src/policy/combiningAlgorithms/DenyOverrides';
import MessageNodeCtx from '../src/policy/context/MessageNodeCtx';
import PolicyEngine from '../src/policy/PolicyEngine';
import Rule from '../src/policy/Rule';
import RuntimeCoreCtx from '../src/policy/context/RuntimeCoreCtx';
import ServiceProviderPolicy from '../src/policy/policies/ServiceProviderPolicy';
import SubscriptionCondition from '../src/policy/conditions/SubscriptionCondition';
import UserPolicy from '../src/policy/policies/UserPolicy';

/********** CONDITIONS **********/
let simpleCondition = new Condition('source', 'equals', 'user1@domain1');
let andCondition = new AdvancedCondition(['and', new Condition('source', 'equals', 'user1@domain1'), new Condition('domain', 'equals', 'domain1')]);
let orCondition = new AdvancedCondition(['or', new Condition('source', 'equals', 'user1@domain1'), new Condition('domain', 'equals', 'domain1')]);
let notCondition = new AdvancedCondition(['not', new Condition('source', 'equals', 'user2@domain2')]);
let andNotCondition = new AdvancedCondition(['and', new Condition('source', 'equals', 'user1@domain1'), ['not', new Condition('domain', 'equals', 'domain1')]]);
let orNotCondition = new AdvancedCondition(['or', ['not', new Condition('domain', 'equals', 'domain1')], new Condition('source', 'equals', 'user1@domain1')]);

/********** RULES **********/
let simpleRule = new Rule(false, simpleCondition, 0, 'global', 'global');
let acceptAnySubscriptionRule = new Rule(true, new SubscriptionCondition('subscription', 'equals', '*'), 0, 'global', 'global');
let acceptPreAuthSubscriptionRule = new Rule(true, new SubscriptionCondition('subscription', 'in', 'preauthorised'), 0, 'global', 'global');
let blockAnySubscriptionRule = new Rule(false, new SubscriptionCondition('subscription', 'equals', '*'), 0, 'global', 'global');
let blockPreAuthSubscriptionRule = new Rule(false, new AdvancedCondition(['not', new SubscriptionCondition('subscription', 'in', 'preauthorised')]), 0, 'global', 'global');
let dataObjectSchemeRule = new Rule(false, new Condition('dataObjectScheme', 'equals', 'comm'), 0, 'global', 'global');
let dateRule = new Rule(false, new Condition('date', 'equals', '01/01/2016'), 0, 'global', 'global');
let domainRule = new Rule(false, new Condition('domain', 'equals', 'blockedDomain'), 0, 'global', 'global');
let sourceRule = new Rule(false, new Condition('source', 'equals', 'user@blockedDomain'), 0, 'global', 'global');
let sourceRuleForConn = new Rule(false, new Condition('source', 'equals', 'user@blockedDomain'), 0, 'hyperty', 'Connector');
let sourceRuleForUser1 = new Rule(false, new Condition('source', 'equals', 'user@blockedDomain'), 0, 'user', 'user1@work');
let timeRule = new Rule(false, new Condition('time', 'between', [1400, 1700]), 0, 'global', 'global');
let weekdayRule = new Rule(false, new Condition('weekday', 'equals', '0'), 0, 'global', 'global');

/********** POLICIES **********/
let sourcePolicy = new ServiceProviderPolicy('HypertyChat', [simpleRule], []);

/********** MESSAGES **********/
let messageFromChat = { body: { identity: { userProfile: { username: 'user@blockedDomain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-123', to: 'hyperty://domain/hyperty-456' };

let messageFromConn = { body: { identity: { userProfile: { username: 'user@blockedDomain' } } }, id: 1, type: 'subscribe', from: 'hyperty://domain/hyperty-789', to: 'hyperty://domain/hyperty-012' };

let messageFromUser1 = { body: { identity: { userProfile: { username: 'user1@domain1' } } }, id: 1, type: 'subscribe', from: 'scheme://domain/data-object-instance', to: 'comm://domain/data-object-instance' };

let messageFromUser2 = { body: { identity: { userProfile: { username: 'user2@domain2' } } }, id: 1, type: 'subscribe', from: 'scheme://domain/data-object-instance', to: 'comm://domain/data-object-instance' };

let noIdMessage = { from: 'hyperty://domain/hyperty-url', id: 1, to: 'comm://domain/hyperty-instance', type: 'subscribe' };

let message = { body: { auth: false, identity: { userProfile: { username: 'user@domain' } } }, from: 'hyperty://domain/hyperty-url', id: 1, to: 'comm://domain/hyperty-instance', type: 'subscribe' };

let messageFromBlocked = { body: { identity: { userProfile: { username: 'user@blockedDomain' } } }, id: 1, type: 'subscribe', from: 'comm://domain/data-object-instance', to: 'comm://domain/hyperty-instance' };

let subscribeMessage = { body: { identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7600/sm', to: 'comm://domain/data-object-url/subscription' };

let allowedSubscribeMessage = { body: { auth: true, identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7600/sm', to: 'comm://domain/data-object-url/subscription' };

let badSubscribeMessage = { body: { identity: { userProfile: { username: 'user@domain' } }, subscriber: 'hyperty://domain/not-preauthorised-hyperty-instance' }, id: 1, type: 'subscribe', from: 'runtime://localhost/7600/sm', to: 'comm://domain/data-object-url/subscription' };

/********** TESTS **********/
let runtimeCtx = new RuntimeCoreCtx();

describe('Policies management', () => {
  describe('conditions management', () => {
    it('creates a simple condition', () => {
      expect(simpleCondition.attribute).to.be.eql('source');
      expect(simpleCondition.operator).to.be.eql('equals');
      expect(simpleCondition.params).to.be.eql('user1@domain1');
    });
    it('returns condition is applicable', () => {
      expect(simpleCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(true);
    });
    it('returns condition is not applicable', () => {
      expect(simpleCondition.isApplicable(runtimeCtx, messageFromUser2)).to.be.eql(false);
    });

    it('creates an advanced condition - "and"', () => {
      expect(andCondition.condition).to.be.eql(['and', new Condition('source', 'equals', 'user1@domain1'), new Condition('domain', 'equals', 'domain1')]);
      expect(andCondition.condition[0]).to.be.eql('and');
      expect(andCondition.condition[1]).to.be.eql(new Condition('source', 'equals', 'user1@domain1'));
      expect(andCondition.condition[2]).to.be.eql(new Condition('domain', 'equals', 'domain1'));
    });

    it('correctly returns "and" condition is applicable', () => {
      expect(andCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(true);
    });

    it('correctly returns "and" condition is not applicable', () => {
      expect(andCondition.isApplicable(runtimeCtx, messageFromUser2)).to.be.eql(false);
    });

    it('creates an advanced condition - "or"', () => {
      expect(orCondition.condition).to.be.eql(['or', new Condition('source', 'equals', 'user1@domain1'), new Condition('domain', 'equals', 'domain1')]);
    });

    it('correctly returns "or" condition is applicable', () => {
      expect(orCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(true);
    });

    it('correctly returns "or" condition is not applicable', () => {
      expect(orCondition.isApplicable(runtimeCtx, messageFromUser2)).to.be.eql(false);
    });

    it('creates an advanced condition - "not"', () => {
      expect(notCondition.condition).to.be.eql(['not', new Condition('source', 'equals', 'user2@domain2')]);
    });

    it('correctly returns "not" condition is applicable', () => {
      expect(notCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(true);
    });

    it('correctly returns "not" condition is not applicable', () => {
      expect(notCondition.isApplicable(runtimeCtx, messageFromUser2)).to.be.eql(false);
    });

    it('correctly returns "and not" condition is not applicable', () => {
      expect(andNotCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(false);
    });

    it('correctly returns "or not" condition is applicable', () => {
      expect(orNotCondition.isApplicable(runtimeCtx, messageFromUser1)).to.be.eql(true);
    });
  });

  describe('rules management', () => {
    it('creates a simple rule', () => {
      expect(simpleRule.authorise).to.be.eql(false);
      expect(simpleRule.condition).to.be.eql(simpleCondition);
      expect(simpleRule.scope).to.be.eql('global');
      expect(simpleRule.target).to.be.eql('global');
    });
    it('evaluates a simple rule to false', () => {
      expect(simpleRule.evaluate(runtimeCtx, messageFromUser1)).to.be.eql(false);
    });
    it('evaluates a simple rule to "Not Applicable"', () => {
      expect(simpleRule.evaluate(runtimeCtx, messageFromUser2)).to.be.eql('Not Applicable');
    });
  });

  describe('policies management', () => {
    it('creates a service provider policy', () => {
      expect(sourcePolicy.key).to.be.eql('HypertyChat');
      expect(sourcePolicy.combiningAlgorithm).to.be.eql(new DenyOverrides());
      expect(sourcePolicy.rules).to.be.eql([simpleRule]);
    });
    it('evaluates a service provider policy to false', () => {
      expect(sourcePolicy.evaluate(runtimeCtx, messageFromUser1)).to.be.eql(false);
    });
    it('evaluates a service provider policy to "Not Applicable"', () => {
      expect(sourcePolicy.evaluate(runtimeCtx, messageFromUser2)).to.be.eql('Not Applicable');
    });
  });
});

describe('Policy Engine with Runtime Core context', () => {
  let runtimeRegistry = {
    getPreAuthSubscribers: () => {
      return ['hyperty://domain/hyperty-instance'];
    },
    getHypertyName: (hypertyURL) => {
      if (hypertyURL === 'hyperty://domain/hyperty-123') {
        return 'HypertyChat';
      }
      if (hypertyURL === 'hyperty://domain/hyperty-789') {
        return 'Connector';
      }
    },
    getReporterURLSynchonous: (hypertyURL) => {
      return 'hyperty://domain/hyperty-url';
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
    doMutualAuthentication: () => {},
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

  describe('initial filtering', () => {
    it('message that loads an hyperty should not be validated by policies', () => {
      let loadMessage = { id: 2, from: 'hyperty-runtime://sandbox/external', to: 'hyperty-runtime://sandbox/internal', type: 'create' };
      expect(policyEngine.context._isToVerify(loadMessage)).to.be.eql(false);
    });
  });

  describe('identity obtention', () => {
    it('should add an identity in the message body', (done) => {
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
    policyEngine.removePolicy('*');

    it('adds a service provider policy to the engine', () => {
      policyEngine.context.activeUserPolicy = undefined;
      policyEngine.addPolicy('SERVICE_PROVIDER', 'HypertyChat', sourcePolicy);
      expect(policyEngine.context.serviceProviderPolicies).to.be.eql({HypertyChat: new ServiceProviderPolicy('HypertyChat', [simpleRule], [])});
      expect(policyEngine.context.serviceProviderPolicies.HypertyChat).to.be.eql(new ServiceProviderPolicy('HypertyChat', [simpleRule], []));
      expect(policyEngine.context.serviceProviderPolicies.HypertyChat.actions).to.be.eql([]);
      expect(policyEngine.context.serviceProviderPolicies.HypertyChat.rules).to.be.eql([simpleRule]);
    });

    it('adds a user policy to the engine', () => {
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [dateRule], []));
      expect(policyEngine.context.userPolicies).to.be.eql({'My policy': new UserPolicy('My policy', [dateRule], [])});
      expect(policyEngine.context.userPolicies['My policy']).to.be.eql(new UserPolicy('My policy', [dateRule], []));
      expect(policyEngine.context.userPolicies['My policy'].actions).to.be.eql([]);
      expect(policyEngine.context.userPolicies['My policy'].rules).to.be.eql([dateRule]);
    });

    it('adds a second user policy to the engine', () => {
      policyEngine.addPolicy('USER', 'My second policy', new UserPolicy('My second policy', [simpleRule], []));
      expect(policyEngine.context.userPolicies).to.be.eql({'My policy': new UserPolicy('My policy', [dateRule], []), 'My second policy': new UserPolicy('My second policy', [simpleRule], [])});
      expect(policyEngine.context.serviceProviderPolicies).to.be.eql({HypertyChat: new ServiceProviderPolicy('HypertyChat', [simpleRule], [])});
      expect(policyEngine.context.activeUserPolicy).to.be.eql(undefined);
    });

    it('removes an existing user policy', () => {
      policyEngine.removePolicy('USER', 'My policy');
      expect(policyEngine.context.serviceProviderPolicies).to.be.eql({HypertyChat: new ServiceProviderPolicy('HypertyChat', [simpleRule], [])});
      expect(policyEngine.context.userPolicies).to.be.eql({'My second policy': new UserPolicy('My second policy', [simpleRule], [])});
      expect(policyEngine.context.activeUserPolicy).to.be.eql(undefined);
    });

    it('tries to remove a policy that does not exist', () => {
      policyEngine.removePolicy('USER', 'Vacations');
      expect(policyEngine.context.serviceProviderPolicies).to.be.eql({HypertyChat: new ServiceProviderPolicy('HypertyChat', [simpleRule], [])});
      expect(policyEngine.context.userPolicies).to.be.eql({'My second policy': new UserPolicy('My second policy', [simpleRule], [])});
      expect(policyEngine.context.activeUserPolicy).to.be.eql(undefined);
    });

    it('removes all policies', () => {
      policyEngine.removePolicy('*');
      expect(policyEngine.context.serviceProviderPolicies).to.be.eql({});
      expect(policyEngine.context.userPolicies).to.be.eql({});
      expect(policyEngine.context.activeUserPolicy).to.be.eql(undefined);
    });

    it('does not apply a rule as it is not its target', (done) => {
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [sourceRuleForConn], []));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(messageFromChat).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(messageFromChat).and.notify(done);
    });

    it('applies a rule as it is its target', (done) => {
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [sourceRuleForConn], []));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(messageFromConn).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });
  });

  describe('functionality: dataObjectScheme', () => {
    it('rejects the message as it is from a blocked scheme', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [dataObjectSchemeRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(messageFromBlocked).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('allows the message as it comes from a scheme that is not blocked', (done) => {
      expect(policyEngine.authorise(message).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(message).and.notify(done);
    });
  });

  describe('functionality: source', () => {
    it('rejects the message as it comes from a blocked source', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [sourceRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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

  /*describe('functionality: time of the day', () => {
    it('rejects the message as it is received in a blocked timeslot', (done) => {
      policyEngine.context.time = 1530;
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [timeRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [dateRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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
  });*/

  describe('functionality: domain', () => {
    it('rejects the message as it comes from a blocked domain', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [domainRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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

  /*describe('functionality: weekday', () => {
    it('rejects the message as it is received in a blocked weekday', (done) => {
      policyEngine.context.weekday =  '0';
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [weekdayRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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
  });*/

  describe('data objects management', () => {
    it('rejects a subscription attempt, as the policy rejects all', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [blockAnySubscriptionRule], ['registerSubscriber']));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });

    it('accepts a subscription attempt, as the policy accepts all', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [acceptAnySubscriptionRule], ['registerSubscriber']));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('accepts a subscription attempt, as the policy accepts preauthorised subscribers and is preauthorised', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [acceptPreAuthSubscriptionRule], ['registerSubscriber']));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(subscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.fulfilled.and.eventually.eql(allowedSubscribeMessage).and.notify(done);
    });

    it('rejects a subscription attempt, as the policy rejects non-preauthorised subscriber and is not preauthorised', (done) => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('USER', 'My policy', new UserPolicy('My policy', [blockPreAuthSubscriptionRule], ['registerSubscriber']));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(badSubscribeMessage).then((message) => {
        return message;
      }), (error) => {
        return error;
      }).to.be.rejected.and.notify(done);
    });
  });

  describe('groups management', () => {
    let groups = policyEngine.context.groups;
    for (let i in groups) {
      policyEngine.deleteGroup(i);
    }

    it('creates a group', () => {
      policyEngine.createGroup('groupA');
      expect(policyEngine.getGroupsNames()).to.be.eql(['groupA']);
    });

    it('creates a second group', () => {
      policyEngine.createGroup('groupB');
      expect(policyEngine.getGroupsNames()).to.be.eql(['groupA', 'groupB']);
    });

    it('adds an email to a group', () => {
      policyEngine.addToGroup('groupA', 'user1@domain');
      expect(policyEngine.getGroup('groupA')).to.be.eql(['user1@domain']);
    });

    it('adds a second email to a group', () => {
      policyEngine.addToGroup('groupA', 'user2@domain');
      expect(policyEngine.getGroup('groupA')).to.be.eql(['user1@domain', 'user2@domain']);
    });

    it('removes a user from a group', () => {
      policyEngine.removeFromGroup('groupA', 'user1@domain');
      expect(policyEngine.getGroup('groupA')).to.be.eql(['user2@domain']);
    });

    it('deletes a group', () => {
      policyEngine.deleteGroup('groupA');
      expect(policyEngine.getGroup('groupA')).to.be.eql([]);
      expect(policyEngine.getGroupsNames()).to.be.eql(['groupB']);
    });
  });
  policyEngine.removePolicy('*');
});

describe('Policy Engine with Message Node context', () => {
  let policyEngine = new PolicyEngine(new MessageNodeCtx());

  it('authorises a valid message', () => {
    expect(policyEngine.authorise(message)).to.be.eql(true);
  });

  /*describe('functionality: date', () => {
    it('rejects the message as it is received in a blocked date', () => {
      policyEngine.context.date = '01/01/2016';
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('SERVICE_PROVIDER', 'My policy', new ServiceProviderPolicy('My policy', [dateRule], []));
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });
  });*/

  describe('functionality: domain', () => {
    it('rejects the message as it comes from a blocked domain', () => {
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('SERVICE_PROVIDER', 'My policy', new ServiceProviderPolicy('My policy', [domainRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(messageFromBlocked)).to.be.eql(false);
    });

    it('allows the message as it comes from a domain that is not blocked', () => {
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });

  /*describe('functionality: time of the day', () => {
    it('rejects the message as it is received in a blocked timeslot', () => {
      policyEngine.context.time = 1530;
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('SERVICE_PROVIDER', 'My policy', new ServiceProviderPolicy('My policy', [timeRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
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
      policyEngine.removePolicy('*');
      policyEngine.addPolicy('SERVICE_PROVIDER', 'My policy', new ServiceProviderPolicy('My policy', [weekdayRule], []));
      policyEngine.context.activeUserPolicy = 'My policy';
      expect(policyEngine.authorise(message)).to.be.eql(false);
    });

    it('allows the message as it comes from a weekday that is not blocked', () => {
      policyEngine.context.weekday = '1';
      expect(policyEngine.authorise(message)).to.be.eql(true);
    });
  });*/
});
