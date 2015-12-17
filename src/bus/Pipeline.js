/**
* @author micaelpedrosa@gmail.com
* Pipeline
* Sequencial processor of methods. Similar to how Sequential Promise's work, but better fit for message processing.
*/
class Pipeline {
  /* public
    handlers: ((PipeContext) => void)[]
    onFail: (error) => void
  */

  constructor(_onFail) {
    let _this = this;

    _this.handlers = [];
    _this.onFail = _onFail;
  }

  process(msg, onDeliver) {
    let _this = this;

    if (_this.handlers.length > 0) {
      let iter = new Iterator(_this.handlers);
      iter.next(new PipeContext(_this, iter, msg, onDeliver));
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
    let _this = this;

    _this._inStop = false;

    _this._pipeline = pipeline;
    _this._iter = iter;
    _this._msg = msg;
    _this._onDeliver = onDeliver;
  }

  get pipeline() { return this._pipeline; }

  get msg() { return this._msg; }
  set msg(inMsg) { this._msg = inMsg; }

  next() {
    let _this = this;

    if (!_this._inStop) {
      if (_this._iter.hasNext) {
        _this._iter.next(_this);
      } else {
        _this._onDeliver(_this._msg);
      }
    }
  }

  deliver() {
    let _this = this;
    if (!_this._inStop) {
      _this._inStop = true;
      _this._onDeliver(_this._msg);
    }
  }

  fail(error) {
    let _this = this;

    if (!_this._inStop) {
      _this._inStop = true;
      if (_this._pipeline.onFail) {
        _this._pipeline.onFail(error);
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

export default Pipeline;
