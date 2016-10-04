import Condition from './Condition';

class SubscriptionCondition extends Condition {

  constructor(attribute, operator, params) {
    super(attribute, operator, params);
  }

  isApplicable(context, message) {
    let isSubscription = message.type === 'subscribe';
    let isFromRemoteSM = context.isFromRemoteSM(message.from);
    if (isSubscription & isFromRemoteSM) {
      return super.isApplicable(context, message);
    } else {
      return false;
    }
  }

}

export default SubscriptionCondition;
