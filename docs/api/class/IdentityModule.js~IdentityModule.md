<div class="self-detail detail">

IdentityModule {#identitymodule data-ice="name"}
==============

<div class="description" data-ice="description">

IdentityModule Initial specification: D4.1 The IdentityModule is a
component managing user Identity. It downloads, instantiates and manage
Identity Provider Proxy (IdP) for its own user identity or for external
user identity verification.

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

USER'S OWN IDENTITY

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

Generates an Identity Assertion for a call session

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

Find and return all available identities that can be associated to the
Hyperty Instance

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

In relation with a classical Relying Party: Login

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
data-ice="signature">(assertion: <span>DOMString</span>)</span>

</div>

<div>

<div data-ice="description">

Verification of a received IdAssertion validity

</div>

</div>

</div>

<div data-ice="constructorDetails">

Public Constructors {#public-constructors data-ice="title"}
-------------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">constructor</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber18)</span></span> </span> {#instance-constructor-constructor data-ice="anchor"}

<div data-ice="description">

USER'S OWN IDENTITY

</div>

<div data-ice="properties">

</div>

</div>

</div>

<div data-ice="methodDetails">

Public Methods {#public-methods data-ice="title"}
--------------

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">generateAssertion</span><span data-ice="signature">(contents: <span>DOMString</span>, origin: <span>DOMString</span>, usernameHint: <span>DOMString</span>): <span>IdAssertion</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber195)</span></span> </span> {#instance-method-generateAssertion data-ice="anchor"}

<div data-ice="description">

Generates an Identity Assertion for a call session

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">getAssertionTrustLevel</span><span data-ice="signature">(assertion: <span>DOMString</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber215)</span></span> </span> {#instance-method-getAssertionTrustLevel data-ice="anchor"}

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">getIdentities</span><span data-ice="signature">(): <span>[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)</span>&lt;<span>Identities</span>&gt;</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber42)</span></span> </span> {#instance-method-getIdentities data-ice="anchor"}

<div data-ice="description">

Find and return all available identities that can be associated to the
Hyperty Instance

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

### <span class="access" data-ice="access">public</span> <span data-ice="name">loginWithRP</span><span data-ice="signature">(identifier: <span>Identifier</span>, scope: <span>Scope</span>): <span>[Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)</span></span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber53)</span></span> </span> {#instance-method-loginWithRP data-ice="anchor"}

<div data-ice="description">

In relation with a classical Relying Party: Login

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
| <span>[Promise](https://developer.mo | Promise IDToken                      |
| zilla.org/en-US/docs/Web/JavaScript/ |                                      |
| Reference/Global_Objects/Promise)</s |                                      |
| pan>                                 |                                      |
+--------------------------------------+--------------------------------------+

<div data-ice="returnProperties">

</div>

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber27)</span></span> </span> {#instance-method-registerIdentity data-ice="anchor"}

<div data-ice="description">

Register a new Identity with an Identity Provider

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">registerWithRP</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber34)</span></span> </span> {#instance-method-registerWithRP data-ice="anchor"}

<div data-ice="description">

In relation with a classical Relying Party: Registration

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">setHypertyIdentity</span><span data-ice="signature">()</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber184)</span></span> </span> {#instance-method-setHypertyIdentity data-ice="anchor"}

<div data-ice="description">

In relation with a Hyperty Instance: Associate identity

</div>

<div data-ice="properties">

</div>

</div>

<div class="detail" data-ice="detail">

### <span class="access" data-ice="access">public</span> <span data-ice="name">validateAssertion</span><span data-ice="signature">(assertion: <span>DOMString</span>)</span> <span class="right-info"> <span data-ice="source"><span>[source](../../../file/src/identity/IdentityModule.js.html#lineNumber207)</span></span> </span> {#instance-method-validateAssertion data-ice="anchor"}

<div data-ice="description">

Verification of a received IdAssertion validity

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
assertion

</div>

</div>

</div>

</div>

</div>

Generated by [ESDoc<span
data-ice="esdocVersion">(0.4.4)</span>](https://esdoc.org)
