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
import RegistryDataModel from './RegistryDataModel';

/**
*   @author: Gil Dias (gil.dias@tecnico.ulisboa.pt)
*   HypertyInstance Data Model used to model instances of Hyperties running in devices and servers.
*/
class HypertyInstance extends RegistryDataModel {

  constructor(id, url, descriptorURL, descriptor, hypertyURL, user, guid, runtime, context, p2pHandler, p2pRequester, dataSchemes, resources, startingTime, lastModified) {
    super(id, url, descriptorURL, p2pRequester, startingTime, lastModified);
    let _this = this;
    _this._descriptor = descriptor;
    _this._hypertyURL = hypertyURL;
    _this._user = user;
    _this._guid = guid;
    _this._runtime = runtime;
    _this._context = context;
    _this._p2pHandler = p2pHandler;
    _this._dataSchemes = dataSchemes;
    _this._resources = resources;
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

  get descriptor() {
    let _this = this;
    return _this._descriptor;
  }

  get objectName() {
    let _this = this;
    return _this._descriptor._objectName;
  }

  get p2pHandler() {
    let _this = this;
    return _this._p2pHandler;
  }

  get dataSchemes() {
    let _this = this;
    return _this._dataSchemes;
  }

  get resources() {
    let _this = this;
    return _this._resources;
  }

  get runtimeURL() {
    let _this = this;
    return _this._runtime;
  }
}

export default HypertyInstance;
