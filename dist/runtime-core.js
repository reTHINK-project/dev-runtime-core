// Runtime User Agent 

// version: 0.2.0

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.runtimeCore = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = setTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    clearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        setTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
/*! hellojs v1.9.8 | (c) 2012-2015 Andrew Dodson | MIT https://adodson.com/hello.js/LICENSE */
// ES5 Object.create
if (!Object.create) {

	// Shim, Object create
	// A shim for Object.create(), it adds a prototype to a new object
	Object.create = (function() {

		function F() {}

		return function(o) {

			if (arguments.length != 1) {
				throw new Error('Object.create implementation only accepts one parameter.');
			}

			F.prototype = o;
			return new F();
		};

	})();

}

// ES5 Object.keys
if (!Object.keys) {
	Object.keys = function(o, k, r) {
		r = [];
		for (k in o) {
			if (r.hasOwnProperty.call(o, k))
				r.push(k);
		}

		return r;
	};
}

// ES5 [].indexOf
if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(s) {

		for (var j = 0; j < this.length; j++) {
			if (this[j] === s) {
				return j;
			}
		}

		return -1;
	};
}

// ES5 [].forEach
if (!Array.prototype.forEach) {
	Array.prototype.forEach = function(fun/*, thisArg*/) {

		if (this === void 0 || this === null) {
			throw new TypeError();
		}

		var t = Object(this);
		var len = t.length >>> 0;
		if (typeof fun !== 'function') {
			throw new TypeError();
		}

		var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
		for (var i = 0; i < len; i++) {
			if (i in t) {
				fun.call(thisArg, t[i], i, t);
			}
		}

		return this;
	};
}

// ES5 [].filter
if (!Array.prototype.filter) {
	Array.prototype.filter = function(fun, thisArg) {

		var a = [];
		this.forEach(function(val, i, t) {
			if (fun.call(thisArg || void 0, val, i, t)) {
				a.push(val);
			}
		});

		return a;
	};
}

// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

	Array.prototype.map = function(fun, thisArg) {

		var a = [];
		this.forEach(function(val, i, t) {
			a.push(fun.call(thisArg || void 0, val, i, t));
		});

		return a;
	};
}

// ES5 isArray
if (!Array.isArray) {

	// Function Array.isArray
	Array.isArray = function(o) {
		return Object.prototype.toString.call(o) === '[object Array]';
	};

}

// Test for location.assign
if (typeof window === 'object' && typeof window.location === 'object' && !window.location.assign) {

	window.location.assign = function(url) {
		window.location = url;
	};

}

// Test for Function.bind
if (!Function.prototype.bind) {

	// MDN
	// Polyfill IE8, does not support native Function.bind
	Function.prototype.bind = function(b) {

		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}

		function C() {}

		var a = [].slice;
		var f = a.call(arguments, 1);
		var _this = this;
		var D = function() {
			return _this.apply(this instanceof C ? this : b || window, f.concat(a.call(arguments)));
		};

		C.prototype = this.prototype;
		D.prototype = new C();

		return D;
	};

}

/**
 * @hello.js
 *
 * HelloJS is a client side Javascript SDK for making OAuth2 logins and subsequent REST calls.
 *
 * @author Andrew Dodson
 * @website https://adodson.com/hello.js/
 *
 * @copyright Andrew Dodson, 2012 - 2015
 * @license MIT: You are free to use and modify this code for any use, on the condition that this copyright notice remains.
 */

var hello = function(name) {
	return hello.use(name);
};

hello.utils = {

	// Extend the first object with the properties and methods of the second
	extend: function(r /*, a[, b[, ...]] */) {

		// Get the arguments as an array but ommit the initial item
		Array.prototype.slice.call(arguments, 1).forEach(function(a) {
			if (r instanceof Object && a instanceof Object && r !== a) {
				for (var x in a) {
					r[x] = hello.utils.extend(r[x], a[x]);
				}
			}
			else {
				r = a;
			}
		});

		return r;
	}
};

// Core library
hello.utils.extend(hello, {

	settings: {

		// OAuth2 authentication defaults
		redirect_uri: window.location.href.split('#')[0],
		response_type: 'token',
		display: 'popup',
		state: '',

		// OAuth1 shim
		// The path to the OAuth1 server for signing user requests
		// Want to recreate your own? Checkout https://github.com/MrSwitch/node-oauth-shim
		oauth_proxy: 'https://auth-server.herokuapp.com/proxy',

		// API timeout in milliseconds
		timeout: 20000,

		// Popup Options
		popup: {
			resizable: 1,
			scrollbars: 1,
			width: 500,
			height: 550
		},

		// Default service / network
		default_service: null,

		// Force authentication
		// When hello.login is fired.
		// (null): ignore current session expiry and continue with login
		// (true): ignore current session expiry and continue with login, ask for user to reauthenticate
		// (false): if the current session looks good for the request scopes return the current session.
		force: null,

		// Page URL
		// When 'display=page' this property defines where the users page should end up after redirect_uri
		// Ths could be problematic if the redirect_uri is indeed the final place,
		// Typically this circumvents the problem of the redirect_url being a dumb relay page.
		page_uri: window.location.href
	},

	// Service configuration objects
	services: {},

	// Use
	// Define a new instance of the HelloJS library with a default service
	use: function(service) {

		// Create self, which inherits from its parent
		var self = Object.create(this);

		// Inherit the prototype from its parent
		self.settings = Object.create(this.settings);

		// Define the default service
		if (service) {
			self.settings.default_service = service;
		}

		// Create an instance of Events
		self.utils.Event.call(self);

		return self;
	},

	// Initialize
	// Define the client_ids for the endpoint services
	// @param object o, contains a key value pair, service => clientId
	// @param object opts, contains a key value pair of options used for defining the authentication defaults
	// @param number timeout, timeout in seconds
	init: function(services, options) {

		var utils = this.utils;

		if (!services) {
			return this.services;
		}

		// Define provider credentials
		// Reformat the ID field
		for (var x in services) {if (services.hasOwnProperty(x)) {
			if (typeof (services[x]) !== 'object') {
				services[x] = {id: services[x]};
			}
		}}

		// Merge services if there already exists some
		utils.extend(this.services, services);

		// Format the incoming
		for (x in this.services) {
			if (this.services.hasOwnProperty(x)) {
				this.services[x].scope = this.services[x].scope || {};
			}
		}

		//
		// Update the default settings with this one.
		if (options) {
			utils.extend(this.settings, options);

			// Do this immediatly incase the browser changes the current path.
			if ('redirect_uri' in options) {
				this.settings.redirect_uri = utils.url(options.redirect_uri).href;
			}
		}

		return this;
	},

	// Login
	// Using the endpoint
	// @param network stringify       name to connect to
	// @param options object    (optional)  {display mode, is either none|popup(default)|page, scope: email,birthday,publish, .. }
	// @param callback  function  (optional)  fired on signin
	login: function() {

		// Create an object which inherits its parent as the prototype and constructs a new event chain.
		var _this = this;
		var utils = _this.utils;
		var error = utils.error;
		var promise = utils.Promise();

		// Get parameters
		var p = utils.args({network: 's', options: 'o', callback: 'f'}, arguments);

		// Local vars
		var url;

		// Get all the custom options and store to be appended to the querystring
		var qs = utils.diffKey(p.options, _this.settings);

		// Merge/override options with app defaults
		var opts = p.options = utils.merge(_this.settings, p.options || {});

		// Merge/override options with app defaults
		opts.popup = utils.merge(_this.settings.popup, p.options.popup || {});

		// Network
		p.network = p.network || _this.settings.default_service;

		// Bind callback to both reject and fulfill states
		promise.proxy.then(p.callback, p.callback);

		// Trigger an event on the global listener
		function emit(s, value) {
			hello.emit(s, value);
		}

		promise.proxy.then(emit.bind(this, 'auth.login auth'), emit.bind(this, 'auth.failed auth'));

		// Is our service valid?
		if (typeof (p.network) !== 'string' || !(p.network in _this.services)) {
			// Trigger the default login.
			// Ahh we dont have one.
			return promise.reject(error('invalid_network', 'The provided network was not recognized'));
		}

		var provider = _this.services[p.network];

		// Create a global listener to capture events triggered out of scope
		var callbackId = utils.globalEvent(function(str) {

			// The responseHandler returns a string, lets save this locally
			var obj;

			if (str) {
				obj = JSON.parse(str);
			}
			else {
				obj = error('cancelled', 'The authentication was not completed');
			}

			// Handle these response using the local
			// Trigger on the parent
			if (!obj.error) {

				// Save on the parent window the new credentials
				// This fixes an IE10 bug i think... atleast it does for me.
				utils.store(obj.network, obj);

				// Fulfill a successful login
				promise.fulfill({
					network: obj.network,
					authResponse: obj
				});
			}
			else {
				// Reject a successful login
				promise.reject(obj);
			}
		});

		var redirectUri = utils.url(opts.redirect_uri).href;

		// May be a space-delimited list of multiple, complementary types
		var responseType = provider.oauth.response_type || opts.response_type;

		// Fallback to token if the module hasn't defined a grant url
		if (/\bcode\b/.test(responseType) && !provider.oauth.grant) {
			responseType = responseType.replace(/\bcode\b/, 'token');
		}

		// Query string parameters, we may pass our own arguments to form the querystring
		p.qs = utils.merge(qs, {
			client_id: encodeURIComponent(provider.id),
			response_type: encodeURIComponent(responseType),
			redirect_uri: encodeURIComponent(redirectUri),
			display: opts.display,
			scope: 'basic',
			state: {
				client_id: provider.id,
				network: p.network,
				display: opts.display,
				callback: callbackId,
				state: opts.state,
				redirect_uri: redirectUri
			}
		});

		// Get current session for merging scopes, and for quick auth response
		var session = utils.store(p.network);

		// Scopes (authentication permisions)
		// Ensure this is a string - IE has a problem moving Arrays between windows
		// Append the setup scope
		var SCOPE_SPLIT = /[,\s]+/;
		var scope = (opts.scope || '').toString() + ',' + p.qs.scope;

		// Append scopes from a previous session.
		// This helps keep app credentials constant,
		// Avoiding having to keep tabs on what scopes are authorized
		if (session && 'scope' in session && session.scope instanceof String) {
			scope += ',' + session.scope;
		}

		// Convert scope to an Array
		// - easier to manipulate
		scope = scope.split(SCOPE_SPLIT);

		// Format remove duplicates and empty values
		scope = utils.unique(scope).filter(filterEmpty);

		// Save the the scopes to the state with the names that they were requested with.
		p.qs.state.scope = scope.join(',');

		// Map scopes to the providers naming convention
		scope = scope.map(function(item) {
			// Does this have a mapping?
			if (item in provider.scope) {
				return provider.scope[item];
			}
			else {
				// Loop through all services and determine whether the scope is generic
				for (var x in _this.services) {
					var serviceScopes = _this.services[x].scope;
					if (serviceScopes && item in serviceScopes) {
						// Found an instance of this scope, so lets not assume its special
						return '';
					}
				}

				// This is a unique scope to this service so lets in it.
				return item;
			}

		});

		// Stringify and Arrayify so that double mapped scopes are given the chance to be formatted
		scope = scope.join(',').split(SCOPE_SPLIT);

		// Again...
		// Format remove duplicates and empty values
		scope = utils.unique(scope).filter(filterEmpty);

		// Join with the expected scope delimiter into a string
		p.qs.scope = scope.join(provider.scope_delim || ',');

		// Is the user already signed in with the appropriate scopes, valid access_token?
		if (opts.force === false) {

			if (session && 'access_token' in session && session.access_token && 'expires' in session && session.expires > ((new Date()).getTime() / 1e3)) {
				// What is different about the scopes in the session vs the scopes in the new login?
				var diff = utils.diff((session.scope || '').split(SCOPE_SPLIT), (p.qs.state.scope || '').split(SCOPE_SPLIT));
				if (diff.length === 0) {

					// OK trigger the callback
					promise.fulfill({
						unchanged: true,
						network: p.network,
						authResponse: session
					});

					// Nothing has changed
					return promise;
				}
			}
		}

		// Page URL
		if (opts.display === 'page' && opts.page_uri) {
			// Add a page location, place to endup after session has authenticated
			p.qs.state.page_uri = utils.url(opts.page_uri).href;
		}

		// Bespoke
		// Override login querystrings from auth_options
		if ('login' in provider && typeof (provider.login) === 'function') {
			// Format the paramaters according to the providers formatting function
			provider.login(p);
		}

		// Add OAuth to state
		// Where the service is going to take advantage of the oauth_proxy
		if (!/\btoken\b/.test(responseType) ||
		parseInt(provider.oauth.version, 10) < 2 ||
		(opts.display === 'none' && provider.oauth.grant && session && session.refresh_token)) {

			// Add the oauth endpoints
			p.qs.state.oauth = provider.oauth;

			// Add the proxy url
			p.qs.state.oauth_proxy = opts.oauth_proxy;

		}

		// Convert state to a string
		p.qs.state = encodeURIComponent(JSON.stringify(p.qs.state));

		// URL
		if (parseInt(provider.oauth.version, 10) === 1) {

			// Turn the request to the OAuth Proxy for 3-legged auth
			url = utils.qs(opts.oauth_proxy, p.qs, encodeFunction);
		}

		// Refresh token
		else if (opts.display === 'none' && provider.oauth.grant && session && session.refresh_token) {

			// Add the refresh_token to the request
			p.qs.refresh_token = session.refresh_token;

			// Define the request path
			url = utils.qs(opts.oauth_proxy, p.qs, encodeFunction);
		}
		else {
			url = utils.qs(provider.oauth.auth, p.qs, encodeFunction);
		}

		// Execute
		// Trigger how we want self displayed
		if (opts.display === 'none') {
			// Sign-in in the background, iframe
			utils.iframe(url, redirectUri);
		}

		// Triggering popup?
		else if (opts.display === 'popup') {

			var popup = utils.popup(url, redirectUri, opts.popup);

			var timer = setInterval(function() {
				if (!popup || popup.closed) {
					clearInterval(timer);
					if (!promise.state) {

						var response = error('cancelled', 'Login has been cancelled');

						if (!popup) {
							response = error('blocked', 'Popup was blocked');
						}

						response.network = p.network;

						promise.reject(response);
					}
				}
			}, 100);
		}

		else {
			window.location = url;
		}

		return promise.proxy;

		function encodeFunction(s) {return s;}

		function filterEmpty(s) {return !!s;}
	},

	// Remove any data associated with a given service
	// @param string name of the service
	// @param function callback
	logout: function() {

		var _this = this;
		var utils = _this.utils;
		var error = utils.error;

		// Create a new promise
		var promise = utils.Promise();

		var p = utils.args({name:'s', options: 'o', callback: 'f'}, arguments);

		p.options = p.options || {};

		// Add callback to events
		promise.proxy.then(p.callback, p.callback);

		// Trigger an event on the global listener
		function emit(s, value) {
			hello.emit(s, value);
		}

		promise.proxy.then(emit.bind(this, 'auth.logout auth'), emit.bind(this, 'error'));

		// Network
		p.name = p.name || this.settings.default_service;
		p.authResponse = utils.store(p.name);

		if (p.name && !(p.name in _this.services)) {

			promise.reject(error('invalid_network', 'The network was unrecognized'));

		}
		else if (p.name && p.authResponse) {

			// Define the callback
			var callback = function(opts) {

				// Remove from the store
				utils.store(p.name, '');

				// Emit events by default
				promise.fulfill(hello.utils.merge({network:p.name}, opts || {}));
			};

			// Run an async operation to remove the users session
			var _opts = {};
			if (p.options.force) {
				var logout = _this.services[p.name].logout;
				if (logout) {
					// Convert logout to URL string,
					// If no string is returned, then this function will handle the logout async style
					if (typeof (logout) === 'function') {
						logout = logout(callback, p);
					}

					// If logout is a string then assume URL and open in iframe.
					if (typeof (logout) === 'string') {
						utils.iframe(logout);
						_opts.force = null;
						_opts.message = 'Logout success on providers site was indeterminate';
					}
					else if (logout === undefined) {
						// The callback function will handle the response.
						return promise.proxy;
					}
				}
			}

			// Remove local credentials
			callback(_opts);
		}
		else {
			promise.reject(error('invalid_session', 'There was no session to remove'));
		}

		return promise.proxy;
	},

	// Returns all the sessions that are subscribed too
	// @param string optional, name of the service to get information about.
	getAuthResponse: function(service) {

		// If the service doesn't exist
		service = service || this.settings.default_service;

		if (!service || !(service in this.services)) {
			return null;
		}

		return this.utils.store(service) || null;
	},

	// Events: placeholder for the events
	events: {}
});

// Core utilities
hello.utils.extend(hello.utils, {

	// Error
	error: function(code, message) {
		return {
			error: {
				code: code,
				message: message
			}
		};
	},

	// Append the querystring to a url
	// @param string url
	// @param object parameters
	qs: function(url, params, formatFunction) {

		if (params) {

			// Set default formatting function
			formatFunction = formatFunction || encodeURIComponent;

			// Override the items in the URL which already exist
			for (var x in params) {
				var str = '([\\?\\&])' + x + '=[^\\&]*';
				var reg = new RegExp(str);
				if (url.match(reg)) {
					url = url.replace(reg, '$1' + x + '=' + formatFunction(params[x]));
					delete params[x];
				}
			}
		}

		if (!this.isEmpty(params)) {
			return url + (url.indexOf('?') > -1 ? '&' : '?') + this.param(params, formatFunction);
		}

		return url;
	},

	// Param
	// Explode/encode the parameters of an URL string/object
	// @param string s, string to decode
	param: function(s, formatFunction) {
		var b;
		var a = {};
		var m;

		if (typeof (s) === 'string') {

			formatFunction = formatFunction || decodeURIComponent;

			m = s.replace(/^[\#\?]/, '').match(/([^=\/\&]+)=([^\&]+)/g);
			if (m) {
				for (var i = 0; i < m.length; i++) {
					b = m[i].match(/([^=]+)=(.*)/);
					a[b[1]] = formatFunction(b[2]);
				}
			}

			return a;
		}
		else {

			formatFunction = formatFunction || encodeURIComponent;

			var o = s;

			a = [];

			for (var x in o) {if (o.hasOwnProperty(x)) {
				if (o.hasOwnProperty(x)) {
					a.push([x, o[x] === '?' ? '?' : formatFunction(o[x])].join('='));
				}
			}}

			return a.join('&');
		}
	},

	// Local storage facade
	store: (function() {

		var a = ['localStorage', 'sessionStorage'];
		var i = -1;
		var prefix = 'test';

		// Set LocalStorage
		var localStorage;

		while (a[++i]) {
			try {
				// In Chrome with cookies blocked, calling localStorage throws an error
				localStorage = window[a[i]];
				localStorage.setItem(prefix + i, i);
				localStorage.removeItem(prefix + i);
				break;
			}
			catch (e) {
				localStorage = null;
			}
		}

		if (!localStorage) {

			var cache = null;

			localStorage = {
				getItem: function(prop) {
					prop = prop + '=';
					var m = document.cookie.split(';');
					for (var i = 0; i < m.length; i++) {
						var _m = m[i].replace(/(^\s+|\s+$)/, '');
						if (_m && _m.indexOf(prop) === 0) {
							return _m.substr(prop.length);
						}
					}

					return cache;
				},

				setItem: function(prop, value) {
					cache = value;
					document.cookie = prop + '=' + value;
				}
			};

			// Fill the cache up
			cache = localStorage.getItem('hello');
		}

		function get() {
			var json = {};
			try {
				json = JSON.parse(localStorage.getItem('hello')) || {};
			}
			catch (e) {}

			return json;
		}

		function set(json) {
			localStorage.setItem('hello', JSON.stringify(json));
		}

		// Check if the browser support local storage
		return function(name, value, days) {

			// Local storage
			var json = get();

			if (name && value === undefined) {
				return json[name] || null;
			}
			else if (name && value === null) {
				try {
					delete json[name];
				}
				catch (e) {
					json[name] = null;
				}
			}
			else if (name) {
				json[name] = value;
			}
			else {
				return json;
			}

			set(json);

			return json || null;
		};

	})(),

	// Create and Append new DOM elements
	// @param node string
	// @param attr object literal
	// @param dom/string
	append: function(node, attr, target) {

		var n = typeof (node) === 'string' ? document.createElement(node) : node;

		if (typeof (attr) === 'object') {
			if ('tagName' in attr) {
				target = attr;
			}
			else {
				for (var x in attr) {if (attr.hasOwnProperty(x)) {
					if (typeof (attr[x]) === 'object') {
						for (var y in attr[x]) {if (attr[x].hasOwnProperty(y)) {
							n[x][y] = attr[x][y];
						}}
					}
					else if (x === 'html') {
						n.innerHTML = attr[x];
					}

					// IE doesn't like us setting methods with setAttribute
					else if (!/^on/.test(x)) {
						n.setAttribute(x, attr[x]);
					}
					else {
						n[x] = attr[x];
					}
				}}
			}
		}

		if (target === 'body') {
			(function self() {
				if (document.body) {
					document.body.appendChild(n);
				}
				else {
					setTimeout(self, 16);
				}
			})();
		}
		else if (typeof (target) === 'object') {
			target.appendChild(n);
		}
		else if (typeof (target) === 'string') {
			document.getElementsByTagName(target)[0].appendChild(n);
		}

		return n;
	},

	// An easy way to create a hidden iframe
	// @param string src
	iframe: function(src) {
		this.append('iframe', {src: src, style: {position:'absolute', left: '-1000px', bottom: 0, height: '1px', width: '1px'}}, 'body');
	},

	// Recursive merge two objects into one, second parameter overides the first
	// @param a array
	merge: function(/* Args: a, b, c, .. n */) {
		var args = Array.prototype.slice.call(arguments);
		args.unshift({});
		return this.extend.apply(null, args);
	},

	// Makes it easier to assign parameters, where some are optional
	// @param o object
	// @param a arguments
	args: function(o, args) {

		var p = {};
		var i = 0;
		var t = null;
		var x = null;

		// 'x' is the first key in the list of object parameters
		for (x in o) {if (o.hasOwnProperty(x)) {
			break;
		}}

		// Passing in hash object of arguments?
		// Where the first argument can't be an object
		if ((args.length === 1) && (typeof (args[0]) === 'object') && o[x] != 'o!') {

			// Could this object still belong to a property?
			// Check the object keys if they match any of the property keys
			for (x in args[0]) {if (o.hasOwnProperty(x)) {
				// Does this key exist in the property list?
				if (x in o) {
					// Yes this key does exist so its most likely this function has been invoked with an object parameter
					// Return first argument as the hash of all arguments
					return args[0];
				}
			}}
		}

		// Else loop through and account for the missing ones.
		for (x in o) {if (o.hasOwnProperty(x)) {

			t = typeof (args[i]);

			if ((typeof (o[x]) === 'function' && o[x].test(args[i])) || (typeof (o[x]) === 'string' && (
			(o[x].indexOf('s') > -1 && t === 'string') ||
			(o[x].indexOf('o') > -1 && t === 'object') ||
			(o[x].indexOf('i') > -1 && t === 'number') ||
			(o[x].indexOf('a') > -1 && t === 'object') ||
			(o[x].indexOf('f') > -1 && t === 'function')
			))
			) {
				p[x] = args[i++];
			}

			else if (typeof (o[x]) === 'string' && o[x].indexOf('!') > -1) {
				return false;
			}
		}}

		return p;
	},

	// Returns a URL instance
	url: function(path) {

		// If the path is empty
		if (!path) {
			return window.location;
		}

		// Chrome and FireFox support new URL() to extract URL objects
		else if (window.URL && URL instanceof Function && URL.length !== 0) {
			return new URL(path, window.location);
		}

		// Ugly shim, it works!
		else {
			var a = document.createElement('a');
			a.href = path;
			return a.cloneNode(false);
		}
	},

	diff: function(a, b) {
		return b.filter(function(item) {
			return a.indexOf(item) === -1;
		});
	},

	// Get the different hash of properties unique to `a`, and not in `b`
	diffKey: function(a, b) {
		if (a || !b) {
			var r = {};
			for (var x in a) {
				// Does the property not exist?
				if (!(x in b)) {
					r[x] = a[x];
				}
			}

			return r;
		}

		return a;
	},

	// Unique
	// Remove duplicate and null values from an array
	// @param a array
	unique: function(a) {
		if (!Array.isArray(a)) { return []; }

		return a.filter(function(item, index) {
			// Is this the first location of item
			return a.indexOf(item) === index;
		});
	},

	isEmpty: function(obj) {

		// Scalar
		if (!obj)
			return true;

		// Array
		if (Array.isArray(obj)) {
			return !obj.length;
		}
		else if (typeof (obj) === 'object') {
			// Object
			for (var key in obj) {
				if (obj.hasOwnProperty(key)) {
					return false;
				}
			}
		}

		return true;
	},

	//jscs:disable

	/*!
	 **  Thenable -- Embeddable Minimum Strictly-Compliant Promises/A+ 1.1.1 Thenable
	 **  Copyright (c) 2013-2014 Ralf S. Engelschall <http://engelschall.com>
	 **  Licensed under The MIT License <http://opensource.org/licenses/MIT>
	 **  Source-Code distributed on <http://github.com/rse/thenable>
	 */
	Promise: (function(){
		/*  promise states [Promises/A+ 2.1]  */
		var STATE_PENDING   = 0;                                         /*  [Promises/A+ 2.1.1]  */
		var STATE_FULFILLED = 1;                                         /*  [Promises/A+ 2.1.2]  */
		var STATE_REJECTED  = 2;                                         /*  [Promises/A+ 2.1.3]  */

		/*  promise object constructor  */
		var api = function (executor) {
			/*  optionally support non-constructor/plain-function call  */
			if (!(this instanceof api))
				return new api(executor);

			/*  initialize object  */
			this.id           = "Thenable/1.0.6";
			this.state        = STATE_PENDING; /*  initial state  */
			this.fulfillValue = undefined;     /*  initial value  */     /*  [Promises/A+ 1.3, 2.1.2.2]  */
			this.rejectReason = undefined;     /*  initial reason */     /*  [Promises/A+ 1.5, 2.1.3.2]  */
			this.onFulfilled  = [];            /*  initial handlers  */
			this.onRejected   = [];            /*  initial handlers  */

			/*  provide optional information-hiding proxy  */
			this.proxy = {
				then: this.then.bind(this)
			};

			/*  support optional executor function  */
			if (typeof executor === "function")
				executor.call(this, this.fulfill.bind(this), this.reject.bind(this));
		};

		/*  promise API methods  */
		api.prototype = {
			/*  promise resolving methods  */
			fulfill: function (value) { return deliver(this, STATE_FULFILLED, "fulfillValue", value); },
			reject:  function (value) { return deliver(this, STATE_REJECTED,  "rejectReason", value); },

			/*  "The then Method" [Promises/A+ 1.1, 1.2, 2.2]  */
			then: function (onFulfilled, onRejected) {
				var curr = this;
				var next = new api();                                    /*  [Promises/A+ 2.2.7]  */
				curr.onFulfilled.push(
					resolver(onFulfilled, next, "fulfill"));             /*  [Promises/A+ 2.2.2/2.2.6]  */
				curr.onRejected.push(
					resolver(onRejected,  next, "reject" ));             /*  [Promises/A+ 2.2.3/2.2.6]  */
				execute(curr);
				return next.proxy;                                       /*  [Promises/A+ 2.2.7, 3.3]  */
			}
		};

		/*  deliver an action  */
		var deliver = function (curr, state, name, value) {
			if (curr.state === STATE_PENDING) {
				curr.state = state;                                      /*  [Promises/A+ 2.1.2.1, 2.1.3.1]  */
				curr[name] = value;                                      /*  [Promises/A+ 2.1.2.2, 2.1.3.2]  */
				execute(curr);
			}
			return curr;
		};

		/*  execute all handlers  */
		var execute = function (curr) {
			if (curr.state === STATE_FULFILLED)
				execute_handlers(curr, "onFulfilled", curr.fulfillValue);
			else if (curr.state === STATE_REJECTED)
				execute_handlers(curr, "onRejected",  curr.rejectReason);
		};

		/*  execute particular set of handlers  */
		var execute_handlers = function (curr, name, value) {
			/* global process: true */
			/* global setImmediate: true */
			/* global setTimeout: true */

			/*  short-circuit processing  */
			if (curr[name].length === 0)
				return;

			/*  iterate over all handlers, exactly once  */
			var handlers = curr[name];
			curr[name] = [];                                             /*  [Promises/A+ 2.2.2.3, 2.2.3.3]  */
			var func = function () {
				for (var i = 0; i < handlers.length; i++)
					handlers[i](value);                                  /*  [Promises/A+ 2.2.5]  */
			};

			/*  execute procedure asynchronously  */                     /*  [Promises/A+ 2.2.4, 3.1]  */
			if (typeof process === "object" && typeof process.nextTick === "function")
				process.nextTick(func);
			else if (typeof setImmediate === "function")
				setImmediate(func);
			else
				setTimeout(func, 0);
		};

		/*  generate a resolver function  */
		var resolver = function (cb, next, method) {
			return function (value) {
				if (typeof cb !== "function")                            /*  [Promises/A+ 2.2.1, 2.2.7.3, 2.2.7.4]  */
					next[method].call(next, value);                      /*  [Promises/A+ 2.2.7.3, 2.2.7.4]  */
				else {
					var result;
					try { result = cb(value); }                          /*  [Promises/A+ 2.2.2.1, 2.2.3.1, 2.2.5, 3.2]  */
					catch (e) {
						next.reject(e);                                  /*  [Promises/A+ 2.2.7.2]  */
						return;
					}
					resolve(next, result);                               /*  [Promises/A+ 2.2.7.1]  */
				}
			};
		};

		/*  "Promise Resolution Procedure"  */                           /*  [Promises/A+ 2.3]  */
		var resolve = function (promise, x) {
			/*  sanity check arguments  */                               /*  [Promises/A+ 2.3.1]  */
			if (promise === x || promise.proxy === x) {
				promise.reject(new TypeError("cannot resolve promise with itself"));
				return;
			}

			/*  surgically check for a "then" method
				(mainly to just call the "getter" of "then" only once)  */
			var then;
			if ((typeof x === "object" && x !== null) || typeof x === "function") {
				try { then = x.then; }                                   /*  [Promises/A+ 2.3.3.1, 3.5]  */
				catch (e) {
					promise.reject(e);                                   /*  [Promises/A+ 2.3.3.2]  */
					return;
				}
			}

			/*  handle own Thenables    [Promises/A+ 2.3.2]
				and similar "thenables" [Promises/A+ 2.3.3]  */
			if (typeof then === "function") {
				var resolved = false;
				try {
					/*  call retrieved "then" method */                  /*  [Promises/A+ 2.3.3.3]  */
					then.call(x,
						/*  resolvePromise  */                           /*  [Promises/A+ 2.3.3.3.1]  */
						function (y) {
							if (resolved) return; resolved = true;       /*  [Promises/A+ 2.3.3.3.3]  */
							if (y === x)                                 /*  [Promises/A+ 3.6]  */
								promise.reject(new TypeError("circular thenable chain"));
							else
								resolve(promise, y);
						},

						/*  rejectPromise  */                            /*  [Promises/A+ 2.3.3.3.2]  */
						function (r) {
							if (resolved) return; resolved = true;       /*  [Promises/A+ 2.3.3.3.3]  */
							promise.reject(r);
						}
					);
				}
				catch (e) {
					if (!resolved)                                       /*  [Promises/A+ 2.3.3.3.3]  */
						promise.reject(e);                               /*  [Promises/A+ 2.3.3.3.4]  */
				}
				return;
			}

			/*  handle other values  */
			promise.fulfill(x);                                          /*  [Promises/A+ 2.3.4, 2.3.3.4]  */
		};

		/*  export API  */
		return api;
	})(),

	//jscs:enable

	// Event
	// A contructor superclass for adding event menthods, on, off, emit.
	Event: function() {

		var separator = /[\s\,]+/;

		// If this doesn't support getPrototype then we can't get prototype.events of the parent
		// So lets get the current instance events, and add those to a parent property
		this.parent = {
			events: this.events,
			findEvents: this.findEvents,
			parent: this.parent,
			utils: this.utils
		};

		this.events = {};

		// On, subscribe to events
		// @param evt   string
		// @param callback  function
		this.on = function(evt, callback) {

			if (callback && typeof (callback) === 'function') {
				var a = evt.split(separator);
				for (var i = 0; i < a.length; i++) {

					// Has this event already been fired on this instance?
					this.events[a[i]] = [callback].concat(this.events[a[i]] || []);
				}
			}

			return this;
		};

		// Off, unsubscribe to events
		// @param evt   string
		// @param callback  function
		this.off = function(evt, callback) {

			this.findEvents(evt, function(name, index) {
				if (!callback || this.events[name][index] === callback) {
					this.events[name][index] = null;
				}
			});

			return this;
		};

		// Emit
		// Triggers any subscribed events
		this.emit = function(evt /*, data, ... */) {

			// Get arguments as an Array, knock off the first one
			var args = Array.prototype.slice.call(arguments, 1);
			args.push(evt);

			// Handler
			var handler = function(name, index) {

				// Replace the last property with the event name
				args[args.length - 1] = (name === '*' ? evt : name);

				// Trigger
				this.events[name][index].apply(this, args);
			};

			// Find the callbacks which match the condition and call
			var _this = this;
			while (_this && _this.findEvents) {

				// Find events which match
				_this.findEvents(evt + ',*', handler);
				_this = _this.parent;
			}

			return this;
		};

		//
		// Easy functions
		this.emitAfter = function() {
			var _this = this;
			var args = arguments;
			setTimeout(function() {
				_this.emit.apply(_this, args);
			}, 0);

			return this;
		};

		this.findEvents = function(evt, callback) {

			var a = evt.split(separator);

			for (var name in this.events) {if (this.events.hasOwnProperty(name)) {

				if (a.indexOf(name) > -1) {

					for (var i = 0; i < this.events[name].length; i++) {

						// Does the event handler exist?
						if (this.events[name][i]) {
							// Emit on the local instance of this
							callback.call(this, name, i);
						}
					}
				}
			}}
		};

		return this;
	},

	// Global Events
	// Attach the callback to the window object
	// Return its unique reference
	globalEvent: function(callback, guid) {
		// If the guid has not been supplied then create a new one.
		guid = guid || '_hellojs_' + parseInt(Math.random() * 1e12, 10).toString(36);

		// Define the callback function
		window[guid] = function() {
			// Trigger the callback
			try {
				if (callback.apply(this, arguments)) {
					delete window[guid];
				}
			}
			catch (e) {
				console.error(e);
			}
		};

		return guid;
	},

	// Trigger a clientside popup
	// This has been augmented to support PhoneGap
	popup: function(url, redirectUri, options) {

		var documentElement = document.documentElement;

		// Multi Screen Popup Positioning (http://stackoverflow.com/a/16861050)
		// Credit: http://www.xtf.dk/2011/08/center-new-popup-window-even-on.html
		// Fixes dual-screen position                         Most browsers      Firefox

		if (options.height) {
			var dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;
			var height = screen.height || window.innerHeight || documentElement.clientHeight;
			options.top = parseInt((height - options.height) / 2, 10) + dualScreenTop;
		}

		if (options.width) {
			var dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
			var width = screen.width || window.innerWidth || documentElement.clientWidth;
			options.left = parseInt((width - options.width) / 2, 10) + dualScreenLeft;
		}

		// Convert options into an array
		var optionsArray = [];
		Object.keys(options).forEach(function(name) {
			var value = options[name];
			optionsArray.push(name + (value !== null ? '=' + value : ''));
		});

		// Create a function for reopening the popup, and assigning events to the new popup object
		// This is a fix whereby triggering the
		var open = function(url) {

			// Trigger callback
			var popup = window.open(
				url,
				'_blank',
				optionsArray.join(',')
			);

			// PhoneGap support
			// Add an event listener to listen to the change in the popup windows URL
			// This must appear before popup.focus();
			try {
				if (popup && popup.addEventListener) {

					// Get the origin of the redirect URI

					var a = hello.utils.url(redirectUri);
					var redirectUriOrigin = a.origin || (a.protocol + '//' + a.hostname);

					// Listen to changes in the InAppBrowser window

					popup.addEventListener('loadstart', function(e) {

						var url = e.url;

						// Is this the path, as given by the redirectUri?
						// Check the new URL agains the redirectUriOrigin.
						// According to #63 a user could click 'cancel' in some dialog boxes ....
						// The popup redirects to another page with the same origin, yet we still wish it to close.

						if (url.indexOf(redirectUriOrigin) !== 0) {
							return;
						}

						// Split appart the URL
						var a = hello.utils.url(url);

						// We dont have window operations on the popup so lets create some
						// The location can be augmented in to a location object like so...

						var _popup = {
							location: {
								// Change the location of the popup
								assign: function(location) {

									// Unfourtunatly an app is may not change the location of a InAppBrowser window.
									// So to shim this, just open a new one.

									popup.addEventListener('exit', function() {

										// For some reason its failing to close the window if a new window opens too soon.

										setTimeout(function() {
											open(location);
										}, 1000);
									});
								},

								search: a.search,
								hash: a.hash,
								href: a.href
							},
							close: function() {
								if (popup.close) {
									popup.close();
								}
							}
						};

						// Then this URL contains information which HelloJS must process
						// URL string
						// Window - any action such as window relocation goes here
						// Opener - the parent window which opened this, aka this script

						hello.utils.responseHandler(_popup, window);

						// Always close the popup regardless of whether the hello.utils.responseHandler detects a state parameter or not in the querystring.
						// Such situations might arise such as those in #63

						_popup.close();

					});
				}
			}
			catch (e) {}

			if (popup && popup.focus) {
				popup.focus();
			}

			return popup;
		};

		// Call the open() function with the initial path
		//
		// OAuth redirect, fixes URI fragments from being lost in Safari
		// (URI Fragments within 302 Location URI are lost over HTTPS)
		// Loading the redirect.html before triggering the OAuth Flow seems to fix it.
		//
		// Firefox  decodes URL fragments when calling location.hash.
		//  - This is bad if the value contains break points which are escaped
		//  - Hence the url must be encoded twice as it contains breakpoints.
		if (navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
			url = redirectUri + '#oauth_redirect=' + encodeURIComponent(encodeURIComponent(url));
		}

		return open(url);
	},

	// OAuth and API response handler
	responseHandler: function(window, parent) {

		var _this = this;
		var p;
		var location = window.location;

		// Is this an auth relay message which needs to call the proxy?
		p = _this.param(location.search);

		// OAuth2 or OAuth1 server response?
		if (p && p.state && (p.code || p.oauth_token)) {

			var state = JSON.parse(p.state);

			// Add this path as the redirect_uri
			p.redirect_uri = state.redirect_uri || location.href.replace(/[\?\#].*$/, '');

			// Redirect to the host
			var path = state.oauth_proxy + '?' + _this.param(p);

			location.assign(path);

			return;
		}

		// Save session, from redirected authentication
		// #access_token has come in?
		//
		// FACEBOOK is returning auth errors within as a query_string... thats a stickler for consistency.
		// SoundCloud is the state in the querystring and the token in the hashtag, so we'll mix the two together

		p = _this.merge(_this.param(location.search || ''), _this.param(location.hash || ''));

		// If p.state
		if (p && 'state' in p) {

			// Remove any addition information
			// E.g. p.state = 'facebook.page';
			try {
				var a = JSON.parse(p.state);
				_this.extend(p, a);
			}
			catch (e) {
				console.error('Could not decode state parameter');
			}

			// Access_token?
			if (('access_token' in p && p.access_token) && p.network) {

				if (!p.expires_in || parseInt(p.expires_in, 10) === 0) {
					// If p.expires_in is unset, set to 0
					p.expires_in = 0;
				}

				p.expires_in = parseInt(p.expires_in, 10);
				p.expires = ((new Date()).getTime() / 1e3) + (p.expires_in || (60 * 60 * 24 * 365));

				// Lets use the "state" to assign it to one of our networks
				authCallback(p, window, parent);
			}

			// Error=?
			// &error_description=?
			// &state=?
			else if (('error' in p && p.error) && p.network) {

				p.error = {
					code: p.error,
					message: p.error_message || p.error_description
				};

				// Let the state handler handle it
				authCallback(p, window, parent);
			}

			// API call, or a cancelled login
			// Result is serialized JSON string
			else if (p.callback && p.callback in parent) {

				// Trigger a function in the parent
				var res = 'result' in p && p.result ? JSON.parse(p.result) : false;

				// Trigger the callback on the parent
				parent[p.callback](res);
				closeWindow();
			}

			// If this page is still open
			if (p.page_uri) {
				location.assign(p.page_uri);
			}
		}

		// OAuth redirect, fixes URI fragments from being lost in Safari
		// (URI Fragments within 302 Location URI are lost over HTTPS)
		// Loading the redirect.html before triggering the OAuth Flow seems to fix it.
		else if ('oauth_redirect' in p) {

			location.assign(decodeURIComponent(p.oauth_redirect));
			return;
		}

		// Trigger a callback to authenticate
		function authCallback(obj, window, parent) {

			var cb = obj.callback;
			var network = obj.network;

			// Trigger the callback on the parent
			_this.store(network, obj);

			// If this is a page request it has no parent or opener window to handle callbacks
			if (('display' in obj) && obj.display === 'page') {
				return;
			}

			// Remove from session object
			if (parent && cb && cb in parent) {

				try {
					delete obj.callback;
				}
				catch (e) {}

				// Update store
				_this.store(network, obj);

				// Call the globalEvent function on the parent
				// It's safer to pass back a string to the parent,
				// Rather than an object/array (better for IE8)
				var str = JSON.stringify(obj);

				try {
					parent[cb](str);
				}
				catch (e) {
					// Error thrown whilst executing parent callback
				}
			}

			closeWindow();
		}

		function closeWindow() {

			// Close this current window
			try {
				window.close();
			}
			catch (e) {}

			// IOS bug wont let us close a popup if still loading
			if (window.addEventListener) {
				window.addEventListener('load', function() {
					window.close();
				});
			}
		}
	}
});

// Events

// Extend the hello object with its own event instance
hello.utils.Event.call(hello);

/////////////////////////////////////
//
// Save any access token that is in the current page URL
// Handle any response solicited through iframe hash tag following an API request
//
/////////////////////////////////////

hello.utils.responseHandler(window, window.opener || window.parent);

///////////////////////////////////
// Monitoring session state
// Check for session changes
///////////////////////////////////

(function(hello) {

	// Monitor for a change in state and fire
	var oldSessions = {};

	// Hash of expired tokens
	var expired = {};

	// Listen to other triggers to Auth events, use these to update this
	hello.on('auth.login, auth.logout', function(auth) {
		if (auth && typeof (auth) === 'object' && auth.network) {
			oldSessions[auth.network] = hello.utils.store(auth.network) || {};
		}
	});

	(function self() {

		var CURRENT_TIME = ((new Date()).getTime() / 1e3);
		var emit = function(eventName) {
			hello.emit('auth.' + eventName, {
				network: name,
				authResponse: session
			});
		};

		// Loop through the services
		for (var name in hello.services) {if (hello.services.hasOwnProperty(name)) {

			if (!hello.services[name].id) {
				// We haven't attached an ID so dont listen.
				continue;
			}

			// Get session
			var session = hello.utils.store(name) || {};
			var provider = hello.services[name];
			var oldSess = oldSessions[name] || {};

			// Listen for globalEvents that did not get triggered from the child
			if (session && 'callback' in session) {

				// To do remove from session object...
				var cb = session.callback;
				try {
					delete session.callback;
				}
				catch (e) {}

				// Update store
				// Removing the callback
				hello.utils.store(name, session);

				// Emit global events
				try {
					window[cb](session);
				}
				catch (e) {}
			}

			// Refresh token
			if (session && ('expires' in session) && session.expires < CURRENT_TIME) {

				// If auto refresh is possible
				// Either the browser supports
				var refresh = provider.refresh || session.refresh_token;

				// Has the refresh been run recently?
				if (refresh && (!(name in expired) || expired[name] < CURRENT_TIME)) {
					// Try to resignin
					hello.emit('notice', name + ' has expired trying to resignin');
					hello.login(name, {display: 'none', force: false});

					// Update expired, every 10 minutes
					expired[name] = CURRENT_TIME + 600;
				}

				// Does this provider not support refresh
				else if (!refresh && !(name in expired)) {
					// Label the event
					emit('expired');
					expired[name] = true;
				}

				// If session has expired then we dont want to store its value until it can be established that its been updated
				continue;
			}

			// Has session changed?
			else if (oldSess.access_token === session.access_token &&
			oldSess.expires === session.expires) {
				continue;
			}

			// Access_token has been removed
			else if (!session.access_token && oldSess.access_token) {
				emit('logout');
			}

			// Access_token has been created
			else if (session.access_token && !oldSess.access_token) {
				emit('login');
			}

			// Access_token has been updated
			else if (session.expires !== oldSess.expires) {
				emit('update');
			}

			// Updated stored session
			oldSessions[name] = session;

			// Remove the expired flags
			if (name in expired) {
				delete expired[name];
			}
		}}

		// Check error events
		setTimeout(self, 1000);
	})();

})(hello);

// EOF CORE lib
//////////////////////////////////

/////////////////////////////////////////
// API
// @param path    string
// @param query   object (optional)
// @param method  string (optional)
// @param data    object (optional)
// @param timeout integer (optional)
// @param callback  function (optional)

hello.api = function() {

	// Shorthand
	var _this = this;
	var utils = _this.utils;
	var error = utils.error;

	// Construct a new Promise object
	var promise = utils.Promise();

	// Arguments
	var p = utils.args({path: 's!', query: 'o', method: 's', data: 'o', timeout: 'i', callback: 'f'}, arguments);

	// Method
	p.method = (p.method || 'get').toLowerCase();

	// Headers
	p.headers = p.headers || {};

	// Query
	p.query = p.query || {};

	// If get, put all parameters into query
	if (p.method === 'get' || p.method === 'delete') {
		utils.extend(p.query, p.data);
		p.data = {};
	}

	var data = p.data = p.data || {};

	// Completed event callback
	promise.then(p.callback, p.callback);

	// Remove the network from path, e.g. facebook:/me/friends
	// Results in { network : facebook, path : me/friends }
	if (!p.path) {
		return promise.reject(error('invalid_path', 'Missing the path parameter from the request'));
	}

	p.path = p.path.replace(/^\/+/, '');
	var a = (p.path.split(/[\/\:]/, 2) || [])[0].toLowerCase();

	if (a in _this.services) {
		p.network = a;
		var reg = new RegExp('^' + a + ':?\/?');
		p.path = p.path.replace(reg, '');
	}

	// Network & Provider
	// Define the network that this request is made for
	p.network = _this.settings.default_service = p.network || _this.settings.default_service;
	var o = _this.services[p.network];

	// INVALID
	// Is there no service by the given network name?
	if (!o) {
		return promise.reject(error('invalid_network', 'Could not match the service requested: ' + p.network));
	}

	// PATH
	// As long as the path isn't flagged as unavaiable, e.g. path == false

	if (!(!(p.method in o) || !(p.path in o[p.method]) || o[p.method][p.path] !== false)) {
		return promise.reject(error('invalid_path', 'The provided path is not available on the selected network'));
	}

	// PROXY
	// OAuth1 calls always need a proxy

	if (!p.oauth_proxy) {
		p.oauth_proxy = _this.settings.oauth_proxy;
	}

	if (!('proxy' in p)) {
		p.proxy = p.oauth_proxy && o.oauth && parseInt(o.oauth.version, 10) === 1;
	}

	// TIMEOUT
	// Adopt timeout from global settings by default

	if (!('timeout' in p)) {
		p.timeout = _this.settings.timeout;
	}

	// Format response
	// Whether to run the raw response through post processing.
	if (!('formatResponse' in p)) {
		p.formatResponse = true;
	}

	// Get the current session
	// Append the access_token to the query
	p.authResponse = _this.getAuthResponse(p.network);
	if (p.authResponse && p.authResponse.access_token) {
		p.query.access_token = p.authResponse.access_token;
	}

	var url = p.path;
	var m;

	// Store the query as options
	// This is used to populate the request object before the data is augmented by the prewrap handlers.
	p.options = utils.clone(p.query);

	// Clone the data object
	// Prevent this script overwriting the data of the incoming object.
	// Ensure that everytime we run an iteration the callbacks haven't removed some data
	p.data = utils.clone(data);

	// URL Mapping
	// Is there a map for the given URL?
	var actions = o[{'delete': 'del'}[p.method] || p.method] || {};

	// Extrapolate the QueryString
	// Provide a clean path
	// Move the querystring into the data
	if (p.method === 'get') {

		var query = url.split(/[\?#]/)[1];
		if (query) {
			utils.extend(p.query, utils.param(query));

			// Remove the query part from the URL
			url = url.replace(/\?.*?(#|$)/, '$1');
		}
	}

	// Is the hash fragment defined
	if ((m = url.match(/#(.+)/, ''))) {
		url = url.split('#')[0];
		p.path = m[1];
	}
	else if (url in actions) {
		p.path = url;
		url = actions[url];
	}
	else if ('default' in actions) {
		url = actions['default'];
	}

	// Redirect Handler
	// This defines for the Form+Iframe+Hash hack where to return the results too.
	p.redirect_uri = _this.settings.redirect_uri;

	// Define FormatHandler
	// The request can be procesed in a multitude of ways
	// Here's the options - depending on the browser and endpoint
	p.xhr = o.xhr;
	p.jsonp = o.jsonp;
	p.form = o.form;

	// Make request
	if (typeof (url) === 'function') {
		// Does self have its own callback?
		url(p, getPath);
	}
	else {
		// Else the URL is a string
		getPath(url);
	}

	return promise.proxy;

	// If url needs a base
	// Wrap everything in
	function getPath(url) {

		// Format the string if it needs it
		url = url.replace(/\@\{([a-z\_\-]+)(\|.*?)?\}/gi, function(m, key, defaults) {
			var val = defaults ? defaults.replace(/^\|/, '') : '';
			if (key in p.query) {
				val = p.query[key];
				delete p.query[key];
			}
			else if (p.data && key in p.data) {
				val = p.data[key];
				delete p.data[key];
			}
			else if (!defaults) {
				promise.reject(error('missing_attribute', 'The attribute ' + key + ' is missing from the request'));
			}

			return val;
		});

		// Add base
		if (!url.match(/^https?:\/\//)) {
			url = o.base + url;
		}

		// Define the request URL
		p.url = url;

		// Make the HTTP request with the curated request object
		// CALLBACK HANDLER
		// @ response object
		// @ statusCode integer if available
		utils.request(p, function(r, headers) {

			// Is this a raw response?
			if (!p.formatResponse) {
				// Bad request? error statusCode or otherwise contains an error response vis JSONP?
				if (typeof headers === 'object' ? (headers.statusCode >= 400) : (typeof r === 'object' && 'error' in r)) {
					promise.reject(r);
				}
				else {
					promise.fulfill(r);
				}

				return;
			}

			// Should this be an object
			if (r === true) {
				r = {success:true};
			}
			else if (!r) {
				r = {};
			}

			// The delete callback needs a better response
			if (p.method === 'delete') {
				r = (!r || utils.isEmpty(r)) ? {success:true} : r;
			}

			// FORMAT RESPONSE?
			// Does self request have a corresponding formatter
			if (o.wrap && ((p.path in o.wrap) || ('default' in o.wrap))) {
				var wrap = (p.path in o.wrap ? p.path : 'default');
				var time = (new Date()).getTime();

				// FORMAT RESPONSE
				var b = o.wrap[wrap](r, headers, p);

				// Has the response been utterly overwritten?
				// Typically self augments the existing object.. but for those rare occassions
				if (b) {
					r = b;
				}
			}

			// Is there a next_page defined in the response?
			if (r && 'paging' in r && r.paging.next) {

				// Add the relative path if it is missing from the paging/next path
				if (r.paging.next[0] === '?') {
					r.paging.next = p.path + r.paging.next;
				}

				// The relative path has been defined, lets markup the handler in the HashFragment
				else {
					r.paging.next += '#' + p.path;
				}
			}

			// Dispatch to listeners
			// Emit events which pertain to the formatted response
			if (!r || 'error' in r) {
				promise.reject(r);
			}
			else {
				promise.fulfill(r);
			}
		});
	}
};

// API utilities
hello.utils.extend(hello.utils, {

	// Make an HTTP request
	request: function(p, callback) {

		var _this = this;
		var error = _this.error;

		// This has to go through a POST request
		if (!_this.isEmpty(p.data) && !('FileList' in window) && _this.hasBinary(p.data)) {

			// Disable XHR and JSONP
			p.xhr = false;
			p.jsonp = false;
		}

		// Check if the browser and service support CORS
		var cors = this.request_cors(function() {
			// If it does then run this...
			return ((p.xhr === undefined) || (p.xhr && (typeof (p.xhr) !== 'function' || p.xhr(p, p.query))));
		});

		if (cors) {

			formatUrl(p, function(url) {

				var x = _this.xhr(p.method, url, p.headers, p.data, callback);
				x.onprogress = p.onprogress || null;

				// Windows Phone does not support xhr.upload, see #74
				// Feature detect
				if (x.upload && p.onuploadprogress) {
					x.upload.onprogress = p.onuploadprogress;
				}

			});

			return;
		}

		// Clone the query object
		// Each request modifies the query object and needs to be tared after each one.
		var _query = p.query;

		p.query = _this.clone(p.query);

		// Assign a new callbackID
		p.callbackID = _this.globalEvent();

		// JSONP
		if (p.jsonp !== false) {

			// Clone the query object
			p.query.callback = p.callbackID;

			// If the JSONP is a function then run it
			if (typeof (p.jsonp) === 'function') {
				p.jsonp(p, p.query);
			}

			// Lets use JSONP if the method is 'get'
			if (p.method === 'get') {

				formatUrl(p, function(url) {
					_this.jsonp(url, callback, p.callbackID, p.timeout);
				});

				return;
			}
			else {
				// It's not compatible reset query
				p.query = _query;
			}

		}

		// Otherwise we're on to the old school, iframe hacks and JSONP
		if (p.form !== false) {

			// Add some additional query parameters to the URL
			// We're pretty stuffed if the endpoint doesn't like these
			p.query.redirect_uri = p.redirect_uri;
			p.query.state = JSON.stringify({callback:p.callbackID});

			var opts;

			if (typeof (p.form) === 'function') {

				// Format the request
				opts = p.form(p, p.query);
			}

			if (p.method === 'post' && opts !== false) {

				formatUrl(p, function(url) {
					_this.post(url, p.data, opts, callback, p.callbackID, p.timeout);
				});

				return;
			}
		}

		// None of the methods were successful throw an error
		callback(error('invalid_request', 'There was no mechanism for handling this request'));

		return;

		// Format URL
		// Constructs the request URL, optionally wraps the URL through a call to a proxy server
		// Returns the formatted URL
		function formatUrl(p, callback) {

			// Are we signing the request?
			var sign;

			// OAuth1
			// Remove the token from the query before signing
			if (p.authResponse && p.authResponse.oauth && parseInt(p.authResponse.oauth.version, 10) === 1) {

				// OAUTH SIGNING PROXY
				sign = p.query.access_token;

				// Remove the access_token
				delete p.query.access_token;

				// Enfore use of Proxy
				p.proxy = true;
			}

			// POST body to querystring
			if (p.data && (p.method === 'get' || p.method === 'delete')) {
				// Attach the p.data to the querystring.
				_this.extend(p.query, p.data);
				p.data = null;
			}

			// Construct the path
			var path = _this.qs(p.url, p.query);

			// Proxy the request through a server
			// Used for signing OAuth1
			// And circumventing services without Access-Control Headers
			if (p.proxy) {
				// Use the proxy as a path
				path = _this.qs(p.oauth_proxy, {
					path: path,
					access_token: sign || '',

					// This will prompt the request to be signed as though it is OAuth1
					then: p.proxy_response_type || (p.method.toLowerCase() === 'get' ? 'redirect' : 'proxy'),
					method: p.method.toLowerCase(),
					suppress_response_codes: true
				});
			}

			callback(path);
		}
	},

	// Test whether the browser supports the CORS response
	request_cors: function(callback) {
		return 'withCredentials' in new XMLHttpRequest() && callback();
	},

	// Return the type of DOM object
	domInstance: function(type, data) {
		var test = 'HTML' + (type || '').replace(
			/^[a-z]/,
			function(m) {
				return m.toUpperCase();
			}

		) + 'Element';

		if (!data) {
			return false;
		}

		if (window[test]) {
			return data instanceof window[test];
		}
		else if (window.Element) {
			return data instanceof window.Element && (!type || (data.tagName && data.tagName.toLowerCase() === type));
		}
		else {
			return (!(data instanceof Object || data instanceof Array || data instanceof String || data instanceof Number) && data.tagName && data.tagName.toLowerCase() === type);
		}
	},

	// Create a clone of an object
	clone: function(obj) {
		// Does not clone DOM elements, nor Binary data, e.g. Blobs, Filelists
		if (obj === null || typeof (obj) !== 'object' || obj instanceof Date || 'nodeName' in obj || this.isBinary(obj)) {
			return obj;
		}

		if (Array.isArray(obj)) {
			// Clone each item in the array
			return obj.map(this.clone.bind(this));
		}

		// But does clone everything else.
		var clone = {};
		for (var x in obj) {
			clone[x] = this.clone(obj[x]);
		}

		return clone;
	},

	// XHR: uses CORS to make requests
	xhr: function(method, url, headers, data, callback) {

		var r = new XMLHttpRequest();
		var error = this.error;

		// Binary?
		var binary = false;
		if (method === 'blob') {
			binary = method;
			method = 'GET';
		}

		method = method.toUpperCase();

		// Xhr.responseType 'json' is not supported in any of the vendors yet.
		r.onload = function(e) {
			var json = r.response;
			try {
				json = JSON.parse(r.responseText);
			}
			catch (_e) {
				if (r.status === 401) {
					json = error('access_denied', r.statusText);
				}
			}

			var headers = headersToJSON(r.getAllResponseHeaders());
			headers.statusCode = r.status;

			callback(json || (method === 'GET' ? error('empty_response', 'Could not get resource') : {}), headers);
		};

		r.onerror = function(e) {
			var json = r.responseText;
			try {
				json = JSON.parse(r.responseText);
			}
			catch (_e) {}

			callback(json || error('access_denied', 'Could not get resource'));
		};

		var x;

		// Should we add the query to the URL?
		if (method === 'GET' || method === 'DELETE') {
			data = null;
		}
		else if (data && typeof (data) !== 'string' && !(data instanceof FormData) && !(data instanceof File) && !(data instanceof Blob)) {
			// Loop through and add formData
			var f = new FormData();
			for (x in data) if (data.hasOwnProperty(x)) {
				if (data[x] instanceof HTMLInputElement) {
					if ('files' in data[x] && data[x].files.length > 0) {
						f.append(x, data[x].files[0]);
					}
				}
				else if (data[x] instanceof Blob) {
					f.append(x, data[x], data.name);
				}
				else {
					f.append(x, data[x]);
				}
			}

			data = f;
		}

		// Open the path, async
		r.open(method, url, true);

		if (binary) {
			if ('responseType' in r) {
				r.responseType = binary;
			}
			else {
				r.overrideMimeType('text/plain; charset=x-user-defined');
			}
		}

		// Set any bespoke headers
		if (headers) {
			for (x in headers) {
				r.setRequestHeader(x, headers[x]);
			}
		}

		r.send(data);

		return r;

		// Headers are returned as a string
		function headersToJSON(s) {
			var r = {};
			var reg = /([a-z\-]+):\s?(.*);?/gi;
			var m;
			while ((m = reg.exec(s))) {
				r[m[1]] = m[2];
			}

			return r;
		}
	},

	// JSONP
	// Injects a script tag into the DOM to be executed and appends a callback function to the window object
	// @param string/function pathFunc either a string of the URL or a callback function pathFunc(querystringhash, continueFunc);
	// @param function callback a function to call on completion;
	jsonp: function(url, callback, callbackID, timeout) {

		var _this = this;
		var error = _this.error;

		// Change the name of the callback
		var bool = 0;
		var head = document.getElementsByTagName('head')[0];
		var operaFix;
		var result = error('server_error', 'server_error');
		var cb = function() {
			if (!(bool++)) {
				window.setTimeout(function() {
					callback(result);
					head.removeChild(script);
				}, 0);
			}

		};

		// Add callback to the window object
		callbackID = _this.globalEvent(function(json) {
			result = json;
			return true;

			// Mark callback as done
		}, callbackID);

		// The URL is a function for some cases and as such
		// Determine its value with a callback containing the new parameters of this function.
		url = url.replace(new RegExp('=\\?(&|$)'), '=' + callbackID + '$1');

		// Build script tag
		var script = _this.append('script', {
			id: callbackID,
			name: callbackID,
			src: url,
			async: true,
			onload: cb,
			onerror: cb,
			onreadystatechange: function() {
				if (/loaded|complete/i.test(this.readyState)) {
					cb();
				}
			}
		});

		// Opera fix error
		// Problem: If an error occurs with script loading Opera fails to trigger the script.onerror handler we specified
		//
		// Fix:
		// By setting the request to synchronous we can trigger the error handler when all else fails.
		// This action will be ignored if we've already called the callback handler "cb" with a successful onload event
		if (window.navigator.userAgent.toLowerCase().indexOf('opera') > -1) {
			operaFix = _this.append('script', {
				text: 'document.getElementById(\'' + callbackID + '\').onerror();'
			});
			script.async = false;
		}

		// Add timeout
		if (timeout) {
			window.setTimeout(function() {
				result = error('timeout', 'timeout');
				cb();
			}, timeout);
		}

		// TODO: add fix for IE,
		// However: unable recreate the bug of firing off the onreadystatechange before the script content has been executed and the value of "result" has been defined.
		// Inject script tag into the head element
		head.appendChild(script);

		// Append Opera Fix to run after our script
		if (operaFix) {
			head.appendChild(operaFix);
		}
	},

	// Post
	// Send information to a remote location using the post mechanism
	// @param string uri path
	// @param object data, key value data to send
	// @param function callback, function to execute in response
	post: function(url, data, options, callback, callbackID, timeout) {

		var _this = this;
		var error = _this.error;
		var doc = document;

		// This hack needs a form
		var form = null;
		var reenableAfterSubmit = [];
		var newform;
		var i = 0;
		var x = null;
		var bool = 0;
		var cb = function(r) {
			if (!(bool++)) {
				callback(r);
			}
		};

		// What is the name of the callback to contain
		// We'll also use this to name the iframe
		_this.globalEvent(cb, callbackID);

		// Build the iframe window
		var win;
		try {
			// IE7 hack, only lets us define the name here, not later.
			win = doc.createElement('<iframe name="' + callbackID + '">');
		}
		catch (e) {
			win = doc.createElement('iframe');
		}

		win.name = callbackID;
		win.id = callbackID;
		win.style.display = 'none';

		// Override callback mechanism. Triggger a response onload/onerror
		if (options && options.callbackonload) {
			// Onload is being fired twice
			win.onload = function() {
				cb({
					response: 'posted',
					message: 'Content was posted'
				});
			};
		}

		if (timeout) {
			setTimeout(function() {
				cb(error('timeout', 'The post operation timed out'));
			}, timeout);
		}

		doc.body.appendChild(win);

		// If we are just posting a single item
		if (_this.domInstance('form', data)) {
			// Get the parent form
			form = data.form;

			// Loop through and disable all of its siblings
			for (i = 0; i < form.elements.length; i++) {
				if (form.elements[i] !== data) {
					form.elements[i].setAttribute('disabled', true);
				}
			}

			// Move the focus to the form
			data = form;
		}

		// Posting a form
		if (_this.domInstance('form', data)) {
			// This is a form element
			form = data;

			// Does this form need to be a multipart form?
			for (i = 0; i < form.elements.length; i++) {
				if (!form.elements[i].disabled && form.elements[i].type === 'file') {
					form.encoding = form.enctype = 'multipart/form-data';
					form.elements[i].setAttribute('name', 'file');
				}
			}
		}
		else {
			// Its not a form element,
			// Therefore it must be a JSON object of Key=>Value or Key=>Element
			// If anyone of those values are a input type=file we shall shall insert its siblings into the form for which it belongs.
			for (x in data) if (data.hasOwnProperty(x)) {
				// Is this an input Element?
				if (_this.domInstance('input', data[x]) && data[x].type === 'file') {
					form = data[x].form;
					form.encoding = form.enctype = 'multipart/form-data';
				}
			}

			// Do If there is no defined form element, lets create one.
			if (!form) {
				// Build form
				form = doc.createElement('form');
				doc.body.appendChild(form);
				newform = form;
			}

			var input;

			// Add elements to the form if they dont exist
			for (x in data) if (data.hasOwnProperty(x)) {

				// Is this an element?
				var el = (_this.domInstance('input', data[x]) || _this.domInstance('textArea', data[x]) || _this.domInstance('select', data[x]));

				// Is this not an input element, or one that exists outside the form.
				if (!el || data[x].form !== form) {

					// Does an element have the same name?
					var inputs = form.elements[x];
					if (input) {
						// Remove it.
						if (!(inputs instanceof NodeList)) {
							inputs = [inputs];
						}

						for (i = 0; i < inputs.length; i++) {
							inputs[i].parentNode.removeChild(inputs[i]);
						}

					}

					// Create an input element
					input = doc.createElement('input');
					input.setAttribute('type', 'hidden');
					input.setAttribute('name', x);

					// Does it have a value attribute?
					if (el) {
						input.value = data[x].value;
					}
					else if (_this.domInstance(null, data[x])) {
						input.value = data[x].innerHTML || data[x].innerText;
					}
					else {
						input.value = data[x];
					}

					form.appendChild(input);
				}

				// It is an element, which exists within the form, but the name is wrong
				else if (el && data[x].name !== x) {
					data[x].setAttribute('name', x);
					data[x].name = x;
				}
			}

			// Disable elements from within the form if they weren't specified
			for (i = 0; i < form.elements.length; i++) {

				input = form.elements[i];

				// Does the same name and value exist in the parent
				if (!(input.name in data) && input.getAttribute('disabled') !== true) {
					// Disable
					input.setAttribute('disabled', true);

					// Add re-enable to callback
					reenableAfterSubmit.push(input);
				}
			}
		}

		// Set the target of the form
		form.setAttribute('method', 'POST');
		form.setAttribute('target', callbackID);
		form.target = callbackID;

		// Update the form URL
		form.setAttribute('action', url);

		// Submit the form
		// Some reason this needs to be offset from the current window execution
		setTimeout(function() {
			form.submit();

			setTimeout(function() {
				try {
					// Remove the iframe from the page.
					//win.parentNode.removeChild(win);
					// Remove the form
					if (newform) {
						newform.parentNode.removeChild(newform);
					}
				}
				catch (e) {
					try {
						console.error('HelloJS: could not remove iframe');
					}
					catch (ee) {}
				}

				// Reenable the disabled form
				for (var i = 0; i < reenableAfterSubmit.length; i++) {
					if (reenableAfterSubmit[i]) {
						reenableAfterSubmit[i].setAttribute('disabled', false);
						reenableAfterSubmit[i].disabled = false;
					}
				}
			}, 0);
		}, 100);
	},

	// Some of the providers require that only multipart is used with non-binary forms.
	// This function checks whether the form contains binary data
	hasBinary: function(data) {
		for (var x in data) if (data.hasOwnProperty(x)) {
			if (this.isBinary(data[x])) {
				return true;
			}
		}

		return false;
	},

	// Determines if a variable Either Is or like a FormInput has the value of a Blob

	isBinary: function(data) {

		return data instanceof Object && (
		(this.domInstance('input', data) && data.type === 'file') ||
		('FileList' in window && data instanceof window.FileList) ||
		('File' in window && data instanceof window.File) ||
		('Blob' in window && data instanceof window.Blob));

	},

	// Convert Data-URI to Blob string
	toBlob: function(dataURI) {
		var reg = /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i;
		var m = dataURI.match(reg);
		if (!m) {
			return dataURI;
		}

		var binary = atob(dataURI.replace(reg, ''));
		var array = [];
		for (var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}

		return new Blob([new Uint8Array(array)], {type: m[1]});
	}

});

// EXTRA: Convert FormElement to JSON for POSTing
// Wrappers to add additional functionality to existing functions
(function(hello) {

	// Copy original function
	var api = hello.api;
	var utils = hello.utils;

	utils.extend(utils, {

		// DataToJSON
		// This takes a FormElement|NodeList|InputElement|MixedObjects and convers the data object to JSON.
		dataToJSON: function(p) {

			var _this = this;
			var w = window;
			var data = p.data;

			// Is data a form object
			if (_this.domInstance('form', data)) {
				data = _this.nodeListToJSON(data.elements);
			}
			else if ('NodeList' in w && data instanceof NodeList) {
				data = _this.nodeListToJSON(data);
			}
			else if (_this.domInstance('input', data)) {
				data = _this.nodeListToJSON([data]);
			}

			// Is data a blob, File, FileList?
			if (('File' in w && data instanceof w.File) ||
				('Blob' in w && data instanceof w.Blob) ||
				('FileList' in w && data instanceof w.FileList)) {
				data = {file: data};
			}

			// Loop through data if it's not form data it must now be a JSON object
			if (!('FormData' in w && data instanceof w.FormData)) {

				for (var x in data) if (data.hasOwnProperty(x)) {

					if ('FileList' in w && data[x] instanceof w.FileList) {
						if (data[x].length === 1) {
							data[x] = data[x][0];
						}
					}
					else if (_this.domInstance('input', data[x]) && data[x].type === 'file') {
						continue;
					}
					else if (_this.domInstance('input', data[x]) ||
						_this.domInstance('select', data[x]) ||
						_this.domInstance('textArea', data[x])) {
						data[x] = data[x].value;
					}
					else if (_this.domInstance(null, data[x])) {
						data[x] = data[x].innerHTML || data[x].innerText;
					}
				}
			}

			p.data = data;
			return data;
		},

		// NodeListToJSON
		// Given a list of elements extrapolate their values and return as a json object
		nodeListToJSON: function(nodelist) {

			var json = {};

			// Create a data string
			for (var i = 0; i < nodelist.length; i++) {

				var input = nodelist[i];

				// If the name of the input is empty or diabled, dont add it.
				if (input.disabled || !input.name) {
					continue;
				}

				// Is this a file, does the browser not support 'files' and 'FormData'?
				if (input.type === 'file') {
					json[input.name] = input;
				}
				else {
					json[input.name] = input.value || input.innerHTML;
				}
			}

			return json;
		}
	});

	// Replace it
	hello.api = function() {

		// Get arguments
		var p = utils.args({path: 's!', method: 's', data:'o', timeout: 'i', callback: 'f'}, arguments);

		// Change for into a data object
		if (p.data) {
			utils.dataToJSON(p);
		}

		return api.call(this, p);
	};

})(hello);

// Script to support ChromeApps
// This overides the hello.utils.popup method to support chrome.identity.launchWebAuthFlow
// See https://developer.chrome.com/apps/app_identity#non

// Is this a chrome app?

if (typeof chrome === 'object' && typeof chrome.identity === 'object' && chrome.identity.launchWebAuthFlow) {

	(function() {

		// Swap the popup method
		hello.utils.popup = function(url) {

			return _open(url, true);

		};

		// Swap the hidden iframe method
		hello.utils.iframe = function(url) {

			_open(url, false);

		};

		// Swap the request_cors method
		hello.utils.request_cors = function(callback) {

			callback();

			// Always run as CORS

			return true;
		};

		// Swap the storage method
		var _cache = {};
		chrome.storage.local.get('hello', function(r) {
			// Update the cache
			_cache = r.hello || {};
		});

		hello.utils.store = function(name, value) {

			// Get all
			if (arguments.length === 0) {
				return _cache;
			}

			// Get
			if (arguments.length === 1) {
				return _cache[name] || null;
			}

			// Set
			if (value) {
				_cache[name] = value;
				chrome.storage.local.set({hello: _cache});
				return value;
			}

			// Delete
			if (value === null) {
				delete _cache[name];
				chrome.storage.local.set({hello: _cache});
				return null;
			}
		};

		// Open function
		function _open(url, interactive) {

			// Launch
			var ref = {
				closed: false
			};

			// Launch the webAuthFlow
			chrome.identity.launchWebAuthFlow({
				url: url,
				interactive: interactive
			}, function(responseUrl) {

				// Did the user cancel this prematurely
				if (responseUrl === undefined) {
					ref.closed = true;
					return;
				}

				// Split appart the URL
				var a = hello.utils.url(responseUrl);

				// The location can be augmented in to a location object like so...
				// We dont have window operations on the popup so lets create some
				var _popup = {
					location: {

						// Change the location of the popup
						assign: function(url) {

							// If there is a secondary reassign
							// In the case of OAuth1
							// Trigger this in non-interactive mode.
							_open(url, false);
						},

						search: a.search,
						hash: a.hash,
						href: a.href
					},
					close: function() {}
				};

				// Then this URL contains information which HelloJS must process
				// URL string
				// Window - any action such as window relocation goes here
				// Opener - the parent window which opened this, aka this script

				hello.utils.responseHandler(_popup, window);
			});

			// Return the reference
			return ref;
		}

	})();
}

(function(hello) {

	// OAuth1
	var OAuth1Settings = {
		version: '1.0',
		auth: 'https://www.dropbox.com/1/oauth/authorize',
		request: 'https://api.dropbox.com/1/oauth/request_token',
		token: 'https://api.dropbox.com/1/oauth/access_token'
	};

	// OAuth2 Settings
	var OAuth2Settings = {
		version: 2,
		auth: 'https://www.dropbox.com/1/oauth2/authorize',
		grant: 'https://api.dropbox.com/1/oauth2/token'
	};

	// Initiate the Dropbox module
	hello.init({

		dropbox: {

			name: 'Dropbox',

			oauth: OAuth2Settings,

			login: function(p) {
				// OAuth2 non-standard adjustments
				p.qs.scope = '';
				delete p.qs.display;

				// Should this be run as OAuth1?
				// If the redirect_uri is is HTTP (non-secure) then its required to revert to the OAuth1 endpoints
				var redirect = decodeURIComponent(p.qs.redirect_uri);
				if (redirect.indexOf('http:') === 0 && redirect.indexOf('http://localhost/') !== 0) {

					// Override the dropbox OAuth settings.
					hello.services.dropbox.oauth = OAuth1Settings;
				}
				else {
					// Override the dropbox OAuth settings.
					hello.services.dropbox.oauth = OAuth2Settings;
				}

				// The dropbox login window is a different size
				p.options.popup.width = 1000;
				p.options.popup.height = 1000;
			},

			/*
				Dropbox does not allow insecure HTTP URI's in the redirect_uri field
				...otherwise I'd love to use OAuth2

				Follow request https://forums.dropbox.com/topic.php?id=106505

				p.qs.response_type = 'code';
				oauth: {
					version: 2,
					auth: 'https://www.dropbox.com/1/oauth2/authorize',
					grant: 'https://api.dropbox.com/1/oauth2/token'
				}
			*/

			// API Base URL
			base: 'https://api.dropbox.com/1/',

			// Bespoke setting: this is states whether to use the custom environment of Dropbox or to use their own environment
			// Because it's notoriously difficult for Dropbox too provide access from other webservices, this defaults to Sandbox
			root: 'sandbox',

			// Map GET requests
			get: {
				me: 'account/info',

				// Https://www.dropbox.com/developers/core/docs#metadata
				'me/files': req('metadata/auto/@{parent|}'),
				'me/folder': req('metadata/auto/@{id}'),
				'me/folders': req('metadata/auto/'),

				'default': function(p, callback) {
					if (p.path.match('https://api-content.dropbox.com/1/files/')) {
						// This is a file, return binary data
						p.method = 'blob';
					}

					callback(p.path);
				}
			},

			post: {
				'me/files': function(p, callback) {

					var path = p.data.parent;
					var fileName = p.data.name;

					p.data = {
						file: p.data.file
					};

					// Does this have a data-uri to upload as a file?
					if (typeof (p.data.file) === 'string') {
						p.data.file = hello.utils.toBlob(p.data.file);
					}

					callback('https://api-content.dropbox.com/1/files_put/auto/' + path + '/' + fileName);
				},

				'me/folders': function(p, callback) {

					var name = p.data.name;
					p.data = {};

					callback('fileops/create_folder?root=@{root|sandbox}&' + hello.utils.param({
						path: name
					}));
				}
			},

			// Map DELETE requests
			del: {
				'me/files': 'fileops/delete?root=@{root|sandbox}&path=@{id}',
				'me/folder': 'fileops/delete?root=@{root|sandbox}&path=@{id}'
			},

			wrap: {
				me: function(o) {
					formatError(o);
					if (!o.uid) {
						return o;
					}

					o.name = o.display_name;
					var m = o.name.split(' ');
					o.first_name = m.shift();
					o.last_name = m.join(' ');
					o.id = o.uid;
					delete o.uid;
					delete o.display_name;
					return o;
				},

				'default': function(o, headers, req) {
					formatError(o);
					if (o.is_dir && o.contents) {
						o.data = o.contents;
						delete o.contents;

						o.data.forEach(function(item) {
							item.root = o.root;
							formatFile(item, headers, req);
						});
					}

					formatFile(o, headers, req);

					if (o.is_deleted) {
						o.success = true;
					}

					return o;
				}
			},

			// Doesn't return the CORS headers
			xhr: function(p) {

				// The proxy supports allow-cross-origin-resource
				// Alas that's the only thing we're using.
				if (p.data && p.data.file) {
					var file = p.data.file;
					if (file) {
						if (file.files) {
							p.data = file.files[0];
						}
						else {
							p.data = file;
						}
					}
				}

				if (p.method === 'delete') {
					p.method = 'post';
				}

				return true;
			},

			form: function(p, qs) {
				delete qs.state;
				delete qs.redirect_uri;
			}
		}
	});

	function formatError(o) {
		if (o && 'error' in o) {
			o.error = {
				code: 'server_error',
				message: o.error.message || o.error
			};
		}
	}

	function formatFile(o, headers, req) {

		if (typeof o !== 'object' ||
			(typeof Blob !== 'undefined' && o instanceof Blob) ||
			(typeof ArrayBuffer !== 'undefined' && o instanceof ArrayBuffer)) {
			// This is a file, let it through unformatted
			return;
		}

		if ('error' in o) {
			return;
		}

		var path = (o.root !== 'app_folder' ? o.root : '') + o.path.replace(/\&/g, '%26');
		path = path.replace(/^\//, '');
		if (o.thumb_exists) {
			o.thumbnail = req.oauth_proxy + '?path=' +
			encodeURIComponent('https://api-content.dropbox.com/1/thumbnails/auto/' + path + '?format=jpeg&size=m') + '&access_token=' + req.options.access_token;
		}

		o.type = (o.is_dir ? 'folder' : o.mime_type);
		o.name = o.path.replace(/.*\//g, '');
		if (o.is_dir) {
			o.files = path.replace(/^\//, '');
		}
		else {
			o.downloadLink = hello.settings.oauth_proxy + '?path=' +
			encodeURIComponent('https://api-content.dropbox.com/1/files/auto/' + path) + '&access_token=' + req.options.access_token;
			o.file = 'https://api-content.dropbox.com/1/files/auto/' + path;
		}

		if (!o.id) {
			o.id = o.path.replace(/^\//, '');
		}

		// O.media = 'https://api-content.dropbox.com/1/files/' + path;
	}

	function req(str) {
		return function(p, cb) {
			delete p.query.limit;
			cb(str);
		};
	}

})(hello);

(function(hello) {

	hello.init({

		facebook: {

			name: 'Facebook',

			// SEE https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/v2.1
			oauth: {
				version: 2,
				auth: 'https://www.facebook.com/dialog/oauth/',
				grant: 'https://graph.facebook.com/oauth/access_token'
			},

			// Authorization scopes
			scope: {
				basic: 'public_profile',
				email: 'email',
				share: 'user_posts',
				birthday: 'user_birthday',
				events: 'user_events',
				photos: 'user_photos,user_videos',
				videos: 'user_photos,user_videos',
				friends: 'user_friends',
				files: 'user_photos,user_videos',
				publish_files: 'user_photos,user_videos,publish_actions',
				publish: 'publish_actions',

				// Deprecated in v2.0
				// Create_event	: 'create_event',

				offline_access: 'offline_access'
			},

			// Refresh the access_token
			refresh: true,

			login: function(p) {

				// Reauthenticate
				// https://developers.facebook.com/docs/facebook-login/reauthentication
				if (p.options.force) {
					p.qs.auth_type = 'reauthenticate';
				}

				// The facebook login window is a different size.
				p.options.popup.width = 580;
				p.options.popup.height = 400;
			},

			logout: function(callback, options) {
				// Assign callback to a global handler
				var callbackID = hello.utils.globalEvent(callback);
				var redirect = encodeURIComponent(hello.settings.redirect_uri + '?' + hello.utils.param({callback:callbackID, result: JSON.stringify({force:true}), state: '{}'}));
				var token = (options.authResponse || {}).access_token;
				hello.utils.iframe('https://www.facebook.com/logout.php?next=' + redirect + '&access_token=' + token);

				// Possible responses:
				// String URL	- hello.logout should handle the logout
				// Undefined	- this function will handle the callback
				// True - throw a success, this callback isn't handling the callback
				// False - throw a error
				if (!token) {
					// If there isn't a token, the above wont return a response, so lets trigger a response
					return false;
				}
			},

			// API Base URL
			base: 'https://graph.facebook.com/v2.4/',

			// Map GET requests
			get: {
				me: 'me?fields=email,first_name,last_name,name,timezone,verified',
				'me/friends': 'me/friends',
				'me/following': 'me/friends',
				'me/followers': 'me/friends',
				'me/share': 'me/feed',
				'me/like': 'me/likes',
				'me/files': 'me/albums',
				'me/albums': 'me/albums?fields=cover_photo,name',
				'me/album': '@{id}/photos?fields=picture',
				'me/photos': 'me/photos',
				'me/photo': '@{id}',
				'friend/albums': '@{id}/albums',
				'friend/photos': '@{id}/photos'

				// Pagination
				// Https://developers.facebook.com/docs/reference/api/pagination/
			},

			// Map POST requests
			post: {
				'me/share': 'me/feed',
				'me/photo': '@{id}'

				// Https://developers.facebook.com/docs/graph-api/reference/v2.2/object/likes/
			},

			wrap: {
				me: formatUser,
				'me/friends': formatFriends,
				'me/following': formatFriends,
				'me/followers': formatFriends,
				'me/albums': format,
				'me/photos': format,
				'me/files': format,
				'default': format
			},

			// Special requirements for handling XHR
			xhr: function(p, qs) {
				if (p.method === 'get' || p.method === 'post') {
					qs.suppress_response_codes = true;
				}

				// Is this a post with a data-uri?
				if (p.method === 'post' && p.data && typeof (p.data.file) === 'string') {
					// Convert the Data-URI to a Blob
					p.data.file = hello.utils.toBlob(p.data.file);
				}

				return true;
			},

			// Special requirements for handling JSONP fallback
			jsonp: function(p, qs) {
				var m = p.method;
				if (m !== 'get' && !hello.utils.hasBinary(p.data)) {
					p.data.method = m;
					p.method = 'get';
				}
				else if (p.method === 'delete') {
					qs.method = 'delete';
					p.method = 'post';
				}
			},

			// Special requirements for iframe form hack
			form: function(p) {
				return {
					// Fire the callback onload
					callbackonload: true
				};
			}
		}
	});

	var base = 'https://graph.facebook.com/';

	function formatUser(o) {
		if (o.id) {
			o.thumbnail = o.picture = 'https://graph.facebook.com/' + o.id + '/picture';
		}

		return o;
	}

	function formatFriends(o) {
		if ('data' in o) {
			o.data.forEach(formatUser);
		}

		return o;
	}

	function format(o, headers, req) {
		if (typeof o === 'boolean') {
			o = {success: o};
		}

		if (o && 'data' in o) {
			var token = req.query.access_token;
			o.data.forEach(function(d) {

				if (d.picture) {
					d.thumbnail = d.picture;
				}

				d.pictures = (d.images || [])
					.sort(function(a, b) {
						return a.width - b.width;
					});

				if (d.cover_photo && d.cover_photo.id) {
					d.thumbnail = base + d.cover_photo.id + '/picture?access_token=' + token;
				}

				if (d.type === 'album') {
					d.files = d.photos = base + d.id + '/photos';
				}

				if (d.can_upload) {
					d.upload_location = base + d.id + '/photos';
				}
			});
		}

		return o;
	}

})(hello);

(function(hello) {

	hello.init({

		flickr: {

			name: 'Flickr',

			// Ensure that you define an oauth_proxy
			oauth: {
				version: '1.0a',
				auth: 'https://www.flickr.com/services/oauth/authorize?perms=read',
				request: 'https://www.flickr.com/services/oauth/request_token',
				token: 'https://www.flickr.com/services/oauth/access_token'
			},

			// API base URL
			base: 'https://api.flickr.com/services/rest',

			// Map GET resquests
			get: {
				me: sign('flickr.people.getInfo'),
				'me/friends': sign('flickr.contacts.getList', {per_page:'@{limit|50}'}),
				'me/following': sign('flickr.contacts.getList', {per_page:'@{limit|50}'}),
				'me/followers': sign('flickr.contacts.getList', {per_page:'@{limit|50}'}),
				'me/albums': sign('flickr.photosets.getList', {per_page:'@{limit|50}'}),
				'me/album': sign('flickr.photosets.getPhotos', {photoset_id: '@{id}'}),
				'me/photos': sign('flickr.people.getPhotos', {per_page:'@{limit|50}'})
			},

			wrap: {
				me: function(o) {
					formatError(o);
					o = checkResponse(o, 'person');
					if (o.id) {
						if (o.realname) {
							o.name = o.realname._content;
							var m = o.name.split(' ');
							o.first_name = m.shift();
							o.last_name = m.join(' ');
						}

						o.thumbnail = getBuddyIcon(o, 'l');
						o.picture = getBuddyIcon(o, 'l');
					}

					return o;
				},

				'me/friends': formatFriends,
				'me/followers': formatFriends,
				'me/following': formatFriends,
				'me/albums': function(o) {
					formatError(o);
					o = checkResponse(o, 'photosets');
					paging(o);
					if (o.photoset) {
						o.data = o.photoset;
						o.data.forEach(function(item) {
							item.name = item.title._content;
							item.photos = 'https://api.flickr.com/services/rest' + getApiUrl('flickr.photosets.getPhotos', {photoset_id: item.id}, true);
						});

						delete o.photoset;
					}

					return o;
				},

				'me/photos': function(o) {
					formatError(o);
					return formatPhotos(o);
				},

				'default': function(o) {
					formatError(o);
					return formatPhotos(o);
				}
			},

			xhr: false,

			jsonp: function(p, qs) {
				if (p.method == 'get') {
					delete qs.callback;
					qs.jsoncallback = p.callbackID;
				}
			}
		}
	});

	function getApiUrl(method, extraParams, skipNetwork) {
		var url = ((skipNetwork) ? '' : 'flickr:') +
			'?method=' + method +
			'&api_key=' + hello.services.flickr.id +
			'&format=json';
		for (var param in extraParams) {
			if (extraParams.hasOwnProperty(param)) {
				url += '&' + param + '=' + extraParams[param];
			}
		}

		return url;
	}

	// This is not exactly neat but avoid to call
	// The method 'flickr.test.login' for each api call

	function withUser(cb) {
		var auth = hello.getAuthResponse('flickr');
		cb(auth && auth.user_nsid ? auth.user_nsid : null);
	}

	function sign(url, params) {
		if (!params) {
			params = {};
		}

		return function(p, callback) {
			withUser(function(userId) {
				params.user_id = userId;
				callback(getApiUrl(url, params, true));
			});
		};
	}

	function getBuddyIcon(profile, size) {
		var url = 'https://www.flickr.com/images/buddyicon.gif';
		if (profile.nsid && profile.iconserver && profile.iconfarm) {
			url = 'https://farm' + profile.iconfarm + '.staticflickr.com/' +
				profile.iconserver + '/' +
				'buddyicons/' + profile.nsid +
				((size) ? '_' + size : '') + '.jpg';
		}

		return url;
	}

	// See: https://www.flickr.com/services/api/misc.urls.html
	function createPhotoUrl(id, farm, server, secret, size) {
		size = (size) ? '_' + size : '';
		return 'https://farm' + farm + '.staticflickr.com/' + server + '/' + id + '_' + secret + size + '.jpg';
	}

	function formatUser(o) {
	}

	function formatError(o) {
		if (o && o.stat && o.stat.toLowerCase() != 'ok') {
			o.error = {
				code: 'invalid_request',
				message: o.message
			};
		}
	}

	function formatPhotos(o) {
		if (o.photoset || o.photos) {
			var set = ('photoset' in o) ? 'photoset' : 'photos';
			o = checkResponse(o, set);
			paging(o);
			o.data = o.photo;
			delete o.photo;
			for (var i = 0; i < o.data.length; i++) {
				var photo = o.data[i];
				photo.name = photo.title;
				photo.picture = createPhotoUrl(photo.id, photo.farm, photo.server, photo.secret, '');
				photo.pictures = createPictures(photo.id, photo.farm, photo.server, photo.secret);
				photo.source = createPhotoUrl(photo.id, photo.farm, photo.server, photo.secret, 'b');
				photo.thumbnail = createPhotoUrl(photo.id, photo.farm, photo.server, photo.secret, 'm');
			}
		}

		return o;
	}

	// See: https://www.flickr.com/services/api/misc.urls.html
	function createPictures(id, farm, server, secret) {

		var NO_LIMIT = 2048;
		var sizes = [
			{id: 't', max: 100},
			{id: 'm', max: 240},
			{id: 'n', max: 320},
			{id: '', max: 500},
			{id: 'z', max: 640},
			{id: 'c', max: 800},
			{id: 'b', max: 1024},
			{id: 'h', max: 1600},
			{id: 'k', max: 2048},
			{id: 'o', max: NO_LIMIT}
		];

		return sizes.map(function(size) {
			return {
				source: createPhotoUrl(id, farm, server, secret, size.id),

				// Note: this is a guess that's almost certain to be wrong (unless square source)
				width: size.max,
				height: size.max
			};
		});
	}

	function checkResponse(o, key) {

		if (key in o) {
			o = o[key];
		}
		else if (!('error' in o)) {
			o.error = {
				code: 'invalid_request',
				message: o.message || 'Failed to get data from Flickr'
			};
		}

		return o;
	}

	function formatFriends(o) {
		formatError(o);
		if (o.contacts) {
			o = checkResponse(o, 'contacts');
			paging(o);
			o.data = o.contact;
			delete o.contact;
			for (var i = 0; i < o.data.length; i++) {
				var item = o.data[i];
				item.id = item.nsid;
				item.name = item.realname || item.username;
				item.thumbnail = getBuddyIcon(item, 'm');
			}
		}

		return o;
	}

	function paging(res) {
		if (res.page && res.pages && res.page !== res.pages) {
			res.paging = {
				next: '?page=' + (++res.page)
			};
		}
	}

})(hello);

(function(hello) {

	hello.init({

		foursquare: {

			name: 'Foursquare',

			oauth: {
				// See: https://developer.foursquare.com/overview/auth
				version: 2,
				auth: 'https://foursquare.com/oauth2/authenticate',
				grant: 'https://foursquare.com/oauth2/access_token'
			},

			// Refresh the access_token once expired
			refresh: true,

			base: 'https://api.foursquare.com/v2/',

			get: {
				me: 'users/self',
				'me/friends': 'users/self/friends',
				'me/followers': 'users/self/friends',
				'me/following': 'users/self/friends'
			},

			wrap: {
				me: function(o) {
					formatError(o);
					if (o && o.response) {
						o = o.response.user;
						formatUser(o);
					}

					return o;
				},

				'default': function(o) {
					formatError(o);

					// Format friends
					if (o && 'response' in o && 'friends' in o.response && 'items' in o.response.friends) {
						o.data = o.response.friends.items;
						o.data.forEach(formatUser);
						delete o.response;
					}

					return o;
				}
			},

			xhr: formatRequest,
			jsonp: formatRequest
		}
	});

	function formatError(o) {
		if (o.meta && (o.meta.code === 400 || o.meta.code === 401)) {
			o.error = {
				code: 'access_denied',
				message: o.meta.errorDetail
			};
		}
	}

	function formatUser(o) {
		if (o && o.id) {
			o.thumbnail = o.photo.prefix + '100x100' + o.photo.suffix;
			o.name = o.firstName + ' ' + o.lastName;
			o.first_name = o.firstName;
			o.last_name = o.lastName;
			if (o.contact) {
				if (o.contact.email) {
					o.email = o.contact.email;
				}
			}
		}
	}

	function formatRequest(p, qs) {
		var token = qs.access_token;
		delete qs.access_token;
		qs.oauth_token = token;
		qs.v = 20121125;
		return true;
	}

})(hello);

(function(hello) {

	hello.init({

		github: {

			name: 'GitHub',

			oauth: {
				version: 2,
				auth: 'https://github.com/login/oauth/authorize',
				grant: 'https://github.com/login/oauth/access_token',
				response_type: 'code'
			},

			scope: {
				basic: '',
				email: 'user:email'
			},

			base: 'https://api.github.com/',

			get: {
				me: 'user',
				'me/friends': 'user/following?per_page=@{limit|100}',
				'me/following': 'user/following?per_page=@{limit|100}',
				'me/followers': 'user/followers?per_page=@{limit|100}',
				'me/like': 'user/starred?per_page=@{limit|100}'
			},

			wrap: {
				me: function(o, headers) {

					formatError(o, headers);
					formatUser(o);

					return o;
				},

				'default': function(o, headers, req) {

					formatError(o, headers);

					if (Array.isArray(o)) {
						o = {data:o};
					}

					if (o.data) {
						paging(o, headers, req);
						o.data.forEach(formatUser);
					}

					return o;
				}
			},

			xhr: function(p) {

				if (p.method !== 'get' && p.data) {

					// Serialize payload as JSON
					p.headers = p.headers || {};
					p.headers['Content-Type'] = 'application/json';
					if (typeof (p.data) === 'object') {
						p.data = JSON.stringify(p.data);
					}
				}

				return true;
			}
		}
	});

	function formatError(o, headers) {
		var code = headers ? headers.statusCode : (o && 'meta' in o && 'status' in o.meta && o.meta.status);
		if ((code === 401 || code === 403)) {
			o.error = {
				code: 'access_denied',
				message: o.message || (o.data ? o.data.message : 'Could not get response')
			};
			delete o.message;
		}
	}

	function formatUser(o) {
		if (o.id) {
			o.thumbnail = o.picture = o.avatar_url;
			o.name = o.login;
		}
	}

	function paging(res, headers, req) {
		if (res.data && res.data.length && headers && headers.Link) {
			var next = headers.Link.match(/<(.*?)>;\s*rel=\"next\"/);
			if (next) {
				res.paging = {
					next: next[1]
				};
			}
		}
	}

})(hello);

(function(hello) {

	var contactsUrl = 'https://www.google.com/m8/feeds/contacts/default/full?v=3.0&alt=json&max-results=@{limit|1000}&start-index=@{start|1}';

	hello.init({

		google: {

			name: 'Google Plus',

			// See: http://code.google.com/apis/accounts/docs/OAuth2UserAgent.html
			oauth: {
				version: 2,
				auth: 'https://accounts.google.com/o/oauth2/auth',
				grant: 'https://accounts.google.com/o/oauth2/token'
			},

			// Authorization scopes
			scope: {
				basic: 'https://www.googleapis.com/auth/plus.me profile',
				email: 'email',
				birthday: '',
				events: '',
				photos: 'https://picasaweb.google.com/data/',
				videos: 'http://gdata.youtube.com',
				friends: 'https://www.google.com/m8/feeds, https://www.googleapis.com/auth/plus.login',
				files: 'https://www.googleapis.com/auth/drive.readonly',
				publish: '',
				publish_files: 'https://www.googleapis.com/auth/drive',
				create_event: '',
				offline_access: ''
			},

			scope_delim: ' ',

			login: function(p) {
				if (p.qs.display === 'none') {
					// Google doesn't like display=none
					p.qs.display = '';
				}

				if (p.qs.response_type === 'code') {

					// Let's set this to an offline access to return a refresh_token
					p.qs.access_type = 'offline';
				}

				// Reauthenticate
				// https://developers.google.com/identity/protocols/
				if (p.options.force) {
					p.qs.approval_prompt = 'force';
				}
			},

			// API base URI
			base: 'https://www.googleapis.com/',

			// Map GET requests
			get: {
				me: 'plus/v1/people/me',

				// Deprecated Sept 1, 2014
				//'me': 'oauth2/v1/userinfo?alt=json',

				// See: https://developers.google.com/+/api/latest/people/list
				'me/friends': 'plus/v1/people/me/people/visible?maxResults=@{limit|100}',
				'me/following': contactsUrl,
				'me/followers': contactsUrl,
				'me/contacts': contactsUrl,
				'me/share': 'plus/v1/people/me/activities/public?maxResults=@{limit|100}',
				'me/feed': 'plus/v1/people/me/activities/public?maxResults=@{limit|100}',
				'me/albums': 'https://picasaweb.google.com/data/feed/api/user/default?alt=json&max-results=@{limit|100}&start-index=@{start|1}',
				'me/album': function(p, callback) {
					var key = p.query.id;
					delete p.query.id;
					callback(key.replace('/entry/', '/feed/'));
				},

				'me/photos': 'https://picasaweb.google.com/data/feed/api/user/default?alt=json&kind=photo&max-results=@{limit|100}&start-index=@{start|1}',

				// See: https://developers.google.com/drive/v2/reference/files/list
				'me/files': 'drive/v2/files?q=%22@{parent|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}',

				// See: https://developers.google.com/drive/v2/reference/files/list
				'me/folders': 'drive/v2/files?q=%22@{id|root}%22+in+parents+and+mimeType+=+%22application/vnd.google-apps.folder%22+and+trashed=false&maxResults=@{limit|100}',

				// See: https://developers.google.com/drive/v2/reference/files/list
				'me/folder': 'drive/v2/files?q=%22@{id|root}%22+in+parents+and+trashed=false&maxResults=@{limit|100}'
			},

			// Map POST requests
			post: {

				// Google Drive
				'me/files': uploadDrive,
				'me/folders': function(p, callback) {
					p.data = {
						title: p.data.name,
						parents: [{id: p.data.parent || 'root'}],
						mimeType: 'application/vnd.google-apps.folder'
					};
					callback('drive/v2/files');
				}
			},

			// Map PUT requests
			put: {
				'me/files': uploadDrive
			},

			// Map DELETE requests
			del: {
				'me/files': 'drive/v2/files/@{id}',
				'me/folder': 'drive/v2/files/@{id}'
			},

			wrap: {
				me: function(o) {
					if (o.id) {
						o.last_name = o.family_name || (o.name ? o.name.familyName : null);
						o.first_name = o.given_name || (o.name ? o.name.givenName : null);

						if (o.emails && o.emails.length) {
							o.email = o.emails[0].value;
						}

						formatPerson(o);
					}

					return o;
				},

				'me/friends': function(o) {
					if (o.items) {
						paging(o);
						o.data = o.items;
						o.data.forEach(formatPerson);
						delete o.items;
					}

					return o;
				},

				'me/contacts': formatFriends,
				'me/followers': formatFriends,
				'me/following': formatFriends,
				'me/share': formatFeed,
				'me/feed': formatFeed,
				'me/albums': gEntry,
				'me/photos': formatPhotos,
				'default': gEntry
			},

			xhr: function(p) {

				if (p.method === 'post' || p.method === 'put') {
					toJSON(p);
				}

				return true;
			},

			// Don't even try submitting via form.
			// This means no POST operations in <=IE9
			form: false
		}
	});

	function toInt(s) {
		return parseInt(s, 10);
	}

	function formatFeed(o) {
		paging(o);
		o.data = o.items;
		delete o.items;
		return o;
	}

	// Format: ensure each record contains a name, id etc.
	function formatItem(o) {
		if (o.error) {
			return;
		}

		if (!o.name) {
			o.name = o.title || o.message;
		}

		if (!o.picture) {
			o.picture = o.thumbnailLink;
		}

		if (!o.thumbnail) {
			o.thumbnail = o.thumbnailLink;
		}

		if (o.mimeType === 'application/vnd.google-apps.folder') {
			o.type = 'folder';
			o.files = 'https://www.googleapis.com/drive/v2/files?q=%22' + o.id + '%22+in+parents';
		}

		return o;
	}

	function formatImage(image) {
		return {
			source: image.url,
			width: image.width,
			height: image.height
		};
	}

	function formatPhotos(o) {
		o.data = o.feed.entry.map(formatEntry);
		delete o.feed;
	}

	// Google has a horrible JSON API
	function gEntry(o) {
		paging(o);

		if ('feed' in o && 'entry' in o.feed) {
			o.data = o.feed.entry.map(formatEntry);
			delete o.feed;
		}

		// Old style: Picasa, etc.
		else if ('entry' in o) {
			return formatEntry(o.entry);
		}

		// New style: Google Drive & Plus
		else if ('items' in o) {
			o.data = o.items.map(formatItem);
			delete o.items;
		}
		else {
			formatItem(o);
		}

		return o;
	}

	function formatPerson(o) {
		o.name = o.displayName || o.name;
		o.picture = o.picture || (o.image ? o.image.url : null);
		o.thumbnail = o.picture;
	}

	function formatFriends(o, headers, req) {
		paging(o);
		var r = [];
		if ('feed' in o && 'entry' in o.feed) {
			var token = req.query.access_token;
			for (var i = 0; i < o.feed.entry.length; i++) {
				var a = o.feed.entry[i];

				a.id	= a.id.$t;
				a.name	= a.title.$t;
				delete a.title;
				if (a.gd$email) {
					a.email	= (a.gd$email && a.gd$email.length > 0) ? a.gd$email[0].address : null;
					a.emails = a.gd$email;
					delete a.gd$email;
				}

				if (a.updated) {
					a.updated = a.updated.$t;
				}

				if (a.link) {

					var pic = (a.link.length > 0) ? a.link[0].href : null;
					if (pic && a.link[0].gd$etag) {
						pic += (pic.indexOf('?') > -1 ? '&' : '?') + 'access_token=' + token;
						a.picture = pic;
						a.thumbnail = pic;
					}

					delete a.link;
				}

				if (a.category) {
					delete a.category;
				}
			}

			o.data = o.feed.entry;
			delete o.feed;
		}

		return o;
	}

	function formatEntry(a) {

		var group = a.media$group;
		var photo = group.media$content.length ? group.media$content[0] : {};
		var mediaContent = group.media$content || [];
		var mediaThumbnail = group.media$thumbnail || [];

		var pictures = mediaContent
			.concat(mediaThumbnail)
			.map(formatImage)
			.sort(function(a, b) {
				return a.width - b.width;
			});

		var i = 0;
		var _a;
		var p = {
			id: a.id.$t,
			name: a.title.$t,
			description: a.summary.$t,
			updated_time: a.updated.$t,
			created_time: a.published.$t,
			picture: photo ? photo.url : null,
			pictures: pictures,
			images: [],
			thumbnail: photo ? photo.url : null,
			width: photo.width,
			height: photo.height
		};

		// Get feed/children
		if ('link' in a) {
			for (i = 0; i < a.link.length; i++) {
				var d = a.link[i];
				if (d.rel.match(/\#feed$/)) {
					p.upload_location = p.files = p.photos = d.href;
					break;
				}
			}
		}

		// Get images of different scales
		if ('category' in a && a.category.length) {
			_a = a.category;
			for (i = 0; i < _a.length; i++) {
				if (_a[i].scheme && _a[i].scheme.match(/\#kind$/)) {
					p.type = _a[i].term.replace(/^.*?\#/, '');
				}
			}
		}

		// Get images of different scales
		if ('media$thumbnail' in group && group.media$thumbnail.length) {
			_a = group.media$thumbnail;
			p.thumbnail = _a[0].url;
			p.images = _a.map(formatImage);
		}

		_a = group.media$content;

		if (_a && _a.length) {
			p.images.push(formatImage(_a[0]));
		}

		return p;
	}

	function paging(res) {

		// Contacts V2
		if ('feed' in res && res.feed.openSearch$itemsPerPage) {
			var limit = toInt(res.feed.openSearch$itemsPerPage.$t);
			var start = toInt(res.feed.openSearch$startIndex.$t);
			var total = toInt(res.feed.openSearch$totalResults.$t);

			if ((start + limit) < total) {
				res.paging = {
					next: '?start=' + (start + limit)
				};
			}
		}
		else if ('nextPageToken' in res) {
			res.paging = {
				next: '?pageToken=' + res.nextPageToken
			};
		}
	}

	// Construct a multipart message
	function Multipart() {

		// Internal body
		var body = [];
		var boundary = (Math.random() * 1e10).toString(32);
		var counter = 0;
		var lineBreak = '\r\n';
		var delim = lineBreak + '--' + boundary;
		var ready = function() {};

		var dataUri = /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i;

		// Add file
		function addFile(item) {
			var fr = new FileReader();
			fr.onload = function(e) {
				addContent(btoa(e.target.result), item.type + lineBreak + 'Content-Transfer-Encoding: base64');
			};

			fr.readAsBinaryString(item);
		}

		// Add content
		function addContent(content, type) {
			body.push(lineBreak + 'Content-Type: ' + type + lineBreak + lineBreak + content);
			counter--;
			ready();
		}

		// Add new things to the object
		this.append = function(content, type) {

			// Does the content have an array
			if (typeof (content) === 'string' || !('length' in Object(content))) {
				// Converti to multiples
				content = [content];
			}

			for (var i = 0; i < content.length; i++) {

				counter++;

				var item = content[i];

				// Is this a file?
				// Files can be either Blobs or File types
				if (
					(typeof (File) !== 'undefined' && item instanceof File) ||
					(typeof (Blob) !== 'undefined' && item instanceof Blob)
				) {
					// Read the file in
					addFile(item);
				}

				// Data-URI?
				// Data:[<mime type>][;charset=<charset>][;base64],<encoded data>
				// /^data\:([^;,]+(\;charset=[^;,]+)?)(\;base64)?,/i
				else if (typeof (item) === 'string' && item.match(dataUri)) {
					var m = item.match(dataUri);
					addContent(item.replace(dataUri, ''), m[1] + lineBreak + 'Content-Transfer-Encoding: base64');
				}

				// Regular string
				else {
					addContent(item, type);
				}
			}
		};

		this.onready = function(fn) {
			ready = function() {
				if (counter === 0) {
					// Trigger ready
					body.unshift('');
					body.push('--');
					fn(body.join(delim), boundary);
					body = [];
				}
			};

			ready();
		};
	}

	// Upload to Drive
	// If this is PUT then only augment the file uploaded
	// PUT https://developers.google.com/drive/v2/reference/files/update
	// POST https://developers.google.com/drive/manage-uploads
	function uploadDrive(p, callback) {

		var data = {};

		// Test for DOM element
		if (p.data &&
			(typeof (HTMLInputElement) !== 'undefined' && p.data instanceof HTMLInputElement)
		) {
			p.data = {file: p.data};
		}

		if (!p.data.name && Object(Object(p.data.file).files).length && p.method === 'post') {
			p.data.name = p.data.file.files[0].name;
		}

		if (p.method === 'post') {
			p.data = {
				title: p.data.name,
				parents: [{id: p.data.parent || 'root'}],
				file: p.data.file
			};
		}
		else {

			// Make a reference
			data = p.data;
			p.data = {};

			// Add the parts to change as required
			if (data.parent) {
				p.data.parents = [{id: p.data.parent || 'root'}];
			}

			if (data.file) {
				p.data.file = data.file;
			}

			if (data.name) {
				p.data.title = data.name;
			}
		}

		// Extract the file, if it exists from the data object
		// If the File is an INPUT element lets just concern ourselves with the NodeList
		var file;
		if ('file' in p.data) {
			file = p.data.file;
			delete p.data.file;

			if (typeof (file) === 'object' && 'files' in file) {
				// Assign the NodeList
				file = file.files;
			}

			if (!file || !file.length) {
				callback({
					error: {
						code: 'request_invalid',
						message: 'There were no files attached with this request to upload'
					}
				});
				return;
			}
		}

		// Set type p.data.mimeType = Object(file[0]).type || 'application/octet-stream';

		// Construct a multipart message
		var parts = new Multipart();
		parts.append(JSON.stringify(p.data), 'application/json');

		// Read the file into a  base64 string... yep a hassle, i know
		// FormData doesn't let us assign our own Multipart headers and HTTP Content-Type
		// Alas GoogleApi need these in a particular format
		if (file) {
			parts.append(file);
		}

		parts.onready(function(body, boundary) {

			p.headers['content-type'] = 'multipart/related; boundary="' + boundary + '"';
			p.data = body;

			callback('upload/drive/v2/files' + (data.id ? '/' + data.id : '') + '?uploadType=multipart');
		});

	}

	function toJSON(p) {
		if (typeof (p.data) === 'object') {
			// Convert the POST into a javascript object
			try {
				p.data = JSON.stringify(p.data);
				p.headers['content-type'] = 'application/json';
			}
			catch (e) {}
		}
	}

})(hello);

(function(hello) {

	hello.init({

		instagram: {

			name: 'Instagram',

			oauth: {
				// See: http://instagram.com/developer/authentication/
				version: 2,
				auth: 'https://instagram.com/oauth/authorize/',
				grant: 'https://api.instagram.com/oauth/access_token'
			},

			// Refresh the access_token once expired
			refresh: true,

			scope: {
				basic: 'basic',
				friends: 'relationships',
				publish: 'likes comments'
			},

			scope_delim: ' ',

			login: function(p) {
				// Instagram throws errors like 'JavaScript API is unsupported' if the display is 'popup'.
				// Make the display anything but 'popup'
				p.qs.display = '';
			},

			base: 'https://api.instagram.com/v1/',

			get: {
				me: 'users/self',
				'me/feed': 'users/self/feed?count=@{limit|100}',
				'me/photos': 'users/self/media/recent?min_id=0&count=@{limit|100}',
				'me/friends': 'users/self/follows?count=@{limit|100}',
				'me/following': 'users/self/follows?count=@{limit|100}',
				'me/followers': 'users/self/followed-by?count=@{limit|100}',
				'friend/photos': 'users/@{id}/media/recent?min_id=0&count=@{limit|100}'
			},

			post: {
				'me/like': function(p, callback) {
					var id = p.data.id;
					p.data = {};
					callback('media/' + id + '/likes');
				}
			},

			del: {
				'me/like': 'media/@{id}/likes'
			},

			wrap: {
				me: function(o) {

					formatError(o);

					if ('data' in o) {
						o.id = o.data.id;
						o.thumbnail = o.data.profile_picture;
						o.name = o.data.full_name || o.data.username;
					}

					return o;
				},

				'me/friends': formatFriends,
				'me/following': formatFriends,
				'me/followers': formatFriends,
				'me/photos': function(o) {

					formatError(o);
					paging(o);

					if ('data' in o) {
						o.data = o.data.filter(function(d) {
							return d.type === 'image';
						});

						o.data.forEach(function(d) {
							d.name = d.caption ? d.caption.text : null;
							d.thumbnail = d.images.thumbnail.url;
							d.picture = d.images.standard_resolution.url;
							d.pictures = Object.keys(d.images)
								.map(function(key) {
									var image = d.images[key];
									return formatImage(image);
								})
								.sort(function(a, b) {
									return a.width - b.width;
								});
						});
					}

					return o;
				},

				'default': function(o) {
					o = formatError(o);
					paging(o);
					return o;
				}
			},

			// Instagram does not return any CORS Headers
			// So besides JSONP we're stuck with proxy
			xhr: function(p, qs) {

				var method = p.method;
				var proxy = method !== 'get';

				if (proxy) {

					if ((method === 'post' || method === 'put') && p.query.access_token) {
						p.data.access_token = p.query.access_token;
						delete p.query.access_token;
					}

					// No access control headers
					// Use the proxy instead
					p.proxy = proxy;
				}

				return proxy;
			},

			// No form
			form: false
		}
	});

	function formatImage(image) {
		return {
			source: image.url,
			width: image.width,
			height: image.height
		};
	}

	function formatError(o) {
		if (typeof o === 'string') {
			return {
				error: {
					code: 'invalid_request',
					message: o
				}
			};
		}

		if (o && 'meta' in o && 'error_type' in o.meta) {
			o.error = {
				code: o.meta.error_type,
				message: o.meta.error_message
			};
		}

		return o;
	}

	function formatFriends(o) {
		paging(o);
		if (o && 'data' in o) {
			o.data.forEach(formatFriend);
		}

		return o;
	}

	function formatFriend(o) {
		if (o.id) {
			o.thumbnail = o.profile_picture;
			o.name = o.full_name || o.username;
		}
	}

	// See: http://instagram.com/developer/endpoints/
	function paging(res) {
		if ('pagination' in res) {
			res.paging = {
				next: res.pagination.next_url
			};
			delete res.pagination;
		}
	}

})(hello);

(function(hello) {

	hello.init({

		joinme: {

			name: 'join.me',

			oauth: {
				version: 2,
				auth: 'https://secure.join.me/api/public/v1/auth/oauth2',
				grant: 'https://secure.join.me/api/public/v1/auth/oauth2'
			},

			refresh: false,

			scope: {
				basic: 'user_info',
				user: 'user_info',
				scheduler: 'scheduler',
				start: 'start_meeting'
			},

			scope_delim: ' ',

			login: function(p) {
				p.options.popup.width = 400;
				p.options.popup.height = 700;
			},

			base: 'https://api.join.me/v1/',

			get: {
				me: 'user',
				meetings: 'meetings',
				'meetings/info': 'meetings/@{id}'
			},

			post: {
				'meetings/start/adhoc': function(p, callback) {
					callback('meetings/start');
				},

				'meetings/start/scheduled': function(p, callback) {
					var meetingId = p.data.meetingId;
					p.data = {};
					callback('meetings/' + meetingId + '/start');
				},

				'meetings/schedule': function(p, callback) {
					callback('meetings');
				}
			},

			patch: {
				'meetings/update': function(p, callback) {
					callback('meetings/' + p.data.meetingId);
				}
			},

			del: {
				'meetings/delete': 'meetings/@{id}'
			},

			wrap: {
				me: function(o, headers) {
					formatError(o, headers);

					if (!o.email) {
						return o;
					}

					o.name = o.fullName;
					o.first_name = o.name.split(' ')[0];
					o.last_name = o.name.split(' ')[1];
					o.id = o.email;

					return o;
				},

				'default': function(o, headers) {
					formatError(o, headers);

					return o;
				}
			},

			xhr: formatRequest

		}
	});

	function formatError(o, headers) {
		var errorCode;
		var message;
		var details;

		if (o && ('Message' in o)) {
			message = o.Message;
			delete o.Message;

			if ('ErrorCode' in o) {
				errorCode = o.ErrorCode;
				delete o.ErrorCode;
			}
			else {
				errorCode = getErrorCode(headers);
			}

			o.error = {
				code: errorCode,
				message: message,
				details: o
			};
		}

		return o;
	}

	function formatRequest(p, qs) {
		// Move the access token from the request body to the request header
		var token = qs.access_token;
		delete qs.access_token;
		p.headers.Authorization = 'Bearer ' + token;

		// Format non-get requests to indicate json body
		if (p.method !== 'get' && p.data) {
			p.headers['Content-Type'] = 'application/json';
			if (typeof (p.data) === 'object') {
				p.data = JSON.stringify(p.data);
			}
		}

		if (p.method === 'put') {
			p.method = 'patch';
		}

		return true;
	}

	function getErrorCode(headers) {
		switch (headers.statusCode) {
			case 400:
				return 'invalid_request';
			case 403:
				return 'stale_token';
			case 401:
				return 'invalid_token';
			case 500:
				return 'server_error';
			default:
				return 'server_error';
		}
	}

}(hello));

(function(hello) {

	hello.init({

		linkedin: {

			oauth: {
				version: 2,
				response_type: 'code',
				auth: 'https://www.linkedin.com/uas/oauth2/authorization',
				grant: 'https://www.linkedin.com/uas/oauth2/accessToken'
			},

			// Refresh the access_token once expired
			refresh: true,

			scope: {
				basic: 'r_basicprofile',
				email: 'r_emailaddress',
				friends: '',
				publish: 'w_share'
			},
			scope_delim: ' ',

			base: 'https://api.linkedin.com/v1/',

			get: {
				me: 'people/~:(picture-url,first-name,last-name,id,formatted-name,email-address)',
				'me/friends': 'people/~/connections?count=@{limit|500}',
				'me/followers': 'people/~/connections?count=@{limit|500}',
				'me/following': 'people/~/connections?count=@{limit|500}',

				// See: http://developer.linkedin.com/documents/get-network-updates-and-statistics-api
				'me/share': 'people/~/network/updates?count=@{limit|250}'
			},

			post: {

				// See: https://developer.linkedin.com/documents/api-requests-json
				'me/share': function(p, callback) {
					var data = {
						visibility: {
							code: 'anyone'
						}
					};

					if (p.data.id) {

						data.attribution = {
							share: {
								id: p.data.id
							}
						};

					}
					else {
						data.comment = p.data.message;
						if (p.data.picture && p.data.link) {
							data.content = {
								'submitted-url': p.data.link,
								'submitted-image-url': p.data.picture
							};
						}
					}

					p.data = JSON.stringify(data);

					callback('people/~/shares?format=json');
				},

				'me/like': like
			},

			del:{
				'me/like': like
			},

			wrap: {
				me: function(o) {
					formatError(o);
					formatUser(o);
					return o;
				},

				'me/friends': formatFriends,
				'me/following': formatFriends,
				'me/followers': formatFriends,
				'me/share': function(o) {
					formatError(o);
					paging(o);
					if (o.values) {
						o.data = o.values.map(formatUser);
						o.data.forEach(function(item) {
							item.message = item.headline;
						});

						delete o.values;
					}

					return o;
				},

				'default': function(o, headers) {
					formatError(o);
					empty(o, headers);
					paging(o);
				}
			},

			jsonp: function(p, qs) {
				formatQuery(qs);
				if (p.method === 'get') {
					qs.format = 'jsonp';
					qs['error-callback'] = p.callbackID;
				}
			},

			xhr: function(p, qs) {
				if (p.method !== 'get') {
					formatQuery(qs);
					p.headers['Content-Type'] = 'application/json';

					// Note: x-li-format ensures error responses are not returned in XML
					p.headers['x-li-format'] = 'json';
					p.proxy = true;
					return true;
				}

				return false;
			}
		}
	});

	function formatError(o) {
		if (o && 'errorCode' in o) {
			o.error = {
				code: o.status,
				message: o.message
			};
		}
	}

	function formatUser(o) {
		if (o.error) {
			return;
		}

		o.first_name = o.firstName;
		o.last_name = o.lastName;
		o.name = o.formattedName || (o.first_name + ' ' + o.last_name);
		o.thumbnail = o.pictureUrl;
		o.email = o.emailAddress;
		return o;
	}

	function formatFriends(o) {
		formatError(o);
		paging(o);
		if (o.values) {
			o.data = o.values.map(formatUser);
			delete o.values;
		}

		return o;
	}

	function paging(res) {
		if ('_count' in res && '_start' in res && (res._count + res._start) < res._total) {
			res.paging = {
				next: '?start=' + (res._start + res._count) + '&count=' + res._count
			};
		}
	}

	function empty(o, headers) {
		if (JSON.stringify(o) === '{}' && headers.statusCode === 200) {
			o.success = true;
		}
	}

	function formatQuery(qs) {
		// LinkedIn signs requests with the parameter 'oauth2_access_token'
		// ... yeah another one who thinks they should be different!
		if (qs.access_token) {
			qs.oauth2_access_token = qs.access_token;
			delete qs.access_token;
		}
	}

	function like(p, callback) {
		p.headers['x-li-format'] = 'json';
		var id = p.data.id;
		p.data = (p.method !== 'delete').toString();
		p.method = 'put';
		callback('people/~/network/updates/key=' + id + '/is-liked');
	}

})(hello);

// See: https://developers.soundcloud.com/docs/api/reference
(function(hello) {

	hello.init({

		soundcloud: {
			name: 'SoundCloud',

			oauth: {
				version: 2,
				auth: 'https://soundcloud.com/connect',
				grant: 'https://soundcloud.com/oauth2/token'
			},

			// Request path translated
			base: 'https://api.soundcloud.com/',
			get: {
				me: 'me.json',

				// Http://developers.soundcloud.com/docs/api/reference#me
				'me/friends': 'me/followings.json',
				'me/followers': 'me/followers.json',
				'me/following': 'me/followings.json',

				// See: http://developers.soundcloud.com/docs/api/reference#activities
				'default': function(p, callback) {

					// Include '.json at the end of each request'
					callback(p.path + '.json');
				}
			},

			// Response handlers
			wrap: {
				me: function(o) {
					formatUser(o);
					return o;
				},

				'default': function(o) {
					if (Array.isArray(o)) {
						o = {
							data: o.map(formatUser)
						};
					}

					paging(o);
					return o;
				}
			},

			xhr: formatRequest,
			jsonp: formatRequest
		}
	});

	function formatRequest(p, qs) {
		// Alter the querystring
		var token = qs.access_token;
		delete qs.access_token;
		qs.oauth_token = token;
		qs['_status_code_map[302]'] = 200;
		return true;
	}

	function formatUser(o) {
		if (o.id) {
			o.picture = o.avatar_url;
			o.thumbnail = o.avatar_url;
			o.name = o.username || o.full_name;
		}

		return o;
	}

	// See: http://developers.soundcloud.com/docs/api/reference#activities
	function paging(res) {
		if ('next_href' in res) {
			res.paging = {
				next: res.next_href
			};
		}
	}

})(hello);

(function(hello) {

	var base = 'https://api.twitter.com/';

	hello.init({

		twitter: {

			// Ensure that you define an oauth_proxy
			oauth: {
				version: '1.0a',
				auth: base + 'oauth/authenticate',
				request: base + 'oauth/request_token',
				token: base + 'oauth/access_token'
			},

			login: function(p) {
				// Reauthenticate
				// https://dev.twitter.com/oauth/reference/get/oauth/authenticate
				var prefix = '?force_login=true';
				this.oauth.auth = this.oauth.auth.replace(prefix, '') + (p.options.force ? prefix : '');
			},

			base: base + '1.1/',

			get: {
				me: 'account/verify_credentials.json',
				'me/friends': 'friends/list.json?count=@{limit|200}',
				'me/following': 'friends/list.json?count=@{limit|200}',
				'me/followers': 'followers/list.json?count=@{limit|200}',

				// Https://dev.twitter.com/docs/api/1.1/get/statuses/user_timeline
				'me/share': 'statuses/user_timeline.json?count=@{limit|200}',

				// Https://dev.twitter.com/rest/reference/get/favorites/list
				'me/like': 'favorites/list.json?count=@{limit|200}'
			},

			post: {
				'me/share': function(p, callback) {

					var data = p.data;
					p.data = null;

					var status = [];

					// Change message to status
					if (data.message) {
						status.push(data.message);
						delete data.message;
					}

					// If link is given
					if (data.link) {
						status.push(data.link);
						delete data.link;
					}

					if (data.picture) {
						status.push(data.picture);
						delete data.picture;
					}

					// Compound all the components
					if (status.length) {
						data.status = status.join(' ');
					}

					// Tweet media
					if (data.file) {
						data['media[]'] = data.file;
						delete data.file;
						p.data = data;
						callback('statuses/update_with_media.json');
					}

					// Retweet?
					else if ('id' in data) {
						callback('statuses/retweet/' + data.id + '.json');
					}

					// Tweet
					else {
						// Assign the post body to the query parameters
						hello.utils.extend(p.query, data);
						callback('statuses/update.json?include_entities=1');
					}
				},

				// See: https://dev.twitter.com/rest/reference/post/favorites/create
				'me/like': function(p, callback) {
					var id = p.data.id;
					p.data = null;
					callback('favorites/create.json?id=' + id);
				}
			},

			del: {

				// See: https://dev.twitter.com/rest/reference/post/favorites/destroy
				'me/like': function() {
					p.method = 'post';
					var id = p.data.id;
					p.data = null;
					callback('favorites/destroy.json?id=' + id);
				}
			},

			wrap: {
				me: function(res) {
					formatError(res);
					formatUser(res);
					return res;
				},

				'me/friends': formatFriends,
				'me/followers': formatFriends,
				'me/following': formatFriends,

				'me/share': function(res) {
					formatError(res);
					paging(res);
					if (!res.error && 'length' in res) {
						return {data: res};
					}

					return res;
				},

				'default': function(res) {
					res = arrayToDataResponse(res);
					paging(res);
					return res;
				}
			},
			xhr: function(p) {

				// Rely on the proxy for non-GET requests.
				return (p.method !== 'get');
			}
		}
	});

	function formatUser(o) {
		if (o.id) {
			if (o.name) {
				var m = o.name.split(' ');
				o.first_name = m.shift();
				o.last_name = m.join(' ');
			}

			// See: https://dev.twitter.com/overview/general/user-profile-images-and-banners
			o.thumbnail = o.profile_image_url_https || o.profile_image_url;
		}

		return o;
	}

	function formatFriends(o) {
		formatError(o);
		paging(o);
		if (o.users) {
			o.data = o.users.map(formatUser);
			delete o.users;
		}

		return o;
	}

	function formatError(o) {
		if (o.errors) {
			var e = o.errors[0];
			o.error = {
				code: 'request_failed',
				message: e.message
			};
		}
	}

	// Take a cursor and add it to the path
	function paging(res) {
		// Does the response include a 'next_cursor_string'
		if ('next_cursor_str' in res) {
			// See: https://dev.twitter.com/docs/misc/cursoring
			res.paging = {
				next: '?cursor=' + res.next_cursor_str
			};
		}
	}

	function arrayToDataResponse(res) {
		return Array.isArray(res) ? {data: res} : res;
	}

	/**
	// The documentation says to define user in the request
	// Although its not actually required.

	var user_id;

	function withUserId(callback){
		if(user_id){
			callback(user_id);
		}
		else{
			hello.api('twitter:/me', function(o){
				user_id = o.id;
				callback(o.id);
			});
		}
	}

	function sign(url){
		return function(p, callback){
			withUserId(function(user_id){
				callback(url+'?user_id='+user_id);
			});
		};
	}
	*/

})(hello);

// Vkontakte (vk.com)
(function(hello) {

	hello.init({

		vk: {
			name: 'Vk',

			// See https://vk.com/dev/oauth_dialog
			oauth: {
				version: 2,
				auth: 'https://oauth.vk.com/authorize',
				grant: 'https://oauth.vk.com/access_token'
			},

			// Authorization scopes
			scope: {
				basic: '',
				email: 'email',
				offline_access: 'offline'
			},

			// Refresh the access_token
			refresh: true,

			login: function(p) {
				p.qs.display = window.navigator &&
					window.navigator.userAgent &&
					/ipad|phone|phone|android/.test(window.navigator.userAgent.toLowerCase()) ? 'mobile' : 'popup';
			},

			// API Base URL
			base: 'https://api.vk.com/method/',

			// Map GET requests
			get: {
				me: function(p, callback) {
					p.query.fields = 'id,first_name,last_name,photo_max';
					callback('users.get');
				}
			},

			wrap: {
				me: function(res, headers, req) {
					formatError(res);
					return formatUser(res, req);
				}
			},

			// No XHR
			xhr: false,

			// All requests should be JSONP as of missing CORS headers in https://api.vk.com/method/*
			jsonp: true,

			// No form
			form: false
		}
	});

	function formatUser(o, req) {

		if (o !== null && 'response' in o && o.response !== null && o.response.length) {
			o = o.response[0];
			o.id = o.uid;
			o.thumbnail = o.picture = o.photo_max;
			o.name = o.first_name + ' ' + o.last_name;

			if (req.authResponse && req.authResponse.email !== null)
				o.email = req.authResponse.email;
		}

		return o;
	}

	function formatError(o) {

		if (o.error) {
			var e = o.error;
			o.error = {
				code: e.error_code,
				message: e.error_msg
			};
		}
	}

})(hello);

(function(hello) {

	hello.init({
		windows: {
			name: 'Windows live',

			// REF: http://msdn.microsoft.com/en-us/library/hh243641.aspx
			oauth: {
				version: 2,
				auth: 'https://login.live.com/oauth20_authorize.srf',
				grant: 'https://login.live.com/oauth20_token.srf'
			},

			// Refresh the access_token once expired
			refresh: true,

			logout: function() {
				return 'http://login.live.com/oauth20_logout.srf?ts=' + (new Date()).getTime();
			},

			// Authorization scopes
			scope: {
				basic: 'wl.signin,wl.basic',
				email: 'wl.emails',
				birthday: 'wl.birthday',
				events: 'wl.calendars',
				photos: 'wl.photos',
				videos: 'wl.photos',
				friends: 'wl.contacts_emails',
				files: 'wl.skydrive',
				publish: 'wl.share',
				publish_files: 'wl.skydrive_update',
				create_event: 'wl.calendars_update,wl.events_create',
				offline_access: 'wl.offline_access'
			},

			// API base URL
			base: 'https://apis.live.net/v5.0/',

			// Map GET requests
			get: {

				// Friends
				me: 'me',
				'me/friends': 'me/friends',
				'me/following': 'me/contacts',
				'me/followers': 'me/friends',
				'me/contacts': 'me/contacts',

				'me/albums': 'me/albums',

				// Include the data[id] in the path
				'me/album': '@{id}/files',
				'me/photo': '@{id}',

				// Files
				'me/files': '@{parent|me/skydrive}/files',
				'me/folders': '@{id|me/skydrive}/files',
				'me/folder': '@{id|me/skydrive}/files'
			},

			// Map POST requests
			post: {
				'me/albums': 'me/albums',
				'me/album': '@{id}/files/',

				'me/folders': '@{id|me/skydrive/}',
				'me/files': '@{parent|me/skydrive}/files'
			},

			// Map DELETE requests
			del: {
				// Include the data[id] in the path
				'me/album': '@{id}',
				'me/photo': '@{id}',
				'me/folder': '@{id}',
				'me/files': '@{id}'
			},

			wrap: {
				me: formatUser,

				'me/friends': formatFriends,
				'me/contacts': formatFriends,
				'me/followers': formatFriends,
				'me/following': formatFriends,
				'me/albums': formatAlbums,
				'me/photos': formatDefault,
				'default': formatDefault
			},

			xhr: function(p) {
				if (p.method !== 'get' && p.method !== 'delete' && !hello.utils.hasBinary(p.data)) {

					// Does this have a data-uri to upload as a file?
					if (typeof (p.data.file) === 'string') {
						p.data.file = hello.utils.toBlob(p.data.file);
					}
					else {
						p.data = JSON.stringify(p.data);
						p.headers = {
							'Content-Type': 'application/json'
						};
					}
				}

				return true;
			},

			jsonp: function(p) {
				if (p.method !== 'get' && !hello.utils.hasBinary(p.data)) {
					p.data.method = p.method;
					p.method = 'get';
				}
			}
		}
	});

	function formatDefault(o) {
		if ('data' in o) {
			o.data.forEach(function(d) {
				if (d.picture) {
					d.thumbnail = d.picture;
				}

				if (d.images) {
					d.pictures = d.images
						.map(formatImage)
						.sort(function(a, b) {
							return a.width - b.width;
						});
				}
			});
		}

		return o;
	}

	function formatImage(image) {
		return {
			width: image.width,
			height: image.height,
			source: image.source
		};
	}

	function formatAlbums(o) {
		if ('data' in o) {
			o.data.forEach(function(d) {
				d.photos = d.files = 'https://apis.live.net/v5.0/' + d.id + '/photos';
			});
		}

		return o;
	}

	function formatUser(o, headers, req) {
		if (o.id) {
			var token = req.query.access_token;
			if (o.emails) {
				o.email = o.emails.preferred;
			}

			// If this is not an non-network friend
			if (o.is_friend !== false) {
				// Use the id of the user_id if available
				var id = (o.user_id || o.id);
				o.thumbnail = o.picture = 'https://apis.live.net/v5.0/' + id + '/picture?access_token=' + token;
			}
		}

		return o;
	}

	function formatFriends(o, headers, req) {
		if ('data' in o) {
			o.data.forEach(function(d) {
				formatUser(d, headers, req);
			});
		}

		return o;
	}

})(hello);

(function(hello) {

	hello.init({

		yahoo: {

			// Ensure that you define an oauth_proxy
			oauth: {
				version: '1.0a',
				auth: 'https://api.login.yahoo.com/oauth/v2/request_auth',
				request: 'https://api.login.yahoo.com/oauth/v2/get_request_token',
				token: 'https://api.login.yahoo.com/oauth/v2/get_token'
			},

			// Login handler
			login: function(p) {
				// Change the default popup window to be at least 560
				// Yahoo does dynamically change it on the fly for the signin screen (only, what if your already signed in)
				p.options.popup.width = 560;

				// Yahoo throws an parameter error if for whatever reason the state.scope contains a comma, so lets remove scope
				try {delete p.qs.state.scope;}
				catch (e) {}
			},

			base: 'https://social.yahooapis.com/v1/',

			get: {
				me: yql('select * from social.profile(0) where guid=me'),
				'me/friends': yql('select * from social.contacts(0) where guid=me'),
				'me/following': yql('select * from social.contacts(0) where guid=me')
			},
			wrap: {
				me: formatUser,

				// Can't get IDs
				// It might be better to loop through the social.relationship table with has unique IDs of users.
				'me/friends': formatFriends,
				'me/following': formatFriends,
				'default': paging
			}
		}
	});

	/*
		// Auto-refresh fix: bug in Yahoo can't get this to work with node-oauth-shim
		login : function(o){
			// Is the user already logged in
			var auth = hello('yahoo').getAuthResponse();

			// Is this a refresh token?
			if(o.options.display==='none'&&auth&&auth.access_token&&auth.refresh_token){
				// Add the old token and the refresh token, including path to the query
				// See http://developer.yahoo.com/oauth/guide/oauth-refreshaccesstoken.html
				o.qs.access_token = auth.access_token;
				o.qs.refresh_token = auth.refresh_token;
				o.qs.token_url = 'https://api.login.yahoo.com/oauth/v2/get_token';
			}
		},
	*/

	function formatError(o) {
		if (o && 'meta' in o && 'error_type' in o.meta) {
			o.error = {
				code: o.meta.error_type,
				message: o.meta.error_message
			};
		}
	}

	function formatUser(o) {

		formatError(o);
		if (o.query && o.query.results && o.query.results.profile) {
			o = o.query.results.profile;
			o.id = o.guid;
			o.last_name = o.familyName;
			o.first_name = o.givenName || o.nickname;
			var a = [];
			if (o.first_name) {
				a.push(o.first_name);
			}

			if (o.last_name) {
				a.push(o.last_name);
			}

			o.name = a.join(' ');
			o.email = (o.emails && o.emails[0]) ? o.emails[0].handle : null;
			o.thumbnail = o.image ? o.image.imageUrl : null;
		}

		return o;
	}

	function formatFriends(o, headers, request) {
		formatError(o);
		paging(o, headers, request);
		var contact;
		var field;
		if (o.query && o.query.results && o.query.results.contact) {
			o.data = o.query.results.contact;
			delete o.query;

			if (!Array.isArray(o.data)) {
				o.data = [o.data];
			}

			o.data.forEach(formatFriend);
		}

		return o;
	}

	function formatFriend(contact) {
		contact.id = null;
		(contact.fields || []).forEach(function(field) {
			if (field.type === 'email') {
				contact.email = field.value;
			}

			if (field.type === 'name') {
				contact.first_name = field.value.givenName;
				contact.last_name = field.value.familyName;
				contact.name = field.value.givenName + ' ' + field.value.familyName;
			}

			if (field.type === 'yahooid') {
				contact.id = field.value;
			}
		});
	}

	function paging(res, headers, request) {

		// See: http://developer.yahoo.com/yql/guide/paging.html#local_limits
		if (res.query && res.query.count && request.options) {
			res.paging = {
				next: '?start=' + (res.query.count + (+request.options.start || 1))
			};
		}

		return res;
	}

	function yql(q) {
		return 'https://query.yahooapis.com/v1/yql?q=' + (q + ' limit @{limit|100} offset @{start|0}').replace(/\s/g, '%20') + '&format=json';
	}

})(hello);

// Register as anonymous AMD module
if (typeof define === 'function' && define.amd) {
	define(function() {
		return hello;
	});
}

// CommonJS module for browserify
if (typeof module === 'object' && module.exports) {
	module.exports = hello;
}

}).call(this,require('_process'))

},{"_process":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _MiniBus2 = require('./MiniBus');

var _MiniBus3 = _interopRequireDefault(_MiniBus2);

/**
* Message BUS Interface is an extension of the MiniBus
* It doesn't support the default '*' listener, instead it uses the registry.resolve(..)
*/

var MessageBus = (function (_MiniBus) {
  _inherits(MessageBus, _MiniBus);

  /* private
  _registry: Registry
  */

  //TODO: future optimization
  //1. message batch processing with setInterval
  //2. resolve default gateway/protostub with register.resolve

  function MessageBus(registry) {
    _classCallCheck(this, MessageBus);

    _get(Object.getPrototypeOf(MessageBus.prototype), 'constructor', this).call(this);
    this._registry = registry;
  }

  _createClass(MessageBus, [{
    key: '_onPostMessage',
    value: function _onPostMessage(msg) {
      var _this = this;

      //resolve external protostub...
      _this._registry.resolve(msg.to).then(function (protoStubURL) {

        var itemList = _this._subscriptions[protoStubURL];
        if (itemList) {
          _this._publishOn(itemList, msg);
        }
      })['catch'](function (e) {
        console.log('PROTO-STUB-ERROR: ', e);
      });
    }
  }]);

  return MessageBus;
})(_MiniBus3['default']);

exports['default'] = MessageBus;
module.exports = exports['default'];

},{"./MiniBus":4}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _Pipeline = require('./Pipeline');

var _Pipeline2 = _interopRequireDefault(_Pipeline);

/**
* @author micaelpedrosa@gmail.com
* Minimal interface and implementation to send and receive messages. It can be reused in many type of components.
* Components that need a message system should receive this class as a dependency or extend it.
* Extensions should implement the following private methods: _onPostMessage and _registerExternalListener
*/

var MiniBus = (function () {
  /* private
  _msgId: number;
  _subscriptions: <url: MsgListener[]>
   _responseTimeOut: number
  _responseCallbacks: <url+id: (msg) => void>
   _pipeline: Pipeline
  */

  function MiniBus() {
    _classCallCheck(this, MiniBus);

    var _this = this;
    _this._msgId = 0;
    _this._subscriptions = {};

    _this._responseTimeOut = 3000; //default to 3s
    _this._responseCallbacks = {};

    _this._pipeline = new _Pipeline2['default'](function (error) {
      console.log('PIPELINE-ERROR: ', JSON.stringify(error));
    });

    _this._registerExternalListener();
  }

  _createClass(MiniBus, [{
    key: 'addListener',

    /**
    * Register listener to receive message when "msg.to === url".
    * Special url "*" for default listener is accepted to intercept all messages.
    * @param {URL} url Address to intercept, tha is in the message "to"
    * @param {Listener} listener listener
    * @return {MsgListener} instance of MsgListener
    */
    value: function addListener(url, listener) {
      var _this = this;

      var item = new MsgListener(_this._subscriptions, url, listener);
      var itemList = _this._subscriptions[url];
      if (!itemList) {
        itemList = [];
        _this._subscriptions[url] = itemList;
      }

      itemList.push(item);
      return item;
    }

    /**
     * Manually add a response listener. Only one listener per message ID should exist.
     * ATENTION, there is no timeout for this listener.
     * The listener should be removed with a removeResponseListener, failing to do this will result in a unreleased memory problem.
     * @param {URL} url Origin address of the message sent, "msg.from".
     * @param {number} msgId Message ID that is returned from the postMessage.
     * @param {Function} responseListener Callback function for the response
     */
  }, {
    key: 'addResponseListener',
    value: function addResponseListener(url, msgId, responseListener) {
      this._responseCallbacks[url + msgId] = responseListener;
    }

    /**
     * Remove the response listener.
     * @param {URL} url Origin address of the message sent, "msg.from".
     * @param {number} msgId  Message ID that is returned from the postMessage
     */
  }, {
    key: 'removeResponseListener',
    value: function removeResponseListener(url, msgId) {
      delete this._responseCallbacks[url + msgId];
    }

    /**
     * Remove all existent listeners for the URL
     * @param  {URL} url Address registered
     */
  }, {
    key: 'removeAllListenersOf',
    value: function removeAllListenersOf(url) {
      delete this._subscriptions[url];
    }

    /**
    * Send messages to local listeners, or if not exists to external listeners.
    * It's has an optional mechanism for automatic management of response handlers.
    * The response handler will be unregistered after receiving the response, or after response timeout (default to 3s).
    * @param  {Message} msg Message to send. Message ID is automatically added to the message.
    * @param  {Function} responseCallback Optional parameter, if the developer what's automatic response management.
    * @return {number} Returns the message ID, in case it should be needed for manual management of the response handler.
    */
  }, {
    key: 'postMessage',
    value: function postMessage(inMsg, responseCallback) {
      var _this = this;

      //TODO: how do we manage message ID's? Should it be a global runtime counter, or per URL address?
      //Global counter will not work, because there will be multiple MiniBus instances!
      //Per URL, can be a lot of data to maintain!
      //Maybe a counter per MiniBus instance. This is the assumed solution for now.
      if (!inMsg.id || inMsg.id === 0) {
        _this._msgId++;
        inMsg.id = _this._msgId;
      }

      _this._pipeline.process(inMsg, function (msg) {

        //automatic management of response handlers
        if (responseCallback) {
          (function () {
            var responseId = msg.from + msg.id;
            _this._responseCallbacks[responseId] = responseCallback;

            setTimeout(function () {
              var responseFun = _this._responseCallbacks[responseId];
              delete _this._responseCallbacks[responseId];

              if (responseFun) {
                var errorMsg = {
                  id: msg.id, type: 'response',
                  body: { code: 'error', desc: 'Response timeout!' }
                };

                responseFun(errorMsg);
              }
            }, _this._responseTimeOut);
          })();
        }

        if (!_this._onResponse(msg)) {
          var itemList = _this._subscriptions[msg.to];
          if (itemList) {
            //do not publish on default address, because of loopback cycle
            _this._publishOn(itemList, msg);
          } else {
            //if there is no listener, send to external interface
            _this._onPostMessage(msg);
          }
        }
      });

      return inMsg.id;
    }

    /**
     * Helper method to bind listeners (in both directions) into other MiniBus target.
     * @param  {URL} outUrl Outbound URL, register listener for url in direction "this -> target"
     * @param  {URL} inUrl Inbound URL, register listener for url in direction "target -> this"
     * @param  {MiniBus} target The other target MiniBus
     * @return {Bound} an object that contains the properties [thisListener, targetListener] and the unbind method.
     */
  }, {
    key: 'bind',
    value: function bind(outUrl, inUrl, target) {
      var _this2 = this;

      var _this = this;

      var thisListn = _this.addListener(outUrl, function (msg) {
        target.postMessage(msg);
      });

      var targetListn = target.addListener(inUrl, function (msg) {
        _this.postMessage(msg);
      });

      return {
        thisListener: thisListn,
        targetListener: targetListn,
        unbind: function unbind() {
          _this2.thisListener.remove();
          _this2.targetListener.remove();
        }
      };
    }

    //publish on a subscription list.
  }, {
    key: '_publishOn',
    value: function _publishOn(itemList, msg) {
      itemList.forEach(function (sub) {
        sub._callback(msg);
      });
    }
  }, {
    key: '_onResponse',
    value: function _onResponse(msg) {
      var _this = this;

      if (msg.type === 'response') {
        var responseId = msg.to + msg.id;
        var responseFun = _this._responseCallbacks[responseId];
        delete _this._responseCallbacks[responseId];

        if (responseFun) {
          responseFun(msg);
          return true;
        }
      }

      return false;
    }

    //receive messages from external interface
  }, {
    key: '_onMessage',
    value: function _onMessage(msg) {
      var _this = this;

      if (!_this._onResponse(msg)) {
        var itemList = _this._subscriptions[msg.to];
        if (itemList) {
          _this._publishOn(itemList, msg);
        } else {
          //is there any "*" (default) listeners?
          itemList = _this._subscriptions['*'];
          if (itemList) {
            _this._publishOn(itemList, msg);
          }
        }
      }
    }

    /**
     * Not public available, used by the class extension implementation, to process messages from the public "postMessage" without a registered listener.
     * Used to send the message to an external interface, like a WebWorker, IFrame, etc.
     * @param  {Message.Message} msg Message
     */
  }, {
    key: '_onPostMessage',
    value: function _onPostMessage(msg) {} /*implementation will send message to external system*/

    /**
     * Not public available, used by the class extension implementation, to process all messages that enter the MiniBus from an external interface, like a WebWorker, IFrame, etc.
     * This method is called one time in the constructor to register external listeners.
     * The implementation will probably call the "_onMessage" method to publish in the local listeners.
     * DO NOT call "postMessage", there is a danger that the message enters in a cycle!
     */

  }, {
    key: '_registerExternalListener',
    value: function _registerExternalListener() {/*implementation will register external listener and call "this._onMessage(msg)" */}
  }, {
    key: 'pipeline',
    get: function get() {
      return this._pipeline;
    }
  }]);

  return MiniBus;
})();

var MsgListener = (function () {
  /* private
  _subscriptions: <string: MsgListener[]>;
  _url: string;
  _callback: (msg) => void;
  */

  function MsgListener(subscriptions, url, callback) {
    _classCallCheck(this, MsgListener);

    var _this = this;

    _this._subscriptions = subscriptions;
    _this._url = url;
    _this._callback = callback;
  }

  _createClass(MsgListener, [{
    key: 'remove',
    value: function remove() {
      var _this = this;

      var subs = _this._subscriptions[_this._url];
      if (subs) {
        var index = subs.indexOf(_this);
        subs.splice(index, 1);

        //if there are no listeners, remove the subscription entirely.
        if (subs.length === 0) {
          delete _this._subscriptions[_this._url];
        }
      }
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return MsgListener;
})();

exports['default'] = MiniBus;
module.exports = exports['default'];

},{"./Pipeline":5}],5:[function(require,module,exports){
/**
* @author micaelpedrosa@gmail.com
* Pipeline
* Sequencial processor of methods. Similar to how Sequential Promise's work, but better fit for message processing.
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pipeline = (function () {
  /* public
    handlers: ((PipeContext) => void)[]
    onFail: (error) => void
  */

  function Pipeline(_onFail) {
    _classCallCheck(this, Pipeline);

    var _this = this;

    _this.handlers = [];
    _this.onFail = _onFail;
  }

  _createClass(Pipeline, [{
    key: "process",
    value: function process(msg, onDeliver) {
      var _this = this;

      if (_this.handlers.length > 0) {
        var iter = new Iterator(_this.handlers);
        iter.next(new PipeContext(_this, iter, msg, onDeliver));
      } else {
        onDeliver(msg);
      }
    }
  }]);

  return Pipeline;
})();

var PipeContext = (function () {
  /* private
    _inStop: boolean
     _pipeline: Pipeline
    _iter: Iterator
    _msg: Message
  */

  function PipeContext(pipeline, iter, msg, onDeliver) {
    _classCallCheck(this, PipeContext);

    var _this = this;

    _this._inStop = false;

    _this._pipeline = pipeline;
    _this._iter = iter;
    _this._msg = msg;
    _this._onDeliver = onDeliver;
  }

  _createClass(PipeContext, [{
    key: "next",
    value: function next() {
      var _this = this;

      if (!_this._inStop) {
        if (_this._iter.hasNext) {
          _this._iter.next(_this);
        } else {
          _this._onDeliver(_this._msg);
        }
      }
    }
  }, {
    key: "deliver",
    value: function deliver() {
      var _this = this;
      if (!_this._inStop) {
        _this._inStop = true;
        _this._onDeliver(_this._msg);
      }
    }
  }, {
    key: "fail",
    value: function fail(error) {
      var _this = this;

      if (!_this._inStop) {
        _this._inStop = true;
        if (_this._pipeline.onFail) {
          _this._pipeline.onFail(error);
        }
      }
    }
  }, {
    key: "pipeline",
    get: function get() {
      return this._pipeline;
    }
  }, {
    key: "msg",
    get: function get() {
      return this._msg;
    },
    set: function set(inMsg) {
      this._msg = inMsg;
    }
  }]);

  return PipeContext;
})();

var Iterator = (function () {
  /* private
    _index: number
    _array: []
  */

  function Iterator(array) {
    _classCallCheck(this, Iterator);

    this._index = -1;
    this._array = array;
  }

  _createClass(Iterator, [{
    key: "hasNext",
    get: function get() {
      return this._index < this._array.length - 1;
    }
  }, {
    key: "next",
    get: function get() {
      this._index++;
      return this._array[this._index];
    }
  }]);

  return Iterator;
})();

exports["default"] = Pipeline;
module.exports = exports["default"];

},{}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _hellojs = require('hellojs');

var _hellojs2 = _interopRequireDefault(_hellojs);

/**
* IdentityModule
*
* Initial specification: D4.1
*
* The IdentityModule is a component managing user Identity. It downloads, instantiates
* and manage Identity Provider Proxy (IdP) for its own user identity or for external
* user identity verification.
*
*/

var IdentityModule = (function () {

  /**
  * USER'S OWN IDENTITY
  */

  function IdentityModule() {
    _classCallCheck(this, IdentityModule);

    var _this = this;
    //to store items with this format: {identity: identityURL, token: tokenID}
    _this.identities = [];
  }

  /**
  * Register a new Identity with an Identity Provider
  */

  _createClass(IdentityModule, [{
    key: 'registerIdentity',
    value: function registerIdentity() {}
    // Body...

    /**
    * In relation with a classical Relying Party: Registration
    */

  }, {
    key: 'registerWithRP',
    value: function registerWithRP() {}
    // Body...

    /**
    * Find and return all available identities that can be associated to the Hyperty Instance
    * @return {Array<Identities>}         Array         Identities
    */

  }, {
    key: 'getIdentities',
    value: function getIdentities() {
      var _this = this;
      return _this.identities;
    }

    /**
    * In relation with a classical Relying Party: Login
    * @param  {Identifier}      identifier      identifier
    * @param  {Scope}           scope           scope
    * @return {Promise}         Promise         IDToken
    */
  }, {
    key: 'loginWithRP',
    value: function loginWithRP(identifier, scope) {
      var _this = this;

      /*
        When calling this function, if everything is fine, a small pop-up will open requesting a login with a google account. After the login is made, the pop-up will close and the function will return the ID token.
        This function was tested with the URL: http://127.0.0.1:8080/ and with the same redirect URI
       	In case the redirect URI is not accepted or is required to add others redirect URIs, a little information is provided to fix the problem:
       	So that an application can use Google's OAuth 2.0 authentication system for user login,
      	first is required to set up a project in the Google Developers Console to obtain OAuth 2.0 credentials and set a redirect URI.
      	A test account was created to set the project in the Google Developers Console to obtain OAuth 2.0 credentials,	with the following credentials:
           	username: openidtest10@gmail.com
             password: testOpenID10
       	To add more URI's, follow the steps:
      	1º choose the project ( can be the My OpenID Project)	 from  https://console.developers.google.com/projectselector/apis/credentials using the credentials provided above.
      	2º Open The Client Web 1 listed in OAuth 2.0 Client ID's
      	3º Add the URI  in the authorized redirect URI section.
        4º change the REDIRECT parameter bellow with the pretended URI
         identityModule._hello.init({google: "808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com"});
        identityModule._hello("google").login();
       */

      var VALIDURL = 'https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=';
      var USERINFURL = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token=';
      var acToken = undefined;
      var tokenType = undefined;
      var expiresIn = undefined;
      var user = undefined;
      var tokenID = undefined;
      var loggedIn = false;

      return new Promise(function (resolve, reject) {

        if (_this.token !== undefined) {
          //TODO verify whether the token is still valid or not.
          return resolve(_this.token);
        }

        //function to validate the access token received during the authentication
        function validateToken(token) {
          var req = new XMLHttpRequest();
          req.open('GET', VALIDURL + token, true);

          req.onreadystatechange = function (e) {
            if (req.readyState == 4) {
              if (req.status == 200) {

                getIDToken(token);
              } else if (req.status == 400) {
                reject('There was an error processing the token');
              } else {
                reject('something else other than 200 was returned');
              }
            }
          };
          req.send();
        }

        //function to exchange the access token with an ID Token containing the information
        function getIDToken(token) {
          var req = new XMLHttpRequest();
          req.open('GET', USERINFURL + token, true);

          req.onreadystatechange = function (e) {
            if (req.readyState == 4) {
              if (req.status == 200) {
                tokenID = JSON.parse(req.responseText);
                _this.token = tokenID;
                var email = tokenID.email;

                //contruct the identityURL to be defined as in specification
                // model: user://<idpdomain>/<user-identifier>
                var identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

                var identityBundle = { identity: identityURL, token: tokenID };

                _this.identities.push(identityBundle);
                resolve(tokenID);
              } else if (req.status == 400) {
                reject('There was an error processing the token');
              } else {
                reject('something else other than 200 was returned');
              }
            }
          };
          req.send();
        }

        _hellojs2['default'].init({ google: '808329566012-tqr8qoh111942gd2kg007t0s8f277roi.apps.googleusercontent.com' });
        (0, _hellojs2['default'])('google').login({ scope: 'email' }).then(function (token) {
          //console.log('validated: ',token.authResponse.access_token);
          validateToken(token.authResponse.access_token);
        }, function (error) {
          console.log('errorValidating ', error);
          reject(error);
        });
      });
    }

    /**
    * In relation with a Hyperty Instance: Associate identity
    */
  }, {
    key: 'setHypertyIdentity',
    value: function setHypertyIdentity() {}
    // Body...

    /**
    * Generates an Identity Assertion for a call session
    * @param  {DOMString} contents     contents
    * @param  {DOMString} origin       origin
    * @param  {DOMString} usernameHint usernameHint
    * @return {IdAssertion}              IdAssertion
    */

  }, {
    key: 'generateAssertion',
    value: function generateAssertion(contents, origin, usernameHint) {}
    // Body...

    /**
    * OTHER USER'S IDENTITY
    */

    /**
    * Verification of a received IdAssertion validity
    * @param  {DOMString} assertion assertion
    */

  }, {
    key: 'validateAssertion',
    value: function validateAssertion(assertion) {}
    // Body...

    /**
    * Trust level evaluation of a received IdAssertion
    * @param  {DOMString} assertion assertion
    */

  }, {
    key: 'getAssertionTrustLevel',
    value: function getAssertionTrustLevel(assertion) {
      // Body...
    }
  }]);

  return IdentityModule;
})();

exports['default'] = IdentityModule;
module.exports = exports['default'];

},{"hellojs":2}],7:[function(require,module,exports){
/**
 * Core Policy Engine (PDP/PEP) Interface
 * According to: https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md#core-policy-engine-pdppep-interface
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var PolicyEngine = (function () {

  /**
  * To initialise the Policy Engine
  * @param  {Identity Module}      identityModule      identityModule
  * @param  {Runtime Registry}    runtimeRegistry     runtimeRegistry
  */

  function PolicyEngine(identityModule, runtimeRegistry) {
    _classCallCheck(this, PolicyEngine);

    var _this = this;
    _this.idModule = identityModule;
    _this.registry = runtimeRegistry;
    _this.policiesTable = new Object();
    /* assumes the Policy Engine has the blacklist */
    _this.blacklist = [];
    /* _this.blacklist.push('Alice');*/
  }

  /**
   * To add policies to be enforced for a certain deployed Hyperty Instance
   * Example of an hyperty: hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
   * Example of a policy: {subject: 'message.header.from', target: 'blacklist', action: 'deny'}
   * @param {URL.HypertyURL}     hyperty  hyperty
   * @param {HypertyPolicyList}  policies policies
   */

  _createClass(PolicyEngine, [{
    key: 'addPolicies',
    value: function addPolicies(hyperty, policies) {
      var _this = this;
      _this.policiesTable[hyperty] = policies;
    }

    /**
     * To remove previously added policies for a certain deployed Hyperty Instance
     * @param  {URL.HypertyURL}  hyperty       hyperty
     */
  }, {
    key: 'removePolicies',
    value: function removePolicies(hyperty) {
      var _this = this;
      delete _this.policiesTable[hyperty];
    }

    /**
     * Authorisation request to accept a Subscription for a certain resource. Returns a Response Message to be returned to Subscription requester
     * @param  {Message.Message} message       message
     * @return {AuthorisationResponse}                 AuthorisationResponse
     */
  }, {
    key: 'authorise',
    value: function authorise(message) {
      var _this = this;
      console.log(_this.policiesTable);
      return new Promise(function (resolve, reject) {
        if (_this.checkPolicies(message) == 'allow') {
          /*let hypertyIdentity = _this.registry.getHypertyIdentity(message.body.hypertyURL);
          //this step assume the hypertyIdentity will be google */
          _this.idModule.loginWithRP('google identity', 'scope').then(function (value) {
            var assertedID = _this.idModule.getIdentities();
            message.body.assertedIdentity = assertedID[0].identity;
            message.body.idToken = JSON.stringify(value);
            message.body.authorised = true;
            resolve(message);
          }, function (error) {
            reject(error);
          });
        } else {
          resolve(false);
        }
      });
    }
  }, {
    key: 'checkPolicies',
    value: function checkPolicies(message) {
      var _this = this;
      var _results = ['allow']; /* by default, all messages are allowed */
      var _policies = _this.policiesTable[message.body.hypertyURL];
      if (_policies != undefined) {
        /* if there are applicable policies, checks them */
        var _numPolicies = _policies.length;

        for (var i = 0; i < _numPolicies; i++) {
          var _policy = _policies[i];
          console.log(_policy);
          if (_policy.target == 'blacklist') {
            if (_this.blacklist.indexOf(eval(_policy.subject)) > -1) {
              console.log('Is in blacklist!');
              _results.push(_policy.action);
            }
          }
          if (_policy.target == 'whitelist') {
            if (_this.whitelist.indexOf(eval(_policy.subject)) > -1) {
              console.log('Is in whitelist!');
              _results.push(_policy.action);
            }
          }
        }
      }
      console.log(_results);
      if (_results.indexOf('deny') > -1) {
        /* if one policy evaluates to 'deny', the result is 'deny' */
        return 'deny';
      } else {
        return 'allow';
      }
    }
  }]);

  return PolicyEngine;
})();

exports['default'] = PolicyEngine;
module.exports = exports['default'];

},{}],8:[function(require,module,exports){
// import MessageFactory from '../../resources/MessageFactory';

/**
 * Class will ask to the message node for addresses
 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var AddressAllocation = (function () {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Address Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */

  function AddressAllocation(url, bus) {
    _classCallCheck(this, AddressAllocation);

    var _this = this;

    // let messageFactory = new MessageFactory();
    //
    // _this._messageFactory = messageFactory;
    _this._url = url;
    _this._bus = bus;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */

  _createClass(AddressAllocation, [{
    key: 'create',

    /**
     * Ask for creation of a number of Hyperty addresses, to the domain message node.
     * @param  {Domain} domain - Domain of the message node.
     * @param  {number} number - Number of addresses to request
     * @returns {Promise<HypertyURL>}  A list of HypertyURL's
     */
    value: function create(domain, number) {
      var _this = this;

      // let messageFactory = _this._messageFactory;

      var msg = {
        type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/hyperty-address-allocation',
        body: { number: number }
      };

      // TODO: Apply the message factory
      // The msg-node-vertx should be changed the body field to receive
      // the following format body: {value: {number: number}} because
      // the message is generated in that way by the message factory;
      // let msg = messageFactory.createMessageRequest(_this._url, 'domain://msg-node.' + domain + '/hyperty-address-allocation', '', {number: number});

      return new Promise(function (resolve, reject) {

        // TODO: change this response Message using the MessageFactory
        _this._bus.postMessage(msg, function (reply) {
          if (reply.body.code === 200) {
            resolve(reply.body.allocated);
          } else {
            reject(reply.body.desc);
          }
        });
      });
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return AddressAllocation;
})();

exports['default'] = AddressAllocation;
module.exports = exports['default'];

},{}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _RegistryDataModel2 = require('./RegistryDataModel');

var _RegistryDataModel3 = _interopRequireDefault(_RegistryDataModel2);

/**
*   @author: Gil Dias (gil.dias@tecnico.ulisboa.pt)
*   HypertyInstance Data Model used to model instances of Hyperties running in devices and servers.
*/

var HypertyInstance = (function (_RegistryDataModel) {
  _inherits(HypertyInstance, _RegistryDataModel);

  function HypertyInstance(id, url, descriptor, hypertyURL, user, guid, runtime, context) {
    _classCallCheck(this, HypertyInstance);

    _get(Object.getPrototypeOf(HypertyInstance.prototype), 'constructor', this).call(this, id, url, descriptor);
    var _this = this;
    _this._hypertyURL = hypertyURL;
    _this._user = user;
    _this._guid = guid;
    _this._runtime = runtime;
    _this._context = context;
  }

  _createClass(HypertyInstance, [{
    key: 'user',
    set: function set(identity) {
      var _this = this;
      _this.user = identity;
    },
    get: function get() {
      var _this = this;
      return _this._user;
    }
  }, {
    key: 'hypertyURL',
    get: function get() {
      var _this = this;
      return _this._hypertyURL;
    }
  }]);

  return HypertyInstance;
})(_RegistryDataModel3['default']);

exports['default'] = HypertyInstance;
module.exports = exports['default'];

},{"./RegistryDataModel":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _utilsEventEmitter = require('../utils/EventEmitter');

var _utilsEventEmitter2 = _interopRequireDefault(_utilsEventEmitter);

var _AddressAllocation = require('./AddressAllocation');

var _AddressAllocation2 = _interopRequireDefault(_AddressAllocation);

var _HypertyInstance = require('./HypertyInstance');

var _HypertyInstance2 = _interopRequireDefault(_HypertyInstance);

var _utilsUtilsJs = require('../utils/utils.js');

/**
* Runtime Registry Interface
*/

var Registry = (function (_EventEmitter) {
  _inherits(Registry, _EventEmitter);

  /**
  * To initialise the Runtime Registry with the RuntimeURL that will be the basis to derive the internal runtime addresses when allocating addresses to internal runtime component. In addition, the Registry domain back-end to be used to remotely register Runtime components, is also passed as input parameter.
  * @param  {MessageBus}          msgbus                msgbus
  * @param  {HypertyRuntimeURL}   runtimeURL            runtimeURL
  * @param  {AppSandbox}          appSandbox            appSandbox
  * @param  {DomainURL}           remoteRegistry        remoteRegistry
  */

  function Registry(runtimeURL, appSandbox, identityModule, remoteRegistry) {
    _classCallCheck(this, Registry);

    _get(Object.getPrototypeOf(Registry.prototype), 'constructor', this).call(this);

    // how some functions receive the parameters for example:
    // new Registry('hyperty-runtime://sp1/123', appSandbox, idModule, remoteRegistry);
    // registry.registerStub(sandbox, 'sp1');
    // registry.registerHyperty(sandBox, 'hyperty-runtime://sp1/123');
    // registry.resolve('hyperty-runtime://sp1/123');

    if (!runtimeURL) throw new Error('runtimeURL is missing.');
    /*if (!remoteRegistry) throw new Error('remoteRegistry is missing');*/

    var _this = this;

    _this.registryURL = runtimeURL + '/registry/123';
    _this.appSandbox = appSandbox;
    _this.runtimeURL = runtimeURL;
    _this.remoteRegistry = remoteRegistry;
    _this.idModule = identityModule;
    _this.identifier = Math.floor(Math.random() * 10000 + 1);

    _this.hypertiesListToRemove = {};
    _this.hypertiesList = [];
    _this.protostubsList = {};
    _this.sandboxesList = {};
    _this.pepList = {};
  }

  /**
  * return the messageBus in this Registry
  * @param {MessageBus}           messageBus
  */

  _createClass(Registry, [{
    key: 'getAppSandbox',

    /**
    * This function is used to return the sandbox instance where the Application is executing. It is assumed there is just one App per Runtime instance.
    */
    value: function getAppSandbox() {
      var _this = this;
      return _this.appSandbox;
    }

    /**
    * Function to query the Domain registry, with an user email.
    */
  }, {
    key: 'getUserHyperty',
    value: function getUserHyperty(email) {
      var _this = this;
      var identityURL = 'user://' + email.substring(email.indexOf('@') + 1, email.length) + '/' + email.substring(0, email.indexOf('@'));

      var msg = {
        id: 98, type: 'READ', from: _this.registryURL, to: 'domain://registry.ua.pt/', body: { user: identityURL }
      };
      return new Promise(function (resolve, reject) {

        _this._messageBus.postMessage(msg, function (reply) {

          var hypertyURL = reply.body.last;

          if (hypertyURL === undefined) {
            return reject('User Hyperty not found');
          }

          //TODO remove later, fix the problem of bad URL format received in the message
          var fixedHypertyURL = 'hyperty:/' + hypertyURL.substring(hypertyURL.indexOf(':') + 1, hypertyURL.length);

          var idPackage = {
            id: email,
            descriptor: reply.body.hyperties[hypertyURL].descriptor,
            hypertyURL: fixedHypertyURL
          };

          console.log('===> RegisterHyperty messageBundle: ', idPackage);
          resolve(idPackage);
        });
      });
    }

    /**
    * To register a new Hyperty in the runtime which returns the HypertyURL allocated to the new Hyperty.
    * @param  {Sandbox}             sandbox               sandbox
    * @param  {HypertyCatalogueURL} HypertyCatalogueURL   descriptor
    * @return {HypertyURL}          HypertyURL
    */
  }, {
    key: 'registerHyperty',
    value: function registerHyperty(sandbox, descriptor) {
      var _this = this;

      //assuming descriptor come in this format, the service-provider-domain url is retrieved by a split instruction
      //hyperty-catalogue://<service-provider-domain>/<catalogue-object-identifier>
      var domainUrl = (0, _utilsUtilsJs.divideURL)(descriptor).domain;

      var identities = _this.idModule.getIdentities();

      var promise = new Promise(function (resolve, reject) {

        if (_this._messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        } else {
          //call check if the protostub exist
          return _this.resolve('hyperty-runtime://' + domainUrl).then(function () {

            /*
            if (_this.hypertiesListToRemove.hasOwnProperty(domainUrl)) {
              console.log('entrou?');
              _this.hypertiesListToRemove[domainUrl] = {identity: identities[0].identity};
            }
             if (!_this.sandboxesList.hasOwnProperty(domainUrl)) {
              _this.sandboxesList[domainUrl] = sandbox;
              sandbox.addListener('*', function(msg) {
                _this._messageBus.postMessage(msg);
              });
             }
            */

            // TODO: should be implemented with addresses poll
            // In this case we will request and return only one
            // address
            var numberOfAddresses = 1;
            _this.addressAllocation.create(domainUrl, numberOfAddresses).then(function (adderessList) {

              adderessList.forEach(function (address) {

                _this._messageBus.addListener(address + '/status', function (msg) {
                  console.log('Message addListener for : ', address + '/status -> ' + msg);
                });
              });

              var hyperty = new _HypertyInstance2['default'](_this.identifier, _this.registryURL, descriptor, adderessList[0], identities[0].identity);

              _this.hypertiesList.push(hyperty);

              //message to register the new hyperty, within the domain registry
              var msg = {
                id: 99, type: 'CREATE', from: _this.registryURL, to: 'domain://registry.ua.pt/', body: { user: identities[0].identity, hypertyDescriptorURL: descriptor, hypertyURL: adderessList[0] }
              };

              _this._messageBus.postMessage(msg, function (reply) {
                console.log('===> RegisterHyperty Reply: ', reply);
              });

              resolve(adderessList[0]);
            });
          })['catch'](function (reason) {
            console.log('Address Reason: ', reason);
            reject(reason);
          });
        }
      });

      return promise;
    }

    /**
    * To unregister a previously registered Hyperty
    * @param  {HypertyURL}          HypertyURL url        url
    */
  }, {
    key: 'unregisterHyperty',
    value: function unregisterHyperty(url) {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {

        var found = false;
        var index = 0;

        for (index = 0; index < _this.hypertiesList.length; index++) {
          var hyperty = _this.hypertiesList[index];
          if (hyperty !== undefined) {
            if (hyperty.hypertyURL === url) {
              found = true;
              break;
            }
          }
        }

        if (found === false) {
          reject('Hyperty not found');
        } else {
          delete _this.hypertiesList[index];
          resolve('Hyperty successfully deleted');
        }
      });

      return promise;
    }

    /**
    * To discover protocol stubs available in the runtime for a certain domain. If available, it returns the runtime url for the protocol stub that connects to the requested domain. Required by the runtime BUS to route messages to remote servers or peers (do we need something similar for Hyperties?).
    * @param  {DomainURL}           DomainURL            url
    * @return {RuntimeURL}           RuntimeURL
    */
  }, {
    key: 'discoverProtostub',
    value: function discoverProtostub(url) {
      if (!url) throw new Error('Parameter url needed');
      var _this = this;

      var promise = new Promise(function (resolve, reject) {

        var request = _this.protostubsList[url];

        if (request === undefined) {
          reject('requestUpdate couldn\' get the ProtostubURL');
        } else {
          resolve(request);
        }
      });

      return promise;
    }

    /**
     * To register a new Protocol Stub in the runtime including as input parameters the function to postMessage, the DomainURL that is connected with the stub, which returns the RuntimeURL allocated to the new ProtocolStub.
     * @param {Sandbox}        Sandbox
     * @param  {DomainURL}     DomainURL service provider domain
     * @return {RuntimeProtoStubURL}
     */
  }, {
    key: 'registerStub',
    value: function registerStub(sandbox, domainURL) {
      var _this = this;
      var runtimeProtoStubURL;

      var promise = new Promise(function (resolve, reject) {

        //check if messageBus is registered in registry or not
        if (_this._messageBus === undefined) {
          reject('MessageBus not found on registerStub');
        }

        //TODO implement a unique number for the protostubURL
        if (!domainURL.indexOf('msg-node.')) {
          domainURL = domainURL.substring(domainURL.indexOf('.') + 1);
        }

        runtimeProtoStubURL = 'msg-node.' + domainURL + '/protostub/' + Math.floor(Math.random() * 10000 + 1);

        // TODO: Optimize this
        _this.protostubsList[domainURL] = runtimeProtoStubURL;
        _this.sandboxesList[domainURL] = sandbox;

        // sandbox.addListener('*', function(msg) {
        //   _this._messageBus.postMessage(msg);
        // });

        resolve(runtimeProtoStubURL);

        _this._messageBus.addListener(runtimeProtoStubURL + '/status', function (msg) {
          if (msg.resource === msg.to + '/status') {
            console.log('RuntimeProtostubURL/status message: ', msg.body.value);
          }
        });
      });

      return promise;
    }

    /**
    * To unregister a previously registered protocol stub
    * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     hypertyRuntimeURL
    */
  }, {
    key: 'unregisterStub',
    value: function unregisterStub(hypertyRuntimeURL) {
      var _this = this;
      var runtimeProtoStubURL;

      var promise = new Promise(function (resolve, reject) {

        var data = _this.protostubsList[hypertyRuntimeURL];

        if (data === undefined) {
          reject('Error on unregisterStub: Hyperty not found');
        } else {
          delete _this.protostubsList[hypertyRuntimeURL];
          resolve('ProtostubURL removed');
        }
      });

      return promise;
    }

    /**
    * To register a new Policy Enforcer in the runtime including as input parameters the function to postMessage, the HypertyURL associated with the PEP, which returns the RuntimeURL allocated to the new Policy Enforcer component.
    * @param  {Message.Message} postMessage postMessage
    * @param  {HypertyURL}          HypertyURL            hyperty
    * @return {HypertyRuntimeURL}   HypertyRuntimeURL
    */
  }, {
    key: 'registerPEP',
    value: function registerPEP(postMessage, hyperty) {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {
        //TODO check what parameter in the postMessage the pep is.
        _this.pepList[hyperty] = postMessage;
        resolve('PEP registered with success');
      });

      return promise;
    }

    /**
    * To unregister a previously registered protocol stub
    * @param  {HypertyRuntimeURL}   HypertyRuntimeURL     HypertyRuntimeURL
    */
  }, {
    key: 'unregisterPEP',
    value: function unregisterPEP(HypertyRuntimeURL) {
      var _this = this;

      var promise = new Promise(function (resolve, reject) {

        var result = _this.pepList[HypertyRuntimeURL];

        if (result === undefined) {
          reject('Pep Not found.');
        } else {
          resolve('PEP successfully removed.');
        }
      });

      return promise;
    }

    /**
    * To receive status events from components registered in the Registry.
    * @param  {Message.Message}     Message.Message       event
    */
  }, {
    key: 'onEvent',
    value: function onEvent(event) {}
    // TODO body...

    /**
    * To discover sandboxes available in the runtime for a certain domain. Required by the runtime UA to avoid more than one sandbox for the same domain.
    * @param  {DomainURL} DomainURL url
    * @return {RuntimeSandbox}           RuntimeSandbox
    */

  }, {
    key: 'getSandbox',
    value: function getSandbox(url) {
      if (!url) throw new Error('Parameter url needed');
      var _this = this;
      var promise = new Promise(function (resolve, reject) {

        var request = _this.sandboxesList[url];

        if (request === undefined) {
          reject('Sandbox not found');
        } else {
          resolve(request);
        }
      });
      return promise;
    }

    /**
    * To verify if source is valid and to resolve target runtime url address if needed (eg protostub runtime url in case the message is to be dispatched to a remote endpoint).
    * @param  {URL.URL}  url       url
    * @return {Promise<URL.URL>}                 Promise <URL.URL>
    */
  }, {
    key: 'resolve',
    value: function resolve(url) {
      console.log('resolve ' + url);
      var _this = this;

      //split the url to find the domainURL. deals with the url for example as:
      //"hyperty-runtime://sp1/protostub/123",
      var domainUrl = (0, _utilsUtilsJs.divideURL)(url).domain;

      var promise = new Promise(function (resolve, reject) {

        if (!domainUrl.indexOf('msg-node.') || !domainUrl.indexOf('registry.')) {
          domainUrl = domainUrl.substring(domainUrl.indexOf('.') + 1);
        }

        var request = _this.protostubsList[domainUrl];

        _this.addEventListener('runtime:stubLoaded', function (domainUrl) {
          resolve(domainUrl);
        });

        if (request !== undefined) {
          resolve(request);
        } else {
          _this.trigger('runtime:loadStub', domainUrl);
        }
      });
      return promise;
    }
  }, {
    key: 'messageBus',
    get: function get() {
      var _this = this;
      return _this._messageBus;
    },

    /**
    * Set the messageBus in this Registry
    * @param {MessageBus}           messageBus
    */
    set: function set(messageBus) {
      var _this = this;
      _this._messageBus = messageBus;

      // Install AddressAllocation
      var addressAllocation = new _AddressAllocation2['default'](_this.registryURL, messageBus);
      _this.addressAllocation = addressAllocation;
    }
  }]);

  return Registry;
})(_utilsEventEmitter2['default']);

exports['default'] = Registry;
module.exports = exports['default'];

},{"../utils/EventEmitter":17,"../utils/utils.js":18,"./AddressAllocation":8,"./HypertyInstance":9}],11:[function(require,module,exports){
/**
*   @author: Gil Dias (gil.dias@tecnico.ulisboa.pt)
*   Registry Data Model includes all Objects to be handled by the Registry functionality including
*/
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RegistryDataModel = (function () {
  function RegistryDataModel(id, url, descriptor, startingTime, lastModified, status, stubs, stubsConfiguration) {
    _classCallCheck(this, RegistryDataModel);

    var _this = this;

    _this._id = id;
    _this._url = url;
    _this._descriptor = descriptor;
    _this._startingTime = startingTime;
    _this._lastModified = lastModified;
    _this._status = status;
    _this._stubs = stubs;
    _this._stubsConfiguration = stubsConfiguration;
  }

  _createClass(RegistryDataModel, [{
    key: "id",
    get: function get() {
      var _this = this;
      return _this._id;
    }
  }, {
    key: "url",
    get: function get() {
      var _this = this;
      return _this._url;
    }
  }, {
    key: "descriptor",
    get: function get() {
      var _this = this;
      return _this._descriptor;
    }
  }]);

  return RegistryDataModel;
})();

exports["default"] = RegistryDataModel;
module.exports = exports["default"];

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _runtimeRuntimeUA = require('./runtime/RuntimeUA');

var _runtimeRuntimeUA2 = _interopRequireDefault(_runtimeRuntimeUA);

exports['default'] = { RuntimeUA: _runtimeRuntimeUA2['default'] };
module.exports = exports['default'];

},{"./runtime/RuntimeUA":14}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var RuntimeCatalogue = (function () {
  function RuntimeCatalogue() {
    _classCallCheck(this, RuntimeCatalogue);

    var _this = this;

    // TODO: Remove the code is only for development fase without the Server backend catalogue;
    // Mockup load the base of descriptors
    _this._makeExternalRequest('../resources/descriptors/Hyperties.json').then(function (result) {
      _this.Hyperties = JSON.parse(result);
    });

    _this._makeExternalRequest('../resources/descriptors/ProtoStubs.json').then(function (result) {
      _this.ProtoStubs = JSON.parse(result);
    });
  }

  _createClass(RuntimeCatalogue, [{
    key: 'getHypertyRuntimeURL',

    /**
    * Get hypertyRuntimeURL
    */
    value: function getHypertyRuntimeURL() {
      // TODO: check if this is real needed;
      return _hypertyRuntimeURL;
    }
  }, {
    key: '_makeExternalRequest',
    value: function _makeExternalRequest(url) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        // TODO: implementation
        // Simulate getting hypertySourceCode through the XMLHttpRequest
        // but in node this should be overrided to other method to make a
        // ajax request;
        // i think we can use a factory like we used in for the sandboxes,
        // an sandboxFactory;
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function (event) {
          var xhr = event.currentTarget;
          if (xhr.readyState === 4) {
            if (xhr.status === 200) {
              resolve(xhr.responseText);
            } else {
              reject(xhr.responseText);
            }
          }
        };

        xhr.open('GET', url, true);
        xhr.send();
      });
    }

    /**
    * Get HypertyDescriptor
    */
  }, {
    key: 'getHypertyDescriptor',
    value: function getHypertyDescriptor(hypertyURL) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        var hypertyName = hypertyURL.substr(hypertyURL.lastIndexOf('/') + 1);
        var hypertyDescriptor = _this.Hyperties[hypertyName];
        resolve(hypertyDescriptor);
      });
    }

    /**
    * Get hypertySourceCode
    */
  }, {
    key: 'getHypertySourcePackage',
    value: function getHypertySourcePackage(hypertyPackage) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        _this._makeExternalRequest(hypertyPackage).then(function (result) {

          try {

            var sourcePackage = JSON.parse(result);
            var sourceCode = window.atob(sourcePackage.sourceCode);
            sourcePackage.sourceCode = sourceCode;

            resolve(sourcePackage);
          } catch (e) {
            reject(e);
          }
        })['catch'](function (reason) {
          reject(reason);
        });
      });
    }

    /**
    * Get StubDescriptor
    */
  }, {
    key: 'getStubDescriptor',
    value: function getStubDescriptor(domainURL) {

      var _this = this;

      return new Promise(function (resolve, reject) {

        var stubDescriptor = _this.ProtoStubs[domainURL];
        resolve(stubDescriptor);
      });
    }

    /**
    * Get protostubSourceCode
    */
  }, {
    key: 'getStubSourcePackage',
    value: function getStubSourcePackage(sourcePackageURL) {
      var _this = this;

      return new Promise(function (resolve, reject) {

        _this._makeExternalRequest(sourcePackageURL).then(function (result) {

          try {
            var sourcePackage = JSON.parse(result);
            var sourceCode = window.atob(sourcePackage.sourceCode);
            sourcePackage.sourceCode = sourceCode;

            resolve(sourcePackage);
          } catch (e) {
            reject(e);
          }
        })['catch'](function (reason) {
          console.error(reason);
          reject(reason);
        });
      });
    }
  }, {
    key: 'runtimeURL',
    set: function set(runtimeURL) {
      var _this = this;
      _this._runtimeURL = runtimeURL;
    },
    get: function get() {
      var _this = this;
      return _this._runtimeURL;
    }
  }]);

  return RuntimeCatalogue;
})();

exports['default'] = RuntimeCatalogue;
module.exports = exports['default'];

},{}],14:[function(require,module,exports){
//Main dependecies
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _registryRegistry = require('../registry/Registry');

var _registryRegistry2 = _interopRequireDefault(_registryRegistry);

var _identityIdentityModule = require('../identity/IdentityModule');

var _identityIdentityModule2 = _interopRequireDefault(_identityIdentityModule);

var _policyPolicyEngine = require('../policy/PolicyEngine');

var _policyPolicyEngine2 = _interopRequireDefault(_policyPolicyEngine);

var _busMessageBus = require('../bus/MessageBus');

var _busMessageBus2 = _interopRequireDefault(_busMessageBus);

var _RuntimeCatalogue = require('./RuntimeCatalogue');

var _RuntimeCatalogue2 = _interopRequireDefault(_RuntimeCatalogue);

var _syncherSyncherManager = require('../syncher/SyncherManager');

var _syncherSyncherManager2 = _interopRequireDefault(_syncherSyncherManager);

/**
 * Runtime User Agent Interface will process all the dependecies of the core runtime;
 * @author Vitor Silva [vitor-t-silva@telecom.pt]
 * @version 0.2.0
 *
 * @property {sandboxFactory} sandboxFactory - Specific implementation of sandbox;
 * @property {RuntimeCatalogue} runtimeCatalogue - Catalogue of components can be installed;
 * @property {runtimeURL} runtimeURL - This identify the core runtime, should be unique;
 * @property {IdentityModule} identityModule - Identity Module;
 * @property {PolicyEngine} policyEngine - Policy Engine Module;
 * @property {Registry} registry - Registry Module;
 * @property {MessageBus} messageBus - Message Bus is used like a router to redirect the messages from one component to other(s)
 */

var RuntimeUA = (function () {

  /**
   * Create a new instance of Runtime User Agent
   * @param {sandboxFactory} sandboxFactory - Specific implementation for the environment where the core runtime will run;
   */

  function RuntimeUA(sandboxFactory) {
    _classCallCheck(this, RuntimeUA);

    if (!sandboxFactory) throw new Error('The sandbox factory is a needed parameter');

    var _this = this;

    _this.sandboxFactory = sandboxFactory;

    _this.runtimeCatalogue = new _RuntimeCatalogue2['default']();

    // TODO: post and return registry/hypertyRuntimeInstance to and from Back-end Service
    // the response is like: runtime://sp1/123

    var runtimeURL = 'runtime://ua.pt/' + Math.floor(Math.random() * 10000 + 1);
    _this.runtimeURL = runtimeURL;

    // TODO: check if runtime catalogue need the runtimeURL;
    _this.runtimeCatalogue.runtimeURL = runtimeURL;

    // Instantiate the identity Module
    _this.identityModule = new _identityIdentityModule2['default']();

    // Use the sandbox factory to create an AppSandbox;
    // In the future can be decided by policyEngine if we need
    // create a AppSandbox or not;
    var appSandbox = sandboxFactory.createAppSandbox();

    // Instantiate the Registry Module
    _this.registry = new _registryRegistry2['default'](runtimeURL, appSandbox, _this.identityModule);

    // Instantiate the Policy Engine
    _this.policyEngine = new _policyPolicyEngine2['default'](_this.identityModule, _this.registry);

    // Instantiate the Message Bus
    _this.messageBus = new _busMessageBus2['default'](_this.registry);
    _this.messageBus.pipeline.handlers = [

    // Policy message authorise
    function (ctx) {
      _this.policyEngine.authorise(ctx.msg).then(function (changedMgs) {
        ctx.msg = changedMgs;
        ctx.next();
      })['catch'](function (reason) {
        console.error(reason);
        ctx.fail(reason);
      });
    }];

    // Add to App Sandbox the listener;
    appSandbox.addListener('*', function (msg) {
      _this.messageBus.postMessage(msg);
    });

    // Register messageBus on Registry
    _this.registry.messageBus = _this.messageBus;

    _this.registry.addEventListener('runtime:loadStub', function (domainURL) {

      _this.loadStub(domainURL).then(function (result) {
        _this.registry.trigger('runtime:stubLoaded', domainURL);
      })['catch'](function (reason) {
        console.error(reason);
      });
    });

    // Use sandbox factory to use specific methods
    // and set the message bus to the factory
    sandboxFactory.messageBus = _this.messageBus;

    // Instanciate the SyncherManager;
    _this.syncherManager = new _syncherSyncherManager2['default'](_this.runtimeURL, _this.messageBus, {});
  }

  /**
  * Accomodate interoperability in H2H and proto on the fly for newly discovered devices in M2M
  * @param  {CatalogueDataObject.HypertyDescriptor}   descriptor    descriptor
  */

  _createClass(RuntimeUA, [{
    key: 'discoverHiperty',
    value: function discoverHiperty(descriptor) {}
    // Body...

    /**
    * Register Hyperty deployed by the App that is passed as input parameter. To be used when App and Hyperties are from the same domain otherwise the RuntimeUA will raise an exception and the App has to use the loadHyperty(..) function.
    * @param  {Object} Object                   hypertyInstance
    * @param  {URL.HypertyCatalogueURL}         descriptor      descriptor
    */

  }, {
    key: 'registerHyperty',
    value: function registerHyperty(hypertyInstance, descriptor) {}
    // Body...

    /**
    * Deploy Hyperty from Catalogue URL
    * @param  {URL.URL}    hyperty hypertyInstance url;
    */

  }, {
    key: 'loadHyperty',
    value: function loadHyperty(hypertyDescriptorURL) {

      var _this = this;

      if (!hypertyDescriptorURL) throw new Error('Hyperty descriptor url parameter is needed');

      return new Promise(function (resolve, reject) {

        var _hypertyURL = undefined;
        var _hypertySandbox = undefined;
        var _hypertyDescriptor = undefined;
        var _hypertySourcePackage = undefined;

        var errorReason = function errorReason(reason) {
          console.error(reason);
          reject(reason);
        };

        // Get Hyperty descriptor
        // TODO: the request Module should be changed,
        // because at this moment it is incompatible with nodejs;
        // Probably we need to pass a factory like we do for sandboxes;
        console.info('------------------ Hyperty ------------------------');
        console.info('Get hyperty descriptor for :', hypertyDescriptorURL);
        _this.runtimeCatalogue.getHypertyDescriptor(hypertyDescriptorURL).then(function (hypertyDescriptor) {
          // at this point, we have completed "step 2 and 3" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md
          console.info('1: return hyperty descriptor', hypertyDescriptor);

          // hyperty contains the full path of the catalogue URL, e.g.
          // catalogue.rethink.eu/.well-known/..........
          _hypertyDescriptor = hypertyDescriptor;

          var sourcePackageURL = hypertyDescriptor.sourcePackageURL;

          // Get the hyperty source code
          return _this.runtimeCatalogue.getHypertySourcePackage(sourcePackageURL);
        }).then(function (sourcePackage) {
          console.info('2: return hyperty source code');

          // at this point, we have completed "step 4 and 5" as shown in https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md

          _hypertySourcePackage = sourcePackage;

          //
          // steps 6 -- 9 are skipped.
          // TODO: on release of core 0.2;
          // TODO: Promise to check the policy engine

          // mock-up code;
          // temporary code, only
          var policy = true;

          return policy;
        }).then(function (policyResult) {
          console.info('3: return policy engine result');

          // we have completed step 6 to 9 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
          //
          // Steps 6 -- 9
          // As a result of the sipped steps, we know at this point if we execute
          // inSameSandbox or not.
          //

          // For testing, just assume we execute in same Sandbox.
          var inSameSandbox = true;
          var sandbox = undefined;

          if (inSameSandbox) {

            // this don't need be a Promise;
            sandbox = _this.registry.getAppSandbox();

            // we have completed step 11 here.
          } else {

              // getSandbox, this will return a promise;
              sandbox = _this.registry.getSandbox(domain);
            }

          // this will return the sandbox or one promise to getSandbox;
          return sandbox;
        }).then(function (sandbox) {
          console.info('4: return the sandbox', sandbox);

          // Return the sandbox indepentely if it running in the same sandbox or not
          // we have completed step 14 here.
          return sandbox;
        }, function (reason) {
          console.error('4.1: try to register a new sandbox', reason);

          // check if the sandbox is registed for this hyperty descriptor url;
          // Make Steps xxx --- xxx
          // Instantiate the Sandbox
          var sandbox = _this.sandboxFactory.createSandbox();

          sandbox.addListener('*', function (msg) {
            _this.messageBus.postMessage(msg);
          });

          return sandbox;
        }).then(function (sandbox) {
          console.info('5: return sandbox and register');

          _hypertySandbox = sandbox;

          // Register hyperty
          return _this.registry.registerHyperty(sandbox, hypertyDescriptorURL);
        }).then(function (hypertyURL) {
          console.info('6: Hyperty url, after register hyperty', hypertyURL);

          // we have completed step 16 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          _hypertyURL = hypertyURL;

          // Extend original hyperty configuration;
          var configuration = Object.assign({}, _hypertyDescriptor.configuration);
          configuration.runtimeURL = _this.runtimeURL;

          // We will deploy the component - step 17 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
          return _hypertySandbox.deployComponent(_hypertySourcePackage.sourceCode, _hypertyURL, configuration);
        }).then(function (deployComponentStatus) {
          console.info('7: Deploy component status for hyperty: ', deployComponentStatus);

          // we have completed step 19 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.

          // Add the message bus listener to the appSandbox or hypertSandbox;
          _this.messageBus.addListener(_hypertyURL, function (msg) {
            _hypertySandbox.postMessage(msg);
          });

          // we have completed step 20 of https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
          var hyperty = {
            runtimeHypertyURL: _hypertyURL,
            status: deployComponentStatus
          };

          resolve(hyperty);

          // we have completed step 21 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-hyperty.md right now.
          console.log('------------------ END ------------------------');
        })['catch'](errorReason);
      });
    }

    /**
    * Deploy Stub from Catalogue URL or domain url
    * @param  {URL.URL}     domain          domain
    */
  }, {
    key: 'loadStub',
    value: function loadStub(domain) {

      var _this = this;

      if (!domain) throw new Error('domain parameter is needed');

      return new Promise(function (resolve, reject) {

        var _stubSandbox = undefined;
        var _stubDescriptor = undefined;
        var _runtimeProtoStubURL = undefined;
        var _stubSourcePackage = undefined;

        var errorReason = function errorReason(reason) {
          console.error(reason);
          reject(reason);
        };

        // Discover Protocol Stub
        console.info('------------------- ProtoStub ---------------------------\n');
        console.info('Discover or Create a new ProtoStub for domain: ', domain);
        _this.registry.discoverProtostub(domain).then(function (descriptor) {
          // Is registed?
          console.info('1. Proto Stub Discovered: ', descriptor);
          _stubDescriptor = descriptor;

          // we have completed step 2 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          return _stubDescriptor;
        }, function (reason) {
          // is not registed?
          console.info('1. Proto Stub not found:', reason);

          // we have completed step 3 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          // we need to get ProtoStub descriptor step 4 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return _this.runtimeCatalogue.getStubDescriptor(domain);
        }).then(function (stubDescriptor) {

          console.info('2. return the ProtoStub descriptor:', stubDescriptor);

          // we have completed step 5 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _stubDescriptor = stubDescriptor;

          var sourcePackageURL = stubDescriptor.sourcePackageURL;

          console.log(stubDescriptor.sourcePackageURL);

          // we need to get ProtoStub Source code from descriptor - step 6 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return _this.runtimeCatalogue.getStubSourcePackage(sourcePackageURL);
        }).then(function (stubSourcePackage) {
          console.info('3. return the ProtoStub Source Code: ', stubSourcePackage);

          // we have completed step 7 https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _stubSourcePackage = stubSourcePackage;

          // TODO: Check on PEP (policy Engine) if we need the sandbox and check if the Sandbox Factory have the context sandbox;
          var policy = true;
          return policy;
        }).then(function (policy) {
          // this will return the sandbox or one promise to getSandbox;
          return _this.registry.getSandbox(domain);
        }).then(function (stubSandbox) {

          console.info('4. if the sandbox is registered then return the sandbox', stubSandbox);

          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _stubSandbox = stubSandbox;
          return stubSandbox;
        }, function (reason) {
          console.info('5. Sandbox was not found, creating a new one');

          // check if the sandbox is registed for this stub descriptor url;
          // Make Steps xxx --- xxx
          // Instantiate the Sandbox
          var sandbox = _this.sandboxFactory.createSandbox();
          sandbox.addListener('*', function (msg) {
            _this.messageBus.postMessage(msg);
          });

          return sandbox;
        }).then(function (sandbox) {
          console.info('6. return the sandbox instance and the register', sandbox);

          _stubSandbox = sandbox;

          // we need register stub on registry - step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md
          return _this.registry.registerStub(_stubSandbox, domain);
        }).then(function (runtimeProtoStubURL) {

          console.info('7. return the runtime protostub url: ', runtimeProtoStubURL);

          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          _runtimeProtoStubURL = runtimeProtoStubURL;

          // Extend original hyperty configuration;
          var configuration = Object.assign({}, _stubDescriptor.configuration);
          configuration.runtimeURL = _this.runtimeURL;

          console.log(_stubSourcePackage);

          // Deploy Component step xxx
          return _stubSandbox.deployComponent(_stubSourcePackage.sourceCode, runtimeProtoStubURL, configuration);
        }).then(function (deployComponentStatus) {
          console.info('8: return deploy component for sandbox status: ', deployComponentStatus);

          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          // Add the message bus listener
          _this.messageBus.addListener(_runtimeProtoStubURL, function (msg) {
            _stubSandbox.postMessage(msg);
          });

          // we have completed step xxx https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/dynamic-view/basics/deploy-protostub.md

          // Load Stub function resolved with success;
          var stub = {
            runtimeProtoStubURL: _runtimeProtoStubURL,
            status: deployComponentStatus
          };

          resolve(stub);
          console.info('------------------- END ---------------------------\n');
        })['catch'](errorReason);
      });
    }

    /**
    * Used to check for updates about components handled in the Catalogue including protocol stubs and Hyperties. check relationship with lifecycle management provided by Service Workers
    * @param  {CatalogueURL}       url url
    */
  }, {
    key: 'checkForUpdate',
    value: function checkForUpdate(url) {
      // Body...
    }
  }]);

  return RuntimeUA;
})();

exports['default'] = RuntimeUA;
module.exports = exports['default'];

},{"../bus/MessageBus":3,"../identity/IdentityModule":6,"../policy/PolicyEngine":7,"../registry/Registry":10,"../syncher/SyncherManager":16,"./RuntimeCatalogue":13}],15:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var ObjectAllocation = (function () {
  /* private
  _url: URL
  _bus: MiniBus
  */

  /**
   * Create an Object Allocation
   * @param  {URL.URL}      url - url from who is sending the message
   * @param  {MiniBus}      bus - MiniBus used for address allocation
   */

  function ObjectAllocation(url, bus) {
    _classCallCheck(this, ObjectAllocation);

    var _this = this;

    _this._url = url;
    _this._bus = bus;
  }

  /**
   * get the URL value
   * @return {string} The url value;
   */

  _createClass(ObjectAllocation, [{
    key: 'create',

    /**
     * Ask for creation of a number of Object addresses, to the domain message node.
     * @param  {Domain} domain - Domain of the message node.
     * @param  {number} number - Number of addresses to request
     * @returns {Promise<ObjectURL>}  A list of ObjectURL's
     */
    value: function create(domain, number) {
      var _this = this;

      var msg = {
        type: 'create', from: _this._url, to: 'domain://msg-node.' + domain + '/object-address-allocation',
        body: { number: number }
      };

      return new Promise(function (resolve, reject) {
        _this._bus.postMessage(msg, function (reply) {
          if (reply.body.code === 200) {
            resolve(reply.body.allocated);
          } else {
            reject(reply.body.desc);
          }
        });
      });
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return ObjectAllocation;
})();

exports['default'] = ObjectAllocation;
module.exports = exports['default'];

},{}],16:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _utilsUtils = require('../utils/utils');

var _ObjectAllocation = require('./ObjectAllocation');

var _ObjectAllocation2 = _interopRequireDefault(_ObjectAllocation);

/**
 * @author micaelpedrosa@gmail.com
 * Core Syncronization system.
 */

var SyncherManager = (function () {
  /* private
  _url: URL
  _bus: MiniBus
  _registry: Registry
  _allocator: ObjectAllocation
   _subscriptions: { ObjectURL: { owner: HypertyURL, schema: Schema, sl: MsgListener, cl: MsgListener, subs: [HypertyURL] } }
  */

  function SyncherManager(runtimeURL, bus, registry, allocator) {
    _classCallCheck(this, SyncherManager);

    var _this = this;

    //TODO: this should not be hardcoded!
    _this._domain = 'ua.pt';

    _this._bus = bus;
    _this._registry = registry;

    //TODO: these should be saved in persistence engine?
    _this._url = runtimeURL + '/sm';
    _this._objectURL = runtimeURL + '/object-allocation';
    _this._subscriptions = {};

    if (allocator) {
      _this._allocator = allocator;
    } else {
      _this._allocator = new _ObjectAllocation2['default'](_this._objectURL, bus);
    }

    bus.addListener(_this._url, function (msg) {
      console.log('SyncherManager-RCV: ', msg);
      switch (msg.type) {
        case 'create':
          _this._onCreate(msg);break;
        case 'delete':
          _this._onDelete(msg);break;
      }
    });
  }

  _createClass(SyncherManager, [{
    key: '_onCreate',
    value: function _onCreate(msg) {
      var _this = this;
      var owner = msg.from;

      //TODO: 5-7 authorizeObjectCreation(owner, obj ???? )
      //TODO: other optional steps

      _this._allocator.create(_this._domain, 1).then(function (allocated) {
        //TODO: get address from address allocator ?
        var objURL = allocated[0];
        var objSubscriptorURL = objURL + '/subscription';

        //TODO: register objectURL so that it can be discovered in the network

        //register change listener
        var changeListener = _this._bus.addListener(objURL, function (msg) {
          console.log(objURL + '-RCV: ', msg);
          _this._subscriptions[objURL].subs.forEach(function (hypertyUrl) {
            var changeMsg = (0, _utilsUtils.deepClone)(msg);
            changeMsg.id = 0;
            changeMsg.from = objURL;
            changeMsg.to = hypertyUrl;

            //forward to hyperty observer
            _this._bus.postMessage(changeMsg);
          });
        });

        //15. add subscription listener
        var subscriptorListener = _this._bus.addListener(objSubscriptorURL, function (msg) {
          console.log(objSubscriptorURL + '-RCV: ', msg);
          switch (msg.type) {
            case 'subscribe':
              _this._onSubscribe(objURL, msg);break;
            case 'unsubscribe':
              _this._onUnSubscribe(objURL, msg);break;
          }
        });

        _this._subscriptions[objURL] = { owner: owner, sl: subscriptorListener, cl: changeListener, subs: [] };

        //all ok, send response
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: owner,
          body: { code: 200, resource: objURL }
        });

        //19. send create to all observers, responses will be deliver to the Hyperty owner?
        setTimeout(function () {
          //schedule for next cycle needed, because the Reporter should be available.
          msg.body.authorise.forEach(function (hypertyURL) {
            _this._bus.postMessage({
              type: 'create', from: owner, to: hypertyURL,
              body: { schema: msg.body.schema, resource: objURL, value: msg.body.value }
            });
          });
        });
      })['catch'](function (reason) {
        _this._bus.postMessage({
          id: msg.id, type: 'response', from: msg.to, to: owner,
          body: { code: 500, desc: reason }
        });
      });
    }
  }, {
    key: '_onDelete',
    value: function _onDelete(msg) {
      var _this = this;

      //TODO: where to get objectURL ?
      var objURL = '<objURL>';

      //destroy all objURL listeners
      delete _this._subscriptions[objURL];
      _this._bus.removeAllListenersOf(objURL);
      _this._bus.removeAllListenersOf(objURL + '/subscription');

      //TODO: destroy object in the registry?
    }
  }, {
    key: '_onSubscribe',
    value: function _onSubscribe(objURL, msg) {
      var _this = this;
      var hypertyUrl = msg.from;

      var subscription = _this._subscriptions[objURL];

      //27. validate if subscription already exists?
      if (subscription[hypertyUrl]) {
        var errorMsg = {
          id: msg.id, type: 'response', from: msg.to, to: hypertyUrl,
          body: { code: 500, desc: 'Subscription for (' + objURL + ' : ' + hypertyUrl + ') already exists!' }
        };

        _this._bus.postMessage(errorMsg);
        return;
      }

      //31. ask to subscribe to Syncher? (depends on the operation mode)
      //TODO: get mode from object!
      var mode = 'sub/pub';

      if (mode === 'sub/pub') {
        //forward to Hyperty owner
        var forwardMsg = {
          type: 'forward', from: _this._url, to: subscription.owner,
          body: { type: msg.type, from: msg.from, to: objURL }
        };

        if (msg.body) {
          forwardMsg.body.body = msg.body;
        }

        _this._bus.postMessage(forwardMsg, function (reply) {
          console.log('forward-reply: ', reply);
          if (reply.body.code === 200) {
            //subscription accepted
            _this._subscriptions[objURL].subs.push(hypertyUrl);
          }

          //send subscribe-response
          _this._bus.postMessage({
            id: msg.id, type: 'response', from: msg.to, to: hypertyUrl,
            body: reply.body
          });
        });
      }
    }
  }, {
    key: '_onUnSubscribe',
    value: function _onUnSubscribe(objURL, msg) {
      var _this = this;
      var hypertyUrl = msg.from;

      var subs = _this._subscriptions[objURL].subs;
      var index = subs.indexOf(hypertyUrl);
      subs.splice(index, 1);

      //TODO: send un-subscribe message to Syncher? (depends on the operation mode)
    }
  }, {
    key: 'url',
    get: function get() {
      return this._url;
    }
  }]);

  return SyncherManager;
})();

exports['default'] = SyncherManager;
module.exports = exports['default'];

},{"../utils/utils":18,"./ObjectAllocation":15}],17:[function(require,module,exports){
/**
 * EventEmitter
 * All classes which extends this, can have addEventListener and trigger events;
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = (function () {
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);
  }

  _createClass(EventEmitter, [{
    key: "addEventListener",

    /**
     * addEventListener listen for an eventType
     * @param  {string}         eventType - listening for this type of event
     * @param  {Function}       cb        - callback function will be executed when the event it is invoked
     */
    value: function addEventListener(eventType, cb) {
      var _this = this;
      _this[eventType] = cb;
    }

    /**
     * Invoke the eventType
     * @param  {string} eventType - event will be invoked
     * @param  {object} params - parameters will be passed to the addEventListener
     */
  }, {
    key: "trigger",
    value: function trigger(eventType, params) {
      var _this = this;

      if (_this[eventType]) {
        _this[eventType](params);
      }
    }
  }]);

  return EventEmitter;
})();

exports["default"] = EventEmitter;
module.exports = exports["default"];

},{}],18:[function(require,module,exports){
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
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.divideURL = divideURL;
exports.deepClone = deepClone;

function divideURL(url) {

  // let re = /([a-zA-Z-]*)?:\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b)*(\/[\/\d\w\.-]*)*(?:[\?])*(.+)*/gi;
  var re = /([a-zA-Z-]*):\/\/(?:\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})([-a-zA-Z0-9@:%._\+~#=\/]*)/gi;
  var subst = '$1,$2,$3';
  var parts = url.replace(re, subst).split(',');
  var result = {
    type: parts[0],
    domain: parts[1],
    identity: parts[2]
  };

  return result;
}

/**
 * Make a COPY of the original data
 * @param  {Object}  obj - object to be cloned
 * @return {Object}
 */

function deepClone(obj) {
  //TODO: simple but inefficient JSON deep clone...
  return JSON.parse(JSON.stringify(obj));
}

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2hlbGxvanMvZGlzdC9oZWxsby5hbGwuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL2J1cy9NZXNzYWdlQnVzLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9idXMvTWluaUJ1cy5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvYnVzL1BpcGVsaW5lLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9pZGVudGl0eS9JZGVudGl0eU1vZHVsZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcG9saWN5L1BvbGljeUVuZ2luZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcmVnaXN0cnkvQWRkcmVzc0FsbG9jYXRpb24uanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3JlZ2lzdHJ5L0h5cGVydHlJbnN0YW5jZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcmVnaXN0cnkvUmVnaXN0cnkuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3JlZ2lzdHJ5L1JlZ2lzdHJ5RGF0YU1vZGVsLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy9ydW50aW1lLWNvcmUuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3J1bnRpbWUvUnVudGltZUNhdGFsb2d1ZS5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvcnVudGltZS9SdW50aW1lVUEuanMiLCIvaG9tZS92c2lsdmEvcHQtaW5vdmFjYW8vcmV0aGluay1wcm9qZWN0L2Rldi1ydW50aW1lLWNvcmUvc3JjL3N5bmNoZXIvT2JqZWN0QWxsb2NhdGlvbi5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvc3luY2hlci9TeW5jaGVyTWFuYWdlci5qcyIsIi9ob21lL3ZzaWx2YS9wdC1pbm92YWNhby9yZXRoaW5rLXByb2plY3QvZGV2LXJ1bnRpbWUtY29yZS9zcmMvdXRpbHMvRXZlbnRFbWl0dGVyLmpzIiwiL2hvbWUvdnNpbHZhL3B0LWlub3ZhY2FvL3JldGhpbmstcHJvamVjdC9kZXYtcnVudGltZS1jb3JlL3NyYy91dGlscy91dGlscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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LFNBQVMsQ0FBQyxHQUFHLEVBQUU7OztBQUc3QixNQUFJLEVBQUUsR0FBRyxzRkFBc0YsQ0FBQztBQUNoRyxNQUFJLEtBQUssR0FBRyxVQUFVLENBQUM7QUFDdkIsTUFBSSxLQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQzlDLE1BQUksTUFBTSxHQUFHO0FBQ1gsUUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDZCxVQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztBQUNoQixZQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztHQUNuQixDQUFDOztBQUVGLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7Ozs7Ozs7O0FBT00sU0FBUyxTQUFTLENBQUMsR0FBRyxFQUFFOztBQUU3QixTQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQ3hDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xudmFyIGN1cnJlbnRRdWV1ZTtcbnZhciBxdWV1ZUluZGV4ID0gLTE7XG5cbmZ1bmN0aW9uIGNsZWFuVXBOZXh0VGljaygpIHtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGlmIChjdXJyZW50UXVldWUubGVuZ3RoKSB7XG4gICAgICAgIHF1ZXVlID0gY3VycmVudFF1ZXVlLmNvbmNhdChxdWV1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgIH1cbiAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGRyYWluUXVldWUoKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdmFyIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGNsZWFuVXBOZXh0VGljayk7XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuXG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHdoaWxlICgrK3F1ZXVlSW5kZXggPCBsZW4pIHtcbiAgICAgICAgICAgIGlmIChjdXJyZW50UXVldWUpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UXVldWVbcXVldWVJbmRleF0ucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcXVldWVJbmRleCA9IC0xO1xuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGN1cnJlbnRRdWV1ZSA9IG51bGw7XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG59XG5cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgdmFyIGFyZ3MgPSBuZXcgQXJyYXkoYXJndW1lbnRzLmxlbmd0aCAtIDEpO1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgYXJnc1tpIC0gMV0gPSBhcmd1bWVudHNbaV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcXVldWUucHVzaChuZXcgSXRlbShmdW4sIGFyZ3MpKTtcbiAgICBpZiAocXVldWUubGVuZ3RoID09PSAxICYmICFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbi8vIHY4IGxpa2VzIHByZWRpY3RpYmxlIG9iamVjdHNcbmZ1bmN0aW9uIEl0ZW0oZnVuLCBhcnJheSkge1xuICAgIHRoaXMuZnVuID0gZnVuO1xuICAgIHRoaXMuYXJyYXkgPSBhcnJheTtcbn1cbkl0ZW0ucHJvdG90eXBlLnJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmZ1bi5hcHBseShudWxsLCB0aGlzLmFycmF5KTtcbn07XG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiLyohIGhlbGxvanMgdjEuOS44IHwgKGMpIDIwMTItMjAxNSBBbmRyZXcgRG9kc29uIHwgTUlUIGh0dHBzOi8vYWRvZHNvbi5jb20vaGVsbG8uanMvTElDRU5TRSAqL1xyXG4vLyBFUzUgT2JqZWN0LmNyZWF0ZVxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG5cblx0Ly8gU2hpbSwgT2JqZWN0IGNyZWF0ZVxuXHQvLyBBIHNoaW0gZm9yIE9iamVjdC5jcmVhdGUoKSwgaXQgYWRkcyBhIHByb3RvdHlwZSB0byBhIG5ldyBvYmplY3Rcblx0T2JqZWN0LmNyZWF0ZSA9IChmdW5jdGlvbigpIHtcblxuXHRcdGZ1bmN0aW9uIEYoKSB7fVxuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKG8pIHtcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggIT0gMSkge1xuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ09iamVjdC5jcmVhdGUgaW1wbGVtZW50YXRpb24gb25seSBhY2NlcHRzIG9uZSBwYXJhbWV0ZXIuJyk7XG5cdFx0XHR9XG5cblx0XHRcdEYucHJvdG90eXBlID0gbztcblx0XHRcdHJldHVybiBuZXcgRigpO1xuXHRcdH07XG5cblx0fSkoKTtcblxufVxuXG4vLyBFUzUgT2JqZWN0LmtleXNcbmlmICghT2JqZWN0LmtleXMpIHtcblx0T2JqZWN0LmtleXMgPSBmdW5jdGlvbihvLCBrLCByKSB7XG5cdFx0ciA9IFtdO1xuXHRcdGZvciAoayBpbiBvKSB7XG5cdFx0XHRpZiAoci5oYXNPd25Qcm9wZXJ0eS5jYWxsKG8sIGspKVxuXHRcdFx0XHRyLnB1c2goayk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHI7XG5cdH07XG59XG5cbi8vIEVTNSBbXS5pbmRleE9mXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG5cdEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24ocykge1xuXG5cdFx0Zm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRpZiAodGhpc1tqXSA9PT0gcykge1xuXHRcdFx0XHRyZXR1cm4gajtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gLTE7XG5cdH07XG59XG5cbi8vIEVTNSBbXS5mb3JFYWNoXG5pZiAoIUFycmF5LnByb3RvdHlwZS5mb3JFYWNoKSB7XG5cdEFycmF5LnByb3RvdHlwZS5mb3JFYWNoID0gZnVuY3Rpb24oZnVuLyosIHRoaXNBcmcqLykge1xuXG5cdFx0aWYgKHRoaXMgPT09IHZvaWQgMCB8fCB0aGlzID09PSBudWxsKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cdFx0fVxuXG5cdFx0dmFyIHQgPSBPYmplY3QodGhpcyk7XG5cdFx0dmFyIGxlbiA9IHQubGVuZ3RoID4+PiAwO1xuXHRcdGlmICh0eXBlb2YgZnVuICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCk7XG5cdFx0fVxuXG5cdFx0dmFyIHRoaXNBcmcgPSBhcmd1bWVudHMubGVuZ3RoID49IDIgPyBhcmd1bWVudHNbMV0gOiB2b2lkIDA7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuXHRcdFx0aWYgKGkgaW4gdCkge1xuXHRcdFx0XHRmdW4uY2FsbCh0aGlzQXJnLCB0W2ldLCBpLCB0KTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fTtcbn1cblxuLy8gRVM1IFtdLmZpbHRlclxuaWYgKCFBcnJheS5wcm90b3R5cGUuZmlsdGVyKSB7XG5cdEFycmF5LnByb3RvdHlwZS5maWx0ZXIgPSBmdW5jdGlvbihmdW4sIHRoaXNBcmcpIHtcblxuXHRcdHZhciBhID0gW107XG5cdFx0dGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwgaSwgdCkge1xuXHRcdFx0aWYgKGZ1bi5jYWxsKHRoaXNBcmcgfHwgdm9pZCAwLCB2YWwsIGksIHQpKSB7XG5cdFx0XHRcdGEucHVzaCh2YWwpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIGE7XG5cdH07XG59XG5cbi8vIFByb2R1Y3Rpb24gc3RlcHMgb2YgRUNNQS0yNjIsIEVkaXRpb24gNSwgMTUuNC40LjE5XG4vLyBSZWZlcmVuY2U6IGh0dHA6Ly9lczUuZ2l0aHViLmlvLyN4MTUuNC40LjE5XG5pZiAoIUFycmF5LnByb3RvdHlwZS5tYXApIHtcblxuXHRBcnJheS5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24oZnVuLCB0aGlzQXJnKSB7XG5cblx0XHR2YXIgYSA9IFtdO1xuXHRcdHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWwsIGksIHQpIHtcblx0XHRcdGEucHVzaChmdW4uY2FsbCh0aGlzQXJnIHx8IHZvaWQgMCwgdmFsLCBpLCB0KSk7XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gYTtcblx0fTtcbn1cblxuLy8gRVM1IGlzQXJyYXlcbmlmICghQXJyYXkuaXNBcnJheSkge1xuXG5cdC8vIEZ1bmN0aW9uIEFycmF5LmlzQXJyYXlcblx0QXJyYXkuaXNBcnJheSA9IGZ1bmN0aW9uKG8pIHtcblx0XHRyZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xuXHR9O1xuXG59XG5cbi8vIFRlc3QgZm9yIGxvY2F0aW9uLmFzc2lnblxuaWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHR5cGVvZiB3aW5kb3cubG9jYXRpb24gPT09ICdvYmplY3QnICYmICF3aW5kb3cubG9jYXRpb24uYXNzaWduKSB7XG5cblx0d2luZG93LmxvY2F0aW9uLmFzc2lnbiA9IGZ1bmN0aW9uKHVybCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbiA9IHVybDtcblx0fTtcblxufVxuXG4vLyBUZXN0IGZvciBGdW5jdGlvbi5iaW5kXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XG5cblx0Ly8gTUROXG5cdC8vIFBvbHlmaWxsIElFOCwgZG9lcyBub3Qgc3VwcG9ydCBuYXRpdmUgRnVuY3Rpb24uYmluZFxuXHRGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKGIpIHtcblxuXHRcdGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0dGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBDKCkge31cblxuXHRcdHZhciBhID0gW10uc2xpY2U7XG5cdFx0dmFyIGYgPSBhLmNhbGwoYXJndW1lbnRzLCAxKTtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBEID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gX3RoaXMuYXBwbHkodGhpcyBpbnN0YW5jZW9mIEMgPyB0aGlzIDogYiB8fCB3aW5kb3csIGYuY29uY2F0KGEuY2FsbChhcmd1bWVudHMpKSk7XG5cdFx0fTtcblxuXHRcdEMucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XG5cdFx0RC5wcm90b3R5cGUgPSBuZXcgQygpO1xuXG5cdFx0cmV0dXJuIEQ7XG5cdH07XG5cbn1cblxuLyoqXG4gKiBAaGVsbG8uanNcbiAqXG4gKiBIZWxsb0pTIGlzIGEgY2xpZW50IHNpZGUgSmF2YXNjcmlwdCBTREsgZm9yIG1ha2luZyBPQXV0aDIgbG9naW5zIGFuZCBzdWJzZXF1ZW50IFJFU1QgY2FsbHMuXG4gKlxuICogQGF1dGhvciBBbmRyZXcgRG9kc29uXG4gKiBAd2Vic2l0ZSBodHRwczovL2Fkb2Rzb24uY29tL2hlbGxvLmpzL1xuICpcbiAqIEBjb3B5cmlnaHQgQW5kcmV3IERvZHNvbiwgMjAxMiAtIDIwMTVcbiAqIEBsaWNlbnNlIE1JVDogWW91IGFyZSBmcmVlIHRvIHVzZSBhbmQgbW9kaWZ5IHRoaXMgY29kZSBmb3IgYW55IHVzZSwgb24gdGhlIGNvbmRpdGlvbiB0aGF0IHRoaXMgY29weXJpZ2h0IG5vdGljZSByZW1haW5zLlxuICovXG5cbnZhciBoZWxsbyA9IGZ1bmN0aW9uKG5hbWUpIHtcblx0cmV0dXJuIGhlbGxvLnVzZShuYW1lKTtcbn07XG5cbmhlbGxvLnV0aWxzID0ge1xuXG5cdC8vIEV4dGVuZCB0aGUgZmlyc3Qgb2JqZWN0IHdpdGggdGhlIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgb2YgdGhlIHNlY29uZFxuXHRleHRlbmQ6IGZ1bmN0aW9uKHIgLyosIGFbLCBiWywgLi4uXV0gKi8pIHtcblxuXHRcdC8vIEdldCB0aGUgYXJndW1lbnRzIGFzIGFuIGFycmF5IGJ1dCBvbW1pdCB0aGUgaW5pdGlhbCBpdGVtXG5cdFx0QXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKS5mb3JFYWNoKGZ1bmN0aW9uKGEpIHtcblx0XHRcdGlmIChyIGluc3RhbmNlb2YgT2JqZWN0ICYmIGEgaW5zdGFuY2VvZiBPYmplY3QgJiYgciAhPT0gYSkge1xuXHRcdFx0XHRmb3IgKHZhciB4IGluIGEpIHtcblx0XHRcdFx0XHRyW3hdID0gaGVsbG8udXRpbHMuZXh0ZW5kKHJbeF0sIGFbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0ciA9IGE7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gcjtcblx0fVxufTtcblxuLy8gQ29yZSBsaWJyYXJ5XG5oZWxsby51dGlscy5leHRlbmQoaGVsbG8sIHtcblxuXHRzZXR0aW5nczoge1xuXG5cdFx0Ly8gT0F1dGgyIGF1dGhlbnRpY2F0aW9uIGRlZmF1bHRzXG5cdFx0cmVkaXJlY3RfdXJpOiB3aW5kb3cubG9jYXRpb24uaHJlZi5zcGxpdCgnIycpWzBdLFxuXHRcdHJlc3BvbnNlX3R5cGU6ICd0b2tlbicsXG5cdFx0ZGlzcGxheTogJ3BvcHVwJyxcblx0XHRzdGF0ZTogJycsXG5cblx0XHQvLyBPQXV0aDEgc2hpbVxuXHRcdC8vIFRoZSBwYXRoIHRvIHRoZSBPQXV0aDEgc2VydmVyIGZvciBzaWduaW5nIHVzZXIgcmVxdWVzdHNcblx0XHQvLyBXYW50IHRvIHJlY3JlYXRlIHlvdXIgb3duPyBDaGVja291dCBodHRwczovL2dpdGh1Yi5jb20vTXJTd2l0Y2gvbm9kZS1vYXV0aC1zaGltXG5cdFx0b2F1dGhfcHJveHk6ICdodHRwczovL2F1dGgtc2VydmVyLmhlcm9rdWFwcC5jb20vcHJveHknLFxuXG5cdFx0Ly8gQVBJIHRpbWVvdXQgaW4gbWlsbGlzZWNvbmRzXG5cdFx0dGltZW91dDogMjAwMDAsXG5cblx0XHQvLyBQb3B1cCBPcHRpb25zXG5cdFx0cG9wdXA6IHtcblx0XHRcdHJlc2l6YWJsZTogMSxcblx0XHRcdHNjcm9sbGJhcnM6IDEsXG5cdFx0XHR3aWR0aDogNTAwLFxuXHRcdFx0aGVpZ2h0OiA1NTBcblx0XHR9LFxuXG5cdFx0Ly8gRGVmYXVsdCBzZXJ2aWNlIC8gbmV0d29ya1xuXHRcdGRlZmF1bHRfc2VydmljZTogbnVsbCxcblxuXHRcdC8vIEZvcmNlIGF1dGhlbnRpY2F0aW9uXG5cdFx0Ly8gV2hlbiBoZWxsby5sb2dpbiBpcyBmaXJlZC5cblx0XHQvLyAobnVsbCk6IGlnbm9yZSBjdXJyZW50IHNlc3Npb24gZXhwaXJ5IGFuZCBjb250aW51ZSB3aXRoIGxvZ2luXG5cdFx0Ly8gKHRydWUpOiBpZ25vcmUgY3VycmVudCBzZXNzaW9uIGV4cGlyeSBhbmQgY29udGludWUgd2l0aCBsb2dpbiwgYXNrIGZvciB1c2VyIHRvIHJlYXV0aGVudGljYXRlXG5cdFx0Ly8gKGZhbHNlKTogaWYgdGhlIGN1cnJlbnQgc2Vzc2lvbiBsb29rcyBnb29kIGZvciB0aGUgcmVxdWVzdCBzY29wZXMgcmV0dXJuIHRoZSBjdXJyZW50IHNlc3Npb24uXG5cdFx0Zm9yY2U6IG51bGwsXG5cblx0XHQvLyBQYWdlIFVSTFxuXHRcdC8vIFdoZW4gJ2Rpc3BsYXk9cGFnZScgdGhpcyBwcm9wZXJ0eSBkZWZpbmVzIHdoZXJlIHRoZSB1c2VycyBwYWdlIHNob3VsZCBlbmQgdXAgYWZ0ZXIgcmVkaXJlY3RfdXJpXG5cdFx0Ly8gVGhzIGNvdWxkIGJlIHByb2JsZW1hdGljIGlmIHRoZSByZWRpcmVjdF91cmkgaXMgaW5kZWVkIHRoZSBmaW5hbCBwbGFjZSxcblx0XHQvLyBUeXBpY2FsbHkgdGhpcyBjaXJjdW12ZW50cyB0aGUgcHJvYmxlbSBvZiB0aGUgcmVkaXJlY3RfdXJsIGJlaW5nIGEgZHVtYiByZWxheSBwYWdlLlxuXHRcdHBhZ2VfdXJpOiB3aW5kb3cubG9jYXRpb24uaHJlZlxuXHR9LFxuXG5cdC8vIFNlcnZpY2UgY29uZmlndXJhdGlvbiBvYmplY3RzXG5cdHNlcnZpY2VzOiB7fSxcblxuXHQvLyBVc2Vcblx0Ly8gRGVmaW5lIGEgbmV3IGluc3RhbmNlIG9mIHRoZSBIZWxsb0pTIGxpYnJhcnkgd2l0aCBhIGRlZmF1bHQgc2VydmljZVxuXHR1c2U6IGZ1bmN0aW9uKHNlcnZpY2UpIHtcblxuXHRcdC8vIENyZWF0ZSBzZWxmLCB3aGljaCBpbmhlcml0cyBmcm9tIGl0cyBwYXJlbnRcblx0XHR2YXIgc2VsZiA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG5cblx0XHQvLyBJbmhlcml0IHRoZSBwcm90b3R5cGUgZnJvbSBpdHMgcGFyZW50XG5cdFx0c2VsZi5zZXR0aW5ncyA9IE9iamVjdC5jcmVhdGUodGhpcy5zZXR0aW5ncyk7XG5cblx0XHQvLyBEZWZpbmUgdGhlIGRlZmF1bHQgc2VydmljZVxuXHRcdGlmIChzZXJ2aWNlKSB7XG5cdFx0XHRzZWxmLnNldHRpbmdzLmRlZmF1bHRfc2VydmljZSA9IHNlcnZpY2U7XG5cdFx0fVxuXG5cdFx0Ly8gQ3JlYXRlIGFuIGluc3RhbmNlIG9mIEV2ZW50c1xuXHRcdHNlbGYudXRpbHMuRXZlbnQuY2FsbChzZWxmKTtcblxuXHRcdHJldHVybiBzZWxmO1xuXHR9LFxuXG5cdC8vIEluaXRpYWxpemVcblx0Ly8gRGVmaW5lIHRoZSBjbGllbnRfaWRzIGZvciB0aGUgZW5kcG9pbnQgc2VydmljZXNcblx0Ly8gQHBhcmFtIG9iamVjdCBvLCBjb250YWlucyBhIGtleSB2YWx1ZSBwYWlyLCBzZXJ2aWNlID0+IGNsaWVudElkXG5cdC8vIEBwYXJhbSBvYmplY3Qgb3B0cywgY29udGFpbnMgYSBrZXkgdmFsdWUgcGFpciBvZiBvcHRpb25zIHVzZWQgZm9yIGRlZmluaW5nIHRoZSBhdXRoZW50aWNhdGlvbiBkZWZhdWx0c1xuXHQvLyBAcGFyYW0gbnVtYmVyIHRpbWVvdXQsIHRpbWVvdXQgaW4gc2Vjb25kc1xuXHRpbml0OiBmdW5jdGlvbihzZXJ2aWNlcywgb3B0aW9ucykge1xuXG5cdFx0dmFyIHV0aWxzID0gdGhpcy51dGlscztcblxuXHRcdGlmICghc2VydmljZXMpIHtcblx0XHRcdHJldHVybiB0aGlzLnNlcnZpY2VzO1xuXHRcdH1cblxuXHRcdC8vIERlZmluZSBwcm92aWRlciBjcmVkZW50aWFsc1xuXHRcdC8vIFJlZm9ybWF0IHRoZSBJRCBmaWVsZFxuXHRcdGZvciAodmFyIHggaW4gc2VydmljZXMpIHtpZiAoc2VydmljZXMuaGFzT3duUHJvcGVydHkoeCkpIHtcblx0XHRcdGlmICh0eXBlb2YgKHNlcnZpY2VzW3hdKSAhPT0gJ29iamVjdCcpIHtcblx0XHRcdFx0c2VydmljZXNbeF0gPSB7aWQ6IHNlcnZpY2VzW3hdfTtcblx0XHRcdH1cblx0XHR9fVxuXG5cdFx0Ly8gTWVyZ2Ugc2VydmljZXMgaWYgdGhlcmUgYWxyZWFkeSBleGlzdHMgc29tZVxuXHRcdHV0aWxzLmV4dGVuZCh0aGlzLnNlcnZpY2VzLCBzZXJ2aWNlcyk7XG5cblx0XHQvLyBGb3JtYXQgdGhlIGluY29taW5nXG5cdFx0Zm9yICh4IGluIHRoaXMuc2VydmljZXMpIHtcblx0XHRcdGlmICh0aGlzLnNlcnZpY2VzLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdHRoaXMuc2VydmljZXNbeF0uc2NvcGUgPSB0aGlzLnNlcnZpY2VzW3hdLnNjb3BlIHx8IHt9O1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vXG5cdFx0Ly8gVXBkYXRlIHRoZSBkZWZhdWx0IHNldHRpbmdzIHdpdGggdGhpcyBvbmUuXG5cdFx0aWYgKG9wdGlvbnMpIHtcblx0XHRcdHV0aWxzLmV4dGVuZCh0aGlzLnNldHRpbmdzLCBvcHRpb25zKTtcblxuXHRcdFx0Ly8gRG8gdGhpcyBpbW1lZGlhdGx5IGluY2FzZSB0aGUgYnJvd3NlciBjaGFuZ2VzIHRoZSBjdXJyZW50IHBhdGguXG5cdFx0XHRpZiAoJ3JlZGlyZWN0X3VyaScgaW4gb3B0aW9ucykge1xuXHRcdFx0XHR0aGlzLnNldHRpbmdzLnJlZGlyZWN0X3VyaSA9IHV0aWxzLnVybChvcHRpb25zLnJlZGlyZWN0X3VyaSkuaHJlZjtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBMb2dpblxuXHQvLyBVc2luZyB0aGUgZW5kcG9pbnRcblx0Ly8gQHBhcmFtIG5ldHdvcmsgc3RyaW5naWZ5ICAgICAgIG5hbWUgdG8gY29ubmVjdCB0b1xuXHQvLyBAcGFyYW0gb3B0aW9ucyBvYmplY3QgICAgKG9wdGlvbmFsKSAge2Rpc3BsYXkgbW9kZSwgaXMgZWl0aGVyIG5vbmV8cG9wdXAoZGVmYXVsdCl8cGFnZSwgc2NvcGU6IGVtYWlsLGJpcnRoZGF5LHB1Ymxpc2gsIC4uIH1cblx0Ly8gQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvbiAgKG9wdGlvbmFsKSAgZmlyZWQgb24gc2lnbmluXG5cdGxvZ2luOiBmdW5jdGlvbigpIHtcblxuXHRcdC8vIENyZWF0ZSBhbiBvYmplY3Qgd2hpY2ggaW5oZXJpdHMgaXRzIHBhcmVudCBhcyB0aGUgcHJvdG90eXBlIGFuZCBjb25zdHJ1Y3RzIGEgbmV3IGV2ZW50IGNoYWluLlxuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0dmFyIHV0aWxzID0gX3RoaXMudXRpbHM7XG5cdFx0dmFyIGVycm9yID0gdXRpbHMuZXJyb3I7XG5cdFx0dmFyIHByb21pc2UgPSB1dGlscy5Qcm9taXNlKCk7XG5cblx0XHQvLyBHZXQgcGFyYW1ldGVyc1xuXHRcdHZhciBwID0gdXRpbHMuYXJncyh7bmV0d29yazogJ3MnLCBvcHRpb25zOiAnbycsIGNhbGxiYWNrOiAnZid9LCBhcmd1bWVudHMpO1xuXG5cdFx0Ly8gTG9jYWwgdmFyc1xuXHRcdHZhciB1cmw7XG5cblx0XHQvLyBHZXQgYWxsIHRoZSBjdXN0b20gb3B0aW9ucyBhbmQgc3RvcmUgdG8gYmUgYXBwZW5kZWQgdG8gdGhlIHF1ZXJ5c3RyaW5nXG5cdFx0dmFyIHFzID0gdXRpbHMuZGlmZktleShwLm9wdGlvbnMsIF90aGlzLnNldHRpbmdzKTtcblxuXHRcdC8vIE1lcmdlL292ZXJyaWRlIG9wdGlvbnMgd2l0aCBhcHAgZGVmYXVsdHNcblx0XHR2YXIgb3B0cyA9IHAub3B0aW9ucyA9IHV0aWxzLm1lcmdlKF90aGlzLnNldHRpbmdzLCBwLm9wdGlvbnMgfHwge30pO1xuXG5cdFx0Ly8gTWVyZ2Uvb3ZlcnJpZGUgb3B0aW9ucyB3aXRoIGFwcCBkZWZhdWx0c1xuXHRcdG9wdHMucG9wdXAgPSB1dGlscy5tZXJnZShfdGhpcy5zZXR0aW5ncy5wb3B1cCwgcC5vcHRpb25zLnBvcHVwIHx8IHt9KTtcblxuXHRcdC8vIE5ldHdvcmtcblx0XHRwLm5ldHdvcmsgPSBwLm5ldHdvcmsgfHwgX3RoaXMuc2V0dGluZ3MuZGVmYXVsdF9zZXJ2aWNlO1xuXG5cdFx0Ly8gQmluZCBjYWxsYmFjayB0byBib3RoIHJlamVjdCBhbmQgZnVsZmlsbCBzdGF0ZXNcblx0XHRwcm9taXNlLnByb3h5LnRoZW4ocC5jYWxsYmFjaywgcC5jYWxsYmFjayk7XG5cblx0XHQvLyBUcmlnZ2VyIGFuIGV2ZW50IG9uIHRoZSBnbG9iYWwgbGlzdGVuZXJcblx0XHRmdW5jdGlvbiBlbWl0KHMsIHZhbHVlKSB7XG5cdFx0XHRoZWxsby5lbWl0KHMsIHZhbHVlKTtcblx0XHR9XG5cblx0XHRwcm9taXNlLnByb3h5LnRoZW4oZW1pdC5iaW5kKHRoaXMsICdhdXRoLmxvZ2luIGF1dGgnKSwgZW1pdC5iaW5kKHRoaXMsICdhdXRoLmZhaWxlZCBhdXRoJykpO1xuXG5cdFx0Ly8gSXMgb3VyIHNlcnZpY2UgdmFsaWQ/XG5cdFx0aWYgKHR5cGVvZiAocC5uZXR3b3JrKSAhPT0gJ3N0cmluZycgfHwgIShwLm5ldHdvcmsgaW4gX3RoaXMuc2VydmljZXMpKSB7XG5cdFx0XHQvLyBUcmlnZ2VyIHRoZSBkZWZhdWx0IGxvZ2luLlxuXHRcdFx0Ly8gQWhoIHdlIGRvbnQgaGF2ZSBvbmUuXG5cdFx0XHRyZXR1cm4gcHJvbWlzZS5yZWplY3QoZXJyb3IoJ2ludmFsaWRfbmV0d29yaycsICdUaGUgcHJvdmlkZWQgbmV0d29yayB3YXMgbm90IHJlY29nbml6ZWQnKSk7XG5cdFx0fVxuXG5cdFx0dmFyIHByb3ZpZGVyID0gX3RoaXMuc2VydmljZXNbcC5uZXR3b3JrXTtcblxuXHRcdC8vIENyZWF0ZSBhIGdsb2JhbCBsaXN0ZW5lciB0byBjYXB0dXJlIGV2ZW50cyB0cmlnZ2VyZWQgb3V0IG9mIHNjb3BlXG5cdFx0dmFyIGNhbGxiYWNrSWQgPSB1dGlscy5nbG9iYWxFdmVudChmdW5jdGlvbihzdHIpIHtcblxuXHRcdFx0Ly8gVGhlIHJlc3BvbnNlSGFuZGxlciByZXR1cm5zIGEgc3RyaW5nLCBsZXRzIHNhdmUgdGhpcyBsb2NhbGx5XG5cdFx0XHR2YXIgb2JqO1xuXG5cdFx0XHRpZiAoc3RyKSB7XG5cdFx0XHRcdG9iaiA9IEpTT04ucGFyc2Uoc3RyKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRvYmogPSBlcnJvcignY2FuY2VsbGVkJywgJ1RoZSBhdXRoZW50aWNhdGlvbiB3YXMgbm90IGNvbXBsZXRlZCcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBIYW5kbGUgdGhlc2UgcmVzcG9uc2UgdXNpbmcgdGhlIGxvY2FsXG5cdFx0XHQvLyBUcmlnZ2VyIG9uIHRoZSBwYXJlbnRcblx0XHRcdGlmICghb2JqLmVycm9yKSB7XG5cblx0XHRcdFx0Ly8gU2F2ZSBvbiB0aGUgcGFyZW50IHdpbmRvdyB0aGUgbmV3IGNyZWRlbnRpYWxzXG5cdFx0XHRcdC8vIFRoaXMgZml4ZXMgYW4gSUUxMCBidWcgaSB0aGluay4uLiBhdGxlYXN0IGl0IGRvZXMgZm9yIG1lLlxuXHRcdFx0XHR1dGlscy5zdG9yZShvYmoubmV0d29yaywgb2JqKTtcblxuXHRcdFx0XHQvLyBGdWxmaWxsIGEgc3VjY2Vzc2Z1bCBsb2dpblxuXHRcdFx0XHRwcm9taXNlLmZ1bGZpbGwoe1xuXHRcdFx0XHRcdG5ldHdvcms6IG9iai5uZXR3b3JrLFxuXHRcdFx0XHRcdGF1dGhSZXNwb25zZTogb2JqXG5cdFx0XHRcdH0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIFJlamVjdCBhIHN1Y2Nlc3NmdWwgbG9naW5cblx0XHRcdFx0cHJvbWlzZS5yZWplY3Qob2JqKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciByZWRpcmVjdFVyaSA9IHV0aWxzLnVybChvcHRzLnJlZGlyZWN0X3VyaSkuaHJlZjtcblxuXHRcdC8vIE1heSBiZSBhIHNwYWNlLWRlbGltaXRlZCBsaXN0IG9mIG11bHRpcGxlLCBjb21wbGVtZW50YXJ5IHR5cGVzXG5cdFx0dmFyIHJlc3BvbnNlVHlwZSA9IHByb3ZpZGVyLm9hdXRoLnJlc3BvbnNlX3R5cGUgfHwgb3B0cy5yZXNwb25zZV90eXBlO1xuXG5cdFx0Ly8gRmFsbGJhY2sgdG8gdG9rZW4gaWYgdGhlIG1vZHVsZSBoYXNuJ3QgZGVmaW5lZCBhIGdyYW50IHVybFxuXHRcdGlmICgvXFxiY29kZVxcYi8udGVzdChyZXNwb25zZVR5cGUpICYmICFwcm92aWRlci5vYXV0aC5ncmFudCkge1xuXHRcdFx0cmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlLnJlcGxhY2UoL1xcYmNvZGVcXGIvLCAndG9rZW4nKTtcblx0XHR9XG5cblx0XHQvLyBRdWVyeSBzdHJpbmcgcGFyYW1ldGVycywgd2UgbWF5IHBhc3Mgb3VyIG93biBhcmd1bWVudHMgdG8gZm9ybSB0aGUgcXVlcnlzdHJpbmdcblx0XHRwLnFzID0gdXRpbHMubWVyZ2UocXMsIHtcblx0XHRcdGNsaWVudF9pZDogZW5jb2RlVVJJQ29tcG9uZW50KHByb3ZpZGVyLmlkKSxcblx0XHRcdHJlc3BvbnNlX3R5cGU6IGVuY29kZVVSSUNvbXBvbmVudChyZXNwb25zZVR5cGUpLFxuXHRcdFx0cmVkaXJlY3RfdXJpOiBlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVcmkpLFxuXHRcdFx0ZGlzcGxheTogb3B0cy5kaXNwbGF5LFxuXHRcdFx0c2NvcGU6ICdiYXNpYycsXG5cdFx0XHRzdGF0ZToge1xuXHRcdFx0XHRjbGllbnRfaWQ6IHByb3ZpZGVyLmlkLFxuXHRcdFx0XHRuZXR3b3JrOiBwLm5ldHdvcmssXG5cdFx0XHRcdGRpc3BsYXk6IG9wdHMuZGlzcGxheSxcblx0XHRcdFx0Y2FsbGJhY2s6IGNhbGxiYWNrSWQsXG5cdFx0XHRcdHN0YXRlOiBvcHRzLnN0YXRlLFxuXHRcdFx0XHRyZWRpcmVjdF91cmk6IHJlZGlyZWN0VXJpXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBHZXQgY3VycmVudCBzZXNzaW9uIGZvciBtZXJnaW5nIHNjb3BlcywgYW5kIGZvciBxdWljayBhdXRoIHJlc3BvbnNlXG5cdFx0dmFyIHNlc3Npb24gPSB1dGlscy5zdG9yZShwLm5ldHdvcmspO1xuXG5cdFx0Ly8gU2NvcGVzIChhdXRoZW50aWNhdGlvbiBwZXJtaXNpb25zKVxuXHRcdC8vIEVuc3VyZSB0aGlzIGlzIGEgc3RyaW5nIC0gSUUgaGFzIGEgcHJvYmxlbSBtb3ZpbmcgQXJyYXlzIGJldHdlZW4gd2luZG93c1xuXHRcdC8vIEFwcGVuZCB0aGUgc2V0dXAgc2NvcGVcblx0XHR2YXIgU0NPUEVfU1BMSVQgPSAvWyxcXHNdKy87XG5cdFx0dmFyIHNjb3BlID0gKG9wdHMuc2NvcGUgfHwgJycpLnRvU3RyaW5nKCkgKyAnLCcgKyBwLnFzLnNjb3BlO1xuXG5cdFx0Ly8gQXBwZW5kIHNjb3BlcyBmcm9tIGEgcHJldmlvdXMgc2Vzc2lvbi5cblx0XHQvLyBUaGlzIGhlbHBzIGtlZXAgYXBwIGNyZWRlbnRpYWxzIGNvbnN0YW50LFxuXHRcdC8vIEF2b2lkaW5nIGhhdmluZyB0byBrZWVwIHRhYnMgb24gd2hhdCBzY29wZXMgYXJlIGF1dGhvcml6ZWRcblx0XHRpZiAoc2Vzc2lvbiAmJiAnc2NvcGUnIGluIHNlc3Npb24gJiYgc2Vzc2lvbi5zY29wZSBpbnN0YW5jZW9mIFN0cmluZykge1xuXHRcdFx0c2NvcGUgKz0gJywnICsgc2Vzc2lvbi5zY29wZTtcblx0XHR9XG5cblx0XHQvLyBDb252ZXJ0IHNjb3BlIHRvIGFuIEFycmF5XG5cdFx0Ly8gLSBlYXNpZXIgdG8gbWFuaXB1bGF0ZVxuXHRcdHNjb3BlID0gc2NvcGUuc3BsaXQoU0NPUEVfU1BMSVQpO1xuXG5cdFx0Ly8gRm9ybWF0IHJlbW92ZSBkdXBsaWNhdGVzIGFuZCBlbXB0eSB2YWx1ZXNcblx0XHRzY29wZSA9IHV0aWxzLnVuaXF1ZShzY29wZSkuZmlsdGVyKGZpbHRlckVtcHR5KTtcblxuXHRcdC8vIFNhdmUgdGhlIHRoZSBzY29wZXMgdG8gdGhlIHN0YXRlIHdpdGggdGhlIG5hbWVzIHRoYXQgdGhleSB3ZXJlIHJlcXVlc3RlZCB3aXRoLlxuXHRcdHAucXMuc3RhdGUuc2NvcGUgPSBzY29wZS5qb2luKCcsJyk7XG5cblx0XHQvLyBNYXAgc2NvcGVzIHRvIHRoZSBwcm92aWRlcnMgbmFtaW5nIGNvbnZlbnRpb25cblx0XHRzY29wZSA9IHNjb3BlLm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHQvLyBEb2VzIHRoaXMgaGF2ZSBhIG1hcHBpbmc/XG5cdFx0XHRpZiAoaXRlbSBpbiBwcm92aWRlci5zY29wZSkge1xuXHRcdFx0XHRyZXR1cm4gcHJvdmlkZXIuc2NvcGVbaXRlbV07XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Ly8gTG9vcCB0aHJvdWdoIGFsbCBzZXJ2aWNlcyBhbmQgZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHNjb3BlIGlzIGdlbmVyaWNcblx0XHRcdFx0Zm9yICh2YXIgeCBpbiBfdGhpcy5zZXJ2aWNlcykge1xuXHRcdFx0XHRcdHZhciBzZXJ2aWNlU2NvcGVzID0gX3RoaXMuc2VydmljZXNbeF0uc2NvcGU7XG5cdFx0XHRcdFx0aWYgKHNlcnZpY2VTY29wZXMgJiYgaXRlbSBpbiBzZXJ2aWNlU2NvcGVzKSB7XG5cdFx0XHRcdFx0XHQvLyBGb3VuZCBhbiBpbnN0YW5jZSBvZiB0aGlzIHNjb3BlLCBzbyBsZXRzIG5vdCBhc3N1bWUgaXRzIHNwZWNpYWxcblx0XHRcdFx0XHRcdHJldHVybiAnJztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGlzIGlzIGEgdW5pcXVlIHNjb3BlIHRvIHRoaXMgc2VydmljZSBzbyBsZXRzIGluIGl0LlxuXHRcdFx0XHRyZXR1cm4gaXRlbTtcblx0XHRcdH1cblxuXHRcdH0pO1xuXG5cdFx0Ly8gU3RyaW5naWZ5IGFuZCBBcnJheWlmeSBzbyB0aGF0IGRvdWJsZSBtYXBwZWQgc2NvcGVzIGFyZSBnaXZlbiB0aGUgY2hhbmNlIHRvIGJlIGZvcm1hdHRlZFxuXHRcdHNjb3BlID0gc2NvcGUuam9pbignLCcpLnNwbGl0KFNDT1BFX1NQTElUKTtcblxuXHRcdC8vIEFnYWluLi4uXG5cdFx0Ly8gRm9ybWF0IHJlbW92ZSBkdXBsaWNhdGVzIGFuZCBlbXB0eSB2YWx1ZXNcblx0XHRzY29wZSA9IHV0aWxzLnVuaXF1ZShzY29wZSkuZmlsdGVyKGZpbHRlckVtcHR5KTtcblxuXHRcdC8vIEpvaW4gd2l0aCB0aGUgZXhwZWN0ZWQgc2NvcGUgZGVsaW1pdGVyIGludG8gYSBzdHJpbmdcblx0XHRwLnFzLnNjb3BlID0gc2NvcGUuam9pbihwcm92aWRlci5zY29wZV9kZWxpbSB8fCAnLCcpO1xuXG5cdFx0Ly8gSXMgdGhlIHVzZXIgYWxyZWFkeSBzaWduZWQgaW4gd2l0aCB0aGUgYXBwcm9wcmlhdGUgc2NvcGVzLCB2YWxpZCBhY2Nlc3NfdG9rZW4/XG5cdFx0aWYgKG9wdHMuZm9yY2UgPT09IGZhbHNlKSB7XG5cblx0XHRcdGlmIChzZXNzaW9uICYmICdhY2Nlc3NfdG9rZW4nIGluIHNlc3Npb24gJiYgc2Vzc2lvbi5hY2Nlc3NfdG9rZW4gJiYgJ2V4cGlyZXMnIGluIHNlc3Npb24gJiYgc2Vzc2lvbi5leHBpcmVzID4gKChuZXcgRGF0ZSgpKS5nZXRUaW1lKCkgLyAxZTMpKSB7XG5cdFx0XHRcdC8vIFdoYXQgaXMgZGlmZmVyZW50IGFib3V0IHRoZSBzY29wZXMgaW4gdGhlIHNlc3Npb24gdnMgdGhlIHNjb3BlcyBpbiB0aGUgbmV3IGxvZ2luP1xuXHRcdFx0XHR2YXIgZGlmZiA9IHV0aWxzLmRpZmYoKHNlc3Npb24uc2NvcGUgfHwgJycpLnNwbGl0KFNDT1BFX1NQTElUKSwgKHAucXMuc3RhdGUuc2NvcGUgfHwgJycpLnNwbGl0KFNDT1BFX1NQTElUKSk7XG5cdFx0XHRcdGlmIChkaWZmLmxlbmd0aCA9PT0gMCkge1xuXG5cdFx0XHRcdFx0Ly8gT0sgdHJpZ2dlciB0aGUgY2FsbGJhY2tcblx0XHRcdFx0XHRwcm9taXNlLmZ1bGZpbGwoe1xuXHRcdFx0XHRcdFx0dW5jaGFuZ2VkOiB0cnVlLFxuXHRcdFx0XHRcdFx0bmV0d29yazogcC5uZXR3b3JrLFxuXHRcdFx0XHRcdFx0YXV0aFJlc3BvbnNlOiBzZXNzaW9uXG5cdFx0XHRcdFx0fSk7XG5cblx0XHRcdFx0XHQvLyBOb3RoaW5nIGhhcyBjaGFuZ2VkXG5cdFx0XHRcdFx0cmV0dXJuIHByb21pc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBQYWdlIFVSTFxuXHRcdGlmIChvcHRzLmRpc3BsYXkgPT09ICdwYWdlJyAmJiBvcHRzLnBhZ2VfdXJpKSB7XG5cdFx0XHQvLyBBZGQgYSBwYWdlIGxvY2F0aW9uLCBwbGFjZSB0byBlbmR1cCBhZnRlciBzZXNzaW9uIGhhcyBhdXRoZW50aWNhdGVkXG5cdFx0XHRwLnFzLnN0YXRlLnBhZ2VfdXJpID0gdXRpbHMudXJsKG9wdHMucGFnZV91cmkpLmhyZWY7XG5cdFx0fVxuXG5cdFx0Ly8gQmVzcG9rZVxuXHRcdC8vIE92ZXJyaWRlIGxvZ2luIHF1ZXJ5c3RyaW5ncyBmcm9tIGF1dGhfb3B0aW9uc1xuXHRcdGlmICgnbG9naW4nIGluIHByb3ZpZGVyICYmIHR5cGVvZiAocHJvdmlkZXIubG9naW4pID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHQvLyBGb3JtYXQgdGhlIHBhcmFtYXRlcnMgYWNjb3JkaW5nIHRvIHRoZSBwcm92aWRlcnMgZm9ybWF0dGluZyBmdW5jdGlvblxuXHRcdFx0cHJvdmlkZXIubG9naW4ocCk7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIE9BdXRoIHRvIHN0YXRlXG5cdFx0Ly8gV2hlcmUgdGhlIHNlcnZpY2UgaXMgZ29pbmcgdG8gdGFrZSBhZHZhbnRhZ2Ugb2YgdGhlIG9hdXRoX3Byb3h5XG5cdFx0aWYgKCEvXFxidG9rZW5cXGIvLnRlc3QocmVzcG9uc2VUeXBlKSB8fFxuXHRcdHBhcnNlSW50KHByb3ZpZGVyLm9hdXRoLnZlcnNpb24sIDEwKSA8IDIgfHxcblx0XHQob3B0cy5kaXNwbGF5ID09PSAnbm9uZScgJiYgcHJvdmlkZXIub2F1dGguZ3JhbnQgJiYgc2Vzc2lvbiAmJiBzZXNzaW9uLnJlZnJlc2hfdG9rZW4pKSB7XG5cblx0XHRcdC8vIEFkZCB0aGUgb2F1dGggZW5kcG9pbnRzXG5cdFx0XHRwLnFzLnN0YXRlLm9hdXRoID0gcHJvdmlkZXIub2F1dGg7XG5cblx0XHRcdC8vIEFkZCB0aGUgcHJveHkgdXJsXG5cdFx0XHRwLnFzLnN0YXRlLm9hdXRoX3Byb3h5ID0gb3B0cy5vYXV0aF9wcm94eTtcblxuXHRcdH1cblxuXHRcdC8vIENvbnZlcnQgc3RhdGUgdG8gYSBzdHJpbmdcblx0XHRwLnFzLnN0YXRlID0gZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHAucXMuc3RhdGUpKTtcblxuXHRcdC8vIFVSTFxuXHRcdGlmIChwYXJzZUludChwcm92aWRlci5vYXV0aC52ZXJzaW9uLCAxMCkgPT09IDEpIHtcblxuXHRcdFx0Ly8gVHVybiB0aGUgcmVxdWVzdCB0byB0aGUgT0F1dGggUHJveHkgZm9yIDMtbGVnZ2VkIGF1dGhcblx0XHRcdHVybCA9IHV0aWxzLnFzKG9wdHMub2F1dGhfcHJveHksIHAucXMsIGVuY29kZUZ1bmN0aW9uKTtcblx0XHR9XG5cblx0XHQvLyBSZWZyZXNoIHRva2VuXG5cdFx0ZWxzZSBpZiAob3B0cy5kaXNwbGF5ID09PSAnbm9uZScgJiYgcHJvdmlkZXIub2F1dGguZ3JhbnQgJiYgc2Vzc2lvbiAmJiBzZXNzaW9uLnJlZnJlc2hfdG9rZW4pIHtcblxuXHRcdFx0Ly8gQWRkIHRoZSByZWZyZXNoX3Rva2VuIHRvIHRoZSByZXF1ZXN0XG5cdFx0XHRwLnFzLnJlZnJlc2hfdG9rZW4gPSBzZXNzaW9uLnJlZnJlc2hfdG9rZW47XG5cblx0XHRcdC8vIERlZmluZSB0aGUgcmVxdWVzdCBwYXRoXG5cdFx0XHR1cmwgPSB1dGlscy5xcyhvcHRzLm9hdXRoX3Byb3h5LCBwLnFzLCBlbmNvZGVGdW5jdGlvbik7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0dXJsID0gdXRpbHMucXMocHJvdmlkZXIub2F1dGguYXV0aCwgcC5xcywgZW5jb2RlRnVuY3Rpb24pO1xuXHRcdH1cblxuXHRcdC8vIEV4ZWN1dGVcblx0XHQvLyBUcmlnZ2VyIGhvdyB3ZSB3YW50IHNlbGYgZGlzcGxheWVkXG5cdFx0aWYgKG9wdHMuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG5cdFx0XHQvLyBTaWduLWluIGluIHRoZSBiYWNrZ3JvdW5kLCBpZnJhbWVcblx0XHRcdHV0aWxzLmlmcmFtZSh1cmwsIHJlZGlyZWN0VXJpKTtcblx0XHR9XG5cblx0XHQvLyBUcmlnZ2VyaW5nIHBvcHVwP1xuXHRcdGVsc2UgaWYgKG9wdHMuZGlzcGxheSA9PT0gJ3BvcHVwJykge1xuXG5cdFx0XHR2YXIgcG9wdXAgPSB1dGlscy5wb3B1cCh1cmwsIHJlZGlyZWN0VXJpLCBvcHRzLnBvcHVwKTtcblxuXHRcdFx0dmFyIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmICghcG9wdXAgfHwgcG9wdXAuY2xvc2VkKSB7XG5cdFx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdFx0aWYgKCFwcm9taXNlLnN0YXRlKSB7XG5cblx0XHRcdFx0XHRcdHZhciByZXNwb25zZSA9IGVycm9yKCdjYW5jZWxsZWQnLCAnTG9naW4gaGFzIGJlZW4gY2FuY2VsbGVkJyk7XG5cblx0XHRcdFx0XHRcdGlmICghcG9wdXApIHtcblx0XHRcdFx0XHRcdFx0cmVzcG9uc2UgPSBlcnJvcignYmxvY2tlZCcsICdQb3B1cCB3YXMgYmxvY2tlZCcpO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRyZXNwb25zZS5uZXR3b3JrID0gcC5uZXR3b3JrO1xuXG5cdFx0XHRcdFx0XHRwcm9taXNlLnJlamVjdChyZXNwb25zZSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9LCAxMDApO1xuXHRcdH1cblxuXHRcdGVsc2Uge1xuXHRcdFx0d2luZG93LmxvY2F0aW9uID0gdXJsO1xuXHRcdH1cblxuXHRcdHJldHVybiBwcm9taXNlLnByb3h5O1xuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlRnVuY3Rpb24ocykge3JldHVybiBzO31cblxuXHRcdGZ1bmN0aW9uIGZpbHRlckVtcHR5KHMpIHtyZXR1cm4gISFzO31cblx0fSxcblxuXHQvLyBSZW1vdmUgYW55IGRhdGEgYXNzb2NpYXRlZCB3aXRoIGEgZ2l2ZW4gc2VydmljZVxuXHQvLyBAcGFyYW0gc3RyaW5nIG5hbWUgb2YgdGhlIHNlcnZpY2Vcblx0Ly8gQHBhcmFtIGZ1bmN0aW9uIGNhbGxiYWNrXG5cdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciB1dGlscyA9IF90aGlzLnV0aWxzO1xuXHRcdHZhciBlcnJvciA9IHV0aWxzLmVycm9yO1xuXG5cdFx0Ly8gQ3JlYXRlIGEgbmV3IHByb21pc2Vcblx0XHR2YXIgcHJvbWlzZSA9IHV0aWxzLlByb21pc2UoKTtcblxuXHRcdHZhciBwID0gdXRpbHMuYXJncyh7bmFtZToncycsIG9wdGlvbnM6ICdvJywgY2FsbGJhY2s6ICdmJ30sIGFyZ3VtZW50cyk7XG5cblx0XHRwLm9wdGlvbnMgPSBwLm9wdGlvbnMgfHwge307XG5cblx0XHQvLyBBZGQgY2FsbGJhY2sgdG8gZXZlbnRzXG5cdFx0cHJvbWlzZS5wcm94eS50aGVuKHAuY2FsbGJhY2ssIHAuY2FsbGJhY2spO1xuXG5cdFx0Ly8gVHJpZ2dlciBhbiBldmVudCBvbiB0aGUgZ2xvYmFsIGxpc3RlbmVyXG5cdFx0ZnVuY3Rpb24gZW1pdChzLCB2YWx1ZSkge1xuXHRcdFx0aGVsbG8uZW1pdChzLCB2YWx1ZSk7XG5cdFx0fVxuXG5cdFx0cHJvbWlzZS5wcm94eS50aGVuKGVtaXQuYmluZCh0aGlzLCAnYXV0aC5sb2dvdXQgYXV0aCcpLCBlbWl0LmJpbmQodGhpcywgJ2Vycm9yJykpO1xuXG5cdFx0Ly8gTmV0d29ya1xuXHRcdHAubmFtZSA9IHAubmFtZSB8fCB0aGlzLnNldHRpbmdzLmRlZmF1bHRfc2VydmljZTtcblx0XHRwLmF1dGhSZXNwb25zZSA9IHV0aWxzLnN0b3JlKHAubmFtZSk7XG5cblx0XHRpZiAocC5uYW1lICYmICEocC5uYW1lIGluIF90aGlzLnNlcnZpY2VzKSkge1xuXG5cdFx0XHRwcm9taXNlLnJlamVjdChlcnJvcignaW52YWxpZF9uZXR3b3JrJywgJ1RoZSBuZXR3b3JrIHdhcyB1bnJlY29nbml6ZWQnKSk7XG5cblx0XHR9XG5cdFx0ZWxzZSBpZiAocC5uYW1lICYmIHAuYXV0aFJlc3BvbnNlKSB7XG5cblx0XHRcdC8vIERlZmluZSB0aGUgY2FsbGJhY2tcblx0XHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKG9wdHMpIHtcblxuXHRcdFx0XHQvLyBSZW1vdmUgZnJvbSB0aGUgc3RvcmVcblx0XHRcdFx0dXRpbHMuc3RvcmUocC5uYW1lLCAnJyk7XG5cblx0XHRcdFx0Ly8gRW1pdCBldmVudHMgYnkgZGVmYXVsdFxuXHRcdFx0XHRwcm9taXNlLmZ1bGZpbGwoaGVsbG8udXRpbHMubWVyZ2Uoe25ldHdvcms6cC5uYW1lfSwgb3B0cyB8fCB7fSkpO1xuXHRcdFx0fTtcblxuXHRcdFx0Ly8gUnVuIGFuIGFzeW5jIG9wZXJhdGlvbiB0byByZW1vdmUgdGhlIHVzZXJzIHNlc3Npb25cblx0XHRcdHZhciBfb3B0cyA9IHt9O1xuXHRcdFx0aWYgKHAub3B0aW9ucy5mb3JjZSkge1xuXHRcdFx0XHR2YXIgbG9nb3V0ID0gX3RoaXMuc2VydmljZXNbcC5uYW1lXS5sb2dvdXQ7XG5cdFx0XHRcdGlmIChsb2dvdXQpIHtcblx0XHRcdFx0XHQvLyBDb252ZXJ0IGxvZ291dCB0byBVUkwgc3RyaW5nLFxuXHRcdFx0XHRcdC8vIElmIG5vIHN0cmluZyBpcyByZXR1cm5lZCwgdGhlbiB0aGlzIGZ1bmN0aW9uIHdpbGwgaGFuZGxlIHRoZSBsb2dvdXQgYXN5bmMgc3R5bGVcblx0XHRcdFx0XHRpZiAodHlwZW9mIChsb2dvdXQpID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0XHRsb2dvdXQgPSBsb2dvdXQoY2FsbGJhY2ssIHApO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElmIGxvZ291dCBpcyBhIHN0cmluZyB0aGVuIGFzc3VtZSBVUkwgYW5kIG9wZW4gaW4gaWZyYW1lLlxuXHRcdFx0XHRcdGlmICh0eXBlb2YgKGxvZ291dCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0XHR1dGlscy5pZnJhbWUobG9nb3V0KTtcblx0XHRcdFx0XHRcdF9vcHRzLmZvcmNlID0gbnVsbDtcblx0XHRcdFx0XHRcdF9vcHRzLm1lc3NhZ2UgPSAnTG9nb3V0IHN1Y2Nlc3Mgb24gcHJvdmlkZXJzIHNpdGUgd2FzIGluZGV0ZXJtaW5hdGUnO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChsb2dvdXQgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Ly8gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgaGFuZGxlIHRoZSByZXNwb25zZS5cblx0XHRcdFx0XHRcdHJldHVybiBwcm9taXNlLnByb3h5O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZW1vdmUgbG9jYWwgY3JlZGVudGlhbHNcblx0XHRcdGNhbGxiYWNrKF9vcHRzKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRwcm9taXNlLnJlamVjdChlcnJvcignaW52YWxpZF9zZXNzaW9uJywgJ1RoZXJlIHdhcyBubyBzZXNzaW9uIHRvIHJlbW92ZScpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gcHJvbWlzZS5wcm94eTtcblx0fSxcblxuXHQvLyBSZXR1cm5zIGFsbCB0aGUgc2Vzc2lvbnMgdGhhdCBhcmUgc3Vic2NyaWJlZCB0b29cblx0Ly8gQHBhcmFtIHN0cmluZyBvcHRpb25hbCwgbmFtZSBvZiB0aGUgc2VydmljZSB0byBnZXQgaW5mb3JtYXRpb24gYWJvdXQuXG5cdGdldEF1dGhSZXNwb25zZTogZnVuY3Rpb24oc2VydmljZSkge1xuXG5cdFx0Ly8gSWYgdGhlIHNlcnZpY2UgZG9lc24ndCBleGlzdFxuXHRcdHNlcnZpY2UgPSBzZXJ2aWNlIHx8IHRoaXMuc2V0dGluZ3MuZGVmYXVsdF9zZXJ2aWNlO1xuXG5cdFx0aWYgKCFzZXJ2aWNlIHx8ICEoc2VydmljZSBpbiB0aGlzLnNlcnZpY2VzKSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXMudXRpbHMuc3RvcmUoc2VydmljZSkgfHwgbnVsbDtcblx0fSxcblxuXHQvLyBFdmVudHM6IHBsYWNlaG9sZGVyIGZvciB0aGUgZXZlbnRzXG5cdGV2ZW50czoge31cbn0pO1xuXG4vLyBDb3JlIHV0aWxpdGllc1xuaGVsbG8udXRpbHMuZXh0ZW5kKGhlbGxvLnV0aWxzLCB7XG5cblx0Ly8gRXJyb3Jcblx0ZXJyb3I6IGZ1bmN0aW9uKGNvZGUsIG1lc3NhZ2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0ZXJyb3I6IHtcblx0XHRcdFx0Y29kZTogY29kZSxcblx0XHRcdFx0bWVzc2FnZTogbWVzc2FnZVxuXHRcdFx0fVxuXHRcdH07XG5cdH0sXG5cblx0Ly8gQXBwZW5kIHRoZSBxdWVyeXN0cmluZyB0byBhIHVybFxuXHQvLyBAcGFyYW0gc3RyaW5nIHVybFxuXHQvLyBAcGFyYW0gb2JqZWN0IHBhcmFtZXRlcnNcblx0cXM6IGZ1bmN0aW9uKHVybCwgcGFyYW1zLCBmb3JtYXRGdW5jdGlvbikge1xuXG5cdFx0aWYgKHBhcmFtcykge1xuXG5cdFx0XHQvLyBTZXQgZGVmYXVsdCBmb3JtYXR0aW5nIGZ1bmN0aW9uXG5cdFx0XHRmb3JtYXRGdW5jdGlvbiA9IGZvcm1hdEZ1bmN0aW9uIHx8IGVuY29kZVVSSUNvbXBvbmVudDtcblxuXHRcdFx0Ly8gT3ZlcnJpZGUgdGhlIGl0ZW1zIGluIHRoZSBVUkwgd2hpY2ggYWxyZWFkeSBleGlzdFxuXHRcdFx0Zm9yICh2YXIgeCBpbiBwYXJhbXMpIHtcblx0XHRcdFx0dmFyIHN0ciA9ICcoW1xcXFw/XFxcXCZdKScgKyB4ICsgJz1bXlxcXFwmXSonO1xuXHRcdFx0XHR2YXIgcmVnID0gbmV3IFJlZ0V4cChzdHIpO1xuXHRcdFx0XHRpZiAodXJsLm1hdGNoKHJlZykpIHtcblx0XHRcdFx0XHR1cmwgPSB1cmwucmVwbGFjZShyZWcsICckMScgKyB4ICsgJz0nICsgZm9ybWF0RnVuY3Rpb24ocGFyYW1zW3hdKSk7XG5cdFx0XHRcdFx0ZGVsZXRlIHBhcmFtc1t4XTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICghdGhpcy5pc0VtcHR5KHBhcmFtcykpIHtcblx0XHRcdHJldHVybiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+IC0xID8gJyYnIDogJz8nKSArIHRoaXMucGFyYW0ocGFyYW1zLCBmb3JtYXRGdW5jdGlvbik7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fSxcblxuXHQvLyBQYXJhbVxuXHQvLyBFeHBsb2RlL2VuY29kZSB0aGUgcGFyYW1ldGVycyBvZiBhbiBVUkwgc3RyaW5nL29iamVjdFxuXHQvLyBAcGFyYW0gc3RyaW5nIHMsIHN0cmluZyB0byBkZWNvZGVcblx0cGFyYW06IGZ1bmN0aW9uKHMsIGZvcm1hdEZ1bmN0aW9uKSB7XG5cdFx0dmFyIGI7XG5cdFx0dmFyIGEgPSB7fTtcblx0XHR2YXIgbTtcblxuXHRcdGlmICh0eXBlb2YgKHMpID09PSAnc3RyaW5nJykge1xuXG5cdFx0XHRmb3JtYXRGdW5jdGlvbiA9IGZvcm1hdEZ1bmN0aW9uIHx8IGRlY29kZVVSSUNvbXBvbmVudDtcblxuXHRcdFx0bSA9IHMucmVwbGFjZSgvXltcXCNcXD9dLywgJycpLm1hdGNoKC8oW149XFwvXFwmXSspPShbXlxcJl0rKS9nKTtcblx0XHRcdGlmIChtKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdGIgPSBtW2ldLm1hdGNoKC8oW149XSspPSguKikvKTtcblx0XHRcdFx0XHRhW2JbMV1dID0gZm9ybWF0RnVuY3Rpb24oYlsyXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIGE7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXG5cdFx0XHRmb3JtYXRGdW5jdGlvbiA9IGZvcm1hdEZ1bmN0aW9uIHx8IGVuY29kZVVSSUNvbXBvbmVudDtcblxuXHRcdFx0dmFyIG8gPSBzO1xuXG5cdFx0XHRhID0gW107XG5cblx0XHRcdGZvciAodmFyIHggaW4gbykge2lmIChvLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdGlmIChvLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdFx0YS5wdXNoKFt4LCBvW3hdID09PSAnPycgPyAnPycgOiBmb3JtYXRGdW5jdGlvbihvW3hdKV0uam9pbignPScpKTtcblx0XHRcdFx0fVxuXHRcdFx0fX1cblxuXHRcdFx0cmV0dXJuIGEuam9pbignJicpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBMb2NhbCBzdG9yYWdlIGZhY2FkZVxuXHRzdG9yZTogKGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIGEgPSBbJ2xvY2FsU3RvcmFnZScsICdzZXNzaW9uU3RvcmFnZSddO1xuXHRcdHZhciBpID0gLTE7XG5cdFx0dmFyIHByZWZpeCA9ICd0ZXN0JztcblxuXHRcdC8vIFNldCBMb2NhbFN0b3JhZ2Vcblx0XHR2YXIgbG9jYWxTdG9yYWdlO1xuXG5cdFx0d2hpbGUgKGFbKytpXSkge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Ly8gSW4gQ2hyb21lIHdpdGggY29va2llcyBibG9ja2VkLCBjYWxsaW5nIGxvY2FsU3RvcmFnZSB0aHJvd3MgYW4gZXJyb3Jcblx0XHRcdFx0bG9jYWxTdG9yYWdlID0gd2luZG93W2FbaV1dO1xuXHRcdFx0XHRsb2NhbFN0b3JhZ2Uuc2V0SXRlbShwcmVmaXggKyBpLCBpKTtcblx0XHRcdFx0bG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0ocHJlZml4ICsgaSk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0bG9jYWxTdG9yYWdlID0gbnVsbDtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIWxvY2FsU3RvcmFnZSkge1xuXG5cdFx0XHR2YXIgY2FjaGUgPSBudWxsO1xuXG5cdFx0XHRsb2NhbFN0b3JhZ2UgPSB7XG5cdFx0XHRcdGdldEl0ZW06IGZ1bmN0aW9uKHByb3ApIHtcblx0XHRcdFx0XHRwcm9wID0gcHJvcCArICc9Jztcblx0XHRcdFx0XHR2YXIgbSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0dmFyIF9tID0gbVtpXS5yZXBsYWNlKC8oXlxccyt8XFxzKyQpLywgJycpO1xuXHRcdFx0XHRcdFx0aWYgKF9tICYmIF9tLmluZGV4T2YocHJvcCkgPT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIF9tLnN1YnN0cihwcm9wLmxlbmd0aCk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIGNhY2hlO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdHNldEl0ZW06IGZ1bmN0aW9uKHByb3AsIHZhbHVlKSB7XG5cdFx0XHRcdFx0Y2FjaGUgPSB2YWx1ZTtcblx0XHRcdFx0XHRkb2N1bWVudC5jb29raWUgPSBwcm9wICsgJz0nICsgdmFsdWU7XG5cdFx0XHRcdH1cblx0XHRcdH07XG5cblx0XHRcdC8vIEZpbGwgdGhlIGNhY2hlIHVwXG5cdFx0XHRjYWNoZSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdoZWxsbycpO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGdldCgpIHtcblx0XHRcdHZhciBqc29uID0ge307XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRqc29uID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnaGVsbG8nKSkgfHwge307XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge31cblxuXHRcdFx0cmV0dXJuIGpzb247XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gc2V0KGpzb24pIHtcblx0XHRcdGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdoZWxsbycsIEpTT04uc3RyaW5naWZ5KGpzb24pKTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgYnJvd3NlciBzdXBwb3J0IGxvY2FsIHN0b3JhZ2Vcblx0XHRyZXR1cm4gZnVuY3Rpb24obmFtZSwgdmFsdWUsIGRheXMpIHtcblxuXHRcdFx0Ly8gTG9jYWwgc3RvcmFnZVxuXHRcdFx0dmFyIGpzb24gPSBnZXQoKTtcblxuXHRcdFx0aWYgKG5hbWUgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRyZXR1cm4ganNvbltuYW1lXSB8fCBudWxsO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAobmFtZSAmJiB2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGRlbGV0ZSBqc29uW25hbWVdO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0anNvbltuYW1lXSA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKG5hbWUpIHtcblx0XHRcdFx0anNvbltuYW1lXSA9IHZhbHVlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHJldHVybiBqc29uO1xuXHRcdFx0fVxuXG5cdFx0XHRzZXQoanNvbik7XG5cblx0XHRcdHJldHVybiBqc29uIHx8IG51bGw7XG5cdFx0fTtcblxuXHR9KSgpLFxuXG5cdC8vIENyZWF0ZSBhbmQgQXBwZW5kIG5ldyBET00gZWxlbWVudHNcblx0Ly8gQHBhcmFtIG5vZGUgc3RyaW5nXG5cdC8vIEBwYXJhbSBhdHRyIG9iamVjdCBsaXRlcmFsXG5cdC8vIEBwYXJhbSBkb20vc3RyaW5nXG5cdGFwcGVuZDogZnVuY3Rpb24obm9kZSwgYXR0ciwgdGFyZ2V0KSB7XG5cblx0XHR2YXIgbiA9IHR5cGVvZiAobm9kZSkgPT09ICdzdHJpbmcnID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChub2RlKSA6IG5vZGU7XG5cblx0XHRpZiAodHlwZW9mIChhdHRyKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdGlmICgndGFnTmFtZScgaW4gYXR0cikge1xuXHRcdFx0XHR0YXJnZXQgPSBhdHRyO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGZvciAodmFyIHggaW4gYXR0cikge2lmIChhdHRyLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAoYXR0clt4XSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRmb3IgKHZhciB5IGluIGF0dHJbeF0pIHtpZiAoYXR0clt4XS5oYXNPd25Qcm9wZXJ0eSh5KSkge1xuXHRcdFx0XHRcdFx0XHRuW3hdW3ldID0gYXR0clt4XVt5XTtcblx0XHRcdFx0XHRcdH19XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKHggPT09ICdodG1sJykge1xuXHRcdFx0XHRcdFx0bi5pbm5lckhUTUwgPSBhdHRyW3hdO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIElFIGRvZXNuJ3QgbGlrZSB1cyBzZXR0aW5nIG1ldGhvZHMgd2l0aCBzZXRBdHRyaWJ1dGVcblx0XHRcdFx0XHRlbHNlIGlmICghL15vbi8udGVzdCh4KSkge1xuXHRcdFx0XHRcdFx0bi5zZXRBdHRyaWJ1dGUoeCwgYXR0clt4XSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0blt4XSA9IGF0dHJbeF07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmICh0YXJnZXQgPT09ICdib2R5Jykge1xuXHRcdFx0KGZ1bmN0aW9uIHNlbGYoKSB7XG5cdFx0XHRcdGlmIChkb2N1bWVudC5ib2R5KSB7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChuKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KHNlbGYsIDE2KTtcblx0XHRcdFx0fVxuXHRcdFx0fSkoKTtcblx0XHR9XG5cdFx0ZWxzZSBpZiAodHlwZW9mICh0YXJnZXQpID09PSAnb2JqZWN0Jykge1xuXHRcdFx0dGFyZ2V0LmFwcGVuZENoaWxkKG4pO1xuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgKHRhcmdldCkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSh0YXJnZXQpWzBdLmFwcGVuZENoaWxkKG4pO1xuXHRcdH1cblxuXHRcdHJldHVybiBuO1xuXHR9LFxuXG5cdC8vIEFuIGVhc3kgd2F5IHRvIGNyZWF0ZSBhIGhpZGRlbiBpZnJhbWVcblx0Ly8gQHBhcmFtIHN0cmluZyBzcmNcblx0aWZyYW1lOiBmdW5jdGlvbihzcmMpIHtcblx0XHR0aGlzLmFwcGVuZCgnaWZyYW1lJywge3NyYzogc3JjLCBzdHlsZToge3Bvc2l0aW9uOidhYnNvbHV0ZScsIGxlZnQ6ICctMTAwMHB4JywgYm90dG9tOiAwLCBoZWlnaHQ6ICcxcHgnLCB3aWR0aDogJzFweCd9fSwgJ2JvZHknKTtcblx0fSxcblxuXHQvLyBSZWN1cnNpdmUgbWVyZ2UgdHdvIG9iamVjdHMgaW50byBvbmUsIHNlY29uZCBwYXJhbWV0ZXIgb3ZlcmlkZXMgdGhlIGZpcnN0XG5cdC8vIEBwYXJhbSBhIGFycmF5XG5cdG1lcmdlOiBmdW5jdGlvbigvKiBBcmdzOiBhLCBiLCBjLCAuLiBuICovKSB7XG5cdFx0dmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHRcdGFyZ3MudW5zaGlmdCh7fSk7XG5cdFx0cmV0dXJuIHRoaXMuZXh0ZW5kLmFwcGx5KG51bGwsIGFyZ3MpO1xuXHR9LFxuXG5cdC8vIE1ha2VzIGl0IGVhc2llciB0byBhc3NpZ24gcGFyYW1ldGVycywgd2hlcmUgc29tZSBhcmUgb3B0aW9uYWxcblx0Ly8gQHBhcmFtIG8gb2JqZWN0XG5cdC8vIEBwYXJhbSBhIGFyZ3VtZW50c1xuXHRhcmdzOiBmdW5jdGlvbihvLCBhcmdzKSB7XG5cblx0XHR2YXIgcCA9IHt9O1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgdCA9IG51bGw7XG5cdFx0dmFyIHggPSBudWxsO1xuXG5cdFx0Ly8gJ3gnIGlzIHRoZSBmaXJzdCBrZXkgaW4gdGhlIGxpc3Qgb2Ygb2JqZWN0IHBhcmFtZXRlcnNcblx0XHRmb3IgKHggaW4gbykge2lmIChvLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRicmVhaztcblx0XHR9fVxuXG5cdFx0Ly8gUGFzc2luZyBpbiBoYXNoIG9iamVjdCBvZiBhcmd1bWVudHM/XG5cdFx0Ly8gV2hlcmUgdGhlIGZpcnN0IGFyZ3VtZW50IGNhbid0IGJlIGFuIG9iamVjdFxuXHRcdGlmICgoYXJncy5sZW5ndGggPT09IDEpICYmICh0eXBlb2YgKGFyZ3NbMF0pID09PSAnb2JqZWN0JykgJiYgb1t4XSAhPSAnbyEnKSB7XG5cblx0XHRcdC8vIENvdWxkIHRoaXMgb2JqZWN0IHN0aWxsIGJlbG9uZyB0byBhIHByb3BlcnR5P1xuXHRcdFx0Ly8gQ2hlY2sgdGhlIG9iamVjdCBrZXlzIGlmIHRoZXkgbWF0Y2ggYW55IG9mIHRoZSBwcm9wZXJ0eSBrZXlzXG5cdFx0XHRmb3IgKHggaW4gYXJnc1swXSkge2lmIChvLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdC8vIERvZXMgdGhpcyBrZXkgZXhpc3QgaW4gdGhlIHByb3BlcnR5IGxpc3Q/XG5cdFx0XHRcdGlmICh4IGluIG8pIHtcblx0XHRcdFx0XHQvLyBZZXMgdGhpcyBrZXkgZG9lcyBleGlzdCBzbyBpdHMgbW9zdCBsaWtlbHkgdGhpcyBmdW5jdGlvbiBoYXMgYmVlbiBpbnZva2VkIHdpdGggYW4gb2JqZWN0IHBhcmFtZXRlclxuXHRcdFx0XHRcdC8vIFJldHVybiBmaXJzdCBhcmd1bWVudCBhcyB0aGUgaGFzaCBvZiBhbGwgYXJndW1lbnRzXG5cdFx0XHRcdFx0cmV0dXJuIGFyZ3NbMF07XG5cdFx0XHRcdH1cblx0XHRcdH19XG5cdFx0fVxuXG5cdFx0Ly8gRWxzZSBsb29wIHRocm91Z2ggYW5kIGFjY291bnQgZm9yIHRoZSBtaXNzaW5nIG9uZXMuXG5cdFx0Zm9yICh4IGluIG8pIHtpZiAoby5oYXNPd25Qcm9wZXJ0eSh4KSkge1xuXG5cdFx0XHR0ID0gdHlwZW9mIChhcmdzW2ldKTtcblxuXHRcdFx0aWYgKCh0eXBlb2YgKG9beF0pID09PSAnZnVuY3Rpb24nICYmIG9beF0udGVzdChhcmdzW2ldKSkgfHwgKHR5cGVvZiAob1t4XSkgPT09ICdzdHJpbmcnICYmIChcblx0XHRcdChvW3hdLmluZGV4T2YoJ3MnKSA+IC0xICYmIHQgPT09ICdzdHJpbmcnKSB8fFxuXHRcdFx0KG9beF0uaW5kZXhPZignbycpID4gLTEgJiYgdCA9PT0gJ29iamVjdCcpIHx8XG5cdFx0XHQob1t4XS5pbmRleE9mKCdpJykgPiAtMSAmJiB0ID09PSAnbnVtYmVyJykgfHxcblx0XHRcdChvW3hdLmluZGV4T2YoJ2EnKSA+IC0xICYmIHQgPT09ICdvYmplY3QnKSB8fFxuXHRcdFx0KG9beF0uaW5kZXhPZignZicpID4gLTEgJiYgdCA9PT0gJ2Z1bmN0aW9uJylcblx0XHRcdCkpXG5cdFx0XHQpIHtcblx0XHRcdFx0cFt4XSA9IGFyZ3NbaSsrXTtcblx0XHRcdH1cblxuXHRcdFx0ZWxzZSBpZiAodHlwZW9mIChvW3hdKSA9PT0gJ3N0cmluZycgJiYgb1t4XS5pbmRleE9mKCchJykgPiAtMSkge1xuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fX1cblxuXHRcdHJldHVybiBwO1xuXHR9LFxuXG5cdC8vIFJldHVybnMgYSBVUkwgaW5zdGFuY2Vcblx0dXJsOiBmdW5jdGlvbihwYXRoKSB7XG5cblx0XHQvLyBJZiB0aGUgcGF0aCBpcyBlbXB0eVxuXHRcdGlmICghcGF0aCkge1xuXHRcdFx0cmV0dXJuIHdpbmRvdy5sb2NhdGlvbjtcblx0XHR9XG5cblx0XHQvLyBDaHJvbWUgYW5kIEZpcmVGb3ggc3VwcG9ydCBuZXcgVVJMKCkgdG8gZXh0cmFjdCBVUkwgb2JqZWN0c1xuXHRcdGVsc2UgaWYgKHdpbmRvdy5VUkwgJiYgVVJMIGluc3RhbmNlb2YgRnVuY3Rpb24gJiYgVVJMLmxlbmd0aCAhPT0gMCkge1xuXHRcdFx0cmV0dXJuIG5ldyBVUkwocGF0aCwgd2luZG93LmxvY2F0aW9uKTtcblx0XHR9XG5cblx0XHQvLyBVZ2x5IHNoaW0sIGl0IHdvcmtzIVxuXHRcdGVsc2Uge1xuXHRcdFx0dmFyIGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG5cdFx0XHRhLmhyZWYgPSBwYXRoO1xuXHRcdFx0cmV0dXJuIGEuY2xvbmVOb2RlKGZhbHNlKTtcblx0XHR9XG5cdH0sXG5cblx0ZGlmZjogZnVuY3Rpb24oYSwgYikge1xuXHRcdHJldHVybiBiLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRyZXR1cm4gYS5pbmRleE9mKGl0ZW0pID09PSAtMTtcblx0XHR9KTtcblx0fSxcblxuXHQvLyBHZXQgdGhlIGRpZmZlcmVudCBoYXNoIG9mIHByb3BlcnRpZXMgdW5pcXVlIHRvIGBhYCwgYW5kIG5vdCBpbiBgYmBcblx0ZGlmZktleTogZnVuY3Rpb24oYSwgYikge1xuXHRcdGlmIChhIHx8ICFiKSB7XG5cdFx0XHR2YXIgciA9IHt9O1xuXHRcdFx0Zm9yICh2YXIgeCBpbiBhKSB7XG5cdFx0XHRcdC8vIERvZXMgdGhlIHByb3BlcnR5IG5vdCBleGlzdD9cblx0XHRcdFx0aWYgKCEoeCBpbiBiKSkge1xuXHRcdFx0XHRcdHJbeF0gPSBhW3hdO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByO1xuXHRcdH1cblxuXHRcdHJldHVybiBhO1xuXHR9LFxuXG5cdC8vIFVuaXF1ZVxuXHQvLyBSZW1vdmUgZHVwbGljYXRlIGFuZCBudWxsIHZhbHVlcyBmcm9tIGFuIGFycmF5XG5cdC8vIEBwYXJhbSBhIGFycmF5XG5cdHVuaXF1ZTogZnVuY3Rpb24oYSkge1xuXHRcdGlmICghQXJyYXkuaXNBcnJheShhKSkgeyByZXR1cm4gW107IH1cblxuXHRcdHJldHVybiBhLmZpbHRlcihmdW5jdGlvbihpdGVtLCBpbmRleCkge1xuXHRcdFx0Ly8gSXMgdGhpcyB0aGUgZmlyc3QgbG9jYXRpb24gb2YgaXRlbVxuXHRcdFx0cmV0dXJuIGEuaW5kZXhPZihpdGVtKSA9PT0gaW5kZXg7XG5cdFx0fSk7XG5cdH0sXG5cblx0aXNFbXB0eTogZnVuY3Rpb24ob2JqKSB7XG5cblx0XHQvLyBTY2FsYXJcblx0XHRpZiAoIW9iailcblx0XHRcdHJldHVybiB0cnVlO1xuXG5cdFx0Ly8gQXJyYXlcblx0XHRpZiAoQXJyYXkuaXNBcnJheShvYmopKSB7XG5cdFx0XHRyZXR1cm4gIW9iai5sZW5ndGg7XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHR5cGVvZiAob2JqKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdC8vIE9iamVjdFxuXHRcdFx0Zm9yICh2YXIga2V5IGluIG9iaikge1xuXHRcdFx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fSxcblxuXHQvL2pzY3M6ZGlzYWJsZVxuXG5cdC8qIVxuXHQgKiogIFRoZW5hYmxlIC0tIEVtYmVkZGFibGUgTWluaW11bSBTdHJpY3RseS1Db21wbGlhbnQgUHJvbWlzZXMvQSsgMS4xLjEgVGhlbmFibGVcblx0ICoqICBDb3B5cmlnaHQgKGMpIDIwMTMtMjAxNCBSYWxmIFMuIEVuZ2Vsc2NoYWxsIDxodHRwOi8vZW5nZWxzY2hhbGwuY29tPlxuXHQgKiogIExpY2Vuc2VkIHVuZGVyIFRoZSBNSVQgTGljZW5zZSA8aHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVD5cblx0ICoqICBTb3VyY2UtQ29kZSBkaXN0cmlidXRlZCBvbiA8aHR0cDovL2dpdGh1Yi5jb20vcnNlL3RoZW5hYmxlPlxuXHQgKi9cblx0UHJvbWlzZTogKGZ1bmN0aW9uKCl7XG5cdFx0LyogIHByb21pc2Ugc3RhdGVzIFtQcm9taXNlcy9BKyAyLjFdICAqL1xuXHRcdHZhciBTVEFURV9QRU5ESU5HICAgPSAwOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLyogIFtQcm9taXNlcy9BKyAyLjEuMV0gICovXG5cdFx0dmFyIFNUQVRFX0ZVTEZJTExFRCA9IDE7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMS4yXSAgKi9cblx0XHR2YXIgU1RBVEVfUkVKRUNURUQgID0gMjsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4xLjNdICAqL1xuXG5cdFx0LyogIHByb21pc2Ugb2JqZWN0IGNvbnN0cnVjdG9yICAqL1xuXHRcdHZhciBhcGkgPSBmdW5jdGlvbiAoZXhlY3V0b3IpIHtcblx0XHRcdC8qICBvcHRpb25hbGx5IHN1cHBvcnQgbm9uLWNvbnN0cnVjdG9yL3BsYWluLWZ1bmN0aW9uIGNhbGwgICovXG5cdFx0XHRpZiAoISh0aGlzIGluc3RhbmNlb2YgYXBpKSlcblx0XHRcdFx0cmV0dXJuIG5ldyBhcGkoZXhlY3V0b3IpO1xuXG5cdFx0XHQvKiAgaW5pdGlhbGl6ZSBvYmplY3QgICovXG5cdFx0XHR0aGlzLmlkICAgICAgICAgICA9IFwiVGhlbmFibGUvMS4wLjZcIjtcblx0XHRcdHRoaXMuc3RhdGUgICAgICAgID0gU1RBVEVfUEVORElORzsgLyogIGluaXRpYWwgc3RhdGUgICovXG5cdFx0XHR0aGlzLmZ1bGZpbGxWYWx1ZSA9IHVuZGVmaW5lZDsgICAgIC8qICBpbml0aWFsIHZhbHVlICAqLyAgICAgLyogIFtQcm9taXNlcy9BKyAxLjMsIDIuMS4yLjJdICAqL1xuXHRcdFx0dGhpcy5yZWplY3RSZWFzb24gPSB1bmRlZmluZWQ7ICAgICAvKiAgaW5pdGlhbCByZWFzb24gKi8gICAgIC8qICBbUHJvbWlzZXMvQSsgMS41LCAyLjEuMy4yXSAgKi9cblx0XHRcdHRoaXMub25GdWxmaWxsZWQgID0gW107ICAgICAgICAgICAgLyogIGluaXRpYWwgaGFuZGxlcnMgICovXG5cdFx0XHR0aGlzLm9uUmVqZWN0ZWQgICA9IFtdOyAgICAgICAgICAgIC8qICBpbml0aWFsIGhhbmRsZXJzICAqL1xuXG5cdFx0XHQvKiAgcHJvdmlkZSBvcHRpb25hbCBpbmZvcm1hdGlvbi1oaWRpbmcgcHJveHkgICovXG5cdFx0XHR0aGlzLnByb3h5ID0ge1xuXHRcdFx0XHR0aGVuOiB0aGlzLnRoZW4uYmluZCh0aGlzKVxuXHRcdFx0fTtcblxuXHRcdFx0LyogIHN1cHBvcnQgb3B0aW9uYWwgZXhlY3V0b3IgZnVuY3Rpb24gICovXG5cdFx0XHRpZiAodHlwZW9mIGV4ZWN1dG9yID09PSBcImZ1bmN0aW9uXCIpXG5cdFx0XHRcdGV4ZWN1dG9yLmNhbGwodGhpcywgdGhpcy5mdWxmaWxsLmJpbmQodGhpcyksIHRoaXMucmVqZWN0LmJpbmQodGhpcykpO1xuXHRcdH07XG5cblx0XHQvKiAgcHJvbWlzZSBBUEkgbWV0aG9kcyAgKi9cblx0XHRhcGkucHJvdG90eXBlID0ge1xuXHRcdFx0LyogIHByb21pc2UgcmVzb2x2aW5nIG1ldGhvZHMgICovXG5cdFx0XHRmdWxmaWxsOiBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGRlbGl2ZXIodGhpcywgU1RBVEVfRlVMRklMTEVELCBcImZ1bGZpbGxWYWx1ZVwiLCB2YWx1ZSk7IH0sXG5cdFx0XHRyZWplY3Q6ICBmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGRlbGl2ZXIodGhpcywgU1RBVEVfUkVKRUNURUQsICBcInJlamVjdFJlYXNvblwiLCB2YWx1ZSk7IH0sXG5cblx0XHRcdC8qICBcIlRoZSB0aGVuIE1ldGhvZFwiIFtQcm9taXNlcy9BKyAxLjEsIDEuMiwgMi4yXSAgKi9cblx0XHRcdHRoZW46IGZ1bmN0aW9uIChvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuXHRcdFx0XHR2YXIgY3VyciA9IHRoaXM7XG5cdFx0XHRcdHZhciBuZXh0ID0gbmV3IGFwaSgpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjddICAqL1xuXHRcdFx0XHRjdXJyLm9uRnVsZmlsbGVkLnB1c2goXG5cdFx0XHRcdFx0cmVzb2x2ZXIob25GdWxmaWxsZWQsIG5leHQsIFwiZnVsZmlsbFwiKSk7ICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjIvMi4yLjZdICAqL1xuXHRcdFx0XHRjdXJyLm9uUmVqZWN0ZWQucHVzaChcblx0XHRcdFx0XHRyZXNvbHZlcihvblJlamVjdGVkLCAgbmV4dCwgXCJyZWplY3RcIiApKTsgICAgICAgICAgICAgLyogIFtQcm9taXNlcy9BKyAyLjIuMy8yLjIuNl0gICovXG5cdFx0XHRcdGV4ZWN1dGUoY3Vycik7XG5cdFx0XHRcdHJldHVybiBuZXh0LnByb3h5OyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjcsIDMuM10gICovXG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8qICBkZWxpdmVyIGFuIGFjdGlvbiAgKi9cblx0XHR2YXIgZGVsaXZlciA9IGZ1bmN0aW9uIChjdXJyLCBzdGF0ZSwgbmFtZSwgdmFsdWUpIHtcblx0XHRcdGlmIChjdXJyLnN0YXRlID09PSBTVEFURV9QRU5ESU5HKSB7XG5cdFx0XHRcdGN1cnIuc3RhdGUgPSBzdGF0ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4xLjIuMSwgMi4xLjMuMV0gICovXG5cdFx0XHRcdGN1cnJbbmFtZV0gPSB2YWx1ZTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4xLjIuMiwgMi4xLjMuMl0gICovXG5cdFx0XHRcdGV4ZWN1dGUoY3Vycik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gY3Vycjtcblx0XHR9O1xuXG5cdFx0LyogIGV4ZWN1dGUgYWxsIGhhbmRsZXJzICAqL1xuXHRcdHZhciBleGVjdXRlID0gZnVuY3Rpb24gKGN1cnIpIHtcblx0XHRcdGlmIChjdXJyLnN0YXRlID09PSBTVEFURV9GVUxGSUxMRUQpXG5cdFx0XHRcdGV4ZWN1dGVfaGFuZGxlcnMoY3VyciwgXCJvbkZ1bGZpbGxlZFwiLCBjdXJyLmZ1bGZpbGxWYWx1ZSk7XG5cdFx0XHRlbHNlIGlmIChjdXJyLnN0YXRlID09PSBTVEFURV9SRUpFQ1RFRClcblx0XHRcdFx0ZXhlY3V0ZV9oYW5kbGVycyhjdXJyLCBcIm9uUmVqZWN0ZWRcIiwgIGN1cnIucmVqZWN0UmVhc29uKTtcblx0XHR9O1xuXG5cdFx0LyogIGV4ZWN1dGUgcGFydGljdWxhciBzZXQgb2YgaGFuZGxlcnMgICovXG5cdFx0dmFyIGV4ZWN1dGVfaGFuZGxlcnMgPSBmdW5jdGlvbiAoY3VyciwgbmFtZSwgdmFsdWUpIHtcblx0XHRcdC8qIGdsb2JhbCBwcm9jZXNzOiB0cnVlICovXG5cdFx0XHQvKiBnbG9iYWwgc2V0SW1tZWRpYXRlOiB0cnVlICovXG5cdFx0XHQvKiBnbG9iYWwgc2V0VGltZW91dDogdHJ1ZSAqL1xuXG5cdFx0XHQvKiAgc2hvcnQtY2lyY3VpdCBwcm9jZXNzaW5nICAqL1xuXHRcdFx0aWYgKGN1cnJbbmFtZV0ubGVuZ3RoID09PSAwKVxuXHRcdFx0XHRyZXR1cm47XG5cblx0XHRcdC8qICBpdGVyYXRlIG92ZXIgYWxsIGhhbmRsZXJzLCBleGFjdGx5IG9uY2UgICovXG5cdFx0XHR2YXIgaGFuZGxlcnMgPSBjdXJyW25hbWVdO1xuXHRcdFx0Y3VycltuYW1lXSA9IFtdOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjIuMywgMi4yLjMuM10gICovXG5cdFx0XHR2YXIgZnVuYyA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBoYW5kbGVycy5sZW5ndGg7IGkrKylcblx0XHRcdFx0XHRoYW5kbGVyc1tpXSh2YWx1ZSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjVdICAqL1xuXHRcdFx0fTtcblxuXHRcdFx0LyogIGV4ZWN1dGUgcHJvY2VkdXJlIGFzeW5jaHJvbm91c2x5ICAqLyAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjQsIDMuMV0gICovXG5cdFx0XHRpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIHByb2Nlc3MubmV4dFRpY2sgPT09IFwiZnVuY3Rpb25cIilcblx0XHRcdFx0cHJvY2Vzcy5uZXh0VGljayhmdW5jKTtcblx0XHRcdGVsc2UgaWYgKHR5cGVvZiBzZXRJbW1lZGlhdGUgPT09IFwiZnVuY3Rpb25cIilcblx0XHRcdFx0c2V0SW1tZWRpYXRlKGZ1bmMpO1xuXHRcdFx0ZWxzZVxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmMsIDApO1xuXHRcdH07XG5cblx0XHQvKiAgZ2VuZXJhdGUgYSByZXNvbHZlciBmdW5jdGlvbiAgKi9cblx0XHR2YXIgcmVzb2x2ZXIgPSBmdW5jdGlvbiAoY2IsIG5leHQsIG1ldGhvZCkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuXHRcdFx0XHRpZiAodHlwZW9mIGNiICE9PSBcImZ1bmN0aW9uXCIpICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjEsIDIuMi43LjMsIDIuMi43LjRdICAqL1xuXHRcdFx0XHRcdG5leHRbbWV0aG9kXS5jYWxsKG5leHQsIHZhbHVlKTsgICAgICAgICAgICAgICAgICAgICAgLyogIFtQcm9taXNlcy9BKyAyLjIuNy4zLCAyLjIuNy40XSAgKi9cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdFx0XHR0cnkgeyByZXN1bHQgPSBjYih2YWx1ZSk7IH0gICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjIuMSwgMi4yLjMuMSwgMi4yLjUsIDMuMl0gICovXG5cdFx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRcdG5leHQucmVqZWN0KGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMi43LjJdICAqL1xuXHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXNvbHZlKG5leHQsIHJlc3VsdCk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4yLjcuMV0gICovXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fTtcblxuXHRcdC8qICBcIlByb21pc2UgUmVzb2x1dGlvbiBQcm9jZWR1cmVcIiAgKi8gICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuM10gICovXG5cdFx0dmFyIHJlc29sdmUgPSBmdW5jdGlvbiAocHJvbWlzZSwgeCkge1xuXHRcdFx0LyogIHNhbml0eSBjaGVjayBhcmd1bWVudHMgICovICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4zLjFdICAqL1xuXHRcdFx0aWYgKHByb21pc2UgPT09IHggfHwgcHJvbWlzZS5wcm94eSA9PT0geCkge1xuXHRcdFx0XHRwcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiY2Fubm90IHJlc29sdmUgcHJvbWlzZSB3aXRoIGl0c2VsZlwiKSk7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0LyogIHN1cmdpY2FsbHkgY2hlY2sgZm9yIGEgXCJ0aGVuXCIgbWV0aG9kXG5cdFx0XHRcdChtYWlubHkgdG8ganVzdCBjYWxsIHRoZSBcImdldHRlclwiIG9mIFwidGhlblwiIG9ubHkgb25jZSkgICovXG5cdFx0XHR2YXIgdGhlbjtcblx0XHRcdGlmICgodHlwZW9mIHggPT09IFwib2JqZWN0XCIgJiYgeCAhPT0gbnVsbCkgfHwgdHlwZW9mIHggPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHR0cnkgeyB0aGVuID0geC50aGVuOyB9ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjEsIDMuNV0gICovXG5cdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0cHJvbWlzZS5yZWplY3QoZSk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjJdICAqL1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvKiAgaGFuZGxlIG93biBUaGVuYWJsZXMgICAgW1Byb21pc2VzL0ErIDIuMy4yXVxuXHRcdFx0XHRhbmQgc2ltaWxhciBcInRoZW5hYmxlc1wiIFtQcm9taXNlcy9BKyAyLjMuM10gICovXG5cdFx0XHRpZiAodHlwZW9mIHRoZW4gPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdFx0XHR2YXIgcmVzb2x2ZWQgPSBmYWxzZTtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvKiAgY2FsbCByZXRyaWV2ZWQgXCJ0aGVuXCIgbWV0aG9kICovICAgICAgICAgICAgICAgICAgLyogIFtQcm9taXNlcy9BKyAyLjMuMy4zXSAgKi9cblx0XHRcdFx0XHR0aGVuLmNhbGwoeCxcblx0XHRcdFx0XHRcdC8qICByZXNvbHZlUHJvbWlzZSAgKi8gICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjMuMV0gICovXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAoeSkge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzb2x2ZWQpIHJldHVybjsgcmVzb2x2ZWQgPSB0cnVlOyAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjMuM10gICovXG5cdFx0XHRcdFx0XHRcdGlmICh5ID09PSB4KSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMy42XSAgKi9cblx0XHRcdFx0XHRcdFx0XHRwcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKFwiY2lyY3VsYXIgdGhlbmFibGUgY2hhaW5cIikpO1xuXHRcdFx0XHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZShwcm9taXNlLCB5KTtcblx0XHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRcdC8qICByZWplY3RQcm9taXNlICAqLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjMuMl0gICovXG5cdFx0XHRcdFx0XHRmdW5jdGlvbiAocikge1xuXHRcdFx0XHRcdFx0XHRpZiAocmVzb2x2ZWQpIHJldHVybjsgcmVzb2x2ZWQgPSB0cnVlOyAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjMuM10gICovXG5cdFx0XHRcdFx0XHRcdHByb21pc2UucmVqZWN0KHIpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdFx0XHRpZiAoIXJlc29sdmVkKSAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8qICBbUHJvbWlzZXMvQSsgMi4zLjMuMy4zXSAgKi9cblx0XHRcdFx0XHRcdHByb21pc2UucmVqZWN0KGUpOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy4zLjMuNF0gICovXG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvKiAgaGFuZGxlIG90aGVyIHZhbHVlcyAgKi9cblx0XHRcdHByb21pc2UuZnVsZmlsbCh4KTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvKiAgW1Byb21pc2VzL0ErIDIuMy40LCAyLjMuMy40XSAgKi9cblx0XHR9O1xuXG5cdFx0LyogIGV4cG9ydCBBUEkgICovXG5cdFx0cmV0dXJuIGFwaTtcblx0fSkoKSxcblxuXHQvL2pzY3M6ZW5hYmxlXG5cblx0Ly8gRXZlbnRcblx0Ly8gQSBjb250cnVjdG9yIHN1cGVyY2xhc3MgZm9yIGFkZGluZyBldmVudCBtZW50aG9kcywgb24sIG9mZiwgZW1pdC5cblx0RXZlbnQ6IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHNlcGFyYXRvciA9IC9bXFxzXFwsXSsvO1xuXG5cdFx0Ly8gSWYgdGhpcyBkb2Vzbid0IHN1cHBvcnQgZ2V0UHJvdG90eXBlIHRoZW4gd2UgY2FuJ3QgZ2V0IHByb3RvdHlwZS5ldmVudHMgb2YgdGhlIHBhcmVudFxuXHRcdC8vIFNvIGxldHMgZ2V0IHRoZSBjdXJyZW50IGluc3RhbmNlIGV2ZW50cywgYW5kIGFkZCB0aG9zZSB0byBhIHBhcmVudCBwcm9wZXJ0eVxuXHRcdHRoaXMucGFyZW50ID0ge1xuXHRcdFx0ZXZlbnRzOiB0aGlzLmV2ZW50cyxcblx0XHRcdGZpbmRFdmVudHM6IHRoaXMuZmluZEV2ZW50cyxcblx0XHRcdHBhcmVudDogdGhpcy5wYXJlbnQsXG5cdFx0XHR1dGlsczogdGhpcy51dGlsc1xuXHRcdH07XG5cblx0XHR0aGlzLmV2ZW50cyA9IHt9O1xuXG5cdFx0Ly8gT24sIHN1YnNjcmliZSB0byBldmVudHNcblx0XHQvLyBAcGFyYW0gZXZ0ICAgc3RyaW5nXG5cdFx0Ly8gQHBhcmFtIGNhbGxiYWNrICBmdW5jdGlvblxuXHRcdHRoaXMub24gPSBmdW5jdGlvbihldnQsIGNhbGxiYWNrKSB7XG5cblx0XHRcdGlmIChjYWxsYmFjayAmJiB0eXBlb2YgKGNhbGxiYWNrKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHR2YXIgYSA9IGV2dC5zcGxpdChzZXBhcmF0b3IpO1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGEubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRcdC8vIEhhcyB0aGlzIGV2ZW50IGFscmVhZHkgYmVlbiBmaXJlZCBvbiB0aGlzIGluc3RhbmNlP1xuXHRcdFx0XHRcdHRoaXMuZXZlbnRzW2FbaV1dID0gW2NhbGxiYWNrXS5jb25jYXQodGhpcy5ldmVudHNbYVtpXV0gfHwgW10pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHQvLyBPZmYsIHVuc3Vic2NyaWJlIHRvIGV2ZW50c1xuXHRcdC8vIEBwYXJhbSBldnQgICBzdHJpbmdcblx0XHQvLyBAcGFyYW0gY2FsbGJhY2sgIGZ1bmN0aW9uXG5cdFx0dGhpcy5vZmYgPSBmdW5jdGlvbihldnQsIGNhbGxiYWNrKSB7XG5cblx0XHRcdHRoaXMuZmluZEV2ZW50cyhldnQsIGZ1bmN0aW9uKG5hbWUsIGluZGV4KSB7XG5cdFx0XHRcdGlmICghY2FsbGJhY2sgfHwgdGhpcy5ldmVudHNbbmFtZV1baW5kZXhdID09PSBjYWxsYmFjaykge1xuXHRcdFx0XHRcdHRoaXMuZXZlbnRzW25hbWVdW2luZGV4XSA9IG51bGw7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm4gdGhpcztcblx0XHR9O1xuXG5cdFx0Ly8gRW1pdFxuXHRcdC8vIFRyaWdnZXJzIGFueSBzdWJzY3JpYmVkIGV2ZW50c1xuXHRcdHRoaXMuZW1pdCA9IGZ1bmN0aW9uKGV2dCAvKiwgZGF0YSwgLi4uICovKSB7XG5cblx0XHRcdC8vIEdldCBhcmd1bWVudHMgYXMgYW4gQXJyYXksIGtub2NrIG9mZiB0aGUgZmlyc3Qgb25lXG5cdFx0XHR2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG5cdFx0XHRhcmdzLnB1c2goZXZ0KTtcblxuXHRcdFx0Ly8gSGFuZGxlclxuXHRcdFx0dmFyIGhhbmRsZXIgPSBmdW5jdGlvbihuYW1lLCBpbmRleCkge1xuXG5cdFx0XHRcdC8vIFJlcGxhY2UgdGhlIGxhc3QgcHJvcGVydHkgd2l0aCB0aGUgZXZlbnQgbmFtZVxuXHRcdFx0XHRhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gPSAobmFtZSA9PT0gJyonID8gZXZ0IDogbmFtZSk7XG5cblx0XHRcdFx0Ly8gVHJpZ2dlclxuXHRcdFx0XHR0aGlzLmV2ZW50c1tuYW1lXVtpbmRleF0uYXBwbHkodGhpcywgYXJncyk7XG5cdFx0XHR9O1xuXG5cdFx0XHQvLyBGaW5kIHRoZSBjYWxsYmFja3Mgd2hpY2ggbWF0Y2ggdGhlIGNvbmRpdGlvbiBhbmQgY2FsbFxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHdoaWxlIChfdGhpcyAmJiBfdGhpcy5maW5kRXZlbnRzKSB7XG5cblx0XHRcdFx0Ly8gRmluZCBldmVudHMgd2hpY2ggbWF0Y2hcblx0XHRcdFx0X3RoaXMuZmluZEV2ZW50cyhldnQgKyAnLConLCBoYW5kbGVyKTtcblx0XHRcdFx0X3RoaXMgPSBfdGhpcy5wYXJlbnQ7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHQvL1xuXHRcdC8vIEVhc3kgZnVuY3Rpb25zXG5cdFx0dGhpcy5lbWl0QWZ0ZXIgPSBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XHR2YXIgYXJncyA9IGFyZ3VtZW50cztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdF90aGlzLmVtaXQuYXBwbHkoX3RoaXMsIGFyZ3MpO1xuXHRcdFx0fSwgMCk7XG5cblx0XHRcdHJldHVybiB0aGlzO1xuXHRcdH07XG5cblx0XHR0aGlzLmZpbmRFdmVudHMgPSBmdW5jdGlvbihldnQsIGNhbGxiYWNrKSB7XG5cblx0XHRcdHZhciBhID0gZXZ0LnNwbGl0KHNlcGFyYXRvcik7XG5cblx0XHRcdGZvciAodmFyIG5hbWUgaW4gdGhpcy5ldmVudHMpIHtpZiAodGhpcy5ldmVudHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcblxuXHRcdFx0XHRpZiAoYS5pbmRleE9mKG5hbWUpID4gLTEpIHtcblxuXHRcdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5ldmVudHNbbmFtZV0ubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHRcdFx0Ly8gRG9lcyB0aGUgZXZlbnQgaGFuZGxlciBleGlzdD9cblx0XHRcdFx0XHRcdGlmICh0aGlzLmV2ZW50c1tuYW1lXVtpXSkge1xuXHRcdFx0XHRcdFx0XHQvLyBFbWl0IG9uIHRoZSBsb2NhbCBpbnN0YW5jZSBvZiB0aGlzXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrLmNhbGwodGhpcywgbmFtZSwgaSk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9fVxuXHRcdH07XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fSxcblxuXHQvLyBHbG9iYWwgRXZlbnRzXG5cdC8vIEF0dGFjaCB0aGUgY2FsbGJhY2sgdG8gdGhlIHdpbmRvdyBvYmplY3Rcblx0Ly8gUmV0dXJuIGl0cyB1bmlxdWUgcmVmZXJlbmNlXG5cdGdsb2JhbEV2ZW50OiBmdW5jdGlvbihjYWxsYmFjaywgZ3VpZCkge1xuXHRcdC8vIElmIHRoZSBndWlkIGhhcyBub3QgYmVlbiBzdXBwbGllZCB0aGVuIGNyZWF0ZSBhIG5ldyBvbmUuXG5cdFx0Z3VpZCA9IGd1aWQgfHwgJ19oZWxsb2pzXycgKyBwYXJzZUludChNYXRoLnJhbmRvbSgpICogMWUxMiwgMTApLnRvU3RyaW5nKDM2KTtcblxuXHRcdC8vIERlZmluZSB0aGUgY2FsbGJhY2sgZnVuY3Rpb25cblx0XHR3aW5kb3dbZ3VpZF0gPSBmdW5jdGlvbigpIHtcblx0XHRcdC8vIFRyaWdnZXIgdGhlIGNhbGxiYWNrXG5cdFx0XHR0cnkge1xuXHRcdFx0XHRpZiAoY2FsbGJhY2suYXBwbHkodGhpcywgYXJndW1lbnRzKSkge1xuXHRcdFx0XHRcdGRlbGV0ZSB3aW5kb3dbZ3VpZF07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZSk7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHJldHVybiBndWlkO1xuXHR9LFxuXG5cdC8vIFRyaWdnZXIgYSBjbGllbnRzaWRlIHBvcHVwXG5cdC8vIFRoaXMgaGFzIGJlZW4gYXVnbWVudGVkIHRvIHN1cHBvcnQgUGhvbmVHYXBcblx0cG9wdXA6IGZ1bmN0aW9uKHVybCwgcmVkaXJlY3RVcmksIG9wdGlvbnMpIHtcblxuXHRcdHZhciBkb2N1bWVudEVsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG5cblx0XHQvLyBNdWx0aSBTY3JlZW4gUG9wdXAgUG9zaXRpb25pbmcgKGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzE2ODYxMDUwKVxuXHRcdC8vIENyZWRpdDogaHR0cDovL3d3dy54dGYuZGsvMjAxMS8wOC9jZW50ZXItbmV3LXBvcHVwLXdpbmRvdy1ldmVuLW9uLmh0bWxcblx0XHQvLyBGaXhlcyBkdWFsLXNjcmVlbiBwb3NpdGlvbiAgICAgICAgICAgICAgICAgICAgICAgICBNb3N0IGJyb3dzZXJzICAgICAgRmlyZWZveFxuXG5cdFx0aWYgKG9wdGlvbnMuaGVpZ2h0KSB7XG5cdFx0XHR2YXIgZHVhbFNjcmVlblRvcCA9IHdpbmRvdy5zY3JlZW5Ub3AgIT09IHVuZGVmaW5lZCA/IHdpbmRvdy5zY3JlZW5Ub3AgOiBzY3JlZW4udG9wO1xuXHRcdFx0dmFyIGhlaWdodCA9IHNjcmVlbi5oZWlnaHQgfHwgd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7XG5cdFx0XHRvcHRpb25zLnRvcCA9IHBhcnNlSW50KChoZWlnaHQgLSBvcHRpb25zLmhlaWdodCkgLyAyLCAxMCkgKyBkdWFsU2NyZWVuVG9wO1xuXHRcdH1cblxuXHRcdGlmIChvcHRpb25zLndpZHRoKSB7XG5cdFx0XHR2YXIgZHVhbFNjcmVlbkxlZnQgPSB3aW5kb3cuc2NyZWVuTGVmdCAhPT0gdW5kZWZpbmVkID8gd2luZG93LnNjcmVlbkxlZnQgOiBzY3JlZW4ubGVmdDtcblx0XHRcdHZhciB3aWR0aCA9IHNjcmVlbi53aWR0aCB8fCB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGg7XG5cdFx0XHRvcHRpb25zLmxlZnQgPSBwYXJzZUludCgod2lkdGggLSBvcHRpb25zLndpZHRoKSAvIDIsIDEwKSArIGR1YWxTY3JlZW5MZWZ0O1xuXHRcdH1cblxuXHRcdC8vIENvbnZlcnQgb3B0aW9ucyBpbnRvIGFuIGFycmF5XG5cdFx0dmFyIG9wdGlvbnNBcnJheSA9IFtdO1xuXHRcdE9iamVjdC5rZXlzKG9wdGlvbnMpLmZvckVhY2goZnVuY3Rpb24obmFtZSkge1xuXHRcdFx0dmFyIHZhbHVlID0gb3B0aW9uc1tuYW1lXTtcblx0XHRcdG9wdGlvbnNBcnJheS5wdXNoKG5hbWUgKyAodmFsdWUgIT09IG51bGwgPyAnPScgKyB2YWx1ZSA6ICcnKSk7XG5cdFx0fSk7XG5cblx0XHQvLyBDcmVhdGUgYSBmdW5jdGlvbiBmb3IgcmVvcGVuaW5nIHRoZSBwb3B1cCwgYW5kIGFzc2lnbmluZyBldmVudHMgdG8gdGhlIG5ldyBwb3B1cCBvYmplY3Rcblx0XHQvLyBUaGlzIGlzIGEgZml4IHdoZXJlYnkgdHJpZ2dlcmluZyB0aGVcblx0XHR2YXIgb3BlbiA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHQvLyBUcmlnZ2VyIGNhbGxiYWNrXG5cdFx0XHR2YXIgcG9wdXAgPSB3aW5kb3cub3Blbihcblx0XHRcdFx0dXJsLFxuXHRcdFx0XHQnX2JsYW5rJyxcblx0XHRcdFx0b3B0aW9uc0FycmF5LmpvaW4oJywnKVxuXHRcdFx0KTtcblxuXHRcdFx0Ly8gUGhvbmVHYXAgc3VwcG9ydFxuXHRcdFx0Ly8gQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIGxpc3RlbiB0byB0aGUgY2hhbmdlIGluIHRoZSBwb3B1cCB3aW5kb3dzIFVSTFxuXHRcdFx0Ly8gVGhpcyBtdXN0IGFwcGVhciBiZWZvcmUgcG9wdXAuZm9jdXMoKTtcblx0XHRcdHRyeSB7XG5cdFx0XHRcdGlmIChwb3B1cCAmJiBwb3B1cC5hZGRFdmVudExpc3RlbmVyKSB7XG5cblx0XHRcdFx0XHQvLyBHZXQgdGhlIG9yaWdpbiBvZiB0aGUgcmVkaXJlY3QgVVJJXG5cblx0XHRcdFx0XHR2YXIgYSA9IGhlbGxvLnV0aWxzLnVybChyZWRpcmVjdFVyaSk7XG5cdFx0XHRcdFx0dmFyIHJlZGlyZWN0VXJpT3JpZ2luID0gYS5vcmlnaW4gfHwgKGEucHJvdG9jb2wgKyAnLy8nICsgYS5ob3N0bmFtZSk7XG5cblx0XHRcdFx0XHQvLyBMaXN0ZW4gdG8gY2hhbmdlcyBpbiB0aGUgSW5BcHBCcm93c2VyIHdpbmRvd1xuXG5cdFx0XHRcdFx0cG9wdXAuYWRkRXZlbnRMaXN0ZW5lcignbG9hZHN0YXJ0JywgZnVuY3Rpb24oZSkge1xuXG5cdFx0XHRcdFx0XHR2YXIgdXJsID0gZS51cmw7XG5cblx0XHRcdFx0XHRcdC8vIElzIHRoaXMgdGhlIHBhdGgsIGFzIGdpdmVuIGJ5IHRoZSByZWRpcmVjdFVyaT9cblx0XHRcdFx0XHRcdC8vIENoZWNrIHRoZSBuZXcgVVJMIGFnYWlucyB0aGUgcmVkaXJlY3RVcmlPcmlnaW4uXG5cdFx0XHRcdFx0XHQvLyBBY2NvcmRpbmcgdG8gIzYzIGEgdXNlciBjb3VsZCBjbGljayAnY2FuY2VsJyBpbiBzb21lIGRpYWxvZyBib3hlcyAuLi4uXG5cdFx0XHRcdFx0XHQvLyBUaGUgcG9wdXAgcmVkaXJlY3RzIHRvIGFub3RoZXIgcGFnZSB3aXRoIHRoZSBzYW1lIG9yaWdpbiwgeWV0IHdlIHN0aWxsIHdpc2ggaXQgdG8gY2xvc2UuXG5cblx0XHRcdFx0XHRcdGlmICh1cmwuaW5kZXhPZihyZWRpcmVjdFVyaU9yaWdpbikgIT09IDApIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHQvLyBTcGxpdCBhcHBhcnQgdGhlIFVSTFxuXHRcdFx0XHRcdFx0dmFyIGEgPSBoZWxsby51dGlscy51cmwodXJsKTtcblxuXHRcdFx0XHRcdFx0Ly8gV2UgZG9udCBoYXZlIHdpbmRvdyBvcGVyYXRpb25zIG9uIHRoZSBwb3B1cCBzbyBsZXRzIGNyZWF0ZSBzb21lXG5cdFx0XHRcdFx0XHQvLyBUaGUgbG9jYXRpb24gY2FuIGJlIGF1Z21lbnRlZCBpbiB0byBhIGxvY2F0aW9uIG9iamVjdCBsaWtlIHNvLi4uXG5cblx0XHRcdFx0XHRcdHZhciBfcG9wdXAgPSB7XG5cdFx0XHRcdFx0XHRcdGxvY2F0aW9uOiB7XG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2hhbmdlIHRoZSBsb2NhdGlvbiBvZiB0aGUgcG9wdXBcblx0XHRcdFx0XHRcdFx0XHRhc3NpZ246IGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG5cblx0XHRcdFx0XHRcdFx0XHRcdC8vIFVuZm91cnR1bmF0bHkgYW4gYXBwIGlzIG1heSBub3QgY2hhbmdlIHRoZSBsb2NhdGlvbiBvZiBhIEluQXBwQnJvd3NlciB3aW5kb3cuXG5cdFx0XHRcdFx0XHRcdFx0XHQvLyBTbyB0byBzaGltIHRoaXMsIGp1c3Qgb3BlbiBhIG5ldyBvbmUuXG5cblx0XHRcdFx0XHRcdFx0XHRcdHBvcHVwLmFkZEV2ZW50TGlzdGVuZXIoJ2V4aXQnLCBmdW5jdGlvbigpIHtcblxuXHRcdFx0XHRcdFx0XHRcdFx0XHQvLyBGb3Igc29tZSByZWFzb24gaXRzIGZhaWxpbmcgdG8gY2xvc2UgdGhlIHdpbmRvdyBpZiBhIG5ldyB3aW5kb3cgb3BlbnMgdG9vIHNvb24uXG5cblx0XHRcdFx0XHRcdFx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvcGVuKGxvY2F0aW9uKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSwgMTAwMCk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdFx0XHR9LFxuXG5cdFx0XHRcdFx0XHRcdFx0c2VhcmNoOiBhLnNlYXJjaCxcblx0XHRcdFx0XHRcdFx0XHRoYXNoOiBhLmhhc2gsXG5cdFx0XHRcdFx0XHRcdFx0aHJlZjogYS5ocmVmXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdGNsb3NlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAocG9wdXAuY2xvc2UpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHBvcHVwLmNsb3NlKCk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0XHQvLyBUaGVuIHRoaXMgVVJMIGNvbnRhaW5zIGluZm9ybWF0aW9uIHdoaWNoIEhlbGxvSlMgbXVzdCBwcm9jZXNzXG5cdFx0XHRcdFx0XHQvLyBVUkwgc3RyaW5nXG5cdFx0XHRcdFx0XHQvLyBXaW5kb3cgLSBhbnkgYWN0aW9uIHN1Y2ggYXMgd2luZG93IHJlbG9jYXRpb24gZ29lcyBoZXJlXG5cdFx0XHRcdFx0XHQvLyBPcGVuZXIgLSB0aGUgcGFyZW50IHdpbmRvdyB3aGljaCBvcGVuZWQgdGhpcywgYWthIHRoaXMgc2NyaXB0XG5cblx0XHRcdFx0XHRcdGhlbGxvLnV0aWxzLnJlc3BvbnNlSGFuZGxlcihfcG9wdXAsIHdpbmRvdyk7XG5cblx0XHRcdFx0XHRcdC8vIEFsd2F5cyBjbG9zZSB0aGUgcG9wdXAgcmVnYXJkbGVzcyBvZiB3aGV0aGVyIHRoZSBoZWxsby51dGlscy5yZXNwb25zZUhhbmRsZXIgZGV0ZWN0cyBhIHN0YXRlIHBhcmFtZXRlciBvciBub3QgaW4gdGhlIHF1ZXJ5c3RyaW5nLlxuXHRcdFx0XHRcdFx0Ly8gU3VjaCBzaXR1YXRpb25zIG1pZ2h0IGFyaXNlIHN1Y2ggYXMgdGhvc2UgaW4gIzYzXG5cblx0XHRcdFx0XHRcdF9wb3B1cC5jbG9zZSgpO1xuXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7fVxuXG5cdFx0XHRpZiAocG9wdXAgJiYgcG9wdXAuZm9jdXMpIHtcblx0XHRcdFx0cG9wdXAuZm9jdXMoKTtcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBvcHVwO1xuXHRcdH07XG5cblx0XHQvLyBDYWxsIHRoZSBvcGVuKCkgZnVuY3Rpb24gd2l0aCB0aGUgaW5pdGlhbCBwYXRoXG5cdFx0Ly9cblx0XHQvLyBPQXV0aCByZWRpcmVjdCwgZml4ZXMgVVJJIGZyYWdtZW50cyBmcm9tIGJlaW5nIGxvc3QgaW4gU2FmYXJpXG5cdFx0Ly8gKFVSSSBGcmFnbWVudHMgd2l0aGluIDMwMiBMb2NhdGlvbiBVUkkgYXJlIGxvc3Qgb3ZlciBIVFRQUylcblx0XHQvLyBMb2FkaW5nIHRoZSByZWRpcmVjdC5odG1sIGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSBPQXV0aCBGbG93IHNlZW1zIHRvIGZpeCBpdC5cblx0XHQvL1xuXHRcdC8vIEZpcmVmb3ggIGRlY29kZXMgVVJMIGZyYWdtZW50cyB3aGVuIGNhbGxpbmcgbG9jYXRpb24uaGFzaC5cblx0XHQvLyAgLSBUaGlzIGlzIGJhZCBpZiB0aGUgdmFsdWUgY29udGFpbnMgYnJlYWsgcG9pbnRzIHdoaWNoIGFyZSBlc2NhcGVkXG5cdFx0Ly8gIC0gSGVuY2UgdGhlIHVybCBtdXN0IGJlIGVuY29kZWQgdHdpY2UgYXMgaXQgY29udGFpbnMgYnJlYWtwb2ludHMuXG5cdFx0aWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignU2FmYXJpJykgIT09IC0xICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lJykgPT09IC0xKSB7XG5cdFx0XHR1cmwgPSByZWRpcmVjdFVyaSArICcjb2F1dGhfcmVkaXJlY3Q9JyArIGVuY29kZVVSSUNvbXBvbmVudChlbmNvZGVVUklDb21wb25lbnQodXJsKSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG9wZW4odXJsKTtcblx0fSxcblxuXHQvLyBPQXV0aCBhbmQgQVBJIHJlc3BvbnNlIGhhbmRsZXJcblx0cmVzcG9uc2VIYW5kbGVyOiBmdW5jdGlvbih3aW5kb3csIHBhcmVudCkge1xuXG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHR2YXIgcDtcblx0XHR2YXIgbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb247XG5cblx0XHQvLyBJcyB0aGlzIGFuIGF1dGggcmVsYXkgbWVzc2FnZSB3aGljaCBuZWVkcyB0byBjYWxsIHRoZSBwcm94eT9cblx0XHRwID0gX3RoaXMucGFyYW0obG9jYXRpb24uc2VhcmNoKTtcblxuXHRcdC8vIE9BdXRoMiBvciBPQXV0aDEgc2VydmVyIHJlc3BvbnNlP1xuXHRcdGlmIChwICYmIHAuc3RhdGUgJiYgKHAuY29kZSB8fCBwLm9hdXRoX3Rva2VuKSkge1xuXG5cdFx0XHR2YXIgc3RhdGUgPSBKU09OLnBhcnNlKHAuc3RhdGUpO1xuXG5cdFx0XHQvLyBBZGQgdGhpcyBwYXRoIGFzIHRoZSByZWRpcmVjdF91cmlcblx0XHRcdHAucmVkaXJlY3RfdXJpID0gc3RhdGUucmVkaXJlY3RfdXJpIHx8IGxvY2F0aW9uLmhyZWYucmVwbGFjZSgvW1xcP1xcI10uKiQvLCAnJyk7XG5cblx0XHRcdC8vIFJlZGlyZWN0IHRvIHRoZSBob3N0XG5cdFx0XHR2YXIgcGF0aCA9IHN0YXRlLm9hdXRoX3Byb3h5ICsgJz8nICsgX3RoaXMucGFyYW0ocCk7XG5cblx0XHRcdGxvY2F0aW9uLmFzc2lnbihwYXRoKTtcblxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdC8vIFNhdmUgc2Vzc2lvbiwgZnJvbSByZWRpcmVjdGVkIGF1dGhlbnRpY2F0aW9uXG5cdFx0Ly8gI2FjY2Vzc190b2tlbiBoYXMgY29tZSBpbj9cblx0XHQvL1xuXHRcdC8vIEZBQ0VCT09LIGlzIHJldHVybmluZyBhdXRoIGVycm9ycyB3aXRoaW4gYXMgYSBxdWVyeV9zdHJpbmcuLi4gdGhhdHMgYSBzdGlja2xlciBmb3IgY29uc2lzdGVuY3kuXG5cdFx0Ly8gU291bmRDbG91ZCBpcyB0aGUgc3RhdGUgaW4gdGhlIHF1ZXJ5c3RyaW5nIGFuZCB0aGUgdG9rZW4gaW4gdGhlIGhhc2h0YWcsIHNvIHdlJ2xsIG1peCB0aGUgdHdvIHRvZ2V0aGVyXG5cblx0XHRwID0gX3RoaXMubWVyZ2UoX3RoaXMucGFyYW0obG9jYXRpb24uc2VhcmNoIHx8ICcnKSwgX3RoaXMucGFyYW0obG9jYXRpb24uaGFzaCB8fCAnJykpO1xuXG5cdFx0Ly8gSWYgcC5zdGF0ZVxuXHRcdGlmIChwICYmICdzdGF0ZScgaW4gcCkge1xuXG5cdFx0XHQvLyBSZW1vdmUgYW55IGFkZGl0aW9uIGluZm9ybWF0aW9uXG5cdFx0XHQvLyBFLmcuIHAuc3RhdGUgPSAnZmFjZWJvb2sucGFnZSc7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHR2YXIgYSA9IEpTT04ucGFyc2UocC5zdGF0ZSk7XG5cdFx0XHRcdF90aGlzLmV4dGVuZChwLCBhKTtcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ0NvdWxkIG5vdCBkZWNvZGUgc3RhdGUgcGFyYW1ldGVyJyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2Vzc190b2tlbj9cblx0XHRcdGlmICgoJ2FjY2Vzc190b2tlbicgaW4gcCAmJiBwLmFjY2Vzc190b2tlbikgJiYgcC5uZXR3b3JrKSB7XG5cblx0XHRcdFx0aWYgKCFwLmV4cGlyZXNfaW4gfHwgcGFyc2VJbnQocC5leHBpcmVzX2luLCAxMCkgPT09IDApIHtcblx0XHRcdFx0XHQvLyBJZiBwLmV4cGlyZXNfaW4gaXMgdW5zZXQsIHNldCB0byAwXG5cdFx0XHRcdFx0cC5leHBpcmVzX2luID0gMDtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHAuZXhwaXJlc19pbiA9IHBhcnNlSW50KHAuZXhwaXJlc19pbiwgMTApO1xuXHRcdFx0XHRwLmV4cGlyZXMgPSAoKG5ldyBEYXRlKCkpLmdldFRpbWUoKSAvIDFlMykgKyAocC5leHBpcmVzX2luIHx8ICg2MCAqIDYwICogMjQgKiAzNjUpKTtcblxuXHRcdFx0XHQvLyBMZXRzIHVzZSB0aGUgXCJzdGF0ZVwiIHRvIGFzc2lnbiBpdCB0byBvbmUgb2Ygb3VyIG5ldHdvcmtzXG5cdFx0XHRcdGF1dGhDYWxsYmFjayhwLCB3aW5kb3csIHBhcmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEVycm9yPT9cblx0XHRcdC8vICZlcnJvcl9kZXNjcmlwdGlvbj0/XG5cdFx0XHQvLyAmc3RhdGU9P1xuXHRcdFx0ZWxzZSBpZiAoKCdlcnJvcicgaW4gcCAmJiBwLmVycm9yKSAmJiBwLm5ldHdvcmspIHtcblxuXHRcdFx0XHRwLmVycm9yID0ge1xuXHRcdFx0XHRcdGNvZGU6IHAuZXJyb3IsXG5cdFx0XHRcdFx0bWVzc2FnZTogcC5lcnJvcl9tZXNzYWdlIHx8IHAuZXJyb3JfZGVzY3JpcHRpb25cblx0XHRcdFx0fTtcblxuXHRcdFx0XHQvLyBMZXQgdGhlIHN0YXRlIGhhbmRsZXIgaGFuZGxlIGl0XG5cdFx0XHRcdGF1dGhDYWxsYmFjayhwLCB3aW5kb3csIHBhcmVudCk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFQSSBjYWxsLCBvciBhIGNhbmNlbGxlZCBsb2dpblxuXHRcdFx0Ly8gUmVzdWx0IGlzIHNlcmlhbGl6ZWQgSlNPTiBzdHJpbmdcblx0XHRcdGVsc2UgaWYgKHAuY2FsbGJhY2sgJiYgcC5jYWxsYmFjayBpbiBwYXJlbnQpIHtcblxuXHRcdFx0XHQvLyBUcmlnZ2VyIGEgZnVuY3Rpb24gaW4gdGhlIHBhcmVudFxuXHRcdFx0XHR2YXIgcmVzID0gJ3Jlc3VsdCcgaW4gcCAmJiBwLnJlc3VsdCA/IEpTT04ucGFyc2UocC5yZXN1bHQpIDogZmFsc2U7XG5cblx0XHRcdFx0Ly8gVHJpZ2dlciB0aGUgY2FsbGJhY2sgb24gdGhlIHBhcmVudFxuXHRcdFx0XHRwYXJlbnRbcC5jYWxsYmFja10ocmVzKTtcblx0XHRcdFx0Y2xvc2VXaW5kb3coKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhpcyBwYWdlIGlzIHN0aWxsIG9wZW5cblx0XHRcdGlmIChwLnBhZ2VfdXJpKSB7XG5cdFx0XHRcdGxvY2F0aW9uLmFzc2lnbihwLnBhZ2VfdXJpKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBPQXV0aCByZWRpcmVjdCwgZml4ZXMgVVJJIGZyYWdtZW50cyBmcm9tIGJlaW5nIGxvc3QgaW4gU2FmYXJpXG5cdFx0Ly8gKFVSSSBGcmFnbWVudHMgd2l0aGluIDMwMiBMb2NhdGlvbiBVUkkgYXJlIGxvc3Qgb3ZlciBIVFRQUylcblx0XHQvLyBMb2FkaW5nIHRoZSByZWRpcmVjdC5odG1sIGJlZm9yZSB0cmlnZ2VyaW5nIHRoZSBPQXV0aCBGbG93IHNlZW1zIHRvIGZpeCBpdC5cblx0XHRlbHNlIGlmICgnb2F1dGhfcmVkaXJlY3QnIGluIHApIHtcblxuXHRcdFx0bG9jYXRpb24uYXNzaWduKGRlY29kZVVSSUNvbXBvbmVudChwLm9hdXRoX3JlZGlyZWN0KSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gVHJpZ2dlciBhIGNhbGxiYWNrIHRvIGF1dGhlbnRpY2F0ZVxuXHRcdGZ1bmN0aW9uIGF1dGhDYWxsYmFjayhvYmosIHdpbmRvdywgcGFyZW50KSB7XG5cblx0XHRcdHZhciBjYiA9IG9iai5jYWxsYmFjaztcblx0XHRcdHZhciBuZXR3b3JrID0gb2JqLm5ldHdvcms7XG5cblx0XHRcdC8vIFRyaWdnZXIgdGhlIGNhbGxiYWNrIG9uIHRoZSBwYXJlbnRcblx0XHRcdF90aGlzLnN0b3JlKG5ldHdvcmssIG9iaik7XG5cblx0XHRcdC8vIElmIHRoaXMgaXMgYSBwYWdlIHJlcXVlc3QgaXQgaGFzIG5vIHBhcmVudCBvciBvcGVuZXIgd2luZG93IHRvIGhhbmRsZSBjYWxsYmFja3Ncblx0XHRcdGlmICgoJ2Rpc3BsYXknIGluIG9iaikgJiYgb2JqLmRpc3BsYXkgPT09ICdwYWdlJykge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlbW92ZSBmcm9tIHNlc3Npb24gb2JqZWN0XG5cdFx0XHRpZiAocGFyZW50ICYmIGNiICYmIGNiIGluIHBhcmVudCkge1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0ZGVsZXRlIG9iai5jYWxsYmFjaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZSkge31cblxuXHRcdFx0XHQvLyBVcGRhdGUgc3RvcmVcblx0XHRcdFx0X3RoaXMuc3RvcmUobmV0d29yaywgb2JqKTtcblxuXHRcdFx0XHQvLyBDYWxsIHRoZSBnbG9iYWxFdmVudCBmdW5jdGlvbiBvbiB0aGUgcGFyZW50XG5cdFx0XHRcdC8vIEl0J3Mgc2FmZXIgdG8gcGFzcyBiYWNrIGEgc3RyaW5nIHRvIHRoZSBwYXJlbnQsXG5cdFx0XHRcdC8vIFJhdGhlciB0aGFuIGFuIG9iamVjdC9hcnJheSAoYmV0dGVyIGZvciBJRTgpXG5cdFx0XHRcdHZhciBzdHIgPSBKU09OLnN0cmluZ2lmeShvYmopO1xuXG5cdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0cGFyZW50W2NiXShzdHIpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0Ly8gRXJyb3IgdGhyb3duIHdoaWxzdCBleGVjdXRpbmcgcGFyZW50IGNhbGxiYWNrXG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y2xvc2VXaW5kb3coKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBjbG9zZVdpbmRvdygpIHtcblxuXHRcdFx0Ly8gQ2xvc2UgdGhpcyBjdXJyZW50IHdpbmRvd1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0d2luZG93LmNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0XHRjYXRjaCAoZSkge31cblxuXHRcdFx0Ly8gSU9TIGJ1ZyB3b250IGxldCB1cyBjbG9zZSBhIHBvcHVwIGlmIHN0aWxsIGxvYWRpbmdcblx0XHRcdGlmICh3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcikge1xuXHRcdFx0XHR3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHdpbmRvdy5jbG9zZSgpO1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9XG5cdH1cbn0pO1xuXG4vLyBFdmVudHNcblxuLy8gRXh0ZW5kIHRoZSBoZWxsbyBvYmplY3Qgd2l0aCBpdHMgb3duIGV2ZW50IGluc3RhbmNlXG5oZWxsby51dGlscy5FdmVudC5jYWxsKGhlbGxvKTtcblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy9cbi8vIFNhdmUgYW55IGFjY2VzcyB0b2tlbiB0aGF0IGlzIGluIHRoZSBjdXJyZW50IHBhZ2UgVVJMXG4vLyBIYW5kbGUgYW55IHJlc3BvbnNlIHNvbGljaXRlZCB0aHJvdWdoIGlmcmFtZSBoYXNoIHRhZyBmb2xsb3dpbmcgYW4gQVBJIHJlcXVlc3Rcbi8vXG4vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmhlbGxvLnV0aWxzLnJlc3BvbnNlSGFuZGxlcih3aW5kb3csIHdpbmRvdy5vcGVuZXIgfHwgd2luZG93LnBhcmVudCk7XG5cbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBNb25pdG9yaW5nIHNlc3Npb24gc3RhdGVcbi8vIENoZWNrIGZvciBzZXNzaW9uIGNoYW5nZXNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdC8vIE1vbml0b3IgZm9yIGEgY2hhbmdlIGluIHN0YXRlIGFuZCBmaXJlXG5cdHZhciBvbGRTZXNzaW9ucyA9IHt9O1xuXG5cdC8vIEhhc2ggb2YgZXhwaXJlZCB0b2tlbnNcblx0dmFyIGV4cGlyZWQgPSB7fTtcblxuXHQvLyBMaXN0ZW4gdG8gb3RoZXIgdHJpZ2dlcnMgdG8gQXV0aCBldmVudHMsIHVzZSB0aGVzZSB0byB1cGRhdGUgdGhpc1xuXHRoZWxsby5vbignYXV0aC5sb2dpbiwgYXV0aC5sb2dvdXQnLCBmdW5jdGlvbihhdXRoKSB7XG5cdFx0aWYgKGF1dGggJiYgdHlwZW9mIChhdXRoKSA9PT0gJ29iamVjdCcgJiYgYXV0aC5uZXR3b3JrKSB7XG5cdFx0XHRvbGRTZXNzaW9uc1thdXRoLm5ldHdvcmtdID0gaGVsbG8udXRpbHMuc3RvcmUoYXV0aC5uZXR3b3JrKSB8fCB7fTtcblx0XHR9XG5cdH0pO1xuXG5cdChmdW5jdGlvbiBzZWxmKCkge1xuXG5cdFx0dmFyIENVUlJFTlRfVElNRSA9ICgobmV3IERhdGUoKSkuZ2V0VGltZSgpIC8gMWUzKTtcblx0XHR2YXIgZW1pdCA9IGZ1bmN0aW9uKGV2ZW50TmFtZSkge1xuXHRcdFx0aGVsbG8uZW1pdCgnYXV0aC4nICsgZXZlbnROYW1lLCB7XG5cdFx0XHRcdG5ldHdvcms6IG5hbWUsXG5cdFx0XHRcdGF1dGhSZXNwb25zZTogc2Vzc2lvblxuXHRcdFx0fSk7XG5cdFx0fTtcblxuXHRcdC8vIExvb3AgdGhyb3VnaCB0aGUgc2VydmljZXNcblx0XHRmb3IgKHZhciBuYW1lIGluIGhlbGxvLnNlcnZpY2VzKSB7aWYgKGhlbGxvLnNlcnZpY2VzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG5cblx0XHRcdGlmICghaGVsbG8uc2VydmljZXNbbmFtZV0uaWQpIHtcblx0XHRcdFx0Ly8gV2UgaGF2ZW4ndCBhdHRhY2hlZCBhbiBJRCBzbyBkb250IGxpc3Rlbi5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEdldCBzZXNzaW9uXG5cdFx0XHR2YXIgc2Vzc2lvbiA9IGhlbGxvLnV0aWxzLnN0b3JlKG5hbWUpIHx8IHt9O1xuXHRcdFx0dmFyIHByb3ZpZGVyID0gaGVsbG8uc2VydmljZXNbbmFtZV07XG5cdFx0XHR2YXIgb2xkU2VzcyA9IG9sZFNlc3Npb25zW25hbWVdIHx8IHt9O1xuXG5cdFx0XHQvLyBMaXN0ZW4gZm9yIGdsb2JhbEV2ZW50cyB0aGF0IGRpZCBub3QgZ2V0IHRyaWdnZXJlZCBmcm9tIHRoZSBjaGlsZFxuXHRcdFx0aWYgKHNlc3Npb24gJiYgJ2NhbGxiYWNrJyBpbiBzZXNzaW9uKSB7XG5cblx0XHRcdFx0Ly8gVG8gZG8gcmVtb3ZlIGZyb20gc2Vzc2lvbiBvYmplY3QuLi5cblx0XHRcdFx0dmFyIGNiID0gc2Vzc2lvbi5jYWxsYmFjaztcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRkZWxldGUgc2Vzc2lvbi5jYWxsYmFjaztcblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZSkge31cblxuXHRcdFx0XHQvLyBVcGRhdGUgc3RvcmVcblx0XHRcdFx0Ly8gUmVtb3ZpbmcgdGhlIGNhbGxiYWNrXG5cdFx0XHRcdGhlbGxvLnV0aWxzLnN0b3JlKG5hbWUsIHNlc3Npb24pO1xuXG5cdFx0XHRcdC8vIEVtaXQgZ2xvYmFsIGV2ZW50c1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdHdpbmRvd1tjYl0oc2Vzc2lvbik7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2F0Y2ggKGUpIHt9XG5cdFx0XHR9XG5cblx0XHRcdC8vIFJlZnJlc2ggdG9rZW5cblx0XHRcdGlmIChzZXNzaW9uICYmICgnZXhwaXJlcycgaW4gc2Vzc2lvbikgJiYgc2Vzc2lvbi5leHBpcmVzIDwgQ1VSUkVOVF9USU1FKSB7XG5cblx0XHRcdFx0Ly8gSWYgYXV0byByZWZyZXNoIGlzIHBvc3NpYmxlXG5cdFx0XHRcdC8vIEVpdGhlciB0aGUgYnJvd3NlciBzdXBwb3J0c1xuXHRcdFx0XHR2YXIgcmVmcmVzaCA9IHByb3ZpZGVyLnJlZnJlc2ggfHwgc2Vzc2lvbi5yZWZyZXNoX3Rva2VuO1xuXG5cdFx0XHRcdC8vIEhhcyB0aGUgcmVmcmVzaCBiZWVuIHJ1biByZWNlbnRseT9cblx0XHRcdFx0aWYgKHJlZnJlc2ggJiYgKCEobmFtZSBpbiBleHBpcmVkKSB8fCBleHBpcmVkW25hbWVdIDwgQ1VSUkVOVF9USU1FKSkge1xuXHRcdFx0XHRcdC8vIFRyeSB0byByZXNpZ25pblxuXHRcdFx0XHRcdGhlbGxvLmVtaXQoJ25vdGljZScsIG5hbWUgKyAnIGhhcyBleHBpcmVkIHRyeWluZyB0byByZXNpZ25pbicpO1xuXHRcdFx0XHRcdGhlbGxvLmxvZ2luKG5hbWUsIHtkaXNwbGF5OiAnbm9uZScsIGZvcmNlOiBmYWxzZX0pO1xuXG5cdFx0XHRcdFx0Ly8gVXBkYXRlIGV4cGlyZWQsIGV2ZXJ5IDEwIG1pbnV0ZXNcblx0XHRcdFx0XHRleHBpcmVkW25hbWVdID0gQ1VSUkVOVF9USU1FICsgNjAwO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gRG9lcyB0aGlzIHByb3ZpZGVyIG5vdCBzdXBwb3J0IHJlZnJlc2hcblx0XHRcdFx0ZWxzZSBpZiAoIXJlZnJlc2ggJiYgIShuYW1lIGluIGV4cGlyZWQpKSB7XG5cdFx0XHRcdFx0Ly8gTGFiZWwgdGhlIGV2ZW50XG5cdFx0XHRcdFx0ZW1pdCgnZXhwaXJlZCcpO1xuXHRcdFx0XHRcdGV4cGlyZWRbbmFtZV0gPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSWYgc2Vzc2lvbiBoYXMgZXhwaXJlZCB0aGVuIHdlIGRvbnQgd2FudCB0byBzdG9yZSBpdHMgdmFsdWUgdW50aWwgaXQgY2FuIGJlIGVzdGFibGlzaGVkIHRoYXQgaXRzIGJlZW4gdXBkYXRlZFxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSGFzIHNlc3Npb24gY2hhbmdlZD9cblx0XHRcdGVsc2UgaWYgKG9sZFNlc3MuYWNjZXNzX3Rva2VuID09PSBzZXNzaW9uLmFjY2Vzc190b2tlbiAmJlxuXHRcdFx0b2xkU2Vzcy5leHBpcmVzID09PSBzZXNzaW9uLmV4cGlyZXMpIHtcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2Vzc190b2tlbiBoYXMgYmVlbiByZW1vdmVkXG5cdFx0XHRlbHNlIGlmICghc2Vzc2lvbi5hY2Nlc3NfdG9rZW4gJiYgb2xkU2Vzcy5hY2Nlc3NfdG9rZW4pIHtcblx0XHRcdFx0ZW1pdCgnbG9nb3V0Jyk7XG5cdFx0XHR9XG5cblx0XHRcdC8vIEFjY2Vzc190b2tlbiBoYXMgYmVlbiBjcmVhdGVkXG5cdFx0XHRlbHNlIGlmIChzZXNzaW9uLmFjY2Vzc190b2tlbiAmJiAhb2xkU2Vzcy5hY2Nlc3NfdG9rZW4pIHtcblx0XHRcdFx0ZW1pdCgnbG9naW4nKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQWNjZXNzX3Rva2VuIGhhcyBiZWVuIHVwZGF0ZWRcblx0XHRcdGVsc2UgaWYgKHNlc3Npb24uZXhwaXJlcyAhPT0gb2xkU2Vzcy5leHBpcmVzKSB7XG5cdFx0XHRcdGVtaXQoJ3VwZGF0ZScpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBVcGRhdGVkIHN0b3JlZCBzZXNzaW9uXG5cdFx0XHRvbGRTZXNzaW9uc1tuYW1lXSA9IHNlc3Npb247XG5cblx0XHRcdC8vIFJlbW92ZSB0aGUgZXhwaXJlZCBmbGFnc1xuXHRcdFx0aWYgKG5hbWUgaW4gZXhwaXJlZCkge1xuXHRcdFx0XHRkZWxldGUgZXhwaXJlZFtuYW1lXTtcblx0XHRcdH1cblx0XHR9fVxuXG5cdFx0Ly8gQ2hlY2sgZXJyb3IgZXZlbnRzXG5cdFx0c2V0VGltZW91dChzZWxmLCAxMDAwKTtcblx0fSkoKTtcblxufSkoaGVsbG8pO1xuXG4vLyBFT0YgQ09SRSBsaWJcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cblxuLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIEFQSVxuLy8gQHBhcmFtIHBhdGggICAgc3RyaW5nXG4vLyBAcGFyYW0gcXVlcnkgICBvYmplY3QgKG9wdGlvbmFsKVxuLy8gQHBhcmFtIG1ldGhvZCAgc3RyaW5nIChvcHRpb25hbClcbi8vIEBwYXJhbSBkYXRhICAgIG9iamVjdCAob3B0aW9uYWwpXG4vLyBAcGFyYW0gdGltZW91dCBpbnRlZ2VyIChvcHRpb25hbClcbi8vIEBwYXJhbSBjYWxsYmFjayAgZnVuY3Rpb24gKG9wdGlvbmFsKVxuXG5oZWxsby5hcGkgPSBmdW5jdGlvbigpIHtcblxuXHQvLyBTaG9ydGhhbmRcblx0dmFyIF90aGlzID0gdGhpcztcblx0dmFyIHV0aWxzID0gX3RoaXMudXRpbHM7XG5cdHZhciBlcnJvciA9IHV0aWxzLmVycm9yO1xuXG5cdC8vIENvbnN0cnVjdCBhIG5ldyBQcm9taXNlIG9iamVjdFxuXHR2YXIgcHJvbWlzZSA9IHV0aWxzLlByb21pc2UoKTtcblxuXHQvLyBBcmd1bWVudHNcblx0dmFyIHAgPSB1dGlscy5hcmdzKHtwYXRoOiAncyEnLCBxdWVyeTogJ28nLCBtZXRob2Q6ICdzJywgZGF0YTogJ28nLCB0aW1lb3V0OiAnaScsIGNhbGxiYWNrOiAnZid9LCBhcmd1bWVudHMpO1xuXG5cdC8vIE1ldGhvZFxuXHRwLm1ldGhvZCA9IChwLm1ldGhvZCB8fCAnZ2V0JykudG9Mb3dlckNhc2UoKTtcblxuXHQvLyBIZWFkZXJzXG5cdHAuaGVhZGVycyA9IHAuaGVhZGVycyB8fCB7fTtcblxuXHQvLyBRdWVyeVxuXHRwLnF1ZXJ5ID0gcC5xdWVyeSB8fCB7fTtcblxuXHQvLyBJZiBnZXQsIHB1dCBhbGwgcGFyYW1ldGVycyBpbnRvIHF1ZXJ5XG5cdGlmIChwLm1ldGhvZCA9PT0gJ2dldCcgfHwgcC5tZXRob2QgPT09ICdkZWxldGUnKSB7XG5cdFx0dXRpbHMuZXh0ZW5kKHAucXVlcnksIHAuZGF0YSk7XG5cdFx0cC5kYXRhID0ge307XG5cdH1cblxuXHR2YXIgZGF0YSA9IHAuZGF0YSA9IHAuZGF0YSB8fCB7fTtcblxuXHQvLyBDb21wbGV0ZWQgZXZlbnQgY2FsbGJhY2tcblx0cHJvbWlzZS50aGVuKHAuY2FsbGJhY2ssIHAuY2FsbGJhY2spO1xuXG5cdC8vIFJlbW92ZSB0aGUgbmV0d29yayBmcm9tIHBhdGgsIGUuZy4gZmFjZWJvb2s6L21lL2ZyaWVuZHNcblx0Ly8gUmVzdWx0cyBpbiB7IG5ldHdvcmsgOiBmYWNlYm9vaywgcGF0aCA6IG1lL2ZyaWVuZHMgfVxuXHRpZiAoIXAucGF0aCkge1xuXHRcdHJldHVybiBwcm9taXNlLnJlamVjdChlcnJvcignaW52YWxpZF9wYXRoJywgJ01pc3NpbmcgdGhlIHBhdGggcGFyYW1ldGVyIGZyb20gdGhlIHJlcXVlc3QnKSk7XG5cdH1cblxuXHRwLnBhdGggPSBwLnBhdGgucmVwbGFjZSgvXlxcLysvLCAnJyk7XG5cdHZhciBhID0gKHAucGF0aC5zcGxpdCgvW1xcL1xcOl0vLCAyKSB8fCBbXSlbMF0udG9Mb3dlckNhc2UoKTtcblxuXHRpZiAoYSBpbiBfdGhpcy5zZXJ2aWNlcykge1xuXHRcdHAubmV0d29yayA9IGE7XG5cdFx0dmFyIHJlZyA9IG5ldyBSZWdFeHAoJ14nICsgYSArICc6P1xcLz8nKTtcblx0XHRwLnBhdGggPSBwLnBhdGgucmVwbGFjZShyZWcsICcnKTtcblx0fVxuXG5cdC8vIE5ldHdvcmsgJiBQcm92aWRlclxuXHQvLyBEZWZpbmUgdGhlIG5ldHdvcmsgdGhhdCB0aGlzIHJlcXVlc3QgaXMgbWFkZSBmb3Jcblx0cC5uZXR3b3JrID0gX3RoaXMuc2V0dGluZ3MuZGVmYXVsdF9zZXJ2aWNlID0gcC5uZXR3b3JrIHx8IF90aGlzLnNldHRpbmdzLmRlZmF1bHRfc2VydmljZTtcblx0dmFyIG8gPSBfdGhpcy5zZXJ2aWNlc1twLm5ldHdvcmtdO1xuXG5cdC8vIElOVkFMSURcblx0Ly8gSXMgdGhlcmUgbm8gc2VydmljZSBieSB0aGUgZ2l2ZW4gbmV0d29yayBuYW1lP1xuXHRpZiAoIW8pIHtcblx0XHRyZXR1cm4gcHJvbWlzZS5yZWplY3QoZXJyb3IoJ2ludmFsaWRfbmV0d29yaycsICdDb3VsZCBub3QgbWF0Y2ggdGhlIHNlcnZpY2UgcmVxdWVzdGVkOiAnICsgcC5uZXR3b3JrKSk7XG5cdH1cblxuXHQvLyBQQVRIXG5cdC8vIEFzIGxvbmcgYXMgdGhlIHBhdGggaXNuJ3QgZmxhZ2dlZCBhcyB1bmF2YWlhYmxlLCBlLmcuIHBhdGggPT0gZmFsc2VcblxuXHRpZiAoISghKHAubWV0aG9kIGluIG8pIHx8ICEocC5wYXRoIGluIG9bcC5tZXRob2RdKSB8fCBvW3AubWV0aG9kXVtwLnBhdGhdICE9PSBmYWxzZSkpIHtcblx0XHRyZXR1cm4gcHJvbWlzZS5yZWplY3QoZXJyb3IoJ2ludmFsaWRfcGF0aCcsICdUaGUgcHJvdmlkZWQgcGF0aCBpcyBub3QgYXZhaWxhYmxlIG9uIHRoZSBzZWxlY3RlZCBuZXR3b3JrJykpO1xuXHR9XG5cblx0Ly8gUFJPWFlcblx0Ly8gT0F1dGgxIGNhbGxzIGFsd2F5cyBuZWVkIGEgcHJveHlcblxuXHRpZiAoIXAub2F1dGhfcHJveHkpIHtcblx0XHRwLm9hdXRoX3Byb3h5ID0gX3RoaXMuc2V0dGluZ3Mub2F1dGhfcHJveHk7XG5cdH1cblxuXHRpZiAoISgncHJveHknIGluIHApKSB7XG5cdFx0cC5wcm94eSA9IHAub2F1dGhfcHJveHkgJiYgby5vYXV0aCAmJiBwYXJzZUludChvLm9hdXRoLnZlcnNpb24sIDEwKSA9PT0gMTtcblx0fVxuXG5cdC8vIFRJTUVPVVRcblx0Ly8gQWRvcHQgdGltZW91dCBmcm9tIGdsb2JhbCBzZXR0aW5ncyBieSBkZWZhdWx0XG5cblx0aWYgKCEoJ3RpbWVvdXQnIGluIHApKSB7XG5cdFx0cC50aW1lb3V0ID0gX3RoaXMuc2V0dGluZ3MudGltZW91dDtcblx0fVxuXG5cdC8vIEZvcm1hdCByZXNwb25zZVxuXHQvLyBXaGV0aGVyIHRvIHJ1biB0aGUgcmF3IHJlc3BvbnNlIHRocm91Z2ggcG9zdCBwcm9jZXNzaW5nLlxuXHRpZiAoISgnZm9ybWF0UmVzcG9uc2UnIGluIHApKSB7XG5cdFx0cC5mb3JtYXRSZXNwb25zZSA9IHRydWU7XG5cdH1cblxuXHQvLyBHZXQgdGhlIGN1cnJlbnQgc2Vzc2lvblxuXHQvLyBBcHBlbmQgdGhlIGFjY2Vzc190b2tlbiB0byB0aGUgcXVlcnlcblx0cC5hdXRoUmVzcG9uc2UgPSBfdGhpcy5nZXRBdXRoUmVzcG9uc2UocC5uZXR3b3JrKTtcblx0aWYgKHAuYXV0aFJlc3BvbnNlICYmIHAuYXV0aFJlc3BvbnNlLmFjY2Vzc190b2tlbikge1xuXHRcdHAucXVlcnkuYWNjZXNzX3Rva2VuID0gcC5hdXRoUmVzcG9uc2UuYWNjZXNzX3Rva2VuO1xuXHR9XG5cblx0dmFyIHVybCA9IHAucGF0aDtcblx0dmFyIG07XG5cblx0Ly8gU3RvcmUgdGhlIHF1ZXJ5IGFzIG9wdGlvbnNcblx0Ly8gVGhpcyBpcyB1c2VkIHRvIHBvcHVsYXRlIHRoZSByZXF1ZXN0IG9iamVjdCBiZWZvcmUgdGhlIGRhdGEgaXMgYXVnbWVudGVkIGJ5IHRoZSBwcmV3cmFwIGhhbmRsZXJzLlxuXHRwLm9wdGlvbnMgPSB1dGlscy5jbG9uZShwLnF1ZXJ5KTtcblxuXHQvLyBDbG9uZSB0aGUgZGF0YSBvYmplY3Rcblx0Ly8gUHJldmVudCB0aGlzIHNjcmlwdCBvdmVyd3JpdGluZyB0aGUgZGF0YSBvZiB0aGUgaW5jb21pbmcgb2JqZWN0LlxuXHQvLyBFbnN1cmUgdGhhdCBldmVyeXRpbWUgd2UgcnVuIGFuIGl0ZXJhdGlvbiB0aGUgY2FsbGJhY2tzIGhhdmVuJ3QgcmVtb3ZlZCBzb21lIGRhdGFcblx0cC5kYXRhID0gdXRpbHMuY2xvbmUoZGF0YSk7XG5cblx0Ly8gVVJMIE1hcHBpbmdcblx0Ly8gSXMgdGhlcmUgYSBtYXAgZm9yIHRoZSBnaXZlbiBVUkw/XG5cdHZhciBhY3Rpb25zID0gb1t7J2RlbGV0ZSc6ICdkZWwnfVtwLm1ldGhvZF0gfHwgcC5tZXRob2RdIHx8IHt9O1xuXG5cdC8vIEV4dHJhcG9sYXRlIHRoZSBRdWVyeVN0cmluZ1xuXHQvLyBQcm92aWRlIGEgY2xlYW4gcGF0aFxuXHQvLyBNb3ZlIHRoZSBxdWVyeXN0cmluZyBpbnRvIHRoZSBkYXRhXG5cdGlmIChwLm1ldGhvZCA9PT0gJ2dldCcpIHtcblxuXHRcdHZhciBxdWVyeSA9IHVybC5zcGxpdCgvW1xcPyNdLylbMV07XG5cdFx0aWYgKHF1ZXJ5KSB7XG5cdFx0XHR1dGlscy5leHRlbmQocC5xdWVyeSwgdXRpbHMucGFyYW0ocXVlcnkpKTtcblxuXHRcdFx0Ly8gUmVtb3ZlIHRoZSBxdWVyeSBwYXJ0IGZyb20gdGhlIFVSTFxuXHRcdFx0dXJsID0gdXJsLnJlcGxhY2UoL1xcPy4qPygjfCQpLywgJyQxJyk7XG5cdFx0fVxuXHR9XG5cblx0Ly8gSXMgdGhlIGhhc2ggZnJhZ21lbnQgZGVmaW5lZFxuXHRpZiAoKG0gPSB1cmwubWF0Y2goLyMoLispLywgJycpKSkge1xuXHRcdHVybCA9IHVybC5zcGxpdCgnIycpWzBdO1xuXHRcdHAucGF0aCA9IG1bMV07XG5cdH1cblx0ZWxzZSBpZiAodXJsIGluIGFjdGlvbnMpIHtcblx0XHRwLnBhdGggPSB1cmw7XG5cdFx0dXJsID0gYWN0aW9uc1t1cmxdO1xuXHR9XG5cdGVsc2UgaWYgKCdkZWZhdWx0JyBpbiBhY3Rpb25zKSB7XG5cdFx0dXJsID0gYWN0aW9uc1snZGVmYXVsdCddO1xuXHR9XG5cblx0Ly8gUmVkaXJlY3QgSGFuZGxlclxuXHQvLyBUaGlzIGRlZmluZXMgZm9yIHRoZSBGb3JtK0lmcmFtZStIYXNoIGhhY2sgd2hlcmUgdG8gcmV0dXJuIHRoZSByZXN1bHRzIHRvby5cblx0cC5yZWRpcmVjdF91cmkgPSBfdGhpcy5zZXR0aW5ncy5yZWRpcmVjdF91cmk7XG5cblx0Ly8gRGVmaW5lIEZvcm1hdEhhbmRsZXJcblx0Ly8gVGhlIHJlcXVlc3QgY2FuIGJlIHByb2Nlc2VkIGluIGEgbXVsdGl0dWRlIG9mIHdheXNcblx0Ly8gSGVyZSdzIHRoZSBvcHRpb25zIC0gZGVwZW5kaW5nIG9uIHRoZSBicm93c2VyIGFuZCBlbmRwb2ludFxuXHRwLnhociA9IG8ueGhyO1xuXHRwLmpzb25wID0gby5qc29ucDtcblx0cC5mb3JtID0gby5mb3JtO1xuXG5cdC8vIE1ha2UgcmVxdWVzdFxuXHRpZiAodHlwZW9mICh1cmwpID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0Ly8gRG9lcyBzZWxmIGhhdmUgaXRzIG93biBjYWxsYmFjaz9cblx0XHR1cmwocCwgZ2V0UGF0aCk7XG5cdH1cblx0ZWxzZSB7XG5cdFx0Ly8gRWxzZSB0aGUgVVJMIGlzIGEgc3RyaW5nXG5cdFx0Z2V0UGF0aCh1cmwpO1xuXHR9XG5cblx0cmV0dXJuIHByb21pc2UucHJveHk7XG5cblx0Ly8gSWYgdXJsIG5lZWRzIGEgYmFzZVxuXHQvLyBXcmFwIGV2ZXJ5dGhpbmcgaW5cblx0ZnVuY3Rpb24gZ2V0UGF0aCh1cmwpIHtcblxuXHRcdC8vIEZvcm1hdCB0aGUgc3RyaW5nIGlmIGl0IG5lZWRzIGl0XG5cdFx0dXJsID0gdXJsLnJlcGxhY2UoL1xcQFxceyhbYS16XFxfXFwtXSspKFxcfC4qPyk/XFx9L2dpLCBmdW5jdGlvbihtLCBrZXksIGRlZmF1bHRzKSB7XG5cdFx0XHR2YXIgdmFsID0gZGVmYXVsdHMgPyBkZWZhdWx0cy5yZXBsYWNlKC9eXFx8LywgJycpIDogJyc7XG5cdFx0XHRpZiAoa2V5IGluIHAucXVlcnkpIHtcblx0XHRcdFx0dmFsID0gcC5xdWVyeVtrZXldO1xuXHRcdFx0XHRkZWxldGUgcC5xdWVyeVtrZXldO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAocC5kYXRhICYmIGtleSBpbiBwLmRhdGEpIHtcblx0XHRcdFx0dmFsID0gcC5kYXRhW2tleV07XG5cdFx0XHRcdGRlbGV0ZSBwLmRhdGFba2V5XTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCFkZWZhdWx0cykge1xuXHRcdFx0XHRwcm9taXNlLnJlamVjdChlcnJvcignbWlzc2luZ19hdHRyaWJ1dGUnLCAnVGhlIGF0dHJpYnV0ZSAnICsga2V5ICsgJyBpcyBtaXNzaW5nIGZyb20gdGhlIHJlcXVlc3QnKSk7XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cblx0XHQvLyBBZGQgYmFzZVxuXHRcdGlmICghdXJsLm1hdGNoKC9eaHR0cHM/OlxcL1xcLy8pKSB7XG5cdFx0XHR1cmwgPSBvLmJhc2UgKyB1cmw7XG5cdFx0fVxuXG5cdFx0Ly8gRGVmaW5lIHRoZSByZXF1ZXN0IFVSTFxuXHRcdHAudXJsID0gdXJsO1xuXG5cdFx0Ly8gTWFrZSB0aGUgSFRUUCByZXF1ZXN0IHdpdGggdGhlIGN1cmF0ZWQgcmVxdWVzdCBvYmplY3Rcblx0XHQvLyBDQUxMQkFDSyBIQU5ETEVSXG5cdFx0Ly8gQCByZXNwb25zZSBvYmplY3Rcblx0XHQvLyBAIHN0YXR1c0NvZGUgaW50ZWdlciBpZiBhdmFpbGFibGVcblx0XHR1dGlscy5yZXF1ZXN0KHAsIGZ1bmN0aW9uKHIsIGhlYWRlcnMpIHtcblxuXHRcdFx0Ly8gSXMgdGhpcyBhIHJhdyByZXNwb25zZT9cblx0XHRcdGlmICghcC5mb3JtYXRSZXNwb25zZSkge1xuXHRcdFx0XHQvLyBCYWQgcmVxdWVzdD8gZXJyb3Igc3RhdHVzQ29kZSBvciBvdGhlcndpc2UgY29udGFpbnMgYW4gZXJyb3IgcmVzcG9uc2UgdmlzIEpTT05QP1xuXHRcdFx0XHRpZiAodHlwZW9mIGhlYWRlcnMgPT09ICdvYmplY3QnID8gKGhlYWRlcnMuc3RhdHVzQ29kZSA+PSA0MDApIDogKHR5cGVvZiByID09PSAnb2JqZWN0JyAmJiAnZXJyb3InIGluIHIpKSB7XG5cdFx0XHRcdFx0cHJvbWlzZS5yZWplY3Qocik7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0cHJvbWlzZS5mdWxmaWxsKHIpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTaG91bGQgdGhpcyBiZSBhbiBvYmplY3Rcblx0XHRcdGlmIChyID09PSB0cnVlKSB7XG5cdFx0XHRcdHIgPSB7c3VjY2Vzczp0cnVlfTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKCFyKSB7XG5cdFx0XHRcdHIgPSB7fTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gVGhlIGRlbGV0ZSBjYWxsYmFjayBuZWVkcyBhIGJldHRlciByZXNwb25zZVxuXHRcdFx0aWYgKHAubWV0aG9kID09PSAnZGVsZXRlJykge1xuXHRcdFx0XHRyID0gKCFyIHx8IHV0aWxzLmlzRW1wdHkocikpID8ge3N1Y2Nlc3M6dHJ1ZX0gOiByO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBGT1JNQVQgUkVTUE9OU0U/XG5cdFx0XHQvLyBEb2VzIHNlbGYgcmVxdWVzdCBoYXZlIGEgY29ycmVzcG9uZGluZyBmb3JtYXR0ZXJcblx0XHRcdGlmIChvLndyYXAgJiYgKChwLnBhdGggaW4gby53cmFwKSB8fCAoJ2RlZmF1bHQnIGluIG8ud3JhcCkpKSB7XG5cdFx0XHRcdHZhciB3cmFwID0gKHAucGF0aCBpbiBvLndyYXAgPyBwLnBhdGggOiAnZGVmYXVsdCcpO1xuXHRcdFx0XHR2YXIgdGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cblx0XHRcdFx0Ly8gRk9STUFUIFJFU1BPTlNFXG5cdFx0XHRcdHZhciBiID0gby53cmFwW3dyYXBdKHIsIGhlYWRlcnMsIHApO1xuXG5cdFx0XHRcdC8vIEhhcyB0aGUgcmVzcG9uc2UgYmVlbiB1dHRlcmx5IG92ZXJ3cml0dGVuP1xuXHRcdFx0XHQvLyBUeXBpY2FsbHkgc2VsZiBhdWdtZW50cyB0aGUgZXhpc3Rpbmcgb2JqZWN0Li4gYnV0IGZvciB0aG9zZSByYXJlIG9jY2Fzc2lvbnNcblx0XHRcdFx0aWYgKGIpIHtcblx0XHRcdFx0XHRyID0gYjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBJcyB0aGVyZSBhIG5leHRfcGFnZSBkZWZpbmVkIGluIHRoZSByZXNwb25zZT9cblx0XHRcdGlmIChyICYmICdwYWdpbmcnIGluIHIgJiYgci5wYWdpbmcubmV4dCkge1xuXG5cdFx0XHRcdC8vIEFkZCB0aGUgcmVsYXRpdmUgcGF0aCBpZiBpdCBpcyBtaXNzaW5nIGZyb20gdGhlIHBhZ2luZy9uZXh0IHBhdGhcblx0XHRcdFx0aWYgKHIucGFnaW5nLm5leHRbMF0gPT09ICc/Jykge1xuXHRcdFx0XHRcdHIucGFnaW5nLm5leHQgPSBwLnBhdGggKyByLnBhZ2luZy5uZXh0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gVGhlIHJlbGF0aXZlIHBhdGggaGFzIGJlZW4gZGVmaW5lZCwgbGV0cyBtYXJrdXAgdGhlIGhhbmRsZXIgaW4gdGhlIEhhc2hGcmFnbWVudFxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRyLnBhZ2luZy5uZXh0ICs9ICcjJyArIHAucGF0aDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHQvLyBEaXNwYXRjaCB0byBsaXN0ZW5lcnNcblx0XHRcdC8vIEVtaXQgZXZlbnRzIHdoaWNoIHBlcnRhaW4gdG8gdGhlIGZvcm1hdHRlZCByZXNwb25zZVxuXHRcdFx0aWYgKCFyIHx8ICdlcnJvcicgaW4gcikge1xuXHRcdFx0XHRwcm9taXNlLnJlamVjdChyKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRwcm9taXNlLmZ1bGZpbGwocik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cbn07XG5cbi8vIEFQSSB1dGlsaXRpZXNcbmhlbGxvLnV0aWxzLmV4dGVuZChoZWxsby51dGlscywge1xuXG5cdC8vIE1ha2UgYW4gSFRUUCByZXF1ZXN0XG5cdHJlcXVlc3Q6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBlcnJvciA9IF90aGlzLmVycm9yO1xuXG5cdFx0Ly8gVGhpcyBoYXMgdG8gZ28gdGhyb3VnaCBhIFBPU1QgcmVxdWVzdFxuXHRcdGlmICghX3RoaXMuaXNFbXB0eShwLmRhdGEpICYmICEoJ0ZpbGVMaXN0JyBpbiB3aW5kb3cpICYmIF90aGlzLmhhc0JpbmFyeShwLmRhdGEpKSB7XG5cblx0XHRcdC8vIERpc2FibGUgWEhSIGFuZCBKU09OUFxuXHRcdFx0cC54aHIgPSBmYWxzZTtcblx0XHRcdHAuanNvbnAgPSBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBDaGVjayBpZiB0aGUgYnJvd3NlciBhbmQgc2VydmljZSBzdXBwb3J0IENPUlNcblx0XHR2YXIgY29ycyA9IHRoaXMucmVxdWVzdF9jb3JzKGZ1bmN0aW9uKCkge1xuXHRcdFx0Ly8gSWYgaXQgZG9lcyB0aGVuIHJ1biB0aGlzLi4uXG5cdFx0XHRyZXR1cm4gKChwLnhociA9PT0gdW5kZWZpbmVkKSB8fCAocC54aHIgJiYgKHR5cGVvZiAocC54aHIpICE9PSAnZnVuY3Rpb24nIHx8IHAueGhyKHAsIHAucXVlcnkpKSkpO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGNvcnMpIHtcblxuXHRcdFx0Zm9ybWF0VXJsKHAsIGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHRcdHZhciB4ID0gX3RoaXMueGhyKHAubWV0aG9kLCB1cmwsIHAuaGVhZGVycywgcC5kYXRhLCBjYWxsYmFjayk7XG5cdFx0XHRcdHgub25wcm9ncmVzcyA9IHAub25wcm9ncmVzcyB8fCBudWxsO1xuXG5cdFx0XHRcdC8vIFdpbmRvd3MgUGhvbmUgZG9lcyBub3Qgc3VwcG9ydCB4aHIudXBsb2FkLCBzZWUgIzc0XG5cdFx0XHRcdC8vIEZlYXR1cmUgZGV0ZWN0XG5cdFx0XHRcdGlmICh4LnVwbG9hZCAmJiBwLm9udXBsb2FkcHJvZ3Jlc3MpIHtcblx0XHRcdFx0XHR4LnVwbG9hZC5vbnByb2dyZXNzID0gcC5vbnVwbG9hZHByb2dyZXNzO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Ly8gQ2xvbmUgdGhlIHF1ZXJ5IG9iamVjdFxuXHRcdC8vIEVhY2ggcmVxdWVzdCBtb2RpZmllcyB0aGUgcXVlcnkgb2JqZWN0IGFuZCBuZWVkcyB0byBiZSB0YXJlZCBhZnRlciBlYWNoIG9uZS5cblx0XHR2YXIgX3F1ZXJ5ID0gcC5xdWVyeTtcblxuXHRcdHAucXVlcnkgPSBfdGhpcy5jbG9uZShwLnF1ZXJ5KTtcblxuXHRcdC8vIEFzc2lnbiBhIG5ldyBjYWxsYmFja0lEXG5cdFx0cC5jYWxsYmFja0lEID0gX3RoaXMuZ2xvYmFsRXZlbnQoKTtcblxuXHRcdC8vIEpTT05QXG5cdFx0aWYgKHAuanNvbnAgIT09IGZhbHNlKSB7XG5cblx0XHRcdC8vIENsb25lIHRoZSBxdWVyeSBvYmplY3Rcblx0XHRcdHAucXVlcnkuY2FsbGJhY2sgPSBwLmNhbGxiYWNrSUQ7XG5cblx0XHRcdC8vIElmIHRoZSBKU09OUCBpcyBhIGZ1bmN0aW9uIHRoZW4gcnVuIGl0XG5cdFx0XHRpZiAodHlwZW9mIChwLmpzb25wKSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRwLmpzb25wKHAsIHAucXVlcnkpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBMZXRzIHVzZSBKU09OUCBpZiB0aGUgbWV0aG9kIGlzICdnZXQnXG5cdFx0XHRpZiAocC5tZXRob2QgPT09ICdnZXQnKSB7XG5cblx0XHRcdFx0Zm9ybWF0VXJsKHAsIGZ1bmN0aW9uKHVybCkge1xuXHRcdFx0XHRcdF90aGlzLmpzb25wKHVybCwgY2FsbGJhY2ssIHAuY2FsbGJhY2tJRCwgcC50aW1lb3V0KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdC8vIEl0J3Mgbm90IGNvbXBhdGlibGUgcmVzZXQgcXVlcnlcblx0XHRcdFx0cC5xdWVyeSA9IF9xdWVyeTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vIE90aGVyd2lzZSB3ZSdyZSBvbiB0byB0aGUgb2xkIHNjaG9vbCwgaWZyYW1lIGhhY2tzIGFuZCBKU09OUFxuXHRcdGlmIChwLmZvcm0gIT09IGZhbHNlKSB7XG5cblx0XHRcdC8vIEFkZCBzb21lIGFkZGl0aW9uYWwgcXVlcnkgcGFyYW1ldGVycyB0byB0aGUgVVJMXG5cdFx0XHQvLyBXZSdyZSBwcmV0dHkgc3R1ZmZlZCBpZiB0aGUgZW5kcG9pbnQgZG9lc24ndCBsaWtlIHRoZXNlXG5cdFx0XHRwLnF1ZXJ5LnJlZGlyZWN0X3VyaSA9IHAucmVkaXJlY3RfdXJpO1xuXHRcdFx0cC5xdWVyeS5zdGF0ZSA9IEpTT04uc3RyaW5naWZ5KHtjYWxsYmFjazpwLmNhbGxiYWNrSUR9KTtcblxuXHRcdFx0dmFyIG9wdHM7XG5cblx0XHRcdGlmICh0eXBlb2YgKHAuZm9ybSkgPT09ICdmdW5jdGlvbicpIHtcblxuXHRcdFx0XHQvLyBGb3JtYXQgdGhlIHJlcXVlc3Rcblx0XHRcdFx0b3B0cyA9IHAuZm9ybShwLCBwLnF1ZXJ5KTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHAubWV0aG9kID09PSAncG9zdCcgJiYgb3B0cyAhPT0gZmFsc2UpIHtcblxuXHRcdFx0XHRmb3JtYXRVcmwocCwgZnVuY3Rpb24odXJsKSB7XG5cdFx0XHRcdFx0X3RoaXMucG9zdCh1cmwsIHAuZGF0YSwgb3B0cywgY2FsbGJhY2ssIHAuY2FsbGJhY2tJRCwgcC50aW1lb3V0KTtcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIE5vbmUgb2YgdGhlIG1ldGhvZHMgd2VyZSBzdWNjZXNzZnVsIHRocm93IGFuIGVycm9yXG5cdFx0Y2FsbGJhY2soZXJyb3IoJ2ludmFsaWRfcmVxdWVzdCcsICdUaGVyZSB3YXMgbm8gbWVjaGFuaXNtIGZvciBoYW5kbGluZyB0aGlzIHJlcXVlc3QnKSk7XG5cblx0XHRyZXR1cm47XG5cblx0XHQvLyBGb3JtYXQgVVJMXG5cdFx0Ly8gQ29uc3RydWN0cyB0aGUgcmVxdWVzdCBVUkwsIG9wdGlvbmFsbHkgd3JhcHMgdGhlIFVSTCB0aHJvdWdoIGEgY2FsbCB0byBhIHByb3h5IHNlcnZlclxuXHRcdC8vIFJldHVybnMgdGhlIGZvcm1hdHRlZCBVUkxcblx0XHRmdW5jdGlvbiBmb3JtYXRVcmwocCwgY2FsbGJhY2spIHtcblxuXHRcdFx0Ly8gQXJlIHdlIHNpZ25pbmcgdGhlIHJlcXVlc3Q/XG5cdFx0XHR2YXIgc2lnbjtcblxuXHRcdFx0Ly8gT0F1dGgxXG5cdFx0XHQvLyBSZW1vdmUgdGhlIHRva2VuIGZyb20gdGhlIHF1ZXJ5IGJlZm9yZSBzaWduaW5nXG5cdFx0XHRpZiAocC5hdXRoUmVzcG9uc2UgJiYgcC5hdXRoUmVzcG9uc2Uub2F1dGggJiYgcGFyc2VJbnQocC5hdXRoUmVzcG9uc2Uub2F1dGgudmVyc2lvbiwgMTApID09PSAxKSB7XG5cblx0XHRcdFx0Ly8gT0FVVEggU0lHTklORyBQUk9YWVxuXHRcdFx0XHRzaWduID0gcC5xdWVyeS5hY2Nlc3NfdG9rZW47XG5cblx0XHRcdFx0Ly8gUmVtb3ZlIHRoZSBhY2Nlc3NfdG9rZW5cblx0XHRcdFx0ZGVsZXRlIHAucXVlcnkuYWNjZXNzX3Rva2VuO1xuXG5cdFx0XHRcdC8vIEVuZm9yZSB1c2Ugb2YgUHJveHlcblx0XHRcdFx0cC5wcm94eSA9IHRydWU7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFBPU1QgYm9keSB0byBxdWVyeXN0cmluZ1xuXHRcdFx0aWYgKHAuZGF0YSAmJiAocC5tZXRob2QgPT09ICdnZXQnIHx8IHAubWV0aG9kID09PSAnZGVsZXRlJykpIHtcblx0XHRcdFx0Ly8gQXR0YWNoIHRoZSBwLmRhdGEgdG8gdGhlIHF1ZXJ5c3RyaW5nLlxuXHRcdFx0XHRfdGhpcy5leHRlbmQocC5xdWVyeSwgcC5kYXRhKTtcblx0XHRcdFx0cC5kYXRhID0gbnVsbDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gQ29uc3RydWN0IHRoZSBwYXRoXG5cdFx0XHR2YXIgcGF0aCA9IF90aGlzLnFzKHAudXJsLCBwLnF1ZXJ5KTtcblxuXHRcdFx0Ly8gUHJveHkgdGhlIHJlcXVlc3QgdGhyb3VnaCBhIHNlcnZlclxuXHRcdFx0Ly8gVXNlZCBmb3Igc2lnbmluZyBPQXV0aDFcblx0XHRcdC8vIEFuZCBjaXJjdW12ZW50aW5nIHNlcnZpY2VzIHdpdGhvdXQgQWNjZXNzLUNvbnRyb2wgSGVhZGVyc1xuXHRcdFx0aWYgKHAucHJveHkpIHtcblx0XHRcdFx0Ly8gVXNlIHRoZSBwcm94eSBhcyBhIHBhdGhcblx0XHRcdFx0cGF0aCA9IF90aGlzLnFzKHAub2F1dGhfcHJveHksIHtcblx0XHRcdFx0XHRwYXRoOiBwYXRoLFxuXHRcdFx0XHRcdGFjY2Vzc190b2tlbjogc2lnbiB8fCAnJyxcblxuXHRcdFx0XHRcdC8vIFRoaXMgd2lsbCBwcm9tcHQgdGhlIHJlcXVlc3QgdG8gYmUgc2lnbmVkIGFzIHRob3VnaCBpdCBpcyBPQXV0aDFcblx0XHRcdFx0XHR0aGVuOiBwLnByb3h5X3Jlc3BvbnNlX3R5cGUgfHwgKHAubWV0aG9kLnRvTG93ZXJDYXNlKCkgPT09ICdnZXQnID8gJ3JlZGlyZWN0JyA6ICdwcm94eScpLFxuXHRcdFx0XHRcdG1ldGhvZDogcC5tZXRob2QudG9Mb3dlckNhc2UoKSxcblx0XHRcdFx0XHRzdXBwcmVzc19yZXNwb25zZV9jb2RlczogdHJ1ZVxuXHRcdFx0XHR9KTtcblx0XHRcdH1cblxuXHRcdFx0Y2FsbGJhY2socGF0aCk7XG5cdFx0fVxuXHR9LFxuXG5cdC8vIFRlc3Qgd2hldGhlciB0aGUgYnJvd3NlciBzdXBwb3J0cyB0aGUgQ09SUyByZXNwb25zZVxuXHRyZXF1ZXN0X2NvcnM6IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG5cdFx0cmV0dXJuICd3aXRoQ3JlZGVudGlhbHMnIGluIG5ldyBYTUxIdHRwUmVxdWVzdCgpICYmIGNhbGxiYWNrKCk7XG5cdH0sXG5cblx0Ly8gUmV0dXJuIHRoZSB0eXBlIG9mIERPTSBvYmplY3Rcblx0ZG9tSW5zdGFuY2U6IGZ1bmN0aW9uKHR5cGUsIGRhdGEpIHtcblx0XHR2YXIgdGVzdCA9ICdIVE1MJyArICh0eXBlIHx8ICcnKS5yZXBsYWNlKFxuXHRcdFx0L15bYS16XS8sXG5cdFx0XHRmdW5jdGlvbihtKSB7XG5cdFx0XHRcdHJldHVybiBtLnRvVXBwZXJDYXNlKCk7XG5cdFx0XHR9XG5cblx0XHQpICsgJ0VsZW1lbnQnO1xuXG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0aWYgKHdpbmRvd1t0ZXN0XSkge1xuXHRcdFx0cmV0dXJuIGRhdGEgaW5zdGFuY2VvZiB3aW5kb3dbdGVzdF07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKHdpbmRvdy5FbGVtZW50KSB7XG5cdFx0XHRyZXR1cm4gZGF0YSBpbnN0YW5jZW9mIHdpbmRvdy5FbGVtZW50ICYmICghdHlwZSB8fCAoZGF0YS50YWdOYW1lICYmIGRhdGEudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0eXBlKSk7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0cmV0dXJuICghKGRhdGEgaW5zdGFuY2VvZiBPYmplY3QgfHwgZGF0YSBpbnN0YW5jZW9mIEFycmF5IHx8IGRhdGEgaW5zdGFuY2VvZiBTdHJpbmcgfHwgZGF0YSBpbnN0YW5jZW9mIE51bWJlcikgJiYgZGF0YS50YWdOYW1lICYmIGRhdGEudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSB0eXBlKTtcblx0XHR9XG5cdH0sXG5cblx0Ly8gQ3JlYXRlIGEgY2xvbmUgb2YgYW4gb2JqZWN0XG5cdGNsb25lOiBmdW5jdGlvbihvYmopIHtcblx0XHQvLyBEb2VzIG5vdCBjbG9uZSBET00gZWxlbWVudHMsIG5vciBCaW5hcnkgZGF0YSwgZS5nLiBCbG9icywgRmlsZWxpc3RzXG5cdFx0aWYgKG9iaiA9PT0gbnVsbCB8fCB0eXBlb2YgKG9iaikgIT09ICdvYmplY3QnIHx8IG9iaiBpbnN0YW5jZW9mIERhdGUgfHwgJ25vZGVOYW1lJyBpbiBvYmogfHwgdGhpcy5pc0JpbmFyeShvYmopKSB7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblxuXHRcdGlmIChBcnJheS5pc0FycmF5KG9iaikpIHtcblx0XHRcdC8vIENsb25lIGVhY2ggaXRlbSBpbiB0aGUgYXJyYXlcblx0XHRcdHJldHVybiBvYmoubWFwKHRoaXMuY2xvbmUuYmluZCh0aGlzKSk7XG5cdFx0fVxuXG5cdFx0Ly8gQnV0IGRvZXMgY2xvbmUgZXZlcnl0aGluZyBlbHNlLlxuXHRcdHZhciBjbG9uZSA9IHt9O1xuXHRcdGZvciAodmFyIHggaW4gb2JqKSB7XG5cdFx0XHRjbG9uZVt4XSA9IHRoaXMuY2xvbmUob2JqW3hdKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gY2xvbmU7XG5cdH0sXG5cblx0Ly8gWEhSOiB1c2VzIENPUlMgdG8gbWFrZSByZXF1ZXN0c1xuXHR4aHI6IGZ1bmN0aW9uKG1ldGhvZCwgdXJsLCBoZWFkZXJzLCBkYXRhLCBjYWxsYmFjaykge1xuXG5cdFx0dmFyIHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHR2YXIgZXJyb3IgPSB0aGlzLmVycm9yO1xuXG5cdFx0Ly8gQmluYXJ5P1xuXHRcdHZhciBiaW5hcnkgPSBmYWxzZTtcblx0XHRpZiAobWV0aG9kID09PSAnYmxvYicpIHtcblx0XHRcdGJpbmFyeSA9IG1ldGhvZDtcblx0XHRcdG1ldGhvZCA9ICdHRVQnO1xuXHRcdH1cblxuXHRcdG1ldGhvZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpO1xuXG5cdFx0Ly8gWGhyLnJlc3BvbnNlVHlwZSAnanNvbicgaXMgbm90IHN1cHBvcnRlZCBpbiBhbnkgb2YgdGhlIHZlbmRvcnMgeWV0LlxuXHRcdHIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIGpzb24gPSByLnJlc3BvbnNlO1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0anNvbiA9IEpTT04ucGFyc2Uoci5yZXNwb25zZVRleHQpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKF9lKSB7XG5cdFx0XHRcdGlmIChyLnN0YXR1cyA9PT0gNDAxKSB7XG5cdFx0XHRcdFx0anNvbiA9IGVycm9yKCdhY2Nlc3NfZGVuaWVkJywgci5zdGF0dXNUZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR2YXIgaGVhZGVycyA9IGhlYWRlcnNUb0pTT04oci5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSk7XG5cdFx0XHRoZWFkZXJzLnN0YXR1c0NvZGUgPSByLnN0YXR1cztcblxuXHRcdFx0Y2FsbGJhY2soanNvbiB8fCAobWV0aG9kID09PSAnR0VUJyA/IGVycm9yKCdlbXB0eV9yZXNwb25zZScsICdDb3VsZCBub3QgZ2V0IHJlc291cmNlJykgOiB7fSksIGhlYWRlcnMpO1xuXHRcdH07XG5cblx0XHRyLm9uZXJyb3IgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIganNvbiA9IHIucmVzcG9uc2VUZXh0O1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0anNvbiA9IEpTT04ucGFyc2Uoci5yZXNwb25zZVRleHQpO1xuXHRcdFx0fVxuXHRcdFx0Y2F0Y2ggKF9lKSB7fVxuXG5cdFx0XHRjYWxsYmFjayhqc29uIHx8IGVycm9yKCdhY2Nlc3NfZGVuaWVkJywgJ0NvdWxkIG5vdCBnZXQgcmVzb3VyY2UnKSk7XG5cdFx0fTtcblxuXHRcdHZhciB4O1xuXG5cdFx0Ly8gU2hvdWxkIHdlIGFkZCB0aGUgcXVlcnkgdG8gdGhlIFVSTD9cblx0XHRpZiAobWV0aG9kID09PSAnR0VUJyB8fCBtZXRob2QgPT09ICdERUxFVEUnKSB7XG5cdFx0XHRkYXRhID0gbnVsbDtcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZGF0YSAmJiB0eXBlb2YgKGRhdGEpICE9PSAnc3RyaW5nJyAmJiAhKGRhdGEgaW5zdGFuY2VvZiBGb3JtRGF0YSkgJiYgIShkYXRhIGluc3RhbmNlb2YgRmlsZSkgJiYgIShkYXRhIGluc3RhbmNlb2YgQmxvYikpIHtcblx0XHRcdC8vIExvb3AgdGhyb3VnaCBhbmQgYWRkIGZvcm1EYXRhXG5cdFx0XHR2YXIgZiA9IG5ldyBGb3JtRGF0YSgpO1xuXHRcdFx0Zm9yICh4IGluIGRhdGEpIGlmIChkYXRhLmhhc093blByb3BlcnR5KHgpKSB7XG5cdFx0XHRcdGlmIChkYXRhW3hdIGluc3RhbmNlb2YgSFRNTElucHV0RWxlbWVudCkge1xuXHRcdFx0XHRcdGlmICgnZmlsZXMnIGluIGRhdGFbeF0gJiYgZGF0YVt4XS5maWxlcy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRmLmFwcGVuZCh4LCBkYXRhW3hdLmZpbGVzWzBdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZSBpZiAoZGF0YVt4XSBpbnN0YW5jZW9mIEJsb2IpIHtcblx0XHRcdFx0XHRmLmFwcGVuZCh4LCBkYXRhW3hdLCBkYXRhLm5hbWUpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdGYuYXBwZW5kKHgsIGRhdGFbeF0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGRhdGEgPSBmO1xuXHRcdH1cblxuXHRcdC8vIE9wZW4gdGhlIHBhdGgsIGFzeW5jXG5cdFx0ci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKTtcblxuXHRcdGlmIChiaW5hcnkpIHtcblx0XHRcdGlmICgncmVzcG9uc2VUeXBlJyBpbiByKSB7XG5cdFx0XHRcdHIucmVzcG9uc2VUeXBlID0gYmluYXJ5O1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdHIub3ZlcnJpZGVNaW1lVHlwZSgndGV4dC9wbGFpbjsgY2hhcnNldD14LXVzZXItZGVmaW5lZCcpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdC8vIFNldCBhbnkgYmVzcG9rZSBoZWFkZXJzXG5cdFx0aWYgKGhlYWRlcnMpIHtcblx0XHRcdGZvciAoeCBpbiBoZWFkZXJzKSB7XG5cdFx0XHRcdHIuc2V0UmVxdWVzdEhlYWRlcih4LCBoZWFkZXJzW3hdKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyLnNlbmQoZGF0YSk7XG5cblx0XHRyZXR1cm4gcjtcblxuXHRcdC8vIEhlYWRlcnMgYXJlIHJldHVybmVkIGFzIGEgc3RyaW5nXG5cdFx0ZnVuY3Rpb24gaGVhZGVyc1RvSlNPTihzKSB7XG5cdFx0XHR2YXIgciA9IHt9O1xuXHRcdFx0dmFyIHJlZyA9IC8oW2EtelxcLV0rKTpcXHM/KC4qKTs/L2dpO1xuXHRcdFx0dmFyIG07XG5cdFx0XHR3aGlsZSAoKG0gPSByZWcuZXhlYyhzKSkpIHtcblx0XHRcdFx0clttWzFdXSA9IG1bMl07XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiByO1xuXHRcdH1cblx0fSxcblxuXHQvLyBKU09OUFxuXHQvLyBJbmplY3RzIGEgc2NyaXB0IHRhZyBpbnRvIHRoZSBET00gdG8gYmUgZXhlY3V0ZWQgYW5kIGFwcGVuZHMgYSBjYWxsYmFjayBmdW5jdGlvbiB0byB0aGUgd2luZG93IG9iamVjdFxuXHQvLyBAcGFyYW0gc3RyaW5nL2Z1bmN0aW9uIHBhdGhGdW5jIGVpdGhlciBhIHN0cmluZyBvZiB0aGUgVVJMIG9yIGEgY2FsbGJhY2sgZnVuY3Rpb24gcGF0aEZ1bmMocXVlcnlzdHJpbmdoYXNoLCBjb250aW51ZUZ1bmMpO1xuXHQvLyBAcGFyYW0gZnVuY3Rpb24gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIG9uIGNvbXBsZXRpb247XG5cdGpzb25wOiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBjYWxsYmFja0lELCB0aW1lb3V0KSB7XG5cblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBlcnJvciA9IF90aGlzLmVycm9yO1xuXG5cdFx0Ly8gQ2hhbmdlIHRoZSBuYW1lIG9mIHRoZSBjYWxsYmFja1xuXHRcdHZhciBib29sID0gMDtcblx0XHR2YXIgaGVhZCA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG5cdFx0dmFyIG9wZXJhRml4O1xuXHRcdHZhciByZXN1bHQgPSBlcnJvcignc2VydmVyX2Vycm9yJywgJ3NlcnZlcl9lcnJvcicpO1xuXHRcdHZhciBjYiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKCEoYm9vbCsrKSkge1xuXHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRjYWxsYmFjayhyZXN1bHQpO1xuXHRcdFx0XHRcdGhlYWQucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblx0XHRcdFx0fSwgMCk7XG5cdFx0XHR9XG5cblx0XHR9O1xuXG5cdFx0Ly8gQWRkIGNhbGxiYWNrIHRvIHRoZSB3aW5kb3cgb2JqZWN0XG5cdFx0Y2FsbGJhY2tJRCA9IF90aGlzLmdsb2JhbEV2ZW50KGZ1bmN0aW9uKGpzb24pIHtcblx0XHRcdHJlc3VsdCA9IGpzb247XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblxuXHRcdFx0Ly8gTWFyayBjYWxsYmFjayBhcyBkb25lXG5cdFx0fSwgY2FsbGJhY2tJRCk7XG5cblx0XHQvLyBUaGUgVVJMIGlzIGEgZnVuY3Rpb24gZm9yIHNvbWUgY2FzZXMgYW5kIGFzIHN1Y2hcblx0XHQvLyBEZXRlcm1pbmUgaXRzIHZhbHVlIHdpdGggYSBjYWxsYmFjayBjb250YWluaW5nIHRoZSBuZXcgcGFyYW1ldGVycyBvZiB0aGlzIGZ1bmN0aW9uLlxuXHRcdHVybCA9IHVybC5yZXBsYWNlKG5ldyBSZWdFeHAoJz1cXFxcPygmfCQpJyksICc9JyArIGNhbGxiYWNrSUQgKyAnJDEnKTtcblxuXHRcdC8vIEJ1aWxkIHNjcmlwdCB0YWdcblx0XHR2YXIgc2NyaXB0ID0gX3RoaXMuYXBwZW5kKCdzY3JpcHQnLCB7XG5cdFx0XHRpZDogY2FsbGJhY2tJRCxcblx0XHRcdG5hbWU6IGNhbGxiYWNrSUQsXG5cdFx0XHRzcmM6IHVybCxcblx0XHRcdGFzeW5jOiB0cnVlLFxuXHRcdFx0b25sb2FkOiBjYixcblx0XHRcdG9uZXJyb3I6IGNiLFxuXHRcdFx0b25yZWFkeXN0YXRlY2hhbmdlOiBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKC9sb2FkZWR8Y29tcGxldGUvaS50ZXN0KHRoaXMucmVhZHlTdGF0ZSkpIHtcblx0XHRcdFx0XHRjYigpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHQvLyBPcGVyYSBmaXggZXJyb3Jcblx0XHQvLyBQcm9ibGVtOiBJZiBhbiBlcnJvciBvY2N1cnMgd2l0aCBzY3JpcHQgbG9hZGluZyBPcGVyYSBmYWlscyB0byB0cmlnZ2VyIHRoZSBzY3JpcHQub25lcnJvciBoYW5kbGVyIHdlIHNwZWNpZmllZFxuXHRcdC8vXG5cdFx0Ly8gRml4OlxuXHRcdC8vIEJ5IHNldHRpbmcgdGhlIHJlcXVlc3QgdG8gc3luY2hyb25vdXMgd2UgY2FuIHRyaWdnZXIgdGhlIGVycm9yIGhhbmRsZXIgd2hlbiBhbGwgZWxzZSBmYWlscy5cblx0XHQvLyBUaGlzIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQgaWYgd2UndmUgYWxyZWFkeSBjYWxsZWQgdGhlIGNhbGxiYWNrIGhhbmRsZXIgXCJjYlwiIHdpdGggYSBzdWNjZXNzZnVsIG9ubG9hZCBldmVudFxuXHRcdGlmICh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpLmluZGV4T2YoJ29wZXJhJykgPiAtMSkge1xuXHRcdFx0b3BlcmFGaXggPSBfdGhpcy5hcHBlbmQoJ3NjcmlwdCcsIHtcblx0XHRcdFx0dGV4dDogJ2RvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxcJycgKyBjYWxsYmFja0lEICsgJ1xcJykub25lcnJvcigpOydcblx0XHRcdH0pO1xuXHRcdFx0c2NyaXB0LmFzeW5jID0gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIHRpbWVvdXRcblx0XHRpZiAodGltZW91dCkge1xuXHRcdFx0d2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJlc3VsdCA9IGVycm9yKCd0aW1lb3V0JywgJ3RpbWVvdXQnKTtcblx0XHRcdFx0Y2IoKTtcblx0XHRcdH0sIHRpbWVvdXQpO1xuXHRcdH1cblxuXHRcdC8vIFRPRE86IGFkZCBmaXggZm9yIElFLFxuXHRcdC8vIEhvd2V2ZXI6IHVuYWJsZSByZWNyZWF0ZSB0aGUgYnVnIG9mIGZpcmluZyBvZmYgdGhlIG9ucmVhZHlzdGF0ZWNoYW5nZSBiZWZvcmUgdGhlIHNjcmlwdCBjb250ZW50IGhhcyBiZWVuIGV4ZWN1dGVkIGFuZCB0aGUgdmFsdWUgb2YgXCJyZXN1bHRcIiBoYXMgYmVlbiBkZWZpbmVkLlxuXHRcdC8vIEluamVjdCBzY3JpcHQgdGFnIGludG8gdGhlIGhlYWQgZWxlbWVudFxuXHRcdGhlYWQuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcblxuXHRcdC8vIEFwcGVuZCBPcGVyYSBGaXggdG8gcnVuIGFmdGVyIG91ciBzY3JpcHRcblx0XHRpZiAob3BlcmFGaXgpIHtcblx0XHRcdGhlYWQuYXBwZW5kQ2hpbGQob3BlcmFGaXgpO1xuXHRcdH1cblx0fSxcblxuXHQvLyBQb3N0XG5cdC8vIFNlbmQgaW5mb3JtYXRpb24gdG8gYSByZW1vdGUgbG9jYXRpb24gdXNpbmcgdGhlIHBvc3QgbWVjaGFuaXNtXG5cdC8vIEBwYXJhbSBzdHJpbmcgdXJpIHBhdGhcblx0Ly8gQHBhcmFtIG9iamVjdCBkYXRhLCBrZXkgdmFsdWUgZGF0YSB0byBzZW5kXG5cdC8vIEBwYXJhbSBmdW5jdGlvbiBjYWxsYmFjaywgZnVuY3Rpb24gdG8gZXhlY3V0ZSBpbiByZXNwb25zZVxuXHRwb3N0OiBmdW5jdGlvbih1cmwsIGRhdGEsIG9wdGlvbnMsIGNhbGxiYWNrLCBjYWxsYmFja0lELCB0aW1lb3V0KSB7XG5cblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdHZhciBlcnJvciA9IF90aGlzLmVycm9yO1xuXHRcdHZhciBkb2MgPSBkb2N1bWVudDtcblxuXHRcdC8vIFRoaXMgaGFjayBuZWVkcyBhIGZvcm1cblx0XHR2YXIgZm9ybSA9IG51bGw7XG5cdFx0dmFyIHJlZW5hYmxlQWZ0ZXJTdWJtaXQgPSBbXTtcblx0XHR2YXIgbmV3Zm9ybTtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIHggPSBudWxsO1xuXHRcdHZhciBib29sID0gMDtcblx0XHR2YXIgY2IgPSBmdW5jdGlvbihyKSB7XG5cdFx0XHRpZiAoIShib29sKyspKSB7XG5cdFx0XHRcdGNhbGxiYWNrKHIpO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHQvLyBXaGF0IGlzIHRoZSBuYW1lIG9mIHRoZSBjYWxsYmFjayB0byBjb250YWluXG5cdFx0Ly8gV2UnbGwgYWxzbyB1c2UgdGhpcyB0byBuYW1lIHRoZSBpZnJhbWVcblx0XHRfdGhpcy5nbG9iYWxFdmVudChjYiwgY2FsbGJhY2tJRCk7XG5cblx0XHQvLyBCdWlsZCB0aGUgaWZyYW1lIHdpbmRvd1xuXHRcdHZhciB3aW47XG5cdFx0dHJ5IHtcblx0XHRcdC8vIElFNyBoYWNrLCBvbmx5IGxldHMgdXMgZGVmaW5lIHRoZSBuYW1lIGhlcmUsIG5vdCBsYXRlci5cblx0XHRcdHdpbiA9IGRvYy5jcmVhdGVFbGVtZW50KCc8aWZyYW1lIG5hbWU9XCInICsgY2FsbGJhY2tJRCArICdcIj4nKTtcblx0XHR9XG5cdFx0Y2F0Y2ggKGUpIHtcblx0XHRcdHdpbiA9IGRvYy5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcblx0XHR9XG5cblx0XHR3aW4ubmFtZSA9IGNhbGxiYWNrSUQ7XG5cdFx0d2luLmlkID0gY2FsbGJhY2tJRDtcblx0XHR3aW4uc3R5bGUuZGlzcGxheSA9ICdub25lJztcblxuXHRcdC8vIE92ZXJyaWRlIGNhbGxiYWNrIG1lY2hhbmlzbS4gVHJpZ2dnZXIgYSByZXNwb25zZSBvbmxvYWQvb25lcnJvclxuXHRcdGlmIChvcHRpb25zICYmIG9wdGlvbnMuY2FsbGJhY2tvbmxvYWQpIHtcblx0XHRcdC8vIE9ubG9hZCBpcyBiZWluZyBmaXJlZCB0d2ljZVxuXHRcdFx0d2luLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRjYih7XG5cdFx0XHRcdFx0cmVzcG9uc2U6ICdwb3N0ZWQnLFxuXHRcdFx0XHRcdG1lc3NhZ2U6ICdDb250ZW50IHdhcyBwb3N0ZWQnXG5cdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAodGltZW91dCkge1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0Y2IoZXJyb3IoJ3RpbWVvdXQnLCAnVGhlIHBvc3Qgb3BlcmF0aW9uIHRpbWVkIG91dCcpKTtcblx0XHRcdH0sIHRpbWVvdXQpO1xuXHRcdH1cblxuXHRcdGRvYy5ib2R5LmFwcGVuZENoaWxkKHdpbik7XG5cblx0XHQvLyBJZiB3ZSBhcmUganVzdCBwb3N0aW5nIGEgc2luZ2xlIGl0ZW1cblx0XHRpZiAoX3RoaXMuZG9tSW5zdGFuY2UoJ2Zvcm0nLCBkYXRhKSkge1xuXHRcdFx0Ly8gR2V0IHRoZSBwYXJlbnQgZm9ybVxuXHRcdFx0Zm9ybSA9IGRhdGEuZm9ybTtcblxuXHRcdFx0Ly8gTG9vcCB0aHJvdWdoIGFuZCBkaXNhYmxlIGFsbCBvZiBpdHMgc2libGluZ3Ncblx0XHRcdGZvciAoaSA9IDA7IGkgPCBmb3JtLmVsZW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChmb3JtLmVsZW1lbnRzW2ldICE9PSBkYXRhKSB7XG5cdFx0XHRcdFx0Zm9ybS5lbGVtZW50c1tpXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgdHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gTW92ZSB0aGUgZm9jdXMgdG8gdGhlIGZvcm1cblx0XHRcdGRhdGEgPSBmb3JtO1xuXHRcdH1cblxuXHRcdC8vIFBvc3RpbmcgYSBmb3JtXG5cdFx0aWYgKF90aGlzLmRvbUluc3RhbmNlKCdmb3JtJywgZGF0YSkpIHtcblx0XHRcdC8vIFRoaXMgaXMgYSBmb3JtIGVsZW1lbnRcblx0XHRcdGZvcm0gPSBkYXRhO1xuXG5cdFx0XHQvLyBEb2VzIHRoaXMgZm9ybSBuZWVkIHRvIGJlIGEgbXVsdGlwYXJ0IGZvcm0/XG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgZm9ybS5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAoIWZvcm0uZWxlbWVudHNbaV0uZGlzYWJsZWQgJiYgZm9ybS5lbGVtZW50c1tpXS50eXBlID09PSAnZmlsZScpIHtcblx0XHRcdFx0XHRmb3JtLmVuY29kaW5nID0gZm9ybS5lbmN0eXBlID0gJ211bHRpcGFydC9mb3JtLWRhdGEnO1xuXHRcdFx0XHRcdGZvcm0uZWxlbWVudHNbaV0uc2V0QXR0cmlidXRlKCduYW1lJywgJ2ZpbGUnKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbHNlIHtcblx0XHRcdC8vIEl0cyBub3QgYSBmb3JtIGVsZW1lbnQsXG5cdFx0XHQvLyBUaGVyZWZvcmUgaXQgbXVzdCBiZSBhIEpTT04gb2JqZWN0IG9mIEtleT0+VmFsdWUgb3IgS2V5PT5FbGVtZW50XG5cdFx0XHQvLyBJZiBhbnlvbmUgb2YgdGhvc2UgdmFsdWVzIGFyZSBhIGlucHV0IHR5cGU9ZmlsZSB3ZSBzaGFsbCBzaGFsbCBpbnNlcnQgaXRzIHNpYmxpbmdzIGludG8gdGhlIGZvcm0gZm9yIHdoaWNoIGl0IGJlbG9uZ3MuXG5cdFx0XHRmb3IgKHggaW4gZGF0YSkgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoeCkpIHtcblx0XHRcdFx0Ly8gSXMgdGhpcyBhbiBpbnB1dCBFbGVtZW50P1xuXHRcdFx0XHRpZiAoX3RoaXMuZG9tSW5zdGFuY2UoJ2lucHV0JywgZGF0YVt4XSkgJiYgZGF0YVt4XS50eXBlID09PSAnZmlsZScpIHtcblx0XHRcdFx0XHRmb3JtID0gZGF0YVt4XS5mb3JtO1xuXHRcdFx0XHRcdGZvcm0uZW5jb2RpbmcgPSBmb3JtLmVuY3R5cGUgPSAnbXVsdGlwYXJ0L2Zvcm0tZGF0YSc7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRG8gSWYgdGhlcmUgaXMgbm8gZGVmaW5lZCBmb3JtIGVsZW1lbnQsIGxldHMgY3JlYXRlIG9uZS5cblx0XHRcdGlmICghZm9ybSkge1xuXHRcdFx0XHQvLyBCdWlsZCBmb3JtXG5cdFx0XHRcdGZvcm0gPSBkb2MuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuXHRcdFx0XHRkb2MuYm9keS5hcHBlbmRDaGlsZChmb3JtKTtcblx0XHRcdFx0bmV3Zm9ybSA9IGZvcm07XG5cdFx0XHR9XG5cblx0XHRcdHZhciBpbnB1dDtcblxuXHRcdFx0Ly8gQWRkIGVsZW1lbnRzIHRvIHRoZSBmb3JtIGlmIHRoZXkgZG9udCBleGlzdFxuXHRcdFx0Zm9yICh4IGluIGRhdGEpIGlmIChkYXRhLmhhc093blByb3BlcnR5KHgpKSB7XG5cblx0XHRcdFx0Ly8gSXMgdGhpcyBhbiBlbGVtZW50P1xuXHRcdFx0XHR2YXIgZWwgPSAoX3RoaXMuZG9tSW5zdGFuY2UoJ2lucHV0JywgZGF0YVt4XSkgfHwgX3RoaXMuZG9tSW5zdGFuY2UoJ3RleHRBcmVhJywgZGF0YVt4XSkgfHwgX3RoaXMuZG9tSW5zdGFuY2UoJ3NlbGVjdCcsIGRhdGFbeF0pKTtcblxuXHRcdFx0XHQvLyBJcyB0aGlzIG5vdCBhbiBpbnB1dCBlbGVtZW50LCBvciBvbmUgdGhhdCBleGlzdHMgb3V0c2lkZSB0aGUgZm9ybS5cblx0XHRcdFx0aWYgKCFlbCB8fCBkYXRhW3hdLmZvcm0gIT09IGZvcm0pIHtcblxuXHRcdFx0XHRcdC8vIERvZXMgYW4gZWxlbWVudCBoYXZlIHRoZSBzYW1lIG5hbWU/XG5cdFx0XHRcdFx0dmFyIGlucHV0cyA9IGZvcm0uZWxlbWVudHNbeF07XG5cdFx0XHRcdFx0aWYgKGlucHV0KSB7XG5cdFx0XHRcdFx0XHQvLyBSZW1vdmUgaXQuXG5cdFx0XHRcdFx0XHRpZiAoIShpbnB1dHMgaW5zdGFuY2VvZiBOb2RlTGlzdCkpIHtcblx0XHRcdFx0XHRcdFx0aW5wdXRzID0gW2lucHV0c107XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGZvciAoaSA9IDA7IGkgPCBpbnB1dHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRcdFx0aW5wdXRzW2ldLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoaW5wdXRzW2ldKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIENyZWF0ZSBhbiBpbnB1dCBlbGVtZW50XG5cdFx0XHRcdFx0aW5wdXQgPSBkb2MuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblx0XHRcdFx0XHRpbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAnaGlkZGVuJyk7XG5cdFx0XHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywgeCk7XG5cblx0XHRcdFx0XHQvLyBEb2VzIGl0IGhhdmUgYSB2YWx1ZSBhdHRyaWJ1dGU/XG5cdFx0XHRcdFx0aWYgKGVsKSB7XG5cdFx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IGRhdGFbeF0udmFsdWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKF90aGlzLmRvbUluc3RhbmNlKG51bGwsIGRhdGFbeF0pKSB7XG5cdFx0XHRcdFx0XHRpbnB1dC52YWx1ZSA9IGRhdGFbeF0uaW5uZXJIVE1MIHx8IGRhdGFbeF0uaW5uZXJUZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdGlucHV0LnZhbHVlID0gZGF0YVt4XTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRmb3JtLmFwcGVuZENoaWxkKGlucHV0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIEl0IGlzIGFuIGVsZW1lbnQsIHdoaWNoIGV4aXN0cyB3aXRoaW4gdGhlIGZvcm0sIGJ1dCB0aGUgbmFtZSBpcyB3cm9uZ1xuXHRcdFx0XHRlbHNlIGlmIChlbCAmJiBkYXRhW3hdLm5hbWUgIT09IHgpIHtcblx0XHRcdFx0XHRkYXRhW3hdLnNldEF0dHJpYnV0ZSgnbmFtZScsIHgpO1xuXHRcdFx0XHRcdGRhdGFbeF0ubmFtZSA9IHg7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Ly8gRGlzYWJsZSBlbGVtZW50cyBmcm9tIHdpdGhpbiB0aGUgZm9ybSBpZiB0aGV5IHdlcmVuJ3Qgc3BlY2lmaWVkXG5cdFx0XHRmb3IgKGkgPSAwOyBpIDwgZm9ybS5lbGVtZW50cy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHRcdGlucHV0ID0gZm9ybS5lbGVtZW50c1tpXTtcblxuXHRcdFx0XHQvLyBEb2VzIHRoZSBzYW1lIG5hbWUgYW5kIHZhbHVlIGV4aXN0IGluIHRoZSBwYXJlbnRcblx0XHRcdFx0aWYgKCEoaW5wdXQubmFtZSBpbiBkYXRhKSAmJiBpbnB1dC5nZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJykgIT09IHRydWUpIHtcblx0XHRcdFx0XHQvLyBEaXNhYmxlXG5cdFx0XHRcdFx0aW5wdXQuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsIHRydWUpO1xuXG5cdFx0XHRcdFx0Ly8gQWRkIHJlLWVuYWJsZSB0byBjYWxsYmFja1xuXHRcdFx0XHRcdHJlZW5hYmxlQWZ0ZXJTdWJtaXQucHVzaChpbnB1dCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cblx0XHQvLyBTZXQgdGhlIHRhcmdldCBvZiB0aGUgZm9ybVxuXHRcdGZvcm0uc2V0QXR0cmlidXRlKCdtZXRob2QnLCAnUE9TVCcpO1xuXHRcdGZvcm0uc2V0QXR0cmlidXRlKCd0YXJnZXQnLCBjYWxsYmFja0lEKTtcblx0XHRmb3JtLnRhcmdldCA9IGNhbGxiYWNrSUQ7XG5cblx0XHQvLyBVcGRhdGUgdGhlIGZvcm0gVVJMXG5cdFx0Zm9ybS5zZXRBdHRyaWJ1dGUoJ2FjdGlvbicsIHVybCk7XG5cblx0XHQvLyBTdWJtaXQgdGhlIGZvcm1cblx0XHQvLyBTb21lIHJlYXNvbiB0aGlzIG5lZWRzIHRvIGJlIG9mZnNldCBmcm9tIHRoZSBjdXJyZW50IHdpbmRvdyBleGVjdXRpb25cblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0Zm9ybS5zdWJtaXQoKTtcblxuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHQvLyBSZW1vdmUgdGhlIGlmcmFtZSBmcm9tIHRoZSBwYWdlLlxuXHRcdFx0XHRcdC8vd2luLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2luKTtcblx0XHRcdFx0XHQvLyBSZW1vdmUgdGhlIGZvcm1cblx0XHRcdFx0XHRpZiAobmV3Zm9ybSkge1xuXHRcdFx0XHRcdFx0bmV3Zm9ybS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKG5ld2Zvcm0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRjb25zb2xlLmVycm9yKCdIZWxsb0pTOiBjb3VsZCBub3QgcmVtb3ZlIGlmcmFtZScpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjYXRjaCAoZWUpIHt9XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBSZWVuYWJsZSB0aGUgZGlzYWJsZWQgZm9ybVxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHJlZW5hYmxlQWZ0ZXJTdWJtaXQubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0XHRpZiAocmVlbmFibGVBZnRlclN1Ym1pdFtpXSkge1xuXHRcdFx0XHRcdFx0cmVlbmFibGVBZnRlclN1Ym1pdFtpXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywgZmFsc2UpO1xuXHRcdFx0XHRcdFx0cmVlbmFibGVBZnRlclN1Ym1pdFtpXS5kaXNhYmxlZCA9IGZhbHNlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fSwgMCk7XG5cdFx0fSwgMTAwKTtcblx0fSxcblxuXHQvLyBTb21lIG9mIHRoZSBwcm92aWRlcnMgcmVxdWlyZSB0aGF0IG9ubHkgbXVsdGlwYXJ0IGlzIHVzZWQgd2l0aCBub24tYmluYXJ5IGZvcm1zLlxuXHQvLyBUaGlzIGZ1bmN0aW9uIGNoZWNrcyB3aGV0aGVyIHRoZSBmb3JtIGNvbnRhaW5zIGJpbmFyeSBkYXRhXG5cdGhhc0JpbmFyeTogZnVuY3Rpb24oZGF0YSkge1xuXHRcdGZvciAodmFyIHggaW4gZGF0YSkgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoeCkpIHtcblx0XHRcdGlmICh0aGlzLmlzQmluYXJ5KGRhdGFbeF0pKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBmYWxzZTtcblx0fSxcblxuXHQvLyBEZXRlcm1pbmVzIGlmIGEgdmFyaWFibGUgRWl0aGVyIElzIG9yIGxpa2UgYSBGb3JtSW5wdXQgaGFzIHRoZSB2YWx1ZSBvZiBhIEJsb2JcblxuXHRpc0JpbmFyeTogZnVuY3Rpb24oZGF0YSkge1xuXG5cdFx0cmV0dXJuIGRhdGEgaW5zdGFuY2VvZiBPYmplY3QgJiYgKFxuXHRcdCh0aGlzLmRvbUluc3RhbmNlKCdpbnB1dCcsIGRhdGEpICYmIGRhdGEudHlwZSA9PT0gJ2ZpbGUnKSB8fFxuXHRcdCgnRmlsZUxpc3QnIGluIHdpbmRvdyAmJiBkYXRhIGluc3RhbmNlb2Ygd2luZG93LkZpbGVMaXN0KSB8fFxuXHRcdCgnRmlsZScgaW4gd2luZG93ICYmIGRhdGEgaW5zdGFuY2VvZiB3aW5kb3cuRmlsZSkgfHxcblx0XHQoJ0Jsb2InIGluIHdpbmRvdyAmJiBkYXRhIGluc3RhbmNlb2Ygd2luZG93LkJsb2IpKTtcblxuXHR9LFxuXG5cdC8vIENvbnZlcnQgRGF0YS1VUkkgdG8gQmxvYiBzdHJpbmdcblx0dG9CbG9iOiBmdW5jdGlvbihkYXRhVVJJKSB7XG5cdFx0dmFyIHJlZyA9IC9eZGF0YVxcOihbXjssXSsoXFw7Y2hhcnNldD1bXjssXSspPykoXFw7YmFzZTY0KT8sL2k7XG5cdFx0dmFyIG0gPSBkYXRhVVJJLm1hdGNoKHJlZyk7XG5cdFx0aWYgKCFtKSB7XG5cdFx0XHRyZXR1cm4gZGF0YVVSSTtcblx0XHR9XG5cblx0XHR2YXIgYmluYXJ5ID0gYXRvYihkYXRhVVJJLnJlcGxhY2UocmVnLCAnJykpO1xuXHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYmluYXJ5Lmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRhcnJheS5wdXNoKGJpbmFyeS5jaGFyQ29kZUF0KGkpKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbmV3IEJsb2IoW25ldyBVaW50OEFycmF5KGFycmF5KV0sIHt0eXBlOiBtWzFdfSk7XG5cdH1cblxufSk7XG5cbi8vIEVYVFJBOiBDb252ZXJ0IEZvcm1FbGVtZW50IHRvIEpTT04gZm9yIFBPU1Rpbmdcbi8vIFdyYXBwZXJzIHRvIGFkZCBhZGRpdGlvbmFsIGZ1bmN0aW9uYWxpdHkgdG8gZXhpc3RpbmcgZnVuY3Rpb25zXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHQvLyBDb3B5IG9yaWdpbmFsIGZ1bmN0aW9uXG5cdHZhciBhcGkgPSBoZWxsby5hcGk7XG5cdHZhciB1dGlscyA9IGhlbGxvLnV0aWxzO1xuXG5cdHV0aWxzLmV4dGVuZCh1dGlscywge1xuXG5cdFx0Ly8gRGF0YVRvSlNPTlxuXHRcdC8vIFRoaXMgdGFrZXMgYSBGb3JtRWxlbWVudHxOb2RlTGlzdHxJbnB1dEVsZW1lbnR8TWl4ZWRPYmplY3RzIGFuZCBjb252ZXJzIHRoZSBkYXRhIG9iamVjdCB0byBKU09OLlxuXHRcdGRhdGFUb0pTT046IGZ1bmN0aW9uKHApIHtcblxuXHRcdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRcdHZhciB3ID0gd2luZG93O1xuXHRcdFx0dmFyIGRhdGEgPSBwLmRhdGE7XG5cblx0XHRcdC8vIElzIGRhdGEgYSBmb3JtIG9iamVjdFxuXHRcdFx0aWYgKF90aGlzLmRvbUluc3RhbmNlKCdmb3JtJywgZGF0YSkpIHtcblx0XHRcdFx0ZGF0YSA9IF90aGlzLm5vZGVMaXN0VG9KU09OKGRhdGEuZWxlbWVudHMpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoJ05vZGVMaXN0JyBpbiB3ICYmIGRhdGEgaW5zdGFuY2VvZiBOb2RlTGlzdCkge1xuXHRcdFx0XHRkYXRhID0gX3RoaXMubm9kZUxpc3RUb0pTT04oZGF0YSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChfdGhpcy5kb21JbnN0YW5jZSgnaW5wdXQnLCBkYXRhKSkge1xuXHRcdFx0XHRkYXRhID0gX3RoaXMubm9kZUxpc3RUb0pTT04oW2RhdGFdKTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSXMgZGF0YSBhIGJsb2IsIEZpbGUsIEZpbGVMaXN0P1xuXHRcdFx0aWYgKCgnRmlsZScgaW4gdyAmJiBkYXRhIGluc3RhbmNlb2Ygdy5GaWxlKSB8fFxuXHRcdFx0XHQoJ0Jsb2InIGluIHcgJiYgZGF0YSBpbnN0YW5jZW9mIHcuQmxvYikgfHxcblx0XHRcdFx0KCdGaWxlTGlzdCcgaW4gdyAmJiBkYXRhIGluc3RhbmNlb2Ygdy5GaWxlTGlzdCkpIHtcblx0XHRcdFx0ZGF0YSA9IHtmaWxlOiBkYXRhfTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gTG9vcCB0aHJvdWdoIGRhdGEgaWYgaXQncyBub3QgZm9ybSBkYXRhIGl0IG11c3Qgbm93IGJlIGEgSlNPTiBvYmplY3Rcblx0XHRcdGlmICghKCdGb3JtRGF0YScgaW4gdyAmJiBkYXRhIGluc3RhbmNlb2Ygdy5Gb3JtRGF0YSkpIHtcblxuXHRcdFx0XHRmb3IgKHZhciB4IGluIGRhdGEpIGlmIChkYXRhLmhhc093blByb3BlcnR5KHgpKSB7XG5cblx0XHRcdFx0XHRpZiAoJ0ZpbGVMaXN0JyBpbiB3ICYmIGRhdGFbeF0gaW5zdGFuY2VvZiB3LkZpbGVMaXN0KSB7XG5cdFx0XHRcdFx0XHRpZiAoZGF0YVt4XS5sZW5ndGggPT09IDEpIHtcblx0XHRcdFx0XHRcdFx0ZGF0YVt4XSA9IGRhdGFbeF1bMF07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2UgaWYgKF90aGlzLmRvbUluc3RhbmNlKCdpbnB1dCcsIGRhdGFbeF0pICYmIGRhdGFbeF0udHlwZSA9PT0gJ2ZpbGUnKSB7XG5cdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSBpZiAoX3RoaXMuZG9tSW5zdGFuY2UoJ2lucHV0JywgZGF0YVt4XSkgfHxcblx0XHRcdFx0XHRcdF90aGlzLmRvbUluc3RhbmNlKCdzZWxlY3QnLCBkYXRhW3hdKSB8fFxuXHRcdFx0XHRcdFx0X3RoaXMuZG9tSW5zdGFuY2UoJ3RleHRBcmVhJywgZGF0YVt4XSkpIHtcblx0XHRcdFx0XHRcdGRhdGFbeF0gPSBkYXRhW3hdLnZhbHVlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmIChfdGhpcy5kb21JbnN0YW5jZShudWxsLCBkYXRhW3hdKSkge1xuXHRcdFx0XHRcdFx0ZGF0YVt4XSA9IGRhdGFbeF0uaW5uZXJIVE1MIHx8IGRhdGFbeF0uaW5uZXJUZXh0O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRwLmRhdGEgPSBkYXRhO1xuXHRcdFx0cmV0dXJuIGRhdGE7XG5cdFx0fSxcblxuXHRcdC8vIE5vZGVMaXN0VG9KU09OXG5cdFx0Ly8gR2l2ZW4gYSBsaXN0IG9mIGVsZW1lbnRzIGV4dHJhcG9sYXRlIHRoZWlyIHZhbHVlcyBhbmQgcmV0dXJuIGFzIGEganNvbiBvYmplY3Rcblx0XHRub2RlTGlzdFRvSlNPTjogZnVuY3Rpb24obm9kZWxpc3QpIHtcblxuXHRcdFx0dmFyIGpzb24gPSB7fTtcblxuXHRcdFx0Ly8gQ3JlYXRlIGEgZGF0YSBzdHJpbmdcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZWxpc3QubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0XHR2YXIgaW5wdXQgPSBub2RlbGlzdFtpXTtcblxuXHRcdFx0XHQvLyBJZiB0aGUgbmFtZSBvZiB0aGUgaW5wdXQgaXMgZW1wdHkgb3IgZGlhYmxlZCwgZG9udCBhZGQgaXQuXG5cdFx0XHRcdGlmIChpbnB1dC5kaXNhYmxlZCB8fCAhaW5wdXQubmFtZSkge1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSXMgdGhpcyBhIGZpbGUsIGRvZXMgdGhlIGJyb3dzZXIgbm90IHN1cHBvcnQgJ2ZpbGVzJyBhbmQgJ0Zvcm1EYXRhJz9cblx0XHRcdFx0aWYgKGlucHV0LnR5cGUgPT09ICdmaWxlJykge1xuXHRcdFx0XHRcdGpzb25baW5wdXQubmFtZV0gPSBpbnB1dDtcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRqc29uW2lucHV0Lm5hbWVdID0gaW5wdXQudmFsdWUgfHwgaW5wdXQuaW5uZXJIVE1MO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBqc29uO1xuXHRcdH1cblx0fSk7XG5cblx0Ly8gUmVwbGFjZSBpdFxuXHRoZWxsby5hcGkgPSBmdW5jdGlvbigpIHtcblxuXHRcdC8vIEdldCBhcmd1bWVudHNcblx0XHR2YXIgcCA9IHV0aWxzLmFyZ3Moe3BhdGg6ICdzIScsIG1ldGhvZDogJ3MnLCBkYXRhOidvJywgdGltZW91dDogJ2knLCBjYWxsYmFjazogJ2YnfSwgYXJndW1lbnRzKTtcblxuXHRcdC8vIENoYW5nZSBmb3IgaW50byBhIGRhdGEgb2JqZWN0XG5cdFx0aWYgKHAuZGF0YSkge1xuXHRcdFx0dXRpbHMuZGF0YVRvSlNPTihwKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gYXBpLmNhbGwodGhpcywgcCk7XG5cdH07XG5cbn0pKGhlbGxvKTtcblxuLy8gU2NyaXB0IHRvIHN1cHBvcnQgQ2hyb21lQXBwc1xuLy8gVGhpcyBvdmVyaWRlcyB0aGUgaGVsbG8udXRpbHMucG9wdXAgbWV0aG9kIHRvIHN1cHBvcnQgY2hyb21lLmlkZW50aXR5LmxhdW5jaFdlYkF1dGhGbG93XG4vLyBTZWUgaHR0cHM6Ly9kZXZlbG9wZXIuY2hyb21lLmNvbS9hcHBzL2FwcF9pZGVudGl0eSNub25cblxuLy8gSXMgdGhpcyBhIGNocm9tZSBhcHA/XG5cbmlmICh0eXBlb2YgY2hyb21lID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgY2hyb21lLmlkZW50aXR5ID09PSAnb2JqZWN0JyAmJiBjaHJvbWUuaWRlbnRpdHkubGF1bmNoV2ViQXV0aEZsb3cpIHtcblxuXHQoZnVuY3Rpb24oKSB7XG5cblx0XHQvLyBTd2FwIHRoZSBwb3B1cCBtZXRob2Rcblx0XHRoZWxsby51dGlscy5wb3B1cCA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHRyZXR1cm4gX29wZW4odXJsLCB0cnVlKTtcblxuXHRcdH07XG5cblx0XHQvLyBTd2FwIHRoZSBoaWRkZW4gaWZyYW1lIG1ldGhvZFxuXHRcdGhlbGxvLnV0aWxzLmlmcmFtZSA9IGZ1bmN0aW9uKHVybCkge1xuXG5cdFx0XHRfb3Blbih1cmwsIGZhbHNlKTtcblxuXHRcdH07XG5cblx0XHQvLyBTd2FwIHRoZSByZXF1ZXN0X2NvcnMgbWV0aG9kXG5cdFx0aGVsbG8udXRpbHMucmVxdWVzdF9jb3JzID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcblxuXHRcdFx0Y2FsbGJhY2soKTtcblxuXHRcdFx0Ly8gQWx3YXlzIHJ1biBhcyBDT1JTXG5cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH07XG5cblx0XHQvLyBTd2FwIHRoZSBzdG9yYWdlIG1ldGhvZFxuXHRcdHZhciBfY2FjaGUgPSB7fTtcblx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5nZXQoJ2hlbGxvJywgZnVuY3Rpb24ocikge1xuXHRcdFx0Ly8gVXBkYXRlIHRoZSBjYWNoZVxuXHRcdFx0X2NhY2hlID0gci5oZWxsbyB8fCB7fTtcblx0XHR9KTtcblxuXHRcdGhlbGxvLnV0aWxzLnN0b3JlID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcblxuXHRcdFx0Ly8gR2V0IGFsbFxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcblx0XHRcdFx0cmV0dXJuIF9jYWNoZTtcblx0XHRcdH1cblxuXHRcdFx0Ly8gR2V0XG5cdFx0XHRpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuXHRcdFx0XHRyZXR1cm4gX2NhY2hlW25hbWVdIHx8IG51bGw7XG5cdFx0XHR9XG5cblx0XHRcdC8vIFNldFxuXHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdF9jYWNoZVtuYW1lXSA9IHZhbHVlO1xuXHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2hlbGxvOiBfY2FjaGV9KTtcblx0XHRcdFx0cmV0dXJuIHZhbHVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBEZWxldGVcblx0XHRcdGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuXHRcdFx0XHRkZWxldGUgX2NhY2hlW25hbWVdO1xuXHRcdFx0XHRjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoe2hlbGxvOiBfY2FjaGV9KTtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdC8vIE9wZW4gZnVuY3Rpb25cblx0XHRmdW5jdGlvbiBfb3Blbih1cmwsIGludGVyYWN0aXZlKSB7XG5cblx0XHRcdC8vIExhdW5jaFxuXHRcdFx0dmFyIHJlZiA9IHtcblx0XHRcdFx0Y2xvc2VkOiBmYWxzZVxuXHRcdFx0fTtcblxuXHRcdFx0Ly8gTGF1bmNoIHRoZSB3ZWJBdXRoRmxvd1xuXHRcdFx0Y2hyb21lLmlkZW50aXR5LmxhdW5jaFdlYkF1dGhGbG93KHtcblx0XHRcdFx0dXJsOiB1cmwsXG5cdFx0XHRcdGludGVyYWN0aXZlOiBpbnRlcmFjdGl2ZVxuXHRcdFx0fSwgZnVuY3Rpb24ocmVzcG9uc2VVcmwpIHtcblxuXHRcdFx0XHQvLyBEaWQgdGhlIHVzZXIgY2FuY2VsIHRoaXMgcHJlbWF0dXJlbHlcblx0XHRcdFx0aWYgKHJlc3BvbnNlVXJsID09PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRyZWYuY2xvc2VkID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBTcGxpdCBhcHBhcnQgdGhlIFVSTFxuXHRcdFx0XHR2YXIgYSA9IGhlbGxvLnV0aWxzLnVybChyZXNwb25zZVVybCk7XG5cblx0XHRcdFx0Ly8gVGhlIGxvY2F0aW9uIGNhbiBiZSBhdWdtZW50ZWQgaW4gdG8gYSBsb2NhdGlvbiBvYmplY3QgbGlrZSBzby4uLlxuXHRcdFx0XHQvLyBXZSBkb250IGhhdmUgd2luZG93IG9wZXJhdGlvbnMgb24gdGhlIHBvcHVwIHNvIGxldHMgY3JlYXRlIHNvbWVcblx0XHRcdFx0dmFyIF9wb3B1cCA9IHtcblx0XHRcdFx0XHRsb2NhdGlvbjoge1xuXG5cdFx0XHRcdFx0XHQvLyBDaGFuZ2UgdGhlIGxvY2F0aW9uIG9mIHRoZSBwb3B1cFxuXHRcdFx0XHRcdFx0YXNzaWduOiBmdW5jdGlvbih1cmwpIHtcblxuXHRcdFx0XHRcdFx0XHQvLyBJZiB0aGVyZSBpcyBhIHNlY29uZGFyeSByZWFzc2lnblxuXHRcdFx0XHRcdFx0XHQvLyBJbiB0aGUgY2FzZSBvZiBPQXV0aDFcblx0XHRcdFx0XHRcdFx0Ly8gVHJpZ2dlciB0aGlzIGluIG5vbi1pbnRlcmFjdGl2ZSBtb2RlLlxuXHRcdFx0XHRcdFx0XHRfb3Blbih1cmwsIGZhbHNlKTtcblx0XHRcdFx0XHRcdH0sXG5cblx0XHRcdFx0XHRcdHNlYXJjaDogYS5zZWFyY2gsXG5cdFx0XHRcdFx0XHRoYXNoOiBhLmhhc2gsXG5cdFx0XHRcdFx0XHRocmVmOiBhLmhyZWZcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdGNsb3NlOiBmdW5jdGlvbigpIHt9XG5cdFx0XHRcdH07XG5cblx0XHRcdFx0Ly8gVGhlbiB0aGlzIFVSTCBjb250YWlucyBpbmZvcm1hdGlvbiB3aGljaCBIZWxsb0pTIG11c3QgcHJvY2Vzc1xuXHRcdFx0XHQvLyBVUkwgc3RyaW5nXG5cdFx0XHRcdC8vIFdpbmRvdyAtIGFueSBhY3Rpb24gc3VjaCBhcyB3aW5kb3cgcmVsb2NhdGlvbiBnb2VzIGhlcmVcblx0XHRcdFx0Ly8gT3BlbmVyIC0gdGhlIHBhcmVudCB3aW5kb3cgd2hpY2ggb3BlbmVkIHRoaXMsIGFrYSB0aGlzIHNjcmlwdFxuXG5cdFx0XHRcdGhlbGxvLnV0aWxzLnJlc3BvbnNlSGFuZGxlcihfcG9wdXAsIHdpbmRvdyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gUmV0dXJuIHRoZSByZWZlcmVuY2Vcblx0XHRcdHJldHVybiByZWY7XG5cdFx0fVxuXG5cdH0pKCk7XG59XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdC8vIE9BdXRoMVxuXHR2YXIgT0F1dGgxU2V0dGluZ3MgPSB7XG5cdFx0dmVyc2lvbjogJzEuMCcsXG5cdFx0YXV0aDogJ2h0dHBzOi8vd3d3LmRyb3Bib3guY29tLzEvb2F1dGgvYXV0aG9yaXplJyxcblx0XHRyZXF1ZXN0OiAnaHR0cHM6Ly9hcGkuZHJvcGJveC5jb20vMS9vYXV0aC9yZXF1ZXN0X3Rva2VuJyxcblx0XHR0b2tlbjogJ2h0dHBzOi8vYXBpLmRyb3Bib3guY29tLzEvb2F1dGgvYWNjZXNzX3Rva2VuJ1xuXHR9O1xuXG5cdC8vIE9BdXRoMiBTZXR0aW5nc1xuXHR2YXIgT0F1dGgyU2V0dGluZ3MgPSB7XG5cdFx0dmVyc2lvbjogMixcblx0XHRhdXRoOiAnaHR0cHM6Ly93d3cuZHJvcGJveC5jb20vMS9vYXV0aDIvYXV0aG9yaXplJyxcblx0XHRncmFudDogJ2h0dHBzOi8vYXBpLmRyb3Bib3guY29tLzEvb2F1dGgyL3Rva2VuJ1xuXHR9O1xuXG5cdC8vIEluaXRpYXRlIHRoZSBEcm9wYm94IG1vZHVsZVxuXHRoZWxsby5pbml0KHtcblxuXHRcdGRyb3Bib3g6IHtcblxuXHRcdFx0bmFtZTogJ0Ryb3Bib3gnLFxuXG5cdFx0XHRvYXV0aDogT0F1dGgyU2V0dGluZ3MsXG5cblx0XHRcdGxvZ2luOiBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdC8vIE9BdXRoMiBub24tc3RhbmRhcmQgYWRqdXN0bWVudHNcblx0XHRcdFx0cC5xcy5zY29wZSA9ICcnO1xuXHRcdFx0XHRkZWxldGUgcC5xcy5kaXNwbGF5O1xuXG5cdFx0XHRcdC8vIFNob3VsZCB0aGlzIGJlIHJ1biBhcyBPQXV0aDE/XG5cdFx0XHRcdC8vIElmIHRoZSByZWRpcmVjdF91cmkgaXMgaXMgSFRUUCAobm9uLXNlY3VyZSkgdGhlbiBpdHMgcmVxdWlyZWQgdG8gcmV2ZXJ0IHRvIHRoZSBPQXV0aDEgZW5kcG9pbnRzXG5cdFx0XHRcdHZhciByZWRpcmVjdCA9IGRlY29kZVVSSUNvbXBvbmVudChwLnFzLnJlZGlyZWN0X3VyaSk7XG5cdFx0XHRcdGlmIChyZWRpcmVjdC5pbmRleE9mKCdodHRwOicpID09PSAwICYmIHJlZGlyZWN0LmluZGV4T2YoJ2h0dHA6Ly9sb2NhbGhvc3QvJykgIT09IDApIHtcblxuXHRcdFx0XHRcdC8vIE92ZXJyaWRlIHRoZSBkcm9wYm94IE9BdXRoIHNldHRpbmdzLlxuXHRcdFx0XHRcdGhlbGxvLnNlcnZpY2VzLmRyb3Bib3gub2F1dGggPSBPQXV0aDFTZXR0aW5ncztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQvLyBPdmVycmlkZSB0aGUgZHJvcGJveCBPQXV0aCBzZXR0aW5ncy5cblx0XHRcdFx0XHRoZWxsby5zZXJ2aWNlcy5kcm9wYm94Lm9hdXRoID0gT0F1dGgyU2V0dGluZ3M7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGUgZHJvcGJveCBsb2dpbiB3aW5kb3cgaXMgYSBkaWZmZXJlbnQgc2l6ZVxuXHRcdFx0XHRwLm9wdGlvbnMucG9wdXAud2lkdGggPSAxMDAwO1xuXHRcdFx0XHRwLm9wdGlvbnMucG9wdXAuaGVpZ2h0ID0gMTAwMDtcblx0XHRcdH0sXG5cblx0XHRcdC8qXG5cdFx0XHRcdERyb3Bib3ggZG9lcyBub3QgYWxsb3cgaW5zZWN1cmUgSFRUUCBVUkkncyBpbiB0aGUgcmVkaXJlY3RfdXJpIGZpZWxkXG5cdFx0XHRcdC4uLm90aGVyd2lzZSBJJ2QgbG92ZSB0byB1c2UgT0F1dGgyXG5cblx0XHRcdFx0Rm9sbG93IHJlcXVlc3QgaHR0cHM6Ly9mb3J1bXMuZHJvcGJveC5jb20vdG9waWMucGhwP2lkPTEwNjUwNVxuXG5cdFx0XHRcdHAucXMucmVzcG9uc2VfdHlwZSA9ICdjb2RlJztcblx0XHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0XHR2ZXJzaW9uOiAyLFxuXHRcdFx0XHRcdGF1dGg6ICdodHRwczovL3d3dy5kcm9wYm94LmNvbS8xL29hdXRoMi9hdXRob3JpemUnLFxuXHRcdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9hcGkuZHJvcGJveC5jb20vMS9vYXV0aDIvdG9rZW4nXG5cdFx0XHRcdH1cblx0XHRcdCovXG5cblx0XHRcdC8vIEFQSSBCYXNlIFVSTFxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vYXBpLmRyb3Bib3guY29tLzEvJyxcblxuXHRcdFx0Ly8gQmVzcG9rZSBzZXR0aW5nOiB0aGlzIGlzIHN0YXRlcyB3aGV0aGVyIHRvIHVzZSB0aGUgY3VzdG9tIGVudmlyb25tZW50IG9mIERyb3Bib3ggb3IgdG8gdXNlIHRoZWlyIG93biBlbnZpcm9ubWVudFxuXHRcdFx0Ly8gQmVjYXVzZSBpdCdzIG5vdG9yaW91c2x5IGRpZmZpY3VsdCBmb3IgRHJvcGJveCB0b28gcHJvdmlkZSBhY2Nlc3MgZnJvbSBvdGhlciB3ZWJzZXJ2aWNlcywgdGhpcyBkZWZhdWx0cyB0byBTYW5kYm94XG5cdFx0XHRyb290OiAnc2FuZGJveCcsXG5cblx0XHRcdC8vIE1hcCBHRVQgcmVxdWVzdHNcblx0XHRcdGdldDoge1xuXHRcdFx0XHRtZTogJ2FjY291bnQvaW5mbycsXG5cblx0XHRcdFx0Ly8gSHR0cHM6Ly93d3cuZHJvcGJveC5jb20vZGV2ZWxvcGVycy9jb3JlL2RvY3MjbWV0YWRhdGFcblx0XHRcdFx0J21lL2ZpbGVzJzogcmVxKCdtZXRhZGF0YS9hdXRvL0B7cGFyZW50fH0nKSxcblx0XHRcdFx0J21lL2ZvbGRlcic6IHJlcSgnbWV0YWRhdGEvYXV0by9Ae2lkfScpLFxuXHRcdFx0XHQnbWUvZm9sZGVycyc6IHJlcSgnbWV0YWRhdGEvYXV0by8nKSxcblxuXHRcdFx0XHQnZGVmYXVsdCc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0aWYgKHAucGF0aC5tYXRjaCgnaHR0cHM6Ly9hcGktY29udGVudC5kcm9wYm94LmNvbS8xL2ZpbGVzLycpKSB7XG5cdFx0XHRcdFx0XHQvLyBUaGlzIGlzIGEgZmlsZSwgcmV0dXJuIGJpbmFyeSBkYXRhXG5cdFx0XHRcdFx0XHRwLm1ldGhvZCA9ICdibG9iJztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRjYWxsYmFjayhwLnBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRwb3N0OiB7XG5cdFx0XHRcdCdtZS9maWxlcyc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cblx0XHRcdFx0XHR2YXIgcGF0aCA9IHAuZGF0YS5wYXJlbnQ7XG5cdFx0XHRcdFx0dmFyIGZpbGVOYW1lID0gcC5kYXRhLm5hbWU7XG5cblx0XHRcdFx0XHRwLmRhdGEgPSB7XG5cdFx0XHRcdFx0XHRmaWxlOiBwLmRhdGEuZmlsZVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHQvLyBEb2VzIHRoaXMgaGF2ZSBhIGRhdGEtdXJpIHRvIHVwbG9hZCBhcyBhIGZpbGU/XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiAocC5kYXRhLmZpbGUpID09PSAnc3RyaW5nJykge1xuXHRcdFx0XHRcdFx0cC5kYXRhLmZpbGUgPSBoZWxsby51dGlscy50b0Jsb2IocC5kYXRhLmZpbGUpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGNhbGxiYWNrKCdodHRwczovL2FwaS1jb250ZW50LmRyb3Bib3guY29tLzEvZmlsZXNfcHV0L2F1dG8vJyArIHBhdGggKyAnLycgKyBmaWxlTmFtZSk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J21lL2ZvbGRlcnMnOiBmdW5jdGlvbihwLCBjYWxsYmFjaykge1xuXG5cdFx0XHRcdFx0dmFyIG5hbWUgPSBwLmRhdGEubmFtZTtcblx0XHRcdFx0XHRwLmRhdGEgPSB7fTtcblxuXHRcdFx0XHRcdGNhbGxiYWNrKCdmaWxlb3BzL2NyZWF0ZV9mb2xkZXI/cm9vdD1Ae3Jvb3R8c2FuZGJveH0mJyArIGhlbGxvLnV0aWxzLnBhcmFtKHtcblx0XHRcdFx0XHRcdHBhdGg6IG5hbWVcblx0XHRcdFx0XHR9KSk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBERUxFVEUgcmVxdWVzdHNcblx0XHRcdGRlbDoge1xuXHRcdFx0XHQnbWUvZmlsZXMnOiAnZmlsZW9wcy9kZWxldGU/cm9vdD1Ae3Jvb3R8c2FuZGJveH0mcGF0aD1Ae2lkfScsXG5cdFx0XHRcdCdtZS9mb2xkZXInOiAnZmlsZW9wcy9kZWxldGU/cm9vdD1Ae3Jvb3R8c2FuZGJveH0mcGF0aD1Ae2lkfSdcblx0XHRcdH0sXG5cblx0XHRcdHdyYXA6IHtcblx0XHRcdFx0bWU6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblx0XHRcdFx0XHRpZiAoIW8udWlkKSB7XG5cdFx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRvLm5hbWUgPSBvLmRpc3BsYXlfbmFtZTtcblx0XHRcdFx0XHR2YXIgbSA9IG8ubmFtZS5zcGxpdCgnICcpO1xuXHRcdFx0XHRcdG8uZmlyc3RfbmFtZSA9IG0uc2hpZnQoKTtcblx0XHRcdFx0XHRvLmxhc3RfbmFtZSA9IG0uam9pbignICcpO1xuXHRcdFx0XHRcdG8uaWQgPSBvLnVpZDtcblx0XHRcdFx0XHRkZWxldGUgby51aWQ7XG5cdFx0XHRcdFx0ZGVsZXRlIG8uZGlzcGxheV9uYW1lO1xuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24obywgaGVhZGVycywgcmVxKSB7XG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3Iobyk7XG5cdFx0XHRcdFx0aWYgKG8uaXNfZGlyICYmIG8uY29udGVudHMpIHtcblx0XHRcdFx0XHRcdG8uZGF0YSA9IG8uY29udGVudHM7XG5cdFx0XHRcdFx0XHRkZWxldGUgby5jb250ZW50cztcblxuXHRcdFx0XHRcdFx0by5kYXRhLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuXHRcdFx0XHRcdFx0XHRpdGVtLnJvb3QgPSBvLnJvb3Q7XG5cdFx0XHRcdFx0XHRcdGZvcm1hdEZpbGUoaXRlbSwgaGVhZGVycywgcmVxKTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGZvcm1hdEZpbGUobywgaGVhZGVycywgcmVxKTtcblxuXHRcdFx0XHRcdGlmIChvLmlzX2RlbGV0ZWQpIHtcblx0XHRcdFx0XHRcdG8uc3VjY2VzcyA9IHRydWU7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIERvZXNuJ3QgcmV0dXJuIHRoZSBDT1JTIGhlYWRlcnNcblx0XHRcdHhocjogZnVuY3Rpb24ocCkge1xuXG5cdFx0XHRcdC8vIFRoZSBwcm94eSBzdXBwb3J0cyBhbGxvdy1jcm9zcy1vcmlnaW4tcmVzb3VyY2Vcblx0XHRcdFx0Ly8gQWxhcyB0aGF0J3MgdGhlIG9ubHkgdGhpbmcgd2UncmUgdXNpbmcuXG5cdFx0XHRcdGlmIChwLmRhdGEgJiYgcC5kYXRhLmZpbGUpIHtcblx0XHRcdFx0XHR2YXIgZmlsZSA9IHAuZGF0YS5maWxlO1xuXHRcdFx0XHRcdGlmIChmaWxlKSB7XG5cdFx0XHRcdFx0XHRpZiAoZmlsZS5maWxlcykge1xuXHRcdFx0XHRcdFx0XHRwLmRhdGEgPSBmaWxlLmZpbGVzWzBdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHAuZGF0YSA9IGZpbGU7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHAubWV0aG9kID09PSAnZGVsZXRlJykge1xuXHRcdFx0XHRcdHAubWV0aG9kID0gJ3Bvc3QnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXG5cdFx0XHRmb3JtOiBmdW5jdGlvbihwLCBxcykge1xuXHRcdFx0XHRkZWxldGUgcXMuc3RhdGU7XG5cdFx0XHRcdGRlbGV0ZSBxcy5yZWRpcmVjdF91cmk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBmb3JtYXRFcnJvcihvKSB7XG5cdFx0aWYgKG8gJiYgJ2Vycm9yJyBpbiBvKSB7XG5cdFx0XHRvLmVycm9yID0ge1xuXHRcdFx0XHRjb2RlOiAnc2VydmVyX2Vycm9yJyxcblx0XHRcdFx0bWVzc2FnZTogby5lcnJvci5tZXNzYWdlIHx8IG8uZXJyb3Jcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RmlsZShvLCBoZWFkZXJzLCByZXEpIHtcblxuXHRcdGlmICh0eXBlb2YgbyAhPT0gJ29iamVjdCcgfHxcblx0XHRcdCh0eXBlb2YgQmxvYiAhPT0gJ3VuZGVmaW5lZCcgJiYgbyBpbnN0YW5jZW9mIEJsb2IpIHx8XG5cdFx0XHQodHlwZW9mIEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJiBvIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpKSB7XG5cdFx0XHQvLyBUaGlzIGlzIGEgZmlsZSwgbGV0IGl0IHRocm91Z2ggdW5mb3JtYXR0ZWRcblx0XHRcdHJldHVybjtcblx0XHR9XG5cblx0XHRpZiAoJ2Vycm9yJyBpbiBvKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIHBhdGggPSAoby5yb290ICE9PSAnYXBwX2ZvbGRlcicgPyBvLnJvb3QgOiAnJykgKyBvLnBhdGgucmVwbGFjZSgvXFwmL2csICclMjYnKTtcblx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvLywgJycpO1xuXHRcdGlmIChvLnRodW1iX2V4aXN0cykge1xuXHRcdFx0by50aHVtYm5haWwgPSByZXEub2F1dGhfcHJveHkgKyAnP3BhdGg9JyArXG5cdFx0XHRlbmNvZGVVUklDb21wb25lbnQoJ2h0dHBzOi8vYXBpLWNvbnRlbnQuZHJvcGJveC5jb20vMS90aHVtYm5haWxzL2F1dG8vJyArIHBhdGggKyAnP2Zvcm1hdD1qcGVnJnNpemU9bScpICsgJyZhY2Nlc3NfdG9rZW49JyArIHJlcS5vcHRpb25zLmFjY2Vzc190b2tlbjtcblx0XHR9XG5cblx0XHRvLnR5cGUgPSAoby5pc19kaXIgPyAnZm9sZGVyJyA6IG8ubWltZV90eXBlKTtcblx0XHRvLm5hbWUgPSBvLnBhdGgucmVwbGFjZSgvLipcXC8vZywgJycpO1xuXHRcdGlmIChvLmlzX2Rpcikge1xuXHRcdFx0by5maWxlcyA9IHBhdGgucmVwbGFjZSgvXlxcLy8sICcnKTtcblx0XHR9XG5cdFx0ZWxzZSB7XG5cdFx0XHRvLmRvd25sb2FkTGluayA9IGhlbGxvLnNldHRpbmdzLm9hdXRoX3Byb3h5ICsgJz9wYXRoPScgK1xuXHRcdFx0ZW5jb2RlVVJJQ29tcG9uZW50KCdodHRwczovL2FwaS1jb250ZW50LmRyb3Bib3guY29tLzEvZmlsZXMvYXV0by8nICsgcGF0aCkgKyAnJmFjY2Vzc190b2tlbj0nICsgcmVxLm9wdGlvbnMuYWNjZXNzX3Rva2VuO1xuXHRcdFx0by5maWxlID0gJ2h0dHBzOi8vYXBpLWNvbnRlbnQuZHJvcGJveC5jb20vMS9maWxlcy9hdXRvLycgKyBwYXRoO1xuXHRcdH1cblxuXHRcdGlmICghby5pZCkge1xuXHRcdFx0by5pZCA9IG8ucGF0aC5yZXBsYWNlKC9eXFwvLywgJycpO1xuXHRcdH1cblxuXHRcdC8vIE8ubWVkaWEgPSAnaHR0cHM6Ly9hcGktY29udGVudC5kcm9wYm94LmNvbS8xL2ZpbGVzLycgKyBwYXRoO1xuXHR9XG5cblx0ZnVuY3Rpb24gcmVxKHN0cikge1xuXHRcdHJldHVybiBmdW5jdGlvbihwLCBjYikge1xuXHRcdFx0ZGVsZXRlIHAucXVlcnkubGltaXQ7XG5cdFx0XHRjYihzdHIpO1xuXHRcdH07XG5cdH1cblxufSkoaGVsbG8pO1xuXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHRoZWxsby5pbml0KHtcblxuXHRcdGZhY2Vib29rOiB7XG5cblx0XHRcdG5hbWU6ICdGYWNlYm9vaycsXG5cblx0XHRcdC8vIFNFRSBodHRwczovL2RldmVsb3BlcnMuZmFjZWJvb2suY29tL2RvY3MvZmFjZWJvb2stbG9naW4vbWFudWFsbHktYnVpbGQtYS1sb2dpbi1mbG93L3YyLjFcblx0XHRcdG9hdXRoOiB7XG5cdFx0XHRcdHZlcnNpb246IDIsXG5cdFx0XHRcdGF1dGg6ICdodHRwczovL3d3dy5mYWNlYm9vay5jb20vZGlhbG9nL29hdXRoLycsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vb2F1dGgvYWNjZXNzX3Rva2VuJ1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQXV0aG9yaXphdGlvbiBzY29wZXNcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGJhc2ljOiAncHVibGljX3Byb2ZpbGUnLFxuXHRcdFx0XHRlbWFpbDogJ2VtYWlsJyxcblx0XHRcdFx0c2hhcmU6ICd1c2VyX3Bvc3RzJyxcblx0XHRcdFx0YmlydGhkYXk6ICd1c2VyX2JpcnRoZGF5Jyxcblx0XHRcdFx0ZXZlbnRzOiAndXNlcl9ldmVudHMnLFxuXHRcdFx0XHRwaG90b3M6ICd1c2VyX3Bob3Rvcyx1c2VyX3ZpZGVvcycsXG5cdFx0XHRcdHZpZGVvczogJ3VzZXJfcGhvdG9zLHVzZXJfdmlkZW9zJyxcblx0XHRcdFx0ZnJpZW5kczogJ3VzZXJfZnJpZW5kcycsXG5cdFx0XHRcdGZpbGVzOiAndXNlcl9waG90b3MsdXNlcl92aWRlb3MnLFxuXHRcdFx0XHRwdWJsaXNoX2ZpbGVzOiAndXNlcl9waG90b3MsdXNlcl92aWRlb3MscHVibGlzaF9hY3Rpb25zJyxcblx0XHRcdFx0cHVibGlzaDogJ3B1Ymxpc2hfYWN0aW9ucycsXG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBpbiB2Mi4wXG5cdFx0XHRcdC8vIENyZWF0ZV9ldmVudFx0OiAnY3JlYXRlX2V2ZW50JyxcblxuXHRcdFx0XHRvZmZsaW5lX2FjY2VzczogJ29mZmxpbmVfYWNjZXNzJ1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gUmVmcmVzaCB0aGUgYWNjZXNzX3Rva2VuXG5cdFx0XHRyZWZyZXNoOiB0cnVlLFxuXG5cdFx0XHRsb2dpbjogZnVuY3Rpb24ocCkge1xuXG5cdFx0XHRcdC8vIFJlYXV0aGVudGljYXRlXG5cdFx0XHRcdC8vIGh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9mYWNlYm9vay1sb2dpbi9yZWF1dGhlbnRpY2F0aW9uXG5cdFx0XHRcdGlmIChwLm9wdGlvbnMuZm9yY2UpIHtcblx0XHRcdFx0XHRwLnFzLmF1dGhfdHlwZSA9ICdyZWF1dGhlbnRpY2F0ZSc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBUaGUgZmFjZWJvb2sgbG9naW4gd2luZG93IGlzIGEgZGlmZmVyZW50IHNpemUuXG5cdFx0XHRcdHAub3B0aW9ucy5wb3B1cC53aWR0aCA9IDU4MDtcblx0XHRcdFx0cC5vcHRpb25zLnBvcHVwLmhlaWdodCA9IDQwMDtcblx0XHRcdH0sXG5cblx0XHRcdGxvZ291dDogZnVuY3Rpb24oY2FsbGJhY2ssIG9wdGlvbnMpIHtcblx0XHRcdFx0Ly8gQXNzaWduIGNhbGxiYWNrIHRvIGEgZ2xvYmFsIGhhbmRsZXJcblx0XHRcdFx0dmFyIGNhbGxiYWNrSUQgPSBoZWxsby51dGlscy5nbG9iYWxFdmVudChjYWxsYmFjayk7XG5cdFx0XHRcdHZhciByZWRpcmVjdCA9IGVuY29kZVVSSUNvbXBvbmVudChoZWxsby5zZXR0aW5ncy5yZWRpcmVjdF91cmkgKyAnPycgKyBoZWxsby51dGlscy5wYXJhbSh7Y2FsbGJhY2s6Y2FsbGJhY2tJRCwgcmVzdWx0OiBKU09OLnN0cmluZ2lmeSh7Zm9yY2U6dHJ1ZX0pLCBzdGF0ZTogJ3t9J30pKTtcblx0XHRcdFx0dmFyIHRva2VuID0gKG9wdGlvbnMuYXV0aFJlc3BvbnNlIHx8IHt9KS5hY2Nlc3NfdG9rZW47XG5cdFx0XHRcdGhlbGxvLnV0aWxzLmlmcmFtZSgnaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2xvZ291dC5waHA/bmV4dD0nICsgcmVkaXJlY3QgKyAnJmFjY2Vzc190b2tlbj0nICsgdG9rZW4pO1xuXG5cdFx0XHRcdC8vIFBvc3NpYmxlIHJlc3BvbnNlczpcblx0XHRcdFx0Ly8gU3RyaW5nIFVSTFx0LSBoZWxsby5sb2dvdXQgc2hvdWxkIGhhbmRsZSB0aGUgbG9nb3V0XG5cdFx0XHRcdC8vIFVuZGVmaW5lZFx0LSB0aGlzIGZ1bmN0aW9uIHdpbGwgaGFuZGxlIHRoZSBjYWxsYmFja1xuXHRcdFx0XHQvLyBUcnVlIC0gdGhyb3cgYSBzdWNjZXNzLCB0aGlzIGNhbGxiYWNrIGlzbid0IGhhbmRsaW5nIHRoZSBjYWxsYmFja1xuXHRcdFx0XHQvLyBGYWxzZSAtIHRocm93IGEgZXJyb3Jcblx0XHRcdFx0aWYgKCF0b2tlbikge1xuXHRcdFx0XHRcdC8vIElmIHRoZXJlIGlzbid0IGEgdG9rZW4sIHRoZSBhYm92ZSB3b250IHJldHVybiBhIHJlc3BvbnNlLCBzbyBsZXRzIHRyaWdnZXIgYSByZXNwb25zZVxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQVBJIEJhc2UgVVJMXG5cdFx0XHRiYXNlOiAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vdjIuNC8nLFxuXG5cdFx0XHQvLyBNYXAgR0VUIHJlcXVlc3RzXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6ICdtZT9maWVsZHM9ZW1haWwsZmlyc3RfbmFtZSxsYXN0X25hbWUsbmFtZSx0aW1lem9uZSx2ZXJpZmllZCcsXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogJ21lL2ZyaWVuZHMnLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogJ21lL2ZyaWVuZHMnLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogJ21lL2ZyaWVuZHMnLFxuXHRcdFx0XHQnbWUvc2hhcmUnOiAnbWUvZmVlZCcsXG5cdFx0XHRcdCdtZS9saWtlJzogJ21lL2xpa2VzJyxcblx0XHRcdFx0J21lL2ZpbGVzJzogJ21lL2FsYnVtcycsXG5cdFx0XHRcdCdtZS9hbGJ1bXMnOiAnbWUvYWxidW1zP2ZpZWxkcz1jb3Zlcl9waG90byxuYW1lJyxcblx0XHRcdFx0J21lL2FsYnVtJzogJ0B7aWR9L3Bob3Rvcz9maWVsZHM9cGljdHVyZScsXG5cdFx0XHRcdCdtZS9waG90b3MnOiAnbWUvcGhvdG9zJyxcblx0XHRcdFx0J21lL3Bob3RvJzogJ0B7aWR9Jyxcblx0XHRcdFx0J2ZyaWVuZC9hbGJ1bXMnOiAnQHtpZH0vYWxidW1zJyxcblx0XHRcdFx0J2ZyaWVuZC9waG90b3MnOiAnQHtpZH0vcGhvdG9zJ1xuXG5cdFx0XHRcdC8vIFBhZ2luYXRpb25cblx0XHRcdFx0Ly8gSHR0cHM6Ly9kZXZlbG9wZXJzLmZhY2Vib29rLmNvbS9kb2NzL3JlZmVyZW5jZS9hcGkvcGFnaW5hdGlvbi9cblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBQT1NUIHJlcXVlc3RzXG5cdFx0XHRwb3N0OiB7XG5cdFx0XHRcdCdtZS9zaGFyZSc6ICdtZS9mZWVkJyxcblx0XHRcdFx0J21lL3Bob3RvJzogJ0B7aWR9J1xuXG5cdFx0XHRcdC8vIEh0dHBzOi8vZGV2ZWxvcGVycy5mYWNlYm9vay5jb20vZG9jcy9ncmFwaC1hcGkvcmVmZXJlbmNlL3YyLjIvb2JqZWN0L2xpa2VzL1xuXHRcdFx0fSxcblxuXHRcdFx0d3JhcDoge1xuXHRcdFx0XHRtZTogZm9ybWF0VXNlcixcblx0XHRcdFx0J21lL2ZyaWVuZHMnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9hbGJ1bXMnOiBmb3JtYXQsXG5cdFx0XHRcdCdtZS9waG90b3MnOiBmb3JtYXQsXG5cdFx0XHRcdCdtZS9maWxlcyc6IGZvcm1hdCxcblx0XHRcdFx0J2RlZmF1bHQnOiBmb3JtYXRcblx0XHRcdH0sXG5cblx0XHRcdC8vIFNwZWNpYWwgcmVxdWlyZW1lbnRzIGZvciBoYW5kbGluZyBYSFJcblx0XHRcdHhocjogZnVuY3Rpb24ocCwgcXMpIHtcblx0XHRcdFx0aWYgKHAubWV0aG9kID09PSAnZ2V0JyB8fCBwLm1ldGhvZCA9PT0gJ3Bvc3QnKSB7XG5cdFx0XHRcdFx0cXMuc3VwcHJlc3NfcmVzcG9uc2VfY29kZXMgPSB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gSXMgdGhpcyBhIHBvc3Qgd2l0aCBhIGRhdGEtdXJpP1xuXHRcdFx0XHRpZiAocC5tZXRob2QgPT09ICdwb3N0JyAmJiBwLmRhdGEgJiYgdHlwZW9mIChwLmRhdGEuZmlsZSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdFx0Ly8gQ29udmVydCB0aGUgRGF0YS1VUkkgdG8gYSBCbG9iXG5cdFx0XHRcdFx0cC5kYXRhLmZpbGUgPSBoZWxsby51dGlscy50b0Jsb2IocC5kYXRhLmZpbGUpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBTcGVjaWFsIHJlcXVpcmVtZW50cyBmb3IgaGFuZGxpbmcgSlNPTlAgZmFsbGJhY2tcblx0XHRcdGpzb25wOiBmdW5jdGlvbihwLCBxcykge1xuXHRcdFx0XHR2YXIgbSA9IHAubWV0aG9kO1xuXHRcdFx0XHRpZiAobSAhPT0gJ2dldCcgJiYgIWhlbGxvLnV0aWxzLmhhc0JpbmFyeShwLmRhdGEpKSB7XG5cdFx0XHRcdFx0cC5kYXRhLm1ldGhvZCA9IG07XG5cdFx0XHRcdFx0cC5tZXRob2QgPSAnZ2V0Jztcblx0XHRcdFx0fVxuXHRcdFx0XHRlbHNlIGlmIChwLm1ldGhvZCA9PT0gJ2RlbGV0ZScpIHtcblx0XHRcdFx0XHRxcy5tZXRob2QgPSAnZGVsZXRlJztcblx0XHRcdFx0XHRwLm1ldGhvZCA9ICdwb3N0Jztcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0Ly8gU3BlY2lhbCByZXF1aXJlbWVudHMgZm9yIGlmcmFtZSBmb3JtIGhhY2tcblx0XHRcdGZvcm06IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0XHQvLyBGaXJlIHRoZSBjYWxsYmFjayBvbmxvYWRcblx0XHRcdFx0XHRjYWxsYmFja29ubG9hZDogdHJ1ZVxuXHRcdFx0XHR9O1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0dmFyIGJhc2UgPSAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJztcblxuXHRmdW5jdGlvbiBmb3JtYXRVc2VyKG8pIHtcblx0XHRpZiAoby5pZCkge1xuXHRcdFx0by50aHVtYm5haWwgPSBvLnBpY3R1cmUgPSAnaHR0cHM6Ly9ncmFwaC5mYWNlYm9vay5jb20vJyArIG8uaWQgKyAnL3BpY3R1cmUnO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RnJpZW5kcyhvKSB7XG5cdFx0aWYgKCdkYXRhJyBpbiBvKSB7XG5cdFx0XHRvLmRhdGEuZm9yRWFjaChmb3JtYXRVc2VyKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdChvLCBoZWFkZXJzLCByZXEpIHtcblx0XHRpZiAodHlwZW9mIG8gPT09ICdib29sZWFuJykge1xuXHRcdFx0byA9IHtzdWNjZXNzOiBvfTtcblx0XHR9XG5cblx0XHRpZiAobyAmJiAnZGF0YScgaW4gbykge1xuXHRcdFx0dmFyIHRva2VuID0gcmVxLnF1ZXJ5LmFjY2Vzc190b2tlbjtcblx0XHRcdG8uZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcblxuXHRcdFx0XHRpZiAoZC5waWN0dXJlKSB7XG5cdFx0XHRcdFx0ZC50aHVtYm5haWwgPSBkLnBpY3R1cmU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRkLnBpY3R1cmVzID0gKGQuaW1hZ2VzIHx8IFtdKVxuXHRcdFx0XHRcdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhLndpZHRoIC0gYi53aWR0aDtcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRpZiAoZC5jb3Zlcl9waG90byAmJiBkLmNvdmVyX3Bob3RvLmlkKSB7XG5cdFx0XHRcdFx0ZC50aHVtYm5haWwgPSBiYXNlICsgZC5jb3Zlcl9waG90by5pZCArICcvcGljdHVyZT9hY2Nlc3NfdG9rZW49JyArIHRva2VuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGQudHlwZSA9PT0gJ2FsYnVtJykge1xuXHRcdFx0XHRcdGQuZmlsZXMgPSBkLnBob3RvcyA9IGJhc2UgKyBkLmlkICsgJy9waG90b3MnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGQuY2FuX3VwbG9hZCkge1xuXHRcdFx0XHRcdGQudXBsb2FkX2xvY2F0aW9uID0gYmFzZSArIGQuaWQgKyAnL3Bob3Rvcyc7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cbn0pKGhlbGxvKTtcblxuKGZ1bmN0aW9uKGhlbGxvKSB7XG5cblx0aGVsbG8uaW5pdCh7XG5cblx0XHRmbGlja3I6IHtcblxuXHRcdFx0bmFtZTogJ0ZsaWNrcicsXG5cblx0XHRcdC8vIEVuc3VyZSB0aGF0IHlvdSBkZWZpbmUgYW4gb2F1dGhfcHJveHlcblx0XHRcdG9hdXRoOiB7XG5cdFx0XHRcdHZlcnNpb246ICcxLjBhJyxcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vd3d3LmZsaWNrci5jb20vc2VydmljZXMvb2F1dGgvYXV0aG9yaXplP3Blcm1zPXJlYWQnLFxuXHRcdFx0XHRyZXF1ZXN0OiAnaHR0cHM6Ly93d3cuZmxpY2tyLmNvbS9zZXJ2aWNlcy9vYXV0aC9yZXF1ZXN0X3Rva2VuJyxcblx0XHRcdFx0dG9rZW46ICdodHRwczovL3d3dy5mbGlja3IuY29tL3NlcnZpY2VzL29hdXRoL2FjY2Vzc190b2tlbidcblx0XHRcdH0sXG5cblx0XHRcdC8vIEFQSSBiYXNlIFVSTFxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdCcsXG5cblx0XHRcdC8vIE1hcCBHRVQgcmVzcXVlc3RzXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6IHNpZ24oJ2ZsaWNrci5wZW9wbGUuZ2V0SW5mbycpLFxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IHNpZ24oJ2ZsaWNrci5jb250YWN0cy5nZXRMaXN0Jywge3Blcl9wYWdlOidAe2xpbWl0fDUwfSd9KSxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6IHNpZ24oJ2ZsaWNrci5jb250YWN0cy5nZXRMaXN0Jywge3Blcl9wYWdlOidAe2xpbWl0fDUwfSd9KSxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6IHNpZ24oJ2ZsaWNrci5jb250YWN0cy5nZXRMaXN0Jywge3Blcl9wYWdlOidAe2xpbWl0fDUwfSd9KSxcblx0XHRcdFx0J21lL2FsYnVtcyc6IHNpZ24oJ2ZsaWNrci5waG90b3NldHMuZ2V0TGlzdCcsIHtwZXJfcGFnZTonQHtsaW1pdHw1MH0nfSksXG5cdFx0XHRcdCdtZS9hbGJ1bSc6IHNpZ24oJ2ZsaWNrci5waG90b3NldHMuZ2V0UGhvdG9zJywge3Bob3Rvc2V0X2lkOiAnQHtpZH0nfSksXG5cdFx0XHRcdCdtZS9waG90b3MnOiBzaWduKCdmbGlja3IucGVvcGxlLmdldFBob3RvcycsIHtwZXJfcGFnZTonQHtsaW1pdHw1MH0nfSlcblx0XHRcdH0sXG5cblx0XHRcdHdyYXA6IHtcblx0XHRcdFx0bWU6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblx0XHRcdFx0XHRvID0gY2hlY2tSZXNwb25zZShvLCAncGVyc29uJyk7XG5cdFx0XHRcdFx0aWYgKG8uaWQpIHtcblx0XHRcdFx0XHRcdGlmIChvLnJlYWxuYW1lKSB7XG5cdFx0XHRcdFx0XHRcdG8ubmFtZSA9IG8ucmVhbG5hbWUuX2NvbnRlbnQ7XG5cdFx0XHRcdFx0XHRcdHZhciBtID0gby5uYW1lLnNwbGl0KCcgJyk7XG5cdFx0XHRcdFx0XHRcdG8uZmlyc3RfbmFtZSA9IG0uc2hpZnQoKTtcblx0XHRcdFx0XHRcdFx0by5sYXN0X25hbWUgPSBtLmpvaW4oJyAnKTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0by50aHVtYm5haWwgPSBnZXRCdWRkeUljb24obywgJ2wnKTtcblx0XHRcdFx0XHRcdG8ucGljdHVyZSA9IGdldEJ1ZGR5SWNvbihvLCAnbCcpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvYWxidW1zJzogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdFx0XHRcdG8gPSBjaGVja1Jlc3BvbnNlKG8sICdwaG90b3NldHMnKTtcblx0XHRcdFx0XHRwYWdpbmcobyk7XG5cdFx0XHRcdFx0aWYgKG8ucGhvdG9zZXQpIHtcblx0XHRcdFx0XHRcdG8uZGF0YSA9IG8ucGhvdG9zZXQ7XG5cdFx0XHRcdFx0XHRvLmRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG5cdFx0XHRcdFx0XHRcdGl0ZW0ubmFtZSA9IGl0ZW0udGl0bGUuX2NvbnRlbnQ7XG5cdFx0XHRcdFx0XHRcdGl0ZW0ucGhvdG9zID0gJ2h0dHBzOi8vYXBpLmZsaWNrci5jb20vc2VydmljZXMvcmVzdCcgKyBnZXRBcGlVcmwoJ2ZsaWNrci5waG90b3NldHMuZ2V0UGhvdG9zJywge3Bob3Rvc2V0X2lkOiBpdGVtLmlkfSwgdHJ1ZSk7XG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0ZGVsZXRlIG8ucGhvdG9zZXQ7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J21lL3Bob3Rvcyc6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblx0XHRcdFx0XHRyZXR1cm4gZm9ybWF0UGhvdG9zKG8pO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdFx0XHRcdHJldHVybiBmb3JtYXRQaG90b3Mobyk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHhocjogZmFsc2UsXG5cblx0XHRcdGpzb25wOiBmdW5jdGlvbihwLCBxcykge1xuXHRcdFx0XHRpZiAocC5tZXRob2QgPT0gJ2dldCcpIHtcblx0XHRcdFx0XHRkZWxldGUgcXMuY2FsbGJhY2s7XG5cdFx0XHRcdFx0cXMuanNvbmNhbGxiYWNrID0gcC5jYWxsYmFja0lEO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBnZXRBcGlVcmwobWV0aG9kLCBleHRyYVBhcmFtcywgc2tpcE5ldHdvcmspIHtcblx0XHR2YXIgdXJsID0gKChza2lwTmV0d29yaykgPyAnJyA6ICdmbGlja3I6JykgK1xuXHRcdFx0Jz9tZXRob2Q9JyArIG1ldGhvZCArXG5cdFx0XHQnJmFwaV9rZXk9JyArIGhlbGxvLnNlcnZpY2VzLmZsaWNrci5pZCArXG5cdFx0XHQnJmZvcm1hdD1qc29uJztcblx0XHRmb3IgKHZhciBwYXJhbSBpbiBleHRyYVBhcmFtcykge1xuXHRcdFx0aWYgKGV4dHJhUGFyYW1zLmhhc093blByb3BlcnR5KHBhcmFtKSkge1xuXHRcdFx0XHR1cmwgKz0gJyYnICsgcGFyYW0gKyAnPScgKyBleHRyYVBhcmFtc1twYXJhbV07XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHVybDtcblx0fVxuXG5cdC8vIFRoaXMgaXMgbm90IGV4YWN0bHkgbmVhdCBidXQgYXZvaWQgdG8gY2FsbFxuXHQvLyBUaGUgbWV0aG9kICdmbGlja3IudGVzdC5sb2dpbicgZm9yIGVhY2ggYXBpIGNhbGxcblxuXHRmdW5jdGlvbiB3aXRoVXNlcihjYikge1xuXHRcdHZhciBhdXRoID0gaGVsbG8uZ2V0QXV0aFJlc3BvbnNlKCdmbGlja3InKTtcblx0XHRjYihhdXRoICYmIGF1dGgudXNlcl9uc2lkID8gYXV0aC51c2VyX25zaWQgOiBudWxsKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNpZ24odXJsLCBwYXJhbXMpIHtcblx0XHRpZiAoIXBhcmFtcykge1xuXHRcdFx0cGFyYW1zID0ge307XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHR3aXRoVXNlcihmdW5jdGlvbih1c2VySWQpIHtcblx0XHRcdFx0cGFyYW1zLnVzZXJfaWQgPSB1c2VySWQ7XG5cdFx0XHRcdGNhbGxiYWNrKGdldEFwaVVybCh1cmwsIHBhcmFtcywgdHJ1ZSkpO1xuXHRcdFx0fSk7XG5cdFx0fTtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldEJ1ZGR5SWNvbihwcm9maWxlLCBzaXplKSB7XG5cdFx0dmFyIHVybCA9ICdodHRwczovL3d3dy5mbGlja3IuY29tL2ltYWdlcy9idWRkeWljb24uZ2lmJztcblx0XHRpZiAocHJvZmlsZS5uc2lkICYmIHByb2ZpbGUuaWNvbnNlcnZlciAmJiBwcm9maWxlLmljb25mYXJtKSB7XG5cdFx0XHR1cmwgPSAnaHR0cHM6Ly9mYXJtJyArIHByb2ZpbGUuaWNvbmZhcm0gKyAnLnN0YXRpY2ZsaWNrci5jb20vJyArXG5cdFx0XHRcdHByb2ZpbGUuaWNvbnNlcnZlciArICcvJyArXG5cdFx0XHRcdCdidWRkeWljb25zLycgKyBwcm9maWxlLm5zaWQgK1xuXHRcdFx0XHQoKHNpemUpID8gJ18nICsgc2l6ZSA6ICcnKSArICcuanBnJztcblx0XHR9XG5cblx0XHRyZXR1cm4gdXJsO1xuXHR9XG5cblx0Ly8gU2VlOiBodHRwczovL3d3dy5mbGlja3IuY29tL3NlcnZpY2VzL2FwaS9taXNjLnVybHMuaHRtbFxuXHRmdW5jdGlvbiBjcmVhdGVQaG90b1VybChpZCwgZmFybSwgc2VydmVyLCBzZWNyZXQsIHNpemUpIHtcblx0XHRzaXplID0gKHNpemUpID8gJ18nICsgc2l6ZSA6ICcnO1xuXHRcdHJldHVybiAnaHR0cHM6Ly9mYXJtJyArIGZhcm0gKyAnLnN0YXRpY2ZsaWNrci5jb20vJyArIHNlcnZlciArICcvJyArIGlkICsgJ18nICsgc2VjcmV0ICsgc2l6ZSArICcuanBnJztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobykge1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RXJyb3Iobykge1xuXHRcdGlmIChvICYmIG8uc3RhdCAmJiBvLnN0YXQudG9Mb3dlckNhc2UoKSAhPSAnb2snKSB7XG5cdFx0XHRvLmVycm9yID0ge1xuXHRcdFx0XHRjb2RlOiAnaW52YWxpZF9yZXF1ZXN0Jyxcblx0XHRcdFx0bWVzc2FnZTogby5tZXNzYWdlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFBob3RvcyhvKSB7XG5cdFx0aWYgKG8ucGhvdG9zZXQgfHwgby5waG90b3MpIHtcblx0XHRcdHZhciBzZXQgPSAoJ3Bob3Rvc2V0JyBpbiBvKSA/ICdwaG90b3NldCcgOiAncGhvdG9zJztcblx0XHRcdG8gPSBjaGVja1Jlc3BvbnNlKG8sIHNldCk7XG5cdFx0XHRwYWdpbmcobyk7XG5cdFx0XHRvLmRhdGEgPSBvLnBob3RvO1xuXHRcdFx0ZGVsZXRlIG8ucGhvdG87XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG8uZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGhvdG8gPSBvLmRhdGFbaV07XG5cdFx0XHRcdHBob3RvLm5hbWUgPSBwaG90by50aXRsZTtcblx0XHRcdFx0cGhvdG8ucGljdHVyZSA9IGNyZWF0ZVBob3RvVXJsKHBob3RvLmlkLCBwaG90by5mYXJtLCBwaG90by5zZXJ2ZXIsIHBob3RvLnNlY3JldCwgJycpO1xuXHRcdFx0XHRwaG90by5waWN0dXJlcyA9IGNyZWF0ZVBpY3R1cmVzKHBob3RvLmlkLCBwaG90by5mYXJtLCBwaG90by5zZXJ2ZXIsIHBob3RvLnNlY3JldCk7XG5cdFx0XHRcdHBob3RvLnNvdXJjZSA9IGNyZWF0ZVBob3RvVXJsKHBob3RvLmlkLCBwaG90by5mYXJtLCBwaG90by5zZXJ2ZXIsIHBob3RvLnNlY3JldCwgJ2InKTtcblx0XHRcdFx0cGhvdG8udGh1bWJuYWlsID0gY3JlYXRlUGhvdG9VcmwocGhvdG8uaWQsIHBob3RvLmZhcm0sIHBob3RvLnNlcnZlciwgcGhvdG8uc2VjcmV0LCAnbScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0Ly8gU2VlOiBodHRwczovL3d3dy5mbGlja3IuY29tL3NlcnZpY2VzL2FwaS9taXNjLnVybHMuaHRtbFxuXHRmdW5jdGlvbiBjcmVhdGVQaWN0dXJlcyhpZCwgZmFybSwgc2VydmVyLCBzZWNyZXQpIHtcblxuXHRcdHZhciBOT19MSU1JVCA9IDIwNDg7XG5cdFx0dmFyIHNpemVzID0gW1xuXHRcdFx0e2lkOiAndCcsIG1heDogMTAwfSxcblx0XHRcdHtpZDogJ20nLCBtYXg6IDI0MH0sXG5cdFx0XHR7aWQ6ICduJywgbWF4OiAzMjB9LFxuXHRcdFx0e2lkOiAnJywgbWF4OiA1MDB9LFxuXHRcdFx0e2lkOiAneicsIG1heDogNjQwfSxcblx0XHRcdHtpZDogJ2MnLCBtYXg6IDgwMH0sXG5cdFx0XHR7aWQ6ICdiJywgbWF4OiAxMDI0fSxcblx0XHRcdHtpZDogJ2gnLCBtYXg6IDE2MDB9LFxuXHRcdFx0e2lkOiAnaycsIG1heDogMjA0OH0sXG5cdFx0XHR7aWQ6ICdvJywgbWF4OiBOT19MSU1JVH1cblx0XHRdO1xuXG5cdFx0cmV0dXJuIHNpemVzLm1hcChmdW5jdGlvbihzaXplKSB7XG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRzb3VyY2U6IGNyZWF0ZVBob3RvVXJsKGlkLCBmYXJtLCBzZXJ2ZXIsIHNlY3JldCwgc2l6ZS5pZCksXG5cblx0XHRcdFx0Ly8gTm90ZTogdGhpcyBpcyBhIGd1ZXNzIHRoYXQncyBhbG1vc3QgY2VydGFpbiB0byBiZSB3cm9uZyAodW5sZXNzIHNxdWFyZSBzb3VyY2UpXG5cdFx0XHRcdHdpZHRoOiBzaXplLm1heCxcblx0XHRcdFx0aGVpZ2h0OiBzaXplLm1heFxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGNoZWNrUmVzcG9uc2Uobywga2V5KSB7XG5cblx0XHRpZiAoa2V5IGluIG8pIHtcblx0XHRcdG8gPSBvW2tleV07XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCEoJ2Vycm9yJyBpbiBvKSkge1xuXHRcdFx0by5lcnJvciA9IHtcblx0XHRcdFx0Y29kZTogJ2ludmFsaWRfcmVxdWVzdCcsXG5cdFx0XHRcdG1lc3NhZ2U6IG8ubWVzc2FnZSB8fCAnRmFpbGVkIHRvIGdldCBkYXRhIGZyb20gRmxpY2tyJ1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyaWVuZHMobykge1xuXHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdGlmIChvLmNvbnRhY3RzKSB7XG5cdFx0XHRvID0gY2hlY2tSZXNwb25zZShvLCAnY29udGFjdHMnKTtcblx0XHRcdHBhZ2luZyhvKTtcblx0XHRcdG8uZGF0YSA9IG8uY29udGFjdDtcblx0XHRcdGRlbGV0ZSBvLmNvbnRhY3Q7XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IG8uZGF0YS5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgaXRlbSA9IG8uZGF0YVtpXTtcblx0XHRcdFx0aXRlbS5pZCA9IGl0ZW0ubnNpZDtcblx0XHRcdFx0aXRlbS5uYW1lID0gaXRlbS5yZWFsbmFtZSB8fCBpdGVtLnVzZXJuYW1lO1xuXHRcdFx0XHRpdGVtLnRodW1ibmFpbCA9IGdldEJ1ZGR5SWNvbihpdGVtLCAnbScpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFnaW5nKHJlcykge1xuXHRcdGlmIChyZXMucGFnZSAmJiByZXMucGFnZXMgJiYgcmVzLnBhZ2UgIT09IHJlcy5wYWdlcykge1xuXHRcdFx0cmVzLnBhZ2luZyA9IHtcblx0XHRcdFx0bmV4dDogJz9wYWdlPScgKyAoKytyZXMucGFnZSlcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cbn0pKGhlbGxvKTtcblxuKGZ1bmN0aW9uKGhlbGxvKSB7XG5cblx0aGVsbG8uaW5pdCh7XG5cblx0XHRmb3Vyc3F1YXJlOiB7XG5cblx0XHRcdG5hbWU6ICdGb3Vyc3F1YXJlJyxcblxuXHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0Ly8gU2VlOiBodHRwczovL2RldmVsb3Blci5mb3Vyc3F1YXJlLmNvbS9vdmVydmlldy9hdXRoXG5cdFx0XHRcdHZlcnNpb246IDIsXG5cdFx0XHRcdGF1dGg6ICdodHRwczovL2ZvdXJzcXVhcmUuY29tL29hdXRoMi9hdXRoZW50aWNhdGUnLFxuXHRcdFx0XHRncmFudDogJ2h0dHBzOi8vZm91cnNxdWFyZS5jb20vb2F1dGgyL2FjY2Vzc190b2tlbidcblx0XHRcdH0sXG5cblx0XHRcdC8vIFJlZnJlc2ggdGhlIGFjY2Vzc190b2tlbiBvbmNlIGV4cGlyZWRcblx0XHRcdHJlZnJlc2g6IHRydWUsXG5cblx0XHRcdGJhc2U6ICdodHRwczovL2FwaS5mb3Vyc3F1YXJlLmNvbS92Mi8nLFxuXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6ICd1c2Vycy9zZWxmJyxcblx0XHRcdFx0J21lL2ZyaWVuZHMnOiAndXNlcnMvc2VsZi9mcmllbmRzJyxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6ICd1c2Vycy9zZWxmL2ZyaWVuZHMnLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogJ3VzZXJzL3NlbGYvZnJpZW5kcydcblx0XHRcdH0sXG5cblx0XHRcdHdyYXA6IHtcblx0XHRcdFx0bWU6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblx0XHRcdFx0XHRpZiAobyAmJiBvLnJlc3BvbnNlKSB7XG5cdFx0XHRcdFx0XHRvID0gby5yZXNwb25zZS51c2VyO1xuXHRcdFx0XHRcdFx0Zm9ybWF0VXNlcihvKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnZGVmYXVsdCc6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblxuXHRcdFx0XHRcdC8vIEZvcm1hdCBmcmllbmRzXG5cdFx0XHRcdFx0aWYgKG8gJiYgJ3Jlc3BvbnNlJyBpbiBvICYmICdmcmllbmRzJyBpbiBvLnJlc3BvbnNlICYmICdpdGVtcycgaW4gby5yZXNwb25zZS5mcmllbmRzKSB7XG5cdFx0XHRcdFx0XHRvLmRhdGEgPSBvLnJlc3BvbnNlLmZyaWVuZHMuaXRlbXM7XG5cdFx0XHRcdFx0XHRvLmRhdGEuZm9yRWFjaChmb3JtYXRVc2VyKTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBvLnJlc3BvbnNlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHR4aHI6IGZvcm1hdFJlcXVlc3QsXG5cdFx0XHRqc29ucDogZm9ybWF0UmVxdWVzdFxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZm9ybWF0RXJyb3Iobykge1xuXHRcdGlmIChvLm1ldGEgJiYgKG8ubWV0YS5jb2RlID09PSA0MDAgfHwgby5tZXRhLmNvZGUgPT09IDQwMSkpIHtcblx0XHRcdG8uZXJyb3IgPSB7XG5cdFx0XHRcdGNvZGU6ICdhY2Nlc3NfZGVuaWVkJyxcblx0XHRcdFx0bWVzc2FnZTogby5tZXRhLmVycm9yRGV0YWlsXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobykge1xuXHRcdGlmIChvICYmIG8uaWQpIHtcblx0XHRcdG8udGh1bWJuYWlsID0gby5waG90by5wcmVmaXggKyAnMTAweDEwMCcgKyBvLnBob3RvLnN1ZmZpeDtcblx0XHRcdG8ubmFtZSA9IG8uZmlyc3ROYW1lICsgJyAnICsgby5sYXN0TmFtZTtcblx0XHRcdG8uZmlyc3RfbmFtZSA9IG8uZmlyc3ROYW1lO1xuXHRcdFx0by5sYXN0X25hbWUgPSBvLmxhc3ROYW1lO1xuXHRcdFx0aWYgKG8uY29udGFjdCkge1xuXHRcdFx0XHRpZiAoby5jb250YWN0LmVtYWlsKSB7XG5cdFx0XHRcdFx0by5lbWFpbCA9IG8uY29udGFjdC5lbWFpbDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFJlcXVlc3QocCwgcXMpIHtcblx0XHR2YXIgdG9rZW4gPSBxcy5hY2Nlc3NfdG9rZW47XG5cdFx0ZGVsZXRlIHFzLmFjY2Vzc190b2tlbjtcblx0XHRxcy5vYXV0aF90b2tlbiA9IHRva2VuO1xuXHRcdHFzLnYgPSAyMDEyMTEyNTtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG59KShoZWxsbyk7XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdGhlbGxvLmluaXQoe1xuXG5cdFx0Z2l0aHViOiB7XG5cblx0XHRcdG5hbWU6ICdHaXRIdWInLFxuXG5cdFx0XHRvYXV0aDoge1xuXHRcdFx0XHR2ZXJzaW9uOiAyLFxuXHRcdFx0XHRhdXRoOiAnaHR0cHM6Ly9naXRodWIuY29tL2xvZ2luL29hdXRoL2F1dGhvcml6ZScsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9naXRodWIuY29tL2xvZ2luL29hdXRoL2FjY2Vzc190b2tlbicsXG5cdFx0XHRcdHJlc3BvbnNlX3R5cGU6ICdjb2RlJ1xuXHRcdFx0fSxcblxuXHRcdFx0c2NvcGU6IHtcblx0XHRcdFx0YmFzaWM6ICcnLFxuXHRcdFx0XHRlbWFpbDogJ3VzZXI6ZW1haWwnXG5cdFx0XHR9LFxuXG5cdFx0XHRiYXNlOiAnaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS8nLFxuXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6ICd1c2VyJyxcblx0XHRcdFx0J21lL2ZyaWVuZHMnOiAndXNlci9mb2xsb3dpbmc/cGVyX3BhZ2U9QHtsaW1pdHwxMDB9Jyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6ICd1c2VyL2ZvbGxvd2luZz9wZXJfcGFnZT1Ae2xpbWl0fDEwMH0nLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogJ3VzZXIvZm9sbG93ZXJzP3Blcl9wYWdlPUB7bGltaXR8MTAwfScsXG5cdFx0XHRcdCdtZS9saWtlJzogJ3VzZXIvc3RhcnJlZD9wZXJfcGFnZT1Ae2xpbWl0fDEwMH0nXG5cdFx0XHR9LFxuXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihvLCBoZWFkZXJzKSB7XG5cblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvLCBoZWFkZXJzKTtcblx0XHRcdFx0XHRmb3JtYXRVc2VyKG8pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J2RlZmF1bHQnOiBmdW5jdGlvbihvLCBoZWFkZXJzLCByZXEpIHtcblxuXHRcdFx0XHRcdGZvcm1hdEVycm9yKG8sIGhlYWRlcnMpO1xuXG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkobykpIHtcblx0XHRcdFx0XHRcdG8gPSB7ZGF0YTpvfTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRpZiAoby5kYXRhKSB7XG5cdFx0XHRcdFx0XHRwYWdpbmcobywgaGVhZGVycywgcmVxKTtcblx0XHRcdFx0XHRcdG8uZGF0YS5mb3JFYWNoKGZvcm1hdFVzZXIpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHR4aHI6IGZ1bmN0aW9uKHApIHtcblxuXHRcdFx0XHRpZiAocC5tZXRob2QgIT09ICdnZXQnICYmIHAuZGF0YSkge1xuXG5cdFx0XHRcdFx0Ly8gU2VyaWFsaXplIHBheWxvYWQgYXMgSlNPTlxuXHRcdFx0XHRcdHAuaGVhZGVycyA9IHAuaGVhZGVycyB8fCB7fTtcblx0XHRcdFx0XHRwLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgKHAuZGF0YSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdFx0XHRwLmRhdGEgPSBKU09OLnN0cmluZ2lmeShwLmRhdGEpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZm9ybWF0RXJyb3IobywgaGVhZGVycykge1xuXHRcdHZhciBjb2RlID0gaGVhZGVycyA/IGhlYWRlcnMuc3RhdHVzQ29kZSA6IChvICYmICdtZXRhJyBpbiBvICYmICdzdGF0dXMnIGluIG8ubWV0YSAmJiBvLm1ldGEuc3RhdHVzKTtcblx0XHRpZiAoKGNvZGUgPT09IDQwMSB8fCBjb2RlID09PSA0MDMpKSB7XG5cdFx0XHRvLmVycm9yID0ge1xuXHRcdFx0XHRjb2RlOiAnYWNjZXNzX2RlbmllZCcsXG5cdFx0XHRcdG1lc3NhZ2U6IG8ubWVzc2FnZSB8fCAoby5kYXRhID8gby5kYXRhLm1lc3NhZ2UgOiAnQ291bGQgbm90IGdldCByZXNwb25zZScpXG5cdFx0XHR9O1xuXHRcdFx0ZGVsZXRlIG8ubWVzc2FnZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRVc2VyKG8pIHtcblx0XHRpZiAoby5pZCkge1xuXHRcdFx0by50aHVtYm5haWwgPSBvLnBpY3R1cmUgPSBvLmF2YXRhcl91cmw7XG5cdFx0XHRvLm5hbWUgPSBvLmxvZ2luO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIHBhZ2luZyhyZXMsIGhlYWRlcnMsIHJlcSkge1xuXHRcdGlmIChyZXMuZGF0YSAmJiByZXMuZGF0YS5sZW5ndGggJiYgaGVhZGVycyAmJiBoZWFkZXJzLkxpbmspIHtcblx0XHRcdHZhciBuZXh0ID0gaGVhZGVycy5MaW5rLm1hdGNoKC88KC4qPyk+O1xccypyZWw9XFxcIm5leHRcXFwiLyk7XG5cdFx0XHRpZiAobmV4dCkge1xuXHRcdFx0XHRyZXMucGFnaW5nID0ge1xuXHRcdFx0XHRcdG5leHQ6IG5leHRbMV1cblx0XHRcdFx0fTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxufSkoaGVsbG8pO1xuXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHR2YXIgY29udGFjdHNVcmwgPSAnaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9tOC9mZWVkcy9jb250YWN0cy9kZWZhdWx0L2Z1bGw/dj0zLjAmYWx0PWpzb24mbWF4LXJlc3VsdHM9QHtsaW1pdHwxMDAwfSZzdGFydC1pbmRleD1Ae3N0YXJ0fDF9JztcblxuXHRoZWxsby5pbml0KHtcblxuXHRcdGdvb2dsZToge1xuXG5cdFx0XHRuYW1lOiAnR29vZ2xlIFBsdXMnLFxuXG5cdFx0XHQvLyBTZWU6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vYXBpcy9hY2NvdW50cy9kb2NzL09BdXRoMlVzZXJBZ2VudC5odG1sXG5cdFx0XHRvYXV0aDoge1xuXHRcdFx0XHR2ZXJzaW9uOiAyLFxuXHRcdFx0XHRhdXRoOiAnaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgnLFxuXHRcdFx0XHRncmFudDogJ2h0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbS9vL29hdXRoMi90b2tlbidcblx0XHRcdH0sXG5cblx0XHRcdC8vIEF1dGhvcml6YXRpb24gc2NvcGVzXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRiYXNpYzogJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvcGx1cy5tZSBwcm9maWxlJyxcblx0XHRcdFx0ZW1haWw6ICdlbWFpbCcsXG5cdFx0XHRcdGJpcnRoZGF5OiAnJyxcblx0XHRcdFx0ZXZlbnRzOiAnJyxcblx0XHRcdFx0cGhvdG9zOiAnaHR0cHM6Ly9waWNhc2F3ZWIuZ29vZ2xlLmNvbS9kYXRhLycsXG5cdFx0XHRcdHZpZGVvczogJ2h0dHA6Ly9nZGF0YS55b3V0dWJlLmNvbScsXG5cdFx0XHRcdGZyaWVuZHM6ICdodHRwczovL3d3dy5nb29nbGUuY29tL204L2ZlZWRzLCBodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9hdXRoL3BsdXMubG9naW4nLFxuXHRcdFx0XHRmaWxlczogJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvZHJpdmUucmVhZG9ubHknLFxuXHRcdFx0XHRwdWJsaXNoOiAnJyxcblx0XHRcdFx0cHVibGlzaF9maWxlczogJ2h0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL2F1dGgvZHJpdmUnLFxuXHRcdFx0XHRjcmVhdGVfZXZlbnQ6ICcnLFxuXHRcdFx0XHRvZmZsaW5lX2FjY2VzczogJydcblx0XHRcdH0sXG5cblx0XHRcdHNjb3BlX2RlbGltOiAnICcsXG5cblx0XHRcdGxvZ2luOiBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmIChwLnFzLmRpc3BsYXkgPT09ICdub25lJykge1xuXHRcdFx0XHRcdC8vIEdvb2dsZSBkb2Vzbid0IGxpa2UgZGlzcGxheT1ub25lXG5cdFx0XHRcdFx0cC5xcy5kaXNwbGF5ID0gJyc7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAocC5xcy5yZXNwb25zZV90eXBlID09PSAnY29kZScpIHtcblxuXHRcdFx0XHRcdC8vIExldCdzIHNldCB0aGlzIHRvIGFuIG9mZmxpbmUgYWNjZXNzIHRvIHJldHVybiBhIHJlZnJlc2hfdG9rZW5cblx0XHRcdFx0XHRwLnFzLmFjY2Vzc190eXBlID0gJ29mZmxpbmUnO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVhdXRoZW50aWNhdGVcblx0XHRcdFx0Ly8gaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvcHJvdG9jb2xzL1xuXHRcdFx0XHRpZiAocC5vcHRpb25zLmZvcmNlKSB7XG5cdFx0XHRcdFx0cC5xcy5hcHByb3ZhbF9wcm9tcHQgPSAnZm9yY2UnO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBBUEkgYmFzZSBVUklcblx0XHRcdGJhc2U6ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS8nLFxuXG5cdFx0XHQvLyBNYXAgR0VUIHJlcXVlc3RzXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6ICdwbHVzL3YxL3Blb3BsZS9tZScsXG5cblx0XHRcdFx0Ly8gRGVwcmVjYXRlZCBTZXB0IDEsIDIwMTRcblx0XHRcdFx0Ly8nbWUnOiAnb2F1dGgyL3YxL3VzZXJpbmZvP2FsdD1qc29uJyxcblxuXHRcdFx0XHQvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tLysvYXBpL2xhdGVzdC9wZW9wbGUvbGlzdFxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6ICdwbHVzL3YxL3Blb3BsZS9tZS9wZW9wbGUvdmlzaWJsZT9tYXhSZXN1bHRzPUB7bGltaXR8MTAwfScsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiBjb250YWN0c1VybCxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6IGNvbnRhY3RzVXJsLFxuXHRcdFx0XHQnbWUvY29udGFjdHMnOiBjb250YWN0c1VybCxcblx0XHRcdFx0J21lL3NoYXJlJzogJ3BsdXMvdjEvcGVvcGxlL21lL2FjdGl2aXRpZXMvcHVibGljP21heFJlc3VsdHM9QHtsaW1pdHwxMDB9Jyxcblx0XHRcdFx0J21lL2ZlZWQnOiAncGx1cy92MS9wZW9wbGUvbWUvYWN0aXZpdGllcy9wdWJsaWM/bWF4UmVzdWx0cz1Ae2xpbWl0fDEwMH0nLFxuXHRcdFx0XHQnbWUvYWxidW1zJzogJ2h0dHBzOi8vcGljYXNhd2ViLmdvb2dsZS5jb20vZGF0YS9mZWVkL2FwaS91c2VyL2RlZmF1bHQ/YWx0PWpzb24mbWF4LXJlc3VsdHM9QHtsaW1pdHwxMDB9JnN0YXJ0LWluZGV4PUB7c3RhcnR8MX0nLFxuXHRcdFx0XHQnbWUvYWxidW0nOiBmdW5jdGlvbihwLCBjYWxsYmFjaykge1xuXHRcdFx0XHRcdHZhciBrZXkgPSBwLnF1ZXJ5LmlkO1xuXHRcdFx0XHRcdGRlbGV0ZSBwLnF1ZXJ5LmlkO1xuXHRcdFx0XHRcdGNhbGxiYWNrKGtleS5yZXBsYWNlKCcvZW50cnkvJywgJy9mZWVkLycpKTtcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnbWUvcGhvdG9zJzogJ2h0dHBzOi8vcGljYXNhd2ViLmdvb2dsZS5jb20vZGF0YS9mZWVkL2FwaS91c2VyL2RlZmF1bHQ/YWx0PWpzb24ma2luZD1waG90byZtYXgtcmVzdWx0cz1Ae2xpbWl0fDEwMH0mc3RhcnQtaW5kZXg9QHtzdGFydHwxfScsXG5cblx0XHRcdFx0Ly8gU2VlOiBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9kcml2ZS92Mi9yZWZlcmVuY2UvZmlsZXMvbGlzdFxuXHRcdFx0XHQnbWUvZmlsZXMnOiAnZHJpdmUvdjIvZmlsZXM/cT0lMjJAe3BhcmVudHxyb290fSUyMitpbitwYXJlbnRzK2FuZCt0cmFzaGVkPWZhbHNlJm1heFJlc3VsdHM9QHtsaW1pdHwxMDB9JyxcblxuXHRcdFx0XHQvLyBTZWU6IGh0dHBzOi8vZGV2ZWxvcGVycy5nb29nbGUuY29tL2RyaXZlL3YyL3JlZmVyZW5jZS9maWxlcy9saXN0XG5cdFx0XHRcdCdtZS9mb2xkZXJzJzogJ2RyaXZlL3YyL2ZpbGVzP3E9JTIyQHtpZHxyb290fSUyMitpbitwYXJlbnRzK2FuZCttaW1lVHlwZSs9KyUyMmFwcGxpY2F0aW9uL3ZuZC5nb29nbGUtYXBwcy5mb2xkZXIlMjIrYW5kK3RyYXNoZWQ9ZmFsc2UmbWF4UmVzdWx0cz1Ae2xpbWl0fDEwMH0nLFxuXG5cdFx0XHRcdC8vIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vZHJpdmUvdjIvcmVmZXJlbmNlL2ZpbGVzL2xpc3Rcblx0XHRcdFx0J21lL2ZvbGRlcic6ICdkcml2ZS92Mi9maWxlcz9xPSUyMkB7aWR8cm9vdH0lMjIraW4rcGFyZW50cythbmQrdHJhc2hlZD1mYWxzZSZtYXhSZXN1bHRzPUB7bGltaXR8MTAwfSdcblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBQT1NUIHJlcXVlc3RzXG5cdFx0XHRwb3N0OiB7XG5cblx0XHRcdFx0Ly8gR29vZ2xlIERyaXZlXG5cdFx0XHRcdCdtZS9maWxlcyc6IHVwbG9hZERyaXZlLFxuXHRcdFx0XHQnbWUvZm9sZGVycyc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0cC5kYXRhID0ge1xuXHRcdFx0XHRcdFx0dGl0bGU6IHAuZGF0YS5uYW1lLFxuXHRcdFx0XHRcdFx0cGFyZW50czogW3tpZDogcC5kYXRhLnBhcmVudCB8fCAncm9vdCd9XSxcblx0XHRcdFx0XHRcdG1pbWVUeXBlOiAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLmZvbGRlcidcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGNhbGxiYWNrKCdkcml2ZS92Mi9maWxlcycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBNYXAgUFVUIHJlcXVlc3RzXG5cdFx0XHRwdXQ6IHtcblx0XHRcdFx0J21lL2ZpbGVzJzogdXBsb2FkRHJpdmVcblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBERUxFVEUgcmVxdWVzdHNcblx0XHRcdGRlbDoge1xuXHRcdFx0XHQnbWUvZmlsZXMnOiAnZHJpdmUvdjIvZmlsZXMvQHtpZH0nLFxuXHRcdFx0XHQnbWUvZm9sZGVyJzogJ2RyaXZlL3YyL2ZpbGVzL0B7aWR9J1xuXHRcdFx0fSxcblxuXHRcdFx0d3JhcDoge1xuXHRcdFx0XHRtZTogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGlmIChvLmlkKSB7XG5cdFx0XHRcdFx0XHRvLmxhc3RfbmFtZSA9IG8uZmFtaWx5X25hbWUgfHwgKG8ubmFtZSA/IG8ubmFtZS5mYW1pbHlOYW1lIDogbnVsbCk7XG5cdFx0XHRcdFx0XHRvLmZpcnN0X25hbWUgPSBvLmdpdmVuX25hbWUgfHwgKG8ubmFtZSA/IG8ubmFtZS5naXZlbk5hbWUgOiBudWxsKTtcblxuXHRcdFx0XHRcdFx0aWYgKG8uZW1haWxzICYmIG8uZW1haWxzLmxlbmd0aCkge1xuXHRcdFx0XHRcdFx0XHRvLmVtYWlsID0gby5lbWFpbHNbMF0udmFsdWU7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGZvcm1hdFBlcnNvbihvKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IGZ1bmN0aW9uKG8pIHtcblx0XHRcdFx0XHRpZiAoby5pdGVtcykge1xuXHRcdFx0XHRcdFx0cGFnaW5nKG8pO1xuXHRcdFx0XHRcdFx0by5kYXRhID0gby5pdGVtcztcblx0XHRcdFx0XHRcdG8uZGF0YS5mb3JFYWNoKGZvcm1hdFBlcnNvbik7XG5cdFx0XHRcdFx0XHRkZWxldGUgby5pdGVtcztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnbWUvY29udGFjdHMnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9zaGFyZSc6IGZvcm1hdEZlZWQsXG5cdFx0XHRcdCdtZS9mZWVkJzogZm9ybWF0RmVlZCxcblx0XHRcdFx0J21lL2FsYnVtcyc6IGdFbnRyeSxcblx0XHRcdFx0J21lL3Bob3Rvcyc6IGZvcm1hdFBob3Rvcyxcblx0XHRcdFx0J2RlZmF1bHQnOiBnRW50cnlcblx0XHRcdH0sXG5cblx0XHRcdHhocjogZnVuY3Rpb24ocCkge1xuXG5cdFx0XHRcdGlmIChwLm1ldGhvZCA9PT0gJ3Bvc3QnIHx8IHAubWV0aG9kID09PSAncHV0Jykge1xuXHRcdFx0XHRcdHRvSlNPTihwKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gRG9uJ3QgZXZlbiB0cnkgc3VibWl0dGluZyB2aWEgZm9ybS5cblx0XHRcdC8vIFRoaXMgbWVhbnMgbm8gUE9TVCBvcGVyYXRpb25zIGluIDw9SUU5XG5cdFx0XHRmb3JtOiBmYWxzZVxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gdG9JbnQocykge1xuXHRcdHJldHVybiBwYXJzZUludChzLCAxMCk7XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRGZWVkKG8pIHtcblx0XHRwYWdpbmcobyk7XG5cdFx0by5kYXRhID0gby5pdGVtcztcblx0XHRkZWxldGUgby5pdGVtcztcblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdC8vIEZvcm1hdDogZW5zdXJlIGVhY2ggcmVjb3JkIGNvbnRhaW5zIGEgbmFtZSwgaWQgZXRjLlxuXHRmdW5jdGlvbiBmb3JtYXRJdGVtKG8pIHtcblx0XHRpZiAoby5lcnJvcikge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblxuXHRcdGlmICghby5uYW1lKSB7XG5cdFx0XHRvLm5hbWUgPSBvLnRpdGxlIHx8IG8ubWVzc2FnZTtcblx0XHR9XG5cblx0XHRpZiAoIW8ucGljdHVyZSkge1xuXHRcdFx0by5waWN0dXJlID0gby50aHVtYm5haWxMaW5rO1xuXHRcdH1cblxuXHRcdGlmICghby50aHVtYm5haWwpIHtcblx0XHRcdG8udGh1bWJuYWlsID0gby50aHVtYm5haWxMaW5rO1xuXHRcdH1cblxuXHRcdGlmIChvLm1pbWVUeXBlID09PSAnYXBwbGljYXRpb24vdm5kLmdvb2dsZS1hcHBzLmZvbGRlcicpIHtcblx0XHRcdG8udHlwZSA9ICdmb2xkZXInO1xuXHRcdFx0by5maWxlcyA9ICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9kcml2ZS92Mi9maWxlcz9xPSUyMicgKyBvLmlkICsgJyUyMitpbitwYXJlbnRzJztcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEltYWdlKGltYWdlKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdHNvdXJjZTogaW1hZ2UudXJsLFxuXHRcdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlnaHRcblx0XHR9O1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0UGhvdG9zKG8pIHtcblx0XHRvLmRhdGEgPSBvLmZlZWQuZW50cnkubWFwKGZvcm1hdEVudHJ5KTtcblx0XHRkZWxldGUgby5mZWVkO1xuXHR9XG5cblx0Ly8gR29vZ2xlIGhhcyBhIGhvcnJpYmxlIEpTT04gQVBJXG5cdGZ1bmN0aW9uIGdFbnRyeShvKSB7XG5cdFx0cGFnaW5nKG8pO1xuXG5cdFx0aWYgKCdmZWVkJyBpbiBvICYmICdlbnRyeScgaW4gby5mZWVkKSB7XG5cdFx0XHRvLmRhdGEgPSBvLmZlZWQuZW50cnkubWFwKGZvcm1hdEVudHJ5KTtcblx0XHRcdGRlbGV0ZSBvLmZlZWQ7XG5cdFx0fVxuXG5cdFx0Ly8gT2xkIHN0eWxlOiBQaWNhc2EsIGV0Yy5cblx0XHRlbHNlIGlmICgnZW50cnknIGluIG8pIHtcblx0XHRcdHJldHVybiBmb3JtYXRFbnRyeShvLmVudHJ5KTtcblx0XHR9XG5cblx0XHQvLyBOZXcgc3R5bGU6IEdvb2dsZSBEcml2ZSAmIFBsdXNcblx0XHRlbHNlIGlmICgnaXRlbXMnIGluIG8pIHtcblx0XHRcdG8uZGF0YSA9IG8uaXRlbXMubWFwKGZvcm1hdEl0ZW0pO1xuXHRcdFx0ZGVsZXRlIG8uaXRlbXM7XG5cdFx0fVxuXHRcdGVsc2Uge1xuXHRcdFx0Zm9ybWF0SXRlbShvKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFBlcnNvbihvKSB7XG5cdFx0by5uYW1lID0gby5kaXNwbGF5TmFtZSB8fCBvLm5hbWU7XG5cdFx0by5waWN0dXJlID0gby5waWN0dXJlIHx8IChvLmltYWdlID8gby5pbWFnZS51cmwgOiBudWxsKTtcblx0XHRvLnRodW1ibmFpbCA9IG8ucGljdHVyZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyaWVuZHMobywgaGVhZGVycywgcmVxKSB7XG5cdFx0cGFnaW5nKG8pO1xuXHRcdHZhciByID0gW107XG5cdFx0aWYgKCdmZWVkJyBpbiBvICYmICdlbnRyeScgaW4gby5mZWVkKSB7XG5cdFx0XHR2YXIgdG9rZW4gPSByZXEucXVlcnkuYWNjZXNzX3Rva2VuO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBvLmZlZWQuZW50cnkubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGEgPSBvLmZlZWQuZW50cnlbaV07XG5cblx0XHRcdFx0YS5pZFx0PSBhLmlkLiR0O1xuXHRcdFx0XHRhLm5hbWVcdD0gYS50aXRsZS4kdDtcblx0XHRcdFx0ZGVsZXRlIGEudGl0bGU7XG5cdFx0XHRcdGlmIChhLmdkJGVtYWlsKSB7XG5cdFx0XHRcdFx0YS5lbWFpbFx0PSAoYS5nZCRlbWFpbCAmJiBhLmdkJGVtYWlsLmxlbmd0aCA+IDApID8gYS5nZCRlbWFpbFswXS5hZGRyZXNzIDogbnVsbDtcblx0XHRcdFx0XHRhLmVtYWlscyA9IGEuZ2QkZW1haWw7XG5cdFx0XHRcdFx0ZGVsZXRlIGEuZ2QkZW1haWw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAoYS51cGRhdGVkKSB7XG5cdFx0XHRcdFx0YS51cGRhdGVkID0gYS51cGRhdGVkLiR0O1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGEubGluaykge1xuXG5cdFx0XHRcdFx0dmFyIHBpYyA9IChhLmxpbmsubGVuZ3RoID4gMCkgPyBhLmxpbmtbMF0uaHJlZiA6IG51bGw7XG5cdFx0XHRcdFx0aWYgKHBpYyAmJiBhLmxpbmtbMF0uZ2QkZXRhZykge1xuXHRcdFx0XHRcdFx0cGljICs9IChwaWMuaW5kZXhPZignPycpID4gLTEgPyAnJicgOiAnPycpICsgJ2FjY2Vzc190b2tlbj0nICsgdG9rZW47XG5cdFx0XHRcdFx0XHRhLnBpY3R1cmUgPSBwaWM7XG5cdFx0XHRcdFx0XHRhLnRodW1ibmFpbCA9IHBpYztcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRkZWxldGUgYS5saW5rO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKGEuY2F0ZWdvcnkpIHtcblx0XHRcdFx0XHRkZWxldGUgYS5jYXRlZ29yeTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRvLmRhdGEgPSBvLmZlZWQuZW50cnk7XG5cdFx0XHRkZWxldGUgby5mZWVkO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RW50cnkoYSkge1xuXG5cdFx0dmFyIGdyb3VwID0gYS5tZWRpYSRncm91cDtcblx0XHR2YXIgcGhvdG8gPSBncm91cC5tZWRpYSRjb250ZW50Lmxlbmd0aCA/IGdyb3VwLm1lZGlhJGNvbnRlbnRbMF0gOiB7fTtcblx0XHR2YXIgbWVkaWFDb250ZW50ID0gZ3JvdXAubWVkaWEkY29udGVudCB8fCBbXTtcblx0XHR2YXIgbWVkaWFUaHVtYm5haWwgPSBncm91cC5tZWRpYSR0aHVtYm5haWwgfHwgW107XG5cblx0XHR2YXIgcGljdHVyZXMgPSBtZWRpYUNvbnRlbnRcblx0XHRcdC5jb25jYXQobWVkaWFUaHVtYm5haWwpXG5cdFx0XHQubWFwKGZvcm1hdEltYWdlKVxuXHRcdFx0LnNvcnQoZnVuY3Rpb24oYSwgYikge1xuXHRcdFx0XHRyZXR1cm4gYS53aWR0aCAtIGIud2lkdGg7XG5cdFx0XHR9KTtcblxuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgX2E7XG5cdFx0dmFyIHAgPSB7XG5cdFx0XHRpZDogYS5pZC4kdCxcblx0XHRcdG5hbWU6IGEudGl0bGUuJHQsXG5cdFx0XHRkZXNjcmlwdGlvbjogYS5zdW1tYXJ5LiR0LFxuXHRcdFx0dXBkYXRlZF90aW1lOiBhLnVwZGF0ZWQuJHQsXG5cdFx0XHRjcmVhdGVkX3RpbWU6IGEucHVibGlzaGVkLiR0LFxuXHRcdFx0cGljdHVyZTogcGhvdG8gPyBwaG90by51cmwgOiBudWxsLFxuXHRcdFx0cGljdHVyZXM6IHBpY3R1cmVzLFxuXHRcdFx0aW1hZ2VzOiBbXSxcblx0XHRcdHRodW1ibmFpbDogcGhvdG8gPyBwaG90by51cmwgOiBudWxsLFxuXHRcdFx0d2lkdGg6IHBob3RvLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBwaG90by5oZWlnaHRcblx0XHR9O1xuXG5cdFx0Ly8gR2V0IGZlZWQvY2hpbGRyZW5cblx0XHRpZiAoJ2xpbmsnIGluIGEpIHtcblx0XHRcdGZvciAoaSA9IDA7IGkgPCBhLmxpbmsubGVuZ3RoOyBpKyspIHtcblx0XHRcdFx0dmFyIGQgPSBhLmxpbmtbaV07XG5cdFx0XHRcdGlmIChkLnJlbC5tYXRjaCgvXFwjZmVlZCQvKSkge1xuXHRcdFx0XHRcdHAudXBsb2FkX2xvY2F0aW9uID0gcC5maWxlcyA9IHAucGhvdG9zID0gZC5ocmVmO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlcyBvZiBkaWZmZXJlbnQgc2NhbGVzXG5cdFx0aWYgKCdjYXRlZ29yeScgaW4gYSAmJiBhLmNhdGVnb3J5Lmxlbmd0aCkge1xuXHRcdFx0X2EgPSBhLmNhdGVnb3J5O1xuXHRcdFx0Zm9yIChpID0gMDsgaSA8IF9hLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdGlmIChfYVtpXS5zY2hlbWUgJiYgX2FbaV0uc2NoZW1lLm1hdGNoKC9cXCNraW5kJC8pKSB7XG5cdFx0XHRcdFx0cC50eXBlID0gX2FbaV0udGVybS5yZXBsYWNlKC9eLio/XFwjLywgJycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gR2V0IGltYWdlcyBvZiBkaWZmZXJlbnQgc2NhbGVzXG5cdFx0aWYgKCdtZWRpYSR0aHVtYm5haWwnIGluIGdyb3VwICYmIGdyb3VwLm1lZGlhJHRodW1ibmFpbC5sZW5ndGgpIHtcblx0XHRcdF9hID0gZ3JvdXAubWVkaWEkdGh1bWJuYWlsO1xuXHRcdFx0cC50aHVtYm5haWwgPSBfYVswXS51cmw7XG5cdFx0XHRwLmltYWdlcyA9IF9hLm1hcChmb3JtYXRJbWFnZSk7XG5cdFx0fVxuXG5cdFx0X2EgPSBncm91cC5tZWRpYSRjb250ZW50O1xuXG5cdFx0aWYgKF9hICYmIF9hLmxlbmd0aCkge1xuXHRcdFx0cC5pbWFnZXMucHVzaChmb3JtYXRJbWFnZShfYVswXSkpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFnaW5nKHJlcykge1xuXG5cdFx0Ly8gQ29udGFjdHMgVjJcblx0XHRpZiAoJ2ZlZWQnIGluIHJlcyAmJiByZXMuZmVlZC5vcGVuU2VhcmNoJGl0ZW1zUGVyUGFnZSkge1xuXHRcdFx0dmFyIGxpbWl0ID0gdG9JbnQocmVzLmZlZWQub3BlblNlYXJjaCRpdGVtc1BlclBhZ2UuJHQpO1xuXHRcdFx0dmFyIHN0YXJ0ID0gdG9JbnQocmVzLmZlZWQub3BlblNlYXJjaCRzdGFydEluZGV4LiR0KTtcblx0XHRcdHZhciB0b3RhbCA9IHRvSW50KHJlcy5mZWVkLm9wZW5TZWFyY2gkdG90YWxSZXN1bHRzLiR0KTtcblxuXHRcdFx0aWYgKChzdGFydCArIGxpbWl0KSA8IHRvdGFsKSB7XG5cdFx0XHRcdHJlcy5wYWdpbmcgPSB7XG5cdFx0XHRcdFx0bmV4dDogJz9zdGFydD0nICsgKHN0YXJ0ICsgbGltaXQpXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVsc2UgaWYgKCduZXh0UGFnZVRva2VuJyBpbiByZXMpIHtcblx0XHRcdHJlcy5wYWdpbmcgPSB7XG5cdFx0XHRcdG5leHQ6ICc/cGFnZVRva2VuPScgKyByZXMubmV4dFBhZ2VUb2tlblxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHQvLyBDb25zdHJ1Y3QgYSBtdWx0aXBhcnQgbWVzc2FnZVxuXHRmdW5jdGlvbiBNdWx0aXBhcnQoKSB7XG5cblx0XHQvLyBJbnRlcm5hbCBib2R5XG5cdFx0dmFyIGJvZHkgPSBbXTtcblx0XHR2YXIgYm91bmRhcnkgPSAoTWF0aC5yYW5kb20oKSAqIDFlMTApLnRvU3RyaW5nKDMyKTtcblx0XHR2YXIgY291bnRlciA9IDA7XG5cdFx0dmFyIGxpbmVCcmVhayA9ICdcXHJcXG4nO1xuXHRcdHZhciBkZWxpbSA9IGxpbmVCcmVhayArICctLScgKyBib3VuZGFyeTtcblx0XHR2YXIgcmVhZHkgPSBmdW5jdGlvbigpIHt9O1xuXG5cdFx0dmFyIGRhdGFVcmkgPSAvXmRhdGFcXDooW147LF0rKFxcO2NoYXJzZXQ9W147LF0rKT8pKFxcO2Jhc2U2NCk/LC9pO1xuXG5cdFx0Ly8gQWRkIGZpbGVcblx0XHRmdW5jdGlvbiBhZGRGaWxlKGl0ZW0pIHtcblx0XHRcdHZhciBmciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRmci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGFkZENvbnRlbnQoYnRvYShlLnRhcmdldC5yZXN1bHQpLCBpdGVtLnR5cGUgKyBsaW5lQnJlYWsgKyAnQ29udGVudC1UcmFuc2Zlci1FbmNvZGluZzogYmFzZTY0Jyk7XG5cdFx0XHR9O1xuXG5cdFx0XHRmci5yZWFkQXNCaW5hcnlTdHJpbmcoaXRlbSk7XG5cdFx0fVxuXG5cdFx0Ly8gQWRkIGNvbnRlbnRcblx0XHRmdW5jdGlvbiBhZGRDb250ZW50KGNvbnRlbnQsIHR5cGUpIHtcblx0XHRcdGJvZHkucHVzaChsaW5lQnJlYWsgKyAnQ29udGVudC1UeXBlOiAnICsgdHlwZSArIGxpbmVCcmVhayArIGxpbmVCcmVhayArIGNvbnRlbnQpO1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdFx0cmVhZHkoKTtcblx0XHR9XG5cblx0XHQvLyBBZGQgbmV3IHRoaW5ncyB0byB0aGUgb2JqZWN0XG5cdFx0dGhpcy5hcHBlbmQgPSBmdW5jdGlvbihjb250ZW50LCB0eXBlKSB7XG5cblx0XHRcdC8vIERvZXMgdGhlIGNvbnRlbnQgaGF2ZSBhbiBhcnJheVxuXHRcdFx0aWYgKHR5cGVvZiAoY29udGVudCkgPT09ICdzdHJpbmcnIHx8ICEoJ2xlbmd0aCcgaW4gT2JqZWN0KGNvbnRlbnQpKSkge1xuXHRcdFx0XHQvLyBDb252ZXJ0aSB0byBtdWx0aXBsZXNcblx0XHRcdFx0Y29udGVudCA9IFtjb250ZW50XTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjb250ZW50Lmxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdFx0Y291bnRlcisrO1xuXG5cdFx0XHRcdHZhciBpdGVtID0gY29udGVudFtpXTtcblxuXHRcdFx0XHQvLyBJcyB0aGlzIGEgZmlsZT9cblx0XHRcdFx0Ly8gRmlsZXMgY2FuIGJlIGVpdGhlciBCbG9icyBvciBGaWxlIHR5cGVzXG5cdFx0XHRcdGlmIChcblx0XHRcdFx0XHQodHlwZW9mIChGaWxlKSAhPT0gJ3VuZGVmaW5lZCcgJiYgaXRlbSBpbnN0YW5jZW9mIEZpbGUpIHx8XG5cdFx0XHRcdFx0KHR5cGVvZiAoQmxvYikgIT09ICd1bmRlZmluZWQnICYmIGl0ZW0gaW5zdGFuY2VvZiBCbG9iKVxuXHRcdFx0XHQpIHtcblx0XHRcdFx0XHQvLyBSZWFkIHRoZSBmaWxlIGluXG5cdFx0XHRcdFx0YWRkRmlsZShpdGVtKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIERhdGEtVVJJP1xuXHRcdFx0XHQvLyBEYXRhOls8bWltZSB0eXBlPl1bO2NoYXJzZXQ9PGNoYXJzZXQ+XVs7YmFzZTY0XSw8ZW5jb2RlZCBkYXRhPlxuXHRcdFx0XHQvLyAvXmRhdGFcXDooW147LF0rKFxcO2NoYXJzZXQ9W147LF0rKT8pKFxcO2Jhc2U2NCk/LC9pXG5cdFx0XHRcdGVsc2UgaWYgKHR5cGVvZiAoaXRlbSkgPT09ICdzdHJpbmcnICYmIGl0ZW0ubWF0Y2goZGF0YVVyaSkpIHtcblx0XHRcdFx0XHR2YXIgbSA9IGl0ZW0ubWF0Y2goZGF0YVVyaSk7XG5cdFx0XHRcdFx0YWRkQ29udGVudChpdGVtLnJlcGxhY2UoZGF0YVVyaSwgJycpLCBtWzFdICsgbGluZUJyZWFrICsgJ0NvbnRlbnQtVHJhbnNmZXItRW5jb2Rpbmc6IGJhc2U2NCcpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gUmVndWxhciBzdHJpbmdcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0YWRkQ29udGVudChpdGVtLCB0eXBlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cblx0XHR0aGlzLm9ucmVhZHkgPSBmdW5jdGlvbihmbikge1xuXHRcdFx0cmVhZHkgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKGNvdW50ZXIgPT09IDApIHtcblx0XHRcdFx0XHQvLyBUcmlnZ2VyIHJlYWR5XG5cdFx0XHRcdFx0Ym9keS51bnNoaWZ0KCcnKTtcblx0XHRcdFx0XHRib2R5LnB1c2goJy0tJyk7XG5cdFx0XHRcdFx0Zm4oYm9keS5qb2luKGRlbGltKSwgYm91bmRhcnkpO1xuXHRcdFx0XHRcdGJvZHkgPSBbXTtcblx0XHRcdFx0fVxuXHRcdFx0fTtcblxuXHRcdFx0cmVhZHkoKTtcblx0XHR9O1xuXHR9XG5cblx0Ly8gVXBsb2FkIHRvIERyaXZlXG5cdC8vIElmIHRoaXMgaXMgUFVUIHRoZW4gb25seSBhdWdtZW50IHRoZSBmaWxlIHVwbG9hZGVkXG5cdC8vIFBVVCBodHRwczovL2RldmVsb3BlcnMuZ29vZ2xlLmNvbS9kcml2ZS92Mi9yZWZlcmVuY2UvZmlsZXMvdXBkYXRlXG5cdC8vIFBPU1QgaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vZHJpdmUvbWFuYWdlLXVwbG9hZHNcblx0ZnVuY3Rpb24gdXBsb2FkRHJpdmUocCwgY2FsbGJhY2spIHtcblxuXHRcdHZhciBkYXRhID0ge307XG5cblx0XHQvLyBUZXN0IGZvciBET00gZWxlbWVudFxuXHRcdGlmIChwLmRhdGEgJiZcblx0XHRcdCh0eXBlb2YgKEhUTUxJbnB1dEVsZW1lbnQpICE9PSAndW5kZWZpbmVkJyAmJiBwLmRhdGEgaW5zdGFuY2VvZiBIVE1MSW5wdXRFbGVtZW50KVxuXHRcdCkge1xuXHRcdFx0cC5kYXRhID0ge2ZpbGU6IHAuZGF0YX07XG5cdFx0fVxuXG5cdFx0aWYgKCFwLmRhdGEubmFtZSAmJiBPYmplY3QoT2JqZWN0KHAuZGF0YS5maWxlKS5maWxlcykubGVuZ3RoICYmIHAubWV0aG9kID09PSAncG9zdCcpIHtcblx0XHRcdHAuZGF0YS5uYW1lID0gcC5kYXRhLmZpbGUuZmlsZXNbMF0ubmFtZTtcblx0XHR9XG5cblx0XHRpZiAocC5tZXRob2QgPT09ICdwb3N0Jykge1xuXHRcdFx0cC5kYXRhID0ge1xuXHRcdFx0XHR0aXRsZTogcC5kYXRhLm5hbWUsXG5cdFx0XHRcdHBhcmVudHM6IFt7aWQ6IHAuZGF0YS5wYXJlbnQgfHwgJ3Jvb3QnfV0sXG5cdFx0XHRcdGZpbGU6IHAuZGF0YS5maWxlXG5cdFx0XHR9O1xuXHRcdH1cblx0XHRlbHNlIHtcblxuXHRcdFx0Ly8gTWFrZSBhIHJlZmVyZW5jZVxuXHRcdFx0ZGF0YSA9IHAuZGF0YTtcblx0XHRcdHAuZGF0YSA9IHt9O1xuXG5cdFx0XHQvLyBBZGQgdGhlIHBhcnRzIHRvIGNoYW5nZSBhcyByZXF1aXJlZFxuXHRcdFx0aWYgKGRhdGEucGFyZW50KSB7XG5cdFx0XHRcdHAuZGF0YS5wYXJlbnRzID0gW3tpZDogcC5kYXRhLnBhcmVudCB8fCAncm9vdCd9XTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEuZmlsZSkge1xuXHRcdFx0XHRwLmRhdGEuZmlsZSA9IGRhdGEuZmlsZTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKGRhdGEubmFtZSkge1xuXHRcdFx0XHRwLmRhdGEudGl0bGUgPSBkYXRhLm5hbWU7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gRXh0cmFjdCB0aGUgZmlsZSwgaWYgaXQgZXhpc3RzIGZyb20gdGhlIGRhdGEgb2JqZWN0XG5cdFx0Ly8gSWYgdGhlIEZpbGUgaXMgYW4gSU5QVVQgZWxlbWVudCBsZXRzIGp1c3QgY29uY2VybiBvdXJzZWx2ZXMgd2l0aCB0aGUgTm9kZUxpc3Rcblx0XHR2YXIgZmlsZTtcblx0XHRpZiAoJ2ZpbGUnIGluIHAuZGF0YSkge1xuXHRcdFx0ZmlsZSA9IHAuZGF0YS5maWxlO1xuXHRcdFx0ZGVsZXRlIHAuZGF0YS5maWxlO1xuXG5cdFx0XHRpZiAodHlwZW9mIChmaWxlKSA9PT0gJ29iamVjdCcgJiYgJ2ZpbGVzJyBpbiBmaWxlKSB7XG5cdFx0XHRcdC8vIEFzc2lnbiB0aGUgTm9kZUxpc3Rcblx0XHRcdFx0ZmlsZSA9IGZpbGUuZmlsZXM7XG5cdFx0XHR9XG5cblx0XHRcdGlmICghZmlsZSB8fCAhZmlsZS5sZW5ndGgpIHtcblx0XHRcdFx0Y2FsbGJhY2soe1xuXHRcdFx0XHRcdGVycm9yOiB7XG5cdFx0XHRcdFx0XHRjb2RlOiAncmVxdWVzdF9pbnZhbGlkJyxcblx0XHRcdFx0XHRcdG1lc3NhZ2U6ICdUaGVyZSB3ZXJlIG5vIGZpbGVzIGF0dGFjaGVkIHdpdGggdGhpcyByZXF1ZXN0IHRvIHVwbG9hZCdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly8gU2V0IHR5cGUgcC5kYXRhLm1pbWVUeXBlID0gT2JqZWN0KGZpbGVbMF0pLnR5cGUgfHwgJ2FwcGxpY2F0aW9uL29jdGV0LXN0cmVhbSc7XG5cblx0XHQvLyBDb25zdHJ1Y3QgYSBtdWx0aXBhcnQgbWVzc2FnZVxuXHRcdHZhciBwYXJ0cyA9IG5ldyBNdWx0aXBhcnQoKTtcblx0XHRwYXJ0cy5hcHBlbmQoSlNPTi5zdHJpbmdpZnkocC5kYXRhKSwgJ2FwcGxpY2F0aW9uL2pzb24nKTtcblxuXHRcdC8vIFJlYWQgdGhlIGZpbGUgaW50byBhICBiYXNlNjQgc3RyaW5nLi4uIHllcCBhIGhhc3NsZSwgaSBrbm93XG5cdFx0Ly8gRm9ybURhdGEgZG9lc24ndCBsZXQgdXMgYXNzaWduIG91ciBvd24gTXVsdGlwYXJ0IGhlYWRlcnMgYW5kIEhUVFAgQ29udGVudC1UeXBlXG5cdFx0Ly8gQWxhcyBHb29nbGVBcGkgbmVlZCB0aGVzZSBpbiBhIHBhcnRpY3VsYXIgZm9ybWF0XG5cdFx0aWYgKGZpbGUpIHtcblx0XHRcdHBhcnRzLmFwcGVuZChmaWxlKTtcblx0XHR9XG5cblx0XHRwYXJ0cy5vbnJlYWR5KGZ1bmN0aW9uKGJvZHksIGJvdW5kYXJ5KSB7XG5cblx0XHRcdHAuaGVhZGVyc1snY29udGVudC10eXBlJ10gPSAnbXVsdGlwYXJ0L3JlbGF0ZWQ7IGJvdW5kYXJ5PVwiJyArIGJvdW5kYXJ5ICsgJ1wiJztcblx0XHRcdHAuZGF0YSA9IGJvZHk7XG5cblx0XHRcdGNhbGxiYWNrKCd1cGxvYWQvZHJpdmUvdjIvZmlsZXMnICsgKGRhdGEuaWQgPyAnLycgKyBkYXRhLmlkIDogJycpICsgJz91cGxvYWRUeXBlPW11bHRpcGFydCcpO1xuXHRcdH0pO1xuXG5cdH1cblxuXHRmdW5jdGlvbiB0b0pTT04ocCkge1xuXHRcdGlmICh0eXBlb2YgKHAuZGF0YSkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHQvLyBDb252ZXJ0IHRoZSBQT1NUIGludG8gYSBqYXZhc2NyaXB0IG9iamVjdFxuXHRcdFx0dHJ5IHtcblx0XHRcdFx0cC5kYXRhID0gSlNPTi5zdHJpbmdpZnkocC5kYXRhKTtcblx0XHRcdFx0cC5oZWFkZXJzWydjb250ZW50LXR5cGUnXSA9ICdhcHBsaWNhdGlvbi9qc29uJztcblx0XHRcdH1cblx0XHRcdGNhdGNoIChlKSB7fVxuXHRcdH1cblx0fVxuXG59KShoZWxsbyk7XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdGhlbGxvLmluaXQoe1xuXG5cdFx0aW5zdGFncmFtOiB7XG5cblx0XHRcdG5hbWU6ICdJbnN0YWdyYW0nLFxuXG5cdFx0XHRvYXV0aDoge1xuXHRcdFx0XHQvLyBTZWU6IGh0dHA6Ly9pbnN0YWdyYW0uY29tL2RldmVsb3Blci9hdXRoZW50aWNhdGlvbi9cblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vaW5zdGFncmFtLmNvbS9vYXV0aC9hdXRob3JpemUvJyxcblx0XHRcdFx0Z3JhbnQ6ICdodHRwczovL2FwaS5pbnN0YWdyYW0uY29tL29hdXRoL2FjY2Vzc190b2tlbidcblx0XHRcdH0sXG5cblx0XHRcdC8vIFJlZnJlc2ggdGhlIGFjY2Vzc190b2tlbiBvbmNlIGV4cGlyZWRcblx0XHRcdHJlZnJlc2g6IHRydWUsXG5cblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGJhc2ljOiAnYmFzaWMnLFxuXHRcdFx0XHRmcmllbmRzOiAncmVsYXRpb25zaGlwcycsXG5cdFx0XHRcdHB1Ymxpc2g6ICdsaWtlcyBjb21tZW50cydcblx0XHRcdH0sXG5cblx0XHRcdHNjb3BlX2RlbGltOiAnICcsXG5cblx0XHRcdGxvZ2luOiBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdC8vIEluc3RhZ3JhbSB0aHJvd3MgZXJyb3JzIGxpa2UgJ0phdmFTY3JpcHQgQVBJIGlzIHVuc3VwcG9ydGVkJyBpZiB0aGUgZGlzcGxheSBpcyAncG9wdXAnLlxuXHRcdFx0XHQvLyBNYWtlIHRoZSBkaXNwbGF5IGFueXRoaW5nIGJ1dCAncG9wdXAnXG5cdFx0XHRcdHAucXMuZGlzcGxheSA9ICcnO1xuXHRcdFx0fSxcblxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vYXBpLmluc3RhZ3JhbS5jb20vdjEvJyxcblxuXHRcdFx0Z2V0OiB7XG5cdFx0XHRcdG1lOiAndXNlcnMvc2VsZicsXG5cdFx0XHRcdCdtZS9mZWVkJzogJ3VzZXJzL3NlbGYvZmVlZD9jb3VudD1Ae2xpbWl0fDEwMH0nLFxuXHRcdFx0XHQnbWUvcGhvdG9zJzogJ3VzZXJzL3NlbGYvbWVkaWEvcmVjZW50P21pbl9pZD0wJmNvdW50PUB7bGltaXR8MTAwfScsXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogJ3VzZXJzL3NlbGYvZm9sbG93cz9jb3VudD1Ae2xpbWl0fDEwMH0nLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogJ3VzZXJzL3NlbGYvZm9sbG93cz9jb3VudD1Ae2xpbWl0fDEwMH0nLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogJ3VzZXJzL3NlbGYvZm9sbG93ZWQtYnk/Y291bnQ9QHtsaW1pdHwxMDB9Jyxcblx0XHRcdFx0J2ZyaWVuZC9waG90b3MnOiAndXNlcnMvQHtpZH0vbWVkaWEvcmVjZW50P21pbl9pZD0wJmNvdW50PUB7bGltaXR8MTAwfSdcblx0XHRcdH0sXG5cblx0XHRcdHBvc3Q6IHtcblx0XHRcdFx0J21lL2xpa2UnOiBmdW5jdGlvbihwLCBjYWxsYmFjaykge1xuXHRcdFx0XHRcdHZhciBpZCA9IHAuZGF0YS5pZDtcblx0XHRcdFx0XHRwLmRhdGEgPSB7fTtcblx0XHRcdFx0XHRjYWxsYmFjaygnbWVkaWEvJyArIGlkICsgJy9saWtlcycpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRkZWw6IHtcblx0XHRcdFx0J21lL2xpa2UnOiAnbWVkaWEvQHtpZH0vbGlrZXMnXG5cdFx0XHR9LFxuXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihvKSB7XG5cblx0XHRcdFx0XHRmb3JtYXRFcnJvcihvKTtcblxuXHRcdFx0XHRcdGlmICgnZGF0YScgaW4gbykge1xuXHRcdFx0XHRcdFx0by5pZCA9IG8uZGF0YS5pZDtcblx0XHRcdFx0XHRcdG8udGh1bWJuYWlsID0gby5kYXRhLnByb2ZpbGVfcGljdHVyZTtcblx0XHRcdFx0XHRcdG8ubmFtZSA9IG8uZGF0YS5mdWxsX25hbWUgfHwgby5kYXRhLnVzZXJuYW1lO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9mb2xsb3dlcnMnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvcGhvdG9zJzogZnVuY3Rpb24obykge1xuXG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3Iobyk7XG5cdFx0XHRcdFx0cGFnaW5nKG8pO1xuXG5cdFx0XHRcdFx0aWYgKCdkYXRhJyBpbiBvKSB7XG5cdFx0XHRcdFx0XHRvLmRhdGEgPSBvLmRhdGEuZmlsdGVyKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGQudHlwZSA9PT0gJ2ltYWdlJztcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRvLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdFx0XHRcdGQubmFtZSA9IGQuY2FwdGlvbiA/IGQuY2FwdGlvbi50ZXh0IDogbnVsbDtcblx0XHRcdFx0XHRcdFx0ZC50aHVtYm5haWwgPSBkLmltYWdlcy50aHVtYm5haWwudXJsO1xuXHRcdFx0XHRcdFx0XHRkLnBpY3R1cmUgPSBkLmltYWdlcy5zdGFuZGFyZF9yZXNvbHV0aW9uLnVybDtcblx0XHRcdFx0XHRcdFx0ZC5waWN0dXJlcyA9IE9iamVjdC5rZXlzKGQuaW1hZ2VzKVxuXHRcdFx0XHRcdFx0XHRcdC5tYXAoZnVuY3Rpb24oa2V5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgaW1hZ2UgPSBkLmltYWdlc1trZXldO1xuXHRcdFx0XHRcdFx0XHRcdFx0cmV0dXJuIGZvcm1hdEltYWdlKGltYWdlKTtcblx0XHRcdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdFx0XHRcdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBhLndpZHRoIC0gYi53aWR0aDtcblx0XHRcdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdG8gPSBmb3JtYXRFcnJvcihvKTtcblx0XHRcdFx0XHRwYWdpbmcobyk7XG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdC8vIEluc3RhZ3JhbSBkb2VzIG5vdCByZXR1cm4gYW55IENPUlMgSGVhZGVyc1xuXHRcdFx0Ly8gU28gYmVzaWRlcyBKU09OUCB3ZSdyZSBzdHVjayB3aXRoIHByb3h5XG5cdFx0XHR4aHI6IGZ1bmN0aW9uKHAsIHFzKSB7XG5cblx0XHRcdFx0dmFyIG1ldGhvZCA9IHAubWV0aG9kO1xuXHRcdFx0XHR2YXIgcHJveHkgPSBtZXRob2QgIT09ICdnZXQnO1xuXG5cdFx0XHRcdGlmIChwcm94eSkge1xuXG5cdFx0XHRcdFx0aWYgKChtZXRob2QgPT09ICdwb3N0JyB8fCBtZXRob2QgPT09ICdwdXQnKSAmJiBwLnF1ZXJ5LmFjY2Vzc190b2tlbikge1xuXHRcdFx0XHRcdFx0cC5kYXRhLmFjY2Vzc190b2tlbiA9IHAucXVlcnkuYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRcdFx0ZGVsZXRlIHAucXVlcnkuYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIE5vIGFjY2VzcyBjb250cm9sIGhlYWRlcnNcblx0XHRcdFx0XHQvLyBVc2UgdGhlIHByb3h5IGluc3RlYWRcblx0XHRcdFx0XHRwLnByb3h5ID0gcHJveHk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gcHJveHk7XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBObyBmb3JtXG5cdFx0XHRmb3JtOiBmYWxzZVxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZm9ybWF0SW1hZ2UoaW1hZ2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0c291cmNlOiBpbWFnZS51cmwsXG5cdFx0XHR3aWR0aDogaW1hZ2Uud2lkdGgsXG5cdFx0XHRoZWlnaHQ6IGltYWdlLmhlaWdodFxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRFcnJvcihvKSB7XG5cdFx0aWYgKHR5cGVvZiBvID09PSAnc3RyaW5nJykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0ZXJyb3I6IHtcblx0XHRcdFx0XHRjb2RlOiAnaW52YWxpZF9yZXF1ZXN0Jyxcblx0XHRcdFx0XHRtZXNzYWdlOiBvXG5cdFx0XHRcdH1cblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0aWYgKG8gJiYgJ21ldGEnIGluIG8gJiYgJ2Vycm9yX3R5cGUnIGluIG8ubWV0YSkge1xuXHRcdFx0by5lcnJvciA9IHtcblx0XHRcdFx0Y29kZTogby5tZXRhLmVycm9yX3R5cGUsXG5cdFx0XHRcdG1lc3NhZ2U6IG8ubWV0YS5lcnJvcl9tZXNzYWdlXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RnJpZW5kcyhvKSB7XG5cdFx0cGFnaW5nKG8pO1xuXHRcdGlmIChvICYmICdkYXRhJyBpbiBvKSB7XG5cdFx0XHRvLmRhdGEuZm9yRWFjaChmb3JtYXRGcmllbmQpO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RnJpZW5kKG8pIHtcblx0XHRpZiAoby5pZCkge1xuXHRcdFx0by50aHVtYm5haWwgPSBvLnByb2ZpbGVfcGljdHVyZTtcblx0XHRcdG8ubmFtZSA9IG8uZnVsbF9uYW1lIHx8IG8udXNlcm5hbWU7XG5cdFx0fVxuXHR9XG5cblx0Ly8gU2VlOiBodHRwOi8vaW5zdGFncmFtLmNvbS9kZXZlbG9wZXIvZW5kcG9pbnRzL1xuXHRmdW5jdGlvbiBwYWdpbmcocmVzKSB7XG5cdFx0aWYgKCdwYWdpbmF0aW9uJyBpbiByZXMpIHtcblx0XHRcdHJlcy5wYWdpbmcgPSB7XG5cdFx0XHRcdG5leHQ6IHJlcy5wYWdpbmF0aW9uLm5leHRfdXJsXG5cdFx0XHR9O1xuXHRcdFx0ZGVsZXRlIHJlcy5wYWdpbmF0aW9uO1xuXHRcdH1cblx0fVxuXG59KShoZWxsbyk7XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdGhlbGxvLmluaXQoe1xuXG5cdFx0am9pbm1lOiB7XG5cblx0XHRcdG5hbWU6ICdqb2luLm1lJyxcblxuXHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vc2VjdXJlLmpvaW4ubWUvYXBpL3B1YmxpYy92MS9hdXRoL29hdXRoMicsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9zZWN1cmUuam9pbi5tZS9hcGkvcHVibGljL3YxL2F1dGgvb2F1dGgyJ1xuXHRcdFx0fSxcblxuXHRcdFx0cmVmcmVzaDogZmFsc2UsXG5cblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGJhc2ljOiAndXNlcl9pbmZvJyxcblx0XHRcdFx0dXNlcjogJ3VzZXJfaW5mbycsXG5cdFx0XHRcdHNjaGVkdWxlcjogJ3NjaGVkdWxlcicsXG5cdFx0XHRcdHN0YXJ0OiAnc3RhcnRfbWVldGluZydcblx0XHRcdH0sXG5cblx0XHRcdHNjb3BlX2RlbGltOiAnICcsXG5cblx0XHRcdGxvZ2luOiBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdHAub3B0aW9ucy5wb3B1cC53aWR0aCA9IDQwMDtcblx0XHRcdFx0cC5vcHRpb25zLnBvcHVwLmhlaWdodCA9IDcwMDtcblx0XHRcdH0sXG5cblx0XHRcdGJhc2U6ICdodHRwczovL2FwaS5qb2luLm1lL3YxLycsXG5cblx0XHRcdGdldDoge1xuXHRcdFx0XHRtZTogJ3VzZXInLFxuXHRcdFx0XHRtZWV0aW5nczogJ21lZXRpbmdzJyxcblx0XHRcdFx0J21lZXRpbmdzL2luZm8nOiAnbWVldGluZ3MvQHtpZH0nXG5cdFx0XHR9LFxuXG5cdFx0XHRwb3N0OiB7XG5cdFx0XHRcdCdtZWV0aW5ncy9zdGFydC9hZGhvYyc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soJ21lZXRpbmdzL3N0YXJ0Jyk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J21lZXRpbmdzL3N0YXJ0L3NjaGVkdWxlZCc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dmFyIG1lZXRpbmdJZCA9IHAuZGF0YS5tZWV0aW5nSWQ7XG5cdFx0XHRcdFx0cC5kYXRhID0ge307XG5cdFx0XHRcdFx0Y2FsbGJhY2soJ21lZXRpbmdzLycgKyBtZWV0aW5nSWQgKyAnL3N0YXJ0Jyk7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J21lZXRpbmdzL3NjaGVkdWxlJzogZnVuY3Rpb24ocCwgY2FsbGJhY2spIHtcblx0XHRcdFx0XHRjYWxsYmFjaygnbWVldGluZ3MnKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0cGF0Y2g6IHtcblx0XHRcdFx0J21lZXRpbmdzL3VwZGF0ZSc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cdFx0XHRcdFx0Y2FsbGJhY2soJ21lZXRpbmdzLycgKyBwLmRhdGEubWVldGluZ0lkKTtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0ZGVsOiB7XG5cdFx0XHRcdCdtZWV0aW5ncy9kZWxldGUnOiAnbWVldGluZ3MvQHtpZH0nXG5cdFx0XHR9LFxuXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihvLCBoZWFkZXJzKSB7XG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3IobywgaGVhZGVycyk7XG5cblx0XHRcdFx0XHRpZiAoIW8uZW1haWwpIHtcblx0XHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdG8ubmFtZSA9IG8uZnVsbE5hbWU7XG5cdFx0XHRcdFx0by5maXJzdF9uYW1lID0gby5uYW1lLnNwbGl0KCcgJylbMF07XG5cdFx0XHRcdFx0by5sYXN0X25hbWUgPSBvLm5hbWUuc3BsaXQoJyAnKVsxXTtcblx0XHRcdFx0XHRvLmlkID0gby5lbWFpbDtcblxuXHRcdFx0XHRcdHJldHVybiBvO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24obywgaGVhZGVycykge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKG8sIGhlYWRlcnMpO1xuXG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHhocjogZm9ybWF0UmVxdWVzdFxuXG5cdFx0fVxuXHR9KTtcblxuXHRmdW5jdGlvbiBmb3JtYXRFcnJvcihvLCBoZWFkZXJzKSB7XG5cdFx0dmFyIGVycm9yQ29kZTtcblx0XHR2YXIgbWVzc2FnZTtcblx0XHR2YXIgZGV0YWlscztcblxuXHRcdGlmIChvICYmICgnTWVzc2FnZScgaW4gbykpIHtcblx0XHRcdG1lc3NhZ2UgPSBvLk1lc3NhZ2U7XG5cdFx0XHRkZWxldGUgby5NZXNzYWdlO1xuXG5cdFx0XHRpZiAoJ0Vycm9yQ29kZScgaW4gbykge1xuXHRcdFx0XHRlcnJvckNvZGUgPSBvLkVycm9yQ29kZTtcblx0XHRcdFx0ZGVsZXRlIG8uRXJyb3JDb2RlO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGVycm9yQ29kZSA9IGdldEVycm9yQ29kZShoZWFkZXJzKTtcblx0XHRcdH1cblxuXHRcdFx0by5lcnJvciA9IHtcblx0XHRcdFx0Y29kZTogZXJyb3JDb2RlLFxuXHRcdFx0XHRtZXNzYWdlOiBtZXNzYWdlLFxuXHRcdFx0XHRkZXRhaWxzOiBvXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0UmVxdWVzdChwLCBxcykge1xuXHRcdC8vIE1vdmUgdGhlIGFjY2VzcyB0b2tlbiBmcm9tIHRoZSByZXF1ZXN0IGJvZHkgdG8gdGhlIHJlcXVlc3QgaGVhZGVyXG5cdFx0dmFyIHRva2VuID0gcXMuYWNjZXNzX3Rva2VuO1xuXHRcdGRlbGV0ZSBxcy5hY2Nlc3NfdG9rZW47XG5cdFx0cC5oZWFkZXJzLkF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyB0b2tlbjtcblxuXHRcdC8vIEZvcm1hdCBub24tZ2V0IHJlcXVlc3RzIHRvIGluZGljYXRlIGpzb24gYm9keVxuXHRcdGlmIChwLm1ldGhvZCAhPT0gJ2dldCcgJiYgcC5kYXRhKSB7XG5cdFx0XHRwLmhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL2pzb24nO1xuXHRcdFx0aWYgKHR5cGVvZiAocC5kYXRhKSA9PT0gJ29iamVjdCcpIHtcblx0XHRcdFx0cC5kYXRhID0gSlNPTi5zdHJpbmdpZnkocC5kYXRhKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAocC5tZXRob2QgPT09ICdwdXQnKSB7XG5cdFx0XHRwLm1ldGhvZCA9ICdwYXRjaCc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRFcnJvckNvZGUoaGVhZGVycykge1xuXHRcdHN3aXRjaCAoaGVhZGVycy5zdGF0dXNDb2RlKSB7XG5cdFx0XHRjYXNlIDQwMDpcblx0XHRcdFx0cmV0dXJuICdpbnZhbGlkX3JlcXVlc3QnO1xuXHRcdFx0Y2FzZSA0MDM6XG5cdFx0XHRcdHJldHVybiAnc3RhbGVfdG9rZW4nO1xuXHRcdFx0Y2FzZSA0MDE6XG5cdFx0XHRcdHJldHVybiAnaW52YWxpZF90b2tlbic7XG5cdFx0XHRjYXNlIDUwMDpcblx0XHRcdFx0cmV0dXJuICdzZXJ2ZXJfZXJyb3InO1xuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmV0dXJuICdzZXJ2ZXJfZXJyb3InO1xuXHRcdH1cblx0fVxuXG59KGhlbGxvKSk7XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdGhlbGxvLmluaXQoe1xuXG5cdFx0bGlua2VkaW46IHtcblxuXHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdFx0cmVzcG9uc2VfdHlwZTogJ2NvZGUnLFxuXHRcdFx0XHRhdXRoOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL3Vhcy9vYXV0aDIvYXV0aG9yaXphdGlvbicsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL3Vhcy9vYXV0aDIvYWNjZXNzVG9rZW4nXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZWZyZXNoIHRoZSBhY2Nlc3NfdG9rZW4gb25jZSBleHBpcmVkXG5cdFx0XHRyZWZyZXNoOiB0cnVlLFxuXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRiYXNpYzogJ3JfYmFzaWNwcm9maWxlJyxcblx0XHRcdFx0ZW1haWw6ICdyX2VtYWlsYWRkcmVzcycsXG5cdFx0XHRcdGZyaWVuZHM6ICcnLFxuXHRcdFx0XHRwdWJsaXNoOiAnd19zaGFyZSdcblx0XHRcdH0sXG5cdFx0XHRzY29wZV9kZWxpbTogJyAnLFxuXG5cdFx0XHRiYXNlOiAnaHR0cHM6Ly9hcGkubGlua2VkaW4uY29tL3YxLycsXG5cblx0XHRcdGdldDoge1xuXHRcdFx0XHRtZTogJ3Blb3BsZS9+OihwaWN0dXJlLXVybCxmaXJzdC1uYW1lLGxhc3QtbmFtZSxpZCxmb3JtYXR0ZWQtbmFtZSxlbWFpbC1hZGRyZXNzKScsXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogJ3Blb3BsZS9+L2Nvbm5lY3Rpb25zP2NvdW50PUB7bGltaXR8NTAwfScsXG5cdFx0XHRcdCdtZS9mb2xsb3dlcnMnOiAncGVvcGxlL34vY29ubmVjdGlvbnM/Y291bnQ9QHtsaW1pdHw1MDB9Jyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6ICdwZW9wbGUvfi9jb25uZWN0aW9ucz9jb3VudD1Ae2xpbWl0fDUwMH0nLFxuXG5cdFx0XHRcdC8vIFNlZTogaHR0cDovL2RldmVsb3Blci5saW5rZWRpbi5jb20vZG9jdW1lbnRzL2dldC1uZXR3b3JrLXVwZGF0ZXMtYW5kLXN0YXRpc3RpY3MtYXBpXG5cdFx0XHRcdCdtZS9zaGFyZSc6ICdwZW9wbGUvfi9uZXR3b3JrL3VwZGF0ZXM/Y291bnQ9QHtsaW1pdHwyNTB9J1xuXHRcdFx0fSxcblxuXHRcdFx0cG9zdDoge1xuXG5cdFx0XHRcdC8vIFNlZTogaHR0cHM6Ly9kZXZlbG9wZXIubGlua2VkaW4uY29tL2RvY3VtZW50cy9hcGktcmVxdWVzdHMtanNvblxuXHRcdFx0XHQnbWUvc2hhcmUnOiBmdW5jdGlvbihwLCBjYWxsYmFjaykge1xuXHRcdFx0XHRcdHZhciBkYXRhID0ge1xuXHRcdFx0XHRcdFx0dmlzaWJpbGl0eToge1xuXHRcdFx0XHRcdFx0XHRjb2RlOiAnYW55b25lJ1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH07XG5cblx0XHRcdFx0XHRpZiAocC5kYXRhLmlkKSB7XG5cblx0XHRcdFx0XHRcdGRhdGEuYXR0cmlidXRpb24gPSB7XG5cdFx0XHRcdFx0XHRcdHNoYXJlOiB7XG5cdFx0XHRcdFx0XHRcdFx0aWQ6IHAuZGF0YS5pZFxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9O1xuXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0ZGF0YS5jb21tZW50ID0gcC5kYXRhLm1lc3NhZ2U7XG5cdFx0XHRcdFx0XHRpZiAocC5kYXRhLnBpY3R1cmUgJiYgcC5kYXRhLmxpbmspIHtcblx0XHRcdFx0XHRcdFx0ZGF0YS5jb250ZW50ID0ge1xuXHRcdFx0XHRcdFx0XHRcdCdzdWJtaXR0ZWQtdXJsJzogcC5kYXRhLmxpbmssXG5cdFx0XHRcdFx0XHRcdFx0J3N1Ym1pdHRlZC1pbWFnZS11cmwnOiBwLmRhdGEucGljdHVyZVxuXHRcdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHAuZGF0YSA9IEpTT04uc3RyaW5naWZ5KGRhdGEpO1xuXG5cdFx0XHRcdFx0Y2FsbGJhY2soJ3Blb3BsZS9+L3NoYXJlcz9mb3JtYXQ9anNvbicpO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdtZS9saWtlJzogbGlrZVxuXHRcdFx0fSxcblxuXHRcdFx0ZGVsOntcblx0XHRcdFx0J21lL2xpa2UnOiBsaWtlXG5cdFx0XHR9LFxuXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihvKSB7XG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3Iobyk7XG5cdFx0XHRcdFx0Zm9ybWF0VXNlcihvKTtcblx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0fSxcblxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL3NoYXJlJzogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdFx0XHRcdHBhZ2luZyhvKTtcblx0XHRcdFx0XHRpZiAoby52YWx1ZXMpIHtcblx0XHRcdFx0XHRcdG8uZGF0YSA9IG8udmFsdWVzLm1hcChmb3JtYXRVc2VyKTtcblx0XHRcdFx0XHRcdG8uZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcblx0XHRcdFx0XHRcdFx0aXRlbS5tZXNzYWdlID0gaXRlbS5oZWFkbGluZTtcblx0XHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0XHRkZWxldGUgby52YWx1ZXM7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J2RlZmF1bHQnOiBmdW5jdGlvbihvLCBoZWFkZXJzKSB7XG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3Iobyk7XG5cdFx0XHRcdFx0ZW1wdHkobywgaGVhZGVycyk7XG5cdFx0XHRcdFx0cGFnaW5nKG8pO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHRqc29ucDogZnVuY3Rpb24ocCwgcXMpIHtcblx0XHRcdFx0Zm9ybWF0UXVlcnkocXMpO1xuXHRcdFx0XHRpZiAocC5tZXRob2QgPT09ICdnZXQnKSB7XG5cdFx0XHRcdFx0cXMuZm9ybWF0ID0gJ2pzb25wJztcblx0XHRcdFx0XHRxc1snZXJyb3ItY2FsbGJhY2snXSA9IHAuY2FsbGJhY2tJRDtcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0eGhyOiBmdW5jdGlvbihwLCBxcykge1xuXHRcdFx0XHRpZiAocC5tZXRob2QgIT09ICdnZXQnKSB7XG5cdFx0XHRcdFx0Zm9ybWF0UXVlcnkocXMpO1xuXHRcdFx0XHRcdHAuaGVhZGVyc1snQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24vanNvbic7XG5cblx0XHRcdFx0XHQvLyBOb3RlOiB4LWxpLWZvcm1hdCBlbnN1cmVzIGVycm9yIHJlc3BvbnNlcyBhcmUgbm90IHJldHVybmVkIGluIFhNTFxuXHRcdFx0XHRcdHAuaGVhZGVyc1sneC1saS1mb3JtYXQnXSA9ICdqc29uJztcblx0XHRcdFx0XHRwLnByb3h5ID0gdHJ1ZTtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGZvcm1hdEVycm9yKG8pIHtcblx0XHRpZiAobyAmJiAnZXJyb3JDb2RlJyBpbiBvKSB7XG5cdFx0XHRvLmVycm9yID0ge1xuXHRcdFx0XHRjb2RlOiBvLnN0YXR1cyxcblx0XHRcdFx0bWVzc2FnZTogby5tZXNzYWdlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobykge1xuXHRcdGlmIChvLmVycm9yKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0by5maXJzdF9uYW1lID0gby5maXJzdE5hbWU7XG5cdFx0by5sYXN0X25hbWUgPSBvLmxhc3ROYW1lO1xuXHRcdG8ubmFtZSA9IG8uZm9ybWF0dGVkTmFtZSB8fCAoby5maXJzdF9uYW1lICsgJyAnICsgby5sYXN0X25hbWUpO1xuXHRcdG8udGh1bWJuYWlsID0gby5waWN0dXJlVXJsO1xuXHRcdG8uZW1haWwgPSBvLmVtYWlsQWRkcmVzcztcblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyaWVuZHMobykge1xuXHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdHBhZ2luZyhvKTtcblx0XHRpZiAoby52YWx1ZXMpIHtcblx0XHRcdG8uZGF0YSA9IG8udmFsdWVzLm1hcChmb3JtYXRVc2VyKTtcblx0XHRcdGRlbGV0ZSBvLnZhbHVlcztcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIHBhZ2luZyhyZXMpIHtcblx0XHRpZiAoJ19jb3VudCcgaW4gcmVzICYmICdfc3RhcnQnIGluIHJlcyAmJiAocmVzLl9jb3VudCArIHJlcy5fc3RhcnQpIDwgcmVzLl90b3RhbCkge1xuXHRcdFx0cmVzLnBhZ2luZyA9IHtcblx0XHRcdFx0bmV4dDogJz9zdGFydD0nICsgKHJlcy5fc3RhcnQgKyByZXMuX2NvdW50KSArICcmY291bnQ9JyArIHJlcy5fY291bnRcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gZW1wdHkobywgaGVhZGVycykge1xuXHRcdGlmIChKU09OLnN0cmluZ2lmeShvKSA9PT0gJ3t9JyAmJiBoZWFkZXJzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuXHRcdFx0by5zdWNjZXNzID0gdHJ1ZTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRRdWVyeShxcykge1xuXHRcdC8vIExpbmtlZEluIHNpZ25zIHJlcXVlc3RzIHdpdGggdGhlIHBhcmFtZXRlciAnb2F1dGgyX2FjY2Vzc190b2tlbidcblx0XHQvLyAuLi4geWVhaCBhbm90aGVyIG9uZSB3aG8gdGhpbmtzIHRoZXkgc2hvdWxkIGJlIGRpZmZlcmVudCFcblx0XHRpZiAocXMuYWNjZXNzX3Rva2VuKSB7XG5cdFx0XHRxcy5vYXV0aDJfYWNjZXNzX3Rva2VuID0gcXMuYWNjZXNzX3Rva2VuO1xuXHRcdFx0ZGVsZXRlIHFzLmFjY2Vzc190b2tlbjtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBsaWtlKHAsIGNhbGxiYWNrKSB7XG5cdFx0cC5oZWFkZXJzWyd4LWxpLWZvcm1hdCddID0gJ2pzb24nO1xuXHRcdHZhciBpZCA9IHAuZGF0YS5pZDtcblx0XHRwLmRhdGEgPSAocC5tZXRob2QgIT09ICdkZWxldGUnKS50b1N0cmluZygpO1xuXHRcdHAubWV0aG9kID0gJ3B1dCc7XG5cdFx0Y2FsbGJhY2soJ3Blb3BsZS9+L25ldHdvcmsvdXBkYXRlcy9rZXk9JyArIGlkICsgJy9pcy1saWtlZCcpO1xuXHR9XG5cbn0pKGhlbGxvKTtcblxuLy8gU2VlOiBodHRwczovL2RldmVsb3BlcnMuc291bmRjbG91ZC5jb20vZG9jcy9hcGkvcmVmZXJlbmNlXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHRoZWxsby5pbml0KHtcblxuXHRcdHNvdW5kY2xvdWQ6IHtcblx0XHRcdG5hbWU6ICdTb3VuZENsb3VkJyxcblxuXHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vc291bmRjbG91ZC5jb20vY29ubmVjdCcsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9zb3VuZGNsb3VkLmNvbS9vYXV0aDIvdG9rZW4nXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZXF1ZXN0IHBhdGggdHJhbnNsYXRlZFxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vYXBpLnNvdW5kY2xvdWQuY29tLycsXG5cdFx0XHRnZXQ6IHtcblx0XHRcdFx0bWU6ICdtZS5qc29uJyxcblxuXHRcdFx0XHQvLyBIdHRwOi8vZGV2ZWxvcGVycy5zb3VuZGNsb3VkLmNvbS9kb2NzL2FwaS9yZWZlcmVuY2UjbWVcblx0XHRcdFx0J21lL2ZyaWVuZHMnOiAnbWUvZm9sbG93aW5ncy5qc29uJyxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6ICdtZS9mb2xsb3dlcnMuanNvbicsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiAnbWUvZm9sbG93aW5ncy5qc29uJyxcblxuXHRcdFx0XHQvLyBTZWU6IGh0dHA6Ly9kZXZlbG9wZXJzLnNvdW5kY2xvdWQuY29tL2RvY3MvYXBpL3JlZmVyZW5jZSNhY3Rpdml0aWVzXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24ocCwgY2FsbGJhY2spIHtcblxuXHRcdFx0XHRcdC8vIEluY2x1ZGUgJy5qc29uIGF0IHRoZSBlbmQgb2YgZWFjaCByZXF1ZXN0J1xuXHRcdFx0XHRcdGNhbGxiYWNrKHAucGF0aCArICcuanNvbicpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBSZXNwb25zZSBoYW5kbGVyc1xuXHRcdFx0d3JhcDoge1xuXHRcdFx0XHRtZTogZnVuY3Rpb24obykge1xuXHRcdFx0XHRcdGZvcm1hdFVzZXIobyk7XG5cdFx0XHRcdFx0cmV0dXJuIG87XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J2RlZmF1bHQnOiBmdW5jdGlvbihvKSB7XG5cdFx0XHRcdFx0aWYgKEFycmF5LmlzQXJyYXkobykpIHtcblx0XHRcdFx0XHRcdG8gPSB7XG5cdFx0XHRcdFx0XHRcdGRhdGE6IG8ubWFwKGZvcm1hdFVzZXIpXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHBhZ2luZyhvKTtcblx0XHRcdFx0XHRyZXR1cm4gbztcblx0XHRcdFx0fVxuXHRcdFx0fSxcblxuXHRcdFx0eGhyOiBmb3JtYXRSZXF1ZXN0LFxuXHRcdFx0anNvbnA6IGZvcm1hdFJlcXVlc3Rcblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGZvcm1hdFJlcXVlc3QocCwgcXMpIHtcblx0XHQvLyBBbHRlciB0aGUgcXVlcnlzdHJpbmdcblx0XHR2YXIgdG9rZW4gPSBxcy5hY2Nlc3NfdG9rZW47XG5cdFx0ZGVsZXRlIHFzLmFjY2Vzc190b2tlbjtcblx0XHRxcy5vYXV0aF90b2tlbiA9IHRva2VuO1xuXHRcdHFzWydfc3RhdHVzX2NvZGVfbWFwWzMwMl0nXSA9IDIwMDtcblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobykge1xuXHRcdGlmIChvLmlkKSB7XG5cdFx0XHRvLnBpY3R1cmUgPSBvLmF2YXRhcl91cmw7XG5cdFx0XHRvLnRodW1ibmFpbCA9IG8uYXZhdGFyX3VybDtcblx0XHRcdG8ubmFtZSA9IG8udXNlcm5hbWUgfHwgby5mdWxsX25hbWU7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHQvLyBTZWU6IGh0dHA6Ly9kZXZlbG9wZXJzLnNvdW5kY2xvdWQuY29tL2RvY3MvYXBpL3JlZmVyZW5jZSNhY3Rpdml0aWVzXG5cdGZ1bmN0aW9uIHBhZ2luZyhyZXMpIHtcblx0XHRpZiAoJ25leHRfaHJlZicgaW4gcmVzKSB7XG5cdFx0XHRyZXMucGFnaW5nID0ge1xuXHRcdFx0XHRuZXh0OiByZXMubmV4dF9ocmVmXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG59KShoZWxsbyk7XG5cbihmdW5jdGlvbihoZWxsbykge1xuXG5cdHZhciBiYXNlID0gJ2h0dHBzOi8vYXBpLnR3aXR0ZXIuY29tLyc7XG5cblx0aGVsbG8uaW5pdCh7XG5cblx0XHR0d2l0dGVyOiB7XG5cblx0XHRcdC8vIEVuc3VyZSB0aGF0IHlvdSBkZWZpbmUgYW4gb2F1dGhfcHJveHlcblx0XHRcdG9hdXRoOiB7XG5cdFx0XHRcdHZlcnNpb246ICcxLjBhJyxcblx0XHRcdFx0YXV0aDogYmFzZSArICdvYXV0aC9hdXRoZW50aWNhdGUnLFxuXHRcdFx0XHRyZXF1ZXN0OiBiYXNlICsgJ29hdXRoL3JlcXVlc3RfdG9rZW4nLFxuXHRcdFx0XHR0b2tlbjogYmFzZSArICdvYXV0aC9hY2Nlc3NfdG9rZW4nXG5cdFx0XHR9LFxuXG5cdFx0XHRsb2dpbjogZnVuY3Rpb24ocCkge1xuXHRcdFx0XHQvLyBSZWF1dGhlbnRpY2F0ZVxuXHRcdFx0XHQvLyBodHRwczovL2Rldi50d2l0dGVyLmNvbS9vYXV0aC9yZWZlcmVuY2UvZ2V0L29hdXRoL2F1dGhlbnRpY2F0ZVxuXHRcdFx0XHR2YXIgcHJlZml4ID0gJz9mb3JjZV9sb2dpbj10cnVlJztcblx0XHRcdFx0dGhpcy5vYXV0aC5hdXRoID0gdGhpcy5vYXV0aC5hdXRoLnJlcGxhY2UocHJlZml4LCAnJykgKyAocC5vcHRpb25zLmZvcmNlID8gcHJlZml4IDogJycpO1xuXHRcdFx0fSxcblxuXHRcdFx0YmFzZTogYmFzZSArICcxLjEvJyxcblxuXHRcdFx0Z2V0OiB7XG5cdFx0XHRcdG1lOiAnYWNjb3VudC92ZXJpZnlfY3JlZGVudGlhbHMuanNvbicsXG5cdFx0XHRcdCdtZS9mcmllbmRzJzogJ2ZyaWVuZHMvbGlzdC5qc29uP2NvdW50PUB7bGltaXR8MjAwfScsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiAnZnJpZW5kcy9saXN0Lmpzb24/Y291bnQ9QHtsaW1pdHwyMDB9Jyxcblx0XHRcdFx0J21lL2ZvbGxvd2Vycyc6ICdmb2xsb3dlcnMvbGlzdC5qc29uP2NvdW50PUB7bGltaXR8MjAwfScsXG5cblx0XHRcdFx0Ly8gSHR0cHM6Ly9kZXYudHdpdHRlci5jb20vZG9jcy9hcGkvMS4xL2dldC9zdGF0dXNlcy91c2VyX3RpbWVsaW5lXG5cdFx0XHRcdCdtZS9zaGFyZSc6ICdzdGF0dXNlcy91c2VyX3RpbWVsaW5lLmpzb24/Y291bnQ9QHtsaW1pdHwyMDB9JyxcblxuXHRcdFx0XHQvLyBIdHRwczovL2Rldi50d2l0dGVyLmNvbS9yZXN0L3JlZmVyZW5jZS9nZXQvZmF2b3JpdGVzL2xpc3Rcblx0XHRcdFx0J21lL2xpa2UnOiAnZmF2b3JpdGVzL2xpc3QuanNvbj9jb3VudD1Ae2xpbWl0fDIwMH0nXG5cdFx0XHR9LFxuXG5cdFx0XHRwb3N0OiB7XG5cdFx0XHRcdCdtZS9zaGFyZSc6IGZ1bmN0aW9uKHAsIGNhbGxiYWNrKSB7XG5cblx0XHRcdFx0XHR2YXIgZGF0YSA9IHAuZGF0YTtcblx0XHRcdFx0XHRwLmRhdGEgPSBudWxsO1xuXG5cdFx0XHRcdFx0dmFyIHN0YXR1cyA9IFtdO1xuXG5cdFx0XHRcdFx0Ly8gQ2hhbmdlIG1lc3NhZ2UgdG8gc3RhdHVzXG5cdFx0XHRcdFx0aWYgKGRhdGEubWVzc2FnZSkge1xuXHRcdFx0XHRcdFx0c3RhdHVzLnB1c2goZGF0YS5tZXNzYWdlKTtcblx0XHRcdFx0XHRcdGRlbGV0ZSBkYXRhLm1lc3NhZ2U7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gSWYgbGluayBpcyBnaXZlblxuXHRcdFx0XHRcdGlmIChkYXRhLmxpbmspIHtcblx0XHRcdFx0XHRcdHN0YXR1cy5wdXNoKGRhdGEubGluayk7XG5cdFx0XHRcdFx0XHRkZWxldGUgZGF0YS5saW5rO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChkYXRhLnBpY3R1cmUpIHtcblx0XHRcdFx0XHRcdHN0YXR1cy5wdXNoKGRhdGEucGljdHVyZSk7XG5cdFx0XHRcdFx0XHRkZWxldGUgZGF0YS5waWN0dXJlO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdC8vIENvbXBvdW5kIGFsbCB0aGUgY29tcG9uZW50c1xuXHRcdFx0XHRcdGlmIChzdGF0dXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHRkYXRhLnN0YXR1cyA9IHN0YXR1cy5qb2luKCcgJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVHdlZXQgbWVkaWFcblx0XHRcdFx0XHRpZiAoZGF0YS5maWxlKSB7XG5cdFx0XHRcdFx0XHRkYXRhWydtZWRpYVtdJ10gPSBkYXRhLmZpbGU7XG5cdFx0XHRcdFx0XHRkZWxldGUgZGF0YS5maWxlO1xuXHRcdFx0XHRcdFx0cC5kYXRhID0gZGF0YTtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdzdGF0dXNlcy91cGRhdGVfd2l0aF9tZWRpYS5qc29uJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gUmV0d2VldD9cblx0XHRcdFx0XHRlbHNlIGlmICgnaWQnIGluIGRhdGEpIHtcblx0XHRcdFx0XHRcdGNhbGxiYWNrKCdzdGF0dXNlcy9yZXR3ZWV0LycgKyBkYXRhLmlkICsgJy5qc29uJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0Ly8gVHdlZXRcblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdC8vIEFzc2lnbiB0aGUgcG9zdCBib2R5IHRvIHRoZSBxdWVyeSBwYXJhbWV0ZXJzXG5cdFx0XHRcdFx0XHRoZWxsby51dGlscy5leHRlbmQocC5xdWVyeSwgZGF0YSk7XG5cdFx0XHRcdFx0XHRjYWxsYmFjaygnc3RhdHVzZXMvdXBkYXRlLmpzb24/aW5jbHVkZV9lbnRpdGllcz0xJyk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdC8vIFNlZTogaHR0cHM6Ly9kZXYudHdpdHRlci5jb20vcmVzdC9yZWZlcmVuY2UvcG9zdC9mYXZvcml0ZXMvY3JlYXRlXG5cdFx0XHRcdCdtZS9saWtlJzogZnVuY3Rpb24ocCwgY2FsbGJhY2spIHtcblx0XHRcdFx0XHR2YXIgaWQgPSBwLmRhdGEuaWQ7XG5cdFx0XHRcdFx0cC5kYXRhID0gbnVsbDtcblx0XHRcdFx0XHRjYWxsYmFjaygnZmF2b3JpdGVzL2NyZWF0ZS5qc29uP2lkPScgKyBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdGRlbDoge1xuXG5cdFx0XHRcdC8vIFNlZTogaHR0cHM6Ly9kZXYudHdpdHRlci5jb20vcmVzdC9yZWZlcmVuY2UvcG9zdC9mYXZvcml0ZXMvZGVzdHJveVxuXHRcdFx0XHQnbWUvbGlrZSc6IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdHAubWV0aG9kID0gJ3Bvc3QnO1xuXHRcdFx0XHRcdHZhciBpZCA9IHAuZGF0YS5pZDtcblx0XHRcdFx0XHRwLmRhdGEgPSBudWxsO1xuXHRcdFx0XHRcdGNhbGxiYWNrKCdmYXZvcml0ZXMvZGVzdHJveS5qc29uP2lkPScgKyBpZCk7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cblx0XHRcdHdyYXA6IHtcblx0XHRcdFx0bWU6IGZ1bmN0aW9uKHJlcykge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKHJlcyk7XG5cdFx0XHRcdFx0Zm9ybWF0VXNlcihyZXMpO1xuXHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdH0sXG5cblx0XHRcdFx0J21lL2ZyaWVuZHMnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvZm9sbG93ZXJzJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6IGZvcm1hdEZyaWVuZHMsXG5cblx0XHRcdFx0J21lL3NoYXJlJzogZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdFx0Zm9ybWF0RXJyb3IocmVzKTtcblx0XHRcdFx0XHRwYWdpbmcocmVzKTtcblx0XHRcdFx0XHRpZiAoIXJlcy5lcnJvciAmJiAnbGVuZ3RoJyBpbiByZXMpIHtcblx0XHRcdFx0XHRcdHJldHVybiB7ZGF0YTogcmVzfTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRyZXR1cm4gcmVzO1xuXHRcdFx0XHR9LFxuXG5cdFx0XHRcdCdkZWZhdWx0JzogZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRcdFx0cmVzID0gYXJyYXlUb0RhdGFSZXNwb25zZShyZXMpO1xuXHRcdFx0XHRcdHBhZ2luZyhyZXMpO1xuXHRcdFx0XHRcdHJldHVybiByZXM7XG5cdFx0XHRcdH1cblx0XHRcdH0sXG5cdFx0XHR4aHI6IGZ1bmN0aW9uKHApIHtcblxuXHRcdFx0XHQvLyBSZWx5IG9uIHRoZSBwcm94eSBmb3Igbm9uLUdFVCByZXF1ZXN0cy5cblx0XHRcdFx0cmV0dXJuIChwLm1ldGhvZCAhPT0gJ2dldCcpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZm9ybWF0VXNlcihvKSB7XG5cdFx0aWYgKG8uaWQpIHtcblx0XHRcdGlmIChvLm5hbWUpIHtcblx0XHRcdFx0dmFyIG0gPSBvLm5hbWUuc3BsaXQoJyAnKTtcblx0XHRcdFx0by5maXJzdF9uYW1lID0gbS5zaGlmdCgpO1xuXHRcdFx0XHRvLmxhc3RfbmFtZSA9IG0uam9pbignICcpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBTZWU6IGh0dHBzOi8vZGV2LnR3aXR0ZXIuY29tL292ZXJ2aWV3L2dlbmVyYWwvdXNlci1wcm9maWxlLWltYWdlcy1hbmQtYmFubmVyc1xuXHRcdFx0by50aHVtYm5haWwgPSBvLnByb2ZpbGVfaW1hZ2VfdXJsX2h0dHBzIHx8IG8ucHJvZmlsZV9pbWFnZV91cmw7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRGcmllbmRzKG8pIHtcblx0XHRmb3JtYXRFcnJvcihvKTtcblx0XHRwYWdpbmcobyk7XG5cdFx0aWYgKG8udXNlcnMpIHtcblx0XHRcdG8uZGF0YSA9IG8udXNlcnMubWFwKGZvcm1hdFVzZXIpO1xuXHRcdFx0ZGVsZXRlIG8udXNlcnM7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRFcnJvcihvKSB7XG5cdFx0aWYgKG8uZXJyb3JzKSB7XG5cdFx0XHR2YXIgZSA9IG8uZXJyb3JzWzBdO1xuXHRcdFx0by5lcnJvciA9IHtcblx0XHRcdFx0Y29kZTogJ3JlcXVlc3RfZmFpbGVkJyxcblx0XHRcdFx0bWVzc2FnZTogZS5tZXNzYWdlXG5cdFx0XHR9O1xuXHRcdH1cblx0fVxuXG5cdC8vIFRha2UgYSBjdXJzb3IgYW5kIGFkZCBpdCB0byB0aGUgcGF0aFxuXHRmdW5jdGlvbiBwYWdpbmcocmVzKSB7XG5cdFx0Ly8gRG9lcyB0aGUgcmVzcG9uc2UgaW5jbHVkZSBhICduZXh0X2N1cnNvcl9zdHJpbmcnXG5cdFx0aWYgKCduZXh0X2N1cnNvcl9zdHInIGluIHJlcykge1xuXHRcdFx0Ly8gU2VlOiBodHRwczovL2Rldi50d2l0dGVyLmNvbS9kb2NzL21pc2MvY3Vyc29yaW5nXG5cdFx0XHRyZXMucGFnaW5nID0ge1xuXHRcdFx0XHRuZXh0OiAnP2N1cnNvcj0nICsgcmVzLm5leHRfY3Vyc29yX3N0clxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBhcnJheVRvRGF0YVJlc3BvbnNlKHJlcykge1xuXHRcdHJldHVybiBBcnJheS5pc0FycmF5KHJlcykgPyB7ZGF0YTogcmVzfSA6IHJlcztcblx0fVxuXG5cdC8qKlxuXHQvLyBUaGUgZG9jdW1lbnRhdGlvbiBzYXlzIHRvIGRlZmluZSB1c2VyIGluIHRoZSByZXF1ZXN0XG5cdC8vIEFsdGhvdWdoIGl0cyBub3QgYWN0dWFsbHkgcmVxdWlyZWQuXG5cblx0dmFyIHVzZXJfaWQ7XG5cblx0ZnVuY3Rpb24gd2l0aFVzZXJJZChjYWxsYmFjayl7XG5cdFx0aWYodXNlcl9pZCl7XG5cdFx0XHRjYWxsYmFjayh1c2VyX2lkKTtcblx0XHR9XG5cdFx0ZWxzZXtcblx0XHRcdGhlbGxvLmFwaSgndHdpdHRlcjovbWUnLCBmdW5jdGlvbihvKXtcblx0XHRcdFx0dXNlcl9pZCA9IG8uaWQ7XG5cdFx0XHRcdGNhbGxiYWNrKG8uaWQpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gc2lnbih1cmwpe1xuXHRcdHJldHVybiBmdW5jdGlvbihwLCBjYWxsYmFjayl7XG5cdFx0XHR3aXRoVXNlcklkKGZ1bmN0aW9uKHVzZXJfaWQpe1xuXHRcdFx0XHRjYWxsYmFjayh1cmwrJz91c2VyX2lkPScrdXNlcl9pZCk7XG5cdFx0XHR9KTtcblx0XHR9O1xuXHR9XG5cdCovXG5cbn0pKGhlbGxvKTtcblxuLy8gVmtvbnRha3RlICh2ay5jb20pXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHRoZWxsby5pbml0KHtcblxuXHRcdHZrOiB7XG5cdFx0XHRuYW1lOiAnVmsnLFxuXG5cdFx0XHQvLyBTZWUgaHR0cHM6Ly92ay5jb20vZGV2L29hdXRoX2RpYWxvZ1xuXHRcdFx0b2F1dGg6IHtcblx0XHRcdFx0dmVyc2lvbjogMixcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vb2F1dGgudmsuY29tL2F1dGhvcml6ZScsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9vYXV0aC52ay5jb20vYWNjZXNzX3Rva2VuJ1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gQXV0aG9yaXphdGlvbiBzY29wZXNcblx0XHRcdHNjb3BlOiB7XG5cdFx0XHRcdGJhc2ljOiAnJyxcblx0XHRcdFx0ZW1haWw6ICdlbWFpbCcsXG5cdFx0XHRcdG9mZmxpbmVfYWNjZXNzOiAnb2ZmbGluZSdcblx0XHRcdH0sXG5cblx0XHRcdC8vIFJlZnJlc2ggdGhlIGFjY2Vzc190b2tlblxuXHRcdFx0cmVmcmVzaDogdHJ1ZSxcblxuXHRcdFx0bG9naW46IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0cC5xcy5kaXNwbGF5ID0gd2luZG93Lm5hdmlnYXRvciAmJlxuXHRcdFx0XHRcdHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50ICYmXG5cdFx0XHRcdFx0L2lwYWR8cGhvbmV8cGhvbmV8YW5kcm9pZC8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC50b0xvd2VyQ2FzZSgpKSA/ICdtb2JpbGUnIDogJ3BvcHVwJztcblx0XHRcdH0sXG5cblx0XHRcdC8vIEFQSSBCYXNlIFVSTFxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vYXBpLnZrLmNvbS9tZXRob2QvJyxcblxuXHRcdFx0Ly8gTWFwIEdFVCByZXF1ZXN0c1xuXHRcdFx0Z2V0OiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihwLCBjYWxsYmFjaykge1xuXHRcdFx0XHRcdHAucXVlcnkuZmllbGRzID0gJ2lkLGZpcnN0X25hbWUsbGFzdF9uYW1lLHBob3RvX21heCc7XG5cdFx0XHRcdFx0Y2FsbGJhY2soJ3VzZXJzLmdldCcpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmdW5jdGlvbihyZXMsIGhlYWRlcnMsIHJlcSkge1xuXHRcdFx0XHRcdGZvcm1hdEVycm9yKHJlcyk7XG5cdFx0XHRcdFx0cmV0dXJuIGZvcm1hdFVzZXIocmVzLCByZXEpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBObyBYSFJcblx0XHRcdHhocjogZmFsc2UsXG5cblx0XHRcdC8vIEFsbCByZXF1ZXN0cyBzaG91bGQgYmUgSlNPTlAgYXMgb2YgbWlzc2luZyBDT1JTIGhlYWRlcnMgaW4gaHR0cHM6Ly9hcGkudmsuY29tL21ldGhvZC8qXG5cdFx0XHRqc29ucDogdHJ1ZSxcblxuXHRcdFx0Ly8gTm8gZm9ybVxuXHRcdFx0Zm9ybTogZmFsc2Vcblx0XHR9XG5cdH0pO1xuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobywgcmVxKSB7XG5cblx0XHRpZiAobyAhPT0gbnVsbCAmJiAncmVzcG9uc2UnIGluIG8gJiYgby5yZXNwb25zZSAhPT0gbnVsbCAmJiBvLnJlc3BvbnNlLmxlbmd0aCkge1xuXHRcdFx0byA9IG8ucmVzcG9uc2VbMF07XG5cdFx0XHRvLmlkID0gby51aWQ7XG5cdFx0XHRvLnRodW1ibmFpbCA9IG8ucGljdHVyZSA9IG8ucGhvdG9fbWF4O1xuXHRcdFx0by5uYW1lID0gby5maXJzdF9uYW1lICsgJyAnICsgby5sYXN0X25hbWU7XG5cblx0XHRcdGlmIChyZXEuYXV0aFJlc3BvbnNlICYmIHJlcS5hdXRoUmVzcG9uc2UuZW1haWwgIT09IG51bGwpXG5cdFx0XHRcdG8uZW1haWwgPSByZXEuYXV0aFJlc3BvbnNlLmVtYWlsO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RXJyb3Iobykge1xuXG5cdFx0aWYgKG8uZXJyb3IpIHtcblx0XHRcdHZhciBlID0gby5lcnJvcjtcblx0XHRcdG8uZXJyb3IgPSB7XG5cdFx0XHRcdGNvZGU6IGUuZXJyb3JfY29kZSxcblx0XHRcdFx0bWVzc2FnZTogZS5lcnJvcl9tc2dcblx0XHRcdH07XG5cdFx0fVxuXHR9XG5cbn0pKGhlbGxvKTtcblxuKGZ1bmN0aW9uKGhlbGxvKSB7XG5cblx0aGVsbG8uaW5pdCh7XG5cdFx0d2luZG93czoge1xuXHRcdFx0bmFtZTogJ1dpbmRvd3MgbGl2ZScsXG5cblx0XHRcdC8vIFJFRjogaHR0cDovL21zZG4ubWljcm9zb2Z0LmNvbS9lbi11cy9saWJyYXJ5L2hoMjQzNjQxLmFzcHhcblx0XHRcdG9hdXRoOiB7XG5cdFx0XHRcdHZlcnNpb246IDIsXG5cdFx0XHRcdGF1dGg6ICdodHRwczovL2xvZ2luLmxpdmUuY29tL29hdXRoMjBfYXV0aG9yaXplLnNyZicsXG5cdFx0XHRcdGdyYW50OiAnaHR0cHM6Ly9sb2dpbi5saXZlLmNvbS9vYXV0aDIwX3Rva2VuLnNyZidcblx0XHRcdH0sXG5cblx0XHRcdC8vIFJlZnJlc2ggdGhlIGFjY2Vzc190b2tlbiBvbmNlIGV4cGlyZWRcblx0XHRcdHJlZnJlc2g6IHRydWUsXG5cblx0XHRcdGxvZ291dDogZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHJldHVybiAnaHR0cDovL2xvZ2luLmxpdmUuY29tL29hdXRoMjBfbG9nb3V0LnNyZj90cz0nICsgKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblx0XHRcdH0sXG5cblx0XHRcdC8vIEF1dGhvcml6YXRpb24gc2NvcGVzXG5cdFx0XHRzY29wZToge1xuXHRcdFx0XHRiYXNpYzogJ3dsLnNpZ25pbix3bC5iYXNpYycsXG5cdFx0XHRcdGVtYWlsOiAnd2wuZW1haWxzJyxcblx0XHRcdFx0YmlydGhkYXk6ICd3bC5iaXJ0aGRheScsXG5cdFx0XHRcdGV2ZW50czogJ3dsLmNhbGVuZGFycycsXG5cdFx0XHRcdHBob3RvczogJ3dsLnBob3RvcycsXG5cdFx0XHRcdHZpZGVvczogJ3dsLnBob3RvcycsXG5cdFx0XHRcdGZyaWVuZHM6ICd3bC5jb250YWN0c19lbWFpbHMnLFxuXHRcdFx0XHRmaWxlczogJ3dsLnNreWRyaXZlJyxcblx0XHRcdFx0cHVibGlzaDogJ3dsLnNoYXJlJyxcblx0XHRcdFx0cHVibGlzaF9maWxlczogJ3dsLnNreWRyaXZlX3VwZGF0ZScsXG5cdFx0XHRcdGNyZWF0ZV9ldmVudDogJ3dsLmNhbGVuZGFyc191cGRhdGUsd2wuZXZlbnRzX2NyZWF0ZScsXG5cdFx0XHRcdG9mZmxpbmVfYWNjZXNzOiAnd2wub2ZmbGluZV9hY2Nlc3MnXG5cdFx0XHR9LFxuXG5cdFx0XHQvLyBBUEkgYmFzZSBVUkxcblx0XHRcdGJhc2U6ICdodHRwczovL2FwaXMubGl2ZS5uZXQvdjUuMC8nLFxuXG5cdFx0XHQvLyBNYXAgR0VUIHJlcXVlc3RzXG5cdFx0XHRnZXQ6IHtcblxuXHRcdFx0XHQvLyBGcmllbmRzXG5cdFx0XHRcdG1lOiAnbWUnLFxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6ICdtZS9mcmllbmRzJyxcblx0XHRcdFx0J21lL2ZvbGxvd2luZyc6ICdtZS9jb250YWN0cycsXG5cdFx0XHRcdCdtZS9mb2xsb3dlcnMnOiAnbWUvZnJpZW5kcycsXG5cdFx0XHRcdCdtZS9jb250YWN0cyc6ICdtZS9jb250YWN0cycsXG5cblx0XHRcdFx0J21lL2FsYnVtcyc6ICdtZS9hbGJ1bXMnLFxuXG5cdFx0XHRcdC8vIEluY2x1ZGUgdGhlIGRhdGFbaWRdIGluIHRoZSBwYXRoXG5cdFx0XHRcdCdtZS9hbGJ1bSc6ICdAe2lkfS9maWxlcycsXG5cdFx0XHRcdCdtZS9waG90byc6ICdAe2lkfScsXG5cblx0XHRcdFx0Ly8gRmlsZXNcblx0XHRcdFx0J21lL2ZpbGVzJzogJ0B7cGFyZW50fG1lL3NreWRyaXZlfS9maWxlcycsXG5cdFx0XHRcdCdtZS9mb2xkZXJzJzogJ0B7aWR8bWUvc2t5ZHJpdmV9L2ZpbGVzJyxcblx0XHRcdFx0J21lL2ZvbGRlcic6ICdAe2lkfG1lL3NreWRyaXZlfS9maWxlcydcblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBQT1NUIHJlcXVlc3RzXG5cdFx0XHRwb3N0OiB7XG5cdFx0XHRcdCdtZS9hbGJ1bXMnOiAnbWUvYWxidW1zJyxcblx0XHRcdFx0J21lL2FsYnVtJzogJ0B7aWR9L2ZpbGVzLycsXG5cblx0XHRcdFx0J21lL2ZvbGRlcnMnOiAnQHtpZHxtZS9za3lkcml2ZS99Jyxcblx0XHRcdFx0J21lL2ZpbGVzJzogJ0B7cGFyZW50fG1lL3NreWRyaXZlfS9maWxlcydcblx0XHRcdH0sXG5cblx0XHRcdC8vIE1hcCBERUxFVEUgcmVxdWVzdHNcblx0XHRcdGRlbDoge1xuXHRcdFx0XHQvLyBJbmNsdWRlIHRoZSBkYXRhW2lkXSBpbiB0aGUgcGF0aFxuXHRcdFx0XHQnbWUvYWxidW0nOiAnQHtpZH0nLFxuXHRcdFx0XHQnbWUvcGhvdG8nOiAnQHtpZH0nLFxuXHRcdFx0XHQnbWUvZm9sZGVyJzogJ0B7aWR9Jyxcblx0XHRcdFx0J21lL2ZpbGVzJzogJ0B7aWR9J1xuXHRcdFx0fSxcblxuXHRcdFx0d3JhcDoge1xuXHRcdFx0XHRtZTogZm9ybWF0VXNlcixcblxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9jb250YWN0cyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9mb2xsb3dlcnMnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogZm9ybWF0RnJpZW5kcyxcblx0XHRcdFx0J21lL2FsYnVtcyc6IGZvcm1hdEFsYnVtcyxcblx0XHRcdFx0J21lL3Bob3Rvcyc6IGZvcm1hdERlZmF1bHQsXG5cdFx0XHRcdCdkZWZhdWx0JzogZm9ybWF0RGVmYXVsdFxuXHRcdFx0fSxcblxuXHRcdFx0eGhyOiBmdW5jdGlvbihwKSB7XG5cdFx0XHRcdGlmIChwLm1ldGhvZCAhPT0gJ2dldCcgJiYgcC5tZXRob2QgIT09ICdkZWxldGUnICYmICFoZWxsby51dGlscy5oYXNCaW5hcnkocC5kYXRhKSkge1xuXG5cdFx0XHRcdFx0Ly8gRG9lcyB0aGlzIGhhdmUgYSBkYXRhLXVyaSB0byB1cGxvYWQgYXMgYSBmaWxlP1xuXHRcdFx0XHRcdGlmICh0eXBlb2YgKHAuZGF0YS5maWxlKSA9PT0gJ3N0cmluZycpIHtcblx0XHRcdFx0XHRcdHAuZGF0YS5maWxlID0gaGVsbG8udXRpbHMudG9CbG9iKHAuZGF0YS5maWxlKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0XHRwLmRhdGEgPSBKU09OLnN0cmluZ2lmeShwLmRhdGEpO1xuXHRcdFx0XHRcdFx0cC5oZWFkZXJzID0ge1xuXHRcdFx0XHRcdFx0XHQnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXG5cdFx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fSxcblxuXHRcdFx0anNvbnA6IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0aWYgKHAubWV0aG9kICE9PSAnZ2V0JyAmJiAhaGVsbG8udXRpbHMuaGFzQmluYXJ5KHAuZGF0YSkpIHtcblx0XHRcdFx0XHRwLmRhdGEubWV0aG9kID0gcC5tZXRob2Q7XG5cdFx0XHRcdFx0cC5tZXRob2QgPSAnZ2V0Jztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0ZnVuY3Rpb24gZm9ybWF0RGVmYXVsdChvKSB7XG5cdFx0aWYgKCdkYXRhJyBpbiBvKSB7XG5cdFx0XHRvLmRhdGEuZm9yRWFjaChmdW5jdGlvbihkKSB7XG5cdFx0XHRcdGlmIChkLnBpY3R1cmUpIHtcblx0XHRcdFx0XHRkLnRodW1ibmFpbCA9IGQucGljdHVyZTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChkLmltYWdlcykge1xuXHRcdFx0XHRcdGQucGljdHVyZXMgPSBkLmltYWdlc1xuXHRcdFx0XHRcdFx0Lm1hcChmb3JtYXRJbWFnZSlcblx0XHRcdFx0XHRcdC5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGEud2lkdGggLSBiLndpZHRoO1xuXHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0SW1hZ2UoaW1hZ2UpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0d2lkdGg6IGltYWdlLndpZHRoLFxuXHRcdFx0aGVpZ2h0OiBpbWFnZS5oZWlnaHQsXG5cdFx0XHRzb3VyY2U6IGltYWdlLnNvdXJjZVxuXHRcdH07XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRBbGJ1bXMobykge1xuXHRcdGlmICgnZGF0YScgaW4gbykge1xuXHRcdFx0by5kYXRhLmZvckVhY2goZnVuY3Rpb24oZCkge1xuXHRcdFx0XHRkLnBob3RvcyA9IGQuZmlsZXMgPSAnaHR0cHM6Ly9hcGlzLmxpdmUubmV0L3Y1LjAvJyArIGQuaWQgKyAnL3Bob3Rvcyc7XG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdFVzZXIobywgaGVhZGVycywgcmVxKSB7XG5cdFx0aWYgKG8uaWQpIHtcblx0XHRcdHZhciB0b2tlbiA9IHJlcS5xdWVyeS5hY2Nlc3NfdG9rZW47XG5cdFx0XHRpZiAoby5lbWFpbHMpIHtcblx0XHRcdFx0by5lbWFpbCA9IG8uZW1haWxzLnByZWZlcnJlZDtcblx0XHRcdH1cblxuXHRcdFx0Ly8gSWYgdGhpcyBpcyBub3QgYW4gbm9uLW5ldHdvcmsgZnJpZW5kXG5cdFx0XHRpZiAoby5pc19mcmllbmQgIT09IGZhbHNlKSB7XG5cdFx0XHRcdC8vIFVzZSB0aGUgaWQgb2YgdGhlIHVzZXJfaWQgaWYgYXZhaWxhYmxlXG5cdFx0XHRcdHZhciBpZCA9IChvLnVzZXJfaWQgfHwgby5pZCk7XG5cdFx0XHRcdG8udGh1bWJuYWlsID0gby5waWN0dXJlID0gJ2h0dHBzOi8vYXBpcy5saXZlLm5ldC92NS4wLycgKyBpZCArICcvcGljdHVyZT9hY2Nlc3NfdG9rZW49JyArIHRva2VuO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBvO1xuXHR9XG5cblx0ZnVuY3Rpb24gZm9ybWF0RnJpZW5kcyhvLCBoZWFkZXJzLCByZXEpIHtcblx0XHRpZiAoJ2RhdGEnIGluIG8pIHtcblx0XHRcdG8uZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGQpIHtcblx0XHRcdFx0Zm9ybWF0VXNlcihkLCBoZWFkZXJzLCByZXEpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG87XG5cdH1cblxufSkoaGVsbG8pO1xuXG4oZnVuY3Rpb24oaGVsbG8pIHtcblxuXHRoZWxsby5pbml0KHtcblxuXHRcdHlhaG9vOiB7XG5cblx0XHRcdC8vIEVuc3VyZSB0aGF0IHlvdSBkZWZpbmUgYW4gb2F1dGhfcHJveHlcblx0XHRcdG9hdXRoOiB7XG5cdFx0XHRcdHZlcnNpb246ICcxLjBhJyxcblx0XHRcdFx0YXV0aDogJ2h0dHBzOi8vYXBpLmxvZ2luLnlhaG9vLmNvbS9vYXV0aC92Mi9yZXF1ZXN0X2F1dGgnLFxuXHRcdFx0XHRyZXF1ZXN0OiAnaHR0cHM6Ly9hcGkubG9naW4ueWFob28uY29tL29hdXRoL3YyL2dldF9yZXF1ZXN0X3Rva2VuJyxcblx0XHRcdFx0dG9rZW46ICdodHRwczovL2FwaS5sb2dpbi55YWhvby5jb20vb2F1dGgvdjIvZ2V0X3Rva2VuJ1xuXHRcdFx0fSxcblxuXHRcdFx0Ly8gTG9naW4gaGFuZGxlclxuXHRcdFx0bG9naW46IGZ1bmN0aW9uKHApIHtcblx0XHRcdFx0Ly8gQ2hhbmdlIHRoZSBkZWZhdWx0IHBvcHVwIHdpbmRvdyB0byBiZSBhdCBsZWFzdCA1NjBcblx0XHRcdFx0Ly8gWWFob28gZG9lcyBkeW5hbWljYWxseSBjaGFuZ2UgaXQgb24gdGhlIGZseSBmb3IgdGhlIHNpZ25pbiBzY3JlZW4gKG9ubHksIHdoYXQgaWYgeW91ciBhbHJlYWR5IHNpZ25lZCBpbilcblx0XHRcdFx0cC5vcHRpb25zLnBvcHVwLndpZHRoID0gNTYwO1xuXG5cdFx0XHRcdC8vIFlhaG9vIHRocm93cyBhbiBwYXJhbWV0ZXIgZXJyb3IgaWYgZm9yIHdoYXRldmVyIHJlYXNvbiB0aGUgc3RhdGUuc2NvcGUgY29udGFpbnMgYSBjb21tYSwgc28gbGV0cyByZW1vdmUgc2NvcGVcblx0XHRcdFx0dHJ5IHtkZWxldGUgcC5xcy5zdGF0ZS5zY29wZTt9XG5cdFx0XHRcdGNhdGNoIChlKSB7fVxuXHRcdFx0fSxcblxuXHRcdFx0YmFzZTogJ2h0dHBzOi8vc29jaWFsLnlhaG9vYXBpcy5jb20vdjEvJyxcblxuXHRcdFx0Z2V0OiB7XG5cdFx0XHRcdG1lOiB5cWwoJ3NlbGVjdCAqIGZyb20gc29jaWFsLnByb2ZpbGUoMCkgd2hlcmUgZ3VpZD1tZScpLFxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IHlxbCgnc2VsZWN0ICogZnJvbSBzb2NpYWwuY29udGFjdHMoMCkgd2hlcmUgZ3VpZD1tZScpLFxuXHRcdFx0XHQnbWUvZm9sbG93aW5nJzogeXFsKCdzZWxlY3QgKiBmcm9tIHNvY2lhbC5jb250YWN0cygwKSB3aGVyZSBndWlkPW1lJylcblx0XHRcdH0sXG5cdFx0XHR3cmFwOiB7XG5cdFx0XHRcdG1lOiBmb3JtYXRVc2VyLFxuXG5cdFx0XHRcdC8vIENhbid0IGdldCBJRHNcblx0XHRcdFx0Ly8gSXQgbWlnaHQgYmUgYmV0dGVyIHRvIGxvb3AgdGhyb3VnaCB0aGUgc29jaWFsLnJlbGF0aW9uc2hpcCB0YWJsZSB3aXRoIGhhcyB1bmlxdWUgSURzIG9mIHVzZXJzLlxuXHRcdFx0XHQnbWUvZnJpZW5kcyc6IGZvcm1hdEZyaWVuZHMsXG5cdFx0XHRcdCdtZS9mb2xsb3dpbmcnOiBmb3JtYXRGcmllbmRzLFxuXHRcdFx0XHQnZGVmYXVsdCc6IHBhZ2luZ1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG5cblx0Lypcblx0XHQvLyBBdXRvLXJlZnJlc2ggZml4OiBidWcgaW4gWWFob28gY2FuJ3QgZ2V0IHRoaXMgdG8gd29yayB3aXRoIG5vZGUtb2F1dGgtc2hpbVxuXHRcdGxvZ2luIDogZnVuY3Rpb24obyl7XG5cdFx0XHQvLyBJcyB0aGUgdXNlciBhbHJlYWR5IGxvZ2dlZCBpblxuXHRcdFx0dmFyIGF1dGggPSBoZWxsbygneWFob28nKS5nZXRBdXRoUmVzcG9uc2UoKTtcblxuXHRcdFx0Ly8gSXMgdGhpcyBhIHJlZnJlc2ggdG9rZW4/XG5cdFx0XHRpZihvLm9wdGlvbnMuZGlzcGxheT09PSdub25lJyYmYXV0aCYmYXV0aC5hY2Nlc3NfdG9rZW4mJmF1dGgucmVmcmVzaF90b2tlbil7XG5cdFx0XHRcdC8vIEFkZCB0aGUgb2xkIHRva2VuIGFuZCB0aGUgcmVmcmVzaCB0b2tlbiwgaW5jbHVkaW5nIHBhdGggdG8gdGhlIHF1ZXJ5XG5cdFx0XHRcdC8vIFNlZSBodHRwOi8vZGV2ZWxvcGVyLnlhaG9vLmNvbS9vYXV0aC9ndWlkZS9vYXV0aC1yZWZyZXNoYWNjZXNzdG9rZW4uaHRtbFxuXHRcdFx0XHRvLnFzLmFjY2Vzc190b2tlbiA9IGF1dGguYWNjZXNzX3Rva2VuO1xuXHRcdFx0XHRvLnFzLnJlZnJlc2hfdG9rZW4gPSBhdXRoLnJlZnJlc2hfdG9rZW47XG5cdFx0XHRcdG8ucXMudG9rZW5fdXJsID0gJ2h0dHBzOi8vYXBpLmxvZ2luLnlhaG9vLmNvbS9vYXV0aC92Mi9nZXRfdG9rZW4nO1xuXHRcdFx0fVxuXHRcdH0sXG5cdCovXG5cblx0ZnVuY3Rpb24gZm9ybWF0RXJyb3Iobykge1xuXHRcdGlmIChvICYmICdtZXRhJyBpbiBvICYmICdlcnJvcl90eXBlJyBpbiBvLm1ldGEpIHtcblx0XHRcdG8uZXJyb3IgPSB7XG5cdFx0XHRcdGNvZGU6IG8ubWV0YS5lcnJvcl90eXBlLFxuXHRcdFx0XHRtZXNzYWdlOiBvLm1ldGEuZXJyb3JfbWVzc2FnZVxuXHRcdFx0fTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBmb3JtYXRVc2VyKG8pIHtcblxuXHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdGlmIChvLnF1ZXJ5ICYmIG8ucXVlcnkucmVzdWx0cyAmJiBvLnF1ZXJ5LnJlc3VsdHMucHJvZmlsZSkge1xuXHRcdFx0byA9IG8ucXVlcnkucmVzdWx0cy5wcm9maWxlO1xuXHRcdFx0by5pZCA9IG8uZ3VpZDtcblx0XHRcdG8ubGFzdF9uYW1lID0gby5mYW1pbHlOYW1lO1xuXHRcdFx0by5maXJzdF9uYW1lID0gby5naXZlbk5hbWUgfHwgby5uaWNrbmFtZTtcblx0XHRcdHZhciBhID0gW107XG5cdFx0XHRpZiAoby5maXJzdF9uYW1lKSB7XG5cdFx0XHRcdGEucHVzaChvLmZpcnN0X25hbWUpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAoby5sYXN0X25hbWUpIHtcblx0XHRcdFx0YS5wdXNoKG8ubGFzdF9uYW1lKTtcblx0XHRcdH1cblxuXHRcdFx0by5uYW1lID0gYS5qb2luKCcgJyk7XG5cdFx0XHRvLmVtYWlsID0gKG8uZW1haWxzICYmIG8uZW1haWxzWzBdKSA/IG8uZW1haWxzWzBdLmhhbmRsZSA6IG51bGw7XG5cdFx0XHRvLnRodW1ibmFpbCA9IG8uaW1hZ2UgPyBvLmltYWdlLmltYWdlVXJsIDogbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyaWVuZHMobywgaGVhZGVycywgcmVxdWVzdCkge1xuXHRcdGZvcm1hdEVycm9yKG8pO1xuXHRcdHBhZ2luZyhvLCBoZWFkZXJzLCByZXF1ZXN0KTtcblx0XHR2YXIgY29udGFjdDtcblx0XHR2YXIgZmllbGQ7XG5cdFx0aWYgKG8ucXVlcnkgJiYgby5xdWVyeS5yZXN1bHRzICYmIG8ucXVlcnkucmVzdWx0cy5jb250YWN0KSB7XG5cdFx0XHRvLmRhdGEgPSBvLnF1ZXJ5LnJlc3VsdHMuY29udGFjdDtcblx0XHRcdGRlbGV0ZSBvLnF1ZXJ5O1xuXG5cdFx0XHRpZiAoIUFycmF5LmlzQXJyYXkoby5kYXRhKSkge1xuXHRcdFx0XHRvLmRhdGEgPSBbby5kYXRhXTtcblx0XHRcdH1cblxuXHRcdFx0by5kYXRhLmZvckVhY2goZm9ybWF0RnJpZW5kKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gbztcblx0fVxuXG5cdGZ1bmN0aW9uIGZvcm1hdEZyaWVuZChjb250YWN0KSB7XG5cdFx0Y29udGFjdC5pZCA9IG51bGw7XG5cdFx0KGNvbnRhY3QuZmllbGRzIHx8IFtdKS5mb3JFYWNoKGZ1bmN0aW9uKGZpZWxkKSB7XG5cdFx0XHRpZiAoZmllbGQudHlwZSA9PT0gJ2VtYWlsJykge1xuXHRcdFx0XHRjb250YWN0LmVtYWlsID0gZmllbGQudmFsdWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWVsZC50eXBlID09PSAnbmFtZScpIHtcblx0XHRcdFx0Y29udGFjdC5maXJzdF9uYW1lID0gZmllbGQudmFsdWUuZ2l2ZW5OYW1lO1xuXHRcdFx0XHRjb250YWN0Lmxhc3RfbmFtZSA9IGZpZWxkLnZhbHVlLmZhbWlseU5hbWU7XG5cdFx0XHRcdGNvbnRhY3QubmFtZSA9IGZpZWxkLnZhbHVlLmdpdmVuTmFtZSArICcgJyArIGZpZWxkLnZhbHVlLmZhbWlseU5hbWU7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaWVsZC50eXBlID09PSAneWFob29pZCcpIHtcblx0XHRcdFx0Y29udGFjdC5pZCA9IGZpZWxkLnZhbHVlO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gcGFnaW5nKHJlcywgaGVhZGVycywgcmVxdWVzdCkge1xuXG5cdFx0Ly8gU2VlOiBodHRwOi8vZGV2ZWxvcGVyLnlhaG9vLmNvbS95cWwvZ3VpZGUvcGFnaW5nLmh0bWwjbG9jYWxfbGltaXRzXG5cdFx0aWYgKHJlcy5xdWVyeSAmJiByZXMucXVlcnkuY291bnQgJiYgcmVxdWVzdC5vcHRpb25zKSB7XG5cdFx0XHRyZXMucGFnaW5nID0ge1xuXHRcdFx0XHRuZXh0OiAnP3N0YXJ0PScgKyAocmVzLnF1ZXJ5LmNvdW50ICsgKCtyZXF1ZXN0Lm9wdGlvbnMuc3RhcnQgfHwgMSkpXG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHJldHVybiByZXM7XG5cdH1cblxuXHRmdW5jdGlvbiB5cWwocSkge1xuXHRcdHJldHVybiAnaHR0cHM6Ly9xdWVyeS55YWhvb2FwaXMuY29tL3YxL3lxbD9xPScgKyAocSArICcgbGltaXQgQHtsaW1pdHwxMDB9IG9mZnNldCBAe3N0YXJ0fDB9JykucmVwbGFjZSgvXFxzL2csICclMjAnKSArICcmZm9ybWF0PWpzb24nO1xuXHR9XG5cbn0pKGhlbGxvKTtcblxuLy8gUmVnaXN0ZXIgYXMgYW5vbnltb3VzIEFNRCBtb2R1bGVcbmlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcblx0ZGVmaW5lKGZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBoZWxsbztcblx0fSk7XG59XG5cbi8vIENvbW1vbkpTIG1vZHVsZSBmb3IgYnJvd3NlcmlmeVxuaWYgKHR5cGVvZiBtb2R1bGUgPT09ICdvYmplY3QnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdG1vZHVsZS5leHBvcnRzID0gaGVsbG87XG59XG4iLCJpbXBvcnQgTWluaUJ1cyBmcm9tICcuL01pbmlCdXMnO1xuLyoqXG4qIE1lc3NhZ2UgQlVTIEludGVyZmFjZSBpcyBhbiBleHRlbnNpb24gb2YgdGhlIE1pbmlCdXNcbiogSXQgZG9lc24ndCBzdXBwb3J0IHRoZSBkZWZhdWx0ICcqJyBsaXN0ZW5lciwgaW5zdGVhZCBpdCB1c2VzIHRoZSByZWdpc3RyeS5yZXNvbHZlKC4uKVxuKi9cbmNsYXNzIE1lc3NhZ2VCdXMgZXh0ZW5kcyBNaW5pQnVzIHtcbiAgLyogcHJpdmF0ZVxuICBfcmVnaXN0cnk6IFJlZ2lzdHJ5XG4gICovXG5cbiAgLy9UT0RPOiBmdXR1cmUgb3B0aW1pemF0aW9uXG4gIC8vMS4gbWVzc2FnZSBiYXRjaCBwcm9jZXNzaW5nIHdpdGggc2V0SW50ZXJ2YWxcbiAgLy8yLiByZXNvbHZlIGRlZmF1bHQgZ2F0ZXdheS9wcm90b3N0dWIgd2l0aCByZWdpc3Rlci5yZXNvbHZlXG5cbiAgY29uc3RydWN0b3IocmVnaXN0cnkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX3JlZ2lzdHJ5ID0gcmVnaXN0cnk7XG4gIH1cblxuICBfb25Qb3N0TWVzc2FnZShtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9yZXNvbHZlIGV4dGVybmFsIHByb3Rvc3R1Yi4uLlxuICAgIF90aGlzLl9yZWdpc3RyeS5yZXNvbHZlKG1zZy50bykudGhlbigocHJvdG9TdHViVVJMKSA9PiB7XG5cbiAgICAgIGxldCBpdGVtTGlzdCA9IF90aGlzLl9zdWJzY3JpcHRpb25zW3Byb3RvU3R1YlVSTF07XG4gICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgX3RoaXMuX3B1Ymxpc2hPbihpdGVtTGlzdCwgbXNnKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaChmdW5jdGlvbihlKSB7XG4gICAgICBjb25zb2xlLmxvZygnUFJPVE8tU1RVQi1FUlJPUjogJywgZSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgTWVzc2FnZUJ1cztcbiIsImltcG9ydCBQaXBlbGluZSBmcm9tICcuL1BpcGVsaW5lJztcblxuLyoqXG4qIEBhdXRob3IgbWljYWVscGVkcm9zYUBnbWFpbC5jb21cbiogTWluaW1hbCBpbnRlcmZhY2UgYW5kIGltcGxlbWVudGF0aW9uIHRvIHNlbmQgYW5kIHJlY2VpdmUgbWVzc2FnZXMuIEl0IGNhbiBiZSByZXVzZWQgaW4gbWFueSB0eXBlIG9mIGNvbXBvbmVudHMuXG4qIENvbXBvbmVudHMgdGhhdCBuZWVkIGEgbWVzc2FnZSBzeXN0ZW0gc2hvdWxkIHJlY2VpdmUgdGhpcyBjbGFzcyBhcyBhIGRlcGVuZGVuY3kgb3IgZXh0ZW5kIGl0LlxuKiBFeHRlbnNpb25zIHNob3VsZCBpbXBsZW1lbnQgdGhlIGZvbGxvd2luZyBwcml2YXRlIG1ldGhvZHM6IF9vblBvc3RNZXNzYWdlIGFuZCBfcmVnaXN0ZXJFeHRlcm5hbExpc3RlbmVyXG4qL1xuY2xhc3MgTWluaUJ1cyB7XG4gIC8qIHByaXZhdGVcbiAgX21zZ0lkOiBudW1iZXI7XG4gIF9zdWJzY3JpcHRpb25zOiA8dXJsOiBNc2dMaXN0ZW5lcltdPlxuXG4gIF9yZXNwb25zZVRpbWVPdXQ6IG51bWJlclxuICBfcmVzcG9uc2VDYWxsYmFja3M6IDx1cmwraWQ6IChtc2cpID0+IHZvaWQ+XG5cbiAgX3BpcGVsaW5lOiBQaXBlbGluZVxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMuX21zZ0lkID0gMDtcbiAgICBfdGhpcy5fc3Vic2NyaXB0aW9ucyA9IHt9O1xuXG4gICAgX3RoaXMuX3Jlc3BvbnNlVGltZU91dCA9IDMwMDA7IC8vZGVmYXVsdCB0byAzc1xuICAgIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrcyA9IHt9O1xuXG4gICAgX3RoaXMuX3BpcGVsaW5lID0gbmV3IFBpcGVsaW5lKChlcnJvcikgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1BJUEVMSU5FLUVSUk9SOiAnLCBKU09OLnN0cmluZ2lmeShlcnJvcikpO1xuICAgIH0pO1xuXG4gICAgX3RoaXMuX3JlZ2lzdGVyRXh0ZXJuYWxMaXN0ZW5lcigpO1xuICB9XG5cbiAgZ2V0IHBpcGVsaW5lKCkgeyByZXR1cm4gdGhpcy5fcGlwZWxpbmU7IH1cblxuICAvKipcbiAgKiBSZWdpc3RlciBsaXN0ZW5lciB0byByZWNlaXZlIG1lc3NhZ2Ugd2hlbiBcIm1zZy50byA9PT0gdXJsXCIuXG4gICogU3BlY2lhbCB1cmwgXCIqXCIgZm9yIGRlZmF1bHQgbGlzdGVuZXIgaXMgYWNjZXB0ZWQgdG8gaW50ZXJjZXB0IGFsbCBtZXNzYWdlcy5cbiAgKiBAcGFyYW0ge1VSTH0gdXJsIEFkZHJlc3MgdG8gaW50ZXJjZXB0LCB0aGEgaXMgaW4gdGhlIG1lc3NhZ2UgXCJ0b1wiXG4gICogQHBhcmFtIHtMaXN0ZW5lcn0gbGlzdGVuZXIgbGlzdGVuZXJcbiAgKiBAcmV0dXJuIHtNc2dMaXN0ZW5lcn0gaW5zdGFuY2Ugb2YgTXNnTGlzdGVuZXJcbiAgKi9cbiAgYWRkTGlzdGVuZXIodXJsLCBsaXN0ZW5lcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgaXRlbSA9IG5ldyBNc2dMaXN0ZW5lcihfdGhpcy5fc3Vic2NyaXB0aW9ucywgdXJsLCBsaXN0ZW5lcik7XG4gICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXTtcbiAgICBpZiAoIWl0ZW1MaXN0KSB7XG4gICAgICBpdGVtTGlzdCA9IFtdO1xuICAgICAgX3RoaXMuX3N1YnNjcmlwdGlvbnNbdXJsXSA9IGl0ZW1MaXN0O1xuICAgIH1cblxuICAgIGl0ZW1MaXN0LnB1c2goaXRlbSk7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICAvKipcbiAgICogTWFudWFsbHkgYWRkIGEgcmVzcG9uc2UgbGlzdGVuZXIuIE9ubHkgb25lIGxpc3RlbmVyIHBlciBtZXNzYWdlIElEIHNob3VsZCBleGlzdC5cbiAgICogQVRFTlRJT04sIHRoZXJlIGlzIG5vIHRpbWVvdXQgZm9yIHRoaXMgbGlzdGVuZXIuXG4gICAqIFRoZSBsaXN0ZW5lciBzaG91bGQgYmUgcmVtb3ZlZCB3aXRoIGEgcmVtb3ZlUmVzcG9uc2VMaXN0ZW5lciwgZmFpbGluZyB0byBkbyB0aGlzIHdpbGwgcmVzdWx0IGluIGEgdW5yZWxlYXNlZCBtZW1vcnkgcHJvYmxlbS5cbiAgICogQHBhcmFtIHtVUkx9IHVybCBPcmlnaW4gYWRkcmVzcyBvZiB0aGUgbWVzc2FnZSBzZW50LCBcIm1zZy5mcm9tXCIuXG4gICAqIEBwYXJhbSB7bnVtYmVyfSBtc2dJZCBNZXNzYWdlIElEIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSB0aGUgcG9zdE1lc3NhZ2UuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHJlc3BvbnNlTGlzdGVuZXIgQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHRoZSByZXNwb25zZVxuICAgKi9cbiAgYWRkUmVzcG9uc2VMaXN0ZW5lcih1cmwsIG1zZ0lkLCByZXNwb25zZUxpc3RlbmVyKSB7XG4gICAgdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbdXJsICsgbXNnSWRdID0gcmVzcG9uc2VMaXN0ZW5lcjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgdGhlIHJlc3BvbnNlIGxpc3RlbmVyLlxuICAgKiBAcGFyYW0ge1VSTH0gdXJsIE9yaWdpbiBhZGRyZXNzIG9mIHRoZSBtZXNzYWdlIHNlbnQsIFwibXNnLmZyb21cIi5cbiAgICogQHBhcmFtIHtudW1iZXJ9IG1zZ0lkICBNZXNzYWdlIElEIHRoYXQgaXMgcmV0dXJuZWQgZnJvbSB0aGUgcG9zdE1lc3NhZ2VcbiAgICovXG4gIHJlbW92ZVJlc3BvbnNlTGlzdGVuZXIodXJsLCBtc2dJZCkge1xuICAgIGRlbGV0ZSB0aGlzLl9yZXNwb25zZUNhbGxiYWNrc1t1cmwgKyBtc2dJZF07XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBleGlzdGVudCBsaXN0ZW5lcnMgZm9yIHRoZSBVUkxcbiAgICogQHBhcmFtICB7VVJMfSB1cmwgQWRkcmVzcyByZWdpc3RlcmVkXG4gICAqL1xuICByZW1vdmVBbGxMaXN0ZW5lcnNPZih1cmwpIHtcbiAgICBkZWxldGUgdGhpcy5fc3Vic2NyaXB0aW9uc1t1cmxdO1xuICB9XG5cbiAgLyoqXG4gICogU2VuZCBtZXNzYWdlcyB0byBsb2NhbCBsaXN0ZW5lcnMsIG9yIGlmIG5vdCBleGlzdHMgdG8gZXh0ZXJuYWwgbGlzdGVuZXJzLlxuICAqIEl0J3MgaGFzIGFuIG9wdGlvbmFsIG1lY2hhbmlzbSBmb3IgYXV0b21hdGljIG1hbmFnZW1lbnQgb2YgcmVzcG9uc2UgaGFuZGxlcnMuXG4gICogVGhlIHJlc3BvbnNlIGhhbmRsZXIgd2lsbCBiZSB1bnJlZ2lzdGVyZWQgYWZ0ZXIgcmVjZWl2aW5nIHRoZSByZXNwb25zZSwgb3IgYWZ0ZXIgcmVzcG9uc2UgdGltZW91dCAoZGVmYXVsdCB0byAzcykuXG4gICogQHBhcmFtICB7TWVzc2FnZX0gbXNnIE1lc3NhZ2UgdG8gc2VuZC4gTWVzc2FnZSBJRCBpcyBhdXRvbWF0aWNhbGx5IGFkZGVkIHRvIHRoZSBtZXNzYWdlLlxuICAqIEBwYXJhbSAge0Z1bmN0aW9ufSByZXNwb25zZUNhbGxiYWNrIE9wdGlvbmFsIHBhcmFtZXRlciwgaWYgdGhlIGRldmVsb3BlciB3aGF0J3MgYXV0b21hdGljIHJlc3BvbnNlIG1hbmFnZW1lbnQuXG4gICogQHJldHVybiB7bnVtYmVyfSBSZXR1cm5zIHRoZSBtZXNzYWdlIElELCBpbiBjYXNlIGl0IHNob3VsZCBiZSBuZWVkZWQgZm9yIG1hbnVhbCBtYW5hZ2VtZW50IG9mIHRoZSByZXNwb25zZSBoYW5kbGVyLlxuICAqL1xuICBwb3N0TWVzc2FnZShpbk1zZywgcmVzcG9uc2VDYWxsYmFjaykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvL1RPRE86IGhvdyBkbyB3ZSBtYW5hZ2UgbWVzc2FnZSBJRCdzPyBTaG91bGQgaXQgYmUgYSBnbG9iYWwgcnVudGltZSBjb3VudGVyLCBvciBwZXIgVVJMIGFkZHJlc3M/XG4gICAgLy9HbG9iYWwgY291bnRlciB3aWxsIG5vdCB3b3JrLCBiZWNhdXNlIHRoZXJlIHdpbGwgYmUgbXVsdGlwbGUgTWluaUJ1cyBpbnN0YW5jZXMhXG4gICAgLy9QZXIgVVJMLCBjYW4gYmUgYSBsb3Qgb2YgZGF0YSB0byBtYWludGFpbiFcbiAgICAvL01heWJlIGEgY291bnRlciBwZXIgTWluaUJ1cyBpbnN0YW5jZS4gVGhpcyBpcyB0aGUgYXNzdW1lZCBzb2x1dGlvbiBmb3Igbm93LlxuICAgIGlmICghaW5Nc2cuaWQgfHwgaW5Nc2cuaWQgPT09IDApIHtcbiAgICAgIF90aGlzLl9tc2dJZCsrO1xuICAgICAgaW5Nc2cuaWQgPSBfdGhpcy5fbXNnSWQ7XG4gICAgfVxuXG4gICAgX3RoaXMuX3BpcGVsaW5lLnByb2Nlc3MoaW5Nc2csIChtc2cpID0+IHtcblxuICAgICAgLy9hdXRvbWF0aWMgbWFuYWdlbWVudCBvZiByZXNwb25zZSBoYW5kbGVyc1xuICAgICAgaWYgKHJlc3BvbnNlQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHJlc3BvbnNlSWQgPSBtc2cuZnJvbSArIG1zZy5pZDtcbiAgICAgICAgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdID0gcmVzcG9uc2VDYWxsYmFjaztcblxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBsZXQgcmVzcG9uc2VGdW4gPSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG4gICAgICAgICAgZGVsZXRlIF90aGlzLl9yZXNwb25zZUNhbGxiYWNrc1tyZXNwb25zZUlkXTtcblxuICAgICAgICAgIGlmIChyZXNwb25zZUZ1bikge1xuICAgICAgICAgICAgbGV0IGVycm9yTXNnID0ge1xuICAgICAgICAgICAgICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLFxuICAgICAgICAgICAgICBib2R5OiB7Y29kZTogJ2Vycm9yJywgZGVzYzogJ1Jlc3BvbnNlIHRpbWVvdXQhJ31cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIHJlc3BvbnNlRnVuKGVycm9yTXNnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIF90aGlzLl9yZXNwb25zZVRpbWVPdXQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoIV90aGlzLl9vblJlc3BvbnNlKG1zZykpIHtcbiAgICAgICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbbXNnLnRvXTtcbiAgICAgICAgaWYgKGl0ZW1MaXN0KSB7XG4gICAgICAgICAgLy9kbyBub3QgcHVibGlzaCBvbiBkZWZhdWx0IGFkZHJlc3MsIGJlY2F1c2Ugb2YgbG9vcGJhY2sgY3ljbGVcbiAgICAgICAgICBfdGhpcy5fcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vaWYgdGhlcmUgaXMgbm8gbGlzdGVuZXIsIHNlbmQgdG8gZXh0ZXJuYWwgaW50ZXJmYWNlXG4gICAgICAgICAgX3RoaXMuX29uUG9zdE1lc3NhZ2UobXNnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluTXNnLmlkO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciBtZXRob2QgdG8gYmluZCBsaXN0ZW5lcnMgKGluIGJvdGggZGlyZWN0aW9ucykgaW50byBvdGhlciBNaW5pQnVzIHRhcmdldC5cbiAgICogQHBhcmFtICB7VVJMfSBvdXRVcmwgT3V0Ym91bmQgVVJMLCByZWdpc3RlciBsaXN0ZW5lciBmb3IgdXJsIGluIGRpcmVjdGlvbiBcInRoaXMgLT4gdGFyZ2V0XCJcbiAgICogQHBhcmFtICB7VVJMfSBpblVybCBJbmJvdW5kIFVSTCwgcmVnaXN0ZXIgbGlzdGVuZXIgZm9yIHVybCBpbiBkaXJlY3Rpb24gXCJ0YXJnZXQgLT4gdGhpc1wiXG4gICAqIEBwYXJhbSAge01pbmlCdXN9IHRhcmdldCBUaGUgb3RoZXIgdGFyZ2V0IE1pbmlCdXNcbiAgICogQHJldHVybiB7Qm91bmR9IGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSBwcm9wZXJ0aWVzIFt0aGlzTGlzdGVuZXIsIHRhcmdldExpc3RlbmVyXSBhbmQgdGhlIHVuYmluZCBtZXRob2QuXG4gICAqL1xuICBiaW5kKG91dFVybCwgaW5VcmwsIHRhcmdldCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBsZXQgdGhpc0xpc3RuID0gX3RoaXMuYWRkTGlzdGVuZXIob3V0VXJsLCAobXNnKSA9PiB7XG4gICAgICB0YXJnZXQucG9zdE1lc3NhZ2UobXNnKTtcbiAgICB9KTtcblxuICAgIGxldCB0YXJnZXRMaXN0biA9IHRhcmdldC5hZGRMaXN0ZW5lcihpblVybCwgKG1zZykgPT4ge1xuICAgICAgX3RoaXMucG9zdE1lc3NhZ2UobXNnKTtcbiAgICB9KTtcblxuICAgIHJldHVybiB7XG4gICAgICB0aGlzTGlzdGVuZXI6IHRoaXNMaXN0bixcbiAgICAgIHRhcmdldExpc3RlbmVyOiB0YXJnZXRMaXN0bixcbiAgICAgIHVuYmluZDogKCkgPT4ge1xuICAgICAgICB0aGlzLnRoaXNMaXN0ZW5lci5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy50YXJnZXRMaXN0ZW5lci5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgLy9wdWJsaXNoIG9uIGEgc3Vic2NyaXB0aW9uIGxpc3QuXG4gIF9wdWJsaXNoT24oaXRlbUxpc3QsIG1zZykge1xuICAgIGl0ZW1MaXN0LmZvckVhY2goKHN1YikgPT4ge1xuICAgICAgc3ViLl9jYWxsYmFjayhtc2cpO1xuICAgIH0pO1xuICB9XG5cbiAgX29uUmVzcG9uc2UobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmIChtc2cudHlwZSA9PT0gJ3Jlc3BvbnNlJykge1xuICAgICAgbGV0IHJlc3BvbnNlSWQgPSBtc2cudG8gKyBtc2cuaWQ7XG4gICAgICBsZXQgcmVzcG9uc2VGdW4gPSBfdGhpcy5fcmVzcG9uc2VDYWxsYmFja3NbcmVzcG9uc2VJZF07XG4gICAgICBkZWxldGUgX3RoaXMuX3Jlc3BvbnNlQ2FsbGJhY2tzW3Jlc3BvbnNlSWRdO1xuXG4gICAgICBpZiAocmVzcG9uc2VGdW4pIHtcbiAgICAgICAgcmVzcG9uc2VGdW4obXNnKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgLy9yZWNlaXZlIG1lc3NhZ2VzIGZyb20gZXh0ZXJuYWwgaW50ZXJmYWNlXG4gIF9vbk1lc3NhZ2UobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghX3RoaXMuX29uUmVzcG9uc2UobXNnKSkge1xuICAgICAgbGV0IGl0ZW1MaXN0ID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbbXNnLnRvXTtcbiAgICAgIGlmIChpdGVtTGlzdCkge1xuICAgICAgICBfdGhpcy5fcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9pcyB0aGVyZSBhbnkgXCIqXCIgKGRlZmF1bHQpIGxpc3RlbmVycz9cbiAgICAgICAgaXRlbUxpc3QgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1snKiddO1xuICAgICAgICBpZiAoaXRlbUxpc3QpIHtcbiAgICAgICAgICBfdGhpcy5fcHVibGlzaE9uKGl0ZW1MaXN0LCBtc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE5vdCBwdWJsaWMgYXZhaWxhYmxlLCB1c2VkIGJ5IHRoZSBjbGFzcyBleHRlbnNpb24gaW1wbGVtZW50YXRpb24sIHRvIHByb2Nlc3MgbWVzc2FnZXMgZnJvbSB0aGUgcHVibGljIFwicG9zdE1lc3NhZ2VcIiB3aXRob3V0IGEgcmVnaXN0ZXJlZCBsaXN0ZW5lci5cbiAgICogVXNlZCB0byBzZW5kIHRoZSBtZXNzYWdlIHRvIGFuIGV4dGVybmFsIGludGVyZmFjZSwgbGlrZSBhIFdlYldvcmtlciwgSUZyYW1lLCBldGMuXG4gICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gbXNnIE1lc3NhZ2VcbiAgICovXG4gIF9vblBvc3RNZXNzYWdlKG1zZykgeyAvKmltcGxlbWVudGF0aW9uIHdpbGwgc2VuZCBtZXNzYWdlIHRvIGV4dGVybmFsIHN5c3RlbSovIH1cblxuICAvKipcbiAgICogTm90IHB1YmxpYyBhdmFpbGFibGUsIHVzZWQgYnkgdGhlIGNsYXNzIGV4dGVuc2lvbiBpbXBsZW1lbnRhdGlvbiwgdG8gcHJvY2VzcyBhbGwgbWVzc2FnZXMgdGhhdCBlbnRlciB0aGUgTWluaUJ1cyBmcm9tIGFuIGV4dGVybmFsIGludGVyZmFjZSwgbGlrZSBhIFdlYldvcmtlciwgSUZyYW1lLCBldGMuXG4gICAqIFRoaXMgbWV0aG9kIGlzIGNhbGxlZCBvbmUgdGltZSBpbiB0aGUgY29uc3RydWN0b3IgdG8gcmVnaXN0ZXIgZXh0ZXJuYWwgbGlzdGVuZXJzLlxuICAgKiBUaGUgaW1wbGVtZW50YXRpb24gd2lsbCBwcm9iYWJseSBjYWxsIHRoZSBcIl9vbk1lc3NhZ2VcIiBtZXRob2QgdG8gcHVibGlzaCBpbiB0aGUgbG9jYWwgbGlzdGVuZXJzLlxuICAgKiBETyBOT1QgY2FsbCBcInBvc3RNZXNzYWdlXCIsIHRoZXJlIGlzIGEgZGFuZ2VyIHRoYXQgdGhlIG1lc3NhZ2UgZW50ZXJzIGluIGEgY3ljbGUhXG4gICAqL1xuICBfcmVnaXN0ZXJFeHRlcm5hbExpc3RlbmVyKCkgeyAvKmltcGxlbWVudGF0aW9uIHdpbGwgcmVnaXN0ZXIgZXh0ZXJuYWwgbGlzdGVuZXIgYW5kIGNhbGwgXCJ0aGlzLl9vbk1lc3NhZ2UobXNnKVwiICovIH1cblxufVxuXG5jbGFzcyBNc2dMaXN0ZW5lciB7XG4gIC8qIHByaXZhdGVcbiAgX3N1YnNjcmlwdGlvbnM6IDxzdHJpbmc6IE1zZ0xpc3RlbmVyW10+O1xuICBfdXJsOiBzdHJpbmc7XG4gIF9jYWxsYmFjazogKG1zZykgPT4gdm9pZDtcbiAgKi9cblxuICBjb25zdHJ1Y3RvcihzdWJzY3JpcHRpb25zLCB1cmwsIGNhbGxiYWNrKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0gc3Vic2NyaXB0aW9ucztcbiAgICBfdGhpcy5fdXJsID0gdXJsO1xuICAgIF90aGlzLl9jYWxsYmFjayA9IGNhbGxiYWNrO1xuICB9XG5cbiAgZ2V0IHVybCgpIHsgcmV0dXJuIHRoaXMuX3VybDsgfVxuXG4gIHJlbW92ZSgpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IHN1YnMgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tfdGhpcy5fdXJsXTtcbiAgICBpZiAoc3Vicykge1xuICAgICAgbGV0IGluZGV4ID0gc3Vicy5pbmRleE9mKF90aGlzKTtcbiAgICAgIHN1YnMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgLy9pZiB0aGVyZSBhcmUgbm8gbGlzdGVuZXJzLCByZW1vdmUgdGhlIHN1YnNjcmlwdGlvbiBlbnRpcmVseS5cbiAgICAgIGlmIChzdWJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBkZWxldGUgX3RoaXMuX3N1YnNjcmlwdGlvbnNbX3RoaXMuX3VybF07XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IE1pbmlCdXM7XG4iLCIvKipcbiogQGF1dGhvciBtaWNhZWxwZWRyb3NhQGdtYWlsLmNvbVxuKiBQaXBlbGluZVxuKiBTZXF1ZW5jaWFsIHByb2Nlc3NvciBvZiBtZXRob2RzLiBTaW1pbGFyIHRvIGhvdyBTZXF1ZW50aWFsIFByb21pc2UncyB3b3JrLCBidXQgYmV0dGVyIGZpdCBmb3IgbWVzc2FnZSBwcm9jZXNzaW5nLlxuKi9cbmNsYXNzIFBpcGVsaW5lIHtcbiAgLyogcHVibGljXG4gICAgaGFuZGxlcnM6ICgoUGlwZUNvbnRleHQpID0+IHZvaWQpW11cbiAgICBvbkZhaWw6IChlcnJvcikgPT4gdm9pZFxuICAqL1xuXG4gIGNvbnN0cnVjdG9yKF9vbkZhaWwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuaGFuZGxlcnMgPSBbXTtcbiAgICBfdGhpcy5vbkZhaWwgPSBfb25GYWlsO1xuICB9XG5cbiAgcHJvY2Vzcyhtc2csIG9uRGVsaXZlcikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBpZiAoX3RoaXMuaGFuZGxlcnMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGl0ZXIgPSBuZXcgSXRlcmF0b3IoX3RoaXMuaGFuZGxlcnMpO1xuICAgICAgaXRlci5uZXh0KG5ldyBQaXBlQ29udGV4dChfdGhpcywgaXRlciwgbXNnLCBvbkRlbGl2ZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb25EZWxpdmVyKG1zZyk7XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFBpcGVDb250ZXh0IHtcbiAgLyogcHJpdmF0ZVxuICAgIF9pblN0b3A6IGJvb2xlYW5cblxuICAgIF9waXBlbGluZTogUGlwZWxpbmVcbiAgICBfaXRlcjogSXRlcmF0b3JcbiAgICBfbXNnOiBNZXNzYWdlXG4gICovXG5cbiAgY29uc3RydWN0b3IocGlwZWxpbmUsIGl0ZXIsIG1zZywgb25EZWxpdmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIF90aGlzLl9pblN0b3AgPSBmYWxzZTtcblxuICAgIF90aGlzLl9waXBlbGluZSA9IHBpcGVsaW5lO1xuICAgIF90aGlzLl9pdGVyID0gaXRlcjtcbiAgICBfdGhpcy5fbXNnID0gbXNnO1xuICAgIF90aGlzLl9vbkRlbGl2ZXIgPSBvbkRlbGl2ZXI7XG4gIH1cblxuICBnZXQgcGlwZWxpbmUoKSB7IHJldHVybiB0aGlzLl9waXBlbGluZTsgfVxuXG4gIGdldCBtc2coKSB7IHJldHVybiB0aGlzLl9tc2c7IH1cbiAgc2V0IG1zZyhpbk1zZykgeyB0aGlzLl9tc2cgPSBpbk1zZzsgfVxuXG4gIG5leHQoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghX3RoaXMuX2luU3RvcCkge1xuICAgICAgaWYgKF90aGlzLl9pdGVyLmhhc05leHQpIHtcbiAgICAgICAgX3RoaXMuX2l0ZXIubmV4dChfdGhpcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy5fb25EZWxpdmVyKF90aGlzLl9tc2cpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRlbGl2ZXIoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBpZiAoIV90aGlzLl9pblN0b3ApIHtcbiAgICAgIF90aGlzLl9pblN0b3AgPSB0cnVlO1xuICAgICAgX3RoaXMuX29uRGVsaXZlcihfdGhpcy5fbXNnKTtcbiAgICB9XG4gIH1cblxuICBmYWlsKGVycm9yKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghX3RoaXMuX2luU3RvcCkge1xuICAgICAgX3RoaXMuX2luU3RvcCA9IHRydWU7XG4gICAgICBpZiAoX3RoaXMuX3BpcGVsaW5lLm9uRmFpbCkge1xuICAgICAgICBfdGhpcy5fcGlwZWxpbmUub25GYWlsKGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgSXRlcmF0b3Ige1xuICAvKiBwcml2YXRlXG4gICAgX2luZGV4OiBudW1iZXJcbiAgICBfYXJyYXk6IFtdXG4gICovXG5cbiAgY29uc3RydWN0b3IoYXJyYXkpIHtcbiAgICB0aGlzLl9pbmRleCA9IC0xO1xuICAgIHRoaXMuX2FycmF5ID0gYXJyYXk7XG4gIH1cblxuICBnZXQgaGFzTmV4dCgpIHtcbiAgICByZXR1cm4gdGhpcy5faW5kZXggPCB0aGlzLl9hcnJheS5sZW5ndGggLSAxO1xuICB9XG5cbiAgZ2V0IG5leHQoKSB7XG4gICAgdGhpcy5faW5kZXgrKztcbiAgICByZXR1cm4gdGhpcy5fYXJyYXlbdGhpcy5faW5kZXhdO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBpcGVsaW5lO1xuIiwiaW1wb3J0IGhlbGxvIGZyb20gJ2hlbGxvanMnO1xuXG4vKipcbiogSWRlbnRpdHlNb2R1bGVcbipcbiogSW5pdGlhbCBzcGVjaWZpY2F0aW9uOiBENC4xXG4qXG4qIFRoZSBJZGVudGl0eU1vZHVsZSBpcyBhIGNvbXBvbmVudCBtYW5hZ2luZyB1c2VyIElkZW50aXR5LiBJdCBkb3dubG9hZHMsIGluc3RhbnRpYXRlc1xuKiBhbmQgbWFuYWdlIElkZW50aXR5IFByb3ZpZGVyIFByb3h5IChJZFApIGZvciBpdHMgb3duIHVzZXIgaWRlbnRpdHkgb3IgZm9yIGV4dGVybmFsXG4qIHVzZXIgaWRlbnRpdHkgdmVyaWZpY2F0aW9uLlxuKlxuKi9cbmNsYXNzIElkZW50aXR5TW9kdWxlIHtcblxuICAvKipcbiAgKiBVU0VSJ1MgT1dOIElERU5USVRZXG4gICovXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgLy90byBzdG9yZSBpdGVtcyB3aXRoIHRoaXMgZm9ybWF0OiB7aWRlbnRpdHk6IGlkZW50aXR5VVJMLCB0b2tlbjogdG9rZW5JRH1cbiAgICBfdGhpcy5pZGVudGl0aWVzID0gW107XG4gIH1cblxuICAvKipcbiAgKiBSZWdpc3RlciBhIG5ldyBJZGVudGl0eSB3aXRoIGFuIElkZW50aXR5IFByb3ZpZGVyXG4gICovXG4gIHJlZ2lzdGVySWRlbnRpdHkoKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogSW4gcmVsYXRpb24gd2l0aCBhIGNsYXNzaWNhbCBSZWx5aW5nIFBhcnR5OiBSZWdpc3RyYXRpb25cbiAgKi9cbiAgcmVnaXN0ZXJXaXRoUlAoKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogRmluZCBhbmQgcmV0dXJuIGFsbCBhdmFpbGFibGUgaWRlbnRpdGllcyB0aGF0IGNhbiBiZSBhc3NvY2lhdGVkIHRvIHRoZSBIeXBlcnR5IEluc3RhbmNlXG4gICogQHJldHVybiB7QXJyYXk8SWRlbnRpdGllcz59ICAgICAgICAgQXJyYXkgICAgICAgICBJZGVudGl0aWVzXG4gICovXG4gIGdldElkZW50aXRpZXMoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMuaWRlbnRpdGllcztcbiAgfVxuXG4gIC8qKlxuICAqIEluIHJlbGF0aW9uIHdpdGggYSBjbGFzc2ljYWwgUmVseWluZyBQYXJ0eTogTG9naW5cbiAgKiBAcGFyYW0gIHtJZGVudGlmaWVyfSAgICAgIGlkZW50aWZpZXIgICAgICBpZGVudGlmaWVyXG4gICogQHBhcmFtICB7U2NvcGV9ICAgICAgICAgICBzY29wZSAgICAgICAgICAgc2NvcGVcbiAgKiBAcmV0dXJuIHtQcm9taXNlfSAgICAgICAgIFByb21pc2UgICAgICAgICBJRFRva2VuXG4gICovXG4gIGxvZ2luV2l0aFJQKGlkZW50aWZpZXIsIHNjb3BlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8qXG4gICAgICBXaGVuIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiwgaWYgZXZlcnl0aGluZyBpcyBmaW5lLCBhIHNtYWxsIHBvcC11cCB3aWxsIG9wZW4gcmVxdWVzdGluZyBhIGxvZ2luIHdpdGggYSBnb29nbGUgYWNjb3VudC4gQWZ0ZXIgdGhlIGxvZ2luIGlzIG1hZGUsIHRoZSBwb3AtdXAgd2lsbCBjbG9zZSBhbmQgdGhlIGZ1bmN0aW9uIHdpbGwgcmV0dXJuIHRoZSBJRCB0b2tlbi5cbiAgICAgIFRoaXMgZnVuY3Rpb24gd2FzIHRlc3RlZCB3aXRoIHRoZSBVUkw6IGh0dHA6Ly8xMjcuMC4wLjE6ODA4MC8gYW5kIHdpdGggdGhlIHNhbWUgcmVkaXJlY3QgVVJJXG5cbiAgICBcdEluIGNhc2UgdGhlIHJlZGlyZWN0IFVSSSBpcyBub3QgYWNjZXB0ZWQgb3IgaXMgcmVxdWlyZWQgdG8gYWRkIG90aGVycyByZWRpcmVjdCBVUklzLCBhIGxpdHRsZSBpbmZvcm1hdGlvbiBpcyBwcm92aWRlZCB0byBmaXggdGhlIHByb2JsZW06XG5cbiAgICBcdFNvIHRoYXQgYW4gYXBwbGljYXRpb24gY2FuIHVzZSBHb29nbGUncyBPQXV0aCAyLjAgYXV0aGVudGljYXRpb24gc3lzdGVtIGZvciB1c2VyIGxvZ2luLFxuICAgIFx0Zmlyc3QgaXMgcmVxdWlyZWQgdG8gc2V0IHVwIGEgcHJvamVjdCBpbiB0aGUgR29vZ2xlIERldmVsb3BlcnMgQ29uc29sZSB0byBvYnRhaW4gT0F1dGggMi4wIGNyZWRlbnRpYWxzIGFuZCBzZXQgYSByZWRpcmVjdCBVUkkuXG4gICAgXHRBIHRlc3QgYWNjb3VudCB3YXMgY3JlYXRlZCB0byBzZXQgdGhlIHByb2plY3QgaW4gdGhlIEdvb2dsZSBEZXZlbG9wZXJzIENvbnNvbGUgdG8gb2J0YWluIE9BdXRoIDIuMCBjcmVkZW50aWFscyxcdHdpdGggdGhlIGZvbGxvd2luZyBjcmVkZW50aWFsczpcblx0ICAgICAgICBcdHVzZXJuYW1lOiBvcGVuaWR0ZXN0MTBAZ21haWwuY29tXG5cdCAgICAgICAgICBwYXNzd29yZDogdGVzdE9wZW5JRDEwXG5cbiAgICBcdFRvIGFkZCBtb3JlIFVSSSdzLCBmb2xsb3cgdGhlIHN0ZXBzOlxuICAgIFx0McK6IGNob29zZSB0aGUgcHJvamVjdCAoIGNhbiBiZSB0aGUgTXkgT3BlbklEIFByb2plY3QpXHQgZnJvbSAgaHR0cHM6Ly9jb25zb2xlLmRldmVsb3BlcnMuZ29vZ2xlLmNvbS9wcm9qZWN0c2VsZWN0b3IvYXBpcy9jcmVkZW50aWFscyB1c2luZyB0aGUgY3JlZGVudGlhbHMgcHJvdmlkZWQgYWJvdmUuXG4gICAgXHQywrogT3BlbiBUaGUgQ2xpZW50IFdlYiAxIGxpc3RlZCBpbiBPQXV0aCAyLjAgQ2xpZW50IElEJ3NcbiAgICBcdDPCuiBBZGQgdGhlIFVSSSAgaW4gdGhlIGF1dGhvcml6ZWQgcmVkaXJlY3QgVVJJIHNlY3Rpb24uXG4gICAgICA0wrogY2hhbmdlIHRoZSBSRURJUkVDVCBwYXJhbWV0ZXIgYmVsbG93IHdpdGggdGhlIHByZXRlbmRlZCBVUklcblxuICAgICAgaWRlbnRpdHlNb2R1bGUuX2hlbGxvLmluaXQoe2dvb2dsZTogXCI4MDgzMjk1NjYwMTItdHFyOHFvaDExMTk0MmdkMmtnMDA3dDBzOGYyNzdyb2kuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb21cIn0pO1xuICAgICAgaWRlbnRpdHlNb2R1bGUuX2hlbGxvKFwiZ29vZ2xlXCIpLmxvZ2luKCk7XG5cbiAgICAqL1xuXG4gICAgbGV0IFZBTElEVVJMICAgPSAgICdodHRwczovL3d3dy5nb29nbGVhcGlzLmNvbS9vYXV0aDIvdjEvdG9rZW5pbmZvP2FjY2Vzc190b2tlbj0nO1xuICAgIGxldCBVU0VSSU5GVVJMID0gICAnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YxL3VzZXJpbmZvP2FjY2Vzc190b2tlbj0nO1xuICAgIGxldCBhY1Rva2VuO1xuICAgIGxldCB0b2tlblR5cGU7XG4gICAgbGV0IGV4cGlyZXNJbjtcbiAgICBsZXQgdXNlcjtcbiAgICBsZXQgdG9rZW5JRDtcbiAgICBsZXQgbG9nZ2VkSW4gPSBmYWxzZTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgaWYgKF90aGlzLnRva2VuICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy9UT0RPIHZlcmlmeSB3aGV0aGVyIHRoZSB0b2tlbiBpcyBzdGlsbCB2YWxpZCBvciBub3QuXG4gICAgICAgIHJldHVybiByZXNvbHZlKF90aGlzLnRva2VuKTtcbiAgICAgIH1cblxuICAgICAgLy9mdW5jdGlvbiB0byB2YWxpZGF0ZSB0aGUgYWNjZXNzIHRva2VuIHJlY2VpdmVkIGR1cmluZyB0aGUgYXV0aGVudGljYXRpb25cbiAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlVG9rZW4odG9rZW4pIHtcbiAgICAgICAgbGV0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICByZXEub3BlbignR0VUJywgVkFMSURVUkwgKyB0b2tlbiwgdHJ1ZSk7XG5cbiAgICAgICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBpZiAocmVxLnJlYWR5U3RhdGUgPT0gNCkge1xuICAgICAgICAgICAgaWYgKHJlcS5zdGF0dXMgPT0gMjAwKSB7XG5cbiAgICAgICAgICAgICAgZ2V0SURUb2tlbih0b2tlbik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcS5zdGF0dXMgPT0gNDAwKSB7XG4gICAgICAgICAgICAgIHJlamVjdCgnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHRva2VuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVxLnNlbmQoKTtcblxuICAgICAgfVxuXG4gICAgICAvL2Z1bmN0aW9uIHRvIGV4Y2hhbmdlIHRoZSBhY2Nlc3MgdG9rZW4gd2l0aCBhbiBJRCBUb2tlbiBjb250YWluaW5nIHRoZSBpbmZvcm1hdGlvblxuICAgICAgZnVuY3Rpb24gZ2V0SURUb2tlbih0b2tlbikge1xuICAgICAgICBsZXQgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgIHJlcS5vcGVuKCdHRVQnLCBVU0VSSU5GVVJMICsgdG9rZW4sIHRydWUpO1xuXG4gICAgICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgaWYgKHJlcS5yZWFkeVN0YXRlID09IDQpIHtcbiAgICAgICAgICAgIGlmIChyZXEuc3RhdHVzID09IDIwMCkge1xuICAgICAgICAgICAgICB0b2tlbklEID0gSlNPTi5wYXJzZShyZXEucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICAgICAgX3RoaXMudG9rZW4gPSB0b2tlbklEO1xuICAgICAgICAgICAgICBsZXQgZW1haWwgPSB0b2tlbklELmVtYWlsO1xuXG4gICAgICAgICAgICAgIC8vY29udHJ1Y3QgdGhlIGlkZW50aXR5VVJMIHRvIGJlIGRlZmluZWQgYXMgaW4gc3BlY2lmaWNhdGlvblxuICAgICAgICAgICAgICAvLyBtb2RlbDogdXNlcjovLzxpZHBkb21haW4+Lzx1c2VyLWlkZW50aWZpZXI+XG4gICAgICAgICAgICAgIGxldCBpZGVudGl0eVVSTCA9ICd1c2VyOi8vJyArIGVtYWlsLnN1YnN0cmluZyhlbWFpbC5pbmRleE9mKCdAJykgKyAxLCBlbWFpbC5sZW5ndGgpICsgJy8nICsgZW1haWwuc3Vic3RyaW5nKDAsIGVtYWlsLmluZGV4T2YoJ0AnKSk7XG5cbiAgICAgICAgICAgICAgbGV0IGlkZW50aXR5QnVuZGxlID0ge2lkZW50aXR5OiBpZGVudGl0eVVSTCwgdG9rZW46IHRva2VuSUR9O1xuXG4gICAgICAgICAgICAgIF90aGlzLmlkZW50aXRpZXMucHVzaChpZGVudGl0eUJ1bmRsZSk7XG4gICAgICAgICAgICAgIHJlc29sdmUodG9rZW5JRCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHJlcS5zdGF0dXMgPT0gNDAwKSB7XG4gICAgICAgICAgICAgIHJlamVjdCgnVGhlcmUgd2FzIGFuIGVycm9yIHByb2Nlc3NpbmcgdGhlIHRva2VuJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWplY3QoJ3NvbWV0aGluZyBlbHNlIG90aGVyIHRoYW4gMjAwIHdhcyByZXR1cm5lZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgcmVxLnNlbmQoKTtcbiAgICAgIH1cblxuICAgICAgaGVsbG8uaW5pdCh7Z29vZ2xlOiAnODA4MzI5NTY2MDEyLXRxcjhxb2gxMTE5NDJnZDJrZzAwN3QwczhmMjc3cm9pLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ30pO1xuICAgICAgaGVsbG8oJ2dvb2dsZScpLmxvZ2luKHtzY29wZTogJ2VtYWlsJ30pLnRoZW4oZnVuY3Rpb24odG9rZW4pIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygndmFsaWRhdGVkOiAnLHRva2VuLmF1dGhSZXNwb25zZS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgICB2YWxpZGF0ZVRva2VuKHRva2VuLmF1dGhSZXNwb25zZS5hY2Nlc3NfdG9rZW4pO1xuICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yVmFsaWRhdGluZyAnLCBlcnJvcik7XG4gICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICogSW4gcmVsYXRpb24gd2l0aCBhIEh5cGVydHkgSW5zdGFuY2U6IEFzc29jaWF0ZSBpZGVudGl0eVxuICAqL1xuICBzZXRIeXBlcnR5SWRlbnRpdHkoKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogR2VuZXJhdGVzIGFuIElkZW50aXR5IEFzc2VydGlvbiBmb3IgYSBjYWxsIHNlc3Npb25cbiAgKiBAcGFyYW0gIHtET01TdHJpbmd9IGNvbnRlbnRzICAgICBjb250ZW50c1xuICAqIEBwYXJhbSAge0RPTVN0cmluZ30gb3JpZ2luICAgICAgIG9yaWdpblxuICAqIEBwYXJhbSAge0RPTVN0cmluZ30gdXNlcm5hbWVIaW50IHVzZXJuYW1lSGludFxuICAqIEByZXR1cm4ge0lkQXNzZXJ0aW9ufSAgICAgICAgICAgICAgSWRBc3NlcnRpb25cbiAgKi9cbiAgZ2VuZXJhdGVBc3NlcnRpb24oY29udGVudHMsIG9yaWdpbiwgdXNlcm5hbWVIaW50KSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogT1RIRVIgVVNFUidTIElERU5USVRZXG4gICovXG5cbiAgLyoqXG4gICogVmVyaWZpY2F0aW9uIG9mIGEgcmVjZWl2ZWQgSWRBc3NlcnRpb24gdmFsaWRpdHlcbiAgKiBAcGFyYW0gIHtET01TdHJpbmd9IGFzc2VydGlvbiBhc3NlcnRpb25cbiAgKi9cbiAgdmFsaWRhdGVBc3NlcnRpb24oYXNzZXJ0aW9uKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogVHJ1c3QgbGV2ZWwgZXZhbHVhdGlvbiBvZiBhIHJlY2VpdmVkIElkQXNzZXJ0aW9uXG4gICogQHBhcmFtICB7RE9NU3RyaW5nfSBhc3NlcnRpb24gYXNzZXJ0aW9uXG4gICovXG4gIGdldEFzc2VydGlvblRydXN0TGV2ZWwoYXNzZXJ0aW9uKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSWRlbnRpdHlNb2R1bGU7XG4iLCIvKipcbiAqIENvcmUgUG9saWN5IEVuZ2luZSAoUERQL1BFUCkgSW50ZXJmYWNlXG4gKiBBY2NvcmRpbmcgdG86IGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL3J1bnRpbWUtYXBpcy5tZCNjb3JlLXBvbGljeS1lbmdpbmUtcGRwcGVwLWludGVyZmFjZVxuICovXG5jbGFzcyBQb2xpY3lFbmdpbmUge1xuXG4gIC8qKlxuICAqIFRvIGluaXRpYWxpc2UgdGhlIFBvbGljeSBFbmdpbmVcbiAgKiBAcGFyYW0gIHtJZGVudGl0eSBNb2R1bGV9ICAgICAgaWRlbnRpdHlNb2R1bGUgICAgICBpZGVudGl0eU1vZHVsZVxuICAqIEBwYXJhbSAge1J1bnRpbWUgUmVnaXN0cnl9ICAgIHJ1bnRpbWVSZWdpc3RyeSAgICAgcnVudGltZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKGlkZW50aXR5TW9kdWxlLCBydW50aW1lUmVnaXN0cnkpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLmlkTW9kdWxlID0gaWRlbnRpdHlNb2R1bGU7XG4gICAgX3RoaXMucmVnaXN0cnkgPSBydW50aW1lUmVnaXN0cnk7XG4gICAgX3RoaXMucG9saWNpZXNUYWJsZSA9IG5ldyBPYmplY3QoKTtcbiAgICAvKiBhc3N1bWVzIHRoZSBQb2xpY3kgRW5naW5lIGhhcyB0aGUgYmxhY2tsaXN0ICovXG4gICAgX3RoaXMuYmxhY2tsaXN0ID0gW107XG4gICAgLyogX3RoaXMuYmxhY2tsaXN0LnB1c2goJ0FsaWNlJyk7Ki9cbiAgfVxuXG4gIC8qKlxuICAgKiBUbyBhZGQgcG9saWNpZXMgdG8gYmUgZW5mb3JjZWQgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEV4YW1wbGUgb2YgYW4gaHlwZXJ0eTogaHlwZXJ0eS1pbnN0YW5jZTovL3RlY25pY28ucHQvZTFiOGZiMGItOTVlMi00ZjQ0LWFhMTgtYjQwOTg0NzQxMTk2XG4gICAqIEV4YW1wbGUgb2YgYSBwb2xpY3k6IHtzdWJqZWN0OiAnbWVzc2FnZS5oZWFkZXIuZnJvbScsIHRhcmdldDogJ2JsYWNrbGlzdCcsIGFjdGlvbjogJ2RlbnknfVxuICAgKiBAcGFyYW0ge1VSTC5IeXBlcnR5VVJMfSAgICAgaHlwZXJ0eSAgaHlwZXJ0eVxuICAgKiBAcGFyYW0ge0h5cGVydHlQb2xpY3lMaXN0fSAgcG9saWNpZXMgcG9saWNpZXNcbiAgICovXG4gIGFkZFBvbGljaWVzKGh5cGVydHksIHBvbGljaWVzKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpcy5wb2xpY2llc1RhYmxlW2h5cGVydHldID0gcG9saWNpZXM7XG4gIH1cblxuICAvKipcbiAgICogVG8gcmVtb3ZlIHByZXZpb3VzbHkgYWRkZWQgcG9saWNpZXMgZm9yIGEgY2VydGFpbiBkZXBsb3llZCBIeXBlcnR5IEluc3RhbmNlXG4gICAqIEBwYXJhbSAge1VSTC5IeXBlcnR5VVJMfSAgaHlwZXJ0eSAgICAgICBoeXBlcnR5XG4gICAqL1xuICByZW1vdmVQb2xpY2llcyhoeXBlcnR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBkZWxldGUgX3RoaXMucG9saWNpZXNUYWJsZVtoeXBlcnR5XTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBdXRob3Jpc2F0aW9uIHJlcXVlc3QgdG8gYWNjZXB0IGEgU3Vic2NyaXB0aW9uIGZvciBhIGNlcnRhaW4gcmVzb3VyY2UuIFJldHVybnMgYSBSZXNwb25zZSBNZXNzYWdlIHRvIGJlIHJldHVybmVkIHRvIFN1YnNjcmlwdGlvbiByZXF1ZXN0ZXJcbiAgICogQHBhcmFtICB7TWVzc2FnZS5NZXNzYWdlfSBtZXNzYWdlICAgICAgIG1lc3NhZ2VcbiAgICogQHJldHVybiB7QXV0aG9yaXNhdGlvblJlc3BvbnNlfSAgICAgICAgICAgICAgICAgQXV0aG9yaXNhdGlvblJlc3BvbnNlXG4gICAqL1xuICBhdXRob3Jpc2UobWVzc2FnZSkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgY29uc29sZS5sb2coX3RoaXMucG9saWNpZXNUYWJsZSk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgaWYgKF90aGlzLmNoZWNrUG9saWNpZXMobWVzc2FnZSkgPT0gJ2FsbG93Jykge1xuICAgICAgICAvKmxldCBoeXBlcnR5SWRlbnRpdHkgPSBfdGhpcy5yZWdpc3RyeS5nZXRIeXBlcnR5SWRlbnRpdHkobWVzc2FnZS5ib2R5Lmh5cGVydHlVUkwpO1xuICAgICAgICAvL3RoaXMgc3RlcCBhc3N1bWUgdGhlIGh5cGVydHlJZGVudGl0eSB3aWxsIGJlIGdvb2dsZSAqL1xuICAgICAgICBfdGhpcy5pZE1vZHVsZS5sb2dpbldpdGhSUCgnZ29vZ2xlIGlkZW50aXR5JywgJ3Njb3BlJykudGhlbihmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgIGxldCBhc3NlcnRlZElEID0gX3RoaXMuaWRNb2R1bGUuZ2V0SWRlbnRpdGllcygpO1xuICAgICAgICAgIG1lc3NhZ2UuYm9keS5hc3NlcnRlZElkZW50aXR5ID0gYXNzZXJ0ZWRJRFswXS5pZGVudGl0eTtcbiAgICAgICAgICBtZXNzYWdlLmJvZHkuaWRUb2tlbiA9IEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgICAgICAgICBtZXNzYWdlLmJvZHkuYXV0aG9yaXNlZCA9IHRydWU7XG4gICAgICAgICAgcmVzb2x2ZShtZXNzYWdlKTtcbiAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY2hlY2tQb2xpY2llcyhtZXNzYWdlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgX3Jlc3VsdHMgPSBbJ2FsbG93J107IC8qIGJ5IGRlZmF1bHQsIGFsbCBtZXNzYWdlcyBhcmUgYWxsb3dlZCAqL1xuICAgIHZhciBfcG9saWNpZXMgPSBfdGhpcy5wb2xpY2llc1RhYmxlW21lc3NhZ2UuYm9keS5oeXBlcnR5VVJMXTtcbiAgICBpZiAoX3BvbGljaWVzICE9IHVuZGVmaW5lZCkgeyAvKiBpZiB0aGVyZSBhcmUgYXBwbGljYWJsZSBwb2xpY2llcywgY2hlY2tzIHRoZW0gKi9cbiAgICAgIHZhciBfbnVtUG9saWNpZXMgPSBfcG9saWNpZXMubGVuZ3RoO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9udW1Qb2xpY2llczsgaSsrKSB7XG4gICAgICAgIHZhciBfcG9saWN5ID0gX3BvbGljaWVzW2ldO1xuICAgICAgICBjb25zb2xlLmxvZyhfcG9saWN5KTtcbiAgICAgICAgaWYgKF9wb2xpY3kudGFyZ2V0ID09ICdibGFja2xpc3QnKSB7XG4gICAgICAgICAgaWYgKF90aGlzLmJsYWNrbGlzdC5pbmRleE9mKGV2YWwoX3BvbGljeS5zdWJqZWN0KSkgPiAtMSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0lzIGluIGJsYWNrbGlzdCEnKTtcbiAgICAgICAgICAgIF9yZXN1bHRzLnB1c2goX3BvbGljeS5hY3Rpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoX3BvbGljeS50YXJnZXQgPT0gJ3doaXRlbGlzdCcpIHtcbiAgICAgICAgICBpZiAoX3RoaXMud2hpdGVsaXN0LmluZGV4T2YoZXZhbChfcG9saWN5LnN1YmplY3QpKSA+IC0xKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnSXMgaW4gd2hpdGVsaXN0IScpO1xuICAgICAgICAgICAgX3Jlc3VsdHMucHVzaChfcG9saWN5LmFjdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnNvbGUubG9nKF9yZXN1bHRzKTtcbiAgICBpZiAoX3Jlc3VsdHMuaW5kZXhPZignZGVueScpID4gLTEpIHsgLyogaWYgb25lIHBvbGljeSBldmFsdWF0ZXMgdG8gJ2RlbnknLCB0aGUgcmVzdWx0IGlzICdkZW55JyAqL1xuICAgICAgcmV0dXJuICdkZW55JztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICdhbGxvdyc7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBvbGljeUVuZ2luZTtcbiIsIi8vIGltcG9ydCBNZXNzYWdlRmFjdG9yeSBmcm9tICcuLi8uLi9yZXNvdXJjZXMvTWVzc2FnZUZhY3RvcnknO1xuXG4vKipcbiAqIENsYXNzIHdpbGwgYXNrIHRvIHRoZSBtZXNzYWdlIG5vZGUgZm9yIGFkZHJlc3Nlc1xuICovXG5jbGFzcyBBZGRyZXNzQWxsb2NhdGlvbiB7XG4gIC8qIHByaXZhdGVcbiAgX3VybDogVVJMXG4gIF9idXM6IE1pbmlCdXNcbiAgKi9cblxuICAvKipcbiAgICogQ3JlYXRlIGFuIEFkZHJlc3MgQWxsb2NhdGlvblxuICAgKiBAcGFyYW0gIHtVUkwuVVJMfSAgICAgIHVybCAtIHVybCBmcm9tIHdobyBpcyBzZW5kaW5nIHRoZSBtZXNzYWdlXG4gICAqIEBwYXJhbSAge01pbmlCdXN9ICAgICAgYnVzIC0gTWluaUJ1cyB1c2VkIGZvciBhZGRyZXNzIGFsbG9jYXRpb25cbiAgICovXG4gIGNvbnN0cnVjdG9yKHVybCwgYnVzKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IG5ldyBNZXNzYWdlRmFjdG9yeSgpO1xuICAgIC8vXG4gICAgLy8gX3RoaXMuX21lc3NhZ2VGYWN0b3J5ID0gbWVzc2FnZUZhY3Rvcnk7XG4gICAgX3RoaXMuX3VybCA9IHVybDtcbiAgICBfdGhpcy5fYnVzID0gYnVzO1xuICB9XG5cbiAgLyoqXG4gICAqIGdldCB0aGUgVVJMIHZhbHVlXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVGhlIHVybCB2YWx1ZTtcbiAgICovXG4gIGdldCB1cmwoKSB7IHJldHVybiB0aGlzLl91cmw7IH1cblxuICAvKipcbiAgICogQXNrIGZvciBjcmVhdGlvbiBvZiBhIG51bWJlciBvZiBIeXBlcnR5IGFkZHJlc3NlcywgdG8gdGhlIGRvbWFpbiBtZXNzYWdlIG5vZGUuXG4gICAqIEBwYXJhbSAge0RvbWFpbn0gZG9tYWluIC0gRG9tYWluIG9mIHRoZSBtZXNzYWdlIG5vZGUuXG4gICAqIEBwYXJhbSAge251bWJlcn0gbnVtYmVyIC0gTnVtYmVyIG9mIGFkZHJlc3NlcyB0byByZXF1ZXN0XG4gICAqIEByZXR1cm5zIHtQcm9taXNlPEh5cGVydHlVUkw+fSAgQSBsaXN0IG9mIEh5cGVydHlVUkwnc1xuICAgKi9cbiAgY3JlYXRlKGRvbWFpbiwgbnVtYmVyKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vIGxldCBtZXNzYWdlRmFjdG9yeSA9IF90aGlzLl9tZXNzYWdlRmFjdG9yeTtcblxuICAgIGxldCBtc2cgPSB7XG4gICAgICB0eXBlOiAnY3JlYXRlJywgZnJvbTogX3RoaXMuX3VybCwgdG86ICdkb21haW46Ly9tc2ctbm9kZS4nICsgZG9tYWluICsgJy9oeXBlcnR5LWFkZHJlc3MtYWxsb2NhdGlvbicsXG4gICAgICBib2R5OiB7bnVtYmVyOiBudW1iZXJ9XG4gICAgfTtcblxuICAgIC8vIFRPRE86IEFwcGx5IHRoZSBtZXNzYWdlIGZhY3RvcnlcbiAgICAvLyBUaGUgbXNnLW5vZGUtdmVydHggc2hvdWxkIGJlIGNoYW5nZWQgdGhlIGJvZHkgZmllbGQgdG8gcmVjZWl2ZVxuICAgIC8vIHRoZSBmb2xsb3dpbmcgZm9ybWF0IGJvZHk6IHt2YWx1ZToge251bWJlcjogbnVtYmVyfX0gYmVjYXVzZVxuICAgIC8vIHRoZSBtZXNzYWdlIGlzIGdlbmVyYXRlZCBpbiB0aGF0IHdheSBieSB0aGUgbWVzc2FnZSBmYWN0b3J5O1xuICAgIC8vIGxldCBtc2cgPSBtZXNzYWdlRmFjdG9yeS5jcmVhdGVNZXNzYWdlUmVxdWVzdChfdGhpcy5fdXJsLCAnZG9tYWluOi8vbXNnLW5vZGUuJyArIGRvbWFpbiArICcvaHlwZXJ0eS1hZGRyZXNzLWFsbG9jYXRpb24nLCAnJywge251bWJlcjogbnVtYmVyfSk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAvLyBUT0RPOiBjaGFuZ2UgdGhpcyByZXNwb25zZSBNZXNzYWdlIHVzaW5nIHRoZSBNZXNzYWdlRmFjdG9yeVxuICAgICAgX3RoaXMuX2J1cy5wb3N0TWVzc2FnZShtc2csIChyZXBseSkgPT4ge1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICByZXNvbHZlKHJlcGx5LmJvZHkuYWxsb2NhdGVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZWplY3QocmVwbHkuYm9keS5kZXNjKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQWRkcmVzc0FsbG9jYXRpb247XG4iLCJpbXBvcnQgUmVnaXN0cnlEYXRhTW9kZWwgZnJvbSAnLi9SZWdpc3RyeURhdGFNb2RlbCc7XG5cbi8qKlxuKiAgIEBhdXRob3I6IEdpbCBEaWFzIChnaWwuZGlhc0B0ZWNuaWNvLnVsaXNib2EucHQpXG4qICAgSHlwZXJ0eUluc3RhbmNlIERhdGEgTW9kZWwgdXNlZCB0byBtb2RlbCBpbnN0YW5jZXMgb2YgSHlwZXJ0aWVzIHJ1bm5pbmcgaW4gZGV2aWNlcyBhbmQgc2VydmVycy5cbiovXG5jbGFzcyBIeXBlcnR5SW5zdGFuY2UgZXh0ZW5kcyBSZWdpc3RyeURhdGFNb2RlbCB7XG5cbiAgY29uc3RydWN0b3IoaWQsIHVybCwgZGVzY3JpcHRvciwgaHlwZXJ0eVVSTCwgdXNlciwgZ3VpZCwgcnVudGltZSwgY29udGV4dCkge1xuICAgIHN1cGVyKGlkLCB1cmwsIGRlc2NyaXB0b3IpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMuX2h5cGVydHlVUkwgPSBoeXBlcnR5VVJMO1xuICAgIF90aGlzLl91c2VyID0gdXNlcjtcbiAgICBfdGhpcy5fZ3VpZCA9IGd1aWQ7XG4gICAgX3RoaXMuX3J1bnRpbWUgPSBydW50aW1lO1xuICAgIF90aGlzLl9jb250ZXh0ID0gY29udGV4dDtcbiAgfVxuXG4gIHNldCB1c2VyKGlkZW50aXR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpcy51c2VyID0gaWRlbnRpdHk7XG4gIH1cblxuICBnZXQgdXNlcigpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBfdGhpcy5fdXNlcjtcbiAgfVxuXG4gIGdldCBoeXBlcnR5VVJMKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLl9oeXBlcnR5VVJMO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IEh5cGVydHlJbnN0YW5jZTtcbiIsImltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSAnLi4vdXRpbHMvRXZlbnRFbWl0dGVyJztcbmltcG9ydCBBZGRyZXNzQWxsb2NhdGlvbiBmcm9tICcuL0FkZHJlc3NBbGxvY2F0aW9uJztcbmltcG9ydCBIeXBlcnR5SW5zdGFuY2UgZnJvbSAnLi9IeXBlcnR5SW5zdGFuY2UnO1xuXG5pbXBvcnQge2RpdmlkZVVSTH0gZnJvbSAnLi4vdXRpbHMvdXRpbHMuanMnO1xuXG4vKipcbiogUnVudGltZSBSZWdpc3RyeSBJbnRlcmZhY2VcbiovXG5jbGFzcyBSZWdpc3RyeSBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG5cbiAgLyoqXG4gICogVG8gaW5pdGlhbGlzZSB0aGUgUnVudGltZSBSZWdpc3RyeSB3aXRoIHRoZSBSdW50aW1lVVJMIHRoYXQgd2lsbCBiZSB0aGUgYmFzaXMgdG8gZGVyaXZlIHRoZSBpbnRlcm5hbCBydW50aW1lIGFkZHJlc3NlcyB3aGVuIGFsbG9jYXRpbmcgYWRkcmVzc2VzIHRvIGludGVybmFsIHJ1bnRpbWUgY29tcG9uZW50LiBJbiBhZGRpdGlvbiwgdGhlIFJlZ2lzdHJ5IGRvbWFpbiBiYWNrLWVuZCB0byBiZSB1c2VkIHRvIHJlbW90ZWx5IHJlZ2lzdGVyIFJ1bnRpbWUgY29tcG9uZW50cywgaXMgYWxzbyBwYXNzZWQgYXMgaW5wdXQgcGFyYW1ldGVyLlxuICAqIEBwYXJhbSAge01lc3NhZ2VCdXN9ICAgICAgICAgIG1zZ2J1cyAgICAgICAgICAgICAgICBtc2didXNcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBydW50aW1lVVJMICAgICAgICAgICAgcnVudGltZVVSTFxuICAqIEBwYXJhbSAge0FwcFNhbmRib3h9ICAgICAgICAgIGFwcFNhbmRib3ggICAgICAgICAgICBhcHBTYW5kYm94XG4gICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgICAgICAgcmVtb3RlUmVnaXN0cnkgICAgICAgIHJlbW90ZVJlZ2lzdHJ5XG4gICovXG4gIGNvbnN0cnVjdG9yKHJ1bnRpbWVVUkwsIGFwcFNhbmRib3gsIGlkZW50aXR5TW9kdWxlLCByZW1vdGVSZWdpc3RyeSkge1xuXG4gICAgc3VwZXIoKTtcblxuICAgIC8vIGhvdyBzb21lIGZ1bmN0aW9ucyByZWNlaXZlIHRoZSBwYXJhbWV0ZXJzIGZvciBleGFtcGxlOlxuICAgIC8vIG5ldyBSZWdpc3RyeSgnaHlwZXJ0eS1ydW50aW1lOi8vc3AxLzEyMycsIGFwcFNhbmRib3gsIGlkTW9kdWxlLCByZW1vdGVSZWdpc3RyeSk7XG4gICAgLy8gcmVnaXN0cnkucmVnaXN0ZXJTdHViKHNhbmRib3gsICdzcDEnKTtcbiAgICAvLyByZWdpc3RyeS5yZWdpc3Rlckh5cGVydHkoc2FuZEJveCwgJ2h5cGVydHktcnVudGltZTovL3NwMS8xMjMnKTtcbiAgICAvLyByZWdpc3RyeS5yZXNvbHZlKCdoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvMTIzJyk7XG5cbiAgICBpZiAoIXJ1bnRpbWVVUkwpIHRocm93IG5ldyBFcnJvcigncnVudGltZVVSTCBpcyBtaXNzaW5nLicpO1xuICAgIC8qaWYgKCFyZW1vdGVSZWdpc3RyeSkgdGhyb3cgbmV3IEVycm9yKCdyZW1vdGVSZWdpc3RyeSBpcyBtaXNzaW5nJyk7Ki9cblxuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5yZWdpc3RyeVVSTCA9IHJ1bnRpbWVVUkwgKyAnL3JlZ2lzdHJ5LzEyMyc7XG4gICAgX3RoaXMuYXBwU2FuZGJveCA9IGFwcFNhbmRib3g7XG4gICAgX3RoaXMucnVudGltZVVSTCA9IHJ1bnRpbWVVUkw7XG4gICAgX3RoaXMucmVtb3RlUmVnaXN0cnkgPSByZW1vdGVSZWdpc3RyeTtcbiAgICBfdGhpcy5pZE1vZHVsZSA9IGlkZW50aXR5TW9kdWxlO1xuICAgIF90aGlzLmlkZW50aWZpZXIgPSBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMSk7XG5cbiAgICBfdGhpcy5oeXBlcnRpZXNMaXN0VG9SZW1vdmUgPSB7fTtcbiAgICBfdGhpcy5oeXBlcnRpZXNMaXN0ID0gW107XG4gICAgX3RoaXMucHJvdG9zdHVic0xpc3QgPSB7fTtcbiAgICBfdGhpcy5zYW5kYm94ZXNMaXN0ID0ge307XG4gICAgX3RoaXMucGVwTGlzdCA9IHt9O1xuXG4gIH1cblxuICAvKipcbiAgKiByZXR1cm4gdGhlIG1lc3NhZ2VCdXMgaW4gdGhpcyBSZWdpc3RyeVxuICAqIEBwYXJhbSB7TWVzc2FnZUJ1c30gICAgICAgICAgIG1lc3NhZ2VCdXNcbiAgKi9cbiAgZ2V0IG1lc3NhZ2VCdXMoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMuX21lc3NhZ2VCdXM7XG4gIH1cblxuICAvKipcbiAgKiBTZXQgdGhlIG1lc3NhZ2VCdXMgaW4gdGhpcyBSZWdpc3RyeVxuICAqIEBwYXJhbSB7TWVzc2FnZUJ1c30gICAgICAgICAgIG1lc3NhZ2VCdXNcbiAgKi9cbiAgc2V0IG1lc3NhZ2VCdXMobWVzc2FnZUJ1cykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgX3RoaXMuX21lc3NhZ2VCdXMgPSBtZXNzYWdlQnVzO1xuXG4gICAgLy8gSW5zdGFsbCBBZGRyZXNzQWxsb2NhdGlvblxuICAgIGxldCBhZGRyZXNzQWxsb2NhdGlvbiA9IG5ldyBBZGRyZXNzQWxsb2NhdGlvbihfdGhpcy5yZWdpc3RyeVVSTCwgbWVzc2FnZUJ1cyk7XG4gICAgX3RoaXMuYWRkcmVzc0FsbG9jYXRpb24gPSBhZGRyZXNzQWxsb2NhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAqIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCB0byByZXR1cm4gdGhlIHNhbmRib3ggaW5zdGFuY2Ugd2hlcmUgdGhlIEFwcGxpY2F0aW9uIGlzIGV4ZWN1dGluZy4gSXQgaXMgYXNzdW1lZCB0aGVyZSBpcyBqdXN0IG9uZSBBcHAgcGVyIFJ1bnRpbWUgaW5zdGFuY2UuXG4gICovXG4gIGdldEFwcFNhbmRib3goKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMuYXBwU2FuZGJveDtcbiAgfVxuXG4gIC8qKlxuICAqIEZ1bmN0aW9uIHRvIHF1ZXJ5IHRoZSBEb21haW4gcmVnaXN0cnksIHdpdGggYW4gdXNlciBlbWFpbC5cbiAgKi9cbiAgZ2V0VXNlckh5cGVydHkoZW1haWwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBpZGVudGl0eVVSTCA9ICd1c2VyOi8vJyArIGVtYWlsLnN1YnN0cmluZyhlbWFpbC5pbmRleE9mKCdAJykgKyAxLCBlbWFpbC5sZW5ndGgpICsgJy8nICsgZW1haWwuc3Vic3RyaW5nKDAsIGVtYWlsLmluZGV4T2YoJ0AnKSk7XG5cbiAgICBsZXQgbXNnID0ge1xuICAgICAgaWQ6IDk4LCB0eXBlOiAnUkVBRCcsIGZyb206IF90aGlzLnJlZ2lzdHJ5VVJMLCB0bzogJ2RvbWFpbjovL3JlZ2lzdHJ5LnVhLnB0LycsIGJvZHk6IHsgdXNlcjogaWRlbnRpdHlVUkx9XG4gICAgfTtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIF90aGlzLl9tZXNzYWdlQnVzLnBvc3RNZXNzYWdlKG1zZywgKHJlcGx5KSA9PiB7XG5cbiAgICAgICAgbGV0IGh5cGVydHlVUkwgPSByZXBseS5ib2R5Lmxhc3Q7XG5cbiAgICAgICAgaWYgKGh5cGVydHlVUkwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiByZWplY3QoJ1VzZXIgSHlwZXJ0eSBub3QgZm91bmQnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETyByZW1vdmUgbGF0ZXIsIGZpeCB0aGUgcHJvYmxlbSBvZiBiYWQgVVJMIGZvcm1hdCByZWNlaXZlZCBpbiB0aGUgbWVzc2FnZVxuICAgICAgICBsZXQgZml4ZWRIeXBlcnR5VVJMID0gJ2h5cGVydHk6LycgKyBoeXBlcnR5VVJMLnN1YnN0cmluZyhoeXBlcnR5VVJMLmluZGV4T2YoJzonKSArIDEsIGh5cGVydHlVUkwubGVuZ3RoKTtcblxuICAgICAgICBsZXQgaWRQYWNrYWdlID0ge1xuICAgICAgICAgIGlkOiBlbWFpbCxcbiAgICAgICAgICBkZXNjcmlwdG9yOiByZXBseS5ib2R5Lmh5cGVydGllc1toeXBlcnR5VVJMXS5kZXNjcmlwdG9yLFxuICAgICAgICAgIGh5cGVydHlVUkw6IGZpeGVkSHlwZXJ0eVVSTFxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCc9PT0+IFJlZ2lzdGVySHlwZXJ0eSBtZXNzYWdlQnVuZGxlOiAnLCBpZFBhY2thZ2UpO1xuICAgICAgICByZXNvbHZlKGlkUGFja2FnZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHJlZ2lzdGVyIGEgbmV3IEh5cGVydHkgaW4gdGhlIHJ1bnRpbWUgd2hpY2ggcmV0dXJucyB0aGUgSHlwZXJ0eVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBIeXBlcnR5LlxuICAqIEBwYXJhbSAge1NhbmRib3h9ICAgICAgICAgICAgIHNhbmRib3ggICAgICAgICAgICAgICBzYW5kYm94XG4gICogQHBhcmFtICB7SHlwZXJ0eUNhdGFsb2d1ZVVSTH0gSHlwZXJ0eUNhdGFsb2d1ZVVSTCAgIGRlc2NyaXB0b3JcbiAgKiBAcmV0dXJuIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMXG4gICovXG4gIHJlZ2lzdGVySHlwZXJ0eShzYW5kYm94LCBkZXNjcmlwdG9yKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vYXNzdW1pbmcgZGVzY3JpcHRvciBjb21lIGluIHRoaXMgZm9ybWF0LCB0aGUgc2VydmljZS1wcm92aWRlci1kb21haW4gdXJsIGlzIHJldHJpZXZlZCBieSBhIHNwbGl0IGluc3RydWN0aW9uXG4gICAgLy9oeXBlcnR5LWNhdGFsb2d1ZTovLzxzZXJ2aWNlLXByb3ZpZGVyLWRvbWFpbj4vPGNhdGFsb2d1ZS1vYmplY3QtaWRlbnRpZmllcj5cbiAgICBsZXQgZG9tYWluVXJsID0gZGl2aWRlVVJMKGRlc2NyaXB0b3IpLmRvbWFpbjtcblxuICAgIGxldCBpZGVudGl0aWVzID0gX3RoaXMuaWRNb2R1bGUuZ2V0SWRlbnRpdGllcygpO1xuXG4gICAgdmFyIHByb21pc2UgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgaWYgKF90aGlzLl9tZXNzYWdlQnVzID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmVqZWN0KCdNZXNzYWdlQnVzIG5vdCBmb3VuZCBvbiByZWdpc3RlclN0dWInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vY2FsbCBjaGVjayBpZiB0aGUgcHJvdG9zdHViIGV4aXN0XG4gICAgICAgIHJldHVybiBfdGhpcy5yZXNvbHZlKCdoeXBlcnR5LXJ1bnRpbWU6Ly8nICsgZG9tYWluVXJsKS50aGVuKGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgLypcbiAgICAgICAgICBpZiAoX3RoaXMuaHlwZXJ0aWVzTGlzdFRvUmVtb3ZlLmhhc093blByb3BlcnR5KGRvbWFpblVybCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdlbnRyb3U/Jyk7XG4gICAgICAgICAgICBfdGhpcy5oeXBlcnRpZXNMaXN0VG9SZW1vdmVbZG9tYWluVXJsXSA9IHtpZGVudGl0eTogaWRlbnRpdGllc1swXS5pZGVudGl0eX07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKCFfdGhpcy5zYW5kYm94ZXNMaXN0Lmhhc093blByb3BlcnR5KGRvbWFpblVybCkpIHtcbiAgICAgICAgICAgIF90aGlzLnNhbmRib3hlc0xpc3RbZG9tYWluVXJsXSA9IHNhbmRib3g7XG4gICAgICAgICAgICBzYW5kYm94LmFkZExpc3RlbmVyKCcqJywgZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgICAgIF90aGlzLl9tZXNzYWdlQnVzLnBvc3RNZXNzYWdlKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgIH1cbiAgICAgICAgICAqL1xuXG4gICAgICAgICAgLy8gVE9ETzogc2hvdWxkIGJlIGltcGxlbWVudGVkIHdpdGggYWRkcmVzc2VzIHBvbGxcbiAgICAgICAgICAvLyBJbiB0aGlzIGNhc2Ugd2Ugd2lsbCByZXF1ZXN0IGFuZCByZXR1cm4gb25seSBvbmVcbiAgICAgICAgICAvLyBhZGRyZXNzXG4gICAgICAgICAgbGV0IG51bWJlck9mQWRkcmVzc2VzID0gMTtcbiAgICAgICAgICBfdGhpcy5hZGRyZXNzQWxsb2NhdGlvbi5jcmVhdGUoZG9tYWluVXJsLCBudW1iZXJPZkFkZHJlc3NlcykudGhlbihmdW5jdGlvbihhZGRlcmVzc0xpc3QpIHtcblxuICAgICAgICAgICAgYWRkZXJlc3NMaXN0LmZvckVhY2goZnVuY3Rpb24oYWRkcmVzcykge1xuXG4gICAgICAgICAgICAgIF90aGlzLl9tZXNzYWdlQnVzLmFkZExpc3RlbmVyKGFkZHJlc3MgKyAnL3N0YXR1cycsIChtc2cpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnTWVzc2FnZSBhZGRMaXN0ZW5lciBmb3IgOiAnLCBhZGRyZXNzICsgJy9zdGF0dXMgLT4gJyAgKyBtc2cpO1xuICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBoeXBlcnR5ID0gbmV3IEh5cGVydHlJbnN0YW5jZShfdGhpcy5pZGVudGlmaWVyLCBfdGhpcy5yZWdpc3RyeVVSTCxcbiAgICAgICAgICAgIGRlc2NyaXB0b3IsIGFkZGVyZXNzTGlzdFswXSwgaWRlbnRpdGllc1swXS5pZGVudGl0eSk7XG5cbiAgICAgICAgICAgIF90aGlzLmh5cGVydGllc0xpc3QucHVzaChoeXBlcnR5KTtcblxuICAgICAgICAgICAgLy9tZXNzYWdlIHRvIHJlZ2lzdGVyIHRoZSBuZXcgaHlwZXJ0eSwgd2l0aGluIHRoZSBkb21haW4gcmVnaXN0cnlcbiAgICAgICAgICAgIGxldCBtc2cgPSB7XG4gICAgICAgICAgICAgIGlkOiA5OSwgdHlwZTogJ0NSRUFURScsIGZyb206IF90aGlzLnJlZ2lzdHJ5VVJMLCB0bzogJ2RvbWFpbjovL3JlZ2lzdHJ5LnVhLnB0LycsIGJvZHk6IHt1c2VyOiBpZGVudGl0aWVzWzBdLmlkZW50aXR5LCAgaHlwZXJ0eURlc2NyaXB0b3JVUkw6IGRlc2NyaXB0b3IsIGh5cGVydHlVUkw6IGFkZGVyZXNzTGlzdFswXX1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIF90aGlzLl9tZXNzYWdlQnVzLnBvc3RNZXNzYWdlKG1zZywgKHJlcGx5KSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCc9PT0+IFJlZ2lzdGVySHlwZXJ0eSBSZXBseTogJywgcmVwbHkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlc29sdmUoYWRkZXJlc3NMaXN0WzBdKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnQWRkcmVzcyBSZWFzb246ICcsIHJlYXNvbik7XG4gICAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgSHlwZXJ0eVxuICAqIEBwYXJhbSAge0h5cGVydHlVUkx9ICAgICAgICAgIEh5cGVydHlVUkwgdXJsICAgICAgICB1cmxcbiAgKi9cbiAgdW5yZWdpc3Rlckh5cGVydHkodXJsKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgbGV0IGZvdW5kID0gZmFsc2U7XG4gICAgICBsZXQgaW5kZXggPSAwO1xuXG4gICAgICBmb3JcdChpbmRleCA9IDA7IGluZGV4IDwgX3RoaXMuaHlwZXJ0aWVzTGlzdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgbGV0IGh5cGVydHkgPSBfdGhpcy5oeXBlcnRpZXNMaXN0W2luZGV4XTtcbiAgICAgICAgaWYgKGh5cGVydHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmIChoeXBlcnR5Lmh5cGVydHlVUkwgPT09IHVybCkge1xuICAgICAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChmb3VuZCA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmVqZWN0KCdIeXBlcnR5IG5vdCBmb3VuZCcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVsZXRlIF90aGlzLmh5cGVydGllc0xpc3RbaW5kZXhdO1xuICAgICAgICByZXNvbHZlKCdIeXBlcnR5IHN1Y2Nlc3NmdWxseSBkZWxldGVkJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIGRpc2NvdmVyIHByb3RvY29sIHN0dWJzIGF2YWlsYWJsZSBpbiB0aGUgcnVudGltZSBmb3IgYSBjZXJ0YWluIGRvbWFpbi4gSWYgYXZhaWxhYmxlLCBpdCByZXR1cm5zIHRoZSBydW50aW1lIHVybCBmb3IgdGhlIHByb3RvY29sIHN0dWIgdGhhdCBjb25uZWN0cyB0byB0aGUgcmVxdWVzdGVkIGRvbWFpbi4gUmVxdWlyZWQgYnkgdGhlIHJ1bnRpbWUgQlVTIHRvIHJvdXRlIG1lc3NhZ2VzIHRvIHJlbW90ZSBzZXJ2ZXJzIG9yIHBlZXJzIChkbyB3ZSBuZWVkIHNvbWV0aGluZyBzaW1pbGFyIGZvciBIeXBlcnRpZXM/KS5cbiAgKiBAcGFyYW0gIHtEb21haW5VUkx9ICAgICAgICAgICBEb21haW5VUkwgICAgICAgICAgICB1cmxcbiAgKiBAcmV0dXJuIHtSdW50aW1lVVJMfSAgICAgICAgICAgUnVudGltZVVSTFxuICAqL1xuICBkaXNjb3ZlclByb3Rvc3R1Yih1cmwpIHtcbiAgICBpZiAoIXVybCkgdGhyb3cgbmV3IEVycm9yKCdQYXJhbWV0ZXIgdXJsIG5lZWRlZCcpO1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCByZXF1ZXN0ID0gX3RoaXMucHJvdG9zdHVic0xpc3RbdXJsXTtcblxuICAgICAgaWYgKHJlcXVlc3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZWplY3QoJ3JlcXVlc3RVcGRhdGUgY291bGRuXFwnIGdldCB0aGUgUHJvdG9zdHViVVJMJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKHJlcXVlc3QpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgICogVG8gcmVnaXN0ZXIgYSBuZXcgUHJvdG9jb2wgU3R1YiBpbiB0aGUgcnVudGltZSBpbmNsdWRpbmcgYXMgaW5wdXQgcGFyYW1ldGVycyB0aGUgZnVuY3Rpb24gdG8gcG9zdE1lc3NhZ2UsIHRoZSBEb21haW5VUkwgdGhhdCBpcyBjb25uZWN0ZWQgd2l0aCB0aGUgc3R1Yiwgd2hpY2ggcmV0dXJucyB0aGUgUnVudGltZVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBQcm90b2NvbFN0dWIuXG4gICAqIEBwYXJhbSB7U2FuZGJveH0gICAgICAgIFNhbmRib3hcbiAgICogQHBhcmFtICB7RG9tYWluVVJMfSAgICAgRG9tYWluVVJMIHNlcnZpY2UgcHJvdmlkZXIgZG9tYWluXG4gICAqIEByZXR1cm4ge1J1bnRpbWVQcm90b1N0dWJVUkx9XG4gICAqL1xuICByZWdpc3RlclN0dWIoc2FuZGJveCwgZG9tYWluVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcnVudGltZVByb3RvU3R1YlVSTDtcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcblxuICAgICAgLy9jaGVjayBpZiBtZXNzYWdlQnVzIGlzIHJlZ2lzdGVyZWQgaW4gcmVnaXN0cnkgb3Igbm90XG4gICAgICBpZiAoX3RoaXMuX21lc3NhZ2VCdXMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZWplY3QoJ01lc3NhZ2VCdXMgbm90IGZvdW5kIG9uIHJlZ2lzdGVyU3R1YicpO1xuICAgICAgfVxuXG4gICAgICAvL1RPRE8gaW1wbGVtZW50IGEgdW5pcXVlIG51bWJlciBmb3IgdGhlIHByb3Rvc3R1YlVSTFxuICAgICAgaWYgKCFkb21haW5VUkwuaW5kZXhPZignbXNnLW5vZGUuJykpIHtcbiAgICAgICAgZG9tYWluVVJMID0gZG9tYWluVVJMLnN1YnN0cmluZyhkb21haW5VUkwuaW5kZXhPZignLicpICsgMSk7XG4gICAgICB9XG5cbiAgICAgIHJ1bnRpbWVQcm90b1N0dWJVUkwgPSAnbXNnLW5vZGUuJyArIGRvbWFpblVSTCArICcvcHJvdG9zdHViLycgKyBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMSk7XG5cbiAgICAgIC8vIFRPRE86IE9wdGltaXplIHRoaXNcbiAgICAgIF90aGlzLnByb3Rvc3R1YnNMaXN0W2RvbWFpblVSTF0gPSBydW50aW1lUHJvdG9TdHViVVJMO1xuICAgICAgX3RoaXMuc2FuZGJveGVzTGlzdFtkb21haW5VUkxdID0gc2FuZGJveDtcblxuICAgICAgLy8gc2FuZGJveC5hZGRMaXN0ZW5lcignKicsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgLy8gICBfdGhpcy5fbWVzc2FnZUJ1cy5wb3N0TWVzc2FnZShtc2cpO1xuICAgICAgLy8gfSk7XG5cbiAgICAgIHJlc29sdmUocnVudGltZVByb3RvU3R1YlVSTCk7XG5cbiAgICAgIF90aGlzLl9tZXNzYWdlQnVzLmFkZExpc3RlbmVyKHJ1bnRpbWVQcm90b1N0dWJVUkwgKyAnL3N0YXR1cycsIChtc2cpID0+IHtcbiAgICAgICAgaWYgKG1zZy5yZXNvdXJjZSA9PT0gbXNnLnRvICsgJy9zdGF0dXMnKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1J1bnRpbWVQcm90b3N0dWJVUkwvc3RhdHVzIG1lc3NhZ2U6ICcsIG1zZy5ib2R5LnZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIC8qKlxuICAqIFRvIHVucmVnaXN0ZXIgYSBwcmV2aW91c2x5IHJlZ2lzdGVyZWQgcHJvdG9jb2wgc3R1YlxuICAqIEBwYXJhbSAge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMICAgICBoeXBlcnR5UnVudGltZVVSTFxuICAqL1xuICB1bnJlZ2lzdGVyU3R1YihoeXBlcnR5UnVudGltZVVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgdmFyIHJ1bnRpbWVQcm90b1N0dWJVUkw7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCBkYXRhID0gX3RoaXMucHJvdG9zdHVic0xpc3RbaHlwZXJ0eVJ1bnRpbWVVUkxdO1xuXG4gICAgICBpZiAoZGF0YSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlamVjdCgnRXJyb3Igb24gdW5yZWdpc3RlclN0dWI6IEh5cGVydHkgbm90IGZvdW5kJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZWxldGUgX3RoaXMucHJvdG9zdHVic0xpc3RbaHlwZXJ0eVJ1bnRpbWVVUkxdO1xuICAgICAgICByZXNvbHZlKCdQcm90b3N0dWJVUkwgcmVtb3ZlZCcpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyByZWdpc3RlciBhIG5ldyBQb2xpY3kgRW5mb3JjZXIgaW4gdGhlIHJ1bnRpbWUgaW5jbHVkaW5nIGFzIGlucHV0IHBhcmFtZXRlcnMgdGhlIGZ1bmN0aW9uIHRvIHBvc3RNZXNzYWdlLCB0aGUgSHlwZXJ0eVVSTCBhc3NvY2lhdGVkIHdpdGggdGhlIFBFUCwgd2hpY2ggcmV0dXJucyB0aGUgUnVudGltZVVSTCBhbGxvY2F0ZWQgdG8gdGhlIG5ldyBQb2xpY3kgRW5mb3JjZXIgY29tcG9uZW50LlxuICAqIEBwYXJhbSAge01lc3NhZ2UuTWVzc2FnZX0gcG9zdE1lc3NhZ2UgcG9zdE1lc3NhZ2VcbiAgKiBAcGFyYW0gIHtIeXBlcnR5VVJMfSAgICAgICAgICBIeXBlcnR5VVJMICAgICAgICAgICAgaHlwZXJ0eVxuICAqIEByZXR1cm4ge0h5cGVydHlSdW50aW1lVVJMfSAgIEh5cGVydHlSdW50aW1lVVJMXG4gICovXG4gIHJlZ2lzdGVyUEVQKHBvc3RNZXNzYWdlLCBoeXBlcnR5KSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHZhciBwcm9taXNlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSxyZWplY3QpIHtcbiAgICAgIC8vVE9ETyBjaGVjayB3aGF0IHBhcmFtZXRlciBpbiB0aGUgcG9zdE1lc3NhZ2UgdGhlIHBlcCBpcy5cbiAgICAgIF90aGlzLnBlcExpc3RbaHlwZXJ0eV0gPSBwb3N0TWVzc2FnZTtcbiAgICAgIHJlc29sdmUoJ1BFUCByZWdpc3RlcmVkIHdpdGggc3VjY2VzcycpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB1bnJlZ2lzdGVyIGEgcHJldmlvdXNseSByZWdpc3RlcmVkIHByb3RvY29sIHN0dWJcbiAgKiBAcGFyYW0gIHtIeXBlcnR5UnVudGltZVVSTH0gICBIeXBlcnR5UnVudGltZVVSTCAgICAgSHlwZXJ0eVJ1bnRpbWVVUkxcbiAgKi9cbiAgdW5yZWdpc3RlclBFUChIeXBlcnR5UnVudGltZVVSTCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCByZXN1bHQgPSBfdGhpcy5wZXBMaXN0W0h5cGVydHlSdW50aW1lVVJMXTtcblxuICAgICAgaWYgKHJlc3VsdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlamVjdCgnUGVwIE5vdCBmb3VuZC4nKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUoJ1BFUCBzdWNjZXNzZnVsbHkgcmVtb3ZlZC4nKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgLyoqXG4gICogVG8gcmVjZWl2ZSBzdGF0dXMgZXZlbnRzIGZyb20gY29tcG9uZW50cyByZWdpc3RlcmVkIGluIHRoZSBSZWdpc3RyeS5cbiAgKiBAcGFyYW0gIHtNZXNzYWdlLk1lc3NhZ2V9ICAgICBNZXNzYWdlLk1lc3NhZ2UgICAgICAgZXZlbnRcbiAgKi9cbiAgb25FdmVudChldmVudCkge1xuICAgIC8vIFRPRE8gYm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogVG8gZGlzY292ZXIgc2FuZGJveGVzIGF2YWlsYWJsZSBpbiB0aGUgcnVudGltZSBmb3IgYSBjZXJ0YWluIGRvbWFpbi4gUmVxdWlyZWQgYnkgdGhlIHJ1bnRpbWUgVUEgdG8gYXZvaWQgbW9yZSB0aGFuIG9uZSBzYW5kYm94IGZvciB0aGUgc2FtZSBkb21haW4uXG4gICogQHBhcmFtICB7RG9tYWluVVJMfSBEb21haW5VUkwgdXJsXG4gICogQHJldHVybiB7UnVudGltZVNhbmRib3h9ICAgICAgICAgICBSdW50aW1lU2FuZGJveFxuICAqL1xuICBnZXRTYW5kYm94KHVybCkge1xuICAgIGlmICghdXJsKSB0aHJvdyBuZXcgRXJyb3IoJ1BhcmFtZXRlciB1cmwgbmVlZGVkJyk7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUscmVqZWN0KSB7XG5cbiAgICAgIGxldCByZXF1ZXN0ID0gX3RoaXMuc2FuZGJveGVzTGlzdFt1cmxdO1xuXG4gICAgICBpZiAocmVxdWVzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlamVjdCgnU2FuZGJveCBub3QgZm91bmQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc29sdmUocmVxdWVzdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICAvKipcbiAgKiBUbyB2ZXJpZnkgaWYgc291cmNlIGlzIHZhbGlkIGFuZCB0byByZXNvbHZlIHRhcmdldCBydW50aW1lIHVybCBhZGRyZXNzIGlmIG5lZWRlZCAoZWcgcHJvdG9zdHViIHJ1bnRpbWUgdXJsIGluIGNhc2UgdGhlIG1lc3NhZ2UgaXMgdG8gYmUgZGlzcGF0Y2hlZCB0byBhIHJlbW90ZSBlbmRwb2ludCkuXG4gICogQHBhcmFtICB7VVJMLlVSTH0gIHVybCAgICAgICB1cmxcbiAgKiBAcmV0dXJuIHtQcm9taXNlPFVSTC5VUkw+fSAgICAgICAgICAgICAgICAgUHJvbWlzZSA8VVJMLlVSTD5cbiAgKi9cbiAgcmVzb2x2ZSh1cmwpIHtcbiAgICBjb25zb2xlLmxvZygncmVzb2x2ZSAnICsgdXJsKTtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgLy9zcGxpdCB0aGUgdXJsIHRvIGZpbmQgdGhlIGRvbWFpblVSTC4gZGVhbHMgd2l0aCB0aGUgdXJsIGZvciBleGFtcGxlIGFzOlxuICAgIC8vXCJoeXBlcnR5LXJ1bnRpbWU6Ly9zcDEvcHJvdG9zdHViLzEyM1wiLFxuICAgIGxldCBkb21haW5VcmwgPSBkaXZpZGVVUkwodXJsKS5kb21haW47XG5cbiAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgaWYgKCFkb21haW5VcmwuaW5kZXhPZignbXNnLW5vZGUuJykgfHwgIWRvbWFpblVybC5pbmRleE9mKCdyZWdpc3RyeS4nKSkge1xuICAgICAgICBkb21haW5VcmwgPSBkb21haW5Vcmwuc3Vic3RyaW5nKGRvbWFpblVybC5pbmRleE9mKCcuJykgKyAxKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHJlcXVlc3QgID0gX3RoaXMucHJvdG9zdHVic0xpc3RbZG9tYWluVXJsXTtcblxuICAgICAgX3RoaXMuYWRkRXZlbnRMaXN0ZW5lcigncnVudGltZTpzdHViTG9hZGVkJywgZnVuY3Rpb24oZG9tYWluVXJsKSB7XG4gICAgICAgIHJlc29sdmUoZG9tYWluVXJsKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAocmVxdWVzdCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJlc29sdmUocmVxdWVzdCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfdGhpcy50cmlnZ2VyKCdydW50aW1lOmxvYWRTdHViJywgZG9tYWluVXJsKTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnk7XG4iLCIvKipcbiogICBAYXV0aG9yOiBHaWwgRGlhcyAoZ2lsLmRpYXNAdGVjbmljby51bGlzYm9hLnB0KVxuKiAgIFJlZ2lzdHJ5IERhdGEgTW9kZWwgaW5jbHVkZXMgYWxsIE9iamVjdHMgdG8gYmUgaGFuZGxlZCBieSB0aGUgUmVnaXN0cnkgZnVuY3Rpb25hbGl0eSBpbmNsdWRpbmdcbiovXG5jbGFzcyBSZWdpc3RyeURhdGFNb2RlbCB7XG5cbiAgY29uc3RydWN0b3IoaWQsIHVybCwgZGVzY3JpcHRvciwgc3RhcnRpbmdUaW1lLCBsYXN0TW9kaWZpZWQsIHN0YXR1cywgc3R1YnMsIHN0dWJzQ29uZmlndXJhdGlvbikge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5faWQgPSBpZDtcbiAgICBfdGhpcy5fdXJsID0gdXJsO1xuICAgIF90aGlzLl9kZXNjcmlwdG9yID0gZGVzY3JpcHRvcjtcbiAgICBfdGhpcy5fc3RhcnRpbmdUaW1lID0gc3RhcnRpbmdUaW1lO1xuICAgIF90aGlzLl9sYXN0TW9kaWZpZWQgPSBsYXN0TW9kaWZpZWQ7XG4gICAgX3RoaXMuX3N0YXR1cyA9IHN0YXR1cztcbiAgICBfdGhpcy5fc3R1YnMgPSBzdHVicztcbiAgICBfdGhpcy5fc3R1YnNDb25maWd1cmF0aW9uID0gc3R1YnNDb25maWd1cmF0aW9uO1xuICB9XG5cbiAgZ2V0IGlkKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLl9pZDtcbiAgfVxuXG4gIGdldCB1cmwoKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICByZXR1cm4gX3RoaXMuX3VybDtcbiAgfVxuXG4gIGdldCBkZXNjcmlwdG9yKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLl9kZXNjcmlwdG9yO1xuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVnaXN0cnlEYXRhTW9kZWw7XG4iLCJpbXBvcnQgUnVudGltZVVBIGZyb20gJy4vcnVudGltZS9SdW50aW1lVUEnO1xuXG5leHBvcnQgZGVmYXVsdCB7UnVudGltZVVBfTtcbiIsImNsYXNzIFJ1bnRpbWVDYXRhbG9ndWUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICAvLyBUT0RPOiBSZW1vdmUgdGhlIGNvZGUgaXMgb25seSBmb3IgZGV2ZWxvcG1lbnQgZmFzZSB3aXRob3V0IHRoZSBTZXJ2ZXIgYmFja2VuZCBjYXRhbG9ndWU7XG4gICAgLy8gTW9ja3VwIGxvYWQgdGhlIGJhc2Ugb2YgZGVzY3JpcHRvcnNcbiAgICBfdGhpcy5fbWFrZUV4dGVybmFsUmVxdWVzdCgnLi4vcmVzb3VyY2VzL2Rlc2NyaXB0b3JzL0h5cGVydGllcy5qc29uJykudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIF90aGlzLkh5cGVydGllcyA9IEpTT04ucGFyc2UocmVzdWx0KTtcbiAgICB9KTtcblxuICAgIF90aGlzLl9tYWtlRXh0ZXJuYWxSZXF1ZXN0KCcuLi9yZXNvdXJjZXMvZGVzY3JpcHRvcnMvUHJvdG9TdHVicy5qc29uJykudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgIF90aGlzLlByb3RvU3R1YnMgPSBKU09OLnBhcnNlKHJlc3VsdCk7XG4gICAgfSk7XG5cbiAgfVxuXG4gIHNldCBydW50aW1lVVJMKHJ1bnRpbWVVUkwpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIF90aGlzLl9ydW50aW1lVVJMID0gcnVudGltZVVSTDtcbiAgfVxuXG4gIGdldCBydW50aW1lVVJMKCkge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgcmV0dXJuIF90aGlzLl9ydW50aW1lVVJMO1xuICB9XG5cbiAgLyoqXG4gICogR2V0IGh5cGVydHlSdW50aW1lVVJMXG4gICovXG4gIGdldEh5cGVydHlSdW50aW1lVVJMKCkge1xuICAgIC8vIFRPRE86IGNoZWNrIGlmIHRoaXMgaXMgcmVhbCBuZWVkZWQ7XG4gICAgcmV0dXJuIF9oeXBlcnR5UnVudGltZVVSTDtcbiAgfVxuXG4gIF9tYWtlRXh0ZXJuYWxSZXF1ZXN0KHVybCkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgLy8gVE9ETzogaW1wbGVtZW50YXRpb25cbiAgICAgIC8vIFNpbXVsYXRlIGdldHRpbmcgaHlwZXJ0eVNvdXJjZUNvZGUgdGhyb3VnaCB0aGUgWE1MSHR0cFJlcXVlc3RcbiAgICAgIC8vIGJ1dCBpbiBub2RlIHRoaXMgc2hvdWxkIGJlIG92ZXJyaWRlZCB0byBvdGhlciBtZXRob2QgdG8gbWFrZSBhXG4gICAgICAvLyBhamF4IHJlcXVlc3Q7XG4gICAgICAvLyBpIHRoaW5rIHdlIGNhbiB1c2UgYSBmYWN0b3J5IGxpa2Ugd2UgdXNlZCBpbiBmb3IgdGhlIHNhbmRib3hlcyxcbiAgICAgIC8vIGFuIHNhbmRib3hGYWN0b3J5O1xuICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXG4gICAgICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgbGV0IHhociA9IGV2ZW50LmN1cnJlbnRUYXJnZXQ7XG4gICAgICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCkge1xuICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgICAgIHJlc29sdmUoeGhyLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlamVjdCh4aHIucmVzcG9uc2VUZXh0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHhoci5vcGVuKCdHRVQnLCB1cmwsIHRydWUpO1xuICAgICAgeGhyLnNlbmQoKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBHZXQgSHlwZXJ0eURlc2NyaXB0b3JcbiAgKi9cbiAgZ2V0SHlwZXJ0eURlc2NyaXB0b3IoaHlwZXJ0eVVSTCkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IGh5cGVydHlOYW1lID0gaHlwZXJ0eVVSTC5zdWJzdHIoaHlwZXJ0eVVSTC5sYXN0SW5kZXhPZignLycpICsgMSk7XG4gICAgICBsZXQgaHlwZXJ0eURlc2NyaXB0b3IgPSBfdGhpcy5IeXBlcnRpZXNbaHlwZXJ0eU5hbWVdO1xuICAgICAgcmVzb2x2ZShoeXBlcnR5RGVzY3JpcHRvcik7XG5cbiAgICB9KTtcblxuICB9XG5cbiAgLyoqXG4gICogR2V0IGh5cGVydHlTb3VyY2VDb2RlXG4gICovXG4gIGdldEh5cGVydHlTb3VyY2VQYWNrYWdlKGh5cGVydHlQYWNrYWdlKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgX3RoaXMuX21ha2VFeHRlcm5hbFJlcXVlc3QoaHlwZXJ0eVBhY2thZ2UpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG5cbiAgICAgICAgdHJ5IHtcblxuICAgICAgICAgIGxldCBzb3VyY2VQYWNrYWdlID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgIGxldCBzb3VyY2VDb2RlID0gd2luZG93LmF0b2Ioc291cmNlUGFja2FnZS5zb3VyY2VDb2RlKTtcbiAgICAgICAgICBzb3VyY2VQYWNrYWdlLnNvdXJjZUNvZGUgPSBzb3VyY2VDb2RlO1xuXG4gICAgICAgICAgcmVzb2x2ZShzb3VyY2VQYWNrYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuXG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBHZXQgU3R1YkRlc2NyaXB0b3JcbiAgKi9cbiAgZ2V0U3R1YkRlc2NyaXB0b3IoZG9tYWluVVJMKSB7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBsZXQgc3R1YkRlc2NyaXB0b3IgPSBfdGhpcy5Qcm90b1N0dWJzW2RvbWFpblVSTF07XG4gICAgICByZXNvbHZlKHN0dWJEZXNjcmlwdG9yKTtcblxuICAgIH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBHZXQgcHJvdG9zdHViU291cmNlQ29kZVxuICAqL1xuICBnZXRTdHViU291cmNlUGFja2FnZShzb3VyY2VQYWNrYWdlVVJMKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgX3RoaXMuX21ha2VFeHRlcm5hbFJlcXVlc3Qoc291cmNlUGFja2FnZVVSTCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIGxldCBzb3VyY2VQYWNrYWdlID0gSlNPTi5wYXJzZShyZXN1bHQpO1xuICAgICAgICAgIGxldCBzb3VyY2VDb2RlID0gd2luZG93LmF0b2Ioc291cmNlUGFja2FnZS5zb3VyY2VDb2RlKTtcbiAgICAgICAgICBzb3VyY2VQYWNrYWdlLnNvdXJjZUNvZGUgPSBzb3VyY2VDb2RlO1xuXG4gICAgICAgICAgcmVzb2x2ZShzb3VyY2VQYWNrYWdlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIHJlamVjdChlKTtcbiAgICAgICAgfVxuICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocmVhc29uKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9KTtcblxuICAgIH0pO1xuXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdW50aW1lQ2F0YWxvZ3VlO1xuIiwiLy9NYWluIGRlcGVuZGVjaWVzXG5pbXBvcnQgUmVnaXN0cnkgZnJvbSAnLi4vcmVnaXN0cnkvUmVnaXN0cnknO1xuaW1wb3J0IElkZW50aXR5TW9kdWxlIGZyb20gJy4uL2lkZW50aXR5L0lkZW50aXR5TW9kdWxlJztcbmltcG9ydCBQb2xpY3lFbmdpbmUgZnJvbSAnLi4vcG9saWN5L1BvbGljeUVuZ2luZSc7XG5pbXBvcnQgTWVzc2FnZUJ1cyBmcm9tICcuLi9idXMvTWVzc2FnZUJ1cyc7XG5cbmltcG9ydCBSdW50aW1lQ2F0YWxvZ3VlIGZyb20gJy4vUnVudGltZUNhdGFsb2d1ZSc7XG5cbmltcG9ydCBTeW5jaGVyTWFuYWdlciBmcm9tICcuLi9zeW5jaGVyL1N5bmNoZXJNYW5hZ2VyJztcblxuLyoqXG4gKiBSdW50aW1lIFVzZXIgQWdlbnQgSW50ZXJmYWNlIHdpbGwgcHJvY2VzcyBhbGwgdGhlIGRlcGVuZGVjaWVzIG9mIHRoZSBjb3JlIHJ1bnRpbWU7XG4gKiBAYXV0aG9yIFZpdG9yIFNpbHZhIFt2aXRvci10LXNpbHZhQHRlbGVjb20ucHRdXG4gKiBAdmVyc2lvbiAwLjIuMFxuICpcbiAqIEBwcm9wZXJ0eSB7c2FuZGJveEZhY3Rvcnl9IHNhbmRib3hGYWN0b3J5IC0gU3BlY2lmaWMgaW1wbGVtZW50YXRpb24gb2Ygc2FuZGJveDtcbiAqIEBwcm9wZXJ0eSB7UnVudGltZUNhdGFsb2d1ZX0gcnVudGltZUNhdGFsb2d1ZSAtIENhdGFsb2d1ZSBvZiBjb21wb25lbnRzIGNhbiBiZSBpbnN0YWxsZWQ7XG4gKiBAcHJvcGVydHkge3J1bnRpbWVVUkx9IHJ1bnRpbWVVUkwgLSBUaGlzIGlkZW50aWZ5IHRoZSBjb3JlIHJ1bnRpbWUsIHNob3VsZCBiZSB1bmlxdWU7XG4gKiBAcHJvcGVydHkge0lkZW50aXR5TW9kdWxlfSBpZGVudGl0eU1vZHVsZSAtIElkZW50aXR5IE1vZHVsZTtcbiAqIEBwcm9wZXJ0eSB7UG9saWN5RW5naW5lfSBwb2xpY3lFbmdpbmUgLSBQb2xpY3kgRW5naW5lIE1vZHVsZTtcbiAqIEBwcm9wZXJ0eSB7UmVnaXN0cnl9IHJlZ2lzdHJ5IC0gUmVnaXN0cnkgTW9kdWxlO1xuICogQHByb3BlcnR5IHtNZXNzYWdlQnVzfSBtZXNzYWdlQnVzIC0gTWVzc2FnZSBCdXMgaXMgdXNlZCBsaWtlIGEgcm91dGVyIHRvIHJlZGlyZWN0IHRoZSBtZXNzYWdlcyBmcm9tIG9uZSBjb21wb25lbnQgdG8gb3RoZXIocylcbiAqL1xuY2xhc3MgUnVudGltZVVBIHtcblxuICAvKipcbiAgICogQ3JlYXRlIGEgbmV3IGluc3RhbmNlIG9mIFJ1bnRpbWUgVXNlciBBZ2VudFxuICAgKiBAcGFyYW0ge3NhbmRib3hGYWN0b3J5fSBzYW5kYm94RmFjdG9yeSAtIFNwZWNpZmljIGltcGxlbWVudGF0aW9uIGZvciB0aGUgZW52aXJvbm1lbnQgd2hlcmUgdGhlIGNvcmUgcnVudGltZSB3aWxsIHJ1bjtcbiAgICovXG4gIGNvbnN0cnVjdG9yKHNhbmRib3hGYWN0b3J5KSB7XG5cbiAgICBpZiAoIXNhbmRib3hGYWN0b3J5KSB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBzYW5kYm94IGZhY3RvcnkgaXMgYSBuZWVkZWQgcGFyYW1ldGVyJyk7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgX3RoaXMuc2FuZGJveEZhY3RvcnkgPSBzYW5kYm94RmFjdG9yeTtcblxuICAgIF90aGlzLnJ1bnRpbWVDYXRhbG9ndWUgPSBuZXcgUnVudGltZUNhdGFsb2d1ZSgpO1xuXG4gICAgLy8gVE9ETzogcG9zdCBhbmQgcmV0dXJuIHJlZ2lzdHJ5L2h5cGVydHlSdW50aW1lSW5zdGFuY2UgdG8gYW5kIGZyb20gQmFjay1lbmQgU2VydmljZVxuICAgIC8vIHRoZSByZXNwb25zZSBpcyBsaWtlOiBydW50aW1lOi8vc3AxLzEyM1xuXG4gICAgbGV0IHJ1bnRpbWVVUkwgPSAncnVudGltZTovL3VhLnB0LycgKyBNYXRoLmZsb29yKChNYXRoLnJhbmRvbSgpICogMTAwMDApICsgMSk7XG4gICAgX3RoaXMucnVudGltZVVSTCA9IHJ1bnRpbWVVUkw7XG5cbiAgICAvLyBUT0RPOiBjaGVjayBpZiBydW50aW1lIGNhdGFsb2d1ZSBuZWVkIHRoZSBydW50aW1lVVJMO1xuICAgIF90aGlzLnJ1bnRpbWVDYXRhbG9ndWUucnVudGltZVVSTCA9IHJ1bnRpbWVVUkw7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSB0aGUgaWRlbnRpdHkgTW9kdWxlXG4gICAgX3RoaXMuaWRlbnRpdHlNb2R1bGUgPSBuZXcgSWRlbnRpdHlNb2R1bGUoKTtcblxuICAgIC8vIFVzZSB0aGUgc2FuZGJveCBmYWN0b3J5IHRvIGNyZWF0ZSBhbiBBcHBTYW5kYm94O1xuICAgIC8vIEluIHRoZSBmdXR1cmUgY2FuIGJlIGRlY2lkZWQgYnkgcG9saWN5RW5naW5lIGlmIHdlIG5lZWRcbiAgICAvLyBjcmVhdGUgYSBBcHBTYW5kYm94IG9yIG5vdDtcbiAgICBsZXQgYXBwU2FuZGJveCA9IHNhbmRib3hGYWN0b3J5LmNyZWF0ZUFwcFNhbmRib3goKTtcblxuICAgIC8vIEluc3RhbnRpYXRlIHRoZSBSZWdpc3RyeSBNb2R1bGVcbiAgICBfdGhpcy5yZWdpc3RyeSA9IG5ldyBSZWdpc3RyeShydW50aW1lVVJMLCBhcHBTYW5kYm94LCBfdGhpcy5pZGVudGl0eU1vZHVsZSk7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSB0aGUgUG9saWN5IEVuZ2luZVxuICAgIF90aGlzLnBvbGljeUVuZ2luZSA9IG5ldyBQb2xpY3lFbmdpbmUoX3RoaXMuaWRlbnRpdHlNb2R1bGUsIF90aGlzLnJlZ2lzdHJ5KTtcblxuICAgIC8vIEluc3RhbnRpYXRlIHRoZSBNZXNzYWdlIEJ1c1xuICAgIF90aGlzLm1lc3NhZ2VCdXMgPSBuZXcgTWVzc2FnZUJ1cyhfdGhpcy5yZWdpc3RyeSk7XG4gICAgX3RoaXMubWVzc2FnZUJ1cy5waXBlbGluZS5oYW5kbGVycyA9IFtcblxuICAgICAgLy8gUG9saWN5IG1lc3NhZ2UgYXV0aG9yaXNlXG4gICAgICBmdW5jdGlvbihjdHgpIHtcbiAgICAgICAgX3RoaXMucG9saWN5RW5naW5lLmF1dGhvcmlzZShjdHgubXNnKS50aGVuKGZ1bmN0aW9uKGNoYW5nZWRNZ3MpIHtcbiAgICAgICAgICBjdHgubXNnID0gY2hhbmdlZE1ncztcbiAgICAgICAgICBjdHgubmV4dCgpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKHJlYXNvbik7XG4gICAgICAgICAgY3R4LmZhaWwocmVhc29uKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgXTtcblxuICAgIC8vIEFkZCB0byBBcHAgU2FuZGJveCB0aGUgbGlzdGVuZXI7XG4gICAgYXBwU2FuZGJveC5hZGRMaXN0ZW5lcignKicsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgX3RoaXMubWVzc2FnZUJ1cy5wb3N0TWVzc2FnZShtc2cpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVnaXN0ZXIgbWVzc2FnZUJ1cyBvbiBSZWdpc3RyeVxuICAgIF90aGlzLnJlZ2lzdHJ5Lm1lc3NhZ2VCdXMgPSBfdGhpcy5tZXNzYWdlQnVzO1xuXG4gICAgX3RoaXMucmVnaXN0cnkuYWRkRXZlbnRMaXN0ZW5lcigncnVudGltZTpsb2FkU3R1YicsIGZ1bmN0aW9uKGRvbWFpblVSTCkge1xuXG4gICAgICBfdGhpcy5sb2FkU3R1Yihkb21haW5VUkwpLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgIF90aGlzLnJlZ2lzdHJ5LnRyaWdnZXIoJ3J1bnRpbWU6c3R1YkxvYWRlZCcsIGRvbWFpblVSTCk7XG4gICAgICB9KS5jYXRjaChmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihyZWFzb24pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVc2Ugc2FuZGJveCBmYWN0b3J5IHRvIHVzZSBzcGVjaWZpYyBtZXRob2RzXG4gICAgLy8gYW5kIHNldCB0aGUgbWVzc2FnZSBidXMgdG8gdGhlIGZhY3RvcnlcbiAgICBzYW5kYm94RmFjdG9yeS5tZXNzYWdlQnVzID0gX3RoaXMubWVzc2FnZUJ1cztcblxuICAgIC8vIEluc3RhbmNpYXRlIHRoZSBTeW5jaGVyTWFuYWdlcjtcbiAgICBfdGhpcy5zeW5jaGVyTWFuYWdlciA9IG5ldyBTeW5jaGVyTWFuYWdlcihfdGhpcy5ydW50aW1lVVJMLCBfdGhpcy5tZXNzYWdlQnVzLCB7IH0pO1xuXG4gIH1cblxuICAvKipcbiAgKiBBY2NvbW9kYXRlIGludGVyb3BlcmFiaWxpdHkgaW4gSDJIIGFuZCBwcm90byBvbiB0aGUgZmx5IGZvciBuZXdseSBkaXNjb3ZlcmVkIGRldmljZXMgaW4gTTJNXG4gICogQHBhcmFtICB7Q2F0YWxvZ3VlRGF0YU9iamVjdC5IeXBlcnR5RGVzY3JpcHRvcn0gICBkZXNjcmlwdG9yICAgIGRlc2NyaXB0b3JcbiAgKi9cbiAgZGlzY292ZXJIaXBlcnR5KGRlc2NyaXB0b3IpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxuICAvKipcbiAgKiBSZWdpc3RlciBIeXBlcnR5IGRlcGxveWVkIGJ5IHRoZSBBcHAgdGhhdCBpcyBwYXNzZWQgYXMgaW5wdXQgcGFyYW1ldGVyLiBUbyBiZSB1c2VkIHdoZW4gQXBwIGFuZCBIeXBlcnRpZXMgYXJlIGZyb20gdGhlIHNhbWUgZG9tYWluIG90aGVyd2lzZSB0aGUgUnVudGltZVVBIHdpbGwgcmFpc2UgYW4gZXhjZXB0aW9uIGFuZCB0aGUgQXBwIGhhcyB0byB1c2UgdGhlIGxvYWRIeXBlcnR5KC4uKSBmdW5jdGlvbi5cbiAgKiBAcGFyYW0gIHtPYmplY3R9IE9iamVjdCAgICAgICAgICAgICAgICAgICBoeXBlcnR5SW5zdGFuY2VcbiAgKiBAcGFyYW0gIHtVUkwuSHlwZXJ0eUNhdGFsb2d1ZVVSTH0gICAgICAgICBkZXNjcmlwdG9yICAgICAgZGVzY3JpcHRvclxuICAqL1xuICByZWdpc3Rlckh5cGVydHkoaHlwZXJ0eUluc3RhbmNlLCBkZXNjcmlwdG9yKSB7XG4gICAgLy8gQm9keS4uLlxuICB9XG5cbiAgLyoqXG4gICogRGVwbG95IEh5cGVydHkgZnJvbSBDYXRhbG9ndWUgVVJMXG4gICogQHBhcmFtICB7VVJMLlVSTH0gICAgaHlwZXJ0eSBoeXBlcnR5SW5zdGFuY2UgdXJsO1xuICAqL1xuICBsb2FkSHlwZXJ0eShoeXBlcnR5RGVzY3JpcHRvclVSTCkge1xuXG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmICghaHlwZXJ0eURlc2NyaXB0b3JVUkwpIHRocm93IG5ldyBFcnJvcignSHlwZXJ0eSBkZXNjcmlwdG9yIHVybCBwYXJhbWV0ZXIgaXMgbmVlZGVkJyk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG5cbiAgICAgIGxldCBfaHlwZXJ0eVVSTDtcbiAgICAgIGxldCBfaHlwZXJ0eVNhbmRib3g7XG4gICAgICBsZXQgX2h5cGVydHlEZXNjcmlwdG9yO1xuICAgICAgbGV0IF9oeXBlcnR5U291cmNlUGFja2FnZTtcblxuICAgICAgbGV0IGVycm9yUmVhc29uID0gZnVuY3Rpb24ocmVhc29uKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IocmVhc29uKTtcbiAgICAgICAgcmVqZWN0KHJlYXNvbik7XG4gICAgICB9O1xuXG4gICAgICAvLyBHZXQgSHlwZXJ0eSBkZXNjcmlwdG9yXG4gICAgICAvLyBUT0RPOiB0aGUgcmVxdWVzdCBNb2R1bGUgc2hvdWxkIGJlIGNoYW5nZWQsXG4gICAgICAvLyBiZWNhdXNlIGF0IHRoaXMgbW9tZW50IGl0IGlzIGluY29tcGF0aWJsZSB3aXRoIG5vZGVqcztcbiAgICAgIC8vIFByb2JhYmx5IHdlIG5lZWQgdG8gcGFzcyBhIGZhY3RvcnkgbGlrZSB3ZSBkbyBmb3Igc2FuZGJveGVzO1xuICAgICAgY29uc29sZS5pbmZvKCctLS0tLS0tLS0tLS0tLS0tLS0gSHlwZXJ0eSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgIGNvbnNvbGUuaW5mbygnR2V0IGh5cGVydHkgZGVzY3JpcHRvciBmb3IgOicsIGh5cGVydHlEZXNjcmlwdG9yVVJMKTtcbiAgICAgIF90aGlzLnJ1bnRpbWVDYXRhbG9ndWUuZ2V0SHlwZXJ0eURlc2NyaXB0b3IoaHlwZXJ0eURlc2NyaXB0b3JVUkwpLnRoZW4oZnVuY3Rpb24oaHlwZXJ0eURlc2NyaXB0b3IpIHtcbiAgICAgICAgLy8gYXQgdGhpcyBwb2ludCwgd2UgaGF2ZSBjb21wbGV0ZWQgXCJzdGVwIDIgYW5kIDNcIiBhcyBzaG93biBpbiBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1oeXBlcnR5Lm1kXG4gICAgICAgIGNvbnNvbGUuaW5mbygnMTogcmV0dXJuIGh5cGVydHkgZGVzY3JpcHRvcicsIGh5cGVydHlEZXNjcmlwdG9yKTtcblxuICAgICAgICAvLyBoeXBlcnR5IGNvbnRhaW5zIHRoZSBmdWxsIHBhdGggb2YgdGhlIGNhdGFsb2d1ZSBVUkwsIGUuZy5cbiAgICAgICAgLy8gY2F0YWxvZ3VlLnJldGhpbmsuZXUvLndlbGwta25vd24vLi4uLi4uLi4uLlxuICAgICAgICBfaHlwZXJ0eURlc2NyaXB0b3IgPSBoeXBlcnR5RGVzY3JpcHRvcjtcblxuICAgICAgICBsZXQgc291cmNlUGFja2FnZVVSTCA9IGh5cGVydHlEZXNjcmlwdG9yLnNvdXJjZVBhY2thZ2VVUkw7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBoeXBlcnR5IHNvdXJjZSBjb2RlXG4gICAgICAgIHJldHVybiBfdGhpcy5ydW50aW1lQ2F0YWxvZ3VlLmdldEh5cGVydHlTb3VyY2VQYWNrYWdlKHNvdXJjZVBhY2thZ2VVUkwpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHNvdXJjZVBhY2thZ2UpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCcyOiByZXR1cm4gaHlwZXJ0eSBzb3VyY2UgY29kZScpO1xuXG4gICAgICAgIC8vIGF0IHRoaXMgcG9pbnQsIHdlIGhhdmUgY29tcGxldGVkIFwic3RlcCA0IGFuZCA1XCIgYXMgc2hvd24gaW4gaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZFxuXG4gICAgICAgIF9oeXBlcnR5U291cmNlUGFja2FnZSA9IHNvdXJjZVBhY2thZ2U7XG5cbiAgICAgICAgLy9cbiAgICAgICAgLy8gc3RlcHMgNiAtLSA5IGFyZSBza2lwcGVkLlxuICAgICAgICAvLyBUT0RPOiBvbiByZWxlYXNlIG9mIGNvcmUgMC4yO1xuICAgICAgICAvLyBUT0RPOiBQcm9taXNlIHRvIGNoZWNrIHRoZSBwb2xpY3kgZW5naW5lXG5cbiAgICAgICAgLy8gbW9jay11cCBjb2RlO1xuICAgICAgICAvLyB0ZW1wb3JhcnkgY29kZSwgb25seVxuICAgICAgICBsZXQgcG9saWN5ID0gdHJ1ZTtcblxuICAgICAgICByZXR1cm4gcG9saWN5O1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHBvbGljeVJlc3VsdCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzM6IHJldHVybiBwb2xpY3kgZW5naW5lIHJlc3VsdCcpO1xuXG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgNiB0byA5IG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LWh5cGVydHkubWQgcmlnaHQgbm93LlxuICAgICAgICAvL1xuICAgICAgICAvLyBTdGVwcyA2IC0tIDlcbiAgICAgICAgLy8gQXMgYSByZXN1bHQgb2YgdGhlIHNpcHBlZCBzdGVwcywgd2Uga25vdyBhdCB0aGlzIHBvaW50IGlmIHdlIGV4ZWN1dGVcbiAgICAgICAgLy8gaW5TYW1lU2FuZGJveCBvciBub3QuXG4gICAgICAgIC8vXG5cbiAgICAgICAgLy8gRm9yIHRlc3RpbmcsIGp1c3QgYXNzdW1lIHdlIGV4ZWN1dGUgaW4gc2FtZSBTYW5kYm94LlxuICAgICAgICBsZXQgaW5TYW1lU2FuZGJveCA9IHRydWU7XG4gICAgICAgIGxldCBzYW5kYm94O1xuXG4gICAgICAgIGlmIChpblNhbWVTYW5kYm94KSB7XG5cbiAgICAgICAgICAvLyB0aGlzIGRvbid0IG5lZWQgYmUgYSBQcm9taXNlO1xuICAgICAgICAgIHNhbmRib3ggPSBfdGhpcy5yZWdpc3RyeS5nZXRBcHBTYW5kYm94KCk7XG5cbiAgICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIDExIGhlcmUuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAvLyBnZXRTYW5kYm94LCB0aGlzIHdpbGwgcmV0dXJuIGEgcHJvbWlzZTtcbiAgICAgICAgICBzYW5kYm94ID0gX3RoaXMucmVnaXN0cnkuZ2V0U2FuZGJveChkb21haW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGhpcyB3aWxsIHJldHVybiB0aGUgc2FuZGJveCBvciBvbmUgcHJvbWlzZSB0byBnZXRTYW5kYm94O1xuICAgICAgICByZXR1cm4gc2FuZGJveDtcbiAgICAgIH0pLnRoZW4oZnVuY3Rpb24oc2FuZGJveCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzQ6IHJldHVybiB0aGUgc2FuZGJveCcsIHNhbmRib3gpO1xuXG4gICAgICAgIC8vIFJldHVybiB0aGUgc2FuZGJveCBpbmRlcGVudGVseSBpZiBpdCBydW5uaW5nIGluIHRoZSBzYW1lIHNhbmRib3ggb3Igbm90XG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgMTQgaGVyZS5cbiAgICAgICAgcmV0dXJuIHNhbmRib3g7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignNC4xOiB0cnkgdG8gcmVnaXN0ZXIgYSBuZXcgc2FuZGJveCcsIHJlYXNvbik7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHNhbmRib3ggaXMgcmVnaXN0ZWQgZm9yIHRoaXMgaHlwZXJ0eSBkZXNjcmlwdG9yIHVybDtcbiAgICAgICAgLy8gTWFrZSBTdGVwcyB4eHggLS0tIHh4eFxuICAgICAgICAvLyBJbnN0YW50aWF0ZSB0aGUgU2FuZGJveFxuICAgICAgICBsZXQgc2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZVNhbmRib3goKTtcblxuICAgICAgICBzYW5kYm94LmFkZExpc3RlbmVyKCcqJywgZnVuY3Rpb24obXNnKSB7XG4gICAgICAgICAgX3RoaXMubWVzc2FnZUJ1cy5wb3N0TWVzc2FnZShtc2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc2FuZGJveDtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihzYW5kYm94KSB7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnNTogcmV0dXJuIHNhbmRib3ggYW5kIHJlZ2lzdGVyJyk7XG5cbiAgICAgICAgX2h5cGVydHlTYW5kYm94ID0gc2FuZGJveDtcblxuICAgICAgICAvLyBSZWdpc3RlciBoeXBlcnR5XG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5yZWdpc3Rlckh5cGVydHkoc2FuZGJveCwgaHlwZXJ0eURlc2NyaXB0b3JVUkwpO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGh5cGVydHlVUkwpIHtcbiAgICAgICAgY29uc29sZS5pbmZvKCc2OiBIeXBlcnR5IHVybCwgYWZ0ZXIgcmVnaXN0ZXIgaHlwZXJ0eScsIGh5cGVydHlVUkwpO1xuXG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgMTYgb2YgaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZCByaWdodCBub3cuXG5cbiAgICAgICAgX2h5cGVydHlVUkwgPSBoeXBlcnR5VVJMO1xuXG4gICAgICAgIC8vIEV4dGVuZCBvcmlnaW5hbCBoeXBlcnR5IGNvbmZpZ3VyYXRpb247XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uID0gT2JqZWN0LmFzc2lnbih7fSwgX2h5cGVydHlEZXNjcmlwdG9yLmNvbmZpZ3VyYXRpb24pO1xuICAgICAgICBjb25maWd1cmF0aW9uLnJ1bnRpbWVVUkwgPSBfdGhpcy5ydW50aW1lVVJMO1xuXG4gICAgICAgIC8vIFdlIHdpbGwgZGVwbG95IHRoZSBjb21wb25lbnQgLSBzdGVwIDE3IG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LWh5cGVydHkubWQgcmlnaHQgbm93LlxuICAgICAgICByZXR1cm4gX2h5cGVydHlTYW5kYm94LmRlcGxveUNvbXBvbmVudChfaHlwZXJ0eVNvdXJjZVBhY2thZ2Uuc291cmNlQ29kZSwgX2h5cGVydHlVUkwsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRlcGxveUNvbXBvbmVudFN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmluZm8oJzc6IERlcGxveSBjb21wb25lbnQgc3RhdHVzIGZvciBoeXBlcnR5OiAnLCBkZXBsb3lDb21wb25lbnRTdGF0dXMpO1xuXG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgMTkgaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktaHlwZXJ0eS5tZCByaWdodCBub3cuXG5cbiAgICAgICAgLy8gQWRkIHRoZSBtZXNzYWdlIGJ1cyBsaXN0ZW5lciB0byB0aGUgYXBwU2FuZGJveCBvciBoeXBlcnRTYW5kYm94O1xuICAgICAgICBfdGhpcy5tZXNzYWdlQnVzLmFkZExpc3RlbmVyKF9oeXBlcnR5VVJMLCBmdW5jdGlvbihtc2cpIHtcbiAgICAgICAgICBfaHlwZXJ0eVNhbmRib3gucG9zdE1lc3NhZ2UobXNnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCAyMCBvZiBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1oeXBlcnR5Lm1kIHJpZ2h0IG5vdy5cbiAgICAgICAgbGV0IGh5cGVydHkgPSB7XG4gICAgICAgICAgcnVudGltZUh5cGVydHlVUkw6IF9oeXBlcnR5VVJMLFxuICAgICAgICAgIHN0YXR1czogZGVwbG95Q29tcG9uZW50U3RhdHVzXG4gICAgICAgIH07XG5cbiAgICAgICAgcmVzb2x2ZShoeXBlcnR5KTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIDIxIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LWh5cGVydHkubWQgcmlnaHQgbm93LlxuICAgICAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tLS0tLS0tLS0tIEVORCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3JSZWFzb24pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIERlcGxveSBTdHViIGZyb20gQ2F0YWxvZ3VlIFVSTCBvciBkb21haW4gdXJsXG4gICogQHBhcmFtICB7VVJMLlVSTH0gICAgIGRvbWFpbiAgICAgICAgICBkb21haW5cbiAgKi9cbiAgbG9hZFN0dWIoZG9tYWluKSB7XG5cbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgaWYgKCFkb21haW4pIHRocm93IG5ldyBFcnJvcignZG9tYWluIHBhcmFtZXRlciBpcyBuZWVkZWQnKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgbGV0IF9zdHViU2FuZGJveDtcbiAgICAgIGxldCBfc3R1YkRlc2NyaXB0b3I7XG4gICAgICBsZXQgX3J1bnRpbWVQcm90b1N0dWJVUkw7XG4gICAgICBsZXQgX3N0dWJTb3VyY2VQYWNrYWdlO1xuXG4gICAgICBsZXQgZXJyb3JSZWFzb24gPSBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihyZWFzb24pO1xuICAgICAgICByZWplY3QocmVhc29uKTtcbiAgICAgIH07XG5cbiAgICAgIC8vIERpc2NvdmVyIFByb3RvY29sIFN0dWJcbiAgICAgIGNvbnNvbGUuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLSBQcm90b1N0dWIgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJyk7XG4gICAgICBjb25zb2xlLmluZm8oJ0Rpc2NvdmVyIG9yIENyZWF0ZSBhIG5ldyBQcm90b1N0dWIgZm9yIGRvbWFpbjogJywgZG9tYWluKTtcbiAgICAgIF90aGlzLnJlZ2lzdHJ5LmRpc2NvdmVyUHJvdG9zdHViKGRvbWFpbikudGhlbihmdW5jdGlvbihkZXNjcmlwdG9yKSB7XG4gICAgICAgIC8vIElzIHJlZ2lzdGVkP1xuICAgICAgICBjb25zb2xlLmluZm8oJzEuIFByb3RvIFN0dWIgRGlzY292ZXJlZDogJywgZGVzY3JpcHRvcik7XG4gICAgICAgIF9zdHViRGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCAyIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuXG4gICAgICAgIHJldHVybiBfc3R1YkRlc2NyaXB0b3I7XG4gICAgICB9LCBmdW5jdGlvbihyZWFzb24pIHtcbiAgICAgICAgLy8gaXMgbm90IHJlZ2lzdGVkP1xuICAgICAgICBjb25zb2xlLmluZm8oJzEuIFByb3RvIFN0dWIgbm90IGZvdW5kOicsIHJlYXNvbik7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCAzIGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuXG4gICAgICAgIC8vIHdlIG5lZWQgdG8gZ2V0IFByb3RvU3R1YiBkZXNjcmlwdG9yIHN0ZXAgNCBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1wcm90b3N0dWIubWRcbiAgICAgICAgcmV0dXJuIF90aGlzLnJ1bnRpbWVDYXRhbG9ndWUuZ2V0U3R1YkRlc2NyaXB0b3IoZG9tYWluKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihzdHViRGVzY3JpcHRvcikge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnMi4gcmV0dXJuIHRoZSBQcm90b1N0dWIgZGVzY3JpcHRvcjonLCBzdHViRGVzY3JpcHRvcik7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCA1IGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuXG4gICAgICAgIF9zdHViRGVzY3JpcHRvciA9IHN0dWJEZXNjcmlwdG9yO1xuXG4gICAgICAgIGxldCBzb3VyY2VQYWNrYWdlVVJMID0gc3R1YkRlc2NyaXB0b3Iuc291cmNlUGFja2FnZVVSTDtcblxuICAgICAgICBjb25zb2xlLmxvZyhzdHViRGVzY3JpcHRvci5zb3VyY2VQYWNrYWdlVVJMKTtcblxuICAgICAgICAvLyB3ZSBuZWVkIHRvIGdldCBQcm90b1N0dWIgU291cmNlIGNvZGUgZnJvbSBkZXNjcmlwdG9yIC0gc3RlcCA2IGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuICAgICAgICByZXR1cm4gX3RoaXMucnVudGltZUNhdGFsb2d1ZS5nZXRTdHViU291cmNlUGFja2FnZShzb3VyY2VQYWNrYWdlVVJMKTtcbiAgICAgIH0pXG4gICAgICAudGhlbihmdW5jdGlvbihzdHViU291cmNlUGFja2FnZSkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzMuIHJldHVybiB0aGUgUHJvdG9TdHViIFNvdXJjZSBDb2RlOiAnLCBzdHViU291cmNlUGFja2FnZSk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCA3IGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuXG4gICAgICAgIF9zdHViU291cmNlUGFja2FnZSA9IHN0dWJTb3VyY2VQYWNrYWdlO1xuXG4gICAgICAgIC8vIFRPRE86IENoZWNrIG9uIFBFUCAocG9saWN5IEVuZ2luZSkgaWYgd2UgbmVlZCB0aGUgc2FuZGJveCBhbmQgY2hlY2sgaWYgdGhlIFNhbmRib3ggRmFjdG9yeSBoYXZlIHRoZSBjb250ZXh0IHNhbmRib3g7XG4gICAgICAgIGxldCBwb2xpY3kgPSB0cnVlO1xuICAgICAgICByZXR1cm4gcG9saWN5O1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKHBvbGljeSkge1xuICAgICAgICAvLyB0aGlzIHdpbGwgcmV0dXJuIHRoZSBzYW5kYm94IG9yIG9uZSBwcm9taXNlIHRvIGdldFNhbmRib3g7XG4gICAgICAgIHJldHVybiBfdGhpcy5yZWdpc3RyeS5nZXRTYW5kYm94KGRvbWFpbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oc3R1YlNhbmRib3gpIHtcblxuICAgICAgICBjb25zb2xlLmluZm8oJzQuIGlmIHRoZSBzYW5kYm94IGlzIHJlZ2lzdGVyZWQgdGhlbiByZXR1cm4gdGhlIHNhbmRib3gnLCBzdHViU2FuZGJveCk7XG5cbiAgICAgICAgLy8gd2UgaGF2ZSBjb21wbGV0ZWQgc3RlcCB4eHggaHR0cHM6Ly9naXRodWIuY29tL3JlVEhJTkstcHJvamVjdC9jb3JlLWZyYW1ld29yay9ibG9iL21hc3Rlci9kb2NzL3NwZWNzL3J1bnRpbWUvZHluYW1pYy12aWV3L2Jhc2ljcy9kZXBsb3ktcHJvdG9zdHViLm1kXG5cbiAgICAgICAgX3N0dWJTYW5kYm94ID0gc3R1YlNhbmRib3g7XG4gICAgICAgIHJldHVybiBzdHViU2FuZGJveDtcbiAgICAgIH0sIGZ1bmN0aW9uKHJlYXNvbikge1xuICAgICAgICBjb25zb2xlLmluZm8oJzUuIFNhbmRib3ggd2FzIG5vdCBmb3VuZCwgY3JlYXRpbmcgYSBuZXcgb25lJyk7XG5cbiAgICAgICAgLy8gY2hlY2sgaWYgdGhlIHNhbmRib3ggaXMgcmVnaXN0ZWQgZm9yIHRoaXMgc3R1YiBkZXNjcmlwdG9yIHVybDtcbiAgICAgICAgLy8gTWFrZSBTdGVwcyB4eHggLS0tIHh4eFxuICAgICAgICAvLyBJbnN0YW50aWF0ZSB0aGUgU2FuZGJveFxuICAgICAgICBsZXQgc2FuZGJveCA9IF90aGlzLnNhbmRib3hGYWN0b3J5LmNyZWF0ZVNhbmRib3goKTtcbiAgICAgICAgc2FuZGJveC5hZGRMaXN0ZW5lcignKicsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgIF90aGlzLm1lc3NhZ2VCdXMucG9zdE1lc3NhZ2UobXNnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNhbmRib3g7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24oc2FuZGJveCkge1xuICAgICAgICBjb25zb2xlLmluZm8oJzYuIHJldHVybiB0aGUgc2FuZGJveCBpbnN0YW5jZSBhbmQgdGhlIHJlZ2lzdGVyJywgc2FuZGJveCk7XG5cbiAgICAgICAgX3N0dWJTYW5kYm94ID0gc2FuZGJveDtcblxuICAgICAgICAvLyB3ZSBuZWVkIHJlZ2lzdGVyIHN0dWIgb24gcmVnaXN0cnkgLSBzdGVwIHh4eCBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1wcm90b3N0dWIubWRcbiAgICAgICAgcmV0dXJuIF90aGlzLnJlZ2lzdHJ5LnJlZ2lzdGVyU3R1Yihfc3R1YlNhbmRib3gsIGRvbWFpbik7XG4gICAgICB9KVxuICAgICAgLnRoZW4oZnVuY3Rpb24ocnVudGltZVByb3RvU3R1YlVSTCkge1xuXG4gICAgICAgIGNvbnNvbGUuaW5mbygnNy4gcmV0dXJuIHRoZSBydW50aW1lIHByb3Rvc3R1YiB1cmw6ICcsIHJ1bnRpbWVQcm90b1N0dWJVUkwpO1xuXG4gICAgICAgIC8vIHdlIGhhdmUgY29tcGxldGVkIHN0ZXAgeHh4IGh0dHBzOi8vZ2l0aHViLmNvbS9yZVRISU5LLXByb2plY3QvY29yZS1mcmFtZXdvcmsvYmxvYi9tYXN0ZXIvZG9jcy9zcGVjcy9ydW50aW1lL2R5bmFtaWMtdmlldy9iYXNpY3MvZGVwbG95LXByb3Rvc3R1Yi5tZFxuXG4gICAgICAgIF9ydW50aW1lUHJvdG9TdHViVVJMID0gcnVudGltZVByb3RvU3R1YlVSTDtcblxuICAgICAgICAvLyBFeHRlbmQgb3JpZ2luYWwgaHlwZXJ0eSBjb25maWd1cmF0aW9uO1xuICAgICAgICBsZXQgY29uZmlndXJhdGlvbiA9IE9iamVjdC5hc3NpZ24oe30sIF9zdHViRGVzY3JpcHRvci5jb25maWd1cmF0aW9uKTtcbiAgICAgICAgY29uZmlndXJhdGlvbi5ydW50aW1lVVJMID0gX3RoaXMucnVudGltZVVSTDtcblxuICAgICAgICBjb25zb2xlLmxvZyhfc3R1YlNvdXJjZVBhY2thZ2UpO1xuXG4gICAgICAgIC8vIERlcGxveSBDb21wb25lbnQgc3RlcCB4eHhcbiAgICAgICAgcmV0dXJuIF9zdHViU2FuZGJveC5kZXBsb3lDb21wb25lbnQoX3N0dWJTb3VyY2VQYWNrYWdlLnNvdXJjZUNvZGUsIHJ1bnRpbWVQcm90b1N0dWJVUkwsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKGZ1bmN0aW9uKGRlcGxveUNvbXBvbmVudFN0YXR1cykge1xuICAgICAgICBjb25zb2xlLmluZm8oJzg6IHJldHVybiBkZXBsb3kgY29tcG9uZW50IGZvciBzYW5kYm94IHN0YXR1czogJywgZGVwbG95Q29tcG9uZW50U3RhdHVzKTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIHh4eCBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1wcm90b3N0dWIubWRcblxuICAgICAgICAvLyBBZGQgdGhlIG1lc3NhZ2UgYnVzIGxpc3RlbmVyXG4gICAgICAgIF90aGlzLm1lc3NhZ2VCdXMuYWRkTGlzdGVuZXIoX3J1bnRpbWVQcm90b1N0dWJVUkwsIGZ1bmN0aW9uKG1zZykge1xuICAgICAgICAgIF9zdHViU2FuZGJveC5wb3N0TWVzc2FnZShtc2cpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyB3ZSBoYXZlIGNvbXBsZXRlZCBzdGVwIHh4eCBodHRwczovL2dpdGh1Yi5jb20vcmVUSElOSy1wcm9qZWN0L2NvcmUtZnJhbWV3b3JrL2Jsb2IvbWFzdGVyL2RvY3Mvc3BlY3MvcnVudGltZS9keW5hbWljLXZpZXcvYmFzaWNzL2RlcGxveS1wcm90b3N0dWIubWRcblxuICAgICAgICAvLyBMb2FkIFN0dWIgZnVuY3Rpb24gcmVzb2x2ZWQgd2l0aCBzdWNjZXNzO1xuICAgICAgICBsZXQgc3R1YiA9IHtcbiAgICAgICAgICBydW50aW1lUHJvdG9TdHViVVJMOiBfcnVudGltZVByb3RvU3R1YlVSTCxcbiAgICAgICAgICBzdGF0dXM6IGRlcGxveUNvbXBvbmVudFN0YXR1c1xuICAgICAgICB9O1xuXG4gICAgICAgIHJlc29sdmUoc3R1Yik7XG4gICAgICAgIGNvbnNvbGUuaW5mbygnLS0tLS0tLS0tLS0tLS0tLS0tLSBFTkQgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXFxuJyk7XG5cbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyb3JSZWFzb24pO1xuXG4gICAgfSk7XG5cbiAgfVxuXG4gIC8qKlxuICAqIFVzZWQgdG8gY2hlY2sgZm9yIHVwZGF0ZXMgYWJvdXQgY29tcG9uZW50cyBoYW5kbGVkIGluIHRoZSBDYXRhbG9ndWUgaW5jbHVkaW5nIHByb3RvY29sIHN0dWJzIGFuZCBIeXBlcnRpZXMuIGNoZWNrIHJlbGF0aW9uc2hpcCB3aXRoIGxpZmVjeWNsZSBtYW5hZ2VtZW50IHByb3ZpZGVkIGJ5IFNlcnZpY2UgV29ya2Vyc1xuICAqIEBwYXJhbSAge0NhdGFsb2d1ZVVSTH0gICAgICAgdXJsIHVybFxuICAqL1xuICBjaGVja0ZvclVwZGF0ZSh1cmwpIHtcbiAgICAvLyBCb2R5Li4uXG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSdW50aW1lVUE7XG4iLCJjbGFzcyBPYmplY3RBbGxvY2F0aW9uIHtcbiAgLyogcHJpdmF0ZVxuICBfdXJsOiBVUkxcbiAgX2J1czogTWluaUJ1c1xuICAqL1xuXG4gIC8qKlxuICAgKiBDcmVhdGUgYW4gT2JqZWN0IEFsbG9jYXRpb25cbiAgICogQHBhcmFtICB7VVJMLlVSTH0gICAgICB1cmwgLSB1cmwgZnJvbSB3aG8gaXMgc2VuZGluZyB0aGUgbWVzc2FnZVxuICAgKiBAcGFyYW0gIHtNaW5pQnVzfSAgICAgIGJ1cyAtIE1pbmlCdXMgdXNlZCBmb3IgYWRkcmVzcyBhbGxvY2F0aW9uXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih1cmwsIGJ1cykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG5cbiAgICBfdGhpcy5fdXJsID0gdXJsO1xuICAgIF90aGlzLl9idXMgPSBidXM7XG4gIH1cblxuICAvKipcbiAgICogZ2V0IHRoZSBVUkwgdmFsdWVcbiAgICogQHJldHVybiB7c3RyaW5nfSBUaGUgdXJsIHZhbHVlO1xuICAgKi9cbiAgZ2V0IHVybCgpIHsgcmV0dXJuIHRoaXMuX3VybDsgfVxuXG4gIC8qKlxuICAgKiBBc2sgZm9yIGNyZWF0aW9uIG9mIGEgbnVtYmVyIG9mIE9iamVjdCBhZGRyZXNzZXMsIHRvIHRoZSBkb21haW4gbWVzc2FnZSBub2RlLlxuICAgKiBAcGFyYW0gIHtEb21haW59IGRvbWFpbiAtIERvbWFpbiBvZiB0aGUgbWVzc2FnZSBub2RlLlxuICAgKiBAcGFyYW0gIHtudW1iZXJ9IG51bWJlciAtIE51bWJlciBvZiBhZGRyZXNzZXMgdG8gcmVxdWVzdFxuICAgKiBAcmV0dXJucyB7UHJvbWlzZTxPYmplY3RVUkw+fSAgQSBsaXN0IG9mIE9iamVjdFVSTCdzXG4gICAqL1xuICBjcmVhdGUoZG9tYWluLCBudW1iZXIpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuXG4gICAgbGV0IG1zZyA9IHtcbiAgICAgIHR5cGU6ICdjcmVhdGUnLCBmcm9tOiBfdGhpcy5fdXJsLCB0bzogJ2RvbWFpbjovL21zZy1ub2RlLicgKyBkb21haW4gKyAnL29iamVjdC1hZGRyZXNzLWFsbG9jYXRpb24nLFxuICAgICAgYm9keTogeyBudW1iZXI6IG51bWJlciB9XG4gICAgfTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKG1zZywgKHJlcGx5KSA9PiB7XG4gICAgICAgIGlmIChyZXBseS5ib2R5LmNvZGUgPT09IDIwMCkge1xuICAgICAgICAgIHJlc29sdmUocmVwbHkuYm9keS5hbGxvY2F0ZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlamVjdChyZXBseS5ib2R5LmRlc2MpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBPYmplY3RBbGxvY2F0aW9uO1xuIiwiaW1wb3J0IHtkaXZpZGVVUkwsIGRlZXBDbG9uZX0gZnJvbSAnLi4vdXRpbHMvdXRpbHMnO1xuaW1wb3J0IE9iamVjdEFsbG9jYXRpb24gZnJvbSAnLi9PYmplY3RBbGxvY2F0aW9uJztcblxuLyoqXG4gKiBAYXV0aG9yIG1pY2FlbHBlZHJvc2FAZ21haWwuY29tXG4gKiBDb3JlIFN5bmNyb25pemF0aW9uIHN5c3RlbS5cbiAqL1xuY2xhc3MgU3luY2hlck1hbmFnZXIge1xuICAvKiBwcml2YXRlXG4gIF91cmw6IFVSTFxuICBfYnVzOiBNaW5pQnVzXG4gIF9yZWdpc3RyeTogUmVnaXN0cnlcbiAgX2FsbG9jYXRvcjogT2JqZWN0QWxsb2NhdGlvblxuXG4gIF9zdWJzY3JpcHRpb25zOiB7IE9iamVjdFVSTDogeyBvd25lcjogSHlwZXJ0eVVSTCwgc2NoZW1hOiBTY2hlbWEsIHNsOiBNc2dMaXN0ZW5lciwgY2w6IE1zZ0xpc3RlbmVyLCBzdWJzOiBbSHlwZXJ0eVVSTF0gfSB9XG4gICovXG5cbiAgY29uc3RydWN0b3IocnVudGltZVVSTCwgYnVzLCByZWdpc3RyeSwgYWxsb2NhdG9yKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vVE9ETzogdGhpcyBzaG91bGQgbm90IGJlIGhhcmRjb2RlZCFcbiAgICBfdGhpcy5fZG9tYWluID0gJ3VhLnB0JztcblxuICAgIF90aGlzLl9idXMgPSBidXM7XG4gICAgX3RoaXMuX3JlZ2lzdHJ5ID0gcmVnaXN0cnk7XG5cbiAgICAvL1RPRE86IHRoZXNlIHNob3VsZCBiZSBzYXZlZCBpbiBwZXJzaXN0ZW5jZSBlbmdpbmU/XG4gICAgX3RoaXMuX3VybCA9IHJ1bnRpbWVVUkwgKyAnL3NtJztcbiAgICBfdGhpcy5fb2JqZWN0VVJMID0gcnVudGltZVVSTCArICcvb2JqZWN0LWFsbG9jYXRpb24nO1xuICAgIF90aGlzLl9zdWJzY3JpcHRpb25zID0ge307XG5cbiAgICBpZiAoYWxsb2NhdG9yKSB7XG4gICAgICBfdGhpcy5fYWxsb2NhdG9yID0gYWxsb2NhdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICBfdGhpcy5fYWxsb2NhdG9yID0gbmV3IE9iamVjdEFsbG9jYXRpb24oX3RoaXMuX29iamVjdFVSTCwgYnVzKTtcbiAgICB9XG5cbiAgICBidXMuYWRkTGlzdGVuZXIoX3RoaXMuX3VybCwgKG1zZykgPT4ge1xuICAgICAgY29uc29sZS5sb2coJ1N5bmNoZXJNYW5hZ2VyLVJDVjogJywgbXNnKTtcbiAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgY2FzZSAnY3JlYXRlJzogX3RoaXMuX29uQ3JlYXRlKG1zZyk7IGJyZWFrO1xuICAgICAgICBjYXNlICdkZWxldGUnOiBfdGhpcy5fb25EZWxldGUobXNnKTsgYnJlYWs7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBnZXQgdXJsKCkgeyByZXR1cm4gdGhpcy5fdXJsOyB9XG5cbiAgX29uQ3JlYXRlKG1zZykge1xuICAgIGxldCBfdGhpcyA9IHRoaXM7XG4gICAgbGV0IG93bmVyID0gbXNnLmZyb207XG5cbiAgICAvL1RPRE86IDUtNyBhdXRob3JpemVPYmplY3RDcmVhdGlvbihvd25lciwgb2JqID8/Pz8gKVxuICAgIC8vVE9ETzogb3RoZXIgb3B0aW9uYWwgc3RlcHNcblxuICAgIF90aGlzLl9hbGxvY2F0b3IuY3JlYXRlKF90aGlzLl9kb21haW4sIDEpLnRoZW4oKGFsbG9jYXRlZCkgPT4ge1xuICAgICAgLy9UT0RPOiBnZXQgYWRkcmVzcyBmcm9tIGFkZHJlc3MgYWxsb2NhdG9yID9cbiAgICAgIGxldCBvYmpVUkwgPSBhbGxvY2F0ZWRbMF07XG4gICAgICBsZXQgb2JqU3Vic2NyaXB0b3JVUkwgPSBvYmpVUkwgKyAnL3N1YnNjcmlwdGlvbic7XG5cbiAgICAgIC8vVE9ETzogcmVnaXN0ZXIgb2JqZWN0VVJMIHNvIHRoYXQgaXQgY2FuIGJlIGRpc2NvdmVyZWQgaW4gdGhlIG5ldHdvcmtcblxuICAgICAgLy9yZWdpc3RlciBjaGFuZ2UgbGlzdGVuZXJcbiAgICAgIGxldCBjaGFuZ2VMaXN0ZW5lciA9IF90aGlzLl9idXMuYWRkTGlzdGVuZXIob2JqVVJMLCAobXNnKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG9ialVSTCArICctUkNWOiAnLCBtc2cpO1xuICAgICAgICBfdGhpcy5fc3Vic2NyaXB0aW9uc1tvYmpVUkxdLnN1YnMuZm9yRWFjaCgoaHlwZXJ0eVVybCkgPT4ge1xuICAgICAgICAgIGxldCBjaGFuZ2VNc2cgPSBkZWVwQ2xvbmUobXNnKTtcbiAgICAgICAgICBjaGFuZ2VNc2cuaWQgPSAwO1xuICAgICAgICAgIGNoYW5nZU1zZy5mcm9tID0gb2JqVVJMO1xuICAgICAgICAgIGNoYW5nZU1zZy50byA9IGh5cGVydHlVcmw7XG5cbiAgICAgICAgICAvL2ZvcndhcmQgdG8gaHlwZXJ0eSBvYnNlcnZlclxuICAgICAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2UoY2hhbmdlTXNnKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgLy8xNS4gYWRkIHN1YnNjcmlwdGlvbiBsaXN0ZW5lclxuICAgICAgbGV0IHN1YnNjcmlwdG9yTGlzdGVuZXIgPSBfdGhpcy5fYnVzLmFkZExpc3RlbmVyKG9ialN1YnNjcmlwdG9yVVJMLCAobXNnKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKG9ialN1YnNjcmlwdG9yVVJMICsgJy1SQ1Y6ICcsIG1zZyk7XG4gICAgICAgIHN3aXRjaCAobXNnLnR5cGUpIHtcbiAgICAgICAgICBjYXNlICdzdWJzY3JpYmUnOiBfdGhpcy5fb25TdWJzY3JpYmUob2JqVVJMLCBtc2cpOyBicmVhaztcbiAgICAgICAgICBjYXNlICd1bnN1YnNjcmliZSc6IF90aGlzLl9vblVuU3Vic2NyaWJlKG9ialVSTCwgbXNnKTsgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBfdGhpcy5fc3Vic2NyaXB0aW9uc1tvYmpVUkxdID0geyBvd25lcjogb3duZXIsIHNsOiBzdWJzY3JpcHRvckxpc3RlbmVyLCBjbDogY2hhbmdlTGlzdGVuZXIsIHN1YnM6IFtdIH07XG5cbiAgICAgIC8vYWxsIG9rLCBzZW5kIHJlc3BvbnNlXG4gICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogbXNnLnRvLCB0bzogb3duZXIsXG4gICAgICAgIGJvZHk6IHsgY29kZTogMjAwLCByZXNvdXJjZTogb2JqVVJMIH1cbiAgICAgIH0pO1xuXG4gICAgICAvLzE5LiBzZW5kIGNyZWF0ZSB0byBhbGwgb2JzZXJ2ZXJzLCByZXNwb25zZXMgd2lsbCBiZSBkZWxpdmVyIHRvIHRoZSBIeXBlcnR5IG93bmVyP1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vc2NoZWR1bGUgZm9yIG5leHQgY3ljbGUgbmVlZGVkLCBiZWNhdXNlIHRoZSBSZXBvcnRlciBzaG91bGQgYmUgYXZhaWxhYmxlLlxuICAgICAgICBtc2cuYm9keS5hdXRob3Jpc2UuZm9yRWFjaCgoaHlwZXJ0eVVSTCkgPT4ge1xuICAgICAgICAgIF90aGlzLl9idXMucG9zdE1lc3NhZ2Uoe1xuICAgICAgICAgICAgdHlwZTogJ2NyZWF0ZScsIGZyb206IG93bmVyLCB0bzogaHlwZXJ0eVVSTCxcbiAgICAgICAgICAgIGJvZHk6IHsgc2NoZW1hOiBtc2cuYm9keS5zY2hlbWEsIHJlc291cmNlOiBvYmpVUkwsIHZhbHVlOiBtc2cuYm9keS52YWx1ZSB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG5cbiAgICB9KS5jYXRjaCgocmVhc29uKSA9PiB7XG4gICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgaWQ6IG1zZy5pZCwgdHlwZTogJ3Jlc3BvbnNlJywgZnJvbTogbXNnLnRvLCB0bzogb3duZXIsXG4gICAgICAgIGJvZHk6IHsgY29kZTogNTAwLCBkZXNjOiByZWFzb24gfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBfb25EZWxldGUobXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIC8vVE9ETzogd2hlcmUgdG8gZ2V0IG9iamVjdFVSTCA/XG4gICAgbGV0IG9ialVSTCA9ICc8b2JqVVJMPic7XG5cbiAgICAvL2Rlc3Ryb3kgYWxsIG9ialVSTCBsaXN0ZW5lcnNcbiAgICBkZWxldGUgX3RoaXMuX3N1YnNjcmlwdGlvbnNbb2JqVVJMXTtcbiAgICBfdGhpcy5fYnVzLnJlbW92ZUFsbExpc3RlbmVyc09mKG9ialVSTCk7XG4gICAgX3RoaXMuX2J1cy5yZW1vdmVBbGxMaXN0ZW5lcnNPZihvYmpVUkwgKyAnL3N1YnNjcmlwdGlvbicpO1xuXG4gICAgLy9UT0RPOiBkZXN0cm95IG9iamVjdCBpbiB0aGUgcmVnaXN0cnk/XG4gIH1cblxuICBfb25TdWJzY3JpYmUob2JqVVJMLCBtc2cpIHtcbiAgICBsZXQgX3RoaXMgPSB0aGlzO1xuICAgIGxldCBoeXBlcnR5VXJsID0gbXNnLmZyb207XG5cbiAgICBsZXQgc3Vic2NyaXB0aW9uID0gX3RoaXMuX3N1YnNjcmlwdGlvbnNbb2JqVVJMXTtcblxuICAgIC8vMjcuIHZhbGlkYXRlIGlmIHN1YnNjcmlwdGlvbiBhbHJlYWR5IGV4aXN0cz9cbiAgICBpZiAoc3Vic2NyaXB0aW9uW2h5cGVydHlVcmxdKSB7XG4gICAgICBsZXQgZXJyb3JNc2cgPSB7XG4gICAgICAgIGlkOiBtc2cuaWQsIHR5cGU6ICdyZXNwb25zZScsIGZyb206IG1zZy50bywgdG86IGh5cGVydHlVcmwsXG4gICAgICAgIGJvZHk6IHtjb2RlOiA1MDAsIGRlc2M6ICdTdWJzY3JpcHRpb24gZm9yICgnICsgb2JqVVJMICsgJyA6ICcgKyAgaHlwZXJ0eVVybCArICcpIGFscmVhZHkgZXhpc3RzISd9XG4gICAgICB9O1xuXG4gICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKGVycm9yTXNnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLzMxLiBhc2sgdG8gc3Vic2NyaWJlIHRvIFN5bmNoZXI/IChkZXBlbmRzIG9uIHRoZSBvcGVyYXRpb24gbW9kZSlcbiAgICAvL1RPRE86IGdldCBtb2RlIGZyb20gb2JqZWN0IVxuICAgIGxldCBtb2RlID0gJ3N1Yi9wdWInO1xuXG4gICAgaWYgKG1vZGUgPT09ICdzdWIvcHViJykge1xuICAgICAgLy9mb3J3YXJkIHRvIEh5cGVydHkgb3duZXJcbiAgICAgIGxldCBmb3J3YXJkTXNnID0ge1xuICAgICAgICB0eXBlOiAnZm9yd2FyZCcsIGZyb206IF90aGlzLl91cmwsIHRvOiBzdWJzY3JpcHRpb24ub3duZXIsXG4gICAgICAgIGJvZHk6IHsgdHlwZTogbXNnLnR5cGUsIGZyb206IG1zZy5mcm9tLCB0bzogb2JqVVJMIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtc2cuYm9keSkge1xuICAgICAgICBmb3J3YXJkTXNnLmJvZHkuYm9keSA9IG1zZy5ib2R5O1xuICAgICAgfVxuXG4gICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKGZvcndhcmRNc2csIChyZXBseSkgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZygnZm9yd2FyZC1yZXBseTogJywgcmVwbHkpO1xuICAgICAgICBpZiAocmVwbHkuYm9keS5jb2RlID09PSAyMDApIHtcbiAgICAgICAgICAvL3N1YnNjcmlwdGlvbiBhY2NlcHRlZFxuICAgICAgICAgIF90aGlzLl9zdWJzY3JpcHRpb25zW29ialVSTF0uc3Vicy5wdXNoKGh5cGVydHlVcmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy9zZW5kIHN1YnNjcmliZS1yZXNwb25zZVxuICAgICAgICBfdGhpcy5fYnVzLnBvc3RNZXNzYWdlKHtcbiAgICAgICAgICBpZDogbXNnLmlkLCB0eXBlOiAncmVzcG9uc2UnLCBmcm9tOiBtc2cudG8sIHRvOiBoeXBlcnR5VXJsLFxuICAgICAgICAgIGJvZHk6IHJlcGx5LmJvZHlcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgfVxuXG4gIF9vblVuU3Vic2NyaWJlKG9ialVSTCwgbXNnKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBsZXQgaHlwZXJ0eVVybCA9IG1zZy5mcm9tO1xuXG4gICAgbGV0IHN1YnMgPSBfdGhpcy5fc3Vic2NyaXB0aW9uc1tvYmpVUkxdLnN1YnM7XG4gICAgbGV0IGluZGV4ID0gc3Vicy5pbmRleE9mKGh5cGVydHlVcmwpO1xuICAgIHN1YnMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgIC8vVE9ETzogc2VuZCB1bi1zdWJzY3JpYmUgbWVzc2FnZSB0byBTeW5jaGVyPyAoZGVwZW5kcyBvbiB0aGUgb3BlcmF0aW9uIG1vZGUpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3luY2hlck1hbmFnZXI7XG4iLCIvKipcbiAqIEV2ZW50RW1pdHRlclxuICogQWxsIGNsYXNzZXMgd2hpY2ggZXh0ZW5kcyB0aGlzLCBjYW4gaGF2ZSBhZGRFdmVudExpc3RlbmVyIGFuZCB0cmlnZ2VyIGV2ZW50cztcbiAqL1xuY2xhc3MgRXZlbnRFbWl0dGVyIHtcblxuICAvKipcbiAgICogYWRkRXZlbnRMaXN0ZW5lciBsaXN0ZW4gZm9yIGFuIGV2ZW50VHlwZVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9ICAgICAgICAgZXZlbnRUeXBlIC0gbGlzdGVuaW5nIGZvciB0aGlzIHR5cGUgb2YgZXZlbnRcbiAgICogQHBhcmFtICB7RnVuY3Rpb259ICAgICAgIGNiICAgICAgICAtIGNhbGxiYWNrIGZ1bmN0aW9uIHdpbGwgYmUgZXhlY3V0ZWQgd2hlbiB0aGUgZXZlbnQgaXQgaXMgaW52b2tlZFxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudFR5cGUsIGNiKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcbiAgICBfdGhpc1tldmVudFR5cGVdID0gY2I7XG4gIH1cblxuICAvKipcbiAgICogSW52b2tlIHRoZSBldmVudFR5cGVcbiAgICogQHBhcmFtICB7c3RyaW5nfSBldmVudFR5cGUgLSBldmVudCB3aWxsIGJlIGludm9rZWRcbiAgICogQHBhcmFtICB7b2JqZWN0fSBwYXJhbXMgLSBwYXJhbWV0ZXJzIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBhZGRFdmVudExpc3RlbmVyXG4gICAqL1xuICB0cmlnZ2VyKGV2ZW50VHlwZSwgcGFyYW1zKSB7XG4gICAgbGV0IF90aGlzID0gdGhpcztcblxuICAgIGlmIChfdGhpc1tldmVudFR5cGVdKSB7XG4gICAgICBfdGhpc1tldmVudFR5cGVdKHBhcmFtcyk7XG4gICAgfVxuICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXZlbnRFbWl0dGVyO1xuIiwiLyoqXG4gKiBTdXBwb3J0IG1vZHVsZSB3aXRoIHNvbWUgZnVuY3Rpb25zIHdpbGwgYmUgdXNlZnVsXG4gKiBAbW9kdWxlIHV0aWxzXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiBkaXZpZGVVUkxcbiAqIEB0eXBlIE9iamVjdFxuICogQHByb3BlcnR5IHtzdHJpbmd9IHR5cGUgVGhlIHR5cGUgb2YgVVJMXG4gKiBAcHJvcGVydHkge3N0cmluZ30gZG9tYWluIFRoZSBkb21haW4gb2YgVVJMXG4gKiBAcHJvcGVydHkge3N0cmluZ30gaWRlbnRpdHkgVGhlIGlkZW50aXR5IG9mIFVSTFxuICovXG5cbi8qKlxuICogRGl2aWRlIGFuIHVybCBpbiB0eXBlLCBkb21haW4gYW5kIGlkZW50aXR5XG4gKiBAcGFyYW0gIHtVUkwuVVJMfSB1cmwgLSB1cmwgYWRkcmVzc1xuICogQHJldHVybiB7ZGl2aWRlVVJMfSB0aGUgcmVzdWx0IG9mIGRpdmlkZVVSTFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGl2aWRlVVJMKHVybCkge1xuXG4gIC8vIGxldCByZSA9IC8oW2EtekEtWi1dKik/OlxcL1xcLyg/OlxcLik/KFstYS16QS1aMC05QDolLl9cXCt+Iz1dezIsMjU2fVxcLlthLXpdezIsNn1cXGIpKihcXC9bXFwvXFxkXFx3XFwuLV0qKSooPzpbXFw/XSkqKC4rKSovZ2k7XG4gIGxldCByZSA9IC8oW2EtekEtWi1dKik6XFwvXFwvKD86XFwuKT8oWy1hLXpBLVowLTlAOiUuX1xcK34jPV17MiwyNTZ9KShbLWEtekEtWjAtOUA6JS5fXFwrfiM9XFwvXSopL2dpO1xuICBsZXQgc3Vic3QgPSAnJDEsJDIsJDMnO1xuICBsZXQgcGFydHMgPSB1cmwucmVwbGFjZShyZSwgc3Vic3QpLnNwbGl0KCcsJyk7XG4gIGxldCByZXN1bHQgPSB7XG4gICAgdHlwZTogcGFydHNbMF0sXG4gICAgZG9tYWluOiBwYXJ0c1sxXSxcbiAgICBpZGVudGl0eTogcGFydHNbMl1cbiAgfTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIE1ha2UgYSBDT1BZIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG4gKiBAcGFyYW0gIHtPYmplY3R9ICBvYmogLSBvYmplY3QgdG8gYmUgY2xvbmVkXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWVwQ2xvbmUob2JqKSB7XG4gIC8vVE9ETzogc2ltcGxlIGJ1dCBpbmVmZmljaWVudCBKU09OIGRlZXAgY2xvbmUuLi5cbiAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSk7XG59XG4iXX0=
