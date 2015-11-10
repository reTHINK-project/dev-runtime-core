class AddressAllocation {
  /* private
  _url: URL
  _bus: MiniBus
  */

  constructor(url, bus) {
    let _this = this;

    _this._url = url;
    _this._bus = bus;
  }

  get url() { return this._url; }

  /**
   * Ask for creation of a number of Hyperty addresses, to the domain message node.
   * @param  {Domain} domain Domain of the message node.
   * @param  {number} number Number of addresses to request
   * @return {Promise<[HypertyURL]>} a list of HypertyURL's
   */
  create(domain, number) {
    let _this = this;

    let msg = {
      header: {type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/hyperty-address-allocation'},
      body: {number: number}
    };

    return new Promise((resolve, reject) => {
      _this._bus.postMessage(msg, (reply) => {
        if (reply.body.code === 'ok') {
          resolve(reply.body.allocated);
        } else {
          reject(reply.body.desc);
        }
      });
    });
  }
}

export default AddressAllocation;
