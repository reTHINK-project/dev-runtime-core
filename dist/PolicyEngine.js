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
// version: 0.5.1
// Last build: Wed Jul 13 2016 18:18:42 GMT+0100 (WEST)

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.PolicyEngine = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":6}],2:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":7}],3:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],4:[function(require,module,exports){
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
},{"../core-js/object/define-property":1}],5:[function(require,module,exports){
"use strict";

var _Symbol = require("babel-runtime/core-js/symbol")["default"];

exports["default"] = function (obj) {
  return obj && obj.constructor === _Symbol ? "symbol" : typeof obj;
};

exports.__esModule = true;
},{"babel-runtime/core-js/symbol":2}],6:[function(require,module,exports){
var $ = require('../../modules/$');
module.exports = function defineProperty(it, key, desc){
  return $.setDesc(it, key, desc);
};
},{"../../modules/$":25}],7:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
module.exports = require('../../modules/$.core').Symbol;
},{"../../modules/$.core":11,"../../modules/es6.object.to-string":35,"../../modules/es6.symbol":36}],8:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],9:[function(require,module,exports){
var isObject = require('./$.is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./$.is-object":24}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],11:[function(require,module,exports){
var core = module.exports = {version: '1.2.6'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],12:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./$.a-function');
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
},{"./$.a-function":8}],13:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],14:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./$.fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./$.fails":17}],15:[function(require,module,exports){
// all enumerable object keys, includes symbols
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getSymbols = $.getSymbols;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = $.isEnum
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))keys.push(key);
  }
  return keys;
};
},{"./$":25}],16:[function(require,module,exports){
var global    = require('./$.global')
  , core      = require('./$.core')
  , ctx       = require('./$.ctx')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && key in target;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(param){
        return this instanceof C ? new C(param) : C(param);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    if(IS_PROTO)(exports[PROTOTYPE] || (exports[PROTOTYPE] = {}))[key] = out;
  }
};
// type bitmap
$export.F = 1;  // forced
$export.G = 2;  // global
$export.S = 4;  // static
$export.P = 8;  // proto
$export.B = 16; // bind
$export.W = 32; // wrap
module.exports = $export;
},{"./$.core":11,"./$.ctx":12,"./$.global":19}],17:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],18:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./$.to-iobject')
  , getNames  = require('./$').getNames
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return getNames(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.get = function getOwnPropertyNames(it){
  if(windowNames && toString.call(it) == '[object Window]')return getWindowNames(it);
  return getNames(toIObject(it));
};
},{"./$":25,"./$.to-iobject":32}],19:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],20:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],21:[function(require,module,exports){
var $          = require('./$')
  , createDesc = require('./$.property-desc');
module.exports = require('./$.descriptors') ? function(object, key, value){
  return $.setDesc(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./$":25,"./$.descriptors":14,"./$.property-desc":28}],22:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./$.cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./$.cof":10}],23:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./$.cof');
module.exports = Array.isArray || function(arg){
  return cof(arg) == 'Array';
};
},{"./$.cof":10}],24:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],25:[function(require,module,exports){
var $Object = Object;
module.exports = {
  create:     $Object.create,
  getProto:   $Object.getPrototypeOf,
  isEnum:     {}.propertyIsEnumerable,
  getDesc:    $Object.getOwnPropertyDescriptor,
  setDesc:    $Object.defineProperty,
  setDescs:   $Object.defineProperties,
  getKeys:    $Object.keys,
  getNames:   $Object.getOwnPropertyNames,
  getSymbols: $Object.getOwnPropertySymbols,
  each:       [].forEach
};
},{}],26:[function(require,module,exports){
var $         = require('./$')
  , toIObject = require('./$.to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":25,"./$.to-iobject":32}],27:[function(require,module,exports){
module.exports = true;
},{}],28:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],29:[function(require,module,exports){
module.exports = require('./$.hide');
},{"./$.hide":21}],30:[function(require,module,exports){
var def = require('./$').setDesc
  , has = require('./$.has')
  , TAG = require('./$.wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./$":25,"./$.has":20,"./$.wks":34}],31:[function(require,module,exports){
var global = require('./$.global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./$.global":19}],32:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./$.iobject')
  , defined = require('./$.defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./$.defined":13,"./$.iobject":22}],33:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],34:[function(require,module,exports){
var store  = require('./$.shared')('wks')
  , uid    = require('./$.uid')
  , Symbol = require('./$.global').Symbol;
module.exports = function(name){
  return store[name] || (store[name] =
    Symbol && Symbol[name] || (Symbol || uid)('Symbol.' + name));
};
},{"./$.global":19,"./$.shared":31,"./$.uid":33}],35:[function(require,module,exports){

},{}],36:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $              = require('./$')
  , global         = require('./$.global')
  , has            = require('./$.has')
  , DESCRIPTORS    = require('./$.descriptors')
  , $export        = require('./$.export')
  , redefine       = require('./$.redefine')
  , $fails         = require('./$.fails')
  , shared         = require('./$.shared')
  , setToStringTag = require('./$.set-to-string-tag')
  , uid            = require('./$.uid')
  , wks            = require('./$.wks')
  , keyOf          = require('./$.keyof')
  , $names         = require('./$.get-names')
  , enumKeys       = require('./$.enum-keys')
  , isArray        = require('./$.is-array')
  , anObject       = require('./$.an-object')
  , toIObject      = require('./$.to-iobject')
  , createDesc     = require('./$.property-desc')
  , getDesc        = $.getDesc
  , setDesc        = $.setDesc
  , _create        = $.create
  , getNames       = $names.get
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , setter         = false
  , HIDDEN         = wks('_hidden')
  , isEnum         = $.isEnum
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , useNative      = typeof $Symbol == 'function'
  , ObjectProto    = Object.prototype;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(setDesc({}, 'a', {
    get: function(){ return setDesc(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = getDesc(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  setDesc(it, key, D);
  if(protoDesc && it !== ObjectProto)setDesc(ObjectProto, key, protoDesc);
} : setDesc;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol.prototype);
  sym._k = tag;
  DESCRIPTORS && setter && setSymbolDesc(ObjectProto, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    }
  });
  return sym;
};

var isSymbol = function(it){
  return typeof it == 'symbol';
};

var $defineProperty = function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return setDesc(it, key, D);
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
  var E = isEnum.call(this, key);
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key]
    ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toIObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var names  = getNames(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
};
var $stringify = function stringify(it){
  if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
  var args = [it]
    , i    = 1
    , $$   = arguments
    , replacer, $replacer;
  while($$.length > i)args.push($$[i++]);
  replacer = args[1];
  if(typeof replacer == 'function')$replacer = replacer;
  if($replacer || !isArray(replacer))replacer = function(key, value){
    if($replacer)value = $replacer.call(this, key, value);
    if(!isSymbol(value))return value;
  };
  args[1] = replacer;
  return _stringify.apply($JSON, args);
};
var buggyJSON = $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
});

// 19.4.1.1 Symbol([description])
if(!useNative){
  $Symbol = function Symbol(){
    if(isSymbol(this))throw TypeError('Symbol is not a constructor');
    return wrap(uid(arguments.length > 0 ? arguments[0] : undefined));
  };
  redefine($Symbol.prototype, 'toString', function toString(){
    return this._k;
  });

  isSymbol = function(it){
    return it instanceof $Symbol;
  };

  $.create     = $create;
  $.isEnum     = $propertyIsEnumerable;
  $.getDesc    = $getOwnPropertyDescriptor;
  $.setDesc    = $defineProperty;
  $.setDescs   = $defineProperties;
  $.getNames   = $names.get = $getOwnPropertyNames;
  $.getSymbols = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./$.library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
  'species,split,toPrimitive,toStringTag,unscopables'
).split(','), function(it){
  var sym = wks(it);
  symbolStatics[it] = useNative ? sym : wrap(sym);
});

setter = true;

$export($export.G + $export.W, {Symbol: $Symbol});

$export($export.S, 'Symbol', symbolStatics);

