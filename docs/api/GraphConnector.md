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

Class: GraphConnector {#class-graphconnector .page-title}
=====================

<div class="section">

GraphConnector
--------------

<div class="class-description">

The Graph Connector contains the contact list/address book.

</div>

<div class="container-overview">

------------------------------------------------------------------------

#### <span class="type-signature"></span>new GraphConnector() {#GraphConnector .name}

<div class="description">

Constructs a new and empty Graph Connector.

</div>

Author:

:   -   beierle@tu-berlin.de

</div>

### Methods {#methods .subsection-title}

------------------------------------------------------------------------

#### <span class="type-signature"></span>\_createKeys(mnemonic, salt) {#_createKeys .name}

Creates the keys from mnemonic and salt.

<div class="description">

Creates the keys from mnemonic and salt. Also sets public key, guid, and
salt for globalRegistryRecord.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `mnemonic`               | <span                    | A string with 15 words.  |
|                          | class="param-type">strin |                          |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `salt`                   | <span                    | A word.                  |
|                          | class="param-type">strin |                          |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>addContact(guid, firstName, lastname) {#addContact .name}

Add a contact to the Graph Connector.

<div class="description">

Add a contact to the Graph Connector.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `guid`                   | <span                    | GUID of the new contact. |
|                          | class="param-type">strin |                          |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `firstName`              | <span                    | First name of the new    |
|                          | class="param-type">strin | contact.                 |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+
| `lastname`               | <span                    | Last name of the new     |
|                          | class="param-type">strin | contact.                 |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>addUserID(userID) {#addUserID .name}

Adds a UserID for the user.

<div class="description">

Adds a UserID for the user.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `userID`                 | <span                    | The UserID for a Domain  |
|                          | class="param-type">strin | Registry to add for the  |
|                          | g</span>                 | user.                    |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>calculateBloomFilter1Hop() {#calculateBloomFilter1Hop .name}

Calculates the Bloom filter containing all non-private contacts.

<div class="description">

Calculates the Bloom filter containing all non-private contacts.

</div>

------------------------------------------------------------------------

#### <span class="type-signature"></span>checkGUID(guid) {#checkGUID .name}

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

<div class="description">

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `guid`                   | <span                    | GUID of the contact to   |
|                          | class="param-type">strin | look for.                |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

relatedContacts List of related direct contacts and of related
friends-of-friends contacts.The format is: RelatedContacts,FoF&gt;.

</div>

 Type 
:   <span class="param-type">array</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>generateGUID() {#generateGUID .name}

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

<div class="description">

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

</div>

##### Returns:

<div class="param-desc">

mnemonic A string with 16 words.

</div>

 Type 
:   <span class="param-type">string</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>getContact(name) {#getContact .name}

Gets contacts by name.

<div class="description">

Gets contacts by name.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `name`                   | <span                    | First or last name to    |
|                          | class="param-type">strin | look for in the contact  |
|                          | g</span>                 | list.                    |
+--------------------------+--------------------------+--------------------------+

##### Returns:

<div class="param-desc">

matchingContacts Contacts matching the given name. The format is:
Contacts.

</div>

 Type 
:   <span class="param-type">array</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>removeContact(guid) {#removeContact .name}

Remove a contact from the Graph Connector.

<div class="description">

Remove a contact from the Graph Connector.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `guid`                   | <span                    | GUID of the user to be   |
|                          | class="param-type">strin | removed.                 |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>removeUserID(userID) {#removeUserID .name}

Removes a UserID for the user.

<div class="description">

Removes a UserID for the user.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `userID`                 | <span                    | The UserID to remove.    |
|                          | class="param-type">strin |                          |
|                          | g</span>                 |                          |
+--------------------------+--------------------------+--------------------------+

------------------------------------------------------------------------

#### <span class="type-signature"></span>signGlobalRegistryRecord() {#signGlobalRegistryRecord .name}

SignGenerates a public/private key pair from a given mnemonic.

<div class="description">

SignGenerates a public/private key pair from a given mnemonic.

</div>

##### Returns:

<div class="param-desc">

JWT JSON Web Token ready to commit to Global Registry.

</div>

 Type 
:   <span class="param-type">string</span>

------------------------------------------------------------------------

#### <span class="type-signature"></span>useGUID(mnemonicAndSalt) {#useGUID .name}

Generates a public/private key pair from a given mnemonic (16 words).

<div class="description">

Generates a public/private key pair from a given mnemonic (16 words).
Expects a string containing 16 words seperated by single spaces.

</div>

##### Parameters:

+--------------------------+--------------------------+--------------------------+
| Name                     | Type                     | Description              |
+==========================+==========================+==========================+
| `mnemonicAndSalt`        | <span                    | A string of 16 words.    |
|                          | class="param-type">strin |                          |
|                          | g</span>                 |                          |
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
