export var ChangeType = {UPDATE: 'update', ADD: 'add', REMOVE: 'remove'};
export var ObjectType = {OBJECT: 'object', ARRAY: 'array'};
export var FilterType = {START: 'start', EXACT: 'exact'};

export default class SyncObject {
  /* private
    _name: string
    _owner: string
    _url: string

    _schema: any
    _data: any;

    _observers: ((event: ChangeEvent) => void)[]
    _filters: {<filter>: {type: <start, exact>, callback: <function>} }
  */

  constructor(name, owner, schema, data) {
    let _self = this;

    _self._name = name;
    _self._owner = owner;
    _self._schema = schema;

    _self._observers = [];
    _self._filters = {};
    _self._url = SyncObject.URL(owner, name);

    if (data) {
      _self._data = data;
    } else {
      _self._data = {};
    }

    _self._internalObserve(new Path(), _self.data);
  }

  static URL(resOwner, resName) { return resOwner + '/' + resName; }

  get name() { return this._name; }
  get owner() { return this._owner; }
  get url() { return this._url; }

  get schema() { return this._schema; }
  get data() { return this._data; }

  observe(callback) {
    this._observers.push(callback);
  }

  observeFilter(filter, callback) {
    let key = filter;
    let filterObj = {
      type: FilterType.EXACT,
      callback: callback
    };

    if (filter.indexOf('*') == filter.length - 1) {
      filterObj.type = FilterType.START;
      key = filter.substr(0, filter.length - 1);
    }

    this._filters[key] = filterObj;
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
    let _self = this;

    Object.keys(_self._filters).forEach((key) => {
      let filter = _self._filters[key];
      if (filter.type == FilterType.START) {
        //if starts with filter...
        if (event.field.indexOf(key) === 0) {
          filter.callback(event);
        }
      } else if (filter.type == FilterType.EXACT) {
        //exact match
        if (event.field == key) {
          filter.callback(event);
        }
      }
    });

    _self._observers.forEach((callback) => {
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
    let _self = this;

    if (_self._isObservable(obj)) {
      let handler = (changes) => {
        _self._onChanges(path, changes);
      };

      if (obj.constructor === Object) {
        //console.log('OBSERVE-OBJECT: <<' + _self._name + '>>' + path);
        Object.observe(obj, handler);
        for (let prop in obj) {
          if (_self._isObservable(obj[prop])) {
            _self._internalObserve(path.new(prop), obj[prop]);
          }
        }
      } else if (obj.constructor === Array) {
        //console.log('OBSERVE-ARRAY: <<' + _self._name + '>>' + path);
        Array.observe(obj, handler);
        for (let prop in obj) {
          if (_self._isObservable(obj[prop])) {
            let np = path.new(new ArrayIndex(obj[prop], prop));
            _self._internalObserve(np, obj[prop]);
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
        let removeSize = changes[i].removed.length;
        if (removeSize !== 0) {
          let removeValues = changes[i].removed;

          this._fireEvent({
            obj: this,
            cType: ChangeType.REMOVE,
            objType: objType,
            field: field.toString(),
            data: removeSize
          });

          removeValues.forEach((value, index) => {
            if (this._isObservable(value)) {
              path.removeIndex(idx + index);
            }
          });
        }

        let addSize = changes[i].addedCount;
        if (addSize !== 0) {
          let addValues = obj.slice(idx, idx + addSize);
          this._fireEvent({
            obj: this,
            cType: ChangeType.ADD,
            objType: objType,
            field: field.toString(),
            data: deepClone(addValues)
          });

          addValues.forEach((value, index) => {
            if (this._isObservable(value)) {
              let np = path.new(new ArrayIndex(value, idx + index));
              this._internalObserve(np, value);
            }
          });
        }
        //re-define paths...
        if (idx != obj.length - 1) {
          path.reIndexFrom(obj);
        }
      } else {
        let field = path.new(changes[i].name);
        //let oldValue = changes[i].oldValue;
        let newValue = obj[changes[i].name];
        if (changes[i].type === 'update') {
          this._fireEvent({
            obj: this,
            cType: ChangeType.UPDATE,
            objType: objType,
            field: field.toString(),
            data: deepClone(newValue)
          });
        }

        if (changes[i].type === 'add') {
          this._fireEvent({
            obj: this,
            cType: ChangeType.ADD,
            objType: objType,
            field: field.toString(),
            data: deepClone(newValue)
          });
          this._internalObserve(field, newValue);
        }

        if (changes[i].type === 'delete') {
          this._fireEvent({
            obj: this,
            cType: ChangeType.REMOVE,
            objType: objType,
            field: field.toString()
          });
        }

      }
    }
  }
}

function deepClone(obj) {
  //TODO: simple but inefficient JSON deep clone...
  return JSON.parse(JSON.stringify(obj));
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
