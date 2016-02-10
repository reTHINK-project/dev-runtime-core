<div class="self-detail detail">

AddressAllocation {#addressallocation data-ice="name"}
=================

<div class="description" data-ice="description">

Class will ask to the message node for addresses

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/registry/AddressAllocation.js~AddressAllocation.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(url: <span>URL.URL</span>, bus:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>)</span>

</div>

<div>

<div data-ice="description">

Create an Address Allocation

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[url](../../../class/src/registry/AddressAllocation.js~AddressAllocation.html#instance-get-url)</span></span><span
data-ice="signature">:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

get the URL value

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[create](../../../class/src/registry/AddressAllocation.js~AddressAllocation.html#instance-method-create)</span></span><span
data-ice="signature">(domain: <span>Domain</span>, number:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>HypertyURL</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Ask for creation of a number of Hyperty addresses, to the domain message
node.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(url: <span>URL.URL</span>, bus: <span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/AddressAllocation.js.html#lineNumber17)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Create an Address Allocation

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL.URL</span>
url from who is sending the message

bus
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
MiniBus used for address allocation

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">url</span><span data-ice="signature">: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/AddressAllocation.js.html#lineNumber31)</span></span> </span> {#instance-get-url data-ice="anchor"}

<div data-ice="description">

get the URL value

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | The url value;                       |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">create</span><span data-ice="signature">(domain: <span>Domain</span>, number: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>HypertyURL</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/AddressAllocation.js.html#lineNumber39)</span></span> </span> {#instance-method-create data-ice="anchor"}

<div data-ice="description">

Ask for creation of a number of Hyperty addresses, to the domain message
node.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
domain
<span>Domain</span>
Domain of the message node.

number
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Number of addresses to request

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | A list of HypertyURL's               |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>HypertyURL</span>&gt;  |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

BloomFilter {#bloomfilter data-ice="name"}
===========

<div class="description" data-ice="description">

Implements a Bloom filter.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(m: <span>\*</span>, k: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[buckets](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-member-buckets)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[k](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-member-k)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[m](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-member-m)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[add](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-add)</span></span><span
data-ice="signature">(v: <span>\*</span>)</span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addBloomFilter](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-addBloomFilter)</span></span><span
data-ice="signature">(v: <span>\*</span>)</span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[fnv1a](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-fnv1a)</span></span><span
data-ice="signature">(v: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[fnv1ab](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-fnv1ab)</span></span><span
data-ice="signature">(a: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[fnvmix](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-fnvmix)</span></span><span
data-ice="signature">(a: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[fnvmultiply](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-fnvmultiply)</span></span><span
data-ice="signature">(a: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[locations](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-locations)</span></span><span
data-ice="signature">(v: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[popcnt](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-popcnt)</span></span><span
data-ice="signature">(v: <span>\*</span>): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[size](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-size)</span></span><span
data-ice="signature">(): <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[test](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html#instance-method-test)</span></span><span
data-ice="signature">(v: <span>\*</span>):
<span>[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(m: <span>\*</span>, k: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber47)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
m
<span>\*</span>
k
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">buckets</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber66)</span></span> </span> {#instance-member-buckets data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">k</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber60)</span></span> </span> {#instance-member-k data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">m</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber59)</span></span> </span> {#instance-member-m data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">add</span><span data-ice="signature">(v: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber93)</span></span> </span> {#instance-method-add data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addBloomFilter</span><span data-ice="signature">(v: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber115)</span></span> </span> {#instance-method-addBloomFilter data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">fnv1a</span><span data-ice="signature">(v: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber139)</span></span> </span> {#instance-method-fnv1a data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">fnv1ab</span><span data-ice="signature">(a: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber156)</span></span> </span> {#instance-method-fnv1ab data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
a
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">fnvmix</span><span data-ice="signature">(a: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber161)</span></span> </span> {#instance-method-fnvmix data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
a
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">fnvmultiply</span><span data-ice="signature">(a: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber151)</span></span> </span> {#instance-method-fnvmultiply data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-6 data-ice="title"}

Name
Type
Attribute
Description
a
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">locations</span><span data-ice="signature">(v: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber79)</span></span> </span> {#instance-method-locations data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-7 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">popcnt</span><span data-ice="signature">(v: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber132)</span></span> </span> {#instance-method-popcnt data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-8 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">size</span><span data-ice="signature">(): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber124)</span></span> </span> {#instance-method-size data-ice="anchor"}

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">test</span><span data-ice="signature">(v: <span>\*</span>): <span>[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/BloomFilter.js.html#lineNumber100)</span></span> </span> {#instance-method-test data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-9 data-ice="title"}

Name
Type
Attribute
Description
v
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

EventEmitter {#eventemitter data-ice="name"}
============

<div class="flat-list" data-ice="directSubclass">

#### Direct Subclass:

<div>

<span>[Registry](../../../class/src/registry/Registry.js~Registry.html)</span>

</div>

</div>

<div class="description" data-ice="description">

EventEmitter All classes which extends this, can have addEventListener
and trigger events;

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addEventListener](../../../class/src/utils/EventEmitter.js~EventEmitter.html#instance-method-addEventListener)</span></span><span
data-ice="signature">(eventType:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
cb:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

addEventListener listen for an eventType

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[trigger](../../../class/src/utils/EventEmitter.js~EventEmitter.html#instance-method-trigger)</span></span><span
data-ice="signature">(eventType:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
params:
<span>[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>)</span>

</div>

<div>

<div data-ice="description">

Invoke the eventType

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addEventListener</span><span data-ice="signature">(eventType: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, cb: <span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/utils/EventEmitter.js.html#lineNumber12)</span></span> </span> {#instance-method-addEventListener data-ice="anchor"}

<div data-ice="description">

addEventListener listen for an eventType

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
eventType
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
listening for this type of event

cb
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>
callback function will be executed when the event it is invoked

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">trigger</span><span data-ice="signature">(eventType: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, params: <span>[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/utils/EventEmitter.js.html#lineNumber22)</span></span> </span> {#instance-method-trigger data-ice="anchor"}

<div data-ice="description">

Invoke the eventType

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
eventType
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
event will be invoked

params
<span>[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>
parameters will be passed to the addEventListener

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

GlobalRegistryRecord {#globalregistryrecord data-ice="name"}
====================

<div class="description" data-ice="description">

Represents the user's information for the global registry.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/graphconnector/GlobalRegistryRecord.js~GlobalRegistryRecord.html#instance-constructor-constructor)</span></span>

</div>

<div>

<div data-ice="description">

Constructs a new empty object.

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[userIDs](../../../class/src/graphconnector/GlobalRegistryRecord.js~GlobalRegistryRecord.html#instance-member-userIDs)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getRecord](../../../class/src/graphconnector/GlobalRegistryRecord.js~GlobalRegistryRecord.html#instance-method-getRecord)</span></span><span
data-ice="signature">():
<span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span></span>

</div>

<div>

<div data-ice="description">

Constructs a new object representing information about one contact.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GlobalRegistryRecord.js.html#lineNumber10)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Constructs a new empty object.

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">userIDs</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GlobalRegistryRecord.js.html#lineNumber13)</span></span> </span> {#instance-member-userIDs data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getRecord</span><span data-ice="signature">(): <span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GlobalRegistryRecord.js.html#lineNumber25)</span></span> </span> {#instance-method-getRecord data-ice="anchor"}

<div data-ice="description">

Constructs a new object representing information about one contact.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Object](https://developer.moz | object A JavaScript Object with all  |
| illa.org/en-US/docs/Web/JavaScript/R | fields for the Global Registry       |
| eference/Global_Objects/Object)</spa | Record.                              |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

GraphConnector {#graphconnector data-ice="name"}
==============

<div class="description" data-ice="description">

The Graph Connector contains the contact list/address book.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-constructor-constructor)</span></span>

</div>

<div>

<div data-ice="description">

Constructs a new and empty Graph Connector.

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contacts](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-contacts)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contactsBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-contactsBloomFilter1Hop)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[globalRegistryRecord](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-globalRegistryRecord)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[groups](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-groups)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[lastCalculationnBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-lastCalculationnBloomFilter1Hop)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-addContact)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
firstName:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
lastname:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Add a contact to the Graph Connector.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addUserID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-addUserID)</span></span><span
data-ice="signature">(userID:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Adds a UserID for the user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[calculateBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-calculateBloomFilter1Hop)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

Calculates the Bloom filter containing all non-private contacts.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[checkGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-checkGUID)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>array</span></span>

</div>

<div>

<div data-ice="description">

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[generateGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-generateGUID)</span></span><span
data-ice="signature">():
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

<div data-ice="description">

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-getContact)</span></span><span
data-ice="signature">(name:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>array</span></span>

</div>

<div>

<div data-ice="description">

Gets contacts by name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-removeContact)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove a contact from the Graph Connector.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeUserID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-removeUserID)</span></span><span
data-ice="signature">(userID:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Removes a UserID for the user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[signGlobalRegistryRecord](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-signGlobalRegistryRecord)</span></span><span
data-ice="signature">():
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

<div data-ice="description">

SignGenerates a public/private key pair from a given mnemonic.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[useGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-useGUID)</span></span><span
data-ice="signature">(mnemonicAndSalt:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Generates a public/private key pair from a given mnemonic (16 words).

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber22)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Constructs a new and empty Graph Connector.

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">contacts</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber23)</span></span> </span> {#instance-member-contacts data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">contactsBloomFilter1Hop</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber211)</span></span> </span> {#instance-member-contactsBloomFilter1Hop data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">globalRegistryRecord</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber26)</span></span> </span> {#instance-member-globalRegistryRecord data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">groups</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber29)</span></span> </span> {#instance-member-groups data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">lastCalculationnBloomFilter1Hop</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber24)</span></span> </span> {#instance-member-lastCalculationnBloomFilter1Hop data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addContact</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, firstName: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, lastname: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber174)</span></span> </span> {#instance-method-addContact data-ice="anchor"}

<div data-ice="description">

Add a contact to the Graph Connector.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the new contact.

firstName
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
First name of the new contact.

lastname
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
Last name of the new contact.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addUserID</span><span data-ice="signature">(userID: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber143)</span></span> </span> {#instance-method-addUserID data-ice="anchor"}

<div data-ice="description">

Adds a UserID for the user.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
userID
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The UserID for a Domain Registry to add for the user.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">calculateBloomFilter1Hop</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber201)</span></span> </span> {#instance-method-calculateBloomFilter1Hop data-ice="anchor"}

<div data-ice="description">

Calculates the Bloom filter containing all non-private contacts.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkGUID</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>array</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber236)</span></span> </span> {#instance-method-checkGUID data-ice="anchor"}

<div data-ice="description">

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the contact to look for.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>array</span>                   | relatedContacts List of related      |
|                                      | direct contacts and of related       |
|                                      | friends-of-friends contacts.The      |
|                                      | format is:                           |
|                                      | RelatedContacts&lt;Direct&lt;GraphCo |
|                                      | nnectorContactData&gt;,FoF&lt;GraphC |
|                                      | onnectorContactData&gt;&gt;.         |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">generateGUID</span><span data-ice="signature">(): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber39)</span></span> </span> {#instance-method-generateGUID data-ice="anchor"}

<div data-ice="description">

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | mnemonic A string with 16 words.     |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getContact</span><span data-ice="signature">(name: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>array</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber220)</span></span> </span> {#instance-method-getContact data-ice="anchor"}

<div data-ice="description">

Gets contacts by name.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
name
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
First or last name to look for in the contact list.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>array</span>                   | matchingContacts Contacts matching   |
|                                      | the given name. The format is:       |
|                                      | Contacts&lt;GraphConnectorContactDat |
|                                      | a&gt;.                               |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeContact</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber186)</span></span> </span> {#instance-method-removeContact data-ice="anchor"}

<div data-ice="description">

Remove a contact from the Graph Connector.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the user to be removed.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeUserID</span><span data-ice="signature">(userID: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber160)</span></span> </span> {#instance-method-removeUserID data-ice="anchor"}

<div data-ice="description">

Removes a UserID for the user.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
userID
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The UserID to remove.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">signGlobalRegistryRecord</span><span data-ice="signature">(): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber129)</span></span> </span> {#instance-method-signGlobalRegistryRecord data-ice="anchor"}

<div data-ice="description">

SignGenerates a public/private key pair from a given mnemonic.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | JWT JSON Web Token ready to commit   |
| illa.org/en-US/docs/Web/JavaScript/R | to Global Registry.                  |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">useGUID</span><span data-ice="signature">(mnemonicAndSalt: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber70)</span></span> </span> {#instance-method-useGUID data-ice="anchor"}

<div data-ice="description">

Generates a public/private key pair from a given mnemonic (16 words).
Expects a string containing 16 words seperated by single spaces.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-6 data-ice="title"}

Name
Type
Attribute
Description
mnemonicAndSalt
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
A string of 16 words.

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

GraphConnectorContactData {#graphconnectorcontactdata data-ice="name"}
=========================

<div class="description" data-ice="description">

Represents information about a contact.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(guid:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
firstName:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
lastName:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Constructs a new object representing information about one contact.

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contactsBloomFilter1Hop](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-contactsBloomFilter1Hop)</span></span><span
data-ice="signature">(bf:
<span>[BloomFilter](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the friends-of-friends Bloom filter containing the hashed GUIDs of
the contacts for the contact.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contactsBloomFilter1Hop](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-contactsBloomFilter1Hop)</span></span><span
data-ice="signature">:
<span>[BloomFilter](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the Bloom filter containing the hashed GUIDs of the contacts for
the contact.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[firstName](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-firstName)</span></span><span
data-ice="signature">:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the first name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[firstName](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-firstName)</span></span><span
data-ice="signature">(firstName:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the first name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[guid](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-guid)</span></span><span
data-ice="signature">:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the GUID.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[guid](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-guid)</span></span><span
data-ice="signature">(GUID:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the GUID.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[lastName](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-lastName)</span></span><span
data-ice="signature">:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the last name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[lastName](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-lastName)</span></span><span
data-ice="signature">(lastName:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the last name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[privateContact](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-privateContact)</span></span><span
data-ice="signature">:
<span>[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the privacy status of the contact.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[privateContact](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-privateContact)</span></span><span
data-ice="signature">(boolPrivate:
<span>[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the privacy status of the contact according to the given Boolean
value.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[residenceLocation](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-residenceLocation)</span></span><span
data-ice="signature">:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the geohash of the residence location.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[residenceLocation](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-residenceLocation)</span></span><span
data-ice="signature">(geohash:
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the geohash of the residence location.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[userIDs](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-set-userIDs)</span></span><span
data-ice="signature">(userIDs:
<span>List</span>&lt;<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the userIDs.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[userIDs](../../../class/src/graphconnector/GraphConnectorContactData.js~GraphConnectorContactData.html#instance-get-userIDs)</span></span><span
data-ice="signature">:
<span>List</span>&lt;<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the user IDs.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(guid: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, firstName: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, lastName: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber13)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Constructs a new object representing information about one contact.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The GUID of the new contact.

firstName
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The first name of the new contact.

lastName
<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The last name of the new contact.

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">contactsBloomFilter1Hop</span><span data-ice="signature">(bf: <span>[BloomFilter](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber115)</span></span> </span> {#instance-set-contactsBloomFilter1Hop data-ice="anchor"}

<div data-ice="description">

Sets the friends-of-friends Bloom filter containing the hashed GUIDs of
the contacts for the contact.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">contactsBloomFilter1Hop</span><span data-ice="signature">: <span>[BloomFilter](../../../class/src/graphconnector/BloomFilter.js~BloomFilter.html)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber107)</span></span> </span> {#instance-get-contactsBloomFilter1Hop data-ice="anchor"}

<div data-ice="description">

Returns the Bloom filter containing the hashed GUIDs of the contacts for
the contact.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[BloomFilter](../../../class/s | bf Bloom filter for the contact.     |
| rc/graphconnector/BloomFilter.js~Blo |                                      |
| omFilter.html)</span>                |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">firstName</span><span data-ice="signature">: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber59)</span></span> </span> {#instance-get-firstName data-ice="anchor"}

<div data-ice="description">

Returns the first name.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[String](https://developer.moz | firstName First name of the contact. |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">firstName</span><span data-ice="signature">(firstName: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber67)</span></span> </span> {#instance-set-firstName data-ice="anchor"}

<div data-ice="description">

Sets the first name.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">guid</span><span data-ice="signature">: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber27)</span></span> </span> {#instance-get-guid data-ice="anchor"}

<div data-ice="description">

Returns the GUID.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[String](https://developer.moz | GUID GUID of the contact.            |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">guid</span><span data-ice="signature">(GUID: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber35)</span></span> </span> {#instance-set-guid data-ice="anchor"}

<div data-ice="description">

Sets the GUID.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">lastName</span><span data-ice="signature">: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber75)</span></span> </span> {#instance-get-lastName data-ice="anchor"}

<div data-ice="description">

Returns the last name.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[String](https://developer.moz | lastName Last name of the contact.   |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">lastName</span><span data-ice="signature">(lastName: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber83)</span></span> </span> {#instance-set-lastName data-ice="anchor"}

<div data-ice="description">

Sets the last name.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">privateContact</span><span data-ice="signature">: <span>[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber91)</span></span> </span> {#instance-get-privateContact data-ice="anchor"}

<div data-ice="description">

Returns the privacy status of the contact.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Boolean](https://developer.mo | privateContact True/false value      |
| zilla.org/en-US/docs/Web/JavaScript/ | indicating the privacy status of the |
| Reference/Global_Objects/Boolean)</s | contact.                             |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">privateContact</span><span data-ice="signature">(boolPrivate: <span>[Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber99)</span></span> </span> {#instance-set-privateContact data-ice="anchor"}

<div data-ice="description">

Sets the privacy status of the contact according to the given Boolean
value.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">residenceLocation</span><span data-ice="signature">: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber123)</span></span> </span> {#instance-get-residenceLocation data-ice="anchor"}

<div data-ice="description">

Returns the geohash of the residence location.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[String](https://developer.moz | geohash Geohash of the residence     |
| illa.org/en-US/docs/Web/JavaScript/R | location.                            |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">residenceLocation</span><span data-ice="signature">(geohash: <span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber131)</span></span> </span> {#instance-set-residenceLocation data-ice="anchor"}

<div data-ice="description">

Sets the geohash of the residence location.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">userIDs</span><span data-ice="signature">(userIDs: <span>List</span>&lt;<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber51)</span></span> </span> {#instance-set-userIDs data-ice="anchor"}

<div data-ice="description">

Sets the userIDs.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">userIDs</span><span data-ice="signature">: <span>List</span>&lt;<span>[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnectorContactData.js.html#lineNumber43)</span></span> </span> {#instance-get-userIDs data-ice="anchor"}

<div data-ice="description">

Returns the user IDs.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>List</span>&lt;<span>[String]( | userIDs UserIDs of the contact.      |
| https://developer.mozilla.org/en-US/ |                                      |
| docs/Web/JavaScript/Reference/Global |                                      |
| _Objects/String)</span>&gt;          |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

HypertyDiscovery {#hypertydiscovery data-ice="name"}
================

<div class="description" data-ice="description">

Core HypertyDiscovery interface Class to allow applications to search
for hyperties using the message bus

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/registry/HypertyDiscovery.js~HypertyDiscovery.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(msgbus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>,
runtimeURL: <span>RuntimeURL</span>)</span>

</div>

<div>

<div data-ice="description">

To initialise the HypertyDiscover, which will provide the support for
hyperties to query users registered in outside the internal core.

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[discoverHypertyPerUser](../../../class/src/registry/HypertyDiscovery.js~HypertyDiscovery.html#instance-method-discoverHypertyPerUser)</span></span><span
data-ice="signature">(email: <span>email</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

function to request about users registered in domain registry, and
return the hyperty instance if found.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(msgbus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>, runtimeURL: <span>RuntimeURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyDiscovery.js.html#lineNumber15)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

To initialise the HypertyDiscover, which will provide the support for
hyperties to query users registered in outside the internal core.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
msgbus
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>
msgbus

runtimeURL
<span>RuntimeURL</span>
runtimeURL

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">discoverHypertyPerUser</span><span data-ice="signature">(email: <span>email</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyDiscovery.js.html#lineNumber29)</span></span> </span> {#instance-method-discoverHypertyPerUser data-ice="anchor"}

<div data-ice="description">

function to request about users registered in domain registry, and
return the hyperty instance if found.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
email
<span>email</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise                              |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

HypertyInstance {#hypertyinstance data-ice="name"}
===============

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[RegistryDataModel](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html)</span>
→ HypertyInstance

</div>

</div>

<div class="description" data-ice="description">

@author: Gil Dias (gil.dias@tecnico.ulisboa.pt) HypertyInstance Data
Model used to model instances of Hyperties running in devices and
servers.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/registry/HypertyInstance.js~HypertyInstance.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(id: <span>\*</span>, url: <span>\*</span>,
descriptor: <span>\*</span>, hypertyURL: <span>\*</span>, user:
<span>\*</span>, guid: <span>\*</span>, runtime: <span>\*</span>,
context: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[hypertyURL](../../../class/src/registry/HypertyInstance.js~HypertyInstance.html#instance-get-hypertyURL)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[user](../../../class/src/registry/HypertyInstance.js~HypertyInstance.html#instance-set-user)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[user](../../../class/src/registry/HypertyInstance.js~HypertyInstance.html#instance-get-user)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[RegistryDataModel](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html)</span>
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[descriptor](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-descriptor)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[id](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-id)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[url](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-url)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(id: <span>\*</span>, url: <span>\*</span>, descriptor: <span>\*</span>, hypertyURL: <span>\*</span>, user: <span>\*</span>, guid: <span>\*</span>, runtime: <span>\*</span>, context: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyInstance.js.html#lineNumber9)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="override">

#### Override:

<span>[RegistryDataModel\#constructor](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-constructor-constructor)</span>

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
id
<span>\*</span>
url
<span>\*</span>
descriptor
<span>\*</span>
hypertyURL
<span>\*</span>
user
<span>\*</span>
guid
<span>\*</span>
runtime
<span>\*</span>
context
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">hypertyURL</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyInstance.js.html#lineNumber29)</span></span> </span> {#instance-get-hypertyURL data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">user</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyInstance.js.html#lineNumber19)</span></span> </span> {#instance-set-user data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">user</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/HypertyInstance.js.html#lineNumber24)</span></span> </span> {#instance-get-user data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

IdentityModule {#identitymodule data-ice="name"}
==============

<div class="description" data-ice="description">

IdentityModule Initial specification: D4.1 The IdentityModule is a
component managing user Identity. It downloads, instantiates and manage
Identity Provider Proxy (IdP) for its own user identity or for external
user identity verification.

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-constructor-constructor)</span></span>

</div>

<div>

<div data-ice="description">

USER'S OWN IDENTITY

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[generateAssertion](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-generateAssertion)</span></span><span
data-ice="signature">(contents: <span>DOMString</span>, origin:
<span>DOMString</span>, usernameHint: <span>DOMString</span>):
<span>IdAssertion</span></span>

</div>

<div>

<div data-ice="description">

Generates an Identity Assertion for a call session

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getAssertionTrustLevel](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-getAssertionTrustLevel)</span></span><span
data-ice="signature">(assertion: <span>DOMString</span>)</span>

</div>

<div>

<div data-ice="description">

Trust level evaluation of a received IdAssertion

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getIdentities](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-getIdentities)</span></span><span
data-ice="signature">():
<span>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)</span>&lt;<span>Identities</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Find and return all available identities that can be associated to the
Hyperty Instance

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[loginWithRP](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-loginWithRP)</span></span><span
data-ice="signature">(identifier: <span>Identifier</span>, scope:
<span>Scope</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

In relation with a classical Relying Party: Login

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerIdentity](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-registerIdentity)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

Register a new Identity with an Identity Provider

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerWithRP](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-registerWithRP)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

In relation with a classical Relying Party: Registration

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[setHypertyIdentity](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-setHypertyIdentity)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

In relation with a Hyperty Instance: Associate identity

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[validateAssertion](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-validateAssertion)</span></span><span
data-ice="signature">(assertion: <span>DOMString</span>)</span>

</div>

<div>

<div data-ice="description">

Verification of a received IdAssertion validity

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber18)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

USER'S OWN IDENTITY

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">generateAssertion</span><span data-ice="signature">(contents: <span>DOMString</span>, origin: <span>DOMString</span>, usernameHint: <span>DOMString</span>): <span>IdAssertion</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber195)</span></span> </span> {#instance-method-generateAssertion data-ice="anchor"}

<div data-ice="description">

Generates an Identity Assertion for a call session

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
contents
<span>DOMString</span>
contents

origin
<span>DOMString</span>
origin

usernameHint
<span>DOMString</span>
usernameHint

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>IdAssertion</span>             | IdAssertion                          |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getAssertionTrustLevel</span><span data-ice="signature">(assertion: <span>DOMString</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber215)</span></span> </span> {#instance-method-getAssertionTrustLevel data-ice="anchor"}

<div data-ice="description">

Trust level evaluation of a received IdAssertion

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
assertion
<span>DOMString</span>
assertion

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getIdentities</span><span data-ice="signature">(): <span>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)</span>&lt;<span>Identities</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber42)</span></span> </span> {#instance-method-getIdentities data-ice="anchor"}

<div data-ice="description">

Find and return all available identities that can be associated to the
Hyperty Instance

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Array](https://developer.mozi | Array Identities                     |
| lla.org/en-US/docs/Web/JavaScript/Re |                                      |
| ference/Global_Objects/Array)</span> |                                      |
| &lt;<span>Identities</span>&gt;      |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">loginWithRP</span><span data-ice="signature">(identifier: <span>Identifier</span>, scope: <span>Scope</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber53)</span></span> </span> {#instance-method-loginWithRP data-ice="anchor"}

<div data-ice="description">

In relation with a classical Relying Party: Login

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
identifier
<span>Identifier</span>
identifier

scope
<span>Scope</span>
scope

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise IDToken                      |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber27)</span></span> </span> {#instance-method-registerIdentity data-ice="anchor"}

<div data-ice="description">

Register a new Identity with an Identity Provider

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerWithRP</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber34)</span></span> </span> {#instance-method-registerWithRP data-ice="anchor"}

<div data-ice="description">

In relation with a classical Relying Party: Registration

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">setHypertyIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber184)</span></span> </span> {#instance-method-setHypertyIdentity data-ice="anchor"}

<div data-ice="description">

In relation with a Hyperty Instance: Associate identity

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">validateAssertion</span><span data-ice="signature">(assertion: <span>DOMString</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber207)</span></span> </span> {#instance-method-validateAssertion data-ice="anchor"}

<div data-ice="description">

Verification of a received IdAssertion validity

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
assertion
<span>DOMString</span>
assertion

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

MessageBus {#messagebus data-ice="name"}
==========

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span> →
MessageBus

</div>

</div>

<div class="description" data-ice="description">

Message BUS Interface is an extension of the MiniBus It doesn't support
the default '\*' listener, instead it uses the registry.resolve(..)

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/bus/MessageBus.js~MessageBus.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(registry: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addForward](../../../class/src/bus/MessageBus.js~MessageBus.html#instance-method-addForward)</span></span><span
data-ice="signature">(from: <span>\*</span>, to: <span>\*</span>):
<span>\*</span></span>

</div>

<div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[pipeline](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-get-pipeline)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, listener:
<span>Listener</span>): <span>MsgListener</span></span>

</div>

<div>

<div data-ice="description">

Register listener to receive message when "msg.to === url".

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>,
responseListener:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

Manually add a response listener.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[bind](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-bind)</span></span><span
data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>,
target:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>):
<span>Bound</span></span>

</div>

<div>

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[postMessage](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-postMessage)</span></span><span
data-ice="signature">(msg: <span>Message</span>, responseCallback:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>):
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span>

</div>

<div>

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeAllListenersOf](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeAllListenersOf)</span></span><span
data-ice="signature">(url: <span>URL</span>)</span>

</div>

<div>

<div data-ice="description">

Remove all existent listeners for the URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove the response listener.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(registry: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MessageBus.js.html#lineNumber18)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="override">

#### Override:

<span>[MiniBus\#constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span>

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
registry
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addForward</span><span data-ice="signature">(from: <span>\*</span>, to: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MessageBus.js.html#lineNumber24)</span></span> </span> {#instance-method-addForward data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
from
<span>\*</span>
to
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

MiniBus {#minibus data-ice="name"}
=======

<div class="flat-list" data-ice="directSubclass">

#### Direct Subclass:

<div>

<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>,
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>

</div>

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span></span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[pipeline](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-get-pipeline)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, listener:
<span>Listener</span>): <span>MsgListener</span></span>

</div>

<div>

<div data-ice="description">

Register listener to receive message when "msg.to === url".

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>,
responseListener:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

Manually add a response listener.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[bind](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-bind)</span></span><span
data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>,
target:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>):
<span>Bound</span></span>

</div>

<div>

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[postMessage](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-postMessage)</span></span><span
data-ice="signature">(msg: <span>Message</span>, responseCallback:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>):
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span>

</div>

<div>

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeAllListenersOf](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeAllListenersOf)</span></span><span
data-ice="signature">(url: <span>URL</span>)</span>

</div>

<div>

<div data-ice="description">

Remove all existent listeners for the URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove the response listener.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber20)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">pipeline</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber35)</span></span> </span> {#instance-get-pipeline data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addListener</span><span data-ice="signature">(url: <span>URL</span>, listener: <span>Listener</span>): <span>MsgListener</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber44)</span></span> </span> {#instance-method-addListener data-ice="anchor"}

<div data-ice="description">

Register listener to receive message when "msg.to === url". Special url
"\*" for default listener is accepted to intercept all messages.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Address to intercept, tha is in the message "to"

listener
<span>Listener</span>
listener

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>MsgListener</span>             | instance of MsgListener              |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addResponseListener</span><span data-ice="signature">(url: <span>URL</span>, msgId: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>, responseListener: <span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber66)</span></span> </span> {#instance-method-addResponseListener data-ice="anchor"}

<div data-ice="description">

Manually add a response listener. Only one listener per message ID
should exist. ATENTION, there is no timeout for this listener. The
listener should be removed with a removeResponseListener, failing to do
this will result in a unreleased memory problem.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Origin address of the message sent, "msg.from".

msgId
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Message ID that is returned from the postMessage.

responseListener
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>
Callback function for the response

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">bind</span><span data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>, target: <span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>): <span>Bound</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber151)</span></span> </span> {#instance-method-bind data-ice="anchor"}

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
outUrl
<span>URL</span>
Outbound URL, register listener for url in direction "this -&gt; target"

inUrl
<span>URL</span>
Inbound URL, register listener for url in direction "target -&gt; this"

target
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
The other target MiniBus

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>Bound</span>                   | an object that contains the          |
|                                      | properties \[thisListener,           |
|                                      | targetListener\] and the unbind      |
|                                      | method.                              |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">postMessage</span><span data-ice="signature">(msg: <span>Message</span>, responseCallback: <span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>): <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber95)</span></span> </span> {#instance-method-postMessage data-ice="anchor"}

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners. It's has an optional mechanism for automatic management of
response handlers. The response handler will be unregistered after
receiving the response, or after response timeout (default to 3s).

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
msg
<span>Message</span>
Message to send. Message ID is automatically added to the message.

responseCallback
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>
Optional parameter, if the developer what's automatic response
management.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[number](https://developer.moz | Returns the message ID, in case it   |
| illa.org/en-US/docs/Web/JavaScript/R | should be needed for manual          |
| eference/Global_Objects/Number)</spa | management of the response handler.  |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeAllListenersOf</span><span data-ice="signature">(url: <span>URL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber83)</span></span> </span> {#instance-method-removeAllListenersOf data-ice="anchor"}

<div data-ice="description">

Remove all existent listeners for the URL

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Address registered

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeResponseListener</span><span data-ice="signature">(url: <span>URL</span>, msgId: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/MiniBus.js.html#lineNumber75)</span></span> </span> {#instance-method-removeResponseListener data-ice="anchor"}

<div data-ice="description">

Remove the response listener.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL</span>
Origin address of the message sent, "msg.from".

msgId
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Message ID that is returned from the postMessage

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

ObjectAllocation {#objectallocation data-ice="name"}
================

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/syncher/ObjectAllocation.js~ObjectAllocation.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(url: <span>URL.URL</span>, bus:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>)</span>

</div>

<div>

<div data-ice="description">

Create an Object Allocation

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[url](../../../class/src/syncher/ObjectAllocation.js~ObjectAllocation.html#instance-get-url)</span></span><span
data-ice="signature">:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>:
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

get the URL value

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[create](../../../class/src/syncher/ObjectAllocation.js~ObjectAllocation.html#instance-method-create)</span></span><span
data-ice="signature">(domain: <span>Domain</span>, number:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>ObjectURL</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Ask for creation of a number of Object addresses, to the domain message
node.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(url: <span>URL.URL</span>, bus: <span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/syncher/ObjectAllocation.js.html#lineNumber12)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Create an Object Allocation

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL.URL</span>
url from who is sending the message

bus
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
MiniBus used for address allocation

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">url</span><span data-ice="signature">: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/syncher/ObjectAllocation.js.html#lineNumber23)</span></span> </span> {#instance-get-url data-ice="anchor"}

<div data-ice="description">

get the URL value

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | The url value;                       |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">create</span><span data-ice="signature">(domain: <span>Domain</span>, number: <span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>ObjectURL</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/syncher/ObjectAllocation.js.html#lineNumber31)</span></span> </span> {#instance-method-create data-ice="anchor"}

<div data-ice="description">

Ask for creation of a number of Object addresses, to the domain message
node.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
domain
<span>Domain</span>
Domain of the message node.

number
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>
Number of addresses to request

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | A list of ObjectURL's                |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>ObjectURL</span>&gt;   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

Pipeline {#pipeline data-ice="name"}
========

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/bus/Pipeline.js~Pipeline.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(\_onFail: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[process](../../../class/src/bus/Pipeline.js~Pipeline.html#instance-method-process)</span></span><span
data-ice="signature">(msg: <span>\*</span>, onDeliver:
<span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(\_onFail: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/Pipeline.js.html#lineNumber12)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
\_onFail
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">process</span><span data-ice="signature">(msg: <span>\*</span>, onDeliver: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/bus/Pipeline.js.html#lineNumber19)</span></span> </span> {#instance-method-process data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
msg
<span>\*</span>
onDeliver
<span>\*</span>

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

PolicyEngine {#policyengine data-ice="name"}
============

<div class="description" data-ice="description">

Core Policy Engine (PDP/PEP) Interface According to:
<https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md#core-policy-engine-pdppep-interface>

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(IdentityModule: <span>\*</span>, Registry:
<span>\*</span>)</span>

</div>

<div>

<div data-ice="description">

To initialise the Policy Engine

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addPolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-addPolicies)</span></span><span
data-ice="signature">(hyperty: <span>URL.HypertyURL</span>, policies:
<span>HypertyPolicyList</span>)</span>

</div>

<div>

<div data-ice="description">

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: 'message.header.from', target:
'blacklist', action: 'deny'}

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[authorise](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-authorise)</span></span><span
data-ice="signature">(message: <span>Message.Message</span>):
<span>AuthorisationResponse</span></span>

</div>

<div>

<div data-ice="description">

Authorisation request to accept a Subscription for a certain resource.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[checkPolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-checkPolicies)</span></span><span
data-ice="signature">(message: <span>\*</span>):
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removePolicies](../../../class/src/policy/PolicyEngine.js~PolicyEngine.html#instance-method-removePolicies)</span></span><span
data-ice="signature">(hyperty: <span>URL.HypertyURL</span>)</span>

</div>

<div>

<div data-ice="description">

To remove previously added policies for a certain deployed Hyperty
Instance

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(IdentityModule: <span>\*</span>, Registry: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber12)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

To initialise the Policy Engine

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
IdentityModule
<span>\*</span>
identityModule identityModule

Registry
<span>\*</span>
runtimeRegistry runtimeRegistry

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addPolicies</span><span data-ice="signature">(hyperty: <span>URL.HypertyURL</span>, policies: <span>HypertyPolicyList</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber29)</span></span> </span> {#instance-method-addPolicies data-ice="anchor"}

<div data-ice="description">

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: 'message.header.from', target:
'blacklist', action: 'deny'}

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
hyperty
<span>URL.HypertyURL</span>
hyperty

policies
<span>HypertyPolicyList</span>
policies

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">authorise</span><span data-ice="signature">(message: <span>Message.Message</span>): <span>AuthorisationResponse</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber48)</span></span> </span> {#instance-method-authorise data-ice="anchor"}

<div data-ice="description">

Authorisation request to accept a Subscription for a certain resource.
Returns a Response Message to be returned to Subscription requester

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
message
<span>Message.Message</span>
message

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>AuthorisationResponse</span>   | AuthorisationResponse                |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkPolicies</span><span data-ice="signature">(message: <span>\*</span>): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber90)</span></span> </span> {#instance-method-checkPolicies data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
message
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ----------------------------------------------------------------------------------------------------------------
  <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
  ----------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removePolicies</span><span data-ice="signature">(hyperty: <span>URL.HypertyURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/policy/PolicyEngine.js.html#lineNumber38)</span></span> </span> {#instance-method-removePolicies data-ice="anchor"}

<div data-ice="description">

To remove previously added policies for a certain deployed Hyperty
Instance

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
hyperty
<span>URL.HypertyURL</span>
hyperty

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

Registry {#registry data-ice="name"}
========

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[EventEmitter](../../../class/src/utils/EventEmitter.js~EventEmitter.html)</span>
→ Registry

</div>

</div>

<div class="description" data-ice="description">

Runtime Registry Interface

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/registry/Registry.js~Registry.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(msgbus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>,
runtimeURL: <span>HypertyRuntimeURL</span>, appSandbox:
<span>AppSandbox</span>, remoteRegistry: <span>DomainURL</span>)</span>

</div>

<div>

<div data-ice="description">

To initialise the Runtime Registry with the RuntimeURL that will be the
basis to derive the internal runtime addresses when allocating addresses
to internal runtime component.

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[messageBus](../../../class/src/registry/Registry.js~Registry.html#instance-get-messageBus)</span></span><span
data-ice="signature">(messageBus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

return the messageBus in this Registry

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[messageBus](../../../class/src/registry/Registry.js~Registry.html#instance-set-messageBus)</span></span><span
data-ice="signature">(messageBus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Set the messageBus in this Registry

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[discoverProtostub](../../../class/src/registry/Registry.js~Registry.html#instance-method-discoverProtostub)</span></span><span
data-ice="signature">(DomainURL: <span>DomainURL</span>):
<span>RuntimeURL</span></span>

</div>

<div>

<div data-ice="description">

To discover protocol stubs available in the runtime for a certain
domain.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getAppSandbox](../../../class/src/registry/Registry.js~Registry.html#instance-method-getAppSandbox)</span></span><span
data-ice="signature">(): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

This function is used to return the sandbox instance where the
Application is executing.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getSandbox](../../../class/src/registry/Registry.js~Registry.html#instance-method-getSandbox)</span></span><span
data-ice="signature">(DomainURL: <span>DomainURL</span>):
<span>RuntimeSandbox</span></span>

</div>

<div>

<div data-ice="description">

To discover sandboxes available in the runtime for a certain domain.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getUserHyperty](../../../class/src/registry/Registry.js~Registry.html#instance-method-getUserHyperty)</span></span><span
data-ice="signature">(email: <span>\*</span>): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

Function to query the Domain registry, with an user email.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[onEvent](../../../class/src/registry/Registry.js~Registry.html#instance-method-onEvent)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

To receive status events from components registered in the Registry.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerHyperty](../../../class/src/registry/Registry.js~Registry.html#instance-method-registerHyperty)</span></span><span
data-ice="signature">(sandbox:
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>,
HypertyCatalogueURL: <span>HypertyCatalogueURL</span>):
<span>HypertyURL</span></span>

</div>

<div>

<div data-ice="description">

To register a new Hyperty in the runtime which returns the HypertyURL
allocated to the new Hyperty.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerPEP](../../../class/src/registry/Registry.js~Registry.html#instance-method-registerPEP)</span></span><span
data-ice="signature">(postMessage: <span>Message.Message</span>,
HypertyURL: <span>HypertyURL</span>):
<span>HypertyRuntimeURL</span></span>

</div>

<div>

<div data-ice="description">

To register a new Policy Enforcer in the runtime including as input
parameters the function to postMessage, the HypertyURL associated with
the PEP, which returns the RuntimeURL allocated to the new Policy
Enforcer component.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerStub](../../../class/src/registry/Registry.js~Registry.html#instance-method-registerStub)</span></span><span
data-ice="signature">(Sandbox:
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>,
DomainURL: <span>DomainURL</span>):
<span>RuntimeProtoStubURL</span></span>

</div>

<div>

<div data-ice="description">

To register a new Protocol Stub in the runtime including as input
parameters the function to postMessage, the DomainURL that is connected
with the stub, which returns the RuntimeURL allocated to the new
ProtocolStub.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[resolve](../../../class/src/registry/Registry.js~Registry.html#instance-method-resolve)</span></span><span
data-ice="signature">(url: <span>URL.URL</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>URL.URL</span>&gt;</span>

</div>

<div>

<div data-ice="description">

To verify if source is valid and to resolve target runtime url address
if needed (eg protostub runtime url in case the message is to be
dispatched to a remote endpoint).

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[unregisterHyperty](../../../class/src/registry/Registry.js~Registry.html#instance-method-unregisterHyperty)</span></span><span
data-ice="signature">(HypertyURL: <span>HypertyURL</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

To unregister a previously registered Hyperty

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[unregisterPEP](../../../class/src/registry/Registry.js~Registry.html#instance-method-unregisterPEP)</span></span><span
data-ice="signature">(HypertyRuntimeURL:
<span>HypertyRuntimeURL</span>): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

To unregister a previously registered protocol stub

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[unregisterStub](../../../class/src/registry/Registry.js~Registry.html#instance-method-unregisterStub)</span></span><span
data-ice="signature">(HypertyRuntimeURL:
<span>HypertyRuntimeURL</span>): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

To unregister a previously registered protocol stub

</div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[EventEmitter](../../../class/src/utils/EventEmitter.js~EventEmitter.html)</span>
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addEventListener](../../../class/src/utils/EventEmitter.js~EventEmitter.html#instance-method-addEventListener)</span></span><span
data-ice="signature">(eventType:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
cb:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

addEventListener listen for an eventType

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[trigger](../../../class/src/utils/EventEmitter.js~EventEmitter.html#instance-method-trigger)</span></span><span
data-ice="signature">(eventType:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
params:
<span>[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>)</span>

</div>

<div>

<div data-ice="description">

Invoke the eventType

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(msgbus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>, runtimeURL: <span>HypertyRuntimeURL</span>, appSandbox: <span>AppSandbox</span>, remoteRegistry: <span>DomainURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber20)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

To initialise the Runtime Registry with the RuntimeURL that will be the
basis to derive the internal runtime addresses when allocating addresses
to internal runtime component. In addition, the Registry domain back-end
to be used to remotely register Runtime components, is also passed as
input parameter.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
msgbus
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>
msgbus

runtimeURL
<span>HypertyRuntimeURL</span>
runtimeURL

appSandbox
<span>AppSandbox</span>
appSandbox

remoteRegistry
<span>DomainURL</span>
remoteRegistry

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">messageBus</span><span data-ice="signature">(messageBus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber56)</span></span> </span> {#instance-get-messageBus data-ice="anchor"}

<div data-ice="description">

return the messageBus in this Registry

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">messageBus</span><span data-ice="signature">(messageBus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber65)</span></span> </span> {#instance-set-messageBus data-ice="anchor"}

<div data-ice="description">

Set the messageBus in this Registry

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">discoverProtostub</span><span data-ice="signature">(DomainURL: <span>DomainURL</span>): <span>RuntimeURL</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber224)</span></span> </span> {#instance-method-discoverProtostub data-ice="anchor"}

<div data-ice="description">

To discover protocol stubs available in the runtime for a certain
domain. If available, it returns the runtime url for the protocol stub
that connects to the requested domain. Required by the runtime BUS to
route messages to remote servers or peers (do we need something similar
for Hyperties?).

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
DomainURL
<span>DomainURL</span>
url

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>RuntimeURL</span>              | RuntimeURL                           |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getAppSandbox</span><span data-ice="signature">(): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber77)</span></span> </span> {#instance-method-getAppSandbox data-ice="anchor"}

<div data-ice="description">

This function is used to return the sandbox instance where the
Application is executing. It is assumed there is just one App per
Runtime instance.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getSandbox</span><span data-ice="signature">(DomainURL: <span>DomainURL</span>): <span>RuntimeSandbox</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber356)</span></span> </span> {#instance-method-getSandbox data-ice="anchor"}

<div data-ice="description">

To discover sandboxes available in the runtime for a certain domain.
Required by the runtime UA to avoid more than one sandbox for the same
domain.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
DomainURL
<span>DomainURL</span>
url

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>RuntimeSandbox</span>          | RuntimeSandbox                       |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getUserHyperty</span><span data-ice="signature">(email: <span>\*</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber85)</span></span> </span> {#instance-method-getUserHyperty data-ice="anchor"}

<div data-ice="description">

Function to query the Domain registry, with an user email.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
email
<span>\*</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">onEvent</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber347)</span></span> </span> {#instance-method-onEvent data-ice="anchor"}

<div data-ice="description">

To receive status events from components registered in the Registry.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
Message.Message
<span>Message.Message</span>
event

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerHyperty</span><span data-ice="signature">(sandbox: <span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>, HypertyCatalogueURL: <span>HypertyCatalogueURL</span>): <span>HypertyURL</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber121)</span></span> </span> {#instance-method-registerHyperty data-ice="anchor"}

<div data-ice="description">

To register a new Hyperty in the runtime which returns the HypertyURL
allocated to the new Hyperty.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
sandbox
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>
sandbox

HypertyCatalogueURL
<span>HypertyCatalogueURL</span>
descriptor

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>HypertyURL</span>              | HypertyURL                           |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerPEP</span><span data-ice="signature">(postMessage: <span>Message.Message</span>, HypertyURL: <span>HypertyURL</span>): <span>HypertyRuntimeURL</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber312)</span></span> </span> {#instance-method-registerPEP data-ice="anchor"}

<div data-ice="description">

To register a new Policy Enforcer in the runtime including as input
parameters the function to postMessage, the HypertyURL associated with
the PEP, which returns the RuntimeURL allocated to the new Policy
Enforcer component.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-6 data-ice="title"}

Name
Type
Attribute
Description
postMessage
<span>Message.Message</span>
postMessage

HypertyURL
<span>HypertyURL</span>
hyperty

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>HypertyRuntimeURL</span>       | HypertyRuntimeURL                    |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerStub</span><span data-ice="signature">(Sandbox: <span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>, DomainURL: <span>DomainURL</span>): <span>RuntimeProtoStubURL</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber247)</span></span> </span> {#instance-method-registerStub data-ice="anchor"}

<div data-ice="description">

To register a new Protocol Stub in the runtime including as input
parameters the function to postMessage, the DomainURL that is connected
with the stub, which returns the RuntimeURL allocated to the new
ProtocolStub.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-7 data-ice="title"}

Name
Type
Attribute
Description
Sandbox
<span>[Sandbox](../../../class/src/sandbox/Sandbox.js~Sandbox.html)</span>
DomainURL
<span>DomainURL</span>
service provider domain

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ----------------------------------
  <span>RuntimeProtoStubURL</span>
  ----------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">resolve</span><span data-ice="signature">(url: <span>URL.URL</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>URL.URL</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber401)</span></span> </span> {#instance-method-resolve data-ice="anchor"}

<div data-ice="description">

To verify if source is valid and to resolve target runtime url address
if needed (eg protostub runtime url in case the message is to be
dispatched to a remote endpoint).

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-8 data-ice="title"}

Name
Type
Attribute
Description
url
<span>URL.URL</span>
url

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise &lt;URL.URL&gt;              |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>URL.URL</span>&gt;     |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">unregisterHyperty</span><span data-ice="signature">(HypertyURL: <span>HypertyURL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber191)</span></span> </span> {#instance-method-unregisterHyperty data-ice="anchor"}

<div data-ice="description">

To unregister a previously registered Hyperty

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-9 data-ice="title"}

Name
Type
Attribute
Description
HypertyURL
<span>HypertyURL</span>
url url

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">unregisterPEP</span><span data-ice="signature">(HypertyRuntimeURL: <span>HypertyRuntimeURL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber327)</span></span> </span> {#instance-method-unregisterPEP data-ice="anchor"}

<div data-ice="description">

To unregister a previously registered protocol stub

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-10 data-ice="title"}

Name
Type
Attribute
Description
HypertyRuntimeURL
<span>HypertyRuntimeURL</span>
HypertyRuntimeURL

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">unregisterStub</span><span data-ice="signature">(HypertyRuntimeURL: <span>HypertyRuntimeURL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/Registry.js.html#lineNumber288)</span></span> </span> {#instance-method-unregisterStub data-ice="anchor"}

<div data-ice="description">

To unregister a previously registered protocol stub

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-11 data-ice="title"}

Name
Type
Attribute
Description
HypertyRuntimeURL
<span>HypertyRuntimeURL</span>
hypertyRuntimeURL

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

RegistryDataModel {#registrydatamodel data-ice="name"}
=================

<div class="flat-list" data-ice="directSubclass">

#### Direct Subclass:

<div>

<span>[HypertyInstance](../../../class/src/registry/HypertyInstance.js~HypertyInstance.html)</span>

</div>

</div>

<div class="description" data-ice="description">

@author: Gil Dias (gil.dias@tecnico.ulisboa.pt) Registry Data Model
includes all Objects to be handled by the Registry functionality
including

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(id: <span>\*</span>, url: <span>\*</span>,
descriptor: <span>\*</span>, startingTime: <span>\*</span>,
lastModified: <span>\*</span>, status: <span>\*</span>, stubs:
<span>\*</span>, stubsConfiguration: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[descriptor](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-descriptor)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[id](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-id)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[url](../../../class/src/registry/RegistryDataModel.js~RegistryDataModel.html#instance-get-url)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(id: <span>\*</span>, url: <span>\*</span>, descriptor: <span>\*</span>, startingTime: <span>\*</span>, lastModified: <span>\*</span>, status: <span>\*</span>, stubs: <span>\*</span>, stubsConfiguration: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/RegistryDataModel.js.html#lineNumber7)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
id
<span>\*</span>
url
<span>\*</span>
descriptor
<span>\*</span>
startingTime
<span>\*</span>
lastModified
<span>\*</span>
status
<span>\*</span>
stubs
<span>\*</span>
stubsConfiguration
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">descriptor</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/RegistryDataModel.js.html#lineNumber30)</span></span> </span> {#instance-get-descriptor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">id</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/RegistryDataModel.js.html#lineNumber20)</span></span> </span> {#instance-get-id data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">url</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/registry/RegistryDataModel.js.html#lineNumber25)</span></span> </span> {#instance-get-url data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

RuntimeCatalogue {#runtimecatalogue data-ice="name"}
================

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-constructor-constructor)</span></span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[runtimeURL](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-set-runtimeURL)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[runtimeURL](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-get-runtimeURL)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getDataSchemaDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-getDataSchemaDescriptor)</span></span><span
data-ice="signature">(dataSchemaURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get DataSchemaDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getHypertyDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-getHypertyDescriptor)</span></span><span
data-ice="signature">(hypertyURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get HypertyDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getHypertyRuntimeURL](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-getHypertyRuntimeURL)</span></span><span
data-ice="signature">(): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

Get hypertyRuntimeURL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getSourcePackageFromURL](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-getSourcePackageFromURL)</span></span><span
data-ice="signature">(sourcePackageURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get source Package from a URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getStubDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-getStubDescriptor)</span></span><span
data-ice="signature">(stubURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get StubDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[mockupDataSchemaDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-mockupDataSchemaDescriptor)</span></span><span
data-ice="signature">()</span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[mockupHypertyDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-mockupHypertyDescriptor)</span></span><span
data-ice="signature">()</span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[mockupStubDescriptor](../../../class/src/runtime/RuntimeCatalogue-Local.js~RuntimeCatalogue.html#instance-method-mockupStubDescriptor)</span></span><span
data-ice="signature">()</span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber7)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">runtimeURL</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber45)</span></span> </span> {#instance-set-runtimeURL data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">runtimeURL</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber55)</span></span> </span> {#instance-get-runtimeURL data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getDataSchemaDescriptor</span><span data-ice="signature">(dataSchemaURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber344)</span></span> </span> {#instance-method-getDataSchemaDescriptor data-ice="anchor"}

<div data-ice="description">

Get DataSchemaDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
dataSchemaURL
<span>\*</span>
e.g. mydomain.com/.well-known/dataschema/MyDataSchema

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getHypertyDescriptor</span><span data-ice="signature">(hypertyURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber183)</span></span> </span> {#instance-method-getHypertyDescriptor data-ice="anchor"}

<div data-ice="description">

Get HypertyDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
hypertyURL
<span>\*</span>
e.g. mydomain.com/.well-known/hyperty/MyHyperty

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getHypertyRuntimeURL</span><span data-ice="signature">(): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber63)</span></span> </span> {#instance-method-getHypertyRuntimeURL data-ice="anchor"}

<div data-ice="description">

Get hypertyRuntimeURL

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getSourcePackageFromURL</span><span data-ice="signature">(sourcePackageURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber244)</span></span> </span> {#instance-method-getSourcePackageFromURL data-ice="anchor"}

<div data-ice="description">

Get source Package from a URL

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
sourcePackageURL
<span>\*</span>
e.g. mydomain.com/.well-known/hyperty/MyHyperty/sourcePackage

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getStubDescriptor</span><span data-ice="signature">(stubURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber284)</span></span> </span> {#instance-method-getStubDescriptor data-ice="anchor"}

<div data-ice="description">

Get StubDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
stubURL
<span>\*</span>
e.g. mydomain.com/.well-known/protostub/MyProtostub

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">mockupDataSchemaDescriptor</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber35)</span></span> </span> {#instance-method-mockupDataSchemaDescriptor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">mockupHypertyDescriptor</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber14)</span></span> </span> {#instance-method-mockupHypertyDescriptor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">mockupStubDescriptor</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue-Local.js.html#lineNumber25)</span></span> </span> {#instance-method-mockupStubDescriptor data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

RuntimeCatalogue {#runtimecatalogue data-ice="name"}
================

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(nodeHttp: <span>\*</span>, nodeHttps:
<span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[runtimeURL](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-set-runtimeURL)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[runtimeURL](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-get-runtimeURL)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getDataSchemaDescriptor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getDataSchemaDescriptor)</span></span><span
data-ice="signature">(dataSchemaURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get DataSchemaDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getHypertyDescriptor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getHypertyDescriptor)</span></span><span
data-ice="signature">(hypertyURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get HypertyDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getHypertyRuntimeURL](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getHypertyRuntimeURL)</span></span><span
data-ice="signature">(): <span>\*</span></span>

</div>

<div>

<div data-ice="description">

Get hypertyRuntimeURL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getRuntimeDescriptor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getRuntimeDescriptor)</span></span><span
data-ice="signature">(runtimeURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get RuntimeDescriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getSourceCodeFromDescriptor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getSourceCodeFromDescriptor)</span></span><span
data-ice="signature">(descriptor: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Returns the sourceCode of a given descriptor

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getSourcePackageFromURL](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getSourcePackageFromURL)</span></span><span
data-ice="signature">(sourcePackageURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get source Package from a URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getStubDescriptor](../../../class/src/runtime/RuntimeCatalogue.js~RuntimeCatalogue.html#instance-method-getStubDescriptor)</span></span><span
data-ice="signature">(stubURL: <span>\*</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Get StubDescriptor

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(nodeHttp: <span>\*</span>, nodeHttps: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber7)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
nodeHttp
<span>\*</span>
nodeHttps
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">runtimeURL</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber15)</span></span> </span> {#instance-set-runtimeURL data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">runtimeURL</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber20)</span></span> </span> {#instance-get-runtimeURL data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getDataSchemaDescriptor</span><span data-ice="signature">(dataSchemaURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber251)</span></span> </span> {#instance-method-getDataSchemaDescriptor data-ice="anchor"}

<div data-ice="description">

Get DataSchemaDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
dataSchemaURL
<span>\*</span>
e.g. mydomain.com/.well-known/dataschema/MyDataSchema

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getHypertyDescriptor</span><span data-ice="signature">(hypertyURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber145)</span></span> </span> {#instance-method-getHypertyDescriptor data-ice="anchor"}

<div data-ice="description">

Get HypertyDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
hypertyURL
<span>\*</span>
e.g. mydomain.com/.well-known/hyperty/MyHyperty

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getHypertyRuntimeURL</span><span data-ice="signature">(): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber28)</span></span> </span> {#instance-method-getHypertyRuntimeURL data-ice="anchor"}

<div data-ice="description">

Get hypertyRuntimeURL

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getRuntimeDescriptor</span><span data-ice="signature">(runtimeURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber193)</span></span> </span> {#instance-method-getRuntimeDescriptor data-ice="anchor"}

<div data-ice="description">

Get RuntimeDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
runtimeURL
<span>\*</span>
e.g. mydomain.com/.well-known/runtime/MyRuntime

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getSourceCodeFromDescriptor</span><span data-ice="signature">(descriptor: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber391)</span></span> </span> {#instance-method-getSourceCodeFromDescriptor data-ice="anchor"}

<div data-ice="description">

Returns the sourceCode of a given descriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
descriptor
<span>\*</span>
Catalogue Object that was retrieved using e.g. getHypertyDescriptor()

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getSourcePackageFromURL</span><span data-ice="signature">(sourcePackageURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber298)</span></span> </span> {#instance-method-getSourcePackageFromURL data-ice="anchor"}

<div data-ice="description">

Get source Package from a URL

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
sourcePackageURL
<span>\*</span>
e.g. mydomain.com/.well-known/hyperty/MyHyperty/sourcePackage

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getStubDescriptor</span><span data-ice="signature">(stubURL: <span>\*</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeCatalogue.js.html#lineNumber327)</span></span> </span> {#instance-method-getStubDescriptor data-ice="anchor"}

<div data-ice="description">

Get StubDescriptor

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-6 data-ice="title"}

Name
Type
Attribute
Description
stubURL
<span>\*</span>
e.g. mydomain.com/.well-known/protostub/MyProtostub

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  ------------------------------------------------------------------------------------------------------------------
  <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>
  ------------------------------------------------------------------------------------------------------------------

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)

<div class="self-detail detail">

RuntimeUA {#runtimeua data-ice="name"}
=========

<div class="description" data-ice="description">

Runtime User Agent Interface will process all the dependecies of the
core runtime;

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(sandboxFactory: <span>sandboxFactory</span>,
domainURL: <span>domain</span>)</span>

</div>

<div>

<div data-ice="description">

Create a new instance of Runtime User Agent

</div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[checkForUpdate](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-method-checkForUpdate)</span></span><span
data-ice="signature">(url: <span>CatalogueURL</span>)</span>

</div>

<div>

<div data-ice="description">

Used to check for updates about components handled in the Catalogue
including protocol stubs and Hyperties.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[discoverHiperty](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-method-discoverHiperty)</span></span><span
data-ice="signature">(descriptor:
<span>CatalogueDataObject.HypertyDescriptor</span>)</span>

</div>

<div>

<div data-ice="description">

Accomodate interoperability in H2H and proto on the fly for newly
discovered devices in M2M

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[loadHyperty](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-method-loadHyperty)</span></span><span
data-ice="signature">(hyperty: <span>URL.HypertyCatalogueURL</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Deploy Hyperty from Catalogue URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[loadStub](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-method-loadStub)</span></span><span
data-ice="signature">(domain: <span>URL.URL</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Deploy Stub from Catalogue URL or domain url

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerHyperty](../../../class/src/runtime/RuntimeUA.js~RuntimeUA.html#instance-method-registerHyperty)</span></span><span
data-ice="signature">(Object:
<span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>,
descriptor: <span>URL.HypertyCatalogueURL</span>)</span>

</div>

<div>

<div data-ice="description">

Register Hyperty deployed by the App that is passed as input parameter.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(sandboxFactory: <span>sandboxFactory</span>, domainURL: <span>domain</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber33)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Create a new instance of Runtime User Agent

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
sandboxFactory
<span>sandboxFactory</span>
Specific implementation for the environment where the core runtime will
run;

domainURL
<span>domain</span>
specify the domain base for the runtime;

</div>

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkForUpdate</span><span data-ice="signature">(url: <span>CatalogueURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber451)</span></span> </span> {#instance-method-checkForUpdate data-ice="anchor"}

<div data-ice="description">

Used to check for updates about components handled in the Catalogue
including protocol stubs and Hyperties. check relationship with
lifecycle management provided by Service Workers

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
url
<span>CatalogueURL</span>
url

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">discoverHiperty</span><span data-ice="signature">(descriptor: <span>CatalogueDataObject.HypertyDescriptor</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber114)</span></span> </span> {#instance-method-discoverHiperty data-ice="anchor"}

<div data-ice="description">

Accomodate interoperability in H2H and proto on the fly for newly
discovered devices in M2M

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
descriptor
<span>CatalogueDataObject.HypertyDescriptor</span>
descriptor

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">loadHyperty</span><span data-ice="signature">(hyperty: <span>URL.HypertyCatalogueURL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber131)</span></span> </span> {#instance-method-loadHyperty data-ice="anchor"}

<div data-ice="description">

Deploy Hyperty from Catalogue URL

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
hyperty
<span>URL.HypertyCatalogueURL</span>
hypertyDescriptor url;

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">loadStub</span><span data-ice="signature">(domain: <span>URL.URL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber297)</span></span> </span> {#instance-method-loadStub data-ice="anchor"}

<div data-ice="description">

Deploy Stub from Catalogue URL or domain url

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
domain
<span>URL.URL</span>
domain

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

  -----------------
  <span>\*</span>
  -----------------

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerHyperty</span><span data-ice="signature">(Object: <span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>, descriptor: <span>URL.HypertyCatalogueURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber123)</span></span> </span> {#instance-method-registerHyperty data-ice="anchor"}

<div data-ice="description">

Register Hyperty deployed by the App that is passed as input parameter.
To be used when App and Hyperties are from the same domain otherwise the
RuntimeUA will raise an exception and the App has to use the
loadHyperty(..) function.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
Object
<span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>
hypertyInstance

descriptor
<span>URL.HypertyCatalogueURL</span>
descriptor

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

Sandbox {#sandbox data-ice="name"}
=======

<div class="flat-list" data-ice="extendsChain">

#### Extends:

<div>

<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span> →
Sandbox

</div>

</div>

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-constructor-constructor)</span></span>

</div>

<div>

</div>

</div>

<div data-ice="methodSummary">

Method Summary
--------------

Public Methods
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[deployComponent](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-method-deployComponent)</span></span><span
data-ice="signature">(componentSourceCode:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
componentURL: <span>URL</span>, configuration: <span>Config</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Deploy an instance of the component into the sandbox.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeComponent](../../../class/src/sandbox/Sandbox.js~Sandbox.html#instance-method-removeComponent)</span></span><span
data-ice="signature">(componentURL: <span>URL</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Remove the instance of a previously deployed component.

</div>

</div>

</div>

<div class="inherited-summary" data-ice="inheritedSummary">

Inherited Summary
-----------------

<span class="toggle closed"></span> From class
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[pipeline](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-get-pipeline)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, listener:
<span>Listener</span>): <span>MsgListener</span></span>

</div>

<div>

<div data-ice="description">

Register listener to receive message when "msg.to === url".

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-addResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>,
responseListener:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>)</span>

</div>

<div>

<div data-ice="description">

Manually add a response listener.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[bind](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-bind)</span></span><span
data-ice="signature">(outUrl: <span>URL</span>, inUrl: <span>URL</span>,
target:
<span>[MiniBus](../../../class/src/bus/MiniBus.js~MiniBus.html)</span>):
<span>Bound</span></span>

</div>

<div>

<div data-ice="description">

Helper method to bind listeners (in both directions) into other MiniBus
target.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[postMessage](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-postMessage)</span></span><span
data-ice="signature">(msg: <span>Message</span>, responseCallback:
<span>[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)</span>):
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span></span>

</div>

<div>

<div data-ice="description">

Send messages to local listeners, or if not exists to external
listeners.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeAllListenersOf](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeAllListenersOf)</span></span><span
data-ice="signature">(url: <span>URL</span>)</span>

</div>

<div>

<div data-ice="description">

Remove all existent listeners for the URL

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeResponseListener](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-method-removeResponseListener)</span></span><span
data-ice="signature">(url: <span>URL</span>, msgId:
<span>[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove the response listener.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber11)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="override">

#### Override:

<span>[MiniBus\#constructor](../../../class/src/bus/MiniBus.js~MiniBus.html#instance-constructor-constructor)</span>

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">deployComponent</span><span data-ice="signature">(componentSourceCode: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, componentURL: <span>URL</span>, configuration: <span>Config</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber29)</span></span> </span> {#instance-method-deployComponent data-ice="anchor"}

<div data-ice="description">

Deploy an instance of the component into the sandbox.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
componentSourceCode
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
Component source code (Hyperty, ProtoStub, etc)

componentURL
<span>URL</span>
Hyperty, ProtoStub, or any other component address.

configuration
<span>Config</span>
Config parameters of the component

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | return deployed if successful, or    |
| zilla.org/en-US/docs/Web/JavaScript/ | any other string with an error       |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>[string](https://devel |                                      |
| oper.mozilla.org/en-US/docs/Web/Java |                                      |
| Script/Reference/Global_Objects/Stri |                                      |
| ng)</span>&gt;                       |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeComponent</span><span data-ice="signature">(componentURL: <span>URL</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span>&lt;<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/Sandbox.js.html#lineNumber62)</span></span> </span> {#instance-method-removeComponent data-ice="anchor"}

<div data-ice="description">

Remove the instance of a previously deployed component.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
componentURL
<span>URL</span>
Hyperty, ProtoStub, or any other component address.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | return undeployed if successful, or  |
| zilla.org/en-US/docs/Web/JavaScript/ | any other string with an error       |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>&lt;<span>[string](https://devel |                                      |
| oper.mozilla.org/en-US/docs/Web/Java |                                      |
| Script/Reference/Global_Objects/Stri |                                      |
| ng)</span>&gt;                       |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

SandboxRegistry {#sandboxregistry data-ice="name"}
===============

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/sandbox/SandboxRegistry.js~SandboxRegistry.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(bus: <span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[components](../../../class/src/sandbox/SandboxRegistry.js~SandboxRegistry.html#instance-get-components)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(bus: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/SandboxRegistry.js.html#lineNumber13)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
bus
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">components</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/sandbox/SandboxRegistry.js.html#lineNumber36)</span></span> </span> {#instance-get-components data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
<div class="self-detail detail">

SyncherManager {#synchermanager data-ice="name"}
==============

</div>

<div data-ice="constructorSummary">

Constructor Summary
-------------------

Public Constructor
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[constructor](../../../class/src/syncher/SyncherManager.js~SyncherManager.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(runtimeURL: <span>\*</span>, bus: <span>\*</span>,
registry: <span>\*</span>, catalog: <span>\*</span>, allocator:
<span>\*</span>)</span>

</div>

<div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[url](../../../class/src/syncher/SyncherManager.js~SyncherManager.html#instance-get-url)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(runtimeURL: <span>\*</span>, bus: <span>\*</span>, registry: <span>\*</span>, catalog: <span>\*</span>, allocator: <span>\*</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/syncher/SyncherManager.js.html#lineNumber18)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
runtimeURL
<span>\*</span>
bus
<span>\*</span>
registry
<span>\*</span>
catalog
<span>\*</span>
allocator
<span>\*</span>

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">url</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/syncher/SyncherManager.js.html#lineNumber50)</span></span> </span> {#instance-get-url data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