$export($export.S + $export.F * !useNative, 'Object', {
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
$JSON && $export($export.S + $export.F * (!useNative || buggyJSON), 'JSON', {stringify: $stringify});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./$":25,"./$.an-object":9,"./$.descriptors":14,"./$.enum-keys":15,"./$.export":16,"./$.fails":17,"./$.get-names":18,"./$.global":19,"./$.has":20,"./$.is-array":23,"./$.keyof":26,"./$.library":27,"./$.property-desc":28,"./$.redefine":29,"./$.set-to-string-tag":30,"./$.shared":31,"./$.to-iobject":32,"./$.uid":33,"./$.wks":34}],37:[function(require,module,exports){
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

    var _this = this;
    _this.operators = _this.setOperators();
  }

  (0, _createClass3.default)(Operators, [{
    key: 'setOperators',
    value: function setOperators() {
      var _this = this;
      var operators = {
        between: function between(params) {
          return _this.isBetween(params[0][0], params[0][1], params[1]);
        },
        in: function _in(params) {
          return params[0].indexOf(params[1]) > -1;
        },
        equals: function equals(params) {
          return params[0][0] === '*' || params[0][0] === params[1];
        },

        or: function or(params) {
          return params[0] || params[1];
        },
        and: function and(params) {
          return params[0] && params[1];
        },
        not: function not(params) {
          return !params[0];
        }
      };
      return operators;
    }

    /**
    * Verifies if the current time is between the given start and end times.
    * @param {Number}     start
    * @param {Number}     end
    * @return {Boolean}   boolean
    */

  }, {
    key: 'isBetween',
    value: function isBetween(start, end, now) {
      start = parseInt(start);
      end = parseInt(end);

      if (end < start) {
        now = now < start ? now += 2400 : now;
        end += 2400;
      }

      return now > start && now < end;
    }
  }]);
  return Operators;
}();

exports.default = Operators;
module.exports = exports['default'];

},{"babel-runtime/helpers/classCallCheck":3,"babel-runtime/helpers/createClass":4}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _Operators = require('./Operators');

var _Operators2 = _interopRequireDefault(_Operators);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* The Policy Decision Point (PDP) decides if a message is to be authorised by checking a set of
* policies. The resource to be verified is specified in the first word of the 'condition' field of
* a Policy object. The implementation that verifies if the message is compliant with a policy is
* specified in a hashtable to allow dynamic definition of the implementation, providing
* extensibility to the Policy Engine functionalities.
*/

var PDP = function () {

  /**
  * This method is invoked by the Policy Engine and instantiates the Policy Decision Point. It
  * initialises or loads from the Persistence Manager the object 'myGroups' to store the user's
  * groups.
  * @param  {Registry}    muchruntimeRegistry
  */

  function PDP(context) {
    (0, _classCallCheck3.default)(this, PDP);

    var _this = this;
    _this.context = context;
    _this.operators = new _Operators2.default(context);
  }

  /**
  * Verifies if the given message is compliant with the given policies. If one of the policies
  * evaluates to 'false', then the message is not authorised. Returns the final authorisation
  * decision and a set of actions that policies may require.
  * @param {Message}  message
  * @param {URL}      hypertyToVerify
  * @param {Array}    policies
  * @return {Array}   [authDecision, actions]
  */


  (0, _createClass3.default)(PDP, [{
    key: 'evaluate',
    value: function evaluate(message, policies) {
      var _this = this;
      var results = [true];
      var actions = [];
      for (var i in policies) {
        var policy = policies[i];
        var condition = policy.condition;
        var verifiesCondition = false;
        if ((typeof condition === 'undefined' ? 'undefined' : (0, _typeof3.default)(condition)) === 'object') {
          verifiesCondition = _this.verifiesAdvancedCondition(condition[0], condition[1], condition[2], policy.scope, message);
        } else {
          verifiesCondition = _this.verifiesSimpleCondition(condition, policy.scope, message);
        }

        if (verifiesCondition) {
          results.push(policy.authorise);
        }
        if (policy.actions !== []) {
          for (var _i in policy.actions) {
            var newAction = {
              method: policy.actions[_i].method,
              params: message
            };
            actions.push(newAction);
          }
        }
      }

      var authDecision = results.indexOf(false) === -1;
      return [authDecision, actions];
    }
  }, {
    key: 'verifiesSimpleCondition',
    value: function verifiesSimpleCondition(condition, scope, message) {
      var _this = this;
      var splitCondition = condition.split(' ');
      var variable = splitCondition[0];
      var operator = splitCondition[1];

      var params = void 0;
      if (operator === 'in') {
        _this.context.group = { scope: scope, group: splitCondition[2], destination: message.to };
        params = _this.context.group;
      } else {
        params = splitCondition.slice(2);
      }
      _this.context[variable] = { message: message };
      var value = _this.context[variable];
      return _this.operators.operators[operator]([params, value]);
    }
  }, {
    key: 'verifiesAdvancedCondition',
    value: function verifiesAdvancedCondition(operator, left, right, scope, message) {
      var _this = this;
      while ((typeof left === 'undefined' ? 'undefined' : (0, _typeof3.default)(left)) === 'object') {
        left = _this.verifiesAdvancedCondition(left[0], left[1], left[2], scope, message);
      }
      if (right !== undefined) {
        while ((typeof right === 'undefined' ? 'undefined' : (0, _typeof3.default)(right)) === 'object') {
          right = _this.verifiesAdvancedCondition(right[0], right[1], right[2], scope, message);
        }
      }

      var resultLeft = typeof left === 'boolean' ? left : _this.verifiesSimpleCondition(left, scope, message);

      var resultRight = void 0;
      if (right !== undefined) {
        resultRight = typeof right === 'boolean' ? right : _this.verifiesSimpleCondition(right, scope, message);
      }

      return _this.operators.operators[operator]([resultLeft, resultRight]);
    }
  }]);
  return PDP;
}();

exports.default = PDP;
module.exports = exports['default'];

},{"./Operators":37,"babel-runtime/helpers/classCallCheck":3,"babel-runtime/helpers/createClass":4,"babel-runtime/helpers/typeof":5}],39:[function(require,module,exports){
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

    var _this = this;
    _this.context = context;
  }

  (0, _createClass3.default)(PEP, [{
    key: "enforce",
    value: function enforce(result) {
      var _this = this;
      var authDecision = result[0];
      var actions = result[1];

      for (var i in actions) {
        _this.context[actions[i].method](actions[i].params, authDecision);
      }
    }

    /*sendAutomaticMessage() {}
     forwardToID() {}
     forwardToHyperty() {}*/

  }]);
  return PEP;
}();

exports.default = PEP;
module.exports = exports['default'];

},{"babel-runtime/helpers/classCallCheck":3,"babel-runtime/helpers/createClass":4}],40:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _PEP = require('./PEP');

var _PEP2 = _interopRequireDefault(_PEP);

var _PDP = require('./PDP');

var _PDP2 = _interopRequireDefault(_PDP);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* The Policy Engine intercepts all the messages sent through the Message Bus and applies the
* policies defined by the service provider and the user.
*/
//jshint browser:true, jquery: true

//import persistenceManager from 'service-framework/dist/PersistenceManager';

