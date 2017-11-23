class Operators {

  and(params) {
    return params[0] && params[1];
  }

  between(params) {
    let start = parseInt(params[0][0]);
    let end = parseInt(params[0][1]);
    let now = params[1];

    if (end < start) {
      now = (now < start) ? now += 2400 : now;
      end += 2400;
    }

    return (now > start && now < end);
  }

  equals(params) {
    return String(params[0]) === '*' || String(params[0]) === String(params[1]);
  }

  greaterThan(params) {
    return params[1] > params[0];
  }

  in(params) {
    return params[0].indexOf(params[1]) > -1;
  }

  lessThan(params) {
    return params[1] < params[0];
  }

  not(params) {
    return !params[0];
  }

  or(params) {
    return params[0] || params[1];
  }

}

export default Operators;
