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
    _this.domain = dividedURL.domain;
    _this.discoveryURL = 'domain://registry.' + dividedURL.domain;
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
    let message = {type:'READ', from:'hyperty://ua.pt/asdf',
     to:'domain://registry.localhost', body: {user:
      'user://gmail.com/openidtest10'}};
    */

    _this.messageBus.addListener(_this.discoveryURL, function(msg) {

      if (msg.type === 'READ' &&  msg.body.hasOwnProperty('user')) {

        let identity = msg.body.user;
        let destination = msg.from;
        let id = msg.id;

        // message to query domain registry, asking for a user hyperty.
        let message = {
          type: 'READ', from: msg.from, to: 'domain://registry.' + _this.domain + '/', body: { user: identity}
        };

        _this.messageBus.postMessage(message, function(reply) {
          let hypertyURL = reply.body.last;
          let message;

          //if no hyperty was found
          if (hypertyURL === undefined) {
            message = {id: id, type: 'response', from: _this.discoveryURL,
                            to: destination, body: { code: 200,
                            hypertyInstances: 'not found'}};
          } else {

            message = {id: id, type: 'response', from: _this.discoveryURL,
                            to: destination, body: { code: 200,
                            hypertyInstances: {hypertyInstance:
                            {url: hypertyURL, user: identity,
                             descriptor: reply.body.hyperties[hypertyURL].descriptor}}}};
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
