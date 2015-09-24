import SyncObject from './SyncObject';
import {ChangeType, ObjectType} from './SyncObject';

export default
/**
 * Syncher
 */
class Syncher {
  /* private
    _postMessage: function(changeMsg);

    _owner: HypertyURL
    _objs: <resURL: SyncObject>
    }>
  */

  constructor(owner, postMessage) {
    if (!owner || !postMessage) {
      throw 'Provide mandatory fields';
    }

    let _this = this;

    _this._owner = owner;
    _this._postMessage = postMessage;

    _this._objs = {};
  }

  postMessage(message) {
    let _this = this;

    let syncObj = _this._objs[message.body.resource];
    if (syncObj) {
      _this._changeObject(syncObj, message);
    } else {
      //TODO: _this._postMessage(replyMsg)
      console.log('Object not found!');
    }
  }

  /**
   * Hyperty instance uses this function to provide the object to be changed by the (observer) syncher according to messages received. The Hyperty instance has previsouly used the Object.observe javascript api to set as an observer of this object
   * @param  {Message.Message} receivedMessage receivedMessage
   */
  createAsObserver(message) {
    let _this = this;

    if (_this._objs.hasOwnProperty(message.body.resource)) {
      throw 'Already available object: ' + resourceURL;
    }

    let syncObj = new SyncObject(message.body.resource, message.body.schema, message.header.from, message.body.value);

    _this._objs[syncObj.url] = syncObj;
    return syncObj;
  }

  createAsReporter(resourceURL, schemaURL, initialData) {
    let _this = this;

    if (_this._objs.hasOwnProperty(resourceURL)) {
      throw 'Already available object: ' + resourceURL;
    }

    let syncObj = new SyncObject(resourceURL, schemaURL, _this._owner, initialData);
    syncObj.observe((event) => {
      _this._onChange(event);
    });

    _this._objs[syncObj.url] = syncObj;
    return syncObj;
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
    let _this = this;

    let objData = _this._objs[event.obj.url];

    let msg = {
      header: {
        type: event.cType,
        from: _this._owner
      },
      body: {
        resource: event.obj.url,
        oType: event.objType,
        attrib: event.field,
        value: event.data
      }
    };

    //send delta message...
    _this._postMessage(msg);
  }
}
