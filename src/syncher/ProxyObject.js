import 'proxy-observe';
import {parseAttributes} from '../utils/utils';

const objectType = {ARRAY: '[object Array]', OBJECT: '[object Object]' };

/**
 * @access private
 * Main class that maintains a JSON object, and observes changes in this object, recursively.
 * Internal objects and arrays are also observed.
 */
class SyncObject {

  constructor(initialData) {
    let _this = this;

    _this._observers = [];
    _this._filters = {};

    this._data = initialData || {};

    this._internalObserve(this._data);
  }

  get data() { return this._data; }

  observe(callback) {
    this._observers.push(callback);
  }

  find(path) {
    let list = parseAttributes(path);

    return this._findWithSplit(list);
  }

  findBefore(path) {
    let result = {};
    let list = parseAttributes(path);
    result.last = list.pop();
    result.obj = this._findWithSplit(list);

    return result;
  }

  _findWithSplit(list) {
    let obj = this._data;
    list.forEach((value) => {
      obj = obj[value];
    });

    return obj;
  }

  _internalObserve(object) {

    let handler = (changeset) => {

      changeset.every((change) => {
        this._onChanges(change);
      });

    };

    this._data = Object.deepObserve(object, handler);

  }

  _fireEvent(event) {
    this._observers.forEach((callback) => {
      callback(event);
    });
  }

  _onChanges(change) {

    let obj = change.object;
    let objType;

    if (obj.constructor === Object) {
      objType = ObjectType.OBJECT;
    }

    if (obj.constructor === Array) {
      objType = ObjectType.ARRAY;
    }

    let fieldString = change.keypath;

    // console.log('Field:', fieldString);
    // console.log('type:', change.type);

    //let oldValue = change.oldValue;
    let newValue = obj[change.name];

    // console.info(change.type + ' | Field: ' + fieldString + ' | New Value:', JSON.stringify(newValue), fieldString.includes('length'));

    if (change.type === 'update' && !fieldString.includes('.length')) {
      this._fireEvent({
        cType: ChangeType.UPDATE,
        oType: objType,
        field: fieldString,
        data: newValue
      });
    }

    if (change.type === 'add') {
      this._fireEvent({
        cType: ChangeType.ADD,
        oType: objType,
        field: fieldString,
        data: newValue
      });
    }

    if (change.type === 'delete') {
      this._fireEvent({
        cType: ChangeType.REMOVE,
        oType: objType,
        field: fieldString
      });
    }
  }

}

export let ChangeType = {UPDATE: 'update', ADD: 'add', REMOVE: 'remove'};
export let ObjectType = {OBJECT: 'object', ARRAY: 'array'};
export default SyncObject;
