<div class="navbar navbar-default navbar-fixed-top">

<div class="container">

<div class="navbar-header">

[Documentation](index.html){.navbar-brand}
<span class="icon-bar"></span> <span class="icon-bar"></span> <span
class="icon-bar"></span>

</div>

<div id="topNavigation" class="navbar-collapse collapse">

-   [Modules****](modules.list.html){.dropdown-toggle}
    -   [utils](module-utils.html)
-   [Classes****](classes.list.html){.dropdown-toggle}
    -   [AddressAllocation](AddressAllocation.html)
    -   [BloomFilter](BloomFilter.html)
    -   [EventEmitter](EventEmitter.html)
    -   [GlobalRegistryRecord](GlobalRegistryRecord.html)
    -   [GraphConnector](GraphConnector.html)
    -   [GraphConnectorContactData](GraphConnectorContactData.html)
    -   [HypertyDiscovery](HypertyDiscovery.html)
    -   [HypertyInstance](HypertyInstance.html)
    -   [IdentityModule](IdentityModule.html)
    -   [MessageBus](MessageBus.html)
    -   [MiniBus](MiniBus.html)
    -   [ObjectAllocation](ObjectAllocation.html)
    -   [Pipeline](Pipeline.html)
    -   [PolicyEngine](PolicyEngine.html)
    -   [ProtoStub](ProtoStub.html)
    -   [QoSUA](QoSUA.html)
    -   [Registry](Registry.html)
    -   [RegistryDataModel](RegistryDataModel.html)
    -   [RuntimeUA](RuntimeUA.html)
    -   [Sandbox](Sandbox.html)
    -   [SandboxRegistry](SandboxRegistry.html)
    -   [SyncherManager](SyncherManager.html)

<div class="col-sm-3 col-md-3">

<div class="input-group">

<div class="input-group-btn">

**

</div>

</div>

</div>

</div>

</div>

</div>

<div id="toc-content" class="container">

<div class="row">

<div class="col-md-8">

<div id="main">

