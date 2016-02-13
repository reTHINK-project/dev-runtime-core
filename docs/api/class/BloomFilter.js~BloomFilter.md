</div>

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
