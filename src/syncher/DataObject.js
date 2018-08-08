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

// Log System
import * as logger from 'loglevel';
let log = logger.getLogger('DataObject');

import SyncObject, {ChangeType, ObjectType} from './ProxyObject';
import DataObjectChild from './DataObjectChild';
import { deepClone, divideURL } from '../utils/utils.js';
import HypertyResourceFactory from '../hyperty-resource/HypertyResourceFactory.js';

/**
 * Main extension class for observers and reporters, with common properties and methods.
 * Children management is common for observers and reporters.
 */
class DataObject {
  /* private
  _version: number

  _owner: HypertyURL
  _url: ObjectURL
  _schema: Schema
  _bus: MiniBus
  _status: on | paused
  _syncObj: SyncData

  _children: { id: DataObjectChild }
  _childrenListeners: [MsgListener]

  ----event handlers----
  _onAddChildHandler: (event) => void
  */

  /**
   * @ignore
   * Should not be used directly by Hyperties. It's called by the Syncher create or subscribe method's
   */

  constructor(input) {
    let _this = this;

    function throwMandatoryParmMissingError(par) {
      throw '[DataObject] ' + par + ' mandatory parameter is missing';
    }

    input.syncher ? _this._syncher = input.syncher : throwMandatoryParmMissingError('syncher');
    input.url ?  _this._url = input.url : throwMandatoryParmMissingError('url');
    input.created ? _this._created = input.created : throwMandatoryParmMissingError('created');
    input.reporter ? _this._reporter = input.reporter : throwMandatoryParmMissingError('reporter');
    input.runtime ? _this._runtime = input.runtime : throwMandatoryParmMissingError('runtime');
    input.schema ? _this._schema = input.schema : throwMandatoryParmMissingError('schema');
    input.name ? _this._name = input.name : throwMandatoryParmMissingError('name');


    _this._status = input.status;

    if (input.data) {
      _this._syncObj = new SyncObject(input.data);
    } else {
      _this._syncObj = new SyncObject({});
    }
    _this._childrens = input.childrens;

    //TODO: For Further Study
    _this._mutual = input.mutual;

    _this._version = 0;
    _this._childId = 0;
    _this._childrenListeners = []; //bus listeners per children
    _this._onAddChildrenHandler; //Hyperty side handlers to process child objects created by remote Hyperties

    _this._resumed = input.resume;

    if (input.resume) { _this._version = input.version; }

    _this._owner = input.syncher._owner;
    _this._bus = input.syncher._bus;

    if (input.description) _this._description = input.description;
    if (input.tags) _this._tags = input.tags;
    if (input.resources) _this._resources = input.resources;
    if (input.observerStorage) _this._observerStorage = input.observerStorage;
    if (input.publicObservation) _this._publicObservation = input.publicObservation;

    _this._metadata = Object.assign(input);

    if (!input.hasOwnProperty('resume') || (input.hasOwnProperty('resume') && !input.resume)) {
      _this._metadata.lastModified = _this._metadata.created;
    }


    delete _this._metadata.data;
    delete _this._metadata.syncher;
    delete _this._metadata.authorise;

    _this._hypertyResourceFactory = new HypertyResourceFactory();
    _this._childrenObjects = {};
    _this._sharedChilds = []; //childObjects that were not sent yet to Reporters
  }

  _getLastChildId() {
    let _this = this;

    let childIdInt = 0;
    let childIdString = _this._owner + '#' + childIdInt;


    Object.keys(_this._childrens).filter((key) => {
      if (_this._childrens[key].childId > childIdString) {
        childIdString = _this._childrens[key].childId;
      }
    });

    return childIdInt = Number(childIdString.split('#')[1]);
  }

  _allocateListeners() {
    let _this = this;

    let childBaseURL = _this._url + '/children/';
    log.log('[Data Object - AllocateListeners] - ', _this._childrens);
    if (_this._childrens) {
      _this._childrens.forEach((child) => {
        let childURL = childBaseURL + child;
        let listener = _this._bus.addListener(childURL, (msg) => {
          //ignore msg sent by himself
          if (msg.from !== this._owner) {
            log.log('DataObject-Children-RCV: ', msg);
            switch (msg.type) {
              case 'create': _this._onChildCreate(msg); break;
              case 'delete': log.log(msg); break;
              default: _this._changeChildren(msg); break;
            }
          }
        });

        _this._childrenListeners.push(listener);
      });
    }
  }

  _releaseListeners() {
    let _this = this;

    _this._childrenListeners.forEach((listener) => {
      listener.remove();
    });

    Object.keys(_this._childrenObjects).forEach((children) => {
      Object.keys(_this._childrenObjects[children]).forEach((child) => {
        _this._childrenObjects[children][child]._releaseListeners();
      });
    });
  }

