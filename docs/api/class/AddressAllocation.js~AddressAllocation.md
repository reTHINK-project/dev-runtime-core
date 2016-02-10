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