var PolicyEngine = function () {

  /**
  * This method is invoked by the RuntimeUA and instantiates the Policy Engine. A Policy Decision
  * Point (PDP) and a Policy Enforcement Point (PEP) are initialised for the evaluation of policies
  * and the enforcement of additional actions, respectively.
  * @param  {IdentityModule}    identityModule
  * @param  {Registry}          runtimeRegistry
  */

  function PolicyEngine(context) {
    (0, _classCallCheck3.default)(this, PolicyEngine);

    var _this = this;
    _this.context = context;
    _this.context.pdp = new _PDP2.default(context);
    _this.context.pep = new _PEP2.default(context);
  }

  /**
  * Associates the given policies with a scope. The possible scopes are 'global', 'hyperty' and
  * 'user'.
  * @param  {Policy[]}  policies
  * @param  {String}    scope
  */


  (0, _createClass3.default)(PolicyEngine, [{
    key: 'addPolicies',
    value: function addPolicies(newPolicies) {
      var _this = this;

      var myPolicies = _this.context.policies;
      if (myPolicies === undefined) {
        myPolicies = {};
      }

      for (var i in newPolicies) {
        var newPolicy = newPolicies[i];
        var scope = newPolicy.scope;
        if (myPolicies[scope] === undefined) {
          myPolicies[scope] = [];
        }
        for (var j in myPolicies[scope]) {
          var existingPolicy = myPolicies[scope][j];
          if (existingPolicy.condition === newPolicy.condition) {
            _this.removePolicies(newPolicies[i].condition);
            break;
          }
        }
        myPolicies[scope].push(newPolicies[i]);
      }

      _this.context.policies = myPolicies;
    }

    /**
    * Removes the policy with the given ID from the given scope. If policyID is '*', removes all policies associated with the given scope.
    * @param  {String}  policyID
    * @param  {String}  scope
    */

  }, {
    key: 'removePolicies',
    value: function removePolicies(scope, condition) {
      var _this = this;
      var myPolicies = _this.context.policies;

      if (scope !== '*') {

        if (scope in myPolicies) {
          if (condition !== '*') {
            var policies = myPolicies[scope];
            var typeOfCondition = typeof condition === 'undefined' ? 'undefined' : (0, _typeof3.default)(condition);
            for (var i in policies) {
              var typeOfPolicyCondition = (0, _typeof3.default)(policies[i].condition);
              if (typeOfCondition === typeOfPolicyCondition) {
                if (typeOfCondition === 'string') {
                  if (policies[i].condition === condition) {
                    policies.splice(i, 1);
                    break;
                  }
                } else {
                  //typeof condition = object (advanced policy)
                  if (_this.areEqualArrays(policies[i].condition, condition)) {
                    policies.splice(i, 1);
                  }
                }
              }
            }
          } else {
            delete myPolicies[scope];
          }

          _this.context.policies = myPolicies;
        }
      } else {
        _this.context.policies = {};
      }
    }
  }, {
    key: 'areEqualArrays',
    value: function areEqualArrays(array1, array2) {
      if (array1.length !== array2.length) {
        return false;
      }

      var numElements = array1.length;
      for (var i = 0; i < numElements; i++) {
        if (array1[i] instanceof Array && array2[i] instanceof Array) {
          if (!array1[i].equals(array2[i])) {
            return false;
          }
        } else if (array1[i] !== array2[i]) {
          return false;
        }
      }
      return true;
    }

    /**
    * This method is executed when a message is intercepted in the Message Bus. The first step is the
    * assignment of the identity associated with the message. The second step is the evaluation of the
    * applicable policies in order to obtain an authorisation decision: if a policy evaluates to
    * false, then the message is unauthorised. The third step is the enforcement of the actions that
    * policies may require. Finally, the message is stamped as authorised or not and is returned to
    * the Message Bus, where it will be forwarded or blocked.
    * @param  {Message}  message
    */

  }, {
    key: 'authorise',
    value: function authorise(message) {
      var _this = this;
      return _this.context.authorise(message);
    }
  }, {
    key: 'getGroupsNames',
    value: function getGroupsNames(scope) {
      var _this = this;
      var myGroups = _this.context.groups;
      var groupsNames = [];
      if (myGroups[scope] !== {}) {
        for (var groupName in myGroups[scope]) {
          groupsNames.push(groupName);
        }
      }
      return groupsNames;
    }

    /**
    * Retrieves the group with the given group name from the PDP.
    * @param  {String}  groupName
    * @return {Array}   group
    */

  }, {
    key: 'getList',
    value: function getList(scope, groupName) {
      var _this = this;
      var myGroups = _this.context.groups;
      var members = [];
      if (myGroups[scope] !== undefined && myGroups[scope][groupName] !== undefined) {
        members = myGroups[scope][groupName];
      }
      return members;
    }

    /**
    * Creates a group with the given name.
    * @param  {String}  groupName
    */

  }, {
    key: 'createList',
    value: function createList(scope, type, groupName) {
      var _this = this;

      var myGroups = _this.context.groups;
      if (myGroups[scope] === undefined) {
        myGroups[scope] = {};
      }
      myGroups[scope][groupName] = [];

      var policy = {
        authorise: false,
        condition: type + ' in ' + groupName,
        scope: scope,
        actions: []
      };
      _this.addPolicies([policy]);

      return myGroups;
    }
  }, {
    key: 'deleteGroup',
    value: function deleteGroup(scope, groupName) {
      var _this = this;

      var myGroups = _this.context.groups;
      delete myGroups[scope][groupName];

      var myPolicies = _this.context.policies;

      var policies = myPolicies[scope];
      for (var i in policies) {
        var condition = policies[i].condition.split(' ');
        condition.shift();
        var groupInPolicy = condition.join(' ');
        if (groupInPolicy === groupName) {
          delete policies[i];
          break;
        }
      }
    }

    /**
    * Adds the given user email to the group with the given name.
    * @param  {String}  userEmail
    * @param  {String}  groupName
    */

  }, {
    key: 'addToList',
    value: function addToList(scope, type, groupName, userEmail) {
      var _this = this;

      var myGroups = _this.context.groups;
      if (myGroups[scope] === undefined) {
        myGroups[scope] = {};
      }
      if (myGroups[scope][groupName] === undefined) {
        myGroups = _this.createList(scope, type, groupName);
      }
      if (myGroups[scope][groupName].indexOf(userEmail) === -1) {
        myGroups[scope][groupName].push(userEmail);
      }
    }

    /**
    * Removes the given user email from the group with the given name.
    * @param  {String}  userEmail
    * @param  {String}  groupName
    */

  }, {
    key: 'removeFromGroup',
    value: function removeFromGroup(scope, groupName, userEmail) {
      var _this = this;

      var myGroups = _this.context.groups;
      var group = myGroups[scope][groupName];

      for (var i in group) {
        if (group[i] === userEmail) {
          group.splice(i, 1);
          break;
        }
      }
    }
  }, {
    key: 'getTimeslots',
    value: function getTimeslots() {
      var _this = this;
      var policies = _this.context.policies.user;
      var timeRestrictions = [];
      for (var i in policies) {
        if (policies[i].condition.split(' ')[0] === 'time') {
          timeRestrictions.push(policies[i].condition);
        }
      }
      return timeRestrictions;
    }
  }, {
    key: 'getTimeslotById',
    value: function getTimeslotById(condition) {
      var _this = this;
      var policies = _this.context.policies.user;
      for (var i in policies) {
        if (policies[i].condition === condition) {
          return policies[i];
        }
      }
    }
  }]);
  return PolicyEngine;
}();

