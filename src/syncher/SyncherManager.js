/**
 * @author micaelpedrosa@gmail.com
 * Core Syncronization system.
 */
class SyncherManager {
  /* private
  _url: URL
  _bus: MiniBus
  */

  constructor(runtimeURL, bus) {
    let _this = this;

    _this._url = runtimeURL + '/sm';
    _this._bus = bus;

    bus.addListener(_this._url, (msg) => {
      console.log('SyncherManager-RCV: ', msg);
    });
  }

  get url() { return this._url; }
}
