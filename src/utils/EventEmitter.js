/**
 * EventEmitter
 * All classes which extends this, can have addEventListener and trigger events;
 */
class EventEmitter {

  /**
   * addEventListener listen for an eventType
   * @param  {string}         eventType - listening for this type of event
   * @param  {Function}       cb        - callback function will be executed when the event it is invoked
   */
  addEventListener(eventType, cb) {
    let _this = this;
    _this[eventType] = cb;
  }

  /**
   * Invoke the eventType
   * @param  {string} eventType - event will be invoked
   * @param  {object} params - parameters will be passed to the addEventListener
   */
  trigger(eventType, params) {
    let _this = this;

    if (_this[eventType]) {
      _this[eventType](params);
    }
  }

}

export default EventEmitter;
