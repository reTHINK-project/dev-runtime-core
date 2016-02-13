
</div>

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(sandboxFactory: <span>sandboxFactory</span>, domainURL: <span>domain</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber35)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkForUpdate</span><span data-ice="signature">(url: <span>CatalogueURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber456)</span></span> </span> {#instance-method-checkForUpdate data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">discoverHiperty</span><span data-ice="signature">(descriptor: <span>CatalogueDataObject.HypertyDescriptor</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber119)</span></span> </span> {#instance-method-discoverHiperty data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">loadHyperty</span><span data-ice="signature">(hyperty: <span>URL.HypertyCatalogueURL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber136)</span></span> </span> {#instance-method-loadHyperty data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">loadStub</span><span data-ice="signature">(domain: <span>URL.URL</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber302)</span></span> </span> {#instance-method-loadStub data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerHyperty</span><span data-ice="signature">(Object: <span>[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)</span>, descriptor: <span>URL.HypertyCatalogueURL</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/runtime/RuntimeUA.js.html#lineNumber128)</span></span> </span> {#instance-method-registerHyperty data-ice="anchor"}

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
