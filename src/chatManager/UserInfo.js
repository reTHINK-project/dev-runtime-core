import { deepClone } from '../utils/utils';

export class UserInfo {

  constructor(hypertyURL, domain, identity) {

    let completeIdentity = deepClone(identity);
    if (!identity.hasOwnProperty('userProfile')) {
      completeIdentity['userProfile'] = identity;
    }

    return {
      hypertyURL: hypertyURL,
      domain, domain,
      identity: completeIdentity
    }

  }

}
