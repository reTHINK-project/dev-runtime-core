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

Class: PolicyEngine {#class-policyengine .page-title}
===================

<div class="section">

PolicyEngine
------------

<div class="class-description">

Core Policy Engine (PDP/PEP) Interface According to:
https://github.com/reTHINK-project/core-framework/blob/master/docs/specs/runtime/runtime-apis.md\#core-policy-engine-pdppep-interface

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new PolicyEngine(IdentityModule, Registry) {#PolicyEngine .name}

<div class="description">

To initialise the Policy Engine

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `IdentityModule`         |                          | identityModule           |
|                          |                          | identityModule           |
+--------------------------+--------------------------+--------------------------+
| `Registry`               |                          | runtimeRegistry          |
|                          |                          | runtimeRegistry          |
+--------------------------+--------------------------+--------------------------+

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>addPolicies(hyperty, policies) {#addPolicies .name}

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: ‘message.header.from’, target:
‘blacklist’, action: ‘deny’}

.
<div class="description">

To add policies to be enforced for a certain deployed Hyperty Instance
Example of an hyperty:
hyperty-instance://tecnico.pt/e1b8fb0b-95e2-4f44-aa18-b40984741196
Example of a policy: {subject: ‘message.header.from’, target:
‘blacklist’, action: ‘deny’}

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `hyperty`                | <span                    | hyperty                  |
|                          | class="param-type">URL.H |                          |
|                          | ypertyURL</span>         |                          |
+--------------------------+--------------------------+--------------------------+
| `policies`               | <span                    | policies                 |
|                          | class="param-type">Hyper |                          |
|                          | tyPolicyList</span>      |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>authorise(message) {#authorise .name}

Authorisation request to accept a Subscription for a certain resource.

<div class="description">

Authorisation request to accept a Subscription for a certain resource.
Returns a Response Message to be returned to Subscription requester

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `message`                | <span                    | message                  |
|                          | class="param-type">Messa |                          |
|                          | ge.Message</span>        |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

AuthorisationResponse

</div>

 Type 
:   <span class="param-type">AuthorisationResponse</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>removePolicies(hyperty) {#removePolicies .name}

To remove previously added policies for a certain deployed Hyperty
Instance

.
<div class="description">

To remove previously added policies for a certain deployed Hyperty
Instance

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `hyperty`                | <span                    | hyperty                  |
|                          | class="param-type">URL.H |                          |
|                          | ypertyURL</span>         |                          |
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
