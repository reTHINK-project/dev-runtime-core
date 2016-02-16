</div>

<div class="self-detail detail">

GraphConnector {#graphconnector data-ice="name"}
==============

<div class="description" data-ice="description">

The Graph Connector contains the contact list/address book.

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
data-ice="name"><span>[constructor](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-constructor-constructor)</span></span><span
data-ice="signature">(HypertyRuntimeURL:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
MessageBus:
<span>[messageBus](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-get-messageBus)</span>)</span>

</div>

<div>

<div data-ice="description">

Constructs a new and empty Graph Connector.

</div>

</div>

</div>

<div data-ice="memberSummary">

Member Summary
--------------

Public Members
<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contacts](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-contacts)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[contactsBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-contactsBloomFilter1Hop)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[globalRegistryRecord](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-globalRegistryRecord)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[groups](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-groups)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[lastCalculationBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-member-lastCalculationBloomFilter1Hop)</span></span><span
data-ice="signature">: <span>\*</span></span>

</div>

<div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">get</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[messageBus](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-get-messageBus)</span></span><span
data-ice="signature">(messageBus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Returns the MessageBus.

</div>

</div>

<span class="access" data-ice="access">public</span> <span class="kind"
data-ice="kind">set</span> <span class="override"
data-ice="override"></span>
<div>

<span
data-ice="name"><span>[messageBus](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-set-messageBus)</span></span><span
data-ice="signature">(messageBus:
<span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>):
<span>\*</span></span>

</div>

<div>

<div data-ice="description">

Sets the MessageBus.

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
data-ice="name"><span>[addContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-addContact)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
firstName:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>,
lastname:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Add a contact to the Graph Connector.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[addUserID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-addUserID)</span></span><span
data-ice="signature">(userID:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Adds a UserID for the user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[calculateBloomFilter1Hop](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-calculateBloomFilter1Hop)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

Calculates the Bloom filter containing all non-private contacts.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[checkGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-checkGUID)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>array</span></span>

</div>

<div>

<div data-ice="description">

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[generateGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-generateGUID)</span></span><span
data-ice="signature">():
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

<div data-ice="description">

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-getContact)</span></span><span
data-ice="signature">(name:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>array</span></span>

</div>

<div>

<div data-ice="description">

Gets contacts by name.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[queryGlobalRegistry](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-queryGlobalRegistry)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Queries the Global Registry for a given GUID.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeContact](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-removeContact)</span></span><span
data-ice="signature">(guid:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Remove a contact from the Graph Connector.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[removeUserID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-removeUserID)</span></span><span
data-ice="signature">(userID:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span>

</div>

<div>

<div data-ice="description">

Removes a UserID for the user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[sendGlobalRegistryRecord](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-sendGlobalRegistryRecord)</span></span><span
data-ice="signature">(jwt:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>Propmise</span></span>

</div>

<div>

<div data-ice="description">

Takes the Global Registry Record as a signed JWT and sends it to the
Global Registry via the MessageBus.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[signGlobalRegistryRecord](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-signGlobalRegistryRecord)</span></span><span
data-ice="signature">():
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span>

</div>

<div>

<div data-ice="description">

SignGenerates a public/private key pair from a given mnemonic.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[useGUID](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-method-useGUID)</span></span><span
data-ice="signature">(mnemonicAndSalt:
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Generates a public/private key pair from a given mnemonic (16 words).

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span><span data-ice="signature">(HypertyRuntimeURL: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, MessageBus: <span>[messageBus](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-get-messageBus)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber23)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

Constructs a new and empty Graph Connector.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
HypertyRuntimeURL
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The Hyperty Runtime URL.

MessageBus
<span>[messageBus](../../../class/src/graphconnector/GraphConnector.js~GraphConnector.html#instance-get-messageBus)</span>
The Message Bus.

</div>

</div>

</div>

</div>

<div data-ice="memberDetails">

Public Members {#public-members data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">contacts</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber24)</span></span> </span> {#instance-member-contacts data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">contactsBloomFilter1Hop</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber368)</span></span> </span> {#instance-member-contactsBloomFilter1Hop data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">globalRegistryRecord</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber27)</span></span> </span> {#instance-member-globalRegistryRecord data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">groups</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber30)</span></span> </span> {#instance-member-groups data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">lastCalculationBloomFilter1Hop</span><span data-ice="signature">: <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber25)</span></span> </span> {#instance-member-lastCalculationBloomFilter1Hop data-ice="anchor"}

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">get</span> <span data-ice="name">messageBus</span><span data-ice="signature">(messageBus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber43)</span></span> </span> {#instance-get-messageBus data-ice="anchor"}

<div data-ice="description">

Returns the MessageBus.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span class="kind" data-ice="kind">set</span> <span data-ice="name">messageBus</span><span data-ice="signature">(messageBus: <span>[MessageBus](../../../class/src/bus/MessageBus.js~MessageBus.html)</span>): <span>\*</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber51)</span></span> </span> {#instance-set-messageBus data-ice="anchor"}

<div data-ice="description">

Sets the MessageBus.

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addContact</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, firstName: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>, lastname: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber331)</span></span> </span> {#instance-method-addContact data-ice="anchor"}

<div data-ice="description">

Add a contact to the Graph Connector.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the new contact.

firstName
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
First name of the new contact.

lastname
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
Last name of the new contact.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">addUserID</span><span data-ice="signature">(userID: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber300)</span></span> </span> {#instance-method-addUserID data-ice="anchor"}

<div data-ice="description">

Adds a UserID for the user.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
userID
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The UserID for a Domain Registry to add for the user.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">calculateBloomFilter1Hop</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber358)</span></span> </span> {#instance-method-calculateBloomFilter1Hop data-ice="anchor"}

<div data-ice="description">

Calculates the Bloom filter containing all non-private contacts.

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">checkGUID</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>array</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber393)</span></span> </span> {#instance-method-checkGUID data-ice="anchor"}

<div data-ice="description">

Checks, if the given GUID is known and returns a list of contacs that
are direct connections as well as a list of contacts that (most likely)
know the given contact.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the contact to look for.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>array</span>                   | relatedContacts List of related      |
|                                      | direct contacts and of related       |
|                                      | friends-of-friends contacts.The      |
|                                      | format is:                           |
|                                      | RelatedContacts&lt;Direct&lt;GraphCo |
|                                      | nnectorContactData&gt;,FoF&lt;GraphC |
|                                      | onnectorContactData&gt;&gt;.         |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">generateGUID</span><span data-ice="signature">(): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber59)</span></span> </span> {#instance-method-generateGUID data-ice="anchor"}

<div data-ice="description">

Generates a GUID and returns a mnemonic from which the GUID can be
re-created later.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | mnemonic A string with 16 words.     |
| illa.org/en-US/docs/Web/JavaScript/R |                                      |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getContact</span><span data-ice="signature">(name: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>array</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber377)</span></span> </span> {#instance-method-getContact data-ice="anchor"}

<div data-ice="description">

Gets contacts by name.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-4 data-ice="title"}

Name
Type
Attribute
Description
name
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
First or last name to look for in the contact list.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>array</span>                   | matchingContacts Contacts matching   |
|                                      | the given name. The format is:       |
|                                      | Contacts&lt;GraphConnectorContactDat |
|                                      | a&gt;.                               |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">queryGlobalRegistry</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber254)</span></span> </span> {#instance-method-queryGlobalRegistry data-ice="anchor"}

<div data-ice="description">

Queries the Global Registry for a given GUID. Returns a Graph Connector
Contact Data as a Promise.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-5 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The GUID to query the Global Registry for

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise Graph Connector Contact Data |
| zilla.org/en-US/docs/Web/JavaScript/ | containing UserIDs.                  |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeContact</span><span data-ice="signature">(guid: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber343)</span></span> </span> {#instance-method-removeContact data-ice="anchor"}

<div data-ice="description">

Remove a contact from the Graph Connector.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-6 data-ice="title"}

Name
Type
Attribute
Description
guid
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
GUID of the user to be removed.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">removeUserID</span><span data-ice="signature">(userID: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber317)</span></span> </span> {#instance-method-removeUserID data-ice="anchor"}

<div data-ice="description">

Removes a UserID for the user.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-7 data-ice="title"}

Name
Type
Attribute
Description
userID
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The UserID to remove.

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">sendGlobalRegistryRecord</span><span data-ice="signature">(jwt: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>Propmise</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber214)</span></span> </span> {#instance-method-sendGlobalRegistryRecord data-ice="anchor"}

<div data-ice="description">

Takes the Global Registry Record as a signed JWT and sends it to the
Global Registry via the MessageBus. Returns the response code of the
REST-interface of the Global Registry as a Promise.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-8 data-ice="title"}

Name
Type
Attribute
Description
jwt
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
The Global Registry Record as a signed JWT.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>Propmise</span>                | Promise Response Code from Global    |
|                                      | Registry.                            |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">signGlobalRegistryRecord</span><span data-ice="signature">(): <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber198)</span></span> </span> {#instance-method-signGlobalRegistryRecord data-ice="anchor"}

<div data-ice="description">

SignGenerates a public/private key pair from a given mnemonic.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[string](https://developer.moz | JWT JSON Web Token ready to commit   |
| illa.org/en-US/docs/Web/JavaScript/R | to Global Registry.                  |
| eference/Global_Objects/String)</spa |                                      |
| n>                                   |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">useGUID</span><span data-ice="signature">(mnemonicAndSalt: <span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/graphconnector/GraphConnector.js.html#lineNumber92)</span></span> </span> {#instance-method-useGUID data-ice="anchor"}

<div data-ice="description">

Generates a public/private key pair from a given mnemonic (16 words).
Expects a string containing 16 words seperated by single spaces.
Retrieves data from the Global Registry.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-9 data-ice="title"}

Name
Type
Attribute
Description
mnemonicAndSalt
<span>[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)</span>
A string of 16 words.

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise Global Registry Record.      |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
