import RegistryDataModel from './RegistryDataModel';

/**
*   @author: Gil Dias (gil.dias@tecnico.ulisboa.pt)
*   HypertyInstance Data Model used to model instances of Hyperties running in devices and servers.
*/
class HypertyInstance extends RegistryDataModel {

  constructor(id, url, descriptor, hypertyURL, user, guid, runtime, context) {
    super(id, url, descriptor);
    let _this = this;
    _this._hypertyURL = hypertyURL;
    _this._user = user;
    _this._guid = guid;
    _this._runtime = runtime;
    _this._context = context;
  }

  set user(identity) {
    let _this = this;
    _this.user = identity;
  }

  get user() {
    let _this = this;
    return _this._user;
  }

  get hypertyURL() {
    let _this = this;
    return _this._hypertyURL;
  }
}

export default HypertyInstance;
