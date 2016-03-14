// import MessageFactory from '../../resources/MessageFactory';

/**
 * Class will ask to the message node for addresses
 */
class AddressAllocation {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Address Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */
  constructor(url, bus) {
    let _this = this;

    // let messageFactory = new MessageFactory();
    //
    // _this._messageFactory = messageFactory;
    _this._url = url;
    _this._bus = bus;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */
  get url() { return this._url; }

  /**
   * Ask for creation of a number of Hyperty addresses, to the domain message node.
   * @param  {Domain} domain - Domain of the message node.
   * @param  {number} number - Number of addresses to request
   * @returns {Promise<HypertyURL>}  A list of HypertyURL's
   */
  create(domain, number) {
    let _this = this;

    // let messageFactory = _this._messageFactory;

    let msg = {
      type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/hyperty-address-allocation',
      body: {value: {number: number}}
    };

    // TODO: Apply the message factory
    // The msg-node-vertx should be changed the body field to receive
    // the following format body: {value: {number: number}} because
    // the message is generated in that way by the message factory;
    // let msg = messageFactory.createMessageRequest(_this._url, 'domain://msg-node.' + domain + '/hyperty-address-allocation', '', {number: number});

    return new Promise((resolve, reject) => {

      // TODO: change this response Message using the MessageFactory
      _this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 200) {
          resolve(reply.body.value.allocated);
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }

  /**
  * Send a request to the domain message node, to deallocate one or more addresses
  * @param  {Domain} domain - Domain of the message node.
  * @param  {addresses} addresses to request the deallocation
  * @returns {Promise}  the response by the message node
  */
  delete(domain, addresses) {
    let _this = this;

    let message = {
      type: 'delete', from: _this._url, to: 'domain://msg-node.' + domain + '/hyperty-address-allocation',
      body: {childrenResources: addresses}
    };

    return new Promise((resolve, reject) => {

      _this._bus.postMessage(message, (reply) => {
        console.log('reply', reply);
        if (reply.body.code === 200) {
          resolve(reply.body.code);
        } else {
          reject(reply.body.desc);
        }
      });
    });

  }
}

export default AddressAllocation;