  /**
   *
   */
  resumeChildrens(childrens) {
    let _this = this;

    let childIdString = this._owner + '#' + this._childId;


    //setup childrens data from subscription
    Object.keys(childrens).forEach((childrenResource) => {
      let children = childrens[childrenResource];

      //_this._childrenObjects[childrenResource] = {};
      Object.keys(children).forEach((childId) => {
        let newChild = false;

        if (!_this._childrenObjects.hasOwnProperty(childrenResource))
          _this._childrenObjects[childrenResource] = {};

        if (children[childId].value.resourceType && !_this._childrenObjects[childrenResource].hasOwnProperty(childId)) {
          _this._childrenObjects[childrenResource][childId] = _this._resumeHypertyResource(children[childId]);
          newChild = true;
        } else if (!_this._childrenObjects[childrenResource].hasOwnProperty(childId)) {

          _this._childrenObjects[childrenResource][childId] = _this._resumeChild(children[childId]);
          log.log('[DataObject.resumeChildrens] new DataObjectChild: ', _this._childrenObjects[childrenResource][childId]);
          newChild = true;
        }

        if (newChild && childId > childIdString) {
          childIdString = childId;
          log.log('[DataObjectReporter.resumeChildrens] - resuming: ', this._childrenObjects[childrenResource][childId]);
        }

      });
    });

    this._childId = Number(childIdString.split('#')[1]);

  }

  _resumeChild(input) {
    let _this = this;
    let childInput = input.value;
    childInput.parentObject = _this;
    childInput.parent = _this._url;

    let child = new DataObjectChild(childInput);

    child.identity = input.identity;

    let event = {
      type: 'create',
      from: child.reporter,
      url: child.parent,
      value: child.data,
      childId: child.url,
      identity: child.identity,
      child: child
    };

    if (child.resourceType) {
      event.resource = child;

    }

    if (_this._onAddChildrenHandler) _this._onAddChildrenHandler(event);

    return child;

  }

  _resumeHypertyResource(input) {
    let _this = this;
    let childInput = input.value;
    childInput.parentObject = _this;
    childInput.parent = _this._url;

    let hypertyResource = _this._hypertyResourceFactory.createHypertyResource(false, childInput.resourceType, childInput)

    hypertyResource.identity = input.identity;

    let event = {
      type: 'create',
      from: hypertyResource.reporter,
      url: hypertyResource.parent,
      value: hypertyResource.data,
      childId: hypertyResource.url,
      identity: hypertyResource.identity,
      child: hypertyResource
    };

    if (hypertyResource.resourceType) {
      event.resource = hypertyResource;

    }

    if (_this._onAddChildrenHandler) _this._onAddChildrenHandler(event);

    return hypertyResource;
  }

  /**
   * All Metadata about the Data Object
   * @type {Object} -
   */

  get metadata() { return this._metadata; }

  /**
   * Object URL of reporter or observer
   * @type {ObjectURL}
   */
  get url() { return this._url; }

  /**
   * Object schema URL (this field is not yet stable, and is subsject to change)
   * @type {SchemaURL}
   */
  get schema() { return this._schema; }

  /**
   * Status of the reporter or observer connection (this field is not yet stable, and is subsject to change)
   * @type {Status} - Enum of: on | paused
   */
  get status() { return this._status; }

  /**
   * Data structure to be synchronized.
   * @type {JSON} - JSON structure that should follow the defined schema, if any.
   */
  get data() { return this._syncObj.data; }

  /**
   * All created children's since the subscription, doesn't contain all children's since reporter creation.
   * @type {Object<ChildId, DataObjectChild>}
   */
  get childrens() { return this._childrenObjects; }

  /**
   * @ignore
   */
  pause() {
    //TODO: this feature needs more analise
    throw 'Not implemented';
  }

  /**
   * @ignore
   */
  resume() {
    //TODO: this feature needs more analise
    throw 'Not implemented';
  }

  /**
   * @ignore
   */
  stop() {
    //TODO: should remove the subscription and send message unsubscribe?
    throw 'Not implemented';
  }

  /**
   * Create and add a DataObjectChild to a children collection.
   * @param {String} children - Children name where the child is added.
   * @param {JSON} initialData - Initial data of the child
   * @param  {MessageBodyIdentity} identity - (optional) identity data to be added to identity the user reporter. To be used for legacy identities.
   * @param  {SyncChildMetadata} input - (optional) All additional metadata about the DataObjectChild.
   * @return {Promise<DataObjectChild>} - Return Promise to a new DataObjectChild.
   */

