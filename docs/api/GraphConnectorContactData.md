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

Class: GraphConnectorContactData {#class-graphconnectorcontactdata .page-title}
================================

<div class="section">

GraphConnectorContactData
-------------------------

<div class="class-description">

Represents information about a contact.

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new GraphConnectorContactData(guid, firstName, lastName) {#GraphConnectorContactData .name}

<div class="description">

Constructs a new object representing information about one contact.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `guid`                   | <span                    | The GUID of the new      |
|                          | class="param-type">Strin | contact.                 |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `firstName`              | <span                    | The first name of the    |
|                          | class="param-type">Strin | new contact.             |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `lastName`               | <span                    | The last name of the new |
|                          | class="param-type">Strin | contact.                 |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

Author:

:   -   beierle@tu-berlin.de

</div>

### Members {#members .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>contactsBloomFilter1Hop<span class="type-signature"></span>

Returns the Bloom filter containing the hashed GUIDs of the contacts for
the contact.

<div class="description">

Returns the Bloom filter containing the hashed GUIDs of the contacts for
the contact.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>contactsBloomFilter1Hop<span class="type-signature"></span>

Sets the friends-of-friends Bloom filter containing the hashed GUIDs of
the contacts for the contact.

<div class="description">

Sets the friends-of-friends Bloom filter containing the hashed GUIDs of
the contacts for the contact.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>firstName<span class="type-signature"></span>

Sets the first name.

<div class="description">

Sets the first name.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>firstName<span class="type-signature"></span>

Returns the first name.

<div class="description">

Returns the first name.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>guid<span class="type-signature"></span>

Sets the GUID.

<div class="description">

Sets the GUID.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>guid<span class="type-signature"></span>

Returns the GUID.

<div class="description">

Returns the GUID.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>lastName<span class="type-signature"></span>

Sets the last name.

<div class="description">

Sets the last name.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>lastName<span class="type-signature"></span>

Returns the last name.

<div class="description">

Returns the last name.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>privateContact<span class="type-signature"></span>

Returns the privacy status of the contact.

<div class="description">

Returns the privacy status of the contact.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>privateContact<span class="type-signature"></span>

Sets the privacy status of the contact according to the given Boolean
value.

<div class="description">

Sets the privacy status of the contact according to the given Boolean
value.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>residenceLocation<span class="type-signature"></span>

Returns the geohash of the residence location.

<div class="description">

Returns the geohash of the residence location.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>residenceLocation<span class="type-signature"></span>

Sets the geohash of the residence location.

<div class="description">

Sets the geohash of the residence location.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>userIDs<span class="type-signature"></span>

Sets the userIDs.

<div class="description">

Sets the userIDs.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>userIDs<span class="type-signature"></span>

Returns the user IDs.

<div class="description">

Returns the user IDs.

</div>

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
