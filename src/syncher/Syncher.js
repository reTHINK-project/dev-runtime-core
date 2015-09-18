import SyncObject from './SyncObject';
import {ChangeType, ObjectType} from './SyncObject';

export default class Syncher {
  /* private
    _mb: MiniBus;

    _schemas: {};
    _objs: <resURL, {
      obj: SyncObject,
      subs: URL[],
      version: number,
      cQueue: {<ver>: msg}
    }>
  */

  constructor(mb) {
    let _this = this;

    _this._schemas = {};
    _this._objs = {};

    _this._mb = mb;
    mb.subscribe(Syncher.NAME, (msg) => {
      let objData = _this._objs[msg.body.res];
      if (objData) {
        //only the owner is able to change the object
        if (msg.header.from === objData.obj.owner) {
          _this._processChange(objData, msg);
        } else {
          console.log(
            'msg.header.from !== objData.owner',
            msg.header.from,
            objData.obj.owner
          );
        }
      } else {
        msg.reply('error', 'Object not found!');
      }
    });
  }

  addSchema(schemaURL, schema) {
    let _this = this;

    if (_this._schemas.hasOwnProperty(schemaURL)) {
      throw 'There is already available schema: ' + schemaURL;
    }

    _this._schemas[schemaURL] = schema;
  }

  create(resourceName, schemaURL, data, owner) {
    let _this = this;

    if (_this._objs.hasOwnProperty(resourceName)) {
      throw 'Already available object: ' + resourceName;
    }

    if (!_this._schemas.hasOwnProperty(schemaURL)) {
      throw 'There is no schema: ' + schemaURL;
    }

    let _owner = _this._mb.owner;
    if (owner) {
      _owner = owner;
    }

    let so = new SyncObject(resourceName, _owner, schemaURL, data);
    so.observe((event) => {
      _this._onChange(event);
    });

    _this._objs[so.name] = {
      obj: so,
      subs: [],
      version: 0,
      cQueue: []
    };

    return so;
  }

  addSubscription(resourceName, url) {
    let _this = this;

    let objData = _this._objs[resourceName];
    if (!objData) {
      throw 'Object not found: ' + resourceName;
    }

    objData.subs.push(url);
  }

  removeSubscription(resourceName, url) {
    let _this = this;

    let objData = _this._objs[resourceName];
    if (!objData) {
      throw 'Object not found: ' + resourceName;
    }

    let index = objData.subs.indexOf(url);
    objData.subs.splice(index, 1);
  }

  _processChange(objData, msg) {
    let _this = this;

    if (msg.body.ver) {
      if (msg.body.ver > objData.version) {
        objData.cQueue[msg.body.ver] = msg;
      } else {
        msg.reply('error', 'Invalid object version!');
      }

      _this._processQueue(objData);
    } else {
      _this._changeObject(objData.obj, msg);
    }
  }

  _processQueue(objData) {
    let _this = this;

    let nextMsg = objData.cQueue[objData.version + 1];
    if (nextMsg) {
      _this._changeObject(objData.obj, nextMsg);
      objData.version++;

      //on change per event loop is more robust to bugs!
      setTimeout(() => {
        _this._processQueue(objData);
      });
    } else {
      console.log('Waiting for version: ' + (objData.version + 1));
    }
  }

  _changeObject(syncObj, msg) {
    let path = msg.body.attrib;
    let value = msg.body.value;
    let findResult = syncObj.findBefore(path);

    if (msg.header.type == ChangeType.UPDATE) {
      findResult.obj[findResult.last] = value;
    } else {
      if (msg.header.type == ChangeType.ADD) {
        if (msg.body.oType == ObjectType.OBJECT) {
          findResult.obj[findResult.last] = value;
        } else {
          //ARRAY
          let arr = findResult.obj;
          let index = findResult.last;
          Array.prototype.splice.apply(arr, [index, 0].concat(value));
        }
      } else {
        //REMOVE
        if (msg.body.oType == ObjectType.OBJECT) {
          delete findResult.obj[findResult.last];
        } else {
          //ARRAY
          let arr = findResult.obj;
          let index = findResult.last;
          arr.splice(index, value);
        }
      }
    }
  }

  _onChange(event) {
    let objData = this._objs[event.obj.name];
    objData.version++;

    //send deltas to all subscribers...
    objData.subs.forEach((url) => {
      let msg = {
        header: {
          type: event.cType,
          to: url
        },
        body: {
          //ver: objData.version,
          res: event.obj.name,
          oType: event.objType,
          attrib: event.field,
          value: event.data
        }
      };

      this._sendMsg(msg);
    });
  }

  _sendMsg(msg) {
    msg.header.comp = Syncher.NAME;
    this._mb.publish(msg);
  }
}

Syncher.NAME = 'syncher';
