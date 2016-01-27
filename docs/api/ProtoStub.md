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

Class: ProtoStub {#class-protostub .page-title}
================

<div class="section">

ProtoStub
---------

<div class="class-description">

ProtoStub Interface

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new ProtoStub(runtimeProtoStubURL, busPostMessage, configuration) {#ProtoStub .name}

<div class="description">

To initialise the protocol stub including as input parameters its
allocated component runtime url, the runtime BUS postMessage function to
be invoked on messages received by the protocol stub and required
configuration retrieved from protocolStub descriptor.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `runtimeProtoStubURL`    | <span                    | runtimeProtoSubURL       |
|                          | class="param-type">URL.R |                          |
|                          | untimeURL</span>         |                          |
+--------------------------+--------------------------+--------------------------+
| `busPostMessage`         | <span                    | configuration            |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
+--------------------------+--------------------------+--------------------------+
| `configuration`          | <span                    | configuration            |
|                          | class="param-type">Proto |                          |
|                          | StubDescriptor.Configura |                          |
|                          | tionDataList</span>      |                          |
+--------------------------+--------------------------+--------------------------+

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>connect(identity) {#connect .name}

To connect the protocol stub to the back-end server

.
<div class="description">

To connect the protocol stub to the back-end server

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `identity`               | <span                    | identity                 |
|                          | class="param-type">IDTok |                          |
|                          | en</span>                |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>disconnect() {#disconnect .name}

To disconnect the protocol stub.

<div class="description">

To disconnect the protocol stub.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>postMessage(message) {#postMessage .name}

To post messages to be dispatched by the protocol stub to connected
back-end server

.
<div class="description">

To post messages to be dispatched by the protocol stub to connected
back-end server

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `message`                | <span                    | message                  |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
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
