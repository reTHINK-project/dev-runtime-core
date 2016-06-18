class Operators {

  constructor() {
    let _this = this;
    _this.operators = _this.setOperators();
  }

  setOperators() {
    let _this = this;
    let operators = {
      between: (params) => { return _this.isBetween(params[0][0], params[0][1], params[1]); },
      in: (params) => { return params[0].indexOf(params[1]) > -1; },
      equals: (params) => { return params[0][0] === '*' || params[0][0] === params[1]; },

      or: (params) => { return  params[0] || params[1]; },
      and: (params) => { return params[0] && params[1]; },
      not: (params) => { return !params[0]; }
    };
    return operators;
  }

  /**
  * Verifies if the current time is between the given start and end times.
  * @param {Number}     start
  * @param {Number}     end
  * @return {Boolean}   boolean
  */
  isBetween(start, end, now) {
    start = parseInt(start);
    end = parseInt(end);

    if (end < start) {
      now = (now < start) ? now += 2400 : now;
      end += 2400;
    }
    return (now > start && now < end);
  }

}

export default Operators;
