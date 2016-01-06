class ObjectAllocation {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Object Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */
  constructor(url, bus) {
    let _this = this;

    _this._url = url;
    _this._bus = bus;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */
  get url() { return this._url; }

  /**
   * Ask for creation of a number of Object addresses, to the domain message node.
   * @param  {Domain} domain - Domain of the message node.
   * @param  {number} number - Number of addresses to request
   * @returns {Promise<ObjectURL>}  A list of ObjectURL's
   */
  create(domain, number) {
    let _this = this;

    let msg = {
      type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/object-address-allocation',
      body: { number: number }
    };

    return new Promise((resolve, reject) => {
      _this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 200) {
          resolve(reply.body.allocated);
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }
}

export default ObjectAllocation;
