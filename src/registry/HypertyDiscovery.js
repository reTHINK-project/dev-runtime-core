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
  constructor(msgBus, runtimeURL) {
    let _this = this;
    _this.messageBus = msgBus;

    let dividedURL = divideURL(runtimeURL);
    _this.discoveryURL = 'domain://registry.' + dividedURL.domain + '/hyperty-instance/user';
    _this.domainRegistryListener();

  }

  /**
  * function to listen for requests about users registered in domain registry, and
  * return the identity if found.
  * @return {HypertyURL}          HypertyURL
  */
  domainRegistryListener() {
    let _this = this;

    /* Format of the message intended to receive, to work properly
    let message = {id: 123, type:'READ', from:'hyperty://ua.pt/asdf',
     to:'domain://registry.ua.pt/hyperty-instance/user', body: {user:
      'user://gmail.com/openidtest10'}};
    */

    _this.messageBus.addListener(_this.discoveryURL, function(msg) {

      if (msg.type === 'READ' &&  msg.body.hasOwnProperty('user')) {
        let identity = msg.body.user;
        let destination = msg.from;
        let id = msg.id;

        // message to query domain registry, asking for a user hyperty.
        let message = {
          id: 98, type: 'READ', from: _this.discoveryURL, to: 'domain://registry.ua.pt/', body: { user: identity}
        };

        _this.messageBus.postMessage(message, function(reply) {
          let hypertyURL = reply.body.last;
          let message;

          //if no hyperty was found
          if (hypertyURL === undefined) {
            message = {id: id, type: 'RESPONSE', from: _this.discoveryURL,
                            to: destination, body: { code: 200,
                            hypertyInstances: 'not found'}};
          } else {
            //TODO remove later, fix the problem of bad URL format received in the message
            let fixedHypertyURL = 'hyperty:/' + hypertyURL.substring(hypertyURL.indexOf(':') + 1, hypertyURL.length);

            message = {id: id, type: 'RESPONSE', from: _this.discoveryURL,
                            to: destination, body: { code: 200,
                            hypertyInstances: {hypertyInstance:
                            {url: fixedHypertyURL, user: identity}}}};
          }

          _this.messageBus.postMessage(message, function(reply) {
            //console.log('final Reply HypertyDiscovery: ', reply);
          });
        });
      }
    });
  }

}

export default HypertyDiscovery;
