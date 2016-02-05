import {divideURL} from '../utils/utils.js';

/**
* Core HypertyDiscovery interface
* Class to allow applications to search for hyperties using the message bus
*/
class HypertyDiscovery {

  /**
  * To initialise the HypertyDiscover, which will provide the support for hyperties to
  * query users registered in outside the internal core.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {RuntimeURL}          runtimeURL            runtimeURL
  */
  constructor(domain, msgBus) {
    let _this = this;
    _this.messageBus = msgBus;

    _this.domain = domain;
    _this.discoveryURL = 'hyperty://' + domain + '/hypertyDisovery';
  }

  /**
  * function to request about users registered in domain registry, and
  * return the hyperty instance if found.
  * @param  {email}              email
  * @return {Promise}          Promise
  */
  discoverHypertyPerUser(email) {
    let _this = this;
    let identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

    // message to query domain registry, asking for a user hyperty.
    let message = {
      type: 'READ', from: _this.discoveryURL, to: 'domain://registry.' + _this.domain + '/', body: { user: identityURL}
    };

    return new Promise(function(resolve, reject) {

      _this.messageBus.postMessage(message, (reply) => {

        let hypertyURL = reply.body.last;

        if (hypertyURL === undefined) {
          return reject('User Hyperty not found');
        }

        let idPackage = {
          id: email,
          descriptor: reply.body.hyperties[hypertyURL].descriptor,
          hypertyURL: hypertyURL
        };

        resolve(idPackage);
      });
    });
  }

}

export default HypertyDiscovery;
