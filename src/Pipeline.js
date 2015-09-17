export default class Pipeline {
  /* public
    handlers: ((PipeContext) => void)[]
    onFail: (error) => void
  */

  constructor(_onFail) {
    let _self = this;

    _self.handlers = [];
    _self.onFail = _onFail;
  }

  process(msg, onDeliver) {
    let _self = this;

    let iter = new Iterator(_self.handlers);
    let ctx = new PipeContext(_self, iter, msg, onDeliver);

    if (iter.hasNext) {
      iter.next(ctx);
    } else {
      onDeliver(msg);
    }
  }
}

class PipeContext {
  /* private
    _inStop: boolean

    _pipeline: Pipeline
    _iter: Iterator
    _msg: Message
  */

  constructor(pipeline, iter, msg, onDeliver) {
    let _self = this;

    _self._inStop = false;

    _self._pipeline = pipeline;
    _self._iter = iter;
    _self._msg = msg;
    _self._onDeliver = onDeliver;
  }

  get pipeline() { return this._pipeline; }
  get msg() { return this._msg; }

  next() {
    let _self = this;

    if (!_self._inStop) {
      if (_self._iter.hasNext) {
        _self._iter.next(_self);
      } else {
        _self._onDeliver(_self._msg);
      }
    }
  }

  deliver() {
    let _self = this;
    if (!_self._inStop) {
      _self._inStop = true;
      _self._onDeliver(_self._msg);
    }
  }

  fail(error) {
    let _self = this;

    if (!_self._inStop) {
      _self._inStop = true;
      if (_self._pipeline.onFail) {
        _self._pipeline.onFail(error);
      }
    }
  }
}

class Iterator {
  /* private
    _index: number
    _array: []
  */

  constructor(array) {
    this._index = -1;
    this._array = array;
  }

  get hasNext() {
    return this._index < this._array.length - 1;
  }

  get next() {
    this._index++;
    return this._array[this._index];
  }
}