  addChild(children, initialData, identity, input) {
    let _this = this;
    let newChild;

    //returns promise, in the future, the API may change to asynchronous call
    return new Promise((resolve) => {

      let msgChildPath = _this._url + '/children/' + children;


      let childInput = _this._getChildInput(input);
      childInput.data = initialData;
      childInput.children = children;
      newChild = new DataObjectChild(childInput);

      if (identity) newChild.identity = identity;

      newChild.share();

      log.log('[DataObject.addChild] added ', newChild);

      newChild.onChange((event) => {
        _this._onChange(event, { path: msgChildPath, childId: childInput.url });
      });

      if (!_this._childrenObjects.hasOwnProperty(children)) _this._childrenObjects[children] = {};

      _this._childrenObjects[children][childInput.url] = newChild;

      resolve(newChild);
    });
  }

  _deleteChildrens() {

    let _this = this;
    let deletePromises = [];


    return new Promise((resolve) => {
      if (_this.childrens) {
        log.log('[DataObject.deleteChildrens]', _this.childrens);
        let children;

        for (children in _this.childrens) {
          let child;
          for (child in _this.childrens[children]) {
            let childObj = _this.childrens[children][child];
            log.log('[DataObject._deleteChildrens] child',childObj);
            if (childObj.metadata.hasOwnProperty('resourceType'))
              deletePromises.push(_this.childrens[children][child].delete());
          }
        }
      }

      log.log('[DataObject._deleteChildrens] promises ', deletePromises);

      if (deletePromises.length > 0) {
        Promise.all(deletePromises).then(()=>{
          resolve('[DataObject._deleteChildrens] done');
        });
      } else resolve('[DataObject._deleteChildrens] nothing to delete');

    });

  }

  _getChildInput(input) {
    let _this = this;
    let childInput  = Object.assign({}, input);

    _this._childId++;
    childInput.url = _this._owner + '#' + _this._childId;

    childInput.parentObject = _this;
    childInput.reporter = _this._owner;
    childInput.created = (new Date).toISOString();
    childInput.runtime = _this._syncher._runtimeUrl;
    childInput.p2pHandler = _this._syncher._p2pHandler;
    childInput.p2pRequester = _this._syncher._p2pRequester;
    childInput.schema = _this._schema;
    childInput.parent = _this.url;

    return childInput;
  }

  addHypertyResource(children, type, resource, identity, input) {
    let _this = this;

    //returns promise, in the future, the API may change to asynchronous call
    return new Promise((resolve) => {

      let hypertyResource;
      let msgChildPath = _this._url + '/children/' + children;

      let childInput = _this._getChildInput(input);
      childInput.children = children;

      _this._hypertyResourceFactory.createHypertyResourceWithContent(true, type, resource, childInput).then((resource)=>{
        hypertyResource = resource;

        if (identity) hypertyResource.identity = identity;

        hypertyResource.share();

        log.log('[DataObject.addHypertyResource] added ', hypertyResource);

        hypertyResource.onChange((event) => {
          _this._onChange(event, { path: msgChildPath, childId: hypertyResource.childId });
        });

        if (!_this._childrenObjects.hasOwnProperty(children)) _this._childrenObjects[children] = {};

        _this._childrenObjects[children][hypertyResource.childId] = hypertyResource;

        resolve(hypertyResource);
      });


    });
  }

  /**
   * Setup the callback to process create and delete of childrens.
   * @param {function(event: MsgEvent)} callback
   * TODO: add childrenId to support different handlers per children
   */
  onAddChild(callback) {

    this._onAddChildrenHandler = callback;
  }

  //FLOW-IN: message received from a remote DataObject -> addChild
  _onChildCreate(msg) {
    let _this = this;

    log.log('[DataObject._onChildCreate] receivedBy ' + _this._owner + ' : ', msg);

    let response = {
      from: msg.to,
      to: msg.from,
      type: 'response',
      id: msg.id,
      body: {
        code: 100
      }
    }

    _this._bus.postMessage(response);

    if (msg.body.value.resourceType) {
      _this._onHypertyResourceAdded(msg);
    } else _this._onChildAdded(msg);
  }

  _onChildAdded(msg) {
    let _this = this;
    let childInput = deepClone(msg.body.value);
    childInput.parentObject = _this;

    let children = childInput.children;

    let newChild = new DataObjectChild(childInput);
    newChild.identity = msg.body.identity;


    if (!_this._childrenObjects.hasOwnProperty(children)) _this._childrenObjects[children] = {};

    _this._childrenObjects[children][childInput.url] = newChild;

    if (msg.to === _this.metadata.url) newChild.store();

    _this._hypertyEvt(msg, newChild);
  }