Class: Registry {#class-registry .page-title}
===============

<div class="section">

Registry
--------

<div class="class-description">

Runtime Registry Interface

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new Registry(msgbus, runtimeURL, appSandbox, remoteRegistry) {#Registry .name}

<div class="description">

To initialise the Runtime Registry with the RuntimeURL that will be the
basis to derive the internal runtime addresses when allocating addresses
to internal runtime component. In addition, the Registry domain back-end
to be used to remotely register Runtime components, is also passed as
input parameter.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `msgbus`                 | <span                    | msgbus                   |
|                          | class="param-type">[Mess |                          |
|                          | ageBus](MessageBus.html) |                          |
|                          | </span>                  |                          |
+--------------------------+--------------------------+--------------------------+
| `runtimeURL`             | <span                    | runtimeURL               |
|                          | class="param-type">Hyper |                          |
|                          | tyRuntimeURL</span>      |                          |
+--------------------------+--------------------------+--------------------------+
| `appSandbox`             | <span                    | appSandbox               |
|                          | class="param-type">AppSa |                          |
|                          | ndbox</span>             |                          |
+--------------------------+--------------------------+--------------------------+
| `remoteRegistry`         | <span                    | remoteRegistry           |
|                          | class="param-type">Domai |                          |
|                          | nURL</span>              |                          |
+--------------------------+--------------------------+--------------------------+

</div>

### Members {#members .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>messageBus<span class="type-signature"></span>

return the messageBus in this Registry

.
<div class="description">

return the messageBus in this Registry

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>messageBus<span class="type-signature"></span>

Set the messageBus in this Registry

.
<div class="description">

Set the messageBus in this Registry

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>discoverProtostub(DomainURL) {#discoverProtostub .name}

To discover protocol stubs available in the runtime for a certain
domain.

<div class="description">

To discover protocol stubs available in the runtime for a certain
domain. If available, it returns the runtime url for the protocol stub
that connects to the requested domain. Required by the runtime BUS to
route messages to remote servers or peers (do we need something similar
for Hyperties?).

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `DomainURL`              | <span                    | url                      |
|                          | class="param-type">Domai |                          |
|                          | nURL</span>              |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

RuntimeURL

</div>

 Type 
:   <span class="param-type">RuntimeURL</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>getAppSandbox() {#getAppSandbox .name}

This function is used to return the sandbox instance where the
Application is executing.

<div class="description">

This function is used to return the sandbox instance where the
Application is executing. It is assumed there is just one App per
Runtime instance.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>getSandbox(DomainURL) {#getSandbox .name}

To discover sandboxes available in the runtime for a certain domain.

<div class="description">

To discover sandboxes available in the runtime for a certain domain.
Required by the runtime UA to avoid more than one sandbox for the same
domain.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `DomainURL`              | <span                    | url                      |
|                          | class="param-type">Domai |                          |
|                          | nURL</span>              |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

RuntimeSandbox

</div>

 Type 
:   <span class="param-type">RuntimeSandbox</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>getUserHyperty() {#getUserHyperty .name}

Function to query the Domain registry, with an user email.

<div class="description">

Function to query the Domain registry, with an user email.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>onEvent() {#onEvent .name}

To receive status events from components registered in the Registry.

<div class="description">

To receive status events from components registered in the Registry.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `Message.Message`        | <span                    | event                    |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerHyperty(sandbox, HypertyCatalogueURL) {#registerHyperty .name}

To register a new Hyperty in the runtime which returns the HypertyURL
allocated to the new Hyperty.

<div class="description">

To register a new Hyperty in the runtime which returns the HypertyURL
allocated to the new Hyperty.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `sandbox`                | <span                    | sandbox                  |
|                          | class="param-type">[Sand |                          |
|                          | box](Sandbox.html)</span |                          |
|                          | >                        |                          |
+--------------------------+--------------------------+--------------------------+
| `HypertyCatalogueURL`    | <span                    | descriptor               |
|                          | class="param-type">Hyper |                          |
|                          | tyCatalogueURL</span>    |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

HypertyURL

</div>

 Type 
:   <span class="param-type">HypertyURL</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerPEP(postMessage, HypertyURL) {#registerPEP .name}

To register a new Policy Enforcer in the runtime including as input
parameters the function to postMessage, the HypertyURL associated with
the PEP, which returns the RuntimeURL allocated to the new Policy
Enforcer component.

<div class="description">

To register a new Policy Enforcer in the runtime including as input
parameters the function to postMessage, the HypertyURL associated with
the PEP, which returns the RuntimeURL allocated to the new Policy
Enforcer component.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `postMessage`            | <span                    | postMessage              |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
+--------------------------+--------------------------+--------------------------+
| `HypertyURL`             | <span                    | hyperty                  |
|                          | class="param-type">Hyper |                          |
|                          | tyURL</span>             |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

HypertyRuntimeURL

</div>

 Type 
:   <span class="param-type">HypertyRuntimeURL</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerStub(Sandbox, DomainURL) {#registerStub .name}

To register a new Protocol Stub in the runtime including as input
parameters the function to postMessage, the DomainURL that is connected
with the stub, which returns the RuntimeURL allocated to the new
ProtocolStub.

<div class="description">

To register a new Protocol Stub in the runtime including as input
parameters the function to postMessage, the DomainURL that is connected
with the stub, which returns the RuntimeURL allocated to the new
ProtocolStub.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `Sandbox`                | <span                    |                          |
|                          | class="param-type">[Sand |                          |
|                          | box](Sandbox.html)</span |                          |
|                          | >                        |                          |
+--------------------------+--------------------------+--------------------------+
| `DomainURL`              | <span                    | service provider domain  |
|                          | class="param-type">Domai |                          |
|                          | nURL</span>              |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

 Type 
:   <span class="param-type">RuntimeProtoStubURL</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>resolve(url) {#resolve .name}

To verify if source is valid and to resolve target runtime url address
if needed (eg protostub runtime url in case the message is to be
dispatched to a remote endpoint).

<div class="description">

To verify if source is valid and to resolve target runtime url address
if needed (eg protostub runtime url in case the message is to be
dispatched to a remote endpoint).

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | url                      |
|                          | class="param-type">URL.U |                          |
|                          | RL</span>                |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

Promise

</div>

 Type 
:   <span class="param-type">Promise.&lt;URL.URL&gt;</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>unregisterHyperty(HypertyURL) {#unregisterHyperty .name}

To unregister a previously registered Hyperty

.
<div class="description">

To unregister a previously registered Hyperty

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `HypertyURL`             | <span                    | url url                  |
|                          | class="param-type">Hyper |                          |
|                          | tyURL</span>             |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>unregisterPEP(HypertyRuntimeURL) {#unregisterPEP .name}

To unregister a previously registered protocol stub

.
<div class="description">

To unregister a previously registered protocol stub

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `HypertyRuntimeURL`      | <span                    | HypertyRuntimeURL        |
|                          | class="param-type">Hyper |                          |
|                          | tyRuntimeURL</span>      |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>unregisterStub(HypertyRuntimeURL) {#unregisterStub .name}

To unregister a previously registered protocol stub

.
<div class="description">

To unregister a previously registered protocol stub

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `HypertyRuntimeURL`      | <span                    | hypertyRuntimeURL        |
|                          | class="param-type">Hyper |                          |
|                          | tyRuntimeURL</span>      |                          |
+--------------------------+--------------------------+--------------------------+

</div>

</div>

</div>

<div class="clearfix">

</div>

<div class="col-md-3">

<div id="toc" class="col-md-3 hidden-xs hidden-sm hidden-md">

</div>

</div>

</div>

</div>

<div id="searchResults" class="modal fade">

<div class="modal-dialog">

<div class="modal-content">

<div class="modal-header">

<span aria-hidden="true">×</span>
#### Search results {#search-results .modal-title}

</div>

<div class="modal-body">

</div>

<div class="modal-footer">

Close

</div>

</div>

</div>

</div>

<span class="jsdoc-message"> Documentation generated by [JSDoc
3.4.0](https://github.com/jsdoc3/jsdoc) on January 26th 2016, 6:27:00 pm
using the [DocStrap template](https://github.com/docstrap/docstrap).
</span>
