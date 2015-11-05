/**
 * EventEmitter
 * All classes which extends this, can have addEventListener and trigger events;
 */
class EventEmitter {

  addEventListener(eventType, cb) {
    let _this = this;
    _this[eventType] = cb;
  }

  trigger(eventType, params) {
    let _this = this;

    if (_this[eventType]) {
      _this[eventType](params);
    }
  }

}

export default EventEmitter;
