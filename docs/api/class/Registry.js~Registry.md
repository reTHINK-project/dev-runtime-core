</div>

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
