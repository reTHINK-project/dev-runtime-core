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