exports.default = PolicyEngine;
module.exports = exports['default'];

},{"./PDP":38,"./PEP":39,"babel-runtime/helpers/classCallCheck":3,"babel-runtime/helpers/createClass":4,"babel-runtime/helpers/typeof":5}]},{},[40])(40)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmEtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmRlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZW51bS1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nZXQtbmFtZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5nbG9iYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmlzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuaXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLmxpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzLyQucmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC5zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnNoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy8kLnRvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC51aWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvJC53a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN5bWJvbC5qcyIsInNyYy9wb2xpY3kvT3BlcmF0b3JzLmpzIiwic3JjL3BvbGljeS9QRFAuanMiLCJzcmMvcG9saWN5L1BFUC5qcyIsInNyYy9wb2xpY3kvUG9saWN5RW5naW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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Q0FBYyxRQUFkLENBQXVCLElBQXRDO0FBQ0EsVUFBSSxtQkFBbUIsRUFBdkI7QUFDQSxXQUFLLElBQUksQ0FBVCxJQUFjLFFBQWQsRUFBd0I7QUFDdEIsWUFBSSxTQUFTLENBQVQsRUFBWSxTQUFaLENBQXNCLEtBQXRCLENBQTRCLEdBQTVCLEVBQWlDLENBQWpDLE1BQXdDLE1BQTVDLEVBQW9EO0FBQ2xELDJCQUFpQixJQUFqQixDQUFzQixTQUFTLENBQVQsRUFBWSxTQUFsQztBQUNEO0FBQ0Y7QUFDRCxhQUFPLGdCQUFQO0FBQ0Q7OztvQ0FFZSxTLEVBQVc7QUFDekIsVUFBSSxRQUFRLElBQVo7QUFDQSxVQUFJLFdBQVcsTUFBTSxPQUFOLENBQWMsUUFBZCxDQUF1QixJQUF0QztBQUNBLFdBQUssSUFBSSxDQUFULElBQWMsUUFBZCxFQUF3QjtBQUN0QixZQUFJLFNBQVMsQ0FBVCxFQUFZLFNBQVosS0FBMEIsU0FBOUIsRUFBeUM7QUFDdkMsaUJBQU8sU0FBUyxDQUFULENBQVA7QUFDRDtBQUNGO0FBQ0Y7Ozs7O2tCQUlZLFkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgX1N5bWJvbCA9IHJlcXVpcmUoXCJiYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sXCIpW1wiZGVmYXVsdFwiXTtcblxuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfU3ltYm9sID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlOyIsInZhciAkID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuICByZXR1cm4gJC5zZXREZXNjKGl0LCBrZXksIGRlc2MpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy8kLmNvcmUnKS5TeW1ib2w7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi8kLmlzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07IiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHt2ZXJzaW9uOiAnMS4yLjYnfTtcbmlmKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuLyQuZmFpbHMnKShmdW5jdGlvbigpe1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciAkID0gcmVxdWlyZSgnLi8kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gJC5nZXRTeW1ib2xzO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSAkLmlzRW51bVxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKWtleXMucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiBrZXlzO1xufTsiLCJ2YXIgZ2xvYmFsICAgID0gcmVxdWlyZSgnLi8kLmdsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi8kLmNvcmUnKVxuICAsIGN0eCAgICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxuICAsIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uKHR5cGUsIG5hbWUsIHNvdXJjZSl7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GXG4gICAgLCBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HXG4gICAgLCBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TXG4gICAgLCBJU19QUk9UTyAgPSB0eXBlICYgJGV4cG9ydC5QXG4gICAgLCBJU19CSU5EICAgPSB0eXBlICYgJGV4cG9ydC5CXG4gICAgLCBJU19XUkFQICAgPSB0eXBlICYgJGV4cG9ydC5XXG4gICAgLCBleHBvcnRzICAgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgQyA/IG5ldyBDKHBhcmFtKSA6IEMocGFyYW0pO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICBpZihJU19QUk9UTykoZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSkpW2tleV0gPSBvdXQ7XG4gIH1cbn07XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7IC8vIHdyYXBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi8kLnRvLWlvYmplY3QnKVxuICAsIGdldE5hbWVzICA9IHJlcXVpcmUoJy4vJCcpLmdldE5hbWVzXG4gICwgdG9TdHJpbmcgID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uKGl0KXtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ2V0TmFtZXMoaXQpO1xuICB9IGNhdGNoKGUpe1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5nZXQgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgaWYod2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScpcmV0dXJuIGdldFdpbmRvd05hbWVzKGl0KTtcbiAgcmV0dXJuIGdldE5hbWVzKHRvSU9iamVjdChpdCkpO1xufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTsiLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vJC5jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuLyQuY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24oYXJnKXtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTsiLCJ2YXIgJE9iamVjdCA9IE9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBjcmVhdGU6ICAgICAkT2JqZWN0LmNyZWF0ZSxcbiAgZ2V0UHJvdG86ICAgJE9iamVjdC5nZXRQcm90b3R5cGVPZixcbiAgaXNFbnVtOiAgICAge30ucHJvcGVydHlJc0VudW1lcmFibGUsXG4gIGdldERlc2M6ICAgICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICBzZXREZXNjOiAgICAkT2JqZWN0LmRlZmluZVByb3BlcnR5LFxuICBzZXREZXNjczogICAkT2JqZWN0LmRlZmluZVByb3BlcnRpZXMsXG4gIGdldEtleXM6ICAgICRPYmplY3Qua2V5cyxcbiAgZ2V0TmFtZXM6ICAgJE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICBnZXRTeW1ib2xzOiAkT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcbiAgZWFjaDogICAgICAgW10uZm9yRWFjaFxufTsiLCJ2YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihvYmplY3QsIGVsKXtcbiAgdmFyIE8gICAgICA9IHRvSU9iamVjdChvYmplY3QpXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGJpdG1hcCwgdmFsdWUpe1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGUgIDogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlICAgICAgIDogdmFsdWVcbiAgfTtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuaGlkZScpOyIsInZhciBkZWYgPSByZXF1aXJlKCcuLyQnKS5zZXREZXNjXG4gICwgaGFzID0gcmVxdWlyZSgnLi8kLmhhcycpXG4gICwgVEFHID0gcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJ1xuICAsIHN0b3JlICA9IGdsb2JhbFtTSEFSRURdIHx8IChnbG9iYWxbU0hBUkVEXSA9IHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB7fSk7XG59OyIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuLyQuaW9iamVjdCcpXG4gICwgZGVmaW5lZCA9IHJlcXVpcmUoJy4vJC5kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCJ2YXIgaWQgPSAwXG4gICwgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTsiLCJ2YXIgc3RvcmUgID0gcmVxdWlyZSgnLi8kLnNoYXJlZCcpKCd3a3MnKVxuICAsIHVpZCAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxuICAsIFN5bWJvbCA9IHJlcXVpcmUoJy4vJC5nbG9iYWwnKS5TeW1ib2w7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBTeW1ib2wgJiYgU3ltYm9sW25hbWVdIHx8IChTeW1ib2wgfHwgdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59OyIsIiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciAkICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXG4gICwgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuLyQuZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5oYXMnKVxuICAsIERFU0NSSVBUT1JTICAgID0gcmVxdWlyZSgnLi8kLmRlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vJC5leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi8kLnJlZGVmaW5lJylcbiAgLCAkZmFpbHMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuLyQuc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vJC5zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgdWlkICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQudWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcbiAgLCAkbmFtZXMgICAgICAgICA9IHJlcXVpcmUoJy4vJC5nZXQtbmFtZXMnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuLyQuaXMtYXJyYXknKVxuICAsIGFuT2JqZWN0ICAgICAgID0gcmVxdWlyZSgnLi8kLmFuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuLyQudG8taW9iamVjdCcpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuLyQucHJvcGVydHktZGVzYycpXG4gICwgZ2V0RGVzYyAgICAgICAgPSAkLmdldERlc2NcbiAgLCBzZXREZXNjICAgICAgICA9ICQuc2V0RGVzY1xuICAsIF9jcmVhdGUgICAgICAgID0gJC5jcmVhdGVcbiAgLCBnZXROYW1lcyAgICAgICA9ICRuYW1lcy5nZXRcbiAgLCAkU3ltYm9sICAgICAgICA9IGdsb2JhbC5TeW1ib2xcbiAgLCAkSlNPTiAgICAgICAgICA9IGdsb2JhbC5KU09OXG4gICwgX3N0cmluZ2lmeSAgICAgPSAkSlNPTiAmJiAkSlNPTi5zdHJpbmdpZnlcbiAgLCBzZXR0ZXIgICAgICAgICA9IGZhbHNlXG4gICwgSElEREVOICAgICAgICAgPSB3a3MoJ19oaWRkZW4nKVxuICAsIGlzRW51bSAgICAgICAgID0gJC5pc0VudW1cbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgdXNlTmF0aXZlICAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgT2JqZWN0UHJvdG8gICAgPSBPYmplY3QucHJvdG90eXBlO1xuXG4vLyBmYWxsYmFjayBmb3Igb2xkIEFuZHJvaWQsIGh0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvdjgvaXNzdWVzL2RldGFpbD9pZD02ODdcbnZhciBzZXRTeW1ib2xEZXNjID0gREVTQ1JJUFRPUlMgJiYgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBfY3JlYXRlKHNldERlc2Moe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIHNldERlc2ModGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ2V0RGVzYyhPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBzZXREZXNjKGl0LCBrZXksIEQpO1xuICBpZihwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKXNldERlc2MoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBzZXREZXNjO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2wucHJvdG90eXBlKTtcbiAgc3ltLl9rID0gdGFnO1xuICBERVNDUklQVE9SUyAmJiBzZXR0ZXIgJiYgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgaWYoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSl0aGlzW0hJRERFTl1bdGFnXSA9IGZhbHNlO1xuICAgICAgc2V0U3ltYm9sRGVzYyh0aGlzLCB0YWcsIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpc2V0RGVzYyhpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gc2V0RGVzYyhpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKXtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpXG4gICAgLCBpICAgID0gMFxuICAgICwgbCA9IGtleXMubGVuZ3RoXG4gICAgLCBrZXk7XG4gIHdoaWxlKGwgPiBpKSRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSl7XG4gIHZhciBFID0gaXNFbnVtLmNhbGwodGhpcywga2V5KTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XVxuICAgID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHZhciBEID0gZ2V0RGVzYyhpdCA9IHRvSU9iamVjdChpdCksIGtleSk7XG4gIGlmKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSlELmVudW1lcmFibGUgPSB0cnVlO1xuICByZXR1cm4gRDtcbn07XG52YXIgJGdldE93blByb3BlcnR5TmFtZXMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTilyZXN1bHQucHVzaChrZXkpO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSlyZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkc3RyaW5naWZ5ID0gZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gIHZhciBhcmdzID0gW2l0XVxuICAgICwgaSAgICA9IDFcbiAgICAsICQkICAgPSBhcmd1bWVudHNcbiAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gIHdoaWxlKCQkLmxlbmd0aCA+IGkpYXJncy5wdXNoKCQkW2krK10pO1xuICByZXBsYWNlciA9IGFyZ3NbMV07XG4gIGlmKHR5cGVvZiByZXBsYWNlciA9PSAnZnVuY3Rpb24nKSRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgaWYoIWlzU3ltYm9sKHZhbHVlKSlyZXR1cm4gdmFsdWU7XG4gIH07XG4gIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xufTtcbnZhciBidWdneUpTT04gPSAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoe2E6IFN9KSAhPSAne30nIHx8IF9zdHJpbmdpZnkoT2JqZWN0KFMpKSAhPSAne30nO1xufSk7XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIXVzZU5hdGl2ZSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZihpc1N5bWJvbCh0aGlzKSl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHJldHVybiB3cmFwKHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCkpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKXtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgaXNTeW1ib2wgPSBmdW5jdGlvbihpdCl7XG4gICAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbiAgfTtcblxuICAkLmNyZWF0ZSAgICAgPSAkY3JlYXRlO1xuICAkLmlzRW51bSAgICAgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gICQuZ2V0RGVzYyAgICA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICQuc2V0RGVzYyAgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgJC5zZXREZXNjcyAgID0gJGRlZmluZVByb3BlcnRpZXM7XG4gICQuZ2V0TmFtZXMgICA9ICRuYW1lcy5nZXQgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgJC5nZXRTeW1ib2xzID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi8kLmxpYnJhcnknKSl7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cbn1cblxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24oa2V5KXtcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cbiAgICAgIDogU3ltYm9sUmVnaXN0cnlba2V5XSA9ICRTeW1ib2woa2V5KTtcbiAgfSxcbiAgLy8gMTkuNC4yLjUgU3ltYm9sLmtleUZvcihzeW0pXG4gIGtleUZvcjogZnVuY3Rpb24ga2V5Rm9yKGtleSl7XG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uKCl7IHNldHRlciA9IHRydWU7IH0sXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cbn07XG4vLyAxOS40LjIuMiBTeW1ib2wuaGFzSW5zdGFuY2Vcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcbi8vIDE5LjQuMi40IFN5bWJvbC5pdGVyYXRvclxuLy8gMTkuNC4yLjYgU3ltYm9sLm1hdGNoXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxuLy8gMTkuNC4yLjkgU3ltYm9sLnNlYXJjaFxuLy8gMTkuNC4yLjEwIFN5bWJvbC5zcGVjaWVzXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XG4vLyAxOS40LjIuMTIgU3ltYm9sLnRvUHJpbWl0aXZlXG4vLyAxOS40LjIuMTMgU3ltYm9sLnRvU3RyaW5nVGFnXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXG4kLmVhY2guY2FsbCgoXG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXG4gICdzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihpdCl7XG4gIHZhciBzeW0gPSB3a3MoaXQpO1xuICBzeW1ib2xTdGF0aWNzW2l0XSA9IHVzZU5hdGl2ZSA/IHN5bSA6IHdyYXAoc3ltKTtcbn0pO1xuXG5zZXR0ZXIgPSB0cnVlO1xuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVywge1N5bWJvbDogJFN5bWJvbH0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ1N5bWJvbCcsIHN5bWJvbFN0YXRpY3MpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCF1c2VOYXRpdmUgfHwgYnVnZ3lKU09OKSwgJ0pTT04nLCB7c3RyaW5naWZ5OiAkc3RyaW5naWZ5fSk7XG5cbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiY2xhc3MgT3BlcmF0b3JzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLm9wZXJhdG9ycyA9IF90aGlzLnNldE9wZXJhdG9ycygpO1xuICB9XG5cbiAgc2V0T3BlcmF0b3JzKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG9wZXJhdG9ycyA9IHtcbiAgICAgIGJldHdlZW46IChwYXJhbXMpID0+IHsgcmV0dXJuIF90aGlzLmlzQmV0d2VlbihwYXJhbXNbMF1bMF0sIHBhcmFtc1swXVsxXSwgcGFyYW1zWzFdKTsgfSxcbiAgICAgIGluOiAocGFyYW1zKSA9PiB7IHJldHVybiBwYXJhbXNbMF0uaW5kZXhPZihwYXJhbXNbMV0pID4gLTE7IH0sXG4gICAgICBlcXVhbHM6IChwYXJhbXMpID0+IHsgcmV0dXJuIHBhcmFtc1swXVswXSA9PT0gJyonIHx8IHBhcmFtc1swXVswXSA9PT0gcGFyYW1zWzFdOyB9LFxuXG4gICAgICBvcjogKHBhcmFtcykgPT4geyByZXR1cm4gcGFyYW1zWzBdIHx8IHBhcmFtc1sxXTsgfSxcbiAgICAgIGFuZDogKHBhcmFtcykgPT4geyByZXR1cm4gcGFyYW1zWzBdICYmIHBhcmFtc1sxXTsgfSxcbiAgICAgIG5vdDogKHBhcmFtcykgPT4geyByZXR1cm4gIXBhcmFtc1swXTsgfVxuICAgIH07XG4gICAgcmV0dXJuIG9wZXJhdG9ycztcbiAgfVxuXG4gIC8qKlxuICAqIFZlcmlmaWVzIGlmIHRoZSBjdXJyZW50IHRpbWUgaXMgYmV0d2VlbiB0aGUgZ2l2ZW4gc3RhcnQgYW5kIGVuZCB0aW1lcy5cbiAgKiBAcGFyYW0ge051bWJlcn0gICAgIHN0YXJ0XG4gICogQHBhcmFtIHtOdW1iZXJ9ICAgICBlbmRcbiAgKiBAcmV0dXJuIHtCb29sZWFufSAgIGJvb2xlYW5cbiAgKi9cbiAgaXNCZXR3ZWVuKHN0YXJ0LCBlbmQsIG5vdykge1xuICAgIHN0YXJ0ID0gcGFyc2VJbnQoc3RhcnQpO1xuICAgIGVuZCA9IHBhcnNlSW50KGVuZCk7XG5cbiAgICBpZiAoZW5kIDwgc3RhcnQpIHtcbiAgICAgIG5vdyA9IChub3cgPCBzdGFydCkgPyBub3cgKz0gMjQwMCA6IG5vdztcbiAgICAgIGVuZCArPSAyNDAwO1xuICAgIH1cblxuICAgIHJldHVybiAobm93ID4gc3RhcnQgJiYgbm93IDwgZW5kKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE9wZXJhdG9ycztcbiIsImltcG9ydCBPcGVyYXRvcnMgZnJvbSAnLi9PcGVyYXRvcnMnO1xuXG4vKipcbiogVGhlIFBvbGljeSBEZWNpc2lvbiBQb2ludCAoUERQKSBkZWNpZGVzIGlmIGEgbWVzc2FnZSBpcyB0byBiZSBhdXRob3Jpc2VkIGJ5IGNoZWNraW5nIGEgc2V0IG9mXG4qIHBvbGljaWVzLiBUaGUgcmVzb3VyY2UgdG8gYmUgdmVyaWZpZWQgaXMgc3BlY2lmaWVkIGluIHRoZSBmaXJzdCB3b3JkIG9mIHRoZSAnY29uZGl0aW9uJyBmaWVsZCBvZlxuKiBhIFBvbGljeSBvYmplY3QuIFRoZSBpbXBsZW1lbnRhdGlvbiB0aGF0IHZlcmlmaWVzIGlmIHRoZSBtZXNzYWdlIGlzIGNvbXBsaWFudCB3aXRoIGEgcG9saWN5IGlzXG4qIHNwZWNpZmllZCBpbiBhIGhhc2h0YWJsZSB0byBhbGxvdyBkeW5hbWljIGRlZmluaXRpb24gb2YgdGhlIGltcGxlbWVudGF0aW9uLCBwcm92aWRpbmdcbiogZXh0ZW5zaWJpbGl0eSB0byB0aGUgUG9saWN5IEVuZ2luZSBmdW5jdGlvbmFsaXRpZXMuXG4qL1xuY2xhc3MgUERQIHtcblxuICAvKipcbiAgKiBUaGlzIG1ldGhvZCBpcyBpbnZva2VkIGJ5IHRoZSBQb2xpY3kgRW5naW5lIGFuZCBpbnN0YW50aWF0ZXMgdGhlIFBvbGljeSBEZWNpc2lvbiBQb2ludC4gSXRcbiAgKiBpbml0aWFsaXNlcyBvciBsb2FkcyBmcm9tIHRoZSBQZXJzaXN0ZW5jZSBNYW5hZ2VyIHRoZSBvYmplY3QgJ215R3JvdXBzJyB0byBzdG9yZSB0aGUgdXNlcidzXG4gICogZ3JvdXBzLlxuICAqIEBwYXJhbSAge1JlZ2lzdHJ5fSAgICBtdWNocnVudGltZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIF90aGlzLm9wZXJhdG9ycyA9IG5ldyBPcGVyYXRvcnMoY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgKiBWZXJpZmllcyBpZiB0aGUgZ2l2ZW4gbWVzc2FnZSBpcyBjb21wbGlhbnQgd2l0aCB0aGUgZ2l2ZW4gcG9saWNpZXMuIElmIG9uZSBvZiB0aGUgcG9saWNpZXNcbiAgKiBldmFsdWF0ZXMgdG8gJ2ZhbHNlJywgdGhlbiB0aGUgbWVzc2FnZSBpcyBub3QgYXV0aG9yaXNlZC4gUmV0dXJucyB0aGUgZmluYWwgYXV0aG9yaXNhdGlvblxuICAqIGRlY2lzaW9uIGFuZCBhIHNldCBvZiBhY3Rpb25zIHRoYXQgcG9saWNpZXMgbWF5IHJlcXVpcmUuXG4gICogQHBhcmFtIHtNZXNzYWdlfSAgbWVzc2FnZVxuICAqIEBwYXJhbSB7VVJMfSAgICAgIGh5cGVydHlUb1ZlcmlmeVxuICAqIEBwYXJhbSB7QXJyYXl9ICAgIHBvbGljaWVzXG4gICogQHJldHVybiB7QXJyYXl9ICAgW2F1dGhEZWNpc2lvbiwgYWN0aW9uc11cbiAgKi9cbiAgZXZhbHVhdGUobWVzc2FnZSwgcG9saWNpZXMpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCByZXN1bHRzID0gW3RydWVdO1xuICAgIGxldCBhY3Rpb25zID0gW107XG4gICAgZm9yIChsZXQgaSBpbiBwb2xpY2llcykge1xuICAgICAgbGV0IHBvbGljeSA9IHBvbGljaWVzW2ldO1xuICAgICAgbGV0IGNvbmRpdGlvbiA9IHBvbGljeS5jb25kaXRpb247XG4gICAgICBsZXQgdmVyaWZpZXNDb25kaXRpb24gPSBmYWxzZTtcbiAgICAgIGlmICh0eXBlb2YgY29uZGl0aW9uID09PSAnb2JqZWN0Jykge1xuICAgICAgICB2ZXJpZmllc0NvbmRpdGlvbiA9IF90aGlzLnZlcmlmaWVzQWR2YW5jZWRDb25kaXRpb24oY29uZGl0aW9uWzBdLCBjb25kaXRpb25bMV0sIGNvbmRpdGlvblsyXSwgcG9saWN5LnNjb3BlLCBtZXNzYWdlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZlcmlmaWVzQ29uZGl0aW9uID0gX3RoaXMudmVyaWZpZXNTaW1wbGVDb25kaXRpb24oY29uZGl0aW9uLCBwb2xpY3kuc2NvcGUsIG1lc3NhZ2UpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmVyaWZpZXNDb25kaXRpb24pIHtcbiAgICAgICAgcmVzdWx0cy5wdXNoKHBvbGljeS5hdXRob3Jpc2UpO1xuICAgICAgfVxuICAgICAgaWYgKHBvbGljeS5hY3Rpb25zICE9PSBbXSkge1xuICAgICAgICBmb3IgKGxldCBpIGluIHBvbGljeS5hY3Rpb25zKSB7XG4gICAgICAgICAgbGV0IG5ld0FjdGlvbiA9IHtcbiAgICAgICAgICAgIG1ldGhvZDogcG9saWN5LmFjdGlvbnNbaV0ubWV0aG9kLFxuICAgICAgICAgICAgcGFyYW1zOiBtZXNzYWdlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBhY3Rpb25zLnB1c2gobmV3QWN0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBhdXRoRGVjaXNpb24gPSByZXN1bHRzLmluZGV4T2YoZmFsc2UpID09PSAtMTtcbiAgICByZXR1cm4gW2F1dGhEZWNpc2lvbiwgYWN0aW9uc107XG4gIH1cblxuICB2ZXJpZmllc1NpbXBsZUNvbmRpdGlvbihjb25kaXRpb24sIHNjb3BlLCBtZXNzYWdlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgc3BsaXRDb25kaXRpb24gPSBjb25kaXRpb24uc3BsaXQoJyAnKTtcbiAgICBsZXQgdmFyaWFibGUgPSBzcGxpdENvbmRpdGlvblswXTtcbiAgICBsZXQgb3BlcmF0b3IgPSBzcGxpdENvbmRpdGlvblsxXTtcblxuICAgIGxldCBwYXJhbXM7XG4gICAgaWYgKG9wZXJhdG9yID09PSAnaW4nKSB7XG4gICAgICBfdGhpcy5jb250ZXh0Lmdyb3VwID0ge3Njb3BlOiBzY29wZSwgZ3JvdXA6IHNwbGl0Q29uZGl0aW9uWzJdLCBkZXN0aW5hdGlvbjogbWVzc2FnZS50b307XG4gICAgICBwYXJhbXMgPSBfdGhpcy5jb250ZXh0Lmdyb3VwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYXJhbXMgPSBzcGxpdENvbmRpdGlvbi5zbGljZSgyKTtcbiAgICB9XG4gICAgX3RoaXMuY29udGV4dFt2YXJpYWJsZV0gPSB7bWVzc2FnZTogbWVzc2FnZX07XG4gICAgbGV0IHZhbHVlID0gX3RoaXMuY29udGV4dFt2YXJpYWJsZV07XG4gICAgcmV0dXJuIF90aGlzLm9wZXJhdG9ycy5vcGVyYXRvcnNbb3BlcmF0b3JdKFtwYXJhbXMsIHZhbHVlXSk7XG4gIH1cblxuICB2ZXJpZmllc0FkdmFuY2VkQ29uZGl0aW9uKG9wZXJhdG9yLCBsZWZ0LCByaWdodCwgc2NvcGUsIG1lc3NhZ2UpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHdoaWxlICh0eXBlb2YgbGVmdCA9PT0gJ29iamVjdCcpIHtcbiAgICAgIGxlZnQgPSBfdGhpcy52ZXJpZmllc0FkdmFuY2VkQ29uZGl0aW9uKGxlZnRbMF0sIGxlZnRbMV0sIGxlZnRbMl0sIHNjb3BlLCBtZXNzYWdlKTtcbiAgICB9XG4gICAgaWYgKHJpZ2h0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHdoaWxlICh0eXBlb2YgcmlnaHQgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIHJpZ2h0ID0gX3RoaXMudmVyaWZpZXNBZHZhbmNlZENvbmRpdGlvbihyaWdodFswXSwgcmlnaHRbMV0sIHJpZ2h0WzJdLCBzY29wZSwgbWVzc2FnZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdExlZnQgPSAodHlwZW9mIGxlZnQgPT09ICdib29sZWFuJykgPyBsZWZ0IDogX3RoaXMudmVyaWZpZXNTaW1wbGVDb25kaXRpb24obGVmdCwgc2NvcGUsIG1lc3NhZ2UpO1xuXG4gICAgbGV0IHJlc3VsdFJpZ2h0O1xuICAgIGlmIChyaWdodCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXN1bHRSaWdodCA9ICh0eXBlb2YgcmlnaHQgPT09ICdib29sZWFuJykgPyByaWdodCA6IF90aGlzLnZlcmlmaWVzU2ltcGxlQ29uZGl0aW9uKHJpZ2h0LCBzY29wZSwgbWVzc2FnZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGlzLm9wZXJhdG9ycy5vcGVyYXRvcnNbb3BlcmF0b3JdKFtyZXN1bHRMZWZ0LCByZXN1bHRSaWdodF0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBEUDtcbiIsImNsYXNzIFBFUCB7XG5cbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIH1cblxuICBlbmZvcmNlKHJlc3VsdCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IGF1dGhEZWNpc2lvbiA9IHJlc3VsdFswXTtcbiAgICBsZXQgYWN0aW9ucyA9IHJlc3VsdFsxXTtcblxuICAgIGZvciAobGV0IGkgaW4gYWN0aW9ucykge1xuICAgICAgX3RoaXMuY29udGV4dFthY3Rpb25zW2ldLm1ldGhvZF0oYWN0aW9uc1tpXS5wYXJhbXMsIGF1dGhEZWNpc2lvbik7XG4gICAgfVxuICB9XG5cbiAgLypzZW5kQXV0b21hdGljTWVzc2FnZSgpIHt9XG5cbiAgZm9yd2FyZFRvSUQoKSB7fVxuXG4gIGZvcndhcmRUb0h5cGVydHkoKSB7fSovXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUEVQO1xuIiwiLy9qc2hpbnQgYnJvd3Nlcjp0cnVlLCBqcXVlcnk6IHRydWVcblxuLy9pbXBvcnQgcGVyc2lzdGVuY2VNYW5hZ2VyIGZyb20gJ3NlcnZpY2UtZnJhbWV3b3JrL2Rpc3QvUGVyc2lzdGVuY2VNYW5hZ2VyJztcblxuaW1wb3J0IFBFUCBmcm9tICcuL1BFUCc7XG5pbXBvcnQgUERQIGZyb20gJy4vUERQJztcblxuLyoqXG4qIFRoZSBQb2xpY3kgRW5naW5lIGludGVyY2VwdHMgYWxsIHRoZSBtZXNzYWdlcyBzZW50IHRocm91Z2ggdGhlIE1lc3NhZ2UgQnVzIGFuZCBhcHBsaWVzIHRoZVxuKiBwb2xpY2llcyBkZWZpbmVkIGJ5IHRoZSBzZXJ2aWNlIHByb3ZpZGVyIGFuZCB0aGUgdXNlci5cbiovXG5jbGFzcyBQb2xpY3lFbmdpbmUge1xuXG4gIC8qKlxuICAqIFRoaXMgbWV0aG9kIGlzIGludm9rZWQgYnkgdGhlIFJ1bnRpbWVVQSBhbmQgaW5zdGFudGlhdGVzIHRoZSBQb2xpY3kgRW5naW5lLiBBIFBvbGljeSBEZWNpc2lvblxuICAqIFBvaW50IChQRFApIGFuZCBhIFBvbGljeSBFbmZvcmNlbWVudCBQb2ludCAoUEVQKSBhcmUgaW5pdGlhbGlzZWQgZm9yIHRoZSBldmFsdWF0aW9uIG9mIHBvbGljaWVzXG4gICogYW5kIHRoZSBlbmZvcmNlbWVudCBvZiBhZGRpdGlvbmFsIGFjdGlvbnMsIHJlc3BlY3RpdmVseS5cbiAgKiBAcGFyYW0gIHtJZGVudGl0eU1vZHVsZX0gICAgaWRlbnRpdHlNb2R1bGVcbiAgKiBAcGFyYW0gIHtSZWdpc3RyeX0gICAgICAgICAgcnVudGltZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgIF90aGlzLmNvbnRleHQucGRwID0gbmV3IFBEUChjb250ZXh0KTtcbiAgICBfdGhpcy5jb250ZXh0LnBlcCA9IG5ldyBQRVAoY29udGV4dCk7XG4gIH1cblxuICAvKipcbiAgKiBBc3NvY2lhdGVzIHRoZSBnaXZlbiBwb2xpY2llcyB3aXRoIGEgc2NvcGUuIFRoZSBwb3NzaWJsZSBzY29wZXMgYXJlICdnbG9iYWwnLCAnaHlwZXJ0eScgYW5kXG4gICogJ3VzZXInLlxuICAqIEBwYXJhbSAge1BvbGljeVtdfSAgcG9saWNpZXNcbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICAgIHNjb3BlXG4gICovXG4gIGFkZFBvbGljaWVzKG5ld1BvbGljaWVzKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBteVBvbGljaWVzID0gX3RoaXMuY29udGV4dC5wb2xpY2llcztcbiAgICBpZiAobXlQb2xpY2llcyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBteVBvbGljaWVzID0ge307XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSBpbiBuZXdQb2xpY2llcykge1xuICAgICAgbGV0IG5ld1BvbGljeSA9IG5ld1BvbGljaWVzW2ldO1xuICAgICAgbGV0IHNjb3BlID0gbmV3UG9saWN5LnNjb3BlO1xuICAgICAgaWYgKG15UG9saWNpZXNbc2NvcGVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbXlQb2xpY2llc1tzY29wZV0gPSBbXTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGogaW4gbXlQb2xpY2llc1tzY29wZV0pIHtcbiAgICAgICAgbGV0IGV4aXN0aW5nUG9saWN5ID0gbXlQb2xpY2llc1tzY29wZV1bal07XG4gICAgICAgIGlmIChleGlzdGluZ1BvbGljeS5jb25kaXRpb24gPT09IG5ld1BvbGljeS5jb25kaXRpb24pIHtcbiAgICAgICAgICBfdGhpcy5yZW1vdmVQb2xpY2llcyhuZXdQb2xpY2llc1tpXS5jb25kaXRpb24pO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBteVBvbGljaWVzW3Njb3BlXS5wdXNoKG5ld1BvbGljaWVzW2ldKTtcbiAgICB9XG5cbiAgICBfdGhpcy5jb250ZXh0LnBvbGljaWVzID0gbXlQb2xpY2llcztcbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZXMgdGhlIHBvbGljeSB3aXRoIHRoZSBnaXZlbiBJRCBmcm9tIHRoZSBnaXZlbiBzY29wZS4gSWYgcG9saWN5SUQgaXMgJyonLCByZW1vdmVzIGFsbCBwb2xpY2llcyBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIHNjb3BlLlxuICAqIEBwYXJhbSAge1N0cmluZ30gIHBvbGljeUlEXG4gICogQHBhcmFtICB7U3RyaW5nfSAgc2NvcGVcbiAgKi9cbiAgcmVtb3ZlUG9saWNpZXMoc2NvcGUsIGNvbmRpdGlvbikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG15UG9saWNpZXMgPSBfdGhpcy5jb250ZXh0LnBvbGljaWVzO1xuXG4gICAgaWYgKHNjb3BlICE9PSAnKicpIHtcblxuICAgICAgaWYgKHNjb3BlIGluIG15UG9saWNpZXMpIHtcbiAgICAgICAgaWYgKGNvbmRpdGlvbiAhPT0gJyonKSB7XG4gICAgICAgICAgbGV0IHBvbGljaWVzID0gbXlQb2xpY2llc1tzY29wZV07XG4gICAgICAgICAgbGV0IHR5cGVPZkNvbmRpdGlvbiA9IHR5cGVvZiBjb25kaXRpb247XG4gICAgICAgICAgZm9yIChsZXQgaSBpbiBwb2xpY2llcykge1xuICAgICAgICAgICAgbGV0IHR5cGVPZlBvbGljeUNvbmRpdGlvbiA9IHR5cGVvZiBwb2xpY2llc1tpXS5jb25kaXRpb247XG4gICAgICAgICAgICBpZiAodHlwZU9mQ29uZGl0aW9uID09PSB0eXBlT2ZQb2xpY3lDb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgaWYgKHR5cGVPZkNvbmRpdGlvbiA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBpZiAocG9saWNpZXNbaV0uY29uZGl0aW9uID09PSBjb25kaXRpb24pIHtcbiAgICAgICAgICAgICAgICAgIHBvbGljaWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHsgLy90eXBlb2YgY29uZGl0aW9uID0gb2JqZWN0IChhZHZhbmNlZCBwb2xpY3kpXG4gICAgICAgICAgICAgICAgaWYgKF90aGlzLmFyZUVxdWFsQXJyYXlzKHBvbGljaWVzW2ldLmNvbmRpdGlvbiwgY29uZGl0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgcG9saWNpZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgbXlQb2xpY2llc1tzY29wZV07XG4gICAgICAgIH1cblxuICAgICAgICBfdGhpcy5jb250ZXh0LnBvbGljaWVzID0gbXlQb2xpY2llcztcbiAgICAgIH1cblxuICAgIH0gZWxzZSB7XG4gICAgICBfdGhpcy5jb250ZXh0LnBvbGljaWVzID0ge307XG4gICAgfVxuICB9XG5cbiAgYXJlRXF1YWxBcnJheXMoYXJyYXkxLCBhcnJheTIpIHtcbiAgICBpZiAoYXJyYXkxLmxlbmd0aCAhPT0gYXJyYXkyLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCBudW1FbGVtZW50cyA9IGFycmF5MS5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBudW1FbGVtZW50czsgaSsrKSB7XG4gICAgICBpZiAoYXJyYXkxW2ldIGluc3RhbmNlb2YgQXJyYXkgJiYgYXJyYXkyW2ldIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgaWYgKCFhcnJheTFbaV0uZXF1YWxzKGFycmF5MltpXSkpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYXJyYXkxW2ldICE9PSBhcnJheTJbaV0pIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRoaXMgbWV0aG9kIGlzIGV4ZWN1dGVkIHdoZW4gYSBtZXNzYWdlIGlzIGludGVyY2VwdGVkIGluIHRoZSBNZXNzYWdlIEJ1cy4gVGhlIGZpcnN0IHN0ZXAgaXMgdGhlXG4gICogYXNzaWdubWVudCBvZiB0aGUgaWRlbnRpdHkgYXNzb2NpYXRlZCB3aXRoIHRoZSBtZXNzYWdlLiBUaGUgc2Vjb25kIHN0ZXAgaXMgdGhlIGV2YWx1YXRpb24gb2YgdGhlXG4gICogYXBwbGljYWJsZSBwb2xpY2llcyBpbiBvcmRlciB0byBvYnRhaW4gYW4gYXV0aG9yaXNhdGlvbiBkZWNpc2lvbjogaWYgYSBwb2xpY3kgZXZhbHVhdGVzIHRvXG4gICogZmFsc2UsIHRoZW4gdGhlIG1lc3NhZ2UgaXMgdW5hdXRob3Jpc2VkLiBUaGUgdGhpcmQgc3RlcCBpcyB0aGUgZW5mb3JjZW1lbnQgb2YgdGhlIGFjdGlvbnMgdGhhdFxuICAqIHBvbGljaWVzIG1heSByZXF1aXJlLiBGaW5hbGx5LCB0aGUgbWVzc2FnZSBpcyBzdGFtcGVkIGFzIGF1dGhvcmlzZWQgb3Igbm90IGFuZCBpcyByZXR1cm5lZCB0b1xuICAqIHRoZSBNZXNzYWdlIEJ1cywgd2hlcmUgaXQgd2lsbCBiZSBmb3J3YXJkZWQgb3IgYmxvY2tlZC5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlfSAgbWVzc2FnZVxuICAqL1xuICBhdXRob3Jpc2UobWVzc2FnZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLmNvbnRleHQuYXV0aG9yaXNlKG1lc3NhZ2UpO1xuICB9XG5cbiAgZ2V0R3JvdXBzTmFtZXMoc2NvcGUpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBteUdyb3VwcyA9IF90aGlzLmNvbnRleHQuZ3JvdXBzO1xuICAgIGxldCBncm91cHNOYW1lcyA9IFtdO1xuICAgIGlmIChteUdyb3Vwc1tzY29wZV0gIT09IHt9KSB7XG4gICAgICBmb3IgKGxldCBncm91cE5hbWUgaW4gbXlHcm91cHNbc2NvcGVdKSB7XG4gICAgICAgIGdyb3Vwc05hbWVzLnB1c2goZ3JvdXBOYW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGdyb3Vwc05hbWVzO1xuICB9XG5cbiAgLyoqXG4gICogUmV0cmlldmVzIHRoZSBncm91cCB3aXRoIHRoZSBnaXZlbiBncm91cCBuYW1lIGZyb20gdGhlIFBEUC5cbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICBncm91cE5hbWVcbiAgKiBAcmV0dXJuIHtBcnJheX0gICBncm91cFxuICAqL1xuICBnZXRMaXN0KHNjb3BlLCBncm91cE5hbWUpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBteUdyb3VwcyA9IF90aGlzLmNvbnRleHQuZ3JvdXBzO1xuICAgIGxldCBtZW1iZXJzID0gW107XG4gICAgaWYgKG15R3JvdXBzW3Njb3BlXSAhPT0gdW5kZWZpbmVkICYmIG15R3JvdXBzW3Njb3BlXVtncm91cE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG1lbWJlcnMgPSBteUdyb3Vwc1tzY29wZV1bZ3JvdXBOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbWJlcnM7XG4gIH1cblxuICAvKipcbiAgKiBDcmVhdGVzIGEgZ3JvdXAgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICBncm91cE5hbWVcbiAgKi9cbiAgY3JlYXRlTGlzdChzY29wZSwgdHlwZSwgZ3JvdXBOYW1lKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBteUdyb3VwcyA9IF90aGlzLmNvbnRleHQuZ3JvdXBzO1xuICAgIGlmIChteUdyb3Vwc1tzY29wZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbXlHcm91cHNbc2NvcGVdID0ge307XG4gICAgfVxuICAgIG15R3JvdXBzW3Njb3BlXVtncm91cE5hbWVdID0gW107XG5cbiAgICBsZXQgcG9saWN5ID0ge1xuICAgICAgYXV0aG9yaXNlOiBmYWxzZSxcbiAgICAgIGNvbmRpdGlvbjogdHlwZSArICcgaW4gJyArIGdyb3VwTmFtZSxcbiAgICAgIHNjb3BlOiBzY29wZSxcbiAgICAgIGFjdGlvbnM6IFtdXG4gICAgfTtcbiAgICBfdGhpcy5hZGRQb2xpY2llcyhbcG9saWN5XSk7XG5cbiAgICByZXR1cm4gbXlHcm91cHM7XG4gIH1cblxuICBkZWxldGVHcm91cChzY29wZSwgZ3JvdXBOYW1lKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGxldCBteUdyb3VwcyA9IF90aGlzLmNvbnRleHQuZ3JvdXBzO1xuICAgIGRlbGV0ZSBteUdyb3Vwc1tzY29wZV1bZ3JvdXBOYW1lXTtcblxuICAgIGxldCBteVBvbGljaWVzID0gX3RoaXMuY29udGV4dC5wb2xpY2llcztcblxuICAgIGxldCBwb2xpY2llcyA9IG15UG9saWNpZXNbc2NvcGVdO1xuICAgIGZvciAobGV0IGkgaW4gcG9saWNpZXMpIHtcbiAgICAgIGxldCBjb25kaXRpb24gPSBwb2xpY2llc1tpXS5jb25kaXRpb24uc3BsaXQoJyAnKTtcbiAgICAgIGNvbmRpdGlvbi5zaGlmdCgpO1xuICAgICAgbGV0IGdyb3VwSW5Qb2xpY3kgPSBjb25kaXRpb24uam9pbignICcpO1xuICAgICAgaWYgKGdyb3VwSW5Qb2xpY3kgPT09IGdyb3VwTmFtZSkge1xuICAgICAgICBkZWxldGUgcG9saWNpZXNbaV07XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAqIEFkZHMgdGhlIGdpdmVuIHVzZXIgZW1haWwgdG8gdGhlIGdyb3VwIHdpdGggdGhlIGdpdmVuIG5hbWUuXG4gICogQHBhcmFtICB7U3RyaW5nfSAgdXNlckVtYWlsXG4gICogQHBhcmFtICB7U3RyaW5nfSAgZ3JvdXBOYW1lXG4gICovXG4gIGFkZFRvTGlzdChzY29wZSwgdHlwZSwgZ3JvdXBOYW1lLCB1c2VyRW1haWwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IG15R3JvdXBzID0gX3RoaXMuY29udGV4dC5ncm91cHM7XG4gICAgaWYgKG15R3JvdXBzW3Njb3BlXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBteUdyb3Vwc1tzY29wZV0gPSB7fTtcbiAgICB9XG4gICAgaWYgKG15R3JvdXBzW3Njb3BlXVtncm91cE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG15R3JvdXBzID0gX3RoaXMuY3JlYXRlTGlzdChzY29wZSwgdHlwZSwgZ3JvdXBOYW1lKTtcbiAgICB9XG4gICAgaWYgKG15R3JvdXBzW3Njb3BlXVtncm91cE5hbWVdLmluZGV4T2YodXNlckVtYWlsKSA9PT0gLTEpIHtcbiAgICAgIG15R3JvdXBzW3Njb3BlXVtncm91cE5hbWVdLnB1c2godXNlckVtYWlsKTtcbiAgICB9XG5cbiAgfVxuXG4gIC8qKlxuICAqIFJlbW92ZXMgdGhlIGdpdmVuIHVzZXIgZW1haWwgZnJvbSB0aGUgZ3JvdXAgd2l0aCB0aGUgZ2l2ZW4gbmFtZS5cbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICB1c2VyRW1haWxcbiAgKiBAcGFyYW0gIHtTdHJpbmd9ICBncm91cE5hbWVcbiAgKi9cbiAgcmVtb3ZlRnJvbUdyb3VwKHNjb3BlLCBncm91cE5hbWUsIHVzZXJFbWFpbCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgbXlHcm91cHMgPSBfdGhpcy5jb250ZXh0Lmdyb3VwcztcbiAgICBsZXQgZ3JvdXAgPSBteUdyb3Vwc1tzY29wZV1bZ3JvdXBOYW1lXTtcblxuICAgIGZvciAobGV0IGkgaW4gZ3JvdXApIHtcbiAgICAgIGlmIChncm91cFtpXSA9PT0gdXNlckVtYWlsKSB7XG4gICAgICAgIGdyb3VwLnNwbGljZShpLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0VGltZXNsb3RzKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHBvbGljaWVzID0gX3RoaXMuY29udGV4dC5wb2xpY2llcy51c2VyO1xuICAgIGxldCB0aW1lUmVzdHJpY3Rpb25zID0gW107XG4gICAgZm9yIChsZXQgaSBpbiBwb2xpY2llcykge1xuICAgICAgaWYgKHBvbGljaWVzW2ldLmNvbmRpdGlvbi5zcGxpdCgnICcpWzBdID09PSAndGltZScpIHtcbiAgICAgICAgdGltZVJlc3RyaWN0aW9ucy5wdXNoKHBvbGljaWVzW2ldLmNvbmRpdGlvbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aW1lUmVzdHJpY3Rpb25zO1xuICB9XG5cbiAgZ2V0VGltZXNsb3RCeUlkKGNvbmRpdGlvbikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IHBvbGljaWVzID0gX3RoaXMuY29udGV4dC5wb2xpY2llcy51c2VyO1xuICAgIGZvciAobGV0IGkgaW4gcG9saWNpZXMpIHtcbiAgICAgIGlmIChwb2xpY2llc1tpXS5jb25kaXRpb24gPT09IGNvbmRpdGlvbikge1xuICAgICAgICByZXR1cm4gcG9saWNpZXNbaV07XG4gICAgICB9XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUG9saWN5RW5naW5lO1xuIl19
