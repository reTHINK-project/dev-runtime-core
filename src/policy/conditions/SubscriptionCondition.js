import Condition from './Condition';

class SubscriptionCondition extends Condition {

  constructor(attribute, operator, params) {
    super(attribute, operator, params);
  }

  isApplicable(context, message, scope, target) {
    let isSubscription = message.type === 'subscribe';
    let isFromRemoteSM = context.isFromRemoteSM(message.from);
    if (isSubscription & isFromRemoteSM) {
      let applicable;
      switch (scope) {
        case 'global':
          applicable = true;
          break;
        case 'hyperty':
          let hypertyURL = context.runtimeRegistry.getHypertyName();
          applicable = target === hypertyURL;
          break;
        case 'user':
          let hyperty = context.runtimeRegistry.getReporterURLSynchonous(context.getURL(message.to));
          let owner = context.runtimeRegistry.getHypertyOwner(hyperty);
          applicable = target === owner;
          break;
        case 'dataObject':
          let dataObjectURL = message.body.resource;
          applicable = target === dataObjectURL;
          break;
      }
      return applicable;
    } else {
      return false;
    }
  }
}

export default SubscriptionCondition;
