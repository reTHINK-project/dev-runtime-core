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

Class: RuntimeUA {#class-runtimeua .page-title}
================

<div class="section">

RuntimeUA
---------

<div class="class-description">

Runtime User Agent Interface will process all the dependecies of the
core runtime;

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new RuntimeUA(sandboxFactory, domainURL) {#RuntimeUA .name}

<div class="description">

Create a new instance of Runtime User Agent

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `sandboxFactory`         | <span                    | Specific implementation  |
|                          | class="param-type">sandb | for the environment      |
|                          | oxFactory</span>         | where the core runtime   |
|                          |                          | will run;                |
+--------------------------+--------------------------+--------------------------+
| `domainURL`              | <span                    | specify the domain base  |
|                          | class="param-type">domai | for the runtime;         |
|                          | n</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

##### Properties: {#properties .subsection-title}

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `sandboxFactory`         | <span                    | Specific implementation  |
|                          | class="param-type">sandb | of sandbox;              |
|                          | oxFactory</span>         |                          |
+--------------------------+--------------------------+--------------------------+
| `runtimeCatalogue`       | <span                    | Catalogue of components  |
|                          | class="param-type">[Runt | can be installed;        |
|                          | imeCatalogue](RuntimeCat |                          |
|                          | alogue.html)</span>      |                          |
+--------------------------+--------------------------+--------------------------+
| `runtimeURL`             | <span                    | This identify the core   |
|                          | class="param-type">runti | runtime, should be       |
|                          | meURL</span>             | unique;                  |
+--------------------------+--------------------------+--------------------------+
| `identityModule`         | <span                    | Identity Module;         |
|                          | class="param-type">[Iden |                          |
|                          | tityModule](IdentityModu |                          |
|                          | le.html)</span>          |                          |
+--------------------------+--------------------------+--------------------------+
| `policyEngine`           | <span                    | Policy Engine Module;    |
|                          | class="param-type">[Poli |                          |
|                          | cyEngine](PolicyEngine.h |                          |
|                          | tml)</span>              |                          |
+--------------------------+--------------------------+--------------------------+
| `registry`               | <span                    | Registry Module;         |
|                          | class="param-type">[Regi |                          |
|                          | stry](Registry.html)</sp |                          |
|                          | an>                      |                          |
+--------------------------+--------------------------+--------------------------+
| `messageBus`             | <span                    | Message Bus is used like |
|                          | class="param-type">[Mess | a router to redirect the |
|                          | ageBus](MessageBus.html) | messages from one        |
|                          | </span>                  | component to other(s)    |
+--------------------------+--------------------------+--------------------------+

Version:
-   0.2.0

Author:
-   &lt;p&gt;Vitor Silva \[vitor-t-silva@telecom.pt\]&lt;/p&gt;

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>checkForUpdate(url) {#checkForUpdate .name}

Used to check for updates about components handled in the Catalogue
including protocol stubs and Hyperties.

<div class="description">

Used to check for updates about components handled in the Catalogue
including protocol stubs and Hyperties. check relationship with
lifecycle management provided by Service Workers

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `url`                    | <span                    | url                      |
|                          | class="param-type">Catal |                          |
|                          | ogueURL</span>           |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>discoverHiperty(descriptor) {#discoverHiperty .name}

Accomodate interoperability in H2H and proto on the fly for newly
discovered devices in M2M

.
<div class="description">

Accomodate interoperability in H2H and proto on the fly for newly
discovered devices in M2M

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `descriptor`             | <span                    | descriptor               |
|                          | class="param-type">Catal |                          |
|                          | ogueDataObject.HypertyDe |                          |
|                          | scriptor</span>          |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>loadHyperty(hyperty) {#loadHyperty .name}

Deploy Hyperty from Catalogue URL

.
<div class="description">

Deploy Hyperty from Catalogue URL

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `hyperty`                | <span                    | hypertyDescriptor url;   |
|                          | class="param-type">URL.H |                          |
|                          | ypertyCatalogueURL</span |                          |
|                          | >                        |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>loadStub(domain) {#loadStub .name}

Deploy Stub from Catalogue URL or domain url

.
<div class="description">

Deploy Stub from Catalogue URL or domain url

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `domain`                 | <span                    | domain                   |
|                          | class="param-type">URL.U |                          |
|                          | RL</span>                |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerHyperty(Object, descriptor) {#registerHyperty .name}

Register Hyperty deployed by the App that is passed as input parameter.

<div class="description">

Register Hyperty deployed by the App that is passed as input parameter.
To be used when App and Hyperties are from the same domain otherwise the
RuntimeUA will raise an exception and the App has to use the
loadHyperty(..) function.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `Object`                 | <span                    | hypertyInstance          |
|                          | class="param-type">Objec |                          |
|                          | t</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `descriptor`             | <span                    | descriptor               |
|                          | class="param-type">URL.H |                          |
|                          | ypertyCatalogueURL</span |                          |
|                          | >                        |                          |
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
