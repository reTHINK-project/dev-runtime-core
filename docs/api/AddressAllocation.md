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

Class: AddressAllocation {#class-addressallocation .page-title}
========================

<div class="section">

AddressAllocation
-----------------

<div class="class-description">

Class will ask to the message node for addresses

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new AddressAllocation(url, bus) {#AddressAllocation .name}

<div class="description">

Create an Address Allocation

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | url from who is sending  |
|                          | class="param-type">URL.U | the message              |
|                          | RL</span>                |                          |
+--------------------------+--------------------------+--------------------------+
| `bus`                    | <span                    | MiniBus used for address |
|                          | class="param-type">[Mini | allocation               |
|                          | Bus](MiniBus.html)</span |                          |
|                          | >                        |                          |
+--------------------------+--------------------------+--------------------------+

</div>

### Members {#members .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>url<span class="type-signature"></span>

get the URL value

.
<div class="description">

get the URL value

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>create(domain, number) {#create .name}

Ask for creation of a number of Hyperty addresses, to the domain message
node.

<div class="description">

Ask for creation of a number of Hyperty addresses, to the domain message
node.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `domain`                 | <span                    | Domain of the message    |
|                          | class="param-type">Domai | node.                    |
|                          | n</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `number`                 | <span                    | Number of addresses to   |
|                          | class="param-type">numbe | request                  |
|                          | r</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

A list of HypertyURL’s

</div>

 Type 
:   <span class="param-type">Promise.&lt;HypertyURL&gt;</span>

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
