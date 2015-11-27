import {deepClone} from '../utils/utils.js';

class SyncObject {
  /* private
    _data: any;
    _observers: ((event: ChangeEvent) => void)[]
  */

  constructor(initialData) {
    let _this = this;

    _this._observers = [];
    _this._filters = {};

    if (initialData) {
      _this._data = initialData;
    } else {
      _this._data = {};
    }

    _this._internalObserve(new Path(), _this._data);
  }

  get data() { return this._data; }

  observe(callback) {
    this._observers.push(callback);
  }

  find(path) {
    let list = path.split('.');

    return this._findWithSplit(list);
  }

  findBefore(path) {
    let result = {};
    let list = path.split('.');
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

  _fireEvent(event) {
    this._observers.forEach((callback) => {
      callback(event);
    });
  }

  _isObservable(obj) {
    if (obj.constructor === Object || obj.constructor === Array) {
      return true;
    }

    return false;
  }

  _internalObserve(path, obj) {
    let _this = this;

    if (_this._isObservable(obj)) {
      let handler = (changes) => {
        _this._onChanges(path, changes);
      };

      if (obj.constructor === Object) {
        Object.observe(obj, handler);
        for (let prop in obj) {
          if (_this._isObservable(obj[prop])) {
            _this._internalObserve(path.new(prop), obj[prop]);
          }
        }
      } else if (obj.constructor === Array) {
        Array.observe(obj, handler);
        for (let prop in obj) {
          if (_this._isObservable(obj[prop])) {
            let np = path.new(new ArrayIndex(obj[prop], prop));
            _this._internalObserve(np, obj[prop]);
          }
        }
      }
    }
  }

  _onChanges(path, changes) {
    for (let i in changes) {
      let obj = changes[i].object;
      let objType;

      if (obj.constructor == Object) {
        objType = ObjectType.OBJECT;
      }

      if (obj.constructor == Array) {
        objType = ObjectType.ARRAY;
      }

      if (changes[i].type === 'splice') {
        let idx = changes[i].index;
        let field = path.new('' + idx);
        let fieldString = field.toString();

        let removeSize = changes[i].removed.length;
        if (removeSize !== 0) {
          let removeValues = changes[i].removed;
          removeValues.forEach((value, index) => {
            if (this._isObservable(value)) {
              path.removeIndex(idx + index);
            }
          });

          this._fireEvent({
            cType: ChangeType.REMOVE,
            oType: objType,
            field: fieldString,
            data: removeSize
          });
        }

        let addSize = changes[i].addedCount;
        if (addSize !== 0) {
          let addValues = obj.slice(idx, idx + addSize);
          addValues.forEach((value, index) => {
            if (this._isObservable(value)) {
              let np = path.new(new ArrayIndex(value, idx + index));
              this._internalObserve(np, value);
            }
          });

          this._fireEvent({
            cType: ChangeType.ADD,
            oType: objType,
            field: fieldString,
            data: deepClone(addValues)
          });
        }

        //re-define paths...
        if (idx != obj.length - 1) {
          path.reIndexFrom(obj);
        }
      } else {
        let field = path.new(changes[i].name);
        let fieldString = field.toString();

        if (fieldString.indexOf('Symbol') !== -1) {
          //hack for PhantomJS2
          //console.log('SYMBOL: ', changes[i]);
          continue;
        }

        //let oldValue = changes[i].oldValue;
        let newValue = obj[changes[i].name];
        if (changes[i].type === 'update') {
          this._fireEvent({
            cType: ChangeType.UPDATE,
            oType: objType,
            field: fieldString,
            data: deepClone(newValue)
          });
        }

        if (changes[i].type === 'add') {
          this._internalObserve(field, newValue);
          this._fireEvent({
            cType: ChangeType.ADD,
            oType: objType,
            field: fieldString,
            data: deepClone(newValue)
          });
        }

        if (changes[i].type === 'delete') {
          this._fireEvent({
            cType: ChangeType.REMOVE,
            oType: objType,
            field: fieldString
          });
        }
      }
    }
  }
}

//dynamic path for Array index...
class Path {

  constructor() {
    this._path = [];
    this._observables = {}; //<index:ArrayIndex>
  }

  removeIndex(idx) {
    //console.log('REMOVE-PATH ' + idx);
    delete this._observables[idx];
  }

  reIndexFrom(array) {
    Object.keys(this._observables).forEach((key) => {
      let arrayIndex = this._observables[key];
      let idx = array.indexOf(arrayIndex.obj);
      if (arrayIndex.idx != idx) {
        //console.log('RE-INDEX: ' + key + '->' + idx);
        arrayIndex.idx = idx;
        delete this._observables[key];
        this._observables[idx] = arrayIndex;
      }
    });
  }

  new(idx) {
    if (idx.constructor == ArrayIndex) {
      //console.log('PATH-OBSERV: ', idx);
      this._observables[idx.idx] = idx;
    }

    let nPath = this.clone();
    nPath._path.push(idx);

    return nPath;
  }

  clone() {
    let nPath = new Path();
    this._path.forEach((value) => {
      nPath._path.push(value);
    });

    return nPath;
  }

  toString() {
    //TODO: optimize!!
    let str = '';
    this._path.forEach((value, index) => {
      if (index === 0) {
        str = value.toString();
      } else {
        str += '.' + value.toString();
      }
    });

    return str;
  }
}

class ArrayIndex {

  constructor(obj, idx) {
    this.obj = obj;
    this.idx = idx;
  }

  toString() {
    return this.idx.toString();
  }
}

export var ChangeType = {UPDATE: 'update', ADD: 'add', REMOVE: 'remove'};
export var ObjectType = {OBJECT: 'object', ARRAY: 'array'};
export default SyncObject;
