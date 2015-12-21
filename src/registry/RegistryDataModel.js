/**
*   @author: Gil Dias (gil.dias@tecnico.ulisboa.pt)
*   Registry Data Model includes all Objects to be handled by the Registry functionality including
*/
class RegistryDataModel {

  constructor(id, url, descriptor, startingTime, lastModified, status, stubs, stubsConfiguration) {
    let _this = this;

    _this._id = id;
    _this._url = url;
    _this._descriptor = descriptor;
    _this._startingTime = startingTime;
    _this._lastModified = lastModified;
    _this._status = status;
    _this._stubs = stubs;
    _this._stubsConfiguration = stubsConfiguration;
  }

  get id() {
    let _this = this;
    return _this._id;
  }

  get url() {
    let _this = this;
    return _this._url;
  }

  get descriptor() {
    let _this = this;
    return _this._descriptor;
  }

}

export default RegistryDataModel;
