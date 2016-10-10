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

// Distribution file for PolicyEngine.js 
// version: 0.6.0
// Last build: Mon Oct 10 2016 13:20:09 GMT+0200 (Mitteleuropäische Sommerzeit)

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PolicyEngine = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":17}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":18}],3:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":19}],4:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":20}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":21}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/keys"), __esModule: true };
},{"core-js/library/fn/object/keys":22}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":23}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/promise"), __esModule: true };
},{"core-js/library/fn/promise":24}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":25}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":26}],11:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],12:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":3}],13:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":4,"../core-js/object/get-prototype-of":5}],14:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":2,"../core-js/object/set-prototype-of":7,"../helpers/typeof":16}],15:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":16}],16:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":9,"../core-js/symbol/iterator":10}],17:[function(require,module,exports){
var core  = require('../../modules/_core')
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};
},{"../../modules/_core":34}],18:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":34,"../../modules/es6.object.create":99}],19:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":34,"../../modules/es6.object.define-property":100}],20:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":34,"../../modules/es6.object.get-own-property-descriptor":101}],21:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":34,"../../modules/es6.object.get-prototype-of":102}],22:[function(require,module,exports){
require('../../modules/es6.object.keys');
module.exports = require('../../modules/_core').Object.keys;
},{"../../modules/_core":34,"../../modules/es6.object.keys":103}],23:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":34,"../../modules/es6.object.set-prototype-of":104}],24:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
module.exports = require('../modules/_core').Promise;
},{"../modules/_core":34,"../modules/es6.object.to-string":105,"../modules/es6.promise":106,"../modules/es6.string.iterator":107,"../modules/web.dom.iterable":111}],25:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":34,"../../modules/es6.object.to-string":105,"../../modules/es6.symbol":108,"../../modules/es7.symbol.async-iterator":109,"../../modules/es7.symbol.observable":110}],26:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":95,"../../modules/es6.string.iterator":107,"../../modules/web.dom.iterable":111}],27:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],28:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],29:[function(require,module,exports){
module.exports = function(it, Constructor, name, forbiddenField){
  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};
},{}],30:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":53}],31:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":87,"./_to-iobject":89,"./_to-length":90}],32:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":33,"./_wks":96}],33:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],34:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],35:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":27}],36:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],37:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":42}],38:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":44,"./_is-object":53}],39:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],40:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":70,"./_object-keys":73,"./_object-pie":74}],41:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":34,"./_ctx":35,"./_global":44,"./_hide":46}],42:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],43:[function(require,module,exports){
var ctx         = require('./_ctx')
  , call        = require('./_iter-call')
  , isArrayIter = require('./_is-array-iter')
  , anObject    = require('./_an-object')
  , toLength    = require('./_to-length')
  , getIterFn   = require('./core.get-iterator-method')
  , BREAK       = {}
  , RETURN      = {};
var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
    , f      = ctx(fn, that, entries ? 2 : 1)
    , index  = 0
    , length, step, iterator, result;
  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if(result === BREAK || result === RETURN)return result;
  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
    result = call(iterator, f, step.value, entries);
    if(result === BREAK || result === RETURN)return result;
  }
};
exports.BREAK  = BREAK;
exports.RETURN = RETURN;
},{"./_an-object":30,"./_ctx":35,"./_is-array-iter":51,"./_iter-call":54,"./_to-length":90,"./core.get-iterator-method":97}],44:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],45:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],46:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":37,"./_object-dp":65,"./_property-desc":76}],47:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":44}],48:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":37,"./_dom-create":38,"./_fails":42}],49:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return              fn.apply(that, args);
};
},{}],50:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":33}],51:[function(require,module,exports){
// check on default Array iterator
var Iterators  = require('./_iterators')
  , ITERATOR   = require('./_wks')('iterator')
  , ArrayProto = Array.prototype;

module.exports = function(it){
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};
},{"./_iterators":59,"./_wks":96}],52:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":33}],53:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],54:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function(iterator, fn, value, entries){
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch(e){
    var ret = iterator['return'];
    if(ret !== undefined)anObject(ret.call(iterator));
    throw e;
  }
};
},{"./_an-object":30}],55:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":46,"./_object-create":64,"./_property-desc":76,"./_set-to-string-tag":81,"./_wks":96}],56:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":41,"./_has":45,"./_hide":46,"./_iter-create":55,"./_iterators":59,"./_library":61,"./_object-gpo":71,"./_redefine":78,"./_set-to-string-tag":81,"./_wks":96}],57:[function(require,module,exports){
var ITERATOR     = require('./_wks')('iterator')
  , SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }

module.exports = function(exec, skipClosing){
  if(!skipClosing && !SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[ITERATOR]();
    iter.next = function(){ return {done: safe = true}; };
    arr[ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./_wks":96}],58:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],59:[function(require,module,exports){
module.exports = {};
},{}],60:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":73,"./_to-iobject":89}],61:[function(require,module,exports){
module.exports = true;
},{}],62:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":42,"./_has":45,"./_is-object":53,"./_object-dp":65,"./_uid":93}],63:[function(require,module,exports){
var global    = require('./_global')
  , macrotask = require('./_task').set
  , Observer  = global.MutationObserver || global.WebKitMutationObserver
  , process   = global.process
  , Promise   = global.Promise
  , isNode    = require('./_cof')(process) == 'process';

module.exports = function(){
  var head, last, notify;

  var flush = function(){
    var parent, fn;
    if(isNode && (parent = process.domain))parent.exit();
    while(head){
      fn   = head.fn;
      head = head.next;
      try {
        fn();
      } catch(e){
        if(head)notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if(parent)parent.enter();
  };

  // Node.js
  if(isNode){
    notify = function(){
      process.nextTick(flush);
    };
  // browsers with MutationObserver
  } else if(Observer){
    var toggle = true
      , node   = document.createTextNode('');
    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
    notify = function(){
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if(Promise && Promise.resolve){
    var promise = Promise.resolve();
    notify = function(){
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function(){
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function(fn){
    var task = {fn: fn, next: undefined};
    if(last)last.next = task;
    if(!head){
      head = task;
      notify();
    } last = task;
  };
};
},{"./_cof":33,"./_global":44,"./_task":86}],64:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":30,"./_dom-create":38,"./_enum-bug-keys":39,"./_html":47,"./_object-dps":66,"./_shared-key":82}],65:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":30,"./_descriptors":37,"./_ie8-dom-define":48,"./_to-primitive":92}],66:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":30,"./_descriptors":37,"./_object-dp":65,"./_object-keys":73}],67:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":37,"./_has":45,"./_ie8-dom-define":48,"./_object-pie":74,"./_property-desc":76,"./_to-iobject":89,"./_to-primitive":92}],68:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":69,"./_to-iobject":89}],69:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":39,"./_object-keys-internal":72}],70:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],71:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":45,"./_shared-key":82,"./_to-object":91}],72:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":31,"./_has":45,"./_shared-key":82,"./_to-iobject":89}],73:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":39,"./_object-keys-internal":72}],74:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],75:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":34,"./_export":41,"./_fails":42}],76:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],77:[function(require,module,exports){
var hide = require('./_hide');
module.exports = function(target, src, safe){
  for(var key in src){
    if(safe && target[key])target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};
},{"./_hide":46}],78:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":46}],79:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":30,"./_ctx":35,"./_is-object":53,"./_object-gopd":67}],80:[function(require,module,exports){
'use strict';
var global      = require('./_global')
  , core        = require('./_core')
  , dP          = require('./_object-dp')
  , DESCRIPTORS = require('./_descriptors')
  , SPECIES     = require('./_wks')('species');

module.exports = function(KEY){
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
    configurable: true,
    get: function(){ return this; }
  });
};
},{"./_core":34,"./_descriptors":37,"./_global":44,"./_object-dp":65,"./_wks":96}],81:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":45,"./_object-dp":65,"./_wks":96}],82:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":83,"./_uid":93}],83:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":44}],84:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject  = require('./_an-object')
  , aFunction = require('./_a-function')
  , SPECIES   = require('./_wks')('species');
module.exports = function(O, D){
  var C = anObject(O).constructor, S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};
},{"./_a-function":27,"./_an-object":30,"./_wks":96}],85:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":36,"./_to-integer":88}],86:[function(require,module,exports){
var ctx                = require('./_ctx')
  , invoke             = require('./_invoke')
  , html               = require('./_html')
  , cel                = require('./_dom-create')
  , global             = require('./_global')
  , process            = global.process
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
var run = function(){
  var id = +this;
  if(queue.hasOwnProperty(id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function(event){
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!setTask || !clearTask){
  setTask = function setImmediate(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(require('./_cof')(process) == 'process'){
    defer = function(id){
      process.nextTick(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if(MessageChannel){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
    defer = function(id){
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if(ONREADYSTATECHANGE in cel('script')){
    defer = function(id){
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./_cof":33,"./_ctx":35,"./_dom-create":38,"./_global":44,"./_html":47,"./_invoke":49}],87:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":88}],88:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],89:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":36,"./_iobject":50}],90:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":88}],91:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":36}],92:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":53}],93:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],94:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":34,"./_global":44,"./_library":61,"./_object-dp":65,"./_wks-ext":95}],95:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":96}],96:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":44,"./_shared":83,"./_uid":93}],97:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":32,"./_core":34,"./_iterators":59,"./_wks":96}],98:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":28,"./_iter-define":56,"./_iter-step":58,"./_iterators":59,"./_to-iobject":89}],99:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":41,"./_object-create":64}],100:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":37,"./_export":41,"./_object-dp":65}],101:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":67,"./_object-sap":75,"./_to-iobject":89}],102:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":71,"./_object-sap":75,"./_to-object":91}],103:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object')
  , $keys    = require('./_object-keys');

require('./_object-sap')('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});
},{"./_object-keys":73,"./_object-sap":75,"./_to-object":91}],104:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":41,"./_set-proto":79}],105:[function(require,module,exports){

},{}],106:[function(require,module,exports){
'use strict';
var LIBRARY            = require('./_library')
  , global             = require('./_global')
  , ctx                = require('./_ctx')
  , classof            = require('./_classof')
  , $export            = require('./_export')
  , isObject           = require('./_is-object')
  , aFunction          = require('./_a-function')
  , anInstance         = require('./_an-instance')
  , forOf              = require('./_for-of')
  , speciesConstructor = require('./_species-constructor')
  , task               = require('./_task').set
  , microtask          = require('./_microtask')()
  , PROMISE            = 'Promise'
  , TypeError          = global.TypeError
  , process            = global.process
  , $Promise           = global[PROMISE]
  , process            = global.process
  , isNode             = classof(process) == 'process'
  , empty              = function(){ /* empty */ }
  , Internal, GenericPromiseCapability, Wrapper;

var USE_NATIVE = !!function(){
  try {
    // correct subclassing with @@species support
    var promise     = $Promise.resolve(1)
      , FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function(exec){ exec(empty, empty); };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
  } catch(e){ /* empty */ }
}();

// helpers
var sameConstructor = function(a, b){
  // with library wrapper special case
  return a === b || a === $Promise && b === Wrapper;
};
var isThenable = function(it){
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var newPromiseCapability = function(C){
  return sameConstructor($Promise, C)
    ? new PromiseCapability(C)
    : new GenericPromiseCapability(C);
};
var PromiseCapability = GenericPromiseCapability = function(C){
  var resolve, reject;
  this.promise = new C(function($$resolve, $$reject){
    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject  = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject  = aFunction(reject);
};
var perform = function(exec){
  try {
    exec();
  } catch(e){
    return {error: e};
  }
};
var notify = function(promise, isReject){
  if(promise._n)return;
  promise._n = true;
  var chain = promise._c;
  microtask(function(){
    var value = promise._v
      , ok    = promise._s == 1
      , i     = 0;
    var run = function(reaction){
      var handler = ok ? reaction.ok : reaction.fail
        , resolve = reaction.resolve
        , reject  = reaction.reject
        , domain  = reaction.domain
        , result, then;
      try {
        if(handler){
          if(!ok){
            if(promise._h == 2)onHandleUnhandled(promise);
            promise._h = 1;
          }
          if(handler === true)result = value;
          else {
            if(domain)domain.enter();
            result = handler(value);
            if(domain)domain.exit();
          }
          if(result === reaction.promise){
            reject(TypeError('Promise-chain cycle'));
          } else if(then = isThenable(result)){
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch(e){
        reject(e);
      }
    };
    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if(isReject && !promise._h)onUnhandled(promise);
  });
};
var onUnhandled = function(promise){
  task.call(global, function(){
    var value = promise._v
      , abrupt, handler, console;
    if(isUnhandled(promise)){
      abrupt = perform(function(){
        if(isNode){
          process.emit('unhandledRejection', value, promise);
        } else if(handler = global.onunhandledrejection){
          handler({promise: promise, reason: value});
        } else if((console = global.console) && console.error){
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if(abrupt)throw abrupt.error;
  });
};
var isUnhandled = function(promise){
  if(promise._h == 1)return false;
  var chain = promise._a || promise._c
    , i     = 0
    , reaction;
  while(chain.length > i){
    reaction = chain[i++];
    if(reaction.fail || !isUnhandled(reaction.promise))return false;
  } return true;
};
var onHandleUnhandled = function(promise){
  task.call(global, function(){
    var handler;
    if(isNode){
      process.emit('rejectionHandled', promise);
    } else if(handler = global.onrejectionhandled){
      handler({promise: promise, reason: promise._v});
    }
  });
};
var $reject = function(value){
  var promise = this;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if(!promise._a)promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function(value){
  var promise = this
    , then;
  if(promise._d)return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if(promise === value)throw TypeError("Promise can't be resolved itself");
    if(then = isThenable(value)){
      microtask(function(){
        var wrapper = {_w: promise, _d: false}; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch(e){
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch(e){
    $reject.call({_w: promise, _d: false}, e); // wrap
  }
};

// constructor polyfill
if(!USE_NATIVE){
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor){
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch(err){
      $reject.call(this, err);
    }
  };
  Internal = function Promise(executor){
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected){
      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail   = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if(this._a)this._a.push(reaction);
      if(this._s)notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
  PromiseCapability = function(){
    var promise  = new Internal;
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject  = ctx($reject, promise, 1);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r){
    var capability = newPromiseCapability(this)
      , $$reject   = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x){
    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
    var capability = newPromiseCapability(this)
      , $$resolve  = capability.resolve;
    $$resolve(x);
    return capability.promise;
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function(iter){
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , resolve    = capability.resolve
      , reject     = capability.reject;
    var abrupt = perform(function(){
      var values    = []
        , index     = 0
        , remaining = 1;
      forOf(iterable, false, function(promise){
        var $index        = index++
          , alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function(value){
          if(alreadyCalled)return;
          alreadyCalled  = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable){
    var C          = this
      , capability = newPromiseCapability(C)
      , reject     = capability.reject;
    var abrupt = perform(function(){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if(abrupt)reject(abrupt.error);
    return capability.promise;
  }
});
},{"./_a-function":27,"./_an-instance":29,"./_classof":32,"./_core":34,"./_ctx":35,"./_export":41,"./_for-of":43,"./_global":44,"./_is-object":53,"./_iter-detect":57,"./_library":61,"./_microtask":63,"./_redefine-all":77,"./_set-species":80,"./_set-to-string-tag":81,"./_species-constructor":84,"./_task":86,"./_wks":96}],107:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":56,"./_string-at":85}],108:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":30,"./_descriptors":37,"./_enum-keys":40,"./_export":41,"./_fails":42,"./_global":44,"./_has":45,"./_hide":46,"./_is-array":52,"./_keyof":60,"./_library":61,"./_meta":62,"./_object-create":64,"./_object-dp":65,"./_object-gopd":67,"./_object-gopn":69,"./_object-gopn-ext":68,"./_object-gops":70,"./_object-keys":73,"./_object-pie":74,"./_property-desc":76,"./_redefine":78,"./_set-to-string-tag":81,"./_shared":83,"./_to-iobject":89,"./_to-primitive":92,"./_uid":93,"./_wks":96,"./_wks-define":94,"./_wks-ext":95}],109:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":94}],110:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":94}],111:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":44,"./_hide":46,"./_iterators":59,"./_wks":96,"./es6.array.iterator":98}],112:[function(require,module,exports){
(function (global){
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

// Distribution file for PersistenceManager.js 
// version: 0.3.0
// Last build: Wed Aug 10 2016 15:25:40 GMT+0100 (WEST)

!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var t;t="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,t.PersistenceManager=e()}}(function(){return function e(t,n,r){function i(s,a){if(!n[s]){if(!t[s]){var u="function"==typeof require&&require;if(!a&&u)return u(s,!0);if(o)return o(s,!0);var f=new Error("Cannot find module '"+s+"'");throw f.code="MODULE_NOT_FOUND",f}var c=n[s]={exports:{}};t[s][0].call(c.exports,function(e){var n=t[s][1][e];return i(n?n:e)},c,c.exports,e,t,n,r)}return n[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,t,n){t.exports={"default":e("core-js/library/fn/json/stringify"),__esModule:!0}},{"core-js/library/fn/json/stringify":9}],2:[function(e,t,n){"use strict";function r(){for(var e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",t=0,n=e.length;t<n;++t)u[t]=e[t],f[e.charCodeAt(t)]=t;f["-".charCodeAt(0)]=62,f["_".charCodeAt(0)]=63}function i(e){var t,n,r,i,o,s,a=e.length;if(a%4>0)throw new Error("Invalid string. Length must be a multiple of 4");o="="===e[a-2]?2:"="===e[a-1]?1:0,s=new c(3*a/4-o),r=o>0?a-4:a;var u=0;for(t=0,n=0;t<r;t+=4,n+=3)i=f[e.charCodeAt(t)]<<18|f[e.charCodeAt(t+1)]<<12|f[e.charCodeAt(t+2)]<<6|f[e.charCodeAt(t+3)],s[u++]=i>>16&255,s[u++]=i>>8&255,s[u++]=255&i;return 2===o?(i=f[e.charCodeAt(t)]<<2|f[e.charCodeAt(t+1)]>>4,s[u++]=255&i):1===o&&(i=f[e.charCodeAt(t)]<<10|f[e.charCodeAt(t+1)]<<4|f[e.charCodeAt(t+2)]>>2,s[u++]=i>>8&255,s[u++]=255&i),s}function o(e){return u[e>>18&63]+u[e>>12&63]+u[e>>6&63]+u[63&e]}function s(e,t,n){for(var r,i=[],s=t;s<n;s+=3)r=(e[s]<<16)+(e[s+1]<<8)+e[s+2],i.push(o(r));return i.join("")}function a(e){for(var t,n=e.length,r=n%3,i="",o=[],a=16383,f=0,c=n-r;f<c;f+=a)o.push(s(e,f,f+a>c?c:f+a));return 1===r?(t=e[n-1],i+=u[t>>2],i+=u[t<<4&63],i+="=="):2===r&&(t=(e[n-2]<<8)+e[n-1],i+=u[t>>10],i+=u[t>>4&63],i+=u[t<<2&63],i+="="),o.push(i),o.join("")}n.toByteArray=i,n.fromByteArray=a;var u=[],f=[],c="undefined"!=typeof Uint8Array?Uint8Array:Array;r()},{}],3:[function(e,t,n){},{}],4:[function(e,t,n){arguments[4][3][0].apply(n,arguments)},{dup:3}],5:[function(e,t,n){function r(e,t){return p.isUndefined(t)?""+t:p.isNumber(t)&&!isFinite(t)?t.toString():p.isFunction(t)||p.isRegExp(t)?t.toString():t}function i(e,t){return p.isString(e)?e.length<t?e:e.slice(0,t):e}function o(e){return i(JSON.stringify(e.actual,r),128)+" "+e.operator+" "+i(JSON.stringify(e.expected,r),128)}function s(e,t,n,r,i){throw new y.AssertionError({message:n,actual:e,expected:t,operator:r,stackStartFunction:i})}function a(e,t){e||s(e,!0,t,"==",y.ok)}function u(e,t){if(e===t)return!0;if(p.isBuffer(e)&&p.isBuffer(t)){if(e.length!=t.length)return!1;for(var n=0;n<e.length;n++)if(e[n]!==t[n])return!1;return!0}return p.isDate(e)&&p.isDate(t)?e.getTime()===t.getTime():p.isRegExp(e)&&p.isRegExp(t)?e.source===t.source&&e.global===t.global&&e.multiline===t.multiline&&e.lastIndex===t.lastIndex&&e.ignoreCase===t.ignoreCase:p.isObject(e)||p.isObject(t)?c(e,t):e==t}function f(e){return"[object Arguments]"==Object.prototype.toString.call(e)}function c(e,t){if(p.isNullOrUndefined(e)||p.isNullOrUndefined(t))return!1;if(e.prototype!==t.prototype)return!1;if(p.isPrimitive(e)||p.isPrimitive(t))return e===t;var n=f(e),r=f(t);if(n&&!r||!n&&r)return!1;if(n)return e=d.call(e),t=d.call(t),u(e,t);var i,o,s=_(e),a=_(t);if(s.length!=a.length)return!1;for(s.sort(),a.sort(),o=s.length-1;o>=0;o--)if(s[o]!=a[o])return!1;for(o=s.length-1;o>=0;o--)if(i=s[o],!u(e[i],t[i]))return!1;return!0}function l(e,t){return!(!e||!t)&&("[object RegExp]"==Object.prototype.toString.call(t)?t.test(e):e instanceof t||t.call({},e)===!0)}function h(e,t,n,r){var i;p.isString(n)&&(r=n,n=null);try{t()}catch(o){i=o}if(r=(n&&n.name?" ("+n.name+").":".")+(r?" "+r:"."),e&&!i&&s(i,n,"Missing expected exception"+r),!e&&l(i,n)&&s(i,n,"Got unwanted exception"+r),e&&i&&n&&!l(i,n)||!e&&i)throw i}var p=e("util/"),d=Array.prototype.slice,g=Object.prototype.hasOwnProperty,y=t.exports=a;y.AssertionError=function(e){this.name="AssertionError",this.actual=e.actual,this.expected=e.expected,this.operator=e.operator,e.message?(this.message=e.message,this.generatedMessage=!1):(this.message=o(this),this.generatedMessage=!0);var t=e.stackStartFunction||s;if(Error.captureStackTrace)Error.captureStackTrace(this,t);else{var n=new Error;if(n.stack){var r=n.stack,i=t.name,a=r.indexOf("\n"+i);if(a>=0){var u=r.indexOf("\n",a+1);r=r.substring(u+1)}this.stack=r}}},p.inherits(y.AssertionError,Error),y.fail=s,y.ok=a,y.equal=function(e,t,n){e!=t&&s(e,t,n,"==",y.equal)},y.notEqual=function(e,t,n){e==t&&s(e,t,n,"!=",y.notEqual)},y.deepEqual=function(e,t,n){u(e,t)||s(e,t,n,"deepEqual",y.deepEqual)},y.notDeepEqual=function(e,t,n){u(e,t)&&s(e,t,n,"notDeepEqual",y.notDeepEqual)},y.strictEqual=function(e,t,n){e!==t&&s(e,t,n,"===",y.strictEqual)},y.notStrictEqual=function(e,t,n){e===t&&s(e,t,n,"!==",y.notStrictEqual)},y["throws"]=function(e,t,n){h.apply(this,[!0].concat(d.call(arguments)))},y.doesNotThrow=function(e,t){h.apply(this,[!1].concat(d.call(arguments)))},y.ifError=function(e){if(e)throw e};var _=Object.keys||function(e){var t=[];for(var n in e)g.call(e,n)&&t.push(n);return t}},{"util/":44}],6:[function(e,t,n){(function(t){"use strict";var r=e("buffer"),i=r.Buffer,o=r.SlowBuffer,s=r.kMaxLength||2147483647;n.alloc=function(e,t,n){if("function"==typeof i.alloc)return i.alloc(e,t,n);if("number"==typeof n)throw new TypeError("encoding must not be number");if("number"!=typeof e)throw new TypeError("size must be a number");if(e>s)throw new RangeError("size is too large");var r=n,o=t;void 0===o&&(r=void 0,o=0);var a=new i(e);if("string"==typeof o)for(var u=new i(o,r),f=u.length,c=-1;++c<e;)a[c]=u[c%f];else a.fill(o);return a},n.allocUnsafe=function(e){if("function"==typeof i.allocUnsafe)return i.allocUnsafe(e);if("number"!=typeof e)throw new TypeError("size must be a number");if(e>s)throw new RangeError("size is too large");return new i(e)},n.from=function(e,n,r){if("function"==typeof i.from&&(!t.Uint8Array||Uint8Array.from!==i.from))return i.from(e,n,r);if("number"==typeof e)throw new TypeError('"value" argument must not be a number');if("string"==typeof e)return new i(e,n);if("undefined"!=typeof ArrayBuffer&&e instanceof ArrayBuffer){var o=n;if(1===arguments.length)return new i(e);"undefined"==typeof o&&(o=0);var s=r;if("undefined"==typeof s&&(s=e.byteLength-o),o>=e.byteLength)throw new RangeError("'offset' is out of bounds");if(s>e.byteLength-o)throw new RangeError("'length' is out of bounds");return new i(e.slice(o,o+s))}if(i.isBuffer(e)){var a=new i(e.length);return e.copy(a,0,0,e.length),a}if(e){if(Array.isArray(e)||"undefined"!=typeof ArrayBuffer&&e.buffer instanceof ArrayBuffer||"length"in e)return new i(e);if("Buffer"===e.type&&Array.isArray(e.data))return new i(e.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")},n.allocUnsafeSlow=function(e){if("function"==typeof i.allocUnsafeSlow)return i.allocUnsafeSlow(e);if("number"!=typeof e)throw new TypeError("size must be a number");if(e>=s)throw new RangeError("size is too large");return new o(e)}}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{buffer:7}],7:[function(e,t,n){(function(t){"use strict";function r(){try{var e=new Uint8Array(1);return e.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}},42===e.foo()&&"function"==typeof e.subarray&&0===e.subarray(1,1).byteLength}catch(t){return!1}}function i(){return s.TYPED_ARRAY_SUPPORT?2147483647:1073741823}function o(e,t){if(i()<t)throw new RangeError("Invalid typed array length");return s.TYPED_ARRAY_SUPPORT?(e=new Uint8Array(t),e.__proto__=s.prototype):(null===e&&(e=new s(t)),e.length=t),e}function s(e,t,n){if(!(s.TYPED_ARRAY_SUPPORT||this instanceof s))return new s(e,t,n);if("number"==typeof e){if("string"==typeof t)throw new Error("If encoding is specified then the first argument must be a string");return c(this,e)}return a(this,e,t,n)}function a(e,t,n,r){if("number"==typeof t)throw new TypeError('"value" argument must not be a number');return"undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer?p(e,t,n,r):"string"==typeof t?l(e,t,n):d(e,t)}function u(e){if("number"!=typeof e)throw new TypeError('"size" argument must be a number')}function f(e,t,n,r){return u(t),t<=0?o(e,t):void 0!==n?"string"==typeof r?o(e,t).fill(n,r):o(e,t).fill(n):o(e,t)}function c(e,t){if(u(t),e=o(e,t<0?0:0|g(t)),!s.TYPED_ARRAY_SUPPORT)for(var n=0;n<t;++n)e[n]=0;return e}function l(e,t,n){if("string"==typeof n&&""!==n||(n="utf8"),!s.isEncoding(n))throw new TypeError('"encoding" must be a valid string encoding');var r=0|_(t,n);return e=o(e,r),e.write(t,n),e}function h(e,t){var n=0|g(t.length);e=o(e,n);for(var r=0;r<n;r+=1)e[r]=255&t[r];return e}function p(e,t,n,r){if(t.byteLength,n<0||t.byteLength<n)throw new RangeError("'offset' is out of bounds");if(t.byteLength<n+(r||0))throw new RangeError("'length' is out of bounds");return t=void 0===n&&void 0===r?new Uint8Array(t):void 0===r?new Uint8Array(t,n):new Uint8Array(t,n,r),s.TYPED_ARRAY_SUPPORT?(e=t,e.__proto__=s.prototype):e=h(e,t),e}function d(e,t){if(s.isBuffer(t)){var n=0|g(t.length);return e=o(e,n),0===e.length?e:(t.copy(e,0,0,n),e)}if(t){if("undefined"!=typeof ArrayBuffer&&t.buffer instanceof ArrayBuffer||"length"in t)return"number"!=typeof t.length||X(t.length)?o(e,0):h(e,t);if("Buffer"===t.type&&$(t.data))return h(e,t.data)}throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.")}function g(e){if(e>=i())throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+i().toString(16)+" bytes");return 0|e}function y(e){return+e!=e&&(e=0),s.alloc(+e)}function _(e,t){if(s.isBuffer(e))return e.length;if("undefined"!=typeof ArrayBuffer&&"function"==typeof ArrayBuffer.isView&&(ArrayBuffer.isView(e)||e instanceof ArrayBuffer))return e.byteLength;"string"!=typeof e&&(e=""+e);var n=e.length;if(0===n)return 0;for(var r=!1;;)switch(t){case"ascii":case"binary":case"raw":case"raws":return n;case"utf8":case"utf-8":case void 0:return q(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return W(e).length;default:if(r)return q(e).length;t=(""+t).toLowerCase(),r=!0}}function v(e,t,n){var r=!1;if((void 0===t||t<0)&&(t=0),t>this.length)return"";if((void 0===n||n>this.length)&&(n=this.length),n<=0)return"";if(n>>>=0,t>>>=0,n<=t)return"";for(e||(e="utf8");;)switch(e){case"hex":return C(this,t,n);case"utf8":case"utf-8":return I(this,t,n);case"ascii":return N(this,t,n);case"binary":return P(this,t,n);case"base64":return T(this,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return M(this,t,n);default:if(r)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),r=!0}}function m(e,t,n){var r=e[t];e[t]=e[n],e[n]=r}function E(e,t,n,r){function i(e,t){return 1===o?e[t]:e.readUInt16BE(t*o)}var o=1,s=e.length,a=t.length;if(void 0!==r&&(r=String(r).toLowerCase(),"ucs2"===r||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(e.length<2||t.length<2)return-1;o=2,s/=2,a/=2,n/=2}for(var u=-1,f=n;f<s;++f)if(i(e,f)===i(t,u===-1?0:f-u)){if(u===-1&&(u=f),f-u+1===a)return u*o}else u!==-1&&(f-=f-u),u=-1;return-1}function w(e,t,n,r){n=Number(n)||0;var i=e.length-n;r?(r=Number(r),r>i&&(r=i)):r=i;var o=t.length;if(o%2!==0)throw new Error("Invalid hex string");r>o/2&&(r=o/2);for(var s=0;s<r;++s){var a=parseInt(t.substr(2*s,2),16);if(isNaN(a))return s;e[n+s]=a}return s}function b(e,t,n,r){return V(q(t,e.length-n),e,n,r)}function S(e,t,n,r){return V(K(t),e,n,r)}function O(e,t,n,r){return S(e,t,n,r)}function R(e,t,n,r){return V(W(t),e,n,r)}function A(e,t,n,r){return V(z(t,e.length-n),e,n,r)}function T(e,t,n){return 0===t&&n===e.length?J.fromByteArray(e):J.fromByteArray(e.slice(t,n))}function I(e,t,n){n=Math.min(e.length,n);for(var r=[],i=t;i<n;){var o=e[i],s=null,a=o>239?4:o>223?3:o>191?2:1;if(i+a<=n){var u,f,c,l;switch(a){case 1:o<128&&(s=o);break;case 2:u=e[i+1],128===(192&u)&&(l=(31&o)<<6|63&u,l>127&&(s=l));break;case 3:u=e[i+1],f=e[i+2],128===(192&u)&&128===(192&f)&&(l=(15&o)<<12|(63&u)<<6|63&f,l>2047&&(l<55296||l>57343)&&(s=l));break;case 4:u=e[i+1],f=e[i+2],c=e[i+3],128===(192&u)&&128===(192&f)&&128===(192&c)&&(l=(15&o)<<18|(63&u)<<12|(63&f)<<6|63&c,l>65535&&l<1114112&&(s=l))}}null===s?(s=65533,a=1):s>65535&&(s-=65536,r.push(s>>>10&1023|55296),s=56320|1023&s),r.push(s),i+=a}return L(r)}function L(e){var t=e.length;if(t<=Z)return String.fromCharCode.apply(String,e);for(var n="",r=0;r<t;)n+=String.fromCharCode.apply(String,e.slice(r,r+=Z));return n}function N(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(127&e[i]);return r}function P(e,t,n){var r="";n=Math.min(e.length,n);for(var i=t;i<n;++i)r+=String.fromCharCode(e[i]);return r}function C(e,t,n){var r=e.length;(!t||t<0)&&(t=0),(!n||n<0||n>r)&&(n=r);for(var i="",o=t;o<n;++o)i+=H(e[o]);return i}function M(e,t,n){for(var r=e.slice(t,n),i="",o=0;o<r.length;o+=2)i+=String.fromCharCode(r[o]+256*r[o+1]);return i}function x(e,t,n){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+t>n)throw new RangeError("Trying to access beyond buffer length")}function D(e,t,n,r,i,o){if(!s.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(t>i||t<o)throw new RangeError('"value" argument is out of bounds');if(n+r>e.length)throw new RangeError("Index out of range")}function j(e,t,n,r){t<0&&(t=65535+t+1);for(var i=0,o=Math.min(e.length-n,2);i<o;++i)e[n+i]=(t&255<<8*(r?i:1-i))>>>8*(r?i:1-i)}function U(e,t,n,r){t<0&&(t=4294967295+t+1);for(var i=0,o=Math.min(e.length-n,4);i<o;++i)e[n+i]=t>>>8*(r?i:3-i)&255}function k(e,t,n,r,i,o){if(n+r>e.length)throw new RangeError("Index out of range");if(n<0)throw new RangeError("Index out of range")}function B(e,t,n,r,i){return i||k(e,t,n,4,3.4028234663852886e38,-3.4028234663852886e38),Q.write(e,t,n,r,23,4),n+4}function G(e,t,n,r,i){return i||k(e,t,n,8,1.7976931348623157e308,-1.7976931348623157e308),Q.write(e,t,n,r,52,8),n+8}function F(e){if(e=Y(e).replace(ee,""),e.length<2)return"";for(;e.length%4!==0;)e+="=";return e}function Y(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")}function H(e){return e<16?"0"+e.toString(16):e.toString(16)}function q(e,t){t=t||1/0;for(var n,r=e.length,i=null,o=[],s=0;s<r;++s){if(n=e.charCodeAt(s),n>55295&&n<57344){if(!i){if(n>56319){(t-=3)>-1&&o.push(239,191,189);continue}if(s+1===r){(t-=3)>-1&&o.push(239,191,189);continue}i=n;continue}if(n<56320){(t-=3)>-1&&o.push(239,191,189),i=n;continue}n=(i-55296<<10|n-56320)+65536}else i&&(t-=3)>-1&&o.push(239,191,189);if(i=null,n<128){if((t-=1)<0)break;o.push(n)}else if(n<2048){if((t-=2)<0)break;o.push(n>>6|192,63&n|128)}else if(n<65536){if((t-=3)<0)break;o.push(n>>12|224,n>>6&63|128,63&n|128)}else{if(!(n<1114112))throw new Error("Invalid code point");if((t-=4)<0)break;o.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}}return o}function K(e){for(var t=[],n=0;n<e.length;++n)t.push(255&e.charCodeAt(n));return t}function z(e,t){for(var n,r,i,o=[],s=0;s<e.length&&!((t-=2)<0);++s)n=e.charCodeAt(s),r=n>>8,i=n%256,o.push(i),o.push(r);return o}function W(e){return J.toByteArray(F(e))}function V(e,t,n,r){for(var i=0;i<r&&!(i+n>=t.length||i>=e.length);++i)t[i+n]=e[i];return i}function X(e){return e!==e}var J=e("base64-js"),Q=e("ieee754"),$=e("isarray");n.Buffer=s,n.SlowBuffer=y,n.INSPECT_MAX_BYTES=50,s.TYPED_ARRAY_SUPPORT=void 0!==t.TYPED_ARRAY_SUPPORT?t.TYPED_ARRAY_SUPPORT:r(),n.kMaxLength=i(),s.poolSize=8192,s._augment=function(e){return e.__proto__=s.prototype,e},s.from=function(e,t,n){return a(null,e,t,n)},s.TYPED_ARRAY_SUPPORT&&(s.prototype.__proto__=Uint8Array.prototype,s.__proto__=Uint8Array,"undefined"!=typeof Symbol&&Symbol.species&&s[Symbol.species]===s&&Object.defineProperty(s,Symbol.species,{value:null,configurable:!0})),s.alloc=function(e,t,n){return f(null,e,t,n)},s.allocUnsafe=function(e){return c(null,e)},s.allocUnsafeSlow=function(e){return c(null,e)},s.isBuffer=function(e){return!(null==e||!e._isBuffer)},s.compare=function(e,t){if(!s.isBuffer(e)||!s.isBuffer(t))throw new TypeError("Arguments must be Buffers");if(e===t)return 0;for(var n=e.length,r=t.length,i=0,o=Math.min(n,r);i<o;++i)if(e[i]!==t[i]){n=e[i],r=t[i];break}return n<r?-1:r<n?1:0},s.isEncoding=function(e){switch(String(e).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"raw":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(e,t){if(!$(e))throw new TypeError('"list" argument must be an Array of Buffers');if(0===e.length)return s.alloc(0);var n;if(void 0===t)for(t=0,n=0;n<e.length;++n)t+=e[n].length;var r=s.allocUnsafe(t),i=0;for(n=0;n<e.length;++n){var o=e[n];if(!s.isBuffer(o))throw new TypeError('"list" argument must be an Array of Buffers');o.copy(r,i),i+=o.length}return r},s.byteLength=_,s.prototype._isBuffer=!0,s.prototype.swap16=function(){var e=this.length;if(e%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(var t=0;t<e;t+=2)m(this,t,t+1);return this},s.prototype.swap32=function(){var e=this.length;if(e%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(var t=0;t<e;t+=4)m(this,t,t+3),m(this,t+1,t+2);return this},s.prototype.toString=function(){var e=0|this.length;return 0===e?"":0===arguments.length?I(this,0,e):v.apply(this,arguments)},s.prototype.equals=function(e){if(!s.isBuffer(e))throw new TypeError("Argument must be a Buffer");return this===e||0===s.compare(this,e)},s.prototype.inspect=function(){var e="",t=n.INSPECT_MAX_BYTES;return this.length>0&&(e=this.toString("hex",0,t).match(/.{2}/g).join(" "),this.length>t&&(e+=" ... ")),"<Buffer "+e+">"},s.prototype.compare=function(e,t,n,r,i){if(!s.isBuffer(e))throw new TypeError("Argument must be a Buffer");if(void 0===t&&(t=0),void 0===n&&(n=e?e.length:0),void 0===r&&(r=0),void 0===i&&(i=this.length),t<0||n>e.length||r<0||i>this.length)throw new RangeError("out of range index");if(r>=i&&t>=n)return 0;if(r>=i)return-1;if(t>=n)return 1;if(t>>>=0,n>>>=0,r>>>=0,i>>>=0,this===e)return 0;for(var o=i-r,a=n-t,u=Math.min(o,a),f=this.slice(r,i),c=e.slice(t,n),l=0;l<u;++l)if(f[l]!==c[l]){o=f[l],a=c[l];break}return o<a?-1:a<o?1:0},s.prototype.indexOf=function(e,t,n){if("string"==typeof t?(n=t,t=0):t>2147483647?t=2147483647:t<-2147483648&&(t=-2147483648),t>>=0,0===this.length)return-1;if(t>=this.length)return-1;if(t<0&&(t=Math.max(this.length+t,0)),"string"==typeof e&&(e=s.from(e,n)),s.isBuffer(e))return 0===e.length?-1:E(this,e,t,n);if("number"==typeof e)return s.TYPED_ARRAY_SUPPORT&&"function"===Uint8Array.prototype.indexOf?Uint8Array.prototype.indexOf.call(this,e,t):E(this,[e],t,n);throw new TypeError("val must be string, number or Buffer")},s.prototype.includes=function(e,t,n){return this.indexOf(e,t,n)!==-1},s.prototype.write=function(e,t,n,r){if(void 0===t)r="utf8",n=this.length,t=0;else if(void 0===n&&"string"==typeof t)r=t,n=this.length,t=0;else{if(!isFinite(t))throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");t=0|t,isFinite(n)?(n=0|n,void 0===r&&(r="utf8")):(r=n,n=void 0)}var i=this.length-t;if((void 0===n||n>i)&&(n=i),e.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");r||(r="utf8");for(var o=!1;;)switch(r){case"hex":return w(this,e,t,n);case"utf8":case"utf-8":return b(this,e,t,n);case"ascii":return S(this,e,t,n);case"binary":return O(this,e,t,n);case"base64":return R(this,e,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return A(this,e,t,n);default:if(o)throw new TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),o=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};var Z=4096;s.prototype.slice=function(e,t){var n=this.length;e=~~e,t=void 0===t?n:~~t,e<0?(e+=n,e<0&&(e=0)):e>n&&(e=n),t<0?(t+=n,t<0&&(t=0)):t>n&&(t=n),t<e&&(t=e);var r;if(s.TYPED_ARRAY_SUPPORT)r=this.subarray(e,t),r.__proto__=s.prototype;else{var i=t-e;r=new s(i,(void 0));for(var o=0;o<i;++o)r[o]=this[o+e]}return r},s.prototype.readUIntLE=function(e,t,n){e=0|e,t=0|t,n||x(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return r},s.prototype.readUIntBE=function(e,t,n){e=0|e,t=0|t,n||x(e,t,this.length);for(var r=this[e+--t],i=1;t>0&&(i*=256);)r+=this[e+--t]*i;return r},s.prototype.readUInt8=function(e,t){return t||x(e,1,this.length),this[e]},s.prototype.readUInt16LE=function(e,t){return t||x(e,2,this.length),this[e]|this[e+1]<<8},s.prototype.readUInt16BE=function(e,t){return t||x(e,2,this.length),this[e]<<8|this[e+1]},s.prototype.readUInt32LE=function(e,t){return t||x(e,4,this.length),(this[e]|this[e+1]<<8|this[e+2]<<16)+16777216*this[e+3]},s.prototype.readUInt32BE=function(e,t){return t||x(e,4,this.length),16777216*this[e]+(this[e+1]<<16|this[e+2]<<8|this[e+3])},s.prototype.readIntLE=function(e,t,n){e=0|e,t=0|t,n||x(e,t,this.length);for(var r=this[e],i=1,o=0;++o<t&&(i*=256);)r+=this[e+o]*i;return i*=128,r>=i&&(r-=Math.pow(2,8*t)),r},s.prototype.readIntBE=function(e,t,n){e=0|e,t=0|t,n||x(e,t,this.length);for(var r=t,i=1,o=this[e+--r];r>0&&(i*=256);)o+=this[e+--r]*i;return i*=128,o>=i&&(o-=Math.pow(2,8*t)),o},s.prototype.readInt8=function(e,t){return t||x(e,1,this.length),128&this[e]?(255-this[e]+1)*-1:this[e]},s.prototype.readInt16LE=function(e,t){t||x(e,2,this.length);var n=this[e]|this[e+1]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt16BE=function(e,t){t||x(e,2,this.length);var n=this[e+1]|this[e]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt32LE=function(e,t){return t||x(e,4,this.length),this[e]|this[e+1]<<8|this[e+2]<<16|this[e+3]<<24},s.prototype.readInt32BE=function(e,t){return t||x(e,4,this.length),this[e]<<24|this[e+1]<<16|this[e+2]<<8|this[e+3]},s.prototype.readFloatLE=function(e,t){return t||x(e,4,this.length),Q.read(this,e,!0,23,4)},s.prototype.readFloatBE=function(e,t){return t||x(e,4,this.length),Q.read(this,e,!1,23,4)},s.prototype.readDoubleLE=function(e,t){return t||x(e,8,this.length),Q.read(this,e,!0,52,8)},s.prototype.readDoubleBE=function(e,t){return t||x(e,8,this.length),Q.read(this,e,!1,52,8)},s.prototype.writeUIntLE=function(e,t,n,r){if(e=+e,t=0|t,n=0|n,!r){var i=Math.pow(2,8*n)-1;D(this,e,t,n,i,0)}var o=1,s=0;for(this[t]=255&e;++s<n&&(o*=256);)this[t+s]=e/o&255;return t+n},s.prototype.writeUIntBE=function(e,t,n,r){if(e=+e,t=0|t,n=0|n,!r){var i=Math.pow(2,8*n)-1;D(this,e,t,n,i,0)}var o=n-1,s=1;for(this[t+o]=255&e;--o>=0&&(s*=256);)this[t+o]=e/s&255;return t+n},s.prototype.writeUInt8=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,1,255,0),s.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),this[t]=255&e,t+1},s.prototype.writeUInt16LE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):j(this,e,t,!0),t+2},s.prototype.writeUInt16BE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,2,65535,0),s.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):j(this,e,t,!1),t+2},s.prototype.writeUInt32LE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[t+3]=e>>>24,this[t+2]=e>>>16,this[t+1]=e>>>8,this[t]=255&e):U(this,e,t,!0),t+4},s.prototype.writeUInt32BE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,4,4294967295,0),s.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):U(this,e,t,!1),t+4},s.prototype.writeIntLE=function(e,t,n,r){if(e=+e,t=0|t,!r){var i=Math.pow(2,8*n-1);D(this,e,t,n,i-1,-i)}var o=0,s=1,a=0;for(this[t]=255&e;++o<n&&(s*=256);)e<0&&0===a&&0!==this[t+o-1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},s.prototype.writeIntBE=function(e,t,n,r){if(e=+e,t=0|t,!r){var i=Math.pow(2,8*n-1);D(this,e,t,n,i-1,-i)}var o=n-1,s=1,a=0;for(this[t+o]=255&e;--o>=0&&(s*=256);)e<0&&0===a&&0!==this[t+o+1]&&(a=1),this[t+o]=(e/s>>0)-a&255;return t+n},s.prototype.writeInt8=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,1,127,-128),s.TYPED_ARRAY_SUPPORT||(e=Math.floor(e)),e<0&&(e=255+e+1),this[t]=255&e,t+1},s.prototype.writeInt16LE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8):j(this,e,t,!0),t+2},s.prototype.writeInt16BE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,2,32767,-32768),s.TYPED_ARRAY_SUPPORT?(this[t]=e>>>8,this[t+1]=255&e):j(this,e,t,!1),t+2},s.prototype.writeInt32LE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,4,2147483647,-2147483648),s.TYPED_ARRAY_SUPPORT?(this[t]=255&e,this[t+1]=e>>>8,this[t+2]=e>>>16,this[t+3]=e>>>24):U(this,e,t,!0),t+4},s.prototype.writeInt32BE=function(e,t,n){return e=+e,t=0|t,n||D(this,e,t,4,2147483647,-2147483648),e<0&&(e=4294967295+e+1),s.TYPED_ARRAY_SUPPORT?(this[t]=e>>>24,this[t+1]=e>>>16,this[t+2]=e>>>8,this[t+3]=255&e):U(this,e,t,!1),t+4},s.prototype.writeFloatLE=function(e,t,n){return B(this,e,t,!0,n)},s.prototype.writeFloatBE=function(e,t,n){return B(this,e,t,!1,n)},s.prototype.writeDoubleLE=function(e,t,n){return G(this,e,t,!0,n)},s.prototype.writeDoubleBE=function(e,t,n){return G(this,e,t,!1,n)},s.prototype.copy=function(e,t,n,r){if(n||(n=0),r||0===r||(r=this.length),t>=e.length&&(t=e.length),t||(t=0),r>0&&r<n&&(r=n),r===n)return 0;if(0===e.length||0===this.length)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("sourceStart out of bounds");if(r<0)throw new RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),e.length-t<r-n&&(r=e.length-t+n);var i,o=r-n;if(this===e&&n<t&&t<r)for(i=o-1;i>=0;--i)e[i+t]=this[i+n];else if(o<1e3||!s.TYPED_ARRAY_SUPPORT)for(i=0;i<o;++i)e[i+t]=this[i+n];else Uint8Array.prototype.set.call(e,this.subarray(n,n+o),t);return o},s.prototype.fill=function(e,t,n,r){if("string"==typeof e){if("string"==typeof t?(r=t,t=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),1===e.length){var i=e.charCodeAt(0);i<256&&(e=i)}if(void 0!==r&&"string"!=typeof r)throw new TypeError("encoding must be a string");if("string"==typeof r&&!s.isEncoding(r))throw new TypeError("Unknown encoding: "+r)}else"number"==typeof e&&(e=255&e);if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;t>>>=0,n=void 0===n?this.length:n>>>0,e||(e=0);var o;if("number"==typeof e)for(o=t;o<n;++o)this[o]=e;else{var a=s.isBuffer(e)?e:q(new s(e,r).toString()),u=a.length;for(o=0;o<n-t;++o)this[o+t]=a[o%u]}return this};var ee=/[^+\/0-9A-Za-z-_]/g}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"base64-js":2,ieee754:17,isarray:21}],8:[function(e,t,n){t.exports={O_RDONLY:0,O_WRONLY:1,O_RDWR:2,S_IFMT:61440,S_IFREG:32768,S_IFDIR:16384,S_IFCHR:8192,S_IFBLK:24576,S_IFIFO:4096,S_IFLNK:40960,S_IFSOCK:49152,O_CREAT:512,O_EXCL:2048,O_NOCTTY:131072,O_TRUNC:1024,O_APPEND:8,O_DIRECTORY:1048576,O_NOFOLLOW:256,O_SYNC:128,O_SYMLINK:2097152,O_NONBLOCK:4,S_IRWXU:448,S_IRUSR:256,S_IWUSR:128,S_IXUSR:64,S_IRWXG:56,S_IRGRP:32,S_IWGRP:16,S_IXGRP:8,S_IRWXO:7,S_IROTH:4,S_IWOTH:2,S_IXOTH:1,E2BIG:7,EACCES:13,EADDRINUSE:48,EADDRNOTAVAIL:49,EAFNOSUPPORT:47,EAGAIN:35,EALREADY:37,EBADF:9,EBADMSG:94,EBUSY:16,ECANCELED:89,ECHILD:10,ECONNABORTED:53,ECONNREFUSED:61,ECONNRESET:54,EDEADLK:11,EDESTADDRREQ:39,EDOM:33,EDQUOT:69,EEXIST:17,EFAULT:14,EFBIG:27,EHOSTUNREACH:65,EIDRM:90,EILSEQ:92,EINPROGRESS:36,EINTR:4,EINVAL:22,EIO:5,EISCONN:56,EISDIR:21,ELOOP:62,EMFILE:24,EMLINK:31,EMSGSIZE:40,EMULTIHOP:95,ENAMETOOLONG:63,ENETDOWN:50,ENETRESET:52,ENETUNREACH:51,ENFILE:23,ENOBUFS:55,ENODATA:96,ENODEV:19,ENOENT:2,ENOEXEC:8,ENOLCK:77,ENOLINK:97,ENOMEM:12,ENOMSG:91,ENOPROTOOPT:42,ENOSPC:28,ENOSR:98,ENOSTR:99,ENOSYS:78,ENOTCONN:57,ENOTDIR:20,ENOTEMPTY:66,ENOTSOCK:38,ENOTSUP:45,ENOTTY:25,ENXIO:6,EOPNOTSUPP:102,EOVERFLOW:84,EPERM:1,EPIPE:32,EPROTO:100,EPROTONOSUPPORT:43,EPROTOTYPE:41,ERANGE:34,EROFS:30,ESPIPE:29,ESRCH:3,ESTALE:70,ETIME:101,ETIMEDOUT:60,ETXTBSY:26,EWOULDBLOCK:35,EXDEV:18,SIGHUP:1,SIGINT:2,SIGQUIT:3,SIGILL:4,SIGTRAP:5,SIGABRT:6,SIGIOT:6,SIGBUS:10,SIGFPE:8,SIGKILL:9,SIGUSR1:30,SIGSEGV:11,SIGUSR2:31,SIGPIPE:13,SIGALRM:14,SIGTERM:15,SIGCHLD:20,SIGCONT:19,SIGSTOP:17,SIGTSTP:18,SIGTTIN:21,SIGTTOU:22,SIGURG:16,SIGXCPU:24,SIGXFSZ:25,SIGVTALRM:26,SIGPROF:27,SIGWINCH:28,SIGIO:23,SIGSYS:12,SSL_OP_ALL:2147486719,SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION:262144,SSL_OP_CIPHER_SERVER_PREFERENCE:4194304,SSL_OP_CISCO_ANYCONNECT:32768,SSL_OP_COOKIE_EXCHANGE:8192,SSL_OP_CRYPTOPRO_TLSEXT_BUG:2147483648,SSL_OP_DONT_INSERT_EMPTY_FRAGMENTS:2048,SSL_OP_EPHEMERAL_RSA:0,SSL_OP_LEGACY_SERVER_CONNECT:4,SSL_OP_MICROSOFT_BIG_SSLV3_BUFFER:32,SSL_OP_MICROSOFT_SESS_ID_BUG:1,SSL_OP_MSIE_SSLV2_RSA_PADDING:0,SSL_OP_NETSCAPE_CA_DN_BUG:536870912,SSL_OP_NETSCAPE_CHALLENGE_BUG:2,SSL_OP_NETSCAPE_DEMO_CIPHER_CHANGE_BUG:1073741824,SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG:8,SSL_OP_NO_COMPRESSION:131072,SSL_OP_NO_QUERY_MTU:4096,SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION:65536,SSL_OP_NO_SSLv2:16777216,SSL_OP_NO_SSLv3:33554432,SSL_OP_NO_TICKET:16384,SSL_OP_NO_TLSv1:67108864,SSL_OP_NO_TLSv1_1:268435456,SSL_OP_NO_TLSv1_2:134217728,SSL_OP_PKCS1_CHECK_1:0,SSL_OP_PKCS1_CHECK_2:0,SSL_OP_SINGLE_DH_USE:1048576,SSL_OP_SINGLE_ECDH_USE:524288,SSL_OP_SSLEAY_080_CLIENT_DH_BUG:128,SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG:0,SSL_OP_TLS_BLOCK_PADDING_BUG:512,SSL_OP_TLS_D5_BUG:256,SSL_OP_TLS_ROLLBACK_BUG:8388608,ENGINE_METHOD_DSA:2,ENGINE_METHOD_DH:4,ENGINE_METHOD_RAND:8,ENGINE_METHOD_ECDH:16,ENGINE_METHOD_ECDSA:32,ENGINE_METHOD_CIPHERS:64,ENGINE_METHOD_DIGESTS:128,ENGINE_METHOD_STORE:256,ENGINE_METHOD_PKEY_METHS:512,ENGINE_METHOD_PKEY_ASN1_METHS:1024,ENGINE_METHOD_ALL:65535,ENGINE_METHOD_NONE:0,DH_CHECK_P_NOT_SAFE_PRIME:2,DH_CHECK_P_NOT_PRIME:1,DH_UNABLE_TO_CHECK_GENERATOR:4,DH_NOT_SUITABLE_GENERATOR:8,NPN_ENABLED:1,RSA_PKCS1_PADDING:1,RSA_SSLV23_PADDING:2,RSA_NO_PADDING:3,RSA_PKCS1_OAEP_PADDING:4,RSA_X931_PADDING:5,RSA_PKCS1_PSS_PADDING:6,POINT_CONVERSION_COMPRESSED:2,POINT_CONVERSION_UNCOMPRESSED:4,POINT_CONVERSION_HYBRID:6,F_OK:0,R_OK:4,W_OK:2,X_OK:1,UV_UDP_REUSEADDR:4}},{}],9:[function(e,t,n){var r=e("../../modules/_core"),i=r.JSON||(r.JSON={stringify:JSON.stringify});t.exports=function(e){return i.stringify.apply(i,arguments)}},{"../../modules/_core":10}],10:[function(e,t,n){var r=t.exports={version:"2.4.0"};"number"==typeof __e&&(__e=r)},{}],11:[function(e,t,n){(function(e){function t(e){return Array.isArray?Array.isArray(e):"[object Array]"===y(e)}function r(e){return"boolean"==typeof e}function i(e){return null===e}function o(e){return null==e}function s(e){return"number"==typeof e}function a(e){return"string"==typeof e}function u(e){return"symbol"==typeof e}function f(e){return void 0===e}function c(e){return"[object RegExp]"===y(e)}function l(e){return"object"==typeof e&&null!==e}function h(e){return"[object Date]"===y(e)}function p(e){return"[object Error]"===y(e)||e instanceof Error}function d(e){return"function"==typeof e}function g(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function y(e){return Object.prototype.toString.call(e)}n.isArray=t,n.isBoolean=r,n.isNull=i,n.isNullOrUndefined=o,n.isNumber=s,n.isString=a,n.isSymbol=u,n.isUndefined=f,n.isRegExp=c,n.isObject=l,n.isDate=h,n.isError=p,n.isFunction=d,n.isPrimitive=g,n.isBuffer=e.isBuffer}).call(this,{isBuffer:e("../../is-buffer/index.js")})},{"../../is-buffer/index.js":20}],12:[function(e,t,n){function r(){this._events=this._events||{},this._maxListeners=this._maxListeners||void 0}function i(e){return"function"==typeof e}function o(e){return"number"==typeof e}function s(e){return"object"==typeof e&&null!==e}function a(e){return void 0===e}t.exports=r,r.EventEmitter=r,r.prototype._events=void 0,r.prototype._maxListeners=void 0,r.defaultMaxListeners=10,r.prototype.setMaxListeners=function(e){
if(!o(e)||e<0||isNaN(e))throw TypeError("n must be a positive number");return this._maxListeners=e,this},r.prototype.emit=function(e){var t,n,r,o,u,f;if(this._events||(this._events={}),"error"===e&&(!this._events.error||s(this._events.error)&&!this._events.error.length)){if(t=arguments[1],t instanceof Error)throw t;var c=new Error('Uncaught, unspecified "error" event. ('+t+")");throw c.context=t,c}if(n=this._events[e],a(n))return!1;if(i(n))switch(arguments.length){case 1:n.call(this);break;case 2:n.call(this,arguments[1]);break;case 3:n.call(this,arguments[1],arguments[2]);break;default:o=Array.prototype.slice.call(arguments,1),n.apply(this,o)}else if(s(n))for(o=Array.prototype.slice.call(arguments,1),f=n.slice(),r=f.length,u=0;u<r;u++)f[u].apply(this,o);return!0},r.prototype.addListener=function(e,t){var n;if(!i(t))throw TypeError("listener must be a function");return this._events||(this._events={}),this._events.newListener&&this.emit("newListener",e,i(t.listener)?t.listener:t),this._events[e]?s(this._events[e])?this._events[e].push(t):this._events[e]=[this._events[e],t]:this._events[e]=t,s(this._events[e])&&!this._events[e].warned&&(n=a(this._maxListeners)?r.defaultMaxListeners:this._maxListeners,n&&n>0&&this._events[e].length>n&&(this._events[e].warned=!0,console.error("(node) warning: possible EventEmitter memory leak detected. %d listeners added. Use emitter.setMaxListeners() to increase limit.",this._events[e].length),"function"==typeof console.trace&&console.trace())),this},r.prototype.on=r.prototype.addListener,r.prototype.once=function(e,t){function n(){this.removeListener(e,n),r||(r=!0,t.apply(this,arguments))}if(!i(t))throw TypeError("listener must be a function");var r=!1;return n.listener=t,this.on(e,n),this},r.prototype.removeListener=function(e,t){var n,r,o,a;if(!i(t))throw TypeError("listener must be a function");if(!this._events||!this._events[e])return this;if(n=this._events[e],o=n.length,r=-1,n===t||i(n.listener)&&n.listener===t)delete this._events[e],this._events.removeListener&&this.emit("removeListener",e,t);else if(s(n)){for(a=o;a-- >0;)if(n[a]===t||n[a].listener&&n[a].listener===t){r=a;break}if(r<0)return this;1===n.length?(n.length=0,delete this._events[e]):n.splice(r,1),this._events.removeListener&&this.emit("removeListener",e,t)}return this},r.prototype.removeAllListeners=function(e){var t,n;if(!this._events)return this;if(!this._events.removeListener)return 0===arguments.length?this._events={}:this._events[e]&&delete this._events[e],this;if(0===arguments.length){for(t in this._events)"removeListener"!==t&&this.removeAllListeners(t);return this.removeAllListeners("removeListener"),this._events={},this}if(n=this._events[e],i(n))this.removeListener(e,n);else if(n)for(;n.length;)this.removeListener(e,n[n.length-1]);return delete this._events[e],this},r.prototype.listeners=function(e){var t;return t=this._events&&this._events[e]?i(this._events[e])?[this._events[e]]:this._events[e].slice():[]},r.prototype.listenerCount=function(e){if(this._events){var t=this._events[e];if(i(t))return 1;if(t)return t.length}return 0},r.listenerCount=function(e,t){return e.listenerCount(t)}},{}],13:[function(e,t,n){"use strict";function r(e){if(null===e||"object"!=typeof e)return e;if(e instanceof Object)var t={__proto__:e.__proto__};else var t=Object.create(null);return Object.getOwnPropertyNames(e).forEach(function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}),t}var i=e("fs");t.exports=r(i)},{fs:4}],14:[function(e,t,n){(function(n){function r(){}function i(e){function t(e,t,n){function r(e,t,n){return v(e,t,function(i){!i||"EMFILE"!==i.code&&"ENFILE"!==i.code?("function"==typeof n&&n.apply(this,arguments),s()):o([r,[e,t,n]])})}return"function"==typeof t&&(n=t,t=null),r(e,t,n)}function r(e,t,n,r){function i(e,t,n,r){return m(e,t,n,function(a){!a||"EMFILE"!==a.code&&"ENFILE"!==a.code?("function"==typeof r&&r.apply(this,arguments),s()):o([i,[e,t,n,r]])})}return"function"==typeof n&&(r=n,n=null),i(e,t,n,r)}function a(e,t,n,r){function i(e,t,n,r){return E(e,t,n,function(a){!a||"EMFILE"!==a.code&&"ENFILE"!==a.code?("function"==typeof r&&r.apply(this,arguments),s()):o([i,[e,t,n,r]])})}return"function"==typeof n&&(r=n,n=null),i(e,t,n,r)}function c(e,t){function n(){return w(e,function(r,i){i&&i.sort&&i.sort(),!r||"EMFILE"!==r.code&&"ENFILE"!==r.code?("function"==typeof t&&t.apply(this,arguments),s()):o([n,[e,t]])})}return n(e,t)}function l(e,t){return this instanceof l?(S.apply(this,arguments),this):l.apply(Object.create(l.prototype),arguments)}function h(){var e=this;_(e.path,e.flags,e.mode,function(t,n){t?(e.autoClose&&e.destroy(),e.emit("error",t)):(e.fd=n,e.emit("open",n),e.read())})}function p(e,t){return this instanceof p?(O.apply(this,arguments),this):p.apply(Object.create(p.prototype),arguments)}function d(){var e=this;_(e.path,e.flags,e.mode,function(t,n){t?(e.destroy(),e.emit("error",t)):(e.fd=n,e.emit("open",n))})}function g(e,t){return new l(e,t)}function y(e,t){return new p(e,t)}function _(e,t,n,r){function i(e,t,n,r){return R(e,t,n,function(a,u){!a||"EMFILE"!==a.code&&"ENFILE"!==a.code?("function"==typeof r&&r.apply(this,arguments),s()):o([i,[e,t,n,r]])})}return"function"==typeof n&&(r=n,n=null),i(e,t,n,r)}u(e),e.gracefulify=i,e.FileReadStream=l,e.FileWriteStream=p,e.createReadStream=g,e.createWriteStream=y;var v=e.readFile;e.readFile=t;var m=e.writeFile;e.writeFile=r;var E=e.appendFile;E&&(e.appendFile=a);var w=e.readdir;if(e.readdir=c,"v0.8"===n.version.substr(0,4)){var b=f(e);l=b.ReadStream,p=b.WriteStream}var S=e.ReadStream;l.prototype=Object.create(S.prototype),l.prototype.open=h;var O=e.WriteStream;p.prototype=Object.create(O.prototype),p.prototype.open=d,e.ReadStream=l,e.WriteStream=p;var R=e.open;return e.open=_,e}function o(e){h("ENQUEUE",e[0].name,e[1]),c.push(e)}function s(){var e=c.shift();e&&(h("RETRY",e[0].name,e[1]),e[0].apply(null,e[1]))}var a=e("fs"),u=e("./polyfills.js"),f=e("./legacy-streams.js"),c=[],l=e("util"),h=r;l.debuglog?h=l.debuglog("gfs4"):/\bgfs4\b/i.test(n.env.NODE_DEBUG||"")&&(h=function(){var e=l.format.apply(l,arguments);e="GFS4: "+e.split(/\n/).join("\nGFS4: "),console.error(e)}),/\bgfs4\b/i.test(n.env.NODE_DEBUG||"")&&n.on("exit",function(){h(c),e("assert").equal(c.length,0)}),t.exports=i(e("./fs.js")),n.env.TEST_GRACEFUL_FS_GLOBAL_PATCH&&(t.exports=i(a)),t.exports.close=a.close=function(e){return function(t,n){return e.call(a,t,function(e){e||s(),"function"==typeof n&&n.apply(this,arguments)})}}(a.close),t.exports.closeSync=a.closeSync=function(e){return function(t){var n=e.apply(a,arguments);return s(),n}}(a.closeSync)}).call(this,e("_process"))},{"./fs.js":13,"./legacy-streams.js":15,"./polyfills.js":16,_process:25,assert:5,fs:4,util:44}],15:[function(e,t,n){(function(n){function r(e){function t(r,o){if(!(this instanceof t))return new t(r,o);i.call(this);var s=this;this.path=r,this.fd=null,this.readable=!0,this.paused=!1,this.flags="r",this.mode=438,this.bufferSize=65536,o=o||{};for(var a=Object.keys(o),u=0,f=a.length;u<f;u++){var c=a[u];this[c]=o[c]}if(this.encoding&&this.setEncoding(this.encoding),void 0!==this.start){if("number"!=typeof this.start)throw TypeError("start must be a Number");if(void 0===this.end)this.end=1/0;else if("number"!=typeof this.end)throw TypeError("end must be a Number");if(this.start>this.end)throw new Error("start must be <= end");this.pos=this.start}return null!==this.fd?void n.nextTick(function(){s._read()}):void e.open(this.path,this.flags,this.mode,function(e,t){return e?(s.emit("error",e),void(s.readable=!1)):(s.fd=t,s.emit("open",t),void s._read())})}function r(t,n){if(!(this instanceof r))return new r(t,n);i.call(this),this.path=t,this.fd=null,this.writable=!0,this.flags="w",this.encoding="binary",this.mode=438,this.bytesWritten=0,n=n||{};for(var o=Object.keys(n),s=0,a=o.length;s<a;s++){var u=o[s];this[u]=n[u]}if(void 0!==this.start){if("number"!=typeof this.start)throw TypeError("start must be a Number");if(this.start<0)throw new Error("start must be >= zero");this.pos=this.start}this.busy=!1,this._queue=[],null===this.fd&&(this._open=e.open,this._queue.push([this._open,this.path,this.flags,this.mode,void 0]),this.flush())}return{ReadStream:t,WriteStream:r}}var i=e("stream").Stream;t.exports=r}).call(this,e("_process"))},{_process:25,stream:40}],16:[function(e,t,n){(function(n){function r(e){c.hasOwnProperty("O_SYMLINK")&&n.version.match(/^v0\.6\.[0-2]|^v0\.5\./)&&i(e),e.lutimes||o(e),e.chown=s(e.chown),e.fchown=s(e.fchown),e.lchown=s(e.lchown),e.chmod=s(e.chmod),e.fchmod=s(e.fchmod),e.lchmod=s(e.lchmod),e.chownSync=a(e.chownSync),e.fchownSync=a(e.fchownSync),e.lchownSync=a(e.lchownSync),e.chmodSync=s(e.chmodSync),e.fchmodSync=s(e.fchmodSync),e.lchmodSync=s(e.lchmodSync),e.lchmod||(e.lchmod=function(e,t,r){n.nextTick(r)},e.lchmodSync=function(){}),e.lchown||(e.lchown=function(e,t,r,i){n.nextTick(i)},e.lchownSync=function(){}),"win32"===n.platform&&(e.rename=function(e){return function(t,n,r){var i=Date.now();e(t,n,function o(s){return s&&("EACCES"===s.code||"EPERM"===s.code)&&Date.now()-i<1e3?e(t,n,o):void(r&&r(s))})}}(e.rename)),e.read=function(t){return function(n,r,i,o,s,a){var u;if(a&&"function"==typeof a){var f=0;u=function(c,l,h){return c&&"EAGAIN"===c.code&&f<10?(f++,t.call(e,n,r,i,o,s,u)):void a.apply(this,arguments)}}return t.call(e,n,r,i,o,s,u)}}(e.read),e.readSync=function(t){return function(n,r,i,o,s){for(var a=0;;)try{return t.call(e,n,r,i,o,s)}catch(u){if("EAGAIN"===u.code&&a<10){a++;continue}throw u}}}(e.readSync)}function i(e){e.lchmod=function(t,n,r){r=r||noop,e.open(t,c.O_WRONLY|c.O_SYMLINK,n,function(t,i){return t?void r(t):void e.fchmod(i,n,function(t){e.close(i,function(e){r(t||e)})})})},e.lchmodSync=function(t,n){var r,i=e.openSync(t,c.O_WRONLY|c.O_SYMLINK,n),o=!0;try{r=e.fchmodSync(i,n),o=!1}finally{if(o)try{e.closeSync(i)}catch(s){}else e.closeSync(i)}return r}}function o(e){c.hasOwnProperty("O_SYMLINK")?(e.lutimes=function(t,n,r,i){e.open(t,c.O_SYMLINK,function(t,o){return i=i||noop,t?i(t):void e.futimes(o,n,r,function(t){e.close(o,function(e){return i(t||e)})})})},e.lutimesSync=function(t,n,r){var i,o=e.openSync(t,c.O_SYMLINK),s=!0;try{i=e.futimesSync(o,n,r),s=!1}finally{if(s)try{e.closeSync(o)}catch(a){}else e.closeSync(o)}return i}):(e.lutimes=function(e,t,r,i){n.nextTick(i)},e.lutimesSync=function(){})}function s(e){return e?function(t,n,r,i){return e.call(f,t,n,r,function(e,t){u(e)&&(e=null),i(e,t)})}:e}function a(e){return e?function(t,n,r){try{return e.call(f,t,n,r)}catch(i){if(!u(i))throw i}}:e}function u(e){if(!e)return!0;if("ENOSYS"===e.code)return!0;var t=!n.getuid||0!==n.getuid();return!(!t||"EINVAL"!==e.code&&"EPERM"!==e.code)}var f=e("./fs.js"),c=e("constants"),l=n.cwd,h=null;n.cwd=function(){return h||(h=l.call(n)),h};try{n.cwd()}catch(p){}var d=n.chdir;n.chdir=function(e){h=null,d.call(n,e)},t.exports=r}).call(this,e("_process"))},{"./fs.js":13,_process:25,constants:8}],17:[function(e,t,n){n.read=function(e,t,n,r,i){var o,s,a=8*i-r-1,u=(1<<a)-1,f=u>>1,c=-7,l=n?i-1:0,h=n?-1:1,p=e[t+l];for(l+=h,o=p&(1<<-c)-1,p>>=-c,c+=a;c>0;o=256*o+e[t+l],l+=h,c-=8);for(s=o&(1<<-c)-1,o>>=-c,c+=r;c>0;s=256*s+e[t+l],l+=h,c-=8);if(0===o)o=1-f;else{if(o===u)return s?NaN:(p?-1:1)*(1/0);s+=Math.pow(2,r),o-=f}return(p?-1:1)*s*Math.pow(2,o-r)},n.write=function(e,t,n,r,i,o){var s,a,u,f=8*o-i-1,c=(1<<f)-1,l=c>>1,h=23===i?Math.pow(2,-24)-Math.pow(2,-77):0,p=r?0:o-1,d=r?1:-1,g=t<0||0===t&&1/t<0?1:0;for(t=Math.abs(t),isNaN(t)||t===1/0?(a=isNaN(t)?1:0,s=c):(s=Math.floor(Math.log(t)/Math.LN2),t*(u=Math.pow(2,-s))<1&&(s--,u*=2),t+=s+l>=1?h/u:h*Math.pow(2,1-l),t*u>=2&&(s++,u/=2),s+l>=c?(a=0,s=c):s+l>=1?(a=(t*u-1)*Math.pow(2,i),s+=l):(a=t*Math.pow(2,l-1)*Math.pow(2,i),s=0));i>=8;e[n+p]=255&a,p+=d,a/=256,i-=8);for(s=s<<i|a,f+=i;f>0;e[n+p]=255&s,p+=d,s/=256,f-=8);e[n+p-d]|=128*g}},{}],18:[function(e,t,n){!function(){function e(t,r){var i=this instanceof e?this:n;if(i.reset(r),"string"==typeof t&&t.length>0&&i.hash(t),i!==this)return i}var n;e.prototype.hash=function(e){var t,n,r,i,o;switch(o=e.length,this.len+=o,n=this.k1,r=0,this.rem){case 0:n^=o>r?65535&e.charCodeAt(r++):0;case 1:n^=o>r?(65535&e.charCodeAt(r++))<<8:0;case 2:n^=o>r?(65535&e.charCodeAt(r++))<<16:0;case 3:n^=o>r?(255&e.charCodeAt(r))<<24:0,n^=o>r?(65280&e.charCodeAt(r++))>>8:0}if(this.rem=o+this.rem&3,o-=this.rem,o>0){for(t=this.h1;;){if(n=11601*n+3432906752*(65535&n)&4294967295,n=n<<15|n>>>17,n=13715*n+461832192*(65535&n)&4294967295,t^=n,t=t<<13|t>>>19,t=5*t+3864292196&4294967295,r>=o)break;n=65535&e.charCodeAt(r++)^(65535&e.charCodeAt(r++))<<8^(65535&e.charCodeAt(r++))<<16,i=e.charCodeAt(r++),n^=(255&i)<<24^(65280&i)>>8}switch(n=0,this.rem){case 3:n^=(65535&e.charCodeAt(r+2))<<16;case 2:n^=(65535&e.charCodeAt(r+1))<<8;case 1:n^=65535&e.charCodeAt(r)}this.h1=t}return this.k1=n,this},e.prototype.result=function(){var e,t;return e=this.k1,t=this.h1,e>0&&(e=11601*e+3432906752*(65535&e)&4294967295,e=e<<15|e>>>17,e=13715*e+461832192*(65535&e)&4294967295,t^=e),t^=this.len,t^=t>>>16,t=51819*t+2246770688*(65535&t)&4294967295,t^=t>>>13,t=44597*t+3266445312*(65535&t)&4294967295,t^=t>>>16,t>>>0},e.prototype.reset=function(e){return this.h1="number"==typeof e?e:0,this.rem=this.k1=this.len=0,this},n=new e,"undefined"!=typeof t?t.exports=e:this.MurmurHash3=e}()},{}],19:[function(e,t,n){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},{}],20:[function(e,t,n){t.exports=function(e){return!(null==e||!(e._isBuffer||e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)))}},{}],21:[function(e,t,n){var r={}.toString;t.exports=Array.isArray||function(e){return"[object Array]"==r.call(e)}},{}],22:[function(e,t,n){(function(t){(function(){var r,i,o,s,a,u,f,c,l,h,p,d,g,y,_=function(e,t){function n(){this.constructor=e}for(var r in t)v.call(t,r)&&(e[r]=t[r]);return n.prototype=t.prototype,e.prototype=new n,e.__super__=t.prototype,e},v={}.hasOwnProperty;g=e("path"),d=e("fs"),p=e("events"),y=e("write-file-atomic").sync,i="---.EMPTY_STRING.---",f=function(e){var t,n,r,i,o;for(i=d.readdirSync(e),o=[],t=0,n=i.length;t<n;t++)r=i[t],o.push(l(g.join(e,r)));return o},l=function(e){return d.statSync(e).isDirectory()?(f(e),d.rmdirSync(e)):d.unlinkSync(e)},c=function(e){var t;return t=""===e?i:e.toString()},a=function(e){function t(e){this.message=null!=e?e:"Unknown error.",null!=Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name=this.constructor.name}return _(t,e),t.prototype.toString=function(){return this.name+": "+this.message},t}(Error),u=function(){function e(e,t,n,r,i){this.key=e,this.oldValue=t,this.newValue=n,this.url=r,this.storageArea=null!=i?i:"localStorage"}return e}(),s=function(){function e(t,n){if(this.key=t,this.index=n,!(this instanceof e))return new e(this.key,this.index)}return e}(),h=function(){var e;return e=function(){},e.prototype=Object.create(null),new e},o=function(e){function n(e,i){return this._location=e,this.quota=null!=i?i:5242880,this instanceof n?(this._location=g.resolve(this._location),null!=r[this._location]?r[this._location]:(this.length=0,this._bytesInUse=0,this._keys=[],this._metaKeyMap=h(),this._eventUrl="pid:"+t.pid,this._init(),this._QUOTA_EXCEEDED_ERR=a,r[this._location]=this,r[this._location])):new n(this._location,this.quota)}var r;return _(n,e),r={},n.prototype._init=function(){var e,t,n,r,i,o,a,u;try{if(u=d.statSync(this._location),null!=u&&!u.isDirectory())throw new Error("A file exists at the location '"+this._location+"' when trying to create/open localStorage");for(this._bytesInUse=0,this.length=0,n=d.readdirSync(this._location),i=r=0,a=n.length;r<a;i=++r)o=n[i],t=decodeURIComponent(o),this._keys.push(t),e=new s(o,i),this._metaKeyMap[t]=e,u=this._getStat(o),null!=(null!=u?u.size:void 0)&&(e.size=u.size,this._bytesInUse+=u.size);this.length=n.length}catch(f){d.mkdirSync(this._location)}},n.prototype.setItem=function(e,t){var n,r,i,o,f,l,h,d,_,v;if(f=p.EventEmitter.listenerCount(this,"storage"),d=null,f&&(d=this.getItem(e)),e=c(e),n=encodeURIComponent(e),o=g.join(this._location,n),_=t.toString(),v=_.length,l=this._metaKeyMap[e],i=!!l,h=i?l.size:0,this._bytesInUse-h+v>this.quota)throw new a;if(y(o,_,"utf8"),i||(l=new s(n,this._keys.push(e)-1),l.size=v,this._metaKeyMap[e]=l,this.length+=1,this._bytesInUse+=v),f)return r=new u(e,d,t,this._eventUrl),this.emit("storage",r)},n.prototype.getItem=function(e){var t,n;return e=c(e),n=this._metaKeyMap[e],n?(t=g.join(this._location,n.key),d.readFileSync(t,"utf8")):null},n.prototype._getStat=function(e){var t;e=c(e),t=g.join(this._location,encodeURIComponent(e));try{return d.statSync(t)}catch(n){return null}},n.prototype.removeItem=function(e){var t,n,r,i,o,s,a,f,h;if(e=c(e),s=this._metaKeyMap[e]){r=p.EventEmitter.listenerCount(this,"storage"),a=null,r&&(a=this.getItem(e)),delete this._metaKeyMap[e],this.length-=1,this._bytesInUse-=s.size,n=g.join(this._location,s.key),this._keys.splice(s.index,1),f=this._metaKeyMap;for(i in f)h=f[i],o=this._metaKeyMap[i],o.index>s.index&&(o.index-=1);if(l(n),r)return t=new u(e,a,null,this._eventUrl),this.emit("storage",t)}},n.prototype.key=function(e){return this._keys[e]},n.prototype.clear=function(){var e;if(f(this._location),this._metaKeyMap=h(),this._keys=[],this.length=0,this._bytesInUse=0,p.EventEmitter.listenerCount(this,"storage"))return e=new u(null,null,null,this._eventUrl),this.emit("storage",e)},n.prototype._getBytesInUse=function(){return this._bytesInUse},n.prototype._deleteLocation=function(){return delete r[this._location],l(this._location),this._metaKeyMap={},this._keys=[],this.length=0,this._bytesInUse=0},n}(p.EventEmitter),r=function(e){function t(){return t.__super__.constructor.apply(this,arguments)}return _(t,e),t.prototype.setItem=function(e,n){var r;return r=JSON.stringify(n),t.__super__.setItem.call(this,e,r)},t.prototype.getItem=function(e){return JSON.parse(t.__super__.getItem.call(this,e))},t}(o),n.LocalStorage=o,n.JSONStorage=r,n.QUOTA_EXCEEDED_ERR=a}).call(this)}).call(this,e("_process"))},{_process:25,events:12,fs:4,path:23,"write-file-atomic":45}],23:[function(e,t,n){(function(e){function t(e,t){for(var n=0,r=e.length-1;r>=0;r--){var i=e[r];"."===i?e.splice(r,1):".."===i?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n--;n)e.unshift("..");return e}function r(e,t){if(e.filter)return e.filter(t);for(var n=[],r=0;r<e.length;r++)t(e[r],r,e)&&n.push(e[r]);return n}var i=/^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/,o=function(e){return i.exec(e).slice(1)};n.resolve=function(){for(var n="",i=!1,o=arguments.length-1;o>=-1&&!i;o--){var s=o>=0?arguments[o]:e.cwd();if("string"!=typeof s)throw new TypeError("Arguments to path.resolve must be strings");s&&(n=s+"/"+n,i="/"===s.charAt(0))}return n=t(r(n.split("/"),function(e){return!!e}),!i).join("/"),(i?"/":"")+n||"."},n.normalize=function(e){var i=n.isAbsolute(e),o="/"===s(e,-1);return e=t(r(e.split("/"),function(e){return!!e}),!i).join("/"),e||i||(e="."),e&&o&&(e+="/"),(i?"/":"")+e},n.isAbsolute=function(e){return"/"===e.charAt(0)},n.join=function(){var e=Array.prototype.slice.call(arguments,0);return n.normalize(r(e,function(e,t){if("string"!=typeof e)throw new TypeError("Arguments to path.join must be strings");return e}).join("/"))},n.relative=function(e,t){function r(e){for(var t=0;t<e.length&&""===e[t];t++);for(var n=e.length-1;n>=0&&""===e[n];n--);return t>n?[]:e.slice(t,n-t+1)}e=n.resolve(e).substr(1),t=n.resolve(t).substr(1);for(var i=r(e.split("/")),o=r(t.split("/")),s=Math.min(i.length,o.length),a=s,u=0;u<s;u++)if(i[u]!==o[u]){a=u;break}for(var f=[],u=a;u<i.length;u++)f.push("..");return f=f.concat(o.slice(a)),f.join("/")},n.sep="/",n.delimiter=":",n.dirname=function(e){var t=o(e),n=t[0],r=t[1];return n||r?(r&&(r=r.substr(0,r.length-1)),n+r):"."},n.basename=function(e,t){var n=o(e)[2];return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},n.extname=function(e){return o(e)[3]};var s="b"==="ab".substr(-1)?function(e,t,n){return e.substr(t,n)}:function(e,t,n){return t<0&&(t=e.length+t),e.substr(t,n)}}).call(this,e("_process"))},{_process:25}],24:[function(e,t,n){(function(e){"use strict";function n(t,n,r,i){if("function"!=typeof t)throw new TypeError('"callback" argument must be a function');var o,s,a=arguments.length;switch(a){case 0:case 1:return e.nextTick(t);case 2:return e.nextTick(function(){t.call(null,n)});case 3:return e.nextTick(function(){t.call(null,n,r)});case 4:return e.nextTick(function(){t.call(null,n,r,i)});default:for(o=new Array(a-1),s=0;s<o.length;)o[s++]=arguments[s];return e.nextTick(function(){t.apply(null,o)})}}!e.version||0===e.version.indexOf("v0.")||0===e.version.indexOf("v1.")&&0!==e.version.indexOf("v1.8.")?t.exports=n:t.exports=e.nextTick}).call(this,e("_process"))},{_process:25}],25:[function(e,t,n){function r(){h&&c&&(h=!1,c.length?l=c.concat(l):p=-1,l.length&&i())}function i(){if(!h){var e=a(r);h=!0;for(var t=l.length;t;){for(c=l,l=[];++p<t;)c&&c[p].run();p=-1,t=l.length}c=null,h=!1,u(e)}}function o(e,t){this.fun=e,this.array=t}function s(){}var a,u,f=t.exports={};!function(){try{a=setTimeout}catch(e){a=function(){throw new Error("setTimeout is not defined")}}try{u=clearTimeout}catch(e){u=function(){throw new Error("clearTimeout is not defined")}}}();var c,l=[],h=!1,p=-1;f.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];l.push(new o(e,t)),1!==l.length||h||a(i,0)},o.prototype.run=function(){this.fun.apply(null,this.array)},f.title="browser",f.browser=!0,f.env={},f.argv=[],f.version="",f.versions={},f.on=s,f.addListener=s,f.once=s,f.off=s,f.removeListener=s,f.removeAllListeners=s,f.emit=s,f.binding=function(e){throw new Error("process.binding is not supported")},f.cwd=function(){return"/"},f.chdir=function(e){throw new Error("process.chdir is not supported")},f.umask=function(){return 0}},{}],26:[function(e,t,n){t.exports=e("./lib/_stream_duplex.js")},{"./lib/_stream_duplex.js":27}],27:[function(e,t,n){"use strict";function r(e){return this instanceof r?(f.call(this,e),c.call(this,e),e&&e.readable===!1&&(this.readable=!1),e&&e.writable===!1&&(this.writable=!1),this.allowHalfOpen=!0,e&&e.allowHalfOpen===!1&&(this.allowHalfOpen=!1),void this.once("end",i)):new r(e)}function i(){this.allowHalfOpen||this._writableState.ended||a(o,this)}function o(e){e.end()}var s=Object.keys||function(e){var t=[];for(var n in e)t.push(n);return t};t.exports=r;var a=e("process-nextick-args"),u=e("core-util-is");u.inherits=e("inherits");var f=e("./_stream_readable"),c=e("./_stream_writable");u.inherits(r,f);for(var l=s(c.prototype),h=0;h<l.length;h++){var p=l[h];r.prototype[p]||(r.prototype[p]=c.prototype[p])}},{"./_stream_readable":29,"./_stream_writable":31,"core-util-is":11,inherits:19,"process-nextick-args":24}],28:[function(e,t,n){"use strict";function r(e){return this instanceof r?void i.call(this,e):new r(e)}t.exports=r;var i=e("./_stream_transform"),o=e("core-util-is");o.inherits=e("inherits"),o.inherits(r,i),r.prototype._transform=function(e,t,n){n(null,e)}},{"./_stream_transform":30,"core-util-is":11,inherits:19}],29:[function(e,t,n){(function(n){"use strict";function r(e,t,n){return k?e.prependListener(t,n):void(e._events&&e._events[t]?T(e._events[t])?e._events[t].unshift(n):e._events[t]=[n,e._events[t]]:e.on(t,n))}function i(t,n){U=U||e("./_stream_duplex"),t=t||{},this.objectMode=!!t.objectMode,n instanceof U&&(this.objectMode=this.objectMode||!!t.readableObjectMode);var r=t.highWaterMark,i=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:i,this.highWaterMark=~~this.highWaterMark,this.buffer=[],this.length=0,this.pipes=null,this.pipesCount=0,this.flowing=null,this.ended=!1,this.endEmitted=!1,this.reading=!1,this.sync=!0,this.needReadable=!1,this.emittedReadable=!1,this.readableListening=!1,this.resumeScheduled=!1,this.defaultEncoding=t.defaultEncoding||"utf8",this.ranOut=!1,this.awaitDrain=0,this.readingMore=!1,this.decoder=null,this.encoding=null,t.encoding&&(j||(j=e("string_decoder/").StringDecoder),this.decoder=new j(t.encoding),this.encoding=t.encoding)}function o(t){return U=U||e("./_stream_duplex"),this instanceof o?(this._readableState=new i(t,this),this.readable=!0,t&&"function"==typeof t.read&&(this._read=t.read),void I.call(this)):new o(t)}function s(e,t,n,r,i){var o=c(t,n);if(o)e.emit("error",o);else if(null===n)t.reading=!1,l(e,t);else if(t.objectMode||n&&n.length>0)if(t.ended&&!i){var s=new Error("stream.push() after EOF");e.emit("error",s)}else if(t.endEmitted&&i){var u=new Error("stream.unshift() after end event");e.emit("error",u)}else{var f;!t.decoder||i||r||(n=t.decoder.write(n),f=!t.objectMode&&0===n.length),i||(t.reading=!1),f||(t.flowing&&0===t.length&&!t.sync?(e.emit("data",n),e.read(0)):(t.length+=t.objectMode?1:n.length,i?t.buffer.unshift(n):t.buffer.push(n),t.needReadable&&h(e))),d(e,t)}else i||(t.reading=!1);return a(t)}function a(e){return!e.ended&&(e.needReadable||e.length<e.highWaterMark||0===e.length)}function u(e){return e>=B?e=B:(e--,e|=e>>>1,e|=e>>>2,e|=e>>>4,e|=e>>>8,e|=e>>>16,e++),e}function f(e,t){return 0===t.length&&t.ended?0:t.objectMode?0===e?0:1:null===e||isNaN(e)?t.flowing&&t.buffer.length?t.buffer[0].length:t.length:e<=0?0:(e>t.highWaterMark&&(t.highWaterMark=u(e)),e>t.length?t.ended?t.length:(t.needReadable=!0,0):e)}function c(e,t){var n=null;return P.isBuffer(t)||"string"==typeof t||null===t||void 0===t||e.objectMode||(n=new TypeError("Invalid non-string/buffer chunk")),n}function l(e,t){if(!t.ended){if(t.decoder){var n=t.decoder.end();n&&n.length&&(t.buffer.push(n),t.length+=t.objectMode?1:n.length)}t.ended=!0,h(e)}}function h(e){var t=e._readableState;t.needReadable=!1,t.emittedReadable||(D("emitReadable",t.flowing),t.emittedReadable=!0,t.sync?A(p,e):p(e))}function p(e){D("emit readable"),e.emit("readable"),E(e)}function d(e,t){t.readingMore||(t.readingMore=!0,A(g,e,t))}function g(e,t){for(var n=t.length;!t.reading&&!t.flowing&&!t.ended&&t.length<t.highWaterMark&&(D("maybeReadMore read 0"),e.read(0),n!==t.length);)n=t.length;t.readingMore=!1}function y(e){return function(){var t=e._readableState;D("pipeOnDrain",t.awaitDrain),t.awaitDrain&&t.awaitDrain--,0===t.awaitDrain&&N(e,"data")&&(t.flowing=!0,E(e))}}function _(e){D("readable nexttick read 0"),e.read(0)}function v(e,t){t.resumeScheduled||(t.resumeScheduled=!0,A(m,e,t))}function m(e,t){t.reading||(D("resume read 0"),e.read(0)),t.resumeScheduled=!1,e.emit("resume"),E(e),t.flowing&&!t.reading&&e.read(0)}function E(e){var t=e._readableState;if(D("flow",t.flowing),t.flowing)do var n=e.read();while(null!==n&&t.flowing)}function w(e,t){var n,r=t.buffer,i=t.length,o=!!t.decoder,s=!!t.objectMode;if(0===r.length)return null;if(0===i)n=null;else if(s)n=r.shift();else if(!e||e>=i)n=o?r.join(""):1===r.length?r[0]:P.concat(r,i),r.length=0;else if(e<r[0].length){var a=r[0];n=a.slice(0,e),r[0]=a.slice(e)}else if(e===r[0].length)n=r.shift();else{n=o?"":C.allocUnsafe(e);for(var u=0,f=0,c=r.length;f<c&&u<e;f++){var l=r[0],h=Math.min(e-u,l.length);o?n+=l.slice(0,h):l.copy(n,u,0,h),h<l.length?r[0]=l.slice(h):r.shift(),u+=h}}return n}function b(e){var t=e._readableState;if(t.length>0)throw new Error('"endReadable()" called on non-empty stream');t.endEmitted||(t.ended=!0,A(S,t,e))}function S(e,t){e.endEmitted||0!==e.length||(e.endEmitted=!0,t.readable=!1,t.emit("end"))}function O(e,t){for(var n=0,r=e.length;n<r;n++)t(e[n],n)}function R(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}t.exports=o;var A=e("process-nextick-args"),T=e("isarray");o.ReadableState=i;var I,L=e("events").EventEmitter,N=function(e,t){return e.listeners(t).length};!function(){try{I=e("stream")}catch(t){}finally{I||(I=e("events").EventEmitter)}}();var P=e("buffer").Buffer,C=e("buffer-shims"),M=e("core-util-is");M.inherits=e("inherits");var x=e("util"),D=void 0;D=x&&x.debuglog?x.debuglog("stream"):function(){};var j;M.inherits(o,I);var U,U,k="function"==typeof L.prototype.prependListener;o.prototype.push=function(e,t){var n=this._readableState;return n.objectMode||"string"!=typeof e||(t=t||n.defaultEncoding,t!==n.encoding&&(e=C.from(e,t),t="")),s(this,n,e,t,!1)},o.prototype.unshift=function(e){var t=this._readableState;return s(this,t,e,"",!0)},o.prototype.isPaused=function(){return this._readableState.flowing===!1},o.prototype.setEncoding=function(t){return j||(j=e("string_decoder/").StringDecoder),this._readableState.decoder=new j(t),this._readableState.encoding=t,this};var B=8388608;o.prototype.read=function(e){D("read",e);var t=this._readableState,n=e;if(("number"!=typeof e||e>0)&&(t.emittedReadable=!1),0===e&&t.needReadable&&(t.length>=t.highWaterMark||t.ended))return D("read: emitReadable",t.length,t.ended),0===t.length&&t.ended?b(this):h(this),null;if(e=f(e,t),0===e&&t.ended)return 0===t.length&&b(this),null;var r=t.needReadable;D("need readable",r),(0===t.length||t.length-e<t.highWaterMark)&&(r=!0,D("length less than watermark",r)),(t.ended||t.reading)&&(r=!1,D("reading or ended",r)),r&&(D("do read"),t.reading=!0,t.sync=!0,0===t.length&&(t.needReadable=!0),this._read(t.highWaterMark),t.sync=!1),r&&!t.reading&&(e=f(n,t));var i;return i=e>0?w(e,t):null,null===i&&(t.needReadable=!0,e=0),t.length-=e,0!==t.length||t.ended||(t.needReadable=!0),n!==e&&t.ended&&0===t.length&&b(this),null!==i&&this.emit("data",i),i},o.prototype._read=function(e){this.emit("error",new Error("not implemented"))},o.prototype.pipe=function(e,t){function i(e){D("onunpipe"),e===h&&s()}function o(){D("onend"),e.end()}function s(){D("cleanup"),e.removeListener("close",f),e.removeListener("finish",c),e.removeListener("drain",_),e.removeListener("error",u),e.removeListener("unpipe",i),h.removeListener("end",o),h.removeListener("end",s),h.removeListener("data",a),v=!0,!p.awaitDrain||e._writableState&&!e._writableState.needDrain||_()}function a(t){D("ondata");var n=e.write(t);!1===n&&((1===p.pipesCount&&p.pipes===e||p.pipesCount>1&&R(p.pipes,e)!==-1)&&!v&&(D("false write response, pause",h._readableState.awaitDrain),h._readableState.awaitDrain++),h.pause())}function u(t){D("onerror",t),l(),e.removeListener("error",u),0===N(e,"error")&&e.emit("error",t)}function f(){e.removeListener("finish",c),l()}function c(){D("onfinish"),e.removeListener("close",f),l()}function l(){D("unpipe"),h.unpipe(e)}var h=this,p=this._readableState;switch(p.pipesCount){case 0:p.pipes=e;break;case 1:p.pipes=[p.pipes,e];break;default:p.pipes.push(e)}p.pipesCount+=1,D("pipe count=%d opts=%j",p.pipesCount,t);var d=(!t||t.end!==!1)&&e!==n.stdout&&e!==n.stderr,g=d?o:s;p.endEmitted?A(g):h.once("end",g),e.on("unpipe",i);var _=y(h);e.on("drain",_);var v=!1;return h.on("data",a),r(e,"error",u),e.once("close",f),e.once("finish",c),e.emit("pipe",h),p.flowing||(D("pipe resume"),h.resume()),e},o.prototype.unpipe=function(e){var t=this._readableState;if(0===t.pipesCount)return this;if(1===t.pipesCount)return e&&e!==t.pipes?this:(e||(e=t.pipes),t.pipes=null,t.pipesCount=0,t.flowing=!1,e&&e.emit("unpipe",this),this);if(!e){var n=t.pipes,r=t.pipesCount;t.pipes=null,t.pipesCount=0,t.flowing=!1;for(var i=0;i<r;i++)n[i].emit("unpipe",this);return this}var o=R(t.pipes,e);return o===-1?this:(t.pipes.splice(o,1),t.pipesCount-=1,1===t.pipesCount&&(t.pipes=t.pipes[0]),e.emit("unpipe",this),this)},o.prototype.on=function(e,t){var n=I.prototype.on.call(this,e,t);if("data"===e&&!1!==this._readableState.flowing&&this.resume(),"readable"===e&&!this._readableState.endEmitted){var r=this._readableState;r.readableListening||(r.readableListening=!0,r.emittedReadable=!1,r.needReadable=!0,r.reading?r.length&&h(this,r):A(_,this))}return n},o.prototype.addListener=o.prototype.on,o.prototype.resume=function(){var e=this._readableState;return e.flowing||(D("resume"),e.flowing=!0,v(this,e)),this},o.prototype.pause=function(){
return D("call pause flowing=%j",this._readableState.flowing),!1!==this._readableState.flowing&&(D("pause"),this._readableState.flowing=!1,this.emit("pause")),this},o.prototype.wrap=function(e){var t=this._readableState,n=!1,r=this;e.on("end",function(){if(D("wrapped end"),t.decoder&&!t.ended){var e=t.decoder.end();e&&e.length&&r.push(e)}r.push(null)}),e.on("data",function(i){if(D("wrapped data"),t.decoder&&(i=t.decoder.write(i)),(!t.objectMode||null!==i&&void 0!==i)&&(t.objectMode||i&&i.length)){var o=r.push(i);o||(n=!0,e.pause())}});for(var i in e)void 0===this[i]&&"function"==typeof e[i]&&(this[i]=function(t){return function(){return e[t].apply(e,arguments)}}(i));var o=["error","close","destroy","pause","resume"];return O(o,function(t){e.on(t,r.emit.bind(r,t))}),r._read=function(t){D("wrapped _read",t),n&&(n=!1,e.resume())},r},o._fromList=w}).call(this,e("_process"))},{"./_stream_duplex":27,_process:25,buffer:7,"buffer-shims":6,"core-util-is":11,events:12,inherits:19,isarray:21,"process-nextick-args":24,"string_decoder/":41,util:3}],30:[function(e,t,n){"use strict";function r(e){this.afterTransform=function(t,n){return i(e,t,n)},this.needTransform=!1,this.transforming=!1,this.writecb=null,this.writechunk=null,this.writeencoding=null}function i(e,t,n){var r=e._transformState;r.transforming=!1;var i=r.writecb;if(!i)return e.emit("error",new Error("no writecb in Transform class"));r.writechunk=null,r.writecb=null,null!==n&&void 0!==n&&e.push(n),i(t);var o=e._readableState;o.reading=!1,(o.needReadable||o.length<o.highWaterMark)&&e._read(o.highWaterMark)}function o(e){if(!(this instanceof o))return new o(e);a.call(this,e),this._transformState=new r(this);var t=this;this._readableState.needReadable=!0,this._readableState.sync=!1,e&&("function"==typeof e.transform&&(this._transform=e.transform),"function"==typeof e.flush&&(this._flush=e.flush)),this.once("prefinish",function(){"function"==typeof this._flush?this._flush(function(e){s(t,e)}):s(t)})}function s(e,t){if(t)return e.emit("error",t);var n=e._writableState,r=e._transformState;if(n.length)throw new Error("Calling transform done when ws.length != 0");if(r.transforming)throw new Error("Calling transform done when still transforming");return e.push(null)}t.exports=o;var a=e("./_stream_duplex"),u=e("core-util-is");u.inherits=e("inherits"),u.inherits(o,a),o.prototype.push=function(e,t){return this._transformState.needTransform=!1,a.prototype.push.call(this,e,t)},o.prototype._transform=function(e,t,n){throw new Error("Not implemented")},o.prototype._write=function(e,t,n){var r=this._transformState;if(r.writecb=n,r.writechunk=e,r.writeencoding=t,!r.transforming){var i=this._readableState;(r.needTransform||i.needReadable||i.length<i.highWaterMark)&&this._read(i.highWaterMark)}},o.prototype._read=function(e){var t=this._transformState;null!==t.writechunk&&t.writecb&&!t.transforming?(t.transforming=!0,this._transform(t.writechunk,t.writeencoding,t.afterTransform)):t.needTransform=!0}},{"./_stream_duplex":27,"core-util-is":11,inherits:19}],31:[function(e,t,n){(function(n){"use strict";function r(){}function i(e,t,n){this.chunk=e,this.encoding=t,this.callback=n,this.next=null}function o(t,n){N=N||e("./_stream_duplex"),t=t||{},this.objectMode=!!t.objectMode,n instanceof N&&(this.objectMode=this.objectMode||!!t.writableObjectMode);var r=t.highWaterMark,i=this.objectMode?16:16384;this.highWaterMark=r||0===r?r:i,this.highWaterMark=~~this.highWaterMark,this.needDrain=!1,this.ending=!1,this.ended=!1,this.finished=!1;var o=t.decodeStrings===!1;this.decodeStrings=!o,this.defaultEncoding=t.defaultEncoding||"utf8",this.length=0,this.writing=!1,this.corked=0,this.sync=!0,this.bufferProcessing=!1,this.onwrite=function(e){d(n,e)},this.writecb=null,this.writelen=0,this.bufferedRequest=null,this.lastBufferedRequest=null,this.pendingcb=0,this.prefinished=!1,this.errorEmitted=!1,this.bufferedRequestCount=0,this.corkedRequestsFree=new b(this)}function s(t){return N=N||e("./_stream_duplex"),this instanceof s||this instanceof N?(this._writableState=new o(t,this),this.writable=!0,t&&("function"==typeof t.write&&(this._write=t.write),"function"==typeof t.writev&&(this._writev=t.writev)),void A.call(this)):new s(t)}function a(e,t){var n=new Error("write after end");e.emit("error",n),S(t,n)}function u(e,t,n,r){var i=!0,o=!1;return null===n?o=new TypeError("May not write null values to stream"):I.isBuffer(n)||"string"==typeof n||void 0===n||t.objectMode||(o=new TypeError("Invalid non-string/buffer chunk")),o&&(e.emit("error",o),S(r,o),i=!1),i}function f(e,t,n){return e.objectMode||e.decodeStrings===!1||"string"!=typeof t||(t=L.from(t,n)),t}function c(e,t,n,r,o){n=f(t,n,r),I.isBuffer(n)&&(r="buffer");var s=t.objectMode?1:n.length;t.length+=s;var a=t.length<t.highWaterMark;if(a||(t.needDrain=!0),t.writing||t.corked){var u=t.lastBufferedRequest;t.lastBufferedRequest=new i(n,r,o),u?u.next=t.lastBufferedRequest:t.bufferedRequest=t.lastBufferedRequest,t.bufferedRequestCount+=1}else l(e,t,!1,s,n,r,o);return a}function l(e,t,n,r,i,o,s){t.writelen=r,t.writecb=s,t.writing=!0,t.sync=!0,n?e._writev(i,t.onwrite):e._write(i,o,t.onwrite),t.sync=!1}function h(e,t,n,r,i){--t.pendingcb,n?S(i,r):i(r),e._writableState.errorEmitted=!0,e.emit("error",r)}function p(e){e.writing=!1,e.writecb=null,e.length-=e.writelen,e.writelen=0}function d(e,t){var n=e._writableState,r=n.sync,i=n.writecb;if(p(n),t)h(e,n,r,t,i);else{var o=v(n);o||n.corked||n.bufferProcessing||!n.bufferedRequest||_(e,n),r?O(g,e,n,o,i):g(e,n,o,i)}}function g(e,t,n,r){n||y(e,t),t.pendingcb--,r(),E(e,t)}function y(e,t){0===t.length&&t.needDrain&&(t.needDrain=!1,e.emit("drain"))}function _(e,t){t.bufferProcessing=!0;var n=t.bufferedRequest;if(e._writev&&n&&n.next){var r=t.bufferedRequestCount,i=new Array(r),o=t.corkedRequestsFree;o.entry=n;for(var s=0;n;)i[s]=n,n=n.next,s+=1;l(e,t,!0,t.length,i,"",o.finish),t.pendingcb++,t.lastBufferedRequest=null,o.next?(t.corkedRequestsFree=o.next,o.next=null):t.corkedRequestsFree=new b(t)}else{for(;n;){var a=n.chunk,u=n.encoding,f=n.callback,c=t.objectMode?1:a.length;if(l(e,t,!1,c,a,u,f),n=n.next,t.writing)break}null===n&&(t.lastBufferedRequest=null)}t.bufferedRequestCount=0,t.bufferedRequest=n,t.bufferProcessing=!1}function v(e){return e.ending&&0===e.length&&null===e.bufferedRequest&&!e.finished&&!e.writing}function m(e,t){t.prefinished||(t.prefinished=!0,e.emit("prefinish"))}function E(e,t){var n=v(t);return n&&(0===t.pendingcb?(m(e,t),t.finished=!0,e.emit("finish")):m(e,t)),n}function w(e,t,n){t.ending=!0,E(e,t),n&&(t.finished?S(n):e.once("finish",n)),t.ended=!0,e.writable=!1}function b(e){var t=this;this.next=null,this.entry=null,this.finish=function(n){var r=t.entry;for(t.entry=null;r;){var i=r.callback;e.pendingcb--,i(n),r=r.next}e.corkedRequestsFree?e.corkedRequestsFree.next=t:e.corkedRequestsFree=t}}t.exports=s;var S=e("process-nextick-args"),O=!n.browser&&["v0.10","v0.9."].indexOf(n.version.slice(0,5))>-1?setImmediate:S;s.WritableState=o;var R=e("core-util-is");R.inherits=e("inherits");var A,T={deprecate:e("util-deprecate")};!function(){try{A=e("stream")}catch(t){}finally{A||(A=e("events").EventEmitter)}}();var I=e("buffer").Buffer,L=e("buffer-shims");R.inherits(s,A);var N;o.prototype.getBuffer=function(){for(var e=this.bufferedRequest,t=[];e;)t.push(e),e=e.next;return t},function(){try{Object.defineProperty(o.prototype,"buffer",{get:T.deprecate(function(){return this.getBuffer()},"_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")})}catch(e){}}();var N;s.prototype.pipe=function(){this.emit("error",new Error("Cannot pipe, not readable"))},s.prototype.write=function(e,t,n){var i=this._writableState,o=!1;return"function"==typeof t&&(n=t,t=null),I.isBuffer(e)?t="buffer":t||(t=i.defaultEncoding),"function"!=typeof n&&(n=r),i.ended?a(this,n):u(this,i,e,n)&&(i.pendingcb++,o=c(this,i,e,t,n)),o},s.prototype.cork=function(){var e=this._writableState;e.corked++},s.prototype.uncork=function(){var e=this._writableState;e.corked&&(e.corked--,e.writing||e.corked||e.finished||e.bufferProcessing||!e.bufferedRequest||_(this,e))},s.prototype.setDefaultEncoding=function(e){if("string"==typeof e&&(e=e.toLowerCase()),!(["hex","utf8","utf-8","ascii","binary","base64","ucs2","ucs-2","utf16le","utf-16le","raw"].indexOf((e+"").toLowerCase())>-1))throw new TypeError("Unknown encoding: "+e);return this._writableState.defaultEncoding=e,this},s.prototype._write=function(e,t,n){n(new Error("not implemented"))},s.prototype._writev=null,s.prototype.end=function(e,t,n){var r=this._writableState;"function"==typeof e?(n=e,e=null,t=null):"function"==typeof t&&(n=t,t=null),null!==e&&void 0!==e&&this.write(e,t),r.corked&&(r.corked=1,this.uncork()),r.ending||r.finished||w(this,r,n)}}).call(this,e("_process"))},{"./_stream_duplex":27,_process:25,buffer:7,"buffer-shims":6,"core-util-is":11,events:12,inherits:19,"process-nextick-args":24,"util-deprecate":42}],32:[function(e,t,n){t.exports=e("./lib/_stream_passthrough.js")},{"./lib/_stream_passthrough.js":28}],33:[function(e,t,n){(function(r){var i=function(){try{return e("stream")}catch(t){}}();n=t.exports=e("./lib/_stream_readable.js"),n.Stream=i||n,n.Readable=n,n.Writable=e("./lib/_stream_writable.js"),n.Duplex=e("./lib/_stream_duplex.js"),n.Transform=e("./lib/_stream_transform.js"),n.PassThrough=e("./lib/_stream_passthrough.js"),!r.browser&&"disable"===r.env.READABLE_STREAM&&i&&(t.exports=i)}).call(this,e("_process"))},{"./lib/_stream_duplex.js":27,"./lib/_stream_passthrough.js":28,"./lib/_stream_readable.js":29,"./lib/_stream_transform.js":30,"./lib/_stream_writable.js":31,_process:25}],34:[function(e,t,n){t.exports=e("./lib/_stream_transform.js")},{"./lib/_stream_transform.js":30}],35:[function(e,t,n){t.exports=e("./lib/_stream_writable.js")},{"./lib/_stream_writable.js":31}],36:[function(e,t,n){(function(e){function n(){function t(c){c&&!a&&(a=c);for(var l=arguments.length,h=1;h<l;h++)void 0!==arguments[h]&&(s[h-1]=(s[h-1]||[]).concat(arguments[h]));if(r.length>u){var p=r.slice(u);f+=(r.length-u)*o,u=r.length,e.nextTick(function(){p.forEach(function(e){n.forEach(function(n){n(e,t)})})})}0===--f&&i.apply(null,[a].concat(s))}var n=Array.prototype.slice.call(arguments),r=n.shift()||[],i=n.pop();if("function"!=typeof i)throw new Error("No callback provided to asyncMap");if(!r)return i(null,[]);Array.isArray(r)||(r=[r]);var o=n.length,s=[],a=null,u=r.length,f=u*o;return f?void r.forEach(function(e){n.forEach(function(n){n(e,t)})}):i(null,[])}t.exports=n}).call(this,e("_process"))},{_process:25}],37:[function(e,t,n){function r(){var e,t=Array.prototype.slice.call(arguments),n=null;return"object"==typeof t[0]?(n=t.shift(),e=t.shift(),"string"==typeof e&&(e=n[e])):e=t.shift(),function(r){e.apply(n,t.concat(r))}}t.exports=r},{}],38:[function(e,t,n){function r(e,t){var n=[];!function o(s,a){return s>=a?t(null,n):(Array.isArray(e[s])&&(e[s]=i.apply(null,e[s].map(function(e){return e===r.first?n[0]:e===r.last?n[n.length-1]:e}))),e[s]?void e[s](function(e,r){return e?t(e,n):(void 0!==r&&(n=n.concat(r)),void o(s+1,a))}):o(s+1,a))}(0,e.length)}t.exports=r;var i=e("./bind-actor.js");r.first={},r.last={}},{"./bind-actor.js":37}],39:[function(e,t,n){n.asyncMap=e("./async-map"),n.bindActor=e("./bind-actor"),n.chain=e("./chain")},{"./async-map":36,"./bind-actor":37,"./chain":38}],40:[function(e,t,n){function r(){i.call(this)}t.exports=r;var i=e("events").EventEmitter,o=e("inherits");o(r,i),r.Readable=e("readable-stream/readable.js"),r.Writable=e("readable-stream/writable.js"),r.Duplex=e("readable-stream/duplex.js"),r.Transform=e("readable-stream/transform.js"),r.PassThrough=e("readable-stream/passthrough.js"),r.Stream=r,r.prototype.pipe=function(e,t){function n(t){e.writable&&!1===e.write(t)&&f.pause&&f.pause()}function r(){f.readable&&f.resume&&f.resume()}function o(){c||(c=!0,e.end())}function s(){c||(c=!0,"function"==typeof e.destroy&&e.destroy())}function a(e){if(u(),0===i.listenerCount(this,"error"))throw e}function u(){f.removeListener("data",n),e.removeListener("drain",r),f.removeListener("end",o),f.removeListener("close",s),f.removeListener("error",a),e.removeListener("error",a),f.removeListener("end",u),f.removeListener("close",u),e.removeListener("close",u)}var f=this;f.on("data",n),e.on("drain",r),e._isStdio||t&&t.end===!1||(f.on("end",o),f.on("close",s));var c=!1;return f.on("error",a),e.on("error",a),f.on("end",u),f.on("close",u),e.on("close",u),e.emit("pipe",f),e}},{events:12,inherits:19,"readable-stream/duplex.js":26,"readable-stream/passthrough.js":32,"readable-stream/readable.js":33,"readable-stream/transform.js":34,"readable-stream/writable.js":35}],41:[function(e,t,n){function r(e){if(e&&!u(e))throw new Error("Unknown encoding: "+e)}function i(e){return e.toString(this.encoding)}function o(e){this.charReceived=e.length%2,this.charLength=this.charReceived?2:0}function s(e){this.charReceived=e.length%3,this.charLength=this.charReceived?3:0}var a=e("buffer").Buffer,u=a.isEncoding||function(e){switch(e&&e.toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":case"raw":return!0;default:return!1}},f=n.StringDecoder=function(e){switch(this.encoding=(e||"utf8").toLowerCase().replace(/[-_]/,""),r(e),this.encoding){case"utf8":this.surrogateSize=3;break;case"ucs2":case"utf16le":this.surrogateSize=2,this.detectIncompleteChar=o;break;case"base64":this.surrogateSize=3,this.detectIncompleteChar=s;break;default:return void(this.write=i)}this.charBuffer=new a(6),this.charReceived=0,this.charLength=0};f.prototype.write=function(e){for(var t="";this.charLength;){var n=e.length>=this.charLength-this.charReceived?this.charLength-this.charReceived:e.length;if(e.copy(this.charBuffer,this.charReceived,0,n),this.charReceived+=n,this.charReceived<this.charLength)return"";e=e.slice(n,e.length),t=this.charBuffer.slice(0,this.charLength).toString(this.encoding);var r=t.charCodeAt(t.length-1);if(!(r>=55296&&r<=56319)){if(this.charReceived=this.charLength=0,0===e.length)return t;break}this.charLength+=this.surrogateSize,t=""}this.detectIncompleteChar(e);var i=e.length;this.charLength&&(e.copy(this.charBuffer,0,e.length-this.charReceived,i),i-=this.charReceived),t+=e.toString(this.encoding,0,i);var i=t.length-1,r=t.charCodeAt(i);if(r>=55296&&r<=56319){var o=this.surrogateSize;return this.charLength+=o,this.charReceived+=o,this.charBuffer.copy(this.charBuffer,o,0,o),e.copy(this.charBuffer,0,0,o),t.substring(0,i)}return t},f.prototype.detectIncompleteChar=function(e){for(var t=e.length>=3?3:e.length;t>0;t--){var n=e[e.length-t];if(1==t&&n>>5==6){this.charLength=2;break}if(t<=2&&n>>4==14){this.charLength=3;break}if(t<=3&&n>>3==30){this.charLength=4;break}}this.charReceived=t},f.prototype.end=function(e){var t="";if(e&&e.length&&(t=this.write(e)),this.charReceived){var n=this.charReceived,r=this.charBuffer,i=this.encoding;t+=r.slice(0,n).toString(i)}return t}},{buffer:7}],42:[function(e,t,n){(function(e){function n(e,t){function n(){if(!i){if(r("throwDeprecation"))throw new Error(t);r("traceDeprecation")?console.trace(t):console.warn(t),i=!0}return e.apply(this,arguments)}if(r("noDeprecation"))return e;var i=!1;return n}function r(t){try{if(!e.localStorage)return!1}catch(n){return!1}var r=e.localStorage[t];return null!=r&&"true"===String(r).toLowerCase()}t.exports=n}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}],43:[function(e,t,n){t.exports=function(e){return e&&"object"==typeof e&&"function"==typeof e.copy&&"function"==typeof e.fill&&"function"==typeof e.readUInt8}},{}],44:[function(e,t,n){(function(t,r){function i(e,t){var r={seen:[],stylize:s};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),g(t)?r.showHidden=t:t&&n._extend(r,t),w(r.showHidden)&&(r.showHidden=!1),w(r.depth)&&(r.depth=2),w(r.colors)&&(r.colors=!1),w(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=o),u(r,e,r.depth)}function o(e,t){var n=i.styles[t];return n?"["+i.colors[n][0]+"m"+e+"["+i.colors[n][1]+"m":e}function s(e,t){return e}function a(e){var t={};return e.forEach(function(e,n){t[e]=!0}),t}function u(e,t,r){if(e.customInspect&&t&&A(t.inspect)&&t.inspect!==n.inspect&&(!t.constructor||t.constructor.prototype!==t)){var i=t.inspect(r,e);return m(i)||(i=u(e,i,r)),i}var o=f(e,t);if(o)return o;var s=Object.keys(t),g=a(s);if(e.showHidden&&(s=Object.getOwnPropertyNames(t)),R(t)&&(s.indexOf("message")>=0||s.indexOf("description")>=0))return c(t);if(0===s.length){if(A(t)){var y=t.name?": "+t.name:"";return e.stylize("[Function"+y+"]","special")}if(b(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp");if(O(t))return e.stylize(Date.prototype.toString.call(t),"date");if(R(t))return c(t)}var _="",v=!1,E=["{","}"];if(d(t)&&(v=!0,E=["[","]"]),A(t)){var w=t.name?": "+t.name:"";_=" [Function"+w+"]"}if(b(t)&&(_=" "+RegExp.prototype.toString.call(t)),O(t)&&(_=" "+Date.prototype.toUTCString.call(t)),R(t)&&(_=" "+c(t)),0===s.length&&(!v||0==t.length))return E[0]+_+E[1];if(r<0)return b(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special");e.seen.push(t);var S;return S=v?l(e,t,r,g,s):s.map(function(n){return h(e,t,r,g,n,v)}),e.seen.pop(),p(S,_,E)}function f(e,t){if(w(t))return e.stylize("undefined","undefined");if(m(t)){var n="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(n,"string")}return v(t)?e.stylize(""+t,"number"):g(t)?e.stylize(""+t,"boolean"):y(t)?e.stylize("null","null"):void 0}function c(e){return"["+Error.prototype.toString.call(e)+"]"}function l(e,t,n,r,i){for(var o=[],s=0,a=t.length;s<a;++s)P(t,String(s))?o.push(h(e,t,n,r,String(s),!0)):o.push("");return i.forEach(function(i){i.match(/^\d+$/)||o.push(h(e,t,n,r,i,!0))}),o}function h(e,t,n,r,i,o){var s,a,f;if(f=Object.getOwnPropertyDescriptor(t,i)||{value:t[i]},f.get?a=f.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):f.set&&(a=e.stylize("[Setter]","special")),P(r,i)||(s="["+i+"]"),a||(e.seen.indexOf(f.value)<0?(a=y(n)?u(e,f.value,null):u(e,f.value,n-1),a.indexOf("\n")>-1&&(a=o?a.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+a.split("\n").map(function(e){return"   "+e}).join("\n"))):a=e.stylize("[Circular]","special")),w(s)){if(o&&i.match(/^\d+$/))return a;s=JSON.stringify(""+i),s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(s=s.substr(1,s.length-2),s=e.stylize(s,"name")):(s=s.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),s=e.stylize(s,"string"))}return s+": "+a}function p(e,t,n){var r=0,i=e.reduce(function(e,t){return r++,t.indexOf("\n")>=0&&r++,e+t.replace(/\u001b\[\d\d?m/g,"").length+1},0);return i>60?n[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+n[1]:n[0]+t+" "+e.join(", ")+" "+n[1]}function d(e){return Array.isArray(e)}function g(e){return"boolean"==typeof e}function y(e){return null===e}function _(e){return null==e}function v(e){return"number"==typeof e}function m(e){return"string"==typeof e}function E(e){return"symbol"==typeof e}function w(e){return void 0===e}function b(e){return S(e)&&"[object RegExp]"===I(e)}function S(e){return"object"==typeof e&&null!==e}function O(e){return S(e)&&"[object Date]"===I(e)}function R(e){return S(e)&&("[object Error]"===I(e)||e instanceof Error)}function A(e){return"function"==typeof e}function T(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||"undefined"==typeof e}function I(e){return Object.prototype.toString.call(e)}function L(e){return e<10?"0"+e.toString(10):e.toString(10)}function N(){var e=new Date,t=[L(e.getHours()),L(e.getMinutes()),L(e.getSeconds())].join(":");return[e.getDate(),D[e.getMonth()],t].join(" ")}function P(e,t){return Object.prototype.hasOwnProperty.call(e,t)}var C=/%[sdj%]/g;n.format=function(e){if(!m(e)){for(var t=[],n=0;n<arguments.length;n++)t.push(i(arguments[n]));return t.join(" ")}for(var n=1,r=arguments,o=r.length,s=String(e).replace(C,function(e){if("%%"===e)return"%";if(n>=o)return e;switch(e){case"%s":return String(r[n++]);case"%d":return Number(r[n++]);case"%j":try{return JSON.stringify(r[n++])}catch(t){return"[Circular]"}default:return e}}),a=r[n];n<o;a=r[++n])s+=y(a)||!S(a)?" "+a:" "+i(a);return s},n.deprecate=function(e,i){function o(){if(!s){if(t.throwDeprecation)throw new Error(i);t.traceDeprecation?console.trace(i):console.error(i),s=!0}return e.apply(this,arguments)}if(w(r.process))return function(){return n.deprecate(e,i).apply(this,arguments)};if(t.noDeprecation===!0)return e;var s=!1;return o};var M,x={};n.debuglog=function(e){if(w(M)&&(M=t.env.NODE_DEBUG||""),e=e.toUpperCase(),!x[e])if(new RegExp("\\b"+e+"\\b","i").test(M)){var r=t.pid;x[e]=function(){var t=n.format.apply(n,arguments);console.error("%s %d: %s",e,r,t)}}else x[e]=function(){};return x[e]},n.inspect=i,i.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},i.styles={special:"cyan",number:"yellow","boolean":"yellow",undefined:"grey","null":"bold",string:"green",date:"magenta",regexp:"red"},n.isArray=d,n.isBoolean=g,n.isNull=y,n.isNullOrUndefined=_,n.isNumber=v,n.isString=m,n.isSymbol=E,n.isUndefined=w,n.isRegExp=b,n.isObject=S,n.isDate=O,n.isError=R,n.isFunction=A,n.isPrimitive=T,n.isBuffer=e("./support/isBuffer");var D=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];n.log=function(){console.log("%s - %s",N(),n.format.apply(n,arguments))},n.inherits=e("inherits"),n._extend=function(e,t){if(!t||!S(t))return e;for(var n=Object.keys(t),r=n.length;r--;)e[n[r]]=t[n[r]];return e}}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":43,_process:25,inherits:19}],45:[function(e,t,n){(function(n,r){"use strict";function i(){for(var e=new a,t=0;t<arguments.length;++t)e.hash(""+arguments[t]);return e.result()}var o=e("graceful-fs"),s=e("slide").chain,a=e("imurmurhash"),u=0,f=function(e){return e+"."+i(r,n.pid,++u)};t.exports=function(e,t,n,r){n instanceof Function&&(r=n,n=null),n||(n={});var i=f(e);s([[o,o.writeFile,i,t,n],n.chown&&[o,o.chown,i,n.chown.uid,n.chown.gid],[o,o.rename,i,e]],function(e){e?o.unlink(i,function(){r(e)}):r()})},t.exports.sync=function(e,t,n){n||(n={});var r=f(e);try{o.writeFileSync(r,t,n),n.chown&&o.chownSync(r,n.chown.uid,n.chown.gid),o.renameSync(r,e)}catch(i){try{o.unlinkSync(r)}catch(s){}throw i}}}).call(this,e("_process"),"/node_modules/write-file-atomic/index.js")},{_process:25,"graceful-fs":14,imurmurhash:18,slide:39}],46:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(n,"__esModule",{value:!0});var i=e("babel-runtime/core-js/json/stringify"),o=r(i),s=e("./universal-localstorage"),a=r(s),u={set:function(e,t,n){a["default"].setItem(e,(0,o["default"])({version:t,value:n}))},get:function(e){try{return JSON.parse(a["default"].getItem(e)).value}catch(t){}},getVersion:function(e){try{return JSON.parse(a["default"].getItem(e)).version}catch(t){}},"delete":function(e){a["default"].removeItem(e)}};n["default"]=u,t.exports=n["default"]},{"./universal-localstorage":48,"babel-runtime/core-js/json/stringify":1}],47:[function(e,t,n){"use strict";function r(e){return e&&e.__esModule?e:{"default":e}}var i=e("babel-runtime/core-js/json/stringify"),o=r(i);"undefined"!=typeof window.localStorage&&"undefined"!=typeof window.sessionStorage||function(){var e=function(e){function t(e,t,n){var r,i;n?(r=new Date,r.setTime(r.getTime()+24*n*60*60*1e3),i="; expires="+r.toGMTString()):i="",document.cookie=e+"="+t+i+"; path=/"}function n(e){var t,n,r=e+"=",i=document.cookie.split(";");for(t=0;t<i.length;t++){for(n=i[t];" "==n.charAt(0);)n=n.substring(1,n.length);if(0==n.indexOf(r))return n.substring(r.length,n.length)}return null}function r(n){n=(0,o["default"])(n),"session"==e?window.name=n:t("localStorage",n,365)}function i(){"session"==e?window.name="":t("localStorage","",365)}function s(){var t="session"==e?window.name:n("localStorage");return t?JSON.parse(t):{}}var a=s();return{length:0,clear:function(){a={},this.length=0,i()},getItem:function(e){return void 0===a[e]?null:a[e]},key:function(e){var t=0;for(var n in a){if(t==e)return n;t++}return null},removeItem:function(e){delete a[e],this.length--,r(a)},setItem:function(e,t){a[e]=t+"",this.length++,r(a)}}};"undefined"==typeof window.localStorage&&(window.localStorage=new e("local")),"undefined"==typeof window.sessionStorage&&(window.sessionStorage=new e("session"))}()},{"babel-runtime/core-js/json/stringify":1}],48:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=void 0;if("undefined"==typeof window){var i=e("node-localstorage").LocalStorage;r=new i("./uls-scratch")}else r="undefined"==typeof window.localStorage||"undefined"==typeof window.sessionStorage?e("./rem-localstorage"):window.localStorage;n["default"]=r,t.exports=n["default"]},{"./rem-localstorage":47,"node-localstorage":22}]},{},[46])(46)});


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],113:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CombiningAlgorithm = function CombiningAlgorithm() {
  (0, _classCallCheck3.default)(this, CombiningAlgorithm);
};

exports.default = CombiningAlgorithm;
module.exports = exports["default"];

},{"babel-runtime/helpers/classCallCheck":11}],114:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Operators = function () {
  function Operators() {
    (0, _classCallCheck3.default)(this, Operators);
  }

  (0, _createClass3.default)(Operators, [{
    key: 'and',
    value: function and(params) {
      return params[0] && params[1];
    }
  }, {
    key: 'between',
    value: function between(params) {
      var start = parseInt(params[0][0]);
      var end = parseInt(params[0][1]);
      var now = params[1];

      if (end < start) {
        now = now < start ? now += 2400 : now;
        end += 2400;
      }

      return now > start && now < end;
    }
  }, {
    key: 'equals',
    value: function equals(params) {
      return params[0] == '*' || params[0] == params[1];
    }
  }, {
    key: 'in',
    value: function _in(params) {
      return params[0].indexOf(params[1]) > -1;
    }
  }, {
    key: 'not',
    value: function not(params) {
      return !params[0];
    }
  }, {
    key: 'or',
    value: function or(params) {
      return params[0] || params[1];
    }
  }]);
  return Operators;
}();

exports.default = Operators;
module.exports = exports['default'];

},{"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],115:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Operators = require('./Operators');

var _Operators2 = _interopRequireDefault(_Operators);

var _RuntimeCoreCtx = require('./context/RuntimeCoreCtx');

var _RuntimeCoreCtx2 = _interopRequireDefault(_RuntimeCoreCtx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/
var PDP = function () {
  function PDP(context) {
    (0, _classCallCheck3.default)(this, PDP);

    this.context = context;
    this.operators = new _Operators2.default();
  }

  (0, _createClass3.default)(PDP, [{
    key: 'applyPolicies',
    value: function applyPolicies(message, policies) {
      var result = this.evaluateSPPolicy(message, policies.serviceProviderPolicy);

      if (this.context instanceof _RuntimeCoreCtx2.default && (result || result === 'Not Applicable')) {
        result = this.evaluateUserPolicy(message, policies.userPolicy);
      }

      return result;
    }
  }, {
    key: 'evaluateSPPolicy',
    value: function evaluateSPPolicy(message, policy) {
      var result = void 0;

      if (policy) {
        result = policy.evaluate(this.context, message);
      } else {
        result = 'Not Applicable';
      }

      return result;
    }
  }, {
    key: 'evaluateUserPolicy',
    value: function evaluateUserPolicy(message, title) {
      var result = void 0;

      if (title !== undefined) {
        var policy = this.context.userPolicies[title];

        if (policy) {
          result = policy.evaluate(this.context, message);
        } else {
          result = 'Not Applicable';
        }
      } else {
        result = 'Not Applicable';
      }

      return result;
    }
  }, {
    key: 'context',
    get: function get() {
      return this._context;
    },
    set: function set(context) {
      this._context = context;
    }
  }, {
    key: 'operators',
    get: function get() {
      return this._operators;
    },
    set: function set(operators) {
      this._operators = operators;
    }
  }]);
  return PDP;
}();

exports.default = PDP;
module.exports = exports['default'];

},{"./Operators":114,"./context/RuntimeCoreCtx":125,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],116:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require("babel-runtime/helpers/createClass");

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PEP = function () {
  function PEP(context) {
    (0, _classCallCheck3.default)(this, PEP);

    this.context = context;
  }

  (0, _createClass3.default)(PEP, [{
    key: "enforcePolicies",
    value: function enforcePolicies(message, policies, authDecision) {
      var policy = void 0;

      if (policies.userPolicy) {
        policy = this.context.userPolicies[policies.userPolicy];
        if (policy) {
          policy.enforceActions(this.context, message, authDecision);
        }
      }
      policy = this.context.serviceProviderPolicy;
      if (policy) {
        policy.enforceActions(this.context, message, authDecision);
      }
    }

    /*sendAutomaticMessage() {}
      forwardToID() {}
      forwardToHyperty() {}*/

  }]);
  return PEP;
}();

exports.default = PEP;
module.exports = exports["default"];

},{"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _DenyOverrides = require('./combiningAlgorithms/DenyOverrides');

var _DenyOverrides2 = _interopRequireDefault(_DenyOverrides);

var _FirstApplicable = require('./combiningAlgorithms/FirstApplicable');

var _FirstApplicable2 = _interopRequireDefault(_FirstApplicable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Policy = function () {
  function Policy(key, rules, actions, combiningAlgorithm) {
    (0, _classCallCheck3.default)(this, Policy);

    this.actions = actions;
    this.key = key;
    this.rules = rules;
    this.combiningAlgorithm = combiningAlgorithm;
  }

  (0, _createClass3.default)(Policy, [{
    key: 'enforceActions',
    value: function enforceActions(context, message, authDecision) {
      for (var i in this.actions) {
        context[this.actions[i]](message, authDecision);
      }
    }
  }, {
    key: 'evaluate',
    value: function evaluate(context, message) {
      var results = [];

      for (var i in this.rules) {
        results.push(this.rules[i].evaluate(context, message));
      }

      return this.combiningAlgorithm.evaluate(results);
    }
  }, {
    key: 'combiningAlgorithm',
    get: function get() {
      return this._combiningAlgorithm;
    },
    set: function set(combiningAlgorithm) {
      if (combiningAlgorithm === 'denyOverrides') {
        this._combiningAlgorithm = new _DenyOverrides2.default();
      } else {
        if (combiningAlgorithm === 'firstApplicable') {
          this._combiningAlgorithm = new _FirstApplicable2.default();
        } else {
          throw Error('Unknown algorithm: ' + combiningAlgorithm);
        }
      }
    }
  }]);
  return Policy;
}();

exports.default = Policy;
module.exports = exports['default'];

},{"./combiningAlgorithms/DenyOverrides":119,"./combiningAlgorithms/FirstApplicable":120,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],118:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('../utils/utils');

var _Operators = require('./Operators');

var _Operators2 = _interopRequireDefault(_Operators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Rule = function () {
  function Rule(authorise, condition, priority, scope, target) {
    (0, _classCallCheck3.default)(this, Rule);

    this.operators = new _Operators2.default();
    this.authorise = authorise;
    this.condition = condition;
    this.priority = priority;
    this.scope = scope;
    this.target = target;
  }

  (0, _createClass3.default)(Rule, [{
    key: 'evaluate',
    value: function evaluate(context, message) {
      var hypertyName = void 0;
      switch (this.scope) {
        case 'global':
          break;

        case 'hyperty':
          if ((0, _utils.isDataObjectURL)(message.from)) {
            var reporter = context.runtimeRegistry.getReporterURLSynchonous((0, _utils.removePathFromURL)(message.from));
            if (reporter !== undefined) {
              hypertyName = context.runtimeRegistry.getHypertyName(reporter);
            }
          } else {
            if (message.from.split('://')[0] === 'hyperty') {
              hypertyName = context.runtimeRegistry.getHypertyName((0, _utils.removePathFromURL)(message.from));
            }
          }
          if (hypertyName === this.target) {
            break;
          }

          if ((0, _utils.isDataObjectURL)(message.to)) {
            var _reporter = context.runtimeRegistry.getReporterURLSynchonous((0, _utils.removePathFromURL)(message.to));
            if (_reporter !== undefined) {
              hypertyName = context.runtimeRegistry.getHypertyName(_reporter);
            }
          } else {
            if (message.to.split('://')[0] === 'hyperty') {
              hypertyName = context.runtimeRegistry.getHypertyName((0, _utils.removePathFromURL)(message.to));
            }
          }
          if (hypertyName === this.target) {
            break;
          }

          return 'Not Applicable';

        case 'user':
          var owner = void 0;

          if ((0, _utils.isDataObjectURL)(message.from)) {
            var _reporter2 = context.runtimeRegistry.getReporterURLSynchonous((0, _utils.removePathFromURL)(message.from));
            owner = context.runtimeRegistry.getHypertyOwner(_reporter2);
          } else {
            if (message.from.split('://')[0] === 'hyperty') {
              owner = context.runtimeRegistry.getHypertyOwner((0, _utils.removePathFromURL)(message.from));
            }
          }
          if (owner !== undefined) {
            owner = (0, _utils.getUserEmailFromURL)(owner);
          }
          if (owner === this.target) {
            break;
          }

          if ((0, _utils.isDataObjectURL)(message.to)) {
            var _reporter3 = context.runtimeRegistry.getReporterURLSynchonous((0, _utils.removePathFromURL)(message.to));
            owner = context.runtimeRegistry.getHypertyOwner(_reporter3);
            if (owner !== undefined) {
              owner = (0, _utils.getUserEmailFromURL)(owner);
            }
          } else {
            if (message.to.split('://')[0] === 'hyperty') {
              owner = context.runtimeRegistry.getHypertyOwner((0, _utils.removePathFromURL)(message.to));
              if (owner !== undefined) {
                owner = (0, _utils.getUserEmailFromURL)(owner);
              }
            }
          }
          if (owner === this.target) {
            break;
          }

          return 'Not Applicable';
      }
      if (this.condition.isApplicable(context, message, this.scope, this.target)) {
        return this.authorise;
      } else {
        return 'Not Applicable';
      }
    }
  }]);
  return Rule;
}();

exports.default = Rule;
module.exports = exports['default'];

},{"../utils/utils":127,"./Operators":114,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _CombiningAlgorithm2 = require('../CombiningAlgorithm');

var _CombiningAlgorithm3 = _interopRequireDefault(_CombiningAlgorithm2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DenyOverrides = function (_CombiningAlgorithm) {
  (0, _inherits3.default)(DenyOverrides, _CombiningAlgorithm);

  function DenyOverrides() {
    (0, _classCallCheck3.default)(this, DenyOverrides);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(DenyOverrides).apply(this, arguments));
  }

  (0, _createClass3.default)(DenyOverrides, [{
    key: 'evaluate',
    value: function evaluate(individualResults) {
      if (individualResults.indexOf(false) !== -1) {
        return false;
      } else {
        if (individualResults.indexOf(true) !== -1) {
          return true;
        } else {
          return 'Not Applicable';
        }
      }
    }
  }]);
  return DenyOverrides;
}(_CombiningAlgorithm3.default);

exports.default = DenyOverrides;
module.exports = exports['default'];

},{"../CombiningAlgorithm":113,"babel-runtime/core-js/object/get-prototype-of":5,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],120:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _CombiningAlgorithm2 = require('../CombiningAlgorithm');

var _CombiningAlgorithm3 = _interopRequireDefault(_CombiningAlgorithm2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var FirstApplicable = function (_CombiningAlgorithm) {
  (0, _inherits3.default)(FirstApplicable, _CombiningAlgorithm);

  function FirstApplicable() {
    (0, _classCallCheck3.default)(this, FirstApplicable);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(FirstApplicable).apply(this, arguments));
  }

  (0, _createClass3.default)(FirstApplicable, [{
    key: 'evaluate',
    value: function evaluate(individualResults) {
      for (var i in individualResults) {
        if (individualResults[i] !== 'Not Applicable') {
          return individualResults[i];
        }
      }

      return 'Not Applicable';
    }
  }]);
  return FirstApplicable;
}(_CombiningAlgorithm3.default);

exports.default = FirstApplicable;
module.exports = exports['default'];

},{"../CombiningAlgorithm":113,"babel-runtime/core-js/object/get-prototype-of":5,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],121:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Condition = require('./Condition');

var _Condition2 = _interopRequireDefault(_Condition);

var _Operators = require('../Operators');

var _Operators2 = _interopRequireDefault(_Operators);

var _SubscriptionCondition = require('./SubscriptionCondition');

var _SubscriptionCondition2 = _interopRequireDefault(_SubscriptionCondition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AdvancedCondition = function () {
  function AdvancedCondition(condition) {
    (0, _classCallCheck3.default)(this, AdvancedCondition);

    this.operators = new _Operators2.default();
    this.condition = condition;
  }

  (0, _createClass3.default)(AdvancedCondition, [{
    key: 'isApplicable',
    value: function isApplicable(context, message, scope, target, operator, left, right) {
      if (!operator) {
        operator = this.condition[0];
        left = this.condition[1];
        right = this.condition[2];
      }

      while (!(left instanceof _Condition2.default) & !(left instanceof _SubscriptionCondition2.default) & typeof left !== 'boolean') {
        left = this.isApplicable(context, message, scope, target, left[0], left[1], left[2]);
      }
      if (right !== undefined) {
        while (!(right instanceof _Condition2.default) & !(right instanceof _SubscriptionCondition2.default) & typeof right !== 'boolean') {
          right = this.isApplicable(context, message, scope, target, right[0], right[1], right[2]);
        }
      }

      var resultLeft = typeof left === 'boolean' ? left : left.isApplicable(context, message, scope, target);
      var resultRight = void 0;
      if (right !== undefined) {
        resultRight = typeof right === 'boolean' ? right : right.isApplicable(context, message, scope, target);
      }
      return this.operators[operator]([resultLeft, resultRight]);
    }
  }]);
  return AdvancedCondition;
}();

exports.default = AdvancedCondition;
module.exports = exports['default'];

},{"../Operators":114,"./Condition":122,"./SubscriptionCondition":123,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],122:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Operators = require('../Operators');

var _Operators2 = _interopRequireDefault(_Operators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Condition = function () {
  function Condition(attribute, operator, params) {
    (0, _classCallCheck3.default)(this, Condition);

    this.attribute = attribute;
    this.operator = operator;
    this.params = params;
    this.operators = new _Operators2.default();
  }

  (0, _createClass3.default)(Condition, [{
    key: 'isApplicable',
    value: function isApplicable(context, message) {
      context[this.attribute] = { message: message };
      var value = context[this.attribute];
      var tempParam = void 0;
      if (this.operator === 'in') {
        if (this.params === 'preauthorised') {
          var dataObjectURL = message.to.split('/');
          dataObjectURL.pop();
          dataObjectURL = dataObjectURL[0] + '//' + dataObjectURL[2];
          tempParam = context.runtimeRegistry.getPreAuthSubscribers(dataObjectURL);
        } else {
          tempParam = context.policyEngine.getGroup(this.params);
        }
      }
      if (!tempParam) {
        return this.operators[this.operator]([this.params, value]);
      } else {
        return this.operators[this.operator]([tempParam, value]);
      }
    }
  }]);
  return Condition;
}();

exports.default = Condition;
module.exports = exports['default'];

},{"../Operators":114,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],123:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _Condition2 = require('./Condition');

var _Condition3 = _interopRequireDefault(_Condition2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SubscriptionCondition = function (_Condition) {
  (0, _inherits3.default)(SubscriptionCondition, _Condition);

  function SubscriptionCondition(attribute, operator, params) {
    (0, _classCallCheck3.default)(this, SubscriptionCondition);
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(SubscriptionCondition).call(this, attribute, operator, params));
  }

  (0, _createClass3.default)(SubscriptionCondition, [{
    key: 'isApplicable',
    value: function isApplicable(context, message, scope, target) {
      var isSubscription = message.type === 'subscribe';
      var isFromRemoteSM = context.isFromRemoteSM(message.from);
      if (isSubscription & isFromRemoteSM) {
        return (0, _get3.default)((0, _getPrototypeOf2.default)(SubscriptionCondition.prototype), 'isApplicable', this).call(this, context, message);
      } else {
        return false;
      }
    }
  }]);
  return SubscriptionCondition;
}(_Condition3.default);

exports.default = SubscriptionCondition;
module.exports = exports['default'];

},{"./Condition":122,"babel-runtime/core-js/object/get-prototype-of":5,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/get":13,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],124:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _utils = require('../../utils/utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var CommonCtx = function () {
  function CommonCtx() {
    (0, _classCallCheck3.default)(this, CommonCtx);

    this.defaultBehavior = true;
    this.groups = {};
  }

  (0, _createClass3.default)(CommonCtx, [{
    key: 'defaultBehavior',
    get: function get() {
      return this._defaultBehavior;
    },
    set: function set(behavior) {
      this._defaultBehavior = behavior;
    }
  }, {
    key: 'date',
    set: function set(now) {
      var date = new Date();
      var day = String(date.getDate());
      if (day.length === 1) {
        day = '0' + day;
      }
      var month = String(date.getMonth() + 1);
      if (month.length === 1) {
        month = '0' + month;
      }

      this._date = day + '/' + month + '/' + date.getFullYear();
    },
    get: function get() {
      return this._date;
    }
  }, {
    key: 'domain',
    set: function set(params) {
      if (params.message.body.identity !== undefined) {
        this._domain = (0, _utils.divideEmail)(params.message.body.identity.userProfile.username).domain;
      }
    },
    get: function get() {
      return this._domain;
    }
  }, {
    key: 'source',
    set: function set(params) {
      if (params.message.body.identity !== undefined) {
        this._source = params.message.body.identity.userProfile.username;
      }
    },
    get: function get() {
      var _this = this;
      return _this._source;
    }
  }, {
    key: 'time',
    set: function set(now) {
      now = new Date();
      var minutes = String(now.getMinutes());
      if (minutes.length === 1) {
        minutes = '0' + minutes;
      }
      this._time = parseInt(String(now.getHours()) + minutes);
    },
    get: function get() {
      var _this = this;
      return _this._time;
    }
  }, {
    key: 'weekday',
    set: function set(now) {
      this._weekday = String(new Date().getDay());
    },
    get: function get() {
      return this._weekday;
    }
  }]);
  return CommonCtx;
}();

exports.default = CommonCtx;
module.exports = exports['default'];

},{"../../utils/utils":127,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}],125:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _CommonCtx2 = require('./CommonCtx');

var _CommonCtx3 = _interopRequireDefault(_CommonCtx2);

var _Condition = require('../conditions/Condition');

var _Condition2 = _interopRequireDefault(_Condition);

var _utils = require('../../utils/utils');

var _PersistenceManager = require('service-framework/dist/PersistenceManager');

var _PersistenceManager2 = _interopRequireDefault(_PersistenceManager);

var _Rule = require('../Rule');

var _Rule2 = _interopRequireDefault(_Rule);

var _UserPolicy = require('../policies/UserPolicy');

var _UserPolicy2 = _interopRequireDefault(_UserPolicy);

var _SubscriptionCondition = require('../conditions/SubscriptionCondition');

var _SubscriptionCondition2 = _interopRequireDefault(_SubscriptionCondition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RuntimeCoreCtx = function (_CommonCtx) {
  (0, _inherits3.default)(RuntimeCoreCtx, _CommonCtx);

  function RuntimeCoreCtx(idModule, runtimeRegistry) {
    (0, _classCallCheck3.default)(this, RuntimeCoreCtx);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(RuntimeCoreCtx).call(this));

    _this2.idModule = idModule;
    _this2.runtimeRegistry = runtimeRegistry;
    _this2.activeUserPolicy = undefined;
    _this2.serviceProviderPolicies = {};
    _this2.userPolicies = {};
    return _this2;
  }

  (0, _createClass3.default)(RuntimeCoreCtx, [{
    key: 'authorise',
    value: function authorise(message) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        console.log('--- Policy Engine ---');
        console.log(message);
        message.body = message.body || {};
        var result = void 0;
        var isToVerify = _this._isToVerify(message);
        var isIncomingMessage = _this._isIncomingMessage(message);
        var isToCypher = _this._isToCypherModule(message);
        if (isToVerify) {
          if (isIncomingMessage) {
            if (isToCypher) {
              _this.decrypt(message).then(function (message) {
                var policies = {
                  serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                  userPolicy: _this.activeUserPolicy
                };
                result = _this.policyEngine.pdp.applyPolicies(message, policies);
                _this.policyEngine.pep.enforcePolicies(message, policies, result);
                if (result === 'Not Applicable') {
                  result = _this.defaultBehavior;
                  message.body.auth = false;
                }
                if (result) {
                  var isSubscription = message.type === 'subscribe';
                  var isFromRemoteSM = _this.isFromRemoteSM(message.from);
                  if (isSubscription & isFromRemoteSM) {
                    _this.registerSubscriber(message);
                    _this.doMutualAuthentication(message);
                  }
                  message.body.auth = message.body.auth === undefined ? true : message.body.auth;
                  resolve(message);
                } else {
                  reject('Message blocked');
                }
              }, function (error) {
                reject(error);
              });
            } else {
              var policies = {
                serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                userPolicy: _this.activeUserPolicy
              };
              result = _this.policyEngine.pdp.applyPolicies(message, policies);
              _this.policyEngine.pep.enforcePolicies(message, policies, result);
              if (result === 'Not Applicable') {
                result = _this.defaultBehavior;
                message.body.auth = false;
              }
              if (result) {
                var isSubscription = message.type === 'subscribe';
                var isFromRemoteSM = _this.isFromRemoteSM(message.from);
                if (isSubscription & isFromRemoteSM) {
                  _this.registerSubscriber(message);
                  _this.doMutualAuthentication(message);
                }
                message.body.auth = message.body.auth === undefined ? true : message.body.auth;
                resolve(message);
              } else {
                reject('Message blocked');
              }
            }
          } else {
            var isToSetID = _this._isToSetID(message);
            if (isToSetID) {
              _this._getIdentity(message).then(function (identity) {
                message.body.identity = identity;
                var policies = {
                  serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                  userPolicy: _this.activeUserPolicy
                };
                result = _this.policyEngine.pdp.applyPolicies(message, policies);
                _this.policyEngine.pep.enforcePolicies(message, policies, result);
                if (result === 'Not Applicable') {
                  result = _this.defaultBehavior;
                  message.body.auth = false;
                }
                if (result) {
                  message.body.auth = message.body.auth === undefined ? true : message.body.auth;
                  if (isToCypher) {
                    _this.encrypt(message).then(function (message) {
                      resolve(message);
                    }, function (error) {
                      reject(error);
                    });
                  } else {
                    resolve(message);
                  }
                } else {
                  reject('Message blocked');
                }
              }, function (error) {
                reject(error);
              });
            } else {
              var _policies = {
                serviceProviderPolicy: _this.getServiceProviderPolicy(message, isIncomingMessage),
                userPolicy: _this.activeUserPolicy
              };
              result = _this.policyEngine.pdp.applyPolicies(message, _policies);
              _this.policyEngine.pep.enforcePolicies(message, _policies, result);
              if (result === 'Not Applicable') {
                result = _this.defaultBehavior;
                message.body.auth = false;
              }
              if (result) {
                message.body.auth = message.body.auth === undefined ? true : message.body.auth;
                resolve(message);
              } else {
                reject('Message blocked');
              }
            }
          }
        } else {
          result = _this.defaultBehavior;
          message.body.auth = false;
          if (result) {
            resolve(message);
          } else {
            reject('Message blocked');
          }
        }
      });
    }
  }, {
    key: 'decrypt',
    value: function decrypt(message) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        _this.idModule.decryptMessage(message).then(function (msg) {
          resolve(msg);
        }, function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'doMutualAuthentication',
    value: function doMutualAuthentication(message) {
      var to = message.to.split('/');
      var subsIndex = to.indexOf('subscription');
      var isDataObjectSubscription = subsIndex !== -1;
      var isFromRemoteSM = this.isFromRemoteSM(message.from);
      if (isDataObjectSubscription & isFromRemoteSM) {
        to.pop();
        var dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
        if (to.length > 4) {
          dataObjectURL = to[0] + '//' + to[2] + '/' + to[3] + '/' + to[4];
        }
        this.idModule.doMutualAuthentication(dataObjectURL, message.body.subscriber);
      }
    }
  }, {
    key: 'encrypt',
    value: function encrypt(message) {
      var _this = this;

      return new _promise2.default(function (resolve, reject) {
        _this.idModule.encryptMessage(message).then(function (msg) {
          resolve(msg);
        }, function (error) {
          reject(error);
        });
      });
    }
  }, {
    key: 'getMyEmails',
    value: function getMyEmails() {
      var identities = this.idModule.getIdentities();
      var emails = [];

      for (var i in identities) {
        emails.push((0, _utils.getUserEmailFromURL)(identities[i].identity));
      }

      return emails;
    }
  }, {
    key: 'getMyHyperties',
    value: function getMyHyperties() {
      var hyperties = this.runtimeRegistry.hypertiesList;
      var hypertiesNames = [];

      for (var i in hyperties) {
        var hypertyName = hyperties[i].objectName;
        if (hypertiesNames.indexOf(hypertyName) === -1) {
          hypertiesNames.push(hypertyName);
        }
      }

      return hypertiesNames;
    }
  }, {
    key: 'getServiceProviderPolicy',
    value: function getServiceProviderPolicy(message, isIncoming) {
      var policy = void 0;

      if (isIncoming) {
        var toHyperty = this.runtimeRegistry.getHypertyName(message.to);
        policy = this.serviceProviderPolicies[toHyperty];
      } else {
        var fromHyperty = this.runtimeRegistry.getHypertyName(message.from);
        policy = this.serviceProviderPolicies[fromHyperty];
      }
      return policy;
    }
  }, {
    key: 'isFromRemoteSM',
    value: function isFromRemoteSM(from) {
      var splitFrom = from.split('://');
      return splitFrom[0] === 'runtime' && from !== this.runtimeRegistry.runtimeURL + '/sm';
    }
  }, {
    key: '_isToSetID',
    value: function _isToSetID(message) {
      var schemasToIgnore = ['domain-idp', 'runtime', 'domain'];
      var splitFrom = message.from.split('://');
      var fromSchema = splitFrom[0];

      return schemasToIgnore.indexOf(fromSchema) === -1;
    }
  }, {
    key: '_isIncomingMessage',
    value: function _isIncomingMessage(message) {
      return message.body.identity ? true : false;
    }
  }, {
    key: 'getURL',
    value: function getURL(url) {
      var splitURL = url.split('/');
      return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
    }
  }, {
    key: '_getIdentity',
    value: function _getIdentity(message) {
      if (message.type === 'update') {
        return this.idModule.getIdentityOfHyperty(message.body.source);
      }

      if (message.type === 'response' && message.body.source !== undefined) {
        return this.idModule.getIdentityOfHyperty(message.body.source);
      }

      if ((0, _utils.divideURL)(message.from).type === 'hyperty') {
        return this.idModule.getIdentityOfHyperty(message.from);
      } else {
        return this.idModule.getIdentityOfHyperty(this.getURL(message.from));
      }
    }
  }, {
    key: '_isToVerify',
    value: function _isToVerify(message) {
      var schemasToIgnore = ['domain-idp', 'hyperty-runtime', 'runtime', 'domain'];
      var splitFrom = message.from.split('://');
      var fromSchema = splitFrom[0];
      var splitTo = message.to.split('://');
      var toSchema = splitTo[0];
      if (fromSchema === message.from || toSchema === message.to) {
        return false;
      }
      return schemasToIgnore.indexOf(fromSchema) === -1 || schemasToIgnore.indexOf(toSchema) === -1;
    }

    //TODO use schemasToIgnore instead

  }, {
    key: '_isToCypherModule',
    value: function _isToCypherModule(message) {
      var isCreate = message.type === 'create';
      var isFromHyperty = (0, _utils.divideURL)(message.from).type === 'hyperty';
      var isToHyperty = (0, _utils.divideURL)(message.to).type === 'hyperty';
      var isToDataObject = (0, _utils.isDataObjectURL)(message.to);
      var isHandshake = message.type === 'handshake';

      return isCreate && isFromHyperty && isToHyperty || isCreate && isFromHyperty && isToDataObject || isHandshake;
    }
  }, {
    key: 'loadActivePolicy',
    value: function loadActivePolicy() {
      this.activeUserPolicy = _PersistenceManager2.default.get('rethink:activePolicy');
    }
  }, {
    key: 'loadGroups',
    value: function loadGroups() {
      var groups = _PersistenceManager2.default.get('rethink:groups');
      if (groups != undefined) {
        this.groups = groups;
      }
    }
  }, {
    key: 'loadSPPolicies',
    value: function loadSPPolicies() {
      var policies = _PersistenceManager2.default.get('rethink:spPolicies');
      if (policies !== undefined) {
        this.serviceProviderPolicies = policies;
      }
    }
  }, {
    key: 'loadUserPolicies',
    value: function loadUserPolicies() {
      var policies = _PersistenceManager2.default.get('rethink:userPolicies');

      if (policies !== undefined) {
        for (var i in policies) {
          var rulesPE = [];
          var rules = policies[i].rules;
          for (var j in rules) {
            var condition = void 0;
            if (rules[j].condition.attribute === 'subscription') {
              condition = new _SubscriptionCondition2.default(rules[j].condition.attribute, rules[j].condition.operator, rules[j].condition.params);
            } else {
              condition = new _Condition2.default(rules[j].condition.attribute, rules[j].condition.operator, rules[j].condition.params);
            }
            rulesPE.push(new _Rule2.default(rules[j].authorise, condition, rules[j].priority, rules[j].scope, rules[j].target));
          }
          this.userPolicies[i] = new _UserPolicy2.default(policies[i].key, rulesPE, policies[i].actions, policies[i].combiningAlgorithm);
        }
      }
    }
  }, {
    key: 'registerSubscriber',
    value: function registerSubscriber(message) {
      var to = message.to.split('/');
      var subsIndex = to.indexOf('subscription');
      var isDataObjectSubscription = subsIndex !== -1;
      var isFromRemoteSM = this.isFromRemoteSM(message.from);

      if (isDataObjectSubscription & isFromRemoteSM) {
        to.pop();
        var dataObjectURL = to[0] + '//' + to[2] + '/' + to[3];
        if (to.length > 4) {
          dataObjectURL = to[0] + '//' + to[2] + '/' + to[3] + '/' + to[4];
        }
        this.runtimeRegistry.registerSubscriber(dataObjectURL, message.body.subscriber);
      }
    }
  }, {
    key: '_getLastComponentOfURL',
    value: function _getLastComponentOfURL(url) {
      var split = url.split('/');
      return split[split.length - 1];
    }
  }, {
    key: 'saveActivePolicy',
    value: function saveActivePolicy() {
      _PersistenceManager2.default.set('rethink:activePolicy', 0, this.activeUserPolicy);
    }
  }, {
    key: 'saveGroups',
    value: function saveGroups() {
      _PersistenceManager2.default.set('rethink:groups', 0, this.groups);
    }
  }, {
    key: 'savePolicies',
    value: function savePolicies(source) {
      switch (source) {
        case 'USER':
          _PersistenceManager2.default.set('rethink:userPolicies', 0, this.userPolicies);
          break;
        case 'SERVICE_PROVIDER':
          _PersistenceManager2.default.set('rethink:spPolicies', 0, this.serviceProviderPolicies);
          break;
      }
    }
  }, {
    key: 'dataObjectScheme',
    get: function get() {
      return this._dataObjectScheme;
    },
    set: function set(params) {
      var from = params.message.from;
      if ((0, _utils.isDataObjectURL)(from)) {
        this._dataObjectScheme = (0, _utils.divideURL)(from).type;
      } else {
        this._dataObjectScheme = undefined;
      }
    }
  }, {
    key: 'subscription',
    get: function get() {
      return this._subscription;
    },
    set: function set(params) {
      this._subscription = params.message.body.subscriber;
    }
  }]);
  return RuntimeCoreCtx;
}(_CommonCtx3.default);

exports.default = RuntimeCoreCtx;
module.exports = exports['default'];

},{"../../utils/utils":127,"../Rule":118,"../conditions/Condition":122,"../conditions/SubscriptionCondition":123,"../policies/UserPolicy":126,"./CommonCtx":124,"babel-runtime/core-js/object/get-prototype-of":5,"babel-runtime/core-js/promise":8,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15,"service-framework/dist/PersistenceManager":112}],126:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _AdvancedCondition = require('../conditions/AdvancedCondition');

var _AdvancedCondition2 = _interopRequireDefault(_AdvancedCondition);

var _Condition = require('../conditions/Condition');

var _Condition2 = _interopRequireDefault(_Condition);

var _Policy2 = require('../Policy');

var _Policy3 = _interopRequireDefault(_Policy2);

var _Rule = require('../Rule');

var _Rule2 = _interopRequireDefault(_Rule);

var _SubscriptionCondition = require('../conditions/SubscriptionCondition');

var _SubscriptionCondition2 = _interopRequireDefault(_SubscriptionCondition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserPolicy = function (_Policy) {
  (0, _inherits3.default)(UserPolicy, _Policy);

  function UserPolicy(key, rules, actions, combiningAlgorithm) {
    (0, _classCallCheck3.default)(this, UserPolicy);

    if (!combiningAlgorithm) {
      combiningAlgorithm = 'denyOverrides';
    }
    return (0, _possibleConstructorReturn3.default)(this, (0, _getPrototypeOf2.default)(UserPolicy).call(this, key, rules, actions, combiningAlgorithm));
  }

  (0, _createClass3.default)(UserPolicy, [{
    key: 'createRule',
    value: function createRule(type, authorise, condition, scope, target, priority) {
      if (!(condition instanceof _Condition2.default)) {
        switch (type) {
          case 'advanced':
            condition = new _AdvancedCondition2.default(condition);
          case 'simple':
            condition = new _Condition2.default(condition[0], condition[1], condition[2]);
            break;
          case 'subscription':
            condition = new _SubscriptionCondition2.default(condition[0], condition[1], condition[2]);
            break;
        }
      }
      if (priority === undefined) {
        priority = this.getLastPriority() + 1;
      }
      var rule = new _Rule2.default(authorise, condition, priority, scope, target);
      this.rules.push(rule);
    }
  }, {
    key: 'deleteRule',
    value: function deleteRule(rule) {
      var indexToRemove = this.rules.indexOf(rule);
      this.rules.splice(indexToRemove, 1);
    }
  }, {
    key: 'getLastPriority',
    value: function getLastPriority() {
      var priorities = [];

      if (this.rules.length !== 0) {
        for (var i in this.rules) {
          priorities.push(this.rules[i].priority);
        }
        return Math.max.apply(Math, priorities);
      } else {
        return -1;
      }
    }
  }, {
    key: 'getRuleByPriority',
    value: function getRuleByPriority(priority) {
      for (var i in this.rules) {
        if (this.rules[i].priority == priority) {
          return this.rules[i];
        }
      }
      throw Error('Rule with priority ' + priority + ' does not exist!');
    }
  }, {
    key: 'hasSubscriptionRule',
    value: function hasSubscriptionRule() {
      for (var i in this.rules) {
        if (this.rules[i].scope !== 'global') {
          continue;
        }
        if (this.rules[i].condition instanceof _SubscriptionCondition2.default) {
          return true;
        } else {
          if (this.rules[i].condition instanceof _AdvancedCondition2.default) {
            for (var j in this.rules[i].condition.condition) {
              if (this.rules[i].condition.condition[j] instanceof _SubscriptionCondition2.default) {
                return true;
              }
            }
          }
        }
      }
      return false;
    }
  }, {
    key: 'sortRules',
    value: function sortRules() {
      return this.rules.sort(function (a, b) {
        var x = a['priority'];var y = b['priority'];
        return x < y ? -1 : x > y ? 1 : 0;
      });
    }
  }]);
  return UserPolicy;
}(_Policy3.default);

exports.default = UserPolicy;
module.exports = exports['default'];

},{"../Policy":117,"../Rule":118,"../conditions/AdvancedCondition":121,"../conditions/Condition":122,"../conditions/SubscriptionCondition":123,"babel-runtime/core-js/object/get-prototype-of":5,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12,"babel-runtime/helpers/inherits":14,"babel-runtime/helpers/possibleConstructorReturn":15}],127:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.divideURL = divideURL;
exports.divideEmail = divideEmail;
exports.emptyObject = emptyObject;
exports.deepClone = deepClone;
exports.removePathFromURL = removePathFromURL;
exports.getUserURLFromEmail = getUserURLFromEmail;
exports.getUserEmailFromURL = getUserEmailFromURL;
exports.convertToUserURL = convertToUserURL;
exports.isDataObjectURL = isDataObjectURL;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
 * Support module with some functions will be useful
 * @module utils
 */

/**
 * @typedef divideURL
 * @type Object
 * @property {string} type The type of URL
 * @property {string} domain The domain of URL
 * @property {string} identity The identity of URL
 */

/**
 * Divide an url in type, domain and identity
 * @param  {URL.URL} url - url address
 * @return {divideURL} the result of divideURL
 */
function divideURL(url) {

  if (!url) throw Error('URL is needed to split');

  // let re = /([a-zA-Z-]*)?:\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;
  var re = /([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
  var subst = '$1,$2,$3';
  var parts = url.replace(re, subst).split(',');

  // If the url has no protocol, the default protocol set is https
  if (parts[0] === url) {
    parts[0] = 'https';
    parts[1] = url;
  }

  var result = {
    type: parts[0],
    domain: parts[1],
    identity: parts[2]
  };

  return result;
}

function divideEmail(email) {
  var indexOfAt = email.indexOf('@');

  var result = {
    username: email.substring(0, indexOfAt),
    domain: email.substring(indexOfAt + 1, email.length)
  };

  return result;
}

/**
 * Check if an Object is empty
 * @param  {Object} object Object to be checked
 * @return {Boolean}       status of Object, empty or not (true|false);
 */
function emptyObject(object) {
  return (0, _keys2.default)(object).length > 0 ? false : true;
}

/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */
function deepClone(obj) {
  //TODO: simple but inefficient JSON deep clone...
  if (obj) return JSON.parse((0, _stringify2.default)(obj));
}

function removePathFromURL(url) {
  var splitURL = url.split('/');
  return splitURL[0] + '//' + splitURL[2] + '/' + splitURL[3];
}

/**
 * Obtains the user URL that corresponds to a given email
 * @param  {string} userEmail The user email
 * @return {URL.URL} userURL The user URL
 */
function getUserURLFromEmail(userEmail) {
  var indexOfAt = userEmail.indexOf('@');
  return 'user://' + userEmail.substring(indexOfAt + 1, userEmail.length) + '/' + userEmail.substring(0, indexOfAt);
}

/**
 * Obtains the user email that corresponds to a given URL
 * @param  {URL.URL} userURL The user URL
 * @return {string} userEmail The user email
 */
function getUserEmailFromURL(userURL) {
  var url = divideURL(userURL);
  return url.identity.replace('/', '') + '@' + url.domain; // identity field has '/exampleID' instead of 'exampleID'
}

/**
 * Check if the user identifier is already in the URL format, if not, convert to URL format
 * @param  {string}   identifier  user identifier
 * @return {string}   userURL    the user URL
 */
function convertToUserURL(identifier) {

  // check if the identifier is already in the url format
  if (identifier.substring(0, 7) === 'user://') {
    var dividedURL = divideURL(identifier);

    //check if the url is well formated
    if (dividedURL.domain && dividedURL.identity) {
      return identifier;
    } else {
      throw 'userURL with wrong format';
    }

    //if not, convert the user email to URL format
  } else {
    return getUserURLFromEmail(identifier);
  }
}

function isDataObjectURL(url) {
  var schemasToIgnore = ['domain-idp', 'runtime', 'domain', 'hyperty'];
  var splitURL = url.split('://');
  var urlSchema = splitURL[0];

  return schemasToIgnore.indexOf(urlSchema) === -1;
}

},{"babel-runtime/core-js/json/stringify":1,"babel-runtime/core-js/object/keys":6}],128:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _PEP = require('./PEP');

var _PEP2 = _interopRequireDefault(_PEP);

var _PDP = require('./PDP');

var _PDP2 = _interopRequireDefault(_PDP);

var _UserPolicy = require('./policies/UserPolicy');

var _UserPolicy2 = _interopRequireDefault(_UserPolicy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PolicyEngine = function () {
  function PolicyEngine(context) {
    (0, _classCallCheck3.default)(this, PolicyEngine);

    this.context = context;
    context.policyEngine = this;
    context.loadActivePolicy();
    context.loadGroups();
    context.loadSPPolicies();
    context.loadUserPolicies();
    this.pdp = new _PDP2.default(context);
    this.pep = new _PEP2.default(context);
  }

  (0, _createClass3.default)(PolicyEngine, [{
    key: 'addPolicy',
    value: function addPolicy(source, key, policy) {
      if (source === 'SERVICE_PROVIDER') {
        this.context.serviceProviderPolicies[key] = policy;
        this.context.savePolicies(source);
      } else {
        if (source === 'USER') {
          if (!policy) {
            policy = new _UserPolicy2.default(key, [], []);
          }
          this.context.userPolicies[key] = policy;
          this.context.savePolicies(source);
        } else {
          throw Error('Unknown policy source: ' + source);
        }
      }
    }
  }, {
    key: 'removePolicy',
    value: function removePolicy(source, key) {
      if (source === '*') {
        this.context.serviceProviderPolicies = {};
        this.context.userPolicies = {};
        this.context.activeUserPolicy = undefined;
      } else {
        if (source === 'SERVICE_PROVIDER') {
          delete this.context.serviceProviderPolicies[key];
        } else {
          if (source === 'USER') {
            delete this.context.userPolicies[key];
            if (key === this.context.activeUserPolicy) {
              this.context.activeUserPolicy = undefined;
            }
          } else {
            throw Error('Unknown policy source: ' + source);
          }
        }
      }

      this.context.savePolicies('USER');
      this.context.savePolicies('SERVICE_PROVIDER');
      this.context.saveActivePolicy();
    }
  }, {
    key: 'removeRule',
    value: function removeRule(key, rule) {
      delete this.context.userPolicies[key][rule.scope][rule.target][rule.condition];
    }
  }, {
    key: 'authorise',
    value: function authorise(message) {
      var _this = this;
      return _this.context.authorise(message);
    }
  }, {
    key: 'getGroupsNames',
    value: function getGroupsNames() {
      var myGroups = this.context.groups;
      var groupsNames = [];
      if (myGroups !== undefined) {
        for (var groupName in myGroups) {
          groupsNames.push(groupName);
        }
      }
      return groupsNames;
    }
  }, {
    key: 'getGroup',
    value: function getGroup(groupName) {
      var myGroups = this.context.groups;
      var members = [];

      if (myGroups[groupName] !== undefined) {
        members = myGroups[groupName];
      }

      return members;
    }

    /**
    * Creates a group with the given name.
    * @param  {String}  groupName
    */

  }, {
    key: 'createGroup',
    value: function createGroup(groupName) {
      this.context.groups[groupName] = [];
      this.context.saveGroups();
    }
  }, {
    key: 'deleteGroup',
    value: function deleteGroup(groupName) {
      delete this.context.groups[groupName];
      this.context.saveGroups();
    }

    /**
    * Adds the given user email to the group with the given name.
    * @param  {String}  userEmail
    * @param  {String}  groupName
    */

  }, {
    key: 'addToGroup',
    value: function addToGroup(groupName, userEmail) {
      var myGroups = this.context.groups;
      if (myGroups[groupName] !== undefined) {
        if (myGroups[groupName].indexOf(userEmail) === -1) {
          myGroups[groupName].push(userEmail);
          this.context.saveGroups();
        }
      } else {
        throw Error('Group "' + groupName + '" does not exist!');
      }
    }
  }, {
    key: 'removeFromGroup',
    value: function removeFromGroup(groupName, userEmail) {
      var group = this.context.groups[groupName];

      group.splice(group.indexOf(userEmail), 1);
      this.context.saveGroups();
    }
  }]);
  return PolicyEngine;
}();

exports.default = PolicyEngine;
module.exports = exports['default'];

},{"./PDP":115,"./PEP":116,"./policies/UserPolicy":126,"babel-runtime/helpers/classCallCheck":11,"babel-runtime/helpers/createClass":12}]},{},[128])(128)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2tleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Zvci1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LWl0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItY2FsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWRldGVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyYXRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2tleW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19saWJyYXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19tZXRhLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvc2VydmljZS1mcmFtZXdvcmsvZGlzdC9QZXJzaXN0ZW5jZU1hbmFnZXIuanMiLCJzcmNcXHBvbGljeVxcQ29tYmluaW5nQWxnb3JpdGhtLmpzIiwic3JjXFxwb2xpY3lcXE9wZXJhdG9ycy5qcyIsInNyY1xccG9saWN5XFxQRFAuanMiLCJzcmNcXHBvbGljeVxcUEVQLmpzIiwic3JjXFxwb2xpY3lcXFBvbGljeS5qcyIsInNyY1xccG9saWN5XFxSdWxlLmpzIiwic3JjXFxwb2xpY3lcXGNvbWJpbmluZ0FsZ29yaXRobXNcXERlbnlPdmVycmlkZXMuanMiLCJzcmNcXHBvbGljeVxcY29tYmluaW5nQWxnb3JpdGhtc1xcRmlyc3RBcHBsaWNhYmxlLmpzIiwic3JjXFxwb2xpY3lcXGNvbmRpdGlvbnNcXEFkdmFuY2VkQ29uZGl0aW9uLmpzIiwic3JjXFxwb2xpY3lcXGNvbmRpdGlvbnNcXENvbmRpdGlvbi5qcyIsInNyY1xccG9saWN5XFxjb25kaXRpb25zXFxTdWJzY3JpcHRpb25Db25kaXRpb24uanMiLCJzcmNcXHBvbGljeVxcY29udGV4dFxcQ29tbW9uQ3R4LmpzIiwic3JjXFxwb2xpY3lcXGNvbnRleHRcXFJ1bnRpbWVDb3JlQ3R4LmpzIiwic3JjXFxwb2xpY3lcXHBvbGljaWVzXFxVc2VyUG9saWN5LmpzIiwic3JjXFx1dGlsc1xcdXRpbHMuanMiLCJzcmNcXHBvbGljeVxcUG9saWN5RW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxU0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BOztBQ0FBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0lDL0JNLGtCOzs7O2tCQUlTLGtCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ0pULFM7Ozs7Ozs7d0JBRUEsTSxFQUFRO0FBQ1YsYUFBTyxPQUFPLENBQVAsS0FBYSxPQUFPLENBQVAsQ0FBcEI7QUFDRDs7OzRCQUVPLE0sRUFBUTtBQUNkLFVBQUksUUFBUSxTQUFTLE9BQU8sQ0FBUCxFQUFVLENBQVYsQ0FBVCxDQUFaO0FBQ0EsVUFBSSxNQUFNLFNBQVMsT0FB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QixDQUE0QixTQUE1QixNQUEyQyxDQUFDLENBQWhELEVBQW1EO0FBQ2pELG1CQUFTLFNBQVQsRUFBb0IsSUFBcEIsQ0FBeUIsU0FBekI7QUFDQSxlQUFLLE9BQUwsQ0FBYSxVQUFiO0FBQ0Q7QUFDRixPQUxELE1BS087QUFDTCxjQUFNLE1BQU0sWUFBWSxTQUFaLEdBQXdCLG1CQUE5QixDQUFOO0FBQ0Q7QUFDRjs7O29DQUVlLFMsRUFBVyxTLEVBQVc7QUFDcEMsVUFBSSxRQUFRLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsU0FBcEIsQ0FBWjs7QUFFQSxZQUFNLE1BQU4sQ0FBYSxNQUFNLE9BQU4sQ0FBYyxTQUFkLENBQWIsRUFBdUMsQ0FBdkM7QUFDQSxXQUFLLE9BQUwsQ0FBYSxVQUFiO0FBQ0Q7Ozs7O2tCQUlZLFkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5XCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9rZXlzXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3Byb21pc2VcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIik7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZGVmaW5lUHJvcGVydHkpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgKDAsIF9kZWZpbmVQcm9wZXJ0eTIuZGVmYXVsdCkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgICBpZiAocHJvdG9Qcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpO1xuICAgIGlmIChzdGF0aWNQcm9wcykgZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpO1xuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfTtcbn0oKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9nZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpO1xuXG52YXIgX2dldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldFByb3RvdHlwZU9mKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICB2YXIgZGVzYyA9ICgwLCBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMi5kZWZhdWx0KShvYmplY3QsIHByb3BlcnR5KTtcblxuICBpZiAoZGVzYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIHBhcmVudCA9ICgwLCBfZ2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKG9iamVjdCk7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9zZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpO1xuXG52YXIgX3NldFByb3RvdHlwZU9mMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3NldFByb3RvdHlwZU9mKTtcblxudmFyIF9jcmVhdGUgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvY3JlYXRlXCIpO1xuXG52YXIgX2NyZWF0ZTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9jcmVhdGUpO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgKHR5cGVvZiBzdXBlckNsYXNzID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShzdXBlckNsYXNzKSkpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gKDAsIF9jcmVhdGUyLmRlZmF1bHQpKHN1cGVyQ2xhc3MgJiYgc3VwZXJDbGFzcy5wcm90b3R5cGUsIHtcbiAgICBjb25zdHJ1Y3Rvcjoge1xuICAgICAgdmFsdWU6IHN1YkNsYXNzLFxuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH1cbiAgfSk7XG4gIGlmIChzdXBlckNsYXNzKSBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQgPyAoMCwgX3NldFByb3RvdHlwZU9mMi5kZWZhdWx0KShzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF90eXBlb2YyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgX3R5cGVvZjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90eXBlb2YyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKCh0eXBlb2YgY2FsbCA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAoMCwgX3R5cGVvZjMuZGVmYXVsdCkoY2FsbCkpID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2l0ZXJhdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yXCIpO1xuXG52YXIgX2l0ZXJhdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2l0ZXJhdG9yKTtcblxudmFyIF9zeW1ib2wgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2xcIik7XG5cbnZhciBfc3ltYm9sMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3N5bWJvbCk7XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgX2l0ZXJhdG9yMi5kZWZhdWx0ID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfSA6IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIF90eXBlb2YoX2l0ZXJhdG9yMi5kZWZhdWx0KSA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6IF90eXBlb2Yob2JqKTtcbn07IiwidmFyIGNvcmUgID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpXG4gICwgJEpTT04gPSBjb3JlLkpTT04gfHwgKGNvcmUuSlNPTiA9IHtzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuICRKU09OLnN0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJndW1lbnRzKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjcmVhdGUoUCwgRCl7XG4gIHJldHVybiAkT2JqZWN0LmNyZWF0ZShQLCBEKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eScpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKXtcbiAgcmV0dXJuICRPYmplY3QuZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyk7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICByZXR1cm4gJE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSk7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5nZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuZ2V0UHJvdG90eXBlT2Y7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmtleXMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5rZXlzOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnByb21pc2UnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy9fY29yZScpLlByb21pc2U7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCl7XG4gIGlmKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKXtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoIWlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b0xlbmd0aCAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIHRvSW5kZXggICA9IHJlcXVpcmUoJy4vX3RvLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKCR0aGlzLCBlbCwgZnJvbUluZGV4KXtcbiAgICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KCR0aGlzKVxuICAgICAgLCBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aClcbiAgICAgICwgaW5kZXggID0gdG9JbmRleChmcm9tSW5kZXgsIGxlbmd0aClcbiAgICAgICwgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIGlmKHZhbHVlICE9IHZhbHVlKXJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I3RvSW5kZXggaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKXtcbiAgICAgIGlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59OyIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJylcbiAgLCBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKVxuICAvLyBFUzMgd3JvbmcgaGVyZVxuICAsIEFSRyA9IGNvZihmdW5jdGlvbigpeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07IiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTsiLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0ge3ZlcnNpb246ICcyLjQuMCd9O1xuaWYodHlwZW9mIF9fZSA9PSAnbnVtYmVyJylfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYodGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcbiAgc3dpdGNoKGxlbmd0aCl7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTsiLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKGl0ID09IHVuZGVmaW5lZCl0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07IiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50XG4gIC8vIGluIG9sZCBJRSB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0J1xuICAsIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59OyIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpOyIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BTICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKVxuICAsIHBJRSAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHJlc3VsdCAgICAgPSBnZXRLZXlzKGl0KVxuICAgICwgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYoZ2V0U3ltYm9scyl7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KVxuICAgICAgLCBpc0VudW0gID0gcElFLmZcbiAgICAgICwgaSAgICAgICA9IDBcbiAgICAgICwga2V5O1xuICAgIHdoaWxlKHN5bWJvbHMubGVuZ3RoID4gaSlpZihpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGNvcmUgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vX2N0eCcpXG4gICwgaGlkZSAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24odHlwZSwgbmFtZSwgc291cmNlKXtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkZcbiAgICAsIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0LkdcbiAgICAsIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlNcbiAgICAsIElTX1BST1RPICA9IHR5cGUgJiAkZXhwb3J0LlBcbiAgICAsIElTX0JJTkQgICA9IHR5cGUgJiAkZXhwb3J0LkJcbiAgICAsIElTX1dSQVAgICA9IHR5cGUgJiAkZXhwb3J0LldcbiAgICAsIGV4cG9ydHMgICA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pXG4gICAgLCBleHBQcm90byAgPSBleHBvcnRzW1BST1RPVFlQRV1cbiAgICAsIHRhcmdldCAgICA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV1cbiAgICAsIGtleSwgb3duLCBvdXQ7XG4gIGlmKElTX0dMT0JBTClzb3VyY2UgPSBuYW1lO1xuICBmb3Ioa2V5IGluIHNvdXJjZSl7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICBpZihvd24gJiYga2V5IGluIGV4cG9ydHMpY29udGludWU7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSBvd24gPyB0YXJnZXRba2V5XSA6IHNvdXJjZVtrZXldO1xuICAgIC8vIHByZXZlbnQgZ2xvYmFsIHBvbGx1dGlvbiBmb3IgbmFtZXNwYWNlc1xuICAgIGV4cG9ydHNba2V5XSA9IElTX0dMT0JBTCAmJiB0eXBlb2YgdGFyZ2V0W2tleV0gIT0gJ2Z1bmN0aW9uJyA/IHNvdXJjZVtrZXldXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICA6IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKVxuICAgIC8vIHdyYXAgZ2xvYmFsIGNvbnN0cnVjdG9ycyBmb3IgcHJldmVudCBjaGFuZ2UgdGhlbSBpbiBsaWJyYXJ5XG4gICAgOiBJU19XUkFQICYmIHRhcmdldFtrZXldID09IG91dCA/IChmdW5jdGlvbihDKXtcbiAgICAgIHZhciBGID0gZnVuY3Rpb24oYSwgYiwgYyl7XG4gICAgICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBDKXtcbiAgICAgICAgICBzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7XG4gICAgICAgICAgICBjYXNlIDA6IHJldHVybiBuZXcgQztcbiAgICAgICAgICAgIGNhc2UgMTogcmV0dXJuIG5ldyBDKGEpO1xuICAgICAgICAgICAgY2FzZSAyOiByZXR1cm4gbmV3IEMoYSwgYik7XG4gICAgICAgICAgfSByZXR1cm4gbmV3IEMoYSwgYiwgYyk7XG4gICAgICAgIH0gcmV0dXJuIEMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBGW1BST1RPVFlQRV0gPSBDW1BST1RPVFlQRV07XG4gICAgICByZXR1cm4gRjtcbiAgICAvLyBtYWtlIHN0YXRpYyB2ZXJzaW9ucyBmb3IgcHJvdG90eXBlIG1ldGhvZHNcbiAgICB9KShvdXQpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLm1ldGhvZHMuJU5BTUUlXG4gICAgaWYoSVNfUFJPVE8pe1xuICAgICAgKGV4cG9ydHMudmlydHVhbCB8fCAoZXhwb3J0cy52aXJ0dWFsID0ge30pKVtrZXldID0gb3V0O1xuICAgICAgLy8gZXhwb3J0IHByb3RvIG1ldGhvZHMgdG8gY29yZS4lQ09OU1RSVUNUT1IlLnByb3RvdHlwZS4lTkFNRSVcbiAgICAgIGlmKHR5cGUgJiAkZXhwb3J0LlIgJiYgZXhwUHJvdG8gJiYgIWV4cFByb3RvW2tleV0paGlkZShleHBQcm90bywga2V5LCBvdXQpO1xuICAgIH1cbiAgfVxufTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWAgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07IiwidmFyIGN0eCAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBjYWxsICAgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpXG4gICwgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJylcbiAgLCBhbk9iamVjdCAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9MZW5ndGggICAgPSByZXF1aXJlKCcuL190by1sZW5ndGgnKVxuICAsIGdldEl0ZXJGbiAgID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKVxuICAsIEJSRUFLICAgICAgID0ge31cbiAgLCBSRVRVUk4gICAgICA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1Ipe1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbigpeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpXG4gICAgLCBmICAgICAgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSlcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYoaXNBcnJheUl0ZXIoaXRlckZuKSlmb3IobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgKXtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZihyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKXJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLICA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZih0eXBlb2YgX19nID09ICdudW1iZXInKV9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwga2V5KXtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59OyIsInZhciBkUCAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDsiLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gNzsgfX0pLmEgIT0gNztcbn0pOyIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoKGFyZ3MubGVuZ3RoKXtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gICAgICAgICAgICAgIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTsiLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59OyIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpe1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoKGUpe1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYocmV0ICE9PSB1bmRlZmluZWQpYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJ2YXIgSVRFUkFUT1IgICAgID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJylcbiAgLCBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbigpeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihleGVjLCBza2lwQ2xvc2luZyl7XG4gIGlmKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKXJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyICA9IFs3XVxuICAgICAgLCBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHJldHVybiB7ZG9uZTogc2FmZSA9IHRydWV9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xuICByZXR1cm4ge3ZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB7fTsiLCJ2YXIgZ2V0S2V5cyAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XG4gIHZhciBPICAgICAgPSB0b0lPYmplY3Qob2JqZWN0KVxuICAgICwga2V5cyAgID0gZ2V0S2V5cyhPKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGluZGV4ICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSB0cnVlOyIsInZhciBNRVRBICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJylcbiAgLCBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgaGFzICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHNldERlc2MgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZlxuICAsIGlkICAgICAgID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uKCl7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uKGl0KXtcbiAgc2V0RGVzYyhpdCwgTUVUQSwge3ZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfX0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24oaXQsIGNyZWF0ZSl7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICBpZighaGFzKGl0LCBNRVRBKSl7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZighaXNFeHRlbnNpYmxlKGl0KSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbihpdCl7XG4gIGlmKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSlzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogICAgICBNRVRBLFxuICBORUVEOiAgICAgZmFsc2UsXG4gIGZhc3RLZXk6ICBmYXN0S2V5LFxuICBnZXRXZWFrOiAgZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59OyIsInZhciBnbG9iYWwgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXRcbiAgLCBPYnNlcnZlciAgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlclxuICAsIHByb2Nlc3MgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgUHJvbWlzZSAgID0gZ2xvYmFsLlByb21pc2VcbiAgLCBpc05vZGUgICAgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbigpe1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKXBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUoaGVhZCl7XG4gICAgICBmbiAgID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaChlKXtcbiAgICAgICAgaWYoaGVhZClub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZihwYXJlbnQpcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZihpc05vZGUpe1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXJcbiAgfSBlbHNlIGlmKE9ic2VydmVyKXtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZVxuICAgICAgLCBub2RlICAgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHtjaGFyYWN0ZXJEYXRhOiB0cnVlfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24oKXtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKXtcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSgpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uKCl7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbigpe1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbihmbil7XG4gICAgdmFyIHRhc2sgPSB7Zm46IGZuLCBuZXh0OiB1bmRlZmluZWR9O1xuICAgIGlmKGxhc3QpbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZighaGVhZCl7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59OyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUE4gICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZmFpbHMgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJ2YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odGFyZ2V0LCBzcmMsIHNhZmUpe1xuICBmb3IodmFyIGtleSBpbiBzcmMpe1xuICAgIGlmKHNhZmUgJiYgdGFyZ2V0W2tleV0pdGFyZ2V0W2tleV0gPSBzcmNba2V5XTtcbiAgICBlbHNlIGhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcbiAgfSByZXR1cm4gdGFyZ2V0O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIGRQICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCBTUEVDSUVTICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oS0VZKXtcbiAgdmFyIEMgPSB0eXBlb2YgY29yZVtLRVldID09ICdmdW5jdGlvbicgPyBjb3JlW0tFWV0gOiBnbG9iYWxbS0VZXTtcbiAgaWYoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSlkUC5mKEMsIFNQRUNJRVMsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBTUEVDSUVTICAgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihPLCBEKXtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvciwgUztcbiAgcmV0dXJuIEMgPT09IHVuZGVmaW5lZCB8fCAoUyA9IGFuT2JqZWN0KEMpW1NQRUNJRVNdKSA9PSB1bmRlZmluZWQgPyBEIDogYUZ1bmN0aW9uKFMpO1xufTsiLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpXG4gICwgZGVmaW5lZCAgID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xuLy8gdHJ1ZSAgLT4gU3RyaW5nI2F0XG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oVE9fU1RSSU5HKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHRoYXQsIHBvcyl7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSlcbiAgICAgICwgaSA9IHRvSW50ZWdlcihwb3MpXG4gICAgICAsIGwgPSBzLmxlbmd0aFxuICAgICAgLCBhLCBiO1xuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XG4gICAgYSA9IHMuY2hhckNvZGVBdChpKTtcbiAgICByZXR1cm4gYSA8IDB4ZDgwMCB8fCBhID4gMHhkYmZmIHx8IGkgKyAxID09PSBsIHx8IChiID0gcy5jaGFyQ29kZUF0KGkgKyAxKSkgPCAweGRjMDAgfHwgYiA+IDB4ZGZmZlxuICAgICAgPyBUT19TVFJJTkcgPyBzLmNoYXJBdChpKSA6IGFcbiAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xuICB9O1xufTsiLCJ2YXIgY3R4ICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBpbnZva2UgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pbnZva2UnKVxuICAsIGh0bWwgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2h0bWwnKVxuICAsIGNlbCAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKVxuICAsIGdsb2JhbCAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgcHJvY2VzcyAgICAgICAgICAgID0gZ2xvYmFsLnByb2Nlc3NcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXG4gICwgY2xlYXJUYXNrICAgICAgICAgID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlXG4gICwgTWVzc2FnZUNoYW5uZWwgICAgID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxuICAsIHF1ZXVlICAgICAgICAgICAgICA9IHt9XG4gICwgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSdcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbigpe1xuICB2YXIgaWQgPSArdGhpcztcbiAgaWYocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKXtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQpe1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZighc2V0VGFzayB8fCAhY2xlYXJUYXNrKXtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbil7XG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24oKXtcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCl7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYoTWVzc2FnZUNoYW5uZWwpe1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWw7XG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZihnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpe1xuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKXtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiAgIHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge2NyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpfSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpLCAnT2JqZWN0Jywge2RlZmluZVByb3BlcnR5OiByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mfSk7IiwiLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxudmFyIHRvSU9iamVjdCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodG9JT2JqZWN0KGl0KSwga2V5KTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMi45IE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIHRvT2JqZWN0ICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgJGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2dldFByb3RvdHlwZU9mJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldFByb3RvdHlwZU9mKGl0KXtcbiAgICByZXR1cm4gJGdldFByb3RvdHlwZU9mKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgJGtleXMgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCl7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge3NldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXR9KTsiLCIiLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgZ2xvYmFsICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjdHggICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19jdHgnKVxuICAsIGNsYXNzb2YgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsICRleHBvcnQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgaXNPYmplY3QgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0JylcbiAgLCBhRnVuY3Rpb24gICAgICAgICAgPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJylcbiAgLCBhbkluc3RhbmNlICAgICAgICAgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpXG4gICwgZm9yT2YgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fZm9yLW9mJylcbiAgLCBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJylcbiAgLCB0YXNrICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL190YXNrJykuc2V0XG4gICwgbWljcm90YXNrICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKVxuICAsIFBST01JU0UgICAgICAgICAgICA9ICdQcm9taXNlJ1xuICAsIFR5cGVFcnJvciAgICAgICAgICA9IGdsb2JhbC5UeXBlRXJyb3JcbiAgLCBwcm9jZXNzICAgICAgICAgICAgPSBnbG9iYWwucHJvY2Vzc1xuICAsICRQcm9taXNlICAgICAgICAgICA9IGdsb2JhbFtQUk9NSVNFXVxuICAsIHByb2Nlc3MgICAgICAgICAgICA9IGdsb2JhbC5wcm9jZXNzXG4gICwgaXNOb2RlICAgICAgICAgICAgID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2VzcydcbiAgLCBlbXB0eSAgICAgICAgICAgICAgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9XG4gICwgSW50ZXJuYWwsIEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uKCl7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgICAgID0gJFByb21pc2UucmVzb2x2ZSgxKVxuICAgICAgLCBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24oZXhlYyl7IGV4ZWMoZW1wdHksIGVtcHR5KTsgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKSAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIHNhbWVDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uKGEsIGIpe1xuICAvLyB3aXRoIGxpYnJhcnkgd3JhcHBlciBzcGVjaWFsIGNhc2VcbiAgcmV0dXJuIGEgPT09IGIgfHwgYSA9PT0gJFByb21pc2UgJiYgYiA9PT0gV3JhcHBlcjtcbn07XG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgcmV0dXJuIHNhbWVDb25zdHJ1Y3RvcigkUHJvbWlzZSwgQylcbiAgICA/IG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgIDogbmV3IEdlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbihDKXtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24oJCRyZXNvbHZlLCAkJHJlamVjdCl7XG4gICAgaWYocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCAgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59O1xudmFyIHBlcmZvcm0gPSBmdW5jdGlvbihleGVjKXtcbiAgdHJ5IHtcbiAgICBleGVjKCk7XG4gIH0gY2F0Y2goZSl7XG4gICAgcmV0dXJuIHtlcnJvcjogZX07XG4gIH1cbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24ocHJvbWlzZSwgaXNSZWplY3Qpe1xuICBpZihwcm9taXNlLl9uKXJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbigpe1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3ZcbiAgICAgICwgb2sgICAgPSBwcm9taXNlLl9zID09IDFcbiAgICAgICwgaSAgICAgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbihyZWFjdGlvbil7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsXG4gICAgICAgICwgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmVcbiAgICAgICAgLCByZWplY3QgID0gcmVhY3Rpb24ucmVqZWN0XG4gICAgICAgICwgZG9tYWluICA9IHJlYWN0aW9uLmRvbWFpblxuICAgICAgICAsIHJlc3VsdCwgdGhlbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmKGhhbmRsZXIpe1xuICAgICAgICAgIGlmKCFvayl7XG4gICAgICAgICAgICBpZihwcm9taXNlLl9oID09IDIpb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYoaGFuZGxlciA9PT0gdHJ1ZSlyZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmKGRvbWFpbilkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpO1xuICAgICAgICAgICAgaWYoZG9tYWluKWRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSl7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKXtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoKGUpe1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZShjaGFpbi5sZW5ndGggPiBpKXJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKW9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92XG4gICAgICAsIGFicnVwdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZihpc1VuaGFuZGxlZChwcm9taXNlKSl7XG4gICAgICBhYnJ1cHQgPSBwZXJmb3JtKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKGlzTm9kZSl7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZihoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKXtcbiAgICAgICAgICBoYW5kbGVyKHtwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlfSk7XG4gICAgICAgIH0gZWxzZSBpZigoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKXtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYoYWJydXB0KXRocm93IGFicnVwdC5lcnJvcjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24ocHJvbWlzZSl7XG4gIGlmKHByb21pc2UuX2ggPT0gMSlyZXR1cm4gZmFsc2U7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2EgfHwgcHJvbWlzZS5fY1xuICAgICwgaSAgICAgPSAwXG4gICAgLCByZWFjdGlvbjtcbiAgd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSl7XG4gICAgcmVhY3Rpb24gPSBjaGFpbltpKytdO1xuICAgIGlmKHJlYWN0aW9uLmZhaWwgfHwgIWlzVW5oYW5kbGVkKHJlYWN0aW9uLnByb21pc2UpKXJldHVybiBmYWxzZTtcbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbihwcm9taXNlKXtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24oKXtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZihpc05vZGUpe1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKXtcbiAgICAgIGhhbmRsZXIoe3Byb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdn0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbih2YWx1ZSl7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYocHJvbWlzZS5fZClyZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYoIXByb21pc2UuX2EpcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgdmFyIHByb21pc2UgPSB0aGlzXG4gICAgLCB0aGVuO1xuICBpZihwcm9taXNlLl9kKXJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmKHByb21pc2UgPT09IHZhbHVlKXRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSl7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7X3c6IHByb21pc2UsIF9kOiBmYWxzZX07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaChlKXtcbiAgICAkcmVqZWN0LmNhbGwoe193OiBwcm9taXNlLCBfZDogZmFsc2V9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYoIVVTRV9OQVRJVkUpe1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3Ipe1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoKGVycil7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcil7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKXtcbiAgICAgIHZhciByZWFjdGlvbiAgICA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgICAgID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsICAgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9hKXRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZih0aGlzLl9zKW5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24ob25SZWplY3RlZCl7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbigpe1xuICAgIHZhciBwcm9taXNlICA9IG5ldyBJbnRlcm5hbDtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7UHJvbWlzZTogJFByb21pc2V9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocil7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKVxuICAgICAgLCAkJHJlamVjdCAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KXtcbiAgICAvLyBpbnN0YW5jZW9mIGluc3RlYWQgb2YgaW50ZXJuYWwgc2xvdCBjaGVjayBiZWNhdXNlIHdlIHNob3VsZCBmaXggaXQgd2l0aG91dCByZXBsYWNlbWVudCBuYXRpdmUgUHJvbWlzZSBjb3JlXG4gICAgaWYoeCBpbnN0YW5jZW9mICRQcm9taXNlICYmIHNhbWVDb25zdHJ1Y3Rvcih4LmNvbnN0cnVjdG9yLCB0aGlzKSlyZXR1cm4geDtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpXG4gICAgICAsICQkcmVzb2x2ZSAgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgJCRyZXNvbHZlKHgpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpe1xuICAgIHZhciBDICAgICAgICAgID0gdGhpc1xuICAgICAgLCBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgICwgcmVzb2x2ZSAgICA9IGNhcGFiaWxpdHkucmVzb2x2ZVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIHZhciB2YWx1ZXMgICAgPSBbXVxuICAgICAgICAsIGluZGV4ICAgICA9IDBcbiAgICAgICAgLCByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbihwcm9taXNlKXtcbiAgICAgICAgdmFyICRpbmRleCAgICAgICAgPSBpbmRleCsrXG4gICAgICAgICAgLCBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgaWYoYWxyZWFkeUNhbGxlZClyZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCAgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYoYWJydXB0KXJlamVjdChhYnJ1cHQuZXJyb3IpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSl7XG4gICAgdmFyIEMgICAgICAgICAgPSB0aGlzXG4gICAgICAsIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgLCByZWplY3QgICAgID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIGFicnVwdCA9IHBlcmZvcm0oZnVuY3Rpb24oKXtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24ocHJvbWlzZSl7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmKGFicnVwdClyZWplY3QoYWJydXB0LmVycm9yKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ICA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uKGl0ZXJhdGVkKXtcbiAgdGhpcy5fdCA9IFN0cmluZyhpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuLy8gMjEuMS41LjIuMSAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24oKXtcbiAgdmFyIE8gICAgID0gdGhpcy5fdFxuICAgICwgaW5kZXggPSB0aGlzLl9pXG4gICAgLCBwb2ludDtcbiAgaWYoaW5kZXggPj0gTy5sZW5ndGgpcmV0dXJuIHt2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHt2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlfTtcbn0pOyIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGFzICAgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBNRVRBICAgICAgICAgICA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVlcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJylcbiAgLCBzaGFyZWQgICAgICAgICA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuL191aWQnKVxuICAsIHdrcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzJylcbiAgLCB3a3NFeHQgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcy1leHQnKVxuICAsIHdrc0RlZmluZSAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpXG4gICwga2V5T2YgICAgICAgICAgPSByZXF1aXJlKCcuL19rZXlvZicpXG4gICwgZW51bUtleXMgICAgICAgPSByZXF1aXJlKCcuL19lbnVtLWtleXMnKVxuICAsIGlzQXJyYXkgICAgICAgID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCB0b0lPYmplY3QgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvUHJpbWl0aXZlICAgID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIF9jcmVhdGUgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpXG4gICwgZ09QTkV4dCAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbi1leHQnKVxuICAsICRHT1BEICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKVxuICAsICREUCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCAka2V5cyAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCBnT1BEICAgICAgICAgICA9ICRHT1BELmZcbiAgLCBkUCAgICAgICAgICAgICA9ICREUC5mXG4gICwgZ09QTiAgICAgICAgICAgPSBnT1BORXh0LmZcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBQUk9UT1RZUEUgICAgICA9ICdwcm90b3R5cGUnXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIFRPX1BSSU1JVElWRSAgID0gd2tzKCd0b1ByaW1pdGl2ZScpXG4gICwgaXNFbnVtICAgICAgICAgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzeW1ib2wtcmVnaXN0cnknKVxuICAsIEFsbFN5bWJvbHMgICAgID0gc2hhcmVkKCdzeW1ib2xzJylcbiAgLCBPUFN5bWJvbHMgICAgICA9IHNoYXJlZCgnb3Atc3ltYm9scycpXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3RbUFJPVE9UWVBFXVxuICAsIFVTRV9OQVRJVkUgICAgID0gdHlwZW9mICRTeW1ib2wgPT0gJ2Z1bmN0aW9uJ1xuICAsIFFPYmplY3QgICAgICAgID0gZ2xvYmFsLlFPYmplY3Q7XG4vLyBEb24ndCB1c2Ugc2V0dGVycyBpbiBRdCBTY3JpcHQsIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8xNzNcbnZhciBzZXR0ZXIgPSAhUU9iamVjdCB8fCAhUU9iamVjdFtQUk9UT1RZUEVdIHx8ICFRT2JqZWN0W1BST1RPVFlQRV0uZmluZENoaWxkO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiBkUCh0aGlzLCAnYScsIHt2YWx1ZTogN30pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24oaXQsIGtleSwgRCl7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZihwcm90b0Rlc2MpZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKWRQKE9iamVjdFByb3RvLCBrZXksIHByb3RvRGVzYyk7XG59IDogZFA7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24odGFnKXtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBpdCBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuXG52YXIgJGRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90bykkZGVmaW5lUHJvcGVydHkoT1BTeW1ib2xzLCBrZXksIEQpO1xuICBhbk9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEQpO1xuICBpZihoYXMoQWxsU3ltYm9scywga2V5KSl7XG4gICAgaWYoIUQuZW51bWVyYWJsZSl7XG4gICAgICBpZighaGFzKGl0LCBISURERU4pKWRQKGl0LCBISURERU4sIGNyZWF0ZURlc2MoMSwge30pKTtcbiAgICAgIGl0W0hJRERFTl1ba2V5XSA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7ZW51bWVyYWJsZTogY3JlYXRlRGVzYygwLCBmYWxzZSl9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKSk7XG4gIGlmKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICBpdCAgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdPUE4odG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSlyZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpe1xuICB2YXIgSVNfT1AgID0gaXQgPT09IE9iamVjdFByb3RvXG4gICAgLCBuYW1lcyAgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSlcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBpICAgICAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpe1xuICAgIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiAoSVNfT1AgPyBoYXMoT2JqZWN0UHJvdG8sIGtleSkgOiB0cnVlKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmKCFVU0VfTkFUSVZFKXtcbiAgJFN5bWJvbCA9IGZ1bmN0aW9uIFN5bWJvbCgpe1xuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yIScpO1xuICAgIHZhciB0YWcgPSB1aWQoYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpO1xuICAgIHZhciAkc2V0ID0gZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8pJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9O1xuICAgIGlmKERFU0NSSVBUT1JTICYmIHNldHRlcilzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHtjb25maWd1cmFibGU6IHRydWUsIHNldDogJHNldH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mICAgPSAkZGVmaW5lUHJvcGVydHk7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZiA9IGdPUE5FeHQuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZiAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYoREVTQ1JJUFRPUlMgJiYgIXJlcXVpcmUoJy4vX2xpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uKG5hbWUpe1xuICAgIHJldHVybiB3cmFwKHdrcyhuYW1lKSk7XG4gIH1cbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwge1N5bWJvbDogJFN5bWJvbH0pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrcyhzeW1ib2xzW2krK10pO1xuXG5mb3IodmFyIHN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzRGVmaW5lKHN5bWJvbHNbaSsrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgaWYoaXNTeW1ib2woa2V5KSlyZXR1cm4ga2V5T2YoU3ltYm9sUmVnaXN0cnksIGtleSk7XG4gICAgdGhyb3cgVHlwZUVycm9yKGtleSArICcgaXMgbm90IGEgc3ltYm9sIScpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSkpLCAnSlNPTicsIHtcbiAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQpe1xuICAgIGlmKGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKXJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgIHZhciBhcmdzID0gW2l0XVxuICAgICAgLCBpICAgID0gMVxuICAgICAgLCByZXBsYWNlciwgJHJlcGxhY2VyO1xuICAgIHdoaWxlKGFyZ3VtZW50cy5sZW5ndGggPiBpKWFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgIGlmKCRyZXBsYWNlciB8fCAhaXNBcnJheShyZXBsYWNlcikpcmVwbGFjZXIgPSBmdW5jdGlvbihrZXksIHZhbHVlKXtcbiAgICAgIGlmKCRyZXBsYWNlcil2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpOyIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnYXN5bmNJdGVyYXRvcicpOyIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnb2JzZXJ2YWJsZScpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2xvYmFsICAgICAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgaGlkZSAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIEl0ZXJhdG9ycyAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIFRPX1NUUklOR19UQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxuZm9yKHZhciBjb2xsZWN0aW9ucyA9IFsnTm9kZUxpc3QnLCAnRE9NVG9rZW5MaXN0JywgJ01lZGlhTGlzdCcsICdTdHlsZVNoZWV0TGlzdCcsICdDU1NSdWxlTGlzdCddLCBpID0gMDsgaSA8IDU7IGkrKyl7XG4gIHZhciBOQU1FICAgICAgID0gY29sbGVjdGlvbnNbaV1cbiAgICAsIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV1cbiAgICAsIHByb3RvICAgICAgPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICBpZihwcm90byAmJiAhcHJvdG9bVE9fU1RSSU5HX1RBR10paGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gIEl0ZXJhdG9yc1tOQU1FXSA9IEl0ZXJhdG9ycy5BcnJheTtcbn0iLCIvKipcclxuKiBDb3B5cmlnaHQgMjAxNiBQVCBJbm92YcOnw6NvIGUgU2lzdGVtYXMgU0FcclxuKiBDb3B5cmlnaHQgMjAxNiBJTkVTQy1JRFxyXG4qIENvcHlyaWdodCAyMDE2IFFVT0JJUyBORVRXT1JLUyBTTFxyXG4qIENvcHlyaWdodCAyMDE2IEZSQVVOSE9GRVItR0VTRUxMU0NIQUZUIFpVUiBGT0VSREVSVU5HIERFUiBBTkdFV0FORFRFTiBGT1JTQ0hVTkcgRS5WXHJcbiogQ29weXJpZ2h0IDIwMTYgT1JBTkdFIFNBXHJcbiogQ29weXJpZ2h0IDIwMTYgRGV1dHNjaGUgVGVsZWtvbSBBR1xyXG4qIENvcHlyaWdodCAyMDE2IEFwaXplZVxyXG4qIENvcHlyaWdodCAyMDE2IFRFQ0hOSVNDSEUgVU5JVkVSU0lUQVQgQkVSTElOXHJcbipcclxuKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4qIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuKlxyXG4qICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbipcclxuKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4qIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4qIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuKiovXHJcblxyXG4vLyBEaXN0cmlidXRpb24gZmlsZSBmb3IgUGVyc2lzdGVuY2VNYW5hZ2VyLmpzIFxyXG4vLyB2ZXJzaW9uOiAwLjMuMFxyXG4vLyBMYXN0IGJ1aWxkOiBXZWQgQXVnIDEwIDIwMTYgMTU6MjU6NDAgR01UKzAxMDAgKFdFU1QpXHJcblxyXG4hZnVuY3Rpb24oZSl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9ZSgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSxlKTtlbHNle3ZhciB0O3Q9XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzLHQuUGVyc2lzdGVuY2VNYW5hZ2VyPWUoKX19KGZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIGkocyxhKXtpZighbltzXSl7aWYoIXRbc10pe3ZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWEmJnUpcmV0dXJuIHUocywhMCk7aWYobylyZXR1cm4gbyhzLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK3MrXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBjPW5bc109e2V4cG9ydHM6e319O3Rbc11bMF0uY2FsbChjLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtzXVsxXVtlXTtyZXR1cm4gaShuP246ZSl9LGMsYy5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW3NdLmV4cG9ydHN9Zm9yKHZhciBvPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUscz0wO3M8ci5sZW5ndGg7cysrKWkocltzXSk7cmV0dXJuIGl9KHsxOltmdW5jdGlvbihlLHQsbil7dC5leHBvcnRzPXtcImRlZmF1bHRcIjplKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5XCIpLF9fZXNNb2R1bGU6ITB9fSx7XCJjb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnlcIjo5fV0sMjpbZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoKXtmb3IodmFyIGU9XCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIsdD0wLG49ZS5sZW5ndGg7dDxuOysrdCl1W3RdPWVbdF0sZltlLmNoYXJDb2RlQXQodCldPXQ7ZltcIi1cIi5jaGFyQ29kZUF0KDApXT02MixmW1wiX1wiLmNoYXJDb2RlQXQoMCldPTYzfWZ1bmN0aW9uIGkoZSl7dmFyIHQsbixyLGksbyxzLGE9ZS5sZW5ndGg7aWYoYSU0PjApdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNFwiKTtvPVwiPVwiPT09ZVthLTJdPzI6XCI9XCI9PT1lW2EtMV0/MTowLHM9bmV3IGMoMyphLzQtbykscj1vPjA/YS00OmE7dmFyIHU9MDtmb3IodD0wLG49MDt0PHI7dCs9NCxuKz0zKWk9ZltlLmNoYXJDb2RlQXQodCldPDwxOHxmW2UuY2hhckNvZGVBdCh0KzEpXTw8MTJ8ZltlLmNoYXJDb2RlQXQodCsyKV08PDZ8ZltlLmNoYXJDb2RlQXQodCszKV0sc1t1KytdPWk+PjE2JjI1NSxzW3UrK109aT4+OCYyNTUsc1t1KytdPTI1NSZpO3JldHVybiAyPT09bz8oaT1mW2UuY2hhckNvZGVBdCh0KV08PDJ8ZltlLmNoYXJDb2RlQXQodCsxKV0+PjQsc1t1KytdPTI1NSZpKToxPT09byYmKGk9ZltlLmNoYXJDb2RlQXQodCldPDwxMHxmW2UuY2hhckNvZGVBdCh0KzEpXTw8NHxmW2UuY2hhckNvZGVBdCh0KzIpXT4+MixzW3UrK109aT4+OCYyNTUsc1t1KytdPTI1NSZpKSxzfWZ1bmN0aW9uIG8oZSl7cmV0dXJuIHVbZT4+MTgmNjNdK3VbZT4+MTImNjNdK3VbZT4+NiY2M10rdVs2MyZlXX1mdW5jdGlvbiBzKGUsdCxuKXtmb3IodmFyIHIsaT1bXSxzPXQ7czxuO3MrPTMpcj0oZVtzXTw8MTYpKyhlW3MrMV08PDgpK2VbcysyXSxpLnB1c2gobyhyKSk7cmV0dXJuIGkuam9pbihcIlwiKX1mdW5jdGlvbiBhKGUpe2Zvcih2YXIgdCxuPWUubGVuZ3RoLHI9biUzLGk9XCJcIixvPVtdLGE9MTYzODMsZj0wLGM9bi1yO2Y8YztmKz1hKW8ucHVzaChzKGUsZixmK2E+Yz9jOmYrYSkpO3JldHVybiAxPT09cj8odD1lW24tMV0saSs9dVt0Pj4yXSxpKz11W3Q8PDQmNjNdLGkrPVwiPT1cIik6Mj09PXImJih0PShlW24tMl08PDgpK2Vbbi0xXSxpKz11W3Q+PjEwXSxpKz11W3Q+PjQmNjNdLGkrPXVbdDw8MiY2M10saSs9XCI9XCIpLG8ucHVzaChpKSxvLmpvaW4oXCJcIil9bi50b0J5dGVBcnJheT1pLG4uZnJvbUJ5dGVBcnJheT1hO3ZhciB1PVtdLGY9W10sYz1cInVuZGVmaW5lZFwiIT10eXBlb2YgVWludDhBcnJheT9VaW50OEFycmF5OkFycmF5O3IoKX0se31dLDM6W2Z1bmN0aW9uKGUsdCxuKXt9LHt9XSw0OltmdW5jdGlvbihlLHQsbil7YXJndW1lbnRzWzRdWzNdWzBdLmFwcGx5KG4sYXJndW1lbnRzKX0se2R1cDozfV0sNTpbZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoZSx0KXtyZXR1cm4gcC5pc1VuZGVmaW5lZCh0KT9cIlwiK3Q6cC5pc051bWJlcih0KSYmIWlzRmluaXRlKHQpP3QudG9TdHJpbmcoKTpwLmlzRnVuY3Rpb24odCl8fHAuaXNSZWdFeHAodCk/dC50b1N0cmluZygpOnR9ZnVuY3Rpb24gaShlLHQpe3JldHVybiBwLmlzU3RyaW5nKGUpP2UubGVuZ3RoPHQ/ZTplLnNsaWNlKDAsdCk6ZX1mdW5jdGlvbiBvKGUpe3JldHVybiBpKEpTT04uc3RyaW5naWZ5KGUuYWN0dWFsLHIpLDEyOCkrXCIgXCIrZS5vcGVyYXRvcitcIiBcIitpKEpTT04uc3RyaW5naWZ5KGUuZXhwZWN0ZWQsciksMTI4KX1mdW5jdGlvbiBzKGUsdCxuLHIsaSl7dGhyb3cgbmV3IHkuQXNzZXJ0aW9uRXJyb3Ioe21lc3NhZ2U6bixhY3R1YWw6ZSxleHBlY3RlZDp0LG9wZXJhdG9yOnIsc3RhY2tTdGFydEZ1bmN0aW9uOml9KX1mdW5jdGlvbiBhKGUsdCl7ZXx8cyhlLCEwLHQsXCI9PVwiLHkub2spfWZ1bmN0aW9uIHUoZSx0KXtpZihlPT09dClyZXR1cm4hMDtpZihwLmlzQnVmZmVyKGUpJiZwLmlzQnVmZmVyKHQpKXtpZihlLmxlbmd0aCE9dC5sZW5ndGgpcmV0dXJuITE7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspaWYoZVtuXSE9PXRbbl0pcmV0dXJuITE7cmV0dXJuITB9cmV0dXJuIHAuaXNEYXRlKGUpJiZwLmlzRGF0ZSh0KT9lLmdldFRpbWUoKT09PXQuZ2V0VGltZSgpOnAuaXNSZWdFeHAoZSkmJnAuaXNSZWdFeHAodCk/ZS5zb3VyY2U9PT10LnNvdXJjZSYmZS5nbG9iYWw9PT10Lmdsb2JhbCYmZS5tdWx0aWxpbmU9PT10Lm11bHRpbGluZSYmZS5sYXN0SW5kZXg9PT10Lmxhc3RJbmRleCYmZS5pZ25vcmVDYXNlPT09dC5pZ25vcmVDYXNlOnAuaXNPYmplY3QoZSl8fHAuaXNPYmplY3QodCk/YyhlLHQpOmU9PXR9ZnVuY3Rpb24gZihlKXtyZXR1cm5cIltvYmplY3QgQXJndW1lbnRzXVwiPT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSl9ZnVuY3Rpb24gYyhlLHQpe2lmKHAuaXNOdWxsT3JVbmRlZmluZWQoZSl8fHAuaXNOdWxsT3JVbmRlZmluZWQodCkpcmV0dXJuITE7aWYoZS5wcm90b3R5cGUhPT10LnByb3RvdHlwZSlyZXR1cm4hMTtpZihwLmlzUHJpbWl0aXZlKGUpfHxwLmlzUHJpbWl0aXZlKHQpKXJldHVybiBlPT09dDt2YXIgbj1mKGUpLHI9Zih0KTtpZihuJiYhcnx8IW4mJnIpcmV0dXJuITE7aWYobilyZXR1cm4gZT1kLmNhbGwoZSksdD1kLmNhbGwodCksdShlLHQpO3ZhciBpLG8scz1fKGUpLGE9Xyh0KTtpZihzLmxlbmd0aCE9YS5sZW5ndGgpcmV0dXJuITE7Zm9yKHMuc29ydCgpLGEuc29ydCgpLG89cy5sZW5ndGgtMTtvPj0wO28tLSlpZihzW29dIT1hW29dKXJldHVybiExO2ZvcihvPXMubGVuZ3RoLTE7bz49MDtvLS0paWYoaT1zW29dLCF1KGVbaV0sdFtpXSkpcmV0dXJuITE7cmV0dXJuITB9ZnVuY3Rpb24gbChlLHQpe3JldHVybiEoIWV8fCF0KSYmKFwiW29iamVjdCBSZWdFeHBdXCI9PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KT90LnRlc3QoZSk6ZSBpbnN0YW5jZW9mIHR8fHQuY2FsbCh7fSxlKT09PSEwKX1mdW5jdGlvbiBoKGUsdCxuLHIpe3ZhciBpO3AuaXNTdHJpbmcobikmJihyPW4sbj1udWxsKTt0cnl7dCgpfWNhdGNoKG8pe2k9b31pZihyPShuJiZuLm5hbWU/XCIgKFwiK24ubmFtZStcIikuXCI6XCIuXCIpKyhyP1wiIFwiK3I6XCIuXCIpLGUmJiFpJiZzKGksbixcIk1pc3NpbmcgZXhwZWN0ZWQgZXhjZXB0aW9uXCIrciksIWUmJmwoaSxuKSYmcyhpLG4sXCJHb3QgdW53YW50ZWQgZXhjZXB0aW9uXCIrciksZSYmaSYmbiYmIWwoaSxuKXx8IWUmJmkpdGhyb3cgaX12YXIgcD1lKFwidXRpbC9cIiksZD1BcnJheS5wcm90b3R5cGUuc2xpY2UsZz1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LHk9dC5leHBvcnRzPWE7eS5Bc3NlcnRpb25FcnJvcj1mdW5jdGlvbihlKXt0aGlzLm5hbWU9XCJBc3NlcnRpb25FcnJvclwiLHRoaXMuYWN0dWFsPWUuYWN0dWFsLHRoaXMuZXhwZWN0ZWQ9ZS5leHBlY3RlZCx0aGlzLm9wZXJhdG9yPWUub3BlcmF0b3IsZS5tZXNzYWdlPyh0aGlzLm1lc3NhZ2U9ZS5tZXNzYWdlLHRoaXMuZ2VuZXJhdGVkTWVzc2FnZT0hMSk6KHRoaXMubWVzc2FnZT1vKHRoaXMpLHRoaXMuZ2VuZXJhdGVkTWVzc2FnZT0hMCk7dmFyIHQ9ZS5zdGFja1N0YXJ0RnVuY3Rpb258fHM7aWYoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcyx0KTtlbHNle3ZhciBuPW5ldyBFcnJvcjtpZihuLnN0YWNrKXt2YXIgcj1uLnN0YWNrLGk9dC5uYW1lLGE9ci5pbmRleE9mKFwiXFxuXCIraSk7aWYoYT49MCl7dmFyIHU9ci5pbmRleE9mKFwiXFxuXCIsYSsxKTtyPXIuc3Vic3RyaW5nKHUrMSl9dGhpcy5zdGFjaz1yfX19LHAuaW5oZXJpdHMoeS5Bc3NlcnRpb25FcnJvcixFcnJvcikseS5mYWlsPXMseS5vaz1hLHkuZXF1YWw9ZnVuY3Rpb24oZSx0LG4pe2UhPXQmJnMoZSx0LG4sXCI9PVwiLHkuZXF1YWwpfSx5Lm5vdEVxdWFsPWZ1bmN0aW9uKGUsdCxuKXtlPT10JiZzKGUsdCxuLFwiIT1cIix5Lm5vdEVxdWFsKX0seS5kZWVwRXF1YWw9ZnVuY3Rpb24oZSx0LG4pe3UoZSx0KXx8cyhlLHQsbixcImRlZXBFcXVhbFwiLHkuZGVlcEVxdWFsKX0seS5ub3REZWVwRXF1YWw9ZnVuY3Rpb24oZSx0LG4pe3UoZSx0KSYmcyhlLHQsbixcIm5vdERlZXBFcXVhbFwiLHkubm90RGVlcEVxdWFsKX0seS5zdHJpY3RFcXVhbD1mdW5jdGlvbihlLHQsbil7ZSE9PXQmJnMoZSx0LG4sXCI9PT1cIix5LnN0cmljdEVxdWFsKX0seS5ub3RTdHJpY3RFcXVhbD1mdW5jdGlvbihlLHQsbil7ZT09PXQmJnMoZSx0LG4sXCIhPT1cIix5Lm5vdFN0cmljdEVxdWFsKX0seVtcInRocm93c1wiXT1mdW5jdGlvbihlLHQsbil7aC5hcHBseSh0aGlzLFshMF0uY29uY2F0KGQuY2FsbChhcmd1bWVudHMpKSl9LHkuZG9lc05vdFRocm93PWZ1bmN0aW9uKGUsdCl7aC5hcHBseSh0aGlzLFshMV0uY29uY2F0KGQuY2FsbChhcmd1bWVudHMpKSl9LHkuaWZFcnJvcj1mdW5jdGlvbihlKXtpZihlKXRocm93IGV9O3ZhciBfPU9iamVjdC5rZXlzfHxmdW5jdGlvbihlKXt2YXIgdD1bXTtmb3IodmFyIG4gaW4gZSlnLmNhbGwoZSxuKSYmdC5wdXNoKG4pO3JldHVybiB0fX0se1widXRpbC9cIjo0NH1dLDY6W2Z1bmN0aW9uKGUsdCxuKXsoZnVuY3Rpb24odCl7XCJ1c2Ugc3RyaWN0XCI7dmFyIHI9ZShcImJ1ZmZlclwiKSxpPXIuQnVmZmVyLG89ci5TbG93QnVmZmVyLHM9ci5rTWF4TGVuZ3RofHwyMTQ3NDgzNjQ3O24uYWxsb2M9ZnVuY3Rpb24oZSx0LG4pe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGkuYWxsb2MpcmV0dXJuIGkuYWxsb2MoZSx0LG4pO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBuKXRocm93IG5ldyBUeXBlRXJyb3IoXCJlbmNvZGluZyBtdXN0IG5vdCBiZSBudW1iZXJcIik7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcInNpemUgbXVzdCBiZSBhIG51bWJlclwiKTtpZihlPnMpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJzaXplIGlzIHRvbyBsYXJnZVwiKTt2YXIgcj1uLG89dDt2b2lkIDA9PT1vJiYocj12b2lkIDAsbz0wKTt2YXIgYT1uZXcgaShlKTtpZihcInN0cmluZ1wiPT10eXBlb2Ygbylmb3IodmFyIHU9bmV3IGkobyxyKSxmPXUubGVuZ3RoLGM9LTE7KytjPGU7KWFbY109dVtjJWZdO2Vsc2UgYS5maWxsKG8pO3JldHVybiBhfSxuLmFsbG9jVW5zYWZlPWZ1bmN0aW9uKGUpe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGkuYWxsb2NVbnNhZmUpcmV0dXJuIGkuYWxsb2NVbnNhZmUoZSk7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcInNpemUgbXVzdCBiZSBhIG51bWJlclwiKTtpZihlPnMpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJzaXplIGlzIHRvbyBsYXJnZVwiKTtyZXR1cm4gbmV3IGkoZSl9LG4uZnJvbT1mdW5jdGlvbihlLG4scil7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgaS5mcm9tJiYoIXQuVWludDhBcnJheXx8VWludDhBcnJheS5mcm9tIT09aS5mcm9tKSlyZXR1cm4gaS5mcm9tKGUsbixyKTtpZihcIm51bWJlclwiPT10eXBlb2YgZSl0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKTtpZihcInN0cmluZ1wiPT10eXBlb2YgZSlyZXR1cm4gbmV3IGkoZSxuKTtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgQXJyYXlCdWZmZXImJmUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcil7dmFyIG89bjtpZigxPT09YXJndW1lbnRzLmxlbmd0aClyZXR1cm4gbmV3IGkoZSk7XCJ1bmRlZmluZWRcIj09dHlwZW9mIG8mJihvPTApO3ZhciBzPXI7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHMmJihzPWUuYnl0ZUxlbmd0aC1vKSxvPj1lLmJ5dGVMZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCInb2Zmc2V0JyBpcyBvdXQgb2YgYm91bmRzXCIpO2lmKHM+ZS5ieXRlTGVuZ3RoLW8pdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCInbGVuZ3RoJyBpcyBvdXQgb2YgYm91bmRzXCIpO3JldHVybiBuZXcgaShlLnNsaWNlKG8sbytzKSl9aWYoaS5pc0J1ZmZlcihlKSl7dmFyIGE9bmV3IGkoZS5sZW5ndGgpO3JldHVybiBlLmNvcHkoYSwwLDAsZS5sZW5ndGgpLGF9aWYoZSl7aWYoQXJyYXkuaXNBcnJheShlKXx8XCJ1bmRlZmluZWRcIiE9dHlwZW9mIEFycmF5QnVmZmVyJiZlLmJ1ZmZlciBpbnN0YW5jZW9mIEFycmF5QnVmZmVyfHxcImxlbmd0aFwiaW4gZSlyZXR1cm4gbmV3IGkoZSk7aWYoXCJCdWZmZXJcIj09PWUudHlwZSYmQXJyYXkuaXNBcnJheShlLmRhdGEpKXJldHVybiBuZXcgaShlLmRhdGEpfXRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuXCIpfSxuLmFsbG9jVW5zYWZlU2xvdz1mdW5jdGlvbihlKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiBpLmFsbG9jVW5zYWZlU2xvdylyZXR1cm4gaS5hbGxvY1Vuc2FmZVNsb3coZSk7aWYoXCJudW1iZXJcIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcInNpemUgbXVzdCBiZSBhIG51bWJlclwiKTtpZihlPj1zKXRocm93IG5ldyBSYW5nZUVycm9yKFwic2l6ZSBpcyB0b28gbGFyZ2VcIik7cmV0dXJuIG5ldyBvKGUpfX0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se2J1ZmZlcjo3fV0sNzpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbih0KXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKCl7dHJ5e3ZhciBlPW5ldyBVaW50OEFycmF5KDEpO3JldHVybiBlLl9fcHJvdG9fXz17X19wcm90b19fOlVpbnQ4QXJyYXkucHJvdG90eXBlLGZvbzpmdW5jdGlvbigpe3JldHVybiA0Mn19LDQyPT09ZS5mb28oKSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5zdWJhcnJheSYmMD09PWUuc3ViYXJyYXkoMSwxKS5ieXRlTGVuZ3RofWNhdGNoKHQpe3JldHVybiExfX1mdW5jdGlvbiBpKCl7cmV0dXJuIHMuVFlQRURfQVJSQVlfU1VQUE9SVD8yMTQ3NDgzNjQ3OjEwNzM3NDE4MjN9ZnVuY3Rpb24gbyhlLHQpe2lmKGkoKTx0KXRocm93IG5ldyBSYW5nZUVycm9yKFwiSW52YWxpZCB0eXBlZCBhcnJheSBsZW5ndGhcIik7cmV0dXJuIHMuVFlQRURfQVJSQVlfU1VQUE9SVD8oZT1uZXcgVWludDhBcnJheSh0KSxlLl9fcHJvdG9fXz1zLnByb3RvdHlwZSk6KG51bGw9PT1lJiYoZT1uZXcgcyh0KSksZS5sZW5ndGg9dCksZX1mdW5jdGlvbiBzKGUsdCxuKXtpZighKHMuVFlQRURfQVJSQVlfU1VQUE9SVHx8dGhpcyBpbnN0YW5jZW9mIHMpKXJldHVybiBuZXcgcyhlLHQsbik7aWYoXCJudW1iZXJcIj09dHlwZW9mIGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0KXRocm93IG5ldyBFcnJvcihcIklmIGVuY29kaW5nIGlzIHNwZWNpZmllZCB0aGVuIHRoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nXCIpO3JldHVybiBjKHRoaXMsZSl9cmV0dXJuIGEodGhpcyxlLHQsbil9ZnVuY3Rpb24gYShlLHQsbixyKXtpZihcIm51bWJlclwiPT10eXBlb2YgdCl0aHJvdyBuZXcgVHlwZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKTtyZXR1cm5cInVuZGVmaW5lZFwiIT10eXBlb2YgQXJyYXlCdWZmZXImJnQgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcj9wKGUsdCxuLHIpOlwic3RyaW5nXCI9PXR5cGVvZiB0P2woZSx0LG4pOmQoZSx0KX1mdW5jdGlvbiB1KGUpe2lmKFwibnVtYmVyXCIhPXR5cGVvZiBlKXRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKX1mdW5jdGlvbiBmKGUsdCxuLHIpe3JldHVybiB1KHQpLHQ8PTA/byhlLHQpOnZvaWQgMCE9PW4/XCJzdHJpbmdcIj09dHlwZW9mIHI/byhlLHQpLmZpbGwobixyKTpvKGUsdCkuZmlsbChuKTpvKGUsdCl9ZnVuY3Rpb24gYyhlLHQpe2lmKHUodCksZT1vKGUsdDwwPzA6MHxnKHQpKSwhcy5UWVBFRF9BUlJBWV9TVVBQT1JUKWZvcih2YXIgbj0wO248dDsrK24pZVtuXT0wO3JldHVybiBlfWZ1bmN0aW9uIGwoZSx0LG4pe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBuJiZcIlwiIT09bnx8KG49XCJ1dGY4XCIpLCFzLmlzRW5jb2RpbmcobikpdGhyb3cgbmV3IFR5cGVFcnJvcignXCJlbmNvZGluZ1wiIG11c3QgYmUgYSB2YWxpZCBzdHJpbmcgZW5jb2RpbmcnKTt2YXIgcj0wfF8odCxuKTtyZXR1cm4gZT1vKGUsciksZS53cml0ZSh0LG4pLGV9ZnVuY3Rpb24gaChlLHQpe3ZhciBuPTB8Zyh0Lmxlbmd0aCk7ZT1vKGUsbik7Zm9yKHZhciByPTA7cjxuO3IrPTEpZVtyXT0yNTUmdFtyXTtyZXR1cm4gZX1mdW5jdGlvbiBwKGUsdCxuLHIpe2lmKHQuYnl0ZUxlbmd0aCxuPDB8fHQuYnl0ZUxlbmd0aDxuKXRocm93IG5ldyBSYW5nZUVycm9yKFwiJ29mZnNldCcgaXMgb3V0IG9mIGJvdW5kc1wiKTtpZih0LmJ5dGVMZW5ndGg8bisocnx8MCkpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCInbGVuZ3RoJyBpcyBvdXQgb2YgYm91bmRzXCIpO3JldHVybiB0PXZvaWQgMD09PW4mJnZvaWQgMD09PXI/bmV3IFVpbnQ4QXJyYXkodCk6dm9pZCAwPT09cj9uZXcgVWludDhBcnJheSh0LG4pOm5ldyBVaW50OEFycmF5KHQsbixyKSxzLlRZUEVEX0FSUkFZX1NVUFBPUlQ/KGU9dCxlLl9fcHJvdG9fXz1zLnByb3RvdHlwZSk6ZT1oKGUsdCksZX1mdW5jdGlvbiBkKGUsdCl7aWYocy5pc0J1ZmZlcih0KSl7dmFyIG49MHxnKHQubGVuZ3RoKTtyZXR1cm4gZT1vKGUsbiksMD09PWUubGVuZ3RoP2U6KHQuY29weShlLDAsMCxuKSxlKX1pZih0KXtpZihcInVuZGVmaW5lZFwiIT10eXBlb2YgQXJyYXlCdWZmZXImJnQuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXJ8fFwibGVuZ3RoXCJpbiB0KXJldHVyblwibnVtYmVyXCIhPXR5cGVvZiB0Lmxlbmd0aHx8WCh0Lmxlbmd0aCk/byhlLDApOmgoZSx0KTtpZihcIkJ1ZmZlclwiPT09dC50eXBlJiYkKHQuZGF0YSkpcmV0dXJuIGgoZSx0LmRhdGEpfXRocm93IG5ldyBUeXBlRXJyb3IoXCJGaXJzdCBhcmd1bWVudCBtdXN0IGJlIGEgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgb3IgYXJyYXktbGlrZSBvYmplY3QuXCIpfWZ1bmN0aW9uIGcoZSl7aWYoZT49aSgpKXRocm93IG5ldyBSYW5nZUVycm9yKFwiQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSBzaXplOiAweFwiK2koKS50b1N0cmluZygxNikrXCIgYnl0ZXNcIik7cmV0dXJuIDB8ZX1mdW5jdGlvbiB5KGUpe3JldHVybitlIT1lJiYoZT0wKSxzLmFsbG9jKCtlKX1mdW5jdGlvbiBfKGUsdCl7aWYocy5pc0J1ZmZlcihlKSlyZXR1cm4gZS5sZW5ndGg7aWYoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIEFycmF5QnVmZmVyJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBBcnJheUJ1ZmZlci5pc1ZpZXcmJihBcnJheUJ1ZmZlci5pc1ZpZXcoZSl8fGUgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikpcmV0dXJuIGUuYnl0ZUxlbmd0aDtcInN0cmluZ1wiIT10eXBlb2YgZSYmKGU9XCJcIitlKTt2YXIgbj1lLmxlbmd0aDtpZigwPT09bilyZXR1cm4gMDtmb3IodmFyIHI9ITE7Oylzd2l0Y2godCl7Y2FzZVwiYXNjaWlcIjpjYXNlXCJiaW5hcnlcIjpjYXNlXCJyYXdcIjpjYXNlXCJyYXdzXCI6cmV0dXJuIG47Y2FzZVwidXRmOFwiOmNhc2VcInV0Zi04XCI6Y2FzZSB2b2lkIDA6cmV0dXJuIHEoZSkubGVuZ3RoO2Nhc2VcInVjczJcIjpjYXNlXCJ1Y3MtMlwiOmNhc2VcInV0ZjE2bGVcIjpjYXNlXCJ1dGYtMTZsZVwiOnJldHVybiAyKm47Y2FzZVwiaGV4XCI6cmV0dXJuIG4+Pj4xO2Nhc2VcImJhc2U2NFwiOnJldHVybiBXKGUpLmxlbmd0aDtkZWZhdWx0OmlmKHIpcmV0dXJuIHEoZSkubGVuZ3RoO3Q9KFwiXCIrdCkudG9Mb3dlckNhc2UoKSxyPSEwfX1mdW5jdGlvbiB2KGUsdCxuKXt2YXIgcj0hMTtpZigodm9pZCAwPT09dHx8dDwwKSYmKHQ9MCksdD50aGlzLmxlbmd0aClyZXR1cm5cIlwiO2lmKCh2b2lkIDA9PT1ufHxuPnRoaXMubGVuZ3RoKSYmKG49dGhpcy5sZW5ndGgpLG48PTApcmV0dXJuXCJcIjtpZihuPj4+PTAsdD4+Pj0wLG48PXQpcmV0dXJuXCJcIjtmb3IoZXx8KGU9XCJ1dGY4XCIpOzspc3dpdGNoKGUpe2Nhc2VcImhleFwiOnJldHVybiBDKHRoaXMsdCxuKTtjYXNlXCJ1dGY4XCI6Y2FzZVwidXRmLThcIjpyZXR1cm4gSSh0aGlzLHQsbik7Y2FzZVwiYXNjaWlcIjpyZXR1cm4gTih0aGlzLHQsbik7Y2FzZVwiYmluYXJ5XCI6cmV0dXJuIFAodGhpcyx0LG4pO2Nhc2VcImJhc2U2NFwiOnJldHVybiBUKHRoaXMsdCxuKTtjYXNlXCJ1Y3MyXCI6Y2FzZVwidWNzLTJcIjpjYXNlXCJ1dGYxNmxlXCI6Y2FzZVwidXRmLTE2bGVcIjpyZXR1cm4gTSh0aGlzLHQsbik7ZGVmYXVsdDppZihyKXRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmtub3duIGVuY29kaW5nOiBcIitlKTtlPShlK1wiXCIpLnRvTG93ZXJDYXNlKCkscj0hMH19ZnVuY3Rpb24gbShlLHQsbil7dmFyIHI9ZVt0XTtlW3RdPWVbbl0sZVtuXT1yfWZ1bmN0aW9uIEUoZSx0LG4scil7ZnVuY3Rpb24gaShlLHQpe3JldHVybiAxPT09bz9lW3RdOmUucmVhZFVJbnQxNkJFKHQqbyl9dmFyIG89MSxzPWUubGVuZ3RoLGE9dC5sZW5ndGg7aWYodm9pZCAwIT09ciYmKHI9U3RyaW5nKHIpLnRvTG93ZXJDYXNlKCksXCJ1Y3MyXCI9PT1yfHxcInVjcy0yXCI9PT1yfHxcInV0ZjE2bGVcIj09PXJ8fFwidXRmLTE2bGVcIj09PXIpKXtpZihlLmxlbmd0aDwyfHx0Lmxlbmd0aDwyKXJldHVybi0xO289MixzLz0yLGEvPTIsbi89Mn1mb3IodmFyIHU9LTEsZj1uO2Y8czsrK2YpaWYoaShlLGYpPT09aSh0LHU9PT0tMT8wOmYtdSkpe2lmKHU9PT0tMSYmKHU9ZiksZi11KzE9PT1hKXJldHVybiB1Km99ZWxzZSB1IT09LTEmJihmLT1mLXUpLHU9LTE7cmV0dXJuLTF9ZnVuY3Rpb24gdyhlLHQsbixyKXtuPU51bWJlcihuKXx8MDt2YXIgaT1lLmxlbmd0aC1uO3I/KHI9TnVtYmVyKHIpLHI+aSYmKHI9aSkpOnI9aTt2YXIgbz10Lmxlbmd0aDtpZihvJTIhPT0wKXRocm93IG5ldyBFcnJvcihcIkludmFsaWQgaGV4IHN0cmluZ1wiKTtyPm8vMiYmKHI9by8yKTtmb3IodmFyIHM9MDtzPHI7KytzKXt2YXIgYT1wYXJzZUludCh0LnN1YnN0cigyKnMsMiksMTYpO2lmKGlzTmFOKGEpKXJldHVybiBzO2VbbitzXT1hfXJldHVybiBzfWZ1bmN0aW9uIGIoZSx0LG4scil7cmV0dXJuIFYocSh0LGUubGVuZ3RoLW4pLGUsbixyKX1mdW5jdGlvbiBTKGUsdCxuLHIpe3JldHVybiBWKEsodCksZSxuLHIpfWZ1bmN0aW9uIE8oZSx0LG4scil7cmV0dXJuIFMoZSx0LG4scil9ZnVuY3Rpb24gUihlLHQsbixyKXtyZXR1cm4gVihXKHQpLGUsbixyKX1mdW5jdGlvbiBBKGUsdCxuLHIpe3JldHVybiBWKHoodCxlLmxlbmd0aC1uKSxlLG4scil9ZnVuY3Rpb24gVChlLHQsbil7cmV0dXJuIDA9PT10JiZuPT09ZS5sZW5ndGg/Si5mcm9tQnl0ZUFycmF5KGUpOkouZnJvbUJ5dGVBcnJheShlLnNsaWNlKHQsbikpfWZ1bmN0aW9uIEkoZSx0LG4pe249TWF0aC5taW4oZS5sZW5ndGgsbik7Zm9yKHZhciByPVtdLGk9dDtpPG47KXt2YXIgbz1lW2ldLHM9bnVsbCxhPW8+MjM5PzQ6bz4yMjM/MzpvPjE5MT8yOjE7aWYoaSthPD1uKXt2YXIgdSxmLGMsbDtzd2l0Y2goYSl7Y2FzZSAxOm88MTI4JiYocz1vKTticmVhaztjYXNlIDI6dT1lW2krMV0sMTI4PT09KDE5MiZ1KSYmKGw9KDMxJm8pPDw2fDYzJnUsbD4xMjcmJihzPWwpKTticmVhaztjYXNlIDM6dT1lW2krMV0sZj1lW2krMl0sMTI4PT09KDE5MiZ1KSYmMTI4PT09KDE5MiZmKSYmKGw9KDE1Jm8pPDwxMnwoNjMmdSk8PDZ8NjMmZixsPjIwNDcmJihsPDU1Mjk2fHxsPjU3MzQzKSYmKHM9bCkpO2JyZWFrO2Nhc2UgNDp1PWVbaSsxXSxmPWVbaSsyXSxjPWVbaSszXSwxMjg9PT0oMTkyJnUpJiYxMjg9PT0oMTkyJmYpJiYxMjg9PT0oMTkyJmMpJiYobD0oMTUmbyk8PDE4fCg2MyZ1KTw8MTJ8KDYzJmYpPDw2fDYzJmMsbD42NTUzNSYmbDwxMTE0MTEyJiYocz1sKSl9fW51bGw9PT1zPyhzPTY1NTMzLGE9MSk6cz42NTUzNSYmKHMtPTY1NTM2LHIucHVzaChzPj4+MTAmMTAyM3w1NTI5Nikscz01NjMyMHwxMDIzJnMpLHIucHVzaChzKSxpKz1hfXJldHVybiBMKHIpfWZ1bmN0aW9uIEwoZSl7dmFyIHQ9ZS5sZW5ndGg7aWYodDw9WilyZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsZSk7Zm9yKHZhciBuPVwiXCIscj0wO3I8dDspbis9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsZS5zbGljZShyLHIrPVopKTtyZXR1cm4gbn1mdW5jdGlvbiBOKGUsdCxuKXt2YXIgcj1cIlwiO249TWF0aC5taW4oZS5sZW5ndGgsbik7Zm9yKHZhciBpPXQ7aTxuOysraSlyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKDEyNyZlW2ldKTtyZXR1cm4gcn1mdW5jdGlvbiBQKGUsdCxuKXt2YXIgcj1cIlwiO249TWF0aC5taW4oZS5sZW5ndGgsbik7Zm9yKHZhciBpPXQ7aTxuOysraSlyKz1TdHJpbmcuZnJvbUNoYXJDb2RlKGVbaV0pO3JldHVybiByfWZ1bmN0aW9uIEMoZSx0LG4pe3ZhciByPWUubGVuZ3RoOyghdHx8dDwwKSYmKHQ9MCksKCFufHxuPDB8fG4+cikmJihuPXIpO2Zvcih2YXIgaT1cIlwiLG89dDtvPG47KytvKWkrPUgoZVtvXSk7cmV0dXJuIGl9ZnVuY3Rpb24gTShlLHQsbil7Zm9yKHZhciByPWUuc2xpY2UodCxuKSxpPVwiXCIsbz0wO288ci5sZW5ndGg7bys9MilpKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHJbb10rMjU2KnJbbysxXSk7cmV0dXJuIGl9ZnVuY3Rpb24geChlLHQsbil7aWYoZSUxIT09MHx8ZTwwKXRocm93IG5ldyBSYW5nZUVycm9yKFwib2Zmc2V0IGlzIG5vdCB1aW50XCIpO2lmKGUrdD5uKXRocm93IG5ldyBSYW5nZUVycm9yKFwiVHJ5aW5nIHRvIGFjY2VzcyBiZXlvbmQgYnVmZmVyIGxlbmd0aFwiKX1mdW5jdGlvbiBEKGUsdCxuLHIsaSxvKXtpZighcy5pc0J1ZmZlcihlKSl0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKTtpZih0Pml8fHQ8byl0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJ2YWx1ZVwiIGFyZ3VtZW50IGlzIG91dCBvZiBib3VuZHMnKTtpZihuK3I+ZS5sZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJJbmRleCBvdXQgb2YgcmFuZ2VcIil9ZnVuY3Rpb24gaihlLHQsbixyKXt0PDAmJih0PTY1NTM1K3QrMSk7Zm9yKHZhciBpPTAsbz1NYXRoLm1pbihlLmxlbmd0aC1uLDIpO2k8bzsrK2kpZVtuK2ldPSh0JjI1NTw8OCoocj9pOjEtaSkpPj4+OCoocj9pOjEtaSl9ZnVuY3Rpb24gVShlLHQsbixyKXt0PDAmJih0PTQyOTQ5NjcyOTUrdCsxKTtmb3IodmFyIGk9MCxvPU1hdGgubWluKGUubGVuZ3RoLW4sNCk7aTxvOysraSllW24raV09dD4+PjgqKHI/aTozLWkpJjI1NX1mdW5jdGlvbiBrKGUsdCxuLHIsaSxvKXtpZihuK3I+ZS5sZW5ndGgpdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJJbmRleCBvdXQgb2YgcmFuZ2VcIik7aWYobjwwKXRocm93IG5ldyBSYW5nZUVycm9yKFwiSW5kZXggb3V0IG9mIHJhbmdlXCIpfWZ1bmN0aW9uIEIoZSx0LG4scixpKXtyZXR1cm4gaXx8ayhlLHQsbiw0LDMuNDAyODIzNDY2Mzg1Mjg4NmUzOCwtMy40MDI4MjM0NjYzODUyODg2ZTM4KSxRLndyaXRlKGUsdCxuLHIsMjMsNCksbis0fWZ1bmN0aW9uIEcoZSx0LG4scixpKXtyZXR1cm4gaXx8ayhlLHQsbiw4LDEuNzk3NjkzMTM0ODYyMzE1N2UzMDgsLTEuNzk3NjkzMTM0ODYyMzE1N2UzMDgpLFEud3JpdGUoZSx0LG4sciw1Miw4KSxuKzh9ZnVuY3Rpb24gRihlKXtpZihlPVkoZSkucmVwbGFjZShlZSxcIlwiKSxlLmxlbmd0aDwyKXJldHVyblwiXCI7Zm9yKDtlLmxlbmd0aCU0IT09MDspZSs9XCI9XCI7cmV0dXJuIGV9ZnVuY3Rpb24gWShlKXtyZXR1cm4gZS50cmltP2UudHJpbSgpOmUucmVwbGFjZSgvXlxccyt8XFxzKyQvZyxcIlwiKX1mdW5jdGlvbiBIKGUpe3JldHVybiBlPDE2P1wiMFwiK2UudG9TdHJpbmcoMTYpOmUudG9TdHJpbmcoMTYpfWZ1bmN0aW9uIHEoZSx0KXt0PXR8fDEvMDtmb3IodmFyIG4scj1lLmxlbmd0aCxpPW51bGwsbz1bXSxzPTA7czxyOysrcyl7aWYobj1lLmNoYXJDb2RlQXQocyksbj41NTI5NSYmbjw1NzM0NCl7aWYoIWkpe2lmKG4+NTYzMTkpeyh0LT0zKT4tMSYmby5wdXNoKDIzOSwxOTEsMTg5KTtjb250aW51ZX1pZihzKzE9PT1yKXsodC09Myk+LTEmJm8ucHVzaCgyMzksMTkxLDE4OSk7Y29udGludWV9aT1uO2NvbnRpbnVlfWlmKG48NTYzMjApeyh0LT0zKT4tMSYmby5wdXNoKDIzOSwxOTEsMTg5KSxpPW47Y29udGludWV9bj0oaS01NTI5Njw8MTB8bi01NjMyMCkrNjU1MzZ9ZWxzZSBpJiYodC09Myk+LTEmJm8ucHVzaCgyMzksMTkxLDE4OSk7aWYoaT1udWxsLG48MTI4KXtpZigodC09MSk8MClicmVhaztvLnB1c2gobil9ZWxzZSBpZihuPDIwNDgpe2lmKCh0LT0yKTwwKWJyZWFrO28ucHVzaChuPj42fDE5Miw2MyZufDEyOCl9ZWxzZSBpZihuPDY1NTM2KXtpZigodC09Myk8MClicmVhaztvLnB1c2gobj4+MTJ8MjI0LG4+PjYmNjN8MTI4LDYzJm58MTI4KX1lbHNle2lmKCEobjwxMTE0MTEyKSl0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGNvZGUgcG9pbnRcIik7aWYoKHQtPTQpPDApYnJlYWs7by5wdXNoKG4+PjE4fDI0MCxuPj4xMiY2M3wxMjgsbj4+NiY2M3wxMjgsNjMmbnwxMjgpfX1yZXR1cm4gb31mdW5jdGlvbiBLKGUpe2Zvcih2YXIgdD1bXSxuPTA7bjxlLmxlbmd0aDsrK24pdC5wdXNoKDI1NSZlLmNoYXJDb2RlQXQobikpO3JldHVybiB0fWZ1bmN0aW9uIHooZSx0KXtmb3IodmFyIG4scixpLG89W10scz0wO3M8ZS5sZW5ndGgmJiEoKHQtPTIpPDApOysrcyluPWUuY2hhckNvZGVBdChzKSxyPW4+PjgsaT1uJTI1NixvLnB1c2goaSksby5wdXNoKHIpO3JldHVybiBvfWZ1bmN0aW9uIFcoZSl7cmV0dXJuIEoudG9CeXRlQXJyYXkoRihlKSl9ZnVuY3Rpb24gVihlLHQsbixyKXtmb3IodmFyIGk9MDtpPHImJiEoaStuPj10Lmxlbmd0aHx8aT49ZS5sZW5ndGgpOysraSl0W2krbl09ZVtpXTtyZXR1cm4gaX1mdW5jdGlvbiBYKGUpe3JldHVybiBlIT09ZX12YXIgSj1lKFwiYmFzZTY0LWpzXCIpLFE9ZShcImllZWU3NTRcIiksJD1lKFwiaXNhcnJheVwiKTtuLkJ1ZmZlcj1zLG4uU2xvd0J1ZmZlcj15LG4uSU5TUEVDVF9NQVhfQllURVM9NTAscy5UWVBFRF9BUlJBWV9TVVBQT1JUPXZvaWQgMCE9PXQuVFlQRURfQVJSQVlfU1VQUE9SVD90LlRZUEVEX0FSUkFZX1NVUFBPUlQ6cigpLG4ua01heExlbmd0aD1pKCkscy5wb29sU2l6ZT04MTkyLHMuX2F1Z21lbnQ9ZnVuY3Rpb24oZSl7cmV0dXJuIGUuX19wcm90b19fPXMucHJvdG90eXBlLGV9LHMuZnJvbT1mdW5jdGlvbihlLHQsbil7cmV0dXJuIGEobnVsbCxlLHQsbil9LHMuVFlQRURfQVJSQVlfU1VQUE9SVCYmKHMucHJvdG90eXBlLl9fcHJvdG9fXz1VaW50OEFycmF5LnByb3RvdHlwZSxzLl9fcHJvdG9fXz1VaW50OEFycmF5LFwidW5kZWZpbmVkXCIhPXR5cGVvZiBTeW1ib2wmJlN5bWJvbC5zcGVjaWVzJiZzW1N5bWJvbC5zcGVjaWVzXT09PXMmJk9iamVjdC5kZWZpbmVQcm9wZXJ0eShzLFN5bWJvbC5zcGVjaWVzLHt2YWx1ZTpudWxsLGNvbmZpZ3VyYWJsZTohMH0pKSxzLmFsbG9jPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZihudWxsLGUsdCxuKX0scy5hbGxvY1Vuc2FmZT1mdW5jdGlvbihlKXtyZXR1cm4gYyhudWxsLGUpfSxzLmFsbG9jVW5zYWZlU2xvdz1mdW5jdGlvbihlKXtyZXR1cm4gYyhudWxsLGUpfSxzLmlzQnVmZmVyPWZ1bmN0aW9uKGUpe3JldHVybiEobnVsbD09ZXx8IWUuX2lzQnVmZmVyKX0scy5jb21wYXJlPWZ1bmN0aW9uKGUsdCl7aWYoIXMuaXNCdWZmZXIoZSl8fCFzLmlzQnVmZmVyKHQpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudHMgbXVzdCBiZSBCdWZmZXJzXCIpO2lmKGU9PT10KXJldHVybiAwO2Zvcih2YXIgbj1lLmxlbmd0aCxyPXQubGVuZ3RoLGk9MCxvPU1hdGgubWluKG4scik7aTxvOysraSlpZihlW2ldIT09dFtpXSl7bj1lW2ldLHI9dFtpXTticmVha31yZXR1cm4gbjxyPy0xOnI8bj8xOjB9LHMuaXNFbmNvZGluZz1mdW5jdGlvbihlKXtzd2l0Y2goU3RyaW5nKGUpLnRvTG93ZXJDYXNlKCkpe2Nhc2VcImhleFwiOmNhc2VcInV0ZjhcIjpjYXNlXCJ1dGYtOFwiOmNhc2VcImFzY2lpXCI6Y2FzZVwiYmluYXJ5XCI6Y2FzZVwiYmFzZTY0XCI6Y2FzZVwicmF3XCI6Y2FzZVwidWNzMlwiOmNhc2VcInVjcy0yXCI6Y2FzZVwidXRmMTZsZVwiOmNhc2VcInV0Zi0xNmxlXCI6cmV0dXJuITA7ZGVmYXVsdDpyZXR1cm4hMX19LHMuY29uY2F0PWZ1bmN0aW9uKGUsdCl7aWYoISQoZSkpdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJyk7aWYoMD09PWUubGVuZ3RoKXJldHVybiBzLmFsbG9jKDApO3ZhciBuO2lmKHZvaWQgMD09PXQpZm9yKHQ9MCxuPTA7bjxlLmxlbmd0aDsrK24pdCs9ZVtuXS5sZW5ndGg7dmFyIHI9cy5hbGxvY1Vuc2FmZSh0KSxpPTA7Zm9yKG49MDtuPGUubGVuZ3RoOysrbil7dmFyIG89ZVtuXTtpZighcy5pc0J1ZmZlcihvKSl0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKTtvLmNvcHkocixpKSxpKz1vLmxlbmd0aH1yZXR1cm4gcn0scy5ieXRlTGVuZ3RoPV8scy5wcm90b3R5cGUuX2lzQnVmZmVyPSEwLHMucHJvdG90eXBlLnN3YXAxNj1mdW5jdGlvbigpe3ZhciBlPXRoaXMubGVuZ3RoO2lmKGUlMiE9PTApdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0c1wiKTtmb3IodmFyIHQ9MDt0PGU7dCs9MiltKHRoaXMsdCx0KzEpO3JldHVybiB0aGlzfSxzLnByb3RvdHlwZS5zd2FwMzI9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmxlbmd0aDtpZihlJTQhPT0wKXRocm93IG5ldyBSYW5nZUVycm9yKFwiQnVmZmVyIHNpemUgbXVzdCBiZSBhIG11bHRpcGxlIG9mIDMyLWJpdHNcIik7Zm9yKHZhciB0PTA7dDxlO3QrPTQpbSh0aGlzLHQsdCszKSxtKHRoaXMsdCsxLHQrMik7cmV0dXJuIHRoaXN9LHMucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7dmFyIGU9MHx0aGlzLmxlbmd0aDtyZXR1cm4gMD09PWU/XCJcIjowPT09YXJndW1lbnRzLmxlbmd0aD9JKHRoaXMsMCxlKTp2LmFwcGx5KHRoaXMsYXJndW1lbnRzKX0scy5wcm90b3R5cGUuZXF1YWxzPWZ1bmN0aW9uKGUpe2lmKCFzLmlzQnVmZmVyKGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyXCIpO3JldHVybiB0aGlzPT09ZXx8MD09PXMuY29tcGFyZSh0aGlzLGUpfSxzLnByb3RvdHlwZS5pbnNwZWN0PWZ1bmN0aW9uKCl7dmFyIGU9XCJcIix0PW4uSU5TUEVDVF9NQVhfQllURVM7cmV0dXJuIHRoaXMubGVuZ3RoPjAmJihlPXRoaXMudG9TdHJpbmcoXCJoZXhcIiwwLHQpLm1hdGNoKC8uezJ9L2cpLmpvaW4oXCIgXCIpLHRoaXMubGVuZ3RoPnQmJihlKz1cIiAuLi4gXCIpKSxcIjxCdWZmZXIgXCIrZStcIj5cIn0scy5wcm90b3R5cGUuY29tcGFyZT1mdW5jdGlvbihlLHQsbixyLGkpe2lmKCFzLmlzQnVmZmVyKGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyXCIpO2lmKHZvaWQgMD09PXQmJih0PTApLHZvaWQgMD09PW4mJihuPWU/ZS5sZW5ndGg6MCksdm9pZCAwPT09ciYmKHI9MCksdm9pZCAwPT09aSYmKGk9dGhpcy5sZW5ndGgpLHQ8MHx8bj5lLmxlbmd0aHx8cjwwfHxpPnRoaXMubGVuZ3RoKXRocm93IG5ldyBSYW5nZUVycm9yKFwib3V0IG9mIHJhbmdlIGluZGV4XCIpO2lmKHI+PWkmJnQ+PW4pcmV0dXJuIDA7aWYocj49aSlyZXR1cm4tMTtpZih0Pj1uKXJldHVybiAxO2lmKHQ+Pj49MCxuPj4+PTAscj4+Pj0wLGk+Pj49MCx0aGlzPT09ZSlyZXR1cm4gMDtmb3IodmFyIG89aS1yLGE9bi10LHU9TWF0aC5taW4obyxhKSxmPXRoaXMuc2xpY2UocixpKSxjPWUuc2xpY2UodCxuKSxsPTA7bDx1OysrbClpZihmW2xdIT09Y1tsXSl7bz1mW2xdLGE9Y1tsXTticmVha31yZXR1cm4gbzxhPy0xOmE8bz8xOjB9LHMucHJvdG90eXBlLmluZGV4T2Y9ZnVuY3Rpb24oZSx0LG4pe2lmKFwic3RyaW5nXCI9PXR5cGVvZiB0PyhuPXQsdD0wKTp0PjIxNDc0ODM2NDc/dD0yMTQ3NDgzNjQ3OnQ8LTIxNDc0ODM2NDgmJih0PS0yMTQ3NDgzNjQ4KSx0Pj49MCwwPT09dGhpcy5sZW5ndGgpcmV0dXJuLTE7aWYodD49dGhpcy5sZW5ndGgpcmV0dXJuLTE7aWYodDwwJiYodD1NYXRoLm1heCh0aGlzLmxlbmd0aCt0LDApKSxcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9cy5mcm9tKGUsbikpLHMuaXNCdWZmZXIoZSkpcmV0dXJuIDA9PT1lLmxlbmd0aD8tMTpFKHRoaXMsZSx0LG4pO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBlKXJldHVybiBzLlRZUEVEX0FSUkFZX1NVUFBPUlQmJlwiZnVuY3Rpb25cIj09PVVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2Y/VWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKHRoaXMsZSx0KTpFKHRoaXMsW2VdLHQsbik7dGhyb3cgbmV3IFR5cGVFcnJvcihcInZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlclwiKX0scy5wcm90b3R5cGUuaW5jbHVkZXM9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiB0aGlzLmluZGV4T2YoZSx0LG4pIT09LTF9LHMucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKGUsdCxuLHIpe2lmKHZvaWQgMD09PXQpcj1cInV0ZjhcIixuPXRoaXMubGVuZ3RoLHQ9MDtlbHNlIGlmKHZvaWQgMD09PW4mJlwic3RyaW5nXCI9PXR5cGVvZiB0KXI9dCxuPXRoaXMubGVuZ3RoLHQ9MDtlbHNle2lmKCFpc0Zpbml0ZSh0KSl0aHJvdyBuZXcgRXJyb3IoXCJCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZFwiKTt0PTB8dCxpc0Zpbml0ZShuKT8obj0wfG4sdm9pZCAwPT09ciYmKHI9XCJ1dGY4XCIpKToocj1uLG49dm9pZCAwKX12YXIgaT10aGlzLmxlbmd0aC10O2lmKCh2b2lkIDA9PT1ufHxuPmkpJiYobj1pKSxlLmxlbmd0aD4wJiYobjwwfHx0PDApfHx0PnRoaXMubGVuZ3RoKXRocm93IG5ldyBSYW5nZUVycm9yKFwiQXR0ZW1wdCB0byB3cml0ZSBvdXRzaWRlIGJ1ZmZlciBib3VuZHNcIik7cnx8KHI9XCJ1dGY4XCIpO2Zvcih2YXIgbz0hMTs7KXN3aXRjaChyKXtjYXNlXCJoZXhcIjpyZXR1cm4gdyh0aGlzLGUsdCxuKTtjYXNlXCJ1dGY4XCI6Y2FzZVwidXRmLThcIjpyZXR1cm4gYih0aGlzLGUsdCxuKTtjYXNlXCJhc2NpaVwiOnJldHVybiBTKHRoaXMsZSx0LG4pO2Nhc2VcImJpbmFyeVwiOnJldHVybiBPKHRoaXMsZSx0LG4pO2Nhc2VcImJhc2U2NFwiOnJldHVybiBSKHRoaXMsZSx0LG4pO2Nhc2VcInVjczJcIjpjYXNlXCJ1Y3MtMlwiOmNhc2VcInV0ZjE2bGVcIjpjYXNlXCJ1dGYtMTZsZVwiOnJldHVybiBBKHRoaXMsZSx0LG4pO2RlZmF1bHQ6aWYobyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5rbm93biBlbmNvZGluZzogXCIrcik7cj0oXCJcIityKS50b0xvd2VyQ2FzZSgpLG89ITB9fSxzLnByb3RvdHlwZS50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm57dHlwZTpcIkJ1ZmZlclwiLGRhdGE6QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyfHx0aGlzLDApfX07dmFyIFo9NDA5NjtzLnByb3RvdHlwZS5zbGljZT1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMubGVuZ3RoO2U9fn5lLHQ9dm9pZCAwPT09dD9uOn5+dCxlPDA/KGUrPW4sZTwwJiYoZT0wKSk6ZT5uJiYoZT1uKSx0PDA/KHQrPW4sdDwwJiYodD0wKSk6dD5uJiYodD1uKSx0PGUmJih0PWUpO3ZhciByO2lmKHMuVFlQRURfQVJSQVlfU1VQUE9SVClyPXRoaXMuc3ViYXJyYXkoZSx0KSxyLl9fcHJvdG9fXz1zLnByb3RvdHlwZTtlbHNle3ZhciBpPXQtZTtyPW5ldyBzKGksKHZvaWQgMCkpO2Zvcih2YXIgbz0wO288aTsrK28pcltvXT10aGlzW28rZV19cmV0dXJuIHJ9LHMucHJvdG90eXBlLnJlYWRVSW50TEU9ZnVuY3Rpb24oZSx0LG4pe2U9MHxlLHQ9MHx0LG58fHgoZSx0LHRoaXMubGVuZ3RoKTtmb3IodmFyIHI9dGhpc1tlXSxpPTEsbz0wOysrbzx0JiYoaSo9MjU2KTspcis9dGhpc1tlK29dKmk7cmV0dXJuIHJ9LHMucHJvdG90eXBlLnJlYWRVSW50QkU9ZnVuY3Rpb24oZSx0LG4pe2U9MHxlLHQ9MHx0LG58fHgoZSx0LHRoaXMubGVuZ3RoKTtmb3IodmFyIHI9dGhpc1tlKy0tdF0saT0xO3Q+MCYmKGkqPTI1Nik7KXIrPXRoaXNbZSstLXRdKmk7cmV0dXJuIHJ9LHMucHJvdG90eXBlLnJlYWRVSW50OD1mdW5jdGlvbihlLHQpe3JldHVybiB0fHx4KGUsMSx0aGlzLmxlbmd0aCksdGhpc1tlXX0scy5wcm90b3R5cGUucmVhZFVJbnQxNkxFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHR8fHgoZSwyLHRoaXMubGVuZ3RoKSx0aGlzW2VdfHRoaXNbZSsxXTw8OH0scy5wcm90b3R5cGUucmVhZFVJbnQxNkJFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHR8fHgoZSwyLHRoaXMubGVuZ3RoKSx0aGlzW2VdPDw4fHRoaXNbZSsxXX0scy5wcm90b3R5cGUucmVhZFVJbnQzMkxFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHR8fHgoZSw0LHRoaXMubGVuZ3RoKSwodGhpc1tlXXx0aGlzW2UrMV08PDh8dGhpc1tlKzJdPDwxNikrMTY3NzcyMTYqdGhpc1tlKzNdfSxzLnByb3RvdHlwZS5yZWFkVUludDMyQkU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdHx8eChlLDQsdGhpcy5sZW5ndGgpLDE2Nzc3MjE2KnRoaXNbZV0rKHRoaXNbZSsxXTw8MTZ8dGhpc1tlKzJdPDw4fHRoaXNbZSszXSl9LHMucHJvdG90eXBlLnJlYWRJbnRMRT1mdW5jdGlvbihlLHQsbil7ZT0wfGUsdD0wfHQsbnx8eChlLHQsdGhpcy5sZW5ndGgpO2Zvcih2YXIgcj10aGlzW2VdLGk9MSxvPTA7KytvPHQmJihpKj0yNTYpOylyKz10aGlzW2Urb10qaTtyZXR1cm4gaSo9MTI4LHI+PWkmJihyLT1NYXRoLnBvdygyLDgqdCkpLHJ9LHMucHJvdG90eXBlLnJlYWRJbnRCRT1mdW5jdGlvbihlLHQsbil7ZT0wfGUsdD0wfHQsbnx8eChlLHQsdGhpcy5sZW5ndGgpO2Zvcih2YXIgcj10LGk9MSxvPXRoaXNbZSstLXJdO3I+MCYmKGkqPTI1Nik7KW8rPXRoaXNbZSstLXJdKmk7cmV0dXJuIGkqPTEyOCxvPj1pJiYoby09TWF0aC5wb3coMiw4KnQpKSxvfSxzLnByb3RvdHlwZS5yZWFkSW50OD1mdW5jdGlvbihlLHQpe3JldHVybiB0fHx4KGUsMSx0aGlzLmxlbmd0aCksMTI4JnRoaXNbZV0/KDI1NS10aGlzW2VdKzEpKi0xOnRoaXNbZV19LHMucHJvdG90eXBlLnJlYWRJbnQxNkxFPWZ1bmN0aW9uKGUsdCl7dHx8eChlLDIsdGhpcy5sZW5ndGgpO3ZhciBuPXRoaXNbZV18dGhpc1tlKzFdPDw4O3JldHVybiAzMjc2OCZuPzQyOTQ5MDE3NjB8bjpufSxzLnByb3RvdHlwZS5yZWFkSW50MTZCRT1mdW5jdGlvbihlLHQpe3R8fHgoZSwyLHRoaXMubGVuZ3RoKTt2YXIgbj10aGlzW2UrMV18dGhpc1tlXTw8ODtyZXR1cm4gMzI3Njgmbj80Mjk0OTAxNzYwfG46bn0scy5wcm90b3R5cGUucmVhZEludDMyTEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdHx8eChlLDQsdGhpcy5sZW5ndGgpLHRoaXNbZV18dGhpc1tlKzFdPDw4fHRoaXNbZSsyXTw8MTZ8dGhpc1tlKzNdPDwyNH0scy5wcm90b3R5cGUucmVhZEludDMyQkU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdHx8eChlLDQsdGhpcy5sZW5ndGgpLHRoaXNbZV08PDI0fHRoaXNbZSsxXTw8MTZ8dGhpc1tlKzJdPDw4fHRoaXNbZSszXX0scy5wcm90b3R5cGUucmVhZEZsb2F0TEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdHx8eChlLDQsdGhpcy5sZW5ndGgpLFEucmVhZCh0aGlzLGUsITAsMjMsNCl9LHMucHJvdG90eXBlLnJlYWRGbG9hdEJFPWZ1bmN0aW9uKGUsdCl7cmV0dXJuIHR8fHgoZSw0LHRoaXMubGVuZ3RoKSxRLnJlYWQodGhpcyxlLCExLDIzLDQpfSxzLnByb3RvdHlwZS5yZWFkRG91YmxlTEU9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdHx8eChlLDgsdGhpcy5sZW5ndGgpLFEucmVhZCh0aGlzLGUsITAsNTIsOCl9LHMucHJvdG90eXBlLnJlYWREb3VibGVCRT1mdW5jdGlvbihlLHQpe3JldHVybiB0fHx4KGUsOCx0aGlzLmxlbmd0aCksUS5yZWFkKHRoaXMsZSwhMSw1Miw4KX0scy5wcm90b3R5cGUud3JpdGVVSW50TEU9ZnVuY3Rpb24oZSx0LG4scil7aWYoZT0rZSx0PTB8dCxuPTB8biwhcil7dmFyIGk9TWF0aC5wb3coMiw4Km4pLTE7RCh0aGlzLGUsdCxuLGksMCl9dmFyIG89MSxzPTA7Zm9yKHRoaXNbdF09MjU1JmU7KytzPG4mJihvKj0yNTYpOyl0aGlzW3Qrc109ZS9vJjI1NTtyZXR1cm4gdCtufSxzLnByb3RvdHlwZS53cml0ZVVJbnRCRT1mdW5jdGlvbihlLHQsbixyKXtpZihlPStlLHQ9MHx0LG49MHxuLCFyKXt2YXIgaT1NYXRoLnBvdygyLDgqbiktMTtEKHRoaXMsZSx0LG4saSwwKX12YXIgbz1uLTEscz0xO2Zvcih0aGlzW3Qrb109MjU1JmU7LS1vPj0wJiYocyo9MjU2KTspdGhpc1t0K29dPWUvcyYyNTU7cmV0dXJuIHQrbn0scy5wcm90b3R5cGUud3JpdGVVSW50OD1mdW5jdGlvbihlLHQsbil7cmV0dXJuIGU9K2UsdD0wfHQsbnx8RCh0aGlzLGUsdCwxLDI1NSwwKSxzLlRZUEVEX0FSUkFZX1NVUFBPUlR8fChlPU1hdGguZmxvb3IoZSkpLHRoaXNbdF09MjU1JmUsdCsxfSxzLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT0rZSx0PTB8dCxufHxEKHRoaXMsZSx0LDIsNjU1MzUsMCkscy5UWVBFRF9BUlJBWV9TVVBQT1JUPyh0aGlzW3RdPTI1NSZlLHRoaXNbdCsxXT1lPj4+OCk6aih0aGlzLGUsdCwhMCksdCsyfSxzLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT0rZSx0PTB8dCxufHxEKHRoaXMsZSx0LDIsNjU1MzUsMCkscy5UWVBFRF9BUlJBWV9TVVBQT1JUPyh0aGlzW3RdPWU+Pj44LHRoaXNbdCsxXT0yNTUmZSk6aih0aGlzLGUsdCwhMSksdCsyfSxzLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT0rZSx0PTB8dCxufHxEKHRoaXMsZSx0LDQsNDI5NDk2NzI5NSwwKSxzLlRZUEVEX0FSUkFZX1NVUFBPUlQ/KHRoaXNbdCszXT1lPj4+MjQsdGhpc1t0KzJdPWU+Pj4xNix0aGlzW3QrMV09ZT4+PjgsdGhpc1t0XT0yNTUmZSk6VSh0aGlzLGUsdCwhMCksdCs0fSxzLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT0rZSx0PTB8dCxufHxEKHRoaXMsZSx0LDQsNDI5NDk2NzI5NSwwKSxzLlRZUEVEX0FSUkFZX1NVUFBPUlQ/KHRoaXNbdF09ZT4+PjI0LHRoaXNbdCsxXT1lPj4+MTYsdGhpc1t0KzJdPWU+Pj44LHRoaXNbdCszXT0yNTUmZSk6VSh0aGlzLGUsdCwhMSksdCs0fSxzLnByb3RvdHlwZS53cml0ZUludExFPWZ1bmN0aW9uKGUsdCxuLHIpe2lmKGU9K2UsdD0wfHQsIXIpe3ZhciBpPU1hdGgucG93KDIsOCpuLTEpO0QodGhpcyxlLHQsbixpLTEsLWkpfXZhciBvPTAscz0xLGE9MDtmb3IodGhpc1t0XT0yNTUmZTsrK288biYmKHMqPTI1Nik7KWU8MCYmMD09PWEmJjAhPT10aGlzW3Qrby0xXSYmKGE9MSksdGhpc1t0K29dPShlL3M+PjApLWEmMjU1O3JldHVybiB0K259LHMucHJvdG90eXBlLndyaXRlSW50QkU9ZnVuY3Rpb24oZSx0LG4scil7aWYoZT0rZSx0PTB8dCwhcil7dmFyIGk9TWF0aC5wb3coMiw4Km4tMSk7RCh0aGlzLGUsdCxuLGktMSwtaSl9dmFyIG89bi0xLHM9MSxhPTA7Zm9yKHRoaXNbdCtvXT0yNTUmZTstLW8+PTAmJihzKj0yNTYpOyllPDAmJjA9PT1hJiYwIT09dGhpc1t0K28rMV0mJihhPTEpLHRoaXNbdCtvXT0oZS9zPj4wKS1hJjI1NTtyZXR1cm4gdCtufSxzLnByb3RvdHlwZS53cml0ZUludDg9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBlPStlLHQ9MHx0LG58fEQodGhpcyxlLHQsMSwxMjcsLTEyOCkscy5UWVBFRF9BUlJBWV9TVVBQT1JUfHwoZT1NYXRoLmZsb29yKGUpKSxlPDAmJihlPTI1NStlKzEpLHRoaXNbdF09MjU1JmUsdCsxfSxzLnByb3RvdHlwZS53cml0ZUludDE2TEU9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBlPStlLHQ9MHx0LG58fEQodGhpcyxlLHQsMiwzMjc2NywtMzI3NjgpLHMuVFlQRURfQVJSQVlfU1VQUE9SVD8odGhpc1t0XT0yNTUmZSx0aGlzW3QrMV09ZT4+PjgpOmoodGhpcyxlLHQsITApLHQrMn0scy5wcm90b3R5cGUud3JpdGVJbnQxNkJFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gZT0rZSx0PTB8dCxufHxEKHRoaXMsZSx0LDIsMzI3NjcsLTMyNzY4KSxzLlRZUEVEX0FSUkFZX1NVUFBPUlQ/KHRoaXNbdF09ZT4+PjgsdGhpc1t0KzFdPTI1NSZlKTpqKHRoaXMsZSx0LCExKSx0KzJ9LHMucHJvdG90eXBlLndyaXRlSW50MzJMRT1mdW5jdGlvbihlLHQsbil7cmV0dXJuIGU9K2UsdD0wfHQsbnx8RCh0aGlzLGUsdCw0LDIxNDc0ODM2NDcsLTIxNDc0ODM2NDgpLHMuVFlQRURfQVJSQVlfU1VQUE9SVD8odGhpc1t0XT0yNTUmZSx0aGlzW3QrMV09ZT4+PjgsdGhpc1t0KzJdPWU+Pj4xNix0aGlzW3QrM109ZT4+PjI0KTpVKHRoaXMsZSx0LCEwKSx0KzR9LHMucHJvdG90eXBlLndyaXRlSW50MzJCRT1mdW5jdGlvbihlLHQsbil7cmV0dXJuIGU9K2UsdD0wfHQsbnx8RCh0aGlzLGUsdCw0LDIxNDc0ODM2NDcsLTIxNDc0ODM2NDgpLGU8MCYmKGU9NDI5NDk2NzI5NStlKzEpLHMuVFlQRURfQVJSQVlfU1VQUE9SVD8odGhpc1t0XT1lPj4+MjQsdGhpc1t0KzFdPWU+Pj4xNix0aGlzW3QrMl09ZT4+PjgsdGhpc1t0KzNdPTI1NSZlKTpVKHRoaXMsZSx0LCExKSx0KzR9LHMucHJvdG90eXBlLndyaXRlRmxvYXRMRT1mdW5jdGlvbihlLHQsbil7cmV0dXJuIEIodGhpcyxlLHQsITAsbil9LHMucHJvdG90eXBlLndyaXRlRmxvYXRCRT1mdW5jdGlvbihlLHQsbil7cmV0dXJuIEIodGhpcyxlLHQsITEsbil9LHMucHJvdG90eXBlLndyaXRlRG91YmxlTEU9ZnVuY3Rpb24oZSx0LG4pe3JldHVybiBHKHRoaXMsZSx0LCEwLG4pfSxzLnByb3RvdHlwZS53cml0ZURvdWJsZUJFPWZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gRyh0aGlzLGUsdCwhMSxuKX0scy5wcm90b3R5cGUuY29weT1mdW5jdGlvbihlLHQsbixyKXtpZihufHwobj0wKSxyfHwwPT09cnx8KHI9dGhpcy5sZW5ndGgpLHQ+PWUubGVuZ3RoJiYodD1lLmxlbmd0aCksdHx8KHQ9MCkscj4wJiZyPG4mJihyPW4pLHI9PT1uKXJldHVybiAwO2lmKDA9PT1lLmxlbmd0aHx8MD09PXRoaXMubGVuZ3RoKXJldHVybiAwO2lmKHQ8MCl0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInRhcmdldFN0YXJ0IG91dCBvZiBib3VuZHNcIik7aWYobjwwfHxuPj10aGlzLmxlbmd0aCl0aHJvdyBuZXcgUmFuZ2VFcnJvcihcInNvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHNcIik7aWYocjwwKXRocm93IG5ldyBSYW5nZUVycm9yKFwic291cmNlRW5kIG91dCBvZiBib3VuZHNcIik7cj50aGlzLmxlbmd0aCYmKHI9dGhpcy5sZW5ndGgpLGUubGVuZ3RoLXQ8ci1uJiYocj1lLmxlbmd0aC10K24pO3ZhciBpLG89ci1uO2lmKHRoaXM9PT1lJiZuPHQmJnQ8cilmb3IoaT1vLTE7aT49MDstLWkpZVtpK3RdPXRoaXNbaStuXTtlbHNlIGlmKG88MWUzfHwhcy5UWVBFRF9BUlJBWV9TVVBQT1JUKWZvcihpPTA7aTxvOysraSllW2krdF09dGhpc1tpK25dO2Vsc2UgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoZSx0aGlzLnN1YmFycmF5KG4sbitvKSx0KTtyZXR1cm4gb30scy5wcm90b3R5cGUuZmlsbD1mdW5jdGlvbihlLHQsbixyKXtpZihcInN0cmluZ1wiPT10eXBlb2YgZSl7aWYoXCJzdHJpbmdcIj09dHlwZW9mIHQ/KHI9dCx0PTAsbj10aGlzLmxlbmd0aCk6XCJzdHJpbmdcIj09dHlwZW9mIG4mJihyPW4sbj10aGlzLmxlbmd0aCksMT09PWUubGVuZ3RoKXt2YXIgaT1lLmNoYXJDb2RlQXQoMCk7aTwyNTYmJihlPWkpfWlmKHZvaWQgMCE9PXImJlwic3RyaW5nXCIhPXR5cGVvZiByKXRocm93IG5ldyBUeXBlRXJyb3IoXCJlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nXCIpO2lmKFwic3RyaW5nXCI9PXR5cGVvZiByJiYhcy5pc0VuY29kaW5nKHIpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJVbmtub3duIGVuY29kaW5nOiBcIityKX1lbHNlXCJudW1iZXJcIj09dHlwZW9mIGUmJihlPTI1NSZlKTtpZih0PDB8fHRoaXMubGVuZ3RoPHR8fHRoaXMubGVuZ3RoPG4pdGhyb3cgbmV3IFJhbmdlRXJyb3IoXCJPdXQgb2YgcmFuZ2UgaW5kZXhcIik7aWYobjw9dClyZXR1cm4gdGhpczt0Pj4+PTAsbj12b2lkIDA9PT1uP3RoaXMubGVuZ3RoOm4+Pj4wLGV8fChlPTApO3ZhciBvO2lmKFwibnVtYmVyXCI9PXR5cGVvZiBlKWZvcihvPXQ7bzxuOysrbyl0aGlzW29dPWU7ZWxzZXt2YXIgYT1zLmlzQnVmZmVyKGUpP2U6cShuZXcgcyhlLHIpLnRvU3RyaW5nKCkpLHU9YS5sZW5ndGg7Zm9yKG89MDtvPG4tdDsrK28pdGhpc1tvK3RdPWFbbyV1XX1yZXR1cm4gdGhpc307dmFyIGVlPS9bXitcXC8wLTlBLVphLXotX10vZ30pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se1wiYmFzZTY0LWpzXCI6MixpZWVlNzU0OjE3LGlzYXJyYXk6MjF9XSw4OltmdW5jdGlvbihlLHQsbil7dC5leHBvcnRzPXtPX1JET05MWTowLE9fV1JPTkxZOjEsT19SRFdSOjIsU19JRk1UOjYxNDQwLFNfSUZSRUc6MzI3NjgsU19JRkRJUjoxNjM4NCxTX0lGQ0hSOjgxOTIsU19JRkJMSzoyNDU3NixTX0lGSUZPOjQwOTYsU19JRkxOSzo0MDk2MCxTX0lGU09DSzo0OTE1MixPX0NSRUFUOjUxMixPX0VYQ0w6MjA0OCxPX05PQ1RUWToxMzEwNzIsT19UUlVOQzoxMDI0LE9fQVBQRU5EOjgsT19ESVJFQ1RPUlk6MTA0ODU3NixPX05PRk9MTE9XOjI1NixPX1NZTkM6MTI4LE9fU1lNTElOSzoyMDk3MTUyLE9fTk9OQkxPQ0s6NCxTX0lSV1hVOjQ0OCxTX0lSVVNSOjI1NixTX0lXVVNSOjEyOCxTX0lYVVNSOjY0LFNfSVJXWEc6NTYsU19JUkdSUDozMixTX0lXR1JQOjE2LFNfSVhHUlA6OCxTX0lSV1hPOjcsU19JUk9USDo0LFNfSVdPVEg6MixTX0lYT1RIOjEsRTJCSUc6NyxFQUNDRVM6MTMsRUFERFJJTlVTRTo0OCxFQUREUk5PVEFWQUlMOjQ5LEVBRk5PU1VQUE9SVDo0NyxFQUdBSU46MzUsRUFMUkVBRFk6MzcsRUJBREY6OSxFQkFETVNHOjk0LEVCVVNZOjE2LEVDQU5DRUxFRDo4OSxFQ0hJTEQ6MTAsRUNPTk5BQk9SVEVEOjUzLEVDT05OUkVGVVNFRDo2MSxFQ09OTlJFU0VUOjU0LEVERUFETEs6MTEsRURFU1RBRERSUkVROjM5LEVET006MzMsRURRVU9UOjY5LEVFWElTVDoxNyxFRkFVTFQ6MTQsRUZCSUc6MjcsRUhPU1RVTlJFQUNIOjY1LEVJRFJNOjkwLEVJTFNFUTo5MixFSU5QUk9HUkVTUzozNixFSU5UUjo0LEVJTlZBTDoyMixFSU86NSxFSVNDT05OOjU2LEVJU0RJUjoyMSxFTE9PUDo2MixFTUZJTEU6MjQsRU1MSU5LOjMxLEVNU0dTSVpFOjQwLEVNVUxUSUhPUDo5NSxFTkFNRVRPT0xPTkc6NjMsRU5FVERPV046NTAsRU5FVFJFU0VUOjUyLEVORVRVTlJFQUNIOjUxLEVORklMRToyMyxFTk9CVUZTOjU1LEVOT0RBVEE6OTYsRU5PREVWOjE5LEVOT0VOVDoyLEVOT0VYRUM6OCxFTk9MQ0s6NzcsRU5PTElOSzo5NyxFTk9NRU06MTIsRU5PTVNHOjkxLEVOT1BST1RPT1BUOjQyLEVOT1NQQzoyOCxFTk9TUjo5OCxFTk9TVFI6OTksRU5PU1lTOjc4LEVOT1RDT05OOjU3LEVOT1RESVI6MjAsRU5PVEVNUFRZOjY2LEVOT1RTT0NLOjM4LEVOT1RTVVA6NDUsRU5PVFRZOjI1LEVOWElPOjYsRU9QTk9UU1VQUDoxMDIsRU9WRVJGTE9XOjg0LEVQRVJNOjEsRVBJUEU6MzIsRVBST1RPOjEwMCxFUFJPVE9OT1NVUFBPUlQ6NDMsRVBST1RPVFlQRTo0MSxFUkFOR0U6MzQsRVJPRlM6MzAsRVNQSVBFOjI5LEVTUkNIOjMsRVNUQUxFOjcwLEVUSU1FOjEwMSxFVElNRURPVVQ6NjAsRVRYVEJTWToyNixFV09VTERCTE9DSzozNSxFWERFVjoxOCxTSUdIVVA6MSxTSUdJTlQ6MixTSUdRVUlUOjMsU0lHSUxMOjQsU0lHVFJBUDo1LFNJR0FCUlQ6NixTSUdJT1Q6NixTSUdCVVM6MTAsU0lHRlBFOjgsU0lHS0lMTDo5LFNJR1VTUjE6MzAsU0lHU0VHVjoxMSxTSUdVU1IyOjMxLFNJR1BJUEU6MTMsU0lHQUxSTToxNCxTSUdURVJNOjE1LFNJR0NITEQ6MjAsU0lHQ09OVDoxOSxTSUdTVE9QOjE3LFNJR1RTVFA6MTgsU0lHVFRJTjoyMSxTSUdUVE9VOjIyLFNJR1VSRzoxNixTSUdYQ1BVOjI0LFNJR1hGU1o6MjUsU0lHVlRBTFJNOjI2LFNJR1BST0Y6MjcsU0lHV0lOQ0g6MjgsU0lHSU86MjMsU0lHU1lTOjEyLFNTTF9PUF9BTEw6MjE0NzQ4NjcxOSxTU0xfT1BfQUxMT1dfVU5TQUZFX0xFR0FDWV9SRU5FR09USUFUSU9OOjI2MjE0NCxTU0xfT1BfQ0lQSEVSX1NFUlZFUl9QUkVGRVJFTkNFOjQxOTQzMDQsU1NMX09QX0NJU0NPX0FOWUNPTk5FQ1Q6MzI3NjgsU1NMX09QX0NPT0tJRV9FWENIQU5HRTo4MTkyLFNTTF9PUF9DUllQVE9QUk9fVExTRVhUX0JVRzoyMTQ3NDgzNjQ4LFNTTF9PUF9ET05UX0lOU0VSVF9FTVBUWV9GUkFHTUVOVFM6MjA0OCxTU0xfT1BfRVBIRU1FUkFMX1JTQTowLFNTTF9PUF9MRUdBQ1lfU0VSVkVSX0NPTk5FQ1Q6NCxTU0xfT1BfTUlDUk9TT0ZUX0JJR19TU0xWM19CVUZGRVI6MzIsU1NMX09QX01JQ1JPU09GVF9TRVNTX0lEX0JVRzoxLFNTTF9PUF9NU0lFX1NTTFYyX1JTQV9QQURESU5HOjAsU1NMX09QX05FVFNDQVBFX0NBX0ROX0JVRzo1MzY4NzA5MTIsU1NMX09QX05FVFNDQVBFX0NIQUxMRU5HRV9CVUc6MixTU0xfT1BfTkVUU0NBUEVfREVNT19DSVBIRVJfQ0hBTkdFX0JVRzoxMDczNzQxODI0LFNTTF9PUF9ORVRTQ0FQRV9SRVVTRV9DSVBIRVJfQ0hBTkdFX0JVRzo4LFNTTF9PUF9OT19DT01QUkVTU0lPTjoxMzEwNzIsU1NMX09QX05PX1FVRVJZX01UVTo0MDk2LFNTTF9PUF9OT19TRVNTSU9OX1JFU1VNUFRJT05fT05fUkVORUdPVElBVElPTjo2NTUzNixTU0xfT1BfTk9fU1NMdjI6MTY3NzcyMTYsU1NMX09QX05PX1NTTHYzOjMzNTU0NDMyLFNTTF9PUF9OT19USUNLRVQ6MTYzODQsU1NMX09QX05PX1RMU3YxOjY3MTA4ODY0LFNTTF9PUF9OT19UTFN2MV8xOjI2ODQzNTQ1NixTU0xfT1BfTk9fVExTdjFfMjoxMzQyMTc3MjgsU1NMX09QX1BLQ1MxX0NIRUNLXzE6MCxTU0xfT1BfUEtDUzFfQ0hFQ0tfMjowLFNTTF9PUF9TSU5HTEVfREhfVVNFOjEwNDg1NzYsU1NMX09QX1NJTkdMRV9FQ0RIX1VTRTo1MjQyODgsU1NMX09QX1NTTEVBWV8wODBfQ0xJRU5UX0RIX0JVRzoxMjgsU1NMX09QX1NTTFJFRjJfUkVVU0VfQ0VSVF9UWVBFX0JVRzowLFNTTF9PUF9UTFNfQkxPQ0tfUEFERElOR19CVUc6NTEyLFNTTF9PUF9UTFNfRDVfQlVHOjI1NixTU0xfT1BfVExTX1JPTExCQUNLX0JVRzo4Mzg4NjA4LEVOR0lORV9NRVRIT0RfRFNBOjIsRU5HSU5FX01FVEhPRF9ESDo0LEVOR0lORV9NRVRIT0RfUkFORDo4LEVOR0lORV9NRVRIT0RfRUNESDoxNixFTkdJTkVfTUVUSE9EX0VDRFNBOjMyLEVOR0lORV9NRVRIT0RfQ0lQSEVSUzo2NCxFTkdJTkVfTUVUSE9EX0RJR0VTVFM6MTI4LEVOR0lORV9NRVRIT0RfU1RPUkU6MjU2LEVOR0lORV9NRVRIT0RfUEtFWV9NRVRIUzo1MTIsRU5HSU5FX01FVEhPRF9QS0VZX0FTTjFfTUVUSFM6MTAyNCxFTkdJTkVfTUVUSE9EX0FMTDo2NTUzNSxFTkdJTkVfTUVUSE9EX05PTkU6MCxESF9DSEVDS19QX05PVF9TQUZFX1BSSU1FOjIsREhfQ0hFQ0tfUF9OT1RfUFJJTUU6MSxESF9VTkFCTEVfVE9fQ0hFQ0tfR0VORVJBVE9SOjQsREhfTk9UX1NVSVRBQkxFX0dFTkVSQVRPUjo4LE5QTl9FTkFCTEVEOjEsUlNBX1BLQ1MxX1BBRERJTkc6MSxSU0FfU1NMVjIzX1BBRERJTkc6MixSU0FfTk9fUEFERElORzozLFJTQV9QS0NTMV9PQUVQX1BBRERJTkc6NCxSU0FfWDkzMV9QQURESU5HOjUsUlNBX1BLQ1MxX1BTU19QQURESU5HOjYsUE9JTlRfQ09OVkVSU0lPTl9DT01QUkVTU0VEOjIsUE9JTlRfQ09OVkVSU0lPTl9VTkNPTVBSRVNTRUQ6NCxQT0lOVF9DT05WRVJTSU9OX0hZQlJJRDo2LEZfT0s6MCxSX09LOjQsV19PSzoyLFhfT0s6MSxVVl9VRFBfUkVVU0VBRERSOjR9fSx7fV0sOTpbZnVuY3Rpb24oZSx0LG4pe3ZhciByPWUoXCIuLi8uLi9tb2R1bGVzL19jb3JlXCIpLGk9ci5KU09OfHwoci5KU09OPXtzdHJpbmdpZnk6SlNPTi5zdHJpbmdpZnl9KTt0LmV4cG9ydHM9ZnVuY3Rpb24oZSl7cmV0dXJuIGkuc3RyaW5naWZ5LmFwcGx5KGksYXJndW1lbnRzKX19LHtcIi4uLy4uL21vZHVsZXMvX2NvcmVcIjoxMH1dLDEwOltmdW5jdGlvbihlLHQsbil7dmFyIHI9dC5leHBvcnRzPXt2ZXJzaW9uOlwiMi40LjBcIn07XCJudW1iZXJcIj09dHlwZW9mIF9fZSYmKF9fZT1yKX0se31dLDExOltmdW5jdGlvbihlLHQsbil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSl7cmV0dXJuIEFycmF5LmlzQXJyYXk/QXJyYXkuaXNBcnJheShlKTpcIltvYmplY3QgQXJyYXldXCI9PT15KGUpfWZ1bmN0aW9uIHIoZSl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIGkoZSl7cmV0dXJuIG51bGw9PT1lfWZ1bmN0aW9uIG8oZSl7cmV0dXJuIG51bGw9PWV9ZnVuY3Rpb24gcyhlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZX1mdW5jdGlvbiBhKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIHUoZSl7cmV0dXJuXCJzeW1ib2xcIj09dHlwZW9mIGV9ZnVuY3Rpb24gZihlKXtyZXR1cm4gdm9pZCAwPT09ZX1mdW5jdGlvbiBjKGUpe3JldHVyblwiW29iamVjdCBSZWdFeHBdXCI9PT15KGUpfWZ1bmN0aW9uIGwoZSl7cmV0dXJuXCJvYmplY3RcIj09dHlwZW9mIGUmJm51bGwhPT1lfWZ1bmN0aW9uIGgoZSl7cmV0dXJuXCJbb2JqZWN0IERhdGVdXCI9PT15KGUpfWZ1bmN0aW9uIHAoZSl7cmV0dXJuXCJbb2JqZWN0IEVycm9yXVwiPT09eShlKXx8ZSBpbnN0YW5jZW9mIEVycm9yfWZ1bmN0aW9uIGQoZSl7cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgZX1mdW5jdGlvbiBnKGUpe3JldHVybiBudWxsPT09ZXx8XCJib29sZWFuXCI9PXR5cGVvZiBlfHxcIm51bWJlclwiPT10eXBlb2YgZXx8XCJzdHJpbmdcIj09dHlwZW9mIGV8fFwic3ltYm9sXCI9PXR5cGVvZiBlfHxcInVuZGVmaW5lZFwiPT10eXBlb2YgZX1mdW5jdGlvbiB5KGUpe3JldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoZSl9bi5pc0FycmF5PXQsbi5pc0Jvb2xlYW49cixuLmlzTnVsbD1pLG4uaXNOdWxsT3JVbmRlZmluZWQ9byxuLmlzTnVtYmVyPXMsbi5pc1N0cmluZz1hLG4uaXNTeW1ib2w9dSxuLmlzVW5kZWZpbmVkPWYsbi5pc1JlZ0V4cD1jLG4uaXNPYmplY3Q9bCxuLmlzRGF0ZT1oLG4uaXNFcnJvcj1wLG4uaXNGdW5jdGlvbj1kLG4uaXNQcmltaXRpdmU9ZyxuLmlzQnVmZmVyPWUuaXNCdWZmZXJ9KS5jYWxsKHRoaXMse2lzQnVmZmVyOmUoXCIuLi8uLi9pcy1idWZmZXIvaW5kZXguanNcIil9KX0se1wiLi4vLi4vaXMtYnVmZmVyL2luZGV4LmpzXCI6MjB9XSwxMjpbZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoKXt0aGlzLl9ldmVudHM9dGhpcy5fZXZlbnRzfHx7fSx0aGlzLl9tYXhMaXN0ZW5lcnM9dGhpcy5fbWF4TGlzdGVuZXJzfHx2b2lkIDB9ZnVuY3Rpb24gaShlKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIG8oZSl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIGV9ZnVuY3Rpb24gcyhlKXtyZXR1cm5cIm9iamVjdFwiPT10eXBlb2YgZSYmbnVsbCE9PWV9ZnVuY3Rpb24gYShlKXtyZXR1cm4gdm9pZCAwPT09ZX10LmV4cG9ydHM9cixyLkV2ZW50RW1pdHRlcj1yLHIucHJvdG90eXBlLl9ldmVudHM9dm9pZCAwLHIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnM9dm9pZCAwLHIuZGVmYXVsdE1heExpc3RlbmVycz0xMCxyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnM9ZnVuY3Rpb24oZSl7XHJcbmlmKCFvKGUpfHxlPDB8fGlzTmFOKGUpKXRocm93IFR5cGVFcnJvcihcIm4gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlclwiKTtyZXR1cm4gdGhpcy5fbWF4TGlzdGVuZXJzPWUsdGhpc30sci5wcm90b3R5cGUuZW1pdD1mdW5jdGlvbihlKXt2YXIgdCxuLHIsbyx1LGY7aWYodGhpcy5fZXZlbnRzfHwodGhpcy5fZXZlbnRzPXt9KSxcImVycm9yXCI9PT1lJiYoIXRoaXMuX2V2ZW50cy5lcnJvcnx8cyh0aGlzLl9ldmVudHMuZXJyb3IpJiYhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpe2lmKHQ9YXJndW1lbnRzWzFdLHQgaW5zdGFuY2VvZiBFcnJvcil0aHJvdyB0O3ZhciBjPW5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcrdCtcIilcIik7dGhyb3cgYy5jb250ZXh0PXQsY31pZihuPXRoaXMuX2V2ZW50c1tlXSxhKG4pKXJldHVybiExO2lmKGkobikpc3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe2Nhc2UgMTpuLmNhbGwodGhpcyk7YnJlYWs7Y2FzZSAyOm4uY2FsbCh0aGlzLGFyZ3VtZW50c1sxXSk7YnJlYWs7Y2FzZSAzOm4uY2FsbCh0aGlzLGFyZ3VtZW50c1sxXSxhcmd1bWVudHNbMl0pO2JyZWFrO2RlZmF1bHQ6bz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksbi5hcHBseSh0aGlzLG8pfWVsc2UgaWYocyhuKSlmb3Iobz1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsMSksZj1uLnNsaWNlKCkscj1mLmxlbmd0aCx1PTA7dTxyO3UrKylmW3VdLmFwcGx5KHRoaXMsbyk7cmV0dXJuITB9LHIucHJvdG90eXBlLmFkZExpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7dmFyIG47aWYoIWkodCkpdGhyb3cgVHlwZUVycm9yKFwibGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO3JldHVybiB0aGlzLl9ldmVudHN8fCh0aGlzLl9ldmVudHM9e30pLHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lciYmdGhpcy5lbWl0KFwibmV3TGlzdGVuZXJcIixlLGkodC5saXN0ZW5lcik/dC5saXN0ZW5lcjp0KSx0aGlzLl9ldmVudHNbZV0/cyh0aGlzLl9ldmVudHNbZV0pP3RoaXMuX2V2ZW50c1tlXS5wdXNoKHQpOnRoaXMuX2V2ZW50c1tlXT1bdGhpcy5fZXZlbnRzW2VdLHRdOnRoaXMuX2V2ZW50c1tlXT10LHModGhpcy5fZXZlbnRzW2VdKSYmIXRoaXMuX2V2ZW50c1tlXS53YXJuZWQmJihuPWEodGhpcy5fbWF4TGlzdGVuZXJzKT9yLmRlZmF1bHRNYXhMaXN0ZW5lcnM6dGhpcy5fbWF4TGlzdGVuZXJzLG4mJm4+MCYmdGhpcy5fZXZlbnRzW2VdLmxlbmd0aD5uJiYodGhpcy5fZXZlbnRzW2VdLndhcm5lZD0hMCxjb25zb2xlLmVycm9yKFwiKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC5cIix0aGlzLl9ldmVudHNbZV0ubGVuZ3RoKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBjb25zb2xlLnRyYWNlJiZjb25zb2xlLnRyYWNlKCkpKSx0aGlzfSxyLnByb3RvdHlwZS5vbj1yLnByb3RvdHlwZS5hZGRMaXN0ZW5lcixyLnByb3RvdHlwZS5vbmNlPWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbigpe3RoaXMucmVtb3ZlTGlzdGVuZXIoZSxuKSxyfHwocj0hMCx0LmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9aWYoIWkodCkpdGhyb3cgVHlwZUVycm9yKFwibGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO3ZhciByPSExO3JldHVybiBuLmxpc3RlbmVyPXQsdGhpcy5vbihlLG4pLHRoaXN9LHIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyPWZ1bmN0aW9uKGUsdCl7dmFyIG4scixvLGE7aWYoIWkodCkpdGhyb3cgVHlwZUVycm9yKFwibGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO2lmKCF0aGlzLl9ldmVudHN8fCF0aGlzLl9ldmVudHNbZV0pcmV0dXJuIHRoaXM7aWYobj10aGlzLl9ldmVudHNbZV0sbz1uLmxlbmd0aCxyPS0xLG49PT10fHxpKG4ubGlzdGVuZXIpJiZuLmxpc3RlbmVyPT09dClkZWxldGUgdGhpcy5fZXZlbnRzW2VdLHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lciYmdGhpcy5lbWl0KFwicmVtb3ZlTGlzdGVuZXJcIixlLHQpO2Vsc2UgaWYocyhuKSl7Zm9yKGE9bzthLS0gPjA7KWlmKG5bYV09PT10fHxuW2FdLmxpc3RlbmVyJiZuW2FdLmxpc3RlbmVyPT09dCl7cj1hO2JyZWFrfWlmKHI8MClyZXR1cm4gdGhpczsxPT09bi5sZW5ndGg/KG4ubGVuZ3RoPTAsZGVsZXRlIHRoaXMuX2V2ZW50c1tlXSk6bi5zcGxpY2UociwxKSx0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXImJnRoaXMuZW1pdChcInJlbW92ZUxpc3RlbmVyXCIsZSx0KX1yZXR1cm4gdGhpc30sci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzPWZ1bmN0aW9uKGUpe3ZhciB0LG47aWYoIXRoaXMuX2V2ZW50cylyZXR1cm4gdGhpcztpZighdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKXJldHVybiAwPT09YXJndW1lbnRzLmxlbmd0aD90aGlzLl9ldmVudHM9e306dGhpcy5fZXZlbnRzW2VdJiZkZWxldGUgdGhpcy5fZXZlbnRzW2VdLHRoaXM7aWYoMD09PWFyZ3VtZW50cy5sZW5ndGgpe2Zvcih0IGluIHRoaXMuX2V2ZW50cylcInJlbW92ZUxpc3RlbmVyXCIhPT10JiZ0aGlzLnJlbW92ZUFsbExpc3RlbmVycyh0KTtyZXR1cm4gdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoXCJyZW1vdmVMaXN0ZW5lclwiKSx0aGlzLl9ldmVudHM9e30sdGhpc31pZihuPXRoaXMuX2V2ZW50c1tlXSxpKG4pKXRoaXMucmVtb3ZlTGlzdGVuZXIoZSxuKTtlbHNlIGlmKG4pZm9yKDtuLmxlbmd0aDspdGhpcy5yZW1vdmVMaXN0ZW5lcihlLG5bbi5sZW5ndGgtMV0pO3JldHVybiBkZWxldGUgdGhpcy5fZXZlbnRzW2VdLHRoaXN9LHIucHJvdG90eXBlLmxpc3RlbmVycz1mdW5jdGlvbihlKXt2YXIgdDtyZXR1cm4gdD10aGlzLl9ldmVudHMmJnRoaXMuX2V2ZW50c1tlXT9pKHRoaXMuX2V2ZW50c1tlXSk/W3RoaXMuX2V2ZW50c1tlXV06dGhpcy5fZXZlbnRzW2VdLnNsaWNlKCk6W119LHIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQ9ZnVuY3Rpb24oZSl7aWYodGhpcy5fZXZlbnRzKXt2YXIgdD10aGlzLl9ldmVudHNbZV07aWYoaSh0KSlyZXR1cm4gMTtpZih0KXJldHVybiB0Lmxlbmd0aH1yZXR1cm4gMH0sci5saXN0ZW5lckNvdW50PWZ1bmN0aW9uKGUsdCl7cmV0dXJuIGUubGlzdGVuZXJDb3VudCh0KX19LHt9XSwxMzpbZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7aWYobnVsbD09PWV8fFwib2JqZWN0XCIhPXR5cGVvZiBlKXJldHVybiBlO2lmKGUgaW5zdGFuY2VvZiBPYmplY3QpdmFyIHQ9e19fcHJvdG9fXzplLl9fcHJvdG9fX307ZWxzZSB2YXIgdD1PYmplY3QuY3JlYXRlKG51bGwpO3JldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhlKS5mb3JFYWNoKGZ1bmN0aW9uKG4pe09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LG4sT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLG4pKX0pLHR9dmFyIGk9ZShcImZzXCIpO3QuZXhwb3J0cz1yKGkpfSx7ZnM6NH1dLDE0OltmdW5jdGlvbihlLHQsbil7KGZ1bmN0aW9uKG4pe2Z1bmN0aW9uIHIoKXt9ZnVuY3Rpb24gaShlKXtmdW5jdGlvbiB0KGUsdCxuKXtmdW5jdGlvbiByKGUsdCxuKXtyZXR1cm4gdihlLHQsZnVuY3Rpb24oaSl7IWl8fFwiRU1GSUxFXCIhPT1pLmNvZGUmJlwiRU5GSUxFXCIhPT1pLmNvZGU/KFwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJm4uYXBwbHkodGhpcyxhcmd1bWVudHMpLHMoKSk6byhbcixbZSx0LG5dXSl9KX1yZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobj10LHQ9bnVsbCkscihlLHQsbil9ZnVuY3Rpb24gcihlLHQsbixyKXtmdW5jdGlvbiBpKGUsdCxuLHIpe3JldHVybiBtKGUsdCxuLGZ1bmN0aW9uKGEpeyFhfHxcIkVNRklMRVwiIT09YS5jb2RlJiZcIkVORklMRVwiIT09YS5jb2RlPyhcImZ1bmN0aW9uXCI9PXR5cGVvZiByJiZyLmFwcGx5KHRoaXMsYXJndW1lbnRzKSxzKCkpOm8oW2ksW2UsdCxuLHJdXSl9KX1yZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiYocj1uLG49bnVsbCksaShlLHQsbixyKX1mdW5jdGlvbiBhKGUsdCxuLHIpe2Z1bmN0aW9uIGkoZSx0LG4scil7cmV0dXJuIEUoZSx0LG4sZnVuY3Rpb24oYSl7IWF8fFwiRU1GSUxFXCIhPT1hLmNvZGUmJlwiRU5GSUxFXCIhPT1hLmNvZGU/KFwiZnVuY3Rpb25cIj09dHlwZW9mIHImJnIuYXBwbHkodGhpcyxhcmd1bWVudHMpLHMoKSk6byhbaSxbZSx0LG4scl1dKX0pfXJldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIG4mJihyPW4sbj1udWxsKSxpKGUsdCxuLHIpfWZ1bmN0aW9uIGMoZSx0KXtmdW5jdGlvbiBuKCl7cmV0dXJuIHcoZSxmdW5jdGlvbihyLGkpe2kmJmkuc29ydCYmaS5zb3J0KCksIXJ8fFwiRU1GSUxFXCIhPT1yLmNvZGUmJlwiRU5GSUxFXCIhPT1yLmNvZGU/KFwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJnQuYXBwbHkodGhpcyxhcmd1bWVudHMpLHMoKSk6byhbbixbZSx0XV0pfSl9cmV0dXJuIG4oZSx0KX1mdW5jdGlvbiBsKGUsdCl7cmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBsPyhTLmFwcGx5KHRoaXMsYXJndW1lbnRzKSx0aGlzKTpsLmFwcGx5KE9iamVjdC5jcmVhdGUobC5wcm90b3R5cGUpLGFyZ3VtZW50cyl9ZnVuY3Rpb24gaCgpe3ZhciBlPXRoaXM7XyhlLnBhdGgsZS5mbGFncyxlLm1vZGUsZnVuY3Rpb24odCxuKXt0PyhlLmF1dG9DbG9zZSYmZS5kZXN0cm95KCksZS5lbWl0KFwiZXJyb3JcIix0KSk6KGUuZmQ9bixlLmVtaXQoXCJvcGVuXCIsbiksZS5yZWFkKCkpfSl9ZnVuY3Rpb24gcChlLHQpe3JldHVybiB0aGlzIGluc3RhbmNlb2YgcD8oTy5hcHBseSh0aGlzLGFyZ3VtZW50cyksdGhpcyk6cC5hcHBseShPYmplY3QuY3JlYXRlKHAucHJvdG90eXBlKSxhcmd1bWVudHMpfWZ1bmN0aW9uIGQoKXt2YXIgZT10aGlzO18oZS5wYXRoLGUuZmxhZ3MsZS5tb2RlLGZ1bmN0aW9uKHQsbil7dD8oZS5kZXN0cm95KCksZS5lbWl0KFwiZXJyb3JcIix0KSk6KGUuZmQ9bixlLmVtaXQoXCJvcGVuXCIsbikpfSl9ZnVuY3Rpb24gZyhlLHQpe3JldHVybiBuZXcgbChlLHQpfWZ1bmN0aW9uIHkoZSx0KXtyZXR1cm4gbmV3IHAoZSx0KX1mdW5jdGlvbiBfKGUsdCxuLHIpe2Z1bmN0aW9uIGkoZSx0LG4scil7cmV0dXJuIFIoZSx0LG4sZnVuY3Rpb24oYSx1KXshYXx8XCJFTUZJTEVcIiE9PWEuY29kZSYmXCJFTkZJTEVcIiE9PWEuY29kZT8oXCJmdW5jdGlvblwiPT10eXBlb2YgciYmci5hcHBseSh0aGlzLGFyZ3VtZW50cykscygpKTpvKFtpLFtlLHQsbixyXV0pfSl9cmV0dXJuXCJmdW5jdGlvblwiPT10eXBlb2YgbiYmKHI9bixuPW51bGwpLGkoZSx0LG4scil9dShlKSxlLmdyYWNlZnVsaWZ5PWksZS5GaWxlUmVhZFN0cmVhbT1sLGUuRmlsZVdyaXRlU3RyZWFtPXAsZS5jcmVhdGVSZWFkU3RyZWFtPWcsZS5jcmVhdGVXcml0ZVN0cmVhbT15O3ZhciB2PWUucmVhZEZpbGU7ZS5yZWFkRmlsZT10O3ZhciBtPWUud3JpdGVGaWxlO2Uud3JpdGVGaWxlPXI7dmFyIEU9ZS5hcHBlbmRGaWxlO0UmJihlLmFwcGVuZEZpbGU9YSk7dmFyIHc9ZS5yZWFkZGlyO2lmKGUucmVhZGRpcj1jLFwidjAuOFwiPT09bi52ZXJzaW9uLnN1YnN0cigwLDQpKXt2YXIgYj1mKGUpO2w9Yi5SZWFkU3RyZWFtLHA9Yi5Xcml0ZVN0cmVhbX12YXIgUz1lLlJlYWRTdHJlYW07bC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShTLnByb3RvdHlwZSksbC5wcm90b3R5cGUub3Blbj1oO3ZhciBPPWUuV3JpdGVTdHJlYW07cC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShPLnByb3RvdHlwZSkscC5wcm90b3R5cGUub3Blbj1kLGUuUmVhZFN0cmVhbT1sLGUuV3JpdGVTdHJlYW09cDt2YXIgUj1lLm9wZW47cmV0dXJuIGUub3Blbj1fLGV9ZnVuY3Rpb24gbyhlKXtoKFwiRU5RVUVVRVwiLGVbMF0ubmFtZSxlWzFdKSxjLnB1c2goZSl9ZnVuY3Rpb24gcygpe3ZhciBlPWMuc2hpZnQoKTtlJiYoaChcIlJFVFJZXCIsZVswXS5uYW1lLGVbMV0pLGVbMF0uYXBwbHkobnVsbCxlWzFdKSl9dmFyIGE9ZShcImZzXCIpLHU9ZShcIi4vcG9seWZpbGxzLmpzXCIpLGY9ZShcIi4vbGVnYWN5LXN0cmVhbXMuanNcIiksYz1bXSxsPWUoXCJ1dGlsXCIpLGg9cjtsLmRlYnVnbG9nP2g9bC5kZWJ1Z2xvZyhcImdmczRcIik6L1xcYmdmczRcXGIvaS50ZXN0KG4uZW52Lk5PREVfREVCVUd8fFwiXCIpJiYoaD1mdW5jdGlvbigpe3ZhciBlPWwuZm9ybWF0LmFwcGx5KGwsYXJndW1lbnRzKTtlPVwiR0ZTNDogXCIrZS5zcGxpdCgvXFxuLykuam9pbihcIlxcbkdGUzQ6IFwiKSxjb25zb2xlLmVycm9yKGUpfSksL1xcYmdmczRcXGIvaS50ZXN0KG4uZW52Lk5PREVfREVCVUd8fFwiXCIpJiZuLm9uKFwiZXhpdFwiLGZ1bmN0aW9uKCl7aChjKSxlKFwiYXNzZXJ0XCIpLmVxdWFsKGMubGVuZ3RoLDApfSksdC5leHBvcnRzPWkoZShcIi4vZnMuanNcIikpLG4uZW52LlRFU1RfR1JBQ0VGVUxfRlNfR0xPQkFMX1BBVENIJiYodC5leHBvcnRzPWkoYSkpLHQuZXhwb3J0cy5jbG9zZT1hLmNsb3NlPWZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0LG4pe3JldHVybiBlLmNhbGwoYSx0LGZ1bmN0aW9uKGUpe2V8fHMoKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiBuJiZuLmFwcGx5KHRoaXMsYXJndW1lbnRzKX0pfX0oYS5jbG9zZSksdC5leHBvcnRzLmNsb3NlU3luYz1hLmNsb3NlU3luYz1mdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIG49ZS5hcHBseShhLGFyZ3VtZW50cyk7cmV0dXJuIHMoKSxufX0oYS5jbG9zZVN5bmMpfSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtcIi4vZnMuanNcIjoxMyxcIi4vbGVnYWN5LXN0cmVhbXMuanNcIjoxNSxcIi4vcG9seWZpbGxzLmpzXCI6MTYsX3Byb2Nlc3M6MjUsYXNzZXJ0OjUsZnM6NCx1dGlsOjQ0fV0sMTU6W2Z1bmN0aW9uKGUsdCxuKXsoZnVuY3Rpb24obil7ZnVuY3Rpb24gcihlKXtmdW5jdGlvbiB0KHIsbyl7aWYoISh0aGlzIGluc3RhbmNlb2YgdCkpcmV0dXJuIG5ldyB0KHIsbyk7aS5jYWxsKHRoaXMpO3ZhciBzPXRoaXM7dGhpcy5wYXRoPXIsdGhpcy5mZD1udWxsLHRoaXMucmVhZGFibGU9ITAsdGhpcy5wYXVzZWQ9ITEsdGhpcy5mbGFncz1cInJcIix0aGlzLm1vZGU9NDM4LHRoaXMuYnVmZmVyU2l6ZT02NTUzNixvPW98fHt9O2Zvcih2YXIgYT1PYmplY3Qua2V5cyhvKSx1PTAsZj1hLmxlbmd0aDt1PGY7dSsrKXt2YXIgYz1hW3VdO3RoaXNbY109b1tjXX1pZih0aGlzLmVuY29kaW5nJiZ0aGlzLnNldEVuY29kaW5nKHRoaXMuZW5jb2RpbmcpLHZvaWQgMCE9PXRoaXMuc3RhcnQpe2lmKFwibnVtYmVyXCIhPXR5cGVvZiB0aGlzLnN0YXJ0KXRocm93IFR5cGVFcnJvcihcInN0YXJ0IG11c3QgYmUgYSBOdW1iZXJcIik7aWYodm9pZCAwPT09dGhpcy5lbmQpdGhpcy5lbmQ9MS8wO2Vsc2UgaWYoXCJudW1iZXJcIiE9dHlwZW9mIHRoaXMuZW5kKXRocm93IFR5cGVFcnJvcihcImVuZCBtdXN0IGJlIGEgTnVtYmVyXCIpO2lmKHRoaXMuc3RhcnQ+dGhpcy5lbmQpdGhyb3cgbmV3IEVycm9yKFwic3RhcnQgbXVzdCBiZSA8PSBlbmRcIik7dGhpcy5wb3M9dGhpcy5zdGFydH1yZXR1cm4gbnVsbCE9PXRoaXMuZmQ/dm9pZCBuLm5leHRUaWNrKGZ1bmN0aW9uKCl7cy5fcmVhZCgpfSk6dm9pZCBlLm9wZW4odGhpcy5wYXRoLHRoaXMuZmxhZ3MsdGhpcy5tb2RlLGZ1bmN0aW9uKGUsdCl7cmV0dXJuIGU/KHMuZW1pdChcImVycm9yXCIsZSksdm9pZChzLnJlYWRhYmxlPSExKSk6KHMuZmQ9dCxzLmVtaXQoXCJvcGVuXCIsdCksdm9pZCBzLl9yZWFkKCkpfSl9ZnVuY3Rpb24gcih0LG4pe2lmKCEodGhpcyBpbnN0YW5jZW9mIHIpKXJldHVybiBuZXcgcih0LG4pO2kuY2FsbCh0aGlzKSx0aGlzLnBhdGg9dCx0aGlzLmZkPW51bGwsdGhpcy53cml0YWJsZT0hMCx0aGlzLmZsYWdzPVwid1wiLHRoaXMuZW5jb2Rpbmc9XCJiaW5hcnlcIix0aGlzLm1vZGU9NDM4LHRoaXMuYnl0ZXNXcml0dGVuPTAsbj1ufHx7fTtmb3IodmFyIG89T2JqZWN0LmtleXMobikscz0wLGE9by5sZW5ndGg7czxhO3MrKyl7dmFyIHU9b1tzXTt0aGlzW3VdPW5bdV19aWYodm9pZCAwIT09dGhpcy5zdGFydCl7aWYoXCJudW1iZXJcIiE9dHlwZW9mIHRoaXMuc3RhcnQpdGhyb3cgVHlwZUVycm9yKFwic3RhcnQgbXVzdCBiZSBhIE51bWJlclwiKTtpZih0aGlzLnN0YXJ0PDApdGhyb3cgbmV3IEVycm9yKFwic3RhcnQgbXVzdCBiZSA+PSB6ZXJvXCIpO3RoaXMucG9zPXRoaXMuc3RhcnR9dGhpcy5idXN5PSExLHRoaXMuX3F1ZXVlPVtdLG51bGw9PT10aGlzLmZkJiYodGhpcy5fb3Blbj1lLm9wZW4sdGhpcy5fcXVldWUucHVzaChbdGhpcy5fb3Blbix0aGlzLnBhdGgsdGhpcy5mbGFncyx0aGlzLm1vZGUsdm9pZCAwXSksdGhpcy5mbHVzaCgpKX1yZXR1cm57UmVhZFN0cmVhbTp0LFdyaXRlU3RyZWFtOnJ9fXZhciBpPWUoXCJzdHJlYW1cIikuU3RyZWFtO3QuZXhwb3J0cz1yfSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtfcHJvY2VzczoyNSxzdHJlYW06NDB9XSwxNjpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihuKXtmdW5jdGlvbiByKGUpe2MuaGFzT3duUHJvcGVydHkoXCJPX1NZTUxJTktcIikmJm4udmVyc2lvbi5tYXRjaCgvXnYwXFwuNlxcLlswLTJdfF52MFxcLjVcXC4vKSYmaShlKSxlLmx1dGltZXN8fG8oZSksZS5jaG93bj1zKGUuY2hvd24pLGUuZmNob3duPXMoZS5mY2hvd24pLGUubGNob3duPXMoZS5sY2hvd24pLGUuY2htb2Q9cyhlLmNobW9kKSxlLmZjaG1vZD1zKGUuZmNobW9kKSxlLmxjaG1vZD1zKGUubGNobW9kKSxlLmNob3duU3luYz1hKGUuY2hvd25TeW5jKSxlLmZjaG93blN5bmM9YShlLmZjaG93blN5bmMpLGUubGNob3duU3luYz1hKGUubGNob3duU3luYyksZS5jaG1vZFN5bmM9cyhlLmNobW9kU3luYyksZS5mY2htb2RTeW5jPXMoZS5mY2htb2RTeW5jKSxlLmxjaG1vZFN5bmM9cyhlLmxjaG1vZFN5bmMpLGUubGNobW9kfHwoZS5sY2htb2Q9ZnVuY3Rpb24oZSx0LHIpe24ubmV4dFRpY2socil9LGUubGNobW9kU3luYz1mdW5jdGlvbigpe30pLGUubGNob3dufHwoZS5sY2hvd249ZnVuY3Rpb24oZSx0LHIsaSl7bi5uZXh0VGljayhpKX0sZS5sY2hvd25TeW5jPWZ1bmN0aW9uKCl7fSksXCJ3aW4zMlwiPT09bi5wbGF0Zm9ybSYmKGUucmVuYW1lPWZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbih0LG4scil7dmFyIGk9RGF0ZS5ub3coKTtlKHQsbixmdW5jdGlvbiBvKHMpe3JldHVybiBzJiYoXCJFQUNDRVNcIj09PXMuY29kZXx8XCJFUEVSTVwiPT09cy5jb2RlKSYmRGF0ZS5ub3coKS1pPDFlMz9lKHQsbixvKTp2b2lkKHImJnIocykpfSl9fShlLnJlbmFtZSkpLGUucmVhZD1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24obixyLGksbyxzLGEpe3ZhciB1O2lmKGEmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGEpe3ZhciBmPTA7dT1mdW5jdGlvbihjLGwsaCl7cmV0dXJuIGMmJlwiRUFHQUlOXCI9PT1jLmNvZGUmJmY8MTA/KGYrKyx0LmNhbGwoZSxuLHIsaSxvLHMsdSkpOnZvaWQgYS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fXJldHVybiB0LmNhbGwoZSxuLHIsaSxvLHMsdSl9fShlLnJlYWQpLGUucmVhZFN5bmM9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKG4scixpLG8scyl7Zm9yKHZhciBhPTA7Oyl0cnl7cmV0dXJuIHQuY2FsbChlLG4scixpLG8scyl9Y2F0Y2godSl7aWYoXCJFQUdBSU5cIj09PXUuY29kZSYmYTwxMCl7YSsrO2NvbnRpbnVlfXRocm93IHV9fX0oZS5yZWFkU3luYyl9ZnVuY3Rpb24gaShlKXtlLmxjaG1vZD1mdW5jdGlvbih0LG4scil7cj1yfHxub29wLGUub3Blbih0LGMuT19XUk9OTFl8Yy5PX1NZTUxJTkssbixmdW5jdGlvbih0LGkpe3JldHVybiB0P3ZvaWQgcih0KTp2b2lkIGUuZmNobW9kKGksbixmdW5jdGlvbih0KXtlLmNsb3NlKGksZnVuY3Rpb24oZSl7cih0fHxlKX0pfSl9KX0sZS5sY2htb2RTeW5jPWZ1bmN0aW9uKHQsbil7dmFyIHIsaT1lLm9wZW5TeW5jKHQsYy5PX1dST05MWXxjLk9fU1lNTElOSyxuKSxvPSEwO3RyeXtyPWUuZmNobW9kU3luYyhpLG4pLG89ITF9ZmluYWxseXtpZihvKXRyeXtlLmNsb3NlU3luYyhpKX1jYXRjaChzKXt9ZWxzZSBlLmNsb3NlU3luYyhpKX1yZXR1cm4gcn19ZnVuY3Rpb24gbyhlKXtjLmhhc093blByb3BlcnR5KFwiT19TWU1MSU5LXCIpPyhlLmx1dGltZXM9ZnVuY3Rpb24odCxuLHIsaSl7ZS5vcGVuKHQsYy5PX1NZTUxJTkssZnVuY3Rpb24odCxvKXtyZXR1cm4gaT1pfHxub29wLHQ/aSh0KTp2b2lkIGUuZnV0aW1lcyhvLG4scixmdW5jdGlvbih0KXtlLmNsb3NlKG8sZnVuY3Rpb24oZSl7cmV0dXJuIGkodHx8ZSl9KX0pfSl9LGUubHV0aW1lc1N5bmM9ZnVuY3Rpb24odCxuLHIpe3ZhciBpLG89ZS5vcGVuU3luYyh0LGMuT19TWU1MSU5LKSxzPSEwO3RyeXtpPWUuZnV0aW1lc1N5bmMobyxuLHIpLHM9ITF9ZmluYWxseXtpZihzKXRyeXtlLmNsb3NlU3luYyhvKX1jYXRjaChhKXt9ZWxzZSBlLmNsb3NlU3luYyhvKX1yZXR1cm4gaX0pOihlLmx1dGltZXM9ZnVuY3Rpb24oZSx0LHIsaSl7bi5uZXh0VGljayhpKX0sZS5sdXRpbWVzU3luYz1mdW5jdGlvbigpe30pfWZ1bmN0aW9uIHMoZSl7cmV0dXJuIGU/ZnVuY3Rpb24odCxuLHIsaSl7cmV0dXJuIGUuY2FsbChmLHQsbixyLGZ1bmN0aW9uKGUsdCl7dShlKSYmKGU9bnVsbCksaShlLHQpfSl9OmV9ZnVuY3Rpb24gYShlKXtyZXR1cm4gZT9mdW5jdGlvbih0LG4scil7dHJ5e3JldHVybiBlLmNhbGwoZix0LG4scil9Y2F0Y2goaSl7aWYoIXUoaSkpdGhyb3cgaX19OmV9ZnVuY3Rpb24gdShlKXtpZighZSlyZXR1cm4hMDtpZihcIkVOT1NZU1wiPT09ZS5jb2RlKXJldHVybiEwO3ZhciB0PSFuLmdldHVpZHx8MCE9PW4uZ2V0dWlkKCk7cmV0dXJuISghdHx8XCJFSU5WQUxcIiE9PWUuY29kZSYmXCJFUEVSTVwiIT09ZS5jb2RlKX12YXIgZj1lKFwiLi9mcy5qc1wiKSxjPWUoXCJjb25zdGFudHNcIiksbD1uLmN3ZCxoPW51bGw7bi5jd2Q9ZnVuY3Rpb24oKXtyZXR1cm4gaHx8KGg9bC5jYWxsKG4pKSxofTt0cnl7bi5jd2QoKX1jYXRjaChwKXt9dmFyIGQ9bi5jaGRpcjtuLmNoZGlyPWZ1bmN0aW9uKGUpe2g9bnVsbCxkLmNhbGwobixlKX0sdC5leHBvcnRzPXJ9KS5jYWxsKHRoaXMsZShcIl9wcm9jZXNzXCIpKX0se1wiLi9mcy5qc1wiOjEzLF9wcm9jZXNzOjI1LGNvbnN0YW50czo4fV0sMTc6W2Z1bmN0aW9uKGUsdCxuKXtuLnJlYWQ9ZnVuY3Rpb24oZSx0LG4scixpKXt2YXIgbyxzLGE9OCppLXItMSx1PSgxPDxhKS0xLGY9dT4+MSxjPS03LGw9bj9pLTE6MCxoPW4/LTE6MSxwPWVbdCtsXTtmb3IobCs9aCxvPXAmKDE8PC1jKS0xLHA+Pj0tYyxjKz1hO2M+MDtvPTI1NipvK2VbdCtsXSxsKz1oLGMtPTgpO2ZvcihzPW8mKDE8PC1jKS0xLG8+Pj0tYyxjKz1yO2M+MDtzPTI1NipzK2VbdCtsXSxsKz1oLGMtPTgpO2lmKDA9PT1vKW89MS1mO2Vsc2V7aWYobz09PXUpcmV0dXJuIHM/TmFOOihwPy0xOjEpKigxLzApO3MrPU1hdGgucG93KDIsciksby09Zn1yZXR1cm4ocD8tMToxKSpzKk1hdGgucG93KDIsby1yKX0sbi53cml0ZT1mdW5jdGlvbihlLHQsbixyLGksbyl7dmFyIHMsYSx1LGY9OCpvLWktMSxjPSgxPDxmKS0xLGw9Yz4+MSxoPTIzPT09aT9NYXRoLnBvdygyLC0yNCktTWF0aC5wb3coMiwtNzcpOjAscD1yPzA6by0xLGQ9cj8xOi0xLGc9dDwwfHwwPT09dCYmMS90PDA/MTowO2Zvcih0PU1hdGguYWJzKHQpLGlzTmFOKHQpfHx0PT09MS8wPyhhPWlzTmFOKHQpPzE6MCxzPWMpOihzPU1hdGguZmxvb3IoTWF0aC5sb2codCkvTWF0aC5MTjIpLHQqKHU9TWF0aC5wb3coMiwtcykpPDEmJihzLS0sdSo9MiksdCs9cytsPj0xP2gvdTpoKk1hdGgucG93KDIsMS1sKSx0KnU+PTImJihzKyssdS89MikscytsPj1jPyhhPTAscz1jKTpzK2w+PTE/KGE9KHQqdS0xKSpNYXRoLnBvdygyLGkpLHMrPWwpOihhPXQqTWF0aC5wb3coMixsLTEpKk1hdGgucG93KDIsaSkscz0wKSk7aT49ODtlW24rcF09MjU1JmEscCs9ZCxhLz0yNTYsaS09OCk7Zm9yKHM9czw8aXxhLGYrPWk7Zj4wO2VbbitwXT0yNTUmcyxwKz1kLHMvPTI1NixmLT04KTtlW24rcC1kXXw9MTI4Kmd9fSx7fV0sMTg6W2Z1bmN0aW9uKGUsdCxuKXshZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQscil7dmFyIGk9dGhpcyBpbnN0YW5jZW9mIGU/dGhpczpuO2lmKGkucmVzZXQociksXCJzdHJpbmdcIj09dHlwZW9mIHQmJnQubGVuZ3RoPjAmJmkuaGFzaCh0KSxpIT09dGhpcylyZXR1cm4gaX12YXIgbjtlLnByb3RvdHlwZS5oYXNoPWZ1bmN0aW9uKGUpe3ZhciB0LG4scixpLG87c3dpdGNoKG89ZS5sZW5ndGgsdGhpcy5sZW4rPW8sbj10aGlzLmsxLHI9MCx0aGlzLnJlbSl7Y2FzZSAwOm5ePW8+cj82NTUzNSZlLmNoYXJDb2RlQXQocisrKTowO2Nhc2UgMTpuXj1vPnI/KDY1NTM1JmUuY2hhckNvZGVBdChyKyspKTw8ODowO2Nhc2UgMjpuXj1vPnI/KDY1NTM1JmUuY2hhckNvZGVBdChyKyspKTw8MTY6MDtjYXNlIDM6bl49bz5yPygyNTUmZS5jaGFyQ29kZUF0KHIpKTw8MjQ6MCxuXj1vPnI/KDY1MjgwJmUuY2hhckNvZGVBdChyKyspKT4+ODowfWlmKHRoaXMucmVtPW8rdGhpcy5yZW0mMyxvLT10aGlzLnJlbSxvPjApe2Zvcih0PXRoaXMuaDE7Oyl7aWYobj0xMTYwMSpuKzM0MzI5MDY3NTIqKDY1NTM1Jm4pJjQyOTQ5NjcyOTUsbj1uPDwxNXxuPj4+MTcsbj0xMzcxNSpuKzQ2MTgzMjE5MiooNjU1MzUmbikmNDI5NDk2NzI5NSx0Xj1uLHQ9dDw8MTN8dD4+PjE5LHQ9NSp0KzM4NjQyOTIxOTYmNDI5NDk2NzI5NSxyPj1vKWJyZWFrO249NjU1MzUmZS5jaGFyQ29kZUF0KHIrKyleKDY1NTM1JmUuY2hhckNvZGVBdChyKyspKTw8OF4oNjU1MzUmZS5jaGFyQ29kZUF0KHIrKykpPDwxNixpPWUuY2hhckNvZGVBdChyKyspLG5ePSgyNTUmaSk8PDI0Xig2NTI4MCZpKT4+OH1zd2l0Y2gobj0wLHRoaXMucmVtKXtjYXNlIDM6bl49KDY1NTM1JmUuY2hhckNvZGVBdChyKzIpKTw8MTY7Y2FzZSAyOm5ePSg2NTUzNSZlLmNoYXJDb2RlQXQocisxKSk8PDg7Y2FzZSAxOm5ePTY1NTM1JmUuY2hhckNvZGVBdChyKX10aGlzLmgxPXR9cmV0dXJuIHRoaXMuazE9bix0aGlzfSxlLnByb3RvdHlwZS5yZXN1bHQ9ZnVuY3Rpb24oKXt2YXIgZSx0O3JldHVybiBlPXRoaXMuazEsdD10aGlzLmgxLGU+MCYmKGU9MTE2MDEqZSszNDMyOTA2NzUyKig2NTUzNSZlKSY0Mjk0OTY3Mjk1LGU9ZTw8MTV8ZT4+PjE3LGU9MTM3MTUqZSs0NjE4MzIxOTIqKDY1NTM1JmUpJjQyOTQ5NjcyOTUsdF49ZSksdF49dGhpcy5sZW4sdF49dD4+PjE2LHQ9NTE4MTkqdCsyMjQ2NzcwNjg4Kig2NTUzNSZ0KSY0Mjk0OTY3Mjk1LHRePXQ+Pj4xMyx0PTQ0NTk3KnQrMzI2NjQ0NTMxMiooNjU1MzUmdCkmNDI5NDk2NzI5NSx0Xj10Pj4+MTYsdD4+PjB9LGUucHJvdG90eXBlLnJlc2V0PWZ1bmN0aW9uKGUpe3JldHVybiB0aGlzLmgxPVwibnVtYmVyXCI9PXR5cGVvZiBlP2U6MCx0aGlzLnJlbT10aGlzLmsxPXRoaXMubGVuPTAsdGhpc30sbj1uZXcgZSxcInVuZGVmaW5lZFwiIT10eXBlb2YgdD90LmV4cG9ydHM9ZTp0aGlzLk11cm11ckhhc2gzPWV9KCl9LHt9XSwxOTpbZnVuY3Rpb24oZSx0LG4pe1wiZnVuY3Rpb25cIj09dHlwZW9mIE9iamVjdC5jcmVhdGU/dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7ZS5zdXBlcl89dCxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKHQucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6ZSxlbnVtZXJhYmxlOiExLHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KX06dC5leHBvcnRzPWZ1bmN0aW9uKGUsdCl7ZS5zdXBlcl89dDt2YXIgbj1mdW5jdGlvbigpe307bi5wcm90b3R5cGU9dC5wcm90b3R5cGUsZS5wcm90b3R5cGU9bmV3IG4sZS5wcm90b3R5cGUuY29uc3RydWN0b3I9ZX19LHt9XSwyMDpbZnVuY3Rpb24oZSx0LG4pe3QuZXhwb3J0cz1mdW5jdGlvbihlKXtyZXR1cm4hKG51bGw9PWV8fCEoZS5faXNCdWZmZXJ8fGUuY29uc3RydWN0b3ImJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUuY29uc3RydWN0b3IuaXNCdWZmZXImJmUuY29uc3RydWN0b3IuaXNCdWZmZXIoZSkpKX19LHt9XSwyMTpbZnVuY3Rpb24oZSx0LG4pe3ZhciByPXt9LnRvU3RyaW5nO3QuZXhwb3J0cz1BcnJheS5pc0FycmF5fHxmdW5jdGlvbihlKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PXIuY2FsbChlKX19LHt9XSwyMjpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbih0KXsoZnVuY3Rpb24oKXt2YXIgcixpLG8scyxhLHUsZixjLGwsaCxwLGQsZyx5LF89ZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKCl7dGhpcy5jb25zdHJ1Y3Rvcj1lfWZvcih2YXIgciBpbiB0KXYuY2FsbCh0LHIpJiYoZVtyXT10W3JdKTtyZXR1cm4gbi5wcm90b3R5cGU9dC5wcm90b3R5cGUsZS5wcm90b3R5cGU9bmV3IG4sZS5fX3N1cGVyX189dC5wcm90b3R5cGUsZX0sdj17fS5oYXNPd25Qcm9wZXJ0eTtnPWUoXCJwYXRoXCIpLGQ9ZShcImZzXCIpLHA9ZShcImV2ZW50c1wiKSx5PWUoXCJ3cml0ZS1maWxlLWF0b21pY1wiKS5zeW5jLGk9XCItLS0uRU1QVFlfU1RSSU5HLi0tLVwiLGY9ZnVuY3Rpb24oZSl7dmFyIHQsbixyLGksbztmb3IoaT1kLnJlYWRkaXJTeW5jKGUpLG89W10sdD0wLG49aS5sZW5ndGg7dDxuO3QrKylyPWlbdF0sby5wdXNoKGwoZy5qb2luKGUscikpKTtyZXR1cm4gb30sbD1mdW5jdGlvbihlKXtyZXR1cm4gZC5zdGF0U3luYyhlKS5pc0RpcmVjdG9yeSgpPyhmKGUpLGQucm1kaXJTeW5jKGUpKTpkLnVubGlua1N5bmMoZSl9LGM9ZnVuY3Rpb24oZSl7dmFyIHQ7cmV0dXJuIHQ9XCJcIj09PWU/aTplLnRvU3RyaW5nKCl9LGE9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlKXt0aGlzLm1lc3NhZ2U9bnVsbCE9ZT9lOlwiVW5rbm93biBlcnJvci5cIixudWxsIT1FcnJvci5jYXB0dXJlU3RhY2tUcmFjZSYmRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcyx0aGlzLmNvbnN0cnVjdG9yKSx0aGlzLm5hbWU9dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfXJldHVybiBfKHQsZSksdC5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uYW1lK1wiOiBcIit0aGlzLm1lc3NhZ2V9LHR9KEVycm9yKSx1PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZShlLHQsbixyLGkpe3RoaXMua2V5PWUsdGhpcy5vbGRWYWx1ZT10LHRoaXMubmV3VmFsdWU9bix0aGlzLnVybD1yLHRoaXMuc3RvcmFnZUFyZWE9bnVsbCE9aT9pOlwibG9jYWxTdG9yYWdlXCJ9cmV0dXJuIGV9KCkscz1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCxuKXtpZih0aGlzLmtleT10LHRoaXMuaW5kZXg9biwhKHRoaXMgaW5zdGFuY2VvZiBlKSlyZXR1cm4gbmV3IGUodGhpcy5rZXksdGhpcy5pbmRleCl9cmV0dXJuIGV9KCksaD1mdW5jdGlvbigpe3ZhciBlO3JldHVybiBlPWZ1bmN0aW9uKCl7fSxlLnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKG51bGwpLG5ldyBlfSxvPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oZSxpKXtyZXR1cm4gdGhpcy5fbG9jYXRpb249ZSx0aGlzLnF1b3RhPW51bGwhPWk/aTo1MjQyODgwLHRoaXMgaW5zdGFuY2VvZiBuPyh0aGlzLl9sb2NhdGlvbj1nLnJlc29sdmUodGhpcy5fbG9jYXRpb24pLG51bGwhPXJbdGhpcy5fbG9jYXRpb25dP3JbdGhpcy5fbG9jYXRpb25dOih0aGlzLmxlbmd0aD0wLHRoaXMuX2J5dGVzSW5Vc2U9MCx0aGlzLl9rZXlzPVtdLHRoaXMuX21ldGFLZXlNYXA9aCgpLHRoaXMuX2V2ZW50VXJsPVwicGlkOlwiK3QucGlkLHRoaXMuX2luaXQoKSx0aGlzLl9RVU9UQV9FWENFRURFRF9FUlI9YSxyW3RoaXMuX2xvY2F0aW9uXT10aGlzLHJbdGhpcy5fbG9jYXRpb25dKSk6bmV3IG4odGhpcy5fbG9jYXRpb24sdGhpcy5xdW90YSl9dmFyIHI7cmV0dXJuIF8obixlKSxyPXt9LG4ucHJvdG90eXBlLl9pbml0PWZ1bmN0aW9uKCl7dmFyIGUsdCxuLHIsaSxvLGEsdTt0cnl7aWYodT1kLnN0YXRTeW5jKHRoaXMuX2xvY2F0aW9uKSxudWxsIT11JiYhdS5pc0RpcmVjdG9yeSgpKXRocm93IG5ldyBFcnJvcihcIkEgZmlsZSBleGlzdHMgYXQgdGhlIGxvY2F0aW9uICdcIit0aGlzLl9sb2NhdGlvbitcIicgd2hlbiB0cnlpbmcgdG8gY3JlYXRlL29wZW4gbG9jYWxTdG9yYWdlXCIpO2Zvcih0aGlzLl9ieXRlc0luVXNlPTAsdGhpcy5sZW5ndGg9MCxuPWQucmVhZGRpclN5bmModGhpcy5fbG9jYXRpb24pLGk9cj0wLGE9bi5sZW5ndGg7cjxhO2k9KytyKW89bltpXSx0PWRlY29kZVVSSUNvbXBvbmVudChvKSx0aGlzLl9rZXlzLnB1c2godCksZT1uZXcgcyhvLGkpLHRoaXMuX21ldGFLZXlNYXBbdF09ZSx1PXRoaXMuX2dldFN0YXQobyksbnVsbCE9KG51bGwhPXU/dS5zaXplOnZvaWQgMCkmJihlLnNpemU9dS5zaXplLHRoaXMuX2J5dGVzSW5Vc2UrPXUuc2l6ZSk7dGhpcy5sZW5ndGg9bi5sZW5ndGh9Y2F0Y2goZil7ZC5ta2RpclN5bmModGhpcy5fbG9jYXRpb24pfX0sbi5wcm90b3R5cGUuc2V0SXRlbT1mdW5jdGlvbihlLHQpe3ZhciBuLHIsaSxvLGYsbCxoLGQsXyx2O2lmKGY9cC5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCh0aGlzLFwic3RvcmFnZVwiKSxkPW51bGwsZiYmKGQ9dGhpcy5nZXRJdGVtKGUpKSxlPWMoZSksbj1lbmNvZGVVUklDb21wb25lbnQoZSksbz1nLmpvaW4odGhpcy5fbG9jYXRpb24sbiksXz10LnRvU3RyaW5nKCksdj1fLmxlbmd0aCxsPXRoaXMuX21ldGFLZXlNYXBbZV0saT0hIWwsaD1pP2wuc2l6ZTowLHRoaXMuX2J5dGVzSW5Vc2UtaCt2PnRoaXMucXVvdGEpdGhyb3cgbmV3IGE7aWYoeShvLF8sXCJ1dGY4XCIpLGl8fChsPW5ldyBzKG4sdGhpcy5fa2V5cy5wdXNoKGUpLTEpLGwuc2l6ZT12LHRoaXMuX21ldGFLZXlNYXBbZV09bCx0aGlzLmxlbmd0aCs9MSx0aGlzLl9ieXRlc0luVXNlKz12KSxmKXJldHVybiByPW5ldyB1KGUsZCx0LHRoaXMuX2V2ZW50VXJsKSx0aGlzLmVtaXQoXCJzdG9yYWdlXCIscil9LG4ucHJvdG90eXBlLmdldEl0ZW09ZnVuY3Rpb24oZSl7dmFyIHQsbjtyZXR1cm4gZT1jKGUpLG49dGhpcy5fbWV0YUtleU1hcFtlXSxuPyh0PWcuam9pbih0aGlzLl9sb2NhdGlvbixuLmtleSksZC5yZWFkRmlsZVN5bmModCxcInV0ZjhcIikpOm51bGx9LG4ucHJvdG90eXBlLl9nZXRTdGF0PWZ1bmN0aW9uKGUpe3ZhciB0O2U9YyhlKSx0PWcuam9pbih0aGlzLl9sb2NhdGlvbixlbmNvZGVVUklDb21wb25lbnQoZSkpO3RyeXtyZXR1cm4gZC5zdGF0U3luYyh0KX1jYXRjaChuKXtyZXR1cm4gbnVsbH19LG4ucHJvdG90eXBlLnJlbW92ZUl0ZW09ZnVuY3Rpb24oZSl7dmFyIHQsbixyLGksbyxzLGEsZixoO2lmKGU9YyhlKSxzPXRoaXMuX21ldGFLZXlNYXBbZV0pe3I9cC5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCh0aGlzLFwic3RvcmFnZVwiKSxhPW51bGwsciYmKGE9dGhpcy5nZXRJdGVtKGUpKSxkZWxldGUgdGhpcy5fbWV0YUtleU1hcFtlXSx0aGlzLmxlbmd0aC09MSx0aGlzLl9ieXRlc0luVXNlLT1zLnNpemUsbj1nLmpvaW4odGhpcy5fbG9jYXRpb24scy5rZXkpLHRoaXMuX2tleXMuc3BsaWNlKHMuaW5kZXgsMSksZj10aGlzLl9tZXRhS2V5TWFwO2ZvcihpIGluIGYpaD1mW2ldLG89dGhpcy5fbWV0YUtleU1hcFtpXSxvLmluZGV4PnMuaW5kZXgmJihvLmluZGV4LT0xKTtpZihsKG4pLHIpcmV0dXJuIHQ9bmV3IHUoZSxhLG51bGwsdGhpcy5fZXZlbnRVcmwpLHRoaXMuZW1pdChcInN0b3JhZ2VcIix0KX19LG4ucHJvdG90eXBlLmtleT1mdW5jdGlvbihlKXtyZXR1cm4gdGhpcy5fa2V5c1tlXX0sbi5wcm90b3R5cGUuY2xlYXI9ZnVuY3Rpb24oKXt2YXIgZTtpZihmKHRoaXMuX2xvY2F0aW9uKSx0aGlzLl9tZXRhS2V5TWFwPWgoKSx0aGlzLl9rZXlzPVtdLHRoaXMubGVuZ3RoPTAsdGhpcy5fYnl0ZXNJblVzZT0wLHAuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQodGhpcyxcInN0b3JhZ2VcIikpcmV0dXJuIGU9bmV3IHUobnVsbCxudWxsLG51bGwsdGhpcy5fZXZlbnRVcmwpLHRoaXMuZW1pdChcInN0b3JhZ2VcIixlKX0sbi5wcm90b3R5cGUuX2dldEJ5dGVzSW5Vc2U9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fYnl0ZXNJblVzZX0sbi5wcm90b3R5cGUuX2RlbGV0ZUxvY2F0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIGRlbGV0ZSByW3RoaXMuX2xvY2F0aW9uXSxsKHRoaXMuX2xvY2F0aW9uKSx0aGlzLl9tZXRhS2V5TWFwPXt9LHRoaXMuX2tleXM9W10sdGhpcy5sZW5ndGg9MCx0aGlzLl9ieXRlc0luVXNlPTB9LG59KHAuRXZlbnRFbWl0dGVyKSxyPWZ1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoKXtyZXR1cm4gdC5fX3N1cGVyX18uY29uc3RydWN0b3IuYXBwbHkodGhpcyxhcmd1bWVudHMpfXJldHVybiBfKHQsZSksdC5wcm90b3R5cGUuc2V0SXRlbT1mdW5jdGlvbihlLG4pe3ZhciByO3JldHVybiByPUpTT04uc3RyaW5naWZ5KG4pLHQuX19zdXBlcl9fLnNldEl0ZW0uY2FsbCh0aGlzLGUscil9LHQucHJvdG90eXBlLmdldEl0ZW09ZnVuY3Rpb24oZSl7cmV0dXJuIEpTT04ucGFyc2UodC5fX3N1cGVyX18uZ2V0SXRlbS5jYWxsKHRoaXMsZSkpfSx0fShvKSxuLkxvY2FsU3RvcmFnZT1vLG4uSlNPTlN0b3JhZ2U9cixuLlFVT1RBX0VYQ0VFREVEX0VSUj1hfSkuY2FsbCh0aGlzKX0pLmNhbGwodGhpcyxlKFwiX3Byb2Nlc3NcIikpfSx7X3Byb2Nlc3M6MjUsZXZlbnRzOjEyLGZzOjQscGF0aDoyMyxcIndyaXRlLWZpbGUtYXRvbWljXCI6NDV9XSwyMzpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihlKXtmdW5jdGlvbiB0KGUsdCl7Zm9yKHZhciBuPTAscj1lLmxlbmd0aC0xO3I+PTA7ci0tKXt2YXIgaT1lW3JdO1wiLlwiPT09aT9lLnNwbGljZShyLDEpOlwiLi5cIj09PWk/KGUuc3BsaWNlKHIsMSksbisrKTpuJiYoZS5zcGxpY2UociwxKSxuLS0pfWlmKHQpZm9yKDtuLS07billLnVuc2hpZnQoXCIuLlwiKTtyZXR1cm4gZX1mdW5jdGlvbiByKGUsdCl7aWYoZS5maWx0ZXIpcmV0dXJuIGUuZmlsdGVyKHQpO2Zvcih2YXIgbj1bXSxyPTA7cjxlLmxlbmd0aDtyKyspdChlW3JdLHIsZSkmJm4ucHVzaChlW3JdKTtyZXR1cm4gbn12YXIgaT0vXihcXC8/fCkoW1xcc1xcU10qPykoKD86XFwuezEsMn18W15cXC9dKz98KShcXC5bXi5cXC9dKnwpKSg/OltcXC9dKikkLyxvPWZ1bmN0aW9uKGUpe3JldHVybiBpLmV4ZWMoZSkuc2xpY2UoMSl9O24ucmVzb2x2ZT1mdW5jdGlvbigpe2Zvcih2YXIgbj1cIlwiLGk9ITEsbz1hcmd1bWVudHMubGVuZ3RoLTE7bz49LTEmJiFpO28tLSl7dmFyIHM9bz49MD9hcmd1bWVudHNbb106ZS5jd2QoKTtpZihcInN0cmluZ1wiIT10eXBlb2Ygcyl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQXJndW1lbnRzIHRvIHBhdGgucmVzb2x2ZSBtdXN0IGJlIHN0cmluZ3NcIik7cyYmKG49cytcIi9cIituLGk9XCIvXCI9PT1zLmNoYXJBdCgwKSl9cmV0dXJuIG49dChyKG4uc3BsaXQoXCIvXCIpLGZ1bmN0aW9uKGUpe3JldHVybiEhZX0pLCFpKS5qb2luKFwiL1wiKSwoaT9cIi9cIjpcIlwiKStufHxcIi5cIn0sbi5ub3JtYWxpemU9ZnVuY3Rpb24oZSl7dmFyIGk9bi5pc0Fic29sdXRlKGUpLG89XCIvXCI9PT1zKGUsLTEpO3JldHVybiBlPXQocihlLnNwbGl0KFwiL1wiKSxmdW5jdGlvbihlKXtyZXR1cm4hIWV9KSwhaSkuam9pbihcIi9cIiksZXx8aXx8KGU9XCIuXCIpLGUmJm8mJihlKz1cIi9cIiksKGk/XCIvXCI6XCJcIikrZX0sbi5pc0Fic29sdXRlPWZ1bmN0aW9uKGUpe3JldHVyblwiL1wiPT09ZS5jaGFyQXQoMCl9LG4uam9pbj1mdW5jdGlvbigpe3ZhciBlPUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywwKTtyZXR1cm4gbi5ub3JtYWxpemUocihlLGZ1bmN0aW9uKGUsdCl7aWYoXCJzdHJpbmdcIiE9dHlwZW9mIGUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkFyZ3VtZW50cyB0byBwYXRoLmpvaW4gbXVzdCBiZSBzdHJpbmdzXCIpO3JldHVybiBlfSkuam9pbihcIi9cIikpfSxuLnJlbGF0aXZlPWZ1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gcihlKXtmb3IodmFyIHQ9MDt0PGUubGVuZ3RoJiZcIlwiPT09ZVt0XTt0KyspO2Zvcih2YXIgbj1lLmxlbmd0aC0xO24+PTAmJlwiXCI9PT1lW25dO24tLSk7cmV0dXJuIHQ+bj9bXTplLnNsaWNlKHQsbi10KzEpfWU9bi5yZXNvbHZlKGUpLnN1YnN0cigxKSx0PW4ucmVzb2x2ZSh0KS5zdWJzdHIoMSk7Zm9yKHZhciBpPXIoZS5zcGxpdChcIi9cIikpLG89cih0LnNwbGl0KFwiL1wiKSkscz1NYXRoLm1pbihpLmxlbmd0aCxvLmxlbmd0aCksYT1zLHU9MDt1PHM7dSsrKWlmKGlbdV0hPT1vW3VdKXthPXU7YnJlYWt9Zm9yKHZhciBmPVtdLHU9YTt1PGkubGVuZ3RoO3UrKylmLnB1c2goXCIuLlwiKTtyZXR1cm4gZj1mLmNvbmNhdChvLnNsaWNlKGEpKSxmLmpvaW4oXCIvXCIpfSxuLnNlcD1cIi9cIixuLmRlbGltaXRlcj1cIjpcIixuLmRpcm5hbWU9ZnVuY3Rpb24oZSl7dmFyIHQ9byhlKSxuPXRbMF0scj10WzFdO3JldHVybiBufHxyPyhyJiYocj1yLnN1YnN0cigwLHIubGVuZ3RoLTEpKSxuK3IpOlwiLlwifSxuLmJhc2VuYW1lPWZ1bmN0aW9uKGUsdCl7dmFyIG49byhlKVsyXTtyZXR1cm4gdCYmbi5zdWJzdHIoLTEqdC5sZW5ndGgpPT09dCYmKG49bi5zdWJzdHIoMCxuLmxlbmd0aC10Lmxlbmd0aCkpLG59LG4uZXh0bmFtZT1mdW5jdGlvbihlKXtyZXR1cm4gbyhlKVszXX07dmFyIHM9XCJiXCI9PT1cImFiXCIuc3Vic3RyKC0xKT9mdW5jdGlvbihlLHQsbil7cmV0dXJuIGUuc3Vic3RyKHQsbil9OmZ1bmN0aW9uKGUsdCxuKXtyZXR1cm4gdDwwJiYodD1lLmxlbmd0aCt0KSxlLnN1YnN0cih0LG4pfX0pLmNhbGwodGhpcyxlKFwiX3Byb2Nlc3NcIikpfSx7X3Byb2Nlc3M6MjV9XSwyNDpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBuKHQsbixyLGkpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpdGhyb3cgbmV3IFR5cGVFcnJvcignXCJjYWxsYmFja1wiIGFyZ3VtZW50IG11c3QgYmUgYSBmdW5jdGlvbicpO3ZhciBvLHMsYT1hcmd1bWVudHMubGVuZ3RoO3N3aXRjaChhKXtjYXNlIDA6Y2FzZSAxOnJldHVybiBlLm5leHRUaWNrKHQpO2Nhc2UgMjpyZXR1cm4gZS5uZXh0VGljayhmdW5jdGlvbigpe3QuY2FsbChudWxsLG4pfSk7Y2FzZSAzOnJldHVybiBlLm5leHRUaWNrKGZ1bmN0aW9uKCl7dC5jYWxsKG51bGwsbixyKX0pO2Nhc2UgNDpyZXR1cm4gZS5uZXh0VGljayhmdW5jdGlvbigpe3QuY2FsbChudWxsLG4scixpKX0pO2RlZmF1bHQ6Zm9yKG89bmV3IEFycmF5KGEtMSkscz0wO3M8by5sZW5ndGg7KW9bcysrXT1hcmd1bWVudHNbc107cmV0dXJuIGUubmV4dFRpY2soZnVuY3Rpb24oKXt0LmFwcGx5KG51bGwsbyl9KX19IWUudmVyc2lvbnx8MD09PWUudmVyc2lvbi5pbmRleE9mKFwidjAuXCIpfHwwPT09ZS52ZXJzaW9uLmluZGV4T2YoXCJ2MS5cIikmJjAhPT1lLnZlcnNpb24uaW5kZXhPZihcInYxLjguXCIpP3QuZXhwb3J0cz1uOnQuZXhwb3J0cz1lLm5leHRUaWNrfSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtfcHJvY2VzczoyNX1dLDI1OltmdW5jdGlvbihlLHQsbil7ZnVuY3Rpb24gcigpe2gmJmMmJihoPSExLGMubGVuZ3RoP2w9Yy5jb25jYXQobCk6cD0tMSxsLmxlbmd0aCYmaSgpKX1mdW5jdGlvbiBpKCl7aWYoIWgpe3ZhciBlPWEocik7aD0hMDtmb3IodmFyIHQ9bC5sZW5ndGg7dDspe2ZvcihjPWwsbD1bXTsrK3A8dDspYyYmY1twXS5ydW4oKTtwPS0xLHQ9bC5sZW5ndGh9Yz1udWxsLGg9ITEsdShlKX19ZnVuY3Rpb24gbyhlLHQpe3RoaXMuZnVuPWUsdGhpcy5hcnJheT10fWZ1bmN0aW9uIHMoKXt9dmFyIGEsdSxmPXQuZXhwb3J0cz17fTshZnVuY3Rpb24oKXt0cnl7YT1zZXRUaW1lb3V0fWNhdGNoKGUpe2E9ZnVuY3Rpb24oKXt0aHJvdyBuZXcgRXJyb3IoXCJzZXRUaW1lb3V0IGlzIG5vdCBkZWZpbmVkXCIpfX10cnl7dT1jbGVhclRpbWVvdXR9Y2F0Y2goZSl7dT1mdW5jdGlvbigpe3Rocm93IG5ldyBFcnJvcihcImNsZWFyVGltZW91dCBpcyBub3QgZGVmaW5lZFwiKX19fSgpO3ZhciBjLGw9W10saD0hMSxwPS0xO2YubmV4dFRpY2s9ZnVuY3Rpb24oZSl7dmFyIHQ9bmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGgtMSk7aWYoYXJndW1lbnRzLmxlbmd0aD4xKWZvcih2YXIgbj0xO248YXJndW1lbnRzLmxlbmd0aDtuKyspdFtuLTFdPWFyZ3VtZW50c1tuXTtsLnB1c2gobmV3IG8oZSx0KSksMSE9PWwubGVuZ3RofHxofHxhKGksMCl9LG8ucHJvdG90eXBlLnJ1bj1mdW5jdGlvbigpe3RoaXMuZnVuLmFwcGx5KG51bGwsdGhpcy5hcnJheSl9LGYudGl0bGU9XCJicm93c2VyXCIsZi5icm93c2VyPSEwLGYuZW52PXt9LGYuYXJndj1bXSxmLnZlcnNpb249XCJcIixmLnZlcnNpb25zPXt9LGYub249cyxmLmFkZExpc3RlbmVyPXMsZi5vbmNlPXMsZi5vZmY9cyxmLnJlbW92ZUxpc3RlbmVyPXMsZi5yZW1vdmVBbGxMaXN0ZW5lcnM9cyxmLmVtaXQ9cyxmLmJpbmRpbmc9ZnVuY3Rpb24oZSl7dGhyb3cgbmV3IEVycm9yKFwicHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWRcIil9LGYuY3dkPWZ1bmN0aW9uKCl7cmV0dXJuXCIvXCJ9LGYuY2hkaXI9ZnVuY3Rpb24oZSl7dGhyb3cgbmV3IEVycm9yKFwicHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkXCIpfSxmLnVtYXNrPWZ1bmN0aW9uKCl7cmV0dXJuIDB9fSx7fV0sMjY6W2Z1bmN0aW9uKGUsdCxuKXt0LmV4cG9ydHM9ZShcIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzXCIpfSx7XCIuL2xpYi9fc3RyZWFtX2R1cGxleC5qc1wiOjI3fV0sMjc6W2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiB0aGlzIGluc3RhbmNlb2Ygcj8oZi5jYWxsKHRoaXMsZSksYy5jYWxsKHRoaXMsZSksZSYmZS5yZWFkYWJsZT09PSExJiYodGhpcy5yZWFkYWJsZT0hMSksZSYmZS53cml0YWJsZT09PSExJiYodGhpcy53cml0YWJsZT0hMSksdGhpcy5hbGxvd0hhbGZPcGVuPSEwLGUmJmUuYWxsb3dIYWxmT3Blbj09PSExJiYodGhpcy5hbGxvd0hhbGZPcGVuPSExKSx2b2lkIHRoaXMub25jZShcImVuZFwiLGkpKTpuZXcgcihlKX1mdW5jdGlvbiBpKCl7dGhpcy5hbGxvd0hhbGZPcGVufHx0aGlzLl93cml0YWJsZVN0YXRlLmVuZGVkfHxhKG8sdGhpcyl9ZnVuY3Rpb24gbyhlKXtlLmVuZCgpfXZhciBzPU9iamVjdC5rZXlzfHxmdW5jdGlvbihlKXt2YXIgdD1bXTtmb3IodmFyIG4gaW4gZSl0LnB1c2gobik7cmV0dXJuIHR9O3QuZXhwb3J0cz1yO3ZhciBhPWUoXCJwcm9jZXNzLW5leHRpY2stYXJnc1wiKSx1PWUoXCJjb3JlLXV0aWwtaXNcIik7dS5pbmhlcml0cz1lKFwiaW5oZXJpdHNcIik7dmFyIGY9ZShcIi4vX3N0cmVhbV9yZWFkYWJsZVwiKSxjPWUoXCIuL19zdHJlYW1fd3JpdGFibGVcIik7dS5pbmhlcml0cyhyLGYpO2Zvcih2YXIgbD1zKGMucHJvdG90eXBlKSxoPTA7aDxsLmxlbmd0aDtoKyspe3ZhciBwPWxbaF07ci5wcm90b3R5cGVbcF18fChyLnByb3RvdHlwZVtwXT1jLnByb3RvdHlwZVtwXSl9fSx7XCIuL19zdHJlYW1fcmVhZGFibGVcIjoyOSxcIi4vX3N0cmVhbV93cml0YWJsZVwiOjMxLFwiY29yZS11dGlsLWlzXCI6MTEsaW5oZXJpdHM6MTksXCJwcm9jZXNzLW5leHRpY2stYXJnc1wiOjI0fV0sMjg6W2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUpe3JldHVybiB0aGlzIGluc3RhbmNlb2Ygcj92b2lkIGkuY2FsbCh0aGlzLGUpOm5ldyByKGUpfXQuZXhwb3J0cz1yO3ZhciBpPWUoXCIuL19zdHJlYW1fdHJhbnNmb3JtXCIpLG89ZShcImNvcmUtdXRpbC1pc1wiKTtvLmluaGVyaXRzPWUoXCJpbmhlcml0c1wiKSxvLmluaGVyaXRzKHIsaSksci5wcm90b3R5cGUuX3RyYW5zZm9ybT1mdW5jdGlvbihlLHQsbil7bihudWxsLGUpfX0se1wiLi9fc3RyZWFtX3RyYW5zZm9ybVwiOjMwLFwiY29yZS11dGlsLWlzXCI6MTEsaW5oZXJpdHM6MTl9XSwyOTpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihuKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiByKGUsdCxuKXtyZXR1cm4gaz9lLnByZXBlbmRMaXN0ZW5lcih0LG4pOnZvaWQoZS5fZXZlbnRzJiZlLl9ldmVudHNbdF0/VChlLl9ldmVudHNbdF0pP2UuX2V2ZW50c1t0XS51bnNoaWZ0KG4pOmUuX2V2ZW50c1t0XT1bbixlLl9ldmVudHNbdF1dOmUub24odCxuKSl9ZnVuY3Rpb24gaSh0LG4pe1U9VXx8ZShcIi4vX3N0cmVhbV9kdXBsZXhcIiksdD10fHx7fSx0aGlzLm9iamVjdE1vZGU9ISF0Lm9iamVjdE1vZGUsbiBpbnN0YW5jZW9mIFUmJih0aGlzLm9iamVjdE1vZGU9dGhpcy5vYmplY3RNb2RlfHwhIXQucmVhZGFibGVPYmplY3RNb2RlKTt2YXIgcj10LmhpZ2hXYXRlck1hcmssaT10aGlzLm9iamVjdE1vZGU/MTY6MTYzODQ7dGhpcy5oaWdoV2F0ZXJNYXJrPXJ8fDA9PT1yP3I6aSx0aGlzLmhpZ2hXYXRlck1hcms9fn50aGlzLmhpZ2hXYXRlck1hcmssdGhpcy5idWZmZXI9W10sdGhpcy5sZW5ndGg9MCx0aGlzLnBpcGVzPW51bGwsdGhpcy5waXBlc0NvdW50PTAsdGhpcy5mbG93aW5nPW51bGwsdGhpcy5lbmRlZD0hMSx0aGlzLmVuZEVtaXR0ZWQ9ITEsdGhpcy5yZWFkaW5nPSExLHRoaXMuc3luYz0hMCx0aGlzLm5lZWRSZWFkYWJsZT0hMSx0aGlzLmVtaXR0ZWRSZWFkYWJsZT0hMSx0aGlzLnJlYWRhYmxlTGlzdGVuaW5nPSExLHRoaXMucmVzdW1lU2NoZWR1bGVkPSExLHRoaXMuZGVmYXVsdEVuY29kaW5nPXQuZGVmYXVsdEVuY29kaW5nfHxcInV0ZjhcIix0aGlzLnJhbk91dD0hMSx0aGlzLmF3YWl0RHJhaW49MCx0aGlzLnJlYWRpbmdNb3JlPSExLHRoaXMuZGVjb2Rlcj1udWxsLHRoaXMuZW5jb2Rpbmc9bnVsbCx0LmVuY29kaW5nJiYoanx8KGo9ZShcInN0cmluZ19kZWNvZGVyL1wiKS5TdHJpbmdEZWNvZGVyKSx0aGlzLmRlY29kZXI9bmV3IGoodC5lbmNvZGluZyksdGhpcy5lbmNvZGluZz10LmVuY29kaW5nKX1mdW5jdGlvbiBvKHQpe3JldHVybiBVPVV8fGUoXCIuL19zdHJlYW1fZHVwbGV4XCIpLHRoaXMgaW5zdGFuY2VvZiBvPyh0aGlzLl9yZWFkYWJsZVN0YXRlPW5ldyBpKHQsdGhpcyksdGhpcy5yZWFkYWJsZT0hMCx0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LnJlYWQmJih0aGlzLl9yZWFkPXQucmVhZCksdm9pZCBJLmNhbGwodGhpcykpOm5ldyBvKHQpfWZ1bmN0aW9uIHMoZSx0LG4scixpKXt2YXIgbz1jKHQsbik7aWYobyllLmVtaXQoXCJlcnJvclwiLG8pO2Vsc2UgaWYobnVsbD09PW4pdC5yZWFkaW5nPSExLGwoZSx0KTtlbHNlIGlmKHQub2JqZWN0TW9kZXx8biYmbi5sZW5ndGg+MClpZih0LmVuZGVkJiYhaSl7dmFyIHM9bmV3IEVycm9yKFwic3RyZWFtLnB1c2goKSBhZnRlciBFT0ZcIik7ZS5lbWl0KFwiZXJyb3JcIixzKX1lbHNlIGlmKHQuZW5kRW1pdHRlZCYmaSl7dmFyIHU9bmV3IEVycm9yKFwic3RyZWFtLnVuc2hpZnQoKSBhZnRlciBlbmQgZXZlbnRcIik7ZS5lbWl0KFwiZXJyb3JcIix1KX1lbHNle3ZhciBmOyF0LmRlY29kZXJ8fGl8fHJ8fChuPXQuZGVjb2Rlci53cml0ZShuKSxmPSF0Lm9iamVjdE1vZGUmJjA9PT1uLmxlbmd0aCksaXx8KHQucmVhZGluZz0hMSksZnx8KHQuZmxvd2luZyYmMD09PXQubGVuZ3RoJiYhdC5zeW5jPyhlLmVtaXQoXCJkYXRhXCIsbiksZS5yZWFkKDApKToodC5sZW5ndGgrPXQub2JqZWN0TW9kZT8xOm4ubGVuZ3RoLGk/dC5idWZmZXIudW5zaGlmdChuKTp0LmJ1ZmZlci5wdXNoKG4pLHQubmVlZFJlYWRhYmxlJiZoKGUpKSksZChlLHQpfWVsc2UgaXx8KHQucmVhZGluZz0hMSk7cmV0dXJuIGEodCl9ZnVuY3Rpb24gYShlKXtyZXR1cm4hZS5lbmRlZCYmKGUubmVlZFJlYWRhYmxlfHxlLmxlbmd0aDxlLmhpZ2hXYXRlck1hcmt8fDA9PT1lLmxlbmd0aCl9ZnVuY3Rpb24gdShlKXtyZXR1cm4gZT49Qj9lPUI6KGUtLSxlfD1lPj4+MSxlfD1lPj4+MixlfD1lPj4+NCxlfD1lPj4+OCxlfD1lPj4+MTYsZSsrKSxlfWZ1bmN0aW9uIGYoZSx0KXtyZXR1cm4gMD09PXQubGVuZ3RoJiZ0LmVuZGVkPzA6dC5vYmplY3RNb2RlPzA9PT1lPzA6MTpudWxsPT09ZXx8aXNOYU4oZSk/dC5mbG93aW5nJiZ0LmJ1ZmZlci5sZW5ndGg/dC5idWZmZXJbMF0ubGVuZ3RoOnQubGVuZ3RoOmU8PTA/MDooZT50LmhpZ2hXYXRlck1hcmsmJih0LmhpZ2hXYXRlck1hcms9dShlKSksZT50Lmxlbmd0aD90LmVuZGVkP3QubGVuZ3RoOih0Lm5lZWRSZWFkYWJsZT0hMCwwKTplKX1mdW5jdGlvbiBjKGUsdCl7dmFyIG49bnVsbDtyZXR1cm4gUC5pc0J1ZmZlcih0KXx8XCJzdHJpbmdcIj09dHlwZW9mIHR8fG51bGw9PT10fHx2b2lkIDA9PT10fHxlLm9iamVjdE1vZGV8fChuPW5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIG5vbi1zdHJpbmcvYnVmZmVyIGNodW5rXCIpKSxufWZ1bmN0aW9uIGwoZSx0KXtpZighdC5lbmRlZCl7aWYodC5kZWNvZGVyKXt2YXIgbj10LmRlY29kZXIuZW5kKCk7biYmbi5sZW5ndGgmJih0LmJ1ZmZlci5wdXNoKG4pLHQubGVuZ3RoKz10Lm9iamVjdE1vZGU/MTpuLmxlbmd0aCl9dC5lbmRlZD0hMCxoKGUpfX1mdW5jdGlvbiBoKGUpe3ZhciB0PWUuX3JlYWRhYmxlU3RhdGU7dC5uZWVkUmVhZGFibGU9ITEsdC5lbWl0dGVkUmVhZGFibGV8fChEKFwiZW1pdFJlYWRhYmxlXCIsdC5mbG93aW5nKSx0LmVtaXR0ZWRSZWFkYWJsZT0hMCx0LnN5bmM/QShwLGUpOnAoZSkpfWZ1bmN0aW9uIHAoZSl7RChcImVtaXQgcmVhZGFibGVcIiksZS5lbWl0KFwicmVhZGFibGVcIiksRShlKX1mdW5jdGlvbiBkKGUsdCl7dC5yZWFkaW5nTW9yZXx8KHQucmVhZGluZ01vcmU9ITAsQShnLGUsdCkpfWZ1bmN0aW9uIGcoZSx0KXtmb3IodmFyIG49dC5sZW5ndGg7IXQucmVhZGluZyYmIXQuZmxvd2luZyYmIXQuZW5kZWQmJnQubGVuZ3RoPHQuaGlnaFdhdGVyTWFyayYmKEQoXCJtYXliZVJlYWRNb3JlIHJlYWQgMFwiKSxlLnJlYWQoMCksbiE9PXQubGVuZ3RoKTspbj10Lmxlbmd0aDt0LnJlYWRpbmdNb3JlPSExfWZ1bmN0aW9uIHkoZSl7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIHQ9ZS5fcmVhZGFibGVTdGF0ZTtEKFwicGlwZU9uRHJhaW5cIix0LmF3YWl0RHJhaW4pLHQuYXdhaXREcmFpbiYmdC5hd2FpdERyYWluLS0sMD09PXQuYXdhaXREcmFpbiYmTihlLFwiZGF0YVwiKSYmKHQuZmxvd2luZz0hMCxFKGUpKX19ZnVuY3Rpb24gXyhlKXtEKFwicmVhZGFibGUgbmV4dHRpY2sgcmVhZCAwXCIpLGUucmVhZCgwKX1mdW5jdGlvbiB2KGUsdCl7dC5yZXN1bWVTY2hlZHVsZWR8fCh0LnJlc3VtZVNjaGVkdWxlZD0hMCxBKG0sZSx0KSl9ZnVuY3Rpb24gbShlLHQpe3QucmVhZGluZ3x8KEQoXCJyZXN1bWUgcmVhZCAwXCIpLGUucmVhZCgwKSksdC5yZXN1bWVTY2hlZHVsZWQ9ITEsZS5lbWl0KFwicmVzdW1lXCIpLEUoZSksdC5mbG93aW5nJiYhdC5yZWFkaW5nJiZlLnJlYWQoMCl9ZnVuY3Rpb24gRShlKXt2YXIgdD1lLl9yZWFkYWJsZVN0YXRlO2lmKEQoXCJmbG93XCIsdC5mbG93aW5nKSx0LmZsb3dpbmcpZG8gdmFyIG49ZS5yZWFkKCk7d2hpbGUobnVsbCE9PW4mJnQuZmxvd2luZyl9ZnVuY3Rpb24gdyhlLHQpe3ZhciBuLHI9dC5idWZmZXIsaT10Lmxlbmd0aCxvPSEhdC5kZWNvZGVyLHM9ISF0Lm9iamVjdE1vZGU7aWYoMD09PXIubGVuZ3RoKXJldHVybiBudWxsO2lmKDA9PT1pKW49bnVsbDtlbHNlIGlmKHMpbj1yLnNoaWZ0KCk7ZWxzZSBpZighZXx8ZT49aSluPW8/ci5qb2luKFwiXCIpOjE9PT1yLmxlbmd0aD9yWzBdOlAuY29uY2F0KHIsaSksci5sZW5ndGg9MDtlbHNlIGlmKGU8clswXS5sZW5ndGgpe3ZhciBhPXJbMF07bj1hLnNsaWNlKDAsZSksclswXT1hLnNsaWNlKGUpfWVsc2UgaWYoZT09PXJbMF0ubGVuZ3RoKW49ci5zaGlmdCgpO2Vsc2V7bj1vP1wiXCI6Qy5hbGxvY1Vuc2FmZShlKTtmb3IodmFyIHU9MCxmPTAsYz1yLmxlbmd0aDtmPGMmJnU8ZTtmKyspe3ZhciBsPXJbMF0saD1NYXRoLm1pbihlLXUsbC5sZW5ndGgpO28/bis9bC5zbGljZSgwLGgpOmwuY29weShuLHUsMCxoKSxoPGwubGVuZ3RoP3JbMF09bC5zbGljZShoKTpyLnNoaWZ0KCksdSs9aH19cmV0dXJuIG59ZnVuY3Rpb24gYihlKXt2YXIgdD1lLl9yZWFkYWJsZVN0YXRlO2lmKHQubGVuZ3RoPjApdGhyb3cgbmV3IEVycm9yKCdcImVuZFJlYWRhYmxlKClcIiBjYWxsZWQgb24gbm9uLWVtcHR5IHN0cmVhbScpO3QuZW5kRW1pdHRlZHx8KHQuZW5kZWQ9ITAsQShTLHQsZSkpfWZ1bmN0aW9uIFMoZSx0KXtlLmVuZEVtaXR0ZWR8fDAhPT1lLmxlbmd0aHx8KGUuZW5kRW1pdHRlZD0hMCx0LnJlYWRhYmxlPSExLHQuZW1pdChcImVuZFwiKSl9ZnVuY3Rpb24gTyhlLHQpe2Zvcih2YXIgbj0wLHI9ZS5sZW5ndGg7bjxyO24rKyl0KGVbbl0sbil9ZnVuY3Rpb24gUihlLHQpe2Zvcih2YXIgbj0wLHI9ZS5sZW5ndGg7bjxyO24rKylpZihlW25dPT09dClyZXR1cm4gbjtyZXR1cm4tMX10LmV4cG9ydHM9bzt2YXIgQT1lKFwicHJvY2Vzcy1uZXh0aWNrLWFyZ3NcIiksVD1lKFwiaXNhcnJheVwiKTtvLlJlYWRhYmxlU3RhdGU9aTt2YXIgSSxMPWUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyLE49ZnVuY3Rpb24oZSx0KXtyZXR1cm4gZS5saXN0ZW5lcnModCkubGVuZ3RofTshZnVuY3Rpb24oKXt0cnl7ST1lKFwic3RyZWFtXCIpfWNhdGNoKHQpe31maW5hbGx5e0l8fChJPWUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyKX19KCk7dmFyIFA9ZShcImJ1ZmZlclwiKS5CdWZmZXIsQz1lKFwiYnVmZmVyLXNoaW1zXCIpLE09ZShcImNvcmUtdXRpbC1pc1wiKTtNLmluaGVyaXRzPWUoXCJpbmhlcml0c1wiKTt2YXIgeD1lKFwidXRpbFwiKSxEPXZvaWQgMDtEPXgmJnguZGVidWdsb2c/eC5kZWJ1Z2xvZyhcInN0cmVhbVwiKTpmdW5jdGlvbigpe307dmFyIGo7TS5pbmhlcml0cyhvLEkpO3ZhciBVLFUsaz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBMLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXI7by5wcm90b3R5cGUucHVzaD1mdW5jdGlvbihlLHQpe3ZhciBuPXRoaXMuX3JlYWRhYmxlU3RhdGU7cmV0dXJuIG4ub2JqZWN0TW9kZXx8XCJzdHJpbmdcIiE9dHlwZW9mIGV8fCh0PXR8fG4uZGVmYXVsdEVuY29kaW5nLHQhPT1uLmVuY29kaW5nJiYoZT1DLmZyb20oZSx0KSx0PVwiXCIpKSxzKHRoaXMsbixlLHQsITEpfSxvLnByb3RvdHlwZS51bnNoaWZ0PWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3JlYWRhYmxlU3RhdGU7cmV0dXJuIHModGhpcyx0LGUsXCJcIiwhMCl9LG8ucHJvdG90eXBlLmlzUGF1c2VkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZz09PSExfSxvLnByb3RvdHlwZS5zZXRFbmNvZGluZz1mdW5jdGlvbih0KXtyZXR1cm4ganx8KGo9ZShcInN0cmluZ19kZWNvZGVyL1wiKS5TdHJpbmdEZWNvZGVyKSx0aGlzLl9yZWFkYWJsZVN0YXRlLmRlY29kZXI9bmV3IGoodCksdGhpcy5fcmVhZGFibGVTdGF0ZS5lbmNvZGluZz10LHRoaXN9O3ZhciBCPTgzODg2MDg7by5wcm90b3R5cGUucmVhZD1mdW5jdGlvbihlKXtEKFwicmVhZFwiLGUpO3ZhciB0PXRoaXMuX3JlYWRhYmxlU3RhdGUsbj1lO2lmKChcIm51bWJlclwiIT10eXBlb2YgZXx8ZT4wKSYmKHQuZW1pdHRlZFJlYWRhYmxlPSExKSwwPT09ZSYmdC5uZWVkUmVhZGFibGUmJih0Lmxlbmd0aD49dC5oaWdoV2F0ZXJNYXJrfHx0LmVuZGVkKSlyZXR1cm4gRChcInJlYWQ6IGVtaXRSZWFkYWJsZVwiLHQubGVuZ3RoLHQuZW5kZWQpLDA9PT10Lmxlbmd0aCYmdC5lbmRlZD9iKHRoaXMpOmgodGhpcyksbnVsbDtpZihlPWYoZSx0KSwwPT09ZSYmdC5lbmRlZClyZXR1cm4gMD09PXQubGVuZ3RoJiZiKHRoaXMpLG51bGw7dmFyIHI9dC5uZWVkUmVhZGFibGU7RChcIm5lZWQgcmVhZGFibGVcIixyKSwoMD09PXQubGVuZ3RofHx0Lmxlbmd0aC1lPHQuaGlnaFdhdGVyTWFyaykmJihyPSEwLEQoXCJsZW5ndGggbGVzcyB0aGFuIHdhdGVybWFya1wiLHIpKSwodC5lbmRlZHx8dC5yZWFkaW5nKSYmKHI9ITEsRChcInJlYWRpbmcgb3IgZW5kZWRcIixyKSksciYmKEQoXCJkbyByZWFkXCIpLHQucmVhZGluZz0hMCx0LnN5bmM9ITAsMD09PXQubGVuZ3RoJiYodC5uZWVkUmVhZGFibGU9ITApLHRoaXMuX3JlYWQodC5oaWdoV2F0ZXJNYXJrKSx0LnN5bmM9ITEpLHImJiF0LnJlYWRpbmcmJihlPWYobix0KSk7dmFyIGk7cmV0dXJuIGk9ZT4wP3coZSx0KTpudWxsLG51bGw9PT1pJiYodC5uZWVkUmVhZGFibGU9ITAsZT0wKSx0Lmxlbmd0aC09ZSwwIT09dC5sZW5ndGh8fHQuZW5kZWR8fCh0Lm5lZWRSZWFkYWJsZT0hMCksbiE9PWUmJnQuZW5kZWQmJjA9PT10Lmxlbmd0aCYmYih0aGlzKSxudWxsIT09aSYmdGhpcy5lbWl0KFwiZGF0YVwiLGkpLGl9LG8ucHJvdG90eXBlLl9yZWFkPWZ1bmN0aW9uKGUpe3RoaXMuZW1pdChcImVycm9yXCIsbmV3IEVycm9yKFwibm90IGltcGxlbWVudGVkXCIpKX0sby5wcm90b3R5cGUucGlwZT1mdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7RChcIm9udW5waXBlXCIpLGU9PT1oJiZzKCl9ZnVuY3Rpb24gbygpe0QoXCJvbmVuZFwiKSxlLmVuZCgpfWZ1bmN0aW9uIHMoKXtEKFwiY2xlYW51cFwiKSxlLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIixmKSxlLnJlbW92ZUxpc3RlbmVyKFwiZmluaXNoXCIsYyksZS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsXyksZS5yZW1vdmVMaXN0ZW5lcihcImVycm9yXCIsdSksZS5yZW1vdmVMaXN0ZW5lcihcInVucGlwZVwiLGkpLGgucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIixvKSxoLnJlbW92ZUxpc3RlbmVyKFwiZW5kXCIscyksaC5yZW1vdmVMaXN0ZW5lcihcImRhdGFcIixhKSx2PSEwLCFwLmF3YWl0RHJhaW58fGUuX3dyaXRhYmxlU3RhdGUmJiFlLl93cml0YWJsZVN0YXRlLm5lZWREcmFpbnx8XygpfWZ1bmN0aW9uIGEodCl7RChcIm9uZGF0YVwiKTt2YXIgbj1lLndyaXRlKHQpOyExPT09biYmKCgxPT09cC5waXBlc0NvdW50JiZwLnBpcGVzPT09ZXx8cC5waXBlc0NvdW50PjEmJlIocC5waXBlcyxlKSE9PS0xKSYmIXYmJihEKFwiZmFsc2Ugd3JpdGUgcmVzcG9uc2UsIHBhdXNlXCIsaC5fcmVhZGFibGVTdGF0ZS5hd2FpdERyYWluKSxoLl9yZWFkYWJsZVN0YXRlLmF3YWl0RHJhaW4rKyksaC5wYXVzZSgpKX1mdW5jdGlvbiB1KHQpe0QoXCJvbmVycm9yXCIsdCksbCgpLGUucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLHUpLDA9PT1OKGUsXCJlcnJvclwiKSYmZS5lbWl0KFwiZXJyb3JcIix0KX1mdW5jdGlvbiBmKCl7ZS5yZW1vdmVMaXN0ZW5lcihcImZpbmlzaFwiLGMpLGwoKX1mdW5jdGlvbiBjKCl7RChcIm9uZmluaXNoXCIpLGUucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLGYpLGwoKX1mdW5jdGlvbiBsKCl7RChcInVucGlwZVwiKSxoLnVucGlwZShlKX12YXIgaD10aGlzLHA9dGhpcy5fcmVhZGFibGVTdGF0ZTtzd2l0Y2gocC5waXBlc0NvdW50KXtjYXNlIDA6cC5waXBlcz1lO2JyZWFrO2Nhc2UgMTpwLnBpcGVzPVtwLnBpcGVzLGVdO2JyZWFrO2RlZmF1bHQ6cC5waXBlcy5wdXNoKGUpfXAucGlwZXNDb3VudCs9MSxEKFwicGlwZSBjb3VudD0lZCBvcHRzPSVqXCIscC5waXBlc0NvdW50LHQpO3ZhciBkPSghdHx8dC5lbmQhPT0hMSkmJmUhPT1uLnN0ZG91dCYmZSE9PW4uc3RkZXJyLGc9ZD9vOnM7cC5lbmRFbWl0dGVkP0EoZyk6aC5vbmNlKFwiZW5kXCIsZyksZS5vbihcInVucGlwZVwiLGkpO3ZhciBfPXkoaCk7ZS5vbihcImRyYWluXCIsXyk7dmFyIHY9ITE7cmV0dXJuIGgub24oXCJkYXRhXCIsYSkscihlLFwiZXJyb3JcIix1KSxlLm9uY2UoXCJjbG9zZVwiLGYpLGUub25jZShcImZpbmlzaFwiLGMpLGUuZW1pdChcInBpcGVcIixoKSxwLmZsb3dpbmd8fChEKFwicGlwZSByZXN1bWVcIiksaC5yZXN1bWUoKSksZX0sby5wcm90b3R5cGUudW5waXBlPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3JlYWRhYmxlU3RhdGU7aWYoMD09PXQucGlwZXNDb3VudClyZXR1cm4gdGhpcztpZigxPT09dC5waXBlc0NvdW50KXJldHVybiBlJiZlIT09dC5waXBlcz90aGlzOihlfHwoZT10LnBpcGVzKSx0LnBpcGVzPW51bGwsdC5waXBlc0NvdW50PTAsdC5mbG93aW5nPSExLGUmJmUuZW1pdChcInVucGlwZVwiLHRoaXMpLHRoaXMpO2lmKCFlKXt2YXIgbj10LnBpcGVzLHI9dC5waXBlc0NvdW50O3QucGlwZXM9bnVsbCx0LnBpcGVzQ291bnQ9MCx0LmZsb3dpbmc9ITE7Zm9yKHZhciBpPTA7aTxyO2krKyluW2ldLmVtaXQoXCJ1bnBpcGVcIix0aGlzKTtyZXR1cm4gdGhpc312YXIgbz1SKHQucGlwZXMsZSk7cmV0dXJuIG89PT0tMT90aGlzOih0LnBpcGVzLnNwbGljZShvLDEpLHQucGlwZXNDb3VudC09MSwxPT09dC5waXBlc0NvdW50JiYodC5waXBlcz10LnBpcGVzWzBdKSxlLmVtaXQoXCJ1bnBpcGVcIix0aGlzKSx0aGlzKX0sby5wcm90b3R5cGUub249ZnVuY3Rpb24oZSx0KXt2YXIgbj1JLnByb3RvdHlwZS5vbi5jYWxsKHRoaXMsZSx0KTtpZihcImRhdGFcIj09PWUmJiExIT09dGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nJiZ0aGlzLnJlc3VtZSgpLFwicmVhZGFibGVcIj09PWUmJiF0aGlzLl9yZWFkYWJsZVN0YXRlLmVuZEVtaXR0ZWQpe3ZhciByPXRoaXMuX3JlYWRhYmxlU3RhdGU7ci5yZWFkYWJsZUxpc3RlbmluZ3x8KHIucmVhZGFibGVMaXN0ZW5pbmc9ITAsci5lbWl0dGVkUmVhZGFibGU9ITEsci5uZWVkUmVhZGFibGU9ITAsci5yZWFkaW5nP3IubGVuZ3RoJiZoKHRoaXMscik6QShfLHRoaXMpKX1yZXR1cm4gbn0sby5wcm90b3R5cGUuYWRkTGlzdGVuZXI9by5wcm90b3R5cGUub24sby5wcm90b3R5cGUucmVzdW1lPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fcmVhZGFibGVTdGF0ZTtyZXR1cm4gZS5mbG93aW5nfHwoRChcInJlc3VtZVwiKSxlLmZsb3dpbmc9ITAsdih0aGlzLGUpKSx0aGlzfSxvLnByb3RvdHlwZS5wYXVzZT1mdW5jdGlvbigpe1xyXG5yZXR1cm4gRChcImNhbGwgcGF1c2UgZmxvd2luZz0lalwiLHRoaXMuX3JlYWRhYmxlU3RhdGUuZmxvd2luZyksITEhPT10aGlzLl9yZWFkYWJsZVN0YXRlLmZsb3dpbmcmJihEKFwicGF1c2VcIiksdGhpcy5fcmVhZGFibGVTdGF0ZS5mbG93aW5nPSExLHRoaXMuZW1pdChcInBhdXNlXCIpKSx0aGlzfSxvLnByb3RvdHlwZS53cmFwPWZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMuX3JlYWRhYmxlU3RhdGUsbj0hMSxyPXRoaXM7ZS5vbihcImVuZFwiLGZ1bmN0aW9uKCl7aWYoRChcIndyYXBwZWQgZW5kXCIpLHQuZGVjb2RlciYmIXQuZW5kZWQpe3ZhciBlPXQuZGVjb2Rlci5lbmQoKTtlJiZlLmxlbmd0aCYmci5wdXNoKGUpfXIucHVzaChudWxsKX0pLGUub24oXCJkYXRhXCIsZnVuY3Rpb24oaSl7aWYoRChcIndyYXBwZWQgZGF0YVwiKSx0LmRlY29kZXImJihpPXQuZGVjb2Rlci53cml0ZShpKSksKCF0Lm9iamVjdE1vZGV8fG51bGwhPT1pJiZ2b2lkIDAhPT1pKSYmKHQub2JqZWN0TW9kZXx8aSYmaS5sZW5ndGgpKXt2YXIgbz1yLnB1c2goaSk7b3x8KG49ITAsZS5wYXVzZSgpKX19KTtmb3IodmFyIGkgaW4gZSl2b2lkIDA9PT10aGlzW2ldJiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBlW2ldJiYodGhpc1tpXT1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZVt0XS5hcHBseShlLGFyZ3VtZW50cyl9fShpKSk7dmFyIG89W1wiZXJyb3JcIixcImNsb3NlXCIsXCJkZXN0cm95XCIsXCJwYXVzZVwiLFwicmVzdW1lXCJdO3JldHVybiBPKG8sZnVuY3Rpb24odCl7ZS5vbih0LHIuZW1pdC5iaW5kKHIsdCkpfSksci5fcmVhZD1mdW5jdGlvbih0KXtEKFwid3JhcHBlZCBfcmVhZFwiLHQpLG4mJihuPSExLGUucmVzdW1lKCkpfSxyfSxvLl9mcm9tTGlzdD13fSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtcIi4vX3N0cmVhbV9kdXBsZXhcIjoyNyxfcHJvY2VzczoyNSxidWZmZXI6NyxcImJ1ZmZlci1zaGltc1wiOjYsXCJjb3JlLXV0aWwtaXNcIjoxMSxldmVudHM6MTIsaW5oZXJpdHM6MTksaXNhcnJheToyMSxcInByb2Nlc3MtbmV4dGljay1hcmdzXCI6MjQsXCJzdHJpbmdfZGVjb2Rlci9cIjo0MSx1dGlsOjN9XSwzMDpbZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7dGhpcy5hZnRlclRyYW5zZm9ybT1mdW5jdGlvbih0LG4pe3JldHVybiBpKGUsdCxuKX0sdGhpcy5uZWVkVHJhbnNmb3JtPSExLHRoaXMudHJhbnNmb3JtaW5nPSExLHRoaXMud3JpdGVjYj1udWxsLHRoaXMud3JpdGVjaHVuaz1udWxsLHRoaXMud3JpdGVlbmNvZGluZz1udWxsfWZ1bmN0aW9uIGkoZSx0LG4pe3ZhciByPWUuX3RyYW5zZm9ybVN0YXRlO3IudHJhbnNmb3JtaW5nPSExO3ZhciBpPXIud3JpdGVjYjtpZighaSlyZXR1cm4gZS5lbWl0KFwiZXJyb3JcIixuZXcgRXJyb3IoXCJubyB3cml0ZWNiIGluIFRyYW5zZm9ybSBjbGFzc1wiKSk7ci53cml0ZWNodW5rPW51bGwsci53cml0ZWNiPW51bGwsbnVsbCE9PW4mJnZvaWQgMCE9PW4mJmUucHVzaChuKSxpKHQpO3ZhciBvPWUuX3JlYWRhYmxlU3RhdGU7by5yZWFkaW5nPSExLChvLm5lZWRSZWFkYWJsZXx8by5sZW5ndGg8by5oaWdoV2F0ZXJNYXJrKSYmZS5fcmVhZChvLmhpZ2hXYXRlck1hcmspfWZ1bmN0aW9uIG8oZSl7aWYoISh0aGlzIGluc3RhbmNlb2YgbykpcmV0dXJuIG5ldyBvKGUpO2EuY2FsbCh0aGlzLGUpLHRoaXMuX3RyYW5zZm9ybVN0YXRlPW5ldyByKHRoaXMpO3ZhciB0PXRoaXM7dGhpcy5fcmVhZGFibGVTdGF0ZS5uZWVkUmVhZGFibGU9ITAsdGhpcy5fcmVhZGFibGVTdGF0ZS5zeW5jPSExLGUmJihcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLnRyYW5zZm9ybSYmKHRoaXMuX3RyYW5zZm9ybT1lLnRyYW5zZm9ybSksXCJmdW5jdGlvblwiPT10eXBlb2YgZS5mbHVzaCYmKHRoaXMuX2ZsdXNoPWUuZmx1c2gpKSx0aGlzLm9uY2UoXCJwcmVmaW5pc2hcIixmdW5jdGlvbigpe1wiZnVuY3Rpb25cIj09dHlwZW9mIHRoaXMuX2ZsdXNoP3RoaXMuX2ZsdXNoKGZ1bmN0aW9uKGUpe3ModCxlKX0pOnModCl9KX1mdW5jdGlvbiBzKGUsdCl7aWYodClyZXR1cm4gZS5lbWl0KFwiZXJyb3JcIix0KTt2YXIgbj1lLl93cml0YWJsZVN0YXRlLHI9ZS5fdHJhbnNmb3JtU3RhdGU7aWYobi5sZW5ndGgpdGhyb3cgbmV3IEVycm9yKFwiQ2FsbGluZyB0cmFuc2Zvcm0gZG9uZSB3aGVuIHdzLmxlbmd0aCAhPSAwXCIpO2lmKHIudHJhbnNmb3JtaW5nKXRocm93IG5ldyBFcnJvcihcIkNhbGxpbmcgdHJhbnNmb3JtIGRvbmUgd2hlbiBzdGlsbCB0cmFuc2Zvcm1pbmdcIik7cmV0dXJuIGUucHVzaChudWxsKX10LmV4cG9ydHM9bzt2YXIgYT1lKFwiLi9fc3RyZWFtX2R1cGxleFwiKSx1PWUoXCJjb3JlLXV0aWwtaXNcIik7dS5pbmhlcml0cz1lKFwiaW5oZXJpdHNcIiksdS5pbmhlcml0cyhvLGEpLG8ucHJvdG90eXBlLnB1c2g9ZnVuY3Rpb24oZSx0KXtyZXR1cm4gdGhpcy5fdHJhbnNmb3JtU3RhdGUubmVlZFRyYW5zZm9ybT0hMSxhLnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcyxlLHQpfSxvLnByb3RvdHlwZS5fdHJhbnNmb3JtPWZ1bmN0aW9uKGUsdCxuKXt0aHJvdyBuZXcgRXJyb3IoXCJOb3QgaW1wbGVtZW50ZWRcIil9LG8ucHJvdG90eXBlLl93cml0ZT1mdW5jdGlvbihlLHQsbil7dmFyIHI9dGhpcy5fdHJhbnNmb3JtU3RhdGU7aWYoci53cml0ZWNiPW4sci53cml0ZWNodW5rPWUsci53cml0ZWVuY29kaW5nPXQsIXIudHJhbnNmb3JtaW5nKXt2YXIgaT10aGlzLl9yZWFkYWJsZVN0YXRlOyhyLm5lZWRUcmFuc2Zvcm18fGkubmVlZFJlYWRhYmxlfHxpLmxlbmd0aDxpLmhpZ2hXYXRlck1hcmspJiZ0aGlzLl9yZWFkKGkuaGlnaFdhdGVyTWFyayl9fSxvLnByb3RvdHlwZS5fcmVhZD1mdW5jdGlvbihlKXt2YXIgdD10aGlzLl90cmFuc2Zvcm1TdGF0ZTtudWxsIT09dC53cml0ZWNodW5rJiZ0LndyaXRlY2ImJiF0LnRyYW5zZm9ybWluZz8odC50cmFuc2Zvcm1pbmc9ITAsdGhpcy5fdHJhbnNmb3JtKHQud3JpdGVjaHVuayx0LndyaXRlZW5jb2RpbmcsdC5hZnRlclRyYW5zZm9ybSkpOnQubmVlZFRyYW5zZm9ybT0hMH19LHtcIi4vX3N0cmVhbV9kdXBsZXhcIjoyNyxcImNvcmUtdXRpbC1pc1wiOjExLGluaGVyaXRzOjE5fV0sMzE6W2Z1bmN0aW9uKGUsdCxuKXsoZnVuY3Rpb24obil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcigpe31mdW5jdGlvbiBpKGUsdCxuKXt0aGlzLmNodW5rPWUsdGhpcy5lbmNvZGluZz10LHRoaXMuY2FsbGJhY2s9bix0aGlzLm5leHQ9bnVsbH1mdW5jdGlvbiBvKHQsbil7Tj1OfHxlKFwiLi9fc3RyZWFtX2R1cGxleFwiKSx0PXR8fHt9LHRoaXMub2JqZWN0TW9kZT0hIXQub2JqZWN0TW9kZSxuIGluc3RhbmNlb2YgTiYmKHRoaXMub2JqZWN0TW9kZT10aGlzLm9iamVjdE1vZGV8fCEhdC53cml0YWJsZU9iamVjdE1vZGUpO3ZhciByPXQuaGlnaFdhdGVyTWFyayxpPXRoaXMub2JqZWN0TW9kZT8xNjoxNjM4NDt0aGlzLmhpZ2hXYXRlck1hcms9cnx8MD09PXI/cjppLHRoaXMuaGlnaFdhdGVyTWFyaz1+fnRoaXMuaGlnaFdhdGVyTWFyayx0aGlzLm5lZWREcmFpbj0hMSx0aGlzLmVuZGluZz0hMSx0aGlzLmVuZGVkPSExLHRoaXMuZmluaXNoZWQ9ITE7dmFyIG89dC5kZWNvZGVTdHJpbmdzPT09ITE7dGhpcy5kZWNvZGVTdHJpbmdzPSFvLHRoaXMuZGVmYXVsdEVuY29kaW5nPXQuZGVmYXVsdEVuY29kaW5nfHxcInV0ZjhcIix0aGlzLmxlbmd0aD0wLHRoaXMud3JpdGluZz0hMSx0aGlzLmNvcmtlZD0wLHRoaXMuc3luYz0hMCx0aGlzLmJ1ZmZlclByb2Nlc3Npbmc9ITEsdGhpcy5vbndyaXRlPWZ1bmN0aW9uKGUpe2QobixlKX0sdGhpcy53cml0ZWNiPW51bGwsdGhpcy53cml0ZWxlbj0wLHRoaXMuYnVmZmVyZWRSZXF1ZXN0PW51bGwsdGhpcy5sYXN0QnVmZmVyZWRSZXF1ZXN0PW51bGwsdGhpcy5wZW5kaW5nY2I9MCx0aGlzLnByZWZpbmlzaGVkPSExLHRoaXMuZXJyb3JFbWl0dGVkPSExLHRoaXMuYnVmZmVyZWRSZXF1ZXN0Q291bnQ9MCx0aGlzLmNvcmtlZFJlcXVlc3RzRnJlZT1uZXcgYih0aGlzKX1mdW5jdGlvbiBzKHQpe3JldHVybiBOPU58fGUoXCIuL19zdHJlYW1fZHVwbGV4XCIpLHRoaXMgaW5zdGFuY2VvZiBzfHx0aGlzIGluc3RhbmNlb2YgTj8odGhpcy5fd3JpdGFibGVTdGF0ZT1uZXcgbyh0LHRoaXMpLHRoaXMud3JpdGFibGU9ITAsdCYmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQud3JpdGUmJih0aGlzLl93cml0ZT10LndyaXRlKSxcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LndyaXRldiYmKHRoaXMuX3dyaXRldj10LndyaXRldikpLHZvaWQgQS5jYWxsKHRoaXMpKTpuZXcgcyh0KX1mdW5jdGlvbiBhKGUsdCl7dmFyIG49bmV3IEVycm9yKFwid3JpdGUgYWZ0ZXIgZW5kXCIpO2UuZW1pdChcImVycm9yXCIsbiksUyh0LG4pfWZ1bmN0aW9uIHUoZSx0LG4scil7dmFyIGk9ITAsbz0hMTtyZXR1cm4gbnVsbD09PW4/bz1uZXcgVHlwZUVycm9yKFwiTWF5IG5vdCB3cml0ZSBudWxsIHZhbHVlcyB0byBzdHJlYW1cIik6SS5pc0J1ZmZlcihuKXx8XCJzdHJpbmdcIj09dHlwZW9mIG58fHZvaWQgMD09PW58fHQub2JqZWN0TW9kZXx8KG89bmV3IFR5cGVFcnJvcihcIkludmFsaWQgbm9uLXN0cmluZy9idWZmZXIgY2h1bmtcIikpLG8mJihlLmVtaXQoXCJlcnJvclwiLG8pLFMocixvKSxpPSExKSxpfWZ1bmN0aW9uIGYoZSx0LG4pe3JldHVybiBlLm9iamVjdE1vZGV8fGUuZGVjb2RlU3RyaW5ncz09PSExfHxcInN0cmluZ1wiIT10eXBlb2YgdHx8KHQ9TC5mcm9tKHQsbikpLHR9ZnVuY3Rpb24gYyhlLHQsbixyLG8pe249Zih0LG4sciksSS5pc0J1ZmZlcihuKSYmKHI9XCJidWZmZXJcIik7dmFyIHM9dC5vYmplY3RNb2RlPzE6bi5sZW5ndGg7dC5sZW5ndGgrPXM7dmFyIGE9dC5sZW5ndGg8dC5oaWdoV2F0ZXJNYXJrO2lmKGF8fCh0Lm5lZWREcmFpbj0hMCksdC53cml0aW5nfHx0LmNvcmtlZCl7dmFyIHU9dC5sYXN0QnVmZmVyZWRSZXF1ZXN0O3QubGFzdEJ1ZmZlcmVkUmVxdWVzdD1uZXcgaShuLHIsbyksdT91Lm5leHQ9dC5sYXN0QnVmZmVyZWRSZXF1ZXN0OnQuYnVmZmVyZWRSZXF1ZXN0PXQubGFzdEJ1ZmZlcmVkUmVxdWVzdCx0LmJ1ZmZlcmVkUmVxdWVzdENvdW50Kz0xfWVsc2UgbChlLHQsITEscyxuLHIsbyk7cmV0dXJuIGF9ZnVuY3Rpb24gbChlLHQsbixyLGksbyxzKXt0LndyaXRlbGVuPXIsdC53cml0ZWNiPXMsdC53cml0aW5nPSEwLHQuc3luYz0hMCxuP2UuX3dyaXRldihpLHQub253cml0ZSk6ZS5fd3JpdGUoaSxvLHQub253cml0ZSksdC5zeW5jPSExfWZ1bmN0aW9uIGgoZSx0LG4scixpKXstLXQucGVuZGluZ2NiLG4/UyhpLHIpOmkociksZS5fd3JpdGFibGVTdGF0ZS5lcnJvckVtaXR0ZWQ9ITAsZS5lbWl0KFwiZXJyb3JcIixyKX1mdW5jdGlvbiBwKGUpe2Uud3JpdGluZz0hMSxlLndyaXRlY2I9bnVsbCxlLmxlbmd0aC09ZS53cml0ZWxlbixlLndyaXRlbGVuPTB9ZnVuY3Rpb24gZChlLHQpe3ZhciBuPWUuX3dyaXRhYmxlU3RhdGUscj1uLnN5bmMsaT1uLndyaXRlY2I7aWYocChuKSx0KWgoZSxuLHIsdCxpKTtlbHNle3ZhciBvPXYobik7b3x8bi5jb3JrZWR8fG4uYnVmZmVyUHJvY2Vzc2luZ3x8IW4uYnVmZmVyZWRSZXF1ZXN0fHxfKGUsbikscj9PKGcsZSxuLG8saSk6ZyhlLG4sbyxpKX19ZnVuY3Rpb24gZyhlLHQsbixyKXtufHx5KGUsdCksdC5wZW5kaW5nY2ItLSxyKCksRShlLHQpfWZ1bmN0aW9uIHkoZSx0KXswPT09dC5sZW5ndGgmJnQubmVlZERyYWluJiYodC5uZWVkRHJhaW49ITEsZS5lbWl0KFwiZHJhaW5cIikpfWZ1bmN0aW9uIF8oZSx0KXt0LmJ1ZmZlclByb2Nlc3Npbmc9ITA7dmFyIG49dC5idWZmZXJlZFJlcXVlc3Q7aWYoZS5fd3JpdGV2JiZuJiZuLm5leHQpe3ZhciByPXQuYnVmZmVyZWRSZXF1ZXN0Q291bnQsaT1uZXcgQXJyYXkociksbz10LmNvcmtlZFJlcXVlc3RzRnJlZTtvLmVudHJ5PW47Zm9yKHZhciBzPTA7bjspaVtzXT1uLG49bi5uZXh0LHMrPTE7bChlLHQsITAsdC5sZW5ndGgsaSxcIlwiLG8uZmluaXNoKSx0LnBlbmRpbmdjYisrLHQubGFzdEJ1ZmZlcmVkUmVxdWVzdD1udWxsLG8ubmV4dD8odC5jb3JrZWRSZXF1ZXN0c0ZyZWU9by5uZXh0LG8ubmV4dD1udWxsKTp0LmNvcmtlZFJlcXVlc3RzRnJlZT1uZXcgYih0KX1lbHNle2Zvcig7bjspe3ZhciBhPW4uY2h1bmssdT1uLmVuY29kaW5nLGY9bi5jYWxsYmFjayxjPXQub2JqZWN0TW9kZT8xOmEubGVuZ3RoO2lmKGwoZSx0LCExLGMsYSx1LGYpLG49bi5uZXh0LHQud3JpdGluZylicmVha31udWxsPT09biYmKHQubGFzdEJ1ZmZlcmVkUmVxdWVzdD1udWxsKX10LmJ1ZmZlcmVkUmVxdWVzdENvdW50PTAsdC5idWZmZXJlZFJlcXVlc3Q9bix0LmJ1ZmZlclByb2Nlc3Npbmc9ITF9ZnVuY3Rpb24gdihlKXtyZXR1cm4gZS5lbmRpbmcmJjA9PT1lLmxlbmd0aCYmbnVsbD09PWUuYnVmZmVyZWRSZXF1ZXN0JiYhZS5maW5pc2hlZCYmIWUud3JpdGluZ31mdW5jdGlvbiBtKGUsdCl7dC5wcmVmaW5pc2hlZHx8KHQucHJlZmluaXNoZWQ9ITAsZS5lbWl0KFwicHJlZmluaXNoXCIpKX1mdW5jdGlvbiBFKGUsdCl7dmFyIG49dih0KTtyZXR1cm4gbiYmKDA9PT10LnBlbmRpbmdjYj8obShlLHQpLHQuZmluaXNoZWQ9ITAsZS5lbWl0KFwiZmluaXNoXCIpKTptKGUsdCkpLG59ZnVuY3Rpb24gdyhlLHQsbil7dC5lbmRpbmc9ITAsRShlLHQpLG4mJih0LmZpbmlzaGVkP1Mobik6ZS5vbmNlKFwiZmluaXNoXCIsbikpLHQuZW5kZWQ9ITAsZS53cml0YWJsZT0hMX1mdW5jdGlvbiBiKGUpe3ZhciB0PXRoaXM7dGhpcy5uZXh0PW51bGwsdGhpcy5lbnRyeT1udWxsLHRoaXMuZmluaXNoPWZ1bmN0aW9uKG4pe3ZhciByPXQuZW50cnk7Zm9yKHQuZW50cnk9bnVsbDtyOyl7dmFyIGk9ci5jYWxsYmFjaztlLnBlbmRpbmdjYi0tLGkobikscj1yLm5leHR9ZS5jb3JrZWRSZXF1ZXN0c0ZyZWU/ZS5jb3JrZWRSZXF1ZXN0c0ZyZWUubmV4dD10OmUuY29ya2VkUmVxdWVzdHNGcmVlPXR9fXQuZXhwb3J0cz1zO3ZhciBTPWUoXCJwcm9jZXNzLW5leHRpY2stYXJnc1wiKSxPPSFuLmJyb3dzZXImJltcInYwLjEwXCIsXCJ2MC45LlwiXS5pbmRleE9mKG4udmVyc2lvbi5zbGljZSgwLDUpKT4tMT9zZXRJbW1lZGlhdGU6UztzLldyaXRhYmxlU3RhdGU9bzt2YXIgUj1lKFwiY29yZS11dGlsLWlzXCIpO1IuaW5oZXJpdHM9ZShcImluaGVyaXRzXCIpO3ZhciBBLFQ9e2RlcHJlY2F0ZTplKFwidXRpbC1kZXByZWNhdGVcIil9OyFmdW5jdGlvbigpe3RyeXtBPWUoXCJzdHJlYW1cIil9Y2F0Y2godCl7fWZpbmFsbHl7QXx8KEE9ZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXIpfX0oKTt2YXIgST1lKFwiYnVmZmVyXCIpLkJ1ZmZlcixMPWUoXCJidWZmZXItc2hpbXNcIik7Ui5pbmhlcml0cyhzLEEpO3ZhciBOO28ucHJvdG90eXBlLmdldEJ1ZmZlcj1mdW5jdGlvbigpe2Zvcih2YXIgZT10aGlzLmJ1ZmZlcmVkUmVxdWVzdCx0PVtdO2U7KXQucHVzaChlKSxlPWUubmV4dDtyZXR1cm4gdH0sZnVuY3Rpb24oKXt0cnl7T2JqZWN0LmRlZmluZVByb3BlcnR5KG8ucHJvdG90eXBlLFwiYnVmZmVyXCIse2dldDpULmRlcHJlY2F0ZShmdW5jdGlvbigpe3JldHVybiB0aGlzLmdldEJ1ZmZlcigpfSxcIl93cml0YWJsZVN0YXRlLmJ1ZmZlciBpcyBkZXByZWNhdGVkLiBVc2UgX3dyaXRhYmxlU3RhdGUuZ2V0QnVmZmVyIGluc3RlYWQuXCIpfSl9Y2F0Y2goZSl7fX0oKTt2YXIgTjtzLnByb3RvdHlwZS5waXBlPWZ1bmN0aW9uKCl7dGhpcy5lbWl0KFwiZXJyb3JcIixuZXcgRXJyb3IoXCJDYW5ub3QgcGlwZSwgbm90IHJlYWRhYmxlXCIpKX0scy5wcm90b3R5cGUud3JpdGU9ZnVuY3Rpb24oZSx0LG4pe3ZhciBpPXRoaXMuX3dyaXRhYmxlU3RhdGUsbz0hMTtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0JiYobj10LHQ9bnVsbCksSS5pc0J1ZmZlcihlKT90PVwiYnVmZmVyXCI6dHx8KHQ9aS5kZWZhdWx0RW5jb2RpbmcpLFwiZnVuY3Rpb25cIiE9dHlwZW9mIG4mJihuPXIpLGkuZW5kZWQ/YSh0aGlzLG4pOnUodGhpcyxpLGUsbikmJihpLnBlbmRpbmdjYisrLG89Yyh0aGlzLGksZSx0LG4pKSxvfSxzLnByb3RvdHlwZS5jb3JrPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5fd3JpdGFibGVTdGF0ZTtlLmNvcmtlZCsrfSxzLnByb3RvdHlwZS51bmNvcms9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLl93cml0YWJsZVN0YXRlO2UuY29ya2VkJiYoZS5jb3JrZWQtLSxlLndyaXRpbmd8fGUuY29ya2VkfHxlLmZpbmlzaGVkfHxlLmJ1ZmZlclByb2Nlc3Npbmd8fCFlLmJ1ZmZlcmVkUmVxdWVzdHx8Xyh0aGlzLGUpKX0scy5wcm90b3R5cGUuc2V0RGVmYXVsdEVuY29kaW5nPWZ1bmN0aW9uKGUpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBlJiYoZT1lLnRvTG93ZXJDYXNlKCkpLCEoW1wiaGV4XCIsXCJ1dGY4XCIsXCJ1dGYtOFwiLFwiYXNjaWlcIixcImJpbmFyeVwiLFwiYmFzZTY0XCIsXCJ1Y3MyXCIsXCJ1Y3MtMlwiLFwidXRmMTZsZVwiLFwidXRmLTE2bGVcIixcInJhd1wiXS5pbmRleE9mKChlK1wiXCIpLnRvTG93ZXJDYXNlKCkpPi0xKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiVW5rbm93biBlbmNvZGluZzogXCIrZSk7cmV0dXJuIHRoaXMuX3dyaXRhYmxlU3RhdGUuZGVmYXVsdEVuY29kaW5nPWUsdGhpc30scy5wcm90b3R5cGUuX3dyaXRlPWZ1bmN0aW9uKGUsdCxuKXtuKG5ldyBFcnJvcihcIm5vdCBpbXBsZW1lbnRlZFwiKSl9LHMucHJvdG90eXBlLl93cml0ZXY9bnVsbCxzLnByb3RvdHlwZS5lbmQ9ZnVuY3Rpb24oZSx0LG4pe3ZhciByPXRoaXMuX3dyaXRhYmxlU3RhdGU7XCJmdW5jdGlvblwiPT10eXBlb2YgZT8obj1lLGU9bnVsbCx0PW51bGwpOlwiZnVuY3Rpb25cIj09dHlwZW9mIHQmJihuPXQsdD1udWxsKSxudWxsIT09ZSYmdm9pZCAwIT09ZSYmdGhpcy53cml0ZShlLHQpLHIuY29ya2VkJiYoci5jb3JrZWQ9MSx0aGlzLnVuY29yaygpKSxyLmVuZGluZ3x8ci5maW5pc2hlZHx8dyh0aGlzLHIsbil9fSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtcIi4vX3N0cmVhbV9kdXBsZXhcIjoyNyxfcHJvY2VzczoyNSxidWZmZXI6NyxcImJ1ZmZlci1zaGltc1wiOjYsXCJjb3JlLXV0aWwtaXNcIjoxMSxldmVudHM6MTIsaW5oZXJpdHM6MTksXCJwcm9jZXNzLW5leHRpY2stYXJnc1wiOjI0LFwidXRpbC1kZXByZWNhdGVcIjo0Mn1dLDMyOltmdW5jdGlvbihlLHQsbil7dC5leHBvcnRzPWUoXCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCIpfSx7XCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCI6Mjh9XSwzMzpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihyKXt2YXIgaT1mdW5jdGlvbigpe3RyeXtyZXR1cm4gZShcInN0cmVhbVwiKX1jYXRjaCh0KXt9fSgpO249dC5leHBvcnRzPWUoXCIuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzXCIpLG4uU3RyZWFtPWl8fG4sbi5SZWFkYWJsZT1uLG4uV3JpdGFibGU9ZShcIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanNcIiksbi5EdXBsZXg9ZShcIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzXCIpLG4uVHJhbnNmb3JtPWUoXCIuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qc1wiKSxuLlBhc3NUaHJvdWdoPWUoXCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCIpLCFyLmJyb3dzZXImJlwiZGlzYWJsZVwiPT09ci5lbnYuUkVBREFCTEVfU1RSRUFNJiZpJiYodC5leHBvcnRzPWkpfSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSl9LHtcIi4vbGliL19zdHJlYW1fZHVwbGV4LmpzXCI6MjcsXCIuL2xpYi9fc3RyZWFtX3Bhc3N0aHJvdWdoLmpzXCI6MjgsXCIuL2xpYi9fc3RyZWFtX3JlYWRhYmxlLmpzXCI6MjksXCIuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qc1wiOjMwLFwiLi9saWIvX3N0cmVhbV93cml0YWJsZS5qc1wiOjMxLF9wcm9jZXNzOjI1fV0sMzQ6W2Z1bmN0aW9uKGUsdCxuKXt0LmV4cG9ydHM9ZShcIi4vbGliL19zdHJlYW1fdHJhbnNmb3JtLmpzXCIpfSx7XCIuL2xpYi9fc3RyZWFtX3RyYW5zZm9ybS5qc1wiOjMwfV0sMzU6W2Z1bmN0aW9uKGUsdCxuKXt0LmV4cG9ydHM9ZShcIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanNcIil9LHtcIi4vbGliL19zdHJlYW1fd3JpdGFibGUuanNcIjozMX1dLDM2OltmdW5jdGlvbihlLHQsbil7KGZ1bmN0aW9uKGUpe2Z1bmN0aW9uIG4oKXtmdW5jdGlvbiB0KGMpe2MmJiFhJiYoYT1jKTtmb3IodmFyIGw9YXJndW1lbnRzLmxlbmd0aCxoPTE7aDxsO2grKyl2b2lkIDAhPT1hcmd1bWVudHNbaF0mJihzW2gtMV09KHNbaC0xXXx8W10pLmNvbmNhdChhcmd1bWVudHNbaF0pKTtpZihyLmxlbmd0aD51KXt2YXIgcD1yLnNsaWNlKHUpO2YrPShyLmxlbmd0aC11KSpvLHU9ci5sZW5ndGgsZS5uZXh0VGljayhmdW5jdGlvbigpe3AuZm9yRWFjaChmdW5jdGlvbihlKXtuLmZvckVhY2goZnVuY3Rpb24obil7bihlLHQpfSl9KX0pfTA9PT0tLWYmJmkuYXBwbHkobnVsbCxbYV0uY29uY2F0KHMpKX12YXIgbj1BcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLHI9bi5zaGlmdCgpfHxbXSxpPW4ucG9wKCk7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgaSl0aHJvdyBuZXcgRXJyb3IoXCJObyBjYWxsYmFjayBwcm92aWRlZCB0byBhc3luY01hcFwiKTtpZighcilyZXR1cm4gaShudWxsLFtdKTtBcnJheS5pc0FycmF5KHIpfHwocj1bcl0pO3ZhciBvPW4ubGVuZ3RoLHM9W10sYT1udWxsLHU9ci5sZW5ndGgsZj11Km87cmV0dXJuIGY/dm9pZCByLmZvckVhY2goZnVuY3Rpb24oZSl7bi5mb3JFYWNoKGZ1bmN0aW9uKG4pe24oZSx0KX0pfSk6aShudWxsLFtdKX10LmV4cG9ydHM9bn0pLmNhbGwodGhpcyxlKFwiX3Byb2Nlc3NcIikpfSx7X3Byb2Nlc3M6MjV9XSwzNzpbZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoKXt2YXIgZSx0PUFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyksbj1udWxsO3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiB0WzBdPyhuPXQuc2hpZnQoKSxlPXQuc2hpZnQoKSxcInN0cmluZ1wiPT10eXBlb2YgZSYmKGU9bltlXSkpOmU9dC5zaGlmdCgpLGZ1bmN0aW9uKHIpe2UuYXBwbHkobix0LmNvbmNhdChyKSl9fXQuZXhwb3J0cz1yfSx7fV0sMzg6W2Z1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKGUsdCl7dmFyIG49W107IWZ1bmN0aW9uIG8ocyxhKXtyZXR1cm4gcz49YT90KG51bGwsbik6KEFycmF5LmlzQXJyYXkoZVtzXSkmJihlW3NdPWkuYXBwbHkobnVsbCxlW3NdLm1hcChmdW5jdGlvbihlKXtyZXR1cm4gZT09PXIuZmlyc3Q/blswXTplPT09ci5sYXN0P25bbi5sZW5ndGgtMV06ZX0pKSksZVtzXT92b2lkIGVbc10oZnVuY3Rpb24oZSxyKXtyZXR1cm4gZT90KGUsbik6KHZvaWQgMCE9PXImJihuPW4uY29uY2F0KHIpKSx2b2lkIG8ocysxLGEpKX0pOm8ocysxLGEpKX0oMCxlLmxlbmd0aCl9dC5leHBvcnRzPXI7dmFyIGk9ZShcIi4vYmluZC1hY3Rvci5qc1wiKTtyLmZpcnN0PXt9LHIubGFzdD17fX0se1wiLi9iaW5kLWFjdG9yLmpzXCI6Mzd9XSwzOTpbZnVuY3Rpb24oZSx0LG4pe24uYXN5bmNNYXA9ZShcIi4vYXN5bmMtbWFwXCIpLG4uYmluZEFjdG9yPWUoXCIuL2JpbmQtYWN0b3JcIiksbi5jaGFpbj1lKFwiLi9jaGFpblwiKX0se1wiLi9hc3luYy1tYXBcIjozNixcIi4vYmluZC1hY3RvclwiOjM3LFwiLi9jaGFpblwiOjM4fV0sNDA6W2Z1bmN0aW9uKGUsdCxuKXtmdW5jdGlvbiByKCl7aS5jYWxsKHRoaXMpfXQuZXhwb3J0cz1yO3ZhciBpPWUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyLG89ZShcImluaGVyaXRzXCIpO28ocixpKSxyLlJlYWRhYmxlPWUoXCJyZWFkYWJsZS1zdHJlYW0vcmVhZGFibGUuanNcIiksci5Xcml0YWJsZT1lKFwicmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzXCIpLHIuRHVwbGV4PWUoXCJyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzXCIpLHIuVHJhbnNmb3JtPWUoXCJyZWFkYWJsZS1zdHJlYW0vdHJhbnNmb3JtLmpzXCIpLHIuUGFzc1Rocm91Z2g9ZShcInJlYWRhYmxlLXN0cmVhbS9wYXNzdGhyb3VnaC5qc1wiKSxyLlN0cmVhbT1yLHIucHJvdG90eXBlLnBpcGU9ZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKHQpe2Uud3JpdGFibGUmJiExPT09ZS53cml0ZSh0KSYmZi5wYXVzZSYmZi5wYXVzZSgpfWZ1bmN0aW9uIHIoKXtmLnJlYWRhYmxlJiZmLnJlc3VtZSYmZi5yZXN1bWUoKX1mdW5jdGlvbiBvKCl7Y3x8KGM9ITAsZS5lbmQoKSl9ZnVuY3Rpb24gcygpe2N8fChjPSEwLFwiZnVuY3Rpb25cIj09dHlwZW9mIGUuZGVzdHJveSYmZS5kZXN0cm95KCkpfWZ1bmN0aW9uIGEoZSl7aWYodSgpLDA9PT1pLmxpc3RlbmVyQ291bnQodGhpcyxcImVycm9yXCIpKXRocm93IGV9ZnVuY3Rpb24gdSgpe2YucmVtb3ZlTGlzdGVuZXIoXCJkYXRhXCIsbiksZS5yZW1vdmVMaXN0ZW5lcihcImRyYWluXCIsciksZi5yZW1vdmVMaXN0ZW5lcihcImVuZFwiLG8pLGYucmVtb3ZlTGlzdGVuZXIoXCJjbG9zZVwiLHMpLGYucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLGEpLGUucmVtb3ZlTGlzdGVuZXIoXCJlcnJvclwiLGEpLGYucmVtb3ZlTGlzdGVuZXIoXCJlbmRcIix1KSxmLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIix1KSxlLnJlbW92ZUxpc3RlbmVyKFwiY2xvc2VcIix1KX12YXIgZj10aGlzO2Yub24oXCJkYXRhXCIsbiksZS5vbihcImRyYWluXCIsciksZS5faXNTdGRpb3x8dCYmdC5lbmQ9PT0hMXx8KGYub24oXCJlbmRcIixvKSxmLm9uKFwiY2xvc2VcIixzKSk7dmFyIGM9ITE7cmV0dXJuIGYub24oXCJlcnJvclwiLGEpLGUub24oXCJlcnJvclwiLGEpLGYub24oXCJlbmRcIix1KSxmLm9uKFwiY2xvc2VcIix1KSxlLm9uKFwiY2xvc2VcIix1KSxlLmVtaXQoXCJwaXBlXCIsZiksZX19LHtldmVudHM6MTIsaW5oZXJpdHM6MTksXCJyZWFkYWJsZS1zdHJlYW0vZHVwbGV4LmpzXCI6MjYsXCJyZWFkYWJsZS1zdHJlYW0vcGFzc3Rocm91Z2guanNcIjozMixcInJlYWRhYmxlLXN0cmVhbS9yZWFkYWJsZS5qc1wiOjMzLFwicmVhZGFibGUtc3RyZWFtL3RyYW5zZm9ybS5qc1wiOjM0LFwicmVhZGFibGUtc3RyZWFtL3dyaXRhYmxlLmpzXCI6MzV9XSw0MTpbZnVuY3Rpb24oZSx0LG4pe2Z1bmN0aW9uIHIoZSl7aWYoZSYmIXUoZSkpdGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBlbmNvZGluZzogXCIrZSl9ZnVuY3Rpb24gaShlKXtyZXR1cm4gZS50b1N0cmluZyh0aGlzLmVuY29kaW5nKX1mdW5jdGlvbiBvKGUpe3RoaXMuY2hhclJlY2VpdmVkPWUubGVuZ3RoJTIsdGhpcy5jaGFyTGVuZ3RoPXRoaXMuY2hhclJlY2VpdmVkPzI6MH1mdW5jdGlvbiBzKGUpe3RoaXMuY2hhclJlY2VpdmVkPWUubGVuZ3RoJTMsdGhpcy5jaGFyTGVuZ3RoPXRoaXMuY2hhclJlY2VpdmVkPzM6MH12YXIgYT1lKFwiYnVmZmVyXCIpLkJ1ZmZlcix1PWEuaXNFbmNvZGluZ3x8ZnVuY3Rpb24oZSl7c3dpdGNoKGUmJmUudG9Mb3dlckNhc2UoKSl7Y2FzZVwiaGV4XCI6Y2FzZVwidXRmOFwiOmNhc2VcInV0Zi04XCI6Y2FzZVwiYXNjaWlcIjpjYXNlXCJiaW5hcnlcIjpjYXNlXCJiYXNlNjRcIjpjYXNlXCJ1Y3MyXCI6Y2FzZVwidWNzLTJcIjpjYXNlXCJ1dGYxNmxlXCI6Y2FzZVwidXRmLTE2bGVcIjpjYXNlXCJyYXdcIjpyZXR1cm4hMDtkZWZhdWx0OnJldHVybiExfX0sZj1uLlN0cmluZ0RlY29kZXI9ZnVuY3Rpb24oZSl7c3dpdGNoKHRoaXMuZW5jb2Rpbmc9KGV8fFwidXRmOFwiKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL1stX10vLFwiXCIpLHIoZSksdGhpcy5lbmNvZGluZyl7Y2FzZVwidXRmOFwiOnRoaXMuc3Vycm9nYXRlU2l6ZT0zO2JyZWFrO2Nhc2VcInVjczJcIjpjYXNlXCJ1dGYxNmxlXCI6dGhpcy5zdXJyb2dhdGVTaXplPTIsdGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcj1vO2JyZWFrO2Nhc2VcImJhc2U2NFwiOnRoaXMuc3Vycm9nYXRlU2l6ZT0zLHRoaXMuZGV0ZWN0SW5jb21wbGV0ZUNoYXI9czticmVhaztkZWZhdWx0OnJldHVybiB2b2lkKHRoaXMud3JpdGU9aSl9dGhpcy5jaGFyQnVmZmVyPW5ldyBhKDYpLHRoaXMuY2hhclJlY2VpdmVkPTAsdGhpcy5jaGFyTGVuZ3RoPTB9O2YucHJvdG90eXBlLndyaXRlPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1cIlwiO3RoaXMuY2hhckxlbmd0aDspe3ZhciBuPWUubGVuZ3RoPj10aGlzLmNoYXJMZW5ndGgtdGhpcy5jaGFyUmVjZWl2ZWQ/dGhpcy5jaGFyTGVuZ3RoLXRoaXMuY2hhclJlY2VpdmVkOmUubGVuZ3RoO2lmKGUuY29weSh0aGlzLmNoYXJCdWZmZXIsdGhpcy5jaGFyUmVjZWl2ZWQsMCxuKSx0aGlzLmNoYXJSZWNlaXZlZCs9bix0aGlzLmNoYXJSZWNlaXZlZDx0aGlzLmNoYXJMZW5ndGgpcmV0dXJuXCJcIjtlPWUuc2xpY2UobixlLmxlbmd0aCksdD10aGlzLmNoYXJCdWZmZXIuc2xpY2UoMCx0aGlzLmNoYXJMZW5ndGgpLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO3ZhciByPXQuY2hhckNvZGVBdCh0Lmxlbmd0aC0xKTtpZighKHI+PTU1Mjk2JiZyPD01NjMxOSkpe2lmKHRoaXMuY2hhclJlY2VpdmVkPXRoaXMuY2hhckxlbmd0aD0wLDA9PT1lLmxlbmd0aClyZXR1cm4gdDticmVha310aGlzLmNoYXJMZW5ndGgrPXRoaXMuc3Vycm9nYXRlU2l6ZSx0PVwiXCJ9dGhpcy5kZXRlY3RJbmNvbXBsZXRlQ2hhcihlKTt2YXIgaT1lLmxlbmd0aDt0aGlzLmNoYXJMZW5ndGgmJihlLmNvcHkodGhpcy5jaGFyQnVmZmVyLDAsZS5sZW5ndGgtdGhpcy5jaGFyUmVjZWl2ZWQsaSksaS09dGhpcy5jaGFyUmVjZWl2ZWQpLHQrPWUudG9TdHJpbmcodGhpcy5lbmNvZGluZywwLGkpO3ZhciBpPXQubGVuZ3RoLTEscj10LmNoYXJDb2RlQXQoaSk7aWYocj49NTUyOTYmJnI8PTU2MzE5KXt2YXIgbz10aGlzLnN1cnJvZ2F0ZVNpemU7cmV0dXJuIHRoaXMuY2hhckxlbmd0aCs9byx0aGlzLmNoYXJSZWNlaXZlZCs9byx0aGlzLmNoYXJCdWZmZXIuY29weSh0aGlzLmNoYXJCdWZmZXIsbywwLG8pLGUuY29weSh0aGlzLmNoYXJCdWZmZXIsMCwwLG8pLHQuc3Vic3RyaW5nKDAsaSl9cmV0dXJuIHR9LGYucHJvdG90eXBlLmRldGVjdEluY29tcGxldGVDaGFyPWZ1bmN0aW9uKGUpe2Zvcih2YXIgdD1lLmxlbmd0aD49Mz8zOmUubGVuZ3RoO3Q+MDt0LS0pe3ZhciBuPWVbZS5sZW5ndGgtdF07aWYoMT09dCYmbj4+NT09Nil7dGhpcy5jaGFyTGVuZ3RoPTI7YnJlYWt9aWYodDw9MiYmbj4+ND09MTQpe3RoaXMuY2hhckxlbmd0aD0zO2JyZWFrfWlmKHQ8PTMmJm4+PjM9PTMwKXt0aGlzLmNoYXJMZW5ndGg9NDticmVha319dGhpcy5jaGFyUmVjZWl2ZWQ9dH0sZi5wcm90b3R5cGUuZW5kPWZ1bmN0aW9uKGUpe3ZhciB0PVwiXCI7aWYoZSYmZS5sZW5ndGgmJih0PXRoaXMud3JpdGUoZSkpLHRoaXMuY2hhclJlY2VpdmVkKXt2YXIgbj10aGlzLmNoYXJSZWNlaXZlZCxyPXRoaXMuY2hhckJ1ZmZlcixpPXRoaXMuZW5jb2Rpbmc7dCs9ci5zbGljZSgwLG4pLnRvU3RyaW5nKGkpfXJldHVybiB0fX0se2J1ZmZlcjo3fV0sNDI6W2Z1bmN0aW9uKGUsdCxuKXsoZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbihlLHQpe2Z1bmN0aW9uIG4oKXtpZighaSl7aWYocihcInRocm93RGVwcmVjYXRpb25cIikpdGhyb3cgbmV3IEVycm9yKHQpO3IoXCJ0cmFjZURlcHJlY2F0aW9uXCIpP2NvbnNvbGUudHJhY2UodCk6Y29uc29sZS53YXJuKHQpLGk9ITB9cmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfWlmKHIoXCJub0RlcHJlY2F0aW9uXCIpKXJldHVybiBlO3ZhciBpPSExO3JldHVybiBufWZ1bmN0aW9uIHIodCl7dHJ5e2lmKCFlLmxvY2FsU3RvcmFnZSlyZXR1cm4hMX1jYXRjaChuKXtyZXR1cm4hMX12YXIgcj1lLmxvY2FsU3RvcmFnZVt0XTtyZXR1cm4gbnVsbCE9ciYmXCJ0cnVlXCI9PT1TdHJpbmcocikudG9Mb3dlckNhc2UoKX10LmV4cG9ydHM9bn0pLmNhbGwodGhpcyxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se31dLDQzOltmdW5jdGlvbihlLHQsbil7dC5leHBvcnRzPWZ1bmN0aW9uKGUpe3JldHVybiBlJiZcIm9iamVjdFwiPT10eXBlb2YgZSYmXCJmdW5jdGlvblwiPT10eXBlb2YgZS5jb3B5JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBlLmZpbGwmJlwiZnVuY3Rpb25cIj09dHlwZW9mIGUucmVhZFVJbnQ4fX0se31dLDQ0OltmdW5jdGlvbihlLHQsbil7KGZ1bmN0aW9uKHQscil7ZnVuY3Rpb24gaShlLHQpe3ZhciByPXtzZWVuOltdLHN0eWxpemU6c307cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg+PTMmJihyLmRlcHRoPWFyZ3VtZW50c1syXSksYXJndW1lbnRzLmxlbmd0aD49NCYmKHIuY29sb3JzPWFyZ3VtZW50c1szXSksZyh0KT9yLnNob3dIaWRkZW49dDp0JiZuLl9leHRlbmQocix0KSx3KHIuc2hvd0hpZGRlbikmJihyLnNob3dIaWRkZW49ITEpLHcoci5kZXB0aCkmJihyLmRlcHRoPTIpLHcoci5jb2xvcnMpJiYoci5jb2xvcnM9ITEpLHcoci5jdXN0b21JbnNwZWN0KSYmKHIuY3VzdG9tSW5zcGVjdD0hMCksci5jb2xvcnMmJihyLnN0eWxpemU9byksdShyLGUsci5kZXB0aCl9ZnVuY3Rpb24gbyhlLHQpe3ZhciBuPWkuc3R5bGVzW3RdO3JldHVybiBuP1wiXHUwMDFiW1wiK2kuY29sb3JzW25dWzBdK1wibVwiK2UrXCJcdTAwMWJbXCIraS5jb2xvcnNbbl1bMV0rXCJtXCI6ZX1mdW5jdGlvbiBzKGUsdCl7cmV0dXJuIGV9ZnVuY3Rpb24gYShlKXt2YXIgdD17fTtyZXR1cm4gZS5mb3JFYWNoKGZ1bmN0aW9uKGUsbil7dFtlXT0hMH0pLHR9ZnVuY3Rpb24gdShlLHQscil7aWYoZS5jdXN0b21JbnNwZWN0JiZ0JiZBKHQuaW5zcGVjdCkmJnQuaW5zcGVjdCE9PW4uaW5zcGVjdCYmKCF0LmNvbnN0cnVjdG9yfHx0LmNvbnN0cnVjdG9yLnByb3RvdHlwZSE9PXQpKXt2YXIgaT10Lmluc3BlY3QocixlKTtyZXR1cm4gbShpKXx8KGk9dShlLGkscikpLGl9dmFyIG89ZihlLHQpO2lmKG8pcmV0dXJuIG87dmFyIHM9T2JqZWN0LmtleXModCksZz1hKHMpO2lmKGUuc2hvd0hpZGRlbiYmKHM9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModCkpLFIodCkmJihzLmluZGV4T2YoXCJtZXNzYWdlXCIpPj0wfHxzLmluZGV4T2YoXCJkZXNjcmlwdGlvblwiKT49MCkpcmV0dXJuIGModCk7aWYoMD09PXMubGVuZ3RoKXtpZihBKHQpKXt2YXIgeT10Lm5hbWU/XCI6IFwiK3QubmFtZTpcIlwiO3JldHVybiBlLnN0eWxpemUoXCJbRnVuY3Rpb25cIit5K1wiXVwiLFwic3BlY2lhbFwiKX1pZihiKHQpKXJldHVybiBlLnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLFwicmVnZXhwXCIpO2lmKE8odCkpcmV0dXJuIGUuc3R5bGl6ZShEYXRlLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLFwiZGF0ZVwiKTtpZihSKHQpKXJldHVybiBjKHQpfXZhciBfPVwiXCIsdj0hMSxFPVtcIntcIixcIn1cIl07aWYoZCh0KSYmKHY9ITAsRT1bXCJbXCIsXCJdXCJdKSxBKHQpKXt2YXIgdz10Lm5hbWU/XCI6IFwiK3QubmFtZTpcIlwiO189XCIgW0Z1bmN0aW9uXCIrdytcIl1cIn1pZihiKHQpJiYoXz1cIiBcIitSZWdFeHAucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpLE8odCkmJihfPVwiIFwiK0RhdGUucHJvdG90eXBlLnRvVVRDU3RyaW5nLmNhbGwodCkpLFIodCkmJihfPVwiIFwiK2ModCkpLDA9PT1zLmxlbmd0aCYmKCF2fHwwPT10Lmxlbmd0aCkpcmV0dXJuIEVbMF0rXytFWzFdO2lmKHI8MClyZXR1cm4gYih0KT9lLnN0eWxpemUoUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpLFwicmVnZXhwXCIpOmUuc3R5bGl6ZShcIltPYmplY3RdXCIsXCJzcGVjaWFsXCIpO2Uuc2Vlbi5wdXNoKHQpO3ZhciBTO3JldHVybiBTPXY/bChlLHQscixnLHMpOnMubWFwKGZ1bmN0aW9uKG4pe3JldHVybiBoKGUsdCxyLGcsbix2KX0pLGUuc2Vlbi5wb3AoKSxwKFMsXyxFKX1mdW5jdGlvbiBmKGUsdCl7aWYodyh0KSlyZXR1cm4gZS5zdHlsaXplKFwidW5kZWZpbmVkXCIsXCJ1bmRlZmluZWRcIik7aWYobSh0KSl7dmFyIG49XCInXCIrSlNPTi5zdHJpbmdpZnkodCkucmVwbGFjZSgvXlwifFwiJC9nLFwiXCIpLnJlcGxhY2UoLycvZyxcIlxcXFwnXCIpLnJlcGxhY2UoL1xcXFxcIi9nLCdcIicpK1wiJ1wiO3JldHVybiBlLnN0eWxpemUobixcInN0cmluZ1wiKX1yZXR1cm4gdih0KT9lLnN0eWxpemUoXCJcIit0LFwibnVtYmVyXCIpOmcodCk/ZS5zdHlsaXplKFwiXCIrdCxcImJvb2xlYW5cIik6eSh0KT9lLnN0eWxpemUoXCJudWxsXCIsXCJudWxsXCIpOnZvaWQgMH1mdW5jdGlvbiBjKGUpe3JldHVyblwiW1wiK0Vycm9yLnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGUpK1wiXVwifWZ1bmN0aW9uIGwoZSx0LG4scixpKXtmb3IodmFyIG89W10scz0wLGE9dC5sZW5ndGg7czxhOysrcylQKHQsU3RyaW5nKHMpKT9vLnB1c2goaChlLHQsbixyLFN0cmluZyhzKSwhMCkpOm8ucHVzaChcIlwiKTtyZXR1cm4gaS5mb3JFYWNoKGZ1bmN0aW9uKGkpe2kubWF0Y2goL15cXGQrJC8pfHxvLnB1c2goaChlLHQsbixyLGksITApKX0pLG99ZnVuY3Rpb24gaChlLHQsbixyLGksbyl7dmFyIHMsYSxmO2lmKGY9T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LGkpfHx7dmFsdWU6dFtpXX0sZi5nZXQ/YT1mLnNldD9lLnN0eWxpemUoXCJbR2V0dGVyL1NldHRlcl1cIixcInNwZWNpYWxcIik6ZS5zdHlsaXplKFwiW0dldHRlcl1cIixcInNwZWNpYWxcIik6Zi5zZXQmJihhPWUuc3R5bGl6ZShcIltTZXR0ZXJdXCIsXCJzcGVjaWFsXCIpKSxQKHIsaSl8fChzPVwiW1wiK2krXCJdXCIpLGF8fChlLnNlZW4uaW5kZXhPZihmLnZhbHVlKTwwPyhhPXkobik/dShlLGYudmFsdWUsbnVsbCk6dShlLGYudmFsdWUsbi0xKSxhLmluZGV4T2YoXCJcXG5cIik+LTEmJihhPW8/YS5zcGxpdChcIlxcblwiKS5tYXAoZnVuY3Rpb24oZSl7cmV0dXJuXCIgIFwiK2V9KS5qb2luKFwiXFxuXCIpLnN1YnN0cigyKTpcIlxcblwiK2Euc3BsaXQoXCJcXG5cIikubWFwKGZ1bmN0aW9uKGUpe3JldHVyblwiICAgXCIrZX0pLmpvaW4oXCJcXG5cIikpKTphPWUuc3R5bGl6ZShcIltDaXJjdWxhcl1cIixcInNwZWNpYWxcIikpLHcocykpe2lmKG8mJmkubWF0Y2goL15cXGQrJC8pKXJldHVybiBhO3M9SlNPTi5zdHJpbmdpZnkoXCJcIitpKSxzLm1hdGNoKC9eXCIoW2EtekEtWl9dW2EtekEtWl8wLTldKilcIiQvKT8ocz1zLnN1YnN0cigxLHMubGVuZ3RoLTIpLHM9ZS5zdHlsaXplKHMsXCJuYW1lXCIpKToocz1zLnJlcGxhY2UoLycvZyxcIlxcXFwnXCIpLnJlcGxhY2UoL1xcXFxcIi9nLCdcIicpLnJlcGxhY2UoLyheXCJ8XCIkKS9nLFwiJ1wiKSxzPWUuc3R5bGl6ZShzLFwic3RyaW5nXCIpKX1yZXR1cm4gcytcIjogXCIrYX1mdW5jdGlvbiBwKGUsdCxuKXt2YXIgcj0wLGk9ZS5yZWR1Y2UoZnVuY3Rpb24oZSx0KXtyZXR1cm4gcisrLHQuaW5kZXhPZihcIlxcblwiKT49MCYmcisrLGUrdC5yZXBsYWNlKC9cXHUwMDFiXFxbXFxkXFxkP20vZyxcIlwiKS5sZW5ndGgrMX0sMCk7cmV0dXJuIGk+NjA/blswXSsoXCJcIj09PXQ/XCJcIjp0K1wiXFxuIFwiKStcIiBcIitlLmpvaW4oXCIsXFxuICBcIikrXCIgXCIrblsxXTpuWzBdK3QrXCIgXCIrZS5qb2luKFwiLCBcIikrXCIgXCIrblsxXX1mdW5jdGlvbiBkKGUpe3JldHVybiBBcnJheS5pc0FycmF5KGUpfWZ1bmN0aW9uIGcoZSl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIHkoZSl7cmV0dXJuIG51bGw9PT1lfWZ1bmN0aW9uIF8oZSl7cmV0dXJuIG51bGw9PWV9ZnVuY3Rpb24gdihlKXtyZXR1cm5cIm51bWJlclwiPT10eXBlb2YgZX1mdW5jdGlvbiBtKGUpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIEUoZSl7cmV0dXJuXCJzeW1ib2xcIj09dHlwZW9mIGV9ZnVuY3Rpb24gdyhlKXtyZXR1cm4gdm9pZCAwPT09ZX1mdW5jdGlvbiBiKGUpe3JldHVybiBTKGUpJiZcIltvYmplY3QgUmVnRXhwXVwiPT09SShlKX1mdW5jdGlvbiBTKGUpe3JldHVyblwib2JqZWN0XCI9PXR5cGVvZiBlJiZudWxsIT09ZX1mdW5jdGlvbiBPKGUpe3JldHVybiBTKGUpJiZcIltvYmplY3QgRGF0ZV1cIj09PUkoZSl9ZnVuY3Rpb24gUihlKXtyZXR1cm4gUyhlKSYmKFwiW29iamVjdCBFcnJvcl1cIj09PUkoZSl8fGUgaW5zdGFuY2VvZiBFcnJvcil9ZnVuY3Rpb24gQShlKXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIFQoZSl7cmV0dXJuIG51bGw9PT1lfHxcImJvb2xlYW5cIj09dHlwZW9mIGV8fFwibnVtYmVyXCI9PXR5cGVvZiBlfHxcInN0cmluZ1wiPT10eXBlb2YgZXx8XCJzeW1ib2xcIj09dHlwZW9mIGV8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiBlfWZ1bmN0aW9uIEkoZSl7cmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChlKX1mdW5jdGlvbiBMKGUpe3JldHVybiBlPDEwP1wiMFwiK2UudG9TdHJpbmcoMTApOmUudG9TdHJpbmcoMTApfWZ1bmN0aW9uIE4oKXt2YXIgZT1uZXcgRGF0ZSx0PVtMKGUuZ2V0SG91cnMoKSksTChlLmdldE1pbnV0ZXMoKSksTChlLmdldFNlY29uZHMoKSldLmpvaW4oXCI6XCIpO3JldHVybltlLmdldERhdGUoKSxEW2UuZ2V0TW9udGgoKV0sdF0uam9pbihcIiBcIil9ZnVuY3Rpb24gUChlLHQpe3JldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZSx0KX12YXIgQz0vJVtzZGolXS9nO24uZm9ybWF0PWZ1bmN0aW9uKGUpe2lmKCFtKGUpKXtmb3IodmFyIHQ9W10sbj0wO248YXJndW1lbnRzLmxlbmd0aDtuKyspdC5wdXNoKGkoYXJndW1lbnRzW25dKSk7cmV0dXJuIHQuam9pbihcIiBcIil9Zm9yKHZhciBuPTEscj1hcmd1bWVudHMsbz1yLmxlbmd0aCxzPVN0cmluZyhlKS5yZXBsYWNlKEMsZnVuY3Rpb24oZSl7aWYoXCIlJVwiPT09ZSlyZXR1cm5cIiVcIjtpZihuPj1vKXJldHVybiBlO3N3aXRjaChlKXtjYXNlXCIlc1wiOnJldHVybiBTdHJpbmcocltuKytdKTtjYXNlXCIlZFwiOnJldHVybiBOdW1iZXIocltuKytdKTtjYXNlXCIlalwiOnRyeXtyZXR1cm4gSlNPTi5zdHJpbmdpZnkocltuKytdKX1jYXRjaCh0KXtyZXR1cm5cIltDaXJjdWxhcl1cIn1kZWZhdWx0OnJldHVybiBlfX0pLGE9cltuXTtuPG87YT1yWysrbl0pcys9eShhKXx8IVMoYSk/XCIgXCIrYTpcIiBcIitpKGEpO3JldHVybiBzfSxuLmRlcHJlY2F0ZT1mdW5jdGlvbihlLGkpe2Z1bmN0aW9uIG8oKXtpZighcyl7aWYodC50aHJvd0RlcHJlY2F0aW9uKXRocm93IG5ldyBFcnJvcihpKTt0LnRyYWNlRGVwcmVjYXRpb24/Y29uc29sZS50cmFjZShpKTpjb25zb2xlLmVycm9yKGkpLHM9ITB9cmV0dXJuIGUuYXBwbHkodGhpcyxhcmd1bWVudHMpfWlmKHcoci5wcm9jZXNzKSlyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gbi5kZXByZWNhdGUoZSxpKS5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2lmKHQubm9EZXByZWNhdGlvbj09PSEwKXJldHVybiBlO3ZhciBzPSExO3JldHVybiBvfTt2YXIgTSx4PXt9O24uZGVidWdsb2c9ZnVuY3Rpb24oZSl7aWYodyhNKSYmKE09dC5lbnYuTk9ERV9ERUJVR3x8XCJcIiksZT1lLnRvVXBwZXJDYXNlKCksIXhbZV0paWYobmV3IFJlZ0V4cChcIlxcXFxiXCIrZStcIlxcXFxiXCIsXCJpXCIpLnRlc3QoTSkpe3ZhciByPXQucGlkO3hbZV09ZnVuY3Rpb24oKXt2YXIgdD1uLmZvcm1hdC5hcHBseShuLGFyZ3VtZW50cyk7Y29uc29sZS5lcnJvcihcIiVzICVkOiAlc1wiLGUscix0KX19ZWxzZSB4W2VdPWZ1bmN0aW9uKCl7fTtyZXR1cm4geFtlXX0sbi5pbnNwZWN0PWksaS5jb2xvcnM9e2JvbGQ6WzEsMjJdLGl0YWxpYzpbMywyM10sdW5kZXJsaW5lOls0LDI0XSxpbnZlcnNlOls3LDI3XSx3aGl0ZTpbMzcsMzldLGdyZXk6WzkwLDM5XSxibGFjazpbMzAsMzldLGJsdWU6WzM0LDM5XSxjeWFuOlszNiwzOV0sZ3JlZW46WzMyLDM5XSxtYWdlbnRhOlszNSwzOV0scmVkOlszMSwzOV0seWVsbG93OlszMywzOV19LGkuc3R5bGVzPXtzcGVjaWFsOlwiY3lhblwiLG51bWJlcjpcInllbGxvd1wiLFwiYm9vbGVhblwiOlwieWVsbG93XCIsdW5kZWZpbmVkOlwiZ3JleVwiLFwibnVsbFwiOlwiYm9sZFwiLHN0cmluZzpcImdyZWVuXCIsZGF0ZTpcIm1hZ2VudGFcIixyZWdleHA6XCJyZWRcIn0sbi5pc0FycmF5PWQsbi5pc0Jvb2xlYW49ZyxuLmlzTnVsbD15LG4uaXNOdWxsT3JVbmRlZmluZWQ9XyxuLmlzTnVtYmVyPXYsbi5pc1N0cmluZz1tLG4uaXNTeW1ib2w9RSxuLmlzVW5kZWZpbmVkPXcsbi5pc1JlZ0V4cD1iLG4uaXNPYmplY3Q9UyxuLmlzRGF0ZT1PLG4uaXNFcnJvcj1SLG4uaXNGdW5jdGlvbj1BLG4uaXNQcmltaXRpdmU9VCxuLmlzQnVmZmVyPWUoXCIuL3N1cHBvcnQvaXNCdWZmZXJcIik7dmFyIEQ9W1wiSmFuXCIsXCJGZWJcIixcIk1hclwiLFwiQXByXCIsXCJNYXlcIixcIkp1blwiLFwiSnVsXCIsXCJBdWdcIixcIlNlcFwiLFwiT2N0XCIsXCJOb3ZcIixcIkRlY1wiXTtuLmxvZz1mdW5jdGlvbigpe2NvbnNvbGUubG9nKFwiJXMgLSAlc1wiLE4oKSxuLmZvcm1hdC5hcHBseShuLGFyZ3VtZW50cykpfSxuLmluaGVyaXRzPWUoXCJpbmhlcml0c1wiKSxuLl9leHRlbmQ9ZnVuY3Rpb24oZSx0KXtpZighdHx8IVModCkpcmV0dXJuIGU7Zm9yKHZhciBuPU9iamVjdC5rZXlzKHQpLHI9bi5sZW5ndGg7ci0tOyllW25bcl1dPXRbbltyXV07cmV0dXJuIGV9fSkuY2FsbCh0aGlzLGUoXCJfcHJvY2Vzc1wiKSxcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOlwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3c/d2luZG93Ont9KX0se1wiLi9zdXBwb3J0L2lzQnVmZmVyXCI6NDMsX3Byb2Nlc3M6MjUsaW5oZXJpdHM6MTl9XSw0NTpbZnVuY3Rpb24oZSx0LG4peyhmdW5jdGlvbihuLHIpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGkoKXtmb3IodmFyIGU9bmV3IGEsdD0wO3Q8YXJndW1lbnRzLmxlbmd0aDsrK3QpZS5oYXNoKFwiXCIrYXJndW1lbnRzW3RdKTtyZXR1cm4gZS5yZXN1bHQoKX12YXIgbz1lKFwiZ3JhY2VmdWwtZnNcIikscz1lKFwic2xpZGVcIikuY2hhaW4sYT1lKFwiaW11cm11cmhhc2hcIiksdT0wLGY9ZnVuY3Rpb24oZSl7cmV0dXJuIGUrXCIuXCIraShyLG4ucGlkLCsrdSl9O3QuZXhwb3J0cz1mdW5jdGlvbihlLHQsbixyKXtuIGluc3RhbmNlb2YgRnVuY3Rpb24mJihyPW4sbj1udWxsKSxufHwobj17fSk7dmFyIGk9ZihlKTtzKFtbbyxvLndyaXRlRmlsZSxpLHQsbl0sbi5jaG93biYmW28sby5jaG93bixpLG4uY2hvd24udWlkLG4uY2hvd24uZ2lkXSxbbyxvLnJlbmFtZSxpLGVdXSxmdW5jdGlvbihlKXtlP28udW5saW5rKGksZnVuY3Rpb24oKXtyKGUpfSk6cigpfSl9LHQuZXhwb3J0cy5zeW5jPWZ1bmN0aW9uKGUsdCxuKXtufHwobj17fSk7dmFyIHI9ZihlKTt0cnl7by53cml0ZUZpbGVTeW5jKHIsdCxuKSxuLmNob3duJiZvLmNob3duU3luYyhyLG4uY2hvd24udWlkLG4uY2hvd24uZ2lkKSxvLnJlbmFtZVN5bmMocixlKX1jYXRjaChpKXt0cnl7by51bmxpbmtTeW5jKHIpfWNhdGNoKHMpe310aHJvdyBpfX19KS5jYWxsKHRoaXMsZShcIl9wcm9jZXNzXCIpLFwiL25vZGVfbW9kdWxlcy93cml0ZS1maWxlLWF0b21pYy9pbmRleC5qc1wiKX0se19wcm9jZXNzOjI1LFwiZ3JhY2VmdWwtZnNcIjoxNCxpbXVybXVyaGFzaDoxOCxzbGlkZTozOX1dLDQ2OltmdW5jdGlvbihlLHQsbil7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gcihlKXtyZXR1cm4gZSYmZS5fX2VzTW9kdWxlP2U6e1wiZGVmYXVsdFwiOmV9fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pO3ZhciBpPWUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIiksbz1yKGkpLHM9ZShcIi4vdW5pdmVyc2FsLWxvY2Fsc3RvcmFnZVwiKSxhPXIocyksdT17c2V0OmZ1bmN0aW9uKGUsdCxuKXthW1wiZGVmYXVsdFwiXS5zZXRJdGVtKGUsKDAsb1tcImRlZmF1bHRcIl0pKHt2ZXJzaW9uOnQsdmFsdWU6bn0pKX0sZ2V0OmZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gSlNPTi5wYXJzZShhW1wiZGVmYXVsdFwiXS5nZXRJdGVtKGUpKS52YWx1ZX1jYXRjaCh0KXt9fSxnZXRWZXJzaW9uOmZ1bmN0aW9uKGUpe3RyeXtyZXR1cm4gSlNPTi5wYXJzZShhW1wiZGVmYXVsdFwiXS5nZXRJdGVtKGUpKS52ZXJzaW9ufWNhdGNoKHQpe319LFwiZGVsZXRlXCI6ZnVuY3Rpb24oZSl7YVtcImRlZmF1bHRcIl0ucmVtb3ZlSXRlbShlKX19O25bXCJkZWZhdWx0XCJdPXUsdC5leHBvcnRzPW5bXCJkZWZhdWx0XCJdfSx7XCIuL3VuaXZlcnNhbC1sb2NhbHN0b3JhZ2VcIjo0OCxcImJhYmVsLXJ1bnRpbWUvY29yZS1qcy9qc29uL3N0cmluZ2lmeVwiOjF9XSw0NzpbZnVuY3Rpb24oZSx0LG4pe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIHIoZSl7cmV0dXJuIGUmJmUuX19lc01vZHVsZT9lOntcImRlZmF1bHRcIjplfX12YXIgaT1lKFwiYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5XCIpLG89cihpKTtcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSYmXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdy5zZXNzaW9uU3RvcmFnZXx8ZnVuY3Rpb24oKXt2YXIgZT1mdW5jdGlvbihlKXtmdW5jdGlvbiB0KGUsdCxuKXt2YXIgcixpO24/KHI9bmV3IERhdGUsci5zZXRUaW1lKHIuZ2V0VGltZSgpKzI0Km4qNjAqNjAqMWUzKSxpPVwiOyBleHBpcmVzPVwiK3IudG9HTVRTdHJpbmcoKSk6aT1cIlwiLGRvY3VtZW50LmNvb2tpZT1lK1wiPVwiK3QraStcIjsgcGF0aD0vXCJ9ZnVuY3Rpb24gbihlKXt2YXIgdCxuLHI9ZStcIj1cIixpPWRvY3VtZW50LmNvb2tpZS5zcGxpdChcIjtcIik7Zm9yKHQ9MDt0PGkubGVuZ3RoO3QrKyl7Zm9yKG49aVt0XTtcIiBcIj09bi5jaGFyQXQoMCk7KW49bi5zdWJzdHJpbmcoMSxuLmxlbmd0aCk7aWYoMD09bi5pbmRleE9mKHIpKXJldHVybiBuLnN1YnN0cmluZyhyLmxlbmd0aCxuLmxlbmd0aCl9cmV0dXJuIG51bGx9ZnVuY3Rpb24gcihuKXtuPSgwLG9bXCJkZWZhdWx0XCJdKShuKSxcInNlc3Npb25cIj09ZT93aW5kb3cubmFtZT1uOnQoXCJsb2NhbFN0b3JhZ2VcIixuLDM2NSl9ZnVuY3Rpb24gaSgpe1wic2Vzc2lvblwiPT1lP3dpbmRvdy5uYW1lPVwiXCI6dChcImxvY2FsU3RvcmFnZVwiLFwiXCIsMzY1KX1mdW5jdGlvbiBzKCl7dmFyIHQ9XCJzZXNzaW9uXCI9PWU/d2luZG93Lm5hbWU6bihcImxvY2FsU3RvcmFnZVwiKTtyZXR1cm4gdD9KU09OLnBhcnNlKHQpOnt9fXZhciBhPXMoKTtyZXR1cm57bGVuZ3RoOjAsY2xlYXI6ZnVuY3Rpb24oKXthPXt9LHRoaXMubGVuZ3RoPTAsaSgpfSxnZXRJdGVtOmZ1bmN0aW9uKGUpe3JldHVybiB2b2lkIDA9PT1hW2VdP251bGw6YVtlXX0sa2V5OmZ1bmN0aW9uKGUpe3ZhciB0PTA7Zm9yKHZhciBuIGluIGEpe2lmKHQ9PWUpcmV0dXJuIG47dCsrfXJldHVybiBudWxsfSxyZW1vdmVJdGVtOmZ1bmN0aW9uKGUpe2RlbGV0ZSBhW2VdLHRoaXMubGVuZ3RoLS0scihhKX0sc2V0SXRlbTpmdW5jdGlvbihlLHQpe2FbZV09dCtcIlwiLHRoaXMubGVuZ3RoKysscihhKX19fTtcInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93LmxvY2FsU3RvcmFnZSYmKHdpbmRvdy5sb2NhbFN0b3JhZ2U9bmV3IGUoXCJsb2NhbFwiKSksXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdy5zZXNzaW9uU3RvcmFnZSYmKHdpbmRvdy5zZXNzaW9uU3RvcmFnZT1uZXcgZShcInNlc3Npb25cIikpfSgpfSx7XCJiYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnlcIjoxfV0sNDg6W2Z1bmN0aW9uKGUsdCxuKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkobixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KTt2YXIgcj12b2lkIDA7aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdyl7dmFyIGk9ZShcIm5vZGUtbG9jYWxzdG9yYWdlXCIpLkxvY2FsU3RvcmFnZTtyPW5ldyBpKFwiLi91bHMtc2NyYXRjaFwiKX1lbHNlIHI9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdy5sb2NhbFN0b3JhZ2V8fFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3cuc2Vzc2lvblN0b3JhZ2U/ZShcIi4vcmVtLWxvY2Fsc3RvcmFnZVwiKTp3aW5kb3cubG9jYWxTdG9yYWdlO25bXCJkZWZhdWx0XCJdPXIsdC5leHBvcnRzPW5bXCJkZWZhdWx0XCJdfSx7XCIuL3JlbS1sb2NhbHN0b3JhZ2VcIjo0NyxcIm5vZGUtbG9jYWxzdG9yYWdlXCI6MjJ9XX0se30sWzQ2XSkoNDYpfSk7XHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVBlcnNpc3RlbmNlTWFuYWdlci5qcy5tYXBcclxuIiwiY2xhc3MgQ29tYmluaW5nQWxnb3JpdGhtIHtcclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENvbWJpbmluZ0FsZ29yaXRobTtcclxuIiwiY2xhc3MgT3BlcmF0b3JzIHtcclxuXHJcbiAgYW5kKHBhcmFtcykge1xyXG4gICAgcmV0dXJuIHBhcmFtc1swXSAmJiBwYXJhbXNbMV07XHJcbiAgfVxyXG5cclxuICBiZXR3ZWVuKHBhcmFtcykge1xyXG4gICAgbGV0IHN0YXJ0ID0gcGFyc2VJbnQocGFyYW1zWzBdWzBdKTtcclxuICAgIGxldCBlbmQgPSBwYXJzZUludChwYXJhbXNbMF1bMV0pO1xyXG4gICAgbGV0IG5vdyA9IHBhcmFtc1sxXTtcclxuXHJcbiAgICBpZiAoZW5kIDwgc3RhcnQpIHtcclxuICAgICAgbm93ID0gKG5vdyA8IHN0YXJ0KSA/IG5vdyArPSAyNDAwIDogbm93O1xyXG4gICAgICBlbmQgKz0gMjQwMDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKG5vdyA+IHN0YXJ0ICYmIG5vdyA8IGVuZCk7XHJcbiAgfVxyXG5cclxuICBlcXVhbHMocGFyYW1zKSB7XHJcbiAgICByZXR1cm4gcGFyYW1zWzBdID09ICcqJyB8fCBwYXJhbXNbMF0gPT0gcGFyYW1zWzFdO1xyXG4gIH1cclxuXHJcbiAgaW4ocGFyYW1zKSB7XHJcbiAgICByZXR1cm4gcGFyYW1zWzBdLmluZGV4T2YocGFyYW1zWzFdKSA+IC0xO1xyXG4gIH1cclxuXHJcbiAgbm90KHBhcmFtcykge1xyXG4gICAgcmV0dXJuICFwYXJhbXNbMF07XHJcbiAgfVxyXG5cclxuICBvcihwYXJhbXMpIHtcclxuICAgIHJldHVybiBwYXJhbXNbMF0gfHwgcGFyYW1zWzFdO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE9wZXJhdG9ycztcclxuIiwiaW1wb3J0IE9wZXJhdG9ycyBmcm9tICcuL09wZXJhdG9ycyc7XHJcbmltcG9ydCBSdW50aW1lQ29yZUN0eCBmcm9tICcuL2NvbnRleHQvUnVudGltZUNvcmVDdHgnO1xyXG4vKipcclxuKiBUaGUgUG9saWN5IERlY2lzaW9uIFBvaW50IChQRFApIGRlY2lkZXMgaWYgYSBtZXNzYWdlIGlzIHRvIGJlIGF1dGhvcmlzZWQgYnkgY2hlY2tpbmcgYSBzZXQgb2ZcclxuKiBwb2xpY2llcy4gVGhlIHJlc291cmNlIHRvIGJlIHZlcmlmaWVkIGlzIHNwZWNpZmllZCBpbiB0aGUgZmlyc3Qgd29yZCBvZiB0aGUgJ2NvbmRpdGlvbicgZmllbGQgb2ZcclxuKiBhIFBvbGljeSBvYmplY3QuIFRoZSBpbXBsZW1lbnRhdGlvbiB0aGF0IHZlcmlmaWVzIGlmIHRoZSBtZXNzYWdlIGlzIGNvbXBsaWFudCB3aXRoIGEgcG9saWN5IGlzXHJcbiogc3BlY2lmaWVkIGluIGEgaGFzaHRhYmxlIHRvIGFsbG93IGR5bmFtaWMgZGVmaW5pdGlvbiBvZiB0aGUgaW1wbGVtZW50YXRpb24sIHByb3ZpZGluZ1xyXG4qIGV4dGVuc2liaWxpdHkgdG8gdGhlIFBvbGljeSBFbmdpbmUgZnVuY3Rpb25hbGl0aWVzLlxyXG4qL1xyXG5jbGFzcyBQRFAge1xyXG5cclxuICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgdGhpcy5vcGVyYXRvcnMgPSBuZXcgT3BlcmF0b3JzKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgY29udGV4dCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9jb250ZXh0O1xyXG4gIH1cclxuXHJcbiAgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgIHJldHVybiB0aGlzLl9vcGVyYXRvcnM7XHJcbiAgfVxyXG5cclxuICBzZXQgY29udGV4dChjb250ZXh0KSB7XHJcbiAgICB0aGlzLl9jb250ZXh0ID0gY29udGV4dDtcclxuICB9XHJcblxyXG4gIHNldCBvcGVyYXRvcnMob3BlcmF0b3JzKSB7XHJcbiAgICB0aGlzLl9vcGVyYXRvcnMgPSBvcGVyYXRvcnM7XHJcbiAgfVxyXG5cclxuICBhcHBseVBvbGljaWVzKG1lc3NhZ2UsIHBvbGljaWVzKSB7XHJcbiAgICBsZXQgcmVzdWx0ID0gdGhpcy5ldmFsdWF0ZVNQUG9saWN5KG1lc3NhZ2UsIHBvbGljaWVzLnNlcnZpY2VQcm92aWRlclBvbGljeSk7XHJcblxyXG4gICAgaWYgKHRoaXMuY29udGV4dCBpbnN0YW5jZW9mIFJ1bnRpbWVDb3JlQ3R4ICYmIChyZXN1bHQgfHwgcmVzdWx0ID09PSAnTm90IEFwcGxpY2FibGUnKSkge1xyXG4gICAgICByZXN1bHQgPSB0aGlzLmV2YWx1YXRlVXNlclBvbGljeShtZXNzYWdlLCBwb2xpY2llcy51c2VyUG9saWN5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbiAgZXZhbHVhdGVTUFBvbGljeShtZXNzYWdlLCBwb2xpY3kpIHtcclxuICAgIGxldCByZXN1bHQ7XHJcblxyXG4gICAgaWYgKHBvbGljeSkge1xyXG4gICAgICByZXN1bHQgPSBwb2xpY3kuZXZhbHVhdGUodGhpcy5jb250ZXh0LCBtZXNzYWdlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlc3VsdCA9ICdOb3QgQXBwbGljYWJsZSc7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIGV2YWx1YXRlVXNlclBvbGljeShtZXNzYWdlLCB0aXRsZSkge1xyXG4gICAgbGV0IHJlc3VsdDtcclxuXHJcbiAgICBpZiAodGl0bGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBsZXQgcG9saWN5ID0gdGhpcy5jb250ZXh0LnVzZXJQb2xpY2llc1t0aXRsZV07XHJcbiAgICAgIFxyXG4gICAgICBpZiAocG9saWN5KSB7XHJcbiAgICAgICAgcmVzdWx0ID0gcG9saWN5LmV2YWx1YXRlKHRoaXMuY29udGV4dCwgbWVzc2FnZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gJ05vdCBBcHBsaWNhYmxlJztcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVzdWx0ID0gJ05vdCBBcHBsaWNhYmxlJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBEUDtcclxuIiwiY2xhc3MgUEVQIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICB9XHJcblxyXG4gIGVuZm9yY2VQb2xpY2llcyhtZXNzYWdlLCBwb2xpY2llcywgYXV0aERlY2lzaW9uKSB7XHJcbiAgICBsZXQgcG9saWN5O1xyXG5cclxuICAgIGlmIChwb2xpY2llcy51c2VyUG9saWN5KSB7XHJcbiAgICAgIHBvbGljeSA9IHRoaXMuY29udGV4dC51c2VyUG9saWNpZXNbcG9saWNpZXMudXNlclBvbGljeV07XHJcbiAgICAgIGlmIChwb2xpY3kpIHtcclxuICAgICAgICBwb2xpY3kuZW5mb3JjZUFjdGlvbnModGhpcy5jb250ZXh0LCBtZXNzYWdlLCBhdXRoRGVjaXNpb24pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBwb2xpY3kgPSB0aGlzLmNvbnRleHQuc2VydmljZVByb3ZpZGVyUG9saWN5O1xyXG4gICAgaWYgKHBvbGljeSkge1xyXG4gICAgICBwb2xpY3kuZW5mb3JjZUFjdGlvbnModGhpcy5jb250ZXh0LCBtZXNzYWdlLCBhdXRoRGVjaXNpb24pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLypzZW5kQXV0b21hdGljTWVzc2FnZSgpIHt9XHJcblxyXG4gIGZvcndhcmRUb0lEKCkge31cclxuXHJcbiAgZm9yd2FyZFRvSHlwZXJ0eSgpIHt9Ki9cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBFUDtcclxuIiwiaW1wb3J0IERlbnlPdmVycmlkZXMgZnJvbSAnLi9jb21iaW5pbmdBbGdvcml0aG1zL0RlbnlPdmVycmlkZXMnO1xyXG5pbXBvcnQgRmlyc3RBcHBsaWNhYmxlIGZyb20gJy4vY29tYmluaW5nQWxnb3JpdGhtcy9GaXJzdEFwcGxpY2FibGUnO1xyXG5cclxuY2xhc3MgUG9saWN5IHtcclxuXHJcbiAgY29uc3RydWN0b3Ioa2V5LCBydWxlcywgYWN0aW9ucywgY29tYmluaW5nQWxnb3JpdGhtKSB7XHJcbiAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xyXG4gICAgdGhpcy5rZXkgPSBrZXk7XHJcbiAgICB0aGlzLnJ1bGVzID0gcnVsZXM7XHJcbiAgICB0aGlzLmNvbWJpbmluZ0FsZ29yaXRobSA9IGNvbWJpbmluZ0FsZ29yaXRobTtcclxuICB9XHJcblxyXG4gIGdldCBjb21iaW5pbmdBbGdvcml0aG0oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fY29tYmluaW5nQWxnb3JpdGhtO1xyXG4gIH1cclxuXHJcbiAgc2V0IGNvbWJpbmluZ0FsZ29yaXRobShjb21iaW5pbmdBbGdvcml0aG0pIHtcclxuICAgIGlmIChjb21iaW5pbmdBbGdvcml0aG0gPT09ICdkZW55T3ZlcnJpZGVzJykge1xyXG4gICAgICB0aGlzLl9jb21iaW5pbmdBbGdvcml0aG0gPSBuZXcgRGVueU92ZXJyaWRlcygpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGNvbWJpbmluZ0FsZ29yaXRobSA9PT0gJ2ZpcnN0QXBwbGljYWJsZScpIHtcclxuICAgICAgICB0aGlzLl9jb21iaW5pbmdBbGdvcml0aG0gPSBuZXcgRmlyc3RBcHBsaWNhYmxlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gYWxnb3JpdGhtOiAnICsgY29tYmluaW5nQWxnb3JpdGhtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZW5mb3JjZUFjdGlvbnMoY29udGV4dCwgbWVzc2FnZSwgYXV0aERlY2lzaW9uKSB7XHJcbiAgICBmb3IgKGxldCBpIGluIHRoaXMuYWN0aW9ucykge1xyXG4gICAgICBjb250ZXh0W3RoaXMuYWN0aW9uc1tpXV0obWVzc2FnZSwgYXV0aERlY2lzaW9uKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGV2YWx1YXRlKGNvbnRleHQsIG1lc3NhZ2UpIHtcclxuICAgIGxldCByZXN1bHRzID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICAgIHJlc3VsdHMucHVzaCh0aGlzLnJ1bGVzW2ldLmV2YWx1YXRlKGNvbnRleHQsIG1lc3NhZ2UpKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmV0dXJuIHRoaXMuY29tYmluaW5nQWxnb3JpdGhtLmV2YWx1YXRlKHJlc3VsdHMpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFBvbGljeTtcclxuIiwiaW1wb3J0IHtnZXRVc2VyRW1haWxGcm9tVVJMLCBpc0RhdGFPYmplY3RVUkwsIHJlbW92ZVBhdGhGcm9tVVJMfSBmcm9tICcuLi91dGlscy91dGlscyc7XHJcbmltcG9ydCBPcGVyYXRvcnMgZnJvbSAnLi9PcGVyYXRvcnMnO1xyXG5cclxuY2xhc3MgUnVsZSB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGF1dGhvcmlzZSwgY29uZGl0aW9uLCBwcmlvcml0eSwgc2NvcGUsIHRhcmdldCkge1xyXG4gICAgdGhpcy5vcGVyYXRvcnMgPSBuZXcgT3BlcmF0b3JzKCk7XHJcbiAgICB0aGlzLmF1dGhvcmlzZSA9IGF1dGhvcmlzZTtcclxuICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xyXG4gICAgdGhpcy5wcmlvcml0eSA9IHByaW9yaXR5O1xyXG4gICAgdGhpcy5zY29wZSA9IHNjb3BlO1xyXG4gICAgdGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcbiAgfVxyXG5cclxuICBldmFsdWF0ZShjb250ZXh0LCBtZXNzYWdlKSB7XHJcbiAgICBsZXQgaHlwZXJ0eU5hbWU7XHJcbiAgICBzd2l0Y2ggKHRoaXMuc2NvcGUpIHtcclxuICAgICAgY2FzZSAnZ2xvYmFsJzpcclxuICAgICAgICBicmVhaztcclxuXHJcbiAgICAgIGNhc2UgJ2h5cGVydHknOlxyXG4gICAgICAgIGlmIChpc0RhdGFPYmplY3RVUkwobWVzc2FnZS5mcm9tKSkge1xyXG4gICAgICAgICAgbGV0IHJlcG9ydGVyID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0UmVwb3J0ZXJVUkxTeW5jaG9ub3VzKHJlbW92ZVBhdGhGcm9tVVJMKG1lc3NhZ2UuZnJvbSkpO1xyXG4gICAgICAgICAgaWYgKHJlcG9ydGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaHlwZXJ0eU5hbWUgPSBjb250ZXh0LnJ1bnRpbWVSZWdpc3RyeS5nZXRIeXBlcnR5TmFtZShyZXBvcnRlcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChtZXNzYWdlLmZyb20uc3BsaXQoJzovLycpWzBdID09PSAnaHlwZXJ0eScpIHtcclxuICAgICAgICAgICAgaHlwZXJ0eU5hbWUgPSBjb250ZXh0LnJ1bnRpbWVSZWdpc3RyeS5nZXRIeXBlcnR5TmFtZShyZW1vdmVQYXRoRnJvbVVSTChtZXNzYWdlLmZyb20pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGh5cGVydHlOYW1lID09PSB0aGlzLnRhcmdldCkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoaXNEYXRhT2JqZWN0VVJMKG1lc3NhZ2UudG8pKSB7XHJcbiAgICAgICAgICBsZXQgcmVwb3J0ZXIgPSBjb250ZXh0LnJ1bnRpbWVSZWdpc3RyeS5nZXRSZXBvcnRlclVSTFN5bmNob25vdXMocmVtb3ZlUGF0aEZyb21VUkwobWVzc2FnZS50bykpO1xyXG4gICAgICAgICAgaWYgKHJlcG9ydGVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgaHlwZXJ0eU5hbWUgPSBjb250ZXh0LnJ1bnRpbWVSZWdpc3RyeS5nZXRIeXBlcnR5TmFtZShyZXBvcnRlcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChtZXNzYWdlLnRvLnNwbGl0KCc6Ly8nKVswXSA9PT0gJ2h5cGVydHknKSB7XHJcbiAgICAgICAgICAgIGh5cGVydHlOYW1lID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0SHlwZXJ0eU5hbWUocmVtb3ZlUGF0aEZyb21VUkwobWVzc2FnZS50bykpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoaHlwZXJ0eU5hbWUgPT09IHRoaXMudGFyZ2V0KSB7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAnTm90IEFwcGxpY2FibGUnO1xyXG5cclxuICAgICAgY2FzZSAndXNlcic6XHJcbiAgICAgICAgbGV0IG93bmVyO1xyXG5cclxuICAgICAgICBpZiAoaXNEYXRhT2JqZWN0VVJMKG1lc3NhZ2UuZnJvbSkpIHtcclxuICAgICAgICAgIGxldCByZXBvcnRlciA9IGNvbnRleHQucnVudGltZVJlZ2lzdHJ5LmdldFJlcG9ydGVyVVJMU3luY2hvbm91cyhyZW1vdmVQYXRoRnJvbVVSTChtZXNzYWdlLmZyb20pKTtcclxuICAgICAgICAgIG93bmVyID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0SHlwZXJ0eU93bmVyKHJlcG9ydGVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKG1lc3NhZ2UuZnJvbS5zcGxpdCgnOi8vJylbMF0gPT09ICdoeXBlcnR5Jykge1xyXG4gICAgICAgICAgICBvd25lciA9IGNvbnRleHQucnVudGltZVJlZ2lzdHJ5LmdldEh5cGVydHlPd25lcihyZW1vdmVQYXRoRnJvbVVSTChtZXNzYWdlLmZyb20pKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG93bmVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIG93bmVyID0gZ2V0VXNlckVtYWlsRnJvbVVSTChvd25lcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvd25lciA9PT0gdGhpcy50YXJnZXQpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGlzRGF0YU9iamVjdFVSTChtZXNzYWdlLnRvKSkge1xyXG4gICAgICAgICAgbGV0IHJlcG9ydGVyID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0UmVwb3J0ZXJVUkxTeW5jaG9ub3VzKHJlbW92ZVBhdGhGcm9tVVJMKG1lc3NhZ2UudG8pKTtcclxuICAgICAgICAgIG93bmVyID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0SHlwZXJ0eU93bmVyKHJlcG9ydGVyKTtcclxuICAgICAgICAgIGlmIChvd25lciAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG93bmVyID0gZ2V0VXNlckVtYWlsRnJvbVVSTChvd25lcik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmIChtZXNzYWdlLnRvLnNwbGl0KCc6Ly8nKVswXSA9PT0gJ2h5cGVydHknKSB7XHJcbiAgICAgICAgICAgIG93bmVyID0gY29udGV4dC5ydW50aW1lUmVnaXN0cnkuZ2V0SHlwZXJ0eU93bmVyKHJlbW92ZVBhdGhGcm9tVVJMKG1lc3NhZ2UudG8pKTtcclxuICAgICAgICAgICAgaWYgKG93bmVyICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICBvd25lciA9IGdldFVzZXJFbWFpbEZyb21VUkwob3duZXIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChvd25lciA9PT0gdGhpcy50YXJnZXQpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICdOb3QgQXBwbGljYWJsZSc7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5jb25kaXRpb24uaXNBcHBsaWNhYmxlKGNvbnRleHQsIG1lc3NhZ2UsIHRoaXMuc2NvcGUsIHRoaXMudGFyZ2V0KSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5hdXRob3Jpc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ05vdCBBcHBsaWNhYmxlJztcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFJ1bGU7XHJcbiIsImltcG9ydCBDb21iaW5pbmdBbGdvcml0aG0gZnJvbSAnLi4vQ29tYmluaW5nQWxnb3JpdGhtJztcclxuXHJcbmNsYXNzIERlbnlPdmVycmlkZXMgZXh0ZW5kcyBDb21iaW5pbmdBbGdvcml0aG0ge1xyXG5cclxuICBldmFsdWF0ZShpbmRpdmlkdWFsUmVzdWx0cykge1xyXG4gICAgaWYgKGluZGl2aWR1YWxSZXN1bHRzLmluZGV4T2YoZmFsc2UpICE9PSAtMSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaW5kaXZpZHVhbFJlc3VsdHMuaW5kZXhPZih0cnVlKSAhPT0gLTEpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJ05vdCBBcHBsaWNhYmxlJztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IERlbnlPdmVycmlkZXM7XHJcbiIsImltcG9ydCBDb21iaW5pbmdBbGdvcml0aG0gZnJvbSAnLi4vQ29tYmluaW5nQWxnb3JpdGhtJztcclxuXHJcbmNsYXNzIEZpcnN0QXBwbGljYWJsZSBleHRlbmRzIENvbWJpbmluZ0FsZ29yaXRobSB7XHJcblxyXG4gIGV2YWx1YXRlKGluZGl2aWR1YWxSZXN1bHRzKSB7XHJcbiAgICBmb3IgKGxldCBpIGluIGluZGl2aWR1YWxSZXN1bHRzKSB7XHJcbiAgICAgIGlmIChpbmRpdmlkdWFsUmVzdWx0c1tpXSAhPT0gJ05vdCBBcHBsaWNhYmxlJykge1xyXG4gICAgICAgIHJldHVybiBpbmRpdmlkdWFsUmVzdWx0c1tpXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnTm90IEFwcGxpY2FibGUnO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmlyc3RBcHBsaWNhYmxlO1xyXG4iLCJpbXBvcnQgQ29uZGl0aW9uIGZyb20gJy4vQ29uZGl0aW9uJztcclxuaW1wb3J0IE9wZXJhdG9ycyBmcm9tICcuLi9PcGVyYXRvcnMnO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uQ29uZGl0aW9uIGZyb20gJy4vU3Vic2NyaXB0aW9uQ29uZGl0aW9uJztcclxuXHJcbmNsYXNzIEFkdmFuY2VkQ29uZGl0aW9uIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY29uZGl0aW9uKSB7XHJcbiAgICB0aGlzLm9wZXJhdG9ycyA9IG5ldyBPcGVyYXRvcnMoKTtcclxuICAgIHRoaXMuY29uZGl0aW9uID0gY29uZGl0aW9uO1xyXG4gIH1cclxuXHJcbiAgaXNBcHBsaWNhYmxlKGNvbnRleHQsIG1lc3NhZ2UsIHNjb3BlLCB0YXJnZXQsIG9wZXJhdG9yLCBsZWZ0LCByaWdodCkge1xyXG4gICAgaWYgKCFvcGVyYXRvcikge1xyXG4gICAgICBvcGVyYXRvciA9IHRoaXMuY29uZGl0aW9uWzBdO1xyXG4gICAgICBsZWZ0ID0gdGhpcy5jb25kaXRpb25bMV07XHJcbiAgICAgIHJpZ2h0ID0gdGhpcy5jb25kaXRpb25bMl07XHJcbiAgICB9XHJcblxyXG4gICAgd2hpbGUgKCEobGVmdCBpbnN0YW5jZW9mIENvbmRpdGlvbikgJiAhKGxlZnQgaW5zdGFuY2VvZiBTdWJzY3JpcHRpb25Db25kaXRpb24pICYgKHR5cGVvZiBsZWZ0ICE9PSAnYm9vbGVhbicpKSB7XHJcbiAgICAgIGxlZnQgPSB0aGlzLmlzQXBwbGljYWJsZShjb250ZXh0LCBtZXNzYWdlLCBzY29wZSwgdGFyZ2V0LCBsZWZ0WzBdLCBsZWZ0WzFdLCBsZWZ0WzJdKTtcclxuICAgIH1cclxuICAgIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHdoaWxlICghKHJpZ2h0IGluc3RhbmNlb2YgQ29uZGl0aW9uKSAmICEocmlnaHQgaW5zdGFuY2VvZiBTdWJzY3JpcHRpb25Db25kaXRpb24pICYgKHR5cGVvZiByaWdodCAhPT0gJ2Jvb2xlYW4nKSkge1xyXG4gICAgICAgIHJpZ2h0ID0gdGhpcy5pc0FwcGxpY2FibGUoY29udGV4dCwgbWVzc2FnZSwgc2NvcGUsIHRhcmdldCwgcmlnaHRbMF0sIHJpZ2h0WzFdLCByaWdodFsyXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVzdWx0TGVmdCA9ICh0eXBlb2YgbGVmdCA9PT0gJ2Jvb2xlYW4nKSA/IGxlZnQgOiBsZWZ0LmlzQXBwbGljYWJsZShjb250ZXh0LCBtZXNzYWdlLCBzY29wZSwgdGFyZ2V0KTtcclxuICAgIGxldCByZXN1bHRSaWdodDtcclxuICAgIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJlc3VsdFJpZ2h0ID0gKHR5cGVvZiByaWdodCA9PT0gJ2Jvb2xlYW4nKSA/IHJpZ2h0IDogcmlnaHQuaXNBcHBsaWNhYmxlKGNvbnRleHQsIG1lc3NhZ2UsIHNjb3BlLCB0YXJnZXQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMub3BlcmF0b3JzW29wZXJhdG9yXShbcmVzdWx0TGVmdCwgcmVzdWx0UmlnaHRdKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBZHZhbmNlZENvbmRpdGlvbjtcclxuIiwiaW1wb3J0IE9wZXJhdG9ycyBmcm9tICcuLi9PcGVyYXRvcnMnO1xyXG5cclxuY2xhc3MgQ29uZGl0aW9uIHtcclxuXHJcbiAgY29uc3RydWN0b3IoYXR0cmlidXRlLCBvcGVyYXRvciwgcGFyYW1zKSB7XHJcbiAgICB0aGlzLmF0dHJpYnV0ZSA9IGF0dHJpYnV0ZTtcclxuICAgIHRoaXMub3BlcmF0b3IgPSBvcGVyYXRvcjtcclxuICAgIHRoaXMucGFyYW1zID0gcGFyYW1zO1xyXG4gICAgdGhpcy5vcGVyYXRvcnMgPSBuZXcgT3BlcmF0b3JzKCk7XHJcbiAgfVxyXG5cclxuICBpc0FwcGxpY2FibGUoY29udGV4dCwgbWVzc2FnZSkge1xyXG4gICAgY29udGV4dFt0aGlzLmF0dHJpYnV0ZV0gPSB7IG1lc3NhZ2U6IG1lc3NhZ2UgfTtcclxuICAgIGxldCB2YWx1ZSA9IGNvbnRleHRbdGhpcy5hdHRyaWJ1dGVdO1xyXG4gICAgbGV0IHRlbXBQYXJhbTtcclxuICAgIGlmICh0aGlzLm9wZXJhdG9yID09PSAnaW4nKSB7XHJcbiAgICAgIGlmICh0aGlzLnBhcmFtcyA9PT0gJ3ByZWF1dGhvcmlzZWQnKSB7XHJcbiAgICAgICAgbGV0IGRhdGFPYmplY3RVUkwgPSBtZXNzYWdlLnRvLnNwbGl0KCcvJyk7XHJcbiAgICAgICAgZGF0YU9iamVjdFVSTC5wb3AoKTtcclxuICAgICAgICBkYXRhT2JqZWN0VVJMID0gZGF0YU9iamVjdFVSTFswXSArICcvLycgKyBkYXRhT2JqZWN0VVJMWzJdO1xyXG4gICAgICAgIHRlbXBQYXJhbSA9IGNvbnRleHQucnVudGltZVJlZ2lzdHJ5LmdldFByZUF1dGhTdWJzY3JpYmVycyhkYXRhT2JqZWN0VVJMKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0ZW1wUGFyYW0gPSBjb250ZXh0LnBvbGljeUVuZ2luZS5nZXRHcm91cCh0aGlzLnBhcmFtcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmICghdGVtcFBhcmFtKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXShbdGhpcy5wYXJhbXMsIHZhbHVlXSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5vcGVyYXRvcnNbdGhpcy5vcGVyYXRvcl0oW3RlbXBQYXJhbSwgdmFsdWVdKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBDb25kaXRpb247XHJcbiIsImltcG9ydCBDb25kaXRpb24gZnJvbSAnLi9Db25kaXRpb24nO1xyXG5cclxuY2xhc3MgU3Vic2NyaXB0aW9uQ29uZGl0aW9uIGV4dGVuZHMgQ29uZGl0aW9uIHtcclxuXHJcbiAgY29uc3RydWN0b3IoYXR0cmlidXRlLCBvcGVyYXRvciwgcGFyYW1zKSB7XHJcbiAgICBzdXBlcihhdHRyaWJ1dGUsIG9wZXJhdG9yLCBwYXJhbXMpO1xyXG4gIH1cclxuXHJcbiAgaXNBcHBsaWNhYmxlKGNvbnRleHQsIG1lc3NhZ2UsIHNjb3BlLCB0YXJnZXQpIHtcclxuICAgIGxldCBpc1N1YnNjcmlwdGlvbiA9IG1lc3NhZ2UudHlwZSA9PT0gJ3N1YnNjcmliZSc7XHJcbiAgICBsZXQgaXNGcm9tUmVtb3RlU00gPSBjb250ZXh0LmlzRnJvbVJlbW90ZVNNKG1lc3NhZ2UuZnJvbSk7XHJcbiAgICBpZiAoaXNTdWJzY3JpcHRpb24gJiBpc0Zyb21SZW1vdGVTTSkge1xyXG4gICAgICByZXR1cm4gc3VwZXIuaXNBcHBsaWNhYmxlKGNvbnRleHQsIG1lc3NhZ2UpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgU3Vic2NyaXB0aW9uQ29uZGl0aW9uO1xyXG4iLCJpbXBvcnQge2RpdmlkZUVtYWlsfSBmcm9tICcuLi8uLi91dGlscy91dGlscyc7XHJcblxyXG5jbGFzcyBDb21tb25DdHgge1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuZGVmYXVsdEJlaGF2aW9yID0gdHJ1ZTtcclxuICAgIHRoaXMuZ3JvdXBzID0ge307XHJcbiAgfVxyXG5cclxuICBnZXQgZGVmYXVsdEJlaGF2aW9yKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2RlZmF1bHRCZWhhdmlvcjtcclxuICB9XHJcblxyXG4gIHNldCBkZWZhdWx0QmVoYXZpb3IoYmVoYXZpb3IpIHtcclxuICAgIHRoaXMuX2RlZmF1bHRCZWhhdmlvciA9IGJlaGF2aW9yO1xyXG4gIH1cclxuXHJcbiAgc2V0IGRhdGUobm93KSB7XHJcbiAgICBsZXQgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBsZXQgZGF5ID0gU3RyaW5nKGRhdGUuZ2V0RGF0ZSgpKTtcclxuICAgIGlmIChkYXkubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgIGRheSA9ICcwJyArIGRheTtcclxuICAgIH1cclxuICAgIGxldCBtb250aCA9IFN0cmluZyhkYXRlLmdldE1vbnRoKCkgKyAxKTtcclxuICAgIGlmIChtb250aC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgbW9udGggPSAnMCcgKyBtb250aDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9kYXRlID0gZGF5ICsgJy8nICsgbW9udGggKyAnLycgKyBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgfVxyXG5cclxuICBzZXQgZG9tYWluKHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcy5tZXNzYWdlLmJvZHkuaWRlbnRpdHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9kb21haW4gPSBkaXZpZGVFbWFpbChwYXJhbXMubWVzc2FnZS5ib2R5LmlkZW50aXR5LnVzZXJQcm9maWxlLnVzZXJuYW1lKS5kb21haW47XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXQgc291cmNlKHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcy5tZXNzYWdlLmJvZHkuaWRlbnRpdHkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLl9zb3VyY2UgPSBwYXJhbXMubWVzc2FnZS5ib2R5LmlkZW50aXR5LnVzZXJQcm9maWxlLnVzZXJuYW1lO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc2V0IHRpbWUobm93KSB7XHJcbiAgICBub3cgPSBuZXcgRGF0ZSgpO1xyXG4gICAgbGV0IG1pbnV0ZXMgPSBTdHJpbmcobm93LmdldE1pbnV0ZXMoKSk7XHJcbiAgICBpZiAobWludXRlcy5sZW5ndGggPT09IDEpIHtcclxuICAgICAgbWludXRlcyA9ICcwJyArIG1pbnV0ZXM7XHJcbiAgICB9XHJcbiAgICB0aGlzLl90aW1lID0gcGFyc2VJbnQoU3RyaW5nKG5vdy5nZXRIb3VycygpKSArIG1pbnV0ZXMpO1xyXG4gIH1cclxuXHJcbiAgc2V0IHdlZWtkYXkobm93KSB7XHJcbiAgICB0aGlzLl93ZWVrZGF5ID0gU3RyaW5nKG5ldyBEYXRlKCkuZ2V0RGF5KCkpO1xyXG4gIH1cclxuXHJcbiAgZ2V0IGRhdGUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZGF0ZTtcclxuICB9XHJcblxyXG4gIGdldCBkb21haW4oKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fZG9tYWluO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHNvdXJjZSgpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcbiAgICByZXR1cm4gX3RoaXMuX3NvdXJjZTtcclxuICB9XHJcblxyXG4gIGdldCB0aW1lKCkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpcztcclxuICAgIHJldHVybiBfdGhpcy5fdGltZTtcclxuICB9XHJcblxyXG4gIGdldCB3ZWVrZGF5KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3dlZWtkYXk7XHJcbiAgfVxyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgQ29tbW9uQ3R4O1xyXG4iLCJpbXBvcnQgQ29tbW9uQ3R4IGZyb20gJy4vQ29tbW9uQ3R4JztcclxuaW1wb3J0IENvbmRpdGlvbiBmcm9tICcuLi9jb25kaXRpb25zL0NvbmRpdGlvbic7XHJcbmltcG9ydCB7ZGl2aWRlVVJMLCBnZXRVc2VyRW1haWxGcm9tVVJMLCBpc0RhdGFPYmplY3RVUkx9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWxzJztcclxuaW1wb3J0IHBlcnNpc3RlbmNlTWFuYWdlciBmcm9tICdzZXJ2aWNlLWZyYW1ld29yay9kaXN0L1BlcnNpc3RlbmNlTWFuYWdlcic7XHJcbmltcG9ydCBSdWxlIGZyb20gJy4uL1J1bGUnO1xyXG5pbXBvcnQgVXNlclBvbGljeSBmcm9tICcuLi9wb2xpY2llcy9Vc2VyUG9saWN5JztcclxuaW1wb3J0IFN1YnNjcmlwdGlvbkNvbmRpdGlvbiBmcm9tICcuLi9jb25kaXRpb25zL1N1YnNjcmlwdGlvbkNvbmRpdGlvbic7XHJcblxyXG5jbGFzcyBSdW50aW1lQ29yZUN0eCBleHRlbmRzIENvbW1vbkN0eCB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGlkTW9kdWxlLCBydW50aW1lUmVnaXN0cnkpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmlkTW9kdWxlID0gaWRNb2R1bGU7XHJcbiAgICB0aGlzLnJ1bnRpbWVSZWdpc3RyeSA9IHJ1bnRpbWVSZWdpc3RyeTtcclxuICAgIHRoaXMuYWN0aXZlVXNlclBvbGljeSA9IHVuZGVmaW5lZDtcclxuICAgIHRoaXMuc2VydmljZVByb3ZpZGVyUG9saWNpZXMgPSB7fTtcclxuICAgIHRoaXMudXNlclBvbGljaWVzID0ge307XHJcbiAgfVxyXG5cclxuICBnZXQgZGF0YU9iamVjdFNjaGVtZSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9kYXRhT2JqZWN0U2NoZW1lO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHN1YnNjcmlwdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLl9zdWJzY3JpcHRpb247XHJcbiAgfVxyXG5cclxuICBzZXQgZGF0YU9iamVjdFNjaGVtZShwYXJhbXMpIHtcclxuICAgIGxldCBmcm9tID0gcGFyYW1zLm1lc3NhZ2UuZnJvbTtcclxuICAgIGlmIChpc0RhdGFPYmplY3RVUkwoZnJvbSkpIHtcclxuICAgICAgdGhpcy5fZGF0YU9iamVjdFNjaGVtZSA9IGRpdmlkZVVSTChmcm9tKS50eXBlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fZGF0YU9iamVjdFNjaGVtZSA9IHVuZGVmaW5lZDtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHNldCBzdWJzY3JpcHRpb24ocGFyYW1zKSB7XHJcbiAgICB0aGlzLl9zdWJzY3JpcHRpb24gPSBwYXJhbXMubWVzc2FnZS5ib2R5LnN1YnNjcmliZXI7XHJcbiAgfVxyXG5cclxuICBhdXRob3Jpc2UobWVzc2FnZSkge1xyXG4gICAgbGV0IF90aGlzID0gdGhpcztcclxuXHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZygnLS0tIFBvbGljeSBFbmdpbmUgLS0tJyk7XHJcbiAgICAgIGNvbnNvbGUubG9nKG1lc3NhZ2UpO1xyXG4gICAgICBtZXNzYWdlLmJvZHkgPSBtZXNzYWdlLmJvZHkgfHwge307XHJcbiAgICAgIGxldCByZXN1bHQ7XHJcbiAgICAgIGxldCBpc1RvVmVyaWZ5ID0gX3RoaXMuX2lzVG9WZXJpZnkobWVzc2FnZSk7XHJcbiAgICAgIGxldCBpc0luY29taW5nTWVzc2FnZSA9IF90aGlzLl9pc0luY29taW5nTWVzc2FnZShtZXNzYWdlKTtcclxuICAgICAgbGV0IGlzVG9DeXBoZXIgPSBfdGhpcy5faXNUb0N5cGhlck1vZHVsZShtZXNzYWdlKTtcclxuICAgICAgaWYgKGlzVG9WZXJpZnkpIHtcclxuICAgICAgICBpZiAoaXNJbmNvbWluZ01lc3NhZ2UpIHtcclxuICAgICAgICAgIGlmIChpc1RvQ3lwaGVyKSB7XHJcbiAgICAgICAgICAgIF90aGlzLmRlY3J5cHQobWVzc2FnZSkudGhlbihtZXNzYWdlID0+IHtcclxuICAgICAgICAgICAgICBsZXQgcG9saWNpZXMgPSB7XHJcbiAgICAgICAgICAgICAgICBzZXJ2aWNlUHJvdmlkZXJQb2xpY3k6IF90aGlzLmdldFNlcnZpY2VQcm92aWRlclBvbGljeShtZXNzYWdlLCBpc0luY29taW5nTWVzc2FnZSksXHJcbiAgICAgICAgICAgICAgICB1c2VyUG9saWN5OiBfdGhpcy5hY3RpdmVVc2VyUG9saWN5XHJcbiAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICByZXN1bHQgPSBfdGhpcy5wb2xpY3lFbmdpbmUucGRwLmFwcGx5UG9saWNpZXMobWVzc2FnZSwgcG9saWNpZXMpO1xyXG4gICAgICAgICAgICAgIF90aGlzLnBvbGljeUVuZ2luZS5wZXAuZW5mb3JjZVBvbGljaWVzKG1lc3NhZ2UsIHBvbGljaWVzLCByZXN1bHQpO1xyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHQgPT09ICdOb3QgQXBwbGljYWJsZScpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IF90aGlzLmRlZmF1bHRCZWhhdmlvcjtcclxuICAgICAgICAgICAgICAgIG1lc3NhZ2UuYm9keS5hdXRoID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgIGxldCBpc1N1YnNjcmlwdGlvbiA9IG1lc3NhZ2UudHlwZSA9PT0gJ3N1YnNjcmliZSc7XHJcbiAgICAgICAgICAgICAgICBsZXQgaXNGcm9tUmVtb3RlU00gPSBfdGhpcy5pc0Zyb21SZW1vdGVTTShtZXNzYWdlLmZyb20pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzU3Vic2NyaXB0aW9uICYgaXNGcm9tUmVtb3RlU00pIHtcclxuICAgICAgICAgICAgICAgICAgX3RoaXMucmVnaXN0ZXJTdWJzY3JpYmVyKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICBfdGhpcy5kb011dHVhbEF1dGhlbnRpY2F0aW9uKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZS5ib2R5LmF1dGggPSAobWVzc2FnZS5ib2R5LmF1dGggPT09IHVuZGVmaW5lZCkgPyB0cnVlIDogbWVzc2FnZS5ib2R5LmF1dGg7XHJcbiAgICAgICAgICAgICAgICByZXNvbHZlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoJ01lc3NhZ2UgYmxvY2tlZCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7IHJlamVjdChlcnJvcik7IH0pO1xyXG5cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBwb2xpY2llcyA9IHtcclxuICAgICAgICAgICAgICBzZXJ2aWNlUHJvdmlkZXJQb2xpY3k6IF90aGlzLmdldFNlcnZpY2VQcm92aWRlclBvbGljeShtZXNzYWdlLCBpc0luY29taW5nTWVzc2FnZSksXHJcbiAgICAgICAgICAgICAgdXNlclBvbGljeTogX3RoaXMuYWN0aXZlVXNlclBvbGljeVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXN1bHQgPSBfdGhpcy5wb2xpY3lFbmdpbmUucGRwLmFwcGx5UG9saWNpZXMobWVzc2FnZSwgcG9saWNpZXMpO1xyXG4gICAgICAgICAgICBfdGhpcy5wb2xpY3lFbmdpbmUucGVwLmVuZm9yY2VQb2xpY2llcyhtZXNzYWdlLCBwb2xpY2llcywgcmVzdWx0KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ05vdCBBcHBsaWNhYmxlJykge1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IF90aGlzLmRlZmF1bHRCZWhhdmlvcjtcclxuICAgICAgICAgICAgICBtZXNzYWdlLmJvZHkuYXV0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBsZXQgaXNTdWJzY3JpcHRpb24gPSBtZXNzYWdlLnR5cGUgPT09ICdzdWJzY3JpYmUnO1xyXG4gICAgICAgICAgICAgIGxldCBpc0Zyb21SZW1vdGVTTSA9IF90aGlzLmlzRnJvbVJlbW90ZVNNKG1lc3NhZ2UuZnJvbSk7XHJcbiAgICAgICAgICAgICAgaWYgKGlzU3Vic2NyaXB0aW9uICYgaXNGcm9tUmVtb3RlU00pIHtcclxuICAgICAgICAgICAgICAgIF90aGlzLnJlZ2lzdGVyU3Vic2NyaWJlcihtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIF90aGlzLmRvTXV0dWFsQXV0aGVudGljYXRpb24obWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIG1lc3NhZ2UuYm9keS5hdXRoID0gKG1lc3NhZ2UuYm9keS5hdXRoID09PSB1bmRlZmluZWQpID8gdHJ1ZSA6IG1lc3NhZ2UuYm9keS5hdXRoO1xyXG4gICAgICAgICAgICAgIHJlc29sdmUobWVzc2FnZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KCdNZXNzYWdlIGJsb2NrZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBsZXQgaXNUb1NldElEID0gX3RoaXMuX2lzVG9TZXRJRChtZXNzYWdlKTtcclxuICAgICAgICAgIGlmIChpc1RvU2V0SUQpIHtcclxuICAgICAgICAgICAgX3RoaXMuX2dldElkZW50aXR5KG1lc3NhZ2UpLnRoZW4oaWRlbnRpdHkgPT4ge1xyXG4gICAgICAgICAgICAgIG1lc3NhZ2UuYm9keS5pZGVudGl0eSA9IGlkZW50aXR5O1xyXG4gICAgICAgICAgICAgIGxldCBwb2xpY2llcyA9IHtcclxuICAgICAgICAgICAgICAgIHNlcnZpY2VQcm92aWRlclBvbGljeTogX3RoaXMuZ2V0U2VydmljZVByb3ZpZGVyUG9saWN5KG1lc3NhZ2UsIGlzSW5jb21pbmdNZXNzYWdlKSxcclxuICAgICAgICAgICAgICAgIHVzZXJQb2xpY3k6IF90aGlzLmFjdGl2ZVVzZXJQb2xpY3lcclxuICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IF90aGlzLnBvbGljeUVuZ2luZS5wZHAuYXBwbHlQb2xpY2llcyhtZXNzYWdlLCBwb2xpY2llcyk7XHJcbiAgICAgICAgICAgICAgX3RoaXMucG9saWN5RW5naW5lLnBlcC5lbmZvcmNlUG9saWNpZXMobWVzc2FnZSwgcG9saWNpZXMsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ05vdCBBcHBsaWNhYmxlJykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gX3RoaXMuZGVmYXVsdEJlaGF2aW9yO1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZS5ib2R5LmF1dGggPSBmYWxzZTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZS5ib2R5LmF1dGggPSAobWVzc2FnZS5ib2R5LmF1dGggPT09IHVuZGVmaW5lZCkgPyB0cnVlIDogbWVzc2FnZS5ib2R5LmF1dGg7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUb0N5cGhlcikge1xyXG4gICAgICAgICAgICAgICAgICBfdGhpcy5lbmNyeXB0KG1lc3NhZ2UpLnRoZW4obWVzc2FnZSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgfSwgKGVycm9yKSA9PiB7IHJlamVjdChlcnJvcik7IH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZShtZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KCdNZXNzYWdlIGJsb2NrZWQnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIChlcnJvcikgPT4geyByZWplY3QoZXJyb3IpOyB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGxldCBwb2xpY2llcyA9IHtcclxuICAgICAgICAgICAgICBzZXJ2aWNlUHJvdmlkZXJQb2xpY3k6IF90aGlzLmdldFNlcnZpY2VQcm92aWRlclBvbGljeShtZXNzYWdlLCBpc0luY29taW5nTWVzc2FnZSksXHJcbiAgICAgICAgICAgICAgdXNlclBvbGljeTogX3RoaXMuYWN0aXZlVXNlclBvbGljeVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXN1bHQgPSBfdGhpcy5wb2xpY3lFbmdpbmUucGRwLmFwcGx5UG9saWNpZXMobWVzc2FnZSwgcG9saWNpZXMpO1xyXG4gICAgICAgICAgICBfdGhpcy5wb2xpY3lFbmdpbmUucGVwLmVuZm9yY2VQb2xpY2llcyhtZXNzYWdlLCBwb2xpY2llcywgcmVzdWx0KTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PT0gJ05vdCBBcHBsaWNhYmxlJykge1xyXG4gICAgICAgICAgICAgIHJlc3VsdCA9IF90aGlzLmRlZmF1bHRCZWhhdmlvcjtcclxuICAgICAgICAgICAgICBtZXNzYWdlLmJvZHkuYXV0aCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgICAgICAgICBtZXNzYWdlLmJvZHkuYXV0aCA9IChtZXNzYWdlLmJvZHkuYXV0aCA9PT0gdW5kZWZpbmVkKSA/IHRydWUgOiBtZXNzYWdlLmJvZHkuYXV0aDtcclxuICAgICAgICAgICAgICByZXNvbHZlKG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlamVjdCgnTWVzc2FnZSBibG9ja2VkJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmVzdWx0ID0gX3RoaXMuZGVmYXVsdEJlaGF2aW9yO1xyXG4gICAgICAgIG1lc3NhZ2UuYm9keS5hdXRoID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAgICAgcmVzb2x2ZShtZXNzYWdlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgcmVqZWN0KCdNZXNzYWdlIGJsb2NrZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgZGVjcnlwdChtZXNzYWdlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLHJlamVjdCkge1xyXG4gICAgICBfdGhpcy5pZE1vZHVsZS5kZWNyeXB0TWVzc2FnZShtZXNzYWdlKS50aGVuKGZ1bmN0aW9uKG1zZykge1xyXG4gICAgICAgIHJlc29sdmUobXNnKTtcclxuICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRvTXV0dWFsQXV0aGVudGljYXRpb24obWVzc2FnZSkge1xyXG4gICAgbGV0IHRvID0gbWVzc2FnZS50by5zcGxpdCgnLycpO1xyXG4gICAgbGV0IHN1YnNJbmRleCA9IHRvLmluZGV4T2YoJ3N1YnNjcmlwdGlvbicpO1xyXG4gICAgbGV0IGlzRGF0YU9iamVjdFN1YnNjcmlwdGlvbiA9IHN1YnNJbmRleCAhPT0gLTE7XHJcbiAgICBsZXQgaXNGcm9tUmVtb3RlU00gPSB0aGlzLmlzRnJvbVJlbW90ZVNNKG1lc3NhZ2UuZnJvbSk7XHJcbiAgICBpZiAoaXNEYXRhT2JqZWN0U3Vic2NyaXB0aW9uICYgaXNGcm9tUmVtb3RlU00pIHtcclxuICAgICAgdG8ucG9wKCk7XHJcbiAgICAgIGxldCBkYXRhT2JqZWN0VVJMID0gdG9bMF0gKyAnLy8nICsgdG9bMl0gKyAnLycgKyB0b1szXTtcclxuICAgICAgaWYgKHRvLmxlbmd0aCA+IDQpIHtcclxuICAgICAgICBkYXRhT2JqZWN0VVJMID0gdG9bMF0gKyAnLy8nICsgdG9bMl0gKyAnLycgKyB0b1szXSArICcvJyArIHRvWzRdO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaWRNb2R1bGUuZG9NdXR1YWxBdXRoZW50aWNhdGlvbihkYXRhT2JqZWN0VVJMLCBtZXNzYWdlLmJvZHkuc3Vic2NyaWJlcik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBlbmNyeXB0KG1lc3NhZ2UpIHtcclxuICAgIGxldCBfdGhpcyA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XHJcbiAgICAgIF90aGlzLmlkTW9kdWxlLmVuY3J5cHRNZXNzYWdlKG1lc3NhZ2UpLnRoZW4oKG1zZykgPT4ge1xyXG4gICAgICAgIHJlc29sdmUobXNnKTtcclxuICAgICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgICAgcmVqZWN0KGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGdldE15RW1haWxzKCkge1xyXG4gICAgbGV0IGlkZW50aXRpZXMgPSB0aGlzLmlkTW9kdWxlLmdldElkZW50aXRpZXMoKTtcclxuICAgIGxldCBlbWFpbHMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpIGluIGlkZW50aXRpZXMpIHtcclxuICAgICAgZW1haWxzLnB1c2goZ2V0VXNlckVtYWlsRnJvbVVSTChpZGVudGl0aWVzW2ldLmlkZW50aXR5KSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGVtYWlscztcclxuICB9XHJcblxyXG4gIGdldE15SHlwZXJ0aWVzKCkge1xyXG4gICAgbGV0IGh5cGVydGllcyA9IHRoaXMucnVudGltZVJlZ2lzdHJ5Lmh5cGVydGllc0xpc3Q7XHJcbiAgICBsZXQgaHlwZXJ0aWVzTmFtZXMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpIGluIGh5cGVydGllcykge1xyXG4gICAgICBsZXQgaHlwZXJ0eU5hbWUgPSBoeXBlcnRpZXNbaV0ub2JqZWN0TmFtZTtcclxuICAgICAgaWYgKGh5cGVydGllc05hbWVzLmluZGV4T2YoaHlwZXJ0eU5hbWUpID09PSAtMSkge1xyXG4gICAgICAgIGh5cGVydGllc05hbWVzLnB1c2goaHlwZXJ0eU5hbWUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGh5cGVydGllc05hbWVzO1xyXG4gIH1cclxuXHJcbiAgZ2V0U2VydmljZVByb3ZpZGVyUG9saWN5KG1lc3NhZ2UsIGlzSW5jb21pbmcpIHtcclxuICAgIGxldCBwb2xpY3k7XHJcblxyXG4gICAgaWYgKGlzSW5jb21pbmcpIHtcclxuICAgICAgbGV0IHRvSHlwZXJ0eSA9IHRoaXMucnVudGltZVJlZ2lzdHJ5LmdldEh5cGVydHlOYW1lKG1lc3NhZ2UudG8pO1xyXG4gICAgICBwb2xpY3kgPSB0aGlzLnNlcnZpY2VQcm92aWRlclBvbGljaWVzW3RvSHlwZXJ0eV07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBsZXQgZnJvbUh5cGVydHkgPSB0aGlzLnJ1bnRpbWVSZWdpc3RyeS5nZXRIeXBlcnR5TmFtZShtZXNzYWdlLmZyb20pO1xyXG4gICAgICBwb2xpY3kgPSB0aGlzLnNlcnZpY2VQcm92aWRlclBvbGljaWVzW2Zyb21IeXBlcnR5XTtcclxuICAgIH1cclxuICAgIHJldHVybiBwb2xpY3k7XHJcbiAgfVxyXG5cclxuICBpc0Zyb21SZW1vdGVTTShmcm9tKSB7XHJcbiAgICBsZXQgc3BsaXRGcm9tID0gZnJvbS5zcGxpdCgnOi8vJyk7XHJcbiAgICByZXR1cm4gc3BsaXRGcm9tWzBdID09PSAncnVudGltZScgJiYgZnJvbSAhPT0gdGhpcy5ydW50aW1lUmVnaXN0cnkucnVudGltZVVSTCArICcvc20nO1xyXG4gIH1cclxuXHJcbiAgX2lzVG9TZXRJRChtZXNzYWdlKSB7XHJcbiAgICBsZXQgc2NoZW1hc1RvSWdub3JlID0gWydkb21haW4taWRwJywgJ3J1bnRpbWUnLCAnZG9tYWluJ107XHJcbiAgICBsZXQgc3BsaXRGcm9tID0gKG1lc3NhZ2UuZnJvbSkuc3BsaXQoJzovLycpO1xyXG4gICAgbGV0IGZyb21TY2hlbWEgPSBzcGxpdEZyb21bMF07XHJcblxyXG4gICAgcmV0dXJuIHNjaGVtYXNUb0lnbm9yZS5pbmRleE9mKGZyb21TY2hlbWEpID09PSAtMTtcclxuICB9XHJcblxyXG4gIF9pc0luY29taW5nTWVzc2FnZShtZXNzYWdlKSB7XHJcbiAgICByZXR1cm4gKG1lc3NhZ2UuYm9keS5pZGVudGl0eSkgPyB0cnVlIDogZmFsc2U7XHJcbiAgfVxyXG5cclxuICBnZXRVUkwodXJsKSB7XHJcbiAgICBsZXQgc3BsaXRVUkwgPSB1cmwuc3BsaXQoJy8nKTtcclxuICAgIHJldHVybiBzcGxpdFVSTFswXSArICcvLycgKyBzcGxpdFVSTFsyXSArICcvJyArIHNwbGl0VVJMWzNdO1xyXG4gIH1cclxuXHJcbiAgX2dldElkZW50aXR5KG1lc3NhZ2UpIHtcclxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICd1cGRhdGUnKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlkTW9kdWxlLmdldElkZW50aXR5T2ZIeXBlcnR5KG1lc3NhZ2UuYm9keS5zb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdyZXNwb25zZScgJiYgbWVzc2FnZS5ib2R5LnNvdXJjZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlkTW9kdWxlLmdldElkZW50aXR5T2ZIeXBlcnR5KG1lc3NhZ2UuYm9keS5zb3VyY2UpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChkaXZpZGVVUkwobWVzc2FnZS5mcm9tKS50eXBlID09PSAnaHlwZXJ0eScpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuaWRNb2R1bGUuZ2V0SWRlbnRpdHlPZkh5cGVydHkobWVzc2FnZS5mcm9tKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiB0aGlzLmlkTW9kdWxlLmdldElkZW50aXR5T2ZIeXBlcnR5KHRoaXMuZ2V0VVJMKG1lc3NhZ2UuZnJvbSkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgX2lzVG9WZXJpZnkobWVzc2FnZSkge1xyXG4gICAgbGV0IHNjaGVtYXNUb0lnbm9yZSA9IFsnZG9tYWluLWlkcCcsICdoeXBlcnR5LXJ1bnRpbWUnLCAncnVudGltZScsICdkb21haW4nXTtcclxuICAgIGxldCBzcGxpdEZyb20gPSAobWVzc2FnZS5mcm9tKS5zcGxpdCgnOi8vJyk7XHJcbiAgICBsZXQgZnJvbVNjaGVtYSA9IHNwbGl0RnJvbVswXTtcclxuICAgIGxldCBzcGxpdFRvID0gKG1lc3NhZ2UudG8pLnNwbGl0KCc6Ly8nKTtcclxuICAgIGxldCB0b1NjaGVtYSA9ICBzcGxpdFRvWzBdO1xyXG4gICAgaWYgKGZyb21TY2hlbWEgPT09IG1lc3NhZ2UuZnJvbSB8fCB0b1NjaGVtYSA9PT0gbWVzc2FnZS50bykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc2NoZW1hc1RvSWdub3JlLmluZGV4T2YoZnJvbVNjaGVtYSkgPT09IC0xIHx8IHNjaGVtYXNUb0lnbm9yZS5pbmRleE9mKHRvU2NoZW1hKSA9PT0gLTE7XHJcbiAgfVxyXG5cclxuICAvL1RPRE8gdXNlIHNjaGVtYXNUb0lnbm9yZSBpbnN0ZWFkXHJcbiAgX2lzVG9DeXBoZXJNb2R1bGUobWVzc2FnZSkge1xyXG4gICAgbGV0IGlzQ3JlYXRlID0gbWVzc2FnZS50eXBlID09PSAnY3JlYXRlJztcclxuICAgIGxldCBpc0Zyb21IeXBlcnR5ID0gZGl2aWRlVVJMKG1lc3NhZ2UuZnJvbSkudHlwZSA9PT0gJ2h5cGVydHknO1xyXG4gICAgbGV0IGlzVG9IeXBlcnR5ID0gZGl2aWRlVVJMKG1lc3NhZ2UudG8pLnR5cGUgPT09ICdoeXBlcnR5JztcclxuICAgIGxldCBpc1RvRGF0YU9iamVjdCA9IGlzRGF0YU9iamVjdFVSTChtZXNzYWdlLnRvKTtcclxuICAgIGxldCBpc0hhbmRzaGFrZSA9IG1lc3NhZ2UudHlwZSA9PT0gJ2hhbmRzaGFrZSc7XHJcblxyXG4gICAgcmV0dXJuIChpc0NyZWF0ZSAmJiBpc0Zyb21IeXBlcnR5ICYmIGlzVG9IeXBlcnR5KSB8fCAoaXNDcmVhdGUgJiYgaXNGcm9tSHlwZXJ0eSAmJiBpc1RvRGF0YU9iamVjdCkgfHwgaXNIYW5kc2hha2U7XHJcbiAgfVxyXG5cclxuICBsb2FkQWN0aXZlUG9saWN5KCkge1xyXG4gICAgdGhpcy5hY3RpdmVVc2VyUG9saWN5ID0gcGVyc2lzdGVuY2VNYW5hZ2VyLmdldCgncmV0aGluazphY3RpdmVQb2xpY3knKTtcclxuICB9XHJcblxyXG4gIGxvYWRHcm91cHMoKSB7XHJcbiAgICBsZXQgZ3JvdXBzID0gcGVyc2lzdGVuY2VNYW5hZ2VyLmdldCgncmV0aGluazpncm91cHMnKTtcclxuICAgIGlmIChncm91cHMgIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuZ3JvdXBzID0gZ3JvdXBzO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZFNQUG9saWNpZXMoKSB7XHJcbiAgICBsZXQgcG9saWNpZXMgPSBwZXJzaXN0ZW5jZU1hbmFnZXIuZ2V0KCdyZXRoaW5rOnNwUG9saWNpZXMnKTtcclxuICAgIGlmIChwb2xpY2llcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMuc2VydmljZVByb3ZpZGVyUG9saWNpZXMgPSBwb2xpY2llcztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGxvYWRVc2VyUG9saWNpZXMoKSB7XHJcbiAgICBsZXQgcG9saWNpZXMgPSBwZXJzaXN0ZW5jZU1hbmFnZXIuZ2V0KCdyZXRoaW5rOnVzZXJQb2xpY2llcycpO1xyXG5cclxuICAgIGlmIChwb2xpY2llcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAobGV0IGkgaW4gcG9saWNpZXMpIHtcclxuICAgICAgICBsZXQgcnVsZXNQRSA9IFtdO1xyXG4gICAgICAgIGxldCBydWxlcyA9IHBvbGljaWVzW2ldLnJ1bGVzO1xyXG4gICAgICAgIGZvciAobGV0IGogaW4gcnVsZXMpIHtcclxuICAgICAgICAgIGxldCBjb25kaXRpb247XHJcbiAgICAgICAgICBpZiAocnVsZXNbal0uY29uZGl0aW9uLmF0dHJpYnV0ZSA9PT0gJ3N1YnNjcmlwdGlvbicpIHtcclxuICAgICAgICAgICAgY29uZGl0aW9uID0gbmV3IFN1YnNjcmlwdGlvbkNvbmRpdGlvbihydWxlc1tqXS5jb25kaXRpb24uYXR0cmlidXRlLCBydWxlc1tqXS5jb25kaXRpb24ub3BlcmF0b3IsIHJ1bGVzW2pdLmNvbmRpdGlvbi5wYXJhbXMpO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uZGl0aW9uID0gbmV3IENvbmRpdGlvbihydWxlc1tqXS5jb25kaXRpb24uYXR0cmlidXRlLCBydWxlc1tqXS5jb25kaXRpb24ub3BlcmF0b3IsIHJ1bGVzW2pdLmNvbmRpdGlvbi5wYXJhbXMpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcnVsZXNQRS5wdXNoKG5ldyBSdWxlKHJ1bGVzW2pdLmF1dGhvcmlzZSwgY29uZGl0aW9uLCBydWxlc1tqXS5wcmlvcml0eSwgcnVsZXNbal0uc2NvcGUsIHJ1bGVzW2pdLnRhcmdldCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnVzZXJQb2xpY2llc1tpXSA9IG5ldyBVc2VyUG9saWN5KHBvbGljaWVzW2ldLmtleSwgcnVsZXNQRSwgcG9saWNpZXNbaV0uYWN0aW9ucywgcG9saWNpZXNbaV0uY29tYmluaW5nQWxnb3JpdGhtKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJTdWJzY3JpYmVyKG1lc3NhZ2UpIHtcclxuICAgIGxldCB0byA9IG1lc3NhZ2UudG8uc3BsaXQoJy8nKTtcclxuICAgIGxldCBzdWJzSW5kZXggPSB0by5pbmRleE9mKCdzdWJzY3JpcHRpb24nKTtcclxuICAgIGxldCBpc0RhdGFPYmplY3RTdWJzY3JpcHRpb24gPSBzdWJzSW5kZXggIT09IC0xO1xyXG4gICAgbGV0IGlzRnJvbVJlbW90ZVNNID0gdGhpcy5pc0Zyb21SZW1vdGVTTShtZXNzYWdlLmZyb20pO1xyXG5cclxuICAgIGlmIChpc0RhdGFPYmplY3RTdWJzY3JpcHRpb24gJiBpc0Zyb21SZW1vdGVTTSkge1xyXG4gICAgICB0by5wb3AoKTtcclxuICAgICAgbGV0IGRhdGFPYmplY3RVUkwgPSB0b1swXSArICcvLycgKyB0b1syXSArICcvJyArIHRvWzNdO1xyXG4gICAgICBpZiAodG8ubGVuZ3RoID4gNCkge1xyXG4gICAgICAgIGRhdGFPYmplY3RVUkwgPSB0b1swXSArICcvLycgKyB0b1syXSArICcvJyArIHRvWzNdICsgJy8nICsgdG9bNF07XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5ydW50aW1lUmVnaXN0cnkucmVnaXN0ZXJTdWJzY3JpYmVyKGRhdGFPYmplY3RVUkwsIG1lc3NhZ2UuYm9keS5zdWJzY3JpYmVyKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIF9nZXRMYXN0Q29tcG9uZW50T2ZVUkwodXJsKSB7XHJcbiAgICBsZXQgc3BsaXQgPSB1cmwuc3BsaXQoJy8nKTtcclxuICAgIHJldHVybiBzcGxpdFtzcGxpdC5sZW5ndGggLSAxXTtcclxuICB9XHJcblxyXG4gIHNhdmVBY3RpdmVQb2xpY3koKSB7XHJcbiAgICBwZXJzaXN0ZW5jZU1hbmFnZXIuc2V0KCdyZXRoaW5rOmFjdGl2ZVBvbGljeScsIDAsIHRoaXMuYWN0aXZlVXNlclBvbGljeSk7XHJcbiAgfVxyXG5cclxuICBzYXZlR3JvdXBzKCkge1xyXG4gICAgcGVyc2lzdGVuY2VNYW5hZ2VyLnNldCgncmV0aGluazpncm91cHMnLCAwLCB0aGlzLmdyb3Vwcyk7XHJcbiAgfVxyXG5cclxuICBzYXZlUG9saWNpZXMoc291cmNlKSB7XHJcbiAgICBzd2l0Y2goc291cmNlKSB7XHJcbiAgICAgIGNhc2UgJ1VTRVInOlxyXG4gICAgICAgIHBlcnNpc3RlbmNlTWFuYWdlci5zZXQoJ3JldGhpbms6dXNlclBvbGljaWVzJywgMCwgdGhpcy51c2VyUG9saWNpZXMpO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlICdTRVJWSUNFX1BST1ZJREVSJzpcclxuICAgICAgICBwZXJzaXN0ZW5jZU1hbmFnZXIuc2V0KCdyZXRoaW5rOnNwUG9saWNpZXMnLCAwLCB0aGlzLnNlcnZpY2VQcm92aWRlclBvbGljaWVzKTtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBSdW50aW1lQ29yZUN0eDtcclxuIiwiaW1wb3J0IEFkdmFuY2VkQ29uZGl0aW9uIGZyb20gJy4uL2NvbmRpdGlvbnMvQWR2YW5jZWRDb25kaXRpb24nO1xyXG5pbXBvcnQgQ29uZGl0aW9uIGZyb20gJy4uL2NvbmRpdGlvbnMvQ29uZGl0aW9uJ1xyXG5pbXBvcnQgUG9saWN5IGZyb20gJy4uL1BvbGljeSc7XHJcbmltcG9ydCBSdWxlIGZyb20gJy4uL1J1bGUnO1xyXG5pbXBvcnQgU3Vic2NyaXB0aW9uQ29uZGl0aW9uIGZyb20gJy4uL2NvbmRpdGlvbnMvU3Vic2NyaXB0aW9uQ29uZGl0aW9uJztcclxuXHJcbmNsYXNzIFVzZXJQb2xpY3kgZXh0ZW5kcyBQb2xpY3kge1xyXG4gIGNvbnN0cnVjdG9yKGtleSwgcnVsZXMsIGFjdGlvbnMsIGNvbWJpbmluZ0FsZ29yaXRobSkge1xyXG4gICAgaWYgKCFjb21iaW5pbmdBbGdvcml0aG0pIHtcclxuICAgICAgY29tYmluaW5nQWxnb3JpdGhtID0gJ2RlbnlPdmVycmlkZXMnO1xyXG4gICAgfVxyXG4gICAgc3VwZXIoa2V5LCBydWxlcywgYWN0aW9ucywgY29tYmluaW5nQWxnb3JpdGhtKTtcclxuICB9XHJcblxyXG4gIGNyZWF0ZVJ1bGUodHlwZSwgYXV0aG9yaXNlLCBjb25kaXRpb24sIHNjb3BlLCB0YXJnZXQsIHByaW9yaXR5KSB7XHJcbiAgICBpZiAoIShjb25kaXRpb24gaW5zdGFuY2VvZiBDb25kaXRpb24pKSB7XHJcbiAgICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ2FkdmFuY2VkJzpcclxuICAgICAgICAgIGNvbmRpdGlvbiA9IG5ldyBBZHZhbmNlZENvbmRpdGlvbihjb25kaXRpb24pO1xyXG4gICAgICAgIGNhc2UgJ3NpbXBsZSc6XHJcbiAgICAgICAgICBjb25kaXRpb24gPSBuZXcgQ29uZGl0aW9uKGNvbmRpdGlvblswXSwgY29uZGl0aW9uWzFdLCBjb25kaXRpb25bMl0pO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAnc3Vic2NyaXB0aW9uJzpcclxuICAgICAgICAgIGNvbmRpdGlvbiA9IG5ldyBTdWJzY3JpcHRpb25Db25kaXRpb24oY29uZGl0aW9uWzBdLCBjb25kaXRpb25bMV0sIGNvbmRpdGlvblsyXSk7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKHByaW9yaXR5ID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgcHJpb3JpdHkgPSB0aGlzLmdldExhc3RQcmlvcml0eSgpICsgMTtcclxuICAgIH1cclxuICAgIGxldCBydWxlID0gbmV3IFJ1bGUoYXV0aG9yaXNlLCBjb25kaXRpb24sIHByaW9yaXR5LCBzY29wZSwgdGFyZ2V0KTtcclxuICAgIHRoaXMucnVsZXMucHVzaChydWxlKTtcclxuICB9XHJcblxyXG4gIGRlbGV0ZVJ1bGUocnVsZSkge1xyXG4gICAgbGV0IGluZGV4VG9SZW1vdmUgPSB0aGlzLnJ1bGVzLmluZGV4T2YocnVsZSk7XHJcbiAgICB0aGlzLnJ1bGVzLnNwbGljZShpbmRleFRvUmVtb3ZlLCAxKTtcclxuICB9XHJcblxyXG4gIGdldExhc3RQcmlvcml0eSgpIHtcclxuICAgIGxldCBwcmlvcml0aWVzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMucnVsZXMubGVuZ3RoICE9PSAwKSB7XHJcbiAgICAgIGZvciAobGV0IGkgaW4gdGhpcy5ydWxlcykge1xyXG4gICAgICAgIHByaW9yaXRpZXMucHVzaCh0aGlzLnJ1bGVzW2ldLnByaW9yaXR5KTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gTWF0aC5tYXguYXBwbHkoTWF0aCwgcHJpb3JpdGllcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBnZXRSdWxlQnlQcmlvcml0eShwcmlvcml0eSkge1xyXG4gICAgZm9yIChsZXQgaSBpbiB0aGlzLnJ1bGVzKSB7XHJcbiAgICAgIGlmICh0aGlzLnJ1bGVzW2ldLnByaW9yaXR5ID09IHByaW9yaXR5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucnVsZXNbaV07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRocm93IEVycm9yKCdSdWxlIHdpdGggcHJpb3JpdHkgJyArIHByaW9yaXR5ICsgJyBkb2VzIG5vdCBleGlzdCEnKVxyXG4gIH1cclxuXHJcbiAgaGFzU3Vic2NyaXB0aW9uUnVsZSgpIHtcclxuICAgIGZvciAobGV0IGkgaW4gdGhpcy5ydWxlcykge1xyXG4gICAgICBpZiAodGhpcy5ydWxlc1tpXS5zY29wZSAhPT0gJ2dsb2JhbCcpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5ydWxlc1tpXS5jb25kaXRpb24gaW5zdGFuY2VvZiBTdWJzY3JpcHRpb25Db25kaXRpb24pIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5ydWxlc1tpXS5jb25kaXRpb24gaW5zdGFuY2VvZiBBZHZhbmNlZENvbmRpdGlvbikge1xyXG4gICAgICAgICAgZm9yIChsZXQgaiBpbiB0aGlzLnJ1bGVzW2ldLmNvbmRpdGlvbi5jb25kaXRpb24pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucnVsZXNbaV0uY29uZGl0aW9uLmNvbmRpdGlvbltqXSBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbkNvbmRpdGlvbikge1xyXG4gICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBzb3J0UnVsZXMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5ydWxlcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcclxuICAgICAgICBsZXQgeCA9IGFbJ3ByaW9yaXR5J107IGxldCB5ID0gYlsncHJpb3JpdHknXTtcclxuICAgICAgICByZXR1cm4gKCh4IDwgeSkgPyAtMSA6ICgoeCA+IHkpID8gMSA6IDApKTtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXNlclBvbGljeTtcclxuIiwiLyoqXHJcbiogQ29weXJpZ2h0IDIwMTYgUFQgSW5vdmHDp8OjbyBlIFNpc3RlbWFzIFNBXHJcbiogQ29weXJpZ2h0IDIwMTYgSU5FU0MtSURcclxuKiBDb3B5cmlnaHQgMjAxNiBRVU9CSVMgTkVUV09SS1MgU0xcclxuKiBDb3B5cmlnaHQgMjAxNiBGUkFVTkhPRkVSLUdFU0VMTFNDSEFGVCBaVVIgRk9FUkRFUlVORyBERVIgQU5HRVdBTkRURU4gRk9SU0NIVU5HIEUuVlxyXG4qIENvcHlyaWdodCAyMDE2IE9SQU5HRSBTQVxyXG4qIENvcHlyaWdodCAyMDE2IERldXRzY2hlIFRlbGVrb20gQUdcclxuKiBDb3B5cmlnaHQgMjAxNiBBcGl6ZWVcclxuKiBDb3B5cmlnaHQgMjAxNiBURUNITklTQ0hFIFVOSVZFUlNJVEFUIEJFUkxJTlxyXG4qXHJcbiogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbipcclxuKiAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4qXHJcbiogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4qIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbioqL1xyXG4vKipcclxuICogU3VwcG9ydCBtb2R1bGUgd2l0aCBzb21lIGZ1bmN0aW9ucyB3aWxsIGJlIHVzZWZ1bFxyXG4gKiBAbW9kdWxlIHV0aWxzXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEB0eXBlZGVmIGRpdmlkZVVSTFxyXG4gKiBAdHlwZSBPYmplY3RcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgb2YgVVJMXHJcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBkb21haW4gVGhlIGRvbWFpbiBvZiBVUkxcclxuICogQHByb3BlcnR5IHtzdHJpbmd9IGlkZW50aXR5IFRoZSBpZGVudGl0eSBvZiBVUkxcclxuICovXHJcblxyXG4vKipcclxuICogRGl2aWRlIGFuIHVybCBpbiB0eXBlLCBkb21haW4gYW5kIGlkZW50aXR5XHJcbiAqIEBwYXJhbSAge1VSTC5VUkx9IHVybCAtIHVybCBhZGRyZXNzXHJcbiAqIEByZXR1cm4ge2RpdmlkZVVSTH0gdGhlIHJlc3VsdCBvZiBkaXZpZGVVUkxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXZpZGVVUkwodXJsKSB7XHJcblxyXG4gIGlmICghdXJsKSB0aHJvdyBFcnJvcignVVJMIGlzIG5lZWRlZCB0byBzcGxpdCcpO1xyXG5cclxuICAvLyBsZXQgcmUgPSAvKFthLXpBLVotXSopPzpcXC9cXC8oPzpcXC4pPyhbLWEtekEtWjAtOUA6JS5fXFwrfiM9XXsyLDI1Nn1cXC5bYS16XXsyLDZ9XFxiKSooXFwvW1xcL1xcZFxcd1xcLi1dKikqKD86W1xcP10pKiguKykqL2dpO1xyXG4gIGxldCByZSA9IC8oW2EtekEtWi1dKik6XFwvXFwvKD86XFwuKT8oWy1hLXpBLVowLTlAOiUuX1xcK34jPV17MiwyNTZ9KShbLWEtekEtWjAtOUA6JS5fXFwrfiM9XFwvXSopL2dpO1xyXG4gIGxldCBzdWJzdCA9ICckMSwkMiwkMyc7XHJcbiAgbGV0IHBhcnRzID0gdXJsLnJlcGxhY2UocmUsIHN1YnN0KS5zcGxpdCgnLCcpO1xyXG5cclxuICAvLyBJZiB0aGUgdXJsIGhhcyBubyBwcm90b2NvbCwgdGhlIGRlZmF1bHQgcHJvdG9jb2wgc2V0IGlzIGh0dHBzXHJcbiAgaWYgKHBhcnRzWzBdID09PSB1cmwpIHtcclxuICAgIHBhcnRzWzBdID0gJ2h0dHBzJztcclxuICAgIHBhcnRzWzFdID0gdXJsO1xyXG4gIH1cclxuXHJcbiAgbGV0IHJlc3VsdCA9IHtcclxuICAgIHR5cGU6IHBhcnRzWzBdLFxyXG4gICAgZG9tYWluOiBwYXJ0c1sxXSxcclxuICAgIGlkZW50aXR5OiBwYXJ0c1syXVxyXG4gIH07XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBkaXZpZGVFbWFpbChlbWFpbCkge1xyXG4gIGxldCBpbmRleE9mQXQgPSBlbWFpbC5pbmRleE9mKCdAJyk7XHJcblxyXG4gIGxldCByZXN1bHQgPSB7XHJcbiAgICB1c2VybmFtZTogZW1haWwuc3Vic3RyaW5nKDAsIGluZGV4T2ZBdCksXHJcbiAgICBkb21haW46IGVtYWlsLnN1YnN0cmluZyhpbmRleE9mQXQgKyAxLCBlbWFpbC5sZW5ndGgpXHJcbiAgfTtcclxuXHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyoqXHJcbiAqIENoZWNrIGlmIGFuIE9iamVjdCBpcyBlbXB0eVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9IG9iamVjdCBPYmplY3QgdG8gYmUgY2hlY2tlZFxyXG4gKiBAcmV0dXJuIHtCb29sZWFufSAgICAgICBzdGF0dXMgb2YgT2JqZWN0LCBlbXB0eSBvciBub3QgKHRydWV8ZmFsc2UpO1xyXG4gKi9cclxuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5T2JqZWN0KG9iamVjdCkge1xyXG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLmxlbmd0aCA+IDAgPyBmYWxzZSA6IHRydWU7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBNYWtlIGEgQ09QWSBvZiB0aGUgb3JpZ2luYWwgZGF0YVxyXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogLSBvYmplY3QgdG8gYmUgY2xvbmVkXHJcbiAqIEByZXR1cm4ge09iamVjdH1cclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmUob2JqKSB7XHJcbiAgLy9UT0RPOiBzaW1wbGUgYnV0IGluZWZmaWNpZW50IEpTT04gZGVlcCBjbG9uZS4uLlxyXG4gIGlmIChvYmopIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9iaikpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlUGF0aEZyb21VUkwodXJsKSB7XHJcbiAgbGV0IHNwbGl0VVJMID0gdXJsLnNwbGl0KCcvJyk7XHJcbiAgcmV0dXJuIHNwbGl0VVJMWzBdICsgJy8vJyArIHNwbGl0VVJMWzJdICsgJy8nICsgc3BsaXRVUkxbM107XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBPYnRhaW5zIHRoZSB1c2VyIFVSTCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEgZ2l2ZW4gZW1haWxcclxuICogQHBhcmFtICB7c3RyaW5nfSB1c2VyRW1haWwgVGhlIHVzZXIgZW1haWxcclxuICogQHJldHVybiB7VVJMLlVSTH0gdXNlclVSTCBUaGUgdXNlciBVUkxcclxuICovXHJcbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VyVVJMRnJvbUVtYWlsKHVzZXJFbWFpbCkge1xyXG4gIGxldCBpbmRleE9mQXQgPSB1c2VyRW1haWwuaW5kZXhPZignQCcpO1xyXG4gIHJldHVybiAndXNlcjovLycgKyB1c2VyRW1haWwuc3Vic3RyaW5nKGluZGV4T2ZBdCArIDEsIHVzZXJFbWFpbC5sZW5ndGgpICsgJy8nICsgdXNlckVtYWlsLnN1YnN0cmluZygwLCBpbmRleE9mQXQpO1xyXG59XHJcblxyXG4vKipcclxuICogT2J0YWlucyB0aGUgdXNlciBlbWFpbCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEgZ2l2ZW4gVVJMXHJcbiAqIEBwYXJhbSAge1VSTC5VUkx9IHVzZXJVUkwgVGhlIHVzZXIgVVJMXHJcbiAqIEByZXR1cm4ge3N0cmluZ30gdXNlckVtYWlsIFRoZSB1c2VyIGVtYWlsXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gZ2V0VXNlckVtYWlsRnJvbVVSTCh1c2VyVVJMKSB7XHJcbiAgbGV0IHVybCA9IGRpdmlkZVVSTCh1c2VyVVJMKTtcclxuICByZXR1cm4gdXJsLmlkZW50aXR5LnJlcGxhY2UoJy8nLCAnJykgKyAnQCcgKyB1cmwuZG9tYWluOyAvLyBpZGVudGl0eSBmaWVsZCBoYXMgJy9leGFtcGxlSUQnIGluc3RlYWQgb2YgJ2V4YW1wbGVJRCdcclxufVxyXG5cclxuXHJcbi8qKlxyXG4gKiBDaGVjayBpZiB0aGUgdXNlciBpZGVudGlmaWVyIGlzIGFscmVhZHkgaW4gdGhlIFVSTCBmb3JtYXQsIGlmIG5vdCwgY29udmVydCB0byBVUkwgZm9ybWF0XHJcbiAqIEBwYXJhbSAge3N0cmluZ30gICBpZGVudGlmaWVyICB1c2VyIGlkZW50aWZpZXJcclxuICogQHJldHVybiB7c3RyaW5nfSAgIHVzZXJVUkwgICAgdGhlIHVzZXIgVVJMXHJcbiAqL1xyXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFRvVXNlclVSTChpZGVudGlmaWVyKSB7XHJcblxyXG4gIC8vIGNoZWNrIGlmIHRoZSBpZGVudGlmaWVyIGlzIGFscmVhZHkgaW4gdGhlIHVybCBmb3JtYXRcclxuICBpZiAoaWRlbnRpZmllci5zdWJzdHJpbmcoMCwgNykgPT09ICd1c2VyOi8vJykge1xyXG4gICAgbGV0IGRpdmlkZWRVUkwgPSBkaXZpZGVVUkwoaWRlbnRpZmllcik7XHJcblxyXG4gICAgLy9jaGVjayBpZiB0aGUgdXJsIGlzIHdlbGwgZm9ybWF0ZWRcclxuICAgIGlmIChkaXZpZGVkVVJMLmRvbWFpbiAmJiBkaXZpZGVkVVJMLmlkZW50aXR5KSB7XHJcbiAgICAgIHJldHVybiBpZGVudGlmaWVyO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgJ3VzZXJVUkwgd2l0aCB3cm9uZyBmb3JtYXQnO1xyXG4gICAgfVxyXG5cclxuICAvL2lmIG5vdCwgY29udmVydCB0aGUgdXNlciBlbWFpbCB0byBVUkwgZm9ybWF0XHJcbiAgfSBlbHNlIHtcclxuICAgIHJldHVybiBnZXRVc2VyVVJMRnJvbUVtYWlsKGlkZW50aWZpZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YU9iamVjdFVSTCh1cmwpIHtcclxuICBsZXQgc2NoZW1hc1RvSWdub3JlID0gWydkb21haW4taWRwJywgJ3J1bnRpbWUnLCAnZG9tYWluJywgJ2h5cGVydHknXTtcclxuICBsZXQgc3BsaXRVUkwgPSAodXJsKS5zcGxpdCgnOi8vJyk7XHJcbiAgbGV0IHVybFNjaGVtYSA9IHNwbGl0VVJMWzBdO1xyXG5cclxuICByZXR1cm4gc2NoZW1hc1RvSWdub3JlLmluZGV4T2YodXJsU2NoZW1hKSA9PT0gLTE7XHJcbn1cclxuIiwiaW1wb3J0IFBFUCBmcm9tICcuL1BFUCc7XHJcbmltcG9ydCBQRFAgZnJvbSAnLi9QRFAnO1xyXG5pbXBvcnQgVXNlclBvbGljeSBmcm9tICcuL3BvbGljaWVzL1VzZXJQb2xpY3knO1xyXG5cclxuY2xhc3MgUG9saWN5RW5naW5lIHtcclxuXHJcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xyXG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgIGNvbnRleHQucG9saWN5RW5naW5lID0gdGhpcztcclxuICAgIGNvbnRleHQubG9hZEFjdGl2ZVBvbGljeSgpO1xyXG4gICAgY29udGV4dC5sb2FkR3JvdXBzKCk7XHJcbiAgICBjb250ZXh0LmxvYWRTUFBvbGljaWVzKCk7XHJcbiAgICBjb250ZXh0LmxvYWRVc2VyUG9saWNpZXMoKTtcclxuICAgIHRoaXMucGRwID0gbmV3IFBEUChjb250ZXh0KTtcclxuICAgIHRoaXMucGVwID0gbmV3IFBFUChjb250ZXh0KTtcclxuICB9XHJcblxyXG4gIGFkZFBvbGljeShzb3VyY2UsIGtleSwgcG9saWN5KSB7XHJcbiAgICBpZiAoc291cmNlID09PSAnU0VSVklDRV9QUk9WSURFUicpIHtcclxuICAgICAgdGhpcy5jb250ZXh0LnNlcnZpY2VQcm92aWRlclBvbGljaWVzW2tleV0gPSBwb2xpY3k7XHJcbiAgICAgIHRoaXMuY29udGV4dC5zYXZlUG9saWNpZXMoc291cmNlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChzb3VyY2UgPT09ICdVU0VSJykge1xyXG4gICAgICAgIGlmICghcG9saWN5KSB7XHJcbiAgICAgICAgICBwb2xpY3kgPSBuZXcgVXNlclBvbGljeShrZXksIFtdLCBbXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuY29udGV4dC51c2VyUG9saWNpZXNba2V5XSA9IHBvbGljeTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZVBvbGljaWVzKHNvdXJjZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgRXJyb3IoJ1Vua25vd24gcG9saWN5IHNvdXJjZTogJyArIHNvdXJjZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZVBvbGljeShzb3VyY2UsIGtleSkge1xyXG4gICAgaWYgKHNvdXJjZSA9PT0gJyonKSB7XHJcbiAgICAgIHRoaXMuY29udGV4dC5zZXJ2aWNlUHJvdmlkZXJQb2xpY2llcyA9IHt9O1xyXG4gICAgICB0aGlzLmNvbnRleHQudXNlclBvbGljaWVzID0ge307XHJcbiAgICAgIHRoaXMuY29udGV4dC5hY3RpdmVVc2VyUG9saWN5ID0gdW5kZWZpbmVkO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHNvdXJjZSA9PT0gJ1NFUlZJQ0VfUFJPVklERVInKSB7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dC5zZXJ2aWNlUHJvdmlkZXJQb2xpY2llc1trZXldO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzb3VyY2UgPT09ICdVU0VSJykge1xyXG4gICAgICAgICAgZGVsZXRlIHRoaXMuY29udGV4dC51c2VyUG9saWNpZXNba2V5XTtcclxuICAgICAgICAgIGlmIChrZXkgPT09IHRoaXMuY29udGV4dC5hY3RpdmVVc2VyUG9saWN5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5hY3RpdmVVc2VyUG9saWN5ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aHJvdyBFcnJvcignVW5rbm93biBwb2xpY3kgc291cmNlOiAnICsgc291cmNlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmNvbnRleHQuc2F2ZVBvbGljaWVzKCdVU0VSJyk7XHJcbiAgICB0aGlzLmNvbnRleHQuc2F2ZVBvbGljaWVzKCdTRVJWSUNFX1BST1ZJREVSJyk7XHJcbiAgICB0aGlzLmNvbnRleHQuc2F2ZUFjdGl2ZVBvbGljeSgpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlUnVsZShrZXksIHJ1bGUpIHtcclxuICAgIGRlbGV0ZSB0aGlzLmNvbnRleHQudXNlclBvbGljaWVzW2tleV1bcnVsZS5zY29wZV1bcnVsZS50YXJnZXRdW3J1bGUuY29uZGl0aW9uXTtcclxuICB9XHJcblxyXG4gIGF1dGhvcmlzZShtZXNzYWdlKSB7XHJcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xyXG4gICAgcmV0dXJuIF90aGlzLmNvbnRleHQuYXV0aG9yaXNlKG1lc3NhZ2UpO1xyXG4gIH1cclxuXHJcbiAgZ2V0R3JvdXBzTmFtZXMoKSB7XHJcbiAgICBsZXQgbXlHcm91cHMgPSB0aGlzLmNvbnRleHQuZ3JvdXBzO1xyXG4gICAgbGV0IGdyb3Vwc05hbWVzID0gW107XHJcbiAgICBpZiAobXlHcm91cHMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBmb3IgKGxldCBncm91cE5hbWUgaW4gbXlHcm91cHMpIHtcclxuICAgICAgICBncm91cHNOYW1lcy5wdXNoKGdyb3VwTmFtZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBncm91cHNOYW1lcztcclxuICB9XHJcblxyXG4gIGdldEdyb3VwKGdyb3VwTmFtZSkge1xyXG4gICAgbGV0IG15R3JvdXBzID0gdGhpcy5jb250ZXh0Lmdyb3VwcztcclxuICAgIGxldCBtZW1iZXJzID0gW107XHJcblxyXG4gICAgaWYgKG15R3JvdXBzW2dyb3VwTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBtZW1iZXJzID0gbXlHcm91cHNbZ3JvdXBOYW1lXTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWVtYmVycztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogQ3JlYXRlcyBhIGdyb3VwIHdpdGggdGhlIGdpdmVuIG5hbWUuXHJcbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICBncm91cE5hbWVcclxuICAqL1xyXG4gIGNyZWF0ZUdyb3VwKGdyb3VwTmFtZSkge1xyXG4gICAgdGhpcy5jb250ZXh0Lmdyb3Vwc1tncm91cE5hbWVdID0gW107XHJcbiAgICB0aGlzLmNvbnRleHQuc2F2ZUdyb3VwcygpO1xyXG4gIH1cclxuXHJcbiAgZGVsZXRlR3JvdXAoZ3JvdXBOYW1lKSB7XHJcbiAgICBkZWxldGUgdGhpcy5jb250ZXh0Lmdyb3Vwc1tncm91cE5hbWVdO1xyXG4gICAgdGhpcy5jb250ZXh0LnNhdmVHcm91cHMoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICogQWRkcyB0aGUgZ2l2ZW4gdXNlciBlbWFpbCB0byB0aGUgZ3JvdXAgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cclxuICAqIEBwYXJhbSAge1N0cmluZ30gIHVzZXJFbWFpbFxyXG4gICogQHBhcmFtICB7U3RyaW5nfSAgZ3JvdXBOYW1lXHJcbiAgKi9cclxuICBhZGRUb0dyb3VwKGdyb3VwTmFtZSwgdXNlckVtYWlsKSB7XHJcbiAgICBsZXQgbXlHcm91cHMgPSB0aGlzLmNvbnRleHQuZ3JvdXBzO1xyXG4gICAgaWYgKG15R3JvdXBzW2dyb3VwTmFtZV0gIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICBpZiAobXlHcm91cHNbZ3JvdXBOYW1lXS5pbmRleE9mKHVzZXJFbWFpbCkgPT09IC0xKSB7XHJcbiAgICAgICAgbXlHcm91cHNbZ3JvdXBOYW1lXS5wdXNoKHVzZXJFbWFpbCk7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LnNhdmVHcm91cHMoKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhyb3cgRXJyb3IoJ0dyb3VwIFwiJyArIGdyb3VwTmFtZSArICdcIiBkb2VzIG5vdCBleGlzdCEnKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZUZyb21Hcm91cChncm91cE5hbWUsIHVzZXJFbWFpbCkge1xyXG4gICAgbGV0IGdyb3VwID0gdGhpcy5jb250ZXh0Lmdyb3Vwc1tncm91cE5hbWVdO1xyXG5cclxuICAgIGdyb3VwLnNwbGljZShncm91cC5pbmRleE9mKHVzZXJFbWFpbCksIDEpO1xyXG4gICAgdGhpcy5jb250ZXh0LnNhdmVHcm91cHMoKTtcclxuICB9XHJcblxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBQb2xpY3lFbmdpbmU7XHJcbiJdfQ==

//# sourceMappingURL=PolicyEngine.js.map
