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
 * @access private
 * This class is responsible for collecting delta changes in remote objects, before the response of subscription reach the observer.
 * It's used in Syncher -> subscribe. The flow is defined as:
 * 1. (observer) --subscribe--> (reporter)
 * 2. (observer) <--delta updates-- (reporter)
 * 3. (observer) <--subscribe response-- (reporter)
 * This means that there could be delta updates transferred before the subscription confirmation.
 * Since there is no DataObjectObserver before the ubscription confirmation, there should be some other object collecting the updates.
 * Provisional data is applied to the DataObjectObserver after confirmation. Or discarded if there is no confirmation.
 */

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('DataProvisional');

class DataProvisional {
  /* private
  _childrenListeners: [MsgListener]
  _listener: MsgListener

  _changes: []
  */

  constructor(owner, url, bus, children) {
    let _this = this;

    _this._owner = owner;
    _this._url = url;
    _this._bus = bus;
    _this._children = children;

    _this._changes = [];
    _this._allocateListeners();
  }

  _allocateListeners() {
    let _this = this;

    _this._listener = _this._bus.addListener(_this._url, (msg) => {
      log.log('DataProvisional-' + _this._url + '-RCV: ', msg);
      _this._changes.push(msg);
    });

    /*
    _this._childrenListeners = [];
    if (_this._children) {
      let childBaseURL = url + '/children/';
      _this._children.forEach((child) => {
        let childURL = childBaseURL + child;
        let listener = _this._bus.addListener(childURL, (msg) => {
          //ignore msg sent by himself
          if (msg.from !== owner) {
            log.log(msg);
          }
        });

        _this._childrenListeners.push(listener);
      });
    }*/
  }

  _releaseListeners() {
    let _this = this;

    _this._listener.remove();

    /*_this._childrenListeners.forEach((listener) => {
      listener.remove();
    });*/
  }

  get children() { return this._children; }

  apply(observer) {
    let _this = this;
    _this._changes.forEach((change) => {
      observer._changeObject(observer._syncObj, change);
    });
  }
}

export default DataProvisional;
