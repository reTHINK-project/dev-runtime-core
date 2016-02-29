/**
* Copyright 2016 PT Inovação e Sistemas SA
* Copyright 2016 INESC-ID
* Copyright 2016 QUOBIS NETWORKS SL
* Copyright 2016 FRAUNHOFER-GESELLSCHAFT ZUR FOERDERUNG DER ANGEWANDTEN FORSCHUNG E.V
* Copyright 2016 ORANGE SA
* Copyright 2016 Deutsche Telekom AG
* Copyright 2016 Apizee
* Copyright 2016 TECHNISCHE UNIVERSITAT BERLIN
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
**/
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
