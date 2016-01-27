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

Class: Sandbox {#class-sandbox .page-title}
==============

<div class="section">

Sandbox
-------

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new Sandbox() {#Sandbox .name}

Author:

:   -   micaelpedrosa@gmail.com Base class to implement external sandbox
        component

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>deployComponent(componentSourceCode, componentURL, configuration) {#deployComponent .name}

Deploy an instance of the component into the sandbox.

<div class="description">

Deploy an instance of the component into the sandbox.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `componentSourceCode`    | <span                    | Component source code    |
|                          | class="param-type">strin | (Hyperty, ProtoStub,     |
|                          | g</span>                 | etc)                     |
+--------------------------+--------------------------+--------------------------+
| `componentURL`           | <span                    | Hyperty, ProtoStub, or   |
|                          | class="param-type">URL</ | any other component      |
|                          | span>                    | address.                 |
+--------------------------+--------------------------+--------------------------+
| `configuration`          | <span                    | Config parameters of the |
|                          | class="param-type">Confi | component                |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

return deployed if successful, or any other string with an error

</div>

 Type 
:   <span class="param-type">Promise.&lt;string&gt;</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>removeComponent(componentURL) {#removeComponent .name}

Remove the instance of a previously deployed component.

<div class="description">

Remove the instance of a previously deployed component.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `componentURL`           | <span                    | Hyperty, ProtoStub, or   |
|                          | class="param-type">URL</ | any other component      |
|                          | span>                    | address.                 |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

return undeployed if successful, or any other string with an error

</div>

 Type 
:   <span class="param-type">Promise.&lt;string&gt;</span>

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
