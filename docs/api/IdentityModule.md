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

Class: IdentityModule {#class-identitymodule .page-title}
=====================

<div class="section">

IdentityModule
--------------

<div class="class-description">

IdentityModule

Initial specification: D4.1

The IdentityModule is a component managing user Identity. It downloads,
instantiates and manage Identity Provider Proxy (IdP) for its own user
identity or for external user identity verification.

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new IdentityModule() {#IdentityModule .name}

<div class="description">

USER’S OWN IDENTITY

</div>

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>generateAssertion(contents, origin, usernameHint) {#generateAssertion .name}

Generates an Identity Assertion for a call session

.
<div class="description">

Generates an Identity Assertion for a call session

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `contents`               | <span                    | contents                 |
|                          | class="param-type">DOMSt |                          |
|                          | ring</span>              |                          |
+--------------------------+--------------------------+--------------------------+
| `origin`                 | <span                    | origin                   |
|                          | class="param-type">DOMSt |                          |
|                          | ring</span>              |                          |
+--------------------------+--------------------------+--------------------------+
| `usernameHint`           | <span                    | usernameHint             |
|                          | class="param-type">DOMSt |                          |
|                          | ring</span>              |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

IdAssertion

</div>

 Type 
:   <span class="param-type">IdAssertion</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>getAssertionTrustLevel(assertion) {#getAssertionTrustLevel .name}

Trust level evaluation of a received IdAssertion

.
<div class="description">

Trust level evaluation of a received IdAssertion

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `assertion`              | <span                    | assertion                |
|                          | class="param-type">DOMSt |                          |
|                          | ring</span>              |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>getIdentities() {#getIdentities .name}

Find and return all available identities that can be associated to the
Hyperty Instance

.
<div class="description">

Find and return all available identities that can be associated to the
Hyperty Instance

</div>

##### Returns:

<div class="param-desc">

Array Identities

</div>

 Type 
:   <span class="param-type">Array.&lt;Identities&gt;</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>loginWithRP(identifier, scope) {#loginWithRP .name}

In relation with a classical Relying Party: Login

.
<div class="description">

In relation with a classical Relying Party: Login

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `identifier`             | <span                    | identifier               |
|                          | class="param-type">Ident |                          |
|                          | ifier</span>             |                          |
+--------------------------+--------------------------+--------------------------+
| `scope`                  | <span                    | scope                    |
|                          | class="param-type">Scope |                          |
|                          | </span>                  |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

Promise IDToken

</div>

 Type 
:   <span class="param-type">Promise</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerIdentity() {#registerIdentity .name}

Register a new Identity with an Identity Provider

.
<div class="description">

Register a new Identity with an Identity Provider

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>registerWithRP() {#registerWithRP .name}

In relation with a classical Relying Party: Registration

.
<div class="description">

In relation with a classical Relying Party: Registration

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>setHypertyIdentity() {#setHypertyIdentity .name}

In relation with a Hyperty Instance: Associate identity

.
<div class="description">

In relation with a Hyperty Instance: Associate identity

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>validateAssertion(assertion) {#validateAssertion .name}

Verification of a received IdAssertion validity

.
<div class="description">

Verification of a received IdAssertion validity

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `assertion`              | <span                    | assertion                |
|                          | class="param-type">DOMSt |                          |
|                          | ring</span>              |                          |
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
