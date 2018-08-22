"use strict";
/*global describe */
/*global it */
/*
const assert = require("assert");
const fs = require("fs");
const URL = require("../lib/url").createURLConstructor();

function testAll(testurl) {
    return function () {
	let url;

	try {
	    url = new URL(testurl.input, testurl.base);
	    assert.equal(url.protocol , testurl.output.protocol, "\n\tGiven: *" + url.protocol  +"* \n\tTesturl.output.protocol: *"+testurl.output.protocol+"*");
	    assert.equal(url.origin , testurl.output.origin, "\n\tGiven: " + url.origin  +   " \n\tTesturl.Output.origin: "+testurl.output.origin);
	    assert.equal(url.hostname , testurl.output.hostname, "\n\tGiven: " + url.hostname  +   " \n\tTesturl.Output.hostname: "+testurl.output.hostname);
	    assert.equal(url.host , testurl.output.host, "\n\tGiven: " + url.host  +   " \n\tTesturl.Output.host: "+testurl.output.host);
	    assert.equal(url.port , testurl.output.port, "\n\tGiven: " + url.port  +   " \n\tTesturl.Output.port: "+testurl.output.port);
	    assert.equal(url.path , testurl.output.path, "\n\tGiven: " + url.path  +   " \n\tTesturl.Output.path: "+testurl.output.path);
	    assert.equal(url.search , testurl.output.search, "\n\tGiven: " + url.search  +   " \n\tTesturl.Output.search: "+testurl.output.search);
	    assert.equal(url.hash , testurl.output.hash, "\n\tGiven: " + url.hash  +   " \n\tTesturl.Output.hash: "+testurl.output.hash);
	    assert.equal(url.href , testurl.output.href, "\n\tGiven: " + url.href  +   " \n\tTesturl.Output.href: "+testurl.output.href);


	} catch (e) {
	    if (e instanceof TypeError && expected.error === TypeError) {
	    } else {
		throw e;
	    }
	}
	
    }
}

function testOrigin(expected) {
    return function () {
	let url;

	try {
	    url = new URL(expected.input, expected.base);

	    assert.equal(url.origin, expected.origin, "\n\tGiven: " + url.origin  +   " \n\tExpected: "+expected.origin);
	} catch (e) {
	    if (e instanceof TypeError && expected.error === TypeError) {
	    } else {
		throw e;
	    }
	}

    };
}


function testURL(expected) {
  return function () {
      let url;
      try {
	  url = new URL(expected.input, expected.base);
	  console.warn("Protocol: " + url.protocol)
	  console.warn("Origin: " + url.origin)
	  console.warn("Hostname: " + url.hostname)
	  console.warn("Host: " + url.host)
	  console.warn("Port: " + url.port)
	  console.warn("Path: " + url.path)
	  console.warn("Search: " + url.search)
	  console.warn("Hash: " + url.hash)
	  console.warn("Href: " + url.href)	  

      } catch (e) {
	  if (e instanceof TypeError && expected.protocol === ":") {
	      console.error("TypeError...");
              return;
	  }
	  throw e;
      }

      console.warn("parsing...");
      if (expected.protocol === ":" && url.protocol !== ":") {
	  assert.fail(url.href, "", "Expected URL to fail parsing, got " + url.href);
      }
  };
}

describe("Full tests:", function () {
    let urls = []
    let url = {}

    url={
	input:"hyperty-runtime-esn://domain.com/12345",
	output: {
	    protocol: "hyperty-runtime-esn:",
	    origin: "hyperty-runtime-esn://domain.com",
	    hostname: "domain.com",
	    host: "domain.com",
	    port: "",
	    path: undefined,
	    search: "", 
	    hash:"", 
	    href: "hyperty-runtime-esn://domain.com/12345"
	}
    }

    urls.push(url)

    url={
    	input:"hyperty-runtime-esn://domain.com/12345#textafterhash",
    	output: {
	    protocol: "hyperty-runtime-esn:",
	    origin: "hyperty-runtime-esn://domain.com",
	    hostname: "domain.com",
	    host: "domain.com",
	    port: "",
	    path: undefined,
	    search: "", 
	    hash:"#textafterhash", 
	    href: "hyperty-runtime-esn://domain.com/12345#textafterhash"
    	}
    }
    urls.push(url)

    url={
    	input:"hyperty-runtime-esn://domain.com/12345?a=1&b=2&c=3",
    	output: {
	    protocol: "hyperty-runtime-esn:",
	    origin: "hyperty-runtime-esn://domain.com",
	    hostname: "domain.com",
	    host: "domain.com",
	    port: "",
	    path: undefined,
	    search: "?a=1&b=2&c=3", 
	    hash:"", 
	    href: "hyperty-runtime-esn://domain.com/12345?a=1&b=2&c=3"
    	}
    }
    urls.push(url)

    // url={
    // 	input:"hyperty-runtime-esn://domain.com/12345#hash?a=1&b=2&c=3",
    // 	output: {
    // 	    protocol: "hyperty-runtime-esn:",
    // 	    origin: "hyperty-runtime-esn://domain.com",
    // 	    hostname: "domain.com",
    // 	    host: "domain.com",
    // 	    port: "",
    // 	    path: undefined,
    // 	    search: "?a=1&b=2&c=3", 
    // 	    hash:"", 
    // 	    href: "hyperty-runtime-esn://domain.com/12345"
    // 	}
    // }
    // urls.push(url)


    for (let i=0; i<urls.length; i++) {
	it(urls[i].input+": ", testAll(urls[i]))
    }

})



describe("Tests to check 'origin':", function () {
    let urls = []
    urls.push({input:"blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f", origin:"https://whatwg.org:443"})

    // special scheme without port
    urls.push({input:"wss://rethink.org/", origin:"wss://rethink.org"})

    // special scheme with default port
    urls.push({input:"wss://rethink.org:443/", origin:"wss://rethink.org"})

    // special scheme without port
    urls.push({input:"ws://rethink.org/", origin:"ws://rethink.org"})

    // special scheme with different port
    urls.push({input:"wss://rethink.org:2345", origin:"wss://rethink.org:2345"})

    // special scheme with different port
    urls.push({input:"ws://rethink.org:1000", origin:"ws://rethink.org:1000"})

    // special scheme with same port as default one
    urls.push({input:"wss://rethink.org:443", origin:"wss://rethink.org"})

    urls.push({input:"newschema://rethink.org", origin:"null"})

    urls.push({input:"wss://rethink.org#section", origin:"wss://rethink.org"})

    urls.push({input:"wss://rethink.org/section1/section2", origin:"wss://rethink.org"})

    urls.push({input:"wss://something", origin:"wss://something"})
    urls.push({input:"wss://a.b.c.d.e", origin:"wss://a.b.c.d.e"})

    // Invalid URLs
    urls.push({input:"wss://", error:TypeError})
    urls.push({input:"://rethink.org", error:TypeError})
    urls.push({input:"<some garbage>", error:TypeError})

    // Valid URLs with IPv4
    urls.push({input:"wss://127.0.0.1", origin:"wss://127.0.0.1"})

    // Invalid URLs with IPs v4
    urls.push({input:"wss://127.0.0.300", error:TypeError})
    urls.push({input:"wss://127.0.0", error:TypeError})
    urls.push({input:"wss://127.0.0.1.2", error:TypeError})
    urls.push({input:"wss://ABCD:EF01:2345:6789:ABCD:EF01:2345:6789", error:TypeError})

    // reThink URLs
    urls.push({input:"user://twitter.com/pchainho", origin:"user://twitter.com"})
    urls.push({input:"user://cm-lisboa.pt/campo-grande-28-building", origin:"user://cm-lisboa.pt"})
    urls.push({input:"ctxt://myhouse/energy", origin:"ctxt://myhouse"})
    urls.push({input:"comm://telekom.de/sdruesdow-20150802006", origin:"comm://telekom.de"})

    // reThink URls: hypertity runtime
    urls.push({input:"hyperty-runtime://domain.com/12345", origin:"hyperty-runtime://domain.com"})
    urls.push({input:"hyperty-runtime-uuid://domain.com/12345", origin:"hyperty-runtime-uuid://domain.com"})
    urls.push({input:"hyperty-runtime-dev-os://domain.com/12345", origin:"hyperty-runtime-dev-os://domain.com"})
    urls.push({input:"hyperty-runtime-imei://domain.com/12345", origin:"hyperty-runtime-imei://domain.com"})
    urls.push({input:"hyperty-runtime-esn://domain.com/12345", origin:"hyperty-runtime-esn://domain.com"})
    urls.push({input:"hyperty-runtime-meid://domain.com/12345", origin:"hyperty-runtime-meid://domain.com"})
    urls.push({input:"hyperty-runtime-doesnotexist://domain.com/12345", origin:""})
    urls.push({input:"hyperty://meo.pt/123456", origin:"hyperty://meo.pt/123456"})

    for (let i=0; i<urls.length; i++) {
	it(urls[i].input+": ", testOrigin(urls[i]))
    }
}

)

// describe("Hosts", function () {
//     let url = {}
//     url.input="newprotocol://www.google.es";
//     url.expected={}
//     url.expected.protocol="newprotocol:"
//     it("Testing: ", testURL(url))

//     url.input="newprotocol://www.google.es#section";
//     url.expected={}
//     url.expected.protocol="newprotocol:"
//     it("Testing: ", testURL(url))

//     url.input="newprotocol://google.es#section";
//     url.expected={}
//     url.expected.protocol="newprotocol:"
//     it("Testing: ", testURL(url))

//     url.input="newprotocol://google#section";
//     url.expected={}
//     url.expected.protocol="newprotocol:"
//     it("Testing: ", testURL(url))
    
// });
*/