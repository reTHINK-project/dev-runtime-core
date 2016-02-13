</div>

<div class="self-detail detail">

IdentityModule {#identitymodule data-ice="name"}
==============

<div class="description" data-ice="description">

The Identity Module (Id Module) is the component responsible for
handling the user identity and the association of this identity with the
Hyperty instances, in order to make Hyperty instances identifiable. The
identity in the reTHINK project is not fixed to a unique Identity
Service Provider, but obtained through several different Identity
sources. With this approach, the Id Module provides to the user the
option to choose the preferred method for authentication. This module
will thus able to support multiple Identity acquisition methods, such as
OpenID connect 1.0, Kerberos System, or authentication through smart
cards. For example, a user with a Google account can use the Google as
an Identity Provider to provide Identity Tokens, which can be used by
the Identity Module to associate it with a Hyperty instance. The
Identity Module uses a node package, the HelloJS, which is a client-side
JavaScript API for authentication that facilitates the requests for the
OpenID connect protocol. This method allows for some abstraction when
making requests for different Identity Providers, such as OpenID connect
used by Google, Facebook, Microsoft, for example. When a request for a
user identity is made using the method loginWithRP(identifier, scope),
this method will analyse the Identity Provider chosen to obtain an
identity and will use the HelloJS node package with the selected
Identity Provider and identity scope. After the HelloJS request for an
Access Token to the Identity Providers, the user will be prompted to
authenticate towards the Identity Provider. Upon receiving the Access
Token, this token is validated with a RESTful web service request to an
endpoint on the Identity Provider Authorization Server, and after the
validation is done, an ID token is obtained with the information
according to the scope required. This ID token is then preserved in this
module that can obtained through the getIdentities() and is passed as
return value of the loginWithRP function. The methods generateAssertion
and validateAssertion have not yet been developed.

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
data-ice="name"><span>[constructor](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-constructor-constructor)</span></span>

</div>

<div>

<div data-ice="description">

This is the constructor to initialise the Identity Module it does not
require any input.

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
data-ice="name"><span>[generateAssertion](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-generateAssertion)</span></span><span
data-ice="signature">(contents: <span>DOMString</span>, origin:
<span>DOMString</span>, usernameHint: <span>DOMString</span>):
<span>IdAssertion</span></span>

</div>

<div>

<div data-ice="description">

Generates an Identity Assertion

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getAssertionTrustLevel](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-getAssertionTrustLevel)</span></span><span
data-ice="signature">(assertion: <span>DOMString</span>)</span>

</div>

<div>

<div data-ice="description">

Trust level evaluation of a received IdAssertion

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[getIdentities](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-getIdentities)</span></span><span
data-ice="signature">():
<span>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)</span>&lt;<span>Identities</span>&gt;</span>

</div>

<div>

<div data-ice="description">

Function to return all the identities registered within a session by a
user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[loginWithRP](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-loginWithRP)</span></span><span
data-ice="signature">(identifier: <span>Identifier</span>, scope:
<span>Scope</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Function to request an ID Token from a user.

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerIdentity](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-registerIdentity)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

Register a new Identity with an Identity Provider

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[registerWithRP](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-registerWithRP)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

In relation with a classical Relying Party: Registration

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[setHypertyIdentity](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-setHypertyIdentity)</span></span><span
data-ice="signature">()</span>

</div>

<div>

<div data-ice="description">

In relation with a Hyperty Instance: Associate identity

</div>

</div>

<span class="access" data-ice="access">public</span> <span
class="override" data-ice="override"></span>
<div>

<span
data-ice="name"><span>[validateAssertion](../../../class/src/identity/IdentityModule.js~IdentityModule.html#instance-method-validateAssertion)</span></span><span
data-ice="signature">(assertion: <span>DOMString</span>):
<span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span>

</div>

<div>

<div data-ice="description">

Function to validate an identity assertion generated previously.

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber36)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

This is the constructor to initialise the Identity Module it does not
require any input.

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">generateAssertion</span><span data-ice="signature">(contents: <span>DOMString</span>, origin: <span>DOMString</span>, usernameHint: <span>DOMString</span>): <span>IdAssertion</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber219)</span></span> </span> {#instance-method-generateAssertion data-ice="anchor"}

<div data-ice="description">

Generates an Identity Assertion

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params data-ice="title"}

Name
Type
Attribute
Description
contents
<span>DOMString</span>
contents

origin
<span>DOMString</span>
origin

usernameHint
<span>DOMString</span>
usernameHint

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>IdAssertion</span>             | IdAssertion                          |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getAssertionTrustLevel</span><span data-ice="signature">(assertion: <span>DOMString</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber241)</span></span> </span> {#instance-method-getAssertionTrustLevel data-ice="anchor"}

<div data-ice="description">

Trust level evaluation of a received IdAssertion

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-1 data-ice="title"}

Name
Type
Attribute
Description
assertion
<span>DOMString</span>
assertion

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">getIdentities</span><span data-ice="signature">(): <span>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)</span>&lt;<span>Identities</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber61)</span></span> </span> {#instance-method-getIdentities data-ice="anchor"}

<div data-ice="description">

Function to return all the identities registered within a session by a
user. These identities are returned in an array containing a JSON
package for each user identity.

</div>

<div data-ice="properties">

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Array](https://developer.mozi | Array Identities                     |
| lla.org/en-US/docs/Web/JavaScript/Re |                                      |
| ference/Global_Objects/Array)</span> |                                      |
| &lt;<span>Identities</span>&gt;      |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">loginWithRP</span><span data-ice="signature">(identifier: <span>Identifier</span>, scope: <span>Scope</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber76)</span></span> </span> {#instance-method-loginWithRP data-ice="anchor"}

<div data-ice="description">

Function to request an ID Token from a user. If no token exists, the
Identity Module will try to obtain one from an Identity Provider, and
the user will be asked to authenticate towards the Identity Provider.
The function returns a promise with a token containing the user
information.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-2 data-ice="title"}

Name
Type
Attribute
Description
identifier
<span>Identifier</span>
identifier

scope
<span>Scope</span>
scope

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise IDToken containing the user  |
| zilla.org/en-US/docs/Web/JavaScript/ | information                          |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber45)</span></span> </span> {#instance-method-registerIdentity data-ice="anchor"}

<div data-ice="description">

Register a new Identity with an Identity Provider

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerWithRP</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber52)</span></span> </span> {#instance-method-registerWithRP data-ice="anchor"}

<div data-ice="description">

In relation with a classical Relying Party: Registration

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">setHypertyIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber207)</span></span> </span> {#instance-method-setHypertyIdentity data-ice="anchor"}

<div data-ice="description">

In relation with a Hyperty Instance: Associate identity

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">validateAssertion</span><span data-ice="signature">(assertion: <span>DOMString</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber233)</span></span> </span> {#instance-method-validateAssertion data-ice="anchor"}

<div data-ice="description">

Function to validate an identity assertion generated previously. Returns
a promise with the result from the validation.

</div>

<div data-ice="properties">

<div data-ice="properties">

#### Params: {#params-3 data-ice="title"}

Name
Type
Attribute
Description
assertion
<span>DOMString</span>

</div>

</div>

<div class="return-params" data-ice="returnParams">

#### Return:

+--------------------------------------+--------------------------------------+
| <span>[Promise](https://developer.mo | Promise promise with the result from |
| zilla.org/en-US/docs/Web/JavaScript/ | the validation                       |
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