  _onHypertyResourceAdded(msg) {
    let _this = this;
    let input = msg.body.value;
    let hypertyResource;

    let children = input.children;

    input.parentObject = _this;

    hypertyResource = _this._hypertyResourceFactory.createHypertyResource(false, input.resourceType, input);
    hypertyResource.identity = msg.body.identity;

    if (!_this._childrenObjects.hasOwnProperty(children)) _this._childrenObjects[children] = {};

    _this._childrenObjects[children][hypertyResource.childId] = hypertyResource;

    _this._hypertyEvt(msg, hypertyResource);

    // locally store messages that are directly sent to the hyperty
    // ie to sync with messages sent when offline

    if (msg.to === _this.metadata.url) hypertyResource.store();
  }

  _hypertyEvt(msg, child) {
    let _this = this;

    let event = {
      type: msg.type,
      from: msg.from,
      url: msg.to,
      value: child.data,
      childId: child.url,
      identity: msg.body.identity,
      child: child
    };

    if (child.resourceType) {
      event.resource = child;

    }

    if (_this._onAddChildrenHandler) _this._onAddChildrenHandler(event);
  }

  //send delta messages to subscriptions
  _onChange(event, childInfo) {
    let _this = this;

    _this._metadata.lastModified = (new Date).toISOString();

    _this._version++;

    if (_this._status === 'live') {
      //FLOW-OUT: this message will be sent directly to a resource changes address: MessageBus
      let changeMsg = {
        type: 'update', from: _this._url, to: _this._url + '/changes',
        body: { version: _this._version, source: _this._owner, attribute: event.field, lastModified: _this._metadata.lastModified }
      };

      log.log('[DataObject - _onChange] - ', event, childInfo, changeMsg);

      if (event.oType === ObjectType.OBJECT) {
        if (event.cType !== ChangeType.REMOVE) {
          changeMsg.body.value = deepClone(event.data);
        }
      } else {
        changeMsg.body.attributeType = event.oType;
        changeMsg.body.value = event.data;
        if (event.cType !== ChangeType.UPDATE) {
          changeMsg.body.operation = event.cType;
        }
      }

      //childInfo must have (path, childId)
      if (childInfo) {
        changeMsg.to = childInfo.path;
        changeMsg.body.resource = childInfo.childId;
      }

      //TODO: For Further Study
      if (!_this.data._mutual) changeMsg.body.mutual = _this._mutual;

      _this._bus.postMessage(changeMsg);
    }
  }

  //FLOW-IN: delta message received from a remote DataObjectReporter or DataObjectChild when changing data
  _changeObject(syncObj, msg) {
    let _this = this;

    //TODO: update version ?
    //how to handle an incorrect version ? Example: receive a version 3 when the observer is in version 1, where is the version 2 ?
    //will we need to confirm the reception ?
    if (_this._version + 1 <= msg.body.version) {
      _this._version = msg.body.version;
      let path = msg.body.attribute;
      let value;
      if (typeof msg.body.value === 'object') value = deepClone(msg.body.value);
      else value = msg.body.value;

      let findResult = syncObj.findBefore(path);

      if (msg.body.lastModified) {
        _this._metadata.lastModified = msg.body.lastModified;
      } else {
        _this._metadata.lastModified = (new Date).toISOString();
      }

      if (msg.body.attributeType === ObjectType.ARRAY) {
        if (msg.body.operation === ChangeType.ADD) {
          let arr = findResult.obj;
          let index = findResult.last;
          Array.prototype.splice.apply(arr, [index, 0].concat(value));
        } else if (msg.body.operation === ChangeType.REMOVE) {
          let arr = findResult.obj;
          let index = findResult.last;
          arr.splice(index, value);
        } else {
          findResult.obj[findResult.last] = value; // UPDATE
        }
      } else {
        if (msg.body.hasOwnProperty('value')) {
          findResult.obj[findResult.last] = value; // UPDATE or ADD
        } else {
          delete findResult.obj[findResult.last]; // REMOVE
        }
      }
    } else {
      //TODO: how to handle unsynchronized versions?
      log.log('UNSYNCHRONIZED VERSION: (data => ' + _this._version + ', msg => ' + msg.body.version + ')');
    }
  }

  //FLOW-IN: message received from a remote DataObjectChild when changing data
  _changeChildren(msg) {
    let _this = this;
    const dividedURL = divideURL(msg.to);
    const identity = dividedURL.identity;
    const resource = identity ? identity.substring(identity.lastIndexOf('/') + 1) : undefined;

    let childId = msg.body.resource;
    let children = _this._childrenObjects[resource][childId];

    log.log('Change children: ', _this._owner, msg, resource);

    if (children) {
      _this._changeObject(children._syncObj, msg);
    } else {
      log.warn('No children found for: ', childId);
    }
  }

}

export default DataObject;
